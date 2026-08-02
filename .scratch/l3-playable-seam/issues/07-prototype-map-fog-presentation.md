---
type: prototype
status: resolved
blocked_by: [03, 06]
---

# Make Uncertainty Legible Without Leaking Truth

## Question

On the authored map, what is the cheapest L3 presentation that makes public
geography, own exact state, enemy estimate bands, last-seen positions, reach
cones, border alarms, and development-only placeholders distinguishable at a
glance? Determine what React owns, what the renderer owns, and whether the
existing SVG/Canvas approach is sufficient through live user reaction.

## Prototype constraints

- This gate is resolved by live user reaction, not by document reasoning alone.
  It must use the accepted authored world contract and viewer-knowledge matrix
  from gates 03 and 06.
- Public terrain and fortification remain readable under every Fog treatment.
  Hidden truth may not be placed in DOM attributes, renderer objects, tooltips,
  debug panels, or CSS-hidden elements.
- React owns application layout, panels, command composition, ephemeral focus,
  event presentation, and accessibility. The renderer consumes only a viewer
  projection and emits focus/gesture data; it owns geometry, map hit-testing,
  camera transforms, and map-layer drawing.
- The Runtime resolves immediately and never sleeps. Bot-event pacing is
  therefore a presentation choice: the prototype must test comprehension
  without making artificial waiting a rule-system dependency
  ([issue 02](02-define-game-runtime-authority.md)).
- A development placeholder must announce itself. It cannot imitate functional
  Fog or satisfy the L3 scouting gate.

## Existing renderer evidence

The authored-map workbench already draws the representative world as SVG,
including terrain polygons, sector seams, choke borders, routes, landmarks,
labels, and a smoothed coast silhouette
(`mockup/combat-calc/map-mockup.html:26-55,134-228`). The editor also uses SVG
(`mockup/combat-calc/map-editor.html:38,130-184`). That is enough evidence to
prototype semantic overlays before introducing a Canvas or PixiJS dependency;
it is not yet evidence that SVG meets the final interaction/performance gate.

## Prototype variants

### A. SVG semantic layers hosted by React

Reuse the authored SVG geometry in a renderer adapter. Keep terrain and
political geography stable; layer sector focus, confidence texture, estimate
glyphs, last-seen fixes, reach cones, border alarms, and command targets above
it.

- **Strength:** quickest route to a faithful clickable map, crisp labels, DOM
  accessibility, and inspectable layer ownership.
- **Cost:** many animated marks or broad translucent cones may eventually expose
  SVG update pressure; that must be measured rather than assumed.

### B. Canvas owns the full map surface

- **Strength:** cheap high-volume drawing and straightforward compositing.
- **Cost:** hit testing, accessible descriptions, semantic inspection, and text
  layout must be rebuilt. It spends migration budget before SVG has failed.

### C. React renders map cells directly

- **Strength:** familiar component composition.
- **Cost:** couples renderer internals to the UI tree and weakens the independent
  renderer axis accepted by ADR 0039. This is not recommended.

## Presentation hypotheses to put in front of the user

- **Public layer:** normal terrain, route, sector, fortification, landmark, and
  the control treatment selected by gate 03. Do not dim the whole board as a
  generic Fog effect.
- **Own exact state:** solid friendly marks and exact values in the focused
  panel.
- **Enemy estimate:** an uncertainty texture on the mutable military mark plus
  an explicit low–high band in the focused panel; never print a midpoint as if
  exact.
- **Last seen:** a dated/aged fix marker connected to a translucent reach cone;
  the cone communicates possible current position, not occupancy of every cell.
- **Border alarm:** a directional edge pulse/arrow and event item carrying only
  existence and heading.
- **Categorically hidden:** omit posture and current commit fields; explain
  their absence with stable copy rather than `?` values that look scoutable.
- **Development-only:** diagonal hatch plus a persistent `DEV — NOT IMPLEMENTED`
  badge and explanatory panel. Never use enemy truth as its fallback content.
- **Bot events:** an ordered event tray with immediate skip and deliberate
  step-through/autoplay. Runtime completion is instant; the player controls how
  long the explanation remains visible.

