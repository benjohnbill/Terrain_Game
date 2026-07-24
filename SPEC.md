# Terrain Game Spec

## Goal

Build a turn-based national management and conquest game — a two-realm
head-to-head duel won by capturing the enemy capital. Terrain, regional economy,
population, local military strength, and events combine into the strategy of that
duel.

The original prototype is a static browser game centered on hex ownership and
one action per faction per turn. The next design direction is to make conquest
depend on the concrete value and difficulty of each region, not only on a
single global military number.

## Core Gameplay Promise

The player grows and governs a state, then uses that state's geography,
economy, population, military deployment, and timing to capture the enemy realm's
capital — the sole win condition of the duel.

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
   (ADR 0025; DOMAIN_MAP `Uncertainty duel`.) In the duel this is literal: both
   realms commit the whole turn's orders blind, then reveal and resolve together —
   poker's bet → showdown, not chess's perfect-information alternation (ADR 0025
   made literal; ledger Gate 6).

3. **One judgment per turn.** The fun is a single high-stakes read each turn —
   one poker hand, not a checklist. Spreading a turn across many commands would
   dilute both the reward of a good read and the sting of a bad one. (Combat
   MAGNITUDE § Identity tension; ADR 0020 action-capacity divisibility.)

4. **Deterministic resolution; all uncertainty is information.** There is no
   random roll at resolution — every experienced uncertainty is fog over known
   machinery. Poker, not dice. (Combat FORMULA D1; DOMAIN_MAP § Combat
   Resolution.)

5. **The ending is capital fall.** A match ends when a realm's capital falls;
   the system names a winner by nothing else — no points-victory, no
   timeout-draw, no scorecard. (ADR 0042; capital CP-②; DOMAIN_MAP § Match Arc.)

6. **Uncertainty must be skill-piercable, never fate.** Every loss must trace
   to a decision, not to a spawn dice — the test is whether a perfect player in
   the same seat could have survived. (fog-of-war-discovery § Design Guardrail;
   ADR 0013.)

7. **Blood is a permanent currency.** Casualties leave the match's finite
   manpower pool for good — only the dispersed return; war's cost is paid in
   something that does not refill within the match. (match-arc GLOSSARY 징집 명부;
   combat MAGNITUDE M13.)

8. **Emergent asymmetry.** The world's asymmetries are authored into the
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

9. **Geography defines the set of what is possible; judgment chooses within
   it.** Levers, commits, board reading, and information confidence all act on
   the *choosing*; the set itself changes only through world rules
   (consequences of action). (ADR 0032; occupation-geography design spec §2,
   promoted 2026-07-11.)

*Candidate, deferred to post-L3 playtest:* balancing is governed by war
arithmetic rather than politics — checking a runaway leader is available and
sometimes correct but never mandatory (free-riding is a legitimate line). Held
for wording until a playtest confirms the framing (STRATEGY-SPACE § Balancing
note).

## Positioning and Fun Pillars

**Positioning.** A **1v1 terrain-war duel, read like poker under fog — won by
taking the enemy capital.** It began as the wish for a "simple Civilization" —
Civilization-scale terrain-and-war depth through a low-micromanagement hand — and
that depth remains the *world's* character; but the shape is a duel, the tension
is poker under fog, and the tempo is a casual, short competitive match, operated
with a **League-of-Legends-shaped *hand*** (low skill floor via posture presets
and prefilled commands, optional skill ceiling for mastery), not a 4X campaign.
The signature read/feedback organ is the **EVAL BAR (판세)**. System complexity is
high; *required* interaction complexity is low; *expressed* interaction
complexity is opt-in.

**Match envelope.** A match is a war/empire arc compressed into roughly 30-40
minutes — an hour at the outside — in the spirit of a LoL game, not a Paradox
campaign. Assuming a turn resolves in roughly 1.5-2 minutes — an untested
playtest variable — the envelope implies roughly 15-25 turns per match; that
turn count is a derived estimate, not a design commitment. The binding target
is the wall-clock envelope, with two consequences: a match must end at
capital fall rather than by map completion (see Match structure below), and
required per-turn interaction must stay inside the preset-first budget. The
envelope is a design budget, not a wall clock; casual play stays untimed (time
pressure remains the separate opt-in question below).

