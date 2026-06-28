# ADR 0003: Large World With Active Region Simulation

Date: 2026-06-29

Status: Accepted

## Context

The desired world should feel geographically large enough to support an
East Asia-inspired continent, straits, islands, maritime routes, northern
steppe pressure, and a future northern India expansion path.

A 50x50 world grid is attractive as a world-data scale, but exposing all 2,500
tiles as immediate per-turn decision points would overload the player and slow
gameplay design validation. The project needs to preserve large-world
ambition while keeping Phase 1 playable and testable.

## Decision

Support a large world-data scale such as 50x50.

Do not require the whole world to be fully playable, fully simulated, and fully
logged from the first turn. Use an active-region model:

- only selected regions are initially playable;
- inactive regions may exist as terrain and world data before becoming active;
- simulation detail can increase when a region enters the player's influence,
  diplomatic awareness, scouting range, or campaign scope;
- low-importance remote activity can be summarized or deferred;
- logs should be filtered by importance and player relevance;
- some remote outcomes may be resolved retroactively when they become relevant,
  as long as the result is consistent and explainable.

For the first Phase 1 campaign, activate roughly a 25x25 to 30x30 area centered
on the central plains, southern grain regions, and part of the northern
highland/steppe frontier. This should provide enough terrain variety for combat
testing without exposing the full 50x50 world as detailed turn-by-turn gameplay.

## Consequences

The map can be authored at a large scale without forcing every tile into the
initial gameplay loop.

AI and event systems should eventually distinguish between active detailed
simulation and abstract background simulation.

The UI should support relevance filtering so the player sees important local,
strategic, and diplomatic events instead of raw world noise.

This decision makes camera, zoom, region activation, scouting/influence, and
log importance future design concerns.

The first active area should be large enough to include meaningful differences
between plains, rivers, grain basins, mountains/passes, northern frontier, and
coastal access if the authored layout supports it.
