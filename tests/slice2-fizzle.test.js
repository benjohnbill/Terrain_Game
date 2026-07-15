const test = require('node:test');
const assert = require('node:assert/strict');
const W = require('../mockup/operational-layer/war-loop.js');
const F = require('../mockup/operational-layer/fizzle.js');
const M = require('../mockup/operational-layer/metrics.js');
const BotExit = require('../js/bot-exit.js');
const TOURNEY = require('../mockup/combat-calc/tournament.js');
const BOARD = require('../mockup/combat-calc/map-board.js');
const { CRADLE_MAP } = require('../mockup/combat-calc/map-gen.js');
const { viableBindings } = require('../mockup/combat-calc/map-gate.js');

const { viable } = viableBindings(CRADLE_MAP, 5);
const BINDING = viable[0];
const SEATS = Object.keys(BINDING);

function assign(archetype = 'conquest-snowball', temperament = 'pragmatic') {
  const a = {};
  for (const s of SEATS) a[s] = { archetype, temperament };
  return a;
}

/* A small mixed-archetype sample. The full tournament shape is the REPORT's job
   (fizzle.js); a test only needs enough matches for the behaviour under test to
   occur, and each test that depends on the sample asserts that it actually did
   (no vacuous passes). */
function sampleMatches(n = 5, seed = 42) {
  const rng = W.mulberry32(seed);
  const recs = [];
  for (let i = 0; i < n; i++) {
    const a = {};
    for (const s of SEATS)
      a[s] = { archetype: W.pickFrom(rng, W.ARCHETYPE_NAMES), temperament: W.pickFrom(rng, W.TEMPERAMENTS) };
    recs.push(W.runMatch({ map: CRADLE_MAP, binding: BINDING, assignment: a, seed: Math.floor(rng() * 1e9) }));
  }
  return recs;
}

/* ── Ported values must not rot ─────────────────────────────────────────── */

test('CROSSING_TERRAIN reproduces the sealed combatFromBorderClass mapping', () => {
  // The loop reproduces the mapping rather than importing the L2 war machine.
  // A reproduction that drifts is worse than no reproduction, so it is pinned
  // against the original for every class the authored map actually uses.
  const classes = [...new Set(CRADLE_MAP.edges.map((e) => e.choke.class))];
  assert.ok(classes.length > 0);
  for (const cls of classes) {
    assert.equal(W.CROSSING_TERRAIN[cls], TOURNEY.combatFromBorderClass(cls).terrain,
      `crossing class ${cls} must map to the sealed terrain`);
  }
});

test('board values are ports of the record world, not re-cuts', () => {
  assert.equal(W.GARRISON_PER_BORDER_SECTOR, BOARD.BOARD_GAAN.garrisonPerBorderSector);
  assert.equal(W.START_FIELD_FRAC, BOARD.BOARD_GAAN.startFieldFrac);
  assert.equal(W.CAPITAL_GARRISON, BOARD.BOARD_GAAN.capitalGarrison);
  assert.deepEqual(W.FORT_BY_CROSSING, BOARD.FG_FORT_BY_CLASS);
  assert.equal(W.HARNESS.maxTurns, TOURNEY.HARNESS.maxTurns);
  assert.equal(W.SECTOR_VALUE, TOURNEY.HARNESS.sectorValue);
});

test('the winner walk excludes whitePeace — a winner never proposes claiming nothing', () => {
  assert.deepEqual(W.WINNER_WALK, ['maximum', 'standard', 'lenient']);
  assert.ok(!W.WINNER_WALK.includes('whitePeace'));
  // Same grammar as the sealed harness's own walk, whose 표시어 keys these are.
  for (const rung of W.WINNER_WALK) assert.ok(BotExit.PRESETS[rung], `${rung} is a sealed preset`);
});

/* ── The stall timer is gone BY CONSTRUCTION, not by a flag ──────────────── */

