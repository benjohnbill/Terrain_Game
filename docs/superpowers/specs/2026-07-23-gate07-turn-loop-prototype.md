# Gate 07 Crossing — Turn-Loop Interaction Prototype (throwaway)

Date: 2026-07-23

Status: Prototype build spec (Working layer). NOT a Production seal.

**Resolved 2026-07-23 — gate 07 SEALED by live user reaction.** The prototype was
built (`mockup/combat-calc/turn-loop-prototype.html`) and, after a live-feedback
reshape to a **casual, commit-first** design (thin top strip / map-fills-middle /
commit-bar hero, with the info layer summoned by the commit decision rather than
always painted), the user judged the interaction skeleton and its decision order
to match the imagined play process (flow/feel axis; graphics polish held out of
scope). **Navigation resolved to a coupled continuous camera (연속 줌, wheel +
drag)** over decoupled click-drill; a UoC2-grade graphic zoom + physical
camera-height is a deferred future item. The renderer stays SVG
(measurement-gated). Full sealed set, held-candidate set, and the doc-sync batch:
`.scratch/l3-playable-seam/issues/07-prototype-map-fog-presentation.md` § Answer.
The seal is a revisable-in-play checkpoint (the land-first command order remains a
candidate revision).

Type: prototype (throwaway UI). Home gate:
`.scratch/l3-playable-seam/issues/07-prototype-map-fog-presentation.md`.
Design decisions behind this spec: project memory
`terrain-game-recon-fog-economy.md` (all candidate/가안, unsealed).

## Problem Statement

The player-facing shape of the L3 game has never been felt as a moving whole.
The sealed war model, fog contract, and commit economy exist as verified logic,
but nobody has sat in front of "one turn of this game" and confirmed that
playing it — reading the board, deciding, committing, and seeing the result —
flows naturally rather than as a spreadsheet of numbers behind summon buttons.
The v0 static prototype failed live evaluation at the first step: it painted raw
evidence at the top level and forced panel-text reading. The open worry the user
has voiced repeatedly is that "the more it is designed, the less fun it looks."
That worry cannot be answered on paper; it is an interaction-feel question.

## Solution

A throwaway, single-page interactive prototype that plays **one full loop of a
turn** on an authored mid-game fixture: the player reads a three-layer fogged
board, allocates a shared **commit pool (커밋 풀)** across a few actions through a
bottom **commit bar**, and ends the turn into a two-sided **showdown (결전)**
whose results become the next turn's information state — so the loop visibly
closes on itself. No combat logic, no art assets. The prototype exists to let
the user feel whether the interaction skeleton is fun and legible, and to settle
one open sub-question live: whether semantic zoom should be **coupled** to a
continuous camera or **decoupled** as click-drill.

The prototype is throwaway from day one (prototype skill discipline): it is
captured to a throwaway branch when done, a context pointer is left on gate 07,
and only validated decisions are folded back into the sealed docs.

## User Stories

### Reading the board (three read layers)

1. As a player at rest, I want public geography — terrain, fortification grade,
   routes and choke widths, current political control, region/sector identity —
   to be readable without spending anything, so that situation judgment
   (형세판단) has something to read.
2. As a player, I want my own state (substance/병력, fatigue, field-army
   position, treasury, register, commit pool) shown exactly, so that I never
   fog myself.
3. As a player, I want enemy substance and fatigue shown only as a
   true-containing **estimate band (밴드)** with felt width, never a comfortable
   midpoint, so that uncertainty is a real cost I feel.
4. As a player, I want a stale enemy sector to read as a *wider* band than a
   recently-scouted one, so that band width visibly encodes intel freshness.
5. As a player, I want enemy standing posture and commit allocation to be
   absent (hole cards, 홀카드) — never shown, never predicted by the system —
   so that reading intent stays my move, not the dealer's tell.
6. As a player, I want a last-seen enemy field army shown as a dated fix plus a
   **reach cone (도달 원뿔)** that grows with staleness, so that I read where it
   *could* be, not where it certainly is.
