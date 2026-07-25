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

// -- Surge Draft Model (MT-③): mobilization intensity (serving ÷ register)
// prices each drafted/regenerated man via a continuous piecewise-linear
// marginal curve. This is the "blind" — register erosion (permanent deaths)
// raises steady-state intensity, dragging sustained war into the steep
// desperation tail. Knees anchor to MT-④ start-state coordinates. ALL
// values are placeholder 가안 for SHAPE testing; the magnitude session owns
// the numbers (fullMult = the tunable steepness S). base = sealed 1부대 =
// 0.5 yield → 0.005 yield/man.
const SURGE = {
  base: 0.005,      // yield/man in 평시 (i ≤ peaceKnee)
  peaceKnee: 0.42,  // MT-④ start intensity — top of the flat peace band
  warKnee: 0.58,    // MT-④ structural max — top of the 전시 ramp
  warMult: 2,       // price × base at warKnee
  fullMult: 12,     // price × base at i = 1.0 (desperation steepness — TUNABLE S)
};

// marginal yield-per-man at mobilization intensity i
function intensityPrice(i, D = SURGE) {
  if (i <= D.peaceKnee) return D.base;
  if (i <= D.warKnee) {
    const t = (i - D.peaceKnee) / (D.warKnee - D.peaceKnee);
    return D.base * (1 + (D.warMult - 1) * t);
  }
  const t = (i - D.warKnee) / (1 - D.warKnee);
  return D.base * (D.warMult + (D.fullMult - D.warMult) * t);
}

// integral pricing: bill for moving intensity iPre→iPost = the area under
// the marginal curve × register (men per unit intensity = register). Exact
// for the piecewise-linear curve by splitting trapezoids at the knees.
function draftBill(register, iPre, iPost, D = SURGE) {
  if (iPost <= iPre) return 0;
  const knees = [D.peaceKnee, D.warKnee].filter((k) => k > iPre && k < iPost);
  const pts = [iPre, ...knees, iPost];
  let area = 0;
  for (let k = 0; k < pts.length - 1; k++) {
    const a = pts[k], b = pts[k + 1];
    area += (intensityPrice(a, D) + intensityPrice(b, D)) / 2 * (b - a);
  }
  return register * area;
}

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

const _api = { ECON_DIALS, SURGE, intensityPrice, draftBill, income, nationalCap, recruitCost, sector, midRealm, centerRealm };
if (typeof module !== 'undefined' && module.exports) module.exports = _api;
else (window.TC = window.TC || {}).econ = _api;
