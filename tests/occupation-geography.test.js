'use strict';
// Occupation geography stage ① (design 2026-07-10): sector-resolution land
// transfer. Task 1 — sector world + holdings on map-built boards.
const test = require('node:test');
const assert = require('node:assert');
const { CRADLE_MAP } = require('../mockup/combat-calc/map-gen.js');
const { viableBindings } = require('../mockup/combat-calc/map-gate.js');
const MB = require('../mockup/combat-calc/map-board.js');
const T = require('../mockup/combat-calc/tournament.js');

const BINDING = viableBindings(CRADLE_MAP, 5).viable[0];

test('buildSectorWorld: all 56 cradle sectors present with live copies', () => {
  const w = MB.buildSectorWorld(CRADLE_MAP, BINDING);
  assert.equal(w.sectors.size, 56);
  const s = w.sectors.get('r8_s0');
  assert.equal(s.regionId, 'r8');
  assert.equal(s.usableEconomy, 1);
  assert.equal(s.usablePop, 1);
});

test('buildSectorWorld: adjacency is symmetric and non-reflexive', () => {
  const w = MB.buildSectorWorld(CRADLE_MAP, BINDING);
  for (const [id, ns] of w.adj) {
    assert.ok(!ns.has(id), `${id} adjacent to itself`);
    for (const n of ns) assert.ok(w.adj.get(n).has(id), `${id}→${n} not symmetric`);
  }
});

test('buildSectorWorld: every sector has at least one neighbor', () => {
  const w = MB.buildSectorWorld(CRADLE_MAP, BINDING);
  for (const [id, ns] of w.adj) assert.ok(ns.size >= 1, `${id} isolated`);
});

test('buildSectorWorld: borderIds = sectors adjacent to another seat', () => {
  const w = MB.buildSectorWorld(CRADLE_MAP, BINDING);
  assert.ok(w.borderIds.size > 0);
  // spot-check: every border id has a cross-seat neighbor, every non-border has none
  const seatOf = {};
  for (const [seat, rids] of Object.entries(BINDING))
    for (const rid of rids)
      for (const [id, s] of w.sectors) if (s.regionId === rid) seatOf[id] = seat;
  for (const [id, ns] of w.adj) {
    const cross = [...ns].some((n) => seatOf[n] !== seatOf[id]);
    assert.equal(w.borderIds.has(id), cross, id);
  }
});

test('makeBoardFromMap: realms carry world/holds/fieldCap0/frontSectorIds', () => {
  const board = MB.makeBoardFromMap(CRADLE_MAP, BINDING);
  const world = board[0].world;
  assert.ok(world && world.sectors.size === 56);
  let total = 0;
  for (const r of board) {
    assert.ok(r.world === world, 'world is shared');
    assert.ok(r.holds instanceof Set && r.holds.size > 0);
    assert.equal(r.fieldCap0, r.fieldCap);
    assert.ok(r.frontSectorIds && Object.keys(r.frontSectorIds).length > 0);
    total += r.holds.size;
  }
  assert.equal(total, 56, 'holdings partition the map');
});

test('makeBoardFromMap: interior mirror equals holds minus border holds', () => {
  const board = MB.makeBoardFromMap(CRADLE_MAP, BINDING);
  for (const r of board) {
    const nonBorder = [...r.holds].filter((id) => !r.world.borderIds.has(id)).length;
    assert.equal(r.interior, nonBorder, r.name);
  }
});

test('fixture board (tournament makeBoard) has NO sector world', () => {
  const board = T.makeBoard();
  for (const r of board) {
    assert.equal(r.world, undefined);
    assert.equal(r.holds, undefined);
  }
});

// ---- Task 2: named capture ----
function mapBoard() { return MB.makeBoardFromMap(CRADLE_MAP, BINDING); }
function warBetween(board) {
  // find two realms that share a front (frontSectorIds on both sides)
  for (const A of board) for (const D of board) {
    if (A === D) continue;
    if (A.frontG[D.name] !== undefined && (D.frontSectorIds[A.name] || []).length)
      return { A, D, war: T.newWar(A, D, 1) };
  }
  throw new Error('no adjacent pair');
}

test('newWar carries occupiedIds', () => {
  const b = mapBoard();
  const { war } = warBetween(b);
  assert.deepEqual(war.occupiedIds, []);
});

test('first capture takes a front border sector, by score, deterministically', () => {
  const b = mapBoard();
  const { A, D, war } = warBetween(b);
  const frontIds = D.frontSectorIds[A.name].filter((id) => D.holds.has(id));
  const w = D.world;
  const score = (id) => { const s = w.sectors.get(id);
    return (s.populationValue + s.economyValue) / (w.borderIds.has(id) ? 3 : 1); };
  const expected = [...frontIds].sort((x, y) => score(y) - score(x) || (x < y ? -1 : 1))[0];
  T.captureSector(war, A, D);
  assert.deepEqual(war.occupiedIds, [expected]);
  assert.ok(!D.holds.has(expected), 'captured sector left defender holds');
  assert.equal(war.occupied, 1, 'count mirror');
});

test('frontier grows by adjacency from the occupied set', () => {
  const b = mapBoard();
  const { A, D, war } = warBetween(b);
  T.captureSector(war, A, D);
  const frontier = T.occupationFrontier(war, A, D);
  for (const id of frontier) {
    assert.ok(D.holds.has(id), 'frontier is defender-held');
    const seeds = new Set([...war.occupiedIds, ...D.frontSectorIds[A.name]]);
    const touches = [...D.world.adj.get(id)].some((n) => seeds.has(n)) || seeds.has(id);
    assert.ok(touches, `${id} not reachable from occupied/front border`);
  }
});

