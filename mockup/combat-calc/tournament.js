'use strict';
// PROTOTYPE (semi-durable) — battery sheet 12: match tournament, the L2
// rung of the test-trust ladder (L0 hand reasoning / L1 decision grids /
// L2 match tournament / L3 playtest). Policy bots per archetype ×
// temperament play full matches over the existing pure modules
// (engine.js battles + match.js hegemony/settlement + M12/M13 pulse).
//
// QUESTION: does each temperament/archetype win where it should, and is
// no temperament absolutely favorable? (user's pass sentence, verbatim
// intent). Also: vassalage sovereignty-premium 0.25 validation (ruling
// ⑭ gate) — frequency data the L1 grids cannot produce.
//
// HONEST LIMITS (print with every result): bot policy quality bounds
// proof power — dominance FOUND is real; dominance NOT found is not
// absence. Attackers may carry a tactical plan brain (plan-ai.js,
// sealed 2026-07-08: ladder over all 7 plans, fog-band judgment);
// DEFENDERS remain passive — no reserves, delaying, feints, or
// scouting actions — so brained results are upper bounds vs a passive
// defender. The board is one authored 5-seat instance, not the map
// space.
//
// DIAL HYGIENE: values in BOT (policy dials) and HARNESS (world-model
// glue) are harness GAAN — they bound proof power and are NOT seal
// candidates. Sealed game dials all come from engine.DIALS /
// match.MATCH_DIALS; the one gated value under test is vassalPremium.
//
// SEMI-DURABLE: runMatch/runTournament are meant to be re-pointed at
// js/ modules later as the balance regression rig. Only the coarse
// world model here mirrors throwaway assumptions.

const { DIALS, resolve, reserveAwaken } = require('./engine');
const ECON = require('./econ.js');
const { MATCH_DIALS, hegemonyCheck, projectable, matchPanel, presetBundle,
  expectedContinuedLoss, accepts } = require('./match');

// ---------------------------------------------------------------- dials
const HARNESS = {
  maxTurns: 32,             // envelope 15–25 + slack; past this = timeout
  sectorValue: 2,           // yield units per interior sector (sheet-11 scale: occ 4 sectors ≈ 8)
  capitalValue: 4,          // capital sector worth (realm remaining value term)
  garrisonRegen: 0.10,      // M12: local garrison regen per turn toward its cap
  capitalGarrisonCap: 1500, // g0=1.0 capital guard cap (regen target + shattered ref)
  usableRecovery: 0.10,     // +10pp/turn when not raided (M12 usableRecoveryPp)
  raidLoot: 1.5,            // M8: loot per uncontested raid primary, yield units
  raidBurnPp: 0.15,         // M8: usable −15pp per raid
  indemnityMenPerYield: 200, // 부대 = 0.5 yield (M13) → 1 yield = 2부대 = 200명 recruit credit
  truceTurns: 4,
  stallPatience: 2,         // stalled war turns before white peace
  vassalPremium: 0.25,      // ruling ⑭ 가안 — THE value under test (swept)
  // -- occupation geography (stage ①, design 2026-07-10). ADR 0022 usable
  //    placeholders (HARNESS 가안) + land-ceiling coupling strength. --
  usableEconomyStart: 0.5,   // acquired sector: economy usable start
  usablePopStart: 0.6,       // acquired sector: population usable start
  sectorRipenPerTurn: 0.10,  // +10pp per stable turn, per sector
  capLandFrac: 1,            // ceiling = (1-f)*fieldCap0 + f*derived — record
                             // world default (AB-② seal 2026-07-11); 0 = the
                             // explicit frozen control
  // -- sudden-death crisis arc (ADR 0035/0036, RULINGS CE-①…⑳). OFF by
  //    default: crisis-off === the sealed pre-crisis record world
  //    (byte-identical). Flip the default only after the CE-⑫ sweep seals
  //    (a future SYNC-DEBT flip, mirroring AB-②). ALL VALUES 가안. Every
  //    dial lives here and nowhere else (single-definition rule). --
  crisis: {
    enabled: false,
    onset: 25,               // CE-④ arc onset (envelope right edge)
    hardEnd: 35,             // CE-④/CE-⑪ Westphalian draw turn
    rate0: 0.05,             // CE-④ base growth: stack += rate(t) × fuel
    rateStep: 0.01,          // CE-④ linear staircase increment / crisis turn
    scarPerOccupation: 0.5,  // CE-⑭.1 usable-damage scar written on capture
    scarPerRaid: 0.15,       // CE-⑭.1 usable-damage scar written on a raid
    refusalBurnPp: 0.10,     // CE-⑥ refused-sector usable loss + scar increment
    rebelEffectiveness: 1 / 3, // CE-⑭.4 rebel combat constant (NOT a quality tier)
    denialCoeff: 1.0,        // CE-⑦/⑭.5 raw rebel mass → gate denial (sweep dial #1)
    secessionN: 2,           // CE-⑥/⑮ consecutive neglected turns → secession
    secessionFrac: 1.0,      // CE-⑮ full rise on secession (buffer variant 0.5)
    suppressScar: 0,         // CE-⑧/⑭.3 σ — leading candidate 0 (spiral replaces it)
    suppressBudgetFrac: 0.5, // bot policy: shield fraction spent on suppression/turn
    // CE-⑬/⑯ per-sector suppression terrain multiplier (가안; mirrors engine
    // D6 terrain family, keyed by sector terrainLayer values)
    terrainDef: { plains: 1.0, mountain: 1.5, river: 1.15, coast: 1.1, steppe: 1.0, desert: 1.2 },
    stage: { s1: 25, s2: 28, s3: 31 }, // CE-⑳ overlay calendar (turn boundaries 가안)
  },
};

const BOT = {
  // archetype policy dials (harness GAAN, not seal candidates)
  archetypes: {
    'conquest-snowball': { attackRatio: 1.7, target: 'weakest', peace: ['recruit', 'fort'], preset: '표준', vassalDemand: false, pushCapital: true, redeclare: 'eager' },
    // holdOut: a refused vassalage demand is not bought off with material
    // peace — the chain-seeker presses to the throne (sealed shape: vs a
    // hardliner the ceiling is standard terms or actual conquest, and
    // this bot's identity is to skip the standard-terms consolation)
    'vassal-chain':      { attackRatio: 1.8, target: 'weakest', peace: ['recruit', 'fort'], preset: '표준', vassalDemand: true, holdOut: true, pushCapital: true, redeclare: 'eager' },
    'free-rider':        { attackRatio: 2.0, target: 'worn',    peace: ['recruit', 'fort'], preset: '최대', vassalDemand: false, pushCapital: false, redeclare: 'patient' },
    'raid-attrition':    { attackRatio: 2.0, target: 'raided',  peace: ['raid', 'recruit'], preset: '관대', vassalDemand: false, pushCapital: false, redeclare: 'patient' },
    'shield-first':      { attackRatio: 1.7, target: 'weakest', peace: ['fort', 'recruit'], preset: '표준', vassalDemand: false, pushCapital: true, redeclare: 'patient' },
    'interior-lines':    { attackRatio: 1.6, target: 'threat',  peace: ['recruit', 'fort'], preset: '표준', vassalDemand: false, pushCapital: true, redeclare: 'eager' },
  },
  wornFrac: 0.55,           // 'worn' target: field below this fraction of cap
  // idle aggression (harness stand-in for the canon pressure engine: fog
  // misreads + ADR 0025 uncertainty duel are what push real actors past
  // pure deterrence arithmetic — bots see true values, so an at-cap realm
  // with nothing left to buy opens a grinding war at a lower ratio)
  idleAggress: { turnsIdle: 4, minRatio: 1.25, capFrac: 0.95 },
  // recovery-dial pass (Option A, 2026-07-07): garrison regen is commit-
  // gated, not a free pulse. A garrison below this fraction of its cap is
  // "shattered" and its repair preempts the archetype peace order this
  // turn (fix the breached wall before forging more spears). Gaan —
  // bounds proof power, sweepable; NOT a seal candidate.
  regenThreshold: 0.8,
  fortLadder: ['none', 'fieldworks', 'walls', 'fortress'],
  stormAt: { fieldworks: 1.0, walls: 1.2, fortress: 1.5, legendary: 1.8, none: 0 },
  siegeCommit: 8, fieldCommit: 14,
  reservePoints: 4,   // FG-⑩ M9 fill: reserveAwaken points → 50% of adjacent stock
                      // (engine then applies ×0.5 marchEffect). HARNESS 가안, swept.
  // war-goal depth: cascade this many sectors before proposing (bigger
  // claim = deeper occupation = longer, bloodier war — the composite the
  // claim rate multiplies only counts what the sword actually reached)
  goalOccupied: { 관대: 2, 표준: 3, 최대: 5 },
};

