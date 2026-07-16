# L3 Playable Seam — Working Umbrella Spec

Status: ready-for-agent
Layer: Working (local issue-tracker publication)
Implementation readiness: blocked by the named Wayfinder gates in Further Notes
Record basis: ADR 0016, ADR 0028, ADR 0037, ADR 0038, ADR 0039, ADR 0040

> This document synthesizes the approved destination and standing architecture.
> It does not replace the authoritative feature definitions it references.
> Production routing and terminology promotion are intentionally deferred to a
> later documentation audit after the Wayfinder decisions are closed.
> This revision supersedes the earlier assumption that L3 promotion requires
> broad parity with the legacy browser application. Only deliberately retained
> behavior receives a parity gate; L3 completion is judged against the accepted
> Production contract.

## Problem Statement

The authored strategic map, the intended player-facing experience, and the
settled Slice 1–2 rules do not currently form one playable game. The existing
browser route can be played, but it resolves war through legacy combat and
global-script orchestration. The newer headless and test surfaces mix faithful
rule implementations with known R14 placeholders scheduled for replacement.
No person has operated the accepted authored world and settled rule set through
the intended situation-reading, Fog-of-War, command-preview, and turn-flow
experience.

The user needs an L3 human-playtest build that makes one complete match
playable on the authored world. Reaching that build must not make React the
owner of game rules, leak hidden enemy truth through the map renderer, replace
the renderer without evidence, or turn TypeScript adoption into a repository-
wide rewrite that delays the first human signal.

The codebase also needs a durable migration direction. New production code
must not inherit the legacy browser application's ownership structure or create
more classic-script or untyped JavaScript debt. Existing JavaScript modules,
tests, fixtures, the playable route, and measurement artifacts remain evidence
only where they still represent accepted behavior; they are not the
architectural source for the L3 application.

## Solution

Build a new canonical L3 application using React, Vite, and TypeScript/TSX.
Place authoritative match behavior behind one framework-free Game Runtime
interface. The UI, bots, and Node tools are ordinary callers: they request a
viewer projection, preview candidate intent without access to truth, and submit
intent to the Runtime. The Runtime privately owns authoritative match state and
returns ordered presentation events; no caller reads or mutates match truth.

Use the deterministic authored world and only the settled Slice 1–2 behavior
selected by the first-playable-slice gate as production inputs to a single
end-to-end command cycle: read the strategic situation, inspect uncertainty,
preview a command, submit intent, resolve the turn through the Game Runtime,
render the resulting events and refreshed viewer projection, advance bot and
turn flow, and continue until the match reaches its accepted legal ending.
Known R14 placeholders and the superseded legacy victory conditions are not
eligible foundations for this cycle.

Fog of War is functional L3 behavior, not a visual effect deferred until
polish. Public geography remains legible, own information is exact, and enemy
mutable state is exposed only through the knowledge model owned by the
Fog-of-War feature. Scouting must visibly change the information available to
the player and the corresponding command preview. Development-only truth views
or incomplete-state notices may exist during migration but cannot satisfy the
L3 completion gate.

Author all new canonical production modules in TypeScript/TSX and execute the
same emitted ESM JavaScript in browser and Node contexts. Build the Runtime and
UI architecture anew from accepted contracts. When a vertical slice needs
legacy behavior, reimplement the accepted behavior in TypeScript and verify it
against selected tests, fixtures, or executable models; do not translate the
old application structure merely to preserve lineage. Temporary adapters are
exceptional migration tools with named retirement gates, not the default or
target architecture.

## User Stories

1. As a player, I want to begin a match on the authored strategic world, so
   that the terrain and regional structure I see are the actual game board.
2. As a player, I want the authored region, sector, route, and terrain identity
   to remain stable across repeated runs with the same configuration, so that
   strategic learning is meaningful.
3. As a player, I want to select map locations directly, so that the map is the
   primary surface for strategic judgment and command creation.
4. As a player, I want the map to distinguish public geography from uncertain
   military information, so that I can tell what is known from what is merely
   estimated.
5. As a player, I want my own forces and state to be shown exactly, so that Fog
   of War never obscures information my realm should know.
6. As a player, I want enemy military substance and fatigue to appear through
   the approved estimate-band model, so that uncertainty changes judgment
   without inventing false precision.
