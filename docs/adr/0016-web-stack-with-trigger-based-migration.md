# ADR 0016: Web Technology Stack With Trigger-Based Migration Path

Date: 2026-06-29

Status: Accepted
Amended by: ADR 0028 (2026-07-10) — Layer 2 is split into UI-shell framework
vs map renderer; the L3 playtest build-out is forecast as the Stage 1
trigger point; Unity-of-Command-class 2D map presentation is confirmed
in-stack (browser 2D sprite rendering — Canvas 2D or a WebGL sprite
library), not a native-engine trigger; the logic layer's Node/browser
isomorphism becomes a binding obligation (see § Decision).

## Context

The project is a static HTML/CSS/JavaScript browser application (DESIGN.md,
"Current Prototype"). The spec roadmap (SPEC.md) extends the single-player,
turn-based simulation through diplomacy (Phase 2), national management
(Phase 3), and events (Phase 4). None of these phases introduce multiplayer,
shared-world state, accounts, or server-authoritative logic.

The product ambition includes possible publishing, including a native/desktop
release on a store such as Steam. The UI is expected to grow substantially as
later phases add diplomacy screens, governance dashboards, and event
interactions; `js/ui.js` already exceeds 600 lines of manual DOM manipulation.

The open question was whether to keep the current web stack, replace it with a
web application framework such as Next.js, or replace it with a native game
engine such as Godot or Unity — asked specifically because changing a
technology stack later is understood to be expensive.

Three independent concerns were conflated in that question and are separated
here:

- Server need is driven by multiplayer, cross-device sync, or accounts. The
  spec requires none of these, so a turn-based single-player simulation runs
  entirely client-side through Phase 4.
- Native-engine value is driven by real-time rendering, physics, animation, and
  3D, plus native store distribution. This genre is dominated by UI, text, and
  data, where HTML/CSS is a strong fit; the engine's core strengths would go
  mostly unused.
- UI-architecture pressure is driven by growing interface-state complexity. This
  is the only concern that is already active.

A web-technology game can reach top-tier indie success and ship to a native
store without a native engine. Vampire Survivors was built with the Phaser
JavaScript framework, launched as a free itch.io browser game (2021), shipped to
Steam as a JavaScript bundle, and was ported to Unity only after it became a
hit — funding the rewrite with validated success rather than undertaking it
speculatively up front.

## Decision

Keep the web technology stack. Do not adopt Next.js. Do not migrate to a native
game engine at this time.

Model the stack as four layers and constrain future change to the upper layers:

1. Language/runtime — JavaScript on the browser engine. Not changed.
2. Framework — none for UI today; a client-side component framework may be
   adopted later.
3. Build tooling — none today; a bundler may be adopted later.
4. Packaging/distribution — a browser URL today; may later be wrapped for native
   distribution.

Evolve on triggers rather than speculatively:

- Stage 0 (now): plain HTML/CSS/JavaScript, no build step. Keep domain-logic
  modules (combat, ai, capacity, faction, and similar) framework-agnostic and
  separated from the UI layer.
- Stage 1 (trigger: manual DOM UI maintenance becomes error-prone or blocks new
  UI work): introduce a client-side build tool (e.g., Vite) and migrate the UI
  layer to a component framework (e.g., Svelte or React). Domain-logic modules
  remain plain JavaScript.
- Stage 2 (trigger: a decision to publish a native/desktop build): wrap the
  existing web build with a native shell (e.g., Tauri or Electron) and integrate
  the store SDK. No rewrite of game logic.

A move to a native game engine (Godot/Unity) is reserved for a deliberate genre
change toward real-time, animation-heavy, or physics-heavy gameplay, which the
current spec does not require.

## Consequences

- The existing codebase is preserved; no rewrite is incurred now, and the
  Steam/native ambition does not force an engine choice — it is satisfied at
  Stage 2 by a native wrapper over the same web build.
- Changing the stack is genuinely expensive only at the language/runtime layer
  (Layer 1). The changes this decision anticipates (Layers 2-4) are incremental
  and reversible and never leave JavaScript, so "stack change is hard" does not
  block them.
- The single discipline that keeps future migration cheap is maintaining
  separation between framework-agnostic domain logic and the UI layer. This is
  already the project's structure: logic modules are exercised by tests in a
  Node context without a framework. Preserving that separation is the concrete
  obligation created by this ADR.
- The specific Stage 1 component framework (Svelte vs React) and Stage 2 wrapper
  (Tauri vs Electron) are deferred to their trigger points and recorded as
  future ADRs when reached.
- The decision keeps the project within the high-complexity, low-micromanagement
  direction (ADR 0010) and the incremental-slice approach by avoiding a
  speculative platform rewrite.
