/**
 * The dual ledger — ticket 06b's state-free half.
 *
 * Authority: slice-2 operational-layer design § 2 (shape) and war-model-build
 * MAGNITUDE WB-M① (values, L1). The ×0.5 floor is the set's one sealed anchor.
 *
 * Run against the emitted artifact, never the source (gate 05 D6).
 */

import test from 'node:test';
import assert from 'node:assert/strict';

const {
  BATTLE_FATIGUE_COEF,
  battleAccrual,
  CONVERSION_TERMINAL_LEDGER,
  effectiveness,
  EFFECTIVENESS_FLOOR,
  isStarving,
  RECOVERY_BASE_RATE,
  RECOVERY_REQUIRES_STATIONARY,
  recoveryPerTurn,
  STARVATION_ENTRY_THRESHOLD,
  starvationLossFraction,
  SUPPLY_PUMP_PER_CUT_TURN,
  supplyTick,
  turnUpkeep,
} = await import('../dist/runtime/index.js');

const close = (actual, expected, tolerance = 1e-12) =>
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `expected ${actual} to be within ${tolerance} of ${expected}`,
  );

// ── the firewall ────────────────────────────────────────────────────────────
// The ticket's actual contract, and the reason the two ledgers are separate
// accounts rather than one number: no state may make a force stronger than its
// rested, supplied self, and tiredness may never take a body.

test('no combination of the two ledgers makes a force stronger than rested and supplied', () => {
  const rested = effectiveness(0);
  assert.equal(rested, 1, 'a rested force is at full effectiveness by definition');
  for (let wear = 0; wear <= 40; wear += 0.25) {
    const value = effectiveness(wear);
    assert.ok(value <= rested, `wear ${wear} raised effectiveness to ${value}`);
    assert.ok(value >= EFFECTIVENESS_FLOOR, `wear ${wear} sank effectiveness to ${value}`);
  }
});

test('the supply ledger never touches effectiveness, at any depth', () => {
  // Effectiveness reads the wear ledger alone; supply has no argument to give it.
  for (let supply = 0; supply <= 20; supply += 1) {
    const upkept = turnUpkeep({ wear: 4, supply }, 0);
    assert.equal(
      effectiveness(upkept.wear),
      effectiveness(4),
      'a supply-cut turn changed effectiveness',
    );
  }
});

test('the wear ledger never takes a body, at any depth', () => {
  for (let wear = 0; wear <= 40; wear += 1) {
    const upkept = turnUpkeep({ wear, supply: 0 }, 1);
    assert.equal(upkept.substanceLossFraction, 0, `wear ${wear} produced substance loss`);
    assert.equal(upkept.starving, false, `wear ${wear} entered the starvation state`);
  }
});

// ── the conversion curve ────────────────────────────────────────────────────

test('effectiveness saturates flat at the sealed ×0.5 floor and stays there', () => {
  close(effectiveness(CONVERSION_TERMINAL_LEDGER), EFFECTIVENESS_FLOOR);
  close(effectiveness(CONVERSION_TERMINAL_LEDGER * 3), EFFECTIVENESS_FLOOR);
  close(effectiveness(Number.MAX_SAFE_INTEGER), EFFECTIVENESS_FLOOR);
});

test('the curve is convex — an accelerating penalty, not a straight line', () => {
  // Convexity is the design claim: the first unit of wear must cost less than a
  // later one. A linear mapping would make these deltas equal.
  const early = effectiveness(0) - effectiveness(1);
  const middle = effectiveness(4) - effectiveness(5);
  const late = effectiveness(8) - effectiveness(9);
  assert.ok(early < middle, `early cost ${early} was not cheaper than middle ${middle}`);
  assert.ok(middle < late, `middle cost ${middle} was not cheaper than late ${late}`);
});

test('the curve never steps — no band boundary produces a jump', () => {
  // A stepped mapping was rejected for exactly this: value discontinuities.
  let previous = effectiveness(0);
  for (let wear = 0.05; wear <= CONVERSION_TERMINAL_LEDGER; wear += 0.05) {
    const value = effectiveness(wear);
    assert.ok(previous - value < 0.02, `a jump of ${previous - value} appeared at wear ${wear}`);
    previous = value;
  }
});

test('a negative wear ledger cannot buy effectiveness above rested', () => {
  assert.equal(effectiveness(-5), 1);
});

// ── battle wear is an intensity signal ──────────────────────────────────────

test('battle wear is proportional to own casualty fraction', () => {
  assert.equal(battleAccrual(0), 0, 'a walkover barely wears the survivors');
  close(battleAccrual(0.25), BATTLE_FATIGUE_COEF * 0.25);
  assert.equal(battleAccrual(1), BATTLE_FATIGUE_COEF);
});

test('battle wear clamps a fraction outside [0,1] rather than compounding it', () => {
  assert.equal(battleAccrual(1.5), BATTLE_FATIGUE_COEF);
  assert.equal(battleAccrual(-1), 0);
});

// ── the supply account ──────────────────────────────────────────────────────

test('the pump counts cut turns and any supplied turn resets it', () => {
  assert.equal(supplyTick(0, 0), SUPPLY_PUMP_PER_CUT_TURN);
  assert.equal(supplyTick(3, 0), 3 + SUPPLY_PUMP_PER_CUT_TURN);
  assert.equal(supplyTick(7, 1), 0, 'a supplied turn ends the tick');
  assert.equal(supplyTick(7, 0.1), 0, 'a partial trickle also resets — level only gates recovery');
});

