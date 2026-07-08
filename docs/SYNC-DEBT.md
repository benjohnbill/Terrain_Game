# Sync-Debt Ledger

Tracked ledger required by `.claude/rules/documentation-law.md`
(conflict rule + session-close ritual duty 6). One line per unpaid
documentation debt; strike it (move to Paid) when paid. An unrecorded
debt is a law violation; an unpaid-but-recorded one is normal
operation.

Seeded 2026-07-05 from the Codex governance audit (verdict: ADOPT WITH
FIXES; session `019f3183…`, log in `.context/codex-session-id`).

## Open

- [ ] **Match-tilting pass — residual sync** (birthplace sync PAID
  2026-07-07, see Paid below; these items remain): (a) **ADR 0014
  header amendment stamp** — P1 removes garrison free self-heal; the
  MAGNITUDE M12 + match-arc RULINGS MT-① amendments are recorded, but
  stamping the accepted ADR 0014 header is a user-gated architecture
  action (agent model Tier 3, propose-only) — flag for the user, do
  not silently edit. (b) **Surge Draft Model curve numbers** — knees,
  band multipliers, surge exchange rate (+1%p/pt 가안), zone names —
  deferred to the magnitude session (structure sealed, numbers 가안).
  (c) Riders: **sheet-7 tempo revalidation** under f₀ 0.5 (was 0.7),
  **M14 flat blood-EV re-check** (band escalation bends it),
  **L2 re-verify registerPerPop** after tilting devices land.

- [ ] **Recovery-dial grill — residual sync** (doc-sync batch PAID
  2026-07-08, see Paid below; these remain): (a) **ADR 0014 header
  amendment stamp** — P1 dual billing + now MT-⑤ commit-gating both
  remove garrison free/auto-regen; MAGNITUDE M12 + RULINGS MT-①/⑤ carry
  the deltas, but stamping the accepted ADR 0014 header is a Tier-3
  user-gated action (propose-only) — flag, do not silently edit.
  (b) **QUICKREF full regeneration** (C-loop table + MT-⑤ + ADR 0027 +
  블라인드 supersession) — deferred to the force-geography pass's
  doc-sync (batched to avoid double-regen).

- [ ] **A-3 magnitude pass must ingest the L2 freeze evidence**
  (registered 2026-07-07, sheet-15 session): cap-growth-alone does not
  unfreeze the parity map (22→24% decided; on the asymmetric fixture
  it had looked sufficient) — the "national cap growth = ending
  mechanism" numbers (ruling ⑮, deferred to A-3) must be cut against
  the frozen-world autopsy in `mockup/combat-calc/NOTES.md`
  (2026-07-07 entry), alongside the blinds design outcome.

