# Terrain Game Domain Map

Markers:

- ✅ Verified or accepted in the current project direction.
- ❓ Assumption or proposed concept requiring validation.
- ⛔ Forbidden or rejected direction.

This file is Tier 0 of the Vocabulary Law — the promoted, project-wide
canon. The law itself (definition tiers, single-definition rule,
naming, promotion, the generated Quick Reference) lives in
`.claude/rules/documentation-law.md` § Vocabulary Law.

## Design Principle

- ✅ `Land-derived state` (모든 것은 땅에서 파생된다) — **user-confirmed
  2026-07-05 (A-3 session)**: substance is never stored where it can be
  derived from the land the realm holds. Income = Σ sector economy ×
  usable; national cap = capPerPop × Σ sector population × usable;
  projectable mass = min(field, Σ door width × flow); shield mass =
  facing-front garrisons from adjacency; reserve awakening = the
  province's route-connected stock (march-worn on arrival); the
  manpower pool travels with territory; usable value is the land's
  current condition. Consequences arrive free of extra rules: conquest
  raises the cap at a discount (fresh captures are 50/60% usable),
  raids shrink the victim's cap, geography prices power projection.
  The terrain-first thesis (SPEC) made mechanical; the escape-state
  doctrine (도주로 is derived at rout time, never stored) is its
  resolution-layer precedent. **Named exception (deliberate): the
  command pool.** Attention is realm-size-independent (20 points) —
  the land gives the body, the player gives the mind; this is what
  prices expansion break-even and keeps the vassal seat a complete
  game. **MVP boundary (reserved seat)**: realm-level recruitment
  abstracts muster geography (recruits join the field army directly);
  the province-level grammar (M9 awakening + march effect) is the
  extension point if muster location ever needs to matter.

## Core Terms

- ✅ `Map unit`: A playable geographic unit. Currently rendered as a hex, but
  should be designed so it can later become an irregular province.
- ✅ `Terrain-first`: Geography determines combat, economy, population, and
  movement before political control is applied.
- ✅ `Faction`: A political actor controlling map units.
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
  economy or population value. As an MVP placeholder, newly captured sectors
  start at 50% usable economy and 60% usable population, recovering by 10
  percentage points per stable turn while not contested. A `stable turn` means
  the sector ends the turn under the same faction, was not contested during that
  turn, and was not the target of active attack/defense resolution. These values
  are playtest-tunable and should not be treated as a full governance or
  occupation model.
- ✅ `Yield` (생산): the economy's base unit — the **기본 생산량**: one ordinary
  front sector at full usable produces 생산 1 per turn. The common measure of
  cost and asset across the whole game (1 부대 = 생산 0.5; walls = 생산 6 +
  2 primaries; raid loot ≈ 생산 1.5). Income = Σ economyValue × usableEconomy;
  national cap = 600 × Σ populationValue × usablePop (land-derived state
  principle). Dials and prices: MAGNITUDE M14. Namespace note: the
  documentation law's Production (생산) layer is docs-governance — in game
  docs 생산 means only this unit. **AGREED (2026-07-05, A-3 rulings ⑱–㉑)**
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
  (`localGarrison` only; temporary, regenerates while economy/population survive,
  `militaryValue` unchanged), `fortificationDamage` (`fortificationDefense`),
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
- ✅ `Operation plan catalog`: The authored set of operation plans, defined
  schema-first. Each plan is a fixed record: `name`, `availabilityConditions`,
  `effectAxes` (a magnitude per operation effect axis), and `riskProfile`. There
  is no authored "target traits" field — fit to a sector is derived by matching
  `effectAxes` against the sector's value profile, so recommendation ranking
  surfaces fit automatically. `availabilityConditions` gate on physical
  applicability only (reachability, target presence, required elements); being
  ill-advised never hides a plan — advisability is expressed through fit ranking
  and forecast (ADR 0024). Concrete plan content is authored later; the schema
  is fixed now (ADR 0024).
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
- ✅ `Position as product`: The MVP has no standalone move action and no
  tracked army counters. Position is a *product* of operations: taking a
  sector or opening a route changes what is reachable next turn, and
  availability gates read that position (adjacency, routes, water
  boundaries). Crossing/landing is an attack plan whose fiction is movement
  under fire — the turn is spent forcing the passage; its products are the
  far-bank sector and an opened route, and the inland attack is the next
  turn's separate decision from the new position. Hexes keep doing movement
  *math* (reachability, ADR 0015 penalties) as calculation substrate.
  _Avoid_: a generic move order, hex-by-hex marching, movement turn-tolls
  before attacks (a scripted two-turn sequence violates atomic turn
  resolution).