test('no stall/patience/timer concept exists anywhere in the loop', () => {
  const src = require('fs').readFileSync(require.resolve('../mockup/operational-layer/war-loop.js'), 'utf8');
  const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, ''); // prose may DISCUSS the retirement
  for (const banned of ['stalled', 'stallPatience', 'patience', 'nearMiss']) {
    assert.ok(!code.includes(banned), `retired concept "${banned}" must not exist in the loop's code`);
  }
});

/* ── Determinism ────────────────────────────────────────────────────────── */

test('a match is deterministic given (binding, assignment, seed)', () => {
  const opts = { map: CRADLE_MAP, binding: BINDING, assignment: assign(), seed: 7 };
  const a = W.runMatch(opts);
  const b = W.runMatch(opts);
  assert.deepEqual(a.warEnds, b.warEnds);
  assert.equal(a.engagements, b.engagements);
  assert.equal(a.annihilations, b.annihilations);
  assert.deepEqual(a.settlements, b.settlements);
});

test('the seed reaches the fog draw — same world, different seed, different war', () => {
  // The loop draws no dice (the sealed calculator has none), so the seed's only
  // job is the fog band. Hold the assignment FIXED so nothing but the seed can
  // differ: varying the assignment too would let this pass while the seed was
  // inert, which is exactly how a dead seed hides.
  const fixed = { map: CRADLE_MAP, binding: BINDING, assignment: assign() };
  const a = W.runMatch({ ...fixed, seed: 1 });
  const b = W.runMatch({ ...fixed, seed: 999999 });
  assert.notDeepEqual(a.warEnds, b.warEnds, 'the seed must reach the outcome');
  assert.deepEqual(a.warEnds, W.runMatch({ ...fixed, seed: 1 }).warEnds, 'and stay reproducible');
});

test('a fog band is stable across turns but moves with the seed (no flicker)', () => {
  // The baseline stamps one bandSeed per war so a court reads the same band all
  // war long (tournament.js :590-594). Reproduced here from the match seed.
  const a1 = W.bandSeed(42, 'me', 'you', 'r1_s0');
  const a2 = W.bandSeed(42, 'me', 'you', 'r1_s0');
  assert.equal(a1, a2, 'same inputs → same band: a court must not see it flicker');
  assert.notEqual(a1, W.bandSeed(43, 'me', 'you', 'r1_s0'), 'a new match seed → a new draw');
  assert.notEqual(a1, W.bandSeed(42, 'me', 'you', 'r1_s1'), 'a different front → its own draw');
  assert.notEqual(a1, W.bandSeed(42, 'you', 'me', 'r1_s0'), 'each reader draws its own fog');
});

/* ── World construction ─────────────────────────────────────────────────── */

test('the shield sits on authored border sectors; the hinterland is open', () => {
  const world = W.buildWorld(CRADLE_MAP, BINDING);
  const border = [...world.sectors.values()].filter((s) => s.isBorder);
  const interior = [...world.sectors.values()].filter((s) => !s.isBorder);
  assert.ok(border.length > 0 && interior.length > 0);
  for (const s of border) assert.equal(s.garrison, W.GARRISON_PER_BORDER_SECTOR);
  for (const s of interior) {
    assert.equal(s.garrison, 0);
    assert.equal(s.fortification, 'none');
  }
});

test('the capital guard starts at its cap even when the throne sits inland', () => {
  const world = W.buildWorld(CRADLE_MAP, BINDING);
  const realms = W.seatRealms(world, BINDING, assign());
  for (const r of realms) {
    const capital = world.sectors.get(r.capitalId);
    assert.ok(capital.garrison >= W.CAPITAL_GARRISON,
      `${r.name}'s capital must be garrisoned; an ungarrisoned throne is a hole in the board`);
  }
});

test('sector adjacency is the frontier, so a war can advance past its first win', () => {
  const world = W.buildWorld(CRADLE_MAP, BINDING);
  // Every sector reaches at least one other: the frontier is a real graph, not
  // only the 17 authored crossings.
  let adjacencies = 0;
  for (const set of world.adjacent.values()) adjacencies += set.size;
  assert.ok(adjacencies > CRADLE_MAP.edges.length * 2,
    'the frontier must be richer than the authored crossings alone');
});

