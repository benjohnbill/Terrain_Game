# Phase 1 Map Command Slice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first playable Phase 1 vertical slice: terrain/province data, action capacities, map-first situation highlights, prefilled command cards, and a strategic turn report scaffold.

**Architecture:** Keep the current static HTML/CSS/plain JavaScript architecture. Add focused data/rules modules before touching existing `Game`, `HexMap`, and `GameUI`; then integrate those modules through narrow calls. This plan intentionally does not implement the full combat rebalance, AI rewrite, or full 25-40 province content set beyond the initial testable data slice.

**Tech Stack:** Static HTML, Canvas, plain browser JavaScript on `window`, Node.js built-in test runner (`node --test`) for logic tests, local `python3 -m http.server` for browser verification.

---

## Scope Check

The approved Phase 1 spec covers multiple subsystems: world data, province identity, military force roles, action capacities, turn UX, command cards, prediction previews, result reports, and later AI/combat behavior. This plan implements the first vertical slice only:

- deterministic domain catalogs;
- initial 30 named province definitions;
- a 30x30 active area that keeps the 50x50 world direction open;
- map units carrying province/terrain/function metadata;
- action-capacity calculation;
- situation analysis highlights;
- a map-first command-card UI scaffold;
- a strategic result report scaffold.

Combat formula replacement, AI target evaluation, information warfare depth, and full national-management effects should be separate follow-up plans.

## File Structure

- Create `package.json`: test command and project metadata.
- Create `tests/helpers/load-browser-scripts.js`: Node VM helper that loads browser-style `window.*` scripts.
- Create `tests/domain-data.test.js`: verifies domain catalogs and province definitions.
- Create `tests/capacity.test.js`: verifies capacity generation, carryover, and overclock rules.
- Create `tests/situation.test.js`: verifies situation analysis produces threat/opportunity/uncertainty highlights.
- Create `js/domain-data.js`: terrain, archetype, function, posture, focus, command intent, highlight constants.
- Create `js/province-data.js`: initial 30 province definitions and helper lookups.
- Create `js/capacity.js`: capacity generation, focus defaults, carryover, and overclock calculations.
- Create `js/situation.js`: map-first situation analysis and command-card default generation.
- Modify `index.html`: load new scripts and add briefing/capacity/command-card containers.
- Modify `js/map.js`: extend `HexCell`, generate 50x50 world metadata with 30x30 active visibility, render terrain/province/highlight cues.
- Modify `js/game.js`: initialize capacity state and situation state.
- Modify `js/ui.js`: render briefing, capacity bar, situation highlights, command cards, and strategic report scaffold.
- Modify `css/style.css`: add layout and visual styles for map-first situation UX.

## Task 1: Add Node Test Harness

**Files:**
- Create: `package.json`
- Create: `tests/helpers/load-browser-scripts.js`

- [ ] **Step 1: Create `package.json`**

Add this exact file:

```json
{
  "name": "terrain-game",
  "version": "0.1.0",
  "private": true,
  "type": "commonjs",
  "scripts": {
    "test": "node --test tests/*.test.js"
  }
}
```

- [ ] **Step 2: Create browser-script test helper**

Add `tests/helpers/load-browser-scripts.js`:

```js
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function createBrowserContext() {
  const context = {
    console,
    Math,
    Date,
    Map,
    Set,
    Array,
    Object,
    Number,
    String,
    Boolean,
    JSON,
    window: {},
    document: {
      getElementById() {
        return null;
      },
      querySelectorAll() {
        return [];
      }
    }
  };
  context.window = context;
  return vm.createContext(context);
}

function loadScripts(relativePaths) {
  const context = createBrowserContext();
  for (const relativePath of relativePaths) {
    const absolutePath = path.join(__dirname, '..', '..', relativePath);
    const source = fs.readFileSync(absolutePath, 'utf8');
    vm.runInContext(source, context, { filename: relativePath });
  }
  return context;
}

module.exports = { loadScripts };
```

- [ ] **Step 3: Run tests before adding any tests**

Run:

```bash
npm test
```

Expected:

```text
1..0
# tests 0
# suites 0
# pass 0
# fail 0
```

- [ ] **Step 4: Commit**

```bash
git add package.json tests/helpers/load-browser-scripts.js
git commit -m "test: add node test harness"
```

## Task 2: Add Domain Catalogs

**Files:**
- Create: `tests/domain-data.test.js`
- Create: `js/domain-data.js`
- Modify: `index.html`

- [ ] **Step 1: Write failing domain catalog tests**

Create `tests/domain-data.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts } = require('./helpers/load-browser-scripts');

test('domain catalogs expose accepted terrain, function, posture, focus, and command keys', () => {
  const context = loadScripts(['js/domain-data.js']);

  assert.deepEqual(Object.keys(context.TERRAIN_TYPES), [
    'plains',
    'grain_basin',
    'mountain_pass',
    'river',
    'coast_strait',
    'steppe_highland',
    'frontier_basin'
  ]);

  assert.deepEqual(Object.keys(context.FUNCTION_TYPES), [
    'administrative',
    'commercial',
    'agricultural',
    'military_base',
    'fortress_pass',
    'port',
    'mining_workshop',
    'scholarly_religious',
    'frontier_settlement'
  ]);

  assert.deepEqual(Object.keys(context.ACTION_CAPACITIES), [
    'command',
    'administration',
    'diplomacy',
    'scholarship'
  ]);

  assert.equal(context.STRATEGIC_POSTURES.military_push.capacityWeights.command, 0.5);
  assert.equal(context.FOCUS_OPTIONS.command.scouting.label, '정찰');
  assert.equal(context.COMMAND_INTENTS.scout.defaultIntensity, 'standard');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- tests/domain-data.test.js
```

Expected: FAIL with `ENOENT` or `TERRAIN_TYPES` not defined.

- [ ] **Step 3: Add `js/domain-data.js`**

