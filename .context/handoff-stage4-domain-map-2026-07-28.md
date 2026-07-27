# Handoff — governance stages 1–2 closed; next is stage 4

**Session:** 2026-07-27 → 07-28. Picked up the enforcement-ladder handoff, applied
a ruling that had been sitting unapplied for twelve days, closed stage 2, and ran
the CI rung for the first time.
**Repo state at handoff:** `main` @ `dc695f3`, **pushed** (`origin/main` equal),
working tree clean, `npm run lint:docs` 0 blocking / 10 advisory, 501/501 root,
161/161 game.

> Location note: `.context/`, tracked, per the 2026-07-26 amendment (`db11299`).
> Same reasoning as the previous handoff — do not move it to a temp dir.

## Read these first — they are the actual record

| What | Where |
|---|---|
| The four-stage program, its measurements, prior-art conflicts | `docs/superpowers/specs/2026-07-26-governance-prevention-over-audit.md` |
| **What is pickupable, labelled per piece** | `.scratch/doc-structure/issues/13-enforcement-ladder.md` |
| The rulings this territory already has | `.scratch/doc-structure/` tickets 02, 03, 09, 10, 11 + `docs/audits/2026-07-15-doc-structure-review.md` |
| Open debts, including this program's three residuals | `docs/SYNC-DEBT.md` |
| The previous session's handoff (stage 1) | `.context/handoff-doc-governance-enforcement-2026-07-27.md` |

Three commits: `8804cee`, `885b708`, `dc695f3`. The messages carry the reasoning.

## The one idea worth carrying over

Four off-dictionary status values (`AGREED-concept` ×2, `AGREED-structure`, `가안`)
looked like four unrelated strays. They were **one concept wedged into the wrong
field** — *name settled, values provisional* — written as a status word in ten
rows across four features, with combat-formula having legislated `가안` as a status
value in its own GLOSSARY header.

The fix was not a fifth enum value. It was asking **which axis the field carries**.
`status` carries the name axis; value provisionality belongs in the value column,
where every one of those ten rows had already written it. So the status word was
the only thing that had to move, and nothing was lost.

Ruling 03 Q1 had used exactly this reasoning once already, to reject a separate
`sealState` field ("the axes are not independent in practice"). The lesson
generalises: **when a vocabulary keeps growing off-dictionary values, test whether
the field is carrying two axes before you widen the dictionary.**

This matters for stage 4, because `DOMAIN_MAP.md` has the same shape one level up:
one file doing two jobs — birthplace of 61 native terms, and pointer surface for
56 promoted ones. Stage 4 is that separation, not a bigger rule.

## What landed

**The ruled status dictionary, applied** (`8804cee`). Ticket 03 Q1 ruled on
2026-07-15 that the Vocabulary Law gains `SEALED` as a fourth value; it was never
applied. The law now carries it plus the name-axis rule; `HARVEST.md` step 4 gains
the same as a harvest instruction (*do not transcribe a birthplace's local status
word*). Ten birthplace rows normalized — status word only, every date, ruling ref,
and `가안` parenthetical preserved. combat-formula's local dictionary retired. Five
inventory rows patched.

**`audit-lint.js` check 10 (`fieldDomains`), blocking, grandfather list EMPTY.**
`status`, `kind`, and `verdict` domains. `verdict: null` is legal — HARVEST step 6
gives every newly sealed term a null verdict, so blocking on it would gate sealing
behind auditing. The empty grandfather list is the payoff of taking the law first:
normalizing ten birthplaces beat exempting fifteen rows. This discharges ticket
03's binding condition, which declared schema v2 *void* without it.

**The ✅ marker predicate tightened** from `s !== 'PROPOSED'` to its two named
values — the "too lax" half of the 2026-07-15 marker finding, safe to close only
once the enum check guarantees the status is in the dictionary at all.

