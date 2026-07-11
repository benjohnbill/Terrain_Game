'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const { CRADLE_MAP, CRADLE_BINDING } = require('../mockup/combat-calc/map-gen.js');
const { makeBoardFromMap, FG_BOARD_GAAN, FG_FORT_BY_CLASS, runCradleTournament } = require('../mockup/combat-calc/map-board.js');
const T = require('../mockup/combat-calc/tournament.js');
const { DIALS } = require('../mockup/combat-calc/engine.js');
const { matchPanel } = require('../mockup/combat-calc/match.js');

test('FG_FORT_BY_CLASS is the sealed FG-② mapping', () => {
  assert.deepStrictEqual(FG_FORT_BY_CLASS, {
    open: 'fieldworks', forest: 'walls', hills: 'walls',
    river: 'walls', pass: 'fortress', strait: 'fortress',
  });
});

test('FG board differentiates fort by front crossing class', () => {
  const realms = makeBoardFromMap(CRADLE_MAP, CRADLE_BINDING, FG_BOARD_GAAN);
  const tiers = new Set();
  for (const r of realms)
    for (const [nbr, cls] of Object.entries(r.frontClass))
      assert.strictEqual(r.fortAt[nbr], FG_FORT_BY_CLASS[cls] ?? 'walls',
        `${r.name}→${nbr} (${cls}) fort matches mapping`),
      tiers.add(r.fortAt[nbr]);
  assert.ok(tiers.size >= 2, `varied fort tiers, got ${[...tiers]}`);
});

test('the default board is the FG record world; explicit BOARD_GAAN keeps the uniform-walls control', () => {
  // AB-② (2026-07-11) flipped the world of record to FG + M9; the sealed
  // uniform-walls start-state survives as the explicit opt-in control.
  const { BOARD_GAAN } = require('../mockup/combat-calc/map-board.js');
  const dflt = makeBoardFromMap(CRADLE_MAP, CRADLE_BINDING);
  for (const r of dflt)
    for (const [nbr, cls] of Object.entries(r.frontClass))
      assert.strictEqual(r.fortAt[nbr], FG_FORT_BY_CLASS[cls] ?? 'walls');
  const ctrl = makeBoardFromMap(CRADLE_MAP, CRADLE_BINDING, BOARD_GAAN);
  for (const r of ctrl)
    for (const f of Object.values(r.fortAt)) assert.strictEqual(f, 'walls');
});

test('FG board sets fortCeil = the terrain-class fort tier per front', () => {
  const realms = makeBoardFromMap(CRADLE_MAP, CRADLE_BINDING, FG_BOARD_GAAN);
  for (const r of realms)
    for (const [nbr, cls] of Object.entries(r.frontClass))
      assert.strictEqual(r.fortCeil[nbr], FG_FORT_BY_CLASS[cls] ?? 'walls');
});

test('peacePrimary does not upgrade fort above the terrain ceiling', () => {
  // an open front (ceiling fieldworks) already at its ceiling stays there.
  // frontG on every front (and capitalGarrison) is held >= regenThreshold
  // (0.8) of its cap so the shattered-garrison regen gate at the top of
  // peacePrimary stays closed and execution actually reaches the
  // pol.peace 'fort' action where the fortCeil predicate lives — a fixture
  // that trips the regen gate returns 'regen' before ever touching fort.
  const me = {
    archetype: 'shield-first', _turn: 5, seatType: 'flank',
    frontG: { X: 800, Y: 900 }, frontCap: { X: 900, Y: 900 },
    fortAt: { X: 'fieldworks', Y: 'walls' }, fortCeil: { X: 'fieldworks', Y: 'fortress' },
    capitalGarrison: 1500, pool: 5000, field: 0, fieldCap: 5000,
    treasury: 1e9, usable: 1, truce: {}, staging: false, wars: [],
  };
  const record = { presetOffers: [], regens: 0, raids: 0 };
  T.peacePrimary(me, [me], null, record);
  assert.strictEqual(me.fortAt.X, 'fieldworks', 'open front NOT pushed past fieldworks');
});

