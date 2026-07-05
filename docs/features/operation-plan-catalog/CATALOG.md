# Operation Plan Catalog — Working Draft

Working document. Content here churns; it is promoted to ADR 0025 only when the
seed shape stabilizes. Schema per ADR 0024 (`name`, `availabilityConditions`,
`effectAxes`, `riskProfile`). Each plan also carries a **claim block** (schema:
combat-formula MAGNITUDE § Authoring principle — 핵심 이득 / 핵심 대가 / 반목표
조건 + briefing sentence + off-label cost test; authored 2026-07-05, A-4 B3),
read by fit ranking and the ADR 0024 forecast card.

## Authoring Method: Shape First, Magnitude Later

Plans are authored in two passes:

1. **Shape pass (now).** Per plan, fix only what is stable in isolation: which
   axes are *core* (the plan's reason to exist), which are *secondary*
   (present but incidental), and which are *none* (deliberately absent — often
   the line that separates sibling plans). Plus the plan's real-war identity
   and its risk character.
2. **Magnitude pass (later).** Exact per-axis magnitudes are calibrated
   *relatively*, with several plans side by side and together with the
   combat-balancing formula. A single plan cannot be scaled in isolation;
   "mid" only means something next to its siblings.

Shape notation: `core` / `secondary` / `none` per axis.

Two method amendments (2026-07-02, from the Delaying Defense grill):

- **Resolution-layer products.** The six axes change *sector elements*; some
  plan products instead change *how the turn's duel settles* (attacker
  attrition, bought time, shifted outcome bands). A plan's core product may
  live in that resolution layer — authored through `riskProfile` (a shaped
  bargain, not just a level) and the combat formula's plan-vs-plan
  interaction (ADR 0025) — with the axis table carrying only side effects.
  Delaying Defense is the exemplar.
- **No commitment presets.** A plan never earns its slot by a different
  recommended commitment alone — the slider already offers that to every
  plan. A plan must change the axes or change the bargain; otherwise it is a
  duplicate and should be deleted.

---

## Attack

### Swift Seizure (신속 점령) — shape COMPLETE (template plan)

**Real-war identity.** Take the sector quickly, before the enemy digs in or
reinforces. Tempo first: accept a rougher, more exposed operation in exchange
for owning the ground *now*. Polar opposite of Deliberate Pressure, which
spends time to reduce defenses methodically.

**Effect axes (shape).**

| Axis | Shape | Why |
|---|---|---|
| `controlShift` | core | Taking the sector is the plan's reason to exist. |
| `garrisonDamage` | secondary | Defenders are broken as needed, not hunted; seizure, not annihilation. |
| `fortificationDamage` | secondary | Pushes past works rather than reducing them. |
| `routeDisruption` | none | Routes are not the objective. |
| `usableValueDamage` | none | Fast and intact — the base is not burned. This axis being zero is the line separating Swift Seizure from Supply Interdiction. |
| `confidenceGain` | secondary | Contact reveals some information as a byproduct. |

Note: a captured sector opening at 50%/60% usable value is the ADR 0022
capture consequence, not damage authored by this plan.

**Risk character.** High. The plan buys tempo with exposure: under-committing
is uniquely dangerous here (a stalled rush in the open risks the ADR 0021
sector-loss failure), while committing at or above recommendation is rewarded
with speed.

**Availability (shape).** Physical gates only: enemy or contested sector with
an attackable target, reachable this turn. Strong `fortificationDefense` is
deliberately NOT a gate: against an intact fortress the plan stays on the card,
ranked low with a bad forecast, per the ADR 0024 presentation principle — hide
only the physically impossible; express advisability through statistical
ordering and forecast.

**Claim block.** (schema: combat-formula MAGNITUDE § Authoring principle —
currency terms + one briefing sentence each; read by fit ranking and the
ADR 0024 forecast card.)

- **핵심 이득 (core gain):** buys **time-to-own** — the sector this turn, not
  after a siege — with the prize **intact** (`usableValueDamage` = none, so no
  wear on the base). *Briefing:* "Take it now and take it whole."
- **핵심 대가 (core cost):** pays in **required R** (the 1.5 doctrinal assault
  bar, M7) and **blood** (high exposure; an under-committed rush in the open is
  the ADR 0021 sector-loss risk), and is **read-dependent** — a fast assault
  against a garrison you misjudged is the disaster case. *Briefing:* "Speed is
  bought with blood, and a bad read makes it dear."
- **반목표 조건 (anti-goal):** when the prize's value is its intactness AND time
  is not pressing — a methodical reduction gets the same ground cheaper — or
  against an intact fortress with no tempo reason to storm it. *Briefing:* "If
  you have time and the walls are high, do not pay in blood for haste."
- **Off-label cost test:** to own this sector *this turn with the prize intact*,
  every alternative is dearer in some currency — Deliberate Pressure costs more
  **time** and **wears the prize**; Encirclement needs isolation (setup +
  read-dependence). Uniquely cheapest in time-to-own-intact → **not dominated.**

### Deliberate Pressure (신중 압박) — shape COMPLETE

