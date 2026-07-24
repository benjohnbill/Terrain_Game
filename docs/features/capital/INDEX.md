# Capital (수도) — Feature Index

- **Status:** CONCEPT SEALED (2026-07-10, CP-①) + **1v1 WIN-CONDITION SEALED
  (2026-07-23/24, CP-②)** — this feature is now the **birthplace of the game's
  sole win condition** (capital fall, ADR 0042). Still NO L2 wiring; wiring lands
  as its own stage-② pass with its own measurement, and guard magnitude / terrain
  dynamics resolve at the parallel 1v1 map pass (ledger "capital-terrain gate").
- **What it is:** a political designation on one of a realm's main city
  sectors. The capital is where the land layer (sectors) meets the polity
  layer (regime): land transfer moves economic/military substance sector by
  sector, while collapse / vassalage / surrender happen to the regime as a
  whole — the capital is that layer's map anchor. In the 1v1 duel, **taking the
  enemy capital wins the match** — the sole terminus (no points, no timeout-draw).

## Sealed concept (details: RULINGS CP-①)

- Designation: player picks one of the seat's main city sectors at match start.
- Capital guard (근위대): land-derived (가안 350 × capital sector population),
  garrison-class, place-bound; doubles as the final-battle stock.
- Capital fall = regime event (collapse cascade / forced-vassalage trigger),
  distinct in KIND from losing an ordinary city (economic/military hit).
- Forward-capital reward emerges from force accounting (the guard holds the
  gate, freeing the field army) — NOT from a bolted-on multiplier
  (mobilization-hub ×1.25 rejected; CP-① riders).

## 1v1 duel win condition (details: RULINGS CP-②)

- **Capital fall = the sole win condition** (ADR 0042). Location PUBLIC (fog
  covers guard strength only, D1.2); placement player-chosen simultaneous (D1.3).
- **Forward / rear = leverage vs variance** (D1.4); **relocation (천도)** is a
  ruinous 행동력 gamble, old seat stays win-target until it completes (D1.5).
- **Fall = two late-game paths** (D2.1): decisive battle, or Moscow-trap
  (encircle → starve). The guard is an **ordinary terrain-gated garrison with NO
  special supply rule** → encirclable (D2.4); siege is emergent (D2.2).
- **Early-rush is pure emergent, no hard floor** (D2.3); bypass is self-limiting
  → the whole match is a **mutual-exposure duel** (D2.5).
- **CP-④ rump reasoning amended:** rump-impossible now holds because the match
  ENDS on capital fall, not because the capital is physically last.

## Open questions (stage-② design session)

1. Guard magnitude disposition (가안 350×pop; sweep + decapitation-spiral check).
   In 1v1 this couples with the **parallel map pass** (terrain-dependence of
   encirclement, capital-candidate site profiles — ledger "capital-terrain gate").
2. Troop-class conversion rules: field army ↔ garrison ↔ guard — i.e. the
   undefined semantics of sealed force-adjustment stack item ③ "standing-force
   stationing" (also: whether field→garrison stuffing is ever allowed; balance
   coupling with the forward/rear fork and M1/M2).
3. Located capital wiring: which battles the guard joins, capital-front
   detection, decapitation dynamics.
4. ~~Rump state~~ — **RESOLVED (CP-②).** In 1v1 the match ENDS the instant the
   capital falls, so no rump can exist; the reasoning is re-cut (was "capital
   battle is structurally last"). A forward capital may fall with land remaining
   (D1.4 risk) — the match still ends. No longer an open extension.
5. Bot designation rule (deterministic default, e.g. innermost highest-pop
   city; map's authored `capitals` as anchors).

## Pointers

- Win condition (THAT capital fall wins): ADR 0042.
- 1v1 win-condition seals (HOW): `RULINGS.md` CP-② + the duel-pivot ledger
  `.scratch/l3-playable-seam/duel-pivot-draft-ledger.md` (gates 1–2) + premises.
- Birth session design: `docs/superpowers/specs/2026-07-10-occupation-geography-design.md` §7
- Decisions + rejected alternatives: `RULINGS.md` (CP-①, CP-②)
- Terms: `GLOSSARY.md`
- Map's authored city/capital sectors: `mockup/combat-calc/map-gen.js`
  (`capitals` / `cities` tables; battle-summoning placement principle,
  user 2026-07-07)
