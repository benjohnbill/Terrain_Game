# Feature: Phase 1 Fun Core (MVP)

## Purpose

The active Phase 1 thrust: make the core fun *felt*. Deliver a legible positive
payoff — growth the player can feel, a visible skill-driven edge, a readable map
response — rather than only anti-snowball constraints.

## Status

Active design. Positioning and MVP scope settled; MVP payoff loop in design.

## Product Truth

- `SPEC.md` - "Positioning and Fun Pillars" section.

## Decisions

- `docs/adr/0017-positioning-civ-depth-lol-shaped-interaction.md` - Civ-depth
  world, LoL-shaped interaction; opt-in depth.
- `docs/adr/0018-phase-1-mvp-core-fun-first.md` - MVP core-fun first; defer the
  capacity/overclock layer.
- `docs/adr/0019-situation-judgment-structured-province-reading.md` - stage-1
  situation judgment model: structured province reading (판세/위협/기회/불확실),
  relational threat, posture-as-lens with anti-bias guardrails, fog variety
  contract, and the attention-vs-action-budget bridge to stage 2.
- `docs/adr/0020-minimal-action-capacity-divisibility-core.md` - amends ADR 0018:
  a single divisible action-capacity pool (commit-vs-average + surplus
  redirection) is reclassified as MVP core, because the core skill fun (SPEC
  pillars 2-3) depends on it; the four-capacity/carryover/overclock system stays
  deferred.
- `docs/adr/0021-undercommit-failure-causes-front-sector-loss.md` - failed
  under-commitment on contested defense causes front-sector loss, not only
  gradual damage, so deliberate sacrifice and surplus redirection stay legible.
- `docs/adr/0022-front-sector-operational-layer.md` - adds front sector as the
  one-turn operational layer between named province and map unit/hex.
- `docs/adr/0023-province-status-and-control-summary.md` - defines
  perspective-based province status and neutral province control summary from
  front-sector ownership and controlWeight.
- `docs/adr/0024-operation-plan-presets-for-core-commands.md` - core commands
  are presented as statistical-average operation plan presets with optional
  fine-tuning, preserving low required interaction and a skill edge.
- Foundations: `0010` (high-complexity/low-micromanagement), `0009` and `0014`
  (anti-snowball force roles and local-garrison economy).

## Design Specs

- MVP payoff loop - `docs/superpowers/specs/2026-07-01-phase-1-mvp-payoff-loop-design.md`
  (Draft, tentative).

## Open Threads

- Preset differentiation (SPEC "Open thread").
- Time pressure as an opt-in mode - prototype question (SPEC "To validate").
- UI/UX information architecture - to be designed in a separate session, seeded
  after the payoff-loop spec exists.
- Turn default screen and command-card IA exposure rules - separate UI/IA
  discussion; ADR 0024 only defines that a focused command card starts from an
  operation plan preset.

## Related

- `docs/features/phase-1-terrain-combat/` - the broader terrain/combat feature
  this MVP thrust sits within.
