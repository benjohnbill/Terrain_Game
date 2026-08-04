/**
 * Authoritative match state — the truth the Runtime privately owns.
 *
 * This type never leaves the Runtime. Callers receive a `MatchView` built by
 * `projection/project.ts`; there is no snapshot API by which this shape could
 * escape (ADR 0049 § Decision 4).
 */

import { holdsOf } from './economy.js';
import { menOf } from './force.js';
import { contestedFronts } from './fronts.js';
import type { MovementGraph } from './movement.js';
import type { LoadedWorld } from '../world/load.js';
import type { Detachment, ForceCohort, GarrisonForce } from './force.js';
import type { IntelligenceLedger, ReconnaissanceRequest } from './intel.js';
import type { RecruitmentRequest } from './recruitment.js';
import type { SectorId } from '../world/schema.js';
import type { ActorId, Front, MatchOutcome, MatchPhase, WorldIdentity } from '../runtime/types.js';
import type { Rng } from '../runtime/rng.js';

/** One side's holdings. Drawn at setup; ownership changes as the war does. */
export interface Realm {
  readonly actor: ActorId;
  readonly regions: readonly string[];
  /** Mutable: sectors change hands. Ticket 07 is where a capital does. */
  sectors: SectorId[];
}

/**
 * A realm's stored stocks — and there are exactly two of them, by seal.
 *
 * M14's design principle is **land-derived state**: income and the force limit
 * are recomputed from held sectors every turn and never stored. What genuinely
 * accumulates is treasury (money) and register (blood), plus the men themselves.
 *
 * Detachments are the mobile main force the land-derived ceiling caps; garrisons
 * are the local shields, held per sector because that is how M13a sizes them.
 */
export interface RealmForces {
  treasury: number;
  /**
   * Living draftable bodies, **per sector** (MT-② amended 2026-07-31).
   *
   * The grain is the sector because the derivation always was one:
   * `registerPerPop × Σ populationValue` reads a *sector* field, so a per-province
   * total discarded variation inside a province — and ground changes hands per
   * sector, with a province split across the front line the normal case. At this
   * grain succession on capture is exact with no apportionment formula: a captured
   * sector's civilians are `registers[sector] − servingFrom(sector)`.
   *
   * The key is the same one `OriginComposition` uses, and deliberately so — the two
   * are joined by `availableCivilians = register − serving` and cannot sit at
   * different grains. That is the ruling's second half (2026-07-31), which amends
   * ADR 0045.
   *
   * A realm may hold a register entry for a sector it no longer controls: what a
   * capture moves is the *civilians*, so the loser keeps exactly the share still
   * standing in its own ranks, and those bodies leave only by dying.
   */
  registers: Record<SectorId, number>;
  openingField: ForceCohort | null;
  detachments: Detachment[];
  nextDetachmentOrdinal: number;
}

/** One enemy force found standing on a realm's ground when the turn resolved. */
export interface BorderAlarmTrace {
  readonly actor: ActorId;
  /** The sector it is standing on — the ground whose holder is being warned. */
  readonly sectorId: SectorId;
  /** The sector it came from, or `null` when it did not move this turn. */
  readonly from: SectorId | null;
}

/** Exact recruitment truth retained by the Runtime for the current decision beat. */
export interface MobilizationTrace {
  readonly actor: ActorId;
  readonly sectorId: SectorId;
  readonly men: number;
  readonly turn: number;
}

export interface MatchState {
  readonly world: WorldIdentity;
  /** The validated world plus its derived indexes. Public content, privately held. */
  readonly loadedWorld: LoadedWorld;
  /** The one canonical hex/adjoining-door graph used by movement and later supply. */
  readonly movementGraph: MovementGraph;
  /** Hidden. Never projected — see `projection/project.ts`. */
  readonly seed: string;
  /** Hidden. The single draw source; every consumer forks a labelled stream. */
  readonly rng: Rng;
  readonly actors: readonly ActorId[];
  readonly realms: Readonly<Record<ActorId, Realm>>;
  /** How many partitions the draw chose from. Kept for the publication report. */
  readonly partitionCandidates: number;

