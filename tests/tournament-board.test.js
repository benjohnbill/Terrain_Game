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

// ---- (b) total-bodies register accounting (Q0-5 structure seal) ----

test('recruiting moves bodies civilian→serving: register unchanged', () => {
  const board = makeBoardFromMap(CRADLE_MAP, CRADLE_BINDING);
  const r = board[0];
  const before = r.pool;
  r.field = Math.round(r.fieldCap * 0.5); // room to recruit
  TOURNEY.doRecruit(r);
  assert.ok(r.field > Math.round(r.fieldCap * 0.5), 'recruit added men');
  assert.strictEqual(r.pool, before, 'register is total bodies — drafting does not shrink it');
});

test('recruit is capped by remaining civilians (register − serving)', () => {
  const board = makeBoardFromMap(CRADLE_MAP, CRADLE_BINDING);
  const r = board[0];
  // shrink register to exactly the serving body count → zero civilians
  r.pool = TOURNEY.servingBodies(r);
  r.field -= 1000; r.pool -= 1000; // 1000 died in the field: still zero civilians
  const before = r.field;
  TOURNEY.doRecruit(r);
  assert.strictEqual(r.field, before, 'no civilians left — nothing to draft');
});

test('a drafted soldier who dies costs the register exactly once', () => {
  const board = makeBoardFromMap(CRADLE_MAP, CRADLE_BINDING);
  const r = board[0];
  r.field = Math.round(r.fieldCap * 0.5);
  const start = r.pool;
  TOURNEY.doRecruit(r);
  const drafted = r.field - Math.round(r.fieldCap * 0.5);
  // the drafted men die
  r.field -= drafted;
  TOURNEY.poolBleed(r, drafted);
  assert.strictEqual(r.pool, start - drafted,
    'register drops by the deaths only — no draft double-count');
});

test('garrison regeneration draws from civilians (P1: no free healing)', () => {
  const board = makeBoardFromMap(CRADLE_MAP, CRADLE_BINDING);
  const r = board[0];
  const front = Object.keys(r.frontG)[0];
  r.frontG[front] = Math.round(r.frontCap[front] * 0.5); // wounded garrison
  // zero civilians: regen must find no bodies
  r.pool = TOURNEY.servingBodies(r);
  const healed = TOURNEY.regenGarrisons(r, { garrisonRegen: 0.10 });
  assert.strictEqual(healed, 0, 'no civilians — garrisons cannot regenerate');
  // give civilians: regen works again, register unchanged (bodies move, not die)
  r.pool += 5000;
  const before = r.pool;
  const healed2 = TOURNEY.regenGarrisons(r, { garrisonRegen: 0.10 });
  assert.ok(healed2 > 0, 'civilians available — regen flows');
  assert.strictEqual(r.pool, before, 'regen moves bodies; register unchanged');
});

test('registerPerPop sizes the cradle register from population when set', () => {
  const { BOARD_GAAN: G } = require('../mockup/combat-calc/map-board.js');
  const k = 1000;
  const board = makeBoardFromMap(CRADLE_MAP, CRADLE_BINDING, { ...G, registerPerPop: k });
  for (const r of board) {
    const pop = Object.values(CRADLE_MAP.sectors)
      .filter((s) => r.regionIds.includes(s.regionId))
      .reduce((t, s) => t + s.populationValue, 0);
    assert.strictEqual(r.pool, Math.round(pop * k),
      `${r.name} register = registerPerPop × Σ populationValue`);
  }
});
