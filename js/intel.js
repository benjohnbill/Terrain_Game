/* ============================================================
 * intel.js — information confidence model (scouting / fog)
 *
 * Pure helpers (applyScout, decay, tierOf, isReliable) plus the
 * single mutator maintainConfidence. No DOM, no game-state access.
 * This module is the only source of truth for confidence numbers.
 * ============================================================ */

(function () {
  'use strict';

  const UNCERTAINTY_THRESHOLD = 0.55; // below this a hex reads as "uncertain"
  const RELIABLE_THRESHOLD = 0.75;    // at/above this the forecast is trustworthy
  const SCOUT_GAIN = 0.25;            // confidence added by one scout action
  const DECAY_PER_TURN = 0.05;        // confidence lost each round when unobserved
  const DECAY_FLOOR = 0.45;           // ambient awareness floor for non-owned hexes
  const OWNED_CONFIDENCE = 0.85;      // confidence the player has over owned land
  const MAX_CONFIDENCE = 0.9;         // enemy land is never perfectly known

  function round2(value) {
    return Math.round(value * 100) / 100;
  }

  function applyScout(current) {
    const base = typeof current === 'number' ? current : DECAY_FLOOR;
    return round2(Math.min(MAX_CONFIDENCE, base + SCOUT_GAIN));
  }

  function decay(current) {
    const base = typeof current === 'number' ? current : DECAY_FLOOR;
    return round2(Math.max(DECAY_FLOOR, base - DECAY_PER_TURN));
  }

  function isReliable(confidence) {
    return typeof confidence === 'number' && confidence >= UNCERTAINTY_THRESHOLD;
  }

  function tierOf(confidence) {
    const c = typeof confidence === 'number' ? confidence : 0;
    if (c < UNCERTAINTY_THRESHOLD) return { id: 'low', label: '불확실' };
    if (c < RELIABLE_THRESHOLD) return { id: 'partial', label: '개략 파악' };
    return { id: 'reliable', label: '신뢰 가능' };
  }

  /* ── Estimate-range model (fog "ambiguous" magnitude — design spec §5) ──
   * Tuning knobs live here (see spec §11). Uncertainty maps a confidence scalar
   * to a band half-width: maximal at the glimpse floor, a small nonzero residual
   * at the enemy ceiling. It never collapses to exact — only ownership is exact. */
  const U_AT_FLOOR = 1.0;   // uncertainty at/below DECAY_FLOOR (0.45)
  const U_AT_CEIL = 0.15;   // residual uncertainty at/above MAX_CONFIDENCE (0.90)
  const WIDTH_PCT = 0.35;   // band half-width as a fraction of the true value at u = 1
  const WIDTH_ABS = 1.0;    // absolute half-width floor so the band never fully collapses

  function _clamp(value, lo, hi) {
    return Math.max(lo, Math.min(hi, value));
  }

  // Normalized uncertainty (U_AT_FLOOR .. U_AT_CEIL) from a confidence scalar.
  function _uncertainty(confidence) {
    const c = _clamp(typeof confidence === 'number' ? confidence : 0, DECAY_FLOOR, MAX_CONFIDENCE);
    const frac = (c - DECAY_FLOOR) / (MAX_CONFIDENCE - DECAY_FLOOR); // 0 at floor, 1 at ceiling
    return U_AT_FLOOR + frac * (U_AT_CEIL - U_AT_FLOOR);
  }

  // Stable unsigned 32-bit seed from hex coordinates (independent of gameplay RNG).
  function hexSeed(q, r) {
    const a = ((q | 0) * 73856093) | 0;
    const b = ((r | 0) * 19349663) | 0;
    return (a ^ b) >>> 0;
  }

  // Stable pseudo-random position in [0, 1) from a seed (no gameplay RNG).
  function _seedToUnit(seed) {
    const s = Math.sin(((seed >>> 0) + 1) * 12.9898) * 43758.5453;
    return s - Math.floor(s);
  }

  // A true-containing estimate range whose width shrinks as confidence rises and
  // whose center is offset from the truth by a stable per-hex position `p`, so the
  // midpoint is a guess rather than the answer.
  function estimateRange(trueValue, confidence, seed) {
    const t = typeof trueValue === 'number' && trueValue > 0 ? trueValue : 0;
    const u = _uncertainty(confidence);
    const half = (t * WIDTH_PCT + WIDTH_ABS) * u;
    const width = 2 * half;
    const p = _seedToUnit(typeof seed === 'number' ? seed : 0); // hidden position of the truth, [0,1)
    // Clamp so the true value is always contained even after independent rounding.
    const low = Math.min(t, Math.max(0, round2(t - p * width)));
    const high = Math.max(t, round2(t + (1 - p) * width));
    return { low, high, mid: round2((low + high) / 2), width: round2(width) };
  }

  // Coarse qualitative magnitude bucket for display. Thresholds are tuning knobs.
  function magnitudeBucket(value) {
    const v = typeof value === 'number' ? value : 0;
    if (v < 12) return '소';
    if (v < 22) return '중';
    if (v < 35) return '대';
    return '특대';
  }

  // The only mutator: refresh one hex's confidence at the start of a round.
  function maintainConfidence(hex, humanFactionId) {
    if (!hex) return;
    if (hex.owner === humanFactionId) {
      hex.informationConfidence = OWNED_CONFIDENCE;
    } else {
      hex.informationConfidence = decay(hex.informationConfidence);
    }
  }

  /* ── Detachment tracking (slice-2 spec §6, intel v2) ──────────────────────
   * A mobile enemy detachment is a snapshot-then-decay entity (Aging
   * constitution P3, consumed not re-legislated). Its record carries one
   * contact clock feeding two derived views: a confidence scalar (drives the
   * substance/fatigue estimate bands, above) and a raw turns-unobserved count
   * (drives the reach cone). Contact narrows and resets; each unobserved turn
   * re-widens and grows. Pure helpers: they return a fresh record, never mutate. */

  // A record's confidence, or undefined when there is no prior contact (so the
  // band/scout helpers fall back to their floor). One reader for both consumers.
  function _confidenceOf(record) {
    return record && typeof record.confidence === 'number' ? record.confidence : undefined;
  }

  // A sighting: fix the position, raise confidence (narrow the band), reset the
  // clock. `prev` may be null (first contact) — confidence rises from the floor.
  function observeDetachment(prev, fixKey) {
    return { fixKey, confidence: applyScout(_confidenceOf(prev)), turnsUnobserved: 0 };
  }

  // One unobserved turn: the fix stays, confidence decays (the band re-widens),
  // the clock advances (the cone grows). A null record stays null (untracked).
  function ageDetachment(prev) {
    if (!prev) return prev;
    return {
      fixKey: prev.fixKey,
      confidence: decay(prev.confidence),
      turnsUnobserved: (prev.turnsUnobserved | 0) + 1,
    };
  }

  // A fogged scalar (fatigue or substance) read off a tracked detachment: a
  // true-containing band whose width follows the record's contact clock. Fatigue
  // joins substance as a fogged attribute purely by reusing the estimate band.
  function detachmentBand(record, trueValue, seed) {
    return estimateRange(trueValue, _confidenceOf(record), seed);
  }

  // Positional knowledge: the set of hexes the detachment could occupy now —
  // every node within (turnsUnobserved × speed) graph steps of the last-seen
  // fix. Graph-agnostic (caller passes a movement-built { nodes, adj }); speed
  // is the caller's dial (movement owns it). Deterministic bounded BFS; radius
  // 0 collapses to the fix alone. Sorted output so equal histories compare equal.
  function reachCone(graph, fixKey, turnsUnobserved, speed) {
    if (!graph || !graph.nodes.has(fixKey)) return [];
    const radius = Math.max(0, turnsUnobserved | 0) * Math.max(0, speed | 0);
    const dist = new Map([[fixKey, 0]]);
    const queue = [fixKey];
    for (let i = 0; i < queue.length; i++) {
      const k = queue[i];
      const d = dist.get(k);
      if (d >= radius) continue;
      for (const nk of graph.adj.get(k)) {
        if (dist.has(nk)) continue;
        dist.set(nk, d + 1);
        queue.push(nk);
      }
    }
    return [...dist.keys()].sort();
  }

  // Coarse heading from a movement vector; null when the origin is unknown.
  function _headingOf(from, to) {
    if (!from || !to) return null;
    return { dq: Math.sign(to.q - from.q), dr: Math.sign(to.r - from.r) };
  }

  // Border alarm (봉수형): free, never-missed detection of any force ENTERING
  // the defender's border zone. Reveals existence + heading only — never scale
  // or state (deep strikes hide magnitude and posture, never existence). Fires
  // on the crossing turn (outside → inside); a force appearing inside (no known
  // origin) still fires, with an unknown heading. `movements` = [{ id, from, to }]
  // with from/to as { q, r } (from may be null); isBorderZone(coord) → boolean.
  //
  // Implementation rulings (flagged OPEN for the wiring/magnitude pass — spec §6):
  //  - The alarm carries existence + heading ONLY. Spec §6 floats a "~five-step
  //    threat-ladder" 가안 for bandwidth; it is deliberately NOT built here,
  //    because a threat magnitude would reveal scale and contradict the
  //    hide-scale seal ("deep strikes hide scale and state"). Revisit only if a
  //    coarse non-scale indicator is ever wanted.
  //  - "Never misses" is a contract on isBorderZone: it must be an INCLUSIVE
  //    frontier region (your side of the line), not a thin ring. Entry is judged
  //    at turn endpoints (marchStep exposes the destination, not the path), so a
  //    ring thinner than one turn's speed could be leapt without a `to` inside
  //    it. An inclusive region cannot be — any turn ending at or past the
  //    frontier ends `to`-inside. The tests model the region form (q ≥ threshold).
  function borderAlarm(movements, isBorderZone) {
    const alarms = [];
    for (const m of movements || []) {
      const entered = !!m.to && isBorderZone(m.to);
      const wasInside = !!m.from && isBorderZone(m.from);
      if (entered && !wasInside) {
        alarms.push({ id: m.id, exists: true, heading: _headingOf(m.from, m.to) });
      }
    }
    return alarms;
  }

  const IntelSystem = Object.freeze({
    UNCERTAINTY_THRESHOLD,
    RELIABLE_THRESHOLD,
    SCOUT_GAIN,
    DECAY_PER_TURN,
    DECAY_FLOOR,
    OWNED_CONFIDENCE,
    MAX_CONFIDENCE,
    applyScout,
    decay,
    isReliable,
    tierOf,
    maintainConfidence,
    hexSeed,
    estimateRange,
    magnitudeBucket,
    observeDetachment,
    ageDetachment,
    detachmentBand,
    reachCone,
    borderAlarm,
  });

  if (typeof window !== 'undefined') window.IntelSystem = IntelSystem;
  if (typeof module !== 'undefined' && module.exports) module.exports = IntelSystem;
})();
