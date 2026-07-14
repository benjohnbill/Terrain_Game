# ADR 0038: War-Ending Composite — Capacity or Will

- Status: Accepted (sealed 2026-07-14)
- Relationship:
  - Amends the SPEC match-structure line "a war is decided by field-army
    destruction" (SPEC:147) — demoted from sole decider to **dominant path**
    (SPEC text amendment proposed to the user in the same batch; this ADR is
    the mandatory record for a win-condition change).
  - Confirms match-arc CE-⑲ (stall→white-peace as bot policy only; a war is
    never force-closed over a human player) and B3 (settlement acceptance
    arithmetic).
  - Advances capital CP-① (capital fall = regime event) from concept toward a
    war-ending channel; wiring stays capital stage ②.
  - Design source: slice-2 operational-layer design spec §5
    (`docs/superpowers/specs/2026-07-14-slice2-operational-layer-design.md`),
    user seals 2026-07-14.
- L-trust: L0 (grill reasoning; measurement follows the slice-2 build).

## Context

Slice 2 sealed free division of the field army (spec §4). Divisibility
dilutes the stakes of any single engagement: if a losing realm can always
withhold or withdraw part of its mobile force, "field-army destruction" as
the *sole* war-decider re-opens the R14 fizzle from a new direction — a
beaten realm drags the war endlessly by refusing to present its army.

The user's ruling (2026-07-14): war termination must be a composite of
capacity and will, and both extremes are legitimate play — fighting to the
bitter end with a hidden army, and surrendering early with the army intact.

## Decision

A war ends when the loser's **capacity or will** to resist breaks, through
any of three channels:

1. **Field-army destruction** — the dominant path and the madmovie spine
   (shield-break → decisive battle → cascade); unchanged as the design's
   center of gravity.
2. **Capital fall** — a regime event (CP-①): vassalization or cession
   scenarios; the anti-drag backstop. Wiring (guard magnitude, decapitation
   check) remains capital stage ②.
3. **Settlement acceptance** — the will path: a court accepts a B3 ladder
   rung; surrendering with the army intact is always permitted.

Dragging a lost war is **permitted and self-punishing**, never prohibited:
lost land starves recruitment (land-derived mass), fatigue and supply
pressure compound, and the capital backstop waits. CE-⑲ stands — bots may
take a rung by policy (slice-2 spec §9); humans are never force-closed.

## Consequences

- The decisive battle remains the dominant war-decision path; the composite
  closes the drag exploit that free division would otherwise open.
- The bot stall→white-peace timer is retired in favor of read-driven
  settlement (spec §9); measurement re-reads the R14 fizzle against this
  composite (spec §11 metric 5).
- SPEC's match-structure sentence carries an amendment pointer to this ADR
  once the user approves the proposed text.
- Capital stage ② gains a concrete consumer; its design pass inherits the
  regime-event channel defined here.