// ---------------------------------------------------------------- prng
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pickFrom = (rng, arr) => arr[Math.floor(rng() * arr.length)];

// ---------------------------------------------------------------- board
// The sheet-10 authored 5-seat board (viability parity, mass/geometry
// asymmetry: one small-중원 center paying in multi-front exposure; one
// strait-locked hermit seat with the staging buy-back).
function makeBoard() {
  const mk = (name, seatType, field, fieldCap, interior, fronts, exits, extra = {}) => {
    const frontG = {}; const fortAt = {};
    for (const [n, g] of Object.entries(fronts)) { frontG[n] = g; fortAt[n] = extra.fort || 'walls'; }
    const garrisonTotal = Object.values(frontG).reduce((s, g) => s + g, 0)
      + interior * 300 + (extra.capitalGarrison ?? 1200);
    const r = {
      name, seatType, field, fieldCap,
      interior,                       // unoccupied interior sector count
      capitalGarrison: extra.capitalGarrison ?? 1200,
      frontG,                         // border-shield garrison per neighbor
      frontCap: { ...frontG },        // local garrison caps (M12 regen target)
      fortAt,                         // fort grade per front
      exits, staging: false,          // hermit buy-back flag
      usable: 1.0,                    // economy usable fraction (raids burn it)
      pool: 0,                        // set below: ×1.5 initial military (M13)
      recruitBonus: 0,                // indemnity credit, men
      alive: true, vassalOf: null,
      truce: {},                      // name -> turn until which war is barred
      wars: [],                       // war objects this realm participates in
    };
    r.pool = Math.round((field + garrisonTotal) * 1.5);
    return r;
  };
  // Start-state sizing rule (L2 FINDING, 2026-07-05): on the raw sheet-10
  // masses the CENTER trips the sealed check by T2 with two recruit turns
  // and no war — leadership clears each rival individually and the hermit
  // exclusion shrinks the coalition below 1.7 × its shield. Tournament
  // board therefore raises rival caps so that at ALL-CAP state no seat
  // passes leadership without wearing or vassalizing someone (map
  // authoring owes this as a sizing constraint; goes to the user).
  return [
    mk('중원', 'center',  7000, 9000, 6, { 서령: 600, 동평: 600, 남곡: 600 }, [{ cap: Infinity }, { cap: Infinity }, { cap: Infinity }], { fort: 'fortress', capitalGarrison: 1500 }),
    mk('서령', 'flank',   5000, 7000, 4, { 남곡: 300, 중원: 600 }, [{ cap: Infinity }]),
    mk('동평', 'flank',   5000, 7000, 4, { 중원: 600, 북하: 600 }, [{ cap: Infinity }]),
    mk('남곡', 'small',   2500, 5000, 3, { 서령: 300, 중원: 300 }, [{ cap: Infinity }]),
    mk('북하', 'hermit',  5000, 6000, 4, { 동평: 800 }, [{ cap: 500 }]),
  ];
}

// realm-level sectorYield (cradle boards: real sector economy ledger)
// overrides the flat fixture-world sector value
const realmValue = (r, H) => r.interior * (r.sectorYield ?? H.sectorValue) + H.capitalValue;
const yieldReach = (r, H) => Math.round(r.interior * (r.sectorYield ?? H.sectorValue) * r.usable * 10) / 10;
const totalGarrisons = (r) => Object.values(r.frontG).reduce((s, g) => s + g, 0)
  + r.interior * 300 + r.capitalGarrison;
// total living bodies: serving (field + garrisons) + reserve (pool). Blood is
// permanent — only death shrinks it — so this is the exhaustion denominator.
const bodiesOf = (r) => r.field + totalGarrisons(r) + r.pool;
// direction-free defensive mass for the ending panel's shieldShare.
const shieldOf = (r) => r.field + Object.values(r.frontG).reduce((s, g) => s + g, 0);

// ---------------------------------------------------------------- crisis
// CE-④ linear staircase: growth rate per crisis turn = rate0 + step×(t−onset).
function crisisRate(t, C) {
  return C.rate0 + C.rateStep * Math.max(0, t - C.onset);
}

// CE-⑭.1 scar ledger: per-sector cumulative usable damage. Never decays
// ("the land remembers"); persists on the sector object, so it is inherited
// on conquest for free (CE-④/CE-⑮). Written only during a crisis-enabled
// match; a no-op ledger read (?? 0) everywhere else.
function addScar(sector, amount) { sector.scar = (sector.scar ?? 0) + amount; }

// A sector's terrain layer (uniform per sector; sectorSpec assigns one
// terr to all its map units). Fallback plains.
function terrainOf(sector) { return sector.mapUnits && sector.mapUnits[0]
  ? sector.mapUnits[0].terrainLayer : 'plains'; }

// ---- occupation geography (stage ①, design 2026-07-10) ----
// Governing principle: geography defines the set of what is possible;
// judgment chooses within it. The frontier (adjacency) is the invariant
// set; the score picks inside it. All bots share this rule (world rule).
const sectorMode = (r) => !!(r.world && r.holds);
const heldSectors = (r) => [...r.holds].map((id) => r.world.sectors.get(id));

// interior mirror: held sectors that are not start-seat border sectors.
function syncCounts(r) {
  if (!sectorMode(r)) return;
  r.interior = [...r.holds].filter((id) => !r.world.borderIds.has(id)).length;
}

// CE-⑭.1 fuel: a sector's uprising fuel = its scar × the owner's mobilization
// intensity (realm-level intensity spread uniformly over held sectors — the
// sealed L2 approximation, CE-③). A land neither damaged nor mobilized never
// rises; resting inherited scarred land keeps it quiet (demobilize = cooling).
function sectorFuel(sector, intensityVal) { return (sector.scar ?? 0) * intensityVal; }

// CE-⑭.2 rebel cap = the sector's register share = realm register × (sector
// pop ÷ realm held pop). The whole populace can rise at 3× the density a
// state sustains as standing forces (rebels pay no maintenance).
function sectorRegisterShare(sector, realm, popTotal) {
  return popTotal > 0 ? realm.pool * (sector.populationValue / popTotal) : 0;
}

// CE-④/⑧ soil-and-crop growth: each crisis turn, every held sector's rebel
// stack grows by rate(t) × fuel, capped at its register share. Deterministic.
function growRebels(realm, t, H) {
  if (!sectorMode(realm)) return;
  const C = H.crisis;
  const iv = intensity(realm);
  const rate = crisisRate(t, C);
  const secs = heldSectors(realm);
  const popTotal = secs.reduce((s, x) => s + x.populationValue, 0);
  for (const s of secs) {
    const grow = rate * sectorFuel(s, iv);
    if (grow <= 0) continue;
    const cap = sectorRegisterShare(s, realm, popTotal);
    s.rebelStack = Math.min((s.rebelStack ?? 0) + grow, cap);
  }
}

// CE-⑬ suppression = pure attrition through the shared casualty curve (D11),
// NO threshold and NO stamps (success/repulse would be a false binary on
// attrition work). R = suppressor power ÷ rebel defense, where rebel defense =
// stack × ⅓ (rebel combat constant, CE-⑭.4) × terrain (the invariant
// multiplier that shelters the guerrilla, CE-⑬). Both sides bleed off the
// same curve; rebel deaths are permanent register loss (applied by the caller,
// CE-⑭.3). Deterministic.
function suppressAttrition(suppressPower, rebelStack, terrainMult, C) {
  if (rebelStack <= 0 || suppressPower <= 0) return { rebelDead: 0, suppressorDead: 0 };
  const rebelDef = rebelStack * C.rebelEffectiveness * terrainMult;
  const R = suppressPower / Math.max(1, rebelDef);
  const base = DIALS.casualtyBase, exp = DIALS.casualtyExp;
  const fracRebel = Math.min(1, base * Math.pow(R, exp));      // rebels lose more as R grows
  const fracSupp = Math.min(1, base / Math.pow(R, exp));       // suppressor loses more near parity
  return {
    rebelDead: Math.min(rebelStack, rebelStack * fracRebel),
    suppressorDead: suppressPower * fracSupp,
  };
}

// frontier = defender-held sectors adjacent to (this war's occupied set ∪
// the front's border sectors). Fallbacks (inherited fronts with no authored
// border ids): any D-held sector adjacent to an A-held one; then all holds.
function occupationFrontier(war, A, D) {
  const w = D.world; const out = new Set();
  const frontIds = (D.frontSectorIds && D.frontSectorIds[war.att]) || [];
  for (const id of frontIds) if (D.holds.has(id)) out.add(id);
  for (const id of war.occupiedIds ?? [])
    for (const n of w.adj.get(id) ?? []) if (D.holds.has(n)) out.add(n);
  if (!out.size && sectorMode(A))
    for (const id of D.holds)
      if ([...w.adj.get(id)].some((n) => A.holds.has(n))) out.add(id);
  if (!out.size) for (const id of D.holds) out.add(id);
  return out;
}

