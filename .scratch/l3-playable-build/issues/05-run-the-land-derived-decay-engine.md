# 05 — Run the Realm Economy and the Land-Derived Decay Engine

**What to build:** The board-state machine that recomputes every turn in the
background tier and makes losing ground hurt permanently: income over held land,
the land-derived military force limit, the conscription register, and dual-billed
recovery. This is the engine that makes the match converge on its own — without
it there is no induced pressure, and "natural match length" has nothing driving
it.

**Blocked by:** 03 — Close the Simultaneous Commit-and-Reveal Turn Loop.

Status: needs-info

Specification gates: Wayfinder 10, 12.

Contract (interim pointers): duel-pivot ledger **D3.2** (anti-fizzle is
structural, no forced-termination device), **D5.1** (the decay lives in income +
force limit; no new device), **D5.2** (aging constitution P1/P2/P3 all live,
purpose re-aimed — **P1 dual billing, no free healing** is the buttress),
**D5.3** (conscription register live, mechanics unchanged), **D6.2** (⑤ upkeep /
income / recovery / conscription recompute auto-folds into the reveal's tail),
**D6.4** (length is *induced* by decay, never clocked);
`docs/features/match-arc/RULINGS.md` OG-①/OG-③ + MT-①/MT-②;
`docs/features/force-geography/RULINGS.md` AB-② (`capLandFrac`);
ADR 0032; ADR 0033; ADR 0042 § 3 (structural anti-fizzle).

**Why this ticket exists.** It is not in the handoff sketch's eleven-ticket seed;
the coverage check against gate 08 found no home for it. Gate 08 axis 3 names
"future-lever investment (reconnaissance, **recovery**) across turns," axis 7
requires a **natural** length with no outcome-altering shortcut, and D6.4 states
plainly that what enforces length is D3.2 land-decay, induced rather than
clocked. Every one of those depends on this machine.

**Zero new dials.** Every value here is already sealed at its birthplace
(`capLandFrac = 1`, `registerPerPop`, `capPerPop 600`, sustain fraction ⅓,
guard magnitude 가안 350×pop). Re-implement against those homes; do not restate
a number in this file and do not invent one.

- [ ] Income recomputes each turn as the sum of `economyValue × usableEconomy` over currently **held** sectors only.
- [ ] The military force limit recomputes each turn as a land-derived ceiling through `capLandFrac`, from currently held land only.
- [ ] Occupied-but-not-integrated land sits in limbo: it pays no income and lifts no ceiling in the turn it changes hands (OG-③), so losing a sector cuts income and ceiling in the **same** turn.
- [ ] The conscription register is initialized land-derived at match start and behaves as a pure stock: recruitment moves civilian to serving, and only death shrinks it.
- [ ] P1 dual billing holds — recovery and garrison regeneration are billed, never free — so a lost sector's force is not silently regenerated back and land loss stays irreversible.
- [ ] P2 holds: the economy sets healing speed only; permanent damage arrives only through an identity act.
- [ ] The whole recompute runs inside the background tier folded into the reveal's tail — no separate screen, no extra click, and its result is turn N+1's opening state.
- [ ] There is **no** turn cap, timeout, stall timer, patience policy, blinds clock, or any other forced-termination device anywhere in this path.
- [ ] A test demonstrates the decay's direction: a realm that loses sectors over consecutive turns shows monotonically falling income and ceiling, absent recapture.
- [ ] The projection publishes land value, yield, and register pool per the viewer-knowledge contract, and publishes no treasury figure.
- [ ] The recompute is deterministic for equal `(worldId, revision, seed, intent log)` and reproduces in Node and browser.
