/**
 * The commit-and-reveal turn loop — ticket 03's spine.
 *
 * The sealed shape being checked: both realms allocate a whole turn's orders in
 * secret from one non-hoardable 행동력 chip stack (ledger D6.3), lock, then reveal
 * and resolve **together** with no first-mover asymmetry (D6.1, D6.1a), and the
 * folded result opens turn N+1 with no separate upkeep screen (D6.2).
 *
 * Resolution itself is deliberately a **reading, not an outcome** in this ticket:
 * combat arrives with ticket 06. What is real here is the loop, the blind commit,
 * the symmetric reveal, and the budget.
 *
 * Run against the emitted artifact, never the source (gate 05 D6).
 */

import test from 'node:test';
import assert from 'node:assert/strict';

const { commitmentShare, CRADLE_R1, Runtime, preview, TURN_COMMITMENT_BUDGET } = await import(
  '../dist/runtime/index.js'
);

const FIXTURE = { world: CRADLE_R1, seed: 'turn-0001', actors: ['realm-a', 'realm-b'] };

/** Opens a match and plays the capital beat, so the turn loop is the subject. */
function openAtDecision(overrides = {}) {
  const runtime = Runtime.open({ ...FIXTURE, ...overrides });
  const setup = runtime.view('observer');
  for (const actor of setup.actors) {
    const sector = setup.realms.find((r) => r.actor === actor).sectors[0];
    runtime.submit({ kind: 'choose-capital', actor, sector });
  }
  return runtime;
}

const frontsOf = (runtime, actor) => runtime.view(actor).fronts.map((f) => f.key);
const allocate = (runtime, actor, front, chips) =>
  runtime.submit({ kind: 'allocate-commitment', actor, front, chips });
const lock = (runtime, actor) => runtime.submit({ kind: 'lock-commitment', actor });
const types = (events) => events.map((e) => e.type);

test('the capital beat hands over to the decision tier', () => {
  const runtime = openAtDecision();
  const view = runtime.view('realm-a');

  assert.equal(view.phase, 'decision');
  assert.equal(view.turn, 1);
  assert.deepEqual(view.committed, [], 'a fresh turn starts with nobody locked');
  assert.equal(view.commitment.budget, TURN_COMMITMENT_BUDGET);
  assert.equal(view.commitment.remaining, TURN_COMMITMENT_BUDGET);
});

test('`currentActor` reads as the current phase, not as whose move it is (R8)', () => {
  const runtime = Runtime.open(FIXTURE);
  assert.equal(runtime.currentActor, 'capital-selection');
  assert.equal(runtime.view('realm-a').currentActor, runtime.view('realm-a').phase);

  const decided = openAtDecision();
  assert.equal(decided.currentActor, 'decision');
  // And it never names an actor, which is the whole point of the re-expression.
  assert.equal(FIXTURE.actors.includes(decided.currentActor), false);
});

test('the fronts a realm may commit to are its contested borders', () => {
  const runtime = openAtDecision();
  const view = runtime.view('realm-a');
  const own = new Set(view.realms.find((r) => r.actor === 'realm-a').sectors);
  const theirs = new Set(view.realms.find((r) => r.actor === 'realm-b').sectors);

  assert.ok(view.fronts.length > 0, 'a partitioned board with no contested front is not a duel');
  for (const front of view.fronts) {
    const [x, y] = front.sectors;
    assert.ok(
      (own.has(x) && theirs.has(y)) || (theirs.has(x) && own.has(y)),
      `${front.key} is not a border between the two realms`,
    );
    // Canonical, sorted, actor-independent — the edge naming gate 06 D4 sealed.
    assert.deepEqual([...front.sectors].sort(), [...front.sectors]);
  }

  // Both realms see the same fronts: a border is a border from either side.
  assert.deepEqual(frontsOf(runtime, 'realm-a'), frontsOf(runtime, 'realm-b'));
});

