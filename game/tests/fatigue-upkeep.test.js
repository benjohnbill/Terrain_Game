/**
 * The wear ledger, wired — ticket 06b's turn-loop half.
 *
 * `fatigue-ledger.test.js` pins the arithmetic in isolation. This file pins the
 * arithmetic **running inside a real turn**: march accrues at the payoff tier,
 * upkeep recovers at the background tier's tail (D6.2), and what comes out is
 * turn N+1's opening wear. Nothing here re-derives a curve; every expected value
 * is composed from the module's own exported dials, so a re-cut at a birthplace
 * moves these tests without editing them.
 *
 * Authority: slice-2 operational-layer design § 2, war-model-build MAGNITUDE
 * WB-M① (values, L1), and the ticket's RE-CUT 2026-07-28 — under which **supply
 * is uniform**: every force is supplied, because the plans that would cut supply
 * are not built. That is why nothing here starves, and why the supply account is
 * absent from match state rather than stored at zero.
 *
 * Run against the emitted artifact, never the source (gate 05 D6).
 */

import test from 'node:test';
import assert from 'node:assert/strict';

const {
  buildMovementGraph,
  CRADLE_R1,
  FORCED_MARCH_EXTRA_CAP,
  FORCED_MARCH_PREMIUM,
  hexKey,
  MARCH_FATIGUE_PER_HEX,
  MARCH_SPEED,
  musterHexOf,
  RECOVERY_BASE_RATE,
  Runtime,
} = await import('../dist/runtime/index.js');

const FIXTURE = { world: CRADLE_R1, seed: 'upkeep-0001', actors: ['realm-a', 'realm-b'] };
const GRAPH = buildMovementGraph(CRADLE_R1);

/** What a turn of ordinary marching costs, net of the recovery at its tail. */
const ORDINARY_MARCH_ACCRUAL = MARCH_SPEED * MARCH_FATIGUE_PER_HEX;
const FORCED_MARCH_ACCRUAL = ORDINARY_MARCH_ACCRUAL +
  FORCED_MARCH_EXTRA_CAP * MARCH_FATIGUE_PER_HEX * FORCED_MARCH_PREMIUM;

function openAtDecision(overrides = {}) {
  const runtime = Runtime.open({ ...FIXTURE, ...overrides });
  const setup = runtime.view('observer');
  for (const actor of setup.actors) {
    const sector = setup.realms.find((realm) => realm.actor === actor).sectors[0];
    runtime.submit({ kind: 'choose-capital', actor, sector });
  }
  return runtime;
}

/**
 * A hex exactly `depth` arcs away, found by breadth-first walk over the same
 * canonical arc order the router uses — so the route the Runtime picks has
 * exactly `depth` arcs while every arc still costs one (the uniform terrain
 * seam 06a left in place).
 */
function hexAtDepth(from, depth) {
  let frontier = [hexKey(from.q, from.r)];
  const seen = new Set(frontier);
  for (let step = 0; step < depth; step += 1) {
    const next = [];
    for (const key of frontier) {
      for (const arc of GRAPH.nodes[key].arcs) {
        if (seen.has(arc.to)) continue;
        seen.add(arc.to);
        next.push(arc.to);
      }
    }
    frontier = next;
  }
  if (frontier.length === 0) throw new Error(`no hex lies ${depth} arcs from ${hexKey(from.q, from.r)}`);
  return { ...GRAPH.nodes[frontier[0]].position };
}

const submit = (runtime, intent) => {
  const events = runtime.submit(intent);
  const rejected = events.find((event) => event.type === 'intent-rejected');
  if (rejected) throw new Error(`rejected: ${rejected.detail.reason}`);
  return events;
};

const march = (runtime, actor, detachmentId, destinationHex, forcedMarch = false) =>
  submit(runtime, { kind: 'move-detachment', actor, detachmentId, destinationHex, forcedMarch });

/** Close the turn: nobody needs to commit a chip for the background tail to run. */
const endTurn = (runtime) => {
  const events = [];
  for (const actor of runtime.view('observer').actors) {
    events.push(...submit(runtime, { kind: 'lock-commitment', actor }));
  }
  return events;
};

