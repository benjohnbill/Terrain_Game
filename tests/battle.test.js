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

test('DECISIVE: attacker overwhelms the arriving field army → defender routed, BLOCKED = 섬멸', () => {
  const o = B.resolveEngagement({
    attacker: { size: 6000, commit: 8 },                        // R1 = 9000/500 = 18, shield breaks
    front: { garrison: 500, terrain: 'plains', fortification: 'none' },
    fieldArmy: { reaches: true, size: 1000 }, escape: 'BLOCKED',
  });
  // attackerAfter ≈ 5987; attackPower2 ≈ 8981; defense2 = 1000 × 0.75 = 750; R2 ≈ 11.97 ≥ 1
  assert.equal(o.branch, 'DECISIVE');
  assert.equal(o.decisiveBattle.attackerWins, true);
  assert.equal(o.decisiveBattle.routed, true);        // defender battle-loss ≥ 0.30
  assert.equal(o.decisiveBattle.annihilated, true);   // BLOCKED rout = 섬멸
  assert.equal(o.decisiveBattle.loserTotalLoss, 1);   // annihilation leaves nothing
  assert.equal(o._attackerAfter, undefined);          // carry-field cleaned up
});

test('DECISIVE: a strong field army beats the worn attacker → attacker loses, not routed', () => {
  const o = B.resolveEngagement({
    attacker: { size: 1200, commit: 8 },                        // R1 = 1800/600 = 3, shield breaks
    front: { garrison: 600, terrain: 'plains', fortification: 'none' },
    fieldArmy: { reaches: true, size: 4000 }, escape: 'OPEN',
  });
  // attackerAfter ≈ 1169; attackPower2 ≈ 1753; defense2 = 3000; R2 ≈ 0.584 < 1
  // attacker (loser) battle-loss = 0.12 / 0.584^1.4 ≈ 0.255 < 0.30 → not routed
  assert.equal(o.decisiveBattle.attackerWins, false);
  assert.equal(o.decisiveBattle.routed, false);
  assert.ok(Math.abs(o.decisiveBattle.loserTotalLoss - 0.255) < 0.005); // below the cliff: total = battle loss
});

test('DECISIVE: an OPEN rout converts on the M4 scale — deeper defeat costs more than the cliff edge', () => {
  const o = B.resolveEngagement({
    attacker: { size: 2000, commit: 8 },                        // R1 = 3000/500 = 6, shield breaks
    front: { garrison: 500, terrain: 'plains', fortification: 'none' },
    fieldArmy: { reaches: true, size: 1600 }, escape: 'OPEN',
  });
  // attackerAfter ≈ 1980; attackPower2 ≈ 2971; defense2 = 1200; R2 ≈ 2.48
  // loser battle-loss L ≈ 0.427 ≥ 0.30 → routed; OPEN total = L + 0.5×(1−L) ≈ 0.71 (a flat 0.65 would be wrong here)
  assert.equal(o.decisiveBattle.routed, true);
  assert.equal(o.decisiveBattle.annihilated, false);
  assert.ok(o.decisiveBattle.loserTotalLoss > 0.65 && o.decisiveBattle.loserTotalLoss < 1);
});
