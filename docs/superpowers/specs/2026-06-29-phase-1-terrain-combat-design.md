# Phase 1 Terrain and Combat Design

Date: 2026-06-29

Status: Draft for user review

## Purpose

Phase 1 upgrades the prototype from simple global-strength land conquest into a
terrain-first conquest game. The goal is to make map reading, regional value,
local force, and uncertain information drive the core fun.

The player should enjoy studying the situation, choosing a strategic direction,
issuing a small number of meaningful commands, and seeing the map respond.

## Design Principles

- High complexity, low micromanagement.
- Geography comes before politics.
- The map should guide command creation.
- Strategic posture is guidance, not a hidden bonus mode.
- Information should have confidence and uncertainty.
- The player chooses intent and risk; the system handles detailed resolution.
- Phase 1 includes combat and economy basics, not full domestic governance.

## World and Map Scope

The world is fictional and East Asia-inspired. It should use real geographic
logic from China and East Asia as source material without becoming a literal
historical recreation.

World data may target a 50x50 scale. The first active campaign should expose
roughly 25x25 to 30x30 of detailed play, centered on central plains, southern
grain regions, and part of the northern frontier.

The implementation can keep hex rendering at first, but game concepts should
use `map unit` and `province` language so future irregular province maps remain
possible.

## Map Identity Model

Each province should be legible through three lenses:

1. **Archetype region**: broad geographic and historical frame.
2. **Terrain layer**: physical rules for combat, economy, movement, and access.
3. **Settlement/function layer**: how people use the place.

### Archetype Regions

Initial and expandable archetype regions:

- Central Plains
- Guanzhong Passes
- Hebei and Northern Plains
- Northeastern Frontier
- Han/Jing River Corridor
- Jiangnan Grain Belt
- Southwestern Basin
- Southeastern Coast and Straits
- Northwestern Oasis and Desert Corridor
- Southern Mountain and Forest Frontier
- Steppe Frontier
- Northern India Route

These are design frames, not direct combat modifiers.

### Terrain Layer

Phase 1 starts with a compact terrain vocabulary:

- plains
- grain basin
- mountain/pass
- river overlay
- coast/strait
- steppe/highland
- frontier basin

Terrain rules should inspect actual terrain composition, not broad archetype
labels.

### Settlement/Function Layer

Initial function categories:

- capital/administrative center
- commercial city
- agricultural center
- military base
- fortress pass
- port city
- mining/workshop district
- scholarly/religious center
- frontier settlement

Each province normally has one primary function and optionally one secondary
function.

## Named Provinces

The first active area should include roughly 25 to 40 named provinces. Province
names should feel like natural place names or geographic descriptions, not meta
design labels.

Use hybrid naming:

- large geography can be historically legible;
- specific provinces can use fictional East Asian-style names;
- the user can later add or replace detailed names.

Province data should include:

- name
- archetype region
- terrain composition
- primary and secondary function
- population weight
- economic profile
- strategic role
- local garrison
- defense/fortification value
- movement/crossing constraints
- strategic tags
- expansion hooks for loyalty, unrest, events, and recovery

## Phase 1 Stat Scope

Phase 1 should implement combat + economy basics:

- population or population weight
- economic value or income base
- local garrison
- defense or fortification
- movement and crossing constraints
- action-capacity effects
- strategic tags for AI and UX

Do not implement full inflation, loyalty, public order, rebellion chains, or
deep event simulation in the first slice. Leave hooks for later phases.

## Military Model

Replace the single global military model with functional force roles.

### Force Roles

- **Standing forces**: maintained troops directly commanded for attack,
  movement, and critical defense.
- **Local garrisons**: troops tied to a province or map unit.
- **Offensive mobilization**: temporary risky force drawn from population or
  local capacity to support attacks.
- **Local defense / latent mobilizable population**: non-military population
  that can become militia, levy, resistance, or rebellion under pressure.

Attacks are standing-force centered. Offensive mobilization can support attacks
at risk. Defense combines local garrison and local defense.

Mobilization risks should affect population, economy, future capacity, and later
unrest/event hooks.

## Action Capacities

Use four broad action capacities:

- **Command**: military orders, scouting, mobilization, training, deployment.
- **Administration**: tax, supply, development, recovery, control.
- **Diplomacy**: negotiation, threat, tribute, relationship work, espionage.
- **Scholarship/Technology**: research, surveying, institutions, tactics.

Capacities are generated from population, province function, province economy,
national traits, technologies, and accumulated preparation.

Capacity effects should be visible in UI previews, especially when gaining or
losing provinces.

### Focus

Each capacity can have a focus. Strategic posture sets defaults; the player can
adjust only what matters.

