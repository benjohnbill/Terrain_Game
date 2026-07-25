/**
 * The two-realm partition draw.
 *
 * Gate 08 sealed that each match reuses the cradle terrain under a **random,
 * population-balanced, contiguous two-realm partition** (the ADR 0019 pattern:
 * dynamic assignment, so replayability is owned by fog rather than by an
 * authored start). This module is that draw.
 *
 * **There is no balance-tolerance dial, by measurement.** Every region in the
 * authoritative map is authored to a population total of exactly 6.0 — the
 * generator states the intent in its own header ("parity v5: equal pop totals").
 * So population balance is not something to approximate: it is *achieved
 * exactly* by any even split of the ten regions, and missed by every uneven one.
 * The earlier "balance tolerance trades against variety" finding came from the
 * superseded map and was withdrawn.
 *
 * **Economy is deliberately left unbalanced.** Region economy totals run
 * 4.62–7.50, which is precisely SPEC's seal: balanced on population, "asymmetric
 * in geometry *and* economy". Balancing on economy would contradict SPEC and cut
 * variety at the same time.
 */

import type { Rng } from '../runtime/rng.js';
import type { LoadedWorld } from './load.js';
import type { RegionId, SectorId } from './schema.js';

export class PartitionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PartitionError';
  }
}

export interface Partition {
  /** The two realms' regions, each contiguous, together covering the world. */
  readonly regions: readonly [readonly RegionId[], readonly RegionId[]];
  readonly sectors: readonly [readonly SectorId[], readonly SectorId[]];
  readonly population: readonly [number, number];
  readonly economy: readonly [number, number];
  /** How many candidate partitions the draw chose from. Reported, never assumed. */
  readonly candidateCount: number;
}

/** Population totals this close are the same number; the gap is float noise, not design. */
const POPULATION_EPSILON = 1e-9;

function isConnected(
  members: ReadonlySet<RegionId>,
  adjacency: Readonly<Record<RegionId, readonly RegionId[]>>,
): boolean {
  const start = members.values().next().value;
  if (start === undefined) return false;

  const seen = new Set<RegionId>([start]);
  const stack: RegionId[] = [start];
  while (stack.length > 0) {
    const current = stack.pop()!;
    for (const neighbour of adjacency[current] ?? []) {
      if (members.has(neighbour) && !seen.has(neighbour)) {
        seen.add(neighbour);
        stack.push(neighbour);
      }
    }
  }
  return seen.size === members.size;
}

/**
 * Every partition of the world's regions into two contiguous, non-empty,
 * population-equal halves.
 *
 * Enumerated in full rather than sampled: with ten regions the space is 2^10,
 * and enumerating it is what lets the draw be uniform and the publication gate
 * report an exact candidate count instead of an estimate.
 *
 * Returned in a canonical order so the same world always yields the same list,
 * which is what makes a seeded draw reproducible.
 */
export function enumerateCandidatePartitions(
  world: LoadedWorld,
): readonly (readonly [readonly RegionId[], readonly RegionId[]])[] {
  const regionIds = world.artifact.regions.map((r) => r.id);
  const candidates: [readonly RegionId[], readonly RegionId[]][] = [];

  // Bit 0 of the mask is pinned to side A, which visits each unordered split
  // exactly once. Actor assignment happens afterwards, so pinning costs no variety.
  for (let mask = 0; mask < 1 << (regionIds.length - 1); mask++) {
    const a: RegionId[] = [];
    const b: RegionId[] = [];
    regionIds.forEach((id, index) => {
      const side = index === 0 ? 1 : (mask >> (index - 1)) & 1;
      (side ? a : b).push(id);
    });

    if (a.length === 0 || b.length === 0) continue;

    const popA = a.reduce((sum, id) => sum + world.regionPopulation[id]!, 0);
    const popB = b.reduce((sum, id) => sum + world.regionPopulation[id]!, 0);
    if (Math.abs(popA - popB) > POPULATION_EPSILON) continue;

    if (!isConnected(new Set(a), world.regionAdjacency)) continue;
    if (!isConnected(new Set(b), world.regionAdjacency)) continue;

    candidates.push([a.slice().sort(), b.slice().sort()]);
  }

  candidates.sort((x, y) => (x[0].join() < y[0].join() ? -1 : 1));
  return candidates;
}

/**
 * Draws one partition deterministically from the seed.
 *
 * **Fails closed on an empty candidate set** rather than falling back to a
 * hardcoded split: a world that admits no balanced contiguous partition is an
 * authoring error, and silently substituting a fixed one would hide it behind a
 * playable-looking match.
 *
 * The returned sides are already assigned: a second draw decides which half the
 * first actor takes, so a seed does not merely pick the shape of the world but
 * also which side of it a player starts on.
 */
export function drawPartition(world: LoadedWorld, rng: Rng): Partition {
  const candidates = enumerateCandidatePartitions(world);
  if (candidates.length === 0) {
    throw new PartitionError(
      `World "${world.artifact.worldId}@${world.artifact.revision}" admits no contiguous, ` +
        'population-balanced two-realm partition. Refusing to start rather than ' +
        'falling back to a fixed split.',
    );
  }

  const draw = rng.fork('partition');
  const chosen = candidates[draw.nextInt(candidates.length)]!;
  const flipped = draw.nextInt(2) === 1;
  const [first, second] = flipped ? [chosen[1], chosen[0]] : [chosen[0], chosen[1]];

  const sectorsOf = (regions: readonly RegionId[]): SectorId[] =>
    regions
      .flatMap((id) => world.artifact.regions.find((r) => r.id === id)!.sectorIds)
      .slice()
      .sort();

  const totalOf = (regions: readonly RegionId[], table: Readonly<Record<RegionId, number>>): number =>
    regions.reduce((sum, id) => sum + table[id]!, 0);

  return {
    regions: [first, second],
    sectors: [sectorsOf(first), sectorsOf(second)],
    population: [totalOf(first, world.regionPopulation), totalOf(second, world.regionPopulation)],
    economy: [totalOf(first, world.regionEconomy), totalOf(second, world.regionEconomy)],
    candidateCount: candidates.length,
  };
}
