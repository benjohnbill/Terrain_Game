# Domination Victory Check-Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the §6 domination-victory terminal to the hegemony gate so a realm that owns the board's offense but is blocked by the strict per-rival leadership bar (the `denied-dominant` wall) can still trip a decision.

**Architecture:** The decision point is `hegemonyCheck` in `mockup/combat-calc/match.js`. Today it trips on `leadership && unassailable`. This change RELAXES the offensive condition to `(leadership || dominance)` while REUSING the existing `unassailable` clause verbatim — the minimal, consistent change sealed as RULINGS DT-③ (Combo 2). `dominance` is a new pure computation over the same in-balance data already in the function; no new machinery, no change to unassailability, no change to any caller (`tournament.js` reads `c.trips` and labels a trip `hegemon` automatically).

**Tech Stack:** Node.js built-in test runner (`node --test`), CommonJS, no external deps.

## Global Constraints

- Sealed arithmetic (RULINGS DT-③, do not deviate): `trip = (leadership OR dominance) AND unassailable`.
- `dominance` = `forceShare >= 0.5` **OR** `candProj >= 2.5 * (strongest in-balance rival's projectable)`, where `forceShare = candProj / (candProj + Σ in-balance rivals' projectable)`. NO per-rival shield bar (that is leadership).
- `unassailable` is UNCHANGED and REUSED — do not touch the coalition / `coalitionNeed` / `regenWindow` logic. The 6-turn recruit look-ahead is the persistence guard; there is NO separate persistence counter.
- The two new dials are WINNER-rule dials and belong in `MATCH_DIALS`, NOT `PANEL_DIALS` (ET-①: measurement thresholds never become the winner rule). Values: `dominantForceShare: 0.5`, `dominationRatio: 2.5`.
- Additive to the returned object: every existing field of `hegemonyCheck`'s return stays; only `trips` changes semantics (now includes dominance) and new fields `dominance` / `forceShare` are added.
- `dominance`/`forceShare` are computed over IN-BALANCE realms only (hermits, projectable ≤ `projectionFloor` 1000, are excluded — mirrors the leadership/unassailability scope already in the function).
- Touch ONLY `mockup/combat-calc/match.js` and a new `tests/hegemony-check.test.js`. Do NOT edit `tournament.js` (it already reads `c.trips` and labels trips `hegemon`) or any other file.
- Tests run with `npm test` (`node --test tests/*.test.js`).
- Commit style: `feat(match-arc): ...` / `test(match-arc): ...`, present tense, repo Co-Authored-By trailer.

---

### Task 1: Domination victory (dominance OR-branch) in `hegemonyCheck`

Add a `dominance` computation to `hegemonyCheck` and widen the trip to `(leadership || dominance) && unassailable`, plus the two `MATCH_DIALS` values.

**Files:**
- Modify: `mockup/combat-calc/match.js` (`MATCH_DIALS` ~line 29; `hegemonyCheck` body ~line 144 and its `return` ~line 146-152)
- Create: `tests/hegemony-check.test.js`

