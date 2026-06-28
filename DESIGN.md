# Terrain Game Design

## Current Prototype

The app is a static browser game with plain JavaScript modules loaded through
`index.html`.

Current major modules:

- `js/game.js` - turn state and action dispatch.
- `js/map.js` - hex map generation, selection, and canvas rendering.
- `js/faction.js` - faction resources and growth.
- `js/actions.js` - attack, defense, diplomacy, tax, build, and research.
- `js/ai.js` - AI turn choice.
- `js/diplomacy.js` - relationship and proposal state.
- `js/ui.js` - DOM UI and modal rendering.

## Design Direction

The next design step is a terrain-first regional system. Political control
should sit on top of geography, not define geography.

Each map unit should eventually carry:

- terrain type,
- biome or climate band,
- elevation or passability,
- river/coast/strait flags,
- base economic value,
- population capacity and growth,
- local garrison,
- fortification or defense value,
- supply and movement characteristics,
- resource or strategic tags.

Above map units, the active campaign should define named provinces. A province
groups map units and provides identity: name, population weight, economic
profile, strategic role, background, loyalty/unrest tendency, and event hooks.

Named provinces should be organized into broad archetype regions such as
Central Plains, Guanzhong Passes, Jiangnan Grain Belt, Northeastern Frontier,
Southeastern Coast and Straits, Steppe Frontier, or Northern India Route. These
archetype regions are design frames, not direct mechanical terrain types.

Province identity should also include settlement/function. This layer describes
how people use the place: administrative center, commercial city, agricultural
center, military base, fortress pass, port city, mining/workshop district,
scholarly/religious center, or frontier settlement.

## Map Representation Strategy

Start with hexes because the prototype already uses hex rendering and
adjacency. Design each hex as a region-like map unit with data rich enough to
support a later move to irregular provinces.

The system should avoid hard-coding logic that assumes every playable unit is
forever a uniform hex. Use map-unit concepts in design language even while the
rendering remains hex-based.

The world data may be authored at a larger scale, such as 50x50. This does not
mean every tile must be fully playable, simulated, or logged from turn one.
Use active regions and relevance filtering so the player experiences a large
world without being forced to manage all of it immediately.

## Phase 1 Feature Shape

Phase 1 should solve the current military snowball problem by moving combat
from global faction strength toward local and terrain-mediated strength.

Candidate mechanics:

- terrain-specific attack and defense modifiers,
- local garrison per territory,
- region economy and population differences,
- recruitment and upkeep pressure,
- supply or movement friction,
- river crossing penalties,
- mountain/pass defensive value,
- limited strait crossing and amphibious penalties,
- AI evaluation based on local targets rather than raw global strength.

The Phase 1 stat model should include combat and economy basics: population or
population weight, economic value, local garrison, defense/fortification,
movement constraints, and strategic tags. Governance-heavy concepts such as
loyalty, unrest, inflation, and event chains should be reserved as expansion
hooks rather than first-slice requirements.

Province identity should inform AI and event logic. For example, a grain basin,
mountain pass, river junction, coastal harbor, frontier, or old capital region
should not be evaluated only by tile count.

Gameplay calculations should inspect terrain composition, province stats, and
strategic tags rather than relying only on broad archetype region labels.

Function should influence economy, recruitment, unrest, events, diplomacy, AI
priorities, and player-readable strategic purpose.

## Documentation Policy

Use ADRs for decisions that shape future implementation. Use `DOMAIN_MAP.md`
for terms and constraints. Use `docs/features/<slug>/` for active feature
research and slice planning.
