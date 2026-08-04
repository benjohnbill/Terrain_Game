/**
 * The projection boundary — the one place viewer policy is applied.
 *
 * ADR 0049 (Decisions 1-3) seals that the Runtime privately owns truth and that
 * this function is where viewer policy is applied — **once**, on the way out. It
 * is not a blur: under ADR 0048 the estimate band is composed from stored
 * testimony and the true value does not enter here at all. Everything downstream (the
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
import {
  capitalGuardAt,
  forceLimitOf,
  GARRISON_PER_BORDER_SECTOR,
  incomeOf,
  landValueOf,
  registerOf,
} from '../domain/economy.js';
import {
  availableCiviliansByOrigin,
  fieldOf,
  menOf,
  servingByOrigin,
  type Detachment,
  type GarrisonForce,
  type PendingCohort,
} from '../domain/force.js';
import {
  fatigueEnvelope,
  forceEnvelope,
  garrisonEnvelope,
  servingEnvelope,
  UNKNOWN_WEAR,
  type ForceContact,
  type ReconnaissanceRequest,
  type SectorRecord,
} from '../domain/intel.js';
import {
  advanceOneTurn,
  FORCED_MARCH_EXTRA_CAP,
  MARCH_SPEED,
  musterHexOf,
  reachCone,
  type MovementGraph,
} from '../domain/movement.js';
import { compareRecruitmentRequests, type RecruitmentRequest } from '../domain/recruitment.js';
import { frontsOf, garrisonOf, holdingsOf } from '../domain/state.js';
import type { MatchState } from '../domain/state.js';
import { composeBand, intervalOf, type Interval, type Testimony } from '../domain/testimony.js';
import type {
  ActorId,
  BandView,
  BorderAlarmView,
  CommitmentView,
  DetachmentView,
  EconomyView,
  ForceContactView,
  GarrisonView,
  IntelligenceView,
  MatchView,
  MobilizationSignalView,
  RealmView,
  SectorForcesView,
  SectorId,
  SectorIntelView,
  TestimonyReadView,
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
    yield: incomeOf(sectors, holdings, state.ripening),
    forceLimit: forceLimitOf(sectors, holdings, state.ripening),
    // Over **control**, not holdings: this counts the bodies a stretch of land can
    // raise rather than what that land pays, so limbo does not suspend it.
    registerPool: registerOf(sectors, realm.sectors),
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
  const sectorForces: Record<SectorId, SectorForcesView> = {};
  for (const sector of Object.keys(forces.registers).sort()) {
    sectorForces[sector] = {
      register: forces.registers[sector]!,
      serving: servingOrigins[sector] ?? 0,
      availableCivilians: available[sector]!,
    };
  }
  const register = Object.values(forces.registers).reduce((sum, men) => sum + men, 0);

  return {
    actor: viewer,
    treasury: forces.treasury,
    income: incomeOf(sectors, holdings, state.ripening),
    forceLimit: forceLimitOf(sectors, holdings, state.ripening),
    field,
    garrison,
    register,
    serving,
    mobilization: register === 0 ? 0 : serving / register,
    sectors: sectorForces,
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

// ── Standard Fog ────────────────────────────────────────────────────────────
//
// Everything below composes bands out of two things and no third: the testimony
// this viewer's ledger holds, and bounds that are arithmetic over public facts.
// `MatchState` is in scope here because the rest of this file needs it, so the
// discipline is stated rather than enforced by the type — no function in this
// section reads an opposing realm's stocks, forces or garrisons, and a whole-match
// test asserts the consequence (containment) rather than trusting the intent.

const band = (interval: Interval): BandView => ({ low: interval.low, high: interval.high });

function historyOf(testimonies: readonly Testimony[]): TestimonyReadView[] {
  return testimonies
    .map((testimony) => {
      const claim = intervalOf(testimony);
      return { turn: testimony.turn, grade: testimony.grade, low: claim.low, high: claim.high };
    })
    .sort((a, b) => a.turn - b.turn);
}

const latestTurnOf = (...groups: readonly (readonly Testimony[])[]): number | null => {
  let latest: number | null = null;
  for (const group of groups) {
    for (const testimony of group) {
      if (latest === null || testimony.turn > latest) latest = testimony.turn;
    }
  }
  return latest;
};

/**
 * A sector's shield ceiling, from public facts alone.
 *
 * The seat is authored geography and the coefficient is sealed, so a viewer can
 * compute this for ground it has never seen. The capital's location is public
 * from the reveal (CP-② item 1) while its guard's *strength* is fogged — which
 * is exactly this shape: the ceiling is known, the manning is banded.
 */
