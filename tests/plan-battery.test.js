'use strict';
// B7 — plan-AI battery aggregation (BATTERY.md outcome axes).
const test = require('node:test');
const assert = require('node:assert');

const { aggregate } = require('../mockup/combat-calc/plan-battery.js');

function rec(over = {}) {
  return {
    winner: null, endingShape: 'timeout', eliminations: 0, vassalDeals: 0,
    finalCheck: { leadershipShortfall: 4000 },
    planStats: { picks: {}, brained: 0, forced: 0, misjudged: 0 },
    ...over,
  };
}

test('aggregate reports decided%, shortfall, shapes, and plan telemetry', () => {
  const records = [
    rec({ winner: 'A', endingShape: 'trip-solo', eliminations: 2, vassalDeals: 1,
      planStats: { picks: { Flanking: 3, DP: 1 }, brained: 4, forced: 1, misjudged: 1 } }),
    rec({ finalCheck: { leadershipShortfall: 5000 },
      planStats: { picks: { DP: 2 }, brained: 2, forced: 2, misjudged: 0 } }),
    rec({ finalCheck: { leadershipShortfall: 3000 } }),
  ];
  const a = aggregate(records);
  assert.equal(a.matches, 3);
  assert.ok(Math.abs(a.decidedPct - 100 / 3) < 1e-9);
  assert.equal(a.meanShortfall, 4000); // mean over UNDECIDED worlds only
  assert.equal(a.eliminations, 2);
  assert.equal(a.vassalDeals, 1);
  assert.deepEqual(a.shapes, { 'trip-solo': 1, timeout: 2 });
  assert.deepEqual(a.planHist, { Flanking: 3, DP: 3 });
  assert.equal(a.brained, 6);
  assert.ok(Math.abs(a.forcedPct - 50) < 1e-9);   // 3 forced / 6 brained
  assert.ok(Math.abs(a.misjudgedPct - 100 / 6) < 1e-9);
});

test('aggregate reports decision-timing ruler (envelope%, median, bins)', () => {
  const records = [
    rec({ winner: 'A', tripTurn: 6 }),   // 1-8 bin, pre-envelope
    rec({ winner: 'B', tripTurn: 12 }),  // 9-14 bin, pre-envelope
    rec({ winner: 'C', tripTurn: 18 }),  // 15-20 bin, ENVELOPE
    rec({ winner: 'D', tripTurn: 22 }),  // 21-25 bin, ENVELOPE
    rec({ winner: 'E', tripTurn: 25 }),  // 21-25 bin, ENVELOPE (inclusive upper)
    rec({ winner: 'F', tripTurn: 30 }),  // 26-32 bin, post-envelope
    rec(),                               // timeout (winner null, no tripTurn)
    rec(),                               // timeout
  ];
  const a = aggregate(records);
  assert.equal(a.matches, 8);
  // 3 of 8 matches tripped inside 15-25
  assert.ok(Math.abs(a.envelopePct - (3 / 8) * 100) < 1e-9);
  // decided trip turns sorted: [6,12,18,22,25,30] → upper median (median_high, floor(n/2)) = index 3 = 22
  assert.equal(a.medianTripTurn, 22);
  assert.deepEqual(a.tripTurnBins, {
    '1-8': 1, '9-14': 1, '15-20': 1, '21-25': 2, '26-32': 1,
  });
});

test('aggregate timing ruler handles an all-timeout batch', () => {
  const a = aggregate([rec(), rec()]);
  assert.equal(a.envelopePct, 0);
  assert.equal(a.medianTripTurn, null);
  assert.deepEqual(a.tripTurnBins, {
    '1-8': 0, '9-14': 0, '15-20': 0, '21-25': 0, '26-32': 0,
  });
});