## Live evaluation script

The prototype session should ask one question at a time while the user performs
the same short sequence on two or three variants:

1. identify public geography and the currently focused front sector;
2. distinguish own exact state, enemy estimate, and categorically hidden state;
3. explain where a last-seen army might now be;
4. identify what a border alarm reveals and what it does not;
5. scout once and explain what visibly changed in the estimate and preview;
6. follow one bot event sequence, then use skip/step controls;
7. identify every development-only placeholder without instruction.

Record the user's words, the selected encoding, the rejected encoding, the
viewport used, and whether SVG interaction remained responsive. Only then can
the renderer and presentation contract be resolved.

## Recommendation

Prototype A first. Keep React responsible for shell, panels, command/event
flow, and ephemeral interaction; keep a dedicated SVG adapter responsible for
map geometry and viewer-safe overlays. Escalate to Canvas/PixiJS only if this
representative authored map produces measured interaction or layer-management
failure.

The honest cost is that SVG remains a hypothesis until the live session, and a
later renderer swap remains possible. This recommendation does not resolve the
gate; it prepares the concrete user test that does.

## Answer

Resolved by live user reaction 2026-07-23 (prototype
`mockup/combat-calc/turn-loop-prototype.html` — throwaway per ADR 0041 +
prototype skill; NOT L3 build source). The user's verdict on the flow/feel
axis (graphics/UI polish explicitly held out of scope, parked to the
presentation pass): **the interaction skeleton and its decision order match the
imagined play process.** The v0 "the more it is designed, the less fun it
looks" worry is answered for the sequence and skeleton — the thing paper could
not settle.

### Sealed by this gate

1. **The 7-grade viewer matrix (issue 03 §4) reads to a human — gate 07's real
   job (map.md re-cut).** Public terrain/control/seats read at rest; own force =
   exact solid counter; enemy = dashed "?" fix + felt-width band (no comfortable
   midpoint — invariant 7 made visceral); last-seen fix + reach cone growing
   with age; border alarm = existence+heading pulse only; hole cards
   (posture/commit) categorically absent; DEV placeholder = hatch + badge, never
   an enemy-truth fallback.
2. **The derived-band grade encoding** that map.md flagged as having "no
   encoding proposal anywhere": **판세** = match-level mini-meter (top strip,
   banded, progress-bar banned); **동원 강도** = sector-bound band summoned on
   command; **civilian register** = derived. Confirms the issue 03 §4 판세
   re-level (formal amendment landed this batch).
3. **The interaction skeleton — commit-first (user direction 2026-07-23).**
   커밋량 → 행동 소환 (exaggerated radial bloom) → 세부 작전 → 가능 지역 빛남 →
   지목. The **commit bar IS the entrance** (the entrance-design principle
   answered by the commit-bar spine — never spread-everything). Matryoshka
   disclosure. Turn-loop closure: turn N → two-sided showdown (hole-card flip)
   → world update (scars / control / band / mobilization) → turn N+1 — the loop
   visibly closes on itself.
4. **Navigation = coupled continuous camera (연속 줌, wheel + drag).** The
   2026-07-19 semantic-zoom-vs-camera-zoom sub-question is RESOLVED to
   **coupled** — one camera zoom whose thresholds also switch the semantic layer
   — over decoupled click-drill. Future item (user, deferred to the renderer /
   presentation pass): UoC2-grade graphic zoom + **physical camera height** (the
   viewpoint physically lowers into the world — a camera-height concern, not
   information altitude).
5. **Casual presentation principle (user direction 2026-07-23).** Three zones —
   a thin top info strip / the MAP fills the middle (calm at rest) / the COMMIT
   BAR is the hero at the bottom. The board's info and glow (enemy bands, reach
   cones, eligible-target glow) are **summoned by the commit decision**, not
   always painted. "커밋만 하세요." This answers the v0 clutter failure at the
   layout level.
6. **Renderer = SVG (variant A) sufficient for the feel.** The prototype carried
   the whole interaction on SVG. Renderer performance stays **measurement-gated**
   (spec "no escalation by ambition alone", ADR 0028, map.md § Not-yet-specified);
   the prototype produced the deferred stress test's INPUTS (coupled pan/zoom +
   LOD pressure, max simultaneous animated marks) but did not run the test.

