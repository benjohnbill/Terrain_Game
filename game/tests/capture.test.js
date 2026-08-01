/**
 * Ground changes hands, and then starts paying its taker — ticket 06d.
 *
 * Two subjects, in the order the ticket needs them:
 *
 * 1. **The grain.** The conscription register and a serving force's origin
 *    composition are both keyed by the **sector** (MT-② amended 2026-07-31 for the
 *    register; the user's same-day ruling for origin, amending ADR 0045). The
 *    register's derivation `registerPerPop × Σ populationValue` reads a *sector*
 *    field, and `availableCivilians = register − serving` joins the two on one key,
 *    so both live at the same grain or neither does.
 * 2. **The capture.** A won battle transfers control, `homeland` is the record
 *    written, limbo is the interval before integration (ADR 0044 amending OG-③),
 *    and integration runs the ADR 0022/0029 ripening lag unchanged.
 *
 * **Three laws govern the register and this file states them separately**, because
 * one conservation invariant over all three fails on casualties and reads as a
 * transfer bug (the ticket says so; 06e's rout tests are the worked example):
 *
 * | law | bodies | register |
 * |---|---|---|
 * | casualties (06c) | destroyed | shrinks — permanently, blood is permanent currency (SPEC) |
 * | leaving service (WM-⑤) | leave `serving` | untouched |
 * | transfer (this ticket) | move realm | conserves: what the loser sheds the taker gains |
 *
 * Run against the emitted artifact, never the source (gate 05 D6).
 */

import test from 'node:test';
import assert from 'node:assert/strict';

const {
  CRADLE_R1,
  CONQUEST_DAMAGE,
  FRESH_CAPTURE_USABLE_ECONOMY,
  FRESH_CAPTURE_USABLE_POP,
  GARRISON_PER_BORDER_SECTOR,
  capitalGuardAt,
  garrisonHeadroomOf,
  MARCH_SPEED,
  RIPENING_PER_TURN,
  REGISTER_PER_POP,
  Runtime,
  buildMovementGraph,
  minimumCostRoute,
  musterHexOf,
  preview,
  registerOf,
} = await import('../dist/runtime/index.js');

const GRAPH = buildMovementGraph(CRADLE_R1);

// `turn-0001` is 06c/06e's battle fixture seed, reused deliberately: its partition
// is the one that puts an enemy front sector inside the opening army's first march,
// which is what makes a capture observable in one turn.
function openAtDecision(seed = 'turn-0001', world = CRADLE_R1) {
  const runtime = Runtime.open({ world, seed, actors: ['realm-a', 'realm-b'] });
  // Each realm's first own sector, rather than a hard-coded id: the partition is
  // drawn from the seed, so a named sector is only legal for one of them by luck.
  const setup = runtime.view('observer');
  for (const actor of setup.actors) {
    const sector = setup.realms.find((realm) => realm.actor === actor).sectors[0];
    accepted(runtime, { kind: 'choose-capital', actor, sector });
  }
  return runtime;
}

const ownerOf = (runtime, sectorId) => runtime.view('observer').realms
  .find((realm) => realm.sectors.includes(sectorId))?.actor ?? null;

const lock = (runtime, actor) => runtime.submit({ kind: 'lock-commitment', actor });
const closeTurn = (runtime) => [...lock(runtime, 'realm-a'), ...lock(runtime, 'realm-b')];

/**
 * Compare two yields.
 *
 * Yields are sums of authored thirds and fifths, so the arithmetic lands on
 * 1.1499999999999986 where the algebra says 1.15 — the same float reality that makes
 * `forceLimitOf` round its men. A yield is not rounded (it is money, not people), so
 * the tolerance belongs in the reading rather than in the rule.
 */
const closeTo = (actual, expected, message) => assert.ok(
  Math.abs(actual - expected) < 1e-9,
  `${message}: ${actual} is not ${expected}`,
);

const accepted = (runtime, intent) => {
  const events = runtime.submit(intent);
  assert.notEqual(events[0]?.type, 'intent-rejected', JSON.stringify(events[0]?.detail));
  return events;
};

