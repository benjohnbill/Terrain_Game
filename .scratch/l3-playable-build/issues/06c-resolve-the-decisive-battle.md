---
type: task
status: resolved
blocked_by: [06b]
---

# 06c — Resolve the Decisive Battle

> **Migrated to front matter 2026-08-03** (ticket 14 R3). The old
> header lines carried prose that the schema moves off the status line:
>
> - **status was:** **resolved** (2026-07-28 — the wiring half landed; the calculator landed 2026-07-26. Previously ready-for-agent, re-stamped 2026-07-27 — both blocking batches landed
> - **blocked-by line was:** 06b — fatigue is an input to the product.

**What to build:** real combat behind the turn loop's reveal. A symmetric per-side
power product decides a per-sector decisive battle, and its products — casualties,
rout, escape, fatigue — land on the board. Ticket 03's stub
(`outcome: 'pending-operations'`) is replaced here. Taking ground is 06d.

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

2026-07-26: the delaying dials at `operation-plan-catalog/CATALOG.md` and 06b's
WB-M① fatigue batch. This header had gone stale against the README waiver table.)
**Read the SPLIT note above first: `game/src/domain/battle.ts` already exists, so
this ticket's remaining scope is the wiring and the adapter, not the formula.**

Specification gates: Wayfinder 10, 12.
Authority: `docs/features/combat-formula/FORMULA.md` D1–D11 (deterministic ratio
core, sector ledger, saturation lever); `MAGNITUDE.md` M2 (lever curve), M4
(convexity, rout), M5 (terrain and fortification); war-model-build RULINGS
WM-①/WM-②; slice-2 spec §1 (equal-mass grammar) and §8 (defence-selection wiring);
ADR 0015; ADR 0043 (reachability legality).

- [x] A battle resolves from a **symmetric per-side power product** — `substance × commit lever × quality × fatigue` — and neither side gets an attacker-only or defender-only term the other lacks.
- [x] **Substance is what is actually there**: the detachment(s) present or arriving at that front (06a), plus the sector's garrison. Not a realm-level total.
- [x] The **defending field army carries its own commit lever.** The retired flat march-worn default is not reintroduced as a hidden constant; where a test needs it, it is passed explicitly as `fatigue: 0.75` so the retirement stays visible.
- [x] The **commit lever follows the sealed M2 curve** — 0/4/8/14/20 points → ×1.00/1.25/1.50/1.75/2.00, linear between, two slopes with the knee at 8.
- [x] **A front with no field army still fights.** M2 seals `0 points = ×1.00` — "an unattended garrison fights at its own strength" — so a realm whose army has marched elsewhere is defended by its garrison rather than holding an open door. On this board most fronts are garrison-only most turns, so this is the common case, not the edge case.
- [x] **Terrain and fortification enter defence through the sealed M5 magnitudes** (terrain ×1.0 plains → ×2.0 pass; fortification ×1.0 none → ×2.4 fortress). **River crossing prices the engagement, not the movement** (ADR 0015) — it must not appear as a movement cost in 06a's graph.
- [x] **Rout and escape follow M4**, and **defeat-in-detail appears as an emergent consequence** of the convex casualty exponent plus a thinned ratio. There is no special defeat-in-detail rule, and adding one is a defect.
- [x] Defence method is wired per slice-2 §8: `STRONGHOLD` is the default and `DELAYING` is available, with the delaying band's behaviour as recorded.
- [x] Resolution is **atomic per sector**, reports its ordered board-changing events, and is deterministic for equal inputs. Fronts resolve in canonical key order and nothing consults an actor's identity, so the whole turn stays equivalent under relabelling the two realms (ticket 03, ruling TL-①).
- [x] `turn.ts` enumerated case 4 — one realm pressing two fronts that share a sector (`r7_s0` is a real instance) — is adjudicated here, because ticket 03 deferred to this ticket whether two pressures on one sector merge into a single engagement.
- [x] Casualties shrink the **conscription register** permanently (blood is permanent currency, SPEC), and the surge price curve is **re-measured early in this ticket** — `docs/SYNC-DEBT.md` records that the curve never fired in ticket 05 because its designed trigger is register erosion from deaths and ticket 05 had none. At B=5, 429 cumulative casualties clear the 42% knee.

## Needs-info

