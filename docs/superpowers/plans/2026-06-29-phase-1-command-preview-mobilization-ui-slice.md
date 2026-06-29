# Phase 1 Command Preview & Mobilization UI Slice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the player click a map target, read a combat preview with mobilization costs and risks, toggle offensive mobilization, and execute the attack from the prefilled command card.

**Architecture:** Add a small `CommandPreview` module that computes attack previews from the existing `CombatSystem` and `ActionSystem` rules without mutating game state. Extend `Game.createCommandForHex()` and `GameUI.updateCommandCard()` so map selection opens a real command card with forecast, command-capacity hook, mobilization warning, and a confirm button. This slice keeps combat formulas unchanged and only connects the existing Phase 1 mechanics to map-first command UX.

**Tech Stack:** Static HTML, Canvas, plain browser JavaScript on `window`, Node.js built-in test runner (`node --test`) for logic tests, local `python3 -m http.server 8007` for browser verification.

---

## Scope Check

This plan implements only the "Command Preview & Mobilization UI" slice:

- Show deterministic attack preview values before attack confirmation.
- Show offensive mobilization as a player-visible toggle with population and future command-capacity cost.
- Execute the attack from the command card using the existing `ActionSystem.attack(..., { mobilize })`.
- Keep map-first selection: click map location, inspect prefilled card, confirm.

This plan deliberately does not add movement pathing, supply routes, a full command queue, posture editing, capacity spending, naval systems, province rebalancing, unrest/event chains, or a multi-round combat model.

## Current State

Relevant existing code:

- `js/combat.js`
  - `CombatSystem.computeAttackForce(attacker, targetHex, { mobilizedTroops, portMitigation })`
  - `CombatSystem.computeDefenseForce(hex, ownerFaction)`
  - `CombatSystem.forecast(attackForce, defenseForce)`
- `js/actions.js`
  - `ActionSystem.attack(game, attacker, targetHex, { mobilize })`
  - `ActionSystem._hasPortMitigation(game, factionId, targetHex)`
  - `ActionSystem._isAdjacentToFaction(game, factionId, q, r)`
- `js/game.js`
  - `createCommandForHex(hex)` currently creates a basic `selectedCommand`.
  - `executeAction('attack', { targetHex, mobilize })` already passes `mobilize`.
- `js/ui.js`
  - `updateCommandCard()` currently renders a static card with inert "명령 추가" / "조정" buttons.
- `index.html`
  - loads scripts in order; a new module must load after `js/combat.js` and before `js/game.js`.

## File Structure

- Create `js/command-preview.js`: deterministic preview model for attack/mobilization cards. No DOM access and no state mutation.
- Create `tests/command-preview.test.js`: unit tests for preview math, validation, mobilization estimates, and wall-ignore parity.
- Modify `index.html`: load `js/command-preview.js` after `js/actions.js` and before `js/game.js`.
- Modify `js/game.js`: attach previews to selected commands and add `executeSelectedCommand(options)`.
- Modify `js/ui.js`: render preview details, mobilization toggle, warning copy, and confirm/cancel actions.
- Modify `css/style.css`: style compact command-preview rows and mobilization controls inside the existing card.

## Design Rules

- No new dependencies.
- No combat formula changes.
- Preview logic must not call `Faction.drawMobilization()` because that mutates population.
- Preview and execution must use the same local rules:
  - adjacency check through `ActionSystem._isAdjacentToFaction`;
  - port mitigation through `ActionSystem._hasPortMitigation`;
  - force calculation through `CombatSystem`;
  - wall-ignore adjustment matching `ActionSystem.attack`.
- User-facing in-game text remains Korean, matching the current UI.
- Code comments and plan text stay neutral professional English.
- Keep the command card small enough for the current map overlay. Do not add a modal for the normal attack path.

---

## Task 1: Add Deterministic Attack Preview Module

Create the pure preview module first. It must compute the same attack force, defense force, forecast band, attack cost, and mobilization estimate that execution will use.

**Files:**
- Create: `js/command-preview.js`
- Create: `tests/command-preview.test.js`

**Interfaces:**
- Produces:
  - `window.CommandPreview.buildAttackPreview(game, attacker, targetHex, opts)`
  - `preview.valid`
  - `preview.message`
  - `preview.attackCost`
  - `preview.attackForce`
  - `preview.defenseForce`
  - `preview.forecast`
  - `preview.mobilization`
  - `preview.capacityCost`
  - `preview.warnings`