```js
/* ============================================================
 * domain-data.js — Phase 1 domain catalogs
 * ============================================================ */

window.TERRAIN_TYPES = Object.freeze({
  plains: {
    id: 'plains',
    label: '평야',
    color: '#b9a15b',
    economy: 1.1,
    defense: 0.9,
    movement: 1.0
  },
  grain_basin: {
    id: 'grain_basin',
    label: '곡창지대',
    color: '#69a85f',
    economy: 1.35,
    defense: 0.95,
    movement: 1.0
  },
  mountain_pass: {
    id: 'mountain_pass',
    label: '산악/관문',
    color: '#7f8794',
    economy: 0.75,
    defense: 1.45,
    movement: 0.65
  },
  river: {
    id: 'river',
    label: '강/수로',
    color: '#5cb8ff',
    economy: 1.15,
    defense: 1.05,
    movement: 0.85
  },
  coast_strait: {
    id: 'coast_strait',
    label: '해안/해협',
    color: '#3aa6b9',
    economy: 1.2,
    defense: 1.0,
    movement: 0.9
  },
  steppe_highland: {
    id: 'steppe_highland',
    label: '초원/고원',
    color: '#a9875b',
    economy: 0.8,
    defense: 1.0,
    movement: 1.2
  },
  frontier_basin: {
    id: 'frontier_basin',
    label: '변방/분지',
    color: '#9b79b7',
    economy: 0.95,
    defense: 1.15,
    movement: 0.85
  }
});

window.ARCHETYPE_REGIONS = Object.freeze({
  central_plains: { id: 'central_plains', label: '중원 평야권' },
  guanzhong_passes: { id: 'guanzhong_passes', label: '관중 관문권' },
  hebei_northern_plains: { id: 'hebei_northern_plains', label: '하북·북방 평원권' },
  northeastern_frontier: { id: 'northeastern_frontier', label: '동북 변경권' },
  han_jing_corridor: { id: 'han_jing_corridor', label: '한강·형강 수로권' },
  jiangnan_grain_belt: { id: 'jiangnan_grain_belt', label: '강남 곡창지대' },
  southwestern_basin: { id: 'southwestern_basin', label: '서남 분지권' },
  southeast_coast_straits: { id: 'southeast_coast_straits', label: '동남 해안·해협권' },
  northwest_oasis_corridor: { id: 'northwest_oasis_corridor', label: '서북 오아시스 회랑' },
  southern_mountain_forest: { id: 'southern_mountain_forest', label: '남방 산악·삼림권' },
  steppe_frontier: { id: 'steppe_frontier', label: '북방 초원권' },
  northern_india_route: { id: 'northern_india_route', label: '인도 북부 교역로' }
});

window.FUNCTION_TYPES = Object.freeze({
  administrative: { id: 'administrative', label: '도읍/행정 중심지' },
  commercial: { id: 'commercial', label: '상업 도시' },
  agricultural: { id: 'agricultural', label: '농업 중심지' },
  military_base: { id: 'military_base', label: '군사 거점' },
  fortress_pass: { id: 'fortress_pass', label: '요새 관문' },
  port: { id: 'port', label: '항구 도시' },
  mining_workshop: { id: 'mining_workshop', label: '광산/공방지대' },
  scholarly_religious: { id: 'scholarly_religious', label: '학문/종교 중심지' },
  frontier_settlement: { id: 'frontier_settlement', label: '변방 개척지' }
});

window.ACTION_CAPACITIES = Object.freeze({
  command: { id: 'command', label: '지휘력', shortLabel: '지휘' },
  administration: { id: 'administration', label: '행정력', shortLabel: '행정' },
  diplomacy: { id: 'diplomacy', label: '외교력', shortLabel: '외교' },
  scholarship: { id: 'scholarship', label: '학술력', shortLabel: '학술' }
});

window.FOCUS_OPTIONS = Object.freeze({
  command: {
    operation: { id: 'operation', label: '작전' },
    mobilization: { id: 'mobilization', label: '동원' },
    scouting: { id: 'scouting', label: '정찰' },
    training: { id: 'training', label: '훈련' }
  },
  administration: {
    taxation: { id: 'taxation', label: '징세' },
    supply: { id: 'supply', label: '보급' },
    development: { id: 'development', label: '개발' },
    recovery: { id: 'recovery', label: '복구' }
  },
  diplomacy: {
    negotiation: { id: 'negotiation', label: '협상' },
    espionage: { id: 'espionage', label: '첩보' },
    threat: { id: 'threat', label: '위협' },
    appeasement: { id: 'appeasement', label: '회유' }
  },
  scholarship: {
    research: { id: 'research', label: '연구' },
    surveying: { id: 'surveying', label: '측량' },
    institutions: { id: 'institutions', label: '제도' },
    tactics: { id: 'tactics', label: '병법' }
  }
});

window.STRATEGIC_POSTURES = Object.freeze({
  balanced: {
    id: 'balanced',
    label: '균형 운영',
    capacityWeights: { command: 0.25, administration: 0.25, diplomacy: 0.25, scholarship: 0.25 },
    focusDefaults: { command: 'operation', administration: 'supply', diplomacy: 'negotiation', scholarship: 'research' }
  },
  military_push: {
    id: 'military_push',
    label: '군사 집중',
    capacityWeights: { command: 0.5, administration: 0.2, diplomacy: 0.15, scholarship: 0.15 },
    focusDefaults: { command: 'operation', administration: 'supply', diplomacy: 'threat', scholarship: 'tactics' }
  },
  administrative_recovery: {
    id: 'administrative_recovery',
    label: '행정 정비',
    capacityWeights: { command: 0.15, administration: 0.55, diplomacy: 0.15, scholarship: 0.15 },
    focusDefaults: { command: 'training', administration: 'recovery', diplomacy: 'appeasement', scholarship: 'institutions' }
  },
  intelligence_gathering: {
    id: 'intelligence_gathering',
    label: '정보 수집',
    capacityWeights: { command: 0.3, administration: 0.2, diplomacy: 0.3, scholarship: 0.2 },
    focusDefaults: { command: 'scouting', administration: 'supply', diplomacy: 'espionage', scholarship: 'surveying' }
  }
});

window.COMMAND_INTENTS = Object.freeze({
  scout: { id: 'scout', label: '정찰', defaultIntensity: 'standard' },
  attack: { id: 'attack', label: '공격', defaultIntensity: 'standard' },
  reinforce: { id: 'reinforce', label: '방어 강화', defaultIntensity: 'standard' },
  mobilize: { id: 'mobilize', label: '동원', defaultIntensity: 'standard' },
  prepare_offensive: { id: 'prepare_offensive', label: '공세 준비', defaultIntensity: 'cautious' },
  defend_front: { id: 'defend_front', label: '전선 방어', defaultIntensity: 'standard' },
  consolidate: { id: 'consolidate', label: '정비/복구', defaultIntensity: 'standard' }
});

window.HIGHLIGHT_TYPES = Object.freeze({
  threat: { id: 'threat', label: '위협', color: 'rgba(255,70,70,0.55)' },
  opportunity: { id: 'opportunity', label: '기회', color: 'rgba(245,185,65,0.55)' },
  defense: { id: 'defense', label: '방어 요충', color: 'rgba(80,145,255,0.55)' },
  growth: { id: 'growth', label: '성장', color: 'rgba(70,210,120,0.50)' },
  uncertainty: { id: 'uncertainty', label: '정보 불확실', color: 'rgba(180,90,255,0.52)' },
  route: { id: 'route', label: '교통/보급', color: 'rgba(230,235,255,0.48)' }
});
```

- [ ] **Step 4: Load `domain-data.js` before existing game data**

Modify `index.html` script section so the first game script is:

```html
    <script type="text/javascript" src="js/domain-data.js"></script>
    <script type="text/javascript" src="js/buildings.js"></script>
```

- [ ] **Step 5: Run test to verify it passes**

Run:

```bash
npm test -- tests/domain-data.test.js
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add index.html js/domain-data.js tests/domain-data.test.js
git commit -m "feat: add phase 1 domain catalogs"
```

## Task 3: Add Initial Province Data

**Files:**
- Modify: `tests/domain-data.test.js`
- Create: `js/province-data.js`
- Modify: `index.html`

- [ ] **Step 1: Add province tests**

Append this test to `tests/domain-data.test.js`:

```js
test('initial province data has 30 named provinces with valid domain keys', () => {
  const context = loadScripts(['js/domain-data.js', 'js/province-data.js']);

  assert.equal(context.PROVINCES.length, 30);
  const names = new Set(context.PROVINCES.map((province) => province.name));
  assert.equal(names.size, 30);

  for (const province of context.PROVINCES) {
    assert.ok(context.ARCHETYPE_REGIONS[province.archetype], province.id);
    assert.ok(context.TERRAIN_TYPES[province.primaryTerrain], province.id);
    assert.ok(context.FUNCTION_TYPES[province.primaryFunction], province.id);
    assert.equal(typeof province.populationWeight, 'number');
    assert.equal(typeof province.economyWeight, 'number');
    assert.equal(typeof province.garrisonWeight, 'number');
    assert.equal(typeof province.defenseWeight, 'number');
  }

  assert.equal(context.getProvinceById('luoyuan_plain').name, '낙원 평원');
  assert.equal(context.getProvinceById('hanjing_waterway').primaryTerrain, 'river');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- tests/domain-data.test.js
```

Expected: FAIL with `ENOENT` for `js/province-data.js` or `PROVINCES` not defined.

- [ ] **Step 3: Create `js/province-data.js`**

```js
/* ============================================================
 * province-data.js — Initial named province data
 * ============================================================ */

(function () {
  'use strict';

  function province(id, name, archetype, primaryTerrain, primaryFunction, populationWeight, economyWeight, garrisonWeight, defenseWeight, tags) {
    return Object.freeze({
      id,
      name,
      archetype,
      primaryTerrain,
      terrainComposition: Object.freeze([primaryTerrain]),
      primaryFunction,
      secondaryFunction: null,
      populationWeight,
      economyWeight,
      garrisonWeight,
      defenseWeight,
      strategicTags: Object.freeze(tags)
    });
  }

  window.PROVINCES = Object.freeze([
    province('luoyuan_plain', '낙원 평원', 'central_plains', 'plains', 'administrative', 1.35, 1.25, 1.05, 0.95, ['capital_candidate', 'high_tax']),
    province('hedu_crossing', '하도 나루', 'central_plains', 'river', 'commercial', 1.15, 1.25, 0.95, 1.0, ['river_crossing', 'trade']),
    province('yedu_fields', '업도 들판', 'central_plains', 'plains', 'agricultural', 1.3, 1.2, 0.9, 0.9, ['grain', 'open_front']),
    province('songling_market', '송릉 시장', 'central_plains', 'plains', 'commercial', 1.1, 1.3, 0.85, 0.9, ['trade', 'soft_target']),
    province('chenyuan_workshops', '진원 공방', 'central_plains', 'plains', 'mining_workshop', 1.05, 1.15, 1.05, 0.95, ['arms']),

    province('guanzhong_gate', '관중 관문', 'guanzhong_passes', 'mountain_pass', 'fortress_pass', 0.95, 0.95, 1.25, 1.55, ['pass', 'western_gate']),
    province('weishui_basin', '위수 분지', 'guanzhong_passes', 'frontier_basin', 'agricultural', 1.05, 1.1, 1.0, 1.2, ['basin', 'secure_rear']),
    province('changling_commandery', '장릉 군부', 'guanzhong_passes', 'mountain_pass', 'military_base', 0.9, 0.9, 1.35, 1.35, ['mustering_ground']),

    province('hebei_plain', '하북 평원', 'hebei_northern_plains', 'plains', 'military_base', 1.2, 1.05, 1.25, 1.0, ['northern_front']),
    province('yanmen_ridge', '안문 산령', 'hebei_northern_plains', 'mountain_pass', 'fortress_pass', 0.8, 0.75, 1.2, 1.5, ['pass', 'raider_route']),
    province('northern_horsefields', '북원 목지', 'hebei_northern_plains', 'steppe_highland', 'frontier_settlement', 0.85, 0.8, 1.2, 1.0, ['horses', 'mobile_warfare']),

    province('liaodong_frontier', '요동 변경', 'northeastern_frontier', 'steppe_highland', 'frontier_settlement', 0.8, 0.85, 1.15, 1.1, ['cold_frontier']),
    province('songhua_ford', '송화 도하', 'northeastern_frontier', 'river', 'military_base', 0.85, 0.9, 1.2, 1.15, ['river_crossing']),
    province('eastwood_mines', '동림 광산', 'northeastern_frontier', 'frontier_basin', 'mining_workshop', 0.75, 1.05, 1.0, 1.1, ['iron']),

    province('hanjing_waterway', '형강 수로', 'han_jing_corridor', 'river', 'commercial', 1.05, 1.2, 0.95, 1.05, ['river_crossing', 'south_gate']),
    province('jiangxia_ford', '강하 나루', 'han_jing_corridor', 'river', 'military_base', 1.0, 1.0, 1.15, 1.1, ['river_crossing', 'contested']),
    province('yunmeng_marsh', '운몽 습지', 'han_jing_corridor', 'river', 'frontier_settlement', 0.9, 0.9, 0.9, 1.2, ['difficult_approach']),

    province('jiangnan_granary', '강남 곡창지대', 'jiangnan_grain_belt', 'grain_basin', 'agricultural', 1.35, 1.35, 0.9, 0.9, ['grain', 'long_war_base']),
    province('wuyue_canals', '오월 운하', 'jiangnan_grain_belt', 'river', 'commercial', 1.15, 1.35, 0.85, 0.95, ['canal', 'trade']),
    province('southern_academy', '남림 학궁', 'jiangnan_grain_belt', 'grain_basin', 'scholarly_religious', 1.0, 1.05, 0.75, 0.9, ['scholarship']),

    province('shu_basin', '촉중 분지', 'southwestern_basin', 'frontier_basin', 'agricultural', 1.2, 1.15, 1.0, 1.35, ['defensible_basin']),
    province('jianmen_pass', '검문 관문', 'southwestern_basin', 'mountain_pass', 'fortress_pass', 0.75, 0.75, 1.15, 1.65, ['pass']),
    province('ba_river_valley', '파강 계곡', 'southwestern_basin', 'river', 'frontier_settlement', 0.95, 0.95, 1.0, 1.15, ['valley']),

    province('minhai_port', '민해 항구', 'southeast_coast_straits', 'coast_strait', 'port', 0.95, 1.3, 0.9, 1.0, ['port', 'strait']),
    province('haixia_strait', '해협 연안', 'southeast_coast_straits', 'coast_strait', 'military_base', 0.85, 1.1, 1.1, 1.1, ['strait_crossing']),
    province('eastern_isles', '동도 제도', 'southeast_coast_straits', 'coast_strait', 'port', 0.7, 0.95, 0.85, 1.0, ['island']),

    province('dunhuang_oasis', '돈황 오아시스', 'northwest_oasis_corridor', 'frontier_basin', 'commercial', 0.75, 1.05, 0.9, 1.1, ['oasis_trade']),
    province('southern_mountains', '남령 산지', 'southern_mountain_forest', 'mountain_pass', 'frontier_settlement', 0.8, 0.75, 0.95, 1.35, ['forest_mountain']),
    province('steppe_border', '초원 접경', 'steppe_frontier', 'steppe_highland', 'frontier_settlement', 0.75, 0.7, 1.2, 0.95, ['raider_pressure']),
    province('western_trade_route', '서역 교역로', 'northern_india_route', 'frontier_basin', 'commercial', 0.8, 1.15, 0.85, 1.0, ['trade_route'])
  ]);

  window.PROVINCE_BY_ID = Object.freeze(window.PROVINCES.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {}));

  window.getProvinceById = function getProvinceById(id) {
    return window.PROVINCE_BY_ID[id] || null;
  };
})();
```

