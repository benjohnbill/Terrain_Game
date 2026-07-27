/**
 * The authored-world artifact schema.
 *
 * Authority: Wayfinder gate 06 § Answer D1-D4. The canonical world is a
 * **reviewed, checked-in artifact the Runtime only reads** — it never runs the
 * generator (D1), it ships as a **TS/ESM module rather than JSON** because five
 * edges carry `choke.cap === Infinity` and JSON turns that into `null`, silently
 * inverting open borders into fully-blocked ones (D2), and it is identified by an
 * immutable `(worldId, revision)` pair (D3).
 *
 * Identifier stability is **revision-local** (D4): ids are stable within a
 * revision, not across them. A content edit produces the next revision rather
 * than mutating this one, which is what the queued re-authoring (TC-⑪) will do.
 */

/** Stable within a revision. Region ids are `rN`; sector ids are `rN_sM`. */
export type RegionId = string;

/**
 * A **front sector (전선 구역)** — the operational atom (ADR 0032). Shortened to
 * `Sector` throughout the code after this one full form, per the Vocabulary
 * Law's abbreviation rule. Hexes are its substrate, not a unit of play.
 */
export type SectorId = string;

/** A position on the authored world's pointy-top axial hex grid. */
export interface HexPosition {
  readonly q: number;
  readonly r: number;
}

/** Hex axial coordinates. Hexes are physical space only — values live on sectors. */
export interface MapUnit extends HexPosition {
  readonly terrainLayer: TerrainLayer;
}

/** The six axial directions, in the order the authoring generator used. */
export const HEX_NEIGHBOURS: readonly (readonly [number, number])[] = Object.freeze([
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
] as const);

/**
 * The canonical name for a hex position — the counterpart of `edgeKey`, and the
 * only sanctioned way to index one. Three separate places used to spell this
 * inline, which is exactly how two of them drift apart.
 */
export function hexKey(q: number, r: number): string {
  return `${q},${r}`;
}

export type TerrainLayer =
  | 'plains'
  | 'steppe'
  | 'highland'
  | 'desert'
  | 'oasis'
  | 'mountain'
  | 'river-valley';

/** Border classes, per the sealed door table. `open` is the unbounded case. */
export type ChokeClass = 'open' | 'river' | 'pass' | 'forest' | 'hills' | 'strait';

export interface Choke {
  readonly class: ChokeClass;
  /**
   * Projectable-mass ceiling across this border. **`Infinity` for open borders**
   * — the native value gate 06 D2 exists to preserve. A loader that saw `null`
   * here would read the most permeable border in the world as the most sealed.
   */
  readonly cap: number;
  readonly removalPath: string;
}

export interface Sector {
  readonly id: SectorId;
  readonly regionId: RegionId;
  readonly economyValue: number;
  readonly populationValue: number;
  readonly usableEconomy: number;
  readonly usablePop: number;
  readonly fortTier: string;
  readonly garrison: number;
  /** The hexes this sector occupies. Never discarded — see gate 06 D6. */
  readonly mapUnits: readonly MapUnit[];
}

export interface Region {
  readonly id: RegionId;
  readonly name: string;
  readonly sizeClass: string;
  readonly sectorIds: readonly SectorId[];
}

/**
 * A border between two regions, carried at its representative front-sector pair.
 *
 * Edges carry **no independent id** and derive canonically from sorted endpoint
 * ids, `min|max` (gate 06 D4). `edgeKey` below is that derivation, and it is the
 * only sanctioned way to name an edge.
 */
export interface Edge {
  readonly a: SectorId;
  readonly b: SectorId;
  readonly choke: Choke;
  readonly frontageHexes: number;
}

/** The canonical edge name: sorted endpoints joined by `|`. */
export function edgeKey(a: SectorId, b: SectorId): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

/** Authored content that is map material rather than rule input. */
export interface WorldMeta {
  readonly hexR: number;
  readonly regionCenters: Readonly<Record<RegionId, { readonly x: number; readonly y: number }>>;
  /**
   * Authored capital and city markers.
   *
   * **Advisory, not a constraint** (ruling R3, SEALED 2026-07-25): capital
   * eligibility is *ownership* — a player may place their capital on any sector
   * their realm owns. These tables stay in the artifact as authored map content
   * and are the natural material for the recommendation surface the user
   * deferred; nothing may gate placement on them.
   */
  readonly capitals: Readonly<Record<RegionId, SectorId>>;
  readonly cities: Readonly<Record<RegionId, SectorId>>;
  readonly pairClass: Readonly<Record<string, ChokeClass>>;
  readonly frontage: Readonly<Record<string, number>>;
  /** Visual river segments along an otherwise-open border (invasion-corridor authoring). */
  readonly partialRivers: Readonly<Record<string, readonly string[]>>;
  readonly rangeHexes: readonly { readonly q: number; readonly r: number; readonly x: number; readonly y: number }[];
  readonly massif: {
    readonly hexes: readonly { readonly q: number; readonly r: number; readonly x: number; readonly y: number }[];
    readonly cx: number;
    readonly cy: number;
    readonly label: string;
  };
}

export interface WorldArtifact {
  readonly schemaVersion: number;
  readonly worldId: string;
  readonly revision: string;
  /**
   * Integrity stamp over this artifact's content, excluding this field.
   *
   * Gate 06 D5 tier 1 requires a **revision content-integrity check** — the
   * loaded content must match the registered revision — and says outright why it
   * lives in tier 1 rather than tier 3: the agent-review tier is advisory and
   * "failed this very session when a compaction re-ran a completed batch". A
   * hand-edited artifact that kept its revision string would otherwise replay
   * differently under the same identity.
   */
  readonly contentHash: string;
  readonly regions: readonly Region[];
  readonly sectors: Readonly<Record<SectorId, Sector>>;
  readonly edges: readonly Edge[];
  /**
   * Explicit **intra-region** sector adjacency, bidirectional.
   *
   * The generator's edge list carries only one representative sector pair per
   * *region* border; adjacency between sectors inside a region existed only
   * implicitly in hex coordinates. Sector-level movement, supply, and reach cones
   * need it explicit, and gate 06 D5 tier 1 requires bidirectional legal
   * adjacency — so it is derived once from the frozen hex layout (TC-⑪) and baked
   * into the revision. This is assembly from existing geometry, not a new rule.
   */
  readonly sectorAdjacency: Readonly<Record<SectorId, readonly SectorId[]>>;
  readonly meta: WorldMeta;
}

/** The schema version this build understands. A mismatch fails the load closed. */
export const SUPPORTED_SCHEMA_VERSION = 1;
