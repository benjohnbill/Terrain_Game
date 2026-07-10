# ADR 0031: Force-Geography Defense Model — Terrain-Bound Defense and Reactive Reserve

Date: 2026-07-10

Status: Accepted
Amends: ADR 0008 (Phase 1 stat scope) and ADR 0014 (garrison sustainment) —
the uniform-shield defense reading those ADRs assumed is replaced by a
terrain- and choice-shaped distribution.
Decision source: force-geography RULINGS FG-①…⑩ (built via SDD, main
@ 0e8dc52, 2026-07-09; high-reps L2 measurement 94.5k matches × 2).

Backfill note: recorded after shipping — found by the 2026-07-10 structure
forensics (case F-08; the debt ledger itself had anticipated "may need a
large ADR"). Definitions and dials live at the birthplaces cited below.

## Context

Before this pass, a realm's defense was effectively even across its
territory: garrisons summed into an undifferentiated shield, so L2 boards
froze into deterrence equilibrium (every front equally hard) and the
hegemony gate rarely tripped. The design needed defense to be **uneven by
terrain and by player choice** — concept (b) of the hegemony-freeze
three-concept sequence — without touching the sealed combat resolution
core.

## Decision

- **Terrain-bound defense**: a realm's defensive strength is distributed
  over its border geography (door widths, border classes) rather than
  pooled — some fronts are structurally hard, others are gaps; the "one
  blanket" budget cannot cover every front.
- **Reactive mobile reserve** (M9 grammar): a portion of force answers
  attacks by awakening/marching rather than standing pre-placed, arriving
  march-worn — defense becomes a read-and-allocate decision, not a stat.
- Landed as an opt-in L2 harness layer (`FG_BOARD_GAAN`); the engine board
  stays untouched and non-FG runs are byte-identical — the model is sealed
  at the design layer, engine adoption is a later step.
- Headline metric for its effect is decision timing (match-arc DT-①):
  envelope % + median trip turn; the fgM9off variant measured best
  (envelope 34.6%, median trip 19).

## Rejected alternatives

Recorded per-ruling in force-geography `RULINGS.md` FG-①…⑩ (including
uniform-shield retention and non-reactive standing-garrison-only models).

## Consequences

- ADR 0008's stat scope and ADR 0014's garrison reading are amended: local
  garrisons participate in a geography-shaped shield, not a flat sum
  (headers stamped in this commit).
- The hegemony gate arithmetic (ADR 0030) consumes the facing-shield
  distribution this model produces.
- Engine (js/) adoption of the FG layer remains future work; until then the
  shipping game code retains the simpler defense model (known
  design-ahead-of-code gap, tracked by the audit baselines).

## Authoritative homes

- Rulings and model: `docs/features/force-geography/RULINGS.md` FG-①…⑩,
  `INDEX.md` (status + headline).
- Reserve grammar and door widths: combat-formula `MAGNITUDE.md` M9/M11.
