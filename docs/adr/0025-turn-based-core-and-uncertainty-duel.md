# ADR 0025: Turn-Based Core with the Uncertainty Duel as the Pressure Engine

Date: 2026-07-02

Status: Accepted

## Context

Reviewing the operation-plan roster against real doctrine raised the question
of whether the game should move to multi-sector/multi-turn orders, and from
there whether it should become real-time. StarCraft/LoL-style immersion draws
on real-time play as a self-running time attack. But the product position is a
comparatively casual browser game — a war/empire simulation compressed into a
single match on the order of 30-40 minutes (an hour at most) — with a
League-shaped hand (SPEC positioning) and a judgment-centered skill identity:
read the situation, judge threat and opportunity under fog, choose commitment
(SPEC fun pillar 2, ADR 0019-0021).

Decomposing what real-time actually provides: clock tension, action-flow
narrative, simultaneity with the opponent, and a match that ends by itself.
These are separable, and turn-based games demonstrably deliver them (chess
blitz: turn-based plus a clock; Slay the Spire / Into the Breach: decision
density without any clock; Paradox titles are real-time yet produce 4-8 hour
matches — real-time does not by itself bound match length).

## Decision

1. **The game remains turn-based.** Full real-time conversion is rejected for
   the MVP and beyond; it would shift the tested skill from situation-reading
   to mechanical throughput, break ADR 0021's legibility rule (a rushed loss
   reads as "no time" — fate, not a traceable decision), and require
   tempo-pressing real-time AI far beyond the casual scope. Revisit only on a
   concrete trigger (ADR 0016 pattern): if prototypes of the pressure devices
   below all fail to produce tension.

2. **The core pressure engine is the uncertainty duel**: an
   information-asymmetric, effectively simultaneous commitment exchange under
   fog. The player commits capacity against a banded *estimate* of enemy force
   and an unrevealed enemy *intent* (the second fog, per the stage-2 command
   spec); the enemy acts on its own agenda without waiting for the player's
   read to be complete. "The board does not wait" comes from information
   asymmetry and simultaneity, not from a wall clock. This elevates the
   existing fog estimate bands, the 불확실 judgment axis, the scout gambit,
   and the no-intent-meter principle from supporting features to the named
   core of the game's tension.

3. **Enemy patterns are learnable — readable but never solvable.** AI factions
   carry individual behavioral tendencies (e.g. aggressive, cautious,
   deceptive) that a player can read across turns and across matches; random
   spawn variety (fog-of-war-discovery) keeps that learning at the system
   level rather than map memorization. Tendencies are probabilistic ranges,
   never deterministic tells; the fog confidence ceiling (no oracle,
   MAX_CONFIDENCE 0.90) is the same guardrail applied to behavior.

4. **The duel has two layers, and both must eventually exist**: a magnitude
   layer (how much to commit — the poker bet, already designed via the
   commitment slider and forecast band) and a categorical layer (which plan
   against which plan — the roshambo read). The combat-balancing formula must
   therefore include attacker-plan × defender-plan interaction, so that
   reading an opponent's tendencies pays off in plan *choice*, not only in
   commitment sizing.

5. **Parked, with owners.** Turn-currency scoring pressure (early-finish
   rewards, escalation scoring) is parked until rank/record systems exist.
   Wall-clock modes (a rapid-style per-player time budget with end-of-clock
   settlement; think-time-triggered events) remain the SPEC "time pressure as
   opt-in mode" prototype question; note the settlement function such a mode
   needs is the match-arc victory-condition function. World-clock event
   pressure (turn-scheduled or timeline events using fictional historical
   analogues per the ADR 0005 hybrid policy) belongs to the match-arc thread
   as a thin forward slice of the Phase 4 event roadmap.

## Considered Options

- **Full real-time (StarCraft/LoL model):** rejected — trades the game's
  judgment-skill identity for throughput skill, breaks loss legibility, and
  demands AI and engineering beyond the casual browser scope.
- **Real-time with pause (Paradox model):** rejected — casual players pause
  to read, reproducing turns with extra steps; genre evidence shows it does
  not bound match length.
- **Turn-based with the uncertainty duel as the pressure engine:** accepted —
  keeps deliberate reading as the tested skill while delivering tension
  through information asymmetry, simultaneity of commitment, and learnable
  opponents.

## Consequences

- The enemy-facing pole of `confidenceGain` (degrading the opponent's read —
  feint/deception) becomes strategically load-bearing rather than an unused
  corner of the axis model; feint-type plans gain standing as candidates.
- AI faction personality design is a first-class design surface: tendencies
  must be authored to be readable as ranges and resistant to full
  exploitation.
- The scout gambit and intent-fog rules in the stage-2 command spec are
  confirmed as core mechanics, not presentation garnish.
- The combat-balancing thread inherits a requirement: plan-vs-plan
  interaction (categorical duel layer), in addition to commitment × magnitude
  × defense conversion.
- The match-arc/victory-condition thread owns the world-clock question
  (settlement function, turn-scheduled pressure events, opt-in clock modes).
- MVP baseline pressure needs no event system: proactive AI acting on its own
  agenda each turn, made partially unreadable by fog, is the primary "the
  board does not wait" loop.