### Held candidate / deferred (NOT sealed here)

- **Recon economy numbers** (instant-recon adoption, radar/detection pricing,
  value-driven differentials) — measurement-gated, deferred to the map scale-up
  pass. Registered as candidates in `docs/features/fog-of-war-discovery/RULINGS.md`
  ② and project memory `terrain-game-recon-fog-economy.md`.
- **Showdown reveal scope** (exact commit vs band vs posture name) — placeholder;
  gate-08-adjacent.
- **Combat arithmetic / R14 war-decisiveness** — gate 08 long pole. A
  good-feeling interface does not answer whether the war is decisive.
- **Land-first command order** (target before action) — the candidate revision
  the user floated; parked. The seal is a **revisable checkpoint** (user
  2026-07-23: "나중에 play하면서 얼마든지 수정 가능"), not a freeze.
- **Art / juice / asset pipeline, UoC2 camera-height** — the parked presentation
  pass.
- **Two unruled inventory items:** enemy standing-rebel stack visibility
  (unruled); showdown reveal scope (deferred gate-08).

### No ADR trigger

The presentation + navigation resolution fires no mandatory-ADR trigger (no win
condition, no cross-feature game model, no SPEC direction change). It sits
inside issue 07's already-sealed ownership split (renderer owns camera / geometry
/ hit-testing; React owns shell / panels / command composition) and ADR 0028's
measurement-gated renderer. Recorded here as Working-layer evidence; the fog
presentation rulings' birthplace is `docs/features/fog-of-war-discovery/`
(the gate-12 publication question stays open).

**Throwaway discipline (prototype skill).** Only the validated decisions above
fold into the sealed docs. The fixture, the geometry reuse (CRADLE_MAP
관중+촉+중원+서역 corner), and the scripted authored reducer are evidence, not
build source (ADR 0041). Throwaway-branch capture is **deferred** — the user
keeps iterating on the prototype in play; capture when iteration settles
(recorded in `docs/SYNC-DEBT.md`).

## Comments

### Session progress — 2026-07-19 (gate still open; interim record, not the Answer)

**Gate re-aimed (user-accepted).** The target is not a static grade-encoding
pass but the Situation-judgment **progressive-disclosure model** ("matryoshka"):
L0 = conclusion-level hints (situation axes, extremely sparse) → L1 = province
click/zoom → L2 = sector drill with evidence. The v0 static prototype
(`mockup/combat-calc/fog-prototype.html`, variants A/B) failed live evaluation
at step 1: it painted raw evidence (mobilization %) at the top level and forced
panel-text reading — violating "High Complexity, Low Micromanagement" and the
sealed frontsector-drill v5 지목→소환 grammar (no persistent sidebar; summoned
cards). Keep v0 as evidence of the failure mode.

**Derived-band grill outcomes (pre-prototype concept decisions, user-agreed):**
- 판세 (Standing) is isolated from the other derived bands (match-level vs
  sector-level). Its definition already exists (banded read of the hegemony
  decision-point arithmetic; map lens + summoned card; progress bar banned).
  판세 band width = epistemic uncertainty only (substance estimates + treasury);
  strategic unknowns (enemy commit / operation plan / reserves) do NOT widen it
  — they live in battle preview (build ticket 04), outside gate 07.
  *Amends issue 03's grouping of 판세 with the sector-level derived bands.*
- **Seam rider:** the 판세 surface serves reading (①) only; a slot for the
  strategy-decision layer (② yield/opportunity → commit sizing) is reserved
  between 판세 and battle preview but deliberately not filled by gate 07.
- Mobilization intensity / civilian register are **sector-bound** (GLOSSARY
  uprising-fuel row; realm-uniform was an L2 approximation only). Presentation:
  drill-down (province overview ↔ sector detail); province summary = worst-case
  first (casual signal) + distribution second (heavy-user surface); primary
  value = mobilization intensity, civilian register as focus detail.

