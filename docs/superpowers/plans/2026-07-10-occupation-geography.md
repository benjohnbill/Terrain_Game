# Occupation Geography (stage ①) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give L2 land transfer sector identity — named occupation, cession, and elimination over a live holdings model — with income and the military ceiling derived from actually-held sectors and ADR 0022 ripening applied per sector, superseding the 2026-07-10 realm-level accumulator.

**Architecture:** map-board builds a shared **sector world** (live sector copies + adjacency graph + static border set) and each map realm carries `holds` (Set of sector ids). tournament.js gets a **dual-mode guard**: when `realm.world` exists (map-built boards) the new sector paths run; the legacy fixture board (`makeBoard()` in tournament.js, no sectors) keeps its count-based paths byte-identical. Capture sites route through `captureSector` (frontier × value÷resistance score), transfer channels move real ids, income/cap derive from holdings, and the per-turn pulse ripens sector usable. The old accumulator (`applyCapGain`/`ripenCap`/`capPending`/`capRipeFlow`), `conquestUsableDrag`, and flat `capPerSector` wiring retire at the end.

**Tech Stack:** Node.js built-in test runner (`node --test`), CommonJS, no external deps. Design source: `docs/superpowers/specs/2026-07-10-occupation-geography-design.md`.

## Global Constraints