  phase: MatchPhase;
  /**
   * Chosen capitals. **Hidden per-viewer until both are locked** — the choice is
   * simultaneous and secret by seal (CP-② D1.3), and public to both from the
   * reveal onward (item 1). The projection enforces that; this map holds truth.
   */
  capitals: Record<ActorId, SectorId>;

  /**
   * How the match ended — `null` until a capital falls, and never cleared.
   *
   * Written once, in the same payoff as the capture that caused it, and paired with
   * `phase: 'match-ended'`. Kept as state rather than derived from the board because
   * a capture also *moves* the sector: a moment after the fall the capital is the
   * winner's ground, so "who no longer holds their capital" stops being answerable
   * from the map the instant it becomes true.
   */
  outcome: MatchOutcome | null;

  /**
   * Who each sector pays — seeded from the opening partition.
   *
   * This is what makes OG-③'s limbo rule computable: a sector pays its controller
   * only when the controller is also its homeland, so the turn ground changes
   * hands it pays neither side, and recapture restores the original claim.
   *
   * **Mutable on purpose, and unwritten so far — but the rule is not open.**
   * **ADR 0044** (2026-07-26) settles what a taken sector does: acquired land
   * transfers everything it carries on the ADR 0022/0029 ripening lag, with the
   * conscription register transferring unripened (ripening applies to productivity,
   * not to bodies), and ADR 0045 keeps a serving force's province-origin composition
   * with the force while remaining civilians travel with the land. Limbo is the
   * interval before integration, not a terminal state.
   *
   * So what is unwritten is the **writer**, which is ticket 06d — not the decision.
   * Freezing this record would still be wrong, for the reason it always was: it would
   * make limbo permanent, which ADR 0044 explicitly amends OG-③ to forbid.
   *
   * An earlier version of this comment called the conversion an "open question owned
   * by the ticket that first takes a sector". It landed hours before ADR 0044 did, on
   * the same day, and was never revisited; a grill later argued from the stale reading
   * before catching it. See `docs/SYNC-DEBT.md`.
   */
  homeland: Record<SectorId, ActorId>;

  /**
   * Acquired ground's integration clock — stable turns completed since it
   * integrated (ADR 0022/0029, given its transfer channel by ADR 0044).
   *
   * **Sparse on purpose.** An absent key means "not ripening": native ground, and
   * acquired ground that has reached its authored usable value and had its entry
   * dropped. So the opening state is `{}` rather than 56 rows saying nothing is
   * happening, and every reader degrades to the authored value.
   *
   * Occupied-but-unintegrated ground has no entry either — limbo is read off
   * `homeland` instead (controlled by one realm, homeland of the other, so it pays
   * neither). The entry appears the moment integration flips `homeland`, which is
   * why these two records are separate: one says *whose it counts as*, this one says
   * *how far along it is*.
   */
  ripening: Record<SectorId, number>;

  /** The two stored stocks, per realm (M14). Everything else is recomputed. */
  readonly forces: Readonly<Record<ActorId, RealmForces>>;

  /**
   * Manned shields, per sector. Seeded at g₀ = 1.0 on border sectors (M13a) and
   * a stock thereafter — nothing in this ticket adds to it, because P1 forbids a
   * free man and the regeneration order lives with ticket 06's damage.
   */
  readonly garrisons: Record<SectorId, GarrisonForce>;