- [ ] **Step 4: Load `province-data.js`**

Modify `index.html` script section so `province-data.js` loads immediately after `domain-data.js`:

```html
    <script type="text/javascript" src="js/domain-data.js"></script>
    <script type="text/javascript" src="js/province-data.js"></script>
    <script type="text/javascript" src="js/buildings.js"></script>
```

- [ ] **Step 5: Run test to verify it passes**

Run:

```bash
npm test -- tests/domain-data.test.js
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add index.html js/province-data.js tests/domain-data.test.js
git commit -m "feat: add initial province data"
```

## Task 4: Add Capacity Rules

**Files:**
- Create: `tests/capacity.test.js`
- Create: `js/capacity.js`
- Modify: `index.html`

- [ ] **Step 1: Write failing capacity tests**

Create `tests/capacity.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts } = require('./helpers/load-browser-scripts');

test('capacity calculation converts owned provinces into four action capacities', () => {
  const context = loadScripts(['js/domain-data.js', 'js/province-data.js', 'js/capacity.js']);
  const ownedProvinceIds = ['luoyuan_plain', 'guanzhong_gate', 'jiangnan_granary'];

  const result = context.CapacitySystem.calculateBaseCapacities(ownedProvinceIds);

  assert.deepEqual(Object.keys(result), ['command', 'administration', 'diplomacy', 'scholarship']);
  assert.ok(result.command > 0);
  assert.ok(result.administration > result.diplomacy);
  assert.ok(result.scholarship > 0);
});

test('strategic posture allocates capacities and applies focus defaults', () => {
  const context = loadScripts(['js/domain-data.js', 'js/province-data.js', 'js/capacity.js']);
  const base = { command: 10, administration: 10, diplomacy: 10, scholarship: 10 };

  const allocation = context.CapacitySystem.applyPosture(base, 'military_push');

  assert.equal(allocation.postureId, 'military_push');
  assert.equal(allocation.focus.command, 'operation');
  assert.equal(allocation.available.command, 20);
  assert.equal(allocation.available.administration, 8);
  assert.equal(allocation.available.diplomacy, 6);
  assert.equal(allocation.available.scholarship, 6);
});

test('carryover preserves capacity with different rates and caps', () => {
  const context = loadScripts(['js/domain-data.js', 'js/province-data.js', 'js/capacity.js']);
  const unused = { command: 6, administration: 6, diplomacy: 6, scholarship: 6 };

  const carryover = context.CapacitySystem.calculateCarryover(unused);

  assert.equal(carryover.command, 2);
  assert.equal(carryover.administration, 3);
  assert.equal(carryover.diplomacy, 3);
  assert.equal(carryover.scholarship, 5);
});

test('overclock converts one capacity into another with efficiency loss', () => {
  const context = loadScripts(['js/domain-data.js', 'js/province-data.js', 'js/capacity.js']);
  const state = { command: 2, administration: 4, diplomacy: 3, scholarship: 6 };

  const result = context.CapacitySystem.overclock(state, 'scholarship', 'command', 4, 'institutional');

  assert.equal(result.capacities.scholarship, 2);
  assert.equal(result.capacities.command, 4);
  assert.equal(result.warningLevel, 'medium');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- tests/capacity.test.js
```

Expected: FAIL because `js/capacity.js` does not exist.

- [ ] **Step 3: Create `js/capacity.js`**

```js
/* ============================================================
 * capacity.js — Action capacity calculations
 * ============================================================ */

(function () {
  'use strict';

  const FUNCTION_CAPACITY_BONUS = Object.freeze({
    administrative: { command: 0.4, administration: 1.4, diplomacy: 0.4, scholarship: 0.4 },
    commercial: { command: 0.2, administration: 0.8, diplomacy: 1.0, scholarship: 0.3 },
    agricultural: { command: 0.3, administration: 0.8, diplomacy: 0.2, scholarship: 0.2 },
    military_base: { command: 1.4, administration: 0.4, diplomacy: 0.2, scholarship: 0.3 },
    fortress_pass: { command: 1.2, administration: 0.3, diplomacy: 0.2, scholarship: 0.2 },
    port: { command: 0.4, administration: 0.7, diplomacy: 1.0, scholarship: 0.3 },
    mining_workshop: { command: 0.8, administration: 0.7, diplomacy: 0.2, scholarship: 0.4 },
    scholarly_religious: { command: 0.2, administration: 0.4, diplomacy: 0.5, scholarship: 1.5 },
    frontier_settlement: { command: 0.8, administration: 0.3, diplomacy: 0.2, scholarship: 0.2 }
  });

  const CARRYOVER_RULES = Object.freeze({
    command: { rate: 0.35, cap: 4 },
    administration: { rate: 0.55, cap: 6 },
    diplomacy: { rate: 0.55, cap: 6 },
    scholarship: { rate: 0.8, cap: 8 }
  });

  const OVERCLOCK_RULES = Object.freeze({
    institutional: { rate: 0.5, warningLevel: 'medium' },
    emergency_human: { rate: 0.35, warningLevel: 'severe' }
  });

  function emptyCapacities() {
    return { command: 0, administration: 0, diplomacy: 0, scholarship: 0 };
  }

  function roundCapacity(value) {
    return Math.round(value * 10) / 10;
  }

  function calculateBaseCapacities(ownedProvinceIds) {
    const result = emptyCapacities();
    for (const provinceId of ownedProvinceIds) {
      const province = window.getProvinceById(provinceId);
      if (!province) continue;
      const functionBonus = FUNCTION_CAPACITY_BONUS[province.primaryFunction];
      const populationBase = Math.max(0.2, province.populationWeight * 0.5);
      const economyBase = Math.max(0.2, province.economyWeight * 0.4);

      result.command += populationBase * 0.5 + province.garrisonWeight * 0.8 + functionBonus.command;
      result.administration += economyBase * 0.8 + province.populationWeight * 0.4 + functionBonus.administration;
      result.diplomacy += economyBase * 0.4 + functionBonus.diplomacy;
      result.scholarship += economyBase * 0.3 + functionBonus.scholarship;
    }

    return {
      command: roundCapacity(result.command),
      administration: roundCapacity(result.administration),
      diplomacy: roundCapacity(result.diplomacy),
      scholarship: roundCapacity(result.scholarship)
    };
  }

  function applyPosture(baseCapacities, postureId) {
    const posture = window.STRATEGIC_POSTURES[postureId] || window.STRATEGIC_POSTURES.balanced;
    const total = Object.values(baseCapacities).reduce((sum, value) => sum + value, 0);
    const available = emptyCapacities();
    for (const key of Object.keys(available)) {
      available[key] = Math.round(total * posture.capacityWeights[key]);
    }
    return {
      postureId: posture.id,
      postureLabel: posture.label,
      available,
      focus: Object.assign({}, posture.focusDefaults)
    };
  }

  function calculateCarryover(unusedCapacities) {
    const result = emptyCapacities();
    for (const [key, value] of Object.entries(unusedCapacities)) {
      const rule = CARRYOVER_RULES[key];
      result[key] = Math.min(rule.cap, Math.floor(value * rule.rate));
    }
    return result;
  }

  function overclock(capacities, from, to, amount, intensity) {
    const rule = OVERCLOCK_RULES[intensity] || OVERCLOCK_RULES.institutional;
    const spend = Math.max(0, Math.min(capacities[from] || 0, amount));
    const gain = Math.floor(spend * rule.rate);
    const next = Object.assign({}, capacities);
    next[from] -= spend;
    next[to] = (next[to] || 0) + gain;
    return {
      capacities: next,
      spent: spend,
      gained: gain,
      warningLevel: rule.warningLevel
    };
  }

  window.CapacitySystem = Object.freeze({
    calculateBaseCapacities,
    applyPosture,
    calculateCarryover,
    overclock,
    CARRYOVER_RULES,
    OVERCLOCK_RULES
  });
})();
```

