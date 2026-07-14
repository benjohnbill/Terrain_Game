// tests/intel-v2.test.js — slice-2 ticket 05 (intel v2).
//
// Enemy fatigue joins substance as a fogged attribute; enemy detachment
// positions become last-seen fixes plus a deterministic reach cone; a free
// border alarm reveals existence + heading only. Bots see exactly what a
// player sees. Authoritative design: slice-2 spec §6; aging per the Aging
// constitution P3 (consume, do not re-legislate).
const test = require('node:test');
const assert = require('node:assert/strict');
const Intel = require('../js/intel.js');
const M = require('../js/movement.js');

const SPEED = 3; // slice-2 spec §3 uniform speed; passed explicitly (movement owns the dial).

/* CRADLE_MAP-shaped mini map (same shape movement.buildGraph consumes; js/
   never imports the mockup). sectorHexes = { sectorId: [[q,r], ...] }. */
function miniGraph(sectorHexes) {
  const sectors = {};
  for (const [sid, hexes] of Object.entries(sectorHexes)) {
    sectors[sid] = { id: sid, regionId: 't', mapUnits: hexes.map(([q, r]) => ({ q, r })) };
  }
  return M.buildGraph({ sectors });
}

/* A straight west→east line of 9 hexes along q (r=0). Each hex touches only
   its q±1 neighbours, so graph distance == |Δq| — clean radius arithmetic. */
function lineGraph(qs) {
  return miniGraph({ line: qs.map((q) => [q, 0]) });
}

// ── Reach cone ────────────────────────────────────────────────────────────

test('reachCone: turnsUnobserved 0 collapses to the last-seen fix only', () => {
  const g = lineGraph([0, 1, 2, 3, 4]);
  assert.deepEqual(Intel.reachCone(g, M.hexKey(2, 0), 0, SPEED), [M.hexKey(2, 0)]);
});

