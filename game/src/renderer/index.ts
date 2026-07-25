/**
 * The renderer seam.
 *
 * The rule that governs this layer is a boundary, not a style: a renderer
 * **consumes viewer-safe projection data only**. It is handed a `MatchView`;
 * it can no more reach truth than the player can.
 *
 * Drawing the board — region, front-sector, route, terrain, and realm identity,
 * under gate 07's commit-first interaction skeleton and coupled continuous
 * camera — is ticket 02's and ticket 04's. Grey-box is the correct end state for
 * this whole map, not a compromise: visual beauty is carved out by user ruling
 * and gets layered on while playing.
 */

import type { MatchView } from '../runtime/types.js';

/** What a renderer must accept. Note the input: a view, never a state. */
export interface Renderer {
  draw(view: MatchView): void;
}

/**
 * A renderer that writes the projection as text. It exists so the boot path has
 * something honest to show before there is a board, and so the "consumes only
 * projection" boundary is exercised from day one.
 */
export function describeProjection(view: MatchView): string {
  return [
    `world    ${view.world.worldId}@${view.world.revision}`,
    `viewer   ${view.viewer}`,
    `turn     ${view.turn}`,
    `accepting ${view.currentActor}`,
    `actors   ${view.actors.join(', ')}`,
  ].join('\n');
}
