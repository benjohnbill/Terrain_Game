# 05 — Run the Realm Economy and the Land-Derived Decay Engine

**What to build:** The board-state machine that recomputes every turn in the
background tier and makes losing ground hurt permanently: income over held land,
the land-derived military force limit, the conscription register, recruitment,
and dual-billed replenishment. This is the engine that makes the match converge
on its own — without it there is no induced pressure, and "natural match length"
has nothing driving it.

**Blocked by:** 03 — Close the Simultaneous Commit-and-Reveal Turn Loop.

Status: resolved

Specification gates: Wayfinder 10, 12.

Contract (interim pointers): duel-pivot ledger **D3.2** (anti-fizzle is
structural, no forced-termination device), **D5.1** (the decay lives in income +
force limit; no new device), **D5.2** (aging constitution P1/P2/P3 all live,
purpose re-aimed — **P1 dual billing, no free healing** is the buttress),
**D5.3** (conscription register live, mechanics unchanged), **D6.2** (⑤ upkeep /
income / recovery / conscription recompute auto-folds into the reveal's tail),
**D6.3** (one 행동력 stack prices every order kind), **D6.4** (length is
*induced* by decay, never clocked);
`docs/features/match-arc/RULINGS.md` OG-①/OG-③ + MT-①/MT-②/MT-③/MT-④;
`docs/features/force-geography/RULINGS.md` AB-② (`capLandFrac`);
`docs/features/combat-formula/MAGNITUDE.md` M13 / M13a / M14 (force limit,
start-state coordinates, thin economy);
ADR 0032; ADR 0033; ADR 0042 § 3 (structural anti-fizzle).

**Scope amended 2026-07-26 by rulings R9 / R10 / R11** (`DECISIONS-OWED.md`).
`MatchState` held no military state at all and the authored world ships
`garrison: 0` everywhere, so the force limit capped nothing. **This ticket is
where realm substance is born** — treasury, force limit, register, starting field
army and border garrisons, and recruitment as an order. Ticket 06 receives
forces; it does not invent them.

**Zero new dials.** Every value is sealed at a birthplace or adopted as a
recorded 가안 by R11 — `capLandFrac = 1`, `registerPerPop 1,800`, `capPerPop
600`, sustain fraction ⅓, f₀ 0.5 / g₀ 1.0 / ρ 0.75, `garrisonPerBorderSector
900`, Band-1 base 1 부대 = 0.5 yield, surge knees 0.42 / 0.58, **+1%p of the
force limit per 행동력 point (R10)**, and R11's four adopted numbers.
Re-implement against those homes; do not restate a number in this file and do
not invent one.

**Three boundaries (R9).** The **capital guard** belongs to ticket 07, which
already carries its conflict (Part 2 #10). **Garrison regeneration as an order**
belongs to ticket 06, where garrisons first take damage; P1 lands here as an
invariant instead. **초토화** is a system, not wiring, and is out.

## Acceptance

### The recompute

- [x] Income recomputes each turn as the sum of `economyValue × usableEconomy` over currently **held** sectors only.
- [x] The military force limit recomputes each turn as a land-derived ceiling through `capLandFrac`, from currently held land only.
- [x] Occupied-but-not-integrated land sits in limbo: it pays no income and lifts no ceiling in the turn it changes hands (OG-③), so losing a sector cuts income and ceiling in the **same** turn.
- [x] The whole recompute runs inside the background tier folded into the reveal's tail — no separate screen, no extra click, and its result is turn N+1's opening state.

### Substance at match start (R9)

- [x] Each realm starts with a treasury, a field army, and border garrisons derived from the sealed start-state coordinates; no military magnitude is authored into the world artifact and none is invented here.
- [x] The conscription register is initialized land-derived at match start and behaves as a pure stock: recruitment moves civilian to serving, and only death shrinks it.
- [x] No capital guard is seeded — that magnitude is ticket 07's, and Part 2 #10 is not imported here.

### Recruitment (R9 / R10)

- [x] Recruitment is an order drawn from the one 행동력 stack, linear in commit at **+1%p of the force limit per point**, with **no per-turn rate cap** — the full stack is a legal allocation.
- [x] A draft is bounded only by the affordability mins: headroom to the force limit, treasury, and bodies (register − serving). Falling short of what was ordered recruits what is affordable rather than rejecting the order.
- [x] The draft's bill is the integral of the marginal price over the mobilization intensity it crosses, so cost escalates with depth rather than stepping at a band boundary.

### The two invariants (R9)

- [x] P1 dual billing holds — every man added is billed in both bodies and yield, and **no code path adds men for free**, so a lost sector's force is not silently regenerated back and land loss stays irreversible.
- [x] P2 holds as a negative invariant: no path in this ticket permanently damages a sector's economy; the economy sets healing speed only.

### The engine's purpose

- [x] There is **no** turn cap, timeout, stall timer, patience policy, blinds clock, or any other forced-termination device anywhere in this path.
- [x] A test demonstrates the decay's direction: a realm that loses sectors over consecutive turns shows monotonically falling income and ceiling, absent recapture.
- [x] The projection publishes land value, yield, and register pool per the viewer-knowledge contract. A realm reads its **own** economy exactly (gate 03: no fog on self) and reads **no** figure of the opponent's treasury.
- [x] The recompute is deterministic for equal `(worldId, revision, seed, intent log)` and reproduces in Node and browser.

## Comments

### Implementation evidence — 2026-07-26

- Commit: (this branch, `l3/ticket-05-decay-engine`)
- Production authority: `MAGNITUDE.md` M13 / M13a / M14; match-arc RULINGS
  OG-①/OG-②/OG-③, MT-①/MT-②/MT-③/MT-④, AB-②; ledger D5.1/D5.2/D5.3, D6.2,
  D6.3, D6.4; ADR 0042 § 3. Rulings R9/R10/R11 (`DECISIONS-OWED.md`).
- Narrow tests: `node --test game/tests/realm-economy.test.js` — 25 pass
  (land readings, limbo, the decay direction, the price curve, the four
  affordability mins, the wired engine, the blur seam, determinism).
- Shared gates: `npm run verify:game` — typecheck / build:runtime /
  build:viewer / test:node **119** / test:browser **15** all PASS; parity
  PENDING by design (gate 10 owns the threshold; both hosts identical).
  Root `npm test` 479/479.
- Browser/runtime check: `game/tests/browser/viewer.spec.js` — "a human pours
  the stack into recruitment and watches the army and treasury move", against
  the built viewer at the config's viewport, `terrain-cradle@r1`, seed
  `duel-0001`.
- Legacy evidence disposition: **accepted, verified against, not ported.**
  `mockup/combat-calc/econ.js` supplied the three archive-only numbers R11
  adopted and the shape of integral pricing; both were re-implemented from
  MT-③/M13/M14 in TypeScript. Nothing was imported and no file was translated
  (ADR 0041).
- Follow-up: two measurements below, and the birthplace seals R9–R11 owe.

### What the engine measures, on the real board

Run with all 20 points into recruitment every turn, `terrain-cradle@r1`,
seed `sanity-0001`, one realm's own view:

| | opening | T1 | T2 | T3 | T4 | T12 |
|---|---|---|---|---|---|---|
| field | 9,000 | 9,999 | 13,599 | 17,199 | **18,000** | 18,000 |
| treasury | 5.0 | 32.1 | 46.2 | 60.4 | 88.5 | 345.4 |
| 동원 강도 | 25.0% | 26.9% | 33.5% | 40.2% | **41.7%** | 41.7% |

Force limit 18,000 · income 32.12/turn · register 54,000 · garrison 4,500.

**Two findings the ticket did not predict, both worth the user's attention and
neither fixable without originating a value:**

1. **The surge price curve never fires on this board.** Mobilization tops out
   at **41.7%**, just under MT-③'s peace knee of **42%** — so every draft in a
   whole match is billed at the flat Band-1 base and the escalation R11 adopted
   is inert. The cause is a board mismatch rather than an implementation
   choice: M13a's `garrisonPerBorderSector 900` was calibrated on the L2 seat
   map, and the duel board has roughly a third as many border sectors per
   realm (5 here), so the shield is 4,500 where MT-④'s ρ = 0.75 anchor implies
   ~13,500. The two M13a anchors — per-border-sector garrison and the 42%
   start intensity — **cannot both hold on this map**. Registered for the user;
   nothing here guesses at a new figure.
2. **Money binds exactly once, on turn 1.** `treasuryStart 5` buys 999 men
   against an order of 3,600; from turn 2 income outruns every draft, and once
   the field is at its ceiling the treasury grows without a sink (345 by turn
   12). Expected for this slice — attrition and the other spends arrive with
   06 and after — but it means the *income* half of the decay engine is not
   yet load-bearing, and the *ceiling* half is doing all of the work.

### Scope held out, per R9

- **Capital guard** — not seeded. Part 2 #10 is ticket 07's to rule on, and a
  number here would have decided it silently.
- **Garrison regeneration** — not built. Nothing in this ticket damages a
  garrison, so the order would need a price to repair something that cannot
  break. P1 lands as an invariant instead: no path adds a man without billing,
  and a ten-turn quiet run asserts that nothing regenerates.
- **초토화** — not built. P2 lands as a negative invariant: no path here
  permanently damages a sector's economy.