7. As a player, I want stale enemy-position knowledge to remain visible as
   last-seen information and possible reach, so that old intelligence is useful
   but not mistaken for current truth.
8. As a player, I want border alarms to reveal the existence of an approaching
   threat without revealing its hidden magnitude or posture, so that invasion
   is readable without eliminating surprise.
9. As a player, I want standing posture and current commit allocation to remain
   hidden before resolution, so that high-information play still contains a
   psychological duel.
10. As a player, I want low-confidence areas to appear under the existing
    uncertainty reading, so that I can find where reconnaissance has strategic
    value.
11. As a player, I want scouting to narrow the estimate band visibly, so that
    spending attention on information produces an immediate, legible payoff.
12. As a player, I want scouting to change the situation reading when the new
    information warrants it, so that uncertainty can resolve into a threat,
    opportunity, or safe judgment.
13. As a player, I want command previews to use only information available to
    me, so that the interface does not reveal the correct choice through hidden
    state.
14. As a player, I want a command preview to become more precise after
    successful scouting, so that reconnaissance improves decisions rather than
    acting as decorative flavor.
15. As a player, I want to issue an attack, defense, reconnaissance, or another
    currently supported operation plan through a consistent interaction,
    so that different rules do not require unrelated control schemes.
16. As a player, I want invalid commands to be rejected with an understandable
    reason without advancing authoritative state, so that input mistakes do
    not silently corrupt the match.
17. As a player, I want a submitted command to resolve through settled Slice
    1–2 behavior rather than a known placeholder or legacy combat path, so that
    the screen represents the accepted game.
18. As a player, I want terrain, field-army position, fatigue, movement, commit,
    and battle resolution to affect the result according to their authoritative
    feature documents, so that the playable build represents the designed game.
19. As a player, I want the result to report the events that changed the board,
    so that I can understand why the situation changed.
20. As a player, I want the map, panels, and command surfaces to update from the
    same refreshed viewer projection, so that no part of the UI contradicts
    another or reaches hidden match truth.
21. As a player, I want bot turns to use the same legal rules and information
    discipline as the human-facing runtime, so that opponents do not require a
    second game implementation.
22. As a player, I want turns to advance without refreshing the page or
    manipulating developer controls, so that the build behaves as a game rather
    than a collection of calculators.
23. As a player, I want to continue from initial setup through an accepted legal
    match ending in one session, so that L3 measures an actual match rather than
    a single isolated battle or a legacy victory shortcut.
24. As a player, I want the end of the match to be explicit and final, so that I
    understand why play stopped and what outcome occurred.
25. As a playtester, I want development-only placeholders to identify
    themselves, so that I do not mistake an unimplemented information effect
    for intentional game behavior.
26. As a playtester, I want ordinary play mode to prevent access to hidden truth
    even through secondary panels or map interactions, so that Fog-of-War
    feedback is trustworthy.
27. As a playtester, I want the first complete match to expose the current
    balance and narrative consequences without requiring Slice 3 or Slice 4,
    so that those later slices can respond to human evidence.
28. As a developer, I want one Game Runtime interface to serve React, the map
    renderer, Node tests, bots, and headless tools, so that rule behavior does
    not fragment across callers.
29. As a developer, I want authoritative state to stay inside the Game Runtime,
    so that React hooks and renderer objects cannot become a second rules
    engine.
30. As a developer, I want player input represented as intent and resolved into
    ordered events plus a refreshed viewer projection, so that command handling
    has one observable test surface without exposing authoritative state.
31. As a developer, I want seed and time dependencies supplied explicitly, so
    that browser and Node runs can reproduce the same match behavior.
32. As a developer, I want new UI, Game Runtime, domain, and projection modules
    written in TypeScript/TSX, so that the canonical path does not accumulate
    new JavaScript migration debt.
33. As a developer, I want the browser and Node to exercise the same emitted ESM
    JavaScript, so that source-level agreement cannot hide loader or build
    divergence.
34. As a developer, I want TypeScript checking to run as an explicit project
    gate, so that Vite transpilation is not mistaken for type safety.
35. As a developer, I want accepted behavior reimplemented from its
    authoritative contract only when a playable vertical slice needs it, so
    that migration work produces player-visible progress instead of a source-
    translation project.
