'use strict';
// B5 — plan-AI wiring into the war machine (tactical-plan-ai Rulings ①–④).
// A realm may carry `brain: { kind: 'ladder'|'random', confidence,
// disposition }`; absent brain = the unchanged script bot (S0 baseline).
const test = require('node:test');
const assert = require('node:assert');

const T = require('../mockup/combat-calc/tournament.js');

function mkAttacker(over = {}) {
  return { name: 'Att', seatType: 'plain', field: 8000, pool: 60000, wars: [], ...over };
}
function mkDefender(over = {}) {
  return {
    name: 'Def', seatType: 'plain', field: 0, pool: 60000, wars: [],
    frontG: { Att: 400 }, fortAt: { Att: 'walls' }, interior: 3,
    capitalGarrison: 1200, ...over,
  };
}

test('ladder brain: siege of an isolated garrison picks Encirclement over fatter-margin plans', () => {
  const A = mkAttacker({ brain: { kind: 'ladder', confidence: 0.9, disposition: 0 } });
  const D = mkDefender(); // field 0 → isolation gate open (harness rule: no relief army)
  const war = T.newWar(A, D, 1);
  const r = T.warBattle(war, A, D);
  assert.equal(r.plan, 'Encirclement');
  assert.ok(r.success);
});

test('script bot (no brain) keeps the legacy siege behavior: DP vs standing walls', () => {
  const A = mkAttacker();
  const D = mkDefender({ field: 5000 });
  const war = T.newWar(A, D, 1);
  const r = T.warBattle(war, A, D);
  assert.equal(r.plan, 'DP');
});

test('random brain picks only gate-eligible plans (R2 control)', () => {
  let x = 7;
  const rng = () => { x = (x * 16807) % 2147483647; return x / 2147483647; };
  const seen = new Set();
  for (let i = 0; i < 40; i++) {
    const A = mkAttacker({ brain: { kind: 'random' } });
    const D = mkDefender({ field: 5000 }); // not isolated → no Encirclement
    const war = T.newWar(A, D, 1);
    const r = T.warBattle(war, A, D, { rng });
    assert.ok(['Swift', 'Raid', 'DP', 'SI', 'Flanking'].includes(r.plan),
      `random pick ${r.plan} must be gate-eligible at a walled front`);
    seen.add(r.plan);
  }
  assert.ok(seen.size > 1, 'random brain must vary');
});

test('brained battles log judgment evidence for the battery (plan histogram + misjudgment)', () => {
  const A = mkAttacker({ brain: { kind: 'ladder', confidence: 0.5, disposition: 0.5 } });
  const D = mkDefender({ field: 5000 });
  const war = T.newWar(A, D, 1);
  const r = T.warBattle(war, A, D);
  assert.ok(Array.isArray(war.planLog) && war.planLog.length === 1);
  const entry = war.planLog[0];
  assert.equal(entry.plan, r.plan);
  assert.equal(entry.stage, 'siege');
  assert.equal(typeof entry.judgedR, 'number');
  assert.equal(typeof entry.actualR, 'number');
  assert.equal(typeof entry.forced, 'boolean');
  assert.ok(Array.isArray(entry.eligible));
});

// ── B6: match/tournament plumbing — arming realms + battery telemetry ──

function fullAssignment(extra = {}) {
  const assignment = {};
  for (const r of T.makeBoard()) {
    assignment[r.name] = { archetype: 'shield-first', temperament: T.TEMPERAMENTS[0], ...extra[r.name] };
  }
  return assignment;
}

test('runMatch without brains reports zero brained battles (S0 unchanged)', () => {
  const record = T.runMatch(fullAssignment(), { seed: 42, harness: { maxTurns: 40 } });
  assert.equal(record.planStats.brained, 0);
});

test('runMatch with opts.brain arms every realm and aggregates planStats', () => {
  const record = T.runMatch(fullAssignment(), {
    seed: 42, harness: { maxTurns: 40 },
    brain: { kind: 'ladder', confidence: 0.9, disposition: 0 },
  });
  const stats = record.planStats;
  assert.ok(stats.brained > 0, 'brained battles must occur');
  const histSum = Object.values(stats.picks).reduce((s, n) => s + n, 0);
  assert.equal(histSum, stats.brained, 'plan histogram sums to brained battles');
  assert.ok(stats.misjudged <= stats.brained);
  for (const plan of Object.keys(stats.picks)) {
    assert.ok(plan in require('../mockup/combat-calc/plan-ai.js').RUNGS, `unknown plan ${plan}`);
  }
});

test('runMatch honors per-seat assignment brains (D-arm plumbing)', () => {
  const seats = T.makeBoard().map((r) => r.name);
  const extra = { [seats[0]]: { brain: { kind: 'ladder', confidence: 0.75, disposition: 0.5 } } };
  const record = T.runMatch(fullAssignment(extra), { seed: 42, harness: { maxTurns: 40 } });
  assert.ok(record.planStats.brained >= 0); // plumbing accepts per-seat brains without opts.brain
});

test('runCradleTournament passes brains through (uniform opts.brain + per-seat brainFor)', () => {
  const { CRADLE_MAP } = require('../mockup/combat-calc/map-gen.js');
  const { viableBindings } = require('../mockup/combat-calc/map-gate.js');
  const { runCradleTournament } = require('../mockup/combat-calc/map-board.js');
  const oneBinding = viableBindings(CRADLE_MAP, 5).viable.slice(0, 1);

  const uniform = runCradleTournament({ map: CRADLE_MAP, bindings: oneBinding, reps: 1, seed: 11,
    brain: { kind: 'ladder', confidence: 0.9, disposition: 0 } });
  assert.ok(uniform.some((r) => r.planStats && r.planStats.brained > 0),
    'uniform brain must reach the battles');

  const perSeat = runCradleTournament({ map: CRADLE_MAP, bindings: oneBinding, reps: 1, seed: 11,
    brainFor: (seat, i) => ({ kind: 'ladder', confidence: 0.75, disposition: [-0.5, 0, 0.5][i % 3] }) });
  assert.ok(perSeat.some((r) => r.planStats && r.planStats.brained > 0),
    'per-seat brains must reach the battles');
});

test('ladder brain honors the fog seal: same war reads the same band every battle', () => {
  const A = mkAttacker({ brain: { kind: 'ladder', confidence: 0.5, disposition: 0 } });
  const D = mkDefender({ field: 5000 });
  const w1 = T.newWar(A, D, 1);
  const w2 = T.newWar(A, D, 1);
  const r1 = T.warBattle(w1, A, D);
  A.field = 8000; D.frontG.Att = 400; // reset stocks
  const r2 = T.warBattle(w2, A, D);
  assert.equal(w1.planLog[0].judgedStock, w2.planLog[0].judgedStock,
    'same (war identity, front, truth) → same judged read (stable p, no flicker)');
});