/** The nearest enemy front sector the opening army can reach in one march. */
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
    best = { mine: own.has(x) ? x : y, theirs, route };
  }
  assert.ok(best !== null, 'this fixture offers the opening army no reachable enemy front sector');
  return { ...best, detachmentId: detachment.id, destination: best.route.at(-1) };
}

/**
 * Take one sector, in one turn, with the opening army — the fixture every capture
 * assertion below is measured on. `chips` 0 already breaks this shield (06e's
 * `sectorFalls` fixture), so the win is not bought with commitment.
 */
function oneTurnCapture() {
  const runtime = openAtDecision();
  const invasion = nearestInvasion(runtime, 'realm-a');
  assert.ok(invasion.route.length - 1 <= MARCH_SPEED, 'this fixture needs a one-turn invasion');

  const before = {
    'realm-a': runtime.view('realm-a'),
    'realm-b': runtime.view('realm-b'),
  };
  accepted(runtime, {
    kind: 'move-detachment', actor: 'realm-a', detachmentId: invasion.detachmentId,
    destinationHex: invasion.destination, forcedMarch: false,
  });
  const closing = closeTurn(runtime);
  const battle = closing.find((event) => event.type === 'battle-resolved');
  assert.ok(battle !== undefined, 'the fixture produced no battle');
  assert.equal(battle.detail.sectorFalls, true, 'this fixture is supposed to break the shield');

  return { runtime, invasion, closing, battle, before };
}

/** Close `count` further turns with no orders — stable turns, by ADR 0022's test. */
function quietTurns(runtime, count) {
  for (let i = 0; i < count; i += 1) closeTurn(runtime);
}

/** Every sector of the world, grouped by the province that contains it. */
function sectorsByProvince() {
  const byProvince = {};
  for (const [sectorId, sector] of Object.entries(CRADLE_R1.sectors)) {
    (byProvince[sector.regionId] ??= []).push(sectorId);
  }
  return byProvince;
}

test('the register is stored per sector, and a province is not one number', () => {
  const economy = openAtDecision().view('realm-a').economy;
  const held = new Set(openAtDecision().view('realm-a').realms
    .find((realm) => realm.actor === 'realm-a').sectors);

  // The keys are sector ids, not province ids — the distinguishing assertion.
  assert.deepEqual(Object.keys(economy.sectors).sort(), [...held].sort());

  for (const [sectorId, row] of Object.entries(economy.sectors)) {
    assert.equal(
      row.register,
      registerOf(CRADLE_R1.sectors, [sectorId]),
      `${sectorId}'s register must be its own populationValue, not a province share`,
    );
  }
});

test('two sectors of one province carry different registers — the variation province grain discarded', () => {
  const economy = openAtDecision().view('realm-a').economy;
  const owned = new Set(Object.keys(economy.sectors));

  const varying = Object.entries(sectorsByProvince())
    .map(([region, sectorIds]) => ({
      region,
      registers: sectorIds
        .filter((sectorId) => owned.has(sectorId))
        .map((sectorId) => economy.sectors[sectorId].register),
    }))
    .filter(({ registers }) => new Set(registers).size > 1);

  assert.ok(
    varying.length > 0,
    'the authored world must contain one province whose sectors differ, or this ruling had no subject',
  );
  // And the province total is still the sum, so nothing was invented by going finer.
  for (const { region, registers } of varying) {
    const sectorIds = sectorsByProvince()[region].filter((sectorId) => owned.has(sectorId));
    assert.equal(
      registers.reduce((sum, men) => sum + men, 0),
      registerOf(CRADLE_R1.sectors, sectorIds),
    );
  }
});

// The `register = serving + civilians` identity itself is pinned at its own home,
// `field-army.test.js` (the opening force model), which this ticket moved to sector
// grain rather than duplicating here.

