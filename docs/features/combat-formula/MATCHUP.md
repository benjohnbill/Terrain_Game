# Plan-vs-Plan Matchup Sheet (Engagement Rules)

The categorical layer of the uncertainty duel (ADR 0025): how the
attacker's method meets the defender's method. This sheet is **authored
balance data, separate from the engine** — the same content/engine split as
the operation-plan catalog (ADR 0024). The resolution engine reads this
sheet; balance tuning edits this file, never the engine. At implementation
time it becomes a data file consumed behind the `js/combat.js` SEAM
(resolve/forecast are replaceable internals).

Status: skeleton. Cell authoring waits on (a) confirmation of the
engagement-rule currency (proposed over an abstract advantage table,
2026-07-03) and (b) the multiplier-range surveys in `research/` validating
the verb magnitudes. Joined with the magnitude pass.

## Currency: engagement rules, not abstract multipliers

A matchup cell never says "×1.3". It says which parts of the defense (or
attack) the method actually engages, using a small closed verb vocabulary
acting on existing formula terms (D6 grammar). Numbers attached to verbs
are magnitude-pass dials.

Rationale: reasons live inside the numbers (why flanking beats fortresses
is visible in the defense column), matchups become situation-dependent for
free (bypassing walls means nothing in an open-field sector), and no new
authored vocabulary is introduced — the verbs act on nouns the map already
teaches.

## Authoring principle: derived first, author only deviations (user-confirmed 2026-07-03)

Most matchup is not authored here at all — it **emerges** from the plans'
axis presets meeting the D6 defense composition: a fortificationDamage-core
plan counters a fortification-leaning defense because it erodes the very
term that defense multiplies by; a tempo plan is weak against the same
defense because it eats the full multiplier. Zero authored lines.

This sheet only records what axes *cannot* express:

- **Method properties** — how the approach meets the composition (Flanking's
  fortification discount, terrain frontage throttle). These are properties
  of the maneuver, not stamps, so they have no axis home.
- **Resolution-layer bargains** — refusals and trades (Delaying Defense,
  Strategic Abandonment), which the catalog pass already ruled live outside
  effect axes.

Keep the table sparse: an empty cell is the plain formula, and every filled
cell must justify why the axes could not have produced it. Sparse cells =
minimal balance surface, and every matchup stays traceable to either the
formula or a nameable method property (anti-gamey).

Sequencing (user-confirmed): cell values are authored after the multiplier
surveys land and the min–max stacking analysis exists, joined with the
magnitude pass — a discount fraction only means something against validated
ceiling ranges.

## Verb vocabulary (closed set — extend only with a recorded decision)

- `engage` — the term applies in full (default; cells only record
  deviations from it).
- `discount <term> <fraction>` — the term applies at reduced strength
  (e.g., Flanking: `discount fortification 0.5` — enters at the seam, not
  the wall).
- `bypass <term>` — the term does not apply at all (full discount).
- `erode <term>` — the term applies in full this resolution, but the plan's
  stamp reduces the term's persistent value (e.g., Deliberate Pressure
  erodes fortification — ADR 0026 stamp).
- `throttle substance <by terrain>` — at authored choke sectors the
  engageable substance is capped: `effective = min(committed, frontage
  capacity)` (D9, survey-validated). A cap, never a multiplier; every
  throttle must carry legible removal paths (bypass, timing window, tech)
  — chokes fail by deletion, not attrition.
- `refuse` — the defender declines the full contest; the headline concedes
  on the plan's authored terms and resolution-layer products apply instead
  (Delaying Defense bargain, Strategic Abandonment declaration).

Verb objects may be formula terms (D6) **or resolution-layer products** —
e.g., `discount escape` acts on the escape clause a refusing plan sells,
not on a formula multiplier (recorded with the escape-hunting family
decision, 2026-07-03).

## Matrix (attack plans × defense plans)

Rows: the 7 attack plans. Columns: the 3 defense plans (non-combat plans do
not contest; an undefended/unattended sector defends at baseline lever ×1).
Cells record deviations from `engage`-everything; an empty cell means the
plain D6 formula runs — 15 of 21 cells are empty by design (sparse
principle). Status marks: ✅ user-confirmed shape; ◻ proposed, pending.

