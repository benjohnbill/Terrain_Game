# ADR 0030: Victory Conditions — Hegemony Decision Point and Domination Victory

Date: 2026-07-10

Status: Accepted
Amended by: ADR-0034 (2026-07-11) — matches that never trip the gate now
end structurally via the sudden-death crisis ending (direction); the gate
here remains the sole winner rule for decided matches.
Decision source: match-arc RULINGS ⑨⑪⑮⑰ (sealed 2026-07-04/05) and DT-③
(sealed 2026-07-09, user); implemented commit a29eb0a; SPEC win-type
amendment commit 2629181.

Backfill note: this ADR records decisions that shipped without one — found
by the 2026-07-10 structure forensics (cases F-06/F-07) and written under the
documentation law's mandatory-ADR trigger adopted the same day. The
authoritative definitions and dial values live at the birthplaces cited
below; this ADR is the durable why-record, not a definition surface.

## Context

The match needs a terminal decision point: the moment further war cannot
change the outcome (SPEC principle 5, irreversibility detection). L2
tournaments showed two distinct failure modes without one: matches that
never resolve (frozen world / deterrence equilibrium) and dominant realms
walled indefinitely by coalitions (denied-dominant timeout, ~31% of the
fgM9off bucket).

## Decision

The match ends at the **hegemony decision point (패권 결정점)**:

> trip = (leadership OR dominance) AND unassailable

- **Leadership** — the candidate's projectable mass clears the war-deciding
  shield ratio against every realm still in the balance.
- **Dominance** (second win-type, DT-③ 2026-07-09) — the candidate owns the
  board's offense (force-share majority, or overwhelming ratio vs the
  strongest rival) without needing the per-rival leadership bar. Added by
  relaxing the existing gate's offensive condition, not by a new machine.
- **Unassailability** — shared by both win-types: no in-balance coalition,
  including its regeneration-window recruitment look-ahead, can reach the
  breaking ratio against the candidate's shield. One irreversibility
  definition across both terminals; the forward-looking window IS the
  persistence check (no retrospective counter).
- Realms below the projection floor are outside the balance (hermit clause)
  and excluded from both sides of the arithmetic.

The system trips on true values; the player reads a banded estimate
(uncertainty duel preserved at the ending).

## Rejected alternatives

- Occupation-percentage or capital-count victory — conflicts with the
  settlement model (annexation via settlement, not grinding).
- Strict snapshot dominance (1.0 threshold, no window) — would need a
  separate persistence patch and would let the measurement panel's
  threshold leak into the winner rule (rejected in DT-③, grounds 1–2).
- A defensive-moat finish — rejected on the aggression ethos: the win is
  out-fighting the board, not out-turtling it (DT-③, ground 3).

## Consequences

- The denied-dominant wall converts into decisions (measured post-build via
  the DT-① timing ruler); the genuine-standoff residue is owned by the §5
  conquest growth engine (DT-②), not by the gate.
- Any future change to a win condition falls under the documentation law's
  mandatory ADR trigger — it must land with an ADR in the same batch.

## Authoritative homes (definitions and dials — not here)

- Gate formula, sealed ratios and window: match-arc `GLOSSARY.md` 패권 결정점
  row; history RULINGS ⑨⑪⑮⑰.
- Domination branch and its dials: match-arc `RULINGS.md` DT-③.
- Projectable mass and the hermit floor: match-arc `GLOSSARY.md` 투사 가능
  질량 / hermit rows.
- Match-closure lever (cap growth): combat-formula `MAGNITUDE.md` M13.
