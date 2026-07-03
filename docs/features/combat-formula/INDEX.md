# Feature: Combat-Balancing Formula

## Purpose

Design the resolution layer: how a chosen operation plan plus commitment,
against a defender's state and plan, converts into a definite outcome —
success/failure, per-axis stamped effects, and losses. The same computation,
run on fogged inputs, is the pre-battle forecast.

## Status

**Structural pass COMPLETE (2026-07-03): decisions D1–D11 settled** (see
`FORMULA.md`), matchup matrix shaped 21/21 (6 authored cells + 15
derived-by-design; `MATCHUP.md`), factor ranges survey-validated
(`RESEARCH.md`). Remaining: the magnitude pass (all numbers — thresholds,
curve exponents, lever knee, discount fractions, dial list below), joined
with the operation-plan catalog's magnitude pass; plus the Honest Gaps
routed to other threads.

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
  consequences belong to standing world rules. This pass owns starvation
  stage counts and rates.
- **ADR 0024 / catalog** — output is per-axis (six effect axes); fit and
  forecast ordering derive from `effectAxes` vs the sector value profile.
- **SPEC match envelope** — every rate and stage count is tuned so a match
  settles within 30-40 minutes (an hour at most).

## Parked Dials Owned by This Pass

- Plan-vs-plan interaction matrix values.
- Raid loot conversion (fraction of destroyed usable value returned as
  income; optional late-match decay).
- Supply starvation stages and rates (UoC shape: holding → attack-incapable
  → defenseless).
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

- **Blood-price economy coupling**: garrison regeneration is currently free
  while economy/population survive (ADR 0022/0026); whether regeneration
  *drains* economy/population (making chronic war expensive and blood a
  situationally priced currency) is undecided. Owner: standing-rules /
  economy design thread + magnitude pass (rates).
- **Anti-safe-play pressure (the poker blinds)**: the MVP baseline is
  proactive AI only (ADR 0025 — the board does not wait). The structural
  backstop — match clock, settlement function, tempo scoring — belongs to
  the undesigned match-arc thread and is now an explicit requirement on it.
  Until it exists, the only cost of always-safe play is opportunity cost.

## Workspace Files

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
