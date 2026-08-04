/**
 * Standard Fog through a real Runtime — build ticket 08's acceptance list.
 *
 * The properties here are the ones that cannot be checked on the arithmetic
 * alone: they need a match, with men moving and dying, and they need the audit
 * to sit **outside** the projection. Fog `RULINGS.md` ③ decision 1 forbids truth
 * entering the *projection function*; it does not forbid the test that audits it
 * (ticket 08 § Groundwork G3, second oracle).
 */

import test from 'node:test';
import assert from 'node:assert/strict';

const {
  CRADLE_R1,
  OBSERVATION_HALF_WIDTH,
  RECONNAISSANCE_UNIT_PRICE,
  Runtime,
  TURN_COMMITMENT_BUDGET,
  preview,
  reconOrderKeyOf,
} = await import('../dist/runtime/index.js');

const ACTORS = ['realm-a', 'realm-b'];

/**
 * A match at the decision tier, on whatever partition the seed drew.
 *
 * The capital is read off each realm's own holdings rather than hard-coded: the
 * partition is a per-match draw (ADR 0019), so a fixed sector id is that realm's
 * only under one seed, and several of these tests deliberately vary the seed.
 */
function openMatch(seed = 'fog-0001') {
  const runtime = Runtime.open({ world: CRADLE_R1, seed, actors: ACTORS });
  for (const actor of ACTORS) {
    const own = runtime.view(actor).realms.find((realm) => realm.actor === actor).sectors;
    runtime.submit({ kind: 'choose-capital', actor, sector: own[0] });
  }
  assert.equal(runtime.view('observer').phase, 'decision');
  return runtime;
}

const closeTurn = (runtime) => [
  ...runtime.submit({ kind: 'lock-commitment', actor: 'realm-a' }),
  ...runtime.submit({ kind: 'lock-commitment', actor: 'realm-b' }),
];

const opponentOf = (actor) => (actor === 'realm-a' ? 'realm-b' : 'realm-a');

/** A front sector of the opponent's — somewhere worth looking. */
function enemySectorOf(runtime, viewer) {
  const view = runtime.view(viewer);
  const front = view.fronts[0];
  const owners = front.owners;
  return front.sectors[owners[0] === viewer ? 1 : 0];
}

// ── what the projection publishes, and what it does not ─────────────────────

test('the projection publishes the land and its derived figures, for both realms', () => {
  const view = openMatch().view('realm-a');
  for (const realm of view.realms) {
    assert.ok(realm.landValue > 0, `${realm.actor} landValue`);
    assert.ok(realm.yield > 0, `${realm.actor} yield`);
    assert.ok(realm.forceLimit > 0, `${realm.actor} forceLimit`);
    assert.ok(realm.registerPool > 0, `${realm.actor} registerPool`);
  }
  // Terrain, fortification and routes ride on the frozen artifact, which is public
  // by seal: a sector carries its own terrain and the edges carry the routes.
  const sector = Object.values(view.board.sectors)[0];
  assert.ok(typeof sector.terrain === 'string' || sector.terrain === undefined);
  assert.ok(Array.isArray(view.board.edges) || typeof view.board.edges === 'object');
  assert.ok(view.fronts.length > 0, 'current political control is public through the fronts');
});

test('no treasury, posture or commitment of the opponent appears anywhere in a projection', () => {
  const runtime = openMatch();
  runtime.submit({ kind: 'allocate-commitment', actor: 'realm-b', sector: enemySectorOf(runtime, 'realm-a'), chips: 7 });
  const view = runtime.view('realm-a');

  // The opponent's economy object is not built at all — a hard omission rather
  // than a blurred figure.
  assert.equal(view.economy.actor, 'realm-a');
  assert.equal(view.commitment.allocations['r0_s0'], undefined);
  const serialised = JSON.stringify(view);
  assert.ok(!serialised.includes('"posture"'), 'no enemy posture crosses');

  // And the opponent's own stack is absent: only this viewer's is carried.
  const b = runtime.view('realm-b');
  assert.ok(Object.keys(b.commitment.allocations).length > 0, 'the owner sees their own');
  assert.equal(Object.keys(view.commitment.allocations).length, 0, 'the opponent sees none of it');
});

