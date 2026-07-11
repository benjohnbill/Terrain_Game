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
  assert.ok(record.crisis.rebelDead > 0, 'suppression killed rebels this turn');
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

// CE-⑮ edge case: a sector suppressed to EXACTLY zero stack must still reset
// its neglect counter (the reviewer's finding on Task 6 — a zero-stack guard
// evaluated at the top of the refusal/secession scan can "continue" past the
// reset branch entirely). Note on constructing R >= the full-kill threshold:
// under the sealed MATCH_DIALS.shieldRatio (1.7), suppressAttrition's R is
// pinned at exactly shieldRatio whenever the suppression budget does not
// bind (rebelEffectiveness/terrain cancel identically between the per-sector
// power cap and rebelDef — no HARNESS.crisis dial can move it), capping the
// kill fraction at ~25%/turn — never enough to zero a stack in one pass. A
// temporarily inflated shieldRatio is the only deterministic way to drive
// full annihilation and exercise the exact-zero edge case.
test('a sector suppressed to exactly zero stack still resets its neglect counter (CE-⑮ edge case)', () => {
  const match = require('../mockup/combat-calc/match.js');
  const savedShieldRatio = match.MATCH_DIALS.shieldRatio;
  try {
    match.MATCH_DIALS.shieldRatio = 100; // force R past the full-kill threshold
    const Crefuse = { ...T.HARNESS.crisis, enabled: true, rate0: 0.5, rateStep: 0,
      suppressBudgetFrac: 0, secessionN: 2 };
    const Hrefuse = { ...T.HARNESS, crisis: Crefuse };
    const Hsuppress = { ...T.HARNESS, crisis: { ...Crefuse, suppressBudgetFrac: 1 } };

    const r = tinyCrisisRealm('R');
    r.world.seceded = new Map();
    const record = { crisis: {} };
    const sA = r.world.sectors.get('Ra');

    T.crisisTurn([r], 26, Hrefuse, record); // turn 1: zero budget -> refused
    assert.strictEqual(sA.neglect, 1, 'refused turn bumps neglect to 1');
    assert.ok(sA.rebelStack > 0, 'stack still standing going into the suppression turn');

    T.crisisTurn([r], 27, Hsuppress, record); // turn 2: full budget -> driven to exactly 0
    assert.strictEqual(sA.rebelStack, 0, 'suppression fully annihilated the stack this turn');
    assert.strictEqual(sA._refusedThisTurn, false, 'sector was suppressed (not refused) this turn');
    assert.strictEqual(sA.neglect, 0, 'CE-⑮: suppressed sector resets neglect even at zero stack');

    T.crisisTurn([r], 28, Hrefuse, record); // turn 3: refuse once more (secessionN-1 = 1 turn)
    assert.strictEqual(sA.neglect, 1, 'neglect restarted from the mid-sequence reset, not from turn 1');
    assert.ok(r.holds.has('Ra'), 'mid-sequence suppression reset means it must NOT secede on the old schedule');
  } finally {
    match.MATCH_DIALS.shieldRatio = savedShieldRatio;
  }
});
