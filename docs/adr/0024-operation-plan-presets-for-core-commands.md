# ADR 0024: Operation Plan Presets for Core Commands

Date: 2026-07-01

Status: Accepted

## Context

ADR 0017 defines skill as adjusting from a statistical-average preset toward the
specific situation. ADR 0020 makes divisible capacity core to that skill loop,
and ADR 0022 makes front sectors the one-turn operational focus. Attack and
defense commands need enough internal structure to feel like war, but exposing
every tactical field directly would violate high complexity, low micromanagement
(ADR 0010).

## Decision

Represent each core command as an operation plan preset with optional fine
adjustment.

The preset is the statistical-average baseline for the focused front sector. It
can bundle objective, approach, recommended capacity commitment, mobilization
posture, and risk tolerance. The player first sees the plan as a coherent
recommendation, not an empty form. Casual play can accept the preset; skilled
play adjusts selected fields such as commitment, risk, mobilization, or approach
to fit the actual situation and preserve surplus.

This decision applies to the command card opened after situation judgment and
front-sector focus (for example, after clicking a province/sector highlight). It
does not decide the turn's default screen or overall information architecture;
that remains a separate UI/IA discussion.

The MVP operation plan preset has five internal fields:

- `objective` — what the command is trying to achieve;
- `approach` — how the command attempts it;
- `recommendedCommitment` — the statistical-average capacity commitment;
- `mobilizationPosture` — whether and how much non-standing force is drawn in;
- `riskTolerance` — how much failure/loss risk the plan accepts.

Concrete numbers and the exact preset catalog are deferred to the front-sector
content and combat-balancing pass.

For the MVP, `mobilizationPosture` must stay coarse: no mobilization versus a
simple limited/committed mobilization choice is acceptable, while detailed levy,
reserve, emergency mobilization, and typed force-source controls are deferred.

The operation-plan catalog is not a flat menu shown in every situation. The
command card should generate a small available set from the target front sector's
value profile, status, adjacency/reachability, terrain tags, and information
confidence. A typical card should expose only a few valid plans plus one
recommendation. Conditional plans such as supply interdiction or encirclement
should appear only when the sector state makes them plausible.

Operational effects should primarily be expressed as changes to front-sector
value/profile axes and state: controlWeight share, route access, local garrison,
fortification damage, usable economy/population, confidence, and province status
transition. This keeps presets tied to the sector model rather than becoming a
separate tactical minigame.

MVP operation effects use six normalized axes, each mapped to a specific
front-sector value or state element:

- `controlShift` — changes controlWeight share / sector ownership. On successful
  capture the sector opens at the usable-value placeholder (50% economy, 60%
  population per ADR 0022); that opening is a consequence of controlShift, not a
  separate damage axis.
- `garrisonDamage` — reduces `localGarrison` only. Temporary: while
  population/economy survive, the garrison regenerates. `militaryValue` (the
  authored regeneration background) is not damaged by this axis.
- `fortificationDamage` — reduces `fortificationDefense` (one of the four defense
  layers).
- `routeDisruption` — disrupts or opens `routeValue` / route access.
- `usableValueDamage` — actively destroys usable economy/population
  (scorched-earth, raiding, supply interdiction). Independent of controlShift; it
  does not require capturing the sector, and it is the path for permanent military
  weakening: burning the base that sustains the garrison.
- `confidenceGain` — improves information confidence (fog).

`statusTransition` is not an independent axis. Province status and control
summary are derived: when controlShift (or other axes) change the underlying
controlWeight share and contact state, status is recomputed automatically per
ADR 0023. Presets therefore do not author a status effect directly.

The MVP command-card adjustment surface is deliberately narrow:

- `recommendedCommitment` is always directly adjustable through the commitment
  slider, because it is the core efficiency skill edge from ADR 0020.
- `mobilizationPosture` is directly adjustable only as a coarse toggle or small
  option set.
- `riskTolerance` is optional/advanced and may be hidden behind a collapsed
  control.
- `objective` and `approach` are not exposed as independent free-form fields in
  the default card. They change by selecting a different operation plan preset,
  so the command remains a coherent plan rather than a tactical form.

### Operation plan catalog schema

