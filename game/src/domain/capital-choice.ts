/**
 * The capital-choice rule, in one place.
 *
 * The Runtime and `preview` must answer identically — a preview that said yes
 * where `submit` says no would teach the player a rule the game does not have.
 * Keeping two copies in step by testing them against each other makes the tests
 * the cost of the duplication rather than a cure, and every later capital
 * change (ticket 07) would have to edit both. So the rule lives here once, as a
 * pure function over plain values, and both callers pass what they have.
 *
 * That is also why this file imports no `MatchState`: it is a *rule*, not truth.
 * `preview` may read it without gaining any access to what the Runtime knows.
 */

import type { SectorId } from '../world/schema.js';

/** Everything the rule needs, and nothing that would leak truth. */
export interface CapitalChoiceContext {
  readonly inSelectionPhase: boolean;
  readonly alreadyLocked: boolean;
  readonly ownedSectors: readonly SectorId[];
}

/**
 * Returns a reportable refusal, or `null` when the choice is legal.
 *
 * Eligibility is **ownership**, and nothing else (ruling R3, SEALED 2026-07-25):
 * any sector the realm holds is a legal site. The authored `capitals`/`cities`
 * markers are advisory map content and deliberately play no part here.
 */
export function capitalChoiceRefusal(
  context: CapitalChoiceContext,
  actor: string,
  sector: SectorId | undefined,
): string | null {
  if (!context.inSelectionPhase) return 'Capitals are chosen once, at match start.';
  if (context.alreadyLocked) return `"${actor}" has already locked a capital this match.`;
  if (typeof sector !== 'string' || sector.length === 0) return 'A capital choice must name a sector.';
  if (!context.ownedSectors.includes(sector)) {
    return `"${sector}" is not a sector "${actor}" owns; a capital may be placed on any owned sector.`;
  }
  return null;
}
