# Terrain-Cradle Map Validation Harness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the validation tooling from the terrain-cradle map spec — a map loader (map graph → the shapes `match.js`/`econ.js` already consume) and battery sheet 14 (static B1/B2 + viable seat-binding enumeration) — so authored maps can be numerically gated.

**Architecture:** The existing prototype harness (`mockup/combat-calc/`) already computes projectable mass, facing-front shield, hegemony leadership (`match.js`), and sector-derived cap/income (`econ.js`). This plan adds a **map layer above them**: a data schema for a terrain-cradle map (regions + sector-level adjacency graph + chokes) and a **loader/adapter** that derives each realm's `{field, fieldCap, exits, fronts}` from that graph, then feeds the existing functions. Sheet 14 runs the gate: all-cap B1 (no seat achieves leadership), local B2 (no seat is one-war-killed), and enumeration of viable adjacent-pair seat bindings. **This plan builds the tool, not the maps** — the MVP map pool is authored afterward via the spec's C-loop (author → measure → tune), because those values are loop outputs, not pre-authorable.

**Tech Stack:** Node.js (vanilla, ES2017, CommonJS `require`/`module.exports`), the existing `mockup/combat-calc/` prototype. No test framework — the harness is a worked-sheet printer (`console.log` tables + human verdict in NOTES.md); loader correctness is checked with `node -e` one-liners and `node:assert`.

## Global Constraints

- **Harness isolation:** all new files live in `mockup/combat-calc/`; `js/` (game code) MUST NOT import them and they MUST NOT import `js/` (README.md top rule). This is prototype code, not the code-entry gate.
- **Land-derived:** `fieldCap` and `income` are DERIVED from sector values via `econ.js` (`nationalCap`/`income`), never authored directly (SPEC Core Design Principle 1; spec §1).
- **Every choke carries a `removalPath` field** — a choke without one is un-authorable (spec §1, C3/C4). The schema enforces presence.
- **hex count is not value** — `spatialExtent` (hex count) and `valueProfile` (authored) are independent; the loader derives cap from value, never from hex count (spec §1, D4).
- **All numbers are 가안** (candidate) — the harness prints tables and a verdict string; the user rules pass/fail in NOTES.md (harness convention).
- **CommonJS module style** — match the existing files (`'use strict';` + `module.exports = {...}`).

---

### Task 1: Map data schema + canonical fixture

**Files:**
- Create: `mockup/combat-calc/map-data.js`

**Interfaces:**
- Consumes: nothing (pure data + shape doc).
- Produces: `module.exports = { FIXTURE_MAP }` where `FIXTURE_MAP = { regions, sectors, edges }`:
  - `regions: [{ id, name, sizeClass, sectorIds: [string] }]` — `sizeClass` ∈ `'center'|'mid'|'small'|'hermit'`.
  - `sectors: { [id]: { id, regionId, economyValue, populationValue, usableEconomy, usablePop, fortTier, garrison } }` — `fortTier` ∈ `'none'|'fieldworks'|'walls'|'fortress'|'legendary'`; `garrison` = border-shield men on that sector.
  - `edges: [{ a: sectorId, b: sectorId, choke: { class, cap, removalPath } }]` — `class` ∈ `'open'|'forest'|'pass'|'river'|'strait'|'legendary'`; `cap` = `Infinity` for `'open'` else the M11 frontage cap; `removalPath` = non-empty string (required).
- The fixture is a **5-region seat=region degenerate case** (10-region authoring is the later C-loop) whose per-region sector sets re-derive the sealed M13 caps via `econ.js` values, so Task 2 can check the loader against known caps.

- [ ] **Step 1: Write the fixture data file**

Create `mockup/combat-calc/map-data.js`:

```js
'use strict';
// PROTOTYPE — terrain-cradle map schema + a canonical fixture, feeding the
// map loader (map-loader.js) and battery sheet 14. Not wired to game code;
// js/ must not import this. See docs/superpowers/specs/2026-07-06-terrain-
// cradle-map-design.md §1 for the schema rationale.
//
// A map is regions + a SECTOR-LEVEL adjacency graph. cap/income are DERIVED
// from sector values (econ.js), never authored. hex count is not value:
// this fixture omits hexes (spatialExtent) entirely — only valueProfile
// fields the arithmetic reads are carried. Every choke has a removalPath.
//
// FIXTURE_MAP: a 5-region seat=region case (10-region authoring is later).
// Per-region sector sets re-derive the sealed caps (center 9000 / mid 7000
// / small 5000 / hermit 6000) at capPerPop 600, so the loader can be checked
// against known values.

// helper: n ordinary/rich sectors for a region
function sectorsFor(regionId, specs) {
  // specs: [{ econ, pop, usableE, usableP, fortTier, garrison }]
  return specs.map((s, i) => ({
    id: `${regionId}_s${i}`,
    regionId,
    economyValue: s.econ,
    populationValue: s.pop,
    usableEconomy: s.usableE ?? 1,
    usablePop: s.usableP ?? 1,
    fortTier: s.fortTier ?? 'none',
    garrison: s.garrison ?? 0,
  }));
}

// center: 12 rich sectors (econ 1.5 / pop 1.25) → cap 600×15 = 9000
const centerSectors = sectorsFor('center',
  Array.from({ length: 12 }, (_, i) => ({ econ: 1.5, pop: 1.25,
    fortTier: i === 0 ? 'walls' : 'none', garrison: i < 4 ? 300 : 0 })));
// mid: 10 ordinary sectors → cap 600×10 = 6000... to hit 7000 use pop bumps
// (7000/600 = 11.67 pop): 10 sectors, 2 at pop 1.833 ≈ ; simpler: 11.67 —
// author 10 sectors summing pop 11.67. Use 8×1 + 2×1.835 = 11.67.
function midSectors(regionId) {
  return sectorsFor(regionId, [
    ...Array.from({ length: 8 }, () => ({ econ: 1, pop: 1, garrison: 250 })),
    { econ: 1, pop: 1.835, fortTier: 'fortress', garrison: 250 },
    { econ: 1, pop: 1.835, garrison: 0 },
  ]);
}
// small: sum pop = 5000/600 = 8.33
function smallSectors(regionId) {
  return sectorsFor(regionId, [
    ...Array.from({ length: 6 }, () => ({ econ: 1, pop: 1.2, garrison: 200 })),
    { econ: 1, pop: 1.13, fortTier: 'walls', garrison: 200 },
  ]);
}
// hermit: sum pop = 6000/600 = 10, strait-shielded
function hermitSectors(regionId) {
  return sectorsFor(regionId, [
    ...Array.from({ length: 8 }, () => ({ econ: 1, pop: 1.25, garrison: 300 })),
  ]);
}

const regionSectorSpecs = {
  center: centerSectors,
  seoryeong: midSectors('seoryeong'),
  dongpyeong: midSectors('dongpyeong'),
  namgok: smallSectors('namgok'),
  bukha: hermitSectors('bukha'),
};

// flatten sectors into an id-keyed map
const sectors = {};
for (const list of Object.values(regionSectorSpecs)) {
  for (const s of list) sectors[s.id] = s;
}

const regions = [
  { id: 'center', name: '중원', sizeClass: 'center',
    sectorIds: regionSectorSpecs.center.map((s) => s.id) },
  { id: 'seoryeong', name: '서령', sizeClass: 'mid',
    sectorIds: regionSectorSpecs.seoryeong.map((s) => s.id) },
  { id: 'dongpyeong', name: '동평', sizeClass: 'mid',
    sectorIds: regionSectorSpecs.dongpyeong.map((s) => s.id) },
  { id: 'namgok', name: '남곡', sizeClass: 'small',
    sectorIds: regionSectorSpecs.namgok.map((s) => s.id) },
  { id: 'bukha', name: '북하', sizeClass: 'hermit',
    sectorIds: regionSectorSpecs.bukha.map((s) => s.id) },
];

// adjacency: center borders all 4 peripheries (open on those fronts = its
// exposure); bukha's one front to center is a strait choke (hermit). One
// edge per region pair, using a border sector on each side.
function edge(regA, regB, choke) {
  return { a: regionSectorSpecs[regA][0].id, b: regionSectorSpecs[regB][0].id, choke };
}
const OPEN = { class: 'open', cap: Infinity, removalPath: 'n/a (open border)' };
const edges = [
  edge('center', 'seoryeong', { class: 'pass', cap: 1000,
    removalPath: 'side-path bypass (Anopaea rule) or road-build' }),
  edge('center', 'dongpyeong', OPEN),
  edge('center', 'namgok', { class: 'river', cap: 1000,
    removalPath: 'alternate ford or pontoon' }),
  edge('center', 'bukha', { class: 'strait', cap: 500,
    removalPath: 'port staging (+500 door) or sea control' }),
];

const FIXTURE_MAP = { regions, sectors, edges };

module.exports = { FIXTURE_MAP };
```

