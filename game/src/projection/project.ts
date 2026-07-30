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

import { spentOf, TURN_COMMITMENT_BUDGET } from '../domain/commitment.js';
import { forceLimitOf, incomeOf, landValueOf } from '../domain/economy.js';
import {
  availableCiviliansByOrigin,
  fieldOf,
  menOf,
  servingByOrigin,
  type Detachment,
  type GarrisonForce,
  type PendingCohort,
} from '../domain/force.js';
import { advanceOneTurn, musterHexOf, type MovementGraph } from '../domain/movement.js';
import { compareRecruitmentRequests, type RecruitmentRequest } from '../domain/recruitment.js';
import { frontsOf, garrisonOf, holdingsOf } from '../domain/state.js';
import type { MatchState } from '../domain/state.js';
import type {
  ActorId,
  CommitmentView,
  DetachmentView,
  EconomyView,
  GarrisonView,
  MatchView,
  MobilizationSignalView,
  ProvinceForcesView,
  RealmView,
  RegionId,
  SectorId,
  ViewerId,
} from '../runtime/types.js';

/** Realm totals, recomputed from current holdings rather than cached at setup. */
function realmView(state: MatchState, actor: ActorId): RealmView {
  const realm = state.realms[actor]!;
  const sectors = state.loadedWorld.artifact.sectors;
  let population = 0;
  let economy = 0;
  for (const sectorId of realm.sectors) {
    const sector = sectors[sectorId]!;
    population += sector.populationValue;
    economy += sector.economyValue;
  }

  // Territory and holdings are different questions once ground changes hands:
  // control is what the map shows, holdings are what pays (OG-③). The two are
  // equal until the first capture, and they must not be conflated after it.
  const holdings = holdingsOf(state, actor);
  return {
    actor,
    regions: realm.regions,
    sectors: [...realm.sectors],
    population,
    economy,
    landValue: landValueOf(sectors, holdings),
    yield: incomeOf(sectors, holdings),
    forceLimit: forceLimitOf(sectors, holdings),
  };
}

/**
 * The viewer's own stocks — treasury, register, men — and nobody else's.
 *
 * This is the ticket's blur decision, and it is a hard omission rather than a
 * blurred figure: the opponent's object is never built. Gate 03 puts a realm's
 * own realm at Exact, so this side is unrounded; the opponent's mobilization
 * becomes readable as a *band* when ticket 08 lands M10, and not before.
 */
function visibleEconomy(state: MatchState, viewer: ViewerId): EconomyView | null {
  if (viewer === 'observer') return null;

  const forces = state.forces[viewer];
  if (forces === undefined) return null;

  const sectors = state.loadedWorld.artifact.sectors;
  const holdings = holdingsOf(state, viewer);
  const garrison = garrisonOf(state, viewer);
  const field = fieldOf(forces);
  const serving = field + garrison;
  const ownedGarrisons = state.realms[viewer]!.sectors.flatMap((sector) => {
    const force = state.garrisons[sector];
    return force === undefined ? [] : [force];
  });
  const servingOrigins = servingByOrigin(forces, ownedGarrisons);
  const available = availableCiviliansByOrigin(forces.registers, servingOrigins);
  const provinces: Record<RegionId, ProvinceForcesView> = {};
  for (const region of Object.keys(forces.registers).sort()) {
    provinces[region] = {
      register: forces.registers[region]!,
      serving: servingOrigins[region] ?? 0,
      availableCivilians: available[region]!,
    };
  }
  const register = Object.values(forces.registers).reduce((sum, men) => sum + men, 0);

  return {
    actor: viewer,
    treasury: forces.treasury,
    income: incomeOf(sectors, holdings),
    forceLimit: forceLimitOf(sectors, holdings),
    field,
    garrison,
    register,
    serving,
    mobilization: register === 0 ? 0 : serving / register,
    provinces,
  };
}

function pendingMen(pending: readonly PendingCohort[]): number {
  return pending.reduce((sum, cohort) => sum + menOf(cohort.origins), 0);
}

