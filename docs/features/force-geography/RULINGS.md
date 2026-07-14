# Rulings — Force Geography

The decision record for the force-geography pass: concept **(b)** of the
hegemony-freeze three-concept sequence (see match-arc RULINGS ET-① and
`docs/SYNC-DEBT.md` "Force-geography pass"). Make a realm's defense
**uneven** by terrain and choice, so defense-dominance becomes a legible
signal AND attackers find weak fronts → decisive wars → the freeze eases.

Birthplace tier of the Record layer (feature-local). A ruling promotes to
an ADR when it becomes architecture-grade or spans features. Seals below
are **design-level (L0 hand reasoning)** from the 2026-07-08/09 grill and
are **pending L2 (최소) measurement** unless a higher L-stamp is noted —
this is honest per the test-trust ladder, not a weakness.

Guardrails these rulings must not violate (G1–G16) live in the design
handoff and the combat-formula canon; the load-bearing ones are cited
inline.

---

## FG-① Force-geography is a REDISTRIBUTION lever, and the SMALL lever — SEALED 2026-07-08 (skeleton, obs #9659), magnitude confirmed L2

**Ruling**: a realm's total defense budget is roughly **CONSERVED**
("이불 한 장" / one blanket); concentrating it on one front necessarily
thins another → weak fronts are guaranteed. Growth (total defense rises)
is **rejected here** because canon MEASURED that uniformly-stronger
defense DEEPENS the freeze (guardrail **G14**; Vauban finding obs #9408).

Magnitude honesty (L2, obs #9655/#9410): force-geography is the **~9pp**
layer of the freeze; the **~80% structural residual is the hegemony
leadership gate** (concept (a), DEBT). So (b) is sequenced first not
because it is the big lever but because it **rewrites the proj/shield
distribution that gate (a) must be calibrated against**. (b) sets (a)'s
stage; it does not by itself unfreeze.

Total-defense growth is a separate dial that may open later, paired with
the offense buff (concept (c), DEBT). Not here.

## FG-② U1 terrain envelope — adopt the measured fort-by-class mapping — SEALED 2026-07-09, L2-measured

**Ruling**: the static start-fort distribution is keyed to the front's
weakest-crossing class via the dormant `startFortByClass` seam
(`map-board.js:98`):

| crossing class | start fort |
|---|---|
| open | fieldworks |
| forest / hills / river | walls |
| pass / strait | fortress |

**Verdict source**: the fort-sweep battery (obs #9430/#9431/#9434,
2026-07-07) measured this exact mapping at **13.6% decided vs 10.2%
uniform-walls — +33% relative**, and isolated that *fort UNIFORMITY, not
fort strength, is the freeze driver* (all-none 20% / all-walls 10.2%;
weaker uniform forts decide MORE). This is an **L2** seal (rare for a
design ruling — it rests on a measured sweep, not hand reasoning).

Rejected framing: "does terrain set the fort CEILING vs COST-efficiency?"
— re-litigated the already-measured mapping; the mapping *is* the ceiling
answer and it is validated. Guardrail **G3** holds: the pass/strait
fortress tier ships WITH its frontage-cap door (M11) — the ×2.0 pass is a
residual-after-cap.

## FG-③ Weak fronts come from SCARCITY + VALUE, not a defensibility-concentration policy — SEALED 2026-07-09, L0

**Ruling**: "concentrate defense on defensible terrain" is **rejected** as
the mechanism. The math (defense power = garrison × terrain × fort): to
make two fronts equally hard, the rational defender puts MORE bodies on
the WEAK terrain (plains ×1 needs 2× the bodies of a pass ×2 for equal
power). So an unconstrained defender **equalizes defense POWER** → no weak
front → that IS the measured freeze (everyone uniformly walled).

The weak front therefore arises from **budget SCARCITY**: when the
conserved budget cannot bring every front to par, the defender covers by
**VALUE** (hold the fronts behind which the capital/rich land sits) and
the gap falls on the front that is jointly low-value and expensive-to-hold
(weak terrain costs the most bodies). Terrain sets the price; value routes
the gap.

**Corollary (durability warning)**: the FG-② +33% may be partly a
dumb-bot artifact — the L2 bot RE-EQUALIZES (regen fills uniform
`frontCap` toward `sectors×900`; the fort peace-action upgrades the
weakest front — `tournament.js` regenGarrisons / peacePrimary). A
competent defender would close the gaps and re-freeze. So **differentiation
alone is not durable; scarcity is.** v1 must also STOP the bot's
re-equalization (see FG-⑨).

## FG-④ The reactive reserve is IN SCOPE; passive-defender measurement can only falsify, not confirm — SEALED 2026-07-09, L0

**Ruling**: a "weak front" is not *the front with the least standing
garrison* — it is *the front the reserve cannot reach in time*. The
mobile reserve is the defender's PRIMARY response to a weak-front strike,
so a weak-front mechanic measured against a **passive** defender beats a
strawman: the answer is pre-determined. The reserve is the other half of
the same duel, not a separate feature.

Epistemics: against a passive (maximally exploitable) defender, a
**positive** result proves little; only a **negative** result is
trustworthy. Passive-defender runs already CONFIRMED the freeze (falsifier
role **exhausted**, +33% did not die). Confirming force-geography now
**requires an active reserve**. The harness already faked this (the
invented "opportunism" read = attack the front the field army isn't at,
SPEC_GAP #1) — making it real is the honest move.

## FG-⑤ Reserve model — REACTIVE, first blow hits raw defense — SEALED 2026-07-09, L0 (amended 2026-07-09 by FG-⑩)

**Amendment (FG-⑩)**: the load-bearing reserve is the **field-army
operational counter + M9 tactical fill — BOTH** (M9 swept), not M9 alone;
the "reuse M9" bullet below is the tactical-fill layer only.

**Ruling**: the reserve is **reactive**, not anticipatory (real players do
both via scouting; reactive is v1, anticipatory is the later overlay).

- **First-blow resolution** = attacking field army vs **raw standing
  defense** (standing garrison × terrain × fort). The reserve arrives the
  **next beat** at M9's 50% effectiveness. That one-beat window IS the
  channel through which a weak front is broken.
- **Reuse**: the sealed **M9 예비대/진관** grammar (route-connected stock
  rushes to the attacked sector, ×0.5, remains garrisoned) — wire it into
  the L2 defender, which is passive today.
- **Honest limit (carried)**: reactive-only measures an **upper bound** on
  breakthrough ease. A scouting/anticipatory defender pre-positions and
  narrows the first-blow window. Read every result as "vs a
  non-scouting defender," the same discipline as the passive-defender
  limit.

## FG-⑥ Reserve destination = argmax(deficit × value); whole-realm value for v1 — SEALED 2026-07-09, L0; (a) deferred; amended by slice-2 spec §4 (2026-07-14)

*Amendment delta (2026-07-14): the field army is freely divisible (WM-②),
so the destination read applies per detachment, not to one indivisible
reserve.*

**Ruling**: the reserve goes to the front maximizing **deficit × value**,
reusing the sealed **ADR 0019** relational-threat aggregation (guardrail
**G8** — reuse it, do not invent a new aggregation):

- **deficit(front)** = max(0, enemy estimated force − this front's current
  defense) — ADR 0019's "estimated enemy force > weakest-link defense",
  fog-gated.
- **value(front)** = what breaking it exposes — ADR 0019's opportunity =
  sum.

**Value scope — (b) whole-realm** adopted for the small cradle: **deficit
picks the front**, value is a **fight-or-fold gate** (is this realm's
remaining value worth the reserve / continuing the war, or sue for
peace?). In a small realm every front guards the same heart, so per-front
value does not discriminate.

**(a) per-front value** (value picks the front) is the acknowledged
**sophistication target** — the precise end-state logic — **deferred**
until province topology exists to make it non-degenerate. Promote (b)→(a)
in a later pass (user direction 2026-07-09).

## FG-⑦ Attacker information is the sealed estimate-range band (derived, not chosen) — information contract SEALED; band-weighting OPEN → U4

**Ruling**: when the attacker (U4) picks a front, its inputs are already
fixed by sealed fog canon — **not a fresh choice**:

- **public**: terrain class + fortification grade (fog **RULING ①**,
  guardrail **G12** — structures visible from outside).
- **fogged**: garrison magnitude as a **deterministic, true-containing
  estimate range** that scouting narrows, never collapses (fog INDEX
  slice-1, merged 2026-07-02). Bot sees exactly what a player sees
  (tactical-plan-ai RULING ③).

Because the reserve is reactive (FG-⑤), the **defender's** reserve is
effectively **fog-free** (the attack reveals the front and the assaulting
force). The fog lives on the **attacker's** pre-attack read.

**RESOLVED 2026-07-09 (U4 closes)**: band-weighting reuses the sealed
**disposition dial** (tactical-plan-ai **TP②**, λ ∈ [−1 pessimist reads
strong .. +1 optimist reads weak]) — **no new dial**. U4 = `pickTarget`
scores the FACING front's **first-blow defense** = judged garrison(λ,
confidence band) × public terrain × public fort, and picks the softest
neighbor; reachable-weakest-link (**G8**) is the aggregation; **value-blind
for the cradle** (whole-realm, FG-⑥). Today `pickTarget` sums RAW bodies
INCLUDING the field army and IGNORES terrain/fort (a fortress-pass and a
bare-plains with equal garrison look equally defended) — that is the bug
U4 fixes. λ/confidence are swept harness params (TP④). A **targeted
`pickTarget` change, not a rewrite**; archetype target preferences stay.

## FG-⑧ Commit-scarcity axis kept OFF for the pass — SEALED 2026-07-09, L0 (scope); amended by slice-2 spec §4 (2026-07-14)

*Amendment delta (2026-07-14): the axis is UNLOCKED — the commit-budget
definition (WM-②) makes commit a per-turn realm budget across all uses;
the build implements it, and this scope-OFF applies only to the retired
L2 harness.*

**Ruling**: the **defenseCommitment** court-attention pool (M2/ADR-0022 —
a scarce 20-pt budget distributed across engagements) is **dormant** in
L2: commit is a flat constant (`siegeCommit 8 / fieldCommit 14`,
`tournament.js:83`), so the sim commits at fixed intensity everywhere for
free. This is a **third latent scarcity axis** (attention), beyond bodies
(FG-③) and tempo (FG-⑤).

**Decision**: keep it **OFF** for the force-geography pass — bodies-
scarcity + reserve-tempo suffice, and activating commit-scarcity now adds
scope plus another proof-bounding confound. Recorded as an
available-but-unused lever, not a rejection.

## FG-⑨ Sequencing — v1 = (최소), (정교) = deferred delta, measure minimal→sophisticated — SEALED 2026-07-09, L0

**Ruling**: build and measure the **minimal** version first, the
**sophisticated** version as a measured delta on top.

- **(최소) v1**: standing defense = U1 terrain/fort differentiation
  (FG-②) + geometry-fixed uniform garrison; **all concentration is the
  reactive reserve's job** (FG-⑤/⑥); STOP the bot's fort re-equalization
  (FG-③ corollary); static value-redistribution of standing garrison is
  **deferred**.
- **(정교)**: static value-redistribution of the standing garrison — the
  defender deliberately thins low-value fronts. Recorded here as the next
  delta; **detailed only AFTER (최소) L2 data** (the data reshapes it —
  e.g. how strong the reserve proves changes how much standing
  redistribution is needed).

**Rationale**: (최소) is the **readable baseline** — a single bundled
(정교) build would re-create this session's confounding trap (which half
caused the result?). (정교) is not wrong; it is the **harder, truer test**
(a competent defender equalizing power can re-freeze — FG-③), and its
result is only interpretable as a **delta off (최소)**. (최소) is also a
cheap **gate**: if the reactive reserve alone re-freezes, pivot before
building (정교).

## FG-⑩ Reserve mass — field army (operational) + M9 (tactical fill), both, M9 swept — SEALED 2026-07-09, L0; amends FG-⑤; amended by slice-2 spec §2/§4 (2026-07-14)

*Amendment delta (2026-07-14): rider (ii)'s flat ×0.75 forced-march dial
is retired, subsumed as a midpoint of the fatigue conversion curve
(WM-②); the field-army layer is per-detachment under free division.*

**Ruling**: the (최소) reactive reserve is TWO layers, both included:

- **Operational counter — the field army** (load-bearing): the realm's
  mobile army repositions to the deficit×value front (FG-⑥) to fight the
  decisive battle — the defender's real counter to a weak-front strike
  (the user's "야전군을 데려가"). Today it auto-defends the biggest war +
  20% screen; U2 changes it to reposition by deficit×value, arriving a
  beat AFTER the first blow.
- **Tactical fill — M9** (sealed 예비대/진관): route-connected garrison
  stock rushes the attacked front at ×0.5. In the L2 board this is an
  **ABSTRACTION** — the board holds per-front garrison aggregates
  (`frontG`), not route-connected sector stock — e.g. pull from the
  realm's other front / interior garrisons toward the attacked front at
  ×0.5.

**Field-army-only is REJECTED** as a tactical-scale strawman (ladder rule
4): without M9 the first-blow window is more breakable than a human
defender's (no local garrison rush), so a positive result could not
confirm.

**M9 is SWEPT on/off** (the fort-sweep method) to isolate its contribution
— human-like completeness AND isolation at once, without muddying the
(최소) baseline (M9 is a reserve LAYER, not a standing-redistribution
policy; the (최소)/(정교) line stays at standing redistribution — FG-⑨).

**Plan-time riders**: (i) M9 abstraction wiring cost — the board has no
sector routing, so scope the abstraction at plan; if too large, field-army
-first + M9 as a KNOWN swept fast-follow, never a silent omission. (ii)
field-army late-arrival effectiveness (full vs a forced-march penalty
~×0.75) — plan-time detail.

---

## Settled elsewhere (referenced, not re-sealed here)

- **U3 resolution** — the sealed 4-layer formula (`defense = garrison ×
  defenseCommitment × terrain × fort`, frontage caps the engaged body;
  ADR 0022 / FORMULA D6) is **UNCHANGED**. Force-geography only feeds
  non-uniform inputs into the existing `resolve()` / siege-site
  composition. Guardrail **G1**.
- **U5 measurement** — re-run the ending-taxonomy panel (match-arc
  `matchPanel` / `plan-battery.js aggregate`) with, added for the duel:
  (i) **within-realm defense variance** (the direct test — does each realm
  now have thick AND thin fronts?); (ii) **boosted-defense-power
  shieldShare** (garrison × terrain × fort, not raw bodies); (iii)
  **freeze-watch** (denied-dominant + standoff DOWN, decided% UP); and now
  (iv) **duel metric** — how often attacker concentration beats the
  reserve. Success = within-realm variance ↑ + defense-power spread ↑ +
  denied-dominant/standoff ↓ + decided% ↑. *(Success criterion AMENDED
  2026-07-09 — see "L2 implementation + metric amendment" below: the
  variance/shieldShare terms are demoted to descriptive; decided% + buckets
  are the headline read.)*

---

## L2 (최소) implementation + metric amendment — LANDED 2026-07-09 (main @ 0e8dc52), L2-plumbing

**Implementation**: FG-①…⑩ wired into the L2 harness
(`mockup/combat-calc/`) across 7 TDD tasks (commits 108f89a…0e8dc52, on
main; plan `docs/superpowers/plans/2026-07-09-force-geography-minimal.md`).
The sealed engine (`engine.js resolve()` / `DIALS`) and the uniform-walls
`BOARD_GAAN` are UNTOUCHED (G1); force-geography is opt-in via
`FG_BOARD_GAAN` — per-crossing-class forts (`startFortByClass`,
`FG_FORT_BY_CLASS`: open→fieldworks, forest/hills/river→walls,
pass/strait→fortress), a terrain-ceiling cap on in-match fort upgrades, an
M9 reactive reserve into the siege (`m9Fill` via engine `reserveAwaken`,
swept), field-army **deficit** repositioning (`pickMainDefWar`/
`frontDefense`), softest-front attacker targeting (`frontSoftness`,
FG-gated by `forceGeo`), and a battery `--fg` arm (`runFgSweep`) sweeping
M9 on/off vs a uniform-walls control. Whole-branch review (opus):
non-force-geography behavior is byte-identical branch-wide, all binding
constraints held, 159/159 tests. Reserve/attacker/measurement dials are
HARNESS 가안 (sweepable, non-sealable), not seal candidates.

**Promotion to world of record — 2026-07-11 (M9-promotion grill, user).**
The FG-⑩ **fgM9on arm** (FG board package WITH the M9 reserve, as measured)
is promoted to the L2 **world of record** alongside capLandFrac 1. The
CONFIGURATION is sealed; the reserve/attacker dial values here remain
HARNESS 가안 (M9 ×0.5 stays sealed at combat-formula MAGNITUDE M9).
Authoritative seal + evidence: match-arc `RULINGS.md` **AB-②** (single-
definition rule — this note is a pointer, not a second seal). Harness
default flip is a registered SYNC-DEBT; until paid, the record world is
opt-in.

**Metric amendment (user ruling 2026-07-09)** — AMENDS the "U5 measurement"
success list above. The reps=2 plumbing smoke run exposed that
**within-realm variance and boosted-defense shieldShare do NOT isolate the
fort-tier contribution**: `frontPowers` is computed from END-STATE
`frontG × terrain × fort`, so garrison dispersion + static terrain already
yield CV ≈ 0.6 under uniform walls — the same magnitude as the FG arm. They
measure total end-state front-power spread, not the authored fort envelope.
→ **The headline freeze-ease read is decided% + the bucket-histogram delta
across the three arms** (ctrl / fgM9on / fgM9off), which discriminate
cleanly (smoke: decided% 14 / 31.7 / 50 — force-geography eases the freeze,
M9 reserve re-stickies defense). `meanWithinRealmVariance` and
`meanBoostedShieldShare` are RETAINED as **descriptive** end-state stats,
not the success criterion. A fort-isolating metric measured at t0 (fort/
terrain×fort multiplier with garrison held at start-state) is a possible
future refinement, deferred. This decision must be on record before any
high-reps run is read.
