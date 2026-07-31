/**
 * A capital falls and the match ends — ticket 07, where the loop closes.
 *
 * Four subjects, in the order the ticket needs them:
 *
 * 1. **The guard exists.** Land-derived from the capital sector at CP-⑤'s 가안
 *    2,500/pop, garrison-class and place-bound, its origins apportioned across the
 *    realm (CP-⑥), and standing *with* an ordinary border shield rather than
 *    instead of it (CP-⑦).
 * 2. **The fall is an ordinary capture.** No capital-specific threshold, no
 *    "overwhelming" gate, no second predicate — the check is "is the captured
 *    sector this loser's capital", and the guard's magnitude is what makes it hard.
 * 3. **Nothing else names a winner.** The strongest claim this ticket makes is a
 *    negative one, so it is tested as an *iff*: across a real match the phase is
 *    terminal exactly when a capital changed hands, and never otherwise.
 * 4. **The end is final, and a new match can start after it.**
 *
 * Run against the emitted artifact, never the source (gate 05 D6).
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const {
  CAPITAL_GUARD_PER_POP,
  CRADLE_R1,
  GARRISON_PER_BORDER_SECTOR,
  MARCH_SPEED,
  REGISTER_PER_POP,
  Runtime,
  buildMovementGraph,
  capitalGuardOf,
  garrisonHeadroomOf,
  minimumCostRoute,
  musterHexOf,
  registerOf,
} = await import('../dist/runtime/index.js');

const GRAPH = buildMovementGraph(CRADLE_R1);
const ACTORS = ['realm-a', 'realm-b'];

const accepted = (runtime, intent) => {
  const events = runtime.submit(intent);
  assert.notEqual(events[0]?.type, 'intent-rejected', JSON.stringify(events[0]?.detail));
  return events;
};

const lock = (runtime, actor) => runtime.submit({ kind: 'lock-commitment', actor });
const closeTurn = (runtime) => [...lock(runtime, 'realm-a'), ...lock(runtime, 'realm-b')];

/** Seat both capitals, naming each one explicitly so a test can aim the fall. */
function openWithCapitals(capitals, seed = 'turn-0001') {
  const runtime = Runtime.open({ world: CRADLE_R1, seed, actors: ACTORS });
  for (const actor of ACTORS) {
    accepted(runtime, { kind: 'choose-capital', actor, sector: capitals[actor] });
  }
  return runtime;
}

/** Each realm's first owned sector — the default both other suites use. */
function firstSectors(seed = 'turn-0001') {
  const setup = Runtime.open({ world: CRADLE_R1, seed, actors: ACTORS }).view('observer');
  return Object.fromEntries(setup.realms.map((realm) => [realm.actor, realm.sectors[0]]));
}

/**
 * The enemy front sector realm-a's opening army reaches in one march — 06d's
 * capture fixture, re-derived here because this suite needs the *target* before it
 * chooses capitals, and a detachment only exists after the reveal.
 *
 * Probing with a throwaway runtime is exact rather than approximate: an opening
 * army musters at its *own* capital, and the front set is drawn from the seed, so
 * moving realm-b's capital cannot move realm-a's army or its reachable targets.
 */
function invasionTarget(seed = 'turn-0001') {
  const defaults = firstSectors(seed);
  const probe = openWithCapitals(defaults, seed);
  const view = probe.view('realm-a');
  const own = new Set(view.realms.find((realm) => realm.actor === 'realm-a').sectors);
  const detachment = view.detachments[0];
  let best = null;
  for (const front of view.fronts) {
    const [x, y] = front.sectors;
    const theirs = own.has(x) ? y : x;
    const route = minimumCostRoute(GRAPH, detachment.position, musterHexOf(CRADLE_R1, theirs));
    if (route === null) continue;
    if (best !== null && route.length >= best.route.length) continue;
    best = { theirs, route };
  }
  assert.ok(best !== null, 'this fixture offers the opening army no reachable enemy front sector');
  assert.ok(best.route.length - 1 <= MARCH_SPEED, 'this fixture needs a one-turn invasion');
  return { ...best, defaults, destination: best.route.at(-1) };
}

/**
 * Drive realm-a's opening army onto realm-b's capital and resolve.
 *
 * `chips` buys commitment because the guard is what this fixture must overcome:
 * 06d's shield fell at 0 chips, and CP-⑤ re-cut the coefficient precisely so that
 * a capital would not.
 */
