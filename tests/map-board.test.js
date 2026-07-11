'use strict';
// L2 adapter — cradle map → tournament board factory (map-board.js).
// Board start-state constants (garrison sizing, field fraction) are
// HARNESS-tier 가안, but everything geography-derived (caps, doors,
// fronts, economy) must come from the sealed CRADLE_MAP itself.

const { test } = require('node:test');
const assert = require('node:assert');

const { CRADLE_MAP, CRADLE_BINDING } = require('../mockup/combat-calc/map-gen.js');
const { loadMap } = require('../mockup/combat-calc/map-loader.js');
const { makeBoardFromMap, BOARD_GAAN, FG_FORT_BY_CLASS } = require('../mockup/combat-calc/map-board.js');

const board = () => makeBoardFromMap(CRADLE_MAP, CRADLE_BINDING);

test('record world is the factory default (AB-② seal): FG forts + M9 + capLandFrac 1', () => {
  const { HARNESS } = require('../mockup/combat-calc/tournament.js');
  assert.strictEqual(HARNESS.capLandFrac, 1,
    'land-ceiling coupling defaults to the record world (frac 0 stays the explicit control)');
  const tiers = new Set();
  for (const r of board()) {
    assert.strictEqual(r.forceGeo, true, `${r.name} defaults to the FG board`);
    assert.strictEqual(r.m9Reserve, true, `${r.name} defaults to M9 reserve on`);
    for (const f of Object.values(r.fortAt)) tiers.add(f);
  }
  assert.ok(tiers.size >= 2, `record-world forts vary by crossing class, got ${[...tiers]}`);
});

test('builds one realm per seat, alive, no vassals', () => {
  const realms = board();
  assert.deepStrictEqual(realms.map((r) => r.name).sort(),
    Object.keys(CRADLE_BINDING).sort());
  for (const r of realms) {
    assert.strictEqual(r.alive, true);
    assert.strictEqual(r.vassalOf, null);
  }
});

test('fieldCap is the real parity cap (7,200 per two-region seat)', () => {
  for (const r of board()) assert.strictEqual(r.fieldCap, 7200);
});

test('start field is the parity fraction of cap, equal for all seats', () => {
  const realms = board();
  const want = Math.round(7200 * BOARD_GAAN.startFieldFrac);
  for (const r of realms) assert.strictEqual(r.field, want);
});

test('exits and front keys match the loader-derived graph', () => {
  const realms = board();
  const { realms: viewRealms } = loadMap(CRADLE_MAP, { assignment: CRADLE_BINDING });
  for (const r of realms) {
    const view = viewRealms.find((v) => v.name === r.name);
    assert.deepStrictEqual(
      r.exits.map((e) => e.cap).sort((a, b) => a - b),
      view.exits.map((e) => e.cap).sort((a, b) => a - b),
      `${r.name} exits`);
    assert.deepStrictEqual(
      Object.keys(r.frontG).sort(), Object.keys(view.fronts).sort(),
      `${r.name} front keys`);
  }
});

test('front garrisons scale with border-sector count (mature-state gaan)', () => {
  const realms = board();
  for (const r of realms) {
    for (const [nbr, g] of Object.entries(r.frontG)) {
      assert.ok(g > 0, `${r.name} vs ${nbr} shield must exist`);
      assert.strictEqual(g % BOARD_GAAN.garrisonPerBorderSector, 0,
        `${r.name} vs ${nbr} = k × per-sector garrison`);
    }
    // regen targets mirror the start shield
    assert.deepStrictEqual(r.frontCap, r.frontG);
  }
});

test('economy derives from the real sector ledger — the crown reaches L2', () => {
  const realms = board();
  const mapEcon = {};
  for (const [seat, rids] of Object.entries(CRADLE_BINDING)) {
    mapEcon[seat] = Object.values(CRADLE_MAP.sectors)
      .filter((s) => rids.includes(s.regionId))
      .reduce((t, s) => t + s.economyValue, 0);
  }
  for (const r of realms) {
    assert.ok(Math.abs(r.yieldBase - mapEcon[r.name]) < 1e-6,
      `${r.name} yieldBase == Σ sector economyValue`);
    assert.ok(r.sectorYield > 0);
    assert.ok(Math.abs(r.sectorYield * r.interior - r.yieldBase) < 1e-6,
      `${r.name} sectorYield × interior == yieldBase`);
  }
  const a = realms.find((r) => r.name === 'A');
  for (const r of realms.filter((x) => x.name !== 'A')) {
    assert.ok(a.yieldBase > r.yieldBase,
      `crown: A(중원+한경) out-earns ${r.name}`);
  }
});

test('carries every field the war machine reads', () => {
  for (const r of board()) {
    assert.strictEqual(r.usable, 1.0);
    assert.strictEqual(typeof r.capitalGarrison, 'number');
    assert.ok(r.interior > 0);
    assert.deepStrictEqual(r.truce, {});
    assert.deepStrictEqual(r.wars, []);
    for (const [n, f] of Object.entries(r.fortAt))
      assert.strictEqual(f, FG_FORT_BY_CLASS[r.frontClass[n]] ?? BOARD_GAAN.startFort,
        `${r.name}→${n} default fort follows the FG crossing-class mapping`);
    const pop = Object.values(CRADLE_MAP.sectors)
      .filter((s) => r.regionIds.includes(s.regionId))
      .reduce((t, s) => t + s.populationValue, 0);
    assert.strictEqual(r.pool, Math.round(pop * BOARD_GAAN.registerPerPop),
      `${r.name} register = registerPerPop × Σ populationValue (sealed 3.0 ratio)`);
    assert.strictEqual(BOARD_GAAN.registerPerPop, 1800,
      'sealed 2026-07-07: sustain fraction 1/3 → 600 = 1800/3');
    assert.ok(['center', 'flank'].includes(r.seatType));
  }
  const center = board().filter((r) => r.seatType === 'center');
  assert.strictEqual(center.length, 1);
  assert.ok(CRADLE_BINDING[center[0].name].includes('r1'),
    'center seat is the one holding 중원');
});

test('deterministic: two builds are identical', () => {
  assert.deepStrictEqual(JSON.parse(JSON.stringify(board())),
    JSON.parse(JSON.stringify(board())));
});

test('sealed start-state coordinates: armed-peace fill + Vauban garrison ratio', () => {
  // seals 2026-07-07 (research-anchored): f0 = 0.5 armed-peace field fill,
  // g0 = 1.0 garrisons full, rho = garrison:field ~0.75 (Vauban band)
  assert.strictEqual(BOARD_GAAN.startFieldFrac, 0.5);
  assert.strictEqual(BOARD_GAAN.garrisonPerBorderSector, 900);
  assert.strictEqual(BOARD_GAAN.capitalGarrison, 1500);
  const realms = board();
  let rhoSum = 0; let startIntSum = 0; let maxIntSum = 0;
  for (const r of realms) {
    const front = Object.values(r.frontCap).reduce((s, g) => s + g, 0);
    rhoSum += (front + r.capitalGarrison) / r.fieldCap;
    startIntSum += (r.field + front + r.capitalGarrison) / r.pool;
    maxIntSum += (r.fieldCap + front + r.capitalGarrison) / r.pool;
  }
  const n = realms.length;
  assert.ok(Math.abs(rhoSum / n - 0.75) < 0.02, `avg rho ${rhoSum / n}`);
  assert.ok(Math.abs(startIntSum / n - 0.42) < 0.02, `start intensity ${startIntSum / n}`);
  assert.ok(Math.abs(maxIntSum / n - 0.585) < 0.02, `structural max ${maxIntSum / n}`);
});
