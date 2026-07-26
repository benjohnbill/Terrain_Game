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

import { capitalChoiceRefusal } from '../domain/capital-choice.js';
import {
  allocationRefusal,
  frontAssignmentRefusal,
  lockRefusal,
  spentOf,
  TURN_COMMITMENT_BUDGET,
  type Allocations,
  type CommitmentContext,
} from '../domain/commitment.js';
import {
  forceLimitOf,
  GARRISON_PER_BORDER_SECTOR,
  incomeOf,
  registerOf,
  START_FIELD_FRACTION,
  startingTreasuryOf,
} from '../domain/economy.js';
import {
  availableCiviliansByOrigin,
  fieldOf,
  mergeDetachments,
  mergeDetachmentsRefusal,
  menOf,
  servingByOrigin,
  splitDetachment,
  splitDetachmentRefusal,
  type Detachment,
  type ForceCohort,
  type GarrisonForce,
  type OriginComposition,
} from '../domain/force.js';
import { contestedFronts, isPartyTo } from '../domain/fronts.js';
import {
  advanceOneTurn,
  buildMovementGraph,
  minimumCostRoute,
  movementOrderRefusal,
  musterHexOf,
  FORCED_MARCH_EXTRA_CAP,
  MARCH_SPEED,
} from '../domain/movement.js';
import { draftOrder, ORDER_KEYS, ORDER_RECRUIT, orderKeyOf } from '../domain/recruitment.js';
import { frontsOf, garrisonOf, holdingsOf, ownerOfSector } from '../domain/state.js';
import type { MatchState, Realm, RealmForces } from '../domain/state.js';
import { readFronts, revealTurn } from '../domain/turn.js';
import { project } from '../projection/project.js';
import { drawPartition } from '../world/partition.js';
import { loadWorld } from '../world/load.js';
import type { HexPosition, RegionId, SectorId } from '../world/schema.js';
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

/** A clock that refuses to be read. Rules must never need one (ADR 0040). */
const NO_CLOCK: Clock = {
  now(): number {
    throw new Error(
      'No clock was injected. Rules must not read the wall clock (ADR 0040); ' +
        'if a caller genuinely needs time, inject it through MatchConfig.clock.',
    );
  },
};

/** Canonical largest-remainder allocation over province weights. */
function allocateByRegion(
  total: number,
  weights: Readonly<Record<RegionId, number>>,
): Record<RegionId, number> {
  const regions = Object.keys(weights).sort();
  const weightTotal = regions.reduce((sum, region) => sum + weights[region]!, 0);
  if (!Number.isInteger(total) || total < 0 || total > weightTotal) {
    throw new Error(`Cannot allocate ${total} men over ${weightTotal} province capacity.`);
  }
  const allocation: Record<RegionId, number> = Object.fromEntries(
    regions.map((region) => [region, 0]),
  );
  if (total === 0) return allocation;

  const remainders: { readonly region: RegionId; readonly fraction: number }[] = [];
  let assigned = 0;
  for (const region of regions) {
    const exact = total * weights[region]! / weightTotal;
    const whole = Math.floor(exact);
    allocation[region] = whole;
    assigned += whole;
    remainders.push({ region, fraction: exact - whole });
  }
  remainders.sort((a, b) =>
    b.fraction - a.fraction ||
    (a.region < b.region ? -1 : a.region > b.region ? 1 : 0));
  for (let index = 0; assigned < total; index += 1, assigned += 1) {
    const region = remainders[index]!.region;
    allocation[region] = allocation[region]! + 1;
  }
  return allocation;
}

function addOrigins(
  destination: Record<RegionId, number>,
  addition: OriginComposition,
): void {
  for (const [region, men] of Object.entries(addition)) {
    destination[region] = (destination[region] ?? 0) + men;
  }
}

