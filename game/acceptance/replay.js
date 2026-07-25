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
 * Reads the runtime it is handed only through `view`, so the log is a function of
 * public projection data — which is what lets the same log be replayed in a host
 * that never saw the runtime that produced it.
 */
export function replayLog(runtime) {
  const setup = runtime.view('observer');
  const log = setup.actors.map((actor) => ({
    kind: 'choose-capital',
    actor,
    sector: setup.realms.find((r) => r.actor === actor).sectors[0],
  }));

  // The fronts are known only after the partition, and they do not move while
  // resolution is stubbed — so reading them once here is enough for the fixture.
  const probe = runtime.view('observer');
  const fronts = probe.fronts.map((f) => f.key);
  const [first, second] = setup.actors;

  for (let turn = 0; turn < 4; turn++) {
    const near = fronts[turn % fronts.length];
    const far = fronts[(turn + 1) % fronts.length];
    log.push(
      { kind: 'allocate-commitment', actor: first, front: near, chips: 3 + turn },
      { kind: 'allocate-commitment', actor: second, front: far, chips: 2 },
      { kind: 'allocate-commitment', actor: second, front: near, chips: 5 },
      // Alternating lock order, turn by turn.
      ...(turn % 2 === 0
        ? [{ kind: 'lock-commitment', actor: first }, { kind: 'lock-commitment', actor: second }]
        : [{ kind: 'lock-commitment', actor: second }, { kind: 'lock-commitment', actor: first }]),
    );
  }

  return log;
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
    events: events.map((event) => ({ type: event.type, turn: event.turn, detail: event.detail ?? null })),
    turn: view.turn,
    phase: view.phase,
    currentActor: view.currentActor,
    committed: [...view.committed],
    fronts: view.fronts.map((front) => front.key),
    capitals: { ...view.capitals },
    realms: view.realms.map((realm) => ({ actor: realm.actor, sectors: [...realm.sectors] })),
  };
}
