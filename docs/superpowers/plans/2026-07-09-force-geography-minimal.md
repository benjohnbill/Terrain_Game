# Force-Geography (b) v1 (최소) — L2 Harness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the sealed force-geography v1 (최소) design (FG-①…⑩) into the L2 combat/economy harness so a tournament run measures uneven terrain-fort defense contested by a reactive reserve, and reports whether weak fronts become breakable and the freeze eases.

**Architecture:** All work is in the L2 harness (`mockup/combat-calc/`); the shipping game (`js/`) is untouched. The sealed 4-layer combat formula (`engine.js resolve()`) is UNCHANGED — it already supports terrain/fort/reserve inputs natively; we only feed it non-uniform values and add a reactive-reserve computation + measurement. A force-geography run is an opt-in board configuration (`gaan`), so the sealed uniform-walls board and its tests stay green.

**Tech Stack:** Node.js, `node --test` (built-in runner, `tests/*.test.js`), CommonJS modules. No new dependencies.

## Global Constraints

- **Do NOT edit `engine.js resolve()` / `DIALS`** — U3 is sealed (FG §Settled, ADR 0022 / FORMULA D6). Reserve support (`defender.reserveStock` fights ×0.5 via `DIALS.reserve.marchEffect`), terrain/fort ladders, and `reserveAwaken()` already exist; consume them, never redefine.
- **Do NOT mutate `BOARD_GAAN`** — the sealed uniform start-state and its tests (`map-board.test.js`, start-state seals 2026-07-07) depend on `startFort: 'walls'` uniform and `startFortByClass` absent. Force-geography is a NEW opt-in gaan.
- **Harness values are 가안 (sweepable, NOT seal candidates)** — new dials (`FG_FORT_BY_CLASS`, reserve points, sweep flags) go in the harness-tier `BOARD_GAAN`/`BOT` blocks with a comment marking them non-sealable, per the file's existing dial-hygiene note (`map-board.js:1-7`, `tournament.js:22-29`).
- **Fort mapping (FG-②, L2-measured +33%)**: `open→fieldworks`, `forest/hills/river→walls`, `pass/strait→fortress`. Copy verbatim.
- **Test runner:** `npm test` runs `node --test tests/*.test.js`. Test files use `const { test } = require('node:test'); const assert = require('node:assert');`.
- **Commit after every green task.** Conventional commits; end bodies with the repo's `Co-Authored-By` trailer.

## File Structure

| File | Responsibility | Change |
|---|---|---|
| `mockup/combat-calc/map-board.js` | board construction from map; gaan | ADD `FG_FORT_BY_CLASS` + `FG_BOARD_GAAN` (startFortByClass + reserve/sweep flags) |
| `mockup/combat-calc/tournament.js` | match loop, war machine, bot policy | reserve wiring (M9 fill + field-army repositioning), stop fort re-equalization, U4 pickTarget, per-front defense-power for the panel |
| `mockup/combat-calc/match.js` | panel arithmetic | `matchPanel` gains boosted shieldShare + within-realm defense variance from per-front power |
| `mockup/combat-calc/plan-battery.js` | measurement battery | `aggregate` reads new panel fields; a force-geography arm with M9 on/off sweep |
| `tests/force-geography.test.js` | new | unit + integration tests for every task below |

Reserve/attacker logic and per-front power all live in `tournament.js` because they read the realm's live front state (`frontG`/`fortAt`/`frontClass`) — they change together and belong together. Panel math stays in `match.js` (pure, fixture-testable).

---

### Task 1: Force-geography board gaan (U1 terrain envelope, FG-②)

**Files:**
- Modify: `mockup/combat-calc/map-board.js` (add exports near `BOARD_GAAN`, ~line 42)
- Test: `tests/force-geography.test.js` (create)

**Interfaces:**
- Consumes: `makeBoardFromMap(map, binding, gaan)` (existing); the dormant seam `fortAt[nbr] = gaan.startFortByClass ? (gaan.startFortByClass[soft.cls] ?? gaan.startFort) : gaan.startFort` (map-board.js:98).
- Produces: `FG_FORT_BY_CLASS` (object), `FG_BOARD_GAAN` (object spread from `BOARD_GAAN` + `startFortByClass`). Later tasks read `FG_BOARD_GAAN`.

- [ ] **Step 1: Write the failing test**

