# 04 — Field-army division/merge + commit budget (군 분할·합류 + 커밋 예산)

**What to build:** The two realm resources get their sealed definitions in
code. The field army divides and merges freely as turn actions — a detachment
is a real force with its own position and fatigue; splitting inherits the
parent's fatigue, merging takes the size-weighted average (conservation of
tiredness: fatigue × men is invariant, so no laundering exists). No detachment
count cap — the system prices choices, it does not prohibit them; defeat in
detail is the natural price and must emerge from the arithmetic, not from a
rule. Commit becomes a per-turn regenerating, non-bankable realm budget from
which every commit-consuming use draws: engagement levers and an abstract
development sink at minimum (the "commit 12 to the war, 8 to development"
shape).

Authoritative design: slice-2 design spec §4.

**Blocked by:** 01 — Fatigue core; 02 — Movement contract.

**Status:** landed (2026-07-15, `js/field-army.js` + `js/commit.js` +
`tests/field-army.test.js` + `tests/commit.test.js`, suite green 350/350 at the
merge — re-measured 2026-07-16, not recalled — zero regressions; merged to main
at 1950b36). Pure calculators: neither module is wired into `game.js` (verified
— they are referenced only by their tests), the same posture as tickets 03/05.
Checkboxes marked retroactively 2026-07-16 after verifying each against the
landed tests — the landing session left them unmarked.

- [x] Split/merge conserve substance exactly and tiredness exactly
      (fatigue × men invariant across any split/merge sequence). **With one
      honest qualifier the review pass established:** substance is bit-exact
      (`assert.equal`) across a three-way split → partial merge → re-split
      sequence, and Σ(size × ledger) is conserved *mathematically*. But when
      detachments that marched different distances merge, the size-weighted
      average round-trips through divide-then-multiply, so tiredness is
      invariant only to within float epsilon (~1e-12; asserted < 1e-9). The
      spec-axis review caught the bare word "exactly" here and the test was
      renamed to say so ("up to float round-off"). The round-off is not
      laundering — recorded as an implementation ruling below.
- [x] Detachments hold independent positions and march independently. A split
      leaves both halves on the shared start hex, then each marches the real
      `movement.marchStep` its own way — one east to (2,0), one west to
      (-2,0) — and their positions diverge. Split detachments inherit the
      parent's fatigue as independent copies, not shared references.
- [x] Defeat-in-detail scenario: a force split into halves, each meeting a
      concentrated equal-total foe, loses more in total than the
      concentrated engagement would — with no special-case rule. 2000 v 2000,
      fresh and unlevered so R reduces to the size ratio: concentrated at
      parity loses **240.0**; split into 1000 + 1000 and beaten in turn on
      interior lines loses **613.4** (316.7 + 296.7) — **2.56×**. Emergent
      from the sealed M4 convex casualty exponent; the enemy even bleeds a
      little against the first half and still wins the second. No rule
      prohibits splitting: the arithmetic prices it, exactly as §4's user
      freedom doctrine requires.
- [x] Commit pool: per-turn regeneration, unusable balance does not bank;
      allocations across simultaneous engagements + development sink sum to
      at most the pool. `pool` starts full; simultaneous draws come from one
      pool (the sealed "commit 12 to the war, 8 to development" shape);
      sequential draws accumulate against the same pool; an allocation
      exceeding it is rejected (hard ceiling, not a clamp); `renew`
      regenerates to the per-turn budget and discards any leftover
      (non-bankable); `allocate` is pure.

**Implementation rulings:**

- **Merge float-conservation (substance bit-exact; tiredness invariant up to
  ~1e-12 divide-then-multiply round-off, not laundering).** Registered, and
  **still OPEN** — the doc-sync batch owes it to war-model-build RULINGS.
- **Field-army division-doctrine stamp — OPEN sync debt** (`docs/SYNC-DEBT.md`,
  registered 2026-07-15, deferred to the next doc-sync batch by user decision).
  Owed: amend the match-arc GLOSSARY 야전군 row to free division/merge (retire
  "one at a time" → 구칭 alias) and refresh the DOMAIN_MAP entry ("one mobile
  main force" → freely divisible). Unlike ticket 06's §2 debt (paid same day),
  this one is unpaid — normal operation, since it is recorded.
