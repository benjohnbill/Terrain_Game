# 06 — Board verbs + emergent siege: the Moscow trap (판 동사 + 창발 공성)

**What to build:** The two defense choices that avoid the calculator, plus
the siege that emerges from supply arithmetic. Strategic Abandonment
(전략적 포기) is a free declaration — immediate transfer of the sector,
action saved. Scorched Earth (청야 소각) is a turn-consuming action that
destroys the sector's usable value and disrupts its routes — the occupier
inherits ash. A garrison whose routes are cut accrues the supply ledger
(ticket 01) and melts continuously: besieging IS pouring turns into the
defender's supply ledger — no siege object, no multi-turn operation state.
The integration demo is the full Moscow trap authored from these parts:
burn and cede → the occupier sits on ash with stretched routes → interdiction
cuts them → no recovery, starvation melts the force → encirclement finishes
it (BLOCKED escape → annihilation via the engagement calculator).

Authoritative design: slice-2 design spec §8 (board verbs), §2 (siege clock);
verb semantics per their operation-plan catalog claim blocks (pointers).

**Blocked by:** 02 — Movement contract; 03 — Engagement v2.

**Status:** landed (2026-07-15, `js/board-verbs.js` + `js/fatigue.js` +
`tests/board-verbs.test.js`, suite green 372/372, zero regressions; merged to
main at 4eaa596, doc-sync 79d25e3). Checkboxes marked retroactively 2026-07-16
after verifying each against the landed tests — the landing session left them
unmarked.

- [x] Abandonment: no battle, immediate transfer, the turn action is saved.
      `abandon` transfers control immediately (red → blue) with `actionSaved:
      true` and `battle: false`; the sector is ceded intact (usableValue 100,
      fortification preserved — do not burn what you could keep), and the
      transform is pure (the input sector is untouched).
- [x] Scorched Earth: consumes the turn; the sector's usable value is
      destroyed and its routes disrupted; an ash sector gives the occupier
      no recovery. `scorchedEarth` burns usableValue 100 → 0, sets `ash`,
      disrupts routes, and leaves control unchanged (it is self-damage, not a
      transfer); commitment scales thoroughness (hasty torching vs near-total
      denial). The ash gate denies recovery even when fed through intact
      routes.
- [x] Cut-route garrison: supply ledger rises per turn, recovery locked,
      substance melts continuously; restoring the route stops the melt.
      `siegeUpkeep` delegates to `Fatigue.turnUpkeep` via the `recoveryFactor`
      parameter added in the review pass — no siege object, no second
      arithmetic. Restoring the route stops the melt and resumes recovery.
- [x] Moscow trap scenario passes end-to-end: burn → lure → cut → starve →
      annihilate, using only existing verbs and rules. The test authors the
      full chain over a real hex corridor using the real `movement.isSupplied`
      predicate and the sealed calculator: burn → occupy ash (wear stays 6 —
      ash denied every point of recovery — while still fed) → interdict the mid
      corridor (`isSupplied` → false) → 7 turns of starvation melt 1000 → under
      300 → encircle with escape BLOCKED → `annihilated: true`,
      `loserTotalLoss: 1`. The control comparison is the proof it is emergent:
      the same relief army at the same wear LOSES to a healthy occupier and
      annihilates the starved one — the melt flipped the ratio, not a special
      rule.

**Implementation rulings:**

- **`fatigue.turnUpkeep` gained `recoveryFactor` [0,1]** (review-pass refactor):
  the ash-denies-recovery multiply belonged inside fatigue.js rather than
  re-derived in `siegeUpkeep`. The ground gates the wear ledger alone — the §2
  starvation firewall (substance is supply-exclusive) is untouched.
- **§2 recovery model — ground/ash gate note:** registered as a sync debt the
  same day and **PAID** by the doc-sync batch (`docs/SYNC-DEBT.md`, 2026-07-15).
  No open debt remains for this ticket.
