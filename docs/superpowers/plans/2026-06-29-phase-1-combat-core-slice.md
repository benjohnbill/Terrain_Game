# Phase 1 Combat & Force-Roles Core Slice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace global-strength combat with terrain-mediated, force-role combat so that defense comes primarily from a province's local garrison and terrain rather than the attacker's national pool, fixing the snowball described in SPEC.md.

**Architecture:** Add one focused `js/combat.js` module (`CombatSystem`) that owns all force computation, single-stage stochastic resolution, and a deterministic forecast range. `ActionSystem.attack` and the UI consume effective-force inputs and an outcome object through this module. Resolution randomness and round structure live in exactly one place (`resolve`/`forecast`) so a future multi-round attrition model can replace the internals without touching call sites. `faction.military` is re-cast as **standing forces** (national, mobile, treasury-funded); each hex's `localGarrison` is the **garrison** (locally sustained); attacks may add **offensive mobilization** drawn from population.

**Tech Stack:** Static HTML, Canvas, plain browser JavaScript on `window`, Node.js built-in test runner (`node --test`) for logic tests, local `python3 -m http.server` for browser verification.

## Global Constraints

- No new runtime dependencies. Browser scripts attach classes to `window.*`; logic is tested through the existing `tests/helpers/load-browser-scripts.js` VM harness.
- Test command is `npm test` (`node --test tests/*.test.js`). Every task ends with this green.
- Conversation is Korean honorific; **all artifacts (code comments, commit messages, plan text) use neutral professional English**. In-game user-facing strings stay Korean, matching existing files.
- Commit messages end with: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.
- All slice work happens on branch `feat/phase-1-combat-core` (branched from `main` at `3f6bd6e`). Do not commit to `main`.
- Follow the existing file style: `window.X = class X {...}` or `window.X = Object.freeze({...})`, 2-space indent, Korean section banner comments are acceptable where the surrounding file uses them.

---

## Confirmed Slice-2 Decisions (pinned for plan review)

These were the spec's four "Deferred Implementation Decisions"; the user confirmed them this session. They are requirements, not open questions:

1. **Combat resolution model — single-stage stochastic, seam-encapsulated.** One bounded random roll per side, binary win/hold outcome. The resolution must be isolated behind `CombatSystem.resolve()`/`forecast()` so a future **multi-round attrition** model can replace the internals only. (User: "지금은 단일 단계로 가지만, 추후 다단계 소모전으로 갈 수 있음.")
2. **Force-role split — standing / garrison / mobilization.** `faction.military` → standing forces (attack, national upkeep). `hex.localGarrison` → garrison (default local defense, sustained from local economy per ADR 0014). Offensive mobilization is drawn from population (ADR 0009).
3. **Terrain/crossing scope — defense multipliers + amphibious penalty only.** Terrain defense multipliers (already in `TERRAIN_TYPES[*].defense`) plus a crossing penalty when attacking **into** a `river`/`coast_strait` target hex (target-hex terrain only; no movement pathing), mitigated by a `port` settlement function (ADR 0015). Movement and supply are deferred to a later slice.
4. **Offensive mobilization — BASIC + future hook.** Mobilization boosts attack at reduced efficiency and costs population now (ADR 0009). The future *capacity* cost is only recorded as a hook field on the result (capacity consumption lands in slice 5). Unrest/event chains are deferred.

## Combat Model Reference (for context; each task repeats the exact code it needs)

Effective forces and resolution, with concrete tuning:

- **Roll band:** `factor = 0.7 + r * 0.6` (0.7 .. 1.3), `r` from an injectable rng (defaults to `Math.random`; tests inject a fixed function). Matches the existing `actions.js` band.
- **Attack force** = `round( military*(1+attackBonus) * crossingPenalty + mobilizedTroops * 0.6 )`.
  - `military*(1+attackBonus)` is `attacker.calculateMilitary() * (1 + attacker.getAttackBonus())` (existing methods).
  - `crossingPenalty(targetTerrain, portMitigation)`: `river → 0.85`, `coast_strait → 0.70`, otherwise `1`. `portMitigation` moves the penalty halfway to `1.0`.
  - Mobilization efficiency `0.6` (less efficient than trained standing forces).
- **Defense force** for a hex = `round(localGarrison * terrainDefense) + defenseValue + buildingDefenseBonus`, where `terrainDefense = TERRAIN_TYPES[hex.terrain].defense`. If the owner has actively committed to defend this hex (`isDefending && defendingHex === key`): `defenseForce = round(defenseForce * 1.5) + round(min(military*0.3, 50))` (standing-force "critical defense"). Neutral hexes use garrison + terrain + fortification only (no owner, no building, no standing support).
- **Resolution:** `attackRoll = round(attackForce*factor)`, `defenseRoll = round(defenseForce*factor)`, attacker wins iff `attackRoll > defenseRoll`.
- **Forecast (no randomness):** expected ratio `attackForce/defenseForce`; `low` uses worst attacker roll vs best defender roll; `high` the reverse; band `<0.8 열세 / <1.1 호각 / <1.5 우세 / ≥1.5 압도`. Used by previews (full UI wiring is slice 6; this slice only provides the pure function + test).
- **Garrison sustainment (ADR 0014):** each round, every hex regenerates `localGarrison` 25% of the gap toward a local ceiling `max(2, round((economyValue + population)/4))` (min +1 while below). Conquered hexes are seeded low (occupation) and regrow from their own economy — newly taken poor provinces stay vulnerable.

## File Structure

