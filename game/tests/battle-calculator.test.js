/**
 * The pure decisive-battle calculator — ticket 06c's state-free half.
 *
 * Authority: combat-formula FORMULA D1/D5/D6/D10/D11; MAGNITUDE M2/M4/M5;
 * operation-plan-catalog CATALOG Delaying Defense; ADR 0015; and
 * war-model-build WM-①/WM-②.
 *
 * Run against the emitted artifact, never the source (gate 05 D6).
 */

import test from 'node:test';
import assert from 'node:assert/strict';

const { attackPower, casualtyFractions, commitLever, defensePower, resolveBattle, sidePower } =
  await import('../dist/runtime/index.js');

test('the M2 commit lever keeps the unattended baseline and changes slope at the knee', () => {
  const cases = [
    [0, 1],
    [2, 1.125],
    [4, 1.25],
    [8, 1.5],
    [11, 1.625],
    [14, 1.75],
    [20, 2],
  ];

  for (const [points, expected] of cases) {
    assert.equal(commitLever(points), expected, `${points} points`);
  }
});

test('both sides use the same substance x commit lever x quality x fatigue product', () => {
  const left = { substance: 1_000, commit: 8, quality: 1.2, fatigue: 0.75 };
  const right = { substance: 750, commit: 14, quality: 1, fatigue: 0.8 };

  assert.equal(sidePower(left), 1_350);
  assert.equal(sidePower(right), 1_050);
  assert.equal(sidePower({ ...left, commit: 0 }), 900, 'zero commit still fights at the M2 baseline');
});

test('M5 ground multiplies defense while ADR 0015 river crossing prices the attack engagement', () => {
  const side = { substance: 1_000, commit: 0, quality: 1, fatigue: 1 };

  assert.equal(defensePower(side, 'pass', 'fortress'), 4_800);
  assert.equal(defensePower(side, 'plains', 'none'), 1_000);
  assert.equal(attackPower(side, 'riverUncontested'), 850);
  assert.equal(attackPower(side, 'riverOpposed'), 700);
  assert.equal(attackPower(side, 'none'), 1_000);
});

test('the M4 casualty curve mirrors exactly when the power ratio is inverted', () => {
  const strongerAttack = casualtyFractions(2);
  const strongerDefense = casualtyFractions(0.5);

  assert.ok(Math.abs(strongerAttack.attacker - 0.045471496995311944) < 1e-12);
  assert.ok(Math.abs(strongerAttack.defender - 0.3166818985854946) < 1e-12);
  assert.ok(Math.abs(strongerAttack.attacker - strongerDefense.defender) < 1e-15);
  assert.ok(Math.abs(strongerAttack.defender - strongerDefense.attacker) < 1e-15);
  assert.deepEqual(casualtyFractions(1), { attacker: 0.12, defender: 0.12 });
});

const neutralGround = { terrain: 'plains', fortification: 'none', crossing: 'none' };

test('Stronghold is the default and a march-worn attacker must receive fatigue explicitly', () => {
  const outcome = resolveBattle({
    attacker: { substance: 1_000, commit: 8, quality: 1, fatigue: 0.75, escape: 'OPEN' },
    defender: { substance: 1_000, commit: 8, quality: 1, fatigue: 1, escape: 'OPEN' },
    ...neutralGround,
  });

  assert.equal(outcome.defenseMethod, 'STRONGHOLD');
  assert.equal(outcome.winner, 'DEFENDER');
  assert.equal(outcome.sectorFalls, false);
  assert.equal(outcome.attacker.routed, false);
  assert.ok(outcome.attacker.casualties > outcome.defender.casualties);
});

test('the defender carries its own commit lever into the resolved power duel', () => {
  const attacker = { substance: 1_500, commit: 0, quality: 1, fatigue: 1, escape: 'OPEN' };
  const uncommitted = resolveBattle({
    attacker,
    defender: { substance: 1_000, commit: 0, quality: 1, fatigue: 1, escape: 'OPEN' },
    ...neutralGround,
  });
  const committed = resolveBattle({
    attacker,
    defender: { substance: 1_000, commit: 14, quality: 1, fatigue: 1, escape: 'OPEN' },
    ...neutralGround,
  });

  assert.equal(uncommitted.sectorFalls, true);
  assert.equal(committed.sectorFalls, false);
  assert.equal(committed.defender.power, 1_750);
});

