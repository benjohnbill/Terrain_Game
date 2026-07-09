'use strict';
// PROTOTYPE — match-level arithmetic mirroring the sealed match-arc terms
// (docs/features/match-arc/GLOSSARY.md rows: 패권 결정점, 투사 가능 질량,
// 은둔국 조항, 정산, 정산 통화, 도달권, 수락 산술). No I/O. Not wired to
// game code. Question: does the hegemony inequality + settlement acceptance
// arithmetic behave end-to-end? (battery sheets 10–11)
//
// Every value marked GAAN is a proposal this battery run must price —
// number rulings go to the user; only structure closes here.

const MATCH_DIALS = {
  // -- hegemony check (GLOSSARY 패권 결정점) --
  shieldRatio: 1.7,        // war-deciding mass ratio (observed sheet 7: 2.0 wins, 1.5 stalls)
  shieldBase: 'shieldLine',// what the ratio multiplies — UNSEALED, swept in sheet 10:
                           // 'total' = field + all garrisons / 'shieldLine' = field +
                           // border-shield garrisons (closest to sheet 7's measured 4,000)
                           // / 'field' = field army only
  projectionFloor: 1000,   // hermit clause: projectable ≤ floor → out of balance (reuses M12 raid visibility threshold)
  regenWindow: 6,          // SEALED 2026-07-05 (ruling ⑪): the time depth of
                           // "irreversible" — coalition counts current projection +
                           // 6 turns of recruitment (reuses the M12/M13 recovery
                           // anchors 5–8). W belongs to unassailability only:
                           // hegemony = my PRESENT punch + their CLOSED futures
  chokeFlow: 2,            // SEALED 2026-07-05 (ruling ⑩): projectable through a choke
                           // = cap × 2 ("waves a campaign sustains through the door") —
                           // the one value where 촉-type pass realms stay in the balance
                           // (2,000, small-punch Parthia blocker) while 일본-type strait
                           // realms are hermits (1,000) with a staging buy-back (2,000)
  recruitPerTurn: 0.10,    // of field cap per recruitment primary (M13, sealed)

  // -- domination victory (§6, RULINGS DT-③, Combo 2 — a WINNER-rule dial,
  //    intentionally NOT the PANEL_DIALS measurement copy) --
  dominantForceShare: 0.5, // candProj ≥ half of all in-balance projectable → dominant
  dominationRatio: 2.5,    // OR candProj ≥ 2.5× the strongest in-balance rival's projectable

  // -- settlement (GLOSSARY 정산 / 수락 산술) --
  presets: {
    관대: { claimRate: 0.50, fill: 'indemnityFirst' },  // A-1 ruling ⑧ 가안
    표준: { claimRate: 0.75, fill: 'cessionFirst' },
    최대: { claimRate: 1.00, fill: 'cessionFirst' },
  },
  temperament: { 완고: 0.8, 실리: 1.0, 유화: 1.2 },     // acceptance coefficient anchors (가안, ruling ⑧)

  // -- expected cost of continuing the war (loser side) --
  // L = resistanceDiscount × (occValue × occEscalation(margin) + raidLoot + capitalRisk)
  //   occEscalation: how much further the occupation sword reaches if war goes on
  //   capitalRisk:   the total-fall tail risk priced in when the capital is in reach
  //   resistanceDiscount: SEALED 2026-07-05 (ruling ⑫, delegated) — the loser
  //     prices continued war BELOW the full bill (the winner also bleeds, time
  //     flows, third parties move; 강화 결렬 exists because resistance has
  //     value). 0.6 is where the preset ladder differentiates: registered bar
  //     passes (conciliatory-Maximum 40%) and no preset dominates.
  lossModel: {
    occEscalation: { decisive: 1.5, grinding: 1.15, marginal: 0.85 },
    extraTurns:    { decisive: 3,   grinding: 6,    marginal: 9 },   // expected further war length if refused
    capitalRiskFrac: 0.5,   // capital in reach → + (occ+raid) × 0.5 tail risk
    resistanceDiscount: 0.6,
  },
};

// ---------------------------------------------------------------- projection
// 투사 가능 질량: mass deliverable beyond own shield — derived, never stored.
// realm.exits: array of { cap } where cap = Infinity for an open border,
// else the M11 choke frontage cap. Projection per choke = cap × chokeFlow.
function projectable(realm, D = MATCH_DIALS) {
  if (!realm.alive) return 0;
  let doors = 0;
  for (const e of realm.exits) {
    if (e.cap === Infinity) return realm.field;        // any open border → field mass projects
    doors += e.cap * D.chokeFlow;
  }
  return Math.min(realm.field, doors);
}

