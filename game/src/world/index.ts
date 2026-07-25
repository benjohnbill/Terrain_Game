/**
 * The authored world seam.
 *
 * The real artifact — terrain-cradle terrain re-implemented as a checked-in
 * TS/ESM module with an immutable `(worldId, revision)`, explicit intra-region
 * adjacency, and a fail-closed tier-1 loader — is **ticket 02's** to build,
 * against gate 06 § Answer D1-D6.
 *
 * Ticket 01 only has to boot, so all it needs from a world is its identity.
 * What is deliberately absent is any terrain content: authoring even a
 * placeholder board here would put map values in the tree ahead of the ticket
 * and the contract that own them.
 */

import type { WorldIdentity } from '../runtime/types.js';

/**
 * The identity the viewer boots against until ticket 02 publishes the real
 * artifact. It names no terrain and carries no values — it exists so the boot
 * path can prove `(worldId, revision, seed)` flows end to end.
 */
export const BOOT_WORLD: WorldIdentity = Object.freeze({
  worldId: 'boot-null-world',
  revision: '0',
});