- [ ] **Force-geography pass — the next spine** (registered 2026-07-08,
  match-tilting close; source RULINGS MT-⑤ + `mockup/combat-calc/NOTES.md`
  §L2 fidelity audit). L2 diagnosed the frozen world as NON-economic; the
  next design pass is force-geography. Two things owed there, not now:
  (a) **harness**: replace uniform `startFort: 'walls'` (an artifact — map
  carries `fortTier: none`, hex terrain plains/hills/mtn/pass unused) with
  terrain-bound defense strength, both start placement AND in-match fort-
  build rules, so L2 measures the real terrain (user direction 2026-07-08);
  (b) **design**: the ~80% structural residual = the hegemony-bar / offense-
  defense-balance question — is leadership reachable among balanced realms
  on a parity map? May need a large ADR. Grill-worthy, fresh session.
  **UPDATE 2026-07-08 (terrain-fidelity session)** — the pass split. The
  fort sweep found fort strength is NOT the freeze lever (all-none 20% vs
  all-walls 10.2%; ceiling ~20%, 80% structural holds); force-geography-
  fort-by-class is therefore a *balance* lever (dormant opt-in
  `gaan.startFortByClass`), not the fidelity fix. The real fidelity fix
  (approved + **wired** this session): **combat terrain = border INTENT
  class** — open→plains, forest→forest, hills→hills, pass→pass(2.0),
  river→water riverOpposed 0.70, strait→water straitOpposed 0.55 + door
  choke (`combatFromBorderClass` in tournament.js; `frontClass`/`frontDoor`
  weakest-link in map-board.js; +5 tests, 116 green). Values sealed
  (terrain M5/D6, water ADR-0015 + ruling ⑦); binding is the approved
  decision. Also fixed: strait grammar now fires on the class (was hermit-
  gated → dead on cradle); `engine.js` straitOpposed comment synced
  (candidate→confirmed). Freeze re-measured on the un-flattened map ~12.6%
  decided, leadShortfall ~4600 — verdict holds. **Doc-sync PAID 2026-07-08
  (terrain-fidelity session, this integration batch)**: (i) border-class→
  combat seal recorded — RULINGS **TC-⑬** + terrain-cradle GLOSSARY row
  (values cite M5/ADR-0015, not restated); (ii) QUICKREF — item ② already
  regenerated it this day, so this batch adds only the TC-⑬ line + two
  C-loop rows + header addendum (no double-regen); (iii) NOTES gained the
  residual-freeze autopsy entry (`freeze-autopsy.js` committed alongside).
  **Design reframe RESOLVED 2026-07-08**: the tactical plan-AI suspect was
  built + battered (item ②, commits 7508b3a/162c158) and absorbed only
  **+0.8pp** (12.6→13.4%) — the freeze is NOT a bot artifact. The residual
  autopsy (this session) pins item (b) as the **hegemony ADR**: the
  leadership gate (own projection ≥ 1.7× the max live rival's shield) acts
  like last-man-standing — consolidation plateaus ~1.28, elim ~0, so the
  board freezes at parity. Terrain and tactics are both excluded by
  measurement. **Next = hegemony ADR grill** (SPEC-level victory condition
  — user-gated); knobs: shieldRatio, leadership shape, anti-snowball
  exposure-inheritance, consolidation strength. This force-geography Open
  item can close once that grill opens its own thread.

- [ ] **Term lifecycle beyond promotion** (Codex P1): define
  proposed → agreed → promoted → renamed → deprecated states in the
  Vocabulary Law; renames are the dangerous case for agents. Add an
  alias field (Korean casual phrases, code identifiers) to glossary
  schema (Codex P2).
- [ ] **Model-doc naming unification + promotion ladders to root**
  (registered 2026-07-05, A-4 B1 discussion): the bespoke per-feature
  model-doc names (MAGNITUDE / FORMULA / MATCHUP / CATALOG /
  STRATEGY-SPACE) are one function ("model/dials doc") under five
  names — a latent proliferation cost. Decide a disciplined convention,
  then give the model layer an explicit birthplace→root promotion
  ladder (model docs → DESIGN) symmetric with GLOSSARY→DOMAIN_MAP and
  RULINGS→ADR, so all three Production tiers connect to root the same
  way. NOT A-4 B1 scope; a deliberate separate pass (user-flagged).

## Deferred (user-decided 2026-07-06, A-4 B6 — revisit on trigger)

- [ ] **`npm run docs:check` lint** (Codex P2, optional tooling):
  grep-level checks — "amended" references without ADR stamp, quickref
  older than newest seal date, duplicate term headers. **User deferred:
  no generator yet; adopt when a misfile actually slips (YAGNI).**
- [ ] **Working-layer sublabels** (Codex P2): distinguish staging
  verdicts / generated digests / planning scratch / risk register
  inside the Working layer. **User deferred: no misfiling observed —
  revisit if it occurs (emergence-limit).**

## Paid

- [x] 2026-07-08 — **Ending-taxonomy pass → Production sync (ET-①)** —
  the hegemony grill's measurement-taxonomy design (grill Q1–Q4,
  user-sealed) written to its authoritative homes: match-arc RULINGS
  **ET-①** (the decision record — ruler B bar-independent, 8-metric
  panel, vassals fold full, provisional thresholds, first finding);
  match-arc GLOSSARY **종료 분류** row (definition + pointer to ET-①);
  INDEX refreshed (ending-taxonomy pass block + RULINGS range); QUICKREF
  header addendum + C-loop row (finding as UNSEALED evidence). Instrument
  itself committed c082247 (match.js/tournament.js/plan-battery.js +
  tests, 148 green). No DOMAIN_MAP change — feature-local, birthplace
  stays authoritative (promotes only if a second feature needs it). The
  crown-inversion finding is recorded as **evidence bearing on TC-②**,
  never a rewrite (TC-② is a user seal). Residual: threshold calibration
  + the wall/crown grill are live work, not doc debt.
