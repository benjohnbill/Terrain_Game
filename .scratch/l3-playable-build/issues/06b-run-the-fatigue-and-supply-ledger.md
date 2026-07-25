# 06b — Run the Fatigue and Supply Dual Ledger

**What to build:** the sealed dual ledger, whole. One ledger accrues from marching
and fighting on a convex curve with a floor; the other is supply, whose failure
produces starvation as substance loss only. No path inverts capability.

**Blocked by:** 06a — a ledger of marching needs somewhere to march.

Status: needs-info — see § Needs-info.

Specification gates: Wayfinder 10, 12.
Authority: slice-2 design spec §2 (fatigue system) and the supply predicate;
`DECISIONS-OWED.md` R13 (per-hex march accrual) and Part 3; ADR 0043.

- [ ] Fatigue is **one ledger with two sources**: march and battle accrue on the sealed convex curve; supply failure is the second source and behaves differently (below). 06a wired the raw march accrual only; the conversion, the floor and the curve land here.
- [ ] **March accrual is per hex** (R13), so a long march costs more than a short one in the same turn. The rate composes with the terrain cost seam 06a established.
- [ ] Effectiveness has a **floor of ×0.5**. `DECISIONS-OWED.md` Part 2 #11 recorded this as a conflict — the slice-2 spec calls ×0.5 a 가안 in one place and a sealed anchor 72 lines later — but **both sides state the same number**, so it is a stamp, not a ruling. Pay the stamp at a birthplace in this ticket's doc-sync and cite it here.
- [ ] **Supply failure produces starvation as substance loss only.** It removes men; it never inverts, reverses or improves a capability. A test asserts that no fatigue or supply state makes a force stronger than its rested, supplied self.
- [ ] The **supply predicate** governs whether a force is supplied, with **no unit and no sector exempted by class — including a capital sector**. It reads connectivity over the same movement graph 06a built (hex adjacency ∪ authored edges), so an island garrison's supply is a real question rather than an accident of the pathfinder.
- [ ] Recovery is modelled as sealed, and the open question of whether recovery additionally requires standing still stays **HELD** — it is marked HELD in both the spec and the archive, so implementing either answer would originate a rule. Wire the recovery path so that adding the condition later is a value change, not a redesign.
- [ ] Starvation entry, loss and recovery are deterministic for equal inputs and identical across Node and browser hosts.
- [ ] Fatigue enters combat only as the `fatigue` input to the per-side power product — 06c consumes it, and the retired flat march-worn 0.75 default is **not** reintroduced as a hidden constant anywhere.

## Needs-info

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
