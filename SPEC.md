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

## Core Design Principles

The propositions below are the game's identity — the always-true design
commitments the rest of this spec, the domain model, and the ADRs elaborate.
They carry no numbers on purpose: each names *what is true*, while values,
rules, and the full definition live at the pointer (birthplace stays
authoritative — this spec declares, it does not restate).

1. **Land-derived state.** Every mutable state — economy, population,
   military, recovery, projectable mass — is derived each turn from the
   sectors a realm holds; substance is never stored where it can be derived
   from the land. The land gives the body; the player gives the mind — command
   attention is the one deliberate exception, supplied regardless of realm
   size. (DOMAIN_MAP § Design Principle; ADR 0001; combat MAGNITUDE M14.)

2. **The uncertainty duel is the core pressure engine.** Tension comes from
   information-asymmetric simultaneous commitment under fog — with
   learnable-but-never-solvable opponent tendencies — not from a wall clock.
   (ADR 0025; DOMAIN_MAP `Uncertainty duel`.)

3. **One judgment per turn.** The fun is a single high-stakes read each turn —
   one poker hand, not a checklist. Spreading a turn across many commands would
   dilute both the reward of a good read and the sting of a bad one. (Combat
   MAGNITUDE § Identity tension; ADR 0020 action-capacity divisibility.)

4. **Deterministic resolution; all uncertainty is information.** There is no
   random roll at resolution — every experienced uncertainty is fog over known
   machinery. Poker, not dice. (Combat FORMULA D1; DOMAIN_MAP § Combat
   Resolution.)

5. **The ending is the detection of irreversibility.** A match ends not when
   the math first tips but when the system detects that no realm or coalition
   can reverse the balance — that moment opens settlement negotiation, and
   concluding it is the player's decision, never an automatic game-over.
   (match-arc GLOSSARY 결정점; DOMAIN_MAP § Arc phases.)

6. **Uncertainty must be skill-piercable, never fate.** Every loss must trace
   to a decision, not to a spawn dice — the test is whether a perfect player in
   the same seat could have survived. (fog-of-war-discovery § Design Guardrail;
   ADR 0013.)

7. **Blood is a permanent currency.** Casualties leave the match's finite
   manpower pool for good — only the dispersed return; war's cost is paid in
   something that does not refill within the match. (match-arc GLOSSARY 징집 명부;
   combat MAGNITUDE M13.)

8. **Derived asymmetry.** The world's asymmetries are authored into the
   land — its geometry (terrain, borders, position, adjacency) and the fog
   over it — never into playable state. Every *playable* quantity
   (population, fortification, garrison, investment) starts uniform across
   realms; parity is set per region, so an equal-size seat inherits it. A
   playable value may begin unequal only when that inequality is itself
   derived from the map — a narrow strait lowering a projectable-mass
   ceiling, treasury inheriting its terrain-fed economy — never baked
   per-realm without a root in the land. (Economy and other land values stay
   Principle #1's domain; their terrain-fed inequality is this same derived
   pattern, not an exception. Birthplace: terrain-cradle Parity start / TC-①,
   generalized beyond population and sealed for all playable state in TC-⑭.)

*Candidate, deferred to post-L3 playtest:* balancing is governed by war
arithmetic rather than politics — checking a runaway leader is available and
sometimes correct but never mandatory (free-riding is a legitimate line). Held
for wording until a playtest confirms the framing (STRATEGY-SPACE § Balancing
note).

## Positioning and Fun Pillars

**Positioning.** A "simple Civilization": a Civilization-depth *world* (terrain,
regional value, some historical flavor) operated with a League-of-Legends-shaped
*hand* — a low skill floor (anyone plays via posture presets and prefilled
commands) with an optional skill ceiling (fine situational adjustment rewards
mastery). System complexity is high; *required* interaction complexity is low;
*expressed* interaction complexity is opt-in.

**Match envelope.** A match is a war/empire arc compressed into roughly 30-40
minutes — an hour at the outside — in the spirit of a LoL game, not a Paradox
campaign. Assuming a turn resolves in roughly 1.5-2 minutes — an untested
playtest variable — the envelope implies roughly 15-25 turns per match; that
turn count is a derived estimate, not a design commitment. The binding target
is the wall-clock envelope, with two consequences: a match must end at a
decision point
rather than by map completion (see Match structure below), and
required per-turn interaction must stay inside the preset-first budget. The
envelope is a design budget, not a wall clock; casual play stays untimed (time
pressure remains the separate opt-in question below).

**Match structure.** The match-arc pass (2026-07-04) resolved the shape inside
that envelope. The map is fully partitioned from turn 1 — 4-6 realms (authoring
default 5), every realm bordering neighbors, no expand-into-empty-land opening.
Realms start as mature states (fortresses standing at chokes, armies raised)
balanced on *survivability and starting population* — every region opens with
the same population total, so lifetime blood budgets are equal and divergence
comes only from play — but asymmetric in geometry and economy: a multi-front
중원 center whose crown is economic (traffic centrality plus long-war economic
stamina, never a population edge) against shielded, coalition-capable
peripheries, so whoever takes the center inherits its exposure (the
anti-snowball loop). The center-protagonist reading is a measured hypothesis,
not a design guarantee: the design does not script a higher 중원 win rate;
whoever *digests* the center stably earns a hegemony-probability premium
(terrain-cradle TC-②). A match arcs standoff → buildup → first war → realignment → deciding
war → decision point → settlement, budgeted so one player's hand fights ~2-3
wars. A war is decided by field-army destruction (shield-break → decisive battle
→ cascade) and converted to gains through settlement rather than
sector-by-sector conquest; the match ends when a hegemony settlement is
concluded, not at 100% map control. The sealed model and vocabulary live in
`docs/features/match-arc/` and `DOMAIN_MAP.md` (Match Arc and Settlement).

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

**Resolved (match-arc pass, 2026-07-04).** Match arc and victory conditions —
the decision-point / settlement / hegemony model is sealed (see Match structure
above and `DOMAIN_MAP.md` Match Arc and Settlement). A match ends when a hegemony
settlement concludes, reached through reach-priced settlement bundles and
deterministic acceptance arithmetic read by the player through fog. The
remaining questions are playtest-shaped rather than open design: the blinds
mechanism (anti-safe-play pressure), showdown staging (the read-vs-reality
reveal), and the loser-side experience between "decided" and "settled." Deferred
clock/event pressure stays parked (ADR 0025).

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

Add deeper domestic indicators such as public order, inflation, tax pressure,
maintenance, food, production, unrest, and a richer recruitment/troop-quality
system. (The MVP already includes single-track recruitment — 모병 drawing a
finite per-match manpower pool; Phase 3 is where quality tiers, temporary levies,
and domestic pressure extend it. See `DOMAIN_MAP.md`.)

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
