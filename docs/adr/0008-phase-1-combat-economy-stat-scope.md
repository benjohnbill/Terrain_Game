# ADR 0008: Phase 1 Combat and Economy Stat Scope

Date: 2026-06-29

Status: Accepted

## Context

Phase 1 exists to improve the core land-conquest fun. Terrain is prioritized
because geography directly shapes war, expansion routes, and competition for
valuable land.

The game also needs regional population and economy differences. If Phase 1
only adds combat modifiers, regions will still feel too generic and military
dominance may remain the single obvious strategy. If Phase 1 adds full domestic
governance, the scope will drift into later phases before the conquest loop is
proven.

## Decision

Use a combat + economy basic stat scope for Phase 1.

Phase 1 province/map-unit stats should include:

- terrain composition;
- primary and optional secondary settlement/function;
- population or population weight;
- economic value or income base;
- local garrison;
- defense value or fortification value;
- movement/crossing constraints such as river, mountain, coast, and strait;
- strategic tags for AI evaluation.

Phase 1 should not fully implement domestic governance systems such as
inflation, loyalty, public order, rebellion chains, or deep event simulation.
However, data structures and naming should leave room for those systems.

## Expansion Hooks

Reserve concepts and fields for later phases where practical:

- loyalty or unrest tendency;
- supply pressure;
- war exhaustion;
- event hooks;
- governance importance;
- trade connectivity;
- recruitment pool;
- province devastation or recovery.

These hooks should not become required gameplay in the first Phase 1 slice.

## Consequences

The first terrain/combat redesign can make land value meaningful without
absorbing the entire national-management roadmap.

AI can evaluate targets by terrain, economy, population, garrison, and strategic
tags instead of raw adjacency or global strength.

Later diplomacy, governance, and event systems can attach to the same province
model without rewriting the terrain foundation.
