# 10 — Select Differentiated Operation Plans

**What to build:** Turn the operation-plan catalog into selectable presets the
player actually chooses between. Each plan carries its own threshold, its own
six-axis character, and its own availability conditions, so committing to a front
becomes "which plan, at what commitment" instead of a single generic attack.

**Blocked by:** 09 — Build the EVAL BAR; and the **operational-manoeuvre pass**
(`.scratch/operational-manoeuvre/`, § The junction with the build). Four of the twelve
catalog plans this ticket would expose — Flanking Breakthrough, Supply Interdiction,
Encirclement and Annihilation, Crossing / Landing Securement — are that pass's subject:
shape COMPLETE in the catalog, with nothing on the board behind them. Building them from
this ticket would originate the mechanisms rather than read them.

Status: needs-info

Specification gates: Wayfinder 10, 12.

Contract (interim pointers): `docs/features/operation-plan-catalog/CATALOG.md`
(the twelve plans and their shapes); `docs/features/combat-formula/MAGNITUDE.md`
M7 (per-plan thresholds — the same values the EVAL BAR needles show) and M8
(six-axis stamps); ADR 0024 (operation plans as presets for core commands);
ADR 0026 (one-shot effects, persistent state, standing rules).

**Designed and numbered — the gap is implementation.** The gate-08 design-state
audit specifically overturned the assumption that this layer was undesigned: the
magnitude pass ran and plan selection carries thresholds and stamps. Build
against those homes; a plan whose threshold is not in its owning magnitude doc is
a discovery to report, not a number to invent here.

**Deferred by gate 08's own scope boundary:** settlement negotiation, reserves,
and multi-stage operations stay out. A plan requiring them is unavailable rather
than approximated.

- [ ] Plans are presets a player selects, not one generic attack with parameters; picking a different plan against the same front produces a materially different resolution.
- [ ] Each plan reads its threshold and its six-axis stamp from its owning magnitude doc, with no value restated in `game/` beyond the re-implementation itself.
- [ ] Availability is computed from the acting viewer's projection: a plan whose conditions are unmet is shown as unavailable with a legible reason, and submitting it is rejected without a state transition.
- [ ] Viable plans are ordered by statistically expected fit, **and the top plan doubles as the recommendation**, per ADR 0024 — the preset is a coherent recommendation, not an empty form. (This ticket originally asserted the opposite, "descriptive and never recommends"; that was written without checking ADR 0024, which is Accepted and unsuperseded. Corrected 2026-07-25.)
- [ ] Plan choice is funded from the same single 행동력 chip stack as every other order kind.
- [ ] One-shot effects, persistent state, and standing rules are distinguished per ADR 0026 rather than collapsed into one effect kind.
- [ ] Plans depending on settlement negotiation, reserves, or multi-stage operations are absent, and their absence is recorded in the ticket's evidence.
- [ ] The threshold needles in the EVAL BAR and the thresholds used in resolution come from one source, so a re-cut dial cannot make display and resolution disagree.
- [ ] Plan selection is deterministic and replays identically from `(worldId, revision, seed, ordered intent log)`.