Examples:

- Command: operation, mobilization, scouting, training
- Administration: taxation, supply, development, recovery
- Diplomacy: negotiation, espionage, threat, appeasement
- Scholarship/Technology: research, surveying, institutions, tactics

Focus should guide how commands consume or benefit from capacities. It should
not require the player to manipulate detailed sliders every turn.

### Carryover

Unused capacity partially carries over with decay and caps.

General direction:

- Command carries over poorly.
- Administration and diplomacy carry over moderately.
- Scholarship/technology carries over well.

Carryover should be shown through capacity UI and hover/help details.

### Overclock

The player can redirect one capacity into another at reduced efficiency.

Two intensities exist:

1. Institutional redirection, such as scholars supporting military analysis or
   siege engineering.
2. Emergency human mobilization, such as scholars, officials, merchants, or
   workers being forced into direct defense or combat.

Emergency human mobilization should be costly, desperate, and clearly framed as
a crisis measure.

## Turn UX

The intended player-facing loop is:

1. strategic posture;
2. focus adjustment if needed;
3. core commands;
4. turn processing.

The player should not need to manually execute every low-level military,
economic, or information operation.

## Map-First Situation UX

Core command creation begins from the map.

Before the player creates a command, the map and briefing should show:

- important threats;
- conquest opportunities;
- defensive key points;
- uncertain areas needing scouting;
- route, pass, river, coast, or strait constraints.

Suggested visual language:

- red: military threat or invasion risk
- gold: high conquest value
- blue: defensive key point
- green: economic growth, recovery, or development value
- purple: uncertain information or scouting need
- silver/white: movement, supply, pass, strait, or route constraint

Only the current turn's most relevant locations should receive strong emphasis.

Briefing items should ping or pulse their map location. Hover should explain
why a location matters and how reliable the information is.

## Strategic Posture

Postures are guidance, not automatic bonuses.

They help the player interpret:

- which capacity is emphasized;
- which opportunity costs are accepted;
- which targets or fronts matter;
- which risks the posture creates.

Postures can be intentionally extreme. They should read as risky concentrated
strategies, not balanced always-good presets.

## Core Commands

Core commands are the center of player agency. They should avoid empty forms by
opening as prefilled command cards from map context.

Each command should contain:

- target province or front;
- intent;
- intensity/risk level;
- capacity and force sources;
- confidence level;
- preview of expected effects and risks.

The player chooses strategic intent and risk. The system resolves detailed
costs, force conversion, terrain effects, uncertainty, and turn timing.

Candidate Phase 1 command intents:

- scout
- attack
- reinforce
- mobilize
- prepare offensive
- defend pass/front
- consolidate/recover

Command cards can provide default values based on map situation, posture, and
focus. The player can accept defaults or adjust intensity and sources.

## Prediction Preview

Preview must not become a deterministic optimizer.

Show:

- result range, not exact guaranteed outcome;
- information confidence;
- primary causes;
- expected cost range;
- worst plausible cost;
- terrain/crossing/supply risks;
- population/economy impact;
- next-turn strategic implications.

Avoid exact win percentage as the main UI.

## Turn Processing

Internal processing can follow stages:

1. income and baseline recovery;
2. capacity allocation and carryover;
3. focus and overclock application;
4. scouting and information updates;
5. mobilization, garrison, movement, and supply resolution;
6. combat resolution;
7. losses, economic disruption, and risk hooks;
8. AI decisions;
9. strategic result report.

The player should not manually step through these stages.

## Result Report

Result reports should be strategic feedback, not raw logs.

Show:

- map changes;
- why major outcomes happened;
- troop, population, and economy losses;
- confidence changes from scouting;
- new threats or openings;
- next-turn decision pressure.

Remote or low-importance activity should be filtered, summarized, or deferred.

## Explicit Non-Goals For Phase 1

- Full domestic governance simulation.
- Deep inflation/public order/rebellion systems.
- Exact historical map recreation.
- Fully irregular province rendering.
- Manual control over every garrison and levy.
- Posture as hidden bonus mode.
- Recommendation-only auto-play.
- Exact deterministic combat calculator UI.

## Deferred Implementation Decisions

These are intentionally left for the implementation plan and mockup/build
validation. They do not change the accepted Phase 1 design direction.

- Initial 25 to 40 named province list.
- Concrete numeric ranges for population, economy, garrison, defense, and
  capacity generation.
- Carryover rates and caps per capacity.
- Overclock conversion rates and risks.
- Initial strategic posture presets.
- Initial command taxonomy and command card schema.
- Preview and result report schema.
- First mockup/build scope for validating the map-first UX.