test('captures never exceed holdings; defender can be eaten to empty', () => {
  const b = mapBoard();
  const { A, D, war } = warBetween(b);
  const start = D.holds.size;
  for (let i = 0; i < start + 5; i++) T.captureSector(war, A, D);
  assert.equal(war.occupiedIds.length, start);
  assert.equal(D.holds.size, 0);
  assert.equal(D.interior, 0, 'mirror synced');
});

test('occupationFrontier: attacker-adjacency fallback for an inherited front (no authored border ids)', () => {
  const b = mapBoard();
  const { A, D } = warBetween(b);
  // Simulate what a war over an inheritFronts()-created front looks like:
  // the front exists (frontG entry, checked by warBetween) but carries no
  // authored frontSectorIds — this is the gap the finding pins. Deleting
  // the authored entry forces occupationFrontier past its first two
  // sources into the attacker-adjacency fallback (not the all-holds one).
  delete D.frontSectorIds[A.name];
  const war = T.newWar(A, D, 1);
  const frontier = T.occupationFrontier(war, A, D);
  assert.ok(frontier.size > 0, 'fallback frontier is non-empty');
  for (const id of frontier) {
    assert.ok(D.holds.has(id), 'frontier sector is D-held');
    const adjToA = [...D.world.adj.get(id)].some((n) => A.holds.has(n));
    assert.ok(adjToA, `${id} not adjacent to an A-held sector (all-holds fallback, not attacker-adjacency)`);
  }
  T.captureSector(war, A, D);
  assert.equal(war.occupiedIds.length, 1, 'one sector captured');
  assert.ok(!D.holds.has(war.occupiedIds[0]), 'captured sector left defender holds');
  assert.equal(war.occupied, 1, 'count mirror');
});

test('fixture board: captureSector counts anonymously (legacy path)', () => {
  const b = T.makeBoard();
  const A = b[0], D = b[1];
  const war = T.newWar(A, D, 1);
  T.captureSector(war, A, D);
  assert.equal(war.occupied, 1);
  assert.deepEqual(war.occupiedIds, []);
});

// ---- Task 3: transfer channels ----
test('acquireSector: resets usable to the ADR 0022 floor and joins holds', () => {
  const b = mapBoard();
  const { A, D, war } = warBetween(b);
  T.captureSector(war, A, D);
  const id = war.occupiedIds[0];
  T.acquireSector(A, id, T.HARNESS);
  const s = A.world.sectors.get(id);
  assert.ok(A.holds.has(id));
  assert.equal(s.usableEconomy, 0.5);
  assert.equal(s.usablePop, 0.6);
});

test('returnOccupied: sectors go back to the defender at pre-war usable', () => {
  const b = mapBoard();
  const { A, D, war } = warBetween(b);
  T.captureSector(war, A, D);
  const id = war.occupiedIds[0];
  T.returnOccupied(war, D);
  assert.ok(D.holds.has(id));
  assert.deepEqual(war.occupiedIds, []);
  assert.equal(D.world.sectors.get(id).usableEconomy, 1, 'no damage on return');
});

test('cession picks by value desc with connectivity to winner territory', () => {
  const b = mapBoard();
  const { A, D, war } = warBetween(b);
  for (let i = 0; i < 4; i++) T.captureSector(war, A, D);
  const ids = [...war.occupiedIds];
  const w = D.world;
  war.stage = 'cascade'; war.margin = 'decisive'; war.endTurn = 5;
  const res = T.applySettlement('preset', '표준', war, A, D, T.HARNESS, b);
  assert.ok(res.ceded >= 1 && res.ceded <= 4);
  const gained = ids.filter((id) => A.holds.has(id));
  assert.equal(gained.length, res.ceded);
  // every gained sector connects to (A territory ∪ other gained sectors)
  for (const id of gained) {
    const ok = [...w.adj.get(id)].some((n) => A.holds.has(n));
    assert.ok(ok, `${id} is an enclave`);
  }
  // remainder returned to D
  for (const id of ids) if (!gained.includes(id)) assert.ok(D.holds.has(id));
  assert.deepEqual(war.occupiedIds, []);
});

test('elimination: possessor keeps — third-party bites survive, remainder to eliminator', () => {
  const b = mapBoard();
  const { A, D, war } = warBetween(b);
  // find a third realm C also adjacent to D
  const C = b.find((r) => r !== A && r !== D
    && (D.frontSectorIds[r.name] || []).some((id) => D.holds.has(id)));
  assert.ok(C, 'binding has a third neighbor of D');
  const warC = T.newWar(C, D, 1);
  D.wars.push(war, warC); A.wars.push(war); C.wars.push(warC);
  T.captureSector(warC, C, D);           // C bites one sector
  const cBite = warC.occupiedIds[0];
  for (let i = 0; i < 3; i++) T.captureSector(war, A, D); // A bites three
  const remainder = [...D.holds];
  T.eliminate(D, A, b, T.HARNESS, war);
  assert.ok(C.holds.has(cBite), 'third-party keeps its bite');
  for (const id of remainder) assert.ok(A.holds.has(id), 'remainder to eliminator');
  assert.equal(D.holds.size, 0);
  assert.equal(D.alive, false);
});
