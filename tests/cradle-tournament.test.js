'use strict';
// L2 adapter — cradle tournament runner (7 viable seatings × archetype
// rotation) and the watch-flag report (region-holder performance).

const { test } = require('node:test');
const assert = require('node:assert');

const TOURNEY = require('../mockup/combat-calc/tournament.js');
const { CRADLE_MAP } = require('../mockup/combat-calc/map-gen.js');
const { viableBindings } = require('../mockup/combat-calc/map-gate.js');
const { runCradleTournament, watchFlags } = require('../mockup/combat-calc/map-board.js');

const oneBinding = viableBindings(CRADLE_MAP, 5).viable.slice(0, 1);

test('runs bindings × archetypes × seats × reps matches, tagged with their seating', () => {
  const records = runCradleTournament({
    map: CRADLE_MAP, bindings: oneBinding, reps: 1, seed: 11,
  });
  const seats = Object.keys(oneBinding[0]);
  assert.strictEqual(records.length,
    1 * TOURNEY.ARCHETYPES.length * seats.length * 1);
  for (const r of records) {
    assert.strictEqual(r.bindingIndex, 0);
    assert.deepStrictEqual(r.binding, oneBinding[0]);
    assert.deepStrictEqual(r.finalRealms.map((x) => x.name).sort(), [...seats].sort());
    assert.strictEqual(r.finalRealms.find((x) => x.name === r.seat).archetype, r.focal);
  }
});

test('cradle tournament is seed-deterministic', () => {
  const run = () => runCradleTournament({
    map: CRADLE_MAP, bindings: oneBinding, reps: 1, seed: 5,
  }).map((r) => `${r.seat}:${r.focal}:${r.winner}`);
  assert.deepStrictEqual(run(), run());
});

test('watchFlags reads region-holder winrate against the all-seat baseline', () => {
  const binding = { X: ['r1', 'r7'], Y: ['r2', 'r3'], Z: ['r4', 'r10'],
    W: ['r5', 'r6'], V: ['r8', 'r9'] };
  const rec = (winner) => ({ binding, winner });
  // 4 matches: r1-holder X wins 3, r8-holder V wins 1
  const records = [rec('X'), rec('X'), rec('X'), rec('V')];
  const flags = watchFlags(records, ['r1', 'r8', 'r9']);
  assert.strictEqual(flags.baseline, 4 / (4 * 5)); // decided ÷ seat-slots
  assert.strictEqual(flags.regions.r1.matches, 4);
  assert.strictEqual(flags.regions.r1.wins, 3);
  assert.strictEqual(flags.regions.r1.rate, 0.75);
  assert.strictEqual(flags.regions.r8.wins, 1);
  assert.strictEqual(flags.regions.r9.wins, 1); // V holds r8+r9
  assert.strictEqual(flags.regions.r9.rate, 0.25);
});

test('watchFlags ignores undecided matches in rates but counts them', () => {
  const binding = { X: ['r1', 'r7'], Y: ['r2', 'r3'] };
  const records = [{ binding, winner: null }, { binding, winner: 'X' }];
  const flags = watchFlags(records, ['r1']);
  assert.strictEqual(flags.regions.r1.matches, 2);
  assert.strictEqual(flags.regions.r1.wins, 1);
  assert.strictEqual(flags.undecided, 1);
});

test('pairFlags aggregates winrate per region-pair seat across seatings', () => {
  const { pairFlags } = require('../mockup/combat-calc/map-board.js');
  const b1 = { X: ['r1', 'r7'], Y: ['r2', 'r3'] };
  const b2 = { P: ['r1', 'r2'], Q: ['r3', 'r7'] };
  const records = [
    { binding: b1, winner: 'X' }, { binding: b1, winner: null },
    { binding: b2, winner: 'Q' },
  ];
  const flags = pairFlags(records);
  assert.strictEqual(flags['r1+r7'].matches, 2);
  assert.strictEqual(flags['r1+r7'].wins, 1);
  assert.strictEqual(flags['r1+r7'].rate, 0.5);
  assert.strictEqual(flags['r2+r3'].wins, 0);
  assert.strictEqual(flags['r3+r7'].wins, 1);
  assert.strictEqual(flags['r1+r2'].matches, 1);
});
