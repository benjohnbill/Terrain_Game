'use strict';
/* war-loop.js — the slice-2 operational-layer match loop (ticket 10, metric 5).
 *
 * A minimal, deterministic, seeded bot-vs-bot match loop over the AUTHORED
 * cradle world that composes every slice-2 system end to end: movement +
 * fatigue (01/02), engagement v2 (03), field-army division + the commit budget
 * (04), intel v2 (05), board verbs + emergent siege (06), the window read (08),
 * and read-driven bot exit (09). It exists to answer ONE registered question —
 * spec §11 metric 5: does C1+C2 close R14 at the source?
 *
 * This is the fizzle RE-READ surface. It is a NEW loop: `tournament.js` (the L2
 * baseline) is never edited and never imported for its war machine — only for
 * the record-world board values this loop ports WITH citation (below). The two
 * are meant to be compared, so every axis the baseline fixed is fixed the same
 * way here (map, seating, seed, turn envelope) and every axis slice 2 changes is
 * changed deliberately.
 *
 * Working-layer instrument: it encodes NO balance decision and mints no
 * arithmetic. Every number is either a sealed dial reached through its owning
 * js/ module, a record-world value ported with its birthplace citation, or an
 * explicit 가안 knob named in HARNESS below and printed with the report. The
 * verdict is the user's (battery precedent).
 *
 * ── DECISION: the crisis overlay is OFF, and that is the correct comparison ──
 * Not a dodge, and not a limitation of convenience — three independent grounds
 * agree, and the report states the axis it leaves unmeasured:
 *
 *   1. LIKE-FOR-LIKE. The recorded comparison target is itself a crisis-OFF
 *      number: DESIGN-RISKS R14 reads "Crisis-OFF main-arc measurement
 *      (2026-07-13, L2 cradle, seed 42): ZERO annihilations/match, ~77% of wars
 *      end by stall→white-peace fizzle, decided% 0.656". Measuring the new loop
 *      under the overlay and differencing it against a crisis-OFF baseline would
 *      compare two different worlds; the delta would not be interpretable.
 *   2. R14'S OWN QUESTION. The crisis is a termination BACKSTOP, not the subject
 *      (crisis co-analysis 2026-07-13 → R14: "the draw/spectacle problem is
 *      UPSTREAM in the war system"). Metric 5 asks whether C1+C2 close R14 AT
 *      THE SOURCE; the source is the crisis-OFF main arc.
 *   3. VALIDITY (historical — closed since). When this loop was built,
 *      `js/bot-exit.js` was overlay-blind: `acceptableRungs` walked the full
 *      sealed ladder and knew nothing of CE-⑳'s bottom-up rung breaking, so a
 *      court would have signed whitePeace during total war, which CE-⑲/⑳ forbid.
 *      Ticket 11 has since given the walk its open-rungs input, so this ground no
 *      longer BLOCKS an overlay-ON run — but grounds 1 and 2 stand on their own,
 *      and they are the ones that decide the comparison.
 *
 * The overlay ON axis is therefore NOT MEASURED here. It is no longer blocked;
 * it is simply a different question with no baseline to difference against. The
 * report prints this; it is not left to be inferred.
 *
 * ── The stall timer does not exist here BY CONSTRUCTION ──────────────────────
 * There is no patience dial, no `stalled` counter, no war-length timer anywhere
 * in this file. A war ends because a court READS that it has lost (js/bot-exit),
 * because a throne falls, or because the turn envelope runs out. The retirement
 * is structural, not a disabled flag — the same property js/bot-exit.js holds.
 * (Deleting the timer from `tournament.js` is ticket 11's job, not this one's:
 * the baseline must stay runnable to be re-derivable.)
 *
 * ── Ported record-world values (citation, never re-cut) ─────────────────────
 * The board is the sealed cradle map (`map-gen.js CRADLE_MAP`) under the same
 * viable seatings the baseline used. Start-state values are ported from the L2
 * board factory so the two runs start from the same world:
 *   - garrison per border sector 900, startFieldFrac 0.5 — `map-board.js
 *     BOARD_GAAN` (HARNESS-tier 가안, start-state seal 2026-07-07)
 *   - fortification by crossing class — `map-board.js FG_FORT_BY_CLASS` (the
 *     record-world default since AB-② 2026-07-11)
 *   - crossing class → combat terrain — `tournament.js combatFromBorderClass`
 *     (L2 terrain-fidelity seal 2026-07-08), reproduced here as CROSSING_TERRAIN
 *     rather than imported, so this file does not pull in the L2 war machine.
 *     Pinned against the original by tests/slice2-fizzle.test.js.
 *   - sectorValue 2 — `tournament.js HARNESS.sectorValue`
 *   - settlement presets / temperament coefficients — reached through
 *     `js/bot-exit.js` (which already ports them from match-arc with citation).
 *
 * The ONE structural difference from the L2 board is deliberate and is the whole
 * point of the slice: the L2 factory collapses a realm's defense into ONE
 * aggregate front per neighbour seat (`makeBoardFromMap` frontG/fortAt) — the
 * "per-front uniform defense" ADR 0037 indicts as the placeholder. This loop
 * defends PER SECTOR: each authored crossing is its own front, carrying its own
 * garrison, terrain and fort. Aggregate garrison mass is preserved (the same 900
 * per border sector), so the difference is distribution, not endowment.
 */

const Movement = require('../../js/movement.js');
const Fatigue = require('../../js/fatigue.js');
const FieldArmy = require('../../js/field-army.js');
const CommitBudget = require('../../js/commit.js');
const Intel = require('../../js/intel.js');
const BoardVerbs = require('../../js/board-verbs.js');
const WindowRead = require('../../js/window-read.js');
const BotExit = require('../../js/bot-exit.js');
const Probe = require('./probe.js');

