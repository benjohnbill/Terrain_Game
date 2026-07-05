# Terrain-Cradle Map Authoring — Design Spec

Date: 2026-07-06
Status: Draft (brainstorming output, pre-implementation)
Thread: B (playable slice) — map authoring, the foundation the first
playable slice stands on.

## Purpose

Design the **authoring format** for terrain-cradle maps and, on that
format, the **first map pool** the MVP ships with. The match-arc pass
sealed the match's shape (hegemony decision point, projectable mass,
settlement, land-derived economy) but never produced a map to run it on.
The existing `js/province-data.js` (30 provinces, authored 2026-06-29,
pre-match-arc) carries flavor/weights only — no realm layout, adjacency
graph, front-sector subdivision, or choke structure. This spec fills
that gap.

This is a **document spec**, not code. Game-code rendering/loading is
deferred to a separate code-entry gate (per the standing decision that
`js/` rework waits until L2/MVP specs are complete). The validation
harness it references (`mockup/combat-calc/`) is an existing prototype,
not game code.

## Scope

**In scope:**
- The authoring format: schema (region / province / front-sector / hex /
  adjacency / choke) + authoring constraints as a gate checklist.
- The first MVP map pool: one canonical "well-made" map + three sector-
  form variants on the same region topology = **4 maps total**.
- Validation integration: extend the battery/tournament harness to
  numerically verify each map (B1/B2 + simulation).

**Out of scope (MVP-later):**
- Topology variants (e.g. adding a central sea, splitting the center
  across more seats) — these change the adjacency graph itself.
- Procedural/infinite map generation (explicitly rejected — see §5).
- Game-code (`js/`) loading and rendering of authored maps.
- Dynamic seat-assignment verification beyond the canonical example.

## Guiding goal

The map we most need is **the one that makes the game most fun** —
consistent with the sealed docs, while driving diversity and the
"one-more-match" pull. Real-world geography is a **reference frame and
flavor aid, not a constraint** (ADR 0001 / SPEC world model: historical
geography is input material; readability and balance override it).

---

## 1. Authoring format — data model layer

The layer derived from the sealed constraints. **Core principle: cap and
income are never authored** — they derive from sector values each turn
(land-derived state, MAGNITUDE M14 / SPEC Core Design Principle 1). The
author sets sector value distribution, not force ceilings.

```
Region (지형 크래들 — fixed authored unit, ~8–10; first map: 10)
  archetypeRegion            ← broad frame; a label, not a rule (ADR 0006)
  terrainComposition: [layer…]  ← mechanical values live here (ADR 0006)
  provinces: [provinceId]
        │
   [dynamic assignment: bind adjacent regions in twos]
        ↓
Realm / seat (4–6; setup parameter, NOT authored)
  regions: [regionId, regionId]   ← adjacent pair

Province (named province — ~25–40; three lenses, ADR 0004/0006/0007)
  archetypeRegion
  terrainComposition: [layer…]
  primaryFunction (+ optional secondary)  ← 9 categories, ADR 0007
  sectors: [sectorId]

FrontSector (territorial ownership unit — ADR 0022; 1-turn occupy/defend)
  mapUnits: [hexKey]              ← sector = explicit hex set
  spatialExtent: mapUnits.length ← physical size (derived) — NOT value
  valueProfile (6 axes, explicitly authored — NOT from hex count, D4):
    controlWeight · economyValue · populationValue ·
    defenseValue · militaryValue · routeValue
  defenseLayers (substance × lever × mult, ADR 0022 amended):
    terrainDefense (immutable)
    fortificationTier (damageable → wall-assault cap, M11)
    localGarrison (pop/econ-derived substance)
    · defenseCommitment is a runtime lever, not authored
  usable: { economy: 100%, population: 100% }  ← authored start = own land

MapUnit (hex)
  { q, r, terrainLayer, strategicTags }
  · roles: (a) spatial extent — physical area, render, movement, distance
           (b) combat detail — terrain evidence, deployment, frontage contact
  · hex count is NOT strategic value (a vast steppe < a small grain basin)

Adjacency (sector-level graph — full partition, no neutral cells, A2)
  edges: [{ a: sectorId, b: sectorId, choke, frontageHexes }]
  · facing-front shield (C5) and projectable mass (C1) both derive here
  · frontageHexes = the hex-edge contact count (choke's physical basis)

  choke (edge property)
    class: open | forest(1500) | pass(1000) |
           river(1000) | strait(500) | legendary(300–500)   (M11/C2)
    frontageCap                ← derived from class (authored consistent
                                  with frontageHexes: no strait on a wide plain)
    removalPath: REQUIRED      ← bypass / build / alt-ford / port staging
                                  (C3/C4 — a choke with no removal path is
                                  un-authorable: no permanent blockades)
```

