# Resolution Glossary (fixed 2026-07-03, magnitude pass)

The single reference for every term used in battle resolution. One
computation, used three ways: on true state = the verdict; on fogged
band inputs = the forecast; inverted over the fog band = the
recommendation (D1/D7).

## The pipeline

```
attack power  = troop stock × lever(commit) × quality × plan/matchup mods × water penalty
defense power = garrison    × lever(commit, baseline 1) × terrain × fortification
                [frontage: engaged attacker body = min(stock, frontage capacity)
                 at authored chokes and wall assaults; 반도이격 splits a
                 crossing force's engaged body]

R = attack power ÷ defense power

R ≥ threshold → headline SUCCESS: axes stamp; margin = R − threshold
R < threshold → headline FAIL: core stamp void; costs still paid

casualties (both directions, headline-blind):
  winner loses 12% ÷ R^1.4 of engaged stock
  loser  loses 12% × R^1.4 of engaged stock
  loser crossing 30% cumulative → ROUT (loser-only):
    escape OPEN    → +50% of remainder lost, rest disperse
    escape BLOCKED → 100% lost, no regeneration debt
```

## Terms

Status: **AGREED** = definition + value sealed; **가안** = definition
AGREED, value provisional (pending the named stage); **candidate** =
definition itself still provisional.

| Term (한국어) | Definition | Value / range | Source | Status |
|---|---|---|---|---|
| Troop stock / substance (병력) | Actual bodies; integer ledger at the front sector; casualties are written here | typical: rural garrison 300–800, key garrison 800–1,500, field army 2,000–6,000 | D2/D3, M1 | AGREED |
| Unit (부대) | Display quantum only — never in logic | 1 부대 = 100 men | M1 | AGREED |
| Command pool (명령 풀) | Per-turn attention; refills fully; identical for every realm size; never converts to troops | 20 points | D2, M1 | AGREED |
| Commitment (커밋) | Points placed on one action; both sides use the same grammar | 0–20 | D6, M1 | AGREED |
| Lever (레버) | What commitment buys: activation/direction quality multiplier on substance | ×1.0–2.0; knee ×1.5 @ 8 pts; ceiling @ 20 pts; defense baseline ×1.0 at zero commit | D8, M2 | AGREED |
| Quality (질) | Weapons/tech/drill multiplier slot | MVP = 1 (future ×0.8–2.0 + tech-tier steps that void terms) | D4/D8 | AGREED |
| Terrain multiplier (지형 배수) | The ground itself; world-owned, never degrades | plains 1.0 / forest·hills 1.2 / mountains 1.5 / pass 2.0 / legendary 2.5 (authored) | D6, M5 | AGREED |
| Fortification multiplier (요새 배수) | Player-built works; damageable — `fortificationDamage` stamps lower it AND widen assault frontage | none 1.0 / field works 1.3 / town walls 1.8 / fortress 2.4 / legendary 3.0 (wonder-class build) | D6, M5 | AGREED |
| World product (세계 곱) | terrain × fortification, raw — no engine clamp; ceiling is the natural product | buildable max 2.0×3.0=6.0; authored max 2.5×3.0=7.5 | M5 | AGREED |
| Water penalty (도하 페널티) | Attack-side multiplier when the attack crosses water; water never strengthens the defender | river 0.85 (uncontested) / 0.70 (opposed bank); strait 0.70 / 0.55 (opposed) | ADR 0015 (amended), M5 | AGREED (strait opposed 0.55 confirmed 2026-07-05, ruling ⑦) |
| Frontage (협로/강습 폭) | Cap on the engaged attacker body — classifies, never multiplies; mandatory removal paths | authored per choke sector and per fort tier; values → matchup stage | D9, M5 | 가안 (values → matchup stage) |
| 반도이격 (strike at half-crossing) | A force whose same-turn flow crosses water, if intercepted, engages with a split body and the water side counts as blocked escape | engaged fraction 가안 50% → matchup stage | M4 | PROPOSED (구 표기 candidate — status normalized 2026-07-10, lint run #1) |
| R (전투비) | attack power ÷ defense power; scale-invariant | same odds at any absolute size | D5 | AGREED |
| Threshold (문턱) | Per-plan required R for the plan's core intent to land; gates stamps ONLY, never blood. **Never an availability gate**: attacking below threshold is always legal (priced by the casualty curve, ADR 0021 chosen risk) — availability checks physical state only (ADR 0024), and the system cannot pre-judge failure because it only ever sees the fogged R band. Threshold values are public doctrine ("storming needs 1.5:1"); what fog hides is the enemy's actual strength | per-plan, all < 3.0; under decision (magnitude stage 3) | D4/D11 | AGREED (per-plan values → M7) |
| Headline (헤드라인) | Binary: did the core intent land (sector taken / repulsed) | — | D4 | AGREED |
| Margin (마진) | R − threshold; buys lower winner casualties and deeper stamps | continuous | D4 | AGREED |
| Casualty curve (사상자 곡선) | One shared curve of R, both sides, success and failure alike | base 12% each at R=1; exponent 1.4 | D11, M4 | AGREED |
| Rout cliff (궤주 절벽) | Organizational collapse conversion; loser-only (the headline winner's organization held by definition) | 30% of engaged stock lost within the engagement (atomic — no cross-battle accumulation) | D10, M4 | AGREED |
| Escape state (도주 상태) | Derived check at the moment of rout — never stored: OPEN iff ≥1 adjacent non-water friendly/neutral route AND isolation gate unsatisfied; water never counts as escape | OPEN → rout conversion 50% of remainder; BLOCKED → 100%, no regeneration debt | M4 | AGREED |
| Isolation gate (고립 게이트) | Supply already cut OR all approaches enemy-held; Encirclement's availability gate and the escape-blocker | boolean, read from existing stamps | catalog, D10 | AGREED |
| Effect axes / stamps (효과 축/도장) | Six per-axis one-shot effects stamped into persistent state on success; ongoing consequences belong to standing world rules | magnitudes → stage 3 | ADR 0024/0026 | 가안 (magnitudes → stage 3) |
| Standing rules (상비 규칙) | World rules that tick each turn reading persistent state: starvation stages (holding → attack-incapable → defenseless; stage 2 is an availability gate — attack cards vanish), garrison regeneration, recovery | rates → stage 5; constraint: starvation must outpace an unsupplied 2–3-sector advance | ADR 0026, M4 | 가안 (rates → stage 5) |
| Forecast (예보) | The same computation on fogged band inputs: R band, expected losses, escape-state line | confidence-capped 0.90 | D1/D7 | AGREED |
| Recommendation (추천) | The computation inverted: threshold → required-commit band over the fog band | band, e.g. "8 if weak, 15 if strong" | D7 | AGREED |
| Preset pin (프리셋 핀) | Where the slider prefills inside the recommended band | safe end (band top) | M3 | AGREED |

## Worked line (all terms in one battle)

철령 고개 assault, Swift Seizure (threshold 1.5): attacker stock 3,000,
commit 8 → lever ×1.5 → attack 4,500. Defender garrison 800, commit 0 →
baseline ×1.0, pass ×2.0 × field works ×1.3 → defense 2,080.
R = 2.16 → headline success, margin 0.66. Casualties: attacker
12%÷2.16^1.4 ≈ 4.1% (123 men ≈ 1 부대); defender 12%×2.16^1.4 ≈ 35% →
crosses 30% → rout (defender = headline loser) → escape open → total
~65% lost, remnant disperses into population.
