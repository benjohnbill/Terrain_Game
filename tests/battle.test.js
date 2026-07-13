// tests/battle.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const B = require('../js/battle.js');

test('terrain/fort multipliers match the M5 ladder', () => {
  assert.equal(B.terrainMultiplier('plains'), 1.0);
  assert.equal(B.terrainMultiplier('pass'), 2.0);
  assert.equal(B.fortMultiplier('none'), 1.0);
  assert.equal(B.fortMultiplier('fortress'), 2.4);
});

test('commit lever interpolates linearly between M2 anchors', () => {
  assert.equal(B.commitLever(0), 1.0);
  assert.equal(B.commitLever(8), 1.5);
  assert.equal(B.commitLever(20), 2.0);
  assert.ok(Math.abs(B.commitLever(6) - 1.375) < 1e-9); // between 4→1.25 and 8→1.5
  assert.equal(B.commitLever(25), 2.0);                 // clamps at ceiling
});
