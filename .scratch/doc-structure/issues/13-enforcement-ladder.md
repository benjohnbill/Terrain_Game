# 13 — Prevention over after-the-fact audit (spec pointer)

Type: task
Status: mixed — **labelled per piece below, not per stage**
Spec: `docs/superpowers/specs/2026-07-26-governance-prevention-over-audit.md`

Governance caught drift at audit time — nineteen copied definitions found
sixteen days after they were written. The spec moves each check to the highest
rung of the enforcement ladder it can reach.

> **Read the labels, not the stage numbers.** An earlier revision of this file
> marked stages 2–4 `ready-for-agent` wholesale once their blocking ruling
> landed. That was wrong: *unblocked* is not *fully specified*, and
> `ready-for-agent` means an agent can finish without the user present. Audited
> and corrected 2026-07-27. A stage is not a unit of readiness — the pieces
> inside one stage have different labels.

## LANDED 2026-07-27 — stage 1, the enforcement ladder

`hooks/pre-commit`, `hooks/pre-push`, `.github/workflows/governance.yml`, and
prescriptive findings in `audit-lint.js`. Verified live: a mismatched commit is
rejected in the main checkout and in a fresh worktree; a clean commit passes
silently. Implemented directly rather than split into sub-tickets — the work fit
one session, no parallel agent needed it, and the decisions were already durable
in the spec, so ticket files would have been a third copy of them.

Known hole, deliberately left: `core.hooksPath` is relative, so a worktree on a
branch predating `hooks/` is ungated. CI is the backstop, which is why it is a
required rung.

## `ready-for-agent` — an agent can finish these without the user

- **The inventory enum check.** `status ∈ {AGREED, PROPOSED, rejected-recorded,
  SEALED}`, `kind ∈ {mechanism, meta}`, `verdict ∈` the S7 set. **Blocking**
  (ruled 2026-07-27), shipping with a grandfather list per the ladder's third
  invariant. This is the completion of ticket 03's binding condition — that
  ticket declares schema v2 *void* without it — not a new proposal. Domains are
  all settled in 03 Q1/Q5; the grandfather pattern is already in the tree
  (`RESTATEMENT_GRANDFATHERED`). **Note the ordering below.**
- **`## Resolved Phase 1 Decisions` → ADR.** Recording an already-made decision
  in `docs/adr/` is Tier 2, autonomous. The decisions exist and carry pointers;
  this is relocation, not judgment.

## `ready-for-human` — needs the user, not an agent

- **Apply the extended status dictionary to the law.** `DOCUMENTATION-LAW.md`
  still reads three-valued at its status-dictionary line; 03 Q1 ruled a fourth
  value (`SEALED`, the strong form of `AGREED` — SEALED implies AGREED). Law
  edit = Tier 3. **Ordering:** doing this before the enum check means the check
  needs no grandfather entries for the 10 `SEALED` rows; doing it after means it
  does. Either is fine, but pick one deliberately.
- **Strip the copied definitions from DOMAIN_MAP's 56 promoted entries.** The
  headers STAY (promotion is derived from them, ruling 03 Q3). What replaces
  each definition is a summary, and deciding what a term's summary *is* is
  judgment — several of these terms are mid-pivot.
- **`## World Direction` → `SPEC.md`.** SPEC changes only by explicit user
  decision. Diff against SPEC's existing `## Core Design Principles` first, or
  the move creates one more copy.
- **The rename.** `DOMAIN_MAP.md` → a top-level glossary, once the file does one
  job. Optional, last, and its blast radius is measured in the spec: 80 inventory
  birthplace values, 4 script/test files, the registry, the law, the AGENTS.md
  mirror, 92 markdown files. Buys naming honesty and nothing functional.

## `needs-info` — a decision is missing before anyone starts

- **The QUICKREF generator's fallback.** `summary` is **going-forward only**
  (user ruling, 2026-07-27): the column exists, an author fills it when writing
  or re-sealing a definition, and the ~260 existing terms are not backfilled.
  That leaves the generator with almost no summaries on day one, which would
  make the generated digest *worse* than the hand-curated file it replaces.
  Owed: what the generator renders for a term with no `summary`. The obvious
  candidate is a mechanically extracted first sentence from the birthplace row
  plus the pointer — an excerpt cannot drift, because regenerating updates it —
  but that is a design call for the generator, not something this ticket settles.
- **Where the C-loop translation table goes.** It must leave
  `GLOSSARY-QUICKREF.md` **before** any generator exists, or the generator
  overwrites hand-authored content on its first run. Its destination is unnamed.

This ticket is a pointer. Read the spec, not this file.
