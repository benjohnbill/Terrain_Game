# Terrain Game Domain Map

Markers:

- ✅ Verified or accepted in the current project direction.
- ❓ Assumption or proposed concept requiring validation.
- ⛔ Forbidden or rejected direction.

This file is Tier 0 of the Vocabulary Law — the promoted, project-wide
canon. The law itself (definition tiers, single-definition rule,
naming, promotion, the generated Quick Reference) lives in
`DOCUMENTATION-LAW.md` § Vocabulary Law.

**Two halves, one rule.** This file *defines* only the terms born here —
project-native terms with no feature birthplace. A term promoted from a feature
keeps its definition at that feature, and its entry here is a **summary +
pointer + why-it-is-canon**, never a second definition or a value restatement.
Both halves keep the same ``- ✅ `Term` `` header form: the header is what marks a
term as promoted (ruling 03 Q3) and what `audit-lint`'s header check reads, so an
entry is re-cut, never deleted.

Which half a term is in is recorded in `docs/audits/term-inventory.json`
(`birthplace`), and the split is enforced: `audit-lint`'s
`definitionRestatement` check blocks a promoted entry that reuses its
birthplace's phrasing. Applied to all 56 promoted entries on 2026-07-28
(enforcement-ladder stage 4) — a new copy blocks at commit.

## Design Principle

- ✅ `Land-derived state` (모든 것은 땅에서 파생된다) — **user-confirmed
  2026-07-05 (A-3 session)**: substance is never stored where it can be
  derived from the land the realm holds. Income = Σ sector economy ×
  usable; force limit = capPerPop × Σ sector population × usable;
  projectable mass = min(field, Σ door width × flow); shield mass =
  facing-front garrisons from adjacency; reserve awakening = the
  province's route-connected stock (march-worn on arrival); the
  manpower pool travels with territory; usable value is the land's
  current condition. Consequences arrive free of extra rules: conquest
  raises the cap on its sealed integration lag,
  raids shrink the victim's cap, geography prices power projection.
  The terrain-first thesis (SPEC) made mechanical; the escape-state
  doctrine (도주로 is derived at rout time, never stored) is its
  resolution-layer precedent. **Named exception (deliberate): the
  command pool.** Attention is realm-size-independent —
  the land gives the body, the player gives the mind; this is what
  prices expansion break-even and keeps the vassal seat a complete
  game. **MVP contract:** recruitment is sited at a controlled front
  sector; the full recruitment, province-origin, readiness, and
  endpoint contract is authoritative at match-arc MT-⑥ and ADR 0045.

- ✅ `Aging constitution` (노화 헌법 · alias anti-stalemate ratchet) — how a match
  accrues irreversibility, in three principles (dual billing, flow never ages,
  snapshot information). Canon because it is the buttress of anti-fizzle: no free
  healing is what makes land-loss genuinely decay the trailing player. Originally
  the clock that let the now-retired decision point arrive; **purpose re-aimed by
  the 1v1 pivot Gate 5 (D5.2, 2026-07-24) with mechanics unchanged** (ADR 0042
  §3, ledger D5.1/D5.2). Definition + rulings: match-arc `GLOSSARY.md` 노화 헌법 /
  `RULINGS.md` MT-①. _(Re-slimmed 2026-07-10, F-04.)_

- ✅ `Hex is physical, sector is decisional` (헥스는 물리, 구역은 결정) —
  **user-promoted 2026-07-31**: which grain a new field is keyed on is decided by
  asking whether it is a fact about matter or an object of judgement. Movement
  destinations and approach arcs are hex-keyed because marching and crossing are
  physical acts; terrain interpretation, commit allocation, and engagement
  resolution are sector-keyed because they are judgement and its object. This is the
  operating rule beneath ADR 0032 (the front sector is the operational atom) and
  `world/schema.ts`'s invariant that hexes are physical space while values live on
  sectors. Promoted because it decided two independent questions in one session —
  the approach-arc contract and the commit key. Definition + grounds: ADR 0046
  § Decision item 5.

## Core Terms

- ✅ `Map unit`: A playable geographic unit. Currently rendered as a hex, but
  should be designed so it can later become an irregular province.
- ✅ `Terrain-first`: Geography determines combat, economy, population, and
  movement before political control is applied.
- ✅ `Faction`: A political actor controlling map units.
- ✅ `Force role` (군사 역할): the functional classification of military
  strength — standing forces, local garrison, offensive mobilization, local
  defense — the umbrella term for the ADR 0009 split. Roles, risks, and the
  mobilization grammar: ADR 0009 (+ 0015/0018 usage). _(Registered
  2026-07-10 — terminology audit ghost finding; the members were registered,
  the grouping term was not.)_
- ✅ `Region value`: The combined economic, population, military, and strategic
  value of a map unit.
- ✅ `Named province`: A medium-sized region composed of one or more map units
  with identity, population weight, economic profile, strategic role,
  background, and event hooks. It is the main strategic reading, economy, and
  identity unit, not normally the one-turn occupation unit.
- ✅ `Front sector`: A sub-province operational area composed of multiple map
  units, such as southern Jiangnan or a Shandong harbor basin. It is the MVP's
  one-turn occupation, defense-focus, and deliberate-sacrifice unit: larger than
  a single hex, smaller than a named province. Front sectors are authored fixed
  subdivisions: each map unit belongs to exactly one front sector, each front
  sector belongs to exactly one named province, and war changes sector ownership
  rather than redrawing sector borders. Front sector is the formal territorial
  ownership unit for the MVP; map-unit/hex ownership should be treated as
  derived rendering/calculation state if still present in implementation. A front
  sector is an operational unit, not an area/value unit: spatial extent,
  population, economy, defense, and strategic value may diverge. Dense core
  sectors can be small and valuable; sparse frontier sectors can be large and
  low-value. _Avoid_: Front point, single-hex objective, dynamic front line,
  treating hex count as value.
- ✅ `Sector value`: The authored population, economy, defense, military, and
  strategic value of a front sector. It is related to but not determined by the
  number of hexes/map units in the sector.
- ✅ `Front sector value profile`: The Phase 1 value axes that explain why a
  front sector matters: `controlWeight`, `economyValue`, `populationValue`,
  `defenseValue`, `militaryValue`, and `routeValue`. Different systems read
  different axes; province status uses `controlWeight`, while economy, defense,
  targeting, and movement read their relevant axes. Later phases may add
  political, symbolic, governance, unrest, or event values without changing the
  sector layer.
- ✅ `Usable value`: The currently usable portion of a controlled front sector's
  economy or population value — newly captured sectors start reduced and
  recover per stable turn (a turn ending uncontested under the same faction).
  An MVP placeholder, not a governance model. Placeholder recovery values and
  the stable-turn definition: ADR 0022 (made uniform across acquisition
  channels by ADR 0029); carried as per-sector state in the L2 world since
  occupation-geography stage ① (ADR 0032; match-arc RULINGS OG-①).
  _(Re-slimmed 2026-07-10, forensics; value restatement removed.)_
