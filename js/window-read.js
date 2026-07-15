'use strict';

/* window-read.js — the opportunism window read (slice-2 spec §7, C1).
 *
 * ONE function (windowRead), TWO consumers: a peacetime declaration threshold
 * and a wartime argmax target pick. The read is the ratio of my deliverable
 * effective force at a front to what actually defends it now:
 *
 *   window(X) = numerator / denominator
 *   numerator   = substance × arrival-effectiveness × commit lever × quality
 *   denominator = judged-garrison × terrain × fort × posture-factor
 *                 + Σ (enemy detachments whose reach cone intersects the
 *                      response window), each judged the same way
 *
 * Pure and stateless. Every term composes a SEALED slice-2 primitive — intel
 * reach cones + estimate bands (js/intel.js), fatigue effectiveness
 * (js/fatigue.js), battle sidePower + shield multipliers (js/battle.js),
 * movement paths (js/movement.js). It invents no new information rule (spec §7
 * "no new information rules"): the read extends the sealed U4 pickTarget
 * grammar (judged garrison × public multipliers, softest reachable — FG-⑦)
 * with the reach/fatigue/commit terms, rather than authoring a new read.
 *
 * Own-force projections are exact (no fog on self, D1 / spec §6); only
 * enemy-dependent terms are banded and judged. The disposition dial λ
 * (tactical-plan-ai TP②, birthplace mockup/combat-calc/plan-ai.js judgedValue)
 * is the single knob for reading every unknown that carries a scoutable band;
 * the standing posture — dark-market (spec §6), carrying no band — is priced by
 * the worst-case rule below.
 *
 * ─ In-ticket ruling (posture pricing: worst-case vs expected-value) ─────────
 * DECIDED: WORST-CASE — the read prices the standing posture at the worst
 * PLAUSIBLE value rather than averaging over the enemy court's hidden choice.
 * The standing posture is an unknown CATEGORICAL, not a scoutable band: spec §6
 * places commit/posture in the dark market (깜깜이 시장), unreachable at any
 * confidence. Reasons:
 *   1. Expected-value would need a prior distribution over the enemy court's
 *      hidden choice — information the dark-market seal says the bot cannot
 *      have. Averaging fabricates that prior; worst-case assumes only that the
 *      enemy is competent (bot doctrine §9: personality lives in information and
 *      disposition, never in fabricated knowledge or a calculation handicap).
 *   2. Worst-case makes reconnaissance the lever that OPENS windows: absent
 *      positive information the read assumes a prepared defender; a quiet border
 *      alarm or a reserve confirmed elsewhere lets the caller pass a lower
 *      front.postureCommit, stepping the read down toward the caught-flat
 *      baseline (commit 0 → ×1.0). This is §8's "information converts prevention
 *      into pre-emption" and §7's requirement that pinning pay off.
 *   3. The attacker earns first-blow decisiveness (§8) by MANUFACTURING the
 *      low-posture / no-reserve state through operations, never for free —
 *      worst-case default is what makes that manufacturing necessary.
 *
 * NOT literal minimax (the absolute ceiling, commit 20 → ×2.0): that value is
 * unreachable in the world's own arithmetic, because commit is ONE non-bankable
 * realm pool (ticket 04 / spec §4) — a defender cannot stand at maximum commit
 * on every sector at once, so pricing every front at the ceiling would assume an
 * enemy the budget forbids. The default is the worst posture a competent court
 * can actually hold: POSTURE_WORST_COMMIT = 8, the M2 knee (×1.5). Minimax over
 * a resource the enemy does not have is not caution, it is a different fiction.
 *
 * Flagged for measurement (ticket 10): worst-case pricing biases toward fewer
 * declarations and could re-freeze the war; the appetite threshold 가안 absorbs
 * that calibration. This is a MEASUREMENT concern, not a correctness one.
 *
 * Corollary (spec-mandated asymmetry, NOT an inconsistency): the standing
 * posture is worst-cased, while a RESPONDING detachment's commit slack is
 * λ-judged. This is §7's own split — the denominator prices the standing shield
 * as "standing posture = unknown categorical — priced, not known" (no band
 * exists to judge), but each responder's term as "their commit slack
 * (disposition estimate — TP② λ reuse)". The two are different quantities: a
 * posture already stands (a taken choice the read cannot see), while a
 * responder's commit is a FUTURE allotment the court has not yet made — the
 * disposition estimate is the sealed instrument for exactly that read.
 */