- ✅ `Standing world rule`: A per-turn world process that reads persistent
  state and applies consequences without consuming any faction's action
  capacity (ADR 0026). Phase-1 instances: usable-value recovery (ADR 0022),
  local-garrison regeneration, fog confidence decay, and supply starvation —
  a supply-cut sector degrades in staged severity each turn until the route
  state is repaired (stages/rates are combat-pass dials). Plans stamp state
  once; standing rules are how time itself matters. _Avoid_: plan effects
  that re-apply across turns.
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
  - ✅ Posture is a lens, truth is invariant: the reading has three layers —
    truth (which provinces are 위협/기회/불확실 and their magnitude;
    posture-invariant), salience (posture tilts order/emphasis of the finite
    top-N), recommendation (posture shapes the prefilled command). Posture never
    edits truth. Hard constraints: (a) coverage — every non-empty axis keeps at
    least one surfaced highlight; (b) legibility — collapsed counts are always
    shown ("정비 자세 · 위협 3건 접힘"); (c) dissonance — a strong posture↔truth
    mismatch surfaces first. The dissonance signal is a concrete first piece of
    the OPEN skill edge (SPEC pillars 2-3).
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

- ✅ The world is fictional and East Asia-inspired.
- ✅ Real Chinese and East Asian geography should strongly inform terrain
  placement.
- ✅ The world should leave expansion slots for straits, islands, maritime
  powers, northern steppe pressure, and a northern India route.
- ✅ Large world data such as 50x50 is acceptable if the playable and simulated
  scope opens progressively.
- ✅ The first active Phase 1 campaign area is 30x30, centered on central
  plains, southern grain regions, and northern frontier terrain, within the
  accepted 25x25 to 30x30 range. World data scale remains 50x50.
- ✅ The first active Phase 1 area uses 30 named provinces, drafted in
  `js/province-data.js` and subject to balancing, layered over terrain/map
  units. They span all twelve accepted archetype regions.
- ✅ Place naming uses a hybrid policy: large geography may be historically
  legible, while specific provinces generally use fictional East Asian-style
  names.
- ✅ Player-facing province names should be natural place/geography names, not
  meta design labels using terms equivalent to "-inspired" or "-like."
- ⛔ Do not model a literal historical map so strictly that gameplay balance and
  readability become secondary.

## Combat Resolution

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

- ✅ `Resolution pipeline`: `attack power = troop stock × lever(commit) ×
  quality × plan/matchup mods × water penalty`; `defense power = garrison ×
  lever × terrain × fortification`; `R = attack ÷ defense`. R past the plan's
  threshold stamps the headline; casualties are paid both ways regardless of the
  headline.
- ✅ `R` (전투비, combat ratio): attack power ÷ defense power; scale-invariant
  (same odds at any absolute size). The central gauge of the deterministic core
  (D5).
- ✅ `Troop stock` (병력) / `Unit` (부대): actual bodies are an integer ledger at
  the front sector where casualties are written; the unit (부대) is a display
  quantum only, never used in logic (D2/D3; scale → M1). _Avoid_: fractional
  bodies in logic, treating 부대 as a compute unit.