test('swapping the two plain-ground sides mirrors a Stronghold outcome', () => {
  const first = { substance: 2_000, commit: 8, quality: 1, fatigue: 1, escape: 'OPEN' };
  const second = { substance: 1_000, commit: 8, quality: 1, fatigue: 1, escape: 'OPEN' };
  const forward = resolveBattle({ attacker: first, defender: second, ...neutralGround });
  const reverse = resolveBattle({ attacker: second, defender: first, ...neutralGround });

  assert.equal(forward.winner, 'ATTACKER');
  assert.equal(reverse.winner, 'DEFENDER');
  assert.ok(Math.abs(forward.attacker.casualties - reverse.defender.casualties) < 1e-12);
  assert.ok(Math.abs(forward.defender.casualties - reverse.attacker.casualties) < 1e-12);
  assert.equal(forward.defender.routed, reverse.attacker.routed);
  assert.ok(Math.abs(forward.defender.escaped - reverse.attacker.escaped) < 1e-12);
});

test('M4 rout converts the losing remainder through OPEN escape or BLOCKED annihilation', () => {
  const attacker = { substance: 2_000, commit: 0, quality: 1, fatigue: 1, escape: 'OPEN' };
  const defender = { substance: 1_000, commit: 0, quality: 1, fatigue: 1, escape: 'OPEN' };
  const open = resolveBattle({ attacker, defender, ...neutralGround });
  const blocked = resolveBattle({
    attacker,
    defender: { ...defender, escape: 'BLOCKED' },
    ...neutralGround,
  });

  assert.equal(open.defender.routed, true);
  assert.ok(Math.abs(open.defender.battleCasualties - 316.6818985854946) < 1e-9);
  assert.ok(Math.abs(open.defender.casualties - 658.3409492927472) < 1e-9);
  assert.ok(Math.abs(open.defender.escaped - 341.6590507072528) < 1e-9);
  assert.equal(blocked.defender.routed, true);
  assert.equal(blocked.defender.casualties, 1_000);
  assert.equal(blocked.defender.escaped, 0);
});

test('Delaying buys a not-taken turn at R below 2.0 and pays fortificationDamage', () => {
  const attacker = { substance: 1_500, commit: 0, quality: 1, fatigue: 1, escape: 'OPEN' };
  const defender = { substance: 1_000, commit: 0, quality: 1, fatigue: 1, escape: 'OPEN' };
  const stronghold = resolveBattle({ attacker, defender, ...neutralGround });
  const delaying = resolveBattle({
    attacker,
    defender,
    ...neutralGround,
    defenseMethod: 'DELAYING',
  });

  assert.equal(stronghold.sectorFalls, true);
  assert.equal(delaying.winner, 'NEITHER');
  assert.equal(delaying.sectorFalls, false);
  assert.equal(delaying.attacker.routed, false);
  assert.equal(delaying.defender.routed, false);
  assert.equal(delaying.fortificationDamage, 0.15);
  assert.equal(delaying.routeDisrupted, true);
});

test('Delaying cedes at R 2.0 or above without converting losses into a rout', () => {
  const outcome = resolveBattle({
    attacker: { substance: 3_000, commit: 0, quality: 1, fatigue: 1, escape: 'OPEN' },
    defender: { substance: 1_000, commit: 0, quality: 1, fatigue: 1, escape: 'BLOCKED' },
    ...neutralGround,
    defenseMethod: 'DELAYING',
  });

  assert.equal(outcome.winner, 'ATTACKER');
  assert.equal(outcome.sectorFalls, true);
  assert.equal(outcome.defender.routed, false);
  assert.equal(outcome.defender.pursuitCasualties, 0);
  assert.ok(outcome.defender.casualties < 1_000);
  assert.equal(outcome.fortificationDamage, 0);
  assert.equal(outcome.routeDisrupted, true);
});

test('defeat in detail emerges from the convex curve against each thinned detachment', () => {
  const massed = resolveBattle({
    attacker: { substance: 2_000, commit: 0, quality: 1, fatigue: 1, escape: 'OPEN' },
    defender: { substance: 2_000, commit: 0, quality: 1, fatigue: 1, escape: 'OPEN' },
    ...neutralGround,
  });
  const first = resolveBattle({
    attacker: { substance: 1_000, commit: 0, quality: 1, fatigue: 1, escape: 'OPEN' },
    defender: { substance: 2_000, commit: 0, quality: 1, fatigue: 1, escape: 'OPEN' },
    ...neutralGround,
  });
  const second = resolveBattle({
    attacker: { substance: 1_000, commit: 0, quality: 1, fatigue: 1, escape: 'OPEN' },
    defender: {
      substance: first.defender.survivors,
      commit: 0,
      quality: 1,
      fatigue: 1,
      escape: 'OPEN',
    },
    ...neutralGround,
  });

  const dividedCasualties = first.attacker.casualties + second.attacker.casualties;
  assert.ok(dividedCasualties > massed.attacker.casualties * 3.5);
  assert.equal(first.attacker.routed, true);
  assert.equal(second.attacker.routed, false);
});
