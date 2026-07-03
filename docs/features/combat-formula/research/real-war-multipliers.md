# Real-War Force Multipliers: Quantitative Research for the Combat Formula

Research compiled 2026-07-02 to validate the working hypothesis behind the deterministic,
ratio-based combat resolution: **"the commitment-lever ceiling (~×2) is smaller than the
terrain/fortification ceilings (~×3); big power comes from the world (terrain, forts,
substance, tech), not from per-turn attention."**

Sources are cited inline; confidence levels are flagged where a figure could not be traced
to a primary source. Full source list at the end.

---

## Summary verdict

**The hypothesis ordering is SUPPORTED, with three amendments.**

1. **Commitment lever ceiling ~×2: supported.** The closest real-world analogues to a
   "command attention" multiplier all saturate near ×2: Dupuy's *complete surprise* factor
   is ×2.24 (his single largest own-side situational multiplier), and measured combat
   effectiveness (CEV) for historically excellent, well-led forces peaks at ~×2.0
   (Israeli vs. Egyptian 1973: 1.98) with a typical band of ×1.2–1.5. No credible source
   supports an own-side command/attention multiplier materially above ×2 for a force that
   is already functioning.

2. **Amendment — terrain is two different mechanics.** Terrain as a *fight multiplier*
   (defender advantage in rough/mountain ground) is well-bounded at roughly ×1.5–2.5,
   consistent with the ~×3 hypothesis ceiling. But terrain's largest historical effects
   (Thermopylae, Myeongnyang) come from a different mechanism entirely: **frontage
   throttling**, which is not a multiplier but a *cap on the attacker's effective engaged
   substance*. A 15 m pass caps engaged force at the same absolute number regardless of
   whether 10,000 or 300,000 stand behind it — an effect that can exceed any bounded
   multiplier. The formula should model this as `effective attackers =
   min(committed, frontage capacity)`, not as a defense multiplier. With that split, the
   "big power comes from the world" claim is *more* true than hypothesized.

3. **Amendment — fortification ~×3 is right as a steady-state, but it is
   tech-contingent.** Dupuy's overall defensive posture factor runs 1.3 to >3.0.
   Historical sieges (Xiangyang ~5 years, Diaoyucheng ~36 years) show fortification +
   terrain + self-sufficient logistics stacking to near-indefinite holds — but Xiangyang
   also shows the multiplier collapsing almost instantly when the attacker's siege
   technology jumps a tier (counterweight trebuchets, 1273). Fortification should be a
   ~×2–3 multiplier that a siege-tech gap can cut down, not an absolute constant.

4. **Amendment — enemy command collapse is a cliff, not a mirrored dial.** The OR
   literature does not model a broken force as "same multiplier scale, bigger number."
   It models breakdown as a *threshold state change* (a unit becomes "combat ineffective"
   in the 20–40% casualty band and effectively leaves the fight). The asymmetry in the
   original hypothesis — modest own-side ceiling, larger swings only via enemy collapse —
   is supported, but the collapse side should be a state/cliff mechanic, not a
   continuously scaling multiplier below 1.

5. **Determinism is defensible.** Five of the six extreme upsets examined decompose fully
   into documented factors with no randomness required. The one genuine point-source
   contingency in the set is Möngke Khan's death at Diaoyucheng (1259) — a commander
   casualty, not a battle-outcome roll. A fully deterministic resolution is historically
   defensible; if the design ever wants one escape valve, the evidence points at rare
   discrete *events* (commander casualty, betrayal of a flank path), never at noisy
   combat math.

6. **Graded margin matches the data.** The 3:1 attacker rule is empirically a
   *probabilistic gradient*, not a bright line — only 10 of 68 decisive 20th-century
   victors achieved ≥3:1, and over 20% of decisive battles never saw 3:1 on either side.
   A threshold headline + graded margin (margin buys lower casualties) is a better fit to
   the historical record than any hard cutoff.

---

## OR factor tables

### Dupuy QJM/TNDM factor values

Trevor Dupuy's Quantified Judgment Model (QJM, 1970s) and its successor the Tactical
Numerical Deterministic Model (TNDM) are the most extensive published attempts to fit
multiplicative combat factors to a historical engagement database (hundreds of 20th-century
battles). Publicly recoverable values:

