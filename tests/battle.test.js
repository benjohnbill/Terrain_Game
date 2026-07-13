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

test('shield power = garrison × terrain × fort (M5, defense commit baseline 1.0)', () => {
  const s = B.shieldPower({ garrison: 1000, terrain: 'pass', fortification: 'walls' });
  assert.ok(Math.abs(s - 3600) < 1e-9); // 1000 × 2.0 × 1.8
});

test('casualty fractions are symmetric on the M4 curve; rout onset ≈ 30% at R 1.92', () => {
  const at1 = B.casualtyFractions(1.0);
  assert.ok(Math.abs(at1.attacker - 0.12) < 1e-9);
  assert.ok(Math.abs(at1.defender - 0.12) < 1e-9);
  const r = B.casualtyFractions(1.92);
  assert.ok(Math.abs(r.defender - 0.30) < 0.005); // 0.12 × 1.92^1.4 ≈ 0.299
  assert.ok(r.attacker < r.defender);             // winner bleeds less
  assert.equal(B.casualtyFractions(20).defender, 1); // clamped — blood never exceeds the body
});

test('branch REPULSED when first-blow R is below the shield-break threshold', () => {
  const o = B.resolveEngagement({
    attacker: { size: 1000, commit: 8 },                        // attack 1000 × 1.5 = 1500
    front: { garrison: 1000, terrain: 'pass', fortification: 'walls' }, // shield 3600
    fieldArmy: { reaches: true, size: 800 }, escape: 'OPEN',
  });
  assert.equal(o.branch, 'REPULSED');          // R1 = 1500/3600 = 0.417 < 1.5
  assert.equal(o.shieldBreak, false);
});

test('branch FALL when the shield breaks but the field army cannot reach', () => {
  const o = B.resolveEngagement({
    attacker: { size: 6000, commit: 8 },                        // attack 9000
    front: { garrison: 500, terrain: 'plains', fortification: 'none' }, // shield 500
    fieldArmy: { reaches: false, size: 2000 }, escape: 'OPEN',
  });
  assert.equal(o.branch, 'FALL');              // R1 = 9000/500 = 18 ≥ 1.5, no reach
  assert.equal(o.shieldBreak, true);
});
