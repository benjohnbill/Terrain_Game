---
type: task
status: resolved
blocked_by: [01]
---

# 02 — Publish the World Artifact and Partition It Into Two Realms

> **Migrated to front matter 2026-08-03** (ticket 14 R3). The old
> header lines carried prose that the schema moves off the status line:
>
> - **status was:** landed 2026-07-25
> - **blocked-by line was:** 01 — Establish the L3 Tree and Boot a Deterministic Viewer.

**What to build:** Turn the terrain-cradle terrain into the first frozen L3 world
artifact with a real identity, add the tier-1 loader/validator, and give match
setup a **random balanced-population contiguous two-realm partition** plus
**player-chosen capital placement**. A player starting a match sees a rendered
two-realm board with their own realm, the enemy realm, and both capitals.

Specification gates: Wayfinder 06 (`resolved`) — read its § Answer as authority
directly, under the R6 per-ticket waiver (`README.md` § Amendment R6). Gate 10's
unfilled thresholds fail `pending`; gate 12's publication is a doc-sync debt.

Contract (interim pointers): gate 06 § Answer D1–D6 (checked-in TS/ESM artifact,
immutable `(worldId, revision)`, revision-local identifiers, three-tier
validation, production-vs-evidence split); gate 08 § Answer axis 2 (starting
state); ADR 0019 (dynamic assignment — fog owns replayability); capital
`RULINGS.md` CP-② item 2 (D1.3 placement is player-chosen and simultaneous) and
item 1 (location is public from match start); `SPEC.md` equal-population
starting condition; ADR 0032 (front sector is the operational atom).

**Reuse basis — `mockup/combat-calc/map-gen.js`, NOT `map-data.js`.** The terrain
comes from `CRADLE_MAP` / `CRADLE_META` in `map-gen.js`, re-implemented into a
gate-06 artifact and never imported (ADR 0041).