- [ ] **Step 2: Verify the file loads and caps re-derive**

Run:
```bash
node -e "const {FIXTURE_MAP}=require('./mockup/combat-calc/map-data.js'); const {nationalCap}=require('./mockup/combat-calc/econ.js'); for(const r of FIXTURE_MAP.regions){const secs=r.sectorIds.map(id=>FIXTURE_MAP.sectors[id]); console.log(r.name, r.sizeClass, 'cap=', nationalCap(secs));}"
```
Expected (approximately, ±a few from rounding):
```
중원 center cap= 9000
서령 mid cap= 7002
동평 mid cap= 7002
남곡 small cap= 5000
북하 hermit cap= 6000
```
If a cap is off by more than ~50, adjust that region's sector pop values and re-run before continuing.

- [ ] **Step 3: Commit**

```bash
git add mockup/combat-calc/map-data.js
git commit -m "feat(mockup): map-data schema + 5-region fixture for map validation

Terrain-cradle map schema (regions + sector adjacency graph + chokes,
every choke carrying a required removalPath) and a 5-region fixture whose
sector sets re-derive the sealed caps via econ.js. Feeds map-loader and
battery sheet 14. Prototype only; js/ must not import.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Map loader (graph → match.js/econ.js shapes)

**Files:**
- Create: `mockup/combat-calc/map-loader.js`

**Interfaces:**
- Consumes: `FIXTURE_MAP` (Task 1); `econ.js` `nationalCap`; `match.js` shapes.
- Produces: `module.exports = { loadMap, sectorsOf }`:
  - `sectorsOf(map, regionId) → [sector]` — the econ.js-shaped sector array for a region.
  - `loadMap(map, { assignment } = {}) → { realms }` where `realms` is the array `hegemonyCheck` consumes: each `{ name, alive:true, vassalOf:null, field, fieldCap, garrisons, exits, fronts }`. `field` starts at `fieldCap` (all-cap state, for B1). `exits` derives from cross-region edges; `fronts` maps neighbor region **name** → summed facing garrison. `assignment` (optional) maps `seatName → [regionId]` to merge regions into seats; default = one region per seat.

- [ ] **Step 1: Write the loader**

Create `mockup/combat-calc/map-loader.js`:

```js
'use strict';
// PROTOTYPE — adapter from a terrain-cradle map (map-data.js schema) to the
// shapes match.js (hegemonyCheck) and econ.js (nationalCap) already consume.
// The map authors sector values + a sector adjacency graph; the loader
// DERIVES each realm's fieldCap (from sector pop), exits (from cross-region
// choke edges), and facing-front garrisons (from adjacency). No new
// arithmetic — this is pure translation. js/ must not import this.

const { nationalCap } = require('./econ.js');

// econ.js-shaped sector array for one region
function sectorsOf(map, regionId) {
  const region = map.regions.find((r) => r.id === regionId);
  return region.sectorIds.map((id) => map.sectors[id]);
}

