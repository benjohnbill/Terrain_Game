/**
 * The emitted runtime graph's entry point.
 *
 * This is the module both acceptance lanes load — `test:game` by Node dynamic
 * import and `test:browser:game` through Playwright — from the *same* emitted
 * artifact, with no per-host re-transpile (gate 05 D6).
 */

export { Runtime } from './runtime.js';
export { createRng } from './rng.js';
export type { Rng } from './rng.js';
export { project } from '../projection/project.js';
export { preview } from '../preview/preview.js';
export type { PreviewCard } from '../preview/preview.js';
export { decideBotIntent } from '../bot/index.js';
export { capitalChoiceRefusal } from '../domain/capital-choice.js';
export type { CapitalChoiceContext } from '../domain/capital-choice.js';
export {
  boardBounds,
  CHOKE_STYLE,
  describeProjection,
  hexCenter,
  hexCorners,
  hexPolygon,
  ownerOf,
  realmBorderSegments,
  sectorCenter,
  TERRAIN_TINT,
} from '../renderer/index.js';
export type { BorderSegment, Bounds, Point, Renderer } from '../renderer/index.js';
export {
  canonicalize,
  contentHashOf,
  CRADLE_R1,
  drawPartition,
  edgeKey,
  enumerateCandidatePartitions,
  hexKey,
  HEX_NEIGHBOURS,
  loadWorld,
  PartitionError,
  SUPPORTED_SCHEMA_VERSION,
  WorldLoadError,
} from '../world/index.js';
export type {
  Choke,
  ChokeClass,
  Edge,
  LoadedWorld,
  MapUnit,
  Partition,
  Region,
  RegionId,
  Sector,
  SectorId,
  TerrainLayer,
  WorldArtifact,
  WorldMeta,
} from '../world/index.js';
export type {
  ActorId,
  ChooseCapitalIntent,
  Clock,
  GameEvent,
  Intent,
  MatchConfig,
  MatchPhase,
  MatchView,
  RealmView,
  RejectedEvent,
  ViewerId,
  WorldIdentity,
} from './types.js';
