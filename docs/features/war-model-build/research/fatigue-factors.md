# Fatigue-Curve Modifier Candidates: Evidence Survey

Research compiled 2026-07-13 as a slice-2 design input for the war-model-build
fatigue system (grill session, agenda 3). Four candidate modifiers to the
sealed fatigue spine (linear per-hex march wear + battle fatigue + supply
ledger) were held for evidence: **forced-march toggle (강행군)**,
**terrain-weighted wear (지형 가중 마모)**, **season/winter (계절/겨울)**, and
**camp-tier recovery (주둔지 등급)**.

Evidence layer only (documentation law): this survey is an input to a user
decision, never normative on its own. Recommendations in the verdict table are
advisory. Sources cited inline; full list at the end.

The double-taxation checks (column "already taxed by") are made against the
grill-sealed two-ledger design: march/battle ledger (effectiveness only,
floored, cannot kill) + supply ledger (starvation stages, death conversion),
recovery as a function of supply state, ADR 0015 crossing penalties as event
taxes, and terrain priced through movement slowness.

---

## Summary verdict

1. **Forced march is the strongest candidate.** It is historically real at
   decisive magnitude in both directions (campaigns won by marching speed;
   10–30% of a force lost to straggling without a battle), it is priced by no
   existing system, and every surveyed game that has it treats it as a
   voluntary speed-for-condition trade — exactly the shape the grill proposed.

2. **Terrain weighting, season, and camp tier all route through supply.** In
   the historical record, the catastrophic mountain, winter, and camp losses
   decompose overwhelmingly into supply failure and disease — channels the
   sealed supply ledger and supply-multiplied recovery already own. Modeling
   them as additional fatigue sources would double-tax; the EU4 precedent
   (winter implemented as a supply-limit modifier, not a separate system) is
   the pattern to follow if any of them ever enters.

3. **A legibility pattern recurs in game precedent:** successful fatigue
   systems expose few named bands with modest per-band penalties (Total War:
   ~5–20% per stat), even when the underlying meter is fine-grained. Supports
   the named-threshold reading of the fatigue gauge.

---

## Candidate 1 — Forced-march toggle (강행군)

### Historical weight: HIGH, in both directions