**Research-drilling routing (user-directed comparative study, CK3 done):**
- CK3 de jure map modes + nested tooltips adopted as matryoshka evidence for
  this gate. Perk-tree UI parked (Phase 2; quality=1 sealed, tech unsealed).
- Poker correspondence confirmed: visible bets = mass layer (movement,
  mobilization, fortification — the gate-03 sign vocabulary), hole cards =
  commit/posture (깜깜이 시장 stands, no amendment), showdown = 결전, chips =
  blood. Gate 07's read layer is the tell-reading surface.
- **Sequencing ruling:** war-tempo work is ignition-then-amplifier — attack-EV
  fix (war-termination pass, already the gate-08 long pole) FIRST; map
  re-authoring / sector scale-up (value-parity + value-driven granularity
  principles, revision-local IDs from gate 06) only linked to a proven +EV
  ignition, bounded by the 30–40 min match envelope.

**Next steps:** user continues targeted game research (Into the Breach / Total
War / poker HUD candidates); agent builds the viewer-information inventory
(certainty grade × decision altitude × cadence × player type) from gate 03,
DISPLAY-DEBT, and the sealed GLOSSARY rows; then cross the two axes to fix the
L0/L1/L2 hierarchy and rebuild the prototype on it.

### Deception disposition — 2026-07-19 (user-confirmed)

"The dealer never lies; opponents bluff." System-side falsehood stays banned
(no invented false signals; true-containing bands; determinism/skill-piercable).
Deception lives in opponent ACTIONS read through honest instruments. The user's
charter sentence for the read layer: **the system shows the full possibility
space as "possible"; how much confidence to place where is the player's move;
misallocated confidence is the opponent's win, never the system's lie.**

Sealed-mechanics check of the user's three example plays:

- **Commit bluff** (visible aggression, low commit — or the inverse):
  supported. Commit is categorically hidden (깜깜이 시장); preview offers
  conditional what-if lines only, never predictions of hidden choices.
- **Frontal fixation → free split → flank march → supply cut → isolation**:
  every step sealed in slice 2 — field-army free division (ticket 04),
  deterministic hex-graph movement (02), public routes/chokes, supply
  connectivity predicate → starvation fatigue pump (02) — and the reach cone
  honestly displays the flank possibility the defender chose to discount.
- **Hannibal**: supported in its historically accurate form only — a
  legal-but-dismissed door (narrow choke, strait, slow detour), never a
  crossing of void range (impassability is deterministic and public). Design
  consequence routed to the map re-authoring pass: Hannibal plays require
  enough dismissible-but-legal side doors on the authored map.

Presentation takeaways adopted for the rebuilt prototype: (1) band **width
must be felt** — no comfortable midpoint reading (the Barbarossa lesson,
invariant 7 made visceral); (2) conditional what-if lines, never system
predictions of hidden enemy choices (routed to build ticket 04); (3) a
growth-projection derived display (public land-derived economy → forward read)
registered as a forecast-card-family candidate, zero new channels.

### Research round 2 — Total War: presentation-grandeur disposition — 2026-07-19

User's three strategy-sim satisfactions: historical-narrative participation ·
commanding-a-vast-world feeling · efficacy (my decisions visibly change the
world). Worry raised: React/Vite/TS cannot match engine-grade 3D grandeur.
Disposition — none of the three requires polygons:

- **Diorama, not realism.** The Total War campaign layer is a digital
  miniature table; the grandeur is "commanding a beautiful board." The
  project's sealed north star is already UoC-grade 2D (ADR 0028: UoC-grade
  map = an ASSET problem, PixiJS-grade candidate, no engine; the workbench
  already draws the UoC-style smoothed silhouette). Target: the peak of our
  weight class, not a degraded Total War.
- **Juice proportional to arc weight** (Hearthstone lesson generalized): the
  sealed match arc already names the "big damage" moments — shield-break,
  decisive battle, settlement, crisis onset, hegemony decision point. Battles
  are deterministically resolved then PRESENTED (pacing is a presentation
  choice, issue 02), so 2D cinematic language suffices (ItB precedent:
  weight without polygons).
