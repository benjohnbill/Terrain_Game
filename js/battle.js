'use strict';

/* Sealed dials (ports — birthplace = combat-formula MAGNITUDE). */
const TERRAIN = { plains: 1.0, forest: 1.2, hills: 1.2, mountains: 1.5, pass: 2.0, legendary: 2.5 }; // M5
const FORT    = { none: 1.0, fieldworks: 1.3, walls: 1.8, fortress: 2.4, legendary: 3.0 };           // M5
const LEVER_ANCHORS = [[0, 1.0], [4, 1.25], [8, 1.5], [14, 1.75], [20, 2.0]];                        // M2
const CASUALTY_BASE = 0.12; // M4
const CASUALTY_EXP  = 1.4;  // M4
const SHIELD_BREAK_THRESHOLD = 1.5; // M7 Swift Seizure
const FIELD_ARMY_MARCH_WORN = 0.75;   // user 2026-07-13
const ROUT_FRAC = 0.30;               // M4 rout cliff
const ROUT_OPEN_REMAINDER_LOSS = 0.5; // M4 escape OPEN — 50% of the remainder falls in the pursuit

function terrainMultiplier(terrain) {
  const m = TERRAIN[terrain];
  if (m === undefined) throw new Error('unknown terrain: ' + terrain);
  return m;
}
function fortMultiplier(fort) {
  const m = FORT[fort];
  if (m === undefined) throw new Error('unknown fortification: ' + fort);
  return m;
}

function commitLever(points) {
  const p = Math.max(0, Math.min(20, points));
  for (let i = 1; i < LEVER_ANCHORS.length; i++) {
    const [x0, y0] = LEVER_ANCHORS[i - 1];
    const [x1, y1] = LEVER_ANCHORS[i];
    if (p <= x1) return y0 + (y1 - y0) * (p - x0) / (x1 - x0);
  }
  return 2.0;
}

function shieldPower(front) {
  return front.garrison * terrainMultiplier(front.terrain) * fortMultiplier(front.fortification);
}

function casualtyFractions(R) {
  return {
    attacker: Math.min(1, CASUALTY_BASE / Math.pow(R, CASUALTY_EXP)),
    defender: Math.min(1, CASUALTY_BASE * Math.pow(R, CASUALTY_EXP)),
  };
}

function resolveEngagement(input) {
  const { attacker, front, fieldArmy, escape } = input;

  // FIRST BLOW — attacker's field army vs the front's raw shield
  const shield = shieldPower(front);
  const attack = attacker.size * commitLever(attacker.commit);
  const R1 = attack / shield;
  const c1 = casualtyFractions(R1);
  const attackerAfter = attacker.size * (1 - c1.attacker);
  const base = {
    firstBlowR: R1,
    casualties: { attacker: attacker.size * c1.attacker, defenderShield: front.garrison * c1.defender },
  };

  if (R1 < SHIELD_BREAK_THRESHOLD) return { branch: 'REPULSED', shieldBreak: false, ...base };
  if (!fieldArmy.reaches)          return { branch: 'FALL',     shieldBreak: true,  ...base };

  // DECISIVE branch — attacker vs field army
  const attackPower2  = attackerAfter * commitLever(attacker.commit);
  const defensePower2 = fieldArmy.size * FIELD_ARMY_MARCH_WORN; // open field: no terrain/fort
  const R2 = attackPower2 / defensePower2;
  const c2 = casualtyFractions(R2);
  const attackerWins = R2 >= 1;
  const loserBattleLoss = attackerWins ? c2.defender : c2.attacker;
  const routed = loserBattleLoss >= ROUT_FRAC;
  const annihilated = routed && escape === 'BLOCKED';
  const loserTotalLoss = !routed ? loserBattleLoss
    : annihilated ? 1
    : Math.min(1, loserBattleLoss + ROUT_OPEN_REMAINDER_LOSS * (1 - loserBattleLoss));
  return {
    branch: 'DECISIVE', shieldBreak: true, ...base,
    decisiveBattle: { R2, attackerWins, routed, escape, annihilated, loserTotalLoss },
  };
}

const _api = { terrainMultiplier, fortMultiplier, commitLever, shieldPower, casualtyFractions, resolveEngagement };
if (typeof module !== 'undefined' && module.exports) module.exports = _api;
else (window.Battle = window.Battle || {}), Object.assign(window.Battle, _api);
