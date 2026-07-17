# Doc-structure improvement map (2026-07)

Label: wayfinder:map
Status: open — decision layer PARTIALLY REOPENED after adversarial review

> ## ⚠ State as of 2026-07-15 (read this before choosing a ticket)
>
> Six decision tickets were resolved 2026-07-15 and then reviewed by three
> independent adversarial reviewers before execution. **The review is at
> `docs/audits/2026-07-15-doc-structure-review.md` (tracked). Read it first —
> it is the authoritative account of this map's state; the summaries below are
> pointers.** Headline: **~122 factual claims checked, 24 failed**; verdict
> **UNSOUND-WITH-MAJOR-FIXES**; honest efficacy against the user's stated pain
> **~40%**, with the residual landing on the user's primary target — the same
> shape the 2026-07-10 cold review found.
>
> **Reopened (re-grill required, in a fresh session):** 02, 11. (04 re-grilled &
> re-sealed 2026-07-16 — designation without freeze; law clause user-sealed,
> file edit batched Tier-3.)
> **Blocked (do not execute):** 09, 10, 12 — each carries the reason in its file.
> **Applied and sealed (standing):** 01 rulings 1–2, 05, 06, 07 (`456344b`,
> `e35caf8`).
> **Corrected in place:** 01 (duplicate Answer block removed), 03 (":423"
> citation, "Closes" → narrowed, handoff flagged incomplete), 05 (marked applied;
> citation fixes).
>
> **The Destination below is suspect.** Its gate — "audit run #3 running
> lint-clean" — was judged **green precisely where the package is weakest**: a
> lint-clean run is satisfied by a no-op check, an unenforced law row, an
> unverified status field, and a deleted Record layer. Closing on it would
> convert "we didn't measure it" into "it's done". **Redesign the exit criterion
> before ticket 10 runs.**

## Destination

*(suspect — see the state block above; the gate must be redesigned)*

Every structural gap surfaced by the 2026-07-15 governance survey is either
resolved (decision sealed, mechanical debt paid, wiring landed) or explicitly
ruled WATCH / out of scope — closed by **audit run #3 running lint-clean on the
settled schema** (ticket 10 is the terminal gate).

## Notes

- **Tracker**: local markdown (`docs/agents/issue-tracker.md`). Map and tickets
  follow its Wayfinding operations section.
- **Evidence base**: three survey digests under `research/` in this directory
  (enforcement mechanism, inventory schema, design history). Read the relevant
  digest before working a ticket; do NOT re-survey the repo.
- **Binding context**: the design-history digest's "already rejected/deferred"
  list is a hard constraint — do not re-propose a rejected item without new
  evidence of the kind its reopen condition names. **This map violated that rule
  (ticket 11 vs P4) — read `docs/audits/2026-07-15-doc-structure-review.md` §1
  before any topology ruling.**
- **Measure, don't infer** (the review's dominant failure class): every count in
  this map's tickets that was inferred from a grep sample rather than computed
  failed — plans 12→17, issues 10→22, refs 20→31, "all footnotes" → 1 of 31,
  "1:1 mapping" → 5/12. Recompute from the live tree; cite file:line and verify
  the line (three FE-1-class citations in these tickets pointed at unrelated
  text).
- **Law edits are Tier-3**: every law-touching ticket resolves as a *proposed
  diff*; the user seals. Lint findings are reports, never legislation (S13).
- **Execution is in-map** by user decision (2026-07-15): mechanical debts and
  audit-lint/hook code changes are task tickets here, TDD on the existing
  44-test suite (`tests/audit-lint.test.js` + `tests/hooks.test.js`).
- Grilling tickets are HITL — `/grilling` + `/domain-modeling`, one question at
  a time. Never resolve more than one ticket per session.
- Artifacts in neutral professional English.

## Decisions so far

<!-- one line per closed ticket: gist + link -->

