'use strict';
// L2 crisis arc (ADR 0035/0036, RULINGS CE-①…⑳). Unit + integration tests.
const { test } = require('node:test');
const assert = require('node:assert');
const T = require('../mockup/combat-calc/tournament.js');
const M = require('../mockup/combat-calc/match.js');

test('crisis dial block exists and is OFF by default', () => {
  assert.strictEqual(T.HARNESS.crisis.enabled, false);
  assert.strictEqual(T.HARNESS.crisis.onset, 25);
  assert.strictEqual(T.HARNESS.crisis.hardEnd, 35);
});

// (crisisRate → unrestRise: covered by the RESHAPE staircase test below.)

test('addScar accumulates and terrainOf reads the sector terrain layer', () => {
  const s = { mapUnits: [{ terrainLayer: 'mountain' }] };
  assert.strictEqual(T.terrainOf(s), 'mountain');
  T.addScar(s, 0.15);
  T.addScar(s, 0.5);
  assert.ok(Math.abs(s.scar - 0.65) < 1e-9);
});

test('terrainOf defaults to plains when no map units', () => {
  assert.strictEqual(T.terrainOf({}), 'plains');
});

// (sectorFuel removed in the CE-④/⑭ reshape — growth no longer factors a
// separate fuel term; the RESHAPE additive-baseline / scar-amplifier / cap
// tests below cover growRebels in its new form.)

test('suppressAttrition: stronger suppressor kills more rebels, bleeds less', () => {
  const C = T.HARNESS.crisis;
  const strong = T.suppressAttrition(3000, 900, 1.0, C); // R high
  const weak = T.suppressAttrition(600, 900, 1.0, C);    // R low
  assert.ok(strong.rebelDead > weak.rebelDead, 'more rebels die at high R');
  assert.ok(strong.suppressorDead < weak.suppressorDead, 'suppressor bleeds less at high R');
  assert.ok(strong.rebelDead <= 900 + 1e-9, 'cannot kill more rebels than exist');
});

test('suppressAttrition: terrain shelters rebels (mountain lowers R, fewer die)', () => {
  const C = T.HARNESS.crisis;
  const plain = T.suppressAttrition(1500, 900, C.terrainDef.plains, C);
  const mtn = T.suppressAttrition(1500, 900, C.terrainDef.mountain, C);
  assert.ok(mtn.rebelDead < plain.rebelDead, 'mountains shelter the guerrilla');
});

test('suppressAttrition: zero rebels is a no-op', () => {
  const r = T.suppressAttrition(1000, 0, 1.0, T.HARNESS.crisis);
  assert.strictEqual(r.rebelDead, 0);
  assert.strictEqual(r.suppressorDead, 0);
});

function tinyCrisisRealm(name, { pool = 1200, field = 400, scarA = 6 } = {}) {
  const sA = { id: name + 'a', populationValue: 1, economyValue: 1, usableEconomy: 1,
    scar: scarA, mapUnits: [{ terrainLayer: 'plains' }] };
  const sB = { id: name + 'b', populationValue: 1, economyValue: 1, usableEconomy: 1,
    scar: 0, mapUnits: [{ terrainLayer: 'plains' }] };
  const world = { sectors: new Map([[sA.id, sA], [sB.id, sB]]), borderIds: new Set(), seceded: new Map() };
  return { name, world, holds: new Set([sA.id, sB.id]), pool, field,
    frontG: { X: 600 }, frontCap: { X: 600 }, capitalGarrison: 600, usable: 1, alive: true };
}

test('crisisTurn grows then suppresses, erasing the register by rebel deaths', () => {
  const C = { ...T.HARNESS.crisis, enabled: true, rate0: 0.5, rateStep: 0, suppressBudgetFrac: 1 };
  const H = { ...T.HARNESS, crisis: C };
  const r = tinyCrisisRealm('R');
  const poolBefore = r.pool;
  const record = { crisis: {} };
  T.crisisTurn([r], 26, H, record);
  assert.ok(record.crisis.rebelDead > 0, 'suppression killed rebels this turn');
  assert.ok(r.pool < poolBefore, 'rebel deaths shrank the register permanently');
});

test('crisisTurn: with no suppression budget, sectors are refused (burn + counter)', () => {
  const C = { ...T.HARNESS.crisis, enabled: true, rate0: 0.5, rateStep: 0, suppressBudgetFrac: 0 };
  const H = { ...T.HARNESS, crisis: C };
  const r = tinyCrisisRealm('R');
  const record = { crisis: {} };
  T.crisisTurn([r], 26, H, record);
  const sA = r.world.sectors.get('Ra');
  assert.strictEqual(sA._refusedThisTurn, true, 'unsuppressed scarred sector is refused');
});

