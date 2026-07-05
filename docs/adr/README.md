# Architecture Decision Records

ADRs capture durable decisions for Terrain Game.

Use this format:

- Status: Proposed, Accepted, Superseded, or Rejected.
- Context.
- Decision.
- Consequences.

Accepted ADRs guide implementation until superseded.

## Supersession protocol

Cross-ADR relationships follow the ADR supersession protocol in
`.claude/rules/documentation-law.md`. A new ADR that changes or
contradicts an existing one MUST, in the same commit: name what it
supersedes/amends in its own header, AND stamp the OLD ADR's header
(`Superseded by:` / `Amended by: ADR-XXXX (date)`) plus a one-line
delta, so a stale ADR read in isolation announces its own staleness.
The header fields below are the structured form of those stamps;
plain-`Accepted` ADRs carry no relationship field, and this index is
their normalization surface.

## Status index

Rebuild this table whenever an ADR is added or its status changes
(session-close ADR-stamp duty). Relationship column: → amends/supersedes
a target; ← is amended/superseded by a later ADR.

| ADR | Title | Date | Status | Relationship |
|---|---|---|---|---|
| 0001 | Terrain-First East Asia-Inspired World | 2026-06-29 | Accepted | — |
| 0002 | Hex-First, Province-Compatible Map Units | 2026-06-29 | Accepted | — |
| 0003 | Large World With Active Region Simulation | 2026-06-29 | Accepted | — |
| 0004 | Named Provinces Over Terrain Layers | 2026-06-29 | Accepted | — |
| 0005 | Hybrid Historical-Fictional Place Names | 2026-06-29 | Accepted | — |
| 0006 | Province Archetype Regions Use Terrain Layers | 2026-06-29 | Accepted | — |
| 0007 | Settlement and Function Layer | 2026-06-29 | Accepted | — |
| 0008 | Phase 1 Combat and Economy Stat Scope | 2026-06-29 | Accepted | — |
| 0009 | Force Roles and Mobilization Risks | 2026-06-29 | Accepted | — |
| 0010 | High Complexity, Low Micromanagement | 2026-06-29 | Accepted | — |
| 0011 | Strategic Posture as Guidance | 2026-06-29 | Accepted | — |
| 0012 | Action Capacity Carryover and Overclock | 2026-06-29 | Accepted | — |
| 0013 | Map-First Situation UX | 2026-06-29 | Accepted | — |
| 0014 | Local Garrison Sustainment From Province Economy | 2026-06-29 | Accepted | ← Amended by 0022 (front-sector garrison scope) |
| 0015 | Strait Crossing Penalty And Deferred Naval System | 2026-06-29 | Accepted | Self-amended 2026-07-03 (magnitude pass — penalty values) |
| 0016 | Web Technology Stack With Trigger-Based Migration Path | 2026-06-29 | Accepted | — |
| 0017 | Positioning — Civ-Depth World, LoL-Shaped Interaction | 2026-07-01 | Accepted | — |
| 0018 | Phase 1 MVP — Core Fun First, Defer Capacity/Overclock | 2026-07-01 | Accepted | ← Amended by 0020 (single divisible pool → core) |
| 0019 | Situation Judgment as a Structured, Posture-Lensed Reading | 2026-07-01 | Accepted | Self-amended 2026-07-06 (v5 front-sector — lens/leak-through, no overview recommendation) |
| 0020 | Minimal Action-Capacity Divisibility is Core | 2026-07-01 | Accepted | → Amends 0018 |
| 0021 | Under-Commitment Failure Causes Front-Sector Loss | 2026-07-01 | Accepted | — |
| 0022 | Front Sectors as the One-Turn Operational Layer | 2026-07-01 | Accepted | → Amends 0014 |
| 0023 | Province Status and Control Summary From Front Sectors | 2026-07-01 | Accepted | — |
| 0024 | Operation Plan Presets for Core Commands | 2026-07-01 | Accepted | — |
| 0025 | Turn-Based Core with the Uncertainty Duel | 2026-07-02 | Accepted | — |
| 0026 | One-Shot Plan Effects, Persistent State, Standing Rules | 2026-07-02 | Accepted | — |