/* Crossing class → combat terrain. A reproduction of the sealed L2 mapping
   (`tournament.js combatFromBorderClass`, terrain-fidelity seal 2026-07-08);
   river/strait price the crossing elsewhere (ADR 0015) and fight on plains.
   Pinned against the original in tests/slice2-fizzle.test.js so it cannot rot. */
const CROSSING_TERRAIN = Object.freeze({
  open: 'plains', forest: 'forest', hills: 'hills', pass: 'pass',
  river: 'plains', strait: 'plains',
});

/* Ports of the record-world board (map-board.js BOARD_GAAN / FG_FORT_BY_CLASS). */
const GARRISON_PER_BORDER_SECTOR = 900;
const START_FIELD_FRAC = 0.5;
const FORT_BY_CROSSING = Object.freeze({
  open: 'fieldworks', forest: 'walls', hills: 'walls', river: 'walls',
  pass: 'fortress', strait: 'fortress',
});
const CAPITAL_GARRISON = 1500;     // map-board.js BOARD_GAAN.capitalGarrison (g0 = 1.0)
const SECTOR_VALUE = 2;            // tournament.js HARNESS.sectorValue
const CAP_PER_POP = 600;           // econ.js ECON_DIALS.capPerPop (nationalCap)

/* 가안 knobs — this loop's own, named here and printed with every report so no
   run inherits a hidden choice. None is a seal candidate; none re-cuts a sealed
   dial. Where the spec registers a quantity but seals no value (the commit
   budget, §4), the caller must supply one — that is a CALLER slot, not a re-cut. */
const HARNESS = Object.freeze({
  maxTurns: 32,          // ported: tournament.js HARNESS.maxTurns (same envelope)
  commitBudgetPerTurn: 20, // 가안 — the realm's per-turn commit pool (spec §4 seals
                           // the pool's EXISTENCE and non-bankability, not its size;
                           // 20 = the M2 lever ceiling, so one realm can max exactly
                           // one engagement or split across several)
  engagementCommit: 14,    // 가안 — the share a realm allots to an offensive
                           // engagement (ported shape: tournament.js BOT.fieldCommit)
  defenseCommit: 8,        // 가안 — the share a defending court allots (ported shape:
                           // tournament.js BOT.siegeCommit; also the M2 knee)
  trajectoryWindow: 3,     // 가안 — turns of history the §9 trajectory read compares
});

/* Archetype policy ports (tournament.js BOT.archetypes, :99-110 — HARNESS-tier
   가안 policy, explicitly "not seal candidates"). Only the settlement-relevant
   dials survive the port: `preset` (the winner's preferred rung) and
   `pushCapital` (will it storm a throne?). The static ~1.7 attackRatio gate is
   deliberately ABSENT — spec §7 replaces it with the window read's appetite
   threshold, and that replacement is half of what metric 5 measures.
   Identifiers are the registered English canonicals (documentation-law
   Vocabulary Law); the 표시어 the baseline keys on lives in js/bot-exit PRESETS
   `label`. */
const ARCHETYPES = Object.freeze({
  'conquest-snowball': { preset: 'standard', pushCapital: true },
  'vassal-chain': { preset: 'standard', pushCapital: true },
  'free-rider': { preset: 'maximum', pushCapital: false },
  'raid-attrition': { preset: 'lenient', pushCapital: false },
  'shield-first': { preset: 'standard', pushCapital: true },
  'interior-lines': { preset: 'standard', pushCapital: true },
});
const ARCHETYPE_NAMES = Object.freeze(Object.keys(ARCHETYPES));
/* js/bot-exit.js TEMPERAMENT keys (성향 계수 — 완고/실리/유화). */
const TEMPERAMENTS = Object.freeze(['hardliner', 'pragmatic', 'conciliatory']);

/* The winner's concession walk, descending. 백지/whitePeace is ABSENT by the
   sealed grammar: a winner never proposes claiming nothing (js/bot-exit.js
   :246-249; tournament.js trySettle :896). The 0% rung is reachable only from
   the loser's side or by a harness exit — which is exactly why white peace is a
   MEASURED OUTPUT here rather than a proposable move. */
const WINNER_WALK = Object.freeze(['maximum', 'standard', 'lenient']);

/* Seeded RNG — mulberry32, the same generator the baseline uses (tournament.js
   :135-143), reproduced so this file does not import the L2 war machine.
   Deterministic: same seed → same match, byte for byte. */
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function pickFrom(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }

/* ── World ──────────────────────────────────────────────────────────────── */

/* The per-sector board. Every authored crossing (map.edges — 17 region-to-region
   borders, each named at sector granularity with its choke class) becomes a
   FRONT: a real hex a real army must reach. Garrison sits on border sectors at
   the ported 900; interior sectors carry none (the L2 board's interiorGarrison
   is "legacy pool-sizing only" by its own comment). */
/* The map's immutable skeleton: the hex graph, the hex→sector index, and the
   sector adjacency frontier. None of it depends on the seating or changes during
   a match, but a match DOES mutate sector state (garrisons take casualties), so
   every match still gets a fresh sector table — only the pure geometry is shared.
   Rebuilding the graph per match would re-BFS the whole world thousands of times
   across a sweep for an answer that cannot have changed. */
