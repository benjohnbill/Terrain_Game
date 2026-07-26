import test from 'node:test';
import assert from 'node:assert/strict';

const { CRADLE_R1, Runtime } = await import('../dist/runtime/index.js');

function openAtDecision(seed = 'field-army-0001', world = CRADLE_R1) {
  const runtime = Runtime.open({ world, seed, actors: ['realm-a', 'realm-b'] });
  const setup = runtime.view('observer');
  runtime.submit({ kind: 'choose-capital', actor: 'realm-a', sector: 'r2_s0' });
  runtime.submit({ kind: 'choose-capital', actor: 'realm-b', sector: 'r10_s0' });
  return runtime;
}

const lock = (runtime, actor) => runtime.submit({ kind: 'lock-commitment', actor });
const closeTurn = (runtime) => [...lock(runtime, 'realm-a'), ...lock(runtime, 'realm-b')];

test('the opening field army is one positioned detachment at the capital-sector centre-nearest hex', () => {
  const runtime = openAtDecision();
  const mine = runtime.view('realm-a');
  assert.equal(mine.detachments.length, 1);
  assert.deepEqual(mine.detachments[0].position, { q: 9, r: 5 });
  assert.equal(mine.detachments[0].men, mine.economy.field);
  assert.equal(mine.detachments[0].pendingMen, 0);
});

test('opening province registers equal serving plus available civilians', () => {
  const economy = openAtDecision().view('realm-a').economy;
  for (const row of Object.values(economy.provinces)) {
    assert.equal(row.register, row.serving + row.availableCivilians);
  }
  assert.equal(
    Object.values(economy.provinces).reduce((sum, row) => sum + row.register, 0),
    economy.register,
  );
});

test('a destination order moves three cost units, accrues per-hex fatigue, and spends no commitment', () => {
  const runtime = openAtDecision();
  const id = runtime.view('realm-a').detachments[0].id;
  const accepted = runtime.submit({
    kind: 'move-detachment', actor: 'realm-a', detachmentId: id,
    destinationHex: { q: 9, r: 9 }, forcedMarch: false,
  });
  assert.equal(accepted[0].type, 'movement-planned');
  assert.equal(runtime.view('realm-a').commitment.spent, 0);
  assert.equal(runtime.view('realm-a').detachments[0].turnsRemaining, 2);
  closeTurn(runtime);
  const moved = runtime.view('realm-a').detachments[0];
  assert.equal(moved.position.q === 9 && moved.position.r === 9, false);
  assert.equal(moved.fatigue, 3);
  assert.equal(moved.turnsRemaining, 1);
});

test('forced march reaches two extra hexes and prices only the extra segment at the premium', () => {
  const runtime = openAtDecision();
  const id = runtime.view('realm-a').detachments[0].id;
  runtime.submit({
    kind: 'move-detachment', actor: 'realm-a', detachmentId: id,
    destinationHex: { q: 9, r: 9 }, forcedMarch: true,
  });
  closeTurn(runtime);
  const moved = runtime.view('realm-a').detachments[0];
  assert.deepEqual(moved.position, { q: 9, r: 9 });
  assert.equal(moved.fatigue, 6);
});

test('the authored strait makes r10 reachable and redirect starts at the current hex', () => {
  const runtime = openAtDecision();
  const id = runtime.view('realm-b').detachments[0].id;
  assert.equal(runtime.submit({
    kind: 'move-detachment', actor: 'realm-b', detachmentId: id,
    destinationHex: { q: 13, r: 15 }, forcedMarch: false,
  })[0].type, 'movement-planned');
  closeTurn(runtime);
  const current = runtime.view('realm-b').detachments[0].position;
  assert.equal(runtime.submit({
    kind: 'move-detachment', actor: 'realm-b', detachmentId: id,
    destinationHex: { q: 20, r: 14 }, forcedMarch: false,
  })[0].type, 'movement-planned');
  assert.notDeepEqual(runtime.view('realm-b').detachments[0].position, { q: 20, r: 14 });
  assert.deepEqual(runtime.view('realm-b').detachments[0].position, current);
});

test('a destination outside the authored movement graph is rejected without mutation', () => {
  const runtime = openAtDecision();
  const before = runtime.view('realm-a');
  const id = before.detachments[0].id;
  const events = runtime.submit({
    kind: 'move-detachment', actor: 'realm-a', detachmentId: id,
    destinationHex: { q: 999, r: 999 }, forcedMarch: false,
  });
  assert.equal(events[0].type, 'intent-rejected');
  assert.deepEqual(runtime.view('realm-a'), before);
});

test('front commitment names the arriving detachment and rejects one outside this-turn reach', () => {
  const runtime = openAtDecision();
  const id = runtime.view('realm-a').detachments[0].id;
  const front = 'r1_s0|r2_s3';
  assert.equal(runtime.submit({
    kind: 'allocate-commitment', actor: 'realm-a', front, chips: 4,
    detachmentIds: [id],
  })[0].type, 'intent-rejected');
  runtime.submit({
    kind: 'move-detachment', actor: 'realm-a', detachmentId: id,
    destinationHex: { q: 9, r: 9 }, forcedMarch: true,
  });
  assert.equal(runtime.submit({
    kind: 'allocate-commitment', actor: 'realm-a', front, chips: 4,
    detachmentIds: [id],
  })[0].type, 'commitment-allocated');
  assert.deepEqual(runtime.view('realm-a').commitment.assignments[front], [id]);
});

test('split and merge preserve every man and cannot launder fatigue', () => {
  const runtime = openAtDecision();
  const before = runtime.view('realm-a').detachments[0];
  const split = runtime.submit({
    kind: 'split-detachment', actor: 'realm-a', detachmentId: before.id, men: 1234,
  });
  assert.equal(split[0].type, 'detachment-split');
  const divided = runtime.view('realm-a').detachments;
  assert.equal(divided.reduce((sum, d) => sum + d.men, 0), before.men);
  assert.deepEqual(new Set(divided.map((d) => d.fatigue)), new Set([before.fatigue]));
  const child = divided.find((d) => d.id !== before.id);
  runtime.submit({
    kind: 'move-detachment', actor: 'realm-a', detachmentId: child.id,
    destinationHex: { q: 9, r: 6 }, forcedMarch: false,
  });
  closeTurn(runtime);
  runtime.submit({
    kind: 'move-detachment', actor: 'realm-a', detachmentId: child.id,
    destinationHex: { q: 9, r: 5 }, forcedMarch: false,
  });
  closeTurn(runtime);
  const beforeMerge = runtime.view('realm-a').detachments;
  const expectedFatigue = beforeMerge.reduce((sum, d) => sum + d.fatigue * d.men, 0) / before.men;
  const merged = runtime.submit({
    kind: 'merge-detachments', actor: 'realm-a',
    detachmentIds: beforeMerge.map((d) => d.id),
  });
  assert.equal(merged[0].type, 'detachments-merged');
  assert.equal(runtime.view('realm-a').detachments[0].men, before.men);
  assert.ok(Math.abs(runtime.view('realm-a').detachments[0].fatigue - expectedFatigue) < 1e-12);
});