- ✅ `Command pool` (명령 풀) / `Commitment` (커밋): per-turn attention that
  refills fully and is identical for every realm size (never converts to
  troops); commitment is the points placed on one action. Both sides use the
  same grammar (D2/D6). This is the resolution-layer face of `Action capacity`.
- ✅ `Lever` (레버): what commitment buys — an activation/direction multiplier on
  substance, concave (early points buy more than late) with a knee and a
  ceiling; defense holds a baseline lever at zero commit (D8; curve → M2).
- ✅ `Quality` (질): the weapons/tech/drill multiplier slot. The MVP fixes
  quality = 1 (a single troop tier); a quality/tech axis is a reserved post-MVP
  seat whose arrival voids the single-tier simplification (D4/D8).
- ✅ `Terrain multiplier` (지형 배수) / `Fortification multiplier` (요새 배수):
  defense multipliers. Terrain is world-owned and never degrades; fortification
  is player-built and damageable (a `fortificationDamage` stamp lowers it and
  widens assault frontage). Ladders and caps → M5. See `Sector defense layers`.
- ✅ `World product` (세계 곱): terrain × fortification, raw — no engine clamp;
  the ceiling is the natural product of the authored ladders (M5).
- ✅ `Water penalty` (도하 페널티): an attack-side multiplier when the attack
  crosses water; water never strengthens the defender, and port/harbor staging
  mitigates it (ADR 0015 amended; values → M5). See `Strait`.
- ✅ `Frontage` (협로/강습 폭): a cap on the engaged attacker body at authored
  chokes and wall assaults — it classifies, never multiplies, and every choke
  carries a mandatory removal path (D9; capacities → M5/M11).
- ❓ `반도이격` (strike at half-crossing): a force whose same-turn flow is
  crossing water, if intercepted, engages with a split body and the water side
  counts as blocked escape (candidate; engaged fraction → matchup stage, M4).
- ✅ `Threshold` (문턱): the per-plan R at which the plan's core intent lands. It
  gates *stamps only* — never blood, never availability. Attacking below
  threshold is always legal (priced by the casualty curve, ADR 0021 chosen
  risk); the system cannot pre-judge failure because it only ever sees the fogged
  R band. Threshold values are public doctrine; fog hides the enemy's actual
  strength (D4/D11; values → M7). _Avoid_: threshold as an availability gate.
- ✅ `Headline` (헤드라인) / `Margin` (마진): the headline is the binary — did the
  core intent land (sector taken / repulsed). Margin is R − threshold; it buys
  lower winner casualties and deeper stamps (D4).
- ✅ `Casualty curve` (사상자 곡선): one shared curve of R applied both directions,
  success and failure alike — the winner's losses fall as R rises, the loser's
  climb. Grinding is unprofitable by arithmetic (Lanchester-shaped; base rate and
  exponent → M4).
- ✅ `Rout cliff` (궤주 절벽): organizational collapse for the headline loser only,
  triggered when its losses cross a casualty fraction within the engagement
  (atomic — no cross-battle accumulation; threshold → M4).
- ✅ `Escape state` (도주 상태): a derived check at the moment of rout, never
  stored — OPEN if an adjacent non-water friendly/neutral route exists and the
  isolation gate is unsatisfied, else BLOCKED. Water never counts as escape; a
  BLOCKED rout annihilates with no regeneration debt (M4). See `Position as
  product`.
- ✅ `Isolation gate` (고립 게이트): supply already cut OR all approaches
  enemy-held — the availability gate for Encirclement and the escape-blocker.
  Boolean, read from existing stamps (catalog, D10).
- ✅ `Effect axes / stamps` (효과 축 / 도장): the six per-axis one-shot effects
  stamped into persistent state on success — the same concept as `Operation
  effect axis` above; ongoing consequences belong to `Standing world rule`, not
  to the stamp re-applying (ADR 0024/0026; magnitudes → M-pass).