// which regions does `regionId` border, and through which choke cap?
// returns { neighborRegionId: { cap, borderSectorIds:[...] } }
function neighborsOf(map, regionId) {
  const out = {};
  const sectorRegion = (sid) => map.sectors[sid].regionId;
  for (const e of map.edges) {
    const ra = sectorRegion(e.a);
    const rb = sectorRegion(e.b);
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

// resolve a region id to its seat name (for fronts keyed by opposing seat)
function seatNameOfRegion(map, regionId, regionToSeat, seatNames) {
  if (!regionToSeat) return map.regions.find((r) => r.id === regionId).name;
  return regionToSeat[regionId];
}

function loadMap(map, { assignment } = {}) {
  // assignment: seatName -> [regionId]. default: one seat per region.
  const seats = assignment
    ? Object.entries(assignment).map(([name, regionIds]) => ({ name, regionIds }))
    : map.regions.map((r) => ({ name: r.name, regionIds: [r.id] }));

  const regionToSeat = {};
  for (const s of seats) for (const rid of s.regionIds) regionToSeat[rid] = s.name;

  const realms = seats.map((seat) => {
    // sectors across all regions this seat holds
    const secs = seat.regionIds.flatMap((rid) => sectorsOf(map, rid));
    const fieldCap = nationalCap(secs);
    const garrisons = secs.reduce((s, x) => s + (x.garrison || 0), 0);

    // exits + fronts derived from cross-SEAT edges only (intra-seat region
    // borders are internal, not fronts)
    const exits = [];
    const fronts = {};
    for (const rid of seat.regionIds) {
      const nbrs = neighborsOf(map, rid);
      for (const [nbrRegion, info] of Object.entries(nbrs)) {
        const nbrSeat = regionToSeat[nbrRegion];
        if (nbrSeat === seat.name) continue; // internal border, skip
        // exit door: open → Infinity, else summed choke cap
        exits.push({ cap: info.open ? Infinity : info.cap });
        // facing-front garrison = garrisons on this seat's border sectors
        const g = info.borderSectorIds.reduce((s, sid) => s + (map.sectors[sid].garrison || 0), 0);
        fronts[nbrSeat] = (fronts[nbrSeat] || 0) + g;
      }
    }
    if (exits.length === 0) exits.push({ cap: Infinity }); // landlocked-in-seat safety

    return { name: seat.name, alive: true, vassalOf: null,
      field: fieldCap, fieldCap, garrisons, exits, fronts };
  });

  return { realms };
}

module.exports = { loadMap, sectorsOf };
```

- [ ] **Step 2: Verify the loader produces correct realm shapes**

Run:
```bash
node -e "const {FIXTURE_MAP}=require('./mockup/combat-calc/map-data.js'); const {loadMap}=require('./mockup/combat-calc/map-loader.js'); const {realms}=loadMap(FIXTURE_MAP); for(const r of realms){console.log(r.name,'cap='+r.fieldCap,'field='+r.field,'exits='+JSON.stringify(r.exits.map(e=>e.cap)),'fronts='+JSON.stringify(r.fronts));}"
```
Expected: 중원 has 4 exits (one `null`=Infinity for 동평 open, plus 1000/1000/500) and fronts to all 4 peripheries; 북하 has one exit `[500]` and one front to 중원; caps match Task 1 Step 2. (`JSON.stringify(Infinity)` prints `null` — that is expected.)

- [ ] **Step 3: Verify hegemonyCheck runs on the loaded realms (no crash, sane output)**

Run:
```bash
node -e "const {FIXTURE_MAP}=require('./mockup/combat-calc/map-data.js'); const {loadMap}=require('./mockup/combat-calc/map-loader.js'); const {hegemonyCheck}=require('./mockup/combat-calc/match.js'); const {realms}=loadMap(FIXTURE_MAP); for(const r of realms){const c=hegemonyCheck(realms,r.name); console.log(r.name,'leadership='+c.leadership,'trips='+c.trips,'candProj='+c.candProj);}"
```
Expected: prints a line per realm with `leadership`/`trips` booleans and a numeric `candProj`. **Note (obs 8380): hegemonyCheck had a "trips never fire" issue — confirm `candProj` is non-zero and `leadership` varies sensibly; if every `candProj` is 0 or every `leadership` is identical regardless of realm, flag it as a loader/graph bug before proceeding.**

- [ ] **Step 4: Commit**

```bash
git add mockup/combat-calc/map-loader.js
git commit -m "feat(mockup): map loader — graph to match.js/econ.js shapes

Adapter deriving each realm's fieldCap (econ.js nationalCap), exits
(cross-seat choke edges), and facing-front garrisons (adjacency) from a
terrain-cradle map. Supports optional seat assignment (regions merged into
seats). Pure translation — reuses existing arithmetic. Prototype only.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: B1/B2 gate functions

**Files:**
- Create: `mockup/combat-calc/map-gate.js`

**Interfaces:**
- Consumes: `match.js` `hegemonyCheck`, `projectable`, `shieldMass`, `MATCH_DIALS`; `loadMap` (Task 2).
- Produces: `module.exports = { checkB1, checkB2, gateReport }`:
  - `checkB1(realms, D?) → { pass, offenders }` — pass iff NO realm's `hegemonyCheck(...).leadership` is true at all-cap. `offenders` = names achieving leadership.
  - `checkB2(realms, D?) → { pass, kills }` — pass iff NO realm can be one-war-killed: for each realm R and each single neighbor N (a realm sharing a front with R), N is NOT `≥ ratio × R's shield facing N`. `kills` = `[{ victim, attacker }]`.
  - `gateReport(map, assignment?, D?) → { b1, b2, viableForThisBinding }` — loads the map under one binding and returns both checks.

- [ ] **Step 1: Write B1/B2 logic**

Create `mockup/combat-calc/map-gate.js`:

```js
'use strict';
// PROTOTYPE — the seat-sizing gate (spec §4 gate B) over a loaded map.
// B1: no seat achieves hegemony leadership from an all-cap start (else the
//     match ends at T0). B2: no seat is one-war-killable by a single
//     neighbor (viability parity). Reuses match.js arithmetic. js/ isolated.

const { hegemonyCheck, projectable, shieldMass, MATCH_DIALS } = require('./match.js');
const { loadMap } = require('./map-loader.js');

// B1 — all-cap leadership must not fire for anyone
function checkB1(realms, D = MATCH_DIALS) {
  const offenders = [];
  for (const r of realms) {
    const c = hegemonyCheck(realms, r.name, D);
    if (c.leadership) offenders.push(r.name);
  }
  return { pass: offenders.length === 0, offenders };
}

// B2 — no single neighbor can beat a realm's facing shield by the ratio
function checkB2(realms, D = MATCH_DIALS) {
  const kills = [];
  for (const victim of realms) {
    const vShieldGarrisonKeys = Object.keys(victim.fronts || {});
    for (const attacker of realms) {
      if (attacker.name === victim.name) continue;
      // attacker must share a front with victim
      if (!vShieldGarrisonKeys.includes(attacker.name)) continue;
      const atkProj = projectable(attacker, D);
      const vicShield = shieldMass(victim, D, [attacker.name]);
      if (atkProj >= D.shieldRatio * vicShield) {
        kills.push({ victim: victim.name, attacker: attacker.name });
      }
    }
  }
  return { pass: kills.length === 0, kills };
}

function gateReport(map, assignment, D = MATCH_DIALS) {
  const { realms } = loadMap(map, assignment ? { assignment } : {});
  const b1 = checkB1(realms, D);
  const b2 = checkB2(realms, D);
  return { b1, b2, viableForThisBinding: b1.pass && b2.pass, realms };
}

module.exports = { checkB1, checkB2, gateReport };
```

- [ ] **Step 2: Verify the gate runs on the fixture**

Run:
```bash
node -e "const {FIXTURE_MAP}=require('./mockup/combat-calc/map-data.js'); const {gateReport}=require('./mockup/combat-calc/map-gate.js'); const g=gateReport(FIXTURE_MAP); console.log('B1',JSON.stringify(g.b1)); console.log('B2',JSON.stringify(g.b2)); console.log('viable',g.viableForThisBinding);"
```
Expected: prints `B1 {"pass":...,"offenders":[...]}`, `B2 {"pass":...,"kills":[...]}`, and `viable <bool>`. The fixture is a first 가안 — pass/fail is not predetermined; the point is the gate computes without error and gives a legible verdict. Record whatever it reports; if B1 fails (center achieves leadership at all-cap) that is exactly the finding the gate exists to surface.

- [ ] **Step 3: Commit**

```bash
git add mockup/combat-calc/map-gate.js
git commit -m "feat(mockup): B1/B2 seat-sizing gate over a loaded map

checkB1 (no all-cap leadership), checkB2 (no one-war-kill by a single
neighbor), gateReport (both, under one binding). Reuses match.js
projectable/shieldMass/hegemonyCheck. Prototype only.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Viable seat-binding enumeration

**Files:**
- Modify: `mockup/combat-calc/map-gate.js` (add `enumerateBindings`, `viableBindings`)

**Interfaces:**
- Consumes: `map.regions`, `map.edges` (region adjacency), `gateReport` (Task 3).
- Produces (added to the same module):
  - `regionAdjacency(map) → { regionId: [regionId] }` — region-level adjacency (two regions are adjacent iff any edge crosses them).
  - `enumerateBindings(map, seatCount) → [assignment]` — all partitions of regions into `seatCount` seats where every seat's regions form a connected group (MVP: seat = an adjacent PAIR when `regions === 2×seatCount`; general connected-partition otherwise). Each `assignment` = `{ seatName: [regionId] }`.
  - `viableBindings(map, seatCount, D?) → { total, viable, viableCount }` — enumerate, gate each, return the count passing B1∧B2.

- [ ] **Step 1: Write enumeration + viable count**

Add to `mockup/combat-calc/map-gate.js` (before `module.exports`):

```js
// region-level adjacency (any crossing edge → adjacent)
function regionAdjacency(map) {
  const adj = {};
  for (const r of map.regions) adj[r.id] = new Set();
  for (const e of map.edges) {
    const ra = map.sectors[e.a].regionId;
    const rb = map.sectors[e.b].regionId;
    if (ra !== rb) { adj[ra].add(rb); adj[rb].add(ra); }
  }
  const out = {};
  for (const k of Object.keys(adj)) out[k] = [...adj[k]];
  return out;
}

// MVP scope: enumerate seat = adjacent PAIR bindings when regions == 2×seats.
// Produces all ways to partition regions into `seatCount` adjacent pairs
// (perfect matching on the region-adjacency graph). Falls back to the
// single-region-per-seat identity binding when regions == seatCount.
function enumerateBindings(map, seatCount) {
  const regionIds = map.regions.map((r) => r.id);
  if (regionIds.length === seatCount) {
    // identity: one region per seat
    const a = {};
    map.regions.forEach((r) => { a[r.name] = [r.id]; });
    return [a];
  }
  if (regionIds.length !== 2 * seatCount) {
    throw new Error(`enumerateBindings MVP supports regions == seatCount or 2×seatCount, got ${regionIds.length} regions for ${seatCount} seats`);
  }
  const adj = regionAdjacency(map);
  const results = [];
  // perfect matching by recursive pairing of the first unmatched region
  function recurse(remaining, pairs) {
    if (remaining.length === 0) {
      const a = {};
      pairs.forEach((p, i) => { a[`seat${i + 1}`] = p; });
      results.push(a);
      return;
    }
    const [first, ...rest] = remaining;
    for (const other of rest) {
      if (adj[first].includes(other)) {
        recurse(rest.filter((x) => x !== other), [...pairs, [first, other]]);
      }
    }
  }
  recurse(regionIds, []);
  return results;
}

function viableBindings(map, seatCount, D) {
  const bindings = enumerateBindings(map, seatCount);
  const viable = bindings.filter((assignment) => gateReport(map, assignment, D).viableForThisBinding);
  return { total: bindings.length, viable, viableCount: viable.length };
}
```

Update the export line to:
```js
module.exports = { checkB1, checkB2, gateReport,
  regionAdjacency, enumerateBindings, viableBindings };
```

- [ ] **Step 2: Verify enumeration on the fixture (identity case)**

Run:
```bash
node -e "const {FIXTURE_MAP}=require('./mockup/combat-calc/map-data.js'); const {enumerateBindings,viableBindings}=require('./mockup/combat-calc/map-gate.js'); console.log('bindings',JSON.stringify(enumerateBindings(FIXTURE_MAP,5))); const v=viableBindings(FIXTURE_MAP,5); console.log('total',v.total,'viableCount',v.viableCount);"
```
Expected: the fixture has 5 regions and `seatCount` 5 → identity binding, `total 1`, `viableCount` 0 or 1 depending on the gate. (The 2×seatCount pairing path is exercised later by a 10-region authored map; this step confirms the identity path and that `viableBindings` runs.)

- [ ] **Step 3: Commit**

```bash
git add mockup/combat-calc/map-gate.js
git commit -m "feat(mockup): viable seat-binding enumeration

regionAdjacency + enumerateBindings (adjacent-pair perfect matching when
regions==2×seats, identity when regions==seats) + viableBindings (count of
bindings passing B1∧B2). This is the topology-tuning metric (spec §3).
Prototype only.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Battery sheet 14 + docs

**Files:**
- Modify: `mockup/combat-calc/battery.js` (add `mapViability` function; register in `SHEETS`)
- Modify: `mockup/combat-calc/README.md` (document sheet 14)
- Modify: `mockup/combat-calc/NOTES.md` (add sheet 14 verdict section)

**Interfaces:**
- Consumes: `battery.js` helpers `h`, `sub`, `row` (lines 12–17); `FIXTURE_MAP`, `loadMap`, `gateReport`, `viableBindings`.
- Produces: a new sheet printed by `node mockup/combat-calc/battery.js viability` (and in the full run).

- [ ] **Step 1: Add the require and the sheet function**

At the top of `battery.js`, alongside the existing requires (find the `require('./match.js')` / `require('./econ.js')` lines and add after them):

```js
const { FIXTURE_MAP } = require('./map-data.js');
const { loadMap } = require('./map-loader.js');
const { gateReport, viableBindings } = require('./map-gate.js');
```

Add the sheet function (place it just before the `const SHEETS = {` line at ~877):

```js
function mapViability() {
  h('SHEET 14 — MAP VIABILITY (terrain-cradle authoring gate)');
  sub('Loads a terrain-cradle map, derives realm mass/shield/cap from the');
  sub('sector graph, and runs the seat-sizing gate: B1 (no all-cap');
  sub('leadership) + B2 (no one-war-kill) + viable seat-binding count.');
  sub('Fixture is a 5-region 가안 — the user rules pass/fail in NOTES.md.');

  const { realms } = loadMap(FIXTURE_MAP);
  console.log('');
  sub('Per-realm derived state (all-cap):');
  row(['realm', 'cap', 'field', 'exits(door)', 'garr', 'fronts'], [10, 7, 7, 16, 6, 24]);
  for (const r of realms) {
    const doors = r.exits.map((e) => (e.cap === Infinity ? 'open' : e.cap)).join('/');
    const fronts = Object.entries(r.fronts).map(([n, g]) => `${n}:${g}`).join(' ');
    row([r.name, String(r.fieldCap), String(r.field), doors, String(r.garrisons), fronts], [10, 7, 7, 16, 6, 24]);
  }

  const g = gateReport(FIXTURE_MAP);
  console.log('');
  sub('Gate:');
  row(['check', 'pass', 'detail'], [8, 6, 40]);
  row(['B1', g.b1.pass ? 'YES' : 'NO',
    g.b1.pass ? 'no all-cap leadership' : `leadership: ${g.b1.offenders.join(', ')}`], [8, 6, 40]);
  row(['B2', g.b2.pass ? 'YES' : 'NO',
    g.b2.pass ? 'no one-war-kill' : g.b2.kills.map((k) => `${k.attacker}→${k.victim}`).join(', ')], [8, 6, 40]);

  const v = viableBindings(FIXTURE_MAP, 5);
  console.log('');
  sub(`Viable seat-bindings: ${v.viableCount} / ${v.total} (diversity metric — target set empirically)`);
  console.log('');
  sub('VERDICT: user rules in NOTES.md. This sheet is the C-loop loss —');
  sub('re-run after each topology/value tune of an authored map.');
}
```

Register it in the `SHEETS` object (line ~877) by adding `viability: mapViability`:

```js
const SHEETS = { myeongnyang, fortress, raid, delaying, grinding, feint, tempo,
  timeline, manpower, hegemony, settlement, tournament: tournamentSheet, economy,
  viability: mapViability };
```

- [ ] **Step 2: Run the sheet**

Run:
```bash
node mockup/combat-calc/battery.js viability
```
Expected: prints "SHEET 14 — MAP VIABILITY", a per-realm table (중원/서령/동평/남곡/북하 with cap/field/doors/garrisons/fronts), a gate table (B1/B2 YES or NO with detail), and a viable-binding count line. No crash.

- [ ] **Step 3: Confirm the full battery still runs**

Run:
```bash
node mockup/combat-calc/battery.js 2>&1 | tail -20
```
Expected: the full run completes through sheet 14 (map viability) at the end, exit 0. Earlier sheets unchanged.

- [ ] **Step 4: Document sheet 14 in README and NOTES**

In `mockup/combat-calc/README.md`, add to the sheet list (after the sheet 13 / economy entry):
```markdown
- **Sheet 14 — map viability** (`viability`): loads a terrain-cradle map
  (map-data.js), derives realm mass/shield/cap from the sector graph
  (map-loader.js), and runs the authoring gate (map-gate.js): B1 (no
  all-cap leadership), B2 (no one-war-kill), viable seat-binding count.
  The C-loop loss for map authoring.
```

In `mockup/combat-calc/NOTES.md`, append a new section:
```markdown
## Sheet 14 — map viability (2026-07-06, tooling)

The map-authoring validation gate (spec: docs/superpowers/specs/2026-07-06-
terrain-cradle-map-design.md). Tooling only — no map is sealed yet. The
5-region fixture in map-data.js is a first 가안 to exercise the loader and
gate; its B1/B2 result is a starting measurement, not a verdict. Authored
maps (canonical + 3 variants) come next via the C-loop: author → run this
sheet → tune topology/values → re-run.

### User verdicts
_(pending — first authored map)_
```

- [ ] **Step 5: Commit**

```bash
git add mockup/combat-calc/battery.js mockup/combat-calc/README.md mockup/combat-calc/NOTES.md
git commit -m "feat(mockup): battery sheet 14 — map viability gate

Sheet 14 loads the fixture map, prints per-realm derived state (cap/field/
doors/garrisons/fronts), runs the B1/B2 gate, and reports the viable
seat-binding count (the C-loop loss). Registered as 'viability' in SHEETS;
runs standalone and in the full battery. README + NOTES documented.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## After this plan

The validation tool is complete: `node mockup/combat-calc/battery.js viability` gates any authored map. **The MVP map pool authoring (spec §3: 1 canonical + 3 variants, 10-region) is the next work** — run as the C-loop using this sheet as the loss:
1. Author a 10-region map in `map-data.js` (extend the schema instance; regions=10, seatCount=5 exercises the adjacent-pair enumeration path).
2. `node mockup/combat-calc/battery.js viability` → read B1/B2 + viable count.
3. Tune topology levers (add central water, split center, adjust choke class) + sector values → re-run until the gate passes and the viable-binding count meets the diversity target.
4. Repeat for 3 sector-form variants.
5. Dynamic check: run the sheet-12 tournament on the canonical binding for closure rate / archetype spread.

That authoring loop is a separate work unit (values are loop outputs, not pre-authorable), and it stays inside the prototype — the game-code (`js/`) loading/rendering remains the separate code-entry gate the user scheduled for its own handoff session.

## Self-Review

- **Spec coverage:** §1 schema → Task 1 (map-data.js) + Task 2 (loader shapes). §3 static B1/B2 → Task 3; viable enumeration → Task 4; sheet 14 + map loader → Task 5; MVP pool authoring → deferred to "After this plan" (C-loop, values not pre-authorable — explicitly out of this plan's scope per spec §Scope). §4 gate B (auto) → Tasks 3–5; gates A/C/D/E/F (lint + manual) are authoring-time checks, applied during the "After this plan" C-loop, not tooling built here. Dynamic tournament reuse → noted in "After this plan" (reuses existing sheet 12, no new code).
- **Placeholder scan:** no TBD/TODO in code steps; every step has exact code or an exact command + expected output. The fixture cap targets carry a ±tolerance with an explicit adjust-and-re-run instruction (not a placeholder — a calibration step).
- **Type consistency:** `loadMap` returns `{ realms }`; consumed as `const { realms } = loadMap(...)` in Tasks 3/5. `gateReport` returns `{ b1, b2, viableForThisBinding, realms }`; sheet 14 reads `g.b1.pass`/`g.b1.offenders`/`g.b2.kills`. `viableBindings` returns `{ total, viable, viableCount }`; sheet reads `v.viableCount`/`v.total`. `checkB1` → `{pass, offenders}`, `checkB2` → `{pass, kills}` with `{victim, attacker}` — matches sheet's `k.attacker→k.victim`. Consistent.