test('heldHexes covers every hex of a controlled sector, not just its front hex', () => {
  const world = W.buildWorld(CRADLE_MAP, BINDING);
  const realms = W.seatRealms(world, BINDING, assign());
  const me = realms[0];
  const hexes = W.heldHexes(world, me);
  // A sector is ground, not a point — the count must exceed the sector count.
  assert.ok(hexes.size > me.holds.size,
    'control covers a sector\'s whole area; representative hexes alone would sever supply');
  for (const sid of me.holds)
    assert.ok(hexes.has(world.sectors.get(sid).hexKey));
});

test('occupation transfers CONTROL at once but not ownership', () => {
  const world = W.buildWorld(CRADLE_MAP, BINDING);
  const realms = W.seatRealms(world, BINDING, assign());
  const [a, d] = realms;
  const bite = [...d.holds][0];
  d.holds.delete(bite);
  a.occupied.add(bite);
  assert.ok(W.controls(a).has(bite), 'the occupier controls its bite (route + frontier)');
  assert.ok(!a.holds.has(bite), 'but does not own it — white peace hands it back');
  assert.ok(W.heldHexes(world, a).has(world.sectors.get(bite).hexKey));
});

test('the response window is the sealed speed dial, not a copied number', () => {
  const world = W.buildWorld(CRADLE_MAP, BINDING);
  const S = require('../js/movement.js').SPEED_HEXES_PER_TURN;
  const start = [...world.hexToSector.keys()][0];
  // Everything within one turn's march answers; the first hex beyond it does not.
  const reach = (k) => W.withinResponseWindow(world, start, k);
  assert.ok(reach(start), 'a force already there is there');
  const path = [];
  let seen = new Set([start]); let frontier = [start];
  for (let d = 1; d <= S + 1; d++) {
    const next = [];
    for (const k of frontier) for (const nk of world.graph.adj.get(k) || [])
      if (!seen.has(nk)) { seen.add(nk); next.push(nk); }
    path[d] = next[0];
    frontier = next;
  }
  if (path[S]) assert.ok(reach(path[S]), `${S} hexes out is inside one turn's march`);
  if (path[S + 1]) assert.ok(!reach(path[S + 1]), `${S + 1} hexes out is beyond it`);
});

test('capitalUnderSword is geographic, not a ported stage flag', () => {
  const world = W.buildWorld(CRADLE_MAP, BINDING);
  const realms = W.seatRealms(world, BINDING, assign());
  const [a, d] = realms;
  const throne = world.sectors.get(d.capitalId).hexKey;
  const S = require('../js/movement.js').SPEED_HEXES_PER_TURN;

  // Standing on it: under the sword.
  a.fieldArmy.position = throne;
  assert.equal(W.capitalUnderSword(world, a, d), true);

  // Beyond one turn's march: not. Found by walking the graph rather than assumed
  // — on this map several seats START within one turn of an enemy throne (2-3
  // hexes), which is a property of the authored seating, not of this rule.
  let seen = new Set([throne]); let frontier = [throne]; let far = null;
  for (let dist = 1; dist <= S + 1 && !far; dist++) {
    const next = [];
    for (const k of frontier) for (const nk of world.graph.adj.get(k) || [])
      if (!seen.has(nk)) { seen.add(nk); next.push(nk); }
    if (dist === S + 1) far = next[0];
    frontier = next;
  }
  assert.ok(far, 'the map must be big enough to stand outside the window');
  a.fieldArmy.position = far;
  assert.equal(W.capitalUnderSword(world, a, d), false);
  // It is the SAME rule an engagement uses, so "can it fight here" and "is the
  // throne in reach" cannot drift apart.
  assert.equal(W.capitalUnderSword(world, a, d), W.withinResponseWindow(world, far, throne));
});

/* ── The window read is fed correctly (findings 5 and the denominator scope) ── */