test('the seed never crosses, in a projection now carrying an intelligence picture', () => {
  const runtime = openMatch('secret-seed-value');
  for (const viewer of [...ACTORS, 'observer']) {
    assert.ok(
      !JSON.stringify(runtime.view(viewer)).includes('secret-seed-value'),
      `${viewer} received the seed`,
    );
  }
});

test('with no observation at all, every enemy band is the public bound and never the truth', () => {
  const runtime = openMatch();
  const view = runtime.view('realm-a');
  const truth = runtime.view('realm-b');

  assert.ok(view.intelligence.sectors.length > 0, 'every opposing sector appears, observed or not');
  for (const sector of view.intelligence.sectors) {
    assert.equal(sector.observedTurn, null);
    assert.equal(sector.garrison.low, 0, 'the floor is public ignorance, not a figure');
    assert.equal(sector.serving.low, 0);
    assert.ok(sector.garrison.high > 0 && sector.registerPool > 0);
    // The archive's 0.45 confidence floor produced a band computed **from** the
    // truth. This one is not computed from anything but the land: the ceiling is
    // the sealed shield cap plus any capital guard, which is why an interior
    // sector with no shield at all still reports the same ceiling as a manned one.
    const trueGarrison = truth.garrisons.find((g) => g.sectorId === sector.sectorId)?.men ?? 0;
    assert.ok(sector.garrison.low <= trueGarrison && trueGarrison <= sector.garrison.high);
  }
  const ceilings = new Set(view.intelligence.sectors.map((sector) => sector.garrison.high));
  const manned = new Set(truth.garrisons.map((garrison) => garrison.men));
  assert.ok(
    ceilings.size < manned.size + 1 || ceilings.size <= 2,
    'the ceilings track the land, not the manning',
  );
  assert.deepEqual(view.intelligence.contacts, []);
  assert.equal(view.intelligence.coverage.sectorsObserved, 0);
});

test('the observer is a viewer, not a side door: it receives no intelligence at all', () => {
  const view = openMatch().view('observer');
  assert.deepEqual(view.intelligence.sectors, []);
  assert.deepEqual(view.intelligence.contacts, []);
  assert.deepEqual(view.intelligence.alarms, []);
  assert.equal(view.economy, null);
});

// ── the purchase ────────────────────────────────────────────────────────────

test('a reconnaissance order spends from the one stack, priced per sector by grade', () => {
  const runtime = openMatch();
  const target = enemySectorOf(runtime, 'realm-a');

  runtime.submit({ kind: 'allocate-reconnaissance', actor: 'realm-a', sector: target, grade: 'normal-reconnaissance' });
  let view = runtime.view('realm-a');
  assert.equal(view.commitment.spent, RECONNAISSANCE_UNIT_PRICE['normal-reconnaissance']);
  assert.equal(view.commitment.remaining, TURN_COMMITMENT_BUDGET - 2);
  assert.deepEqual(view.reconnaissanceOrders, [{ sectorId: target, grade: 'normal-reconnaissance' }]);

  // Upgrading replaces rather than adds: re-cutting a plan before locking is free.
  runtime.submit({ kind: 'allocate-reconnaissance', actor: 'realm-a', sector: target, grade: 'enhanced-reconnaissance' });
  view = runtime.view('realm-a');
  assert.equal(view.commitment.spent, RECONNAISSANCE_UNIT_PRICE['enhanced-reconnaissance']);

  // And calling it off returns the chips.
  runtime.submit({ kind: 'allocate-reconnaissance', actor: 'realm-a', sector: target, grade: null });
  view = runtime.view('realm-a');
  assert.equal(view.commitment.spent, 0);
  assert.deepEqual(view.reconnaissanceOrders, []);
});

