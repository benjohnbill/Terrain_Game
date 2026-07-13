'use strict';
const B = require('../../js/battle.js');

function wouldBreakWith(sc, frontOverrides) {
  const probe = { ...sc, front: { ...sc.front, ...frontOverrides } };
  return B.resolveEngagement(probe).shieldBreak;
}

function runBattery(scenarios) {
  const summary = {
    branchCounts: { REPULSED: 0, FALL: 0, DECISIVE: 0 },
    attackerWins: 0,
    fieldArmyRouts: 0, fieldArmyAnnihilations: 0,
    attackerRouts: 0, attackerAnnihilations: 0,
    terrainFlips: 0, fortFlips: 0,
  };
  for (const sc of scenarios) {
    const o = B.resolveEngagement(sc);
    summary.branchCounts[o.branch]++;
    const d = o.decisiveBattle;
    if (d) {
      if (d.attackerWins) summary.attackerWins++;
      // The loser is the side the rout struck: defender field army if the attacker won, else the attacker.
      if (d.routed) summary[d.attackerWins ? 'fieldArmyRouts' : 'attackerRouts']++;
      if (d.annihilated) summary[d.attackerWins ? 'fieldArmyAnnihilations' : 'attackerAnnihilations']++;
    }
    if (o.branch === 'REPULSED') {
      if (wouldBreakWith(sc, { terrain: 'plains' })) summary.terrainFlips++;      // §7.3 Myeongnyang-class: terrain alone
      if (wouldBreakWith(sc, { fortification: 'none' })) summary.fortFlips++;      // fortification alone
    }
  }
  return summary;
}

/* Measurement-pass scenario grid (spec §7): force ratios × commit × terrain ×
   fort × field-army mass × reach × escape. Garrison fixed at 1000 so the
   attacker axis IS the raw force ratio. */
const GRID = {
  attackerSizes: [750, 1500, 3000, 4500, 6000],
  commits: [4, 8, 14],
  terrains: ['plains', 'hills', 'mountains', 'pass'],
  forts: ['none', 'fieldworks', 'walls', 'fortress'],
  fieldArmySizes: [1000, 2000, 4000],
  reaches: [true, false],
  escapes: ['OPEN', 'BLOCKED'],
};

function buildMatrix() {
  const matrix = [];
  for (const size of GRID.attackerSizes)
    for (const commit of GRID.commits)
      for (const terrain of GRID.terrains)
        for (const fortification of GRID.forts)
          for (const faSize of GRID.fieldArmySizes)
            for (const reaches of GRID.reaches)
              for (const escape of GRID.escapes)
                matrix.push({
                  attacker: { size, commit },
                  front: { garrison: 1000, terrain, fortification },
                  fieldArmy: { reaches, size: faSize },
                  escape,
                });
  return matrix;
}

if (require.main === module) {
  const matrix = buildMatrix();
  const report = (label, scenarios) => {
    const s = runBattery(scenarios);
    console.log(`\n== ${label} (n=${scenarios.length}) ==`);
    console.log(JSON.stringify(s));
  };
  report('OVERALL', matrix);
  report('reach=true (decisive battles possible)', matrix.filter(sc => sc.fieldArmy.reaches));
  report('reach=false (pinned field army)', matrix.filter(sc => !sc.fieldArmy.reaches));
  for (const size of GRID.attackerSizes)
    report(`attacker=${size} (ratio ${size / 1000})`, matrix.filter(sc => sc.attacker.size === size));
  for (const faSize of GRID.fieldArmySizes)
    report(`fieldArmy=${faSize}, reach=true`, matrix.filter(sc => sc.fieldArmy.reaches && sc.fieldArmy.size === faSize));
}

module.exports = { runBattery, buildMatrix };