- **Efficacy = rendering already-sealed state.** Scar ledger ("the land
  remembers", never decays) makes the map the match's own history book —
  scorched sectors stay visibly scarred, settlement land arrives undamaged.
  "Conquered land must look valuable" → asset direction: economy-value-dense
  sectors read as rich (city/field density). No new mechanics involved.
- **Semantic zoom is double-duty:** the matryoshka L0→L2 grammar is both the
  information altitude AND the commanding-the-world feel mechanism.

Routing: art direction / juice work = outside this Wayfinder (map.md § Out of
scope) — parked as a named future **presentation pass** carrying the three
principles above. Renderer stays measurement-gated (sealed: no escalation by
ambition alone); consequence for this gate: the prototype's renderer
measurement scope must include animated-mark/effect pressure, so the juice
ambition informs the measurement rather than the renderer choice.

Process note (user): periodic sub-agent folding of conversation rounds into
the inventory/domain glossary — affirmed as the pattern already in use this
session (per-round Comments + inventory agent); a standing mid-session sync
cadence is parked as a separate conversation topic.

### New sub-question — semantic zoom vs camera zoom — 2026-07-19

The matryoshka model as recorded is INFORMATION altitude (L0/L1/L2). The user
refined it: the zoom must also be a CAMERA experience — the viewpoint
physically lowers, the map is browsable as a place during thinking time, and
world changes (scars, control shifts) are felt at different altitudes with
mouse/keyboard focus movement. The open relation, to be resolved by live
prototype variants, not document reasoning:

- **Coupled** (CK3/Total War style): one continuous camera zoom whose
  thresholds also switch the semantic layer;
- **Decoupled**: click-drill switches semantic levels; camera is independent.

Renderer consequence: coupled zoom adds pan/zoom + LOD pressure — exactly the
measurement family map.md § Not-yet-specified already names; fold into the
prototype's measurement scope alongside animated-mark pressure.

Boundary notes closed without a grill: the game-side responsibility split is
already sealed (Runtime owns truth — gate 02; React owns layout/panels/
command composition, renderer owns geometry/hit-testing/camera/drawing — this
ticket's constraints; build topology — gate 05); the only unsealed ownership
is the graphics-asset pipeline, parked with the presentation pass. The
ADR/RULINGS/INDEX recording discipline the user requested is the repository's
standing documentation law; the one open item is the birthplace for
presentation rulings when this gate seals (a gate-12 publication question).

### Research round 3 — Unity of Command 2 — 2026-07-19

**Graphics anxiety closed.** The user judged the UoC2 look reachable in our
runtime with good assets — which is the already-sealed verdict (ADR 0028:
UoC-grade map = an asset problem, PixiJS-grade, no engine). North star
confirmed by the user against the actual reference.

**Feature candidate — staff briefings (참모 보고, working name, unregistered).**
User proposal: 5–6 archetype-flavored staff officers, summoned by button,
each delivering a glanceable card/collage report ("if I were you…" — proposed
target, scale, commit split), with user-assigned trust weighting; casual
players accept a plausible report, heavy players meta-read which archetype
fits the situation. Alignment found — three existing seals already host this:
(1) ADR 0019 v5 retired always-on recommendation TO a summoned work surface
(지목→소환) — this is that surface's first occupant candidate; (2) the sealed
operation-plan-recommendation concept (DOMAIN_MAP): objective/approach/commit/
posture/risk bundled as a statistical-average baseline, casual-acceptable —
the proposal pluralizes it into N archetype views; (3) the sealed bot
disposition + fog-band plan machinery is the officer brain, rented to the
player. Hard invariants confirmed with the user: officers consume ONLY the
player's own viewer projection (non-leak invariant 3; view spread = disposition
variance, never triangulation of hidden truth); reports are summoned, never
pushed (match-envelope protection). Trust-weighting fork RESOLVED (user, 2026-07-19): **presentation-only** —
trust weighting sorts/defaults/visually weights reports and never enters
arithmetic; no blending, no auto-execution ("판단은 유저 몫"). Preserves the
one-judgment identity with zero new dials.
Routing: the feature body is the FIRST OCCUPANT CANDIDATE for the reserved
②-layer seam (this ticket's seam rider) — registered here, designed in its
own pass, NOT in gate 07. Its single entrance button joins the L0/grouping
decision; crossing-session hypothesis: the "staff report" metaphor may
consolidate several oversubscribed L0 candidates (event tray, engagement
reports, crisis milestones) under one entrance.

**Entrance-design principle (user).** "Never spread-everything UI" — the
most-used buttons must be enter/exit buttons into grouped information, not
panels laid bare; traditional wargame UI grammar is an entry barrier for the
target audience. Consequence adopted: the crossing session's L0 trim is
reframed as ENTRANCE DESIGN — how the 44 inventory values group into few
entrances — not a per-value keep/cut vote. UoC2 visual devices seized as
encoding candidates for the read layer: frontline glow / contact-edge icons
(→ border alarm, front-sector focus), banded enemy-strength marks shown
within confidence (→ estimate-band marks).

### Crossing session — 2026-07-23 (act 2; gate still open; build spec ready)

The crossing session did not stop at entrance design — it converged on the
**commit-bar spine** as the answer to entrance design (the commit pool bar IS
the most-used entrance), then expanded into the recon/fog economy. Outcomes
(all candidate/가안, unsealed; recorded in project memory
`terrain-game-recon-fog-economy.md`):

- **Commit bar** = visceral skin of the sealed commit pool (free-split,
  non-bankable, no "main/sub"); radial 지목→소환; three read layers (ambient free
  / band recon-sharpened / hole cards categorical).
- **Recon on a ladder axis** (0.45→0.70→0.90); instant recon = premium-to-ceiling
  attack rider (ADOPT WITH CONDITIONS, measurement-gated). Detection (radar,
  defender) vs measurement (spotlight, attacker) split. Defender = free warning
  floor (border alarm + threat board) + paid response; defensive UI = attack-UI
  mirror. Radar pricing = value-driven differential, numbers deferred to map
  scale-up.
- **Staff briefings DROPPED** (UI not complex → crutch became barrier).
- **Prototype re-scoped** to a full **turn-loop closure** (turn N → two-sided
  showdown → N+1), 3 wired verbs (attack/defense/basic recon) + facade
  (instant recon/fort/recruit/plan variations, UI real, logic inert), fixture
  "중원 쟁탈" (관중+촉, mid-game peak war), DEV placeholder = supply, navigation
  variants coupled vs decoupled (`?nav=`, live-compared).

**Build spec:** `docs/superpowers/specs/2026-07-23-gate07-turn-loop-prototype.md`
(Working layer; resolves this gate by live reaction, does not seal it). Gate 07
stays OPEN until the live evaluation runs and the user seals.

### Build + seal — 2026-07-23 (act 2 close; gate SEALED)

The throwaway prototype was built to the spec
(`mockup/combat-calc/turn-loop-prototype.html`, single self-contained SVG file,
geometry reused from the CRADLE_MAP 관중+촉+중원+서역 corner, one static
viewer-safe projection, scripted authored reducer — no combat arithmetic).

**v1 (spec-literal) → live feedback → v2 (casual reshape, user direction
2026-07-23):** the first cut painted all info at once (판세/형세/위협 side
panels, every band/cone) and drifted back toward the v0 clutter failure. The
user re-directed: (1) three-zone layout — thin top strip / MAP fills the middle
(calm) / COMMIT BAR the hero; (2) the board's info/glow is **summoned by the
commit decision**, not always painted; (3) the action radial must be big and
exaggerated; (4) flow is **commit-first** — 커밋량 → 행동 → 세부 → 가능 지역
빛남 → 지목 (land-first order noted as a later variant). v2 rebuilt on this.

**Live verdict (user).** On the flow/feel axis, with graphics/UI polish held
out of scope: **the sequence and skeleton match the imagined play process.**
Navigation settled to **coupled continuous camera (연속 줌, wheel + drag)** with
a future UoC2-grade graphic zoom + physical camera-height ambition. User sealed
the gate "as is," explicitly as a revisable-in-play checkpoint.

See **§ Answer** for the sealed set, the held-candidate/deferred set, and the
doc-sync batch that fired on seal. Design decisions behind the build live in
project memory `terrain-game-recon-fog-economy.md` (recon economy numbers stay
candidate).
