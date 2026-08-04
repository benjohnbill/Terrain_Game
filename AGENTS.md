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
ritual — is authored in `DOCUMENTATION-LAW.md` at the top level. That
file is the canonical, editable source; the generated block below is a
verbatim mirror of it, and the block is what **both** hosts actually
read. Codex has no external-file auto-import, so mirroring is the only
way the law reaches it at all.

Do not edit the block by hand. Edit `DOCUMENTATION-LAW.md`, then run
`npm run sync:docs-law`; `node scripts/sync-docs-law.js --check`
reports whether the block has drifted from the source, and
`npm run lint:docs` runs that check.

The canonical file deliberately does **not** live under
`.claude/rules/`: the Claude Code harness auto-loads that directory on
its own, which put the whole law in every session's context twice —
once from there and once from this block. Do not move it back, and do
not `@`-import it (that would lose it for Codex and re-duplicate it for
Claude).

<!-- BEGIN documentation-law (generated) -->
<!-- source: DOCUMENTATION-LAW.md — DO NOT EDIT here; edit the source and run `npm run sync:docs-law` -->

# Documentation & Terminology Law — Terrain Game

Project-specific. The single source for document hierarchy, authority,
production flow, and domain-vocabulary rules. `AGENTS.md`, `DESIGN.md`,
and `DOMAIN_MAP.md` point here — do not restate this law elsewhere.
Auto-load carries LAW only; canon CONTENT (glossaries, dials) is Read
on demand where the law points.

**Editing:** the canonical, editable source is `DOCUMENTATION-LAW.md` at
the top level; agents read the verbatim mirror of it generated into
`AGENTS.md`. Edit the canonical file, then `npm run sync:docs-law`
(`--check` reports drift; `npm run lint:docs` enforces it).

The canonical file sits at the top level on purpose, and must stay out
of `.claude/rules/`: the Claude Code harness auto-loads that directory
*in addition to* the mirror, which put the whole law in every session's
context twice. Removing an `@`-import did not fix it — no import was
ever the cause. Do not `@`-import it either: Codex has no external-file
auto-import, so the mirror is the only thing reaching both hosts, and an
import would merely restore the duplication for Claude.

## Layer taxonomy

| Layer | Documents | Authority & write rule |
|---|---|---|
| Direction (방향) | `SPEC.md` | What the product is. Changes only by explicit user decision; feature passes work inside SPEC bounds — a pass that needs a SPEC change files a proposal, never drifts it. |
| Projection (투영) | `DESIGN.md`, `DOMAIN_MAP.md` | Stable summaries of sealed truth (architecture / language). Updated only in doc-sync batches; truth is never authored here first. |
| Record (기록) | `docs/adr/` (promoted) · feature `RULINGS.md` (birthplace) | Why decisions were made. ADR = architecture-grade / cross-feature; RULINGS = feature-local rulings that promote up when they outgrow the feature. Append-only + supersession protocol below. |
| Production (생산) | `docs/features/<slug>/` | The workshop where truth is minted (with user seal). File roles below. |
| Working (작업) | `mockup/*/NOTES.md`, `docs/superpowers/`, `docs/DESIGN-RISKS.md`, `docs/GLOSSARY-QUICKREF.md` (generated), tracked debt ledgers (`docs/SYNC-DEBT.md` doc-sync debts, `docs/DISPLAY-DEBT.md` UI-design debts), `docs/audits/` (audit baselines + dated reports), `.context/` (handoffs; tracked — worktrees do not carry untracked files), `docs/agents/` (agent tooling config) | Time-stamped records and idea banks — consult for context and parked/deferred ideas; CURRENT truth lives in the seal chain, not here. NOTES verdicts are a staging area: they must sync to Production/Projection in the same session's doc-sync batch. Debt ledgers are registers only — a row points to the mechanic's birthplace, never redefines it. `docs/audits/` baselines (term inventory, doc registry) are machine-readable indexes maintained per `docs/audits/HARVEST.md` (two-mode model); audit-lint findings are reports, never legislation. `docs/agents/` is agent-tooling config (tracker location, triage vocabulary): it points at this law and never restates it. |
| Law (법) | `AGENTS.md`, `CLAUDE.md`, `DOCUMENTATION-LAW.md` | The rules agents execute. Changes only by explicit user decision. |
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

