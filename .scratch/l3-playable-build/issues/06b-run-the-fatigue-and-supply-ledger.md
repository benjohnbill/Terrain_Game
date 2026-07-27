# 06b — Run the Fatigue and Supply Dual Ledger

**What to build:** the sealed dual ledger, whole. One ledger accrues from marching
and fighting on a convex curve with a floor; the other is supply, whose failure
produces starvation as substance loss only. No path inverts capability.

**Blocked by:** 06a — a ledger of marching needs somewhere to march.

Status: **claimed** 2026-07-28 — branch `l3/ticket-06b-fatigue-supply`, worktree
`~/dev/Terrain_Game-06b`, based on `d7be9ae`. Re-stamped `ready-for-agent`
2026-07-27: the blocking Part 3 batch landed 2026-07-26 at
`war-model-build/MAGNITUDE.md` WB-M①, and the header had gone stale against the
README waiver table, which recomputed test (ii) the same day. See § Needs-info for
the payment record and § Comments for one authority gap found while reading.

Specification gates: Wayfinder 10, 12.
Authority: slice-2 design spec §2 (fatigue system) and the supply predicate;
`DECISIONS-OWED.md` R13 (per-hex march accrual) and Part 3; ADR 0043.

- [x] Fatigue is **one ledger with two sources**: march and battle accrue on the sealed convex curve; supply failure is the second source and behaves differently (below). 06a wired the raw march accrual only; the conversion, the floor and the curve land here.
- [ ] **March accrual is per hex** (R13), so a long march costs more than a short one in the same turn. The rate composes with the terrain cost seam 06a established.
- [x] Effectiveness has a **floor of ×0.5**. `DECISIONS-OWED.md` Part 2 #11 recorded this as a conflict — the slice-2 spec calls ×0.5 a 가안 in one place and a sealed anchor 72 lines later — but **both sides state the same number**, so it was a stamp, not a ruling. **The stamp is already paid** at `war-model-build/MAGNITUDE.md` WB-M① dial 6 and its rider (2026-07-26): ×0.5 is SEALED and M9-consonant. Cite that row; do not re-open Part 2 #11. The term is registered as *Effectiveness floor (피로 실효 하한)*, AGREED, in that feature's `GLOSSARY.md`.
- [x] **Supply failure produces starvation as substance loss only.** It removes men; it never inverts, reverses or improves a capability. A test asserts that no fatigue or supply state makes a force stronger than its rested, supplied self.
- [ ] The **supply predicate** governs whether a force is supplied, with **no unit and no sector exempted by class — including a capital sector**. It reads connectivity over the same movement graph 06a built (hex adjacency ∪ authored edges), so an island garrison's supply is a real question rather than an accident of the pathfinder.
- [x] Recovery is modelled as sealed, and the open question of whether recovery additionally requires standing still stays **HELD** — it is marked HELD in both the spec and the archive, so implementing either answer would originate a rule. Wire the recovery path so that adding the condition later is a value change, not a redesign.
- [ ] Starvation entry, loss and recovery are deterministic for equal inputs and identical across Node and browser hosts.
- [ ] Fatigue enters combat only as the `fatigue` input to the per-side power product — 06c consumes it, and the retired flat march-worn 0.75 default is **not** reintroduced as a hidden constant anywhere.

## Needs-info

> **PAID 2026-07-26 — `docs/features/war-model-build/MAGNITUDE.md` WB-M①**
> (APPROVED, user Part 3 bulk batch, **L1**). Every dial named below now has a
> birthplace row: march accrual per hex 1.0 · forced-march premium 3.0 and
> extra-hex cap k=2 · battle fatigue coefficient 40 · conversion convexity
> exponent 2.0 · conversion terminal ledger 10 · supply pump per cut turn 1.0 ·
> starvation entry threshold 2 · starvation loss coefficient 0.02 and exponent
> 2.0 · recovery base rate 2.0 and supply-curve exponent 1.0. March speed
> S = 3 hexes/turn earns its own row, **WB-M②** (L2 — measured, not merely
> exercised). Dial 9 (*recovery requires standing still*) is recorded **HELD**
> at that birthplace rather than valued, which is exactly what the item above
> asks for — wire it so a later answer is a value change.
>
> **The L1 stamp is not decoration.** These values were exercised inside the L2
> harness but were never the *subject* of a sweep, so they are
> playtest-provisional: implement them as declared values that L3 is expected to
> move, not as constants to bake in.
>
> The section below is kept as the record of what was owed and why.

**One batch, all Part 3 — values already running in the archive that no document
records.** `DECISIONS-OWED.md` Part 3 lists them by name: march accrual per hex
1.0 · battle fatigue coefficient 40 · conversion convexity exponent 2.0 · terminal
ledger depth 10 · supply pump per cut turn 1.0 · starvation entry threshold 2 ·
starvation loss coefficient 0.02 and exponent 2.0 · recovery base rate 2.0 and
supply-curve exponent 1.0.

