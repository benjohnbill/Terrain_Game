'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const { CRADLE_MAP, CRADLE_BINDING } = require('../mockup/combat-calc/map-gen.js');
const { makeBoardFromMap, FG_BOARD_GAAN, FG_FORT_BY_CLASS } = require('../mockup/combat-calc/map-board.js');
const T = require('../mockup/combat-calc/tournament.js');

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

test('FG board sets fortCeil = the terrain-class fort tier per front', () => {
  const realms = makeBoardFromMap(CRADLE_MAP, CRADLE_BINDING, FG_BOARD_GAAN);
  for (const r of realms)
    for (const [nbr, cls] of Object.entries(r.frontClass))
      assert.strictEqual(r.fortCeil[nbr], FG_FORT_BY_CLASS[cls] ?? 'walls');
});

test('peacePrimary does not upgrade fort above the terrain ceiling', () => {
  // an open front (ceiling fieldworks) already at its ceiling stays there.
  // frontG on every front (and capitalGarrison) is held >= regenThreshold
  // (0.8) of its cap so the shattered-garrison regen gate at the top of
  // peacePrimary stays closed and execution actually reaches the
  // pol.peace 'fort' action where the fortCeil predicate lives — a fixture
  // that trips the regen gate returns 'regen' before ever touching fort.
  const me = {
    archetype: 'shield-first', _turn: 5, seatType: 'flank',
    frontG: { X: 800, Y: 900 }, frontCap: { X: 900, Y: 900 },
    fortAt: { X: 'fieldworks', Y: 'walls' }, fortCeil: { X: 'fieldworks', Y: 'fortress' },
    capitalGarrison: 1500, pool: 5000, field: 0, fieldCap: 5000,
    treasury: 1e9, usable: 1, truce: {}, staging: false, wars: [],
  };
  const record = { presetOffers: [], regens: 0, raids: 0 };
  T.peacePrimary(me, [me], null, record);
  assert.strictEqual(me.fortAt.X, 'fieldworks', 'open front NOT pushed past fieldworks');
});
