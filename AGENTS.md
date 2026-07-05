# Terrain Game Agent Guide

## Project Context

Terrain Game is a browser-based turn strategy prototype evolving from a simple
world-conquest hex game into a terrain-first national management and conquest
game.

Conversation with the user should follow the global Korean honorific style.
Generated project artifacts should use neutral professional language.

## Domain Terminology Policy (adopted 2026-07-05)

- Canonical domain vocabulary lives in `DOMAIN_MAP.md` and the feature
  glossaries (`docs/features/*/GLOSSARY.md`). Use registered terms only —
  in conversation, documents, and code alike.
- The canonical identifier is the **industry-standard English term**
  (e.g., hermit kingdom, power projection, decisive victory, peace
  terms). Korean display names are paired in the glossaries for UI copy
  and briefing sentences; do not invent ad-hoc Korean translations in
  conversation — use the English term directly. Abbreviations are fine
  after introducing the full form once in parentheses.
- Coining a new term mid-work requires an explicit `[조어]`/`[coinage]`
  tag, and the term must be registered into the relevant glossary or
  discarded within the same exchange — no silent vocabulary growth.
- Glossary entries pair three columns: Korean display name ↔ standard
  English identifier (matching code identifiers) ↔ definition.
- Document-side rules — tier ladder (where terms may be DEFINED),
  single-definition rule, promotion, and the generated Quick Reference
  — live in `DOMAIN_MAP.md` § Vocabulary Law.

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
