# Handoff — Force-Geography (b), v1 (최소) SEALED, resume at U4

Working-layer handoff (untracked). Supersedes
`handoff-2026-07-08-force-geography-design.md`. Voice: Korean honorific in
conversation, neutral English in artifacts.

## TL;DR — where to resume

The force-geography (b) design grill locked v1 **(최소)** this session and
sealed it: new birthplace `docs/features/force-geography/` (INDEX +
**RULINGS FG-①…⑨**), SYNC-DEBT + QUICKREF synced, committed. **Next
session: the U4 attacker brainstorm** — one open question: how the
attacker WEIGHS the fogged garrison estimate-band (low / mid / high) when
picking a front (FG-⑦). Then (정교) detail *after* (최소) L2 data, then the
harness build. Concepts **(a)** and **(c)** remain DEBT.

Resume via `superpowers:brainstorming` (HARD-GATE: no code until a design
is user-approved).

## What got sealed (FG-①…⑨ — read the RULINGS for the full record)

- **FG-② U1** — adopt the measured fort-by-class mapping (open→fieldworks /
  forest·hills·river→walls / pass·strait→fortress). L2 +33%. U1 CLOSED.
- **FG-③** — weak fronts come from **scarcity + value**, NOT a
  "concentrate on defensible terrain" policy (that is backwards — a
  rational defender equalizes defense *power*, more bodies on weak
  terrain → the freeze). The bot RE-EQUALIZES (regen fills uniform caps,
  fort upgrades weakest front), so differentiation alone is not durable;
  v1 must STOP that.
- **FG-④/⑤/⑥** — the **reactive mobile reserve** is IN SCOPE (passive-
  defender measurement can only falsify, not confirm — that falsifier is
  exhausted). Reactive; first blow = attacker field army vs RAW standing
  defense; reserve arrives next beat at **M9 ×0.5**; destination
  `deficit × value` reusing ADR 0019 (G8); whole-realm value for v1
  (deficit picks front, value = fight-or-fold), per-front **(a) deferred**.
- **FG-⑦** — attacker info is the **sealed fog estimate-band** (public
  terrain + public fort grade + fogged garrison band). Derived, not
  chosen. OPEN: band-weighting → the U4 brainstorm.
- **FG-⑧** — commit-scarcity (defenseCommitment 20-pt pool, dormant flat
  8/14) kept OFF for the pass (scope).
- **FG-⑨** — sequencing: **v1 = (최소)** (uniform standing garrison +
  reactive reserve does all concentration; stop re-equalization); **(정교)**
  = deliberate standing-redistribution, deferred delta detailed AFTER
  (최소) L2 data; measure minimal→sophisticated. (최소) is the readable
  baseline and a cheap pivot gate.

U3 (resolution unchanged) and U5 (measurement + duel metric) settled —
RULINGS §Settled.

## Next steps (in order)

1. **U4 brainstorm** (band-weighting, FG-⑦) — the one open design fork.
2. **(정교) detail** — only after (최소) L2 data.
3. **Harness build** ((최소)): wire the FG-② mapping (`startFortByClass`),
   wire the M9 reserve into the passive defender (reactive, ×0.5, deficit×
   value destination), STOP the fort re-equalization (`peacePrimary`/
   `regenGarrisons`), then run U5's panel + duel metric.

## Key files

`mockup/combat-calc/map-board.js` (`startFortByClass:98`, `weakestCrossing:
50-58`, `frontG:94`), `tournament.js` (`pickTarget:540` — U4 insertion,
`regenGarrisons`/`peacePrimary` — re-equalization to stop, `siege/field
Commit:83` — dormant commit), `engine.js` resolve() (unchanged). Docs:
`docs/features/force-geography/` (FG-①…⑨), combat-formula MAGNITUDE
M2/M9/M5/M11, fog-of-war-discovery RULING ① + slice-1, ADR 0019/0022/0027.

## Committed this session

`docs(force-geography): seal v1 (최소) design FG-①…⑨ + doc-sync` — new
feature birthplace, SYNC-DEBT force-geography row UPDATE + QUICKREF batch.
