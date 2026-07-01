const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts } = require('./helpers/load-browser-scripts');

function loadIntel() {
  return loadScripts(['js/intel.js']);
}

test('applyScout raises confidence by the scout gain and caps at the maximum', () => {
  const ctx = loadIntel();
  assert.equal(ctx.IntelSystem.applyScout(0.45), 0.7);
  assert.equal(ctx.IntelSystem.applyScout(0.8), 0.9); // 0.8 + 0.25 = 1.05 -> capped 0.9
});

test('decay lowers confidence toward the ambient floor and never below it', () => {
  const ctx = loadIntel();
  assert.equal(ctx.IntelSystem.decay(0.7), 0.65);
  assert.equal(ctx.IntelSystem.decay(0.47), 0.45); // max(0.45, 0.42) = 0.45
  assert.equal(ctx.IntelSystem.decay(0.45), 0.45);
});

test('isReliable matches the uncertainty threshold', () => {
  const ctx = loadIntel();
  assert.equal(ctx.IntelSystem.isReliable(0.45), false);
  assert.equal(ctx.IntelSystem.isReliable(0.55), true);
  assert.equal(ctx.IntelSystem.isReliable(0.7), true);
});

test('tierOf classifies confidence into low / partial / reliable', () => {
  const ctx = loadIntel();
  assert.equal(ctx.IntelSystem.tierOf(0.45).id, 'low');
  assert.equal(ctx.IntelSystem.tierOf(0.7).id, 'partial');
  assert.equal(ctx.IntelSystem.tierOf(0.85).id, 'reliable');
});

test('maintainConfidence pins owned hexes high and decays non-owned hexes', () => {
  const ctx = loadIntel();
  const owned = { owner: 0, informationConfidence: 0.5 };
  ctx.IntelSystem.maintainConfidence(owned, 0);
  assert.equal(owned.informationConfidence, 0.85);

  const enemy = { owner: 1, informationConfidence: 0.7 };
  ctx.IntelSystem.maintainConfidence(enemy, 0);
  assert.equal(enemy.informationConfidence, 0.65);

  const neutral = { owner: null, informationConfidence: 0.46 };
  ctx.IntelSystem.maintainConfidence(neutral, 0);
  assert.equal(neutral.informationConfidence, 0.45);
});

test('tierOf returns partial/reliable exactly at the threshold boundaries', () => {
  const ctx = loadIntel();
  assert.equal(ctx.IntelSystem.tierOf(0.55).id, 'partial');
  assert.equal(ctx.IntelSystem.tierOf(0.75).id, 'reliable');
});

test('estimateRange always contains the true value', () => {
  const ctx = loadIntel();
  const seed = ctx.IntelSystem.hexSeed(3, 4);
  for (const t of [1, 5, 10, 27, 100]) {
    for (const c of [0.45, 0.55, 0.7, 0.85, 0.9]) {
      const r = ctx.IntelSystem.estimateRange(t, c, seed);
      assert.ok(r.low <= t && t <= r.high, `true ${t} must be inside [${r.low}, ${r.high}] at c=${c}`);
    }
  }
});

test('estimateRange is deterministic for the same inputs', () => {
  const ctx = loadIntel();
  const seed = ctx.IntelSystem.hexSeed(2, 9);
  const a = ctx.IntelSystem.estimateRange(20, 0.5, seed);
  const b = ctx.IntelSystem.estimateRange(20, 0.5, seed);
  assert.deepEqual(a, b);
});

test('estimateRange narrows as confidence rises', () => {
  const ctx = loadIntel();
  const seed = ctx.IntelSystem.hexSeed(6, 1);
  const glimpse = ctx.IntelSystem.estimateRange(20, 0.45, seed);
  const reliable = ctx.IntelSystem.estimateRange(20, 0.85, seed);
  assert.ok(glimpse.width > reliable.width, `glimpse width ${glimpse.width} > reliable width ${reliable.width}`);
});

test('estimateRange keeps a nonzero residual at the enemy ceiling (never exact)', () => {
  const ctx = loadIntel();
  const seed = ctx.IntelSystem.hexSeed(6, 1);
  const ceiling = ctx.IntelSystem.estimateRange(20, 0.9, seed);
  const overCeiling = ctx.IntelSystem.estimateRange(20, 0.99, seed); // clamped to 0.9
  assert.ok(ceiling.width > 0, 'width must not collapse to zero for a scouted enemy hex');
  assert.equal(overCeiling.width, ceiling.width);
});

test('estimateRange position varies with the hex seed (not centered on the truth)', () => {
  const ctx = loadIntel();
  const lows = [1, 2, 3, 4, 5].map((s) => ctx.IntelSystem.estimateRange(20, 0.45, s).low);
  assert.ok(new Set(lows).size > 1, 'range position must depend on the hex seed');
});

test('hexSeed is a stable nonnegative integer per coordinate', () => {
  const ctx = loadIntel();
  assert.equal(ctx.IntelSystem.hexSeed(3, 4), ctx.IntelSystem.hexSeed(3, 4));
  assert.ok(ctx.IntelSystem.hexSeed(3, 4) >= 0);
  assert.notEqual(ctx.IntelSystem.hexSeed(3, 4), ctx.IntelSystem.hexSeed(4, 3));
});

test('magnitudeBucket classifies strength into coarse tiers', () => {
  const ctx = loadIntel();
  assert.equal(ctx.IntelSystem.magnitudeBucket(5), '소');
  assert.equal(ctx.IntelSystem.magnitudeBucket(16), '중');
  assert.equal(ctx.IntelSystem.magnitudeBucket(28), '대');
  assert.equal(ctx.IntelSystem.magnitudeBucket(50), '특대');
});

test('estimateRange never collapses to exact even at a zero true value', () => {
  const ctx = loadIntel();
  const seed = ctx.IntelSystem.hexSeed(6, 1);
  assert.ok(ctx.IntelSystem.estimateRange(0, 0.9, seed).width > 0);
});

test('estimateRange contains a non-integer true value despite rounding', () => {
  const ctx = loadIntel();
  for (const seed of [0, 1, 2, 3, 4, 5]) {
    for (const t of [0.013, 13.7, 2.5]) {
      const r = ctx.IntelSystem.estimateRange(t, 0.45, seed);
      assert.ok(r.low <= t && t <= r.high, `true ${t} inside [${r.low}, ${r.high}] (seed ${seed})`);
    }
  }
});
