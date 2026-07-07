# Battery Run — 2026-07-08 (L2, 90,180 matches)

Evidence layer. Design basis: `../BATTERY.md` (read it before citing any
number here). Runner: `mockup/combat-calc/plan-battery.js`, real
terrain-cradle map, 7 viable bindings, reps 20, seeds 42/7/99.
**CAVEAT (Ruling ⑥): all absorption numbers are an upper bound vs a
passive defender (no delaying, no reserve awakening).**

## Headline arms (12,600 matches each)

| Arm | decided% | shortfall (undecided) | elim | vassalDeals | plan mix (top) |
|---|---|---|---|---|---|
| S0 script | 12.6% | 5262 | 1075 | 3894 | Swift/DP only (script) |
| R2 random | 11.4% | 5177 | 731 | 3760 | uniform over eligible |
| L1 ladder 0.90 | 13.4% | 5299 | 719 | 4546 | Flanking 117k · DP 109k · Encirclement 99k · Raid 38k · Swift 2.7k · SI 0.2k |
| L2 ladder 0.75 | 13.3% | 5286 | 721 | 4551 | ≈ L1 |
| L3 ladder 0.50 | 13.3% | 5276 | 724 | 4544 | ≈ L1 |
| L4 blind (0.45 clamp) | 13.3% | 5272 | 722 | 4540 | ≈ L1 |

Ladder-arm telemetry: ~367k brained battles/arm; forced-grind 36–37%;
misjudged (predicted success, failed) 0.5% @0.90 → 3.5% @blind.

## Pre-registered comparisons (the only official conclusions)

1. **Diversity value (R2 − S0) = −1.3pp.** Plan diversity without
   judgment makes the freeze slightly WORSE.
2. **Judgment value (L1 − R2) = +2.0pp.** Judgment beats dice, but the
   absolute effect is small.
3. **Information curve (L1→L4) = 13.4 → 13.3 → 13.3 → 13.3%.** Flat.
   At L2 board scales, band width almost never flips a threshold
   judgment (misjudged ≤3.5% even blind).
4. **Disposition value ≈ 0 on win share** (exactly 945/945/945 wins per
   λ — the paired design reuses identical worlds per combo, so this is
   a true null, not noise). Small freeze gradient: 5-optimist boards
   18.3% vs 5-pessimist 20.0% decided (optimist decisive attempts bleed
   armies without closing).
5. **Freeze absorption = +0.8pp (12.6% → 13.4%, ~2.7σ, real but tiny).
   Residual = essentially the entire freeze (86.6% undecided, mean
   leadership shortfall ~5300, unmoved from baseline 5262).**

## Interpretation (for the origin-session verdict)

- **The structural freeze is NOT a bot-can't-fight artifact.** The
  hypothesis that dormant decisive plans explain the structural ~80%
  is refuted at L2: a bot that uses Flanking/Encirclement massively
  (59% of judged battles) moves decided% by less than one point.
- **Tactical decisiveness DOES reshape war endings**: vassalDeals +17%
  (3894 → 4546), eliminations −33% (1075 → 719) — surrender harvest
  replaces grinding annihilation. The vassalization axis opens at the
  battle level but does not cascade into hegemony trips: leadership
  projection stays ~5300 short regardless of how battles are won.
- Per Ruling ⑥ rider 2 (asymmetric verdict): the residual is LARGE, so
  the **hegemony-ADR-needed conclusion stands** — and strengthens,
  since even the passive-defender upper bound absorbs almost nothing.
- Instrument sanity: S0 reproduces the item-① fidelity baseline
  (12.6% decided, shortfall ~5262) exactly.

## Behavioral notes (exploratory, not conclusions)

- Ladder bots nearly abandon Swift (2.7k picks vs 117k Flanking): with
  wall-assault caps throttling escalade, Flanking's seam entry
  dominates open fronts. Crossing is never chosen — opposed-water R
  almost never clears 1.5, so hermit fronts grind under DP (forced).
- Forced-grind rate 36–37%: a third of battles have no plan clearing
  its threshold at judged values — the freeze's tactical texture.
- SI nearly unpicked (rung 3 loses to Flanking; only surfaces when
  Flanking is gated). The starvation path is effectively unexplored by
  the ladder — a defender-pass or rung-refinement topic if it matters.
- D-arm design property: identical archetype draws + match seeds across
  all 243 combos (paired comparison — variance-reduced; this is why
  exact win-share ties are meaningful).