- ✅ `Yield` (생산): the economy's base unit — the **기본 생산량**; the common
  measure of cost and asset across the whole game. All prices, the income
  formula, and the force-limit (구칭 national cap) derivation live in
  MAGNITUDE M14 (owning doc). Namespace note: the documentation law's
  Production (생산) layer is docs-governance — in game docs 생산 means only
  this unit. **AGREED (2026-07-05, A-3 rulings ⑱–㉑)** _(Re-slimmed
  2026-07-10, forensics F-03; price table removed.)_
- ✅ `Treasury` (국고): realm-level stock of unspent yield — the thin economy's
  only stored state; indemnities land here as cash, spent through normal
  prices. Values: MAGNITUDE M14. **AGREED (2026-07-05)**
- ✅ `Development` (개발): the non-conquest permanent growth primary — one
  sector +0.5 economy / +0.5 population, once per sector (repeatable steps =
  Phase 2 reserved seat). Price and payback: MAGNITUDE M14. **AGREED
  (2026-07-05)**
- ✅ `Spatial extent`: The physical footprint of a front sector on the map, such
  as its hex count or visual area. It should not be used as a proxy for sector
  value.
- ✅ `Province status`: A dynamic summary of a named province derived from its
  front sectors' ownership, value, adjacency, diplomacy, threat, information,
  and active conflicts. A named province does not need a single hard owner for
  internal logic; it can read as `secure`, `threatened`, `border`, `contested`,
  `split`, or `occupied` in the MVP. Province status is calculated each turn from
  sector state rather than authored as a fixed class, and it is perspective-based
  (`computeProvinceStatus(province, perspectiveFactionId)`). It uses
  `controlWeight` share as the control basis: perspective share >= 70% is
  controlled enough to be `secure`, `threatened`, or `border`; 30% <
  perspective share < 70% is `split`; perspective share <= 30% with another
  faction >= 70% is `occupied`; active conflict makes the province `contested`
  regardless of share. When multiple statuses apply, MVP display priority is
  `contested` → `split` → `occupied` → `border` → `threatened` → `secure`.
  _Avoid_: treating province owner as the primary source of territorial truth.
- ✅ `Province status confidence`: A separate confidence/uncertainty layer over
  province status. `Uncertain` is not a province status value; low confidence is
  surfaced through the situation-judgment `불확실` axis and confidence overlays so
  combinations such as border-but-uncertain or split-but-uncertain remain
  expressible.
- ✅ `Estimate band` (추정 구간): The range a viewer reads in place of an exact
  figure for anything fogged — enemy substance and fatigue, and the reads derived
  from them. Composed from recorded observations rather than blurred out of the
  true value; always contains the truth; never collapses to a point. Promoted
  2026-08-03 because combat preview, the 판세 read, and the bot all consume it.
  Definition: `docs/features/fog-of-war-discovery/GLOSSARY.md`; model:
  that feature's `RULINGS.md` ③ (what a band is) and ④ (what the testimonies
  behind it are about — force for what moves, sector for what does not); widths
  and the reporting spread: its `MAGNITUDE.md` FG-M①.
  _Avoid_: reading the midpoint as the answer, or restating its widths here.
- ✅ `Situation axis`: The current-turn strategic interpretation of a province
  reading: `판세`, `위협`, `기회`, or `불확실`. Province status is the background
  control/contact state; situation axis is why this province matters now.
- ✅ `Province control summary`: A perspective-neutral aggregate of a named
  province's front-sector controlWeight shares, dominant faction, dominant share,
  mixed-control flag, and contested sector list. It is used for statistics,
  ranking, AI/global evaluation, and neutral map summaries. It is not the same
  thing as perspective-based province status.
- ✅ `Border sector`: A derived state, not an authored class. A front sector is a
  border sector when current ownership, adjacency/reachability, and diplomacy
  make it a contact zone with another faction.
- ✅ `Contested sector`: A derived state, not an authored class. A front sector is
  contested when control is actively threatened, disputed, or being resolved by
  the current turn's primary action.
- ✅ `Threatened province`: A province status where the player controls at least
  70% of controlWeight and no direct border conflict is active, but a rival can
  reach a player-held sector next turn or within the current operation range with
  sufficient information confidence or report support.
- ✅ `Province archetype region`: A broad geography/history frame used to group
  named provinces, such as Central Plains, Guanzhong Passes, Jiangnan Grain
  Belt, Steppe Frontier, or Northern India Route.
- ✅ `Settlement/function layer`: Human use of a place, such as administrative
  center, commercial city, agricultural center, military base, fortress pass,
  port city, mining/workshop district, scholarly/religious center, or frontier
  settlement.
- ✅ `Local garrison`: Military strength assigned to a specific front sector, not
  a global faction-wide force usable everywhere at once. Sustained by its own
  sector economy and population, not the national treasury; standing forces
  carry national upkeep. This keeps a faction from being strong on every front
  at once. Map-unit/hex garrison data, if still present in implementation, is
  legacy or derived terrain-calculation detail.
- ✅ `Sector defense layers`: Front-sector defense is composed from four layers:
  natural defense (`terrainDefense`), prepared artificial defense
  (`fortificationDefense`), locally sustained defenders (`localGarrison`), and
  current-turn focused defense (`defenseCommitment`). Terrain is inherent;
  fortifications are prepared and can be damaged in war; garrison is supported by
  population/economy; focused defense is the player's direct command commitment.
- ✅ `Standing forces`: Maintained troops directly commanded for attack,
  movement, and critical defense.
- ✅ `Capacity commitment`: The amount of the MVP's single divisible
  action-capacity pool the player chooses to commit to a primary action after
  seeing the prefilled forecast. The recommended value represents the
  statistical safe default; lowering it can preserve surplus for economy,
  scouting, or reserve, but worsens the forecast band and raises the chance of
  failure. _Avoid_: Commit, raw troop slider.
- ✅ `Operation plan preset`: The prefilled core-command plan presented to the
  player after situation judgment and front-sector focus. It bundles the command
  objective, approach, recommended capacity commitment, mobilization posture, and
  risk tolerance into a statistical-average baseline. Casual play can accept the
  preset; skilled play fine-tunes selected fields to fit the actual sector
  situation. Presets belong to a catalog; the command card surfaces the plans
  that pass physical availability gates, ordered by statistically derived fit
  with the top plan as the recommendation. Ill-advised but physically possible
  plans are shown low-ranked with a poor forecast rather than hidden (ADR 0024).
- ✅ `Core command`: The player's primary turn action against a focused front
  sector. Internally it can include objective, approach, capacity commitment,
  mobilization, and risk tolerance; externally it should appear first as an
  operation plan preset with optional fine adjustment.
- ✅ `Turn decision layers`: The decision ladder for one turn. (1) Situation
  judgment reads the board at named-province level (where to look). (2)
  Front-sector focus selects the one operational target — the hinge from
  province reading down to command. (3) The core command chooses an operation
  plan for that sector (what to do). (4) Fine adjustment tunes the plan to the
  actual situation (the skill layer). Hexes underlie all of it as
  terrain/adjacency/rendering. Focus (which sector) and capacity commitment (how
  much force) are distinct: focus is target selection, commitment is the
  fine-adjustment core.
