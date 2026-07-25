/**
 * The offline publication gate (gate 06 D5 **tier 2**).
 *
 * Tier 2 is the authoring gate that admits a revision. It runs **once before
 * publication, never per boot** — the boundary D5 draws is that
 * structural/integrity failures block Runtime creation, while balance and intent
 * judgments gate publication offline. So nothing here runs in a match; this is
 * what an author runs before committing a revision.
 *
 * Usage (from the repository root):
 *   npm run build:runtime:game
 *   node game/tools/publish-gate.js
 *
 * Exit codes: 0 admitted · 1 refused · 2 reported-but-unjudged.
 */

import { pathToFileURL } from 'node:url';

const DIST = new URL('../dist/runtime/index.js', import.meta.url);
const { CRADLE_R1, loadWorld, enumerateCandidatePartitions, drawPartition, createRng } = await import(
  pathToFileURL(DIST.pathname).href
);

const world = loadWorld(CRADLE_R1);
const artifact = world.artifact;

console.log(`publication gate — ${artifact.worldId}@${artifact.revision}`);
console.log(`  contentHash ${artifact.contentHash}`);
console.log('');

// --- tier 1 re-run ----------------------------------------------------------
// The load above already refused anything structural. Saying so explicitly
// keeps the report honest about what it did and did not check.
const sectorCount = Object.keys(artifact.sectors).length;
const hexCount = Object.values(artifact.sectors).reduce((n, s) => n + s.mapUnits.length, 0);
console.log('tier 1 (fail-closed load)');
console.log(`  PASS  ${artifact.regions.length} regions · ${sectorCount} sectors · ${artifact.edges.length} edges · ${hexCount} hexes`);
console.log(`  PASS  ${artifact.edges.filter((e) => e.choke.cap === Infinity).length} open borders carry a native Infinity cap`);
console.log('');

// --- viable-binding enumeration, re-cut for two realms -----------------------
const candidates = enumerateCandidatePartitions(world);
const pop = (regions) => regions.reduce((sum, id) => sum + world.regionPopulation[id], 0);
const econ = (regions) => regions.reduce((sum, id) => sum + world.regionEconomy[id], 0);

const imbalances = candidates.map(([a, b]) => Math.abs(pop(a) - pop(b)));
const worstImbalance = imbalances.length ? Math.max(...imbalances) : NaN;
const totalPopulation = Object.values(world.regionPopulation).reduce((a, b) => a + b, 0);

console.log('tier 2 — viable-binding enumeration (two realms)');
console.log(`  candidate partitions       ${candidates.length} unordered (${candidates.length * 2} with side assignment)`);
console.log(`  worst population imbalance ${(worstImbalance / (totalPopulation / 2) * 100).toFixed(3)}%  (absolute ${worstImbalance.toExponential(2)})`);

if (candidates.length === 0) {
  console.error('  REFUSE  no contiguous, population-balanced partition exists.');
  process.exit(1);
}

// The worst-case figure above bounds the space; this is what a real seeded draw
// actually produced. Both are zero on this revision, but by construction rather
// than by coincidence — reporting only the bound would leave that unproven.
const sampled = Array.from({ length: 200 }, (_, i) => drawPartition(world, createRng(`gate-sample-${i}`)));
const achieved = Math.max(...sampled.map((p) => Math.abs(p.population[0] - p.population[1])));
const layouts = new Set(sampled.map((p) => p.regions[0].slice().sort().join(','))).size;
console.log(`  achieved imbalance         ${(achieved / (totalPopulation / 2) * 100).toFixed(3)}% worst over 200 seeded draws`);
console.log(`  distinct layouts drawn     ${layouts} of ${candidates.length * 2} possible`);

// --- derived asymmetry ------------------------------------------------------
// SPEC seals the map as balanced on population and asymmetric in geometry AND
// economy. A gate that drove this to zero would be enforcing the opposite of
// what is sealed, so it is reported, not thresholded.
const econGaps = candidates.map(([a, b]) => Math.abs(econ(a) - econ(b)));
const sectorGaps = candidates.map(
  ([a, b]) =>
    Math.abs(
      a.reduce((n, id) => n + artifact.regions.find((r) => r.id === id).sectorIds.length, 0) -
        b.reduce((n, id) => n + artifact.regions.find((r) => r.id === id).sectorIds.length, 0),
    ),
);

console.log('');
console.log('tier 2 — derived asymmetry (reported, not thresholded)');
console.log(`  economy gap   min ${Math.min(...econGaps).toFixed(2)} · max ${Math.max(...econGaps).toFixed(2)}`);
console.log(`  sector-count  min ${Math.min(...sectorGaps)} · max ${Math.max(...sectorGaps)}`);
console.log(`  region economy totals ${Object.entries(world.regionEconomy).map(([id, v]) => `${id}:${v.toFixed(2)}`).join(' ')}`);

// --- deterministic export ---------------------------------------------------
const first = drawPartition(world, createRng('publish-gate'));
const second = drawPartition(world, createRng('publish-gate'));
const deterministic = JSON.stringify(first.regions) === JSON.stringify(second.regions);

console.log('');
console.log('tier 2 — deterministic export');
console.log(`  ${deterministic ? 'PASS' : 'FAIL'}  the same seed draws the same partition`);
if (!deterministic) process.exit(1);

// --- B1/B2 seat viability ---------------------------------------------------
// Reported rather than reused. The archive's B1 (no all-cap leadership) and B2
// (no one-war-kill by a single neighbour) are real gates, but their recorded
// ~1.7x shieldRatio threshold was authored for **5-seat adjacent-pair
// bindings**. A duel has two realms holding half the world each; the number has
// never been re-cut for that shape, and applying it unchanged would be
// borrowing a threshold from a game this no longer is.
console.log('');
console.log('tier 2 — B1/B2 seat viability');
console.log('  UNJUDGED  the archive threshold (~1.7x shield ratio) was authored for 5-seat');
console.log('            adjacent-pair bindings and has never been re-cut for two realms.');
console.log('            Reporting rather than silently reusing it. Re-cutting the duel-shaped');
console.log('            viability bar is a decision, not an implementation detail.');

console.log('');
console.log('VERDICT  tier 1 passed; tier 2 reported. B1/B2 is unjudged for a two-realm');
console.log('         binding, so this revision is admitted for playtesting and NOT');
console.log('         certified against a viability bar that does not yet exist.');
process.exit(2);