const Intel = (typeof module !== 'undefined' && module.exports) ? require('./intel.js') : window.IntelSystem;
const Fatigue = (typeof module !== 'undefined' && module.exports) ? require('./fatigue.js') : window.Fatigue;
const Battle = (typeof module !== 'undefined' && module.exports) ? require('./battle.js') : window.Battle;
const Movement = (typeof module !== 'undefined' && module.exports) ? require('./movement.js') : window.Movement;

/* 가안 dials — slice-2 spec §7 (provisional; ticket 10 measures, magnitude pass
   re-cuts). COMMIT_MAX is NOT 가안 — it cites the sealed M2 lever ceiling
   (birthplace = combat-formula MAGNITUDE M2; battle.js commitLever clamps to the
   same value but does not export it, so this is a citation, not a second dial). */
const APPETITE_THRESHOLD = 1.7;    // 가안 — declaration gate, replacing the static ~1.7 attackRatio
const POSTURE_WORST_COMMIT = 8;    // 가안 — worst PLAUSIBLE standing-posture commit (M2 knee, ×1.5); see the posture ruling
const COMMIT_MAX = 20;             // sealed (cited) — M2 commit-lever ceiling

function round2(value) {
  return Math.round(value * 100) / 100;
}

/* Sealed λ band-judgment (port; birthplace = tactical-plan-ai TP②,
   mockup/combat-calc/plan-ai.js judgedValue — same formula, cited not
   redesigned, exactly as battle.js ports the MAGNITUDE dials). λ ∈ [−1
   pessimist .. +1 optimist]: pessimist reads the band HIGH (enemy strong),
   optimist LOW (enemy weak); a collapsed band makes the dial inert. The
   convention assumes higher-value = stronger-enemy (substance, garrison,
   commit). For an INVERSE-strength band (fatigue wear, where higher = weaker)
   the caller negates the disposition — see readWear. */
function judgeBand(band, disposition) {
  if (!band) return 0;
  const lambda = Math.max(-1, Math.min(1, typeof disposition === 'number' ? disposition : 0));
  return round2(band.mid - lambda * (band.high - band.low) / 2);
}

/* Fatigue wear read: judged with INVERTED disposition because wear is inverse
   strength — a pessimist assumes the enemy arrives fresher (lower wear), which
   is the low end. Negating λ before judgeBand keeps one convention. */
function readWear(band, disposition) {
  return judgeBand(band, -(typeof disposition === 'number' ? disposition : 0));
}

/* Projected arrival along the path to X: ETA in turns and the effectiveness the
   force would field on arrival. The march accrues wear per hex; NO mid-march
   recovery is credited — the read treats the march as pure corrosion (§8's
   corroding-asset doctrine; recovery is a stationary reward, not a projection
   windfall). Forced march trades a shorter ETA for premium wear on the hexes
   beyond speed S. Unreachable X → { reached: false }. Own-force terms are exact
   (no fog on self), so no band-judging here. */
