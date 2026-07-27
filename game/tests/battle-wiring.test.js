/**
 * The decisive battle, wired — ticket 06c's wiring half.
 *
 * `battle-calculator.test.js` pins the arithmetic in isolation. This file pins it
 * **running on the real board**: an army that ends its turn on enemy ground meets
 * that sector's garrison, the sealed border class supplies the ground and the
 * water, the wear ledger becomes an effectiveness multiplier, and the blood is
 * taken out of the conscription register for good.
 *
 * Every expected value is composed from the modules' own exported dials, so a
 * re-cut at a birthplace moves these tests without editing them.
 *
 * Run against the emitted artifact, never the source (gate 05 D6).
 */

import test from 'node:test';
import assert from 'node:assert/strict';

const {
  bodiesLost,
  buildMovementGraph,
  commitLever,
  CRADLE_R1,
  effectiveness,
  engagementsOf,
  GARRISON_PER_BORDER_SECTOR,
  MARCH_FATIGUE_PER_HEX,
  MARCH_SPEED,
  minimumCostRoute,
  musterHexOf,
  OPEN_ESCAPE,
  RECOVERY_BASE_RATE,
  resolveBattle,
  Runtime,
  battleAccrual,
  UNIFORM_QUALITY,
} = await import('../dist/runtime/index.js');

const FIXTURE = { world: CRADLE_R1, seed: 'turn-0001', actors: ['realm-a', 'realm-b'] };
const GRAPH = buildMovementGraph(CRADLE_R1);

function openAtDecision(overrides = {}) {
  const runtime = Runtime.open({ ...FIXTURE, ...overrides });
  const setup = runtime.view('observer');
  for (const actor of setup.actors) {
    const sector = setup.realms.find((realm) => realm.actor === actor).sectors[0];
    runtime.submit({ kind: 'choose-capital', actor, sector });
  }
  return runtime;
}

const other = (actor) => (actor === 'realm-a' ? 'realm-b' : 'realm-a');
const lock = (runtime, actor) => runtime.submit({ kind: 'lock-commitment', actor });
const types = (events) => events.map((event) => event.type);

/** Close a turn, letting `actor` lock second so the resolution comes back here. */
function closeTurn(runtime, actor = 'realm-b') {
  lock(runtime, other(actor));
  return lock(runtime, actor);
}

/**
 * The shortest invasion this realm's opening army can actually make: the front
 * whose *enemy* sector its route reaches in the fewest arcs.
 */
function nearestInvasion(runtime, actor) {
  const view = runtime.view(actor);
  const own = new Set(view.realms.find((realm) => realm.actor === actor).sectors);
  const detachment = view.detachments[0];
  let best = null;
  for (const front of view.fronts) {
    const [x, y] = front.sectors;
    const theirs = own.has(x) ? y : x;
    const route = minimumCostRoute(GRAPH, detachment.position, musterHexOf(CRADLE_R1, theirs));
    if (route === null) continue;
    if (best !== null && route.length >= best.route.length) continue;
    best = { front: front.key, mine: own.has(x) ? x : y, theirs, route };
  }
  assert.ok(best !== null, 'this fixture offers the opening army no reachable enemy front sector');
  return { ...best, detachmentId: detachment.id, destination: best.route.at(-1) };
}

/** March one detachment to a hex, closing turns until it stands there. */
function marchToContact(runtime, actor, invasion, turns = 8) {
  runtime.submit({
    kind: 'move-detachment',
    actor,
    detachmentId: invasion.detachmentId,
    destinationHex: invasion.destination,
    forcedMarch: false,
  });
  for (let turn = 0; turn < turns; turn += 1) {
    const closing = closeTurn(runtime, actor);
    const standing = runtime.view(actor).detachments.find((d) => d.id === invasion.detachmentId);
    if (standing !== undefined &&
        standing.position.q === invasion.destination.q &&
        standing.position.r === invasion.destination.r) {
      return closing;
    }
  }
  assert.fail('the army never reached the enemy front sector');
}

