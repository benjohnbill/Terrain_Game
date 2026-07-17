# Terrain Game Design

## Current Prototype

The app is a static browser game with plain JavaScript modules loaded through
`index.html` and wired together by `js/main.js` (entry point / orchestrator).

Original prototype modules:

- `js/game.js` - turn state and action dispatch.
- `js/map.js` - hex map generation, selection, and canvas rendering.
- `js/faction.js` - faction resources and growth.
- `js/actions.js` - attack, defense, diplomacy, tax, build, and research.
- `js/ai.js` - AI turn choice.
- `js/diplomacy.js` - relationship and proposal state.
- `js/ui.js` - DOM UI and modal rendering.
- `js/buildings.js`, `js/tech.js` - building and tech-tree data (data layer).

Phase 1 terrain-first modules already landed:

- `js/domain-data.js` - Phase 1 domain catalogs (terrain taxonomy, etc.).
- `js/province-data.js` - initial 30 named-province draft.
- `js/combat.js` - terrain-mediated, force-role combat (Slice 2).
- `js/capacity.js` - action-capacity calculations.
- `js/situation.js` - map-first situation analysis (the stage-1 형세판단
  under-implementation; see DOMAIN_MAP `Situation judgment`).
- `js/intel.js` - information-confidence model (scouting / fog).
- `js/command-preview.js` - deterministic command previews (the prefilled
  command card).

The design docs below run ahead of the code: several layers are sealed in
design (the combat-resolution formula, the match-arc/settlement model) but not
yet implemented in these modules.

## Target Runtime and UI Architecture

The L3 interactive build uses React + TypeScript/TSX for the UI shell and Vite
for build tooling. All new canonical L3 production source, including the
authoritative Game Runtime and domain modules, is TypeScript/TSX; it emits ESM
JavaScript shared by browser play and Node-based tests or simulations. Existing
JavaScript is ported through playable vertical slices rather than converted in
a big-bang rewrite. React sends player intent across a narrow runtime seam and
renders returned game state and events; rules and state transitions do not
import React, access the DOM, or depend on browser globals.

The map renderer remains a separate architectural axis. React can host and
coordinate the map surface without becoming its renderer, and a renderer
change does not move authoritative game state into drawing code. Full game
engines remain reserved for a deliberate genre change toward real-time,
animation-heavy, or physics-heavy play. See ADR 0040, which amends the source-
language portions of ADRs 0016, 0028, and 0039.

The marketing landing page and the game runtime are **two isolated
environments**. Firebase Hosting serves the landing surface only; the L3 game
does not ship as a statically-hosted web page, and its intended destination is a
native shell (the Electron-vs-Tauri choice stays deferred). A browser is a
development and playtest host, not the distribution target. Consequently the
existing `js/` tree, `tests/`, and the L2 harnesses are a **reference archive**
rather than the L3 build source: accepted behavior reaches L3 by re-implementation
from its authoritative feature contract, verified against the archive, and
canonical L3 source occupies its own directory tree. See ADR 0041, which amends
the deployment and source-boundary portions of ADRs 0016 and 0028; the exact
directory boundary is an open Wayfinder decision.

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

### Authored-map pipeline (terrain-cradle, 2026-07-07)

The first authored world exists as a deterministic generator:
`mockup/combat-calc/map-gen.js` derives the same 10-region / 55-sector /
~292-hex map in node and browser from a fixed seed plus the user's sealed
layout (fixed capital/city seats + hex swap overrides). Region adjacency
is derived from hex contact — the drawn map IS the region graph. Static
gates (`map-gate.js`) verify the intended graph, totals, contiguity, and
seat viability on every run. Authoring follows the C-loop rhythm (user
sketches/edits in the mockup edit layer → agent converts & measures →
user eye-judges); after a layout seal, terrain edits are local carves on
finished ownership, never candidate/growth re-runs (carve principle).
Vocabulary, rulings TC-①…⑫, and current status live in
`docs/features/terrain-cradle/`.

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

## Combat Resolution

Combat resolves through a deterministic ratio core, not dice. Attack and defense
powers are built from one shared grammar — substance × commitment lever ×
multipliers — and compared as a scale-invariant ratio R. A per-plan threshold
gates only whether the plan's core intent lands (the headline) and how deep its
effects stamp; casualties are paid on both sides regardless, on a single shared
R-curve, so grinding is unprofitable by arithmetic. The same computation run on
fogged band inputs is the pre-battle forecast, and inverted over the band it is
the commit recommendation — one engine, three views. Effects are the six
one-shot operation effect axes stamped into persistent state; time is expressed
by standing world rules reading that state, never by a plan re-applying.

The structural pass (decisions D1-D11) and the magnitude pass (M1-M13 dials) are
complete in design and live in `docs/features/combat-formula/` (FORMULA,
GLOSSARY, MAGNITUDE, MATCHUP); `DOMAIN_MAP.md` (Combat Resolution) carries the
vocabulary. Implementation in `js/combat.js` still trails the sealed design.

## Match Arc and Settlement

Above single battles, a match is a bounded arc, not an open sandbox. The map is
fully partitioned among 4-6 mature-state realms from turn 1; a match runs
standoff → buildup → war(s) → decision point → settlement inside the
30-40-minute envelope, budgeted so one player's hand fights ~2-3 wars. Wars are
decided by field-army destruction and converted to territory / indemnity /
vassalage through reach-priced settlement bundles rather than sector-by-sector
conquest; the match ends at a hegemony settlement, judged by shield-ratio
arithmetic (leadership + unassailability) that the player reads through fog as a
banded estimate. The sealed model lives in `docs/features/match-arc/` and
`DOMAIN_MAP.md` (Match Arc and Settlement); it is a design layer with no
dedicated module yet.

## Documentation Policy

The full documentation & terminology law — layer taxonomy, authority
and conflict rules, ADR supersession protocol, vocabulary rules, and
the session-close ritual — lives in `.claude/rules/documentation-law.md`.
Summary of the load-bearing rules: truth is minted in
`docs/features/<slug>/` (with user seal) and projected into the root
docs via doc-sync batches; all dial numbers live only in
`docs/features/combat-formula/MAGNITUDE.md` and are referenced by
pointer; `docs/DESIGN-RISKS.md` is the living design-risk register.