function earliestReadyTurn(pending: readonly PendingCohort[]): number | null {
  return pending.length === 0
    ? null
    : pending.reduce((earliest, cohort) => Math.min(earliest, cohort.readyOnTurn), Infinity);
}

function pendingFatigue(pending: readonly PendingCohort[]): number | null {
  const men = pendingMen(pending);
  if (men === 0) return null;
  return pending.reduce(
    (sum, cohort) => sum + cohort.fatigue * menOf(cohort.origins),
    0,
  ) / men;
}

function movementView(
  graph: MovementGraph,
  detachment: Detachment,
): Pick<DetachmentView, 'turnEndpoint' | 'turnsRemaining'> {
  if (detachment.movement === null) {
    return { turnEndpoint: { ...detachment.position }, turnsRemaining: 0 };
  }
  const first = advanceOneTurn(graph, detachment).detachment;
  let simulated = detachment;
  let turnsRemaining = 0;
  while (simulated.movement !== null) {
    const advanced = advanceOneTurn(graph, simulated);
    turnsRemaining += 1;
    if (advanced.travelled === 0 && advanced.detachment.movement !== null) {
      turnsRemaining = Infinity;
      break;
    }
    simulated = advanced.detachment;
  }
  return { turnEndpoint: { ...first.position }, turnsRemaining };
}

function detachmentView(graph: MovementGraph, detachment: Detachment): DetachmentView {
  const readyMen = menOf(detachment.ready.origins);
  const waiting = pendingMen(detachment.pending);
  const movement = movementView(graph, detachment);
  return {
    id: detachment.id,
    position: { ...detachment.position },
    destination: detachment.movement === null ? null : { ...detachment.movement.destination },
    ...movement,
    men: readyMen + waiting,
    readyMen,
    pendingMen: waiting,
    pendingReadyOnTurn: earliestReadyTurn(detachment.pending),
    fatigue: detachment.ready.fatigue,
    pendingFatigue: pendingFatigue(detachment.pending),
  };
}

function garrisonView(sectorId: SectorId, garrison: GarrisonForce): GarrisonView {
  const readyMen = menOf(garrison.ready);
  const waiting = pendingMen(garrison.pending);
  return {
    sectorId,
    men: readyMen + waiting,
    readyMen,
    pendingMen: waiting,
    pendingReadyOnTurn: earliestReadyTurn(garrison.pending),
  };
}

function visibleDetachments(state: MatchState, viewer: ViewerId): DetachmentView[] {
  if (viewer === 'observer') return [];
  return state.forces[viewer]?.detachments.map((detachment) =>
    detachmentView(state.movementGraph, detachment)) ?? [];
}

