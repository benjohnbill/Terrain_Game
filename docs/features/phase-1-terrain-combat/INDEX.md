# Feature: Phase 1 Terrain and Combat

## Purpose

Make conquest depend on terrain, regional value, local force, and realistic
costs instead of a single global military snowball.

## Current Status

Brainstorming and design framing.

## Key Inputs

- Core game remains world conquest.
- First major development phase should prioritize terrain/map/combat.
- Diplomacy, national management, and events follow in later phases.
- Local terrain and regional economy should drive military and population
  differences.
- Limited sea crossing should be included in the Phase 1 direction.
- The world may be designed at 50x50 scale, but active playable scope should be
  smaller and progressively opened.
- The first active Phase 1 area should be around 25x25 to 30x30, covering the
  central plains, southern grain regions, and part of the northern frontier.
- The active area should include about 25 to 40 named provinces to create
  regional identity and strategic causality.
- Naming should combine historically legible large regions with fictional
  East Asian-style province names.
- Province archetype regions should include expansion slots such as oasis,
  southern mountain/forest, steppe, maritime, and northern India routes.
- Existing terrain categories still apply as the physical rules layer beneath
  those archetype regions.
- Province identity should include a settlement/function layer. Start with
  about nine function categories and assign each province one primary function
  plus optional secondary function.
- Phase 1 uses combat + economy basics. Include regional population/economy,
  local garrison, defense, movement/crossing constraints, and strategic tags.
  Keep loyalty, unrest, inflation, and deep events as expansion hooks.
- Military strength should split into standing forces, local garrisons,
  offensive mobilization, and local defense / latent mobilizable population.
- The player should not manually execute every low-level military/economic step.
  Phase 1 should preserve high complexity with low micromanagement.

## Candidate Slice

Define terrain taxonomy and map-unit data first, then attach combat modifiers,
local garrisons, and AI target evaluation.

## Related ADRs

- `docs/adr/0001-terrain-first-east-asia-inspired-world.md`
- `docs/adr/0002-hex-first-province-compatible-map-units.md`
- `docs/adr/0003-large-world-active-region-simulation.md`
- `docs/adr/0004-named-provinces-over-terrain-layers.md`
- `docs/adr/0005-hybrid-historical-fictional-place-names.md`
- `docs/adr/0006-province-archetype-regions-use-terrain-layers.md`
- `docs/adr/0007-settlement-function-layer.md`
- `docs/adr/0008-phase-1-combat-economy-stat-scope.md`
- `docs/adr/0009-force-roles-and-mobilization-risks.md`
- `docs/adr/0010-high-complexity-low-micromanagement.md`
