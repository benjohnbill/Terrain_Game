/**
 * `preview(view, intent) -> PreviewCard` — pure, and outside the Runtime.
 *
 * Gate 02 § 6 places preview among the "pure modules outside the Runtime (no
 * access to truth)", and states that it is used by **both** the human UI and
 * bots. That shared door is the point: a bot that previewed against truth while
 * the human previewed against a projection would be reading a different game.
 *
 * Its input is a `MatchView`, never a `MatchState` — enforced by the type, and
 * the reason this module cannot import from `domain/`.
 */

import type { Intent, MatchView } from '../runtime/types.js';

export interface PreviewCard {
  /** Whether the Runtime would accept this intent, as far as a viewer can tell. */
  readonly admissible: boolean;
  /** Why not, when it would not. Reportable to the player verbatim. */
  readonly reason?: string;
}

/**
 * Ticket 01 previews only what a viewer can check without any rules: that the
 * intent names a real actor, and that it is that actor's move. Outcome
 * previewing — the commit-first UI's whole point — arrives with the tickets that
 * build the orders it previews.
 */
export function preview(view: MatchView, intent: Intent): PreviewCard {
  if (!intent || typeof intent.kind !== 'string' || intent.kind.length === 0) {
    return { admissible: false, reason: 'An intent must carry a non-empty kind.' };
  }
  if (!view.actors.includes(intent.actor)) {
    return { admissible: false, reason: `"${String(intent.actor)}" is not an actor in this match.` };
  }
  if (intent.actor !== view.currentActor) {
    return { admissible: false, reason: `The Runtime is accepting "${view.currentActor}".` };
  }
  return { admissible: true };
}
