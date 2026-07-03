# Wargame Combat Multiplier Conventions

Research survey of how strategy and war games implement combat factor values
numerically, gathered to validate the Terrain Game combat formula skeleton:

- attack = troop substance × commitment lever × quality
- defense = garrison substance × commitment lever (baseline 1) × terrain × fortification
- R = attack ÷ defense, deterministic threshold headline + graded margin

Working hypothesis under test: **"lever ceiling < terrain/fortification
ceilings"** — big power comes from world state, not per-turn input.

Method note: Classic CRT, Panzer General lineage, Unity of Command, Civilization,
Total War, and Advance Wars sections are web-verified (manuals, wikis, community
formula documentation; sources at end). The HOI4 and EU4 sections are
reconstructed from designer knowledge because the dedicated research pass
failed; figures there are marked **(approx.)** and should be re-verified against
hoi4.paradoxwikis.com / eu4.paradoxwikis.com before being cited in a spec.

---

## Summary verdict

1. **The hypothesized ranges are consistent with genre convention.** Across
   eight systems, static world-state defense (terrain + fortification +
   entrenchment) typically multiplies effective defense by **×2 to ×4**, while
   per-turn player-input levers (CO powers, planning bonuses, command points)
   deliver **×1.1 to ×1.5**, occasionally ×2 at full investment. No healthy
   design lets the per-turn lever outweigh world state; the one genre case
   where it can (HOI4 planning-bonus stacking above +100%) is community-flagged
   as degenerate.
2. **Terrain ×1–3 and fortification ×1–3 are individually in-range, but their
   product should be capped.** The genre maximum for a *stacked* static
   defensive multiplier is about ×4 (Third Reich fortresses; UoC2's extreme
   city + fortified + intact-fort stack is theoretically higher but rare and
   heavily counterable). A naive ×3 × ×3 = ×9 stack would exceed anything in
   the survey. Recommend a combined soft cap around ×4–5 or sub-multiplicative
   stacking.
3. **Lever ×1–2 saturating is correct in shape; ×2 is the generous end.**
   Genre analogues sit at ×1.1–1.5. Keeping ×2 is defensible if reaching it is
   expensive and it decays/resets — that mirrors HOI4 planning (slow build,
   instant decay) and Advance Wars CO powers (multi-turn charge, one-turn burst).
4. **Substance-unbounded needs a frontage throttle.** Every surveyed system
   that allows unbounded force accumulation also caps how much of it can engage
   at once (combat width, 1-unit-per-tile, stacking limits, CRT top column).
   This is the genre's universal upset-bounding and anti-doomstack device, and
   it directly validates the "terrain throttles substance" idea.

---

## Per-game findings

### 1. Classic hex wargame CRTs (Panzerblitz, Third Reich, ASL family)

- **Odds columns**: canonical ladder **1-3, 1-2, 1-1, 3-2, 2-1, 3-1, 4-1,
  5-1**, extending to 6-1+; ratios round in the defender's favor. Attacks
  worse than the bottom column are suicidal or prohibited; attacks above the
  top column resolve as the top column (overkill buys nothing).
- **Terrain applies through two distinct levers, both genre-established:**
  - **Column shift** (Panzerblitz): defender in woods shifts the attack one
    column left — a 6-1 becomes a 5-1. One column ≈ ×1.3–1.5 on effective odds.
  - **Defense multiplier** (Rise and Decline of the Third Reich): defenders are
    always at least **doubled (×2)**; defensive terrain **triples (×3)**;
    fortresses (Maginot, Gibraltar, Sevastopol, etc.) **quadruple (×4)** —
    applied to defender strength before the ratio is computed. **×4 is the
    highest static multiplier found in the classic canon.**
  - **ASL nuance**: ASL's infantry fire table uses terrain as a flat dice-roll
    modifier (TEM), not a column shift; odds-ratio lookup survives only in its
    Close Combat subsystem. Memoir '44 and Combat Commander are *not* CRT
    games (dice-pool / card-driven lineage).
