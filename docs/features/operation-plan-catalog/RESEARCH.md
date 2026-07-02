# Research: Operation Plan Catalog

## Observations

✅ The user could not judge absolute per-axis magnitudes for a single plan in
isolation ("판단이 안 서") and correctly anticipated they would churn. This is
an authoring-method signal, not indecision: magnitude only has meaning
relative to sibling plans and to the combat-balancing formula.

✅ Adopted method (user-approved): shape first, magnitude later. Fix each
plan's identity — core axes, deliberate zeros, sibling contrasts, risk
character — one plan at a time; calibrate magnitudes in a later relative pass
with the full roster laid side by side, together with the combat formula.

✅ The deliberate-zero axis is the sharpest authoring tool so far: what a plan
does *not* do separates it from siblings more legibly than magnitude
differences. Example: Swift Seizure has `usableValueDamage: none` (take the
base intact), while Supply Interdiction exists to work that axis.

✅ Plan identities must be grounded in real-war intuition before numbers:
Swift Seizure = tempo bought with exposure; Deliberate Pressure = time spent
reducing defenses. The user rejects abstractions that read as "gamey."

✅ Code audit (2026-07-02): the current implementation cannot host the
operation-plan model, as expected — it predates the front-sector design.
`js/actions.js` exposes flat hex-level verbs (scout/attack/defend/tax/build/
research/diplomacy), not plans; `js/combat.js` resolves a single force-ratio
comparison with a binary outcome (attacker wins → hex flips owner). There is
no front-sector layer, no per-axis partial effects (garrison damage without
capture, route cut, value burn), and no catalog/availability/fit machinery.
Two salvageable seeds: defense composition already layers garrison × terrain +
buildings + committed-defense support (a primitive ancestor of ADR 0022's four
layers), and combat.js documents a SEAM (resolve/forecast internals are
replaceable). But the six-axis model changes the outcome *shape* and the
target *unit* (hex → sector), so callers change too: a rework, not a body swap.

✅ Availability conditions split into two kinds — user-validated on the Swift
Seizure vs. strong-fortress case: hard gates for physical impossibility only
(unreachable, no enemy present, no required element), and soft fit for
advisability (shown low-ranked with a bad forecast, never hidden). The user
generalized it into a presentation principle: the card shows whatever is
possible, in statistically-good order. Recorded in ADR 0024.

✅ Prior-doc sweep (2026-07-02): no earlier document authors per-plan values
for attack/defense/recon. What exists is per-system value structure, now the
verified baseline for any external research: the four sector-defense layers
(ADR 0022), the fog estimate's two knowledge values — occupant identity and
magnitude band (fog-of-war-discovery spec), the five per-plan preset fields
(ADR 0024), and the seven candidate command intents in the 2026-06-29
terrain-combat spec (which explicitly deferred the command taxonomy this
catalog now fills). The UI direction is a lean Unity-of-Command-style hex
presentation (user-stated; current mockups follow it).

✅ Snowball philosophy clarified (2026-07-02, raid loot decision): SPEC fun
pillar 3 forbids *state-bound* snowball, not snowball itself. Raid's
destruction+income was accepted because four structural leashes bind the loot
to skill: opportunity cost (one action per turn), self-exhaustion (raid burns
its own income source), burning-your-inheritance (permanent damage to land
you'd otherwise conquer — yields the emergent Mongol pattern: conquer the
governable core, raid the ungovernable periphery), and zero victory progress
(no controlShift → raiding fades as the match clock tightens).

✅ User design insight (2026-07-02, encirclement gate decision): availability
gates that read persistent state give plan sequences intrinsic narrative —
"why this action exists now" emerges from the player's own past turns (cut
the supply first, then annihilate) rather than from authored flavor. Chain
legibility is a design win to preserve as more state-reading gates are
authored.

