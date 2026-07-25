# 05 — Run the Realm Economy and the Land-Derived Decay Engine

**What to build:** The board-state machine that recomputes every turn in the
background tier and makes losing ground hurt permanently: income over held land,
the land-derived military force limit, the conscription register, recruitment,
and dual-billed replenishment. This is the engine that makes the match converge
on its own — without it there is no induced pressure, and "natural match length"
has nothing driving it.

**Blocked by:** 03 — Close the Simultaneous Commit-and-Reveal Turn Loop.

Status: claimed

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

- [ ] Income recomputes each turn as the sum of `economyValue × usableEconomy` over currently **held** sectors only.
- [ ] The military force limit recomputes each turn as a land-derived ceiling through `capLandFrac`, from currently held land only.
- [ ] Occupied-but-not-integrated land sits in limbo: it pays no income and lifts no ceiling in the turn it changes hands (OG-③), so losing a sector cuts income and ceiling in the **same** turn.
- [ ] The whole recompute runs inside the background tier folded into the reveal's tail — no separate screen, no extra click, and its result is turn N+1's opening state.

### Substance at match start (R9)

- [ ] Each realm starts with a treasury, a field army, and border garrisons derived from the sealed start-state coordinates; no military magnitude is authored into the world artifact and none is invented here.
- [ ] The conscription register is initialized land-derived at match start and behaves as a pure stock: recruitment moves civilian to serving, and only death shrinks it.
- [ ] No capital guard is seeded — that magnitude is ticket 07's, and Part 2 #10 is not imported here.

### Recruitment (R9 / R10)

- [ ] Recruitment is an order drawn from the one 행동력 stack, linear in commit at **+1%p of the force limit per point**, with **no per-turn rate cap** — the full stack is a legal allocation.
- [ ] A draft is bounded only by the affordability mins: headroom to the force limit, treasury, and bodies (register − serving). Falling short of what was ordered recruits what is affordable rather than rejecting the order.
- [ ] The draft's bill is the integral of the marginal price over the mobilization intensity it crosses, so cost escalates with depth rather than stepping at a band boundary.

### The two invariants (R9)

- [ ] P1 dual billing holds — every man added is billed in both bodies and yield, and **no code path adds men for free**, so a lost sector's force is not silently regenerated back and land loss stays irreversible.
- [ ] P2 holds as a negative invariant: no path in this ticket permanently damages a sector's economy; the economy sets healing speed only.

### The engine's purpose

- [ ] There is **no** turn cap, timeout, stall timer, patience policy, blinds clock, or any other forced-termination device anywhere in this path.
- [ ] A test demonstrates the decay's direction: a realm that loses sectors over consecutive turns shows monotonically falling income and ceiling, absent recapture.
- [ ] The projection publishes land value, yield, and register pool per the viewer-knowledge contract. A realm reads its **own** economy exactly (gate 03: no fog on self) and reads **no** figure of the opponent's treasury.
- [ ] The recompute is deterministic for equal `(worldId, revision, seed, intent log)` and reproduces in Node and browser.