7. As a player, I want a **border alarm (국경 경보)** to fire the moment an enemy
   force enters my border zone, carrying existence and heading only, so that I
   am never blindsided but never handed the invader's scale for free.
8. As a player, I want a **threat board** that aggregates my already-earned
   intel (observed reach cones intersected with my fronts) into "which of my
   fronts are in range this turn," so that anticipation is toolkitted, not a
   manual assembly — and un-scouted forces do not appear on it.
9. As a player, I want the situation axes (위협/기회/불확실) and a match-level
   **Standing (판세)** band at the top level as sparse conclusion-hints, so that
   L0 stays a hint layer, not an evidence dump.

### Commit bar and the summon grammar

10. As a player, I want a horizontal commit bar across the bottom holding my
    per-turn commit pool as ~20 slots, so that the single most-used control is
    the entrance to every action.
11. As a player, I want to click or drag slots to allocate an amount to an
    action, then choose the action, so that allocation and intent are one
    gesture (하스스톤-like cost spend).
12. As a player, I want the pool to be freely divisible across as many actions
    as I like (up to the slot count), with no "main/sub" distinction, so that
    how finely I split is my choice.
13. As a player, I want unused commit to not carry to the next turn, so that
    "spend now vs invest in future levers" is a structural pressure, not a
    hoarding game.
14. As a player, when I commit to a point on the map, I want a radial menu
    (지목→소환) to bloom from that point offering the actions available there, so
    that command is map-native with no persistent sidebar.
15. As a player, I want selecting an action to disclose its operation plans
    (작전 플랜) as a matryoshka step (L0→L1→L2), so that depth is summoned, not
    laid bare.

### The three wired verbs

16. As a player, I want to attack an enemy sector: commit an amount, pick one
    operation plan, and target a sector, so that offense uses the same
    commit→action→target grammar as everything else.
17. As a player attacking, I want a **what-if calculator** — a poker calculator
    — that, given my commit and plan, shows my projected loss/gain as a band
    *conditional on an assumed enemy commit and plan I dial in myself*, so that
    the system reads honest instruments but never predicts the enemy's hidden
    hand.
18. As a player, I want to set a defensive posture/plan on one of my threatened
    fronts using the mirror of the attack UI (glow on my own front, defensive
    plans in the radial, the same what-if calculator asking "if the enemy hits
    with commit X plan Y, do I hold?"), so that defense is the same game as
    attack, only the verb and glow target mirror.
19. As a player, I want to run **basic reconnaissance (정찰)** on an enemy sector
    by spending commit, narrowing its band a rung (0.45→0.70→0.90 ladder) and,
    for a tracked army, fixing its position, so that information is a paid,
    deliberate act.
20. As a player who scouts a sector, I want its enemy-force reading to visibly
    brighten (raised saturation/clarity) while its intent (hole cards) stays
    dark, so that "I opened my eyes here" is felt, without the visuals lying
    that I now know everything.
21. As a player, I want recon to also let me read the target's derived
    **mobilization intensity (동원 강도)** band, so that "is that realm scraping
    the bottom" becomes a scoutable judgment.

### Facade actions (UI real, logic inert)

22. As a player, I want **instant reconnaissance (즉시 정찰)** to exist as a
    selectable, commit-consuming action with full radial/matryoshka UI, so that
    its place in the flow is felt — even though its logic and showdown effect
    are not wired this cut.
23. As a player, I want fortification and recruitment (모병) to be selectable,
    commit-consuming actions with full UI, so that the commit economy feels
    complete — even though they produce no showdown or next-turn effect.
24. As a player, I want the non-wired operation-plan variations of the wired
    verbs to appear in the radial and be selectable, so that the menu reads as
    rich — even though only one plan per verb is wired to a result.
25. As a player, I want every facade action to still consume commit visually, so
    that the "I cannot do everything with 20" tension is real regardless of
    which actions are wired.

### Turn-end: loop closure

26. As a player, when I end the turn, I want my committed attack to resolve into
    a **showdown** where the enemy's hole cards flip (their actual posture and
    commit are revealed) and I see whether my what-if read held, so that the
    poker payoff closes the loop.
