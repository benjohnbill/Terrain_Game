# 13 — Prevention over after-the-fact audit (spec pointer)

Type: task
Status: stage 1 resolved · stages 2–4 ready-for-agent
Spec: `docs/superpowers/specs/2026-07-26-governance-prevention-over-audit.md`

Governance caught drift at audit time — nineteen copied definitions found
sixteen days after they were written. The spec moves each check to the highest
rung of the enforcement ladder it can reach.

**Stage 1 LANDED 2026-07-27**: `hooks/pre-commit`, `hooks/pre-push`,
`.github/workflows/governance.yml`, and prescriptive findings in
`audit-lint.js`. Verified live — a mismatched commit is rejected in the main
checkout and in a fresh worktree. It was implemented directly rather than split
into sub-tickets: the work fit one session, no parallel agent needed it, and the
decisions were already durable in the spec, so ticket files would have been a
third copy of them.

**Stages 2–4 are open and unblocked.** Their one conflict — whether the enum
check blocks — was ruled **blocking** on 2026-07-27, and ticket 03 carries the
supersession stamp.

- Stage 2 — the `summary` column at the birthplace, plus the enum check that
  ticket 03's binding condition already requires. Apply the extended status
  dictionary (03 Q1) first, or the check fires on the strays it legalises.
- Stage 3 — extract the hand-written C-loop table, **then** generate the
  QUICKREF. Order matters: the generator would overwrite it otherwise.
- Stage 4 — strip the copied definitions from DOMAIN_MAP's 56 promoted entries
  while KEEPING their headers (promotion is derived from them, ruling 03 Q3),
  and route the four non-term sections to their layers. The rename is last,
  optional, and its blast radius is measured in the spec.

This ticket is a pointer. Read the spec, not this file.
