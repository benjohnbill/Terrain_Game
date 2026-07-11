# Unassailability Affordability Bound Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bound the unassailability coalition's recruitment-futures credit by money (treasury + W×income along the surge curve) and bodies (civilian register) — the referee counts only what the world sells — plus an affordability-bind-rate instrument on the standing sweep.

**Architecture:** `hegemonyCheck` (match.js) gains a `futuresOf(rival)` helper computing `min(headroom, rate, money, bodies)` with a non-finite-input fallback to the legacy `min(headroom, rate)`; `checkView` (tournament.js) feeds it treasury/income/pool/serving; `finish()` copies the new `affordabilityBound` counters into `finalCheck`; `plan-battery.js` aggregates them into `affordBindRate`. No dial changes, no candidate-side changes, no panel changes (the denied-dominant bucket is the gate-vs-panel disagreement and re-baselines automatically).

**Tech Stack:** Node.js built-in test runner (`node --test`), CommonJS with the repo's dual-environment export idiom (match.js is ALSO browser-loaded by `mockup/combat-calc/map-mockup.html`). Design source: `docs/superpowers/specs/2026-07-11-unassailability-affordability-design.md`.

## Global Constraints

- **Dual environment (match.js):** `map-mockup.html` loads `econ.js` then `match.js` as browser modules; econ exposes `window.TC.econ` there. match.js must acquire econ via the guarded pattern shown in Task 1 — a bare top-level `require` would break the browser load.
- **Fixture byte-identity:** fixture boards (tournament `makeBoard()`) have `treasury` undefined→NaN and NaN `income`; match.js's standalone prototype fixtures have no money fields at all. The bound applies ONLY when treasury/income/pool/serving are all finite and pool > 0 — otherwise the futures term must be the legacy `Math.min(Math.max(0, fieldCap − field), Math.round(fieldCap × D.recruitPerTurn) × D.regenWindow)` exactly. Pre-existing fixture-suite outcomes must not change.
- **Cradle-board suites MAY legitimately shift outcome** at Task 2 (map-board matches start consulting the bound — the designed change). FIXTURE suites must not. If a cradle test fails an assertion, report it with the assertion and actual value — the controller adjudicates (same rule as the occupation-geography pass).
- **Determinism:** check-time snapshot only; binary search deterministic; no Date.now()/Math.random().
- **No new dials; no sealed-value changes:** W (`regenWindow` 6), `recruitPerTurn` 0.10, `shieldRatio` 1.7, DT-③ escape, candidate-side arithmetic all untouched.
- Tests: `npm test` (`node --test tests/*.test.js`). Baseline at plan start: **238/238 green**.
- Commit style: `feat(match-arc): ...`, trailer `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: Affordable futures in hegemonyCheck

Bound the coalition futures term in match.js; count money/bodies binds for the instrument. Pure arithmetic — no tournament.js change yet (map boards keep legacy behavior until Task 2 feeds the fields).

**Files:**
- Modify: `mockup/combat-calc/match.js` (module head ~line 10; the `coalition` reduce inside `hegemonyCheck` ~line 143–146; the return object ~line 156–163)
- Modify: `tests/hegemony-check.test.js` (append)

**Interfaces:**
- Consumes: `ECON.draftBill(register, iPre, iPost)` (econ.js, exported in `_api`; browser: `window.TC.econ`).
- Produces: rival view fields consumed when finite: `treasury`, `income`, `pool`, `serving` (numbers). `hegemonyCheck` return gains `affordabilityBound: { money, bodies, rivals }` (counts of in-balance rivals whose futures were strictly reduced by the money / bodies bound; `rivals` = in-balance count). All existing return fields unchanged.

- [ ] **Step 1: Write the failing tests**

Append to `tests/hegemony-check.test.js`:

```javascript
// ---- affordability bound (grill 2026-07-11): the referee counts only ----
// ---- what the world sells: futures = min(headroom, rate, money, bodies).

test('affordability: absent money/body fields → legacy futures, nothing bound', () => {
  const realms = [
    realm({ name: 'C', field: 6000, fieldCap: 6000, fronts: { R1: 2000 } }),
    realm({ name: 'R1', field: 2000, fieldCap: 7200, fronts: { C: 1500 } }),
  ];
  const c = hegemonyCheck(realms, 'C');
  // legacy futures for R1 = min(7200-2000, round(7200*0.10)*6) = min(5200, 4320) = 4320
  assert.equal(c.coalition, 2000 + 4320);
  assert.deepEqual(c.affordabilityBound, { money: 0, bodies: 0, rivals: 1 });
});

