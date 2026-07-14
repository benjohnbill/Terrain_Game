# War Model Build — Glossary (Tier 1)

Birthplace and single definition point of terms born in this feature
(documentation-law Vocabulary Law). Rows carry definition + status only;
ruling history lives in `RULINGS.md`; dial values live at the owning model
doc (here: the slice-2 design spec,
`docs/superpowers/specs/2026-07-14-slice2-operational-layer-design.md`,
cited below by §).

| Term | Definition | Status |
|---|---|---|
| Fatigue (피로도) | A persistent army attribute: the condition of the men, distinct from substance count. One player-facing gauge fed by two ledgers; enters the decisive-battle power product through a single continuous convex conversion curve. Spec §2. | **AGREED** (2026-07-14, WM-②) |
| Fatigue ledger (원장) | One of the two internal accounts behind the fatigue gauge: the march/battle ledger (accrues from movement and combat intensity; sole output = the floored effectiveness multiplier; can never kill) and the supply ledger (accrues from supply interruption; sole output = starvation substance loss, death conversion lives here exclusively; never touches effectiveness). Spec §2. | **AGREED** (2026-07-14, WM-②) |
| Forced march (강행군) | A toggle on a march order: extra movement this turn paid for from the fatigue gauge itself — no third resource, no separate combat penalty (arrival fatigue prices the R sacrifice). Spec §3. | **AGREED** (2026-07-14, WM-②) |
| Reach cone (도달 원뿔) | Positional knowledge of an enemy detachment: last observed fix plus a deterministic region growing by speed per unobserved turn (Aging-constitution P3 applied to position). The legal input of the pinning read. Spec §6/§7. | **AGREED** (2026-07-14, WM-②) |
| Border alarm (국경 경보 · 봉수형) | The free, instant, low-bandwidth detection of any army entering one's border zone (threat-ladder shape). No undetected invasion exists; deep strikes hide scale and state, never existence. Spec §6. | **AGREED** (2026-07-14, WM-②) |
| Commit budget (커밋 예산) | Commit as a per-turn regenerating, non-bankable realm budget — command capacity + court attention — from which every commit-consuming use (development, attack, defense, reconnaissance) draws; the engagement lever is the share allotted to one engagement. Unlocks FG-⑧'s commit-scarcity axis. Spec §4. | **AGREED** (2026-07-14, WM-②) |
| Window (창) | The opportunism read's per-front output: the ratio of my deliverable effective force at a front to what actually defends it now (bands, multipliers, reach-cone intersections, commit slack). Crossing the appetite threshold signals war; argmax picks the wartime target. Spec §7. | **AGREED** (2026-07-14, WM-②) |
| Dark market (깜깜이 시장) [조어] | The information rung that no confidence level reaches: the opponent's standing posture and commit allocation — revealed only ex-post through battle reports, back-inferable as tendency. The deliberate home of the psychological duel (user's own phrase, 2026-07-14). Spec §6. | **AGREED** (2026-07-14, WM-②) |
| Present / predictive reconnaissance (현재적/미래적 정찰) | The two-recon taxonomy: present recon narrows current bands (substance, fatigue, position); predictive recon reads the opponent's past commit record into a disposition estimate for predicting behavior. Direction sealed; plan cards owed to the catalog altitude-reclassification pass. Spec §6. | PROPOSED (2026-07-14, WM-② — direction only) |
