'use strict';
// PROTOTYPE — the seat-sizing gate (spec §4 gate B) over a loaded map.
// B1: no all-cap leadership. B2: no one-war-kill by a single neighbor.
// Reuses match.js arithmetic. Dual-mode. js/ isolated.

const MATCH = (typeof require !== 'undefined')
  ? require('./match.js') : (window.TC && window.TC.match);
const LOADER = (typeof require !== 'undefined')
  ? require('./map-loader.js') : (window.TC && window.TC.loader);

function checkB1(realms, D = MATCH.MATCH_DIALS) {
  const offenders = [];
  for (const r of realms) {
    if (MATCH.hegemonyCheck(realms, r.name, D).leadership) offenders.push(r.name);
  }
  return { pass: offenders.length === 0, offenders };
}

function checkB2(realms, D = MATCH.MATCH_DIALS) {
  const kills = [];
  for (const victim of realms) {
    const frontKeys = Object.keys(victim.fronts || {});
    for (const attacker of realms) {
      if (attacker.name === victim.name) continue;
      if (!frontKeys.includes(attacker.name)) continue; // must share a front
      const atkProj = MATCH.projectable(attacker, D);
      const vicShield = MATCH.shieldMass(victim, D, [attacker.name]);
      if (atkProj >= D.shieldRatio * vicShield) kills.push({ victim: victim.name, attacker: attacker.name });
    }
  }
  return { pass: kills.length === 0, kills };
}

function gateReport(map, assignment, D = MATCH.MATCH_DIALS) {
  const { realms } = LOADER.loadMap(map, assignment ? { assignment } : {});
  const b1 = checkB1(realms, D);
  const b2 = checkB2(realms, D);
  return { b1, b2, viableForThisBinding: b1.pass && b2.pass, realms };
}

const _api = { checkB1, checkB2, gateReport };
if (typeof module !== 'undefined' && module.exports) module.exports = _api;
else (window.TC = window.TC || {}).gate = _api;
