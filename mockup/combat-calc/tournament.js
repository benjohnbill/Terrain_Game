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
// absence. Bots do not use reserves, delaying, feints, or scouting;
// the board is one authored 5-seat instance, not the map space.
//
// DIAL HYGIENE: values in BOT (policy dials) and HARNESS (world-model
// glue) are harness GAAN — they bound proof power and are NOT seal
// candidates. Sealed game dials all come from engine.DIALS /
// match.MATCH_DIALS; the one gated value under test is vassalPremium.
//
// SEMI-DURABLE: runMatch/runTournament are meant to be re-pointed at
// js/ modules later as the balance regression rig. Only the coarse
// world model here mirrors throwaway assumptions.

const { DIALS, resolve } = require('./engine');
const { MATCH_DIALS, hegemonyCheck, presetBundle,
  expectedContinuedLoss, accepts } = require('./match');

// ---------------------------------------------------------------- dials
const HARNESS = {
  maxTurns: 32,             // envelope 15–25 + slack; past this = timeout
  sectorValue: 2,           // yield units per interior sector (sheet-11 scale: occ 4 sectors ≈ 8)
  capitalValue: 4,          // capital sector worth (realm remaining value term)
  garrisonRegen: 0.10,      // M12: local garrison regen per turn toward its cap
  usableRecovery: 0.10,     // +10pp/turn when not raided (M12 usableRecoveryPp)
  raidLoot: 1.5,            // M8: loot per uncontested raid primary, yield units
  raidBurnPp: 0.15,         // M8: usable −15pp per raid
  indemnityMenPerYield: 200, // 부대 = 0.5 yield (M13) → 1 yield = 2부대 = 200명 recruit credit
  truceTurns: 4,
  stallPatience: 2,         // stalled war turns before white peace
  vassalPremium: 0.25,      // ruling ⑭ 가안 — THE value under test (swept)
  capPerSector: 0,          // A-3 probe: fieldCap gained/lost per ceded sector.
                            // 0 = current canon (conquest raises pool+yield but
                            // NOT the cap — cap growth is A-3's undesigned seat)
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
  fortLadder: ['none', 'fieldworks', 'walls', 'fortress'],
  stormAt: { fieldworks: 1.0, walls: 1.2, fortress: 1.5, legendary: 1.8, none: 0 },
  siegeCommit: 8, fieldCommit: 14,
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

// adapt a realm to match.js's hegemonyCheck shape
function checkView(realms) {
  return realms.map((r) => ({
    name: r.name, alive: r.alive, vassalOf: r.vassalOf,
    field: r.field, fieldCap: r.fieldCap,
    garrisons: totalGarrisons(r),
    fronts: r.frontG,
    exits: r.staging ? r.exits.map((e) => ({ cap: e.cap === Infinity ? Infinity : e.cap * 2 })) : r.exits,
  }));
}

// ---------------------------------------------------------------- wars
// Coarse war machine mirroring sheet 7's stages:
// siege (border fort) → field (decisive) → cascade (interior) → capital.
function newWar(att, def, turn) {
  return {
    att: att.name, def: def.name, start: turn,
    stage: 'siege', stamps: 0,
    occupied: 0, raided: 0,        // sectors taken / loot extracted (yield)
    stalled: 0, margin: null,      // decisive | grinding | marginal
    proposalStep: 0,               // winner's concession ladder position
    log: [],
  };
}

function warBattle(war, A, D, opts = {}) {
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
    const site = { terrain: 'hills', fort, erosionStamps: war.stamps, ...crossing };
    if (fortNow <= (BOT.stormAt[fort] ?? 1.2) + 1e-9) {
      const r = resolve({ plan: 'Swift', attacker: { stock: A.field, commit: BOT.siegeCommit },
        defender: { stock: g, commit: BOT.siegeCommit }, ...site });
      applyBlood(A, D, r, front);
      if (r.success) { war.stage = 'field'; war.occupied += 1; D.interior = Math.max(0, D.interior); }
      else if (r.R < 1.1) war.stalled++;
      return r;
    }
    const r = resolve({ plan: 'DP', attacker: { stock: A.field, commit: BOT.siegeCommit },
      defender: { stock: g, commit: BOT.siegeCommit }, ...site });
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
    if (D.interior <= 0) { war.stage = 'capital'; return null; }
    const r = resolve({ plan: 'Swift', attacker: { stock: A.field, commit: BOT.siegeCommit },
      defender: { stock: 500, commit: 0 }, terrain: 'plains' });
    A.field = Math.max(0, r.stockAfterA); poolBleed(A, r.lossA);
    if (r.success) { war.occupied += 1; D.interior -= 1; }
    return r;
  }

  if (war.stage === 'capital') {
    const site = { terrain: 'plains', fort: 'walls', erosionStamps: war.stamps };
    const fortNow = Math.max(1, DIALS.fort.walls - war.stamps * DIALS.erosionStep);
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
    || D.interior <= 0 || war.stage === 'capital' || war.stage === 'fallen';
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
  // cession: occupied sectors transfer (value + pool travel with land)
  const ceded = Math.min(war.occupied, Math.round(b.cession / H.sectorValue));
  A.interior += ceded;
  D.interior = Math.max(0, D.interior); // already decremented during cascade
  const poolShare = Math.round(D.pool * (ceded / Math.max(1, D.interior + ceded + 2)));
  D.pool -= poolShare; A.pool += poolShare;
  // A-3 probe: does conquered land raise the national cap? (0 in canon)
  A.fieldCap += ceded * H.capPerSector;
  D.fieldCap = Math.max(2000, D.fieldCap - ceded * H.capPerSector);
  // returned occupation beyond the ceded claim
  D.interior += Math.max(0, war.occupied - ceded);
  // indemnity: one-time recruit credit (부대 = 0.5 yield)
  A.recruitBonus += Math.round(b.indemnity * H.indemnityMenPerYield);
  if (kind === 'vassalage') {
    D.vassalOf = A.name;
    releaseVassalsOf(D, realms); // a falling overlord releases its own chain
  }
  if (ceded >= 2 || D.interior <= 0) inheritFronts(A, D, realms);
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

function eliminate(D, A, realms, H) {
  D.alive = false;
  inheritFronts(A, D, realms);
  releaseVassalsOf(D, realms);
  A.interior += D.interior; A.pool += Math.round(D.pool * 0.5);
  A.fieldCap += D.interior * (H?.capPerSector ?? 0);
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
    (H.pileOn ? (window_(b) ? 1 : 0) - (window_(a) ? 1 : 0) : 0) || shield(a) - shield(b));
  const t = pool[0];
  const ratio = me.field / Math.max(1, shield(t));
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

function peacePrimary(me, realms, rng, record) {
  const pol = BOT.archetypes[me.archetype];
  for (const act of pol.peace) {
    if (act === 'raid') {
      const cands = adjacentNames(me, realms).map((n) => realms.find((x) => x.name === n))
        .filter((t) => t && t.alive && !t.vassalOf && (me.truce[t.name] ?? 0) < me._turn);
      if (cands.length) {
        const t = cands.sort((a, b) => (b.field + totalGarrisons(b)) - (a.field + totalGarrisons(a)))[0];
        t.usable = Math.max(0.3, t.usable - HARNESS.raidBurnPp);
        me.recruitBonus += Math.round(HARNESS.raidLoot * HARNESS.indemnityMenPerYield * DIALS.raidBurn.lootShare);
        record.raids++;
        return 'raid';
      }
    }
    if (act === 'fort') {
      // hermit buy-back first: staging doubles the strait door (ruling ⑩)
      if (me.seatType === 'hermit' && !me.staging) { me.staging = true; return 'staging'; }
      const front = Object.entries(me.fortAt)
        .filter(([, f]) => BOT.fortLadder.indexOf(f) < BOT.fortLadder.indexOf('fortress'))
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

function doRecruit(me) {
  const base = Math.round(me.fieldCap * MATCH_DIALS.recruitPerTurn * me.usable);
  const bonus = Math.min(me.recruitBonus, base); // indemnity credit accelerates, same primary
  me.recruitBonus -= bonus;
  const add = Math.min(me.fieldCap - me.field, Math.min(me.pool, base + bonus));
  me.field += add; me.pool -= add;
}

// ---------------------------------------------------------------- match
function runMatch(assignment, opts = {}) {
  const H = { ...HARNESS, ...opts.harness };
  const rng = mulberry32(opts.seed ?? 1);
  const realms = opts.board ?? makeBoard();
  for (const r of realms) {
    r.archetype = assignment[r.name].archetype;
    r.temperament = assignment[r.name].temperament;
  }
  const record = {
    assignment, seed: opts.seed ?? 1,
    winner: null, endingShape: 'timeout', tripTurn: null,
    settlements: [], presetOffers: [], vassalOffers: 0, vassalDeals: 0,
    eliminations: 0, raids: 0, warsStarted: 0,
  };

  for (let t = 1; t <= H.maxTurns; t++) {
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
      else peacePrimary(r, realms, rng, record);
    }
    for (const [r, target] of declarations) {
      const war = newWar(r, target, t);
      r.wars.push(war); target.wars.push(war);
      record.warsStarted++;
    }

    // --- prosecute wars (attacker-side battle per war per turn); each
    // realm's field army defends its biggest defensive war, others get a
    // screening detachment
    const mainDefWar = {};
    for (const r of alive) {
      const defs = r.wars.filter((w) => w.def === r.name && w.stage !== 'over');
      if (defs.length) mainDefWar[r.name] = defs.sort((a, b) => {
        const fa = realms.find((x) => x.name === a.att).field;
        const fb = realms.find((x) => x.name === b.att).field;
        return fb - fa;
      })[0];
    }
    const activeWars = [...new Set(alive.flatMap((r) => r.wars))].filter((w) => w.stage !== 'over');
    for (const war of activeWars) {
      const A = realms.find((r) => r.name === war.att);
      const D = realms.find((r) => r.name === war.def);
      if (!A.alive || !D.alive) { war.stage = 'over'; continue; }
      warBattle(war, A, D, { screen: mainDefWar[D.name] !== war });
      war.endTurn = t;

      if (war.stage === 'fallen') {
        eliminate(D, A, realms, H);
        record.eliminations++;
        endWar(war, A, D, H);
        continue;
      }
      // stall → status-quo peace (occupied sectors return)
      if (war.stalled >= H.stallPatience) {
        D.interior += war.occupied;
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
        D.interior += war.occupied;
        endWar(war, A, D, H);
      }
    }

    // --- M12/M13 pulse: garrison regen (all), usable recovery
    for (const r of alive) {
      for (const f of Object.keys(r.frontG))
        r.frontG[f] = Math.min(r.frontCap[f], r.frontG[f] + Math.round(r.frontCap[f] * H.garrisonRegen));
      r.capitalGarrison = Math.min(1500, r.capitalGarrison + Math.round(1500 * H.garrisonRegen * 0.5));
      r.usable = Math.min(1, r.usable + H.usableRecovery);
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
  'Stalled-war exit: no white-peace / status-quo rule exists in canon (harness: 2 stalled turns → occupied sectors return, truce 4).',
  'Indemnity spend: 배상 arrives as yield but nothing defines its conversion to force (harness: recruit credit at 부대=0.5 yield inside the same recruit primary).',
  'Truce/redeclaration: nothing bars an instant re-war after settlement (harness: 4-turn truce).',
  'Front redraw after cession: ruling ⑨ derives fronts from adjacency, but ceded interior sectors here do not move the border graph (harness: static adjacency — needs B\'s map).',
];

module.exports = { HARNESS, BOT, ARCHETYPES, TEMPERAMENTS, SEATS, SPEC_GAPS,
  makeBoard, runMatch, runTournament, mulberry32, yieldReach, realmValue,
  pickTarget };