36. As a developer, I want selected legacy tests and executable models retained
    until the corresponding TypeScript behavior has replacement coverage, so
    that migration preserves relevant regression evidence without canonizing
    superseded behavior.
37. As a developer, I want every temporary adapter to have a retirement gate,
    so that coexistence does not become the permanent architecture.
38. As a developer, I want authored-world validation to fail before a broken map
    reaches match play, so that stable identifiers, adjacency, and authored
    geography remain trustworthy.
39. As a developer, I want viewer-projection tests to prove forbidden truth is
    absent rather than merely hidden by CSS, so that information leakage is a
    runtime-contract failure.
40. As a developer, I want visual behavior verified in a real browser, so that
    passing headless rule tests cannot stand in for readable map interaction.
41. As a maintainer, I want the React shell and renderer to remain replaceable
    without rewriting game rules, so that future presentation work stays on its
    own architectural axis.
42. As a maintainer, I want the renderer to consume non-authoritative projection
    data and emit gestures or intents, so that drawing code cannot mutate match
    truth.
43. As a maintainer, I want the current playable route retained until a named
    cutover gate permits retirement, so that migration has a comparison and
    rollback surface.
44. As a maintainer, I want normative mechanics to remain at their existing
    feature birthplaces, so that this integration spec does not create a second
    Fog, terrain, or war-model definition.
45. As a future Slice 3 implementer, I want the Game Runtime and projection
    seams to admit settlement and war-ending information without exposing
    hidden truth, so that later work extends rather than replaces the L3 core.
46. As a future Slice 4 implementer, I want public terrain and fortification to
    remain separate from estimated defending force and hidden commit, so that
    per-sector defense can extend the established information contract.
47. As a deployer, I want one process to own assembly of the final static
    artifact, so that Vite output and retained legacy assets cannot race while
    cleaning or copying the deployment directory.
48. As a deployer, I want the promoted L3 route to remain compatible with static
    hosting, so that the stack migration does not introduce an unnecessary
    server requirement.
49. As a player, I want position to change through operation outcomes and route
    access rather than a standalone move command, so that the playable controls
    preserve the accepted Position as product rule.
50. As a player, I want bot actions explained at a readable presentation pace
    without making rule execution wait, so that I can follow the match without
    confusing animation delay with computation.
51. As a playtester, I want the first playable slice to avoid R14 behavior
    already scheduled for replacement, so that my feedback measures the target
    game rather than a retired stage machine.
52. As a maintainer, I want each carried-forward legacy behavior classified as
    accepted, structurally obsolete, superseded, or incidental, so that silence
    does not decide what becomes canonical.
53. As a maintainer, I want selected-behavior parity, canonical-rule
    conformance, and L3 product acceptance reported as separate gates, so that
    passing one cannot be mistaken for passing the others.
54. As a maintainer, I want the initial Runtime interface to omit snapshot and
    subscription surfaces, so that unneeded lifecycle and schema commitments do
    not freeze the implementation.
55. As a maintainer, I want the legacy browser route to remain independently
    runnable but non-normative during migration, so that it supports comparison
    and rollback without defining L3 scope.

## Implementation Decisions

- **Canonical source and execution runtime:** All new canonical L3 production
  source is TypeScript/TSX. React UI uses TSX; Game Runtime, domain/rule,
  authored-world, projection, and renderer-facing modules use TypeScript.
  Browser and Node execute emitted ESM JavaScript. This decision is owned by
  ADR 0040.
- **UI and build stack:** React is the UI-shell framework and Vite is the build
  tool. The map renderer remains an independent axis. These decisions are
  owned by ADRs 0016, 0028, 0039, and 0040.
- **Primary module seam:** The Game Runtime is the single external module seam
  for authoritative match behavior. Its initial caller contract contains only
  the current actor, viewer projection, and intent submission returning ordered
  presentation events. It has no snapshot or subscription surface by default.
  React, DOM, renderer objects, browser globals, implicit time, and implicit
  entropy remain outside the rule implementation.
