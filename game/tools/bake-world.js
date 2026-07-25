/**
 * Bakes the terrain-cradle map into a checked-in world artifact.
 *
 * This is an **authoring-time tool**, and it is the path gate 06 D1 sanctions
 * outright: the canonical world is a checked-in artifact the Runtime only reads,
 * and "`map-gen.js` stays a workshop tool whose output is baked into the
 * artifact". Nothing under `game/src/` imports the generator; this file is the
 * only thing that ever loads it, and it runs by hand, never at boot.
 *
 * The reuse basis is **`map-gen.js`, not `map-data.js`** — the latter is C-loop
 * iteration 1, superseded, carries no city markers, and uses a different
 * identifier scheme. Three feature docs point at iteration 2.
 *
 * What this tool *derives* rather than copies:
 *   - intra-region sector adjacency, from hex contact (see below);
 *   - the content-integrity stamp.
 *
 * What it deliberately does not copy: `map-loader.js`'s per-seat summary shape,
 * which discards hexes. Gate 06 D6 names that shape as evidence that must not
 * cross into production.
 *
 * Usage (from the repository root):
 *   npm run build:runtime:game     # content-hash.js must be emitted first
 *   node game/tools/bake-world.js
 *   npm run build:runtime:game     # re-emit with the new artifact
 */

import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { CRADLE_MAP, CRADLE_META } = require('../../mockup/combat-calc/map-gen.js');
const { contentHashOf } = await import('../dist/world/content-hash.js');
// The hex-key and direction constants come from the schema, not a second copy:
// two spellings of "which hex is next to which" is how a map quietly tears.
const { hexKey, HEX_NEIGHBOURS } = await import('../dist/world/schema.js');

const WORLD_ID = 'terrain-cradle';
const REVISION = 'r1';
const SCHEMA_VERSION = 1;
const OUT = fileURLToPath(new URL('../src/world/cradle-r1.ts', import.meta.url));

/**
 * Derives intra-region sector adjacency from the frozen hex layout.
 *
 * Two sectors in the same region are adjacent when any hex of one touches any
 * hex of the other. Inter-region connection is **not** derived here: that is
 * what the authored edge list carries, one representative front-sector pair per
 * border, and inventing extra cross-region links would quietly widen every
 * front the map authored.
 */
function deriveIntraRegionAdjacency(map) {
  const hexOwner = new Map(); // "q,r" -> sectorId
  for (const sector of Object.values(map.sectors)) {
    for (const unit of sector.mapUnits) hexOwner.set(hexKey(unit.q, unit.r), sector.id);
  }

  const adjacency = {};
  for (const id of Object.keys(map.sectors)) adjacency[id] = new Set();

  for (const sector of Object.values(map.sectors)) {
    for (const unit of sector.mapUnits) {
      for (const [dq, dr] of HEX_NEIGHBOURS) {
        const neighbourId = hexOwner.get(hexKey(unit.q + dq, unit.r + dr));
        if (!neighbourId || neighbourId === sector.id) continue;
        if (map.sectors[neighbourId].regionId !== sector.regionId) continue;
        adjacency[sector.id].add(neighbourId);
        adjacency[neighbourId].add(sector.id);
      }
    }
  }

  return Object.fromEntries(
    Object.entries(adjacency).map(([id, set]) => [id, [...set].sort()]),
  );
}

/**
 * Renders a value as TypeScript source.
 *
 * `Infinity` is emitted as the bare identifier, which is the whole reason the
 * artifact is a TS module rather than JSON (gate 06 D2).
 */
function toSource(value, indent = 0) {
  const pad = '  '.repeat(indent);
  const padInner = '  '.repeat(indent + 1);

  if (value === Infinity) return 'Infinity';
  if (value === -Infinity) return '-Infinity';
  if (typeof value === 'number') return Number.isNaN(value) ? 'NaN' : String(value);
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'boolean') return String(value);
  if (value === null) return 'null';

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const compact = value.every((v) => typeof v !== 'object' || v === null);
    if (compact) return `[${value.map((v) => toSource(v, 0)).join(', ')}]`;
    return `[\n${value.map((v) => padInner + toSource(v, indent + 1)).join(',\n')}\n${pad}]`;
  }

  const entries = Object.entries(value);
  if (entries.length === 0) return '{}';
  const compact =
    entries.length <= 4 && entries.every(([, v]) => typeof v !== 'object' || v === null);
  if (compact) {
    return `{ ${entries.map(([k, v]) => `${key(k)}: ${toSource(v, 0)}`).join(', ')} }`;
  }
  return `{\n${entries
    .map(([k, v]) => `${padInner}${key(k)}: ${toSource(v, indent + 1)}`)
    .join(',\n')}\n${pad}}`;
}

const key = (k) => (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k) ? k : JSON.stringify(k));

// --- assemble ---------------------------------------------------------------

const sectorAdjacency = deriveIntraRegionAdjacency(CRADLE_MAP);

const content = {
  schemaVersion: SCHEMA_VERSION,
  worldId: WORLD_ID,
  revision: REVISION,
  regions: CRADLE_MAP.regions,
  sectors: CRADLE_MAP.sectors,
  edges: CRADLE_MAP.edges,
  sectorAdjacency,
  meta: {
    hexR: CRADLE_META.hexR,
    regionCenters: CRADLE_META.regionCenters,
    capitals: CRADLE_META.capitals,
    cities: CRADLE_META.cities,
    pairClass: CRADLE_META.pairClass,
    frontage: CRADLE_META.frontage,
    partialRivers: CRADLE_META.partialRivers,
    rangeHexes: CRADLE_META.rangeHexes,
    massif: CRADLE_META.massif,
  },
};

const artifact = { ...content, contentHash: contentHashOf(content) };

const sectorCount = Object.keys(artifact.sectors).length;
const hexCount = Object.values(artifact.sectors).reduce((n, s) => n + s.mapUnits.length, 0);
const openBorders = artifact.edges.filter((e) => e.choke.cap === Infinity).length;

const source = `/**
 * GENERATED — do not edit by hand.
 *
 * Baked by \`game/tools/bake-world.js\` from the terrain-cradle generator
 * (\`mockup/combat-calc/map-gen.js\`, C-loop iteration 2 — the authoritative map
 * source, per terrain-cradle RULINGS and INDEX and capital INDEX). The generator
 * is a workshop tool; gate 06 D1 bakes its **output** here so that world
 * identity is frozen content rather than a per-boot computation.
 *
 * Editing this file by hand breaks the content-integrity stamp and the loader
 * will refuse it (gate 06 D5 tier 1). To change the world, change the generator
 * or the authoring inputs, bump \`revision\`, and re-bake.
 *
 * This revision: ${artifact.regions.length} regions · ${sectorCount} sectors ·
 * ${artifact.edges.length} edges (${openBorders} of them open, carrying a native
 * \`Infinity\` cap) · ${hexCount} hexes.
 */

import type { WorldArtifact } from './schema.js';

export const CRADLE_R1: WorldArtifact = ${toSource(artifact, 0)};
`;

writeFileSync(OUT, source);

console.log(`baked ${WORLD_ID}@${REVISION} -> ${OUT}`);
console.log(`  ${artifact.regions.length} regions · ${sectorCount} sectors · ${hexCount} hexes`);
console.log(`  ${artifact.edges.length} edges, ${openBorders} open (Infinity cap preserved)`);
console.log(`  contentHash ${artifact.contentHash}`);