test('one stack, one sum: allocations cannot exceed the turn budget', () => {
  const runtime = openAtDecision();
  const fronts = frontsOf(runtime, 'realm-a');

  assert.equal(types(allocate(runtime, 'realm-a', fronts[0], TURN_COMMITMENT_BUDGET))[0], 'commitment-allocated');
  assert.equal(runtime.view('realm-a').commitment.remaining, 0);

  // A second front cannot be funded from a pool that is already spent — there is
  // no per-order budget anywhere, which is what makes exposure real (D6.3).
  const over = allocate(runtime, 'realm-a', fronts[1], 1);
  assert.equal(over[0].type, 'intent-rejected');
  assert.match(over[0].detail.reason, /행동력/);
  assert.equal(runtime.view('realm-a').commitment.spent, TURN_COMMITMENT_BUDGET);
});

test('an allocation replaces its front rather than accumulating', () => {
  const runtime = openAtDecision();
  const [front] = frontsOf(runtime, 'realm-a');

  allocate(runtime, 'realm-a', front, 12);
  allocate(runtime, 'realm-a', front, 5);
  assert.equal(runtime.view('realm-a').commitment.spent, 5, 'the second allocation stacked instead of replacing');

  allocate(runtime, 'realm-a', front, 0);
  assert.deepEqual(runtime.view('realm-a').commitment.allocations, {}, 'zero did not clear the front');
});

test('a malformed or foreign allocation is refused without a transition', () => {
  const runtime = openAtDecision();
  const [front] = frontsOf(runtime, 'realm-a');
  const before = runtime.view('observer');

  for (const intent of [
    { kind: 'allocate-commitment', actor: 'realm-a', front, chips: -1 },
    { kind: 'allocate-commitment', actor: 'realm-a', front, chips: 1.5 },
    { kind: 'allocate-commitment', actor: 'realm-a', front, chips: 'lots' },
    { kind: 'allocate-commitment', actor: 'realm-a', front },
    { kind: 'allocate-commitment', actor: 'realm-a', front: 'r1_s0|r1_s1', chips: 3 },
    { kind: 'allocate-commitment', actor: 'realm-a', front: 'nonsense', chips: 3 },
  ]) {
    const events = runtime.submit(intent);
    assert.equal(events[0].type, 'intent-rejected', `accepted ${JSON.stringify(intent)}`);
  }
  assert.deepEqual(runtime.view('observer'), before, 'a refused allocation moved the match');
});

test('commitments are secret until both realms have locked', () => {
  const runtime = openAtDecision();
  const [front] = frontsOf(runtime, 'realm-a');
  allocate(runtime, 'realm-a', front, 7);

  assert.deepEqual(runtime.view('realm-a').commitment.allocations, { [front]: 7 });
  assert.deepEqual(runtime.view('realm-b').commitment.allocations, {}, 'the opponent read an unrevealed allocation');
  assert.deepEqual(
    runtime.view('observer').commitment.allocations,
    {},
    'the observer is a side door around the blind commit',
  );
  assert.equal(runtime.view('realm-b').commitment.spent, 0, 'the opponent’s spend leaked into the viewer’s own totals');
});

test('the fact of a lock crosses; its content does not (R7)', () => {
  const runtime = openAtDecision();
  const [front] = frontsOf(runtime, 'realm-a');
  allocate(runtime, 'realm-a', front, 9);

  const locked = lock(runtime, 'realm-a');
  assert.equal(types(locked)[0], 'commitment-locked');

  for (const viewer of ['realm-a', 'realm-b', 'observer']) {
    assert.deepEqual(runtime.view(viewer).committed, ['realm-a'], `the lock was hidden from ${viewer}`);
  }
  assert.deepEqual(runtime.view('realm-b').commitment.allocations, {}, 'locking revealed the allocation early');
  assert.equal(runtime.view('realm-b').phase, 'decision', 'one lock ended the turn');
});

test('both realms are legal callers at the same moment (R8)', () => {
  // Whichever realm allocates or locks first, the other is still admissible:
  // legality is "has this realm locked this turn", never "is it your turn".
  for (const first of ['realm-a', 'realm-b']) {
    const runtime = openAtDecision();
    const second = first === 'realm-a' ? 'realm-b' : 'realm-a';
    const [frontFirst] = frontsOf(runtime, first);
    const [frontSecond] = frontsOf(runtime, second);

    assert.equal(types(allocate(runtime, first, frontFirst, 4))[0], 'commitment-allocated');
    assert.equal(types(allocate(runtime, second, frontSecond, 4))[0], 'commitment-allocated');
    assert.equal(types(lock(runtime, first))[0], 'commitment-locked');
  }
});

