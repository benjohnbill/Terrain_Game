'use strict';

/* field-army.js — field-army division and merge (slice-2 spec §4).
 *
 * The field army is the mobile part of a realm's substance — the user's device
 * for controlling R. It divides and merges freely as turn actions: no
 * detachment-count cap, because the system prices choices, it does not prohibit
 * them. The natural price of splitting is defeat in detail, and that emerges
 * from the sealed battle arithmetic (ratio core × M4 casualty exponent × rout
 * cliff) — no artificial rule lives here.
 *
 * An army is { size, position, fatigue: { wear, supply } }. Split inherits the
 * parent's fatigue state; merge takes the size-weighted average of every
 * ledger. Conservation of tiredness: for each ledger, ledger × men is invariant
 * across any split/merge sequence, so no fatigue laundering exists.
 */

/* Divide by relative weights. Each piece is w_i/ΣW of the parent's substance;
   the last piece takes the remainder so substance is conserved EXACTLY (no
   float drift from summing quotients). Each detachment inherits the parent's
   position and a COPY of its fatigue state — independent entities that then
   move on their own. */
function split(army, weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  if (!(total > 0)) throw new Error('split weights must sum to a positive number');
  let allocated = 0;
  return weights.map((w, i) => {
    const size = i === weights.length - 1
      ? army.size - allocated
      : army.size * w / total;
    allocated += size;
    return { size, position: army.position, fatigue: { ...army.fatigue } };
  });
}

/* Merge into one army at the given rendezvous position. Size adds; every
   fatigue ledger takes the size-weighted average, so Σ(size × ledger) is
   preserved — a merge cannot launder tiredness. Ledger keys are read from the
   first army, so this stays correct if the fatigue state grows a third ledger. */
function merge(armies, position) {
  const size = armies.reduce((s, a) => s + a.size, 0);
  if (!(size > 0)) throw new Error('cannot merge an empty force');
  const fatigue = {};
  for (const key of Object.keys(armies[0].fatigue)) {
    fatigue[key] = armies.reduce((s, a) => s + a.size * a.fatigue[key], 0) / size;
  }
  return { size, position, fatigue };
}

const _api = { split, merge };
if (typeof module !== 'undefined' && module.exports) module.exports = _api;
else (window.FieldArmy = window.FieldArmy || {}), Object.assign(window.FieldArmy, _api);
