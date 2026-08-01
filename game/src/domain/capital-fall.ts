/**
 * The win check, in one place — **ADR 0042**, capital fall as the sole win condition.
 *
 * A pure rule over plain values, for `capital-choice.ts`'s reason: a rule that lives
 * inside the Runtime is a rule nothing can test directly, and this one carries a
 * refusal that must be *provable* rather than grepped for. It imports no `MatchState`.
 *
 * The whole check is one sentence (ticket 07 acceptance item 3, user 2026-07-25):
 * **is the captured sector this loser's capital.** No capital-specific threshold, no
 * "overwhelming" gate, no second predicate. CP-② item 5's "overwhelming decisive
 * battle" names the path a player walks, not a bar this checks — what makes a capital
 * hard to take is the guard's magnitude, and the guard is an ordinary garrison that an
 * ordinary battle must beat.
 */

import type { SectorId } from '../world/schema.js';
import type { ActorId, MatchOutcome } from '../runtime/types.js';

/** One sector changing hands, as resolution decided it and before it is applied. */
export interface SectorCapture {
  readonly sector: SectorId;
  readonly taker: ActorId;
  readonly loser: ActorId;
}

/**
 * The outcome these captures produce, or `null` if none of them is a capital.
 *
 * **Takes the captures decided but not yet applied**, and that ordering is the point:
 * a capture moves the sector to its taker, so "whose capital is now held by someone
 * else" stops being answerable from the board at the exact moment it becomes true.
 * Asking here also means the refusal below fires while the board is still intact.
 *
 * **A simultaneous double fall throws rather than choosing.** Two capitals can fall in
 * one payoff — A's army on B's capital while B's stands on A's — and that is not a
 * freak case: it is the mutual-exposure duel CP-② item 9 calls the heart of the match
 * frame, both players all-in on offense at once. Nothing rules what it names:
 *
 * - **ADR 0042** names a winner for *a* capital fall, and ledger **D3.1** forbids a
 *   draw path and a tiebreak-win, so neither "both lose" nor "score it" is available;
 * - **D6.1a** forbids application order introducing first-mover asymmetry, so taking
 *   whichever capture resolved first is not available either.
 *
 * The user ruled (2026-08-01) to pin the refusal rather than invent an answer, so this
 * throws and says so. Registered as `DECISIONS-OWED.md` Part 2 row 17; it converts to
 * one branch here once ruled.
 */
export function capitalFallOf(
  captures: readonly SectorCapture[],
  capitals: Readonly<Record<ActorId, SectorId>>,
  turn: number,
): MatchOutcome | null {
  const fallen = captures.filter((capture) => capitals[capture.loser] === capture.sector);
  if (fallen.length === 0) return null;
  if (fallen.length > 1) {
    const named = fallen
      .map((capture) => `${capture.sector} (${capture.loser} → ${capture.taker})`)
      .join(' and ');
    throw new Error(
      `Two capitals fell in one payoff — ${named} — and no seal says what that names. ` +
        'ADR 0042 names a winner for one fall; ledger D3.1 forbids a draw and a ' +
        'tiebreak; D6.1a forbids letting resolve order decide. Refusing rather than ' +
        'choosing (user ruling 2026-08-01) — see DECISIONS-OWED Part 2 row 17.',
    );
  }

  const capture = fallen[0]!;
  return { winner: capture.taker, loser: capture.loser, capital: capture.sector, turn };
}
