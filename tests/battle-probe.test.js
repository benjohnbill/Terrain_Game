const test = require('node:test');
const assert = require('node:assert/strict');
const B = require('../js/battle.js');
const { resolveWith } = require('../mockup/decisive-battle/probe-defense-layers.js');

test('probe with neutral knobs reproduces resolveEngagement exactly (drift guard)', () => {
  const neutral = { fillFactor: 0, defenderLever: false, marchWorn: 0.75 };
  // The probe's neutral knob models a march-worn field army (0.75). Since ticket
  // 03 retired the flat dial and made fatigue a per-side input, pass the same
  // 0.75 as the field army's fatigue so the calculator and probe compare on
  // equal footing (the drift guard is exact on R2).
  const scenarios = [
    { attacker: { size: 1000, commit: 8 }, front: { garrison: 1000, terrain: 'pass', fortification: 'none' },
      fieldArmy: { reaches: true, size: 800, fatigue: 0.75 }, escape: 'OPEN' },
    { attacker: { size: 6000, commit: 8 }, front: { garrison: 500, terrain: 'plains', fortification: 'none' },
      fieldArmy: { reaches: true, size: 1000, fatigue: 0.75 }, escape: 'BLOCKED' },
    { attacker: { size: 2000, commit: 8 }, front: { garrison: 500, terrain: 'plains', fortification: 'none' },
      fieldArmy: { reaches: true, size: 1600, fatigue: 0.75 }, escape: 'OPEN' },
    { attacker: { size: 1200, commit: 14 }, front: { garrison: 600, terrain: 'mountains', fortification: 'walls' },
      fieldArmy: { reaches: true, size: 4000, fatigue: 0.75 }, escape: 'OPEN' },
  ];
  for (const sc of scenarios) {
    const expected = B.resolveEngagement(sc);
    const probed = resolveWith(sc, neutral);
    assert.equal(probed.branch, expected.branch);
    assert.equal(probed.shieldBreak, expected.shieldBreak);
    if (expected.decisiveBattle) {
      assert.equal(probed.decisiveBattle.attackerWins, expected.decisiveBattle.attackerWins);
      assert.equal(probed.decisiveBattle.routed, expected.decisiveBattle.routed);
      assert.ok(Math.abs(probed.decisiveBattle.R2 - expected.decisiveBattle.R2) < 1e-9);
    }
  }
});

test('probe knobs strengthen the defense monotonically', () => {
  const sc = { attacker: { size: 3000, commit: 8 }, front: { garrison: 1000, terrain: 'plains', fortification: 'none' },
    fieldArmy: { reaches: true, size: 2000 }, escape: 'OPEN' };
  const base = resolveWith(sc, { fillFactor: 0, defenderLever: false, marchWorn: 0.75 });
  const filled = resolveWith(sc, { fillFactor: 1, defenderLever: false, marchWorn: 0.75 });
  const full = resolveWith(sc, { fillFactor: 1, defenderLever: true, marchWorn: 1.0 });
  assert.ok(filled.decisiveBattle.R2 < base.decisiveBattle.R2);  // M9 fill lowers the attacker's R2
  assert.ok(full.decisiveBattle.R2 < filled.decisiveBattle.R2);  // commit + full arrival lower it further
});