const detachmentsOf = (runtime, actor) => runtime.view(actor).detachments;
const soleDetachment = (runtime, actor) => detachmentsOf(runtime, actor)[0];
const wearOf = (runtime, actor, detachmentId) =>
  detachmentsOf(runtime, actor).find((detachment) => detachment.id === detachmentId).fatigue;

// ── the beat exists at all ───────────────────────────────────────────────────

test('upkeep runs once per realm at the background tier, and reveals only that it ran', () => {
  const runtime = openAtDecision();
  const closing = endTurn(runtime);

  const upkeep = closing.filter((event) => event.type === 'upkeep-resolved');
  assert.equal(upkeep.length, 2, 'the wear ledger was not upkept once per realm');
  assert.deepEqual(
    upkeep.map((event) => event.detail.actor),
    ['realm-a', 'realm-b'],
    'upkeep did not run in a deterministic actor order',
  );
  for (const event of upkeep) {
    assert.equal(event.detail.tier, 'background');
    // Own force wear is own truth. The *fact* of the beat crosses, exactly as
    // `realm-recomputed` does; the numbers stay behind `view(actor)`.
    assert.deepEqual(Object.keys(event.detail).sort(), ['actor', 'tier']);
  }

  // And it lands inside the same submission as the reveal — no upkeep screen.
  assert.ok(
    closing.findIndex((event) => event.type === 'upkeep-resolved') <
      closing.findIndex((event) => event.type === 'turn-opened'),
    'upkeep ran after the turn had already opened',
  );
});

// ── march accrual is per hex (R13) ───────────────────────────────────────────

test('a marching force accrues per hex every turn and recovers at the turn tail', () => {
  const runtime = openAtDecision();
  const detachment = soleDetachment(runtime, 'realm-a');
  march(runtime, 'realm-a', detachment.id, hexAtDepth(detachment.position, MARCH_SPEED * 3));

  const trail = [];
  for (let turn = 0; turn < 3; turn += 1) {
    endTurn(runtime);
    trail.push(wearOf(runtime, 'realm-a', detachment.id));
  }

  // Three full-speed turns, each costing its hexes and recovering once.
  const perTurn = ORDINARY_MARCH_ACCRUAL - RECOVERY_BASE_RATE;
  assert.ok(perTurn > 0, 'this fixture cannot show accumulation: a march is cheaper than a rest');
  assert.deepEqual(trail, [perTurn, perTurn * 2, perTurn * 3]);
});

test('the forced-march premium is paid on the hexes past ordinary speed', () => {
  const runtime = openAtDecision();
  const detachment = soleDetachment(runtime, 'realm-a');
  const far = hexAtDepth(detachment.position, (MARCH_SPEED + FORCED_MARCH_EXTRA_CAP) * 2);
  march(runtime, 'realm-a', detachment.id, far, true);
  endTurn(runtime);

  assert.equal(
    wearOf(runtime, 'realm-a', detachment.id),
    FORCED_MARCH_ACCRUAL - RECOVERY_BASE_RATE,
    'the extra hexes were not priced at the premium',
  );
});

