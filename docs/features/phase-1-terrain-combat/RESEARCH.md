# Research: Phase 1 Terrain and Combat

## Observations

✅ The current prototype stores only simple per-hex data: owner, building,
population, and terrain currently defaulting to `plains`.

✅ The current prototype uses global faction military strength for both attack
and defense calculations, which contributes to snowballing.

✅ The user wants each territory to have distinct military, defense, economy,
and population characteristics based on geography.

✅ The user prefers a world inspired by East Asian geography, with room for
straits, islands, and a northern India expansion route.

✅ The user wants immersion from province-level identity, not only generic
terrain categories. Population, terrain, history/background, and strategic role
should differ by province.

✅ The user prefers hybrid naming: historical flavor for large geography, with
fictional names for specific provinces so detailed naming can be expanded later.

✅ The user approved a third design lens beyond archetype region and terrain:
settlement/function, inspired by Three Kingdoms-style city roles.

✅ The user selected a Phase 1 scope close to combat + economy basics: terrain
should serve the core land-conquest fun, while population and economy give land
meaning. Governance-heavy systems should remain extensible but not required in
the first Phase 1 slice.

✅ The user approved a functional military model: standing forces, local
garrisons, offensive mobilization, and local defense / latent mobilizable
population. Conversion and usage risks must be clear.

## Working Hypothesis

❓ Phase 1 should start by adding terrain and regional data to map units before
rewriting all combat behavior. This creates a stable foundation for local
garrisons, movement restrictions, AI evaluation, and later national management.

## Validation Needed

- Decide the initial terrain taxonomy.
- Decide the initial 25 to 40 named province list.
- Decide primary and optional secondary function per province.
- Decide concrete numeric ranges for population, economy, local garrison,
  defense, and movement/crossing constraints.
- Decide the first playable map size and whether the current generated grid is
  replaced by a authored terrain layout.
- Decide how local garrison interacts with population and faction-level military
  reserves.
- Decide turn timing for mobilization, deployment, upkeep, recovery, battle, and
  risk application.
