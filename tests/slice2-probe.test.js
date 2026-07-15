const test = require('node:test');
const assert = require('node:assert/strict');
const B = require('../js/battle.js');
const F = require('../js/fatigue.js');
const P = require('../mockup/operational-layer/probe.js');

/* STRONGHOLD scenarios spanning both 결전 outcomes and the shield repulse. */
const SCENARIOS = [
  { attacker: { size: 3000, commit: 8 }, front: { garrison: 500, terrain: 'plains', fortification: 'none' },
    fieldArmy: { reaches: true, size: 3000, commit: 8 }, escape: 'OPEN' },
  { attacker: { size: 6000, commit: 14 }, front: { garrison: 500, terrain: 'plains', fortification: 'none' },
    fieldArmy: { reaches: true, size: 1000, commit: 4 }, escape: 'BLOCKED' },
  { attacker: { size: 1000, commit: 4 }, front: { garrison: 1000, terrain: 'mountains', fortification: 'walls' },
    fieldArmy: { reaches: true, size: 2000, commit: 8 }, escape: 'OPEN' },
  { attacker: { size: 4000, commit: 8, fatigue: 0.6 }, front: { garrison: 500, terrain: 'hills', fortification: 'none' },
    fieldArmy: { reaches: false, size: 2000 }, escape: 'OPEN' },
  { attacker: { size: 3000, commit: 8, quality: 1.25 }, front: { garrison: 500, terrain: 'plains', fortification: 'none' },
    fieldArmy: { reaches: true, size: 3000, commit: 8, fatigue: 0.75 }, escape: 'OPEN' },
];

test('neutral knobs reproduce resolveEngagement exactly (drift guard)', () => {
  for (const sc of SCENARIOS) {
    const expected = B.resolveEngagement(sc);
    const probed = P.resolveWith(sc, P.NEUTRAL_KNOBS);
    assert.equal(probed.branch, expected.branch);
    assert.equal(probed.shieldBreak, expected.shieldBreak);
    assert.ok(Math.abs(probed.firstBlowR - expected.firstBlowR) < 1e-12);
    if (expected.decisiveBattle) {
      assert.equal(probed.decisiveBattle.attackerWins, expected.decisiveBattle.attackerWins);
      assert.equal(probed.decisiveBattle.routed, expected.decisiveBattle.routed);
      assert.equal(probed.decisiveBattle.annihilated, expected.decisiveBattle.annihilated);
      assert.ok(Math.abs(probed.decisiveBattle.R2 - expected.decisiveBattle.R2) < 1e-12);
      assert.ok(Math.abs(probed.decisiveBattle.loserTotalLoss - expected.decisiveBattle.loserTotalLoss) < 1e-12);
    }
  }
});

test('defaulting the knobs argument is the neutral (landed-rules) reading', () => {
  const sc = SCENARIOS[0];
  assert.deepEqual(P.resolveWith(sc), P.resolveWith(sc, P.NEUTRAL_KNOBS));
});

test('non-STRONGHOLD plans have no stubbed layer here and delegate unchanged', () => {
  const sc = { defensePlan: 'DELAYING', attacker: { size: 3000, commit: 8 },
    front: { garrison: 1000, terrain: 'hills', fortification: 'fieldworks' },
    fieldArmy: { reaches: true, size: 2000, commit: 8 }, escape: 'OPEN' };
  assert.deepEqual(P.resolveWith(sc, { fillFactor: 1, shieldCommit: 20 }), B.resolveEngagement(sc));
});

test('fillFactor restores the M9 tactical fill — strictly lowers the attacker R2', () => {
  const sc = SCENARIOS[0];
  const base = P.resolveWith(sc, { fillFactor: 0 });
  const filled = P.resolveWith(sc, { fillFactor: 1 });
  const filled2 = P.resolveWith(sc, { fillFactor: 2 });
  assert.ok(filled.decisiveBattle.R2 < base.decisiveBattle.R2);
  assert.ok(filled2.decisiveBattle.R2 < filled.decisiveBattle.R2);
});

test('the M9 fill joins the 결전 at x0.5 carrying the shield-layer commit, no march fatigue', () => {
  const sc = { attacker: { size: 3000, commit: 8 }, front: { garrison: 800, terrain: 'plains', fortification: 'none' },
    fieldArmy: { reaches: true, size: 3000, commit: 8, fatigue: 0.6 }, escape: 'OPEN' };
  // shieldCommit defaults to null -> the fill's defense commit is baseline x1.0.
  const o = P.resolveWith(sc, { fillFactor: 1 });
  const fillPower = 800 * 0.5 * 1.0; // substance x0.5, lever 1.0 (baseline), fresh, quality 1.0
  const expectedDefense = B.sidePower({ substance: 3000, commit: 8, fatigue: 0.6 }) + fillPower;
  const attackerAfter = 3000 * (1 - B.casualtyFractions(o.firstBlowR).attacker);
  const expectedR2 = B.sidePower({ substance: attackerAfter, commit: 8 }) / expectedDefense;
  assert.ok(Math.abs(o.decisiveBattle.R2 - expectedR2) < 1e-12);
});

