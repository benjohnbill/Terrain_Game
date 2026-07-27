# Glossary — Tactical Plan AI

Tier-1 birthplace definitions. Rows cite rulings in `RULINGS.md`.
Header format: English canonical (한국어 표시어).

| Term | Definition | Summary | Status |
|---|---|---|---|
| decisiveness ladder (결정성 사다리) [coinage] | The bot's ordinal objective: five rungs ranking what a successful plan buys — vassalization > annihilation > advance(=occupation) > erosion > loot. Pick the highest eligible rung whose judged R clears the plan threshold; tie-break by judged margin. Ruling ①. |  | AGREED 2026-07-08 |
| disposition dial (성향 다이얼) [coinage] | A bot's policy across **three axes**: (1) what share of the 행동력 stack goes to reconnaissance, (2) the **ratio** of optimistic to pessimistic to middling reads inside the estimate band — position on that band still expressed as λ ∈ [−1, +1], pessimist (−1) reads the enemy strong, optimist (+1) weak — and (3) how often it takes a given action under similar conditions. Axis 2 vanishes under perfect information. Every stochastic draw comes from the injected seed; ambient randomness is barred. Rulings ② + ⑦. |  | AGREED 2026-07-08, **widened 2026-07-25** |
| judged value (판단값) | The point a bot commits to inside an estimate band: position drawn per the disposition's band-read ratio, band width by confidence. All bot misjudgment flows through this one number. Rulings ② + ⑦. |  | AGREED 2026-07-08, amended 2026-07-25 |
| random-pick control (주사위 봇) | Control arm: picks uniformly among gate-eligible plans, bypassing the ladder. Measures plan diversity alone. Ruling ④. |  | AGREED 2026-07-08 |
| blind-bot floor (눈먼 봇) | Control arm: ladder logic at confidence ≈ 0 (worthless bands). The information curve's floor. Ruling ④. |  | AGREED 2026-07-08 |
| estimate band — USE ONLY | Defined at its birthplace: fog-of-war design spec §5 (true-containing, off-center p-fraction, confidence-widened). This feature reuses it verbatim; never redefine here. |  | pointer |
