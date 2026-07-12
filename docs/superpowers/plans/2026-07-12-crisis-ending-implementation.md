# Crisis-Ending (Internal-Uprising Arc) — L2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the sudden-death internal-uprising crisis arc (ADR 0035/0036, match-arc RULINGS CE-①…⑳) into the L2 tournament harness as an opt-in mechanism, so it can be swept against the CE-⑫ acceptance gates before any default flip.

**Architecture:** The crisis is a new per-turn phase inside the shared `runMatch` loop (`mockup/combat-calc/tournament.js`), active turns `onset`..`hardEnd` and gated behind a single `HARNESS.crisis` sub-config that is **OFF by default**. When off, zero new state mutates and every existing match is byte-identical to today's sealed record world. When on (sector-mode boards only — the record world), each held sector carries a cumulative scar ledger and a rebel stack (soil-and-crop): fuel = scar × mobilization intensity grows the stack; suppression resolves the stack through the existing casualty curve using the whole defense axis; refused sectors burn and secede; standing rebel mass enters the hegemony gate's denial term; the arc hard-ends at turn 35 as a Westphalian draw. A total-war overlay saws off peacetime institutions (truce, settlement ladder rungs) on a calendar. This mirrors the established build-opt-in → measure → seal → flip-default discipline (FG board, M9 reserve, capLandFrac, AB-②).

**Tech Stack:** Plain CommonJS Node modules (no framework). Tests via `node --test tests/*.test.js`. Combat reuses `engine.js resolve()`/`DIALS`; economy reuses `econ.js`; the gate is `match.js hegemonyCheck`.

## Global Constraints

- **Crisis-off is byte-identical.** Every new mutation (scar accrual, rebel growth, suppression, secession, overlay, draw label, gate denial term) is guarded by `H.crisis && H.crisis.enabled`. With the flag off, `npm test` stays **248/248** and a pure-default record-world run byte-reproduces `research/2026-07-11-record-world-baseline.txt` (decided 67.8 · dd 98 · afford 20.4 · median 22 · stomp 2.2).
- **All crisis numeric values are 가안** (provisional). They live in exactly ONE home: `HARNESS.crisis` (single-definition rule). No task restates a value elsewhere; downstream reads reference `H.crisis.<dial>`.
- **Deterministic — no dice.** No `Math.random()` in crisis code; all crisis outcomes are functions of state (CE-①…⑳, SPEC principle 4).
- **Sector-mode only.** The crisis reads per-sector state (`r.holds`, `r.world.sectors`); it is a no-op on fixture boards (`makeBoard`). Guard every sector read with `sectorMode(r)`.
- **Never `git push`** (main is intentionally far ahead of origin). Commit trailer on every commit: `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- **Controller re-runs `npm test` after every task** and confirms 248/248 (plus the new crisis tests) before proceeding.
- **tree-sitter CLI is absent** → smart_* tools fail; use Read/grep.

---

## File Structure

| File | Role | Change |
|---|---|---|
| `mockup/combat-calc/tournament.js` | The shared match loop + board + settlement + register accounting | Primary: crisis dial block, crisis phase, scar/rebel state, `checkView` denial, loop extension, draw ending, overlay hooks, sweep exports |
| `mockup/combat-calc/match.js` | The hegemony gate (`hegemonyCheck`) + settlement ladder (`MATCH_DIALS.presets`) | Add rebel denial term to `unassailable`; add 백지 0% rung to the preset ladder |
| `mockup/combat-calc/map-board.js` | Cradle/sector harness (`runCradleTournament`) — the record world | Sweep driver + CE-⑫ gate report (Task 9) |
| `tests/crisis-arc.test.js` | New — crisis unit + integration tests | Create |

**Design notes locked by the seals (do not re-litigate — they are the spec):**
- Scar = per-sector cumulative usable damage, never decays, travels with the land on transfer (CE-⑭.1, CE-④, CE-⑮). Single per-sector ledger `s.scar`.
- Mobilization intensity = the SEALED realm-level `intensity(r)` (serving ÷ register), spread uniformly over held sectors (CE-⑭.1 + CE-③ L2 approximation). Not re-defined.
- Rebel cap per sector = the sector's register share (CE-⑭.2). Rebel deaths shrink `r.pool` permanently (CE-⑭.3).
- Rebel combat effectiveness = ⅓, a rebel constant applied only in suppression; denial reads RAW mass (CE-⑭.4/.5).
- Suppressor side = the whole defense axis (garrisons + reserves substance × defense lever × fort multiplier); rebel side = stack × terrain, lever 1, no fort; no threshold/stamps — pure attrition (CE-⑬).
- No contagion; secession = full rise then freeze; retake = ordinary occupation (CE-⑮).
- Westphalian draw at hardEnd; one winner rule only (CE-⑪, CE-①).
- Overlay: truce shortens→void, ladder floor rises 백지→관대→표준 (최대 + 복속 survive), 패권 정산 exempt (CE-⑳). Truce already exists in-harness (`H.truceTurns`) — CE-⑱ canonization needs no new machinery, only stage-aware reads.

---

## Task 1: Crisis dial block, arc scaffolding, Westphalian draw ending

**Files:**
- Modify: `mockup/combat-calc/tournament.js` — `HARNESS` block (~line 37-58); `runMatch` loop bound (~line 952) and post-loop (~line 1057); `finish` ending label (~line 1060)
- Create: `tests/crisis-arc.test.js`

**Interfaces:**
- Produces: `HARNESS.crisis` config object; `crisisRate(t, C)` exported → number; when `H.crisis.enabled`, `runMatch` iterates turns `1..H.crisis.hardEnd` and a no-winner finish is labelled `endingShape: 'draw-westphalian'`.

- [ ] **Step 1: Write the failing test**

Create `tests/crisis-arc.test.js`:

```js
'use strict';
// L2 crisis arc (ADR 0035/0036, RULINGS CE-①…⑳). Unit + integration tests.
const { test } = require('node:test');
const assert = require('node:assert');
const T = require('../mockup/combat-calc/tournament.js');

test('crisis dial block exists and is OFF by default', () => {
  assert.strictEqual(T.HARNESS.crisis.enabled, false);
  assert.strictEqual(T.HARNESS.crisis.onset, 25);
  assert.strictEqual(T.HARNESS.crisis.hardEnd, 35);
});

