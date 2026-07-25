/**
 * `decideBotIntent(view, seed) -> Intent` — the bot seam.
 *
 * Gate 02 § 6 makes the bot an **ordinary caller**: it reads a `MatchView` like
 * any viewer, and submits through the same door a human's intent goes through,
 * so the Runtime rejects a bot's illegal intent exactly as it rejects a human's.
 * It never receives `MatchState`, which is why this module cannot import from
 * `domain/`.
 *
 * The bot that actually plays — a rational actor reasoning on the player's own
 * instruments, its disposition governing recon share, where inside the
 * confidence band it reads, and how often it acts, with variety drawn from the
 * injected seed — is **ticket 12's**, and several of its values are still
 * unlanded (DECISIONS-OWED R4, Part 2 #12).
 */

import type { Intent, MatchView } from '../runtime/types.js';

/**
 * Ticket 01 ships the signature and the determinism contract, not a policy.
 * It throws rather than returning a filler intent: a stub that quietly passed
 * would let a later ticket mistake "the bot does nothing" for "the bot decided
 * to do nothing".
 */
export function decideBotIntent(_view: MatchView, _seed: string): Intent {
  throw new Error(
    'No bot policy is wired yet — ticket 12 owns it, and its disposition values are still unlanded.',
  );
}
