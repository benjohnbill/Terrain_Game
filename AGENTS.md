# Terrain Game Agent Guide

## Project Context

Terrain Game is a turn-based strategy game about terrain-first national
management and conquest. Its world is East Asia-inspired but fictional.

Two things exist under this name, and confusing them has already cost real work:

- **The reference prototype** — a static browser hex game about world conquest
  (`index.html` + `js/`). It is the project's origin and is now an **archive**:
  evidence to consult, not the thing being built. See § Environments.
- **The L3 build** — the game the project is actually building: the settled
  design, played by a human on the authored world. It is under construction, it
  does not ship as a static web page, and it does not inherit the prototype's
  architecture. See § Current Direction.

When a document says "the game" without saying which, check before assuming.
A present-tense fact about the prototype is not a statement about the target.

Conversation with the user should follow the global Korean honorific style.
Generated project artifacts should use neutral professional language.

## Documentation & Terminology Law

The full law — document layer taxonomy (Direction / Projection /
Record / Production / Working / Sanctuary), conflict rule, ADR
supersession protocol, vocabulary rules (English-canonical
identifiers, definition tiers, coinage duty), and the session-close
ritual — is authored in `.claude/rules/documentation-law.md`. That
file is the canonical, editable source and is auto-loaded for Claude
Code through `CLAUDE.md`. Codex has no equivalent external-file
auto-import, so the full law is mirrored verbatim into the generated
block below and reaches Codex through this AGENTS.md.

Do not edit the block by hand. Edit the canonical file, then run
`npm run sync:docs-law`; `node scripts/sync-docs-law.js --check`
reports whether the block has drifted from the source.

<!-- BEGIN documentation-law (generated) -->
<!-- source: .claude/rules/documentation-law.md — DO NOT EDIT here; edit the source and run `npm run sync:docs-law` -->

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
| Working (작업) | `mockup/*/NOTES.md`, `docs/superpowers/`, `docs/DESIGN-RISKS.md`, `docs/GLOSSARY-QUICKREF.md` (generated), tracked debt ledgers (`docs/SYNC-DEBT.md` doc-sync debts, `docs/DISPLAY-DEBT.md` UI-design debts), `docs/audits/` (audit baselines + dated reports), `.context/` (untracked handoffs), `docs/agents/` (agent tooling config) | Time-stamped records and idea banks — consult for context and parked/deferred ideas; CURRENT truth lives in the seal chain, not here. NOTES verdicts are a staging area: they must sync to Production/Projection in the same session's doc-sync batch. Debt ledgers are registers only — a row points to the mechanic's birthplace, never redefines it. `docs/audits/` baselines (term inventory, doc registry) are machine-readable indexes maintained per `docs/audits/HARVEST.md` (two-mode model); audit-lint findings are reports, never legislation. `docs/agents/` is agent-tooling config (tracker location, triage vocabulary): it points at this law and never restates it. |
| Law (법) | `AGENTS.md`, `CLAUDE.md`, `.claude/rules/documentation-law.md` | The rules agents execute. Changes only by explicit user decision. |
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
fourth mandatory field. (Codex P2. The `docs:check` lint from the same
audit is superseded — its checks ship in `scripts/audit-lint.js` under
other names; only the Working-layer sublabels stay deferred — see
`docs/SYNC-DEBT.md`.)

## ADR supersession protocol

