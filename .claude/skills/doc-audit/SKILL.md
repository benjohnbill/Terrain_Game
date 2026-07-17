---
name: doc-audit
description: Run and triage this repo's documentation-governance audit — the term-inventory.json / doc-registry.json baselines and npm run lint:docs. Use when closing a session that touched docs/DOMAIN_MAP.md/GLOSSARY files/SYNC-DEBT.md (documentation-law ritual duty 7), when npm run lint:docs reports findings that need triage, or when a periodic full re-harvest is due (several terms registered without an inventory patch, or it's been a while since the last dated report in docs/audits/).
---

# doc-audit

Codifies the audit procedure validated by two manual runs
(`docs/audits/2026-07-10-terminology-audit.md`,
`docs/audits/2026-07-10-audit-run-2.md`) per design spec S8/S9
(`docs/superpowers/specs/2026-07-10-doc-audit-and-forensics.md`). Findings
are always **reports, never legislation** (S13, separation of powers):
this skill never edits `DOCUMENTATION-LAW.md`, never applies
a rename, and never registers a new term without the user's sign-off. It
checks, drops what's provably spurious, and files new-term/rename
candidates as recommendations for the user to seal.

## Escalation ladder (S8)

Always start at Layer 0. Only climb when Layer 0 leaves something
unresolved.

### Layer 0 — script, no LLM

```bash
npm run lint:docs
```

Read the last line, not the finding count. It reports two tallies, and
they are not the same thing:

- **blocking** — a check asserting a defect it can prove. Non-zero sets
  the exit status, and is what the `write-lint.js` PostToolUse hook
  surfaces on a governed edit. Take these to Layer 1.
- **advisory** — a check that guesses or reminds (`ledgerCurrency`
  today). These print, never gate, and are **expected to sit non-zero**:
  a fuzzy commit match has no way to be marked dismissed, so driving the
  advisory tally to zero is not a goal and not a definition of done.

`0 blocking` → duty 7 is satisfied on its own, whatever the advisory
tally says. `clean (8 checks, 0 findings)` → nothing outstanding at all.
Any blocking finding → Layer 1.

Which checks sit in which tally is a decided question, not a default —
`ADVISORY` in `scripts/audit-lint.js` carries the rule and
`docs/SYNC-DEBT.md` the per-check rationale. Moving a check between
tallies is a change to what the audit enforces: propose it, don't do it
to get a run green.

### Layer 1 — targeted judgment, or a periodic full re-harvest

- **Per-finding triage**: each finding names a `kind` from
  `scripts/audit-lint.js` (`unregistered-definition`,
  `code-contract-violation`, `numeric-restatement`, etc.). Open the
  flagged file/line and decide: fix the doc, correct the inventory row,
  or record it as an accepted/explained false positive — never leave an
  unexplained **blocking** finding. An advisory finding is a prompt to
  verify, not a red gate: confirm it (act, e.g. mark a paid ledger row
  `[x]`) or judge it a false match and leave it standing. Leaving a
  verified-spurious advisory in place is the correct outcome, not a
  loose end.
- **Cross-check discipline (the run-#2 lesson)**: before dropping ANY
  term-inventory row on a report's recommendation, grep the term across
  ALL definition surfaces `checkHeaderDiff` scans (`DOMAIN_MAP.md` +
  every `docs/features/*/GLOSSARY.md`) — not just the row's stated
  `birthplace`. A term can be promoted to a second surface without its
  inventory row ever being updated to say so; dropping the row still
  leaves a live header elsewhere, which lint immediately re-flags. Run
  `npm run lint:docs` again after every inventory edit, before moving to
  the next one.
- **Periodic full re-harvest** — follow `docs/audits/HARVEST.md`'s Ring A
  procedure verbatim: sweep DOMAIN_MAP + GLOSSARYs + model docs + RULINGS
  + QUICKREF, dedupe by birthplace priority, classify `kind`
  (mechanism/meta) for anything new, carry forward `verdict`/`verdictRef`
  for unchanged canonical names (S7), reconcile `doc-registry.json`
  against the actual file tree. Write a dated
  `docs/audits/YYYY-MM-DD-audit-run-N.md` report — the two existing
  reports are the shape to match (headline, corrections, gaps closed,
  what was deliberately left alone, next). Update `docs/SYNC-DEBT.md` if
  the run pays or discovers a debt.

### Layer 2 — history, only when Layer 1 can't resolve it from current file content alone

- `git log -p -- <file>` / `git blame` to find when and why a term or row
  diverged.
- claude-mem search (`mem-search` skill / `smart_search`) for
  past-session rulings never written to any file.
- Use sparingly — most findings resolve at Layer 1.

## After any edit

- `npm run lint:docs` must end at `0 blocking`, or every remaining
  blocking finding must be a verified, explained false positive. A
  standing advisory tally does not hold the batch.
- New/renamed/re-statused terms: patch the inventory row in the same
  batch (ritual duty 7) — index fields only, never definition text
  (single-definition rule).
- Report new-term or rename candidates to the user; never auto-register
  or auto-rename.