test('a persistently refused sector secedes after secessionN turns', () => {
  const C = { ...T.HARNESS.crisis, enabled: true, rate0: 0.5, rateStep: 0,
    suppressBudgetFrac: 0, secessionN: 2, secessionFrac: 1 };
  const H = { ...T.HARNESS, crisis: C };
  const r = tinyCrisisRealm('R');
  r.world.seceded = new Map();
  const record = { crisis: {} };
  T.crisisTurn([r], 26, H, record); // refuse #1
  assert.ok(r.holds.has('Ra'), 'still held after one refusal');
  T.crisisTurn([r], 27, H, record); // refuse #2 → secede
  assert.ok(!r.holds.has('Ra'), 'seceded sector leaves holds');
  assert.ok(r.world.seceded.has('Ra'), 'seceded sector recorded on the world');
  assert.ok(r.world.seceded.get('Ra') > 0, 'seceded with a standing stack');
});

test('suppressing a sector resets its neglect counter (no secession)', () => {
  const C = { ...T.HARNESS.crisis, enabled: true, rate0: 0.5, rateStep: 0,
    suppressBudgetFrac: 1, secessionN: 2 };
  const H = { ...T.HARNESS, crisis: C };
  const r = tinyCrisisRealm('R');
  r.world.seceded = new Map();
  const record = { crisis: {} };
  T.crisisTurn([r], 26, H, record);
  T.crisisTurn([r], 27, H, record);
  assert.ok(r.holds.has('Ra'), 'suppressed sector does not secede');
});

// CE-⑮ edge case: a sector suppressed to EXACTLY zero stack must still reset
// its neglect counter (the reviewer's finding on Task 6 — a zero-stack guard
// evaluated at the top of the refusal/secession scan can "continue" past the
// reset branch entirely). Note on constructing R >= the full-kill threshold:
// under the sealed MATCH_DIALS.shieldRatio (1.7), suppressAttrition's R is
// pinned at exactly shieldRatio whenever the suppression budget does not
// bind (rebelEffectiveness/terrain cancel identically between the per-sector
// power cap and rebelDef — no HARNESS.crisis dial can move it), capping the
// kill fraction at ~25%/turn — never enough to zero a stack in one pass. A
// temporarily inflated shieldRatio is the only deterministic way to drive
// full annihilation and exercise the exact-zero edge case.
test('a sector suppressed to exactly zero stack still resets its neglect counter (CE-⑮ edge case)', () => {
  const match = require('../mockup/combat-calc/match.js');
  const savedShieldRatio = match.MATCH_DIALS.shieldRatio;
  try {
    match.MATCH_DIALS.shieldRatio = 100; // force R past the full-kill threshold
    const Crefuse = { ...T.HARNESS.crisis, enabled: true, rate0: 0.5, rateStep: 0,
      suppressBudgetFrac: 0, secessionN: 2 };
    const Hrefuse = { ...T.HARNESS, crisis: Crefuse };
    const Hsuppress = { ...T.HARNESS, crisis: { ...Crefuse, suppressBudgetFrac: 1 } };

    const r = tinyCrisisRealm('R');
    r.world.seceded = new Map();
    const record = { crisis: {} };
    const sA = r.world.sectors.get('Ra');

    T.crisisTurn([r], 26, Hrefuse, record); // turn 1: zero budget -> refused
    assert.strictEqual(sA.neglect, 1, 'refused turn bumps neglect to 1');
    assert.ok(sA.rebelStack > 0, 'stack still standing going into the suppression turn');

    T.crisisTurn([r], 27, Hsuppress, record); // turn 2: full budget -> driven to exactly 0
    assert.strictEqual(sA.rebelStack, 0, 'suppression fully annihilated the stack this turn');
    assert.strictEqual(sA._refusedThisTurn, false, 'sector was suppressed (not refused) this turn');
    assert.strictEqual(sA.neglect, 0, 'CE-⑮: suppressed sector resets neglect even at zero stack');

    T.crisisTurn([r], 28, Hrefuse, record); // turn 3: refuse once more (secessionN-1 = 1 turn)
    assert.strictEqual(sA.neglect, 1, 'neglect restarted from the mid-sequence reset, not from turn 1');
    assert.ok(r.holds.has('Ra'), 'mid-sequence suppression reset means it must NOT secede on the old schedule');
  } finally {
    match.MATCH_DIALS.shieldRatio = savedShieldRatio;
  }
});

test('boardRebelMass sums held + seceded raw stacks across realms', () => {
  const sA = { id: 'a', rebelStack: 100 };
  const sB = { id: 'b', rebelStack: 0 };
  const seceded = new Map([['z', 250]]);
  const world = { sectors: new Map([['a', sA], ['b', sB]]), borderIds: new Set(), seceded };
  const r = { name: 'R', world, holds: new Set(['a', 'b']), alive: true };
  assert.strictEqual(T.boardRebelMass([r]), 350);
});