- [ ] **Step 4: Load `capacity.js`**

Modify `index.html`:

```html
    <script type="text/javascript" src="js/domain-data.js"></script>
    <script type="text/javascript" src="js/province-data.js"></script>
    <script type="text/javascript" src="js/capacity.js"></script>
    <script type="text/javascript" src="js/buildings.js"></script>
```

- [ ] **Step 5: Run test to verify it passes**

Run:

```bash
npm test -- tests/capacity.test.js
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add index.html js/capacity.js tests/capacity.test.js
git commit -m "feat: add action capacity rules"
```

## Task 5: Attach Terrain and Province Metadata to Hexes

**Files:**
- Modify: `js/map.js`
- Test: `tests/domain-data.test.js`

- [ ] **Step 1: Add metadata assignment test**

Append to `tests/domain-data.test.js`:

```js
test('hex cells can hold province and terrain metadata', () => {
  const context = loadScripts(['js/domain-data.js', 'js/province-data.js', 'js/map.js']);
  const cell = new context.HexCell(2, 3);

  cell.applyProvince(context.getProvinceById('luoyuan_plain'));

  assert.equal(cell.provinceId, 'luoyuan_plain');
  assert.equal(cell.provinceName, '낙원 평원');
  assert.equal(cell.terrain, 'plains');
  assert.equal(cell.primaryFunction, 'administrative');
  assert.equal(cell.population, 27);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- tests/domain-data.test.js
```

Expected: FAIL with `cell.applyProvince is not a function`.

- [ ] **Step 3: Modify `HexCell` constructor and add `applyProvince`**

In `js/map.js`, replace the `HexCell` class with:

```js
window.HexCell = class HexCell {
  constructor(q, r) {
    this.q = q;
    this.r = r;
    this.owner = null;
    this.building = null;
    this.population = 20;
    this.terrain = 'plains';
    this.provinceId = null;
    this.provinceName = null;
    this.archetype = null;
    this.primaryFunction = null;
    this.economyValue = 10;
    this.localGarrison = 8;
    this.defenseValue = 10;
    this.informationConfidence = 0.45;
    this.strategicTags = [];
  }

  key() {
    return `${this.q},${this.r}`;
  }

  applyProvince(province) {
    if (!province) return;
    this.provinceId = province.id;
    this.provinceName = province.name;
    this.archetype = province.archetype;
    this.terrain = province.primaryTerrain;
    this.primaryFunction = province.primaryFunction;
    this.population = Math.round(20 * province.populationWeight);
    this.economyValue = Math.round(10 * province.economyWeight);
    this.localGarrison = Math.round(8 * province.garrisonWeight);
    this.defenseValue = Math.round(10 * province.defenseWeight);
    this.strategicTags = Array.from(province.strategicTags);
  }
};
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
npm test -- tests/domain-data.test.js
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add js/map.js tests/domain-data.test.js
git commit -m "feat: attach province metadata to hex cells"
```

## Task 6: Generate a 30x30 Active Terrain Map

**Files:**
- Modify: `js/map.js`
- Test: `tests/domain-data.test.js`

- [ ] **Step 1: Add active map generation test**

Append to `tests/domain-data.test.js`:

```js
test('hex map can generate a 30x30 active terrain campaign area', () => {
  const context = loadScripts(['js/domain-data.js', 'js/province-data.js', 'js/map.js']);
  const canvas = {
    width: 900,
    height: 700,
    parentElement: { clientWidth: 900, clientHeight: 700 },
    getContext() {
      return {
        clearRect() {},
        save() {},
        restore() {},
        fill() {},
        stroke() {},
        beginPath() {},
        arc() {},
        fillText() {},
        createRadialGradient() {
          return { addColorStop() {} };
        }
      };
    },
    addEventListener() {},
    getBoundingClientRect() {
      return { left: 0, top: 0, width: 900, height: 700 };
    }
  };
  context.window.addEventListener = function addEventListener() {};
  context.ResizeObserver = function ResizeObserver() {
    return { observe() {} };
  };
  context.Path2D = function Path2D() {
    return { moveTo() {}, lineTo() {}, closePath() {} };
  };

  const map = new context.HexMap(canvas);
  map.generate(4, { phase1Active: true });

  assert.equal(map.gridCols, 30);
  assert.equal(map.gridRows, 30);
  assert.equal(map.getTotalHexCount(), 900);
  assert.ok(map.getAllHexes().some((hex) => hex.provinceId === 'luoyuan_plain'));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- tests/domain-data.test.js
```

Expected: FAIL because `generate` still creates 8-10 rows for faction count.

- [ ] **Step 3: Modify `HexMap.generate` signature and active map sizing**

In `js/map.js`, replace the first part of `generate(factionCount)` through the grid-size branch with:

```js
  generate(factionCount, options = {}) {
    this.hexes.clear();

    if (options.phase1Active) {
      this.gridCols = 30;
      this.gridRows = 30;
      this.hexSize = 18;
    } else if (factionCount <= 4) {
      this.gridCols = 8;
      this.gridRows = 8;
      this.hexSize = 38;
    } else if (factionCount === 5) {
      this.gridCols = 9;
      this.gridRows = 9;
      this.hexSize = 38;
    } else {
      this.gridCols = 10;
      this.gridRows = 10;
      this.hexSize = 38;
    }
```

- [ ] **Step 4: Add province assignment helper**

Add this method inside `HexMap` before `_getStartPositions`:

```js
  _assignPhase1ProvinceData() {
    const provinces = window.PROVINCES || [];
    if (provinces.length === 0) return;

    this.hexes.forEach((hex) => {
      const row = hex.r;
      const col = hex.q + Math.floor(row / 2);
      const provinceIndex = Math.abs(Math.floor(row / 5) * 5 + Math.floor(col / 6)) % provinces.length;
      hex.applyProvince(provinces[provinceIndex]);
      hex.informationConfidence = hex.owner === 0 ? 0.85 : 0.45;
    });
  }
```

