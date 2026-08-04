---
type: task
status: needs-info
blocked_by: [10]
---

# 11 — Resolve Plan-Versus-Plan Matchups

> **Migrated to front matter 2026-08-03** (ticket 14 R3). The old
> header lines carried prose that the schema moves off the status line:
>
> - **blocked-by line was:** 10 — Select Differentiated Operation Plans; and the **operational-manoeuvre pass** (`.scratch/operational-manoeuvre/`, § The junction with the build), which inherits 10's reason and adds its own: Part 2 **#2 (Encirclement)** on this ticket's blocker list is that pass's item. This ticket clearing is that tracker's own deletion trigger, so the two cannot be read independently.

**What to build:** The roshambo layer — the largest new build in the program, with
zero archive code behind it. When two revealed plans meet, the matchup does not
apply an abstract advantage multiplier; it changes **which formula terms engage**,
through a small closed verb vocabulary over a sparse matrix.

Specification gates: **all resolved.** Wayfinder 10 closed 2026-08-02 (it owns
every acceptance threshold); 12 closed 2026-08-03 — **no new integration feature
home**, the Production homes are the existing feature birthplaces plus ADR 0049.
What still holds this ticket at `needs-info` is its recorded dependency on the
operational-manoeuvre pass — not a gate, and no longer a Part 2 row. All three of
this ticket's rows closed 2026-08-05: **#2** at 2.2, **#9** by the cede rule (the
abandonment column comes out — the matrix this ticket builds is **7×2 = 14 cells,
5 authored**, not 21), and **#8** dissolved by #9 rather than adjudicated.

**One thing #8 leaves this ticket, and it is a trap worth naming.** Its
definitional question — does a ✅ mark record authorship or status? — was never
answered, because the collapse removed every cell that made the two readings
differ. If this ticket ever authors a cell as a bare `refuse` with no further
terms, the question is live again and is this ticket's to settle. Do not read #8's
closure as an answer to it.

**One item arrives with that closure.** M7's threshold table carries exactly one
unresolved conditional, and it is on this ticket's stage: the Flanking Breakthrough
row (1.6) says *"the fortification discount fraction must be large enough that
Flanking beats Swift vs fortified fronts, else lower to 1.4–1.5 — check at the
matchup-fraction stage"*. This ticket **is** that stage, and the code already ships
1.6 as a needle (`game/src/ui/DemoShell.tsx`), so the check has a live value to fail
against. Report the outcome to M7 as its owning doc; do not re-cut the number here.

Contract (interim pointers): `docs/features/combat-formula/MATCHUP.md` (the
closed verb vocabulary and the sparse matrix — an empty cell is the plain
formula, and only filled cells record a deviation);
`docs/features/combat-formula/MAGNITUDE.md` M10 (matchup fractions, mobilization
visibility, the surprise economy, and the attacker-side surprise rider);
`FORMULA.md` D1–D11 for the terms the verbs act on; ADR 0025 (turn-based core and
the uncertainty duel).

**Why the verbs matter more than the numbers.** The design's whole point is that a
counter reads as a *reason* — an assault plan counters a fortification-leaning
defence because it erodes the very term that defence relies on. An implementation
that collapses the verbs into a scalar advantage table satisfies no acceptance
item below, even if it produces similar numbers.

- [ ] The verb vocabulary is closed and exhaustive: `engage`, `discount <term> <fraction>`, `bypass <term>`, `erode <term>`, `throttle`, `refuse`. A matchup cannot express an effect outside it.
- [ ] Verbs act on named formula terms at the seam where those terms enter, not as a post-hoc multiplier on the result.
- [ ] The matrix is sparse by construction: an unfilled cell resolves as the plain formula, and only a filled cell deviates. No cell is invented to fill the grid.
- [ ] Every fraction comes from M10; a matchup needing a fraction M10 does not carry is reported as a discovery, not filled in locally.
- [ ] `erode` is distinguished from `discount`: the term applies in full for this resolution and the plan's effect lands on a later one.
- [ ] `bypass` of a term that does not exist in the sector is free and produces no phantom bonus.
- [ ] Matchup resolution is symmetric with respect to which realm is labelled first, consistent with the resolve-order rule from ticket 03.
- [ ] The matchup is applied only from what each side actually revealed — never from the opponent's pre-reveal commitment.
- [ ] Because the opponent's plan is unknown at commit time, the pre-commit EVAL BAR reflects that as irreducible width and not as a hidden matchup preview.
- [ ] A regression fixture covers every filled cell, and the plain-formula path is covered for at least one empty cell per family.
- [ ] Resolution is deterministic and replays identically from `(worldId, revision, seed, ordered intent log)`.
