# Feature: Combat-Balancing Formula

> **⚠ M14 ⑮ AMENDED — Wayfinder gate C (ADR 0044, 2026-07-26).** "Conquest raises
> the national cap" **stands**, but its grounds are re-based: ⑮ argued cap growth
> from "96% of matches never trip the hegemony check", and ADR 0042 retired that
> check. Cap growth is now retained because **land-derived state implies it**, not
> because the match needs it to close — closure is capital fall plus the D6.4 land
> decay. Gate C's movement values now live in war-model-build MAGNITUDE, and R18
> retired automatic garrison regeneration in favor of paid recruitment or
> physical transfer (ADR 0045). Read the strikethroughs in M13 before deriving
> any historical rate.

> **R18 documentation sync paid 2026-07-26.** M13a now marks its field/garrison
> coordinates as setup-only. Later posture rebalancing uses the existing movement
> price; no new magnitude was introduced.
>
> **Citation repaid 2026-08-03 (Wayfinder gate 12, R3/R4).** That rider row in
> `MAGNITUDE.md` read `Authority: DECISIONS-OWED.md R18` — an owning dial sheet
> naming a Working-layer tracker as its authority, the one citation kind gate 12
> ruled must be repaid. The rule's text was already here; the row now carries a
> proper seal (**SEALED 2026-07-26**, verdict source R18, L1) and the tracker is
> named as verdict source rather than home. No value changed. **Still open beside
> it:** whether a garrison → field transfer carries its wear ledger across the
> posture change is **HELD** pending a user ruling — `docs/SYNC-DEBT.md`. A reader
> of the rider should not take "rebalance freely" to mean the wear question is
> settled.

## Purpose

Design the resolution layer: how a chosen operation plan plus commitment,
against a defender's state and plan, converts into a definite outcome —
success/failure, per-axis stamped effects, and losses. The same computation,
run on fogged inputs, is the pre-battle forecast.

## Status

**Structural pass COMPLETE (2026-07-03): decisions D1–D11 settled** (see
`FORMULA.md`), matchup matrix shaped 14/14 (5 authored cells + 9
derived-by-design; `MATCHUP.md` — 7×2 since the cede rule of 2026-08-05
retired the abandonment column, which is also why the old 21/21 and its two
rival tallies are gone), factor ranges survey-validated
(`RESEARCH.md`). **Magnitude pass COMPLETE (2026-07-03 → 07-05): M1–M13
sealed** (`MAGNITUDE.md`; M12 tempo-gated confirm, M13 economy→mass with
cap growth structure sealed 07-05 ruling ⑮ — numbers → A-3), validated by
the battery harness `mockup/combat-calc/` (sheets 1–13; sheet 12 = the L2
tournament, charter in `../match-arc/TEST-LADDER.md`). **A-3 thin economy
COMPLETE (2026-07-05, M14 — rulings ⑱–㉑)**: yield (생산) unit, derived cap
(capPerPop 600), treasury, fort prices (flat blood-EV — the
fortification-vs-recruitment verification paid), development. Remaining:
A-4 doc debts (claim blocks ×12), Honest Gaps routed to other threads.

**M7 amended 2026-08-05 (user grill; values unchanged).** The Encirclement
threshold conflict (`DECISIONS-OWED.md` Part 2 #2) closed at **2.2** as a
mis-citation rather than a contest of seals, and M7 gained two things at the same
time: a reading note saying which of that row's two numbers is the threshold and
which is M4's rout onset, plus **§ Consequence — the rout cliff is a reading on the
EVAL BAR** (SEALED, L1), the first presentation ruling this feature holds. One item
went out to L3 build ticket 11: M7's Flanking row still carries its unresolved
`1.4–1.5` conditional, and 11 is the matchup-fraction stage that owes the check.

**`MATCHUP.md` re-shaped 2026-08-05 (user grill) — 7×2, and § The cede rule is
new.** Part 2 **#9** closed: Strategic Abandonment is not a defence column, since
the declaration is free, locks zero commitment, and produces the same `refuse`
against every attack plan — a rule, not an axis. Part 2 **#8** (the filled-cell
count) **dissolved** in the same act: the six cells whose reading the two rival
tallies disagreed about are exactly the cells that left, and both readings now
count 5 authored / 9 derived. The isolation precondition that lived in the
Encirclement × Abandonment cell relocated to the declaration's availability line
in `../operation-plan-catalog/CATALOG.md`.