// Border-shield garrisons on the fronts facing any of `againstNames`.
// realm.fronts = { neighborName: shieldGarrisons } — in the real game this
// is DERIVED per turn (garrisons of sectors adjacent to territory the
// other side controls), zero new state; the prototype carries an authored
// front map. No front map → fall back to the whole line.
function frontGarrisons(realm, againstNames) {
  if (!realm.fronts) return realm.shieldGarrisons ?? 0;
  return Object.entries(realm.fronts)
    .filter(([n]) => againstNames.includes(n))
    .reduce((s, [, g]) => s + g, 0);
}

function shieldMass(realm, D = MATCH_DIALS, againstNames = null) {
  // The mass the ~1.7 ratio multiplies. The geometry premium (fort ×
  // terrain) lives inside the ratio (sheet 7 measured it against a realm
  // defending with typical fort geometry), so the base is raw mass.
  // SEALED 2026-07-05 (ruling ⑨): shieldLine, FACING-FRONT reading —
  // field army (interior lines: meets any single invader) + border-shield
  // garrisons facing the OTHER SIDE only (frozen bodies pinned to their
  // own fronts; a rival's far-front garrisons are not my bill). This is
  // also what makes conquest inherit exposure: control changes redraw
  // the fronts, so the anti-snowball loop is pure arithmetic.
  switch (D.shieldBase) {
    case 'total': return realm.field + realm.garrisons;
    case 'field': return realm.field;
    default: return realm.field + (againstNames
      ? frontGarrisons(realm, againstNames)
      : (realm.shieldGarrisons ?? 0)); // 'shieldLine'
  }
}

// ---------------------------------------------------------------- hegemony
// realms: [{ name, field, fieldCap, garrisons, exits, alive, vassalOf }]
function hegemonyCheck(realms, candName, D = MATCH_DIALS) {
  const cand = realms.find((r) => r.name === candName);
  const vassals = realms.filter((r) => r.alive && r.vassalOf === candName);
  const others = realms.filter((r) => r.alive && r.name !== candName && r.vassalOf !== candName);

  // hermit clause: projectable ≤ floor → outside the balance
  const status = others.map((r) => ({
    realm: r, proj: projectable(r, D),
  })).map((x) => ({ ...x, inBalance: x.proj > D.projectionFloor }));
  const inBalance = status.filter((x) => x.inBalance);
  const outOfBalance = status.filter((x) => !x.inBalance);

  // candidate side: own projection + vassal projection (복속 row: vassal
  // mass counts to the overlord's side of the arithmetic)
  const candProj = projectable(cand, D) + vassals.reduce((s, v) => s + projectable(v, D), 0);
  const candSide = [candName, ...vassals.map((v) => v.name)];
  const inBalanceNames = [];

  // leadership: candProj ≥ ratio × every in-balance shield, where each
  // rival's shield counts only the garrisons facing the candidate's side
  // (ruling ⑨ facing-front reading; vassalage widens the shared front)
  const leadershipRows = inBalance.map((x) => {
    inBalanceNames.push(x.realm.name);
    const s = shieldMass(x.realm, D, candSide);
    return { name: x.realm.name, need: D.shieldRatio * s, pass: candProj >= D.shieldRatio * s };
  });

  // candidate's own shield vs the coalition: garrisons facing any
  // in-balance realm, own + vassals'
  const candShield = shieldMass(cand, D, inBalanceNames)
    + vassals.reduce((s, v) => s + shieldMass(v, D, inBalanceNames), 0);
  const leadership = leadershipRows.every((r) => r.pass);

  // unassailability: no in-balance coalition reaches ratio × candidate
  // shield within the regeneration window. Coalition mass = Σ projectable
  // + what W turns of recruitment can add (model choice: candidate shield
  // held at its current, war-worn value — the window IS the weak period).
  const coalition = inBalance.reduce((s, x) =>
    s + x.proj + Math.min(Math.max(0, x.realm.fieldCap - x.realm.field),
      Math.round(x.realm.fieldCap * D.recruitPerTurn) * D.regenWindow), 0);
  const coalitionNeed = D.shieldRatio * candShield;
  const unassailable = coalition < coalitionNeed;

  // dominance (§6 domination terminal, RULINGS DT-③): owns the board's offense
  // — ≥ half of all in-balance projectable, OR ≥ dominationRatio× the top rival.
  // No per-rival shield bar (that is leadership); this is the wall's escape.
  const rivalProjSum = inBalance.reduce((s, x) => s + x.proj, 0);
  const totalInBalanceProj = candProj + rivalProjSum;
  const forceShare = totalInBalanceProj > 0 ? candProj / totalInBalanceProj : 0;
  const maxRivalProj = inBalance.length ? Math.max(...inBalance.map((x) => x.proj)) : 0;
  const dominance = forceShare >= D.dominantForceShare
    || (maxRivalProj > 0 ? candProj >= D.dominationRatio * maxRivalProj : true);

  return {
    candProj, candShield, leadership, leadershipRows,
    coalition, coalitionNeed, unassailable,
    dominance, forceShare,
    inBalance: inBalance.map((x) => x.realm.name),
    outOfBalance: outOfBalance.map((x) => `${x.realm.name}(투사 ${x.proj})`),
    trips: (leadership || dominance) && unassailable,
  };
}

