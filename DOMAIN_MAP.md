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
- ✅ `Local garrison`: Military strength assigned to a specific map unit, not a
  global faction-wide force usable everywhere at once.
- ✅ `Strait`: A narrow sea crossing that can allow limited naval movement,
  blockade, or amphibious attack.
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

## World Direction

- ✅ The world is fictional and East Asia-inspired.
- ✅ Real Chinese and East Asian geography should strongly inform terrain
  placement.
- ✅ The world should leave expansion slots for straits, islands, maritime
  powers, northern steppe pressure, and a northern India route.
- ✅ Large world data such as 50x50 is acceptable if the playable and simulated
  scope opens progressively.
- ✅ The first active Phase 1 campaign area should be around 25x25 to 30x30,
  centered on central plains, southern grain regions, and northern frontier
  terrain.
- ⛔ Do not model a literal historical map so strictly that gameplay balance and
  readability become secondary.

## Open Questions

- ❓ Initial playable map size.
- ❓ Exact terrain taxonomy for Phase 1.
- ❓ Whether local garrison is recruited from population, paid from treasury, or
  both.
- ❓ Whether strait movement requires a harbor, technology, or a separate naval
  capacity.
- ❓ Exact trigger for activating background regions.
