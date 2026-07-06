# Terrain-Cradle Map Authoring Workbench Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the authoring workbench from the terrain-cradle map spec — a map schema (spatial + arithmetic), a loader that derives realm mass/shield/cap, a B1/B2 gate with viable-binding enumeration, a node battery sheet for heavy batch validation, and a browser mockup that renders the map and shows live B1/B2 — so a map can be authored, seen, and measured in one loop.

**Architecture:** The visual-author-measure triangle. `map-data.js` is the single source (regions + sector graph + chokes + hex layout). The arithmetic modules (`match.js`, `econ.js`, `map-loader.js`, `map-gate.js`) are made **dual-mode** (node `require` + browser global), so the same computation drives two channels: **[node]** battery sheet 14 for heavy batch checks (full viable enumeration, tournament), and **[browser]** `map-mockup.html` for visual render + live B1/B2 on every reload. Authoring loop: mockup renders → user gives natural-language tweaks → agent edits `map-data.js` → mockup reloads (instant visual + live gate) → heavy checks run in node. **This plan builds the workbench, not the maps.** The MVP map pool (1 canonical + 3 variants) is authored afterward via the C-loop, because those values are loop outputs, not pre-authorable.

**Tech Stack:** Node.js + browser (vanilla ES2017, dual-mode modules via a small UMD-style guard), SVG for the mockup (like the existing `mockup/situation-map.*`). No test framework — the harness is a worked-sheet printer; module correctness is checked with `node -e` one-liners; the mockup is verified by loading it and reading the rendered panel.

## Global Constraints

- **Harness isolation:** all new files live in `mockup/combat-calc/`; `js/` (game code) MUST NOT import them and they MUST NOT import `js/`. This is prototype/workbench code, not the code-entry gate the user scheduled separately.
- **Dual-mode modules:** `econ.js`, `match.js`, `map-loader.js`, `map-gate.js`, `map-data.js` must load under BOTH node (`require`/`module.exports`) and browser (global `window.TC` namespace). Use the guard pattern in Task 6 verbatim. `battery.js` stays node-only.
- **Land-derived:** `fieldCap`/`income` DERIVE from sector values via `econ.js`, never authored directly (SPEC Core Design Principle 1; spec §1).
- **Every choke carries a required `removalPath` field** — a choke without one is un-authorable (spec §1, C3/C4).
- **hex count is not value:** `mapUnits` (hex layout) drives the visual render and combat detail ONLY; `valueProfile`/sector pop drive cap. The loader derives cap from value, never from hex count (spec §1, D4). A vast region with many hexes can have low value.
- **All numbers are 가안** — sheets print tables + a verdict string; the user rules pass/fail in NOTES.md.

---

### Task 1: Map data schema (spatial + arithmetic) + canonical fixture

**Files:**
- Create: `mockup/combat-calc/map-data.js`

**Interfaces:**
- Produces: `FIXTURE_MAP = { regions, sectors, edges }` on both `module.exports` and `window.TC.data`:
  - `regions: [{ id, name, sizeClass, sectorIds:[string] }]` — `sizeClass` ∈ `'center'|'mid'|'small'|'hermit'`.
  - `sectors: { [id]: { id, regionId, economyValue, populationValue, usableEconomy, usablePop, fortTier, garrison, mapUnits:[{q,r,terrainLayer}] } }` — `fortTier` ∈ `'none'|'fieldworks'|'walls'|'fortress'|'legendary'`; `mapUnits` = the hexes composing the sector (spatial only).
  - `edges: [{ a:sectorId, b:sectorId, choke:{ class, cap, removalPath } }]` — `class` ∈ `'open'|'forest'|'pass'|'river'|'strait'|'legendary'`; `cap` = `Infinity` for `'open'`; `removalPath` = required non-empty string.
- 5-region seat=region fixture whose sector pops re-derive the sealed caps (center 9000 / mid 7000 / small 5000 / hermit 6000) at capPerPop 600. Hex coords are laid out procedurally so the mockup can render each region as a cluster.

- [ ] **Step 1: Write the data file**

Create `mockup/combat-calc/map-data.js`:

```js
'use strict';
// PROTOTYPE — terrain-cradle map schema + canonical fixture. Single source
// for the node battery (sheet 14) and the browser mockup (map-mockup.html).
// js/ must not import this. Spec: docs/superpowers/specs/2026-07-06-terrain-
// cradle-map-design.md §1.
//
// A map = regions + a SECTOR-LEVEL adjacency graph + a hex layout. cap/income
// DERIVE from sector values (econ.js); hex count is NOT value (D4) — mapUnits
// drive the visual render only. Every choke carries a removalPath.
//
// FIXTURE_MAP: a 5-region seat=region case (10-region authoring is the later
// C-loop). Per-region sector pops re-derive the sealed caps at capPerPop 600.

// region base positions on an axial hex grid (roughly the spec §2 topology:
// center in the middle, peripheries around it)
const REGION_POS = {
  center:     [0, 0],
  seoryeong:  [-6, 1],
  dongpyeong: [6, -1],
  namgok:     [-1, 6],
  bukha:      [5, -6],
};

// build a region's sectors; each sector gets one hex laid out from the region
// base + its index (fixture keeps 1 hex/sector; real authoring uses clusters)
function sectorsFor(regionId, specs) {
  const [bq, br] = REGION_POS[regionId];
  return specs.map((s, i) => ({
    id: `${regionId}_s${i}`,
    regionId,
    economyValue: s.econ,
    populationValue: s.pop,
    usableEconomy: s.usableE ?? 1,
    usablePop: s.usableP ?? 1,
    fortTier: s.fortTier ?? 'none',
    garrison: s.garrison ?? 0,
    mapUnits: [{ q: bq + (i % 4), r: br + Math.floor(i / 4),
      terrainLayer: s.terrain ?? 'plains' }],
  }));
}

// center: 12 rich sectors (econ 1.5 / pop 1.25) → cap 600×15 = 9000
const centerSpecs = Array.from({ length: 12 }, (_, i) => ({
  econ: 1.5, pop: 1.25, terrain: 'plains',
  fortTier: i === 0 ? 'walls' : 'none', garrison: i < 4 ? 300 : 0 }));
// mid: sum pop = 7000/600 ≈ 11.67
function midSpecs() {
  return [
    ...Array.from({ length: 8 }, () => ({ econ: 1, pop: 1, garrison: 250 })),
    { econ: 1, pop: 1.835, fortTier: 'fortress', garrison: 250, terrain: 'mountain' },
    { econ: 1, pop: 1.835, garrison: 0 },
  ];
}
// small: sum pop = 5000/600 ≈ 8.33
const smallSpecs = [
  ...Array.from({ length: 6 }, () => ({ econ: 1, pop: 1.2, garrison: 200 })),
  { econ: 1, pop: 1.13, fortTier: 'walls', garrison: 200, terrain: 'river' },
];
// hermit: sum pop = 6000/600 = 10, strait-shielded
const hermitSpecs = Array.from({ length: 8 }, () => ({
  econ: 1, pop: 1.25, garrison: 300, terrain: 'coast' }));

const regionSectorLists = {
  center: sectorsFor('center', centerSpecs),
  seoryeong: sectorsFor('seoryeong', midSpecs()),
  dongpyeong: sectorsFor('dongpyeong', midSpecs()),
  namgok: sectorsFor('namgok', smallSpecs),
  bukha: sectorsFor('bukha', hermitSpecs),
};

const sectors = {};
for (const list of Object.values(regionSectorLists)) {
  for (const s of list) sectors[s.id] = s;
}

const regions = [
  { id: 'center', name: '중원', sizeClass: 'center', sectorIds: regionSectorLists.center.map((s) => s.id) },
  { id: 'seoryeong', name: '서령', sizeClass: 'mid', sectorIds: regionSectorLists.seoryeong.map((s) => s.id) },
  { id: 'dongpyeong', name: '동평', sizeClass: 'mid', sectorIds: regionSectorLists.dongpyeong.map((s) => s.id) },
  { id: 'namgok', name: '남곡', sizeClass: 'small', sectorIds: regionSectorLists.namgok.map((s) => s.id) },
  { id: 'bukha', name: '북하', sizeClass: 'hermit', sectorIds: regionSectorLists.bukha.map((s) => s.id) },
];

// one edge per bordering region pair, from a representative sector each side.
// center borders all 4 (its exposure); bukha's front is a strait choke.
function edge(regA, regB, choke) {
  return { a: regionSectorLists[regA][0].id, b: regionSectorLists[regB][0].id, choke };
}
const OPEN = { class: 'open', cap: Infinity, removalPath: 'n/a (open border)' };
const edges = [
  edge('center', 'seoryeong', { class: 'pass', cap: 1000, removalPath: 'side-path bypass (Anopaea) or road-build' }),
  edge('center', 'dongpyeong', OPEN),
  edge('center', 'namgok', { class: 'river', cap: 1000, removalPath: 'alternate ford or pontoon' }),
  edge('center', 'bukha', { class: 'strait', cap: 500, removalPath: 'port staging (+500 door) or sea control' }),
];

const FIXTURE_MAP = { regions, sectors, edges };

// dual-mode export (node require / browser global)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FIXTURE_MAP };
} else {
  (window.TC = window.TC || {}).data = { FIXTURE_MAP };
}
```

- [ ] **Step 2: Verify caps re-derive**

Run:
```bash
node -e "const {FIXTURE_MAP}=require('./mockup/combat-calc/map-data.js'); const {nationalCap}=require('./mockup/combat-calc/econ.js'); for(const r of FIXTURE_MAP.regions){const secs=r.sectorIds.map(id=>FIXTURE_MAP.sectors[id]); console.log(r.name, r.sizeClass, nationalCap(secs));}"
```
Expected (±~50 from rounding):
```
중원 center 9000
서령 mid 7002
동평 mid 7002
남곡 small 5000
북하 hermit 6000
```

- [ ] **Step 3: Commit**

