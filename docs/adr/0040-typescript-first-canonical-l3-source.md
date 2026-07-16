# ADR 0040: TypeScript-First Canonical L3 Source With Incremental Legacy Porting

Date: 2026-07-16

Status: Accepted
Decision source: user final seal, 2026-07-16 ("응, 그 결정으로 최종
봉인").
Amends: ADR 0016 — Stage 1 changes the canonical source language while keeping
JavaScript as the execution runtime.
Amends: ADR 0028 — replaces the future "plain JavaScript" source-language
restriction with framework-free TypeScript emitted for browser/Node parity.
Amends: ADR 0039 — replaces its TypeScript non-adoption and JavaScript-source
clauses; React + Vite, the independent renderer axis, and the full-engine
reservation remain unchanged.

## Context

ADR 0039 correctly selected React + Vite and separated the UI shell, Game
Runtime, and map renderer. It incorrectly treated two different choices as
one: JavaScript as the code executed by browser and Node, and JavaScript as the
language in which canonical source must be authored. That produced a broader
TypeScript prohibition than the portability argument required.

The L3 UI and Game Runtime seam do not yet exist, so authoring them in
JavaScript first would create an avoidable second migration. TypeScript is most
valuable at exactly this seam: player intents, match events, viewer-safe
projections, authored-world inputs, and state transitions must remain coherent
across React, the renderer, Node tests, and headless runs.

The repository nevertheless contains valuable JavaScript assets: a playable
legacy route, implemented Slice 1–2 war modules, authored-map generators, and
hundreds of passing tests. Mechanically converting every historical file
before producing an L3 playable slice would discard their value as a stable
comparison surface and turn source cleanup into the product milestone.

## Decision

1. **Keep JavaScript as the host execution runtime.** Browser and Node execute
   emitted ESM JavaScript. TypeScript adds compile-time checking; it does not
   introduce a separate game runtime.

2. **Author all new canonical L3 production source in TypeScript/TSX from the
   start.** React UI modules use `.tsx`; the Game Runtime, domain/rule modules,
   renderer-facing projections, and shared contracts use `.ts`. New canonical
   production modules are not authored in JavaScript.

3. **Keep the Game Runtime framework-free.** TypeScript source does not weaken
   the seam established by ADR 0039. Rule and state-transition modules do not
   import React, access the DOM, own renderer objects, or depend implicitly on
   browser globals, time, or entropy.

4. **Port legacy JavaScript incrementally through playable vertical slices.**
   Existing `js/`, test, and `mockup/` files remain migration evidence,
   comparison surfaces, or historical measurement tools until replaced. A
   production module needed by the new L3 path is ported to TypeScript when its
   vertical slice crosses the seam; the project does not perform a repository-
   wide extension change or rewrite as a prerequisite.

5. **Do not make legacy JavaScript the permanent implementation behind a typed
   facade.** Temporary adapters may exist only as explicit migration devices.
   The target canonical L3 path is TypeScript/TSX source end to end, and each
   adapter must have a named retirement gate in the migration specification.

6. **Preserve behavioral evidence during each port.** Existing JavaScript
   tests remain active until the corresponding canonical TypeScript behavior
   has parity coverage. New canonical tests are authored against the
   TypeScript modules. Exact test runner, package boundary, compiler flags, and
   emitted-output parity commands are decided by the L3 Playable Seam
   Wayfinder; type checking is a required build gate, not an editor-only aid.

7. **Keep the renderer and packaging decisions independent.** This ADR does
   not select SVG, Canvas, PixiJS, a desktop wrapper, or a full game engine.
   ADRs 0016, 0028, and 0039 continue to govern those triggers.

## Consequences

- The canonical target is no longer "JavaScript rules behind TypeScript UI."
  UI, Game Runtime, and production domain modules share one TypeScript type
  system while remaining separate modules with separate responsibilities.
- The browser/Node isomorphism obligation applies to the emitted ESM
  JavaScript artifact and observable behavior, not to a `.js` source-file
  requirement.
- The new L3 tree does not accumulate fresh JavaScript migration debt. Existing
  debt is paid only along paths that create playable value.
- Legacy tests and the old playable route remain useful until parity and
  cutover gates permit retirement; TypeScript adoption does not justify a
  big-bang rewrite.
- Fog-of-War non-leakage can be enforced at the viewer-projection type seam,
  while runtime tests still enforce invariants that static types cannot prove.
- ADR 0039's Decision 2 and Decision 6 are amended only on source language.
  Its React + Vite choice, narrow Game Runtime seam, incremental migration,
  renderer independence, and full-engine reservation remain in force.
