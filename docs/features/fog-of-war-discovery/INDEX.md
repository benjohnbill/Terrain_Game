# Feature: Fog of War and Discovery (Designed)

## Status

**Model sealed 2026-08-03 (`RULINGS.md` ③): the estimate band is a witness
record, not a blur of the truth.** Values at `MAGNITUDE.md` FG-M① (가안, L0,
revisit at first playtest). That ruling closed `DECISIONS-OWED.md` Part 2 #1,
#4, #5 and #6 — the fog band blocking L3 build ticket 08.

**Subject sealed later the same day (`RULINGS.md` ④, ADR 0050): a testimony's
subject is set by whether that subject can move.** Ruling ③ said what a testimony
is; ④ says what it is *about*, which ③ had left unstated and which turned out to be
ticket 08's real blocker. Field-army substance and fatigue attach to the **force**;
garrison substance, 동원 강도 and civilian register attach to the **sector**; 판세
to the realm. Six decisions ride with it — division weakens rather than kills a
testimony, identity is free only under **unbroken contact**, re-acquisition is a new
contact, the two subjects age visibly differently, the census is an evidence contrast
rather than a computed remainder, and the dealer does not spend all of its precision.

Scope is the **mutable layer** — enemy substance, fatigue, army position, and
the reads derived from them. It is *not* position fog: geography has been public
from turn 0 since 2026-07-14, and the map-discovery model is retired. The heavier
Challenge/terrain-fog work stays deferred.

**Built 2026-08-05.** The L3 implementation is build ticket 08
(`.scratch/l3-playable-build/issues/08-project-standard-fog-and-price-recon.md`),
now `resolved` — the testimony and intelligence-ledger modules landed and merged
into `main`. *(This paragraph read "whose remaining gate is Wayfinder 12" until
2026-08-03, then "**`open` and takeable as of 2026-08-03**" until 2026-08-05. Both
were true when written; the ticket closed the night of the 4th.)* The 2026-07-01
design spec is **evidence of shape, superseded on the model** — read `RULINGS.md`
③ then ④.

**Two things landed on this feature the same week and are not in the rulings
above.**

- **Where ④ decision 6's census surface goes — placed 2026-08-05 by ADR 0053.**
  ④ sealed what the evidence contrast must do and deliberately did not place it,
  naming build ticket 04. It is placed now: **no in-play 판세 meter**; the top
  strip carries **coverage** (how much of the opponent's ground this viewer has
  observed), and the contrast is summoned from it. That closed
  `DECISIONS-OWED.md` Part 2 #13 and amended this feature's own `RULINGS.md` ②,
  which restated gate 07's retired 판세 mini-meter encoding in a form that reads
  as normative — stamped there. One thing did **not** close with it: gate 03
  C03.6 routed enemy-treasury uncertainty through a 판세 band width, and there is
  no 판세 band (`docs/SYNC-DEBT.md`).
- **⚠ An open decision-grade finding against this feature's own seal.** Ticket
  08's two-axis review found the sealed band is **invertible by a knowledgeable
  viewer**: ④ decision 7's asymptote holds for the band and not for what a viewer
  can compute from it, so accumulated looks pin the truth far tighter than the
  displayed width admits. The code implements the seals exactly, which is why it
  is a decision against ④ decision 7 and FG-M① rather than a defect. Registered
  in `docs/SYNC-DEBT.md` § Open and **not yet ruled** — read it before treating
  FG-M①'s values as settled.

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
- **What a testimony is ABOUT (2026-08-03, user grill):** resolved — its
  **subject**, set by whether that subject can move. Field-army substance and
  fatigue attach to the force; garrison substance, 동원 강도 and civilian register
  to the sector; 판세 to the realm. The recorded either/or (sector *or* force) was
  a false dilemma. Identity across observations is free only under unbroken
  contact, re-acquisition after a gap is a new contact, a division weakens a
  testimony rather than killing or preserving it, and the census reaches the player
  as an evidence contrast rather than a computed remainder. See `RULINGS.md` ④ and
  ADR 0050; the one derived value (the reporting spread) is at `MAGNITUDE.md` FG-M①.

## Open questions

- **How the testimony history is presented.** Ruling ③ decided it is shown,
  summoned on designation rather than always painted; the surface design is
  deferred and registered in `docs/SYNC-DEBT.md`.
- **Where the census evidence contrast is surfaced.** Ruling ④ decision 6 sealed
  what it must and must not do and deliberately left the placement to
  `DECISIONS-OWED.md` Part 2 #13 (build ticket 04's blocker).
- **Whether garrison substance stays sector-attached.** It does while garrisons
  cannot move; ④ decision 1's rider fires when garrison→field posture transfer is
  built. Registered in `docs/SYNC-DEBT.md`.
- **Whether the knowledge matrix should carry an adjacency grade.** Ruling ④
  decision 3 leans on its absence to price tracking, and no seal says the absence
  is deliberate. Picked up at the first playtest; registered in
  `docs/SYNC-DEBT.md`.
- **Detection and radar pricing** — still candidates under `RULINGS.md` ②,
  deferred to the map scale-up pass.

*Closed 2026-08-03:* **whether the derived ageing envelope composes cleanly** from
its three sealed inputs. It was listed here as an implementation-time verification
while the check still consumed an unnamed input — the envelope's subject — so it
could not be performed at all. Ruling ④ named the subject and the check became
genuinely performable, which is where it now sits (stamped at `RULINGS.md` ③ and
ADR 0048).

## Files

- `GLOSSARY.md` — Tier-1 vocabulary: information confidence, estimate band
  (both re-cut 2026-08-03), observation testimony (coined 2026-08-03), testimony
  subject and unbroken contact (both registered 2026-08-03, ruling ④).
- `RULINGS.md` — decision record (① wall-grade visibility; ② read-layer
  presentation contract SEALED at L3 gate 07 + registered recon-economy
  candidates, 2026-07-23; ③ the witness model, SEALED 2026-08-03; ④ a testimony's
  subject, SEALED 2026-08-03).
- `MAGNITUDE.md` — the owning dial sheet (FG-M①: observation precision and
  reconnaissance unit prices, plus two derived consequences — the ρ crossover and
  the reporting spread). Created 2026-08-03; numbers live here and nowhere else.

## Related

- `SPEC.md` - "Positioning and Fun Pillars" (skill is fitting the situation) and
  the design principle "information should have confidence and uncertainty".
- `docs/features/phase-1-fun-core/` - the MVP fun thrust this extends.
- 노화 헌법 P3 (`../match-arc/GLOSSARY.md`, MT-①) — the snapshot-information
  principle this feature's model implements.
- `js/intel.js` (IntelSystem) — **reference archive, not build source** (ADR
  0041). Its estimate-range model is superseded by ruling ③; consult it as
  evidence of the earlier shape, never as the contract.
- ADR 0048 (the witness model) and **ADR 0050** (its subject — force for what
  moves, sector for what does not); ADR 0017 (opt-in depth); ADR 0009 / ADR 0014
  (anti-snowball counterplay).
- ADR 0047 (sector-origin population accounting) — what makes the immobile half of
  ruling ④ true: a serving body keeps its sector origin wherever it stands, so a
  sector's mobilization reading cannot march away.