const _skeletons = new WeakMap();
function mapSkeleton(map) {
  if (_skeletons.has(map)) return _skeletons.get(map);
  const graph = Movement.buildGraph(map);
  const hexToSector = new Map();
  for (const s of Object.values(map.sectors))
    for (const u of s.mapUnits) hexToSector.set(Movement.hexKey(u.q, u.r), s.id);
  const adjacent = new Map();
  for (const s of Object.values(map.sectors)) adjacent.set(s.id, new Set());
  for (const [key, sid] of hexToSector) {
    for (const nk of graph.adj.get(key) || []) {
      const other = hexToSector.get(nk);
      if (other && other !== sid) adjacent.get(sid).add(other);
    }
  }
  const skeleton = { graph, hexToSector, adjacent };
  _skeletons.set(map, skeleton);
  return skeleton;
}

function buildWorld(map, binding) {
  const { graph, hexToSector, adjacent } = mapSkeleton(map);
  const regionToSeat = new Map();
  for (const [seat, regionIds] of Object.entries(binding))
    for (const rid of regionIds) regionToSeat.set(rid, seat);

  const sectors = new Map();
  for (const s of Object.values(map.sectors)) {
    const unit = s.mapUnits[0];
    sectors.set(s.id, {
      id: s.id, regionId: s.regionId,
      hexKey: Movement.hexKey(unit.q, unit.r),
      economyValue: s.economyValue, populationValue: s.populationValue,
      usableEconomy: s.usableEconomy, usablePop: s.usablePop,
      garrison: 0, terrain: 'plains', fortification: 'none',
      isBorder: false, ash: false, routesDisrupted: false,
    });
  }

  // Authored crossings → the SHIELD. The map's 17 edges are the region-to-region
  // borders, each named at sector granularity with its authored choke class; the
  // sectors on either side are where the fortress line stands.
  const crossings = [];
  for (const e of map.edges) {
    const cls = e.choke.class;
    const terrain = CROSSING_TERRAIN[cls] || 'hills'; // combatFromBorderClass default
    const fortification = FORT_BY_CROSSING[cls] || 'walls';
    for (const sid of [e.a, e.b]) {
      const sec = sectors.get(sid);
      sec.isBorder = true;
      sec.garrison = GARRISON_PER_BORDER_SECTOR;
      sec.terrain = terrain;
      sec.fortification = fortification;
    }
    crossings.push({ a: e.a, b: e.b, crossingClass: cls, terrain, fortification });
  }
  // Interior sectors keep the constructed default — garrison 0, plains, no fort.
  // This is the L2 board's own structure, not a new choice: `makeBoardFromMap`
  // puts a realm's whole shield on its BORDER sectors (frontG = border-sector
  // count × 900) and its `interiorGarrison` is marked "legacy pool-sizing only".
  // The hinterland is open country; that is what makes a broken shield cascade.

  // The frontier (world.adjacent, built once in mapSkeleton) is the sealed
  // governing principle, cited: "geography defines the set of what is possible;
  // judgment chooses within it. The frontier (adjacency) is the invariant set"
  // (tournament.js occupation geography :252-255). Without it a war could only
  // ever strike the authored border crossing and never advance — there would be
  // no cascade to measure, and a war whose border sector had fallen would have
  // nowhere to go.
  return { graph, sectors, crossings, adjacent, hexToSector, regionToSeat, map };
}

/* Everything a realm militarily CONTROLS: what it owns, plus what it currently
   occupies. The distinction is the sealed one — "control and route access can
   change immediately, while economy, population, garrison, and recovery may lag"
   (AGENTS.md design guardrail; ADR 0029 occupation geography). An occupied
   sector is ground an army stands on and marches through THIS turn, but it is
   not owned: white peace hands it back id-exact and undamaged, and only a
   settlement or an elimination converts it into holds.
 *
 * Without this, occupation is a hole in the map: a captured sector would belong
 * to nobody, so the occupier's frontier would stop dead at it and the war would
 * run out of fronts the moment it won its first one — a conquest that cannot
 * advance past its own first success. */
function controls(realm) {
  return new Set([...realm.holds, ...realm.occupied]);
}

/* Every hex a realm actually stands on. A sector is ground, not a point: control
   covers ALL of its hexes, not the one that represents it on a front. Both the
   supply predicate and the escape test walk the hex graph, so handing them only
   representative hexes would cut every route (representative hexes are not
   adjacent to each other) — supply would read as severed everywhere and armies
   would starve in their own heartland. */
function heldHexes(world, realm) {
  const owned = controls(realm);
  const hexes = new Set();
  for (const [key, sid] of world.hexToSector)
    if (owned.has(sid)) hexes.add(key);
  return hexes;
}

/* A realm's starting field army: START_FIELD_FRAC of its national cap (econ.js
   nationalCap = Σ capPerPop × populationValue × usablePop). Ported arithmetic,
   reproduced rather than imported for the same no-L2-machine reason. */
function nationalCap(sectorList) {
  return Math.round(sectorList.reduce((s, x) => s + CAP_PER_POP * x.populationValue * x.usablePop, 0));
}