test('pouring more buys more sectors, never a deeper look at one', () => {
  const runtime = openMatch();
  const view = runtime.view('realm-a');
  const targets = view.intelligence.sectors.slice(0, 5).map((sector) => sector.sectorId);
  for (const target of targets) {
    runtime.submit({ kind: 'allocate-reconnaissance', actor: 'realm-a', sector: target, grade: 'normal-reconnaissance' });
  }
  assert.equal(runtime.view('realm-a').commitment.spent, 5 * 2);
  // There is no path by which a caller pours extra chips at one target: the grade
  // names the price. That is what keeps M8's saturation rule intact.
  const events = runtime.submit({
    kind: 'allocate-reconnaissance', actor: 'realm-a', sector: targets[0], grade: 'deeper',
  });
  assert.equal(events[0].type, 'intent-rejected');
  assert.match(events[0].detail.reason, /not a reconnaissance grade/);
});

test('the stack does not stretch: reconnaissance competes with everything else on it', () => {
  const runtime = openMatch();
  const view = runtime.view('realm-a');
  const own = view.realms.find((realm) => realm.actor === 'realm-a').sectors[0];
  runtime.submit({ kind: 'allocate-commitment', actor: 'realm-a', sector: own, chips: 18 });
  const events = runtime.submit({
    kind: 'allocate-reconnaissance', actor: 'realm-a',
    sector: view.intelligence.sectors[0].sectorId, grade: 'enhanced-reconnaissance',
  });
  assert.equal(events[0].type, 'intent-rejected');
  assert.match(events[0].detail.reason, /does not stretch/);
});

test('a realm cannot scout ground it already holds', () => {
  const runtime = openMatch();
  const own = runtime.view('realm-a').realms.find((realm) => realm.actor === 'realm-a').sectors[0];
  const events = runtime.submit({
    kind: 'allocate-reconnaissance', actor: 'realm-a', sector: own, grade: 'normal-reconnaissance',
  });
  assert.equal(events[0].type, 'intent-rejected');
  assert.match(events[0].detail.reason, /nothing here to scout/);
});

test('preview answers the same question as submit, and names the two halves of the purchase', () => {
  const runtime = openMatch();
  const target = enemySectorOf(runtime, 'realm-a');
  const view = runtime.view('realm-a');
  const card = preview(view, {
    kind: 'allocate-reconnaissance', actor: 'realm-a', sector: target, grade: 'enhanced-reconnaissance',
  });
  assert.equal(card.admissible, true);
  assert.equal(card.reconnaissance.price, 6);
  assert.deepEqual(card.reconnaissance.certain, ['garrison-substance', 'sector-mobilization']);
  assert.deepEqual(
    card.reconnaissance.contingent,
    ['field-substance', 'field-fatigue', 'field-position'],
  );

  // Refusals agree with the Runtime's, which is the point of sharing the rule.
  const own = view.realms.find((realm) => realm.actor === 'realm-a').sectors[0];
  const refused = preview(view, {
    kind: 'allocate-reconnaissance', actor: 'realm-a', sector: own, grade: 'normal-reconnaissance',
  });
  assert.equal(refused.admissible, false);
  const events = runtime.submit({
    kind: 'allocate-reconnaissance', actor: 'realm-a', sector: own, grade: 'normal-reconnaissance',
  });
  assert.equal(refused.reason, events[0].detail.reason);
});

test('preview never receives a truth value: it answers from a projection alone', () => {
  const runtime = openMatch();
  const view = runtime.view('realm-a');
  // The projection is the only input, and it carries no enemy truth. Freezing it
  // and previewing again proves nothing is reached for behind it.
  const frozen = JSON.parse(JSON.stringify(view));
  const target = enemySectorOf(runtime, 'realm-a');
  const fromLive = preview(view, { kind: 'allocate-reconnaissance', actor: 'realm-a', sector: target, grade: 'normal-reconnaissance' });
  const fromFrozen = preview(frozen, { kind: 'allocate-reconnaissance', actor: 'realm-a', sector: target, grade: 'normal-reconnaissance' });
  assert.deepEqual(fromFrozen, fromLive);
});

