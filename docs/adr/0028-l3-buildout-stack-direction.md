# ADR 0028: L3 Build-Out Stack Direction — UI-Shell/Renderer Axis Split (Amends ADR 0016)

Date: 2026-07-10

Status: Accepted
Decision source: stack-direction discussion with the user, 2026-07-10
(L3 build-out / PvP boundary / renderer session).
Amended by: ADR 0039 (2026-07-16) — the forecast Stage 1 trigger has fired;
React + Vite are selected for the UI shell while the framework-free
JavaScript game runtime and independent renderer axis remain binding.
Amended by: ADR 0040 (2026-07-16) — the portability obligation is preserved,
but its source-language wording changes: canonical L3 logic is authored in
framework-free TypeScript and emitted as ESM JavaScript for browser and Node.
Amended by: ADR 0041 (2026-07-17) — the staged-evolution framing is unchanged,
but the L3 build's deployment target is stated rather than left to a Stage 2
trigger: the game does not ship as a statically-hosted web page, Firebase
Hosting is the marketing landing surface only, and the reference `js/` tree,
`tests/`, and the L2 harnesses are an archive rather than the build source.
Amends: ADR 0016 (2026-06-29) — its Layer 2 ("framework") is split into two
independent axes, UI-shell framework and map renderer; the L3 playtest
build-out is forecast as the likely Stage 1 trigger point; and
Unity-of-Command-class map presentation is confirmed to stay inside the web
stack (2D sprite rendering), not to trip the native-engine reservation
(see § Decision).

## Context

ADR 0016 settled the stack as four layers (language/runtime, framework,
build tooling, packaging) evolving on triggers: Stage 0 vanilla now, Stage 1
component framework when manual DOM maintenance becomes error-prone, Stage 2
native wrapper on a publishing decision. Native game engines were reserved
for a deliberate genre change toward real-time, animation-heavy, or
physics-heavy gameplay.

Since then the design program has minted a sealed rule set (combat formula
D1–D11/M1–M14, match arc, hegemony/domination victory) whose only
executable mirror is the L2 headless harness (`mockup/combat-calc/`,
explicitly never imported by `js/`; the sealed docs remain authoritative),
while the `js/` implementation trails the sealed design (acknowledged in
DESIGN.md). The test-trust ladder
(`docs/features/match-arc/TEST-LADDER.md`) defines L3 as human playtest —
the rung that exercises exactly what L2 is blind to by design: fog misreads,
scouting value, deception, and timing reads. Reaching L3 therefore requires
a real interactive build (fog reveal, situation-lens annotations, command
preview, blind/timed choices), which raises the question of what stack that
build-out uses.

Two further inputs shaped this decision:

- The visual ambition for the eventual real UI is Unity-of-Command-class
  map presentation — layered flat unit counters, painterly terrain tiles,
  front-line and supply overlays. The open question was whether that
  ambition re-opens ADR 0016's native-engine reservation.
- Asynchronous turn-based PvP has been discussed as a possible future
  direction. It is not in SPEC; SPEC contains no multiplayer requirement.

## Decision

1. **Stage 0 is unchanged, and the logic layer gains an explicit
   portability obligation.** Documentation and L2 simulation work continue
   on vanilla JavaScript with no build step. New in this ADR: the
   rules/logic layer stays framework-free plain JavaScript at every future
   stage, and the eventual L2→`js/` port must preserve Node/browser
   isomorphism (precedent: `mockup/combat-calc/map-gen.js` runs identically
   in both contexts) so ported modules remain battery-testable. ADR 0016
   observed this separation as existing practice; this ADR binds it.

2. **Layer 2 of the ADR 0016 model is split into two independent axes.**

   a. *UI-shell framework* (menus, panels, HUD, turn-state handling) — the
      Stage 1 axis. The L3 build-out is forecast as the likely Stage 1
      trigger point, because fog reveal, situation-lens annotations,
      command preview, and blind/timed-choice interfaces land together
      there. Operationally: beginning the L3 interactive build-out is the
      moment the Stage 1 trigger is evaluated against ADR 0016's criterion
      (manual DOM maintenance error-prone or blocking new UI work) — the
      forecast does not itself fire the trigger. Adoption of PvP would
      independently and decisively cross the trigger (asynchronous
      turn-state management is exactly the load a component framework
      carries well). The specific framework choice remains deferred to the
      trigger point, per ADR 0016.

   b. *Map renderer* (the strategic map surface) — a separate axis, not
      governed by the UI-shell framework choice; component frameworks
      manage component trees and state, they do not draw pixels.
      Unity-of-Command-class presentation is 2D sprite/tile composition
      (flat counters, painted tiles, overlay layers), not 3D, and does not
      trip ADR 0016's native-engine reservation. Evidence: Unity of
      Command 1 itself was implemented in Python on Pygame + Cairo — a
      software-rendered 2D blitting stack less capable than the browser's
      Canvas 2D. If and when a user-approved presentation/art-direction
      decision adopts that tier, the candidate class is a browser 2D
      sprite-rendering approach — hand-rolled Canvas 2D (the current
      `js/map.js` technique, which the UoC evidence shows can suffice) or a
      WebGL sprite-rendering library (PixiJS class) if layer count, sprite
      volume, or pan/zoom smoothness demand batching; the specific choice
      is deferred to that point and recorded as a future ADR.

3. **PvP remains a SPEC-level direction change** requiring a user-approved
   proposal; nothing in this ADR adopts it. L3 is satisfiable entirely
   client-side (hotseat / versus-bot); no server layer is required to
   reach L3.

## Consequences

- ADR 0016 is reaffirmed, not weakened: web stack, trigger-based
  evolution, native engines reserved for a genre change. The renderer
  clarification closes a misreading in which visual ambition alone would
  force an engine migration.
- The dominant long-term cost of the UI build-out is forecast to be art
  assets rather than engineering (basis: renderer and interaction work is
  one-time fixed cost, while terrain textures, unit icons, and panel art
  scale with content). Art-style selection (flat symbolic counters vs
  painterly illustration) is therefore a bottleneck lever and belongs on
  the future design session's agenda.
- Deferred choices are pinned to their trigger points: UI-shell framework
  (Stage 1 — evaluated at L3 build-out start), map-renderer approach (a
  user-approved decision to adopt UoC-class presentation), native wrapper
  (Stage 2, unchanged).
- The `js/` porting debt (implementation trailing the sealed design) exists
  independently of every choice above and precedes them in sequence: the
  rules must be ported before any of the deferred choices become urgent.