// ---------------------------------------------------------------- settlement
// reach = { occValue, raidLoot, capitalInReach } in sector-turn-yield units.
// Composite reach value := occValue + raidLoot (sealed 2026-07-05); each
// currency bounded by its OWN ceiling.
function presetBundle(presetName, reach, D = MATCH_DIALS) {
  const p = D.presets[presetName];
  const composite = reach.occValue + reach.raidLoot;
  const target = composite * p.claimRate;
  let cession, indemnity;
  if (p.fill === 'indemnityFirst') {
    indemnity = Math.min(reach.raidLoot, target);
    cession = Math.min(reach.occValue, target - indemnity);
  } else {
    cession = Math.min(reach.occValue, target);
    indemnity = Math.min(reach.raidLoot, target - cession);
  }
  return { preset: presetName, claimRate: p.claimRate, fill: p.fill,
    cession, indemnity, value: cession + indemnity, composite };
}

// Loser-AI expected loss if the war continues (the sheet's GAAN model).
// state = { occValue, raidLoot, capitalInReach, margin }
function expectedContinuedLoss(state, D = MATCH_DIALS) {
  const m = D.lossModel;
  const territorial = state.occValue * m.occEscalation[state.margin];
  const economic = state.raidLoot;
  const capitalRisk = state.capitalInReach
    ? (state.occValue + state.raidLoot) * m.capitalRiskFrac : 0;
  const discount = m.resistanceDiscount ?? 1;
  return { territorial, economic, capitalRisk, discount,
    total: discount * (territorial + economic + capitalRisk) };
}

// 수락 산술 (sealed): accept iff bundle value ≤ expected loss × coefficient.
// Deterministic, true values, no dice.
function accepts(bundleValue, expectedLossTotal, coeff) {
  return bundleValue <= expectedLossTotal * coeff;
}

// ---------------------------------------------------------------- ending panel
// A bar-INDEPENDENT read of a finished match (ending-taxonomy grill 2026-07-08).
// It never consults the hegemony bar, so the ~87% timeout blob splits into a
// legitimate multipolar standoff vs a dominant realm the victory check failed
// to register. Input is one plain object per realm — {name, seat, alive,
// vassalOf, proj, shield, ctrl, bodies} — extracted by the harness (finish())
// where the live realms and projectable/shieldMass live; this function does the
// pure share arithmetic only, so it is fixture-testable in isolation.
//
// Vassals fold FULL into the overlord SIDE (grill Q4 — mirrors the gate's
// candProj = self + Σ vassal; the vassal is strategically the overlord's
// instrument), while vassalShare reports the fragile proxy portion separately
// (it evaporates on chain-collapse). Thresholds are PROVISIONAL (가안),
// calibrated against the measured distribution, never before it (L2 discipline);
// tier cutoffs borrow Stellaris relative-power (1.5× superior / 2.5×
// overwhelming).
const PANEL_DIALS = {
  tierSuperior: 1.5,      // leader ÷ strongest rival ≥ this → 'superior'
  tierOverwhelming: 2.5,  // ≥ this → 'overwhelming'
  reversibleAt: 1.0,      // coalition offense ÷ leader shield ≥ this → overturnable
  exhaustedBelow: 0.6,    // worldBlood under this → the world is bled out
  dominantForceShare: 0.5,
};