**Stage 2 closed** (`885b708`). The `Summary` column is open across all seven
feature GLOSSARYs — 7 tables, 121 rows, inserted after `Definition` so `Status`
stays last, cells empty by design. Rolled out eagerly on the user's decision: an
absent column makes the authoring duty invisible. The duty is in the Vocabulary
Law — the definition's own author fills it, **going-forward only, no backfill**.
`summary` is a GLOSSARY column and deliberately not an inventory field (a JSON
holding content breaks ruling 03 Q5's ownership boundary).

**`## Resolved Phase 1 Decisions` folded to pointers**, not moved to an ADR.
Ticket 13 labelled it "relocation, not judgment"; opening it showed seven
reference-prototype decisions restated in the present tense, and the prototype is
an archive (ADR 0041) whose world the cradle map replaced. An ADR would have
dressed archive description as a decision of record.

## Verified live, not asserted

The gate was fired at a real `git commit`, not just the CLI:

| Test | Result |
|---|---|
| Table integrity after the column insert | 7 tables, 121 rows, 0 cell-count mismatches |
| Off-domain `kind` injected → real commit | **rejected**, HEAD unmoved, prescription printed |
| New GLOSSARY row, unregistered → commit | **rejected**, both legitimate exits offered |
| Registered properly → commit | **rejected** — see the authoring loop below |
| Registered + QUICKREF stamp bumped → commit | **passes**, hook output 64 bytes (silent) |

**CI ran for the first time and succeeded** (run `30278220231`, 27 commits). Its
output is byte-identical to local — `audit-lint: 0 blocking, 10 advisory` — which
makes the ladder's sealed invariant (*no check logic in any enforcement point; a
CI failure is always reproducible locally with one command*) an observed fact
rather than a claim.

## Trip-wires

- **The authoring loop is three steps, not two.** GLOSSARY row + `Summary` →
  inventory row → **QUICKREF "Last regenerated" stamp** → commit. Skip the third
  and the commit is blocked by `stale-quickref`. That is ritual duty 4 mechanized
  and it fires on every session that seals a term on a new date. It is also
  precisely the recurring cost stage 3 exists to remove.
- **Hooks are per-checkout; CI is the only universal rung.** `core.hooksPath` lives
  in this checkout's `.git/config`, which is not cloned, and there is no
  `prepare`/`postinstall` script. A fresh clone, another machine, or a Codex
  checkout has **no hooks at all**. Adding a `prepare` script to install them was
  considered and **declined 2026-07-28** — install silently mutating git config is
  the wrong trade; CI already covers it and hooks stay a fast-feedback convenience.
- **`pre-commit` does not fire on merge commits.** `pre-push` and CI are the real
  gates on the path a Codex branch takes into `main`.
- **The gate is state-based, not diff-based.** `audit-lint` reads the whole repo,
  not the staged diff, so a doc defect introduced by one actor blocks another's
  unrelated push until it is fixed. That is the cost of the single-entry-point
  invariant, and it is intended.
- **The advisory tally is meant to stay non-zero.** Ten `ledgerCurrency` findings,
  all verified spurious, every debt genuinely unpaid. Driving it to zero is not a
  goal.
- **`term-inventory.json` round-trips byte-identically** at
  `JSON.stringify(data, null, 1) + "\n"` — verify that before any scripted patch,
  then edit through `JSON.parse` rather than by text substitution.
- **`rg` gives false negatives in this repo** on recursive `.`/dir scope. Use
  `/usr/bin/grep -rn`. Bare `git log` can report another worktree's tip; use
  `/usr/bin/git rev-parse` / `show -s`.
- **`game/dist` staleness reads as broken code.** Run `npm run build:runtime:game`
  after any `game/src` merge — the game tests load the emitted runtime graph.

## What to do next — stage 4

Authority: the spec's `### Stage 4` section. Live measurement re-confirmed this
session and matching the spec exactly: **117 entries = 61 native + 56 promoted**,
865 lines.

**The rule and the check are the same sentence**, which is the signal it is
well-formed:

> `DOMAIN_MAP.md` defines only the terms born there. A promoted term gets
> pointer + status + why-it-is-canon.