```bash
git add mockup/combat-calc/map-data.js
git commit -m "feat(mockup): map-data schema (spatial+arithmetic) + 5-region fixture

Terrain-cradle map schema: regions + sector adjacency graph + chokes
(each with required removalPath) + hex layout (mapUnits, spatial only).
Dual-mode export. Fixture re-derives sealed caps via econ.js. hex count
is not value. Prototype; js/ must not import.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Map loader (graph → match.js/econ.js shapes)

**Files:**
- Create: `mockup/combat-calc/map-loader.js`

**Interfaces:**
- Consumes: `econ.js` `nationalCap`; `FIXTURE_MAP` shape.
- Produces (both `module.exports` and `window.TC.loader`): `{ loadMap, sectorsOf }`:
  - `sectorsOf(map, regionId) → [sector]`.
  - `loadMap(map, { assignment } = {}) → { realms }` — `realms[]` for `hegemonyCheck`: `{ name, alive:true, vassalOf:null, field, fieldCap, garrisons, exits, fronts }`. `field` starts at `fieldCap` (all-cap). `exits` from cross-seat edges; `fronts` maps neighbor seat name → summed facing garrison. `mapUnits` are ignored (spatial only). `assignment` = `{seatName:[regionId]}`, default one region per seat.

- [ ] **Step 1: Write the loader**

Create `mockup/combat-calc/map-loader.js`:

```js
'use strict';
// PROTOTYPE — adapter from a terrain-cradle map to the shapes match.js and
// econ.js consume. Derives fieldCap (nationalCap), exits (cross-seat choke
// edges), facing-front garrisons (adjacency). mapUnits ignored (spatial).
// No new arithmetic. Dual-mode. js/ must not import.

const ECON = (typeof require !== 'undefined')
  ? require('./econ.js')
  : (window.TC && window.TC.econ);

function sectorsOf(map, regionId) {
  const region = map.regions.find((r) => r.id === regionId);
  return region.sectorIds.map((id) => map.sectors[id]);
}

// { neighborRegionId: { cap, open, borderSectorIds } }
function neighborsOf(map, regionId) {
  const out = {};
  const rOf = (sid) => map.sectors[sid].regionId;
  for (const e of map.edges) {
    const ra = rOf(e.a); const rb = rOf(e.b);
    if (ra === regionId && rb !== regionId) {
      (out[rb] ??= { cap: 0, open: false, borderSectorIds: [] });
      if (e.choke.cap === Infinity) out[rb].open = true; else out[rb].cap += e.choke.cap;
      out[rb].borderSectorIds.push(e.a);
    } else if (rb === regionId && ra !== regionId) {
      (out[ra] ??= { cap: 0, open: false, borderSectorIds: [] });
      if (e.choke.cap === Infinity) out[ra].open = true; else out[ra].cap += e.choke.cap;
      out[ra].borderSectorIds.push(e.b);
    }
  }
  return out;
}

function loadMap(map, { assignment } = {}) {
  const seats = assignment
    ? Object.entries(assignment).map(([name, regionIds]) => ({ name, regionIds }))
    : map.regions.map((r) => ({ name: r.name, regionIds: [r.id] }));

  const regionToSeat = {};
  for (const s of seats) for (const rid of s.regionIds) regionToSeat[rid] = s.name;

  const realms = seats.map((seat) => {
    const secs = seat.regionIds.flatMap((rid) => sectorsOf(map, rid));
    const fieldCap = ECON.nationalCap(secs);
    const garrisons = secs.reduce((s, x) => s + (x.garrison || 0), 0);

    const exits = [];
    const fronts = {};
    for (const rid of seat.regionIds) {
      const nbrs = neighborsOf(map, rid);
      for (const [nbrRegion, info] of Object.entries(nbrs)) {
        const nbrSeat = regionToSeat[nbrRegion];
        if (nbrSeat === seat.name) continue; // internal border
        exits.push({ cap: info.open ? Infinity : info.cap });
        const g = info.borderSectorIds.reduce((s, sid) => s + (map.sectors[sid].garrison || 0), 0);
        fronts[nbrSeat] = (fronts[nbrSeat] || 0) + g;
      }
    }
    if (exits.length === 0) exits.push({ cap: Infinity });

    return { name: seat.name, alive: true, vassalOf: null,
      field: fieldCap, fieldCap, garrisons, exits, fronts };
  });

  return { realms };
}

const _api = { loadMap, sectorsOf };
if (typeof module !== 'undefined' && module.exports) module.exports = _api;
else (window.TC = window.TC || {}).loader = _api;
```

- [ ] **Step 2: Verify loaded realm shapes**

Run:
```bash
node -e "const {FIXTURE_MAP}=require('./mockup/combat-calc/map-data.js'); const {loadMap}=require('./mockup/combat-calc/map-loader.js'); for(const r of loadMap(FIXTURE_MAP).realms){console.log(r.name,'cap='+r.fieldCap,'exits='+JSON.stringify(r.exits.map(e=>e.cap)),'fronts='+JSON.stringify(r.fronts));}"
```
Expected: 중원 has 4 exits (one `null`=open for 동평, plus 1000/1000/500) and fronts to all 4; 북하 has `[500]` and one front to 중원. `JSON.stringify(Infinity)` prints `null` (expected).

- [ ] **Step 3: Verify hegemonyCheck runs (obs 8380 sanity)**

Run:
```bash
node -e "const {FIXTURE_MAP}=require('./mockup/combat-calc/map-data.js'); const {loadMap}=require('./mockup/combat-calc/map-loader.js'); const {hegemonyCheck}=require('./mockup/combat-calc/match.js'); const {realms}=loadMap(FIXTURE_MAP); for(const r of realms){const c=hegemonyCheck(realms,r.name); console.log(r.name,'leadership='+c.leadership,'trips='+c.trips,'candProj='+c.candProj);}"
```
Expected: one line per realm with booleans and a non-zero `candProj`. **Note (obs 8380 "trips never fire"): if every `candProj` is 0 or `leadership` never varies by realm, flag as a loader/graph bug before proceeding.**

- [ ] **Step 4: Commit**

```bash
git add mockup/combat-calc/map-loader.js
git commit -m "feat(mockup): map loader — graph to match.js/econ.js shapes