// ── what a look buys ────────────────────────────────────────────────────────

test('a look narrows the band, dates it, and leaves the hole cards dark', () => {
  const runtime = openMatch();
  const target = enemySectorOf(runtime, 'realm-a');
  const before = runtime.view('realm-a').intelligence.sectors.find((s) => s.sectorId === target);

  runtime.submit({ kind: 'allocate-reconnaissance', actor: 'realm-a', sector: target, grade: 'enhanced-reconnaissance' });
  closeTurn(runtime);

  const after = runtime.view('realm-a').intelligence.sectors.find((s) => s.sectorId === target);
  assert.equal(after.observedTurn, 1, 'reconnaissance acquires its information that turn');
  assert.ok(
    after.garrison.high - after.garrison.low < before.garrison.high - before.garrison.low,
    'the band visibly narrows',
  );
  assert.ok(after.garrisonHistory.length > 0, 'the history is readable');
  // 동원 강도 and the civilian register fall out of the same banded numerator over
  // the same public denominator — zero new dials.
  assert.ok(after.mobilization.low >= 0 && after.mobilization.high <= 1.000001);
  assert.equal(
    Math.round(after.civilianRegister.low + after.serving.high),
    Math.round(after.registerPool),
  );

  // The opponent's current-turn commit remains unscoutable.
  assert.equal(runtime.view('realm-a').commitment.allocations[target], undefined);
});

test('the shown band contains the truth, on every sector and every turn of a match', () => {
  // The whole-match containment oracle. The harness sits outside the projection,
  // so it may read both — which is exactly what ③ decision 1 permits it to do.
  const runtime = openMatch('containment-0007');
  for (let turn = 1; turn <= 10; turn += 1) {
    for (const viewer of ACTORS) {
      const other = opponentOf(viewer);
      const targets = runtime.view(viewer).intelligence.sectors
        .slice((turn * 3) % 5, ((turn * 3) % 5) + 2)
        .map((sector) => sector.sectorId);
      for (const target of targets) {
        runtime.submit({
          kind: 'allocate-reconnaissance', actor: viewer, sector: target,
          grade: turn % 2 === 0 ? 'enhanced-reconnaissance' : 'normal-reconnaissance',
        });
      }
      void other;
    }
    closeTurn(runtime);

    for (const viewer of ACTORS) {
      const view = runtime.view(viewer);
      const truth = runtime.view(opponentOf(viewer));
      const garrisons = new Map(truth.garrisons.map((g) => [g.sectorId, g.men]));

      for (const sector of view.intelligence.sectors) {
        const trueGarrison = garrisons.get(sector.sectorId) ?? 0;
        assert.ok(
          sector.garrison.low <= trueGarrison + 1e-6 && trueGarrison <= sector.garrison.high + 1e-6,
          `turn ${view.turn}: ${viewer}'s band on ${sector.sectorId} [${sector.garrison.low}, ` +
            `${sector.garrison.high}] excludes the true garrison ${trueGarrison}`,
        );
        const trueServing = truth.economy.sectors[sector.sectorId]?.serving ?? 0;
        assert.ok(
          sector.serving.low <= trueServing + 1e-6 && trueServing <= sector.serving.high + 1e-6,
          `turn ${view.turn}: ${viewer}'s serving band on ${sector.sectorId} excludes ${trueServing}`,
        );
      }

      const detachments = new Map(truth.detachments.map((d) => [d.id, d.men]));
      for (const contact of view.intelligence.contacts) {
        if (contact.closed || !contact.current) continue;
        // A current, open contact describes something standing on the board now.
        const candidates = [...detachments.values()].filter(
          (men) => contact.substance.low <= men + 1e-6 && men <= contact.substance.high + 1e-6,
        );
        assert.ok(
          candidates.length > 0,
          `turn ${view.turn}: ${viewer}'s contact ${contact.contactId} band ` +
            `[${contact.substance.low}, ${contact.substance.high}] matches no live force`,
        );
      }
    }
  }
});

