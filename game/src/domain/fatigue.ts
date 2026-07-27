/**
 * Fatigue: one gauge, two ledgers.
 *
 * Authority: slice-2 operational-layer design § 2 (the shape) and
 * `docs/features/war-model-build/MAGNITUDE.md` WB-M① (the values, APPROVED
 * 2026-07-26, **L1** — exercised in the L2 harness but never the subject of a
 * sweep, so expect L3 to move several). The ×0.5 effectiveness floor is the one
 * sealed anchor in the set (WB-M① dial 6 + rider, M9-consonant).
 *
 * The two ledgers are one gauge with one output each, and the separation is the
 * design rather than an implementation detail:
 *
 *   wear    march + battle -> the effectiveness multiplier, floored at ×0.5.
 *           **Never kills.** Tiredness cannot take a body.
 *   supply  interruption -> starvation, which removes men and nothing else.
 *           **Never touches effectiveness.** Starvation cannot make a force
 *           clumsy, only smaller.
 *
 * That is the §2 firewall, and it is what `noPathInvertsCapability` in the tests
 * pins: no combination of the two ledgers may make a force stronger than its
 * rested, supplied self. Staged severity (holding -> attack-incapable ->
 * defenseless) is **superseded** — combat incapacity is never system-forced, it
 * emerges from shrinking substance, and fighting on while starving is the
 * player's high-risk right.
 *
 * The march dials (accrual per hex, the forced-march premium, speed) are NOT
 * here: they are `movement.ts`'s, wired by 06a. This module owns § 2's
 * conversion, supply and recovery dials only, so no dial has two homes.
 *
 * Pure by construction — it imports no match state, like `battle.ts`. The supply
 * *predicate* (which ground counts as connected, and to what) is a caller's
 * question and deliberately stays outside: this module takes a supply LEVEL.
 * See the ticket's § Comments for why that boundary is where the open authority
 * question sits.
 */

/** WB-M① dial 3 — ledger added per unit of own-casualty fraction. */
export const BATTLE_FATIGUE_COEF = 40;

/**
 * WB-M① dial 6 — the conversion curve. The floor is a **sealed anchor**, not a
 * 가안: both the slice-2 spec and the archive state ×0.5, so it was a stamp to
 * pay rather than a ruling to make, and it is paid at the birthplace.
 */
export const EFFECTIVENESS_FLOOR = 0.5;
export const CONVERSION_CONVEXITY_EXP = 2.0;
export const CONVERSION_TERMINAL_LEDGER = 10;

/** WB-M① dial 4 — the supply ledger counts cut turns. */
export const SUPPLY_PUMP_PER_CUT_TURN = 1.0;

/** WB-M① dial 5 — supply-ledger depth that opens the starvation state. */
export const STARVATION_ENTRY_THRESHOLD = 2;

/** WB-M① dial 7 — the death-conversion curve, `coef × excess^exp`. */
export const STARVATION_LOSS_COEF = 0.02;
export const STARVATION_LOSS_EXP = 2.0;

/** WB-M① dial 8 — recovery per turn at full supply, and the level's curve. */
export const RECOVERY_BASE_RATE = 2.0;
export const RECOVERY_SUPPLY_CURVE_EXP = 1.0;

/**
 * WB-M① dial 9 — **HELD**, and recorded HELD rather than valued: the slice-2
 * spec and the archive both mark it open, so implementing either answer would
 * originate a rule. It is wired as a flag consulted by {@link turnUpkeep} so
 * that answering it later is a value change rather than a redesign, which is
 * exactly what the ticket asks for.
 */
export const RECOVERY_REQUIRES_STATIONARY = false;

/** The gauge. Two accounts, never summed. */
export interface FatigueLedgers {
  /** March + battle. Feeds effectiveness only. */
  readonly wear: number;
  /** Cut turns. Feeds substance loss only. */
  readonly supply: number;
}