test('affordability: rich rival → identical to legacy, nothing bound', () => {
  const realms = [
    realm({ name: 'C', field: 6000, fieldCap: 6000, fronts: { R1: 2000 } }),
    realm({ name: 'R1', field: 2000, fieldCap: 7200, fronts: { C: 1500 },
      treasury: 1e9, income: 1e9, pool: 100000, serving: 1000 }),
  ];
  const c = hegemonyCheck(realms, 'C');
  assert.equal(c.coalition, 2000 + 4320);
  assert.deepEqual(c.affordabilityBound, { money: 0, bodies: 0, rivals: 1 });
});

test('affordability: empty wallet → futures 0, money bound counted', () => {
  const realms = [
    realm({ name: 'C', field: 6000, fieldCap: 6000, fronts: { R1: 2000 } }),
    realm({ name: 'R1', field: 2000, fieldCap: 7200, fronts: { C: 1500 },
      treasury: 0, income: 0, pool: 100000, serving: 1000 }),
  ];
  const c = hegemonyCheck(realms, 'C');
  assert.equal(c.coalition, 2000, 'no purchasable futures');
  assert.equal(c.affordabilityBound.money, 1);
});

test('affordability: bodies bind — register nearly exhausted', () => {
  const realms = [
    realm({ name: 'C', field: 6000, fieldCap: 6000, fronts: { R1: 2000 } }),
    realm({ name: 'R1', field: 2000, fieldCap: 7200, fronts: { C: 1500 },
      treasury: 1e9, income: 1e9, pool: 2100, serving: 2000 }),
  ];
  const c = hegemonyCheck(realms, 'C');
  assert.equal(c.coalition, 2000 + 100, 'only 100 civilians left to draft');
  assert.equal(c.affordabilityBound.bodies, 1);
});

test('affordability: partial wallet buys a middle amount (exact search)', () => {
  const ECON = require('../mockup/combat-calc/econ.js');
  const R1 = realm({ name: 'R1', field: 2000, fieldCap: 7200, fronts: { C: 1500 },
    treasury: 0, income: 0, pool: 100000, serving: 1000 });
  const fullBill = ECON.draftBill(R1.pool, R1.serving / R1.pool, (R1.serving + 4320) / R1.pool);
  R1.treasury = fullBill / 2;
  const realms = [
    realm({ name: 'C', field: 6000, fieldCap: 6000, fronts: { R1: 2000 } }), R1];
  const c = hegemonyCheck(realms, 'C');
  const bought = c.coalition - 2000;
  assert.ok(bought > 0 && bought < 4320, `bought ${bought}`);
  const bill = (m) => ECON.draftBill(R1.pool, R1.serving / R1.pool, (R1.serving + m) / R1.pool);
  assert.ok(bill(bought) <= R1.treasury && bill(bought + 1) > R1.treasury,
    'search result is the exact max affordable');
  assert.equal(c.affordabilityBound.money, 1);
});