test('checkView stamps zero denial when crisis is off, positive when on', () => {
  const sA = { id: 'a', rebelStack: 300, populationValue: 1, economyValue: 1, usableEconomy: 1 };
  const world = { sectors: new Map([['a', sA]]), borderIds: new Set(), seceded: new Map() };
  const r = { name: 'R', world, holds: new Set(['a']), alive: true, vassalOf: null,
    field: 400, fieldCap: 800, frontG: {}, capitalGarrison: 200, pool: 1000, exits: [{ cap: Infinity }] };
  const off = T.checkView([r]);
  assert.strictEqual(off[0].rebelDenial ?? 0, 0);
  const H = { ...T.HARNESS, crisis: { ...T.HARNESS.crisis, enabled: true, denialCoeff: 1 } };
  const on = T.checkView([r], H);
  assert.strictEqual(on[0].rebelDenial, 300);
});

test('rebel denial raises the coalition, making unassailability harder', () => {
  // two realms; candidate strong. Without rebels it is unassailable; a big
  // rebel denial term pushes coalition over the need.
  const mk = (name, field) => ({ name, alive: true, vassalOf: null, field, fieldCap: field,
    garrisons: 500, fronts: {}, treasury: 0, income: 0, pool: 3000, serving: field + 500,
    exits: [{ cap: Infinity }] });
  const strong = { ...mk('A', 6000) };
  const weak = { ...mk('B', 1500) };
  const clean = M.hegemonyCheck([strong, weak], 'A');
  const flamed = M.hegemonyCheck([{ ...strong, rebelDenial: 99999 }, { ...weak, rebelDenial: 99999 }], 'A');
  assert.ok(clean.unassailable, 'unassailable with no rebels');
  assert.ok(!flamed.unassailable, 'a continent in flames denies the crown');
});

test('백지 (white peace) is the 0% rung of the settlement ladder', () => {
  assert.ok(M.MATCH_DIALS.presets['백지']);
  assert.strictEqual(M.MATCH_DIALS.presets['백지'].claimRate, 0);
  const b = M.presetBundle('백지', { occValue: 10, raidLoot: 4 });
  assert.strictEqual(b.value, 0, 'claims nothing');
});

test('overlay breaks the ladder from the bottom up; 최대 always survives', () => {
  const C = { ...T.HARNESS.crisis, enabled: true, onset: 25, stage: { s1: 25, s2: 28, s3: 31 } };
  const H = { ...T.HARNESS, crisis: C };
  assert.deepStrictEqual(T.availablePresets(24, H), ['백지', '관대', '표준', '최대']); // pre-onset: full
  assert.deepStrictEqual(T.availablePresets(28, H), ['표준', '최대']);   // S2: 백지+관대 gone
  assert.deepStrictEqual(T.availablePresets(31, H), ['최대']);            // S3: only 최대
});

test('overlay shortens then voids the truce on the calendar', () => {
  const C = { ...T.HARNESS.crisis, enabled: true, onset: 25, stage: { s1: 25, s2: 28, s3: 31 } };
  const H = { ...T.HARNESS, crisis: C, truceTurns: 4 };
  assert.strictEqual(T.truceLength(10, H), 4);  // pre-crisis: full
  assert.strictEqual(T.truceLength(26, H), 2);  // S1: halved
  assert.strictEqual(T.truceLength(29, H), 0);  // S2+: void
});

test('overlay is inert when crisis is off', () => {
  assert.deepStrictEqual(T.availablePresets(30, T.HARNESS), ['백지', '관대', '표준', '최대']);
  assert.strictEqual(T.truceLength(30, T.HARNESS), T.HARNESS.truceTurns);
});

// --- sweep driver + CE-⑫ gate report (crisis-on vs off) ---
const MB = require('../mockup/combat-calc/map-board.js');
const { CRADLE_MAP } = require('../mockup/combat-calc/map-gen.js');
const { viableBindings } = require('../mockup/combat-calc/map-gate.js');