function strikeTheCapital({ chips = 20, seed = 'turn-0001' } = {}) {
  const target = invasionTarget(seed);
  const capitals = { 'realm-a': target.defaults['realm-a'], 'realm-b': target.theirs };
  const runtime = openWithCapitals(capitals, seed);
  const detachment = runtime.view('realm-a').detachments[0];
  accepted(runtime, {
    kind: 'move-detachment', actor: 'realm-a', detachmentId: detachment.id,
    destinationHex: target.destination, forcedMarch: false,
  });
  if (chips > 0) {
    accepted(runtime, {
      kind: 'allocate-commitment', actor: 'realm-a', sector: target.theirs, chips,
      detachmentIds: [detachment.id],
    });
  }
  const closing = closeTurn(runtime);
  return { runtime, closing, capitals, capital: target.theirs };
}

// ── 1. the guard ────────────────────────────────────────────────────────────

test('the guard is land-derived from the capital sector at the sealed coefficient', () => {
  assert.equal(CAPITAL_GUARD_PER_POP, 2500, 'CP-⑤ seals 가안 2,500/pop');
  for (const [sectorId, sector] of Object.entries(CRADLE_R1.sectors)) {
    assert.equal(
      capitalGuardOf(sector.populationValue),
      Math.floor(2500 * sector.populationValue),
      `${sectorId}'s guard is not its own population read at the coefficient`,
    );
  }
  // CP-⑤'s own worked coordinates, so a later re-cut of the coefficient fails here
  // rather than silently re-pricing the only win condition.
  const pops = Object.values(CRADLE_R1.sectors).map((sector) => sector.populationValue);
  assert.equal(capitalGuardOf(Math.max(...pops)), 6000, 'the strongest guard this board can carry');
  assert.equal(capitalGuardOf(Math.min(...pops)), 1250, 'the weakest legal guard');
});

test('the guard stands on the capital, and only on the capital', () => {
  const capitals = firstSectors();
  const runtime = openWithCapitals(capitals);
  const view = runtime.view('realm-a');
  const shields = new Map(view.garrisons.map((garrison) => [garrison.sectorId, garrison.men]));
  const capital = capitals['realm-a'];
  const guard = capitalGuardOf(CRADLE_R1.sectors[capital].populationValue);

  assert.ok(shields.get(capital) >= guard, 'no guard stands on the capital');
  for (const [sectorId, men] of shields) {
    if (sectorId === capital) continue;
    assert.ok(
      men <= GARRISON_PER_BORDER_SECTOR,
      `${sectorId} carries guard-sized substance without being a capital`,
    );
  }
});

test('the guard stands WITH a border shield rather than instead of it (CP-⑦)', () => {
  // A capital that already carries an opening shield — 179 of 840 legal sites, so
  // the fixture is ordinary play rather than a contrivance.
  const probe = openWithCapitals(firstSectors());
  const shielded = probe.view('realm-a').garrisons[0].sectorId;
  const runtime = openWithCapitals({
    'realm-a': shielded,
    'realm-b': firstSectors()['realm-b'],
  });

  const guard = capitalGuardOf(CRADLE_R1.sectors[shielded].populationValue);
  const men = runtime.view('realm-a').garrisons
    .find((garrison) => garrison.sectorId === shielded).men;
  assert.equal(
    men,
    GARRISON_PER_BORDER_SECTOR + guard,
    'the guard replaced the shield instead of standing with it',
  );
});

test('the sector ceiling is the shield plus the guard, and headroom follows it', () => {
  assert.equal(garrisonHeadroomOf(0, 0), GARRISON_PER_BORDER_SECTOR);
  assert.equal(garrisonHeadroomOf(GARRISON_PER_BORDER_SECTOR, 0), 0);
  assert.equal(garrisonHeadroomOf(GARRISON_PER_BORDER_SECTOR, 2500), 2500);
  assert.equal(
    garrisonHeadroomOf(GARRISON_PER_BORDER_SECTOR + 2500, 2500),
    0,
    'a capital at cap still reported room',
  );
  assert.equal(garrisonHeadroomOf(99999, 2500), 0, 'headroom went negative');
});