- **State authority:** The Game Runtime privately owns authoritative match state
  and legal match transitions; no caller receives a reference to that state.
  Turn order is a rule the Runtime enforces — an out-of-turn intent is rejected —
  while display pacing stays outside, and the Runtime never sleeps. React owns
  ephemeral interaction state only. The renderer consumes non-authoritative
  projection data and emits gestures that the UI translates into intent. Bots are
  ordinary callers holding their own viewer projection, not privileged insiders.
  Resolved by [issue 02](issues/02-define-game-runtime-authority.md), which owns
  the authority and interface semantics.

- **Command preview:** Preview is a pure module outside the Runtime, taking a
  viewer projection and a candidate intent and importing the shared rule modules.
  It is neither a Runtime method nor React-owned, so both the human UI and bots
  forecast through the same function without either reaching truth. Owned by
  [issue 02](issues/02-define-game-runtime-authority.md).

- **Bot execution and pacing:** Bots receive their own viewer projection, use
  the same preview rules, and submit intent through the same Runtime seam as a
  human. The Runtime resolves immediately and enforces actor order. Presentation
  timing and the explanation of bot events remain UI concerns; no asynchronous
  or parallel bot architecture is introduced to simulate deliberation.

- **Migration topology:** A parallel-strangler migration — the current public
  `game.html` path is preserved as a bounded legacy comparison route, the L3 path
  is built beside it rather than converted in place, promotion follows named
  parity and cutover gates, rollback restores a previously verified static-hosting
  artifact, and the legacy route plus its temporary adapters retire after a
  bounded window. Two permanent playable implementations are not an accepted end
  state. Resolved by
  [issue 01](issues/01-choose-migration-topology.md).
- **One semantic test surface:** The product behavior under test is the command
  cycle from viewer-visible state and player intent through authoritative
  resolution to events and a new viewer-visible state. Headless and browser
  tests exercise the same behavior at different fidelity.
- **Viewer-safe information:** UI and renderer callers receive a viewer-specific
  projection, not authoritative state. Hidden values are absent from that
  projection rather than present and visually concealed. The projection seam is
  also the single blur point: the Runtime applies the information model once when
  it builds a projection, and no downstream surface re-derives an estimate from
  truth. Numeric dials and the Fog knowledge model stay owned by the Fog-of-War
  feature; the L3 viewer grades and non-leak invariants are resolved by
  [issue 03](issues/03-define-viewer-knowledge-contract.md).
- **Viewer knowledge grades:** Standard Fog publishes the land and everything
  derived from it — terrain, fortification grade, routes, diplomatic
  relationships, current political control, land value/yield, and the register
  pool — and fogs only the mutable draw a realm makes on that land. Own state is
  exact. Enemy substance and fatigue are estimate bands over `[0.45, 0.90]`;
  civilian register, 동원 강도, and 판세 are derived bands adding no new
  information channel; field-army position is a last-seen fix plus reach cone;
  border alarm is existence plus heading only. Enemy standing posture, commit
  allocation, and treasury are absent from the projection — treasury's
  uncertainty is expressed solely as 판세 band width. Seven non-leak invariants
  bind every projection, including that a missing confidence record yields the
  floor band rather than truth. Resolved by
  [issue 03](issues/03-define-viewer-knowledge-contract.md), which owns the grade
  matrix and the invariants.
- **Fog-of-War completion:** Functional Standard Fog is part of L3 acceptance.
  Scouting must visibly change the approved information representation and the
  related command preview. A development label may disclose incomplete wiring
  during migration but cannot satisfy completion.
- **Authoritative mechanics by reference:** This spec integrates rather than
  redefines the authored world, war model, Fog knowledge model, situation
  judgment, and command preview. Their definitions and sealed values remain at
  the document birthplaces listed in Further Notes.
- **Greenfield architecture, brownfield evidence:** The canonical Runtime, UI,
  projections, and production rule modules are designed for the accepted L3
  seams rather than adapted from the legacy browser ownership model. Existing
  JavaScript remains comparison, fixture, and behavioral evidence where its
  behavior is still accepted. No repository-wide mechanical conversion is a
  prerequisite, and no new canonical production JavaScript is added. The exact
  evidence ladder and adapter exceptions remain owned by the migration gate.
- **Position as product:** L3 does not add a standalone move command or tracked
  army-counter interaction. Movement calculations remain a substrate for
  reachability and resolution; player-visible position changes are products of
  atomic operations, control changes, and route access.
