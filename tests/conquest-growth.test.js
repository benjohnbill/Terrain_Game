'use strict';
// §5 conquest growth engine (DT-②): a conquest's military-ceiling gain ripens
// in over turns (ADR 0022 — start 60%, +10pp per stable turn → full in 4).
const test = require('node:test');
const assert = require('node:assert');
const T = require('../mockup/combat-calc/tournament.js');
const { applyCapGain, ripenCap, HARNESS } = T;

// a minimal realm carrying only the fields the helpers touch
function realm(over = {}) {
  return { fieldCap: 6000, capPending: 0, capRipeFlow: 0, ...over };
}

test('applyCapGain: 60% of the gain is immediate, 40% pends, ripe-flow is 10% of gain', () => {
  const r = realm();
  applyCapGain(r, 1000, HARNESS); // startFrac 0.60, ripenPpPerTurn 0.10
  assert.equal(r.fieldCap, 6600);   // 6000 + round(0.60 * 1000)
  assert.equal(r.capPending, 400);  // 1000 - 600
  assert.equal(r.capRipeFlow, 100); // round(0.10 * 1000)
});

test('applyCapGain: gain <= 0 is a no-op (the capPerSector:0 control guard)', () => {
  const r = realm();
  applyCapGain(r, 0, HARNESS);
  assert.deepEqual({ fieldCap: r.fieldCap, capPending: r.capPending, capRipeFlow: r.capRipeFlow },
    { fieldCap: 6000, capPending: 0, capRipeFlow: 0 });
});

test('ripenCap: a fresh gain reaches full ceiling in exactly 4 stable turns', () => {
  const r = realm();
  applyCapGain(r, 1000, HARNESS); // fieldCap 6600, pending 400, flow 100
  ripenCap(r); assert.equal(r.fieldCap, 6700); assert.equal(r.capPending, 300);
  ripenCap(r); assert.equal(r.fieldCap, 6800); assert.equal(r.capPending, 200);
  ripenCap(r); assert.equal(r.fieldCap, 6900); assert.equal(r.capPending, 100);
  ripenCap(r); assert.equal(r.fieldCap, 7000); assert.equal(r.capPending, 0);
  assert.equal(r.capRipeFlow, 0); // reset once fully ripened
});

test('ripenCap: no pending is a no-op', () => {
  const r = realm({ fieldCap: 7000 });
  ripenCap(r);
  assert.equal(r.fieldCap, 7000);
  assert.equal(r.capPending, 0);
});

test('ripenCap: last step never overshoots full (min(pending, flow))', () => {
  const r = realm({ capPending: 50, capRipeFlow: 100, fieldCap: 6950 });
  ripenCap(r); // step = min(50, 100) = 50
  assert.equal(r.fieldCap, 7000);
  assert.equal(r.capPending, 0);
  assert.equal(r.capRipeFlow, 0);
});