> **Corrected 2026-07-25.** This ticket and gate 08 § Answer originally named
> `map-data.js` `CANONICAL_MAP`. That is the superseded draft: its own header
> calls it "the first-pass 10-region map, **C-loop iteration 1**", while
> `map-gen.js` is "**C-loop iteration 2**". The seal chain points at iteration 2
> in three independent places — `docs/features/terrain-cradle/RULINGS.md`
> ("the executable map source is `mockup/combat-calc/map-gen.js`"),
> `terrain-cradle/INDEX.md` ("the baked USER_SWAPS/seats in `map-gen.js` ARE the
> current shape law"), and `docs/features/capital/INDEX.md` (the authored
> city/capital sectors live in `map-gen.js`'s `capitals`/`cities` tables). Gate 06
> also describes iteration 2, not iteration 1: its decisive reason for requiring a
> TS module over JSON cites **5** `Infinity` choke caps (iteration 2 has 5,
> iteration 1 has 4), and its D4 freezes the `rN` / `rN_sN` identifiers, which are
> iteration 2's scheme. `CANONICAL_MAP` uses names like `center_s0` and carries
> **no city markers at all**, which would make CP-②'s "the player picks one of the
> seat's main city sectors" unimplementable. The gate-08 answer's citation needs
> the same correction; the *decision* it sealed (reuse cradle terrain + random
> balanced partition + player-chosen capital) is unaffected.

Verified content of `CRADLE_MAP`, measured 2026-07-25: **10 regions / 56 sectors /
17 edges**; per-sector `economyValue`, `populationValue`, `usableEconomy`,
`usablePop`, `fortTier`, `garrison`, `mapUnits`; **5** edges with
`choke.cap === Infinity`; `CRADLE_META` carries `capitals` (3 regions),
`cities` (6 regions), plus `frontage`, `pairClass`, `partialRivers`, `massif`.

**Three findings this ticket owns (measured 2026-07-25):**

1. **Population balance is free; do not build a tolerance dial for it.** Every
   region's population totals exactly **6.0** — `map-gen.js` states the intent in
   its header ("parity v5: **equal pop totals**"). So any contiguous five-region
   split is population-balanced to **0%**, and there are **30** such partitions
   (of 190 contiguous two-realm partitions overall). The earlier "balance
   tolerance trades against variety" finding was an artifact of the superseded
   map and is withdrawn.
2. **Economy asymmetry is the design, not a defect.** Region economy totals run
   **4.62 – 7.50**, which is exactly `SPEC.md`'s seal: balanced on population,
   "asymmetric in geometry **and economy**". Do not balance on economy — doing so
   would both contradict SPEC and *reduce* variety (only 8 partitions sit within
   2% economy imbalance, versus 30 at 0% population imbalance).
3. **Intra-region sector adjacency is not in the artifact.** All 17 edges connect
   region *border* sectors; adjacency between sectors inside a region exists only
   implicitly in hex coordinates. Sector-level movement, supply, and reach cones
   need it explicit, and gate 06 D5 tier-1 requires bidirectional legal
   adjacency — so this artifact must **author intra-region adjacency explicitly**,
   derived once from the frozen hex layout (TC-⑪) and baked into the revision.
   This is assembly from the existing hex geometry, not a new rule.

**One gap, now dissolved:** region `r8` carries neither a `capitals` nor a
`cities` entry. Under R3 (SEALED 2026-07-25) this no longer matters — capital
eligibility is ownership, so a realm drawing r8 loses no option. The tables are
still authored into the artifact; they are advisory content for a later
recommendation surface, not a placement constraint.

- [x] The world ships as a checked-in TS/ESM module under `game/` carrying an immutable `(worldId, revision)`; `Infinity` choke caps survive as native values.
- [x] Identifiers are stable within the revision; edges carry no independent id and derive from sorted endpoint ids.
- [x] Explicit intra-region sector adjacency is authored into the revision and is bidirectional and legal.
- [x] The tier-1 loader **fails closed** on schema version, duplicate ids, referential integrity, exactly-one region/sector membership, map-unit uniqueness, illegal or one-way adjacency, missing choke/removal data, and a revision content-integrity mismatch — it refuses to construct match state rather than degrading.
- [x] Match setup draws a **contiguous** two-realm partition balanced by **population** (not region count, not economy), deterministically from the seed; both realms are contiguous and non-empty, and an empty candidate set fails closed instead of falling back to a hardcoded split.
- [x] The candidate count and the achieved population imbalance are reported by an offline publication gate (gate 06 D5 tier 2: seat viability, viable-binding enumeration, derived-asymmetry, deterministic export), reusing the L2 sheet-14 viable-binding logic as re-implemented evidence. Note that B1/B2's recorded `~1.7×` thresholds were authored for **5-seat** adjacent-pair bindings and have never been re-cut for two realms — report that rather than silently reusing the number.
- [x] Each player chooses a capital site by clicking **any sector their realm owns** (R3, SEALED 2026-07-25 — eligibility is ownership, not an authored marker); both commit before either is revealed; both capital locations are public from that point on. `CRADLE_META`'s `capitals` / `cities` tables are carried into the artifact as authored content but do **not** gate the choice.
- [x] The rendered map preserves region, front-sector, route, terrain, and realm identity, and the renderer consumes only viewer-safe projection data.
- [x] Hover, camera, and unsubmitted focus stay interaction state outside the Runtime.
- [x] Equal `(worldId, revision, seed)` reproduces the same partition and the same initial projection in Node and browser.
- [x] The archive `map-gen.js` / `map-loader.js` / `map-gate.js` are used as behavioral evidence only; the per-seat summary shape that discards hexes does not cross into production.

---

## Result — landed 2026-07-25

`npm run verify:game`:

```
PASS     typecheck        strict tsc over game/src
PASS     build:runtime    one ESM graph emitted to game/dist/
PASS     build:viewer     the playtest bundle
PASS     test:node        68/68 contract tests, against the emitted artifact
PASS     test:browser     11/11 Playwright tests (runtime lane + viewer lane)
PENDING  parity           node 1f1df0557c34ed77 == browser 1f1df0557c34ed77
```

Root regression 479/479 untouched. `npm run lint:docs` 0 blocking.

### The artifact

`terrain-cradle@r1`, baked from `map-gen.js` (C-loop iteration 2) by
`game/tools/bake-world.js` and checked in at `game/src/world/cradle-r1.ts`:
**10 regions · 56 sectors · 17 edges · 292 hexes**, with **five open borders
carrying a native `Infinity` cap** — the reason gate 06 D2 chose a TS module,
and a test asserts that the same edge JSON-round-trips to `null`, so the hazard
stays visible rather than remembered.

Intra-region sector adjacency is derived once from the frozen hex layout and
baked in, as finding 3 required. A content-integrity stamp (`113f7635`) is
recomputed at load and identical in Node and browser by construction.

### Measurements

The publication gate (`game/tools/publish-gate.js`, tier 2 — offline, never per
boot) reports:

| | |
|---|---|
| candidate partitions | **15** unordered, **30** with side assignment — the ticket's figure, confirmed |
| worst population imbalance | **0.000%** across all candidates |
| achieved imbalance | **0.000%** worst over 200 seeded draws |
| distinct layouts drawn | **30 of 30** — the draw reaches the whole space |
| economy gap | min **0.08**, max **6.34** |
| sector-count gap | min **0**, max **14** |
| B1/B2 seat viability | **UNJUDGED** — reported, not reused |

**Two of those want the user's eye.** A partition can be population-identical
and still hand one realm **14 more sectors** than the other, or **6.34** more
economy on totals near 30. That is SPEC's sealed asymmetry doing exactly what it
says — balanced on population, asymmetric in geometry *and* economy — but it is
much larger than "asymmetric" might suggest in the abstract, and it is per-match
variance a player will feel. Nothing here treats it as a defect; it is recorded
so the question is asked deliberately rather than discovered mid-playtest.

B1/B2 is reported rather than applied: its ~1.7× threshold was authored for
five-seat adjacent-pair bindings and has never been re-cut for two realms.
Borrowing it would be importing a bar from a game this no longer is.

### What the loader refuses

Nine tier-1 checks, each with a test that breaks the artifact in exactly that
one way: schema version · identity · **revision integrity** · duplicate region
ids · a sector claimed by two regions · a sector claimed by none · a dangling
reference · two sectors on one hex · one-way adjacency · cross-region adjacency ·
adjacency to a non-existent sector · a `null` choke cap · a missing removal path ·
a duplicate edge · an edge to a missing sector · a landmark pointing nowhere. All
findings are reported at once rather than the first only.

**D5's tenth item, "complete seat coverage", is discharged rather than skipped**,
and the discharge is written into `load.ts` rather than left implicit: D4 settled
that "seat binding is a match-setup input, not part of the authored map", and the
duel pivot replaced fixed seats with a per-match partition — so coverage is now
enforced in `partition.ts`, which guarantees two non-empty contiguous realms
covering every region and fails closed when no such split exists.

### One rule change made during review

The projection originally published `capitalLocked` for **both** realms, so a
player could watch the opponent's commitment land. No seal says that. Under the
R6 authority test that is an invented visible-state rule, so the projection was
narrowed to the viewer's own lock, and the question is now recorded as an owed
micro-ruling (`DECISIONS-OWED.md` § Owed micro-ruling). Ticket 03 needs the same
answer for turn commits.

### Assumptions worth naming

- **Cross-region sector adjacency is refused**, not merely absent. Finding 3 only
  said intra-region adjacency was missing. The loader hardens that into a
  rejection, because a cross-region adjacency row would open a second,
  undocumented channel between regions that bypasses every choke the map
  authored. If a revision ever needs sector-level cross-region contact, that is
  an edge-model change and belongs in a gate.
- **`currentActor` is still implemented exactly as gate 02 sealed it.** The
  capital beat needed no turn order at all — its legality rule is "has this realm
  locked yet" — which is direct evidence for § 1.3's standing proposal, and is
  left for ticket 03 to rule on rather than pre-empted here.
