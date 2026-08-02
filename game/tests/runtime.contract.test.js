/**
 * Runtime contract tests — run against the **emitted artifact**, not the source
 * (gate 05 D6). Every import below points at `../dist/`, so a build that emits
 * something other than what the source says is caught here rather than in play.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

const { Runtime, CRADLE_R1, preview } = await import('../dist/runtime/index.js');

const FIXTURE = {
  world: CRADLE_R1,
  seed: 'contract-0001',
  actors: ['realm-a', 'realm-b'],
};

const open = (overrides = {}) => Runtime.open({ ...FIXTURE, ...overrides });

test('the surface is exactly the three members gate 02 sealed', () => {
  const runtime = open();

  assert.equal(typeof runtime.currentActor, 'string');
  assert.equal(typeof runtime.view, 'function');
  assert.equal(typeof runtime.submit, 'function');

  // No snapshot API — it would hand truth to a caller and void the projection
  // boundary. No subscription API — callers pump, and `submit` returns the events.
  for (const forbidden of ['snapshot', 'getState', 'state', 'subscribe', 'on', 'addEventListener']) {
    assert.equal(
      runtime[forbidden],
      undefined,
      `Runtime must not expose "${forbidden}" — ADR 0049 Decision 4 admits no snapshot and no subscription API.`,
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

test('a different seed is a different match', () => {
  // Ticket 01 could only assert that identity flowed through, because nothing
  // in the projection was seed-derived yet. Ticket 02's partition draw is, so
  // the real claim is now testable: the seed decides the board you play on.
  const base = open().view('realm-a');

  const different = Array.from({ length: 20 }, (_, i) =>
    open({ seed: `contract-alt-${i}` }).view('realm-a'),
  ).some((v) => JSON.stringify(v.realms) !== JSON.stringify(base.realms));

  assert.ok(different, 'twenty seeds all produced the same realms');
});

test('each viewer is addressed by name, and an unknown viewer is refused', () => {
  const runtime = open();
  assert.equal(runtime.view('realm-a').viewer, 'realm-a');
  assert.equal(runtime.view('realm-b').viewer, 'realm-b');
  assert.equal(runtime.view('observer').viewer, 'observer');
  assert.throws(() => runtime.view('realm-c'), /Unknown viewer/);
});

test('an unwired intent kind is rejected by name, with no state transition', () => {
  // Ticket 01 asserted a blanket out-of-turn guard here, because `currentActor`
  // was the only legality rule it had. Ticket 02 replaced that with a real,
  // phase-scoped rule — and the first phase is *simultaneous*, so "whose turn"
  // is not what makes a capital choice legal or illegal. See match-setup tests.
  //
  // What must remain true, and is asserted here, is the guarantee underneath:
  // the Runtime — not the caller — decides, and nothing unwired slips through.
  // Turn-legality for the commit loop returns with ticket 03.
  const runtime = open();
  const before = runtime.view('observer');

  const events = runtime.submit({ kind: 'noop', actor: 'realm-b' });

  assert.equal(events.length, 1);
  assert.equal(events[0].type, 'intent-rejected');
  assert.match(events[0].detail.reason, /No resolution is wired for intent kind "noop"/);
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
  assert.throws(() => Runtime.open({ ...FIXTURE, actors: [] }), /exactly two actors/);
  assert.throws(() => Runtime.open({ ...FIXTURE, actors: ['a', 'a'] }), /unique/);
  // A world that is not an artifact fails the same closed door as a corrupt one.
  assert.throws(() => Runtime.open({ ...FIXTURE, world: { worldId: 'x' } }), /schema version/);
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
  const mine = view.realms.find((r) => r.actor === 'realm-a').sectors[0];

  const once = preview(view, { kind: 'choose-capital', actor: 'realm-a', sector: mine });
  const twice = preview(view, { kind: 'choose-capital', actor: 'realm-a', sector: mine });
  assert.deepEqual(once, twice, 'preview is not pure.');
  assert.equal(once.admissible, true);

  // And it says no exactly where the Runtime does, with the same words.
  const card = preview(view, { kind: 'noop', actor: 'realm-a' });
  const events = runtime.submit({ kind: 'noop', actor: 'realm-a' });
  assert.equal(card.admissible, false);
  assert.equal(events[0].type, 'intent-rejected');
  assert.equal(card.reason, events[0].detail.reason);
});
