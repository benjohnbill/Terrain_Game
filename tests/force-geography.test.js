'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const { CRADLE_MAP, CRADLE_BINDING } = require('../mockup/combat-calc/map-gen.js');
const { makeBoardFromMap, FG_BOARD_GAAN, FG_FORT_BY_CLASS } = require('../mockup/combat-calc/map-board.js');

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