test('an army that ends its turn on enemy ground fights the battle there', () => {
  const runtime = openAtDecision();
  const invasion = nearestInvasion(runtime, 'realm-a');
  const closing = marchToContact(runtime, 'realm-a', invasion);

  const battles = closing.filter((event) => event.type === 'battle-resolved');
  assert.equal(battles.length, 1, `no single battle in ${JSON.stringify(types(closing))}`);
  assert.equal(battles[0].detail.sector, invasion.theirs);
  assert.equal(battles[0].detail.attacker, 'realm-a');
  assert.equal(battles[0].detail.defender, 'realm-b');
  assert.equal(battles[0].detail.tier, 'payoff');
});

// ── the fixture the precise arithmetic is measured on ────────────────────────

/**
 * A one-turn invasion: the opening army crosses in a single march, so its wear at
 * the moment of battle is exactly the arcs it walked — no earlier turn's accrual
 * and no earlier tail's recovery in the way.
 */
function oneTurnInvasion({ chips = 0 } = {}) {
  const runtime = openAtDecision();
  const invasion = nearestInvasion(runtime, 'realm-a');
  const arcs = invasion.route.length - 1;
  assert.ok(arcs <= MARCH_SPEED, `this fixture needs a one-turn invasion; the nearest is ${arcs} arcs`);

  const attackerMen = runtime.view('realm-a').detachments[0].men;
  const garrisonMen = runtime.view('realm-b').garrisons
    .find((garrison) => garrison.sectorId === invasion.theirs).men;
  const registersBefore = {
    'realm-a': runtime.view('realm-a').economy.register,
    'realm-b': runtime.view('realm-b').economy.register,
  };

  if (chips > 0) {
    runtime.submit({
      kind: 'allocate-commitment', actor: 'realm-a', front: invasion.front, chips, detachmentIds: [],
    });
  }
  runtime.submit({
    kind: 'move-detachment',
    actor: 'realm-a',
    detachmentId: invasion.detachmentId,
    destinationHex: invasion.destination,
    forcedMarch: false,
  });
  const closing = closeTurn(runtime, 'realm-b');
  const battle = closing.find((event) => event.type === 'battle-resolved');
  assert.ok(battle !== undefined, `no battle in ${JSON.stringify(types(closing))}`);

  return {
    runtime, invasion, closing, battle, attackerMen, garrisonMen, registersBefore,
    wearAtBattle: arcs * MARCH_FATIGUE_PER_HEX,
  };
}

/** The calculator's own answer for a claimed reading of the same engagement. */
const calculatorSays = ({ attackerMen, garrisonMen, commit, attackerFatigue }) => resolveBattle({
  attacker: {
    substance: attackerMen,
    commit,
    quality: UNIFORM_QUALITY,
    fatigue: attackerFatigue,
    escape: OPEN_ESCAPE,
  },
  defender: {
    // A garrison holds no wear ledger, so it fights at the unattended baseline.
    substance: garrisonMen,
    commit: 0,
    quality: UNIFORM_QUALITY,
    fatigue: effectiveness(0),
    escape: OPEN_ESCAPE,
  },
  terrain: 'plains',
  fortification: 'none',
  crossing: 'none',
});

// ── the conversion the ticket exists to get right ────────────────────────────

test('the board hands the calculator an effectiveness multiplier, not the wear ledger', () => {
  const run = oneTurnInvasion();
  assert.equal(run.battle.detail.terrain, 'plains', 'this fixture is not the open-border one');
  assert.equal(run.battle.detail.crossing, 'none');

  const reading = {
    attackerMen: run.attackerMen,
    garrisonMen: run.garrisonMen,
    commit: 0,
    attackerFatigue: effectiveness(run.wearAtBattle),
  };
  const converted = calculatorSays(reading);
  assert.equal(
    run.battle.detail.casualties.attacker,
    bodiesLost(run.attackerMen, converted.attacker.casualties),
    'the board did not price the attacker at effectiveness(wear)',
  );
  assert.equal(
    run.battle.detail.casualties.defender,
    bodiesLost(run.garrisonMen, converted.defender.casualties),
  );

  // The silent bug this guards: the ledger and the multiplier share the name
  // `fatigue`, and handing the ledger straight over type-checks.
  const raw = calculatorSays({ ...reading, attackerFatigue: run.wearAtBattle });
  assert.notEqual(
    bodiesLost(run.attackerMen, raw.attacker.casualties),
    run.battle.detail.casualties.attacker,
    'the raw ledger and the multiplier produced the same battle; this test proves nothing',
  );
});

