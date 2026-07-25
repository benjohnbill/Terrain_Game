/**
 * Where the two realms touch.
 *
 * A **front** is a contested border: an authored edge whose two front sectors are
 * held by different realms. Edges are the doors between regions (gate 06 D4), and
 * a partition assigns whole regions, so these edges are the *entire* surface on
 * which the duel is fought — measured on `terrain-cradle@r1`, a drawn partition
 * leaves 4 to 6 of the world's 17 edges contested, and `sectorAdjacency` carries
 * no cross-region link at all.
 *
 * Every field here is derived from public data. Territory is public — fog governs
 * forces and intent, not borders — so a front set can be handed to a viewer
 * without blurring, and `preview` can read it from a projection.
 *
 * Symmetry is structural rather than promised: `sectors` is sorted by sector id
 * and `owners` is aligned to it, so nothing about a front depends on which realm
 * was seated first. That is what lets resolution be relabelling-equivalent
 * (ledger D6.1a).
 */

import { edgeKey } from '../world/schema.js';
import type { Edge, SectorId } from '../world/schema.js';
import type { ActorId, Front } from '../runtime/types.js';

/**
 * The contested fronts of a board, in canonical (sorted-key) order.
 *
 * `ownerOf` is passed in rather than read from anywhere, which is what keeps this
 * usable by both the Runtime (over truth) and `preview` (over a projection)
 * without either gaining the other's access.
 */
export function contestedFronts(
  edges: readonly Edge[],
  ownerOf: (sector: SectorId) => ActorId | null,
): readonly Front[] {
  const fronts: Front[] = [];

  for (const edge of edges) {
    const [x, y] = edge.a < edge.b ? [edge.a, edge.b] : [edge.b, edge.a];
    const ownerX = ownerOf(x);
    const ownerY = ownerOf(y);
    // An edge inside one realm is not a front; nor is one whose endpoint nobody
    // holds (which the current partition never produces, since it covers every
    // sector — but a later map or a mid-match cession could).
    if (ownerX === null || ownerY === null || ownerX === ownerY) continue;

    fronts.push({ key: edgeKey(x, y), sectors: [x, y], owners: [ownerX, ownerY] });
  }

  return fronts.sort((p, q) => (p.key < q.key ? -1 : p.key > q.key ? 1 : 0));
}

/** Whether an actor holds one side of this front. */
export function isPartyTo(front: Front, actor: ActorId): boolean {
  return front.owners[0] === actor || front.owners[1] === actor;
}