// score = value ÷ resistance. Resistance 3 (border) : 1 (interior) is a 가안
// ordering proxy mirroring the garrison start-state (900:300) — it never
// enters resolve(); combat difficulty is carried by real stocks elsewhere.
// Hook: replace with real per-sector defense when sector garrisons/forts
// land. Hook: attacker's read of value/resistance is truth for now — fog
// estimate consumption is a reserved seat.
function captureSector(war, A, D, H) {
  if (!sectorMode(D)) { war.occupied += 1; return; } // legacy fixture path
  const w = D.world;
  const cand = [...occupationFrontier(war, A, D)];
  if (!cand.length) return;
  const score = (id) => { const s = w.sectors.get(id);
    return (s.populationValue + s.economyValue) / (w.borderIds.has(id) ? 3 : 1); };
  cand.sort((a, b) => score(b) - score(a) || (a < b ? -1 : 1));
  const id = cand[0];
  D.holds.delete(id);
  (war.occupiedIds ??= []).push(id);
  war.occupied = war.occupiedIds.length;
  syncCounts(D);
  if (H && H.crisis && H.crisis.enabled) addScar(D.world.sectors.get(id), H.crisis.scarPerOccupation);
}

// any acquired sector integrates from the ADR 0022 usable floor — uniform
// across channels (cession, elimination share): undamaged, but lagged.
function acquireSector(r, id, H = HARNESS) {
  const s = r.world.sectors.get(id);
  s.usableEconomy = Math.min(s.usableEconomy, H.usableEconomyStart);
  s.usablePop = Math.min(s.usablePop, H.usablePopStart);
  r.holds.add(id);
  syncCounts(r);
}

// stall / white peace: occupied sectors return to the defender unchanged.
function returnOccupied(war, D) {
  if (!sectorMode(D)) { D.interior += war.occupied; return; }
  for (const id of war.occupiedIds) D.holds.add(id);
  war.occupiedIds = [];
  war.occupied = 0;
  syncCounts(D);
}

// adapt a realm to match.js's hegemonyCheck shape
function checkView(realms) {
  return realms.map((r) => ({
    name: r.name, alive: r.alive, vassalOf: r.vassalOf,
    field: r.field, fieldCap: r.fieldCap,
    garrisons: totalGarrisons(r),
    fronts: r.frontG,
    // affordability bound inputs (grill 2026-07-11): finite on map boards
    // (Option B treasury/income); NaN/undefined on fixtures → legacy path.
    treasury: r.treasury, income: realmIncome(r),
    pool: r.pool, serving: servingBodies(r),
    exits: r.staging ? r.exits.map((e) => ({ cap: e.cap === Infinity ? Infinity : e.cap * 2 })) : r.exits,
  }));
}

// ---------------------------------------------------------------- wars
// Coarse war machine mirroring sheet 7's stages:
// siege (border fort) → field (decisive) → cascade (interior) → capital.
function newWar(att, def, turn) {
  return {
    att: att.name, def: def.name, start: turn,
    stage: 'siege', stamps: 0, starve: 0,
    occupied: 0, occupiedIds: [],  // sectors taken (count mirror + identities)
    raided: 0,                     // loot extracted (yield)
    stalled: 0, margin: null,      // decisive | grinding | marginal
    proposalStep: 0,               // winner's concession ladder position
    log: [],
  };
}

// L2 terrain fidelity (seal 2026-07-08): map the border's authored crossing
// class to the engine combat spec. terrain M5/D6, water ADR-0015 + ruling ⑦.
// The door throttles the assaulting body — the frontage half of the pass-2.0
// package (research/terrain-fort-ladder-validation.md). Fallback = legacy hills.
function combatFromBorderClass(cls, door = Infinity) {
  switch (cls) {
    case 'open':   return { terrain: 'plains', chokeCap: door };
    case 'forest': return { terrain: 'forest', chokeCap: door };
    case 'hills':  return { terrain: 'hills', chokeCap: door };
    case 'pass':   return { terrain: 'pass', chokeCap: door };
    case 'river':  return { terrain: 'plains', water: 'riverOpposed', chokeCap: door };
    case 'strait': return { terrain: 'plains', water: 'straitOpposed', chokeCap: door };
    default:       return { terrain: 'hills', chokeCap: door };
  }
}

// ---------------------------------------------------------------- plan AI
// Tactical plan AI wiring (docs/features/tactical-plan-ai/, sealed
// 2026-07-08). A realm may carry `brain: { kind: 'ladder'|'random',
// confidence, disposition }`; absent brain = the unchanged script bot.
const PLAN_AI = require('./plan-ai.js');

// Stable per-(war, front) band seed — the fog seal's "no flicker" rule:
// the same war reads the same band position all war long.
function warBandSeed(war, front) {
  let h = (war.bandSeed || 0) >>> 0;
  const s = `${war.att}|${war.def}|${front}`;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 2654435761) >>> 0;
  return h;
}

// M12 starvation ladder from successful supply cuts (harness 가안: one SI
// success ≈ one turn under a maintained cut; stage2Turn 3 / stage3Turn 5).
function siStage(starve) {
  if (!starve) return 0;
  if (starve >= DIALS.pulse.starvation.stage3Turn) return 3;
  if (starve >= DIALS.pulse.starvation.stage2Turn) return 2;
  return 1;
}

function pickPlan(A, war, front, spec, opts) {
  if (A.brain.kind === 'random') {
    const rng = (opts && opts.rng)
      || mulberry32(warBandSeed(war, front) + (war.planLog ? war.planLog.length : 0));
    return PLAN_AI.choosePlan(spec, { random: rng });
  }
  return PLAN_AI.choosePlan(spec, {
    confidence: A.brain.confidence,
    disposition: A.brain.disposition || 0,
    seed: warBandSeed(war, front),
  });
}

function logPlan(war, stage, pick, r, stats) {
  (war.planLog || (war.planLog = [])).push({
    stage, plan: pick.plan, eligible: pick.eligible, rung: pick.rung,
    judgedStock: pick.judgedStock, judgedR: pick.judgedR,
    forced: pick.forced || false, actualR: r.R, success: r.success,
  });
  if (stats) {
    stats.brained++;
    stats.picks[pick.plan] = (stats.picks[pick.plan] || 0) + 1;
    if (pick.forced) stats.forced++;
    // misjudgment: predicted success (not forced), reality said no
    if (!pick.forced && pick.judgedR !== null && !r.success) stats.misjudged++;
  }
}

// Success semantics by plan family (harness 가안): assault-family success
// advances the war machine; DP erodes; SI starves; Raid bleeds/loots
// without occupying (raids never take ground).
function advanceOnSuccess(war, r, plan) {
  if (plan === 'DP') { war.stamps += r.margin >= DIALS.dpErosion.deepMargin ? 2 : 1; return false; }
  if (plan === 'SI') { war.starve = (war.starve || 0) + 1; return false; }
  if (plan === 'Raid') { war.raided += 1; return false; }
  return true; // Swift / Crossing / Flanking / Encirclement take the ground
}

