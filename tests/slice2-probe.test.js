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

/* ---- mirror pins: the probe copies three js/battle.js dials that the sealed
   module does not export. A behavioural guard over fixed scenarios would let a
   mirror drift without flipping any of them, so each dial is pinned by SEARCHING
   the calculator for the value it actually uses at its own branch flip. These
   fail loudly if js/battle.js re-cuts a dial and the probe is not updated. ---- */

/* Bisect `predicate` over [lo, hi] to the input where it flips, to 1e-9. */
function flipPoint(lo, hi, predicate) {
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (predicate(mid)) hi = mid; else lo = mid;
  }
  return (lo + hi) / 2;
}

test('mirror pin: SHIELD_BREAK_THRESHOLD equals the calculator shield-break flip', () => {
  // commit 0 / plains / none => R1 collapses to attacker size / garrison.
  const breaksAt = (size) => B.resolveEngagement({
    attacker: { size, commit: 0 }, front: { garrison: 1000, terrain: 'plains', fortification: 'none' },
    fieldArmy: { reaches: false, size: 1000 }, escape: 'OPEN',
  }).shieldBreak;
  const sealed = flipPoint(1000, 2000, breaksAt) / 1000;
  assert.ok(Math.abs(sealed - P.DIALS.SHIELD_BREAK_THRESHOLD) < 1e-6,
    `probe mirrors ${P.DIALS.SHIELD_BREAK_THRESHOLD}, js/battle.js breaks at ${sealed}`);
});

test('mirror pin: ROUT_FRAC equals the calculator rout-cliff flip', () => {
  // Shrink the field army to raise R2 until the won 결전 routs the loser.
  const routsAt = (faSize) => {
    const o = B.resolveEngagement({
      attacker: { size: 3000, commit: 0 }, front: { garrison: 500, terrain: 'plains', fortification: 'none' },
      fieldArmy: { reaches: true, size: faSize, commit: 0 }, escape: 'OPEN',
    });
    return o.decisiveBattle.routed;
  };
  const flipSize = flipPoint(3000, 100, routsAt); // predicate true as size falls
  const o = B.resolveEngagement({
    attacker: { size: 3000, commit: 0 }, front: { garrison: 500, terrain: 'plains', fortification: 'none' },
    fieldArmy: { reaches: true, size: flipSize, commit: 0 }, escape: 'OPEN',
  });
  const sealed = B.casualtyFractions(o.decisiveBattle.R2).defender; // loser loss at the cliff
  assert.ok(Math.abs(sealed - P.DIALS.ROUT_FRAC) < 1e-6,
    `probe mirrors ${P.DIALS.ROUT_FRAC}, js/battle.js routs at ${sealed}`);
});

test('mirror pin: ROUT_OPEN_REMAINDER_LOSS is recoverable from a routed OPEN outcome', () => {
  // The pursuit rate is only recoverable where a remainder actually survives the
  // battle: past the cliff but short of a total wipe (0.30 < battleLoss < 1).
  const o = B.resolveEngagement({
    attacker: { size: 3000, commit: 0 }, front: { garrison: 500, terrain: 'plains', fortification: 'none' },
    fieldArmy: { reaches: true, size: 1200, commit: 0 }, escape: 'OPEN',
  });
  const d = o.decisiveBattle;
  assert.equal(d.routed, true);
  assert.equal(d.annihilated, false);
  const battleLoss = B.casualtyFractions(d.R2).defender;
  assert.ok(battleLoss > 0.3 && battleLoss < 1, `need a surviving remainder, got ${battleLoss}`);
  const sealed = (d.loserTotalLoss - battleLoss) / (1 - battleLoss);
  assert.ok(Math.abs(sealed - P.DIALS.ROUT_OPEN_REMAINDER_LOSS) < 1e-9,
    `probe mirrors ${P.DIALS.ROUT_OPEN_REMAINDER_LOSS}, js/battle.js pursues at ${sealed}`);
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