test('a locked realm cannot allocate or lock again this turn (R8)', () => {
  const runtime = openAtDecision();
  const [front] = frontsOf(runtime, 'realm-a');
  lock(runtime, 'realm-a');

  const late = allocate(runtime, 'realm-a', front, 3);
  assert.equal(late[0].type, 'intent-rejected');
  assert.match(late[0].detail.reason, /already locked this turn/);

  const twice = lock(runtime, 'realm-a');
  assert.equal(twice[0].type, 'intent-rejected');
  assert.match(twice[0].detail.reason, /already locked this turn/);
});

test('commitments cannot be made outside the decision tier', () => {
  const runtime = Runtime.open(FIXTURE); // still in the capital beat
  const events = runtime.submit({ kind: 'allocate-commitment', actor: 'realm-a', front: 'x|y', chips: 1 });
  assert.equal(events[0].type, 'intent-rejected');
  assert.match(events[0].detail.reason, /commit window/);
});

test('both locks close the turn in one submit: reveal, resolve, then turn N+1', () => {
  const runtime = openAtDecision();
  const [front] = frontsOf(runtime, 'realm-a');
  allocate(runtime, 'realm-a', front, 8);
  allocate(runtime, 'realm-b', front, 4);

  lock(runtime, 'realm-a');
  const closing = lock(runtime, 'realm-b');

  // No third submission exists between the last lock and the next turn: the
  // background tier folds into the payoff's tail (D6.2) — no upkeep screen, no
  // extra click.
  assert.deepEqual(types(closing), [
    'commitment-locked',
    'commitments-revealed',
    'front-resolved',
    // Ticket 05's realm economy folded into this same tail — one per realm.
    'realm-recomputed',
    'realm-recomputed',
    'turn-opened',
  ]);

  const revealed = closing.find((e) => e.type === 'commitments-revealed');
  assert.deepEqual(revealed.detail.commitments, {
    'realm-a': { [front]: 8 },
    'realm-b': { [front]: 4 },
  });

  const opened = closing.find((e) => e.type === 'turn-opened');
  assert.equal(opened.turn, 2);
  assert.equal(runtime.view('realm-a').turn, 2);
  assert.equal(runtime.view('realm-a').phase, 'decision');
  assert.deepEqual(runtime.view('realm-a').committed, []);
});

test('every event names the tier it belongs to, and there is no phase ③', () => {
  const runtime = openAtDecision();
  const [front] = frontsOf(runtime, 'realm-a');
  allocate(runtime, 'realm-a', front, 2);
  lock(runtime, 'realm-a');
  const closing = lock(runtime, 'realm-b');

  const tiers = closing.map((e) => e.detail.tier);
  assert.deepEqual(tiers, [
    'decision',
    'payoff',
    'payoff',
    // The recompute and the renewal are one background tier, not two stages.
    'background',
    'background',
    'background',
  ]);
  for (const tier of tiers) {
    assert.ok(['decision', 'payoff', 'background'].includes(tier), `unknown tier ${tier}`);
  }
});

test('the payoff is structurally non-demotable: no turn advances without a reveal', () => {
  const runtime = openAtDecision();
  let revealed = 0;
  let opened = 0;

  for (let turn = 1; turn <= 6; turn++) {
    const fronts = frontsOf(runtime, 'realm-a');
    allocate(runtime, 'realm-a', fronts[turn % fronts.length], 3);
    const events = [...lock(runtime, 'realm-a'), ...lock(runtime, 'realm-b')];
    revealed += events.filter((e) => e.type === 'commitments-revealed').length;
    opened += events.filter((e) => e.type === 'turn-opened').length;
    // The reveal always precedes the advance within the same submission.
    assert.ok(
      events.findIndex((e) => e.type === 'commitments-revealed') <
        events.findIndex((e) => e.type === 'turn-opened'),
    );
  }

  assert.equal(revealed, 6);
  assert.equal(opened, 6, 'a turn advanced without its payoff');
  assert.equal(runtime.view('observer').turn, 7);
});

