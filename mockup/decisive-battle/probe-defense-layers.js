'use strict';
/* Defense-layer restoration probe (measurement pass, 2026-07-13).
 *
 * The landed calculator models the 결전 as field-army-only (M9 fill and the
 * defender commit lever are deliberate slice-1 stubs — spec §2/§9, FG-⑧).
 * This probe re-composes the engagement chain from js/battle.js primitives
 * with three knobs so the missing sealed layers can be restored one at a
 * time and compared:
 *
 *   fillFactor    — M9 tactical fill mass as a multiple of the front's
 *                   garrison, joining the 결전 at the sealed ×0.5 (FG-⑩).
 *   defenderLever — when true, the defender pays the same commit as the
 *                   attacker (ADR 0021 fourth layer un-stubbed), applied per
 *                   FORMULA D6 to ALL defense substance (shield gate and 결전).
 *   marchWorn     — field-army arrival effectiveness (0.75 landed; 1.0 =
 *                   FG-⑩ rider ii revert).
 *
 * With neutral knobs {fillFactor:0, defenderLever:false, marchWorn:0.75} the
 * probe reproduces resolveEngagement exactly (tests/battle-probe.test.js —
 * the drift guard). This is a Working-layer instrument: findings feed
 * co-analysis; the calculator itself is not touched.
 */
const B = require('../../js/battle.js');

const SHIELD_BREAK_THRESHOLD = 1.5; // mirror of the battle.js dial (M7 Swift Seizure)
const ROUT_FRAC = 0.30;             // mirror of the battle.js dial (M4)

function resolveWith(input, knobs) {
  const { attacker, front, fieldArmy } = input;
  const leverA = B.commitLever(attacker.commit);
  const leverD = knobs.defenderLever ? leverA : 1.0;

  // FIRST BLOW — attack vs the standing shield (× defender commit when restored)
  const shield = B.shieldPower(front) * leverD;
  const attack = attacker.size * leverA;
  const R1 = attack / shield;
  if (R1 < SHIELD_BREAK_THRESHOLD) return { branch: 'REPULSED', shieldBreak: false };
  if (!fieldArmy.reaches) return { branch: 'FALL', shieldBreak: true };

  // 결전 — worn attacker vs (field army × marchWorn + M9 fill × 0.5) × defender commit
  const attackerAfter = attacker.size * (1 - B.casualtyFractions(R1).attacker);
  const attackPower2 = attackerAfter * leverA;
  const fill = front.garrison * knobs.fillFactor;
  const defensePower2 = (fieldArmy.size * knobs.marchWorn + fill * 0.5) * leverD;
  const R2 = attackPower2 / defensePower2;
  const c2 = B.casualtyFractions(R2);
  const attackerWins = R2 >= 1;
  const routed = (attackerWins ? c2.defender : c2.attacker) >= ROUT_FRAC;
  return { branch: 'DECISIVE', shieldBreak: true, decisiveBattle: { R2, attackerWins, routed } };
}

/* Comparison cases — each restores one layer; E approximates the full game. */
const CASES = [
  { key: 'A baseline (landed rules)',   knobs: { fillFactor: 0, defenderLever: false, marchWorn: 0.75 } },
  { key: 'B +M9 fill (1 sector, ×0.5)', knobs: { fillFactor: 1, defenderLever: false, marchWorn: 0.75 } },
  { key: 'C +defender commit (D6)',     knobs: { fillFactor: 0, defenderLever: true,  marchWorn: 0.75 } },
  { key: 'D arrival full (rider ii)',   knobs: { fillFactor: 0, defenderLever: false, marchWorn: 1.0 } },
  { key: 'E all restored (B+C+D)',      knobs: { fillFactor: 1, defenderLever: true,  marchWorn: 1.0 } },
];

function buildProbeGrid() {
  const grid = [];
  for (const garrison of [1000, 2000, 3000])
    for (const size of [1500, 3000, 4500, 6000])
      for (const commit of [4, 8, 14])
        for (const terrain of ['plains', 'hills', 'mountains', 'pass'])
          for (const fortification of ['none', 'fieldworks', 'walls', 'fortress'])
            for (const faSize of [1000, 2000, 4000])
              grid.push({
                attacker: { size, commit },
                front: { garrison, terrain, fortification },
                fieldArmy: { reaches: true, size: faSize },
                escape: 'OPEN', // escape geometry is orthogonal to win/rout rates
              });
  return grid;
}

function runCase(grid, knobs) {
  const s = { REPULSED: 0, DECISIVE: 0, attackerWins: 0, fieldArmyRouts: 0, attackerRouts: 0 };
  for (const sc of grid) {
    const o = resolveWith(sc, knobs);
    s[o.branch]++;
    const d = o.decisiveBattle;
    if (!d) continue;
    if (d.attackerWins) s.attackerWins++;
    if (d.routed) s[d.attackerWins ? 'fieldArmyRouts' : 'attackerRouts']++;
  }
  return s;
}

if (require.main === module) {
  const grid = buildProbeGrid();
  console.log(`grid n=${grid.length} (garrison × force ratio × commit × terrain × fort × field army; reach=true)`);
  console.log('case                            REPULSED%  DECISIVE  atkWin%  faRout%  atkRout%');
  for (const { key, knobs } of CASES) {
    const s = runCase(grid, knobs);
    const pct = (a, b) => (100 * a / b).toFixed(1).padStart(6);
    console.log(`${key.padEnd(32)}${pct(s.REPULSED, grid.length)}%   ${String(s.DECISIVE).padStart(6)}  ${pct(s.attackerWins, s.DECISIVE)}%  ${pct(s.fieldArmyRouts, s.DECISIVE)}%  ${pct(s.attackerRouts, s.DECISIVE)}%`);
  }
}

module.exports = { resolveWith, buildProbeGrid, runCase, CASES };