**Derived and chosen inside one value (adopted 2026-08-05, promoted from
three feature instances).** A sealed quantity usually carries two things
at once: a **derived** constraint the surrounding model forces, and a
**chosen** value someone picked inside the room that constraint leaves.
**A re-cut inherits the derived part and does not inherit the chosen
part.** So when a value is load-bearing for a downstream derivation, its
seal states which part is which and by what — a seal that states only
its number leaves the next author unable to tell, and the two failures
are asymmetric: treating a derived constraint as free breaks the model
silently, while treating a chosen value as forced freezes a dial that
was always meant to move. This is a **different axis from the L-stamp
above** — L says how *verified* a value is, this says how *free* it is,
and a hand-reasoned L0 value can still sit under a hard derived
constraint. Instances it was promoted from: combat-formula M7's
Encirclement threshold (*above* M4's rout cliff is derived, the 2.2
headroom is chosen), fog FG-M①'s reconnaissance crossover (ρ≈1.49,
"emergent and must not be set directly"), and capital CP-⑤'s guard
coefficient (2,500 chosen against a derived floor of 1,800).

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

**Reasons are load-bearing (adopted 2026-08-02, Wayfinder gate 10
session):** a ruling's stated *reason* is normative alongside its
conclusion. A seal, an ADR, or a code comment whose reason is **false
or has expired while its conclusion still stands** is a defect, not a
cosmetic nitpick — a right answer resting on a wrong reason sends the
next change to the wrong lever, and it is harder to catch than a wrong
answer precisely because the conclusion checks out. Correct it at its
birthplace in the batch that finds it, and **state the true reason
rather than deleting the false one silently**; where the reason was
load-bearing for a downstream decision, say so. Amending only a reason
is a Record-layer stamp, not a redesign, and it does not reopen the
ruling. The pattern recurred four times in the session that adopted it
— a sealed ruling crediting the wrong mechanism for early-rush
defence, a risk row naming a hazard the code did not have, and two
acceptance docstrings that justified themselves by a gate which had
just closed — which is why it is written here rather than left a
habit.

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
  `AGREED/PROPOSED/rejected-recorded`, plus `SEALED` = the strong form
  of `AGREED` (the name is settled **and** its ruling carries a dated
  seal with a verdict source); `SEALED` implies `AGREED`, and `✅`
  covers both. Status is the **name** axis only — a settled name whose
  values are still provisional is `AGREED`, with the provisionality
  stated in the row's value column (`가안`), never in the status field.
  Ruled 2026-07-15 (doc-structure ticket 03 Q1); enforced by
  `audit-lint.js`.
- **Summary column**: every feature `GLOSSARY.md` row carries a one-line
  `Summary` beside its definition, written by the definition's own author when
  the row is written or re-sealed — **going-forward only** (user ruling
  2026-07-27; rows predating the column are not backfilled, because a summary
  written in bulk by a non-author is the unowned text this law exists to
  prevent). It is the join column a generated QUICKREF reads.
- **Promotion**: a Tier-1 term is a promotion candidate once a second
  feature or a root doc needs it; promotion happens in doc-sync
  batches, never silently. Promotion *adds* a Tier-0 summary entry (per
  the single-definition rule above) — it does not move the definition
  out of the feature doc, which stays authoritative.

## Work intake

Durable work enters through the tracker, not through conversation alone.
Adopted 2026-08-03 (doc-structure ticket 14, R1–R7).

1. Work too large for one session is charted as a Wayfinder map, whose
   children are decision tickets.
2. A ticket's **type and scope are agreed with the user before its file is
   created.** An agent creating a ticket from an instruction rather than
   from a decision says so, and asks first.
3. Front matter is written when a ticket file is created, not added to it
   later. Bringing an existing tracker onto the schema is a **one-time
   migration**, made in a single batch with its enforcing check — not a
   retrofit performed ticket by ticket. Schema and value domains live in
   the repo's tracker doc § Wayfinding operations
   (`docs/agents/issue-tracker.md`); this law does not restate them.
4. Implementation runs from a ticket and closes with a review. The ticket
   is the unit of work; the session is not.

Clause 2 is a duty an agent can skip, and this law says so rather than
pretending otherwise: a clause with nothing consuming it was measured at
**0 of 4** on the same day this was adopted (the `Summary`-column duty,
adopted 2026-07-27, triggered four times and honoured none). What carries
force here is not the clause but what depends on the schema — a blocking
lint check on the front matter, and `scripts/frontier.js`, which is how
available work is found. A ticket without front matter does not appear
there, so omitting it is a breakage rather than a disobedience. Enforcement
by dependency is the pattern to reach for first; a clause is the index into
it, not a substitute for it.