```js
// tests/force-geography.test.js
'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const { CRADLE_MAP, CRADLE_BINDING } = require('../mockup/combat-calc/map-gen.js');
const { makeBoardFromMap, FG_BOARD_GAAN, FG_FORT_BY_CLASS } = require('../mockup/combat-calc/map-board.js');

test('FG_FORT_BY_CLASS is the sealed FG-② mapping', () => {
  assert.deepStrictEqual(FG_FORT_BY_CLASS, {
    open: 'fieldworks', forest: 'walls', hills: 'walls',
    river: 'walls', pass: 'fortress', strait: 'fortress',
  });
});

test('FG board differentiates fort by front crossing class', () => {
  const realms = makeBoardFromMap(CRADLE_MAP, CRADLE_BINDING, FG_BOARD_GAAN);
  const tiers = new Set();
  for (const r of realms)
    for (const [nbr, cls] of Object.entries(r.frontClass))
      assert.strictEqual(r.fortAt[nbr], FG_FORT_BY_CLASS[cls] ?? 'walls',
        `${r.name}→${nbr} (${cls}) fort matches mapping`),
      tiers.add(r.fortAt[nbr]);
  assert.ok(tiers.size >= 2, `varied fort tiers, got ${[...tiers]}`);
});

test('the default board stays uniform walls (sealed start-state untouched)', () => {
  const realms = makeBoardFromMap(CRADLE_MAP, CRADLE_BINDING); // BOARD_GAAN default
  for (const r of realms)
    for (const f of Object.values(r.fortAt)) assert.strictEqual(f, 'walls');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/force-geography.test.js`
Expected: FAIL — `FG_BOARD_GAAN`/`FG_FORT_BY_CLASS` are `undefined` (not exported).

- [ ] **Step 3: Add the mapping and gaan to `map-board.js`**

After the `BOARD_GAAN` object (map-board.js:~42), add:

```js
// Force-geography v1 (최소) — U1 terrain envelope (FG-②, L2-measured +33%).
// HARNESS 가안, opt-in: the sealed uniform-walls BOARD_GAAN is untouched.
const FG_FORT_BY_CLASS = {
  open: 'fieldworks',
  forest: 'walls', hills: 'walls', river: 'walls',
  pass: 'fortress', strait: 'fortress',
};
const FG_BOARD_GAAN = { ...BOARD_GAAN, startFortByClass: FG_FORT_BY_CLASS };
```

Add both to the `_api` export object (map-board.js:210):

```js
const _api = { makeBoardFromMap, BOARD_GAAN, FG_BOARD_GAAN, FG_FORT_BY_CLASS,
  runCradleTournament, watchFlags, pairFlags, weakestCrossing };
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/force-geography.test.js`
Expected: PASS (3/3).

- [ ] **Step 5: Run the full suite (no regressions)**

Run: `npm test`
Expected: all prior tests still PASS (BOARD_GAAN untouched).

- [ ] **Step 6: Commit**

```bash
git add mockup/combat-calc/map-board.js tests/force-geography.test.js
git commit -m "feat(force-geography): U1 terrain-envelope board gaan (FG-②)"
```

---

### Task 2: Cap in-match fort upgrades at the terrain ceiling (stop re-equalization, FG-③/⑨)

**Files:**
- Modify: `mockup/combat-calc/tournament.js` `peacePrimary` fort action (tournament.js:618-624)
- Test: `tests/force-geography.test.js`

**Interfaces:**
- Consumes: a realm `me` with `fortAt`, `frontClass`, and a board gaan carrying `startFortByClass`. The realm does not currently know its gaan; pass the terrain ceiling via the realm object.
- Produces: `me.fortCeil` (object: front → max fort tier) set at board build; `peacePrimary` never upgrades a front's fort above `me.fortCeil[front]`.

- [ ] **Step 1: Write the failing test**

```js
// tests/force-geography.test.js (append)
const T = require('../mockup/combat-calc/tournament.js');

test('FG board sets fortCeil = the terrain-class fort tier per front', () => {
  const realms = makeBoardFromMap(CRADLE_MAP, CRADLE_BINDING, FG_BOARD_GAAN);
  for (const r of realms)
    for (const [nbr, cls] of Object.entries(r.frontClass))
      assert.strictEqual(r.fortCeil[nbr], FG_FORT_BY_CLASS[cls] ?? 'walls');
});

test('peacePrimary does not upgrade fort above the terrain ceiling', () => {
  // an open front (ceiling fieldworks) already at its ceiling stays there
  const me = {
    archetype: 'shield-first', _turn: 5, seatType: 'flank',
    frontG: { X: 100, Y: 900 }, frontCap: { X: 900, Y: 900 },
    fortAt: { X: 'fieldworks', Y: 'walls' }, fortCeil: { X: 'fieldworks', Y: 'fortress' },
    capitalGarrison: 1500, pool: 5000, field: 0, fieldCap: 5000,
    treasury: 1e9, usable: 1, truce: {}, staging: false, wars: [],
  };
  const record = { presetOffers: [], regens: 0, raids: 0 };
  T.peacePrimary(me, [me], null, record);
  assert.strictEqual(me.fortAt.X, 'fieldworks', 'open front NOT pushed past fieldworks');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/force-geography.test.js`
