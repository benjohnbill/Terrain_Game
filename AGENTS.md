# Terrain Game Agent Guide

## Project Context

Terrain Game is a turn-based strategy game about terrain-first national
management and conquest. Its world is East Asia-inspired but fictional.

Two things exist under this name, and confusing them has already cost real work:

- **The reference prototype** — a static browser hex game about world conquest
  (`index.html` + `js/`). It is the project's origin and is now an **archive**:
  evidence to consult, not the thing being built. See § Environments.
- **The L3 build** — the game the project is actually building: the settled
  design, played by a human on the authored world. It is under construction, it
  does not ship as a static web page, and it does not inherit the prototype's
  architecture. See § Current Direction.

When a document says "the game" without saying which, check before assuming.
A present-tense fact about the prototype is not a statement about the target.

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
4. `docs/adr/` - accepted design decisions. **Read the ones that bound your
   task, not just the recent ones.** A decision recorded here and never cited
   is how the project has actually gone wrong before (ADR 0041 § Context).
5. `docs/features/<feature>/INDEX.md` - active feature context, when relevant.
6. `.scratch/<tracker>/` - **the live work**: open decisions, their evidence,
   and the tickets they gate. Docs 1-5 record what is settled; the trackers are
   where the unsettled work is. See § Issue tracker.

## Current Direction

**Now:** the **L3 playable build** — making the settled design playable by a
human on the authored world, for one complete match. It is planned through the
Wayfinder decision gates in `.scratch/l3-playable-seam/` and built through the
tickets in `.scratch/l3-playable-build/`. No implementation ticket is
authorized until its named decision gates close. Start at
`.scratch/l3-playable-seam/map.md`.

Standing direction:

- Phase 1 scope is terrain, regional value, and combat.
- The world model is East Asia-inspired but fictional and extensible.
- **Geography is sealed, not tentative.** The world is
  province → front sector → hex: the **front sector** is the operational atom
  (ADR 0032, `DOMAIN_MAP.md`), and hexes are its substrate. The hex grid's
  orientation and resolution are **frozen** — changing them is seed-reauthoring
  tier (terrain-cradle RULINGS TC-⑪). The old "may start with hexes, but do not
  block a later move to province-style maps" caution is discharged: that move is
  what the sector world already is.
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
python3 -m http.server 8007   # then open http://localhost:8007
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

## Issue tracker

Issues and specs live as local Markdown under `.scratch/<tracker>/`. Config and
conventions: `docs/agents/issue-tracker.md`.

Live trackers:

- `.scratch/l3-playable-seam/` — the L3 Wayfinder: decision gates, their
  evidence, and the assembled constraint ledger. **Front door: `map.md`.**
- `.scratch/l3-playable-build/` — the nine L3 implementation tickets. All
  `needs-info` until their gates close; `README.md` carries the execution
  protocol.
- `.scratch/doc-structure/` — documentation-governance work.
- `.scratch/war-model-slice2/` — landed (tickets 01–11); kept as record.

Trackers are Working layer: consult them for what is *being decided*. Current
truth lives in the seal chain (§ Documentation & Terminology Law), not here.

**Triage labels** — the five canonical roles, each label string equal to its
name, recorded on a `Status:` line in the issue file. See
`docs/agents/triage-labels.md`.