- **Upset bounding**: stacking limits (Third Reich: 2 ground units/hex, few
  exceptions), Exchange results (mutual step loss even when winning), and
  no-retreat-becomes-elimination close the "tiny force holds forever" and
  "hide at map edge" loopholes.

### 2. Unity of Command 1/2 (presentation reference)

The best-documented system in the survey — official manuals publish the math.

- **Core formula**: AttackVal = Σ active-step attack; DefendVal = Σ active-step
  defense (+1). Raw odds = **3·log₃(attack/defense)**, clipped to [-3, +9]
  (1:3 → -3, 1:1 → 0, 3:1 → 3, 9:1 → 6, 27:1 → 9). All modifiers are
  **additive shifts in log-odds space**: each ±1 shift ≈ ×1.44 on the effective
  ratio (3^(1/3)). Only randomness: final odds resampled once from a Normal
  (σ = 1) before CRT lookup — one roll per combat, which is why it reads
  deterministic.
- **Terrain shifts (defender-favoring)**: Forest -1, Hills -1, Swamp -1,
  Mountain -2, City -2, **Ruins -3**; weather Mud -2, Snow -1. UoC2 adds:
  minor river attack -2 (0 with engineers), escarpment/ridge -2.
  Terrain also *nullifies attacker bonuses*: no Armor Shift into
  rivers/cities/mountains/forests/swamps/ruins; Artillery Shift zeroed against
  entrenched defenders in cover. Armor/Artillery shifts cap at ±5.
- **Entrenchment**: UoC1 one level (-1 shift, fully negated by attacker
  engineers). UoC2 two tiers: **entrenched -1, fortified -2**, one full-action
  turn per tier (min 2 turns stationary to fortify). Fixed fortifications add
  **-1 (destroyed) / -3 (intact)**, stacking with entrenchment. Degradation is
  built in: 2+ KIA in one attack strips a level; each attacker engineer step
  cancels one point of the shift.
- **Suppression**: steps are binary active/suppressed; only active steps count
  toward combat value. Recovery 1–3 steps/turn by veterancy (halved in
  mountains). Functions as soft attrition that precedes real kills.
- **Force scaling**: hard discrete step model (~4–7 steps/unit), no continuous
  HP; combat value = per-step stat × active steps.
- **Supply**: escalating per-turn penalty schedule for out-of-supply units — no
  suppression recovery (T1), no AP + forced suppression (T2), full suppression
  (T3), steps bleed away (UoC2 T4+). Supply is the true kill mechanism.
- **Commitment-lever analogue**: UoC2 HQ **Command Points** — 4–6 CP/turn
  baseline (up to 9 with upgrades), spent 1–3 CP per special action (entrench,
  feint, suppressive fire, set-piece attack). Note the shape: CP is a
  **per-turn action-count throttle, not a combat multiplier**. Its combat
  effect per action is modest (~1 shift ≈ ×1.44). UoC1 has no equivalent.

### 3. Panzer General lineage

- **Entrenchment (PG1 manual)**: terrain sets base level — cities 3,
  forest/bocage/mountain 2, rough/hills 1, else 0; units dig up to **5 levels
  above base** at **+1 level per stationary turn**; **-1 level per attack
  received**. Repeated attacks in one turn cut ground defense by 2 each,
  capped at -8 ("grind it down" is the intended counter).
- **Panzer Corps**: +1 defense point per entrenchment level (later ×2 vs
  ranged); each level also cuts hit chance ~**10%/level** (level 10 ≈ immune
  without "ignore entrenchment" units); entrenchment ≥ 2 blocks forced
  retreat/surrender. Terrain bases version-dependent (fortification 5, city 4,
  forest 3, hill 2, clear 0 in one compilation).
- **Terrain as structural swap**: close terrain (city/forest/mountain) forces
  non-infantry to defend on their lower Close Defense stat instead of Ground
  Defense — a role-based penalty rather than a flat multiplier; infantry
  immune. Swamp is a penalty terrain.
- **Experience/quality**: Panzer Corps 2 — 1000 XP per star, max 5 stars, each
  star **+10% accuracy** (attack and defense) plus a **-4% accuracy penalty**
  imposed on attackers. So max quality swing ≈ **+50% / ×1.5**, earned slowly
  over a campaign — a useful calibration for "quality tech-paced."
