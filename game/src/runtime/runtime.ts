/**
 * The Game Runtime — a thin state-owning shell.
 *
 * Authority: Wayfinder gate 02 § 6. The surface is exactly three members:
 *
 *     currentActor  -> ActorId
 *     view(viewerId) -> MatchView     // viewer-safe; blurred here, once
 *     submit(intent) -> GameEvent[]   // validate -> resolve -> advance
 *
 * and nothing more. There is deliberately **no snapshot API** (it would hand
 * truth to a caller and void the blur seam) and **no subscription API**
 * (callers pump; `submit` returns the events).
 *
 * Gate 02 also fixes that internal decomposition is an internal seam: this may
 * implement transitions as pure functions behind the shell, and that stays an
 * implementation choice rather than a caller contract.
 */

import { resolveBattle, type SideBattleOutcome } from '../domain/battle.js';
import { capitalChoiceRefusal } from '../domain/capital-choice.js';
import {
  battleInputOf,
  bodiesLost,
  engagementsOf,
  type BorderFront,
  type Engagement,
  type EngagementParty,
  type SectorStanding,
} from '../domain/engagement.js';
import {
  allocationRefusal,
  isOrderKey,
  lockRefusal,
  recruitmentOrderKeyOf,
  sectorAssignmentRefusal,
  spentOf,
  TURN_COMMITMENT_BUDGET,
  type CommitmentContext,
} from '../domain/commitment.js';
import {
  forceLimitOf,
  GARRISON_PER_BORDER_SECTOR,
  garrisonHeadroomOf,
  NOTHING_RIPENING,
  incomeOf,
  fullyRipened,
  registerOf,
  START_FIELD_FRACTION,
  startingTreasuryOf,
} from '../domain/economy.js';
import {
  activateReadyCohorts,
  activateReadyGarrisonCohorts,
  accumulateOrigins,
  apportionExact,
  apportionOrigins,
  availableCiviliansByOrigin,
  fieldOf,
  mapCohortFatigue,
  mergeDetachments,
  mergeDetachmentsRefusal,
  menOf,
  servingByOrigin,
  splitDetachment,
  splitDetachmentRefusal,
  subtractOrigins,
  transferToGarrisonRefusal,
  withdrawFromDetachment,
  type Detachment,
  type ForceCohort,
  type GarrisonForce,
  type OriginComposition,
  type PendingCohort,
  type PostureSite,
} from '../domain/force.js';
import { battleAccrual, turnUpkeep } from '../domain/fatigue.js';
import { contestedFronts } from '../domain/fronts.js';
import {
  advanceOneTurn,
  buildMovementGraph,
  minimumCostRoute,
  movementOrderRefusal,
  musterHexOf,
  FORCED_MARCH_EXTRA_CAP,
  MARCH_FATIGUE_PER_HEX,
  MARCH_SPEED,
  type MovementApproach,
} from '../domain/movement.js';
import {
  compareRecruitmentRequests,
  recruitmentRequestRefusal,
  settleRecruitmentBatch,
  type RecruitmentRequest,
} from '../domain/recruitment.js';
import { frontsOf, garrisonOf, holdingsOf, ownerOfSector } from '../domain/state.js';
import type { MatchState, MobilizationTrace, Realm, RealmForces } from '../domain/state.js';
import { readFronts, revealTurn, type RevealedTurn } from '../domain/turn.js';
import { project } from '../projection/project.js';
import { drawPartition } from '../world/partition.js';
import { loadWorld } from '../world/load.js';
import { edgeKey, hexKey } from '../world/schema.js';
import type { HexPosition, SectorId, TerrainLayer } from '../world/schema.js';
import { createRng } from './rng.js';
import type {
  ActorId,
  Clock,
  GameEvent,
  Intent,
  MatchConfig,
  MatchView,
  TurnTier,
  ViewerId,
} from './types.js';

interface RecruitmentAffiliation {
  readonly actor: ActorId;
  readonly requestId: string;
  readonly recruitDetachmentId: string;
  readonly hostDetachmentId: string;
  readonly destination: HexPosition;
}

/**
 * How well every force is fed in this slice: completely.
 *
 * **Not a dial.** It is a consequence of scope (ticket 06b, RE-CUT 2026-07-28):
 * what interrupts supply is a *plan* — Supply Interdiction, Scorched Earth — and
 * the plan layer is not built, so supply cannot be cut. The supply **predicate**
 * (what a force must be connected to, over which graph) is the supply design
 * pass's agenda, registered as R16 in `docs/DESIGN-RISKS.md`; it is not decided
 * here and must not be answered in passing.
 *
 * The honest consequence, recorded so nobody reads more into the ledger than it
 * does: **wear is a self-managed marching tax in the first slice**, not something
 * an opponent can attack, because both recovery-denial tools are plan-layer.
 */
const FULLY_SUPPLIED = 1;

/**
 * The ground's gate on recovery: open everywhere, for the same reason.
 *
 * Ash ground — a province burned so a force cannot dig in — is Scorched Earth's
 * effect, and Scorched Earth is a plan too. Nothing burns yet, so nothing denies
 * recovery. `fatigue.ts` gates the wear ledger with this and never substance,
 * which is what keeps starvation supply-exclusive.
 */
const UNBURNED_GROUND = 1;

/**
 * One combat-ready formation standing on a sector: a field detachment, or — when
 * `detachmentId` is null — the sector's own shield.
 *
 * `wear` is the **ledger**, not the effectiveness multiplier; the adapter converts.
 */
interface SectorFormation {
  readonly actor: ActorId;
  readonly detachmentId: string | null;
  readonly men: number;
  readonly wear: number;
}

/** One sector changing hands, as ADR 0044's transfer reads it. */
interface SectorCapture {
  readonly sector: SectorId;
  readonly taker: ActorId;
  readonly loser: ActorId;
}

/**
 * A formation's key inside one engagement's apportionment. Namespaced so a shield
 * and a detachment can never collide, whatever a detachment comes to be called.
 */
const formationKey = (formation: SectorFormation): string =>
  formation.detachmentId === null ? 'shield' : `field:${formation.detachmentId}`;

/** A clock that refuses to be read. Rules must never need one (ADR 0040). */
const NO_CLOCK: Clock = {
  now(): number {
    throw new Error(
      'No clock was injected. Rules must not read the wall clock (ADR 0040); ' +
        'if a caller genuinely needs time, inject it through MatchConfig.clock.',
    );
  },
};

export class Runtime {
  /** Truth. `#`-private, so it is unreachable from outside even at runtime. */
  readonly #state: MatchState;
  readonly #clock: Clock;
  readonly #recruitmentAffiliations: RecruitmentAffiliation[] = [];
  /**
   * Which detachments actually moved during this turn's payoff.
   *
   * Read by upkeep for one reason: WB-M① dial 9 — *does recovery additionally
   * require standing still* — is recorded **HELD**, so today it changes nothing.
   * Passing the real fact anyway is what makes answering it a value change at the
   * birthplace rather than a re-plumbing here (ticket 06b item 6).
   */
  readonly #marchedThisTurn = new Set<string>();
  /**
   * The sector boundary each detachment crossed during this turn's payoff.
   *
   * The **approach arc** of ADR 0046 item 3, recorded here because WM-⑤'s axis is
   * *who entered this sector this turn* rather than attacker/defender: an invader
   * always has one, a defender that reinforced this turn does too, a defender that
   * was already standing there does not, and a garrison never does — nothing
   * marches one, and `GarrisonForce` carries no wear ledger to march it with (06b).
   * Absence from this map is therefore a real answer, not a missing lookup.
   */
  readonly #approachThisTurn = new Map<string, MovementApproach>();

  private constructor(state: MatchState, clock: Clock) {
    this.#state = state;
    this.#clock = clock;
  }

  /**
   * Opens a match: validate the world, draw the partition, seat the actors, and
   * stop at the capital-selection prompt.
   *
   * Rejects rather than repairs at every step. A bad config is a caller bug and
   * a bad world is an authoring error; a Runtime that quietly substituted a
   * default would make the seed contract — equal inputs, equal match — untrue,
   * and would hide the error behind a playable-looking board.
   */
  static open(config: MatchConfig): Runtime {
    const { world, seed, actors } = config;

    if (typeof seed !== 'string' || seed.length === 0) {
      throw new Error('MatchConfig.seed must be a non-empty string; seed is injected, never ambient (ADR 0040).');
    }
    if (!Array.isArray(actors) || actors.length !== 2) {
      throw new Error(
        `A duel seats exactly two actors; got ${Array.isArray(actors) ? actors.length : 'none'} ` +
          '(ADR 0042 — the match is 1v1 and ends at a capital fall).',
      );
    }
    if (new Set(actors).size !== actors.length) {
      throw new Error('MatchConfig.actors must be unique.');
    }

    // Fail-closed. `loadWorld` throws `WorldLoadError` listing every finding.
    const loadedWorld = loadWorld(world);
    // One stack, one namespace (D6.3), and since ADR 0046 item 4 sector ids share
    // it with the order kinds. `allocationRefusal` resolves a sector key first, so
    // a collision would silently turn an order into a battle commitment; the check
    // belongs here rather than in `loadWorld`, which knows nothing of orders.
    const colliding = Object.keys(loadedWorld.artifact.sectors).filter(isOrderKey);
    if (colliding.length > 0) {
      throw new Error(
        `Sector ids ${colliding.join(', ')} collide with the order-key namespace; ` +
          'the shared 행동력 stack cannot tell them apart.',
      );
    }
    const rng = createRng(seed);
    const partition = drawPartition(loadedWorld, rng);

    const realms: Record<ActorId, Realm> = {};
    const homeland: Record<SectorId, ActorId> = {};
    actors.forEach((actor, side) => {
      realms[actor] = {
        actor,
        regions: partition.regions[side]!,
        sectors: [...partition.sectors[side]!],
      };
      // The opening partition *is* the opening homeland map. It is not frozen:
      // **ADR 0044** (2026-07-26) amends OG-③ so limbo is the interval before
      // integration rather than a terminal state, and ticket 06d is the writer.
      // An earlier version of this comment said conquered ground stays in limbo
      // permanently — it landed hours before ADR 0044 did, on the same day, and
      // nobody returned. See `docs/SYNC-DEBT.md`.
      for (const sector of realms[actor]!.sectors) homeland[sector] = actor;
    });

    const { forces, garrisons } = Runtime.#seatSubstance(loadedWorld.artifact, actors, realms);

    const state: MatchState = {
      world: { worldId: loadedWorld.artifact.worldId, revision: loadedWorld.artifact.revision },
      loadedWorld,
      movementGraph: buildMovementGraph(loadedWorld.artifact),
      seed,
      rng,
      actors: [...actors],
      realms,
      partitionCandidates: partition.candidateCount,
      phase: 'capital-selection',
      capitals: {},
      homeland,
      // Empty, and honestly so: at the opening every realm stands on its own ground,
      // which is already whole. The first entry appears when the first capture
      // integrates.
      ripening: {},
      forces,
      garrisons,
      turn: 1,
      commitments: {},
      recruitmentOrders: {},
      mobilizationTraces: [],
      sectorAssignments: {},
      turnLocks: [],
    };

    return new Runtime(state, config.clock ?? NO_CLOCK);
  }