test('crisis-on cradle run produces draws and a CE-⑫ gate report', () => {
  const binding = viableBindings(CRADLE_MAP, 5).viable.slice(0, 1);
  const on = MB.runCradleTournament({
    map: CRADLE_MAP, bindings: binding, reps: 1, seed: 7,
    harness: { crisis: { ...T.HARNESS.crisis, enabled: true } },
  });
  const report = MB.crisisGateReport(on);
  assert.ok(report.total > 0);
  assert.ok('drawRate' in report);
  assert.ok('warDensity2535' in report && 'warDensity1525' in report);
  assert.ok('registerExhaustionRate' in report);
  assert.ok(report.suppressCostByTerrain && typeof report.suppressCostByTerrain === 'object');
  // fix 3: the gate (d) key is now a real per-realm scar spread, not a
  // rebel-death total.
  assert.ok('scarSpreadMeanPerMatch' in report);
  assert.strictEqual(typeof report.scarSpreadMeanPerMatch, 'number');
  assert.ok(!('rebelDeadMeanPerMatch' in report), 'the misleading key is gone');
});

test('crisis-on is seed-deterministic (no dice)', () => {
  const binding = viableBindings(CRADLE_MAP, 5).viable.slice(0, 1);
  const run = () => MB.runCradleTournament({
    map: CRADLE_MAP, bindings: binding, reps: 1, seed: 4,
    harness: { crisis: { ...T.HARNESS.crisis, enabled: true } },
  }).map((r) => `${r.seat}:${r.focal}:${r.winner}:${r.endingShape}`);
  assert.deepStrictEqual(run(), run());
});

// --- fix wave (final whole-branch review, 2026-07-12): measurement-
// instrument corrections, not mechanics changes ---

test('fix 1: runMatch record carries poolStart (reserve-register-only denominator)', () => {
  const assignment = {};
  for (const s of T.SEATS) assignment[s] = { archetype: 'shield-first', temperament: '실리' };
  const rec = T.runMatch(assignment, { seed: 7 });
  assert.strictEqual(typeof rec.poolStart, 'number');
  assert.ok(rec.poolStart > 0);
  // bodiesStart (field+garrison+pool) must stay untouched — the panel still
  // reads it (fix 1 only changes the gate-report denominator, not this field).
  assert.ok(rec.bodiesStart >= rec.poolStart);
});

test('fix 1: crisisGateReport registerExhaustionRate is 0 when no register died', () => {
  const records = [
    { warsByTurn: {}, poolStart: 500, finalRealms: [{ pool: 300 }, { pool: 200 }] },
  ];
  const report = MB.crisisGateReport(records);
  assert.strictEqual(report.registerExhaustionRate, 0);
});

test('fix 1: crisisGateReport registerExhaustionRate reflects real loss and stays in [0,1]', () => {
  const records = [
    { warsByTurn: {}, poolStart: 500, finalRealms: [{ pool: 100 }, { pool: 50 }] }, // 150/500 remain
  ];
  const report = MB.crisisGateReport(records);
  assert.ok(report.registerExhaustionRate > 0 && report.registerExhaustionRate <= 1);
  assert.ok(Math.abs(report.registerExhaustionRate - (1 - 150 / 500)) < 1e-9);
});

test('fix 2: war-density windows are disjoint — turn 25 (onset) counts once, into 25-35 only', () => {
  const records = [{ warsByTurn: { 24: 1, 25: 1, 35: 1 } }];
  const report = MB.crisisGateReport(records);
  assert.strictEqual(report.warDensity1525, 1); // only turn 24
  assert.strictEqual(report.warDensity2535, 2); // turns 25 and 35
});

test('fix 3: crisisGateReport scarSpreadMeanPerMatch reflects per-realm differentiation', () => {
  const records = [
    { warsByTurn: {}, scarByRealm: { A: 10, B: 2, C: 6 } }, // spread 8
    { warsByTurn: {}, scarByRealm: { A: 5, B: 5 } },        // spread 0
  ];
  const report = MB.crisisGateReport(records);
  assert.ok(Math.abs(report.scarSpreadMeanPerMatch - 4) < 1e-9); // mean(8, 0)
});

test('fix 3: crisisGateReport is 0/undefined-safe on empty or crisis-less records', () => {
  assert.doesNotThrow(() => MB.crisisGateReport([]));
  const empty = MB.crisisGateReport([]);
  assert.strictEqual(empty.scarSpreadMeanPerMatch, 0);
  assert.strictEqual(empty.registerExhaustionRate, 0);
  const noCrisis = MB.crisisGateReport([{ warsByTurn: {}, endingShape: 'trip-solo' }]);
  assert.strictEqual(noCrisis.scarSpreadMeanPerMatch, 0);
  assert.strictEqual(noCrisis.registerExhaustionRate, 0);
});

test('fix 3: finish() writes scarByRealm only when crisis is enabled (crisis-off stays untouched)', () => {
  const assignment = {};
  for (const s of T.SEATS) assignment[s] = { archetype: 'shield-first', temperament: '실리' };
  const off = T.runMatch(assignment, { seed: 7 });
  assert.strictEqual(off.scarByRealm, undefined);
});