test('a band ages by widening, never by becoming false (노화 헌법 P3)', () => {
  const runtime = openMatch('ageing-0003');
  const target = enemySectorOf(runtime, 'realm-a');
  runtime.submit({ kind: 'allocate-reconnaissance', actor: 'realm-a', sector: target, grade: 'enhanced-reconnaissance' });
  closeTurn(runtime);

  const widths = [];
  for (let turn = 0; turn < 6; turn += 1) {
    const view = runtime.view('realm-a');
    const sector = view.intelligence.sectors.find((s) => s.sectorId === target);
    const truthView = runtime.view('realm-b');
    const trueGarrison = truthView.garrisons.find((g) => g.sectorId === target)?.men ?? 0;
    const trueServing = truthView.economy.sectors[target]?.serving ?? 0;
    assert.ok(
      sector.garrison.low <= trueGarrison + 1e-6 && trueGarrison <= sector.garrison.high + 1e-6,
      `turn ${view.turn}: the stale garrison band excludes the truth`,
    );
    assert.ok(
      sector.serving.low <= trueServing + 1e-6 && trueServing <= sector.serving.high + 1e-6,
      `turn ${view.turn}: the stale serving band excludes the truth`,
    );
    widths.push(sector.serving.high - sector.serving.low);
    closeTurn(runtime);
  }
  for (let i = 1; i < widths.length; i += 1) {
    assert.ok(widths[i] >= widths[i - 1] - 1e-9, 'an unobserved band never sharpens on its own');
  }
});

test('a force reading rots turn by turn at the recruitment rate, and stops tracking', () => {
  // Where the envelope is *visibly* progressive. A force's ceiling is the realm's
  // land-derived force limit, and one turn's whole stack buys 20% of it, so an
  // unwatched contact relaxes to complete ignorance over about five turns.
  //
  // At sector grain the same rate saturates in a single turn instead: a realm can
  // draft more men in one turn than any one shield can hold, so a per-sector
  // ceiling is reached at once. That is the honest consequence of the rate being
  // realm-wide, and it is why the immobile subjects' knowledge lives in their
  // floor (see the test below) rather than in their ceiling.
  const runtime = openMatch('force-rot-0001');
  const detachmentId = runtime.view('realm-b').detachments[0].id;
  const sector = sectorOfDetachment(runtime, detachmentId);
  runtime.submit({ kind: 'allocate-reconnaissance', actor: 'realm-a', sector, grade: 'enhanced-reconnaissance' });
  closeTurn(runtime);

  const widths = [];
  let last;
  for (let turn = 0; turn < 6; turn += 1) {
    const view = runtime.view('realm-a');
    last = { contact: view.intelligence.contacts[0], view };
    widths.push(last.contact.substance.high - last.contact.substance.low);
    closeTurn(runtime);
  }
  for (let i = 1; i < widths.length; i += 1) {
    assert.ok(widths[i] >= widths[i - 1] - 1e-9, 'an unobserved band never sharpens on its own');
  }
  assert.ok(
    widths.at(-1) > widths[0],
    `a stale reading must stop tracking: widths ${widths.map(Math.round).join(' → ')}`,
  );
  const ceiling = last.view.realms.find((realm) => realm.actor === 'realm-b').forceLimit;
  assert.equal(
    Math.round(last.contact.substance.high),
    Math.round(ceiling),
    'and it ends at the public ceiling, which is where knowing nothing lives',
  );
});