- **Speed wins campaigns.** Ulm 1805: the Grande Armée's march from the
  Rhine encircled Mack's army almost without a major battle; Davout's corps
  covered 110 km in 48 hours ([Ulm campaign, Wikipedia](https://en.wikipedia.org/wiki/Ulm_campaign);
  [World History Encyclopedia](https://www.worldhistory.org/article/2249/ulm-campaign/)).
  Jackson's "foot cavalry" marched 140 miles in a week in the 1862 Valley
  pursuit ([American Battlefield Trust](https://www.battlefields.org/learn/articles/stonewall-marches-through-shenandoah)).
- **The price is paid in arriving strength, without any battle.** In the same
  Valley pursuit the Confederates lost "hundreds of stragglers," and by June
  observers described the army as "self-destructing from exhaustion and
  exposure" ([Warfare History Network](https://warfarehistorynetwork.com/article/shenandoah-valley-campaign-1862-stonewall-jackson-confounds-yankees/)).
  Lee's Maryland campaign 1862: 55,000 leaving Chantilly became 45,000 within
  ten days of marching (~18%), and only ~37,000 stood on the Antietam firing
  line ([Maryland campaign, Wikipedia](https://en.wikipedia.org/wiki/Maryland_campaign);
  [HistoryNet on straggling](https://historynet.com/cowards-of-the-army-straggling-in-the-civil-war.htm)).
- Straggler mass could exceed combatant mass at the extreme: by November 1812
  the Grande Armée counted ~8,000 combatants against ~40,000 stragglers
  ([French invasion of Russia, Wikipedia](https://en.wikipedia.org/wiki/French_invasion_of_Russia)).

### Game precedent: common, always a voluntary trade

- Total War's **March stance** makes units start the ensuing battle below
  full vigour — the "arrive worn" grammar exactly
  ([TW:W fatigue wiki](https://totalwarwarhammer.fandom.com/wiki/Fatigue)).
- Supremacy 1914's Forced March: +50% speed for continuous unit damage while
  active ([Supremacy 1914 help](https://bytro.helpshift.com/hc/en/3-supremacy-1914/faq/127-what-is-forced-march/)).
- Paradox titles carry forced-march options and long-running balance debate
  ("Forced March way too easy" threads) — the trade is engaging enough to
  argue about, a positive fun signal
  ([Paradox forums](https://forum.paradoxplaza.com/forum/threads/forced-march-way-too-easy.1197286/page-2)).

### Already taxed by: nothing

Movement rate is currently flat per terrain class; no system prices voluntary
extra speed. A fatigue surcharge on a chosen extra-movement toggle is a new
tax on a new event.

### Design cost: LOW

One player-facing toggle, one dial (fatigue surcharge per extra hex), no new
state beyond the already-sealed ledger. Bot use of the toggle belongs to the
opportunism-read design (agenda 1).

---

## Candidate 2 — Terrain-weighted wear (지형 가중 마모)

### Historical weight: high headline, but decomposes into other channels

- Suvorov's 1799 Alpine campaign: of ~21,000 setting out, ~15,000 remained
  (5,000 of them badly wounded) — ~29% gross loss, with broader estimates near
  half the force across the expedition
  ([Suvorov's Swiss campaign, Wikipedia](https://en.wikipedia.org/wiki/Suvorov%27s_Swiss_campaign);
  [Swiss National Museum blog](https://blog.nationalmuseum.ch/en/2018/08/suvorov-an-offensive-goes-awry-in-the-high-mountains/)).
  The recorded mechanism, however, is dominated by **supply collapse**
  (rations halved then quartered, soldiers eating hides and candles, mules
  lost, all mountain guns abandoned) plus weather and combat in defiles — not
  a per-kilometer "mountain hexes tire more" residual.
- Hannibal's Alps crossing is the classical analogue (force roughly halved),
  cited in the same literature as a supply-and-weather catastrophe.

### Game precedent: terrain attrition exists, but as a supply proxy

EU4 land attrition fires when an army exceeds a province's **supply limit**
(terrain attrition capped at 5%/month), and CK3/HOI4 attrition rises in rough
terrain largely as a logistics proxy
([EU4 discussions](https://steamcommunity.com/app/236850/discussions/0/361798516950061113/);
[CK3 wiki, Attrition](https://ck3.paradoxwikis.com/Attrition);
[HOI4 wiki, Attrition and accidents](https://hoi4.paradoxwikis.com/index.php?title=Attrition_and_accidents)).
These systems also make attrition kill substance — a choice the two-ledger
design deliberately rejects for the march ledger.

### Already taxed by: movement slowness + supply ledger + ADR 0015

Mountain/pass paths already cost more turns per distance (more turns of supply
exposure and defender reaction time); crossing events are taxed by ADR 0015;
supply failure in rough country is the supply ledger's core case. A separate
per-hex terrain wear weight would tax the same ground twice.

### Design cost: LOW to add, HIGH to keep honest

The dial itself is trivial, but every measurement of the parity surface would
need a terrain-mix control forever after.

---

## Candidate 3 — Season/winter (계절/겨울)

### Historical weight: real, but the popular attribution is wrong

- 1812: Napoleon lost ~80,000 to typhus and dysentery **one month in, at
  midsummer**; by Smolensk (25 August) 105,000 of the central 265,000 were
  gone; over half the Grande Armée was lost **during the summer**, before any
  frost ([Montana State, typhus in Russia](https://www.montana.edu/historybug/napoleon/typhus-russia.html);
  [French invasion of Russia, Wikipedia](https://en.wikipedia.org/wiki/French_invasion_of_Russia)).
  Of ~500,000 total campaign casualties the overwhelming majority were disease
  and weather, not battle ([Britannica](https://www.britannica.com/event/French-invasion-of-Russia)).
- Barbarossa: the Wehrmacht had already taken ~734,000 casualties **before
  winter arrived** (by November 1941); the December cold then added frostbite
  waves at ~155,000 dead and wounded in three weeks
  ([National Interest](https://nationalinterest.org/blog/reboot/how-russian-winter-froze-hitlers-nazi-empire-its-tracks-190821);
  [Russian Winter, Wikipedia](https://en.wikipedia.org/wiki/Russian_Winter)).
- Reading: winter is a genuine amplifier, but it acts through the same
  channels the model already has — supply strain and non-battle wastage — and
  the summer versions of those channels were as deadly.

### Game precedent: implement through supply, not beside it

EU4 implements winter as a **supply-limit reduction** (winter severity lowers
supply, which raises attrition) — no separate winter meter
([Paradox forum, attrition and supply](https://forum.paradoxplaza.com/forum/threads/attrition-and-supply.1089434/)).
HOI4 tracks province temperature into attrition/movement/offense modifiers and
deliberately slowed weather variation for predictability and legibility
([HOI4 dev diary 28, Weather & Terrain](https://forum.paradoxplaza.com/forum/threads/hearts-of-iron-iv-28th-development-diary-weather-terrain.885969/);
[HOI4 wiki, Weather](https://hoi4.paradoxwikis.com/Weather)).

### Already taxed by: no season system exists to tax anything

Terrain Game has no season/calendar system. Opening one from the fatigue side
inverts the dependency (tail wags dog). If seasons ever enter, the EU4 pattern
— season modulates supply capacity, supply ledger does the rest — adds zero
new fatigue rules.

### Design cost: HIGH (requires a whole new world system)

---

## Candidate 4 — Camp-tier recovery (주둔지 등급)

### Historical weight: high, but the variable is supply/sanitation, not walls

- Where an army rested decided whether it melted: American Civil War disease
  killed ~2 men for every battle death (earlier American wars ~5:1), and many
  regiments lost more men to camp sickness in their first three months than to
  their bloodiest battle day
  ([History Collection](https://historycollection.com/ultimate-civil-war/);
  [Hektoen International](https://hekint.org/2022/03/31/infectious-diseases-in-the-civil-war/)).
- Crimean War: ~95,000 of ~155,000 allied deaths were disease; in one winter
  9,000 troops were fit while 23,000 lay sick
  ([Science Museum](https://www.sciencemuseum.org.uk/objects-and-stories/medicine/sickness-ranks);
  [Nightingale statistics](https://cwfn.uoguelph.ca/short-papers-excerpts/nightingale-statistics-and-the-crimean-war/)).
- The discriminating variable in this record is supply, provisioning, and
  sanitation quality — for which settlement tier is mostly a proxy. A city IS
  stable supply.

### Game precedent: recovery differentials exist but are supply/territory-keyed

Total War recovers vigour by standing still at a uniform rate
([TW:W fatigue wiki](https://totalwarwarhammer.fandom.com/wiki/Fatigue));
Paradox replenishment runs faster in friendly, high-supply territory — again a
supply key, not a settlement-tier key.

### Already taxed by: the sealed supply-multiplied recovery (Q4)

The grill already sealed recovery as a function of supply state (steady supply
multiplies recovery; interdiction zeroes it and pumps the starvation ledger).
A separate camp-tier dial would re-price the same thing. The open
stationary-requirement question lives in the same drawer.

### Design cost: LOW as a dial, redundant in effect

---

## Verdict table (advisory — final decision is the user's)

| 요인 | 역사 무게 | 이미 과세하는 시스템 | 설계 비용 | 권고 |
|---|---|---|---|---|
| 강행군 (forced-march toggle) | HIGH — campaigns won by pace; 10–30% force loss to straggling without battle (Ulm, Valley, Maryland) | none — voluntary extra speed is unpriced | LOW (1 toggle + 1 dial on existing ledger) | **채택** (shape in slice 2; magnitude later) |
| 지형 가중 마모 (terrain-weighted wear) | headline HIGH but decomposes into supply/weather/combat (Suvorov, Hannibal) | movement slowness + supply ledger + ADR 0015 event taxes | LOW to add, HIGH to keep measurable | **기각** (as separate wear weight; rough-terrain supply capacity is the right future home) |
| 계절/겨울 (season/winter) | real amplifier, but misattributed — summer disease/straggling equally deadly (1812, Barbarossa) | would require a nonexistent season system; acts through supply | HIGH (new world system) | **보류** (future drawer; if adopted, implement as supply modulator per EU4 pattern) |
| 주둔지 등급 (camp-tier recovery) | HIGH via disease/supply channel (ACW 2:1, Crimea 95k/155k) — tier is a proxy for supply | Q4 supply-multiplied recovery | LOW but redundant | **기각/보류** (fold into supply-recovery; revisit only if measurement shows recovery illegibility) |

---

## Cross-cutting observation: legibility pattern in fatigue UIs

Total War exposes fatigue as six named bands (Fresh / Active / Winded / Tired /
Very tired / Exhausted) with modest per-band penalties (melee attack −5% /
−10% / −20% / −20%; leadership and speed similar), while the underlying meter
is a fine-grained integer range (0–36,000)
([TW:W fatigue wiki](https://totalwarwarhammer.fandom.com/wiki/Fatigue);
[CA community answer](https://community.creative-assembly.com/total-war/total-war-warhammer/help/337-are-fatigue-and-melee-attack-penalties-values-displayed-as-averages)).
Penalties stack cumulatively per band. This supports the grill's named-band
reading of the fatigue gauge (starvation stages as ledger thresholds) and
suggests per-band effectiveness steps of single-digit to low-double-digit
percent as the legible magnitude range — a magnitude-pass input, not a seal.

---

## Sources

- https://en.wikipedia.org/wiki/French_invasion_of_Russia
- https://www.britannica.com/event/French-invasion-of-Russia
- https://www.montana.edu/historybug/napoleon/typhus-russia.html
- https://en.wikipedia.org/wiki/Russian_Winter
- https://nationalinterest.org/blog/reboot/how-russian-winter-froze-hitlers-nazi-empire-its-tracks-190821
- https://en.wikipedia.org/wiki/Ulm_campaign
- https://www.worldhistory.org/article/2249/ulm-campaign/
- https://en.wikipedia.org/wiki/Maryland_campaign
- https://historynet.com/cowards-of-the-army-straggling-in-the-civil-war.htm
- https://www.battlefields.org/learn/articles/stonewall-marches-through-shenandoah
- https://warfarehistorynetwork.com/article/shenandoah-valley-campaign-1862-stonewall-jackson-confounds-yankees/
- https://en.wikipedia.org/wiki/Suvorov%27s_Swiss_campaign
- https://blog.nationalmuseum.ch/en/2018/08/suvorov-an-offensive-goes-awry-in-the-high-mountains/
- https://historycollection.com/ultimate-civil-war/
- https://hekint.org/2022/03/31/infectious-diseases-in-the-civil-war/
- https://www.sciencemuseum.org.uk/objects-and-stories/medicine/sickness-ranks
- https://cwfn.uoguelph.ca/short-papers-excerpts/nightingale-statistics-and-the-crimean-war/
- https://totalwarwarhammer.fandom.com/wiki/Fatigue
- https://community.creative-assembly.com/total-war/total-war-warhammer/help/337-are-fatigue-and-melee-attack-penalties-values-displayed-as-averages
- https://steamcommunity.com/app/236850/discussions/0/361798516950061113/
- https://forum.paradoxplaza.com/forum/threads/attrition-and-supply.1089434/
- https://ck3.paradoxwikis.com/Attrition
- https://hoi4.paradoxwikis.com/index.php?title=Attrition_and_accidents
- https://hoi4.paradoxwikis.com/Weather
- https://forum.paradoxplaza.com/forum/threads/hearts-of-iron-iv-28th-development-diary-weather-terrain.885969/
- https://bytro.helpshift.com/hc/en/3-supremacy-1914/faq/127-what-is-forced-march/
- https://forum.paradoxplaza.com/forum/threads/forced-march-way-too-easy.1197286/page-2