- No closed-form damage formula is published anywhere in the lineage.

### 4. Hearts of Iron IV **(approx. — knowledge-based, re-verify)**

- **Terrain attack penalties** (attacker modifiers, approx.): river crossing
  **-30%** (major river **-60%**), amphibious landing ~-70% (reduced by
  marines/tech), mountain **-40%**, marsh ~-40%, urban ~-30%, jungle ~-30%,
  hills ~-25%, forest ~-15%, plains/desert 0.
- **Forts**: land fort levels 1–10, ~**-15% attacker penalty per level**;
  countered by engineers (fort attack bonuses), CAS/bombing damage to the fort,
  and fort-buster traits. High-level forts approach unattackable without
  counters — and the counters are the point: forts are *damageable* state.
- **Entrenchment**: accrues a few %/day while stationary; base cap is small
  (~+5–10%), extended by engineer companies, Grand Battleplan doctrine, and
  field marshal traits to roughly **+30–50%** defense at full investment.
- **Planning bonus (closest commitment-lever analogue)**: accrues ~+2%/day
  while an order is prepared, **base cap ~+30%**; Grand Battleplan doctrine
  and modifiers push the cap to ~+50%, with extreme stacking reported around
  **+100–110%**. Critically: it *decays rapidly once the attack starts or the
  order changes* — a chargeable, spendable burst, not a sustained multiplier.
  At base cap (+30%) it is clearly **below** a typical terrain+fort+entrench
  stack; only the doctrine-stacked extreme exceeds it, and that build is
  community-regarded as degenerate/exploity.
- **Generals**: attack/defense skill points worth ~+5% each (approx.), traits
  typically +5–25% situational. Comparable to one terrain step, not to a fort.
- **Combat width**: see dedicated section below.

### 5. Europa Universalis IV **(approx. — knowledge-based, re-verify)**

- **Dice mechanic**: each 3-day combat phase both sides roll a **0–9 die**;
  casualties scale roughly as base 15 + 5 × (modified roll) per phase tick.
  With an average roll of 4.5 the expected base is ~37.5, so **each -1 die
  modifier ≈ -12–15% damage output; -2 ≈ -25–30%**.
- **Terrain dice modifiers (attacker)**: mountains **-2**; hills, forest,
  marsh, jungle ~**-1** each.
- **Crossing penalties**: river **-1**; strait/amphibious **-2**; negated or
  reduced when the attacker's general has more maneuver pips than the
  defender's.
- **Forts**: fort levels (2/4/6/8) and defensiveness % do **not** affect field
  battles at all — they gate a *separate siege subsystem* (longer sieges,
  zone-of-control movement locks). Structural lesson: fortification as a
  time-tax and movement-gate rather than a combat multiplier is a viable
  alternative channel.
