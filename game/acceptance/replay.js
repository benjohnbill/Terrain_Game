/**
 * The canonical durable form, exercised.
 *
 * ADR 0049 § Decision 8 seals that a match is reproducible from `(authored world
 * identity and revision, rule revision, seed, ordered intent log)` — that tuple,
 * and no snapshot. It restores the world identity that gate 02 § 5's shorthand
 * ("intent log plus seed") had dropped. This module builds a
 * representative log and reduces a replay to the part worth comparing, so the Node
 * lane and the browser lane can be held against each other without either one
 * re-deriving what "the same match" means.
 *
 * Shared by `tests/browser/boot.spec.js` (both hosts) and available to the parity
 * check. It contains no rule: the log is a fixture and the summary is a projection
 * of a projection.
 */

import { CRADLE_R1, musterHexOf } from '../dist/runtime/index.js';

/**
 * A log for a freshly opened match, in four phases.
 *
 * First four turns of the **garrison-only lane**: alternating allocations with the
 * two realms locking in *opposite order each turn*, so a first-mover dependence
 * anywhere in the loop would change the outcome. Then a **rout phase**, a **contact
 * phase** and an **interior phase**, each added because the arithmetic it exercises
 * would otherwise never cross the host boundary through the Runtime:
 *
 * - **rout** — a detachment too small to win is sent in alone, breaks, and falls
 *   back one sector along the arc it arrived by (WM-⑤). Its displaced position and
 *   the fatigue R12 charges it are both in the viewer's own projection, so the two
 *   hosts are held to the same answer.
 * - **contact** — the main army takes the same border sector, the battle ticket 06c
 *   wired.
 * - **interior** — the army marches on into a sector no authored border touches and
 *   is engaged there, which is what ADR 0046 made possible and what ticket 07 needs.
 *
 * Pumps the runtime it is handed while deriving the fixture from public projection
 * data. The returned log can then be replayed in a host that never saw the planning
 * runtime that produced it.
 */
