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

test('aggregate reports 18-22 tight-core%, mean/std, and per-turn histogram (hand-computed)', () => {
  const records = [
    rec({ winner: 'A', tripTurn: 16 }), // outside core
    rec({ winner: 'B', tripTurn: 18 }), // core
    rec({ winner: 'C', tripTurn: 20 }), // core
    rec({ winner: 'D', tripTurn: 22 }), // core (inclusive upper)
    rec({ winner: 'E', tripTurn: 24 }), // outside core
    rec(),                              // timeout
    rec(),                              // timeout
  ];
  const a = aggregate(records);
  assert.equal(a.matches, 7);
  // 3 of 7 matches (18, 20, 22) trip inside the 18-22 core; denominator is
  // ALL matches, same convention as envelopePct.
  assert.ok(Math.abs(a.core1822Pct - (3 / 7) * 100) < 1e-9);
  // decided trips [16,18,20,22,24] sum to 100 / 5 = 20 exactly.
  assert.equal(a.meanTripTurn, 20);
  // deviations from mean 20: [-4,-2,0,2,4] → squares [16,4,0,4,16] → sum 40
  // → population variance 40/5 = 8 → std = sqrt(8) = 2*sqrt(2).
  assert.ok(Math.abs(a.stdTripTurn - Math.sqrt(8)) < 1e-9);
  assert.deepEqual(a.tripTurnHist, { 16: 1, 18: 1, 20: 1, 22: 1, 24: 1 });
});

test('aggregate 18-22 core/mean/std/hist all-timeout edge case', () => {
  const a = aggregate([rec(), rec()]);
  assert.equal(a.core1822Pct, 0);
  assert.equal(a.meanTripTurn, null);
  assert.equal(a.stdTripTurn, null);
  assert.deepEqual(a.tripTurnHist, {});
});

test('aggregate: deep diagnostics — denied-dominant count + overhang mean', () => {
  const recs = [
    { winner: 'A', tripTurn: 20, eliminations: 1, vassalDeals: 0,
      panel: { bucket: 'hegemon', sides: [] },
      // decided record carries its own finalCheck (with a wildly different
      // coalitionOverhang, 99999) so this test would FAIL if aggregate ever
      // averaged over all records instead of undecided-only — a decided
      // record with no finalCheck at all can't distinguish the two scopings.
      finalCheck: { coalitionOverhang: 99999, leadershipShortfall: 0, candProj: 1 } },
    { winner: null, eliminations: 0, vassalDeals: 1,
      panel: { bucket: 'denied-dominant', sides: [] },
      finalCheck: { coalitionOverhang: 4000, leadershipShortfall: 100, candProj: 1, affordabilityBound: { money: 2, bodies: 1, rivals: 4 } } },
    { winner: null, eliminations: 0, vassalDeals: 0,
      panel: { bucket: 'denied-dominant', sides: [] },
      finalCheck: { coalitionOverhang: 2000, leadershipShortfall: 200, candProj: 1, affordabilityBound: { money: 0, bodies: 1, rivals: 4 } } },
  ];
  const agg = aggregate(recs);
  assert.equal(agg.deniedDominantCount, 2);
  assert.equal(agg.coalitionOverhangMean, 3000);
  assert.equal(agg.eliminations, 1);
  assert.equal(agg.vassalDeals, 1);
  // afford-bind rate over undecided finals: (2+1+0+1) / (4+4) = 0.5
  assert.equal(agg.affordBindRate, 0.5);
});