**Three design judgments (approved during brainstorming):**
1. **Sector is the atom.** Province = a bundle of sectors (identity
   lens); realm = a bundle of regions (ownership). War, fronts, and
   value all run at the sector layer (ADR 0022).
2. **Adjacency is a sector–sector graph; choke is an edge property.**
   Facing-front shield and projectable mass both derive from this graph,
   so authoring the map is essentially authoring this graph.
3. **Every choke carries a required `removalPath` field** (C3/C4) —
   enforced at schema level (no permanent blockade / bipolar stalemate).

**hex is the one invariant base.** The hex grid never changes; sector
form, boundaries, and value are re-composed per map. This is the ADR
0002 spirit (hex-first, province-compatible): hex is the base unit,
the structure above it is reconfigurable.

---

## 2. Region / seat structure — the first map's composition

Regions are the fixed authored unit; **realms/seats are a dynamic
binding of adjacent regions**, not authored entities. This separates the
frame-decision "terrain cradle" (region) from the seat that occupies it
(realm), and resolves the one-dimensionality problem: a seat built from
"a sheltered region + a differently-charactered region" has internal
tension, so play texture varies by seat.

First map: **10 regions** (existing 8 archetype_regions promoted + re-cut;
geography extended per the earlier vision — Korean peninsula/strait,
western Tianshan/Himalaya corridor, Mongolian plateau; not a 1:1 China
map).

Canonical 5-seat example binding (the verification reference point, NOT
the only valid set — the generator may produce others):

```
         [Steppe·Mongolia N]────[Northeast·Korea NE]
              │                       │
   [Xiyu W]──[Hebei NC]───────────────┤
      │          │                    │
   [Guanzhong]─[Center]──[Hanjing]──[SE Strait SE]
      │          │           │           │
   [Shu SW]──────┴───[Jiangnan S]────────┘
```

| Seat | region pair (shelter + character) | composite identity |
|---|---|---|
| **A Center** | Center plain (open/exposed) + Hanjing corridor (river shelter) | rich, 4-front exposed but river-backed south — F6 interior lines |
| **B West** | Guanzhong pass + Xiyu oasis corridor | double-sheltered, hard to sortie but safe + remote trade wealth — F5 shield-first, pattern (a) |
| **C North** | Hebei plain (open) + Steppe·Mongolia (cavalry) | open terrain but Hebei's fertile land backs the border — F3 free-rider, pattern (b) |
| **D South** | Shu basin (sheltered) + Jiangnan granary (rich) | basin-guarded rich rear, long-war base — F1 conquest target / F4 raid target |
| **E Southeast** | Northeast·Korea (frontier) + SE strait | coastal/peninsular remove, hermit element — hermit clause + F2 vassal chain |

**The center's weak chokes = its exposure.** Peripheries are sheltered
by pass/river/strait toward the map edge and open only toward the
center; the center alone is open on 4 fronts. "Whoever takes the center
inherits its exposure" (anti-snowball) is implemented as seat topology.