- ✅ `Standing rules` (상비 규칙): the combat-layer name for `Standing world rule`
  — per-turn world processes that read persistent state: starvation stages
  (holding → attack-incapable → defenseless), garrison regeneration, recovery.
  Starvation must outpace an unsupplied 2–3-sector advance (rates → M-pass;
  ADR 0026).
- ✅ `Forecast` (예보) / `Recommendation` (추천) / `Preset pin` (프리셋 핀): the
  same computation run on fog. Forecast = R band + expected losses + escape-state
  line on fogged inputs; recommendation = the formula inverted (threshold →
  required-commit band); preset pin = where the slider prefills inside that band
  (safe end). Confidence is capped at 0.90 — no oracle (D1/D7, M3). See
  `js/intel.js` and the fog-of-war-discovery feature.
- ✅ `Emergency reserve` (긴급 투입 / 예비대): a third surplus outlet — points
  bound before sealing that auto-answer an own sector attacked without a primary
  defense. Route-connected stock within the province rushes in, fights this turn
  at reduced effectiveness (forced-march), and stays garrisoned after (not
  single-use). Points buy an *awakening fraction* of the stock insurance
  geography placed there, never absolute bodies (진관 grammar). Dials (awakening
  rate, forced-march effectiveness, knee) → combat-formula MAGNITUDE M9.
- ✅ `Mobilization visibility` (동원 가시성): force concentration leaks intent — a
  massing army raises a banded tension signal with a short lead time, so a
  first-strike buildup is partly readable rather than a free surprise. Prices the
  scout-vs-conceal economy over the surprise premium (M10; survey in
  `docs/features/combat-formula/research/first-strike-and-mobilization-visibility.md`).
- ✅ `Surrender harvest` (항복 수확): an Encirclement success discounts the
  winner's *own* casualties — a surrounded army that cannot escape capitulates
  cheaply (the Ulm effect) instead of selling its life dear. Discount value →
  combat-formula MAGNITUDE M6/M8.
- ✅ `Feint follow-up` (양동 후속타): emergent play, not a mechanic — strike sector
  A to draw a province's reserve toward it, then hit the thinned sector B.
  Emerges from tension granularity + reserve triage + observable post-hoc troop
  movement; the skill gate is the attacker's scouting (M10).
- ✅ `Attack axis as numeraire` (기축통화 원칙): the pricing principle that the
  attack axis is the game's reserve currency — defense, information, and static
  investment are priced by what they *save or deny* in attack currency, so they
  need no independent value survey (combat-formula method principle, M8). The
  force-side counterpart of the economy's `Yield` unit.

## Match Arc and Settlement

The layer above battle resolution: how a full match arcs from opening standoff
to a hegemony settlement. Vocabulary is authored in
`docs/features/match-arc/GLOSSARY.md` (promoted here); the winning archetypes
that gate every value are in `docs/features/match-arc/STRATEGY-SPACE.md`; dials
live in `docs/features/combat-formula/MAGNITUDE.md` (M8–M13). Status: ✅ = AGREED
wording, ❓ = PROPOSED (awaiting grill).

_Last synced from Production 2026-07-05 (A-4 B2), authoritative source
`docs/features/match-arc/` GLOSSARY + RULINGS. This section summarizes
qualitatively; sealed dial values and ruling history live in the feature docs,
and on any divergence the Production seal is truth (documentation-law conflict
rule)._

### Arc ladder (scale layers)

- ✅ `Engagement` (교전): one click, one turn — the resolution layer above.
- ❓ `Operation` (작전): a shield-break or siege, ~3–6 turns.
- ❓ `War` (전쟁): declaration → settlement, ~8–12 turns. A war is *decided* by
  field-army destruction (shield-break → decisive battle → cascade), never by
  grinding occupation to completion.
- ❓ `Match` (매치): pre-war standoff → hegemony settlement, ~15–25 turns /
  30–40 min (the wall-clock envelope is the binding target; turn count is a
  derived estimate). A match, not a campaign.

### Match structure (frame decisions, AGREED 2026-07-03)

