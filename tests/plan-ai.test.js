'use strict';
// Tactical plan AI (docs/features/tactical-plan-ai/) — pure judgment module.
const test = require('node:test');
const assert = require('node:assert');
const { loadScripts } = require('./helpers/load-browser-scripts');

const planAi = require('../mockup/combat-calc/plan-ai.js');

// ── B1: estimate band mirrors the sealed fog slice-1 model (js/intel.js) ──
// Ruling ③: reuse the fog §5 band mechanics, never invent a new window shape.
// plan-ai mirrors the formula (intel.js is a browser IIFE, not requirable);
// this fidelity test pins the mirror to the real implementation.

test('estimateBand matches IntelSystem.estimateRange across a grid', () => {
  const ctx = loadScripts(['js/intel.js']);
  const truths = [0, 1, 47, 500, 1000, 4800];
  const confidences = [0, 0.45, 0.5, 0.62, 0.75, 0.9, 1.0];
  const seeds = [0, 1, 12345, 0xdeadbeef];
  for (const t of truths) for (const c of confidences) for (const s of seeds) {
    const expected = ctx.IntelSystem.estimateRange(t, c, s);
    const got = planAi.estimateBand(t, c, s);
    assert.deepEqual(
      { low: got.low, high: got.high, mid: got.mid, width: got.width },
      { low: expected.low, high: expected.high, mid: expected.mid, width: expected.width },
      `mismatch at t=${t} c=${c} seed=${s}`);
  }
});

// ── B2: disposition dial — where in the band the bot reads (Ruling ②) ──
// λ ∈ [−1 pessimist(reads enemy strong) .. +1 optimist(reads enemy weak)];
// presets 비관 −0.5 / 중립 0 / 낙관 +0.5 (user example: 800–1200 → 1100/1000/900).

test('judgedValue: neutral reads the midpoint, pessimist high, optimist low', () => {
  const band = { low: 800, high: 1200, mid: 1000, width: 400 };
  assert.equal(planAi.judgedValue(band, 0), 1000);
  assert.equal(planAi.judgedValue(band, -0.5), 1100);
  assert.equal(planAi.judgedValue(band, 0.5), 900);
});

test('judgedValue clamps the dial to the band endpoints', () => {
  const band = { low: 800, high: 1200, mid: 1000, width: 400 };
  assert.equal(planAi.judgedValue(band, -3), 1200);
  assert.equal(planAi.judgedValue(band, 3), 800);
});

test('judgedValue: a collapsed band makes dispositions converge (Ruling ②)', () => {
  const point = { low: 1000, high: 1000, mid: 1000, width: 0 };
  assert.equal(planAi.judgedValue(point, -1), 1000);
  assert.equal(planAi.judgedValue(point, 1), 1000);
});

// ── B3: eligibility gates — objective facts, judged without error ──────
// Harness rules (가안, documented in plan-ai.js): DP/SI need a fort to
// erode/starve; Crossing needs water; Flanking needs a seam (open ground:
// no choke door, no water); Encirclement needs the isolation gate.

test('eligiblePlans: open field offers Swift, Raid, Flanking', () => {
  const set = planAi.eligiblePlans({ fort: 'none', water: null, chokeCap: Infinity, defenderIsolated: false });
  assert.deepEqual(set.sort(), ['Flanking', 'Raid', 'Swift']);
});

test('eligiblePlans: a fortified front adds DP and SI', () => {
  const set = planAi.eligiblePlans({ fort: 'walls', water: null, chokeCap: Infinity, defenderIsolated: false });
  assert.ok(set.includes('DP') && set.includes('SI'));
});

test('eligiblePlans: a choke door closes the Flanking seam', () => {
  const set = planAi.eligiblePlans({ fort: 'none', water: null, chokeCap: 500, defenderIsolated: false });
  assert.ok(!set.includes('Flanking'));
  assert.ok(set.includes('Swift'));
});

test('eligiblePlans: water opens Crossing and closes Flanking', () => {
  const set = planAi.eligiblePlans({ fort: 'none', water: 'straitOpposed', chokeCap: 500, defenderIsolated: false });
  assert.ok(set.includes('Crossing'));
  assert.ok(!set.includes('Flanking'));
});

