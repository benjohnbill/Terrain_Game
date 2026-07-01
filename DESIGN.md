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

Use high complexity with low micromanagement. Player-facing commands should
express strategic intent, while internal systems translate those commands into
mobilization, movement, garrison changes, costs, and risks.

Strategic posture UI should help players interpret the situation and prefill
core commands without becoming an automatic bonus mode. Postures are guidance,
previews, warnings, and suggested priorities.

For the MVP, the player has one primary action per turn drawing from a single
divisible action-capacity pool. The player can commit a variable amount to the
primary action and redirect limited surplus to simple outlets such as scouting,
economy, or reserve. The heavier four-capacity split, carryover/decay, and
overclock system remains post-MVP.

Core command UX should be map-first. The briefing and map should highlight the
current turn's important threats, opportunities, defensive points, uncertain
areas, and route constraints before the player chooses commands. Clicking a
map location should open a prefilled command card rather than an empty form.
The command card should present an operation plan preset: a statistical-average
baseline bundling objective, approach, recommended capacity commitment,
mobilization posture, and risk tolerance. The player can accept it directly or
fine-tune a small number of fields, preserving high complexity with low required
micromanagement.

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

Between named provinces and individual map units, the active campaign should
define front sectors: sub-province operational areas made of multiple map units.
Front sectors are the default one-turn occupation, defense-focus, and deliberate
sacrifice unit. They let a turn feel like a campaign movement rather than a
single-cell capture without making one action resolve an entire named province.
They are operational units, not equal-area tiles: their spatial footprint,
population, economy, defense, and strategic value may differ sharply.
Each front sector should expose a compact Phase 1 value profile:
`controlWeight`, `economyValue`, `populationValue`, `defenseValue`,
`militaryValue`, and `routeValue`. These axes should stay separate so a narrow
pass can have high military/route/control value without pretending to be rich or
populous.

Sector defense should be modeled as four layers: natural defense from terrain,
prepared artificial defense from fortifications, local garrison sustained by
population/economy, and current-turn focused defense from the player's command
commitment. These layers should remain distinct so a mountain pass, a fortified
city, a populous plain, and a deliberately reinforced sector can feel different.

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

Do not treat the hex as the only meaningful campaign-resolution scale. Hexes can
remain the rendering and terrain-calculation minimum, while front sectors group
them into the player-facing operational scale for occupation and defense focus.
Do not derive sector value directly from hex count. Sparse frontier sectors may
be physically large and low-value; dense core, pass, port, or capital sectors may
be physically small and high-value.

Territorial ownership should be modeled at the front-sector level for the MVP.
Existing hex ownership can remain as a transitional rendering/calculation cache,
but the domain source of truth should be which faction controls each front
sector.

The world data may be authored at a larger scale, such as 50x50. This does not
mean every tile must be fully playable, simulated, or logged from turn one.
Use active regions and relevance filtering so the player experiences a large
world without being forced to manage all of it immediately.

## Phase 1 Feature Shape

Phase 1 should solve the current military snowball problem by moving combat
from global faction strength toward local and terrain-mediated strength.

Candidate mechanics:

- terrain-specific attack and defense modifiers,
- local garrison per front sector,
- region economy and population differences,
- recruitment and upkeep pressure,
- supply or movement friction,
- river crossing penalties,
- mountain/pass defensive value,
- limited strait crossing and amphibious penalties,
- AI evaluation based on local targets rather than raw global strength.

The Phase 1 stat model should include combat and economy basics: front-sector
population or population weight, economic value, local garrison,
defense/fortification, movement constraints, and strategic tags.
Governance-heavy concepts such as loyalty, unrest, inflation, and event chains
should be reserved as expansion hooks rather than first-slice requirements.
Control and route access can change immediately on capture; economy and
population use the MVP usable-value recovery placeholder until deeper governance
systems exist.

Military strength should be split by function: standing forces, local garrisons,
offensive mobilization, and local defense or latent mobilizable population.
Attacks are standing-force centered, with offensive mobilization as a risky
support option. Defense combines local garrison and local defense support.

Province identity should inform AI and event logic. For example, a grain basin,
mountain pass, river junction, coastal harbor, frontier, or old capital region
should not be evaluated only by tile count.

Gameplay calculations should inspect terrain composition, province stats, and
strategic tags rather than relying only on broad archetype region labels.

Function should influence economy, recruitment, unrest, events, diplomacy, AI
priorities, and player-readable strategic purpose.

Province and target previews should show expected changes to command,
administration, diplomacy, and scholarship/technology capacity where possible.

## Documentation Policy

Use ADRs for decisions that shape future implementation. Use `DOMAIN_MAP.md`
for terms and constraints. Use `docs/features/<slug>/` for active feature
research and slice planning.
