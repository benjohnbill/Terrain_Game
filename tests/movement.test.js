// tests/movement.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('../js/movement.js');
const F = require('../js/fatigue.js');
const { CRADLE_MAP, CRADLE_META } = require('../mockup/combat-calc/map-gen.js');

/* Synthetic one-region map: sectors = { name: [[q, r], ...] }. Movement is
   graph-agnostic (js/ never imports the mockup); tests feed it CRADLE_MAP-shaped
   objects, real or miniature. */
function miniMap(sectorHexes) {
  const sectors = {};
  for (const [sid, hexes] of Object.entries(sectorHexes)) {
    sectors[sid] = {
      id: sid, regionId: 't',
      mapUnits: hexes.map(([q, r]) => ({ q, r, terrainLayer: 'plains' })),
    };
  }
  return { sectors };
}

/* Three sectors in a west→east line; the mid corridor is the interdiction
   target. Callers bring their own control set over {west, mid, east}. */
function westMidEastGraph() {
  return M.buildGraph(miniMap({
    west: [[0, 0], [1, 0]],
    mid: [[2, 0], [3, 0], [4, 0]],
    east: [[5, 0], [6, 0]],
  }));
}

test('buildGraph: every sector map unit is a node carrying its sector; hexes outside sectors do not exist', () => {
  const g = M.buildGraph(CRADLE_MAP);
  let unitCount = 0;
  for (const s of Object.values(CRADLE_MAP.sectors)) unitCount += s.mapUnits.length;
  assert.equal(g.nodes.size, unitCount);
  const someSector = Object.values(CRADLE_MAP.sectors)[0];
  const u = someSector.mapUnits[0];
  const node = g.nodes.get(M.hexKey(u.q, u.r));
  assert.equal(node.sectorId, someSector.id);
  // the carved mountain range is void — not part of the passable universe
  for (const h of CRADLE_META.rangeHexes) {
    assert.equal(g.nodes.has(M.hexKey(h.q, h.r)), false, `range hex ${h.q},${h.r} leaked into the graph`);
  }
});

test('shortestPath: a straight corridor walks end to end, endpoints included', () => {
  const g = M.buildGraph(miniMap({ a: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]] }));
  const p = M.shortestPath(g, M.hexKey(0, 0), M.hexKey(4, 0));
  assert.deepEqual(p, ['0,0', '1,0', '2,0', '3,0', '4,0']);
  assert.deepEqual(M.shortestPath(g, '2,0', '2,0'), ['2,0']); // already there
});

test('shortestPath: impassable ground is respected — a severed corridor has no path', () => {
  const g = M.buildGraph(miniMap({ a: [[0, 0], [1, 0], [3, 0], [4, 0]] })); // (2,0) is void
  assert.equal(M.shortestPath(g, '0,0', '4,0'), null);
});

test('marchStep: destination order at constant speed S — no per-hex micromanagement', () => {
  const corridor = [];
  for (let q = 0; q <= 7; q++) corridor.push([q, 0]);
  const g = M.buildGraph(miniMap({ a: corridor }));
  const S = 3; // 가안 SPEED_HEXES_PER_TURN (hardcoded per battle.test.js precedent)
  let r = M.marchStep(g, '0,0', '7,0');
  assert.equal(r.position, '3,0');
  assert.equal(r.hexesEntered, S);
  assert.equal(r.extraHexes, 0);
  assert.ok(Math.abs(r.wearAccrued - F.marchAccrual(S)) < 1e-12); // gauge falls per the ticket-01 curve
  assert.equal(r.arrived, false);
  r = M.marchStep(g, r.position, '7,0');
  assert.equal(r.position, '6,0');
  r = M.marchStep(g, r.position, '7,0');   // final leg: only 1 hex left
  assert.equal(r.position, '7,0');
  assert.equal(r.hexesEntered, 1);
  assert.equal(r.arrived, true);
  // standing on the destination is a completed order, not a march
  const idle = M.marchStep(g, '7,0', '7,0');
  assert.equal(idle.arrived, true);
  assert.equal(idle.hexesEntered, 0);
  assert.equal(idle.wearAccrued, 0);
  // unreachable destination: the order is rejected, no silent partial march
  const cut = M.buildGraph(miniMap({ a: [[0, 0], [1, 0], [3, 0]] }));
  assert.equal(M.marchStep(cut, '0,0', '3,0'), null);
});

