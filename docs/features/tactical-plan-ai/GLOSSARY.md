# Glossary — Tactical Plan AI

Tier-1 birthplace definitions. Rows cite rulings in `RULINGS.md`.
Header format: English canonical (한국어 표시어).

| Term | Definition | Status |
|---|---|---|
| decisiveness ladder (결정성 사다리) [coinage] | The bot's ordinal objective: five rungs ranking what a successful plan buys — vassalization > annihilation > advance(=occupation) > erosion > loot. Pick the highest eligible rung whose judged R clears the plan threshold; tie-break by judged margin. Ruling ①. | AGREED 2026-07-08 |
| disposition dial (성향 다이얼) [coinage] | Continuous λ ∈ [−1, +1] setting where in the estimate band a bot reads the enemy: pessimist (−1) reads strong, optimist (+1) reads weak. Presets 비관/중립/낙관 are labels on the dial. Vanishes under perfect information. Ruling ②. | AGREED 2026-07-08 |
| judged value (판단값) | The single point a bot commits to inside an estimate band: position set by the disposition dial, band width by confidence. All bot misjudgment flows through this one number. Ruling ②. | AGREED 2026-07-08 |
| random-pick control (주사위 봇) | Control arm: picks uniformly among gate-eligible plans, bypassing the ladder. Measures plan diversity alone. Ruling ④. | AGREED 2026-07-08 |
| blind-bot floor (눈먼 봇) | Control arm: ladder logic at confidence ≈ 0 (worthless bands). The information curve's floor. Ruling ④. | AGREED 2026-07-08 |
| estimate band — USE ONLY | Defined at its birthplace: fog-of-war design spec §5 (true-containing, off-center p-fraction, confidence-widened). This feature reuses it verbatim; never redefine here. | pointer |