function projectArrival(graph, fromKey, toKey, currentWear, speed, opts = {}) {
  const path = Movement.shortestPath(graph, fromKey, toKey);
  if (!path) return { reached: false };
  const hexes = path.length - 1;                       // 0 when already at X
  const perTurn = Math.max(1, speed) + (opts.forcedMarch ? Fatigue.forcedMarchExtraHexCap() : 0);
  const eta = Math.ceil(hexes / perTurn);              // hexes 0 → eta 0 (already there)
  const normalCoverage = Math.max(1, speed) * eta;     // hexes coverable at speed S over ETA turns
  const extraHexes = opts.forcedMarch ? Math.max(0, hexes - normalCoverage) : 0;
  const wear = (currentWear || 0)
    + Fatigue.marchAccrual(hexes - extraHexes)
    + Fatigue.forcedMarchAccrual(extraHexes);
  return { reached: true, eta, hexes, arrivalWear: round2(wear), effectiveness: Fatigue.effectiveness(wear) };
}

/* Which enemy detachments actually defend X now, and their combined power. A
   detachment defends X only when its reach cone (sealed intel.reachCone, grown
   by its staleness PLUS my ETA — during my march it keeps moving) reaches X's
   hex. A detachment flagged engaged (pinned elsewhere — see applyFeints) is
   excluded. Each responder is judged the same way the garrison is: substance +
   commit by λ, arrival fatigue by the wear inversion, open field so no
   terrain/fort (WM-① unchanged — the decisive battle is fought in the open). */
function defenderResponse(graph, targetKey, detachments, myETA, speed, disposition) {
  const responders = [];
  let power = 0;
  for (const det of detachments || []) {
    if (det.engaged) continue;
    const cone = Intel.reachCone(graph, det.fixKey, (det.turnsUnobserved | 0) + myETA, speed);
    if (!cone.includes(targetKey)) continue;           // cone does not reach X within the response window
    const path = Movement.shortestPath(graph, det.fixKey, targetKey);
    const dist = path ? path.length - 1 : 0;
    const substance = Math.max(0, judgeBand(det.substanceBand, disposition));
    // A responder's commit slack is a FUTURE allotment, so it is λ-judged over the
    // full M2 range (spec §7 "their commit slack — disposition estimate, λ reuse";
    // contrast the standing posture, worst-cased — see the header corollary). The
    // band spans the whole range, so judgeBand already returns within [0, COMMIT_MAX].
    const commit = judgeBand({ low: 0, high: COMMIT_MAX, mid: COMMIT_MAX / 2 }, disposition);
    const arrivalWear = Math.max(0, readWear(det.fatigueBand, disposition)) + Fatigue.marchAccrual(dist);
    const p = Battle.sidePower({ substance, commit, quality: 1, fatigue: Fatigue.effectiveness(arrivalWear) });
    power += p;
    responders.push({ fixKey: det.fixKey, dist, substance, commit, power: round2(p) });
  }
  return { responders, power };
}

/* THE window read — one function, run per candidate front. Returns the window
   ratio plus the pieces the consumers and the display need. `pinned` (묶임) is
   true when no enemy detachment's cone reaches X: the denominator is the
   standing shield alone, so the blow would land unanswered. */
function windowRead(cfg) {
  const { graph, speed, disposition = 0, attacker, front, detachments = [], forcedMarch = false } = cfg;
  const arrival = projectArrival(graph, attacker.fromKey, front.hexKey, attacker.wear, speed, { forcedMarch });
  if (!arrival.reached) {
    return { reachable: false, ratio: 0, pinned: true, numerator: 0, denominator: 0, eta: Infinity, responders: [], forcedMarch };
  }

  // Numerator — my deliverable force at X (exact; no fog on self).
  const numerator = Battle.sidePower({
    substance: attacker.substance,
    commit: attacker.commit,
    quality: attacker.quality,           // undefined → sidePower's sealed 1.0 slot
    fatigue: arrival.effectiveness,
  });

  // Denominator — the standing shield (garrison judged by λ × public terrain·fort
  // × the worst-case posture factor) plus every responding detachment.
  const judgedGarrison = Math.max(0, judgeBand(front.garrisonBand, disposition));
  const postureCommit = front.postureCommit != null ? front.postureCommit : POSTURE_WORST_COMMIT;
  // The M5 shield product stays battle.js's (garrison × terrain × fort — one
  // composition shape, one home); the read only supplies the λ-judged garrison
  // and multiplies in the posture factor the standing shield fights at.
  const shield = Battle.shieldPower({
    garrison: judgedGarrison, terrain: front.terrain, fortification: front.fortification,
  }) * Battle.commitLever(postureCommit);

  const resp = defenderResponse(graph, front.hexKey, detachments, arrival.eta, speed, disposition);
  const denominator = shield + resp.power;
  const ratio = denominator > 0 ? numerator / denominator : Infinity;

  return {
    reachable: true,
    ratio: denominator > 0 ? round2(ratio) : ratio,
    pinned: resp.responders.length === 0,
    numerator: round2(numerator),
    denominator: round2(denominator),
    shield: round2(shield),
    responderPower: round2(resp.power),
    eta: arrival.eta,
    forcedMarch,
    responders: resp.responders,
  };
}