| Factor | Value | Confidence |
|---|---|---|
| Terrain, general (infantry/combined arms) | 0.4–1.05 (attacker-side degradation; worst terrain ≈ ×2.5 relative swing to defender) | Aggregate range published by Dupuy Institute; per-terrain-type table (open/rolling/rough/mountain/swamp) exists in *Numbers, Predictions and War* but was not recoverable from open sources |
| Terrain, armored/cavalry forces | 0.2–1.0 (worst terrain ≈ ×5 relative swing) | Same caveat |
| Defensive posture, overall | ×1.3 minimum to **>×3.0** maximum | Dupuy Institute, "Dupuy's Verities: The Power of Defense" |
| Hasty defense (worked example) | ~×1.5 ("more than 50%" combat-power increase in rolling terrain) | Dupuy Institute |
| Fortified defense, separately | Not quantified in open sources — subsumed in the 1.3–3.0+ posture range | Gap; TNDM manual would be needed |
| River crossing / amphibious | Named term in TNDM casualty formula; amphibious beach assault ×2.00 | Amphibious figure sourced; river-crossing numeric unverified |
| Urban combat | Named term; numeric unverified in open sources | Gap |
| Surprise, complete | **×2.24** (QJM) / ×2.20 (simplified TNDM) | Dupuy Institute, "The Combat Value of Surprise" |
| Surprise, minor | ×1.10 | Same |
| Surprise decay | Lasts ~3 days, losing ~1/3 of value per day | Same |
| Superior-CEV opponent modifier | ×1.5 | Same |

**Critical caveat, stated by the Dupuy Institute itself:** Dupuy set the surprise values by
judgment and "never validated them back to his data himself." Partial validation against an
expanded database was later done by Christopher Lawrence (*War by Numbers*, 2017). Treat
×2.24 as judgment-based-but-later-partially-validated, not a first-principles constant.

QJM base structure for context: standard daily loss rates 2.8% (attacker) / 1.5%
(defender); the TNDM casualty formula is a long multiplicative chain (posture × CEV ×
surprise × force ratio × force size × terrain × weather × season × amphibious/river ×
day/night × fatigue).

### Combat Effectiveness Value (CEV)

CEV is Dupuy's residual "human factors" term — per-soldier fighting effectiveness after
numbers, weapons, terrain, posture, and surprise are accounted for. It bundles leadership,
training, morale, and motivation; the literature does **not** isolate "commander talent"
as a standalone multiplier.

| Comparison | CEV | Confidence |
|---|---|---|
| German vs. Western Allies, Italy 1943–44 (81 engagements, 24 divisions) | Allied avg 0.80, German avg 1.10 → **~×1.2–1.3** German advantage; individual division pairs ×1.2–2.0 | Well-sourced (Dupuy Institute) |
| German vs. American, broader aggregation | ×1.55 | Commonly repeated; not traceable to a single primary article — treat as unverified |
| Israeli vs. Egyptian, 1967 | ×1.75 | Likely primary source *War by Numbers*; page-cite unconfirmed |
| Israeli vs. Egyptian, 1973 | ×1.98 | Same |
| German vs. Soviet, 1943 (model input) | ×3.0 | The single highest quality-gap figure found; an outlier/ceiling case, used as a model input rather than a measured average |

Note: Dupuy observed that a CEV of 2 produces a casualty exchange ratio *greater* than 2 —
quality compounds superlinearly into attrition, consistent with Lanchester square-law
dynamics.

### Lanchester's laws

- **Linear law** (unaimed/melee combat): attrition scales with the product of densities;
  numerical superiority yields only a linear advantage.
- **Square law** (aimed fire): combat power scales with the *square* of force size; a 2:1
  numerical edge yields an attritional advantage approaching 4:1 in the pure model, and an
  N-fold numbers deficit requires an N²-fold quality advantage to offset.
- **Empirical fit:** repeated studies (Hartley 1995; Hartley & Helmbold 1995; Fricker
  1997; Lucas & Turkes 2004) find real battle data does **not** cleanly fit the square
  law; it overpredicts the value of numbers. Fitted compromises use a fractional exponent
  around **1.3–1.5**.