test('reachCone: grows by speed per unobserved turn (radius = turns × speed)', () => {
  const g = lineGraph([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const fix = M.hexKey(0, 0);
  const oneTurn = new Set(Intel.reachCone(g, fix, 1, SPEED)); // radius 3 → q 0..3
  const twoTurn = new Set(Intel.reachCone(g, fix, 2, SPEED)); // radius 6 → q 0..6
  assert.equal(oneTurn.size, 4);
  assert.equal(twoTurn.size, 7);
  // monotonic growth: the older cone contains the younger one
  for (const k of oneTurn) assert.ok(twoTurn.has(k), `${k} should remain reachable as the cone ages`);
  assert.ok(!oneTurn.has(M.hexKey(4, 0)), 'q=4 is out of reach after one turn');
  assert.ok(twoTurn.has(M.hexKey(6, 0)), 'q=6 is reachable after two turns');
});

test('reachCone: is deterministic given the observation history', () => {
  const g = lineGraph([0, 1, 2, 3, 4, 5, 6]);
  const a = Intel.reachCone(g, M.hexKey(1, 0), 2, SPEED);
  const b = Intel.reachCone(g, M.hexKey(1, 0), 2, SPEED);
  assert.deepEqual(a, b);
});

test('reachCone: impassable ground shapes the cone (a gap severs reach)', () => {
  // (4,0) is absent — the line is severed there, so nothing east of it is reachable.
  const g = lineGraph([0, 1, 2, 3, 5, 6, 7, 8]);
  const cone = new Set(Intel.reachCone(g, M.hexKey(0, 0), 3, SPEED)); // radius 6 geometrically
  assert.ok(cone.has(M.hexKey(3, 0)), 'reaches up to the gap');
  assert.ok(!cone.has(M.hexKey(5, 0)), 'cannot cross the gap even within radius');
  assert.ok(!cone.has(M.hexKey(4, 0)), 'the void hex is never in the cone');
});

test('reachCone: a fix outside the graph yields an empty cone', () => {
  const g = lineGraph([0, 1, 2]);
  assert.deepEqual(Intel.reachCone(g, M.hexKey(9, 9), 2, SPEED), []);
});

// ── Detachment record lifecycle + fatigue band ──────────────────────────────

test('observeDetachment: a first sighting fixes position, raises confidence, resets the clock', () => {
  const rec = Intel.observeDetachment(null, M.hexKey(2, 0));
  assert.equal(rec.fixKey, M.hexKey(2, 0));
  assert.equal(rec.turnsUnobserved, 0);
  assert.equal(rec.confidence, 0.7); // applyScout(floor 0.45) = 0.7
});

test('ageDetachment: one unobserved turn widens (decays) confidence and grows the clock; fix unchanged', () => {
  const seen = Intel.observeDetachment(null, M.hexKey(2, 0));
  const aged = Intel.ageDetachment(seen);
  assert.equal(aged.fixKey, seen.fixKey);
  assert.equal(aged.turnsUnobserved, 1);
  assert.ok(aged.confidence < seen.confidence, 'confidence decays per unobserved turn');
});

test('observeDetachment: re-sighting narrows confidence, re-fixes position, resets the clock', () => {
  let rec = Intel.observeDetachment(null, M.hexKey(2, 0));
  rec = Intel.ageDetachment(Intel.ageDetachment(rec)); // drift two turns
  const before = rec.confidence;
  rec = Intel.observeDetachment(rec, M.hexKey(5, 0));
  assert.equal(rec.fixKey, M.hexKey(5, 0));
  assert.equal(rec.turnsUnobserved, 0);
  assert.ok(rec.confidence > before, 'contact narrows the band (raises confidence)');
});

test('detachmentBand: the fatigue band always contains the true value', () => {
  const seed = Intel.hexSeed(7, 2);
  for (const trueFatigue of [0, 1.5, 4, 7, 10]) {
    for (const conf of [0.45, 0.55, 0.7, 0.85, 0.9]) {
      const rec = { fixKey: '0,0', confidence: conf, turnsUnobserved: 0 };
      const band = Intel.detachmentBand(rec, trueFatigue, seed);
      assert.ok(band.low <= trueFatigue && trueFatigue <= band.high,
        `fatigue ${trueFatigue} must be inside [${band.low}, ${band.high}] at c=${conf}`);
    }
  }
});

test('detachmentBand: the fatigue band re-widens as the record ages and narrows on re-observation', () => {
  const seed = Intel.hexSeed(7, 2);
  const trueFatigue = 6;
  let rec = Intel.observeDetachment(null, '0,0');
  const fresh = Intel.detachmentBand(rec, trueFatigue, seed).width;
  rec = Intel.ageDetachment(Intel.ageDetachment(Intel.ageDetachment(rec)));
  const stale = Intel.detachmentBand(rec, trueFatigue, seed).width;
  assert.ok(stale > fresh, `stale band ${stale} must be wider than fresh band ${fresh}`);
  rec = Intel.observeDetachment(rec, '0,0');
  const rescouted = Intel.detachmentBand(rec, trueFatigue, seed).width;
  assert.ok(rescouted < stale, `re-scouted band ${rescouted} must narrow back below ${stale}`);
});

// ── Border alarm ────────────────────────────────────────────────────────────

const inZone = (c) => c.q >= 5; // the defender's border zone is q ≥ 5.

test('borderAlarm: fires on a border-zone entry, revealing existence + heading', () => {
  const alarms = Intel.borderAlarm([{ id: 1, from: { q: 4, r: 0 }, to: { q: 5, r: 0 } }], inZone);
  assert.equal(alarms.length, 1);
  assert.equal(alarms[0].id, 1);
  assert.equal(alarms[0].exists, true);
  assert.deepEqual(alarms[0].heading, { dq: 1, dr: 0 });
});

test('borderAlarm: silent when a force stays outside or moves within the zone (no re-alarm)', () => {
  const movements = [
    { id: 1, from: { q: 2, r: 0 }, to: { q: 3, r: 0 } }, // outside → outside
    { id: 2, from: { q: 5, r: 0 }, to: { q: 6, r: 0 } }, // already inside → inside
  ];
  assert.deepEqual(Intel.borderAlarm(movements, inZone), []);
});

test('borderAlarm: never misses — a force appearing inside the zone still fires (heading unknown)', () => {
  const alarms = Intel.borderAlarm([{ id: 3, from: null, to: { q: 6, r: 0 } }], inZone);
  assert.equal(alarms.length, 1);
  assert.equal(alarms[0].exists, true);
  assert.equal(alarms[0].heading, null);
});

test('borderAlarm: reveals existence + heading ONLY (no scale, no state)', () => {
  const alarms = Intel.borderAlarm([{ id: 1, from: { q: 4, r: 0 }, to: { q: 5, r: 0 } }], inZone);
  assert.deepEqual(Object.keys(alarms[0]).sort(), ['exists', 'heading', 'id']);
});

// ── Symmetry: bots see exactly what a player sees ───────────────────────────

test('symmetry: identical observation inputs yield identical outputs (no viewer branch)', () => {
  const g = lineGraph([0, 1, 2, 3, 4, 5, 6]);
  const rec = Intel.ageDetachment(Intel.observeDetachment(null, M.hexKey(1, 0)));
  const seed = Intel.hexSeed(3, 3);
  const movements = [{ id: 1, from: { q: 4, r: 0 }, to: { q: 5, r: 0 } }];

  // The API takes no faction/viewer argument: the player call and the bot call
  // are the same call. This guards against a future edit smuggling in a
  // player-only path.
  assert.deepEqual(
    Intel.reachCone(g, rec.fixKey, rec.turnsUnobserved, SPEED),
    Intel.reachCone(g, rec.fixKey, rec.turnsUnobserved, SPEED));
  assert.deepEqual(Intel.detachmentBand(rec, 8, seed), Intel.detachmentBand(rec, 8, seed));
  assert.deepEqual(Intel.borderAlarm(movements, inZone), Intel.borderAlarm(movements, inZone));
});
