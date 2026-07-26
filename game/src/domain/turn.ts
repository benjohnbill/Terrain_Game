/**
 * The turn, in three tiers — and the symmetric resolve order.
 *
 * Authority: duel-pivot ledger **D6.2** (the phase skeleton) and **D6.1 / D6.1a**
 * (simultaneous blind commit → simultaneous reveal, resolved with no first-mover
 * asymmetry). The circled phase numbers the ledger carries (①②④⑤, with no ③
 * defined anywhere) are **dropped rather than back-filled** — user ruling
 * 2026-07-25; the three tiers are the substance and the numbering was vestigial.
 *
 *   decision    the sole agency tier. Both realms allocate the turn's orders from
 *               one 행동력 stack, blind to each other, then lock.
 *   payoff      input 0, attention maximum: the reveal and the resolution. **Not
 *               demotable** — a later "skip it, it's automatic" optimization is
 *               forbidden by seal, because watching *is* the payoff.
 *   background  upkeep and renewal, folded into the payoff's tail. No separate
 *               screen and no extra click: the folded result *is* the next turn's
 *               opening state.
 *
 * Non-demotability is built as a **data dependency** rather than a promise:
 * `readFronts` consumes what `revealTurn` produced, so there is no code path that
 * resolves a turn without having revealed it first.
 *
 * ## The resolve order (ledger D6.1a, designed in this ticket)
 *
 * D6.1a sealed only the *principle* — simultaneous and symmetric, no first-mover
 * asymmetry — and routed the concrete rule into the build, against the real board.
 * Enumerated against `terrain-cradle@r1` under a drawn two-realm partition:
 *
 *  1. **Both realms commit to the same front.** The live case, and the common one.
 *     Resolution: **one engagement per front**, entered by both sides' chips at
 *     once. There is no attacker and no defender role, so there is no first blow
 *     to award; the front's reading is a per-side quantity, symmetric by shape.
 *  2. **Both realms move into the same sector.** *Structurally impossible on this
 *     board.* The partition covers all 56 sectors, so every sector has an owner,
 *     and an owned sector's holder is a party to the front rather than a
 *     co-entrant. It would need an unowned sector, which no draw produces.
 *  3. **One realm vacates as the other enters.** Field movement now exists, but
 *     ownership still changes only through later combat/capture work. Movement and
 *     both sides' front assignments resolve from the same revealed turn, never in
 *     submission order.
 *  4. **One realm commits to two fronts that share a sector.** Real and measured:
 *     `r7_s0` is the door for two different region borders, so a realm can press
 *     it from two sides at once. Resolution: **they stay two fronts**, because a
 *     front is an edge and these are two edges. Whether two pressures on one
 *     sector merge into a single engagement is a *combat* question, and it belongs
 *     to ticket 06's per-sector adjudication rather than to the turn loop.
 *
 * Across all four, the same rule does the work: **fronts resolve in canonical key
 * order, and nothing consults an actor's identity or the order anyone submitted
 * in.** That, plus per-side quantities, is what makes the whole turn equivalent
 * under relabelling the two realms.
 *
 * ## What resolution does *not* do here
 *
 * It changes no ownership, kills nothing, and moves nothing. Ticket 03's mandate is
 * the loop, the blind commit, the symmetric reveal, and the budget; combat is
 * ticket 06 and the capital fall is ticket 07. Each reading therefore carries an
 * explicit `pending` outcome, so a placeholder can never be mistaken for a result.
 */

import type { ActorId, Front } from '../runtime/types.js';
import type { Allocations, FrontAssignments } from './commitment.js';

/**
 * The revealed turn — both realms' allocations, in the open.
 *
 * Produced once, at the head of the payoff tier, and required as the input to
 * resolution. Its existence is the reveal.
 */
export interface RevealedTurn {
  readonly commitments: Readonly<Record<ActorId, Allocations>>;
  readonly assignments: Readonly<Record<ActorId, FrontAssignments>>;
}

/** One front's reading after the reveal. Integers only — shares are a display's. */
export interface FrontReading {
  readonly front: string;
  readonly commitments: Readonly<Record<ActorId, number>>;
  readonly assignments: Readonly<Record<ActorId, readonly string[]>>;
  readonly total: number;
  /**
   * What the engagement resolved to. `pending-operations` until ticket 06 wires
   * the per-sector atomic combat that adjudicates a contact point.
   */
  readonly outcome: 'pending-operations';
}

/** The payoff tier's first act: both blind commitments become public together. */
export function revealTurn(
  actors: readonly ActorId[],
  commitments: Readonly<Record<ActorId, Allocations>>,
  frontAssignments: Readonly<Record<ActorId, FrontAssignments>> = {},
): RevealedTurn {
  const revealed: Record<ActorId, Allocations> = {};
  const assignments: Record<ActorId, FrontAssignments> = {};
  for (const actor of actors) {
    revealed[actor] = { ...(commitments[actor] ?? {}) };
    assignments[actor] = Object.fromEntries(
      Object.entries(frontAssignments[actor] ?? {}).map(([front, ids]) => [front, [...ids]]),
    );
  }
  return { commitments: revealed, assignments };
}

/**
 * The payoff tier's second act: read every front both realms actually engaged.
 *
 * A front nobody committed to produces nothing at all — there is no engagement to
 * report, and emitting an empty one would make "a front was fought over" and "a
 * front exists" indistinguishable in the event stream.
 */
export function readFronts(revealed: RevealedTurn, fronts: readonly Front[]): readonly FrontReading[] {
  const readings: FrontReading[] = [];

  // Canonical order, decided by the board rather than by either player.
  for (const front of fronts) {
    const commitments: Record<ActorId, number> = {};
    const assignments: Record<ActorId, readonly string[]> = {};
    let total = 0;
    for (const actor of front.owners) {
      const chips = revealed.commitments[actor]?.[front.key] ?? 0;
      commitments[actor] = chips;
      assignments[actor] = [...(revealed.assignments[actor]?.[front.key] ?? [])];
      total += chips;
    }
    if (total === 0) continue;
    readings.push({ front: front.key, commitments, assignments, total, outcome: 'pending-operations' });
  }

  return readings;
}