export interface UpkeepResult extends FatigueLedgers {
  /** Fraction of substance starvation takes this turn. 0 unless starving. */
  readonly substanceLossFraction: number;
  readonly starving: boolean;
}

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

/** Battle wear is the intensity signal: a fierce win wears, a walkover does not. */
export function battleAccrual(ownCasualtyFraction: number): number {
  return BATTLE_FATIGUE_COEF * clamp01(ownCasualtyFraction);
}

/**
 * The wear ledger's single continuous convex curve, saturating flat at the floor.
 *
 * Accelerating by construction (light fatigue cheap, deep fatigue increasingly
 * expensive) and never stepped: a banded mapping was rejected because it puts
 * value discontinuities at band boundaries. Named bands are UI vocabulary; the
 * arithmetic never jumps.
 */
export function effectiveness(wearLedger: number): number {
  const depth = clamp01(Math.max(0, wearLedger) / CONVERSION_TERMINAL_LEDGER);
  return 1 - (1 - EFFECTIVENESS_FLOOR) * Math.pow(depth, CONVERSION_CONVEXITY_EXP);
}

/**
 * One turn of the supply account.
 *
 * **Inherited implementation ruling, still open:** any supplied turn ends the
 * tick and resets the pump to zero. §2 says only that restoring the route ends
 * the tick and is silent on residual depth; reset is the reading under which the
 * bleed actually stops, and it is the behaviour the archive ran when WB-M①'s
 * values were exercised. Carried forward rather than re-decided so the numbers
 * stay meaningful — registered for a birthplace stamp in the ticket's § Comments.
 * A partial trickle also resets; the level only modulates recovery (dial 8).
 */
export function supplyTick(supplyLedger: number, supplyLevel: number): number {
  return supplyLevel > 0 ? 0 : supplyLedger + SUPPLY_PUMP_PER_CUT_TURN;
}

/** Substance loss rises continuously and convexly with depth past the threshold. */
export function starvationLossFraction(supplyLedger: number): number {
  const excess = Math.max(0, supplyLedger - STARVATION_ENTRY_THRESHOLD);
  return Math.min(1, STARVATION_LOSS_COEF * Math.pow(excess, STARVATION_LOSS_EXP));
}

export function isStarving(supplyLedger: number): boolean {
  return supplyLedger > STARVATION_ENTRY_THRESHOLD;
}

/** Recovery is a child of supply: no supply, no recovery. */
export function recoveryPerTurn(supplyLevel: number): number {
  return RECOVERY_BASE_RATE * Math.pow(clamp01(supplyLevel), RECOVERY_SUPPLY_CURVE_EXP);
}

/**
 * One turn of upkeep for one force's gauge.
 *
 * `recoveryFactor` is the **ground's** gate on recovery in [0, 1] — ordinary
 * ground is 1, ash is 0, because a burned province cannot let a force dig in.
 * The ground gates the wear ledger ONLY and never substance, which is how the
 * firewall survives: starvation stays supply-exclusive.
 *
 * **Inherited implementation ruling, still open:** on a cut turn the pump runs
 * first and the bleed is taken at the new depth, so turn N of a siege bleeds at
 * depth N. Registered with the reset ruling above.
 *
 * `stationary` is consulted only while {@link RECOVERY_REQUIRES_STATIONARY} is
 * answered. Today the dial is HELD, so a marching force recovers exactly as a
 * standing one does, and flipping the constant is the whole of the change.
 */
export function turnUpkeep(
  ledgers: FatigueLedgers,
  supplyLevel: number,
  recoveryFactor = 1,
  stationary = true,
): UpkeepResult {
  const supply = supplyTick(ledgers.supply, supplyLevel);
  const recovering = RECOVERY_REQUIRES_STATIONARY ? stationary : true;
  const recovered = recovering
    ? recoveryPerTurn(supplyLevel) * clamp01(recoveryFactor)
    : 0;
  return {
    wear: Math.max(0, ledgers.wear - recovered),
    supply,
    substanceLossFraction: starvationLossFraction(supply),
    starving: isStarving(supply),
  };
}