- Create `js/combat.js`: `CombatSystem` — constants, `crossingPenalty`, `computeAttackForce`, `computeDefenseForce`, `resolve`, `forecast`, `_roll`, `_band`. Single home for all combat rules.
- Create `tests/combat.test.js`: unit tests for the pure `CombatSystem` functions (resolve/forecast/forces/crossing).
- Create `tests/combat-attack.test.js`: integration tests for the rewritten `ActionSystem.attack` against a minimal game stub.
- Create `tests/garrison.test.js`: unit tests for `HexCell.regenerateGarrison`.
- Modify `index.html`: load `js/combat.js` before `js/actions.js`.
- Modify `js/faction.js`: add `drawMobilization`; remove `getDefenseAt` (logic moves to `CombatSystem.computeDefenseForce`); document `military` as standing forces.
- Modify `js/map.js`: add `HexCell.regenerateGarrison()`.
- Modify `js/actions.js`: rewrite `attack` to use `CombatSystem` (force roles, terrain, crossing, mobilization, role-targeted losses).
- Modify `js/game.js`: pass a `mobilize` option through `executeAction`; expose optional `this.rng`; sweep garrison regen in `_startRound`.
- Modify `js/ui.js`: hex tooltip defense uses `CombatSystem.computeDefenseForce` instead of the removed `faction.getDefenseAt`.

---

## Task 1: CombatSystem Resolution Seam

Build the isolated resolution core first: roll band, `resolve`, `forecast`, `_band`, and the shared constants. No faction/hex dependencies, fully deterministic under an injected rng.

**Files:**
- Create: `js/combat.js`
- Test: `tests/combat.test.js`

**Interfaces:**
- Consumes: nothing (pure numeric inputs).
- Produces:
  - `window.CombatSystem` (class).
  - `CombatSystem.ROLL_MIN = 0.7`, `CombatSystem.ROLL_SPAN = 0.6`, `CombatSystem.MOBILIZATION_EFFICIENCY = 0.6`, `CombatSystem.CROSSING = { river: 0.85, coast_strait: 0.70 }`.
  - `CombatSystem._roll(rngFn) -> number` (factor in 0.7..1.3).
  - `CombatSystem.resolve(attackForce:number, defenseForce:number, rngFn?:()=>number) -> {attackRoll:number, defenseRoll:number, attackerWins:boolean}`.
  - `CombatSystem.forecast(attackForce:number, defenseForce:number) -> {low:number, expected:number, high:number, band:string}`.
  - `CombatSystem._band(ratio:number) -> string`.

- [ ] **Step 1: Write the failing test**

Create `tests/combat.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts } = require('./helpers/load-browser-scripts');

test('resolve is deterministic under an injected rng and picks the larger rolled force', () => {
  const { CombatSystem } = loadScripts(['js/domain-data.js', 'js/combat.js']);
  const rng = () => 0.5; // factor 1.0 for both rolls

  const win = CombatSystem.resolve(100, 60, rng);
  assert.equal(win.attackRoll, 100);
  assert.equal(win.defenseRoll, 60);
  assert.equal(win.attackerWins, true);

  const loss = CombatSystem.resolve(60, 100, rng);
  assert.equal(loss.attackerWins, false);
});

test('roll factor honors the 0.7 to 1.3 band at rng extremes', () => {
  const { CombatSystem } = loadScripts(['js/domain-data.js', 'js/combat.js']);
  assert.equal(CombatSystem._roll(() => 0), 0.7);
  assert.ok(Math.abs(CombatSystem._roll(() => 1) - 1.3) < 1e-9);
});

test('forecast returns a band and a low/expected/high range without randomness', () => {
  const { CombatSystem } = loadScripts(['js/domain-data.js', 'js/combat.js']);
  const f = CombatSystem.forecast(120, 100);
  assert.ok(Math.abs(f.expected - 1.2) < 1e-9);
  assert.ok(f.low < f.expected && f.expected < f.high);
  assert.equal(f.band, '우세');
  assert.equal(CombatSystem.forecast(50, 100).band, '열세');
  assert.equal(CombatSystem.forecast(100, 100).band, '호각');
  assert.equal(CombatSystem.forecast(300, 100).band, '압도');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/combat.test.js`
Expected: FAIL — `Cannot read properties of undefined` / `CombatSystem` is undefined (file not created yet).

- [ ] **Step 3: Write minimal implementation**

Create `js/combat.js`:

