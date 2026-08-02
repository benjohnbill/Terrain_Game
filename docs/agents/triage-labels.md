# Triage Labels

> **Rewritten 2026-08-03 (Wayfinder gate 12 batch).** This file described five
> label strings written on a bare `Status:` line. Both halves of that are gone:
> ticket 14 **R1/R3** moved state into YAML front matter, and **R4** cut the
> vocabulary to four values after measuring that three of the five labels here
> had **0** uses. `scripts/audit-lint.js:475` now rejects anything else. The
> table below is kept as a *translation* for skills that speak the old roles —
> it is not a vocabulary this repo writes.

The skills speak in terms of five canonical triage roles. This repo uses a
**local-markdown** tracker whose state lives in each ticket's front matter:

```yaml
---
type: grilling | task | research | prototype
status: open | needs-info | resolved | superseded
blocked_by: [<ticket ids>]
---
```

Schema, value domains and the frontier rule are defined once, at
`docs/agents/issue-tracker.md` § Wayfinding operations. This file does not
restate them.

## Translating the five roles

| Role in mattpocock/skills | What it maps to here | Note |
| ------------------------- | -------------------- | ---- |
| `needs-triage`            | *(nothing)*          | Retired, 0 uses. A ticket is not created until its type and scope are agreed with the user (documentation law § Work intake, clause 2), so there is no untriaged state to name |
| `needs-info`              | `status: needs-info` | Survives unchanged — something the ticket needs is undetermined or in conflict |
| `ready-for-agent`         | `status: open` with `type: task` | Retired as a value, 0 uses under that name. R4's test: it required a separate act of re-judgement, so it rotted. Its job is done by the **absence** of `needs-info` |
| `ready-for-human`         | `type: grilling`     | Retired, 0 uses — the `type` field already said it, which is why nobody ever wrote the label |
| `wontfix`                 | `status: superseded`, or no ticket at all | Retired, 0 uses |

When a skill mentions a role (e.g. "apply the AFK-ready triage label"), read the
middle column and write **front matter**, never a `Status:` line.

Finding takeable work is a derivation, not a lookup: `node scripts/frontier.js`
parses the front matter across every tracker and reports what is takeable. A
ticket without front matter does not appear there at all.
