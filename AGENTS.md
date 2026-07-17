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

The **reference prototype** (`index.html` + `js/`) is a static
HTML/CSS/JavaScript app. Use a local static server to view it.

```bash
python3 -m http.server 8007
```

This is how you inspect the archive — it is **not** a description of what the
project is building. See § Environments below before assuming the target shape.

Node-side checks (these cover the sealed war model, which the prototype page
does not load):

```bash
npm test          # Node test suite
npm run lint:docs # documentation-governance audit
```

## Environments (ADR 0041)

Two isolated environments. Do not let one imply anything about the other.

- **Marketing landing** — Firebase Hosting serves the landing page only. It
  markets the product and will later carry download integration. It is not the
  game's shipping channel, and its stability is not a constraint on game
  architecture.
- **Game runtime (L3, under construction)** — does **not** ship as a
  statically-hosted web page. A browser is a development and playtest host, not
  the distribution target; the intended destination is a native shell (Electron
  or Tauri — the specific choice stays deferred, ADR 0016 Stage 2).

**The reference archive.** `js/`, `tests/`, the L2 harnesses
(`mockup/combat-calc/`, `mockup/operational-layer/`), and the existing mockups
are **reference, not build source**. Consult them as evidence — sealed
behavior, fixtures, executable models, measurement harnesses, craft precedent.
Accepted behavior reaches L3 by being re-implemented from its **authoritative
contract** (the feature's GLOSSARY / RULINGS / model docs), verified against the
archive — not by translating the file. The archive is not a parity comparator
for behavior it never ran: `index.html`/`game.html` load none of the eight
sealed slice-2 war modules.

**Canonical L3 source occupies its own directory tree**, separate from the
archive. The exact boundary is Wayfinder gate 05's decision, not settled here.

Authority: `docs/adr/0041-environment-isolation-and-reference-archive.md`.
Do not restate it — point at it.

Then open `http://localhost:8007`.