| attack \ defense | Stronghold Defense | Delaying Defense | Strategic Abandonment |
|---|---|---|---|
| Swift Seizure | — (full multipliers; weakness is derived) | ✅ `refuse` (ground traded, garrison slips) | ✅ `refuse` (uncontested transfer) |
| Deliberate Pressure | — (erosion already lives in its axes) | — (siege prep vs a leaver = wasted commit, emergent) | ✅ `refuse` |
| Flanking Breakthrough | ✅ `discount fortification` (enters at the seam) | ✅ `discount escape` (withdrawal partially caught) | ✅ `refuse` |
| Raid | ✅ `bypass fortification`; contest = field interception (garrison × terrain) | — (time bargain worthless vs a raider: no advance to slow) | ✅ `refuse`; scorched variant leaves nothing to loot (derived) |
| Supply Interdiction | — (contest lives on the rear route) | — | ✅ `refuse` |
| Encirclement & Annihilation | — (isolation gate + D10 cliff, derived) | ✅ `bypass escape` (isolated: no way out → rout becomes annihilation) | ✅ `bypass escape` (isolated: the abandonment declaration itself is impossible) |
| Crossing / Landing | — (water penalty is the plan's own identity) | — | ✅ `refuse` |

### Confirmed: the escape-hunting family (2026-07-03)

The escape a refusing defense sells (Delaying Defense, Strategic
Abandonment: "the force gets away") is a **default, not a guarantee**.
Flanking Breakthrough catches a fraction of the withdrawing substance
(`discount escape`, fraction = magnitude dial); with Encirclement's
isolation gate satisfied, escape is void entirely (`bypass escape`) and
the engagement resolves through the D10 rout cliff — dissolution with no
survivors' address to regroup at.

Why this family exists: without it, refusal plans are risk-free and
over-selected (the parked Delaying-overselection counterweight, now
structural). Real-war grounding: the fighting withdrawal is history's most
dangerous maneuver — caught retreats become routs. It also completes the
Moscow-trap chain: scorch to lure → cut supply → and when the invader
finally turns back, encirclement voids the escape.

Family addition (2026-07-03, magnitude pass — candidate): **반도이격
(strike at half-crossing).** When the intercepted force's withdrawal or
escape crosses a water boundary this turn, the water splits its engaged
body — only a fraction (가안 50%, dial owned by this sheet's magnitude
values) is engageable, and the water side counts as blocked escape for
that engaged body (M4 escape-state check). A situation-classifying cap in
the D9/throttle family, never a multiplier; detection reads only the
declared crossing flow + map water edges. Grounding: Sunzi 行軍
"令半濟而擊之利"; Salsu, Berezina. Without it, a numerically superior
withdrawing mass cannot be annihilated at realistic ratios (validated in
the 5:1 Salsu run, MAGNITUDE.md M4).

### Confirmed: the fortress-ignoring family (2026-07-03, closed under user delegation)

Two strengths of "not meeting the wall", a deliberate contrast (the
deliberate-zero authoring tool applied to verbs):

- **Flanking Breakthrough vs Stronghold: `discount fortification`
  (partial).** The attack enters at the seam/approach, not the prepared
  front; a well-built fortified zone still partially covers its flanks, so
  the multiplier is reduced, not voided. Grounding: envelopment/turning
  doctrine (doctrine survey mapping) — the maneuver's purpose is to avoid
  the prepared front. Fraction = magnitude dial.
- **Raid vs Stronghold: `bypass fortification` + contest redefinition.**
  The raider never approaches the wall; the engagement becomes **field
  interception** — garrison substance × terrain, no fortification
  multiplier, defender lever = the sortie decision. A huddled (low-commit)
  garrison lets the countryside burn; a committed one contests the field.
  Grounding: chevauchée logic (both surveys' #1 roster-gap source) — walls
  protect what is inside them, never the countryside.

Consequence: Stronghold Defense acquires its finished shape — supreme
frontally, holed at seams and fields. Reading a stronghold-tendency
opponent makes flank/raid the payoff; knowing that, the defender cannot
sit on stronghold alone. The roshambo turns.

User delegation note (2026-07-03): the user delegated closure of
survey-groundable matchup shapes ("verified against wargames and war
history → close autonomously"). Numbers remain magnitude-pass scope; any
future cell *not* traceable to survey/real-war grounding still requires
explicit user decision.

### Confirmed: 항복 수확 (surrender harvest — Encirclement success discount, 2026-07-03)

On Encirclement & Annihilation headline SUCCESS only, attacker casualties
are read from the shared curve and then discounted (fraction 가안 0.5 —
dial owned by this sheet). No discount on failure; defender losses
unchanged (rout conversion governs them). Grounding: sealed starving
pockets collapse rather than fight — Ulm 1805 (~60,000 captured vs
~1,500 French losses), Sedan, Kiev; the encircler's cost was prepaid in
the preparation turns. Design role: restores the high-risk/high-reward
principle in the stander branch — the highest threshold (2.2,
all-or-nothing under fog) buys the lowest blood price per army erased
(MAGNITUDE.md M6).

Authoring notes carried in from the catalog shape pass:

- Delaying Defense's bargain (cheap contest, no repulsion, erosion, bought
  time) is a resolution-layer product: it lives here and in `riskProfile`,
  never as effect axes.
- Encirclement's isolated-rout multiplier and the crossing's water-exclusive
  grammar are candidates for dedicated cells/verbs once magnitudes exist.
- Every cell must survive the anti-gamey test: the verb must name something
  a briefing officer could say about the real methods meeting.

## Fraction values (2026-07-03, magnitude pass — user-confirmed)

- Flanking `discount fortification`: effective = 1 + (fort − 1) × 0.5;
  the wall-assault frontage cap does not apply to Flanking (seam entry).
- Flanking `discount escape`: the escape clause × 0.5 wherever it
  appears (refuse-escape 100% → 50%; open-rout survival 50% → 25%).
- 반도이격: engaged body = 50% of the crossing force.
- 항복 수확: Encirclement-success attacker casualties × 0.5.
- Delaying Defense bargain (authored terms of its refuse cells):
  attacker threshold +0.3; casualty exchange × 0.5 both ways; defender
  escape default 100% (prey of the escape-hunting family).

## Forecast consequence

The enemy plan is fogged (second fog), so the forecast card branches
conditionally over plausible enemy plans, weighted by readable AI tendency:
"if they stand: R ≈ 0.93 — repulsed / if they delay: sector taken, their
force slips away." Reading the opponent decides which line to weight — this
is where the roshambo layer surfaces in the UI.
