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
const ECON = require('../mockup/combat-calc/econ.js');

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
  assert.equal(D.world.sectors.get(id).usablePop, 1, 'no damage on return');
});

test('cession picks by value desc with connectivity to winner territory', () => {
  const b = mapBoard();
  const { A, D, war } = warBetween(b);
  for (let i = 0; i < 4; i++) T.captureSector(war, A, D);
  const ids = [...war.occupiedIds];
  const w = D.world;
  // necessary condition for value-descending pick: snapshot A's territory
  // BEFORE settlement, then compute the single highest-value occupied id
  // that already borders it — the ranked-desc + connectivity-greedy pick
  // algorithm must select this one first, so it must land in gained.
  const aHoldsBefore = new Set(A.holds);
  const val = (id) => { const s = w.sectors.get(id);
    return s.populationValue + s.economyValue; };
  const connectedToA = ids.filter((id) =>
    [...w.adj.get(id)].some((n) => aHoldsBefore.has(n)));
  assert.ok(connectedToA.length > 0, 'premise: some occupied sector borders A pre-settlement');
  const bestConnected = [...connectedToA]
    .sort((x, y) => val(y) - val(x) || (x < y ? -1 : 1))[0];
  war.stage = 'cascade'; war.margin = 'decisive'; war.endTurn = 5;
  const res = T.applySettlement('preset', '표준', war, A, D, T.HARNESS, b);
  assert.ok(res.ceded >= 1 && res.ceded <= 4);
  const gained = ids.filter((id) => A.holds.has(id));
  assert.equal(gained.length, res.ceded);
  assert.ok(gained.includes(bestConnected),
    `${bestConnected} (highest-value id connected to A pre-settlement) missing from gained [${gained}]`);
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

test('elimination: D-as-attacker bites return to their defender (forced white peace)', () => {
  const b = mapBoard();
  const { A, D, war: warAD } = warBetween(b);
  // find a third realm E that D can attack (same technique warBetween uses,
  // with D on the attacker side)
  let E, warDE;
  for (const cand of b) {
    if (cand === A || cand === D) continue;
    if (D.frontG[cand.name] !== undefined && (cand.frontSectorIds[D.name] || []).length) {
      E = cand;
      warDE = T.newWar(D, E, 1);
      break;
    }
  }
  assert.ok(E, 'binding has a realm D can attack');
  D.wars.push(warAD, warDE); A.wars.push(warAD); E.wars.push(warDE);
  T.captureSector(warDE, D, E);          // D bites one sector from E
  const dBite = warDE.occupiedIds[0];
  for (let i = 0; i < 2; i++) T.captureSector(warAD, A, D); // A bites D
  T.eliminate(D, A, b, T.HARNESS, warAD);
  assert.ok(E.holds.has(dBite), 'E gets its sector back');
  assert.deepEqual(warDE.occupiedIds, []);
  assert.equal(E.world.sectors.get(dBite).usableEconomy, 1, 'no damage from forced white peace');
});

test('elimination: dead third-party attacker folds its bite back through the eliminator (conservation)', () => {
  const b = mapBoard();
  const { A, D, war } = warBetween(b);
  const everHeld = new Set(D.holds); // every sector D ever held, before any war action
  const C = b.find((r) => r !== A && r !== D
    && (D.frontSectorIds[r.name] || []).some((id) => D.holds.has(id)));
  assert.ok(C, 'binding has a third neighbor of D');
  const warC = T.newWar(C, D, 1);
  D.wars.push(war, warC); A.wars.push(war); C.wars.push(warC);
  T.captureSector(warC, C, D);           // C bites one sector
  const cBite = warC.occupiedIds[0];
  for (let i = 0; i < 3; i++) T.captureSector(war, A, D); // A bites three
  C.alive = false;                       // C dies before D's elimination
  T.eliminate(D, A, b, T.HARNESS, war);
  assert.ok(A.holds.has(cBite), "dead third party's bite reaches the eliminator");
  assert.ok(!C.holds.has(cBite), 'never lands with the dead third party');
  for (const id of everHeld) {
    const owners = b.filter((r) => r.holds && r.holds.has(id));
    assert.equal(owners.length, 1, `${id} held by exactly one realm after elimination`);
  }
});

// ---- Task 4: derivations + ripening pulse ----
test('realmIncome derives from held sectors x sector usable x realm usable', () => {
  const b = mapBoard();
  const r = b[0];
  const expect = [...r.holds].map((id) => r.world.sectors.get(id))
    .reduce((s, x) => s + x.economyValue * x.usableEconomy, 0) * r.usable;
  assert.ok(Math.abs(T.realmIncome(r) - expect) < 1e-9);
  // at start (all usable 1.0) this equals the legacy yieldBase * usable
  assert.ok(Math.abs(expect - r.yieldBase * r.usable) < 1e-9);
});

test('capLandFrac 0: ceiling static through land loss; 1.0: tracks holdings', () => {
  const b = mapBoard();
  const { A, D, war } = warBetween(b);
  const d0 = D.fieldCap;
  T.captureSector(war, A, D); // D loses a sector into limbo
  // no full match needed — pin the blend formula the pulse must use
  const blend = (r, f) => Math.round((1 - f) * r.fieldCap0 + f * ECON.nationalCap(
    [...r.holds].map((id) => r.world.sectors.get(id))));
  assert.equal(blend(D, 0), d0, 'frac 0 is the frozen control');
  assert.ok(blend(D, 1) < d0, 'frac 1 feels the loss immediately');
});

test('acquired sector ripens +0.10/turn to 1.0 through the pulse', () => {
  const b = mapBoard();
  const { A, D, war } = warBetween(b);
  T.captureSector(war, A, D);
  const id = war.occupiedIds[0];
  T.acquireSector(A, id, T.HARNESS);
  war.occupiedIds = []; war.occupied = 0;
  const s = A.world.sectors.get(id);
  assert.equal(s.usablePop, 0.6);
  // run a short match on this board: the pulse must ripen the sector
  const assign = Object.fromEntries(b.map((r) =>
    [r.name, { archetype: 'shield-first', temperament: '표준' }]));
  T.runMatch(assign, { seed: 3, board: b, harness: { maxTurns: 4 } });
  assert.ok(s.usablePop > 0.6, `ripened, got ${s.usablePop}`);
  assert.ok(s.usablePop <= 1.0 + 1e-9);
});

test('limbo: an occupied (untransferred) sector pays income to neither side', () => {
  const b = mapBoard();
  const { A, D, war } = warBetween(b);
  const incomeBefore = T.realmIncome(A) + T.realmIncome(D);
  T.captureSector(war, A, D);
  const incomeAfter = T.realmIncome(A) + T.realmIncome(D);
  assert.ok(incomeAfter < incomeBefore, 'world income drops while contested');
});

test('front inheritance: sector mode requires landless, not interior 0', () => {
  // close-out fix: the applySettlement hollow gate read the legacy
  // D.interior <= 0 even in sector mode — hex-derived borders make small
  // realms sit near interior 0 while fully landed, opening fronts early.
  const b = mapBoard();
  const { A, D, war } = warBetween(b);
  T.captureSector(war, A, D);
  // hollow D's interior only: keep just its seat-border holds
  for (const id of [...D.holds]) if (!D.world.borderIds.has(id)) D.holds.delete(id);
  T.syncCounts(D);
  assert.equal(D.interior, 0, 'premise: legacy gate would fire');
  assert.ok(D.holds.size > 0, 'premise: D still holds land');
  const dNeighbors = Object.keys(D.frontSectorIds);
  assert.ok(dNeighbors.some((n) => n !== A.name && A.frontG[n] === undefined),
    'premise: D has a neighbor A does not front (inheritance would be visible)');
  const frontsBefore = Object.keys(A.frontG).sort();
  war.stage = 'cascade'; war.margin = 'decisive'; war.endTurn = 5;
  const res = T.applySettlement('preset', '표준', war, A, D, T.HARNESS, b);
  assert.ok(res.ceded <= 1, 'premise: ceded < 2 leg cannot fire');
  assert.deepEqual(Object.keys(A.frontG).sort(), frontsBefore,
    'no front inheritance while D still holds land');
});

// ---- Task 5: control invariance after retirement ----
test('capLandFrac 0 control: two identical runs are deterministic and growth-free', () => {
  const run = () => {
    const board = mapBoard();
    const assign = Object.fromEntries(board.map((r) =>
      [r.name, { archetype: 'shield-first', temperament: '표준' }]));
    const rec = T.runMatch(assign, { seed: 11, board, harness: { maxTurns: 12 } });
    return { rec, caps: board.map((r) => r.fieldCap) };
  };
  const a = run(), b2 = run();
  assert.equal(a.rec.winner, b2.rec.winner);
  assert.deepEqual(a.caps, b2.caps);
  // frozen control: every ceiling still equals its build value
  const fresh = mapBoard();
  assert.deepEqual(a.caps, fresh.map((r) => r.fieldCap0));
});

// capLandFrac's blend must be provably LIVE inside a real T.runMatch (not
// just algebraically true, as the Task-4 test above establishes) — and the
// frac-0 control must stay frozen even while real land actually changes
// hands, not merely because nothing happened at all (as the control just
// above this one turns out to be: at seed 11 / maxTurns 12 / uniform
// shield-first, NO war ever starts on this board — see below).
//
// Seed/maxTurns hunting alone cannot fix that: pickTarget takes no rng
// argument, so which wars start is 100% deterministic given the archetype
// assignment, and viable[0]'s five seats are population-symmetric (every
// seat totals populationValue 12 → fieldCap 7200 exactly, verified
// directly). Measuring every adjacent pair's field/shield ratio turn-by-
// turn under ANY uniform archetype tops out around 1.12 — below both the
// 1.25 idle-aggression bar and every archetype's 1.6+ direct-declare bar —
// so a uniform assignment never starts a war on this board, at any seed,
// verified up to 200+ turns across every archetype. A light archetype
// asymmetry breaks the tie instead: 'shield-first' spends its first few
// turns on fort upgrades before it ever recruits (peace order
// ['fort','recruit']), so a recruit-first neighbor ('interior-lines',
// peace order ['recruit','fort']) opens a real, natural early-game gap.
// seed 1 / maxTurns 16 with seat2 = interior-lines (others shield-first)
// reliably produces a real siege→capture→transfer (stable across maxTurns
// 13-20+, not a knife-edge single point — verified directly).
test('capLandFrac 1 (real match): ceiling tracks a genuine land transfer; frac 0 twin stays frozen', () => {
  const seed = 1, maxTurns = 16;
  const assign = Object.fromEntries(Object.keys(BINDING).map((name) =>
    [name, { archetype: name === 'seat2' ? 'interior-lines' : 'shield-first', temperament: '표준' }]));

  const fresh = mapBoard();
  const startSizes = new Map(fresh.map((r) => [r.name, r.holds.size]));

  const board0 = mapBoard();
  T.runMatch(assign, { seed, board: board0, harness: { maxTurns } });
  for (const r of board0.filter((r) => r.alive))
    assert.equal(r.fieldCap, r.fieldCap0, `${r.name} ceiling drifted at capLandFrac 0 (frozen control)`);

  const board1 = mapBoard();
  T.runMatch(assign, { seed, board: board1, harness: { maxTurns, capLandFrac: 1 } });
  // premise: land actually changed hands — else the drift assertion below
  // would pass or fail on an untested claim, not the blend
  const moved = board1.some((r) => r.holds.size !== startSizes.get(r.name));
  assert.ok(moved, 'premise broken: no holdings changed by maxTurns 16 at seed 1 — pick another seed/maxTurns/archetype mix');
  const drifted = board1.filter((r) => r.alive).some((r) => r.fieldCap !== r.fieldCap0);
  assert.ok(drifted, "capLandFrac 1 should move at least one alive realm's ceiling off its build value");
});
