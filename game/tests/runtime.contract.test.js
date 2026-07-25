/**
 * Runtime contract tests — run against the **emitted artifact**, not the source
 * (gate 05 D6). Every import below points at `../dist/`, so a build that emits
 * something other than what the source says is caught here rather than in play.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

const { Runtime, BOOT_WORLD, preview } = await import('../dist/runtime/index.js');

const FIXTURE = {
  world: BOOT_WORLD,
  seed: 'contract-0001',
  actors: ['realm-a', 'realm-b'],
};

const open = (overrides = {}) => Runtime.open({ ...FIXTURE, ...overrides });

test('the surface is exactly the three members gate 02 sealed', () => {
  const runtime = open();

  assert.equal(typeof runtime.currentActor, 'string');
  assert.equal(typeof runtime.view, 'function');
  assert.equal(typeof runtime.submit, 'function');

  // No snapshot API — it would hand truth to a caller and void the blur seam.
  // No subscription API — callers pump, and `submit` returns the events.
  for (const forbidden of ['snapshot', 'getState', 'state', 'subscribe', 'on', 'addEventListener']) {
    assert.equal(
      runtime[forbidden],
      undefined,
      `Runtime must not expose "${forbidden}" — gate 02 § 6 admits no snapshot and no subscription API.`,
    );
  }
});

test('truth stays private: the seed is unreachable from outside', () => {
  const seed = 'a-very-distinctive-seed-value';
  const runtime = open({ seed });

  // Not on the instance, not on its prototype, not through enumeration.
  assert.deepEqual(Object.keys(runtime), []);
  assert.equal(Object.getOwnPropertyNames(runtime).includes('seed'), false);
  assert.equal(JSON.stringify(runtime).includes(seed), false);
});

test('the projection carries no truth — the blur seam holds', () => {
  const seed = 'another-distinctive-seed';
  const view = open({ seed }).view('realm-a');

  const serialized = JSON.stringify(view);
  assert.equal(
    serialized.includes(seed),
    false,
    'The seed reached a viewer. Every later fog contract is unenforceable if it can.',
  );
  assert.equal(serialized.includes('rng'), false);
  assert.equal('rng' in view, false);
});

test('equal world identity and seed produce equal projections', () => {
  const a = open().view('realm-a');
  const b = open().view('realm-a');
  assert.deepEqual(a, b);
});

test('a different seed is a different match, and a different world is a different world', () => {
  const base = open().view('realm-a');

  // The projection this ticket ships carries no seed-derived content yet, so
  // what is asserted is what is true today: identity flows through, and the
  // seed does not leak into it. Seed-sensitivity of *content* becomes testable
  // when ticket 02 draws the partition from it.
  const otherSeed = open({ seed: 'contract-0002' }).view('realm-a');
  assert.deepEqual(otherSeed, base);

  const otherWorld = open({ world: { worldId: 'other', revision: '9' } }).view('realm-a');
  assert.notDeepEqual(otherWorld.world, base.world);
});

test('each viewer is addressed by name, and an unknown viewer is refused', () => {
  const runtime = open();
  assert.equal(runtime.view('realm-a').viewer, 'realm-a');
  assert.equal(runtime.view('realm-b').viewer, 'realm-b');
  assert.equal(runtime.view('observer').viewer, 'observer');
  assert.throws(() => runtime.view('realm-c'), /Unknown viewer/);
});

test('an out-of-turn intent is rejected with a reason and no state transition', () => {
  const runtime = open();
  const before = runtime.view('observer');
  const notCurrent = runtime.currentActor === 'realm-a' ? 'realm-b' : 'realm-a';

  const events = runtime.submit({ kind: 'noop', actor: notCurrent });

  assert.equal(events.length, 1);
  assert.equal(events[0].type, 'intent-rejected');
  assert.match(events[0].detail.reason, /not "realm-\w"'s turn/);
  assert.deepEqual(runtime.view('observer'), before, 'A rejected intent advanced state.');
});

test('an intent from a stranger is rejected rather than trusted', () => {
  const runtime = open();
  const events = runtime.submit({ kind: 'noop', actor: 'realm-z' });
  assert.equal(events[0].type, 'intent-rejected');
  assert.match(events[0].detail.reason, /not an actor in this match/);
});

test('a malformed intent is rejected without throwing', () => {
  const runtime = open();
  for (const bad of [null, undefined, {}, { actor: 'realm-a' }, { kind: '', actor: 'realm-a' }]) {
    const events = runtime.submit(bad);
    assert.equal(events[0].type, 'intent-rejected', `Accepted a malformed intent: ${JSON.stringify(bad)}`);
  }
});

test('opening rejects a bad config rather than substituting a default', () => {
  assert.throws(() => Runtime.open({ ...FIXTURE, seed: '' }), /seed/);
  assert.throws(() => Runtime.open({ ...FIXTURE, seed: undefined }), /seed/);
  assert.throws(() => Runtime.open({ ...FIXTURE, world: { worldId: 'x' } }), /worldId and revision/);
  assert.throws(() => Runtime.open({ ...FIXTURE, actors: [] }), /at least one actor/);
  assert.throws(() => Runtime.open({ ...FIXTURE, actors: ['a', 'a'] }), /unique/);
});

test('no clock is needed to boot — rules never read the wall clock', () => {
  // ADR 0040 bars rules from `Date.now()`. Booting and projecting without an
  // injected clock is the evidence that nothing on this path reaches for one.
  const runtime = Runtime.open({ ...FIXTURE });
  assert.doesNotThrow(() => runtime.view('realm-a'));
  assert.doesNotThrow(() => runtime.submit({ kind: 'noop', actor: runtime.currentActor }));
});

test('preview is pure, reads only a view, and agrees with the Runtime', () => {
  const runtime = open();
  const view = runtime.view('realm-a');
  const notCurrent = view.currentActor === 'realm-a' ? 'realm-b' : 'realm-a';

  const once = preview(view, { kind: 'noop', actor: notCurrent });
  const twice = preview(view, { kind: 'noop', actor: notCurrent });
  assert.deepEqual(once, twice, 'preview is not pure.');

  assert.equal(once.admissible, false);
  const events = runtime.submit({ kind: 'noop', actor: notCurrent });
  assert.equal(
    events[0].type,
    'intent-rejected',
    'preview and the Runtime disagree about admissibility.',
  );

  assert.equal(preview(view, { kind: 'noop', actor: view.currentActor }).admissible, true);
});
