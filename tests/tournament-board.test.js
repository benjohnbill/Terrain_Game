'use strict';
// L2 adapter — tournament.js plays on an injected cradle board instead
// of the built-in fixture board, and realm-level economy (sectorYield)
// overrides the flat harness sector value.

const { test } = require('node:test');
const assert = require('node:assert');

const TOURNEY = require('../mockup/combat-calc/tournament.js');
const ECON = require('../mockup/combat-calc/econ.js');
const { CRADLE_MAP, CRADLE_BINDING } = require('../mockup/combat-calc/map-gen.js');
const { makeBoardFromMap } = require('../mockup/combat-calc/map-board.js');

// Surge-draft intensity curve dials for the math tests — deliberately NOT
// the production placeholders, so these assertions verify the curve MATH,
// not the tunable values (which the magnitude session owns).
const CURVE = { base: 0.01, peaceKnee: 0.40, warKnee: 0.60, warMult: 2, fullMult: 10 };

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

// ---- surge draft: intensity price curve (Option B, the "blind") ----

test('intensityPrice: flat in peace, linear war ramp, steep desperation tail', () => {
  const p = (i) => ECON.intensityPrice(i, CURVE);
  assert.strictEqual(p(0.30), 0.01, 'peace zone flat at base');
  assert.strictEqual(p(0.40), 0.01, 'peace knee still base');
  assert.ok(Math.abs(p(0.50) - 0.015) < 1e-12, 'war ramp midpoint (0.01→0.02, half)');
  assert.ok(Math.abs(p(0.60) - 0.02) < 1e-12, 'war knee = base×warMult');
  assert.ok(Math.abs(p(0.80) - 0.06) < 1e-12, 'desperation midpoint (0.02→0.10, half)');
  assert.ok(Math.abs(p(1.00) - 0.10) < 1e-12, 'full mobilization = base×fullMult');
});

test('draftBill integrates the curve × register (flat zone: base × men)', () => {
  // reg 10000, 0.10→0.20 entirely in the flat peace zone: 1000 men at 0.01
  assert.ok(Math.abs(ECON.draftBill(10000, 0.10, 0.20, CURVE) - 10) < 1e-9);
});

test('draftBill trapezoid over the desperation tail (hand-computed)', () => {
  // reg 10000, 0.60→1.00: price 0.02→0.10 linear, men 4000, avg 0.06 → 240
  assert.ok(Math.abs(ECON.draftBill(10000, 0.60, 1.00, CURVE) - 240) < 1e-6);
});

test('draftBill across a knee sums the pieces (peace flat + war ramp)', () => {
  // reg 10000, 0.30→0.50: flat 0.30→0.40 (1000×0.01=10) + ramp 0.40→0.50
  // (1000 men, price 0.01→0.015, avg 0.0125 = 12.5) = 22.5
  assert.ok(Math.abs(ECON.draftBill(10000, 0.30, 0.50, CURVE) - 22.5) < 1e-6);
});

test('board realms start with a treasury war chest scaled to income', () => {
  const { BOARD_GAAN: G } = require('../mockup/combat-calc/map-board.js');
  const board = makeBoardFromMap(CRADLE_MAP, CRADLE_BINDING);
  const r = board[0];
  assert.ok(r.treasury > 0, 'treasury initialized');
  assert.ok(Math.abs(r.treasury - G.treasuryStartTurns * r.yieldBase) < 1e-9,
    'war chest = treasuryStartTurns × yieldBase (usable 1.0 at start)');
});

test('realmIncome = yieldBase × usable', () => {
  const board = makeBoardFromMap(CRADLE_MAP, CRADLE_BINDING);
  const r = board[0];
  r.usable = 0.5;
  assert.ok(Math.abs(TOURNEY.realmIncome(r) - r.yieldBase * 0.5) < 1e-9);
});

