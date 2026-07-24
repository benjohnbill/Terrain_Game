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

**Reuse basis (read the artifact, do not re-author terrain).** The terrain comes
from `mockup/combat-calc/map-data.js` `CANONICAL_MAP` — re-implemented into a
gate-06 artifact, never imported (ADR 0041). Verified content, 2026-07-25:
**10 regions / 49 sectors / 15 edges**, per-sector `economyValue`,
`populationValue`, `usableEconomy`, `usablePop`, `fortTier`, `garrison`, and one
`mapUnits` hex each; five edges carry `choke.cap === Infinity` (why gate 06 D2
requires a TS module, not JSON).

**Two findings this ticket owns (measured 2026-07-25, not yet dials):**

1. **The artifact has zero intra-region sector adjacency.** All 15 edges connect
   region *border* sectors (`<region>_s0`); adjacency between sectors inside a
   region exists only implicitly in hex coordinates. Sector-level movement,
   supply, and reach cones need it explicit, and gate 06 D5 tier-1 demands
   bidirectional legal adjacency — so this artifact must **author intra-region
   adjacency explicitly** (derive once from the hex layout, then freeze it into
   the revision).
2. **Balance tolerance trades against variety.** Enumerating every contiguous
   two-realm partition of the region graph: **162 total**, of which **4** sit at
   ≤2% population imbalance, **8** at ≤5%, **32** at ≤10%, **44** at ≤15%. The
   tightest is 1.7% (`center+hebei+guanzhong+xiyu` vs the other six, 28.33 vs
   29.32 population weight). So "random balanced partition per match" yields only
   ~4 distinct boards at a strict tolerance. The tolerance is a **dial owed to
   this ticket's own measurement** and belongs to the terrain-cradle map spec's
   manual tuning loop, not to this file; the ticket must expose it, not pick it
   silently. Raising variety by re-authoring terrain is the parallel map pass
   (`docs/SYNC-DEBT.md`, 1v1 map re-authoring), not this ticket.

- [ ] The world ships as a checked-in TS/ESM module under `game/` carrying an immutable `(worldId, revision)`; `Infinity` choke caps survive as native values.
- [ ] Identifiers are stable within the revision; edges carry no independent id and derive from sorted endpoint ids.
- [ ] Explicit intra-region sector adjacency is authored into the revision and is bidirectional and legal.
- [ ] The tier-1 loader **fails closed** on schema version, duplicate ids, referential integrity, exactly-one region/sector membership, map-unit uniqueness, illegal or one-way adjacency, missing choke/removal data, and a revision content-integrity mismatch — it refuses to construct match state rather than degrading.
- [ ] Match setup draws a **contiguous** two-realm partition balanced by **population** (not region count) within a stated tolerance, deterministically from the seed; both realms are contiguous and non-empty, and an empty candidate set fails closed instead of falling back to a hardcoded split.
- [ ] The balance tolerance and the resulting candidate count are reported by an offline publication gate (gate 06 D5 tier 2: seat viability, viable-binding enumeration, derived-asymmetry, deterministic export), reusing the L2 sheet-14 viable-binding logic as re-implemented evidence.
- [ ] Each player chooses a capital site inside their own realm; both commit before either is revealed; both capital locations are public from that point on.
- [ ] The rendered map preserves region, front-sector, route, terrain, and realm identity, and the renderer consumes only viewer-safe projection data.
- [ ] Hover, camera, and unsubmitted focus stay interaction state outside the Runtime.
- [ ] Equal `(worldId, revision, seed)` reproduces the same partition and the same initial projection in Node and browser.
- [ ] The archive `map-gen.js` / `map-loader.js` / `map-gate.js` are used as behavioral evidence only; the per-seat summary shape that discards hexes does not cross into production.