- **General pips**: fire/shock/maneuver/siege, 0–6 each; fire and shock pips
  add directly to the die roll in their phase. A ±6 pip differential swings
  more than any terrain (**±6 die points vs terrain's -2 max**) — EU4 is the
  genre outlier where leadership quality outweighs terrain. Combat width
  (15→40, tech-paced) still caps engaged regiments.
- **Relative sizes**: pips > terrain/crossing > (forts: absent from field
  combat). EU4 compensates with stackwipe rules — a catastrophically
  outnumbered defeated army is annihilated outright, bounding upset attempts.

### 6. Civilization series (additive-percentage school)

- **Civ 5 (percentage bonuses)**: hills/forest/jungle **+25%** defense;
  fortify **+20%** (1 turn) / **+40%** (2+ turns); Fort/Citadel tile +50%;
  attacked-across-river defender +25% (attacker -20%). Documented realistic
  stack: Drill II +30% + Great General +15% + rough terrain +25% + fortify
  +40% = **+110%**; heavily promoted defenders can reach +150–200%.
- **Civ 5 city defense**: base strength 8 + pop/tech scaling; walls +5 CS and
  +50% city HP with era-tier jumps; garrisoned unit adds **20% of its combat
  strength** to the city.
- **Civ 6 (flat combat-strength points on an exponential curve)**: hills +3 CS,
  woods +3 CS (stack +6), river defense +5 CS, fortify +3/+6 CS, wall tiers
  +3 CS each (max +9). Formula keyed on strength **difference**: each +1 CS ≈
  ×1.041 damage both ways; **+17 CS ≈ double damage dealt / half received**;
  ±36 CS guarantees one-shot regardless of the 0.8–1.2 random roll. So Civ 6's
  flat points are secretly multiplicative — the same log-space design as UoC's
  shifts.
- **Civ 4 (contrast)**: per-round win odds A/(A+D) — much steeper sensitivity
  to small strength edges; abandoned by later entries partly for legibility.

### 7. Total War (real-time tactical reference — qualitative)

- **High ground**: no flat documented %; downhill charges hit harder/faster,
  uphill attackers arrive slower and vigor-drained. Elevation is
  physics/stamina, not a multiplier.
- **Walls**: not a combat multiplier — a **funnel-and-attrition** mechanic:
  chokepoints, tower fire (T3 towers alone can destroy siege equipment),
  breachable wall segments with HP, siege-escalation clock. Reinforces the
  EU4 lesson: fortification can be a geometry-and-time system instead of a
  number.
- **Morale magnitudes**: flank charge -4 leadership, cavalry rear charge -6,
  general slain -8 (then -2 permanent), secured flanks +5, general aura +4–8.
  Rout, not kill-count, decides battles — morale is the actual currency.

### 8. Advance Wars (deterministic-ish casual reference)

- **Formula** (community reverse-engineered, floored between terms):
  `Damage = CO_atk × BaseDamage(unit-vs-unit chart) × PowerNorms × (AttackerHP/10) × (100 − Stars × DefenderHP) / 100`
- **Terrain stars**: **each star = 10% damage reduction, scaled by defender's
  remaining HP**. Road/river 0, plain 1, forest 2, city/base 3, mountain/HQ 4.
  Max static terrain effect: **-40% incoming damage ≈ ×1.67 effective
  defense** — deliberately modest, readable at a glance as star icons.
- **CO powers (commitment-lever analogue)**: all powers give a baseline
  **+10%/+10%** attack/defense while active; signature effects range
  **+30–65% attack for one turn** after a multi-turn charge meter fills
  (Max +50% direct day-to-day; Kanbei SCOP +40% atk/+50% def;
  Sensei +65% for copters). Shape: **saturating charge → one-turn burst** —
  the genre's cleanest casual model of "per-turn command attention."
- **Luck**: 0–9% bonus damage roll (uniform), scaled by attacker HP; not
  disabled by default. "Deterministic-ish" in feel because the band is small,
  capped, and non-negative — a design option worth noting: tiny bounded noise
  reads as deterministic.
- **Upset bounding**: attacker HP gates output (a 4/10-HP unit deals 40%),
  every surviving defender counterattacks immediately, and 1-unit-per-tile
  makes every road a frontage throttle. A cheap infantry on a 3–4 star tile in
  a choke can stall an arbitrarily expensive column for turns.

---

## Frontage / combat width

Every surveyed system that permits unbounded force accumulation throttles how
much of it can *engage*:

| System | Throttle | Numbers |
|---|---|---|
| HOI4 | Province combat width | (approx., post-1.11) plains ~90, urban ~96, forest ~84, hills ~80, marsh ~78, **mountain ~75**; each additional attack direction adds ~+50% width; overwidth allowed to ~+33% with stiff penalties. Terrain narrows the pipe; encirclement widens it. |
| EU4 | Tech-paced combat width | 15 → 40 regiments engaged; excess sits in reserve taking morale ticks. |
| Classic CRTs | Stacking limits + top column | 2 units/hex (Third Reich); odds above 6-1 resolve as 6-1 — overkill is wasted. |
| Advance Wars / Civ 5+ | One unit per tile | Map geometry *is* the width system; chokepoints do the rest. |
| UoC | One unit per hex + AP | Same geometric throttle; plus 1 action/unit/turn. |

Design reading for Terrain Game: the "terrain throttles substance" idea is not
just genre-consistent, it is the **genre-standard mechanism** for (a) making
terrain matter beyond a defense multiplier, (b) bounding doomstacks, and
(c) letting small forces hold chokes. HOI4 is the only system where width is a
*tuned per-terrain number* rather than emergent map geometry — and note the
spread is modest (75–96, ~±15% around plains), because width interacts
multiplicatively with the terrain combat penalties that already exist. If we
add an explicit per-province width stat, a narrow numeric band on top of the
terrain multiplier is the precedent; a choke should not be double-punished into
irrelevance.

---

## Total defensive swings

Stacked terrain + fortification (+ entrenchment) converted to a single
effective defense multiplier:

| System | Typical stack | Effective multiplier |
|---|---|---|
| Third Reich | terrain ×3, fortress ×4 (vs already-doubled baseline) | **×3–4 static ceiling** |
| UoC2 | terrain -1/-2 + entrenched/fortified -1/-2 shifts | ×2–4.3 typical; city+fortified+intact fort (-7 shifts ≈ ×13) theoretical max, rare and engineer-counterable |
| HOI4 (approx.) | mountain -40% attack + fort 3–5 + entrenchment | ×2.5–4+ typical; fort 10 approaches unattackable *by design*, with dedicated counters |
| Civ 5 | rough +25% + fortify +40% + river +25% | ~×1.9; promoted extremes ~×2.5–3 |
| Civ 6 | hills+woods+fortify+river ≈ +14–20 CS | ≈ ×1.8–2.2 (17 CS ≈ ×2) |
| Advance Wars | 4 stars | **×1.67 max** (casual end) |
| EU4 | mountain -2 + river -1 dice | ~×1.4–1.6 (deliberately small; pips dominate) |
| Panzer General | entrenchment 5–8 levels + close-defense swap | ~×2–3 equivalent, ground down by repeated attacks |

**Genre center of mass: ×2–3 for a good defensive position; ×4 for a named
fortress; above ×4 only in edge stacks that the game gives explicit tools to
dismantle.** Casual-facing titles sit lower (×1.5–2); grognard titles higher
(×3–4).

Does any game let per-turn input outweigh terrain+forts? Only HOI4's
doctrine-stacked planning bonus (extreme ~+110% vs a typical ×2.5–4 defensive
stack) even approaches parity, and it (a) takes weeks of in-game preparation,
(b) evaporates on contact/decays in use, and (c) is widely regarded as an
exploit archetype. Everywhere else the lever is strictly smaller: AW CO powers
×1.1–1.5 vs terrain ×1.67, UoC CP is an action count not a multiplier, classic
CRTs have no lever at all (the attacker's "input" is concentration, i.e.
substance). **The working hypothesis is confirmed as genre law, and the one
counterexample is the cautionary tale.**

---

## Upset bounding

Can 10:1 material disadvantage win? Across the genre: **no game lets
multipliers alone reverse 10:1 in open battle — but every game lets it hold,
delay, and bleed the attacker through frontage.**

- **Multiplier arithmetic**: max static defense ≈ ×4 turns 10:1 into 2.5:1 —
  still a clear attacker win in every surveyed system. Multipliers buy time
  and casualties, not victory.
- **Frontage is the real equalizer**: combat width / 1-unit-per-tile /
  stacking limits mean the local fight at a mountain pass is ~1:1 regardless
  of national totals. Thermopylae is implemented as a *width* mechanic, never
  as a multiplier. The 10:1 side wins by going around, encircling (HOI4
  multi-direction width bonus), or accepting a long attrition clock — all of
  which are interesting decisions.
- **Attrition asymmetries keep small defenders relevant**: AW's mandatory
  counterattack + attacker-HP damage gating; UoC's suppression (attacks
  degrade before they kill); CRT Exchange results (winning costs steps);
  Civ city HP as a multi-turn clock.