✅ Design principle from the fine-adjustment knowledge-burden question
(2026-07-02, Recovery/Consolidation): **fine adjustment may only expose dials
whose nouns the map already teaches.** Casual play never needs to know the
value elements exist (preset triages worst-first); opt-in adjustment reuses
exactly the vocabulary situation judgment and the forecast already display
(garrison, route, fortification, usable value) and presents choices in
consequence language ("repair the route first → starvation stops"), never
raw internals. The preset itself is a teacher — its visible triage explains
the model. A dial whose noun never appears on the map is a design bug. Feed
into the future command-card IA session.

## Working Hypotheses

❓ The current 11-plan roster may not cover the operation space. Notably, it
already mirrors real operational doctrine closely — Swift Seizure ≈ hasty
attack, Deliberate Pressure ≈ deliberate attack, Flanking Breakthrough ≈
envelopment/turning movement, Encirclement and Annihilation ≈ encirclement,
Stronghold Defense ≈ area defense, Delaying Defense ≈ delaying action,
Strategic Abandonment ≈ withdrawal/retirement. This suggests the right
completeness check is a survey of real doctrine plus how comparable war games
compress it, rather than inventing plans from scratch.

❓ The current codebase cannot host the six-axis operation model yet (see
Observations below); the design intentionally leads the code, and the rework
happens after seed content and the combat formula stabilize.

## External Survey Digests

Full reports live in `research/`; only the load-bearing conclusions here.

✅ **Doctrine survey** (`research/doctrine-survey.md`, 2026-07-02): the roster
hypothesis is confirmed — 8 of 11 plans map cleanly onto FM 3-0/3-90 operation
types. **No new MVP axis is needed**: fix/suppress, isolate, deceive, screen,
and rout all reduce to plan-level behaviors or intensities of existing axes;
the only in-principle new axis (political/legitimacy) is explicitly deferred
governance scope. Findings to act on:

- Top MVP-viable roster gaps: **Raid/chevauchée** (purpose-built
  `usableValueDamage` attack that does not seek to hold ground), **Mobile
  Defense** (counterattack-centered third defense posture), **defender
  scorched earth / 견벽청야** (possibly a Strategic Abandonment variant; East
  Asian doctrine — fits the setting).
- Refinement flags: Flanking Breakthrough conflates envelopment and
  penetration; Strategic Abandonment should read as a *fighting* withdrawal,
  not passive give-up; sustained siege may already be emergent from repeated
  Supply Interdiction (design question, not a mechanic to build).
