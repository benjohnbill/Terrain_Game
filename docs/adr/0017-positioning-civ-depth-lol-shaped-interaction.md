# ADR 0017: Positioning — Civ-Depth World, LoL-Shaped Interaction

Date: 2026-07-01

Status: Accepted

## Context

The project's fun intent was scattered across the Context sections of earlier
ADRs and was never stated as a first-party positioning. Cross-session research
(claude-mem observations and repository documents) converged on a
"Civilization-like feeling" (ADR 0001), but the operative principle "high
complexity, low micromanagement" (ADR 0010) underspecified the *interaction*
model: it described reducing clicks, not where player skill is expressed.

The user sharpened the positioning using League of Legends and Hearthstone as
references. The key distinction: a game's inherent system complexity and the
complexity a player must operate are different axes. In LoL, the systems are
deep, but a player can win with simple play, while optional fine execution
(last-hitting, lane control, jungle routing) separates skill levels. The
compounding of many small, well-judged edges — not a mechanically guaranteed
lead — is what makes advantage feel earned.

Historical authenticity is wanted for world richness but must not burden
interaction, consistent with SPEC World Model ("historical geography is input
material... not a constraint that overrides game readability and balance") and
ADR 0001 / ADR 0005.

## Decision

Position the game as a "simple Civilization": a Civilization-depth world
operated with a League-of-Legends-shaped hand.

Decouple complexity into distinct axes and target each separately:

- **System / simulation complexity — high.** Terrain, regional value,
  positional force model, and historical flavor make the world rich.
- **Required interaction complexity — low.** Posture presets and prefilled
  command cards provide a competent baseline; a casual player can pass turns
  without fine control and still play well.
- **Expressed interaction complexity — opt-in.** Fine situational adjustment
  yields compounding small edges; engaged players can express mastery without
  it being mandatory.

Define skill as fitting the specific situation. A posture preset is the
statistical-average setup for a stance; the specific situation is never average.
Skill is reading the real situation and adjusting from that average toward the
situation-optimal. Advantage accumulates from these skill differences (a
skill-driven snowball), not from state-driven auto-compounding — which is the
purpose of the anti-snowball mechanics (ADR 0009, ADR 0014).

Historical authenticity lives on the world/system axis only and must not raise
required interaction complexity.

This ADR extends and sharpens ADR 0010; it does not supersede it.

## Consequences

- SPEC.md gains a "Positioning and Fun Pillars" section as the first-party
  product truth this ADR records the decision behind.
- Design changes are evaluated against a floor/ceiling test: does the change
  keep the floor low (presets and prefilled commands remain sufficient) while
  adding a legible opt-in edge for engaged players?
- The command card (prefilled defaults with optional adjustment of intent,
  intensity, and sources) is the primary opt-in-depth surface; posture presets
  provide the baseline. Whether presets alone carry enough distinctive depth is
  an open design thread (see SPEC "Open thread").
- Time pressure is treated as a separate opt-in mode and a prototype question,
  not a committed core mechanic (see SPEC "To validate").
- Multiplayer and heavy logic micro-refinement remain out of scope for now.