**Real-war identity.** Methodical reduction: spend time wearing the defenses
down, then take the ground cheaply once they are worn. The mirror of Swift
Seizure — it trades tempo for safety where Swift Seizure trades exposure for
tempo. Shines against fortified targets (derived fit, not a gate).

**Effect axes (shape).**

| Axis | Shape | Why |
|---|---|---|
| `controlShift` | secondary | Ground changes hands only once the defense is worn — the inverse of Swift Seizure's layout. |
| `garrisonDamage` | secondary | Sustained pressure grinds the defenders. |
| `fortificationDamage` | core | Reducing the works is the plan's reason to exist. |
| `routeDisruption` | none | Routes are not the objective. |
| `usableValueDamage` | secondary | A long siege wears the prize itself (starvation, requisition). User-confirmed: this sets the roster's tempo tradeoff — Swift Seizure is risky but the prize stays intact; Deliberate Pressure is safer but the prize is worn. How much it wears is a magnitude-pass question. |
| `confidenceGain` | secondary | Prolonged contact accumulates information. |

**Risk character.** Low. Under-commitment slows progress rather than
collapsing into sector loss; the real price is tempo — while the pressure
grinds on, the enemy reinforces elsewhere and holds the initiative.

**Availability (shape).** Physical gates as Swift Seizure: enemy or contested
sector with an attackable target, reachable this turn. Fit ranking naturally
surfaces it against fortified targets.

**Claim block.**

- **핵심 이득 (core gain):** buys **low R and low blood against fortification** —
  erosion stamps lower the fort multiplier and widen the assault frontage (M8),
  so R climbs over turns without paying a costly assault. The safe way past
  walls. *Briefing:* "Wear the wall down and walk in cheap."
- **핵심 대가 (core cost):** pays in **time** (multi-turn — while it grinds the
  enemy keeps the initiative and reinforces elsewhere) and in the **prize's
  condition** (`usableValueDamage` secondary — a long siege starves and
  requisitions the base it takes). *Briefing:* "Patience costs tempo, and the
  prize arrives worn."
- **반목표 조건 (anti-goal):** when tempo is pressing — a decisive window is
  closing or this sector will be reinforced — so the siege clock loses more than
  the blood it saves; or against a soft target where the siege time is pure
  waste. *Briefing:* "Do not besiege what you could rush, nor what will not
  wait."
- **Off-label cost test:** to reduce a fortified sector *cheaply in blood*, every
  alternative is dearer — Swift Seizure pays a brutal **required R + blood** spike
  against intact walls; Flanking pays a **coordination premium** (threshold 1.6)
  and needs a flank to exist. Uniquely cheapest in blood-against-fortification →
  **not dominated.**

### Flanking Breakthrough (우회 돌파) — shape COMPLETE