function seatRealms(world, binding, assignment) {
  const realms = [];
  for (const [seat, regionIds] of Object.entries(binding)) {
    const holds = new Set();
    for (const sec of world.sectors.values())
      if (regionIds.includes(sec.regionId)) holds.add(sec.id);
    const own = [...holds].map((id) => world.sectors.get(id));
    const cap = nationalCap(own);
    // Capital = the realm's richest sector by the SAME ranking applySettlement
    // uses to pick what a cession takes (tournament.js :928-934, population +
    // economy desc) — a cited ranking, not a new one. Ties break on sector id so
    // the choice is deterministic.
    const capital = own.slice().sort((a, b) =>
      (b.populationValue + b.economyValue) - (a.populationValue + a.economyValue)
      || (a.id < b.id ? -1 : 1))[0];
    // The capital guard starts at its cap — BOARD_GAAN.capitalGarrison 1500
    // ("g0 = 1.0: capital guard starts at its cap"). Ported: without it a
    // realm whose richest sector sits inland would defend its throne with the
    // constructed interior default of zero and lose it to the first army that
    // walked to it, which is a hole in the board, not a property of the model.
    capital.garrison = Math.max(capital.garrison, CAPITAL_GARRISON);
    realms.push({
      name: seat,
      archetype: assignment[seat].archetype,
      temperament: assignment[seat].temperament,
      alive: true,
      regionIds,
      holds,
      occupied: new Set(),     // militarily controlled, not owned (returnable)
      capitalId: capital.id,
      fieldCap: cap,
      fieldArmy: {
        size: Math.round(cap * START_FIELD_FRAC),
        position: capital.hexKey,
        fatigue: { wear: 0, supply: 0 },
      },
      commitPool: CommitBudget.pool(HARNESS.commitBudgetPerTurn),
      intel: new Map(),      // enemy name → detachment record (js/intel v2)
      history: [],           // trajectory snapshots (spec §9 axis iii)
      wars: [],
    });
  }
  return realms;
}

/* ── Reads ──────────────────────────────────────────────────────────────── */

/* The realm's border zone: every hex it holds, plus one hex out. js/intel's
   borderAlarm contract requires an INCLUSIVE frontier region rather than a thin
   ring — a ring narrower than one turn's speed could be leapt without any turn
   ENDING inside it, and the alarm is judged at turn endpoints. An inclusive
   region cannot be leapt. */
function borderZone(world, realm) {
  const zone = new Set();
  for (const sid of realm.holds) {
    const key = world.sectors.get(sid).hexKey;
    zone.add(key);
    for (const nk of world.graph.adj.get(key) || []) zone.add(nk);
  }
  return zone;
}

/* THE FRONTIER: every enemy sector this realm could strike — an enemy-held
   sector adjacent to ground it holds. Adjacency is the invariant set; the read
   chooses inside it. A front carries the TARGET sector's own defense (its
   garrison, terrain and fort), which is the per-sector shield the slice-2 model
   replaces the L2 per-front aggregate with. */
function candidateFronts(world, me, realms) {
  // Whoever CONTROLS the far sector defends it — an occupier defends its bite.
  const ownerOf = (sid) => realms.find((r) => r.alive && (r.holds.has(sid) || r.occupied.has(sid)));
  const mine = controls(me);
  const fronts = [];
  const seen = new Set();
  for (const near of mine) {
    for (const far of world.adjacent.get(near) || []) {
      if (mine.has(far) || seen.has(far)) continue;
      const enemy = ownerOf(far);
      if (!enemy || enemy.name === me.name) continue;
      seen.add(far);
      const target = world.sectors.get(far);
      fronts.push({
        hexKey: target.hexKey,
        sectorId: far,
        fromSectorId: near,
        enemy: enemy.name,
        terrain: target.terrain,
        fortification: target.fortification,
        garrisonBand: null,      // filled per reader (λ-judged, below)
        garrisonTrue: target.garrison,
        isBorder: target.isBorder,
      });
    }
  }
  return fronts;
}

/* ONE enemy's field army as an intel detachment (js/intel v2): a fix, a
   staleness clock, and banded substance/fatigue. This is what the window read's
   denominator responds with — never the true value.
 *
 * Scoped to a SINGLE enemy on purpose. windowRead's denominator is "the judged
 * garrison + Σ (ENEMY detachments whose reach cone intersects the response
 * window)" — the enemy being the court that actually defends that front. Handing
 * it every army on the board would price a third realm's reserve as a responder
 * to a war it is not in, which is not caution but a different fiction (the same
 * argument window-read.js makes against literal minimax). Fronts are therefore
 * read per-enemy, and each group sees only its own defender's detachments. */
function detachmentsOf(me, realms, enemyName, matchSeed = 0) {
  const enemy = realms.find((r) => r.alive && r.name === enemyName);
  const record = me.intel.get(enemyName);
  if (!enemy || !record) return [];
  return [{
    fixKey: record.fixKey,
    turnsUnobserved: record.turnsUnobserved,
    substanceBand: Intel.detachmentBand(record, enemy.fieldArmy.size,
      bandSeed(matchSeed, me.name, enemyName, 'substance')),
    fatigueBand: Intel.detachmentBand(record, enemy.fieldArmy.fatigue.wear,
      bandSeed(matchSeed, me.name, enemyName, 'fatigue')),
    // Pinned elsewhere: a detachment already committed to another war cannot also
    // answer here (spec §7 — the per-detachment game; applyFeints' own semantics).
    engaged: enemy.wars.some((w) => w.stage !== 'over' && w.def !== enemyName),
  }];
}

/* The window read from `me`'s side over `fronts`, with the commit lever DRAWN
   FROM THE POOL rather than assumed (spec §4: one non-bankable realm pool; the
   ticket-08 numerator's `attacker.commit` is a caller-supplied slot, and this
   loop is the first real caller). Enemy garrison arrives as a λ-judged band off
   the intel record (js/intel detachmentBand), never as a true value. Fronts are
   grouped by defender so each is priced against the court that actually holds it
   (see detachmentsOf). */
/* A stable fog-band seed for (reader, subject, front). The baseline stamps one
   `war.bandSeed` per war so a court reads the SAME band all war long ("no
   flicker" — tournament.js :590-594); this reproduces that property from the
   match seed, so a band is stable across turns but moves when the match seed
   moves. FNV-1a over the identifying strings, mixed with the match seed. */
function bandSeed(matchSeed, ...parts) {
  let hash = 2166136261 ^ (matchSeed | 0);
  for (const part of parts) {
    const str = String(part);
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    hash ^= 0x5f5f5f5f;
  }
  return (hash >>> 0);
}

