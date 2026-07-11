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
