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
  regenWindow: 6,          // turns the coalition gets to reach 1.7 × candidate shield (GAAN — swept)
  chokeFlow: 2,            // projectable through a choke = cap × chokeFlow (GAAN — "turns of flow a campaign sustains"; swept)
  recruitPerTurn: 0.10,    // of field cap per recruitment primary (M13, sealed)

  // -- settlement (GLOSSARY 정산 / 수락 산술) --
  presets: {
    관대: { claimRate: 0.50, fill: 'indemnityFirst' },  // A-1 ruling ⑧ 가안
    표준: { claimRate: 0.75, fill: 'cessionFirst' },
    최대: { claimRate: 1.00, fill: 'cessionFirst' },
  },
  temperament: { 완고: 0.8, 실리: 1.0, 유화: 1.2 },     // acceptance coefficient anchors (가안, ruling ⑧)

  // -- expected-continued-war-loss model (GAAN — the sheet's own model, not sealed) --
  // L = occValue × occEscalation(margin) + raidLoot + capitalRisk
  //   occEscalation: how much further the occupation sword reaches if war goes on
  //   capitalRisk:   the total-fall tail risk priced in when the capital is in reach
  lossModel: {
    occEscalation: { decisive: 1.5, grinding: 1.15, marginal: 0.85 },
    extraTurns:    { decisive: 3,   grinding: 6,    marginal: 9 },   // expected further war length if refused
    capitalRiskFrac: 0.5,   // capital in reach → + (occ+raid) × 0.5 tail risk
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

function shieldMass(realm, D = MATCH_DIALS) {
  // The mass the ~1.7 ratio multiplies. The geometry premium (fort ×
  // terrain) lives inside the ratio (sheet 7 measured it against a realm
  // defending with typical fort geometry), so the base is raw mass. WHICH
  // mass is unsealed: sheet 7's measured 4,000 was border-fortress
  // garrison + field reserve — interior/capital garrisons joined only in
  // later war stages. Swept in sheet 10.
  switch (D.shieldBase) {
    case 'total': return realm.field + realm.garrisons;
    case 'field': return realm.field;
    default: return realm.field + (realm.shieldGarrisons ?? 0); // 'shieldLine'
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
  const candShield = shieldMass(cand, D) + vassals.reduce((s, v) => s + shieldMass(v, D), 0);

  // leadership: candProj ≥ ratio × every in-balance shield
  const leadershipRows = inBalance.map((x) => ({
    name: x.realm.name, need: D.shieldRatio * shieldMass(x.realm, D),
    pass: candProj >= D.shieldRatio * shieldMass(x.realm, D),
  }));
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

  return {
    candProj, candShield, leadership, leadershipRows,
    coalition, coalitionNeed, unassailable,
    inBalance: inBalance.map((x) => x.realm.name),
    outOfBalance: outOfBalance.map((x) => `${x.realm.name}(투사 ${x.proj})`),
    trips: leadership && unassailable,
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
  return { territorial, economic, capitalRisk,
    total: territorial + economic + capitalRisk };
}

// 수락 산술 (sealed): accept iff bundle value ≤ expected loss × coefficient.
// Deterministic, true values, no dice.
function accepts(bundleValue, expectedLossTotal, coeff) {
  return bundleValue <= expectedLossTotal * coeff;
}

module.exports = {
  MATCH_DIALS, projectable, shieldMass, hegemonyCheck,
  presetBundle, expectedContinuedLoss, accepts,
};
