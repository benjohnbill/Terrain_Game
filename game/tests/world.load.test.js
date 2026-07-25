/**
 * Tier-1 validation tests.
 *
 * Every check gate 06 D5 names is exercised by *breaking* the artifact in that
 * one way and asserting the loader refuses. A validator nobody ever saw reject
 * is a validator nobody knows works — and this one guards the seam where a bad
 * world would otherwise produce a playable-looking but wrong match.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

const { CRADLE_R1, loadWorld, WorldLoadError, contentHashOf } = await import(
  '../dist/runtime/index.js'
);

/**
 * A deep, mutable clone that preserves `Infinity` — which `structuredClone` does
 * and `JSON.parse(JSON.stringify(...))` famously does not. The loader is frozen,
 * so a mutable copy is the only way to break it on purpose.
 */
const clone = () => structuredClone(CRADLE_R1);

/** Re-stamps a mutated artifact so a test isolates its own break from the hash check. */
const restamp = (artifact) => {
  artifact.contentHash = contentHashOf(artifact);
  return artifact;
};

/** Node's `assert.throws` does not hand back the error, and the findings matter. */
const caught = (fn) => {
  try {
    fn();
  } catch (error) {
    return error;
  }
  assert.fail('expected the load to be refused, but it succeeded');
};

const refuses = (artifact, pattern) => {
  const error = caught(() => loadWorld(artifact));
  assert.ok(error instanceof WorldLoadError, `expected WorldLoadError, got ${error?.name}: ${error?.message}`);
  assert.match(error.findings.join('\n'), pattern);
};

test('the shipped world loads', () => {
  const world = loadWorld(CRADLE_R1);
  assert.equal(world.artifact.worldId, 'terrain-cradle');
  assert.equal(world.artifact.revision, 'r1');
  assert.equal(world.artifact.regions.length, 10);
  assert.equal(Object.keys(world.artifact.sectors).length, 56);
  assert.equal(world.artifact.edges.length, 17);
});

test('open borders keep a native Infinity cap', () => {
  // The reason gate 06 D2 chose a TS module over JSON. Under JSON these five
  // would arrive as `null` and the most permeable borders in the world would
  // read as the most sealed.
  const open = CRADLE_R1.edges.filter((e) => e.choke.cap === Infinity);
  assert.equal(open.length, 5);
  assert.equal(
    open.every((e) => e.choke.class === 'open'),
    true,
  );
  assert.equal(JSON.parse(JSON.stringify(CRADLE_R1.edges[0])).choke.cap, null);
});

test('every region is authored to the same population, and economy is not', () => {
  const world = loadWorld(CRADLE_R1);
  const pops = Object.values(world.regionPopulation);
  assert.equal(
    pops.every((p) => Math.abs(p - 6) < 1e-9),
    true,
    `expected every region at population 6.0, got ${JSON.stringify(world.regionPopulation)}`,
  );

  // SPEC seals the map as balanced on population and asymmetric in geometry
  // *and* economy, so a spread here is the design rather than a defect.
  const econ = Object.values(world.regionEconomy);
  assert.ok(Math.max(...econ) - Math.min(...econ) > 2);
});

test('intra-region adjacency is present, bidirectional, and stays inside its region', () => {
  const world = loadWorld(CRADLE_R1);
  const { sectorAdjacency, sectors } = world.artifact;

  for (const [id, neighbours] of Object.entries(sectorAdjacency)) {
    for (const neighbour of neighbours) {
      assert.ok(sectorAdjacency[neighbour].includes(id), `${id} -> ${neighbour} is one-way`);
      assert.equal(sectors[neighbour].regionId, sectors[id].regionId);
    }
  }

  // Every multi-sector region must be internally connected, or a force could be
  // stranded inside its own province.
  for (const region of world.artifact.regions) {
    const members = new Set(region.sectorIds);
    const seen = new Set([region.sectorIds[0]]);
    const stack = [region.sectorIds[0]];
    while (stack.length) {
      const current = stack.pop();
      for (const n of sectorAdjacency[current]) {
        if (members.has(n) && !seen.has(n)) {
          seen.add(n);
          stack.push(n);
        }
      }
    }
    assert.equal(seen.size, members.size, `region ${region.id} is internally disconnected`);
  }
});

test('the loaded artifact is frozen — a viewer cannot edit the world it was shown', () => {
  const world = loadWorld(CRADLE_R1);
  assert.equal(Object.isFrozen(world.artifact), true);
  assert.equal(Object.isFrozen(world.artifact.sectors.r1_s0), true);
  assert.throws(() => {
    'use strict';
    world.artifact.sectors.r1_s0.populationValue = 999;
  }, TypeError);
});

