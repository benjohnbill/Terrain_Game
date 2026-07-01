# Terrain Game Domain Map

Markers:

- ✅ Verified or accepted in the current project direction.
- ❓ Assumption or proposed concept requiring validation.
- ⛔ Forbidden or rejected direction.

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
  situation. Presets belong to a catalog, but the command card should expose only
  the few plans made plausible by the target sector's value profile, state,
  adjacency/reachability, terrain tags, and confidence.
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
  are authored as a per-axis magnitude, not a primary/secondary split.
  `statusTransition` is _not_ an axis: province status is derived and recomputed
  from controlWeight/contact per ADR 0023. _Note_: which element an axis touches
  (mapping) is separate from how strongly a capacity commitment drives it
  (combat-balancing, deferred).
- ✅ `Operation plan catalog`: The authored set of operation plans, defined
  schema-first. Each plan is a fixed record: `name`, `availabilityConditions`,
  `effectAxes` (a magnitude per operation effect axis), and `riskProfile`. There
  is no authored "target traits" field — fit to a sector is derived by matching
  `effectAxes` against the sector's value profile, so recommendation ranking
  surfaces fit automatically. Concrete plan content is authored later; the schema
  is fixed now (ADR 0024).
- ✅ `Under-commitment failure`: A failed contested defense caused by committing
  too little capacity. In the MVP, this causes immediate front-sector loss
  rather than only gradual damage, so deliberate sacrifice and surplus
  redirection are legible strategic choices (ADR 0021).
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
  (ADR 0018, ADR 0020).
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
    guaranteed, capped ~5-7) is decoupled from and larger than the per-turn
    action budget. The gap (see many, act on few) *is* the stage-1 decision.
    MVP turn = one primary action with variable capacity commitment and limited
    surplus redirection: "of the ~5-7 surfaced tensions, which single one do I
    focus this turn on, and how much capacity do I commit?" The four-capacity
    system stays deferred (ADR 0018, ADR 0020); the invariant is budget <
    attention. See ADR 0019.
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
