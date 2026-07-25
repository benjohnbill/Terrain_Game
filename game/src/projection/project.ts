/**
 * The blur seam.
 *
 * Gate 02 seals that the Runtime privately owns truth and that projection is
 * where truth is blurred — **once**, on the way out. Everything downstream (the
 * renderer, the UI, `preview`, the bot) sees only what this function emitted, so
 * a leak here is a leak everywhere and cannot be corrected later.
 *
 * What each viewer may *know* is gate 03's contract, and the fog band that
 * implements it arrives with ticket 08. This function carries the structure and
 * the one invariant that is testable today: hidden state does not cross.
 */

import type { MatchState } from '../domain/state.js';
import type { MatchView, ViewerId } from '../runtime/types.js';

/**
 * Builds the viewer-safe view of a match.
 *
 * Note what is *not* copied: the seed, the RNG, and anything reachable from
 * them. That omission is the seam. `tests/projection.contract.test.js` asserts
 * it by searching the serialized projection for the seed, so a future field that
 * carried truth through would fail rather than ship.
 */
export function project(state: MatchState, viewer: ViewerId): MatchView {
  return {
    world: { worldId: state.world.worldId, revision: state.world.revision },
    viewer,
    turn: state.turn,
    currentActor: state.currentActor,
    actors: [...state.actors],
  };
}