test('a front is priced against ITS OWN defender, never every army on the board', () => {
  const world = W.buildWorld(CRADLE_MAP, BINDING);
  const realms = W.seatRealms(world, BINDING, assign());
  const me = realms[0];
  const other = realms.find((r) => r.name !== me.name);
  for (const r of realms) if (r.name !== me.name) me.intel.set(r.name, { fixKey: r.fieldArmy.position, confidence: 0.5, turnsUnobserved: 0 });
  const dets = W.detachmentsOf(me, realms, other.name);
  assert.equal(dets.length, 1, 'exactly one defender answers a front — not the whole board');
  assert.equal(dets[0].fixKey, other.fieldArmy.position);
  assert.equal(W.detachmentsOf(me, realms, 'nobody').length, 0);
});

test('the read never sees a true enemy value — substance arrives as a band', () => {
  const world = W.buildWorld(CRADLE_MAP, BINDING);
  const realms = W.seatRealms(world, BINDING, assign());
  const me = realms[0];
  const other = realms.find((r) => r.name !== me.name);
  me.intel.set(other.name, { fixKey: other.fieldArmy.position, confidence: 0.5, turnsUnobserved: 2 });
  const det = W.detachmentsOf(me, realms, other.name)[0];
  assert.ok(det.substanceBand.low <= other.fieldArmy.size && det.substanceBand.high >= other.fieldArmy.size,
    'the band must contain the truth');
  assert.ok(det.substanceBand.high > det.substanceBand.low, 'and must be a band, not a point');
});

/* ── The measurement's own honesty ──────────────────────────────────────── */

test('a settlement that moves nothing is counted as white peace, not as its demanded rung', () => {
  // THE trap this metric exists to avoid. A rung is a claim RATE, so at composite
  // 0 every rung — `maximum` included — moves nothing. Naming such a deal by the
  // winner's demand would report a claim of nothing as `maximum` and read out as
  // "0% white peace" when the board is in fact full of white peaces.
  const state = { occValue: 0, raidLoot: 0, capitalInReach: false, margin: 'marginal' };
  for (const rung of W.WINNER_WALK) {
    const bundle = BotExit.presetBundle(rung, state);
    assert.equal(bundle.value, 0, `${rung} moves nothing when the sword reached nothing`);
  }
  const rich = BotExit.presetBundle('standard', { occValue: 8, raidLoot: 0, capitalInReach: false, margin: 'marginal' });
  assert.ok(rich.value > 0, 'a real claim on real ground does move something');
});

test('the loop labels 0%-transfer deals whitePeace and records what was demanded', () => {
  const deals = sampleMatches().flatMap((r) => r.settlements);
  assert.ok(deals.length > 0, 'the loop must actually settle wars');
  for (const d of deals) {
    assert.ok(W.WINNER_WALK.includes(d.demandedRung), 'the demand comes off the winner walk');
    if (d.bundleValue === 0) assert.equal(d.rung, 'whitePeace', 'an empty bundle IS a white peace');
    else assert.equal(d.rung, d.demandedRung, 'a material claim keeps its demanded name');
  }
  // The trap must be live in the data, not merely guarded in the abstract: if no
  // empty-bundle deal ever occurred, this test would be passing vacuously.
  assert.ok(deals.some((d) => d.bundleValue === 0),
    'the pre-emptive white peace must be OBSERVED for this guard to mean anything');
});

test('no war ends silently — the denominator closes exactly', () => {
  const recs = sampleMatches();
  const known = new Set(['settle', 'refusePeace', 'eliminate', 'noFrontier',
    'unresolved', 'participantEliminated']);
  assert.ok(recs.some((r) => r.warEnds.length > 0), 'wars must actually end in the sample');
  for (const r of recs) {
    for (const w of r.warEnds) {
      assert.ok(known.has(w.cause), `unknown cause ${w.cause}`);
      assert.ok(typeof w.turn === 'number');
    }
    // THE guard. Every war that starts must reach a recorded end — including the
    // ones still running when the envelope expires. Retiring the stall timer
    // turns forced white peaces into wars that never end, so a loop that dropped
    // them would delete exactly the fizzle-shaped wars R14 is about and report
    // the survivors as a cure.
    assert.equal(r.warEnds.length, r.warsStarted,
      'wars started must equal wars recorded — an unrecorded end is a deleted war');
  }
  // The envelope cause must be OBSERVED, not merely handled in the abstract.
  assert.ok(recs.some((r) => r.warEnds.some((w) => w.cause === 'unresolved')),
    'unresolved wars must actually occur for this guard to mean anything');
});

