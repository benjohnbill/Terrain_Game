/**
 * The authored world: schema, the frozen artifact, the fail-closed loader, and
 * the two-realm partition draw.
 *
 * Nothing here runs the generator. Gate 06 D1 makes the canonical world a
 * checked-in artifact the Runtime only *reads*, which is what turns
 * `(world identity, seed, intent log)` into a real reproducibility claim — the
 * world leg is frozen content rather than a per-boot computation. The generator
 * lives on as a workshop tool behind `game/tools/bake-world.js`.
 */

export { CRADLE_R1 } from './cradle-r1.js';
export { loadWorld, WorldLoadError } from './load.js';
export type { LoadedWorld } from './load.js';
export { drawPartition, enumerateCandidatePartitions, PartitionError } from './partition.js';
export type { Partition } from './partition.js';
export { canonicalize, contentHashOf } from './content-hash.js';
export { edgeKey, hexKey, HEX_NEIGHBOURS, SUPPORTED_SCHEMA_VERSION } from './schema.js';
export type {
  Choke,
  ChokeClass,
  Edge,
  MapUnit,
  Region,
  RegionId,
  Sector,
  SectorId,
  TerrainLayer,
  WorldArtifact,
  WorldMeta,
} from './schema.js';
