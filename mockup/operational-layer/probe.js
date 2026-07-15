'use strict';
/* Operational-layer restoration probe (slice-2 ticket 07 measurement grid).
 *
 * The slice-1 methodology lesson (WM-①, `probe-defense-layers.js`): never
 * measure with a contradictory layer silently stubbed. The landed 결전
 * calculator (js/battle.js) still stubs two sealed defense layers, so this
 * instrument re-composes the STRONGHOLD engagement chain from js/battle.js
 * primitives with the stubbed layers exposed as explicit knobs. It restores
 * NOTHING by default — NEUTRAL_KNOBS reproduce resolveEngagement exactly
 * (the drift guard, tests/slice2-probe.test.js) — so a grid states which
 * layers it restores instead of inheriting a hidden choice.
 *
 * The two restorable layers:
 *   fillFactor   — M9 tactical fill: the front's garrison mass also joins the
 *                  결전 at the sealed x0.5 (FG-⑩), as a multiple of garrison.
 *                  0 = landed (field-army-only 결전).
 *   shieldCommit — the shield-layer defense commitment (ADR 0021 fourth layer,
 *                  slice 4). null = landed (standing shield "caught flat" at
 *                  x1.0, spec §8). A number arms the standing shield AND the
 *                  M9 fill with that commit lever.
 *
 * The field army's own commit/quality/fatigue are NOT knobs — ticket 03
 * landed them as real per-side inputs (rider a); they arrive on the scenario.
 *
 * marchArrival is the operational cost of distance: it drives the SEALED
 * movement contract (js/movement.js) turn by turn over a straight corridor,
 * so speed, the forced-march cap, and per-hex wear come from the real dials,
 * never a local copy. The between-turn recovery choice (dial 9, HELD §12) is
 * the recoveryWhileMarching knob — again exposed, not silently taken.
 *
 * Working-layer instrument: it encodes NO balance decision, only re-composes
 * sealed primitives. The calculator itself is untouched.
 */
const B = require('../../js/battle.js');
const F = require('../../js/fatigue.js');
const M = require('../../js/movement.js');

/* Mirrors of the js/battle.js dials (that module exports functions, not these
   thresholds — same convention as probe-defense-layers.js). Mirrors can rot, so
   tests/slice2-probe.test.js pins each one by SEARCHING the sealed calculator
   for the value it actually uses (the flip point of its own branch) and
   comparing — a mirror that diverges fails there, not silently at measurement
   time. Exported as DIALS for exactly that test. */
const SHIELD_BREAK_THRESHOLD = 1.5;   // M7 Swift Seizure
const ROUT_FRAC = 0.30;               // M4 rout cliff
const ROUT_OPEN_REMAINDER_LOSS = 0.5; // M4 escape OPEN pursuit loss
const M9_FILL_JOIN = 0.5;             // FG-⑩ — the fill joins the 결전 at half effect
const DIALS = { SHIELD_BREAK_THRESHOLD, ROUT_FRAC, ROUT_OPEN_REMAINDER_LOSS, M9_FILL_JOIN };

/* substance x commit lever x quality x fatigue, per side (spec §1). Local
   composition through the exported B.sidePower — B.sidePowerOf is not on the
   module's public surface. */
function sidePowerOf(entity, substance = entity.size) {
  return B.sidePower({ substance, commit: entity.commit, quality: entity.quality, fatigue: entity.fatigue });
}

const NEUTRAL_KNOBS = { fillFactor: 0, shieldCommit: null };

/* Re-compose one STRONGHOLD engagement with the two defense layers exposed.
   Mirrors js/battle.js resolveEngagement structure exactly; the only additions
   are the shield commit lever (first blow + fill) and the M9 fill mass. Non-
   STRONGHOLD plans have no stubbed layer here, so they delegate unchanged. */
