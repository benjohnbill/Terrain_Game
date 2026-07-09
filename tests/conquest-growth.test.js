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
  // capPerSector: 3000, not the plan's 600 — 600 is too small a perturbation
  // relative to realm ceilings (5000-9000) to change any outcome under the
  // ripening dials (verified: no divergence across seeds 1-10000 at 600).
  // 3000 flips tripTurn 17→20 on seed 7, proving the wiring is live.
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

test('conquestUsableDrag: off (0) leaves the usable trajectory identical', () => {
  const off = T.runMatch(ASSIGN, { seed: 5, board: T.makeBoard(),
    harness: { capPerSector: 600, conquestUsableDrag: 0 } });
  const off2 = T.runMatch(ASSIGN, { seed: 5, board: T.makeBoard(),
    harness: { capPerSector: 600 } }); // dial absent → default 0
  assert.equal(off.winner, off2.winner);
  assert.equal(off.tripTurn, off2.tripTurn);
});

// Minimal winner/loser realm pair + war for a REAL applySettlement call.
// Preset '최대' (claimRate 1.0, cessionFirst) makes ceded === war.occupied
// exactly, so the drag input is fully controlled. Empty frontG keeps
// inheritFronts a no-op; the war object satisfies endWar's bookkeeping.
function settlementFixture(over = {}) {
  const war = { att: 'A', def: 'D', occupied: 2, stage: 'cascade',
    margin: 'marginal', endTurn: 5 };
  const A = { name: 'A', interior: 8, usable: 1.0, pool: 0, recruitBonus: 0,
    fieldCap: 6000, capPending: 0, capRipeFlow: 0, wars: [war], truce: {},
    frontG: {}, frontCap: {}, fortAt: {}, ...over };
  const D = { name: 'D', interior: 4, usable: 1.0, pool: 1000, field: 500,
    fieldCap: 6000, capPending: 0, capRipeFlow: 0, wars: [war], truce: {},
    frontG: {}, frontCap: {}, fortAt: {} };
  return { war, A, D, realms: [A, D] };
}

test('conquestUsableDrag: a REAL applySettlement call drags the winner usable (0 leaves it)', () => {
  // ceded = 2, A.interior 8→10: freshFrac 0.2, drag 0.5 → usable 1.0 - 0.1 = 0.9.
  const on = settlementFixture();
  T.applySettlement('preset', '최대', on.war, on.A, on.D,
    { ...HARNESS, conquestUsableDrag: 0.5 }, on.realms);
  assert.equal(on.A.interior, 10, 'fixture sanity: the settlement ceded 2 sectors');
  assert.ok(on.A.usable < 1.0, `drag 0.5 must lower the winner's usable, got ${on.A.usable}`);
  assert.ok(Math.abs(on.A.usable - 0.9) < 1e-9, `expected 0.9, got ${on.A.usable}`);
  // dial 0 (default): the same settlement leaves usable untouched
  const off = settlementFixture();
  T.applySettlement('preset', '최대', off.war, off.A, off.D,
    { ...HARNESS, conquestUsableDrag: 0 }, off.realms);
  assert.equal(off.A.interior, 10, 'same settlement shape under dial 0');
  assert.equal(off.A.usable, 1.0, 'dial 0 must not touch the winner usable');
});

test('conquestUsableDrag: the drag floors at 0.3 (raid floor)', () => {
  // winner already worn to 0.35: 0.35 - 0.5×0.2 = 0.25 → clamped to 0.3
  const f = settlementFixture({ usable: 0.35 });
  T.applySettlement('preset', '최대', f.war, f.A, f.D,
    { ...HARNESS, conquestUsableDrag: 0.5 }, f.realms);
  assert.equal(f.A.usable, 0.3, `usable must floor at 0.3, got ${f.A.usable}`);
});