function garrisonCeilingOf(state: MatchState, sectorId: SectorId, owner: ActorId): number {
  return GARRISON_PER_BORDER_SECTOR
    + capitalGuardAt(state.loadedWorld.artifact.sectors, sectorId, state.capitals[owner]);
}

function sectorIntelView(
  state: MatchState,
  sectorId: SectorId,
  owner: ActorId,
  record: SectorRecord | undefined,
  forceLimit: number,
): SectorIntelView {
  const sectors = state.loadedWorld.artifact.sectors;
  const registerPool = registerOf(sectors, [sectorId]);
  const garrisonTestimonies = record?.garrison ?? [];
  const servingTestimonies = record?.serving ?? [];

  const garrison = composeBand({
    testimonies: garrisonTestimonies,
    now: state.turn,
    envelope: garrisonEnvelope(forceLimit),
    publicBound: { low: 0, high: garrisonCeilingOf(state, sectorId, owner) },
    ...(record?.lastLossTurn === undefined ? {} : { lastLossTurn: record.lastLossTurn }),
    ...(record?.lastReinforcementTurn === undefined
      ? {}
      : { lastGainTurn: record.lastReinforcementTurn }),
  });
  const serving = composeBand({
    testimonies: servingTestimonies,
    now: state.turn,
    envelope: servingEnvelope(forceLimit),
    // Nobody can serve who was never registered here, and the pool is public.
    publicBound: { low: 0, high: registerPool },
    ...(record?.servingLossTurn === undefined ? {} : { lastLossTurn: record.servingLossTurn }),
  });

  return {
    sectorId,
    owner,
    garrison: band(garrison),
    serving: band(serving),
    registerPool,
    // Both derived from one banded numerator over one public denominator, which
    // is what gives them zero new dials (gate 03 § 2). The civilian read reverses
    // the edges because it subtracts: more serving is fewer civilians.
    mobilization: registerPool === 0
      ? { low: 0, high: 0 }
      : { low: serving.low / registerPool, high: serving.high / registerPool },
    civilianRegister: { low: registerPool - serving.high, high: registerPool - serving.low },
    observedTurn: latestTurnOf(garrisonTestimonies, servingTestimonies),
    garrisonHistory: historyOf(garrisonTestimonies),
  };
}

/**
 * Where a contact could be now — its last-seen sector while it is current, and a
 * cone widening by one turn's march for every turn since (④ decision 5).
 *
 * Published as **sectors** rather than hexes: the sector is the operational atom
 * (ADR 0032), it is the grain a commitment is poured onto, and a cone of hexes at
 * turn-scale staleness is hundreds of entries carrying no decision the sector list
 * does not already carry.
 */
function reachOf(state: MatchState, contact: ForceContact): SectorId[] {
  const age = Math.max(0, state.turn - contact.lastObservedTurn);
  if (age === 0) return [contact.lastSeenSector];
  // The forced-march cap, not the ordinary speed: a force may pay fatigue to go
  // further, so a cone drawn at `MARCH_SPEED` would be a bound the board can break.
  const cone = reachCone(
    state.movementGraph,
    contact.lastSeenAt,
    age,
    MARCH_SPEED + FORCED_MARCH_EXTRA_CAP,
  );
  const reached = new Set<SectorId>();
  for (const hexKey of cone) {
    const sector = state.movementGraph.nodes[hexKey]?.sectorId;
    if (sector !== undefined) reached.add(sector);
  }
  return [...reached].sort();
}

