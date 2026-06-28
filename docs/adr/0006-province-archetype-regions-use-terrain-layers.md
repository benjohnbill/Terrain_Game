# ADR 0006: Province Archetype Regions Use Terrain Layers

Date: 2026-06-29

Status: Accepted

## Context

The first active campaign needs province archetypes that are easy to understand
and grounded in East Asian geography. Real Chinese geographic structure is a
useful starting point, but the game also needs expansion slots for maritime,
steppe, oasis, southern mountain, and northern India routes.

The project has already accepted terrain-first design and named provinces. The
relationship between broad province archetype regions and terrain categories
must be explicit.

## Decision

Use broad province archetype regions to organize named provinces.

Initial and expandable archetype regions include:

- Central Plains;
- Guanzhong Passes;
- Hebei and Northern Plains;
- Northeastern Frontier;
- Han/Jing River Corridor;
- Jiangnan Grain Belt;
- Southwestern Basin;
- Southeastern Coast and Straits;
- Northwestern Oasis and Desert Corridor;
- Southern Mountain and Forest Frontier;
- Steppe Frontier;
- Northern India Route.

These archetype regions are not terrain types. They are geographic/historical
frames for province design.

The terrain rules layer still uses physical terrain categories such as:

- plains;
- grain basin;
- mountain/pass;
- river overlay;
- coast/strait;
- steppe/highland;
- frontier basin.

Each archetype region should be expressed as a composition of terrain layers.
For example, Guanzhong Passes may combine plains, mountains, passes, and river
access; Jiangnan Grain Belt may combine grain basin, river overlay, and coast;
Northwestern Oasis and Desert Corridor may combine frontier basin, steppe or
highland, and mountain/pass constraints.

## Consequences

Designers can reason about immersion through archetype regions while gameplay
systems still operate on terrain and province data.

Expansion regions can be planned early without requiring full Phase 1
implementation.

Province generation, AI evaluation, events, economy, and combat should not
treat broad archetype labels as direct mechanical rules. They should inspect
terrain composition, province stats, and strategic tags.