// --- fail-closed checks, one break at a time --------------------------------

test('refuses an unsupported schema version', () => {
  const bad = clone();
  bad.schemaVersion = 99;
  refuses(bad, /schema version/);
});

test('refuses a content edit that kept its revision', () => {
  // The check gate 06 D5 says must live in tier 1 rather than rely on review,
  // because the review tier "failed this very session when a compaction re-ran a
  // completed batch".
  const bad = clone();
  bad.sectors.r1_s0.populationValue = 99;
  refuses(bad, /revision integrity/);
});

test('refuses missing identity', () => {
  const bad = restamp(Object.assign(clone(), { revision: '' }));
  refuses(bad, /worldId and revision/);
});

test('refuses a duplicate region id', () => {
  const bad = clone();
  bad.regions.push({ ...bad.regions[0], sectorIds: [] });
  refuses(restamp(bad), /duplicate region id/);
});

test('refuses a sector claimed by two regions', () => {
  const bad = clone();
  bad.regions[1].sectorIds = [...bad.regions[1].sectorIds, 'r1_s0'];
  refuses(restamp(bad), /claimed by 2 regions|membership must be exactly one/);
});

test('refuses a sector that belongs to no region', () => {
  const bad = clone();
  bad.regions[0].sectorIds = bad.regions[0].sectorIds.filter((id) => id !== 'r1_s0');
  refuses(restamp(bad), /belongs to no region/);
});

test('refuses a dangling region -> sector reference', () => {
  const bad = clone();
  bad.regions[0].sectorIds = [...bad.regions[0].sectorIds, 'r1_s99'];
  refuses(restamp(bad), /does not exist/);
});

test('refuses two sectors claiming the same hex', () => {
  const bad = clone();
  const stolen = bad.sectors.r2_s0.mapUnits[0];
  bad.sectors.r1_s0.mapUnits = [...bad.sectors.r1_s0.mapUnits, { ...stolen }];
  refuses(restamp(bad), /map units must be unique/);
});

test('refuses one-way adjacency', () => {
  const bad = clone();
  const [id, neighbours] = Object.entries(bad.sectorAdjacency).find(([, n]) => n.length > 0);
  const dropped = neighbours[0];
  bad.sectorAdjacency[dropped] = bad.sectorAdjacency[dropped].filter((x) => x !== id);
  refuses(restamp(bad), /adjacency is one-way/);
});

test('refuses adjacency that crosses a region boundary', () => {
  const bad = clone();
  bad.sectorAdjacency.r1_s0 = [...bad.sectorAdjacency.r1_s0, 'r2_s0'];
  bad.sectorAdjacency.r2_s0 = [...bad.sectorAdjacency.r2_s0, 'r1_s0'];
  refuses(restamp(bad), /crosses regions/);
});

test('refuses adjacency naming a sector that does not exist', () => {
  const bad = clone();
  bad.sectorAdjacency.r1_s0 = [...bad.sectorAdjacency.r1_s0, 'ghost'];
  refuses(restamp(bad), /adjacent to "ghost", which does not exist/);
});

test('refuses an edge whose choke cap arrived as null', () => {
  // Exactly what a JSON round-trip does to an open border.
  const bad = clone();
  bad.edges[0].choke.cap = null;
  refuses(restamp(bad), /non-numeric choke cap/);
});

test('refuses an edge with no removal path', () => {
  const bad = clone();
  delete bad.edges[1].choke.removalPath;
  refuses(restamp(bad), /no removal path/);
});

test('refuses a duplicate edge', () => {
  const bad = clone();
  bad.edges.push(structuredClone(bad.edges[0]));
  refuses(restamp(bad), /duplicate edge/);
});

test('refuses an edge referencing a missing sector', () => {
  const bad = clone();
  bad.edges[0].a = 'r1_s99';
  refuses(restamp(bad), /references missing sector/);
});

test('refuses a landmark pointing at a sector that does not exist', () => {
  const bad = clone();
  bad.meta.cities.r1 = 'r1_s99';
  refuses(restamp(bad), /meta.cities.*does not exist/);
});

test('reports every finding at once rather than only the first', () => {
  const bad = clone();
  bad.edges[0].choke.cap = null;
  delete bad.edges[1].choke.removalPath;
  bad.sectorAdjacency.r1_s0 = [...bad.sectorAdjacency.r1_s0, 'ghost'];
  const error = caught(() => loadWorld(restamp(bad)));
  assert.ok(error.findings.length >= 3, `expected several findings, got ${error.findings.length}`);
});
