// tests/window-read.test.js — slice-2 ticket 08 (창 산술, C1).
//
// The opportunism window read: one function, two consumers (peacetime
// declaration threshold + wartime argmax target). window(X) = my deliverable
// effective force at X / what actually defends X now. Pinned (묶임) = no enemy
// cone reaches X. Authoritative design: slice-2 spec §7; the read reuses the
// sealed λ dial (TP②), reach cones + estimate bands (intel v2), fatigue
// effectiveness (ticket 01), and battle sidePower (ticket 03) — no new
// information rule.
const test = require('node:test');
const assert = require('node:assert/strict');
const W = require('../js/window-read.js');
const M = require('../js/movement.js');
const Battle = require('../js/battle.js');

const SPEED = 3; // slice-2 spec §3 uniform speed; passed explicitly (movement owns the dial).

/* CRADLE_MAP-shaped mini map (same shape movement.buildGraph consumes; js/
   never imports the mockup). A straight west→east line of hexes along q (r=0),
   so graph distance == |Δq| — clean radius/ETA arithmetic. */
function lineGraph(qs) {
  const sectors = { line: { id: 'line', regionId: 't', mapUnits: qs.map((q) => ({ q, r: 0 })) } };
  return M.buildGraph({ sectors });
}
const K = (q) => M.hexKey(q, 0);
function band(mid, half) {
  return { low: mid - half, high: mid + half, mid, width: 2 * half };
}

// ── judgeBand: sealed λ dial port fidelity (TP②) ────────────────────────────

test('judgeBand: neutral reads mid, optimist low, pessimist high, clamps, collapsed inert', () => {
  const b = band(20, 6); // low 14 .. high 26
  assert.equal(W.judgeBand(b, 0), 20);
  assert.equal(W.judgeBand(b, 1), 14);   // optimist reads the enemy weak (low)
  assert.equal(W.judgeBand(b, -1), 26);  // pessimist reads the enemy strong (high)
  assert.equal(W.judgeBand(b, 5), 14);   // clamps to +1
  assert.equal(W.judgeBand(b, -5), 26);  // clamps to -1
  assert.equal(W.judgeBand(band(10, 0), -1), 10); // collapsed band → dial inert
});

test('readWear inverts disposition: pessimist reads the enemy fresher (low wear)', () => {
  const wearBand = band(4, 2); // low 2 .. high 6
  assert.equal(W.readWear(wearBand, -1), 2);  // pessimist → enemy strong → low wear
  assert.equal(W.readWear(wearBand, 1), 6);   // optimist → enemy weak → high wear
  assert.equal(W.readWear(wearBand, 0), 4);
});

// ── projectArrival: ETA + arrival effectiveness (own-force, exact) ──────────

test('projectArrival: ETA = ceil(hexes/speed), wear accrues per hex, no mid-march recovery', () => {
  const g = lineGraph([0, 1, 2, 3, 4, 5, 6]);
  const a = W.projectArrival(g, K(0), K(3), 0, SPEED);
  assert.equal(a.reached, true);
  assert.equal(a.hexes, 3);
  assert.equal(a.eta, 1);                 // 3 hexes / speed 3 = 1 turn
  assert.equal(a.arrivalWear, 3);         // marchAccrual(3) at 1.0/hex, no recovery
  const far = W.projectArrival(g, K(0), K(6), 0, SPEED);
  assert.equal(far.eta, 2);               // 6 / 3 = 2 turns
  assert.equal(far.arrivalWear, 6);
});

test('projectArrival: unreachable destination → reached:false', () => {
  const g = lineGraph([0, 1, 2]);
  assert.equal(W.projectArrival(g, K(0), K(9), 0, SPEED).reached, false);
});

test('projectArrival: forced march shortens ETA but raises wear (the R sacrifice)', () => {
  const g = lineGraph([0, 1, 2, 3, 4, 5]);
  const normal = W.projectArrival(g, K(0), K(5), 0, SPEED, { forcedMarch: false });
  const forced = W.projectArrival(g, K(0), K(5), 0, SPEED, { forcedMarch: true });
  assert.equal(normal.eta, 2);            // 5 hexes at speed 3 = 2 turns
  assert.equal(forced.eta, 1);            // speed 3 + cap 2 = 5/turn = 1 turn
  assert.ok(forced.arrivalWear > normal.arrivalWear); // premium on the extra hexes
});

// ── windowRead: the core arithmetic ─────────────────────────────────────────

const ATTACKER = { fromKey: K(0), substance: 100, commit: 8, wear: 0 };

function baseCtx(graph, over = {}) {
  return { graph, speed: SPEED, disposition: 0, attacker: ATTACKER, detachments: [], ...over };
}
const OPEN_FRONT = { hexKey: K(3), terrain: 'plains', fortification: 'walls', garrisonBand: band(20, 0) };

