'use strict';

/* commit.js — the commit budget (slice-2 spec §4).
 *
 * Commit is a per-turn regenerating, non-bankable realm budget: the
 * abstraction of command capacity and court attention, and the hyperparameter
 * of engagement across ALL uses. Every commit-consuming action draws from ONE
 * pool — engagement levers (MAGNITUDE M2, 0–20), an abstract development sink,
 * reconnaissance. The engagement lever is the share allotted to that
 * engagement; "commit 12 to the war and 8 to development" is one pool split two
 * ways. Allocations across simultaneous uses sum to at most the budget; unused
 * balance does not bank — a new turn regenerates the full budget and discards
 * the leftover. This is the war/development opportunity cost by construction
 * (FG-⑧'s parked commit-scarcity axis).
 *
 * Pure and stateless: a pool is a plain { perTurn, remaining } value; every
 * function returns a new pool and never mutates its input.
 */

function pool(perTurn) {
  if (!(perTurn >= 0)) throw new Error('commit budget must be non-negative');
  return { perTurn, remaining: perTurn };
}

/* Draw one or more simultaneous allocations from the pool. Returns the new pool
   and the amount spent; throws if the draw exceeds what remains — the budget is
   a hard ceiling, not a debt line. */
function allocate(state, amounts) {
  const spent = amounts.reduce((s, a) => s + a, 0);
  if (spent < 0) throw new Error('commit allocation cannot be negative');
  if (spent > state.remaining) {
    throw new Error(`commit allocation ${spent} exceeds remaining ${state.remaining}`);
  }
  return { pool: { perTurn: state.perTurn, remaining: state.remaining - spent }, spent };
}

/* Start a new turn: the budget regenerates in full and any leftover is
   discarded (non-bankable) — a fresh full pool. */
function renew(state) {
  return pool(state.perTurn);
}

const _api = { pool, allocate, renew };
if (typeof module !== 'undefined' && module.exports) module.exports = _api;
else (window.Commit = window.Commit || {}), Object.assign(window.Commit, _api);