27. As a player, I want the scripted enemy attack on my defended front to also
    resolve at turn end, with my defensive plan shaping the outcome, so that the
    loop closes on both faces.
28. As a player, I want the world to update from the resolution — scars on
    fought sectors (the land remembers), control shifts — rendered on the map,
    so that efficacy is the map becoming the match's own history.
29. As a player, I want resolution events (my showdowns, the enemy's move,
    border alarms) to arrive in an ordered **event tray** with immediate skip
    and deliberate step-through, so that I control how long each explanation
    stays, since the runtime resolves instantly.
30. As a player starting turn N+1, I want the fought sector's band to be updated
    (I now know it post-battle), the resolved threat to be in a new state, the
    scars still visible, and my mobilization ticked down, so that what resolved
    at turn end *is* what I read next turn.

### Navigation variants (the open sub-question)

31. As a player, I want to switch the board's navigation mode with a toggle
    (floating bar + `?nav=` param) between **decoupled** (click a province to
    drill L0→L1→L2; camera zoom is an independent control) and **coupled**
    (one continuous camera zoom whose thresholds also switch the semantic
    layer, CK3/Total War style), so that I can play the same fixture both ways
    and feel which navigation is better.
32. As a player, I want the coupled mode to let the viewpoint physically lower
    and the map be browsable as a place during thinking time, so that the camera
    experience (commanding a world) is tested, not just information altitude.

### Development honesty

33. As a player, I want a development-only placeholder (supply/보급) to announce
    itself with a hatch pattern and a "DEV — NOT IMPLEMENTED" badge, never
    borrowing enemy truth as filler, so that an unbuilt mechanic can never be
    mistaken for real fog or real state.

## Implementation Decisions

### The one seam: a static viewer-safe projection

- The entire page renders from a **single static viewer projection object** —
  the authored fixture. Every band, fix, age, alarm, and derived read is
  pre-baked viewer-safe fiction. **No hidden truth exists anywhere in the page**
  (no DOM attribute, renderer object, tooltip, debug panel, or CSS-hidden
  element holds a value the viewer may not see). Because there is no truth to
  hide, the gate-03 non-leak invariants hold by construction. This is the
  highest and only integrity seam; everything else renders from it.
- The showdown "reveal" is authored into the fixture as the post-resolution
  projection, not computed from a hidden pre-resolution truth.

### Turn-loop reducer (scripted)

- A small in-memory pure function `(projection, playerAllocations) →
  nextProjection` plays the two-sided showdown and produces turn N+1's
  projection. Outcomes are **authored, not computed** — there is no combat
  formula in the prototype. The reducer's job is to surface state change across
  the loop boundary (scars, band updates, mobilization tick, event tray).
- Only the three wired verbs (attack / defense / basic recon) feed the reducer.
  Facade actions consume commit in the UI state but are no-ops in the reducer.

### Commit bar

- Bottom horizontal bar; the pool is `{ perTurn: ~20, remaining }`, free-split,
  non-bankable (mirrors the sealed `commit.js` shape — pure, per-turn
  regenerating, leftover discarded). Allocation draws reduce `remaining`;
  simultaneous allocations sum to at most the budget. No "main/sub" concept.
- Allocation gesture: click/drag slots → radial menu at the map point → action →
  matryoshka plan disclosure. "Spend rest" convenience affordance (end-slot
  click fills remaining).

### What-if calculator

- On a wired attack or defense, given (my commit, my plan) and a **player-dialed
  assumed enemy commit + plan**, the calculator returns a projected outcome band
  from the viewer-legal inputs only. It never renders a system prediction of the
  enemy's hidden choice; the enemy commit/plan inputs are the player's
  hypothesis, dialed by the player. This is the poker calculator.

