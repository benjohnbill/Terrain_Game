# 06c — Resolve the Decisive Battle

**What to build:** real combat behind the turn loop's reveal. A symmetric per-side
power product decides a per-sector decisive battle, and its products — casualties,
rout, escape, fatigue — land on the board. Ticket 03's stub
(`outcome: 'pending-operations'`) is replaced here. Taking ground is 06d.

**Blocked by:** 06b — fatigue is an input to the product.

> **SPLIT 2026-07-26 — the calculator half may be built ahead, in parallel.** This
> ticket's *pure calculation* — the per-side power product, the M2 lever curve, M5
> terrain and fortification, M4 rout and escape, the two defence methods — needs no
> match state and can therefore run concurrently with 06a. It is scoped by
> `.context/handoff-codex-06c-battle-calculator.md` and lands as a new pure module
> `game/src/domain/battle.ts` that **imports nothing from `domain/state.ts`**, which
> is the whole reason the parallelism is safe.
>
> **What stays blocked by 06b is the wiring**: replacing ticket 03's
> `outcome: 'pending-operations'` stub, drawing substance from the detachment
> actually at the front (06a), taking fatigue from the ledger (06b), shrinking the
> register on casualties (and 06d re-cuts that to per-province, R18 iii), the
> `turn.ts` case-4 adjudication, ordered event emission, and the surge-curve
> re-measurement. **Check whether `domain/battle.ts` already exists before building
> it** — if it does, this ticket is the adapter and the wiring, not the formula.

Status: needs-info — see § Needs-info.

Specification gates: Wayfinder 10, 12.
Authority: `docs/features/combat-formula/FORMULA.md` D1–D11 (deterministic ratio
core, sector ledger, saturation lever); `MAGNITUDE.md` M2 (lever curve), M4
(convexity, rout), M5 (terrain and fortification); war-model-build RULINGS
WM-①/WM-②; slice-2 spec §1 (equal-mass grammar) and §8 (defence-selection wiring);
ADR 0015; ADR 0043 (reachability legality).

- [ ] A battle resolves from a **symmetric per-side power product** — `substance × commit lever × quality × fatigue` — and neither side gets an attacker-only or defender-only term the other lacks.
- [ ] **Substance is what is actually there**: the detachment(s) present or arriving at that front (06a), plus the sector's garrison. Not a realm-level total.
- [ ] The **defending field army carries its own commit lever.** The retired flat march-worn default is not reintroduced as a hidden constant; where a test needs it, it is passed explicitly as `fatigue: 0.75` so the retirement stays visible.
- [ ] The **commit lever follows the sealed M2 curve** — 0/4/8/14/20 points → ×1.00/1.25/1.50/1.75/2.00, linear between, two slopes with the knee at 8.
- [ ] **A front with no field army still fights.** M2 seals `0 points = ×1.00` — "an unattended garrison fights at its own strength" — so a realm whose army has marched elsewhere is defended by its garrison rather than holding an open door. On this board most fronts are garrison-only most turns, so this is the common case, not the edge case.
- [ ] **Terrain and fortification enter defence through the sealed M5 magnitudes** (terrain ×1.0 plains → ×2.0 pass; fortification ×1.0 none → ×2.4 fortress). **River crossing prices the engagement, not the movement** (ADR 0015) — it must not appear as a movement cost in 06a's graph.
- [ ] **Rout and escape follow M4**, and **defeat-in-detail appears as an emergent consequence** of the convex casualty exponent plus a thinned ratio. There is no special defeat-in-detail rule, and adding one is a defect.
- [ ] Defence method is wired per slice-2 §8: `STRONGHOLD` is the default and `DELAYING` is available, with the delaying band's behaviour as recorded.
- [ ] Resolution is **atomic per sector**, reports its ordered board-changing events, and is deterministic for equal inputs. Fronts resolve in canonical key order and nothing consults an actor's identity, so the whole turn stays equivalent under relabelling the two realms (ticket 03, ruling TL-①).
- [ ] `turn.ts` enumerated case 4 — one realm pressing two fronts that share a sector (`r7_s0` is a real instance) — is adjudicated here, because ticket 03 deferred to this ticket whether two pressures on one sector merge into a single engagement.
- [ ] Casualties shrink the **conscription register** permanently (blood is permanent currency, SPEC), and the surge price curve is **re-measured early in this ticket** — `docs/SYNC-DEBT.md` records that the curve never fired in ticket 05 because its designed trigger is register erosion from deaths and ticket 05 had none. At B=5, 429 cumulative casualties clear the 42% knee.

## Needs-info

**One Part 3 batch:** the delaying-defence dials in `js/battle.js` — breakthrough
R 2.0 and erosion 0.15 per turn, both recorded 가안.

**Not blocking, and deliberately out:** the **Encirclement threshold** (Part 2 #2 —
`MAGNITUDE.md` M7 says 2.2, the duel-pivot ledger says 1.92, which is the
rout-onset figure). Encirclement is not in this ticket's items; the conflict bites
at tickets 09/10/11 and stays there. Do not resolve it by implication here.

**Recompute readiness at claim time** (R6 test ii): this ticket needs 06b's batch
approved as well, since fatigue is an input.
