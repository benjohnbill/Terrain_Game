/**
 * Tier-1 validation: the fail-closed load.
 *
 * Gate 06 D5 draws the boundary sharply — **structural and integrity failures
 * block Runtime creation; balance and intent judgments gate publication
 * offline.** So everything here is machine-checkable and everything here
 * *refuses*: a world that fails any check does not produce a degraded match, it
 * produces no match at all.
 *
 * The reason that matters is recorded in the gate itself: the agent-review tier
 * is advisory and "failed this very session when a compaction re-ran a completed
 * batch", which is why revision integrity had to live down here rather than rely
 * on review.
 *
 * Re-implemented from the sealed contract, not translated from the archive
 * (gate 06 D6, ADR 0041): `map-loader.js` collapses the map into a per-seat
 * summary and discards hexes, a shape the seal names as evidence that must not
 * cross into production.
 */

import { contentHashOf } from './content-hash.js';
import { edgeKey, hexKey, SUPPORTED_SCHEMA_VERSION } from './schema.js';
import type { RegionId, SectorId, WorldArtifact } from './schema.js';

/** Freezes an object graph in place. Cycles are not expected in authored content. */
function deepFreeze<T>(value: T): T {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const child of Object.values(value as Record<string, unknown>)) deepFreeze(child);
  return value;
}

export class WorldLoadError extends Error {
  readonly findings: readonly string[];

  constructor(findings: readonly string[]) {
    super(
      `The authored world failed ${findings.length} tier-1 check${findings.length === 1 ? '' : 's'} ` +
        `and was refused:\n  - ${findings.join('\n  - ')}`,
    );
    this.name = 'WorldLoadError';
    this.findings = findings;
  }
}

/** A validated world, plus the indexes every later system would otherwise rebuild. */
export interface LoadedWorld {
  readonly artifact: WorldArtifact;
  /** Region adjacency, derived from the authored edge list. */
  readonly regionAdjacency: Readonly<Record<RegionId, readonly RegionId[]>>;
  /** Total population per region. Every region is authored to the same total. */
  readonly regionPopulation: Readonly<Record<RegionId, number>>;
  /** Total economy per region. Deliberately *not* equal — see the publication gate. */
  readonly regionEconomy: Readonly<Record<RegionId, number>>;
  /** Which region a sector belongs to. */
  readonly sectorRegion: Readonly<Record<SectorId, RegionId>>;
  /** A region's sectors, by id. Kept so callers stop scanning `regions` by hand. */
  readonly regionSectors: Readonly<Record<RegionId, readonly SectorId[]>>;
}

/**
 * Validates an authored world and returns it with its derived indexes, or
 * throws `WorldLoadError` listing **every** finding rather than only the first —
 * an author fixing a bad revision should see the whole picture in one run.
 */