test('a long march costs more than a short one in the same turn (R13)', () => {
  // Per-hex is the claim, so the gap between two marches must be exactly the gap
  // in hexes. Both realms are given the same wear history first, so neither the
  // recovery nor the zero floor can flatten the comparison.
  const runtime = openAtDecision();
  const long = soleDetachment(runtime, 'realm-a');
  const short = soleDetachment(runtime, 'realm-b');
  const preload = MARCH_SPEED + FORCED_MARCH_EXTRA_CAP;
  march(runtime, 'realm-a', long.id, hexAtDepth(long.position, preload), true);
  march(runtime, 'realm-b', short.id, hexAtDepth(short.position, preload), true);
  endTurn(runtime);

  const before = wearOf(runtime, 'realm-a', long.id);
  assert.equal(before, wearOf(runtime, 'realm-b', short.id), 'the two histories are not equal');
  assert.ok(before >= RECOVERY_BASE_RATE, 'the preload is too small to clear the zero floor');

  const longer = detachmentsOf(runtime, 'realm-a')[0];
  const shorter = detachmentsOf(runtime, 'realm-b')[0];
  march(runtime, 'realm-a', longer.id, hexAtDepth(longer.position, MARCH_SPEED));
  march(runtime, 'realm-b', shorter.id, hexAtDepth(shorter.position, 1));
  endTurn(runtime);

  const longWear = wearOf(runtime, 'realm-a', long.id);
  const shortWear = wearOf(runtime, 'realm-b', short.id);
  assert.ok(longWear > shortWear, 'a three-hex march cost no more than a one-hex march');
  assert.equal(
    longWear - shortWear,
    (MARCH_SPEED - 1) * MARCH_FATIGUE_PER_HEX,
    'the gap is not the per-hex rate times the extra hexes',
  );
});

// ── recovery, through a real turn ────────────────────────────────────────────

test('a resting force recovers the base rate each turn and stops at zero', () => {
  const runtime = openAtDecision();
  const detachment = soleDetachment(runtime, 'realm-a');
  const far = hexAtDepth(detachment.position, MARCH_SPEED + FORCED_MARCH_EXTRA_CAP);
  march(runtime, 'realm-a', detachment.id, far, true);
  endTurn(runtime);

  const worn = wearOf(runtime, 'realm-a', detachment.id);
  assert.ok(worn > 0, 'the march left no wear to recover');

  const trail = [];
  for (let turn = 0; turn < 6; turn += 1) {
    endTurn(runtime);
    trail.push(wearOf(runtime, 'realm-a', detachment.id));
  }

  const expected = [];
  for (let turn = 1; turn <= 6; turn += 1) {
    expected.push(Math.max(0, worn - RECOVERY_BASE_RATE * turn));
  }
  assert.deepEqual(trail, expected, 'recovery is not the base rate per resting turn');
  assert.equal(trail.at(-1), 0, 'a rested force never reached zero');
});

test('a marching cohort still waiting to be ready recovers on the same terms', () => {
  // Movement accrues to pending cohorts as well as ready ones (06a), so upkeep
  // must reach them too — a one-way account would let a recruit's march wear
  // stand forever and then average into the ready cohort on activation.
  const runtime = openAtDecision();
  const capital = runtime.view('realm-a').capitals['realm-a'];
  const muster = musterHexOf(CRADLE_R1, capital);
  submit(runtime, {
    kind: 'allocate-recruitment',
    actor: 'realm-a',
    requestId: 'upkeep-recruit-1',
    sectorId: capital,
    commit: 4,
    posture: 'field',
    destinationHex: hexAtDepth(muster, MARCH_SPEED),
  });
  endTurn(runtime);

  const marching = detachmentsOf(runtime, 'realm-a')
    .find((detachment) => detachment.pendingMen > 0);
  assert.ok(marching !== undefined, 'the recruitment produced no pending cohort to march');
  assert.equal(
    marching.pendingFatigue,
    ORDINARY_MARCH_ACCRUAL - RECOVERY_BASE_RATE,
    'the pending cohort marched without being upkept',
  );
});

// ── the exemption ban: no sector class is privileged ─────────────────────────

