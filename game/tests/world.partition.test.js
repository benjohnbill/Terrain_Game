/**
 * The two-realm partition draw.
 *
 * What is checked here is the shape of the *rule*, not a tuned number: that
 * every drawn realm is contiguous and population-equal, that the draw is a pure
 * function of the seed, that different seeds genuinely produce different worlds
 * to play, and that a world with no legal partition stops the match rather than
 * substituting one.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

const { CRADLE_R1, loadWorld, drawPartition, enumerateCandidatePartitions, createRng, PartitionError } =
  await import('../dist/runtime/index.js');

const world = loadWorld(CRADLE_R1);

const connected = (regions) => {
  const members = new Set(regions);
  const seen = new Set([regions[0]]);
  const stack = [regions[0]];
  while (stack.length) {
    const current = stack.pop();
    for (const n of world.regionAdjacency[current]) {
      if (members.has(n) && !seen.has(n)) {
        seen.add(n);
        stack.push(n);
      }
    }
  }
  return seen.size === members.size;
};

test('the candidate set is exactly the contiguous, population-equal splits', () => {
  const candidates = enumerateCandidatePartitions(world);

  // Measured on the authoritative map: 15 unordered five-five splits. Since a
  // second draw decides which side each actor takes, that is the 30 ordered
  // partitions the ticket's finding records.
  assert.equal(candidates.length, 15);

  for (const [a, b] of candidates) {
    assert.equal(a.length + b.length, 10);
    assert.equal(new Set([...a, ...b]).size, 10, 'a region appeared on both sides or on neither');
    assert.ok(connected(a), `${a.join(',')} is not contiguous`);
    assert.ok(connected(b), `${b.join(',')} is not contiguous`);

    const pop = (r) => r.reduce((sum, id) => sum + world.regionPopulation[id], 0);
    assert.ok(Math.abs(pop(a) - pop(b)) < 1e-9, 'population is not equal across the split');
  }
});

test('every candidate is a five-five split, because population forces it', () => {
  // Not a rule anyone wrote: every region is authored at population 6.0, so an
  // uneven region count cannot be population-equal. Worth pinning — if a future
  // revision changes regional population, this is the assumption that breaks.
  for (const [a, b] of enumerateCandidatePartitions(world)) {
    assert.equal(a.length, 5);
    assert.equal(b.length, 5);
  }
});

test('the same seed draws the same partition', () => {
  const a = drawPartition(world, createRng('seed-x'));
  const b = drawPartition(world, createRng('seed-x'));
  assert.deepEqual(a.regions, b.regions);
  assert.deepEqual(a.sectors, b.sectors);
});

test('different seeds give a genuinely different board to play', () => {
  const shapes = new Set();
  for (let i = 0; i < 200; i++) {
    const p = drawPartition(world, createRng(`seed-${i}`));
    shapes.add(p.regions[0].join(','));
  }
  // A draw that collapsed onto a handful of layouts would make "random balanced
  // partition per match" a claim rather than a fact.
  assert.ok(shapes.size >= 20, `only ${shapes.size} distinct realm-A layouts across 200 seeds`);
});

test('a drawn partition is balanced on population and asymmetric on economy', () => {
  let sawEconomyGap = false;
  for (let i = 0; i < 60; i++) {
    const p = drawPartition(world, createRng(`econ-${i}`));
    assert.ok(Math.abs(p.population[0] - p.population[1]) < 1e-9);
    if (Math.abs(p.economy[0] - p.economy[1]) > 0.01) sawEconomyGap = true;
  }
  // SPEC seals the map as balanced on population and asymmetric in geometry
  // *and* economy. If every draw came out economically level, the map would be
  // failing that seal.
  assert.ok(sawEconomyGap, 'no economy asymmetry appeared in 60 draws');
});

test('both sides of a draw are covered, contiguous, and non-empty', () => {
  for (let i = 0; i < 40; i++) {
    const p = drawPartition(world, createRng(`cover-${i}`));
    assert.ok(p.regions[0].length > 0 && p.regions[1].length > 0);
    assert.ok(connected(p.regions[0]));
    assert.ok(connected(p.regions[1]));
    assert.equal(p.sectors[0].length + p.sectors[1].length, 56);
    assert.equal(new Set([...p.sectors[0], ...p.sectors[1]]).size, 56);
  }
});

test('the draw reports how many candidates it chose from', () => {
  assert.equal(drawPartition(world, createRng('report')).candidateCount, 15);
});

test('a world with no legal partition fails closed rather than falling back', () => {
  // Two regions with no edge between them: neither side can be contiguous with
  // the other, and no split is possible at all.
  const stranded = {
    ...world,
    artifact: { ...world.artifact, regions: [{ id: 'x', name: 'x', sizeClass: 'plains', sectorIds: [] }] },
    regionAdjacency: { x: [] },
    regionPopulation: { x: 6 },
    regionEconomy: { x: 6 },
  };

  let error;
  try {
    drawPartition(stranded, createRng('nope'));
  } catch (e) {
    error = e;
  }
  assert.ok(error instanceof PartitionError, `expected PartitionError, got ${error?.name}`);
  assert.match(error.message, /Refusing to start/);
});
