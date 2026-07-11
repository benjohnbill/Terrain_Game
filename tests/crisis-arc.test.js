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
