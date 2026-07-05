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
- [ ] **Glossary row splitting** (Codex P1): match-arc GLOSSARY rows
  have grown into decision records (definition + formula history +
  rejected alternatives + validation). Split: row = definition +
  seal stamp; ruling history moves to a per-feature seal/decision
  section (or ADR). Do combat-formula GLOSSARY the same pass; add
  AGREED/PROPOSED status discipline there (it lacks match-arc's).
- [ ] **DOMAIN_MAP slimming** (Codex P1): promoted entries carry
  mini-spec prose duplicating feature seals (projectable mass,
  settlement, acceptance arithmetic, vassalage). Cut to definition +
  pointer per the single-definition rule; add source-seal + last-sync
  metadata line per entry (Codex fix 6).
- [ ] **Term lifecycle beyond promotion** (Codex P1): define
  proposed → agreed → promoted → renamed → deprecated states in the
  Vocabulary Law; renames are the dangerous case for agents. Add an
  alias field (Korean casual phrases, code identifiers) to glossary
  schema (Codex P2).
- [ ] **Seal registry decision** (Codex P1): decide whether
  `docs/SEALS.md` (ID/date/source/affected/synced?) earns its keep or
  whether this ledger + dated seal stamps suffice. NOW DUE — sheet 12
  ran and its doc-sync batch closed 2026-07-05 evening; user decision.
- [ ] **Sheet-12 spec gaps → canon** (registered 2026-07-05 evening):
  the 8 undocumented rules in `mockup/combat-calc/tournament.js`
  §SPEC_GAPS (AI war appetite, two-front allocation, attacking-a-vassal
  semantics, settlement initiative, stalled-war exit, indemnity spend,
  truce/redeclaration, front redraw after cession) are recorded only in
  the prototype + GLOSSARY queue-8 note. Each needs a canon home
  (GLOSSARY row, ADR, or B-map requirement) — work during A-3/A-4 or
  when the owning feature is touched.
- [ ] **Validation level as seal metadata** (Codex P2): stamp seals
  with their test-trust level (L0 hand reasoning / L1 grid / L2
  tournament / L3 playtest) so a reader sees how verified a value is.
- [ ] **`npm run docs:check` lint** (Codex P2, optional tooling):
  grep-level checks — "amended" references without ADR stamp, quickref
  older than newest seal date, duplicate term headers.
- [ ] **Working-layer sublabels** (Codex P2): distinguish staging
  verdicts / generated digests / planning scratch / risk register
  inside the Working layer if misfiling actually occurs.

## Paid

- [x] 2026-07-05 — law dial-ownership claim corrected (match-arc values
  acknowledged in GLOSSARY seal rows, not MAGNITUDE).
- [x] 2026-07-05 — mechanical seal definition added to the law
  (status word + date + verdict source).
- [x] 2026-07-05 — QUICKREF trust level made honest (agent-curated
  digest, no generator; dated header).
- [x] 2026-07-05 — this ledger created (Codex fix 2).
