# Feature: Fog of War and Discovery (Designed)

## Status

Design approved. Brainstorming complete; the design is recorded in
`docs/superpowers/specs/2026-07-01-fog-of-war-discovery-design.md`. Next step is
an implementation plan. Scope is the Standard fog MVP (position fog); the heavier
Challenge/terrain-fog work is deferred.

## Idea

Limit information at game start (Civilization / StarCraft style): players know
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

## Files

- `GLOSSARY.md` — Tier-1 vocabulary (created 2026-07-10, terminology-audit
  ghost registration): information confidence, estimate band.
- `RULINGS.md` — decision record (① wall-grade visibility).

## Related

- `SPEC.md` - "Positioning and Fun Pillars" (skill is fitting the situation) and
  the design principle "information should have confidence and uncertainty".
- `docs/features/phase-1-fun-core/` - the MVP fun thrust this extends.
- Existing scouting: `js/intel.js` (IntelSystem) and the scout-vs-attack
  trade-off.
- ADR 0017 (opt-in depth); ADR 0009 / ADR 0014 (anti-snowball counterplay).
