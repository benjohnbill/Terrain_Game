# ADR 0018: Phase 1 MVP — Core Fun First, Defer the Capacity/Overclock Layer

Date: 2026-07-01

Status: Accepted

## Context

Phase 1 stacks many interacting systems: four force roles, four action
capacities (Command, Administration, Diplomacy, Scholarship) with focus,
carryover, and overclock, terrain modifiers, and perishable information.
Cross-session research flagged this as a risk to the low-required-interaction
positioning (ADR 0017): the "analysis-heavy but click-light" goal could tip into
fatiguing if all systems must be operated at once.

The capacity carryover / overclock / consumption loop is currently display-only:
built and tested but not wired into the live turn loop (recorded in the Phase 1
deferred-followups memory as the top unwired item). This provides a clean cut
line.

Independent research on the intended fun converged on a core of terrain-mediated
combat, regional value, information/scouting under uncertainty, and the
anti-snowball force/garrison model (ADR 0009, ADR 0014). The capacity/overclock
layer is the heaviest and least-proven part and is not required to deliver that
core.

## Decision

Treat Phase 1 as an MVP of the core fun.

- **Keep as core:** terrain-mediated combat, regional value, information and
  scouting under uncertainty, and the anti-snowball force/garrison model.
- **Defer the capacity/overclock layer** (four-capacity focus, carryover,
  overclock) beyond the first fun-validation slice. The code remains in the
  repository (display-only); it is not required to be wired for the MVP.
- **Prioritize making the core fun felt** — the growth/skill/edge loop and the
  map's readable response (result reports, map changes) — over adding systemic
  breadth.

## Consequences

- Reduces required interaction complexity, honoring the low floor of ADR 0017.
- The MVP must deliver a legible positive payoff — growth the player can feel,
  readable results, visible map response — not only anti-snowball constraints.
  Defining and building that payoff is the MVP's primary work.
- The "planning tension" fun associated with carryover/overclock is not part of
  the MVP. If later validation shows the core plays thin, the capacity layer is
  a known next lever rather than a discarded one.
- No capacity code is removed or deleted; wiring it is revisited as a triggered
  follow-up.
- Complements ADR 0017 (positioning) and stays within the incremental-slice
  approach of ADR 0010.
