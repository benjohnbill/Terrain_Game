# Define the Authored World Input Contract

Type: grilling
Status: resolved
Blocked by: 02

## Question

How should the deterministic authored map enter the Game Runtime: what is the
canonical data shape, when is it generated or loaded, which identifiers must
remain stable, what is validated at runtime, and which existing generator,
loader, and gate artifacts are production inputs versus migration evidence?

## Answer

Adopt option A: the authored world enters the Runtime as an exported, checked-in
artifact that the Runtime imports and validates; the deterministic generator and
editor stay authoring-only tools. Boot-time generation (B) and the legacy
province catalog (C) are rejected — B couples world identity to generator
implementation, so a refactor can silently break replay, and C predates the
accepted region/sector graph.

**D1 — Generation vs artifact (option A).** The canonical world is a reviewed,
checked-in artifact the Runtime only reads; it never runs the generator. This is
what makes `(authored-world identity, seed, intent log)` (gate 02, C02.12) a real
reproducibility claim: the world leg is frozen content, not a per-boot
computation. `map-gen.js` stays a workshop tool whose output is baked into the
artifact.

**D2 — Artifact format (TypeScript/ESM module).** The frozen world ships as a
TS/ESM module in the `game/` tree, not JSON. Decisive reason: 5 edges carry
`choke.cap === Infinity` (open borders, unbounded projectable mass), which does
not survive a JSON round-trip — `Infinity` serializes to `null`, silently
inverting open borders into fully-blocked ones. A TS module preserves `Infinity`
as a native value and gets typecheck coverage for free. This forecloses the
registered JSON round-trip debt. A JSON export function may be added later if an
external consumer appears.

**D3 — Identity (immutable `(worldId, revision)`).** World identity is an
immutable `world id` plus an explicit, immutable `revision`, not a mutable name.
A content change requires a revision bump; each published revision's content is
frozen. This is the concrete form of gate 02's `authored-world identity`. Term
registration (Tier-0/Tier-1 + `term-inventory.json`) is deferred to gate 12 per
the Wayfinder convention; candidates carry style-correct headers now —
`world id (세계 식별자)`, `revision (개정판)`,
`authored-world identity (저작 세계 정체성)` — so promotion is mechanical.

**D4 — Identifier stability (revision-local).** Identifiers are stable within a
revision, not across revisions. Each replay is interpreted against its own
revision's world, so cross-revision identifier continuity is unnecessary and the
queued re-authoring (terrain-cradle TC-⑪) does not conflict — a content edit
simply produces the next revision. Consequences recorded as part of this seal:
the first revision keeps the current `rN` / `rN_sN` / hex-coordinate identifiers
unchanged; edges carry no independent id and derive canonically from sorted
endpoint ids (`min|max`); seat binding is a match-setup input, not part of the
authored map, and is outside this stability contract. Cross-version replay is out
of scope (no save/load product in v1); a lightweight rev→rev change log kept at
re-authoring time preserves the future option without permanent ids now.

**D5 — Validation (three tiers).** (1) Fail-closed Runtime load checks,
machine-enforced, that refuse to construct match state: schema version, unique
ids, referential integrity, exactly-one region/sector membership, map-unit
uniqueness, bidirectional/legal adjacency, required choke/removal data, complete
seat coverage, landmark references, and — the enforcement D4 depends on — a
revision content-integrity check (the loaded content matches the registered
revision). (2) Offline authoring gates that admit a revision, run once before
publication, never per boot: B1/B2 seat viability, viable-binding enumeration,
derived-asymmetry checks, deterministic export, and manual map-intent review. (3)
Documentation governance (agent review + the `write-lint` hook) that keeps map
docs and code aligned. Boundary: structural/integrity failures block Runtime
creation; balance/intent judgments gate publication offline. The agent-review
tier is advisory — it failed this very session when a compaction re-ran a
completed batch — so revision integrity must live in tier 1, not rely on tier 3.

**D6 — Production vs evidence (ADR 0041 applied).** Production = the frozen world
artifact (D1/D2) plus a new TS loader/validator (D5 tier 1). Evidence =
`map-gen.js` (workshop tool, archive; only its output is baked to production),
`map-loader.js` / `map-gate.js` (L2-shaped consumers whose B1/B2 and adjacency
behavior is authoritative evidence to re-implement, but whose shapes must not
cross into production — `map-loader.js` discards hexes and collapses the map into
a per-seat summary), editor overrides, and fixtures. All three already self-label
(`PROTOTYPE … js/ must not import`) and sit under `mockup/` (ADR 0041 archive).
The label prevents import; it does not prevent copying the L2 shape when the L3
loader is written, so the seal adds one pointer: **the source of truth for a new
L3 loader/validator/gate is the sealed artifact schema (D1–D4) plus the tier-1
validator contract (D5), not the old files** — the old files are behavioral
comparators only. Re-implement from the authoritative contract and verify against
the archive; do not translate the file.

**Seal:** user, 2026-07-18 (this session, one question at a time). Working-layer
evidence; no domain term sealed here (gate 12 owns registration). Validation
level L0 (design reasoning).

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