test('unspent budget is discarded at renewal — the stack never hoards', () => {
  const runtime = openAtDecision();
  const [front] = frontsOf(runtime, 'realm-a');

  allocate(runtime, 'realm-a', front, 1);
  lock(runtime, 'realm-a');
  lock(runtime, 'realm-b'); // realm-b spent nothing at all

  for (const actor of ['realm-a', 'realm-b']) {
    const view = runtime.view(actor);
    assert.equal(view.commitment.budget, TURN_COMMITMENT_BUDGET, 'the budget grew or shrank between turns');
    assert.equal(view.commitment.remaining, TURN_COMMITMENT_BUDGET);
    assert.deepEqual(view.commitment.allocations, {}, 'last turn’s allocation survived the renewal');
  }
});

test('spreading the stack thins each front’s relative share (D6.3)', () => {
  const fronts = frontsOf(openAtDecision(), 'realm-a');
  assert.ok(fronts.length >= 2, 'this fixture cannot express spreading');
  const [x, y] = fronts;

  const readingAt = (allocations, front) => {
    const runtime = openAtDecision();
    for (const [actor, byFront] of Object.entries(allocations)) {
      for (const [key, chips] of Object.entries(byFront)) allocate(runtime, actor, key, chips);
    }
    lock(runtime, 'realm-a');
    const closing = lock(runtime, 'realm-b');
    return closing.find((e) => e.type === 'front-resolved' && e.detail.front === front).detail;
  };

  // realm-b concentrates 20 on front x in both runs. realm-a concentrates, then
  // spreads the same stack across two fronts.
  const concentrated = readingAt({ 'realm-a': { [x]: 20 }, 'realm-b': { [x]: 20 } }, x);
  const spread = readingAt({ 'realm-a': { [x]: 10, [y]: 10 }, 'realm-b': { [x]: 20 } }, x);

  // The event carries integers; the share is the reading a display makes of them.
  assert.deepEqual(concentrated.commitments, { 'realm-a': 20, 'realm-b': 20 });
  assert.equal(concentrated.total, 40);
  assert.equal(commitmentShare(concentrated.commitments, 'realm-a'), 0.5);

  assert.deepEqual(spread.commitments, { 'realm-a': 10, 'realm-b': 20 });
  assert.ok(
    commitmentShare(spread.commitments, 'realm-a') < commitmentShare(concentrated.commitments, 'realm-a'),
    'spreading did not thin the front',
  );
  // Same stack, same front, weaker position — and the opponent gained without
  // spending more, which is the whole of "commitment is a ratio" (D6.3).
  assert.equal(commitmentShare(spread.commitments, 'realm-b') > 0.5, true);

  // The other front is where realm-a's other ten chips went, and realm-b is absent
  // there — spreading buys presence somewhere at the price of thinness here.
  const other = readingAt({ 'realm-a': { [x]: 10, [y]: 10 }, 'realm-b': { [x]: 20 } }, y);
  assert.deepEqual(other.commitments, { 'realm-a': 10, 'realm-b': 0 });
});

test('an uncontested front produces no engagement at all', () => {
  const runtime = openAtDecision();
  const [front] = frontsOf(runtime, 'realm-a');
  allocate(runtime, 'realm-a', front, 6);
  lock(runtime, 'realm-a');
  const closing = lock(runtime, 'realm-b');

  const resolved = closing.filter((e) => e.type === 'front-resolved');
  assert.equal(resolved.length, 1, 'fronts nobody committed to were resolved anyway');
  assert.equal(resolved[0].detail.front, front);
  assert.deepEqual(resolved[0].detail.commitments, { 'realm-a': 6, 'realm-b': 0 });
  assert.equal(resolved[0].detail.outcome, 'pending-operations', 'a stub outcome is claiming to be a result');
});

test('resolution does not depend on which realm locked first (D6.1a)', () => {
  const plan = (runtime) => {
    const fronts = frontsOf(runtime, 'realm-a');
    allocate(runtime, 'realm-a', fronts[0], 11);
    allocate(runtime, 'realm-b', fronts[0], 6);
    allocate(runtime, 'realm-b', fronts[1], 5);
  };

  const first = openAtDecision();
  plan(first);
  lock(first, 'realm-a');
  const closedByB = lock(first, 'realm-b');

  const second = openAtDecision();
  plan(second);
  lock(second, 'realm-b');
  const closedByA = lock(second, 'realm-a');

  const resolutions = (events) => events.filter((e) => e.type !== 'commitment-locked');
  assert.deepEqual(resolutions(closedByB), resolutions(closedByA), 'the second mover changed the outcome');
  assert.deepEqual(first.view('observer'), second.view('observer'));
});