export class Runtime {
  /** Truth. `#`-private, so it is unreachable from outside even at runtime. */
  readonly #state: MatchState;
  readonly #clock: Clock;

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
      // The opening partition *is* the homeland map, and it never moves again:
      // a duel has no settlement channel, so conquered ground stays in OG-③'s
      // limbo rather than being integrated into the taker's holdings.
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
      forces,
      garrisons,
      turn: 1,
      commitments: {},
      frontAssignments: {},
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
   * What is deliberately absent: the **capital guard**. Its magnitude is in live
   * conflict (350 × population against a flat 1500) and ticket 07 carries that
   * conflict; seeding a number here would import it and decide it by accident.
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
        const region = artifact.sectors[sectorId]!.regionId;
        garrisons[sectorId] = {
          ready: { [region]: GARRISON_PER_BORDER_SECTOR },
          pending: [],
        };
      }
    }

    const forces: Record<ActorId, RealmForces> = {};
    for (const actor of actors) {
      const held = realms[actor]!.sectors;
      const heldByRegion: Record<RegionId, SectorId[]> = {};
      for (const sectorId of held) {
        const region = artifact.sectors[sectorId]!.regionId;
        (heldByRegion[region] ??= []).push(sectorId);
      }
      const registers: Record<RegionId, number> = {};
      for (const region of Object.keys(heldByRegion).sort()) {
        registers[region] = registerOf(artifact.sectors, heldByRegion[region]!);
      }

      const openingGarrisonOrigins: Record<RegionId, number> = {};
      for (const sectorId of held) {
        const garrison = garrisons[sectorId];
        if (garrison !== undefined) addOrigins(openingGarrisonOrigins, garrison.ready);
      }
      const remaining: Record<RegionId, number> = {};
      for (const region of Object.keys(registers).sort()) {
        remaining[region] = registers[region]! - (openingGarrisonOrigins[region] ?? 0);
        if (remaining[region]! < 0) {
          throw new Error(`Opening garrison exceeds ${region}'s living register.`);
        }
      }
      const openingFieldMen = Math.floor(
        forceLimitOf(artifact.sectors, held) * START_FIELD_FRACTION,
      );
      const openingField: ForceCohort = {
        origins: allocateByRegion(openingFieldMen, remaining),
        fatigue: 0,
      };
      if (menOf(openingField.origins) !== openingFieldMen) {
        throw new Error(`Opening field allocation for ${actor} does not conserve men.`);
      }

      forces[actor] = {
        treasury: startingTreasuryOf(incomeOf(artifact.sectors, held)),
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
      const { front, chips, detachmentIds } = intent as {
        front?: unknown;
        chips?: unknown;
        detachmentIds?: unknown;
      };
      return this.#allocateCommitment(intent.actor, front, chips, detachmentIds);
    }
    if (intent.kind === 'allocate-order') {
      const { order, chips } = intent as { order?: unknown; chips?: unknown };
      return this.#allocateOrder(intent.actor, order, chips);
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
    const detachments = state.forces[actor]!.detachments;
    const refusal = movementOrderRefusal(
      state.movementGraph,
      detachments,
      detachmentId,
      destinationHex,
      forcedMarch,
    );
    const intent = { kind: 'move-detachment', actor };
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
  #commitmentContext(actor: ActorId): CommitmentContext {
    const state = this.#state;
    const fronts = frontsOf(state);

    return {
      windowOpen: state.phase === 'decision',
      alreadyLocked: state.turnLocks.includes(actor),
      frontKeys: fronts.filter((front) => isPartyTo(front, actor)).map((front) => front.key),
      orderKeys: ORDER_KEYS,
      allocations: state.commitments[actor] ?? {},
      budget: TURN_COMMITMENT_BUDGET,
    };
  }

  /**
   * Pour part of the stack onto one target — a front, or an order kind.
   *
   * **One writer, because D6.3 seals one stack.** A front and an order are two
   * keys in the same allocation map against the same budget, so they take the same
   * refusal rule and the same write; only the event's name and its label differ.
   * Two writers here is how the Σ ≤ budget invariant would come to be enforced
   * twice and then, eventually, once.
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

    const refusal = allocationRefusal(this.#commitmentContext(actor), actor, key, chips);
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

  /** Pour part of the stack onto one front and name any arriving field substance. */
  #allocateCommitment(
    actor: ActorId,
    front: unknown,
    chips: unknown,
    detachmentIds: unknown,
  ): GameEvent[] {
    if (typeof front !== 'string' || front.length === 0) {
      return [this.#reject({ kind: 'allocate-commitment', actor }, 'An allocation must name a front.')];
    }
    const context = this.#commitmentContext(actor);
    const allocationError = allocationRefusal(context, actor, front, chips);
    if (allocationError !== null) {
      return [this.#reject({ kind: 'allocate-commitment', actor }, allocationError)];
    }

    const state = this.#state;
    const namedFront = frontsOf(state).find((candidate) => candidate.key === front)!;
    if (chips !== 0) {
      const assignmentError = frontAssignmentRefusal(
        state.movementGraph,
        namedFront,
        this.#assignableDetachments(actor),
        detachmentIds,
        Object.entries(state.frontAssignments[actor] ?? {})
          .filter(([assignedFront]) => assignedFront !== front)
          .flatMap(([, ids]) => ids),
      );
      if (assignmentError !== null) {
        return [this.#reject({ kind: 'allocate-commitment', actor }, assignmentError)];
      }
    }

    const events = this.#allocate(actor, front, chips, {
      type: 'commitment-allocated',
      label: 'front',
      value: front,
    });
    const assignments = (state.frontAssignments[actor] ??= {});
    if (chips === 0 || !Array.isArray(detachmentIds) || detachmentIds.length === 0) {
      delete assignments[front];
    } else {
      assignments[front] = [...detachmentIds] as string[];
    }
    return events;
  }

  /**
   * Pour part of the stack into a non-front order — recruitment, for now.
   *
   * Deliberately the *same* rule and the *same* allocation map as a front: D6.3
   * seals one stack as the single currency for every order kind, and R2 put
   * non-combat orders on the same free-pour grammar. A separate budget here would
   * delete the mutual exposure the single stack exists to create — betting big on
   * rebuilding has to mean standing thin somewhere, or the choice is not a choice.
   */
  #allocateOrder(actor: ActorId, order: unknown, chips: unknown): GameEvent[] {
    if (typeof order !== 'string' || order.length === 0) {
      return [this.#reject({ kind: 'allocate-order', actor }, 'An order allocation must name an order kind.')];
    }
    return this.#allocate(actor, orderKeyOf(order), chips, {
      type: 'order-allocated',
      label: 'order',
      value: order,
    });
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

    const fronts = frontsOf(state);
    const assigned = new Set<string>();
    const assignments = Object.entries(state.frontAssignments[actor] ?? {})
      .sort(([a], [b]) => a.localeCompare(b));
    for (const [frontKey, detachmentIds] of assignments) {
      const front = fronts.find((candidate) => candidate.key === frontKey);
      if (front === undefined) {
        return [this.#reject(
          { kind: 'lock-commitment', actor },
          `Front "${frontKey}" is no longer contested; revise this commitment before locking.`,
        )];
      }
      const assignmentError = frontAssignmentRefusal(
        state.movementGraph,
        front,
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

    state.turnLocks.push(actor);
    const events: GameEvent[] = [this.#turnEvent('commitment-locked', 'decision', { actor })];

    if (state.actors.every((a) => state.turnLocks.includes(a))) {
      events.push(...this.#resolveTurn());
    }

    return events;
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
    const revealed = revealTurn(state.actors, state.commitments, state.frontAssignments);
    events.push(
      this.#turnEvent('commitments-revealed', 'payoff', {
        commitments: revealed.commitments,
        assignments: revealed.assignments,
      }),
    );

    for (const actor of state.actors) {
      const detachments = state.forces[actor]!.detachments;
      for (let index = 0; index < detachments.length; index += 1) {
        const advanced = advanceOneTurn(state.movementGraph, detachments[index]!);
        detachments[index] = advanced.detachment;
        if (advanced.travelled === 0) continue;
        events.push(this.#turnEvent('detachment-moved', 'payoff', {
          actor,
          detachmentId: advanced.detachment.id,
          position: { ...advanced.detachment.position },
          travelled: advanced.travelled,
          fatigueAdded: advanced.fatigueAdded,
        }));
      }
    }

    for (const reading of readFronts(revealed, frontsOf(state))) {
      events.push(this.#turnEvent('front-resolved', 'payoff', { ...reading }));
    }

    // ── background ────────────────────────────────────────────────────────────
    // Upkeep, income, recruitment and the land readings, folded into the reveal's
    // tail (D6.2) — no separate screen, no extra click, and what comes out is
    // turn N+1's opening state.
    events.push(...this.#recomputeRealms(revealed.commitments));

    // The stack does not carry over: unspent chips are discarded and the pool
    // regenerates whole (D6.3).
    state.commitments = {};
    state.frontAssignments = {};
    state.turnLocks = [];
    state.turn += 1;
    events.push(
      this.#turnEvent('turn-opened', 'background', { budget: TURN_COMMITMENT_BUDGET }),
    );

    return events;
  }

  /**
   * The realm economy's one pass per turn: draft, then income, then report.
   *
   * **Order matters and is chosen.** A draft bills the treasury the player was
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
  #recomputeRealms(committed: Readonly<Record<ActorId, Allocations>>): GameEvent[] {
    const state = this.#state;
    const events: GameEvent[] = [];

    for (const actor of state.actors) {
      const forces = state.forces[actor]!;
      const holdings = holdingsOf(state, actor);
      const forceLimit = forceLimitOf(state.loadedWorld.artifact.sectors, holdings);
      const chips = committed[actor]?.[ORDER_RECRUIT] ?? 0;
      const garrisons = state.realms[actor]!.sectors.flatMap((sector) => {
        const garrison = state.garrisons[sector];
        return garrison === undefined ? [] : [garrison];
      });
      const field = fieldOf(forces);
      const servingOrigins = servingByOrigin(forces, garrisons);
      const register = Object.values(forces.registers).reduce((sum, men) => sum + men, 0);

      // One rule, shared with `preview`, so the card the player read before
      // committing and the draft they actually get cannot drift.
      const draft = draftOrder({
        chips,
        forceLimit,
        field,
        garrison: garrisonOf(state, actor),
        register,
        treasury: forces.treasury,
      });

      // P1 dual billing, in one place: men and their price move together, and
      // there is no other statement in this compatibility path that raises field.
      if (draft.men > 0) {
        const available = availableCiviliansByOrigin(forces.registers, servingOrigins);
        const draftedOrigins = allocateByRegion(draft.men, available);
        const host = forces.detachments[0];
        if (host === undefined) throw new Error(`Realm ${actor} has no field detachment.`);
        const before = menOf(host.ready.origins);
        const origins: Record<RegionId, number> = { ...host.ready.origins };
        addOrigins(origins, draftedOrigins);
        host.ready = {
          origins,
          fatigue: (host.ready.fatigue * before) / (before + draft.men),
        };
      }
      forces.treasury -= draft.bill;

      const income = incomeOf(state.loadedWorld.artifact.sectors, holdings);
      forces.treasury += income;

      if (draft.men > 0) {
        events.push(
          this.#turnEvent('recruited', 'background', {
            actor,
            men: draft.men,
            bill: draft.bill,
            limitedBy: draft.limitedBy,
          }),
        );
      }

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
