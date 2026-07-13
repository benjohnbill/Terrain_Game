# Decisive-Battle Spine — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a pure, isomorphic decisive-battle calculator (`js/battle.js`) that resolves one front engagement — first-blow → three outcomes → rout/escape — on the sealed deterministic ratio, plus a battery that measures whether field-army destruction actually occurs.

**Architecture:** One pure module of small functions (multiplier tables, commit lever, power, casualty curve) composed into `resolveEngagement(input) → outcome`. No DOM, no `window`-only globals in the compute path, no dice — deterministic ratio only. A separate `node`-run battery scripts scenario matrices and aggregates the §7 metrics. `js/combat.js` (the retiring hex-combat module) is neither imported nor extended.

**Tech Stack:** Plain ES2019 JavaScript, isomorphic (`module.exports` in Node, `window.Battle` in browser — follows `mockup/combat-calc/map-gen.js`). Tests: `node --test tests/*.test.js` with `node:assert/strict`, loaded via `require('../js/battle.js')`.

**Spec:** `docs/superpowers/specs/2026-07-13-decisive-battle-spine-design.md`

## Global Constraints

- **Determinism (D1):** no `Math.random` / no dice anywhere in the compute path; every function is pure.
- **Dials are named constants at module top** (battery-sweepable, ported from MAGNITUDE — single-definition: the numbers live at their birthplace, these are documented ports):
  - `CASUALTY_BASE = 0.12`, `CASUALTY_EXP = 1.4` (MAGNITUDE M4)
  - `ROUT_FRAC = 0.30` (M4 rout cliff)
  - `ROUT_OPEN_REMAINDER_LOSS = 0.5` (M4 escape OPEN — 50% of the remainder falls in the pursuit)
  - `SHIELD_BREAK_THRESHOLD = 1.5` (M7 Swift Seizure — the single working threshold this slice uses)
  - `FIELD_ARMY_MARCH_WORN = 0.75` (user decision 2026-07-13)
- **Isomorphic (ADR 0028):** the `map-gen.js` export tail exactly.
- **`js/combat.js` is NOT reused or imported.**
- **Terrain/fort/lever values** are the MAGNITUDE M5/M2 ladders, verbatim.

### Plan-level design decisions (user-confirmed 2026-07-13)

1. **결전 is open-field:** the field army carries NO terrain/fort multiplier (the shield/방패 is already broken). Field-army defense power = `size × FIELD_ARMY_MARCH_WORN × commit(1.0, OFF)`. Confirmed reading (user 2026-07-13): open-field is the arithmetic of the *field-army-marches-out* mode specifically; "re-fight from an interior fortress" and "roles inverted over captured ground" are OTHER invocations of the same calculator (next-turn engagements with different inputs, per ADR 0026 atomic turns), and the defender-choice wiring that selects among them (catalog Defense plan family, opportunism) is slice 2+.
2. **결전 headline = R2 ≥ 1** (attacker wins the field battle); the M7 threshold gates ONLY the first-blow shield-break, not the 결전.
3. **The first-blow shield garrison's OWN rout is omitted this slice** — shield-break (R1 ≥ threshold) counts as the sector-take headline; the field-army rout in the 결전 is the R14 heart we measure.
4. **The attacker carries the same commit lever into both first-blow and 결전** (one operation, one attention level).
5. **Rout is a binary cliff; loss conversion follows M4 verbatim (corrected 2026-07-13):** a loser whose battle-loss fraction `L` reaches `ROUT_FRAC` routs and dissolves as an organization. Blood conversion reads the escape state (MAGNITUDE M4): OPEN → an additional 50% of the remainder is lost, so total loss = `L + ROUT_OPEN_REMAINDER_LOSS × (1 − L)` (scales with L); BLOCKED → total loss 1.0 = 섬멸, no regeneration debt. The earlier flat-0.65 wording was a misport of M4 — 0.65 is the conversion's value only at the cliff onset (L = 0.30), not a constant.

---

### Task 1: Multiplier tables and commit lever

**Files:**
- Create: `js/battle.js`
- Test: `tests/battle.test.js`

