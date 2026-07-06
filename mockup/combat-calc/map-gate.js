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

function regionAdjacency(map) {
  const adj = {};
  for (const r of map.regions) adj[r.id] = new Set();
  for (const e of map.edges) {
    const ra = map.sectors[e.a].regionId; const rb = map.sectors[e.b].regionId;
    if (ra !== rb) { adj[ra].add(rb); adj[rb].add(ra); }
  }
  const out = {}; for (const k of Object.keys(adj)) out[k] = [...adj[k]];
  return out;
}

// MVP: identity binding when regions==seats; adjacent-pair perfect matching
// when regions==2×seats.
function enumerateBindings(map, seatCount) {
  const regionIds = map.regions.map((r) => r.id);
  if (regionIds.length === seatCount) {
    const a = {}; map.regions.forEach((r) => { a[r.name] = [r.id]; });
    return [a];
  }
  if (regionIds.length !== 2 * seatCount) {
    throw new Error(`enumerateBindings MVP supports regions==seats or 2×seats, got ${regionIds.length}/${seatCount}`);
  }
  const adj = regionAdjacency(map);
  const results = [];
  function recurse(remaining, pairs) {
    if (remaining.length === 0) {
      const a = {}; pairs.forEach((p, i) => { a[`seat${i + 1}`] = p; });
      results.push(a); return;
    }
    const [first, ...rest] = remaining;
    for (const other of rest) {
      if (adj[first].includes(other)) recurse(rest.filter((x) => x !== other), [...pairs, [first, other]]);
    }
  }
  recurse(regionIds, []);
  return results;
}

function viableBindings(map, seatCount, D) {
  const bindings = enumerateBindings(map, seatCount);
  const viable = bindings.filter((a) => gateReport(map, a, D).viableForThisBinding);
  return { total: bindings.length, viable, viableCount: viable.length };
}

const _api = { checkB1, checkB2, gateReport, regionAdjacency, enumerateBindings, viableBindings };
if (typeof module !== 'undefined' && module.exports) module.exports = _api;
else (window.TC = window.TC || {}).gate = _api;
