# Handoff — documentation governance: audit run #3 → commit-time enforcement

**Session:** 2026-07-26 → 07-27. Started as `/doc-audit`, became a design pass on
why the documentation law was losing, then landed the first half of the fix.
**Repo state at handoff:** `main` @ `fc78c4f`, working tree clean,
`npm run lint:docs` 0 blocking, 493/493 root, 161/161 game.

> **Location note.** This lives in `.context/` rather than a temp dir, against
> the `/handoff` skill's default. `.context/` is tracked on purpose — the law was
> amended for this exact reason on 2026-07-26 (`db11299`), because untracked
> handoffs are invisible to worktrees, and because a decision that lives outside
> the repo is a decision that gets lost.

## Read these first — they are the actual record

Do not reconstruct any of it from this file.

| What | Where |
|---|---|
| The audit's findings, corrections, and what it deliberately left | `docs/audits/2026-07-26-audit-run-3.md` |
| The four-stage program, its measurements, prior-art conflicts | `docs/superpowers/specs/2026-07-26-governance-prevention-over-audit.md` |
| **What is pickupable right now, labelled per piece** | `.scratch/doc-structure/issues/13-enforcement-ladder.md` |
| Prior rulings this territory already has (03 is binding, 09/10 blocked) | `.scratch/doc-structure/` tickets 02, 03, 09, 10, 11 + `docs/audits/2026-07-15-doc-structure-review.md` |
| Open debts, including this program's | `docs/SYNC-DEBT.md` |

Nine commits, `0411378..fc78c4f`. Read the messages — they carry the reasoning,
including two self-corrections.

## The one idea worth carrying over

The law forbade copying a definition into `DOMAIN_MAP.md`. Nineteen entries do it
anyway, found sixteen days late. The user's diagnosis is the design lesson:
**for the person writing a document, filling in both places is the
safer-feeling act.** A rule asking an author to pick the
less-complete-looking option every time will lose.

The same repo solves the same problem the other way. `DOCUMENTATION-LAW.md` →
`AGENTS.md` is its longest, most copy-prone text and has *never* drifted, because
a script generates it and lint checks it. Prohibition: 19 failures. Generation: 0.

So: **where a surface can be generated, generate it; reserve prohibition for what
cannot.** And move each check to the highest rung of the ladder it can reach
(structurally impossible → caught as written → commit/push/CI → periodic audit).

## What landed

Stage 1, the enforcement ladder. `hooks/pre-commit`, `hooks/pre-push`,
`.github/workflows/governance.yml` — each invoking `npm run lint:docs` and
nothing else. `core.hooksPath` is set in this repo. Plus `audit-lint.js` check 9
(`definitionRestatement`) and prescriptive finding messages.

Verified live, not asserted: a mismatched commit is rejected in the main checkout
and in a fresh worktree; a clean commit passes silently; the last five commits of
this session went through the gate.

**Three invariants are sealed** (user, 2026-07-26) and constrain future work:
single entry point (no check logic in any hook), two-second pre-commit budget,
and every new blocking check ships with a grandfather list.

## Trip-wires — things that will bite you

