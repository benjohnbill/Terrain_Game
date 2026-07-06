'use strict';
// PROTOTYPE — A-3 thin-economy candidate structure (battery sheet 13).
// EVERYTHING here is 가안 unless marked otherwise: the sheet prices it,
// the user rules it, the sealed result goes to MAGNITUDE (M14 draft).
// Structure goal (handoff §A-3): the minimum that makes M13 prices and
// 정산 codable — sector yield, treasury, and what raises the national
// cap (ruling ⑮: cap growth = the match-closure lever).
//
// Design spine (candidate, closes autonomously if the battery holds):
// EVERYTHING DERIVES FROM SECTOR VALUES × USABLE — no new stored state.
//   income  = Σ economyValue × usableEconomy        (yield/turn)
//   cap     = capPerPop × Σ populationValue × usablePop
// Conquest raises cap because sectors arrive (at reduced usable);
// raids lower cap because usable burns (raid-attrition's missing
// end-game lever); development raises a sector's values permanently.

const ECON_DIALS = {
  // -- the unit (definition, not a dial): 1 ordinary sector at usable
  // 1.0 produces 1 sector-turn yield --
  sectorYield: 1.0,
  richYield: 1.5,            // authored center-seat sectors (가안)
  menPerYield: 200,          // SEALED anchor (M13): 1 부대(100명) = 0.5 yield

  // -- treasury: realm-level stock; unspent yield accumulates.
  // 배상 (indemnity) lands here — pays spec gap #6 (indemnity spend) --
  treasuryStart: 5,          // 가안: small war chest at match start

  // -- national cap derived from population × usable (ruling ⑮ made
  // mechanical). capPerPop calibrated so the SEALED anchors re-derive:
  // mid realm ≈ 6,000 / center ≈ 9,000 (sheet 9) --
  capPerPop: 600,            // cap men per (populationValue × usablePop) point

  // -- fortification build prices (M5 rider: multiple primaries +
  // resources; wonder-class ≈ 1/3 of a match) --
  fortCost: {
    fieldworks: { primaries: 1, yield: 2 },
    walls:      { primaries: 2, yield: 6 },
    fortress:   { primaries: 4, yield: 12 },
    legendary:  { primaries: 8, yield: 30 },  // ≈ 8 turns ≈ 1/3 of 24
  },

  // -- development: the non-conquest cap/income lever (가안 shape:
  // one step per sector, permanent) --
  development: {
    primaries: 1, yield: 4,
    economyStep: 0.5,        // +0.5 yield/turn on the sector
    populationStep: 0.5,     // +0.5 pop → +300 cap at capPerPop 600
    maxStepsPerSector: 1,
  },

  // -- recruitment price (M13 sealed): +10% of cap per primary, paid
  // from treasury at menPerYield --
  recruitFrac: 0.10,
};

// sectors: [{ economyValue, populationValue, usableEconomy, usablePop }]
function income(sectors, D = ECON_DIALS) {
  return sectors.reduce((s, x) => s + x.economyValue * x.usableEconomy, 0);
}

function nationalCap(sectors, D = ECON_DIALS) {
  return Math.round(sectors.reduce((s, x) =>
    s + D.capPerPop * x.populationValue * x.usablePop, 0));
}

function recruitCost(cap, D = ECON_DIALS) {
  const men = Math.round(cap * D.recruitFrac);
  return { men, yield: men / D.menPerYield };
}

// convenience: an ordinary template sector at full usable
function sector(econ = 1, pop = 1, usableE = 1, usableP = 1) {
  return { economyValue: econ, populationValue: pop,
    usableEconomy: usableE, usablePop: usableP };
}

// template realms re-deriving the sealed M13 anchors
function midRealm(D = ECON_DIALS) {
  // 10 ordinary sectors, pop 1 each → cap 600 × 10 = 6,000 ✓ (M13)
  return Array.from({ length: 10 }, () => sector());
}
function centerRealm(D = ECON_DIALS) {
  // 12 sectors, rich (econ 1.5 / pop 1.25) → cap 600 × 15 = 9,000 ✓
  return Array.from({ length: 12 }, () => sector(D.richYield, 1.25));
}

const _api = { ECON_DIALS, income, nationalCap, recruitCost, sector, midRealm, centerRealm };
if (typeof module !== 'undefined' && module.exports) module.exports = _api;
else (window.TC = window.TC || {}).econ = _api;