### Renderer and shell

- SVG renderer, reusing the authored map geometry already drawn by the
  workbench (`map-mockup.html` precedent): terrain polygons, sector seams, choke
  borders, routes, landmarks, smoothed silhouette. No escalation to Canvas/
  PixiJS by ambition — SVG is the measurement-gated default.
- Keep map-drawing functions separate from shell/command/event functions so the
  renderer-owns-geometry / shell-owns-panels-command-events boundary (ADR 0039,
  gate-07 constraints) is inspectable. React is not required in a throwaway
  single file; the boundary is a code-organization discipline, not a framework
  mandate.

### Navigation variants

- `?nav=drill|zoom` + floating bar toggle, on one route, same fixture. **Build
  decoupled (`drill`) first** so the turn flow runs end to end, then layer
  coupled (`zoom`) as the second option for the live comparison.
- Coupled mode couples camera zoom thresholds to semantic-layer switching and
  adds pan/zoom + LOD pressure — the exact family the renderer stress test will
  later measure. This prototype does not run that measurement; it produces its
  inputs (max simultaneous animated marks; whether zoom is continuous).

### Incoming-event presentation (prototype-provisional)

- Events populate the ordered event tray at the turn boundary with a glanceable
  arrival signal (count/pulse), and full step-through is on demand (skip/step,
  the sealed pacing). This is a **provisional prototype choice** on the
  push/pull/hybrid question — not a seal; the live session judges it. The
  earlier "pull-only for consistency with staff briefings" rationale is void
  because staff briefings are dropped (below).

### Fixture: "중원 쟁탈 — mid-game peak war"

- **Player realm:** 관중 (r6, mountain, 6 sectors) + 촉 (r8, plains basin, 3
  sectors), the sealed authored map's real corner (no invented geography).
  Mid-game; **mobilization intensity high** (projectable mass near ceiling,
  register thinning — a "spend the surge before the well runs dry" clock);
  **mid-tier power** (판세 reads mid-band); peak-war tempo.
- **North front (WIRED, offense):** 관중 → 중원 through the pass; the target
  중원 sector reads as *thinning* (hollow-province read, medium band). Its
  posture/commit are hole cards → what-if only.
- **East front (WIRED, defense):** 중원 → 촉 (into the softer basin); a scripted
  enemy field army has just entered the border zone (border alarm fired, wide
  band, large reach cone) and is scripted to attack this front next turn — the
  reactive target the defensive verb responds to.
- **West front (FACADE, board density):** 서역 (desert) nomads probing 관중's
  western pass — a distant, loosely-scouted army (wide band) present on the
  threat board but not scripted to attack this turn. Present to test whether the
  matryoshka disclosure stays legible under realistic multi-front load.
- **DEV placeholder:** supply (보급), hatch + "DEV — NOT IMPLEMENTED" badge.

### Staff briefings dropped

- The staff-briefings (참모 보고) feature candidate registered in gate-07 act 1
  is **withdrawn** (user, 2026-07-23): it existed to help players navigate a
  complex UI via bot archetypes; with the commit-bar spine the UI is not
  complex, so the crutch becomes a barrier and infringes the "judgment is the
  player's" identity. No seal was reversed (it was an unregistered candidate).
  Consequence: the reserved ②-layer seam's proposed first occupant is void, and
  the act-1 L0-consolidation hypothesis is moot. Distinct and NOT dropped by
  this: the sealed single operation-plan-recommendation baseline (a separate
  concept) — retiring it, if desired, is a deliberate sealed-doc decision, not a
  drift.

## Testing Decisions

- This gate is resolved by **live user reaction**, not automated tests — the
  prototype is throwaway and has no test suite (prototype skill rule 4).
