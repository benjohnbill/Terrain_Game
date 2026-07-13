# Decisive-Battle Spine — Build Slice 1 Design Spec

- **Date:** 2026-07-13
- **Status:** EXECUTED & SEALED (2026-07-13 — plan executed, merged to main; slice sealed at war-model-build `RULINGS.md` WM-①)
- **L-trust:** L2 (2026-07-13 — battery grid + defense-layer restoration probe; first read recorded at WM-①)
- **Feature:** `docs/features/war-model-build/` (INDEX; REQUIREMENTS A1/A2/B2/D7)
- **Closes toward:** DESIGN-RISKS R14 (war produces no decisive climax);
  ADR 0037 (retire L2, build the sealed war model in `js/`)

## 1. Purpose

The first build slice of Terrain Game's war model: a **pure-logic
decisive-battle calculator** that makes "a war is decided by field-army
destruction" (SPEC:147) actually happen. R14 found the retired L2 machine
produced ZERO annihilations/match; the fix is to build the sealed spine, not
to keep tuning L2 (ADR 0037).

This slice builds ONLY the calculator plus a scripted battery — no
hex-map/UI integration, no bot opportunism intelligence. It answers one
question by measurement: **when two forces meet on a front, does the sealed
spine actually produce field-army destruction, and do all three battle
outcomes occur?**

## 2. Scope

**In:**
- A pure, Node/browser-isomorphic module computing one front engagement:
  first-blow → three outcomes → rout/escape, on a deterministic ratio.
- The sealed defense composition (병력 × 지형 배수 × 요새 배수), the commit
  lever held dormant at baseline ×1.0 (per force-geography FG-⑧).
- The field-army reach switch (distance-based; a field army's position
  expresses whether it is "pinned" elsewhere).
- A battery harness that scripts scenarios (force sizes, terrain/fort,
  field-army position) and reports the measurement metrics (§7).

**Out (deferred to later slices / explicitly not built here):**
- Real hex-map / front-sector layer / UI integration (slice 2+).
- Bot opportunism read — how a bot *chooses* to strike a pinned rival
  (slice 2; SPEC_GAP ①). This slice scripts openings.
- Settlement arithmetic — territory/indemnity/vassalage conversion (slice 3).
- Per-sector 4-layer terrain distribution across a realm's border (slice 4;
  force-geography FG-②/⑨).
- defenseCommitment as a live scarce pool (kept OFF, FG-⑧); frontage caps
  (D9/M11); legendary ×2.5/×3.0 sites; fortification erosion/upgrade over
  turns; water-crossing penalty (ADR 0015) — all stub to neutral.
- Supply starvation, integration lag (already in `js/`), surrender harvest.

## 3. Vocabulary (this slice)

The war-decision terms are ❓PROPOSED at their birthplace (match-arc
GLOSSARY:71-77). This slice's design **adopts** them; the session-close
doc-sync grills them PROPOSED→AGREED and registers 야전군 (single-definition
rule: the seal lands at the birthplace, this table is a working reference).

| English canonical | 표시어 | Meaning in this slice | Birthplace / status |
|---|---|---|---|
| shield | 방패 | A front's standing defense (병력×지형배수×요새배수). Hierarchically, a realm's shield is the sum of its front shields | match-arc GLOSSARY; realm-scale AGREED, per-front use adopted here |
| shield-break | 방패 깨기 | The first blow out-ratios a front's shield (R ≥ threshold), exposing the interior | match-arc GLOSSARY:72 ❓ → adopt |
| decisive battle | 결전 | The exposed attacker vs the defender's arriving field army | match-arc GLOSSARY:73 ❓ → adopt |
| field army | 야전군 | A realm's small mobile main force; one at a time; repositions reactively | UNREGISTERED → register here |
| cascade | 연쇄 붕괴 | Post-destruction collapse: ordinary sectors fall in one-turn takes against garrison-only defense | match-arc GLOSSARY:74 (구칭 캐스케이드) → rename |
| rout cliff | 궤주 절벽 | Cumulative-loss threshold (~30% ≈ R 1.92) converting the loser's remainder to dissolution | AGREED (MAGNITUDE M4) |
| escape state | 도주 상태 | Derived at rout: OPEN (adjacent friendly/neutral land route) → lose 50% of remainder; BLOCKED → 100% | AGREED (MAGNITUDE M4) |
| annihilation | 섬멸 | BLOCKED rout: total destruction, no regeneration debt | standard |

## 4. The decisive-battle spine (mechanism)

Everything below resolves **within one turn** as an emergent chain of atomic
ratio computations (ADR 0026) — NOT a scripted multi-turn siege (the L2
error, war-model-build A2). A "long campaign" is many such turns, never a
persistent multi-turn operation object.