test('the settled rung is the winner demand capped by the loser, never the ceiling', () => {
  const deals = sampleMatches().flatMap((r) => r.settlements);
  // The ceiling is recorded alongside, and the two are NOT the same field: a
  // court that can afford everything would read as `maximum` regardless of what
  // the winner actually wanted (js/bot-exit :228-240).
  assert.ok(deals.some((d) => d.ceiling !== d.demandedRung),
    'ceiling and demand must be able to disagree — otherwise the distinction is not wired');
});

/* ── Baseline re-derivation ─────────────────────────────────────────────── */

test('the baseline is re-derived crisis-OFF and decomposed by cause', () => {
  const b = F.baseline({ reps: 1, bindings: [BINDING] });
  assert.ok(b.warEnds > 0);
  // The recorded R14 headline attributes the fizzle to the stall timer. Whether
  // that attribution holds is the READER's call — the harness only guarantees the
  // split is available to make it with.
  // The split must PARTITION the recorded ends — every war end lands in exactly
  // one cause, so no white peace hides in an unnamed bucket. (Asserting
  // stall+refuse === whitePeace would be a tautology: fizzle.js defines the
  // latter as the former.)
  const counted = Object.values(b.byCause).reduce((x, y) => x + y, 0);
  assert.equal(counted, b.warEnds, 'every war end carries exactly one cause');
  assert.deepEqual(new Set(Object.keys(b.byCause)),
    new Set(['stallPeace', 'settle', 'eliminate', 'refusePeace'].filter((c) => b.byCause[c])),
    'no unexpected cause appears in the baseline');
  // The decomposition must be USABLE: the stall share has to be separable from
  // the rest, which is the whole point of finding 1.
  assert.ok(b.stallPeacePct > 0, 'the stall timer must actually be observed at the baseline');
  // 백지 is absent from the winner's walk, so no baseline `settle` can be a 0% rung.
  assert.ok(!Object.keys(b.rungs).includes('백지'));
});

test('the baseline run reproduces the recorded R14 shape', () => {
  // Not an exact-value pin (the prose figure is ~77% and the harness has moved
  // since 2026-07-13); a shape check that the coordinates still find the world
  // R14 described. If this ever fails, the baseline drifted and the comparison
  // target must be re-recorded before any delta is believed.
  const b = F.baseline({ reps: 2, bindings: [BINDING] });
  assert.ok(b.whitePeacePct > 0.6, `white peace ${b.whitePeacePct} should still dominate the baseline`);
  assert.ok(b.eliminationsPerMatch < 0.5, 'the baseline still barely eliminates anyone');
});

/* ── Layer restoration is reused, not re-authored ────────────────────────── */

test('metrics.js exports forEachRestoration so both metrics sweep the same layers', () => {
  assert.equal(typeof M.forEachRestoration, 'function');
  const seen = [];
  M.forEachRestoration((k) => seen.push(k));
  assert.equal(seen.length,
    M.RESTORATION.fillFactors.length * M.RESTORATION.shieldCommits.length * M.RESTORATION.recoveries.length);
});

test('the restoration sweep states which layers each cell restores', () => {
  const cells = F.restorationSweep({ reps: 1, bindings: [BINDING] });
  assert.ok(cells.length > 0);
  for (const c of cells) {
    assert.ok('fillFactor' in c.knobs && 'shieldCommit' in c.knobs,
      'no cell may inherit a hidden layer choice');
    assert.equal(typeof c.whitePeacePct, 'number');
  }
  const keys = cells.map((c) => `${c.knobs.fillFactor}|${c.knobs.shieldCommit}`);
  assert.equal(new Set(keys).size, keys.length, 'cells must be distinct');
});