- **Anti-turtle guarantees**: the same games bound the defender's side of the
  upset — entrenchment strips per attack received (PG -1/attack, UoC breach on
  2 KIA), forts are bombable (HOI4), engineers cancel shifts (UoC), supply
  starves the surrounded (UoC's real kill mechanism), stackwipes annihilate
  hopeless stands (EU4). **Every fortification in the survey is damageable or
  bypassable; our "fortification ×1–3 damageable" matches unanimously.**

---

## Fun-vs-realism divergences

Conventions that exist for legibility/fun, flagged against military OR:

- **The 3:1 rule is real; ×4 fortresses exaggerate it.** Classic military
  planning attributes ~×1.3–1.5 advantage to a hasty defense and ~×3 to
  prepared fortifications (the "3:1 rule"). Genre multipliers of ×2–3 track
  this well; Third Reich's ×4 and HOI4's fort-10 walls overshoot for drama and
  strategic signposting ("this hex is a campaign objective, not a fight").
- **Linear ratios instead of Lanchester.** OR says concentration compounds
  (square law); games use linear ratios or additive percentages because
  players can compute them in-head. UoC and Civ 6 secretly restore
  multiplicative behavior via log-space addition — the standout trick of this
  survey: **players add small integers; the engine multiplies.**
- **Round numbers over measured effects**: doubled/tripled defense, 10% per
  terrain star, +25% per Civ terrain class. Nobody models woods as +37%.
  Legibility demands coarse steps — supports a small set of named multiplier
  tiers over continuous values.
- **Overkill caps** (CRT top column, AW damage floors/ceilings) waste excess
  force on purpose, to reward spreading out — unrealistic, good pacing.
- **Bounded pseudo-noise reads as deterministic** (AW 0–9% luck, UoC single
  σ=1 resample, Civ 6's 0.8–1.2 roll). Fully deterministic resolution (our
  plan) is *rarer than its reputation* — most "low-luck" classics keep a small
  bounded noise band for replay texture. A deterministic threshold with graded
  margin is defensible, but consider whether margin granularity supplies the
  texture that noise supplies elsewhere.
- **Defense-always-counterattacks** (AW) and morale-not-death (Total War) are
  anti-realistic conventions that make defense feel active — worth remembering
  when tuning how a losing defender "pays back" the attacker in our margin
  bands.
- **EU4's leadership-beats-terrain** (±6 pips vs -2 terrain) is a deliberate
  character-drama choice, an outlier the rest of the genre does not follow.

---

## Recommended ranges

Verdict on the hypothesized ranges, with adjustments:

| Factor | Hypothesis | Verdict | Recommendation |
|---|---|---|---|
| Commitment lever | ×1–2 saturating | **Consistent, top end generous** | Keep saturating shape; put the practical knee at **×1.5**, reserve ×1.75–2 for expensive/decaying full commitment (mirrors AW charge-burst and HOI4 planning decay). Never let it exceed a single terrain tier's worth of swing per turn of extra attention. |
| Terrain | ×1–3 | **Consistent** | Use coarse named tiers (~×1.5 rough / ×2 strong / ×3 extreme) — genre precedent is 3–5 legible steps, not a continuum. ×3 should be rare, signposted terrain. |
| Fortification | ×1–3 damageable | **Consistent; damageable is unanimous genre law** | Keep. Add an explicit degradation rule (per-assault chip à la PG/UoC, or bombard/siege action à la HOI4) so the counter is a visible player verb. |
| Terrain × Fortification combined | (implied ×9 max) | **Exceeds genre ceiling (~×4)** | Cap the combined static product at **~×4** (fortress-in-mountains), via soft cap or sub-multiplicative stacking. Alternatively route part of fortification into the EU4/Total War channel: time-tax and access-gate rather than combat multiplier. |
| Quality | tech-paced | **Consistent** | Calibrate to Panzer Corps 2: ~+10% per earned tier, **×1.5 ceiling** (×2 only for extreme elite-vs-rabble). Slow acquisition is the genre norm. |
| Substance | unbounded but slow | **Consistent only with a frontage throttle** | Add a per-province engagement cap tied to terrain (the mountain pass admits less than the plain). Keep the numeric spread modest (~±15–25% around baseline, per HOI4 precedent) since it multiplies with the terrain defense bonus. Excess substance becomes reserves/follow-up, not wasted. |
| R thresholds | deterministic, graded margin | **Shape consistent** | Genre-meaningful band is ~1:3 to 6:1 — saturate outcomes beyond it (CRT top-column convention). Consider log-spaced margin bands (UoC's 3·log₃ is the proven schema: equal-feeling steps, multiplicative reality). |

One structural adoption worth stealing outright: **express all multipliers
internally as log-space integer shifts** (UoC/Civ 6 pattern). The player sees
"+1 terrain, +2 fortress, +1 commitment" adding up; the engine multiplies
×1.4–1.5 per step. This yields legible UI, easy caps (cap the shift sum), and
clean margin bands from the same scale.

---

## Sources

Web-verified (research agents, 2026-07-02):

- Combat results table — Wikipedia: https://en.wikipedia.org/wiki/Combat_results_table
- Rise and Decline of the Third Reich — Wikipedia (defense doubling/tripling, fortress ×4): https://en.wikipedia.org/wiki/Rise_and_Decline_of_the_Third_Reich
- Panzerblitz CRT column-shift discussion: http://chuckgame.blogspot.com/2012/10/wargame-wednesdays-combat-results-table.html
- ASL rules summary (TEM as DRM, CC odds table): https://asl-players.net/downloads/asl-rules-summary.pdf
- Memoir '44 dice tables (non-CRT contrast): https://boardgamegeek.com/filepage/42000/memoir-44-dice-probability-tables
- Panzer General manual (entrenchment levels): https://panzermarshal.com/manual.pdf
- Panzer Corps 2 experience system: https://panzercorps.fandom.com/wiki/Experience
- Unity of Command 1 manual: https://cdn.akamai.steamstatic.com/steam/apps/218090/manuals/UoC%20Manual.pdf
- Unity of Command II manual rev. 9: https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/809230/manuals/Manual_-_Unity_of_Command_II_-_Revision_9.pdf
- UoC2 odds/CRT forum derivation: https://unityofcommand.net/forums/viewtopic.php?t=2758
- UoC2 combat-loss prediction guide: https://steamcommunity.com/sharedfiles/filedetails/?id=3531112829
- UoC2 HQ command points: https://steamcommunity.com/app/809230/discussions/0/2962768084997484064/
- Civ 5 combat bonuses: https://civilization.fandom.com/wiki/Combat_(Civ5) ; https://www.carlsguides.com/strategy/civilization5/war/combatbonuses.php
- Civ 5 city strength: https://forums.civfanatics.com/threads/how-city-strength-is-calculated-in-detail.520619/
- Civ 6 combat formula (per-point ×1.041): https://forums.civfanatics.com/threads/hans-lemurson-figures-out-the-combat-formula.606147/ ; https://www.realmsbeyond.net/forums/showthread.php?tid=8515
- Civ 6 fortify values: https://forums.civfanatics.com/threads/fortify-combat-strength-bonus-is-3-6.620681/
- Total War charge bonus / leadership: https://totalwarwarhammer.fandom.com/wiki/Charge_Bonus ; https://totalwarwarhammer.fandom.com/wiki/Leadership
- Total War sieges: https://totalwar.fandom.com/wiki/Siege
- Medieval: Total War morale table: https://forums.totalwar.org/wiki/index.php/MTW_Morale
- Advance Wars damage formula: https://www.warsworldnews.com/wp/aw/game-aw/battle-mechanics/ ; https://advancewars.fandom.com/wiki/Damage_Formula
- Advance Wars terrain stars: https://www.warsworldnews.com/wp/sfw/game-sfw/terrain-guide/
- AWBW CO chart (power magnitudes): https://awbw.amarriner.com/co.php
- Advance Wars luck: https://advancewars.fandom.com/wiki/Luck

Knowledge-based, marked (approx.) in text — re-verify before spec citation:

- HOI4 terrain/forts/entrenchment/planning/width: hoi4.paradoxwikis.com — Terrain, Land_battle, Land_combat_tactics pages
- EU4 dice/terrain/pips/forts: eu4.paradoxwikis.com — Land_warfare, Fort pages
