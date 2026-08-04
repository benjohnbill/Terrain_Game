---
type: task
status: needs-info
blocked_by: [09]
---

# 10 — Select Differentiated Operation Plans

> **Migrated to front matter 2026-08-03** (ticket 14 R3). The old
> header lines carried prose that the schema moves off the status line:
>
> - **blocked-by line was:** 09 — Build the EVAL BAR; and the **operational-manoeuvre pass** (`.scratch/operational-manoeuvre/`, § The junction with the build). Four of the twelve catalog plans this ticket would expose — Flanking Breakthrough, Supply Interdiction, Encirclement and Annihilation, Crossing / Landing Securement — are that pass's subject: shape COMPLETE in the catalog, with nothing on the board behind them. Building them from this ticket would originate the mechanisms rather than read them.

**What to build:** Turn the operation-plan catalog into selectable presets the
player actually chooses between. Each plan carries its own threshold, its own
six-axis character, and its own availability conditions, so committing to a front
becomes "which plan, at what commitment" instead of a single generic attack.

Specification gates: **all resolved.** Wayfinder 10 closed 2026-08-02 (it owns
every acceptance threshold); 12 closed 2026-08-03 — **no new integration feature
home**, the Production homes are the existing feature birthplaces plus ADR 0049.
What still holds this ticket at `needs-info` is its recorded dependency on the
operational-manoeuvre pass — not a gate, and no longer a Part 2 row. Both of this
ticket's rows closed 2026-08-05: **#2** (2.2 stands; M7 is the single source, which
is what this ticket's own one-source acceptance item asks for) and **#7**.

**What #7's closure tells this ticket to build.** The catalog's
`core`/`secondary`/`none` and ADR 0024's "per-axis magnitude" are not rivals: the
labels are the **identity layer** (fit ranking, claim blocks) and the magnitudes are
authored per **(plan, axis)** pair in `MAGNITUDE.md` M8. So the "six-axis stamp"
this ticket reads from its owning magnitude doc is M8's tables — and **three of the
six axes do not have M8 dials at all**, by design, with their magnitudes owned
elsewhere: `controlShift` by the headline (binary, 50/60% capture opening, ADR
0022), `garrisonDamage` by the casualty curve (D11), `confidenceGain` by fog
FG-M①'s observation-type pricing. A plan whose axis has no M8 dial is **not** a
missing value to invent here; read the owner named in M8 § Consequence.

One live edge worth knowing before it bites: FG-M① prices information by observation
event, and a raid that meets no sortie produces none (M8's own audit fix makes an
unattended garrison never march) while `CATALOG.md` still gives Raid
`confidenceGain: secondary`. That is recorded at M8 with a playtest pickup — do not
close it inside this ticket by inventing a number.

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
