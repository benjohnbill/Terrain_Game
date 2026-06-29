# Teach Session Handoff: Game Development Stack Literacy

Date created: 2026-06-29
Status: Ready to run (not yet delivered)
Related decision: `docs/adr/0016-web-stack-with-trigger-based-migration.md`

This is a self-contained brief for a future teaching session. It is
skill-agnostic: run it through a dedicated teach skill if one is installed, or
deliver it directly in a fresh conversation. The session voice follows the
global Korean honorific style (see CLAUDE.md / AGENTS.md); this document itself
is written in neutral English as a project artifact.

## Who this is for

The developer is building this game while learning, and has said they lack a
broad mental model of technology stacks — which is why stack decisions keep
recurring as anxious, hard-to-resolve questions. The goal of this session is
not to teach any single framework, but to install a durable mental model so the
developer can make and defend stack decisions independently.

## Learning objectives

After this session the developer should be able to, without assistance:

1. Name the four layers of a game's technology stack and place any concrete
   tool into the correct layer.
2. Explain why "changing the stack is hard" is true mainly at one layer, and why
   the other layers are evolution rather than rewrite.
3. Decide, for a proposed change, whether it is a cheap upper-layer evolution or
   an expensive language/runtime rewrite.
4. Explain why a turn-based, UI- and data-heavy strategy game is a good fit for
   web technology and a weak fit for a native game engine.
5. Explain how a web game reaches native/Steam distribution without an engine,
   and articulate the "let validated success fund the rewrite" principle.

## Core mental model (the centerpiece)

Teach the four-layer model and keep returning to it. Ground every layer in this
repository's actual files so it stays concrete, not abstract.

| Layer | What it is | This project now | Possible later | Cost to change |
| --- | --- | --- | --- | --- |
| 1. Language/runtime | What code is written in and what executes it | JavaScript in the browser engine | (unchanged) | High — this is the real "rewrite" |
| 2. Framework | How code is structured inside the runtime | none (manual DOM in `js/ui.js`) | Svelte or React for UI | Moderate, contained |
| 3. Build tooling | Turns source into shippable files | none (scripts loaded directly in `index.html`) | Vite | Low, additive |
| 4. Packaging/distribution | How it reaches players | a browser URL | Tauri or Electron, then Steam | Low, does not touch logic |

Key insight to land: the dread of "stack changes are hard" is almost entirely a
Layer 1 phenomenon. Layers 2-4 are incremental and reversible. Everything this
project might do (Vite, a UI framework, a native wrapper) lives in Layers 2-4
and never leaves JavaScript. The only Layer 1 change on the table would be a
native game engine, which the spec does not require.

## Topic sequence

1. The four-layer model, built up one layer at a time using this repo as the
   example. Have the developer classify each existing piece (`index.html`,
   `js/combat.js`, `js/ui.js`) into a layer.
2. Why domain logic vs UI separation matters: open `js/combat.js` (pure logic,
   tested in Node) next to `js/ui.js` (DOM). Show that the first is
   framework-agnostic and the second is the part a framework would replace. This
   separation is what makes a future Layer 2 change cheap.
3. The web framework landscape, demystified: vanilla JS vs component frameworks
   (React, Svelte, Vue), what a build tool (Vite) does, and what Next.js
   actually is — a server-rendering web-application framework whose core value
   (SSR, routing, server components, API routes) is unused by a single-player
   client-side game. This corrects the common "Next.js = modern web" assumption.
4. Game engines vs web for this genre: where Godot/Unity win (real-time,
   physics, animation, 3D, native builds) and why those strengths are mostly
   idle in a turn-based, UI- and data-heavy strategy game, while HTML/CSS is
   best-in-class for dense UI.
5. Distribution and the Vampire Survivors case study: Phaser/JavaScript ->
   itch.io browser game -> Steam as a JavaScript bundle -> Unity port only after
   success. Derive the principle: build cheaply to validate, and let success pay
   for any expensive rewrite, rather than paying the Layer 1 cost speculatively.
6. Apply it back to this project: walk through ADR 0016's trigger-based stages
   (0 -> 1 -> 2) and have the developer state, in their own words, which trigger
   would move the project to the next stage.

## Comprehension checks

Use these to confirm the model took hold, not just the conclusion:

- "I want to add Vite and move the UI to Svelte." Which layer(s), and is it a
  rewrite? (Expected: Layers 2-3; not a rewrite; logic modules stay.)
- "I want to ship on Steam." Which layer, and does it touch game logic?
  (Expected: Layer 4 wrapper; no logic rewrite.)
- "I want to rebuild in Godot." Which layer, and what would justify it?
  (Expected: Layer 1 rewrite; justified only by a real-time/physics genre shift
  or validated success funding a port.)
- "Do I need a server for Phase 3 national management?" (Expected: no; it is
  single-player client-side state; a server is driven by multiplayer/accounts,
  not by simulation depth.)

## Materials to load before the session

- `docs/adr/0016-web-stack-with-trigger-based-migration.md` — the decision this
  session explains and reinforces.
- `SPEC.md` (Phase Roadmap) and `DESIGN.md` ("Current Prototype") — to ground
  the single-player, client-side nature of every phase.
- `js/combat.js` and `js/ui.js` — concrete examples of the logic/UI separation.

## Notes for the instructor

- The aim is independence, not agreement. The developer should leave able to
  re-derive the recommendation, not just recall it.
- Keep correcting one specific misconception if it surfaces: that publishing to
  Steam, or deepening the simulation, requires leaving web technology. It does
  not.
