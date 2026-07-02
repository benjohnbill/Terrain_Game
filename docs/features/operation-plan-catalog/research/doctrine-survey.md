# External Survey: Real Operational Doctrine

Source: research subagent (sonnet), 2026-07-02. Audits the 11-plan roster and
six effect axes against US FM 3-0/3-90 taxonomies, Soviet deep battle,
pre-modern siege stages, and East Asian defensive doctrine. Raw report below.

---

## 1. Source taxonomy

| Family | Type | Core mechanic |
|---|---|---|
| Offense (FM 3-90) | Movement to Contact | advance under unclear situation to establish contact |
| | Hasty Attack | fast, low-prep attack on a developing situation |
| | Deliberate Attack | fully prepared, synchronized attack |
| | Exploitation | disorganize enemy in depth after a successful attack |
| | Pursuit | catch and destroy a fleeing/routed force |
| Forms of maneuver | Frontal Attack | direct assault on principal defenses |
| | Penetration | rupture a narrow front, split the defense |
| | Envelopment | bypass main defenses, hit the rear |
| | Turning Movement | threaten a rear objective to force enemy to abandon position, no direct fight |
| | Infiltration | small covert force gains a rear position undetected |
| Defense (FM 3-0/3-90) | Area Defense | hold terrain, destroy enemy in prepared engagement areas |
| | Mobile Defense | let enemy overextend, destroy via decisive counterattack (offense is the decisive op) |
| Retrograde | Delay | trade space for time, avoid decisive engagement |
| | Withdrawal | disengage from contact, preserve force |
| | Retirement | move away when not in contact (redeploy) |
| Enabling | Reconnaissance | gather information on enemy/terrain |
| | Screen | early warning only, least protection |
| | Guard | enough combat power to defeat/fix probes before main body |
| | Cover | self-contained force, develops situation, deceives/destroys forward |
| | Feint | limited attack WITH contact, to draw enemy resources off |
| | Demonstration | show of force, NO contact, same deceptive intent |
| | Relief in Place | swap fresh unit into a held position without capability loss |
| Soviet | Deep Battle/Operation | tactical breakthrough + echeloned exploitation across operational depth |
| Pre-modern siege | Investment → Circumvallation → Reduction → Assault → Starvation | sequential stages of surround, wall-off, bombard/mine, storm, or starve out |
| Raiding | Chevauchée / Raid | mobile force burns economy/population base, explicitly avoids holding ground or seeking battle |
| Defender scorched earth | 堅壁清野 (jianbi qingye, "strengthen walls, clear fields") | defender fortifies strongpoints AND denies the surrounding countryside to the invader — East Asian doctrine, used White Lotus/Taiping era |
| Deep strike | Punitive Expedition | campaign-level deep strike to punish/deter, no intent to hold |

## 2. Mapping table (doctrine → current 11-plan roster)

| Doctrine type | Current plan | Fit |
|---|---|---|
| Hasty Attack | Swift Seizure | close |
| Deliberate Attack | Deliberate Pressure | close |
| Envelopment | Flanking Breakthrough | close |
| Penetration | Flanking Breakthrough | partial — name/effect reads as envelopment, not a narrow-front rupture |
| Frontal Attack | Swift Seizure / Deliberate Pressure | implicit default axis of approach |
| Siege: Investment | Encirclement and Annihilation | partial (the "cut off" component) |
| Siege: Assault | Swift Seizure / Deliberate Pressure | covered |
| Siege: Starvation/Blockade | Supply Interdiction | partial — single-turn cut, not an explicit sustained multi-turn siege |
| River/amphibious ops | Crossing/Landing Securement | direct, no real-world doctrine gap |
| Reconnaissance | Reconnaissance | direct |
| Delay | Delaying Defense | direct |
| Area Defense | Stronghold Defense | direct |
| Withdrawal (retrograde) | Strategic Abandonment | partial — doctrinal withdrawal is a fighting disengagement; current plan reads as passive give-up |
| Movement to Contact, Exploitation, Pursuit, Turning Movement, Infiltration, Mobile Defense, Retirement, Screen, Guard, Cover, Feint, Demonstration, Relief in Place, Chevauchée/Raid, Jianbi Qingye, Punitive Expedition | — | **no analog** (see GAPS) |

## 3. GAPS (ranked)