test('forced march: arrives earlier AND more fatigued; premium accrual only on the extra hexes', () => {
  const corridor = [];
  for (let q = 0; q <= 7; q++) corridor.push([q, 0]); // route length 7
  const g = M.buildGraph(miniMap({ a: corridor }));
  const S = 3, L = 7;
  const walk = (forcedMarch) => {
    let pos = '0,0', turns = 0, wear = 0, extra = 0;
    for (;;) {
      const r = M.marchStep(g, pos, '7,0', { forcedMarch });
      pos = r.position; turns++; wear += r.wearAccrued; extra += r.extraHexes;
      if (r.arrived) return { turns, wear, extra };
    }
  };
  const normal = walk(false);
  const forced = walk(true);
  assert.equal(normal.extra, 0);
  assert.ok(forced.turns < normal.turns);                  // earlier
  assert.ok(forced.wear > normal.wear);                    // more fatigued
  const k = F.forcedMarchExtraHexCap();
  assert.ok(forced.extra > 0 && forced.extra <= (S + k) * forced.turns - S * forced.turns);
  // premium arithmetic: normal hexes at the normal rate, extras at the premium rate — nothing else
  assert.ok(Math.abs(forced.wear - (F.marchAccrual(L - forced.extra) + F.forcedMarchAccrual(forced.extra))) < 1e-12);
  // a forced toggle on a short leg buys nothing and charges nothing extra
  const shortLeg = M.marchStep(g, '5,0', '7,0', { forcedMarch: true });
  assert.equal(shortLeg.extraHexes, 0);
  assert.ok(Math.abs(shortLeg.wearAccrued - F.marchAccrual(2)) < 1e-12);
  assert.equal(shortLeg.arrived, true);
});

test('no new combat penalty anywhere in the forced-march path — arrival fatigue already prices the R sacrifice', () => {
  const g = M.buildGraph(miniMap({ a: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]] }));
  const r = M.marchStep(g, '0,0', '5,0', { forcedMarch: true });
  // the march result speaks position and wear only — no combat modifier field exists
  assert.deepEqual(Object.keys(r).sort(),
    ['arrived', 'extraHexes', 'hexesEntered', 'position', 'wearAccrued']);
});

test('supply predicate: flips when the corridor is cut, restores when reopened, feeds the ticket-01 pump', () => {
  const g = westMidEastGraph();
  const army = '6,0', base = '0,0';
  const friendly = new Set(['west', 'mid', 'east']);
  const byControl = (key, node) => friendly.has(node.sectorId);
  assert.equal(M.isSupplied(g, army, [base], byControl), true);
  friendly.delete('mid');                                       // interdiction: the corridor falls
  assert.equal(M.isSupplied(g, army, [base], byControl), false);
  friendly.add('mid');                                          // corridor reopened
  assert.equal(M.isSupplied(g, army, [base], byControl), true);
  // the predicate IS the pump's supply level: cut → starvation clock, reopen → tick ends
  friendly.delete('mid');
  let s = { wear: 0, supply: 0 };
  for (let t = 0; t < 3; t++) s = F.turnUpkeep(s, M.isSupplied(g, army, [base], byControl) ? 1 : 0);
  assert.equal(s.starving, true);                               // three cut turns: past the entry threshold
  friendly.add('mid');
  s = F.turnUpkeep(s, M.isSupplied(g, army, [base], byControl) ? 1 : 0);
  assert.equal(s.starving, false);                              // reopened route ends the tick
  assert.equal(s.substanceLossFraction, 0);
});