test('starvation opens past the entry threshold, not at it', () => {
  assert.equal(isStarving(STARVATION_ENTRY_THRESHOLD), false);
  assert.equal(isStarving(STARVATION_ENTRY_THRESHOLD + 0.5), true);
  assert.equal(starvationLossFraction(STARVATION_ENTRY_THRESHOLD), 0,
    'a force at the threshold loses nobody');
});

test('substance loss rises convexly with depth and never exceeds the whole force', () => {
  const first = starvationLossFraction(STARVATION_ENTRY_THRESHOLD + 1);
  const second = starvationLossFraction(STARVATION_ENTRY_THRESHOLD + 2);
  const third = starvationLossFraction(STARVATION_ENTRY_THRESHOLD + 3);
  assert.ok(second - first < third - second, 'the death curve is not accelerating');
  assert.equal(starvationLossFraction(1e6), 1, 'loss is capped at the entire force');
});

test('starvation is graded, never staged — no depth flips a capability', () => {
  // D4's staged severity is superseded: the only thing depth changes is how many
  // men die, so the readout must move continuously rather than by rung.
  let previous = 0;
  for (let supply = STARVATION_ENTRY_THRESHOLD; supply <= 9; supply += 0.1) {
    const loss = starvationLossFraction(supply);
    assert.ok(loss >= previous, 'loss went backwards as the siege deepened');
    assert.ok(loss - previous < 0.05, `a severity step of ${loss - previous} appeared`);
    previous = loss;
  }
});

// ── recovery is a child of supply and ground ────────────────────────────────

test('no supply means no recovery', () => {
  assert.equal(recoveryPerTurn(0), 0);
  assert.equal(turnUpkeep({ wear: 6, supply: 0 }, 0).wear, 6, 'a cut force recovered');
});

test('recovery scales with supply level and reaches the base rate at full supply', () => {
  assert.equal(recoveryPerTurn(1), RECOVERY_BASE_RATE);
  close(recoveryPerTurn(0.5), RECOVERY_BASE_RATE * 0.5, 1e-12);
  assert.ok(recoveryPerTurn(0.25) < recoveryPerTurn(0.75));
});

test('ash ground denies recovery even when the force is fed', () => {
  const fed = turnUpkeep({ wear: 6, supply: 0 }, 1, 1);
  const ash = turnUpkeep({ wear: 6, supply: 0 }, 1, 0);
  assert.ok(fed.wear < 6, 'ordinary ground let the force recover');
  assert.equal(ash.wear, 6, 'ash ground allowed recovery');
});

test('the ground gates wear only — it can never touch substance', () => {
  // If the ground could reach substance, the firewall would be broken from the
  // other side: ash would starve a supplied army.
  const ash = turnUpkeep({ wear: 3, supply: 5 }, 0, 0);
  const ordinary = turnUpkeep({ wear: 3, supply: 5 }, 0, 1);
  assert.equal(ash.substanceLossFraction, ordinary.substanceLossFraction);
  assert.equal(ash.starving, ordinary.starving);
});

test('recovery cannot drive the wear ledger below zero', () => {
  assert.equal(turnUpkeep({ wear: 0.5, supply: 0 }, 1).wear, 0);
});

// ── the HELD dial ───────────────────────────────────────────────────────────

test('the stationary requirement is HELD, so marching recovers as standing does', () => {
  assert.equal(RECOVERY_REQUIRES_STATIONARY, false,
    'dial 9 is recorded HELD at its birthplace — valuing it here would originate a rule');
  const standing = turnUpkeep({ wear: 6, supply: 0 }, 1, 1, true);
  const marching = turnUpkeep({ wear: 6, supply: 0 }, 1, 1, false);
  assert.deepEqual(marching, standing,
    'answering dial 9 must be a value change, so the flag is the only thing that decides');
});

// ── upkeep ordering and determinism ─────────────────────────────────────────

test('a cut turn pumps first and bleeds at the new depth', () => {
  // Turn N of a siege bleeds at depth N. Inherited implementation ruling, still
  // open; pinned so a later re-cut is a visible test change, not a silent drift.
  const turn1 = turnUpkeep({ wear: 0, supply: 0 }, 0);
  assert.equal(turn1.supply, 1);
  assert.equal(turn1.substanceLossFraction, starvationLossFraction(1));
});

test('a siege is the defender rising supply ledger, turn after turn', () => {
  let ledgers = { wear: 0, supply: 0 };
  const losses = [];
  for (let turn = 0; turn < 6; turn += 1) {
    const upkept = turnUpkeep(ledgers, 0);
    losses.push(upkept.substanceLossFraction);
    ledgers = { wear: upkept.wear, supply: upkept.supply };
  }
  assert.equal(ledgers.supply, 6);
  assert.deepEqual(losses.slice(0, 2), [0, 0], 'the first two cut turns are inside the threshold');
  assert.ok(losses[5] > losses[4], 'the bleed did not deepen');
});

test('upkeep is deterministic for equal inputs', () => {
  const inputs = { wear: 7.25, supply: 3.5 };
  assert.deepEqual(turnUpkeep(inputs, 0.4, 0.6), turnUpkeep(inputs, 0.4, 0.6));
});

test('upkeep returns a fresh reading and mutates no input', () => {
  const inputs = { wear: 5, supply: 2 };
  turnUpkeep(inputs, 0);
  assert.deepEqual(inputs, { wear: 5, supply: 2 });
});