test('an opening garrison originates in the sector it mans, not in its province', () => {
  const runtime = openAtDecision();
  const view = runtime.view('realm-a');
  const economy = view.economy;
  // The **guard is subtracted, not the sector skipped**. Ticket 07 raises a guard at
  // the capital whose origins are apportioned across the whole realm (capital CP-⑥),
  // so that many of its men are not locally backed *by seal*. But CP-⑦ leaves the
  // register untouched — "the shield's 900 is drawn locally" — so the shield standing
  // with it still owes this claim, and skipping the whole sector would stop asserting
  // it exactly where a capital happens to sit on a border.
  for (const garrison of view.garrisons) {
    const guard = capitalGuardAt(CRADLE_R1.sectors, garrison.sectorId, view.capitals['realm-a']);
    assert.equal(
      economy.sectors[garrison.sectorId].serving >= garrison.men - guard,
      true,
      `${garrison.sectorId}'s shield must be served by its own register`,
    );
  }
});

test('the ripening dials are the sealed ADR 0022/0029 ones, and conquest damage is at identity', () => {
  assert.equal(FRESH_CAPTURE_USABLE_ECONOMY, 0.5);
  assert.equal(FRESH_CAPTURE_USABLE_POP, 0.6);
  assert.equal(RIPENING_PER_TURN, 0.1);
  // A named seam at identity, not an omission: no rule anywhere defines conquest
  // damage, so it goes in at 1.0 so the deferred snowball session lands a value
  // change rather than a redesign.
  assert.equal(CONQUEST_DAMAGE, 1);
});

test('the register is a body count and does not ripen (ADR 0044 item 3)', () => {
  // Guard the seal directly: the ripening dials are productivity-only, so the
  // register constant must not be composed with either of them.
  assert.equal(REGISTER_PER_POP, 1_800);
  assert.notEqual(REGISTER_PER_POP * FRESH_CAPTURE_USABLE_POP, REGISTER_PER_POP);
});

// ── the capture itself ───────────────────────────────────────────────────────

test('a won battle transfers control of the sector', () => {
  const run = oneTurnCapture();
  // 06e left this as "reported and taken by nobody (06d owns the ground)". It is
  // taken now, and that inverted assertion is retired with this ticket.
  assert.equal(ownerOf(run.runtime, run.invasion.theirs), 'realm-a');
  const loser = run.runtime.view('observer').realms.find((realm) => realm.actor === 'realm-b');
  assert.equal(loser.sectors.includes(run.invasion.theirs), false, 'the loser still holds it');
});

test('control moves immediately while the ground pays neither side — limbo is one turn', () => {
  const run = oneTurnCapture();
  const taken = CRADLE_R1.sectors[run.invasion.theirs];

  // ADR 0022: "control and route effects apply immediately". OG-③, as ADR 0044
  // amends it: occupied-but-unintegrated ground counts toward NEITHER side.
  const taker = run.runtime.view('realm-a');
  const loser = run.runtime.view('realm-b');
  assert.equal(taker.realms.find((r) => r.actor === 'realm-a').sectors.includes(run.invasion.theirs), true);

  // The loser's yield falls by the whole sector the same turn (D5.1's immediate half).
  closeTo(
    loser.economy.income,
    run.before['realm-b'].economy.income - taken.economyValue * taken.usableEconomy,
    "the loser's yield did not fall by the whole sector",
  );
  // And the taker's has not risen at all yet.
  closeTo(
    taker.economy.income,
    run.before['realm-a'].economy.income,
    'the taker was paid for ground still in limbo',
  );
});

test('integration ends limbo at the first stable turn, and it starts at the sealed 50/60', () => {
  const run = oneTurnCapture();
  const taken = CRADLE_R1.sectors[run.invasion.theirs];
  const beforeIntegration = run.runtime.view('realm-a').economy;

  // ADR 0022's stable turn: "ends the turn under the same faction, was not contested
  // during that turn, and was not the target of active attack/defense resolution".
  // The capture turn fails all three, so the first stable turn is the next one.
  quietTurns(run.runtime, 1);
  const integrated = run.runtime.view('realm-a').economy;

  closeTo(
    integrated.income - beforeIntegration.income,
    taken.economyValue * FRESH_CAPTURE_USABLE_ECONOMY,
    'a freshly integrated sector must pay half its economy',
  );
  assert.equal(ownerOf(run.runtime, run.invasion.theirs), 'realm-a');
});