test('supply predicate edges: an army supplies from its own hex regardless of who owns it; any base suffices', () => {
  const g = westMidEastGraph();
  const friendly = new Set(['west', 'mid']); // east is enemy ground — the army stands in it, contested
  const byControl = (key, node) => friendly.has(node.sectorId);
  assert.equal(M.isSupplied(g, '5,0', ['0,0'], byControl), true);  // start hex exempt: the army occupies it
  assert.equal(M.isSupplied(g, '6,0', ['0,0'], byControl), false); // but it cannot draw THROUGH enemy hexes
  assert.equal(M.isSupplied(g, '0,0', ['0,0'], byControl), true);  // sitting on the base is supplied
  assert.equal(M.isSupplied(g, '6,0', ['0,0', '5,0'], byControl), false); // an enemy-held base is no base
  friendly.add('east');
  assert.equal(M.isSupplied(g, '6,0', ['0,0', '5,0'], byControl), true);  // nearest reopened base suffices
});

test('supply predicate corner: the transit exemption does NOT extend to a base — a captured base under you is not supply', () => {
  const g = westMidEastGraph();
  // the army stands on its own base hex, but the sector has fallen to the enemy (contested).
  // ruling (OPEN, ticket file): the exemption frees TRANSIT, never the source — a base
  // supplies only while friendly-held, even the one the army is standing on.
  const friendly = new Set(['mid', 'east']); // west (the base sector) is enemy-held
  const byControl = (key, node) => friendly.has(node.sectorId);
  assert.equal(M.isSupplied(g, '0,0', ['0,0'], byControl), false); // captured base under the army = no supply
  friendly.add('west');                                            // retaken
  assert.equal(M.isSupplied(g, '0,0', ['0,0'], byControl), true);  // now the source is friendly again
});

test('demo: an army marches across the real map and its gauge falls per the ticket-01 curve', () => {
  const g = M.buildGraph(CRADLE_MAP);
  const anchor = (sid) => {
    const u = CRADLE_MAP.sectors[sid].mapUnits[0];
    return M.hexKey(u.q, u.r);
  };
  const from = anchor(CRADLE_META.cities.r2); // 하북 gate-city →
  const to = anchor(CRADLE_META.cities.r1);   // 중원 crown city (open border)
  const route = M.shortestPath(g, from, to);
  assert.ok(route && route.length > 1, 'capitals must be connected over land');
  let pos = from, wear = 0, turns = 0, prevEff = 1.0;
  while (pos !== to) {
    const r = M.marchStep(g, pos, to);
    pos = r.position; wear += r.wearAccrued; turns++;
    const eff = F.effectiveness(wear);
    assert.ok(eff <= prevEff, 'the gauge only falls while marching');
    prevEff = eff;
    assert.ok(turns < 100, 'destination order must terminate');
  }
  assert.ok(Math.abs(wear - F.marchAccrual(route.length - 1)) < 1e-12); // wear counts only length
  assert.ok(prevEff < 1.0 && prevEff >= 0.5); // worn on arrival, never through the floor
});

test('shortestPath: deterministic — insertion order cannot change the chosen equal-length route', () => {
  const forward = [];
  for (let q = 0; q <= 2; q++) for (let r = 0; r <= 2; r++) forward.push([q, r]);
  const reversed = [...forward].reverse();
  // same geometry, OPPOSITE map-unit insertion order. The 3×3 diamond offers
  // many equal-length routes '0,0'→'2,2'; the route must not depend on which
  // order sectors and map units were fed in. Guards against a future buildGraph
  // that constructs adjacency from an insertion-ordered walk.
  const gF = M.buildGraph(miniMap({ a: forward }));
  const gR = M.buildGraph(miniMap({ a: reversed }));
  const pF = M.shortestPath(gF, '0,0', '2,2');
  assert.ok(pF && pF.length === 5); // axial distance 4 → 5 keys
  assert.deepEqual(pF, M.shortestPath(gR, '0,0', '2,2')); // insertion-order independent
  assert.deepEqual(pF, M.shortestPath(gF, '0,0', '2,2')); // repeated call, same answer
});