- [ ] **Step 1: Write the failing test**

Create `tests/command-preview.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts } = require('./helpers/load-browser-scripts');

function loadPreviewScripts() {
  return loadScripts([
    'js/domain-data.js',
    'js/buildings.js',
    'js/faction.js',
    'js/map.js',
    'js/combat.js',
    'js/actions.js',
    'js/command-preview.js'
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
  faction.military = 60;
  faction.population = 200;
  return faction;
}

function makeGame(ctx, { attacker, defender, targetHex, ownHex }) {
  const factionsById = { [attacker.id]: attacker };
  if (defender) factionsById[defender.id] = defender;
  return {
    factions: defender ? [attacker, defender] : [attacker],
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
    },
    diplomacy: {
      isAlly: () => false,
      isAtWar: () => true
    },
    getFaction: (id) => factionsById[id] || null
  };
}

test('attack preview computes local force forecast without mutating population', () => {
  const ctx = loadPreviewScripts();
  const attacker = newFaction(ctx, 0);
  const defender = newFaction(ctx, 1);
  defender.military = 200;

  const ownHex = new ctx.HexCell(4, 4);
  ownHex.owner = 0;
  attacker.territories.add(ownHex.key());

  const targetHex = new ctx.HexCell(4, 5);
  targetHex.owner = 1;
  targetHex.terrain = 'plains';
  targetHex.localGarrison = 8;
  targetHex.defenseValue = 10;
  targetHex.provinceName = '루오위안 평야';
  defender.territories.add(targetHex.key());

  const game = makeGame(ctx, { attacker, defender, targetHex, ownHex });
  const beforePopulation = attacker.population;
  const preview = ctx.CommandPreview.buildAttackPreview(game, attacker, targetHex, { mobilize: false });

  assert.equal(preview.valid, true);
  assert.equal(preview.kind, 'attack');
  assert.equal(preview.targetKey, targetHex.key());
  assert.equal(preview.targetName, '루오위안 평야');
  assert.equal(preview.attackForce, ctx.CombatSystem.computeAttackForce(attacker, targetHex, {
    mobilizedTroops: 0,
    portMitigation: false
  }));
  assert.equal(preview.defenseForce, ctx.CombatSystem.computeDefenseForce(targetHex, defender));
  assert.equal(preview.forecast.band, ctx.CombatSystem.forecast(preview.attackForce, preview.defenseForce).band);
  assert.equal(preview.mobilization.enabled, false);
  assert.equal(preview.mobilization.estimatedTroops, 0);
  assert.equal(preview.capacityCost, null);
  assert.equal(attacker.population, beforePopulation);
});

test('mobilized preview estimates population and future command-capacity cost', () => {
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
  defender.territories.add(targetHex.key());

  const game = makeGame(ctx, { attacker, defender, targetHex, ownHex });
  const plainPreview = ctx.CommandPreview.buildAttackPreview(game, attacker, targetHex, { mobilize: false });
  const mobilizedPreview = ctx.CommandPreview.buildAttackPreview(game, attacker, targetHex, { mobilize: true });

  assert.equal(mobilizedPreview.valid, true);
  assert.equal(mobilizedPreview.mobilization.enabled, true);
  assert.equal(mobilizedPreview.mobilization.estimatedTroops, 20);
  assert.equal(mobilizedPreview.mobilization.populationCost, 20);
  assert.deepEqual(mobilizedPreview.capacityCost, { capacity: 'command', amount: 20 });
  assert.ok(mobilizedPreview.attackForce > plainPreview.attackForce);
  assert.ok(mobilizedPreview.warnings.some((warning) => warning.level === 'severe'));
});

test('preview rejects non-adjacent attack targets with the same player-facing reason as attack validation', () => {
  const ctx = loadPreviewScripts();
  const attacker = newFaction(ctx, 0);
  const defender = newFaction(ctx, 1);

  const ownHex = new ctx.HexCell(1, 1);
  ownHex.owner = 0;
  attacker.territories.add(ownHex.key());

  const targetHex = new ctx.HexCell(9, 9);
  targetHex.owner = 1;
  defender.territories.add(targetHex.key());

  const game = {
    factions: [attacker, defender],
    map: {
      getNeighbors: () => [],
      getHex: () => null
    },
    diplomacy: { isAlly: () => false, isAtWar: () => true },
    getFaction: (id) => (id === defender.id ? defender : attacker)
  };

  const preview = ctx.CommandPreview.buildAttackPreview(game, attacker, targetHex, { mobilize: false });
  assert.equal(preview.valid, false);
  assert.equal(preview.message, '인접한 영토만 공격할 수 있습니다.');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/command-preview.test.js
```