Expected: FAIL — `fortCeil` undefined; `peacePrimary` upgrades X to `walls`.

- [ ] **Step 3: Set `fortCeil` at board build**

In `map-board.js makeBoardFromMap`, inside the returned realm object (after `frontClass`/`frontDoor`, ~line 117), add:

```js
      frontClass, frontDoor,          // border crossing class + door per front
      fortCeil: gaan.startFortByClass
        ? Object.fromEntries(Object.entries(frontClass).map(
            ([n, cls]) => [n, gaan.startFortByClass[cls] ?? gaan.startFort]))
        : Object.fromEntries(Object.keys(frontG).map((n) => [n, 'fortress'])),
```

(Non-FG boards keep the legacy ceiling `fortress`, preserving current upgrade behavior.)

- [ ] **Step 4: Cap the fort upgrade in `peacePrimary`**

In `tournament.js` `peacePrimary`, the `fort` action (tournament.js:621-624) currently is:

```js
      const front = Object.entries(me.fortAt)
        .filter(([, f]) => BOT.fortLadder.indexOf(f) < BOT.fortLadder.indexOf('fortress'))
        .sort(([a], [b]) => (me.frontG[a] ?? 0) - (me.frontG[b] ?? 0))[0];
      if (front) { me.fortAt[front[0]] = BOT.fortLadder[BOT.fortLadder.indexOf(front[1]) + 1]; return 'fort'; }
```

Replace the `.filter` predicate to respect the per-front ceiling:

```js
      const ceilOf = (n) => (me.fortCeil && me.fortCeil[n]) || 'fortress';
      const front = Object.entries(me.fortAt)
        .filter(([n, f]) => BOT.fortLadder.indexOf(f) < BOT.fortLadder.indexOf(ceilOf(n)))
        .sort(([a], [b]) => (me.frontG[a] ?? 0) - (me.frontG[b] ?? 0))[0];
      if (front) { me.fortAt[front[0]] = BOT.fortLadder[BOT.fortLadder.indexOf(front[1]) + 1]; return 'fort'; }
```

- [ ] **Step 5: Run tests to verify pass + no regressions**

Run: `node --test tests/force-geography.test.js` → PASS.
Run: `npm test` → all PASS (non-FG boards get `fortCeil: fortress` everywhere, so behavior is unchanged).

- [ ] **Step 6: Commit**

```bash
git add mockup/combat-calc/map-board.js mockup/combat-calc/tournament.js tests/force-geography.test.js
git commit -m "feat(force-geography): cap in-match fort at terrain ceiling (FG-③/⑨)"
```

---

### Task 3: M9 tactical-fill reserve into the siege (FG-⑩ tactical layer)

**Files:**
- Modify: `mockup/combat-calc/tournament.js` — `BOT` dials + `warBattle` siege stage (tournament.js:275-315) + board build (M9 sweep flag)
- Test: `tests/force-geography.test.js`

**Interfaces:**
- Consumes: `reserveAwaken(provinceStock, points)` from `engine.js`; the siege `defender` spec accepts `reserveStock` (engine multiplies by `DIALS.reserve.marchEffect = 0.5`).
- Produces: `m9Fill(D, front)` helper → number of bodies rushed; controlled by `gaan.m9Reserve` (boolean, swept). When off, `reserveStock: 0`.

- [ ] **Step 1: Write the failing test**

```js
// tests/force-geography.test.js (append)
const { DIALS } = require('../mockup/combat-calc/engine.js');

test('m9Fill pulls from other fronts + interior at the reserve rate, off when disabled', () => {
  const D = {
    frontG: { A: 200, B: 800, C: 600 }, interiorGarrison: 300,
    m9Reserve: true,
  };
  // engine reserveAwaken: floor(provinceStock * points*0.125); BOT.reservePoints=4 → 50%
  // provinceStock for front A = other fronts (800+600) + interior (300) = 1700
  assert.strictEqual(T.m9Fill(D, 'A'), Math.floor(1700 * 0.5));
  assert.strictEqual(T.m9Fill({ ...D, m9Reserve: false }, 'A'), 0);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/force-geography.test.js`
Expected: FAIL — `T.m9Fill` is not a function.

- [ ] **Step 3: Add the `reservePoints` dial and `m9Fill` helper**

In `tournament.js` `BOT` block (after `siegeCommit: 8, fieldCommit: 14,`, ~line 83) add:

```js
  reservePoints: 4,   // FG-⑩ M9 fill: reserveAwaken points → 50% of adjacent stock
                      // (engine then applies ×0.5 marchEffect). HARNESS 가안, swept.
```

Near the other war helpers (after `poolBleed`, ~line 410) add — note it uses `reserveAwaken` from the engine import (already destructured at top: `const { DIALS, resolve } = require('./engine')` → add `reserveAwaken`):

