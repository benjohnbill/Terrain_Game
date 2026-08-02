# Issue tracker: Local Markdown

Issues and specs (you may know a spec as a PRD) for this repo live as markdown
files under `.scratch/`. This matches the existing convention already in use —
see `.scratch/war-model-slice2/issues/01..10-*.md` for a worked example (the
slice-2 tracer-bullet tickets).

`.scratch/` is a Working-layer location under the repo's documentation-law: it
holds in-flight tickets and working notes, not sealed truth. Sealed design
truth lives in `docs/features/<slug>/` (Production) and `docs/adr/` (Record).
An issue file points at that truth; it never redefines a term or a dial.

## Conventions

- One feature per directory: `.scratch/<feature-slug>/`
- Design specs are authored under their feature's `docs/features/<slug>/specs/`
  (see the doc-structure map, ticket 11 routing verdict); a ticket points at its
  spec and never becomes one
- Implementation issues are one file per ticket at
  `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01` — never a
  single combined tickets file
- Triage state is recorded in the ticket's **front matter** (see § Wayfinding
  operations below for the schema and its value domains)
- Comments and conversation history append to the bottom of the file under a
  `## Comments` heading

## When a skill says "publish to the issue tracker"

Create a new file under `.scratch/<feature-slug>/` (creating the directory if
needed).

## When a skill says "fetch the relevant ticket"

Read the file at the referenced path. The user will normally pass the path or
the issue number directly.

## Wayfinding operations

Used by `/wayfinder`, which delegates here: *"consult the tracker doc's
Wayfinding operations section for how **this** repo expresses them."* This
section is that answer. Sealed 2026-08-03 (ticket 14 R1–R7); the law's
`## Work intake` points here and does not restate it.

- **Map**: `.scratch/<effort>/map.md` — the Notes / Decisions-so-far / Fog body.
- **Child ticket**: `.scratch/<effort>/issues/NN-<slug>.md`, numbered from `01`,
  with the question in the body.

### Ticket front matter

Every ticket file opens with a YAML front matter block, before the `#` title.
It is written when the file is created, not added later.

```yaml
---
type: grilling | task | research | prototype
status: open | needs-info | resolved | superseded
blocked_by: [03, 08]        # ticket numbers in this tracker; [] if none
---
```

- **`type`** is fixed at creation and never changes. `grilling` means the user
  must be present — one question at a time, and never more than one such ticket
  per session. `task` means an agent can finish it alone. `research` produces a
  survey digest; `prototype` is a throwaway build that answers a question.
- **`status`** answers one question: **can this be picked up?** Dates, branches,
  outcomes and history belong in the body, never on this line.
- **`blocked_by`** holds ticket numbers only. A blocking condition that is not a
  ticket is not written here; if it must gate the work, it becomes a ticket.

**Two states are derived, never stored:**

- *blocked* — recomputed from `blocked_by` plus those tickets' own `status`.
  Closing a ticket therefore unblocks its dependents with no second write. This
  is why `BLOCKED` is not a status value.
- *merged / landed* — git owns this. A ticket saying `resolved` says nothing
  about any branch, which is why `landed` is not a status value.

The rule behind both: **a ticket stores only what only that ticket knows.**
Anything another file already knows is derived at read time.

A ticket that would need `status: mixed` is a ticket that should be split.

### Frontier

`node scripts/frontier.js [<tracker>]` — parses front matter, derives
blocked-ness, prints what is takeable. A ticket is takeable when `status: open`
and every id in `blocked_by` is `resolved` or `superseded`; ties break by
number. A `grilling` ticket is takeable only with the user present.

### Claim and resolve

- **Claim**: no separate state. Concurrency is a branch or worktree.
- **Resolve**: append the answer under an `## Answer` heading, set
  `status: resolved`, then append a context pointer (gist + link) to the map's
  Decisions-so-far in `map.md`. Dependents unblock with no further edit.

### Enforcement

`scripts/audit-lint.js` carries three checks over `.scratch/*/issues/*.md`:
`ticketFrontMatter` (block present and parseable — **blocking**),
`ticketFieldDomains` (`type`/`status` in the domains above, `blocked_by` a
number list — **blocking**), and `ticketBlockerCurrency` (a ticket is `open`
while every id in `blocked_by` is resolved, or names an id that does not exist
— **advisory**, because the correct action may be to claim the ticket rather
than edit the line).