**Interfaces:**
- Produces: `terrainMultiplier(terrain: string) → number`, `fortMultiplier(fort: string) → number`, `commitLever(points: number) → number`.

- [ ] **Step 1: Write the failing test**

```js
// tests/battle.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const B = require('../js/battle.js');

test('terrain/fort multipliers match the M5 ladder', () => {
  assert.equal(B.terrainMultiplier('plains'), 1.0);
  assert.equal(B.terrainMultiplier('pass'), 2.0);
  assert.equal(B.fortMultiplier('none'), 1.0);
  assert.equal(B.fortMultiplier('fortress'), 2.4);
});

test('commit lever interpolates linearly between M2 anchors', () => {
  assert.equal(B.commitLever(0), 1.0);
  assert.equal(B.commitLever(8), 1.5);
  assert.equal(B.commitLever(20), 2.0);
  assert.ok(Math.abs(B.commitLever(6) - 1.375) < 1e-9); // between 4→1.25 and 8→1.5
  assert.equal(B.commitLever(25), 2.0);                 // clamps at ceiling
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/battle.test.js`
Expected: FAIL — `Cannot find module '../js/battle.js'`.

- [ ] **Step 3: Write minimal implementation**

```js
// js/battle.js
'use strict';

/* Sealed dials (ports — birthplace = combat-formula MAGNITUDE). */
const TERRAIN = { plains: 1.0, forest: 1.2, hills: 1.2, mountains: 1.5, pass: 2.0, legendary: 2.5 }; // M5
const FORT    = { none: 1.0, fieldworks: 1.3, walls: 1.8, fortress: 2.4, legendary: 3.0 };           // M5
const LEVER_ANCHORS = [[0, 1.0], [4, 1.25], [8, 1.5], [14, 1.75], [20, 2.0]];                        // M2

function terrainMultiplier(terrain) { return TERRAIN[terrain]; }
function fortMultiplier(fort) { return FORT[fort]; }

function commitLever(points) {
  const p = Math.max(0, Math.min(20, points));
  for (let i = 1; i < LEVER_ANCHORS.length; i++) {
    const [x0, y0] = LEVER_ANCHORS[i - 1];
    const [x1, y1] = LEVER_ANCHORS[i];
    if (p <= x1) return y0 + (y1 - y0) * (p - x0) / (x1 - x0);
  }
  return 2.0;
}

const _api = { terrainMultiplier, fortMultiplier, commitLever };
if (typeof module !== 'undefined' && module.exports) module.exports = _api;
else (window.Battle = window.Battle || {}), Object.assign(window.Battle, _api);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/battle.test.js`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add js/battle.js tests/battle.test.js
git commit -m "feat(battle): M5 multiplier tables and M2 commit lever"
```

---

### Task 2: Shield power and the casualty curve

**Files:**
- Modify: `js/battle.js`
- Test: `tests/battle.test.js`

**Interfaces:**
- Consumes: `terrainMultiplier`, `fortMultiplier` (Task 1).
- Produces: `shieldPower({garrison, terrain, fortification}) → number`; `casualtyFractions(R: number) → {attacker: number, defender: number}` where `attacker = CASUALTY_BASE / R^CASUALTY_EXP` and `defender = CASUALTY_BASE * R^CASUALTY_EXP` (symmetric — the loser is whichever side R disfavors).

- [ ] **Step 1: Write the failing test**

```js
// append to tests/battle.test.js
test('shield power = garrison × terrain × fort (M5, defense commit baseline 1.0)', () => {
  const s = B.shieldPower({ garrison: 1000, terrain: 'pass', fortification: 'walls' });
  assert.ok(Math.abs(s - 3600) < 1e-9); // 1000 × 2.0 × 1.8
});

