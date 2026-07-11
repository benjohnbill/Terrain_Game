# ADR 0035: Match End — Internal-Uprising Crisis Arc (Design Skeleton)

Date: 2026-07-11

Status: Accepted (design skeleton; rebellion-body mechanics, dial
values, and the measurement read are deferred — see Consequences)
Amends: ADR 0034 on three points — (1) crisis source family: barbarian
invasion (이민족 침입) → **internal uprising** (봉기, karma-driven);
(2) fallback: judged scorecard → **Westphalian draw** (no second judge
ever); (3) timeline: turn-32 bell + ~3-turn encroachment → **crisis arc
turn 25→35** with rolling assessment. ADR 0034's five gates and three
riders are source-agnostic and remain binding.
Mandatory-ADR trigger: this changes a win condition (the judged
scorecard is removed; a draw outcome is introduced) — documentation
law, forensics F-06.
Decision source: crisis-ending design grill, user-sealed 2026-07-11
(match-arc RULINGS **CE-①…⑫**). Evidence:
`docs/features/match-arc/research/2026-07-11-crisis-endgame-historical-precedents.md`
(Codex historical survey, commissioned mid-grill).

## Context

ADR 0034 sealed the direction (a rule-driven, preparable sudden-death
crisis instead of a judged verdict) and mandated a dedicated design
pass bound by five gates and three riders. That pass ran the same
evening. Three findings reshaped the direction's parameters:

1. **External invasion carries positional 억까** — geographic entry
   punishes seats for map position; an internal, karma-keyed source
   makes crisis pressure a function of each realm's own conduct
   (legible causality, gate 2 strengthened: preparation IS governance).
2. **A judged winner inside a no-winner ending is incoherent** — the
   scorecard fallback was a second judge in disguise; a draw completes
   the one-judgment identity and its very threat drives late aggression.
3. **A 3-turn hammer under-serves the design** — a known, long
   transformation arc (Baron-timer psychology) aligns the crisis onset
   with the envelope's right edge (turn 25) and gives the
   betrayal-politics rider room to cycle; turn scale (months–a year per
   turn) matches historical endgame collapses.

## Decision

The match-end mechanism is an **internal-uprising crisis arc**:

- **Crisis = bellows, never judge** (CE-①): the hegemony decision point
  remains the sole winner rule; the crisis erodes the deadlock (shield
  order + coalition glue) that keeps it from tripping.
- **Karma fuel** (CE-③): per-sector uprising fuel = cumulative scar
  ledger (violence events; never decays; land-bound; inherited on
  conquest) × mobilization intensity. Fog-spec visibility (L3).
- **Arc + rolling assessment** (CE-④): onset turn 25, escalating
  staircase rate(t), hard end turn 35; each crisis turn bills rate(t) ×
  current fuel — conquest during the crisis inherits the fire.
- **Linear bill** (CE-⑤): a tax, not a punishment; progressive reserved
  as a measured fallback.
- **Pay / refuse grammar** (CE-⑥): refusal burns sectors (economy loss,
  scar growth, escalation); N unpaid turns → secession by neglect.
  Burn-and-rush (race the gate while home burns) is the designed gamble.
- **Pacification condition** (CE-⑦): standing rebel mass counts into
  the unassailable check's denial side — the crown requires conquest +
  pacification (평정); resolves the "barely-survived winner" question.
- **Soil-and-crop embodiment** (CE-⑧): karma = soil, standing rebels =
  a visible per-sector stack (grows by rate × karma, shrinks under
  suppression, secedes past threshold). Suppression itself scars
  (magnitude dial, 0 allowed).
- **Total-war overlay** (CE-⑨): calendar-staged death of the promise
  enforcer (truces void, settlements void — stage table = dials); same
  war machine, no new arithmetic.
- **Shield-natured suppression** (CE-⑩): paid from garrisons, reserves,
  register; field diversion optional. Walls hollow while swords stay
  whole — the arc is the most war-dense phase, not a chore decade.
- **Westphalian draw** (CE-⑪): turn-35 hard end is a draw; target
  invocation < 0.1%.

## Rejected alternatives

- External barbarian invasion (positional 억까; ADR 0034 wording).
- Rebels as a third power with AI and armies (mid-game event timescale,
  not an ending device; parked).
- Crisis as its own victory judge; hybrid crisis win conditions.
- Fixed-clock coalition erosion (free sit-and-win — a scorecard in
  disguise; killed by the user's 존버 challenge).
- Bell-snapshot billing (ten karma-free turns after onset).
- Progressive bill curve as the default (leader execution, gate 4).
- A third "abandon" crisis action (collapses into sustained refusal).
- Separate finale plan catalog / changed combat arithmetic (URF mode).
- World-fire-threshold overlay triggers (predictability loss).

## Consequences

- **SPEC amendment proposal** drafted at
  `docs/features/match-arc/SPEC-AMENDMENT-DRAFT-crisis-ending.md` —
  SEALED 2026-07-11 (user decision): applied verbatim to `SPEC.md`
  § "How a match ends (crisis arc)".
- **Deferred to a rebellion-body grill**: suppression resolution
  mechanics (combat arithmetic vs pacification read), seceded-sector
  behavior, gate-5 terrain resonance under the internal source,
  peaceful-cession scar question.
- **Dial table rides the implementation plan**: rate staircase, scar
  increments, overlay stage table, denial conversion coefficient,
  secession threshold N, suppression-scar magnitude.
- **Acceptance criteria** (CE-⑫): draw ≤ 0.1%; war density 25–35 ≥
  15–25 (chore-prevention); gate-4 watch; scar-inflation
  differentiation; raid-attrition strength; draw-coalition degeneracy;
  leader-agency (no unpreventable hopeless states).
- The pre-crisis baseline
  (`research/2026-07-11-record-world-baseline.txt`) remains the
  measurement anchor; dd semantics change under the crisis mechanic
  (gate-recalibration grill reads post-crisis data).

## Authoritative homes

- Rulings: match-arc `RULINGS.md` **CE-①…⑫** (birthplace).
- Terms: match-arc `GLOSSARY.md` (uprising fuel, scar ledger, standing
  rebels, soil-and-crop model, secession by neglect, rolling
  assessment, crisis arc, Westphalian draw, total-war overlay,
  pacification condition, suppression, burn-and-rush).
- Evidence: `research/2026-07-11-crisis-endgame-historical-precedents.md`.
