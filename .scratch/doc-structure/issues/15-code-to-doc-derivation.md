---
type: grilling
status: open
blocked_by: []
---

# Code→doc derivation — the tracker has never looked at the code

**Why this exists.** On 2026-08-04 two `needs-info` tickets were found to have
working implementations sitting on `main`, landed by a different lane under a
submission deadline. Neither ticket knew. The case, its evidence, and its
per-ticket notes are recorded once in `docs/SYNC-DEBT.md` § Open (row: *Tickets
04 and 09 describe work whose code is already on `main`*) and in the bodies of
`.scratch/l3-playable-build/issues/{04,09}-*.md`. **This ticket does not restate
them** — read them there. This ticket owns only the general question.

## The shape of the gap

The tracker's derivations are real and they work:

- `scripts/frontier.js` derives blocked-ness from **other tickets'** front matter.
- `scripts/audit-lint.js` audits **documents against documents**.

Nothing derives anything from the **code**. So `frontier.js` printing
`TAKEABLE 04` never asserted "no implementation exists" — it asserted "this tool
did not look", which is the survey-silence failure the global rules already name.

The asymmetry that makes this recur: **code moves inside a session; a ticket
moves only when someone edits it.** Under time pressure the code goes first and
the ticket does not follow. That is structural, not carelessness, so a duty
clause will not fix it — this repo measured a clause with nothing consuming it at
**0 of 4** on 2026-08-03 (`AGENTS.md § Work intake`, the `Summary`-column case).
The pattern to reach for first is enforcement by dependency.

Note what is *not* broken: the front matter. `status` answers one question — can
this be picked up? — and it answered correctly throughout. The schema also
already states the cure in principle: *anything another file already knows is
derived at read time* (`docs/agents/issue-tracker.md` § Ticket front matter).
The principle exists; the deriver for code→doc does not.

## What to grill

One at a time, with the user present.

**Q1 — Does a ticket declare its intended artifacts?** The obvious mechanism is
for a ticket to name the paths it expects to produce, and for a check to fire
when they already exist. The obvious objection is the schema's own rule: *a
ticket stores only what only that ticket knows.* The grill is whether an intended
deliverable path passes that rule (it is arguably knowledge no other file holds)
or fails it (paths are decided at build time, so the field would rot faster than
the ticket). **This fork decides everything downstream** — a declaration model and
a heuristic model share no implementation.

**Q2 — If not declaration, what does the deriving?** Candidates worth pricing,
not adopting: a git-history probe at frontier time; a claim-time check rather
than a read-time one; a session-close comparison; a human step in `/implement`.
Each answers a different question about *when* the divergence must surface.

**Q3 — Which failure is this actually preventing?** Two were live in the trigger
case and they may need different mechanisms: (a) the same thing gets built twice;
(b) unreviewed code is silently adopted as a foundation later tickets plug into.
(b) is the more expensive one and the harder to see.

**Q4 — Blocking or advisory?** The repo carries precedent for both and an
explicit position that lint findings are reports, never legislation. A check that
blocks a takeable ticket is a strong instrument; decide deliberately.

## Out of scope

Building the tool. Once Q1–Q4 are ruled, the implementation becomes its own
`task` ticket with the ruling as its contract. Also out of scope: the ticket-04
scoping call itself (is `DemoShell.tsx` the deliverable or a probe?) — that is
the user's decision on that ticket, registered separately, and this ticket must
not pre-empt it.
