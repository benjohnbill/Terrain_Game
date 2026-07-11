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
| 0008 | Phase 1 Combat and Economy Stat Scope | 2026-06-29 | Accepted | ← Amended by 0031 (force-geography defense model) |
| 0009 | Force Roles and Mobilization Risks | 2026-06-29 | Accepted | — |
| 0010 | High Complexity, Low Micromanagement | 2026-06-29 | Accepted | — |
| 0011 | Strategic Posture as Guidance | 2026-06-29 | Accepted | — |
| 0012 | Action Capacity Carryover and Overclock | 2026-06-29 | Accepted | — |
| 0013 | Map-First Situation UX | 2026-06-29 | Accepted | — |
| 0014 | Local Garrison Sustainment From Province Economy | 2026-06-29 | Accepted | ← Amended by 0022 (front-sector garrison scope) · ← Amended by match-arc MT-① (P1 dual billing) · ← Amended by 0031 (facing-shield garrisons) |
| 0015 | Strait Crossing Penalty And Deferred Naval System | 2026-06-29 | Accepted | Self-amended 2026-07-03 (magnitude pass — penalty values) |
| 0016 | Web Technology Stack With Trigger-Based Migration Path | 2026-06-29 | Accepted | ← Amended by 0028 (UI-shell/renderer axis split, L3 = Stage 1 trigger forecast) |
| 0017 | Positioning — Civ-Depth World, LoL-Shaped Interaction | 2026-07-01 | Accepted | — |
| 0018 | Phase 1 MVP — Core Fun First, Defer Capacity/Overclock | 2026-07-01 | Accepted | ← Amended by 0020 (single divisible pool → core) |
| 0019 | Situation Judgment as a Structured, Posture-Lensed Reading | 2026-07-01 | Accepted | Self-amended 2026-07-06 (v5 front-sector — lens/leak-through, no overview recommendation) |
| 0020 | Minimal Action-Capacity Divisibility is Core | 2026-07-01 | Accepted | → Amends 0018 · ← Amended by 0027 (main/surplus = magnitude labels, no hard cap) |
| 0021 | Under-Commitment Failure Causes Front-Sector Loss | 2026-07-01 | Accepted | — |
| 0022 | Front Sectors as the One-Turn Operational Layer | 2026-07-01 | Accepted | → Amends 0014 · ← Amended by 0029 (uniform integration lag) |
| 0023 | Province Status and Control Summary From Front Sectors | 2026-07-01 | Accepted | — |
| 0024 | Operation Plan Presets for Core Commands | 2026-07-01 | Accepted | — |
| 0025 | Turn-Based Core with the Uncertainty Duel | 2026-07-02 | Accepted | — |
| 0026 | One-Shot Plan Effects, Persistent State, Standing Rules | 2026-07-02 | Accepted | — |
| 0027 | Free Commit Allocation — Main/Surplus as Magnitude Labels | 2026-07-07 | Accepted | → Amends 0020 |
| 0028 | L3 Build-Out Stack Direction — UI-Shell/Renderer Axis Split | 2026-07-10 | Accepted | → Amends 0016 |
| 0029 | Uniform Integration Lag on Acquired Land | 2026-07-10 (sealed 2026-07-11) | Accepted | → Amends 0022 |
| 0030 | Victory Conditions — Hegemony Decision Point and Domination Victory | 2026-07-10 | Accepted | Backfill (forensics F-06/07); definitions live at match-arc birthplaces · ← Amended by 0034 (structural crisis end for the never-tripped tail) |
| 0031 | Force-Geography Defense Model — Terrain-Bound Defense and Reactive Reserve | 2026-07-10 | Accepted | → Amends 0008, 0014 · Backfill (forensics F-08) |
| 0032 | Sector-Resolution Occupation Geography — The L2 World Model | 2026-07-11 | Accepted | → Supersedes (in part) the 2026-07-10 realm-accumulator implementation (DT-② intent stands); carries the SPEC #9 principle promotion · ← Amended by 0034 + match-arc AB-② (world of record → FG+M9+frac 1) |
| 0033 | Unassailability Affordability Bound | 2026-07-11 | Accepted | → Amends match-arc ruling ⑪ (futures affordability-bounded; refinement, not reversal) |
| 0034 | Match End — Sudden-Death Crisis Ending (Direction) | 2026-07-11 | Accepted | → Amends 0030 (structural end for the undecided tail) · → Amends 0032 with match-arc AB-② (record world) · ← Amended by 0035 (internal-uprising source, Westphalian draw, arc 25→35) |
| 0035 | Match End — Internal-Uprising Crisis Arc (Design Skeleton) | 2026-07-11 | Accepted | → Amends 0034 (source family, draw fallback, arc timeline) · rulings CE-①…⑫ · SPEC amendment user-sealed 2026-07-11 · ← Extended by 0036 (rebellion body) |
| 0036 | Crisis Rebellion Body and the Death of Peacetime Institutions | 2026-07-12 | Accepted | → Extends 0035 (skeleton → body; gate 5 resolved) · rulings CE-⑬…⑳ · truce/white-peace canonized (SPEC_GAPS ⑤/⑦ resolved) |