Sizes are asymmetric; **viability (survivability), not mass, is
balanced** (SPEC). Author balances a seat by composing shelter + wealth
(patterns (a)/(b)), not by equalizing size. Pattern (a) "great natural
fortress but hard to sortie out" is exactly the sealed `projectable mass
= door width × 2` (C1): an unbreachable realm usually cannot march out
either. Pattern (b) "open terrain compensated by fertile borderland" is
the exposed-wealth (center) pattern.

### Dynamic seat assignment — constraint-satisfying generation

Seat assignment is dynamic (per-match variety, the "one-more-match"
pull), consistent with ADR 0019 "fog owns replayability." But **random
assignment cannot guarantee viability parity.** So assignment is
constraint-satisfying: only adjacent-pair bindings that pass B1/B2 are
generated. The canonical A–E set above is one such example (the
verification reference point), not the definitive set.

**Topology determines how many viable seat-sets exist.** The adjacency
graph's shape (how many borders, where the chokes are) is the primary
lever on viable-combination count — this is an authoring lever, not a
consequence of terrain. Levers (all expressed via the sealed
choke/adjacency grammar):
- **Central water body (inland sea / large river)** — many regions meet
  around water → higher adjacency (multi-front), softened by crossing
  penalty (river/strait choke).
- **Center subdivision** — splitting the rich center across seats raises
  border count, prevents center monopoly.
- **Corridor / bottleneck** — adjacency exists but only through a narrow
  door → viable but hard to sortie.
- **Peninsula / island remove** — strait separation → lower adjacency,
  hermit viability.

Topology is authored from the game goal (viable-combination count),
not copied from a real map (real adjacency is not built for balance).

---

## 3. Validation integration — battery/tournament harness

Two layers: a fast static calculation and reuse of the existing
tournament. The harness lives in `mockup/combat-calc/` (existing
prototype, not game code).

**Static validation (no match simulation — all-cap state calc):**
- **B1 (all-cap ≠ leadership):** with every realm filled to cap in the
  canonical 5-seat binding, no seat satisfies `projectable mass ≥ ~1.7 ×
  Σ in-standing shield`. Sector value → cap; choke door width →
  projectable mass; facing-front adjacency → shield. Computable from the
  map graph alone.
- **B2 (viability parity):** each seat withstands a ~1.7× invasion from
  turn-1 adjacent threat (no one-war-kill).
- **Generation soundness:** enumerate ALL adjacent-pair 5-seat bindings
  from the region graph → check each against B1/B2 → count viable
  bindings. Static, so full enumeration is cheap. This count vs the
  diversity target (≥ N) is the topology-tuning metric.

**Dynamic validation (reuse sheet-12 tournament):**
- Run policy-bot × temperament tournament on the canonical binding (+ a
  sample of viable bindings) for closure rate + archetype spread — the
  sheet-12 method, unchanged.

**Harness extension:**
- New module: **map loader** — region graph (adjacency + choke + value)
  → mass / shield / cap.
- New battery sheet: **sheet 14 (map viability)** — static B1/B2 + viable
  enumeration; dynamic calls the existing tournament.
- Outputs: B1/B2 verdict · viable-combination count · closure
  rate/spread.

### Optimization loop — how validation is used

Validation is an **oracle** (does this map pass?), not a search engine.
The map is found by a **manual gradient-descent-style loop** using the
oracle as loss:

```
rough topology (initial value) → static battery: viable count · closure (loss)
   → author tunes a topology lever (add sea / split center / choke)
   → re-measure → repeat