Expected: FAIL with `ENOENT` or `CommandPreview` undefined because `js/command-preview.js` does not exist yet.

- [ ] **Step 3: Write minimal implementation**

Create `js/command-preview.js`:

```js
/* ============================================================
 * command-preview.js — deterministic command previews
 * ============================================================ */

(function () {
  'use strict';

  function invalid(kind, targetHex, message) {
    return {
      kind,
      valid: false,
      targetKey: targetHex ? targetHex.key() : null,
      targetName: targetHex ? (targetHex.provinceName || targetHex.key()) : '-',
      message,
      attackCost: 0,
      attackForce: 0,
      defenseForce: 0,
      forecast: null,
      mobilization: { enabled: false, estimatedTroops: 0, populationCost: 0 },
      capacityCost: null,
      warnings: []
    };
  }

  function estimateMobilizedTroops(attacker) {
    const levy = Math.floor(attacker.population * 0.1);
    const cap = Math.floor(attacker.population * 0.2);
    return Math.max(0, Math.min(levy, cap));
  }

  function buildAttackPreview(game, attacker, targetHex, opts) {
    const o = opts || {};
    if (!targetHex) return invalid('attack', null, '대상 지역이 없습니다.');

    if (targetHex.owner === attacker.id) {
      return invalid('attack', targetHex, '자신의 영토는 공격할 수 없습니다.');
    }

    if (targetHex.owner !== null && game.diplomacy.isAlly(attacker.id, targetHex.owner)) {
      return invalid('attack', targetHex, '동맹국은 공격할 수 없습니다.');
    }

    if (!window.ActionSystem._isAdjacentToFaction(game, attacker.id, targetHex.q, targetHex.r)) {
      return invalid('attack', targetHex, '인접한 영토만 공격할 수 있습니다.');
    }

    if (attacker.military <= 0) {
      return invalid('attack', targetHex, '상비군이 부족합니다.');
    }

    const attackCost = Math.max(1, Math.ceil(attacker.calculateIncome() * attacker.getTaxAttackCostRate()));
    if (!attacker.canAfford(attackCost)) {
      return invalid('attack', targetHex, `공격 비용이 부족합니다. (필요: 💰${attackCost}, 보유: 💰${attacker.gold})`);
    }

    const mobilizedTroops = o.mobilize ? estimateMobilizedTroops(attacker) : 0;
    const portMitigation = window.ActionSystem._hasPortMitigation(game, attacker.id, targetHex);
    const attackForce = window.CombatSystem.computeAttackForce(attacker, targetHex, {
      mobilizedTroops,
      portMitigation
    });

    let defender = targetHex.owner === null ? null : game.getFaction(targetHex.owner);
    if (defender && !defender.alive) defender = null;
    let defenseForce = window.CombatSystem.computeDefenseForce(targetHex, defender);

    if (targetHex.building === 'wall' && attacker.canIgnoreWalls()) {
      const wallDef = window.BUILDINGS.wall.effects.defenseBonus || 0;
      defenseForce = Math.max(1, defenseForce - wallDef);
    }

    const forecast = window.CombatSystem.forecast(attackForce, defenseForce);
    const warnings = [];
    if (portMitigation) {
      warnings.push({ level: 'info', text: '항구 기능이 도하/상륙 부담을 줄입니다.' });
    }
    if (o.mobilize && mobilizedTroops > 0) {
      warnings.push({ level: 'severe', text: '공세 동원은 즉시 인구를 소모하고 다음 지휘 여력을 압박합니다.' });
    }
    if (targetHex.terrain === 'river' || targetHex.terrain === 'coast_strait') {
      warnings.push({ level: 'medium', text: '도하/해협 지형은 공격 효율을 낮춥니다.' });
    }

    return {
      kind: 'attack',
      valid: true,
      targetKey: targetHex.key(),
      targetName: targetHex.provinceName || targetHex.key(),
      message: '공격 명령을 검토할 수 있습니다.',
      attackCost,
      attackForce,
      defenseForce,
      forecast,
      mobilization: {
        enabled: !!o.mobilize,
        estimatedTroops: mobilizedTroops,
        populationCost: mobilizedTroops
      },
      capacityCost: mobilizedTroops > 0 ? { capacity: 'command', amount: mobilizedTroops } : null,
      warnings
    };
  }

  window.CommandPreview = Object.freeze({
    buildAttackPreview,
    estimateMobilizedTroops
  });
})();
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
node --test tests/command-preview.test.js
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add js/command-preview.js tests/command-preview.test.js
git commit -m "feat: add command attack preview model"
```