- [x] 2026-07-07 — **Match-tilting seals → Production sync (birthplace
  batch)** — the session's NOTES-staged seals written to their
  authoritative homes so no session reads stale canon: match-arc
  RULINGS **MT-①…④** (aging constitution / register re-founding /
  Surge Draft Model / start-state coordinates — the decision record);
  match-arc GLOSSARY rows (모병 re-cut, 징집 명부 re-founded, +노화
  헌법 / 동원 강도 / 서지 모병 as new Tier-1 terms); combat-formula
  MAGNITUDE **M13 amended + M13a added** (registerPerPop 1,800,
  capPerPop derived ⅓, Surge Draft Model, f₀0.5/g₀1.0/ρ0.75) +
  **M12 amendment stamp** (garrison regen bills the register);
  DOMAIN_MAP (모병/징집 명부 rows re-cut as summary+pointer + 노화
  헌법 Design-Principle entry); QUICKREF rows re-pointed to birthplace.
  Residual (ADR 0014 stamp, curve numbers, riders) split to the Open
  row above.
- [x] 2026-07-08 — **Recovery-dial + blinds phase → Production sync
  (MT-⑤)** — the recovery-dial/blinds phase reached L2 wire-first and
  reversed the premise (freeze non-economic). Paid this batch: ADR 0027
  written + 0020 stamped + README index (main/surplus = magnitude
  labels, commit-gated force-shaping); match-arc RULINGS **MT-⑤** (full
  L2 record — recovery-gate +3pp, Q1 reversal, Option B inert, fidelity
  audit, freeze decomposed to force-geography + hegemony-bar);
  MAGNITUDE **M12-1 commit-gate amendment stamp**; GLOSSARY 블라인드 row
  SUPERSEDED-as-economic-device; DOMAIN_MAP `Command pool` floating-label
  framing; INDEX refreshed (economy phase closed). Residual (ADR 0014
  stamp, QUICKREF regen) → Open row above; force-geography = next spine
  (Open).
- [x] 2026-07-07 — **SPEC 중원-crown amendment (TC-②) APPLIED,
  user-approved** — SPEC §Match structure re-cut: survivability +
  starting-population parity balanced, geometry/economy asymmetry;
  crown economic only (traffic centrality + long-war stamina, never a
  population edge); center-protagonist stated as measured hypothesis
  with the stable-digestion premium framing. Proposed and approved in
  the 2026-07-07 doc-sync session (propose-never-drift honored).
- [x] 2026-07-07 — **Terrain-cradle → Projection sync (C-loop close
  doc-sync batch)** — DOMAIN_MAP gained a `Terrain Cradle (Authored
  Map)` section (summary + pointer, sync-stamped) promoting void
  terrain / parity start / battle-summoning placement; the Match
  structure parity row re-cut from "mass asymmetry, richer center" to
  parity-v5 wording (TC-①/②) with a supersession note; DESIGN
  §Map Representation Strategy gained the authored-map pipeline
  subsection (map-gen.js determinism, C-loop rhythm, carve principle);
  QUICKREF regenerated (Realm row + 3 promoted-term rows + header
  date). Definitions stay authoritative in
  `docs/features/terrain-cradle/` (single-definition rule). SPEC
  remainder split into its own Open row above.