> **PAID 2026-07-26 — `docs/features/operation-plan-catalog/CATALOG.md`**
> § Delaying Defense *Bands* (APPROVED, user Part 3 bulk batch, **L1**). That doc
> declares itself the owning model doc for the two values: **breakthrough R 2.0**
> and **erosion 0.15 per turn**. Both stay **가안 by design** — the *shape* (cheap
> contest, no repulsion, erosion clock, dissolution on final failure) is what is
> sealed, and the numbers are the shape's current calibration, expected to move in
> L3. Cite that row rather than `js/battle.js`.
>
> **06b's prerequisite is also paid** — `war-model-build/MAGNITUDE.md` WB-M①
> (2026-07-26, L1) — so the `fatigue` input this ticket consumes now has a
> birthplace. 06b remains the *implementation* blocker; it is no longer a value
> blocker.
>
> The Encirclement paragraph below still stands and is still out of scope.

**One Part 3 batch:** the delaying-defence dials in `js/battle.js` — breakthrough
R 2.0 and erosion 0.15 per turn, both recorded 가안.

**Not blocking, and deliberately out:** the **Encirclement threshold** (Part 2 #2 —
`MAGNITUDE.md` M7 says 2.2, the duel-pivot ledger says 1.92, which is the
rout-onset figure). Encirclement is not in this ticket's items; the conflict bites
at tickets 09/10/11 and stays there. Do not resolve it by implication here.

**Recompute readiness at claim time** (R6 test ii): this ticket needs 06b's batch
approved as well, since fatigue is an input.

## Comments

### Calculator implementation evidence — 2026-07-26

- Commits: `2663eba` (state-free calculator and host-parity tests), `2010d1a`
  (review fixes: Stronghold parity and float-assertion diagnostics).
- Scope: only the split pure-calculator half is complete. The ticket's state,
  turn-loop, ordered-event, register, and surge-curve wiring remains blocked on
  06a/06b and is deliberately untouched.
- Production authority: combat-formula `FORMULA.md` D1–D11 and `MAGNITUDE.md`
  M2/M4/M5; war-model-build WM-①/WM-②; operation-plan-catalog Delaying Defense;
  ADR 0015. `game/src/domain/battle.ts` has no imports and accepts no match-state
  object.
- Narrow test: `node --test game/tests/battle-calculator.test.js` — **12 pass**,
  including the M2 knee, symmetric product, M4 mirror/rout/escape,
  defeat-in-detail emergence, both defence methods, and parity repulse.
- Shared gates: `npm run verify:game` — typecheck / build:runtime / build:viewer /
  test:node **131** / test:browser **16** all PASS; parity PENDING by design
  (gate 10 owns the threshold; the browser test invokes the same emitted
  `dist/runtime/index.js` artifact twice and matches Node). Root `npm test`
  **479/479**. `npm run lint:docs` has zero blocking findings.
- Legacy evidence disposition: `js/battle.js` was read only after the fresh
  implementation. M2/M4/M5 arithmetic was accepted and compared numerically;
  hidden fatigue/quality defaults were superseded; CommonJS/browser export
  shape was incidental. No archive source was translated or imported.

### Implementation evidence — 2026-07-28 (the wiring half)

- Branch: `l3/ticket-06c-battle-wiring`, based on `fb3ec01`.
- Production authority: combat-formula `FORMULA.md` D1/D5/D6/D10/D11 and
  `MAGNITUDE.md` M2/M4/M5; **terrain-cradle `RULINGS.md` TC-⑬** (border class
  carries the combat terrain/water — the binding this ticket needed and already
  had) and **TC-⑭** (all playable state starts uniform); war-model-build WM-①/WM-②
  and `MAGNITUDE.md` WB-M① (the wear dials); operation-plan-catalog `CATALOG.md`
  § Delaying Defense; slice-2 spec §1 and §8; ADR 0015, ADR 0042, ADR 0043.
- Narrow tests: `node --test game/tests/battle-wiring.test.js` — **12 pass**.
- Shared gates: `npm run verify:game` — typecheck / build:runtime / build:viewer /
  test:node **205** / test:browser **21** all PASS; parity PENDING by design
  (gate 10 owns the threshold; both hosts produced `29f214a11fc56ef8`). Root
  `npm test` **513/513**. `npm run lint:docs` **0 blocking** (10 advisory
  `ledger-possibly-paid` guesses on unrelated rows, pre-existing).
- Cross-host check: the canonical replay fixture (`game/acceptance/replay.js`)
  gained a **contact phase** — it now marches into the nearest enemy front sector
  and closes turns until a battle resolves, so the new arithmetic crosses the host
  boundary through the Runtime rather than only in the pure calculator's
  `battle.spec.js`. `browser-lane-0001` reaches contact at turn 7 (battle at
  `r1_s1`, border class **river**, `crossing: riverOpposed`), Node and browser
  summaries identical.