| # | Gap | What it is | Why a player wants it | MVP verdict |
|---|---|---|---|---|
| 1 | **Raid / Chevauchée** | Mobile force burns population/economy base deliberately, explicitly not seeking to hold ground or fight the garrison | Cheap, risk-tolerant way to weaken a target permanently (usableValueDamage) without committing to win the sector — a real strategic option the current roster has no purpose-built tool for | **Yes** — reuses existing usableValueDamage axis, single sector/single turn, no new mechanics needed |
| 2 | **Mobile Defense** | Let the attacker partially penetrate, then a defensive counterattack (the counterattack, not the holding, is decisive) | Gives the defender an offensive tool baked into defense — inflicts real garrisonDamage on the attacker instead of just enduring/trading space like Delaying Defense | **Yes** — fits DEFENSE category as a third posture beside Stronghold/Delaying |
| 3 | **Jianbi Qingye (defender scorched earth)** | Defender fortifies core strongpoints while denying the surrounding sector's economy to the invader before falling back | Turns a losing defense into "I take damage but so does what you're about to capture" — currently Strategic Abandonment is pure loss, no counter-value | **Yes** — reuses usableValueDamage(self) + fortificationDamage(self); could be a modifier on Strategic Abandonment rather than a new plan |
| 4 | **Exploitation** | Continued disorganization of the enemy after a successful attack, extending effect beyond the one sector just won | Doctrinally the payoff phase of a good attack; without it, winning a sector has no compounding effect | Later-phase — inherently multi-sector/multi-turn, breaks the one-sector-one-turn model |
| 5 | **Feint / Demonstration** | Limited or contact-free attack meant to draw enemy reserves/capacity away from the real target | Lets a player manipulate the opponent's capacity allocation, not just their own — a genuine metagame layer | Later-phase — needs an opponent reaction/allocation model and an enemy-facing confidenceGain pole not yet exercised by any plan |
| 6 | **Sustained Siege/Blockade** | Multi-turn starvation of a sector distinct from one discrete Supply Interdiction cast | Real sieges take many turns; a standing commitment reads more plausible than repeatedly re-selecting the same plan | Later-phase, or possibly already emergent from repeated Supply Interdiction — flag as a design question before building new mechanics |
| 7 | **Relief in Place** | Rotate a fresh garrison into an undamaged position to sustain a long defense without capability loss | Matters once defense fatigue/duration is modeled | Low priority — the current-turn committed-defense layer already refreshes every turn, likely already covers this implicitly |
| 8 | **Turning Movement** | Threaten a rear objective (e.g. the supply source) to compel abandonment with no direct fight | A no-combat coercion option distinct from Supply Interdiction's route-cutting | Later-phase or fold into an availability variant of Supply Interdiction; low-medium priority |
| 9 | **Movement to Contact** | Low-commitment advance to establish/clarify the situation before committing fully | A middle option between Reconnaissance and a full attack plan | Later-phase — overlaps existing category boundaries, marginal value given fog already drives this tension |
| 10 | **Infiltration** | Small covert force gains a rear position undetected (sabotage, gate-opening) | Cheap, high-fog, low-capacity alternative to committing the whole pool | Later-phase — breaks the scalar capacity-slider abstraction; needs new detection/discovery mechanics |

## 4. Axis stress

| Doctrinal effect | Nearest existing axis | New axis needed? |
|---|---|---|
| Fix/suppress (pin enemy, deny its freedom to reallocate, no damage dealt) | none directly (garrisonDamage implies actual damage) | No — plan-level behavior: a temporary lock on the opponent's next-turn capacity allocation |
| Isolate (sever a sector from reinforcement, cumulative) | routeDisruption | No — isolation is an intensified/threshold state of existing routeDisruption, not a new dimension |
| Deceive (corrupt enemy's read of your force identity/magnitude/intent) | confidenceGain | No — but check whether confidenceGain's enemy-facing pole ("damage enemy's confidence/estimate") is actually implemented by any plan. If not, this is the mechanism feints/demonstrations (gap #5) would need — an underused pole, not a missing axis |
| Screen/cover posture (standing readiness over a sector with no active threat yet) | confidenceGain (friendly pole) | No — plan-level stance/availability choice, not a new axis |
| Morale/rout collapse (disproportionate collapse vs linear attrition, e.g. after encirclement) | garrisonDamage | No — needs a conditional multiplier on garrisonDamage (e.g., when target is already isolated), not a new axis |
| Political/legitimacy shift (defection, populace allegiance, submission short of destruction) | controlShift / usableValueDamage (partial) | Yes, in principle — but explicitly out of scope per the deferred-governance boundary; not a Phase 1 concern |

Sources: FM 3-90 ch. 3/4/10/11/12/15 (globalsecurity.org, nuui.com), FM 3-0
ch. 8, Wikipedia (Deep operation, Siege, Chevauchée, Feint, Demonstration),
the-footnote.org (Jianbi Qingye / Taiping-era environmental warfare).