- ✅ `Operation effect axis`: A normalized kind of change an operation plan can
  produce in the MVP. Six axes, each mapped to a specific front-sector element:
  `controlShift` (controlWeight share / ownership), `garrisonDamage`
  (`localGarrison` only; restored by paid recruitment or physical transfer,
  `militaryValue` unchanged; ADR 0045), `fortificationDamage` (`fortificationDefense`),
  `routeDisruption` (`routeValue` / route access), `usableValueDamage` (actively
  destroys usable economy/population; independent of capture; the permanent-
  weakening path), and `confidenceGain` (information confidence). Preset effects
  are authored as a per-axis magnitude, not a primary/secondary split. Each axis
  is bidirectional and target-relative: the same axis that damages an enemy
  element builds/recovers a friendly one (fortification build, garrison
  reinforce, usable-value recovery), so attack, defense, and non-combat plans
  share one catalog (ADR 0024). `statusTransition` is _not_ an axis: province
  status is derived and recomputed from controlWeight/contact per ADR 0023. _Note_: which element an axis touches
  (mapping) is separate from how strongly a capacity commitment drives it
  (combat-balancing, deferred).
- ✅ `Operation plan catalog` — the authored set of operation plans, defined
  schema-first. Canon for two rules it fixes project-wide: fit to a sector is
  *derived* (no authored "target traits" field), and availability gates on
  physical applicability only, so being ill-advised never hides a plan.
  Schema authority: ADR 0024; the catalog itself:
  `docs/features/operation-plan-catalog/CATALOG.md`.
- ✅ `Under-commitment failure`: A failed contested defense caused by committing
  too little capacity. In the MVP, this causes immediate front-sector loss
  rather than only gradual damage, so deliberate sacrifice and surplus
  redirection are legible strategic choices (ADR 0021).
