# Strategy Ground Product Requirements Document

> **Status:** Working PRD for the AX landing submission  
> **Date:** 2026-07-16  
> **Authority:** This document translates the current product direction for a
> landing surface. Gameplay canon remains in `SPEC.md`, `DESIGN.md`,
> `DOMAIN_MAP.md`, accepted ADRs, and sealed feature documents.

## 1. Product summary

`Strategy Ground` is the provisional market-facing name for a browser-based,
turn-based war strategy game in development. The game pursues high systemic
complexity with low micromanagement: players read geography, allocate limited
capacity, manage information, and commit to a small number of consequential
plans rather than manually operating every unit and settlement.

The desired payoff is not a scripted historical scenario. The system should let
players create outcomes that feel historical: an inferior force can prepare a
Myeongnyang-like reversal, a retreat and scorched-earth plan can exhaust an
invader, or a poorly chosen decisive battle can destroy a field army and place
the state in crisis.

## 2. Problem

Many players like the depth and fantasy of war simulations but cannot justify
matches that demand dozens of hours or repetitive late-game administration.
Real-time competitive games compress growth, adaptation, and climax into one
session, but often gate expression behind mechanical speed. `Strategy Ground`
tests a different proposition: preserve the density of strategic cause and
effect while compressing the interaction into readable turn-based judgments.

## 3. Target users

### Primary product audience

- Players who enjoy war simulation, 4X, or grand strategy but find long matches
  and late-game busywork burdensome.
- Genre players who want unfamiliar strategic grammar rather than another
  content-heavy variation of familiar systems.
- Players motivated by planning a dramatic reversal or decisive campaign more
  than by executing high-frequency mechanical inputs.

### Immediate landing audience

AX program evaluators will receive a URL and inspect it without a narrated
presentation. They need to understand the product, its differentiation, its
current development stage, and the relationship between the current prototype
and long-term vision.

## 4. Product promise

> **A compressed war simulation where a few connected decisions shape battles
> no script could write.**

The promise has three parts:

1. **Authored war:** the player creates the conditions of victory or collapse.
2. **Strategic compression:** depth comes from connected consequences, not an
   expanding list of routine actions.
3. **Emergent history:** the fictional world can produce history-like outcomes
   without reproducing specific historical campaigns.

## 5. Core experience

The experience follows a repeating judgment loop:

1. Read the situation through terrain, routes, fortifications, visible forces,
   and incomplete information.
2. Choose a plan and decide where limited capacity and forces matter most.
3. Commit while accepting that the opponent is acting under the same fog and
   timing pressure.
4. Observe persistent consequences that reshape the next judgment.
5. Build toward a decisive battle, negotiated settlement, or state crisis.

Current cadence authority lives in the match-arc and war-model feature
documents. For the landing, it is sufficient to communicate that operations
unfold across several turns, wars include preparation and settlement rather
than a single attack button, and the broader match is designed around a compact
session rather than an open-ended campaign.

## 6. Product principles

- **High complexity, low micromanagement:** retain meaningful causes while
  reducing repetitive inputs.
- **Map-first judgment:** geography and situation reading precede command entry.
- **Consequence over activity:** decisions earn weight through delayed and
  persistent effects.
- **Legible uncertainty:** incomplete information creates judgment, not random
  opacity.
- **Triumph and catastrophe:** both the prepared reversal and the disastrous
  misread belong to the intended narrative space.

## 7. Scope horizons

### Current MVP

The current browser build is an active systems prototype. It is evidence that
the map, situation, command, and war-model direction is being implemented; it
must not be described as a finished playable demo. Features deferred by current
canon—such as a complete quality/technology progression, production PvP, or a
finished Steam loop—remain future direction.

### AX landing MVP

The immediate submission must:

- explain the product without narration in roughly 60–90 seconds;
- use `Strategy Ground` as a provisional title;
- provide an English Hero and Korean explanatory copy;
- show one lightweight map interaction that connects judgment to consequence;
- distinguish `Now`, `Next`, and `Vision` without dates;
- link to the current development build using honest prototype language;
- work on desktop and mobile and remain legible without animation.

### Production landing

After stronger game proof exists, the page may add captured gameplay, a richer
scroll narrative, an interactive vertical slice, playtest recruitment, account
or waitlist infrastructure, and Steam conversion. These are not requirements
for the AX submission.

## 8. Landing information architecture

1. **Hero:** name, differentiated promise, concise Korean explanation, and two
   routes: explore the model or inspect the development build.
2. **Problem and answer:** contrast long-form busywork with concentrated
   strategic consequence without attacking named competitors.
3. **War-model interaction:** four states—read, position, commit, consequence—
   change a fictional operational map and its explanation.
4. **Emergent history:** show how the same systems can create reversal or ruin.
5. **Product principles:** explain complexity, micromanagement, uncertainty,
   geography, and match compression as a coherent system.
6. **Development status:** separate current proof, next proof target, and
   long-term product vision.
7. **Closing statement:** reiterate the product thesis and identify the build as
   in development.

## 9. Success criteria

The AX landing succeeds when a reviewer can answer, without narration:

- What kind of game is this?
- Why is it different from a conventional long-form war simulation?
- What decisions does the player make?
- What exists now, and what remains a vision?
- Where can the current development build be inspected?

Technical acceptance requires a stable public URL, no broken navigation, no
horizontal overflow at common mobile widths, keyboard-operable interaction,
reduced-motion support, and no critical browser-console errors.

## 10. Non-goals

- Promising a release date, price, Steam availability, or multiplayer launch.
- Collecting email/password accounts, waitlist data, or Firestore records.
- Simulating unsealed combat odds on the landing page.
- Presenting fictional mock telemetry as current game output.
- Recreating the complete game UI or building a React/Next.js application for
  the submission.

## 11. Risks and mitigations

- **Risk: the landing looks more complete than the game.** Label the build and
  development state explicitly; use conceptual interaction rather than fake
  runtime statistics.
- **Risk: the concept remains abstract.** Make the map interaction demonstrate
  a visible chain from terrain reading to commitment and consequence.
- **Risk: visual ambition delays submission.** Keep the existing static stack,
  one interaction, and no authentication or database dependency.
- **Risk: provisional branding becomes accidental canon.** Mark `Strategy
  Ground` as a working title in project documentation and defer legal clearance.

## 12. Distribution direction

The immediate page is a Firebase-hosted submission artifact. The browser build
continues to serve as a validation surface. Steam remains the intended product
distribution direction, but the PRD makes no launch-date or conversion claim
until a suitable build and publishing plan exist.