test('doRecruit is capped by treasury at the curve price (deep pockets → full draft)', () => {
  const mkR = () => {
    const r = makeBoardFromMap(CRADLE_MAP, CRADLE_BINDING)[0];
    r.field = Math.round(r.fieldCap * 0.5); // headroom + peace-zone intensity
    return r;
  };
  const ample = mkR(); ample.treasury = 1e6;
  const t0 = ample.treasury; const f0 = ample.field;
  TOURNEY.doRecruit(ample);
  const fullDraft = ample.field - f0;
  assert.ok(fullDraft > 100, 'ample treasury → full base draft');
  assert.ok(ample.treasury < t0, 'paid the bill from treasury');

  const broke = mkR(); broke.treasury = 0.05; // affords only a handful of men
  const f1 = broke.field;
  TOURNEY.doRecruit(broke);
  const capped = broke.field - f1;
  assert.ok(capped > 0 && capped < fullDraft, `treasury-capped well below full (got ${capped} vs ${fullDraft})`);
  assert.ok(broke.treasury >= 0, 'never overspends into negative treasury');
});

test('regenGarrisons pays the surge curve from treasury (P1) and caps to affordability', () => {
  const r = makeBoardFromMap(CRADLE_MAP, CRADLE_BINDING)[0];
  const front = Object.keys(r.frontG)[0];
  r.frontG[front] = Math.round(r.frontCap[front] * 0.3); // shattered shield
  r.treasury = 1e6; // ample
  const t0 = r.treasury; const pool0 = r.pool;
  const healed = TOURNEY.regenGarrisons(r, { garrisonRegen: 0.10 });
  assert.ok(healed > 0, 'healed with ample treasury');
  assert.ok(r.treasury < t0, 'paid the P1 yield side from treasury');
  assert.strictEqual(r.pool, pool0, 'regen moves bodies; register unchanged');

  const r2 = makeBoardFromMap(CRADLE_MAP, CRADLE_BINDING)[0];
  const f2 = Object.keys(r2.frontG)[0];
  r2.frontG[f2] = Math.round(r2.frontCap[f2] * 0.3);
  r2.treasury = 0; // cannot pay
  assert.strictEqual(TOURNEY.regenGarrisons(r2, { garrisonRegen: 0.10 }), 0,
    'no treasury → regen cannot be paid → no healing');
});

// ---- recovery-dial pass: garrison regen is commit-gated (Option A) ----

test('peacePrimary regenerates a shattered garrison before recruiting (preempt)', () => {
  const board = makeBoardFromMap(CRADLE_MAP, CRADLE_BINDING);
  const r = board[0];
  r.archetype = 'conquest-snowball'; // peace order ['recruit','fort']
  r._turn = 5;
  r.field = Math.round(r.fieldCap * 0.5); // recruit is available (field < cap)
  const front = Object.keys(r.frontG)[0];
  r.frontG[front] = Math.round(r.frontCap[front] * 0.5); // shattered, below 0.8×cap
  const before = r.frontG[front];
  const record = { raids: 0, regens: 0 };
  const act = TOURNEY.peacePrimary(r, board, TOURNEY.mulberry32(1), record);
  assert.strictEqual(act, 'regen', 'a shattered shield preempts recruit');
  assert.ok(r.frontG[front] > before, 'the garrison healed this turn');
});

test('peacePrimary does NOT regen when garrisons are full — falls through to the peace order', () => {
  const board = makeBoardFromMap(CRADLE_MAP, CRADLE_BINDING);
  const r = board[0]; // fresh board: g0=1.0, all garrisons at cap
  r.archetype = 'conquest-snowball'; // peace order ['recruit','fort']
  r._turn = 5;
  r.field = Math.round(r.fieldCap * 0.5); // recruit is available
  const record = { raids: 0, regens: 0 };
  const act = TOURNEY.peacePrimary(r, board, TOURNEY.mulberry32(1), record);
  assert.strictEqual(act, 'recruit', 'full shields → normal peace order (recruit)');
  assert.strictEqual(record.regens, 0, 'no regen was taken');
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
