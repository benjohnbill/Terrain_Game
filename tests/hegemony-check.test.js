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
