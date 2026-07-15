// tests/bot-exit.test.js — slice-2 ticket 09 (봇 종전, C2).
//
// Read-driven settlement: a bot court stops fighting because it READS that it
// has lost (no window of its own / windows open against it / a degrading
// trajectory), not because a stall counter ran out. It then takes the B3 rung
// its position earns — the will path of the war-ending composite (ADR 0038).
// Authoritative design: slice-2 spec §9; the settlement arithmetic is a port of
// the sealed 수락 산술 (birthplace = match-arc 정산 / RULINGS ⑧⑬⑲, mechanized
// in mockup/combat-calc/match.js) — reuse, not redesign.
const test = require('node:test');
const assert = require('node:assert/strict');
const B = require('../js/bot-exit.js');
const W = require('../js/window-read.js');
const M = require('../js/movement.js');
const MATCH = require('../mockup/combat-calc/match.js');

const SPEED = 3;

function lineGraph(qs) {
  const sectors = { line: { id: 'line', regionId: 't', mapUnits: qs.map((q) => ({ q, r: 0 })) } };
  return M.buildGraph({ sectors });
}
const K = (q) => M.hexKey(q, 0);
const band = (mid, half) => ({ low: mid - half, high: mid + half, mid, width: 2 * half });

/* A war state the sealed arithmetic consumes: what the enemy's sword has
   actually reached. margin ∈ decisive | grinding | marginal. */
const LOSING_STATE = { occValue: 100, raidLoot: 40, capitalInReach: false, margin: 'decisive' };

// ── Port fidelity: the ported arithmetic must equal its birthplace ──────────

test('port fidelity: presetBundle matches the sealed match.js arithmetic on every rung', () => {
  const reach = { occValue: 120, raidLoot: 55, capitalInReach: true, margin: 'grinding' };
  for (const rung of B.LADDER) {
    const ported = B.presetBundle(rung, reach);
    const sealed = MATCH.presetBundle(rung, reach);
    assert.equal(ported.value, sealed.value, `${rung} value`);
    assert.equal(ported.cession, sealed.cession, `${rung} cession`);
    assert.equal(ported.indemnity, sealed.indemnity, `${rung} indemnity`);
    assert.equal(ported.claimRate, sealed.claimRate, `${rung} claimRate`);
  }
});

test('port fidelity: expectedContinuedLoss + accepts match the sealed match.js arithmetic', () => {
  for (const margin of ['decisive', 'grinding', 'marginal']) {
    for (const capitalInReach of [false, true]) {
      const st = { occValue: 90, raidLoot: 30, capitalInReach, margin };
      assert.equal(B.expectedContinuedLoss(st).total, MATCH.expectedContinuedLoss(st).total);
    }
  }
  assert.equal(B.accepts(50, 100, 1.0), MATCH.accepts(50, 100, 1.0));
  assert.equal(B.accepts(150, 100, 1.0), MATCH.accepts(150, 100, 1.0));
});

test('port fidelity: the ladder and its dials are the sealed ones (백지 0 / 관대 50 / 표준 75 / 최대 100)', () => {
  assert.deepEqual(B.LADDER, ['백지', '관대', '표준', '최대']);
  assert.equal(B.PRESETS.백지.claimRate, 0.00); // CE-⑲ white peace = the 0% rung
  assert.equal(B.PRESETS.관대.claimRate, 0.50);
  assert.equal(B.PRESETS.표준.claimRate, 0.75);
  assert.equal(B.PRESETS.최대.claimRate, 1.00);
  assert.deepEqual(B.TEMPERAMENT, MATCH.MATCH_DIALS.temperament);
  assert.equal(B.LOSS_MODEL.resistanceDiscount, MATCH.MATCH_DIALS.lossModel.resistanceDiscount);
});

// ── Trajectory (spec §9 axis iii) ───────────────────────────────────────────

test('trajectory: rising fatigue, falling land, or a shrinking army each read as degrading', () => {
  const before = { fatigue: 2, land: 10, army: 100 };
  assert.equal(B.trajectory(before, { fatigue: 6, land: 10, army: 100 }).degrading, true);
  assert.equal(B.trajectory(before, { fatigue: 2, land: 7, army: 100 }).degrading, true);
  assert.equal(B.trajectory(before, { fatigue: 2, land: 10, army: 60 }).degrading, true);
  assert.deepEqual(B.trajectory(before, { fatigue: 6, land: 7, army: 60 }).axes, ['fatigue', 'land', 'army']);
});

test('trajectory: a steady or improving position is not degrading; no history reads steady', () => {
  const before = { fatigue: 2, land: 10, army: 100 };
  assert.equal(B.trajectory(before, { fatigue: 2, land: 10, army: 100 }).degrading, false);
  assert.equal(B.trajectory(before, { fatigue: 1, land: 12, army: 120 }).degrading, false); // improving
  assert.equal(B.trajectory(null, { fatigue: 9, land: 1, army: 1 }).degrading, false);      // war too young
  assert.equal(B.trajectory(null, { fatigue: 9, land: 1, army: 1 }).reason, 'no-history');
});

