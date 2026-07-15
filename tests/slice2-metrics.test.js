const test = require('node:test');
const assert = require('node:assert/strict');
const B = require('../js/battle.js');
const G = require('../mockup/operational-layer/metrics.js');

/* These tests assert only what the SEALED arithmetic forces and what the grid
   structurally reports. They deliberately encode NO balance judgement — a
   "good" or "bad" rate is the reader's call, not the harness's. */

/* ---- metric 1: parity surface ---- */

test('parity grid runs deterministically and exposes the restoration knobs per cell', () => {
  const a = G.parityGrid();
  const b = G.parityGrid();
  assert.deepEqual(a.summary, b.summary);
  assert.ok(a.cells.length > 0);
  for (const c of a.cells) {
    assert.ok('fillFactor' in c.knobs);
    assert.ok('shieldCommit' in c.knobs);
    assert.ok('recoveryWhileMarching' in c.knobs);
  }
});

test('parity: at equal mass and equal levers, a worn attacker always loses the 결전', () => {
  // Forced by the power product: worn attacker power < fresh defender power at
  // equal mass/commit/quality. This is arithmetic, not a tuned outcome.
  const { cells } = G.parityGrid();
  const equalLeverWorn = cells.filter(c => c.commitDelta === 0 && c.qualityDelta === 0 && c.attackerWear > 0 && c.branch === 'DECISIVE');
  assert.ok(equalLeverWorn.length > 0);
  for (const c of equalLeverWorn) assert.equal(c.attackerWins, false);
});

test('parity: piercing is possible but demands a lever gap (the report locates the flip)', () => {
  const { summary } = G.parityGrid();
  // Some cell with a positive lever gap flips to an attacker win at max wear.
  assert.ok(summary.piercingWins > 0);
  // And the equal-lever band never does (mirror of the assertion above, summarised).
  assert.equal(summary.equalLeverWornAttackerWins, 0);
});

/* ---- metric 2: Swift Seizure success sweep ---- */

test('swift seizure success falls monotonically as the attacker marches farther', () => {
  const { byDistance } = G.swiftSeizureGrid();
  const rates = byDistance.map(d => d.successRate);
  for (let i = 1; i < rates.length; i++) assert.ok(rates[i] <= rates[i - 1] + 1e-12);
});

test('swift seizure success falls as the defensive multiplier rises', () => {
  const { byDefense } = G.swiftSeizureGrid();
  const soft = byDefense.find(d => d.terrain === 'plains' && d.fortification === 'none');
  const hard = byDefense.find(d => d.terrain === 'mountains' && d.fortification === 'fortress');
  assert.ok(soft.successRate >= hard.successRate);
});

test('swift seizure reports reserve-reach as its own axis', () => {
  const { byReach } = G.swiftSeizureGrid();
  assert.equal(byReach.length, 2);
  const reaches = byReach.find(r => r.reserveReaches === true);
  const pinned = byReach.find(r => r.reserveReaches === false);
  assert.ok(reaches && pinned);
  // A reachable reserve can contest the 결전; a pinned one cannot. No claim on
  // magnitude — only that both buckets are reported.
});

/* ---- metric 3: mass-inversion rate ---- */

test('mass inversion is exactly zero at equal wear and equal levers (land-derived guard)', () => {
  const { cells } = G.massInversionGrid();
  const clean = cells.filter(c => c.commitDelta === 0 && c.qualityDelta === 0 &&
                                  c.knobs.fillFactor === 0 && c.knobs.shieldCommit === null);
  assert.ok(clean.length > 0);
  for (const c of clean) assert.equal(c.inversion, false);
});

test('mass inversion becomes possible once a lever gap favours the smaller force', () => {
  const { summary } = G.massInversionGrid();
  assert.equal(summary.cleanEqualLeverInversions, 0);
  assert.ok(summary.leverGapInversions > 0);
});

/* ---- metric 4: commit-curve descriptive sweep (data only) ---- */

test('commit-curve sweep reports the sealed lever curve, non-decreasing, no decision', () => {
  const { points } = G.commitCurveGrid();
  assert.ok(points.length > 1);
  for (const p of points) assert.ok(Math.abs(p.lever - B.commitLever(p.commit)) < 1e-12);
  for (let i = 1; i < points.length; i++) {
    assert.ok(points[i].commit > points[i - 1].commit);
    assert.ok(points[i].lever >= points[i - 1].lever);
    assert.ok(points[i].R2 >= points[i - 1].R2 - 1e-12); // higher commit -> higher R2 at fixed matchup
  }
  // The report carries no verdict field — it is data, not a grading.
  assert.equal('decision' in G.commitCurveGrid(), false);
});

/* ---- top-level report ---- */

test('runAll bundles the four reads and is deterministic', () => {
  const a = G.runAll();
  const b = G.runAll();
  assert.deepEqual(a, b);
  assert.ok(a.parity && a.swiftSeizure && a.massInversion && a.commitCurve);
});