test('an unattended garrison fights at its own strength, and the chips are the lever', () => {
  const unattended = oneTurnInvasion();
  // Item 5's common case: the defender's army is elsewhere, so the shield fights
  // alone at M2's 0-point baseline.
  assert.equal(unattended.garrisonMen, GARRISON_PER_BORDER_SECTOR);
  assert.equal(unattended.battle.detail.commitments.defender, 0);
  assert.equal(commitLever(0), 1, 'M2 no longer seals the unattended baseline at x1.00');

  const pressed = oneTurnInvasion({ chips: 8 });
  assert.equal(pressed.battle.detail.commitments.attacker, 8, 'the front chips did not reach the battle');

  const reading = {
    attackerMen: pressed.attackerMen,
    garrisonMen: pressed.garrisonMen,
    attackerFatigue: effectiveness(pressed.wearAtBattle),
  };
  assert.equal(
    pressed.battle.detail.casualties.attacker,
    bodiesLost(pressed.attackerMen, calculatorSays({ ...reading, commit: 8 }).attacker.casualties),
    'the knee of the M2 curve is not what priced this attack',
  );
  assert.ok(
    pressed.battle.detail.casualties.attacker < unattended.battle.detail.casualties.attacker,
    'committing eight chips bought the attacker nothing',
  );
});

// ── blood is permanent currency ─────────────────────────────────────────────

test('battle blood leaves the formation and the conscription register for good', () => {
  const run = oneTurnInvasion();
  const { attacker, defender } = run.battle.detail.casualties;
  assert.ok(defender > 0, 'the garrison paid nothing at all');
  assert.ok(attacker > 0, 'the attacker walked in free');

  for (const [actor, dead] of [['realm-a', attacker], ['realm-b', defender]]) {
    const economy = run.runtime.view(actor).economy;
    assert.equal(
      economy.register,
      run.registersBefore[actor] - dead,
      `${actor}'s register did not shrink by exactly its dead`,
    );
    // The conservation `availableCiviliansByOrigin` guards: a death that left the
    // register standing would hand the same body back to the next draft.
    for (const [region, province] of Object.entries(economy.provinces)) {
      assert.equal(
        province.register,
        province.serving + province.availableCivilians,
        `${actor}/${region} no longer balances`,
      );
      assert.ok(province.availableCivilians >= 0, `${actor}/${region} owes civilians`);
    }
  }

  // And the men are gone from the board, not only from the ledger.
  const survivors = run.runtime.view('realm-a').detachments
    .find((detachment) => detachment.id === run.invasion.detachmentId);
  assert.equal(survivors.men, run.attackerMen - attacker);
  assert.equal(
    run.runtime.view('realm-b').garrisons.find((g) => g.sectorId === run.invasion.theirs).men,
    run.garrisonMen - defender,
  );
});

test('a battle wears the survivors, and the same turn gives them one recovery', () => {
  const run = oneTurnInvasion();
  const converted = calculatorSays({
    attackerMen: run.attackerMen,
    garrisonMen: run.garrisonMen,
    commit: 0,
    attackerFatigue: effectiveness(run.wearAtBattle),
  });

  // Battle is the payoff, upkeep the background tail (D6.2), so the ledger takes
  // the fight and then one rest — the same arithmetic a march gets.
  const expected = run.wearAtBattle +
    battleAccrual(converted.attacker.casualties / run.attackerMen) -
    RECOVERY_BASE_RATE;
  assert.equal(
    run.runtime.view('realm-a').detachments
      .find((detachment) => detachment.id === run.invasion.detachmentId).fatigue,
    expected,
  );
});

