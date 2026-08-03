/**
 * The determinism contract: randomness comes from the injected seed and from
 * nothing else.
 *
 * ADR 0040 bars rules from ambient entropy, and ADR 0049 § Decision 8 is why it
 * matters: replay is defined from the seed, so a rule reading the clock is
 * unreplayable. What is *not*
 * barred — and what the seed exists for — is a seeded draw: a different seed
 * per match gives different play, the same seed replays identically
 * (DECISIONS-OWED R4). These tests pin that distinction.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

const { createRng } = await import('../dist/runtime/index.js');

const take = (rng, n) => Array.from({ length: n }, () => rng.next());

test('the same seed replays identically', () => {
  assert.deepEqual(take(createRng('seed-a'), 32), take(createRng('seed-a'), 32));
});

test('a different seed plays differently', () => {
  assert.notDeepEqual(take(createRng('seed-a'), 32), take(createRng('seed-b'), 32));
});

test('draws stay in [0, 1)', () => {
  const values = take(createRng('range-check'), 5000);
  assert.equal(
    values.every((v) => v >= 0 && v < 1),
    true,
  );
});

test('nextInt stays in range and refuses a nonsense bound', () => {
  const rng = createRng('int-check');
  const values = Array.from({ length: 2000 }, () => rng.nextInt(7));
  assert.equal(
    values.every((v) => Number.isInteger(v) && v >= 0 && v < 7),
    true,
  );
  assert.equal(new Set(values).size, 7, 'The whole range should be reachable.');

  for (const bad of [0, -1, 1.5, NaN, '3']) {
    assert.throws(() => rng.nextInt(bad), RangeError, `Accepted bound ${String(bad)}`);
  }
});

test('a forked stream is deterministic, and independent of sibling draws', () => {
  // This is why fork exists: a consumer's results must not shift because some
  // *other* consumer started drawing. Without it, every added feature would
  // silently re-roll every existing one, and replays would rot as the build grows.
  const parent = createRng('fork-root');
  const before = take(parent.fork('partition'), 8);

  const busy = createRng('fork-root');
  take(busy, 100); // an unrelated consumer draws heavily
  const after = take(busy.fork('partition'), 8);

  assert.deepEqual(after, before);
  assert.notDeepEqual(take(parent.fork('capital'), 8), before);
});

test('no ambient entropy is reachable — the stream is a pure function of its seed', () => {
  const first = take(createRng('purity'), 16);
  const second = take(createRng('purity'), 16);
  assert.deepEqual(first, second);
});
