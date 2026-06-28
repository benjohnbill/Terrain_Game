# ADR 0002: Hex-First, Province-Compatible Map Units

Date: 2026-06-29

Status: Accepted

## Context

The current prototype already renders and interacts with a hex map. The user
wants the long-term game to feel less like uniform board-game hexes and more
like continuous geography, with the possibility of finer or more irregular
regional units as the world grows.

Replacing the map renderer immediately would slow down the first gameplay
upgrade and distract from the terrain/combat design.

## Decision

Keep hex rendering for the first implementation phase.

Treat each hex as a `map unit` with region-like data:

- terrain,
- economy,
- population,
- local garrison,
- defense,
- river/coast/strait relationships,
- resource and strategic tags.

Avoid design and code language that assumes all map units must forever be
uniform hexes. Future irregular provinces should be able to reuse the same map
unit concepts.

## Consequences

Phase 1 can build on the existing codebase while keeping a path open to a
future irregular map.

Implementation should separate gameplay data from canvas-specific hex drawing
where practical.