function matchPanel(perRealm, opts = {}) {
  const D = opts.D || MATCH_DIALS;
  const P = opts.panel || PANEL_DIALS;
  const alive = perRealm.filter((r) => r.alive);
  const byName = new Map(alive.map((r) => [r.name, r]));

  // fold each vassal into its overlord's side (full weight, Q4)
  const sides = [];
  for (const r of alive) {
    if (r.vassalOf && byName.has(r.vassalOf)) continue; // counted under overlord
    const vassals = alive.filter((v) => v.vassalOf === r.name);
    const sum = (key) => r[key] + vassals.reduce((s, v) => s + v[key], 0);
    sides.push({
      name: r.name, seat: r.seat,
      proj: sum('proj'), shield: sum('shield'), ctrl: sum('ctrl'),
      vassalProj: vassals.reduce((s, v) => s + v.proj, 0),
    });
  }

  const sum = (key) => sides.reduce((s, x) => s + x[key], 0);
  const sumProj = sum('proj') || 1;
  const sumShield = sum('shield') || 1;
  const sumCtrl = sum('ctrl') || 1;
  for (const x of sides) x.forceShare = x.proj / sumProj;

  const leader = sides.reduce((a, b) => (b.proj > a.proj ? b : a), sides[0]);
  const rivals = sides.filter((x) => x !== leader);
  const maxRival = rivals.reduce((a, b) => (!a || b.proj > a.proj ? b : a), null);

  const forceShare = leader.proj / sumProj;
  const controlShare = leader.ctrl / sumCtrl;
  const shieldShare = leader.shield / sumShield;

  // FG U5: boosted defense power (garrison × terrain × fort) and the
  // within-realm spread that force-geography is supposed to create.
  const boostOf = (name) => {
    const r = perRealm.find((x) => x.name === name);
    return r && r.frontPowers ? r.frontPowers.reduce((s, v) => s + v, 0) : 0;
  };
  const sumBoost = sides.reduce((s, x) => s + boostOf(x.name), 0) || 1;
  const boostedShieldShare = boostOf(leader.name) / sumBoost;
  const cv = (arr) => {
    if (!arr || arr.length < 2) return 0;
    const m = arr.reduce((s, v) => s + v, 0) / arr.length;
    if (!m) return 0;
    const v = arr.reduce((s, x) => s + (x - m) * (x - m), 0) / arr.length;
    return Math.sqrt(v) / m;
  };
  const cvs = perRealm.filter((r) => r.alive).map((r) => cv(r.frontPowers));
  const meanWithinRealmVariance = cvs.length ? cvs.reduce((s, v) => s + v, 0) / cvs.length : 0;

  const hhi = sides.reduce((s, x) => s + x.forceShare * x.forceShare, 0);
  const sos = hhi ? (forceShare * forceShare) / hhi : 0;
  const vassalShare = leader.proj ? leader.vassalProj / leader.proj : 0;

  // reversibility: in-balance rivals' offense vs the leader's defensive wall
  // (the hermit clause of the gate — proj ≤ floor cannot form a coalition)
  const coalitionProj = rivals
    .filter((x) => x.proj > D.projectionFloor)
    .reduce((s, x) => s + x.proj, 0);
  const reversibilityIndex = leader.shield ? coalitionProj / leader.shield : Infinity;

  const bodiesNow = alive.reduce((s, r) => s + (r.bodies || 0), 0);
  const worldBlood = opts.bodiesStart ? bodiesNow / opts.bodiesStart : null;
  const exhausted = worldBlood != null && worldBlood < P.exhaustedBelow;

  const ratio = maxRival ? leader.proj / (maxRival.proj || 1) : Infinity;
  const tier = ratio >= P.tierOverwhelming ? 'overwhelming'
    : ratio >= P.tierSuperior ? 'superior' : 'equivalent';

  // bucket (PROVISIONAL). A tripped match is labelled 'hegemon' by the caller;
  // this classifies the no-trip endings only.
  const ranked = [...sides].sort((a, b) => b.forceShare - a.forceShare);
  const bipolar = ranked.length >= 3
    && (ranked[0].forceShare + ranked[1].forceShare) >= 0.66
    && ranked[2].forceShare < 0.15;
  const unassailable = reversibilityIndex < P.reversibleAt;
  let bucket;
  if ((tier === 'overwhelming' || forceShare >= P.dominantForceShare) && unassailable) {
    bucket = 'denied-dominant';       // a dominant realm the victory check missed
  } else if (bipolar) {
    bucket = 'bipolar-lock';          // two blocs, neither able to break the other
  } else if (tier === 'equivalent') {
    bucket = 'standoff';              // genuine multipolar balance
  } else {
    bucket = 'contested';            // a leader ahead but the field can still overturn
  }

  return {
    leader: leader.name, forceShare, controlShare, shieldShare,
    boostedShieldShare, meanWithinRealmVariance,
    hhi, sos, reversibilityIndex, vassalShare, worldBlood, exhausted, tier, bucket, sides,
  };
}

const _api = { MATCH_DIALS, PANEL_DIALS, projectable, shieldMass, hegemonyCheck, matchPanel, presetBundle, expectedContinuedLoss, accepts };
if (typeof module !== 'undefined' && module.exports) module.exports = _api;
else (window.TC = window.TC || {}).match = _api;