function readFrom(world, me, fronts, realms, allotment, matchSeed) {
  const ctx = {
    graph: world.graph,
    speed: Movement.SPEED_HEXES_PER_TURN,       // the sealed dial, cited not copied
    disposition: 0,                             // λ neutral (bot doctrine §9: no handicap)
    attacker: {
      fromKey: me.fieldArmy.position,
      substance: me.fieldArmy.size,
      commit: allotment,
      quality: 1.0,                             // sealed slot ported at 1.0 (rider b)
      wear: me.fieldArmy.fatigue.wear,
    },
  };
  const byEnemy = new Map();
  for (const f of fronts) {
    if (!byEnemy.has(f.enemy)) byEnemy.set(f.enemy, []);
    byEnemy.get(f.enemy).push(f);
  }
  const out = [];
  for (const [enemyName, group] of byEnemy) {
    const record = me.intel.get(enemyName);
    const banded = group.map((f) => ({
      ...f,
      garrisonBand: Intel.detachmentBand(record, f.garrisonTrue,
        bandSeed(matchSeed, me.name, enemyName, f.sectorId)),
    }));
    out.push(...WindowRead.readFronts(banded,
      { ...ctx, detachments: detachmentsOf(me, realms, enemyName, matchSeed) }));
  }
  return out;
}

/* ── Engagement ─────────────────────────────────────────────────────────── */

/* Does the defender's field army reach this front, and can it get away if it
   loses? Both answers come from sealed primitives: the reach cone (js/intel) for
   arrival, and the hex graph for escape. ENCIRCLEMENT IS EMERGENT — `escape` is
   BLOCKED when no adjacent hex leads anywhere the defender still controls, which
   is the ticket-06 Moscow-trap shape reached by geometry, never by a rule that
   names encirclement. That matters for metric 5: the BLOCKED rout is the ONLY
   path to 섬멸 in the sealed calculator (js/battle.js: annihilated = routed &&
   escape === 'BLOCKED'), so annihilations/match measures whether the operational
   layer can manufacture the trap at all. */
/* THE RESPONSE WINDOW: can a force at `fromKey` be on the ground at `toKey` when
   the blow lands? One turn's march at the SEALED speed (js/movement
   SPEED_HEXES_PER_TURN) — the dial is cited, never copied. This is the loop's
   single reachability rule and every consumer uses it, so "can it fight here?"
   and "is the throne under the sword?" cannot drift apart. */
function withinResponseWindow(world, fromKey, toKey) {
  const path = Movement.shortestPath(world.graph, fromKey, toKey);
  return !!path && (path.length - 1) <= Movement.SPEED_HEXES_PER_TURN;
}

function defenderAt(world, defender, frontHexKey) {
  if (!withinResponseWindow(world, defender.fieldArmy.position, frontHexKey))
    return { reaches: false, size: defender.fieldArmy.size };
  return {
    reaches: true,
    size: defender.fieldArmy.size,
    commit: HARNESS.defenseCommit,
    quality: 1.0,
    fatigue: Fatigue.effectiveness(defender.fieldArmy.fatigue.wear),
  };
}

/* Is the loser's throne under the sword? This term feeds the sealed acceptance
   arithmetic (js/bot-exit expectedContinuedLoss → capitalRisk), so it must not be
   invented — and it CANNOT be ported. The baseline answers it from its war STAGE
   machine (tournament.js :865 — 'capital'/'fallen'/cascade-with-a-broken-field),
   and that multi-turn siege→field→cascade→capital conveyor is precisely what ADR
   0037 indicts and this slice replaces; there is no stage here to read.
 *
 * The slice-2 answer is geographic and reuses the response window above: the
 * throne is under the sword when the attacker's army could be standing on it
 * when the blow lands. Nothing new is cut — it is the sealed speed dial asked a
 * second question. The divergence from the baseline's definition is real and is
 * disclosed in the report; it is a different question asked of a different
 * machine, not a re-cut of the same one. */
function capitalUnderSword(world, attacker, defender) {
  return withinResponseWindow(world, attacker.fieldArmy.position,
    world.sectors.get(defender.capitalId).hexKey);
}

function escapeOf(world, defender) {
  const pos = defender.fieldArmy.position;
  const friendly = heldHexes(world, defender);
  const neighbours = world.graph.adj.get(pos) || [];
  return neighbours.some((k) => friendly.has(k)) ? 'OPEN' : 'BLOCKED';
}

/* War margin — the loser's escalation term in the sealed acceptance arithmetic
   (js/bot-exit expectedContinuedLoss). Read off the SEALED calculator's own
   outputs, never a threshold invented here (the metrics.js precedent): a rout is
   decisive, a plain win grinds, anything else is marginal. */
function marginOf(outcome) {
  const d = outcome.decisiveBattle;
  if (d && d.attackerWins && d.routed) return 'decisive';
  if (d && d.attackerWins) return 'grinding';
  if (outcome.branch === 'FALL') return 'grinding';
  return 'marginal';
}

/* ── The match ──────────────────────────────────────────────────────────── */

function newWar(attacker, defender, turn) {
  return {
    att: attacker.name, def: defender.name, startTurn: turn,
    stage: 'active', proposalStep: 0, margin: 'marginal',
    occupiedIds: [], targetSectorId: null,
  };
}

/* Ending a war REQUIRES naming why. The cause is not decoration: it IS metric
   5's denominator, and an unrecorded end is a war deleted from the sample.
 *
 * That deletion is not neutral — it is biased in the build's favour, which is why
 * this is enforced by the signature rather than by discipline. Retiring the stall
 * timer removes the thing that FORCED fizzle-shaped wars to end; without a cause
 * for "still running when the envelope expired", exactly those wars vanish from
 * the denominator and the white-peace rate reads far better than the board really
 * is. Measured on this loop before the guard: the baseline left ~10% of its wars
 * unrecorded, this loop left 30% — a 20pp asymmetry, all of it flattering the
 * loop. `extra` carries cause-specific fields (e.g. the settled rung). */
