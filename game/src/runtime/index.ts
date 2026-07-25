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
export { BOOT_WORLD } from '../world/index.js';
export type {
  ActorId,
  Clock,
  GameEvent,
  Intent,
  MatchConfig,
  MatchView,
  RejectedEvent,
  ViewerId,
  WorldIdentity,
} from './types.js';