Given an attack on one front:

```
1. FIRST BLOW — attacker's field army vs the front's raw shield
     R = attack ÷ shield         (shield = 병력 × 지형배수 × 요새배수)
     both sides pay casualties on the shared R-curve (regardless of headline)

2. BRANCH on R and field-army reach:

   (1) R < threshold                          → REPULSED (방패 holds)
         shield holds; costs paid; no shield-break.

   (2) R ≥ threshold  AND  defender field army reaches this front
         → 방패 깨기 (shield-break): interior exposed
         → 결전 (decisive battle): the first-blow-worn attacker (its SURVIVING
              stock, already reduced on the D11 curve vs the shield) vs the
              arriving field army   [same-turn sub-step — see reach note below]
         → resolve 결전 as a second ratio; the loser checks 궤주 절벽:
              if crossed → 도주 상태:  OPEN    → lose 50% of remainder
                                        BLOCKED → 섬멸 (annihilation)

   (3) R ≥ threshold  AND  field army does NOT reach (pinned elsewhere)
         → shield alone cannot hold → the front FALLS
         → (연쇄 붕괴 seed: with the field army gone, ordinary sectors become
            one-turn takes — the cascade sweep itself is a later slice)
```

**Atomic vs "next beat".** force-geography FG-⑤ says the reserve "arrives the
next beat." In the build this is a **sub-step of this turn's single
resolution**, not a following turn — the field army joins the 결전 later in
the SAME atomic turn-resolution, at march-worn reserve effectiveness (§5).
This is exactly the reconciliation A2 requires: shield-break → 결전 → 연쇄
붕괴 is an emergent chain inside one turn, never a multi-turn conveyor.

**Field-army reach (the branch 2-vs-3 switch).** Distance-based: a realm's
single mobile field army holds one position; a front it can reach in time
gets a 결전, a front it cannot (because the army is committed elsewhere) gets
only its shield. Position expresses "pinned" — there is no separate pinned
flag. In this slice the field army's position (hence reach) is **scripted**
by the battery; the bot logic that *chooses* it is slice 2 (opportunism).

## 5. Formula (values live at their birthplace — pointers, not restatements)

Per the single-definition rule, this slice implements the sealed formula; the
numbers live in `combat-formula/MAGNITUDE.md` and are read there, never
re-defined here. Figures shown are current sealed/가안 values for orientation.

- **Shield (defense power)** = 병력(substance) × 지형배수 × 요새배수, with
  defenseCommitment at baseline ×1.0 (FORMULA D6; FG-⑧ keeps the lever OFF).
  - 지형배수 (MAGNITUDE M5): 평지 1.0 / 숲·구릉 1.2 / 산 1.5 / 관문 2.0
    (전설 2.5 deferred).
  - 요새배수 (MAGNITUDE M5): 없음 1.0 / 야전축성 1.3 / 성벽 1.8 / 요새 2.4
    (전설 3.0 deferred). World product 지형×요새 has **no engine cap**
    (M5 supersedes the old D8 ~×4; cite M5).
- **Attack power** = 야전군 병력 × commit lever (MAGNITUDE M2 curve; ×1.0–2.0,
  knee ×1.5). plan/matchup modifiers and the water penalty stub to ×1.0 here.
  The arriving field army fights the 결전 at march-worn **×0.75** (user
  decision 2026-07-13, realism — the reserve is worn by the forced march;
  §7/§9 watch that this + a low threshold does not over-favor the attacker).
- **R = attack ÷ defense** (FORMULA D5). Deterministic — no dice (D1).
- **Threshold** — one per-plan value, all < 3.0 (MAGNITUDE M7, 가안 stage 3;
  this slice uses a single working threshold, e.g. Swift-Seizure ~1.5).
- **Casualty curve** — shared, both sides, base ~12% / exponent ~1.4
  (FORMULA D11 / MAGNITUDE M4).
- **Rout cliff / escape** — cumulative loss ~30% (≈ R 1.92); OPEN loses 50%
  of remainder, BLOCKED annihilates (FORMULA D10 / MAGNITUDE M4).

**Balance direction (user 2026-07-13).** The three attacker/defender levers —
attacker attrition INTO the 결전 (auto; a brake), defender field-army ×0.75
(push), and the shield-break threshold (push) — should net to a *slight*
attacker advantage, never over-favor. Rationale (user's sealed principle:
risk-taking earns more reward): the attacker bears its own casualty
uncertainty, more so as a plan's target R rises — which is already the D4/D11
shape (higher R stamps deeper and bleeds less on success, while a failed
high-R assault costs the attacker superlinearly). Start the threshold on the
low side (shield breaks readily) and tune the NET with the battery, watching
for over-favor (§7 metric 5).