```js
/* ============================================================
 *  combat.js — CombatSystem
 *  Phase 1 Slice 2: terrain-mediated, force-role combat.
 *
 *  SEAM NOTE: resolve() and forecast() are the ONLY places combat
 *  randomness and round structure live. To later replace this
 *  single-stage model with multi-round attrition, rewrite the
 *  internals of resolve()/forecast() ONLY — callers (ActionSystem,
 *  GameUI) pass effective-force inputs and read an outcome object,
 *  and must not change.
 *
 *  Depends on: TERRAIN_TYPES, BUILDINGS (window).
 * ============================================================ */

window.CombatSystem = class CombatSystem {

  /* Bounded random factor band shared by attack and defense rolls. */
  static get ROLL_MIN() { return 0.7; }
  static get ROLL_SPAN() { return 0.6; } // → 0.7 .. 1.3

  /* Offensive mobilization is less efficient than trained standing forces. */
  static get MOBILIZATION_EFFICIENCY() { return 0.6; }

  /* Attacker penalty for assaulting INTO water terrain (ADR 0015). */
  static get CROSSING() { return { river: 0.85, coast_strait: 0.70 }; }

  /** Bounded random multiplier; rngFn defaults to Math.random. */
  static _roll(rngFn) {
    const r = (typeof rngFn === 'function' ? rngFn : Math.random)();
    return CombatSystem.ROLL_MIN + r * CombatSystem.ROLL_SPAN;
  }

  /** Single-stage stochastic resolution. SEAM: a future multi-round
   *  attrition model replaces this body only. */
  static resolve(attackForce, defenseForce, rngFn) {
    const attackRoll  = Math.round(attackForce  * CombatSystem._roll(rngFn));
    const defenseRoll = Math.round(defenseForce * CombatSystem._roll(rngFn));
    return { attackRoll, defenseRoll, attackerWins: attackRoll > defenseRoll };
  }

  /** Deterministic outcome RANGE for previews (spec: show a range, not a %). */
  static forecast(attackForce, defenseForce) {
    const max = CombatSystem.ROLL_MIN + CombatSystem.ROLL_SPAN;
    const low  = (attackForce * CombatSystem.ROLL_MIN) / (defenseForce * max);
    const high = (attackForce * max) / (defenseForce * CombatSystem.ROLL_MIN);
    const expected = attackForce / defenseForce;
    return { low, expected, high, band: CombatSystem._band(expected) };
  }

  static _band(ratio) {
    if (ratio < 0.8) return '열세';
    if (ratio < 1.1) return '호각';
    if (ratio < 1.5) return '우세';
    return '압도';
  }
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/combat.test.js`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add js/combat.js tests/combat.test.js
git commit -m "feat: add CombatSystem resolution seam (resolve, forecast)"
```

---

## Task 2: Attack Force & Crossing Penalty

Add force-projection computation: the crossing penalty and the attacker's effective force, including mobilization.

**Files:**
- Modify: `js/combat.js`
- Test: `tests/combat.test.js`

**Interfaces:**
- Consumes: `attacker.calculateMilitary()`, `attacker.getAttackBonus()` (existing `Faction` methods); `targetHex.terrain` (string).
- Produces:
  - `CombatSystem.crossingPenalty(targetTerrain:string, portMitigation:boolean) -> number`.
  - `CombatSystem.computeAttackForce(attacker, targetHex, opts?:{mobilizedTroops?:number, portMitigation?:boolean}) -> number`.

- [ ] **Step 1: Write the failing test**

Append to `tests/combat.test.js`:

```js
test('crossing penalty applies only to water terrain and is eased by a port', () => {
  const { CombatSystem } = loadScripts(['js/domain-data.js', 'js/combat.js']);
  assert.equal(CombatSystem.crossingPenalty('plains', false), 1);
  assert.equal(CombatSystem.crossingPenalty('river', false), 0.85);
  assert.equal(CombatSystem.crossingPenalty('coast_strait', false), 0.70);
  // port mitigation moves the penalty halfway to 1.0
  assert.ok(Math.abs(CombatSystem.crossingPenalty('coast_strait', true) - 0.85) < 1e-9);
});