- **`game/dist` staleness reads as broken code.** Merging 06a made 35 game tests
  fail with `undefined` fields. The sources were correct; `game/dist` was from
  2026-07-25 and the tests load the emitted runtime graph rather than
  transpiling. `npm run build:runtime:game` after any `game/src` merge. Diffing
  the merge result against the branch (only 06c's `battle.ts` differed) is what
  proved the merge itself was clean.
- **The hook has a known hole.** `core.hooksPath` is relative, so git looks for
  the hook inside each worktree's own checkout. A worktree cut from current main
  is gated; the stale `war-model-slice2-ticket07` worktree has no `hooks/` and
  committed a probe silently. Left relative deliberately (an absolute path breaks
  invisibly if the repo moves). **CI is the backstop for this, not a nicety.**
- **`pre-commit` does not fire on merge commits at all.** Verified. That is why
  `pre-push` exists and is the real gate — a merge is how Codex branches reach
  `main`.
- **`.scratch/doc-structure/` is read-order step 6 and was skipped.** Both the
  audit and the spec's first draft were written without it, and both were wrong
  as a result (details in the audit's § Correction and the spec's § Prior art).
  Ticket 03 is **binding** and ticket 09/10 are **blocked** — read them before
  proposing anything in this territory.
- **The advisory tally is meant to stay non-zero.** `ledgerCurrency` guesses; all
  ten current findings were verified spurious with every debt genuinely unpaid.
  Driving it to zero is not a goal. `--quiet` exists so the hooks do not print it
  on every commit.
- **`rg` gives false negatives in this repo** on recursive `.`/dir scope. Use
  coreutils `grep -rn` to decide whether something exists.
- **Bare `git log` can report another worktree's tip.** Use `/usr/bin/git` and
  `rev-parse`/`show -s` for merge verification.

## What to do next

`.scratch/doc-structure/issues/13-enforcement-ladder.md` is the authority.
Readiness is labelled **per piece, not per stage** — an earlier revision labelled
whole stages `ready-for-agent` by reading "unblocked" as "fully specified", which
was wrong and is corrected there. Do not re-derive the labels; read them.

**Pickupable now (`ready-for-agent`), highest value first:**

1. **The inventory enum check** — `status ∈ {AGREED, PROPOSED,
   rejected-recorded, SEALED}`, `kind ∈ {mechanism, meta}`, `verdict ∈` the S7
   set. Blocking (ruled 2026-07-27), with a grandfather list. This completes
   ticket 03's binding condition, which declares schema v2 *void* without it.
   Check the ordering note in ticket 13 first: applying the law's fourth status
   value before the check means fewer grandfather entries.
2. **`## Resolved Phase 1 Decisions` → ADR** (Tier 2, autonomous).

**Needs the user (do not start these AFK):** applying the extended status
dictionary to the law, stripping DOMAIN_MAP's 56 copied definitions (headers
STAY — promotion is derived from them, ruling 03 Q3), moving `## World Direction`
into SPEC, and the rename.

**Needs one decision before anyone starts:** what the QUICKREF generator renders
for a term with no `summary` (the column is going-forward only, so day one has
almost none — a generated digest could be *worse* than today's hand-curated
file), and where the hand-written C-loop table goes (it must leave
`GLOSSARY-QUICKREF.md` **before** any generator exists).

## Elsewhere in the repo, unrelated but in flight

Ticket 06a merged at `e52032d`. **Codex's final review pass was cut short by its
session limit** — the narrowed re-check of its Critical/Important findings and
three Minors is still open, plus the whitelist default-deny, mixed-actor replay
acknowledgement scoping, and R18 doc-placement checks. The user's call was to
land it and resume the review against these commits in a separate session. The
`codex/ticket-06a-field-army` branch and `/tmp/terrain-game-ticket-06a` worktree
still exist; `mockup/fog-veil` is also unmerged and untouched by this session.

CI has never run — the workflow file exists but nothing has been pushed. Its
first push is its first execution.

## Suggested skills

- **`/doc-audit`** — for anything in this territory. Start at its Layer 0
  (`npm run lint:docs`), and read the last line's *blocking* tally, not the
  finding count. Its Layer 1 cross-check discipline is what stops an
  inventory-row drop from re-breaking lint.
- **`/tdd`** — for the enum check. Every check in `audit-lint.js` was built this
  way and `tests/audit-lint.test.js` (51 tests) is the fixture-literal shape to
  match: small literal inventories and three-line surfaces, asserting finding
  `kind`/`term`/`path`, never implementation.
- **`/code-review`** — before landing the enum check. A blocking check's false
  positive now costs a rejected commit rather than a noisy audit, so the bar is
  higher than it was.
- **`/final-check`** — at session close, to catch requests dropped mid-thread.
  This session's own scope moved three times.
- **`/grilling`** — only if reopening the QUICKREF or DOMAIN_MAP shape. Both have
  live prior rulings; grill against those rather than from scratch.

Do **not** reach for `/to-tickets` on the remaining stages. It was considered and
declined this session: the work fits one context, no parallel agent needs it, and
the decisions are already durable in the spec — ticket files would be a third
copy of them, which is the failure this program exists to remove.