- ✅ `Atomic turn resolution`: Every operation plan resolves fully within the
  turn it is issued — the march/deploy/search fiction is compressed inside
  that single resolution, and no "operation in progress" state spans turns.
  Multi-turn campaigns (sieges, strangle-then-assault chains) are *emergent*:
  chains of independently chosen atomic actions over persistent world state
  (a cut route stays cut until repaired; a cut sector degrades passively by
  stages). A plan's authored effect axes apply exactly once, at resolution;
  any ongoing effect afterward comes from standing world rules reading the
  persistent state (e.g. "an unsupplied sector degrades by stages each
  turn"), never from the plan re-applying its axes. The enemy ends the tick
  by removing the state (repair/relief), not by dispelling the plan. Plan availability may read persistent state (e.g. "already
  isolated") — that is state-reading, not a multi-turn action. _Avoid_:
  casting times, progress bars, multi-turn scripted operations (a HOI4-style
  authored multi-stage plan would be a model change, parked post-MVP).
- ✅ `Position as product`: **Amended 2026-07-26 by ADR 0043** — the original
  "no standalone move action and no tracked army counters" clause is retired;
  a field army has a position and a destination order. What the entry
  protects is unchanged: position stays a *product* of decisions rather than
  a micromanagement surface. Orders are destination-grain with automatic
  pathing, hexes carry the movement *math* (cost, reachability, ADR 0015
  penalties) as calculation substrate, and an arriving force fights on
  arrival — so there is no movement turn-toll before an attack. Taking a
  sector or opening a route still changes what is reachable next turn, and
  availability gates read that position. Crossing/landing remains an attack
  plan whose fiction is movement under fire. _Avoid_: hex-by-hex marching, a
  scripted two-turn move-then-attack sequence (it violates atomic turn
  resolution). Authoritative: ADR 0043 + `DECISIONS-OWED.md` R12–R15.
- ✅ `Standing world rule`: A per-turn world process that reads persistent
  state and applies consequences without consuming any faction's action
  capacity (ADR 0026). Phase-1 instances: usable-value recovery (ADR 0022),
  fog confidence decay, and supply starvation — a continuous supply-ledger pump
  whose sole output is convex substance loss, never a capability flip
  (war-model slice-2 § 2, which **supersedes** D4's staged severity
  holding → attack-incapable → defenseless; ADR 0026's header carries the stamp).
  Whether that ledger's subject is a sector's route state or a force's own
  account is open — `docs/DESIGN-RISKS.md` R16.
  Local-garrison replenishment is deliberately absent:
  it is paid recruitment or physical transfer (ADR 0045). Plans stamp state once;
  standing rules are how time itself matters. _Avoid_: plan effects that re-apply
  across turns.
- ✅ `Uncertainty duel`: The information-asymmetric, effectively simultaneous
  commitment exchange that is the game's core pressure engine (ADR 0025). The
  player commits capacity against a banded estimate of enemy force and an
  unrevealed enemy intent; the enemy acts on its own agenda without waiting.
  Tension comes from information asymmetry and simultaneity, not a wall clock.
  Two layers: magnitude (how much to commit — the poker bet) and categorical
  (which plan against which plan — requires attacker-plan × defender-plan
  interaction in the combat formula). AI tendencies are probabilistic and
  learnable across turns and matches — readable ranges, never deterministic
  tells; random spawn keeps the learning at system level. _Avoid_: intent
  meter, deterministic AI tells, oracle-grade information.
- ✅ `Offensive mobilization`: Temporary risky force drawn from population or
  local capacity to support attacks.
- ✅ `Local defense`: Defensive support from garrisons and mobilizable local
  population during invasion.
- ✅ `Latent mobilizable population`: Economic population that may become levy,
  militia, resistance, or rebellion force under pressure.
- ✅ `High complexity, low micromanagement`: Core design principle where deep
  simulation exists under the hood, but the player mainly issues strategic
  intent-level commands.
- ✅ `Strategic posture`: A guidance preset for interpreting the turn and
  allocating action capacities. It is not a direct hidden-bonus mode.
- ✅ `Action capacity`: Turn-available national capability such as command,
  administration, diplomacy, or scholarship/technology. The MVP uses a single
  *divisible* pool (commit a variable amount to the primary action, redirect the
  surplus); the four-capacity split + carryover + overclock are deferred
  (ADR 0018, ADR 0020). Capacity is **command attention, independent of realm
  scale**: it is not troops or resources, and a great empire and a small realm
  hold the same per-turn pool — what differs is the scale and risk each
  committed point sets in motion. Troops and resources are world stocks the
  capacity directs, never the capacity itself (combat-formula D2).
- ✅ `Map-first situation UX`: Interaction principle where briefing and map
  highlights guide the player to important threats/opportunities before command
  creation.
- ✅ `Situation judgment` (형세판단): The stage-1 reading the player performs
  before issuing any command. Its output is a *structured strategic reading*
  answering a small fixed question set — not a flat list of salient cells. Map
  highlights are the located *evidence* under each question. (Contrast: the
  current `situation.js` emits a flat, priority-sorted top-7 highlight list;
  that is the under-implementation of this term, not its intent.)
  - ✅ Question set (validated — see ADR 0019): `판세` (standing — am I winning;
    aggregate, faction-level), `위협` (threat to me), `기회` (opening), `불확실`
    (blind spot / scouting need). The located axes are 위협/기회/불확실; 판세 is
    an aggregate layer that sits above the map unit.
  - ✅ Status vs axis: `Province status` answers "what is the control/contact
    state?" while `Situation axis` answers "why should I look here this turn?"
    A split province can be a 기회, 위협, or 불확실 depending on enemy force,
    reachability, value, and confidence.
  - ✅ Unit ladder: the reading is per `Named province`; the player drills down
    to `Front sector` for one-turn occupation/defense focus, then to hex/map-unit
    details for terrain evidence. Combat/movement calculation can still inspect
    hexes; only the *strategic reading* is aggregated to province.
  - ✅ Hex→sector→province aggregation per located axis: 위협/수비 = weakest link
    (the province's weakest sector governs its risk); 기회/가치 = sum (total
    economy); 불확실 = minimum confidence (the least-visible sector/hex); route =
    any sector carrying a pass/river/strait-crossing tag flags the province as a
    route variable.
  - ✅ `위협` is relational, not absolute: a province is threatened if it borders
    or is reachable by an enemy province whose *estimated* force exceeds the
    province's weakest-link defense, gated by information confidence. The old
    `defense` (my-weakness) and `threat` (enemy-pressure) types merge into this
    one 위협 axis; which of the two drives it is a drill-down *reason*, not a
    separate axis.
  - ✅ Fog gating: a border province with high enemy-info confidence is judged
    위협-or-safe from the estimate; with low confidence it routes to `불확실`
    instead. Scouting is the bridge — scouting a 불확실 border resolves it to 위협
    or safe. Its concrete one-turn defense focus is a front sector. (Ties into
    `js/intel.js` and the fog-of-war-discovery feature.)
  - ✅ Posture is an annotation lens, truth is invariant (v5 surface —
    ADR 0019 amended 2026-07-06): posture never edits truth; it annotates
    the invariant reading on a map-only overview. Each lens asks a
    different question — 방어 = "where can I be breached"
    (reachable-weakest-link labels on own border provinces), 공세 = "what
    can I take", 정찰 중시 = "what can't I see", 균형 = base — brightening
    its axis and dimming the rest. The overview no longer recommends
    (rec-ring / advice retired); the ADR 0020 commit prefill lives on the
    summoned work surface. Hard constraints: (a) coverage — every
    non-empty axis keeps a surfaced highlight; (b) legibility — collapsed
    counts always shown ("정비 자세 · 위협 3건 접힘"); (c) leak-through
    (succeeds the old dissonance signal) — a suppressed-axis tension that
    exceeds the sealed LEAK_RATIO threshold relative to the strongest
    active-lens tension stays bright with a red pulse, so an urgent fact
    cannot be hidden by the lens (dial value: ADR 0019 amendment). Authoritative
    definition + history: ADR 0019 + its 2026-07-06 amendment.
  - ✅ Variety contract with fog: 형세판단 is a lens — it transmits and amplifies
    input variety, it does not generate it. Cross-playthrough content variety is
    the fog-of-war-discovery feature's job (random spawn + fog on the authored
    map; no procedural generation needed). 형세판단 is designed to carry it —
    confidence-gated 위협 + the 불확실 axis make readings path-dependent, and the
    `intel.js` MAX_CONFIDENCE 0.90 ceiling + decay forbid an oracle so readings
    stay fresh. An over-legible analyzer is the variety risk.
  - ✅ Stage-1 → stage-2 bridge: attention (surfaced highlights, coverage-
    guaranteed, capped ~5-7) is decoupled from and larger than what one turn can
    act on. The gap (see many, act on few) *is* the stage-1 decision: "of the
    ~5-7 surfaced tensions, which single one do I focus this turn on, and how
    much capacity do I commit?" MVP turn = one *primary* action drawing from a
    single divisible action-capacity pool (ADR 0020): the recommendation prefills
    the average commit, and skill = committing tighter than average and
    redirecting the surplus (economy/scouting). The four-capacity/carryover/
    overclock system stays deferred (ADR 0018); the invariant is budget <
    attention. See ADR 0019, ADR 0020.
- ✅ `Capacity carryover`: Unused action capacity that partially persists into
  later turns as preparation or accumulated work, subject to decay and caps.
- ✅ `Capacity overclock`: Emergency redirection of one action capacity into
  another at reduced efficiency and with opportunity costs.
- ✅ `Emergency human mobilization`: Extreme overclock where non-military
  populations such as scholars, officials, merchants, or workers are pulled into
  direct defense or combat at severe future cost.
- ✅ `Strait`: A narrow sea crossing that can allow limited naval movement,
  blockade, or amphibious attack. Phase 1 allows strait/coast crossing with a
  movement and amphibious combat penalty; port/harbor function reduces the
  penalty. No separate naval capacity or force role in Phase 1. A true naval
  system (naval capacity, blockade, sea movement) is a later-phase candidate.
- ✅ `Active region`: A region currently simulated and presented in detail.
- ✅ `Background region`: A known world-data region that may be abstracted,
  deferred, or summarized until it becomes relevant.
- ✅ `Relevance-filtered log`: Event log presentation based on player
  influence, strategic importance, and recency rather than raw event volume.

## Terrain Concepts

- ✅ `Plain`: High population and tax potential, lower natural defense.
- ✅ `Grain basin`: High food, population growth, and long-term economic value.
- ✅ `Mountain/pass`: High defense, slow movement, supply friction.
- ✅ `River`: Economic and agricultural bonus, crossing penalty in combat.
- ✅ `Coast/harbor`: Trade and naval access; future naval systems can attach
  here.
- ✅ `Steppe/highland`: Lower settled economy, higher mobility and cavalry-style
  strategic pressure.
- ✅ `Frontier basin`: Region with special resource, pass, loyalty, or trade
  value.
- ✅ Province archetype regions are composed from terrain layers; they are not
  terrain types themselves.
- ✅ Province identity uses three lenses: archetype region, terrain layer, and
  settlement/function layer.
- ✅ Phase 1 stat scope is combat + economy basics: population/economy, local
  garrison, defense, movement/crossing constraints, and strategic tags.
- ✅ Governance-heavy values such as loyalty, unrest, inflation, and deep event
  chains are expansion hooks, not first Phase 1 requirements.
- ✅ Attacks should be standing-force centered with offensive mobilization as
  risky support. Defense should combine garrison and local defense.
- ✅ Complexity is acceptable when it creates meaningful choices or readable
  consequences; it should not become repetitive low-level clicking.
- ✅ Strategic posture presets may be intentionally extreme to show risky
  concentrated strategies, but the player should be able to fine-tune choices.
- ✅ Four-capacity carryover and overclock tradeoffs are post-MVP; when
  reintroduced, they should be visible in capacity UI, especially through
  hover/help details.
- ✅ Strong map highlights should be limited to the current turn's most relevant
  locations to avoid visual noise.

## World Direction

Direction, not vocabulary. Most of what this section carried is authoritative
elsewhere, and on 2026-07-28 it became a pointer list rather than a second copy:

- **What the world is** — East Asia-inspired but fictional, referencing real
  geographic patterns (northern plains, river basins, mountain passes, southern
  grain regions, straits, islands, a route toward northern India) without
  becoming a literal historical simulator, and never at the cost of balance and
  readability: `SPEC.md` § World Model holds this, and held it already.
- **Archive-era world scale** — the 50×50 world data, the 25×25–30×30 active
  area, the 30 named provinces drafted in `js/province-data.js`, and their twelve
  archetype regions describe the **reference prototype** (ADR 0041), whose world
  the authored cradle map replaced: 10 regions → 55 sectors → ~292 hexes
  (§ Terrain Cradle below). Stated in the present tense they read as current
  direction, which is exactly why they are a pointer now.

**Unhoused — one live rule with no birthplace** (SPEC proposal owed, Tier 3;
recorded in `docs/SYNC-DEBT.md`):

- ✅ Place naming uses a hybrid policy — large geography may be historically
  legible, while specific provinces generally use fictional East Asian-style
  names. Player-facing names are natural place/geography names, never meta design
  labels using terms equivalent to "-inspired" or "-like."

## Terrain Cradle (Authored Map)

The authored game world: 10 regions → 55 sectors → ~292 hexes, born from
the C-loop authoring sessions (user sketches/edits → agent converts &
measures → user eye-judges). Vocabulary is authored in
`docs/features/terrain-cradle/GLOSSARY.md`; the decision record is
`RULINGS.md` TC-①…⑫; the executable map source is
`mockup/combat-calc/map-gen.js`.

_Last synced from Production 2026-07-07 (C-loop close doc-sync batch),
authoritative source `docs/features/terrain-cradle/` GLOSSARY + RULINGS.
This section summarizes qualitatively; sealed values and ruling history
live in the feature docs, and on any divergence the Production seal is
truth (documentation-law conflict rule)._

- ✅ `Impassable terrain` (공백 지형 · 구칭 void terrain) — the world's single
  "cannot cross", drawn two ways: sea, and sea expressed as land. Canon because
  movement, ownership, and vision all read it. Definition: terrain-cradle
  `GLOSSARY.md` (TC-⑧).
- ✅ `Parity start` (동일 시작 인구) — every region opens on an equal lifetime
  blood budget, so historicity lives in geography, not demographics. Definition
  + sealed populations: terrain-cradle `GLOSSARY.md` (TC-①).
- ✅ `Emergent asymmetry` (파생 비대칭 · 구칭 derived asymmetry) — the general
  form of parity start: a starting inequality is legitimate only where the
  authored map derives it, never baked per-realm. Canon because SPEC Core
  Principle #8 declares it and the economy, fog, and match-arc passes all read
  it. Definition: terrain-cradle `GLOSSARY.md` (TC-⑭; economy's terrain-fed
  inequality TC-③).
- ✅ `Battle-summoning placement` (전장 소환 배치) — the city-placement
  principle: cities go where fighting is invited, and 서역 is the deliberate
  opposite pole. Definition: terrain-cradle `GLOSSARY.md` (TC-⑦).

The battle-resolution layer (turn decision ladder layer 5). One deterministic
computation used three ways: on true state it is the verdict; on fogged band
inputs it is the forecast; inverted over the fog band it is the recommendation.
Structural decisions D1–D11 are in `docs/features/combat-formula/FORMULA.md`;
the fixed vocabulary in `docs/features/combat-formula/GLOSSARY.md`; every dial
value lives in `docs/features/combat-formula/MAGNITUDE.md` (M1–M13). Terms here
are qualitative — numbers are MAGNITUDE's.

_Last synced from Production 2026-07-05 (A-4 B2), authoritative source
`docs/features/combat-formula/` GLOSSARY + MAGNITUDE. This section summarizes;
on any divergence the Production seal is truth (documentation-law conflict rule)._

- ✅ `Resolution pipeline` — the deterministic ratio core: powers multiply out of
  substance and multipliers, R is their quotient, R past the plan's threshold
  stamps the headline, and casualties are paid both ways regardless. Formula:
  combat-formula `GLOSSARY.md` § The pipeline (D5).
- ✅ `R` (전투비, combat ratio) — the central gauge of the deterministic core, and
  a pure quotient of the two powers, which is why odds do not shift with absolute
  army size. Canon because every other resolution term either feeds it or reads
  it. Definition: combat-formula `GLOSSARY.md` (D5).
- ✅ `Troop stock` (병력) / `Unit` (부대) — the two are deliberately split: bodies
  are an integer ledger where casualties are written, 부대 is a display quantum
  only. Definition: combat-formula `GLOSSARY.md` (D2/D3; scale → M1). _Avoid_:
  fractional bodies in logic, treating 부대 as a compute unit.
- ✅ `Command pool` (명령 풀) / `Commitment` (커밋) — per-turn attention that
  refills fully and is identical for every realm size, never converting to
  troops; commitment is the points placed on an action. Canon because it is the
  one realm-size-independent resource, which is what prices expansion break-even
  — the resolution-layer face of `Action capacity`. Definition: combat-formula
  `GLOSSARY.md` (D2/D6; pool size → M1, knee → M2). The pool splits freely and
  main/surplus are magnitude labels rather than roles bound to activity types:
  ADR 0027 (amends ADR 0020).
- ✅ `Lever` (레버) — what commitment buys: a concave activation multiplier on
  substance, with defense holding a baseline at zero commit. Definition:
  combat-formula `GLOSSARY.md` (D8; curve → M2).
- ✅ `Quality` (질) — the weapons/tech/drill multiplier slot, fixed at 1 for the
  MVP; a quality/tech axis is a reserved post-MVP seat whose arrival voids the
  single-tier simplification. Definition: combat-formula `GLOSSARY.md` (D4/D8).
- ✅ `Terrain multiplier` (지형 배수) / `Fortification multiplier` (요새 배수) —
  the two defense multipliers, split by ownership: terrain is world-owned and
  never degrades, fortification is player-built and damageable. Definition:
  combat-formula `GLOSSARY.md` (D6; ladders and caps → M5). See `Sector defense
  layers`.
- ✅ `World product` (세계 곱) — terrain × fortification, raw: the ceiling is the
  natural product of the authored ladders, not an engine clamp. Definition:
  combat-formula `GLOSSARY.md` (M5).
- ✅ `Water penalty` (도하 페널티) — an attack-side multiplier for crossing water;
  water never strengthens the defender, and port/harbor staging mitigates it.
  Definition: combat-formula `GLOSSARY.md` (ADR 0015 amended; values → M5). See
  `Strait`.
- ✅ `Frontage` (협로/강습 폭) — a cap on the engaged attacker body at authored
  chokes and wall assaults: it classifies, never multiplies, and every choke
  carries a mandatory removal path. Definition: combat-formula `GLOSSARY.md`
  (D9; capacities → M5/M11).
- ❓ `반도이격` (strike at half-crossing) — a force caught mid-crossing engages
  with a split body and counts the water side as blocked escape. Definition:
  combat-formula `GLOSSARY.md` (engaged fraction → M4).
- ✅ `Threshold` (문턱) — the per-plan R at which a plan's core intent lands; it
  gates *stamps only*, never blood and never availability. Canon because the
  fogged-R rule rests on it: attacking below threshold stays legal precisely
  because the system never sees the true R. Definition: combat-formula
  `GLOSSARY.md` (D4/D11; values → M7). _Avoid_: threshold as an availability
  gate.
- ✅ `Headline` (헤드라인) / `Margin` (마진) — the binary did-the-intent-land, and
  R − threshold as its depth. Definition: combat-formula `GLOSSARY.md` (D4).
- ✅ `Casualty curve` (사상자 곡선) — one shared curve of R applied both
  directions, success and failure alike, which is what makes grinding
  unprofitable by arithmetic rather than by rule. Definition: combat-formula
  `GLOSSARY.md` (Lanchester-shaped; base rate and exponent → M4).
- ✅ `Rout cliff` (궤주 절벽) — organizational collapse for the headline loser
  only, triggered inside a single engagement: atomic, no cross-battle
  accumulation. Definition: combat-formula `GLOSSARY.md` (threshold → M4).
- ✅ `Escape state` (도주 상태) — a derived OPEN/BLOCKED check at the moment of
  rout, never stored; water never counts as escape. The land-derived doctrine's
  resolution-layer precedent. Definition: combat-formula `GLOSSARY.md` (M4). See
  `Position as product`.
- ✅ `Isolation gate` (고립 게이트) — one boolean serving two jobs at once: it
  admits the Encirclement plan and it blocks a rout's escape. Canon because it
  invents no state, deriving both from stamps that already exist. Definition:
  combat-formula `GLOSSARY.md` (catalog, D10).
- ✅ `Effect axes / stamps` (효과 축 / 도장): the six per-axis one-shot effects
  stamped into persistent state on success — the same concept as `Operation
  effect axis` above; ongoing consequences belong to `Standing world rule`, not
  to the stamp re-applying (ADR 0024/0026; magnitudes → M-pass).
- ✅ `Standing rules` (상비 규칙): the combat-layer name for `Standing world rule`
  — per-turn world processes that read persistent state: continuous starvation
  (a supply-ledger pump whose sole output is convex substance loss — no stages,
  no capability flips; the D4 staged severity holding→attack-incapable→defenseless
  is superseded, war-model slice-2 §2), recovery (gated by supply and ground —
  scorched ground denies it). Starvation must outpace an
  unsupplied 2–3-sector advance (rates → M-pass; ADR 0026; the emergent siege is
  this pump, war-model slice-2 ticket 06).
- ✅ `Forecast` (예보) / `Recommendation` (추천) / `Preset pin` (프리셋 핀) — the
  same computation run on fog, three ways: read forward as a band, inverted into
  a required-commit band, and pinned where the slider prefills. Confidence is
  capped — no oracle. Definition: combat-formula `GLOSSARY.md` (D1/D7; cap and
  pin → M3). See `js/intel.js` and the fog-of-war-discovery feature.
- ✅ `Emergency reserve` (긴급 투입 / 예비대) — a third surplus outlet: points
  bound before sealing that auto-answer an own sector attacked without a primary
  defense. Canon for its grammar — points buy an *awakening fraction* of the
  stock geography already placed there, never absolute bodies (진관 grammar).
  Definition + dials: combat-formula `MAGNITUDE.md` M9.
- ✅ `Mobilization visibility` (동원 가시성) — force concentration leaks intent, so
  a first-strike buildup is partly readable rather than a free surprise. Canon
  because it is what prices the scout-vs-conceal economy against the surprise
  premium. Definition + dials: combat-formula `MAGNITUDE.md` M10 (survey:
  `research/first-strike-and-mobilization-visibility.md`).
- ✅ `Surrender harvest` (항복 수확) — an Encirclement success discounts the
  winner's *own* casualties: a surrounded army capitulates cheaply (the Ulm
  effect) instead of selling its life dear. Definition + discount: combat-formula
  `MAGNITUDE.md` M6/M8.
- ✅ `Feint follow-up` (양동 후속타) — emergent play, not a mechanic: draw a
  province's reserve toward sector A, then hit the thinned sector B. Named
  because the skill gate is the attacker's scouting. Definition: combat-formula
  `MAGNITUDE.md` M10.
- ✅ `Attack axis as numeraire` (기축통화 원칙) — the pricing principle that the
  attack axis is the game's reserve currency: defense, information, and static
  investment are priced by what they *save or deny* in attack currency, so none
  needs an independent value survey. The force-side counterpart of the economy's
  `Yield` unit. Definition: combat-formula `MAGNITUDE.md` M8 (method principle).

## Match Arc and Settlement

> **⛔ VICTORY MODEL SUPERSEDED — 1v1 duel pivot (ADR 0042, 2026-07-24).** The
> game is now a **two-realm head-to-head duel won by capturing the enemy
> capital** — the sole win condition. Current truth: **ADR 0042** +
> `docs/features/capital/` (CP-②) + the duel-pivot ledger
> (`.scratch/l3-playable-seam/`). Much of this section describes the SUPERSEDED
> multi-realm victory era; it is retained as historical context, not current
> truth. Read each row against this split:
> - **SUPERSEDED** (multi-realm victory machinery, no consumer in a duel):
>   `Match` (as hegemony arc), `Realm count 4–6`, the multipolar
>   Warring-States/Three-Kingdoms geometry, `Match arc as design budget`
>   (2–3 wars), `Decision point`, `Hegemony decision point`, `Projectable
>   mass`, the `hermit clause`, the settlement-as-match-terminus cluster
>   (`Settlement`, `Settlement currencies`, `Reach`, `Acceptance arithmetic`,
>   `Vassalage`), and **all six winning archetypes** (derived from the hegemony
>   inequality). Rows below carry an inline `⛔` stamp.
> - **SURVIVES** (realm-internal / combat, force-count-independent, affirmed at
>   pivot Gate 5): the combat spine (`Engagement`, `Operation`, `War` as a
>   scale label, `Shield-break`, `Decisive battle`, `Field army`, `Cascade`),
>   `Mature-state start`, `Recruitment`, `Conscription register`, `Blinds`
>   (already retired MT-⑤), `Test-trust ladder`, `Attack axis as numeraire`.
>   In 1v1, war and match are one; field-army destruction and settlement
>   become pressures toward capital fall, not independent match-terminators.

The layer above battle resolution: how a full match arcs from opening standoff
to a hegemony settlement. Vocabulary is authored in
`docs/features/match-arc/GLOSSARY.md` (promoted here); the winning archetypes
that gate every value are in `docs/features/match-arc/STRATEGY-SPACE.md`; dials
live in `docs/features/combat-formula/MAGNITUDE.md` (M8–M13). Status: ✅ = AGREED
wording, ❓ = PROPOSED (awaiting grill).

_Last synced from Production 2026-07-07 (C-loop close: parity/asymmetry
row re-cut from terrain-cradle TC-①/②; rest 2026-07-05 A-4 B2),
authoritative sources `docs/features/match-arc/` and
`docs/features/terrain-cradle/` GLOSSARY + RULINGS. This section summarizes
qualitatively; sealed dial values and ruling history live in the feature docs,
and on any divergence the Production seal is truth (documentation-law conflict
rule)._

### Arc ladder (scale layers)

- ✅ `Engagement` (교전) — one click, one turn: the resolution layer above.
  Definition: match-arc `GLOSSARY.md` § The arc ladder.
- ❓ `Operation` (작전) — a shield-break or siege arc, and a scale label only: it
  names an emergent chain of atomic one-turn resolutions, never a persistent
  multi-turn operation object (ADR 0026). Definition: match-arc `GLOSSARY.md`.
- ❓ `War` (전쟁) — declaration → settlement, and *decided* by field-army
  destruction rather than by grinding occupation to completion. Definition:
  match-arc `GLOSSARY.md` 전쟁.
- ❓ `Match` (매치) — **⛔ Superseded (ADR 0042):** a match is now a 1v1 duel to
  capital fall, so war and match are one and the pre-war-standoff →
  hegemony-settlement arc is gone. Duration + turn band: pivot Gate 6 (D6.4,
  duel-pivot ledger). Historical definition: match-arc `GLOSSARY.md` 매치.

### Match structure (frame decisions, AGREED 2026-07-03)

- ✅ `Full adjacency, no neutral zones` — the map is fully partitioned from turn
  1, so there is no expand-into-empty-land opening: the envelope has no room for
  it and the `Uncertainty duel` needs live neighbors immediately (ADR 0025).
  Definition: match-arc `GLOSSARY.md` § Frame decisions.
- ✅ `Realm count 4–6 (authoring default 5)` — **⛔ Superseded (ADR 0042):** the
  duel has EXACTLY TWO realms, so realm count is decided rather than an
  authoring variable. Historical definition: match-arc `GLOSSARY.md` § Frame
  decisions.
- ✅ `Viability parity, geometry/economy asymmetry` — **⛔ Multipolar geometry
  superseded (ADR 0042):** the Warring-States / Three-Kingdoms shape (中原 center
  + coalition-capable periphery) has no referent in a two-realm duel. What
  SURVIVES is the underlying principle: parity start / `Emergent asymmetry`, with
  asymmetry living in geometry and economy — which the parallel 1v1 map pass
  re-expresses for two realms. Historical definition: match-arc `GLOSSARY.md`
  § Frame decisions (terrain-cradle TC-①/TC-⑭, SPEC Core Principle #8).
- ✅ `Match arc as design budget` — **⛔ Superseded (ADR 0042):** war and match
  are one in the duel, so there is no ~2–3-war budget and no hegemony-settlement
  terminus; length is player-paced to capital fall (pivot Gate 6 D6.4).
  Historical definition: match-arc `GLOSSARY.md` § Frame decisions.
- ❓ `Mature-state start` — realms begin as functioning states, fortresses
  standing and armies raised, because a from-zero opening would spend the whole
  envelope on construction. Definition: match-arc `GLOSSARY.md` § Frame
  decisions (cost comparison → M5).

### Arc phases and settlement

- ✅ `Match arc` (매치 아크) — **⛔ Superseded (ADR 0042):** the duel has no
  multi-war phase curve and no decision-point/settlement terminus. Historical
  definition: match-arc `GLOSSARY.md` 매치 아크.
- ✅ `Shield-break` (방패 깨기) — a war's first phase, spent against the
  fortification belt rather than against an army. Canon because it relocates
  where wars are won: the mass ratio standing at that belt before the first shot
  is what largely settles the outcome, which makes the buildup turns part of the
  war. Definition: match-arc `GLOSSARY.md` 방패 깨기 (sealed 2026-07-13, WM-①;
  built in `js/battle.js`).
- ✅ `Decisive battle` (결전) — the second phase, once the belt is open: army
  against army, with the interior as the prize. Canon because it is where a war
  is *decided*, as distinct from where its territory is later collected.
  Definition: match-arc `GLOSSARY.md` 결전 (sealed 2026-07-13, WM-①).
- ✅ `Field army` (야전군) — a realm's mobile main force and the player's device
  for controlling R: geometry-bound, freely divisible, its reach/pinning the
  switch between 결전 and a front's fall. Definition: match-arc `GLOSSARY.md`
  야전군 (sealed 2026-07-13, WM-①; amended 2026-07-14, WM-②).
- ❓ `Cascade` (연쇄 붕괴 · 구칭 캐스케이드) — the third phase: collecting the
  territory a decided war has already earned, cheaply. Canon as a design
  constraint rather than only a mechanic — it is where winning is *felt*, so no
  ending grammar may amputate it. Definition: match-arc `GLOSSARY.md` 연쇄 붕괴
  (renamed 2026-07-13, WM-①).
- ✅ `Decision point` (결정점) — **⛔ Superseded (ADR 0042):** the duel has no
  irreversibility-check terminus; the match ends ONLY on capital fall (pivot
  D3.1), and anti-fizzle is structural (mutual exposure + land-derived decay)
  rather than a detected moment. Historical definition: match-arc `GLOSSARY.md`
  결정점.
- ✅ `Hegemony decision point` (패권 결정점) — **⛔ Superseded (ADR 0042):** the
  keystone multi-realm win rule, retired outright. A two-realm duel has no
  coalition and no "balance" to survey, so leadership + unassailability have no
  referent. Historical definition + dials: match-arc `GLOSSARY.md` 패권 결정점 /
  `RULINGS.md` ⑨⑪⑮⑰.
- ✅ `Projectable mass` (투사 가능 질량) — **⛔ Stale as a victory input (ADR
  0042):** it existed to feed the retired hegemony arithmetic. The underlying
  reading — mass a realm can actually deliver beyond its own shield, derived
  through exit-choke geography and never stored — survives as an
  operational/combat notion (reach cones), but is no longer a win-condition term.
  Definition: match-arc `GLOSSARY.md` 투사 가능 질량 / `RULINGS.md` ⑩.
- ✅ `In/out of the balance — hermit clause` (판세 안/밖 · 은둔국 조항) —
  **⛔ Superseded (ADR 0042):** coalition sums and a leadership denominator are
  multi-realm constructs with no referent in a two-realm duel. Historical
  definition: match-arc `GLOSSARY.md` 판세 안/밖 · 은둔국 조항.
- ✅ `Settlement` (정산) — **⛔ Superseded as a match-terminus (ADR 0042):** the
  duel ends ONLY on capital fall (D3.1), so there is no 패권 정산 concluding the
  match and — war being the match — no inter-war 전쟁 정산 either. Whether a
  reduced concession/surrender affordance survives is deferred to the capital /
  turn-structure passes. Historical definition: match-arc `GLOSSARY.md` 정산.
- ✅ `Settlement currencies` (정산 통화) — **⛔ Superseded (ADR 0042):** the
  settlement menu was a war-terminus mechanic, and the duel's terminus is capital
  fall rather than a priced bundle. Historical definition: match-arc
  `GLOSSARY.md` 정산 통화 / `RULINGS.md` ⑭.
- ✅ `Reach` (도달권) — **⛔ Stale as a settlement-price base (ADR 0042):** with no
  priced settlement terminus, reach no longer prices anything. The underlying
  spatial reading (what the army could take before resistance re-forms, and the
  wider raidable zone) survives as an operational/combat notion — reach cones,
  occupation-geography — not a settlement currency. Definition: match-arc
  `GLOSSARY.md` 도달권.
- ✅ `Acceptance arithmetic` (수락 산술) — **⛔ Superseded (ADR 0042):** there is no
  settlement bundle for a loser to accept. Historical definition: match-arc
  `GLOSSARY.md` 수락 산술 / `RULINGS.md` ⑫⑬.
- ✅ `Vassalage / capitulation` (복속) — **⛔ Superseded (ADR 0042):** vassalage
  moved a loser's mass into the hegemony arithmetic, a multi-realm currency with
  no referent in a duel whose sole terminus is capital fall. Historical
  definition: match-arc `GLOSSARY.md` 복속 / `RULINGS.md` ⑭⑯.
- ✅ `Recruitment` (모병) — the single MVP economy→mass conversion: a primary
  action moving bodies from the register into serving, paid from treasury yield
  and priced by the Surge Draft Model rather than a flat rate. Canon because it
  is the only channel by which economy becomes force. Definition + the
  force-adjustment stack: match-arc `GLOSSARY.md` 모병 / `RULINGS.md`
  MT-①/③/⑥ (garrison replenishment: ADR 0045; rates → M13).
- ✅ `Conscription register` (징집 명부 · 구칭 인력 풀 / manpower pool) — the total
  living draftable bodies a realm holds: land-derived, finite within a match, and
  shrunk only by death, which is what makes blood a permanent currency.
  Definition + accounting: match-arc `GLOSSARY.md` 징집 명부 / `RULINGS.md`
  MT-②/⑥ (dials → M13).
- ⛔ `Blinds` (블라인드) — the anti-safe-play escalation thread ADR 0025 parked
  here, **retired as a standalone mechanism (2026-07-08 MT-⑤)**: the escalation
  duty is carried through force-geography + the hegemony bar instead.
  Authoritative status + history: match-arc `GLOSSARY.md` 블라인드 / `RULINGS.md`
  MT-⑤. _(Row status corrected 2026-07-10, F-01; marker ✅ → ⛔ 2026-07-27 with
  the birthplace status word normalized to `rejected-recorded`.)_
- ✅ `Test-trust ladder` (검증 신뢰 사다리) — the four-rung verification
  epistemology (L0 hand reasoning → L3 human playtest) whose defining property is
  asymmetric proof power: found-at-a-rung is real, not-found is nothing. Canon
  because every feature's seals carry its L-stamp. Charter:
  `docs/features/match-arc/TEST-LADDER.md`; term row: match-arc `GLOSSARY.md`.

### Winning archetypes (STRATEGY-SPACE.md — the value-dial checklist)

> **⛔ Superseded framing (ADR 0042).** These six were derived backward from the
> **hegemony inequality** — a multi-realm construct with no referent in a
> two-realm duel. Three depend directly on a coalition / third party and are DEAD
> outright (복속 사슬형, 어부지리형, 약탈 소모형, 중원 내선형); the other two lose
> their multi-realm justification (정복 축적형's cascade economics survive as
> combat, but not as a coalition-mass race; 방패 우위형's unassailability target is
> gone). The duel's own strategy space (forward/rear leverage-vs-variance,
> mutual-exposure timing, capital-encirclement vs decisive battle) is authored at
> the capital / turn-structure passes, not here. Retained below as historical
> context.

_(Historical framing:_ derived backward from the hegemony inequality; before
sealing any value, ask "which archetype does this kill?" — the check the
mechanics had to keep alive._)_

1. `정복 축적형` (conquest snowball) — cascade economics; conquest ≈ 30:1 over raiding.
2. `복속 사슬형` (vassal chain) — 복속 moves coalition mass to my side of the balance.
3. `어부지리형` (free-rider timing) — wait out AI-vs-AI wars, harvest on timing.
4. `약탈 소모형` (raid attrition) — burn to lower the coalition's reachable mass.
5. `방패 우위형` (shield-first) — buy cheap unassailability to fund aggression
   (not the turtle; the leadership condition rejects pure turtling).
6. `중원 내선형` (interior lines) — defeat coalition members in detail from the
   center seat.

Cross-cutting skill multiplier (not a seventh archetype): deception/information
— the opt-in skill ceiling that sits on top of any archetype.

## Resolved Phase 1 Decisions

**These are reference-prototype decisions, not current direction.** The
prototype is an archive (ADR 0041) and the L3 build does not inherit its world:
the authored cradle map replaced the 30-province draft. This section is a
pointer list only — folded from seven restated bullets on 2026-07-27, because a
glossary is not where decisions live and an archive-era decision restated in the
present tense reads as current.

- **World shape** — map size, the seven-type terrain taxonomy, the 30 named
  provinces, their archetype coverage, and province primary function: ADR 0003
  and the archive's own data (`js/domain-data.js`, `js/province-data.js`).
- **Local garrison sustainment** — ADR 0014, amended by the front-sector model
  in ADR 0022. Term: `Local garrison`.
- **Strait movement** — penalty-based crossing, port mitigation, no Phase 1
  naval system. Term: `Strait`.

What the archive is and is not: ADR 0041. Do not restate it here.

## Open Questions

A glossary is not a queue. Live work is tracked in `.scratch/<tracker>/` —
`l3-playable-seam/map.md` for the decision gates, `l3-playable-build/` for the
tickets — and per-feature questions live in each feature's `INDEX.md`.

Three questions this section carried were **archive-era** and closed with the
world they asked about: background-region activation triggers (ADR 0003 —
answered by the authored cradle map, which has no dormant regions), and both
province questions (secondary functions, numeric balancing across the 30
provinces) — the 30-province draft is reference-prototype data, ADR 0041.

One is genuinely open and has no owner yet (placement owed, recorded in
`docs/SYNC-DEBT.md`):

- ❓ Whether a true naval system (naval capacity/force role, blockade, sea
  movement) arrives in a later phase. Phase 1's answer is settled — penalty-based
  crossing with port mitigation and no naval system (ADR 0015, `Strait`) — but
  whether the full system ever lands is a roadmap question, not a Phase 1 one.
