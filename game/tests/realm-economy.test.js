/**
 * The realm economy and the land-derived decay engine — ticket 05.
 *
 * The sealed shape being checked: income and the military force limit both derive
 * from **currently held** land every turn (OG-① + `capLandFrac 1`/AB-②), occupied
 * land pays neither side (OG-③), the conscription register is a land-derived stock
 * (MT-②), recruitment converts 행동력 linearly at **+1%p of the force limit per
 * point with no per-turn cap** (MT-③ surge exchange rate, ruling R10), and no man
 * is ever added for free (MT-① P1).
 *
 * What is deliberately *not* here: garrison regeneration and the capital guard.
 * Ruling R9 holds the first for ticket 06 (where garrisons first take damage) and
 * the second for ticket 07 (which carries its magnitude conflict).
 *
 * The decay direction is asserted at **rule level** rather than through the
 * Runtime, because nothing in this ticket can take a sector — capture arrives with
 * ticket 06. The rules are the same ones the Runtime calls, so the reading is the
 * engine's, not a stand-in for it.
 *
 * Run against the emitted artifact, never the source (gate 05 D6).
 */

import test from 'node:test';
import assert from 'node:assert/strict';

const {
  CAP_LAND_FRAC,
  CAP_PER_POP,
  CRADLE_R1,
  draftBill,
  draftOrder,
  forceLimitOf,
  GARRISON_PER_BORDER_SECTOR,
  holdsOf,
  incomeOf,
  landValueOf,
  marginalPrice,
  MEN_PER_YIELD,
  ORDER_RECRUIT,
  preview,
  RECRUIT_FRACTION_PER_POINT,
  recruitmentOrderKeyOf,
  REGISTER_PER_POP,
  registerOf,
  Runtime,
  START_FIELD_FRACTION,
  startingTreasuryOf,
  SURGE,
  TREASURY_START_TURNS,
  TURN_COMMITMENT_BUDGET,
} = await import('../dist/runtime/index.js');

const FIXTURE = { world: CRADLE_R1, seed: 'economy-0001', actors: ['realm-a', 'realm-b'] };
const SECTORS = CRADLE_R1.sectors;
/** Real ids from the artifact — a typo'd id would make a Σ test vacuously pass. */
const [A, B, C] = Object.keys(SECTORS);
for (const id of [A, B, C]) assert.ok(SECTORS[id], `fixture sector ${id} exists`);

/** Opens a match and plays the capital beat, so the economy is the subject. */
function openAtDecision(overrides = {}) {
  const runtime = Runtime.open({ ...FIXTURE, ...overrides });
  const setup = runtime.view('observer');
  for (const actor of setup.actors) {
    const sector = setup.realms.find((r) => r.actor === actor).sectors[0];
    runtime.submit({ kind: 'choose-capital', actor, sector });
  }
  return runtime;
}

const allocate = (runtime, actor, front, chips) =>
  runtime.submit({ kind: 'allocate-commitment', actor, front, chips });
const order = (runtime, actor, kind, chips) =>
  runtime.submit({ kind: 'allocate-order', actor, order: kind, chips });
const recruit = (runtime, actor, requestId, sectorId, commit, posture = 'field', extra = {}) =>
  runtime.submit({
    kind: 'allocate-recruitment', actor, requestId, sectorId, commit, posture, ...extra,
  });
const lock = (runtime, actor) => runtime.submit({ kind: 'lock-commitment', actor });

/** Both realms lock with whatever they have allocated, closing one whole turn. */
function turn(runtime) {
  const events = [];
  for (const actor of runtime.view('observer').actors) events.push(...lock(runtime, actor));
  return events;
}

// ── the land readings ────────────────────────────────────────────────────────

test('income is the sum of economyValue x usableEconomy over held sectors', () => {
  const held = [A, B];
  const expected = held.reduce((sum, id) => sum + SECTORS[id].economyValue * SECTORS[id].usableEconomy, 0);
  assert.equal(incomeOf(SECTORS, held), expected);
  assert.equal(incomeOf(SECTORS, []), 0);
});