**Acceptance items, and how each is met** — the eleven checkboxes above, in order

1. **Symmetric per-side product** — `battle.ts`'s `sidePower`, unchanged; the
   adapter composes both sides through the same `participantOf`.
2. **Substance is what is actually there** — `Runtime.#standingAt` sums the
   **combat-ready** men standing on the sector after movement, plus the holder's
   garrison. Participation is **presence**, not the front-assignment checkbox
   (ADR 0043 items 1 and 5): an army on ground under attack does not abstain
   because a plan failed to name it.
3. **The defending field army carries its own commit lever** — it does, through
   the same `commit` field; the retired flat `0.75` appears nowhere, and
   `battle-calculator.test.js` keeps passing it explicitly where a test wants it.
4. **The M2 curve** — `commitLever`, unchanged; the wiring's contribution is that
   a front's chips reach its sector (`an unattended garrison fights at its own
   strength, and the chips are the lever`).
5. **A front with no field army still fights** — the common case on this board and
   the fixture every arithmetic test runs on. A garrison holds **no wear ledger**,
   so it enters the men-weighted mean at wear 0 and fights at exactly ×1.0 by
   construction rather than by a special case.
6. **Terrain and fortification through M5; the crossing prices the engagement** —
   supplied by **TC-⑬**, keyed to the authored border class, table-tested across all
   six classes. The crossing never touches 06a's movement graph. **Partial, and the
   gap is registered:** TC-⑬ pairs the `pass` ×2.0 with a frontage cap that
   *throttles the assaulting body*, and M5 puts that cap's value with the
   frontage/matchup stage, which has not run — so the multiplier is implemented and
   the throttle is not, which prices a defile below what the ruling intends.
   `docs/SYNC-DEBT.md` carries it.
7. **Rout and escape follow M4** — the calculator's, unchanged; defeat-in-detail
   stays emergent and no rule was added. **The board half is deliberately absent:**
   `routed` is reported and the pursuit blood is taken, but `escaped` has no
   consumer, so a routed force is not displaced — it stands on the same hex. Where a
   routed force *goes* is undesigned for L3 (stay / fall back / dissolve / leave the
   board are four rules and no seal picks one), so it is kind 3 rather than
   something to invent. Registered in `docs/SYNC-DEBT.md`, owed alongside 06d.
9. **Defence method per §8** — `STRONGHOLD` is the standing posture every sector
   carries. §8 makes *changing* it a turn action, and orders are the plan layer's
   (ticket 10), so DELAYING remains implemented and unit-tested in `battle.ts`
   with no click to select it. The adapter keeps the seam in one named constant.
8. **Atomic per sector, ordered, deterministic** — every engagement's inputs are
   read before any is applied; a detachment has one position and so appears in at
   most one engagement; the two sides hold different stocks. Canonical sector order
   therefore fixes the *report*, not the arithmetic, and nothing reads an actor's
   identity (`the battle does not depend on which realm locked first`).
10. **`turn.ts` case 4 adjudicated: they merge.** Two borders onto one sector are
    **one** engagement, because a sector cannot be fought over twice in a turn
    without the second reading state the first changed. Both borders' chips pour
    into it and TC-⑬'s **reachable-weakest-link** picks the ground. Tested at unit
    grain and on the real board at `r7_s0`; it also fires unbidden in the
    `browser-lane-0001` replay fixture, where `r1_s1` is served by a pass and a
    river and the river wins as the softer door. The **defensibility order** that
    picks the door (`open < forest/hills < river < pass < strait`) is *cited*, not
    composed: it exists only in the L2 harness's `CLASS_DEFENSE_RANK` under the
    2026-07-08 fidelity seal, and a ranking hand-composed from M5 and ADR 0015
    instead puts `pass` above `strait`. Classified **accepted** under ADR 0041 and
    re-implemented from that evidence; pinned by a test including the pass/strait
    pair that catches the difference.
11. **Casualties shrink the register permanently, and the surge curve is
    re-measured** — two exact apportionments
    (over the formations that shared the engagement, then over each one's province
    origins) so the parts sum to the reported figure; the men leave the cohort
    **and** the living register, because `availableCivilians = register − serving`
    would otherwise hand the same body back to the next draft. The re-measurement
    is below, and it landed as a re-runnable tool.

**Structural decision, stated once** (the handoff asked for it): a **pure adapter
beside `battle.ts`** (`game/src/domain/engagement.ts`), with the Runtime assembling
its arguments — not grown inputs on `readFronts`. A battle needs substance,
garrisons, wear, ground and fortification, and threading all of that through the
turn loop's front reading would put board access inside the one function whose
whole value is having none. `readFronts` grew exactly one parameter, the set of
engaged sectors, so its `outcome` can stop being a stub: `engaged` / `no-contact`.

**Three inputs the calculator demanded, and where each came from**

- **`fortification`** — *not* absent after all: `Sector.fortTier` is authored, and
  `terrain-cradle@r1` carries `none` on all 56 sectors because TC-⑭ starts every
  player-varyable value uniform and nothing in this slice builds a fort. So it is
  **read off the artifact**. An unknown tier **throws**, because which authored
  spelling means which M5 rung has never been written down and a silent ×1.0 is
  exactly the failure that would hide that.
- **`quality`** — `UNIFORM_QUALITY = 1`, a consequence of scope: slice-2 §1 rider
  (b) ports the slot at 1.0 and defers the technology system, and TC-⑭ forbids the
  baked per-realm constant that would be the only alternative.
- **`escape`** — `OPEN_ESCAPE`, and the seam is named rather than answered.
  Encirclement (Part 2 #2) is **not** resolved by implication: M4's derived check
  is *constant* in this slice, because nothing takes ground (06d) so every sector
  keeps its friendly neighbours, and nothing cuts a route (the plan layer is
  10/11) so the isolation gate cannot fire. The one case that could vary — a
  routed attacker whose only way home is the water it crossed — needs a reading of
  that isolation gate, which is the ticket's forbidden ground. Consumers: 06d, 11.

**Surge price curve, re-measured** — `game/tools/surge-remeasure.js`, landed so the
row's owed re-read after 06d is a re-run rather than a re-derivation. Three seeds,
both realms invading, 20 turns. Full annotation on the `docs/SYNC-DEBT.md` row; the finding:

| refill behaviour | register eroded | observed intensity | band | price |
|---|---|---|---|---|
| field only | 928–1,021 by turn 4 | plateaus **0.389–0.419** | flat peace | ×1.000 |
| field + shield | 8,400–9,600 over 20 turns | crosses at **turn 7–8**, settles **0.45–0.49** | war ramp | ×1.20–×1.41 |

The row's 429-casualty threshold is cleared by the **first battle alone** (a wiped
900-man shield plus the attacker's dead). But erosion by itself does not reach the
knee: the row's arithmetic held serving at its ceiling while the register fell, and
the same deaths take serving down too. What makes the curve live is **refilling the
shield** — an ordinary order in this slice — which restores serving while the
register keeps falling. So the second band is **behaviour-gated, not dial-gated**,
it engages on exactly the attrition it exists to price, and **no user decision is
owed**. Caveat: 06d does not exist, so the invader never takes the sector and the
shield is re-wiped every turn — the turn-7/8 first crossing is the robust figure
and the 20-turn totals are an artifact of the missing capture.

**Discovery that blocks ticket 07, registered rather than fixed**

Only **27 of `terrain-cradle@r1`'s 56 sectors** are endpoints of an authored edge,
and a battle can only be sited on a front sector — so **29 sectors can never be
fought over**, and over 40 drawn partitions **44 of 80 capitals were not endpoint
sectors**. Capturing a border sector does not open the interior either: the edge
list is frozen content, so the front set shifts among 17 edges but never grows
inward. Since R1 makes a capital fall an ordinary sector capture, a majority of
matches currently have **no legal way to attack the capital** — and ADR 0043 item
7's graph lets an army walk into that interior unopposed. Filling it needs either
adjacency-derived fronts or a defensive-ground source for interior sectors, and the
latter is the unsealed `terrainLayer` → M5 mapping; both are kind 1/3, so this is a
**user ruling owed before ticket 07 is claimed**. Registered in `docs/SYNC-DEBT.md`.

**Legacy evidence disposition:** `js/battle.js` was read as evidence for the
attacker/defender grammar and the sealed dial ports. Its **three-stage spine**
(first blow vs shield → REPULSED/FALL → decisive vs the reserve) is *not*
reproduced: the L3 calculator that landed on 2026-07-26 composes one symmetric
stage, and ticket item 2 reads substance as the detachments present **plus** the
garrison as one figure — so garrison and field share the M5 multipliers here where
the archive gave the reserve an open field. That is the landed calculator's shape,
reviewed against the same authority, and re-cutting it is formula work this ticket
is explicitly not. Recorded so the difference is visible rather than discovered.

**Follow-up:** the battle-site / capital-reachability ruling above (blocks 07); the
escape seam (06d, 11); the surge re-read after 06d lands capture.
