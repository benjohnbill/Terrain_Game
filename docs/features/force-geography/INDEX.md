# Force Geography

**Status**: L2 (최소) HARNESS LANDED — RULINGS **FG-①…⑩** built via SDD
(main @ `0e8dc52`, 2026-07-09, 159/159, whole-branch reviewed). Opt-in
`FG_BOARD_GAAN`; engine/`BOARD_GAAN` untouched, non-FG byte-identical.
High-reps run DONE (94.5k matches × 2, 2026-07-09). Headline is now **decision
timing** — envelope%(15-25) + median tripTurn — per match-arc **DT-①** (that
ruling is the metric's home; buckets + variance/shield are descriptive). FG
verdict: `fgM9off` best (envelope 34.6%, median 19 — dead-center, no stomp).
Next = §6 domination check-fix + instrument enhancement (18-22 core + normality)
→ re-measure. Concept **(b)** of the hegemony-freeze three-concept sequence.

## What this is

Make a realm's defense **uneven** by terrain and choice, instead of the
uniform value it sits at today (`startFort: 'walls'` everywhere; garrison
`frontG = borderSectors × 900`). Two payoffs:

1. defense-dominance becomes a legible signal;
2. uneven defense means weak fronts exist → attackers break through →
   decisive wars → the multi-polar freeze eases.

The governing principle is **redistribution, not growth** — the total
defense budget is roughly conserved (FG-①). This is **real game design,
proven in L2 first** (test-trust ladder: L2 before L3 playtest); the
shipping game code (`js/`) is behind.

## Where this sits

- Freeze diagnosis: the ~80% structural residual is the **hegemony
  leadership gate** (concept (a), DEBT); force-geography is the ~9pp
  layer. (b) is sequenced first because it rewrites the proj/shield
  distribution that (a) must be calibrated against (FG-①).
- Upstream measurement: match-arc **ET-①** ending-taxonomy panel (the
  instrument this pass re-runs).
- Debt siblings: **(a)** offense-dominance gate, **(c)** risk-gate +
  offense buff — each its own brainstorm→spec cycle, after (b)
  (`docs/SYNC-DEBT.md`).

## The five units

| Unit | Role | Status |
|---|---|---|
| **U1** terrain envelope (STATIC) | terrain keys the start fort tier | ✅ SEALED FG-② (adopt measured mapping, +33% L2) |
| **U2** defense investment (DYNAMIC) | conserved budget → where defense concentrates | ✅ SEALED FG-⑤/⑥/⑩ — v1 = reactive reserve (field army + M9, M9 swept) does it |
| **U3** resolution | the sealed 4-layer formula reads non-uniform inputs | ✅ SETTLED (unchanged; RULINGS §Settled) |
| **U4** weak-front finding (attacker AI) | attacker targets the softest FRONT | ✅ SEALED FG-⑦ — reuse disposition dial; pickTarget scores first-blow defense |
| **U5** measurement | re-run the panel + duel metric | ✅ RUN (94.5k × 2, 2026-07-09); headline = decision timing (envelope%/median tripTurn) per match-arc **DT-①**; buckets + variance/shield descriptive |

**U2 is the heart of this pass.** The session reframed it: weak fronts do
NOT come from a defender "concentrate on good terrain" policy (that is
backwards — a defender equalizes defense *power*, putting more bodies on
weak terrain; FG-③). They come from **scarcity + value** (FG-③) contested
by a **reactive mobile reserve** (FG-④/⑤/⑥). v1 keeps standing garrison
uniform-by-geometry and lets the reserve do all concentration (최소,
FG-⑨); deliberate standing redistribution is the deferred (정교) delta.

## Open questions (all deferred — design of v1 is complete)

- **(정교) standing redistribution** (FG-⑨): detailed only after (최소)
  L2 data.
- **(a) per-front value** (FG-⑥): promote from whole-realm once province
  topology exists.
- **Plan-time scoping** (FG-⑩): M9 abstraction wiring cost + field-army
  late-arrival effectiveness — resolved in writing-plans, not a brainstorm.

## Key files (reuse hooks)

- `mockup/combat-calc/map-board.js` — `startFortByClass:98` (U1 seam,
  dormant), `weakestCrossing`/`CLASS_DEFENSE_RANK:50-58` (reachable-
  weakest-link primitive), `frontG = sectors×900:94` (the uniform
  allocation to replace/keep-then-reserve).
- `mockup/combat-calc/tournament.js` — `pickTarget:540` (targets weakest
  REALM today, not FRONT — U4 insertion point), `regenGarrisons`/
  `peacePrimary` (the re-equalization to STOP), `siegeCommit/fieldCommit`
  (dormant commit-scarcity, FG-⑧).
- `docs/features/combat-formula/` — MAGNITUDE **M2** (defenseCommitment),
  **M9** (예비대/진관 reserve grammar — wire into defender), **M5/M11**
  (terrain / frontage caps); FORMULA **D6** (4-layer).
- `docs/features/fog-of-war-discovery/` — RULING ① (fort grade public) +
  INDEX slice-1 (estimate-range band).
- ADR **0019** (relational threat / weakest-link aggregation), **0022**
  (defense formula), **0027** (commit-gated regen).

## Related handoff

`.context/handoff-2026-07-09-force-geography-design.md` (working-layer
resume aid).