- The live evaluation is a scripted sequence the user performs on the fixture,
  once per navigation variant (`drill` then `zoom`):
  1. Identify public geography and the currently focused front.
  2. Distinguish own-exact state, enemy estimate band, and categorically hidden
     state (hole cards) without instruction.
  3. Explain where the last-seen eastern army might now be (reach cone).
  4. State what the border alarm reveals and what it does not.
  5. Scout the eastern threat once; explain what visibly changed in the band and
     the map (the brighten beat) — and confirm intent stayed dark.
  6. Allocate commit across attack (north), defense (east), and recon, feeling
     the "cannot do everything with 20" tension; dial a what-if on the attack.
  7. End the turn; follow the two-sided showdown via skip/step; confirm the
     hole-card flip reads as a payoff.
  8. Start turn N+1; confirm the fought band updated, scars persist, threat
     resolved, mobilization ticked — i.e. the loop closed.
  9. Identify the DEV placeholder without instruction.
  10. Repeat under the other navigation variant; state which zoom coupling felt
      better and why.
- Recorded per run: the user's words, the encodings that worked, the encodings
  rejected, the viewport used (user viewport 1591 px; desktop/native target, no
  responsive lower bound), and whether SVG interaction stayed responsive under
  the multi-front board.
- Prior art: the v0/v1 fog prototypes are the failure/iteration exemplars;
  `map-mockup.html` is the authored-geometry precedent.

## Out of Scope

- **Combat logic / arithmetic.** All showdown outcomes are authored, not
  computed. The prototype tests interface flow, not the war model.
- **R14 war-decisiveness (the upstream fun question).** Whether the war *after*
  the decision is decisive/spectacular is a separate pass (gate-08 long pole);
  a good-feeling prototype does not answer it, and the two must not be conflated.
- **Instant reconnaissance logic.** UI is in scope (facade); its logic, cost
  tuning, and showdown effect are not. Its adoption is candidate-only, gated on
  measurement.
- **The renderer stress test itself.** Separate, downstream; this prototype
  produces its inputs, does not run it.
- **Sealing the showdown reveal scope** (exact commit vs band vs posture name).
  The prototype uses a placeholder reveal; the scope is gate-08-adjacent and is
  not sealed here.
- **Radar / detection pricing numbers, and value-driven differential
  coefficients.** Deferred to after the value-driven map scale-up pass; the
  current world is parity-flat, so differential pricing is meaningless until
  then. Structure only (province-unit scope, value-driven) is decided; numbers
  are not.
- **Map scale-up / re-authoring.** Direction sealed (more regions, sectors by
  value, nation count unchanged); numbers unsealed; timing gated behind the
  war-termination pass. Current ~5–8 hex/sector resolution is frozen (TC-⑪).
- **Art / asset pipeline / juice polish** (diorama aesthetic, scar rendering
  craft) — the named presentation pass, parked.
- **Staff briefings** — dropped (above).

## Further Notes

- **Throwaway discipline (prototype skill):** locate the file next to its
  predecessors (`mockup/combat-calc/`), name it so a reader sees it is a
  prototype, run it via the existing static server (`python3 -m http.server
  8007`; hard-reload after edits — the profile caches JS). When validated,
  capture the prototype to a throwaway branch out of main and leave a context
  pointer on gate 07; fold only the validated decisions into the sealed docs.
- **Doc-structure note (SYNC-DEBT):** the issue-tracker config routes specs to
  `docs/features/<slug>/specs/` (ticket-11 routing verdict), but live practice
  and all 14 existing specs sit in `docs/superpowers/specs/`, and no feature
  `specs/` directory exists yet. This spec follows live practice; the divergence
  is logged, not resolved here.
- **At gate-07 seal (queued doc-sync duties):** formal amendment of issue 03 §4's
  derived-band grouping (판세 re-leveled match-level); the two unruled inventory
  items (enemy standing-rebel stack visibility; showdown reveal scope — the
  latter deferred to gate-08); the recon/fog-economy candidates in project
  memory promoted to `docs/features/fog-of-war-discovery/` RULINGS/GLOSSARY as
  they seal.
