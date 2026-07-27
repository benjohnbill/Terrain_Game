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

## LANDED 2026-07-27 — the inventory enum check, and the law it enforces

`audit-lint.js` check 10 (`fieldDomains`): `status ∈ {AGREED, PROPOSED,
rejected-recorded, SEALED}`, `kind ∈ {mechanism, meta}`, `verdict ∈
{justified-coinage, standard-match, synonym-exists}` or null — null is legal
because HARVEST step 6 gives every newly sealed term a null verdict until an
audit run judges it, and blocking on that would gate sealing behind auditing.
Blocking, and the grandfather list ships **empty**.

The ordering question below was answered by taking the law first, and it paid
better than expected. `SEALED` entering the dictionary made ten off-domain rows
legal-or-fixable rather than exemptible, so instead of grandfathering fifteen
rows the batch normalized their birthplaces: `AGREED-concept`,
`AGREED-structure`, and `가안` were one concept — *name settled, values
provisional* — and every one of those rows already wrote its provisionality in
its value column, so the status word was the only thing that had to move.
combat-formula's local status dictionary, which had legislated `가안` as a
status value in its own header, is retired.

Two riders. `Blinds` could not take its ruled route (Q2's typed aliases do not
exist yet) and became `rejected-recorded`, with DOMAIN_MAP's marker `✅ → ⛔`;
both are registered in `docs/SYNC-DEBT.md`. And the ✅ predicate, which had been
`s !== 'PROPOSED'` — the "too lax" half of the 2026-07-15 marker finding — was
tightened to name its two values, which is only safe now that the enum check
guarantees the status is in the dictionary at all.

## `ready-for-agent` — an agent can finish these without the user

- **`## Resolved Phase 1 Decisions` → ADR.** Recording an already-made decision
  in `docs/adr/` is Tier 2, autonomous. The decisions exist and carry pointers;
  this is relocation, not judgment.

## `ready-for-human` — needs the user, not an agent

- ~~**Apply the extended status dictionary to the law.**~~ **DONE 2026-07-27**
  (user authorized the Tier-3 edit) — see the LANDED section above.
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