  /**
   * The armed peace both realms wake up in — M13a's start-state coordinates,
   * applied to the drawn partition.
   *
   * Nothing is authored: the world artifact ships every sector at `garrison: 0`,
   * so a realm's opening substance is derived here from sealed values and the
   * land it drew. **f₀ = 0.5** puts the field army at half its land-derived
   * ceiling, **g₀ = 1.0** mans every border shield at cap, and the register is
   * land-derived once (MT-②) and a stock from then on.
   *
   * What is deliberately absent: the **capital guard**. Its *magnitude* is settled —
   * **CP-⑤** (2026-07-31) re-cut CP-① item 2's coefficient to 가안 **2,500/pop**, and
   * `MAGNITUDE.md`'s flat `capitalGarrison 1500` turned out never to have been a seal.
   * Placing the guard is **ticket 07's**, together with the ceiling it needs:
   * `garrisonHeadroomOf` is uniform at `GARRISON_PER_BORDER_SECTOR`, while CP-① item 2
   * gives the guard its **own local ceiling** (ADR 0014 keeps garrison ceilings local),
   * and at 2,500/pop the guard reaches 6,000 on this board's largest sector.
   *
   * **Where its bodies come from is settled too, and it is not the local rule below.**
   * CP-① item 2 calls the guard *register-backed*, and since 2026-07-31 the register is
   * **1,800/pop stored per sector** (MT-② amended, ADR 0047). Seating the guard the way
   * the loop below seats a border shield ("drawn from the ground it stands on") makes
   * `availableCiviliansByOrigin` throw at **every** legal capital: measured over 840
   * capital candidates, the highest coefficient a sector can back from its own register
   * is 1,453–1,490, against CP-② item 7's floor of >1,800. The two never overlap,
   * because the opening field army apportioned below already draws ~18% of every
   * sector's register.
   *
   * **CP-⑥** (2026-08-01) therefore apportions the guard's origins **across the realm**,
   * the rule ADR 0047 item 5 already states for the opening field army rather than the
   * one it states for garrisons — 0047's header carries the amendment stamp. So the
   * guard reuses `apportionOrigins` over `remaining` below; it does not get its own
   * seating rule, and it must not be exempted from the register.
   */
  static #seatSubstance(
    artifact: MatchState['loadedWorld']['artifact'],
    actors: readonly ActorId[],
    realms: Readonly<Record<ActorId, Realm>>,
  ): { forces: Record<ActorId, RealmForces>; garrisons: Record<SectorId, GarrisonForce> } {
    // A border sector is one standing on a contested edge — the same reading the
    // turn loop calls a front, asked of the opening board. `contestedFronts` takes
    // the owner lookup as a parameter precisely so this can reuse `ownerOfSector`
    // rather than grow a fourth copy of that closure (see `domain/state.ts`).
    const seated = { actors, realms };
    const garrisons: Record<SectorId, GarrisonForce> = {};
    for (const front of contestedFronts(artifact.edges, (sector) => ownerOfSector(seated, sector))) {
      for (const sectorId of front.sectors) {
        if (garrisons[sectorId] !== undefined) continue;
        // A shield is drawn from the ground it stands on — ADR 0045 item 5 at the
        // sector grain the 2026-07-31 ruling moved origin to. It said "containing
        // province"; the containing sector is the same statement one grain finer,
        // and it is the grain the shield's own local cap (M13a) already used.
        garrisons[sectorId] = {
          ready: { [sectorId]: GARRISON_PER_BORDER_SECTOR },
          pending: [],
        };
      }
    }

    const forces: Record<ActorId, RealmForces> = {};
    for (const actor of actors) {
      const held = realms[actor]!.sectors;
      // One entry per held sector, each its own land-derived reading. No province
      // grouping: MT-②'s derivation reads a sector field, so grouping first and
      // summing second is what discarded the variation (2026-07-31).
      const registers: Record<SectorId, number> = {};
      for (const sectorId of [...held].sort()) {
        registers[sectorId] = registerOf(artifact.sectors, [sectorId]);
      }

      const openingGarrisonOrigins: Record<SectorId, number> = {};
      for (const sectorId of held) {
        const garrison = garrisons[sectorId];
        if (garrison !== undefined) accumulateOrigins(openingGarrisonOrigins, garrison.ready);
      }
      const remaining: Record<SectorId, number> = {};
      for (const sectorId of Object.keys(registers).sort()) {
        remaining[sectorId] = registers[sectorId]! - (openingGarrisonOrigins[sectorId] ?? 0);
        if (remaining[sectorId]! < 0) {
          throw new Error(`Opening garrison exceeds ${sectorId}'s living register.`);
        }
      }
      const openingFieldMen = Math.floor(
        forceLimitOf(artifact.sectors, held, NOTHING_RIPENING) * START_FIELD_FRACTION,
      );
      const openingField: ForceCohort = {
        origins: apportionOrigins(openingFieldMen, remaining),
        fatigue: 0,
      };
      if (menOf(openingField.origins) !== openingFieldMen) {
        throw new Error(`Opening field allocation for ${actor} does not conserve men.`);
      }

      forces[actor] = {
        treasury: startingTreasuryOf(incomeOf(artifact.sectors, held, NOTHING_RIPENING)),
        registers,
        openingField,
        detachments: [],
        nextDetachmentOrdinal: 1,
      };
    }

    return { forces, garrisons };
  }

  /** Consume both setup-only cohorts together at the simultaneous capital reveal. */
  #placeOpeningFields(): void {
    const state = this.#state;
    for (const actor of state.actors) {
      const forces = state.forces[actor]!;
      const openingField = forces.openingField;
      if (openingField === null) continue;
      const capital = state.capitals[actor]!;
      const ordinal = forces.nextDetachmentOrdinal;
      forces.nextDetachmentOrdinal += 1;
      forces.detachments.push({
        id: `detachment:${actor}:${ordinal}`,
        position: musterHexOf(state.loadedWorld.artifact, capital),
        ready: openingField,
        pending: [],
        movement: null,
      });
      forces.openingField = null;
    }
  }

  /**
   * Gate 02 § 6's sealed member, **read as the current phase** (ruling R8, SEALED
   * 2026-07-25) — what may be submitted now, rather than whose move it is.
   *
   * A simultaneous turn has no single current actor: both realms are legal callers
   * at the same moment, and legality is "has this realm locked this turn / is the
   * commit window open". Gate 02's guarantee — the *Runtime*, not the caller,
   * decides what is legal — never depended on alternation, so the member survives
   * with its name, its type, and its purpose intact.
   */
  get currentActor(): ActorId {
    return this.#state.phase;
  }

  /** The viewer-safe projection. Blurred here, once. */
  view(viewerId: ViewerId): MatchView {
    if (viewerId !== 'observer' && !this.#state.actors.includes(viewerId)) {
      throw new Error(`Unknown viewer "${viewerId}".`);
    }
    return project(this.#state, viewerId);
  }

  /**
   * Validate -> resolve -> advance, returning what happened.
   *
   * An invalid intent is rejected **without a state transition** and with a
   * reportable reason (gate 02 § 6, SPEC US16) — it returns a rejection event
   * rather than throwing, so a caller (including a bot) is told why in the same
   * shape a success arrives in.
   */
  submit(intent: Intent): GameEvent[] {
    if (!intent || typeof intent.kind !== 'string' || intent.kind.length === 0) {
      return [this.#reject(intent, 'An intent must carry a non-empty kind.')];
    }
    if (!this.#state.actors.includes(intent.actor)) {
      return [this.#reject(intent, `"${String(intent.actor)}" is not an actor in this match.`)];
    }

    if (intent.kind === 'choose-capital') {
      return this.#chooseCapital(intent.actor, (intent as { sector?: SectorId }).sector);
    }
    if (intent.kind === 'allocate-commitment') {
      const { sector, chips, detachmentIds } = intent as {
        sector?: unknown;
        chips?: unknown;
        detachmentIds?: unknown;
      };
      return this.#allocateCommitment(intent.actor, sector, chips, detachmentIds);
    }
    if (intent.kind === 'allocate-order') {
      return [this.#reject(
        intent,
        'Scalar recruitment is retired; submit allocate-recruitment with a controlled sector.',
      )];
    }
    if (intent.kind === 'allocate-recruitment') {
      const {
        requestId,
        sectorId,
        commit,
        posture,
        destinationHex,
        joinDetachmentId,
        forcedMarch,
      } = intent as {
        requestId?: unknown;
        sectorId?: unknown;
        commit?: unknown;
        posture?: unknown;
        destinationHex?: unknown;
        joinDetachmentId?: unknown;
        forcedMarch?: unknown;
      };
      return this.#allocateRecruitment(
        intent.actor,
        requestId,
        sectorId,
        commit,
        posture,
        destinationHex,
        joinDetachmentId,
        forcedMarch,
      );
    }
    if (intent.kind === 'move-detachment') {
      const { detachmentId, destinationHex, forcedMarch } = intent as {
        detachmentId?: unknown;
        destinationHex?: unknown;
        forcedMarch?: unknown;
      };
      return this.#moveDetachment(intent.actor, detachmentId, destinationHex, forcedMarch);
    }
    if (intent.kind === 'split-detachment') {
      const { detachmentId, men } = intent as { detachmentId?: unknown; men?: unknown };
      return this.#splitDetachment(intent.actor, detachmentId, men);
    }
    if (intent.kind === 'merge-detachments') {
      const { detachmentIds } = intent as { detachmentIds?: unknown };
      return this.#mergeDetachments(intent.actor, detachmentIds);
    }
    if (intent.kind === 'transfer-to-garrison') {
      const { detachmentId, men } = intent as { detachmentId?: unknown; men?: unknown };
      return this.#transferToGarrison(intent.actor, detachmentId, men);
    }
    // No `transfer-to-field` branch: it is HELD, so it falls through to the
    // unwired-intent rejection rather than doing half the job silently.
    if (intent.kind === 'lock-commitment') {
      return this.#lockCommitment(intent.actor);
    }

    return [
      this.#reject(intent, `No resolution is wired for intent kind "${intent.kind}" yet.`),
    ];
  }

  /** Replace a destination order; movement itself waits for simultaneous resolution. */
  #moveDetachment(
    actor: ActorId,
    detachmentId: unknown,
    destinationHex: unknown,
    forcedMarch: unknown,
  ): GameEvent[] {
    const state = this.#state;
    const intent = { kind: 'move-detachment', actor };
    const windowRefusal = lockRefusal(this.#commitmentContext(actor), actor);
    if (windowRefusal !== null) return [this.#reject(intent, windowRefusal)];

    const detachments = state.forces[actor]!.detachments;
    const refusal = movementOrderRefusal(
      state.movementGraph,
      detachments,
      detachmentId,
      destinationHex,
      forcedMarch,
    );
    if (refusal !== null) return [this.#reject(intent, refusal)];

    const detachment = detachments.find((candidate) => candidate.id === detachmentId)!;
    const destination = destinationHex as HexPosition;
    const route = minimumCostRoute(state.movementGraph, detachment.position, destination)!;
    detachment.movement = {
      destination: { ...destination },
      route,
      forcedMarch: forcedMarch as boolean,
    };
    return [this.#turnEvent('movement-planned', 'decision', {
      actor,
      detachmentId: detachment.id,
      destinationHex: { ...destination },
      forcedMarch,
    })];
  }

  /** Free formation changes share the decision window but spend no commitment. */
  #formationWindowRefusal(actor: ActorId): string | null {
    return lockRefusal(this.#commitmentContext(actor), actor);
  }

  #formationInputs(detachments: readonly Detachment[]): readonly {
    readonly id: string;
    readonly position: HexPosition;
    readonly men: number;
  }[] {
    return detachments.map((detachment) => ({
      id: detachment.id,
      position: detachment.position,
      men: menOf(detachment.ready.origins) + detachment.pending.reduce(
        (sum, cohort) => sum + menOf(cohort.origins),
        0,
      ),
    }));
  }

  /** Divide a detachment without changing its position, orders, fatigue, or total men. */
  #splitDetachment(actor: ActorId, detachmentId: unknown, men: unknown): GameEvent[] {
    const state = this.#state;
    const intent = { kind: 'split-detachment', actor };
    const windowRefusal = this.#formationWindowRefusal(actor);
    if (windowRefusal !== null) return [this.#reject(intent, windowRefusal)];

    const forces = state.forces[actor]!;
    const refusal = splitDetachmentRefusal(
      this.#formationInputs(forces.detachments),
      detachmentId,
      men,
    );
    if (refusal !== null) return [this.#reject(intent, refusal)];

    const sourceIndex = forces.detachments.findIndex((detachment) => detachment.id === detachmentId);
    const childId = `detachment:${actor}:${forces.nextDetachmentOrdinal}`;
    forces.nextDetachmentOrdinal += 1;
    const [retained, child] = splitDetachment(
      forces.detachments[sourceIndex]!,
      men as number,
      childId,
    );
    forces.detachments.splice(sourceIndex, 1, retained, child);
    return [this.#turnEvent('detachment-split', 'decision', {
      actor,
      detachmentId: retained.id,
      childDetachmentId: child.id,
      men,
    })];
  }

  /**
   * The sectors this actor controls, as a posture transfer reads them.
   *
   * One reader for the Runtime and the preview alike — `preview` builds the same
   * shape from a view, and two copies of "where may men change posture" is how the
   * two would come to answer it differently.
   */
  #postureSites(actor: ActorId): PostureSite[] {
    const state = this.#state;
    return [...state.realms[actor]!.sectors].sort().map((sectorId) => {
      const garrison = state.garrisons[sectorId];
      const readyShieldMen = garrison === undefined ? 0 : menOf(garrison.ready);
      const forming = garrison === undefined ? 0 : garrison.pending.reduce(
        (sum, cohort) => sum + menOf(cohort.origins),
        0,
      );
      const garrisonMen = readyShieldMen + forming;
      return {
        sectorId,
        musterHex: musterHexOf(state.loadedWorld.artifact, sectorId),
        garrisonMen,
        garrisonHeadroom: garrisonHeadroomOf(garrisonMen),
      };
    });
  }

  /**
   * Move field men into the shield they are standing on — **R18 (ii)**.
   *
   * Garrison and field are the same men in different postures, so filling a shield is
   * a transfer rather than a regeneration pulse: M12's automatic +10% was retired by
   * its own 2026-07-08 amendment (MT-⑤ / ADR 0027), and R18 replaced the search for a
   * rate with this.
   *
   * **Priced by movement and nothing else** — "zero new pricing devices" (R18 ii).
   * Turns and fatigue, never 행동력, because changing posture *is* moving men: the
   * cost is the march that brought them to this sector, which is why standing on the
   * muster hex is the legality rule and why there is no transfer delay to invent. The
   * men carry their wear across unchanged; a shield holds no wear ledger of its own
   * (06c), so what arrives is bodies.
   *
   * `GARRISON_PER_BORDER_SECTOR` bounds it (M13a, ADR 0014 keeping garrison ceilings
   * local), which is what stops a realm parking its army behind M5's ×4.8.
   */
  #transferToGarrison(actor: ActorId, detachmentId: unknown, men: unknown): GameEvent[] {
    const state = this.#state;
    const intent = { kind: 'transfer-to-garrison', actor };
    const windowRefusal = this.#formationWindowRefusal(actor);
    if (windowRefusal !== null) return [this.#reject(intent, windowRefusal)];

    const forces = state.forces[actor]!;
    const sites = this.#postureSites(actor);
    const refusal = transferToGarrisonRefusal(
      this.#formationInputs(forces.detachments).map((formation, at) => ({
        ...formation,
        // Ready men only: a transfer moves combat-ready substance, while
        // `FormationDetachment.men` counts cohorts still forming too.
        readyMen: menOf(forces.detachments[at]!.ready.origins),
      })),
      sites,
      detachmentId,
      men,
    );
    if (refusal !== null) return [this.#reject(intent, refusal)];

    const index = forces.detachments.findIndex((detachment) => detachment.id === detachmentId);
    const source = forces.detachments[index]!;
    const site = sites.find((candidate) =>
      candidate.musterHex.q === source.position.q && candidate.musterHex.r === source.position.r)!;
    const moved = men as number;

    // One surgery, both halves. The men leave the formation by WM-⑤'s leaving-service
    // rule — the register is untouched, because nobody died and nobody was raised —
    // and asking for the departing composition separately would have drifted a man
    // between origins (see `partitionOrigins`).
    const { detachment: next, withdrawn: leaving } = withdrawFromDetachment(source, moved);
    if (next === null) forces.detachments.splice(index, 1);
    else forces.detachments.splice(index, 1, next);

    const garrison = state.garrisons[site.sectorId] ?? { ready: {}, pending: [] };
    const ready: Record<SectorId, number> = { ...garrison.ready };
    accumulateOrigins(ready, leaving);
    state.garrisons[site.sectorId] = { ready, pending: garrison.pending };

    return [this.#turnEvent('posture-transferred', 'decision', {
      actor,
      sector: site.sectorId,
      into: 'garrison',
      men: moved,
    })];
  }

  /**
   * **HELD: taking shield men back into the field is not implemented here.**
   *
   * R18 (ii) grants both directions, and this is the one its gamble is about —
   * stripping a border to mass a decisive field army. It is held because
   * implementing it needs a rule that no seal supplies: **what happens to the wear
   * ledger across a posture change.**
   *
   * The naive reading is a wear-laundering machine. A garrison keeps no wear ledger
   * (06c: an unattended shield fights at the unattended baseline), so men entering a
   * shield have nowhere to carry wear and men leaving one have nothing to carry out —
   * they would be minted at zero. Both transfers sit in the same decision window and
   * headroom reopens after each move out, so an exhausted army standing on any of its
   * own muster hexes could round-trip its whole wear away, free and repeatedly. That
   * defeats 06b's convex wear curve, and R18 (ii) rejected a free transfer in as many
   * words: "an action with no cost is not a decision."
   *
   * The three candidate fixes each need a normative statement that does not exist:
   * give the garrison a wear ledger (the state 06c refused), charge the transfer a
   * wear price (a new dial R18 forbids — "zero new pricing devices"), or forbid the
   * round trip inside one window (a new rule). So this is a seam, not a gap: it is
   * registered on `docs/SYNC-DEBT.md` and named in ticket 06d's § Comments.
   *
   * Filling a shield **from** the field is landed and safe on its own: wear stops
   * mattering the moment men join a shield, because a shield never reads it.
   */

  /** Consolidate co-located detachments under the canonical-lowest stable id. */
  #mergeDetachments(actor: ActorId, detachmentIds: unknown): GameEvent[] {
    const state = this.#state;
    const intent = { kind: 'merge-detachments', actor };
    const windowRefusal = this.#formationWindowRefusal(actor);
    if (windowRefusal !== null) return [this.#reject(intent, windowRefusal)];

    const forces = state.forces[actor]!;
    const refusal = mergeDetachmentsRefusal(
      this.#formationInputs(forces.detachments),
      detachmentIds,
    );
    if (refusal !== null) return [this.#reject(intent, refusal)];

    const ids = [...(detachmentIds as string[])].sort();
    const selected = new Set(ids);
    const sources = ids.map((id) =>
      forces.detachments.find((detachment) => detachment.id === id)!);
    const firstIndex = Math.min(...forces.detachments.map(
      (detachment, index) => selected.has(detachment.id) ? index : Infinity,
    ));
    const merged = mergeDetachments(sources, ids[0]!);
    const survivors = forces.detachments.filter((detachment) => !selected.has(detachment.id));
    survivors.splice(firstIndex, 0, merged);
    forces.detachments.splice(0, forces.detachments.length, ...survivors);
    return [this.#turnEvent('detachments-merged', 'decision', {
      actor,
      detachmentIds: ids,
      detachmentId: merged.id,
    })];
  }

  /**
   * The sealed opening beat: both players pick a capital simultaneously and in
   * secret, and both sites go public together (CP-② D1.3, item 1).
   *
   * Note the legality rule this phase needs: **"has this realm locked yet"**, not
   * "is it this realm's turn". Both actors are legal callers at the same moment,
   * which is what a simultaneous beat means — and it is why the phase does not
   * consult `currentActor`. Ticket 03 owns whether the *turn* loop reads legality
   * the same way (`DECISIONS-OWED.md` § 1.3).
   */
  #chooseCapital(actor: ActorId, sector: SectorId | undefined): GameEvent[] {
    const state = this.#state;
    const intent = { kind: 'choose-capital', actor };

    // One rule, shared with `preview` (see domain/capital-choice.ts), so the two
    // cannot drift into telling the player different things.
    const refusal = capitalChoiceRefusal(
      {
        inSelectionPhase: state.phase === 'capital-selection',
        alreadyLocked: actor in state.capitals,
        ownedSectors: state.realms[actor]!.sectors,
      },
      actor,
      sector,
    );
    if (refusal !== null) return [this.#reject(intent, refusal)];

    state.capitals[actor] = sector!;

    const events: GameEvent[] = [
      {
        type: 'capital-locked',
        turn: state.turn,
        // The *fact* of locking is public; the site is not, until the reveal.
        detail: { actor },
      },
    ];

    if (state.actors.every((a) => a in state.capitals)) {
      // The opening beat's own reveal, and the handover into the turn loop's sole
      // agency tier. Nothing else happens between: there is no setup screen.
      this.#placeOpeningFields();
      state.phase = 'decision';
      events.push({
        type: 'capitals-revealed',
        turn: state.turn,
        detail: { capitals: { ...state.capitals } },
      });
    }

    return events;
  }

  /**
   * What the spend rules need, assembled from truth.
   *
   * `preview` builds the same context from a projection, which is what keeps the
   * two answering identically without either one reaching into the other's data.
   */
  #commitmentContext(actor: ActorId, candidateOrderKeys: readonly string[] = []): CommitmentContext {
    const state = this.#state;

    return {
      windowOpen: state.phase === 'decision',
      alreadyLocked: state.turnLocks.includes(actor),
      sectorKeys: this.#sectorIds(),
      orderKeys: [...new Set([
        ...Object.keys(state.recruitmentOrders[actor] ?? {}).map(recruitmentOrderKeyOf),
        ...candidateOrderKeys,
      ])],
      allocations: state.commitments[actor] ?? {},
      budget: TURN_COMMITMENT_BUDGET,
    };
  }

  /**
   * Pour part of the stack onto one sector.
   *
   * Recruitment shares this allocation map and budget, but its dynamic keys enter
   * only through the rich-request writer. Keeping this writer sector-only prevents
   * either lane from changing the other's allocation without its companion state.
   *
   * An allocation *replaces* its target's share rather than adding to it, which is
   * what makes re-cutting a plan before locking free.
   */
  #allocate(
    actor: ActorId,
    key: unknown,
    chips: unknown,
    event: { readonly type: string; readonly label: string; readonly value: string },
  ): GameEvent[] {
    const state = this.#state;
    const intent = { kind: event.type.replace('-allocated', ''), actor };

    const refusal = allocationRefusal(
      { ...this.#commitmentContext(actor), orderKeys: [] },
      actor,
      key,
      chips,
    );
    if (refusal !== null) return [this.#reject(intent, refusal)];

    const target = key as string;
    const amount = chips as number;
    const allocations = (state.commitments[actor] ??= {});
    if (amount === 0) delete allocations[target];
    else allocations[target] = amount;

    return [
      this.#turnEvent(event.type, 'decision', {
        actor,
        [event.label]: event.value,
        chips: amount,
        // The realm's own totals. Public to nobody but this caller: the event is
        // returned to whoever submitted, and the projection is where crossing is
        // decided.
        spent: spentOf(allocations),
        remaining: TURN_COMMITMENT_BUDGET - spentOf(allocations),
      }),
    ];
  }

  #assignableDetachments(actor: ActorId) {
    const state = this.#state;
    return state.forces[actor]!.detachments.map((detachment) => ({
      id: detachment.id,
      position: detachment.position,
      turnEndpoint: advanceOneTurn(state.movementGraph, detachment).detachment.position,
      reachSpeed: detachment.movement?.forcedMarch
        ? MARCH_SPEED + FORCED_MARCH_EXTRA_CAP
        : MARCH_SPEED,
    }));
  }

  #recruitmentLegalityContext(actor: ActorId) {
    const state = this.#state;
    const sectors = Object.values(state.loadedWorld.artifact.sectors);
    return {
      controlledSectors: state.realms[actor]!.sectors,
      // ADR 0045 item 2 read "own its parent province register". At sector grain the
      // parent is gone: the sector *is* the register, so legality is one membership
      // test instead of a sector -> province -> register hop.
      registeredSectors: Object.keys(state.forces[actor]!.registers),
      musterHexes: Object.fromEntries(sectors.map((sector) => [
        sector.id,
        musterHexOf(state.loadedWorld.artifact, sector.id),
      ])),
      movementGraph: state.movementGraph,
      detachments: this.#assignableDetachments(actor),
    };
  }

  /** Pour part of the stack onto one sector and name any arriving field substance. */
  #allocateCommitment(
    actor: ActorId,
    sector: unknown,
    chips: unknown,
    detachmentIds: unknown,
  ): GameEvent[] {
    if (typeof sector !== 'string' || sector.length === 0) {
      return [this.#reject({ kind: 'allocate-commitment', actor }, 'An allocation must name a sector.')];
    }
    const context = this.#commitmentContext(actor);
    const allocationError = allocationRefusal(
      { ...context, orderKeys: [] },
      actor,
      sector,
      chips,
    );
    if (allocationError !== null) {
      return [this.#reject({ kind: 'allocate-commitment', actor }, allocationError)];
    }

    const state = this.#state;
    if (chips !== 0) {
      const assignmentError = sectorAssignmentRefusal(
        state.movementGraph,
        sector,
        this.#assignableDetachments(actor),
        detachmentIds,
        Object.entries(state.sectorAssignments[actor] ?? {})
          .filter(([assigned]) => assigned !== sector)
          .flatMap(([, ids]) => ids),
      );
      if (assignmentError !== null) {
        return [this.#reject({ kind: 'allocate-commitment', actor }, assignmentError)];
      }
    }

    const events = this.#allocate(actor, sector, chips, {
      type: 'commitment-allocated',
      label: 'sector',
      value: sector,
    });
    const assignments = (state.sectorAssignments[actor] ??= {});
    if (chips === 0 || !Array.isArray(detachmentIds) || detachmentIds.length === 0) {
      delete assignments[sector];
    } else {
      assignments[sector] = [...detachmentIds] as string[];
    }
    return events;
  }

  /** Store one rich request beside its dynamic allocation in the shared stack. */
  #allocateRecruitment(
    actor: ActorId,
    requestId: unknown,
    sectorId: unknown,
    commit: unknown,
    posture: unknown,
    destinationHex: unknown,
    joinDetachmentId: unknown,
    forcedMarch: unknown,
  ): GameEvent[] {
    const state = this.#state;
    const refusal = recruitmentRequestRefusal(
      this.#recruitmentLegalityContext(actor),
      requestId,
      sectorId,
      commit,
      posture,
      destinationHex,
      joinDetachmentId,
      forcedMarch,
    );
    const intent = { kind: 'allocate-recruitment', actor };
    if (refusal !== null) return [this.#reject(intent, refusal)];

    const id = requestId as string;
    const key = recruitmentOrderKeyOf(id);
    const allocationError = allocationRefusal(
      this.#commitmentContext(actor, [key]),
      actor,
      key,
      commit,
    );
    if (allocationError !== null) return [this.#reject(intent, allocationError)];

    const amount = commit as number;
    const allocations = (state.commitments[actor] ??= {});
    const requests = (state.recruitmentOrders[actor] ??=
      Object.create(null) as Record<string, RecruitmentRequest>);
    if (amount === 0) {
      delete allocations[key];
      delete requests[id];
    } else {
      allocations[key] = amount;
      requests[id] = {
        requestId: id,
        sectorId: sectorId as SectorId,
        commit: amount,
        posture: posture as RecruitmentRequest['posture'],
        ...(destinationHex === undefined
          ? {}
          : { destinationHex: { ...(destinationHex as HexPosition) } }),
        ...(joinDetachmentId === undefined ? {} : { joinDetachmentId: joinDetachmentId as string }),
      };
    }

    return [this.#turnEvent('recruitment-allocated', 'decision', {
      actor,
      requestId: id,
      sectorId,
      commit: amount,
      posture,
      spent: spentOf(allocations),
      remaining: TURN_COMMITMENT_BUDGET - spentOf(allocations),
    })];
  }

  /**
   * Lock this turn's allocation — and, if that was the second realm, run the whole
   * payoff and background tiers before returning.
   *
   * Both realms having committed is what advances the turn (ruling R7). There is
   * deliberately no separate "end turn" intent: one would be the extra click D6.2
   * forbids, and it would let a caller hold a resolved turn open.
   */
  #lockCommitment(actor: ActorId): GameEvent[] {
    const state = this.#state;

    const refusal = lockRefusal(this.#commitmentContext(actor), actor);
    if (refusal !== null) return [this.#reject({ kind: 'lock-commitment', actor }, refusal)];

    const assigned = new Set<string>();
    const assignments = Object.entries(state.sectorAssignments[actor] ?? {})
      .sort(([a], [b]) => a.localeCompare(b));
    for (const [sector, detachmentIds] of assignments) {
      const assignmentError = sectorAssignmentRefusal(
        state.movementGraph,
        sector,
        this.#assignableDetachments(actor),
        detachmentIds,
        [...assigned],
      );
      if (assignmentError !== null) {
        return [this.#reject(
          { kind: 'lock-commitment', actor },
          `${assignmentError} Revise this commitment before locking.`,
        )];
      }
      for (const detachmentId of detachmentIds) assigned.add(detachmentId);
    }

    const recruitmentContext = this.#recruitmentLegalityContext(actor);
    const requests = Object.values(state.recruitmentOrders[actor] ?? {}).sort((a, b) =>
      compareRecruitmentRequests(recruitmentContext.musterHexes, a, b));
    for (const request of requests) {
      const requestError = recruitmentRequestRefusal(
        recruitmentContext,
        request.requestId,
        request.sectorId,
        request.commit,
        request.posture,
        request.destinationHex,
        request.joinDetachmentId,
      );
      if (requestError !== null) {
        return [this.#reject(
          { kind: 'lock-commitment', actor },
          `${requestError} Revise this recruitment before locking.`,
        )];
      }
    }

    state.turnLocks.push(actor);
    const events: GameEvent[] = [this.#turnEvent('commitment-locked', 'decision', { actor })];

    if (state.actors.every((a) => state.turnLocks.includes(a))) {
      // Territory is public, so a sector-keyed combat allocation may cross whole at
      // the reveal (D6.1). What must not is the order half of the shared namespace:
      // a recruitment key names a sector, a posture and a request, and publishing it
      // would decide ticket 08's fog surface by accident.
      const publicCommitKeys = new Set(this.#sectorIds());
      events.push(...this.#globallySafeResolutionEvents(this.#resolveTurn(), publicCommitKeys));
    }

    return events;
  }

  /**
   * Resolution is shared with whichever actor supplies the second lock. Keep an
   * internal exact event stream for orchestration, but whitelist only facts that
   * are presentation-safe for every viewer before it crosses `submit()`.
   *
   * Own exact force and economy state remains available through `view(actor)`;
   * default-dropping an unknown event prevents a later resolver from silently
   * creating a new truth egress.
   */
  #globallySafeResolutionEvents(
    events: readonly GameEvent[],
    publicCommitKeys: ReadonlySet<string>,
  ): GameEvent[] {
    return events.flatMap((event): GameEvent[] => {
      const detail = event.detail ?? {};
      if (event.type === 'commitments-revealed') {
        const revealed = detail.commitments as
          | Readonly<Record<ActorId, Readonly<Record<string, number>>>>
          | undefined;
        const commitments = Object.fromEntries(this.#state.actors.map((actor) => [
          actor,
          Object.fromEntries(Object.entries(revealed?.[actor] ?? {})
            .filter(([key]) => publicCommitKeys.has(key))
            .sort(([a], [b]) => a.localeCompare(b))),
        ]));
        return [{
          type: event.type,
          turn: event.turn,
          detail: { tier: detail.tier, commitments },
        }];
      }
      if (event.type === 'front-resolved') {
        return [{
          type: event.type,
          turn: event.turn,
          detail: {
            tier: detail.tier,
            front: detail.front,
            commitments: detail.commitments,
            total: detail.total,
            outcome: detail.outcome,
          },
        }];
      }
      if (event.type === 'battle-resolved') {
        // The payoff is watched, so a battle both realms fought is reported to
        // both: the ground, the roles, who took it, who broke, and the blood.
        //
        // Named field by field like every other branch here, and for this
        // function's own stated reason — a later ticket that adds a reading to a
        // battle must have to *choose* to publish it. Exact pre-battle strength and
        // the composed power product are absent deliberately: they are what ticket
        // 08's fog bands and ticket 09's EVAL BAR composes, and letting them out
        // from here would decide their presentation by accident.
        return [{
          type: event.type,
          turn: event.turn,
          detail: {
            tier: detail.tier,
            sector: detail.sector,
            fronts: detail.fronts,
            borderClass: detail.borderClass,
            terrain: detail.terrain,
            crossing: detail.crossing,
            fortification: detail.fortification,
            defenseMethod: detail.defenseMethod,
            attacker: detail.attacker,
            defender: detail.defender,
            commitments: detail.commitments,
            winner: detail.winner,
            sectorFalls: detail.sectorFalls,
            fortificationDamage: detail.fortificationDamage,
            routeDisrupted: detail.routeDisrupted,
            routed: detail.routed,
            casualties: detail.casualties,
          },
        }];
      }
      if (event.type === 'sector-captured') {
        // Ground changing hands is public: it is the map, and geography sits in the
        // open on the sealed information ladder.
        //
        // `civilians` is **not** published, and that is the whole point of naming
        // fields here. It is the exact body count the loser ceded, so publishing it
        // would hand both the winner and an observer an exact reading of the loser's
        // register at that sector — precisely the truth ticket 08's bands are for.
        // Each realm reads its own side of the transfer through `view(actor).economy`.
        return [{
          type: event.type,
          turn: event.turn,
          detail: {
            tier: detail.tier,
            sector: detail.sector,
            taker: detail.taker,
            loser: detail.loser,
            recaptured: detail.recaptured,
          },
        }];
      }
      if (event.type === 'shield-dissolved') {
        // *That* the shield on fallen ground stopped existing is public — the map
        // shows an unmanned sector either way. The counts are not: `leftService` and
        // `forming` are exact strength readings, which is ticket 08's to band.
        return [{
          type: event.type,
          turn: event.turn,
          detail: { tier: detail.tier, sector: detail.sector, actor: detail.actor },
        }];
      }
      if (event.type === 'sector-integrated') {
        // Limbo ending is equally public: it says whose the ground now counts as, not
        // what it is worth. The worth is the owner's own reading.
        return [{
          type: event.type,
          turn: event.turn,
          detail: { tier: detail.tier, sector: detail.sector, actor: detail.actor },
        }];
      }
      if (event.type === 'realm-recomputed' || event.type === 'upkeep-resolved') {
        // Both report *that* a realm's background beat ran. Their numbers — income,
        // force limit, per-force wear — stay behind `view(actor)`, which is the only
        // surface entitled to an actor's own truth.
        return [{
          type: event.type,
          turn: event.turn,
          detail: { tier: detail.tier, actor: detail.actor },
        }];
      }
      if (event.type === 'turn-opened') {
        return [{
          type: event.type,
          turn: event.turn,
          detail: { tier: detail.tier, budget: detail.budget },
        }];
      }
      return [];
    });
  }

  /**
   * The payoff tier, then the background tier folded into its tail (D6.2).
   *
   * The reveal is not a notification — it is the **input** to resolution, so no
   * code path can resolve a turn without having revealed it. That is what makes the
   * payoff structurally non-demotable rather than merely promised.
   *
   * Resolution changes no ownership here: the readings carry an explicit pending
   * outcome, and the operations that move a border arrive with ticket 06.
   */
  #resolveTurn(): GameEvent[] {
    const state = this.#state;
    const events: GameEvent[] = [];

    // ── payoff ────────────────────────────────────────────────────────────────
    const revealed = revealTurn(state.actors, state.commitments, state.sectorAssignments);
    events.push(
      this.#turnEvent('commitments-revealed', 'payoff', {
        commitments: revealed.commitments,
        assignments: revealed.assignments,
      }),
    );

    events.push(...this.#activateCohortsReadyFor(state.turn));
    events.push(...this.#resolveRecruitment(revealed.commitments));
    events.push(...this.#resolveMovement());
    events.push(...this.#resolveRecruitmentAffiliation());
    // Read the board first, then change it: the front reading reports what the
    // chips met, and the battles are what meeting costs.
    const engagements = this.#engagementsThisTurn(revealed);
    events.push(...this.#readReadyFronts(
      revealed,
      new Set(engagements.map((engagement) => engagement.sector)),
    ));
    events.push(...this.#resolveEngagements(engagements));
    events.push(...this.#updateMobilizationSignals());
    // Between the battles and the income, and in that order for a reason: a sector
    // taken *this* turn was the target of attack resolution, so ADR 0022's stable
    // turn excludes it and it integrates no earlier than next turn. Income then reads
    // holdings that still exclude it — which is limbo, computed rather than flagged.
    events.push(...this.#integrateOccupied(
      new Set(engagements.map((engagement) => engagement.sector)),
    ));
    events.push(...this.#resolveIncome());

    // ── background ────────────────────────────────────────────────────────────
    // Upkeep, income, and the land readings, folded into the reveal's
    // tail (D6.2) — no separate screen, no extra click, and what comes out is
    // turn N+1's opening state.
    events.push(...this.#resolveUpkeep());
    // The stack does not carry over: unspent chips are discarded and the pool
    // regenerates whole (D6.3).
    state.commitments = {};
    state.recruitmentOrders = {};
    state.sectorAssignments = {};
    state.turnLocks = [];
    state.turn += 1;
    events.push(
      this.#turnEvent('turn-opened', 'background', { budget: TURN_COMMITMENT_BUDGET }),
    );

    return events;
  }

  /** Promote due cohorts before any new draft, march, or ready-front reading. */
  #activateCohortsReadyFor(turn: number): GameEvent[] {
    const state = this.#state;
    const events: GameEvent[] = [];
    for (const actor of state.actors) {
      const detachments = state.forces[actor]!.detachments;
      for (let index = 0; index < detachments.length; index += 1) {
        const detachment = detachments[index]!;
        const activatedMen = detachment.pending.reduce(
          (sum, cohort) => sum + (cohort.readyOnTurn <= turn ? menOf(cohort.origins) : 0),
          0,
        );
        if (activatedMen === 0) continue;
        detachments[index] = activateReadyCohorts(detachment, turn);
        events.push(this.#turnEvent('cohort-activated', 'payoff', {
          actor,
          posture: 'field',
          detachmentId: detachment.id,
          men: activatedMen,
        }));
      }

      for (const sectorId of [...state.realms[actor]!.sectors].sort()) {
        const garrison = state.garrisons[sectorId];
        if (garrison === undefined) continue;
        const activatedMen = garrison.pending.reduce(
          (sum, cohort) => sum + (cohort.readyOnTurn <= turn ? menOf(cohort.origins) : 0),
          0,
        );
        if (activatedMen === 0) continue;
        state.garrisons[sectorId] = activateReadyGarrisonCohorts(garrison, turn);
        events.push(this.#turnEvent('cohort-activated', 'payoff', {
          actor,
          posture: 'garrison',
          sectorId,
          men: activatedMen,
        }));
      }
    }
    return events;
  }

  /** Settle and materialize one actor-wide batch before movement and income. */
  #resolveRecruitment(
    committed: RevealedTurn['commitments'],
  ): GameEvent[] {
    const state = this.#state;
    const events: GameEvent[] = [];
    this.#recruitmentAffiliations.splice(0);

    for (const actor of state.actors) {
      const forces = state.forces[actor]!;
      const requests = Object.values(state.recruitmentOrders[actor] ?? {}).filter((request) => {
        const committedAmount = committed[actor]?.[recruitmentOrderKeyOf(request.requestId)] ?? 0;
        return committedAmount === request.commit && ownerOfSector(state, request.sectorId) === actor &&
          forces.registers[request.sectorId] !== undefined;
      });
      if (requests.length === 0) continue;

      const controlledGarrisons = state.realms[actor]!.sectors.flatMap((sector) => {
        const garrison = state.garrisons[sector];
        return garrison === undefined ? [] : [garrison];
      });
      const servingOrigins = servingByOrigin(forces, controlledGarrisons);
      const availableCivilians = availableCiviliansByOrigin(forces.registers, servingOrigins);
      const holdings = holdingsOf(state, actor);
      const musterHexes = Object.fromEntries(requests.map((request) => [
        request.sectorId,
        musterHexOf(state.loadedWorld.artifact, request.sectorId),
      ]));
      const garrisonHeadroom = Object.fromEntries(requests.map((request) => {
        const garrison = state.garrisons[request.sectorId];
        const men = garrison === undefined
          ? 0
          : menOf(garrison.ready) + garrison.pending.reduce(
              (sum, cohort) => sum + menOf(cohort.origins),
              0,
            );
        return [request.sectorId, garrisonHeadroomOf(men)];
      }));
      const result = settleRecruitmentBatch({
        requests,
        forceLimit: forceLimitOf(state.loadedWorld.artifact.sectors, holdings, state.ripening),
        field: fieldOf(forces),
        garrison: garrisonOf(state, actor),
        register: Object.values(forces.registers).reduce((sum, men) => sum + men, 0),
        treasury: forces.treasury,
        availableCivilians,
        garrisonHeadroom,
        musterHexes,
      });

      forces.treasury -= result.bill;
      events.push(this.#turnEvent('recruitment-resolved', 'payoff', {
        actor,
        men: result.men,
        bill: result.bill,
        fulfilled: result.fulfilled,
      }));

      const requestsById = Object.fromEntries(requests.map((request) => [request.requestId, request]));
      for (const fulfillment of result.fulfilled) {
        if (fulfillment.men === 0) continue;
        const request = requestsById[fulfillment.requestId]!;
        // The recruiting sector *is* the origin now, so this stamp needs no lookup.
        const pending: PendingCohort = {
          origins: { [request.sectorId]: fulfillment.men },
          fatigue: 0,
          readyOnTurn: state.turn + 1,
          sourceSector: request.sectorId,
        };
        if (request.posture === 'field') {
          const ordinal = forces.nextDetachmentOrdinal;
          forces.nextDetachmentOrdinal += 1;
          const id = `detachment:${actor}:${ordinal}`;
          const muster = musterHexes[request.sectorId]!;
          const destination = request.destinationHex ?? muster;
          const route = minimumCostRoute(state.movementGraph, muster, destination);
          if (route === null) {
            throw new Error(`Accepted recruitment request "${request.requestId}" has no route.`);
          }
          forces.detachments.push({
            id,
            position: { ...muster },
            ready: { origins: {}, fatigue: 0 },
            pending: [pending],
            movement: route.length <= 1
              ? null
              : {
                  destination: { ...destination },
                  route,
                  forcedMarch: false,
                },
          });
          if (request.joinDetachmentId !== undefined) {
            this.#recruitmentAffiliations.push({
              actor,
              requestId: request.requestId,
              recruitDetachmentId: id,
              hostDetachmentId: request.joinDetachmentId,
              destination: { ...destination },
            });
          }
        } else {
          const garrison = (state.garrisons[request.sectorId] ??= { ready: {}, pending: [] });
          garrison.pending.push(pending);
        }
        events.push(this.#turnEvent('recruited', 'payoff', {
          actor,
          requestId: request.requestId,
          sectorId: request.sectorId,
          posture: request.posture,
          requestedMen: fulfillment.requestedMen,
          men: fulfillment.men,
          limitedBy: fulfillment.limitedBy,
          readyOnTurn: pending.readyOnTurn,
        }));
      }
    }
    return events;
  }

  #resolveMovement(): GameEvent[] {
    const state = this.#state;
    const events: GameEvent[] = [];
    this.#marchedThisTurn.clear();
    this.#approachThisTurn.clear();
    for (const actor of state.actors) {
      const detachments = state.forces[actor]!.detachments;
      for (let index = 0; index < detachments.length; index += 1) {
        const advanced = advanceOneTurn(state.movementGraph, detachments[index]!);
        detachments[index] = advanced.detachment;
        if (advanced.approach !== null) {
          this.#approachThisTurn.set(advanced.detachment.id, advanced.approach);
        }
        if (advanced.travelled === 0) continue;
        this.#marchedThisTurn.add(advanced.detachment.id);
        events.push(this.#turnEvent('detachment-moved', 'payoff', {
          actor,
          detachmentId: advanced.detachment.id,
          position: { ...advanced.detachment.position },
          travelled: advanced.travelled,
          fatigueAdded: advanced.fatigueAdded,
        }));
      }
    }
    return events;
  }

  #resolveRecruitmentAffiliation(): GameEvent[] {
    const state = this.#state;
    const events: GameEvent[] = [];
    for (const affiliation of this.#recruitmentAffiliations) {
      const detachments = state.forces[affiliation.actor]!.detachments;
      const recruitIndex = detachments.findIndex(
        (detachment) => detachment.id === affiliation.recruitDetachmentId,
      );
      const host = detachments.find(
        (detachment) => detachment.id === affiliation.hostDetachmentId,
      );
      const recruit = recruitIndex < 0 ? undefined : detachments[recruitIndex];
      if (host === undefined || recruit === undefined) continue;
      const atEndpoint = (position: HexPosition): boolean =>
        position.q === affiliation.destination.q && position.r === affiliation.destination.r;
      if (!atEndpoint(host.position) || !atEndpoint(recruit.position)) continue;

      host.pending.push(...recruit.pending);
      detachments.splice(recruitIndex, 1);
      events.push(this.#turnEvent('cohort-affiliated', 'payoff', {
        actor: affiliation.actor,
        requestId: affiliation.requestId,
        detachmentId: host.id,
        recruitedDetachmentId: recruit.id,
      }));
    }
    this.#recruitmentAffiliations.splice(0);
    return events;
  }

  #readReadyFronts(revealed: RevealedTurn, engagedSectors: ReadonlySet<SectorId>): GameEvent[] {
    return readFronts(revealed, frontsOf(this.#state), engagedSectors).map((reading) =>
      this.#turnEvent('front-resolved', 'payoff', { ...reading }));
  }

  /**
   * Every sector of the authored world.
   *
   * One reader, because it is one concept wearing three hats: the legal commit-key
   * set (ADR 0046 item 4), the set published at the reveal, and the candidate-site
   * list `engagementsOf` filters. Three copies of this walk is how they would come
   * to disagree about which sectors a realm may act on.
   */
  #sectorIds(): SectorId[] {
    return Object.keys(this.#state.loadedWorld.artifact.sectors);
  }

  /** Which sector a hex belongs to, over the one canonical graph. */
  #sectorAt(position: HexPosition): SectorId {
    const key = hexKey(position.q, position.r);
    const node = this.#state.movementGraph.nodes[key];
    if (node === undefined) {
      throw new Error(`Hex ${key} carries a force but is outside the authored movement graph.`);
    }
    return node.sectorId;
  }

  /**
   * The contested borders, carrying the authored class the ground is keyed to.
   *
   * A front's key **is** its edge's canonical name (gate 06 D4), which is what
   * lets the class be looked up rather than threaded through `Front`.
   */
  #borderFronts(): readonly BorderFront[] {
    const state = this.#state;
    const chokeByEdge = new Map(state.loadedWorld.artifact.edges.map(
      (edge) => [edgeKey(edge.a, edge.b), edge.choke.class] as const,
    ));
    return frontsOf(state).map((front) => {
      const chokeClass = chokeByEdge.get(front.key);
      if (chokeClass === undefined) {
        throw new Error(`Front "${front.key}" names no authored border, so it has no ground.`);
      }
      return { key: front.key, sectors: front.sectors, owners: front.owners, chokeClass };
    });
  }

  /**
   * Every combat-ready formation standing on one sector, read **once**.
   *
   * The single reader for "who is here", for the same reason `domain/state.ts`
   * keeps single readers: the power product and the blood price must be taken over
   * the *same* set. Two copies of this walk is how a force could fight in a battle
   * it then pays nothing for, or pay for one it never entered.
   *
   * Combat-ready substance only. Cohorts still forming were left behind by
   * `#activateCohortsReadyFor`, so they are not in the product — and therefore not
   * in the price either. Empty formations are omitted: nobody there is not a side.
   */
  #formationsOn(sector: SectorId): readonly SectorFormation[] {
    const state = this.#state;
    const formations: SectorFormation[] = [];

    for (const actor of state.actors) {
      for (const detachment of state.forces[actor]!.detachments) {
        if (this.#sectorAt(detachment.position) !== sector) continue;
        const men = menOf(detachment.ready.origins);
        if (men > 0) formations.push({ actor, detachmentId: detachment.id, men, wear: detachment.ready.fatigue });
      }
    }

    // The shield joins its holder's side. It carries **no wear ledger at all**
    // (`domain/force.ts`) — nothing in this slice marches a garrison — so it enters
    // at wear 0 and fights at exactly ×1.0, which is M2's "an unattended garrison
    // fights at its own strength" arriving by construction rather than by a
    // special case.
    const holder = ownerOfSector(state, sector);
    const garrison = state.garrisons[sector];
    if (holder !== null && garrison !== undefined) {
      const men = menOf(garrison.ready);
      if (men > 0) formations.push({ actor: holder, detachmentId: null, men, wear: 0 });
    }

    return formations;
  }

  /** The same reading, summed per side — the adapter's input. */
  #standingAt(sector: SectorId): SectorStanding {
    const sides: Record<ActorId, { men: number; wearMass: number }> = {};
    for (const actor of this.#state.actors) sides[actor] = { men: 0, wearMass: 0 };
    for (const formation of this.#formationsOn(sector)) {
      const side = sides[formation.actor]!;
      side.men += formation.men;
      side.wearMass += formation.men * formation.wear;
    }
    const authored = this.#state.loadedWorld.artifact.sectors[sector]!;
    return {
      holder: ownerOfSector(this.#state, sector),
      sides,
      fortTier: authored.fortTier,
      terrainLayer: this.#terrainLayerOf(sector),
    };
  }

  /**
   * The one authored terrain a sector carries (TC-⑮).
   *
   * TC-⑮'s binding rests on a measured fact: every one of the 56 sectors is
   * terrain-uniform. A sector that stops being uniform does not have "a terrain"
   * for the ruling to bind, so this refuses rather than picking — following
   * `fortificationOf`'s precedent, since the queued re-authoring (TC-⑪) is exactly
   * where intra-sector terrain is expected to arrive and a silent first-hex read is
   * what would let it land unnoticed.
   */
  #terrainLayerOf(sector: SectorId): TerrainLayer {
    const units = this.#state.loadedWorld.artifact.sectors[sector]!.mapUnits;
    const layers = [...new Set(units.map((unit) => unit.terrainLayer))].sort();
    if (layers.length !== 1) {
      throw new Error(
        `Sector "${sector}" carries ${layers.length} terrain layers (${layers.join(', ')}). ` +
          'TC-⑮ binds a sector\'s defensive ground to its own single authored terrain; ' +
          'intra-sector terrain needs a ruling before a battle can price it.',
      );
    }
    return layers[0]!;
  }

  /** Every engagement this turn produced — a reading, with nothing written yet. */
  #engagementsThisTurn(revealed: RevealedTurn): readonly Engagement[] {
    return engagementsOf(
      this.#sectorIds(),
      this.#borderFronts(),
      revealed.commitments,
      (sector) => this.#standingAt(sector),
    );
  }

  /**
   * The decisive battle, resolved per sector and landed on the board.
   *
   * **Atomic per sector, and order-independent by construction.** Every
   * engagement's inputs were read before any of them was applied, a detachment
   * has one position and therefore appears in at most one engagement, and the two
   * sides of a battle are different realms holding different stocks. So the
   * canonical sector order fixes the report rather than the arithmetic, and
   * nothing consults an actor's identity — the whole turn stays equivalent under
   * relabelling the two realms (ticket 03, ruling TL-①).
   *
   * **What it deliberately does not do: take the ground.** `sectorFalls` is
   * reported and acted on by nobody. Ownership transfer, the homeland record and
   * the register's re-cut to per-province are 06d's (R18 iii), and a capital
   * falling is 07's. A battle here changes who is *alive*, never who *holds*.
   */
  #resolveEngagements(engagements: readonly Engagement[]): GameEvent[] {
    const events: GameEvent[] = [];
    // Deferred to after the loop, over a **snapshot** taken inside it. Two distinct
    // order-dependences would otherwise appear, and neither is theoretical:
    // a fall-back *moves* a formation into a neighbouring sector, which may be
    // another engagement's site — whose blood `#resolveCasualties` apportions over a
    // fresh `#formationsOn` read, and whose own rout would then sweep up a force
    // that was never in it. Reading each rout's formations at the moment its battle
    // resolved keeps the canonical sector order fixing the report rather than the
    // arithmetic, which is what 06c's atomicity claim actually rests on.
    const routs: {
      readonly sector: SectorId;
      readonly actor: ActorId;
      readonly formations: readonly SectorFormation[];
    }[] = [];
    // Deferred for the same reason, one step further: a capture reads the loser's
    // settled register, so it must not run while another engagement's casualties are
    // still to be taken.
    const captures: SectorCapture[] = [];

    for (const engagement of engagements) {
      const outcome = resolveBattle(battleInputOf(engagement));
      const casualties = {
        attacker: this.#resolveCasualties(engagement.sector, engagement.attacker, outcome.attacker),
        defender: this.#resolveCasualties(engagement.sector, engagement.defender, outcome.defender),
      };
      // `escaped` finally has a consumer. It is M4's open-escape survivor count —
      // the men the escape clause lets slip away — and it gates displacement: a rout
      // nobody survived displaces nobody.
      for (const side of ['attacker', 'defender'] as const) {
        if (!outcome[side].routed || outcome[side].escaped <= 0) continue;
        const actor = engagement[side].actor;
        routs.push({
          sector: engagement.sector,
          actor,
          formations: this.#formationsOn(engagement.sector)
            .filter((formation) => formation.actor === actor),
        });
      }

      if (outcome.sectorFalls) {
        captures.push({
          sector: engagement.sector,
          taker: engagement.attacker.actor,
          loser: engagement.defender.actor,
        });
      }

      events.push(this.#turnEvent('battle-resolved', 'payoff', {
        sector: engagement.sector,
        fronts: [...engagement.fronts],
        borderClass: engagement.chokeClass,
        terrain: engagement.terrain,
        crossing: engagement.crossing,
        fortification: engagement.fortification,
        defenseMethod: outcome.defenseMethod,
        attacker: engagement.attacker.actor,
        defender: engagement.defender.actor,
        commitments: {
          attacker: engagement.attacker.commit,
          defender: engagement.defender.commit,
        },
        winner: outcome.winner,
        sectorFalls: outcome.sectorFalls,
        fortificationDamage: outcome.fortificationDamage,
        routeDisrupted: outcome.routeDisrupted,
        routed: { attacker: outcome.attacker.routed, defender: outcome.defender.routed },
        casualties,
        // Private. Exact pre-battle strength and the composed product are the two
        // readings fog (ticket 08, M10) and the EVAL BAR (ticket 09) own; they are
        // dropped before this event crosses `submit()`.
        substance: { attacker: engagement.attacker.men, defender: engagement.defender.men },
        power: { attacker: outcome.attacker.power, defender: outcome.defender.power },
      }));
    }

    for (const rout of routs) this.#displaceRouted(rout.sector, rout.actor, rout.formations);
    // Last, and after the routs for the same reason the routs come after the loop:
    // the transfer reads the loser's *settled* books. Casualties have been taken and
    // survivors have left service, so the civilians standing on this ground are known.
    // Displacement cannot disturb it — moving a formation changes where men are, never
    // which register they answer to.
    for (const capture of captures) events.push(...this.#captureSector(capture));

    return events;
  }

  /**
   * Ground changes hands — **ADR 0044**, and the record written is `homeland`'s
   * companion rather than `homeland` itself.
   *
   * Three things happen at once, and the third is the one with a seal behind every
   * clause:
   *
   * 1. **control moves now.** ADR 0022: "control and route effects apply
   *    immediately". The taker's `realms.sectors` gains it, the loser's loses it.
   * 2. **`homeland` does not move yet**, so for the rest of this turn the sector is
   *    controlled by one realm and homeland of the other, and `holdsOf` gives it to
   *    neither. That is OG-③'s limbo as ADR 0044 re-read it: an interval, not an end
   *    state, ended by `#integrateOccupied`.
   * 3. **the civilians transfer, unripened.** ADR 0044 item 3 keeps bodies out of the
   *    ripening lag (ADR 0029 names yield and the ceiling, not people), and ADR 0045
   *    item 4 says which bodies: *remaining civilians* travel with the land while
   *    serving men keep their realm and their origin. So the loser is left holding
   *    exactly the share still standing in its own ranks.
   *
   * What this deliberately is **not** is R17's `register × (pop ÷ total pop)`. At
   * sector grain there is nothing to apportion — the sector's own civilians are the
   * answer, which is the whole reason the grain moved. The edge R17 guarded is
   * guarded by construction rather than by formula: a sector bled dry has few
   * civilians left, so it cannot hand its taker fresh men.
   */
  #captureSector({ sector, taker, loser }: SectorCapture): GameEvent[] {
    const state = this.#state;
    const events: GameEvent[] = [];
    const takerForces = state.forces[taker]!;
    const loserForces = state.forces[loser]!;

    const loserSectors = state.realms[loser]!.sectors;
    const at = loserSectors.indexOf(sector);
    if (at !== -1) loserSectors.splice(at, 1);
    if (!state.realms[taker]!.sectors.includes(sector)) state.realms[taker]!.sectors.push(sector);
    events.push(...this.#emptyCapturedShield(sector, loser));

    // Serving men originating here, across every posture and both ready and pending —
    // the same reader recruitment and the projection use, so the three cannot come to
    // disagree about what "still in the ranks" means.
    const loserGarrisons = state.realms[loser]!.sectors.flatMap((held) => {
      const garrison = state.garrisons[held];
      return garrison === undefined ? [] : [garrison];
    });
    const stillServing = servingByOrigin(loserForces, loserGarrisons)[sector] ?? 0;
    const held = loserForces.registers[sector] ?? 0;
    // Not clamped at zero. `availableCiviliansByOrigin` treats serving-beyond-register
    // as fatal, and a second reader of the same question that quietly returned 0
    // instead would hide the very break that guard exists to catch.
    if (stillServing > held) {
      throw new Error(
        `${loser} serves ${stillServing} men of ${sector} against a register of ${held}.`,
      );
    }
    const civilians = held - stillServing;

    if (stillServing === 0) delete loserForces.registers[sector];
    else loserForces.registers[sector] = stillServing;
    if (civilians > 0) {
      takerForces.registers[sector] = (takerForces.registers[sector] ?? 0) + civilians;
    }

    // **No special case for a recapture, and that is deliberate.** ADR 0029 makes the
    // integration lag uniform across ALL acquired land, and the one seal that says
    // ground returns "at pre-war usable" — OG-③ — scopes that to *stall / white-peace*,
    // channels ADR 0042 retired. So there is nothing to cite for exempting a military
    // recapture, and it takes the ordinary lag.
    //
    // What still happens for free is narrower and needs no rule: ground retaken
    // *before* it integrated never lost its `homeland`, so the moment its own owner
    // controls it again `holdsOf` counts it and it pays in full. That is `homeland`
    // surviving a capture, exactly as `state.ts` describes it.
    const recaptured = state.homeland[sector] === taker;

    events.push(this.#turnEvent('sector-captured', 'payoff', {
      sector,
      taker,
      loser,
      civilians,
      recaptured,
    }));
    return events;
  }

  /**
   * A shield on ground that just fell — the case every other seal forbids an answer
   * to, leaving exactly one.
   *
   * **It is reachable.** `sectorFalls` is `attackerWins`, while `defenderRouted`
   * additionally needs losses past `ROUT_FRACTION` and a non-DELAYING method. So a
   * narrow win, or a broken DELAYING defense, takes the ground while part of the
   * shield still stands. 06e's rout path never sees those men.
   *
   * Left alone, `state.garrisons` is keyed by sector, so the taker's `garrisonOf`
   * would count the loser's survivors as its own — men changing sides for free — and
   * the taker's `register − serving` would go negative at that sector and throw.
   *
   * Every alternative is closed by a seal, which is why this is assembly rather than
   * a new rule:
   *
   * - **the taker keeps them** is barred outright by ADR 0045 item 4, "serving bodies
   *   retain their present realm and origin composition" on land transfer;
   * - **the loser keeps them where they stand** needs a garrison detached from its
   *   locality, and a mobile garrison is the system 06b and 06c explicitly refused;
   * - **they withdraw to somewhere** needs a destination, and the only candidate is
   *   the capital guard, which is ticket 07's `needs-info` and unbuilt.
   *
   * So WM-⑤ (v) applies, and by its own stated reasoning rather than by extension:
   * it covers "a locality-fixed shield with no locality left", and gives that
   * reasoning — not the rout — as why keeping them in service is impossible. They
   * **leave service and stay on the register**, becoming civilians on this ground a
   * moment before it changes hands, which is the consequence the geography/battle
   * grill ruled knowingly when it chose (v).
   *
   * Cohorts still forming are the one exception, and it is sealed separately: ADR
   * 0045 item 7 makes a captured not-yet-ready cohort "a match-permanent loss: its
   * origin components and the same register shares are removed, without refund,
   * prisoners, or captor-owned substance."
   */
  #emptyCapturedShield(sector: SectorId, loser: ActorId): GameEvent[] {
    const state = this.#state;
    const garrison = state.garrisons[sector];
    if (garrison === undefined) return [];

    const leftService = menOf(garrison.ready);
    const forming = garrison.pending.reduce((sum, cohort) => sum + menOf(cohort.origins), 0);
    if (leftService === 0 && forming === 0) return [];

    // The forming cohorts are destroyed, register and all — the only path here that
    // takes bodies out of the world rather than out of service.
    for (const cohort of garrison.pending) {
      this.#removeDead(loser, cohort.origins, menOf(cohort.origins));
    }
    state.garrisons[sector] = { ready: {}, pending: [] };

    return [this.#turnEvent('shield-dissolved', 'payoff', {
      sector,
      actor: loser,
      leftService,
      forming,
    })];
  }

  /**
   * Limbo ends and acquired ground starts paying — **ADR 0022's stable turn**.
   *
   * ADR 0022's clause 1 — "ends the turn under the same faction" — is the
   * `realms.sectors` membership this loop walks. Its clauses 2 and 3, "was not
   * contested during that turn" and "was not the target of active attack/defense
   * resolution", **collapse into one `battleSites` test**, and the collapse is a
   * reading worth stating: `contestedFronts` calls every realm border contested, and
   * a border sector is one permanently, so reading clause 2 that way would mean
   * frontier ground never ripens at all. The narrow reading — contested *this turn*
   * means a battle happened here — is the only one that leaves clause 2 any content.
   *
   * Integration is `homeland` flipping. From that moment the ground pays its taker,
   * and `ripening` starts the clock at zero so the first payment is the sealed
   * 50%/60%. Every later stable turn adds ten points until the authored value is
   * reached, at which point the entry is dropped and the ground is ordinary.
   *
   * **Where limbo's length comes from, stated honestly.** Nothing keys *integration*
   * to a stable turn; ADR 0022 says a capture "starts at" 50/60 and ADR 0044 item 2
   * repeats that unchanged. What forces a limbo interval is the other side: the
   * ticket and OG-③ require occupied-but-unintegrated ground to pay **neither** side,
   * and `economy.ts`'s landed `holdsOf` comment already says which turn that is —
   * "the turn a sector changes hands it stops paying its old owner and does not yet
   * pay its new one". A capture turn also fails all three of ADR 0022's clauses, so
   * the first turn that can integrate is the next one. That is a *reading assembled
   * from three statements*, not a deduction from ADR 0022 alone, and the cost is
   * visible: the 50/60 payment lands one turn later than "at capture" read literally.
   *
   * A contested turn does not *reset* the clock, it only fails to advance it: ADR
   * 0022 says recovery happens per stable turn, and nothing anywhere says an
   * interrupted occupation starts over.
   */
  #integrateOccupied(battleSites: ReadonlySet<SectorId>): GameEvent[] {
    const state = this.#state;
    const events: GameEvent[] = [];
    const sectors = state.loadedWorld.artifact.sectors;

    for (const actor of state.actors) {
      for (const sector of [...state.realms[actor]!.sectors].sort()) {
        if (battleSites.has(sector)) continue;
        const sectorData = sectors[sector];
        if (sectorData === undefined) continue;

        if (state.homeland[sector] !== actor) {
          state.homeland[sector] = actor;
          state.ripening[sector] = 0;
          events.push(this.#turnEvent('sector-integrated', 'background', { sector, actor }));
          continue;
        }

        const stableTurns = state.ripening[sector];
        if (stableTurns === undefined) continue;
        const next = stableTurns + 1;
        // No event when ripening finishes. Nothing consumes one, and its effect is
        // already legible where it belongs — in the owner's own income and ceiling.
        // Dropping the key *is* the completion.
        if (fullyRipened(sectorData, next)) delete state.ripening[sector];
        else state.ripening[sector] = next;
      }
    }

    return events;
  }

  /**
   * Where a broken force goes — war-model-build **WM-⑤**.
   *
   * Until 06e nothing consumed `escaped`, so a routed force stood on the hex it had
   * just lost. ADR 0046 turned that from a gap into a defect: with engagements sited
   * on hostile presence, a force that stays is re-engaged every turn, so "stay"
   * becomes annihilation and M4's escape clause becomes a lie.
   *
   * The axis is **who entered this sector this turn**, not attacker/defender:
   *
   * 1. anyone with an approach arc falls back along it — one sector, the way they
   *    came;
   * 2. anyone without one **leaves service and stays on the register** — they drop
   *    out of `serving` and become draftable civilians again.
   *
   * Garrison-only defence is the common case on this board (06c item 5) and a
   * garrison never has an arc, so (2) is the main path rather than a fallback. A
   * routed garrison is by definition one that lost its sector, and every way to keep
   * it in service needs somewhere for it to belong — the capital guard, or a
   * garrison that can retreat, both of which are systems this slice refuses.
   *
   * Emits no event of its own. `battle-resolved` already reports *that* a side
   * routed, and WM-⑤'s consequences are visible where they belong: in the mover's
   * own `view(actor)`, and in the register arithmetic every viewer's economy
   * already carries.
   */
  #displaceRouted(
    sector: SectorId,
    actor: ActorId,
    formations: readonly SectorFormation[],
  ): void {
    const state = this.#state;

    for (const formation of formations) {
      // A garrison reaches this branch with `detachmentId === null` — structurally,
      // never by accident, because nothing marches one.
      const approach = formation.detachmentId === null
        ? undefined
        : this.#approachThisTurn.get(formation.detachmentId);
      const detachment = formation.detachmentId === null
        ? undefined
        : state.forces[actor]!.detachments.find(
            (candidate) => candidate.id === formation.detachmentId,
          );

      const fallBack = approach !== undefined && detachment !== undefined &&
        this.#isStandableHex(approach.fromHex);
      if (!fallBack) {
        this.#leaveService(sector, actor, formation.detachmentId, formation.men);
        continue;
      }

      // R12 prices movement in **turns and fatigue**, never commit, and a fall-back
      // that paid nothing would be a teleport. Both halves are charged here, and the
      // second is easy to miss because it is a deletion rather than an addition:
      //
      // - *fatigue* — the march rate for the boundary step being undone;
      // - *turns* — clearing the standing march order below. The plan the rout just
      //   refuted does not survive it, so the force stands still until it is ordered
      //   again, which is the turn an ordered march would have cost it.
      //
      // One step, not the retrace: WM-⑤ is a **sector**-grain rule ("one sector, the
      // way they came"), and a force that crossed and then walked deeper into the
      // sector lands back on the hex the crossing started from. Charging it for the
      // intervening hexes would price a path the ruling does not describe.
      const worn = mapCohortFatigue(
        detachment!,
        (fatigue, men) => men === 0 ? fatigue : fatigue + MARCH_FATIGUE_PER_HEX,
      );
      const index = state.forces[actor]!.detachments.findIndex(
        (candidate) => candidate.id === detachment!.id,
      );
      state.forces[actor]!.detachments[index] = {
        ...worn,
        position: { ...approach!.fromHex },
        // A standing march order is a plan the rout just refuted, and its route
        // starts from ground this force no longer holds. Carrying it would walk the
        // survivors straight back into the sector they broke in.
        movement: null,
      };
    }
  }

  /**
   * Whether the arc's origin is still somewhere a force can actually stand.
   *
   * **Inert in this slice, and not by oversight.** The arc's origin is a hex the
   * force marched off this turn, so it is always a node of the frozen graph and
   * this can only return `true` today. It is written because the ticket states the
   * clause — "if the arc's origin is no longer a legal destination, the force
   * leaves service" — and because what would *make* an origin illegal is the
   * manoeuvre pass's subject: ground gone hostile, cut off, or occupied. Answering
   * any of those here would be the second destination rule the ticket forbids
   * inventing, so the branch is wired and left unreachable, the way `OPEN_ESCAPE`
   * and dial 9 are. A later answer is then a change of *this predicate*, not a new
   * code path.
   */
  #isStandableHex(hex: HexPosition): boolean {
    return this.#state.movementGraph.nodes[hexKey(hex.q, hex.r)] !== undefined;
  }

  /**
   * Take men out of `serving` **without** touching the register — the exact
   * opposite of `#removeDead`.
   *
   * Two laws, stated separately because a single conservation invariant over both
   * would fail on casualties and look like a displacement bug. Death removes a body
   * from the register permanently, because blood is permanent currency (SPEC, 06c
   * item 11). Leaving service removes it from the formation only: the register is
   * unchanged, so `availableCivilians = register − serving` hands those bodies back
   * to the draft, and WM-⑤ accepts the consequence knowingly — under ADR 0044 a
   * proportional share of them becomes the conqueror's draftable population when
   * the ground changes hands, and the conqueror still pays the draft price.
   */
  #leaveService(
    sector: SectorId,
    actor: ActorId,
    detachmentId: string | null,
    men: number,
  ): void {
    const state = this.#state;
    if (detachmentId === null) {
      const garrison = state.garrisons[sector];
      if (garrison === undefined) return;
      garrison.ready = subtractOrigins(garrison.ready, men);
      return;
    }

    const detachments = state.forces[actor]!.detachments;
    const index = detachments.findIndex((candidate) => candidate.id === detachmentId);
    if (index < 0) return;
    const { detachment: next } = withdrawFromDetachment(detachments[index]!, men);
    if (next === null) detachments.splice(index, 1);
    else detachments[index] = next;
  }

  /**
   * One side's blood, taken out of the board and out of the register for good.
   *
   * Casualties permanently shrink the **conscription register** as well as the
   * formation. SPEC's core design principles put it as "blood is permanent
   * currency", and match-arc **MT-②** has the register as a stock only death
   * shrinks. Subtracting from the cohort alone would do the opposite:
   * `availableCivilians` is `register − serving`, so a death that left the
   * register standing would hand the same body back to the next draft.
   *
   * The men are apportioned twice and exactly — first across the formations that
   * shared the engagement, then across each one's province origins — so the sum
   * of the parts is the reported figure and no body is lost or invented in the
   * rounding.
   *
   * Battle wear lands on the **ready** cohort only. `battleAccrual` prices the
   * intensity of the fight a force was in, and a cohort still forming was not in
   * it; recovery still walks every cohort, because everyone rests.
   */
  #resolveCasualties(sector: SectorId, party: EngagementParty, outcome: SideBattleOutcome): number {
    const forces = this.#state.forces[party.actor]!;
    const deaths = bodiesLost(party.men, outcome.casualties);
    const wearAdded = battleAccrual(party.men === 0 ? 0 : outcome.casualties / party.men);

    // The same reading the power product was composed from — see `#formationsOn`.
    const engaged = this.#formationsOn(sector).filter((formation) => formation.actor === party.actor);
    const byFormation = apportionExact(
      deaths,
      Object.fromEntries(engaged.map((formation) => [formationKey(formation), formation.men])),
    );
    const shareOf = (detachmentId: string | null): number | undefined => {
      const formation = engaged.find((candidate) => candidate.detachmentId === detachmentId);
      return formation === undefined ? undefined : byFormation[formationKey(formation)];
    };

    const survivors: Detachment[] = [];
    for (const detachment of forces.detachments) {
      const share = shareOf(detachment.id);
      if (share === undefined) {
        survivors.push(detachment);
        continue;
      }
      const next: Detachment = {
        ...detachment,
        ready: {
          origins: this.#removeDead(party.actor, detachment.ready.origins, share),
          fatigue: detachment.ready.fatigue + wearAdded,
        },
      };
      // A formation with nobody left and nothing still forming is gone, rather
      // than a zero-strength entry the projection would keep drawing.
      if (menOf(next.ready.origins) === 0 && next.pending.length === 0) continue;
      survivors.push(next);
    }
    forces.detachments = survivors;

    const shieldShare = shareOf(null);
    const garrison = this.#state.garrisons[sector];
    if (shieldShare !== undefined && garrison !== undefined) {
      garrison.ready = this.#removeDead(party.actor, garrison.ready, shieldShare);
    }

    return deaths;
  }

  /**
   * Take `deaths` whole bodies out of one cohort's origins **and** out of the
   * living registers they were drawn from.
   *
   * A body with no register behind it is the conservation break
   * `availableCiviliansByOrigin` exists to catch, so it is refused here rather
   * than allowed to surface later as a negative civilian count.
   */
  #removeDead(actor: ActorId, origins: OriginComposition, deaths: number): OriginComposition {
    const registers = this.#state.forces[actor]!.registers;
    const bySector = apportionExact(deaths, origins);
    const survivors: Record<SectorId, number> = {};
    for (const sector of Object.keys(origins).sort()) {
      const fallen = bySector[sector] ?? 0;
      survivors[sector] = origins[sector]! - fallen;
      if (fallen === 0) continue;
      if (registers[sector] === undefined) {
        throw new Error(`${actor} lost ${fallen} men of ${sector}, which holds no living register.`);
      }
      registers[sector] -= fallen;
    }
    return survivors;
  }

  /**
   * Replace this beat's private recruitment truth after all payoffs have settled.
   *
   * New recruitment cohorts alone are due on `turn + 1`: earlier cohorts were
   * activated before this turn's settlement. Their source sectors therefore give
   * this information-update beat one exact, positive aggregate per actor-sector.
   */
  #updateMobilizationSignals(): GameEvent[] {
    const state = this.#state;
    const traces: MobilizationTrace[] = [];
    for (const actor of state.actors) {
      const menBySector = new Map<SectorId, number>();
      const record = (cohort: PendingCohort): void => {
        if (cohort.readyOnTurn !== state.turn + 1) return;
        const men = menOf(cohort.origins);
        if (men === 0) return;
        menBySector.set(cohort.sourceSector, (menBySector.get(cohort.sourceSector) ?? 0) + men);
      };

      for (const detachment of state.forces[actor]!.detachments) {
        for (const cohort of detachment.pending) record(cohort);
      }
      for (const sectorId of state.realms[actor]!.sectors) {
        for (const cohort of state.garrisons[sectorId]?.pending ?? []) record(cohort);
      }

      for (const sectorId of [...menBySector.keys()].sort()) {
        traces.push({
          actor,
          sectorId,
          men: menBySector.get(sectorId)!,
          turn: state.turn,
        });
      }
    }
    state.mobilizationTraces = traces;
    return [];
  }

  /**
   * The realm economy's one pass per turn: income, then report.
   *
   * **Order matters and is chosen.** Recruitment bills the treasury the player was
   * looking at when they poured the chips in, and this turn's income arrives
   * after — so a realm cannot spend money it has not yet earned, and the number
   * on screen at decision time is the number the order was priced against.
   *
   * Everything else here is a *reading*, not a stock: income and the force limit
   * are recomputed from currently-held land every single turn (M14, D5.1), which
   * is the whole of the anti-fizzle decay. Losing a sector cuts both in the same
   * turn because the sector simply stops being in `holdings` — there is no decay
   * device, no timer, and nothing to tune.
   */
  #resolveIncome(): GameEvent[] {
    const state = this.#state;
    const events: GameEvent[] = [];

    for (const actor of state.actors) {
      const forces = state.forces[actor]!;
      const holdings = holdingsOf(state, actor);
      const forceLimit = forceLimitOf(state.loadedWorld.artifact.sectors, holdings, state.ripening);
      const income = incomeOf(state.loadedWorld.artifact.sectors, holdings, state.ripening);
      forces.treasury += income;

      events.push(
        this.#turnEvent('realm-recomputed', 'background', {
          actor,
          income,
          forceLimit,
          holdings: holdings.length,
        }),
      );
    }

    return events;
  }

  /**
   * How well one force is supplied, in [0, 1].
   *
   * Uniform today — see {@link FULLY_SUPPLIED} for why that is scope rather than
   * a chosen value. It takes the detachment it is asked about so that R16's real
   * predicate arrives as a body change instead of a re-plumbing.
   *
   * Note what it deliberately does **not** consult: the sector a force stands on,
   * or that sector's class. No unit and no sector is exempted, **including a
   * capital sector** — the clause ticket 06b keeps from the moved predicate, and
   * the negative guarantee ticket 07 item 7 needs. Because no branch exists, the
   * guarantee holds by construction; `fatigue-upkeep.test.js` is the tripwire.
   */
  #supplyLevelOf(_detachment: Detachment): number {
    return FULLY_SUPPLIED;
  }

  /**
   * The wear ledger's one pass per turn, folded into the background tail.
   *
   * Marching and fighting accrue at the payoff tier; this is where the gauge is
   * read back down again, and it is the only thing standing between a marching
   * army and the ×0.5 effectiveness floor. Accrual and recovery walk the same
   * cohorts through `mapCohortFatigue`, so the two cannot come to disagree about
   * where the ledger lives — pending cohorts included, since they march too.
   *
   * **Garrisons are absent, and not by exemption:** a `GarrisonForce` carries no
   * wear account at all (`domain/force.ts`), because nothing in this slice
   * marches one. When ticket 07 places the capital guard, what must not exempt it
   * is the **supply** predicate — R16's, and not this pass.
   *
   * **The supply account is absent rather than stored at zero** (user ruling,
   * 2026-07-28). Every force is supplied, and a supplied turn resets the pump, so
   * no force can hold a supply ledger, nothing enters starvation, and there is no
   * substance-loss path to run. A `supply` field on match state would be dead
   * until R16 gives supply a cause; the account arrives with its consumer.
   */
  #resolveUpkeep(): GameEvent[] {
    const state = this.#state;
    const events: GameEvent[] = [];

    for (const actor of state.actors) {
      const detachments = state.forces[actor]!.detachments;
      const upkept: { readonly detachmentId: string; readonly wear: number; readonly recovered: number }[] = [];

      for (let index = 0; index < detachments.length; index += 1) {
        const detachment = detachments[index]!;
        const supplyLevel = this.#supplyLevelOf(detachment);
        const stationary = !this.#marchedThisTurn.has(detachment.id);
        // `supply: 0` is not an assumption about the world — it is the reading a
        // supplied turn always produces, which is why nothing stores it.
        const upkeepOf = (wear: number): number => turnUpkeep(
          { wear, supply: 0 },
          supplyLevel,
          UNBURNED_GROUND,
          stationary,
        ).wear;

        const wear = upkeepOf(detachment.ready.fatigue);
        upkept.push({
          detachmentId: detachment.id,
          wear,
          recovered: detachment.ready.fatigue - wear,
        });
        detachments[index] = mapCohortFatigue(detachment, upkeepOf);
      }

      events.push(this.#turnEvent('upkeep-resolved', 'background', { actor, forces: upkept }));
    }

    return events;
  }

  /** A turn-loop event, stamped with the tier it belongs to (D6.2). */
  #turnEvent(type: string, tier: TurnTier, detail: Record<string, unknown>): GameEvent {
    return { type, turn: this.#state.turn, detail: { tier, ...detail } };
  }

  #reject(intent: { kind?: string; actor?: ActorId } | null | undefined, reason: string): GameEvent {
    return {
      type: 'intent-rejected',
      turn: this.#state.turn,
      detail: { reason, kind: intent?.kind ?? '<none>', actor: intent?.actor ?? '<none>' },
    };
  }

  /**
   * Reads the injected clock. Present so the shell has a legitimate way to
   * timestamp, and so the absence of one is loud rather than silent — no rule
   * may call this.
   */
  protected now(): number {
    return this.#clock.now();
  }
}