```

Two ways this differs from true gradient descent, both load-bearing:
1. **The objective is non-differentiable and an L2 proxy.** "Fun" is
   answered only by L3 (playtest), never by an L2 metric. So tuning is
   **manual** (the author turns topology levers via geographic/game
   intuition); the machine cannot differentiate discrete topology.
2. **Converging to "one optimum" conflicts with our principles.** A
   single optimal map would kill diversity (and violates the
   `no-fixed-optimum` principle). So the optimization target is not "one
   map's score" but **the breadth of the possibility space it opens** —
   a topology that yields many viable seat-sets. Optimal = "opens the
   most fun-possibility space," not "maximizes a fun score."

The loop's output is therefore a **map pool**, not one map. The static
metric is the fast feedback that makes topology tuning iterable; **L3
playtest is the final arbiter of fun** — L2 maps are "good-enough
candidates."

### MVP map pool

- **MVP output** = the authoring format + a pool of **4 maps** on the
  same region topology (1 canonical "well-made" map + 3 sector-form/value
  variants), each passing B1/B2 + simulation, all produced as optimized
  outputs of the loop above. Per match: pick a map from the pool + dynamic
  seat assignment + fog/spawn (three diversity axes).
- **MVP-later** = topology variants (changing the adjacency graph
  itself, e.g. a central sea).

### Why a finite authored pool (not procedural)

The variety model is an authored map pool (StarCraft-style), NOT
procedural/infinite generation. Infinite generation breaks three things:
(a) validation explosion (cannot guarantee infinite maps pass B1/B2);
(b) loss of learning anchor (players cannot learn maps — the reason
StarCraft uses a finite pool); (c) ADR 0019 "no procedural generation
required." A finite authored pool keeps maps as authored artifacts and
gives the "learn the map" opt-in depth (ADR 0019). "Sector hex differs
per match" means "differs by which pooled map is drawn," never
per-match procedural regeneration.

---

## 4. Authoring gate — A–F constraints as a checklist

The gate a map must pass before "pool adoption," classified by
verification method — **automatic (battery static) / lint (field
presence) / author judgment (manual)**:

| Gate | Items | Verification |
|---|---|---|
| **A Board** | 10 regions · full adjacency (0 empty cells) · center 4-front exposed · center rich-not-dominant | auto (graph) + manual (center-size intent) |
| **B Seat sizing** | B1 all-cap≠leadership · B2 viability parity ~1.7 · viable 5-seat count ≥ target · smallest seat playable | **auto (battery static)** |
| **C Terrain structure** | every choke has class + **removalPath (required)** · frontageCap = class-derived · each hex → exactly 1 sector · defense 4 layers filled | lint (fields) + auto (cap) |
| **D Sector value** | 6-axis value profile explicit (not hex count) · cap/income derived (not authored) · usable start 100 | lint (fields) + auto (derivation consistency) |
| **E Naming/identity** | three lenses filled (archetype·terrain·function) · fictional names (no meta-labels) · function 1(+opt 1) · each seat composite identity | lint + manual |
| **F Six archetypes** | soft-target adjacency (F1) · shared-front possible (F2) · AI-war neighbor pair (F3) · raid-reachable economy (F4) · choke=tempo (F5) · interior route (F6) | **manual (author judgment)** — battery gives indirect signal via closure/spread |

**Structure:** B (seat sizing) is fully automatic — battery static calc
gives an immediate verdict, and this is the optimization loop's loss.
C/D are lint (field presence) + auto (derivation consistency). E/F are
author-judgment-led, but F gets an indirect signal from tournament
closure rate / archetype spread (if an archetype never wins, its F
condition is not standing on the map).

**Gate pass = pool-adoption eligibility.** When the canonical map + 3
variants each pass this gate, the MVP pool is complete. Topology variants
(central sea, etc.) change gate A's adjacency graph and are MVP-later.

---

## Terminology debt

This spec introduces a region/realm split that needs reconciliation into
the canonical vocabulary (DOMAIN_MAP / match-arc frame decisions): the
frame decision's "4–6 viable terrain cradle" currently conflates cradle
and seat. Under this spec, **cradle = region (fixed authored, ~8–10),
seat = realm (dynamic binding of adjacent regions, 4–6)**. To be
reconciled when this spec is sealed (a doc-sync batch item, not resolved
here). Related terms to define/align: region, cradle, realm, seat,
province, front sector, spatial extent, map pool, topology lever.

## Open questions (for implementation planning)

- Diversity target N: how many viable seat-bindings must a map yield to
  count as "diverse enough"? (Set empirically from the first static run.)
- Sector-form variant authoring: hand-authored per variant, or
  parameterized from the canonical? (Lean: hand-author 3 for MVP;
  parameterization is post-MVP.)
- Region count final: 10 fits 5-seat (×2); 4-seat/6-seat bindings on the
  same 10 regions are format-supported but unverified at MVP.