function warBattle(war, A, D, opts = {}) {
  const H = opts.H ?? HARNESS;
  // Defender field availability: the field army serves ONE war — the
  // defensive war with the biggest enemy (interior lines); other fronts
  // get a screening detachment (spec gap: two-front army allocation is
  // undocumented — ADR 0025 thinness; harness rule below).
  const front = D.frontG[A.name] !== undefined ? A.name : Object.keys(D.frontG)[0];
  const defField = opts.screen ? Math.round(D.field * 0.2) : D.field;

  // strait wars (either side a hermit seat): 명량 grammar — opposed-water
  // penalty + choke on the engaged body until the invader is ashore
  const strait = (A.seatType === 'hermit' || D.seatType === 'hermit');
  const crossing = strait && (war.stage === 'siege' || war.stage === 'field')
    ? { water: 'straitOpposed', chokeCap: 500 } : {};

  if (war.stage === 'siege') {
    const fort = D.fortAt[front] ?? 'walls';
    const fortBase = DIALS.fort[fort];
    const fortNow = Math.max(1, fortBase - war.stamps * DIALS.erosionStep);
    const g = D.frontG[front];
    // fidelity: read the front's authored crossing class (terrain/water/choke);
    // legacy fixture boards without frontClass keep the hardcoded hills + hermit
    // strait crossing.
    const site = (D.frontClass && D.frontClass[front])
      ? { ...combatFromBorderClass(D.frontClass[front], D.frontDoor[front]), fort, erosionStamps: war.stamps }
      : { terrain: 'hills', fort, erosionStamps: war.stamps, ...crossing };
    if (A.brain) {
      const spec = { attacker: { stock: A.field, commit: BOT.siegeCommit },
        defender: { stock: g, commit: BOT.siegeCommit, starvationStage: siStage(war.starve),
          reserveStock: m9Fill(D, front) },
        ...site, defenderIsolated: D.field < 400 }; // no relief army → cut off
      const pick = pickPlan(A, war, front, spec, opts);
      const r = resolve({ ...spec, plan: pick.plan });
      logPlan(war, 'siege', pick, r, opts.planStats);
      applyBlood(A, D, r, front);
      if (r.success && advanceOnSuccess(war, r, pick.plan)) {
        war.stage = 'field'; captureSector(war, A, D, H); D.interior = Math.max(0, D.interior);
      } else if (!r.success && r.R < 1.1) war.stalled++;
      if (r.routed === 'defender') war.stage = 'field'; // garrison routs out of the works
      return r;
    }
    if (fortNow <= (BOT.stormAt[fort] ?? 1.2) + 1e-9) {
      const r = resolve({ plan: 'Swift', attacker: { stock: A.field, commit: BOT.siegeCommit },
        defender: { stock: g, commit: BOT.siegeCommit, reserveStock: m9Fill(D, front) }, ...site });
      applyBlood(A, D, r, front);
      if (r.success) { war.stage = 'field'; captureSector(war, A, D, H); D.interior = Math.max(0, D.interior); }
      else if (r.R < 1.1) war.stalled++;
      return r;
    }
    const r = resolve({ plan: 'DP', attacker: { stock: A.field, commit: BOT.siegeCommit },
      defender: { stock: g, commit: BOT.siegeCommit, reserveStock: m9Fill(D, front) }, ...site });
    applyBlood(A, D, r, front);
    if (r.success) war.stamps += r.margin >= DIALS.dpErosion.deepMargin ? 2 : 1;
    else if (r.R < 1.1) war.stalled++;
    if (r.routed === 'defender') war.stage = 'field'; // garrison routs out of the works
    return r;
  }

  if (war.stage === 'field') {
    // a beaten SCREEN is never a decisive victory — the main army lives
    const routMargin = (fracA) => opts.screen ? 'grinding' : (fracA < 0.10 ? 'decisive' : 'grinding');
    if (defField < 400) { war.stage = 'cascade'; war.margin = war.margin ?? routMargin(0); return null; }
    if (A.brain) {
      const spec = { attacker: { stock: A.field, commit: BOT.fieldCommit },
        defender: { stock: defField, commit: BOT.fieldCommit },
        terrain: 'plains', ...crossing };
      const pick = pickPlan(A, war, front, spec, opts);
      const r = resolve({ ...spec, plan: pick.plan });
      logPlan(war, 'field', pick, r, opts.planStats);
      A.field = Math.max(0, r.stockAfterA); poolBleed(A, r.lossA);
      D.field = Math.max(0, D.field - (defField - Math.max(0, r.stockAfterB))); poolBleed(D, r.lossB);
      if (r.routed === 'defender') {
        war.stage = 'cascade';
        war.margin = routMargin(r.fracA);
      } else if (!r.success && r.R < 1.2) {
        war.stalled++; war.margin = 'marginal';
      } else if (r.success && advanceOnSuccess(war, r, pick.plan)) war.margin = war.margin ?? 'grinding';
      return r;
    }
    const r = resolve({ plan: 'Swift', attacker: { stock: A.field, commit: BOT.fieldCommit },
      defender: { stock: defField, commit: BOT.fieldCommit }, terrain: 'plains', ...crossing });
    A.field = Math.max(0, r.stockAfterA); poolBleed(A, r.lossA);
    D.field = Math.max(0, D.field - (defField - Math.max(0, r.stockAfterB))); poolBleed(D, r.lossB);
    if (r.routed === 'defender') {
      war.stage = 'cascade';
      war.margin = routMargin(r.fracA);
    } else if (!r.success && r.R < 1.2) {
      war.stalled++; war.margin = 'marginal';
    } else if (r.success) war.margin = war.margin ?? 'grinding';
    return r;
  }

  if (war.stage === 'cascade') {
    const landGone = sectorMode(D) ? D.holds.size === 0 : D.interior <= 0;
    if (landGone) { war.stage = 'capital'; return null; }
    if (A.brain) {
      const spec = { attacker: { stock: A.field, commit: BOT.siegeCommit },
        defender: { stock: 500, commit: 0 }, terrain: 'plains',
        defenderIsolated: D.field < 400 };
      const pick = pickPlan(A, war, front, spec, opts);
      const r = resolve({ ...spec, plan: pick.plan });
      logPlan(war, 'cascade', pick, r, opts.planStats);
      A.field = Math.max(0, r.stockAfterA); poolBleed(A, r.lossA);
      if (r.success && advanceOnSuccess(war, r, pick.plan)) {
        captureSector(war, A, D, H);
        if (!sectorMode(D)) D.interior = Math.max(0, D.interior - 1);
      }
      return r;
    }
    const r = resolve({ plan: 'Swift', attacker: { stock: A.field, commit: BOT.siegeCommit },
      defender: { stock: 500, commit: 0 }, terrain: 'plains' });
    A.field = Math.max(0, r.stockAfterA); poolBleed(A, r.lossA);
    if (r.success) {
      captureSector(war, A, D, H);
      if (!sectorMode(D)) D.interior = Math.max(0, D.interior - 1);
    }
    return r;
  }

  if (war.stage === 'capital') {
    const site = { terrain: 'plains', fort: 'walls', erosionStamps: war.stamps };
    const fortNow = Math.max(1, DIALS.fort.walls - war.stamps * DIALS.erosionStep);
    if (A.brain) {
      const spec = { attacker: { stock: A.field, commit: BOT.fieldCommit },
        defender: { stock: D.capitalGarrison, commit: BOT.fieldCommit, starvationStage: siStage(war.starve) },
        ...site, defenderIsolated: D.field < 400 };
      const pick = pickPlan(A, war, front, spec, opts);
      const r = resolve({ ...spec, plan: pick.plan });
      logPlan(war, 'capital', pick, r, opts.planStats);
      A.field = Math.max(0, r.stockAfterA); poolBleed(A, r.lossA);
      D.capitalGarrison = Math.max(0, r.stockAfterB); poolBleed(D, r.lossB);
      if (r.success && advanceOnSuccess(war, r, pick.plan)) war.stage = 'fallen';
      if (r.routed === 'defender') war.stage = 'fallen';
      return r;
    }
    if (fortNow <= 1.2 + 1e-9) {
      const r = resolve({ plan: 'Swift', attacker: { stock: A.field, commit: BOT.fieldCommit },
        defender: { stock: D.capitalGarrison, commit: BOT.fieldCommit }, ...site });
      A.field = Math.max(0, r.stockAfterA); poolBleed(A, r.lossA);
      D.capitalGarrison = Math.max(0, r.stockAfterB); poolBleed(D, r.lossB);
      if (r.success) war.stage = 'fallen';
      return r;
    }
    const r = resolve({ plan: 'DP', attacker: { stock: A.field, commit: BOT.siegeCommit },
      defender: { stock: D.capitalGarrison, commit: BOT.fieldCommit }, ...site });
    A.field = Math.max(0, r.stockAfterA); poolBleed(A, r.lossA);
    D.capitalGarrison = Math.max(0, r.stockAfterB); poolBleed(D, r.lossB);
    if (r.success) war.stamps += r.margin >= DIALS.dpErosion.deepMargin ? 2 : 1;
    if (r.routed === 'defender') { D.capitalGarrison = Math.max(0, r.stockAfterB); war.stage = 'fallen'; }
    return r;
  }
  return null;
}

function applyBlood(A, D, r, front) {
  A.field = Math.max(0, r.stockAfterA); poolBleed(A, r.lossA);
  D.frontG[front] = Math.max(0, r.stockAfterB); poolBleed(D, r.lossB);
}
function poolBleed(r, dead) { r.pool = Math.max(0, r.pool - dead); }

// FG-⑩ M9 tactical fill: route-connected stock rushes the attacked front.
// The L2 board has no per-sector routing, so "province stock" is abstracted
// as the realm's OTHER fronts' garrison + interior garrison. Engine applies
// the ×0.5 march penalty; this returns the awakened body count.
function m9Fill(D, front) {
  if (!D.m9Reserve) return 0;
  const others = Object.entries(D.frontG)
    .reduce((s, [n, g]) => s + (n === front ? 0 : g), 0);
  return reserveAwaken(others + (D.interiorGarrison ?? 0), BOT.reservePoints);
}

