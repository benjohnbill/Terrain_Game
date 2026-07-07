# Manpower Pool Conventions in Strategy Games — register:cap Ratio Survey

- **Status**: RESEARCH (evidence layer — input to a seal, never normative on its own)
- **Date**: 2026-07-07
- **Purpose**: Size `registerPerPop` relative to the sealed sustained-force constant.

## Context

Terrain Game derives a realm's sustainable standing-force ceiling from land:
`cap = 600 men per populationValue point`. This survey sizes a second constant,
`registerPerPop`: the TOTAL lifetime draftable bodies per pop point for one
match (a compressed deciding-war arc, 15-25 turns / 30-40 min — a LoL-style
match, not a campaign). The register is total-bodies accounting: the starting
army is already drawn from it, and only deaths shrink it permanently (dead
never return within a match). The question: what RANGE for the ratio
`register : cap` (total mobilizable ÷ sustained ceiling) do the conventions of
major strategy games support?

Two properties matter for each surveyed game:

1. The ratio of total wartime-mobilizable manpower to the sustained/standing
   force limit.
2. Whether the pool **regenerates** (Terrain Game's register does not — the
   permanent-pool cases are the closest analogs).

---

## 1. Hearts of Iron IV — conscription-law ladder over a finite core population

Source: Hearts of Iron 4 Wiki (Paradox Wikis — official Paradox-hosted,
community-maintained; the de-facto data reference for HOI4):
[Ideas / Laws](https://hoi4.paradoxwikis.com/Ideas),
[Manpower](https://hoi4.paradoxwikis.com/Manpower).

**The register.** Free manpower is "the sum of recruitable populations in all
states the country controls." Recruitable population is a flat percentage of
core population set by the conscription law ladder
([Ideas](https://hoi4.paradoxwikis.com/Ideas)):

| Law | Recruitable population |
|---|---|
| Disarmed Nation | 1.0% |
| Volunteer Only (default) | 1.5% |
| Limited Conscription | 2.5% |
| Extensive Conscription | 5.0% |
| Service by Requirement | 10.0% (with −10% factory/dockyard output) |
| All Adults Serve | 20.0% (−30% output) |
| Scraping the Barrel | 25.0% (−40% output) |

So the maximum register is **25% of core population**, but reaching it costs
escalating economic penalties — the ladder is a staged register release, priced
in political power and industry.

**Pool vs deployed forces.** There is no separate standing-force limit; the
deployed army is bounded by the manpower pool itself plus equipment/supply
economics. Training new divisions is restricted to "75% of the manpower in the
field or 100000, whichever is higher"
([Manpower](https://hoi4.paradoxwikis.com/Manpower)).

**Attrition ledger.** Combat casualties are removed from unit manpower
instantly; an overrun/encircled division returns only 20% of its remaining
manpower, the rest is lost. Divisions reinforce from the free pool in 10%
increments ([Manpower](https://hoi4.paradoxwikis.com/Manpower)).

**Regeneration.** Only "a small amount" of recruitable population accrues from
monthly population growth; the meaningful in-war increases come from changing
laws or taking territory ([Manpower](https://hoi4.paradoxwikis.com/Manpower)).
**Within a single war the pool is effectively finite** — HOI4 is functionally a
permanent-pool design across one deciding war, which makes it a strong analog.

**Ratio reading.** Peacetime baseline laws (1.5-2.5%) vs practical wartime laws
(5-10%) give a wartime register of **~2-7x** the peacetime manpower base;
against the desperation ceiling (25%) the full ladder spans **~10-17x** the
volunteer baseline. Read as "total register ÷ comfortable standing force," HOI4
conventions support roughly **2x-7x normally, up to ~10x at maximum
desperation with severe economic penalties**.

---

## 2. Europa Universalis IV — regenerating pool vs force limit (FLAGGED: regenerates)

Source: Europa Universalis 4 Wiki (Paradox Wikis, community-maintained
de-facto data reference; sections cite game files
`common/static_modifiers/00_static_modifiers.txt`):
[Manpower](https://eu4.paradoxwikis.com/Manpower),
[Force limit](https://eu4.paradoxwikis.com/Force_limit),
[Army](https://eu4.paradoxwikis.com/Army).

**Pool.** Maximum manpower = 10,000-man national base + Σ province manpower;
province base manpower is **250 men per level of military development**,
scaled by local/national modifiers and reduced by local autonomy
([Manpower](https://eu4.paradoxwikis.com/Manpower)).

**Ceiling.** Land force limit = base +6 regiments for every nation + **+0.1
regiment per development** (all three dev types, autonomy-reduced), plus
building/government modifiers ([Force limit](https://eu4.paradoxwikis.com/Force_limit)).
A regiment is 1,000 men ([Army](https://eu4.paradoxwikis.com/Army)), so
development yields ~100 force-limit men per dev point. Force limit is soft —
exceeding it multiplies maintenance ([Force limit](https://eu4.paradoxwikis.com/Force_limit)).

**Ratio arithmetic.** Manpower counts only military dev (250/mil dev), force
limit counts total dev (100 men/dev). For evenly split development, per-dev
manpower ≈ 83 men vs 100 force-limit men → **static pool ≈ 0.8x force limit**
for large realms, rising toward **~1.7x** for small base-dominated nations
(10,000 pool vs 6,000-man base force limit).

**FLAG — the pool regenerates.** Manpower refills at max/120 per month — zero
to full in a base 10 years ([Manpower](https://eu4.paradoxwikis.com/Manpower)).
Over a typical multi-year war the effective register is the static pool plus
substantial regeneration: a 5-year war adds ~50% of max back, putting the
lifetime register at roughly **1.2x-2.5x force limit**. EU4 wars are won on
manpower-recovery attrition races, not a fixed ledger — it is NOT a
permanent-pool analog, and its low static ratio (≈1x) only works because
regeneration exists.

---

## 3. Imperator: Rome — pops → levies + manpower stock (semi-permanent: pops can die)

Source: Imperator Wiki (Paradox Wikis, community-maintained de-facto data
reference): [Manpower/State](https://imperator.paradoxwikis.com/Manpower),
[Levies/Army](https://imperator.paradoxwikis.com/Levies).

**Pool.** Manpower is produced yearly by pops: citizen +2, freeman +4,
tribesman +3 per pop per year (happiness-scaled), plus a +125 national base.
**Maximum manpower = 11x yearly production**; a depleted pool refills at
1/132 per month, i.e. **11 years to full**
([Manpower](https://imperator.paradoxwikis.com/Manpower)).

**Field force.** Levies raise a base of **7.5% of free integrated-culture
pops**; every raised pop becomes one **500-man cohort**
([Levies](https://imperator.paradoxwikis.com/Levies)). Raising levies costs no
manpower, but reinforcing them (and recruiting legion cohorts, at 500 manpower
each) draws from the pool.

**Permanent element.** "If a levy cohort is overrun or destroyed in battle,
there is also a chance that its associated pop will be killed"
([Levies](https://imperator.paradoxwikis.com/Levies)) — battle deaths can
permanently shrink the recruitment base. This is the Paradox title closest to
"dead never return."

**Ratio arithmetic.** For a freeman-dominated realm of P eligible pops:
full levy ≈ 0.075P cohorts x 500 = **37.5P men** in the field; max manpower
stock ≈ 44P men (4/yr x 11). Lifetime bodies ≈ levy + pool ≈ 81.5P men →
**register ≈ 2.2x the sustained field force** before (slow, 11-year-scale)
regeneration. Roughly: the reinforcement stock is about the same size as the
army it backs.

---

## 4. Crusader Kings III — abstract regenerating levies (weak analog)

Source: Crusader Kings III Wiki (Paradox Wikis, community-maintained de-facto
data reference): [Army/Levy](https://ck3.paradoxwikis.com/Army).

CK3 simulates no population; levy numbers "are determined by the holdings of
the ruler's domain, as well as any that are given by their vassals and Realm
Priest" — i.e. buildings and development, not a census
([Army](https://ck3.paradoxwikis.com/Army)). Levies reinforce from nothing at
a Levy Reinforcement Rate (modified by ruler Martial, marshal task,
buildings); men-at-arms regiments reinforce at 10% of maximum size per month
([Army](https://ck3.paradoxwikis.com/Army)). There is **no finite body
ledger** — lifetime mobilizable bodies are unbounded over time, and the real
constraint is gold/time. Ratio: effectively **∞ (rate-limited)**. Included for
completeness; not a sizing precedent.

---

## 5. Total War series — from population-drain (Rome 1) to abstract slot pools

Sources: TWC Wiki (Total War Center — the long-standing community data
reference for classic Total War):
[Population](https://wiki.twcenter.net/index.php?title=Population); community
mechanics threads: [Effects of Recruitment on Population
(twcenter)](https://www.twcenter.net/threads/effects-of-recruitment-on-population.568332/),
[Recruitment slots vs replenishment (official CA
forum)](https://forums.totalwar.com/discussion/135581/recruitment-slots-vs-replenishment);
Divide et Impera mod documentation (primary source for the mod):
[Population System](https://divideetimperamod.com/population/).

**Rome: Total War (2004) — true permanent-ish pool.** Recruiting a unit
removes those soldiers from the settlement's population, and recruitment is
blocked below a minimum population floor (~500)
([twcenter thread](https://www.twcenter.net/threads/effects-of-recruitment-on-population.568332/);
[TWC Wiki Population](https://wiki.twcenter.net/index.php?title=Population)).
The register is, in principle, nearly the **entire settlement population**
(ratio to any standing army: order of 10x+), throttled per-turn by recruitment
slots and replenished only by ordinary population growth. Players routinely
mine population for armies faster than it regrows — the canonical
"recruitment permanently drains the land" design.

**Medieval II: Total War (2006) — regenerating building pools.** Each barracks
tier grants a unit pool (e.g. up to 3 of a unit) that refills on a timer;
"recruiting does not lower the population"
([TWC Wiki Population](https://wiki.twcenter.net/index.php?title=Population)).
Register unbounded over time; rate-limited, not ledger-limited.

**Rome II / Attila / Three Kingdoms (2013+) — abstract slots + %
replenishment.** Vanilla titles use per-province recruitment slots and
percentage-based unit replenishment with no population ledger
([CA forum](https://forums.totalwar.com/discussion/135581/recruitment-slots-vs-replenishment)).
The Divide et Impera overhaul mod re-introduces population classes that
recruitment consumes ([DeI Population System](https://divideetimperamod.com/population/))
— community demand for exactly the finite-register feel Terrain Game is
building.

---

## 6. Dominions 5/6 — population as a destructible economic base

Source: illwiki (the Dominions community wiki — the de-facto data reference;
not affiliated with Illwinter): [Population (Dom5)](https://illwiki.com/dom5/population),
[Provinces (Dom6)](https://illwiki.com/dom5/dom6/provinces). Primary source
also exists: [Dominions 6 manual (Illwinter)](http://ulm.illwinter.com/dom6/dom6manual.pdf).

**Recruitment flow, not stock.** Per-province recruitment points per turn are
population-derived: 1 RP per 100 pop up to 5,000 pop, then 1 per 200 pop to
10,000, then 1 per 400, modified by fort recruitment bonus and Order scale
(+10% RP per Order tick) ([illwiki Population](https://illwiki.com/dom5/population)).
Recruiting units does **not** deplete population — the constraint is the
per-turn RP flow plus gold upkeep and supply.

**But population itself is finite and destructible.** Population "can go up
and down as the game progresses," decreasing from pillaging, raiding, hostile
magic, blood hunting, unrest, bad events, and the Death scale (−0.2%/turn;
Growth is +0.2%/turn) ([illwiki Provinces (Dom6)](https://illwiki.com/dom5/dom6/provinces),
[illwiki Population](https://illwiki.com/dom5/population)). Destroyed
population never meaningfully returns on a match timescale — Dominions is the
"the land itself is the ledger, and it can be permanently burned down" case:
the enemy shrinks your register by attacking the territory, not the army.

**Ratio reading.** No fixed register:cap ratio exists (flow model), but the
design intent matches Terrain Game's: sustained force ceiling = economy
(gold/supply), total mobilizable = an exhaustible territorial base.

---

## 7. Operational wargames — explicit finite manpower ledgers

**Gary Grigsby's War in the East 2** (source: the official living rules,
hosted mirror): [Section 28 Production](https://www.dornshuld.com/rules/wite2/28-0.html),
[Section 26 Replacements](https://dornshuld.com/rules/wite2/26-0.html).
Manpower is produced by population centers ("manpower factories"); **one
manpower point = 50,000 people**. Losses run through an explicit ledger:
~25% of manpower/equipment from damaged elements returns to transit pools per
turn, and of damaged-element manpower only 60% reaches the transit pool — 40%
goes to a disabled pool. Denying the enemy population centers permanently
reduces their manpower generation; the classic Axis strategy is explicitly to
"take population centers to deny manpower to the USSR." A war-long, mostly
one-way manpower budget tied to territory — a strong permanent-pool analog at
the operational scale.

**Shadow Empire** (VR Designs; source: [developer design
notes](https://www.vrdesigns.net/?p=2213), [Matrix Games product
page](https://www.matrixgames.com/game/shadow-empire)): military units are
built and reinforced from a **Recruits pool** drawn from the population of
owned zones; population is a slow-moving, migration-sensitive base, so the
recruit budget is effectively territorial and scarce on campaign timescales.

**Unity of Command I/II** (source: [official site](https://unityofcommand.net/)):
the opposite pole — no manpower ledger at all; scarcity is enforced through
supply lines and scenario turn limits. Included as the boundary case: a
compressed deciding-war window can also work with zero register, but only
because scenarios are short and forces are pre-set — which is precisely what
Terrain Game's register replaces with a player-owned budget.

---

## Synthesis table

Ratios are (total lifetime mobilizable bodies) ÷ (sustained/standing force
ceiling), normalized as men where the game allows it.

| Game | register : cap ratio | Pool regenerates? | Draftable fraction of total population |
|---|---|---|---|
| **HOI IV** | ~2-7x (wartime laws vs peacetime baseline); ~10-17x at desperation ceiling | Effectively **no** within one war (only slow pop growth; law changes are the real lever) | 1% → 25% of core population by law ladder |
| **EU4** | ~0.8-1.7x static; ~1.2-2.5x over a war **with** regen | **Yes** — full refill in base 10 years (max/120 per month) | Abstract (250 men per mil dev, not a census) |
| **Imperator: Rome** | ~2.2x (max manpower stock + raised levy vs the levy) | **Yes**, slowly — 11 years to full; but levy-pop deaths are permanent | 7.5% of free integrated pops as levy, each pop = 500-man cohort |
| **CK3** | Effectively ∞ (rate-limited, no ledger) | **Yes** — levy reinforcement rate; MAA 10%/month | N/A — no simulated population |
| **Rome: Total War 1** | ~10x+ (nearly whole settlement population above a ~500 floor) | Only via ordinary population growth — recruitment permanently drains pop | Approaching 100% of settlement population, slot/turn-throttled |
| **Medieval 2 / Rome 2 / 3K** | Effectively ∞ (regenerating building/slot pools) | **Yes** — timed pool refill, % replenishment | N/A — recruitment does not touch population |
| **Dominions 5/6** | No fixed ratio (RP flow ~1 per 100 pop/turn); base itself is destructible | Population: ±0.2%/turn scales; destruction (pillage, blood hunt, magic) is effectively permanent | Flow model; ~1% of pop per province per turn as RP |
| **War in the East 2** | War-long finite budget tied to held population centers | Generated monthly from pop centers, but lost centers = permanently lost generation; 40% of damaged-element manpower goes disabled | 1 manpower point = 50,000 people; territorial |
| **Unity of Command** | 0 (no register — supply-and-turn-limit scarcity only) | N/A | N/A |

## Recommendation bracket

**Supported range: register : cap ≈ 1.5x - 5x. Recommended bracket: 2x - 4x,
sweet spot 2.5x - 3x → `registerPerPop` ≈ 1,200-2,400, center ~1,500-1,800
men per pop point** (against the sealed `cap = 600`).

Reasoning from the conventions:

- **Static-pool grand strategy clusters at 1-2.5x** (EU4 ≈ 0.8-1.7x static,
  Imperator ≈ 2.2x) — but both *regenerate*, and EU4's ≈1x only functions
  because of its 10-year refill. A non-regenerating design must sit **above**
  EU4's static ratio or the starting army effectively IS the register and one
  lost field battle ends force generation.
- **HOI4 — the best single-war analog (quasi-permanent pool + escalation
  ladder) — supports 2-7x** as the normal wartime span, with ~10x reachable
  only at economy-wrecking desperation. If Terrain Game later wants an
  escalation mechanic (a Scraping-the-Barrel dial), the register should start
  in the 2-3x band with headroom, not at the ceiling.
- **True permanent-pool designs (Rome 1, Dominions, WitE) push the raw ratio
  high (≈10x+ of any single army)** but throttle per-turn intake and make the
  base itself attackable. Their lesson is less "make the register huge" and
  more "the ceiling should be economic while the register is territorial" —
  which Terrain Game already has via cap-from-land. Matching their raw ratio
  inside a 15-25 turn match would make deaths nearly costless.
- **Match-window arithmetic**: at 2x, a player can lose one full cap-sized
  army and rebuild to cap exactly once — brutal, every death visible. At 3x,
  two full rebuilds — attritional wars stay winnable but blood remains a
  currency. At 5x+, a 15-25 turn match cannot plausibly spend the register,
  and permanent death stops being legible (violating blood-as-permanent-
  currency). Below ~1.5x, the register is a rounding error on the starting
  army and the mechanic disappears.

**Closest analogs to a permanent-pool deciding-war window** (in order):
Hearts of Iron IV within a single war (finite core-population register,
conscription ladder, one-way casualty ledger); War in the East (territorial
manpower budget with permanent denial); Rome: Total War 1 (recruitment
permanently drains the land); Imperator's levy-pop death (battle losses
shrink the base). EU4/CK3/modern Total War are rate-model counterexamples —
cite them for the ceiling side (force limit as economic soft cap), not for
sizing the register.

## Source quality notes

- Paradox Wikis (hoi4/eu4/imperator/ck3.paradoxwikis.com) are official
  Paradox-hosted but community-maintained; the EU4 pages cite game files
  (`common/static_modifiers/00_static_modifiers.txt`) directly. Treated as
  de-facto data references, attributed as community wikis.
- illwiki.com is the Dominions community wiki (explicitly unaffiliated with
  Illwinter); the Illwinter manual PDF is linked as the primary source.
- WitE2 numbers come from the official living rules text (dornshuld.com
  mirror of the Matrix Games rules).
- Total War classic-title mechanics rest on TWC Wiki and community forum
  threads — the weakest tier used here; flagged accordingly. Rome 1's
  population-drain mechanic is corroborated across multiple independent
  threads.