Adapter deriving fieldCap (econ.js), exits (cross-seat chokes), and
facing-front garrisons (adjacency) from a map. Optional seat assignment.
Dual-mode. Pure translation — reuses existing arithmetic.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: B1/B2 gate

**Files:**
- Create: `mockup/combat-calc/map-gate.js`

**Interfaces:**
- Consumes: `match.js` `hegemonyCheck`/`projectable`/`shieldMass`/`MATCH_DIALS`; `map-loader.js` `loadMap`.
- Produces (both exports): `{ checkB1, checkB2, gateReport }`:
  - `checkB1(realms, D?) → { pass, offenders }` — pass iff no realm's `hegemonyCheck().leadership` at all-cap.
  - `checkB2(realms, D?) → { pass, kills }` — pass iff no single neighbor `≥ ratio × victim's facing shield`; `kills = [{victim, attacker}]`.
  - `gateReport(map, assignment?, D?) → { b1, b2, viableForThisBinding, realms }`.

- [ ] **Step 1: Write the gate**

Create `mockup/combat-calc/map-gate.js`:

```js
'use strict';
// PROTOTYPE — the seat-sizing gate (spec §4 gate B) over a loaded map.
// B1: no all-cap leadership. B2: no one-war-kill by a single neighbor.
// Reuses match.js arithmetic. Dual-mode. js/ isolated.

const MATCH = (typeof require !== 'undefined')
  ? require('./match.js') : (window.TC && window.TC.match);
const LOADER = (typeof require !== 'undefined')
  ? require('./map-loader.js') : (window.TC && window.TC.loader);

function checkB1(realms, D = MATCH.MATCH_DIALS) {
  const offenders = [];
  for (const r of realms) {
    if (MATCH.hegemonyCheck(realms, r.name, D).leadership) offenders.push(r.name);
  }
  return { pass: offenders.length === 0, offenders };
}

function checkB2(realms, D = MATCH.MATCH_DIALS) {
  const kills = [];
  for (const victim of realms) {
    const frontKeys = Object.keys(victim.fronts || {});
    for (const attacker of realms) {
      if (attacker.name === victim.name) continue;
      if (!frontKeys.includes(attacker.name)) continue; // must share a front
      const atkProj = MATCH.projectable(attacker, D);
      const vicShield = MATCH.shieldMass(victim, D, [attacker.name]);
      if (atkProj >= D.shieldRatio * vicShield) kills.push({ victim: victim.name, attacker: attacker.name });
    }
  }
  return { pass: kills.length === 0, kills };
}

function gateReport(map, assignment, D = MATCH.MATCH_DIALS) {
  const { realms } = LOADER.loadMap(map, assignment ? { assignment } : {});
  const b1 = checkB1(realms, D);
  const b2 = checkB2(realms, D);
  return { b1, b2, viableForThisBinding: b1.pass && b2.pass, realms };
}

const _api = { checkB1, checkB2, gateReport };
if (typeof module !== 'undefined' && module.exports) module.exports = _api;
else (window.TC = window.TC || {}).gate = _api;
```

- [ ] **Step 2: Verify the gate runs**

Run:
```bash
node -e "const {FIXTURE_MAP}=require('./mockup/combat-calc/map-data.js'); const {gateReport}=require('./mockup/combat-calc/map-gate.js'); const g=gateReport(FIXTURE_MAP); console.log('B1',JSON.stringify(g.b1)); console.log('B2',JSON.stringify(g.b2)); console.log('viable',g.viableForThisBinding);"
```
Expected: prints B1/B2 objects + viable bool. Pass/fail is not predetermined — the fixture is a first 가안; whatever it reports IS the finding (a B1 fail = center leads at all-cap, exactly what the gate exists to surface).

- [ ] **Step 3: Commit**

