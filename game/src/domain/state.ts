/**
 * Authoritative match state — the truth the Runtime privately owns.
 *
 * This type never leaves the Runtime. Callers receive a `MatchView` built by
 * `projection/project.ts`; there is no snapshot API by which this shape could
 * escape (gate 02 § 6).
 */

import { holdsOf } from './economy.js';
import { contestedFronts } from './fronts.js';
import type { LoadedWorld } from '../world/load.js';
import type { SectorId } from '../world/schema.js';
import type { ActorId, Front, MatchPhase, WorldIdentity } from '../runtime/types.js';
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
 * `field` is the mobile main force the land-derived ceiling caps; `garrisons` are
 * the fortress shields, held per sector because that is how M13a sizes them.
 */
export interface RealmForces {
  /** Yield in hand. Spent on drafts; never published to the opponent. */
  treasury: number;
  /** The field army, in men. Ceilinged by the land-derived force limit. */
  field: number;
  /** Total draftable bodies — a stock that only death shrinks (MT-②). */
  register: number;
}

export interface MatchState {
  readonly world: WorldIdentity;
  /** The validated world plus its derived indexes. Public content, privately held. */
  readonly loadedWorld: LoadedWorld;
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
   * Who each sector's population belongs to, fixed by the opening partition and
   * never rewritten.
   *
   * This is what makes OG-③'s limbo rule computable: a sector pays its controller
   * only when the controller is also its homeland. A duel has no settlement
   * channel to integrate conquered ground through, so occupied land stays in
   * limbo for as long as it is held, and recapture restores the claim.
   */
  readonly homeland: Readonly<Record<SectorId, ActorId>>;

  /** The two stored stocks, per realm (M14). Everything else is recomputed. */
  readonly forces: Readonly<Record<ActorId, RealmForces>>;

  /**
   * Manned shields, per sector. Seeded at g₀ = 1.0 on border sectors (M13a) and
   * a stock thereafter — nothing in this ticket adds to it, because P1 forbids a
   * free man and the regeneration order lives with ticket 06's damage.
   */
  readonly garrisons: Record<SectorId, number>;

  turn: number;
  /**
   * This turn's blind allocations, per realm: front key -> chips.
   *
   * Hidden from every viewer but its owner until both realms lock (ledger D6.1).
   * Cleared by the background tier at renewal, because the stack does not carry
   * over (D6.3).
   */
  commitments: Record<ActorId, Record<string, number>>;
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

/** Who holds a sector. The renderer's `ownerOf` is this reader's view-side twin. */
export function ownerOfSector(state: MatchState, sector: SectorId): ActorId | null {
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

/** Men manning shields across everything a realm currently controls. */
export function garrisonOf(state: MatchState, actor: ActorId): number {
  let total = 0;
  for (const sector of state.realms[actor]!.sectors) total += state.garrisons[sector] ?? 0;
  return total;
}