function contactView(
  state: MatchState,
  contact: ForceContact,
  forceLimit: number,
): ForceContactView {
  const envelope = forceEnvelope(forceLimit);
  const loss = contact.lastLossTurn === undefined ? {} : { lastLossTurn: contact.lastLossTurn };
  const substance = composeBand({
    testimonies: contact.substance,
    now: state.turn,
    envelope,
    publicBound: { low: 0, high: forceLimit },
    ...loss,
  });
  const fatigue = composeBand({
    testimonies: contact.fatigue,
    now: state.turn,
    // Wear is the one banded quantity that moves every turn under its own steam —
    // marching accrues it and rest recovers it — so it needs a rate on both edges
    // where substance needs one on neither.
    envelope: fatigueEnvelope(),
    // Zero is a real reading: an army that has not marched is unworn, and a
    // multiplicative width around zero is zero. What a scout learns there is what
    // anyone looking at a fresh army would learn, so it is left honest rather than
    // padded — the substance floor (invariant 6) is stated for substance.
    //
    // Unbounded above, and see `UNKNOWN_WEAR` for why: the ledger keeps counting
    // past the point its effect saturates.
    publicBound: UNKNOWN_WEAR,
  });
  if (!Number.isFinite(fatigue.high)) {
    throw new Error(`Contact ${contact.id} carries no wear testimony; a contact is created by one.`);
  }

  return {
    contactId: contact.id,
    actor: contact.actor,
    lastSeenAt: { ...contact.lastSeenAt },
    lastSeenSector: contact.lastSeenSector,
    lastSeenTurn: contact.lastObservedTurn,
    openedOnTurn: contact.openedOnTurn,
    reach: reachOf(state, contact),
    substance: band(substance),
    fatigue: band(fatigue),
    current: contact.lastObservedTurn === state.turn,
    closed: contact.closedOnTurn !== undefined,
    substanceHistory: historyOf(contact.substance),
  };
}

/**
 * The free warning floor: an enemy force standing on ground this realm holds.
 *
 * Existence and heading only. No magnitude, no fatigue, no identity — a viewer
 * cannot tell one alarm's force from another's, and cannot count them into a
 * total, because the alarm carries nothing to count. Paid response stays a
 * separate purchase (gate 07 § Answer).
 */
function borderAlarms(state: MatchState, viewer: ViewerId): BorderAlarmView[] {
  if (viewer === 'observer') return [];
  const own = new Set(state.realms[viewer]!.sectors);
  const alarms: BorderAlarmView[] = [];
  for (const actor of state.actors) {
    if (actor === viewer) continue;
    for (const detachment of state.forces[actor]!.detachments) {
      const at = state.movementGraph.nodes[hexKeyOf(detachment)]?.sectorId;
      if (at === undefined || !own.has(at)) continue;
      const destination = detachment.movement === null
        ? null
        : state.movementGraph.nodes[
            `${detachment.movement.destination.q},${detachment.movement.destination.r}`
          ]?.sectorId ?? null;
      alarms.push({
        sectorId: at,
        actor,
        heading: destination === at ? null : destination,
      });
    }
  }
  return alarms.sort((a, b) => a.sectorId.localeCompare(b.sectorId));
}

const hexKeyOf = (detachment: Detachment): string =>
  `${detachment.position.q},${detachment.position.r}`;

/**
 * What this viewer has learned — the single composition point.
 *
 * The observer is handed an empty picture on purpose, for the reason it is handed
 * no economy: a tooling viewer that could read both sides' intelligence would be a
 * side door around the seam, and tests would start asserting through it.
 */