- ✅ `Full adjacency, no neutral zones`: every realm starts bordering its
  neighbors; the map is fully partitioned from turn 1. No expand-into-empty-land
  opening — the envelope has no room for it and the `Uncertainty duel` needs live
  neighbors immediately (ADR 0025).
- ✅ `Realm count 4–6 (authoring default 5)`: the partition is decided by
  authored terrain cradles (basin, shielded valley, plain, coast); 4–6 is the
  verification condition on how many viable cradles the active region holds, not
  an imposed cut.
- ✅ `Viability parity, mass/geometry asymmetry`: what is balanced is
  survivability, not mass. A multipolar Warring-States / Three-Kingdoms shape
  with one "small 중원" — a richer center that pays in multi-front exposure;
  periphery realms are smaller but shielded and coalition-capable. Whoever takes
  the center inherits its exposure (the anti-snowball loop). No realm is
  one-war-killable from turn 1 without buildup (~1.7 shield-mass ratio is the
  sizing tool; values → battery).
- ✅ `Match arc as design budget`: buildup cost, war length, and the hegemony
  threshold are tuned so one player's hand fights ~2–3 wars per match; the match
  ends at the hegemony settlement. A tuning target, never a mechanical cap — the
  arithmetic prices out a fourth war, no rule forbids it.
- ❓ `Mature-state start`: realms begin as functioning states — fortresses
  standing at historical chokes, armies raised. A from-zero opening would spend
  the whole envelope on construction (a legendary fortress alone ≈ a third of a
  match, M5).

### Arc phases and settlement

- ✅ `Match arc` (매치 아크): the phase curve a match traverses — standoff →
  buildup → first war → realignment → deciding war → decision point →
  settlement.
- ❓ `Shield-break` (방패 깨기): the opening operation of a war — reducing the
  border fortification line that shields a realm's interior (erosion or bypass).
  The pre-war mass ratio at the shield largely decides the war.
- ❓ `Decisive battle` (결전): the field engagement that destroys the defender's
  field army once the shield is open; after it, the interior cascades.
- ❓ `Cascade` (캐스케이드): the post-decision sweep — ordinary sectors fall in
  one-turn takes against garrison-only defense. The victory lap that makes
  winning *felt*; ending grammar must not amputate it.