**M8 gained § Consequence 2026-08-05 (user grill) — the shape/magnitude split and
per-axis magnitude ownership.** Part 2 **#7** closed: `core`/`secondary`/`none` is
the identity layer, the magnitudes are M8's own per-(plan, axis) tables, and ADR
0024 — which deferred magnitude by its own text — is **clarified, not amended**
(header + README stamps; DOMAIN_MAP's Tier-0 entry corrected). M8 now states which
machinery owns each axis's magnitude: three axes are M8's, `controlShift` is the
headline's, `garrisonDamage` is the casualty curve's, and `confidenceGain` is fog
FG-M①'s. `confidenceGain` **stays an axis** by user ruling, with a plan-axis dial
left as the user's open option on FG-M①'s inherited playtest pickup.

## Where This Sits

Turn decision ladder layer 5 — resolution (DOMAIN_MAP "Turn decision
layers"). It consumes the operation-plan catalog shapes
(`docs/features/operation-plan-catalog/`) and is joined with their magnitude
pass: plan axis magnitudes only gain meaning through this formula.

## Inherited Requirements

- **ADR 0025** — must include attacker-plan × defender-plan categorical
  interaction (the roshambo layer), so reading an opponent pays off in plan
  choice, not only commitment sizing.
- **ADR 0021** — failed under-committed defense loses the front sector;
  failure must read as a chosen risk (forecast band and confidence visible
  before commit).
- **ADR 0020** — attacker strength draws on committed capacity from the
  single divisible pool; the recommendation prefills the statistical-average
  commit.
- **ADR 0022** — defense is four distinct layers: `terrainDefense`,
  `fortificationDefense`, `localGarrison`, `defenseCommitment`.
- **ADR 0026** — outputs are one-shot stamps into persistent state; ongoing
  consequences belong to standing world rules. This pass owns the starvation
  rate. *(Its stage counts do not exist any more: ADR 0026's own header records
  the staged severity as superseded, and starvation is a continuous
  supply-ledger pump — war-model slice-2 §2.)*
- **ADR 0024 / catalog** — output is per-axis (six effect axes); fit and
  forecast ordering derive from `effectAxes` vs the sector value profile.
- **SPEC match envelope** — every rate and stage count is tuned so a match
  settles within 30-40 minutes (an hour at most).

## Parked Dials Owned by This Pass

- Plan-vs-plan interaction matrix values.
- Raid loot conversion (fraction of destroyed usable value returned as
  income; optional late-match decay).
- Supply starvation rate — the convex substance-loss curve of the supply-ledger
  pump. *(Re-cut 2026-07-28: the UoC staged shape holding → attack-incapable →
  defenseless is retired, so there are no stage counts to park. Authority:
  war-model slice-2 §2; entry-threshold and rate dials are named there.)*
- Isolated-rout multiplier (Encirclement and Annihilation).
- Siege wear rate (Deliberate Pressure).
- Delaying Defense over-selection counterweights.
- Ambient attrition (grand-strategy survey note) — whether any background
  attrition exists beyond the authored standing rules.
- Baseline-hold envelope: the ceiling of what an unattended (lever ×1)
  defense absorbs — too high freezes fronts, too low voids the
  attention-freedom purchase (D7).
- Preset pin position inside the recommended commit range (safe end vs
  average) — UX/magnitude choice.
- Terrain × fortification product cap mechanism: hard clamp at ×4 (×6
  legendary sites) vs sub-multiplicative composition (D8).
- Lever curve: knee ~×1.5, ceiling ×2.0; cost shape of the ×1.75–2.0 zone
  (future overclock home).
- Frontage capacities per authored choke sector + their removal paths (D9).
- Rout threshold inside the 20–40% casualty band + isolation multiplier
  (D10).
- Log-space presentation (additive player-facing steps over a
  multiplicative engine, ~×1.4/step) — decide at the command-card IA
  session.
- **Max-commit invariant** (user-raised): surplus-outlet value must stay
  competitive with the last lever increment (knee→ceiling), or
  always-max-commit degenerates into the dominant strategy. The structural
  brakes are the concave lever cost, the one-pool/many-fronts turn economy,
  and blood regenerating at world speed while tempo does not — but they
  only hold if surplus stays worth spending. Check at every magnitude-pass
  calibration; match-arc tempo pressure (parked, ADR 0025) is the long-term
  backstop.
- **No-fixed-optimum check** (user-raised, mirror of the above): the lever
  knee is a *price structure*, never a recommended value — the optimum must
  float per battle (required-R inversion × blood price × surplus
  alternatives). If playtest commit distributions cluster at the knee, the
  dials have failed and must be recut. General principle: fixed price
  structures are fine; fixed answers are a design bug (the StarCraft test —
  expansion timing is never always-right).

## Honest Gaps (audited 2026-07-03 — asserted properties not yet designed)

- **Blood-price economy coupling — resolved by R18 / ADR 0045**: garrison
  replenishment is paid recruitment or physical transfer, not a free standing
  rule. Its price therefore uses the existing recruitment and movement contracts;
  no regeneration-rate dial remains to land.
- **Bloodless panic collapse (Fei River class)**: the D10 rout cliff is
  blood-triggered (30% cumulative losses); a command/panic collapse at
  near-zero casualties (비수대전 383) is not representable. Owner: a
  deferred morale/panic system — recorded 2026-07-03 during the
  magnitude pass, deliberately not absorbed.
- **Anti-safe-play pressure (the poker blinds)**: the MVP baseline is
  proactive AI only (ADR 0025 — the board does not wait). The structural
  backstop — match clock, settlement function, tempo scoring — belongs to
  the undesigned match-arc thread and is now an explicit requirement on it.
  Until it exists, the only cost of always-safe play is opportunity cost.
  **L2 update (2026-07-05, sheet 12): confirmed load-bearing** — a
  perfect-information board freezes into deterrence equilibrium without an
  attack-inducement mechanism; acceptance test registered in
  `../match-arc/TEST-LADDER.md`.
- **Force allocation + front topology (SPEC_GAPS ②/⑧, disposed A-4 B4)**:
  two prototype-surfaced gaps in this feature's scope — the single mobile
  field army's allocation across simultaneous wars (ruling ⑨ already fixes
  the static garrison side), and front-graph redraw after cession (ruling ⑨
  derives fronts from adjacency, but the border graph only exists in B's
  map). Both defer to B; disposition + harness candidates in
  `../match-arc/RULINGS.md` §SPEC_GAPS disposition.

## Workspace Files

- `MAGNITUDE.md` — magnitude-pass working decisions (scale anchors,
  authored numbers); the pass is IN PROGRESS as of 2026-07-03.
- `GLOSSARY.md` — the fixed resolution vocabulary: every term in the
  battle pipeline with value, range, decision source, and a Status
  column (AGREED / 가안 / candidate; added 2026-07-05 A-4 B1).
- `FORMULA.md` — working decisions D1–D10 and the formula skeleton.
- `MATCHUP.md` — plan-vs-plan engagement-rule sheet (authored balance data).
- `RESEARCH.md` — survey digests, cross-survey synthesis, stacking analysis.
- `research/` — full survey reports (note: HOI4/EU4 sections approximate —
  re-verify against Paradox wikis before spec citation).

## Decision Ladder (this thread)

1. [x] Nature of resolution — deterministic vs dice → **D1: deterministic**
   (+ D2: capacity = command attention, scale-independent)
2. [x] Outcome shape → **D4: threshold headline + graded margin; margin buys
   blood** (kills the minimum-commit-always-best relic)
3. [x] Power composition and comparison → **D3: sector troop ledger, derived
   hex deployment (D3a: adjustment sealed); D5: ratio scale; D6: one grammar
   both sides, substance × lever × multipliers (ADR 0022 amended); D7:
   recommendation = inverted formula over the fog band → commit range.**
4. [x] Plan-vs-plan categorical layer → **engagement-rule currency (never
   abstract multipliers), sparse authored deviations over a derived-first
   default; lives in `MATCHUP.md` behind the engine SEAM. D8: validated
   factor ranges + ceiling ordering; D9: frontage cap; D10: collapse
   cliff.** Cell values join the magnitude pass.
5. [x] Losses and attrition → **D11: one shared casualty curve (Lanchester
   exponent 1.3–1.5), headline gates stamps only, D10 cliff conversion;
   grinding unprofitable by arithmetic.** Pain-per-casualty routed to
   Honest Gaps.
6. [ ] Detail dials (list above) — all parked for the magnitude pass.
7. [ ] Magnitude pass over the 12 plan shapes + matchup fractions + dials
   (joined; recorded with `docs/features/operation-plan-catalog/`)

## Related

- `docs/features/operation-plan-catalog/` — the plans this formula resolves.
- `docs/features/phase-1-fun-core/` — the MVP thrust this serves.
