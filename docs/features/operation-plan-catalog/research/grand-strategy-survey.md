# External Survey: Grand-Strategy Game Command Vocabularies

Source: research subagent (sonnet), 2026-07-02. Audits the 11-plan roster,
effect axes, and micromanagement budget against HOI4, Total War (campaign),
CK3, and EU4. Raw report below.

---

## 1. Per-game summary

### Hearts of Iron IV
- **Vocabulary**: Front Line (assembly/planning position), Offensive Line (single push objective, chainable into multi-stage sequences), Spearhead (narrow armor breakthrough, army-only), Fallback Line (defensive hold + auto counter-attack), Area Defense/Garrison (spread across VPs/ports/forts, no planning bonus but 3x unit cap), Naval Invasion, Paradrop. Execution stance dial: careful / balanced / aggressive.
- **Effect dims**: planning bonus (%atk/breakthrough, accrues 2%/day stationary, decays 1%/day under AI vs 3%/day under manual override), organization, combat width, occupation compliance/resistance (post-conquest governance, resource/manpower extraction), convoy raiding/interdiction efficiency.
- **Compression**: (a) planning-bonus carrot rewards leaving plans on auto rather than micromanaging; (b) chained offensive lines let a multi-turn operation be authored once and executed in stages; (c) Area Defense collapses "defend everything" into one order with a capacity multiplier instead of per-point orders.

### Total War (campaign layer)
- **Vocabulary**: stances — March (+50% move, no recruit, can't retreat, can't act next turn), Forced March, Ambush (concealed, terrain-dependent success%), Fortify/Encamp (defense+heal+battlefield fortifications+vision, immobile), Raiding (income from surrounding trade/settlements, -defense/-move, hostile but not war-act). Siege vs Assault at settlements; post-victory disposition: Occupy / Sack / Raze / Loot(-Colonize).
- **Effect dims**: movement, replenishment/upkeep, defense rating, visibility/detection, income extraction, settlement level (permanent econ base), diplomatic standing, attrition.
- **Compression**: single-toggle stances bundle many sub-system effects into one click (Fortify = defense+heal+vision+battlefield props at once); post-battle disposition is one immediate decision, no separate governance UI unless the player wants to keep and rebuild.

### Crusader Kings 3
- **Vocabulary**: Siege (implicit — army halts at a fort), Raid Intent dropdown (Pillage / Adventure / Capture / Terrorize / Plunder — same raiding action, different payoff curve), Scorched Earth (self-target, requires control).
- **Effect dims**: county control (-40/-80 on occupy/pillage-legacy), levies, development (permanent, -40 on sack), prestige, dread, gold, supply/attrition (1%/month besieging).
- **Compression**: Raid Intent is a single declarative "purpose" selector rather than exposing mechanical sliders — same action, different narrative/numeric framing chosen up front.

### Europa Universalis 4 (brief)
- **Vocabulary**: Siege (blockade → artillery/naval barrage → storm/assault vs regular attrition siege), Scorched Earth (self-target province malus to raise enemy attrition/siege time), Forced March, War Exhaustion (theater-wide pressure gauge, not sector-level).
- **Effect dims**: devastation (temporary, decays over ~60 months — distinct from permanent development loss), war exhaustion (strategic/theater level, independent of any one battle), attrition, fort defense vs siege-strength ratio (3x fort level rule).
- **Compression**: Storm (fast, costly) vs regular siege (slow, safe) is a two-button binary — directly analogous to Swift Seizure vs Deliberate Pressure, so no gap there.

## 2. Mapping table

| Their intent | ≈ Our plan | Note |
|---|---|---|
| HOI4 Offensive Line / Spearhead | Swift Seizure / Flanking Breakthrough | direct |
| HOI4 pincer via two Spearheads | Encirclement and Annihilation | direct |
| HOI4 Fallback Line / Area Defense | Delaying Defense / Stronghold Defense | direct |
| HOI4 Naval Invasion | Crossing/Landing Securement | direct |
| HOI4 convoy raiding/interdiction | Supply Interdiction | direct |
| TW Assault vs maintain-Siege | Swift Seizure vs Deliberate Pressure | direct |
| TW Fortify (immobile, defense+heal) | Stronghold Defense | direct, close fit |
| EU4 Storm vs regular siege | Swift Seizure vs Deliberate Pressure | direct, confirms design is right |
| TW Raiding stance | **none** | gap — see #1 below |
| TW Ambush stance | **none** | gap — see #4 below |
| TW post-victory Sack/Raze/Loot choice | Recovery/Consolidation (occupy only) | partial — sack/raze uncovered |
| CK3 Raid Intent (all variants) | **none** | gap — see #1 below |
| CK3/EU4 Scorched Earth | Strategic Abandonment (partial) | gap — see #3 below, natural variant |
| HOI4 occupation compliance/resistance | **none** (Recovery/Consolidation is own-sector only) | gap — see #6 below |