// ── The read consumes ticket 08's window output ─────────────────────────────

/* Two boards, built from the real ticket-08 read (not hand-faked ratios):
   - a hopeless attack: a small force against a fortress backed by a big reserve
   - an open window: a strong force against a soft, unanswered front */
function hopelessRead(graph) {
  return W.readFronts(
    [{ id: 'wall', hexKey: K(3), terrain: 'mountains', fortification: 'fortress', garrisonBand: band(60, 0) }],
    { graph, speed: SPEED, disposition: 0,
      attacker: { fromKey: K(0), substance: 20, commit: 4, wear: 6 },
      detachments: [{ fixKey: K(4), turnsUnobserved: 0, substanceBand: band(80, 0), fatigueBand: band(0, 0) }] });
}
function openRead(graph) {
  return W.readFronts(
    [{ id: 'soft', hexKey: K(3), terrain: 'plains', fortification: 'none', garrisonBand: band(8, 0) }],
    { graph, speed: SPEED, disposition: 0,
      attacker: { fromKey: K(0), substance: 120, commit: 12, wear: 0 }, detachments: [] });
}

test('position: no window of my own + windows against + degrading = losing', () => {
  const g = lineGraph([0, 1, 2, 3, 4, 5]);
  const pos = B.position({
    myReads: hopelessRead(g),
    readsAgainstMe: openRead(g),
    before: { fatigue: 1, land: 10, army: 100 },
    now: { fatigue: 7, land: 6, army: 55 },
  });
  assert.equal(pos.hasOwnWindow, false);
  assert.equal(pos.windowsAgainst, true);
  assert.equal(pos.trajectory.degrading, true);
  assert.equal(pos.losing, true);
});

test('position: a live counter-punch of my own means I am not losing, however bad the rest', () => {
  const g = lineGraph([0, 1, 2, 3, 4, 5]);
  const pos = B.position({
    myReads: openRead(g),            // I still have a window
    readsAgainstMe: openRead(g),     // so do they
    before: { fatigue: 1, land: 10, army: 100 },
    now: { fatigue: 7, land: 6, army: 55 }, // and I am degrading
  });
  assert.equal(pos.hasOwnWindow, true);
  assert.equal(pos.losing, false);   // all three conditions are required
});

// ── The decision (spec §9) ──────────────────────────────────────────────────

function losingCfg(graph, over = {}) {
  return {
    court: { isHuman: false, temperament: '실리' },
    state: LOSING_STATE,
    myReads: hopelessRead(graph),
    readsAgainstMe: openRead(graph),
    before: { fatigue: 1, land: 10, army: 100 },
    now: { fatigue: 7, land: 6, army: 55 },
    ...over,
  };
}

test('a bot in a losing position accepts a rung matched to its position', () => {
  const g = lineGraph([0, 1, 2, 3, 4, 5]);
  const d = decideOn(g);
  assert.equal(d.settle, true);
  assert.equal(d.reason, 'read-driven-settlement');
  assert.ok(B.LADDER.includes(d.rung));
  assert.equal(d.bundle.preset, d.rung);
  function decideOn(graph) { return B.decideExit(losingCfg(graph)); }
});

test('the rung tracks the position — it is NOT always white peace', () => {
  const g = lineGraph([0, 1, 2, 3, 4, 5]);
  // A mild loss: the enemy sword has reached little, so resistance stays cheap
  // and only the cheapest rungs are signable.
  const mild = B.decideExit(losingCfg(g, {
    state: { occValue: 10, raidLoot: 2, capitalInReach: false, margin: 'marginal' },
  }));
  // A desperate loss: the capital is under the sword and the margin is decisive,
  // so continuing costs far more than conceding — the court signs the top rung.
  const desperate = B.decideExit(losingCfg(g, {
    state: { occValue: 100, raidLoot: 40, capitalInReach: true, margin: 'decisive' },
  }));
  assert.equal(desperate.settle, true);
  assert.equal(desperate.rung, '최대');                       // not white peace
  assert.notEqual(desperate.rung, mild.rung);                 // position moves the rung
  assert.ok(B.LADDER.indexOf(desperate.rung) > B.LADDER.indexOf(mild.rung));
});

test('temperament shifts what a court will sign — 유화 concedes past 완고', () => {
  const g = lineGraph([0, 1, 2, 3, 4, 5]);
  const st = { occValue: 60, raidLoot: 20, capitalInReach: false, margin: 'grinding' };
  const stubborn = B.acceptableRungs(st, '완고');
  const yielding = B.acceptableRungs(st, '유화');
  assert.ok(yielding.length >= stubborn.length); // a conciliatory court signs at least as much
  assert.equal(B.acceptableRungs(st, '완고')[0], '백지'); // the 0% rung is always the cheapest
});