// ── the boundary 06d owns ───────────────────────────────────────────────────

test('a fallen sector is reported and taken by nobody (06d owns the ground)', () => {
  const run = oneTurnInvasion();
  assert.equal(run.battle.detail.sectorFalls, true, 'this fixture never breaks the shield');

  const held = run.runtime.view('observer').realms
    .map((realm) => [realm.actor, [...realm.sectors].sort()]);
  const fresh = openAtDecision().view('observer').realms
    .map((realm) => [realm.actor, [...realm.sectors].sort()]);
  assert.deepEqual(held, fresh, 'a battle moved a border, which is 06d\'s to do');
});

test('the watchable battle publishes no exact strength and no composed power', () => {
  const run = oneTurnInvasion();
  const published = Object.keys(run.battle.detail).sort();
  assert.equal(published.includes('substance'), false, 'exact pre-battle strength crossed submit()');
  assert.equal(published.includes('power'), false, 'the composed power product crossed submit()');
  // What a watcher does get: the ground, the roles, the result and the blood.
  for (const field of ['sector', 'terrain', 'crossing', 'attacker', 'defender', 'winner',
    'sectorFalls', 'casualties', 'routed']) {
    assert.ok(published.includes(field), `the payoff cannot be watched without ${field}`);
  }
});

test('the battle does not depend on which realm locked first (D6.1a)', () => {
  const plan = (lockSecond) => {
    const runtime = openAtDecision();
    const invasion = nearestInvasion(runtime, 'realm-a');
    runtime.submit({
      kind: 'allocate-commitment', actor: 'realm-a', front: invasion.front, chips: 5, detachmentIds: [],
    });
    runtime.submit({
      kind: 'allocate-commitment', actor: 'realm-b', front: invasion.front, chips: 3, detachmentIds: [],
    });
    runtime.submit({
      kind: 'move-detachment',
      actor: 'realm-a',
      detachmentId: invasion.detachmentId,
      destinationHex: invasion.destination,
      forcedMarch: false,
    });
    return closeTurn(runtime, lockSecond).find((event) => event.type === 'battle-resolved').detail;
  };
  assert.deepEqual(plan('realm-a'), plan('realm-b'));
});

// ── TC-⑬: the authored door supplies the ground ─────────────────────────────

test('the border class carries the combat terrain and the water (TC-⑬)', () => {
  // The sealed table, as a table. Values live at M5 and ADR 0015 and are held by
  // `battle.ts`; what is under test here is the *binding*, which is TC-⑬'s.
  const SEALED = [
    ['open', 'plains', 'none'],
    ['forest', 'forestHills', 'none'],
    ['hills', 'forestHills', 'none'],
    ['pass', 'pass', 'none'],
    ['river', 'plains', 'riverOpposed'],
    ['strait', 'plains', 'straitOpposed'],
  ];

  for (const [chokeClass, terrain, crossing] of SEALED) {
    const [engagement] = engagementsOf(
      [{ key: 'x|y', sectors: ['x', 'y'], owners: ['realm-a', 'realm-b'], chokeClass }],
      {},
      () => ({ men: { 'realm-a': 4000, 'realm-b': 900 }, wearMass: {}, fortTier: 'none' }),
    );
    assert.equal(engagement.chokeClass, chokeClass);
    assert.equal(engagement.terrain, terrain, `${chokeClass} took the wrong ground`);
    assert.equal(engagement.crossing, crossing, `${chokeClass} took the wrong water`);
    // Uniform by seal, not by omission: TC-⑭ starts every player-varyable value
    // equal, and nothing in this slice builds a fort or raises troop quality.
    assert.equal(engagement.fortification, 'none');
    assert.equal(engagement.defenseMethod, 'STRONGHOLD');
  }
});

