---
tags: [terrain-game, design, risks, dashboard]
status: living
updated: 2026-07-01
---

# Design Risk Dashboard

Living register of design risks and open warnings surfaced during Phase 1
fun-core design (research subagents plus design review). Update Status and the
Next-to-close column as items progress; move closed items to Resolved.

Status legend: 🔴 open · 🟡 partly addressed · ✅ resolved

## Open / In-progress

| ID | Warning | Status | Home / thread | Next to close |
|----|---------|--------|---------------|---------------|
| R1 | Fun is entirely hypothesis — never playtested | 🟡 | payoff-loop spec; UI mockup | A mockup/playtest that judges the payoff loop |
| R2 | Fun defined negatively (anti-snowball); positive peak / reward thin | 🟡 | SPEC pillar 1; payoff-loop spec | Design the positive peak moment and reward |
| R3 | Macro/session progression absent (victory, arc, pacing, comeback) | 🔴 | none yet | Open a macro-progression design thread |
| R4 | AI quality unvalidated; premise assumes a competent AI (SPEC admits AI can be naive) | 🔴 | fog thread (AI info model) | AI competence pass; decide AI information model |
| R5 | Complexity vs legibility unvalidated ("low micromanagement" vs stacked systems) | 🟡 | ADR 0017/0018; payoff-loop spec | Validate legibility with a mockup/playtest |
| R6 | Uncertainty may read as frustration, not fun (losing to info you had no fair way to get) | 🟡 | fog-of-war-discovery | Enforce the skill-piercable guardrail in the fog session |
| R7 | Immersion (historical flavor) vs readability unresolved on conflict | 🟡 | SPEC World Model; ADR 0001/0005 | Apply "balance > fidelity" during province authoring |
| R8 | Time pressure is double-edged (skill-testing vs merely stressful) | 🟡 | SPEC "To validate" | Prototype an opt-in timed mode and judge |
| R9 | Live-state drift; concurrent sessions editing the same files | 🟡 | process | Keep isolating on branch/worktree; re-confirm HEAD |

### Next actions (open)

- [ ] R1 — run the payoff-loop UI mockup and judge the loop by hand
- [ ] R3 — open a macro-progression (victory / arc / pacing / comeback) design thread
- [ ] R4 — AI competence pass; decide the AI information model (especially under fog)
- [ ] R6 — in the fog session, lock the skill-piercable guardrail (every loss traces to a decision)

## Resolved

| ID | Warning | Resolved by |
|----|---------|-------------|
| R10 | No first-party statement of the intended fun | SPEC "Positioning and Fun Pillars" |
| R11 | Capacity carryover/overclock built but display-only (unwired) | ADR 0018 (formal Phase 1 deferral) |

## Sources

- Research subagents this session: cross-session memory and repository documents
  (their TENSIONS / GAPS sections).
- Design-review cautions raised during fun-core brainstorming.