test('a bot in a contested or winning position fights on', () => {
  const g = lineGraph([0, 1, 2, 3, 4, 5]);
  const winning = B.decideExit(losingCfg(g, { myReads: openRead(g) })); // I have a window
  assert.equal(winning.settle, false);
  assert.equal(winning.reason, 'fight-on');

  const stable = B.decideExit(losingCfg(g, { now: { fatigue: 1, land: 10, army: 100 } })); // no decay
  assert.equal(stable.settle, false);
  assert.equal(stable.reason, 'fight-on');
});

test('white peace is always signable — 백지 costs 0, so a beaten bot always has an exit', () => {
  // A property of the SEALED arithmetic, not of the port: accepts(0, L, coeff)
  // is 0 <= L × coeff, true for every non-negative expected loss. This is why
  // the sealed winner-side walk is ['최대','표준','관대'] with 백지 absent — a
  // winner never proposes claiming nothing — and why bot drag is not an
  // acceptance-arithmetic outcome. acceptableRungs is therefore never empty.
  for (const temperament of Object.keys(B.TEMPERAMENT)) {
    for (const margin of ['decisive', 'grinding', 'marginal']) {
      for (const st of [
        { occValue: 0, raidLoot: 0, capitalInReach: false, margin },
        { occValue: 0.001, raidLoot: 0, capitalInReach: false, margin },
        { occValue: 500, raidLoot: 200, capitalInReach: true, margin },
      ]) {
        const rungs = B.acceptableRungs(st, temperament);
        assert.ok(rungs.length > 0, `${temperament}/${margin} must have an exit`);
        assert.equal(rungs[0], '백지'); // the free rung is always the first signable
      }
    }
  }
});

test('a court beaten before the enemy sword reached anything signs the 0% rung', () => {
  const g = lineGraph([0, 1, 2, 3, 4, 5]);
  // Pre-emptive white peace: individually rational (quit before losing land),
  // and flagged in the module header as a ticket-10 metric-5 watch item — the
  // lever there is the OWN_WINDOW_APPETITE / trajectory 가안, never the sealed
  // acceptance arithmetic.
  const d = B.decideExit(losingCfg(g, {
    state: { occValue: 0, raidLoot: 0, capitalInReach: false, margin: 'marginal' },
  }));
  assert.equal(d.settle, true);
  assert.equal(d.rung, '백지');
  assert.equal(d.bundle.value, 0); // claim nothing — the ladder's floor
});

test('rung naming stays honest: an empty transfer is named 백지, never 최대', () => {
  // With composite 0 every rung is the same empty bundle, so all four are
  // signable. Naming the top one would report a claim of nothing as a maximal
  // claim and poison metric 5's rung distribution (ticket 10 reads it).
  const empty = { occValue: 0, raidLoot: 0, capitalInReach: false, margin: 'decisive' };
  assert.deepEqual(B.acceptableRungs(empty, '실리'), B.LADDER); // every rung signable
  const g = lineGraph([0, 1, 2, 3, 4, 5]);
  assert.equal(B.decideExit(losingCfg(g, { state: empty })).rung, '백지');

  // With a real composite, values rise strictly with the rung, so the tie-break
  // never fires and the top signable rung is named as-is.
  const real = { occValue: 100, raidLoot: 40, capitalInReach: true, margin: 'decisive' };
  const values = B.LADDER.map((r) => B.presetBundle(r, real).value);
  for (let i = 1; i < values.length; i++) assert.ok(values[i] > values[i - 1]);
  assert.equal(B.decideExit(losingCfg(g, { state: real })).rung, '최대');
});

// ── CE-⑲: never force-close a war over a human ─────────────────────────────

test('CE-⑲: a human court is never force-closed, however hopeless the read', () => {
  const g = lineGraph([0, 1, 2, 3, 4, 5]);
  const d = B.decideExit(losingCfg(g, {
    court: { isHuman: true, temperament: '유화' },  // the most conciliatory temperament
    state: { occValue: 100, raidLoot: 40, capitalInReach: true, margin: 'decisive' }, // the worst position
  }));
  assert.equal(d.settle, false);
  assert.equal(d.rung, null);
  assert.equal(d.reason, 'human-court');
  assert.equal(d.position, null); // the gate runs before any read — bot policy only
});

// ── The stall timer is gone by construction ────────────────────────────────

test('no stall/patience/timer concept exists in the module surface', () => {
  const surface = Object.keys(B).join(' ').toLowerCase();
  for (const banned of ['stall', 'patience', 'timer', 'nearmiss', 'counter']) {
    assert.ok(!surface.includes(banned), `bot-exit must not expose a ${banned} concept`);
  }
  // The exit is driven by the read alone: identical states decide identically,
  // no matter how many turns the war has run (no counter can tip it).
  const g = lineGraph([0, 1, 2, 3, 4, 5]);
  const a = B.decideExit(losingCfg(g));
  const b = B.decideExit(losingCfg(g));
  assert.deepEqual(a, b);
});