test('fix 4: runMatch deep-merges a PARTIAL crisis harness override onto the defaults', () => {
  const binding = viableBindings(CRADLE_MAP, 5).viable.slice(0, 1);
  // a dial-tuning sweep touches ONE crisis dial without restating
  // onset/hardEnd — a shallow merge would drop them (lastTurn -> undefined
  // -> the turn loop runs zero times -> an immediate no-war draw).
  const on = MB.runCradleTournament({
    map: CRADLE_MAP, bindings: binding, reps: 1, seed: 7,
    harness: { crisis: { enabled: true, denialCoeff: 2 } },
  });
  const rec = on[0];
  assert.ok(rec.warsStarted > 0, 'turns were actually played under the merged crisis defaults');
});

// --- fix wave 2 (re-review): eliminated realms carry a stale, un-zeroed
// pool into crisisGateReport's endPool sum ---

test('fix A: crisisGateReport excludes an eliminated realm\'s stale leftover pool from endPool', () => {
  // eliminate() (tournament.js ~line 969/977) credits the winner with
  // round(D.pool * 0.5) but never zeros D.pool itself — record.finalRealms
  // (~line 1352) then carries D at alive:false with its FULL, un-reduced
  // pool. Naively summing r.pool over every finalRealms entry (dead + alive)
  // therefore double-books that register: once (halved) on the winner and
  // once (whole) on the corpse. A winner who absorbed a well-stocked loser
  // late in the match can push the naive endPool ABOVE poolStart, which
  // drives registerExhaustionRate negative — a value the field's own
  // contract ([0,1]) says can never happen.
  const records = [
    {
      warsByTurn: {},
      poolStart: 500,
      finalRealms: [
        { name: 'A', alive: true, pool: 450 },  // winner, grew via recruitment + D's inherited half
        { name: 'D', alive: false, pool: 200 }, // eliminated — stale pool eliminate() never zeroed
      ],
    },
  ];
  const report = MB.crisisGateReport(records);
  // sane range: the pre-fix naive sum (450+200=650 endPool over a
  // poolStart of 500) drives this to -0.3 — out of bounds.
  assert.ok(report.registerExhaustionRate >= 0 && report.registerExhaustionRate <= 1,
    `registerExhaustionRate must stay in [0,1], got ${report.registerExhaustionRate}`);
  // exact value: only the alive realm's pool (450) counts, so
  // 1 - 450/500 = 0.1 — the dead realm's 200 is excluded entirely, not
  // merely discounted.
  assert.ok(Math.abs(report.registerExhaustionRate - 0.1) < 1e-9,
    `expected 0.1 (dead pool excluded), got ${report.registerExhaustionRate}`);
});

test('fix A: crisisGateReport still sums normally when nobody was eliminated', () => {
  const records = [
    { warsByTurn: {}, poolStart: 500, finalRealms: [{ alive: true, pool: 300 }, { alive: true, pool: 100 }] },
  ];
  const report = MB.crisisGateReport(records);
  assert.ok(Math.abs(report.registerExhaustionRate - (1 - 400 / 500)) < 1e-9);
});

// CE-㉑ conquest-pacification: a definitive acquisition (settlement cession /
// elimination) disperses the sector's STANDING uprising — the rebellion's
// target regime is gone. The scar ledger (land memory) and usable floor are
// inherited unchanged, so the sector re-mobilizes under the conqueror's own
// intensity (the deferred bill / honeymoon). Direction sealed 2026-07-12
// (subtraction model, not scar-reset); values 가안, validated by measurement.
test('CE-㉑ crisis-on acquisition disperses the sector uprising (pacifyFrac 1.0); scar inherited', () => {
  const C = { ...T.HARNESS.crisis, enabled: true, conquestPacifyFrac: 1.0 };
  const H = { ...T.HARNESS, crisis: C };
  const s = { id: 'x', populationValue: 1, economyValue: 1, scar: 3, rebelStack: 42,
    usableEconomy: 1, usablePop: 1, mapUnits: [{ terrainLayer: 'plains' }] };
  const world = { sectors: new Map([['x', s]]), borderIds: new Set() };
  const r = { name: 'A', world, holds: new Set() };
  T.acquireSector(r, 'x', H);
  assert.strictEqual(s.rebelStack, 0, 'standing uprising dispersed on definitive acquisition');
  assert.strictEqual(s.scar, 3, 'land memory (scar) inherited, not reset');
  assert.ok(r.holds.has('x'), 'sector is now held');
});

