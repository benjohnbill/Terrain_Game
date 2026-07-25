# 02 — Publish the World Artifact and Partition It Into Two Realms

**What to build:** Turn the terrain-cradle terrain into the first frozen L3 world
artifact with a real identity, add the tier-1 loader/validator, and give match
setup a **random balanced-population contiguous two-realm partition** plus
**player-chosen capital placement**. A player starting a match sees a rendered
two-realm board with their own realm, the enemy realm, and both capitals.

**Blocked by:** 01 — Establish the L3 Tree and Boot a Deterministic Viewer.

Status: needs-info

Specification gates: Wayfinder 06, 10, 12.

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

**One gap to route, not to fill:** region `r8` carries neither a `capitals` nor a
`cities` entry. Capital placement must not assume every region offers a legal
site.

- [ ] The world ships as a checked-in TS/ESM module under `game/` carrying an immutable `(worldId, revision)`; `Infinity` choke caps survive as native values.
- [ ] Identifiers are stable within the revision; edges carry no independent id and derive from sorted endpoint ids.
- [ ] Explicit intra-region sector adjacency is authored into the revision and is bidirectional and legal.
- [ ] The tier-1 loader **fails closed** on schema version, duplicate ids, referential integrity, exactly-one region/sector membership, map-unit uniqueness, illegal or one-way adjacency, missing choke/removal data, and a revision content-integrity mismatch — it refuses to construct match state rather than degrading.
- [ ] Match setup draws a **contiguous** two-realm partition balanced by **population** (not region count, not economy), deterministically from the seed; both realms are contiguous and non-empty, and an empty candidate set fails closed instead of falling back to a hardcoded split.
- [ ] The candidate count and the achieved population imbalance are reported by an offline publication gate (gate 06 D5 tier 2: seat viability, viable-binding enumeration, derived-asymmetry, deterministic export), reusing the L2 sheet-14 viable-binding logic as re-implemented evidence. Note that B1/B2's recorded `~1.7×` thresholds were authored for **5-seat** adjacent-pair bindings and have never been re-cut for two realms — report that rather than silently reusing the number.
- [ ] Each player chooses a capital site inside their own realm from that realm's authored city/capital sectors; both commit before either is revealed; both capital locations are public from that point on. A realm containing a region with no authored city sector still offers a legal site.
- [ ] The rendered map preserves region, front-sector, route, terrain, and realm identity, and the renderer consumes only viewer-safe projection data.
- [ ] Hover, camera, and unsubmitted focus stay interaction state outside the Runtime.
- [ ] Equal `(worldId, revision, seed)` reproduces the same partition and the same initial projection in Node and browser.
- [ ] The archive `map-gen.js` / `map-loader.js` / `map-gate.js` are used as behavioral evidence only; the per-seat summary shape that discards hexes does not cross into production.