- ✅ `Decision point` (결정점): the first moment the irreversibility check opens
  *settlement negotiation* — the system detects that no remaining realm or
  coalition can realistically overturn the balance (R arithmetic over remaining
  mass). The ending itself is a *player decision* (winner: accept-terms or
  press-on; loser: capitulate or fight-on); the match ends when the hegemony
  settlement concludes, not when the math first tips. (Operational definition of
  SPEC's "matches end at decision points.")
- ✅ `Hegemony decision point` (패권 결정점): the match-ending decision point.
  Shield-ratio arithmetic, no new physics: **leadership** — the candidate's
  projectable mass clears the war-deciding shield ratio against every
  in-balance realm (rejects the turtle hegemon); AND **unassailability** — no
  coalition of in-balance realms can reach that ratio × the candidate's shield
  within a regeneration window. Shield mass is a facing-front reading derived
  from adjacency (conquest inherits exposure); the check trips on true values
  while the player reads a banded 판세 estimate. Sealed dials (ratio,
  regeneration window, facing-front rule) + history → match-arc GLOSSARY
  패권 결정점 row / RULINGS ⑨⑪⑮⑰.
- ✅ `Projectable mass` (투사 가능 질량): the mass a realm can actually deliver to
  fronts beyond its own shield — a derived reading of the field army through the
  realm's exit-choke geography (M11 + route graph), never a stored variable.
  Chokes narrow doors both ways: the unbreakable are usually also unable to
  march out. Sealed formula + flow value + history → match-arc GLOSSARY
  투사 가능 질량 row / RULINGS ⑩.
- ✅ `In/out of the balance — hermit clause` (판세 안/밖 · 은둔국 조항): a realm
  whose projectable mass falls below the floor (1,000 — reuses the raid
  visibility threshold; confirmed 2026-07-05) is *outside the balance* — excluded from coalition
  sums and the leadership denominator. Derived per turn (a hermit can buy back in
  via choke-removal paths). Out-of-balance realms are acknowledged at settlement
  (tributary/hermit narrative), never forced to capitulate — the match ends
  without requiring 100% of the map. A projecting-but-unbreakable realm stays in
  and legitimately blocks the decision point (Parthia pattern).
- ✅ `Settlement` (정산): the procedure converting a decided war into gains
  *without* occupation grinding — annexation arrives through settlement, not
  sector-by-sector conquest. Two levels: 전쟁 정산 (ends one war) and 패권 정산
  (concludes the match). Settlement territory arrives *alive* (undamaged usable
  value, vs conquest damage + M6 inheritance cost); the saved friction is the
  trade surplus, split naturally (no discount dial). MVP: no free negotiation —
  2–3 auto-priced preset bundles (관대/표준/최대); bluffing and free terms → Phase
  2 diplomacy.
- ✅ `Settlement currencies` (정산 통화): the MVP menu of three — 할양 (cession:
  named sectors, undamaged, ceiling = occupation reach), 배상 (indemnity: one-time
  economy transfer, ceiling = loot value of raid reach per M8's 50% rule), 복속
  (vassalage: the realm survives subordinated, its mass leaving the coalition
  pool and counting to the winner's side; available only when the capital is
  within reach). Demilitarization and route access → Phase 2. Mixed-bundle total
  ≤ reach value.
- ✅ `Reach` (도달권): the closed-form price base of every settlement, never a
  runtime simulation. 점령 도달권 (occupation reach): sectors the winner could take
  before resistance re-forms — route graph from army positions, stopped by intact
  shields, bounded by the regeneration window (M12). 약탈 도달권 (raid reach): the
  wider zone reachable by sub-threshold raiding (bypasses shields, M8). Demands
  beyond reach → deterministic refusal, war resumes; reach is recomputed at
  suing time. "칼이 닿는 곳까지가 청구서다 — 점령의 칼은 땅을, 약탈의 칼은 돈을,
  수도에 닿은 칼은 무릎을 청구한다."
- ✅ `Acceptance arithmetic` (수락 산술): a loser-AI accepts a bundle iff bundle
  value ≤ its continued-war expected loss × personality coefficient — computed on
  *true values*, deterministic (no dice). The coefficient (완고/실리/유화) is drawn
  per realm at match start from a narrow band (ADR 0025 tendency). A player-loser
  decides freely. The settlement card shows a per-bundle acceptance *band* (the
  player predicts through fog though the AI decides deterministically — tension
  without dice). Deferred-with-trigger: fogged-read acceptance + bluffing ship
  with Phase 2; pull earlier iff playtest shows settlement reads as solved/flat.
  Sealed dials (resistance discount, coefficient anchors, the lenient=tempo-peace
  identity) + history → match-arc GLOSSARY 수락 산술 row / RULINGS ⑫⑬.
- ✅ `Vassalage / capitulation` (복속): a settlement outcome — the losing realm
  survives diminished and subordinated; its mass leaves the coalition pool and
  counts to the **overlord's** side of the hegemony arithmetic. Choosing
  capitulation over a fight to the capital is the losing player's own decision
  (surrender grammar). MVP terms: no in-match defection; chain collapse on
  overlord fall; the vassal seat keeps full internal sovereignty (부마국 model);
  substance–sovereignty exchange axis (할양 trades substance to keep sovereignty,
  복속 the reverse). Priced in **acceptance currency** = standard-preset material
  + sovereignty premium × loser remaining value. Sealed premium value +
  floor-setter rider + history → match-arc GLOSSARY 복속 row / RULINGS ⑭⑯.
- ✅ `Recruitment` (모병): the single MVP economy→mass conversion — a primary
  action adding a capped share of the national sustainable cap per turn, drawn
  from the manpower pool, paid from treasury yield, fighting at 100% (single
  troop quality — a discounted levy tier would reopen the sealed quality = 1
  simplification). The temporary-levy track (공세 동원, ADR 0009 role 3) is a
  reserved seat with three reopen triggers (a quality/tech system; Phase 3
  domestic hooks; a flat-reading buildup phase in playtest). Force-adjustment
  stack: ① recruitment (create, player) / ② garrison regeneration to local caps
  (automatic, ADR 0014) / ③ standing-force stationing (deploy, player) / ④ commit
  lever + reserve (activate, per-turn) — the player hand-manages only ① and ③.
  Rates → M13.
- ✅ `Manpower pool` (인력 풀): per-province latent manpower (ADR 0009 role 4),
  *finite within a match* — the dead leave it permanently, the dispersed return,
  settlement-inherited land arrives pool-intact (M6 made literal). Blood becomes
  a permanent match currency (closing the blood-economy coupling gap flagged at
  M3); generational regrowth is ~0 inside 25 turns. Values → M13/battery.
- ❓ `Blinds` (블라인드): the escalation device that makes safe, passive play
  progressively more expensive as the match ages — the anti-safe-play pressure
  ADR 0025 parked into this thread. Mechanism undecided; design duty confirmed
  load-bearing by the L2 tournament (a perfect-information board freezes into
  deterrence equilibrium — acceptance test in match-arc `TEST-LADDER.md`).
- ✅ `Test-trust ladder` (검증 신뢰 사다리): the four-rung verification
  epistemology — L0 hand reasoning / L1 decision grids / L2 match tournament /
  L3 human playtest — with asymmetric proof power (found-at-L2 is real;
  not-found is nothing; L2-derived values are never final). Charter:
  `docs/features/match-arc/TEST-LADDER.md`.

### Winning archetypes (STRATEGY-SPACE.md — the value-dial checklist)

Derived backward from the hegemony inequality; before sealing any value, ask
"which archetype does this kill?" (✅ AGREED framing 2026-07-04). Not mechanics
themselves — the check the mechanics must keep alive.

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

Previously open, now decided. Pointers show where each decision lives.

- ✅ Initial playable map size: 30x30 active area, 50x50 world data
  (ADR 0003; plan `docs/superpowers/plans/2026-06-29-phase-1-map-command-slice.md`).
- ✅ Phase 1 terrain taxonomy: fixed to seven types — plains, grain_basin,
  mountain_pass, river, coast_strait, steppe_highland, frontier_basin
  (`js/domain-data.js`).
- ✅ Initial named provinces: 30 provinces drafted in `js/province-data.js`,
  subject to balancing.
- ✅ Active archetype regions: all twelve accepted regions are represented by
  the initial 30 provinces.
- ✅ Local garrison sustainment: sustained by local front-sector economy and
  population, not the national treasury (see `Local garrison`; ADR 0014,
  amended by the front-sector model in ADR 0022).
- ✅ Strait movement: penalty-based crossing with port mitigation, no Phase 1
  naval system (see `Strait`).
- ✅ Province primary function: assigned for all 30 provinces
  (`js/province-data.js`).

## Open Questions

- ❓ Exact trigger for activating background regions. Deferred by decision:
  Phase 1 uses a static authored active area; dynamic activation (influence,
  scouting, diplomatic awareness, campaign scope) is a later-phase concern
  (ADR 0003).
- ❓ Secondary function assignments for the initial provinces. Primary functions
  are assigned; optional secondary functions are deferred to a province
  content/balancing pass (`secondaryFunction` is currently null).
- ❓ Concrete numeric balancing of population, economy, garrison, defense, and
  capacity generation across the 30 provinces.
- ❓ Whether a true naval system (naval capacity/force role, blockade, sea
  movement) is introduced in a later phase.