- **Design implication:** substance should dominate in the long run (supporting "substance
  unbounded but slow"), but a linear R = attack ÷ defense is defensible for a casual game —
  the historical exponent sits between linear and square, and the graded-margin casualty
  rule can carry the superlinearity instead.

### The 3:1 rule debate

- **Origin:** a US Army planning-factor folk rule (attacker needs ≥3:1 local superiority
  against a prepared defense), loosely attributed to Dupuy's database.
- **Mearsheimer** (*International Security* 13:4, 1989) defended it as a rough regularity
  for point-of-attack success, arguing critics conflated theater-wide with local ratios.
- **Epstein** (*The Calculus of Conventional War*, 1985) attacked its testability and
  proposed a dynamic adaptive model — using Dupuy's own data against Mearsheimer's use of
  the rule. **Huntington** (1983) called it a cliché.
- **The data point that matters:** only **10 of 68 victors in decisive 20th-century
  battles achieved ≥3:1**, and in **>20% of decisive battles neither side ever reached
  3:1**. (Well-corroborated in the debate literature; primary tabulation — likely the
  Dupuy database via a DTIC monograph — was not directly accessible this session.)
- **Conclusion:** win likelihood rises with force ratio as a gradient; 3:1 is sufficient-
  but-far-from-necessary. This directly supports the game's "threshold headline + graded
  margin" shape over any hard cutoff, and argues the headline threshold itself should sit
  well below 3.0 for ordinary (non-fortified) engagements.

---

## Terrain & fortification

### Terrain as a fight multiplier

Inverting Dupuy's attacker-side terrain degradation (0.4–1.05 infantry, 0.2–1.0 armor)
gives an effective defender-relative swing of up to ~×2.5 for infantry combat in the worst
terrain (more for mechanized forces, which is why mountains "eat" armies with heavy
equipment). Combined terrain + defensive posture reaches the >×3.0 territory of Dupuy's
posture ceiling. **A ~×2.5–3 ceiling for terrain-as-multiplier is historically
defensible.** Beyond that, terrain effects change mechanism (see Frontage).

### Fortification

Open Dupuy sources never publish a fortification multiplier separate from the general
posture range (×1.3 to >×3.0, with fortified defense at the top of that range). Siege
history brackets it from another direction:

- **Xiangyang/Fancheng (1268–1273):** ~100,000 Yuan troops plus a 5,000-ship river
  blockade were held for ~4.5 years by a twin-city fortress (double-wall gate kill zones,
  impact-damping wall screens, a moat deliberately widened to 150 m to force siege engines
  out of effective range). The attacker's traction trebuchets (~100 m range, ~50 kg
  projectiles) "bounced off the walls harmlessly." In ratio terms, fortification pushed R
  below the breach threshold against an attacker with overwhelming substance —
  *specifically against that attacker's siege-tech tier.*
- **The tech override:** ~20 counterweight trebuchets (range ~500 m, projectiles >300 kg),
  built by Persian engineers in early 1273, breached Fancheng within roughly a month;
  Xiangyang surrendered weeks later. The fortification multiplier did not erode — it was
  *stepped over* by a technology tier.
- **Diaoyucheng (1243–1279):** a cliff-top fortress at a three-river confluence held
  ~20,000–30,000 defenders against 100,000+ Mongols across ~36 years of attempts. Three
  factors stack: extreme natural terrain (approach funneled to a narrow assault frontage),
  walls compounding the cliffs, and — the standout — **internal self-sufficiency** (~100,000
  dan of rice/year grown inside, 90+ wells), which removed the starvation lever entirely
  and stopped the defender's substance from decaying over time.

**Design reading:** fortification as a ×2–3 multiplier is defensible; a legendary
mountain-fortress *stack* (terrain × fortification × self-sufficient logistics) reaching an
effective ×4–6 is defensible as a rare ceiling case; and a siege-tech gap should be able to
cut the fortification factor sharply (e.g., to ×1.2–1.5) as a discrete step, not a gradual
erosion.

---

## Frontage

Frontage is the strongest finding of this research: doctrine and history treat engagement
width as a *cap on effective committed force*, structurally different from any multiplier.

1. **Doctrinal frontage norms.** Defense frontage is consistently **3–10× wider** than
   attack frontage at the same echelon: Soviet division attack frontage as narrow as 4 km
   (9–10 km against prepared defenses on main-attack sectors) vs. 50–120 km in defense;
   German WWII division ~15 km; battalion attack frontages 400–2,000 m across German,
   British, US, and Soviet doctrine. Attack = concentrating force onto a narrow front;
   defense = economy of force across a wide one.