The catalog is defined schema-first: a fixed record shape is fixed now, and the
concrete plans are authored into it later. Each plan has four authored fields:

- `name` — the operational intent label;
- `availabilityConditions` — when the plan appears on the card (sector value
  profile, status, adjacency/reachability, terrain tags, confidence);
- `effectAxes` — a magnitude per operation effect axis (the six axes above),
  expressing how strongly the plan works each axis. This is a per-axis magnitude,
  not a primary/secondary classification: a plan that shifts control moderately
  while cutting routes strongly is `{controlShift: mid, routeDisruption: high}`,
  which also avoids arbitrary "is this primary or secondary" authoring calls.
- `riskProfile` — the plan's typical risk tolerance.

No separate "recommended target traits" field is authored. How well a plan fits a
sector is derived at runtime by matching its `effectAxes` magnitudes against the
target sector's value profile, so the recommendation ranking already surfaces fit
without hand-authored traits.

This schema fixes what an operation plan *is* and which sector element each axis
acts on (the mapping above). It deliberately does not fix *how strongly* a given
capacity commitment converts into applied effect magnitude; that
commitment → effect-size formula is combat balancing and is defined in the
numeric combat pass, not here.

### Attack, defense, and non-combat in one catalog

The catalog is not split by attack versus defense. Each effect axis is
bidirectional and target-relative: the same axis that damages an enemy element
can build or recover a friendly one (fortification *build* is the friendly
direction of fortificationDamage; garrison *reinforce* of garrisonDamage; usable
value *recovery* of usableValueDamage). Attack, defense, and non-combat plans
therefore share the six axes and one schema; `availabilityConditions` decide
which plans a focus surfaces — enemy-sector focus surfaces attack plans, own or
threatened sector focus surfaces defense/recovery plans.

Non-combat activity (scouting via confidenceGain, defensive build/recovery via
the friendly-direction axes) appears in two places, both inside the command card:

- as a primary operation plan (its own tab), when the player commits the turn's
  main action to it; and
- as the destination of surplus, when the primary is combat and committed
  capacity is below the recommendation. Lowering the commitment slider frees
  surplus, and a single outlet control on the same card sends it to one activity
  (scouting, economy/recovery, defensive build, or reserve), with the preset
  proposing a situation-based default. This is a lightweight redirect, not a
  second action or a separate step; the turn still has one primary action
  (ADR 0020).

MVP surplus outlets are exactly those friendly-direction activities plus reserve.
Diplomacy and scholarship are not outlets, because the MVP runs a single
divisible capacity pool with the four typed capacities deferred (ADR 0020). This
single-pool framing is an MVP assumption: once typed capacities are introduced,
same-type redirection stays cheap while crossing types needs overclock, so the
outlet set and this attack/defense/non-combat unification are a revisit point.

## Considered Options

- **Expose every tactical field directly:** rejected — rich, but too much
  required interaction for the MVP.
- **Use only a single attack/defend button plus commitment slider:** rejected —
  low friction, but too thin to carry realistic attack intent and tactical
  differentiation.
- **Operation plan preset with optional overrides:** accepted — preserves the
  low floor while giving the player a skill surface for efficiency and tactical
  fit.

## Consequences

- Situation judgment answers where to look; front-sector focus chooses the
  operational target; the operation plan preset proposes what to do there.
- Attack can be more expressive than defense without forcing micromanagement.
- The command card should show the preset, forecast band, confidence, recommended
  commitment, surplus, and the limited fields that can be fine-tuned.
- MVP fine-tuning is limited to commitment, coarse mobilization, and optional
  advanced risk. Objective and approach are changed through operation-plan
  selection rather than separate default controls.
- Preset tuning is a balance/design-content task, not a reason to reopen the
  command model.
- The turn's default screen is deliberately left open; this ADR only defines the
  command card's starting point after a focus has been selected.
- The catalog schema fixes each plan's effect *mapping* (which sector element an
  axis touches). The *magnitude* actually applied — how capacity commitment, the
  plan's authored magnitude, and sector defense combine into a result — is a
  combat-balancing concern deferred to the numeric combat pass. That conversion
  should also read as plausible warfare rather than an abstract multiplier.