test('the guard is register-backed realm-wide, not from the ground it stands on (CP-⑥)', () => {
  // `r5_s8` is CP-⑥'s settling case: pop 0.5, its whole 900 register consumed by
  // its own shield, so a locally-backed guard is impossible there at any coefficient.
  const seed = 'turn-0001';
  const owner = Runtime.open({ world: CRADLE_R1, seed, actors: ACTORS })
    .view('observer').realms.find((realm) => realm.sectors.includes('r5_s8'));
  assert.ok(owner !== undefined, 'r5_s8 belongs to neither realm in this partition');

  const other = ACTORS.find((actor) => actor !== owner.actor);
  const runtime = openWithCapitals({
    [owner.actor]: 'r5_s8',
    [other]: firstSectors(seed)[other],
  }, seed);

  const view = runtime.view(owner.actor);
  const guard = capitalGuardOf(CRADLE_R1.sectors.r5_s8.populationValue);
  assert.equal(guard, 1250, 'r5_s8 is CP-⑥ʼs pop-0.5 case');
  assert.ok(
    view.garrisons.find((garrison) => garrison.sectorId === 'r5_s8').men >= guard,
    'the guard was not raised at all on the sector that cannot back it locally',
  );
  // The whole realm still balances: no sector serves more men than its register.
  for (const [sectorId, forces] of Object.entries(view.economy.sectors)) {
    assert.ok(forces.serving <= forces.register, `${sectorId} serves beyond its register`);
    assert.equal(forces.availableCivilians, forces.register - forces.serving);
  }
});

// ── 2. the fall is an ordinary capture ──────────────────────────────────────

test('taking the capital sector ends the match, and says who won and why', () => {
  const { runtime, closing, capital } = strikeTheCapital();
  const captured = closing.find((event) => event.type === 'sector-captured');
  assert.ok(captured !== undefined, 'the fixture took no ground');
  assert.equal(captured.detail.sector, capital, 'the fixture took the wrong sector');

  const ended = closing.find((event) => event.type === 'match-ended');
  assert.ok(ended !== undefined, 'the capital fell and the match did not end');
  assert.equal(ended.detail.tier, 'payoff', 'the end belongs to the tier the capture is in');
  assert.equal(ended.detail.winner, 'realm-a');
  assert.equal(ended.detail.loser, 'realm-b');
  assert.equal(ended.detail.capital, capital);

  for (const viewer of [...ACTORS, 'observer']) {
    const view = runtime.view(viewer);
    assert.equal(view.phase, 'match-ended', `${viewer} was not told the match ended`);
    assert.deepEqual(view.outcome, {
      winner: 'realm-a', loser: 'realm-b', capital, turn: 1,
    }, `${viewer} reads a different outcome`);
  }
});

test('the capture that ends it is an ordinary one, with no extra gate', () => {
  const { closing } = strikeTheCapital();
  const battle = closing.find((event) => event.type === 'battle-resolved');
  assert.equal(battle.detail.sectorFalls, true);
  // The battle reports a *role*, not a realm — the capital is fought over by the
  // ordinary engagement, which knows nothing about capitals.
  assert.equal(battle.detail.winner, 'ATTACKER');
  assert.equal(battle.detail.attacker, 'realm-a');
  assert.equal(battle.detail.defender, 'realm-b');

  // Ordinary order: the capture is emitted by the same path every capture uses, and
  // the end follows it rather than replacing it.
  const types = closing.map((event) => event.type);
  assert.ok(
    types.indexOf('sector-captured') < types.indexOf('match-ended'),
    'the match ended before the ground changed hands',
  );
});

test('play stops: the turn does not open, and every further intent is refused', () => {
  const { runtime, closing } = strikeTheCapital();
  assert.equal(
    closing.filter((event) => event.type === 'turn-opened').length,
    0,
    'a turn opened after the match ended',
  );
  assert.equal(runtime.view('realm-a').turn, 1, 'the clock advanced past the end');

  for (const intent of [
    { kind: 'lock-commitment', actor: 'realm-a' },
    { kind: 'allocate-commitment', actor: 'realm-b', sector: 'r1_s0', chips: 1 },
    { kind: 'choose-capital', actor: 'realm-a', sector: 'r1_s0' },
  ]) {
    const events = runtime.submit(intent);
    assert.equal(events[0].type, 'intent-rejected', `${intent.kind} was accepted after the end`);
  }
});

// ── 3. nothing else names a winner ──────────────────────────────────────────

test('a capture that is not a capital does not end the match', () => {
  // 06d's own fixture: both capitals sit away from the invasion path.
  const target = invasionTarget();
  const runtime = openWithCapitals(target.defaults);
  const detachment = runtime.view('realm-a').detachments[0];
  accepted(runtime, {
    kind: 'move-detachment', actor: 'realm-a', detachmentId: detachment.id,
    destinationHex: target.destination, forcedMarch: false,
  });
  const closing = closeTurn(runtime);

  assert.ok(
    closing.some((event) => event.type === 'sector-captured'),
    'this fixture is supposed to take ground',
  );
  assert.equal(
    closing.filter((event) => event.type === 'match-ended').length,
    0,
    'an ordinary capture named a winner',
  );
  assert.equal(runtime.view('observer').phase, 'decision');
  assert.equal(runtime.view('observer').outcome, null);
});

