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
