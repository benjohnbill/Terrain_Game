# Feature: Fog of War and Discovery (Designed)

## Status

**Model sealed 2026-08-03 (`RULINGS.md` ③): the estimate band is a witness
record, not a blur of the truth.** Values at `MAGNITUDE.md` FG-M① (가안, L0,
revisit at first playtest). That ruling closed `DECISIONS-OWED.md` Part 2 #1,
#4, #5 and #6 — the fog band blocking L3 build ticket 08.

Scope is the **mutable layer** — enemy substance, fatigue, army position, and
the reads derived from them. It is *not* position fog: geography has been public
from turn 0 since 2026-07-14, and the map-discovery model is retired. The heavier
Challenge/terrain-fog work stays deferred.

Not yet built. The L3 implementation is build ticket 08
(`.scratch/l3-playable-build/issues/08-project-standard-fog-and-price-recon.md`),
whose remaining gate is Wayfinder 12 (spec partition). The 2026-07-01 design spec
is **evidence of shape, superseded on the model** — read `RULINGS.md` ③ first.

## Idea

**Superseded 2026-07-14 (user): geography is public from turn 0; only the
mutable layer (substance, fatigue, army positions, posture) is fogged — see
slice-2 spec §6
(`docs/superpowers/specs/2026-07-14-slice2-operational-layer-design.md`).
The map-discovery half of the idea below is retired; the
information-gathering stakes survive on the mutable layer.**

*(Original idea, retained for the record)* Limit information at game start
(Civilization / StarCraft style): players know
the opponent count and ratio but must reveal the map themselves. Spawn positions
are not fixed, so opponents' starting locations are unknown. Early uncertainty
makes information-gathering (scouting) a high-stakes skill and makes terrain
identity matter from turn one - an open plains spawn plays very differently from
a defensible pass.

This deepens the existing information/scouting pillar (it gives `js/intel.js`
real stakes) and answers the macro-replayability gap surfaced in fun research:
random spawns plus fog make every playthrough a fresh discovery.

## Design Guardrail (to decide in the dedicated session)

Keep uncertainty skill-piercable, not fate: every loss should trace to a
decision (didn't scout, ignored intel, misjudged the response), not to the spawn
roll alone. Test: could a perfect player in the same seat have survived? If yes,
the fog is fair; if no, it is fate. Guardrail candidates: minimum spawn spacing,
scout reachability in time to respond, viable responses once a threat is seen,
subtle warning signals before total blindness.

## Resolved Questions (see the design spec)

- **AI information model under fog:** resolved to **contact-gating** — each
  faction holds a lightweight `contactedFactions` set and only targets factions
  it has met. No per-hex AI knowledge map; behavioral symmetry.
- **Preset impact:** resolved — the "scout early" baseline is **emergent** from
  passive ring-1 vision + spawn spacing + the purple blind-spot nudge + the
  one-click prefilled scout. Casual players are not blindsided; skill is
  deviating from that baseline.
- **Fog intensity as an opt-in dial:** resolved — **define three (Casual /
  Standard / Challenge), ship Standard only**. The `FogProfile` injection point
  is the deferred dial's seam.
- **Situation-judgment logic:** resolved — the briefing operates on discovered
  information only and emits purple blind-spot items for undiscovered border
  regions and uncontacted factions.
- **Ambiguity model (new):** resolved — the ambiguous middle state shows a
  deterministic, true-containing magnitude **estimate range** that scouting
  narrows (never collapses; residual ceiling + decay keep ownership superior).
- **Wall-grade visibility (2026-07-08):** resolved — fortification grade is
  public (classified with terrain, not magnitude). See `RULINGS.md` ①; first
  consumer is the tactical-plan-ai bot information model.
- **Read-layer presentation (2026-07-23, L3 Wayfinder gate 07):** resolved by
  live user reaction on a throwaway turn-loop prototype — the sealed 7-grade
  viewer matrix reads to a human; the derived-band grade now has an encoding
  (판세 = match-level mini-meter, 동원 강도 = sector-bound band, civilian
  register = derived); recon is a paid, deliberate live band-narrowing; the
  casual commit-first layout summons the info layer by the commit decision
  rather than painting it always; navigation is a coupled continuous camera; the
  renderer stays SVG (measurement-gated). See `RULINGS.md` ②. Recon economy
  NUMBERS (instant recon, radar pricing) stay candidate — project memory
  `terrain-game-recon-fog-economy.md`.
- **What the band IS (2026-08-03, user grill):** resolved — a **witness record**,
  not a blur of the truth. Observation testimonies accumulate, are corrected
  forward before intersection, age into vagueness rather than falsehood, and never
  let the true value enter the projection. Precision is graded and priced; free
  contact intelligence is deliberately coarser than a purchase; a substance band
  keeps an irreducible sliver. See `RULINGS.md` ③ and `MAGNITUDE.md` FG-M①. This
  supersedes the estimate-range mechanics of the 2026-07-01 design spec §5.2–§5.3
  and retires the archive's four band constants unported (ADR 0041 §2).

## Open questions

- **How the testimony history is presented.** Ruling ③ decided it is shown,
  summoned on designation rather than always painted; the surface design is
  deferred and registered in `docs/SYNC-DEBT.md`.
- **Whether the derived ageing envelope composes cleanly** from its three sealed
  inputs (recruitment rate, casualty curve, march reach). An implementation-time
  verification, also registered in `docs/SYNC-DEBT.md`.
- **Detection and radar pricing** — still candidates under `RULINGS.md` ②,
  deferred to the map scale-up pass.

## Files

- `GLOSSARY.md` — Tier-1 vocabulary: information confidence, estimate band
  (both re-cut 2026-08-03), observation testimony (coined 2026-08-03).
- `RULINGS.md` — decision record (① wall-grade visibility; ② read-layer
  presentation contract SEALED at L3 gate 07 + registered recon-economy
  candidates, 2026-07-23; ③ the witness model, SEALED 2026-08-03).
- `MAGNITUDE.md` — the owning dial sheet (FG-M①: observation precision and
  reconnaissance unit prices). Created 2026-08-03; numbers live here and nowhere
  else.

## Related

- `SPEC.md` - "Positioning and Fun Pillars" (skill is fitting the situation) and
  the design principle "information should have confidence and uncertainty".
- `docs/features/phase-1-fun-core/` - the MVP fun thrust this extends.
- 노화 헌법 P3 (`../match-arc/GLOSSARY.md`, MT-①) — the snapshot-information
  principle this feature's model implements.
- `js/intel.js` (IntelSystem) — **reference archive, not build source** (ADR
  0041). Its estimate-range model is superseded by ruling ③; consult it as
  evidence of the earlier shape, never as the contract.
- ADR 0048 (the witness model); ADR 0017 (opt-in depth); ADR 0009 / ADR 0014
  (anti-snowball counterplay).