- [Absorb the agent-tooling layer](issues/01-absorb-agent-layer.md) — absorb
  narrowly: register `docs/agents/` (Working) + legalize the `law` taxonomy row
  with an in-repo Tier-3 gate (Codex can't read the global one); reject the
  standalone pipeline clause (WATCH, and it would pre-judge ticket 04); no
  AGENTS.md change. `.scratch/` registration split out to ticket 11 because
  drafting it exposed duplicate homes for the same doc kind. Law diff batches
  with ticket 05; user seals.
- [Working-spec authority](issues/04-working-spec-authority.md) — **RESOLVED
  (re-grilled 2026-07-16; law clause user-sealed).** Legalize **designation** (a
  Record-layer ruling names a Working text as its authoritative body; the ruling
  carries the sealed decisions in summary = SSOT, the designated text holds the
  detail + provisional dials) — **without a freeze**: the reopened freeze
  invariant was refuted by 79d25e3 (a legitimate doc-sync edit 3 min after the
  ruling). A designated text stays living — reconciliation/dial-refinement is
  ordinary doc-sync; an edit contradicting a sealed decision rides the existing
  **seal-amends duty on the ruling**; detail **graduates** to the owning model
  doc (SYNC-DEBT-tracked). **No ADR** (layer altitude: a Law-layer mechanism →
  law text + `docs/audits/2026-07-16-designation-ruling.md`, per the
  F-06/07/08·F-09 precedent). One **reopen condition**: recurring silent
  decision-drift (emergence-limit; deliberately un-mechanized, M-01).
  Carry-forwards confirmed (dial-sheet home = magnitude pass; no "repayment").
  Law application batched Tier-3 (SYNC-DEBT); registry role-string honesty fix →
  tickets 08/12.
- [Inventory schema v2](issues/03-inventory-schema-v2.md) — ✅ facts verified exact; ⚠ ":423" citation wrong, "Closes" withdrawn→narrowed, 09-handoff incomplete — sealed **with a
  binding condition: void unless ticket 09 implements the enum check** (FE-4
  recurred in 5 days precisely because nothing enforces the domain). `SEALED`
  becomes a 4th status value — the strong form of AGREED — resolving the law's
  own conflict (seal mechanics names it a status word; the dictionary omits
  it). Aliases become typed `{name, rel}` (구칭/retired/synonym/code/member/ref),
  fixing the ingest that destroys `구칭` markers and the hook that can't tell a
  retired name from a synonym — **narrows** the Codex P1 lifecycle row
  (`SYNC-DEBT:291-295`; "closes" withdrawn — a ruling void without 09 closes
  nothing, and the row asked for lifecycle states *in the law*).
  Promotion is **derived, not stored** (checkHeaderDiff already holds the data;
  a field would be an M-04 copy) — makes ritual duty 2's scan mechanizable.
  Ownership boundary set: index fields patchable, audit fields (verdict)
  audit-only. Judgments (state/strategy/SUPERSEDED, 2 verdict strays) go to
  run #3's queue, not to a grep.
- [Registry wiring](issues/02-registry-wiring.md) — ⚠ **REOPENED — measured no-op** (0 rows parsed in 7 of 8 targets) — was: **wire class A only**
  (agent judgment, user delegated). The decisive find: `checkNumericRestatement`
  already implements `forbiddenContent` with its target hardcoded — wiring is
  unhardcoding it to read the registry, not new capability. Coverage 1 → 8
  files, reusing the FP-narrowed rule verbatim. Reject class B (dial-values on
  prose SPEC = alarm fatigue; `seals` needs the never-mechanized seal parser)
  and demotion (class C is real rule, just unautomatable — registry gets an
  enforced-vs-declaration honesty note instead). Inventory join key: YAGNI,
  available when needed. Feeds tickets 09 and 08.
- [Mechanical debt batch](issues/06-mechanical-debt-batch.md) — **applied**
  (commit 456344b). SYNC-DEBT F-11 hygiene: 2 already-PAID rows moved Open→Paid
  (pure relocation, proven by sorted diff); no others misplaced. DOMAIN_MAP
  `Operation` re-slimmed — guard passed first (the value lives at its
  match-arc/GLOSSARY birthplace), War row untouched. **lint clean, 8 checks /
  0 findings**; tests 372/372.
- [Setup slimming](issues/07-setup-slimming.md) — **applied** (commit 456344b),
  minus the Tier-3 piece. Competing spec home removed from issue-tracker.md
  (routes to the feature's `specs/` per ticket 11); `domain.md` deleted (it
  restated the law 4 ways). The `CLAUDE.md` "Domain docs" trim is drafted only,
  and was **sealed at `e35caf8`** — the dangling pointer is closed.
- [Law staleness batch](issues/05-law-staleness-batch.md) — **APPLIED, user-sealed at `e35caf8`** (the trimmed Correction A landed; the ticket's AFTER blocks are stale). All three docs:check → audit-lint mappings
  verified in code (`checkAdrStampDuty` / `checkFreshness` /
  `duplicate-canonical`), so the law's "stays deferred" sentence is false and
  the ledger row closes as SUPERSEDED. Three law corrections + the SYNC-DEBT
  edit are written out verbatim in the ticket; batch with ticket 01's diff.
- [Working-surface routing](issues/11-working-surface-routing.md) — ⚠ **REOPENED** (both load-bearing measurements failed; P4 reopened by argument) — root
  ruling: **the feature folder is the home** for every durable doc about a
  feature. Retire `docs/superpowers/` entirely into
  `docs/features/<slug>/{specs,plans}/` (governance meta → `docs/audits/`) —
  not P4 (relocates non-authoritative history, breaks no live pointer). Task
  decomposition = two kinds (durable plan vs claimable ticket, sharp boundary);
  new tickets only, in `.scratch/<effort>/issues/`. `.scratch/` = transient
  per-effort working area (tickets+map+research), **untracked**, disposable
  after doc-sync; rename path token `<feature-slug>`→`<effort>`. Spawned
  ticket 12 (migration); made ticket 01's `.scratch/` law row specifiable.

## Not yet specified

- **QUICKREF future shape** — C-loop translation table growth, the
  generator-script question, relation to the inventory. Hangs on inventory
  schema v2 (ticket 03).
- **Survey digests → `docs/audits/`** — the three digests under
  `.scratch/doc-structure/research/` are governance evidence (ticket 11 Q7-b);
  sync to `docs/audits/` at this map's close (ticket 10), updating any live
  ticket pointer. Deferred now to avoid breaking tickets 01–12's evidence refs.
- **Re-harvest cadence policy** — when incremental patching demands a full run;
  the M-01 semantic-staleness class is knowingly un-mechanized and remains the
  residual on the user's original pain-(a). Hangs on run #3 experience
  (ticket 10).
- **Legacy js/ prototype vocabulary** (diplomacy, gold, buildings, research,
  attackForce) — unregistered; Ring B code checks stay noisy until registered
  or scheduled for replacement. Hangs on game-code direction; may leave with
  the js/situation.js rework.
- **Why-record hierarchy** — ADR ↔ RULINGS ↔ `docs/audits/` are three homes for
  decision "why". The boundary is clear by **layer altitude** (game/architecture
  → Record: RULINGS→ADR; doc-governance/process → Law text + audits — settled in
  ticket 04's re-grill), but the *within-Record* scattering (when does a ruling
  promote to an ADR? why is game "why" split across ADR and RULINGS?) felt fuzzy
  to the user. Not this effort's job to restructure — sits in the ticket 11 /
  C-4 (governance Record home) orbit. Surfaced 2026-07-16.

## Out of scope

- **Topology restructure** — forensics P4, rejected on evidence 2026-07-10
  ("zero failures were caused by documents being in the wrong place"). Reopens
  only on topology-caused failures, as a fresh effort.
- **"spec" polysemy term registration** — rejected 2026-07-15 by precedent
  (Position as product → alias-only). The path-dimension split in
  doc-registry.json already encodes both senses; ticket 02 may wire it, never
  re-term it.
- **Game-content seals and dials** (crisis seal-sync SYNC-DEBT deferral, slice-2
  build tickets) — content, not structure.
- **js/situation.js rework** — owned by SYNC-DEBT open item (e).
- **Upstream skill behavior** (e.g., the qa skill's hardcoded `gh issue
  create`) — not this repo's documentation.