test('eligiblePlans: the isolation gate opens Encirclement', () => {
  const closed = planAi.eligiblePlans({ fort: 'walls', water: null, chokeCap: Infinity, defenderIsolated: false });
  const open = planAi.eligiblePlans({ fort: 'walls', water: null, chokeCap: Infinity, defenderIsolated: true });
  assert.ok(!closed.includes('Encirclement'));
  assert.ok(open.includes('Encirclement'));
});

// ── B4: choosePlan — the decisiveness ladder (Ruling ①) ────────────────
// Among eligible plans whose JUDGED R clears the threshold, pick the
// highest rung; tie-break by judged margin; if nothing clears, forced
// grind on the best judged margin. Judged R comes from an engine.resolve
// dry-run with the judged defender stock (zero arithmetic duplication).

const site = { terrain: 'plains', fort: 'walls', erosionStamps: 0, chokeCap: Infinity, water: null };
const atk = { stock: 8000, commit: 8 };

test('choosePlan: ladder rank beats margin — Encirclement over a fatter Flanking margin', () => {
  const spec = { ...site, attacker: atk, defender: { stock: 400, commit: 8 }, defenderIsolated: true };
  const pick = planAi.choosePlan(spec, { confidence: 0.9, disposition: 0, seed: 7 });
  assert.equal(pick.plan, 'Encirclement');
  assert.equal(pick.forced, false);
});

test('choosePlan: without the isolation gate the same field picks Flanking', () => {
  const spec = { ...site, attacker: atk, defender: { stock: 400, commit: 8 }, defenderIsolated: false };
  const pick = planAi.choosePlan(spec, { confidence: 0.9, disposition: 0, seed: 7 });
  assert.equal(pick.plan, 'Flanking');
});

test('choosePlan: nothing clears → forced grind on best judged margin (DP)', () => {
  const spec = { ...site, attacker: { stock: 2000, commit: 8 }, defender: { stock: 3000, commit: 8 }, defenderIsolated: false };
  const pick = planAi.choosePlan(spec, { confidence: 0.9, disposition: 0, seed: 7 });
  assert.equal(pick.plan, 'DP');
  assert.equal(pick.forced, true);
});

test('choosePlan: optimists reach for higher rungs than pessimists on a straddling band', () => {
  const RUNGS = planAi.RUNGS;
  let diverged = false;
  for (const seed of [1, 2, 3, 5, 8, 13, 21, 34, 55, 89]) {
    const spec = { ...site, attacker: { stock: 2000, commit: 8 }, defender: { stock: 1000, commit: 8 }, defenderIsolated: false };
    const opt = planAi.choosePlan(spec, { confidence: 0.5, disposition: 0.5, seed });
    const pes = planAi.choosePlan(spec, { confidence: 0.5, disposition: -0.5, seed });
    assert.ok(RUNGS[opt.plan] >= RUNGS[pes.plan],
      `optimist rung must be >= pessimist rung (seed ${seed}: ${opt.plan} vs ${pes.plan})`);
    if (opt.plan !== pes.plan) diverged = true;
  }
  assert.ok(diverged, 'dispositions must actually diverge somewhere on a wide band');
});

test('choosePlan: random brain picks only gate-eligible plans (R2 control)', () => {
  const spec = { ...site, attacker: atk, defender: { stock: 400, commit: 8 }, defenderIsolated: false };
  const eligible = planAi.eligiblePlans(spec);
  let x = 1;
  const rng = () => { x = (x * 16807) % 2147483647; return x / 2147483647; };
  const seen = new Set();
  for (let i = 0; i < 60; i++) {
    const pick = planAi.choosePlan(spec, { random: rng });
    assert.ok(eligible.includes(pick.plan), `random pick ${pick.plan} must be eligible`);
    seen.add(pick.plan);
  }
  assert.ok(seen.size > 1, 'random brain must actually vary its picks');
});

test('estimateBand always contains the truth and narrows with confidence', () => {
  for (const seed of [3, 999, 424242]) {
    const wide = planAi.estimateBand(1000, 0.45, seed);
    const narrow = planAi.estimateBand(1000, 0.9, seed);
    assert.ok(wide.low <= 1000 && 1000 <= wide.high, 'truth inside wide band');
    assert.ok(narrow.low <= 1000 && 1000 <= narrow.high, 'truth inside narrow band');
    assert.ok(narrow.width < wide.width, 'higher confidence narrows the band');
    assert.ok(narrow.width > 0, 'enemy band never collapses (ownership premium)');
  }
});