function visibleIntelligence(state: MatchState, viewer: ViewerId): IntelligenceView {
  const empty: IntelligenceView = {
    sectors: [],
    contacts: [],
    coverage: {
      sectorsObserved: 0,
      sectorsTotal: 0,
      oldestObservedTurn: null,
      serving: { low: 0, high: 0 },
      registerPool: 0,
    },
    alarms: [],
  };
  if (viewer === 'observer') return empty;

  const ledger = state.intelligence[viewer];
  if (ledger === undefined) return empty;

  const sectors: SectorIntelView[] = [];
  let servingLow = 0;
  let servingHigh = 0;
  let poolTotal = 0;
  let observedCount = 0;
  let oldestObservedTurn: number | null = null;

  for (const actor of state.actors) {
    if (actor === viewer) continue;
    const holdings = holdingsOf(state, actor);
    const forceLimit = forceLimitOf(state.loadedWorld.artifact.sectors, holdings, state.ripening);
    for (const sectorId of [...state.realms[actor]!.sectors].sort()) {
      const view = sectorIntelView(state, sectorId, actor, ledger.sectors[sectorId], forceLimit);
      sectors.push(view);
      // The sector side is the one that may be summed: two sector testimonies
      // cannot describe the same men, because a serving body keeps the sector
      // origin it was drawn from wherever it stands (④ decision 6b).
      servingLow += view.serving.low;
      servingHigh += view.serving.high;
      poolTotal += view.registerPool;
      if (view.observedTurn !== null) {
        observedCount += 1;
        if (oldestObservedTurn === null || view.observedTurn < oldestObservedTurn) {
          oldestObservedTurn = view.observedTurn;
        }
      }
    }
  }

  const contacts = ledger.contacts
    .map((contact) => {
      const holdings = holdingsOf(state, contact.actor);
      return contactView(
        state,
        contact,
        forceLimitOf(state.loadedWorld.artifact.sectors, holdings, state.ripening),
      );
    })
    .sort((a, b) => b.lastSeenTurn - a.lastSeenTurn || a.contactId.localeCompare(b.contactId));

  return {
    sectors,
    contacts,
    coverage: {
      sectorsObserved: observedCount,
      sectorsTotal: sectors.length,
      oldestObservedTurn,
      serving: { low: servingLow, high: servingHigh },
      registerPool: poolTotal,
    },
    alarms: borderAlarms(state, viewer),
  };
}

function visibleReconnaissanceOrders(
  state: MatchState,
  viewer: ViewerId,
): ReconnaissanceRequest[] {
  if (viewer === 'observer') return [];
  return Object.values(state.reconnaissanceOrders[viewer] ?? {})
    .map((request) => ({ ...request }))
    .sort((a, b) => a.sectorId.localeCompare(b.sectorId));
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
    // Copied rather than handed over, like every other record here: the view is the
    // blur seam and a caller holding a live reference to truth is what it exists to
    // prevent. Nothing is blurred *out* of it — a match's end is public to both realms
    // and to the observer alike (ADR 0042).
    outcome: state.outcome === null ? null : { ...state.outcome },
    actors: [...state.actors],
    board: state.loadedWorld.artifact,
    realms: state.actors.map((actor) => realmView(state, actor)),
    capitals: visibleCapitals(state, viewer),
    committed: visibleLocks(state, viewer),
    fronts: frontsOf(state),
    commitment: visibleCommitment(state, viewer),
    recruitmentOrders: visibleRecruitmentOrders(state, viewer),
    mobilizationSignals: visibleMobilizationSignals(state, viewer),
    reconnaissanceOrders: visibleReconnaissanceOrders(state, viewer),
    intelligence: visibleIntelligence(state, viewer),
    economy: visibleEconomy(state, viewer),
    detachments: visibleDetachments(state, viewer),
    garrisons: visibleGarrisons(state, viewer),
  };
}
