# Define the Authored World Input Contract

Type: grilling
Status: open
Blocked by: 02

## Question

How should the deterministic authored map enter the Game Runtime: what is the
canonical data shape, when is it generated or loaded, which identifiers must
remain stable, what is validated at runtime, and which existing generator,
loader, and gate artifacts are production inputs versus migration evidence?

## Decision constraints

- The L3 durable representation begins with an authored-world identity, so the
  same identity cannot silently resolve to different geography between runs
  ([issue 02](02-define-game-runtime-authority.md)).
- The accepted map is a finite authored artifact, not per-match procedural
  generation. Hexes provide spatial substrate; front sectors are the
  occupation/defense atom; regions and dynamic seat bindings remain distinct
  (`docs/superpowers/specs/2026-07-06-terrain-cradle-map-design.md:52-123`).
- The current `map-gen.js` is explicitly a deterministic prototype that `js/`
  must not import (`mockup/combat-calc/map-gen.js:1-11`). It contains user-baked
  sector swaps and produces regions, sectors, edges, binding, and render meta
  (`mockup/combat-calc/map-gen.js:354-359,564-680`).
- The existing loader intentionally discards map units and adapts the map to an
  L2 realm summary (`mockup/combat-calc/map-loader.js:1-5,39-70`). It is not the
  L3 world loader contract.
- The current gate covers B1/B2 seat viability and binding enumeration, not the
  full structural/schema checks required before Runtime construction
  (`mockup/combat-calc/map-gate.js:11-85`).

## Contract questions this gate must settle

1. Is the canonical input generated at application boot or exported and checked
   in as an authored artifact?
2. Does identity mean a mutable name, or an immutable `(map id, revision)`?
3. Which identifiers survive presentation and rule changes: region, sector,
   map unit, edge/route, capital/city, and seat binding?
4. Which checks fail Runtime creation, and which authoring/balance checks run
   offline before a map revision is admitted?
5. Which prototype behavior is authoritative evidence to reimplement, and which
   prototype shape must not cross into production?

## Evidence-based option space

### A. Export a versioned authored artifact; generate only in authoring tools

Use the current deterministic generator/editor as authoring evidence. Export a
reviewed, checked-in TypeScript/JSON-compatible world artifact with a stable
`worldId`, explicit `revision`, schema version, regions, sectors, map units,
routes/edges, landmarks, and accepted seat binding. The Runtime imports and
validates that artifact; it never runs the prototype generator.

- **Strength:** makes world identity replay-safe, allows diffs and schema
  validation, and separates map authorship from match initialization.
- **Cost:** each accepted geography edit requires an explicit export/revision
  step and parity check against the authoring surface.

### B. Port the deterministic generator into production and run it at boot

- **Strength:** keeps seed rules and the produced map in one executable source.
- **Cost:** makes an authoring algorithm part of the game Runtime contract,
  couples stable identity to generator implementation details, and turns every
  refactor into a potential replay break.

### C. Reuse the legacy province catalog as the production world

- **Strength:** minimal new data plumbing.
- **Cost:** `js/province-data.js` predates the accepted region/sector graph and
  lacks the authored topology the Mission requires
  (`docs/superpowers/specs/2026-07-06-terrain-cradle-map-design.md:10-17`). It
  cannot represent the accepted world without becoming a different artifact.

## Recommended input and validation split

Choose A with these boundaries:

- **Identity:** immutable `(worldId, revision)`; coordinate keys remain stable
  map-unit IDs, existing `rN`/`rN_sN` identifiers remain stable for the first
  revision, and route IDs derive canonically from sorted endpoint IDs or become
  explicit stable IDs. A content change requires a revision change.
- **Load time:** import the checked-in artifact and validate it before Runtime
  state exists. Match setup supplies only the world identity, chosen accepted
  seat binding, and seed.
- **Fail-closed Runtime checks:** schema version, unique IDs, referential
  integrity, exactly-one region/sector membership, map-unit uniqueness,
  bidirectional/legal adjacency, required choke/removal data, complete seat
  coverage, and landmark references.
- **Offline authoring gates:** deterministic export, generator diagnostics,
  B1/B2 viability, viable-binding enumeration, derived-asymmetry checks, and
  manual map-intent review. These decide whether a revision may be published;
  they do not rerun on every match boot.
- **Production versus evidence:** the exported artifact and new TypeScript
  validator/loader are production. `map-gen.js`, `map-loader.js`,
  `map-gate.js`, editor overrides, and their fixtures remain selective evidence
  until equivalent production checks exist; their L2 adapter shapes do not
  become Runtime types.

The honest cost is formal map revisioning and an export gate. That cost is what
makes `(authored world identity, seed, intent log)` a real reproducibility
claim. This recommendation does not resolve the gate; the user must confirm
artifact-versus-runtime generation, identity/revision semantics, and the
validation split.
