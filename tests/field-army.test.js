// tests/field-army.test.js — war-model slice-2 ticket 04 (군 분할·합류)
// Free division and merge as turn actions (spec §4). Split inherits the
// parent's fatigue state; merge takes the size-weighted average — conservation
// of tiredness: for each ledger, ledger × men is invariant across any split/
// merge sequence, so no fatigue laundering exists. Defeat in detail is left to
// battle.js's sealed arithmetic (no special-case rule lives here).
const test = require('node:test');
const assert = require('node:assert/strict');
const FA = require('../js/field-army.js');
const B = require('../js/battle.js');
const Movement = require('../js/movement.js');

// Σ(size × ledger) across a set of armies — the conserved quantity.
const tiredness = (armies, key) => armies.reduce((s, a) => s + a.size * a.fatigue[key], 0);

test('split conserves substance exactly and divides by relative weights', () => {
  const army = { size: 1000, position: '5,5', fatigue: { wear: 4, supply: 1 } };
  const [a, b] = FA.split(army, [1, 1]);
  assert.equal(a.size, 500);
  assert.equal(b.size, 500);
  assert.equal(a.size + b.size, 1000); // exact — the last piece takes the remainder

  const [x, y, z] = FA.split(army, [5, 3, 2]);
  assert.equal(x.size, 500);
  assert.equal(y.size, 300);
  assert.equal(z.size, 200);
  assert.equal(x.size + y.size + z.size, 1000);
});

test('split detachments inherit the parent fatigue state as independent copies', () => {
  const army = { size: 1000, position: '5,5', fatigue: { wear: 4, supply: 1 } };
  const [a, b] = FA.split(army, [1, 1]);
  assert.deepEqual(a.fatigue, { wear: 4, supply: 1 });
  assert.deepEqual(b.fatigue, { wear: 4, supply: 1 });

  // independent copies — mutating one detachment must not touch the other
  a.fatigue.wear = 99;
  assert.equal(b.fatigue.wear, 4);
});

test('detachments hold independent positions and march independently', () => {
  const army = { size: 1000, position: Movement.hexKey(0, 0), fatigue: { wear: 0, supply: 0 } };
  const [a, b] = FA.split(army, [1, 1]);
  assert.equal(a.position, b.position); // shared start hex

  // a small map: a center hex with a passable arm east and west
  const cradleMap = { sectors: { S: { id: 'S', regionId: 'R', mapUnits: [
    { q: 0, r: 0 }, { q: 1, r: 0 }, { q: 2, r: 0 }, { q: -1, r: 0 }, { q: -2, r: 0 },
  ] } } };
  const graph = Movement.buildGraph(cradleMap);

  a.position = Movement.marchStep(graph, a.position, Movement.hexKey(2, 0)).position;
  b.position = Movement.marchStep(graph, b.position, Movement.hexKey(-2, 0)).position;

  assert.equal(a.position, Movement.hexKey(2, 0));
  assert.equal(b.position, Movement.hexKey(-2, 0));
  assert.notEqual(a.position, b.position);
});

test('merge adds substance and takes the size-weighted average of every ledger', () => {
  const x = { size: 300, position: '3,3', fatigue: { wear: 10, supply: 3 } };
  const y = { size: 100, position: '3,3', fatigue: { wear: 2, supply: 0 } };
  const m = FA.merge([x, y], '3,3');
  assert.equal(m.size, 400);
  assert.equal(m.fatigue.wear, 8);      // (300*10 + 100*2)/400
  assert.equal(m.fatigue.supply, 2.25); // (300*3  + 100*0)/400
  assert.equal(m.position, '3,3');
});

test('conservation of tiredness: ledger × men is invariant across any split/merge sequence', () => {
  const army = { size: 1000, position: '0,0', fatigue: { wear: 6, supply: 2 } };
  const wearBefore = tiredness([army], 'wear');     // 6000
  const supplyBefore = tiredness([army], 'supply'); // 2000

  // split three ways, merge two back, split that again, then check the whole set
  const [p, q, r] = FA.split(army, [5, 3, 2]);       // 500, 300, 200
  const pq = FA.merge([p, q], '0,0');                // 800
  const [pq1, pq2] = FA.split(pq, [1, 3]);           // 200, 600
  const all = [pq1, pq2, r];

  assert.equal(all.reduce((s, a) => s + a.size, 0), 1000); // substance exact
  assert.equal(tiredness(all, 'wear'), wearBefore);
  assert.equal(tiredness(all, 'supply'), supplyBefore);
});

test('merge conserves tiredness across diverged detachments (up to float round-off)', () => {
  // The realistic case: detachments that marched different distances (and so
  // ran fatigue.js's convex curve to different depths) carry DIFFERENT wear, so
  // the size-weighted average actually round-trips through divide-then-multiply
  // — unlike the evenly-dividing merge above. Substance stays bit-exact;
  // tiredness is invariant to within float epsilon (Σ(size × ledger) is
  // conserved mathematically; the ~1e-12 round-off is not laundering).
  const a = { size: 637, position: '0,0', fatigue: { wear: 6.7, supply: 2.3 } };
  const b = { size: 363, position: '0,0', fatigue: { wear: 3.1, supply: 0.9 } };
  const wearBefore = tiredness([a, b], 'wear');
  const supplyBefore = tiredness([a, b], 'supply');

  const m = FA.merge([a, b], '0,0');

  assert.equal(m.size, 1000); // substance bit-exact
  assert.ok(Math.abs(tiredness([m], 'wear') - wearBefore) < 1e-9,
    `wear drift ${Math.abs(tiredness([m], 'wear') - wearBefore)}`);
  assert.ok(Math.abs(tiredness([m], 'supply') - supplyBefore) < 1e-9,
    `supply drift ${Math.abs(tiredness([m], 'supply') - supplyBefore)}`);
});

test('defeat in detail emerges from the sealed arithmetic — no special-case rule', () => {
  // Fresh & unlevered on both sides, so R reduces to the size ratio
  // (sidePower = substance when commit 0 / quality 1 / fatigue 1).
  const OURS = 2000, ENEMY = 2000;

  // Concentrated: the whole force meets the concentrated foe once, at parity.
  const concentratedLoss = OURS * B.casualtyFractions(OURS / ENEMY).defender; // R=1 → 0.12

  // Split: the concentrated enemy defeats each half in turn (interior lines).
  const army = { size: OURS, position: '0,0', fatigue: { wear: 0, supply: 0 } };
  const [h1, h2] = FA.split(army, [1, 1]); // 1000, 1000

  const c1 = B.casualtyFractions(ENEMY / h1.size);          // R=2
  const h1Loss = h1.size * c1.defender;
  const enemyAfter = ENEMY * (1 - c1.attacker);             // the enemy bleeds a little
  const h2Loss = h2.size * B.casualtyFractions(enemyAfter / h2.size).defender;
  const splitLoss = h1Loss + h2Loss;

  assert.ok(
    splitLoss > concentratedLoss,
    `defeat in detail: split loss ${splitLoss} should exceed concentrated ${concentratedLoss}`,
  );
});
