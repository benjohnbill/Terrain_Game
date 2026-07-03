# ADR 0015: Strait Crossing Penalty And Deferred Naval System

Date: 2026-06-29

Status: Accepted

## Context

The world model includes coasts, straits, and islands (ADR 0001; the
`coast_strait` terrain in DOMAIN_MAP). DOMAIN_MAP left open whether strait
movement requires a harbor, a technology, or a separate naval capacity.

Phase 1's stat scope (ADR 0008) is combat and economy basics and explicitly
defers deep systems. A full naval system — naval force role, blockade, sea
movement, and amphibious doctrine — would expand Phase 1 beyond its intended
first slice.

## Decision

Phase 1 models strait and coast crossing as a movement and combat penalty rather
than a dedicated subsystem:

- crossing a strait or coast is allowed but applies a movement penalty and an
  amphibious combat penalty;
- port/harbor settlement function reduces the penalty;
- no separate naval capacity or naval force role exists in Phase 1;
- straits remain a terrain and movement modifier consistent with the existing
  `coast_strait` terrain and the four force roles in ADR 0009.

A true naval system — naval capacity or force role, blockade, sea movement, and
dedicated amphibious doctrine — is recorded as a later-phase candidate, not a
Phase 1 requirement.

## Amendment (2026-07-03, magnitude pass)

Penalty values are set and refined by the combat-formula magnitude pass
(`docs/features/combat-formula/MAGNITUDE.md` M5):

- The crossing penalty is an attack-side multiplier, never a defense
  multiplier (water weakens the attacker; it does not strengthen the
  defender).
- River crossing: ×0.85 uncontested, deepening to ×0.70 when the
  defender holds the far bank (survey-validated: an opposed crossing is
  a different event from an unopposed one).
- Strait crossing: ×0.70; an opposed-strait deepening (~×0.55) is
  recorded as a candidate dial, pending the plan-roster magnitude work.
- Port/harbor staging mitigation unchanged.

## Consequences

- The future movement and supply slice implements strait/coast penalties and
  port mitigation; no naval-specific data model is required for Phase 1.
- `coast_strait` provinces and port-function provinces gain strategic meaning as
  mitigation points without introducing new force types.
- Later phases can add a naval system as an additive layer over the same
  province and terrain model, because Phase 1 avoids hard-coding a land-only
  assumption into crossing rules.
- Keeps Phase 1 within the ADR 0008 scope and the high-complexity,
  low-micromanagement principle (ADR 0010).