**Real-war identity.** Refuse the strong front. Instead of knocking on the
fortified face, come around through a side approach — a pass, a ford, an open
flank — and unhinge the defense by position. Kept as ONE plan (user decision,
2026-07-02): in a one-sector-one-turn model, envelopment and penetration
compress to the same outcome shape (refuse the front, win by position); a
separate penetration plan splits out only if deep-battle/multi-sector
exploitation ever arrives (doctrine survey, gap #4).

**Effect axes (shape).**

| Axis | Shape | Why |
|---|---|---|
| `controlShift` | core | Still an attack that takes the sector. |
| `garrisonDamage` | secondary | A defense caught out of position collapses. |
| `fortificationDamage` | none — defining zero | Goes *around* the works, not through them; the inverse of Deliberate Pressure. |
| `routeDisruption` | secondary | Turning the position threatens the defender's connections. |
| `usableValueDamage` | none | |
| `confidenceGain` | none | A covert approach gathers little. |

**Risk character.** Mid-high, and different in *kind* from its siblings: the
risk is informational. A flank march on bad intelligence is how disasters
happen — this is the most fog-coupled attack plan, and its riskProfile should
interact with information confidence more than any other attack's.

**Availability (shape).** The first *geometric* physical gate: the plan
appears only when a non-frontal approach physically exists (pass, ford, or
open-flank adjacency). Terrain decides availability here — advisability still
stays with fit ranking.

**Claim block.**

- **핵심 이득 (core gain):** takes a fortified sector **without paying the
  wall** — refuses the front and unhinges the defense by position
  (`fortificationDamage` = defining zero, the inverse of Deliberate Pressure).
  *Briefing:* "Go around the wall, not through it."
- **핵심 대가 (core cost):** pays a **coordination premium** (threshold 1.6,
  highest of the ground-taking attacks, M7) and is the **most read-dependent**
  plan in the catalog — a flank march on bad intelligence is how disasters
  happen. *Briefing:* "A flanking march is only as good as the scouting under
  it."
- **반목표 조건 (anti-goal):** when the read is poor (high fog) — the
  coordination premium and bad intel compound into the catastrophe case — or
  when no flank geometry exists (then the plan is simply not on the card).
  *Briefing:* "Never turn a flank you cannot see."
- **Off-label cost test:** to take a fortified sector without a bloody
  wall-assault, alternatives are dearer — Deliberate Pressure costs **time** (a
  siege); Swift Seizure costs **R + blood** against intact walls. Uniquely
  cheapest when a flank exists and can be read → **not dominated.**

### Raid (약탈) — shape COMPLETE

**Real-war identity.** An attack with no intention of taking ground: riders
sweep in, burn fields and stores, deliberately avoid the garrison, and leave.
Chevauchée warfare — impoverishing the enemy without giving battle. Added
2026-07-02 as the convergent #1 gap of the doctrine and grand-strategy
surveys.

**Effect axes (shape).**

| Axis | Shape | Why |
|---|---|---|
| `controlShift` | none — defining zero | No intent to hold ground; this zero separates Raid from every other attack. |
| `garrisonDamage` | none | Avoiding the garrison is the identity; annihilation is Encirclement's job. |
| `fortificationDamage` | none | No interest in walls. |
| `routeDisruption` | secondary | Burned countryside disorders supply as a byproduct. |
| `usableValueDamage` | core | Burning the base is the reason to exist — the only attack plan with this axis as core. |
| `confidenceGain` | secondary | Raiders double as reconnaissance in force. |

**Loot: destruction + income (user-confirmed 2026-07-02).** Raid pays: a
fraction of the usable value destroyed converts to raider income. This is not
a seventh axis — it is a conversion on damage dealt, and the conversion ratio
(plus any late-match decay) is a combat-formula dial. SPEC fun pillar 3
forbids *state-bound* snowball, not snowball itself; the loot is bound to
skill by four structural leashes:

1. **Opportunity cost** — one primary action per turn; a raiding turn is a
   turn not spent advancing.
2. **Self-exhaustion** — raid burns its own income source, and the
   availability gate (something left to burn) physically starves repeat
   raiding.
3. **Burning your inheritance** — `usableValueDamage` is the permanent path,
   so raiding land you intend to conquer torches your own prize. Correct play
   becomes "conquer the core you can govern, raid the periphery you cannot" —
   the Mongol pattern emerging from the rules rather than authored flavor.
4. **Zero victory progress** — no controlShift means raiding never advances
   the match-arc win condition; its relative value falls automatically as the
   match clock tightens.

**Risk character.** Low and cheap — built for tight commitment and surplus
preservation. The risk is losing the raiding force if caught, so strong
garrisons degrade fit naturally.

**Availability (shape).** Physical gate: an enemy sector with usable value
left to burn, reachable this turn. An already-ashen sector simply does not
surface the plan.

**Claim block.**

- **핵심 이득 (core gain):** buys **enemy impoverishment + loot income** at the
  lowest required R (1.2, M7) and lowest blood, bypassing wall and garrison
  entirely — the only attack that takes no ground (`controlShift` = defining
  zero). *Briefing:* "Burn the base, take the purse, give no battle."
- **핵심 대가 (core cost):** pays **zero victory progress** (no `controlShift`
  → never advances the match-arc win condition; its value falls as the match
  clock tightens) and **burns the inheritance** (`usableValueDamage` is the
  permanent path — raiding land you mean to conquer torches your own prize).
  *Briefing:* "Loot advances nothing on the map, and what you burn you may want
  later."
- **반목표 조건 (anti-goal):** against land you intend to conquer and govern
  (burning your own future prize), or late in the match when ground matters
  more than cash. *Briefing:* "Conquer the core you can hold; raid only the
  periphery you cannot."
- **Off-label cost test:** to impoverish an enemy cheaply without giving battle,
  alternatives are dearer — Supply Interdiction needs rear-access geometry and
  starves indirectly; conquest costs R + blood + holding. Uniquely cheapest in
  blood-free economy denial → **not dominated.**

### Supply Interdiction (보급 차단) — shape COMPLETE

**Real-war identity.** Cut the arteries instead of hitting the face: burn the
bridges, seize the pass, ambush the convoys — the walls stand untouched while
what is behind them withers. Where Deliberate Pressure *reduces* the walls,
Supply Interdiction makes them *irrelevant*; historically most "impregnable"
fortresses fell to starvation, not storm.

**Effect axes (shape).**

| Axis | Shape | Why |
|---|---|---|
| `controlShift` | none — defining zero | The cut itself takes no ground; capture is a follow-up plan's job. |
| `garrisonDamage` | secondary | Starved garrisons wither — indirect grind, not direct assault. |
| `fortificationDamage` | none | Walls untouched — that is the plan's magic. |
| `routeDisruption` | core | The reason to exist — the only attack plan with this axis as core. |
| `usableValueDamage` | secondary | A blockaded sector's economy withers (indirect starvation, unlike Raid's direct burning). |
| `confidenceGain` | secondary | Sitting on the roads, you see everything that moves. |

**Persistence (user-confirmed 2026-07-02).** The cut is *inflicted state* —
burned bridges, destroyed depots — persisting until the enemy spends action to
repair it (the friendly direction of `routeDisruption`; UoC precedent:
resupply is an act, not automatic). This makes the multi-turn siege emergent
with no new mechanics: cut (my turn) → forced choice (their turn: repair,
relieve, or abandon) → tighten or assault (my next turn) — the ADR 0025
capacity duel playing out on the supply lines. The starvation tick itself is
a standing world rule (ADR 0026): the plan stamps the cut once; the world
rule reads the state each turn.