test('CE-㉑ crisis-OFF acquisition inherits the rebel stack unchanged (byte-identity guard)', () => {
  const H = { ...T.HARNESS }; // crisis disabled by default → pre-CE-㉑ behavior
  const s = { id: 'y', populationValue: 1, economyValue: 1, scar: 3, rebelStack: 42,
    usableEconomy: 1, usablePop: 1, mapUnits: [{ terrainLayer: 'plains' }] };
  const world = { sectors: new Map([['y', s]]), borderIds: new Set() };
  const r = { name: 'A', world, holds: new Set() };
  T.acquireSector(r, 'y', H);
  assert.strictEqual(s.rebelStack, 42, 'crisis-off: standing stack inherited whole, as before');
});

test('CE-㉑ acquisition drops board rebel mass by the dispersed sector stack', () => {
  const C = { ...T.HARNESS.crisis, enabled: true, conquestPacifyFrac: 1.0 };
  const H = { ...T.HARNESS, crisis: C };
  const s = { id: 'z', populationValue: 1, economyValue: 1, scar: 3, rebelStack: 50,
    usableEconomy: 1, usablePop: 1, mapUnits: [{ terrainLayer: 'plains' }] };
  const world = { sectors: new Map([['z', s]]), borderIds: new Set(), seceded: new Map() };
  const conqueror = { name: 'A', alive: true, world, holds: new Set(['z']) };
  assert.strictEqual(T.boardRebelMass([conqueror]), 50, 'standing before pacification');
  // simulate a fresh conquest: sector leaves limbo into the conqueror's holds
  conqueror.holds.delete('z');
  T.acquireSector(conqueror, 'z', H);
  assert.strictEqual(T.boardRebelMass([conqueror]), 0, 'denial relieved by the dispersed uprising');
});

// CE-⑳ total-war overlay closes the stall→white-peace exit: once the overlay
// voids truce (stage ≥ noStallPeaceStage), a stalled war can no longer fizzle
// back to status quo — it keeps grinding while shields hollow (CE-⑩) so the
// deciding war can reach shield-break rather than resetting. Direction sealed
// 2026-07-12; the stage threshold is 가안, validated by measurement.
test('CE-⑳ overlay closes stall→white-peace once total war reaches stage 2 (truce-void)', () => {
  const MB = require('../mockup/combat-calc/map-board.js');
  const { CRADLE_MAP } = require('../mockup/combat-calc/map-gen.js');
  const { viableBindings } = require('../mockup/combat-calc/map-gate.js');
  const b = viableBindings(CRADLE_MAP, 5).viable.slice(0, 3);
  const on = MB.runCradleTournament({ map: CRADLE_MAP, bindings: b, reps: 2, seed: 42,
    harness: { crisis: { ...T.HARNESS.crisis, enabled: true } } });
  const s2 = T.HARNESS.crisis.stage.s2;
  let lateStall = 0;
  for (const r of on) for (const e of (r.warEnds || []))
    if (e.cause === 'stallPeace' && e.turn >= s2) lateStall++;
  assert.strictEqual(lateStall, 0,
    'a stalled war must not fizzle to status-quo peace once the overlay hits stage 2');
});

// (CE-⑩ shield-drain reverted 2026-07-12: deducting suppressorDead from
// garrisons was symmetric — it paralysed every realm's defence at once instead
// of opening a decisive war, and it punished defensive investment against the
// CE-⑩ "defensive infrastructure gains double value" intent. suppressorDead
// stays a measurement-only accumulator; the crisis pressure is being
// re-routed to an asymmetric-opening axis instead.)

// ── CE-㉒ asymmetric siege-drag (form-lock, 2026-07-13) ──────────────────
// A realm's OWN standing rebellion pins its border shield: internal order ties
// down garrisons, so the more a realm is aflame the weaker its siege defence.
// This is the ASYMMETRIC replacement for shield-drain — it hits only the
// realm carrying the revolt (measured: the most-scarred realm is the early
// expander 77% of the time), turning the expander's deferred aggression debt
// into a real military opening. drag = min(cap, k × ownRebelMass / ownGarrisons).
// Field armies are untouched (CE-⑩ — swords stay free). Values 가안.
test('CE-㉒ rebelSiegeDrag: zero with no revolt, rises with rebel mass, saturates at the cap', () => {
  const C = { ...T.HARNESS.crisis, enabled: true, rebelSiegeDragK: 0.5, rebelSiegeDragCap: 0.7 };
  const mk = (rebel) => {
    const s = { id: 'a', rebelStack: rebel };
    const world = { sectors: new Map([['a', s]]) };
    return { name: 'D', world, holds: new Set(['a']), frontG: { n: 600 }, capitalGarrison: 400 };
  };
  assert.strictEqual(T.rebelSiegeDrag(mk(0), C), 0, 'a calm realm keeps its full shield');
  const d1 = T.rebelSiegeDrag(mk(500), C);   // 0.5 × 500/1000 = 0.25
  const d2 = T.rebelSiegeDrag(mk(1000), C);  // 0.5 × 1000/1000 = 0.5
  assert.ok(Math.abs(d1 - 0.25) < 1e-9, `expected 0.25, got ${d1}`);
  assert.ok(d2 > d1, 'more revolt pins more shield (monotone)');
  assert.ok(Math.abs(T.rebelSiegeDrag(mk(100000), C) - 0.7) < 1e-9, 'saturates at the cap');
});

