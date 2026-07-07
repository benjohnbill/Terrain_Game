'use strict';
// PROTOTYPE — tactical plan AI judgment module (pure, no I/O).
// Sealed design: docs/features/tactical-plan-ai/RULINGS.md ①–⑥.
// The estimate band MIRRORS the sealed fog slice-1 model (js/intel.js,
// design spec 2026-07-01 §5); tests/plan-ai.test.js pins the mirror to the
// real implementation — change intel.js and this file together or that
// fidelity test fails.

// ── fog §5 estimate band (mirror of js/intel.js) ──────────────────────
const DECAY_FLOOR = 0.45;   // glimpse floor: below this the occupant is unknown
const MAX_CONFIDENCE = 0.9; // enemy land is never perfectly known
const U_AT_FLOOR = 1.0;
const U_AT_CEIL = 0.15;
const WIDTH_PCT = 0.35;
const WIDTH_ABS = 1.0;

function round2(value) { return Math.round(value * 100) / 100; }

function uncertainty(confidence) {
  const c = Math.max(DECAY_FLOOR, Math.min(MAX_CONFIDENCE,
    typeof confidence === 'number' ? confidence : 0));
  const frac = (c - DECAY_FLOOR) / (MAX_CONFIDENCE - DECAY_FLOOR);
  return U_AT_FLOOR + frac * (U_AT_CEIL - U_AT_FLOOR);
}

function seedToUnit(seed) {
  const s = Math.sin(((seed >>> 0) + 1) * 12.9898) * 43758.5453;
  return s - Math.floor(s);
}

function estimateBand(trueValue, confidence, seed) {
  const t = typeof trueValue === 'number' && trueValue > 0 ? trueValue : 0;
  const u = uncertainty(confidence);
  const half = (t * WIDTH_PCT + WIDTH_ABS) * u;
  const width = 2 * half;
  const p = seedToUnit(typeof seed === 'number' ? seed : 0);
  const low = Math.min(t, Math.max(0, round2(t - p * width)));
  const high = Math.max(t, round2(t + (1 - p) * width));
  return { low, high, mid: round2((low + high) / 2), width: round2(width) };
}

// ── disposition dial (Ruling ②) ───────────────────────────────────────
// λ ∈ [−1 pessimist .. +1 optimist]: pessimist reads the enemy strong
// (high end), optimist weak (low end). Collapsed band ⇒ dial is inert.
function judgedValue(band, disposition) {
  const lambda = Math.max(-1, Math.min(1, typeof disposition === 'number' ? disposition : 0));
  return round2(band.mid - lambda * (band.high - band.low) / 2);
}

// ── eligibility gates (Ruling ③: objective facts, never misjudged) ────
// Harness rules (가안): DP/SI need a fort to erode/starve; Crossing needs
// water; Flanking needs a seam — open ground only (no choke door, no
// water); Encirclement needs the isolation gate (M7: thresholds are
// scoring lines, these gates are the availability layer).
function eligiblePlans(site) {
  const fort = site.fort || 'none';
  const chokeCap = site.chokeCap ?? Infinity;
  const plans = ['Swift', 'Raid'];
  if (fort !== 'none') plans.push('DP', 'SI');
  if (site.water) plans.push('Crossing');
  if (!site.water && chokeCap === Infinity) plans.push('Flanking');
  if (site.defenderIsolated) plans.push('Encirclement');
  return plans;
}

// ── decisiveness ladder (Ruling ①) ────────────────────────────────────
// What a successful plan buys, as an ordinal: vassalization >
// annihilation > advance(=occupation) > erosion > loot.
const RUNGS = {
  Encirclement: 5, Flanking: 4,
  Swift: 3, Crossing: 3, SI: 3,
  DP: 2, Raid: 1,
};

// Pick a plan for one engagement. `spec` is a resolve-style spec carrying
// TRUE defender values; `judgment` is either {confidence, disposition,
// seed} (ladder brain — judged R via an engine.resolve dry-run on the
// judged defender stock) or {random: rng} (R2 control — uniform among
// gate-eligible plans, judgment bypassed).
const { resolve } = require('./engine.js');

function choosePlan(spec, judgment) {
  const eligible = eligiblePlans(spec);
  if (judgment.random) {
    const plan = eligible[Math.floor(judgment.random() * eligible.length)];
    return { plan, eligible, rung: RUNGS[plan], forced: false, judgedStock: null, judgedR: null, judgedMargin: null };
  }
  const band = estimateBand(spec.defender.stock, judgment.confidence, judgment.seed);
  const judgedStock = judgedValue(band, judgment.disposition);
  let best = null, fallback = null;
  for (const plan of eligible) {
    const r = resolve({ ...spec, plan, defender: { ...spec.defender, stock: judgedStock } });
    const cand = { plan, eligible, rung: RUNGS[plan], judgedStock, judgedR: r.R, judgedMargin: r.margin };
    if (r.success) {
      if (!best || cand.rung > best.rung
        || (cand.rung === best.rung && cand.judgedMargin > best.judgedMargin)) best = cand;
    }
    if (!fallback || cand.judgedMargin > fallback.judgedMargin) fallback = cand;
  }
  if (best) return { ...best, forced: false };
  return { ...fallback, forced: true };
}

module.exports = { estimateBand, judgedValue, eligiblePlans, choosePlan, RUNGS };
