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
export type { PreviewCard, RecruitmentPreview } from '../preview/preview.js';
export { decideBotIntent } from '../bot/index.js';
export { capitalChoiceRefusal } from '../domain/capital-choice.js';
export type { CapitalChoiceContext } from '../domain/capital-choice.js';
export {
  allocationRefusal,
  commitmentShare,
  isOrderKey,
  lockRefusal,
  recruitmentCommitOf,
  recruitmentOrderKeyOf,
  sectorAssignmentRefusal,
  spentOf,
  TURN_COMMITMENT_BUDGET,
} from '../domain/commitment.js';
export type {
  Allocations,
  AssignableDetachment,
  CommitmentContext,
  SectorAssignments,
} from '../domain/commitment.js';
export {
  CAP_LAND_FRAC,
  CAP_PER_POP,
  forceLimitOf,
  GARRISON_PER_BORDER_SECTOR,
  holdsOf,
  incomeOf,
  landValueOf,
  MEN_PER_YIELD,
  REGISTER_PER_POP,
  registerOf,
  START_FIELD_FRACTION,
  startingTreasuryOf,
  TREASURY_START_TURNS,
} from '../domain/economy.js';
export type { SectorTable } from '../domain/economy.js';
export {
  BATTLE_FATIGUE_COEF,
  battleAccrual,
  CONVERSION_CONVEXITY_EXP,
  CONVERSION_TERMINAL_LEDGER,
  effectiveness,
  EFFECTIVENESS_FLOOR,
  isStarving,
  RECOVERY_BASE_RATE,
  RECOVERY_REQUIRES_STATIONARY,
  RECOVERY_SUPPLY_CURVE_EXP,
  recoveryPerTurn,
  STARVATION_ENTRY_THRESHOLD,
  STARVATION_LOSS_COEF,
  STARVATION_LOSS_EXP,
  starvationLossFraction,
  SUPPLY_PUMP_PER_CUT_TURN,
  supplyTick,
  turnUpkeep,
} from '../domain/fatigue.js';
export type { FatigueLedgers, UpkeepResult } from '../domain/fatigue.js';
export { contestedFronts, isPartyTo } from '../domain/fronts.js';
export {
  advanceOneTurn,
  buildMovementGraph,
  FORCED_MARCH_EXTRA_CAP,
  FORCED_MARCH_PREMIUM,
  MARCH_FATIGUE_PER_HEX,
  MARCH_SPEED,
  minimumCostRoute,
  movementOrderRefusal,
  musterHexOf,
  reachCone,
  terrainMovementCost,
} from '../domain/movement.js';
export type { MovementApproach, MovementArc, MovementGraph, MovementNode } from '../domain/movement.js';
export {
  draftBill,
  draftOrder,
  marginalPrice,
  ORDER_RECRUIT,
  RECRUIT_FRACTION_PER_POINT,
  recruitmentRequestRefusal,
  settleRecruitmentBatch,
  SURGE,
} from '../domain/recruitment.js';
export type {
  DraftContext,
  DraftResult,
  RecruitmentBatchContext,
  RecruitmentBatchResult,
  RecruitmentFulfillment,
  RecruitmentLegalityContext,
  RecruitmentPosture,
  RecruitmentRequest,
} from '../domain/recruitment.js';
export {
  activateReadyCohorts,
  availableCiviliansByOrigin,
  combatEligibleMen,
  fieldOf,
  menOf,
  mergeDetachments,
  mergeDetachmentsRefusal,
  servingByOrigin,
  splitDetachment,
  splitDetachmentRefusal,
} from '../domain/force.js';
export type {
  Detachment,
  ForceCohort,
  GarrisonForce,
  MovementOrder,
  OriginComposition,
  PendingCohort,
} from '../domain/force.js';
export { readFronts, revealTurn } from '../domain/turn.js';
export type { FrontReading, RevealedTurn } from '../domain/turn.js';
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
  HexPosition,
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
  AllocateCommitmentIntent,
  AllocateOrderIntent,
  AllocateRecruitmentIntent,
  ChooseCapitalIntent,
  Clock,
  CommitmentView,
  DetachmentView,
  EconomyView,
  Front,
  GameEvent,
  GarrisonView,
  Intent,
  LockCommitmentIntent,
  MatchConfig,
  MatchPhase,
  MatchView,
  MergeDetachmentsIntent,
  MobilizationSignalView,
  MoveDetachmentIntent,
  ProvinceForcesView,
  RealmView,
  RejectedEvent,
  SplitDetachmentIntent,
  TurnTier,
  ViewerId,
  WorldIdentity,
} from './types.js';
export * from '../domain/battle.js';
export * from '../domain/engagement.js';
