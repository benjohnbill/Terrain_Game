# L3 Playable Seam Wayfinder Map

Label: wayfinder:map
Status: open

## Destination

Produce the settled decision set needed to author implementation-ready specs
for an L3 build in which the authored map and settled Slice 1–2 behavior are
playable through a React + Vite + TypeScript/TSX UI and framework-free
TypeScript Game Runtime, emitted as ESM JavaScript for browser and Node, for
one complete match.

## Notes

- **Workflow:** Wayfinder decisions → feature specs → implementation tickets →
  implementation. This map plans; it does not carry implementation.
- **Tracker:** local Markdown under `.scratch/`, per
  `docs/agents/issue-tracker.md`.
- **Stack already adopted:** React + Vite + TypeScript/TSX. Every new canonical
  L3 production module, including Game Runtime and domain/rule modules, is
  authored in TypeScript/TSX; browser and Node execute emitted ESM JavaScript.
  Existing JavaScript is ported through playable vertical slices and retained
  only until parity and cutover gates permit retirement (ADR 0040). This map
  decides migration shape, not whether to reopen the stack choice.
- **Functional Fog of War is part of L3 completion:** temporary development
  disclosure is allowed only during migration. The completed L3 path must make
  scouting visibly change the estimate band and command preview, and must not
  expose hidden true state to React or the renderer.
- **Architecture discipline:** consult `codebase-design`; the Game Runtime is a
  deep module behind a small interface at the seam. React, DOM, renderer
  objects, browser globals, time, and entropy do not become implicit rule
  dependencies.
- **Decision sessions:** grilling tickets use `grilling` + `domain-modeling`,
  one question at a time. Prototype tickets use `prototype` and require live
  user reaction. Never resolve more than one non-research ticket per session.
- **Documentation:** follow `.claude/rules/documentation-law.md`. Ticket answers
  remain Working-layer evidence; accepted cross-feature architecture decisions
  promote through the ADR supersession protocol when specs are authored.
- **Repository safety:** the main worktree contains unrelated in-flight changes.
  Do not rewrite, stash, or commit them as part of a decision ticket. Use
  `/usr/bin/git` when repository history is needed.
- **Working synthesis:** [L3 Playable Seam — Working Umbrella Spec](spec.md)
  captures the approved destination and standing architecture for agent-driven
  Wayfinder closure. It is not the final Production spec partition and does not
  close any open decision ticket.

## Decisions so far

<!-- Closed ticket pointers are appended here. Open tickets are discovered by
     scanning the child issue files, not listed on the map. -->

- [Verify Vite, TypeScript, ESM, and Legacy CommonJS Coexistence](issues/04-research-toolchain-coexistence.md) — root CommonJS, a scoped ESM boundary, Vite/static artifact assembly, and exact emitted-output parity can coexist without a root module flip; topology choices remain open ([report](research/toolchain-coexistence.md)).
- [Preserve or Replace the Legacy Play Path?](issues/01-choose-migration-topology.md) — use a parallel-strangler topology: preserve `game.html` as the bounded legacy comparator while the separate canonical L3 path reaches parity, promote L3 into the stable public play-path role, use static-artifact rollback, and retire the legacy path after its named cutover gate.
- [Define Game Runtime Authority and Its Interface](issues/02-define-game-runtime-authority.md) — the Runtime privately owns match truth; viewer projection is the single blur seam; preview is a pure module outside the Runtime; bots are ordinary callers; turn order stays in the Runtime while pacing stays outside; authored-world identity, seed, and ordered intent log form the canonical durable representation.

## Not yet specified

- **Persistence and replay product surface beyond one uninterrupted match.**
  Authored-world identity, seed, and ordered intent log are the canonical
  durable representation, and no snapshot API ships by default. A save/load or
  replay UI and cross-version replay policy remain unsized product work.
- **Renderer upgrade measurements.** Concrete layer-count, pan/zoom, and sprite
  performance thresholds for considering PixiJS depend on the representative
  map/Fog prototype. Until then, renderer replacement remains only a trigger.
- **Long-term information presentation.** Battle-report inference, predictive
  reconnaissance, and richer historical intel depend on the L3 viewer-knowledge
  contract and the first human playtest signal.

## Out of scope

- Slice 3 settlement and Slice 4 defense-mechanic design or implementation;
  the L3 interfaces must leave an extension path, but this effort does not
  legislate those mechanics.
- Final art direction, asset production, animation polish, and a PixiJS upgrade
  without measured renderer pressure.
- PvP, accounts, servers, authoritative networking, and anti-cheat.
- Desktop/native packaging, store integration, and a full game-engine migration.
- A big-bang rewrite of every legacy JavaScript module or test.
- Casual/Challenge Fog profiles, terrain concealment, espionage, deception,
  and predictive-reconnaissance mechanics.