- **Settled-war eligibility:** A playable L3 slice may depend only on war
  behavior implemented against the accepted model. The per-front aggregate,
  retired multi-turn stage conveyor, bot stall timer, and legacy last-faction or
  hex-control victory conditions cannot become L3 acceptance paths. The exact
  first eligible operation remains owned by the first-playable-slice gate.
- **Temporary adapters:** An adapter is allowed only when a vertical slice
  cannot reach player-visible behavior without it. Each adapter must be named
  in the migration specification with the evidence and gate that permit its
  removal.
- **Determinism and portability:** Seed and clock are explicit Game Runtime
  dependencies. Observable rule behavior must match when the same emitted ESM
  JavaScript receives the same inputs in browser and Node environments.

- **Serialization:** A match is reproducible from its authored-world identity,
  seed, and ordered intent log; that triple is the canonical durable form. Events
  are presentation output whose schema stays free to change, and no snapshot API
  ships by default — determinism already provides replay, and a measured match
  replays in ~1.17 ms. This keeps event and internal-state schemas unfrozen while
  the war model is still being tuned. Owned by
  [issue 02](issues/02-define-game-runtime-authority.md).
- **Static hosting:** The completed build remains a client-side static web
  application. One build stage owns final artifact cleaning and assembly.
  Exact package boundaries and commands remain a Wayfinder decision.
- **No renderer escalation by ambition alone:** Use the existing web-rendering
  class until the representative map/Fog prototype and measured behavior show
  a need for another renderer. PixiJS is a possible future adapter, not part of
  this spec by default.
- **Migration evidence retention:** Existing JavaScript tests and the legacy
  play route are not deleted merely because TypeScript is adopted. Retirement
  requires the verification and cutover gates named by the Wayfinder.
- **Distinct evidence gates:** Selected-behavior parity compares only behavior
  deliberately carried forward from legacy evidence. Canonical-rule conformance
  checks Production requirements even when no faithful legacy implementation
  exists. L3 product acceptance proves a complete human-playable match. Route
  promotion depends on product acceptance, not broad legacy feature parity.
- **Extension discipline:** Slice 3 and Slice 4 are not implemented here. The
  Game Runtime and viewer-projection interfaces must avoid assumptions that
  would prevent their documented settlement and per-sector-defense directions
  from being added later.

## Testing Decisions

- Tests assert external behavior through the highest useful seam. A good test
  supplies match inputs and viewer intent to the Game Runtime and asserts the
  resulting events, legal state transition, and viewer-safe projection. It does
  not assert React hook arrangement, private helper calls, renderer internals,
  or the order in which internal calculators are composed.
- The primary deterministic scenario exercises the entire command cycle:
  authored-world setup, viewer projection, map-target intent, Fog-aware command
  preview, authoritative resolution, event emission, projection refresh, bot
  progression, and match advancement.
- Game Runtime contract tests cover valid intent, invalid intent, no-transition
  rejection, deterministic replay from equal inputs, explicit seed/clock use,
  event ordering guarantees chosen by the runtime-authority gate, and
  serializable public results.
- Viewer-projection tests assert both presence and absence. They prove that own
  exact information and public geography are available while forbidden enemy
  truth, posture, commit, and other hidden fields cannot be reached by UI or
  renderer callers.
- Fog tests reuse the existing `intel`, scouting, situation, command-preview,
  and Slice 2 information-system behavior as prior art. They verify that
  observation and aging change the player-visible representation according to
  the authoritative Fog documents without duplicating their numeric dials in
  this spec.
- Authored-world tests reuse the deterministic generator, loader, and map-gate
  precedent. They verify stable identity, valid adjacency, authored totals, and
  browser/Node consumption of the same accepted world data.
- Behavioral extraction tests keep selected JavaScript evidence active while
  accepted behavior moves into TypeScript. Replacement is permitted only when
  the new canonical module covers the deliberately retained observable contract
  and the vertical slice passes at the Game Runtime seam. Superseded or
  incidental behavior is classified rather than reproduced.
