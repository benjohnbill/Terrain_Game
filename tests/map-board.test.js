'use strict';
// L2 adapter — cradle map → tournament board factory (map-board.js).
// Board start-state constants (garrison sizing, field fraction) are
// HARNESS-tier 가안, but everything geography-derived (caps, doors,
// fronts, economy) must come from the sealed CRADLE_MAP itself.

const { test } = require('node:test');
const assert = require('node:assert');

const { CRADLE_MAP, CRADLE_BINDING } = require('../mockup/combat-calc/map-gen.js');
const { loadMap } = require('../mockup/combat-calc/map-loader.js');
const { makeBoardFromMap, BOARD_GAAN } = require('../mockup/combat-calc/map-board.js');

const board = () => makeBoardFromMap(CRADLE_MAP, CRADLE_BINDING);

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
    assert.ok(Object.values(r.fortAt).every((f) => f === BOARD_GAAN.startFort));
    const garrisonTotal = Object.values(r.frontG).reduce((s, g) => s + g, 0)
      + r.interior * BOARD_GAAN.interiorGarrison + r.capitalGarrison;
    assert.strictEqual(r.pool, Math.round((r.field + garrisonTotal) * 1.5),
      `${r.name} pool = ×1.5 initial military (M13)`);
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