**Time economics (user-raised).** First, a model clarification (user-probed
2026-07-02): every plan resolves *within its turn* — the search/move/deploy
fiction is compressed inside that one resolution, and there is no multi-turn
"operation in progress" state. A "2-4 turn siege" means a *chain of atomic,
independently-chosen turn actions* over persistent world state: cut (resolves
fully) → the cut sector degrades passively while both sides spend their next
turns anywhere → assault (resolves fully). Two clocks govern the chain.
(1) Turn-count cost vs the match envelope (~15-25 turns is a derived
estimate, see SPEC): a full strangle chain is a major-operation commitment —
roughly 2-4 of the match's turns spent on one sector — the correct *feel* for
a siege centerpiece; the fast-attack family exists for when that time cannot
be spared. (2) The staged starvation
curve of a cut sector (holding → attack-incapable → defenseless, UoC-style
stages rather than one-shot damage) is a magnitude-pass dial, tuned under the
envelope constraint. Open question parked for the Recovery/Consolidation
card: does repair consume the defender's primary action, or can it route
through surplus outlets? (The asymmetry decides how hard a cheap cut can hold
the enemy's whole turn hostage.)

**Risk character.** Low-to-mid. Little frontal exposure; the price is paid in
time and in relief battles — the strangled sector's friends come to reopen
the road.

**Availability (shape).** Two physical gates: (1) routes worth cutting exist
(the sector carries routeValue / supply access); (2) **rear access** — a
physical way to reach the route that does not pass through the defended
front, the same geometric-gate family as Flanking Breakthrough
(user-added 2026-07-02). A self-sufficient backwater or a front with no way
around simply does not surface the plan.

**Claim block.**

- **핵심 이득 (core gain):** makes walls **irrelevant** — cuts the arteries so
  what stands behind them withers, with no assault paid (`fortificationDamage`
  = none); the cut is **persistent inflicted state** the enemy must spend a
  primary action to repair. *Briefing:* "Leave the walls standing and starve
  what they guard."
- **핵심 대가 (core cost):** pays in **time** (the strangle chain — cut → their
  choice → tighten or assault) and in **relief battles** (the strangled
  sector's neighbors come to reopen the road); takes no ground itself — capture
  is a follow-up plan. *Briefing:* "A siege is paid in turns, and the road's
  friends will come."
- **반목표 조건 (anti-goal):** against a self-sufficient backwater (nothing to
  starve) or a front with no way around (no rear access → not on the card), and
  when time is short — the chain eats several of the match's turns. *Briefing:*
  "Do not strangle what feeds itself, nor what you cannot reach from behind."
- **Off-label cost test:** to defeat a fortified sector without touching the
  wall or giving battle, alternatives are dearer — Deliberate Pressure pays
  **blood + time** reducing the wall; Encirclement needs the pocket sealed
  first. Uniquely cheapest in wall-neutralization where rear access exists →
  **not dominated.**

### Encirclement and Annihilation (포위 섬멸) — shape COMPLETE

**Real-war identity.** The only plan whose target is the enemy *army itself*
— not the ground, not the base. Seal the pocket completely, then erase the
trapped force. A garrison normally regenerates while its economy and
population survive (standing rule); annihilation is what makes a military
loss immediate and total instead of a debt that repays itself.

**Effect axes (shape).**

| Axis | Shape | Why |
|---|---|---|
| `controlShift` | secondary | Ground follows cheaply once the force is dead. |
| `garrisonDamage` | core | Annihilation is the reason to exist — the only attack plan with this axis as core. |
| `fortificationDamage` | none | The seal makes walls irrelevant. |
| `routeDisruption` | secondary | Tightening the already-closed ring. |
| `usableValueDamage` | none | The prize is wanted intact. |
| `confidenceGain` | secondary | A sealed pocket is fully observed. |

**Risk character.** The highest in the catalog, with the highest recommended
commitment. A failed encirclement — a breakout, or a relief force turning
the tables — is historically catastrophic; ADR 0021 bites hardest here.
Magnitude-pass note: the doctrine survey's isolated-collapse effect (rout —
disproportionate collapse, not linear attrition, once isolated) is this
plan's combat-formula material.

**Availability (shape, user-confirmed 2026-07-02).** The chain capstone: a
two-branch isolation gate, both branches physical state-reading (per
`Atomic turn resolution` — a checkpoint on time already paid, not a
multi-turn action):

1. the sector's supply is already cut (typically a prior Supply
   Interdiction), **or**
2. all approaches to the sector are friendly-held (geometric envelopment
   completed on the map).

The gate is also what makes one-turn resolution plausible: the click is the
guillotine falling on an already-sealed, starving pocket — the trial happened
on the preceding turns.

**Claim block.**

- **핵심 이득 (core gain):** the only plan that makes a military loss
  **immediate and total** — it erases the trapped army so it never regenerates
  (defeating the standing rule that regrows a garrison while its economy
  survives); ground follows cheaply, and 항복 수확 discounts the winner's own
  blood on a sealed pocket. *Briefing:* "Kill the army once, not the debt that
  repays itself."