**`js/combat.js` is NOT reused** — it rolls dice (violates D1) and has no
4-layer composition, ratio core, or rout cliff. The spine implements the
sealed formula fresh (ADR 0031 consequence; REQUIREMENTS A1).

## 6. Module structure

- **New pure module** (working name `js/battle.js`; final name at
  implementation). `combat.js` is the retiring hex-combat module and is not
  extended.
- **Isomorphic** (ADR 0028): no DOM and no `window`-only globals in the
  compute path; runs identically in Node and browser so the battery can drive
  it headless (precedent: `mockup/combat-calc/map-gen.js`).
- **Interface (deep-module seam).** Callers pass an engagement description
  and read back an outcome object; pure function, no hidden state:
  - *in:* attacker `{ size, commit }`; front shield inputs
    `{ garrison, terrain, fortification }`; defender field army
    `{ reaches: bool, size }`; escape geometry `OPEN|BLOCKED`.
  - *out:* branch taken (1/2/3); shieldBreak y/n; 결전 result if any;
    casualties both sides; rout + escape result.
- **Battery harness** (`node`-run, sibling to the compute module) scripts a
  scenario matrix and aggregates the §7 metrics. Per-branch unit coverage
  uses the existing runner (`node --test tests/*.test.js`).

## 7. Measurement (what "this slice works" means)

Scripted battery over a scenario matrix (force ratios × terrain × fort ×
field-army reach):

**Quantitative (the R14 heart):**
1. **Field-army destruction occurs** — 궤주/섬멸 happen at a meaningful rate
   (L2 was 0/match).
2. **All three branches appear** — repulse / decisive-battle / fall are all
   reachable; none degenerate to never-fires.

**Qualitative (does the narrative emerge):**
3. **Terrain flips a battle (Myeongnyang-class)** — a weaker shield repels a
   stronger attack purely via 지형배수.
4. **A pinned front falls (opportunism seed)** — striking a front the field
   army cannot reach yields branch 3, confirming slice 2 will have a real
   board to read.
5. **Attacker not over-favored** — the defender's field army IS destroyed at a
   meaningful rate, yet the attacker still pays and can lose; the net reads as
   a *slight* attacker advantage (the §5 balance target), watched as the three
   levers combine.

## 8. Minimal data representation

The calculator takes plain inputs; no persistent world state in this slice.

- **Front:** `{ garrison, terrain, fortification }` → shield.
- **Field army:** `{ position, size }`; whether it reaches the attacked front
  is a scripted boolean (the distance rule and realm geometry are slice 2+).
- **Engagement:** attacker `{ size, commit }`, escape geometry `OPEN|BLOCKED`.
- The battery constructs these; nothing reads the hex map yet.

## 9. Open questions / 가안 (resolve at plan or implementation)

- **Threshold value(s)** — MAGNITUDE M7 is 가안 (stage 3). This slice fixes a
  single working threshold and treats sweeping it as a battery knob.
- **Field-army late-arrival effectiveness** — DECIDED ×0.75 march-worn (user
  2026-07-13, realism). Flagged risk: ×0.75 + a low threshold may over-favor
  the attacker; the battery watches attacker win-rate and can revert toward
  full if needed (force-geography FG-⑩ rider ii).
- **Reach/distance rule** — adjacency vs hop-count, and the risk that a small
  realm makes every front reachable ("always arrives"). Decided against the
  real map geometry in a later slice; this slice scripts reach directly.
- **Reserve two layers** — field-army reposition + M9 tactical fill ×0.5
  (FG-⑩). This slice may model the arriving force as one aggregate; splitting
  M9 out is a battery knob / next-layer detail.

## 10. Sealed sources (pointers)

- SPEC:147-150 (field-army destruction: shield-break → decisive battle →
  cascade).
- FORMULA D1 (determinism) / D5 (ratio) / D6 (4-layer defense grammar) /
  D10 (rout cliff) / D11 (casualty curve).
- MAGNITUDE M2 (commit lever) / M4 (rout, escape, casualty base) / M5
  (terrain, fort, world product) / M7 (thresholds) / M9 (reactive reserve).
- force-geography RULINGS FG-⑤ (first-blow vs raw defense, reserve next beat)
  / FG-⑧ (commit lever OFF) / FG-⑩ (reserve = field army + M9).
- ADR 0026 (atomic single-turn resolution) / 0022, 0031 (sector defense) /
  0028 (isomorphic logic) / 0037 (build direction).
- war-model-build REQUIREMENTS A1/A2/B2/D7; DESIGN-RISKS R14.