test('CE-㉒ rebelSiegeDrag: no garrison → no drag (guard, no divide-by-zero)', () => {
  const C = { ...T.HARNESS.crisis, enabled: true, rebelSiegeDragK: 0.5, rebelSiegeDragCap: 0.7 };
  const s = { id: 'a', rebelStack: 500 };
  const world = { sectors: new Map([['a', s]]) };
  const bare = { name: 'D', world, holds: new Set(['a']), frontG: {}, capitalGarrison: 0 };
  assert.strictEqual(T.rebelSiegeDrag(bare, C), 0, 'no shield to pin → drag 0');
});

// ── CE-⑦ self-denial (form-lock, 2026-07-13) ────────────────────────────
// A realm's crown-denial is its OWN standing rebellion, not the board-global
// mass. Board-global made suppression a public good (everyone shared the
// reduction → nobody acted → draws). Self-denial: your own fire blocks your
// own crown, and suppressing it (a judgment with its own cost, CE-⑩/⑭.3)
// restores your claim — the risk-vs-reward lens as layered judgment, homework
// not punishment. selfDenialFrac blends self↔board (가안 1.0 = pure self;
// 0 = the old board-global term, kept for A/B measurement).
function mkRealm(name, stacks) {
  const sectors = new Map(Object.entries(stacks).map(([id, v]) => [id, { id, rebelStack: v }]));
  return { name, alive: true, world: { sectors, seceded: new Map() }, holds: new Set(sectors.keys()) };
}

test('CE-⑦ self-denial: a calm realm is NOT denied by its neighbor\'s fire (selfDenialFrac 1.0)', () => {
  const C = { ...T.HARNESS.crisis, enabled: true, denialCoeff: 1.0, selfDenialFrac: 1.0 };
  const calm = mkRealm('A', { a: 0 });
  const burning = mkRealm('B', { b: 500 });
  const realms = [calm, burning];
  assert.strictEqual(T.rebelDenialFor(calm, realms, C), 0, 'calm realm: own fire 0 → crown reachable');
  assert.strictEqual(T.rebelDenialFor(burning, realms, C), 500, 'burning realm: denied by its OWN 500');
});

test('CE-⑦ self-denial blends to the old board-global term at selfDenialFrac 0', () => {
  const C = { ...T.HARNESS.crisis, enabled: true, denialCoeff: 1.0, selfDenialFrac: 0 };
  const calm = mkRealm('A', { a: 0 });
  const burning = mkRealm('B', { b: 500 });
  const realms = [calm, burning];
  // board mass = 500; both realms carry the full board term (public good, pre-reframe)
  assert.strictEqual(T.rebelDenialFor(calm, realms, C), 500);
  assert.strictEqual(T.rebelDenialFor(burning, realms, C), 500);
});

test('CE-⑦ self-denial is monotone in own rebel mass (frac 1.0) and scales with denialCoeff', () => {
  const C = { ...T.HARNESS.crisis, enabled: true, denialCoeff: 2.0, selfDenialFrac: 1.0 };
  const lo = mkRealm('A', { a: 100 });
  const hi = mkRealm('B', { b: 800 });
  const realms = [lo, hi];
  assert.ok(T.rebelDenialFor(hi, realms, C) > T.rebelDenialFor(lo, realms, C), 'more own revolt → more denial');
  assert.strictEqual(T.rebelDenialFor(lo, realms, C), 200, 'denialCoeff 2 × own 100 = 200');
});

// ── CE-④/⑭ rebellion-growth RESHAPE (form-lock, 2026-07-12) ──────────────
// The cataclysm rises as a fraction of what CAN rise (register share), so it
// reaches army scale instead of whisper. riseFrac(t,s) = unrestBase0 +
// unrestStep×(t−onset)  [the scar-independent cataclysm baseline, a time
// staircase]  +  scarGain × scar(s)  [the aggression-debt amplifier].
//   grow = riseFrac × registerShare ,  capped at registerShare.
// Values below are FIXTURES exercising the SHAPE; seed 가안 tuned by the sweep.

