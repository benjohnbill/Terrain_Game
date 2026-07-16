# ADR 0039: React + Vite UI Shell and Framework-Free JavaScript Game Runtime

Date: 2026-07-16

Status: Accepted
Decision source: user confirmation, 2026-07-16 ("그렇게 결정할게. UI 및
runtime.")
Amended by: ADR 0040 (2026-07-16) — separates execution runtime from source
language: new canonical UI and Game Runtime source is TypeScript/TSX, emitted
as JavaScript; legacy JavaScript is ported incrementally rather than retained
as the target source architecture.
Amends: ADR 0016 — fires its Stage 1 trigger and selects the component
framework and build tool previously deferred.
Amends: ADR 0028 — resolves its deferred UI-shell choice while preserving the
UI-shell/map-renderer axis split and the Node/browser portability obligation.

## Context

The L3 build-out must put the authored strategic map and the sealed war model
behind a player-operable interface. That interface carries enough coordinated
state — map selection, situation reading, command preview, turn flow, fog and
result feedback — that continuing to grow manual DOM orchestration would now
block or make the work error-prone. This is the Stage 1 condition forecast by
ADRs 0016 and 0028.

The stack discussion also exposed an ambiguity in the phrase "vanilla
JavaScript runtime." Three different concerns must remain separate:

- the host runtime in which code executes;
- the game runtime that owns match state and applies game rules; and
- the UI shell and map renderer through which the player observes and commands
  that runtime.

The game is deterministic, turn-based, map- and information-heavy, and already
needs the same rule behavior in browser play, Node tests, and headless
simulation. It does not currently need the physics, real-time scene loop, or
native-first toolchain of a full game engine.

## Decision

1. **Fire Stage 1 for the L3 interactive build-out.** Use **React** for the UI
   shell and **Vite** for development and production build tooling. React owns
   presentation and interaction state such as panels, selections, command
   forms, and feedback; it does not own authoritative game rules or match
   state transitions.

2. **Keep JavaScript as the execution runtime and game-core implementation.**
   The browser JavaScript engine remains the shipping runtime. The authoritative
   game runtime is implemented as framework-free **modern ESM JavaScript** and
   remains executable in both browser and Node environments.

3. **Give the game runtime a narrow, explicit boundary.** UI input crosses the
   boundary as player intent; the runtime validates and resolves that intent,
   advances authoritative state, and exposes resulting state and events. The
   exact API shape is an implementation decision, but the boundary must keep
   React, DOM access, renderer objects, and browser globals out of rules and
   state-transition modules.

4. **Migrate incrementally.** Existing global-script or mixed-module code is
   evidence and migration input, not the target architecture. L3 work should
   move required paths behind the runtime boundary without requiring a
   speculative whole-repository rewrite.

5. **Keep the map renderer independent.** This ADR does not select Canvas,
   SVG, PixiJS, or another rendering implementation. React may host and
   coordinate the map surface, but measured rendering needs determine that
   separate axis under ADR 0028.

6. **Do not adopt a full game engine or TypeScript through this decision.** A
   native/full game engine remains reserved for the genre-change trigger in
   ADR 0016. The game core stays JavaScript for this build-out; a future source
   language or type-system change requires its own evidence and amendment.

## Consequences

- React + Vite are no longer tentative candidates. They are the target UI
  shell and build tool for the L3 playable build.
- "Game runtime" now means the framework-free match-state/rules boundary, not
  the React component tree and not the browser's global script environment.
- The same authoritative rules can support interactive play, regression tests,
  replay/event inspection, bots, and headless balance runs without UI imports.
- UI and rules can evolve independently: React can be replaced or reorganized
  without rewriting combat, and the renderer can be upgraded without moving
  authoritative state into drawing code.
- The immediate seam work includes establishing the runtime boundary and
  placing the authored map and war-model interaction behind the React UI; it
  does not include a full-engine migration or renderer rewrite by default.
