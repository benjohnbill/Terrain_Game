'use strict';

/* 가안 dials — slice-2 spec §2 dial sheet (all provisional; magnitude pass re-cuts values).
   The ×0.5 floor is the sealed anchor (M9-consonant); every other number is a placeholder. */
const MARCH_ACCRUAL_PER_HEX = 1.0;   // dial 1
const FORCED_MARCH_PREMIUM  = 3.0;   // dial 2 — march cost multiplier per extra hex; wired by the movement contract (ticket 02), named here so the §2 dial sheet is complete
const FORCED_MARCH_EXTRA_HEX_CAP = 2; // dial 2 — k: extra hexes allowed beyond speed S
const BATTLE_FATIGUE_COEF   = 40;    // dial 3 — ledger per own casualty fraction
const EFFECTIVENESS_FLOOR   = 0.5;   // dial 6 anchor — SEALED (M9-consonant), curve terminal point
const CONVERSION_CONVEXITY_EXP   = 2.0; // dial 6 — accelerating-penalty exponent
const CONVERSION_TERMINAL_LEDGER = 10;  // dial 6 — ledger depth where the floor is reached
const SUPPLY_PUMP_PER_CUT_TURN   = 1.0; // dial 4
const STARVATION_ENTRY_THRESHOLD = 2;   // dial 5 — supply-ledger depth gating the starvation state
const STARVATION_LOSS_COEF = 0.02;      // dial 7 — death-conversion curve
const STARVATION_LOSS_EXP  = 2.0;       // dial 7
const RECOVERY_BASE_RATE   = 2.0;       // dial 8 — per turn at steady supply
const RECOVERY_SUPPLY_CURVE_EXP = 1.0;  // dial 8 — supply-multiplier curve shape (1.0 = linear in level)
const RECOVERY_REQUIRES_STATIONARY = false; // dial 9 — HELD (spec §12); resolve before/at magnitude

function marchAccrual(hexesEntered) {
  return MARCH_ACCRUAL_PER_HEX * hexesEntered;
}

function battleAccrual(ownCasualtyFraction) {
  return BATTLE_FATIGUE_COEF * ownCasualtyFraction;
}

/* Forced-march wiring (ticket 02): extra hexes beyond speed S wear at the
   premium rate; normal hexes on the same order stay at marchAccrual. The
   wallet is the gauge itself — no third resource, no combat penalty. */
function forcedMarchAccrual(extraHexes) {
  return MARCH_ACCRUAL_PER_HEX * FORCED_MARCH_PREMIUM * extraHexes;
}

function forcedMarchExtraHexCap() {
  return FORCED_MARCH_EXTRA_HEX_CAP;
}

/* wearLedger = the march/battle ledger (spec §1 "loses by its wear"). */
function effectiveness(wearLedger) {
  const depth = Math.min(1, Math.max(0, wearLedger) / CONVERSION_TERMINAL_LEDGER);
  return 1 - (1 - EFFECTIVENESS_FLOOR) * Math.pow(depth, CONVERSION_CONVEXITY_EXP);
}

/* Supply is the separate account: the pump counts cut turns. Implementation
   ruling (flagged, open for the magnitude pass): ANY supplied turn ends the
   tick and resets the pump to zero — the spec says only "restoring the route
   ends the tick" and is silent on residual depth; reset is the simplest
   reading under which the bleed actually stops. Corollary: a partial trickle
   also resets (level only modulates recovery, dial 8). */
function supplyTick(supplyLedger, supplyLevel) {
  return supplyLevel > 0 ? 0 : supplyLedger + SUPPLY_PUMP_PER_CUT_TURN;
}

function starvationLossFraction(supplyLedger) {
  const excess = Math.max(0, supplyLedger - STARVATION_ENTRY_THRESHOLD);
  return Math.min(1, STARVATION_LOSS_COEF * Math.pow(excess, STARVATION_LOSS_EXP));
}

function isStarving(supplyLedger) {
  return supplyLedger > STARVATION_ENTRY_THRESHOLD;
}

function recoveryPerTurn(supplyLevel) {
  const level = Math.max(0, Math.min(1, supplyLevel));
  return RECOVERY_BASE_RATE * Math.pow(level, RECOVERY_SUPPLY_CURVE_EXP);
}

/* One turn of upkeep for an army's fatigue state {wear, supply}. Cut turn:
   pump first, then bleed at the new depth (turn N of a siege bleeds at depth
   N — ordering is an implementation ruling, flagged with the pump reset). */
function turnUpkeep(state, supplyLevel) {
  const supply = supplyTick(state.supply, supplyLevel);
  return {
    wear: Math.max(0, state.wear - recoveryPerTurn(supplyLevel)),
    supply,
    substanceLossFraction: starvationLossFraction(supply),
    starving: isStarving(supply),
  };
}

const _api = {
  marchAccrual, battleAccrual, effectiveness,
  forcedMarchAccrual, forcedMarchExtraHexCap,
  supplyTick, starvationLossFraction, isStarving,
  recoveryPerTurn, turnUpkeep,
};
if (typeof module !== 'undefined' && module.exports) module.exports = _api;
else (window.Fatigue = window.Fatigue || {}), Object.assign(window.Fatigue, _api);