```js
// FG-⑩ M9 tactical fill: route-connected stock rushes the attacked front.
// The L2 board has no per-sector routing, so "province stock" is abstracted
// as the realm's OTHER fronts' garrison + interior garrison. Engine applies
// the ×0.5 march penalty; this returns the awakened body count.
const RESERVE = require('./engine.js');
function m9Fill(D, front) {
  if (!D.m9Reserve) return 0;
  const others = Object.entries(D.frontG)
    .reduce((s, [n, g]) => s + (n === front ? 0 : g), 0);
  const interior = (D.interiorGarrison ?? 0);
  return RESERVE.reserveAwaken(others + interior, BOT.reservePoints);
}
```

Change the top import to include `reserveAwaken`:

```js
const { DIALS, resolve, reserveAwaken } = require('./engine');
```

and use `reserveAwaken` directly (drop the redundant `RESERVE` require):

```js
function m9Fill(D, front) {
  if (!D.m9Reserve) return 0;
  const others = Object.entries(D.frontG)
    .reduce((s, [n, g]) => s + (n === front ? 0 : g), 0);
  return reserveAwaken(others + (D.interiorGarrison ?? 0), BOT.reservePoints);
}
```

Add `m9Fill` to `module.exports` (tournament.js:923-926).

- [ ] **Step 4: Pass `reserveStock` into the siege defender**

In `warBattle` siege stage, both the brained and script `resolve` calls for the siege defender (tournament.js:287-288 and :301-302 and :308-309) take `defender: { stock: g, commit: BOT.siegeCommit, ... }`. Add `reserveStock: m9Fill(D, front)` to each siege defender spec. Example (the brained branch, :287-289):

```js
      const spec = { attacker: { stock: A.field, commit: BOT.siegeCommit },
        defender: { stock: g, commit: BOT.siegeCommit, starvationStage: siStage(war.starve),
          reserveStock: m9Fill(D, front) },
        ...site, defenderIsolated: D.field < 400 };
```

Apply the same `reserveStock: m9Fill(D, front)` addition to the two script-bot siege `resolve` calls (Swift storm :301, DP :308).

- [ ] **Step 5: Carry `m9Reserve` + `interiorGarrison` onto the realm at board build**

In `map-board.js makeBoardFromMap` returned realm, add:

```js
      interiorGarrison: interior * gaan.interiorGarrison,
      m9Reserve: gaan.m9Reserve ?? false,
```

and in `FG_BOARD_GAAN` (Task 1) add `m9Reserve: true` so FG runs use the fill by default; the sweep (Task 7) toggles it.

```js
const FG_BOARD_GAAN = { ...BOARD_GAAN, startFortByClass: FG_FORT_BY_CLASS, m9Reserve: true };
```

- [ ] **Step 6: Run tests + full suite**

Run: `node --test tests/force-geography.test.js` → PASS.
Run: `npm test` → PASS (non-FG boards have `m9Reserve` falsy → `reserveStock: 0` → engine unchanged).

- [ ] **Step 7: Commit**

```bash
git add mockup/combat-calc/tournament.js mockup/combat-calc/map-board.js tests/force-geography.test.js
git commit -m "feat(force-geography): M9 tactical-fill reserve into siege (FG-⑩)"
```

---

### Task 4: Field-army operational repositioning by deficit (FG-⑤/⑥/⑩)

**Files:**
- Modify: `mockup/combat-calc/tournament.js` — `mainDefWar` selection in `runMatch` (tournament.js:756-764)
- Test: `tests/force-geography.test.js`

