# ADR 0013: Map-First Situation UX

Date: 2026-06-29

Status: Accepted

## Context

The player should enjoy reading the strategic situation and making a few
meaningful conquest decisions. Core commands should not begin from blank forms
or dense menus. The map itself should expose the important tension points before
the player selects a target.

The design goal remains high complexity with low micromanagement.

## Decision

Use a map-first situation UX.

Before the player creates a core command, the map and briefing should show:

- where the important threats and opportunities are;
- why those places matter;
- how reliable the available information is;
- which command types are plausible starting points.

Use visual emphasis on the map rather than forcing the player to inspect every
province manually.

Suggested visual language:

- red: military threat or invasion risk;
- gold: high conquest value;
- blue: defensive key point;
- green: economic growth, recovery, or development value;
- purple: uncertain information or scouting need;
- silver/white: movement, supply, pass, strait, or route constraint.

Only the most relevant locations for the current turn should receive strong
emphasis. Avoid turning the whole map into visual noise.

## Interaction Loop

The intended loop is:

1. read a short turn briefing;
2. inspect highlighted/pulsing map locations;
3. hover a location for reason, confidence, and possible commands;
4. click a location to open a prefilled command card;
5. adjust the command if desired;
6. confirm the turn and receive a strategic result report.

Briefing items should be linked to map pings or pulses.

Hover should prioritize judgment reasons over raw tables. Example information:

- strategic value;
- threat or opportunity reason;
- information confidence;
- terrain/crossing risk;
- estimated enemy strength range;
- plausible command starts.

## Consequences

The player can make choices from the map rather than from abstract menus.

The UI can support complexity while keeping routine clicks low.

This decision must be validated with actual mockups and playable builds. The
exact visual treatment may change after testing.
