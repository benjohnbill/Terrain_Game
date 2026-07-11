# ADR 0036: Crisis Rebellion Body and the Death of Peacetime Institutions

Date: 2026-07-12

Status: Accepted (design-level; dial values 가안 — dial table rides the
implementation plan)
Extends: ADR 0035 (skeleton → body). The rebellion-body deferral
recorded in ADR 0035's Consequences is paid; ADR 0034's gate 5
(terrain resonance) is resolved.
Decision source: rebellion-body & peacetime-institutions grill,
user-sealed 2026-07-12 (match-arc RULINGS **CE-⑬…⑳** — birthplace;
this ADR is a summary + pointer per the single-definition rule).
Evidence: L0 demographic-spiral probe (six scenarios, session
transcript); tournament harness source read (truce/stall
implementation, `mockup/combat-calc/tournament.js`).

## Context

ADR 0035 sealed the crisis skeleton and explicitly deferred the
rebellion's body (suppression resolution, seceded-sector behavior,
gate-5 terrain resonance, peaceful-cession scar) and the total-war
stage table. The follow-up grill ran the same night. Mid-grill, a user
layer question ("is the harness truce an L2 가안 or a gameplay
principle?") surfaced that two institutions the stage table must cut —
truce and white peace — existed only as harness placeholders
(SPEC_GAPS ⑤/⑦), forcing their canonization into the same pass.

## Decision

1. **Suppression resolves through the existing combat arithmetic**,
   auto-resolved per sector: the suppressor side is the defense-axis
   composition as a whole (bodies + reserves, defense commitment,
   fortification); rebels defend as stack × terrain, lever 1, no fort;
   no threshold or stamps — attrition only. (CE-⑬)
2. **Rebellion body**: fuel = scar × mobilization intensity, with scar
   concretized as cumulative usable damage ever taken and intensity
   the sealed 동원 강도 (demobilizing cools fuel); rebel cap = the
   sector's conscription register; rebel deaths erase the register
   permanently (the demographic spiral is emergent; register-exhaustion
   rate = sweep watch); rebel combat effectiveness ⅓ as a rebel
   constant, not a quality tier; the denial term reads raw rebel mass
   (qualification by force, confirmation by acceptance). (CE-⑭)
3. **Seceded sectors** complete their rise and freeze: no contagion
   (simultaneous eruption, not spreading waves), retake = normal armed
   occupation whose damage writes new scar. (CE-⑮)
4. **Gate 5 is satisfied by structure**: the center burns hot but
   suppresses cheap; the periphery's shield-terrain shelters its own
   rebels — exposure and shield invert with zero new multipliers. New
   sweep read: per-terrain-class suppression cost differential. (CE-⑯)
5. **Peaceful cession is scar-free** — a corollary of the scar
   definition, dissolving CE-③'s open dial; settlement is the
   clean-hands expansion path. (CE-⑰)
6. **Truce lock canonized** as world law (mutual, pairwise, every war
   end; 4 turns L2-exercised 가안) — the acceptance arithmetic
   presupposes real peace, and the overlay must cut public law, not
   bot habit. (CE-⑱)
7. **White peace canonized as the settlement ladder's 0% rung**; the
   harness auto-exit is demoted to bot policy and never binds a human
   player. (CE-⑲)
8. **Total-war stage table sealed as shape**: the truce shortens then
   dies; the ladder breaks from the bottom rung up (백지 → 관대 →
   표준); only 최대 and 복속 survive; the hegemony settlement is
   structurally exempt. Turn boundaries 가안. (CE-⑳)

## Rejected alternatives

- Suppression as a simpler pacification read outside the combat
  arithmetic (loses terrain resonance, makes forts decorative).
- Suppression-side lever hard-fixed at 1 (agent's original wiring —
  overturned by the user's commitment probe; the defense-axis
  unification subsumed it).
- Denial at ⅓-effective mass (agent recommendation — overturned by
  the user's "is the hegemon decided purely by force?" reframe).
- Cumulative-mobilization fuel numerator (would fork the sealed
  동원 강도 definition; the sealed current-state definition keeps the
  spiral AND yields demobilize-as-cooling).
- Rebel ⅓ in the quality slot (reopens the sealed quality=1
  simplification).
- Adjacency contagion for seceded sectors (new mechanism; the calendar
  already erupts everywhere — Yellow-Turban simultaneity).
- Growth-side terrain term (double-counts the defense-side resonance).
- Full settlement void at the arc's end (limbo-freeze risk vs the
  ≤0.1% draw target).
- Calendar decay on the sovereignty premium (a new curve, not a cut).

## Consequences

- The crisis design is COMPLETE through the body; next = implementation
  plan + dial table, then the sweep against the CE-⑫ gates plus two
  new watch items (register-exhaustion rate; terrain-class suppression
  differential).
- The dial table SHRANK: scar-increment dials eliminated (derived from
  usable damage); suppression-scar σ demoted to a 0-candidate sweep
  item. Remaining: denial conversion coefficient (sweep #1), secession
  N, rate staircase, stage-table turn boundaries, truce length.
- SPEC_GAPS ⑤ and ⑦ are resolved (stamped in RULINGS §SPEC_GAPS);
  five of the original seven still defer to B.
- Truce-lock formalization is a prerequisite task of the crisis
  implementation plan (the stage table legislates over it).