test('resolution is symmetric under relabelling the realms (D6.1a)', () => {
  // The sharpest form of "no first-mover asymmetry": run one fixed plan, then
  // run it again with the two actor ids swapped, and require the second result
  // to equal the first under that relabelling. Any hidden dependence on which
  // actor is seated first shows up here and nowhere else.
  // Walked structurally rather than through JSON: the world artifact carries
  // `choke.cap === Infinity` on five open borders, and a JSON round-trip turns that
  // into `null` — the exact inversion gate 06 D2 exists to prevent. Object *keys*
  // are swapped too, because a commitment map is keyed by actor.
  const swap = (s) => (s === 'realm-a' ? 'realm-b' : s === 'realm-b' ? 'realm-a' : s);
  const relabel = (value) => {
    if (typeof value === 'string') return swap(value);
    if (Array.isArray(value)) return value.map(relabel);
    if (value && typeof value === 'object') {
      return Object.fromEntries(Object.entries(value).map(([k, v]) => [swap(k), relabel(v)]));
    }
    return value;
  };

  const run = (actors) => {
    const runtime = openAtDecision({ actors });
    const [x, y] = frontsOf(runtime, actors[0]);
    allocate(runtime, actors[0], x, 13);
    allocate(runtime, actors[1], x, 7);
    allocate(runtime, actors[1], y, 4);
    const events = [...lock(runtime, actors[0]), ...lock(runtime, actors[1])];
    return { events, view: runtime.view('observer') };
  };

  const straight = run(['realm-a', 'realm-b']);
  const swapped = run(['realm-b', 'realm-a']);

  assert.deepEqual(relabel(swapped.view), straight.view, 'the board differs under relabelling');
  assert.deepEqual(relabel(swapped.events), straight.events, 'the events differ under relabelling');
});

test('fronts resolve in a canonical order that no actor decides', () => {
  const runtime = openAtDecision();
  const fronts = frontsOf(runtime, 'realm-a');
  // Allocate in reverse order, from alternating sides.
  for (const [i, front] of [...fronts].reverse().entries()) {
    allocate(runtime, i % 2 === 0 ? 'realm-b' : 'realm-a', front, 2);
  }
  lock(runtime, 'realm-b');
  const closing = lock(runtime, 'realm-a');

  const order = closing.filter((e) => e.type === 'front-resolved').map((e) => e.detail.front);
  assert.deepEqual(order, [...order].sort(), 'resolution order followed submission order');
});

test('no standalone move command exists — position is an operation’s product', () => {
  const runtime = openAtDecision();
  const before = runtime.view('observer').realms.map((r) => [...r.sectors]);

  for (const kind of ['move', 'move-army', 'march', 'reposition']) {
    const events = runtime.submit({ kind, actor: 'realm-a', from: 'r1_s0', to: 'r2_s3' });
    assert.equal(events[0].type, 'intent-rejected', `"${kind}" was wired as a movement command`);
  }

  // And a stubbed resolution moves nothing: ownership changes arrive with the
  // operations that cause them (ticket 06 combat, ticket 07 capital fall).
  const [front] = frontsOf(runtime, 'realm-a');
  allocate(runtime, 'realm-a', front, 20);
  lock(runtime, 'realm-a');
  lock(runtime, 'realm-b');
  assert.deepEqual(runtime.view('observer').realms.map((r) => [...r.sectors]), before);
});

test('submit returns immediately and never sleeps', () => {
  const runtime = openAtDecision();
  const [front] = frontsOf(runtime, 'realm-a');
  const returned = allocate(runtime, 'realm-a', front, 3);
  assert.ok(Array.isArray(returned), 'submit returned something other than an event array');
  assert.equal(typeof returned.then, 'undefined', 'submit returned a promise; pacing belongs to the UI');

  const closing = [...lock(runtime, 'realm-a'), ...lock(runtime, 'realm-b')];
  assert.ok(closing.every((e) => typeof e.turn === 'number'));
});

