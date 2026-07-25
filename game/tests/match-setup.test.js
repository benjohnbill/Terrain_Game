/**
 * Match setup and the capital-selection beat.
 *
 * The sealed shape being checked: a duel seats two actors on a randomly drawn
 * balanced partition, both players choose a capital **simultaneously and in
 * secret** on any sector they own (CP-② D1.3, ruling R3), and both sites become
 * public **together** (CP-② item 1).
 */

import test from 'node:test';
import assert from 'node:assert/strict';

const { CRADLE_R1, Runtime, preview } = await import('../dist/runtime/index.js');

const FIXTURE = { world: CRADLE_R1, seed: 'setup-0001', actors: ['realm-a', 'realm-b'] };
const open = (overrides = {}) => Runtime.open({ ...FIXTURE, ...overrides });

const caught = (fn) => {
  try {
    fn();
  } catch (error) {
    return error;
  }
  assert.fail('expected a throw');
};

test('a match opens onto a two-realm board at the capital prompt', () => {
  const runtime = open();
  const view = runtime.view('realm-a');

  assert.equal(view.phase, 'capital-selection');
  assert.equal(view.realms.length, 2);
  assert.equal(view.realms[0].sectors.length + view.realms[1].sectors.length, 56);
  assert.ok(Math.abs(view.realms[0].population - view.realms[1].population) < 1e-9);
  assert.deepEqual(view.committed, []);
});

test('a duel seats exactly two actors', () => {
  assert.match(caught(() => open({ actors: ['solo'] })).message, /exactly two actors/);
  assert.match(caught(() => open({ actors: ['a', 'b', 'c'] })).message, /exactly two actors/);
  assert.match(caught(() => open({ actors: ['a', 'a'] })).message, /unique/);
});

test('opening rejects a bad seed rather than substituting one', () => {
  assert.match(caught(() => open({ seed: '' })).message, /seed/);
  assert.match(caught(() => open({ seed: undefined })).message, /seed/);
});

test('a bad world yields no match at all', () => {
  const broken = structuredClone(CRADLE_R1);
  broken.sectors.r1_s0.populationValue = 99; // breaks the integrity stamp
  const error = caught(() => open({ world: broken }));
  assert.equal(error.name, 'WorldLoadError');
});

test('any owned sector is a legal capital — ownership, not an authored marker', () => {
  const runtime = open();
  const view = runtime.view('realm-a');
  const mine = view.realms.find((r) => r.actor === 'realm-a').sectors;

  // R3 in one assertion: every sector the realm owns is admissible, including
  // the many that carry no authored city or capital marker.
  for (const sector of mine) {
    assert.equal(
      preview(view, { kind: 'choose-capital', actor: 'realm-a', sector }).admissible,
      true,
      `${sector} should be a legal capital site`,
    );
  }

  const markers = new Set([
    ...Object.values(CRADLE_R1.meta.capitals),
    ...Object.values(CRADLE_R1.meta.cities),
  ]);
  assert.ok(
    mine.some((s) => !markers.has(s)),
    'the realm holds no unmarked sector, so this test would not prove anything',
  );
});

test('a sector the realm does not own is refused', () => {
  const runtime = open();
  const theirs = runtime.view('realm-a').realms.find((r) => r.actor === 'realm-b').sectors[0];

  const events = runtime.submit({ kind: 'choose-capital', actor: 'realm-a', sector: theirs });
  assert.equal(events[0].type, 'intent-rejected');
  assert.match(events[0].detail.reason, /is not a sector "realm-a" owns/);
  assert.deepEqual(runtime.view('observer').committed, [], 'a refused choice locked something');
});

test('the choice is secret until both sides have locked', () => {
  const runtime = open();
  const mine = runtime.view('realm-a').realms.find((r) => r.actor === 'realm-a').sectors[0];

  runtime.submit({ kind: 'choose-capital', actor: 'realm-a', sector: mine });

  // The *fact* of commitment is public (ruling R7): watching the opponent
  // deliberate is part of the contest, and both sides committing is what
  // advances the beat.
  assert.deepEqual(runtime.view('realm-b').committed, ['realm-a']);
  assert.deepEqual(runtime.view('observer').committed, ['realm-a']);
  // The *site* is not. That asymmetry is the whole mechanism.
  assert.deepEqual(runtime.view('realm-b').capitals, {}, 'the opponent could read an unrevealed capital');
  assert.deepEqual(runtime.view('realm-a').capitals, { 'realm-a': mine }, 'a player cannot see their own choice');
  // The observer is not a side door around the secrecy.
  assert.deepEqual(runtime.view('observer').capitals, {});
  assert.equal(runtime.view('observer').phase, 'capital-selection');
});