test('crisisRate is a linear staircase from onset', () => {
  const C = T.HARNESS.crisis;
  assert.strictEqual(T.crisisRate(C.onset, C), C.rate0);
  assert.strictEqual(T.crisisRate(C.onset + 1, C), C.rate0 + C.rateStep);
  assert.ok(T.crisisRate(C.hardEnd, C) > T.crisisRate(C.onset, C));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/crisis-arc.test.js`
Expected: FAIL — `T.HARNESS.crisis` undefined; `T.crisisRate` is not a function.

- [ ] **Step 3: Add the dial block, `crisisRate`, loop extension, draw label**

In `HARNESS` (after `capLandFrac: 1,` line, inside the object), add:

```js
  // -- sudden-death crisis arc (ADR 0035/0036, RULINGS CE-①…⑳). OFF by
  //    default: crisis-off === the sealed pre-crisis record world
  //    (byte-identical). Flip the default only after the CE-⑫ sweep seals
  //    (a future SYNC-DEBT flip, mirroring AB-②). ALL VALUES 가안. Every
  //    dial lives here and nowhere else (single-definition rule). --
  crisis: {
    enabled: false,
    onset: 25,               // CE-④ arc onset (envelope right edge)
    hardEnd: 35,             // CE-④/CE-⑪ Westphalian draw turn
    rate0: 0.05,             // CE-④ base growth: stack += rate(t) × fuel
    rateStep: 0.01,          // CE-④ linear staircase increment / crisis turn
    scarPerOccupation: 0.5,  // CE-⑭.1 usable-damage scar written on capture
    scarPerRaid: 0.15,       // CE-⑭.1 usable-damage scar written on a raid
    refusalBurnPp: 0.10,     // CE-⑥ refused-sector usable loss + scar increment
    rebelEffectiveness: 1 / 3, // CE-⑭.4 rebel combat constant (NOT a quality tier)
    denialCoeff: 1.0,        // CE-⑦/⑭.5 raw rebel mass → gate denial (sweep dial #1)
    secessionN: 2,           // CE-⑥/⑮ consecutive neglected turns → secession
    secessionFrac: 1.0,      // CE-⑮ full rise on secession (buffer variant 0.5)
    suppressScar: 0,         // CE-⑧/⑭.3 σ — leading candidate 0 (spiral replaces it)
    suppressBudgetFrac: 0.5, // bot policy: shield fraction spent on suppression/turn
    // CE-⑬/⑯ per-sector suppression terrain multiplier (가안; mirrors engine
    // D6 terrain family, keyed by sector terrainLayer values)
    terrainDef: { plains: 1.0, mountain: 1.5, river: 1.15, coast: 1.1, steppe: 1.0, desert: 1.2 },
    stage: { s1: 25, s2: 28, s3: 31 }, // CE-⑳ overlay calendar (turn boundaries 가안)
  },
```

After the `makeBoard`/board helpers section (near the other small helpers, e.g. after `bodiesOf`/`shieldOf` ~line 163), add:

```js
// ---------------------------------------------------------------- crisis
// CE-④ linear staircase: growth rate per crisis turn = rate0 + step×(t−onset).
function crisisRate(t, C) {
  return C.rate0 + C.rateStep * Math.max(0, t - C.onset);
}
```

In `runMatch`, change the loop bound. Replace:

```js
  for (let t = 1; t <= H.maxTurns; t++) {
```

with:

```js
  const lastTurn = (H.crisis && H.crisis.enabled) ? H.crisis.hardEnd : H.maxTurns;
  for (let t = 1; t <= lastTurn; t++) {
```

At the very end of `runMatch`, replace:

```js
  return finish(record, realms);
}
```

with:

```js
  if (H.crisis && H.crisis.enabled && !record.winner) record.endingShape = 'draw-westphalian';
  return finish(record, realms);
}
```

In `finish`, the `record.endingShape` is only overwritten to `'hegemon'` when there is a winner (`record.panel.bucket`), so the `'draw-westphalian'` label set above survives for no-winner crisis matches. Confirm by reading `finish` — do not change its timeout default (fixture/off matches keep `'timeout'`).

Add `crisisRate` to the `module.exports` list at the bottom of the file.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/crisis-arc.test.js`
Expected: PASS (3 tests).

- [ ] **Step 5: Run the full suite — byte-identical guard**

Run: `npm test`
Expected: PASS 248 (existing) + new crisis tests; fail 0. (Crisis off by default → existing matches unchanged.)

- [ ] **Step 6: Commit**

```bash
git add mockup/combat-calc/tournament.js tests/crisis-arc.test.js
git commit -m "feat(crisis): dial block + arc scaffolding + Westphalian draw label (opt-in, off)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 2: Per-sector scar ledger (cumulative usable damage, never decays)

**Files:**
- Modify: `mockup/combat-calc/tournament.js` — `captureSector` (~line 200), the raid branch in `peacePrimary` (~line 830), and add a scar helper + terrain helper near the crisis section.
- Test: `tests/crisis-arc.test.js`

**Interfaces:**
- Consumes: `HARNESS.crisis` (Task 1), `sectorMode`, `heldSectors`.
- Produces: `s.scar` (number, per sector, default 0 via `?? 0`); `addScar(sector, amount)`; `terrainOf(sector)` → terrain string. Scar accrues ONLY when `H.crisis.enabled` (byte-identical when off), travels with the sector on transfer (the sector object persists across ownership).

- [ ] **Step 1: Write the failing test**

Append to `tests/crisis-arc.test.js`:

```js
test('addScar accumulates and terrainOf reads the sector terrain layer', () => {
  const s = { mapUnits: [{ terrainLayer: 'mountain' }] };
  assert.strictEqual(T.terrainOf(s), 'mountain');
  T.addScar(s, 0.15);
  T.addScar(s, 0.5);
  assert.ok(Math.abs(s.scar - 0.65) < 1e-9);
});

test('terrainOf defaults to plains when no map units', () => {
  assert.strictEqual(T.terrainOf({}), 'plains');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/crisis-arc.test.js`
Expected: FAIL — `T.addScar` / `T.terrainOf` not a function.

- [ ] **Step 3: Implement the helpers and wire accrual**

In the crisis section (after `crisisRate`), add:

```js
// CE-⑭.1 scar ledger: per-sector cumulative usable damage. Never decays
// ("the land remembers"); persists on the sector object, so it is inherited
// on conquest for free (CE-④/CE-⑮). Written only during a crisis-enabled
// match; a no-op ledger read (?? 0) everywhere else.
function addScar(sector, amount) { sector.scar = (sector.scar ?? 0) + amount; }

// A sector's terrain layer (uniform per sector; sectorSpec assigns one
// terr to all its map units). Fallback plains.
function terrainOf(sector) { return sector.mapUnits && sector.mapUnits[0]
  ? sector.mapUnits[0].terrainLayer : 'plains'; }
```

In `captureSector`, after the chosen sector id is pushed (`war.occupied = war.occupiedIds.length;`), add a gated scar write on the captured sector. The `H` is not in `captureSector`'s scope — thread it: change the signature to `captureSector(war, A, D, H)` and update its two call sites in `warBattle` (search `captureSector(war, A, D)` — there are calls around lines 377 and 386) to pass `H`. `warBattle` receives `opts` but not `H`; add `H` to the `warBattle` call in `runMatch` (`warBattle(war, A, D, { screen: ..., rng, planStats: ..., H })`) and read `const H = opts.H ?? HARNESS;` at the top of `warBattle`, then pass it down. Inside `captureSector`, after `syncCounts(D);`:

```js
  if (H && H.crisis && H.crisis.enabled) addScar(D.world.sectors.get(id), H.crisis.scarPerOccupation);
```

Wait — the sector has just moved into `war.occupiedIds` and out of `D.holds`; it still lives in `D.world.sectors` (the shared world map), so `D.world.sectors.get(id)` is valid. Confirm `id` is in scope at that point.

In `peacePrimary`, the raid branch reduces `t.usable` (search `t.usable = Math.max(0.3, t.usable - HARNESS.raidBurnPp)`). Immediately after that line, add a gated per-sector scar write to the raided realm's highest-value held sector (mirrors occupation's top-score pick):

```js
        if (H.crisis && H.crisis.enabled && sectorMode(t)) {
          const secs = heldSectors(t);
          if (secs.length) {
            const top = secs.reduce((a, b) =>
              (b.populationValue + b.economyValue) > (a.populationValue + a.economyValue) ? b : a);
            addScar(top, H.crisis.scarPerRaid);
          }
        }
```

`peacePrimary(me, realms, rng, record, H = HARNESS)` already receives `H` — confirm and use it (the existing raid line uses `HARNESS.raidBurnPp` directly; leave that untouched for byte-identity, only ADD the gated scar).

Export `addScar`, `terrainOf`, and the updated `captureSector` (already exported) from `module.exports`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/crisis-arc.test.js`
Expected: PASS (all Task 1 + Task 2 tests).

- [ ] **Step 5: Full suite — byte-identical guard**

Run: `npm test`
Expected: 248 existing + crisis tests pass, 0 fail. (Scar writes are gated off by default; the `captureSector`/`warBattle` signature threading must not change off-path behavior — verify `tournament-board.test.js` and `occupation-geography.test.js` stay green.)

- [ ] **Step 6: Commit**

```bash
git add mockup/combat-calc/tournament.js tests/crisis-arc.test.js
git commit -m "feat(crisis): per-sector scar ledger, gated accrual on occupation + raid

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 3: Uprising fuel + rebel stack growth (per sector)

**Files:**
- Modify: `mockup/combat-calc/tournament.js` — crisis section (add fuel + growth helpers).
- Test: `tests/crisis-arc.test.js`

**Interfaces:**
- Consumes: `s.scar` (Task 2), `intensity(r)`, `terrainOf`, `crisisRate`, `heldSectors`, `sectorMode`.
- Produces: `sectorFuel(sector, intensityVal)` → `scar × intensity`; `sectorRegisterShare(sector, realm, popTotal)` → number; `growRebels(realm, t, H)` → void (mutates `s.rebelStack` on held sectors, capped at register share). `s.rebelStack` defaults 0 via `?? 0`.

- [ ] **Step 1: Write the failing test**

Append to `tests/crisis-arc.test.js`:

```js
test('sectorFuel is scar × intensity; unscarred stays zero', () => {
  assert.strictEqual(T.sectorFuel({ scar: 2 }, 0.5), 1);
  assert.strictEqual(T.sectorFuel({ scar: 0 }, 0.9), 0);
  assert.strictEqual(T.sectorFuel({}, 0.9), 0); // no scar field → 0
});

test('growRebels grows a scarred, mobilized sector and respects the register cap', () => {
  const C = { ...T.HARNESS.crisis, enabled: true, rate0: 0.5, rateStep: 0 };
  const H = { ...T.HARNESS, crisis: C };
  // one realm, two held sectors; realm-level intensity via serving/pool.
  const sA = { id: 'a', populationValue: 1, scar: 4, mapUnits: [{ terrainLayer: 'plains' }] };
  const sB = { id: 'b', populationValue: 1, scar: 0, mapUnits: [{ terrainLayer: 'plains' }] };
  const world = { sectors: new Map([['a', sA], ['b', sB]]), borderIds: new Set() };
  const r = { name: 'R', world, holds: new Set(['a', 'b']),
    pool: 1000, field: 300, frontG: {}, capitalGarrison: 0 };
  // intensity = serving/pool = 300/1000 = 0.3; sectorA fuel = 4×0.3 = 1.2
  // growth = rate(25)=0.5 × 1.2 = 0.6 × (register share). share_a = 1000×(1/2)=500.
  T.growRebels(r, 25, H);
  assert.ok(sA.rebelStack > 0, 'scarred sector rises');
  assert.strictEqual(sB.rebelStack ?? 0, 0, 'unscarred sector stays quiet');
  assert.ok(sA.rebelStack <= 500 + 1e-9, 'capped at register share');
});

test('growRebels never exceeds the register cap even at extreme rate', () => {
  const C = { ...T.HARNESS.crisis, enabled: true, rate0: 1000, rateStep: 0 };
  const H = { ...T.HARNESS, crisis: C };
  const s = { id: 'a', populationValue: 1, scar: 10, mapUnits: [{ terrainLayer: 'plains' }] };
  const world = { sectors: new Map([['a', s]]), borderIds: new Set() };
  const r = { name: 'R', world, holds: new Set(['a']), pool: 600, field: 300, frontG: {}, capitalGarrison: 0 };
  T.growRebels(r, 30, H);
  assert.ok(s.rebelStack <= 600 + 1e-9);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/crisis-arc.test.js`
Expected: FAIL — `T.sectorFuel` / `T.growRebels` not a function.

- [ ] **Step 3: Implement fuel + growth**

In the crisis section, add:

```js
// CE-⑭.1 fuel: a sector's uprising fuel = its scar × the owner's mobilization
// intensity (realm-level intensity spread uniformly over held sectors — the
// sealed L2 approximation, CE-③). A land neither damaged nor mobilized never
// rises; resting inherited scarred land keeps it quiet (demobilize = cooling).
function sectorFuel(sector, intensityVal) { return (sector.scar ?? 0) * intensityVal; }

// CE-⑭.2 rebel cap = the sector's register share = realm register × (sector
// pop ÷ realm held pop). The whole populace can rise at 3× the density a
// state sustains as standing forces (rebels pay no maintenance).
function sectorRegisterShare(sector, realm, popTotal) {
  return popTotal > 0 ? realm.pool * (sector.populationValue / popTotal) : 0;
}

// CE-④/⑧ soil-and-crop growth: each crisis turn, every held sector's rebel
// stack grows by rate(t) × fuel, capped at its register share. Deterministic.
function growRebels(realm, t, H) {
  if (!sectorMode(realm)) return;
  const C = H.crisis;
  const iv = intensity(realm);
  const rate = crisisRate(t, C);
  const secs = heldSectors(realm);
  const popTotal = secs.reduce((s, x) => s + x.populationValue, 0);
  for (const s of secs) {
    const grow = rate * sectorFuel(s, iv);
    if (grow <= 0) continue;
    const cap = sectorRegisterShare(s, realm, popTotal);
    s.rebelStack = Math.min((s.rebelStack ?? 0) + grow, cap);
  }
}
```

Export `sectorFuel`, `sectorRegisterShare`, `growRebels`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/crisis-arc.test.js`
Expected: PASS (Task 1-3 tests).

- [ ] **Step 5: Full suite**

Run: `npm test`
Expected: all pass, 0 fail (helpers are pure, not yet wired into the loop).

- [ ] **Step 6: Commit**

```bash
git add mockup/combat-calc/tournament.js tests/crisis-arc.test.js
git commit -m "feat(crisis): uprising fuel + per-sector rebel stack growth (capped at register share)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 4: Suppression attrition (the shared casualty curve, no threshold/stamps)

**Files:**
- Modify: `mockup/combat-calc/tournament.js` — crisis section (add `suppressAttrition`).
- Test: `tests/crisis-arc.test.js`

**Interfaces:**
- Consumes: `engine.js DIALS` (already required at top as `DIALS` via `engine`? confirm the import name — `warBattle` uses `DIALS`; the file requires engine as `const { DIALS, resolve, ... } = require('./engine.js')` or similar — reuse that binding).
- Produces: `suppressAttrition(suppressPower, rebelStack, terrainMult, C)` → `{ rebelDead, suppressorDead }`. Pure. CE-⑬: R = suppressPower ÷ (rebelStack × ⅓ × terrainMult); casualties from the shared curve (`DIALS.casualtyBase`, `DIALS.casualtyExp`); no success/threshold, no stamps.

- [ ] **Step 1: Write the failing test**

Append to `tests/crisis-arc.test.js`:

```js
test('suppressAttrition: stronger suppressor kills more rebels, bleeds less', () => {
  const C = T.HARNESS.crisis;
  const strong = T.suppressAttrition(3000, 900, 1.0, C); // R high
  const weak = T.suppressAttrition(600, 900, 1.0, C);    // R low
  assert.ok(strong.rebelDead > weak.rebelDead, 'more rebels die at high R');
  assert.ok(strong.suppressorDead < weak.suppressorDead, 'suppressor bleeds less at high R');
  assert.ok(strong.rebelDead <= 900 + 1e-9, 'cannot kill more rebels than exist');
});

test('suppressAttrition: terrain shelters rebels (mountain lowers R, fewer die)', () => {
  const C = T.HARNESS.crisis;
  const plain = T.suppressAttrition(1500, 900, C.terrainDef.plains, C);
  const mtn = T.suppressAttrition(1500, 900, C.terrainDef.mountain, C);
  assert.ok(mtn.rebelDead < plain.rebelDead, 'mountains shelter the guerrilla');
});

test('suppressAttrition: zero rebels is a no-op', () => {
  const r = T.suppressAttrition(1000, 0, 1.0, T.HARNESS.crisis);
  assert.strictEqual(r.rebelDead, 0);
  assert.strictEqual(r.suppressorDead, 0);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/crisis-arc.test.js`
Expected: FAIL — `T.suppressAttrition` not a function.

- [ ] **Step 3: Implement the attrition helper**

First confirm the engine `DIALS` binding at the top of `tournament.js` (search `require('./engine.js')`). If `DIALS` is already destructured there, reuse it; otherwise add `const ENGINE = require('./engine.js');` and use `ENGINE.DIALS`. Then in the crisis section add:

```js
// CE-⑬ suppression = pure attrition through the shared casualty curve (D11),
// NO threshold and NO stamps (success/repulse would be a false binary on
// attrition work). R = suppressor power ÷ rebel defense, where rebel defense =
// stack × ⅓ (rebel combat constant, CE-⑭.4) × terrain (the invariant
// multiplier that shelters the guerrilla, CE-⑬). Both sides bleed off the
// same curve; rebel deaths are permanent register loss (applied by the caller,
// CE-⑭.3). Deterministic.
function suppressAttrition(suppressPower, rebelStack, terrainMult, C) {
  if (rebelStack <= 0 || suppressPower <= 0) return { rebelDead: 0, suppressorDead: 0 };
  const rebelDef = rebelStack * C.rebelEffectiveness * terrainMult;
  const R = suppressPower / Math.max(1, rebelDef);
  const base = DIALS.casualtyBase, exp = DIALS.casualtyExp;
  const fracRebel = Math.min(1, base * Math.pow(R, exp));      // rebels lose more as R grows
  const fracSupp = Math.min(1, base / Math.pow(R, exp));       // suppressor loses more near parity
  return {
    rebelDead: Math.min(rebelStack, rebelStack * fracRebel),
    suppressorDead: suppressPower * fracSupp,
  };
}
```

(Replace `DIALS` with `ENGINE.DIALS` if you added the alias.) Export `suppressAttrition`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/crisis-arc.test.js`
Expected: PASS (Task 1-4 tests).

- [ ] **Step 5: Full suite**

Run: `npm test`
Expected: all pass, 0 fail.

- [ ] **Step 6: Commit**

```bash
git add mockup/combat-calc/tournament.js tests/crisis-arc.test.js
git commit -m "feat(crisis): suppression attrition via the shared casualty curve (no threshold/stamps)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 5: Crisis turn orchestration — pay/refuse allocation, suppression, register erasure

**Files:**
- Modify: `mockup/combat-calc/tournament.js` — crisis section (add `crisisTurn`); wire it into `runMatch` after the war-prosecution block, before the hegemony check.
- Test: `tests/crisis-arc.test.js`

**Interfaces:**
- Consumes: `growRebels` (T3), `suppressAttrition` (T4), `terrainOf`, `terrainDef`, `poolBleed`, `servingBodies`, `heldSectors`, `sectorMode`.
- Produces: `suppressionBudget(realm, C)` → number (defense-axis substance available this turn); `crisisTurn(realms, t, H, record)` → void (grow → allocate budget cheapest-first → suppress → erase register → mark refused). Records `record.crisis` accumulators. Uses `s._refusedThisTurn` transient flag consumed by Task 6.

- [ ] **Step 1: Write the failing test**

Append to `tests/crisis-arc.test.js`. A compact hand-built sector realm helper drives the integration:

```js
function tinyCrisisRealm(name, { pool = 1200, field = 400, scarA = 6 } = {}) {
  const sA = { id: name + 'a', populationValue: 1, economyValue: 1, usableEconomy: 1,
    scar: scarA, mapUnits: [{ terrainLayer: 'plains' }] };
  const sB = { id: name + 'b', populationValue: 1, economyValue: 1, usableEconomy: 1,
    scar: 0, mapUnits: [{ terrainLayer: 'plains' }] };
  const world = { sectors: new Map([[sA.id, sA], [sB.id, sB]]), borderIds: new Set(), seceded: new Map() };
  return { name, world, holds: new Set([sA.id, sB.id]), pool, field,
    frontG: { X: 600 }, frontCap: { X: 600 }, capitalGarrison: 600, usable: 1, alive: true };
}

test('crisisTurn grows then suppresses, erasing the register by rebel deaths', () => {
  const C = { ...T.HARNESS.crisis, enabled: true, rate0: 0.5, rateStep: 0, suppressBudgetFrac: 1 };
  const H = { ...T.HARNESS, crisis: C };
  const r = tinyCrisisRealm('R');
  const poolBefore = r.pool;
  const record = { crisis: {} };
  T.crisisTurn([r], 26, H, record);
  const sA = r.world.sectors.get('Ra');
  assert.ok((sA.rebelStack ?? 0) >= 0, 'stack tracked');
  assert.ok(r.pool < poolBefore, 'rebel deaths shrank the register permanently');
});

test('crisisTurn: with no suppression budget, sectors are refused (burn + counter)', () => {
  const C = { ...T.HARNESS.crisis, enabled: true, rate0: 0.5, rateStep: 0, suppressBudgetFrac: 0 };
  const H = { ...T.HARNESS, crisis: C };
  const r = tinyCrisisRealm('R');
  const record = { crisis: {} };
  T.crisisTurn([r], 26, H, record);
  const sA = r.world.sectors.get('Ra');
  assert.strictEqual(sA._refusedThisTurn, true, 'unsuppressed scarred sector is refused');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/crisis-arc.test.js`
Expected: FAIL — `T.crisisTurn` not a function.

- [ ] **Step 3: Implement the orchestrator + budget**

In the crisis section add:

```js
// Suppressor substance available this turn = a fraction of the whole defense
// axis (garrisons + capital guard = the shield; reserves fold in via the same
// pool). CE-⑩ shield-natured: the field army is NOT drawn on unless a later
// dial opts in. Bot policy — the pay side of pay/refuse (CE-⑥).
function suppressionBudget(realm, C) {
  const shield = Object.values(realm.frontG).reduce((s, g) => s + g, 0) + realm.capitalGarrison;
  return shield * C.suppressBudgetFrac;
}

// CE-⑥/⑬/⑭ one crisis turn for one realm: grow stacks, then spend the
// suppression budget cheapest-first (lowest terrain shelter = best exchange),
// resolving attrition per sector; unsuppressed scarred sectors are REFUSED
// (burn + secession counter, applied in Task 6). Rebel deaths erase the
// register permanently. Deterministic (sectors ordered by id on ties).
function crisisTurn(realms, t, H, record) {
  const C = H.crisis;
  record.crisis ??= {};
  const acc = record.crisis;
  acc.rebelDead ??= 0; acc.suppressorDead ??= 0; acc.suppressCostByTerrain ??= {};
  for (const r of realms) {
    if (!r.alive || !sectorMode(r)) continue;
    growRebels(r, t, H);
    let budget = suppressionBudget(r, C);
    // contested sectors = held sectors with a standing stack, cheapest terrain first
    const contested = heldSectors(r)
      .filter((s) => (s.rebelStack ?? 0) > 0)
      .sort((a, b) => (C.terrainDef[terrainOf(a)] ?? 1) - (C.terrainDef[terrainOf(b)] ?? 1)
        || (a.id < b.id ? -1 : 1));
    for (const s of contested) {
      s._refusedThisTurn = false;
      const tMult = C.terrainDef[terrainOf(s)] ?? 1;
      // allocate a proportional slice of the remaining budget to this sector's
      // fight; if nothing is allocated, the sector is refused.
      const power = Math.min(budget, s.rebelStack * C.rebelEffectiveness * tMult * MATCH_DIALS.shieldRatio);
      if (power <= 0) { s._refusedThisTurn = true; continue; }
      budget -= power;
      const { rebelDead, suppressorDead } = suppressAttrition(power, s.rebelStack, tMult, C);
      s.rebelStack -= rebelDead;
      poolBleed(r, rebelDead);                 // CE-⑭.3 permanent register erasure
      if (C.suppressScar > 0) addScar(s, C.suppressScar); // CE-⑧ σ (0 by default)
      acc.rebelDead += rebelDead; acc.suppressorDead += suppressorDead;
      const terr = terrainOf(s);
      acc.suppressCostByTerrain[terr] = (acc.suppressCostByTerrain[terr] ?? 0) + suppressorDead;
    }
    // any scarred-but-unreached contested sector left with a stack is refused
    for (const s of contested) if ((s.rebelStack ?? 0) > 0 && s._refusedThisTurn === undefined) s._refusedThisTurn = true;
  }
}
```

Note: `suppressorDead` is a measurement accumulator (per-terrain cost, the CE-⑯ watch item) — the harness does not currently model a dedicated reserve pool to subtract it from, so the shield substance is not decremented here (an L2 fidelity simplification: suppression cost is measured, not yet deducted from garrisons — record this as a debt in Task 9's report). This keeps the change surgical; a later task can bleed `suppressorDead` from garrisons if the sweep shows it matters.

Wire into `runMatch`: after the war-prosecution loop and the `--- M12/M13 pulse` block, **before** the `--- hegemony check` block, add:

```js
    // --- crisis arc (ADR 0035/0036): grow + suppress rebels turns onset..hardEnd
    if (H.crisis && H.crisis.enabled && t >= H.crisis.onset) crisisTurn(alive, t, H, record);
```

Export `crisisTurn`, `suppressionBudget`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/crisis-arc.test.js`
Expected: PASS (Task 1-5 tests).

- [ ] **Step 5: Full suite — byte-identical guard**

Run: `npm test`
Expected: 248 + crisis pass, 0 fail. (The `crisisTurn` call is gated `t >= onset` AND `enabled`; off-path untouched.)

- [ ] **Step 6: Commit**

```bash
git add mockup/combat-calc/tournament.js tests/crisis-arc.test.js
git commit -m "feat(crisis): crisis-turn orchestration — pay/refuse allocation, suppression, register erasure

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 6: Refusal burn + secession by neglect

**Files:**
- Modify: `mockup/combat-calc/tournament.js` — crisis section (extend `crisisTurn` with the refusal/secession pass); board world gains a `seceded` Map.
- Test: `tests/crisis-arc.test.js`

**Interfaces:**
- Consumes: `s._refusedThisTurn` (T5), `H.crisis.refusalBurnPp`, `secessionN`, `secessionFrac`, `sectorRegisterShare`.
- Produces: refused sectors accrue scar + usable loss + `s.neglect` counter; at `neglect >= secessionN` the sector secedes — stack jumps to `secessionFrac × register share`, sector leaves `r.holds` and enters `r.world.seceded` (id → stack), frozen. Suppressing a sector resets its `neglect` to 0.

- [ ] **Step 1: Write the failing test**

Append to `tests/crisis-arc.test.js`:

```js
test('a persistently refused sector secedes after secessionN turns', () => {
  const C = { ...T.HARNESS.crisis, enabled: true, rate0: 0.5, rateStep: 0,
    suppressBudgetFrac: 0, secessionN: 2, secessionFrac: 1 };
  const H = { ...T.HARNESS, crisis: C };
  const r = tinyCrisisRealm('R');
  r.world.seceded = new Map();
  const record = { crisis: {} };
  T.crisisTurn([r], 26, H, record); // refuse #1
  assert.ok(r.holds.has('Ra'), 'still held after one refusal');
  T.crisisTurn([r], 27, H, record); // refuse #2 → secede
  assert.ok(!r.holds.has('Ra'), 'seceded sector leaves holds');
  assert.ok(r.world.seceded.has('Ra'), 'seceded sector recorded on the world');
  assert.ok(r.world.seceded.get('Ra') > 0, 'seceded with a standing stack');
});

test('suppressing a sector resets its neglect counter (no secession)', () => {
  const C = { ...T.HARNESS.crisis, enabled: true, rate0: 0.5, rateStep: 0,
    suppressBudgetFrac: 1, secessionN: 2 };
  const H = { ...T.HARNESS, crisis: C };
  const r = tinyCrisisRealm('R');
  r.world.seceded = new Map();
  const record = { crisis: {} };
  T.crisisTurn([r], 26, H, record);
  T.crisisTurn([r], 27, H, record);
  assert.ok(r.holds.has('Ra'), 'suppressed sector does not secede');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/crisis-arc.test.js`
Expected: FAIL — sector `Ra` is not seceding (no refusal/secession logic yet).

- [ ] **Step 3: Implement refusal + secession; ensure the world carries `seceded`**

In `buildSectorWorld` (`map-board.js`, the returned object `{ sectors, adj, borderIds }`), add `seceded: new Map()`:

```js
  return { sectors, adj, borderIds, seceded: new Map() };
```

(Backward-compat: code reads `r.world.seceded ?? new Map()` where used, so older worlds without it still work; but adding it here is the clean home.)

In `crisisTurn`, replace the final "refused" loop with a full refusal + secession pass. Change the tail of the per-realm block (after the suppression `for` loop) to:

```js
    // CE-⑥/⑮ refusal + secession: any contested sector not suppressed this
    // turn burns (usable loss + scar) and advances its neglect counter; a
    // suppressed sector resets it. At neglect ≥ N the sector secedes: full
    // rise to (frac × register share), leaves holds, freezes on the world.
    const popTotal = heldSectors(r).reduce((s, x) => s + x.populationValue, 0);
    for (const s of heldSectors(r)) {
      if ((s.rebelStack ?? 0) <= 0) continue;
      if (s._refusedThisTurn) {
        s.usableEconomy = Math.max(0, (s.usableEconomy ?? 1) - C.refusalBurnPp);
        addScar(s, C.refusalBurnPp);
        s.neglect = (s.neglect ?? 0) + 1;
        if (s.neglect >= C.secessionN) {
          const share = sectorRegisterShare(s, r, popTotal);
          s.rebelStack = C.secessionFrac * share;
          r.holds.delete(s.id);
          syncCounts(r);
          (r.world.seceded ??= new Map()).set(s.id, s.rebelStack);
          acc.secessions = (acc.secessions ?? 0) + 1;
        }
      } else {
        s.neglect = 0; // suppressed this turn
      }
    }
```

Remove the now-redundant trailing "any scarred-but-unreached … refused" line from Task 5 (the suppression loop already sets `_refusedThisTurn = false` on reached sectors and leaves it `undefined`/false on unreached ones — set the default explicitly). To make "reached but zero budget" vs "never reached" unambiguous, initialize `s._refusedThisTurn = true` for every contested sector at the START of the suppression loop, then set it `false` only when `power > 0` is actually spent. Adjust the Task-5 loop accordingly:

```js
    for (const s of contested) {
      const tMult = C.terrainDef[terrainOf(s)] ?? 1;
      const power = Math.min(budget, s.rebelStack * C.rebelEffectiveness * tMult * MATCH_DIALS.shieldRatio);
      if (power <= 0) { s._refusedThisTurn = true; continue; }
      s._refusedThisTurn = false;
      budget -= power;
      // ... (attrition, poolBleed, accumulators as in Task 5) ...
    }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/crisis-arc.test.js`
Expected: PASS (Task 1-6 tests).

- [ ] **Step 5: Full suite**

Run: `npm test`
Expected: all pass, 0 fail. (Verify `map-board.js`'s new `seceded` field breaks no `buildSectorWorld` snapshot in `tournament-board.test.js`/`map-board.test.js`; if a test deep-equals the world object, update it to include `seceded`.)

- [ ] **Step 6: Commit**

```bash
git add mockup/combat-calc/tournament.js mockup/combat-calc/map-board.js tests/crisis-arc.test.js
git commit -m "feat(crisis): refusal burn + secession by neglect (full rise, freeze, leaves holds)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 7: Standing rebel mass enters the hegemony gate's denial term

**Files:**
- Modify: `mockup/combat-calc/tournament.js` — `checkView` (~line 235) computes and stamps a board rebel-denial term; its call sites (~line 1043, ~line 1064 `finish`) pass `H`.
- Modify: `mockup/combat-calc/match.js` — `hegemonyCheck` adds the denial term to `coalition`.
- Test: `tests/crisis-arc.test.js`

**Interfaces:**
- Consumes: `s.rebelStack`, `r.world.seceded`, `H.crisis.denialCoeff`.
- Produces: `boardRebelMass(realms)` → sum of all held-sector stacks + all seceded stacks (RAW mass, CE-⑭.5); `checkView(realms, H)` stamps `rebelDenial = denialCoeff × boardRebelMass` on every view entry (0 when crisis off/absent). `hegemonyCheck` reads `cand.rebelDenial ?? 0` into `unassailable`. Backward-compatible: fixtures/off → 0 → identical.

- [ ] **Step 1: Write the failing test**

Append to `tests/crisis-arc.test.js`:

```js
const M = require('../mockup/combat-calc/match.js');

test('boardRebelMass sums held + seceded raw stacks across realms', () => {
  const sA = { id: 'a', rebelStack: 100 };
  const sB = { id: 'b', rebelStack: 0 };
  const seceded = new Map([['z', 250]]);
  const world = { sectors: new Map([['a', sA], ['b', sB]]), borderIds: new Set(), seceded };
  const r = { name: 'R', world, holds: new Set(['a', 'b']), alive: true };
  assert.strictEqual(T.boardRebelMass([r]), 350);
});

test('checkView stamps zero denial when crisis is off, positive when on', () => {
  const sA = { id: 'a', rebelStack: 300, populationValue: 1, economyValue: 1, usableEconomy: 1 };
  const world = { sectors: new Map([['a', sA]]), borderIds: new Set(), seceded: new Map() };
  const r = { name: 'R', world, holds: new Set(['a']), alive: true, vassalOf: null,
    field: 400, fieldCap: 800, frontG: {}, capitalGarrison: 200, pool: 1000, exits: [{ cap: Infinity }] };
  const off = T.checkView([r]);
  assert.strictEqual(off[0].rebelDenial ?? 0, 0);
  const H = { ...T.HARNESS, crisis: { ...T.HARNESS.crisis, enabled: true, denialCoeff: 1 } };
  const on = T.checkView([r], H);
  assert.strictEqual(on[0].rebelDenial, 300);
});

test('rebel denial raises the coalition, making unassailability harder', () => {
  // two realms; candidate strong. Without rebels it is unassailable; a big
  // rebel denial term pushes coalition over the need.
  const mk = (name, field) => ({ name, alive: true, vassalOf: null, field, fieldCap: field,
    garrisons: 500, fronts: {}, treasury: 0, income: 0, pool: 3000, serving: field + 500,
    exits: [{ cap: Infinity }] });
  const strong = { ...mk('A', 6000) };
  const weak = { ...mk('B', 1500) };
  const clean = M.hegemonyCheck([strong, weak], 'A');
  const flamed = M.hegemonyCheck([{ ...strong, rebelDenial: 99999 }, { ...weak, rebelDenial: 99999 }], 'A');
  assert.ok(clean.unassailable, 'unassailable with no rebels');
  assert.ok(!flamed.unassailable, 'a continent in flames denies the crown');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/crisis-arc.test.js`
Expected: FAIL — `T.boardRebelMass` undefined; `checkView` ignores `H`; `hegemonyCheck` ignores `rebelDenial`.

- [ ] **Step 3: Implement the denial term**

In `tournament.js` crisis section add:

```js
// CE-⑦/⑭.5 board-global standing rebel mass (RAW headcount — political
// denial). Held-sector stacks + seceded (ownerless) stacks. Nobody is
// unassailable over a continent in flames; this term denies EVERY candidate.
function boardRebelMass(realms) {
  let total = 0;
  for (const r of realms) {
    if (!r.alive || !sectorMode(r)) continue;
    for (const s of heldSectors(r)) total += s.rebelStack ?? 0;
  }
  // seceded stacks live on the shared world; count each world once
  const worlds = new Set();
  for (const r of realms) if (r.world && !worlds.has(r.world)) {
    worlds.add(r.world);
    for (const v of (r.world.seceded ?? new Map()).values()) total += v;
  }
  return total;
}
```

Change `checkView`:

```js
function checkView(realms, H) {
  const on = H && H.crisis && H.crisis.enabled;
  const rebelDenial = on ? H.crisis.denialCoeff * boardRebelMass(realms) : 0;
  return realms.map((r) => ({
    name: r.name, alive: r.alive, vassalOf: r.vassalOf,
    field: r.field, fieldCap: r.fieldCap,
    garrisons: totalGarrisons(r),
    fronts: r.frontG,
    treasury: r.treasury, income: realmIncome(r),
    pool: r.pool, serving: servingBodies(r),
    exits: r.staging ? r.exits.map((e) => ({ cap: e.cap === Infinity ? Infinity : e.cap * 2 })) : r.exits,
    rebelDenial,
  }));
}
```

Update the two `checkView(realms)` call sites in `runMatch` and `finish` to pass `H`. `finish(record, realms)` has no `H` — thread it: change to `finish(record, realms, H)` and update both `return finish(record, realms)` sites in `runMatch` to `finish(record, realms, H)`; inside `finish` call `checkView(realms, H)` (both occurrences).

In `match.js hegemonyCheck`, change the unassailability line. Replace:

```js
  const unassailable = coalition < coalitionNeed;
```

with:

```js
  // CE-⑦/⑭.5 standing rebellion denies every candidate: raw rebel mass
  // (pre-scaled by the crisis coefficient in checkView) adds to the coalition
  // arrayed against the candidate. Absent (fixtures/crisis-off) → 0.
  const rebelDenial = cand.rebelDenial ?? 0;
  const unassailable = (coalition + rebelDenial) < coalitionNeed;
```

Export `boardRebelMass` from `tournament.js`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/crisis-arc.test.js`
Expected: PASS (Task 1-7 tests).

- [ ] **Step 5: Full suite — byte-identical guard (critical)**

Run: `npm test`
Expected: 248 + crisis pass, 0 fail. `hegemony-check.test.js` must stay green (its fixtures carry no `rebelDenial` → `?? 0` → identical). `freeze-autopsy.js` imports `checkView` — confirm it still calls `checkView(realms)` (one arg → `H` undefined → denial 0, unchanged).

- [ ] **Step 6: Commit**

```bash
git add mockup/combat-calc/tournament.js mockup/combat-calc/match.js tests/crisis-arc.test.js
git commit -m "feat(crisis): standing rebel mass enters the hegemony gate's denial term (pacification condition)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 8: Total-war overlay — stage table, truce cuts, white-peace 0% rung

**Files:**
- Modify: `mockup/combat-calc/match.js` — `MATCH_DIALS.presets` gains a 백지 (0%) rung.
- Modify: `mockup/combat-calc/tournament.js` — crisis section (`overlayStage`, `availablePresets`, `truceLength`); `endWar` truce length (~line 680); `trySettle` preset ladder (~line 584) consults the stage.
- Test: `tests/crisis-arc.test.js`

**Interfaces:**
- Consumes: `H.crisis.stage`, `H.crisis.onset`, `H.truceTurns`, `MATCH_DIALS.presets`.
- Produces: `overlayStage(t, C)` → 0|1|2|3; `availablePresets(t, H)` → ordered preset-name array (백지→관대→표준→최대 minus overlay-broken rungs; 최대 always survives; 패권 정산/vassalage exempt); `truceLength(t, H)` → number (full pre-onset, halved at S1, 0 at S2+). `endWar` uses `truceLength`; `trySettle` filters the ladder through `availablePresets`.

- [ ] **Step 1: Write the failing test**

Append to `tests/crisis-arc.test.js`:

```js
test('백지 (white peace) is the 0% rung of the settlement ladder', () => {
  assert.ok(M.MATCH_DIALS.presets['백지']);
  assert.strictEqual(M.MATCH_DIALS.presets['백지'].claimRate, 0);
  const b = M.presetBundle('백지', { occValue: 10, raidLoot: 4 });
  assert.strictEqual(b.value, 0, 'claims nothing');
});

test('overlay breaks the ladder from the bottom up; 최대 always survives', () => {
  const C = { ...T.HARNESS.crisis, enabled: true, onset: 25, stage: { s1: 25, s2: 28, s3: 31 } };
  const H = { ...T.HARNESS, crisis: C };
  assert.deepStrictEqual(T.availablePresets(24, H), ['백지', '관대', '표준', '최대']); // pre-onset: full
  assert.deepStrictEqual(T.availablePresets(28, H), ['표준', '최대']);   // S2: 백지+관대 gone
  assert.deepStrictEqual(T.availablePresets(31, H), ['최대']);            // S3: only 최대
});

test('overlay shortens then voids the truce on the calendar', () => {
  const C = { ...T.HARNESS.crisis, enabled: true, onset: 25, stage: { s1: 25, s2: 28, s3: 31 } };
  const H = { ...T.HARNESS, crisis: C, truceTurns: 4 };
  assert.strictEqual(T.truceLength(10, H), 4);  // pre-crisis: full
  assert.strictEqual(T.truceLength(26, H), 2);  // S1: halved
  assert.strictEqual(T.truceLength(29, H), 0);  // S2+: void
});

test('overlay is inert when crisis is off', () => {
  assert.deepStrictEqual(T.availablePresets(30, T.HARNESS), ['백지', '관대', '표준', '최대']);
  assert.strictEqual(T.truceLength(30, T.HARNESS), T.HARNESS.truceTurns);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/crisis-arc.test.js`
Expected: FAIL — 백지 preset missing; `overlayStage`/`availablePresets`/`truceLength` not functions.

- [ ] **Step 3: Implement the overlay**

In `match.js MATCH_DIALS.presets`, add the 백지 rung as the ladder floor:

```js
  presets: {
    백지: { claimRate: 0.00, fill: 'cessionFirst' },  // CE-⑲ white peace: claim nothing (id-exact return)
    관대: { claimRate: 0.50, fill: 'indemnityFirst' },  // A-1 ruling ⑧ 가안
    표준: { claimRate: 0.75, fill: 'cessionFirst' },
    최대: { claimRate: 1.00, fill: 'cessionFirst' },
  },
```

`presetBundle` already computes `target = composite × claimRate`; with claimRate 0 → cession 0, indemnity 0, value 0. Confirm no divide-by-zero (there is none). The existing ladder `['최대','표준','관대']` in `trySettle` is unaffected by adding 백지 (it is a floor the bot reaches only via the overlay/white-peace path).

In `tournament.js` crisis section, add:

```js
// CE-⑳ total-war overlay stage on the public calendar. 0 = pre-crisis / off.
function overlayStage(t, C) {
  if (t >= C.stage.s3) return 3;
  if (t >= C.stage.s2) return 2;
  if (t >= C.stage.s1) return 1;
  return 0;
}

// CE-⑳ settlement ladder under the overlay: the floor rises from the bottom
// (백지→관대→표준 break in order); 최대 always survives (annihilation endgame
// in our own grammar). Vassalage + 패권 정산 are exempt (handled elsewhere).
function availablePresets(t, H) {
  const full = ['백지', '관대', '표준', '최대'];
  if (!(H.crisis && H.crisis.enabled)) return full;
  const stage = overlayStage(t, H.crisis);
  if (stage >= 3) return ['최대'];
  if (stage >= 2) return ['표준', '최대'];
  return full; // stage 0/1: ladder intact (S1 cuts truce, not the ladder)
}

// CE-⑱/⑳ truce length under the overlay: full pre-onset, halved at S1,
// void at S2+. Off/pre-crisis → the plain H.truceTurns.
function truceLength(t, H) {
  if (!(H.crisis && H.crisis.enabled)) return H.truceTurns;
  const stage = overlayStage(t, H.crisis);
  if (stage >= 2) return 0;
  if (stage >= 1) return Math.floor(H.truceTurns / 2);
  return H.truceTurns;
}
```

Wire truce length into `endWar`. Change:

```js
  A.truce[D.name] = D.truce[A.name] = (war.endTurn ?? 0) + H.truceTurns;
```

to:

```js
  A.truce[D.name] = D.truce[A.name] = (war.endTurn ?? 0) + truceLength(war.endTurn ?? 0, H);
```

Wire the ladder filter into `trySettle`. In `trySettle`, the preset ladder loop uses `const ladder = ['최대', '표준', '관대'];`. Replace with a stage-filtered ladder (preferred → lenient, minus broken rungs), threading `H` (already a `trySettle` param) and the current turn. `trySettle` has no `t`; the current turn is on the realm as `A._turn`. Replace:

```js
  const ladder = ['최대', '표준', '관대'];
```

with:

```js
  // CE-⑳ overlay: the leniency floor rises during the crisis (백지/관대/표준
  // break bottom-up; 최대 always survives). Preferred → most lenient still open.
  const open = availablePresets(A._turn ?? 0, H); // ['백지'..'최대'] minus broken rungs
  const ladder = ['최대', '표준', '관대'].filter((p) => open.includes(p));
```

(백지 is a 0% rung the bot reaches through the existing stall/white-peace path, not the concession ladder; leaving it out of this concession ladder is intentional — the ladder is the winner's *claim* concession, and a winner does not "concede" to claiming nothing except via white peace.) If `ladder` is empty (S3, but 최대 always survives so it never is), the loop simply makes no offer.

Export `overlayStage`, `availablePresets`, `truceLength`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/crisis-arc.test.js`
Expected: PASS (Task 1-8 tests).

- [ ] **Step 5: Full suite — byte-identical guard**

Run: `npm test`
Expected: 248 + crisis pass, 0 fail. Adding the 백지 preset must not change any existing settlement (the concession ladder never includes 백지; `presetBundle('백지', …)` is only called by the new test). `endWar`'s truce now routes through `truceLength`, which returns exactly `H.truceTurns` when crisis is off → identical.

- [ ] **Step 6: Commit**

```bash
git add mockup/combat-calc/match.js mockup/combat-calc/tournament.js tests/crisis-arc.test.js
git commit -m "feat(crisis): total-war overlay — stage table, truce cuts, white-peace 0% rung

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 9: Sweep driver + CE-⑫ gate report (crisis-on vs off)

**Files:**
- Modify: `mockup/combat-calc/map-board.js` — add `crisisGateReport(records)` and a small sweep convenience.
- Test: `tests/crisis-arc.test.js` (integration through `runCradleTournament`).

**Interfaces:**
- Consumes: `runCradleTournament` (threads `harness` → `runMatch`), record fields (`endingShape`, `winner`, `warsStarted`, per-turn war density if tracked, `record.crisis` accumulators, `finalRealms`).
- Produces: `crisisGateReport(records)` → `{ drawRate, warDensity2535, warDensity1525, registerExhaustionRate, suppressCostByTerrain, scarSpread, ... }` mapping to the CE-⑫ gates + the two new watch items (register-exhaustion rate; per-terrain suppression differential).

- [ ] **Step 1: Instrument war-density-by-phase in the record (small `runMatch` addition)**

The CE-⑫(b) chore-prevention gate needs war counts in turns 15–25 vs 25–35. In `runMatch`, `record.warsStarted` is a scalar. Add a per-turn tally: initialize `record.warsByTurn = {}` in the record object, and in the declarations-resolution loop (where `record.warsStarted++`) also do `record.warsByTurn[t] = (record.warsByTurn[t] ?? 0) + 1;`. This is unconditional (cheap, additive, does not change outcomes) — but to preserve strict byte-identity of the RECORD shape for existing snapshot tests, confirm no test deep-equals the whole `record`; if one does, gate it behind `H.crisis?.enabled`. Prefer unconditional (it is pure instrumentation).

- [ ] **Step 2: Write the failing test**

Append to `tests/crisis-arc.test.js`:

```js
const { runCradleTournament } = require('../mockup/combat-calc/map-board.js');
const { CRADLE_MAP } = require('../mockup/combat-calc/map-gen.js');
const { viableBindings } = require('../mockup/combat-calc/map-gate.js');
const MB = require('../mockup/combat-calc/map-board.js');

test('crisis-on cradle run produces draws and a CE-⑫ gate report', () => {
  const binding = viableBindings(CRADLE_MAP, 5).viable.slice(0, 1);
  const recs = runCradleTournament({
    map: CRADLE_MAP, bindings: binding, reps: 1, seed: 7,
    harness: { crisis: { ...MB /* placeholder */ } && require('../mockup/combat-calc/tournament.js').HARNESS.crisis, },
  });
  // Turn the crisis ON explicitly via a full harness crisis override:
  const T2 = require('../mockup/combat-calc/tournament.js');
  const on = runCradleTournament({
    map: CRADLE_MAP, bindings: binding, reps: 1, seed: 7,
    harness: { crisis: { ...T2.HARNESS.crisis, enabled: true } },
  });
  const report = MB.crisisGateReport(on);
  assert.ok(report.total > 0);
  assert.ok('drawRate' in report);
  assert.ok('warDensity2535' in report && 'warDensity1525' in report);
  assert.ok('registerExhaustionRate' in report);
  assert.ok(report.suppressCostByTerrain && typeof report.suppressCostByTerrain === 'object');
});

test('crisis-on is seed-deterministic (no dice)', () => {
  const binding = viableBindings(CRADLE_MAP, 5).viable.slice(0, 1);
  const T2 = require('../mockup/combat-calc/tournament.js');
  const run = () => runCradleTournament({ map: CRADLE_MAP, bindings: binding, reps: 1, seed: 4,
    harness: { crisis: { ...T2.HARNESS.crisis, enabled: true } } })
    .map((r) => `${r.seat}:${r.focal}:${r.winner}:${r.endingShape}`);
  assert.deepStrictEqual(run(), run());
});
```

(Delete the first placeholder call; keep only the explicit `enabled: true` run — shown here for clarity. The final test should contain only the clean `on` run + report assertions.)

- [ ] **Step 3: Run test to verify it fails**

Run: `node --test tests/crisis-arc.test.js`
Expected: FAIL — `MB.crisisGateReport` not a function.

- [ ] **Step 4: Implement the gate report**

In `map-board.js`, before `module.exports`, add:

```js
// CE-⑫ acceptance-gate report for a crisis-on sweep. Reads the record
// fields runMatch emits; every metric maps to a sealed gate or the two new
// watch items (register-exhaustion rate; per-terrain suppression cost).
function crisisGateReport(records) {
  const total = records.length || 1;
  const draws = records.filter((r) => r.endingShape === 'draw-westphalian').length;
  const sum = (obj, k) => Object.entries(obj || {})
    .reduce((s, [turn, n]) => (+turn >= k[0] && +turn <= k[1] ? s + n : s), 0);
  let d2535 = 0, d1525 = 0;
  let regStart = 0, regEnd = 0;
  const suppressCostByTerrain = {};
  let scarValues = [];
  for (const r of records) {
    d2535 += sum(r.warsByTurn, [25, 35]);
    d1525 += sum(r.warsByTurn, [15, 25]);
    if (r.crisis) {
      for (const [terr, c] of Object.entries(r.crisis.suppressCostByTerrain || {}))
        suppressCostByTerrain[terr] = (suppressCostByTerrain[terr] ?? 0) + c;
    }
    // register-exhaustion: fraction of starting register still alive at end
    if (r.finalRealms) {
      const endPool = r.finalRealms.reduce((s, x) => s + (x.pool ?? 0), 0);
      regEnd += endPool;
      // bodiesStart is the exhaustion denominator captured at match start
      regStart += r.bodiesStart ?? endPool;
    }
    // scar differentiation (gate d): per-match spread of realm scar totals
    if (r.crisis && typeof r.crisis.rebelDead === 'number') scarValues.push(r.crisis.rebelDead);
  }
  return {
    total,
    drawRate: draws / total,                                   // CE-⑫(a) target ≤ 0.001
    warDensity2535: d2535 / total,                             // CE-⑫(b) chore-prevention…
    warDensity1525: d1525 / total,                             // …must be ≥ this
    registerExhaustionRate: regStart > 0 ? 1 - regEnd / regStart : 0, // new watch item
    suppressCostByTerrain,                                     // CE-⑯ per-terrain differential
    rebelDeadMeanPerMatch: scarValues.length
      ? scarValues.reduce((s, x) => s + x, 0) / scarValues.length : 0,
  };
}
```

Add `crisisGateReport` to `map-board.js`'s `_api`/`module.exports`.

- [ ] **Step 5: Run test to verify it passes**

Run: `node --test tests/crisis-arc.test.js`
Expected: PASS (all crisis tests).

- [ ] **Step 6: Full suite**

Run: `npm test`
Expected: 248 + crisis pass, 0 fail.

- [ ] **Step 7: Manual measurement smoke (record the numbers for the user)**

Run a slightly larger crisis-on vs crisis-off comparison and capture the CE-⑫ gate lines (do NOT seal any dial — this is the first read for the co-analysis session):

```bash
node -e '
const MB=require("./mockup/combat-calc/map-board.js");
const T=require("./mockup/combat-calc/tournament.js");
const {CRADLE_MAP}=require("./mockup/combat-calc/map-gen.js");
const {viableBindings}=require("./mockup/combat-calc/map-gate.js");
const b=viableBindings(CRADLE_MAP,5).viable.slice(0,3);
const off=MB.runCradleTournament({map:CRADLE_MAP,bindings:b,reps:4,seed:42});
const on=MB.runCradleTournament({map:CRADLE_MAP,bindings:b,reps:4,seed:42,harness:{crisis:{...T.HARNESS.crisis,enabled:true}}});
console.log("OFF decided%", off.filter(r=>r.winner).length/off.length);
console.log("ON  report", JSON.stringify(MB.crisisGateReport(on),null,1));
' 2>&1 | tee mockup/combat-calc/crisis-first-read.txt
```

Leave `crisis-first-read.txt` untracked (it is a working artifact for the co-analysis session, not a seal). Report the printed gate lines back to the user verbatim.

- [ ] **Step 8: Commit**

```bash
git add mockup/combat-calc/map-board.js mockup/combat-calc/tournament.js tests/crisis-arc.test.js
git commit -m "feat(crisis): sweep gate report (CE-⑫ + register-exhaustion + per-terrain suppression)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Post-implementation (NOT part of this plan's tasks — for the controller's hand-off)

1. **Co-analysis session** (user + agent): read `crisisGateReport` against the CE-⑫ gates and the two watch items; the dials in `HARNESS.crisis` are all 가안 and get tuned here, then sweep-adjudicated. Sweep dial #1 is `denialCoeff` (the forcing/delaying balance vs the ≤0.1% draw target).
2. **L2 fidelity debt** to register in `docs/SYNC-DEBT.md`: suppression cost (`suppressorDead`) is *measured* but not yet *deducted* from garrisons (Task 5 note) — a fidelity simplification to revisit if the sweep leans on it. Also: raid scar is attributed to the top-value held sector (L2 approximation of a realm-level raid event).
3. **Default flip** (future, mirrors AB-②): once the CE-⑫ sweep seals, flip `HARNESS.crisis.enabled` to `true`, adjudicate the test changes TDD-first, and re-baseline the record world. This is a separate sealed SYNC-DEBT step, not this plan.
4. **Gate-recalibration grill** reads POST-crisis data (dd semantics change under the crisis) — its own queued session.

---

## Self-Review

**Spec coverage (CE-⑬…⑳ + CE-④/⑥/⑦/⑧/⑪ mechanics):**
- CE-⑬ suppression = existing arithmetic, whole defense axis, no threshold/stamps, rebel side stack×terrain×⅓ lever 1 → Task 4 (`suppressAttrition`) + Task 5 (`suppressionBudget` = shield axis).
- CE-⑭.1 fuel = scar × intensity → Task 2 (scar) + Task 3 (`sectorFuel`). .2 cap = register share → Task 3. .3 death erases register → Task 5 (`poolBleed`). .4 ⅓ constant → Task 4. .5 raw denial → Task 7.
- CE-⑮ secession full-rise-freeze, no contagion, retake=occupation → Task 6 (+ scar-on-recapture already covered by Task 2's `captureSector` accrual).
- CE-⑯ gate-5 satisfied by structure; per-terrain differential watch → Task 4 (terrain in R) + Task 9 (`suppressCostByTerrain`).
- CE-⑰ peaceful cession scar-free → structural: settlement `acquireSector` writes no scar (only `captureSector`/raids/refusal do) — verified by the model, no task needed; note in Task 2.
- CE-⑱ truce canonized → Task 8 (`truceLength`, already-existing `H.truceTurns`).
- CE-⑲ white peace 0% rung → Task 8 (백지 preset); auto-trigger stays bot policy (unchanged stall path).
- CE-⑳ stage table → Task 8 (`overlayStage`/`availablePresets`); 최대+vassalage+패권 정산 survive.
- CE-④ arc 25→35 + linear rate → Task 1 (`crisisRate`, loop bound). CE-⑥ pay/refuse → Task 5/6. CE-⑦ pacification denial → Task 7. CE-⑧ σ=0 default → Task 5 (`suppressScar`). CE-⑪ Westphalian draw → Task 1.

**Placeholder scan:** Task 9 Step 2's first `runCradleTournament` call is a deliberately-marked placeholder to delete — flagged inline. No other TODO/TBD; every code step shows complete code.

**Type consistency:** `H.crisis` dial names are identical across tasks (`enabled/onset/hardEnd/rate0/rateStep/denialCoeff/secessionN/secessionFrac/suppressScar/refusalBurnPp/suppressBudgetFrac/terrainDef/stage/scarPerOccupation/scarPerRaid/rebelEffectiveness`). Helper names stable: `crisisRate`, `addScar`, `terrainOf`, `sectorFuel`, `sectorRegisterShare`, `growRebels`, `suppressAttrition`, `suppressionBudget`, `crisisTurn`, `boardRebelMass`, `overlayStage`, `availablePresets`, `truceLength`, `crisisGateReport`. Sector fields: `s.scar`, `s.rebelStack`, `s.neglect`, `s._refusedThisTurn`. World field: `world.seceded`. View field: `rebelDenial`.