test('an unauthored fortification tier is refused rather than fought at x1.00', () => {
  assert.throws(
    () => engagementsOf(
      [{ key: 'x|y', sectors: ['x', 'y'], owners: ['realm-a', 'realm-b'], chokeClass: 'open' }],
      {},
      () => ({ men: { 'realm-a': 10, 'realm-b': 10 }, wearMass: {}, fortTier: 'townWalls-ish' }),
    ),
    /has no M5 rung/,
  );
});

// ── ticket 03's case 4, adjudicated ─────────────────────────────────────────

test('two borders onto one sector are one engagement, at the softest crossing', () => {
  const engagements = engagementsOf(
    [
      { key: 'a|s', sectors: ['a', 's'], owners: ['realm-b', 'realm-a'], chokeClass: 'pass' },
      { key: 'b|s', sectors: ['b', 's'], owners: ['realm-b', 'realm-a'], chokeClass: 'open' },
    ],
    { 'realm-b': { 'a|s': 7, 'b|s': 5 } },
    (sector) => ({
      men: sector === 's' ? { 'realm-a': 900, 'realm-b': 4000 } : {},
      wearMass: {},
      fortTier: 'none',
    }),
  );

  assert.equal(engagements.length, 1, 'a sector was fought over more than once in one turn');
  const [engagement] = engagements;
  assert.equal(engagement.sector, 's');
  assert.deepEqual(engagement.fronts, ['a|s', 'b|s'], 'the merged engagement lost a border');
  // Reachable-weakest-link: the pass is not the window an attacker actually uses.
  assert.equal(engagement.chokeClass, 'open');
  assert.equal(engagement.terrain, 'plains');
  // Both borders' chips pour into the one engagement they both open onto.
  assert.equal(engagement.attacker.commit, 12);
  assert.equal(engagement.defender.commit, 0);
});

test('a realm pressing one sector from two real borders fights once (r7_s0)', () => {
  const runtime = openAtDecision();
  const shared = runtime.view('realm-b').fronts
    .filter((front) => front.sectors.includes('r7_s0'))
    .map((front) => front.key);
  assert.equal(shared.length, 2, 'this fixture does not put two borders on r7_s0');

  const invader = runtime.view('realm-b').detachments[0];
  runtime.submit({
    kind: 'move-detachment',
    actor: 'realm-b',
    detachmentId: invader.id,
    destinationHex: musterHexOf(CRADLE_R1, 'r7_s0'),
    forcedMarch: false,
  });

  // Chips do not carry over (D6.3), so both borders are pressed every turn until
  // the army actually arrives — the arrival turn is the one that spends them.
  for (let turn = 0; turn < 6; turn += 1) {
    runtime.submit({
      kind: 'allocate-commitment', actor: 'realm-b', front: shared[0], chips: 7, detachmentIds: [],
    });
    runtime.submit({
      kind: 'allocate-commitment', actor: 'realm-b', front: shared[1], chips: 5, detachmentIds: [],
    });
    const closing = closeTurn(runtime, 'realm-b');
    const battles = closing.filter((event) => event.type === 'battle-resolved');
    if (battles.length === 0) continue;

    assert.equal(battles.length, 1, 'r7_s0 was fought over twice in one turn');
    const detail = battles[0].detail;
    assert.equal(detail.sector, 'r7_s0');
    assert.deepEqual([...detail.fronts].sort(), [...shared].sort());
    assert.equal(detail.commitments.attacker, 12, 'only one border\'s chips reached the battle');
    // open (x1.0 ground) beside river (x0.70 attack) — the softer door wins.
    assert.equal(detail.borderClass, 'open');
    // Both fronts still exist as fronts; only the engagement merged.
    assert.deepEqual(
      runtime.view('realm-b').fronts.filter((f) => f.sectors.includes('r7_s0')).map((f) => f.key).sort(),
      [...shared].sort(),
    );
    return;
  }
  assert.fail('the army never reached r7_s0');
});
