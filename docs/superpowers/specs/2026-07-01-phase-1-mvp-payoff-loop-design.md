# Phase 1 MVP Payoff Loop — Design (Tentative)

Date: 2026-07-01

Status: Draft (tentative — intended to be validated and revised by a UI mockup)

## Purpose

Design the loop that makes the core fun *felt*, per ADR 0018: a legible positive
payoff — growth the player can feel, a visible skill-driven edge, and a readable
map response — not only anti-snowball constraints.

This document is deliberately tentative. Its representation model is meant to be
put in front of a UI mockup as fast as possible and revised from what the mockup
teaches. It fixes the *representation model* (what each visual variable means),
not the pixels or layout, which belong to a separate UI/UX session.

## Relationship to Existing Docs

- Product truth: `SPEC.md` - "Positioning and Fun Pillars".
- Positioning decision: ADR 0017 (Civ-depth world, LoL-shaped interaction).
- Scope decision: ADR 0018 (MVP core-fun first; heavy capacity/overclock
  deferred) and ADR 0020 (single divisible capacity commitment is MVP core).
- Anti-snowball foundation: ADR 0009, ADR 0014. Map-first color language:
  ADR 0013.

## The Payoff Loop

```
decision -> system resolves -> player SEES:
  [what changed] [why] [what I gained] [what it opens]
-> feels growth (pillar 1) + feels own judgment caused it (pillars 2-3)
-> wants the next turn
```

The MVP must make every arrow after "system resolves" perceptible without
reading. Text is reserved for the *why* (a one-line reason or a forecast band),
never for conveying state.

For combat/defense outcomes, "what changed" should show both the front-sector
result and the province-level summary change: e.g. a sector gained/lost plus
`border → split`, `split → occupied`, or another province status transition.

## Growth Spine — What the Player Watches Grow

- **Primary (spatial): map development.** Conquered provinces visibly develop and
  enrich over turns. The player watches their territory "light up" on the map.
- **Summary (aggregate): power trend and relative standing.** A single national
  strength figure trends upward across turns, and the player's rank relative to
  rivals is always visible.

The spatial layer carries the felt growth; the aggregate layer carries the
"am I winning?" glance and the "one more turn" curve.

## Representation Model (Tentative) — "See, Don't Read"

Principle: encode state in visual variables (color, size, intensity, position,
motion); reserve text for *why*. The player should read the map like a
dashboard, the way a League of Legends player reads gold-diff, tower state, and
map control at a glance rather than from a paragraph.

### The "Am I Winning?" Glance

- **Power-differential bar** — self vs strongest rival, persistent. (~ gold diff)
- **Ranking ladder** — factions ranked by strength; re-orders visibly as the
  player rises or falls. (~ scoreboard)
- **Map area by owner** — territory already reads spatially. (~ tower count)
- **Momentum** — recently gained/lost provinces carry a trend indicator.
  (~ gold-graph slope)

```
[self ###########----- rival]   power +18% ^      relative standing, at a glance
1. self    142 / 38%  ^         ladder re-orders as rank changes
2. rival   121 / 29%  v
3. third    88 / 18%  -
```

### Map Growth as Visual Weight

Development is shown by visual weight — color intensity, icon density, glow — not
by text. A developed grain basin reads rich and bright; a newly taken frontier
reads dim.

- **Overlay lenses** (toggle): value / development / threat / control, built on
  the ADR 0013 color language (red, gold, blue, green, purple, silver).
- **Hover = a compact stat chip** (icons + numbers + mini-bars), not a paragraph.
- **Click = a prefilled command card** (an action), not a lore dump.
- **Control/status vs judgment highlight are separate visual layers.** Province
  status/control share provides the base fill or ownership mix; situation axis
  provides the current-turn highlight (threat/opportunity/uncertainty pulse or
  outline); confidence provides fog, hatching, dotted outlines, or uncertainty
  treatment.

```
development overlay:  [rich/developed]  [growing]  [undeveloped/new]
hover chip:  [ grain basin  economy 84  defense ###-- ]
click:       -> prefilled command card (action)
```

### Summary Table

| What | Visual variable | LoL analogue |
|---|---|---|
| My growth (pillar 1) | power-trend figure + ladder re-order + development glow | gold graph + items |
| Relative advantage | map area + power-differential bar | tower count + gold diff |
| Momentum | trend indicator on recently gained/lost provinces | gold-graph slope |
| Province state | color intensity + icon density (hover = chip) | minion/tower health bars |

## Making the Skill Edge Visible (Pillars 2-3) — OPEN

This is the hardest and most differentiating part, and is not yet solved. Skill
is defined as fitting the specific situation versus the posture's
statistical-average preset (SPEC pillar 2); the edge must be *seen* to feel
earned.

Initial directions to explore (all tentative):

- **Show the delta over the safe default.** When the player adjusts a prefilled
  command, surface how the adjusted outcome compares to the preset baseline
  ("your read: +X over the default"), so a good adjustment is visibly rewarded.
- **Show opportunity chaining.** A conquest visibly highlights the new options it
  opens (adjacent targets, routes), making the skill-driven snowball legible as
  expanding possibility rather than an auto-growing number.
- Reuse the existing combat forecast band (inferior / even / superior /
  overwhelming) as the readable, non-deterministic outcome surface.

This section is the primary open problem for the next design pass and should be
sharpened alongside mockup learnings.

## Non-Goals / Deferred

- Four-capacity/carryover/overclock system — deferred (ADR 0018). Single
  divisible capacity commitment remains MVP core (ADR 0020).
- Pixel layout, styling, screen IA — belong to the separate UI/UX session.
- Time pressure — an opt-in mode and a prototype question (SPEC "To validate"),
  not part of this loop.

## Validation Plan

Get a UI mockup of the representation model in front of the user as fast as
possible and revise from hands-on judgment. This spec exists to enable that
mockup, not to precede it with a complete design.

## Open Threads

- Edge-visibility (pillars 2-3) — see the OPEN section above.
- Preset differentiation (SPEC "Open thread").
- Exact development tiers, power formula, and payoff magnitudes — to be tuned
  against the mockup and playtest, not fixed here.
