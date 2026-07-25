/**
 * `preview(view, intent) -> PreviewCard` — pure, and outside the Runtime.
 *
 * Gate 02 § 6 places preview among the "pure modules outside the Runtime (no
 * access to truth)", and states that it is used by **both** the human UI and
 * bots. That shared door is the point: a bot that previewed against truth while
 * the human previewed against a projection would be reading a different game.
 *
 * Its input is a `MatchView`, never a `MatchState` — enforced by the type. It
 * may read a *rule* from `domain/` (a pure function over plain values, which is
 * how it and the Runtime stay in step by construction); it may never read truth.
 */

import { capitalChoiceRefusal } from '../domain/capital-choice.js';
import type { Intent, MatchView, SectorId } from '../runtime/types.js';

export interface PreviewCard {
  /** Whether the Runtime would accept this intent, as far as a viewer can tell. */
  readonly admissible: boolean;
  /** Why not, when it would not. Reportable to the player verbatim. */
  readonly reason?: string;
}

const no = (reason: string): PreviewCard => ({ admissible: false, reason });

/**
 * What a viewer can check without truth. Kept deliberately in step with the
 * Runtime's own guards: a preview that said yes where `submit` says no would
 * teach the player a rule the game does not have.
 */
export function preview(view: MatchView, intent: Intent): PreviewCard {
  if (!intent || typeof intent.kind !== 'string' || intent.kind.length === 0) {
    return no('An intent must carry a non-empty kind.');
  }
  if (!view.actors.includes(intent.actor)) {
    return no(`"${String(intent.actor)}" is not an actor in this match.`);
  }

  if (intent.kind === 'choose-capital') {
    const refusal = capitalChoiceRefusal(
      {
        inSelectionPhase: view.phase === 'capital-selection',
        alreadyLocked: view.capitalLocked.includes(intent.actor),
        ownedSectors: view.realms.find((r) => r.actor === intent.actor)?.sectors ?? [],
      },
      intent.actor,
      (intent as { sector?: SectorId }).sector,
    );
    return refusal === null ? { admissible: true } : no(refusal);
  }

  return no(`No resolution is wired for intent kind "${intent.kind}" yet.`);
}