test('ripening adds ten percentage points per stable turn and stops at the authored value', () => {
  const run = oneTurnCapture();
  const taken = CRADLE_R1.sectors[run.invasion.theirs];
  const yieldOfTaken = () => {
    const economy = run.runtime.view('realm-a').economy;
    return economy.income;
  };

  quietTurns(run.runtime, 1);
  const atIntegration = yieldOfTaken();
  const readings = [];
  for (let stable = 1; stable <= 6; stable += 1) {
    quietTurns(run.runtime, 1);
    readings.push(yieldOfTaken() - atIntegration);
  }

  // 0.5 -> 0.6 -> 0.7 -> 0.8 -> 0.9 -> 1.0, then flat: the authored value is the
  // ceiling, because ripening restores land toward what it authored and never past it.
  const step = taken.economyValue * RIPENING_PER_TURN;
  const ceiling = taken.economyValue * (taken.usableEconomy - FRESH_CAPTURE_USABLE_ECONOMY);
  for (const [index, gained] of readings.entries()) {
    closeTo(gained, Math.min(ceiling, step * (index + 1)), `stable turn ${index + 1}`);
  }
  closeTo(readings.at(-1), ceiling, 'ripening never reached the authored value');
});

test('the force limit ripens on population while the register does not ripen at all', () => {
  const run = oneTurnCapture();
  const taken = CRADLE_R1.sectors[run.invasion.theirs];
  const before = run.runtime.view('realm-a').economy;
  quietTurns(run.runtime, 1);
  const after = run.runtime.view('realm-a').economy;

  // ADR 0029 names "yield AND military ceiling", so the ceiling ripens too — on the
  // population fraction, which starts three fifths rather than half.
  assert.equal(
    after.forceLimit - before.forceLimit,
    Math.round(600 * taken.populationValue * FRESH_CAPTURE_USABLE_POP),
  );
  // The register moved on the capture turn, at full strength, and is untouched here.
  assert.equal(after.sectors[run.invasion.theirs].register, before.sectors[run.invasion.theirs].register);
});

// ── the register's three laws, stated separately ─────────────────────────────

test('a captured sector carries its own register to the taker, with no formula', () => {
  const run = oneTurnCapture();
  const sector = run.invasion.theirs;
  const takerRow = run.runtime.view('realm-a').economy.sectors[sector];
  assert.ok(takerRow !== undefined, 'the taker gained no register at the sector it took');

  // R17's proportional formula is superseded, not implemented: what arrives is the
  // sector's own civilians, exactly.
  const loserBefore = run.before['realm-b'].economy.sectors[sector];
  const loserAfter = run.runtime.view('realm-b').economy.sectors[sector];
  const survivingShield = loserAfter === undefined ? 0 : loserAfter.register;

  assert.equal(
    takerRow.register,
    loserBefore.availableCivilians,
    'the taker gained something other than the civilians standing there',
  );
  // Every body is accounted for: civilians left, the shield's dead left the world,
  // and whatever shield survived stays on the loser's books.
  const dead = run.battle.detail.casualties.defender;
  assert.equal(loserBefore.register - takerRow.register - survivingShield, dead);
});

test('conservation holds in both directions across the transfer', () => {
  const run = oneTurnCapture();
  const sector = run.invasion.theirs;
  const dead = run.battle.detail.casualties.defender + run.battle.detail.casualties.attacker;

  const totalBefore = run.before['realm-a'].economy.register + run.before['realm-b'].economy.register;
  const totalAfter = run.runtime.view('realm-a').economy.register +
    run.runtime.view('realm-b').economy.register;

  // The only leak permitted anywhere is death (SPEC: blood is permanent currency).
  // A transfer that discarded a body would show up here as an unexplained gap, which
  // is OG-③'s R2 rider asserted rather than intended.
  assert.equal(totalBefore - totalAfter, dead, 'bodies went missing across the capture');

  // And the identity still holds sector by sector, on both sides.
  for (const actor of ['realm-a', 'realm-b']) {
    for (const [sectorId, row] of Object.entries(run.runtime.view(actor).economy.sectors)) {
      assert.equal(
        row.register,
        row.serving + row.availableCivilians,
        `${actor}/${sectorId} no longer balances`,
      );
      assert.ok(row.availableCivilians >= 0, `${actor}/${sectorId} owes civilians`);
    }
  }
});