function resolveWith(input, knobs = NEUTRAL_KNOBS) {
  const defensePlan = input.defensePlan || 'STRONGHOLD';
  if (defensePlan !== 'STRONGHOLD') return B.resolveEngagement(input);

  const { attacker, front, fieldArmy, escape } = input;
  const fillFactor = knobs.fillFactor || 0;
  const shieldLever = knobs.shieldCommit == null ? 1.0 : B.commitLever(knobs.shieldCommit);

  // FIRST BLOW — attacker (its own commit/quality/fatigue) vs the standing
  // shield, now scaled by the shield-layer commit lever when armed.
  const attackPower1 = sidePowerOf(attacker);
  const shield = B.shieldPower(front) * shieldLever;
  const R1 = attackPower1 / shield;
  const c1 = B.casualtyFractions(R1);
  const attackerAfter = attacker.size * (1 - c1.attacker);
  const base = {
    firstBlowR: R1,
    casualties: { attacker: attacker.size * c1.attacker, defenderShield: front.garrison * c1.defender },
  };

  if (R1 < SHIELD_BREAK_THRESHOLD) return { branch: 'REPULSED', defensePlan, shieldBreak: false, ...base };
  if (!fieldArmy.reaches)          return { branch: 'FALL',     defensePlan, shieldBreak: true,  ...base };

  // 결전 — the field army (its own levers, ticket 03) plus the restored M9
  // fill: garrison x fillFactor, joining at x0.5, carrying the shield-layer
  // commit lever, fresh (no march fatigue) and quality 1.0.
  const attackPower2  = sidePowerOf(attacker, attackerAfter);
  const fillPower     = front.garrison * fillFactor * M9_FILL_JOIN * shieldLever;
  const defensePower2 = sidePowerOf(fieldArmy) + fillPower;
  const R2 = attackPower2 / defensePower2;
  const c2 = B.casualtyFractions(R2);
  const attackerWins = R2 >= 1;
  const loserBattleLoss = attackerWins ? c2.defender : c2.attacker;
  const routed = loserBattleLoss >= ROUT_FRAC;
  const annihilated = routed && escape === 'BLOCKED';
  const loserTotalLoss = !routed ? loserBattleLoss
    : annihilated ? 1
    : Math.min(1, loserBattleLoss + ROUT_OPEN_REMAINDER_LOSS * (1 - loserBattleLoss));
  return {
    branch: 'DECISIVE', defensePlan, shieldBreak: true, ...base,
    decisiveBattle: { R2, attackerWins, routed, escape, annihilated, loserTotalLoss },
  };
}

/* A straight hex corridor of `hexes+1` cells (q = 0..hexes, r = 0) wrapped as a
   CRADLE_MAP so js/movement.js pathing applies verbatim. */
function corridorMap(hexes) {
  const mapUnits = [];
  for (let q = 0; q <= hexes; q++) mapUnits.push({ q, r: 0 });
  return { sectors: { corridor: { id: 'corridor', regionId: 'r', mapUnits } } };
}

/* The operational cost of distance: march `hexes` and report the arrival wear
   and effectiveness. Drives the SEALED movement contract turn by turn — speed,
   the forced-march cap, and per-hex accrual all come from js/movement.js and
   js/fatigue.js, so this cannot drift from the shipped dials. Between marching
   turns, recovery applies iff recoveryWhileMarching (dial 9, HELD): the last
   leg is always fresh (the army arrives and fights), so single-turn marches are
   inert to the knob. supplyLevel is 1 throughout — a march draws from home; the
   starvation ledger is a distinct account (the §2 firewall). */
function marchArrival(opts = {}) {
  const hexes = opts.hexes || 0;
  const forcedMarch = !!opts.forcedMarch;
  const recover = opts.recoveryWhileMarching == null ? true : !!opts.recoveryWhileMarching;
  if (hexes <= 0) return { turns: 0, wear: 0, effectiveness: F.effectiveness(0) };

  const graph = M.buildGraph(corridorMap(hexes));
  const dest = M.hexKey(hexes, 0);
  let pos = M.hexKey(0, 0);
  let wear = 0;
  let turns = 0;
  let arrived = false;
  while (!arrived) {
    const step = M.marchStep(graph, pos, dest, { forcedMarch });
    pos = step.position;
    wear += step.wearAccrued;
    turns++;
    arrived = step.arrived;
    if (!arrived && recover) {
      // Sealed upkeep at steady supply; recoveryFactor 1 = ordinary ground.
      wear = F.turnUpkeep({ wear, supply: 0 }, 1, 1).wear;
    }
  }
  return { turns, wear, effectiveness: F.effectiveness(wear) };
}

/* Node-only instrument (sibling convention: mockup/decisive-battle/*.js). */
module.exports = { NEUTRAL_KNOBS, DIALS, resolveWith, marchArrival, corridorMap };
