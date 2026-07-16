# Define the First Playable Vertical Slice

Type: grilling
Status: open
Blocked by: 02, 03, 06, 07

## Question

What exact player journey proves the authored world, Slice 1–2 war engine,
Standard Fog, React UI, and Game Runtime are genuinely joined rather than
merely scaffolded? Fix the match mode, starting state, commands, feedback,
turn progression, bot participation, and stopping point for the first
end-to-end slice.

## Decision constraints

- The slice must cross the sealed Runtime seam from viewer projection through
  preview and intent submission to ordered events and a refreshed projection
  ([issue 02](02-define-game-runtime-authority.md)).
- The slice must make functional Fog observable; a development disclosure or a
  truth-backed UI fallback cannot satisfy it.
- Position changes through operation outcomes and route/reachability rules. A
  standalone move command is forbidden by `DOMAIN_MAP.md:245-255`.
- The slice may depend only on war behavior implemented against the accepted
  model. It must not exercise a known R14 placeholder scheduled for replacement
  (`docs/DESIGN-RISKS.md:30,38`; `docs/features/war-model-build/REQUIREMENTS.md`).
- It must not inherit the legacy last-faction-standing or 70%-hex-control win
  checks in `js/game.js:448-465`; ADR 0038 defines the accepted war-ending
  composite.
- The slice must be independently demoable and small enough for one fresh
  implementation context. It is not a build-tool-only or Runtime-only layer.

## Evidence-based option space

### A. Reconnaissance-first command cycle

Start on the authored world, show a viewer projection, inspect an uncertain
front sector, preview reconnaissance, submit it, render the resulting events,
and show the narrower estimate changing situation judgment and the next preview.

- **Strength:** proves the projection blur seam and Fog payoff without depending
  on unfinished R14 combat paths.
- **Cost:** does not yet prove that the war engine can resolve player combat.

### B. Settled atomic combat cycle

Select a front sector, preview an attack from viewer-safe information, submit
the operation, resolve only the settled per-sector/atomic behavior available at
implementation time, and show control, route, fatigue, and reachability products.

- **Strength:** proves the intended seam against the central war interaction.
- **Cost:** blocked until every invoked war behavior is implemented against the
  accepted model; using the retired stage machine to unblock it is prohibited.

### C. Full turn or full match immediately

Include human action, bot callers, repeated turns, legal war ending, and match
ending in the first slice.

- **Strength:** strongest product evidence if it succeeds.
- **Cost:** too many unresolved contracts and R14 dependencies for the first
  tracer; failure would not localize whether the problem is map, Fog, Runtime,
  combat, bot policy, or ending.

## Recommendation

Choose A as the first seam-proving tracer, then make B the first war-bearing
slice as soon as its exact accepted behavior is available. Treat C as the L3
acceptance chain, not the first implementation ticket. The honest cost is that
the first tracer proves playability infrastructure and information judgment,
not the full Mission; the later combat and match slices remain mandatory.

This recommendation does not resolve the gate. The user chooses the exact
starting state, journey, and stopping point after the Fog presentation prototype
and authored-world contract are available.