- R14 eligibility tests prove that the chosen playable slice does not call the
  retired stage conveyor, bot stall timer, per-front uniform-defense aggregate,
  or legacy victory checks. Tests instead cite the settled Production behavior
  that the slice exercises.
- Verification reports keep selected-behavior parity, canonical-rule
  conformance, and L3 product acceptance as separate results.
- Emitted-output parity tests execute the same built ESM JavaScript through real
  browser and Node loaders. Testing TypeScript source in one host and emitted
  output in another does not satisfy this requirement.
- Type checking is an explicit command separate from Vite transpilation. A
  successful production bundle without a successful TypeScript check is a
  failed verification state.
- Browser verification covers map interaction, readable selection and command
  feedback, Fog presentation, scouting payoff, turn advancement, result
  feedback, responsive layout at the agreed playtest viewport, and one complete
  match without developer intervention.
- Human L3 verification checks comprehension rather than only rendering. The
  player must be able to distinguish public, exact, estimated, stale, hidden,
  and development-only information and explain how scouting changed a command
  judgment.
- The final acceptance gate combines typecheck, unit/regression tests,
  authored-world gates, emitted browser/Node parity, information non-leakage,
  browser end-to-end play, and a human one-match playtest. Exact commands and
  thresholds are owned by the unresolved verification Wayfinder gate.
- Existing repository prior art includes the Node test suite, browser-script
  test loader, authored-map gates, combat batteries, Slice 1–2 war-module tests,
  Fog/Intel tests, command-preview tests, and static-server browser checks.
  These remain evidence inputs rather than being rewritten solely for tool
  uniformity.

## Out of Scope

- Designing or implementing Slice 3 settlement mechanics.
- Designing or implementing Slice 4 per-sector defense mechanics.
- Casual or Challenge Fog profiles, terrain concealment, identity concealment,
  deception, espionage, and predictive reconnaissance.
- Final art direction, production art assets, animation polish, and audio.
- Adopting PixiJS or another renderer without evidence from the map/Fog
  prototype and agreed performance measurements.
- PvP, accounts, servers, authoritative networking, anti-cheat, and cross-device
  synchronization.
- Desktop or native packaging, store SDK integration, and a full game-engine
  migration.
- A repository-wide conversion of historical JavaScript, mockups, tests, or
  research harnesses before they are needed by a playable vertical slice.
- Refactoring the legacy browser application into the canonical Runtime or
  using it as the new source-tree template.
- Full feature parity with the legacy browser application.
- A standalone move command, tracked army-counter movement, or hex-by-hex
  marching interaction.
- Reusing known R14 placeholders or superseded legacy victory conditions as L3
  acceptance behavior.
- Event sourcing, a canonical snapshot schema, a default snapshot API, or a
  Runtime subscription lifecycle for the initial L3 seam.
- Parallel or asynchronous bot execution introduced without measured compute
  pressure.
- Replacing existing domain vocabulary, duplicating sealed magnitude values, or
  relocating authoritative feature definitions in this Working spec.
- A production save/load UI, replay browser, or long-term replay-version policy
  beyond keeping the Game Runtime deterministic and serializable enough not to
  block later work.

## Further Notes

### Authoritative document pointers

- Product direction and L3 purpose: `SPEC.md`, `DESIGN.md`, ADR 0028.
- Stack, source language, renderer separation, and migration obligations:
  ADR 0016, ADR 0039, ADR 0040.
- Authored-world identity and validation: `docs/features/terrain-cradle/` and
  its referenced authored-map artifacts.
- Implemented Slice 1–2 war behavior and build status:
  `docs/features/war-model-build/` and ADR 0037.
- Fog vocabulary and visibility rulings:
  `docs/features/fog-of-war-discovery/`; the later Slice 2 information-system
  ruling amends the earlier discovery framing where explicitly stamped.
- Situation judgment and province-level uncertainty: ADR 0019, ADR 0023, and
  the relevant `DOMAIN_MAP.md` pointers.
- Wayfinder evidence and decision state: `.scratch/l3-playable-seam/map.md`.

This spec uses those terms and decisions. It does not create a second
definition point or copy their dials.

### Resolved Wayfinder decisions

Recorded in their own ticket, which stays authoritative, and reflected into the
Implementation Decisions above.