- **핵심 대가 (core cost):** the **highest required R (2.2, M7)** and the
  highest risk in the catalog — a failed encirclement (breakout, or a relief
  force reversing the ring) is catastrophic, and ADR 0021 bites hardest here;
  it also demands the **isolation gate already paid** (a setup chain of prior
  turns). *Briefing:* "The guillotine is sure only after the pocket is sealed;
  a broken ring is a disaster."
- **반목표 조건 (anti-goal):** when the pocket is not sealed (gate unmet → not
  on the card), when the trapped garrison is too cheap to be worth the 2.2 +
  risk, or when a relief force can still turn the tables. *Briefing:* "Do not
  close a ring that is not yet closed."
- **Off-label cost test:** to make an enemy army's death **permanent** rather
  than a self-repaying debt, no alternative does it — every other plan leaves a
  garrison that regrows while the economy survives. The chain capstone,
  uniquely the only annihilation plan → **not dominated** (nothing dominates the
  capstone).

### Crossing / Landing Securement (도하·상륙 확보) — shape COMPLETE

**Real-war identity.** Forcing open ground that water shields: crossing a
river line or landing across a strait to plant a bridgehead. The attack is
already decided — the turn is spent *forcing the passage* (user framing,
2026-07-02): of the seven attacks this is the one closest to a movement
order, and what it buys is position, not enemy damage. Per `Position as
product` (DOMAIN_MAP) this needs no move action: turn N takes the far-bank
sector and opens the route; the inland breakout is the next turn's separate
decision from the new position. ADR 0015's crossing penalties (river 0.85,
strait 0.70, port staging mitigates) are exactly the stacked disadvantage
this plan exists to swallow.

**Effect axes (shape).**

| Axis | Shape | Why |
|---|---|---|
| `controlShift` | core | Seizing the far bank is the objective. |
| `garrisonDamage` | secondary | The fight at the water's edge. |
| `fortificationDamage` | none | |
| `routeDisruption` | secondary — **friendly direction** | The secured crossing persists as an *opened route*: the follow-up operations' doorway. First attack plan to work this axis in its build direction. |
| `usableValueDamage` | none | |
| `confidenceGain` | none | An opposed landing sees little past the beach. |

**Risk character.** High — Swift Seizure's tier, but for a different reason:
the terrain itself fights for the defender. Opposed crossings are historically
among the bloodiest operations; under-commitment means being thrown back into
the water. Staging from a port/harbor (ADR 0015 mitigation) improves fit and
forecast, not availability.

**Availability (shape, user-confirmed 2026-07-02).** Geometric gate #3, and
**exclusive**: when the target sector lies across a river/strait boundary,
this is the *only* attack plan the card surfaces — an attack across water
*is* a crossing operation, so "swift seizure across a strait" is not a
different plan but an incoherent sentence. Hasty-vs-careful crossing is
expressed through commitment and risk adjustment, not separate plans.

**Claim block.**

