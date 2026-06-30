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

  // The only mutator: refresh one hex's confidence at the start of a round.
  function maintainConfidence(hex, humanFactionId) {
    if (!hex) return;
    if (hex.owner === humanFactionId) {
      hex.informationConfidence = OWNED_CONFIDENCE;
    } else {
      hex.informationConfidence = decay(hex.informationConfidence);
    }
  }

  window.IntelSystem = Object.freeze({
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
    maintainConfidence
  });
})();