test('a force on its own capital sector recovers exactly as one on ordinary ground', () => {
  // The clause ticket 06b keeps from the moved supply predicate, and the negative
  // guarantee ticket 07 item 7 needs: no unit and no sector is exempted by class,
  // **including a capital sector**. Supply is uniform and no code path reads a
  // sector's class, so this holds by construction — the test is the tripwire that
  // makes it mechanical rather than read off prose.
  const runtime = openAtDecision();
  const capital = runtime.view('realm-a').capitals['realm-a'];
  const muster = musterHexOf(CRADLE_R1, capital);
  const opening = soleDetachment(runtime, 'realm-a');
  assert.deepEqual(opening.position, muster, 'the opening field does not stand on its capital');

  // Wear it deeply, then bring it home, so one force can be on the capital *and*
  // have something to recover.
  const outbound = MARCH_SPEED + FORCED_MARCH_EXTRA_CAP;
  march(runtime, 'realm-a', opening.id, hexAtDepth(muster, outbound * 2), true);
  endTurn(runtime);
  march(runtime, 'realm-a', opening.id, muster, true);
  endTurn(runtime);
  assert.deepEqual(soleDetachment(runtime, 'realm-a').position, muster, 'the force did not come home');

  // Split at the capital, so both halves carry identical wear, then send one away.
  const carried = wearOf(runtime, 'realm-a', opening.id);
  assert.ok(carried >= RECOVERY_BASE_RATE * 2, 'not enough wear to compare two recoveries');
  submit(runtime, {
    kind: 'split-detachment',
    actor: 'realm-a',
    detachmentId: opening.id,
    men: Math.floor(soleDetachment(runtime, 'realm-a').men / 2),
  });
  const away = detachmentsOf(runtime, 'realm-a').find((detachment) => detachment.id !== opening.id);
  march(runtime, 'realm-a', away.id, hexAtDepth(muster, 1));
  endTurn(runtime);

  const homeBefore = wearOf(runtime, 'realm-a', opening.id);
  const awayBefore = wearOf(runtime, 'realm-a', away.id);
  const homePosition = detachmentsOf(runtime, 'realm-a')
    .find((detachment) => detachment.id === opening.id).position;
  const awayPosition = detachmentsOf(runtime, 'realm-a')
    .find((detachment) => detachment.id === away.id).position;
  assert.deepEqual(homePosition, muster, 'the home half left the capital');
  assert.notDeepEqual(awayPosition, muster, 'the away half never left the capital');

  // Both rest one turn. Equal recovery is the whole claim: were the capital a
  // supply base, or exempt by class, the two would diverge here.
  endTurn(runtime);
  assert.equal(
    homeBefore - wearOf(runtime, 'realm-a', opening.id),
    RECOVERY_BASE_RATE,
    'the force on the capital recovered at a privileged rate',
  );
  assert.equal(
    awayBefore - wearOf(runtime, 'realm-a', away.id),
    RECOVERY_BASE_RATE,
    'the force off the capital recovered at a penalised rate',
  );
});

// ── the dormant half: nothing starves while supply is uniform ────────────────

test('upkeep takes no man, turn after turn', () => {
  // Supply cannot be cut in this slice, so no force may lose substance to the
  // supply account. With `fatigue-ledger.test.js` pinning that wear never kills,
  // this closes the firewall from the wired side.
  const runtime = openAtDecision();
  const detachment = soleDetachment(runtime, 'realm-a');
  march(runtime, 'realm-a', detachment.id, hexAtDepth(detachment.position, MARCH_SPEED * 4), true);

  const men = soleDetachment(runtime, 'realm-a').men;
  const field = runtime.view('realm-a').economy.field;
  for (let turn = 0; turn < 6; turn += 1) {
    endTurn(runtime);
    assert.equal(soleDetachment(runtime, 'realm-a').men, men, `men changed on turn ${turn + 1}`);
    assert.equal(runtime.view('realm-a').economy.field, field, `the field changed on turn ${turn + 1}`);
  }
  assert.ok(wearOf(runtime, 'realm-a', detachment.id) > 0, 'the sweep never wore the force at all');
});

// ── determinism ─────────────────────────────────────────────────────────────

test('equal inputs produce equal wear, run after run', () => {
  const run = () => {
    const runtime = openAtDecision();
    const detachment = soleDetachment(runtime, 'realm-a');
    march(runtime, 'realm-a', detachment.id, hexAtDepth(detachment.position, MARCH_SPEED * 2), true);
    const trail = [];
    for (let turn = 0; turn < 5; turn += 1) {
      endTurn(runtime);
      trail.push(detachmentsOf(runtime, 'realm-a').map((entry) => [entry.id, entry.fatigue]));
    }
    return trail;
  };

  assert.deepEqual(run(), run());
});