/* Pinning (묶임) engineering: a feint placed inside a detachment's reach cone
   occupies it — a detachment can respond to one place, so a feint its cone
   reaches draws it off every OTHER front (spec §7 "exhausting the opponent's
   cones with feints"; the per-detachment game of §4). Returns a COPY of the
   detachment list with the drawn-off ones flagged engaged; windowRead then
   reads the real target as pinned. WHICH feints to spend is bot behavior (the
   operational layer, wired in a later ticket) — this helper is the mechanism
   the read exposes so that pinning can emerge. */
function applyFeints(graph, detachments, feintKeys, myETA, speed) {
  const feints = feintKeys || [];
  return (detachments || []).map((det) => {
    if (det.engaged) return det;
    const cone = Intel.reachCone(graph, det.fixKey, (det.turnsUnobserved | 0) + myETA, speed);
    return feints.some((f) => cone.includes(f)) ? { ...det, engaged: true } : det;
  });
}

/* CONSUMER 1 (wartime): argmax window(X) over the candidate fronts. Each front
   is read at both march modes; the better window is kept (forced march trades
   arrival wear for a shorter ETA that can shrink the defender's response cones —
   the trade is emergent, not scripted). Returns { front, read } or null. */
function readFronts(fronts, ctx) {
  return (fronts || []).map((front) => {
    const normal = windowRead({ ...ctx, front, forcedMarch: false });
    // Forced march can only differ when the march is long enough to spend the
    // premium — an ETA of at most one turn at ordinary speed already arrives.
    if (!normal.reachable || normal.eta <= 1) return { front, read: normal };
    const forced = windowRead({ ...ctx, front, forcedMarch: true });
    return { front, read: forced.ratio > normal.ratio ? forced : normal };
  });
}

function bestTarget(reads) {
  let best = null;
  for (const r of reads || []) {
    if (!r.read || !r.read.reachable) continue;
    if (!best || r.read.ratio > best.read.ratio) best = r;
  }
  return best;                                          // { front, read } or null
}

/* CONSUMER 2 (peacetime): the same argmax read, gated by the appetite threshold.
   The window crossing the threshold IS the war-declaration signal (spec §7),
   replacing the static ~1.7 attackRatio gate. Returns the front to declare on,
   or null when no window is appetising enough. Both consumers read the SAME
   windowRead output — declaration merely adds the threshold gate. */
function declaration(reads, threshold = APPETITE_THRESHOLD) {
  const best = bestTarget(reads);
  return best && best.read.ratio >= threshold ? best : null;
}

const _api = {
  APPETITE_THRESHOLD, POSTURE_WORST_COMMIT, COMMIT_MAX,
  judgeBand, readWear, projectArrival, defenderResponse,
  windowRead, applyFeints, readFronts, bestTarget, declaration,
};
if (typeof module !== 'undefined' && module.exports) module.exports = _api;
else (window.WindowRead = window.WindowRead || {}), Object.assign(window.WindowRead, _api);
