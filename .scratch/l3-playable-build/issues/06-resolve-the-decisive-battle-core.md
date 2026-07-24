# 06 — Resolve the Decisive-Battle Core

**What to build:** Real combat resolution behind the turn loop's reveal. A
symmetric per-side power product decides a per-sector decisive battle, and its
products — control, routes, fatigue, reachability, rout and escape — land on the
authored world. Stubbed resolution from ticket 03 is replaced here.

**Blocked by:** 03 — Close the Simultaneous Commit-and-Reveal Turn Loop.

Status: needs-info

Specification gates: Wayfinder 10, 12.

Contract (interim pointers): `docs/features/combat-formula/FORMULA.md` D1–D11
(deterministic ratio core, sector ledger, saturation lever);
`docs/features/combat-formula/MAGNITUDE.md` M1–M14 (M2 commit lever curve,
M4 convexity, M5 terrain and fortification); `docs/features/war-model-build/`
RULINGS WM-①/WM-② and the slice-2 design spec §0–§13 (fatigue dual ledger,
movement contract and forced march, supply predicate, free field-army division
with total preservation, 창 산술); ADR 0015 (river crossing is an engagement
cost, not a movement cost); ADR 0032.

**Re-implementation, not translation (ADR 0041).** The archive codes only part of
this: `js/battle.js` carries the R-ratio core plus Stronghold and Delaying, and
`js/fatigue.js` / `js/movement.js` / `js/field-army.js` / `js/commit.js` carry
the slice-2 behavior. All of it is **evidence to verify against**, never a module
to import or a file to port line by line. The authority is the contract above.
The archive is not a parity comparator for behavior it never ran.

- [ ] A battle resolves from a symmetric per-side power product (substance × commit lever × quality × fatigue); neither side gets an attacker-only or defender-only term the other lacks.
- [ ] The defending field army carries its own commit lever; the retired flat march-worn default is not reintroduced as a hidden constant — where a test needs it, it is passed explicitly.
- [ ] The commit lever converts allocated 행동력 into a quality multiplier along the sealed M2 curve.
- [ ] Fatigue runs as the sealed dual ledger: march and battle accrue on the convex curve with a floor, supply failure produces starvation as substance loss only, and no path inverts capability.
- [ ] Movement obeys the deterministic reachability graph on the world artifact; forced march is an explicit fatigue-paying toggle; an unreachable order is rejected rather than silently clamped.
- [ ] The supply predicate governs whether a force is supplied, with no unit and no sector exempted by class — including a capital sector.
- [ ] Field armies divide and merge freely with total preservation: substance is bit-exact across a division, and merge is a size-weighted average whose documented round-trip tolerance is stated rather than claimed exact.
- [ ] Terrain and fortification enter defense through the sealed M5 magnitudes; river crossing prices the engagement, not the movement.
- [ ] Rout and escape follow M4, and defeat-in-detail appears as an emergent consequence of convexity plus a thinned ratio — there is no special defeat-in-detail rule.
- [ ] Resolution is atomic per sector, reports its ordered board-changing events, and is deterministic for equal inputs.
- [ ] No retired mechanism is invoked: no stage conveyor, no bot stall timer, no per-front uniform-defense placeholder, no legacy victory check.
- [ ] Behavior carried forward from the archive is classified (accepted / superseded / incidental) before use, and replacement tests cover only what is deliberately carried.
