# Phase 1 Scouting & Information Slice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `informationConfidence` a real, changing game value: the player spends a turn action to scout an adjacent enemy/neutral province, raising its confidence so it stops reading as "uncertain" and becomes a legible opportunity, while un-observed regions decay back toward an ambient floor over time.

**Architecture:** Add a pure `IntelSystem` module that owns every confidence constant and transform (gain, decay, tiers, thresholds), plus one mutator that refreshes a hex each round. Add an `ActionSystem.scout` action that consumes a turn action and applies a scout gain. Wire scout into the existing map-first command pipeline (`Game.executeSelectedCommand` / dispatch / per-round decay) so the situation re-analyzer reclassifies scouted hexes the same turn. Annotate the attack preview with the target's confidence and a scout suggestion. This slice keeps combat formulas (`CombatSystem`) untouched and adds only a minimal UI wire to execute scouting.

**Tech Stack:** Static HTML, Canvas, plain browser JavaScript on `window`, Node.js built-in test runner (`node --test`) for logic tests, local `python3 -m http.server 8007` for browser verification.

## Global Constraints

- No new dependencies. Standard library / platform / existing modules only.
- Do not change `CombatSystem` formulas. Previews and scouting read existing combat outputs; they do not alter combat math.
- All confidence *thresholds and transforms* live in `IntelSystem`; no other file may hard-code a confidence threshold or transform. (Pre-existing seed/fallback literals — `map.js` generation defaults, the `HexCell` default, and the `game.js` highlight-confidence fallback — are initial data that `IntelSystem.maintainConfidence` reproduces and supersedes at runtime; they are out of this slice's scope and changing them would break unrelated map-generation tests.)
- User-facing in-game text is Korean, matching the current UI. Code comments and plan text are neutral professional English.
- One action per faction per turn is preserved: scouting consumes the turn action exactly like attack.
- Map-first interaction: scouting is triggered from the prefilled command card, not a new modal.
- Run `npm test` (`node --test tests/*.test.js`) for logic; use the static server for browser verification.

---

## Scope Check

This plan implements only the "Scouting & Information" logic/data slice:

- A pure information-confidence model (gain, decay, tiers, reliability threshold).
- A `scout` action that raises a target province's `informationConfidence`.
- Per-round decay of confidence for non-owned hexes, and confidence refresh for owned hexes.
- Same-turn re-classification so a scouted enemy hex can leave `uncertainty` and reach `opportunity`.
- Attack-preview annotation that exposes confidence, an intel tier, a reliability flag, and a scout suggestion.
- A minimal UI wire to execute scouting from the command card.

This plan deliberately does **not** add: fog-of-war canvas rendering, AI scouting behavior, espionage/diplomacy intel channels, per-faction asymmetric knowledge maps (confidence stays a single scalar representing the human player's knowledge), scouting beyond adjacency, multi-level scout intensities, or capacity spending for scouts (capacity wiring is a separate slice).

## Current State

Relevant existing code:

- `js/map.js`
  - `HexCell` constructor sets `this.informationConfidence = 0.45` (`js/map.js:24`).
  - Generation forces `hex.informationConfidence = hex.owner === 0 ? 0.85 : 0.45` (`js/map.js:247`, `js/map.js:263`). This is the only place confidence is ever set today; it never changes after generation.
  - Helpers: `getHex(q,r)`, `getHexByKey(key)`, `getAllHexes()` (returns the `Map`), `getNeighbors(q,r)`.
- `js/situation.js`
  - `classifyHex` computes `const lowConfidence = hex.informationConfidence < 0.55;` (`js/situation.js:12`) and returns `uncertainty` for `enemy && lowConfidence` **before** the `enemy && highEconomy -> opportunity` branch. Because every enemy hex is statically `0.45 < 0.55`, the opportunity branch is currently unreachable.
- `js/actions.js`
  - `ActionSystem` static methods: `attack`, `defend`, `diplomacy`, `tax`, `build`, `research`. There is **no** scout action.
  - `ActionSystem._isAdjacentToFaction(game, factionId, q, r)` (`js/actions.js:12`) — reused by scouting.
- `js/game.js`
  - `executeAction(action, params)` switch dispatches the six actions; on success sets `faction.actionTaken = true`, then clears selection state (`js/game.js:207`).
  - `executeSelectedCommand(options)` handles only `intent === 'attack'`; anything else returns `'이 명령은 아직 실행할 수 없습니다.'` (`js/game.js:158`).
  - `createCommandForHex(hex)` (`js/game.js:114`) builds a command from the situation default, then overrides to `attack` (with a preview) when the hex is adjacent + attackable. Non-adjacent uncertainty hexes keep the situation default `intent: 'scout'`.
  - `refreshStrategicState()` (`js/game.js:84`) recomputes capacity + situation + highlights for the current faction. Called at init and once per turn from `nextTurn`.
  - `_startRound()` (`js/game.js:309`) runs once per full round; it already iterates `this.map.getAllHexes().forEach((hex) => hex.regenerateGarrison())`.
- `js/command-preview.js`
  - `CommandPreview.buildAttackPreview(game, attacker, targetHex, opts)` returns a deterministic preview. It does **not** currently reference `informationConfidence`.
- `js/ui.js`
  - `updateCommandCard()` (`js/ui.js:141`) renders the attack card (with confirm/cancel + mobilize toggle) and a fallback informational card. The fallback (non-attack) branch renders **no action buttons**, so a `scout` command can never be executed today.
  - `bindCommandCardActions()` (`js/ui.js:201`) wires existing card buttons; each lookup is guarded by existence.
  - `_escape(text)` (`js/ui.js:47`) HTML-escapes strings.
- `index.html`
  - Script load order (`index.html:200-215`): `domain-data → province-data → capacity → situation → buildings → tech → faction → map → diplomacy → combat → actions → command-preview → game → ai → ui → main`.

## File Structure

- Create `js/intel.js`: pure confidence model + the single `maintainConfidence` mutator. No DOM, no game-state access. Owns all confidence constants.
- Create `tests/intel.test.js`: unit tests for the pure transforms and the mutator.
- Modify `index.html`: load `js/intel.js` before `js/situation.js` (situation will reference `IntelSystem`).
- Modify `js/actions.js`: add `ActionSystem.scout` and `ActionSystem._scoutCost`.
- Modify `js/situation.js`: replace the hard-coded `0.55` with `IntelSystem.isReliable`.
- Modify `js/game.js`: dispatch `scout`, add `executeScoutOnSelected`, handle `intent === 'scout'` in `executeSelectedCommand`, add `getHumanFactionId`, refresh after a successful scout, and decay confidence each round in `_startRound`.
- Modify `js/command-preview.js`: annotate the attack preview with `confidence`, `intel`, `intelReliable`, and `scout`, and add an "unreliable info" warning.
- Modify `js/ui.js`: render an information row and a scout button on the command card, and wire the scout handler.
- Modify `tests/situation.test.js` and `tests/command-preview.test.js`: add `js/intel.js` to their script load lists (required now that those modules reference `IntelSystem`).
- Create `tests/scout.test.js`: unit tests for the scout action.

## Design Rules

- `IntelSystem` is the single source of truth for confidence numbers. Concrete values for this slice:
  - `UNCERTAINTY_THRESHOLD = 0.55` (a hex below this reads as "uncertain").
  - `RELIABLE_THRESHOLD = 0.75` (forecast trustworthy at/above this).
  - `SCOUT_GAIN = 0.25` (one scout action; `0.45 -> 0.70`, lifting an enemy hex above the uncertainty threshold).
  - `DECAY_PER_TURN = 0.05` (lost each round when a non-owned hex is not re-observed).
  - `DECAY_FLOOR = 0.45` (ambient awareness floor — equals the generation default, so un-scouted hexes never drift, and scouted hexes decay back to ambient over ~5 rounds).
  - `OWNED_CONFIDENCE = 0.85` (knowledge of owned land; matches current generation).
  - `MAX_CONFIDENCE = 0.90` (enemy land is never perfectly known).
- Confidence is rounded to 2 decimals everywhere (`round2`) to avoid float drift in assertions and display.
- Confidence is a single scalar per hex, representing the **human** player's knowledge. The human faction id is whichever faction has `isAI === false` (faction 0 in single-player).
- Scouting is adjacency-gated (reuse `_isAdjacentToFaction`), matching attack reach for Phase 1.
- Scouting and attacking both consume the one turn action; the player chooses one.

---

## Task 1: Add the Information Confidence Model (`IntelSystem`)

Create the pure model first. Every later task depends on these constants and transforms.

**Files:**
- Create: `js/intel.js`
- Create: `tests/intel.test.js`
- Modify: `index.html`

**Interfaces:**
- Produces (`window.IntelSystem`):
  - Constants: `UNCERTAINTY_THRESHOLD`, `RELIABLE_THRESHOLD`, `SCOUT_GAIN`, `DECAY_PER_TURN`, `DECAY_FLOOR`, `OWNED_CONFIDENCE`, `MAX_CONFIDENCE`.
  - `applyScout(current) -> number` — confidence after one scout, capped at `MAX_CONFIDENCE`.
  - `decay(current) -> number` — confidence after one round of non-observation, floored at `DECAY_FLOOR`.
  - `isReliable(confidence) -> boolean` — `confidence >= UNCERTAINTY_THRESHOLD`.
  - `tierOf(confidence) -> { id: 'low'|'partial'|'reliable', label: string }`.
  - `maintainConfidence(hex, humanFactionId) -> void` — the only mutator: owned hex → `OWNED_CONFIDENCE`, otherwise `decay`.

- [ ] **Step 1: Write the failing test**

Create `tests/intel.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts } = require('./helpers/load-browser-scripts');

function loadIntel() {
  return loadScripts(['js/intel.js']);
}

test('applyScout raises confidence by the scout gain and caps at the maximum', () => {
  const ctx = loadIntel();
  assert.equal(ctx.IntelSystem.applyScout(0.45), 0.7);
  assert.equal(ctx.IntelSystem.applyScout(0.8), 0.9); // 0.8 + 0.25 = 1.05 -> capped 0.9
});

test('decay lowers confidence toward the ambient floor and never below it', () => {
  const ctx = loadIntel();
  assert.equal(ctx.IntelSystem.decay(0.7), 0.65);
  assert.equal(ctx.IntelSystem.decay(0.47), 0.45); // max(0.45, 0.42) = 0.45
  assert.equal(ctx.IntelSystem.decay(0.45), 0.45);
});

test('isReliable matches the uncertainty threshold', () => {
  const ctx = loadIntel();
  assert.equal(ctx.IntelSystem.isReliable(0.45), false);
  assert.equal(ctx.IntelSystem.isReliable(0.55), true);
  assert.equal(ctx.IntelSystem.isReliable(0.7), true);
});

test('tierOf classifies confidence into low / partial / reliable', () => {
  const ctx = loadIntel();
  assert.equal(ctx.IntelSystem.tierOf(0.45).id, 'low');
  assert.equal(ctx.IntelSystem.tierOf(0.7).id, 'partial');
  assert.equal(ctx.IntelSystem.tierOf(0.85).id, 'reliable');
});

test('maintainConfidence pins owned hexes high and decays non-owned hexes', () => {
  const ctx = loadIntel();
  const owned = { owner: 0, informationConfidence: 0.5 };
  ctx.IntelSystem.maintainConfidence(owned, 0);
  assert.equal(owned.informationConfidence, 0.85);

  const enemy = { owner: 1, informationConfidence: 0.7 };
  ctx.IntelSystem.maintainConfidence(enemy, 0);
  assert.equal(enemy.informationConfidence, 0.65);

  const neutral = { owner: null, informationConfidence: 0.46 };
  ctx.IntelSystem.maintainConfidence(neutral, 0);
  assert.equal(neutral.informationConfidence, 0.45);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/intel.test.js
```

Expected: FAIL with `ENOENT` / `IntelSystem` undefined because `js/intel.js` does not exist yet.

- [ ] **Step 3: Write minimal implementation**

Create `js/intel.js`:

```js
/* ============================================================
 * intel.js — information confidence model (scouting / fog)
 *
 * Pure helpers (applyScout, decay, tierOf, isReliable) plus the
 * single mutator maintainConfidence. No DOM, no game-state access.
 * This module is the only source of truth for confidence numbers.
 * ============================================================ */

(function () {
  'use strict';

  const UNCERTAINTY_THRESHOLD = 0.55; // below this a hex reads as "uncertain"
  const RELIABLE_THRESHOLD = 0.75;    // at/above this the forecast is trustworthy
  const SCOUT_GAIN = 0.25;            // confidence added by one scout action
  const DECAY_PER_TURN = 0.05;        // confidence lost each round when unobserved
  const DECAY_FLOOR = 0.45;           // ambient awareness floor for non-owned hexes
  const OWNED_CONFIDENCE = 0.85;      // confidence the player has over owned land
  const MAX_CONFIDENCE = 0.9;         // enemy land is never perfectly known

  function round2(value) {
    return Math.round(value * 100) / 100;
  }

  function applyScout(current) {
    const base = typeof current === 'number' ? current : DECAY_FLOOR;
    return round2(Math.min(MAX_CONFIDENCE, base + SCOUT_GAIN));
  }

  function decay(current) {
    const base = typeof current === 'number' ? current : DECAY_FLOOR;
    return round2(Math.max(DECAY_FLOOR, base - DECAY_PER_TURN));
  }

  function isReliable(confidence) {
    return typeof confidence === 'number' && confidence >= UNCERTAINTY_THRESHOLD;
  }

  function tierOf(confidence) {
    const c = typeof confidence === 'number' ? confidence : 0;
    if (c < UNCERTAINTY_THRESHOLD) return { id: 'low', label: '불확실' };
    if (c < RELIABLE_THRESHOLD) return { id: 'partial', label: '개략 파악' };
    return { id: 'reliable', label: '신뢰 가능' };
  }

  // The only mutator: refresh one hex's confidence at the start of a round.
  function maintainConfidence(hex, humanFactionId) {
    if (!hex) return;
    if (hex.owner === humanFactionId) {
      hex.informationConfidence = OWNED_CONFIDENCE;
    } else {
      hex.informationConfidence = decay(hex.informationConfidence);
    }
  }

  window.IntelSystem = Object.freeze({
    UNCERTAINTY_THRESHOLD,
    RELIABLE_THRESHOLD,
    SCOUT_GAIN,
    DECAY_PER_TURN,
    DECAY_FLOOR,
    OWNED_CONFIDENCE,
    MAX_CONFIDENCE,
    applyScout,
    decay,
    isReliable,
    tierOf,
    maintainConfidence
  });
})();
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
node --test tests/intel.test.js
```

Expected: PASS.

- [ ] **Step 5: Load `intel.js` in `index.html`**

In `index.html`, change the script block from:

```html
    <script type="text/javascript" src="js/domain-data.js"></script>
    <script type="text/javascript" src="js/province-data.js"></script>
    <script type="text/javascript" src="js/capacity.js"></script>
    <script type="text/javascript" src="js/situation.js"></script>
```

to:

```html
    <script type="text/javascript" src="js/domain-data.js"></script>
    <script type="text/javascript" src="js/province-data.js"></script>
    <script type="text/javascript" src="js/intel.js"></script>
    <script type="text/javascript" src="js/capacity.js"></script>
    <script type="text/javascript" src="js/situation.js"></script>
```

- [ ] **Step 6: Commit**

```bash
git add js/intel.js tests/intel.test.js index.html
git commit -m "feat: add information confidence model"
```

---

## Task 2: Add the Scout Action

Add the `scout` action to `ActionSystem`. It validates an adjacent enemy/neutral target, charges a modest gold cost, and raises the target's `informationConfidence` via `IntelSystem.applyScout`. It does not set `actionTaken` (the dispatcher does that, exactly like `attack`).

**Files:**
- Modify: `js/actions.js`
- Create: `tests/scout.test.js`

**Interfaces:**
- Consumes: `IntelSystem.applyScout`, `IntelSystem.tierOf`, `ActionSystem._isAdjacentToFaction`, `Faction.calculateIncome/canAfford/spend`.
- Produces:
  - `ActionSystem.scout(game, faction, targetHex) -> { success, message, scoutCost?, confidenceBefore?, confidenceAfter?, intel? }`
  - `ActionSystem._scoutCost(faction) -> number`

- [ ] **Step 1: Write the failing test**

Create `tests/scout.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts } = require('./helpers/load-browser-scripts');

function loadScoutScripts() {
  return loadScripts([
    'js/domain-data.js',
    'js/province-data.js',
    'js/intel.js',
    'js/buildings.js',
    'js/faction.js',
    'js/map.js',
    'js/combat.js',
    'js/actions.js'
  ]);
}

function newFaction(ctx, id) {
  const faction = new ctx.Faction({
    id,
    name: 'F' + id,
    color: '#000',
    colorLight: '#111',
    emoji: '⬛'
  }, id !== 0);
  faction.gold = 1000;
  return faction;
}

function makeScoutGame(ctx, { ownHex, targetHex }) {
  return {
    map: {
      getNeighbors: (q, r) => {
        if (q === targetHex.q && r === targetHex.r) return [{ q: ownHex.q, r: ownHex.r }];
        if (q === ownHex.q && r === ownHex.r) return [{ q: targetHex.q, r: targetHex.r }];
        return [];
      },
      getHex: (q, r) => {
        if (q === targetHex.q && r === targetHex.r) return targetHex;
        if (q === ownHex.q && r === ownHex.r) return ownHex;
        return null;
      }
    }
  };
}

test('scout raises confidence on an adjacent enemy hex and reports before/after', () => {
  const ctx = loadScoutScripts();
  const scout = newFaction(ctx, 0);

  const ownHex = new ctx.HexCell(3, 3);
  ownHex.owner = 0;
  scout.territories.add(ownHex.key());

  const targetHex = new ctx.HexCell(3, 4);
  targetHex.owner = 1;
  targetHex.provinceName = '형강 수로';
  targetHex.informationConfidence = 0.45;

  const game = makeScoutGame(ctx, { ownHex, targetHex });
  const result = ctx.ActionSystem.scout(game, scout, targetHex);

  assert.equal(result.success, true);
  assert.equal(result.confidenceBefore, 0.45);
  assert.equal(result.confidenceAfter, 0.7);
  assert.equal(targetHex.informationConfidence, 0.7);
  assert.equal(result.intel.id, 'partial');
  assert.ok(result.scoutCost >= 1);
});

test('scout rejects own territory', () => {
  const ctx = loadScoutScripts();
  const scout = newFaction(ctx, 0);

  const ownHex = new ctx.HexCell(3, 3);
  ownHex.owner = 0;
  scout.territories.add(ownHex.key());

  const targetHex = new ctx.HexCell(3, 4);
  targetHex.owner = 0;
  scout.territories.add(targetHex.key());

  const game = makeScoutGame(ctx, { ownHex, targetHex });
  const result = ctx.ActionSystem.scout(game, scout, targetHex);

  assert.equal(result.success, false);
  assert.equal(result.message, '자신의 영토는 정찰할 필요가 없습니다.');
});

test('scout rejects non-adjacent targets', () => {
  const ctx = loadScoutScripts();
  const scout = newFaction(ctx, 0);

  const ownHex = new ctx.HexCell(1, 1);
  ownHex.owner = 0;
  scout.territories.add(ownHex.key());

  const targetHex = new ctx.HexCell(9, 9);
  targetHex.owner = 1;

  const game = {
    map: { getNeighbors: () => [], getHex: () => null }
  };
  const result = ctx.ActionSystem.scout(game, scout, targetHex);

  assert.equal(result.success, false);
  assert.equal(result.message, '인접한 지역만 정찰할 수 있습니다.');
});

test('scout rejects when the faction cannot afford the cost', () => {
  const ctx = loadScoutScripts();
  const scout = newFaction(ctx, 0);
  scout.gold = 0;

  const ownHex = new ctx.HexCell(3, 3);
  ownHex.owner = 0;
  scout.territories.add(ownHex.key());

  const targetHex = new ctx.HexCell(3, 4);
  targetHex.owner = 1;
  targetHex.informationConfidence = 0.45;

  const game = makeScoutGame(ctx, { ownHex, targetHex });
  const result = ctx.ActionSystem.scout(game, scout, targetHex);

  assert.equal(result.success, false);
  assert.ok(result.message.startsWith('정찰 비용이 부족합니다.'));
  assert.equal(targetHex.informationConfidence, 0.45);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/scout.test.js
```

Expected: FAIL because `ActionSystem.scout` is not a function.

- [ ] **Step 3: Add the scout action to `js/actions.js`**

In `js/actions.js`, immediately after the `_isAdjacentToFaction` helper (it ends at `js/actions.js:18` with the closing `}` of that static method) and before the `/* ─── 1. ATTACK ─── */` banner, insert:

```js
  /* ──────────────────────── 0. SCOUT ──────────────────────── */

  /** Gold cost of one scout action — cheap relative to attack so information
   *  is an affordable alternative to committing force. */
  static _scoutCost(faction) {
    return Math.max(1, Math.ceil(faction.calculateIncome() * 0.1));
  }

  /**
   * Scout an adjacent enemy/neutral hex to raise its information confidence.
   * @param {Game}    game
   * @param {Faction} faction
   * @param {HexCell} targetHex
   * @returns {{success:boolean, message:string, scoutCost?:number,
   *            confidenceBefore?:number, confidenceAfter?:number, intel?:object}}
   */
  static scout(game, faction, targetHex) {
    if (!targetHex) {
      return { success: false, message: '대상 지역이 없습니다.' };
    }
    if (targetHex.owner === faction.id) {
      return { success: false, message: '자신의 영토는 정찰할 필요가 없습니다.' };
    }
    if (!ActionSystem._isAdjacentToFaction(game, faction.id, targetHex.q, targetHex.r)) {
      return { success: false, message: '인접한 지역만 정찰할 수 있습니다.' };
    }

    const cost = ActionSystem._scoutCost(faction);
    if (!faction.canAfford(cost)) {
      return { success: false, message: `정찰 비용이 부족합니다. (필요: 💰${cost}, 보유: 💰${faction.gold})` };
    }
    faction.spend(cost);

    const before = targetHex.informationConfidence;
    const after = window.IntelSystem.applyScout(before);
    targetHex.informationConfidence = after;

    const name = targetHex.provinceName || targetHex.key();
    return {
      success: true,
      message: `${faction.emoji} ${faction.name}이(가) ${name} 지역을 정찰했습니다. (정보 신뢰도 ${Math.round(before * 100)}% → ${Math.round(after * 100)}%)`,
      scoutCost: cost,
      confidenceBefore: before,
      confidenceAfter: after,
      intel: window.IntelSystem.tierOf(after)
    };
  }
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
node --test tests/scout.test.js
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add js/actions.js tests/scout.test.js
git commit -m "feat: add scout action raising information confidence"
```

---

## Task 3: Wire Scouting Into the Turn Loop and Re-classification

Make scout executable through the existing command pipeline, decay confidence each round, refresh the situation the same turn so a scouted hex reclassifies, and route `situation.js`'s threshold through `IntelSystem`.

**Files:**
- Modify: `js/game.js`
- Modify: `js/situation.js`
- Modify: `tests/situation.test.js`
- Test: `tests/scout.test.js`

**Interfaces:**
- Consumes: `ActionSystem.scout`, `IntelSystem.maintainConfidence`, `IntelSystem.isReliable`.
- Produces:
  - `Game.getHumanFactionId() -> number`
  - `Game.executeScoutOnSelected() -> result` (scouts the currently selected command's target)
  - `Game.executeSelectedCommand(options)` handles `intent === 'scout'`
  - `Game.executeAction('scout', { targetHex })` dispatches to `ActionSystem.scout` and refreshes the situation on success
  - `Game._startRound()` decays/refreshes confidence for every hex

- [ ] **Step 1: Write the failing test (situation re-classification)**

Append to `tests/scout.test.js`:

```js
test('a low-confidence enemy hex reads as uncertainty, then opportunity once scouted', () => {
  const ctx = loadScripts([
    'js/domain-data.js',
    'js/province-data.js',
    'js/intel.js',
    'js/situation.js'
  ]);

  function enemyHex(confidence) {
    return {
      key: () => '5,5',
      owner: 1,
      provinceId: 'x',
      provinceName: '루오위안 평야',
      terrain: 'plains',
      localGarrison: 9,
      defenseValue: 10,
      economyValue: 14, // >= 12 so the opportunity branch is eligible
      informationConfidence: confidence,
      strategicTags: []
    };
  }

  const uncertain = ctx.SituationAnalyzer.analyze({ currentFactionId: 0, hexes: [enemyHex(0.45)] });
  assert.equal(uncertain.highlights[0].type, 'uncertainty');

  const scouted = ctx.SituationAnalyzer.analyze({ currentFactionId: 0, hexes: [enemyHex(0.7)] });
  assert.equal(scouted.highlights[0].type, 'opportunity');
});

test('executeSelectedCommand executes a scout command and consumes the turn action', () => {
  const ctx = loadScripts([
    'js/domain-data.js',
    'js/province-data.js',
    'js/intel.js',
    'js/buildings.js',
    'js/tech.js',
    'js/faction.js',
    'js/map.js',
    'js/diplomacy.js',
    'js/combat.js',
    'js/actions.js',
    'js/command-preview.js',
    'js/game.js'
  ]);

  const game = Object.create(ctx.Game.prototype);
  const human = new ctx.Faction({ id: 0, name: 'A', color: '#000', colorLight: '#111', emoji: 'A' }, false);
  const enemy = new ctx.Faction({ id: 1, name: 'D', color: '#111', colorLight: '#222', emoji: 'D' }, true);
  human.gold = 1000;

  const ownHex = new ctx.HexCell(2, 2);
  ownHex.owner = 0;
  human.territories.add(ownHex.key());

  const targetHex = new ctx.HexCell(2, 3);
  targetHex.owner = 1;
  targetHex.provinceName = '형강 수로';
  targetHex.informationConfidence = 0.45;

  game.factions = [human, enemy];
  game.currentTurnIndex = 0;
  game.state = 'playing';
  game.turnNumber = 1;
  game.eventLog = [];
  game.selectedCommand = { intent: 'scout', targetKey: targetHex.key(), targetName: '형강 수로' };
  game.map = {
    getNeighbors: (q, r) => {
      if (q === targetHex.q && r === targetHex.r) return [{ q: ownHex.q, r: ownHex.r }];
      if (q === ownHex.q && r === ownHex.r) return [{ q: targetHex.q, r: targetHex.r }];
      return [];
    },
    getHex: (q, r) => {
      if (q === ownHex.q && r === ownHex.r) return ownHex;
      if (q === targetHex.q && r === targetHex.r) return targetHex;
      return null;
    },
    getHexByKey: (key) => (key === targetHex.key() ? targetHex : ownHex),
    clearHighlights: () => {}
  };
  // Stub the heavy refresh + victory paths; they are exercised in browser verification.
  game.refreshStrategicState = () => {};
  game._checkAndHandleVictory = () => {};

  const before = targetHex.informationConfidence;
  const result = game.executeSelectedCommand();

  assert.equal(result.success, true);
  assert.ok(targetHex.informationConfidence > before);
  assert.equal(targetHex.informationConfidence, 0.7);
  assert.equal(human.actionTaken, true);
  assert.equal(game.selectedCommand, null);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/scout.test.js
```

Expected: FAIL — the re-classification test fails because `situation.js` still references `IntelSystem` only after we wire it (it currently passes via the literal `0.55`, so this specific test may pass already); the `executeSelectedCommand` test FAILS because the scout branch returns `'이 명령은 아직 실행할 수 없습니다.'`.

- [ ] **Step 3: Route the situation threshold through `IntelSystem`**

In `js/situation.js`, replace line 12:

```js
    const lowConfidence = hex.informationConfidence < 0.55;
```

with:

```js
    const lowConfidence = !window.IntelSystem.isReliable(hex.informationConfidence);
```

- [ ] **Step 4: Add `js/intel.js` to the situation test load list**

In `tests/situation.test.js`, change the load list from:

```js
  const context = loadScripts([
    'js/domain-data.js',
    'js/province-data.js',
    'js/situation.js'
  ]);
```

to:

```js
  const context = loadScripts([
    'js/domain-data.js',
    'js/province-data.js',
    'js/intel.js',
    'js/situation.js'
  ]);
```

- [ ] **Step 5: Add `getHumanFactionId` to `js/game.js`**

In `js/game.js`, in the getters block, immediately after `getFaction(id)` (ends at `js/game.js:185`), add:

```js
  /** The faction whose information confidence the map tracks (single-player: faction 0). */
  getHumanFactionId() {
    const human = this.factions.find((f) => !f.isAI);
    return human ? human.id : 0;
  }
```

- [ ] **Step 6: Handle the scout intent in `executeSelectedCommand` and add `executeScoutOnSelected`**

In `js/game.js`, replace the existing `executeSelectedCommand(options)` method (`js/game.js:158-171`) with:

```js
  executeSelectedCommand(options) {
    if (!this.selectedCommand) {
      return { success: false, message: '선택된 명령이 없습니다.' };
    }
    const targetHex = this.map.getHexByKey(this.selectedCommand.targetKey);
    if (!targetHex) {
      return { success: false, message: '대상 지역이 없습니다.' };
    }
    if (this.selectedCommand.intent === 'attack') {
      const mobilize = !!(options && options.mobilize);
      return this.executeAction('attack', { targetHex, mobilize });
    }
    if (this.selectedCommand.intent === 'scout') {
      return this.executeAction('scout', { targetHex });
    }
    return { success: false, message: '이 명령은 아직 실행할 수 없습니다.' };
  }

  /** Scout the currently selected command's target regardless of its default
   *  intent (used by the "정찰" option on an attack card). */
  executeScoutOnSelected() {
    if (!this.selectedCommand) {
      return { success: false, message: '선택된 명령이 없습니다.' };
    }
    const targetHex = this.map.getHexByKey(this.selectedCommand.targetKey);
    if (!targetHex) {
      return { success: false, message: '대상 지역이 없습니다.' };
    }
    return this.executeAction('scout', { targetHex });
  }
```

- [ ] **Step 7: Dispatch `scout` and refresh the situation on success**

In `js/game.js`, inside `executeAction`, add a `scout` case to the switch. Change:

```js
    let result;
    switch (action) {
      case 'attack':
        result = window.ActionSystem.attack(this, faction, params.targetHex, { mobilize: !!params.mobilize });
        break;
```

to:

```js
    let result;
    switch (action) {
      case 'scout':
        result = window.ActionSystem.scout(this, faction, params.targetHex);
        break;
      case 'attack':
        result = window.ActionSystem.attack(this, faction, params.targetHex, { mobilize: !!params.mobilize });
        break;
```

Then, still in `executeAction`, change the end of the method from:

```js
    // Victory check after action
    this._checkAndHandleVictory();

    return result;
```

to:

```js
    // Victory check after action
    this._checkAndHandleVictory();

    // Scouting changes information; re-analyze so the map reclassifies this turn.
    if (action === 'scout' && result.success) {
      this.refreshStrategicState();
    }

    return result;
```

- [ ] **Step 8: Decay confidence each round in `_startRound`**

In `js/game.js`, replace the existing `_startRound()` method (`js/game.js:309-316`):

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

with:

```js
  /** Called once when all factions have cycled – new round */
  _startRound() {
    for (const f of this.factions) {
      if (f.alive) f.startTurn();
    }
    if (this.map) {
      const humanId = this.getHumanFactionId();
      this.map.getAllHexes().forEach((hex) => {
        hex.regenerateGarrison();
        if (window.IntelSystem) window.IntelSystem.maintainConfidence(hex, humanId);
      });
    }
  }
```

- [ ] **Step 9: Run scout + situation tests**

Run:

```bash
node --test tests/scout.test.js tests/situation.test.js
```

Expected: PASS.

- [ ] **Step 10: Run full tests**

Run:

```bash
npm test
```

Expected: PASS for all `tests/*.test.js`.

- [ ] **Step 11: Commit**

```bash
git add js/game.js js/situation.js tests/situation.test.js tests/scout.test.js
git commit -m "feat: wire scouting into turn loop and re-classification"
```

---

## Task 4: Annotate the Attack Preview with Information Confidence

Expose the target's confidence, an intel tier, a reliability flag, and a scout suggestion on the attack preview, and warn when information is unreliable. Combat math is unchanged.

**Files:**
- Modify: `js/command-preview.js`
- Test: `tests/command-preview.test.js`

**Interfaces:**
- Consumes: `IntelSystem.tierOf`, `IntelSystem.isReliable`, `IntelSystem.applyScout`.
- Produces (added to the value returned by `buildAttackPreview`, and to `invalid()` for shape parity):
  - `preview.confidence` (number | null)
  - `preview.intel` (`{ id, label }` | null)
  - `preview.intelReliable` (boolean)
  - `preview.scout` (`{ available: boolean, confidenceAfter: number | null }`)

- [ ] **Step 1: Add `js/intel.js` to the command-preview test load lists**

In `tests/command-preview.test.js`, in `loadPreviewScripts()`, change:

```js
  return loadScripts([
    'js/domain-data.js',
    'js/buildings.js',
    'js/faction.js',
    'js/map.js',
    'js/combat.js',
    'js/actions.js',
    'js/command-preview.js'
  ]);
```

to:

```js
  return loadScripts([
    'js/domain-data.js',
    'js/intel.js',
    'js/buildings.js',
    'js/faction.js',
    'js/map.js',
    'js/combat.js',
    'js/actions.js',
    'js/command-preview.js'
  ]);
```

Then, in the same file, find the larger load list inside the test `'Game creates an attack command preview for an adjacent enemy target'` and add `'js/intel.js'` immediately after `'js/situation.js'`:

```js
  const ctx = loadScripts([
    'js/domain-data.js',
    'js/province-data.js',
    'js/capacity.js',
    'js/situation.js',
    'js/intel.js',
    'js/buildings.js',
    'js/tech.js',
    'js/faction.js',
    'js/map.js',
    'js/diplomacy.js',
    'js/combat.js',
    'js/actions.js',
    'js/command-preview.js',
    'js/game.js'
  ]);
```

- [ ] **Step 2: Write the failing test**

Append to `tests/command-preview.test.js`:

```js
test('attack preview annotates low information confidence and offers scouting', () => {
  const ctx = loadPreviewScripts();
  const attacker = newFaction(ctx, 0);
  const defender = newFaction(ctx, 1);

  const ownHex = new ctx.HexCell(4, 4);
  ownHex.owner = 0;
  attacker.territories.add(ownHex.key());

  const targetHex = new ctx.HexCell(4, 5);
  targetHex.owner = 1;
  targetHex.terrain = 'plains';
  targetHex.localGarrison = 8;
  targetHex.defenseValue = 10;
  targetHex.informationConfidence = 0.45;
  defender.territories.add(targetHex.key());

  const game = makeGame(ctx, { attacker, defender, targetHex, ownHex });
  const preview = ctx.CommandPreview.buildAttackPreview(game, attacker, targetHex, { mobilize: false });

  assert.equal(preview.confidence, 0.45);
  assert.equal(preview.intel.id, 'low');
  assert.equal(preview.intelReliable, false);
  assert.equal(preview.scout.available, true);
  assert.equal(preview.scout.confidenceAfter, 0.7);
  assert.ok(preview.warnings.some((warning) => warning.level === 'medium'));
});

test('attack preview marks reliable information when confidence is high', () => {
  const ctx = loadPreviewScripts();
  const attacker = newFaction(ctx, 0);
  const defender = newFaction(ctx, 1);

  const ownHex = new ctx.HexCell(4, 4);
  ownHex.owner = 0;
  attacker.territories.add(ownHex.key());

  const targetHex = new ctx.HexCell(4, 5);
  targetHex.owner = 1;
  targetHex.terrain = 'plains';
  targetHex.localGarrison = 8;
  targetHex.defenseValue = 10;
  targetHex.informationConfidence = 0.85;
  defender.territories.add(targetHex.key());

  const game = makeGame(ctx, { attacker, defender, targetHex, ownHex });
  const preview = ctx.CommandPreview.buildAttackPreview(game, attacker, targetHex, { mobilize: false });

  assert.equal(preview.intelReliable, true);
  assert.equal(preview.intel.id, 'reliable');
});
```

- [ ] **Step 3: Run test to verify it fails**

Run:

```bash
node --test tests/command-preview.test.js
```

Expected: FAIL because `preview.confidence` / `preview.intel` / `preview.scout` are `undefined`.

- [ ] **Step 4: Annotate `invalid()` for shape parity**

In `js/command-preview.js`, in the `invalid(kind, targetHex, message)` helper, change the returned object's tail from:

```js
      mobilization: { enabled: false, estimatedTroops: 0, populationCost: 0 },
      capacityCost: null,
      warnings: []
    };
```

to:

```js
      mobilization: { enabled: false, estimatedTroops: 0, populationCost: 0 },
      capacityCost: null,
      confidence: null,
      intel: null,
      intelReliable: false,
      scout: { available: false, confidenceAfter: null },
      warnings: []
    };
```

- [ ] **Step 5: Annotate the valid preview**

In `js/command-preview.js`, in `buildAttackPreview`, locate the block that builds `warnings` (it starts with `const forecast = window.CombatSystem.forecast(attackForce, defenseForce);` and a `const warnings = [];`). Immediately after the existing `if (targetHex.terrain === 'river' ...)` warning push and before the `return {` statement, add:

```js
    const confidence = typeof targetHex.informationConfidence === 'number'
      ? targetHex.informationConfidence
      : null;
    const intel = confidence === null ? null : window.IntelSystem.tierOf(confidence);
    const intelReliable = confidence === null ? true : window.IntelSystem.isReliable(confidence);
    if (!intelReliable) {
      warnings.push({ level: 'medium', text: '정보 신뢰도가 낮아 예측이 부정확할 수 있습니다. 정찰로 정확도를 높이세요.' });
    }
```

Then change the returned object's tail from:

```js
      capacityCost: mobilizedTroops > 0 ? { capacity: 'command', amount: mobilizedTroops } : null,
      warnings
    };
```

to:

```js
      capacityCost: mobilizedTroops > 0 ? { capacity: 'command', amount: mobilizedTroops } : null,
      confidence,
      intel,
      intelReliable,
      scout: {
        available: true,
        confidenceAfter: confidence === null ? null : window.IntelSystem.applyScout(confidence)
      },
      warnings
    };
```

- [ ] **Step 6: Run test to verify it passes**

Run:

```bash
node --test tests/command-preview.test.js
```

Expected: PASS (existing preview tests plus the two new ones).

- [ ] **Step 7: Run full tests**

Run:

```bash
npm test
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add js/command-preview.js tests/command-preview.test.js
git commit -m "feat: annotate attack preview with information confidence"
```

---

## Task 5: Render Information and Scout Controls on the Command Card

Add a minimal UI wire: show the target's information tier on the card, show a "정찰" button on an attack card when information is unreliable, and make a `scout` command card executable. No new CSS — reuse existing `.command-card-row`, `.command-warning.medium`, and `.modal-btn small` styles.

**Files:**
- Modify: `js/ui.js`

**Interfaces:**
- Consumes: `game.selectedCommand.preview.confidence/intel/intelReliable`, `game.executeScoutOnSelected()`, `game.executeSelectedCommand()`.
- Produces: `GameUI.updateCommandCard()` renders an information row + scout button; `GameUI.bindCommandCardActions()` wires the scout button.

- [ ] **Step 1: Add an information row and a conditional scout button to the attack card**

In `js/ui.js`, inside `updateCommandCard()`, in the attack branch (`command.preview && command.preview.kind === 'attack'`), change the row block + actions. Replace:

```js
        <div class="command-card-row"><span>전황</span><strong>${forecast ? forecast.band : '-'}</strong></div>
        <div class="command-card-row"><span>예상 범위</span><strong>${forecast ? `${forecast.low.toFixed(2)}-${forecast.high.toFixed(2)}` : '-'}</strong></div>
        <label class="command-toggle">
```

with:

```js
        <div class="command-card-row"><span>전황</span><strong>${forecast ? forecast.band : '-'}</strong></div>
        <div class="command-card-row"><span>예상 범위</span><strong>${forecast ? `${forecast.low.toFixed(2)}-${forecast.high.toFixed(2)}` : '-'}</strong></div>
        <div class="command-card-row"><span>정보</span><strong>${preview.intel ? this._escape(preview.intel.label) : '-'} (${preview.confidence != null ? Math.round(preview.confidence * 100) : '-'}%)</strong></div>
        <label class="command-toggle">
```

Then, still in the attack branch, replace the actions block:

```js
        <div class="command-card-actions">
          <button id="command-confirm-btn" class="modal-btn small primary" type="button" ${preview.valid ? '' : 'disabled'}>공격 실행</button>
          <button id="command-cancel-btn" class="modal-btn small" type="button">취소</button>
        </div>
      `;
      this.bindCommandCardActions();
      return;
```

with:

```js
        <div class="command-card-actions">
          <button id="command-confirm-btn" class="modal-btn small primary" type="button" ${preview.valid ? '' : 'disabled'}>공격 실행</button>
          ${preview.intelReliable ? '' : '<button id="command-scout-btn" class="modal-btn small" type="button">정찰</button>'}
          <button id="command-cancel-btn" class="modal-btn small" type="button">취소</button>
        </div>
      `;
      this.bindCommandCardActions();
      return;
```

- [ ] **Step 2: Make the scout fallback card executable**

In `js/ui.js`, replace the fallback (non-attack) branch of `updateCommandCard()`:

```js
    el.innerHTML = `
      <div class="command-card-title">${this._escape(command.targetName)}</div>
      <div class="command-card-row"><span>명령</span><strong>${this._escape(command.intentLabel)}</strong></div>
      <div class="command-card-row"><span>강도</span><strong>${this._escape(command.intensity)}</strong></div>
      <div class="command-card-row"><span>정보 신뢰도</span><strong>${Math.round(command.confidence * 100)}%</strong></div>
      <p>${this._escape(command.reason)}</p>
    `;
  }
```

with:

```js
    const isScout = command.intent === 'scout';
    const fallbackActions = isScout
      ? `<div class="command-card-actions">
          <button id="command-scout-btn" class="modal-btn small primary" type="button">정찰 실행</button>
          <button id="command-cancel-btn" class="modal-btn small" type="button">취소</button>
        </div>`
      : '';

    el.innerHTML = `
      <div class="command-card-title">${this._escape(command.targetName)}</div>
      <div class="command-card-row"><span>명령</span><strong>${this._escape(command.intentLabel)}</strong></div>
      <div class="command-card-row"><span>강도</span><strong>${this._escape(command.intensity)}</strong></div>
      <div class="command-card-row"><span>정보 신뢰도</span><strong>${Math.round(command.confidence * 100)}%</strong></div>
      <p>${this._escape(command.reason)}</p>
      ${fallbackActions}
    `;
    this.bindCommandCardActions();
  }
```

- [ ] **Step 3: Wire the scout button**

In `js/ui.js`, inside `bindCommandCardActions()`, immediately before the `const cancel = document.getElementById('command-cancel-btn');` lookup, add:

```js
    const scoutBtn = document.getElementById('command-scout-btn');
    if (scoutBtn) {
      scoutBtn.addEventListener('click', () => {
        const result = this.game.executeScoutOnSelected();
        if (this.game.onNotification) {
          this.game.onNotification(result.message, result.success ? 'success' : 'warning');
        }
        this.updateAll();
      });
    }
```

- [ ] **Step 4: Run tests**

Run:

```bash
npm test
```

Expected: PASS (UI logic is exercised in browser verification; tests confirm no module regressions).

- [ ] **Step 5: Commit**

```bash
git add js/ui.js
git commit -m "feat: add scout controls to the command card"
```

---

## Task 6: Runtime Browser Verification

Verify the static app loads, scouts an adjacent uncertain region, and reflects the raised confidence in classification and preview. This project has no automated browser harness, so use the local static server and a manual pass.

**Files:**
- No source edits expected.

- [ ] **Step 1: Start the local server**

Run:

```bash
python3 -m http.server 8007
```

Expected: server prints `Serving HTTP on 0.0.0.0 port 8007` (or equivalent) and stays running.

- [ ] **Step 2: Open the app**

Open `http://localhost:8007`, start a singleplayer game.

Expected: the map, side panel, capacity bar, situation briefing, and command-card overlay render with no console errors.

- [ ] **Step 3: Verify the scout flow on an attack target**

Manual steps:

1. Click an enemy/neutral hex **adjacent** to the player faction (so the card opens as an attack card).
2. Confirm the card shows an `정보` row with a tier label and percentage.
3. If the target's information is unreliable, confirm a `정찰` button appears next to `공격 실행`, and a medium "정보 신뢰도가 낮아…" warning is present.
4. Click `정찰`.

Expected:

- A success notification reports the confidence rising (e.g. `45% → 70%`).
- The command card closes (the action consumed the turn; `selectedCommand` cleared).
- The faction cannot take another action this turn (scouting consumed the turn action).
- Gold decreased by the scout cost.

- [ ] **Step 4: Verify re-classification and decay across turns**

Manual steps:

1. End the turn and cycle back to the player.
2. Click the previously scouted hex again.

Expected:

- If the hex is a high-economy enemy province, its briefing/highlight now reads as `기회` (opportunity) rather than `정보 불확실` (uncertainty), and the attack card shows the higher `정보` tier with no unreliable-info warning.
- Over several rounds without re-scouting, the hex's confidence decays back toward the ambient floor (`45%`), and it eventually reads as uncertain again.

- [ ] **Step 5: Verify the scout fallback card**

Manual steps:

1. Click an enemy/neutral hex that is **not** adjacent to the player but appears as an `정보 불확실` briefing item (its card opens as the informational/scout fallback).
2. Confirm a `정찰 실행` button is present.
3. Click it.

Expected:

- Because the target is non-adjacent, a warning notification reports `인접한 지역만 정찰할 수 있습니다.` and no action is consumed.

- [ ] **Step 6: Run the full test suite again**

Run:

```bash
npm test
```

Expected: PASS.

- [ ] **Step 7: Commit verification-only fixes if any**

If runtime verification required a small fix, commit it with the touched files:

```bash
git add js/intel.js js/actions.js js/game.js js/situation.js js/command-preview.js js/ui.js index.html tests/intel.test.js tests/scout.test.js tests/situation.test.js tests/command-preview.test.js
git commit -m "fix: align scouting runtime behavior"
```

If no changes were needed, do not create an empty commit.

---

## Self-Review

### Spec Coverage

- "Information should have confidence and uncertainty" (design principle): covered by `IntelSystem` (Task 1) and per-round decay (Task 3).
- "uncertain areas needing scouting" in the map-first briefing (Map-First Situation UX): the `uncertainty` highlight already exists; Task 3 makes it actionable and lets it resolve into `opportunity`.
- "scout" command intent (Core Commands candidate list): implemented as a real action (Task 2) and executable from the card (Task 3 + Task 5).
- "Preview … information confidence" (Prediction Preview): covered by Task 4 (`confidence`, `intel`, `intelReliable`) and Task 5 (information row).
- "The player chooses intent and risk" / one action per turn: scouting consumes the turn action, trading the turn against committing force (Tasks 2-3).
- Combat model unchanged: `CombatSystem` is not modified; previews only read its outputs.
- Out of scope and intentionally deferred: fog-of-war rendering, AI scouting, espionage/diplomacy intel, per-faction asymmetric knowledge, capacity spending for scouts.

### Placeholder Scan

No `TBD`/`TODO`/"handle edge cases"/"similar to Task N" placeholders. Every code-changing step contains exact code or exact old→new replacement text.

### Type Consistency

- `IntelSystem.applyScout/decay/isReliable/tierOf/maintainConfidence` are defined in Task 1 and consumed unchanged in Tasks 2-4.
- `ActionSystem.scout(game, faction, targetHex)` is defined in Task 2 and dispatched in Task 3.
- `Game.executeScoutOnSelected()` is defined in Task 3 and consumed in Task 5.
- `preview.confidence`, `preview.intel`, `preview.intelReliable`, `preview.scout` use identical names across Task 4 (producer) and Task 5 (consumer), and the `invalid()` path carries the same shape.
- `getHumanFactionId()` is defined and consumed within Task 3 (`_startRound`).
- The literal `0.55` is removed from `situation.js` (Task 3) and exists only as `IntelSystem.UNCERTAINTY_THRESHOLD` (Task 1).