test('preview and the Runtime agree on every commitment case', () => {
  const runtime = openAtDecision();
  const [front, other] = frontsOf(runtime, 'realm-a');

  const cases = [
    { kind: 'allocate-commitment', actor: 'realm-a', front, chips: 5 },
    { kind: 'allocate-commitment', actor: 'realm-a', front, chips: TURN_COMMITMENT_BUDGET + 1 },
    { kind: 'allocate-commitment', actor: 'realm-a', front, chips: -2 },
    { kind: 'allocate-commitment', actor: 'realm-a', front: 'not-a-front', chips: 1 },
    { kind: 'allocate-commitment', actor: 'stranger', front, chips: 1 },
    { kind: 'lock-commitment', actor: 'realm-a' },
  ];

  for (const intent of cases) {
    const view = runtime.view('realm-a');
    const card = preview(view, intent);
    const events = runtime.submit(intent);
    const accepted = events[0].type !== 'intent-rejected';
    assert.equal(card.admissible, accepted, `preview disagreed on ${JSON.stringify(intent)}`);
    if (!accepted) {
      assert.equal(card.reason, events[0].detail.reason, `different words for ${JSON.stringify(intent)}`);
    }
  }

  // Once locked, the previously-admissible allocation must read as refused too.
  const locked = runtime.view('realm-a');
  assert.equal(preview(locked, { kind: 'allocate-commitment', actor: 'realm-a', front: other, chips: 1 }).admissible, false);
});

test('preview never sees more than the projection it was handed', () => {
  const runtime = openAtDecision();
  const [front] = frontsOf(runtime, 'realm-a');
  allocate(runtime, 'realm-a', front, 9);

  // realm-b's own budget looks untouched from realm-b's view, so preview cannot
  // learn realm-a's spend by asking about it.
  const asB = runtime.view('realm-b');
  assert.equal(asB.commitment.remaining, TURN_COMMITMENT_BUDGET);
  assert.equal(preview(asB, { kind: 'allocate-commitment', actor: 'realm-b', front, chips: 20 }).admissible, true);
});

test('(worldId, revision, seed, ordered intent log) replays the same match', () => {
  const log = [];
  const source = openAtDecision({ seed: 'replay-0001' });
  const setup = source.view('observer');
  for (const actor of setup.actors) {
    log.push({ kind: 'choose-capital', actor, sector: setup.realms.find((r) => r.actor === actor).sectors[0] });
  }

  const fronts = frontsOf(source, 'realm-a');
  for (let turn = 0; turn < 4; turn++) {
    log.push({ kind: 'allocate-commitment', actor: 'realm-a', front: fronts[turn % fronts.length], chips: 3 + turn });
    log.push({ kind: 'allocate-commitment', actor: 'realm-b', front: fronts[(turn + 1) % fronts.length], chips: 2 });
    log.push({ kind: 'lock-commitment', actor: 'realm-b' });
    log.push({ kind: 'lock-commitment', actor: 'realm-a' });
  }

  const replay = () => {
    const runtime = Runtime.open({ world: CRADLE_R1, seed: 'replay-0001', actors: ['realm-a', 'realm-b'] });
    const events = log.flatMap((intent) => runtime.submit(intent));
    return { events, view: runtime.view('observer') };
  };

  const first = replay();
  const second = replay();
  assert.deepEqual(first, second);
  assert.equal(first.view.turn, 5);
  assert.equal(
    first.events.filter((e) => e.type === 'intent-rejected').length,
    0,
    first.events.find((e) => e.type === 'intent-rejected')?.detail.reason ?? '',
  );
});

test('the loop runs on whatever board the seed drew', () => {
  // Only 15 balanced partitions exist, so two seeds may legitimately draw the
  // same board. What must hold for every draw is that the front set is non-empty
  // and the loop closes on it — and that the fronts do vary across seeds.
  const seen = new Set();
  for (let i = 0; i < 12; i++) {
    const runtime = openAtDecision({ seed: `turn-sweep-${i}` });
    const fronts = frontsOf(runtime, 'realm-a');
    assert.ok(fronts.length > 0, `seed turn-sweep-${i} drew a board with no contested front`);
    seen.add(fronts.join(','));

    allocate(runtime, 'realm-a', fronts[0], 4);
    lock(runtime, 'realm-a');
    assert.equal(types(lock(runtime, 'realm-b')).at(-1), 'turn-opened');
  }
  assert.ok(seen.size > 1, 'twelve seeds all drew the same front set');
});