- [Preserve or Replace the Legacy Play Path?](issues/01-choose-migration-topology.md)
  — parallel-strangler topology; resolved 2026-07-16.
- [Define Game Runtime Authority and Its Interface](issues/02-define-game-runtime-authority.md)
  — Runtime privately owns match truth and exposes viewer projections; blur once
  at the projection seam; preview is a pure module outside the Runtime; bots are
  callers and the Runtime enforces turn order without sleeping; the intent log
  plus seed is the canonical durable form. Resolved 2026-07-16.
- [Define What Each Viewer Can Know](issues/03-define-viewer-knowledge-contract.md)
  — Standard Fog publishes the land and its derivations, including current
  political control, and fogs only the mutable draw on it; treasury leaves the
  projection entirely and survives as 판세 band width; civilian register and
  동원 강도 are derived bands; seven non-leak invariants bind every projection.
  Resolved 2026-07-17.
- [Verify Vite, TypeScript, ESM, and Legacy CommonJS Coexistence](issues/04-research-toolchain-coexistence.md)
  — resolved research evidence, not an implementation decision.

### Ticket decomposition status

- The pre-gate ten-ticket proposal discussed before Wayfinder 02 and the R14
  constraint is superseded and must not be published.
- The user approved the replacement nine-ticket linear breakdown on 2026-07-16.
  It is published under the local L3 playable-build tracker with `needs-info`
  status while its named Wayfinder specification gates remain open.
- No implementation ticket becomes `ready-for-agent` until issue 12 publishes
  the Production partition and every acceptance-shaping dependency named by the
  ticket has a recorded answer.
- Published implementation tickets will cite the Production partition chosen by
  issue 12 rather than treating this Working synthesis as normative; their
  specification pointers are updated as part of that promotion.

### Unresolved Wayfinder gates

The following named tickets remain decision or prototype gates. Their answers
must be recorded in their own ticket and reflected into this spec before
implementation tickets depending on them become `ready-for-agent`.

1. [Choose the Build, Module, and Test Topology](issues/05-choose-build-and-test-topology.md)
   — package and ESM/CommonJS coexistence, commands, artifact ownership, and
   supported developer workflow, informed by the resolved toolchain research.
2. [Define the Authored World Input Contract](issues/06-define-authored-world-input.md)
   — canonical data shape, generation/load timing, stable identifiers,
   validation, and production-versus-evidence disposition of current artifacts.
3. [Make Uncertainty Legible Without Leaking Truth](issues/07-prototype-map-fog-presentation.md)
   — live user-evaluated presentation and the initial renderer decision.
4. [Define the First Playable Vertical Slice](issues/08-define-first-playable-vertical-slice.md)
   — exact match mode, player journey, commands, bot flow, feedback, and end
   point that prove the seam is real.
5. [Define the Incremental Migration and Adapter Ladder](issues/09-define-incremental-migration-ladder.md)
   — port order, allowed adapters, parity evidence, and adapter retirement.
6. [Define the L3 Verification and Acceptance Gates](issues/10-define-l3-verification-gates.md)
   — executable evidence, human comprehension checks, and completion criteria.
7. [Define Cutover and Legacy Retirement](issues/11-define-cutover-and-retirement.md)
   — route promotion, hosting rollback, and deletion/archive evidence.
8. [Partition the Implementation-Ready Spec Handoff](issues/12-partition-spec-handoff.md)
   — Production spec partition after the decisions above and the planned
   documentation/terminology audit, including whether any resolved Wayfinder
   decision promotes to an ADR.

### Documentation lifecycle

- This umbrella spec is a Working-layer tracker artifact. Its
  `ready-for-agent` status means it is ready for agent-driven Wayfinder closure
  and later ticket decomposition; it does not override the explicit
  implementation-readiness block in the header.
- No new domain term or magnitude is sealed here. Any domain-language changes
  discovered by the planned documentation audit follow the project's glossary,
  promotion, and seal rules before Production specs are finalized.
- The Production home under `docs/features/` is not created by this publication.
  Its final folder structure and spec partition are outputs of the named
  Partition the Implementation-Ready Spec Handoff gate after the audit.
- Implementation tickets created later cite the final Production specs and
  authoritative feature birthplaces. They do not copy this umbrella text or
  redefine mechanics.