**Deferral discipline.** A deferral recorded without a trigger becomes a
permanent debt, so any text that parks work — a grandfather entry, a
"later" note, a held-out file — states two things beside it: **when it is
picked up** (the named condition, not "soon") and **when the text itself is
deleted**. An exemption from a blocking check must not outlive its reason.
The precedent is `AGENTS.md`'s tracker note, which carries its own deletion
line.

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
4. Keep `docs/GLOSSARY-QUICKREF.md` fit for its two purposes (**purpose
   defined by user ruling 2026-07-28** — it had never been stated, which
   is what made this duty's cadence and content repeatedly contentious):
   (a) an **encyclopedia** — look a term up and find where it lives; and
   (b) a **lock point** — as terms drift under hooks, lint, and ordinary
   commits, the QUICKREF is the baseline you re-render deliberately when
   the demand "let us tidy the vocabulary now" arises. It is a
   convenience surface only, never cited as a definition; every gloss in
   it is non-citable and the pointer is the citable part.

   Three rules follow, all adopted 2026-07-28:

   - **Cadence is on demand, not per batch.** Re-render at lock points.
     A seal batch does not oblige a re-render, and the `stale-quickref`
     lint finding is **advisory** — a prompt, never a gate. (This
     supersedes the 2026-07-10 same-session-freshness duty, forensics
     M-07, which made every sealing session pay a manual re-render;
     that cost is what the lock-point model removes. The header's "last
     regenerated" date is still the freshness target, and a re-render
     MUST still include the seals of the session that performs it —
     "may lag canon" covers only content older than the re-render.)
   - **Uniform weight.** Every term renders with the same primary
     content — term, 한국어, status, and where its definition lives — so
     that a term with a hand-written `Summary` and one without are
     visually equal. A gloss is secondary and optional; its absence is a
     blank slot, never a demotion. This is safe precisely because no
     gloss here is citable: rendering an authored summary and a
     mechanical excerpt alike hides nothing, since the pointer carries
     the authority. Never sort, tier, badge, or section the file by
     whether a gloss exists.
   - **The header carries a "last regenerated" date**, whoever or
     whatever produced the file.

   The **C-loop translation table** (user statement → dial → checking
   scale — the user-audit surface, user ruling 2026-07-07) is **no
   longer carried here**. Its home is `docs/C-LOOP.md`, Working layer,
   hand-written, 가안 rows marked UNSEALED. It left because it had grown
   cross-feature and because hand-authored content inside a re-rendered
   file is content a re-render destroys.
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
- `.scratch/operational-manoeuvre/` — the manoeuvre pass: bypass, interception,
  supply interdiction, encirclement, and frontage's removal economy. Parallel to
  the build and **non-blocking**; its design gates wait on ticket 13's match
  report. **Front door: `README.md`.**
  *Delete this line when ticket 11 leaves `needs-info`* — Part 2 #2
  (Encirclement) is on 11's blocker list and is this pass's own item, so that is
  the pass's exit criterion, after which the tracker is a record rather than live
  work.
- `.scratch/doc-structure/` — documentation-governance work.
- `.scratch/war-model-slice2/` — landed (tickets 01–11); kept as record.

Trackers are Working layer: consult them for what is *being decided*. Current
truth lives in the seal chain (§ Documentation & Terminology Law), not here.

**Ticket state** lives in each ticket's YAML front matter (`type`, `status`,
`blocked_by`), not in a label string. Schema and value domains:
`docs/agents/issue-tracker.md` § Wayfinding operations. Skills phrased in the
five older triage roles translate through `docs/agents/triage-labels.md`.

Work is **found**, not looked up: `node scripts/frontier.js` derives what is
takeable from that front matter across every tracker. A ticket without front
matter does not appear there at all, so omitting it is a breakage rather than a
style lapse.

*(This paragraph read "the five canonical roles … recorded on a `Status:` line
in the issue file" until 2026-08-03. Ticket 14 R1/R3 moved state into front
matter and R4 cut the vocabulary to four values; the pointer had kept the
retired mechanism, which would have sent a cold session to write a `Status:`
line and drop its ticket out of the frontier. Corrected by user decision in the
Wayfinder gate 12 batch.)*