test('casualty fractions are symmetric on the M4 curve; rout onset ≈ 30% at R 1.92', () => {
  const at1 = B.casualtyFractions(1.0);
  assert.ok(Math.abs(at1.attacker - 0.12) < 1e-9);
  assert.ok(Math.abs(at1.defender - 0.12) < 1e-9);
  const r = B.casualtyFractions(1.92);
  assert.ok(Math.abs(r.defender - 0.30) < 0.005); // 0.12 × 1.92^1.4 ≈ 0.299
  assert.ok(r.attacker < r.defender);             // winner bleeds less
  assert.equal(B.casualtyFractions(20).defender, 1); // clamped — blood never exceeds the body
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/battle.test.js`
Expected: FAIL — `B.shieldPower is not a function`.

- [ ] **Step 3: Write minimal implementation**

```js
// js/battle.js — add near the dials
const CASUALTY_BASE = 0.12; // M4
const CASUALTY_EXP  = 1.4;  // M4

function shieldPower(front) {
  return front.garrison * terrainMultiplier(front.terrain) * fortMultiplier(front.fortification);
}

function casualtyFractions(R) {
  return {
    attacker: Math.min(1, CASUALTY_BASE / Math.pow(R, CASUALTY_EXP)),
    defender: Math.min(1, CASUALTY_BASE * Math.pow(R, CASUALTY_EXP)),
  };
}
```

Add both to `_api`: `const _api = { terrainMultiplier, fortMultiplier, commitLever, shieldPower, casualtyFractions };`

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/battle.test.js`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add js/battle.js tests/battle.test.js
git commit -m "feat(battle): shield power and the M4 casualty curve"
```

---

### Task 3: `resolveEngagement` — first blow, REPULSED and FALL branches

**Files:**
- Modify: `js/battle.js`
- Test: `tests/battle.test.js`

**Interfaces:**
- Consumes: `shieldPower`, `commitLever`, `casualtyFractions` (Tasks 1-2).
- Produces: `resolveEngagement(input) → outcome`. **This task returns the fully-formed REPULSED and FALL outcomes; the DECISIVE branch returns `{branch:'DECISIVE', shieldBreak:true, firstBlowR, casualties}` with the `decisiveBattle` field added in Task 4.**
  - `input = { attacker:{size, commit}, front:{garrison, terrain, fortification}, fieldArmy:{reaches, size}, escape:'OPEN'|'BLOCKED' }`
  - `outcome = { branch:'REPULSED'|'FALL'|'DECISIVE', shieldBreak:bool, firstBlowR:number, casualties:{attacker, defenderShield} }`

- [ ] **Step 1: Write the failing test**

```js
// append to tests/battle.test.js
test('branch REPULSED when first-blow R is below the shield-break threshold', () => {
  const o = B.resolveEngagement({
    attacker: { size: 1000, commit: 8 },                        // attack 1000 × 1.5 = 1500
    front: { garrison: 1000, terrain: 'pass', fortification: 'walls' }, // shield 3600
    fieldArmy: { reaches: true, size: 800 }, escape: 'OPEN',
  });
  assert.equal(o.branch, 'REPULSED');          // R1 = 1500/3600 = 0.417 < 1.5
  assert.equal(o.shieldBreak, false);
});

test('branch FALL when the shield breaks but the field army cannot reach', () => {
  const o = B.resolveEngagement({
    attacker: { size: 6000, commit: 8 },                        // attack 9000
    front: { garrison: 500, terrain: 'plains', fortification: 'none' }, // shield 500
    fieldArmy: { reaches: false, size: 2000 }, escape: 'OPEN',
  });
  assert.equal(o.branch, 'FALL');              // R1 = 9000/500 = 18 ≥ 1.5, no reach
  assert.equal(o.shieldBreak, true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/battle.test.js`
Expected: FAIL — `B.resolveEngagement is not a function`.

- [ ] **Step 3: Write minimal implementation**

```js
// js/battle.js — add near the dials
const SHIELD_BREAK_THRESHOLD = 1.5; // M7 Swift Seizure

function resolveEngagement(input) {
  const { attacker, front, fieldArmy, escape } = input;

  // FIRST BLOW — attacker's field army vs the front's raw shield
  const shield = shieldPower(front);
  const attack = attacker.size * commitLever(attacker.commit);
  const R1 = attack / shield;
  const c1 = casualtyFractions(R1);
  const attackerAfter = attacker.size * (1 - c1.attacker);
  const base = {
    firstBlowR: R1,
    casualties: { attacker: attacker.size * c1.attacker, defenderShield: front.garrison * c1.defender },
  };

  if (R1 < SHIELD_BREAK_THRESHOLD) return { branch: 'REPULSED', shieldBreak: false, ...base };
  if (!fieldArmy.reaches)          return { branch: 'FALL',     shieldBreak: true,  ...base };

  // DECISIVE branch — completed in Task 4
  return { branch: 'DECISIVE', shieldBreak: true, ...base, _attackerAfter: attackerAfter };
}
```

Add `resolveEngagement` to `_api`. (The `_attackerAfter` carry-field is consumed by Task 4 and removed there.)

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/battle.test.js`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add js/battle.js tests/battle.test.js
git commit -m "feat(battle): first-blow resolution with REPULSED and FALL branches"
```

---

### Task 4: `resolveEngagement` — the DECISIVE branch (결전 + rout/escape)

**Files:**
- Modify: `js/battle.js`
- Test: `tests/battle.test.js`

**Interfaces:**
- Consumes: `commitLever`, `casualtyFractions`, and the `_attackerAfter` carry-field from Task 3.
- Produces: the completed DECISIVE outcome, adding `decisiveBattle: { R2, attackerWins:bool, routed:bool, escape, annihilated:bool, loserTotalLoss:number }`. `loserTotalLoss` is the loser's total loss fraction: `L` (battle loss) below the cliff; at rout, the M4 conversion (OPEN → `L + ROUT_OPEN_REMAINDER_LOSS × (1 − L)`, BLOCKED → 1). The temporary `_attackerAfter` field is removed from the returned object.

- [ ] **Step 1: Write the failing test**

```js
// append to tests/battle.test.js
test('DECISIVE: attacker overwhelms the arriving field army → defender routed, BLOCKED = 섬멸', () => {
  const o = B.resolveEngagement({
    attacker: { size: 6000, commit: 8 },                        // R1 = 9000/500 = 18, shield breaks
    front: { garrison: 500, terrain: 'plains', fortification: 'none' },
    fieldArmy: { reaches: true, size: 1000 }, escape: 'BLOCKED',
  });
  // attackerAfter ≈ 5987; attackPower2 ≈ 8981; defense2 = 1000 × 0.75 = 750; R2 ≈ 11.97 ≥ 1
  assert.equal(o.branch, 'DECISIVE');
  assert.equal(o.decisiveBattle.attackerWins, true);
  assert.equal(o.decisiveBattle.routed, true);        // defender battle-loss ≥ 0.30
  assert.equal(o.decisiveBattle.annihilated, true);   // BLOCKED rout = 섬멸
  assert.equal(o.decisiveBattle.loserTotalLoss, 1);   // annihilation leaves nothing
  assert.equal(o._attackerAfter, undefined);          // carry-field cleaned up
});

test('DECISIVE: a strong field army beats the worn attacker → attacker loses, not routed', () => {
  const o = B.resolveEngagement({
    attacker: { size: 1200, commit: 8 },                        // R1 = 1800/600 = 3, shield breaks
    front: { garrison: 600, terrain: 'plains', fortification: 'none' },
    fieldArmy: { reaches: true, size: 4000 }, escape: 'OPEN',
  });
  // attackerAfter ≈ 1169; attackPower2 ≈ 1753; defense2 = 3000; R2 ≈ 0.584 < 1
  // attacker (loser) battle-loss = 0.12 / 0.584^1.4 ≈ 0.255 < 0.30 → not routed
  assert.equal(o.decisiveBattle.attackerWins, false);
  assert.equal(o.decisiveBattle.routed, false);
  assert.ok(Math.abs(o.decisiveBattle.loserTotalLoss - 0.255) < 0.005); // below the cliff: total = battle loss
});

test('DECISIVE: an OPEN rout converts on the M4 scale — deeper defeat costs more than the cliff edge', () => {
  const o = B.resolveEngagement({
    attacker: { size: 2000, commit: 8 },                        // R1 = 3000/500 = 6, shield breaks
    front: { garrison: 500, terrain: 'plains', fortification: 'none' },
    fieldArmy: { reaches: true, size: 1600 }, escape: 'OPEN',
  });
  // attackerAfter ≈ 1980; attackPower2 ≈ 2971; defense2 = 1200; R2 ≈ 2.48
  // loser battle-loss L ≈ 0.427 ≥ 0.30 → routed; OPEN total = L + 0.5×(1−L) ≈ 0.71 (a flat 0.65 would be wrong here)
  assert.equal(o.decisiveBattle.routed, true);
  assert.equal(o.decisiveBattle.annihilated, false);
  assert.ok(o.decisiveBattle.loserTotalLoss > 0.65 && o.decisiveBattle.loserTotalLoss < 1);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/battle.test.js`
Expected: FAIL — `o.decisiveBattle` is `undefined`.

- [ ] **Step 3: Write minimal implementation**

```js
// js/battle.js — add near the dials
const FIELD_ARMY_MARCH_WORN = 0.75;   // user 2026-07-13
const ROUT_FRAC = 0.30;               // M4 rout cliff
const ROUT_OPEN_REMAINDER_LOSS = 0.5; // M4 escape OPEN — 50% of the remainder falls in the pursuit

// Replace the DECISIVE return in resolveEngagement with:
  const attackPower2  = attackerAfter * commitLever(attacker.commit);
  const defensePower2 = fieldArmy.size * FIELD_ARMY_MARCH_WORN; // open field: no terrain/fort
  const R2 = attackPower2 / defensePower2;
  const c2 = casualtyFractions(R2);
  const attackerWins = R2 >= 1;
  const loserBattleLoss = attackerWins ? c2.defender : c2.attacker;
  const routed = loserBattleLoss >= ROUT_FRAC;
  const annihilated = routed && escape === 'BLOCKED';
  const loserTotalLoss = !routed ? loserBattleLoss
    : annihilated ? 1
    : Math.min(1, loserBattleLoss + ROUT_OPEN_REMAINDER_LOSS * (1 - loserBattleLoss));
  return {
    branch: 'DECISIVE', shieldBreak: true, ...base,
    decisiveBattle: { R2, attackerWins, routed, escape, annihilated, loserTotalLoss },
  };
```

(Delete the Task-3 placeholder `return { branch:'DECISIVE', ..., _attackerAfter }` line; `attackerAfter` is already in scope from the first-blow computation.)

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/battle.test.js`
Expected: PASS (9 tests).

- [ ] **Step 5: Commit**

```bash
git add js/battle.js tests/battle.test.js
git commit -m "feat(battle): DECISIVE branch — 결전 with rout cliff and escape state"
```

---

### Task 5: Measurement battery

**Files:**
- Create: `mockup/decisive-battle/battery.js`
- Test: `tests/battle-battery.test.js`

**Interfaces:**
- Consumes: `resolveEngagement` (Tasks 3-4).
- Produces: `runBattery(scenarios: input[]) → { branchCounts:{REPULSED, FALL, DECISIVE}, routCount, annihilationCount, terrainFlips }`. `terrainFlips` counts scenarios that are REPULSED as authored but would shield-break with terrain set to `plains`/`none` — the Myeongnyang-class "terrain flipped the battle" metric (§7.3).

- [ ] **Step 1: Write the failing test**

```js
// tests/battle-battery.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const { runBattery } = require('../mockup/decisive-battle/battery.js');

test('battery aggregates branch counts, routs, and terrain flips', () => {
  const scenarios = [
    // 1) terrain saves the front: pass+walls repels; on bare plains it would break (Myeongnyang-class)
    { attacker: { size: 1000, commit: 8 }, front: { garrison: 1000, terrain: 'pass', fortification: 'walls' },
      fieldArmy: { reaches: true, size: 800 }, escape: 'OPEN' },
    // 2) opportunism: shield breaks, field army pinned away → FALL
    { attacker: { size: 6000, commit: 8 }, front: { garrison: 500, terrain: 'plains', fortification: 'none' },
      fieldArmy: { reaches: false, size: 2000 }, escape: 'OPEN' },
    // 3) decisive annihilation: overwhelming attacker, BLOCKED escape
    { attacker: { size: 6000, commit: 8 }, front: { garrison: 500, terrain: 'plains', fortification: 'none' },
      fieldArmy: { reaches: true, size: 1000 }, escape: 'BLOCKED' },
  ];
  const s = runBattery(scenarios);
  assert.equal(s.branchCounts.REPULSED, 1);
  assert.equal(s.branchCounts.FALL, 1);
  assert.equal(s.branchCounts.DECISIVE, 1);
  assert.equal(s.routCount, 1);
  assert.equal(s.annihilationCount, 1);
  assert.equal(s.terrainFlips, 1); // scenario 1 flips
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/battle-battery.test.js`
Expected: FAIL — `Cannot find module '../mockup/decisive-battle/battery.js'`.

- [ ] **Step 3: Write minimal implementation**

```js
// mockup/decisive-battle/battery.js
'use strict';
const B = require('../../js/battle.js');

function wouldBreakOnBareGround(sc) {
  const bare = { ...sc, front: { ...sc.front, terrain: 'plains', fortification: 'none' } };
  return B.resolveEngagement(bare).shieldBreak;
}

function runBattery(scenarios) {
  const summary = {
    branchCounts: { REPULSED: 0, FALL: 0, DECISIVE: 0 },
    routCount: 0, annihilationCount: 0, terrainFlips: 0,
  };
  for (const sc of scenarios) {
    const o = B.resolveEngagement(sc);
    summary.branchCounts[o.branch]++;
    if (o.decisiveBattle && o.decisiveBattle.routed) summary.routCount++;
    if (o.decisiveBattle && o.decisiveBattle.annihilated) summary.annihilationCount++;
    if (o.branch === 'REPULSED' && wouldBreakOnBareGround(sc)) summary.terrainFlips++;
  }
  return summary;
}

if (require.main === module) {
  // Placeholder scenario matrix run — expanded during the measurement pass.
  console.log(JSON.stringify(runBattery([]), null, 2));
}

module.exports = { runBattery };
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/battle-battery.test.js`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add mockup/decisive-battle/battery.js tests/battle-battery.test.js
git commit -m "feat(battle): measurement battery — branch/rout/terrain-flip aggregation"
```

---

## Self-Review

**Spec coverage:**
- §2 pure isomorphic module → Tasks 1-4 (`js/battle.js`, `module.exports`/`window` tail). ✓
- §4 three branches (first-blow → REPULSED/DECISIVE/FALL) → Tasks 3-4. ✓
- §4 atomic (one function, no multi-turn state) → `resolveEngagement` is a single pure call. ✓
- §5 shield = 병력×지형×요새, commit baseline → Task 2 `shieldPower`. ✓
- §5 attack = 병력×lever → Task 3 (`attacker.size * commitLever`). ✓
- §5 R, casualty curve, rout cliff, escape → Tasks 2, 4. ✓
- §5 field-army ×0.75 → Task 4 `FIELD_ARMY_MARCH_WORN`. ✓
- §6 interface (input/outcome contract) → Task 3-4 Interfaces blocks. ✓
- §7 measurement (quant 1-2, qual 3-4) → Task 5 (`routCount`/`annihilationCount` = quant; `terrainFlips` = qual 3; FALL count = qual 4). ✓
- §9 threshold single value / late-arrival ×0.75 → constants, sweepable in battery. ✓
- **Gap noted:** §7 qual-4 "pinned front falls" is the FALL branch count — battery reports `branchCounts.FALL`; adequate for this slice (no dedicated metric needed).

**Placeholder scan:** the Task-3 `_attackerAfter` carry-field and its Task-4 removal are explicitly described in both Interfaces blocks (not a hidden placeholder). `battery.js` `require.main` block is a labeled stub for the later measurement pass, not a task deliverable. No `TODO`/`TBD`/"handle edge cases" remain.

**Type consistency:** `resolveEngagement` input/outcome shape is identical across Tasks 3-5; `casualtyFractions` returns `{attacker, defender}` used consistently; `commitLever(points)` signature stable. Battery consumes `outcome.branch`, `outcome.decisiveBattle.{routed,annihilated}`, `outcome.shieldBreak` — all defined in Tasks 3-4. ✓

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-13-decisive-battle-spine.md`. Two execution options:

1. **Subagent-Driven (recommended)** — a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — execute tasks in this session with checkpoints for review.
