'use strict';
// L2 crisis arc (ADR 0035/0036, RULINGS CE-①…⑳). Unit + integration tests.
const { test } = require('node:test');
const assert = require('node:assert');
const T = require('../mockup/combat-calc/tournament.js');

test('crisis dial block exists and is OFF by default', () => {
  assert.strictEqual(T.HARNESS.crisis.enabled, false);
  assert.strictEqual(T.HARNESS.crisis.onset, 25);
  assert.strictEqual(T.HARNESS.crisis.hardEnd, 35);
});

test('crisisRate is a linear staircase from onset', () => {
  const C = T.HARNESS.crisis;
  assert.strictEqual(T.crisisRate(C.onset, C), C.rate0);
  assert.strictEqual(T.crisisRate(C.onset + 1, C), C.rate0 + C.rateStep);
  assert.ok(T.crisisRate(C.hardEnd, C) > T.crisisRate(C.onset, C));
});

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
