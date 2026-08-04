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
`DOCUMENTATION-LAW.md`. A new ADR that changes or
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
| 0016 | Web Technology Stack With Trigger-Based Migration Path | 2026-06-29 | Accepted | ← Amended by 0028 (UI-shell/renderer axis split, L3 = Stage 1 trigger forecast) · ← Amended by 0039 (Stage 1 fired: React + Vite) · ← Amended by 0040 (canonical L3 source = TS/TSX; execution runtime remains JS) · ← Amended by 0041 (Stage 2 native shell = declared destination; "static browser app" scoped to the reference prototype) |
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
| 0028 | L3 Build-Out Stack Direction — UI-Shell/Renderer Axis Split | 2026-07-10 | Accepted | → Amends 0016 · ← Amended by 0039 (Stage 1 fired; UI choice resolved) · ← Amended by 0040 (framework-free TS source emitted for browser/Node parity) · ← Amended by 0041 (deployment target stated: game ships in a native shell, not static hosting) |
| 0029 | Uniform Integration Lag on Acquired Land | 2026-07-10 (sealed 2026-07-11) | Accepted | → Amends 0022 |
| 0030 | Victory Conditions — Hegemony Decision Point and Domination Victory | 2026-07-10 | **Superseded by 0042** | Backfill (forensics F-06/07) · ← **Superseded by 0042** (1v1 capital-fall pivot; no hegemony gate in a duel) · ← Amended by 0034 (now moot — crisis retired with the gate) |
| 0031 | Force-Geography Defense Model — Terrain-Bound Defense and Reactive Reserve | 2026-07-10 | Accepted (partly stale) | → Amends 0008, 0014 · Backfill (forensics F-08) · ← Advanced by 0037 (engine adoption → build) · ← Partly stale per 0042 (mechanics survive; multi-realm framing historical) |
| 0032 | Sector-Resolution Occupation Geography — The L2 World Model | 2026-07-11 | Accepted (partly stale) | → Supersedes (in part) the 2026-07-10 realm-accumulator implementation (DT-② intent stands); carries the SPEC #9 principle promotion · ← Amended by 0034 + match-arc AB-② (world of record → FG+M9+frac 1) · ← War-model-build 0037 retires the L2 harness (sector-identity model = build target) · ← Partly stale per 0042 (occupation model survives as 1v1 decay engine; multi-realm transfer branches historical) |
| 0033 | Unassailability Affordability Bound | 2026-07-11 | **Superseded by 0042** | → Amends match-arc ruling ⑪ (futures affordability-bounded) · ← **Superseded by 0042** (refines the retired hegemony gate; no unassailability check in a duel) |
| 0034 | Match End — Sudden-Death Crisis Ending (Direction) | 2026-07-11 | **Superseded by 0042** | → Amends 0030 · → Amends 0032 with match-arc AB-② (record world) · ← Amended by 0035 · ← **Superseded by 0042** (crisis stack retired; 1v1 anti-fizzle is structural) |
| 0035 | Match End — Internal-Uprising Crisis Arc (Design Skeleton) | 2026-07-11 | **Superseded by 0042** | → Amends 0034 · rulings CE-①…⑫ · SPEC amendment user-sealed 2026-07-11 · ← Extended by 0036 · ← **Superseded by 0042** (crisis + Westphalian draw retired) |
| 0036 | Crisis Rebellion Body and the Death of Peacetime Institutions | 2026-07-12 | **Superseded by 0042** | → Extends 0035 (skeleton → body; gate 5 resolved) · rulings CE-⑬…⑳ · truce/white-peace canonized (SPEC_GAPS ⑤/⑦ resolved) · ← **Superseded by 0042** (rebellion body retired with crisis stack; truce/white-peace no longer a terminus) |
| 0037 | War Model Build — Sealed Combat Resolution Replaces the L2 Stage-Machine | 2026-07-13 | Accepted | → Advances 0031 · → Retires L2 harness of 0032 · Confirms 0026 · Feeds 0028 · R14 re-diagnosis · ← Amended by 0042 (win condition = capital fall not hegemony gate; combat targets survive) |
| 0038 | War-Ending Composite — Capacity or Will | 2026-07-14 | Accepted | → Amends SPEC match-structure (field-army destruction becomes dominant, not sole path) · Confirms match-arc CE-⑲/B3 · Advances capital CP-① · ← Amended by 0042 (capital fall promoted backstop → sole win; composite collapses) |
| 0039 | React + Vite UI Shell and Framework-Free JavaScript Game Runtime | 2026-07-16 | Accepted (amended by 0040, 0049) | → Amends 0016, 0028 (Stage 1 fired; deferred UI choice resolved) · ← Amended by 0040 (canonical source becomes TS/TSX) · ← **Amended by 0049 (2026-08-03)**: Decision 3's "exposes resulting state and events" narrows to viewer projections and events — a caller never receives authoritative state; the API-shape deferral in the same clause is untouched |
| 0040 | TypeScript-First Canonical L3 Source With Incremental Legacy Porting | 2026-07-16 | Accepted (item 6 corrected 2026-08-03) | → Amends 0016, 0028, 0039 (source language separated from execution runtime) · ← **Corrected by gate 12 R8 (2026-08-03)**: item 6's "parity commands are decided by the L3 Playable Seam Wayfinder" was a forward reference into a Working-layer tracker, discharged by gate 05 on 2026-07-18; it now names gate 05 as verdict source and the root `package.json` as the live surface. No decision changed |
| 0041 | Environment Isolation — Marketing Landing vs Game Runtime, and the Reference Archive | 2026-07-17 | Accepted (amended by 0051) | → Amends 0016, 0028 (Stage 2 native shell = declared destination; Firebase = landing only; `js/`/`tests/`/L2 = reference archive, not build source; L3 source occupies its own space) · ← **Amended by 0051 (2026-08-03)**: the landing may carry a playable demo of the L3 build, bounded to copying the emitted bundle as an opaque artifact; "landing surface **only**" corrected; distribution target and the protected direction of isolation unchanged |
| 0042 | Duel Victory — Capital Fall as the Sole Win Condition | 2026-07-24 | Accepted | → Supersedes 0030, 0033, 0034, 0035, 0036 (multi-realm victory + crisis stack) · → Amends 0037, 0038 (win condition = capital fall) · → Stale-stamps 0031, 0032 (mechanics survive; multi-realm framing historical) · Confirms 0025 (uncertainty duel becomes literal), 0026 · Mandatory-ADR trigger (win condition + cross-feature + SPEC) |
| 0043 | The Operational Layer Moves — Position, Reachability, and the Price of a March | 2026-07-26 | Accepted | Wayfinder gate C, rulings R12–R15 · → Amends `DOMAIN_MAP` Tier-0 `Position as product` (the "no standalone move action" clause retired; no-micromanagement content survives) · Adopts slice-2 §3/§4 with the speed dial re-cut · Confirms 0025 (surprise needs arrive-and-fight), 0015 (river prices the engagement, not the march), 0032, TC-⑪ · Mandatory-ADR trigger (cross-feature model: combat + fog + economy) |
| 0044 | Conquest Integrates — Acquired Land Transfers Fully on the Ripening Lag | 2026-07-26 | Accepted | Wayfinder gate C, rulings R16–R17 · → Amends seals match-arc OG-③ (limbo = interval, not end state) and `MAGNITUDE` M14 ⑮ (conclusion retained, grounds re-based off the retired hegemony check) · → Dissolves duel-pivot D5.3's land-loss corollary (a deduction from permanent limbo) · Confirms 0022, 0029 (the ripening lag survives the pivot and gains conquest as its channel) · Bounded by 0042 and the `AGENTS.md` instant-transfer guardrail · Mandatory-ADR trigger (cross-feature model) |
| 0045 | Sited Recruitment, Readiness, and Province-Origin Accounting | 2026-07-26 | Accepted (amended by 0047) | R19 user-approved design · → Amends 0043 (opening placement + sector-edge expansion completed to deterministic hex endpoints), 0044 item 4 (land transfer moves remaining civilians; a serving force's province-origin composition stays with the force and permanent losses reduce that origin's register share), 0014 (garrison replenishment is paid recruitment or physical transfer), `DOMAIN_MAP` `Land-derived state` (sector-sited muster) |
| 0046 | The Sector Is the Atom of Combat — Siting, Approach, and the Allocation Key | 2026-07-31 | Accepted | Geography-battle grill on ticket 06c's registered gaps · → Amends 0043 (an engagement is sited wherever a hostile force stands, not only at authored region borders; the commit key follows the engagement's sector) and the seal terrain-cradle TC-⑬'s *terrain* column via TC-⑮ (its crossing column and reachable-weakest-link survive) · Confirms 0032 (the front sector reaching combat siting), 0015 (the river door now contributes only the crossing), 0042 (this is what makes capital fall reachable) · Promotes the design principle **hex is physical, sector is decisional** · Mandatory-ADR trigger (cross-feature model + win-condition reachability) |
| 0047 | The Sector Is the Unit of Population Accounting | 2026-07-31 | Accepted (amended by capital CP-⑥) | User ruling on the register/origin grain seam · ← **Amended by capital CP-⑥ (2026-08-01)**: item 5's local-garrison-origin rule takes one exception, the capital guard, whose origins are apportioned realm-wide like the opening field army — 0 of 840 legal capitals can back their own guard at sector grain · → Amends 0045 items 2/3/4/5 (province-origin accounting becomes sector-origin accounting) and its birthplace match-arc MT-⑥ · Confirms 0044 (a captured sector carries its own register, exactly, with no apportionment) · Completes match-arc MT-②'s same-day register amendment, which had left origin behind at province grain — `register − serving` then went negative on a normal partial capture · Keeps R17 superseded · Mandatory-ADR trigger (cross-feature model: recruitment, casualties, rout, transfer, projection) |
| 0048 | The Estimate Band Is a Witness Record, Not a Blur of the Truth | 2026-08-03 | Accepted (amended by 0050) | Fog grill closing `DECISIONS-OWED.md` Part 2 #1/#4/#5/#6 · → Amends 0020 § Context (its scouting loop stands; the sentence carrying it states the causation backwards and names a retired constant) and 0025 § Decision 3 (the no-oracle guardrail stands; the constant named as that guardrail is retired) · Birthplace `docs/features/fog-of-war-discovery/RULINGS.md` ③; dials `MAGNITUDE.md` FG-M① · **Row added 2026-08-03 in the gate 12 batch** — the fog batch that minted this ADR omitted it, alongside the gate 03 invariant 8 edit the ADR announced; nothing checks disk→README |
| 0049 | Runtime Authority and the Projection Boundary | 2026-08-03 | Accepted | Wayfinder gate 02 (user-sealed 2026-07-16) promoted by user ruling at gate 12 · → Amends 0039 § Decision 3 ("exposes resulting state" narrows to viewer projections; the API-shape deferral is untouched) · Presupposed by 0048 — the estimate band is produced at this boundary · **Not** a mandatory-trigger promotion: the trigger does not fire (it answers inside 0039 Decision 3's own deferral), and what carries it is the Record layer's architecture-grade / cross-feature standard against 28 authority citations from the canonical source into a Working-layer tracker |
| 0050 | A Testimony's Subject Is Set by Mobility — Force for What Moves, Sector for What Does Not | 2026-08-03 | Accepted | Fog grill answering the blocker 0048 and fog RULINGS ③ both left standing · → **Amends 0048** § Consequences twice (per-viewer state is keyed by *subject*, not uniformly by sector; the composition check's implementation-time-verification label was premature, consuming an unnamed input) · Completes fog `RULINGS.md` ③ (all nine decisions stand; decision 3 gains a scope) · Confirms 0041 §2 (the archive had built position force-attached — evidence, not authority) and 0047 (sector-origin accounting is what makes the immobile half true) · Checked and NOT amended: 0019, 0043, 0046 · Birthplace `docs/features/fog-of-war-discovery/RULINGS.md` ④; derived value `MAGNITUDE.md` FG-M① · Mandatory-ADR trigger (cross-feature model: projection state key, preview, bot, UI shell) |
| 0051 | The Landing May Carry a Playable Demo, as an Opaque Artifact | 2026-08-03 | Accepted | User decision for a school submission · → Amends 0041 § Decision 1 (corrects "landing surface **only**"; narrows "the game build is not an input to them" to a bounded copy-the-artifact exception) · Supersedes the governance half of the 2026-08-02 take-it-down ruling **by its stated reason** — that ruling objected to demonstrating the design 0042 retired, which an L3 duel embed does not do; its operative half is executed in the same batch (`game.html` and `assets/game/` leave the bundle) · Pays the `docs/SYNC-DEBT.md` gate-11 iframe row · Distribution target (native shell, 0016 Stage 2) untouched |