export function replayLog(runtime) {
  const setup = runtime.view('observer');
  const log = [];
  let lastEvents = [];
  const append = (...intents) => {
    for (const intent of intents) {
      log.push(intent);
      lastEvents = runtime.submit(intent);
      const rejected = lastEvents.find((event) => event.type === 'intent-rejected');
      if (rejected) throw new Error(`replay fixture rejected: ${rejected.detail.reason}`);
    }
    return lastEvents;
  };

  append(...setup.actors.map((actor) => ({
    kind: 'choose-capital',
    actor,
    sector: setup.realms.find((r) => r.actor === actor).sectors[0],
  })));

  const [first, second] = runtime.view('observer').actors;
  const firstView = runtime.view(first);
  const firstCapital = firstView.capitals[first];
  const firstDetachment = firstView.detachments[0].id;
  append(
    {
      kind: 'allocate-recruitment', actor: first, requestId: 'replay-recruit-1',
      sectorId: firstCapital, commit: 2, posture: 'field',
    },
    {
      kind: 'split-detachment', actor: first,
      detachmentId: firstDetachment, men: 1000,
    },
  );
  const splitDetachmentIds = runtime.view(first).detachments.map((detachment) => detachment.id);
  append(
    {
      kind: 'merge-detachments', actor: first,
      detachmentIds: splitDetachmentIds,
    },
    {
      kind: 'move-detachment', actor: first, detachmentId: firstDetachment,
      destinationHex: { q: 19, r: 13 }, forcedMarch: false,
    },
  );

  // The fronts are known only after the partition, and they do not move while
  // resolution is stubbed — so reading them once here is enough for the fixture.
  const probe = runtime.view('observer');

  // Chips key on the sector now (ADR 0046 item 4), so the lane pours onto the
  // sectors those borders are made of rather than onto the border names.
  const laneSectors = [...new Set(probe.fronts.flatMap((front) => front.sectors))].sort();

  for (let turn = 0; turn < 4; turn++) {
    const near = laneSectors[turn % laneSectors.length];
    const far = laneSectors[(turn + 1) % laneSectors.length];
    // The fixed fixture's field endpoint is r10_s2, outside every sector below.
    // These commitments are intentionally and explicitly the existing
    // garrison-only lane; naming the detachment would be an illegal claim that it
    // ends this turn on one of these sectors.
    append(
      { kind: 'allocate-commitment', actor: first, sector: near, chips: 3 + turn, detachmentIds: [] },
      { kind: 'allocate-commitment', actor: second, sector: far, chips: 2, detachmentIds: [] },
      { kind: 'allocate-commitment', actor: second, sector: near, chips: 5, detachmentIds: [] },
      // Alternating lock order, turn by turn.
      ...(turn % 2 === 0
        ? [{ kind: 'lock-commitment', actor: first }, { kind: 'lock-commitment', actor: second }]
        : [{ kind: 'lock-commitment', actor: second }, { kind: 'lock-commitment', actor: first }]),
    );
  }

  // Substance has to be *at* a sector its realm does not hold before anything can
  // be fought over, so the fixture crosses a border. The target is read off the
  // public front list rather than hard-coded, so this holds for any seed's
  // partition; the sector is pressed as well, so the M2 lever is on the wire too.
  const beforeContact = runtime.view(first);
  const ownGround = new Set(beforeContact.realms.find((realm) => realm.actor === first).sectors);
  const invaded = beforeContact.fronts
    .map((front) => ({
      front: front.key,
      sector: front.sectors.find((sector) => !ownGround.has(sector)),
    }))
    .find((candidate) => candidate.sector !== undefined);
  if (invaded === undefined) throw new Error('replay fixture found no enemy front sector to enter');
  const target = musterHexOf(CRADLE_R1, invaded.sector);

  /** Close turns, pressing one sector, until the payoff produces a battle. */
  const fightAt = (sector, chips, limit = 12) => {
    for (let turn = 0; turn < limit; turn++) {
      append({ kind: 'allocate-commitment', actor: first, sector, chips, detachmentIds: [] });
      append({ kind: 'lock-commitment', actor: second });
      const closing = append({ kind: 'lock-commitment', actor: first });
      const battle = closing.find((event) =>
        event.type === 'battle-resolved' && event.detail.sector === sector);
      if (battle !== undefined) return battle;
    }
    return undefined;
  };

  // ── rout ───────────────────────────────────────────────────────────────────
  // A force this size cannot break a full shield, which is the point: it is sent to
  // lose, so that WM-⑤'s fall-back crosses `submit()` and lands in a projection
  // both hosts must agree on. Pressing nothing keeps the lever out of the way.
  const FORLORN_MEN = 500;
  append({
    kind: 'split-detachment', actor: first, detachmentId: firstDetachment, men: FORLORN_MEN,
  });
  const forlorn = runtime.view(first).detachments
    .find((detachment) => detachment.id !== firstDetachment && detachment.men === FORLORN_MEN);
  if (forlorn === undefined) throw new Error('replay fixture could not raise its forlorn hope');
  append({
    kind: 'move-detachment', actor: first, detachmentId: forlorn.id,
    destinationHex: target, forcedMarch: false,
  });
  const broken = fightAt(invaded.sector, 0);
  if (broken === undefined || broken.detail.routed.attacker !== true) {
    throw new Error('replay fixture never routed its forlorn hope');
  }
  // The fixture verifies its own subject: a fixture that quietly stopped exercising
  // displacement would still replay identically in both hosts, and the parity check
  // would go on passing over nothing.
  const displaced = runtime.view(first).detachments.find((detachment) => detachment.id === forlorn.id);
  if (displaced === undefined) throw new Error('the forlorn hope left service instead of falling back');
  if (displaced.position.q === target.q && displaced.position.r === target.r) {
    throw new Error('the forlorn hope routed and stayed on the hex it lost');
  }

  // ── contact ────────────────────────────────────────────────────────────────
  append({
    kind: 'move-detachment', actor: first, detachmentId: firstDetachment,
    destinationHex: target, forcedMarch: true,
  });
  if (fightAt(invaded.sector, 6) === undefined) {
    throw new Error('replay fixture never reached contact');
  }

  // ── interior ───────────────────────────────────────────────────────────────
  // The sector ADR 0046 made fightable: enemy ground that no authored border
  // touches. Before 06e an army could stand here all match and meet nothing.
  const frontSectors = new Set(runtime.view(first).fronts.flatMap((front) => front.sectors));
  const held = new Set(runtime.view(first).realms.find((realm) => realm.actor === second).sectors);
  const interior = (CRADLE_R1.sectorAdjacency[invaded.sector] ?? [])
    .filter((sector) => held.has(sector) && !frontSectors.has(sector))
    .sort()[0];
  if (interior === undefined) throw new Error('replay fixture found no interior sector to enter');

  append({
    kind: 'move-detachment', actor: first, detachmentId: firstDetachment,
    destinationHex: musterHexOf(CRADLE_R1, interior), forcedMarch: false,
  });
  if (fightAt(interior, 4) === undefined) {
    throw new Error('replay fixture never fought over interior ground');
  }
  return log;
}