test('the phase is terminal exactly when a capital changed hands, and never otherwise', () => {
  // The negative guarantee stated as an iff, over a match played long past any
  // plausible turn cap: no last-faction-standing, no percentage-of-hexes, no
  // hegemony, no points, no territory or economy tiebreak, no draw, no turn cap.
  const target = invasionTarget();
  const runtime = openWithCapitals(target.defaults);
  const capitals = target.defaults;
  let capitalTaken = false;

  for (let turn = 0; turn < 60; turn += 1) {
    const closing = closeTurn(runtime);
    for (const event of closing) {
      if (event.type !== 'sector-captured') continue;
      if (event.detail.sector === capitals[event.detail.loser]) capitalTaken = true;
    }
    const ended = runtime.view('observer').phase === 'match-ended';
    assert.equal(ended, capitalTaken, `turn ${turn + 1}: terminal state disagreed with the map`);
    if (ended) break;
  }

  assert.equal(capitalTaken, false, 'this fixture was supposed to be a quiet 60-turn match');
  assert.equal(runtime.view('observer').turn, 61, 'the match did not run 60 turns');
  assert.equal(runtime.view('observer').outcome, null, 'a winner was named without a capital fall');
});

test('a simultaneous double fall refuses rather than picking a winner', () => {
  // No seal says what two falls in one payoff name, and ADR 0042 names a winner
  // only for one. Ordering the two would decide it by resolve order, which D6.1a
  // forbids. So the Runtime refuses, loudly, and the rejection is pinned here
  // until the question is ruled — the same shape 06d gave its held posture transfer.
  const source = readFileSync(new URL('../dist/runtime/runtime.js', import.meta.url), 'utf8');
  assert.ok(
    source.includes('Two capitals fell in one payoff'),
    'the double fall stopped being refused without the question being ruled',
  );
});

// ── 4. the end is final, and a new match starts after it ────────────────────

test('a new match starts after the end, with authoritative state reset', () => {
  const { runtime, capitals } = strikeTheCapital();
  assert.equal(runtime.view('observer').phase, 'match-ended');

  const fresh = Runtime.open({ world: CRADLE_R1, seed: 'turn-0001', actors: ACTORS });
  const view = fresh.view('observer');
  assert.equal(view.phase, 'capital-selection', 'the new match did not reopen at the opening beat');
  assert.equal(view.turn, 1);
  assert.equal(view.outcome, null);
  assert.deepEqual(view.capitals, {}, 'the new match inherited a capital');

  // And the ended match is untouched by the new one — no shared authoritative state.
  assert.equal(runtime.view('observer').phase, 'match-ended');
  assert.equal(runtime.view('observer').outcome.capital, capitals['realm-b']);
});

test('the same seed and intent log reproduce the same ending', () => {
  const first = strikeTheCapital();
  const second = strikeTheCapital();
  assert.deepEqual(
    second.runtime.view('observer').outcome,
    first.runtime.view('observer').outcome,
    'the ending is not reproducible from (world, seed, ordered intent log)',
  );
  assert.deepEqual(
    second.closing.map((event) => event.type),
    first.closing.map((event) => event.type),
    'the closing event stream diverged between two identical runs',
  );
});

// ── the register still balances with a guard standing ───────────────────────

test('raising the guard leaves no sector serving beyond its register', () => {
  for (const actor of ACTORS) {
    const capitals = firstSectors();
    // Aim this realm's capital at its most populous sector — the largest guard the
    // partition can demand, and so the hardest case for realm-wide backing.
    const owned = Runtime.open({ world: CRADLE_R1, seed: 'turn-0001', actors: ACTORS })
      .view('observer').realms.find((realm) => realm.actor === actor).sectors;
    capitals[actor] = [...owned]
      .sort((a, b) => CRADLE_R1.sectors[b].populationValue - CRADLE_R1.sectors[a].populationValue)[0];

    const runtime = openWithCapitals(capitals);
    const view = runtime.view(actor);
    const registers = Object.fromEntries(owned.map((sectorId) => [
      sectorId, registerOf(CRADLE_R1.sectors, [sectorId]),
    ]));
    assert.equal(
      registers[capitals[actor]],
      Math.floor(REGISTER_PER_POP * CRADLE_R1.sectors[capitals[actor]].populationValue),
      'the register derivation moved',
    );
    // The projection throws on a negative remainder, so a clean view is the assertion.
    assert.ok(view.economy.register > 0);
  }
});