**Interfaces:**
- Consumes: a realm's defensive wars, each `war.att`; the realm's `frontG`/`fortAt`/`frontClass`; `DIALS.terrain`/`DIALS.fort`.
- Produces: `frontDefense(D, front)` (judged-free defense power of a front's standing garrison = garrison × terrain × fort) and `pickMainDefWar(realm, wars, realms)` → the war whose front has the largest deficit (attacker field − front defense). Replaces the "biggest attacker field" heuristic.

**Rationale:** first-blow-vs-raw-garrison is already modeled (siege stage = garrison only; the field army enters at the field stage). This task only changes WHICH defensive war the one field army serves — from "biggest enemy" to "biggest deficit" (FG-⑥ destination, whole-realm value ⇒ deficit decides).

- [ ] **Step 1: Write the failing test**

```js
// tests/force-geography.test.js (append)
test('frontDefense = garrison × terrain × fort', () => {
  const D = { frontG: { P: 1000 }, fortAt: { P: 'fortress' }, frontClass: { P: 'pass' } };
  // pass terrain 2.0 × fortress 2.4 × 1000 = 4800
  assert.strictEqual(T.frontDefense(D, 'P'), 1000 * DIALS.terrain.pass * DIALS.fort.fortress);
});

test('pickMainDefWar picks the front with the largest deficit (softest, most-pressed)', () => {
  const plains = { name: 'ATK1', field: 3000 };
  const passer = { name: 'ATK2', field: 3000 };
  const D = {
    name: 'DEF', frontG: { ATK1: 500, ATK2: 500 },
    fortAt: { ATK1: 'fieldworks', ATK2: 'fortress' },
    frontClass: { ATK1: 'open', ATK2: 'pass' },
  };
  const realms = [plains, passer, D];
  const wars = [{ att: 'ATK1', def: 'DEF', stage: 'field' }, { att: 'ATK2', def: 'DEF', stage: 'field' }];
  // ATK1 (plains, weak fort) deficit >> ATK2 (pass, fortress) → field army defends ATK1
  assert.strictEqual(T.pickMainDefWar(D, wars, realms).att, 'ATK1');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/force-geography.test.js`
Expected: FAIL — `T.frontDefense`/`T.pickMainDefWar` not functions.

- [ ] **Step 3: Add the helpers**

In `tournament.js`, near the war helpers, add:

```js
// FG-⑤ standing-defense power of a front (garrison × terrain × fort), used
// to score deficits. No commit/reserve/erosion — the raw first-blow wall.
function frontDefense(D, front) {
  const cls = (D.frontClass && D.frontClass[front]) || 'hills';
  const terr = DIALS.terrain[combatFromBorderClass(cls).terrain] ?? 1;
  const fort = DIALS.fort[(D.fortAt && D.fortAt[front]) || 'walls'];
  return (D.frontG[front] ?? 0) * terr * fort;
}

// FG-⑥ field-army destination: the one mobile army serves the defensive war
// whose front has the largest deficit (attacker field − standing defense).
// Whole-realm value ⇒ deficit alone decides (fight-or-fold is elsewhere).
function pickMainDefWar(realm, wars, realms) {
  let best = null, bestDef = -Infinity;
  for (const w of wars) {
    const att = realms.find((r) => r.name === w.att);
    const front = realm.frontG[w.att] !== undefined ? w.att : Object.keys(realm.frontG)[0];
    const deficit = (att ? att.field : 0) - frontDefense(realm, front);
    if (deficit > bestDef) { bestDef = deficit; best = w; }
  }
  return best;
}
```

Export both in `module.exports`.

- [ ] **Step 4: Use `pickMainDefWar` in `runMatch`**

Replace the `mainDefWar` computation (tournament.js:756-764):

```js
    const mainDefWar = {};
    for (const r of alive) {
      const defs = r.wars.filter((w) => w.def === r.name && w.stage !== 'over');
      if (defs.length) mainDefWar[r.name] = pickMainDefWar(r, defs, realms);
    }
```

- [ ] **Step 5: Run tests + full suite**

Run: `node --test tests/force-geography.test.js` → PASS.
Run: `npm test` → PASS. (Note: `tournament-board.test.js` may assert the old biggest-field selection; if a test encodes that heuristic, update it to the deficit rule and note the change in the commit. Only adjust tests that assert the internal heuristic, never behavioural end-to-end invariants.)

- [ ] **Step 6: Commit**

```bash
git add mockup/combat-calc/tournament.js tests/force-geography.test.js
git commit -m "feat(force-geography): field-army repositions by front deficit (FG-⑥)"
```

---

### Task 5: U4 attacker targets the softest FRONT (FG-⑦)

**Files:**
- Modify: `mockup/combat-calc/tournament.js` `pickTarget` shield read (tournament.js:553)
- Test: `tests/force-geography.test.js`

**Interfaces:**
- Consumes: `frontDefense` (Task 4); the attacker's disposition λ (`me.brain?.disposition ?? 0`); the estimate band. The harness gives bots true values (`TEST-LADDER.md`), so v1 reads the band at its center (λ scales a symmetric widen); the swept disposition arm (plan-battery) exercises λ.
- Produces: a `frontSoftness(me, t)` used inside `pickTarget` in place of the raw `shield(t)` for the FG path — judged garrison(λ) × public terrain × public fort of the FACING front (field army excluded — first blow is vs raw garrison, FG-⑤).

- [ ] **Step 1: Write the failing test**

```js
// tests/force-geography.test.js (append)
test('frontSoftness reads public terrain×fort, excludes the field army', () => {
  const me = { name: 'ME', brain: null };
  // two candidate defenders, equal garrison facing ME, different terrain/fort
  const soft = { name: 'S', field: 9999, frontG: { ME: 500 }, fortAt: { ME: 'fieldworks' }, frontClass: { ME: 'open' } };
  const hard = { name: 'H', field: 9999, frontG: { ME: 500 }, fortAt: { ME: 'fortress' }, frontClass: { ME: 'pass' } };
  // field army (9999) is IGNORED; only garrison×terrain×fort counts
  assert.ok(T.frontSoftness(me, soft) < T.frontSoftness(me, hard),
    'the open/fieldworks front reads softer than the pass/fortress front');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/force-geography.test.js`
Expected: FAIL — `T.frontSoftness` not a function.

- [ ] **Step 3: Add `frontSoftness`**

```js
// FG-⑦ attacker's read of a neighbour's FACING front: judged first-blow
// defense = judged garrison(λ) × public terrain × public fort. Field army
// excluded (arrives a beat later). λ from disposition; harness bots see true
// values, so the band centre is the garrison itself (disposition sweep in the
// battery widens/shifts it). Reuses frontDefense's terrain×fort read.
function frontSoftness(me, t) {
  const front = me.name;
  const lambda = (me.brain && me.brain.disposition) || 0;
  const g = t.frontG[front] ?? 0;
  const judgedG = Math.max(0, g * (1 - 0.25 * lambda)); // optimist (+) reads weaker
  return frontDefense({ ...t, frontG: { ...t.frontG, [front]: judgedG } }, front);
}
```

Export `frontSoftness`.

- [ ] **Step 4: Use it in `pickTarget` (FG path only)**

`pickTarget` currently ranks by `shield(t) = (engaged ? field*0.2 : field) + (t.frontG[me.name] ?? 0)` (tournament.js:553, 570-571). Add an FG-aware softness: when the board is a force-geography board (`me.m9Reserve` present as the FG marker, or a dedicated `me.forceGeo` flag), rank by `frontSoftness`. Change the sort comparator (tournament.js:570-571):

```js
  const soft = (t) => me.forceGeo ? frontSoftness(me, t)
    : ((engaged(t) ? Math.round(t.field * 0.2) : t.field) + (t.frontG[me.name] ?? 0));
  pool = [...pool].sort((a, b) =>
    (H.pileOn ? (window_(b) ? 1 : 0) - (window_(a) ? 1 : 0) : 0) || soft(a) - soft(b));
  const t = pool[0];
  const ratio = me.field / Math.max(1, soft(t));
```

(Replace the two `shield(...)` uses at :570-573 with `soft(...)`. Keep the old `shield` for the ratio/opportunism reads on non-FG boards — `soft` collapses to it when `forceGeo` is false.)

Set `me.forceGeo = gaan.startFortByClass ? true : false` at board build (map-board.js returned realm).

- [ ] **Step 5: Run tests + full suite**

Run: `node --test tests/force-geography.test.js` → PASS.
Run: `npm test` → PASS (non-FG boards: `forceGeo` false → identical `shield` ranking; `ai-targeting.test.js` unaffected).

- [ ] **Step 6: Commit**

```bash
git add mockup/combat-calc/tournament.js mockup/combat-calc/map-board.js tests/force-geography.test.js
git commit -m "feat(force-geography): U4 attacker targets softest front (FG-⑦)"
```

---

### Task 6: U5 measurement — within-realm variance + boosted shieldShare (FG §Settled)

**Files:**
- Modify: `mockup/combat-calc/tournament.js` `finish()` perRealm build (tournament.js:862-868); `mockup/combat-calc/match.js` `matchPanel` (match.js:218-291)
- Test: `tests/force-geography.test.js` + reuse `tests/match-panel.test.js` conventions

**Interfaces:**
- Consumes: each realm's `frontG`/`fortAt`/`frontClass` (per-front power via `frontDefense`), `matchPanel(perRealm, opts)`.
- Produces: `perRealm[i].frontPowers` (array of per-front defense powers) added in `finish()`; `matchPanel` returns two new fields: `boostedShieldShare` (leader boosted defense ÷ Σ boosted) and `meanWithinRealmVariance` (mean over realms of the coefficient-of-variation of their `frontPowers`). Raw `shieldShare` stays alongside (FG §Settled: keep raw for comparison).

- [ ] **Step 1: Write the failing test (pure panel math)**

```js
// tests/force-geography.test.js (append)
const { matchPanel } = require('../mockup/combat-calc/match.js');

test('matchPanel reports boostedShieldShare and within-realm variance', () => {
  const perRealm = [
    { name: 'A', seat: 'center', alive: true, vassalOf: null, proj: 100, shield: 100, ctrl: 5, bodies: 1000,
      frontPowers: [4800, 130] },   // thick pass + thin plains → high variance
    { name: 'B', seat: 'flank', alive: true, vassalOf: null, proj: 100, shield: 100, ctrl: 5, bodies: 1000,
      frontPowers: [900, 900] },    // uniform → zero variance
  ];
  const p = matchPanel(perRealm, {});
  assert.ok(p.boostedShieldShare > 0 && p.boostedShieldShare <= 1);
  assert.ok(p.meanWithinRealmVariance > 0, 'A contributes nonzero within-realm CV');
  assert.ok('shieldShare' in p, 'raw shieldShare kept alongside');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/force-geography.test.js`
Expected: FAIL — `boostedShieldShare`/`meanWithinRealmVariance` undefined.

- [ ] **Step 3: Compute per-front powers in `finish()`**

In `tournament.js finish()`, the `perRealm` map (tournament.js:862-867) currently sets `shield: shieldOf(r)`. Add `frontPowers`:

```js
  const perRealm = realms.map((r, i) => ({
    name: r.name, seat: r.seatType, alive: r.alive, vassalOf: r.vassalOf,
    proj: r.alive ? projectable(view[i]) : 0,
    shield: shieldOf(r), ctrl: r.interior,
    bodies: r.alive ? bodiesOf(r) : 0,
    frontPowers: r.alive ? Object.keys(r.frontG).map((f) => frontDefense(r, f)) : [],
  }));
```

- [ ] **Step 4: Extend `matchPanel` (match.js)**

`matchPanel` builds `sides` and computes `shieldShare` (match.js:249). It does not currently receive per-front data — pass it through. In `finish()`'s `matchPanel(perRealm, ...)` the per-realm objects already carry `frontPowers`; make `matchPanel` read them. After the `shieldShare` line (match.js:249), add:

```js
  // FG U5: boosted defense power (garrison × terrain × fort) and the
  // within-realm spread that force-geography is supposed to create.
  const boostOf = (name) => {
    const r = perRealm.find((x) => x.name === name);
    return r && r.frontPowers ? r.frontPowers.reduce((s, v) => s + v, 0) : 0;
  };
  const sumBoost = sides.reduce((s, x) => s + boostOf(x.name), 0) || 1;
  const boostedShieldShare = boostOf(leader.name) / sumBoost;
  const cv = (arr) => {
    if (!arr || arr.length < 2) return 0;
    const m = arr.reduce((s, v) => s + v, 0) / arr.length;
    if (!m) return 0;
    const v = arr.reduce((s, x) => s + (x - m) * (x - m), 0) / arr.length;
    return Math.sqrt(v) / m;
  };
  const cvs = perRealm.filter((r) => r.alive).map((r) => cv(r.frontPowers));
  const meanWithinRealmVariance = cvs.length ? cvs.reduce((s, v) => s + v, 0) / cvs.length : 0;
```

Add both to the returned object (match.js:287-290):

```js
  return {
    leader: leader.name, forceShare, controlShare, shieldShare,
    boostedShieldShare, meanWithinRealmVariance,
    hhi, sos, reversibilityIndex, vassalShare, worldBlood, exhausted, tier, bucket, sides,
  };
```

- [ ] **Step 5: Run tests + full suite**

Run: `node --test tests/force-geography.test.js` → PASS.
Run: `npm test` → PASS (`match-panel.test.js`: existing fields unchanged, new fields are additive; realms without `frontPowers` yield `boostedShieldShare` from 0-sum → guard returns finite via the `|| 1`).

- [ ] **Step 6: Commit**

```bash
git add mockup/combat-calc/tournament.js mockup/combat-calc/match.js tests/force-geography.test.js
git commit -m "feat(force-geography): U5 boosted shieldShare + within-realm variance"
```

---

### Task 7: Force-geography battery arm + M9 on/off sweep (integration, FG-⑩)

**Files:**
- Modify: `mockup/combat-calc/plan-battery.js` — `aggregate` reads new panel fields; add an FG arm runner + sweep
- Test: `tests/force-geography.test.js` (end-to-end run assertion)

**Interfaces:**
- Consumes: `runCradleTournament({ map, bindings, reps, seed, boardGaan })` (existing — passes `boardGaan` to `makeBoardFromMap`), `FG_BOARD_GAAN`, `aggregate`.
- Produces: `aggregate` output gains `meanBoostedShieldShare`, `meanWithinRealmVariance`; a `runFgSweep(bindings, reps)` returning `{ ctrl, fgM9on, fgM9off }` aggregates for comparison.

- [ ] **Step 1: Write the failing integration test**

```js
// tests/force-geography.test.js (append)
const { CRADLE_MAP: MAP } = require('../mockup/combat-calc/map-gen.js');
const { viableBindings } = require('../mockup/combat-calc/map-gate.js');
const { runCradleTournament, FG_BOARD_GAAN: FG } = require('../mockup/combat-calc/map-board.js');
const { aggregate } = require('../mockup/combat-calc/plan-battery.js');

test('FG tournament runs end-to-end and aggregate reports FG metrics', () => {
  const viable = viableBindings(MAP, 5).viable.slice(0, 2);
  const recs = runCradleTournament({ map: MAP, bindings: viable, reps: 2, seed: 1, boardGaan: FG });
  const agg = aggregate(recs);
  assert.ok(recs.length > 0);
  assert.strictEqual(typeof agg.decidedPct, 'number');
  assert.ok(agg.meanWithinRealmVariance > 0, 'FG board produces uneven fronts');
  assert.ok(typeof agg.meanBoostedShieldShare === 'number');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/force-geography.test.js`
Expected: FAIL — `agg.meanWithinRealmVariance` undefined.

- [ ] **Step 3: Extend `aggregate` (plan-battery.js)**

In `aggregate`'s panel loop (plan-battery.js:44-52), accumulate the new panel fields, and return their means:

```js
  let varSum = 0, boostSum = 0;   // (declare near `let exhausted = 0, paneled = 0;`)
  // inside `if (r.panel) { ... }`:
      varSum += r.panel.meanWithinRealmVariance || 0;
      boostSum += r.panel.boostedShieldShare || 0;
```

Add to the returned object (plan-battery.js:57-68):

```js
    meanWithinRealmVariance: paneled ? varSum / paneled : null,
    meanBoostedShieldShare: paneled ? boostSum / paneled : null,
```

- [ ] **Step 4: Add the sweep runner + report**

Add to `plan-battery.js` (export it):

```js
// FG-⑩ sweep: control (uniform walls) vs force-geography with M9 on/off.
// Isolates M9's contribution while keeping the human-like config primary.
function runFgSweep(bindings, reps = 20, seed = 42) {
  const { BOARD_GAAN, FG_BOARD_GAAN } = require('./map-board.js');
  const run = (gaan) => aggregate(runCradleTournament({
    map: CRADLE_MAP, bindings, reps, seed, boardGaan: gaan }));
  return {
    ctrl:    run(BOARD_GAAN),
    fgM9on:  run(FG_BOARD_GAAN),
    fgM9off: run({ ...FG_BOARD_GAAN, m9Reserve: false }),
  };
}
```

Add a `--fg` branch in `main()` that prints `decidedPct`, `meanWithinRealmVariance`, `meanBoostedShieldShare`, and the bucket histogram for each of the three arms (ctrl / fgM9on / fgM9off), so the freeze-watch + duel read is visible.

- [ ] **Step 5: Run tests + full suite + a live battery smoke run**

Run: `node --test tests/force-geography.test.js` → PASS.
Run: `npm test` → all PASS.
Run: `node mockup/combat-calc/plan-battery.js --fg --quick` → prints three arms; sanity-check `fgM9on` variance > 0 and decided% for all three.

- [ ] **Step 6: Commit**

```bash
git add mockup/combat-calc/plan-battery.js tests/force-geography.test.js
git commit -m "feat(force-geography): battery FG arm + M9 on/off sweep (FG-⑩)"
```

---

## Self-Review

**Spec coverage** (FG-①…⑩):
- FG-② U1 terrain envelope → Task 1. ✓
- FG-③/⑨ stop re-equalization → Task 2. ✓
- FG-⑤/⑩ M9 tactical fill → Task 3; first-blow-vs-raw-garrison is structural (siege stage) — verified, no task needed. ✓
- FG-⑥/⑩ field-army operational reserve (deficit destination) → Task 4. ✓
- FG-⑦ U4 attacker softest-front + disposition reuse → Task 5. ✓
- FG §Settled U5 (within-realm variance + boosted shieldShare + raw kept) → Task 6; duel/freeze-watch read → Task 7 sweep. ✓
- FG-⑧ commit-scarcity OFF → no task (flat 8/14 unchanged; correct). ✓
- FG-① redistribution/small-lever, FG-④ measurement validity → embodied by the M9 sweep (Task 7) and the passive→reactive reserve (Tasks 3-4); no code of their own. ✓
- FG-⑩ plan-time riders RESOLVED here: M9 abstraction = other-fronts+interior stock via `reserveAwaken` (Task 3); field-army arrival = the existing one-stage siege→field delay, no extra penalty in v1 (a `marchPenalty` dial is a future sweep, not built). ✓

**Placeholder scan:** no TBD/TODO; every code step carries real code; the only deferred item (v1 field-army march penalty) is an explicit non-goal, not a placeholder.

**Type consistency:** `frontDefense(D, front)` defined in Task 4, reused in Tasks 5–6; `m9Fill(D, front)` Task 3; `frontSoftness(me, t)` Task 5; `FG_BOARD_GAAN` grows across Tasks 1/3 (startFortByClass → +m9Reserve) — each addition is spelled out. `matchPanel` return fields (`boostedShieldShare`, `meanWithinRealmVariance`) named identically in Tasks 6 and consumed in Task 7 `aggregate`.

**Deferred (not this plan):** (정교) standing-garrison redistribution (FG-⑨, after this run's data); (a) per-front value (FG-⑥, needs province topology); field-army march penalty dial; DOMAIN_MAP/DESIGN Projection sync (owed when (b) ships).