// FG-⑤ standing-defense power of a front (garrison × terrain × fort), used
// to score deficits. No commit/reserve/erosion — the raw first-blow wall.
function frontDefense(D, front) {
  const cls = (D.frontClass && D.frontClass[front]) || 'hills';
  const terr = DIALS.terrain[combatFromBorderClass(cls).terrain] ?? 1;
  const fort = DIALS.fort[(D.fortAt && D.fortAt[front]) || 'walls'];
  return (D.frontG[front] ?? 0) * terr * fort;
}

// FG-⑦ attacker's read of a neighbour's FACING front: judged first-blow
// defense = judged garrison(λ) × public terrain × public fort. Field army
// excluded (arrives a beat later). λ from disposition; harness bots see true
// values, so the band centre is the garrison itself (disposition sweep in the
// battery widens/shifts it). Reuses frontDefense's terrain×fort read.
function frontSoftness(me, t) {
  const front = me.name;
  const lambda = (me.brain && me.brain.disposition) || 0;
  const g = t.frontG[front] ?? 0;
  const judgedG = Math.max(0, g * (1 - 0.25 * lambda)); // optimist (+) reads weaker
  return frontDefense({ ...t, frontG: { ...t.frontG, [front]: judgedG } }, front);
}

// FG-⑥ field-army destination: the one mobile army serves the defensive war
// whose front has the largest deficit (attacker field − standing defense).
// Whole-realm value ⇒ deficit alone decides (fight-or-fold is elsewhere).
function pickMainDefWar(realm, wars, realms) {
  let best = null, bestDef = -Infinity;
  for (const w of wars) {
    const att = realms.find((r) => r.name === w.att);
    const front = realm.frontG[w.att] !== undefined ? w.att : Object.keys(realm.frontG)[0];
    const deficit = (att ? att.field : 0) - frontDefense(realm, front);
    if (deficit > bestDef) { bestDef = deficit; best = w; }
  }
  return best;
}

// ---------------------------------------------------------------- settlement
// Winner proposes down a concession ladder (preferred → more lenient);
// vassalage demand first if the policy calls for it and the capital is
// in reach. Loser evaluates via the sealed 수락 산술.
function warEndState(war, D, H) {
  return {
    occValue: war.occupied * H.sectorValue,
    raidLoot: yieldReach(D, H),
    capitalInReach: war.stage === 'capital' || war.stage === 'fallen'
      || (war.stage === 'cascade' && D.field < 400),
    margin: war.margin ?? 'marginal',
  };
}

function trySettle(war, A, D, H, record) {
  const pol = BOT.archetypes[A.archetype];
  if (war.stage === 'siege' || war.stage === 'field') return null;
  // war-goal depth: keep cascading until the preferred claim is backed by
  // occupied ground (or the loser has nothing left / the capital is under
  // the sword) — the claim rate multiplies only what the sword reached.
  const deepEnough = war.occupied >= (BOT.goalOccupied[pol.preset] ?? 3)
    || (sectorMode(D) ? D.holds.size === 0 : D.interior <= 0) || war.stage === 'capital' || war.stage === 'fallen';
  if (!deepEnough) return null;
  const st = warEndState(war, D, H);
  const L = expectedContinuedLoss(st, MATCH_DIALS);
  const coeff = MATCH_DIALS.temperament[D.temperament];
  const vassalBundle = () => presetBundle('표준', st, MATCH_DIALS).value
    + H.vassalPremium * realmValue(D, H);

  // 1) chain-seeker demands vassalage FIRST when the throne is in reach
  if (pol.vassalDemand && st.capitalInReach && !D.vassalOf) {
    record.vassalOffers++;
    if (accepts(vassalBundle(), L.total, coeff)) return { kind: 'vassalage', preset: '표준', st };
    if (pol.holdOut) return null; // no material consolation — press the throne
  }
  // 2) preset ladder from preferred downward, one concession per turn
  const ladder = ['최대', '표준', '관대'];
  const from = Math.max(ladder.indexOf(pol.preset), 0) + war.proposalStep;
  for (let i = from; i < ladder.length; i++) {
    const b = presetBundle(ladder[i], st, MATCH_DIALS);
    record.presetOffers.push({ preset: ladder[i], margin: st.margin, capital: st.capitalInReach });
    if (accepts(b.value, L.total, coeff)) return { kind: 'preset', preset: ladder[i], st, bundle: b };
    war.proposalStep = i - Math.max(ladder.indexOf(pol.preset), 0) + 1;
    return null; // one offer per turn; concede next turn
  }
  // 3) ladder exhausted at the capital: any storm-willing archetype offers
  //    vassalage before paying the storm's blood (universal option, not
  //    only the chain-seeker's — kneeling beats a throne-storming bill)
  if (pol.pushCapital && st.capitalInReach && !D.vassalOf && !pol.vassalDemand) {
    record.vassalOffers++;
    if (accepts(vassalBundle(), L.total, coeff)) return { kind: 'vassalage', preset: '표준', st };
  }
  return null;
}

function applySettlement(kind, preset, war, A, D, H, realms) {
  const st = warEndState(war, D, H);
  const b = presetBundle(preset, st, MATCH_DIALS);
  let ceded;
  if (sectorMode(D)) {
    // cession at sector identity: value desc + connectivity to winner land.
    const ids = war.occupiedIds ?? [];
    const cededN = Math.min(ids.length, Math.round(b.cession / H.sectorValue));
    const w = D.world;
    const val = (id) => { const s = w.sectors.get(id);
      return s.populationValue + s.economyValue; };
    const ranked = [...ids].sort((x, y) => val(y) - val(x) || (x < y ? -1 : 1));
    const chosen = [];
    while (chosen.length < cededN) {
      const next = ranked.find((id) => !chosen.includes(id)
          && [...w.adj.get(id)].some((n) => A.holds.has(n) || chosen.includes(n)))
        ?? ranked.find((id) => !chosen.includes(id)); // fallback keeps the count honest
      if (!next) break;
      chosen.push(next);
    }
    const transferredPop = chosen.reduce((s, id) => s + w.sectors.get(id).populationValue, 0);
    for (const id of chosen) acquireSector(A, id, H);
    for (const id of ids) if (!chosen.includes(id)) D.holds.add(id); // return remainder
    war.occupiedIds = []; war.occupied = 0;
    syncCounts(A); syncCounts(D);
    // register travels with the actually-transferred population share
    const dPop = heldSectors(D).reduce((s, x) => s + x.populationValue, 0);
    const poolShare = Math.round(D.pool * (transferredPop / Math.max(1, dPop + transferredPop)));
    D.pool -= poolShare; A.pool += poolShare;
    ceded = chosen.length;
  } else {
    // legacy fixture path (verbatim; §5 growth lines retired in occupation
    // geography Task 5 — only the original interior/pool arithmetic remains)
    ceded = Math.min(war.occupied, Math.round(b.cession / H.sectorValue));
    A.interior += ceded;
    D.interior = Math.max(0, D.interior);
    const poolShare = Math.round(D.pool * (ceded / Math.max(1, D.interior + ceded + 2)));
    D.pool -= poolShare; A.pool += poolShare;
    D.interior += Math.max(0, war.occupied - ceded);
  }
  // indemnity: one-time recruit credit (부대 = 0.5 yield)
  A.recruitBonus += Math.round(b.indemnity * H.indemnityMenPerYield);
  if (kind === 'vassalage') {
    D.vassalOf = A.name;
    releaseVassalsOf(D, realms); // a falling overlord releases its own chain
  }
  // hollow gate matches trySettle's deepEnough: in sector mode "punched
  // through" means no land left, not interior 0 (hex-derived borders make
  // small realms start near interior 0 while fully landed).
  const hollow = sectorMode(D) ? D.holds.size === 0 : D.interior <= 0;
  if (ceded >= 2 || hollow) inheritFronts(A, D, realms);
  endWar(war, A, D, H);
  return { ceded, indemnity: b.indemnity };
}

function releaseVassalsOf(fallen, realms) {
  for (const r of realms) if (r.vassalOf === fallen.name) r.vassalOf = null;
}

// Minimal front redraw (ruling ⑨: control changes redraw the fronts —
// conquest inherits exposure). When A takes a big bite of D (≥2 sectors,
// D emptied, or D eliminated), A inherits fronts with D's other
// neighbors, reciprocally, at a thin new-border garrison.
function inheritFronts(A, D, realms) {
  for (const n of Object.keys(D.frontG)) {
    if (n === A.name) continue;
    const nr = realms.find((r) => r.name === n);
    if (!nr || !nr.alive) continue;
    if (A.frontG[n] === undefined) { A.frontG[n] = 150; A.frontCap[n] = 300; A.fortAt[n] = 'fieldworks'; }
    if (nr.frontG[A.name] === undefined) { nr.frontG[A.name] = 150; nr.frontCap[A.name] = 300; nr.fortAt[A.name] = 'fieldworks'; }
  }
}