test('affordability can flip unassailability (the wall opens for broke coalitions)', () => {
  // candShield = 4000 + 500 + 500 = 5000 → coalitionNeed = 1.7 × 5000 = 8500.
  // legacy: coalition = 2 × (2500 + 4320) = 13640 ≥ 8500 → denied.
  // broke rivals: coalition = 5000 < 8500 → unassailable.
  const mk = (afford) => [
    realm({ name: 'C', field: 4000, fieldCap: 4000, fronts: { R1: 500, R2: 500 } }),
    realm({ name: 'R1', field: 2500, fieldCap: 7200, fronts: { C: 1500 }, ...afford }),
    realm({ name: 'R2', field: 2500, fieldCap: 7200, fronts: { C: 1500 }, ...afford }),
  ];
  const denied = hegemonyCheck(mk({}), 'C');
  const open = hegemonyCheck(
    mk({ treasury: 0, income: 0, pool: 100000, serving: 1000 }), 'C');
  assert.equal(denied.unassailable, false, 'paper futures deny');
  assert.equal(open.unassailable, true, 'unaffordable futures do not');
  assert.equal(open.affordabilityBound.money, 2);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test tests/hegemony-check.test.js`
Expected: the five new affordability tests FAIL (`affordabilityBound` undefined; empty-wallet coalition still 6320). The absent-fields test may partially pass on the coalition value (legacy arithmetic) but fails on `affordabilityBound`.

- [ ] **Step 3: Implement**

In `mockup/combat-calc/match.js`, after the header comment block (before `const MATCH_DIALS`), add the dual-environment econ binding (map-mockup.html loads econ.js first, so `window.TC.econ` exists at eval time — the repo's accepted eval-time order coupling):

```javascript
// econ.js provides draftBill (surge-curve integral pricing) for the
// affordability bound. Node: require; browser (map-mockup.html): TC.econ,
// loaded one script ahead of this file.
const ECON = (typeof module !== 'undefined' && module.exports)
  ? require('./econ.js')
  : window.TC.econ;
```

In `hegemonyCheck`, replace the coalition reduce:

```javascript
  const coalition = inBalance.reduce((s, x) =>
    s + x.proj + Math.min(Math.max(0, x.realm.fieldCap - x.realm.field),
      Math.round(x.realm.fieldCap * D.recruitPerTurn) * D.regenWindow), 0);
```

with:

```javascript
  // recruitment futures — the referee counts only what the world sells
  // (affordability grill 2026-07-11): the same four bounds doRecruit
  // enforces on real drafts. headroom & rate are the legacy pair; money =
  // treasury + W turns of income priced along the surge curve (draftBill,
  // intensity rise included); bodies = the civilian register. Money/body
  // inputs absent or non-finite (fixture boards' NaN treasury, prototype
  // fixtures) → legacy min(headroom, rate) exactly.
  let boundMoney = 0; let boundBodies = 0;
  const futuresOf = (r) => {
    const headroom = Math.max(0, r.fieldCap - r.field);
    const rate = Math.round(r.fieldCap * D.recruitPerTurn) * D.regenWindow;
    const legacy = Math.min(headroom, rate);
    if (!Number.isFinite(r.treasury) || !Number.isFinite(r.income)
      || !Number.isFinite(r.pool) || !Number.isFinite(r.serving)
      || r.pool <= 0 || legacy === 0) return legacy;
    const bodies = Math.max(0, r.pool - r.serving);   // civilians
    const budget = r.treasury + D.regenWindow * r.income;
    const billFor = (men) =>
      ECON.draftBill(r.pool, r.serving / r.pool, (r.serving + men) / r.pool);
    let money = legacy;
    if (billFor(legacy) > budget) {                   // money binds below legacy
      let lo = 0; let hi = legacy;                    // draftBill monotonic in men
      while (lo < hi) {
        const mid = Math.ceil((lo + hi) / 2);
        if (billFor(mid) <= budget) lo = mid; else hi = mid - 1;
      }
      money = lo;
    }
    const futures = Math.min(legacy, money, bodies);
    if (money < legacy && futures === money) boundMoney++;
    else if (bodies < legacy && futures === bodies) boundBodies++;
    return futures;
  };
  const coalition = inBalance.reduce((s, x) => s + x.proj + futuresOf(x.realm), 0);
```

In the return object, after `coalition, coalitionNeed, unassailable,` add:

```javascript
    affordabilityBound: { money: boundMoney, bodies: boundBodies, rivals: inBalance.length },
```

- [ ] **Step 4: Run tests**

Run: `node --test tests/hegemony-check.test.js` → PASS (all, including the pre-existing DT-③ tests — their fixtures carry no money fields, so the legacy path pins them).
Then: `npm test` → Expected **244/244** (238 + 6). Nothing consumes the fields yet — cradle and fixture outcomes identical. If any pre-existing test changes outcome, STOP and report (fallback-guard bug).

- [ ] **Step 5: Commit**

```bash
git add mockup/combat-calc/match.js tests/hegemony-check.test.js
git commit -m "feat(match-arc): affordability-bound recruitment futures in unassailability

The coalition futures credit becomes min(headroom, rate, money, bodies)
- the same bounds doRecruit enforces on real drafts (surge-curve
draftBill + civilian register). Non-finite money/body inputs fall back
to the legacy pair exactly (fixture NaN treasury, prototype fixtures).
Returns affordabilityBound counters for the standing instrument.
Design: docs/superpowers/specs/2026-07-11-unassailability-affordability-design.md

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Feed the gate — checkView money/body fields + finalCheck instrument

Wire the live world into the bound: map-board realms expose treasury/income/pool/serving through `checkView`; the timeout autopsy (`finish`) copies the bind counters into `finalCheck`.

**Files:**
- Modify: `mockup/combat-calc/tournament.js` (`checkView` ~line 233; `finish()`'s `cand` object ~line 1066–1071; `module.exports` — add `checkView`)
- Create: `tests/affordability-gate.test.js`

**Interfaces:**
- Consumes: Task 1's field contract (`treasury`/`income`/`pool`/`serving` finite ⇒ bound applies); existing `realmIncome(r)`, `servingBodies(r)` (both defined below checkView — runtime call order makes this safe, the file's existing pattern).
- Produces: `checkView` exported; view realms carry the four fields; `record.finalCheck.affordabilityBound` (`{ money, bodies, rivals }`) on every finished record.

- [ ] **Step 1: Write the failing tests**

Create `tests/affordability-gate.test.js`:

```javascript
'use strict';
// Affordability bound wiring (grill 2026-07-11): checkView feeds the gate
// money/body fields on map boards; fixture boards fall back to legacy.
const test = require('node:test');
const assert = require('node:assert');
const { CRADLE_MAP } = require('../mockup/combat-calc/map-gen.js');
const { viableBindings } = require('../mockup/combat-calc/map-gate.js');
const MB = require('../mockup/combat-calc/map-board.js');
const T = require('../mockup/combat-calc/tournament.js');
const M = require('../mockup/combat-calc/match.js');

const BINDING = viableBindings(CRADLE_MAP, 5).viable[0];
const mapBoard = () => MB.makeBoardFromMap(CRADLE_MAP, BINDING);

test('checkView carries finite money/body fields on map boards', () => {
  const view = T.checkView(mapBoard());
  for (const v of view) {
    assert.ok(Number.isFinite(v.treasury), `${v.name} treasury`);
    assert.ok(Number.isFinite(v.income), `${v.name} income`);
    assert.ok(Number.isFinite(v.pool) && v.pool > 0, `${v.name} pool`);
    assert.ok(Number.isFinite(v.serving), `${v.name} serving`);
  }
});

test('fixture board: gate falls back to legacy futures (money fields non-finite)', () => {
  const view = T.checkView(T.makeBoard());
  const c = M.hegemonyCheck(view, view[0].name);
  assert.deepEqual(c.affordabilityBound,
    { money: 0, bodies: 0, rivals: c.inBalance.length });
});

test('finalCheck carries the affordability instrument on a timeout record', () => {
  const board = mapBoard();
  const assign = Object.fromEntries(board.map((r, i) =>
    [r.name, { archetype: i === 0 ? 'interior-lines' : 'shield-first',
      temperament: '표준' }]));
  const rec = T.runMatch(assign, { seed: 5, board, harness: { maxTurns: 4 } });
  assert.ok(rec.finalCheck && rec.finalCheck.affordabilityBound,
    'autopsy exposes the bind counters');
  const ab = rec.finalCheck.affordabilityBound;
  assert.ok(ab.rivals >= 0 && ab.money >= 0 && ab.bodies >= 0);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test tests/affordability-gate.test.js`
Expected: FAIL — `T.checkView is not a function` (not exported), then field assertions once exported.

- [ ] **Step 3: Implement**

`checkView` (~line 233) — add the four fields to the mapped object:

```javascript
function checkView(realms) {
  return realms.map((r) => ({
    name: r.name, alive: r.alive, vassalOf: r.vassalOf,
    field: r.field, fieldCap: r.fieldCap,
    garrisons: totalGarrisons(r),
    fronts: r.frontG,
    // affordability bound inputs (grill 2026-07-11): finite on map boards
    // (Option B treasury/income); NaN/undefined on fixtures → legacy path.
    treasury: r.treasury, income: realmIncome(r),
    pool: r.pool, serving: servingBodies(r),
    exits: r.staging ? r.exits.map((e) => ({ cap: e.cap === Infinity ? Infinity : e.cap * 2 })) : r.exits,
  }));
}
```

In `finish()`, in the `cand` object (after `candProj: c.candProj,`), add:

```javascript
      affordabilityBound: c.affordabilityBound,
```

Add `checkView` to `module.exports`.

- [ ] **Step 4: Run tests**

Run: `node --test tests/affordability-gate.test.js` → PASS (3 tests).
Then `npm test` → Expected **247/247** (244 + 3). The bound is now LIVE on all map-board matches: cradle integration suites MAY shift outcome (broke coalitions stop denying — designed). Fixture suites and match.js prototype tests must be unchanged. Report any cradle assertion failure with the assertion and actual value for controller adjudication.

- [ ] **Step 5: Commit**

```bash
git add mockup/combat-calc/tournament.js tests/affordability-gate.test.js
git commit -m "feat(match-arc): wire affordability inputs through checkView + autopsy

Map-board realms expose treasury/income/pool/serving to the gate (the
bound goes live on map boards; fixtures keep NaN -> legacy). finish()
copies affordabilityBound into finalCheck for the standing instrument.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Instrument — affordability-bind rate on the standing sweep

`aggregate()` exposes `affordBindRate` (share of in-balance rivals in undecided finals whose futures were money/body-bound); the `--growth` deep line prints it.

**Files:**
- Modify: `mockup/combat-calc/plan-battery.js` (`aggregate` — beside the existing `overhangs` block ~line 72 and return object ~line 98–102; the `--growth` deep-line `console.log` ~line 256)
- Modify: `tests/plan-battery.test.js` (extend the deep-diagnostics test)

**Interfaces:**
- Consumes: `r.finalCheck.affordabilityBound` from Task 2.
- Produces: `aggregate()` return gains `affordBindRate` (number | null); deep line gains `afford X%` (or `—`).

- [ ] **Step 1: Write the failing test**

In `tests/plan-battery.test.js`, extend the existing deep-diagnostics test: give the two undecided records `affordabilityBound` inside their `finalCheck` — `{ money: 2, bodies: 1, rivals: 4 }` and `{ money: 0, bodies: 1, rivals: 4 }` — and append:

```javascript
  // afford-bind rate over undecided finals: (2+1+0+1) / (4+4) = 0.5
  assert.equal(agg.affordBindRate, 0.5);
```

- [ ] **Step 2: Run to verify it fails**

Run: `node --test tests/plan-battery.test.js`
Expected: FAIL — `affordBindRate` undefined.

- [ ] **Step 3: Implement**

In `aggregate()`, beside the `overhangs` computation:

```javascript
  const abRows = undecided
    .map((r) => r.finalCheck && r.finalCheck.affordabilityBound)
    .filter((v) => v && v.rivals > 0);
  const abBound = abRows.reduce((s, v) => s + v.money + v.bodies, 0);
  const abRivals = abRows.reduce((s, v) => s + v.rivals, 0);
```

In the return object, after `coalitionOverhangMean`:

```javascript
    affordBindRate: abRivals ? abBound / abRivals : null,
```

In the `--growth` deep-line print, extend the template:

```javascript
        console.log(`    dd ${agg.deniedDominantCount} · overhang ${agg.coalitionOverhangMean === null ? '—' : Math.round(agg.coalitionOverhangMean)} · afford ${agg.affordBindRate === null ? '—' : (agg.affordBindRate * 100).toFixed(1) + '%'} · elim ${agg.eliminations} · vassal ${agg.vassalDeals}`);
```

- [ ] **Step 4: Run tests + smoke**

Run: `node --test tests/plan-battery.test.js` → PASS.
Then `npm test` → Expected **248/248** (247 + 1).
Smoke: `node mockup/combat-calc/plan-battery.js --growth --quick 2>&1 | head -12` → the deep lines now carry `afford N%` with a real number on map-board arms. Paste the real output head into your report.

- [ ] **Step 5: Commit**

```bash
git add mockup/combat-calc/plan-battery.js tests/plan-battery.test.js
git commit -m "feat(match-arc): affordability-bind-rate instrument on the growth sweep

aggregate() exposes affordBindRate (money/body-bound rival share among
undecided finals) and the --growth deep line prints it - the
anti-vacuousness proof that the new bound actually bites.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## After implementation (controller close-out — not TDD tasks)

1. **Measurement (the pass's validation):** `node mockup/combat-calc/plan-battery.js --growth` (full reps). The A-frac0 row is the NEW control (the bound bites at frac 0 too). Read against the v2 seal run (RULINGS OG-⑤): (1) dd no longer monotone in frac; (2) fgM9off decided% non-decreasing in frac; (3) guardrails stomp ≤ ~3%, fgM9off median ≥ 15; (4) affordBindRate clearly > 0. Comparability rider: dd is the gate-vs-panel disagreement — counts re-baseline across this surgery.
2. **frac adoption: USER decision** with the sweep in hand (design §6). Do not seal a coupling strength alone.
3. **Docs (mandatory-ADR trigger — win-condition arithmetic):** ADR 0033 (unassailability affordability bound) + ruling ⑪ `Amended by` stamp (seal-amends duty) + match-arc RULINGS entries (grill L0/L1 now, L2 stamp with the measured read) + INDEX/SYNC-DEBT/QUICKREF/term-inventory batch + `npm run lint:docs`.

## Out of scope (do NOT implement here)

fgM9on reserve-mechanism diagnosis (observation only); promoting the M9 reserve to the world of record; window/discount dial changes (route C); candidate-side futures (route B); capital stage ② wiring; any new dial.
