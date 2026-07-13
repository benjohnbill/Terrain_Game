'use strict';
const B = require('../../js/battle.js');

function wouldBreakOnBareGround(sc) {
  const bare = { ...sc, front: { ...sc.front, terrain: 'plains', fortification: 'none' } };
  return B.resolveEngagement(bare).shieldBreak;
}

function runBattery(scenarios) {
  const summary = {
    branchCounts: { REPULSED: 0, FALL: 0, DECISIVE: 0 },
    routCount: 0, annihilationCount: 0, terrainFlips: 0,
  };
  for (const sc of scenarios) {
    const o = B.resolveEngagement(sc);
    summary.branchCounts[o.branch]++;
    if (o.decisiveBattle && o.decisiveBattle.routed) summary.routCount++;
    if (o.decisiveBattle && o.decisiveBattle.annihilated) summary.annihilationCount++;
    if (o.branch === 'REPULSED' && wouldBreakOnBareGround(sc)) summary.terrainFlips++;
  }
  return summary;
}

if (require.main === module) {
  // Placeholder scenario matrix run — expanded during the measurement pass.
  console.log(JSON.stringify(runBattery([]), null, 2));
}

module.exports = { runBattery };