test('a capture cannot resurrect the dead as the enemy draftees — what R17 protected', () => {
  // R17's proportional formula is gone; the sharp edge it guarded is not. State the
  // edge as what it actually is: **no body is invented, and the dead stay dead.**
  //
  // The tempting statement — "a sector drained of civilians hands over almost
  // nobody" — is FALSE here, and it is false by seal rather than by defect. A routed
  // shield leaves service and stays on the register (WM-⑤), so its survivors land
  // back in *this sector's* civilian pool moments before the ground changes hands.
  // The geography/battle grill ruled that consequence knowingly: (v) "moves routed
  // survivors out of `serving` and into the civilian body count of ground that is
  // about to change hands", and the user confirmed it a second time after ADR 0044
  // was found. So a bled sector can still hand over the men who just stopped being
  // soldiers on it. What it can never do is hand over more bodies than stood there.
  const runtime = openAtDecision();
  const invasion = nearestInvasion(runtime, 'realm-a');
  const sector = invasion.theirs;

  const perPoint = Math.floor(runtime.view('realm-b').economy.forceLimit * 0.01);
  const available = runtime.view('realm-b').economy.sectors[sector].availableCivilians;
  let toDrain = Math.floor(available / perPoint);
  let round = 0;
  while (toDrain > 0) {
    const commit = Math.min(20, toDrain);
    // **Field** posture, not garrison: the shield is already at
    // `GARRISON_PER_BORDER_SECTOR`, so garrison headroom is zero and a garrison order
    // would raise nobody at all. Field recruits still come off this sector's register,
    // which is the whole point — the bodies leave the civilian pool either way.
    runtime.submit({
      kind: 'allocate-recruitment', actor: 'realm-b', requestId: `drain-${round}`,
      sectorId: sector, commit, posture: 'field',
    });
    closeTurn(runtime);
    toDrain -= commit;
    round += 1;
  }

  const drained = runtime.view('realm-b').economy.sectors[sector].availableCivilians;
  assert.ok(drained < available, 'the drain did not actually reduce the sector to fewer bodies');
  const stockBefore = runtime.view('realm-b').economy.sectors[sector].register;

  accepted(runtime, {
    kind: 'move-detachment', actor: 'realm-a', detachmentId: invasion.detachmentId,
    destinationHex: invasion.destination, forcedMarch: false,
  });
  const closing = closeTurn(runtime);
  const battle = closing.find((event) => event.type === 'battle-resolved');

  if (ownerOf(runtime, sector) !== 'realm-a') return; // a fuller shield may hold; nothing to check
  const gained = runtime.view('realm-a').economy.sectors[sector].register;
  const loserLeft = runtime.view('realm-b').economy.sectors[sector]?.register ?? 0;
  const dead = battle.detail.casualties.defender;

  // The bound that actually holds: every body the sector held is either handed over,
  // still in the loser's ranks, or dead. Nothing is created.
  assert.equal(gained + loserLeft + dead, stockBefore, 'the transfer invented or lost bodies');

  // And the nominal reading is never what arrives — the thing ADR 0044 item 4
  // rejected outright, because it would hand a bled sector fresh men.
  assert.ok(
    gained < registerOf(CRADLE_R1.sectors, [sector]),
    `the taker received ${gained} against a nominal ${registerOf(CRADLE_R1.sectors, [sector])}`,
  );
  // The dead specifically did not travel: they are gone from both sides' books.
  assert.ok(dead > 0, 'this fixture was supposed to cost the defender blood');
  assert.ok(gained <= stockBefore - dead, 'the dead came back as the enemy draftees');
});

