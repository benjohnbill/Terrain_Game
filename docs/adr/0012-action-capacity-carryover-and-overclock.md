# ADR 0012: Action Capacity Carryover and Overclock

Date: 2026-06-29

Status: Accepted

## Context

The turn model uses four action capacities, such as command, administration,
diplomacy, and scholarship/technology. The player should be able to plan across
turns without feeling forced to spend every point immediately, but full storage
would encourage unrealistic burst turns.

The player also wants emergency flexibility: a state should be able to sacrifice
normal institutional balance and push one capacity using others at reduced
efficiency when the situation is desperate.

## Decision

Use partial carryover with decay and caps.

Unused capacity should become preparation or accumulated work rather than
vanishing completely. Carryover efficiency and maximum storage can differ by
capacity:

- command carries over poorly because military opportunity and readiness decay;
- administration carries over moderately as bureaucratic work and stored plans;
- diplomacy carries over moderately as channels, favors, and influence;
- scholarship/technology carries over well as research progress.

Expose carryover through capacity UI, including hover explanations that show
what is saved, what decays, and what cap applies.

Allow emergency cross-capacity overclocking.

The player may redirect one capacity to support another at reduced efficiency.
For example, scholarship/technology capacity can be diverted into military
planning, engineering, or analysis during a crisis, but it should produce less
command value than real command capacity and should create opportunity costs.

Overclocking has two intensities:

1. institutional redirection, such as scholars supporting military analysis,
   siege engineering, or battlefield surveying;
2. emergency human mobilization, such as scholars, officials, merchants, or
   other non-military groups being forced into direct defense or combat.

The second form is much more extreme. It should represent desperation, not
routine optimization. It may provide emergency force or defense, but should
damage normal capacity generation and create severe future risks.

## Consequences

Skipping immediate action can become a valid preparation strategy.

Capacity management remains strategic without forcing the player to spend every
point manually.

Overclocking creates freedom and drama, but must be shown with clear efficiency
losses and future costs so it does not become the default best move. Emergency
human mobilization should be especially costly and narratively framed as a
crisis measure.

UI should make both carryover and overclock tradeoffs visible before turn
confirmation.