test('both sites are revealed together, and stay public', () => {
  const runtime = open();
  const view = runtime.view('observer');
  const a = view.realms.find((r) => r.actor === 'realm-a').sectors[0];
  const b = view.realms.find((r) => r.actor === 'realm-b').sectors[0];

  runtime.submit({ kind: 'choose-capital', actor: 'realm-a', sector: a });
  const events = runtime.submit({ kind: 'choose-capital', actor: 'realm-b', sector: b });

  assert.deepEqual(
    events.map((e) => e.type),
    ['capital-locked', 'capitals-revealed'],
  );

  for (const viewer of ['realm-a', 'realm-b', 'observer']) {
    assert.deepEqual(runtime.view(viewer).capitals, { 'realm-a': a, 'realm-b': b }, `hidden from ${viewer}`);
  }
  // 'in-play' became 'decision' with ticket 03: the turn loop's sole agency tier
  // is what the capital beat hands over to (ledger D6.2).
  assert.equal(runtime.view('realm-a').phase, 'decision');
});

test('both actors are legal callers at the same moment — the beat is simultaneous', () => {
  // The legality rule this phase needs is "has this realm locked yet", not
  // "is it this realm's turn". Whichever actor moves first, the other is still
  // admissible.
  for (const first of ['realm-a', 'realm-b']) {
    const runtime = open();
    const second = first === 'realm-a' ? 'realm-b' : 'realm-a';
    const view = runtime.view('observer');
    const sectorOf = (a) => view.realms.find((r) => r.actor === a).sectors[0];

    assert.equal(runtime.submit({ kind: 'choose-capital', actor: first, sector: sectorOf(first) })[0].type, 'capital-locked');
    assert.equal(runtime.submit({ kind: 'choose-capital', actor: second, sector: sectorOf(second) })[0].type, 'capital-locked');
  }
});

test('a capital is chosen once, and not re-chosen', () => {
  const runtime = open();
  const mine = runtime.view('realm-a').realms.find((r) => r.actor === 'realm-a').sectors;

  runtime.submit({ kind: 'choose-capital', actor: 'realm-a', sector: mine[0] });
  const again = runtime.submit({ kind: 'choose-capital', actor: 'realm-a', sector: mine[1] });

  assert.equal(again[0].type, 'intent-rejected');
  assert.match(again[0].detail.reason, /already locked/);
  assert.deepEqual(runtime.view('realm-a').capitals, { 'realm-a': mine[0] }, 'the second choice overwrote the first');
});

test('capitals cannot be chosen after the phase closes', () => {
  const runtime = open();
  const view = runtime.view('observer');
  const sectorOf = (a) => view.realms.find((r) => r.actor === a).sectors;

  runtime.submit({ kind: 'choose-capital', actor: 'realm-a', sector: sectorOf('realm-a')[0] });
  runtime.submit({ kind: 'choose-capital', actor: 'realm-b', sector: sectorOf('realm-b')[0] });

  const late = runtime.submit({ kind: 'choose-capital', actor: 'realm-a', sector: sectorOf('realm-a')[1] });
  assert.equal(late[0].type, 'intent-rejected');
  assert.match(late[0].detail.reason, /once, at match start/);
});

test('preview and the Runtime agree on every capital case', () => {
  const runtime = open();
  const view = runtime.view('realm-a');
  const mine = view.realms.find((r) => r.actor === 'realm-a').sectors[0];
  const theirs = view.realms.find((r) => r.actor === 'realm-b').sectors[0];

  for (const intent of [
    { kind: 'choose-capital', actor: 'realm-a', sector: theirs },
    { kind: 'choose-capital', actor: 'realm-a' },
    { kind: 'choose-capital', actor: 'stranger', sector: mine },
  ]) {
    const card = preview(view, intent);
    const events = runtime.submit(intent);
    assert.equal(card.admissible, false, `preview allowed ${JSON.stringify(intent)}`);
    assert.equal(events[0].type, 'intent-rejected');
    assert.equal(card.reason, events[0].detail.reason, 'preview and Runtime gave different reasons');
  }
});

test('the same seed reproduces the same match', () => {
  const a = open({ seed: 'repro' }).view('observer');
  const b = open({ seed: 'repro' }).view('observer');
  assert.deepEqual(
    a.realms.map((r) => r.sectors),
    b.realms.map((r) => r.sectors),
  );
});