```bash
git add mockup/combat-calc/map-gate.js
git commit -m "feat(mockup): B1/B2 seat-sizing gate over a loaded map

checkB1 (no all-cap leadership), checkB2 (no one-war-kill), gateReport.
Dual-mode. Reuses match.js projectable/shieldMass/hegemonyCheck.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Viable seat-binding enumeration

**Files:**
- Modify: `mockup/combat-calc/map-gate.js`

**Interfaces:**
- Produces (added): `regionAdjacency(map)`, `enumerateBindings(map, seatCount)`, `viableBindings(map, seatCount, D?)`.

- [ ] **Step 1: Add enumeration**

In `map-gate.js`, insert before the `const _api = {...}` line:

```js
function regionAdjacency(map) {
  const adj = {};
  for (const r of map.regions) adj[r.id] = new Set();
  for (const e of map.edges) {
    const ra = map.sectors[e.a].regionId; const rb = map.sectors[e.b].regionId;
    if (ra !== rb) { adj[ra].add(rb); adj[rb].add(ra); }
  }
  const out = {}; for (const k of Object.keys(adj)) out[k] = [...adj[k]];
  return out;
}

// MVP: identity binding when regions==seats; adjacent-pair perfect matching
// when regions==2×seats.
function enumerateBindings(map, seatCount) {
  const regionIds = map.regions.map((r) => r.id);
  if (regionIds.length === seatCount) {
    const a = {}; map.regions.forEach((r) => { a[r.name] = [r.id]; });
    return [a];
  }
  if (regionIds.length !== 2 * seatCount) {
    throw new Error(`enumerateBindings MVP supports regions==seats or 2×seats, got ${regionIds.length}/${seatCount}`);
  }
  const adj = regionAdjacency(map);
  const results = [];
  function recurse(remaining, pairs) {
    if (remaining.length === 0) {
      const a = {}; pairs.forEach((p, i) => { a[`seat${i + 1}`] = p; });
      results.push(a); return;
    }
    const [first, ...rest] = remaining;
    for (const other of rest) {
      if (adj[first].includes(other)) recurse(rest.filter((x) => x !== other), [...pairs, [first, other]]);
    }
  }
  recurse(regionIds, []);
  return results;
}

function viableBindings(map, seatCount, D) {
  const bindings = enumerateBindings(map, seatCount);
  const viable = bindings.filter((a) => gateReport(map, a, D).viableForThisBinding);
  return { total: bindings.length, viable, viableCount: viable.length };
}
```

Update the export object to:
```js
const _api = { checkB1, checkB2, gateReport, regionAdjacency, enumerateBindings, viableBindings };
```

- [ ] **Step 2: Verify enumeration (identity case)**

Run:
```bash
node -e "const {FIXTURE_MAP}=require('./mockup/combat-calc/map-data.js'); const {enumerateBindings,viableBindings}=require('./mockup/combat-calc/map-gate.js'); console.log('bindings',JSON.stringify(enumerateBindings(FIXTURE_MAP,5))); const v=viableBindings(FIXTURE_MAP,5); console.log('total',v.total,'viableCount',v.viableCount);"
```
Expected: identity binding, `total 1`, `viableCount` 0 or 1. (The 2×seats pairing path is exercised by a 10-region authored map later.)

- [ ] **Step 3: Commit**

```bash
git add mockup/combat-calc/map-gate.js
git commit -m "feat(mockup): viable seat-binding enumeration

regionAdjacency + enumerateBindings (adjacent-pair matching / identity) +
viableBindings (count passing B1∧B2). The topology-tuning metric.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Battery sheet 14 (node batch validation)

**Files:**
- Modify: `mockup/combat-calc/battery.js` (add `mapViability`; register in `SHEETS`)
- Modify: `mockup/combat-calc/README.md`, `NOTES.md`

**Interfaces:**
- Consumes: `battery.js` helpers `h`/`sub`/`row` (lines 12–17); `FIXTURE_MAP`, `loadMap`, `gateReport`, `viableBindings`.

- [ ] **Step 1: Add requires + sheet function**

Near the other requires at the top of `battery.js`, add:
```js
const { FIXTURE_MAP } = require('./map-data.js');
const { loadMap } = require('./map-loader.js');
const { gateReport, viableBindings } = require('./map-gate.js');
```

Just before `const SHEETS = {` (~line 877), add:
```js
function mapViability() {
  h('SHEET 14 — MAP VIABILITY (terrain-cradle authoring gate)');
  sub('Loads a map, derives realm mass/shield/cap from the sector graph,');
  sub('runs the seat-sizing gate: B1 (no all-cap leadership) + B2 (no');
  sub('one-war-kill) + viable seat-binding count. Fixture is a 가안.');

  const { realms } = loadMap(FIXTURE_MAP);
  console.log(''); sub('Per-realm derived state (all-cap):');
  row(['realm', 'cap', 'field', 'exits', 'garr', 'fronts'], [10, 7, 7, 16, 6, 24]);
  for (const r of realms) {
    const doors = r.exits.map((e) => (e.cap === Infinity ? 'open' : e.cap)).join('/');
    const fronts = Object.entries(r.fronts).map(([n, g]) => `${n}:${g}`).join(' ');
    row([r.name, String(r.fieldCap), String(r.field), doors, String(r.garrisons), fronts], [10, 7, 7, 16, 6, 24]);
  }

  const g = gateReport(FIXTURE_MAP);
  console.log(''); sub('Gate:');
  row(['check', 'pass', 'detail'], [8, 6, 40]);
  row(['B1', g.b1.pass ? 'YES' : 'NO', g.b1.pass ? 'no all-cap leadership' : `leadership: ${g.b1.offenders.join(', ')}`], [8, 6, 40]);
  row(['B2', g.b2.pass ? 'YES' : 'NO', g.b2.pass ? 'no one-war-kill' : g.b2.kills.map((k) => `${k.attacker}→${k.victim}`).join(', ')], [8, 6, 40]);

  const v = viableBindings(FIXTURE_MAP, 5);
  console.log(''); sub(`Viable seat-bindings: ${v.viableCount} / ${v.total} (diversity metric — target set empirically)`);
  console.log(''); sub('VERDICT: user rules in NOTES.md. This sheet is the C-loop loss.');
}
```