- **핵심 이득 (core gain):** the only way to force ground that water shields —
  plants a bridgehead and leaves an **opened route** behind it
  (`routeDisruption` in its friendly direction — the follow-up's doorway). What
  it buys is **position**, unreachable by any other plan. *Briefing:* "Force
  the water and the far bank is yours to build from."
- **핵심 대가 (core cost):** swallows the **stacked water penalty** (river 0.85
  / strait 0.70, ADR 0015) — among the bloodiest operations; under-commitment
  means being thrown back into the water. It buys position, not enemy damage.
  *Briefing:* "The river fights on the defender's side; pay in blood or stage
  from a port."
- **반목표 조건 (anti-goal):** forcing an *opposed* crossing when a port-staged
  or unopposed approach exists — mitigate the penalty first rather than pay it.
  (No anti-goal versus siblings: across water this is the *exclusive* plan.)
  *Briefing:* "Do not storm the bank you could have staged onto."
- **Off-label cost test:** to take a sector across water there **is no
  alternative plan** — the availability gate is exclusive ("swift seizure across
  a strait" is an incoherent sentence). Uniquely and by construction the
  water-attack → **not dominated** (nothing shares its class).

## Non-combat

### Reconnaissance (정찰) — shape COMPLETE

**Real-war identity.** Spend the turn *knowing*: narrow the enemy estimate
band, resolve 불확실 into threat-or-opportunity (the ADR 0019 bridge). The
information tool of the uncertainty duel (ADR 0025); already validated as the
scout gambit in the stage-2 command spec.

**Effect axes (shape).** `confidenceGain: core` — its sole non-zero axis, and
the only plan in the catalog where this axis is core. All five other axes:
none.

**Risk character.** Lowest operational risk in the catalog; the real risk
lives outside the card — in what the turn did *not* do (the undefended
sector, ADR 0021's scout gambit). The one plan where riskProfile means
opportunity cost rather than failure chance.

**Two faces (per ADR 0024).** A primary operation-plan tab, and a surplus
destination. The stage-2 spec's open question ("standalone action only, or
also a bundled recon component of attack plans?") is now resolved as *both*:
attack plans carry `confidenceGain: secondary` (contact reveals as a
byproduct); Reconnaissance carries it as core.

**Targeting (user-confirmed 2026-07-02).** One front sector — isomorphic with
the decision ladder, so "which sector do I learn about" uses the same grammar
as "which sector do I strike," and the commitment slider keeps one meaning
(more capacity → narrower band). The fog spec's hex/ring precision lives as
the evidence layer inside the targeted sector. Broad sweeps are served by
spreading picks across turns or by surplus-scouting.

**Availability (shape).** Physical gate: a sector within scout reach with
something left to learn (confidence below the ceiling, or decayed).

**Claim block.** (non-combat: priced in information and opportunity cost, not R
or blood.)

- **핵심 이득 (core gain):** buys **knowing** — narrows the enemy estimate band
  and resolves 불확실 into threat-or-opportunity (the ADR 0019 bridge); the only
  plan with `confidenceGain` as core. It lowers the read-dependence of every
  future plan. *Briefing:* "Spend the turn seeing, so the next turn strikes
  sure."
- **핵심 대가 (core cost):** pays pure **opportunity cost** — the turn did
  nothing at the front (the undefended sector, the ADR 0021 scout gambit); no
  failure chance, only the foregone action. *Briefing:* "Knowledge is bought
  with a turn you did not fight."
- **반목표 조건 (anti-goal):** when the board is already legible enough to act
  (confidence at the ceiling → nothing to learn → not on the card), or when a
  front crisis cannot spare the turn. *Briefing:* "Do not scout what you already
  see, nor when the line is breaking."
- **Off-label cost test:** to narrow the fog band on a sector, alternatives are
  dearer — attack plans reveal only as a byproduct (`confidenceGain` secondary)
  and charge R, blood, and exposure to get it. Uniquely cheapest as pure
  information → **not dominated.**

### Recovery / Consolidation (정비·회복) — shape COMPLETE

**Real-war identity.** The turn spent restoring what war broke. The build
direction of the axis model at work — and the only plan in the catalog where
several axes are core simultaneously.

**Effect axes (shape, build directions).**

| Axis (build direction) | Shape | What it does |
|---|---|---|
| `routeDisruption` → repair | core | Rebuild cut bridges/depots — removes the cut state, ending starvation. |
| `fortificationDamage` → build | core | Repair and reinforce damaged works. |
| `garrisonDamage` → reinforce | core | Rally and strengthen the local garrison. |
| `usableValueDamage` → recovery | core | Boost usable-value recovery above the standing +10pp rule. |
| `controlShift` / `confidenceGain` | none | Neither ground nor information is this plan's business. |

Commitment decides how much gets fixed; the preset triages worst-first, and
detailed targeting belongs to fine adjustment — bound by the "map-taught
nouns only" principle (RESEARCH, 2026-07-02).

**Repair economics (user-confirmed 2026-07-02): states are changed by
actions; surplus feeds flows.** Removing a stamped state (a cut route; state-
level repairs generally) requires Recovery as the *primary* action. The
surplus-recovery face (ADR 0024 outlet) only accelerates standing flows —
usable-value recovery, garrison regeneration. Rationale: if leftover capacity
could erase a full-turn cut, interdiction would become "my whole turn vs your
scraps" and die as a plan; the 1:1 action trade keeps the duel honest, with
the starvation ticks in between as interdiction's profit margin. Extends
ADR 0026.

**Risk character.** Minimal operational risk; like Reconnaissance, the real
risk is opportunity cost — a turn not spent at the front.

**Availability (shape).** Physical gate: an own sector with damaged states or
degraded flows to restore.

**Claim block.** (non-combat: priced in state-removal and opportunity cost.)

- **핵심 이득 (core gain):** the only plan that **removes inflicted state** —
  un-cuts routes (ending starvation), repairs works, reinforces the garrison,
  and accelerates usable-value recovery. A stamped cut clears only by spending
  this primary action. *Briefing:* "The one turn that undoes what was done to
  you."
- **핵심 대가 (core cost):** pays pure **opportunity cost** and is **reactive**
  — a turn spent fixing is a turn not spent gaining, away from the front.
  *Briefing:* "Mending costs a turn of advancing."
- **반목표 조건 (anti-goal):** when nothing is broken (no damaged state → not on
  the card), or when a front crisis is worth more than the repair — a cut never
  self-heals, so the real judgment is whether *this* sector's mending is worth a
  whole turn now. *Briefing:* "Do not mend the rear while the front burns."
- **Off-label cost test:** to clear a stamped cut or damage, there **is no
  alternative** — surplus outlets only accelerate standing flows, they cannot
  erase a full state (the 1:1 action-trade rule that keeps interdiction honest).
  Uniquely the only state-removal plan → **not dominated.**

## Defense

The defense family divides not by intensity but by **what it saves**:
Stronghold Defense saves the *ground* (staking the organization); Delaying
Defense saves *time* (selling ground for it — space traded for time);
Strategic Abandonment saves *capacity* (cede immediately, redirect
everything; the scorched-earth variant burns what is ceded).

### Stronghold Defense (거점 방어) — shape COMPLETE

**Real-war identity.** This ground cannot be given. The baseline defense the
stage-2 command mockup already validated: commitment flows into the fourth
defense layer (`defenseCommitment`), and ADR 0021's hold-probability and
under-commit collapse operate here at full force.

**Effect axes (shape).**

| Axis | Shape | Why |
|---|---|---|
| `controlShift` (hold direction) | core | Keeping control is the reason to exist. |
| `fortificationDamage` (build direction) | secondary | Field works thrown up while defending. |
| `confidenceGain` | secondary | A repelled assault is the best reconnaissance. |
| others | none | Attacker attrition is a resolution outcome, not an authored axis. |

**Failure consequence (user-confirmed 2026-07-02): dissolution, not
annihilation.** What is lost on a failed hold is the *organization*: the
localGarrison disperses — captured, scattered, gone home. The *people* remain
as the sector's population (usable 60% under the occupier), and a garrison
regenerates from that population if the sector is retaken (standing rule,
ADR 0026 family; see also `Latent mobilizable population`). No cross-sector
force-transfer machinery in the MVP. The parked no-retreat toggle is
unnecessary — Stronghold already stakes everything. How total the defense is
is expressed by the commitment slider, not a separate total-war mode
(emergency human mobilization remains a deferred overclock concept).

**Risk character.** The ADR 0021 centerpiece: recommended commitment is the
statistical safe-hold; under-committing risks sector loss plus garrison
dissolution.

**Availability (shape).** An own or threatened sector — the trivial gate.

**Claim block.** (defense: priced in ground kept and the organization staked.)

- **핵심 이득 (core gain):** buys the **ground kept** — the maximal
  hold-probability at a given commitment; stakes the organization to keep the
  sector under the ADR 0021 hold math. *Briefing:* "This ground does not move."
- **핵심 대가 (core cost):** stakes **everything** — under-commitment means
  sector loss *plus* garrison dissolution; high variance (full upside, full
  downside — the stock buy). *Briefing:* "Hold too lightly and you lose the
  ground and the army both."
- **반목표 조건 (anti-goal):** when the ground is worth more as time than as
  ground (→ Delaying Defense), when it is not worth the organization at all (→
  Abandonment), or when you cannot afford the commitment to hold safely.
  *Briefing:* "Do not stake the army on ground you would rather trade or leave."
- **Off-label cost test:** to actually **keep** a contested sector, alternatives
  do not — Delaying sells it slowly, Abandonment cedes it outright. Uniquely the
  only hold-to-keep plan → **not dominated.**

### Delaying Defense (지연 방어) — shape COMPLETE

**Real-war identity.** A defense that does not intend to win: the ground will
eventually be ceded, but slowly and at a price — bridges burned in
withdrawal, a day extracted at every pass. What is bought is not the sector
but *time for other fronts*. The user's framing: Stronghold is a stock buy
(high variance, full upside), Delaying is a covered call (capped upside,
steady income). In taunt language: Stronghold says "come further and die";
Delaying says "this will take forever — still want it?"

**Core product (resolution layer, user-confirmed 2026-07-02).** The bargain,
authored in `riskProfile` and the plan-interaction matrix, not in the axes:
at a given commitment the outcome bands shift so that "not taken this turn"
is cheap to reach, while decisive repulsion is removed from the menu
entirely. An attacker can still break through by heavily over-committing —
and that over-commitment is precisely the time and capacity the delayer set
out to extract. Each delayed turn erodes the sector's defense state: this is
a deliberately losing posture, not a discount fortress. Choosing Delaying
over Stronghold at the *same* commitment is choosing insurance over a
gamble — same stake, different payout table.

**Effect axes (shape, side effects only).**

| Axis | Shape | Why |
|---|---|---|
| `controlShift` (hold direction) | secondary | It resists, but holding is not the goal — the inverse of Stronghold's layout. |
| `routeDisruption` (self direction) | secondary | Burning bridges in withdrawal — the classic retrograde demolition; the self-damage third polarity, shared with the scorched-earth family. |
| `confidenceGain` | secondary | Contact informs. |
| `fortificationDamage` | none | Digging in is Stronghold's business. |
| others | none | |

**Failure consequence.** Same as Stronghold: dissolution — no cross-sector
force transfer.

**Risk character.** Low variance by design; the real costs are the foregone
repulsion (a weak attacker is never punished) and the erosion clock.
Magnitude-pass balance flag (user-raised): delay may over-dominate defense
choices; counterweights to tune — no repulsion means the attacker's force
and initiative stay intact, chained delay is a slow loss, and in the duel a
read "always-delays" defender invites safe steady aggression (no repulsion
risk to deter it).

**Availability (shape).** An own or threatened sector — as Stronghold.

**Claim block.** (defense: priced in time bought, at low variance.)

- **핵심 이득 (core gain):** buys **time for other fronts** at low variance —
  "not taken this turn" is cheap to reach and decisive repulsion is off the
  menu, so each delayed turn extracts the attacker's time and capacity (the
  covered call: capped upside, steady income). *Briefing:* "This will take
  forever — still want it?"
- **핵심 대가 (core cost):** foregoes **repulsion** (a weak attacker is never
  punished — no upside) and pays the **erosion clock** (the sector degrades each
  delayed turn — a deliberately losing posture); dissolution on the final
  failure. *Briefing:* "You buy time by agreeing, slowly, to lose."
- **반목표 조건 (anti-goal):** when the ground must actually be held (→
  Stronghold's gamble), or when punishing a weak attacker matters (delay never
  repulses); a read "always-delays" invites safe steady aggression. *Briefing:*
  "Do not merely delay what you must hold, nor an enemy you could have broken."
- **Off-label cost test:** to sell a sector slowly for time at low variance,
  alternatives are dearer — Stronghold is a high-variance gamble that may lose
  it all now; Abandonment gives it up instantly and buys no time. Uniquely
  cheapest in reliable-time-for-ground → **not dominated.**

### Strategic Abandonment (전략적 포기) + Scorched Earth (청야 소각) — shape COMPLETE

**Two-tier structure (user-confirmed 2026-07-02).** Abandonment's value is
*saving the action*, so a turn-consuming abandonment plan would be a
self-contradiction. The card therefore splits:

- **Abandonment is a declaration, not a plan.** Free — the command card's
  explicit "cede this sector" acknowledgment. Zero commitment is locked and
  the primary action stays free for elsewhere (the ADR 0021 sacrifice loop,
  literally). It buys legibility: the result report frames the loss as
  *chosen sacrifice* rather than neglect, and situation judgment folds the
  threat as acknowledged instead of re-alarming every turn (ADR 0019
  dissonance handling).
- **Scorched Earth (청야 소각) is the real plan.** Burning is work; it
  consumes the turn.

**Real-war identity (청야).** Moscow 1812; 견벽청야. Evacuate and burn what
you are about to cede, so the enemy inherits ash instead of a base.

**Effect axes (shape).**

| Axis (self direction) | Shape | Why |
|---|---|---|
| `usableValueDamage` (self) | core | Burn your own base so the enemy gains nothing — the home of the self-damage third polarity. |
| `routeDisruption` (self) | secondary | Demolish the bridges on the way out; the enemy's next jump is slowed. |
| others | none | No battle is sought. |

**Commitment scales thoroughness (user-added).** Low commit = hasty torching;
high commit = near-total denial. Whether the curve is steeper than other
plans' is a magnitude-pass dial. Authoring note: at equal effort,
defender-side destruction is more thorough than enemy raiding — the owner
knows where the granaries are.

**Population evacuates; land burns (user-added).** Zero new machinery — the
two components hit different layers of the existing usable/base split.
Population: the *usable* share is crushed (the people flee; destination stays
abstract in the MVP — refugee flows are later governance), but the *base*
populationValue survives, so on recapture the standing recovery rule brings
them home. Economy: the *base* is damaged — burned mills do not return on
their own; rebuilding is Recovery work. This lands the grand-strategy
survey's recoverable/permanent damage split exactly where the model already
had layers for it.

**The signature play — the Moscow trap.** The 1812 campaign is authorable
from existing rules with no new mechanics: 청야+cede (turn 1) → the enemy
occupies an ash sector that cannot sustain a garrison locally (ADR 0014) and
lives entirely on stretched routes → Supply Interdiction behind them
(turn 2; rear-access gate) → the starvation standing rule (ADR 0026) grinds
a force with no local base → the isolation gate opens → Encirclement and
Annihilation (turn 3+). Burn, lure, cut, annihilate.

**Risk character (청야).** Low operational risk (no battle); the cost is the
mirror of Raid's burning-your-inheritance tension — the economy you burn is
permanent damage to a sector you may one day retake. "Will I be coming back
here?" is the plan's real question.

**Availability (shape, 청야).** An own sector facing likely loss, with
something left to burn or evacuate.

**Claim block.** (the cede family; a free declaration + one real plan, priced in
capacity saved and enemy value denied.)

- **핵심 이득 (core gain):** Abandonment (free) buys the **action saved** plus
  legibility — the loss is framed as *chosen sacrifice* and situation judgment
  folds the threat as acknowledged (ADR 0021 sacrifice loop, ADR 0019
  dissonance). Scorched Earth (the plan) buys **denial** — the enemy inherits
  ash, not a base (`usableValueDamage` self, core), and sets the Moscow trap.
  *Briefing:* "Give the ground on purpose, and give them nothing on it."
- **핵심 대가 (core cost):** Abandonment gives up the ground **immediately** (no
  time bought, unlike Delaying). Scorched Earth pays **permanent self-damage** —
  the economy you burn is a sector you may one day retake (Raid's
  burning-your-inheritance mirror) — and costs the turn. *Briefing:* "Ceding is
  instant; burning is forever."
- **반목표 조건 (anti-goal):** Scorched Earth when you will likely return and
  want the base intact ("will I be coming back here?"); Abandonment when the
  ground is worth holding (→ Stronghold) or worth bleeding time for (→ Delaying).
  *Briefing:* "Do not burn what you will need, nor cede what you could keep."
- **Off-label cost test:** to cede a sector while either **saving your action**
  or **denying the enemy its value**, no other plan does either — Delaying and
  Stronghold both spend the turn contesting. Only Abandonment frees the action,
  only Scorched Earth denies the value → **not dominated.**
