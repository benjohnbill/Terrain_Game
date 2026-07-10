# Terminology Audit — Run #1 (2026-07-10)

Status: evidence document. Verdicts are recorded in `term-inventory.json`;
every rename listed here is a **candidate requiring a separate user seal** —
nothing in this report changes canon by itself.

Inventory: `term-inventory.json`, regenerated 2026-07-10, 220 terms
(175 mechanism / 45 meta after kind reassignments). Method: dual-dictionary
routing — mechanism terms judged against 4X/grand-strategy/wargame conventions
(Paradox titles, Civilization, Total War, classic wargames); meta terms judged
against game-design theory vocabulary (GDC/MDA/design literature). Procedure:
`HARVEST.md`.

## Headline

**No high-severity naming problems exist.** Zero terms rise to genuine
misparse/miss level. The vocabulary is healthy: 97 justified coinages, 65
standard matches, 55 synonym-exists (46 of them transparent low-severity
derivatives), 3 undetermined.

| Verdict | Count | Meaning |
|---|---|---|
| justified-coinage | 97 | no genre/theory precedent; coined name legitimate |
| standard-match | 65 | our name is the established name |
| synonym-exists | 55 | an established different name exists (9 medium, 46 low severity) |
| undetermined | 3 | ruling-statements harvested as terms; drop from inventory at next regeneration |

Notable rate asymmetry: meta language runs 53% synonym-exists (24/45) vs 18%
for mechanism terms (31/175). Internal design shorthand reinvents established
design vocabulary far more often than mechanic names do — expected, since
mechanism names went through explicit naming rulings and meta shorthand grew
in conversation.

## Rename agenda — the 9 medium-severity candidates (user decision)

Mechanism (genre dictionary):

| Current | Suggested | Rationale |
|---|---|---|
| National cap | force limit | Paradox-established name for the pop-derived standing-army ceiling; "national cap" does not say what is capped |
| Latent mobilizable population | manpower (pool) | the genre's most entrenched resource term. **Conflicts with the intuitive-over-compact ruling (2026-07-07)** which deliberately rejected the short pool name — decide which principle wins here |
| Void terrain | impassable terrain | "void" does not read as impassability; HOI4/EU4 convention |

Meta (design-theory dictionary):

| Current | Suggested | Rationale |
|---|---|---|
| Aging constitution | anti-stalemate ratchet | the established systems-design concept this ruleset implements |
| Derived asymmetry | emergent asymmetry | established term for asymmetry produced by symmetric rules + terrain; note this is SPEC Principle 8 vocabulary |
| Position as product | path-dependent position | "product" ambiguous (multiplication vs outcome) |
| Battle-summoning placement | flashpoint / conflict-anchor placement | standard level-design vocabulary |
| Denied-dominant (the wall) | anti-leader coalition | established multiplayer-dynamics term |
| Force geography | military geography / force distribution | an established academic field name exists |

The 46 low-severity synonyms (e.g. Projectable mass → power projection, Action
capacity → action points, One blanket → "defend everything, defend nothing")
are transparent derivatives with no misparse risk; recommendation: **no
action** — recorded in the inventory verdicts for future reference only.

Kind reassignments applied to the inventory: 5 mechanism→meta (Uncertainty
duel, Posture as annotation lens, Wall grade is public information, Full
adjacency no neutral zones, Mature-state start — design philosophy/ruling
language, not in-game concepts) and 1 meta→mechanism (Parity start — a
concrete setup rule). Map-lore proper nouns (Great range, Hexi corridor,
Western Ring, Taishan…) were judged justified-coinage as place names — they
are content, not terminology, and should be excluded from future audit runs.

## Ring B findings — internal consistency (usage surfaces vs inventory)

Cross-check of SPEC.md, DESIGN.md, all ADRs, and js/ against the inventory.
Full detail in the session evidence; consequential findings:

### Ghost terms (used as established, never registered)

- **`information confidence`** [HIGH] — the fog/scouting confidence scalar.
  Load-bearing in DESIGN.md, ADRs 0013/0019/0020/0021/0023/0024, and
  `informationConfidence` in 6 js files (14 uses). ADR 0023 explicitly
  distinguishes it from the registered "Province status confidence". No
  inventory row. → registration candidate #1.
- **`force role`** [MEDIUM] — umbrella term for the military-function split;
  the four members are registered, the grouping term (used in ADR 0009 title,
  0010, 0015, 0018, DESIGN) is not. → registration candidate #2.
- **`diplomacy` (as a system)** [MEDIUM] — the shipped alliance/war system
  (`window.DiplomacySystem`, 11 files/98 uses) plus SPEC Phase-2 language has
  zero inventory coverage; match-arc registers only the settlement-side terms.
- Province-archetype alias gaps [LOW]: Northeastern Frontier, Southeastern
  Coast and Straits, Northwestern Oasis, Desert Corridor recur in ADR
  0006/0007/DESIGN but are missing from the registered alias set.

### Synonym drift

- **`gold` ↔ Treasury (국고)** [MEDIUM] — the shipped currency is
  `faction.gold`; docs are mostly consistent on treasury/국고 but "gold" leaks
  into SPEC.md:264 and ADR 0013:33.

### Code-contract violations

- `actionCapacity` (Action capacity) — declared with codeRefs, but code uses
  `capacity`/`capacityState`/`CapacitySystem`. Confirmed mismatch.
- `computeProvinceStatus` (Province status) — code implements `classifyHex`
  (matching ADR 0019's own text). Confirmed mismatch.
- `terrainDef` abbreviation in js/combat.js vs declared `terrainDefense`.
- 47 of 69 declared code identifiers are **design-ahead-of-code** (empty
  codeRefs — sealed design not yet implemented in the shipping js/). Not
  violations; recorded so the future lint can distinguish "not yet built"
  from "built under a different name".
- Reverse scan: js/ carries a **legacy prototype layer** (diplomacy, gold,
  buildings, research/tech, attackForce/defenseForce) predating the
  terrain-first vocabulary, entirely unregistered — a known-era artifact, but
  it means Ring B code checks will stay noisy until the legacy layer is
  either registered or scheduled for replacement.

## Recommendations (PROPOSED — user seals)

1. Register `information confidence` and `force role` (Tier-1 rows at their
   de-facto birthplaces; both are established usage, not new coinages).
2. Decide the two medium drift/contract clusters: gold→treasury cleanup in
   SPEC/ADR prose; inventory codeIdentifier corrections (`capacity`,
   `classifyHex`) so the contract matches shipped reality.
3. Take the 9-item rename agenda to a decision pass — the only entry with
   real tension is Latent mobilizable population vs manpower (intuitive-over-
   compact ruling vs genre standard).
4. Add the 4 missing province-archetype aliases.
5. Exclude ruling-statements and map-lore proper nouns at the next inventory
   regeneration (noted in HARVEST.md).
