# L2 Battery — Tactical Plan AI Freeze Re-measurement

SEALED 2026-07-08 (user grill, Q5; riders from Q6). The basis sheet for
any data this battery produces: interpret no number from these runs
without this document. Runner: `runCradleTournament`, reps 20, seeds
42/7/99, real terrain-cradle map (item ① fidelity wiring), uniform-walls
baseline forts.

## Fixed factors (held constant across ALL arms)

- `engine.resolve` arithmetic — sealed, untouched.
- Commit fixed at BOT.siegeCommit 8 / fieldCommit 14 (handoff item ④
  parked).
- Defender passive: no delaying, no reserve awakening (Ruling ⑥ —
  results are an **upper bound vs a passive defender**).
- Strategic layer unchanged (`pickTarget` archetypes, settlement model).

## Arms

| Arm | Brain | Confidence | Disposition | Cells | Question answered |
|---|---|---|---|---|---|
| S0 | Script bot (current warBattle) | — | — | 1 | Baseline re-anchor (~12.6% decided expected) |
| R2 | Random-pick among gate-eligible plans | — | — | 1 | Value of plan diversity alone |
| L1–L3 | Ladder bot | 0.90 / 0.75 / 0.50 | all neutral | 3 | Value of judgment (L1 vs R2) + information curve |
| L4 (R1) | Ladder bot, blind | ≈ 0 | all neutral | 1 | Information-curve floor |
| D | Ladder bot | 0.75 fixed | all 3⁵ = 243 assignments | 243 | Value of disposition (read by marginals ONLY) |

Scale (as run, 2026-07-08): each headline arm runs the FULL cradle
rotation (7 bindings × 6 archetypes × 5 seats × reps 20 × seeds 3 =
12,600 matches — apples-to-apples with the item-① fidelity run); D arm
243 combos × 60 matches ≈ 14,580 on bindings[0] with a paired design
(identical archetype draws + match seeds across combos). Total 90,180.
The original 60-matches-per-arm sketch understated the rotation
multiplier; corrected here to what actually ran.

No full crossing of disposition × confidence (rejected: cell thinning,
fishing risk). One question, one arm.

## Outcome axes (logged identically in every arm)

- Decision metrics: decided%, leadShortfall, match length (turns),
  total casualties.
- War-end shapes: annihilations, vassalizations (surrender harvest),
  capital falls, negotiated peaces — does the board-collapse axis open?
- **Plan-usage histogram** (per battle: eligible set, chosen plan,
  rung) — the direct evidence that decisive plans get chosen.
- Misjudgment metrics (ladder arms): judged R vs actual R gap,
  predicted-success-but-failed rate, per-plan failure rate (reckless
  Encirclement detector) — validates that accuracy degrades into
  *wrongness*, per Ruling ②.
- Disposition metrics (D arm): per-disposition win/survival rates,
  decided% marginal by optimist/pessimist count.

## Pre-registered comparisons (the ONLY official conclusions)

1. **Diversity value** = R2 − S0.
2. **Judgment value** = L1(0.90) − R2.
3. **Information value** = slope of L1 → L4.
4. **Disposition value** = D-arm marginals vs the all-neutral arm.
5. **Freeze absorption** = S0 → best-arm decided% shift; the residual
   is the true size of the hegemony ADR. ← the reason this session
   exists.

Everything else found in the logs is exploratory, not a conclusion.

## Reporting duties

- Label all absorption numbers "upper bound vs passive defender"
  (Ruling ⑥ rider 1) and apply the asymmetric verdict rule (rider 2).
- Results hand back to the origin (terrain-fidelity) session via a tmp
  handoff: absorption, residual, decided%/leadShortfall/elim/vassal
  movement — per `.context/handoff-2026-07-08-tactical-plan-ai.md`.
