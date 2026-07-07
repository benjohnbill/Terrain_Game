'use strict';
// L2 adapter — tournament.js plays on an injected cradle board instead
// of the built-in fixture board, and realm-level economy (sectorYield)
// overrides the flat harness sector value.

const { test } = require('node:test');
const assert = require('node:assert');

const TOURNEY = require('../mockup/combat-calc/tournament.js');
const { CRADLE_MAP, CRADLE_BINDING } = require('../mockup/combat-calc/map-gen.js');
const { makeBoardFromMap } = require('../mockup/combat-calc/map-board.js');

const SEATS = Object.keys(CRADLE_BINDING);

function cradleAssignment(archetype = 'conquest-snowball') {
  const a = {};
  for (const s of SEATS) a[s] = { archetype, temperament: '표준' };
  return a;
}

test('yieldReach honors a realm-level sectorYield over the harness flat value', () => {
  const flat = TOURNEY.yieldReach(
    { interior: 10, usable: 1.0 }, TOURNEY.HARNESS);
  assert.strictEqual(flat, 10 * TOURNEY.HARNESS.sectorValue);
  const real = TOURNEY.yieldReach(
    { interior: 10, usable: 1.0, sectorYield: 1.2 }, TOURNEY.HARNESS);
  assert.strictEqual(real, 12);
});

test('runMatch plays on an injected board (cradle seats, not fixture seats)', () => {
  const record = TOURNEY.runMatch(cradleAssignment(), {
    seed: 7, board: makeBoardFromMap(CRADLE_MAP, CRADLE_BINDING),
  });
  assert.deepStrictEqual(
    record.finalRealms.map((r) => r.name).sort(), [...SEATS].sort());
  assert.ok(record.winner === null || SEATS.includes(record.winner));
  assert.ok(['timeout', 'trip-solo', 'trip-chain'].includes(record.endingShape));
});

test('runMatch with an injected board is seed-deterministic', () => {
  const run = () => TOURNEY.runMatch(cradleAssignment('raid-attrition'), {
    seed: 42, board: makeBoardFromMap(CRADLE_MAP, CRADLE_BINDING),
  });
  assert.deepStrictEqual(JSON.parse(JSON.stringify(run())),
    JSON.parse(JSON.stringify(run())));
});

test('runMatch without a board still plays the fixture seats (sheet-12 regression)', () => {
  const a = {};
  for (const s of TOURNEY.SEATS) a[s] = { archetype: 'shield-first', temperament: '표준' };
  const record = TOURNEY.runMatch(a, { seed: 3 });
  assert.deepStrictEqual(
    record.finalRealms.map((r) => r.name).sort(), [...TOURNEY.SEATS].sort());
});

test('record.finalCheck reports the closest hegemony candidate at match end', () => {
  const record = TOURNEY.runMatch(cradleAssignment(), {
    seed: 7, board: makeBoardFromMap(CRADLE_MAP, CRADLE_BINDING),
  });
  const fc = record.finalCheck;
  assert.ok(fc && SEATS.includes(fc.name));
  assert.ok(typeof fc.leadershipShortfall === 'number');
  assert.ok(typeof fc.coalitionOverhang === 'number');
  assert.strictEqual(typeof fc.leadership, 'boolean');
  assert.strictEqual(typeof fc.unassailable, 'boolean');
  if (record.winner) {
    assert.strictEqual(fc.name, record.winner);
    assert.strictEqual(fc.leadership && fc.unassailable, true);
  }
});