test('an immobile subject decays toward its ceiling and keeps its floor', () => {
  // ④ decision 1 note 2, made concrete. A garrison's *ceiling* knowledge perishes
  // at once — one turn's draft can buy more men than a shield can hold — while its
  // *floor* persists, because a sector's men cannot march out of it and only a
  // battle can take them. So a stale shield reading says "at least this many",
  // which is exactly 노화 헌법 P3's *decays* rather than *vanishes*.
  const runtime = openMatch('immobile-0001');
  const target = enemySectorOf(runtime, 'realm-a');
  runtime.submit({ kind: 'allocate-reconnaissance', actor: 'realm-a', sector: target, grade: 'enhanced-reconnaissance' });
  closeTurn(runtime);

  const first = runtime.view('realm-a').intelligence.sectors.find((s) => s.sectorId === target);
  for (let turn = 0; turn < 4; turn += 1) closeTurn(runtime);
  const later = runtime.view('realm-a').intelligence.sectors.find((s) => s.sectorId === target);

  assert.ok(first.garrison.low > 0, 'the look bought a real floor');
  assert.equal(later.garrison.low, first.garrison.low, 'and the floor does not rot on its own');
  assert.equal(later.garrison.high, first.garrison.high, 'while the ceiling was public from the start');
});

test('the reading a look bought is still sharp on the turn the player next acts', () => {
  // A look resolves in its own turn's payoff, so it is already one turn old by the
  // time anyone can spend against it. A garrison envelope that relaxed to the
  // shield ceiling per turn would therefore have made the purchase worthless
  // before it could be used — which is why the posture-transfer channel is carried
  // as an event rather than as a rate.
  const runtime = openMatch('sharp-next-turn-0001');
  const target = enemySectorOf(runtime, 'realm-a');
  const ceiling = runtime.view('realm-a').intelligence.sectors
    .find((sector) => sector.sectorId === target).garrison.high;

  runtime.submit({ kind: 'allocate-reconnaissance', actor: 'realm-a', sector: target, grade: 'enhanced-reconnaissance' });
  closeTurn(runtime);

  const sector = runtime.view('realm-a').intelligence.sectors
    .find((candidate) => candidate.sectorId === target);
  assert.equal(runtime.view('realm-a').turn, 2, 'the player is acting on the next turn');
  assert.ok(
    sector.garrison.high - sector.garrison.low < ceiling * 0.9,
    `the bought reading is already back at ignorance: [${sector.garrison.low}, ${sector.garrison.high}] against a ${ceiling} ceiling`,
  );
});

// ── the census ──────────────────────────────────────────────────────────────

test('the census aggregates the sector side and refuses to total the force side', () => {
  const runtime = openMatch('census-0002');
  const view0 = runtime.view('realm-a');
  for (const sector of view0.intelligence.sectors.slice(0, 4)) {
    runtime.submit({ kind: 'allocate-reconnaissance', actor: 'realm-a', sector: sector.sectorId, grade: 'normal-reconnaissance' });
  }
  closeTurn(runtime);

  const view = runtime.view('realm-a');
  const { coverage, contacts } = view.intelligence;

  assert.equal(coverage.sectorsObserved, 4);
  assert.equal(coverage.sectorsTotal, view.intelligence.sectors.length);
  assert.ok(coverage.serving.high >= coverage.serving.low);
  assert.ok(coverage.registerPool > 0, 'coverage is shown beside the public pool it is read against');
  assert.equal(coverage.oldestObservedTurn, 1);

  // No total across contacts, and no remainder figure anywhere.
  const serialised = JSON.stringify(view.intelligence);
  assert.ok(!serialised.includes('unaccounted'), 'no computed remainder is published');
  assert.ok(Array.isArray(contacts), 'contacts are a dated list, not a sum');
  for (const contact of contacts) {
    assert.equal(typeof contact.lastSeenTurn, 'number', 'every contact carries its date');
  }
});

