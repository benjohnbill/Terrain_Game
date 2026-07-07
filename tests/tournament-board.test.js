'use strict';
// L2 adapter — tournament.js plays on an injected cradle board instead
// of the built-in fixture board, and realm-level economy (sectorYield)
// overrides the flat harness sector value.

const { test } = require('node:test');
const assert = require('node:assert');

const TOURNEY = require('../mockup/combat-calc/tournament.js');
const { CRADLE_MAP, CRADLE_BINDING } = require('../mockup/combat-calc/map-gen.js');
const { makeBoardFromMap } = require('../mockup/combat-calc/map-board.js');

const SEATS = Object.keys(CRADLE_BINDING);

function cradleAssignment(archetype = 'conquest-snowball') {
  const a = {};
  for (const s of SEATS) a[s] = { archetype, temperament: '표준' };
  return a;
}

test('yieldReach honors a realm-level sectorYield over the harness flat value', () => {
  const flat = TOURNEY.yieldReach(
    { interior: 10, usable: 1.0 }, TOURNEY.HARNESS);
  assert.strictEqual(flat, 10 * TOURNEY.HARNESS.sectorValue);
  const real = TOURNEY.yieldReach(
    { interior: 10, usable: 1.0, sectorYield: 1.2 }, TOURNEY.HARNESS);
  assert.strictEqual(real, 12);
});

test('runMatch plays on an injected board (cradle seats, not fixture seats)', () => {
  const record = TOURNEY.runMatch(cradleAssignment(), {
    seed: 7, board: makeBoardFromMap(CRADLE_MAP, CRADLE_BINDING),
  });
  assert.deepStrictEqual(
    record.finalRealms.map((r) => r.name).sort(), [...SEATS].sort());
  assert.ok(record.winner === null || SEATS.includes(record.winner));
  assert.ok(['timeout', 'trip-solo', 'trip-chain'].includes(record.endingShape));
});

test('runMatch with an injected board is seed-deterministic', () => {
  const run = () => TOURNEY.runMatch(cradleAssignment('raid-attrition'), {
    seed: 42, board: makeBoardFromMap(CRADLE_MAP, CRADLE_BINDING),
  });
  assert.deepStrictEqual(JSON.parse(JSON.stringify(run())),
    JSON.parse(JSON.stringify(run())));
});

test('runMatch without a board still plays the fixture seats (sheet-12 regression)', () => {
  const a = {};
  for (const s of TOURNEY.SEATS) a[s] = { archetype: 'shield-first', temperament: '표준' };
  const record = TOURNEY.runMatch(a, { seed: 3 });
  assert.deepStrictEqual(
    record.finalRealms.map((r) => r.name).sort(), [...TOURNEY.SEATS].sort());
});

test('record.finalCheck reports the closest hegemony candidate at match end', () => {
  const record = TOURNEY.runMatch(cradleAssignment(), {
    seed: 7, board: makeBoardFromMap(CRADLE_MAP, CRADLE_BINDING),
  });
  const fc = record.finalCheck;
  assert.ok(fc && SEATS.includes(fc.name));
  assert.ok(typeof fc.leadershipShortfall === 'number');
  assert.ok(typeof fc.coalitionOverhang === 'number');
  assert.strictEqual(typeof fc.leadership, 'boolean');
  assert.strictEqual(typeof fc.unassailable, 'boolean');
  if (record.winner) {
    assert.strictEqual(fc.name, record.winner);
    assert.strictEqual(fc.leadership && fc.unassailable, true);
  }
});

test('pile-on probe: wounded neighbor opens the attack window (harness flag)', () => {
  // three-realm micro board: W wounded (field 40% of cap), P patient
  // archetype at full strength, N neutral bystander
  const mk = (name, field, fieldCap, fronts) => ({
    name, seatType: 'flank', field, fieldCap, interior: 3,
    capitalGarrison: 1200, frontG: { ...fronts }, frontCap: { ...fronts },
    fortAt: Object.fromEntries(Object.keys(fronts).map((k) => [k, 'walls'])),
    exits: [{ cap: Infinity }], staging: false, usable: 1.0,
    pool: 10000, recruitBonus: 0, alive: true, vassalOf: null,
    truce: {}, wars: [], _turn: 5,
  });
  const W = mk('W', 2000, 7000, { P: 300, N: 300 });
  const P = mk('P', 5000, 7000, { W: 300, N: 300 });
  const N = mk('N', 5000, 7000, { W: 300, P: 300 });
  P.archetype = 'free-rider'; // patient redeclare, attackRatio 2.0
  W.archetype = 'shield-first'; N.archetype = 'shield-first';
  const realms = [W, P, N];
  const rng = TOURNEY.mulberry32(9);

  // W at 36% cap: canon 'worn' read SEES the target (< wornFrac 0.55)
  // but won't jump — ratio 5000/(2500+300) = 1.79 < free-rider bar 2.0.
  // The probe's contract: the pack jumps into an open wound (relief
  // 0.85 → bar 1.7 ≤ 1.79) before healing closes it.
  W.field = 2500;
  const canonPick = TOURNEY.pickTarget(P, realms, rng, TOURNEY.HARNESS);
  assert.strictEqual(canonPick, null, 'canon: sees the wound, ratio bar refuses');

  const H = { ...TOURNEY.HARNESS, pileOn: { woundedFrac: 0.8, ratioRelief: 0.85 } };
  const probePick = TOURNEY.pickTarget(P, realms, TOURNEY.mulberry32(9), H);
  assert.ok(probePick && probePick.name === 'W',
    'probe: wounded window + ratio relief lets the pack jump');
});