test('unrestRise is a linear cataclysm staircase from onset (scar-independent baseline)', () => {
  const C = { ...T.HARNESS.crisis, unrestBase0: 0.02, unrestStep: 0.005 };
  assert.ok(Math.abs(T.unrestRise(C.onset, C) - 0.02) < 1e-12, 'starts at unrestBase0');
  assert.ok(Math.abs(T.unrestRise(C.onset + 1, C) - 0.025) < 1e-12, 'climbs by unrestStep');
  assert.ok(T.unrestRise(C.hardEnd, C) > T.unrestRise(C.onset, C), 'later is worse');
  assert.ok(Math.abs(T.unrestRise(C.onset - 3, C) - 0.02) < 1e-12, 'clamped pre-onset');
});

// helper: one held sector, one realm, register share = pool (single sector)
function oneSectorRealm({ scar = 0, pool = 1000, pop = 1 } = {}) {
  const s = { id: 'a', populationValue: pop, economyValue: 1, scar,
    mapUnits: [{ terrainLayer: 'plains' }] };
  const world = { sectors: new Map([['a', s]]), borderIds: new Set() };
  const r = { name: 'R', world, holds: new Set(['a']), pool, field: 300,
    frontG: {}, capitalGarrison: 0 };
  return { r, s };
}

test('RESHAPE additive baseline: undamaged land STILL rises under the cataclysm (scar 0, base > 0)', () => {
  const C = { ...T.HARNESS.crisis, enabled: true, unrestBase0: 0.1, unrestStep: 0, scarGain: 0.05 };
  const H = { ...T.HARNESS, crisis: C };
  const { r, s } = oneSectorRealm({ scar: 0, pool: 1000 });
  T.growRebels(r, 25, H);
  // riseFrac = 0.1 + 0.05×0 = 0.1 ; share = 1000 ; grow = 100 — army scale, not whisper
  assert.ok(s.rebelStack > 50, `baseline alone must raise army-scale rebels, got ${s.rebelStack}`);
});

test('RESHAPE scar is a pure amplifier: with zero baseline, scarred land still rises', () => {
  const C = { ...T.HARNESS.crisis, enabled: true, unrestBase0: 0, unrestStep: 0, scarGain: 0.05 };
  const H = { ...T.HARNESS, crisis: C };
  const { r, s } = oneSectorRealm({ scar: 4, pool: 1000 });
  T.growRebels(r, 25, H);
  assert.ok(s.rebelStack > 0, 'scar alone (no baseline) still seeds a rising');
});

test('RESHAPE dead when both dials are off (base 0, scarGain 0) — even with scar', () => {
  const C = { ...T.HARNESS.crisis, enabled: true, unrestBase0: 0, unrestStep: 0, scarGain: 0 };
  const H = { ...T.HARNESS, crisis: C };
  const { r, s } = oneSectorRealm({ scar: 9, pool: 1000 });
  T.growRebels(r, 30, H);
  assert.strictEqual(s.rebelStack ?? 0, 0, 'no baseline and no amplifier → no rebellion');
});

test('RESHAPE scar amplifies monotonically: more scar → more growth (same baseline)', () => {
  const C = { ...T.HARNESS.crisis, enabled: true, unrestBase0: 0.02, unrestStep: 0, scarGain: 0.05 };
  const H = { ...T.HARNESS, crisis: C };
  const lo = oneSectorRealm({ scar: 1, pool: 1000 });
  const hi = oneSectorRealm({ scar: 8, pool: 1000 });
  T.growRebels(lo.r, 25, H);
  T.growRebels(hi.r, 25, H);
  assert.ok(hi.s.rebelStack > lo.s.rebelStack, 'the more-scarred sector burns harder');
});

test('RESHAPE scale-bridge: growth scales with register share (double the pool → double the rise)', () => {
  const C = { ...T.HARNESS.crisis, enabled: true, unrestBase0: 0.1, unrestStep: 0, scarGain: 0 };
  const H = { ...T.HARNESS, crisis: C };
  const small = oneSectorRealm({ scar: 0, pool: 1000 });
  const big = oneSectorRealm({ scar: 0, pool: 2000 });
  T.growRebels(small.r, 25, H);
  T.growRebels(big.r, 25, H);
  assert.ok(Math.abs(big.s.rebelStack - 2 * small.s.rebelStack) < 1e-6,
    'rise is anchored to what CAN rise (register share), not a free-floating absolute');
});

test('RESHAPE cap: rebelStack never exceeds the register share, even at extreme dials', () => {
  const C = { ...T.HARNESS.crisis, enabled: true, unrestBase0: 1000, unrestStep: 0, scarGain: 0 };
  const H = { ...T.HARNESS, crisis: C };
  const { r, s } = oneSectorRealm({ scar: 0, pool: 600 });
  T.growRebels(r, 30, H);
  assert.ok(s.rebelStack <= 600 + 1e-9, 'capped at register share');
});