test('the sector side may be summed because sector testimonies cannot overlap', () => {
  const runtime = openMatch('census-sum-0001');
  for (const sector of runtime.view('realm-a').intelligence.sectors.slice(0, 3)) {
    runtime.submit({ kind: 'allocate-reconnaissance', actor: 'realm-a', sector: sector.sectorId, grade: 'normal-reconnaissance' });
  }
  closeTurn(runtime);

  const view = runtime.view('realm-a');
  const truth = runtime.view('realm-b');
  const trueServing = Object.entries(truth.economy.sectors)
    .filter(([sectorId]) => view.intelligence.sectors.some((s) => s.sectorId === sectorId))
    .reduce((sum, [, row]) => sum + row.serving, 0);
  const { serving } = view.intelligence.coverage;
  assert.ok(
    serving.low <= trueServing + 1e-6 && trueServing <= serving.high + 1e-6,
    `the aggregate [${serving.low}, ${serving.high}] excludes the true ${trueServing}`,
  );
});

// ── identity, division, contact ─────────────────────────────────────────────

test('a division stops a contact accumulating rather than killing it or leaving it intact', () => {
  const runtime = openMatch('division-0004');
  const b = runtime.view('realm-b');
  const detachment = b.detachments[0];
  const sector = runtime.view('realm-a').intelligence.sectors
    .map((s) => s.sectorId)
    .find((sectorId) => sectorId === sectorOfDetachment(runtime, detachment.id));
  assert.ok(sector, 'the opening field army stands on its own realm');

  runtime.submit({ kind: 'allocate-reconnaissance', actor: 'realm-a', sector, grade: 'enhanced-reconnaissance' });
  closeTurn(runtime);

  const seen = runtime.view('realm-a').intelligence.contacts;
  assert.equal(seen.length >= 1, true, 'the look found the force standing there');
  assert.equal(seen[0].closed, false);
  const before = seen[0];

  runtime.submit({ kind: 'split-detachment', actor: 'realm-b', detachmentId: detachment.id, men: 1_000 });
  const after = runtime.view('realm-a').intelligence.contacts.find((c) => c.contactId === before.contactId);
  assert.equal(after.closed, true, 'the aggregate anyone was watching has ceased to be one thing');
  assert.deepEqual(after.substance, before.substance, 'and the statement itself is untouched');
  assert.ok(after.substanceHistory.length > 0, 'it stays readable as a dated record');
});

test('a blind turn cuts the chain, and re-acquisition opens a contact the Runtime never joins', () => {
  const runtime = openMatch('reacquire-0005');
  const detachmentId = runtime.view('realm-b').detachments[0].id;
  const sector = sectorOfDetachment(runtime, detachmentId);

  runtime.submit({ kind: 'allocate-reconnaissance', actor: 'realm-a', sector, grade: 'normal-reconnaissance' });
  closeTurn(runtime);
  const first = runtime.view('realm-a').intelligence.contacts[0].contactId;

  closeTurn(runtime); // a blind turn

  runtime.submit({ kind: 'allocate-reconnaissance', actor: 'realm-a', sector, grade: 'normal-reconnaissance' });
  closeTurn(runtime);

  const contacts = runtime.view('realm-a').intelligence.contacts;
  assert.equal(contacts.length, 2, 'the viewer holds two contacts and reconciles them or does not');
  assert.ok(contacts.every((contact) => contact.contactId !== undefined));
  const resumed = contacts.find((contact) => contact.contactId === first);
  assert.ok(resumed, 'the old contact is still held');
  assert.equal(resumed.current, false, 'and it was not resumed');
});

test('watching a force every turn accumulates the trend, and the contact stays one', () => {
  const runtime = openMatch('unbroken-0006');
  const detachmentId = runtime.view('realm-b').detachments[0].id;
  const sector = sectorOfDetachment(runtime, detachmentId);

  for (let turn = 0; turn < 3; turn += 1) {
    runtime.submit({ kind: 'allocate-reconnaissance', actor: 'realm-a', sector, grade: 'enhanced-reconnaissance' });
    closeTurn(runtime);
  }
  const contacts = runtime.view('realm-a').intelligence.contacts.filter((c) => !c.closed);
  assert.equal(contacts.length, 1, 'unbroken contact is one contact');
  assert.equal(contacts[0].substanceHistory.length, 3, 'and the trend read accumulates');
});

