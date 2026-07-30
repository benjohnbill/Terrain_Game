/**
 * The decisive battle, wired — ticket 06c's wiring half.
 *
 * `battle-calculator.test.js` pins the arithmetic in isolation. This file pins it
 * **running on the real board**: an army that ends its turn on enemy ground meets
 * that sector's garrison, the sector's own authored terrain supplies the ground and
 * the door supplies the water, the wear ledger becomes an effectiveness multiplier,
 * and the blood is taken out of the conscription register for good.
 *
 * Ticket 06e re-aimed several of these. What was `TC-⑬: the authored door supplies
 * the ground` is now two sections — the door's surviving crossing column, and
 * TC-⑮'s sector-terrain binding — and the commit key moved from the front to the
 * sector (ADR 0046 item 4).
 *
 * Every expected value is composed from the modules' own exported dials, so a
 * re-cut at a birthplace moves these tests without editing them.
 *
 * Run against the emitted artifact, never the source (gate 05 D6).
 */

import test from 'node:test';
import assert from 'node:assert/strict';

const {
  attackPower,
  bodiesLost,
  buildMovementGraph,
  combatTerrainOf,
  commitLever,
  CRADLE_R1,
  defensePower,
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

/**
 * Submit and refuse to continue on a rejection.
 *
 * A silent `intent-rejected` reads downstream as "the mechanic did nothing", which
 * is how the 06e re-key first appeared: the dispatcher still destructured `front`,
 * and every commit quietly became zero rather than failing where it broke.
 */
function accepted(runtime, intent) {
  const events = runtime.submit(intent);
  const rejected = events.find((event) => event.type === 'intent-rejected');
  assert.ok(rejected === undefined, `${intent.kind} was rejected: ${rejected?.detail.reason}`);
  return events;
}

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
    accepted(runtime, {
      kind: 'allocate-commitment', actor: 'realm-a', sector: invasion.theirs, chips, detachmentIds: [],
    });
  }
  accepted(runtime, {
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

  // **Two laws move the register, and this test is about only one of them.** Blood
  // destroys bodies; a capture *moves* them (06d, ADR 0044). This fixture takes the
  // sector, so the transfer has to be subtracted out before the casualty law is
  // legible — netting the two together is exactly the mistake the ticket warned
  // would "look like a transfer bug".
  // Read the ceded count from the **taker's own** register at the sector it took —
  // it held none there before. The capture event deliberately does not publish the
  // number, because that would be an exact reading of the loser's stock.
  const taken = run.battle.detail.sector;
  const ceded = run.runtime.view('realm-a').economy.sectors[taken]?.register ?? 0;
  const transferred = { 'realm-a': ceded, 'realm-b': -ceded };

  for (const [actor, dead] of [['realm-a', attacker], ['realm-b', defender]]) {
    const economy = run.runtime.view(actor).economy;
    assert.equal(
      economy.register,
      run.registersBefore[actor] - dead + transferred[actor],
      `${actor}'s register did not shrink by exactly its dead, net of the transfer`,
    );
    // The conservation `availableCiviliansByOrigin` guards: a death that left the
    // register standing would hand the same body back to the next draft.
    for (const [sectorId, row] of Object.entries(economy.sectors)) {
      assert.equal(
        row.register,
        row.serving + row.availableCivilians,
        `${actor}/${sectorId} no longer balances`,
      );
      assert.ok(row.availableCivilians >= 0, `${actor}/${sectorId} owes civilians`);
    }
  }

  // And the men are gone from the board, not only from the ledger.
  const survivors = run.runtime.view('realm-a').detachments
    .find((detachment) => detachment.id === run.invasion.detachmentId);
  assert.equal(survivors.men, run.attackerMen - attacker);
  // The defender's side of that is no longer a garrison reading: the sector fell, so
  // realm-b holds no shield there at all and the taker inherited an empty one. What
  // the shield cost is asserted through the register above.
  assert.equal(
    run.runtime.view('realm-b').garrisons.find((g) => g.sectorId === taken),
    undefined,
    'realm-b still mans a shield on ground it lost',
  );
  assert.equal(
    run.runtime.view('realm-a').garrisons.find((g) => g.sectorId === taken).men,
    0,
    'the taker inherited the loser\'s surviving shield',
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

// ── the boundary 06d closed ─────────────────────────────────────────────────

test('a fallen sector is taken, and nothing else on the board moves', () => {
  // This replaces 06e's "reported and taken by nobody (06d owns the ground)". That
  // test asserted the gap deliberately, so its inversion is the seam closing rather
  // than a regression. What is still worth pinning is the *narrowness*: a battle
  // moves exactly the border it was fought on.
  const run = oneTurnInvasion();
  assert.equal(run.battle.detail.sectorFalls, true, 'this fixture never breaks the shield');

  const held = new Map(run.runtime.view('observer').realms
    .map((realm) => [realm.actor, new Set(realm.sectors)]));
  const fresh = new Map(openAtDecision().view('observer').realms
    .map((realm) => [realm.actor, new Set(realm.sectors)]));

  const taken = run.battle.detail.sector;
  for (const [actor, after] of held) {
    const before = fresh.get(actor);
    const gained = [...after].filter((sector) => !before.has(sector));
    const lost = [...before].filter((sector) => !after.has(sector));
    const expected = actor === run.battle.detail.attacker ? { gained: [taken], lost: [] }
      : { gained: [], lost: [taken] };
    assert.deepEqual({ gained, lost }, expected, `${actor}'s holdings moved by more than the battle`);
  }
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
    accepted(runtime, {
      kind: 'allocate-commitment', actor: 'realm-a', sector: invasion.theirs, chips: 5, detachmentIds: [],
    });
    accepted(runtime, {
      kind: 'allocate-commitment', actor: 'realm-b', sector: invasion.theirs, chips: 3, detachmentIds: [],
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

// ── the adapter, over plain values ──────────────────────────────────────────

/**
 * One sector's standing, as the adapter reads it. `holder` defaults to the
 * defender because that is what makes the other side an invader at all.
 */
const standingOf = ({
  holder = 'realm-b',
  invader = 'realm-a',
  invaderMen = 4000,
  holderMen = 900,
  fortTier = 'none',
  terrainLayer = 'plains',
} = {}) => ({
  holder,
  sides: {
    [invader]: { men: invaderMen, wearMass: 0 },
    [holder]: { men: holderMen, wearMass: 0 },
  },
  fortTier,
  terrainLayer,
});

const EMPTY_STANDING = { holder: 'realm-b', sides: {}, fortTier: 'none', terrainLayer: 'plains' };

// ── TC-⑬'s surviving column: the door supplies the water, and only that ──────

test("the door carries the crossing and no longer carries the ground (TC-⑬ as TC-⑮ left it)", () => {
  // The sealed table, as a table. Values live at ADR 0015 and are held by
  // `battle.ts`; what is under test is the *binding*. TC-⑮ amended the terrain
  // column away, so every row here now defends on the sector's own ground — the
  // third column is what the door still contributes.
  const SEALED = [
    ['open', 'none'],
    ['forest', 'none'],
    ['hills', 'none'],
    ['pass', 'none'],
    ['river', 'riverOpposed'],
    ['strait', 'straitOpposed'],
  ];

  for (const [chokeClass, crossing] of SEALED) {
    const [engagement] = engagementsOf(
      ['x', 'y'],
      [{ key: 'x|y', sectors: ['x', 'y'], owners: ['realm-b', 'realm-a'], chokeClass }],
      {},
      (sector) => (sector === 'x' ? standingOf({ terrainLayer: 'highland' }) : EMPTY_STANDING),
    );
    assert.equal(engagement.chokeClass, chokeClass);
    assert.equal(engagement.crossing, crossing, `${chokeClass} took the wrong water`);
    // The door's class no longer reaches the ground at all: every row above is a
    // `highland` sector, so every row defends at M5's forest/hills rung.
    assert.equal(
      engagement.terrain,
      'forestHills',
      `${chokeClass} still took its ground from the door`,
    );
    // Uniform by seal, not by omission: TC-⑭ starts every player-varyable value
    // equal, and nothing in this slice builds a fort or raises troop quality.
    assert.equal(engagement.fortification, 'none');
    assert.equal(engagement.defenseMethod, 'STRONGHOLD');
  }
});

test('an interior sector is a battle site, and its door contributes nothing', () => {
  // The gate ADR 0046 removed: before 06e a candidate site had to be the endpoint
  // of an authored border, which left 41 of 45 capitals takeable with zero battles.
  const [engagement] = engagementsOf(
    ['interior'],
    [],
    { 'realm-a': { interior: 6 } },
    () => standingOf({ terrainLayer: 'mountain' }),
  );

  assert.equal(engagement.sector, 'interior');
  assert.deepEqual(engagement.fronts, [], 'an interior engagement invented a border');
  assert.equal(engagement.chokeClass, null);
  assert.equal(engagement.crossing, 'none', 'an interior attacker paid a crossing it never made');
  assert.equal(engagement.terrain, 'mountains', 'interior ground fell back to a default');
  assert.equal(engagement.attacker.commit, 6);
});

test('presence is the whole predicate: no invader, no engagement', () => {
  const sited = (invaderMen) => engagementsOf(
    ['s'],
    [{ key: 'b|s', sectors: ['b', 's'], owners: ['realm-b', 'realm-a'], chokeClass: 'open' }],
    {},
    () => standingOf({ holder: 'realm-a', invader: 'realm-b', invaderMen }),
  ).length;

  assert.equal(sited(0), 0, 'an empty side was reported as a battle');
  assert.equal(sited(1), 1, 'one man standing on hostile ground is an engagement');
});

test('unowned ground has no defender, so it produces no engagement', () => {
  // The drawn partition covers all 56 sectors, so this never fires today. It is
  // pinned because "ground it does not hold" needs somebody to hold it.
  assert.deepEqual(
    engagementsOf(
      ['s'],
      [],
      {},
      () => ({ ...standingOf(), holder: null }),
    ),
    [],
  );
});

test('an unauthored fortification tier is refused rather than fought at x1.00', () => {
  assert.throws(
    () => engagementsOf(
      ['x'],
      [{ key: 'x|y', sectors: ['x', 'y'], owners: ['realm-b', 'realm-a'], chokeClass: 'open' }],
      {},
      () => standingOf({ fortTier: 'townWalls-ish' }),
    ),
    /has no M5 rung/,
  );
});

test('an unbound terrain layer is refused rather than fought at x1.00 (TC-⑮)', () => {
  // The same precedent, one layer up. TC-⑪'s queued re-authoring is expected to
  // add layers, and a silent plains is what would hide a missing rung.
  assert.throws(
    () => engagementsOf(['x'], [], {}, () => standingOf({ terrainLayer: 'tundra' })),
    /has no M5 rung/,
  );
});

// ── TC-⑮: a sector defends on its own ground ────────────────────────────────

test('every authored layer maps onto an M5 rung, and river-valley is not the river', () => {
  // The binding, as a table. Multipliers live at M5; `combatTerrainOf` names the
  // rung and `battle.ts` prices it, so nothing here restates a number.
  const BOUND = [
    ['plains', 'plains'],
    ['steppe', 'plains'],
    ['desert', 'plains'],
    ['oasis', 'plains'],
    // The trap: `river` the border class prices an opposed crossing at 0.70. A
    // river valley is the ground you stand on, and five interior sectors carry it.
    ['river-valley', 'plains'],
    ['highland', 'forestHills'],
    ['mountain', 'mountains'],
  ];
  for (const [layer, rung] of BOUND) assert.equal(combatTerrainOf(layer), rung, `${layer} took the wrong rung`);

  // Every layer the world actually authors is bound — the premise TC-⑮ rests on.
  const authored = new Set(Object.values(CRADLE_R1.sectors)
    .flatMap((sector) => sector.mapUnits.map((unit) => unit.terrainLayer)));
  for (const layer of authored) assert.ok(combatTerrainOf(layer), `${layer} is authored but unbound`);
});

test('every sector of the authored world is terrain-uniform (TC-⑮\'s premise)', () => {
  const mixed = Object.values(CRADLE_R1.sectors)
    .filter((sector) => new Set(sector.mapUnits.map((unit) => unit.terrainLayer)).size !== 1)
    .map((sector) => sector.id);
  assert.deepEqual(mixed, [], 'a sector carries more than one terrain, so it has no single ground');
});

test('a pass is asymmetric: the mountain side defends at 1.5, the plains side at 1.0', () => {
  // 관중's three `mountain` sectors are exactly its three pass endpoints, so 四塞之地
  // now comes out of the ground rather than out of the door — and 중원's plains
  // sector on the far side of the same door stops collecting a defile bonus.
  const ratioAt = (sector) => {
    const [engagement] = engagementsOf(
      [sector],
      // The pass door both sides share. It supplies the crossing, which for a pass
      // is `none`, so any asymmetry below is the ground's alone.
      [{ key: `r1_s0|r6_s5`, sectors: ['r1_s0', 'r6_s5'], owners: ['realm-b', 'realm-a'], chokeClass: 'pass' }],
      {},
      () => standingOf({
        invaderMen: 1800,
        holderMen: 900,
        terrainLayer: CRADLE_R1.sectors[sector].mapUnits[0].terrainLayer,
      }),
    );
    const side = (men) => ({ substance: men, commit: 0, quality: UNIFORM_QUALITY, fatigue: 1 });
    return attackPower(side(1800), engagement.crossing) /
      defensePower(side(900), engagement.terrain, engagement.fortification);
  };

  assert.equal(CRADLE_R1.sectors.r6_s5.mapUnits[0].terrainLayer, 'mountain');
  assert.equal(CRADLE_R1.sectors.r1_s0.mapUnits[0].terrainLayer, 'plains');
  // 1,800 against a 900 garrison: 1.33 defending the defile, 2.00 defending the
  // plain behind it. A symmetric result would mean the door is still the source.
  assert.equal(Number(ratioAt('r6_s5').toFixed(2)), 1.33);
  assert.equal(Number(ratioAt('r1_s0').toFixed(2)), 2.00);
  assert.ok(ratioAt('r6_s5') < ratioAt('r1_s0'), 'the pass is still symmetric');
});

test('a river-door battle is numerically unchanged by this ticket', () => {
  // TC-⑮ left TC-⑬'s crossing column untouched, so the regression anchor is an
  // exact number rather than a direction: 1,800 against 900 across an opposed
  // river is R 1.40 before and after.
  const [engagement] = engagementsOf(
    ['s'],
    [{ key: 'b|s', sectors: ['b', 's'], owners: ['realm-b', 'realm-a'], chokeClass: 'river' }],
    {},
    () => standingOf({ invaderMen: 1800, holderMen: 900, terrainLayer: 'river-valley' }),
  );
  assert.equal(engagement.crossing, 'riverOpposed');
  const side = (men) => ({ substance: men, commit: 0, quality: UNIFORM_QUALITY, fatigue: 1 });
  const ratio = attackPower(side(1800), engagement.crossing) /
    defensePower(side(900), engagement.terrain, engagement.fortification);
  assert.equal(Number(ratio.toFixed(2)), 1.40);
});

// ── WM-⑤: where a broken force goes ─────────────────────────────────────────

/**
 * Send `men` alone against a full shield and close turns until they meet it.
 *
 * The size is the experiment: M4's rout gate is a *fraction*, so a force that is
 * merely beaten does not break and a force that is annihilated leaves no survivor
 * to displace. Both ends are asserted at the call sites rather than assumed.
 */
function forlornHope(men) {
  const runtime = openAtDecision();
  const invasion = nearestInvasion(runtime, 'realm-a');
  const parent = runtime.view('realm-a').detachments[0].id;
  accepted(runtime, { kind: 'split-detachment', actor: 'realm-a', detachmentId: parent, men });
  const child = runtime.view('realm-a').detachments.find((d) => d.id !== parent && d.men === men);
  assert.ok(child !== undefined, 'the split produced no detachment of that size');
  accepted(runtime, {
    kind: 'move-detachment',
    actor: 'realm-a',
    detachmentId: child.id,
    destinationHex: invasion.destination,
    forcedMarch: false,
  });

  for (let turn = 0; turn < 8; turn += 1) {
    const closing = closeTurn(runtime, 'realm-a');
    const battle = closing.find((event) => event.type === 'battle-resolved');
    if (battle !== undefined) return { runtime, invasion, battle, childId: child.id, men };
  }
  return assert.fail('the forlorn hope never met the shield');
}

const sectorOfHex = (hex) => GRAPH.nodes[`${hex.q},${hex.r}`].sectorId;

test('a routed force with an arc falls back one sector, and pays the march for it', () => {
  const run = forlornHope(400);
  assert.equal(run.battle.detail.routed.attacker, true, 'this fixture no longer breaks its attacker');
  assert.ok(
    run.battle.detail.casualties.attacker < run.men,
    'the fixture annihilated its attacker, so nothing survived to displace',
  );

  const survivor = run.runtime.view('realm-a').detachments.find((d) => d.id === run.childId);
  assert.ok(survivor !== undefined, 'a force with an arc left service instead of falling back');
  assert.equal(survivor.men, run.men - run.battle.detail.casualties.attacker, 'the escaped count is wrong');

  // One sector back, along the arc — the hex the crossing started from, which is by
  // construction one graph arc from the ground it lost.
  const landed = `${survivor.position.q},${survivor.position.r}`;
  assert.notEqual(sectorOfHex(survivor.position), run.invasion.theirs, 'the rout stayed where it broke');
  assert.ok(
    GRAPH.nodes[landed].arcs.some((arc) => GRAPH.nodes[arc.to].sectorId === run.invasion.theirs),
    'the fall-back landed somewhere the arc could not have come from',
  );

  // R12 prices movement in turns and fatigue, never commit. A displacement that
  // paid nothing would be a teleport.
  const stationary = run.runtime.view('realm-a').detachments.find((d) => d.id !== run.childId);
  assert.ok(
    survivor.fatigue >= stationary.fatigue + MARCH_FATIGUE_PER_HEX,
    'the fall-back was free',
  );
});

test('a routed garrison has no arc, so it leaves service and stays on the register', () => {
  // The common case on this board (06c item 5) and therefore the main path: nothing
  // marches a garrison, so it never has an approach to fall back along.
  const run = forlornHope(3000);
  assert.equal(run.battle.detail.routed.defender, true, 'this fixture no longer breaks the shield');
  const dead = run.battle.detail.casualties.defender;
  const shield = GARRISON_PER_BORDER_SECTOR;
  assert.ok(dead < shield, 'the shield was annihilated, so nothing was left to leave service');

  const after = run.runtime.view('realm-b');
  // The shield is gone from realm-b's books entirely, and since 06d that is because
  // the *ground* is gone: a routed garrison is by definition one that lost its sector,
  // and the sector now belongs to the winner.
  assert.equal(
    after.garrisons.find((garrison) => garrison.sectorId === run.invasion.theirs),
    undefined,
    'realm-b still holds a shield on ground it lost',
  );

  // **All three laws are live in this one fixture, and they must be stated apart.**
  // Death takes a body out of the world. Leaving service takes it out of `serving`
  // only and hands it back to the draft as a civilian. And then 06d's transfer hands
  // *those very civilians* to the taker, because they are standing on ground that
  // just changed hands — the consequence the geography/battle grill ruled knowingly
  // when it chose (v) over returning survivors to their origin (record § ruling 6).
  const ceded = run.runtime.view('realm-a').economy.sectors[run.invasion.theirs]?.register ?? 0;
  const fresh = openAtDecision().view('realm-b').economy;
  assert.equal(
    after.economy.register,
    fresh.register - dead - ceded,
    'the register moved by something other than its dead and its ceded civilians',
  );
  assert.equal(after.economy.serving, fresh.serving - shield, 'the whole shield did not leave service');
  // The survivors did leave service rather than die — that is the law under test, and
  // it is visible in `ceded` exceeding what a merely-drained sector could have given.
  assert.ok(ceded > 0, 'the routed survivors vanished instead of becoming civilians');
  for (const [sectorId, row] of Object.entries(after.economy.sectors)) {
    assert.equal(
      row.register,
      row.serving + row.availableCivilians,
      `${sectorId} no longer balances`,
    );
  }
});

// ── ticket 03's case 4, dissolved rather than adjudicated ───────────────────

test('two borders onto one sector are one engagement, at the softest crossing', () => {
  const engagements = engagementsOf(
    ['a', 'b', 's'],
    [
      { key: 'a|s', sectors: ['a', 's'], owners: ['realm-b', 'realm-a'], chokeClass: 'pass' },
      { key: 'b|s', sectors: ['b', 's'], owners: ['realm-b', 'realm-a'], chokeClass: 'open' },
    ],
    // One key, one number. 06c had to sum two borders' shares here; ADR 0046
    // item 4 deleted the need rather than the sum, so there is nothing to merge.
    { 'realm-b': { s: 12 } },
    (sector) => (sector === 's'
      ? standingOf({ holder: 'realm-a', invader: 'realm-b' })
      : EMPTY_STANDING),
  );

  assert.equal(engagements.length, 1, 'a sector was fought over more than once in one turn');
  const [engagement] = engagements;
  assert.equal(engagement.sector, 's');
  assert.deepEqual(engagement.fronts, ['a|s', 'b|s'], 'the merged engagement lost a border');
  // Reachable-weakest-link, still ranging over the sector's *doors* and never over
  // how anyone arrived: the pass is not the window an attacker actually uses.
  assert.equal(engagement.chokeClass, 'open');
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

  // Chips do not carry over (D6.3), so the sector is pressed every turn until the
  // army actually arrives — the arrival turn is the one that spends them. One
  // allocation, not two: the sector is the key, however many borders serve it.
  for (let turn = 0; turn < 6; turn += 1) {
    accepted(runtime, {
      kind: 'allocate-commitment', actor: 'realm-b', sector: 'r7_s0', chips: 12, detachmentIds: [],
    });
    const closing = closeTurn(runtime, 'realm-b');
    const battles = closing.filter((event) => event.type === 'battle-resolved');
    if (battles.length === 0) continue;

    assert.equal(battles.length, 1, 'r7_s0 was fought over twice in one turn');
    const detail = battles[0].detail;
    assert.equal(detail.sector, 'r7_s0');
    assert.deepEqual([...detail.fronts].sort(), [...shared].sort());
    assert.equal(detail.commitments.attacker, 12, 'the sector\'s chips did not reach the battle');
    // open (x1.0 ground) beside river (x0.70 attack) — the softer door wins.
    assert.equal(detail.borderClass, 'open');
    // The claim "both borders were carried into ONE engagement" is the assertion two
    // lines up (`detail.fronts` === both keys) — that is where front-merging is pinned,
    // and it reads the board as the battle found it.
    //
    // Afterwards the two fronts are **gone**, and since 06d that is the correct
    // reading rather than a lost invariant: realm-b took r7_s0, so it now owns both
    // sides of both edges and neither is contested any more. A front is a *contested*
    // border, so winning the ground is exactly how one stops existing.
    const owner = (sectorId) => runtime.view('observer').realms
      .find((realm) => realm.sectors.includes(sectorId)).actor;
    assert.equal(owner('r7_s0'), 'realm-b', 'the fixture did not actually take the sector');
    for (const key of shared) {
      for (const sectorId of key.split('|')) {
        assert.equal(owner(sectorId), 'realm-b', `${sectorId} is not on the winner's side`);
      }
    }
    assert.deepEqual(
      runtime.view('realm-b').fronts.filter((f) => f.sectors.includes('r7_s0')).map((f) => f.key),
      [],
      'an edge inside one realm is still being reported as a front',
    );
    return;
  }
  assert.fail('the army never reached r7_s0');
});

test('the weakest link follows the sealed defensibility order, pass below strait', () => {
  // `open < forest/hills < river < pass < strait`, fixed by the 2026-07-08 fidelity
  // seal and pinned in the archive by `tests/terrain-fidelity.test.js`. Composing
  // the order out of M5 and ADR 0015 instead would put pass *above* strait — the
  // last pair here is the one that catches it.
  const weakestOf = (classes) => engagementsOf(
    ['s'],
    classes.map((chokeClass, index) => ({
      key: `b${index}|s`,
      sectors: [`b${index}`, 's'],
      owners: ['realm-b', 'realm-a'],
      chokeClass,
    })),
    {},
    () => standingOf({ holder: 'realm-a', invader: 'realm-b' }),
  ).find((engagement) => engagement.sector === 's').chokeClass;

  assert.equal(weakestOf(['pass', 'open']), 'open');
  assert.equal(weakestOf(['pass', 'river']), 'river', 'a pass beside a river must yield the river');
  assert.equal(weakestOf(['river', 'forest']), 'forest');
  assert.equal(weakestOf(['strait']), 'strait');
  assert.equal(weakestOf(['strait', 'pass']), 'pass', 'the sealed order puts a pass below a strait');
});