test('a shield that survives on ground that falls leaves service rather than changing sides', () => {
  // The path the ordinary fixture never takes. `sectorFalls` is `attackerWins`, but
  // `defenderRouted` also needs losses past ROUT_FRACTION — so a narrow win takes the
  // ground with part of the shield still standing, and 06e's rout path never sees
  // those men. `state.garrisons` is keyed by sector, so left alone the taker would
  // count them as its own.
  //
  // Rather than hunt a fixture that wins narrowly, assert the invariant that must
  // hold however the ground falls: after any capture, the taker mans nothing it did
  // not raise, and every body still balances on both sides.
  const run = oneTurnCapture();
  const sector = run.invasion.theirs;

  const takerShield = run.runtime.view('realm-a').garrisons.find((g) => g.sectorId === sector);
  assert.notEqual(takerShield, undefined, 'the taker has no garrison record for ground it holds');
  assert.equal(takerShield.men, 0, 'the taker inherited enemy men with the ground');
  assert.equal(takerShield.pendingMen, 0, 'the taker inherited enemy cohorts still forming');

  // The loser mans nothing there either — a shield is locality-fixed, and the
  // locality is gone (WM-⑤ (v)'s own reasoning).
  assert.equal(
    run.runtime.view('realm-b').garrisons.find((g) => g.sectorId === sector),
    undefined,
  );

  // The conservation that a men-changing-sides bug would break first: the taker's
  // serving at that sector cannot exceed the register it just received.
  for (const actor of ['realm-a', 'realm-b']) {
    const row = run.runtime.view(actor).economy.sectors[sector];
    if (row === undefined) continue;
    assert.ok(row.serving <= row.register, `${actor} serves more men at ${sector} than it has`);
    assert.equal(row.register, row.serving + row.availableCivilians);
  }
});

// ── the two scopes ticket 05 named ───────────────────────────────────────────

test('control sums and holdings sums finally diverge, and both stay right', () => {
  const run = oneTurnCapture();
  const taken = CRADLE_R1.sectors[run.invasion.theirs];
  const taker = run.runtime.view('realm-a').realms.find((realm) => realm.actor === 'realm-a');

  // population/economy are **control** sums: the taker holds the ground from the
  // moment it wins, whatever the ground yet pays.
  const controlled = taker.sectors.map((id) => CRADLE_R1.sectors[id]);
  assert.equal(taker.population, controlled.reduce((sum, s) => sum + s.populationValue, 0));
  assert.equal(taker.economy, controlled.reduce((sum, s) => sum + s.economyValue, 0));
  assert.ok(taker.sectors.includes(run.invasion.theirs));

  // landValue/yield/forceLimit are **holdings** sums, and holdings exclude ground in
  // limbo — so on this turn the two scopes disagree by exactly the taken sector.
  const was = run.before['realm-a'].realms.find((r) => r.actor === 'realm-a');
  closeTo(taker.yield, was.yield, 'holdings paid for ground still in limbo');
  closeTo(
    taker.economy - was.economy,
    taken.economyValue,
    'the control sum did not pick the captured sector up',
  );
});

// ── garrison and field are the same men in two postures (R18 ii) ─────────────

/**
 * Walk the opening army onto one of its own **interior** sectors' muster hexes.
 *
 * Interior rather than border on purpose: M13a seeds shields on border sectors at
 * g₀ = 1.0, i.e. already **at** the local cap, so a border sector has no room to
 * fill and could only be topped up after something drew it down. An interior sector
 * carries no shield at all, which is both the honest place to test filling one and
 * the path where the transfer has to create the garrison record.
 */
function armyOnOwnInterior(runtime = openAtDecision()) {
  const view = runtime.view('realm-a');
  const manned = new Set(view.garrisons.map((garrison) => garrison.sectorId));
  const own = view.realms.find((realm) => realm.actor === 'realm-a').sectors;
  const detachment = view.detachments[0];

  for (const sectorId of own) {
    if (manned.has(sectorId)) continue;
    const destination = musterHexOf(CRADLE_R1, sectorId);
    if (minimumCostRoute(GRAPH, detachment.position, destination) === null) continue;
    accepted(runtime, {
      kind: 'move-detachment', actor: 'realm-a', detachmentId: detachment.id,
      destinationHex: destination, forcedMarch: false,
    });
    for (let turn = 0; turn < 10; turn += 1) {
      closeTurn(runtime);
      const standing = runtime.view('realm-a').detachments.find((d) => d.id === detachment.id);
      if (standing !== undefined &&
          standing.position.q === destination.q && standing.position.r === destination.r) {
        return { runtime, detachmentId: detachment.id, sectorId };
      }
    }
    assert.fail(`the army never reached ${sectorId}`);
  }
  assert.fail('this fixture leaves realm-a no reachable unmanned interior sector');
}

