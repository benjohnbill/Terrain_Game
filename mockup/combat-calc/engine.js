'use strict';
// PROTOTYPE — pure resolution engine mirroring the sealed magnitude-pass
// dials (docs/features/combat-formula/MAGNITUDE.md M1–M11, GLOSSARY.md,
// MATCHUP.md fractions, M12 draft pulse). No I/O. Not wired to game code.

const DIALS = {
  pool: 20,
  // M2 lever anchors, linear between
  leverAnchors: [[0, 1.0], [4, 1.25], [8, 1.5], [14, 1.75], [20, 2.0]],
  // M4 casualty engine
  casualtyBase: 0.12,
  casualtyExp: 1.4,
  routCliff: 0.30,          // within-engagement, loser-only
  routOpenLoss: 0.50,       // escape OPEN: fraction of remainder lost; rest disperse
  // M5 world ladders (no engine clamp)
  terrain: { plains: 1.0, forest: 1.2, hills: 1.2, mountains: 1.5, pass: 2.0, legendary: 2.5 },
  fort: { none: 1.0, fieldworks: 1.3, walls: 1.8, fortress: 2.4, legendary: 3.0 },
  erosionStep: 0.3,         // one DP-success stamp
  // ADR 0015 amended water penalties (attack-side only)
  water: { river: 0.85, riverOpposed: 0.70, strait: 0.70, straitOpposed: 0.55 /* confirmed: ruling ⑦ 2026-07-05 */ },
  // M7 thresholds (scoring lines, never availability gates)
  thresholds: { DP: 1.1, Raid: 1.2, SI: 1.3, Swift: 1.5, Crossing: 1.5, Flanking: 1.6, Encirclement: 2.2 },
  // M11 wall-assault caps (escalade family only) + erosion widening
  wallAssaultCap: { none: Infinity, fieldworks: 3000, walls: 2000, fortress: 1500, legendary: 1000 },
  wallCapWidenPerErosion: 500,
  escaladeFamily: ['Swift', 'Crossing', 'Encirclement', 'Raid'],
  // M10 matchup fractions (user-confirmed)
  flankFortDiscount: 0.5,   // effective fort = 1 + (fort-1)*0.5, no wall throttle
  flankEscapeDiscount: 0.5, // escape clause halves wherever it appears
  bandoIgyeok: 0.5,         // engaged body = 50% of a crossing force
  surrenderHarvest: 0.5,    // Encirclement-success winner casualties ×0.5
  delaying: { thresholdShift: 0.3, exchange: 0.5, escapeRate: 1.0 },
  // M9 reserve — movement schedule ruled 2026-07-05: 1 point awakens 12.5%
  // of the province's route-connected stock; 8 points (knee) = whole province
  reserve: { leverCap: 1.5, marchEffect: 0.5, awakenPerPoint: 0.125 },
  // M8 dial extracts used by the battery
  dpErosion: { base: -0.3, deep: -0.6, deepMargin: 0.5 },
  raidBurn: { base: -15, cap: -30, lootShare: 0.5 },
  // M12 draft pulse (가안 — NOT confirmed)
  pulse: {
    regenPerTurn: 0.10,       // of sustainable cap
    starvation: {             // turns since supply cut
      stage2Turn: 3,          // attack-incapable, -10%/turn
      stage3Turn: 5,          // defenseless: effective ×0.5, walls unmanned (fort ×1.0)
      bleedPerTurn: 0.10,
    },
    usableRecoveryPp: 10,
  },
};

// M2: piecewise-linear lever
function lever(points) {
  const a = DIALS.leverAnchors;
  const p = Math.max(0, Math.min(DIALS.pool, points));
  for (let i = 1; i < a.length; i++) {
    if (p <= a[i][0]) {
      const [x0, y0] = a[i - 1], [x1, y1] = a[i];
      return y0 + (y1 - y0) * (p - x0) / (x1 - x0);
    }
  }
  return a[a.length - 1][1];
}

