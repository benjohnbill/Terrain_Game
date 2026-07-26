/**
 * Sector-sited recruitment settlement — ticket 06a, Task 5.
 *
 * These acceptance tests stay at the emitted Runtime seam. They catch a return
 * to scalar recruitment, request-order priority, per-request billing, or a JSON
 * world clone that corrupts native Infinity.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

const {
  contentHashOf,
  CRADLE_R1,
  draftOrder,
  preview,
  recruitmentOrderKeyOf,
  Runtime,
  settleRecruitmentBatch,
} = await import('../dist/runtime/index.js');

const ACTORS = ['realm-a', 'realm-b'];

function openAtDecision(seed = 'field-army-0001', world = CRADLE_R1) {
  const runtime = Runtime.open({ world, seed, actors: ACTORS });
  const setup = runtime.view('observer');
  for (const actor of setup.actors) {
    const sector = setup.realms.find((realm) => realm.actor === actor).sectors[0];
    runtime.submit({ kind: 'choose-capital', actor, sector });
  }
  return runtime;
}

const recruit = (runtime, actor, requestId, sectorId, commit, posture = 'field', extra = {}) =>
  runtime.submit({
    kind: 'allocate-recruitment', actor, requestId, sectorId, commit, posture, ...extra,
  });

function closeTurn(runtime) {
  const events = [];
  for (const actor of runtime.view('observer').actors) {
    events.push(...runtime.submit({ kind: 'lock-commitment', actor }));
  }
  return events;
}

function economyScaledWorld(multiplier, revision) {
  const world = structuredClone(CRADLE_R1);
  world.revision = revision;
  for (const sector of Object.values(world.sectors)) sector.economyValue *= multiplier;
  world.contentHash = contentHashOf(world);
  return world;
}

test('one point and stacked points retain the sealed one-percent conversion', () => {
  const one = openAtDecision();
  const beforeOne = one.view('realm-a').economy.field;
  const unit = Math.floor(one.view('realm-a').economy.forceLimit * 0.01);
  assert.equal(recruit(one, 'realm-a', 'r2-one', 'r2_s0', 1)[0].type, 'recruitment-allocated');
  closeTurn(one);
  assert.equal(one.view('realm-a').economy.field - beforeOne, unit);

  const stacked = openAtDecision();
  const beforeStack = stacked.view('realm-a').economy.field;
  recruit(stacked, 'realm-a', 'r2-stack', 'r2_s0', 4);
  closeTurn(stacked);
  assert.equal(stacked.view('realm-a').economy.field - beforeStack, unit * 4);
});

test('stacked conversion floors the one-point unit before multiplying', () => {
  const sectorId = 'fractional-sector';
  const regionId = 'fractional-region';
  const settle = (commit) => settleRecruitmentBatch({
    requests: [{ requestId: `fractional-${commit}`, sectorId, commit, posture: 'field' }],
    forceLimit: 12_345,
    field: 0,
    garrison: 0,
    register: 1_000_000,
    treasury: 1_000_000,
    availableCivilians: { [regionId]: 1_000_000 },
    sectorRegions: { [sectorId]: regionId },
    garrisonHeadroom: { [sectorId]: 0 },
    musterHexes: { [sectorId]: { q: 0, r: 0 } },
  });

  const unit = settle(1).fulfilled[0].requestedMen;
  assert.equal(unit, 123);
  assert.equal(settle(4).fulfilled[0].requestedMen, unit * 4);
  assert.deepEqual(
    draftOrder({
      chips: 4,
      forceLimit: 12_345,
      field: 0,
      garrison: 0,
      register: 1_000_000,
      treasury: 1_000_000,
    }),
    { men: unit * 4, bill: 2.46, limitedBy: null },
  );
});

test('a recruitment allocation key cannot be rewritten through the front lane', () => {
  const runtime = openAtDecision();
  recruit(runtime, 'realm-a', 'free', 'r2_s0', 20);
  const frontLaneIntent = {
    kind: 'allocate-commitment',
    actor: 'realm-a',
    front: recruitmentOrderKeyOf('free'),
    chips: 0,
  };

  assert.equal(preview(runtime.view('realm-a'), frontLaneIntent).admissible, false);
  const rejected = runtime.submit(frontLaneIntent);

  assert.equal(rejected[0].type, 'intent-rejected');
  assert.equal(runtime.view('realm-a').commitment.remaining, 0);
  assert.equal(runtime.view('realm-a').recruitmentOrders[0].commit, 20);
});

test('permuting the same recruitment batch leaves resolution events and state identical', () => {
  const run = (requests) => {
    const runtime = openAtDecision();
    for (const request of requests) recruit(runtime, 'realm-a', ...request);
    const closing = closeTurn(runtime).filter((event) =>
      ['recruitment-resolved', 'recruited', 'turn-opened'].includes(event.type));
    return { closing, view: runtime.view('realm-a') };
  };
  const requests = [
    ['north', 'r2_s0', 2, 'field'],
    ['south', 'r2_s4', 3, 'garrison'],
  ];
  assert.deepEqual(run(requests), run([...requests].reverse()));
});

test('splitting equal aggregate demand across sectors cannot reduce the authoritative bill', () => {
  const concentrated = openAtDecision();
  recruit(concentrated, 'realm-a', 'all', 'r2_s0', 4);
  const aEvents = closeTurn(concentrated);
  const split = openAtDecision();
  recruit(split, 'realm-a', 'a', 'r2_s0', 2);
  recruit(split, 'realm-a', 'b', 'r2_s3', 2);
  const bEvents = closeTurn(split);
  const bill = (events) => events.find((event) => event.type === 'recruitment-resolved').detail.bill;
  assert.equal(bill(aEvents), bill(bEvents));
});

test('province scarcity uses canonical largest remainder, not request submit order', () => {
  const run = (ids) => {
    const runtime = openAtDecision('field-army-0001', economyScaledWorld(100, 'r1-rich-test'));
    const available = runtime.view('realm-a').economy.provinces.r2.availableCivilians;
    const perPoint = Math.floor(runtime.view('realm-a').economy.forceLimit * 0.01);
    let pointsToDrain = Math.max(0, Math.floor(available / perPoint) - 5);
    let turn = 0;
    while (pointsToDrain > 0) {
      const commit = Math.min(20, pointsToDrain);
      recruit(runtime, 'realm-a', `drain-${turn}`, 'r2_s0', commit);
      closeTurn(runtime);
      pointsToDrain -= commit;
      turn += 1;
    }
    for (const id of ids) recruit(runtime, 'realm-a', id, id === 'a' ? 'r2_s0' : 'r2_s4', 10);
    return closeTurn(runtime).filter((event) => event.type === 'recruited');
  };
  assert.deepEqual(run(['a', 'b']), run(['b', 'a']));
});

test('insufficient treasury fulfills no request and emits no recruited event', () => {
  const runtime = openAtDecision('field-army-0001', economyScaledWorld(0.00001, 'r1-poor-test'));
  recruit(runtime, 'realm-a', 'poor', 'r2_s0', 1);
  const events = closeTurn(runtime);
  assert.equal(events.some((event) => event.type === 'recruited'), false);
});

test('field recruits may normal-march and affiliate but remain separately pending for one decision beat', () => {
  const runtime = openAtDecision();
  const host = runtime.view('realm-a').detachments[0];
  runtime.submit({
    kind: 'move-detachment', actor: 'realm-a', detachmentId: host.id,
    destinationHex: { q: 8, r: 7 }, forcedMarch: false,
  });
  recruit(runtime, 'realm-a', 'reinforce', 'r2_s0', 2, 'field', {
    destinationHex: { q: 8, r: 7 },
    joinDetachmentId: host.id,
  });
  const raised = closeTurn(runtime);
  const joined = runtime.view('realm-a').detachments.find((d) => d.id === host.id);
  assert.deepEqual(joined.position, { q: 8, r: 7 });
  assert.ok(joined.pendingMen > 0);
  assert.equal(joined.readyMen, host.readyMen);
  assert.equal(joined.pendingReadyOnTurn, runtime.view('realm-a').turn);
  const affiliation = raised.find((event) => event.type === 'cohort-affiliated');
  assert.ok(affiliation);
  assert.deepEqual(
    affiliation.detail,
    {
      tier: 'payoff',
      actor: 'realm-a',
      requestId: 'reinforce',
      detachmentId: host.id,
      recruitedDetachmentId: 'detachment:realm-a:2',
    },
  );
});

test('recruitment-turn forced march and excess normal reach are rejected', () => {
  const runtime = openAtDecision();
  for (const extra of [
    { destinationHex: { q: 5, r: 8 }, forcedMarch: true },
    { destinationHex: { q: 5, r: 8 } },
  ]) {
    const events = runtime.submit({
      kind: 'allocate-recruitment', actor: 'realm-a', requestId: JSON.stringify(extra),
      sectorId: 'r2_s0', commit: 1, posture: 'field', ...extra,
    });
    assert.equal(events[0].type, 'intent-rejected');
  }
});

test('pending recruits activate before the following turn resolves, never in the raising turn', () => {
  const runtime = openAtDecision();
  recruit(runtime, 'realm-a', 'standalone', 'r2_s0', 1, 'field');
  const raised = closeTurn(runtime);
  assert.equal(raised.some((event) => event.type === 'cohort-activated'), false);
  assert.ok(runtime.view('realm-a').detachments.some((d) => d.pendingMen > 0));
  const next = closeTurn(runtime);
  assert.equal(next.some((event) => event.type === 'cohort-activated'), true);
  assert.equal(runtime.view('realm-a').detachments.reduce((n, d) => n + d.pendingMen, 0), 0);
});

test('redirecting an affiliation host invalidates the stored recruitment request at lock', () => {
  const runtime = openAtDecision();
  const host = runtime.view('realm-a').detachments[0];
  runtime.submit({
    kind: 'move-detachment', actor: 'realm-a', detachmentId: host.id,
    destinationHex: { q: 8, r: 7 }, forcedMarch: false,
  });
  assert.equal(recruit(runtime, 'realm-a', 'redirected-host', 'r2_s0', 1, 'field', {
    destinationHex: { q: 8, r: 7 },
    joinDetachmentId: host.id,
  })[0].type, 'recruitment-allocated');
  runtime.submit({
    kind: 'move-detachment', actor: 'realm-a', detachmentId: host.id,
    destinationHex: { q: 9, r: 5 }, forcedMarch: false,
  });

  const lock = { kind: 'lock-commitment', actor: 'realm-a' };
  assert.equal(preview(runtime.view('realm-a'), lock).admissible, false);
  assert.equal(runtime.submit(lock)[0].type, 'intent-rejected');
  assert.equal(runtime.view('realm-a').recruitmentOrders[0].requestId, 'redirected-host');
});

test('standalone field recruits keep a stable id and their own normal-march fatigue through activation', () => {
  const runtime = openAtDecision();
  const openingId = runtime.view('realm-a').detachments[0].id;
  recruit(runtime, 'realm-a', 'marching-standalone', 'r2_s0', 1, 'field', {
    destinationHex: { q: 8, r: 7 },
  });
  closeTurn(runtime);
  const pending = runtime.view('realm-a').detachments.find((d) => d.id !== openingId);
  assert.deepEqual(pending.position, { q: 8, r: 7 });
  assert.equal(pending.readyMen, 0);
  assert.ok(pending.pendingMen > 0);
  assert.equal(pending.pendingFatigue, 2);
  const stableId = pending.id;

  closeTurn(runtime);
  const activated = runtime.view('realm-a').detachments.find((d) => d.id === stableId);
  assert.equal(activated.pendingMen, 0);
  assert.equal(activated.readyMen, pending.pendingMen);
  assert.equal(activated.fatigue, 2);
});

test('garrison recruits count toward the local cap while pending and defend only after activation', () => {
  const runtime = openAtDecision();
  recruit(runtime, 'realm-a', 'shield', 'r2_s4', 1, 'garrison');
  closeTurn(runtime);
  const pending = runtime.view('realm-a').garrisons.find((g) => g.sectorId === 'r2_s4');
  assert.ok(pending.pendingMen > 0);
  assert.equal(pending.readyMen, 0);

  closeTurn(runtime);
  const activated = runtime.view('realm-a').garrisons.find((g) => g.sectorId === 'r2_s4');
  assert.equal(activated.pendingMen, 0);
  assert.equal(activated.readyMen, pending.pendingMen);
});