function endWar(war, A, D, H) {
  war.stage = 'over';
  A.wars = A.wars.filter((w) => w !== war);
  D.wars = D.wars.filter((w) => w !== war);
  A.truce[D.name] = D.truce[A.name] = (war.endTurn ?? 0) + H.truceTurns;
  A.lastWarEnd = D.lastWarEnd = war.endTurn ?? 0;
}

function eliminate(D, A, realms, H, war) {
  D.alive = false;
  inheritFronts(A, D, realms);
  releaseVassalsOf(D, realms);
  if (sectorMode(D)) {
    // possessor keeps: every war's bites go to that war's attacker;
    // the unoccupied remainder (incl. the capital's land) to the eliminator.
    // D can appear on either side of a war it's party to, so each war is
    // handled on whichever side D sits: as defender (its bites belong to
    // that war's attacker), or as attacker (D's own bites into someone
    // else's territory — D's death forces a white peace on those).
    for (const wv of D.wars) {
      if (wv.def === D.name && (wv.occupiedIds ?? []).length) {
        const att = realms.find((r) => r.name === wv.att);
        if (att && att.alive) {
          for (const id of wv.occupiedIds) acquireSector(att, id, H);
        } else {
          // dead/missing third-party attacker: its bite has nowhere to sit —
          // fold it back into D's own holds so it flows to the eliminator
          // via the remainder sweep below, instead of being discarded.
          for (const id of wv.occupiedIds) D.holds.add(id);
          syncCounts(D);
        }
        wv.occupiedIds = []; wv.occupied = 0;
      } else if (wv.att === D.name && (wv.occupiedIds ?? []).length) {
        const defender = realms.find((r) => r.name === wv.def);
        if (defender && defender.alive) {
          // forced white peace: D's death ends its own wars too — return
          // the bites it took, id-exact, no damage (returnOccupied already
          // encodes that semantics for stall/white-peace returns).
          returnOccupied(wv, defender);
        } else {
          // defender missing/dead shouldn't normally happen here (its own
          // elimination would already have emptied these ids) — fold into
          // D.holds rather than silently discard; flows to A below.
          for (const id of wv.occupiedIds) D.holds.add(id);
          wv.occupiedIds = []; wv.occupied = 0;
          syncCounts(D);
        }
      }
    }
    for (const id of [...D.holds]) acquireSector(A, id, H);
    D.holds.clear(); syncCounts(D);
    A.pool += Math.round(D.pool * 0.5);
    // No cap grant here: the retired §5 accumulator's cap-without-land
    // asymmetry dissolves in sector mode, because land travels with the
    // ceiling basis (each acquireSector reset IS the land transfer, unlike
    // the legacy path where the land already evaporated before this point).
    // The ceiling derivation for this path is the pulse's capLandFrac
    // blend, not an elimination-time grant.
  } else {
    A.interior += D.interior; A.pool += Math.round(D.pool * 0.5);
  }
  D.interior = 0; D.field = 0;
  for (const w of [...D.wars]) { w.stage = 'over'; }
  D.wars = [];
}

// ---------------------------------------------------------------- policy
// own fronts + vassals' fronts (ruling ⑨: vassalage widens the shared
// front — the overlord projects through the vassal's borders)
function adjacentNames(r, realms) {
  const names = new Set(Object.keys(r.frontG));
  for (const v of realms.filter((x) => x.alive && x.vassalOf === r.name))
    for (const n of Object.keys(v.frontG)) names.add(n);
  names.delete(r.name);
  return [...names];
}

function pickTarget(me, realms, rng, H = HARNESS) {
  const pol = BOT.archetypes[me.archetype];
  const now = me._turn;
  const cands = adjacentNames(me, realms)
    .map((n) => realms.find((x) => x.name === n))
    .filter((t) => t && t.alive && !t.vassalOf && t.name !== me.vassalOf
      && t.interior > 0 // a rump with nothing left to take is not a war goal
      && (me.truce[t.name] ?? 0) < now && t.wars.every((w) => w.att !== me.name));
  if (!cands.length) return null;
  // opportunism: a field army pinned in another war leaves only a screen
  // + the facing garrison at this border — the two-front window every
  // archetype reads (this is what moves a parity board past deterrence)
  const engaged = (t) => t.wars.length > 0;
  const shield = (t) => (engaged(t) ? Math.round(t.field * 0.2) : t.field) + (t.frontG[me.name] ?? 0);
  // FG-⑦: on force-geography boards, rank by the judged FACING-front defense
  // (garrison×terrain×fort, field army excluded) instead of the raw shield
  // read. Non-FG boards (me.forceGeo falsy) collapse `soft` to the exact
  // `shield` expression — byte-identical ranking, untouched by this change.
  const soft = (t) => me.forceGeo ? frontSoftness(me, t) : shield(t);
  // pile-on probe (HARNESS 가안, sheet-15 freeze autopsy follow-up):
  // a strengthened opportunism read — a neighbor below woundedFrac of
  // cap is a WINDOW (strike before healing closes it), window targets
  // rank first, and the required ratio gets ratioRelief. Bot-policy
  // fidelity lever only; never a game rule.
  const window_ = (t) => engaged(t)
    || (H.pileOn ? t.field < t.fieldCap * H.pileOn.woundedFrac : false);
  let pool = cands;
  if (pol.target === 'worn') pool = cands.filter((t) => t.field < t.fieldCap * BOT.wornFrac || window_(t));
  if (pol.target === 'raided') pool = cands.filter((t) => t.usable < 0.9 || window_(t));
  if (pol.target === 'threat') {
    // defeat-in-detail: the weakest of the realms currently strongest vs me
    pool = cands;
  }
  if (H.pileOn) pool = pool.length ? pool : cands.filter(window_);
  if (!pool.length) return null;
  pool = [...pool].sort((a, b) =>
    (H.pileOn ? (window_(b) ? 1 : 0) - (window_(a) ? 1 : 0) : 0) || soft(a) - soft(b));
  const t = pool[0];
  const ratio = me.field / Math.max(1, soft(t));
  // one offensive war at a time
  if (me.wars.some((w) => w.att === me.name)) return null;
  if (pol.redeclare === 'patient' && me.wars.length) return null;
  const needed = pol.attackRatio * (H.pileOn && window_(t) ? H.pileOn.ratioRelief : 1);
  if (ratio >= needed) return t;
  // idle aggression: at cap, nothing to build, no war in sight — the
  // grinding option (excluded for the wait-and-burn identities)
  const ia = BOT.idleAggress;
  if (pol.redeclare === 'eager' || me.archetype === 'shield-first') {
    if (me.field >= me.fieldCap * ia.capFrac
      && (now - (me.lastWarEnd ?? 0)) >= ia.turnsIdle
      && ratio >= ia.minRatio) return t;
  }
  return null;
}

function peacePrimary(me, realms, rng, record, H = HARNESS) {
  const pol = BOT.archetypes[me.archetype];
  // recovery-dial pass (Option A): garrison regen is no longer a free
  // pulse — it costs the turn's action. A shattered shield preempts the
  // peace order (regenThreshold), but only when civilians can fill it
  // (else the turn would be wasted healing nothing). A realm at war never
  // reaches here (the war consumes its primary) — that IS the throttle.
  if (civilians(me) > 0) {
    const shattered = Object.keys(me.frontG).some(
      (f) => me.frontG[f] < BOT.regenThreshold * me.frontCap[f])
      || me.capitalGarrison < BOT.regenThreshold * H.capitalGarrisonCap;
    if (shattered) {
      const healed = regenGarrisons(me, H);
      if (healed > 0) { record.regens = (record.regens ?? 0) + 1; return 'regen'; }
    }
  }
  for (const act of pol.peace) {
    if (act === 'raid') {
      const cands = adjacentNames(me, realms).map((n) => realms.find((x) => x.name === n))
        .filter((t) => t && t.alive && !t.vassalOf && (me.truce[t.name] ?? 0) < me._turn);
      if (cands.length) {
        const t = cands.sort((a, b) => (b.field + totalGarrisons(b)) - (a.field + totalGarrisons(a)))[0];
        t.usable = Math.max(0.3, t.usable - HARNESS.raidBurnPp);
        if (H.crisis && H.crisis.enabled && sectorMode(t)) {
          const secs = heldSectors(t);
          if (secs.length) {
            const top = secs.reduce((a, b) =>
              (b.populationValue + b.economyValue) > (a.populationValue + a.economyValue) ? b : a);
            addScar(top, H.crisis.scarPerRaid);
          }
        }
        me.recruitBonus += Math.round(HARNESS.raidLoot * HARNESS.indemnityMenPerYield * DIALS.raidBurn.lootShare);
        record.raids++;
        return 'raid';
      }
    }
    if (act === 'fort') {
      // hermit buy-back first: staging doubles the strait door (ruling ⑩)
      if (me.seatType === 'hermit' && !me.staging) { me.staging = true; return 'staging'; }
      const ceilOf = (n) => (me.fortCeil && me.fortCeil[n]) || 'fortress';
      const front = Object.entries(me.fortAt)
        .filter(([n, f]) => BOT.fortLadder.indexOf(f) < BOT.fortLadder.indexOf(ceilOf(n)))
        .sort(([a], [b]) => (me.frontG[a] ?? 0) - (me.frontG[b] ?? 0))[0];
      if (front) { me.fortAt[front[0]] = BOT.fortLadder[BOT.fortLadder.indexOf(front[1]) + 1]; return 'fort'; }
    }
    if (act === 'recruit') {
      if (me.field < me.fieldCap && me.pool > 0) { doRecruit(me); return 'recruit'; }
    }
  }
  if (me.field < me.fieldCap && me.pool > 0) { doRecruit(me); return 'recruit'; }
  return 'hold';
}