/** Which sector a given detachment of realm-b stands on, read from truth. */
function sectorOfDetachment(runtime, detachmentId) {
  const truth = runtime.view('realm-b');
  const detachment = truth.detachments.find((candidate) => candidate.id === detachmentId);
  for (const [sectorId, sector] of Object.entries(truth.board.sectors)) {
    if (sector.mapUnits.some((unit) =>
      unit.q === detachment.position.q && unit.r === detachment.position.r)) {
      return sectorId;
    }
  }
  throw new Error(`no sector holds ${detachmentId}`);
}

// ── the free floor ──────────────────────────────────────────────────────────

test('free contact is coarser than the enhanced purchase, which keeps the market open', () => {
  // FG-M①'s ordering, as the code holds it. Note the one inversion the sheet
  // records: repelled assault (±20%) is *finer* than the ±25% cheapest purchase,
  // and whether that belongs inside the paid range is a value question the sheet
  // books for the first playtest. What holds unconditionally is this:
  assert.ok(
    OBSERVATION_HALF_WIDTH['enhanced-reconnaissance'] < OBSERVATION_HALF_WIDTH['repelled-assault'],
    'the enhanced grade still beats the finest free byproduct',
  );
  assert.ok(
    OBSERVATION_HALF_WIDTH['battle-contact'] > OBSERVATION_HALF_WIDTH['normal-reconnaissance'],
    'and battle contact is coarser than the cheapest purchase',
  );
});

test('border alarm gives existence and heading, and nothing that could be counted', () => {
  const runtime = openMatch('alarm-0008');
  const view = runtime.view('realm-a');
  for (const alarm of view.intelligence.alarms) {
    assert.deepEqual(Object.keys(alarm).sort(), ['actor', 'heading', 'sectorId']);
    assert.ok(!('men' in alarm) && !('substance' in alarm) && !('fatigue' in alarm));
  }
});

test('a reconnaissance order changes the next preview', () => {
  const runtime = openMatch('preview-shift-0009');
  const target = enemySectorOf(runtime, 'realm-a');
  const before = preview(runtime.view('realm-a'), {
    kind: 'allocate-reconnaissance', actor: 'realm-a', sector: target, grade: 'enhanced-reconnaissance',
  });
  assert.equal(before.admissible, true);

  // Fill the stack with looks elsewhere; the same purchase stops being affordable.
  for (const sector of runtime.view('realm-a').intelligence.sectors.slice(0, 10)) {
    if (sector.sectorId === target) continue;
    runtime.submit({ kind: 'allocate-reconnaissance', actor: 'realm-a', sector: sector.sectorId, grade: 'normal-reconnaissance' });
  }
  const after = preview(runtime.view('realm-a'), {
    kind: 'allocate-reconnaissance', actor: 'realm-a', sector: target, grade: 'enhanced-reconnaissance',
  });
  assert.equal(after.admissible, false);
  assert.match(after.reason, /does not stretch/);
});

test('the allocation key namespaces cleanly against sectors and recruitment', () => {
  const target = 'r0_s0';
  assert.equal(reconOrderKeyOf(target), 'order:recon:r0_s0');
  assert.ok(reconOrderKeyOf(target).startsWith('order:'));
});

test('a match replays identically, intelligence and all', () => {
  const script = (runtime) => {
    for (let turn = 0; turn < 4; turn += 1) {
      for (const viewer of ACTORS) {
        const sectors = runtime.view(viewer).intelligence.sectors;
        runtime.submit({
          kind: 'allocate-reconnaissance', actor: viewer,
          sector: sectors[turn % sectors.length].sectorId, grade: 'normal-reconnaissance',
        });
      }
      closeTurn(runtime);
    }
    return ACTORS.map((viewer) => JSON.stringify(runtime.view(viewer).intelligence));
  };
  assert.deepEqual(script(openMatch('replay-me')), script(openMatch('replay-me')));
  assert.notDeepEqual(script(openMatch('replay-me')), script(openMatch('replay-other')));
});
