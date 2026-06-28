# ADR 0004: Named Provinces Over Terrain Layers

Date: 2026-06-29

Status: Accepted

## Context

The desired immersion is closer to Romance of the Three Kingdoms or a
historical grand strategy game than to a generic board of terrain-colored
tiles. Terrain types alone are not enough. Regions need identity, history,
population weight, strategic value, and relationships to surrounding regions.

At the same time, the first active Phase 1 area should stay manageable for
implementation and balancing.

## Decision

Use a layered map model:

1. Terrain and geography layer: physical conditions such as plains, mountains,
   rivers, coasts, straits, basins, and highlands.
2. Named province layer: 25 to 40 medium-sized provinces in the first active
   Phase 1 area.

Each named province should be made from one or more map units and carry its own
identity data:

- name,
- regional archetype,
- population weight,
- economy profile,
- terrain composition,
- strategic role,
- historical or fictional background,
- loyalty/unrest tendency,
- resource or military significance,
- possible event hooks.

## Consequences

Gameplay can reference recognizable regional identities instead of only generic
terrain bonuses.

The first active area can support meaningful regional causality: controlling a
pass, grain basin, river junction, frontier, or coast should matter beyond raw
tile count.

The terrain taxonomy remains the rules engine language, while named provinces
provide immersion and strategic narrative.

Future national management and event systems should attach many effects to
provinces rather than only to individual tiles.