  turn: number;
  /**
   * This turn's blind allocations, per realm: **sector** id -> chips, plus order
   * keys (ADR 0046 item 4).
   *
   * Hidden from every viewer but its owner until both realms lock (ledger D6.1).
   * Cleared by the background tier at renewal, because the stack does not carry
   * over (D6.3).
   */
  commitments: Record<ActorId, Record<string, number>>;
  /** Rich one-turn recruitment requests, hidden from every viewer but their owner. */
  recruitmentOrders: Record<ActorId, Record<string, RecruitmentRequest>>;
  /**
   * This turn's reconnaissance purchases, keyed by target sector, per realm.
   *
   * Hidden from every viewer but its owner for the same reason a commitment is:
   * *where* an opponent is looking is itself intelligence, and publishing it
   * would hand over their read of the board for nothing.
   */
  reconnaissanceOrders: Record<ActorId, Record<SectorId, ReconnaissanceRequest>>;
  /**
   * What each realm has been **told** — one ledger per actor, held beside truth
   * rather than derived from it.
   *
   * This is the state that makes fog `RULINGS.md` ③ decision 1 mechanical: the
   * projection composes a band out of this and out of public facts, and there is
   * no code path on which the true value and a viewer projection meet. The
   * ledger is written only where an observation happens, which is the one place
   * truth is legitimately read — an act of observation is a realm looking at the
   * world.
   */
  intelligence: Record<ActorId, IntelligenceLedger>;
  /** Exact positive recruitment aggregates; projection alone decides who may read them. */
  mobilizationTraces: MobilizationTrace[];
  /**
   * Where an enemy force was standing on somebody's ground at the **end** of a
   * turn, and which way it went to get there.
   *
   * Captured at resolution rather than read live off `Detachment.movement`, for
   * the same reason `mobilizationTraces` is: a pending movement order is a hole
   * card the player may still re-aim during the blind decision beat, so a
   * projection that read it would hand the defender the attacker's plan. This
   * records what already happened.
   */
  borderAlarmTraces: BorderAlarmTrace[];
  /** Own field detachments explicitly assigned to each committed sector. */
  sectorAssignments: Record<ActorId, Record<string, readonly string[]>>;
  /**
   * Realms that have locked this turn's commitment.
   *
   * Note what is **not** here: a `currentActor` field. Gate 02 sealed that member
   * on the Runtime's surface, and ruling R8 (2026-07-25) re-read it as the current
   * *phase* — so the surface keeps the name while the state keeps no actor, because
   * in a simultaneous turn there is no such thing as whose move it is. Legality is
   * "has this realm locked this turn / is the window open", and this array plus
   * `phase` is the whole of it.
   */
  turnLocks: ActorId[];
}

/**
 * Who holds a sector. The renderer's `ownerOf` is this reader's view-side twin.
 *
 * Takes only the two fields it reads, so setup can call it while the rest of the
 * state is still being assembled — which is what keeps `Runtime.open` from growing
 * its own copy of this loop.
 */
export function ownerOfSector(
  state: Pick<MatchState, 'actors' | 'realms'>,
  sector: SectorId,
): ActorId | null {
  for (const actor of state.actors) {
    if (state.realms[actor]!.sectors.includes(sector)) return actor;
  }
  return null;
}

/**
 * The board's contested fronts, over truth.
 *
 * One reader, called by the Runtime's legality rules, its resolution, and the
 * projection alike. Three copies of this closure is how the Runtime and the view
 * would come to disagree about what a front is.
 */
export function frontsOf(state: MatchState): readonly Front[] {
  return contestedFronts(state.loadedWorld.artifact.edges, (sector) => ownerOfSector(state, sector));
}

/**
 * The sectors that actually pay a realm — controlled *and* homeland (OG-③).
 *
 * The single reader for it, for the same reason `frontsOf` is: the Runtime's
 * recompute and the projection both ask this question every turn, and two copies
 * of the limbo rule is how they would come to answer it differently.
 */
export function holdingsOf(state: MatchState, actor: ActorId): SectorId[] {
  return holdsOf(state.realms[actor]!.sectors, state.homeland, actor);
}

/** All serving bodies in garrison posture across the realm's controlled sectors. */
export function garrisonOf(state: MatchState, actor: ActorId): number {
  let total = 0;
  for (const sector of state.realms[actor]!.sectors) {
    const garrison = state.garrisons[sector];
    if (garrison === undefined) continue;
    total += menOf(garrison.ready);
    for (const cohort of garrison.pending) total += menOf(cohort.origins);
  }
  return total;
}