- Underused pole: no plan works `confidenceGain`'s enemy-facing direction
  (degrading the *enemy's* estimate = deception); that pole is where
  feint/demonstration plans would live later.

✅ **Grand-strategy survey** (`research/grand-strategy-survey.md`, 2026-07-02):
independently validates the roster core — EU4's storm-vs-siege binary is
exactly the Swift Seizure / Deliberate Pressure pair; HOI4/TW map directly
onto seven of our plans. Findings to act on:

- **Raid confirmed by convergence**: both surveys independently rank a
  raid/plunder plan (no conquest intent, `usableValueDamage`-centered, low
  risk) as the #1 roster gap.
- **Scorched earth = a third axis polarity.** CK3/EU4 model self-targeted
  denial ("damage own to deny the enemy"). Our axes are authored as
  bidirectional (damage enemy / build friendly); self-damage is a third
  direction the schema hasn't named. Cheapest home: a variant/flag on
  Strategic Abandonment (converges with the doctrine survey's 견벽청야).
- **Temporary vs permanent damage sub-typing**: EU4 devastation (decays) vs
  CK3 sacking (permanent) are separate stats. Our `usableValueDamage` is
  framed as the permanent path, but the ADR 0022 usable-value share already
  recovers over stable turns — a latent recoverable/permanent split to settle
  in the magnitude pass if raid/scorched-earth plans arrive.
- **Ambient attrition**: all four games apply standing background attrition
  (siege duration, weather, supply) on top of authored operation effects — a
  combat-formula-pass consideration, not an axis.
- Deferred-but-aligned: post-conquest disposition (sack/raze vs occupy) as a
  resolution-time choice; ambush as a fog-mature defense; occupation
  compliance — all match existing guardrails, none MVP.
- **Compression techniques catalogued** for the later command-card/IA pass:
  planning-bonus carrot (HOI4), stance-as-single-toggle (TW), declarative
  intent-selector (CK3 raid intent), chained operations, immediate
  disposition + deferred governance.

✅ **Wargame/UoC survey** (`research/wargame-uoc-survey.md`, 2026-07-02):
strong validations — UoC's intel markers (identity + coarse strength band,
sharpened by recon investment) are exactly our fog estimate model; its single
prestige/resource currency validates the single-pool surplus design; its
two-tier turn rhythm (one expensive "moment" + cheap secondary spend) matches
commitment slider + surplus redirect. Findings to act on:

- New MVP-viable candidates beyond the raid/scorched-earth convergence:
  **feint** (enemy-facing negative `confidenceGain` — the pole both earlier
  surveys flagged as unused; UoC rates it MVP-viable, doctrine rated it
  later-phase), **no-retreat toggle** (riskProfile modifier on defense plans:
  total loss vs garrison escapes), **soften-first bombardment** (cheap prep
  plan that buys down enemy garrison before the main commit), **passive
  entrenchment accrual** (undisturbed garrisons dig in — background modifier,
  pairs with the fortificationDamage axis), **tempo victory pressure**
  (finishing early scores higher — a resolution-layer multiplier, counters
  always-play-safe sliders).
- Model note: UoC treats out-of-supply as a *staged status* (fine → can't
  attack → defenseless) rather than one-shot damage — relevant to how
  `routeDisruption` converts into effect in the combat-formula pass.
- **Presentation notes stored** (8 traits of UoC's lean hex map: fog-layer
  intel markers, always-visible logistics skeleton, low counter density,
  logistics-first cartographic hierarchy…) — feed into the situation-map/
  command-card mockup line, which already targets this style.

### Cross-survey synthesis (all three in)

Convergent, high-confidence roster amendments (user decision pending):

1. **Raid (약탈)** — #1 gap in both doctrine and grand-strategy surveys;
   purpose-built `usableValueDamage` attack, no conquest intent, low risk.
2. **Scorched-earth variant of Strategic Abandonment (청야/견벽청야)** — #3 in
   both; introduces the *self-damage-to-deny* third polarity of the axes;
   East Asian doctrinal pedigree fits the setting.

Candidates (one survey each, or verdicts split): mobile defense
(counterattack-centered third defense posture — doctrine), feint
(UoC yes / doctrine later), soften-first bombardment (UoC), no-retreat
toggle and passive entrenchment (UoC; modifiers rather than plans).

Validated as-is: Swift/Deliberate pair (EU4 storm-vs-siege binary), fog
estimate model (UoC intel markers), single-pool surplus (UoC prestige),
six-axis schema (doctrine: no new MVP axis needed).

✅ User decisions closing the audit (2026-07-02): Raid (약탈) added as the
12th plan; scorched earth (청야) to be designed as a Strategic Abandonment
variant at that plan's turn; single-survey candidates parked as per-plan
materials. Flanking Breakthrough stays one plan (envelopment/penetration
split deferred to any future deep-battle phase). Same session: SPEC gained
the 30-40 minute match envelope, the match-arc/victory thread opened in
phase-1-fun-core, and ADR 0025 fixed turn-based + the uncertainty duel as
the pressure engine (adding the plan-vs-plan categorical requirement to the
combat-formula thread).

## Validation Needed

- Whether the shape notation (`core`/`secondary`/`none`) survives contact with
  the defense and non-combat plans, whose "core axis" is a friendly-direction
  build/recover rather than damage.
- Whether eleven plans stay distinguishable at shape level alone, or some
  siblings (e.g. Stronghold vs. Delaying Defense) differ only by magnitude and
  risk — which would confirm the need for the later relative pass.
- The magnitude pass itself, joined with the combat-balancing formula thread.
