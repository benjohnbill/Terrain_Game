# Terrain Game Spec

## Goal

Build a turn-based national management and conquest game where terrain,
regional economy, population, local military strength, diplomacy, and events
combine into a world-conquest strategy experience.

The original prototype is a static browser game centered on hex ownership and
one action per faction per turn. The next design direction is to make conquest
depend on the concrete value and difficulty of each region, not only on a
single global military number.

## Core Gameplay Promise

The player grows and governs a state, then uses that state's geography,
economy, population, military deployment, diplomacy, and timing to conquer the
map.

The game should follow a high complexity, low micromanagement principle. The
simulation may be deep, but the player should mainly make strategic choices
instead of repeatedly executing low-level administrative steps.

The most important Phase 1 experience is:

- reading the map,
- identifying valuable or vulnerable regions,
- deciding where to concentrate local force,
- accepting realistic costs from terrain, supply, and losses,
- expanding without turning military snowballing into the only viable strategy.

Phase 1 should not feel like only a set of generic terrain tiles. The first
active area should include medium-sized named provinces with population,
economy, terrain composition, strategic value, and background hooks.

## Phase Roadmap

### Phase 1: Terrain, Regions, and Combat

Introduce region-level terrain, economy, population, local garrisons, defense,
movement constraints, and limited sea crossing.

The first active campaign should use roughly 25 to 40 named provinces layered
over the underlying map units.

Each province should be legible through three lenses: broad archetype region,
terrain composition, and settlement/function.

Phase 1 uses a combat + economy basic stat scope. It should include regional
population/economy differences because those make conquest targets meaningful,
but it should avoid full domestic governance until later phases.

### Phase 2: Diplomacy and International Order

Expand diplomacy beyond alliance/war into tribute, vassalage, threats, betrayal,
peace terms, war justification, and relationship risk.

### Phase 3: National Management

Add domestic indicators such as public order, inflation, tax pressure,
maintenance, food, production, recruitment pool, and unrest.

### Phase 4: Events and Historical Liveliness

Add events such as epidemics, factional splits, economic shocks, rebellions,
natural disasters, nomad incursions, naval crises, and succession struggles.

## World Model

The game uses an East Asia-inspired fictional world. It should reference real
geographic patterns such as northern plains, loess-like highlands, major river
basins, mountain passes, southern grain regions, northeastern plains, straits,
islands, and a route toward northern India.

It should not be a literal historical China simulator. Historical geography is
input material for terrain and regional logic, not a constraint that overrides
game readability and balance.

## Known Prototype Problems

- Global military strength can snowball into the only viable strategy.
- Increasing military strength also increases defense, making strong states too
  hard to defeat everywhere at once.
- Conquest can become self-fueling because new territories immediately support
  more gold and military recovery.
- Technology and economy are not yet strong strategic alternatives to military
  investment.
- AI diplomacy and attack behavior can be strategically naive.
- AI action logs are difficult to read during play.
- Notifications can obscure the player status panel.
