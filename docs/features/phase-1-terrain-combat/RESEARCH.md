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

✅ The user wants high complexity with low micromanagement. The system can be
deep, but direct player operations per turn should remain limited and meaningful.

✅ The user wants strategic posture presets to act as guidance, not direct
bonuses. Presets can be intentionally extreme, representing risky concentrated
strategies, while the player fine-tunes action-capacity allocation.

✅ The user approved partial carryover for unused action capacity and emergency
cross-capacity overclocking at reduced efficiency.

✅ The user's intended extreme overclock case includes direct human
mobilization, such as scholars or other non-military groups taking up weapons
in a desperate situation, not only institutional support like analysis.

✅ The user approved a map-first situation UX direction. Briefing, glow/pulse,
hover reasons, confidence indicators, and prefilled command cards should guide
command creation, with exact UI details deferred until mockups/build testing.

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
- Decide minimum acceptable micromanagement for a turn.
- Decide the initial four action capacities and the first posture guide presets.
- Decide carryover rates, carryover caps, overclock conversion rates, and
  overclock risks.
- Validate map-first situation UX with mockups and a playable build.