function visibleGarrisons(state: MatchState, viewer: ViewerId): GarrisonView[] {
  if (viewer === 'observer') return [];
  return state.realms[viewer]!.sectors
    .filter((sector) => state.garrisons[sector] !== undefined)
    .sort()
    .map((sector) => garrisonView(sector, state.garrisons[sector]!));
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
 * Which realms have locked the current beat's commitment — **public, for every
 * viewer** (ruling R7, SEALED 2026-07-25).
 *
 * One rule, two beats: during `capital-selection` a lock is a chosen capital;
 * during `decision` it is this turn's allocation. R7 is the general
 * commit-and-reveal rule and every later commit inherits it, so this reads whichever
 * beat is open rather than special-casing the first one.
 *
 * The *fact* of commitment crosses; the *content* does not. That asymmetry is the
 * whole point, and it is load-bearing three times over:
 *
 *   - **it is the psychological read.** How long an opponent deliberates is
 *     signal, and a duel that hid it would delete a real layer of the contest;
 *   - **it is the genre's commit-and-reveal grammar**, which players arrive
 *     already fluent in;
 *   - **the system needs it anyway.** Both sides committing is what advances the
 *     beat, so the state is observable by construction — hiding it from the
 *     projection would only have hidden it from the *player*, not from the game.
 *
 * Note what this does **not** require: no clock. The indicator flips when the
 * commitment lands, so elapsed deliberation is read from the world rather than
 * timed — which keeps ADR 0040's bar on rules reading the wall clock intact.
 */
function visibleLocks(state: MatchState, viewer: ViewerId): ActorId[] {
  void viewer; // public to all, deliberately — see above
  return state.phase === 'capital-selection'
    ? state.actors.filter((actor) => actor in state.capitals)
    : state.actors.filter((actor) => state.turnLocks.includes(actor));
}

/**
 * This viewer's own 행동력 stack — and **only** their own.
 *
 * The blind commit is the mechanism the whole turn rests on (ledger D6.1), so an
 * opponent's allocation must not cross here in any form: not the map, not the sum,
 * not a remaining count that a subtraction would recover it from. The observer sees
 * nothing either, which keeps the tooling viewer from being a side door.
 */
function visibleCommitment(state: MatchState, viewer: ViewerId): CommitmentView {
  const own = viewer === 'observer' ? {} : { ...(state.commitments[viewer] ?? {}) };
  const assignments = viewer === 'observer'
    ? {}
    : Object.fromEntries(
        Object.entries(state.sectorAssignments[viewer] ?? {}).map(([sector, ids]) => [sector, [...ids]]),
      );
  const spent = spentOf(own);
  return {
    budget: TURN_COMMITMENT_BUDGET,
    allocations: own,
    assignments,
    spent,
    remaining: TURN_COMMITMENT_BUDGET - spent,
  };
}

function visibleRecruitmentOrders(state: MatchState, viewer: ViewerId): RecruitmentRequest[] {
  if (viewer === 'observer') return [];
  const requests = Object.values(state.recruitmentOrders[viewer] ?? {});
  const musterHexes = Object.fromEntries(requests.map((request) => [
    request.sectorId,
    musterHexOf(state.loadedWorld.artifact, request.sectorId),
  ]));
  return requests
    .map((request) => ({
      ...request,
      ...(request.destinationHex === undefined
        ? {}
        : { destinationHex: { ...request.destinationHex } }),
    }))
    .sort((a, b) => compareRecruitmentRequests(musterHexes, a, b));
}

/** The actor receives exact own state; only opponents receive this categorical trace. */
function visibleMobilizationSignals(
  state: MatchState,
  viewer: ViewerId,
): MobilizationSignalView[] {
  if (viewer === 'observer') return [];
  return state.mobilizationTraces
    .filter((trace) => trace.actor !== viewer)
    .map((trace) => ({
      actor: trace.actor,
      sectorId: trace.sectorId,
      observedTurn: trace.turn,
      band: 'activity-detected',
    }));
}

/**
 * Builds the viewer-safe view of a match.
 *
 * Note what is *not* copied: the seed, the RNG, the unrevealed capitals, the
 * opponent's allocation, and anything reachable from them. That omission is the
 * seam. What *is* copied and public: the board, both realms' territory, and the
 * bare fact of who has committed (R7).
 */
export function project(state: MatchState, viewer: ViewerId): MatchView {
  return {
    world: { worldId: state.world.worldId, revision: state.world.revision },
    viewer,
    turn: state.turn,
    phase: state.phase,
    // Gate 02's sealed member, re-read as the phase (R8). Same value as `phase` by
    // construction, so the two can never disagree about what is legal now.
    currentActor: state.phase,
    actors: [...state.actors],
    board: state.loadedWorld.artifact,
    realms: state.actors.map((actor) => realmView(state, actor)),
    capitals: visibleCapitals(state, viewer),
    committed: visibleLocks(state, viewer),
    fronts: frontsOf(state),
    commitment: visibleCommitment(state, viewer),
    recruitmentOrders: visibleRecruitmentOrders(state, viewer),
    mobilizationSignals: visibleMobilizationSignals(state, viewer),
    economy: visibleEconomy(state, viewer),
    detachments: visibleDetachments(state, viewer),
    garrisons: visibleGarrisons(state, viewer),
  };
}
