/**
 * Authoritative match state — the truth the Runtime privately owns.
 *
 * This type never leaves the Runtime. Callers receive a `MatchView` built by
 * `projection/project.ts`; there is no snapshot API by which this shape could
 * escape (gate 02 § 6).
 *
 * Ticket 01 is the boot ticket, so this carries only what opening a match
 * requires: which world, which seed, who is playing, and where the turn counter
 * stands. Board, forces, fog, and orders arrive with the tickets that build
 * them, each against its own sealed contract.
 */

import type { ActorId, WorldIdentity } from '../runtime/types.js';
import type { Rng } from '../runtime/rng.js';

export interface MatchState {
  readonly world: WorldIdentity;
  /** Hidden. Never projected — see `projection/project.ts`. */
  readonly seed: string;
  /** Hidden. The single draw source; every consumer forks a labelled stream. */
  readonly rng: Rng;
  readonly actors: readonly ActorId[];
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
   * turn loop. Do not pre-empt it here: an unsealed reading baked into the boot
   * ticket is exactly the kind of invented rule the readiness test forbids.
   */
  currentActor: ActorId;
}
