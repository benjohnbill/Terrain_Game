/**
 * The blur seam.
 *
 * Gate 02 seals that the Runtime privately owns truth and that projection is
 * where truth is blurred — **once**, on the way out. Everything downstream (the
 * renderer, the UI, `preview`, the bot) sees only what this function emitted, so
 * a leak here is a leak everywhere and cannot be corrected later.
 *
 * What each viewer may *know* is gate 03's contract, and the estimate band that
 * implements it arrives with ticket 08. Two blurs exist today, and both are
 * tested rather than merely intended:
 *
 *   1. **the seed never crosses** — the whole determinism contract rests on it;
 *   2. **an opponent's capital does not cross before the reveal** — the choice
 *      is simultaneous and secret by seal (CP-② D1.3), so a viewer who could
 *      read the other side's pick before locking their own would be playing a
 *      different game than the one designed.
 *
 * What deliberately *is* public: the whole board. Geography sits in the open on
 * the sealed information ladder — terrain, regions, and routes are known, and it
 * is forces and intent that are hidden. Passing the frozen artifact by reference
 * rather than copying 292 hexes per call is safe for exactly that reason.
 */

import type { MatchState } from '../domain/state.js';
import type { ActorId, MatchView, RealmView, SectorId, ViewerId } from '../runtime/types.js';

/** Realm totals, recomputed from current holdings rather than cached at setup. */
function realmView(state: MatchState, actor: ActorId): RealmView {
  const realm = state.realms[actor]!;
  let population = 0;
  let economy = 0;
  for (const sectorId of realm.sectors) {
    const sector = state.loadedWorld.artifact.sectors[sectorId]!;
    population += sector.populationValue;
    economy += sector.economyValue;
  }
  return {
    actor,
    regions: realm.regions,
    sectors: [...realm.sectors],
    population,
    economy,
  };
}

/**
 * Which capitals this viewer may see.
 *
 * Before the reveal an actor sees only their own; the observer sees none, which
 * keeps the tooling viewer from being a side door around the secrecy the seal
 * requires. After the reveal every capital is public to everyone, permanently.
 */
function visibleCapitals(state: MatchState, viewer: ViewerId): Record<ActorId, SectorId> {
  const revealed = state.actors.every((actor) => actor in state.capitals);
  if (revealed) return { ...state.capitals };

  const own = viewer !== 'observer' ? state.capitals[viewer] : undefined;
  return own === undefined ? {} : { [viewer]: own };
}

/**
 * Which realms this viewer knows have locked a capital.
 *
 * **Only their own, before the reveal.** The seal fixes that the choice is
 * simultaneous and secret and that both sites go public together; it says
 * nothing about whether a player may watch the *opponent's commitment land*.
 * Showing that would be a new visible-state rule, and inventing one is exactly
 * what the ticket's authority test forbids — so this projects the narrower
 * thing, and the question is recorded as owed rather than answered here.
 *
 * After the reveal it is moot: both capitals are public, so both locks are.
 */
function visibleLocks(state: MatchState, viewer: ViewerId): ActorId[] {
  const locked = state.actors.filter((actor) => actor in state.capitals);
  if (locked.length === state.actors.length) return locked;
  return viewer !== 'observer' && viewer in state.capitals ? [viewer] : [];
}

/**
 * Builds the viewer-safe view of a match.
 *
 * Note what is *not* copied: the seed, the RNG, the unrevealed capitals, whether
 * the opponent has committed, and anything reachable from them. That omission is
 * the seam.
 */
export function project(state: MatchState, viewer: ViewerId): MatchView {
  return {
    world: { worldId: state.world.worldId, revision: state.world.revision },
    viewer,
    turn: state.turn,
    phase: state.phase,
    currentActor: state.currentActor,
    actors: [...state.actors],
    board: state.loadedWorld.artifact,
    realms: state.actors.map((actor) => realmView(state, actor)),
    capitals: visibleCapitals(state, viewer),
    capitalLocked: visibleLocks(state, viewer),
  };
}