test('attack force scales standing forces by attack bonus, crossing, and adds mobilization at 0.6', () => {
  const { CombatSystem } = loadScripts(['js/domain-data.js', 'js/combat.js']);
  const attacker = { calculateMilitary: () => 100, getAttackBonus: () => 0.2 };

  // plains, no mobilization: round(100 * 1.2 * 1) = 120
  assert.equal(CombatSystem.computeAttackForce(attacker, { terrain: 'plains' }, {}), 120);

  // coast_strait, no port: round(100 * 1.2 * 0.70) = 84
  assert.equal(CombatSystem.computeAttackForce(attacker, { terrain: 'coast_strait' }, {}), 84);

  // plains + 50 mobilized: round(120 + 50 * 0.6) = 150
  assert.equal(
    CombatSystem.computeAttackForce(attacker, { terrain: 'plains' }, { mobilizedTroops: 50 }),
    150
  );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/combat.test.js`
Expected: FAIL — `CombatSystem.crossingPenalty is not a function`.

- [ ] **Step 3: Write minimal implementation**

In `js/combat.js`, add these two static methods inside the class (e.g. after `_roll`):

```js
  /** Crossing penalty for attacking INTO targetTerrain.
   *  portMitigation=true (a port stages or receives the assault) halves the penalty. */
  static crossingPenalty(targetTerrain, portMitigation) {
    const base = CombatSystem.CROSSING[targetTerrain];
    if (base === undefined) return 1;
    return portMitigation ? base + (1 - base) * 0.5 : base;
  }

  /** Effective ATTACK force. opts: { mobilizedTroops=0, portMitigation=false }. */
  static computeAttackForce(attacker, targetHex, opts) {
    const o = opts || {};
    const base = attacker.calculateMilitary() * (1 + attacker.getAttackBonus());
    const projected = base * CombatSystem.crossingPenalty(targetHex.terrain, !!o.portMitigation);
    const mobilized = (o.mobilizedTroops || 0) * CombatSystem.MOBILIZATION_EFFICIENCY;
    return Math.max(1, Math.round(projected + mobilized));
  }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/combat.test.js`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add js/combat.js tests/combat.test.js
git commit -m "feat: add attack-force projection and crossing penalty to CombatSystem"
```

---

## Task 3: Defense Force From Local Garrison & Terrain

Add the defensive computation that makes defense local: garrison × terrain + fortification + building, with a standing-force "critical defense" term only on an actively defended hex. This is the heart of the anti-snowball change.

**Files:**
- Modify: `js/combat.js`
- Test: `tests/combat.test.js`

**Interfaces:**
- Consumes: `hex.terrain`, `hex.localGarrison`, `hex.defenseValue`, `hex.key()`; `TERRAIN_TYPES`, `BUILDINGS`; `ownerFaction.buildings` (Map), `ownerFaction.isDefending`, `ownerFaction.defendingHex`, `ownerFaction.calculateMilitary()`.
- Produces: `CombatSystem.computeDefenseForce(hex, ownerFaction|null) -> number`.

- [ ] **Step 1: Write the failing test**

Append to `tests/combat.test.js`:

```js
test('defense force is local: garrison x terrain + fortification, no national pool by default', () => {
  const { CombatSystem } = loadScripts(['js/domain-data.js', 'js/combat.js']);
  // mountain_pass defense multiplier is 1.45
  const hex = { terrain: 'mountain_pass', localGarrison: 10, defenseValue: 16, key: () => '1,1' };
  // round(10 * 1.45) + 16 = round(14.5) + 16 = 15 + 16 = 31 ; neutral (no owner)
  assert.equal(CombatSystem.computeDefenseForce(hex, null), 31);
});

test('an owner does not raise defense unless actively defending that hex', () => {
  const { CombatSystem } = loadScripts(['js/domain-data.js', 'js/combat.js']);
  const hex = { terrain: 'plains', localGarrison: 8, defenseValue: 10, key: () => '2,2' };
  const owner = {
    buildings: new Map(),
    isDefending: false,
    defendingHex: null,
    calculateMilitary: () => 200
  };
  // plains 0.9: round(8 * 0.9) + 10 = 7 + 10 = 17 ; huge army gives NO passive bonus
  assert.equal(CombatSystem.computeDefenseForce(hex, owner), 17);
});

test('actively defending a hex adds capped standing support and a 1.5x posture multiplier', () => {
  const { CombatSystem } = loadScripts(['js/domain-data.js', 'js/combat.js']);
  const hex = { terrain: 'plains', localGarrison: 8, defenseValue: 10, key: () => '2,2' };
  const owner = {
    buildings: new Map(),
    isDefending: true,
    defendingHex: '2,2',
    calculateMilitary: () => 200
  };
  // base 17 -> round(17 * 1.5) = 26 ; standing support round(min(200*0.3,50)) = 50 ; total 76
  assert.equal(CombatSystem.computeDefenseForce(hex, owner), 76);
});

test('building defense bonus (e.g. wall) is included for the owner', () => {
  const { CombatSystem } = loadScripts(['js/domain-data.js', 'js/buildings.js', 'js/combat.js']);
  const hex = { terrain: 'plains', localGarrison: 8, defenseValue: 10, key: () => '3,3' };
  const owner = {
    buildings: new Map([['3,3', 'wall']]),
    isDefending: false,
    defendingHex: null,
    calculateMilitary: () => 50
  };
  // 17 + wall defenseBonus 30 = 47
  assert.equal(CombatSystem.computeDefenseForce(hex, owner), 47);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/combat.test.js`
Expected: FAIL — `CombatSystem.computeDefenseForce is not a function`.

- [ ] **Step 3: Write minimal implementation**

In `js/combat.js`, add inside the class (after `computeAttackForce`):

```js
  /** Effective DEFENSE force for a hex held by ownerFaction (null = neutral).
   *  Local-first: garrison and terrain dominate; the national standing pool
   *  only contributes when the owner has actively committed to defend THIS hex. */
  static computeDefenseForce(hex, ownerFaction) {
    const terrain = window.TERRAIN_TYPES[hex.terrain];
    const terrainDef = terrain ? terrain.defense : 1;
    let force = Math.round(hex.localGarrison * terrainDef) + hex.defenseValue;

    if (ownerFaction) {
      const buildingId = ownerFaction.buildings.get(hex.key());
      if (buildingId) {
        const b = window.BUILDINGS[buildingId];
        if (b && b.effects && b.effects.defenseBonus) force += b.effects.defenseBonus;
      }
      if (ownerFaction.isDefending && ownerFaction.defendingHex === hex.key()) {
        const standingSupport = Math.round(Math.min(ownerFaction.calculateMilitary() * 0.3, 50));
        force = Math.round(force * 1.5) + standingSupport;
      }
    }
    return Math.max(1, force);
  }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/combat.test.js`
Expected: PASS (9 tests).

- [ ] **Step 5: Commit**

```bash
git add js/combat.js tests/combat.test.js
git commit -m "feat: compute defense force from local garrison, terrain, and fortification"
```

---

## Task 4: Faction Force-Role Adjustments

Re-cast `faction.military` as standing forces in documentation, add `drawMobilization` (population → temporary troops), remove the obsolete global `getDefenseAt`, and point the UI tooltip at `CombatSystem.computeDefenseForce` so the repo stays green.

**Files:**
- Modify: `js/faction.js`
- Modify: `js/ui.js:477`
- Test: `tests/combat-attack.test.js` (new file; first test covers `drawMobilization`)

**Interfaces:**
- Consumes: `faction.population` (number).
- Produces: `faction.drawMobilization(levy:number) -> number` (troops actually raised; reduces `faction.population`). Removes `faction.getDefenseAt`.

- [ ] **Step 1: Write the failing test**

Create `tests/combat-attack.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts } = require('./helpers/load-browser-scripts');

function loadGameScripts() {
  return loadScripts([
    'js/domain-data.js',
    'js/buildings.js',
    'js/faction.js',
    'js/map.js',
    'js/combat.js',
    'js/actions.js'
  ]);
}

test('drawMobilization raises troops from population, capped at 20% of population', () => {
  const ctx = loadGameScripts();
  const f = new ctx.Faction({ id: 0, name: 'T', color: '#000', colorLight: '#111', emoji: '🔴' }, false);
  f.population = 100;

  const drawn = f.drawMobilization(15);
  assert.equal(drawn, 15);
  assert.equal(f.population, 85);

  // request above the 20% ceiling of the remaining 85 -> capped at floor(85*0.2)=17
  const drawn2 = f.drawMobilization(1000);
  assert.equal(drawn2, 17);
  assert.equal(f.population, 68);
});

test('faction no longer exposes the obsolete global getDefenseAt', () => {
  const ctx = loadGameScripts();
  const f = new ctx.Faction({ id: 0, name: 'T', color: '#000', colorLight: '#111', emoji: '🔴' }, false);
  assert.equal(typeof f.getDefenseAt, 'undefined');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/combat-attack.test.js`
Expected: FAIL — `f.drawMobilization is not a function`.

- [ ] **Step 3: Write minimal implementation**

In `js/faction.js`, update the `military` field comment in the constructor (find `this.military = 50;`) to:

```js
    this.military = 50;     // standing forces: national, mobile, treasury-funded (ADR 0009/0014)
```

Add this method to the `Faction` class (e.g. after `spend`):

```js
  // ──────────────────────────────────────────────
  // 공세 동원 — 인구에서 임시 병력 차출 (ADR 0009)
  // ──────────────────────────────────────────────
  drawMobilization(levy) {
    const available = Math.floor(this.population * 0.2);
    const drawn = Math.max(0, Math.min(levy, available));
    this.population -= drawn;
    return drawn;
  }
```

Delete the entire `getDefenseAt(hexKey)` method (the block from `getDefenseAt(hexKey) {` through its closing `}`), including its `// 특정 헥스 방어력 계산` banner.

In `js/ui.js`, replace the line at 477:

```js
    if (owner) defenseStr = '' + owner.getDefenseAt(hex.key());
```

with:

```js
    if (owner) defenseStr = '' + window.CombatSystem.computeDefenseForce(hex, owner);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/combat-attack.test.js`
Expected: PASS (2 tests).

- [ ] **Step 5: Run the full suite to confirm no regressions**

Run: `npm test`
Expected: PASS — all existing suites plus the new combat tests.

- [ ] **Step 6: Commit**

```bash
git add js/faction.js js/ui.js tests/combat-attack.test.js
git commit -m "refactor: re-cast faction.military as standing forces, add mobilization, drop global getDefenseAt"
```

---

## Task 5: Rewrite ActionSystem.attack On The Force-Role Model

Replace the global-strength attack with the `CombatSystem` model: standing-force attack with crossing/mobilization, local-garrison defense, role-targeted losses (attacker standing forces, defender garrison), wall handling via `canIgnoreWalls`, and a `pendingCapacityCost` hook when mobilizing. Thread a `mobilize` option and an optional `game.rng` through `executeAction`.

**Files:**
- Modify: `js/actions.js` (`attack`, lines ~34-159)
- Modify: `js/game.js` (`executeAction` attack case ~169; reference `this.rng`)
- Test: `tests/combat-attack.test.js`

**Interfaces:**
- Consumes: `CombatSystem.computeAttackForce`, `CombatSystem.computeDefenseForce`, `CombatSystem.resolve`; `faction.drawMobilization`; existing `game.map.getNeighbors/getHex`, `game.diplomacy.*`, `game.getFaction`, `game.addEvent`, `game.factions`.
- Produces: `ActionSystem.attack(game, attacker, targetHex, opts?:{mobilize?:boolean}) -> {success, message, conquered, attackForce, defenseForce, attackRoll, defenseRoll, attackCost, tributePaid, mobilizedTroops, pendingCapacityCost}`.
  - `pendingCapacityCost` is `null` when not mobilizing, else `{capacity:'command', amount:number}` (consumed in slice 5).

- [ ] **Step 1: Write the failing test**

Append to `tests/combat-attack.test.js`:

```js
// Minimal game stub: just enough for ActionSystem.attack.
function makeGame(ctx, { attacker, defender, targetHex, neighbors, rng }) {
  const factionsById = {};
  [attacker, defender].filter(Boolean).forEach(f => { factionsById[f.id] = f; });
  return {
    rng,
    factions: [attacker, defender].filter(Boolean),
    map: {
      getNeighbors: () => neighbors,
      getHex: (q, r) => (q === targetHex.q && r === targetHex.r ? targetHex
        : neighbors.map(n => n.hex).find(h => h.q === q && h.r === r) || null)
    },
    diplomacy: {
      isAlly: () => false,
      isAtWar: () => true,           // already at war: skip declaration branch
      declareWar: () => {},
      penalizeWarStarter: () => {}
    },
    getFaction: (id) => factionsById[id] || null,
    addEvent: () => {}
  };
}

function newFaction(ctx, id) {
  const f = new ctx.Faction({ id, name: 'F' + id, color: '#000', colorLight: '#111', emoji: '⬛' }, id !== 0);
  return f;
}

test('attack uses local defense: a small garrison falls to a standing army on adjacent owned land', () => {
  const ctx = loadGameScripts();
  const attacker = newFaction(ctx, 0);
  const defender = newFaction(ctx, 1);
  attacker.gold = 1000;
  attacker.military = 100;

  const targetHex = new ctx.HexCell(5, 5);
  targetHex.terrain = 'plains';
  targetHex.owner = 1;
  targetHex.localGarrison = 6;
  targetHex.defenseValue = 8;
  defender.territories.add('5,5');

  // attacker owns an adjacent hex
  const ownHex = new ctx.HexCell(5, 4); ownHex.owner = 0;
  const neighbors = [{ q: 5, r: 4, hex: ownHex }];

  const game = makeGame(ctx, { attacker, defender, targetHex, neighbors, rng: () => 0.5 });
  const result = ctx.ActionSystem.attack(game, attacker, targetHex, {});

  assert.equal(result.success, true);
  assert.equal(result.conquered, true);
  assert.equal(targetHex.owner, 0);                 // ownership transferred
  assert.ok(attacker.territories.has('5,5'));
  assert.ok(attacker.military < 100);               // standing forces took losses
  assert.ok(result.attackForce > result.defenseForce);
  assert.equal(result.pendingCapacityCost, null);   // no mobilization requested
});

test('attack into a strong mountain garrison fails for a modest army (terrain matters)', () => {
  const ctx = loadGameScripts();
  const attacker = newFaction(ctx, 0);
  const defender = newFaction(ctx, 1);
  attacker.gold = 1000;
  attacker.military = 30;

  const targetHex = new ctx.HexCell(7, 7);
  targetHex.terrain = 'mountain_pass';               // defense x1.45
  targetHex.owner = 1;
  targetHex.localGarrison = 18;
  targetHex.defenseValue = 24;
  defender.territories.add('7,7');

  const ownHex = new ctx.HexCell(7, 6); ownHex.owner = 0;
  const neighbors = [{ q: 7, r: 6, hex: ownHex }];

  const game = makeGame(ctx, { attacker, defender, targetHex, neighbors, rng: () => 0.5 });
  const result = ctx.ActionSystem.attack(game, attacker, targetHex, {});

  assert.equal(result.conquered, false);
  assert.equal(targetHex.owner, 1);                 // held
  assert.ok(result.defenseForce > result.attackForce);
});

test('mobilization adds attacker force, costs population, and records a future capacity hook', () => {
  const ctx = loadGameScripts();
  const attacker = newFaction(ctx, 0);
  const defender = newFaction(ctx, 1);
  attacker.gold = 1000;
  attacker.military = 30;
  attacker.population = 200;

  const targetHex = new ctx.HexCell(8, 8);
  targetHex.terrain = 'plains';
  targetHex.owner = 1;
  targetHex.localGarrison = 6;
  targetHex.defenseValue = 8;
  defender.territories.add('8,8');

  const ownHex = new ctx.HexCell(8, 7); ownHex.owner = 0;
  const neighbors = [{ q: 8, r: 7, hex: ownHex }];

  const game = makeGame(ctx, { attacker, defender, targetHex, neighbors, rng: () => 0.5 });
  const result = ctx.ActionSystem.attack(game, attacker, targetHex, { mobilize: true });

  assert.ok(result.mobilizedTroops > 0);
  assert.ok(attacker.population < 200);             // population spent
  assert.deepEqual(result.pendingCapacityCost, { capacity: 'command', amount: result.mobilizedTroops });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/combat-attack.test.js`
Expected: FAIL — current `attack` ignores terrain/garrison, returns no `attackForce`/`pendingCapacityCost`; assertions break.

- [ ] **Step 3: Write minimal implementation**

In `js/actions.js`, first delete the now-unused `_rollFactor` helper (the `static _rollFactor() { ... }` block and its banner comment — resolution randomness now lives in `CombatSystem._roll`). Keep `_isAdjacentToFaction`. Then replace the whole `attack` method (from `static attack(game, attacker, targetHex) {` through its closing `}` at the end of the ATTACK section) with:

```js
  /**
   * @param {Game}    game
   * @param {Faction} attacker
   * @param {HexCell} targetHex
   * @param {object}  [opts]  { mobilize?: boolean }
   */
  static attack(game, attacker, targetHex, opts) {
    const o = opts || {};
    const hexKey = targetHex.key();

    /* ── validation ── */
    if (targetHex.owner === attacker.id) {
      return { success: false, message: '자신의 영토는 공격할 수 없습니다.', conquered: false, attackRoll: 0, defenseRoll: 0 };
    }
    if (targetHex.owner !== null && game.diplomacy.isAlly(attacker.id, targetHex.owner)) {
      return { success: false, message: '동맹국은 공격할 수 없습니다.', conquered: false, attackRoll: 0, defenseRoll: 0 };
    }
    if (!ActionSystem._isAdjacentToFaction(game, attacker.id, targetHex.q, targetHex.r)) {
      return { success: false, message: '인접한 영토만 공격할 수 있습니다.', conquered: false, attackRoll: 0, defenseRoll: 0 };
    }
    if (attacker.military <= 0) {
      return { success: false, message: '상비군이 부족합니다.', conquered: false, attackRoll: 0, defenseRoll: 0 };
    }

    /* ── attack cost (gold) ── */
    const attackCost = Math.max(1, Math.ceil(attacker.calculateIncome() * attacker.getTaxAttackCostRate()));
    if (!attacker.canAfford(attackCost)) {
      return { success: false, message: `공격 비용이 부족합니다. (필요: 💰${attackCost}, 보유: 💰${attacker.gold})`, conquered: false, attackRoll: 0, defenseRoll: 0 };
    }
    attacker.spend(attackCost);

    /* ── declare war if needed ── */
    if (targetHex.owner !== null && !game.diplomacy.isAtWar(attacker.id, targetHex.owner)) {
      game.diplomacy.declareWar(attacker.id, targetHex.owner);
      game.diplomacy.penalizeWarStarter(attacker.id, targetHex.owner, game.factions.length);
      const defenderFaction = game.getFaction(targetHex.owner);
      if (defenderFaction) {
        game.addEvent(`⚠️ ${attacker.emoji} ${attacker.name}이(가) ${defenderFaction.emoji} ${defenderFaction.name} 침공으로 전쟁을 시작했습니다. 다른 국가들의 외교 점수가 하락했습니다.`, attacker.id);
      }
    }

    /* ── offensive mobilization (ADR 0009): optional, drawn from population ── */
    let mobilizedTroops = 0;
    let pendingCapacityCost = null;
    if (o.mobilize) {
      const levy = Math.floor(attacker.population * 0.1);
      mobilizedTroops = attacker.drawMobilization(levy);
      if (mobilizedTroops > 0) {
        // Future-capacity cost is recorded as a hook; capacity consumption lands in slice 5.
        pendingCapacityCost = { capacity: 'command', amount: mobilizedTroops };
      }
    }

    /* ── port mitigation: a port stages/receives an amphibious assault ── */
    const portMitigation = ActionSystem._hasPortMitigation(game, attacker.id, targetHex);

    /* ── effective forces ── */
    const attackForce = window.CombatSystem.computeAttackForce(
      attacker, targetHex, { mobilizedTroops, portMitigation }
    );

    let defender = targetHex.owner === null ? null : game.getFaction(targetHex.owner);
    if (defender && !defender.alive) defender = null;
    let defenseForce = window.CombatSystem.computeDefenseForce(targetHex, defender);

    // Walls: handled once here so canIgnoreWalls (military tech 3) can negate them.
    if (targetHex.building === 'wall' && attacker.canIgnoreWalls()) {
      const wallDef = (window.BUILDINGS.wall.effects.defenseBonus) || 0;
      defenseForce = Math.max(1, defenseForce - wallDef);
    }

    /* ── resolve (single-stage stochastic; seam in CombatSystem) ── */
    const outcome = window.CombatSystem.resolve(attackForce, defenseForce, game.rng);
    const attackRoll = outcome.attackRoll;
    const defenseRoll = outcome.defenseRoll;
    const conquered = outcome.attackerWins;

    let message = '';
    let tributePaid = 0;

    if (conquered) {
      // Attacker standing-force losses scale with the defense it overcame.
      const militaryLoss = Math.max(3, Math.round(defenseForce * 0.3));
      attacker.military = Math.max(0, attacker.military - militaryLoss);

      if (defender) {
        // Defender garrison is depleted; a small standing-force loss too.
        targetHex.localGarrison = 0;
        defender.military = Math.max(0, defender.military - Math.max(2, Math.round(attackForce * 0.1)));
        defender.removeTerritory(hexKey);
        defender.checkAlive();
        message = !defender.alive
          ? `${attacker.emoji} ${attacker.name}이(가) ${defender.emoji} ${defender.name}의 마지막 영토를 정복! ${defender.name} 멸망!`
          : `${attacker.emoji} ${attacker.name}이(가) ${defender.emoji} ${defender.name}의 영토를 정복! (⚔${attackRoll} vs 🛡${defenseRoll})`;
      } else {
        message = `${attacker.emoji} ${attacker.name}이(가) 중립 영토를 정복! (⚔${attackRoll} vs 🛡${defenseRoll})`;
      }

      // Occupy: seed a low garrison; it will regrow from local economy (ADR 0014).
      targetHex.owner = attacker.id;
      attacker.addTerritory(hexKey);
      targetHex.localGarrison = Math.max(2, Math.round(targetHex.defenseValue * 0.2));

      if (targetHex.building === 'wall') {
        targetHex.building = null;
        if (defender) defender.buildings.delete(hexKey);
      }
    } else {
      // Attacker repelled: heavier standing-force loss; mobilized population suffers extra.
      const militaryLoss = Math.max(5, Math.round(attackForce * 0.35));
      attacker.military = Math.max(0, attacker.military - militaryLoss);
      if (mobilizedTroops > 0) {
        attacker.population = Math.max(0, attacker.population - Math.round(mobilizedTroops * 0.5));
      }

      if (defender) {
        targetHex.localGarrison = Math.max(0, targetHex.localGarrison - Math.max(1, Math.round(attackForce * 0.05)));
        const tribute = Math.max(1, Math.round(attacker.calculateIncome() * 0.4));
        const paidTribute = Math.min(attacker.gold, tribute);
        attacker.gold -= paidTribute;
        defender.gold += paidTribute;
        tributePaid = paidTribute;
        message = `${attacker.emoji} ${attacker.name}의 공격 실패! ${defender.emoji} ${defender.name}이(가) 방어 성공! (⚔${attackRoll} vs 🛡${defenseRoll})`;
      } else {
        message = `${attacker.emoji} ${attacker.name}의 중립 영토 공격 실패! (⚔${attackRoll} vs 🛡${defenseRoll})`;
      }
    }

    if (tributePaid > 0) {
      message += ` 침략 실패로 💰${tributePaid}을(를) 상납했습니다.`;
    }

    return {
      success: true, message, conquered,
      attackForce, defenseForce, attackRoll, defenseRoll,
      attackCost, tributePaid, mobilizedTroops, pendingCapacityCost
    };
  }

  /** True when a port settlement (target or an attacker-adjacent staging hex)
   *  can mitigate an amphibious crossing penalty (ADR 0015). */
  static _hasPortMitigation(game, factionId, targetHex) {
    if (targetHex.primaryFunction === 'port') return true;
    const neighbors = game.map.getNeighbors(targetHex.q, targetHex.r);
    return neighbors.some(n => {
      const h = game.map.getHex(n.q, n.r);
      return h && h.owner === factionId && h.primaryFunction === 'port';
    });
  }
```

In `js/game.js`, update the attack dispatch case (currently `result = window.ActionSystem.attack(this, faction, params.targetHex);`) to forward the mobilize option:

```js
      case 'attack':
        result = window.ActionSystem.attack(this, faction, params.targetHex, { mobilize: !!params.mobilize });
        break;
```

(No other `game.js` change is required: `attack` reads `game.rng` defensively — when undefined, `CombatSystem._roll` falls back to `Math.random`.)

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/combat-attack.test.js`
Expected: PASS (all `combat-attack` tests).

- [ ] **Step 5: Run the full suite**

Run: `npm test`
Expected: PASS — all suites.

- [ ] **Step 6: Commit**

```bash
git add js/actions.js js/game.js tests/combat-attack.test.js
git commit -m "feat: resolve attacks through CombatSystem with force roles, terrain, and mobilization"
```

---

## Task 6: Local Garrison Regeneration (ADR 0014)

Make garrisons recover from their own province economy each round so the model is loop-complete: depleted and newly conquered garrisons regrow toward a local, economy-bounded ceiling — not the treasury.

**Files:**
- Modify: `js/map.js` (`HexCell`)
- Modify: `js/game.js` (`_startRound`)
- Test: `tests/garrison.test.js`

**Interfaces:**
- Consumes: `hex.economyValue`, `hex.population`, `hex.localGarrison`.
- Produces: `HexCell.prototype.regenerateGarrison() -> void` (mutates `localGarrison`). `_startRound` sweeps all hexes.

- [ ] **Step 1: Write the failing test**

Create `tests/garrison.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts } = require('./helpers/load-browser-scripts');

test('a depleted garrison regrows 25% of the gap toward its local ceiling', () => {
  const ctx = loadScripts(['js/domain-data.js', 'js/map.js']);
  const hex = new ctx.HexCell(0, 0);
  hex.economyValue = 16;
  hex.population = 24;          // ceiling = max(2, round((16+24)/4)) = 10
  hex.localGarrison = 0;

  hex.regenerateGarrison();
  // gap 10, +max(1, round(10*0.25)) = +3 -> 3
  assert.equal(hex.localGarrison, 3);
});

test('garrison regeneration never exceeds the local ceiling', () => {
  const ctx = loadScripts(['js/domain-data.js', 'js/map.js']);
  const hex = new ctx.HexCell(0, 0);
  hex.economyValue = 16;
  hex.population = 24;          // ceiling 10
  hex.localGarrison = 9;

  hex.regenerateGarrison();    // gap 1 -> +max(1, round(0.25)) = +1 -> 10
  assert.equal(hex.localGarrison, 10);

  hex.regenerateGarrison();    // already at ceiling -> unchanged
  assert.equal(hex.localGarrison, 10);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/garrison.test.js`
Expected: FAIL — `hex.regenerateGarrison is not a function`.

- [ ] **Step 3: Write minimal implementation**

In `js/map.js`, add this method to the `HexCell` class (after `applyProvince`):

```js
  /** Regrow the local garrison toward an economy/population-bounded ceiling
   *  (ADR 0014: garrisons are sustained locally, not from the treasury). */
  regenerateGarrison() {
    const ceiling = Math.max(2, Math.round((this.economyValue + this.population) / 4));
    if (this.localGarrison >= ceiling) return;
    const step = Math.max(1, Math.round((ceiling - this.localGarrison) * 0.25));
    this.localGarrison = Math.min(ceiling, this.localGarrison + step);
  }
```

In `js/game.js`, update `_startRound` to sweep garrisons after factions take income/recovery:

```js
  /** Called once when all factions have cycled – new round */
  _startRound() {
    for (const f of this.factions) {
      if (f.alive) f.startTurn();
    }
    if (this.map) {
      this.map.getAllHexes().forEach((hex) => hex.regenerateGarrison());
    }
  }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/garrison.test.js`
Expected: PASS (2 tests).

- [ ] **Step 5: Run the full suite**

Run: `npm test`
Expected: PASS — all suites.

- [ ] **Step 6: Commit**

```bash
git add js/map.js js/game.js tests/garrison.test.js
git commit -m "feat: regenerate local garrisons from province economy each round (ADR 0014)"
```

---

## Task 7: Script Load Order & Full Verification

Wire `js/combat.js` into the page before its consumers and verify the whole slice in tests and the browser.

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add the combat script to the page**

In `index.html`, find the existing `<script src="js/actions.js"></script>` line and add, immediately **before** it:

```html
    <script src="js/combat.js"></script>
```

(Confirm load order is: `domain-data.js` → `buildings.js` → `faction.js` → `map.js` → `combat.js` → `actions.js` → `game.js` → `ui.js`/`main.js`. `combat.js` must precede `actions.js`, `ui.js`, and `game.js`, which reference `window.CombatSystem`.)

- [ ] **Step 2: Run the full test suite**

Run: `npm test`
Expected: PASS — every suite (`capacity`, `domain-data`, `situation`, `combat`, `combat-attack`, `garrison`).

- [ ] **Step 3: Browser smoke test**

Start a server and load the game:

```bash
python3 -m http.server 8007
```

Open `http://localhost:8007` in the real browser (not browser-harness — the map canvas is blank-on-start under WSLg Chrome until a resize; see the project memory `terrain-game-browser-verify-canvas-resize`).

Verify manually:
- the game loads without console errors;
- selecting a hex tooltip shows a defense number (now `CombatSystem.computeDefenseForce`);
- attacking an adjacent enemy/neutral hex produces a result message; a small-garrison plains hex is easier to take than a mountain pass with a large garrison;
- the page does not throw `CombatSystem is not defined`.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "chore: load CombatSystem script before its consumers"
```

---

## Self-Review

**Spec coverage** (against `2026-06-29-phase-1-terrain-combat-design.md` "Military Model" + confirmed decisions):

- Force roles — standing (attack) / garrison (defense) / mobilization (population): Tasks 3, 4, 5. ✔
- Local defense / latent population: covered minimally via `drawMobilization` from population; deep militia/unrest deferred per ADR 0009. ✔ (scope-limited by design)
- Terrain defense multipliers: Task 3 (`TERRAIN_TYPES[*].defense`). ✔
- Crossing/amphibious penalty + port mitigation: Tasks 2, 5 (ADR 0015). ✔
- Single-stage stochastic resolution behind a swappable seam: Task 1. ✔
- Result range (forecast) without exact win %: Task 1 `forecast` (UI wiring deferred to slice 6). ✔
- Garrison sustainment from local economy: Task 6 (ADR 0014). ✔
- Anti-snowball: defense no longer scales with the national pool by default (Task 3 second test asserts a 200-strength army gives no passive defense). ✔

**Out of scope (correctly deferred):** movement pathing/supply, AI target rewrite (slice 3), capacity consumption (slices 4–5; mobilization only records a hook), prediction-preview UI and result-report integration (slice 6), province numeric rebalancing (ongoing).

**Placeholder scan:** every code step contains complete code; no TODO/TBD; all commands have expected output. ✔

**Type/name consistency:** `computeAttackForce`/`computeDefenseForce`/`resolve`/`forecast`/`crossingPenalty`/`_roll`/`_band` consistent across Tasks 1–5; `drawMobilization` consistent in Tasks 4–5; `regenerateGarrison` consistent in Task 6; `pendingCapacityCost` shape `{capacity, amount}` consistent in Task 5; wall bonus read as `effects.defenseBonus` (30) in both `computeDefenseForce` and the `canIgnoreWalls` negation (no double count). ✔
