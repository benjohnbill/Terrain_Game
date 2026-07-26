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

export {
  boardBounds,
  CHOKE_STYLE,
  hexCenter,
  hexCorners,
  hexPolygon,
  ownerOf,
  realmBorderSegments,
  sectorCenter,
  TERRAIN_TINT,
} from './map-geometry.js';
export type { BorderSegment, Bounds, Point } from './map-geometry.js';

/** What a renderer must accept. Note the input: a view, never a state. */
export interface Renderer {
  draw(view: MatchView): void;
}

/**
 * A renderer that writes the projection as text. Kept alongside the map because
 * it exercises the "consumes only projection" boundary in a form a test can read
 * at a glance, and because a headless lane needs something to assert on.
 */
export function describeProjection(view: MatchView): string {
  const holdings = view.realms
    .map((r) => `${r.actor} ${r.regions.length}r/${r.sectors.length}s pop ${r.population.toFixed(1)} econ ${r.economy.toFixed(2)}`)
    .join('\n         ');

  return [
    `world    ${view.world.worldId}@${view.world.revision}`,
    `viewer   ${view.viewer}`,
    `turn     ${view.turn}  phase ${view.phase}`,
    `board    ${view.board.regions.length} regions · ${Object.keys(view.board.sectors).length} sectors · ${view.board.edges.length} edges`,
    `realms   ${holdings}`,
    `capitals ${
      Object.keys(view.capitals).length === 0
        ? '(none visible to this viewer)'
        : Object.entries(view.capitals)
            .map(([actor, sector]) => `${actor}=${sector}`)
            .join(', ')
    }`,
    `locked   ${view.committed.length === 0 ? '(none yet)' : view.committed.join(', ')}`,
    `fronts   ${view.fronts.length === 0 ? '(none contested)' : view.fronts.map((f) => f.key).join(' ')}`,
    `stack    ${view.commitment.spent}/${view.commitment.budget} 행동력 committed`,
    `detachments ${view.detachments.length === 0
      ? '(none visible)'
      : view.detachments.map((detachment) => {
          const destination = detachment.destination === null
            ? '(holding)'
            : `${detachment.destination.q},${detachment.destination.r}`;
          return `${detachment.id}@${detachment.position.q},${detachment.position.r}->${destination} ` +
            `${detachment.turnsRemaining}t ${detachment.readyMen} ready +${detachment.pendingMen} next-battle`;
        }).join(' ')}`,
    `garrisons ${view.garrisons.length === 0
      ? '(none visible)'
      : view.garrisons.map((garrison) =>
          `${garrison.sectorId}:${garrison.readyMen} ready +${garrison.pendingMen} next-battle`).join(' ')}`,
    `recruitment ${view.recruitmentOrders.length === 0
      ? '(none planned)'
      : view.recruitmentOrders.map((order) =>
          `${order.requestId}@${order.sectorId}:${order.posture}/${order.commit}`).join(' ')}`,
    `mobilization ${view.mobilizationSignals.length === 0
      ? '(none observed)'
      : view.mobilizationSignals.map((signal) =>
          `${signal.actor}@${signal.sectorId}:${signal.band}/t${signal.observedTurn}`).join(' ')}`,
  ].join('\n');
}
