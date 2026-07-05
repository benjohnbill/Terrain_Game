# Terrain Game Agent Guide

## Project Context

Terrain Game is a browser-based turn strategy prototype evolving from a simple
world-conquest hex game into a terrain-first national management and conquest
game.

Conversation with the user should follow the global Korean honorific style.
Generated project artifacts should use neutral professional language.

## Documentation & Terminology Law

The full law — document layer taxonomy (Direction / Projection /
Record / Production / Working / Sanctuary), conflict rule, ADR
supersession protocol, vocabulary rules (English-canonical
identifiers, definition tiers, coinage duty), and the session-close
ritual — lives in `.claude/rules/documentation-law.md` (auto-loaded
for Claude Code). Codex and other agents MUST Read that file before
any documentation or terminology work in this repo.

## Read Order

Before substantial work, read:

1. `SPEC.md` - product and gameplay goals.
2. `DESIGN.md` - current architecture and phased design direction.
3. `DOMAIN_MAP.md` - domain vocabulary and verified/assumed terms.
4. `docs/adr/` - accepted design decisions.
5. `docs/features/<feature>/INDEX.md` - active feature context, when relevant.

## Current Direction

- Phase 1 focuses on terrain, regional value, and combat.
- The world model is East Asia-inspired but fictional and extensible.
- The implementation may start with hexes, but the design must not block a
  later move to province-style irregular maps.
- Avoid feature work before the current design/spec is approved.

## Design Guardrails

- Keep Phase 1 war and regional systems grounded in legible real-world
  intuitions. Terrain, fortifications, population, economy, local garrisons,
  routes, and post-battle recovery should behave plausibly even when represented
  with simple MVP placeholders.
- Avoid treating conquest or control as an instant full-value transfer. Control
  and route access can change immediately, while economy, population, garrison,
  and recovery may lag until deeper governance systems are introduced.

## Verification

This is currently a static HTML/CSS/JavaScript app. Use a local static server
for browser verification.

```bash
python3 -m http.server 8007
```

Then open `http://localhost:8007`.
