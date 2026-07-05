# Documentation & Terminology Law — Terrain Game

Project-specific, auto-loaded. The single source for document
hierarchy, authority, production flow, and domain-vocabulary rules.
`AGENTS.md`, `DESIGN.md`, and `DOMAIN_MAP.md` point here — do not
restate this law elsewhere. Auto-load carries LAW only; canon CONTENT
(glossaries, dials) is Read on demand where the law points.

## Layer taxonomy

| Layer | Documents | Authority & write rule |
|---|---|---|
| Direction (방향) | `SPEC.md` | What the product is. Changes only by explicit user decision; feature passes work inside SPEC bounds — a pass that needs a SPEC change files a proposal, never drifts it. |
| Projection (투영) | `DESIGN.md`, `DOMAIN_MAP.md` | Stable summaries of sealed truth (architecture / language). Updated only in doc-sync batches; truth is never authored here first. |
| Record (기록) | `docs/adr/` (promoted) · feature `RULINGS.md` (birthplace) | Why decisions were made. ADR = architecture-grade / cross-feature; RULINGS = feature-local rulings that promote up when they outgrow the feature. Append-only + supersession protocol below. |
| Production (생산) | `docs/features/<slug>/` | The workshop where truth is minted (with user seal). File roles below. |
| Working (작업) | `mockup/*/NOTES.md`, `docs/superpowers/`, `docs/DESIGN-RISKS.md`, `docs/GLOSSARY-QUICKREF.md` (generated), tracked debt ledgers (`docs/SYNC-DEBT.md` doc-sync debts, `docs/DISPLAY-DEBT.md` UI-design debts), `.context/` (untracked handoffs) | Time-stamped records and idea banks — consult for context and parked/deferred ideas; CURRENT truth lives in the seal chain, not here. NOTES verdicts are a staging area: they must sync to Production/Projection in the same session's doc-sync batch. Debt ledgers are registers only — a row points to the mechanic's birthplace, never redefines it. |
| Sanctuary (성역) | `docs/teach/` | The user's own space. Agents do not touch it. |

### Production file roles (`docs/features/<slug>/`)

- `INDEX.md` — the feature's front door: status, scope, pointers into
  the other files, open questions. Never defines terms or dials.
  Refreshed at every session close that touched the feature (ritual
  below).
- `GLOSSARY.md` — Tier-1 vocabulary (see Vocabulary Law below). A row
  carries only definition + current value + seal stamp; ruling history
  never lives in the definition row.
- `RULINGS.md` (optional, per feature) — the **decision record**:
  ruling history (evidence, rejected alternatives, riders) behind the
  feature's seals. GLOSSARY/model rows cite ruling numbers into here.
  This is the **birthplace tier of the Record layer**: a ruling
  promotes to an ADR when it becomes architecture-grade or spans
  features — the same ladder as GLOSSARY→DOMAIN_MAP (Vocabulary Law).
  Most battery/grill rulings never promote, which is why the local
  home exists.
- `MAGNITUDE.md` / `FORMULA.md` / `MATCHUP.md` / `CATALOG.md` /
  `STRATEGY-SPACE.md` — model documents. Each feature's dials live in
  ONE owning model doc (resolution dials: `combat-formula/MAGNITUDE.md`;
  match-arc values: its GLOSSARY seal rows until a magnitude home
  exists); every other file references by pointer so nothing goes
  stale when a dial is re-cut. Never restate a number outside its
  owning doc.
- `RESEARCH.md`, `research/*.md` — the evidence layer: surveys and
  audits. Inputs to seals; never normative on their own.

## Conflict rule

Divergence between Projection and Production is a **sync debt**: the
dated seal in the Production doc is truth meanwhile. SPEC is exempt —
direction is not outrun by seals.

**Seal, mechanically** (Codex-audited 2026-07-05): a seal is a
Production-doc row/section carrying at minimum **status word
(SEALED/AGREED/CONFIRMED) + date + verdict source** (ruling number,
battery sheet, or user quote). Bold prose without these three is not a
seal. Sync debts that cannot be paid in-session are recorded in
`docs/SYNC-DEBT.md` (tracked ledger) — an unrecorded debt is a
violation, an unpaid-but-recorded one is normal operation.