**Match structure.** The map is fully partitioned from turn 1 — **exactly two
realms**, bordering each other, no expand-into-empty-land opening; player count
is decided, not an authoring variable. Growth comes only from taking enemy
ground, never from settling empty land — this is what forces confrontation
(mutual-exposure) rather than a builder's race. Realms start as mature states
(fortresses at chokes, armies raised) balanced on *survivability and starting
population* — every region opens with the same population total, so lifetime
blood budgets are equal and divergence comes only from play — but asymmetric in
geometry and economy. The concrete two-realm board (capital placement,
forward/rear geometry, terrain) is authored at the parallel 1v1 map pass. **War
and match are one** — a single sustained duel, not a multi-war arc; the match
runs at the player's pace until a capital falls (target: casual 15-30 min), its
length induced by land-derived decay, not a fixed clock (turn structure:
simultaneous blind commit → reveal, ledger Gate 6). A war is pressed by
field-army destruction and encirclement — pressures **toward capital capture**,
no longer independent match-terminators (amends ADR 0038's three-channel
composite → capital fall is the sole terminus). The match ends when a **capital
falls**, not at 100% map control and not at a settlement. The sealed model and
vocabulary live in `docs/features/capital/` (CP-②), `docs/features/match-arc/`,
and `DOMAIN_MAP.md`.

**Fun pillars.**

1. **The psychological duel.** The core satisfaction is out-reading and
   out-planning the opponent under fog — inferring the hidden picture piece by
   piece, allocating each turn's tactics and 행동력, and chaining several turns
   into one well-planned war that lands a 명량-shaped comeback (매드무비). Growth
   is felt — taking ground genuinely strengthens you — but it serves the duel;
   the fun is the read and the 수싸움, not the size of the empire.
2. **Skill is fitting the situation.** A posture preset is the statistical-average
   setup for a stance; the specific situation is never average. Skill is reading
   the real situation and adjusting from that average toward what this turn
   actually needs.
3. **The lead never ends the duel early.** Land-derived decay pressures the
   trailing side toward a decision (anti-fizzle), but the lead is never a safe
   automatic steamroll: pressing it forward exposes your own capital
   (mutual-exposure), and the match stays a live judgment to the end — a
   read-driven comeback stays available, not foreclosed by an early state-lead.
   The intent, measured in play, is that skill, not an early state-lead, decides
   who converts pressure into a win.
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

**Resolved — superseded by the 1v1 pivot (ADR 0042).** The decision-point /
settlement / hegemony victory model is retired; capital fall is the sole win
condition. The multi-realm machinery (hegemony decision point, domination,
unassailability, settlement bundles, acceptance arithmetic) is historical
(DOMAIN_MAP § Match Arc, match-arc feature docs). Open playtest questions carry
over in duel form: showdown staging (the read-vs-reality reveal — now the EVAL
BAR + simultaneous reveal) and the loser-side experience.

**Domination victory — superseded by ADR 0042.** There is no hegemony gate (and
so no leadership/domination win-types) in a two-realm duel; capital fall is the
sole win condition.

**How a match ends (1v1 pivot, ADR 0042).** A match ends in exactly one way: **a
capital falls.** There is no hegemony decision point, no crisis arc, and no
Westphalian draw — the crisis / internal-uprising system (ADR 0034/0035/0036) is
retired. "No judged scorecard" stands, strengthened: nothing but capital fall
ever names a winner. Stalemate is not resolved by any scoring terminal; the
current design bet is that structural forces make the duel resolve without a
forced-termination device — 1v1 removes the multipolar deadlock, mutual-exposure
makes sitting unsafe, and land-derived decay pushes the trailing player to
gamble — but that sufficiency is measured in L3 playtest, and an explicit device
stays deferred behind that measurement (ADR 0042 §3); it is a design bet, not an
always-true identity claim.

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

### Phase 2: Diplomacy and International Order — parked

Diplomacy and inter-realm order are multi-party concerns with no referent in a
1v1 (or future 2v2) duel: there is no third party to ally with or betray, and
tribute / vassalage / settlement were multi-realm currencies retired by the pivot
(ADR 0042). This phase is parked together with the multiplayer / PvP axis —
itself a separate SPEC-level decision (premises Boundary), not assumed here — and
is revived only if that axis is opened. (Epidemic, nomad-incursion, and similar
multi-actor content is likewise a future-mode candidate, not folded in now.)

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
  more treasury yield and military recovery.
- Technology and economy are not yet strong strategic alternatives to military
  investment.
- AI diplomacy and attack behavior can be strategically naive.
- AI action logs are difficult to read during play.
- Notifications can obscure the player status panel.
