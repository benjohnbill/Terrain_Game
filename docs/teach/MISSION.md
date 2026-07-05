# Mission: Game Development Stack Literacy

## Why

The developer is building Terrain Game while learning, and stack decisions keep
recurring as anxious, hard-to-resolve questions — because there is no durable
mental model of how a technology stack is layered. The goal is to make and
*defend* stack decisions independently: to re-derive the recommendation in
ADR 0016, not merely recall it.

## Success looks like

- Name the four layers of a game's tech stack and place any concrete tool
  (Vite, Svelte, React, Tauri, Electron, Next.js, Godot) into the correct layer.
- Decide, for a proposed change, whether it is a cheap upper-layer evolution or
  an expensive Layer-1 language/runtime rewrite.
- Explain why a turn-based, UI- and data-heavy strategy game fits web technology
  and weakly fits a native game engine.
- Explain how a web game reaches Steam/native distribution without an engine,
  and articulate the "let validated success fund the rewrite" principle.

## Constraints

- Learning while building; conversation voice is Korean honorific, lesson
  artifacts are neutral English.
- Self-taught; can write features in vanilla JS but lacks the broad stack mental
  model — that gap is exactly what this mission closes.
- Every layer must be grounded in this repository's actual files, never taught
  as abstraction.

## Out of scope

- Teaching any single framework's API (React/Svelte/Vue syntax).
- Multiplayer or server architecture — the spec is single-player, client-side
  through Phase 4.
- Actually migrating the stack now. ADR 0016 says evolve on triggers, not
  speculatively.