Register in `SHEETS` (~line 877) by adding `viability: mapViability`:
```js
const SHEETS = { myeongnyang, fortress, raid, delaying, grinding, feint, tempo,
  timeline, manpower, hegemony, settlement, tournament: tournamentSheet, economy,
  viability: mapViability };
```

- [ ] **Step 2: Run the sheet**

Run: `node mockup/combat-calc/battery.js viability`
Expected: prints "SHEET 14 — MAP VIABILITY", a per-realm table, a B1/B2 gate table, and a viable-binding count. No crash.

- [ ] **Step 3: Confirm full battery still runs**

Run: `node mockup/combat-calc/battery.js 2>&1 | tail -20`
Expected: completes through sheet 14, exit 0.

- [ ] **Step 4: Document in README + NOTES**

In `README.md`, after the sheet-13 entry:
```markdown
- **Sheet 14 — map viability** (`viability`): loads a terrain-cradle map
  (map-data.js), derives realm mass/shield/cap (map-loader.js), runs the
  authoring gate (map-gate.js): B1/B2 + viable seat-binding count. The
  C-loop loss for map authoring. Also renders in the browser via
  map-mockup.html (same dual-mode arithmetic).
```

In `NOTES.md`, append:
```markdown
## Sheet 14 — map viability (2026-07-06, tooling)

The map-authoring gate (spec: docs/superpowers/specs/2026-07-06-terrain-
cradle-map-design.md). Tooling only — no map is sealed yet. The 5-region
fixture is a first 가안 to exercise the loader/gate/mockup; its B1/B2
result is a starting measurement, not a verdict.

### User verdicts
_(pending — first authored map)_
```

- [ ] **Step 5: Commit**

```bash
git add mockup/combat-calc/battery.js mockup/combat-calc/README.md mockup/combat-calc/NOTES.md
git commit -m "feat(mockup): battery sheet 14 — map viability gate (node batch)

Sheet 14 loads the fixture, prints per-realm derived state, runs B1/B2,
reports viable seat-binding count. Registered as 'viability'. README +
NOTES documented.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Make the arithmetic modules dual-mode

**Files:**
- Modify: `mockup/combat-calc/econ.js` (export guard)
- Modify: `mockup/combat-calc/match.js` (export guard)

**Interfaces:**
- After this task, `econ.js` and `match.js` load under both node and browser. `map-data.js`/`map-loader.js`/`map-gate.js` already carry the guard (Tasks 1–4). `battery.js` stays node-only.

- [ ] **Step 1: Guard econ.js export**

In `econ.js`, replace the final line `module.exports = { ECON_DIALS, income, nationalCap, recruitCost, sector, midRealm, centerRealm };` with:
```js
const _api = { ECON_DIALS, income, nationalCap, recruitCost, sector, midRealm, centerRealm };
if (typeof module !== 'undefined' && module.exports) module.exports = _api;
else (window.TC = window.TC || {}).econ = _api;
```

- [ ] **Step 2: Guard match.js export**

In `match.js`, replace the final `module.exports = { MATCH_DIALS, projectable, shieldMass, hegemonyCheck, presetBundle, expectedContinuedLoss, accepts };` with:
```js
const _api = { MATCH_DIALS, projectable, shieldMass, hegemonyCheck, presetBundle, expectedContinuedLoss, accepts };
if (typeof module !== 'undefined' && module.exports) module.exports = _api;
else (window.TC = window.TC || {}).match = _api;
```

- [ ] **Step 3: Verify node still works (no regression)**

Run: `node mockup/combat-calc/battery.js viability 2>&1 | tail -8`
Expected: sheet 14 prints exactly as in Task 5 (node path unchanged).

- [ ] **Step 4: Verify browser-global path resolves**

Run:
```bash
node -e "global.window={}; require('./mockup/combat-calc/econ.js'); require('./mockup/combat-calc/match.js'); console.log('node export still primary:', typeof require('./mockup/combat-calc/econ.js').nationalCap);"
```
Expected: prints `node export still primary: function` (the guard prefers `module.exports` under node; the `window` branch is browser-only and does not interfere).

- [ ] **Step 5: Commit**

```bash
git add mockup/combat-calc/econ.js mockup/combat-calc/match.js
git commit -m "refactor(mockup): dual-mode export for econ.js + match.js

UMD-style guard so the arithmetic loads under both node (module.exports)
and browser (window.TC namespace), letting map-mockup.html reuse the exact
same computation as the node battery. No behavior change under node.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Visual mockup (browser render + live B1/B2)