function endWar(war, realms, record, turn, cause, extra = {}) {
  if (war.stage === 'over') return;
  war.stage = 'over';
  record.warEnds.push({ turn, cause, ...extra });
  for (const r of realms) r.wars = r.wars.filter((w) => w !== war);
}

/* Occupied sectors return to the defender, id-exact and undamaged — the sealed
   white-peace semantics (tournament.js returnOccupied :471). */
function returnOccupied(war, attacker, defender) {
  for (const id of war.occupiedIds) {
    defender.holds.add(id);
    if (attacker) attacker.occupied.delete(id);   // control reverts with the bite
  }
  war.occupiedIds = [];
}

function snapshot(realm) {
  return {
    fatigue: realm.fieldArmy.fatigue.wear,
    land: realm.holds.size,
    army: realm.fieldArmy.size,
  };
}

/* ONE match. Deterministic given (world, assignment, seed, knobs). */
function runMatch({ map, binding, assignment, seed = 1, knobs = Probe.NEUTRAL_KNOBS }) {
  const world = buildWorld(map, binding);
  const realms = seatRealms(world, binding, assignment);
  // No RNG is drawn during a match: the sealed calculator has no dice, so the
  // loop is a pure function of (binding, assignment, seed). The seed's ONLY job
  // is the fog draw (bandSeed) — which is exactly the baseline's own use of it
  // (war.bandSeed). A seed that reached nothing would be a lie in the record.
  const record = {
    seed, knobs,
    warsStarted: 0, warEnds: [], settlements: [],
    eliminations: 0,        // realm deaths — the baseline's own annihilation sense
    annihilations: 0,       // 섬멸: BLOCKED routs (js/battle) — NO baseline analogue
    engagements: 0, decisiveBattles: 0,
    endingShape: 'timeout', winner: null, tripTurn: null, turnsPlayed: 0,
  };
  const sectorOwner = (sid) => realms.find((r) => r.alive && r.holds.has(sid));

  for (let t = 1; t <= HARNESS.maxTurns; t++) {
    const alive = realms.filter((r) => r.alive);
    if (alive.length <= 1) break;

    // -- turn head: the commit pool regenerates in full; leftovers do not bank
    //    (spec §4, js/commit renew). Intel clocks advance; contact is re-made
    //    where an army stands on a front this realm can see (js/intel v2).
    for (const r of alive) {
      r.commitPool = CommitBudget.renew(r.commitPool);
      const zone = borderZone(world, r);
      for (const e of alive) {
        if (e.name === r.name) continue;
        const prev = r.intel.get(e.name);
        // Contact = the enemy army stands inside my border zone (js/intel's
        // never-misses contract: an INCLUSIVE frontier region, my ground plus one
        // hex, never a thin ring). Out of contact, the fix ages and the cone grows
        // — the sealed staleness model, which is exactly what the read must price.
        r.intel.set(e.name, zone.has(e.fieldArmy.position)
          ? Intel.observeDetachment(prev, e.fieldArmy.position)
          : (prev ? Intel.ageDetachment(prev) : Intel.observeDetachment(null, e.fieldArmy.position)));
      }
      r.history.push(snapshot(r));
    }

    // -- declarations. The window crossing the appetite threshold IS the signal
    //    (spec §7, C1) — the static ~1.7 attackRatio gate is gone. The lever is
    //    drawn from the pool BEFORE the read, so the numerator prices the commit
    //    the realm can actually afford this turn (finding 5: budget slack is a
    //    caller slot).
    for (const me of alive) {
      if (me.wars.some((w) => w.att === me.name)) continue; // one offensive war at a time
      const fronts = candidateFronts(world, me, alive);
      if (!fronts.length) continue;
      const draw = CommitBudget.allocate(me.commitPool, [HARNESS.engagementCommit]);
      const reads = readFrom(world, me, fronts, alive, HARNESS.engagementCommit, seed);
      const decl = WindowRead.declaration(reads);
      if (!decl) continue;
      me.commitPool = draw.pool;                       // the allotment is spent only when used
      const target = alive.find((r) => r.name === decl.front.enemy);
      if (!target || target.wars.some((w) => w.att === me.name && w.def === target.name)) continue;
      const war = newWar(me, target, t);
      war.targetSectorId = decl.front.sectorId;
      me.wars.push(war); target.wars.push(war);
      record.warsStarted++;
    }

    // -- prosecution: march, then engage on arrival. Movement and wear come from
    //    the sealed contract (js/movement marchStep → js/fatigue accrual).
    for (const war of [...new Set(alive.flatMap((r) => r.wars))]) {
      if (war.stage === 'over') continue;
      const A = realms.find((r) => r.name === war.att);
      const D = realms.find((r) => r.name === war.def);
      if (!A || !D || !A.alive || !D.alive) { endWar(war, realms, record, t, 'participantEliminated'); continue; }

      // Re-target each turn: the front the read now prefers against THIS enemy.
      // A war with no reachable front left cannot be prosecuted — record it with
      // a cause rather than dropping it. NO war may end silently: an unrecorded
      // end is invisible to metric 5's denominator and would quietly inflate
      // every rate computed from it (the same defect that makes the L2
      // baseline's death-forced white peace an under-count).
      const fronts = candidateFronts(world, A, alive).filter((f) => f.enemy === D.name);
      if (!fronts.length) {
        returnOccupied(war, A, D);
        endWar(war, realms, record, t, 'noFrontier');
        continue;
      }
      const reads = readFrom(world, A, fronts, alive, HARNESS.engagementCommit, seed);
      const best = WindowRead.bestTarget(reads);
      if (!best) continue;
      war.targetSectorId = best.front.sectorId;
      const targetHex = best.front.hexKey;

      if (A.fieldArmy.position !== targetHex) {
        const step = Movement.marchStep(world.graph, A.fieldArmy.position, targetHex);
        if (!step) continue;                            // unreachable order → nothing moves
        A.fieldArmy.position = step.position;
        A.fieldArmy.fatigue.wear += step.wearAccrued;
        if (!step.arrived) continue;                    // still marching
      }

      // Arrived: the engagement runs through the ticket-07 probe so the two
      // stubbed defense layers stay EXPLICIT knobs (never silently stubbed).
      const front = world.sectors.get(war.targetSectorId);
      const outcome = Probe.resolveWith({
        attacker: {
          size: A.fieldArmy.size, commit: HARNESS.engagementCommit, quality: 1.0,
          fatigue: Fatigue.effectiveness(A.fieldArmy.fatigue.wear),
        },
        front: { garrison: front.garrison, terrain: front.terrain, fortification: front.fortification },
        fieldArmy: defenderAt(world, D, targetHex),
        escape: escapeOf(world, D),
      }, knobs);
      record.engagements++;
      war.margin = marginOf(outcome);

      // Casualties are real on both sides; battle wear feeds the ticket-01 ledger.
      A.fieldArmy.size = Math.max(0, A.fieldArmy.size - outcome.casualties.attacker);
      A.fieldArmy.fatigue.wear += Fatigue.battleAccrual(
        A.fieldArmy.size > 0 ? outcome.casualties.attacker / (A.fieldArmy.size + outcome.casualties.attacker) : 0);
      front.garrison = Math.max(0, front.garrison - outcome.casualties.defenderShield);

      const d = outcome.decisiveBattle;
      if (d) {
        record.decisiveBattles++;
        if (d.annihilated) record.annihilations++;
        if (d.attackerWins) D.fieldArmy.size = Math.max(0, D.fieldArmy.size * (1 - d.loserTotalLoss));
        else A.fieldArmy.size = Math.max(0, A.fieldArmy.size * (1 - d.loserTotalLoss));
      }

      const taken = outcome.branch === 'FALL' || (d && d.attackerWins);
      if (taken && D.holds.has(front.id)) {
        D.holds.delete(front.id);
        war.occupiedIds.push(front.id);
        A.occupied.add(front.id);        // control transfers at once; ownership does not
        // A throne taken ends the realm — the capital channel of the war-ending
        // composite (ADR 0038). The eliminator inherits what is left.
        if (front.id === D.capitalId) {
          for (const id of D.holds) A.holds.add(id);
          for (const id of D.occupied) A.occupied.add(id);
          for (const id of war.occupiedIds) { A.holds.add(id); A.occupied.delete(id); }
          war.occupiedIds = [];
          D.holds.clear(); D.occupied.clear(); D.alive = false; D.fieldArmy.size = 0;
          record.eliminations++;
          // D's OTHER wars die with it. Each is named: they are wars that ended
          // without resolving, and they transfer no ownership by settlement.
          for (const w of [...D.wars]) {
            if (w !== war) endWar(w, realms, record, t, 'participantEliminated');
          }
          endWar(war, realms, record, t, 'eliminate');
          continue;
        }
      }
    }

    // -- read-driven settlement (spec §9, C2). NO timer: the loser reads itself
    //    beaten (js/bot-exit decideExit), and the winner's demand — capped by
    //    what the loser will actually sign — IS the settled rung.
    for (const war of [...new Set(realms.filter((r) => r.alive).flatMap((r) => r.wars))]) {
      if (war.stage === 'over') continue;
      const A = realms.find((r) => r.name === war.att);
      const D = realms.find((r) => r.name === war.def);
      if (!A || !D || !A.alive || !D.alive) { endWar(war, realms, record, t, 'participantEliminated'); continue; }
      const live = realms.filter((r) => r.alive);

      const state = {
        occValue: war.occupiedIds.length * SECTOR_VALUE,
        raidLoot: 0,                       // no raid primary in this loop — see LIMITS
        capitalInReach: capitalUnderSword(world, A, D),
        margin: war.margin,
      };
      const myFronts = candidateFronts(world, D, live);
      const againstFronts = candidateFronts(world, A, live).filter((f) => f.enemy === D.name);
      const before = D.history[Math.max(0, D.history.length - 1 - HARNESS.trajectoryWindow)];
      const exit = BotExit.decideExit({
        court: { isHuman: false, temperament: D.temperament },
        state,
        myReads: readFrom(world, D, myFronts, live, HARNESS.defenseCommit, seed),
        readsAgainstMe: readFrom(world, A, againstFronts, live, HARNESS.engagementCommit, seed),
        before, now: snapshot(D),
      });
      if (!exit.settle) continue;

      // The winner proposes from its archetype's preferred rung and concedes one
      // step per turn (ruling ⑧: claim rate = rejection risk). The RESOLVED rung
      // is this demand when the loser will sign it — never the loser's ceiling
      // (js/bot-exit :228-240: reading the ceiling as the settlement skews high).
      const pol = ARCHETYPES[A.archetype];
      const from = Math.max(WINNER_WALK.indexOf(pol.preset), 0) + war.proposalStep;
      if (from < WINNER_WALK.length) {
        const demand = WINNER_WALK[from];
        if (exit.signable.includes(demand)) {
          // What the deal ACTUALLY moves. A rung is a claim RATE, so its bundle is
          // composite × rate: when the sword has reached nothing (composite 0),
          // every rung — `maximum` included — moves nothing and the deal is
          // materially a white peace. Recording the demanded NAME alone would
          // report a claim of nothing as `maximum` and poison this very
          // distribution; js/bot-exit makes the same argument about its ceiling
          // (:281-286) and takes the least-claiming rung that achieves the
          // transfer. Metric 5 counts white peace by MATERIAL OUTCOME, so the
          // bundle value is recorded and the 0%-transfer deals are named for what
          // they are.
          const bundle = BotExit.presetBundle(demand, state);
          const materialRung = bundle.value > 0 ? demand : 'whitePeace';
          const cededIds = [...war.occupiedIds];
          for (const id of war.occupiedIds) { A.holds.add(id); A.occupied.delete(id); }
          war.occupiedIds = [];                                  // the claim transfers
          record.settlements.push({ turn: t, winner: A.name, loser: D.name,
            demandedRung: demand, rung: materialRung, bundleValue: bundle.value,
            occValue: state.occValue, ceded: cededIds.length,
            ceiling: exit.ceiling, margin: war.margin });
          endWar(war, realms, record, t, 'settle', { rung: materialRung });
          continue;
        }
        war.proposalStep++;                                    // concede next turn
        continue;
      }
      // The walk is exhausted: the loser signs nothing the winner will propose.
      // 백지 is absent from the winner's walk by the sealed grammar, so the 0%
      // rung is reached only here — the WINNER's will breaking. bot-exit models
      // only the LOSER's, so this rule is ported from the baseline unchanged
      // (tournament.js refusePeace :1363-1369) to keep the comparison honest.
      if (!pol.pushCapital) {
        returnOccupied(war, A, D);
        endWar(war, realms, record, t, 'refusePeace');
      }
      // pushCapital: press on — the throne is the goal (ADR 0038 capital channel).
    }

    // -- turn tail: fatigue upkeep. Supply is the sealed route predicate
    //    (js/movement isSupplied over the CURRENT control set) feeding the
    //    ticket-01 pump; ash denies recovery (js/board-verbs). Starvation melts
    //    substance — the supply ledger's exclusive effect (the §2 firewall).
    for (const r of realms.filter((x) => x.alive)) {
      const friendlyHexes = heldHexes(world, r);
      const bases = [world.sectors.get(r.capitalId).hexKey];
      const supplied = Movement.isSupplied(world.graph, r.fieldArmy.position, bases,
        (k) => friendlyHexes.has(k));
      const standingSectorId = world.hexToSector.get(r.fieldArmy.position);
      const standingOn = r.holds.has(standingSectorId) ? world.sectors.get(standingSectorId) : null;
      const up = BoardVerbs.siegeUpkeep(r.fieldArmy.fatigue,
        { routeConnected: supplied, sector: standingOn });
      r.fieldArmy.fatigue = { wear: up.wear, supply: up.supply };
      if (up.substanceLossFraction > 0)
        r.fieldArmy.size = Math.max(0, r.fieldArmy.size * (1 - up.substanceLossFraction));
    }

    record.turnsPlayed = t;
    const standing = realms.filter((r) => r.alive);
    if (standing.length === 1) {
      record.winner = standing[0].name;
      record.endingShape = 'conquest';
      record.tripTurn = t;
      break;
    }
  }

  // THE ENVELOPE. Every war still running when the match stops is an end too —
  // the most important one this metric has, and the easiest to lose. Retiring the
  // stall timer does not make fizzle-shaped wars decisive; it makes them RUN
  // FOREVER. A loop that counted only wars which reached a verdict would silently
  // drop exactly the wars R14 is about and then report the survivors as evidence
  // the fizzle was cured. These are recorded, counted, and reported.
  for (const war of [...new Set(realms.flatMap((r) => r.wars))]) {
    endWar(war, realms, record, record.turnsPlayed, 'unresolved');
  }
  return record;
}

