const test = require('node:test');
const assert = require('node:assert/strict');
const { runBattery } = require('../mockup/decisive-battle/battery.js');

test('battery aggregates branch counts, routs, and terrain flips', () => {
  const scenarios = [
    // 1) terrain saves the front: pass+walls repels; on bare plains it would break (Myeongnyang-class)
    { attacker: { size: 1000, commit: 8 }, front: { garrison: 1000, terrain: 'pass', fortification: 'walls' },
      fieldArmy: { reaches: true, size: 800 }, escape: 'OPEN' },
    // 2) opportunism: shield breaks, field army pinned away → FALL
    { attacker: { size: 6000, commit: 8 }, front: { garrison: 500, terrain: 'plains', fortification: 'none' },
      fieldArmy: { reaches: false, size: 2000 }, escape: 'OPEN' },
    // 3) decisive annihilation: overwhelming attacker, BLOCKED escape
    { attacker: { size: 6000, commit: 8 }, front: { garrison: 500, terrain: 'plains', fortification: 'none' },
      fieldArmy: { reaches: true, size: 1000 }, escape: 'BLOCKED' },
  ];
  const s = runBattery(scenarios);
  assert.equal(s.branchCounts.REPULSED, 1);
  assert.equal(s.branchCounts.FALL, 1);
  assert.equal(s.branchCounts.DECISIVE, 1);
  assert.equal(s.routCount, 1);
  assert.equal(s.annihilationCount, 1);
  assert.equal(s.terrainFlips, 1); // scenario 1 flips
});
