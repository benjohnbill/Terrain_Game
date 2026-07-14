'use strict';

/* board-verbs.js — the two defense choices that avoid the calculator, plus the
 * emergent-siege upkeep bridge (slice-2 spec §8 board verbs, §2 siege clock).
 *
 * This module is a THIN board-state layer over sealed primitives: it invokes no
 * battle calculator (that is the whole point of a board verb — spec §8), and it
 * mints no siege object (ADR 0026 bans multi-turn operation state). A siege is
 * nothing but a garrison's rising supply ledger, so siegeUpkeep is a small
 * bridge from board state (cut routes, ash) into the ticket-01 fatigue pump.
 *
 * Verb semantics are pointers into the operation-plan-catalog claim blocks:
 *   - Strategic Abandonment (전략적 포기): free declaration; cede the sector
 *     intact, save the action. "Ceding is instant." No burn, no battle.
 *   - Scorched Earth (청야 소각): the real plan — burning is work, it consumes
 *     the turn. usableValueDamage (self, core) + routeDisruption (self) leave
 *     the occupier ash. "Burning is forever."
 *
 * All functions are PURE — inputs are never mutated; a fresh sector/state is
 * returned. Wiring into the turn loop (game.js) is a later ticket.
 */

const Fatigue = (typeof module !== 'undefined' && module.exports)
  ? require('./fatigue.js')
  : window.Fatigue; // browser: fatigue.js must be loaded first

/* Strategic Abandonment — a declaration, not a plan. Control transfers to the
   claimant immediately; the base is ceded intact (do not burn what you could
   keep); the primary action stays free for elsewhere. No calculator runs. */
function abandon(sector, claimant) {
  return {
    sector: { ...sector, control: claimant },
    actionSaved: true,
    battle: false,
  };
}

/* Scorched Earth — the real plan; burning is work, so it consumes the turn.
   thoroughness ∈ [0,1] is the commitment curve (hasty torching → near-total
   denial); any scorching leaves recovery-denying ash. Control is NOT changed
   here — the enemy inherits the ash by advancing onto it, and abandon() is the
   cede channel; a defender may scorch and hold, or scorch then abandon. */
function scorchedEarth(sector, thoroughness) {
  const t = Math.max(0, Math.min(1, thoroughness));
  return {
    sector: {
      ...sector,
      usableValue: (sector.usableValue || 0) * (1 - t),
      routesDisrupted: true,
      ash: true,
    },
    actionSaved: false,
    battle: false,
  };
}

/* Ash denies recovery: scorched ground rebuilds nothing even when supplied.
   A magnitude dial could grade this (partial recovery on lightly-burned
   ground); the sealed reading is binary — ash = no dig-in. */
function sectorRecoveryFactor(sector) {
  return sector && sector.ash ? 0 : 1;
}

/* One turn of siege upkeep for a garrison's fatigue state {wear, supply} on a
   sector. The board contributes exactly two facts:
     - routeConnected: is the force supplied? (movement.isSupplied — the caller
       runs the real predicate over the current control set)
     - sector.ash:     does the ground under it permit recovery?
   A cut route pumps the supply ledger (starvation → substance melt, ticket 01);
   ash zeroes the recovery multiplier. Both feed the sealed fatigue primitives —
   no new arithmetic, no siege object. supplyLevel is binary here (connected =
   1, cut = 0); a partial-trickle model is a later supply-depth dial. */
function siegeUpkeep(state, board) {
  const supplyLevel = board.routeConnected ? 1 : 0;
  const supply = Fatigue.supplyTick(state.supply, supplyLevel);
  const recovery = Fatigue.recoveryPerTurn(supplyLevel) * sectorRecoveryFactor(board.sector);
  return {
    wear: Math.max(0, state.wear - recovery),
    supply,
    substanceLossFraction: Fatigue.starvationLossFraction(supply),
    starving: Fatigue.isStarving(supply),
  };
}

const _api = { abandon, scorchedEarth, sectorRecoveryFactor, siegeUpkeep };
if (typeof module !== 'undefined' && module.exports) module.exports = _api;
else (window.BoardVerbs = window.BoardVerbs || {}), Object.assign(window.BoardVerbs, _api);
