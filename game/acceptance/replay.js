/**
 * The canonical durable form, exercised.
 *
 * Gate 02 § 5 seals that a match is reproducible from `(authored world identity,
 * seed, ordered intent log)` — that triple, and no snapshot. This module builds a
 * representative log and reduces a replay to the part worth comparing, so the Node
 * lane and the browser lane can be held against each other without either one
 * re-deriving what "the same match" means.
 *
 * Shared by `tests/browser/boot.spec.js` (both hosts) and available to the parity
 * check. It contains no rule: the log is a fixture and the summary is a projection
 * of a projection.
 */

/**
 * A four-turn log for a freshly opened match: the capital beat, then alternating
 * allocations with the two realms locking in **opposite order each turn**, so a
 * first-mover dependence anywhere in the loop would change the outcome.
 *
 * Pumps the runtime it is handed while deriving the fixture from public projection
 * data. The returned log can then be replayed in a host that never saw the planning
 * runtime that produced it.
 */
export function replayLog(runtime) {
  const setup = runtime.view('observer');
  const log = [];
  const append = (...intents) => {
    for (const intent of intents) {
      log.push(intent);
      const rejected = runtime.submit(intent).find((event) => event.type === 'intent-rejected');
      if (rejected) throw new Error(`replay fixture rejected: ${rejected.detail.reason}`);
    }
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
  const fronts = probe.fronts.map((f) => f.key);

  for (let turn = 0; turn < 4; turn++) {
    const near = fronts[turn % fronts.length];
    const far = fronts[(turn + 1) % fronts.length];
    // The fixed fixture's field endpoint is r10_s2, outside every contested
    // front below. These commitments are intentionally and explicitly the
    // existing garrison-only lane; naming the detachment would be an illegal
    // claim that it reaches one of these fronts this turn.
    append(
      { kind: 'allocate-commitment', actor: first, front: near, chips: 3 + turn, detachmentIds: [] },
      { kind: 'allocate-commitment', actor: second, front: far, chips: 2, detachmentIds: [] },
      { kind: 'allocate-commitment', actor: second, front: near, chips: 5, detachmentIds: [] },
      // Alternating lock order, turn by turn.
      ...(turn % 2 === 0
        ? [{ kind: 'lock-commitment', actor: first }, { kind: 'lock-commitment', actor: second }]
        : [{ kind: 'lock-commitment', actor: second }, { kind: 'lock-commitment', actor: first }]),
    );
  }

  return log;
}

const GLOBALLY_SAFE_EVENT_TYPES = new Set([
  'capital-locked',
  'capitals-revealed',
  'commitment-locked',
  'commitments-revealed',
  'front-resolved',
  'realm-recomputed',
  'turn-opened',
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
      provinces: view.economy.provinces,
    },
    mobilizationSignals: view.mobilizationSignals,
  };
}
