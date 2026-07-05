# Sync-Debt Ledger

Tracked ledger required by `.claude/rules/documentation-law.md`
(conflict rule + session-close ritual duty 6). One line per unpaid
documentation debt; strike it (move to Paid) when paid. An unrecorded
debt is a law violation; an unpaid-but-recorded one is normal
operation.

Seeded 2026-07-05 from the Codex governance audit (verdict: ADOPT WITH
FIXES; session `019f3183…`, log in `.context/codex-session-id`).

## Open

- [ ] **ADR header normalization sweep** (Codex P1): all 27 ADRs get
  normalized header fields (`Status:` / `Supersedes:` / `Amended by:
  ADR-XXXX (date)` + one-line delta). Known offenders: ADR 0015 still
  `Accepted` while combat GLOSSARY says "(amended)"; ADR 0014 lacks
  date + delta. Include a status index table in `docs/adr/README.md`.
- [ ] **Term lifecycle beyond promotion** (Codex P1): define
  proposed → agreed → promoted → renamed → deprecated states in the
  Vocabulary Law; renames are the dangerous case for agents. Add an
  alias field (Korean casual phrases, code identifiers) to glossary
  schema (Codex P2).
- [ ] **Economy legibility surface** (registered 2026-07-05, A-3
  epistemic rider): the thin economy is numbers-only; a UI read (where
  my 생산 comes from / where it goes) is owed to the A-4 display-debt
  family / B's UI work.
- [ ] **Validation level as seal metadata** (Codex P2): stamp seals
  with their test-trust level (L0 hand reasoning / L1 grid / L2
  tournament / L3 playtest) so a reader sees how verified a value is.
- [ ] **`npm run docs:check` lint** (Codex P2, optional tooling):
  grep-level checks — "amended" references without ADR stamp, quickref
  older than newest seal date, duplicate term headers.
- [ ] **Model-doc naming unification + promotion ladders to root**
  (registered 2026-07-05, A-4 B1 discussion): the bespoke per-feature
  model-doc names (MAGNITUDE / FORMULA / MATCHUP / CATALOG /
  STRATEGY-SPACE) are one function ("model/dials doc") under five
  names — a latent proliferation cost. Decide a disciplined convention,
  then give the model layer an explicit birthplace→root promotion
  ladder (model docs → DESIGN) symmetric with GLOSSARY→DOMAIN_MAP and
  RULINGS→ADR, so all three Production tiers connect to root the same
  way. NOT A-4 B1 scope; a deliberate separate pass (user-flagged).
- [ ] **Working-layer sublabels** (Codex P2): distinguish staging
  verdicts / generated digests / planning scratch / risk register
  inside the Working layer if misfiling actually occurs.

## Paid

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
