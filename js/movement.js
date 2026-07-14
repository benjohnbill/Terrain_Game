'use strict';

/* movement.js — movement contract + supply connectivity (slice-2 spec §3).
 *
 * Armies hold positions on the authored world's hex graph. Graph-agnostic:
 * callers pass a CRADLE_MAP-shaped object ({ sectors } with mapUnits); js/
 * never imports the mockup generator. Hexes absent from every sector (void,
 * carved range, sea) simply do not exist — that IS impassability. Wear counts
 * only length (terrain weighting REJECTED, spec §2); ADR 0015 crossing
 * penalties tax the crossing event elsewhere, never march wear.
 */

/* 가안 dial — slice-2 spec §3: constant speed S hexes/turn for all forces. */
const SPEED_HEXES_PER_TURN = 3;

/* Axial 6-neighborhood, pointy-top (same NB order as the map generator). */
const NB = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];

const F = (typeof module !== 'undefined' && module.exports)
  ? require('./fatigue.js')
  : window.Fatigue; // browser: fatigue.js must be loaded first

function hexKey(q, r) {
  return q + ',' + r;
}

/* Passable universe from sector map units; adjacency lists sorted (q, then r)
   so path tie-breaks are canonical, never insertion-order accidents. */
function buildGraph(cradleMap) {
  const nodes = new Map();
  for (const s of Object.values(cradleMap.sectors)) {
    for (const u of s.mapUnits) {
      nodes.set(hexKey(u.q, u.r), { q: u.q, r: u.r, sectorId: s.id, regionId: s.regionId });
    }
  }
  const adj = new Map();
  for (const [k, n] of nodes) {
    const out = [];
    for (const [dq, dr] of NB) {
      const nk = hexKey(n.q + dq, n.r + dr);
      if (nodes.has(nk)) out.push(nk);
    }
    out.sort((a, b) => {
      const A = nodes.get(a), B = nodes.get(b);
      return A.q - B.q || A.r - B.r;
    });
    adj.set(k, out);
  }
  return { nodes, adj };
}

/* Deterministic BFS — hex count is the only cost (speed is uniform, spec §3).
   Returns [from, ..., to] or null when unreachable. */
function shortestPath(graph, fromKey, toKey) {
  if (!graph.nodes.has(fromKey) || !graph.nodes.has(toKey)) return null;
  if (fromKey === toKey) return [fromKey];
  const cameFrom = new Map([[fromKey, null]]);
  const queue = [fromKey];
  for (let i = 0; i < queue.length; i++) {
    const k = queue[i];
    for (const nk of graph.adj.get(k)) {
      if (cameFrom.has(nk)) continue;
      cameFrom.set(nk, k);
      if (nk === toKey) {
        const path = [nk];
        for (let p = k; p !== null; p = cameFrom.get(p)) path.push(p);
        return path.reverse();
      }
      queue.push(nk);
    }
  }
  return null;
}

/* One turn of a destination order. Path is recomputed from the current
   position (auto-routing, spec §3 — the player owns the destination, never
   the hexes). Forced march moves up to S+k hexes; only the hexes beyond S
   accrue the premium — the wallet is the fatigue gauge, and no combat
   modifier exists here (arrival fatigue already prices the R sacrifice).
   Unreachable destination → null: the order is rejected, nothing moves. */
function marchStep(graph, positionKey, destinationKey, opts = {}) {
  const path = shortestPath(graph, positionKey, destinationKey);
  if (!path) return null;
  const remaining = path.length - 1;
  const cap = SPEED_HEXES_PER_TURN + (opts.forcedMarch ? F.forcedMarchExtraHexCap() : 0);
  const steps = Math.min(remaining, cap);
  const extraHexes = Math.max(0, steps - SPEED_HEXES_PER_TURN);
  return {
    position: path[steps],
    hexesEntered: steps,
    extraHexes,
    wearAccrued: F.marchAccrual(steps - extraHexes) + F.forcedMarchAccrual(extraHexes),
    arrived: steps === remaining,
  };
}

/* Route-connectivity predicate: "is this force supplied?" — a path from the
   army to any friendly base through passable, controlled ground, feeding the
   ticket-01 supply pump. isFriendlyHex(key, node) is the caller's control
   surface (sector control in the real game). Implementation ruling (flagged,
   open for review): the START hex is exempt from the control test — the army
   occupies the ground it stands on; every hex it draws THROUGH, the base
   included, must be friendly. */
function isSupplied(graph, positionKey, baseKeys, isFriendlyHex) {
  if (!graph.nodes.has(positionKey)) return false;
  const bases = new Set(baseKeys);
  const friendly = (k) => isFriendlyHex(k, graph.nodes.get(k));
  if (bases.has(positionKey)) return friendly(positionKey);
  const seen = new Set([positionKey]);
  const queue = [positionKey];
  for (let i = 0; i < queue.length; i++) {
    for (const nk of graph.adj.get(queue[i])) {
      if (seen.has(nk) || !friendly(nk)) continue;
      if (bases.has(nk)) return true;
      seen.add(nk);
      queue.push(nk);
    }
  }
  return false;
}

const _api = { hexKey, buildGraph, shortestPath, marchStep, isSupplied };
if (typeof module !== 'undefined' && module.exports) module.exports = _api;
else (window.Movement = window.Movement || {}), Object.assign(window.Movement, _api);