- **56 promoted entries → reduced to pointers, NOT deleted.** Each keeps its
  `- ✅ \`Term\`` header, its status marker, and its why-it-is-canon line; what goes
  is the copied definition. The header is load-bearing twice over: ruling 03 Q3
  derives promotion from its existence, and `checkHeaderDiff` scans it. The spec's
  first draft proposed deletion and was corrected — do not re-derive that.
- **61 native entries keep their definitions.** `DOMAIN_MAP.md` is their
  birthplace; check 9 already scopes itself to exclude them.
- **Progress meter, already in the code:** `RESTATEMENT_GRANDFATHERED` in
  `scripts/audit-lint.js`, currently **19 names**. Delete a name as its entry is
  re-cut; the set reaching empty is what pays the debt. Note the asymmetry — 19 is
  the subset check 9 detects, the job is 56 entries.
- **Why stage 4 before stage 3:** those 56 summaries are exactly what a generated
  QUICKREF would otherwise lack on day one. `summary` is going-forward-only, so on
  its own the generator starts near-empty; stage 4 hands it ~56 real summaries and
  substantially dissolves stage 3's open question.

**Two non-term sections still owed** (the third and fourth of the spec's four are
settled — `## Design Principle` stays, `## Resolved Phase 1 Decisions` is done):

- `## World Direction` → `SPEC.md`. **Guard first:** `SPEC.md` already has a
  `## Core Design Principles` section and both carry supersession stamps. Diff them
  or the move creates one more copy. SPEC changes only by explicit user decision.
- `## Open Questions` → tracker or a feature `INDEX.md` open-questions block.

**The rename is last, optional, and separate.** `DOMAIN_MAP.md` → a top-level
glossary touches 80 inventory `birthplace` values, 4 script/test files,
`doc-registry.json`, the law, the `AGENTS.md` mirror, and 92 markdown files. Buys
naming honesty and nothing functional. Decide it on its own, unbundled.

## Still open elsewhere

- **Stage 3 is blocked on two decisions**: what the QUICKREF generator renders for
  a term with no `summary`, and where the hand-written C-loop translation table
  goes (it must leave `GLOSSARY-QUICKREF.md` before any generator exists). Both
  get easier after stage 4.
- **Not delivered from stage 2, both optional**: the promotion-consistency *report
  line* (the spec calls it "worth taking", with the reviewer's caveat that
  `seenTerms` is a flat set across all surfaces), and any check that a new row
  arrives with a non-empty `Summary`.
- **Three SYNC-DEBT residuals from this session**: `CONFIRMED` still unreconciled
  between the seal triad and the term-status dictionary; typed aliases (Q2)
  unimplemented, which is why `Blinds` was routed to `rejected-recorded` instead;
  and the other three pieces of the ruled `HARVEST.md` §4 amendment, sequenced with
  ticket 10's batch.
- **Codex ticket 06a's final review pass is still cut short** — the narrowed
  re-check of its Critical/Important findings, three Minors, whitelist default-deny,
  mixed-actor replay scoping, and R18 doc-placement. Branch
  `codex/ticket-06a-field-army` and `/tmp/terrain-game-ticket-06a` still exist.
  `mockup/fog-veil` is unmerged and untouched.

## Suggested skills

- **`/doc-audit`** — for anything in this territory. Start at Layer 0
  (`npm run lint:docs`) and read the *blocking* tally, not the finding count.
- **`/grilling`** — only if reopening DOMAIN_MAP's shape. Ruling 03 Q3 and the
  spec's stage-4 correction are live prior art; grill against those, not from
  scratch.
- **`/final-check`** at session close.

Do **not** reach for `/to-tickets`. It was considered and declined on 2026-07-26,
and the reasoning held through two more sessions: the work fits one context, the
decisions are already durable in the spec, and ticket files would be a third copy
of them — the exact failure this program exists to remove. Readiness is tracked by
the per-piece labels in ticket 13; keep them current instead.
