// tests/commit.test.js — war-model slice-2 ticket 04 (커밋 예산)
// Commit is a per-turn regenerating, non-bankable realm budget. Every
// commit-consuming use draws from one pool: engagement levers (MAGNITUDE M2,
// 0–20) and an abstract development sink at minimum. Allocations across
// simultaneous uses sum to at most the budget; unused balance does not bank.
const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../js/commit.js');

test('a pool starts full at its per-turn budget', () => {
  const p = C.pool(20);
  assert.equal(p.perTurn, 20);
  assert.equal(p.remaining, 20);
});

test('simultaneous allocations draw from one pool (12 to the war, 8 to development)', () => {
  const p = C.pool(20);
  const { pool, spent } = C.allocate(p, [12, 8]);
  assert.equal(spent, 20);
  assert.equal(pool.remaining, 0);
});

test('sequential draws accumulate against the same pool until it is empty', () => {
  let p = C.pool(20);
  p = C.allocate(p, [12]).pool; // the war
  p = C.allocate(p, [8]).pool;  // development
  assert.equal(p.remaining, 0);
  assert.throws(() => C.allocate(p, [1]), /exceeds/); // pool empty — nothing left to draw
});

test('allocations exceeding the pool are rejected — the budget is a hard ceiling', () => {
  const p = C.pool(20);
  assert.throws(() => C.allocate(p, [12, 9]), /exceeds/); // 21 > 20
});

test('renew regenerates to the per-turn budget; unusable balance does not bank', () => {
  const p = C.pool(20);
  const { pool } = C.allocate(p, [5]); // 15 left unused
  assert.equal(pool.remaining, 15);
  const next = C.renew(pool);
  assert.equal(next.remaining, 20); // NOT 15 carried over — leftover is discarded
});

test('allocate is pure — it does not mutate the input pool', () => {
  const p = C.pool(20);
  C.allocate(p, [5]);
  assert.equal(p.remaining, 20);
});