test('the force limit is land-derived through capLandFrac at its sealed value 1', () => {
  const held = [A, B, C];
  const expected = CAP_PER_POP * held.reduce((s, id) => s + SECTORS[id].populationValue * SECTORS[id].usablePop, 0);
  assert.equal(CAP_LAND_FRAC, 1);
  // Whole men: authored populations are thirds, so the float sum misses the
  // arithmetic by 4e-12 and a fractional soldier is not a ceiling.
  assert.equal(forceLimitOf(SECTORS, held), Math.round(expected));
});

test('the register is land-derived at registerPerPop, and register:cap is exactly the sealed 3.0', () => {
  const held = [A, B, C];
  assert.equal(REGISTER_PER_POP, 1800);
  assert.equal(CAP_PER_POP, 600);
  assert.equal(
    registerOf(SECTORS, held),
    Math.round(REGISTER_PER_POP * held.reduce((s, id) => s + SECTORS[id].populationValue, 0)),
  );
  // The sustain fraction is a third (MT-②) — the derived relationship, not a dial.
  assert.ok(Math.abs(registerOf(SECTORS, held) / forceLimitOf(SECTORS, held) - 3) < 1e-9);
});

test('occupied land is limbo: it pays neither the holder nor the homeland (OG-③)', () => {
  const homeland = { s_own: 'realm-a', s_taken: 'realm-b' };
  // realm-a controls both, but only owns the homeland of one.
  assert.deepEqual(holdsOf(['s_own', 's_taken'], homeland, 'realm-a'), ['s_own']);
  // And the homeland owner, no longer controlling it, holds nothing either.
  assert.deepEqual(holdsOf([], homeland, 'realm-b'), []);
});

test('a realm losing sectors turn after turn shows monotonically falling income and ceiling', () => {
  const homeland = {};
  let controlled = Object.keys(SECTORS).slice(0, 8);
  for (const id of controlled) homeland[id] = 'realm-a';

  const readings = [];
  while (controlled.length > 0) {
    const holds = holdsOf(controlled, homeland, 'realm-a');
    readings.push({ income: incomeOf(SECTORS, holds), limit: forceLimitOf(SECTORS, holds) });
    controlled = controlled.slice(0, -1); // one sector lost each turn, never recaptured
  }

  for (let i = 1; i < readings.length; i += 1) {
    assert.ok(readings[i].income < readings[i - 1].income, `income fell at step ${i}`);
    assert.ok(readings[i].limit < readings[i - 1].limit, `ceiling fell at step ${i}`);
  }
});

test('land value reads value as population plus economy (OG-②), over holds only', () => {
  assert.equal(landValueOf(SECTORS, [A]), SECTORS[A].populationValue + SECTORS[A].economyValue);
  assert.equal(landValueOf(SECTORS, []), 0);
});

// ── the recruitment price curve ──────────────────────────────────────────────

test('the marginal price is flat through the peace band and doubles at the war knee', () => {
  assert.equal(marginalPrice(0), SURGE.base);
  assert.equal(marginalPrice(SURGE.peaceKnee), SURGE.base);
  assert.equal(marginalPrice(SURGE.warKnee), SURGE.base * SURGE.warMult);
  assert.equal(marginalPrice(1), SURGE.base * SURGE.fullMult);
});

test('the base price is the sealed 1 unit = 0.5 yield anchor', () => {
  // M13 seals the unit price; R11 adopts 100 men per unit, so 200 men per yield.
  assert.equal(MEN_PER_YIELD, 200);
  assert.equal(SURGE.base, 1 / MEN_PER_YIELD);
});

test('a draft is billed as the integral over the intensity it crosses, not a step', () => {
  const register = 10_000;
  // Entirely inside the peace band: the integral degenerates to base x men.
  const men = 1_000;
  assert.ok(Math.abs(draftBill(register, 0, men / register) - SURGE.base * men) < 1e-9);

  // Splitting a draft at any point bills the same total — the curve has no cliffs.
  const whole = draftBill(register, 0.3, 0.9);
  const split = draftBill(register, 0.3, 0.58) + draftBill(register, 0.58, 0.9);
  assert.ok(Math.abs(whole - split) < 1e-9);

  // And it escalates: the same body count costs more the deeper it is drawn.
  assert.ok(draftBill(register, 0.8, 0.9) > draftBill(register, 0.3, 0.4));
  assert.equal(draftBill(register, 0.5, 0.5), 0);
});