---

## Task 2: Load Preview Module and Attach Preview to Selected Commands

Wire the preview into map selection. Clicking an attackable enemy or neutral hex should create a selected command with `preview`, default `mobilize: false`, and an executable target key.

**Files:**
- Modify: `index.html`
- Modify: `js/game.js`
- Test: `tests/command-preview.test.js`

**Interfaces:**
- Produces:
  - `Game.createCommandForHex(hex)` attaches `selectedCommand.preview`.
  - `Game.refreshSelectedCommandPreview(options)` rebuilds the preview.
  - `Game.executeSelectedCommand(options)` executes an attack command card.

- [ ] **Step 1: Write the failing test**

Append to `tests/command-preview.test.js`:

```js
test('Game creates an attack command preview for an adjacent enemy target', () => {
  const ctx = loadScripts([
    'js/domain-data.js',
    'js/province-data.js',
    'js/capacity.js',
    'js/situation.js',
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
  const attacker = new ctx.Faction({ id: 0, name: 'A', color: '#000', colorLight: '#111', emoji: 'A' }, false);
  const defender = new ctx.Faction({ id: 1, name: 'D', color: '#111', colorLight: '#222', emoji: 'D' }, true);
  attacker.gold = 1000;
  attacker.military = 60;
  attacker.population = 200;

  const ownHex = new ctx.HexCell(2, 2);
  ownHex.owner = 0;
  attacker.territories.add(ownHex.key());

  const targetHex = new ctx.HexCell(2, 3);
  targetHex.owner = 1;
  targetHex.provinceName = '관중 관문';
  targetHex.localGarrison = 8;
  targetHex.defenseValue = 12;
  defender.territories.add(targetHex.key());

  game.factions = [attacker, defender];
  game.currentTurnIndex = 0;
  game.situation = { highlights: [] };
  game.selectedCommand = null;
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
    getHexByKey: (key) => (key === targetHex.key() ? targetHex : ownHex)
  };
  game.diplomacy = { isAlly: () => false, isAtWar: () => true };

  const command = game.createCommandForHex(targetHex);

  assert.equal(command.intent, 'attack');
  assert.equal(command.targetKey, targetHex.key());
  assert.equal(command.preview.kind, 'attack');
  assert.equal(command.preview.valid, true);
  assert.equal(command.mobilize, false);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/command-preview.test.js
```

Expected: FAIL because `createCommandForHex()` still leaves `intent` as `scout` or `prepare_offensive` and does not attach `preview`.

- [ ] **Step 3: Load `command-preview.js` in `index.html`**

In `index.html`, change the script block near the bottom from:

```html
    <script type="text/javascript" src="js/combat.js"></script>
    <script type="text/javascript" src="js/actions.js"></script>
    <script type="text/javascript" src="js/game.js"></script>
```

to:

```html
    <script type="text/javascript" src="js/combat.js"></script>
    <script type="text/javascript" src="js/actions.js"></script>
    <script type="text/javascript" src="js/command-preview.js"></script>
    <script type="text/javascript" src="js/game.js"></script>
```

- [ ] **Step 4: Modify `Game.createCommandForHex()` and add preview helpers**

In `js/game.js`, replace the existing `createCommandForHex(hex)` method with:

```js
  createCommandForHex(hex) {
    if (!hex || !this.situation || !window.SituationAnalyzer) return null;
    const faction = this.getCurrentFaction();
    const highlight = this.situation.highlights.find((item) => item.key === hex.key()) || {
      key: hex.key(),
      provinceName: hex.provinceName || hex.key(),
      recommendedIntent: 'scout',
      confidence: hex.informationConfidence || 0.4,
      reason: '이 지역의 형세를 확인합니다.'
    };

    let command = window.SituationAnalyzer.createCommandDefault(highlight);
    const canAttack = hex.owner !== faction.id &&
      window.ActionSystem._isAdjacentToFaction(this, faction.id, hex.q, hex.r) &&
      (hex.owner === null || !this.diplomacy.isAlly(faction.id, hex.owner));

    if (canAttack && window.CommandPreview) {
      command = Object.assign({}, command, {
        intent: 'attack',
        intentLabel: window.COMMAND_INTENTS.attack.label,
        mobilize: false,
        preview: window.CommandPreview.buildAttackPreview(this, faction, hex, { mobilize: false })
      });
    }

    this.selectedCommand = command;
    return this.selectedCommand;
  }

  refreshSelectedCommandPreview(options) {
    if (!this.selectedCommand || !window.CommandPreview) return null;
    const targetHex = this.map.getHexByKey(this.selectedCommand.targetKey);
    if (!targetHex || this.selectedCommand.intent !== 'attack') return this.selectedCommand;
    const mobilize = !!(options && options.mobilize);
    this.selectedCommand.mobilize = mobilize;
    this.selectedCommand.preview = window.CommandPreview.buildAttackPreview(
      this,
      this.getCurrentFaction(),
      targetHex,
      { mobilize }
    );
    return this.selectedCommand;
  }

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
    return { success: false, message: '이 명령은 아직 실행할 수 없습니다.' };
  }
```

- [ ] **Step 5: Clear selected command after a successful action**

In `js/game.js`, inside `executeAction(action, params)`, find:

```js
    this.selectedAction = null;
    this.selectedHex    = null;
    this.phase          = 'select_action';
```

Change it to:

```js
    this.selectedAction  = null;
    this.selectedHex     = null;
    this.selectedCommand = null;
    this.phase           = 'select_action';
```

- [ ] **Step 6: Run targeted tests**

Run:

```bash
node --test tests/command-preview.test.js
```

Expected: PASS.

- [ ] **Step 7: Run full tests**

Run:

```bash
npm test
```

Expected: PASS for all existing `tests/*.test.js`.

- [ ] **Step 8: Commit**

```bash
git add index.html js/game.js tests/command-preview.test.js
git commit -m "feat: attach attack previews to map commands"
```

---

## Task 3: Render Preview and Mobilization Controls in Command Card

Replace the inert command-card buttons with real preview rows, a mobilization checkbox, confirm/cancel buttons, and event handlers.

**Files:**
- Modify: `js/ui.js`

**Interfaces:**
- Consumes:
  - `game.selectedCommand.preview`
  - `game.refreshSelectedCommandPreview({ mobilize })`
  - `game.executeSelectedCommand({ mobilize })`
- Produces:
  - `GameUI.updateCommandCard()` renders preview details.
  - `GameUI.bindCommandCardActions()` wires card controls after rendering.

- [ ] **Step 1: Add HTML escaping helper**

In `js/ui.js`, after `_setHTML(id, html)`, add:

```js
  _escape(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
```

- [ ] **Step 2: Replace `updateCommandCard()`**

In `js/ui.js`, replace the existing `updateCommandCard()` method with:

```js
  updateCommandCard() {
    const el = this.elements['command-card'];
    if (!el) return;
    const command = this.game.selectedCommand;
    if (!command) {
      el.classList.add('hidden');
      el.innerHTML = '';
      return;
    }

    el.classList.remove('hidden');

    if (command.preview && command.preview.kind === 'attack') {
      const preview = command.preview;
      const forecast = preview.forecast;
      const warningHTML = preview.warnings.length > 0
        ? `<div class="command-warnings">${preview.warnings.map((warning) => `
            <div class="command-warning ${warning.level}">${this._escape(warning.text)}</div>
          `).join('')}</div>`
        : '';
      const capacityText = preview.capacityCost
        ? `지휘 ${preview.capacityCost.amount}`
        : '없음';
      const mobilizedText = preview.mobilization.enabled
        ? `${preview.mobilization.estimatedTroops}명 / 인구 -${preview.mobilization.populationCost}`
        : '사용 안 함';

      el.innerHTML = `
        <div class="command-card-title">${this._escape(command.targetName)}</div>
        <div class="command-card-row"><span>명령</span><strong>${this._escape(command.intentLabel)}</strong></div>
        <div class="command-card-row"><span>공격 비용</span><strong>💰${preview.attackCost}</strong></div>
        <div class="command-card-row"><span>예상 전력</span><strong>⚔${preview.attackForce} vs 🛡${preview.defenseForce}</strong></div>
        <div class="command-card-row"><span>전황</span><strong>${forecast ? forecast.band : '-'}</strong></div>
        <div class="command-card-row"><span>예상 범위</span><strong>${forecast ? `${forecast.low.toFixed(2)}-${forecast.high.toFixed(2)}` : '-'}</strong></div>
        <label class="command-toggle">
          <input id="command-mobilize-toggle" type="checkbox" ${preview.mobilization.enabled ? 'checked' : ''}>
          <span>공세 동원</span>
        </label>
        <div class="command-card-row"><span>동원</span><strong>${mobilizedText}</strong></div>
        <div class="command-card-row"><span>미래 비용</span><strong>${capacityText}</strong></div>
        ${warningHTML}
        <p>${this._escape(preview.message)}</p>
        <div class="command-card-actions">
          <button id="command-confirm-btn" class="modal-btn small primary" type="button" ${preview.valid ? '' : 'disabled'}>공격 실행</button>
          <button id="command-cancel-btn" class="modal-btn small" type="button">취소</button>
        </div>
      `;
      this.bindCommandCardActions();
      return;
    }

    el.innerHTML = `
      <div class="command-card-title">${this._escape(command.targetName)}</div>
      <div class="command-card-row"><span>명령</span><strong>${this._escape(command.intentLabel)}</strong></div>
      <div class="command-card-row"><span>강도</span><strong>${this._escape(command.intensity)}</strong></div>
      <div class="command-card-row"><span>정보 신뢰도</span><strong>${Math.round(command.confidence * 100)}%</strong></div>
      <p>${this._escape(command.reason)}</p>
    `;
  }
```

- [ ] **Step 3: Add `bindCommandCardActions()`**

In `js/ui.js`, immediately after `updateCommandCard()`, add:

```js
  bindCommandCardActions() {
    const toggle = document.getElementById('command-mobilize-toggle');
    if (toggle) {
      toggle.addEventListener('change', () => {
        this.game.refreshSelectedCommandPreview({ mobilize: toggle.checked });
        this.updateCommandCard();
      });
    }

    const confirm = document.getElementById('command-confirm-btn');
    if (confirm) {
      confirm.addEventListener('click', () => {
        const mobilize = !!(document.getElementById('command-mobilize-toggle') || {}).checked;
        const result = this.game.executeSelectedCommand({ mobilize });
        if (result.success && result.attackRoll !== undefined) {
          this.showBattleResult(result);
        } else if (this.game.onNotification) {
          this.game.onNotification(result.message, result.success ? 'success' : 'warning');
        }
        this.updateAll();
      });
    }

    const cancel = document.getElementById('command-cancel-btn');
    if (cancel) {
      cancel.addEventListener('click', () => {
        this.game.selectedCommand = null;
        this.updateCommandCard();
        if (this.game.map) this.game.map.setSelectedHex(null);
        if (this.game.onUpdate) this.game.onUpdate();
      });
    }
  }
```

- [ ] **Step 4: Run tests**

Run:

```bash
npm test
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add js/ui.js
git commit -m "feat: render executable command preview card"
```

---

## Task 4: Style Command Preview Controls

Add compact styles for the new preview rows, toggle, warning levels, and disabled confirm button. Keep the card overlay readable over the map without changing the broader layout.

**Files:**
- Modify: `css/style.css`

- [ ] **Step 1: Add command card styles**

Append this block near the existing `.command-card` styles in `css/style.css`. If there is no nearby command-card section, append it before the modal styles:

```css
.command-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 8px 0;
    padding: 8px 10px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    font-size: 0.82rem;
    cursor: pointer;
}

.command-toggle input {
    width: 16px;
    height: 16px;
    accent-color: var(--accent-gold);
}

.command-warnings {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 8px 0;
}

.command-warning {
    padding: 7px 9px;
    border-radius: 8px;
    font-size: 0.76rem;
    line-height: 1.35;
    border: 1px solid rgba(255, 255, 255, 0.12);
}

.command-warning.info {
    color: #bfdbfe;
    background: rgba(59, 130, 246, 0.14);
    border-color: rgba(96, 165, 250, 0.3);
}

.command-warning.medium {
    color: #fde68a;
    background: rgba(245, 158, 11, 0.14);
    border-color: rgba(245, 158, 11, 0.32);
}

.command-warning.severe {
    color: #fecaca;
    background: rgba(239, 68, 68, 0.16);
    border-color: rgba(248, 113, 113, 0.38);
}

.command-card-actions .modal-btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}
```

- [ ] **Step 2: Run tests**

Run:

```bash
npm test
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add css/style.css
git commit -m "style: add command preview card states"
```

---

## Task 5: Runtime Browser Verification

Verify the static app actually loads, opens a command card, toggles mobilization, and executes an attack. This project has no automated browser test harness, so use the local static server and a manual browser pass.

**Files:**
- No source edits expected.

- [ ] **Step 1: Start local server**

Run:

```bash
python3 -m http.server 8007
```

Expected: server prints `Serving HTTP on 0.0.0.0 port 8007` or equivalent and remains running.

- [ ] **Step 2: Open the app**

Open:

```text
http://localhost:8007
```

Expected:

- Main menu renders.
- Start a singleplayer game.
- The map, side panel, capacity bar, situation briefing, and command-card overlay area render without console errors.

- [ ] **Step 3: Verify command-card flow**

Manual steps:

1. Click an enemy or neutral hex adjacent to the player faction.
2. Confirm the command card shows:
   - target province name;
   - `공격`;
   - attack cost;
   - `⚔... vs 🛡...`;
   - forecast band;
   - mobilization toggle;
   - future cost row.
3. Toggle `공세 동원`.
4. Confirm the attack force increases and a severe warning appears.
5. Click `공격 실행`.

Expected:

- Battle result modal appears.
- Event log records the attack result.
- The command card closes after the action because `selectedCommand` is cleared by `executeAction`.
- The player cannot execute a second action in the same turn.

- [ ] **Step 4: Verify invalid target behavior**

Manual steps:

1. Click a non-adjacent enemy or neutral hex.
2. Inspect the command card.

Expected:

- The card should either remain non-attack informational, or show a disabled confirm button with the validation reason.
- It must not execute an attack against a non-adjacent target.

- [ ] **Step 5: Run full test suite again**

Run:

```bash
npm test
```

Expected: PASS.

- [ ] **Step 6: Commit verification-only changes if any**

If runtime verification required a small fix, commit it with the touched files:

```bash
git add js/command-preview.js js/game.js js/ui.js css/style.css index.html tests/command-preview.test.js
git commit -m "fix: align command preview runtime behavior"
```

If no changes were needed, do not create an empty commit.

---

## Self-Review

### Spec Coverage

- Map-first command creation: covered by Task 2 through `Game.createCommandForHex()`.
- Prefilled command card: covered by Task 3 through `GameUI.updateCommandCard()`.
- Combat preview: covered by Task 1 and Task 3 using `CombatSystem.forecast()`.
- Offensive mobilization visibility: covered by Task 1 and Task 3 through `mobilization`, `capacityCost`, and warnings.
- Existing force-role combat unchanged: preserved by using `CombatSystem` and `ActionSystem.attack()`.
- High complexity, low micromanagement: covered by one map click, one optional toggle, one confirm.
- Capacity overclock/carryover full implementation: intentionally out of scope; this slice displays the existing future command-capacity hook only.

### Placeholder Scan

No forbidden placeholder patterns remain. Every code-changing step includes exact code or exact replacement instructions.

### Type Consistency

- `CommandPreview.buildAttackPreview(game, attacker, targetHex, opts)` is introduced in Task 1 and consumed in Task 2.
- `Game.refreshSelectedCommandPreview(options)` is introduced in Task 2 and consumed in Task 3.
- `Game.executeSelectedCommand(options)` is introduced in Task 2 and consumed in Task 3.
- `preview.mobilization.estimatedTroops`, `preview.mobilization.populationCost`, `preview.capacityCost`, and `preview.warnings` use the same property names in tests, game state, and UI.