- **Dual-mode guard:** every new path is gated on `sectorMode(r)` (`!!(r.world && r.holds)`). The tournament.js fixture board has no sectors — its behavior must stay byte-identical through every task (pre-existing fixture tests must not change outcome).
- **NaN preservation (fixture):** legacy `realmIncome` is `r.yieldBase * r.usable` and fixture realms have no `yieldBase` → `NaN` treasury, which `doRecruit` treats as unconstrained (`billFor(add) > NaN` is `false`). Do NOT "fix" this with `?? 0` — a 0 treasury would block fixture recruiting and change every fixture outcome. Keep the legacy branch exactly as-is.
- **Ripening values (ADR 0022 placeholders, HARNESS 가안):** `usableEconomyStart: 0.5`, `usablePopStart: 0.6`, `sectorRipenPerTurn: 0.10`.
- **Coupling dial:** `capLandFrac: 0` default (control). Blend: `fieldCap = round((1−frac) × fieldCap0 + frac × ECON.nationalCap(heldSectors))`. With `frac 0` the ceiling stays the build value.
- **Resistance proxy (가안, NOT user-sealed):** border sector 3 : interior 1, ordering heuristic only — never enters `resolve()`. Ties break by sector id ascending (determinism, SPEC #4).
- **All bots share the occupation rule** (world rule, not brain judgment).
- **Determinism:** no `Date.now()`/`Math.random()` in the new code; only the run's seeded rng (not needed — all new choices are deterministic sorts).
- Tests: `npm test` (`node --test tests/*.test.js`). Baseline at plan start: **178/178 green**.
- Commit style: `feat(match-arc): ...`, trailer `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Retirement happens ONLY in Task 5. Until then the old growth wiring (default-inert: `capPerSector 0`, `conquestUsableDrag 0`) stays in place so the suite is green after every task.

---

### Task 1: Sector world + holdings on map-built boards

Build the shared sector world (live sector copies, hex-derived adjacency, static seat-border set) in map-board.js and attach `world` / `holds` / `fieldCap0` / `frontSectorIds` to every map realm. No tournament.js behavior change yet.

**Files:**
- Modify: `mockup/combat-calc/map-board.js` (module level near `weakestCrossing` ~line 60; `makeBoardFromMap` ~lines 69–148; `_api` export ~line 227)
- Create: `tests/occupation-geography.test.js`

**Interfaces:**
- Consumes: `deps.LOADER.sectorsOf(map, rid)` (sector objects `{ id, regionId, economyValue, populationValue, usableEconomy, usablePop, fortTier, garrison, mapUnits: [{q, r, terrainLayer}] }`).
- Produces: `buildSectorWorld(map, binding)` → `{ sectors: Map(id→sector copy), adj: Map(id→Set(id)), borderIds: Set(id) }` (exported in `_api`); realm fields `world` (shared ref), `holds` (Set of own ids), `fieldCap0` (number), `frontSectorIds` (`{neighborSeat: [ids]}`).

- [ ] **Step 1: Write the failing tests**

Create `tests/occupation-geography.test.js`:

```javascript
'use strict';
// Occupation geography stage ① (design 2026-07-10): sector-resolution land
// transfer. Task 1 — sector world + holdings on map-built boards.
const test = require('node:test');
const assert = require('node:assert');
const { CRADLE_MAP } = require('../mockup/combat-calc/map-gen.js');
const { viableBindings } = require('../mockup/combat-calc/map-gate.js');
const MB = require('../mockup/combat-calc/map-board.js');
const T = require('../mockup/combat-calc/tournament.js');

const BINDING = viableBindings(CRADLE_MAP, 5).viable[0];

test('buildSectorWorld: all 56 cradle sectors present with live copies', () => {
  const w = MB.buildSectorWorld(CRADLE_MAP, BINDING);
  assert.equal(w.sectors.size, 56);
  const s = w.sectors.get('r8_s0');
  assert.equal(s.regionId, 'r8');
  assert.equal(s.usableEconomy, 1);
  assert.equal(s.usablePop, 1);
});

test('buildSectorWorld: adjacency is symmetric and non-reflexive', () => {
  const w = MB.buildSectorWorld(CRADLE_MAP, BINDING);
  for (const [id, ns] of w.adj) {
    assert.ok(!ns.has(id), `${id} adjacent to itself`);
    for (const n of ns) assert.ok(w.adj.get(n).has(id), `${id}→${n} not symmetric`);
  }
});

test('buildSectorWorld: every sector has at least one neighbor', () => {
  const w = MB.buildSectorWorld(CRADLE_MAP, BINDING);
  for (const [id, ns] of w.adj) assert.ok(ns.size >= 1, `${id} isolated`);
});

test('buildSectorWorld: borderIds = sectors adjacent to another seat', () => {
  const w = MB.buildSectorWorld(CRADLE_MAP, BINDING);
  assert.ok(w.borderIds.size > 0);
  // spot-check: every border id has a cross-seat neighbor, every non-border has none
  const seatOf = {};
  for (const [seat, rids] of Object.entries(BINDING))
    for (const rid of rids)
      for (const [id, s] of w.sectors) if (s.regionId === rid) seatOf[id] = seat;
  for (const [id, ns] of w.adj) {
    const cross = [...ns].some((n) => seatOf[n] !== seatOf[id]);
    assert.equal(w.borderIds.has(id), cross, id);
  }
});

test('makeBoardFromMap: realms carry world/holds/fieldCap0/frontSectorIds', () => {
  const board = MB.makeBoardFromMap(CRADLE_MAP, BINDING);
  const world = board[0].world;
  assert.ok(world && world.sectors.size === 56);
  let total = 0;
  for (const r of board) {
    assert.ok(r.world === world, 'world is shared');
    assert.ok(r.holds instanceof Set && r.holds.size > 0);
    assert.equal(r.fieldCap0, r.fieldCap);
    assert.ok(r.frontSectorIds && Object.keys(r.frontSectorIds).length > 0);
    total += r.holds.size;
  }
  assert.equal(total, 56, 'holdings partition the map');
});

test('makeBoardFromMap: interior mirror equals holds minus border holds', () => {
  const board = MB.makeBoardFromMap(CRADLE_MAP, BINDING);
  for (const r of board) {
    const nonBorder = [...r.holds].filter((id) => !r.world.borderIds.has(id)).length;
    assert.equal(r.interior, nonBorder, r.name);
  }
});

test('fixture board (tournament makeBoard) has NO sector world', () => {
  const board = T.makeBoard();
  for (const r of board) {
    assert.equal(r.world, undefined);
    assert.equal(r.holds, undefined);
  }
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test tests/occupation-geography.test.js`
Expected: FAIL — `MB.buildSectorWorld is not a function`.

- [ ] **Step 3: Implement buildSectorWorld in map-board.js**

Add at module level, after `weakestCrossing` (~line 68). IMPORTANT: copy the axial-neighbor offset list from `map-gen.js`'s `NB` constant verbatim (grep `const NB` in map-gen.js) so sector adjacency uses the same hex grammar as map authoring:

```javascript
// ---- sector world (occupation geography stage ①, design 2026-07-10) ----
// Live sector copies + hex-derived adjacency + static seat-border set.
// borderIds is fixed at build (start-seat boundaries): the resistance
// proxy's border/interior split — a 가안 ordering heuristic, not combat.
const NB = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, -1], [-1, 1]]; // = map-gen NB
function buildSectorWorld(map, binding) {
  const sectors = new Map(); const hexOwner = new Map(); const seatOf = {};
  for (const [seat, rids] of Object.entries(binding))
    for (const rid of rids)
      for (const s of deps.LOADER.sectorsOf(map, rid)) {
        sectors.set(s.id, { ...s });     // live copy: usable state mutates in-match
        seatOf[s.id] = seat;
        for (const u of s.mapUnits) hexOwner.set(`${u.q},${u.r}`, s.id);
      }
  const adj = new Map([...sectors.keys()].map((id) => [id, new Set()]));
  for (const s of sectors.values())
    for (const u of s.mapUnits)
      for (const [dq, dr] of NB) {
        const o = hexOwner.get(`${u.q + dq},${u.r + dr}`);
        if (o && o !== s.id) { adj.get(s.id).add(o); adj.get(o).add(s.id); }
      }
  const borderIds = new Set();
  for (const [id, ns] of adj)
    for (const n of ns)
      if (seatOf[n] !== seatOf[id]) { borderIds.add(id); break; }
  return { sectors, adj, borderIds };
}
```

- [ ] **Step 4: Attach world/holds to realms in makeBoardFromMap**

Inside `makeBoardFromMap`, build the world once before the `Object.entries(binding).map(...)` (after `regionToSeat` is filled, ~line 73):

```javascript
  const world = buildSectorWorld(map, binding);
```

Then in the returned realm object literal (~line 130s, next to `capPending: 0, capRipeFlow: 0`), add:

```javascript
      world,                                  // shared sector world
      holds: new Set(secs.map((s) => s.id)),  // held sector ids (live ownership)
      fieldCap0: fieldCap,                    // frozen build ceiling (capLandFrac blend base)
      frontSectorIds: Object.fromEntries(
        Object.entries(frontSectors).map(([n, set]) => [n, [...set]])),
```

- [ ] **Step 5: Export buildSectorWorld**

In map-board.js `_api` (~line 227), add `buildSectorWorld` to the object.

- [ ] **Step 6: Run tests**

Run: `node --test tests/occupation-geography.test.js` → PASS (7 tests).
Then: `npm test` → Expected **185/185** (178 + 7). Pre-existing tests unaffected (new fields are inert additions).

- [ ] **Step 7: Commit**

```bash
git add mockup/combat-calc/map-board.js tests/occupation-geography.test.js
git commit -m "feat(match-arc): build sector world + holdings on map boards

Occupation geography stage 1 (design 2026-07-10): map-board builds a
shared sector world (live sector copies, hex-derived adjacency from the
map-gen NB grammar, static seat-border set) and every map realm carries
holds/fieldCap0/frontSectorIds. Inert additions; fixture board untouched.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Named capture — frontier × score, wired into the war machine

Replace anonymous `war.occupied += 1` with `captureSector` (geography fixes the frontier; a value÷resistance sort picks within it). Legacy fixture path keeps pure counting.

**Files:**
- Modify: `mockup/combat-calc/tournament.js` (`newWar` ~line 214; helpers after `shieldOf` ~line 166; the four capture sites in `warBattle` — siege ~lines 338/347, cascade ~lines 396–408; cascade→capital transition ~line 395; `trySettle` deepEnough ~line 523; exports ~line 1030s)
- Modify: `tests/occupation-geography.test.js`

**Interfaces:**
- Consumes: Task 1 realm fields (`world`, `holds`, `frontSectorIds`).
- Produces: `sectorMode(r)`, `syncCounts(r)`, `occupationFrontier(war, A, D)` → Set(id), `captureSector(war, A, D)` (all exported); `war.occupiedIds` array on every war (`newWar` initializes `occupiedIds: []`); invariant `war.occupied === war.occupiedIds.length` in sector mode.

- [ ] **Step 1: Write the failing tests**

Append to `tests/occupation-geography.test.js`:

```javascript
// ---- Task 2: named capture ----
function mapBoard() { return MB.makeBoardFromMap(CRADLE_MAP, BINDING); }
function warBetween(board) {
  // find two realms that share a front (frontSectorIds on both sides)
  for (const A of board) for (const D of board) {
    if (A === D) continue;
    if (A.frontG[D.name] !== undefined && (D.frontSectorIds[A.name] || []).length)
      return { A, D, war: T.newWar(A, D, 1) };
  }
  throw new Error('no adjacent pair');
}

test('newWar carries occupiedIds', () => {
  const b = mapBoard();
  const { war } = warBetween(b);
  assert.deepEqual(war.occupiedIds, []);
});

test('first capture takes a front border sector, by score, deterministically', () => {
  const b = mapBoard();
  const { A, D, war } = warBetween(b);
  const frontIds = D.frontSectorIds[A.name].filter((id) => D.holds.has(id));
  const w = D.world;
  const score = (id) => { const s = w.sectors.get(id);
    return (s.populationValue + s.economyValue) / (w.borderIds.has(id) ? 3 : 1); };
  const expected = [...frontIds].sort((x, y) => score(y) - score(x) || (x < y ? -1 : 1))[0];
  T.captureSector(war, A, D);
  assert.deepEqual(war.occupiedIds, [expected]);
  assert.ok(!D.holds.has(expected), 'captured sector left defender holds');
  assert.equal(war.occupied, 1, 'count mirror');
});

test('frontier grows by adjacency from the occupied set', () => {
  const b = mapBoard();
  const { A, D, war } = warBetween(b);
  T.captureSector(war, A, D);
  const frontier = T.occupationFrontier(war, A, D);
  for (const id of frontier) {
    assert.ok(D.holds.has(id), 'frontier is defender-held');
    const seeds = new Set([...war.occupiedIds, ...D.frontSectorIds[A.name]]);
    const touches = [...D.world.adj.get(id)].some((n) => seeds.has(n)) || seeds.has(id);
    assert.ok(touches, `${id} not reachable from occupied/front border`);
  }
});

test('captures never exceed holdings; defender can be eaten to empty', () => {
  const b = mapBoard();
  const { A, D, war } = warBetween(b);
  const start = D.holds.size;
  for (let i = 0; i < start + 5; i++) T.captureSector(war, A, D);
  assert.equal(war.occupiedIds.length, start);
  assert.equal(D.holds.size, 0);
  assert.equal(D.interior, 0, 'mirror synced');
});

test('fixture board: captureSector counts anonymously (legacy path)', () => {
  const b = T.makeBoard();
  const A = b[0], D = b[1];
  const war = T.newWar(A, D, 1);
  T.captureSector(war, A, D);
  assert.equal(war.occupied, 1);
  assert.deepEqual(war.occupiedIds, []);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test tests/occupation-geography.test.js`
Expected: new tests FAIL — `T.captureSector is not a function` (and `occupiedIds` undefined).

- [ ] **Step 3: Add the helpers**

In tournament.js, after `shieldOf` (~line 166), add:

```javascript
// ---- occupation geography (stage ①, design 2026-07-10) ----
// Governing principle: geography defines the set of what is possible;
// judgment chooses within it. The frontier (adjacency) is the invariant
// set; the score picks inside it. All bots share this rule (world rule).
const sectorMode = (r) => !!(r.world && r.holds);
const heldSectors = (r) => [...r.holds].map((id) => r.world.sectors.get(id));

// interior mirror: held sectors that are not start-seat border sectors.
function syncCounts(r) {
  if (!sectorMode(r)) return;
  r.interior = [...r.holds].filter((id) => !r.world.borderIds.has(id)).length;
}

// frontier = defender-held sectors adjacent to (this war's occupied set ∪
// the front's border sectors). Fallbacks (inherited fronts with no authored
// border ids): any D-held sector adjacent to an A-held one; then all holds.
function occupationFrontier(war, A, D) {
  const w = D.world; const out = new Set();
  const frontIds = (D.frontSectorIds && D.frontSectorIds[war.att]) || [];
  for (const id of frontIds) if (D.holds.has(id)) out.add(id);
  for (const id of war.occupiedIds ?? [])
    for (const n of w.adj.get(id) ?? []) if (D.holds.has(n)) out.add(n);
  if (!out.size && sectorMode(A))
    for (const id of D.holds)
      if ([...w.adj.get(id)].some((n) => A.holds.has(n))) out.add(id);
  if (!out.size) for (const id of D.holds) out.add(id);
  return out;
}

// score = value ÷ resistance. Resistance 3 (border) : 1 (interior) is a 가안
// ordering proxy mirroring the garrison start-state (900:300) — it never
// enters resolve(); combat difficulty is carried by real stocks elsewhere.
// Hook: replace with real per-sector defense when sector garrisons/forts
// land. Hook: attacker's read of value/resistance is truth for now — fog
// estimate consumption is a reserved seat.
function captureSector(war, A, D) {
  if (!sectorMode(D)) { war.occupied += 1; return; } // legacy fixture path
  const w = D.world;
  const cand = [...occupationFrontier(war, A, D)];
  if (!cand.length) return;
  const score = (id) => { const s = w.sectors.get(id);
    return (s.populationValue + s.economyValue) / (w.borderIds.has(id) ? 3 : 1); };
  cand.sort((a, b) => score(b) - score(a) || (a < b ? -1 : 1));
  const id = cand[0];
  D.holds.delete(id);
  (war.occupiedIds ??= []).push(id);
  war.occupied = war.occupiedIds.length;
  syncCounts(D);
}
```

- [ ] **Step 4: Initialize occupiedIds and rewire the four capture sites**

In `newWar` (~line 218), change `occupied: 0, raided: 0,` to:

```javascript
    occupied: 0, occupiedIds: [],  // sectors taken (count mirror + identities)
    raided: 0,
```

Siege sites (~line 338 brain, ~line 347 storm): replace `war.occupied += 1;` with `captureSector(war, A, D);` (keep the surrounding `war.stage = 'field';` and `D.interior = Math.max(0, D.interior);` lines as they are).

Cascade sites (~lines 396–400 brain, ~404–408 script): replace `war.occupied += 1; D.interior -= 1;` with:

```javascript
        captureSector(war, A, D);
        if (!sectorMode(D)) D.interior = Math.max(0, D.interior - 1);
```

Cascade→capital transition (~line 395): replace `if (D.interior <= 0) { war.stage = 'capital'; return null; }` with:

```javascript
    const landGone = sectorMode(D) ? D.holds.size === 0 : D.interior <= 0;
    if (landGone) { war.stage = 'capital'; return null; }
```

In `trySettle` (~line 523), replace `|| D.interior <= 0 ||` in `deepEnough` with `|| (sectorMode(D) ? D.holds.size === 0 : D.interior <= 0) ||`.

- [ ] **Step 5: Export the helpers**

Add `sectorMode, syncCounts, occupationFrontier, captureSector, heldSectors` to tournament.js `module.exports`.

- [ ] **Step 6: Run tests**

Run: `node --test tests/occupation-geography.test.js` → PASS (12 tests).
Then `npm test` → Expected **190/190** (185 + 5). Pre-existing cradle integration tests (plan-brain, cradle-tournament, force-geography, tournament-board, map-board, terrain-fidelity) now run captures through sector identity — outcome-affecting ONLY via which sectors return/transfer later; at this task nothing downstream consumes ids yet, and counts are preserved, so outcomes must be identical. If any pre-existing test changes outcome, STOP and report (count mirror bug).

- [ ] **Step 7: Commit**

```bash
git add mockup/combat-calc/tournament.js tests/occupation-geography.test.js
git commit -m "feat(match-arc): named sector capture via frontier x score

war.occupiedIds joins the count: capture picks from the frontier
(adjacency from occupied set + front border) by value/resistance
(border 3 : interior 1, ordering proxy only), deterministic ties by id.
Fixture boards keep anonymous counting (dual-mode guard).

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Transfer channels — cession pick, returns, possessor-keeps elimination

Move real sector ids through settlement, stall/white-peace returns, and elimination. Acquired sectors reset to the ADR 0022 usable floor. Legacy growth lines stay (inert at default dials) until Task 5.

**Files:**
- Modify: `mockup/combat-calc/tournament.js` (HARNESS block ~line 50s; `applySettlement` ~lines 557–588; stall return ~line 889; white peace ~line 906; `eliminate` ~lines 616–633; exports)
- Modify: `tests/occupation-geography.test.js`

**Interfaces:**
- Consumes: Task 2 helpers; `war.occupiedIds`.
- Produces: `acquireSector(r, id, H)` (exported); `returnOccupied(war, D)` (exported); HARNESS dials `usableEconomyStart: 0.5`, `usablePopStart: 0.6`, `sectorRipenPerTurn: 0.10`, `capLandFrac: 0`; `applySettlement` returns `{ ceded, indemnity }` where `ceded` = actual transferred sector count in sector mode.

- [ ] **Step 1: Write the failing tests**

Append to `tests/occupation-geography.test.js`:

```javascript
// ---- Task 3: transfer channels ----
test('acquireSector: resets usable to the ADR 0022 floor and joins holds', () => {
  const b = mapBoard();
  const { A, D, war } = warBetween(b);
  T.captureSector(war, A, D);
  const id = war.occupiedIds[0];
  T.acquireSector(A, id, T.HARNESS);
  const s = A.world.sectors.get(id);
  assert.ok(A.holds.has(id));
  assert.equal(s.usableEconomy, 0.5);
  assert.equal(s.usablePop, 0.6);
});

test('returnOccupied: sectors go back to the defender at pre-war usable', () => {
  const b = mapBoard();
  const { A, D, war } = warBetween(b);
  T.captureSector(war, A, D);
  const id = war.occupiedIds[0];
  T.returnOccupied(war, D);
  assert.ok(D.holds.has(id));
  assert.deepEqual(war.occupiedIds, []);
  assert.equal(D.world.sectors.get(id).usableEconomy, 1, 'no damage on return');
});

test('cession picks by value desc with connectivity to winner territory', () => {
  const b = mapBoard();
  const { A, D, war } = warBetween(b);
  for (let i = 0; i < 4; i++) T.captureSector(war, A, D);
  const ids = [...war.occupiedIds];
  const w = D.world;
  war.stage = 'cascade'; war.margin = 'decisive'; war.endTurn = 5;
  const res = T.applySettlement('preset', '표준', war, A, D, T.HARNESS, b);
  assert.ok(res.ceded >= 1 && res.ceded <= 4);
  const gained = ids.filter((id) => A.holds.has(id));
  assert.equal(gained.length, res.ceded);
  // every gained sector connects to (A territory ∪ other gained sectors)
  for (const id of gained) {
    const ok = [...w.adj.get(id)].some((n) => A.holds.has(n));
    assert.ok(ok, `${id} is an enclave`);
  }
  // remainder returned to D
  for (const id of ids) if (!gained.includes(id)) assert.ok(D.holds.has(id));
  assert.deepEqual(war.occupiedIds, []);
});

test('elimination: possessor keeps — third-party bites survive, remainder to eliminator', () => {
  const b = mapBoard();
  const { A, D, war } = warBetween(b);
  // find a third realm C also adjacent to D
  const C = b.find((r) => r !== A && r !== D
    && (D.frontSectorIds[r.name] || []).some((id) => D.holds.has(id)));
  assert.ok(C, 'binding has a third neighbor of D');
  const warC = T.newWar(C, D, 1);
  D.wars.push(war, warC); A.wars.push(war); C.wars.push(warC);
  T.captureSector(warC, C, D);           // C bites one sector
  const cBite = warC.occupiedIds[0];
  for (let i = 0; i < 3; i++) T.captureSector(war, A, D); // A bites three
  const remainder = [...D.holds];
  T.eliminate(D, A, b, T.HARNESS, war);
  assert.ok(C.holds.has(cBite), 'third-party keeps its bite');
  for (const id of remainder) assert.ok(A.holds.has(id), 'remainder to eliminator');
  assert.equal(D.holds.size, 0);
  assert.equal(D.alive, false);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test tests/occupation-geography.test.js`
Expected: FAIL — `T.acquireSector is not a function`.

- [ ] **Step 3: Add HARNESS dials + acquire/return helpers**

In the HARNESS block (next to the existing §5 dials), add:

```javascript
  // -- occupation geography (stage ①, design 2026-07-10). ADR 0022 usable
  //    placeholders (HARNESS 가안) + land-ceiling coupling strength. --
  usableEconomyStart: 0.5,   // acquired sector: economy usable start
  usablePopStart: 0.6,       // acquired sector: population usable start
  sectorRipenPerTurn: 0.10,  // +10pp per stable turn, per sector
  capLandFrac: 0,            // ceiling = (1-f)*fieldCap0 + f*derived (0 = control)
```

After `captureSector`, add:

```javascript
// any acquired sector integrates from the ADR 0022 usable floor — uniform
// across channels (cession, elimination share): undamaged, but lagged.
function acquireSector(r, id, H = HARNESS) {
  const s = r.world.sectors.get(id);
  s.usableEconomy = Math.min(s.usableEconomy, H.usableEconomyStart);
  s.usablePop = Math.min(s.usablePop, H.usablePopStart);
  r.holds.add(id);
  syncCounts(r);
}

// stall / white peace: occupied sectors return to the defender unchanged.
function returnOccupied(war, D) {
  if (!sectorMode(D)) { D.interior += war.occupied; return; }
  for (const id of war.occupiedIds) D.holds.add(id);
  war.occupiedIds = [];
  war.occupied = 0;
  syncCounts(D);
}
```

- [ ] **Step 4: Rewire applySettlement**

Replace the body between `const b = presetBundle(...)` and the `// indemnity` comment (~lines 560–578) with:

```javascript
  let ceded;
  if (sectorMode(D)) {
    // cession at sector identity: value desc + connectivity to winner land.
    const ids = war.occupiedIds ?? [];
    const cededN = Math.min(ids.length, Math.round(b.cession / H.sectorValue));
    const w = D.world;
    const val = (id) => { const s = w.sectors.get(id);
      return s.populationValue + s.economyValue; };
    const ranked = [...ids].sort((x, y) => val(y) - val(x) || (x < y ? -1 : 1));
    const chosen = [];
    while (chosen.length < cededN) {
      const next = ranked.find((id) => !chosen.includes(id)
          && [...w.adj.get(id)].some((n) => A.holds.has(n) || chosen.includes(n)))
        ?? ranked.find((id) => !chosen.includes(id)); // fallback keeps the count honest
      if (!next) break;
      chosen.push(next);
    }
    const transferredPop = chosen.reduce((s, id) => s + w.sectors.get(id).populationValue, 0);
    for (const id of chosen) acquireSector(A, id, H);
    for (const id of ids) if (!chosen.includes(id)) D.holds.add(id); // return remainder
    war.occupiedIds = []; war.occupied = 0;
    syncCounts(A); syncCounts(D);
    // register travels with the actually-transferred population share
    const dPop = heldSectors(D).reduce((s, x) => s + x.populationValue, 0);
    const poolShare = Math.round(D.pool * (transferredPop / Math.max(1, dPop + transferredPop)));
    D.pool -= poolShare; A.pool += poolShare;
    ceded = chosen.length;
  } else {
    // legacy fixture path (verbatim; growth lines inert at default dials)
    ceded = Math.min(war.occupied, Math.round(b.cession / H.sectorValue));
    A.interior += ceded;
    D.interior = Math.max(0, D.interior);
    const poolShare = Math.round(D.pool * (ceded / Math.max(1, D.interior + ceded + 2)));
    D.pool -= poolShare; A.pool += poolShare;
    applyCapGain(A, ceded * H.capPerSector, H);
    D.fieldCap = Math.max(2000, D.fieldCap - ceded * H.capPerSector);
    if (D.capPending > D.fieldCap) D.capPending = D.fieldCap;
    if (H.conquestUsableDrag > 0 && ceded > 0) {
      const freshFrac = ceded / Math.max(1, A.interior);
      A.usable = Math.max(0.3, A.usable - H.conquestUsableDrag * freshFrac);
    }
    D.interior += Math.max(0, war.occupied - ceded);
  }
```

(The following lines — indemnity, vassalage, `inheritFronts` gate, `endWar`, return object — stay as they are; they read `ceded` and `war`.)

- [ ] **Step 5: Rewire the two return sites and eliminate**

Stall return (~line 889): replace `D.interior += war.occupied;` with `returnOccupied(war, D);`.
White peace (~line 906): same replacement.

In `eliminate` (~line 616), after `releaseVassalsOf(D, realms);` replace the land/pool/capGain block (`A.interior += D.interior; ...` through the `applyCapGain(...)` line) with:

```javascript
  if (sectorMode(D)) {
    // possessor keeps: every war's bites go to that war's attacker;
    // the unoccupied remainder (incl. the capital's land) to the eliminator.
    for (const wv of D.wars) {
      if (wv.def !== D.name || !(wv.occupiedIds ?? []).length) continue;
      const att = realms.find((r) => r.name === wv.att);
      if (att && att.alive) for (const id of wv.occupiedIds) acquireSector(att, id, H);
      wv.occupiedIds = []; wv.occupied = 0;
    }
    for (const id of [...D.holds]) acquireSector(A, id, H);
    D.holds.clear(); syncCounts(D);
    A.pool += Math.round(D.pool * 0.5);
  } else {
    A.interior += D.interior; A.pool += Math.round(D.pool * 0.5);
    applyCapGain(A, (war && war.occupied) ? war.occupied * (H?.capPerSector ?? 0) : 0, H ?? HARNESS);
  }
```

(Keep the existing in-code comments about the legacy cap-without-land asymmetry with the legacy branch; note that in sector mode the asymmetry dissolves — land travels with the ceiling basis.)

- [ ] **Step 6: Export and run**

Add `acquireSector, returnOccupied` to exports.
Run: `node --test tests/occupation-geography.test.js` → PASS (16 tests).
Then `npm test` → Expected **194/194** (190 + 4). Watch the cradle integration suites: outcomes MAY shift here (transfers now move real sector values and returns are id-exact) — that is the designed fidelity change (spec §12: byte-identity with the pre-upgrade world is NOT preserved on map boards). Fixture suites must be unchanged. `tests/conquest-growth.test.js`'s fixture-based tests still pass (legacy branch verbatim). If a cradle test FAILS an assertion (not just a changed number inside a tolerance), report it in the task report with the assertion and actual value — the controller adjudicates whether the assertion was fidelity-coupled.

- [ ] **Step 7: Commit**

```bash
git add mockup/combat-calc/tournament.js tests/occupation-geography.test.js
git commit -m "feat(match-arc): sector-identity transfer channels

Cession picks occupied sectors by value desc under a connectivity
constraint (no enclaves); stall/white-peace returns are id-exact;
elimination is possessor-keeps (third-party bites survive, remainder
to the eliminator). Acquired sectors reset to the ADR 0022 usable
floor (0.5 econ / 0.6 pop) uniformly across channels; the register
travels with the actually-transferred population share.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Derived income + blended ceiling + per-sector ripening pulse

Income derives from held sectors (× realm war-wear usable); the ceiling blends toward the land-derived value by `capLandFrac`; the per-turn pulse ripens sector usable. Legacy fixture paths preserved exactly (including the NaN income quirk).

**Files:**
- Modify: `mockup/combat-calc/tournament.js` (`realmIncome` ~line 758; the M12/M13 pulse ~lines 916–920)
- Modify: `tests/occupation-geography.test.js`

**Interfaces:**
- Consumes: `heldSectors`, `sectorMode`, HARNESS dials from Task 3; `ECON` (already required by tournament.js for `draftBill`) — use `ECON.nationalCap(heldSectors(r))` for the derived ceiling.
- Produces: sector-mode `realmIncome`; pulse behavior: ripen sector usable then blend `r.fieldCap`.

- [ ] **Step 1: Write the failing tests**

Append to `tests/occupation-geography.test.js`:

```javascript
// ---- Task 4: derivations + ripening pulse ----
const ECON = require('../mockup/combat-calc/econ.js');

test('realmIncome derives from held sectors x sector usable x realm usable', () => {
  const b = mapBoard();
  const r = b[0];
  const expect = [...r.holds].map((id) => r.world.sectors.get(id))
    .reduce((s, x) => s + x.economyValue * x.usableEconomy, 0) * r.usable;
  assert.ok(Math.abs(T.realmIncome(r) - expect) < 1e-9);
  // at start (all usable 1.0) this equals the legacy yieldBase * usable
  assert.ok(Math.abs(expect - r.yieldBase * r.usable) < 1e-9);
});

test('capLandFrac 0: ceiling static through land loss; 1.0: tracks holdings', () => {
  const b = mapBoard();
  const { A, D, war } = warBetween(b);
  const d0 = D.fieldCap;
  T.captureSector(war, A, D); // D loses a sector into limbo
  // no full match needed — pin the blend formula the pulse must use
  const blend = (r, f) => Math.round((1 - f) * r.fieldCap0 + f * ECON.nationalCap(
    [...r.holds].map((id) => r.world.sectors.get(id))));
  assert.equal(blend(D, 0), d0, 'frac 0 is the frozen control');
  assert.ok(blend(D, 1) < d0, 'frac 1 feels the loss immediately');
});

test('acquired sector ripens +0.10/turn to 1.0 through the pulse', () => {
  const b = mapBoard();
  const { A, D, war } = warBetween(b);
  T.captureSector(war, A, D);
  const id = war.occupiedIds[0];
  T.acquireSector(A, id, T.HARNESS);
  war.occupiedIds = []; war.occupied = 0;
  const s = A.world.sectors.get(id);
  assert.equal(s.usablePop, 0.6);
  // run a short match on this board: the pulse must ripen the sector
  const assign = Object.fromEntries(b.map((r) =>
    [r.name, { archetype: 'shield-first', temperament: '표준' }]));
  T.runMatch(assign, { seed: 3, board: b, harness: { maxTurns: 4 } });
  assert.ok(s.usablePop > 0.6, `ripened, got ${s.usablePop}`);
  assert.ok(s.usablePop <= 1.0 + 1e-9);
});

test('limbo: an occupied (untransferred) sector pays income to neither side', () => {
  const b = mapBoard();
  const { A, D, war } = warBetween(b);
  const incomeBefore = T.realmIncome(A) + T.realmIncome(D);
  T.captureSector(war, A, D);
  const incomeAfter = T.realmIncome(A) + T.realmIncome(D);
  assert.ok(incomeAfter < incomeBefore, 'world income drops while contested');
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test tests/occupation-geography.test.js`
Expected: the income-derivation and limbo tests FAIL (realmIncome still `yieldBase * usable`, which ignores holds). The blend test passes already (it computes locally) — that is acceptable; it pins the formula the pulse must use.

- [ ] **Step 3: Rewire realmIncome**

Replace line ~758:

```javascript
const realmIncome = (r) => sectorMode(r)
  ? heldSectors(r).reduce((s, x) => s + x.economyValue * x.usableEconomy, 0) * r.usable
  : r.yieldBase * r.usable;   // legacy fixture path — keep NaN semantics verbatim
```

- [ ] **Step 4: Rewire the pulse**

Replace the M12/M13 pulse loop body (~lines 916–920) with:

```javascript
    for (const r of alive) {
      r.usable = Math.min(1, r.usable + H.usableRecovery);
      if (sectorMode(r)) {
        // per-sector integration ripening (ADR 0022 verbatim; each sector
        // on its own clock — the pooled-flow approximation is retired)
        for (const s of heldSectors(r)) {
          if (s.usableEconomy < 1) s.usableEconomy = Math.min(1, s.usableEconomy + H.sectorRipenPerTurn);
          if (s.usablePop < 1) s.usablePop = Math.min(1, s.usablePop + H.sectorRipenPerTurn);
        }
        // land-ceiling coupling blend (capLandFrac 0 = frozen control)
        if (H.capLandFrac > 0)
          r.fieldCap = Math.round((1 - H.capLandFrac) * r.fieldCap0
            + H.capLandFrac * ECON.nationalCap(heldSectors(r)));
      } else {
        ripenCap(r);   // legacy accumulator (retires in Task 5)
      }
      r.treasury = (r.treasury ?? 0) + realmIncome(r);  // Option B income accrual
    }
```

(Verify tournament.js already requires econ.js — `ECON.draftBill` at ~line 772; reuse that binding.)

- [ ] **Step 5: Run tests**

Run: `node --test tests/occupation-geography.test.js` → PASS (20 tests).
Then `npm test` → Expected **198/198** (194 + 4). Cradle-board suites may shift outcomes again (income now excludes limbo sectors + ripening applies); fixture suites unchanged. Same reporting rule as Task 3 Step 6.

- [ ] **Step 6: Commit**

```bash
git add mockup/combat-calc/tournament.js tests/occupation-geography.test.js
git commit -m "feat(match-arc): derive income + blended ceiling from holdings

Sector-mode income = sum(econ x usableEconomy) x realm usable (limbo
sectors pay neither side); the per-turn pulse ripens sector usable
(+10pp, per-sector clocks) and blends fieldCap toward the land-derived
value by capLandFrac (0 = frozen control). Fixture paths verbatim.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Retire the realm accumulator, drag lever, and flat capPerSector

Remove `applyCapGain`/`ripenCap`/`capPending`/`capRipeFlow`, `conquestUsableDrag`, and the `capPerSector` wiring (all inert at default dials since Task 3-4 kept them only on the legacy branch). Replace `tests/conquest-growth.test.js` with a supersession note in the ledger; keep the fixture-board settlement arithmetic count-based but growth-free.

**Files:**
- Modify: `mockup/combat-calc/tournament.js` (HARNESS dials ~line 50s; helpers ~lines 168–198; `mk` realm literal ~line 132; `applySettlement` legacy branch; `eliminate` legacy branch; pulse `else ripenCap(r)` branch; exports)
- Modify: `mockup/combat-calc/map-board.js` (realm literal `capPending: 0, capRipeFlow: 0` line)
- Delete: `tests/conquest-growth.test.js`
- Modify: `tests/occupation-geography.test.js` (control-invariance guard)

**Interfaces:**
- Consumes: everything above.
- Produces: no realm carries `capPending`/`capRipeFlow`; HARNESS no longer has `capPerSector`/`capStartFrac`/`capRipenPpPerTurn`/`conquestUsableDrag`; exports drop `applyCapGain, ripenCap`. `applySettlement` stays exported (used by remaining tests).

- [ ] **Step 1: Write the replacement control test FIRST**

Append to `tests/occupation-geography.test.js`:

```javascript
// ---- Task 5: control invariance after retirement ----
test('capLandFrac 0 control: two identical runs are deterministic and growth-free', () => {
  const run = () => {
    const board = mapBoard();
    const assign = Object.fromEntries(board.map((r) =>
      [r.name, { archetype: 'shield-first', temperament: '표준' }]));
    const rec = T.runMatch(assign, { seed: 11, board, harness: { maxTurns: 12 } });
    return { rec, caps: board.map((r) => r.fieldCap) };
  };
  const a = run(), b2 = run();
  assert.equal(a.rec.winner, b2.rec.winner);
  assert.deepEqual(a.caps, b2.caps);
  // frozen control: every ceiling still equals its build value
  const fresh = mapBoard();
  assert.deepEqual(a.caps, fresh.map((r) => r.fieldCap0));
});
```

Run: `node --test tests/occupation-geography.test.js` → this new test should PASS already (it pins behavior the retirement must not break). If it fails, STOP — Task 4 has a control leak.

- [ ] **Step 2: Delete the retired machinery**

- tournament.js HARNESS: delete the `capPerSector`, `capStartFrac`, `capRipenPpPerTurn`, `conquestUsableDrag` dial lines (keep the Task-3 occupation dials).
- Delete the `applyCapGain` and `ripenCap` function definitions (~lines 168–198) including their §5 comment block.
- `mk` (~line 132): delete `capPending: 0, capRipeFlow: 0,` line. map-board.js realm literal: delete the same line.
- `applySettlement` legacy branch: delete the `applyCapGain(...)`, `D.fieldCap = Math.max(2000, ...)`, `if (D.capPending > D.fieldCap) ...`, and the whole `conquestUsableDrag` block (4 statements). Keep the rest of the legacy branch (interior/pool arithmetic) verbatim.
- `eliminate` legacy branch: delete the `applyCapGain(...)` line and the now-stale cap-without-land comment block (the sector branch's possessor-keeps comment stays).
- Pulse: change `} else { ripenCap(r); }` to `}` (no legacy else body).
- Exports: remove `applyCapGain, ripenCap`.

- [ ] **Step 3: Delete the superseded test file**

```bash
git rm tests/conquest-growth.test.js
```

- [ ] **Step 4: Run the full suite**

Run: `npm test`
Expected: **188/188** (198 + 1 new control test − 11 retired). Every remaining pre-existing test green: the deleted machinery was inert at default dials, so no fixture outcome may change. If anything fails, STOP and report.

- [ ] **Step 5: Record the supersession in the SDD ledger**

Append to `.superpowers/sdd/progress.md` (inside this plan's block):

```
- Supersession note: the 2026-07-10 conquest-growth accumulator (applyCapGain/ripenCap/capPending/capRipeFlow), conquestUsableDrag, and flat capPerSector retired in favor of per-sector usable ripening + capLandFrac derivation (occupation-geography Task 5). Its 11 tests replaced. Not waste: it validated the ripening arithmetic + control gating, and its measurement exposed the flat-dial distortion that produced this design.
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor(match-arc): retire realm cap accumulator for per-sector ripening

applyCapGain/ripenCap/capPending/capRipeFlow, conquestUsableDrag, and
the flat capPerSector wiring retire — superseded by per-sector usable
ripening + the capLandFrac derivation (design 2026-07-10 s9). All were
inert at default dials; control invariance pinned by a new test.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: Instrument — frac-based growth sweep + deep diagnostics headline

Upgrade `runGrowthSweep` to sweep `capLandFrac` and put the deep diagnostics (denied-dominant count, coalition-overhang mean, conquest activity) on the standing report.

**Files:**
- Modify: `mockup/combat-calc/plan-battery.js` (`aggregate` ~lines 28–100; `runGrowthSweep` + `--growth` block from commit b32a630; exports)
- Modify: `tests/plan-battery.test.js` (aggregate additions)

**Interfaces:**
- Consumes: `runCradleTournament({..., harness: { capLandFrac: f }})`; record fields `r.panel.bucket`, `r.finalCheck.coalitionOverhang`, `r.eliminations`, `r.vassalDeals`.
- Produces: `aggregate()` additionally returns `deniedDominantCount` (number), `coalitionOverhangMean` (number|null over undecided), and keeps/exposes `eliminations`, `vassalDeals`; `runGrowthSweep(bindings, reps, seed, fracs = [0, 0.25, 0.5, 1.0])`.

- [ ] **Step 1: Write the failing test**

Append to `tests/plan-battery.test.js` (follow the file's existing fixture style — hand-built records):

```javascript
test('aggregate: deep diagnostics — denied-dominant count + overhang mean', () => {
  const recs = [
    { winner: 'A', tripTurn: 20, eliminations: 1, vassalDeals: 0,
      panel: { bucket: 'hegemon', sides: [] } },
    { winner: null, eliminations: 0, vassalDeals: 1,
      panel: { bucket: 'denied-dominant', sides: [] },
      finalCheck: { coalitionOverhang: 4000, leadershipShortfall: 100, candProj: 1 } },
    { winner: null, eliminations: 0, vassalDeals: 0,
      panel: { bucket: 'denied-dominant', sides: [] },
      finalCheck: { coalitionOverhang: 2000, leadershipShortfall: 200, candProj: 1 } },
  ];
  const agg = aggregate(recs);
  assert.equal(agg.deniedDominantCount, 2);
  assert.equal(agg.coalitionOverhangMean, 3000);
  assert.equal(agg.eliminations, 1);
  assert.equal(agg.vassalDeals, 1);
});
```

(Adjust the require/import header to match the existing test file's pattern; if the hand-built records need more fields for `aggregate` not to throw — e.g. `planStats` — copy the minimal shape from an existing aggregate test in that file.)

- [ ] **Step 2: Run to verify it fails**

Run: `node --test tests/plan-battery.test.js`
Expected: FAIL — `deniedDominantCount` undefined.

- [ ] **Step 3: Extend aggregate()**

In the panel loop (~line 50-60), count the bucket: add `let deniedDominant = 0;` beside the other accumulators and inside `if (r.panel)` add `if (r.panel.bucket === 'denied-dominant') deniedDominant++;`.
After the shortfall block (~line 70), add:

```javascript
  const overhangs = undecided
    .map((r) => r.finalCheck && r.finalCheck.coalitionOverhang)
    .filter((v) => typeof v === 'number');
```

In the return object add:

```javascript
    deniedDominantCount: deniedDominant,
    coalitionOverhangMean: overhangs.length
      ? overhangs.reduce((s, v) => s + v, 0) / overhangs.length : null,
```

and confirm `eliminations`/`vassalDeals` are already returned (they are accumulated as `elim`/`vassal` — if not in the return object, add `eliminations: elim, vassalDeals: vassal,`).

- [ ] **Step 4: Rewire runGrowthSweep + the --growth report**

Replace `runGrowthSweep` (from commit b32a630) with:

```javascript
// §5 re-measurement (occupation-geography stage ①): land-ceiling coupling
// strength (capLandFrac) vs the frozen control, same instrument as before.
// The frac-0 row IS the re-baseline vs the 2026-07-10 pre-upgrade control
// (decided 43.9 / 63.6 / 85.2) — compare before reading the sweep.
function runGrowthSweep(bindings, reps = 20, seed = 42, fracs = [0, 0.25, 0.5, 1.0]) {
  const boardArms = {
    ctrl:    BOARD_GAAN,
    fgM9on:  FG_BOARD_GAAN,
    fgM9off: { ...FG_BOARD_GAAN, m9Reserve: false },
  };
  const out = {};
  for (const f of fracs) {
    out[`frac${f}`] = {};
    for (const [bid, gaan] of Object.entries(boardArms))
      out[`frac${f}`][bid] = aggregate(runCradleTournament({
        map: CRADLE_MAP, bindings, reps, seed, boardGaan: gaan,
        harness: { capLandFrac: f } }));
  }
  return out;
}
```

In the `--growth` main block, drop the `--drag-cap` handling (lever retired) and extend the per-cell print with the deep line:

```javascript
        console.log(`    dd ${agg.deniedDominantCount} · overhang ${agg.coalitionOverhangMean === null ? '—' : Math.round(agg.coalitionOverhangMean)} · elim ${agg.eliminations} · vassal ${agg.vassalDeals}`);
```

(Keep the existing timing-ruler lines and the `stomp(≤8)` derivation unchanged, with rows now labeled `frac0` … `frac1`.)

- [ ] **Step 5: Run tests + smoke**

Run: `node --test tests/plan-battery.test.js` → PASS.
Then `npm test` → Expected **189/189** (188 + 1).
Smoke: `node mockup/combat-calc/plan-battery.js --growth --quick 2>&1 | head -20` → four `frac*` blocks, each cell printing the timing line + the `dd/overhang/elim/vassal` line. Include the real output head in the report.

- [ ] **Step 6: Commit**

```bash
git add mockup/combat-calc/plan-battery.js tests/plan-battery.test.js
git commit -m "feat(match-arc): frac-based growth sweep + deep-diagnostics headline

runGrowthSweep sweeps capLandFrac (0/0.25/0.5/1.0) across the three
board arms; aggregate() gains deniedDominantCount, coalitionOverhangMean
(undecided), and exposes conquest activity — the denied-dominant wall
and the coalition term are now standing instruments, not hand queries.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## After implementation (controller close-out — not TDD tasks)

1. **Re-baseline + sweep (the pass's validation).** `node mockup/combat-calc/plan-battery.js --growth` (full reps). FIRST read `frac0` vs the recorded 2026-07-10 pre-upgrade control (decided 43.9 / 63.6 / 85.2; envelope 29.0 / 34.8 / 55.7; stored in `.superpowers/sdd/progress.md` §5 block and `scratchpad` sweep files) — the drift is the fidelity upgrade alone. THEN read the sweep against the new control: core1822 up, envelope toward ≥~50%, stomp ~0%, fgM9off median not pushed below core, and **does denied-dominant re-erect as frac rises?** Record before/after.
2. **Docs (order (a) preserved):** after measurement — RULINGS entries (occupation model L0-L1 + measured frac read), ADR 0029 formal write-up (user seal on wording before the DOMAIN_MAP edit), SPEC promotion proposal for the geography/judgment principle (Tier-3, user), match-arc INDEX §5 refresh, SYNC-DEBT + QUICKREF, term-inventory patches. The dominance-gate recalibration decision is taken WITH the user only if the measurement shows the wall re-erecting.

## Out of scope (do NOT implement here)

Capital package wiring (stage ② — `docs/features/capital/`); located capital / rump state; dominance-gate changes; commit economy / surge SIZE axis; per-sector garrisons & forts (resistance stays the 3:1 가안 proxy); occupation scorch; development lever; fog-estimate consumption in the occupation score (hook comment only); bundle-pricing fidelity (warEndState still prices `occValue` by count × `H.sectorValue` — a recorded simplification).