// ── the draft order ──────────────────────────────────────────────────────────

const roomyRealm = {
  forceLimit: 18_000,
  field: 0,
  garrison: 0,
  register: 54_000,
  treasury: 10_000,
};

test('one action point buys 1%p of the force limit, and nothing caps the turn', () => {
  assert.equal(RECRUIT_FRACTION_PER_POINT, 0.01);
  assert.equal(draftOrder({ ...roomyRealm, chips: 1 }).men, 180);
  assert.equal(draftOrder({ ...roomyRealm, chips: 10 }).men, 1_800);
  // The whole stack is a legal pour: R10 rejected the +10%/turn cap outright.
  assert.equal(draftOrder({ ...roomyRealm, chips: TURN_COMMITMENT_BUDGET }).men, 3_600);
  assert.equal(draftOrder({ ...roomyRealm, chips: 0 }).men, 0);
});

test('a draft is bounded by headroom to the force limit', () => {
  const near = { ...roomyRealm, field: 17_900 };
  assert.equal(draftOrder({ ...near, chips: 20 }).men, 100);
  assert.equal(draftOrder({ ...near, field: 18_000, chips: 20 }).men, 0);
});

test('a draft is bounded by bodies — the register is a finite stock (MT-②)', () => {
  const bled = { ...roomyRealm, register: 9_050, field: 9_000 };
  assert.equal(draftOrder({ ...bled, chips: 20 }).men, 50);
});

test('short money recruits what is affordable rather than refusing the order', () => {
  const poor = { ...roomyRealm, treasury: 1 };
  const result = draftOrder({ ...poor, chips: 20 });
  assert.ok(result.men > 0 && result.men < 3_600);
  assert.ok(result.bill <= poor.treasury + 1e-9);
  // One more man would have been unaffordable — the bound is tight, not a guess.
  assert.ok(draftBill(poor.register, 0, (result.men + 1) / poor.register) > poor.treasury);
});

test('a draft bills both currencies: yield leaves the treasury and bodies leave the pool', () => {
  const result = draftOrder({ ...roomyRealm, chips: 5 });
  assert.ok(result.bill > 0, 'P1 forbids a free man');
  assert.equal(result.men, 900);
});

// ── the engine, wired ────────────────────────────────────────────────────────

test('a match opens with substance derived from the sealed start-state coordinates', () => {
  const runtime = openAtDecision();
  const view = runtime.view('realm-a');
  const realm = view.realms.find((r) => r.actor === 'realm-a');

  const limit = forceLimitOf(SECTORS, realm.sectors);
  assert.equal(view.economy.forceLimit, limit);
  assert.equal(view.economy.field, Math.floor(limit * START_FIELD_FRACTION));
  assert.equal(view.economy.register, registerOf(SECTORS, realm.sectors));
  // TC-⑭: the war chest is derived from the realm's own land, not a flat
  // constant — a per-realm baked value is what that seal forbids.
  assert.equal(view.economy.income, incomeOf(SECTORS, realm.sectors));
  assert.equal(view.economy.treasury, startingTreasuryOf(view.economy.income));
  assert.equal(TREASURY_START_TURNS, 3);

  // g0 = 1.0: every border sector this realm holds starts its shield manned.
  // Deduplicated: one sector can stand on two different region borders, and it
  // is manned once, not twice.
  const borderSectors = new Set(
    view.fronts.flatMap((front) => front.sectors).filter((id) => realm.sectors.includes(id)),
  );
  assert.ok(borderSectors.size > 0);
  assert.equal(view.economy.garrison, borderSectors.size * GARRISON_PER_BORDER_SECTOR);
});

test('income lands in the background tier of the reveal, with no extra submission', () => {
  const runtime = openAtDecision();
  const before = runtime.view('realm-a').economy;
  const events = turn(runtime);

  const kinds = events.map((e) => e.type);
  assert.ok(kinds.includes('realm-recomputed'), 'the recompute reports itself');
  assert.equal(
    events.find((e) => e.type === 'realm-recomputed').detail.tier,
    'background',
    'it folds into the reveal tail rather than opening a screen',
  );
  assert.equal(runtime.view('realm-a').turn, 2);
  assert.equal(runtime.view('realm-a').economy.treasury, before.treasury + before.income);
});