- [ ] **Step 5: Call province assignment during generation**

In `generate`, after the nested loop that creates `HexCell`, add:

```js
    if (options.phase1Active) {
      this._assignPhase1ProvinceData();
    }
```

- [ ] **Step 6: Update game init to request Phase 1 map**

In `js/game.js`, replace:

```js
    this.map.generate(count);
```

with:

```js
    this.map.generate(count, { phase1Active: true });
```

- [ ] **Step 7: Run tests**

Run:

```bash
npm test
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add js/map.js js/game.js tests/domain-data.test.js
git commit -m "feat: generate active phase 1 terrain map"
```

## Task 7: Add Situation Analysis Rules

**Files:**
- Create: `tests/situation.test.js`
- Create: `js/situation.js`
- Modify: `index.html`

- [ ] **Step 1: Write failing situation tests**

Create `tests/situation.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts } = require('./helpers/load-browser-scripts');

test('situation analysis produces map-first highlights with command defaults', () => {
  const context = loadScripts([
    'js/domain-data.js',
    'js/province-data.js',
    'js/situation.js'
  ]);

  const hexes = [
    {
      key: () => '0,0',
      owner: 0,
      provinceName: '관중 관문',
      terrain: 'mountain_pass',
      provinceId: 'guanzhong_gate',
      localGarrison: 5,
      defenseValue: 16,
      economyValue: 8,
      informationConfidence: 0.9,
      strategicTags: ['pass']
    },
    {
      key: () => '1,0',
      owner: 1,
      provinceName: '형강 수로',
      terrain: 'river',
      provinceId: 'hanjing_waterway',
      localGarrison: 9,
      defenseValue: 10,
      economyValue: 12,
      informationConfidence: 0.35,
      strategicTags: ['river_crossing', 'south_gate']
    }
  ];

  const result = context.SituationAnalyzer.analyze({
    currentFactionId: 0,
    hexes,
    postureId: 'intelligence_gathering'
  });

  assert.equal(result.highlights.length, 2);
  assert.equal(result.highlights[0].type, 'defense');
  assert.equal(result.highlights[1].type, 'uncertainty');
  assert.equal(result.highlights[1].recommendedIntent, 'scout');
  assert.equal(result.briefing.length, 2);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- tests/situation.test.js
```

Expected: FAIL because `js/situation.js` does not exist.

- [ ] **Step 3: Create `js/situation.js`**

```js
/* ============================================================
 * situation.js — Map-first situation analysis
 * ============================================================ */

(function () {
  'use strict';

  function classifyHex(hex, currentFactionId) {
    const owned = hex.owner === currentFactionId;
    const enemy = hex.owner !== null && hex.owner !== currentFactionId;
    const lowConfidence = hex.informationConfidence < 0.55;
    const highEconomy = hex.economyValue >= 12;
    const weakOwnDefense = owned && hex.localGarrison < 7;
    const routeTag = hex.strategicTags.includes('pass') || hex.strategicTags.includes('river_crossing') || hex.strategicTags.includes('strait_crossing');

    if (weakOwnDefense) return { type: 'defense', recommendedIntent: 'reinforce' };
    if (enemy && lowConfidence) return { type: 'uncertainty', recommendedIntent: 'scout' };
    if (enemy && highEconomy) return { type: 'opportunity', recommendedIntent: 'prepare_offensive' };
    if (routeTag) return { type: 'route', recommendedIntent: 'scout' };
    if (owned && highEconomy) return { type: 'growth', recommendedIntent: 'consolidate' };
    return null;
  }

  function reasonFor(hex, type) {
    if (type === 'defense') return `${hex.provinceName}의 주둔군이 부족합니다.`;
    if (type === 'uncertainty') return `${hex.provinceName}의 정보 신뢰도가 낮습니다.`;
    if (type === 'opportunity') return `${hex.provinceName}은(는) 경제 가치가 높은 목표입니다.`;
    if (type === 'route') return `${hex.provinceName}은(는) 이동/도하/관문 변수입니다.`;
    if (type === 'growth') return `${hex.provinceName}은(는) 성장과 복구 가치가 큽니다.`;
    return `${hex.provinceName}의 형세를 확인해야 합니다.`;
  }

  function analyze(input) {
    const highlights = [];
    for (const hex of input.hexes) {
      const classified = classifyHex(hex, input.currentFactionId);
      if (!classified) continue;
      highlights.push({
        key: hex.key(),
        provinceId: hex.provinceId,
        provinceName: hex.provinceName,
        type: classified.type,
        color: window.HIGHLIGHT_TYPES[classified.type].color,
        reason: reasonFor(hex, classified.type),
        confidence: hex.informationConfidence,
        recommendedIntent: classified.recommendedIntent
      });
    }

    highlights.sort((a, b) => {
      const order = { defense: 0, threat: 1, uncertainty: 2, opportunity: 3, route: 4, growth: 5 };
      return order[a.type] - order[b.type];
    });

    const visibleHighlights = highlights.slice(0, 7);
    return {
      postureId: input.postureId || 'balanced',
      highlights: visibleHighlights,
      briefing: visibleHighlights.slice(0, 5).map((item) => ({
        key: item.key,
        title: window.HIGHLIGHT_TYPES[item.type].label,
        text: item.reason,
        confidence: item.confidence
      }))
    };
  }

  function createCommandDefault(highlight) {
    const intent = window.COMMAND_INTENTS[highlight.recommendedIntent] || window.COMMAND_INTENTS.scout;
    return {
      targetKey: highlight.key,
      targetName: highlight.provinceName,
      intent: intent.id,
      intentLabel: intent.label,
      intensity: intent.defaultIntensity,
      confidence: highlight.confidence,
      reason: highlight.reason
    };
  }

  window.SituationAnalyzer = Object.freeze({
    analyze,
    createCommandDefault
  });
})();
```

- [ ] **Step 4: Load `situation.js`**

Modify `index.html`:

```html
    <script type="text/javascript" src="js/domain-data.js"></script>
    <script type="text/javascript" src="js/province-data.js"></script>
    <script type="text/javascript" src="js/capacity.js"></script>
    <script type="text/javascript" src="js/situation.js"></script>
    <script type="text/javascript" src="js/buildings.js"></script>
```

- [ ] **Step 5: Run tests**

Run:

```bash
npm test
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add index.html js/situation.js tests/situation.test.js
git commit -m "feat: add map situation analysis"
```

## Task 8: Integrate Situation State Into Game

**Files:**
- Modify: `js/game.js`
- Modify: `js/map.js`

- [ ] **Step 1: Add game situation methods**

In `js/game.js` constructor, add:

```js
    this.situation        = null;
    this.capacityState    = null;
    this.selectedCommand  = null;
```

After `this._startRound();` in `init`, add:

```js
    this.refreshStrategicState();
```

Add these methods before `getCurrentFaction()`:

```js
  refreshStrategicState() {
    const faction = this.getCurrentFaction();
    if (!faction || !this.map || !window.SituationAnalyzer) return;

    const ownedProvinceIds = Array.from(faction.territories)
      .map((key) => this.map.getHexByKey(key))
      .filter(Boolean)
      .map((hex) => hex.provinceId)
      .filter(Boolean);

    const uniqueProvinceIds = Array.from(new Set(ownedProvinceIds));
    const base = window.CapacitySystem
      ? window.CapacitySystem.calculateBaseCapacities(uniqueProvinceIds)
      : { command: 0, administration: 0, diplomacy: 0, scholarship: 0 };

    this.capacityState = window.CapacitySystem
      ? window.CapacitySystem.applyPosture(base, 'balanced')
      : null;

    this.situation = window.SituationAnalyzer.analyze({
      currentFactionId: faction.id,
      hexes: Array.from(this.map.getAllHexes().values()),
      postureId: this.capacityState ? this.capacityState.postureId : 'balanced'
    });

    if (this.map && this.situation) {
      this.map.setSituationHighlights(this.situation.highlights);
    }
  }

  createCommandForHex(hex) {
    if (!hex || !this.situation || !window.SituationAnalyzer) return null;
    const highlight = this.situation.highlights.find((item) => item.key === hex.key()) || {
      key: hex.key(),
      provinceName: hex.provinceName || hex.key(),
      recommendedIntent: 'scout',
      confidence: hex.informationConfidence || 0.4,
      reason: '이 지역의 형세를 확인합니다.'
    };
    this.selectedCommand = window.SituationAnalyzer.createCommandDefault(highlight);
    return this.selectedCommand;
  }
```

- [ ] **Step 2: Refresh strategic state after turns**

In `nextTurn`, before `return faction;`, add:

```js
    this.refreshStrategicState();
```

- [ ] **Step 3: Add situation highlight rendering support to `HexMap`**

In `HexMap` constructor after `this.highlightedHexes = new Map();`, add:

```js
    this.situationHighlights = new Map();
```

Add this method near highlight methods:

```js
  setSituationHighlights(highlights) {
    this.situationHighlights.clear();
    for (const item of highlights || []) {
      this.situationHighlights.set(item.key, item);
    }
  }
```

In `_renderHex`, after `const highlightColor = this.highlightedHexes.get(key);`, add:

```js
    const situationHighlight = this.situationHighlights.get(key);
```

Before the `if (isHighlighted)` border block, add:

```js
    if (situationHighlight && !isHighlighted && !isSelected) {
      const pulse = 0.45 + 0.35 * Math.sin(this._pulsePhase * Math.PI * 2);
      ctx.strokeStyle = situationHighlight.color;
      ctx.lineWidth = 2 + pulse;
      ctx.globalAlpha = 0.65;
      ctx.stroke(path);
      ctx.globalAlpha = 1;
    }
```

- [ ] **Step 4: Ensure game start renders initial map**

In `js/main.js`, after `currentUI.updateAll();` in `startGame`, add:

```js
    if (currentGame.map) {
      requestAnimationFrame(() => currentGame.map.render(currentGame));
    }
```

- [ ] **Step 5: Run logic tests**

Run:

```bash
npm test
```

Expected: PASS.

- [ ] **Step 6: Run browser smoke test**

Run:

```bash
python3 -m http.server 8007
```

Open `http://localhost:8007`, start AI game, confirm:

- map renders immediately after game start;
- 30x30 active map is visible;
- colored situation outlines appear on several map locations.

- [ ] **Step 7: Commit**

```bash
git add js/game.js js/map.js js/main.js
git commit -m "feat: integrate strategic situation highlights"
```

## Task 9: Add Map-First Situation UI Panels

**Files:**
- Modify: `index.html`
- Modify: `js/ui.js`
- Modify: `css/style.css`

- [ ] **Step 1: Add DOM containers**

In `index.html`, inside `<div class="map-container">`, after `hex-tooltip`, add:

```html
                <div id="situation-briefing" class="situation-briefing"></div>
                <div id="command-card" class="command-card hidden"></div>
```

In `index.html`, inside `panel-faction` after `.stats-grid`, add:

```html
                    <div id="capacity-bar" class="capacity-bar"></div>
```

- [ ] **Step 2: Cache new elements**

In `js/ui.js`, add these ids to the `ids` array in `cacheElements()`:

```js
      'situation-briefing', 'command-card', 'capacity-bar',
```

- [ ] **Step 3: Render new UI from `updateAll`**

In `updateAll()`, after `this.updateFactionPanel();`, add:

```js
    this.updateCapacityBar();
    this.updateSituationBriefing();
    this.updateCommandCard();
```

- [ ] **Step 4: Add UI methods**

Add these methods before `updateActionButtons()`:

```js
  updateCapacityBar() {
    const el = this.elements['capacity-bar'];
    if (!el) return;
    const state = this.game.capacityState;
    if (!state || !state.available) {
      el.innerHTML = '';
      return;
    }
    const labels = window.ACTION_CAPACITIES || {};
    el.innerHTML = Object.entries(state.available).map(([key, value]) => {
      const label = labels[key] ? labels[key].shortLabel : key;
      const focus = state.focus && state.focus[key] ? state.focus[key] : '-';
      return `<div class="capacity-pill" title="Focus: ${focus}">
        <span>${label}</span><strong>${value}</strong>
      </div>`;
    }).join('');
  }

  updateSituationBriefing() {
    const el = this.elements['situation-briefing'];
    if (!el) return;
    const situation = this.game.situation;
    if (!situation || !situation.briefing || situation.briefing.length === 0) {
      el.innerHTML = '<div class="briefing-empty">이번 턴 주요 형세가 없습니다.</div>';
      return;
    }
    el.innerHTML = `
      <div class="briefing-title">형세 브리핑</div>
      ${situation.briefing.map((item) => `
        <button class="briefing-item" data-key="${item.key}">
          <span class="briefing-item-title">${item.title}</span>
          <span class="briefing-item-text">${item.text}</span>
          <span class="briefing-confidence">신뢰도 ${Math.round(item.confidence * 100)}%</span>
        </button>
      `).join('')}
    `;
  }

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
    el.innerHTML = `
      <div class="command-card-title">${command.targetName}</div>
      <div class="command-card-row"><span>명령</span><strong>${command.intentLabel}</strong></div>
      <div class="command-card-row"><span>강도</span><strong>${command.intensity}</strong></div>
      <div class="command-card-row"><span>정보 신뢰도</span><strong>${Math.round(command.confidence * 100)}%</strong></div>
      <p>${command.reason}</p>
      <div class="command-card-actions">
        <button class="modal-btn small primary" type="button">명령 추가</button>
        <button class="modal-btn small" type="button">조정</button>
      </div>
    `;
  }
```

- [ ] **Step 5: Create command card on map click**

In `js/game.js`, in the final `else` branch of `handleHexClick`, after `if (this.map) this.map.setSelectedHex(hex.key());`, add:

```js
      this.createCommandForHex(hex);
```

- [ ] **Step 6: Add CSS**

Append to `css/style.css`:

```css
.situation-briefing {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 5;
  width: min(340px, calc(100% - 32px));
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: auto;
}

.briefing-title,
.briefing-empty {
  color: #f5f7ff;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0;
  opacity: 0.9;
}

.briefing-item {
  text-align: left;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(13, 18, 38, 0.82);
  color: #f5f7ff;
  border-radius: 8px;
  padding: 8px 10px;
  display: grid;
  gap: 3px;
  cursor: pointer;
}

.briefing-item-title {
  font-size: 0.78rem;
  font-weight: 700;
}

.briefing-item-text,
.briefing-confidence {
  font-size: 0.72rem;
  opacity: 0.78;
  line-height: 1.3;
}

.capacity-bar {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin-top: 12px;
}

.capacity-pill {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.05);
  color: #f5f7ff;
  font-size: 0.78rem;
}

.capacity-pill strong {
  color: #ffe082;
}

.command-card {
  position: absolute;
  right: 16px;
  bottom: 16px;
  z-index: 6;
  width: min(320px, calc(100% - 32px));
  padding: 14px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(13, 18, 38, 0.9);
  color: #f5f7ff;
  box-shadow: 0 12px 40px rgba(0,0,0,0.45);
}

.command-card-title {
  font-weight: 800;
  margin-bottom: 10px;
}

.command-card-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 0.82rem;
  padding: 5px 0;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.command-card p {
  font-size: 0.8rem;
  line-height: 1.45;
  opacity: 0.82;
}

.command-card-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 10px;
}
```

- [ ] **Step 7: Browser smoke test**

Run:

```bash
python3 -m http.server 8007
```

Open `http://localhost:8007`, start AI game, click a highlighted map area, and verify:

- briefing panel appears over map;
- capacity pills appear in faction panel;
- clicking a hex opens a prefilled command card;
- text does not overlap at 1280px width.

- [ ] **Step 8: Commit**

```bash
git add index.html js/ui.js js/game.js css/style.css
git commit -m "feat: add map-first command UI scaffold"
```

## Task 10: Add Strategic Result Report Scaffold

**Files:**
- Modify: `js/game.js`
- Modify: `js/ui.js`
- Modify: `index.html`
- Modify: `css/style.css`

- [ ] **Step 1: Add result report container**

In `index.html`, inside `side-panel`, after `panel-events`, add:

```html
                <div id="panel-strategy-report" class="panel glass-panel">
                    <h3 class="panel-title">전략 리포트</h3>
                    <div id="strategy-report" class="strategy-report"></div>
                </div>
```

- [ ] **Step 2: Cache report element**

In `js/ui.js` `ids` array, add:

```js
      'strategy-report',
```

- [ ] **Step 3: Add report state in `Game` constructor**

Add:

```js
    this.strategyReport   = [];
```

- [ ] **Step 4: Add report generation method**

In `js/game.js`, add before `nextTurn()`:

```js
  buildStrategyReport() {
    const report = [];
    if (this.situation && this.situation.highlights.length > 0) {
      const top = this.situation.highlights[0];
      report.push({
        type: top.type,
        title: top.provinceName,
        text: `${top.reason} 다음 턴 판단 포인트로 유지됩니다.`
      });
    }
    if (this.selectedCommand) {
      report.push({
        type: 'command',
        title: this.selectedCommand.targetName,
        text: `${this.selectedCommand.intentLabel} 명령이 계획되었습니다.`
      });
    }
    this.strategyReport = report;
  }
```

- [ ] **Step 5: Call report generation on turn advance**

In `nextTurn()`, before `this.refreshStrategicState();`, add:

```js
    this.buildStrategyReport();
```

- [ ] **Step 6: Render strategy report**

In `updateAll()`, after `this.updateEventLog();`, add:

```js
    this.updateStrategyReport();
```

Add this method before `showModal()`:

```js
  updateStrategyReport() {
    const el = this.elements['strategy-report'];
    if (!el) return;
    const report = this.game.strategyReport || [];
    if (report.length === 0) {
      el.innerHTML = '<div class="strategy-report-empty">턴 처리 후 주요 결과가 여기에 요약됩니다.</div>';
      return;
    }
    el.innerHTML = report.map((item) => `
      <div class="strategy-report-item ${item.type}">
        <strong>${item.title}</strong>
        <span>${item.text}</span>
      </div>
    `).join('');
  }
```

- [ ] **Step 7: Add CSS**

Append:

```css
.strategy-report {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.strategy-report-empty,
.strategy-report-item {
  font-size: 0.78rem;
  line-height: 1.4;
  color: rgba(245,247,255,0.82);
}

.strategy-report-item {
  display: grid;
  gap: 3px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.04);
}

.strategy-report-item strong {
  color: #f5f7ff;
}
```

- [ ] **Step 8: Browser smoke test**

Run:

```bash
python3 -m http.server 8007
```

Open `http://localhost:8007`, start AI game, click a map hex, end turn, and verify:

- strategic report panel is visible;
- report does not replace raw event log;
- report text summarizes a strategic point rather than raw AI spam.

- [ ] **Step 9: Commit**

```bash
git add index.html js/game.js js/ui.js css/style.css
git commit -m "feat: add strategic report scaffold"
```

## Task 11: Final Verification

**Files:**
- Verify only.

- [ ] **Step 1: Run full logic tests**

Run:

```bash
npm test
```

Expected: all tests PASS.

- [ ] **Step 2: Run local server**

Run:

```bash
python3 -m http.server 8007
```

Expected:

```text
Serving HTTP on 0.0.0.0 port 8007
```

- [ ] **Step 3: Browser verification**

Open `http://localhost:8007` and verify:

- main menu loads;
- AI game starts;
- map renders immediately;
- map shows a 30x30 terrain/province-flavored grid;
- briefing appears on map;
- capacity bar appears;
- clicking a hex opens a command card;
- ending turn shows a strategic report;
- existing attack/build/research buttons still do not throw visible errors.

- [ ] **Step 4: Review git diff**

Run:

```bash
git status --short
git log --oneline -8
```

Expected: working tree clean and commits from each task present.

## Self-Review

Spec coverage in this plan:

- Terrain/province identity: Tasks 2, 3, 5, 6.
- 50x50-compatible world direction with first active area: Task 6 implements the first 30x30 active area; 50x50 full background world remains follow-up.
- Action capacities, focus, carryover, overclock: Task 4 implements first rules; UI preview in Task 9.
- Map-first situation UX: Tasks 7, 8, 9.
- Core command cards: Task 9 creates prefilled command cards.
- Result report: Task 10.
- Combat replacement, AI rewrite, information warfare depth, and full province balancing are intentionally outside this first vertical slice.

Red-flag scan: no prohibited planning filler terms are used.

Type consistency:

- `TERRAIN_TYPES`, `FUNCTION_TYPES`, `ACTION_CAPACITIES`, `FOCUS_OPTIONS`, `STRATEGIC_POSTURES`, `COMMAND_INTENTS`, and `HIGHLIGHT_TYPES` are defined in Task 2 and reused consistently.
- `PROVINCES`, `getProvinceById`, and province properties are defined in Task 3 and reused consistently.
- `CapacitySystem` is defined in Task 4 and used in Task 8.
- `SituationAnalyzer` is defined in Task 7 and used in Task 8.