**Interfaces:**
- Consumes: `hegemonyCheck(realms, candName, D = MATCH_DIALS)` where each realm is `{ name, field, fieldCap, garrisons, exits: [{cap}], alive, vassalOf, fronts? }`. `projectable(realm)` returns `realm.field` when any exit `cap === Infinity`, else `min(field, Σ cap × chokeFlow(2))`. In-balance rivals have `projectable > projectionFloor` (1000). The function already computes `candProj` (candidate side's projectable incl. vassals), `inBalance` (array of `{ realm, proj, inBalance }` for non-hermit rivals), `leadership` (bool), and `unassailable` (bool).
- Produces: the return object gains `dominance: boolean` and `forceShare: number`; `trips` becomes `(leadership || dominance) && unassailable`. `tournament.js:870` reads `c.trips` unchanged.

- [ ] **Step 1: Write the failing tests**

Create `tests/hegemony-check.test.js`:

```javascript
'use strict';
// §6 domination victory — the second hegemony terminal (RULINGS DT-③, Combo 2).
// trip = (leadership OR dominance) AND unassailable. Dominance owns the board's
// offense (forceShare ≥ 0.5 OR ≥ 2.5× the top rival) with NO per-rival shield
// bar — the escape for the denied-dominant wall. Unassailability is reused.
const test = require('node:test');
const assert = require('node:assert');
const { hegemonyCheck } = require('../mockup/combat-calc/match.js');

// Minimal realm: open border (exit cap Infinity) → projectable = field.
// fronts maps neighbourName → shield garrisons facing that neighbour.
function realm(over = {}) {
  return {
    name: 'X', field: 1000, fieldCap: 1000, garrisons: 0,
    exits: [{ cap: Infinity }], alive: true, vassalOf: null, fronts: {},
    ...over,
  };
}

test('domination: dominant + walled-out of leadership + unassailable → trips (the wall escapes)', () => {
  const realms = [
    realm({ name: 'C', field: 5000, fieldCap: 5000, fronts: { R1: 1000, R2: 1000 } }),
    realm({ name: 'R1', field: 1500, fieldCap: 1500, fronts: { C: 2000 } }),
    realm({ name: 'R2', field: 1500, fieldCap: 1500, fronts: { C: 2000 } }),
  ];
  const c = hegemonyCheck(realms, 'C');
  // forceShare = 5000 / (5000 + 1500 + 1500) = 0.625 ≥ 0.5 → dominant
  assert.equal(c.dominance, true);
  // leadership needs 5000 ≥ 1.7 × rival shield (1500 + 2000 = 3500 → 5950); 5000 < 5950 → false
  assert.equal(c.leadership, false);
  // unassailable: coalition = 1500 + 1500 (recruit 0, fieldCap = field) = 3000;
  //   candShield = 5000 + facing garrisons (1000 + 1000) = 7000; need 1.7 × 7000 = 11900; 3000 < 11900 → true
  assert.equal(c.unassailable, true);
  // OLD trips (leadership && unassailable) = false; NEW = (false || true) && true = true
  assert.equal(c.trips, true);
});

test('domination via the 2.5× ratio branch (forceShare < 0.5)', () => {
  const realms = [
    realm({ name: 'C', field: 5000, fieldCap: 5000, fronts: { R1: 1000, R2: 1000, R3: 1000 } }),
    realm({ name: 'R1', field: 1900, fieldCap: 1900, fronts: { C: 2000 } }),
    realm({ name: 'R2', field: 1900, fieldCap: 1900, fronts: { C: 2000 } }),
    realm({ name: 'R3', field: 1900, fieldCap: 1900, fronts: { C: 2000 } }),
  ];
  const c = hegemonyCheck(realms, 'C');
  // forceShare = 5000 / (5000 + 5700) = 0.467 < 0.5, but 5000 ≥ 2.5 × 1900 (4750) → dominant via ratio
  assert.equal(c.dominance, true);
  assert.equal(c.leadership, false); // 5000 < 1.7 × (1900 + 2000 = 3900 → 6630)
  assert.equal(c.unassailable, true); // coalition 5700 < 1.7 × (5000 + 3000 = 8000 → 13600)
  assert.equal(c.trips, true);
});

test('dominant but ASSAILABLE → no trip (unassailability still gates)', () => {
  const realms = [
    realm({ name: 'C', field: 5000, fieldCap: 5000, fronts: {} }), // no facing garrisons → candShield = 5000
    realm({ name: 'R1', field: 2000, fieldCap: 5000, fronts: { C: 1500 } }),
    realm({ name: 'R2', field: 2000, fieldCap: 5000, fronts: { C: 1500 } }),
  ];
  const c = hegemonyCheck(realms, 'C');
  // forceShare = 5000 / (5000 + 2000 + 2000) = 0.556 ≥ 0.5 → dominant
  assert.equal(c.dominance, true);
  // coalition = each rival's proj 2000 + recruit min(3000, round(500)×6 = 3000) = 5000; total 10000
  //   candShield 5000; need 1.7 × 5000 = 8500; 10000 ≥ 8500 → assailable
  assert.equal(c.unassailable, false);
  assert.equal(c.trips, false); // (leadership || true) && false = false
});

test('not dominant and not leadership → no trip (dominance does not over-fire)', () => {
  const realms = [
    realm({ name: 'C', field: 3000, fieldCap: 3000, fronts: { R1: 500, R2: 500 } }),
    realm({ name: 'R1', field: 2500, fieldCap: 2500, fronts: { C: 2000 } }),
    realm({ name: 'R2', field: 2500, fieldCap: 2500, fronts: { C: 2000 } }),
  ];
  const c = hegemonyCheck(realms, 'C');
  // forceShare = 3000 / 8000 = 0.375 < 0.5; 3000 < 2.5 × 2500 (6250) → NOT dominant
  assert.equal(c.dominance, false);
  assert.equal(c.leadership, false); // 3000 < 1.7 × (2500 + 2000 = 4500 → 7650)
  assert.equal(c.trips, false);
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL — the four new tests error because `c.dominance` is `undefined` and `c.trips` is still `leadership && unassailable` (so the two "→ trips" cases assert `true` but get `false`, and the dominance assertions get `undefined`). Every pre-existing test still passes.

- [ ] **Step 3: Add the two `MATCH_DIALS` values**

In `mockup/combat-calc/match.js`, inside `MATCH_DIALS`, right after the `recruitPerTurn: 0.10,` line (~line 29) and before the `// -- settlement` comment, add:

```javascript
  // -- domination victory (§6, RULINGS DT-③, Combo 2 — a WINNER-rule dial,
  //    intentionally NOT the PANEL_DIALS measurement copy) --
  dominantForceShare: 0.5, // candProj ≥ half of all in-balance projectable → dominant
  dominationRatio: 2.5,    // OR candProj ≥ 2.5× the strongest in-balance rival's projectable
```

- [ ] **Step 4: Compute `dominance` and widen the trip**

In `hegemonyCheck`, right after the line `const unassailable = coalition < coalitionNeed;` (~line 144) and before the `return {`, add:

```javascript
  // dominance (§6 domination terminal, RULINGS DT-③): owns the board's offense
  // — ≥ half of all in-balance projectable, OR ≥ dominationRatio× the top rival.
  // No per-rival shield bar (that is leadership); this is the wall's escape.
  const rivalProjSum = inBalance.reduce((s, x) => s + x.proj, 0);
  const totalInBalanceProj = candProj + rivalProjSum;
  const forceShare = totalInBalanceProj > 0 ? candProj / totalInBalanceProj : 0;
  const maxRivalProj = inBalance.length ? Math.max(...inBalance.map((x) => x.proj)) : 0;
  const dominance = forceShare >= D.dominantForceShare
    || (maxRivalProj > 0 ? candProj >= D.dominationRatio * maxRivalProj : true);
```

Then, in the `return { ... }` object, replace the line:

```javascript
    trips: leadership && unassailable,
```

with:

```javascript
    dominance, forceShare,
    trips: (leadership || dominance) && unassailable,
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — the four new tests are green.

IMPORTANT — the full suite must ALSO be green. The dominance branch only ADDS trips (it never removes one: `(leadership || dominance)` ⊇ `leadership`, and `unassailable` is unchanged), so any match that tripped before still trips. If a pre-existing INTEGRATION test (`tests/tournament-board.test.js`, `tests/match-panel.test.js`) now changes outcome (e.g. a fixture that used to time out now trips `hegemon` via dominance), STOP and report it in your report as a concern — do NOT silently edit that test. A changed outcome there is a real signal (the §6 effect reaching a fixture) and is the controller's call, not a mechanical fix.

- [ ] **Step 6: Commit**

```bash
git add mockup/combat-calc/match.js tests/hegemony-check.test.js
git commit -m "feat(match-arc): add domination victory (dominance OR-branch) to hegemony gate

The §6 domination terminal (RULINGS DT-③, Combo 2): the decision point now
trips on (leadership OR dominance) AND unassailable. Dominance = forceShare
>= 0.5 OR candProj >= 2.5x the top in-balance rival — owning the board's
offense with no per-rival shield bar, so the denied-dominant wall (a realm
blocked only by the strict leadership bar) can close the game. Unassailability
is reused verbatim (its 6-turn recruit look-ahead is the persistence guard;
no separate counter). Two WINNER-rule dials added to MATCH_DIALS (not the
PANEL_DIALS measurement copy, per ET-①). Additive: only trips changes
semantics; tournament.js labels a domination-trip hegemon automatically.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## After implementation (controller close-out, not TDD tasks)

These are handled by the controller after Task 1's review is clean — recorded here so nothing is dropped.

1. **Battery re-measurement (verification, feeds the §5 tuning pass).** Run `node mockup/combat-calc/plan-battery.js --fg` (full reps, not `--quick`). Read the now-built timing ruler line per arm: confirm (a) `decided%` rises on `fgM9off` (the ~31% denied-dominant wall converting to trips), and (b) the `envelope(15-25)` / `core(18-22)` / `median` move toward the DT-① target. This is a MEASUREMENT read, not a pass/fail gate — its result scopes the next lever (§5 growth tuning, DT-②). Record the before/after in the match-arc INDEX / a NOTES entry.

2. **SPEC.md domination win-type declaration (Tier-3, user-gated).** DT-③ sealed the mechanism at its match-arc birthplace; SPEC.md still describes only the single leadership terminal. Draft a SPEC.md amendment declaring domination victory as a second win-type (a summary + pointer to DT-③, per the single-definition rule — SPEC declares, the birthplace stays authoritative) and present the wording to the user for approval before committing. Do NOT silently edit SPEC.md.

3. **Doc-sync close-out.** After the measurement, update the match-arc INDEX §6 line and `docs/SYNC-DEBT.md` from "arithmetic sealed, implementation next" to "implemented + measured (result)". DT-③ itself is already sealed and synced.

## Out of scope (do NOT implement here)

- §5 growth-engine tuning (DT-②): the next lever, designed against this pass's re-measurement.
- The `denied-dominant` panel bucket definition (`match.js matchPanel`): unchanged — it stays the MEASUREMENT classifier (ET-①). §6 only changes the WINNER rule in `hegemonyCheck`.
- Any change to `unassailable`, `regenWindow`, `shieldRatio`, or the settlement / panel arithmetic.
