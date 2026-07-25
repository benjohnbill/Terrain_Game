/**
 * Authoritative match state — the truth the Runtime privately owns.
 *
 * This type never leaves the Runtime. Callers receive a `MatchView` built by
 * `projection/project.ts`; there is no snapshot API by which this shape could
 * escape (gate 02 § 6).
 */

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