test('m9Fill pulls from other fronts + interior at the reserve rate, off when disabled', () => {
  const D = {
    frontG: { A: 200, B: 800, C: 600 }, interiorGarrison: 300,
    m9Reserve: true,
  };
  // engine reserveAwaken: floor(provinceStock * points*0.125); BOT.reservePoints=4 → 50%
  // provinceStock for front A = other fronts (800+600) + interior (300) = 1700
  assert.strictEqual(T.m9Fill(D, 'A'), Math.floor(1700 * 0.5));
  assert.strictEqual(T.m9Fill({ ...D, m9Reserve: false }, 'A'), 0);
});

test('frontDefense = garrison × terrain × fort', () => {
  const D = { frontG: { P: 1000 }, fortAt: { P: 'fortress' }, frontClass: { P: 'pass' } };
  // pass terrain 2.0 × fortress 2.4 × 1000 = 4800
  assert.strictEqual(T.frontDefense(D, 'P'), 1000 * DIALS.terrain.pass * DIALS.fort.fortress);
});

test('pickMainDefWar picks the front with the largest deficit (softest, most-pressed)', () => {
  const plains = { name: 'ATK1', field: 3000 };
  const passer = { name: 'ATK2', field: 3000 };
  const D = {
    name: 'DEF', frontG: { ATK1: 500, ATK2: 500 },
    fortAt: { ATK1: 'fieldworks', ATK2: 'fortress' },
    frontClass: { ATK1: 'open', ATK2: 'pass' },
  };
  const realms = [plains, passer, D];
  const wars = [{ att: 'ATK1', def: 'DEF', stage: 'field' }, { att: 'ATK2', def: 'DEF', stage: 'field' }];
  // ATK1 (plains, weak fort) deficit >> ATK2 (pass, fortress) → field army defends ATK1
  assert.strictEqual(T.pickMainDefWar(D, wars, realms).att, 'ATK1');
});

test('frontSoftness reads public terrain×fort, excludes the field army', () => {
  const me = { name: 'ME', brain: null };
  // two candidate defenders, equal garrison facing ME, different terrain/fort
  const soft = { name: 'S', field: 9999, frontG: { ME: 500 }, fortAt: { ME: 'fieldworks' }, frontClass: { ME: 'open' } };
  const hard = { name: 'H', field: 9999, frontG: { ME: 500 }, fortAt: { ME: 'fortress' }, frontClass: { ME: 'pass' } };
  // field army (9999) is IGNORED; only garrison×terrain×fort counts
  assert.ok(T.frontSoftness(me, soft) < T.frontSoftness(me, hard),
    'the open/fieldworks front reads softer than the pass/fortress front');
});

// FG U5: boosted shieldShare + within-realm variance (pure panel math — fixture
// perRealm objects carry frontPowers directly, no tournament run needed).
test('matchPanel reports boostedShieldShare and within-realm variance', () => {
  const perRealm = [
    { name: 'A', seat: 'center', alive: true, vassalOf: null, proj: 100, shield: 100, ctrl: 5, bodies: 1000,
      frontPowers: [4800, 130] },   // thick pass + thin plains → high variance
    { name: 'B', seat: 'flank', alive: true, vassalOf: null, proj: 100, shield: 100, ctrl: 5, bodies: 1000,
      frontPowers: [900, 900] },    // uniform → zero variance
  ];
  const p = matchPanel(perRealm, {});
  assert.ok(p.boostedShieldShare > 0 && p.boostedShieldShare <= 1);
  assert.ok(p.meanWithinRealmVariance > 0, 'A contributes nonzero within-realm CV');
  assert.ok('shieldShare' in p, 'raw shieldShare kept alongside');
});

// FG-⑩ Task 7: battery integration — a real (small) tournament on FG_BOARD_GAAN
// must produce aggregate() output carrying the new panel means.
const { viableBindings } = require('../mockup/combat-calc/map-gate.js');
const { aggregate } = require('../mockup/combat-calc/plan-battery.js');

test('FG tournament runs end-to-end and aggregate reports FG metrics', () => {
  const viable = viableBindings(CRADLE_MAP, 5).viable.slice(0, 2);
  const recs = runCradleTournament({ map: CRADLE_MAP, bindings: viable, reps: 2, seed: 1, boardGaan: FG_BOARD_GAAN });
  const agg = aggregate(recs);
  assert.ok(recs.length > 0);
  assert.strictEqual(typeof agg.decidedPct, 'number');
  assert.ok(agg.meanWithinRealmVariance > 0, 'FG board produces uneven fronts');
  assert.ok(typeof agg.meanBoostedShieldShare === 'number');
});
