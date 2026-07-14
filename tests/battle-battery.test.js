const test = require('node:test');
const assert = require('node:assert/strict');
const { runBattery } = require('../mockup/decisive-battle/battery.js');

test('battery aggregates branches, per-side routs, attacker wins, and terrain/fort flips', () => {
  const scenarios = [
    // 1) Myeongnyang-class: the pass alone saves an unfortified front (terrain-only flip)
    { attacker: { size: 1000, commit: 8 }, front: { garrison: 1000, terrain: 'pass', fortification: 'none' },
      fieldArmy: { reaches: true, size: 800 }, escape: 'OPEN' },
    // 2) Vauban-class: walls alone save a plains front (fort-only flip)
    { attacker: { size: 1000, commit: 8 }, front: { garrison: 1000, terrain: 'plains', fortification: 'walls' },
      fieldArmy: { reaches: true, size: 800 }, escape: 'OPEN' },
    // 3) opportunism: shield breaks, field army pinned away → FALL
    { attacker: { size: 6000, commit: 8 }, front: { garrison: 500, terrain: 'plains', fortification: 'none' },
      fieldArmy: { reaches: false, size: 2000 }, escape: 'OPEN' },
    // 4) decisive annihilation: overwhelming attacker, BLOCKED escape → field army destroyed
    { attacker: { size: 6000, commit: 8 }, front: { garrison: 500, terrain: 'plains', fortification: 'none' },
      fieldArmy: { reaches: true, size: 1000, fatigue: 0.75 }, escape: 'BLOCKED' },
    // 5) strong field army beats the worn attacker; attacker loss ≈ 0.255 < 0.30 → no rout
    { attacker: { size: 1200, commit: 8 }, front: { garrison: 600, terrain: 'plains', fortification: 'none' },
      fieldArmy: { reaches: true, size: 4000, fatigue: 0.75 }, escape: 'OPEN' },
  ];
  const s = runBattery(scenarios);
  assert.equal(s.branchCounts.REPULSED, 2);
  assert.equal(s.branchCounts.FALL, 1);
  assert.equal(s.branchCounts.DECISIVE, 2);
  assert.equal(s.attackerWins, 1);            // scenario 4 only
  assert.equal(s.fieldArmyRouts, 1);          // scenario 4: defender field army routed
  assert.equal(s.fieldArmyAnnihilations, 1);  // scenario 4: BLOCKED → 섬멸
  assert.equal(s.attackerRouts, 0);           // scenario 5 loses but stays under the cliff
  assert.equal(s.attackerAnnihilations, 0);
  assert.equal(s.terrainFlips, 1);            // scenario 1: breaks with terrain→plains, fort kept
  assert.equal(s.fortFlips, 1);               // scenario 2: breaks with fort→none, terrain kept
});

test('buildMatrix enumerates the full scenario grid and every scenario resolves', () => {
  const { buildMatrix } = require('../mockup/decisive-battle/battery.js');
  const matrix = buildMatrix();
  // 5 attacker sizes × 3 commits × 4 terrains × 4 forts × 3 field-army sizes × 2 reach × 2 escape
  assert.equal(matrix.length, 5 * 3 * 4 * 4 * 3 * 2 * 2);
  const s = runBattery(matrix); // throws on any invalid scenario (unknown-key guard)
  const branchTotal = s.branchCounts.REPULSED + s.branchCounts.FALL + s.branchCounts.DECISIVE;
  assert.equal(branchTotal, matrix.length); // every scenario lands in exactly one branch
});