// (b) total-bodies register accounting (Q0-5 structure seal, 2026-07-07):
// pool = living bodies TOTAL (serving + civilians). Drafting/regen move
// bodies civilian→serving (pool unchanged); only death shrinks it
// (poolBleed). Fixes the old draft double-count (recruit decremented
// pool AND the recruit's later death decremented it again).
function servingBodies(r) {
  return r.field + Object.values(r.frontG).reduce((s, g) => s + g, 0)
    + r.capitalGarrison;
}
const civilians = (r) => Math.max(0, r.pool - servingBodies(r));

// Option B treasury: income/turn = land yield × usable (econ.income shape).
const realmIncome = (r) => sectorMode(r)
  ? heldSectors(r).reduce((s, x) => s + x.economyValue * x.usableEconomy, 0) * r.usable
  : r.yieldBase * r.usable;   // legacy fixture path — keep NaN semantics verbatim
// mobilization intensity (serving ÷ register) — the surge-curve x-axis.
const intensity = (r) => (r.pool > 0 ? servingBodies(r) / r.pool : 1);

function doRecruit(me) {
  const base = Math.round(me.fieldCap * MATCH_DIALS.recruitPerTurn * me.usable);
  const bonus = Math.min(me.recruitBonus, base); // indemnity credit accelerates, same primary
  const want = Math.min(me.fieldCap - me.field, Math.min(civilians(me), base + bonus));
  if (want <= 0) return;
  // Option B: the draft is priced along the surge curve (integral over the
  // intensity it pushes through) and capped by treasury. Register erosion
  // makes the same draft cost more as the war ages — the "blind".
  const reg = me.pool;
  const serving = servingBodies(me);
  const billFor = (men) => ECON.draftBill(reg, serving / reg, (serving + men) / reg);
  const budget = me.treasury ?? Infinity;
  let add = want;
  if (billFor(add) > budget) {
    let lo = 0, hi = want; // max affordable men (draftBill monotonic in men)
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      if (billFor(mid) <= budget) lo = mid; else hi = mid - 1;
    }
    add = lo;
  }
  me.recruitBonus -= Math.min(bonus, add);
  me.field += add;
  if (me.treasury != null) me.treasury -= billFor(add);
}

// P1 dual billing, register side: garrison regeneration draws real
// bodies from the same register (no free healing). Returns men healed.
// (Treasury side of P1 is not modeled in this harness — sheet limits.)
function regenGarrisons(r, H) {
  const reg = r.pool;
  const serving = servingBodies(r);
  const civ = civilians(r);
  // P1 yield side (Option B): regen pays the SAME surge curve as recruit —
  // deep-mobilized realms heal expensively. The men budget is the lesser of
  // civilians (blood) and what treasury can afford at the current intensity.
  const budget = r.treasury ?? Infinity;
  const billFor = (men) => ECON.draftBill(reg, serving / reg, (serving + men) / reg);
  let avail = civ;
  if (budget !== Infinity && billFor(civ) > budget) {
    let lo = 0, hi = civ;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      if (billFor(mid) <= budget) lo = mid; else hi = mid - 1;
    }
    avail = lo;
  }
  let healed = 0;
  for (const f of Object.keys(r.frontG)) {
    const want = Math.min(r.frontCap[f] - r.frontG[f], Math.round(r.frontCap[f] * H.garrisonRegen));
    const add = Math.max(0, Math.min(want, avail));
    r.frontG[f] += add; avail -= add; healed += add;
  }
  const capCap = H.capitalGarrisonCap ?? 1500;
  const capWant = Math.min(capCap - r.capitalGarrison, Math.round(capCap * H.garrisonRegen * 0.5));
  const capAdd = Math.max(0, Math.min(capWant, avail));
  r.capitalGarrison += capAdd; healed += capAdd;
  if (r.treasury != null) r.treasury -= billFor(healed);
  return healed;
}

// ---------------------------------------------------------------- match
function runMatch(assignment, opts = {}) {
  const H = { ...HARNESS, ...opts.harness };
  const rng = mulberry32(opts.seed ?? 1);
  const realms = opts.board ?? makeBoard();
  for (const r of realms) {
    r.archetype = assignment[r.name].archetype;
    r.temperament = assignment[r.name].temperament;
    r.brain = assignment[r.name].brain || opts.brain || null; // tactical plan AI (per-seat > uniform > script)
  }
  const record = {
    assignment, seed: opts.seed ?? 1,
    winner: null, endingShape: 'timeout', tripTurn: null,
    // total living bodies at match start — the worldBlood exhaustion denominator
    bodiesStart: realms.reduce((s, r) => s + bodiesOf(r), 0),
    settlements: [], presetOffers: [], vassalOffers: 0, vassalDeals: 0,
    eliminations: 0, raids: 0, warsStarted: 0,
    planStats: { picks: {}, brained: 0, forced: 0, misjudged: 0 },
  };

  const lastTurn = (H.crisis && H.crisis.enabled) ? H.crisis.hardEnd : H.maxTurns;
  for (let t = 1; t <= lastTurn; t++) {
    const alive = realms.filter((r) => r.alive);
    for (const r of alive) r._turn = t;

    // --- simultaneous seal: collect primaries, then resolve
    const declarations = [];
    for (const r of alive) {
      if (r.vassalOf) { if (r.field < r.fieldCap && r.pool > 0) doRecruit(r); continue; }
      const defending = r.wars.some((w) => w.def === r.name);
      const attacking = r.wars.some((w) => w.att === r.name);
      if (attacking || defending) continue; // the war consumes the primary
      const target = pickTarget(r, realms, rng, H);
      if (target) declarations.push([r, target]);
      else peacePrimary(r, realms, rng, record, H);
    }
    for (const [r, target] of declarations) {
      const war = newWar(r, target, t);
      war.bandSeed = Math.floor(rng() * 4294967296); // per-war fog band identity
      r.wars.push(war); target.wars.push(war);
      record.warsStarted++;
    }

    // --- prosecute wars (attacker-side battle per war per turn); each
    // realm's field army defends its highest-deficit defensive war, others get a
    // screening detachment
    const mainDefWar = {};
    for (const r of alive) {
      const defs = r.wars.filter((w) => w.def === r.name && w.stage !== 'over');
      if (defs.length) mainDefWar[r.name] = pickMainDefWar(r, defs, realms);
    }
    const activeWars = [...new Set(alive.flatMap((r) => r.wars))].filter((w) => w.stage !== 'over');
    for (const war of activeWars) {
      const A = realms.find((r) => r.name === war.att);
      const D = realms.find((r) => r.name === war.def);
      if (!A.alive || !D.alive) { war.stage = 'over'; continue; }
      warBattle(war, A, D, { screen: mainDefWar[D.name] !== war, rng, planStats: record.planStats, H });
      war.endTurn = t;

      if (war.stage === 'fallen') {
        eliminate(D, A, realms, H, war);
        record.eliminations++;
        endWar(war, A, D, H);
        continue;
      }
      // stall → status-quo peace (occupied sectors return)
      if (war.stalled >= H.stallPatience) {
        returnOccupied(war, D);
        endWar(war, A, D, H);
        continue;
      }
      // settlement proposal
      const deal = trySettle(war, A, D, H, record);
      if (deal) {
        const res = applySettlement(deal.kind, deal.preset, war, A, D, H, realms);
        record.settlements.push({
          turn: t, winner: A.name, loser: D.name, kind: deal.kind,
          preset: deal.preset, margin: deal.st.margin,
          capital: deal.st.capitalInReach, ...res,
        });
        if (deal.kind === 'vassalage') record.vassalDeals++;
      } else if (!BOT.archetypes[A.archetype].pushCapital
        && (war.stage === 'cascade' || war.stage === 'capital') && war.proposalStep >= 3) {
        // lenient refused and the policy won't storm thrones: white peace
        returnOccupied(war, D);
        endWar(war, A, D, H);
      }
    }

    // --- M12/M13 pulse: usable recovery only. Garrison regen is NO LONGER
    // a free pulse (recovery-dial pass, Option A / ADR 0027): re-manning a
    // shattered shield now costs the turn's action, taken in peacePrimary.
    // usable recovery stays passive — it is ambient world-flow (the land
    // healing), not a force-shaping act (M12-5 standing floor).
    for (const r of alive) {
      r.usable = Math.min(1, r.usable + H.usableRecovery);
      if (sectorMode(r)) {
        // per-sector integration ripening (ADR 0022 verbatim; each sector
        // on its own clock — the pooled-flow approximation is retired)
        for (const s of heldSectors(r)) {
          if (s.usableEconomy < 1) s.usableEconomy = Math.min(1, s.usableEconomy + H.sectorRipenPerTurn);
          if (s.usablePop < 1) s.usablePop = Math.min(1, s.usablePop + H.sectorRipenPerTurn);
        }
        // land-ceiling coupling blend (capLandFrac 0 = frozen control)
        if (H.capLandFrac > 0)
          r.fieldCap = Math.round((1 - H.capLandFrac) * r.fieldCap0
            + H.capLandFrac * ECON.nationalCap(heldSectors(r)));
      }
      r.treasury = (r.treasury ?? 0) + realmIncome(r);  // Option B income accrual
    }

    // --- hegemony check: every alive non-vassal candidate
    const view = checkView(realms);
    for (const r of alive) {
      if (r.vassalOf || !r.alive) continue;
      const c = hegemonyCheck(view, r.name, MATCH_DIALS);
      if (c.trips) {
        record.winner = r.name;
        record.tripTurn = t;
        const vassals = realms.filter((x) => x.alive && x.vassalOf === r.name).length;
        record.endingShape = vassals >= 1 ? 'trip-chain' : 'trip-solo';
        record.check = { candProj: c.candProj, inBalance: c.inBalance, outOfBalance: c.outOfBalance };
        return finish(record, realms);
      }
    }
  }
  if (H.crisis && H.crisis.enabled && !record.winner) record.endingShape = 'draw-westphalian';
  return finish(record, realms);
}