test('recruitment draws from the same 20-chip stack every other order draws from', () => {
  const runtime = openAtDecision();
  const front = runtime.view('realm-a').fronts[0].key;
  const sector = runtime.view('realm-a').realms.find((realm) => realm.actor === 'realm-a').sectors[0];

  assert.equal(allocate(runtime, 'realm-a', front, 14)[0].type, 'commitment-allocated');
  assert.equal(recruit(runtime, 'realm-a', 'reserve', sector, 6)[0].type, 'recruitment-allocated');
  assert.equal(runtime.view('realm-a').commitment.remaining, 0);

  // The 21st chip does not exist, whichever order kind reaches for it.
  const refused = recruit(runtime, 'realm-a', 'reserve', sector, 7)[0];
  assert.equal(refused.type, 'intent-rejected');
  assert.match(refused.detail.reason, /does not stretch/);
});

test('the whole stack may go into recruitment, and it buys 20% of the force limit', () => {
  const runtime = openAtDecision();
  const before = runtime.view('realm-a').economy;
  const sector = runtime.view('realm-a').realms.find((realm) => realm.actor === 'realm-a').sectors[0];
  recruit(runtime, 'realm-a', 'all-in', sector, TURN_COMMITMENT_BUDGET);
  turn(runtime);

  const after = runtime.view('realm-a').economy;
  const ordered = Math.floor(before.forceLimit * RECRUIT_FRACTION_PER_POINT * TURN_COMMITMENT_BUDGET);
  const recruited = after.field - before.field;
  assert.ok(recruited > 0);
  // Whatever bound bit, it was money, bodies or headroom — never a rate cap.
  assert.ok(recruited <= ordered);
  // A short draft means one of the affordability mins bit. On the opening turn it
  // is money — so the test for "no rate cap fired" is that the treasury could not
  // have bought even one more man before this turn's income landed.
  const leftBeforeIncome = after.treasury - before.income;
  const served = before.serving + recruited;
  const oneMoreMan = draftBill(before.register, served / before.register, (served + 1) / before.register);
  assert.ok(
    recruited === ordered || leftBeforeIncome < oneMoreMan,
    'a short draft means an affordability min bit, not that a rate cap fired',
  );
});

test('P1 holds: no path adds a man without billing for him', () => {
  const runtime = openAtDecision();
  const start = runtime.view('realm-a').economy;

  // Ten quiet turns with no recruitment order: nothing regenerates, nothing heals.
  for (let i = 0; i < 10; i += 1) turn(runtime);
  const quiet = runtime.view('realm-a').economy;
  assert.equal(quiet.field, start.field);
  assert.equal(quiet.garrison, start.garrison);
  assert.equal(quiet.register, start.register);

  // And when men do arrive, the treasury pays for exactly them.
  const sector = runtime.view('realm-a').realms.find((realm) => realm.actor === 'realm-a').sectors[0];
  recruit(runtime, 'realm-a', 'paid', sector, 4);
  const before = runtime.view('realm-a').economy;
  turn(runtime);
  const after = runtime.view('realm-a').economy;
  const recruited = after.field - before.field;
  assert.ok(recruited > 0);
  const spent = before.treasury + before.income - after.treasury;
  assert.ok(spent > 0, 'men cost yield');
  assert.ok(Math.abs(spent - draftBill(before.register, before.serving / before.register,
    (before.serving + recruited) / before.register)) < 1e-9);
});

test('recruitment moves bodies civilian to serving; the register itself does not shrink', () => {
  const runtime = openAtDecision();
  const before = runtime.view('realm-a').economy;
  const sector = runtime.view('realm-a').realms.find((realm) => realm.actor === 'realm-a').sectors[0];
  recruit(runtime, 'realm-a', 'conversion', sector, 3);
  turn(runtime);
  const after = runtime.view('realm-a').economy;

  assert.equal(after.register, before.register);
  assert.equal(after.serving - before.serving, after.field - before.field);
  assert.ok(after.mobilization > before.mobilization);
});

test('no forced-termination device exists anywhere in this path', () => {
  const runtime = openAtDecision();
  for (let i = 0; i < 40; i += 1) turn(runtime);
  const view = runtime.view('realm-a');
  assert.equal(view.turn, 41);
  assert.equal(view.phase, 'decision', 'no turn cap, no timeout, no stall timer');
});

