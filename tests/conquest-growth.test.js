'use strict';
// §5 conquest growth engine (DT-②): a conquest's military-ceiling gain ripens
// in over turns (ADR 0022 — start 60%, +10pp per stable turn → full in 4).
const test = require('node:test');
const assert = require('node:assert');
const T = require('../mockup/combat-calc/tournament.js');
const { applyCapGain, ripenCap, HARNESS } = T;

// a minimal realm carrying only the fields the helpers touch
function realm(over = {}) {
  return { fieldCap: 6000, capPending: 0, capRipeFlow: 0, ...over };
}

test('applyCapGain: 60% of the gain is immediate, 40% pends, ripe-flow is 10% of gain', () => {
  const r = realm();
  applyCapGain(r, 1000, HARNESS); // startFrac 0.60, ripenPpPerTurn 0.10
  assert.equal(r.fieldCap, 6600);   // 6000 + round(0.60 * 1000)
  assert.equal(r.capPending, 400);  // 1000 - 600
  assert.equal(r.capRipeFlow, 100); // round(0.10 * 1000)
});

test('applyCapGain: gain <= 0 is a no-op (the capPerSector:0 control guard)', () => {
  const r = realm();
  applyCapGain(r, 0, HARNESS);
  assert.deepEqual({ fieldCap: r.fieldCap, capPending: r.capPending, capRipeFlow: r.capRipeFlow },
    { fieldCap: 6000, capPending: 0, capRipeFlow: 0 });
});

test('ripenCap: a fresh gain reaches full ceiling in exactly 4 stable turns', () => {
  const r = realm();
  applyCapGain(r, 1000, HARNESS); // fieldCap 6600, pending 400, flow 100
  ripenCap(r); assert.equal(r.fieldCap, 6700); assert.equal(r.capPending, 300);
  ripenCap(r); assert.equal(r.fieldCap, 6800); assert.equal(r.capPending, 200);
  ripenCap(r); assert.equal(r.fieldCap, 6900); assert.equal(r.capPending, 100);
  ripenCap(r); assert.equal(r.fieldCap, 7000); assert.equal(r.capPending, 0);
  assert.equal(r.capRipeFlow, 0); // reset once fully ripened
});

test('ripenCap: no pending is a no-op', () => {
  const r = realm({ fieldCap: 7000 });
  ripenCap(r);
  assert.equal(r.fieldCap, 7000);
  assert.equal(r.capPending, 0);
});

test('ripenCap: last step never overshoots full (min(pending, flow))', () => {
  const r = realm({ capPending: 50, capRipeFlow: 100, fieldCap: 6950 });
  ripenCap(r); // step = min(50, 100) = 50
  assert.equal(r.fieldCap, 7000);
  assert.equal(r.capPending, 0);
  assert.equal(r.capRipeFlow, 0);
});

// A fixed all-'표준' assignment so runMatch is deterministic under a seed.
const ASSIGN = Object.fromEntries(
  ['중원', '서령', '동평', '남곡', '북하'].map(
    (n) => [n, { archetype: 'shield-first', temperament: '표준' }]));

test('new realm fields are initialized on the board', () => {
  const board = T.makeBoard();
  for (const r of board) {
    assert.equal(r.capPending, 0);
    assert.equal(r.capRipeFlow, 0);
  }
});

test('ripenCap is invoked in the per-turn loop (a pre-set pending drains)', () => {
  const board = T.makeBoard();
  board[0].capPending = 1000;   // 중원 carries a pending ceiling
  board[0].capRipeFlow = 100;
  const startCap = board[0].fieldCap;
  T.runMatch(ASSIGN, { seed: 42, board, harness: { maxTurns: 3 } });
  // 중원 survives the opening turns; 3 loop passes ripen 3 x 100 = 300.
  assert.ok(board[0].capPending <= 700, `pending should drain, got ${board[0].capPending}`);
  assert.ok(board[0].fieldCap >= startCap, 'ripened ceiling never drops below start');
});

test('capPerSector > 0 makes conquest change the ceiling trajectory (wiring live)', () => {
  const off = T.runMatch(ASSIGN, { seed: 7, board: T.makeBoard(), harness: { capPerSector: 0 } });
  const on  = T.runMatch(ASSIGN, { seed: 7, board: T.makeBoard(), harness: { capPerSector: 3000 } });
  // Precondition: the growth engine can only fire if a conquest happened (a
  // settlement cession or an elimination). If this seed produces neither,
  // switch to a seed that does — the test is otherwise vacuous.
  assert.ok(on.settlements.length > 0 || on.eliminations > 0,
    `seed 7 produced no conquest to test; pick a seed with a settlement/elimination`);
  // Same seed/assignment: with growth on, at least the winner or trip turn or a
  // settlement-bearing field must diverge from the zero-growth control.
  const diverged = off.winner !== on.winner
    || off.tripTurn !== on.tripTurn
    || off.settlements.length !== on.settlements.length
    || off.eliminations !== on.eliminations;
  assert.ok(diverged, 'growth engine must change outcomes vs the capPerSector:0 control');
});
