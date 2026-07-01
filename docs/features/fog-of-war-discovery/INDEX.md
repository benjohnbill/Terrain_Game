# Feature: Fog of War and Discovery (Proposed)

## Status

Proposed - needs its own brainstorming session before design or build. Sequenced
after the MVP payoff-loop mockup provides a representation foundation.

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

## Open Questions (for the dedicated session)

- **AI information model under fog:** symmetric (AI also has fog) vs omniscient
  (AI cheats). The current model assumes confidence is the human player's single
  view; AI scouting was out of scope.
- **Preset impact:** a default "scout early" baseline so casual players are not
  blindsided (preset = safe average; skill = knowing when to deviate).
- **Fog intensity as an opt-in dial:** casual (known or partial spawns) vs
  challenge (full fog + random spawn), consistent with opt-in depth (ADR 0017).
- **Situation-judgment logic:** the map-first briefing must operate on discovered
  information only and emphasize blind spots (purple = scouting need).

## Related

- `SPEC.md` - "Positioning and Fun Pillars" (skill is fitting the situation) and
  the design principle "information should have confidence and uncertainty".
- `docs/features/phase-1-fun-core/` - the MVP fun thrust this extends.
- Existing scouting: `js/intel.js` (IntelSystem) and the scout-vs-attack
  trade-off.
- ADR 0017 (opt-in depth); ADR 0009 / ADR 0014 (anti-snowball counterplay).
