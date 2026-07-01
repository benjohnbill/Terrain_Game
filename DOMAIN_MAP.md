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
  background, and event hooks.
- ✅ `Province archetype region`: A broad geography/history frame used to group
  named provinces, such as Central Plains, Guanzhong Passes, Jiangnan Grain
  Belt, Steppe Frontier, or Northern India Route.
- ✅ `Settlement/function layer`: Human use of a place, such as administrative
  center, commercial city, agricultural center, military base, fortress pass,
  port city, mining/workshop district, scholarly/religious center, or frontier
  settlement.
- ✅ `Local garrison`: Military strength assigned to a specific map unit, not a
  global faction-wide force usable everywhere at once. Sustained by its own
  province economy and population, not the national treasury; standing forces
  carry national upkeep. This keeps a faction from being strong on every front
  at once.
- ✅ `Standing forces`: Maintained troops directly commanded for attack,
  movement, and critical defense.
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
  - ✅ Unit: the reading is per `Named province`; the player drills down to
    specific hexes (cells) beneath it (progressive disclosure — province at a
    glance, cell detail on inspect). Combat/movement resolution stays at hex
    level; only the *reading* is aggregated to province.
  - ✅ Hex→province aggregation per located axis: 위협/수비 = weakest link (the
    province's weakest hex governs its risk); 기회/가치 = sum (total economy);
    불확실 = minimum confidence (the least-visible hex); route = any hex carrying
    a pass/river/strait-crossing tag flags the province as a route variable.
  - ✅ `위협` is relational, not absolute: a province is threatened if it borders
    or is reachable by an enemy province whose *estimated* force exceeds the
    province's weakest-link defense, gated by information confidence. The old
    `defense` (my-weakness) and `threat` (enemy-pressure) types merge into this
    one 위협 axis; which of the two drives it is a drill-down *reason*, not a
    separate axis.
  - ✅ Fog gating: a border province with high enemy-info confidence is judged
    위협-or-safe from the estimate; with low confidence it routes to `불확실`
    instead. Scouting is the bridge — scouting a 불확실 border resolves it to 위협
    or safe. (Ties into `js/intel.js` and the fog-of-war-discovery feature.)
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
    act on. The gap (see many, act on few) *is* the stage-1 decision. MVP turn =
    one *primary* action drawing from a single divisible action-capacity pool
    (ADR 0020): the recommendation prefills the average commit, and skill =
    committing tighter than average and redirecting the surplus (economy/
    scouting). The four-capacity/carryover/overclock system stays deferred
    (ADR 0018). See ADR 0019, ADR 0020.
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
- ✅ Carryover and overclock tradeoffs should be visible in capacity UI,
  especially through hover/help details.
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
- ✅ Local garrison sustainment: sustained by local province economy and
  population, not the national treasury (see `Local garrison`).
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
