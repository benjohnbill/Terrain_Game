'use strict';

/* 가안 dials — slice-2 spec §2 dial sheet (all provisional; magnitude pass re-cuts values).
   The ×0.5 floor is the sealed anchor (M9-consonant); every other number is a placeholder. */
const MARCH_ACCRUAL_PER_HEX = 1.0;   // dial 1
const FORCED_MARCH_PREMIUM  = 3.0;   // dial 2 — march cost multiplier per extra hex (consumed by the movement contract)
const FORCED_MARCH_EXTRA_HEX_CAP = 2; // dial 2 — k: extra hexes allowed beyond speed S
const BATTLE_FATIGUE_COEF   = 40;    // dial 3 — ledger per own casualty fraction
const EFFECTIVENESS_FLOOR   = 0.5;   // dial 6 anchor — SEALED (M9-consonant), curve terminal point
const CONVERSION_CONVEXITY_EXP   = 2.0; // dial 6 — accelerating-penalty exponent
const CONVERSION_TERMINAL_LEDGER = 10;  // dial 6 — ledger depth where the floor is reached
const SUPPLY_PUMP_PER_CUT_TURN   = 1.0; // dial 4
const STARVATION_ENTRY_THRESHOLD = 2;   // dial 5 — supply-ledger depth gating the starvation state
const STARVATION_LOSS_COEF = 0.02;      // dial 7 — death-conversion curve
const STARVATION_LOSS_EXP  = 2.0;       // dial 7
const RECOVERY_BASE_RATE   = 2.0;       // dial 8 — per turn at steady supply; multiplier 가안 linear in level
const RECOVERY_REQUIRES_STATIONARY = false; // dial 9 — HELD (spec §12); resolve before/at magnitude

function marchAccrual(hexesEntered) {
  return MARCH_ACCRUAL_PER_HEX * hexesEntered;
}

function battleAccrual(ownCasualtyFraction) {
  return BATTLE_FATIGUE_COEF * ownCasualtyFraction;
}

function effectiveness(marchLedger) {
  const depth = Math.min(1, Math.max(0, marchLedger) / CONVERSION_TERMINAL_LEDGER);
  return 1 - (1 - EFFECTIVENESS_FLOOR) * Math.pow(depth, CONVERSION_CONVEXITY_EXP);
}

/* Supply is the separate account: pump counts cut turns; any supplied turn ends
   the tick and resets the pump (구현 가안 — spec only says "restoring the route
   ends the tick"; residual depth after resupply is not specified). */
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
  return RECOVERY_BASE_RATE * Math.max(0, Math.min(1, supplyLevel));
}

/* One turn of upkeep for an army's fatigue state. Cut turn: pump first, then
   bleed at the new depth (turn N of a siege bleeds at depth N). */
function turnUpkeep(state, supplyLevel) {
  const supply = supplyTick(state.supply, supplyLevel);
  return {
    march: Math.max(0, state.march - recoveryPerTurn(supplyLevel)),
    supply,
    substanceLossFraction: starvationLossFraction(supply),
    starving: isStarving(supply),
  };
}

const _api = {
  marchAccrual, battleAccrual, effectiveness,
  supplyTick, starvationLossFraction, isStarving,
  recoveryPerTurn, turnUpkeep,
  STARVATION_ENTRY_THRESHOLD,
  FORCED_MARCH_PREMIUM, FORCED_MARCH_EXTRA_HEX_CAP, // dial 2 — the movement contract's wallet arithmetic
};
if (typeof module !== 'undefined' && module.exports) module.exports = _api;
else (window.Fatigue = window.Fatigue || {}), Object.assign(window.Fatigue, _api);