- [x] 2026-07-06 — **L-level seal-stamp convention ADOPTED (Codex P2,
  A-4 B6)** — the optional validation-level stamp (L0 hand / L1 grid /
  L2 tournament / L3 playtest) codified into
  `.claude/rules/documentation-law.md` § seal mechanics: seals MAY carry
  an L-stamp; applied going forward, retrofit optional, not a fourth
  mandatory field. The other two Codex P2s (`docs:check` lint,
  Working-layer sublabels) were user-deferred — see Deferred above.
- [x] 2026-07-06 — **Economy-legibility surface relocated (A-4 B6)** —
  moved from a doc-sync debt to `docs/DISPLAY-DEBT.md` (the display-debt
  register), where the whole UI-read family now parks. Design deferred
  to B's UI work.

- [x] 2026-07-06 — **ADR header normalization sweep (Codex P1, A-4 B5)**
  — amendment-carrying ADR headers normalized to the law's structured
  fields: 0014 (`Amended by: ADR 0022 (2026-07-01)` + delta), 0015
  (self-amendment stamp for the 2026-07-03 magnitude pass), 0018
  (`Amended by: ADR 0020` + delta), 0020 (`Amends: ADR 0018` + delta).
  Status index table added to `docs/adr/README.md` (26 rows) with a
  pointer to the documentation-law supersession protocol; plain-Accepted
  ADRs carry no relationship field (index is their normalization
  surface — anti-noise reading). *ADR 0019 v5 front-sector amendment is
  a SEPARATE decision (a4-plan B5), user-gated — not part of this line.*
- [x] 2026-07-06 — **Sheet-12 spec gaps → canon (A-4 B4)** — the 7 open
  `mockup/combat-calc/tournament.js` §SPEC_GAPS given a canon home:
  disposition record in `docs/features/match-arc/RULINGS.md` §SPEC_GAPS
  disposition routes each to owning feature + B-design phase + harness
  candidate + recommended lean. All seven defer to B (AI-behavior /
  force-allocation / map-topology — playtest- and B-map-shaped; no paper
  rules authored, per the handoff over-authoring warning). GLOSSARY
  queue-8 and combat-formula INDEX Honest Gaps point to it. Indemnity
  spend (the 8th) was already paid by M14 treasury. Gap ③ (attacking a
  vassal) carries an identity choice surfaced to the user; the rest are
  structural/disposition closes.
- [x] 2026-07-05 — **DOMAIN_MAP slimming (Codex P1)** — Match Arc
  section entries (패권 결정점, 투사 가능 질량, 수락 산술, 복속) cut from
  duplicated mini-spec (sealed numbers, riders, dates) to qualitative
  definition + pointer to the feature GLOSSARY/RULINGS, matching the
  Combat Resolution section's existing discipline. Added the 5 missing
  promoted terms (긴급 투입/예비대, 동원 가시성, 항복 수확, 양동 후속타,
  기축통화 원칙). Sync metadata added at SECTION granularity (not
  per-entry — always-load/maintenance economy; flagged for review).
  A-4 batch B2. *Note: exposed a law-wording tension (single-definition
  rule "Tier 0 after promotion" vs DOMAIN_MAP-as-Projection-summary) —
  see A-4 plan law-gap log.*
- [x] 2026-07-05 — **glossary row splitting (Codex P1)** — match-arc
  GLOSSARY rows cut to definition + current value + seal stamp;
  ruling history (⑧–⑰) relocated to `docs/features/match-arc/
  RULINGS.md`. combat-formula GLOSSARY gained a Status column
  (AGREED / 가안 / candidate). A-4 batch B1.
- [x] 2026-07-05 — **seal registry DECIDED (user): no `docs/SEALS.md`**
  — this ledger + dated in-doc seal stamps remain the mechanism.
- [x] 2026-07-05 — law dial-ownership claim corrected (match-arc values
  acknowledged in GLOSSARY seal rows, not MAGNITUDE).
- [x] 2026-07-05 — mechanical seal definition added to the law
  (status word + date + verdict source).
- [x] 2026-07-05 — QUICKREF trust level made honest (agent-curated
  digest, no generator; dated header).
- [x] 2026-07-05 — this ledger created (Codex fix 2).