The pattern Part 3 names applies to every one of them: the slice-2 spec **names
each dial by number and leaves the value blank** ("dial (3)", "dial (6)") while the
archive carries a concrete number. The design was sealed at the level of shape and
the numbers were filled in during implementation without coming back. So the ask is
confirm-or-edit against a derivation, never origination.

**Recompute readiness at claim time** (R6 test ii). This ticket goes
`ready-for-agent` the moment that batch is approved; nothing else here is unlanded,
and the fatigue floor is a stamp rather than a blocker.

## Comments

### Ledger half implemented — 2026-07-28

The state-free arithmetic of both ledgers landed as a pure module. What remains
is the **supply predicate and the turn-upkeep wiring**, and one of them is
blocked on an authority question recorded below.

- Module: `game/src/domain/fatigue.ts`, exported through
  `game/src/runtime/index.ts`. Pure by construction — it imports no match state,
  the same discipline `battle.ts` runs on, so it composes with the wiring later
  without a redesign.
- **No dial has two homes.** The march dials (accrual per hex, forced-march
  premium, speed) stay in `movement.ts` where 06a put them; this module owns
  only § 2's conversion, supply and recovery dials, matching WB-M①'s numbering.
- Tests: `game/tests/fatigue-ledger.test.js`, **23 pass**, run against the
  emitted artifact rather than the source (gate 05 D6). The firewall is pinned
  from both sides: no wear depth produces a body loss or opens starvation, and
  no supply depth changes effectiveness. Convexity, the flat ×0.5 saturation,
  the no-step continuity, ash denying recovery, and immutability of inputs are
  each asserted rather than assumed.
- Shared gates (`npm run verify:game`): typecheck / build:runtime / build:viewer
  / test:node **184** / test:browser **19** all PASS; **parity PENDING by
  design** — gate 10 owns the bit-exact-versus-epsilon threshold, and the two
  hosts produced identical projections (`29f214a11fc56ef8`). Root `npm test`
  **493/493**. `npm run lint:docs` 0 blocking.
- The retired flat march-worn 0.75 is **not** reintroduced: the only `0.75` in
  `game/src` is `populationValue` in the world artifact.
- Legacy evidence disposition: `js/fatigue.js` was read as evidence after the
  contract. Its arithmetic is dictated by § 2 plus WB-M①, so the numbers agree
  by derivation rather than by translation; nothing was imported, and its
  CommonJS/browser export shape was incidental.

### BLOCKED — what counts as a supply base is unstated

The predicate's *shape* is specified and its *inputs* are not. The acceptance
item says the predicate reads connectivity over 06a's movement graph and that
**no unit and no sector is exempted by class, including a capital sector** — that
governs exemptions, not the base set. Nothing in the ticket's authority (slice-2
§ 2, `DECISIONS-OWED.md` R13/Part 3, ADR 0043, WB-M①) says **what a force must
be connected TO**.

The archive left the same hole open deliberately: `js/movement.js`'s
`isSupplied(graph, positionKey, baseKeys, isFriendlyHex)` takes the base set and
the control surface from its caller, and its own comment flags the surrounding
rulings as open for the magnitude pass. So there is no inherited answer to carry
forward here, unlike the two rulings below.

The choice is material rather than cosmetic — it decides whether sieges happen at
all:

- **capital-only** — a force is supplied while a friendly-held path reaches its
  own capital sector. Cutting that path is the siege, and the emergent siege
  clock § 2 describes fires often.
- **any friendly sector** — own ground supplies itself, so the ledger only ever
  pumps under full encirclement, and the siege clock is rare.

Both readings are consistent with every sealed source I found; they produce
different games. Recorded rather than chosen, because choosing would originate a
rule. The ledger arithmetic above is unaffected either way — it takes a supply
*level*, and the predicate that produces that level is the open question.

### Two inherited implementation rulings, carried forward and owed a stamp

Both ran in the archive while WB-M①'s values were being exercised, so changing
them now would invalidate the numbers rather than honour them. Carried forward
verbatim, pinned by tests so a later re-cut is a visible change, and registered
here because neither has a birthplace:

1. **Any supplied turn resets the pump to zero.** § 2 says restoring the route
   ends the tick and is silent on residual depth. A partial trickle also resets;
   the level only modulates recovery (dial 8).
2. **On a cut turn the pump runs first and the bleed is taken at the new depth**,
   so turn N of a siege bleeds at depth N.

Owed: a birthplace stamp for both, alongside dial 9's HELD record. Not paid in
this pass because the sealing surface for them is the same one the supply-base
ruling will land on.