**Validation level (optional seal metadata, adopted 2026-07-06)**: a
seal MAY additionally carry a test-trust stamp showing how verified its
value is — **L0** hand reasoning · **L1** decision grid · **L2**
tournament / battery sheet · **L3** playtest (the test-trust ladder,
`docs/features/match-arc/TEST-LADDER.md`). Applied going forward;
retrofitting existing seals is optional, not required. A seal without an
L-stamp is still a valid seal — the stamp adds legibility, it is not a
fourth mandatory field. (Codex P2; the `docs:check` lint and
Working-layer sublabels from the same audit stay deferred — see
`docs/SYNC-DEBT.md`.)

## ADR supersession protocol

A new ADR that changes or contradicts an existing one MUST, in the
same commit: (1) name what it supersedes/amends in its own header;
(2) stamp the OLD ADR's header — `Status: Superseded by ADR-XXXX
(date)` or `Amended by ADR-XXXX (date)` — plus a one-line delta.
Dates alone are not protection: a stale ADR read in isolation must
announce its own staleness. Never silently edit an accepted ADR's
Decision section.

## Vocabulary Law

- **Definition tiers**: Tier 0 = `DOMAIN_MAP.md` (project canon,
  promoted terms only) · Tier 1 = `docs/features/<f>/GLOSSARY.md`
  (birthplace and single definition point of feature terms, status
  AGREED/PROPOSED) · Tier 2 = everything else — USE and REFERENCE
  only, never define.
- **Single-definition rule**: a term's authoritative definition lives
  at its **birthplace** — the tier where it is actively worked — and
  nowhere else copies it. A feature-born term is authoritative in its
  feature `GLOSSARY.md` (definition) + `RULINGS.md` (history);
  promotion adds a Tier-0 `DOMAIN_MAP.md` entry that is a qualitative
  **summary + pointer**, NOT a second definition or a value restatement
  (the feature doc stays authoritative). A project-native term (no
  feature birthplace) is authoritative directly in `DOMAIN_MAP.md`.
  Every non-birthplace surface (a promoted term's DOMAIN_MAP entry,
  `INDEX.md`, the QUICKREF, any Tier-2 file) holds a pointer/summary,
  never a normative copy — paraphrasing an authoritative definition as
  if normative is drift.
- **Naming**: canonical identifier = industry-standard English,
  matching code identifiers (`projectable mass` ↔ `projectableMass`);
  header format `English canonical (한국어 표시어)`. Prefer standard
  terms (power projection, hermit kingdom, decisive victory) over
  coinages; coin only for genuinely novel mechanics.
- **Coinage duty**: a new term appears only with a `[조어]`/`[coinage]`
  tag and is registered into Tier 1 (or discarded) within the same
  exchange. In conversation use the standard English term directly;
  abbreviations allowed after one parenthesized full form.
- **Status dictionary**: DOMAIN_MAP `✅/❓/⛔` ≡ GLOSSARY
  `AGREED/PROPOSED/rejected-recorded`.
- **Promotion**: a Tier-1 term is a promotion candidate once a second
  feature or a root doc needs it; promotion happens in doc-sync
  batches, never silently. Promotion *adds* a Tier-0 summary entry (per
  the single-definition rule above) — it does not move the definition
  out of the feature doc, which stays authoritative.

## Session-close ritual (standing duties)

When a session or work unit closes (final-check in this repo includes
these):

1. Sync mockup NOTES verdicts into Production docs (seal text).
2. Doc-sync batch into Projections (DOMAIN_MAP/DESIGN) if seals
   changed; SPEC only via user-approved proposal.
3. Refresh `INDEX.md` of every touched feature (status, pointers,
   open questions).
4. Regenerate `docs/GLOSSARY-QUICKREF.md` after any seal batch — an
   agent-curated digest (no generator script yet): convenience surface
   only, never cited as definition; header must carry "last
   regenerated" date.
5. Stamp superseded/amended ADRs per the protocol above.
6. Record any duty left unpaid (and any Projection/Production
   divergence noticed) in `docs/SYNC-DEBT.md`.
