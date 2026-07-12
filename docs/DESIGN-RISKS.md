---
tags: [terrain-game, design, risks, dashboard]
status: living
updated: 2026-07-13
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
| R12 | L3 immersion charter — the one-judgment bet pays only if unverified at L2: (a) situation-reading surface rewards depth (else analyst/clicker collapse into "press recommended"), (b) standoff turns carry real decisions (standing rules, surge economy, recon posture) rather than click-through, (c) no dominant preset plan emerges (matchup sparsity holds at play) | 🔴 | M9-promotion grill 2026-07-11; ADR 0019; ADR 0025/0026; matchup 21-cell | First playtest measures all three; also calibrates per-turn wall-clock (SPEC's untested 1.5–2 min variable, analyst-track ruling 2026-07-11) |
| R13 | Crisis-decade genre-shift / chore risk — turns 25–35 could read as fire-fighting admin instead of the most war-dense phase; and a high-karma leader must never reach a mathematically hopeless state (by ~turn 33) it could not have prevented | 🟡 | crisis-ending pass 2026-07-11; crisis co-analysis 2026-07-13; match-arc RULINGS CE-⑩/⑫; ADR 0035 | Shield-natured suppression sealed (CE-⑩); the 2026-07-13 co-analysis found the crisis is a termination *backstop*, not the war-dense spectacle it was hoped to be — the spectacle deficit is upstream (R14). Chore-prevention gate (war density 25–35 ≥ 15–25) still unmet at 가안 dials |
| R14 | **War-system produces no decisive climax — the SPEC madmovie does not occur.** Crisis-OFF main-arc measurement (2026-07-13, L2 cradle, seed 42): **ZERO annihilations/match**, ~77% of wars end by stall→white-peace fizzle, decided% 0.656 is hegemony-gate trip (force ratios) not conquest climax. The SPEC-promised "shield-break → decisive battle → cascade" deciding war essentially never fires — crisis or not. This is why the draw/timing problem could not be fixed from inside the crisis: the missing dopamine is in the war machine, not the ending. **Bot caveat:** L2 bots stall/settle where a skilled player might force annihilation, so this proves the *default* is fizzle, not that decisive war is unreachable by skill. | 🟡 | crisis co-analysis 2026-07-13; **ADR 0037 + `docs/features/war-model-build/`** (direction sealed 2026-07-13); SPEC "Match structure"; warEnds instrument | **Answered 2026-07-13 (four-survey synthesis → ADR 0037):** the fizzle is a placeholder / harness-abstraction / bot-policy artifact — per-front uniform defense (sealed = per-sector 4-layer), a multi-turn siege conveyor (contradicts ADR 0026 atomic resolution), a static declare gate + bot stall→white-peace exit — NOT a property of the sealed war (the decision gate works as sealed). It is a war-machine *implementation* gap, not a bot-policy tuning knob. **Closes when the build implements the sealed model** (`war-model-build/REQUIREMENTS.md`); L2 retired as a tuning surface. |

### Next actions (open)

- [ ] R1 — run the payoff-loop UI mockup and judge the loop by hand
- [ ] R3 — open a macro-progression (victory / arc / pacing / comeback) design thread
- [ ] R4 — AI competence pass; decide the AI information model (especially under fog)
- [ ] R6 — in the fog session, lock the skill-piercable guardrail (every loss traces to a decision)
- [ ] R14 — direction sealed 2026-07-13 (ADR 0037): the fizzle is a war-machine *implementation* artifact (per-front defense / non-atomic siege conveyor / static declare gate + bot stall-exit), not a sealed-war property; closes when the build implements the sealed model (`docs/features/war-model-build/`)

## Resolved

| ID | Warning | Resolved by |
|----|---------|-------------|
| R10 | No first-party statement of the intended fun | SPEC "Positioning and Fun Pillars" |
| R11 | Capacity carryover/overclock built but display-only (unwired) | ADR 0018 (formal Phase 1 deferral) |

## Sources

- Research subagents this session: cross-session memory and repository documents
  (their TENSIONS / GAPS sections).
- Design-review cautions raised during fun-core brainstorming.