test('field men move into the shield they stand on, and the register never notices', () => {
  const { runtime, detachmentId, sectorId } = armyOnOwnInterior();
  const before = runtime.view('realm-a');
  assert.equal(
    before.garrisons.find((g) => g.sectorId === sectorId),
    undefined,
    'this fixture was supposed to pick an unmanned sector',
  );

  const men = 50;
  assert.equal(
    preview(before, { kind: 'transfer-to-garrison', actor: 'realm-a', detachmentId, men }).admissible,
    true,
  );
  accepted(runtime, { kind: 'transfer-to-garrison', actor: 'realm-a', detachmentId, men });

  const after = runtime.view('realm-a');
  assert.equal(after.garrisons.find((g) => g.sectorId === sectorId).men, men);
  assert.equal(after.economy.field, before.economy.field - men);
  assert.equal(after.economy.garrison, before.economy.garrison + men);
  // Posture is not birth or death: the men were already serving, so `serving` and the
  // register are both untouched. This is the third law again — neither of the other
  // two applies to a man who merely changed what he is standing behind.
  assert.equal(after.economy.serving, before.economy.serving);
  assert.equal(after.economy.register, before.economy.register);
});

test('a transfer moves origin composition exactly, not just the headcount', () => {
  // The opening field army is apportioned across every held sector, so it carries a
  // many-origin composition — which is what makes this checkable at all. Taking the
  // departing and remaining halves from two separate apportionments conserves the
  // *total* while drifting men between origins ({A:3,B:3} split at 1 sums to
  // {A:2,B:4}), and origin composition is joined to the register by
  // `register − serving`, so that drift ends as a negative civilian count.
  const { runtime, detachmentId, sectorId } = armyOnOwnInterior();
  const before = runtime.view('realm-a').economy;
  const servingBefore = Object.fromEntries(
    Object.entries(before.sectors).map(([id, row]) => [id, row.serving]),
  );

  accepted(runtime, { kind: 'transfer-to-garrison', actor: 'realm-a', detachmentId, men: 137 });
  const after = runtime.view('realm-a').economy;

  // A posture change moves men between field and shield, and both are `serving`. So
  // every sector's serving count must be *identical*, origin by origin — the men
  // answer to the same registers they did a moment ago.
  for (const [id, row] of Object.entries(after.sectors)) {
    assert.equal(
      row.serving,
      servingBefore[id],
      `${id}'s serving count moved: a man changed which register he answers to`,
    );
    assert.equal(row.register, row.serving + row.availableCivilians, `${id} no longer balances`);
  }
  assert.equal(after.serving, before.serving);
  assert.notEqual(after.garrison, before.garrison, 'the transfer did not actually happen');
});

test('a transfer is refused past the local shield cap, so no army hides behind M5', () => {
  const { runtime, detachmentId, sectorId } = armyOnOwnInterior();
  const view = runtime.view('realm-a');
  const manned = view.garrisons.find((g) => g.sectorId === sectorId)?.men ?? 0;
  // The guard is *derived* rather than remembered — `garrisonHeadroomOf` takes it as a
  // required argument, and this lane has no compiler: a one-argument call here silently
  // returned `NaN`, which compares false everywhere, so this assertion passed while
  // testing nothing until ticket 07's review caught it.
  const tooMany = garrisonHeadroomOf(
    manned,
    capitalGuardAt(CRADLE_R1.sectors, sectorId, view.capitals['realm-a']),
  ) + 1;
  assert.ok(Number.isInteger(tooMany), 'the cap read as NaN; this test would assert nothing');
  const over = { kind: 'transfer-to-garrison', actor: 'realm-a', detachmentId, men: tooMany };

  assert.equal(preview(view, over).admissible, false, 'preview allowed an over-cap transfer');
  assert.equal(runtime.submit(over)[0].type, 'intent-rejected');
  assert.equal(
    runtime.view('realm-a').garrisons.find((g) => g.sectorId === sectorId)?.men ?? 0,
    manned,
  );
});