A new ADR that changes or contradicts an existing one MUST, in the
same commit: (1) name what it supersedes/amends in its own header;
(2) stamp the OLD ADR's header — `Status: Superseded by ADR-XXXX
(date)` or `Amended by ADR-XXXX (date)` — plus a one-line delta.
Dates alone are not protection: a stale ADR read in isolation must
announce its own staleness. Never silently edit an accepted ADR's
Decision section.

**Seal-amends-ADR duty (adopted 2026-07-10, forensics F-09):** a
Production seal (RULINGS/GLOSSARY) that amends or contradicts an
accepted ADR triggers the same duty as a superseding ADR — the same
session's doc-sync batch MUST stamp the old ADR's header
(`Amended by <ruling ref> (date)`) with a one-line delta.

**Mandatory ADR trigger (adopted 2026-07-10, forensics F-06/07/08):**
a decision that changes a win condition, a cross-feature model, or
SPEC direction MUST land with an ADR in the same batch. "SPEC-level"
is not an exemption from the Record layer — it is the strongest
reason to enter it.

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
  if normative is drift. The summary+pointer discipline applies to
  EVERY DOMAIN_MAP entry, including the Core Terms and Design
  Principle sections — not only promoted feature terms (adopted
  2026-07-10, forensics F-04).
- **Naming**: canonical identifier = industry-standard English,
  matching code identifiers (`projectable mass` ↔ `projectableMass`);
  header format `English canonical (한국어 표시어)`. Prefer standard
  terms (power projection, hermit kingdom, decisive victory) over
  coinages; coin only for genuinely novel mechanics.
  **Intuitive over compact (user ruling 2026-07-07)**: when coining or
  choosing a 한국어 표시어, prefer the self-explaining longer name over
  the allusive short one — a term should teach its own meaning on first
  read (징집 명부, not 인력 풀). A rename keeps the old name as a
  `구칭` alias at the birthplace row.
- **Coinage duty**: a new term appears only with a `[조어]`/`[coinage]`
  tag and is registered into Tier 1 (or discarded) within the same
  exchange. In conversation use the standard English term directly;
  abbreviations allowed after one parenthesized full form.
- **Conversational term alignment (adopted 2026-07-10 — agent duties,
  not user duties)**: (a) when the user's phrasing maps to a
  registered term, echo the canonical name once and continue with it;
  (b) before treating a user-described concept as NEW, check
  `docs/audits/term-inventory.json` for an existing term and surface
  any match; (c) exploration exemption — loose language is free
  during brainstorming/grilling; alignment fires when a statement
  heads to a seal. The mechanizable slice (exact alias/구칭 matching)
  is mechanized by the `scripts/hooks/alias-inject.js` UserPromptSubmit
  hook (live since 2026-07-10; advisory-only, never blocks — the
  exploration-exemption judgment stays with the agent).
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
   changed; SPEC only via user-approved proposal. **This includes a
   promotion scan** (not only a seal-sync): check the session's output
   for Tier-1→Tier-0 promotion candidates — not just new TERMS but
   cross-cutting PRINCIPLES that a second feature or a root doc now
   needs (a principle that RECURRED across the session is the signal).
   Promote terms autonomously (DOMAIN_MAP, Tier-2); *propose*
   principle / DESIGN / SPEC promotions (Tier-3). Absence of a promotion
   is a valid outcome — but it must be a CHECKED conclusion, not an
   unexamined default (learned 2026-07-09: a doc-sync that synced seals
   but skipped the principle scan missed a root-level methodology
   promotion until the user caught it).
3. Refresh `INDEX.md` of every touched feature (status, pointers,
   open questions).
4. Regenerate `docs/GLOSSARY-QUICKREF.md` after any seal batch — an
   agent-curated digest (no generator script yet). Extended role (user
   ruling 2026-07-07): it also carries the **C-loop translation table**
   (user statement → dial → checking scale), the user-audit surface;
   가안 rows marked UNSEALED, always pointers: convenience surface
   only, never cited as definition; header must carry "last
   regenerated" date. Regeneration MUST include the batch's own seals
   (same-session freshness, adopted 2026-07-10 — forensics M-07):
   "may lag canon" covers only content older than the current session,
   and the "last regenerated" date is the lint's freshness target.
5. Stamp superseded/amended ADRs per the protocol above — including
   the seal-amends-ADR duty.
6. Record any duty left unpaid (and any Projection/Production
   divergence noticed) in `docs/SYNC-DEBT.md`.
7. Maintain the audit baselines (adopted 2026-07-10): a session that
   sealed, renamed, or re-statused a term patches its
   `docs/audits/term-inventory.json` row in the same doc-sync batch
   (index fields only, per `docs/audits/HARVEST.md`); run the audit
   lint (`npm run lint:docs` — `scripts/audit-lint.js`, landed
   2026-07-10, also wired as the `write-lint.js` PostToolUse hook).
   Lint findings are reports, never legislation.

<!-- END documentation-law (generated) -->

## Read Order

Before substantial work, read:

1. `SPEC.md` - product and gameplay goals.
2. `DESIGN.md` - current architecture and phased design direction.
3. `DOMAIN_MAP.md` - domain vocabulary and verified/assumed terms.
4. `docs/adr/` - accepted design decisions. **Read the ones that bound your
   task, not just the recent ones.** A decision recorded here and never cited
   is how the project has actually gone wrong before (ADR 0041 § Context).
5. `docs/features/<feature>/INDEX.md` - active feature context, when relevant.
6. `.scratch/<tracker>/` - **the live work**: open decisions, their evidence,
   and the tickets they gate. Docs 1-5 record what is settled; the trackers are
   where the unsettled work is. See § Issue tracker.

## Current Direction

**Now:** the **L3 playable build** — making the settled design playable by a
human on the authored world, for one complete match. It is planned through the
Wayfinder decision gates in `.scratch/l3-playable-seam/` and built through the
tickets in `.scratch/l3-playable-build/`. No implementation ticket is
authorized until its named decision gates close. Start at
`.scratch/l3-playable-seam/map.md`.

Standing direction:

- Phase 1 scope is terrain, regional value, and combat.
- The world model is East Asia-inspired but fictional and extensible.
- **Geography is sealed, not tentative.** The world is
  province → front sector → hex: the **front sector** is the operational atom
  (ADR 0032, `DOMAIN_MAP.md`), and hexes are its substrate. The hex grid's
  orientation and resolution are **frozen** — changing them is seed-reauthoring
  tier (terrain-cradle RULINGS TC-⑪). The old "may start with hexes, but do not
  block a later move to province-style maps" caution is discharged: that move is
  what the sector world already is.
- Avoid feature work before the current design/spec is approved.

## Design Guardrails

- Keep Phase 1 war and regional systems grounded in legible real-world
  intuitions. Terrain, fortifications, population, economy, local garrisons,
  routes, and post-battle recovery should behave plausibly even when represented
  with simple MVP placeholders.
- Avoid treating conquest or control as an instant full-value transfer. Control
  and route access can change immediately, while economy, population, garrison,
  and recovery may lag until deeper governance systems are introduced.

## Verification

The **reference prototype** (`index.html` + `js/`) is a static
HTML/CSS/JavaScript app. Use a local static server to view it.

```bash
python3 -m http.server 8007   # then open http://localhost:8007
```

This is how you inspect the archive — it is **not** a description of what the
project is building. See § Environments below before assuming the target shape.

Node-side checks (these cover the sealed war model, which the prototype page
does not load):

```bash
npm test          # Node test suite
npm run lint:docs # documentation-governance audit
```

## Environments (ADR 0041)

Two isolated environments. Do not let one imply anything about the other.

- **Marketing landing** — Firebase Hosting serves the landing page only. It
  markets the product and will later carry download integration. It is not the
  game's shipping channel, and its stability is not a constraint on game
  architecture.
- **Game runtime (L3, under construction)** — does **not** ship as a
  statically-hosted web page. A browser is a development and playtest host, not
  the distribution target; the intended destination is a native shell (Electron
  or Tauri — the specific choice stays deferred, ADR 0016 Stage 2).

**The reference archive.** `js/`, `tests/`, the L2 harnesses
(`mockup/combat-calc/`, `mockup/operational-layer/`), and the existing mockups
are **reference, not build source**. Consult them as evidence — sealed
behavior, fixtures, executable models, measurement harnesses, craft precedent.
Accepted behavior reaches L3 by being re-implemented from its **authoritative
contract** (the feature's GLOSSARY / RULINGS / model docs), verified against the
archive — not by translating the file. The archive is not a parity comparator
for behavior it never ran: `index.html`/`game.html` load none of the eight
sealed slice-2 war modules.

**Canonical L3 source occupies its own directory tree**, separate from the
archive. The exact boundary is Wayfinder gate 05's decision, not settled here.

Authority: `docs/adr/0041-environment-isolation-and-reference-archive.md`.
Do not restate it — point at it.

## Issue tracker

Issues and specs live as local Markdown under `.scratch/<tracker>/`. Config and
conventions: `docs/agents/issue-tracker.md`.

Live trackers:

- `.scratch/l3-playable-seam/` — the L3 Wayfinder: decision gates, their
  evidence, and the assembled constraint ledger. **Front door: `map.md`.**
- `.scratch/l3-playable-build/` — the nine L3 implementation tickets. All
  `needs-info` until their gates close; `README.md` carries the execution
  protocol.
- `.scratch/doc-structure/` — documentation-governance work.
- `.scratch/war-model-slice2/` — landed (tickets 01–11); kept as record.

Trackers are Working layer: consult them for what is *being decided*. Current
truth lives in the seal chain (§ Documentation & Terminology Law), not here.

**Triage labels** — the five canonical roles, each label string equal to its
name, recorded on a `Status:` line in the issue file. See
`docs/agents/triage-labels.md`.