// Resolve one atomic engagement. Spec:
// {
//   plan: 'Swift'|'DP'|'Raid'|'SI'|'Crossing'|'Flanking'|'Encirclement',
//   attacker: { stock, commit, quality?=1 },
//   defender: { stock, commit?=0, delaying?=false,
//               reserveStock?=0,       // arrived via 긴급 투입 (fights ×0.5, lever knee-capped)
//               starvationStage?=0 },  // 3 → effective ×0.5, walls unmanned
//   terrain: 'plains'|..., fort: 'none'|..., erosionStamps?=0,
//   water: null|'river'|'riverOpposed'|'strait'|'straitOpposed',
//   chokeCap?=Infinity,                // terrain choke on engaged attacker body
//   attackerEscapeOpen?=true, defenderEscapeOpen?=true,
//   defenderIsolated?=false,           // isolation gate satisfied (blocks escape)
//   defenderCrossing?=false,           // 반도이격 target
// }
function resolve(spec) {
  const D = DIALS;
  const notes = [];
  const A = { quality: 1, ...spec.attacker };
  const B = { commit: 0, delaying: false, reserveStock: 0, starvationStage: 0, ...spec.defender };
  const erosion = spec.erosionStamps || 0;

  // --- fortification after erosion; stage-3 starvation unmans walls
  let fortMult = Math.max(1.0, D.fort[spec.fort || 'none'] - erosion * D.erosionStep);
  if (B.starvationStage >= 3) { fortMult = 1.0; notes.push('starvation stage 3: walls unmanned (fort ×1.0)'); }
  // Flanking enters at the seam
  let effFort = fortMult;
  if (spec.plan === 'Flanking' && fortMult > 1) {
    effFort = 1 + (fortMult - 1) * D.flankFortDiscount;
    notes.push(`Flanking fort discount: ${fortMult.toFixed(2)} → ${effFort.toFixed(2)}`);
  }

  // --- engaged attacker body: terrain choke ∩ wall-assault cap (escalade family only)
  let cap = spec.chokeCap ?? Infinity;
  if (D.escaladeFamily.includes(spec.plan) && (spec.fort || 'none') !== 'none' && B.starvationStage < 3) {
    const wallCap = D.wallAssaultCap[spec.fort] + erosion * D.wallCapWidenPerErosion;
    if (spec.plan !== 'Raid') cap = Math.min(cap, wallCap); // raids never assault walls
  }
  const engagedA = Math.min(A.stock, cap);
  if (engagedA < A.stock) notes.push(`frontage throttles attacker: ${A.stock} → ${engagedA} engaged`);

  // --- engaged defender body: 반도이격
  let defBody = B.stock;
  let defEscapeOpen = spec.defenderEscapeOpen !== false;
  if (spec.defenderCrossing) {
    defBody = Math.round(B.stock * D.bandoIgyeok);
    defEscapeOpen = false; // water side counts as blocked for the engaged body
    notes.push(`반도이격: engaged defender body ${B.stock} → ${defBody}, water blocks escape`);
  }
  if (spec.defenderIsolated) defEscapeOpen = false;

  // --- effective defender substance: reserve arrivals fight at 50%
  let defEff = defBody + B.reserveStock * D.reserve.marchEffect;
  if (B.starvationStage >= 3) { defEff *= 0.5; notes.push('starvation stage 3: defender effective ×0.5'); }

  // --- levers
  const levA = lever(A.commit);
  let levB = lever(B.commit);
  const reserveOnly = B.reserveStock > 0 && B.commit > 0 && spec.defenderReserveLever;
  if (reserveOnly) levB = Math.min(levB, D.reserve.leverCap);

  // --- powers
  const waterPen = spec.water ? D.water[spec.water] : 1.0;
  const attackPower = engagedA * levA * A.quality * waterPen;
  const defensePower = defEff * levB * D.terrain[spec.terrain || 'plains'] * effFort;
  const R = attackPower / defensePower;

  // --- headline
  let threshold = D.thresholds[spec.plan];
  if (B.delaying) threshold += D.delaying.thresholdShift;
  const success = R >= threshold;
  const margin = R - threshold;

  // --- casualty curve (headline-blind), on engaged bodies
  const exchange = B.delaying ? D.delaying.exchange : 1.0;
  let fracA = Math.min(1, D.casualtyBase / Math.pow(R, D.casualtyExp)) * exchange;
  let fracB = Math.min(1, D.casualtyBase * Math.pow(R, D.casualtyExp)) * exchange;
  if (spec.plan === 'Encirclement' && success) {
    fracA *= D.surrenderHarvest;
    notes.push('항복 수확: attacker casualties ×0.5 (success only)');
  }
  let lossA = Math.round(engagedA * fracA);
  let lossB = Math.round(defBody * fracB);
  let dispersedB = 0, escapedB = 0, routed = null;

  // --- rout cliff: headline loser only
  const headlineLoser = success ? 'defender' : 'attacker';
  if (headlineLoser === 'defender' && fracB >= D.routCliff) {
    routed = 'defender';
    const remainder = defBody - lossB;
    if (B.delaying) {
      // refusal sells escape: remainder escapes at 100% (Flanking halves it)
      let esc = D.delaying.escapeRate;
      if (spec.plan === 'Flanking') { esc *= D.flankEscapeDiscount; notes.push('Flanking escape-hunt: refusal escape 100% → 50%'); }
      escapedB = Math.round(remainder * esc);
      lossB += remainder - escapedB;
      notes.push(`delaying rout: ${escapedB} escape, ${remainder - escapedB} caught`);
    } else if (!defEscapeOpen) {
      lossB = defBody; // annihilation, no regeneration debt
      notes.push('escape BLOCKED → 100% lost (no regeneration debt)');
    } else {
      let openLoss = D.routOpenLoss;
      if (spec.plan === 'Flanking') { openLoss = 0.75; notes.push('Flanking escape-hunt: open-rout survival 50% → 25%'); }
      const extra = Math.round(remainder * openLoss);
      dispersedB = remainder - extra;
      lossB += extra;
      notes.push(`rout, escape OPEN → +${extra} lost in pursuit, ${dispersedB} disperse`);
    }
  }
  if (headlineLoser === 'attacker' && fracA >= D.routCliff) {
    routed = 'attacker';
    const remainder = engagedA - lossA;
    const open = spec.attackerEscapeOpen !== false;
    const extra = open ? Math.round(remainder * D.routOpenLoss) : remainder;
    lossA += extra;
    notes.push(`ATTACKER routs (${open ? 'escape open' : 'escape blocked'}): +${extra} lost`);
  }

  return {
    plan: spec.plan, R, threshold, success, margin,
    engagedA, defBody, attackPower, defensePower,
    levA, levB, waterPen, effFort, fortMult,
    fracA, fracB, lossA, lossB, dispersedB, escapedB, routed,
    stockAfterA: A.stock - lossA,
    // in-sector survivors; dispersed melt into population, escaped relocate
    stockAfterB: Math.max(0, B.stock - lossB - dispersedB - escapedB),
    survivorsB: { dispersed: dispersedB, escaped: escapedB },
    notes,
  };
}

// M9 movement schedule: reserve points → bodies awakened from the
// province's route-connected stock (integer ledger rounds down).
function reserveAwaken(provinceStock, points) {
  const frac = Math.min(1, Math.max(0, points) * DIALS.reserve.awakenPerPoint);
  return Math.floor(provinceStock * frac);
}

module.exports = { DIALS, lever, resolve, reserveAwaken };