test('taking shield men back into the field is HELD, and refused rather than half-done', () => {
  // R18 (ii) grants the direction; implementing it needs a rule for the wear ledger
  // across a posture change that no seal supplies, and the naive reading launders wear
  // for free. So the intent is unwired on purpose — see the Runtime's held docstring
  // and `docs/SYNC-DEBT.md`. This test exists so the hole cannot close by accident.
  const runtime = openAtDecision();
  const shield = runtime.view('realm-a').garrisons[0];
  const held = { kind: 'transfer-to-field', actor: 'realm-a', sector: shield.sectorId, men: 100 };

  assert.equal(runtime.submit(held)[0].type, 'intent-rejected');
  assert.equal(
    runtime.view('realm-a').garrisons.find((g) => g.sectorId === shield.sectorId).men,
    shield.men,
    'a held intent moved men anyway',
  );
});

test('a transfer needs the men to be standing there — distance is the price', () => {
  // R18 (ii) prices a transfer by movement and adds no device of its own, so filling
  // a shield from elsewhere has no meaning: the turns *are* the march.
  const runtime = openAtDecision();
  const view = runtime.view('realm-a');
  const away = { kind: 'transfer-to-garrison', actor: 'realm-a',
    detachmentId: view.detachments[0].id, men: 10 };
  assert.equal(preview(view, away).admissible, false);
  assert.equal(runtime.submit(away)[0].type, 'intent-rejected');
});

test('a posture transfer spends no 행동력', () => {
  const { runtime, detachmentId } = armyOnOwnInterior();
  const before = runtime.view('realm-a').commitment;
  accepted(runtime, { kind: 'transfer-to-garrison', actor: 'realm-a', detachmentId, men: 40 });
  assert.deepEqual(runtime.view('realm-a').commitment, before, 'a transfer billed the stack');
});

// ── ADR 0045 item 7: a cohort still forming when its sector falls ─────────────

test('a garrison cohort still forming when its sector falls is a permanent loss', () => {
  // ADR 0045 item 7: "A captured not-yet-ready cohort is a match-permanent loss: its
  // origin components and the same register shares are removed, without refund,
  // prisoners, or captor-owned substance." Distinct from every other path here — it is
  // the only place a capture *destroys* bodies rather than moving them, so the
  // register shrinks on both sides of the ledger.
  const runtime = openAtDecision();
  const invasion = nearestInvasion(runtime, 'realm-a');
  const sector = invasion.theirs;

  // Raise into the doomed shield on the very turn it is taken. Garrison posture keeps
  // the recruits at that sector, and they are not ready until the next boundary.
  accepted(runtime, {
    kind: 'allocate-recruitment', actor: 'realm-b', requestId: 'doomed',
    sectorId: sector, commit: 1, posture: 'garrison',
  });
  accepted(runtime, {
    kind: 'move-detachment', actor: 'realm-a', detachmentId: invasion.detachmentId,
    destinationHex: invasion.destination, forcedMarch: false,
  });
  const closing = closeTurn(runtime);
  const battle = closing.find((event) => event.type === 'battle-resolved');
  assert.ok(battle !== undefined && battle.detail.sectorFalls, 'the fixture did not take the sector');
  assert.equal(ownerOf(runtime, sector), 'realm-a');

  // Nothing that was forming survives, on either side's books.
  const takerShield = runtime.view('realm-a').garrisons.find((g) => g.sectorId === sector);
  assert.equal(takerShield.pendingMen, 0, 'the taker inherited a cohort it never raised');
  assert.equal(takerShield.men, 0);
  assert.equal(runtime.view('realm-b').garrisons.find((g) => g.sectorId === sector), undefined);

  // And every sector still balances on both sides — the assertion a destroyed cohort
  // whose register share was left standing would break first.
  for (const actor of ['realm-a', 'realm-b']) {
    for (const [id, row] of Object.entries(runtime.view(actor).economy.sectors)) {
      assert.equal(row.register, row.serving + row.availableCivilians, `${actor}/${id}`);
      assert.ok(row.availableCivilians >= 0, `${actor}/${id} owes civilians`);
    }
  }
});
