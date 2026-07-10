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
this skill never edits `.claude/rules/documentation-law.md`, never applies
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

Clean (`0 findings`) → done; this satisfies ritual duty 7 on its own.
Findings → Layer 1.

### Layer 1 — targeted judgment, or a periodic full re-harvest

- **Per-finding triage**: each finding names a `kind` from
  `scripts/audit-lint.js` (`unregistered-definition`,
  `code-contract-violation`, `numeric-restatement`, etc.). Open the
  flagged file/line and decide: fix the doc, correct the inventory row,
  or record it as an accepted/explained false positive — never leave an
  unexplained red finding.
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

- `npm run lint:docs` must end clean, or every remaining finding must be
  a verified, explained false positive.
- New/renamed/re-statused terms: patch the inventory row in the same
  batch (ritual duty 7) — index fields only, never definition text
  (single-definition rule).
- Report new-term or rename candidates to the user; never auto-register
  or auto-rename.