test('the M9 fill scales its lever with shieldCommit when the shield layer is armed', () => {
  const sc = { attacker: { size: 3000, commit: 8 }, front: { garrison: 800, terrain: 'plains', fortification: 'none' },
    fieldArmy: { reaches: true, size: 3000, commit: 8 }, escape: 'OPEN' };
  const armed = P.resolveWith(sc, { fillFactor: 1, shieldCommit: 8 });
  const fillPower = 800 * 0.5 * B.commitLever(8);
  const expectedDefense = B.sidePower({ substance: 3000, commit: 8 }) + fillPower;
  const attackerAfter = 3000 * (1 - B.casualtyFractions(armed.firstBlowR).attacker);
  const expectedR2 = B.sidePower({ substance: attackerAfter, commit: 8 }) / expectedDefense;
  assert.ok(Math.abs(armed.decisiveBattle.R2 - expectedR2) < 1e-12);
});

test('shieldCommit restores the shield-layer defense commitment — strictly lowers the first-blow R', () => {
  const sc = SCENARIOS[0];
  const base = P.resolveWith(sc, { shieldCommit: null });
  const armed = P.resolveWith(sc, { shieldCommit: 8 });
  const armedHard = P.resolveWith(sc, { shieldCommit: 20 });
  assert.ok(armed.firstBlowR < base.firstBlowR);
  assert.ok(armedHard.firstBlowR < armed.firstBlowR);
  assert.ok(Math.abs(armed.firstBlowR - base.firstBlowR / B.commitLever(8)) < 1e-12);
});

test('shieldCommit can flip a shield break into a repulse (layer is load-bearing)', () => {
  const sc = { attacker: { size: 1600, commit: 8 }, front: { garrison: 1000, terrain: 'plains', fortification: 'none' },
    fieldArmy: { reaches: true, size: 2000 }, escape: 'OPEN' };
  assert.equal(P.resolveWith(sc, { shieldCommit: null }).shieldBreak, true);
  assert.equal(P.resolveWith(sc, { shieldCommit: 20 }).shieldBreak, false);
});

/* ---- march arrival model (the operational cost of distance) ---- */

test('a zero-distance strike arrives fresh', () => {
  const a = P.marchArrival({ hexes: 0 });
  assert.equal(a.turns, 0);
  assert.equal(a.wear, 0);
  assert.equal(a.effectiveness, 1);
});

test('arrival wear rises with distance and effectiveness falls', () => {
  const near = P.marchArrival({ hexes: 3 });
  const far = P.marchArrival({ hexes: 12 });
  assert.ok(far.wear > near.wear);
  assert.ok(far.effectiveness < near.effectiveness);
  assert.ok(far.effectiveness >= 0.5); // the sealed floor is the curve terminal
});

test('a one-turn march accrues exactly the sealed per-hex accrual', () => {
  const a = P.marchArrival({ hexes: 3 });
  assert.equal(a.turns, 1);
  assert.ok(Math.abs(a.wear - F.marchAccrual(3)) < 1e-12);
});

test('forced march buys turns and pays the premium in wear', () => {
  const normal = P.marchArrival({ hexes: 5, forcedMarch: false });
  const forced = P.marchArrival({ hexes: 5, forcedMarch: true });
  assert.ok(forced.turns < normal.turns);
  assert.ok(forced.wear > normal.wear);
});

test('recoveryWhileMarching (dial 9, HELD) changes arrival wear on multi-turn marches', () => {
  const withRec = P.marchArrival({ hexes: 12, recoveryWhileMarching: true });
  const without = P.marchArrival({ hexes: 12, recoveryWhileMarching: false });
  assert.ok(without.wear > withRec.wear);
  assert.ok(without.effectiveness < withRec.effectiveness);
  // single-turn marches have no between-turn upkeep, so the knob is inert there
  assert.deepEqual(P.marchArrival({ hexes: 3, recoveryWhileMarching: true }),
                   P.marchArrival({ hexes: 3, recoveryWhileMarching: false }));
});

test('marchArrival is deterministic', () => {
  const opts = { hexes: 9, forcedMarch: true, recoveryWhileMarching: false };
  assert.deepEqual(P.marchArrival(opts), P.marchArrival(opts));
});