/**
 * Front sectors that serve exactly one contested border, each paired with it.
 *
 * Since ADR 0046 item 4 the commit key is a sector, so a fixture that wants one
 * allocation to produce one front reading has to pick its target deliberately:
 * `r7_s0` serves two borders and its chips are correctly reported under both.
 * Fixtures that are about something else filter that real behaviour out here —
 * `battle-wiring.test.js` pins it head-on instead.
 *
 * Lives beside the log rather than in either host's fixture, because both hosts
 * need it and two copies is how the Node lane and the browser lane would come to
 * exercise different sectors.
 */
export function singleBorderSites(view) {
  const served = new Map();
  for (const front of view.fronts) {
    for (const sector of front.sectors) served.set(sector, (served.get(sector) ?? 0) + 1);
  }
  return view.fronts
    .flatMap((front) => front.sectors
      .filter((sector) => served.get(sector) === 1)
      .map((sector) => ({ front: front.key, sector })))
    .sort((a, b) => (a.sector < b.sector ? -1 : a.sector > b.sector ? 1 : 0));
}

const GLOBALLY_SAFE_EVENT_TYPES = new Set([
  'battle-resolved',
  'capital-locked',
  'capitals-revealed',
  'commitment-locked',
  'commitments-revealed',
  'front-resolved',
  // Ticket 07. The match's end reaches every viewer whole — a match whose ending one
  // side could not read would not be an ending (ADR 0042).
  'match-ended',
  'realm-recomputed',
  'turn-opened',
  'upkeep-resolved',
]);

/**
 * Project one mixed-actor replay event stream to a viewer. Decision acknowledgements
 * belong only to the actor that submitted them; the shared resolution tail has a
 * fail-closed allowlist matching Runtime's globally-safe event egress.
 */
export function eventsForViewer(viewer, events) {
  return events.filter((event) =>
    GLOBALLY_SAFE_EVENT_TYPES.has(event.type) ||
    (viewer !== 'observer' && event.detail?.actor === viewer));
}

/** Replay the canonical intent log without turning another actor's acknowledgements into a side door. */
export function replayForViewer(runtime, viewer, log) {
  const events = [];
  for (const intent of log) events.push(...eventsForViewer(viewer, runtime.submit(intent)));
  return { events, view: runtime.view(viewer) };
}

/**
 * What "the same match" means for a cross-host comparison: the events in order and
 * the board state they produced.
 *
 * The authored world is deliberately **excluded** — it is frozen input, identical by
 * content hash, and carrying it here would compare the artifact instead of the
 * loop. It would also drag `choke.cap === Infinity` through a host boundary that
 * has no agreed encoding for it (gate 06 D2).
 */
export function turnSummary({ events, view }) {
  return {
    events: eventsForViewer(view.viewer, events)
      .map((event) => ({ type: event.type, turn: event.turn, detail: event.detail ?? null })),
    turn: view.turn,
    phase: view.phase,
    // Ticket 07. Inside the cross-host summary rather than beside it, because the
    // claim worth making is that both hosts reach the *same ending*, not merely that
    // each reaches one.
    outcome: view.outcome === null ? null : { ...view.outcome },
    currentActor: view.currentActor,
    committed: [...view.committed],
    fronts: view.fronts.map((front) => front.key),
    capitals: { ...view.capitals },
    realms: view.realms.map((realm) => ({ actor: realm.actor, sectors: [...realm.sectors] })),
    detachments: view.detachments.map((detachment) => ({
      id: detachment.id,
      position: detachment.position,
      destination: detachment.destination,
      men: detachment.men,
      readyMen: detachment.readyMen,
      pendingMen: detachment.pendingMen,
      fatigue: detachment.fatigue,
    })),
    economy: view.economy && {
      treasury: view.economy.treasury,
      field: view.economy.field,
      garrison: view.economy.garrison,
      register: view.economy.register,
      sectors: view.economy.sectors,
    },
    mobilizationSignals: view.mobilizationSignals,
  };
}
