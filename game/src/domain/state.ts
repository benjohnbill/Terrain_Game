/**
 * Authoritative match state — the truth the Runtime privately owns.
 *
 * This type never leaves the Runtime. Callers receive a `MatchView` built by
 * `projection/project.ts`; there is no snapshot API by which this shape could
 * escape (gate 02 § 6).
 */

import type { LoadedWorld } from '../world/load.js';
import type { SectorId } from '../world/schema.js';
import type { ActorId, MatchPhase, WorldIdentity } from '../runtime/types.js';
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
   * Sealed by gate 02 § 6 as `currentActor -> ActorId`, and implemented here
   * exactly as sealed.
   *
   * That seal predates the duel pivot, which made both realms commit
   * simultaneously and in secret (ledger D6.1). Re-expressing it — reading
   * `currentActor` as the current *phase*, and legality as "has this realm
   * already locked this turn" — is a standing proposal awaiting a ruling
   * (`DECISIONS-OWED.md` § 1.3) and belongs to **ticket 03**, which owns the
   * turn loop. Do not pre-empt it here.
   *
   * Note what the capital-selection phase already demonstrates: its legality
   * rule is "has this realm locked yet", and it needs no single current actor at
   * all. Gate 02's actual guarantee — the *Runtime*, not the caller, decides
   * what is legal now — holds either way, which is the evidence ticket 03's
   * ruling can lean on.
   */
  currentActor: ActorId;
}