2. **Force-to-space ratio** is an established OR concept (Mearsheimer, *Why the Soviets
   Can't Win Quickly in Central Europe*, 1982; *Conventional Deterrence*, 1983): a dense
   enough defender per km of front prevents breakthrough *regardless of theater-level
   numerical ratios*, because the attacker cannot concentrate a decisive local ratio
   anywhere without thinning elsewhere. (The concept is well established; Mearsheimer's
   specific NATO conclusions are contested — "Mearsheimer's Folly" literature.)
3. **Soviet density norms** are the closest thing to a quantified combat-power-per-km
   ceiling: breakthrough artillery norms cited between 100 and 300 tubes/km depending on
   period and source (PU-33 deep-battle regulations: 200–300 guns/km). The range varies
   across secondary sources; the existence and order of magnitude of a density norm is
   solid.
4. **Chokepoint arithmetic (Thermopylae).** The defended position at the Middle Gate was
   ~15 m wide at the fighting point. At close-order hoplite spacing (~1 m/man, tightening
   to ~0.45 m in locked shields), the front rank holds ~15 men *no matter how large the
   army behind it*. The pass converts an army-vs-army ratio into a rank-vs-rank ratio
   bounded by frontage ÷ per-man width. (The per-rank arithmetic is inferred from sourced
   inputs — sources state the conclusion qualitatively.)
5. **No confirmed explicit frontage factor in QJM/TNDM** from open sources — this appears
   to live, if anywhere, in the non-public TNDM manual. Treat as an open question, not a
   negative finding. Culmination-point doctrine is likewise qualitative.

**Design reading:** implement frontage as `effective attack substance = min(committed,
frontage capacity)` before the ratio is computed. Two distinct terrain modes emerged from
the case studies and should not be conflated:

- **Chokepoint mode** (Thermopylae, Myeongnyang, Diaoyucheng): a single narrow front caps
  engaged attackers at a small absolute number — concentrates the defense.
- **Fragmentation mode** (Soviet-Afghan): broken terrain disperses the attacker across
  many small engagements, diluting effective committed strength per fight — no single
  chokepoint, same net effect of denying massed superiority.

---

## Command & control

### Own-side command attention (the commitment lever)

- The largest own-side situational multiplier in the quantified OR literature is Dupuy's
  **complete surprise: ×2.24**, decaying over ~3 days. Surprise is the closest analogue to
  "command attention converted into battlefield advantage" (it is bought by planning,
  deception, and decision quality).
- Measured CEV for historically excellent forces — which *bundles* leadership with
  training and morale — averages **×1.2–1.3** (Wehrmacht in Italy) and peaks around
  **×2.0** (Israel 1973: 1.98; best individual division pairs 2.0). The ×3.0
  German-vs-Soviet 1943 figure is a model-input outlier representing a quality gap far
  beyond "attention," entangled with doctrine, training, and cohesion differences.
- Commander talent is **never isolated** as its own multiplier in the literature; it is
  absorbed into CEV. Any game "commitment lever" is a design abstraction of a bundled
  quantity — which argues for keeping it modest, since part of what it would represent is
  already in the quality term.
- Boyd's OODA-loop tempo advantage — the main theoretical case for large command effects —
  has **no numeric conversion** in the literature.

**A saturating lever with a ×2 ceiling is squarely supported.** Typical operating band
×1.1–1.5; the ceiling case (×2) should feel like the equivalent of achieving complete
surprise with a first-rate commander — rare and expensive.

### Enemy command/cohesion collapse

- Quantified C2-degradation coefficients essentially do not exist in the open literature.
  RAND C2 work is qualitative; decapitation-strike studies report outcome success rates
  (~25–30% under favorable conditions) rather than combat-power multipliers, and note that
  redundant command structures blunt the effect.
- What the literature *does* provide is the **breakpoint** tradition: US Army FM 105-5
  (1964) institutionalized 40% casualties (defender) / 20% (attacker) as
  combat-ineffectiveness thresholds for wargaming — with, per the Dupuy Institute, no
  documented analytical support; Dorothy Clark's ORO study (1954, 43 WWII battalions)
  found breakdown averaging ~40% casualties but called any fixed threshold "a gross
  oversimplification... not supported by combat data."
- The consistent shape across sources: own-side excellence is modeled as a smooth
  multiplier (1.10 → 2.24); enemy collapse is modeled as a **near-binary state change** —
  a broken unit is not "at ×0.3," it stops functioning as a fighting element.

**Design reading:** the hypothesized asymmetry is supported, with a reframe. Do not extend
the multiplier scale downward to represent enemy collapse (no mirrored ×5–10 swing on the
same dial). Instead, give the formula a **break state**: when a side crosses a
morale/casualty threshold (historically a fuzzy 20–40% band), its effective power drops
sharply and discontinuously (or it simply loses the engagement). Agincourt's French
command self-destruction and Myeongnyang's Japanese coordination breakdown both behave
this way — cliffs, not sliders.

---

## Upset decompositions

Factor vocabulary: **frontage throttle** (cap on engaged attackers), **terrain
multiplier**, **fortification**, **quality gap**, **command lever** (friendly),
**enemy command collapse**, **morale/cohesion**, plus **tech tier** (added — see
Xiangyang) and **logistics substance**.

### Battle of Myeongnyang (1597)

- **Force ratio:** 13 Korean panokseon vs. ~120–133 Japanese warships engaged (of up to
  ~330 total including transports) — ~10:1 engaged, up to ~25:1 nominal.
- **Frontage throttle (dominant):** the strait is narrow (~180 m at the narrowest point
  per the sourcing consulted) with tidal currents of ~10–11.5 knots reversing roughly
  every 3 hours; only smaller sekibune could navigate it, and the current drove the packed
  Japanese formation into drift and self-collision. Effective simultaneously engaged
  Japanese ships: a handful, not 120+. This converts 10:1 into something near parity at
  the point of contact.
- **Quality gap (moderate-large):** panokseon were sturdier stand-off cannon platforms;
  Japanese ships were boarding-action designs.
- **Command lever (large, documented, two-sided):** the battle *opened* with a Korean
  cohesion failure — Yi Sun-sin's flagship fought alone while his captains hung back
  (post-Chilcheollyang trauma); his refusal to withdraw and signaling pulled the line back
  together. The lever here is visibly the difference between 1 effective ship and 13.
- **Enemy command collapse (contributory):** vanguard commander Kurushima Michifusa killed
  early; coordination degraded amid strait congestion.
- **Verdict:** explicable without randomness. Bounded residual contingency: the survival
  of Yi's flagship during its solo window is the one point where documented mechanism
  alone does not fully close the gap.

### Thermopylae (480 BCE)

- **Force ratio:** ~7,000 Greeks vs. a Persian force modern scholarship places around
  100,000–300,000 (Herodotus's millions rejected as logistically impossible).
- **Frontage throttle (dominant):** the Middle Gate bottleneck (~15 m fighting front,
  backed by the Phocian Wall) capped engaged Persians at rank-vs-rank scale — roughly
  15 men abreast — regardless of army size.
- **Quality gap (large):** hoplite armor, longer spears, and shield-wall tactics against
  lighter Persian infantry; frontal penetration of the line failed for three days.
- **Command lever (moderate):** Leonidas's rotation of fresh contingents through the line
  sustained effectiveness across days.
- **How it ended — throttle removal, not attrition:** Ephialtes's betrayal of the Anopaea
  path let ~20,000 Persians (Diodorus) bypass the ~1,000 Phocians guarding it and
  encircle the position. The frontage cap was not overpowered; it was *deleted* by a
  flanking route with a single point of failure.
- **Verdict:** explicable without randomness on both ends. The contingent element
  (Ephialtes's choice) is a discrete human/political event, not battle noise — in game
  vocabulary, a frontage throttle should be *removable* (a discoverable flank path), not a
  permanent constant.

### Agincourt (1415)

- **Force ratio:** disputed by a factor of ~2: Anne Curry (2005, administrative records)
  ~9,000 English vs. ~12,000 French (4:3); Barker/Sumption/Rogers support 14,000–24,000
  French vs. ~6,000 English (up to ~4:1).
- **Frontage throttle + terrain (large):** a ~900-yard field narrowing between two woods
  funneled the French and denied flanking; deep rain-soaked plough mud exhausted armored
  men-at-arms before contact (terrain acting directly on attacker quality/stamina, some
  drowning where they fell).
- **Quality/tech gap (moderate):** longbows were marginal against best plate but effective
  against horses, limbs, and lesser armor — breaking the cavalry charge into the advancing
  infantry's path.
- **Enemy command collapse (large, decisive, self-inflicted):** no unified French command;
  nobles crowded the front ranks beyond the frontage's capacity; the rearguard was
  leaderless; French archers/crossbowmen were placed *behind* the men-at-arms, negating
  the French missile arm entirely. Congestion + mud + funnel produced a crush.
- **Command lever (clear):** Henry V's choice of the narrow position, staked archers on
  the flanks, and provoking the French into attacking through the mud.
- **Casualty asymmetry:** ~112–600 English dead vs. ~6,000 French dead and 700–2,200
  captured.
- **Verdict:** explicable without randomness even at the high-end French numbers. The open
  question is the input force ratio (historians disagree ~2×), not the mechanism.

### Siege of Xiangyang and Fancheng (1268–1273)

- **Forces/duration:** ~100,000 Yuan troops + 5,000-ship blockade vs. the twin fortress
  cities; held ~4.5 years.
- **Fortification (dominant):** engineered defenses (double-wall kill zones, impact-damping
  screens, 150 m moat forcing siege engines out of effective range) fully defeated the
  attacker's siege-tech tier — traction trebuchet stones "bounced off the walls."
- **Command lever (friendly, moderate):** multi-year Song river resupply (a 1272 relief
  run of ~100 paddle-wheel boats broke the blockade once; with no success signal returned,
  no further relief came, and the corridor closed).
- **Tech tier (decisive):** ~20 counterweight trebuchets (Ismail and Ala al-Din, sent via
  the Ilkhanate; ~500 m range, >300 kg projectiles) breached Fancheng within about a month
  of deployment; Xiangyang surrendered 1273-03-14.
- **Verdict:** explicable without randomness — a clean tech-tier story. Fortification held
  R below breach threshold for ~5 years *against tech tier A*; tech tier B stepped over
  it almost instantly. Strong argument for a discrete siege-tech modifier that can cut the
  fortification multiplier, separate from general troop quality.

### Diaoyucheng / Fishing Town (1243–1279; decisive siege 1259)

- **Forces:** ~20,000–30,000 Song garrison vs. 100,000+ Mongols (1259); resisted for
  ~36 years overall, surrendering only in 1279.
- **Terrain (extreme) × fortification (high):** cliff-top fortress at a three-river
  confluence; approach funneled to a narrow assault frontage — a natural chokepoint the
  attacker's superiority could not be brought to bear against.
- **Logistics substance (standout):** internal agriculture (~100,000 dan of rice/year) and
  90+ wells removed the starvation lever — the defender's substance did not decay, which
  defeats normal siege attrition entirely.
- **Enemy command contingency:** Great Khan Möngke died at the siege 1259-08-11 — cause
  genuinely disputed (Song projectile wound per Chinese sources; arrow per Bar Hebraeus;
  dysentery/cholera per Rashid al-Din). His death triggered the succession crisis, pulled
  Kublai north and Hulagu's forces back from the Middle East (weakening the force beaten
  at Ain Jalut).
- **Verdict: mixed — the sharpest lesson in the set.** The *36-year hold* is fully
  explicable without randomness (terrain × fortification × self-sufficiency). The
  *strategic consequence* of the 1259 siege rests on one irreducible point contingency:
  the death of the enemy's supreme commander. If the game ever wants an upset valve, this
  is its shape — a rare discrete commander-casualty event on top of deterministic siege
  math, never noise in the combat resolution itself.

### Soviet-Afghan War (1979–1989) — asymmetric case

- **Figures:** peak ~120,000 Soviet troops; 14,453 Soviet dead, ~416,000 hospitalized
  (disease rivaling combat as an attrition source); DRA forces nominally 302,000 with
  ~10%/year desertion; 1–3 million Afghan deaths.
- **Terrain — fragmentation mode (very high):** roadless mountains fragmented Soviet
  mechanized power into many small engagements; valley-floor convoys were ambushed from
  elevated chokepoints; Mujahideen "hugged" Soviet units to deny air/artillery support.
  Unlike a chokepoint, this terrain *dilutes* the attacker's effective committed strength
  per engagement across the whole theater.
- **External lever boost (discrete, dated):** Stinger missiles from autumn 1986 (plus
  ISI/Saudi/Chinese support) degraded the Soviets' one decisive asymmetric advantage
  (air superiority) — functionally a *reduction of the enemy's tech multiplier* delivered
  through the weaker side's foreign logistics.
- **Enemy political-will decay (gradual, documented):** Gorbachev's "bleeding wound"
  speech (Feb 1986) → Politburo withdrawal decision (Nov 1986) → withdrawal begun
  Oct 1988 — a ~2.5-year visible arc of eroding commitment. This is the "commitment lever
  falling below baseline over many turns" pattern, not a discrete collapse.
- **Quality gap:** the Soviets did not lose a tactical-quality contest; their material
  superiority was largely intact until 1986. The war was lost at the terrain-attrition and
  political-will level.
- **Verdict:** explicable without randomness as a compound, multi-stage sequence:
  fragmentation terrain kept costs high indefinitely → external tech injection removed the
  remaining edge → sustained cost eroded the occupier's political will. A genuinely
  different case-type from Diaoyucheng: attritional will-decay over many turns vs.
  discrete contingent upset.

### Cross-case pattern

In every case, the largest single factor is **the world**, not per-battle command
attention: frontage/terrain throttles (Myeongnyang, Thermopylae, Agincourt, Diaoyucheng,
Afghanistan) or fortification-vs-tech-tier (Xiangyang). Command levers matter visibly
(Yi Sun-sin, Leonidas's rotation, Henry V's ground choice) but operate *within* the space
the world-factors create — and the biggest command effects in the set are *negative* ones
on the losing side (French self-congestion, Japanese coordination breakdown, Soviet will
decay). This is precisely the hypothesized asymmetry.

---

## Recommended ranges

| Factor | Recommended range | Ceiling & anchor | Notes |
|---|---|---|---|
| **Commitment lever** (friendly, saturating) | ×1.0–2.0; typical play band ×1.1–1.5 | ×2.0 — anchored by complete surprise ×2.24 and measured CEV peak ~×2.0 | Saturating curve is correct; the last steps toward ×2 should be expensive (great commander + full activation + logistics priority together). Consider decay if attention is sustained without refresh (surprise decays ~1/3 per day). |
| **Quality** | ×0.8–2.0 | ×2.0 ordinary cap; ×3.0 only as a rare epoch-defining gap (German-Soviet 1943 model input) | Slow-moving substance-adjacent stat, not per-turn. |
| **Tech tier (siege/field)** | Discrete steps, not a dial | A one-tier siege-tech advantage may cut enemy fortification factor to ~×1.2–1.5 | Xiangyang pattern: step function, near-immediate once deployed. Keep separate from quality. |
| **Terrain (fight multiplier)** | ×1.0–2.5 (open 1.0 / rough ~1.3–1.5 / mountain ~2.0–2.5) | ~×2.5 — inverse of Dupuy's worst-terrain infantry degradation (0.4); heavier penalty against "armored"-analog forces is defensible | Consistent with the hypothesized ~×3 ceiling. |
| **Frontage throttle** | Not a multiplier: `effective attackers = min(committed, capacity)` | Effectively unbounded impact — can flatten any numeric ratio | Two modes: chokepoint (caps one battle) and fragmentation (dilutes per-engagement strength theater-wide). Must be removable/bypassable (flank path, tide window) — its historical failure mode is deletion, not attrition. |
| **Fortification** | ×1.0 none / ~×1.3 hasty works / ×1.5–2.0 prepared / ×2.0–3.0 fortress | ×3.0 — top of Dupuy's posture range (1.3 to >3.0) | Subject to tech-tier override. Self-sufficient logistics is a separate flag that stops siege decay (Diaoyucheng), not a bigger multiplier. |
| **Combined defense stack** | Terrain × fortification typically ≤ ×4; legendary sites (Diaoyucheng-class) ~×4–6 | Rare, map-authored, not player-assembled per turn | Matches "big power comes from the world." |
| **Enemy command collapse** | State change, not a dial: below a break threshold, effective power drops to a cliff value (or the engagement is simply lost) | Break band anchored at the historical fuzzy 20–40% casualty/morale range | Do not mirror the friendly lever downward as a smooth multiplier — the literature models breakdown as near-binary. |
| **Substance** | Unbounded, slow | Superlinear payoff defensible (empirical Lanchester exponent ~1.3–1.5) but linear R is fine for a casual game | Let graded margin (casualty reduction) carry the superlinearity. |
| **Headline threshold** | R noticeably below 3.0 for ordinary attacks | 3:1 is a gradient, not a wall (10/68 decisive victors reached it) | Margin-buys-casualties matches the historical gradient. |

**Hypothesis ordering — final answer:** `lever (≤×2.0) < terrain multiplier (≤×2.5) ≈
fortification (≤×3.0) << frontage throttle (cap, unbounded) ; substance unbounded but
slow` — supported, with frontage split out of "terrain" as a cap mechanic, fortification
made tech-contingent, and enemy collapse modeled as a cliff state rather than a mirrored
multiplier. Determinism is defensible for all combat math; the only historically honest
randomness candidate is a rare discrete commander-casualty/betrayal event layer.

---

## Sources

Confidence key: figures marked "unverified" above could not be traced to an accessible
primary source in this research pass.

**Dupuy / QJM / TNDM (primary-adjacent):**
- Dupuy Institute, "The Combat Value of Surprise" — https://dupuyinstitute.org/2018/06/29/the-combat-value-of-surprise/
- Dupuy Institute, "How Attrition is Calculated in the QJM vs the TNDM" — https://dupuyinstitute.org/2019/12/26/how-attrition-is-calculated-in-the-qjm-vs-the-tndm/
- Dupuy Institute, "Dupuy's Verities: The Power of Defense" — https://dupuyinstitute.org/2018/05/30/dupuys-verities-the-power-of-defense/
- Dupuy Institute, "Dupuy's Verities: Fortification" — https://dupuyinstitute.org/2018/12/17/dupuys-verities-fortification/
- Dupuy Institute, "Human Factors in Warfare: Combat Effectiveness" — https://dupuyinstitute.org/2017/10/04/human-factors-in-warfare-combat-effectiveness/
- Dupuy Institute, "The 40% Rule" — https://dupuyinstitute.org/2024/03/26/the-40-rule/
- Dupuy Institute, TNDM page — http://www.dupuyinstitute.org/tndm.htm
- T.N. Dupuy, *Numbers, Predictions and War* (1979); *Understanding War* (1987) — cited as the location of the full per-terrain factor tables (not web-accessible)
- Christopher Lawrence, *War by Numbers* (Potomac Books, 2017) — likely primary source for Israeli CEV 1.75/1.98 and the surprise-value validation (page cites unconfirmed)

**3:1 rule debate:**
- J.J. Mearsheimer, "Assessing the Conventional Balance: The 3:1 Rule and Its Critics," *International Security* 13:4 (1989) — accessed via secondary summaries only
- J.M. Epstein, *The Calculus of Conventional War: Dynamic Analysis without Lanchester Theory* (Brookings, 1985)
- 10/68 decisive-battle tabulation: corroborated across the debate literature; primary tabulation (DTIC monograph AD1083211) inaccessible this session (403/429)

**Lanchester:**
- Wikipedia, "Lanchester's laws" — https://en.wikipedia.org/wiki/Lanchester%27s_laws (with Hartley 1995; Hartley & Helmbold 1995; Fricker 1997; Lucas & Turkes 2004 as the empirical-fit studies)

**Frontage / force-to-space:**
- "Infantry Unit Frontages during WW2," balagan.info (compiling Bull 2005, Rottman 2004, US War Dept 1995, Erickson 1993, Sharp 1998 et al.) — https://balagan.info/infantry-unit-frontages-during-ww2
- J.J. Mearsheimer, "Why the Soviets Can't Win Quickly in Central Europe," *International Security* (1982); *Conventional Deterrence* (1983)
- "Mearsheimer's Folly," Military Strategy Magazine — https://www.militarystrategymagazine.com/article/mearsheimers-folly-natos-cold-war-capability-and-credibility/
- D. Glantz, *Soviet Defensive Tactics at Kursk*, CSI Report No. 11 — https://www.armyupress.army.mil/Portals/7/combat-studies-institute/csi-books/glantz2.pdf (most rigorous source for Soviet density norms)
- DTIC ADA248025, "The Effect of Force to Space Ratios on Conventional Combat" — flagged for follow-up (unretrieved)

**C2 / morale breakpoints:**
- Dorothy Clark, *Casualties as a Measure of the Loss of Combat Effectiveness of an Infantry Battalion* (ORO, 1954) — https://apps.dtic.mil/sti/tr/pdf/AD0059384.pdf
- US Army FM 105-5 (1964) breakpoints, via Dupuy Institute "The 40% Rule"
- "Attacking the Leader, Missing the Mark," *International Security* 38:4 — https://direct.mit.edu/isec/article/38/4/7/12293/
- RAND RRA316-1, *Command and Control of USAF Combat Support in a High-End Fight* — https://www.rand.org/pubs/research_reports/RRA316-1.html (qualitative)

**Battles:**
- Battle of Myeongnyang — https://en.wikipedia.org/wiki/Battle_of_Myeongnyang
- Battle of Thermopylae — https://en.wikipedia.org/wiki/Battle_of_Thermopylae ; Warfare History Network, "Defending the Pass at Thermopylae"
- Battle of Agincourt — https://en.wikipedia.org/wiki/Battle_of_Agincourt ; Anne Curry, *Agincourt: A New History* (2005); "The Numbers at Agincourt" — http://willscommonplacebook.blogspot.com/2009/11/numbers-at-agincourt.html
- Battle of Xiangyang — https://en.wikipedia.org/wiki/Battle_of_Xiangyang
- Siege of Diaoyucheng — https://en.wikipedia.org/wiki/Siege_of_Diaoyucheng ; Möngke Khan — https://en.wikipedia.org/wiki/M%C3%B6ngke_Khan ; ScienceDirect, Diaoyucheng fortress construction study — https://www.sciencedirect.com/science/article/pii/S2095263524000682
- Soviet–Afghan War — https://en.wikipedia.org/wiki/Soviet%E2%80%93Afghan_War ; Jalali & Grau, *Mujahideen Tactics in the Soviet-Afghan War* — https://www.files.ethz.ch/isn/96457/02_Jan.pdf ; Yaacov Ro'i, *The Bleeding Wound* (Stanford UP) — publisher page only, page-level claims unconfirmed

**Lower-confidence secondary sources used for cross-checks (flagged where relied on):**
Grokipedia entries (Lanchester, Diaoyucheng, Xiangyang, Red Army tactics, decapitation),
Axis History Forum (CEV discussion), Age of Empires wiki (trebuchet specs corroboration),
Cold War Gamer blog (Soviet density ORBATs).
