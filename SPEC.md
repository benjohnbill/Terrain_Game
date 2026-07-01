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

Strategic posture presets should guide player analysis rather than directly
grant bonuses. Extreme postures can express risky national commitments, while
the player retains control over concrete action-capacity allocation.

The most important Phase 1 experience is:

- reading the map,
- identifying valuable or vulnerable regions,
- deciding where to concentrate local force,
- accepting realistic costs from terrain, supply, and losses,
- expanding without turning military snowballing into the only viable strategy.

Phase 1 should not feel like only a set of generic terrain tiles. The first
active area should include medium-sized named provinces with population,
economy, terrain composition, strategic value, and background hooks.

## Positioning and Fun Pillars

**Positioning.** A "simple Civilization": a Civilization-depth *world* (terrain,
regional value, some historical flavor) operated with a League-of-Legends-shaped
*hand* — a low skill floor (anyone plays via posture presets and prefilled
commands) with an optional skill ceiling (fine situational adjustment rewards
mastery). System complexity is high; *required* interaction complexity is low;
*expressed* interaction complexity is opt-in.

**Fun pillars.**

1. **Growth you can feel.** The core satisfaction is being validated that you
   are getting stronger; each well-chosen conquest visibly compounds your
   position.
2. **Skill is fitting the situation.** A posture preset is the statistical-average
   setup for a stance; the specific situation is never average. Skill is reading
   the real situation and adjusting from that average toward what this turn
   actually needs.
3. **A skill-driven snowball, not a state-driven one.** Advantage accumulates
   from *skill differences* at each decision — small edges from better
   situation-fit, chained through newly opened opportunities — not from an
   automatic "own more → grow stronger → own more" loop. The anti-snowball
   mechanics exist to bind the lead to skill, not to state.
4. **Opt-in depth.** Casual players succeed on presets and prefilled commands;
   engaged players capture compounding edges by overriding the decisions that
   matter. Neither is punished.

**To validate (not committed).** Time pressure as a separate opt-in mode — it may
convert analysis into tested skill (Hearthstone-style), but whether it reads as
skill-testing or merely stressful is a prototype question. Casual play stays
untimed.

**Open thread.** Preset differentiation — how our posture presets and
command-card operation plan presets create a distinctive, legible gap-to-close
(the density of meaningful small-edge decisions) — is an ongoing design question.
The command-card preset structure is accepted in ADR 0024; preset content and
differentiation remain open.

## Phase Roadmap

### Phase 1: Terrain, Regions, and Combat

Introduce region-level terrain, economy, population, local garrisons, defense,
movement constraints, and limited sea crossing.

The first active campaign should use roughly 25 to 40 named provinces layered
over the underlying map units.

Each province should be legible through three lenses: broad archetype region,
terrain composition, and settlement/function.

Named provinces are the strategic reading and regional-identity unit. Phase 1
combat should also support a smaller operational layer inside provinces: front
sectors such as a southern river basin, harbor basin, pass approach, or border
zone. A front sector is the intended one-turn occupation and defense-focus unit,
larger than one hex but smaller than an entire named province. Front sectors are
defined by operational meaning, not by equal area: a dense capital basin may be
small and highly valuable, while a sparse plateau or frontier may cover many map
units with lower population and economy. Each front sector should carry a small
Phase 1 value profile for control, economy, population, defense, military
importance, and route value; later phases can extend this with political,
symbolic, governance, unrest, or event values.

Phase 1 uses a combat + economy basic stat scope. It should include regional
population/economy differences because those make conquest targets meaningful,
but it should avoid full domestic governance until later phases.

Control and route effects can apply immediately when territory changes hands;
economy and population should use the MVP usable-value recovery placeholder
until later governance systems define richer occupation, administration, unrest,
and recovery behavior.

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