// ── the blur seam ────────────────────────────────────────────────────────────

test('a realm reads its own economy exactly and the opponent treasury not at all', () => {
  const runtime = openAtDecision();
  const mine = runtime.view('realm-a');

  assert.equal(mine.economy.actor, 'realm-a');
  assert.ok(mine.economy.treasury >= 0);

  // Land-derived public figures cross for both sides — they are readable off the
  // board and the territory, both of which are public by seal.
  for (const realm of mine.realms) {
    assert.equal(realm.yield, incomeOf(SECTORS, realm.sectors));
    assert.equal(realm.forceLimit, forceLimitOf(SECTORS, realm.sectors));
  }

  // What does not cross: any figure of the opponent's stocks.
  const serialized = JSON.stringify(mine);
  const theirs = runtime.view('realm-b').economy;
  assert.equal(mine.realms.find((r) => r.actor === 'realm-b').treasury, undefined);
  assert.ok(!serialized.includes(`"treasury":${theirs.treasury},"register":${theirs.register}`));
  assert.equal(runtime.view('observer').economy, null, 'the observer is not a side door');
});

test('a sited recruitment request can be previewed by the realm making it, and only by it', () => {
  const runtime = openAtDecision();
  const mine = runtime.view('realm-a');
  const sector = mine.realms.find((realm) => realm.actor === 'realm-a').sectors[0];

  const request = { kind: 'allocate-recruitment', actor: 'realm-a', requestId: 'preview', sectorId: sector, commit: 5, posture: 'field' };
  const card = preview(mine, request);
  assert.equal(card.admissible, true);
  assert.equal(card.recruitment.fulfillment.requestId, 'preview');
  assert.ok(card.recruitment.batch.bill > 0);
  assert.equal(preview(mine, { ...request, commit: 21 }).admissible, false);
  assert.equal(preview(mine, { ...request, actor: 'realm-b' }).admissible, false);
  assert.equal(preview(mine, { ...request, sectorId: 'r1_s0' }).admissible, false);
});

test('recruitment uses stable dynamic keys in the same namespace as fronts', () => {
  assert.equal(ORDER_RECRUIT, 'order:recruit');
  assert.equal(recruitmentOrderKeyOf('north'), 'order:recruit:north');
  const runtime = openAtDecision();
  assert.ok(!runtime.view('realm-a').fronts.some((front) => front.key === recruitmentOrderKeyOf('north')));
});

test('legacy scalar recruitment is rejected with the replacement intent', () => {
  const runtime = openAtDecision();
  const rejected = order(runtime, 'realm-a', 'recruit', 5)[0];
  assert.equal(rejected.type, 'intent-rejected');
  assert.match(rejected.detail.reason, /allocate-recruitment/);
});

test('only the viewer own sorted recruitment plans cross the projection seam', () => {
  const runtime = openAtDecision();
  recruit(runtime, 'realm-a', 'z-last', 'r2_s4', 2, 'garrison');
  recruit(runtime, 'realm-a', 'a-first', 'r2_s0', 1);

  assert.deepEqual(runtime.view('realm-a').recruitmentOrders.map((request) => request.requestId), [
    'a-first',
    'z-last',
  ]);
  assert.deepEqual(runtime.view('realm-b').recruitmentOrders, []);
  assert.deepEqual(runtime.view('observer').recruitmentOrders, []);
  assert.equal(JSON.stringify(runtime.view('realm-b')).includes('z-last'), false);
});

// ── determinism ──────────────────────────────────────────────────────────────

test('the recompute is deterministic for equal seed and intent log', () => {
  const play = () => {
    const runtime = openAtDecision();
    const sectorA = runtime.view('realm-a').realms.find((realm) => realm.actor === 'realm-a').sectors[0];
    const sectorB = runtime.view('realm-b').realms.find((realm) => realm.actor === 'realm-b').sectors[0];
    for (let i = 0; i < 5; i += 1) {
      recruit(runtime, 'realm-a', `a-${i}`, sectorA, 6);
      recruit(runtime, 'realm-b', `b-${i}`, sectorB, 11);
      turn(runtime);
    }
    return runtime.view('realm-a');
  };
  assert.deepEqual(play(), play());
});
