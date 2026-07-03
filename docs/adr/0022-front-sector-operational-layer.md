# ADR 0022: Front Sectors as the One-Turn Operational Layer

Date: 2026-07-01

Status: Accepted

## Context

ADR 0019 defined situation judgment at the named-province level with hex
drill-down. ADR 0020 made a single divisible action-capacity pool core to the
MVP, and ADR 0021 made failed under-commitment cause immediate loss. That exposed
a scale mismatch: one hex per turn feels too small to read as war, while one
named province per turn is too large for fine focus adjustment and too punitive
for a simple turn-based MVP.

## Decision

Add `Front sector` as a formal domain layer between `Named province` and
hex/map unit.

A front sector is a sub-province operational area composed of multiple map
units, such as southern Jiangnan, a Shandong harbor basin, a pass approach, a
river crossing zone, or a border belt. It is the default unit of one-turn
occupation, defense focus, and deliberate sacrifice. Named provinces remain the
strategic reading and identity unit, with economy shown as an aggregate/readout
over front-sector economy values; hexes remain the rendering, terrain-evidence,
adjacency, and calculation minimum.

Front sectors are authored fixed subdivisions. Each map unit belongs to exactly
one front sector, and each front sector belongs to exactly one named province.
War changes ownership of sectors; it does not redraw sector borders. Front
sector ownership is the formal territorial ownership unit for the MVP. Existing
hex ownership can remain temporarily as derived rendering/calculation state, but
the intended source of truth is sector control.

Named provinces summarize front-sector control through derived status and
control summaries rather than a single hard province owner. The calculation
rules live in ADR 0023.

Front sectors are operational units, not equal-area or equal-value tiles. Their
spatial extent, population, economy, defense, and strategic value may diverge:
a dense capital basin can be small and highly valuable, while a sparse plateau,
steppe, desert, or mountain frontier can be physically large and low-value.
Sector value is authored or weighted explicitly; it is not inferred directly
from hex count.

For Phase 1, each front sector carries a compact value profile:
`controlWeight`, `economyValue`, `populationValue`, `defenseValue`,
`militaryValue`, and `routeValue`. Different systems read different axes:
province status uses `controlWeight`; economy and growth use economy/population;
defense and combat use defense/military; movement and opportunity chaining use
route value. Political, symbolic, governance, unrest, and event values are
reserved as later-phase extensions rather than MVP requirements.

MVP economy and population use a lightweight usable-value placeholder rather
than a full governance model. Newly captured sectors start at 50% usable economy
and 60% usable population, recovering by 10 percentage points per stable,
non-contested turn. A stable turn means the sector ends the turn under the same
faction, was not contested during that turn, and was not the target of active
attack/defense resolution. Control and route effects apply immediately; detailed
occupation policy, unrest, administration, and recovery modifiers are deferred.

Sector defense is layered: `terrainDefense` (natural defense),
`fortificationDefense` (prepared artificial defense that can be damaged),
`localGarrison` (locally sustained defenders from population/economy), and
`defenseCommitment` (current-turn focused defense from the player's command
commitment). Keeping these distinct preserves the difference between natural
strongholds, built fortresses, populous defended areas, and sectors the player
deliberately reinforces this turn.

*Amendment (2026-07-03, combat-formula D6):* the four layers compose as
substance × lever × multipliers, not as four additive contributions.
`localGarrison` is the substance, `defenseCommitment` is a lever on that
substance with baseline 1 (an unattended garrison still fights at its own
strength; commitment layers court attention on top), and
`terrainDefense`/`fortificationDefense` are multipliers (terrain invariant,
fortification damageable). See `docs/features/combat-formula/FORMULA.md`.

## Considered Options

- **One hex per turn:** rejected — simple and close to the current prototype, but
  too small to feel like campaign warfare.
- **One named province per turn:** rejected — strategically legible, but too
  large for fine focus adjustment and too harsh as the normal failure unit.
- **Front sector:** accepted — it creates a middle scale that can carry one-turn
  campaign movement while preserving province-level reading and hex-level
  terrain detail.
- **Dynamic front lines:** rejected for the MVP — more realistic, but they make
  the unit of loss, forecast, labels, and saved state unstable. Fixed authored
  sectors keep the turn result legible.
- **Equal-size sectors:** rejected — easy to author, but it wrongly equates
  physical area with operational value and fails to represent sparse frontiers
  versus dense core regions.

## Consequences

- The domain ladder is `Named province → Front sector → Map unit/hex`.
- Front-sector borders are fixed authored content in the MVP, not dynamic lines
  generated by current ownership.
- Territorial ownership is held at front-sector level. Hex/map-unit ownership,
  if still present during implementation, is transitional derived state rather
  than the domain source of truth.
- Named provinces summarize sector state through dynamic province status and
  province control summary (ADR 0023), not through a universal hard owner.
- Sector size is guided by operational meaning. A typical sector may land around
  6-14 map units, but this is a rough authoring aid rather than a balance rule;
  small high-value core sectors and large low-value frontier sectors are valid.
- Front sectors carry a Phase 1 value profile with control, economy, population,
  defense, military, and route axes. Future value axes can be added without
  redefining front sectors.
- Front-sector defense is four-layered: natural defense, prepared fortification,
  local garrison, and current-turn focused defense.
- Newly captured sectors use playtest-tunable usable-value placeholders for
  economy and population rather than opening the full governance model.
- Situation judgment remains province-level, but drill-down targets front
  sectors before hex evidence.
- Under-commitment failure causes front-sector loss (ADR 0021), not whole named
  province loss.
- Future map data needs authored or derived front-sector membership for map
  units. The current hex implementation can remain the rendering/calculation
  substrate while this layer is introduced.
- Later systems such as total mobilization or overclock can expand the primary
  action to affect multiple front sectors in one turn, but the MVP default
  remains one primary action focused on one front sector.
- This ownership scale is a playtestable assumption. If running the game shows
  sector loss is too coarse or too fiddly, the sector boundaries and resolution
  scale should be revised from play evidence rather than defended as fixed.
