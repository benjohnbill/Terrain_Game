# Capital (수도) — Feature Index

- **Status:** CONCEPT SEALED (2026-07-10, user, occupation-geography brainstorm)
  — stage-② feature; NO L2 wiring yet. Wiring lands as its own pass with its
  own measurement, deliberately separated from the occupation-geography /
  growth re-measurement (stage ①) so the two effects never entangle.
- **What it is:** a political designation on one of a realm's main city
  sectors. The capital is where the land layer (sectors) meets the polity
  layer (regime): land transfer moves economic/military substance sector by
  sector, while collapse / vassalage / surrender happen to the regime as a
  whole — the capital is that layer's map anchor.

## Sealed concept (details: RULINGS CP-①)

- Designation: player picks one of the seat's main city sectors at match start.
- Capital guard (근위대): land-derived (가안 350 × capital sector population),
  garrison-class, place-bound; doubles as the final-battle stock.
- Capital fall = regime event (collapse cascade / forced-vassalage trigger),
  distinct in KIND from losing an ordinary city (economic/military hit).
- Forward-capital reward emerges from force accounting (the guard holds the
  gate, freeing the field army) — NOT from a bolted-on multiplier
  (mobilization-hub ×1.25 rejected; CP-① riders).

## Open questions (stage-② design session)

1. Guard magnitude disposition (가안 350×pop; sweep plan + decapitation-spiral
   check at the stage-② measurement).
2. Troop-class conversion rules: field army ↔ garrison ↔ guard — i.e. the
   undefined semantics of sealed force-adjustment stack item ③ "standing-force
   stationing" (also: whether field→garrison stuffing is ever allowed; balance
   coupling with the forward/rear fork and M1/M2).
3. Located capital wiring: which battles the guard joins, capital-front
   detection, decapitation dynamics.
4. Rump state (capital lost but land remains) — currently impossible by world
   rule (capital battle is structurally last); reserved extension.
5. Bot designation rule (deterministic default, e.g. innermost highest-pop
   city; map's authored `capitals` as anchors).

## Pointers

- Birth session design: `docs/superpowers/specs/2026-07-10-occupation-geography-design.md` §7
- Decisions + rejected alternatives: `RULINGS.md` (CP-①)
- Terms: `GLOSSARY.md`
- Map's authored city/capital sectors: `mockup/combat-calc/map-gen.js`
  (`capitals` / `cities` tables; battle-summoning placement principle,
  user 2026-07-07)