test('windowRead: an undefended front is pinned — denominator is the shield alone', () => {
  const g = lineGraph([0, 1, 2, 3, 4, 5, 6]);
  const r = W.windowRead({ ...baseCtx(g), front: OPEN_FRONT });
  assert.equal(r.reachable, true);
  assert.equal(r.pinned, true);
  assert.equal(r.responderPower, 0);
  // shield = 20 × plains(1.0) × walls(1.8) × posture commitLever(8)=1.5 = 54
  assert.equal(r.shield, 54);
  assert.equal(r.denominator, 54);
  assert.ok(r.ratio > 2.5 && r.ratio < 2.8); // ~2.65
});

test('windowRead: a detachment whose cone reaches X defends it — window narrows, not pinned', () => {
  const g = lineGraph([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const det = { fixKey: K(5), turnsUnobserved: 0, substanceBand: band(30, 0), fatigueBand: band(1, 0) };
  const pinned = W.windowRead({ ...baseCtx(g), front: OPEN_FRONT });
  const answered = W.windowRead({ ...baseCtx(g, { detachments: [det] }), front: OPEN_FRONT });
  assert.equal(answered.pinned, false);
  assert.equal(answered.responders.length, 1);
  assert.ok(answered.responderPower > 0);
  assert.ok(answered.ratio < pinned.ratio);  // an answered front is a worse window
});

test('windowRead: a detachment out of cone range does not defend X (still pinned)', () => {
  const g = lineGraph([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  // fix at q8, fresh (turnsUnobserved 0); my ETA to q3 is 1 → cone radius 3 → q5..8. q3 excluded.
  const det = { fixKey: K(8), turnsUnobserved: 0, substanceBand: band(30, 0), fatigueBand: band(1, 0) };
  const r = W.windowRead({ ...baseCtx(g, { detachments: [det] }), front: OPEN_FRONT });
  assert.equal(r.pinned, true);
  assert.equal(r.responders.length, 0);
});

test('windowRead: a staler fix grows the cone until it reaches — reach is time × speed', () => {
  const g = lineGraph([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const fresh = { fixKey: K(8), turnsUnobserved: 0, substanceBand: band(30, 0), fatigueBand: band(1, 0) };
  const stale = { ...fresh, turnsUnobserved: 2 }; // radius (2+1)×3 = 9 → covers q3
  assert.equal(W.windowRead({ ...baseCtx(g, { detachments: [fresh] }), front: OPEN_FRONT }).pinned, true);
  assert.equal(W.windowRead({ ...baseCtx(g, { detachments: [stale] }), front: OPEN_FRONT }).pinned, false);
});

// ── the in-ticket ruling: worst-case posture pricing ────────────────────────

test('posture pricing is worst-case by default; information (caught-flat) opens the window', () => {
  const g = lineGraph([0, 1, 2, 3, 4]);
  const worstCase = W.windowRead({ ...baseCtx(g), front: OPEN_FRONT }); // postureCommit defaults to worst-case 8
  const caughtFlat = W.windowRead({ ...baseCtx(g), front: { ...OPEN_FRONT, postureCommit: 0 } });
  // worst-case prices the shield higher (×1.5) than caught-flat (×1.0) → a smaller window
  assert.ok(caughtFlat.shield < worstCase.shield);
  assert.ok(caughtFlat.ratio > worstCase.ratio);
  assert.equal(caughtFlat.shield, 36); // 20 × 1.0 × 1.8 × commitLever(0)=1.0
});

// ── own-force exactness (D1): λ moves enemy terms only, never my numerator ───

test('disposition changes the enemy side only — my own numerator is exact', () => {
  const g = lineGraph([0, 1, 2, 3, 4, 5, 6]);
  const det = { fixKey: K(5), turnsUnobserved: 0, substanceBand: band(30, 8), fatigueBand: band(2, 1) };
  const optimist = W.windowRead({ ...baseCtx(g, { disposition: 1, detachments: [det] }), front: { ...OPEN_FRONT, garrisonBand: band(20, 6) } });
  const pessimist = W.windowRead({ ...baseCtx(g, { disposition: -1, detachments: [det] }), front: { ...OPEN_FRONT, garrisonBand: band(20, 6) } });
  assert.equal(optimist.numerator, pessimist.numerator);   // my force is exact
  assert.ok(optimist.denominator < pessimist.denominator); // optimist reads the enemy weaker
  assert.ok(optimist.ratio > pessimist.ratio);
});

// ── scripted board: the read picks the front a designer would ────────────────

test('readFronts + bestTarget pick the open window over a deterred or defended front', () => {
  const g = lineGraph([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const reserve = { fixKey: K(7), turnsUnobserved: 0, substanceBand: band(40, 0), fatigueBand: band(1, 0) };
  const fronts = [
    { id: 'open', hexKey: K(3), terrain: 'plains', fortification: 'none', garrisonBand: band(10, 0) }, // soft + unreachable by the reserve
    { id: 'deterred', hexKey: K(2), terrain: 'mountains', fortification: 'fortress', garrisonBand: band(30, 0) }, // hard shield
    { id: 'defended', hexKey: K(6), terrain: 'plains', fortification: 'none', garrisonBand: band(10, 0) }, // soft but the reserve at q7 reaches it
  ];
  const reads = W.readFronts(fronts, baseCtx(g, { detachments: [reserve] }));
  const pick = W.bestTarget(reads);
  assert.equal(pick.front.id, 'open');
  // sanity: 'defended' is answered (reserve reaches q6), 'open' is not
  assert.equal(reads.find((r) => r.front.id === 'defended').read.pinned, false);
  assert.equal(reads.find((r) => r.front.id === 'open').read.pinned, true);
});

// ── pinning scenario: a feint drains the cone, opening the real target ───────

test('applyFeints: a feint inside a detachment cone occupies it, opening the real target', () => {
  const g = lineGraph([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  // one reserve at q5 whose cone (radius (0+1)×3 = 3 → q2..8) covers BOTH the real
  // target q3 and a feint sector q7. Feinting q7 draws it off; q3 opens.
  const reserve = { fixKey: K(5), turnsUnobserved: 0, substanceBand: band(30, 0), fatigueBand: band(1, 0) };
  const realTarget = { ...OPEN_FRONT, hexKey: K(3) };

  const before = W.windowRead({ ...baseCtx(g, { detachments: [reserve] }), front: realTarget });
  assert.equal(before.pinned, false); // the reserve defends q3

  const afterFeint = W.applyFeints(g, [reserve], [K(7)], 1, SPEED);
  assert.equal(afterFeint[0].engaged, true); // the feint at q7 occupied it
  const after = W.windowRead({ ...baseCtx(g, { detachments: afterFeint }), front: realTarget });
  assert.equal(after.pinned, true);   // q3 is now unanswered
  assert.ok(after.ratio > before.ratio); // the window opened
});

// ── the two consumers share the one function ────────────────────────────────

test('declaration gates the argmax by the appetite threshold; targeting does not', () => {
  const g = lineGraph([0, 1, 2, 3, 4, 5, 6]);
  const fronts = [{ id: 'X', hexKey: K(3), terrain: 'plains', fortification: 'walls', garrisonBand: band(20, 0) }];
  const reads = W.readFronts(fronts, baseCtx(g));
  const best = W.bestTarget(reads);

  // Below-appetite: a threshold above the window suppresses the declaration but
  // the wartime argmax still names the same front.
  assert.equal(W.declaration(reads, best.read.ratio + 1), null);
  assert.equal(W.bestTarget(reads).front.id, 'X');
  // Crossing the threshold IS the declaration signal — same read, same front.
  const declared = W.declaration(reads, best.read.ratio - 0.1);
  assert.equal(declared.front.id, 'X');
  assert.equal(declared.read.ratio, best.read.ratio);
});

test('declaration falls back to the module 가안 threshold when none is passed', () => {
  const g = lineGraph([0, 1, 2, 3, 4, 5, 6]);
  const fronts = [{ id: 'X', hexKey: K(3), terrain: 'plains', fortification: 'walls', garrisonBand: band(20, 0) }];
  const reads = W.readFronts(fronts, baseCtx(g));
  const best = W.bestTarget(reads);
  const declared = W.declaration(reads); // no threshold → APPETITE_THRESHOLD (1.7)
  // this open front reads ~2.65 > 1.7, so it declares
  assert.ok(best.read.ratio >= W.APPETITE_THRESHOLD);
  assert.equal(declared.front.id, 'X');
});

// ── forced-march trade surfaces in readFronts ───────────────────────────────

test('forced march is chosen only when its shorter ETA improves the window', () => {
  const g = lineGraph([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  // A front at q5 (ETA 2 normal, 1 forced). A reserve at q8, fresh: normal ETA 2 →
  // cone radius (0+2)×3 = 6 → reaches q5 (defends). Forced ETA 1 → radius 3 →
  // q5..8, still reaches q5. Here forced only adds wear with no pinning gain, so
  // normal should win for this geometry.
  const reserve = { fixKey: K(8), turnsUnobserved: 0, substanceBand: band(30, 0), fatigueBand: band(1, 0) };
  const front = { id: 'F', hexKey: K(5), terrain: 'plains', fortification: 'none', garrisonBand: band(10, 0) };
  const reads = W.readFronts([front], baseCtx(g, { detachments: [reserve] }));
  assert.equal(reads[0].read.forcedMarch, false);

  // Now a reserve at q9 that reaches q5 only at ETA 2 (radius 6 → q3..9 incl q5),
  // but NOT at ETA 1 (radius 3 → q6..9, q5 excluded). Forced march (ETA 1) pins it.
  const g2 = lineGraph([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const edgeReserve = { fixKey: K(9), turnsUnobserved: 0, substanceBand: band(60, 0), fatigueBand: band(1, 0) };
  const reads2 = W.readFronts([front], baseCtx(g2, { detachments: [edgeReserve] }));
  assert.equal(reads2[0].read.forcedMarch, true);   // forced march bought surprise
  assert.equal(reads2[0].read.pinned, true);        // the reserve could not respond in time
});