**Files:**
- Create: `mockup/combat-calc/map-mockup.html`

**Interfaces:**
- Consumes (via `<script>` tags, in order): `econ.js`, `match.js`, `map-loader.js`, `map-gate.js`, `map-data.js` (all populate `window.TC`).
- Produces: a page that renders `FIXTURE_MAP` as an SVG hex map (region-colored, sector hexes, choke markers) with a side panel showing per-realm cap/proj/shield and the live B1/B2 gate verdict.

- [ ] **Step 1: Write the mockup**

Create `mockup/combat-calc/map-mockup.html`:

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<title>Terrain-Cradle Map Workbench</title>
<style>
  body { margin: 0; font: 13px/1.4 system-ui, sans-serif; display: flex; height: 100vh; }
  #map { flex: 1; background: #0f1216; }
  #panel { width: 340px; background: #171b21; color: #d8dee6; padding: 14px; overflow-y: auto; }
  h2 { font-size: 13px; margin: 12px 0 6px; color: #8fa; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  td, th { padding: 2px 4px; text-align: right; border-bottom: 1px solid #2a2f37; }
  th:first-child, td:first-child { text-align: left; }
  .pass { color: #6f6; } .fail { color: #f77; }
  .verdict { font-size: 14px; font-weight: bold; margin: 6px 0; }
  text { font: 10px sans-serif; fill: #cdd; }
  .choke { fill: #fc6; font-weight: bold; }
</style>
</head>
<body>
<svg id="map"></svg>
<div id="panel"></div>

<script src="econ.js"></script>
<script src="match.js"></script>
<script src="map-loader.js"></script>
<script src="map-gate.js"></script>
<script src="map-data.js"></script>
<script>
'use strict';
const { FIXTURE_MAP } = window.TC.data;
const { loadMap } = window.TC.loader;
const { gateReport } = window.TC.gate;
const { projectable, shieldMass } = window.TC.match;

const HEX = 26; // pixel size
const REGION_COLOR = { center: '#c94', seoryeong: '#49c', dongpyeong: '#4c9',
  namgok: '#a4c', bukha: '#c47' };

// axial → pixel (pointy-top)
function hexToPixel(q, r) {
  return { x: HEX * Math.sqrt(3) * (q + r / 2), y: HEX * 1.5 * r };
}

function renderMap() {
  const svg = document.getElementById('map');
  const parts = [];
  let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
  // hexes, colored by region
  for (const [sid, sec] of Object.entries(FIXTURE_MAP.sectors)) {
    for (const u of sec.mapUnits) {
      const { x, y } = hexToPixel(u.q, u.r);
      minX = Math.min(minX, x); minY = Math.min(minY, y);
      maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
      const pts = [];
      for (let i = 0; i < 6; i++) {
        const a = Math.PI / 180 * (60 * i - 30);
        pts.push(`${(x + HEX * Math.cos(a)).toFixed(1)},${(y + HEX * Math.sin(a)).toFixed(1)}`);
      }
      parts.push(`<polygon points="${pts.join(' ')}" fill="${REGION_COLOR[sec.regionId]}" stroke="#0f1216" stroke-width="1.5"/>`);
      parts.push(`<text x="${x.toFixed(1)}" y="${(y + 3).toFixed(1)}" text-anchor="middle">${sec.fortTier !== 'none' ? '▲' : ''}</text>`);
    }
  }
  // choke markers at edge midpoints
  for (const e of FIXTURE_MAP.edges) {
    const ua = FIXTURE_MAP.sectors[e.a].mapUnits[0];
    const ub = FIXTURE_MAP.sectors[e.b].mapUnits[0];
    const pa = hexToPixel(ua.q, ua.r); const pb = hexToPixel(ub.q, ub.r);
    const mx = (pa.x + pb.x) / 2, my = (pa.y + pb.y) / 2;
    const label = e.choke.class === 'open' ? '' : `${e.choke.class}${e.choke.cap}`;
    parts.push(`<line x1="${pa.x.toFixed(1)}" y1="${pa.y.toFixed(1)}" x2="${pb.x.toFixed(1)}" y2="${pb.y.toFixed(1)}" stroke="#556" stroke-width="1" stroke-dasharray="3 3"/>`);
    if (label) parts.push(`<text class="choke" x="${mx.toFixed(1)}" y="${my.toFixed(1)}" text-anchor="middle">${label}</text>`);
  }
  const pad = HEX * 2;
  svg.setAttribute('viewBox', `${minX - pad} ${minY - pad} ${maxX - minX + pad * 2} ${maxY - minY + pad * 2}`);
  svg.innerHTML = parts.join('');
}

function renderPanel() {
  const { realms } = loadMap(FIXTURE_MAP);
  const g = gateReport(FIXTURE_MAP);
  const rows = realms.map((r) => {
    const proj = projectable(r);
    const shield = shieldMass(r, undefined, Object.keys(r.fronts));
    return `<tr><td>${r.name}</td><td>${r.fieldCap}</td><td>${proj}</td><td>${shield}</td></tr>`;
  }).join('');
  document.getElementById('panel').innerHTML = `
    <h2>Realms (all-cap)</h2>
    <table><tr><th>seat</th><th>cap</th><th>proj</th><th>shield</th></tr>${rows}</table>
    <h2>Gate</h2>
    <div class="verdict ${g.b1.pass ? 'pass' : 'fail'}">B1 ${g.b1.pass ? 'PASS' : 'FAIL'}${g.b1.pass ? '' : ' — ' + g.b1.offenders.join(', ')}</div>
    <div class="verdict ${g.b2.pass ? 'pass' : 'fail'}">B2 ${g.b2.pass ? 'PASS' : 'FAIL'}${g.b2.pass ? '' : ' — ' + g.b2.kills.map((k) => k.attacker + '→' + k.victim).join(', ')}</div>
    <p>Edit map-data.js and reload to re-measure. Heavy checks (full viable
    enumeration, tournament) run in node: <code>node battery.js viability</code>.</p>`;
}

renderMap();
renderPanel();
</script>
</body>
</html>
```

- [ ] **Step 2: Serve and load the page**

Run (from repo root; a server may already be up):
```bash
python3 -m http.server 8007 >/dev/null 2>&1 &
sleep 1
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8007/mockup/combat-calc/map-mockup.html
```
Expected: `200`.

- [ ] **Step 3: Verify render + panel in a browser**

Open `http://localhost:8007/mockup/combat-calc/map-mockup.html` (use browser-harness per the project rule). Assert in-page that `window.TC` loaded and the gate computed:
```bash
browser-harness <<'PY'
new_tab("http://localhost:8007/mockup/combat-calc/map-mockup.html")
wait_for_load()
switch_tab(current_tab())
print(js("document.querySelectorAll('#map polygon').length"))   # hexes rendered (> 0)
print(js("document.querySelector('#panel .verdict').textContent")) # B1 verdict text
PY
```
Expected: a non-zero polygon count and a "B1 PASS/FAIL …" string — proving the browser path shares the node arithmetic (`window.TC`) and renders. (WSLg first-paint may be blank; re-capture if so.)

- [ ] **Step 4: Commit**

```bash
git add mockup/combat-calc/map-mockup.html
git commit -m "feat(mockup): map-mockup.html — visual render + live B1/B2

Browser workbench: renders FIXTURE_MAP as an SVG hex map (region-colored,
fort markers, choke labels) with a side panel of per-realm cap/proj/shield
and the live B1/B2 gate — reusing the dual-mode arithmetic (window.TC), so
the browser and node battery compute identically. Edit map-data + reload to
re-measure. Completes the visual+measure+tune authoring triangle.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## After this plan

The workbench is complete: edit `map-data.js` → `map-mockup.html` shows the map + live B1/B2 → `node battery.js viability` runs heavy checks. **The MVP map pool authoring (spec §3: 1 canonical + 3 variants, 10-region) is the next work**, run as the C-loop:
1. Author a 10-region map in `map-data.js` (regions=10 → the adjacent-pair enumeration path activates for 5 seats).
2. Open the mockup → see the map + live B1/B2; tune topology levers (central water, split center, choke class) + sector values by natural-language direction → reload → re-measure.
3. `node battery.js viability` for full viable-binding enumeration; run the sheet-12 tournament on the canonical binding for closure rate / archetype spread.
4. Repeat until the gate passes and viable-binding count meets the diversity target; then author 3 sector-form variants.

That authoring loop is a separate work unit (values are loop outputs), stays inside the prototype, and keeps game-code (`js/`) behind the separate code-entry gate.

## Self-Review

- **Spec coverage:** §1 schema (spatial+arithmetic, hex≠value, required removalPath) → Task 1. §1 loader shapes → Task 2. §3 static B1/B2 → Task 3; viable enumeration → Task 4; node batch sheet → Task 5; dual-mode for the browser channel → Task 6; **visual render + live measure (the spec's visual authoring workflow)** → Task 7. §3 MVP pool authoring → deferred to "After this plan" (C-loop; values not pre-authorable). §4 gate B (auto) → Tasks 3–5,7; gates A/C/D/E/F are authoring-time (applied during the C-loop). Dynamic tournament reuse → "After this plan" (existing sheet 12).
- **Placeholder scan:** no TBD/TODO; every code step has exact content, every run step an exact command + expected output. The cap ±tolerance in Task 1 is a calibration instruction, not a placeholder.
- **Type consistency:** dual-mode export object named `_api` in Tasks 2/3/6 (and `{FIXTURE_MAP}` / `.data` in Task 1); `window.TC.{econ,match,loader,gate,data}` namespacing consistent across Tasks 1–4, 6 and consumed by that name in Task 7's mockup. `loadMap → {realms}`, `gateReport → {b1,b2,viableForThisBinding,realms}`, `checkB1 → {pass,offenders}`, `checkB2 → {pass,kills:[{victim,attacker}]}`, `viableBindings → {total,viable,viableCount}` — consumed with matching field names in Tasks 5 (sheet) and 7 (panel). `projectable(realm)` / `shieldMass(realm, D, againstNames)` signatures match match.js as read in Task 7.
