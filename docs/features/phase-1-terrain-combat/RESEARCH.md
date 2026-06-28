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

## Working Hypothesis

❓ Phase 1 should start by adding terrain and regional data to map units before
rewriting all combat behavior. This creates a stable foundation for local
garrisons, movement restrictions, AI evaluation, and later national management.

## Validation Needed

- Decide the initial terrain taxonomy.
- Decide the initial 25 to 40 named province list.
- Decide the first playable map size and whether the current generated grid is
  replaced by a authored terrain layout.
- Decide how local garrison interacts with population and faction-level military
  reserves.