## 3. GAPS (ranked)

1. **Raid / plunder without conquest intent** (TW Raiding stance, CK3 Raid Intent). Real-war meaning: live off the land, damage enemy economic base without committing to hold ground. Why used: cheap, low-risk, produces usableValueDamage or resource gain without overextension risk. **MVP verdict: YES.** Fits one-sector-one-turn cleanly — targets usableValueDamage with deliberately no controlShift attempt, low riskProfile. The most concrete missing plan in the roster.
2. **Post-conquest disposition choice (sack/raze vs occupy)**. Real-war meaning: victor chooses immediate extraction/destruction vs slow administrative buildup. Why used: immediate payoff vs long-term control, and denies the enemy a useful base if they retake it. **MVP verdict: later-phase.** Better modeled as a resolution-time choice attached to a successful controlShift, not a new plan — aligns with the existing guardrail that control/economy/population update on different timelines.
3. **Scorched earth (self-target denial)** (CK3 + EU4). Real-war meaning: destroy your own resources so the enemy inherits nothing (Russia 1812, China WWII scorched-earth retreats). Why used: converts an unavoidable loss into an active trade — sacrifice own usableValue to inflict routeDisruption/attrition on the pursuing enemy. **MVP verdict: YES, cheap.** Pairs naturally as a variant/flag on Strategic Abandonment rather than a whole new plan — the usableValueDamage axis currently only frames "damage enemy / build friendly," missing the third polarity of "damage own to deny enemy."
4. **Ambush / concealed defense** (TW Ambush stance). Real-war meaning: concealed force punishes an enemy that commits carelessly into contested ground. Why used: cheap deterrent, converts terrain/concealment into an asymmetric battle result without proactively holding ground. **MVP verdict: later-phase**, gated on fog maturity — ambush is fundamentally "the enemy's estimate of this sector is wrong."
5. **Occupation compliance/resistance building** (HOI4 occupation laws). Real-war meaning: post-conquest counter-insurgency/administration. Why used: makes conquest cost real and reversible. **MVP verdict: later-phase.** Matches the existing design guardrail (control immediate, economy/population/garrison lag) but needs a governance system that doesn't exist yet.
6. **March/Forced March (speed vs readiness trade)** (TW, EU4). **MVP verdict: no** — a meta/capacity-allocation layer concern (moving the divisible pool between sectors), not a sector-targeted operation plan; belongs, if anywhere, in the capacity/surplus-redirect mechanic already defined.
7. **Prestige/dread/political-capital accrual** (CK3). **MVP verdict: no for Phase 1** — flag only if a diplomacy/legitimacy layer is added later.

## 4. Axis check — dimensions they model that our six axes miss

- **Temporary vs permanent economic damage split**: EU4's devastation (decays over ~60 months) vs CK3's sacking (permanent development loss) are two separate stats. Our usableValueDamage currently collapses both into one "permanent weakening" framing — worth sub-typing if raid or scorched earth get added, since both would want the *temporary* variant.
- **Ambient/passive attrition independent of any operation**: sieges and marches bleed strength via logistics/weather/duration in all four games, applied on top of any authored plan's effects. Our model currently only inflicts damage as an operation's direct output, not as a standing background drain operations can be timed against.
- **Theater-level strategic-fatigue gauge** (EU4 war exhaustion): sits above the sector layer entirely; only relevant if a strategic/peace layer is added above front-sector operations.

## 5. Compression techniques worth stealing (ranked)

1. **Planning-bonus carrot, not stick** (HOI4): reward (not force) leaving an operation on preset/auto by decaying the bonus faster under manual override — matches "preset-first, optional fine adjustment" ethos directly.
2. **Stance-as-single-toggle** (TW Fortify): one click resolves defense+heal+vision+battlefield-props simultaneously — validates the one-slider-per-turn design; look for other multi-effect bundles hiding behind existing plans.
3. **Declarative intent-selector over parameter sliders** (CK3 Raid Intent): same underlying action, player picks the *purpose* rather than tuning numbers — a good template if raid is added.
4. **Chained/staged multi-turn operations authored once** (HOI4 offensive-line chaining): relevant if any attack plan should span multiple turns without re-issuing each turn.
5. **Immediate post-battle disposition, deferred governance** (TW occupy/sack/raze/loot): resolve the cheap decision now, defer the deep system until/if the player wants it.
6. **Area-order capacity multiplier for wide static defense** (HOI4 Garrison Order): one order abstracts defending many low-priority points at once — useful if the roster ever needs a "hold everything else" fallback order alongside the one focused-sector action.

Sources: hoi4.paradoxwikis.com/Battle_plan, ck3.paradoxwikis.com/Warfare,
eu4.paradoxwikis.com/Land_warfare, totalwarwarhammer.fandom.com (Stances,
Settlement options), hoi4.paradoxwikis.com/Occupation.