export function loadWorld(artifact: WorldArtifact): LoadedWorld {
  const findings: string[] = [];
  const fail = (message: string) => findings.push(message);

  // --- schema version -------------------------------------------------------
  if (artifact?.schemaVersion !== SUPPORTED_SCHEMA_VERSION) {
    // Nothing below can be trusted to mean what it appears to mean, so stop here.
    throw new WorldLoadError([
      `schema version: expected ${SUPPORTED_SCHEMA_VERSION}, got ${String(artifact?.schemaVersion)}.`,
    ]);
  }

  if (!artifact.worldId || !artifact.revision) {
    fail('identity: both worldId and revision are required and must be non-empty (gate 06 D3).');
  }

  // --- revision content integrity ------------------------------------------
  const expected = contentHashOf(artifact as unknown as Record<string, unknown>);
  if (artifact.contentHash !== expected) {
    fail(
      `revision integrity: content does not match the registered revision ` +
        `"${artifact.revision}" (stamp ${String(artifact.contentHash)}, computed ${expected}). ` +
        'Re-bake with game/tools/bake-world.js and bump the revision — do not edit the artifact by hand.',
    );
  }

  // --- unique ids -----------------------------------------------------------
  const regionIds = new Set<RegionId>();
  for (const region of artifact.regions) {
    if (regionIds.has(region.id)) fail(`duplicate region id "${region.id}".`);
    regionIds.add(region.id);
  }

  const declaredSectorIds = Object.keys(artifact.sectors);
  for (const [id, sector] of Object.entries(artifact.sectors)) {
    if (sector.id !== id) fail(`sector "${id}" carries a mismatched inner id "${sector.id}".`);
  }

  // --- exactly-one region membership ---------------------------------------
  const sectorRegion: Record<SectorId, RegionId> = {};
  const membershipCount = new Map<SectorId, number>();

  for (const region of artifact.regions) {
    for (const sectorId of region.sectorIds) {
      membershipCount.set(sectorId, (membershipCount.get(sectorId) ?? 0) + 1);
      if (!(sectorId in artifact.sectors)) {
        fail(`region "${region.id}" lists sector "${sectorId}", which does not exist.`);
        continue;
      }
      const sector = artifact.sectors[sectorId]!;
      if (sector.regionId !== region.id) {
        fail(`sector "${sectorId}" is listed by region "${region.id}" but claims region "${sector.regionId}".`);
      }
      sectorRegion[sectorId] = region.id;
    }
  }

  for (const sectorId of declaredSectorIds) {
    const count = membershipCount.get(sectorId) ?? 0;
    if (count !== 1) {
      fail(
        count === 0
          ? `sector "${sectorId}" belongs to no region.`
          : `sector "${sectorId}" is claimed by ${count} regions; membership must be exactly one.`,
      );
    }
    const sector = artifact.sectors[sectorId]!;
    if (!regionIds.has(sector.regionId)) {
      fail(`sector "${sectorId}" references region "${sector.regionId}", which does not exist.`);
    }
  }

  // --- map-unit uniqueness --------------------------------------------------
  const hexOwner = new Map<string, SectorId>();
  for (const sectorId of declaredSectorIds) {
    const sector = artifact.sectors[sectorId]!;
    if (sector.mapUnits.length === 0) fail(`sector "${sectorId}" occupies no hexes.`);
    for (const unit of sector.mapUnits) {
      const key = hexKey(unit.q, unit.r);
      const owner = hexOwner.get(key);
      if (owner !== undefined) {
        fail(`hex (${key}) is claimed by both "${owner}" and "${sectorId}"; map units must be unique.`);
      } else {
        hexOwner.set(key, sectorId);
      }
    }
  }

  // --- adjacency: referential, bidirectional, legal --------------------------
  for (const sectorId of declaredSectorIds) {
    if (!(sectorId in artifact.sectorAdjacency)) {
      fail(`sector "${sectorId}" has no adjacency entry.`);
    }
  }

  for (const [sectorId, neighbours] of Object.entries(artifact.sectorAdjacency)) {
    if (!(sectorId in artifact.sectors)) {
      fail(`adjacency names sector "${sectorId}", which does not exist.`);
      continue;
    }
    const seen = new Set<SectorId>();
    for (const neighbour of neighbours) {
      if (neighbour === sectorId) fail(`sector "${sectorId}" is adjacent to itself.`);
      if (seen.has(neighbour)) fail(`sector "${sectorId}" lists neighbour "${neighbour}" twice.`);
      seen.add(neighbour);

      if (!(neighbour in artifact.sectors)) {
        fail(`sector "${sectorId}" is adjacent to "${neighbour}", which does not exist.`);
        continue;
      }
      // One-way adjacency is a legality failure, not a cosmetic one: movement,
      // supply, and reach cones all read this graph, and a one-way edge would
      // make a force able to enter a sector it can never leave.
      if (!artifact.sectorAdjacency[neighbour]?.includes(sectorId)) {
        fail(`adjacency is one-way: "${sectorId}" -> "${neighbour}" has no return edge.`);
      }
      if (sectorRegion[sectorId] !== sectorRegion[neighbour]) {
        // Deliberately fail-closed rather than permissive. Inter-region movement
        // is carried by the authored edge list — one representative front-sector
        // pair per border, with its choke and removal path. A cross-region entry
        // here would open a *second*, undocumented channel between regions that
        // bypasses every choke the map authored, which is a far worse failure
        // than refusing a revision. If a future revision genuinely needs
        // sector-level cross-region contact, that is an edge-model change and
        // belongs in a gate, not in a silently-accepted adjacency row.
        fail(
          `adjacency "${sectorId}" -> "${neighbour}" crosses regions; ` +
            'inter-region connection is carried by the authored edge list, not by sector adjacency.',
        );
      }
    }
  }

  // --- edges: referential, choke data complete, no duplicates ---------------
  const edgeKeys = new Set<string>();
  for (const edge of artifact.edges) {
    const key = edgeKey(edge.a, edge.b);
    if (edgeKeys.has(key)) fail(`duplicate edge "${key}".`);
    edgeKeys.add(key);

    if (!(edge.a in artifact.sectors)) fail(`edge "${key}" references missing sector "${edge.a}".`);
    if (!(edge.b in artifact.sectors)) fail(`edge "${key}" references missing sector "${edge.b}".`);
    if (edge.a === edge.b) fail(`edge "${key}" joins a sector to itself.`);

    const choke = edge.choke;
    if (!choke) {
      fail(`edge "${key}" carries no choke data.`);
      continue;
    }
    if (!choke.class) fail(`edge "${key}" has no choke class.`);
    // `Infinity` is legal and expected on open borders — that is the value the
    // artifact is a TS module in order to preserve. `null`, `undefined`, and
    // `NaN` are not, and a `null` here is the specific JSON-round-trip
    // corruption gate 06 D2 rejected.
    if (typeof choke.cap !== 'number' || Number.isNaN(choke.cap)) {
      fail(
        `edge "${key}" has a non-numeric choke cap (${String(choke.cap)}). ` +
          'An open border must carry a native Infinity, never null (gate 06 D2).',
      );
    } else if (choke.cap <= 0) {
      fail(`edge "${key}" has a non-positive choke cap (${choke.cap}).`);
    }
    if (!choke.removalPath) fail(`edge "${key}" has no removal path.`);
  }

  // --- landmark references --------------------------------------------------
  // Advisory to *placement* (R3), but they still have to point at real sectors:
  // a marker naming a sector that does not exist would break the renderer and
  // any recommendation surface built on it later.
  for (const [label, table] of [
    ['capitals', artifact.meta.capitals],
    ['cities', artifact.meta.cities],
  ] as const) {
    for (const [regionId, sectorId] of Object.entries(table)) {
      if (!regionIds.has(regionId)) fail(`meta.${label} names region "${regionId}", which does not exist.`);
      if (!(sectorId in artifact.sectors)) {
        fail(`meta.${label}["${regionId}"] names sector "${sectorId}", which does not exist.`);
      } else if (sectorRegion[sectorId] !== regionId) {
        fail(`meta.${label}["${regionId}"] names sector "${sectorId}", which sits in another region.`);
      }
    }
  }

  // On D5's "complete seat coverage": **discharged, not skipped.** That check
  // belonged to the multipolar world where seats were an authored property of
  // the map. D4 settled otherwise — "seat binding is a match-setup input, not
  // part of the authored map, and is outside this stability contract" — and the
  // duel pivot replaced fixed seats with a partition drawn per match. Coverage
  // is therefore enforced where it now lives: `partition.ts` guarantees the two
  // realms are non-empty, contiguous, and together cover every region, and
  // fails closed when no such split exists.

  if (findings.length > 0) throw new WorldLoadError(findings);

  // The artifact is public, immutable, authored content, and the projection
  // hands the very same object to viewers rather than copying 292 hexes on every
  // frame. Freezing it once here is what makes that safe: a renderer or a bot
  // cannot reach back and edit the world it was shown.
  deepFreeze(artifact);

  // --- derived indexes ------------------------------------------------------
  const regionAdjacency: Record<RegionId, Set<RegionId>> = {};
  for (const region of artifact.regions) regionAdjacency[region.id] = new Set();
  for (const edge of artifact.edges) {
    const ra = sectorRegion[edge.a]!;
    const rb = sectorRegion[edge.b]!;
    if (ra === rb) continue;
    regionAdjacency[ra]!.add(rb);
    regionAdjacency[rb]!.add(ra);
  }

  const regionPopulation: Record<RegionId, number> = {};
  const regionEconomy: Record<RegionId, number> = {};
  const regionSectors: Record<RegionId, readonly SectorId[]> = {};
  for (const region of artifact.regions) {
    regionPopulation[region.id] = 0;
    regionEconomy[region.id] = 0;
    regionSectors[region.id] = region.sectorIds;
  }
  for (const sectorId of declaredSectorIds) {
    const sector = artifact.sectors[sectorId]!;
    regionPopulation[sector.regionId]! += sector.populationValue;
    regionEconomy[sector.regionId]! += sector.economyValue;
  }

  return {
    artifact,
    regionAdjacency: Object.fromEntries(
      Object.entries(regionAdjacency).map(([id, set]) => [id, [...set].sort()]),
    ),
    regionPopulation,
    regionEconomy,
    sectorRegion,
    regionSectors,
  };
}