function finish(record, realms) {
  // how far from the decision point did this world end? (timeout autopsy:
  // per candidate, leadership shortfall = worst-rival need − own projection;
  // coalition overhang = coalition mass − unassailability need. trip ⇔ 0 / ≤0)
  const view = checkView(realms);
  let best = null;
  for (const r of realms) {
    if (!r.alive || r.vassalOf) continue;
    const c = hegemonyCheck(view, r.name, MATCH_DIALS);
    const maxNeed = c.leadershipRows.length
      ? Math.max(...c.leadershipRows.map((x) => x.need)) : 0;
    const cand = {
      name: r.name,
      leadership: c.leadership, unassailable: c.unassailable,
      leadershipShortfall: Math.max(0, maxNeed - c.candProj),
      coalitionOverhang: c.coalition - c.coalitionNeed,
      candProj: c.candProj,
      affordabilityBound: c.affordabilityBound,
    };
    if (!best || cand.leadershipShortfall < best.leadershipShortfall
      || (cand.leadershipShortfall === best.leadershipShortfall
        && cand.coalitionOverhang < best.coalitionOverhang)) best = cand;
  }
  record.finalCheck = best;
  record.finalRealms = realms.map((r) => ({
    name: r.name, seat: r.seatType, archetype: r.archetype, temperament: r.temperament,
    alive: r.alive, vassalOf: r.vassalOf, field: r.field, pool: r.pool, interior: r.interior,
  }));

  // bar-independent ending panel (grill 2026-07-08): classifies how the match
  // ended without consulting the hegemony bar. projectable reuses the same view
  // the gate reads; shield/ctrl/bodies come straight off the realm.
  const perRealm = realms.map((r, i) => ({
    name: r.name, seat: r.seatType, alive: r.alive, vassalOf: r.vassalOf,
    proj: r.alive ? projectable(view[i]) : 0,
    shield: shieldOf(r), ctrl: r.interior,
    bodies: r.alive ? bodiesOf(r) : 0,
    frontPowers: r.alive ? Object.keys(r.frontG).map((f) => frontDefense(r, f)) : [],
  }));
  record.panel = matchPanel(perRealm, { bodiesStart: record.bodiesStart });
  if (record.winner) record.panel.bucket = 'hegemon'; // a tripped match, not a timeout class

  if (record.winner) {
    const w = record.finalRealms.find((r) => r.name === record.winner);
    record.winnerSeat = w.seat; record.winnerArchetype = w.archetype; record.winnerTemperament = w.temperament;
  }
  return record;
}

// ---------------------------------------------------------------- tournament
const ARCHETYPES = Object.keys(BOT.archetypes);
const TEMPERAMENTS = Object.keys(MATCH_DIALS.temperament);
const SEATS = ['중원', '서령', '동평', '남곡', '북하'];

// Grid A: each archetype in each seat, field of mixed rivals. reps
// matches per cell; rival archetypes/temperaments drawn seeded-random.
function runTournament(opts = {}) {
  const reps = opts.reps ?? 12;
  const rng = mulberry32(opts.seed ?? 42);
  const records = [];
  for (const focal of ARCHETYPES) {
    for (const seat of SEATS) {
      for (let i = 0; i < reps; i++) {
        const assignment = {};
        for (const s of SEATS) {
          assignment[s] = {
            archetype: s === seat ? focal : pickFrom(rng, ARCHETYPES),
            temperament: pickFrom(rng, TEMPERAMENTS),
          };
        }
        records.push({
          focal, seat,
          ...runMatch(assignment, { seed: Math.floor(rng() * 1e9), harness: opts.harness }),
        });
      }
    }
  }
  return records;
}

// Spec gaps the harness had to rule on itself (side product: the sim as
// a spec completeness auditor — these are UNDOCUMENTED in the canon docs
// and each needed an invented harness rule to run at all).
const SPEC_GAPS = [
  'AI war appetite (GLOSSARY queue 8 — confirmed LOAD-BEARING): with every bot requiring the ~1.7 pre-war ratio, a viability-parity board freezes after the small realm is digested — no peer war ever launches and no match ends. The harness had to invent the opportunism read (a field army pinned elsewhere leaves screen+garrison, and THAT is what the ratio is checked against) before matches moved at all. The sheet-8 arc hand-scripted this motion (중원–동평 war); canon documents no rule that produces it.',
  'Two-front army allocation: which war does a realm\'s field army serve when attacked while attacking? (harness: field defends the biggest defensive war, other fronts get a 20% screen; garrisons hold sieges alone) — ADR 0025 thinness.',
  'Attacking a vassal: does the overlord\'s army defend, and does war-on-vassal mean war-on-overlord? (harness: vassals cannot be attacked at all).',
  'Settlement initiative: canon defines acceptance arithmetic but not WHO proposes or the concession tempo (harness: winner proposes one step down the preset ladder per turn).',
  'Stalled-war exit: RESOLVED 2026-07-12 (match-arc CE-⑲) — white peace canonized as the settlement ladder 0% rung; the auto-trigger here (2 stalled turns → occupied sectors return) stays BOT POLICY, an L2-exercised 가안 that never binds a human player.',
  'Indemnity spend: 배상 arrives as yield but nothing defines its conversion to force (harness: recruit credit at 부대=0.5 yield inside the same recruit primary).',
  'Truce/redeclaration: RESOLVED 2026-07-12 (match-arc CE-⑱) — truce lock canonized as world law (mutual, pairwise, every war end); the 4-turn value here is the L2-exercised 가안 the record-world baseline was measured under.',
  'Front redraw after cession: ruling ⑨ derives fronts from adjacency, but ceded interior sectors here do not move the border graph (harness: static adjacency — needs B\'s map).',
];

module.exports = { HARNESS, BOT, ARCHETYPES, TEMPERAMENTS, SEATS, SPEC_GAPS,
  makeBoard, runMatch, runTournament, mulberry32, yieldReach, realmValue,
  pickTarget, peacePrimary, doRecruit, poolBleed, servingBodies, regenGarrisons,
  realmIncome, intensity, combatFromBorderClass, newWar, warBattle, m9Fill,
  frontDefense, pickMainDefWar, frontSoftness,
  applySettlement, sectorMode, syncCounts, occupationFrontier, captureSector, heldSectors,
  acquireSector, returnOccupied, eliminate, checkView, crisisRate, addScar, terrainOf,
  sectorFuel, sectorRegisterShare, growRebels, suppressAttrition };
