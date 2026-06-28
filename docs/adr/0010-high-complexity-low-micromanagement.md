# ADR 0010: High Complexity, Low Micromanagement

Date: 2026-06-29

Status: Accepted

## Context

The design is intentionally becoming deep: terrain, provinces, economy,
population, force roles, mobilization, AI, diplomacy, and events can all affect
conquest. However, the player should not be forced to manually execute every
low-level process every turn.

The desired experience is not high button count or repetitive administration.
It is high strategic depth with meaningful decisions and low routine
micromanagement.

## Decision

Adopt "high complexity, low micromanagement" as a core design principle.

The game may contain complex simulation under the hood, but player-facing
interaction should emphasize strategic intent:

- choose priorities;
- choose fronts;
- choose risks;
- choose policies or stances;
- choose important attacks or defenses;
- respond to meaningful events.

Avoid forcing the player to repeatedly perform low-level operations such as
manually assigning every small levy, moving every minor force, or confirming
every routine economic adjustment.

## Design Implications

Turn structure should be judged by how many meaningful commands it asks from
the player, not only by how accurately it simulates internal processes.

Systems should support intent-level commands such as:

- reinforce a frontier;
- prepare an offensive;
- defend a pass;
- mobilize a province;
- prioritize grain recovery;
- prepare a strait crossing.

Internal systems can translate those commands into mobilization, garrison
changes, movement, costs, and risks.

## Consequences

Future combat, economy, diplomacy, and event systems should expose automation
and defaults where possible.

Complexity is acceptable when it creates meaningful choices, readable outcomes,
or emergent consequences. Complexity is suspect when it only adds repetitive
clicks.

The next turn-structure decision should define the minimum acceptable
micromanagement level.
