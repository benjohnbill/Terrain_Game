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