/* The tournament: the SAME shape the baseline runs (bindings × archetypes ×
   focal seats × reps), so the two are comparable seat for seat. */
function runWarLoopTournament({ map, bindings, reps = 1, seed = 1, knobs = Probe.NEUTRAL_KNOBS }) {
  const rng = mulberry32(seed);
  const records = [];
  bindings.forEach((binding, bindingIndex) => {
    const seats = Object.keys(binding);
    for (const focal of ARCHETYPE_NAMES) {
      for (const seat of seats) {
        for (let rep = 0; rep < reps; rep++) {
          const assignment = {};
          for (const s of seats) {
            assignment[s] = {
              archetype: s === seat ? focal : pickFrom(rng, ARCHETYPE_NAMES),
              temperament: pickFrom(rng, TEMPERAMENTS),
            };
          }
          records.push({
            bindingIndex, focal, seat,
            ...runMatch({ map, binding, assignment, seed: Math.floor(rng() * 1e9), knobs }),
          });
        }
      }
    }
  });
  return records;
}

module.exports = {
  CROSSING_TERRAIN, FORT_BY_CROSSING, HARNESS, ARCHETYPES, ARCHETYPE_NAMES,
  TEMPERAMENTS, WINNER_WALK, GARRISON_PER_BORDER_SECTOR, START_FIELD_FRAC,
  SECTOR_VALUE, CAP_PER_POP, CAPITAL_GARRISON,
  mulberry32, pickFrom, buildWorld, nationalCap, seatRealms,
  candidateFronts, borderZone, controls, heldHexes, readFrom, detachmentsOf,
  bandSeed, withinResponseWindow, defenderAt, capitalUnderSword, escapeOf, marginOf,
  runMatch, runWarLoopTournament,
};
