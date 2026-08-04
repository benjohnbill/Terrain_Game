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

## Live cases

Evidence for the grill, not proposals. Added as they occur.

**Case 1 is the trigger case** — build tickets 04 and 09 describing work whose
code was already on `main`. It is numbered here so this list is complete, and it
is **not restated**: it lives in `docs/SYNC-DEBT.md` § Paid (the row *Tickets 04
and 09 describe work whose code is already on `main`*, paid 2026-08-05 on the
scoping half) and in those two tickets' bodies, per § Why this exists above.

**Case 2 — a feature's front door went two events stale, and the duty that owns
it has no consumer (2026-08-05).** The session that ruled build ticket 04 stamped
`docs/features/fog-of-war-discovery/RULINGS.md` ② and never touched that
feature's `INDEX.md`, which still read *"Not yet built … `open` and takeable as
of 2026-08-03"* while build ticket 08 was `resolved` and merged. It was also
missing the decision-grade finding ticket 08's own review had raised against that
feature's seal. A cold reader arriving at the front door would have gone looking
for finished work, and would have read shaken values as settled. Caught by
`/final-check`, not by any check.

What makes it evidence rather than an anecdote is that **the same batch ran a
clean control**. Three session-close duties fired; the two with a consumer were
caught and the one without was not:

| Duty | Consumer | Outcome |
|---|---|---|
| Register a new term (ritual 7) | `headerDiff` — **blocking** | caught pre-commit, fixed |
| Mark a paid ledger row (ritual 6) | `ledgerCurrency` — advisory | caught, row moved to Paid |
| Stamp superseded seals (ritual 5) | `adrStampDuty` | passed |
| **Refresh a touched feature's INDEX (ritual 3)** | **none** | **missed** |

This bears on three of the questions above.

- **Q2 (what does the deriving).** An INDEX-freshness check is one instance of
  the git-history-probe candidate, and the machinery already exists —
  `scripts/audit-lint.js:783` runs `git log --since=30.days` for
  `ledgerCurrency`. The work is roughly thirty lines. **That is precisely why it
  was not built ahead of this grill**: cheap to build is not the same as decided,
  and building it first would have picked Q1's fork by default.
- **Q3 (which failure).** This is a third failure mode beside the two recorded —
  not "built twice" and not "unreviewed code adopted as a foundation", but
  **a Projection-layer surface silently outrunning what it describes**. It may
  want the same mechanism or a different one.
- **Q4 (blocking or advisory).** A diff-based INDEX check can only see that the
  file changed, never that it is *accurate*, so it is silenceable by a cosmetic
  edit — the `ledgerCurrency` kind, not the `headerDiff` kind. Worth weighing
  against the standing position that findings are reports.

**Deliberately not acted on.** No ticket was created and no check was written:
n=1, the measured cost was a few hours of a stale front door caught at session
close, and the repo's own bar for some clauses is a third independent case. If a
second instance appears, note it here rather than re-deriving the argument.

## Out of scope

Building the tool. Once Q1–Q4 are ruled, the implementation becomes its own
`task` ticket with the ruling as its contract. Also out of scope: the ticket-04
scoping call itself (is `DemoShell.tsx` the deliverable or a probe?) — that is
the user's decision on that ticket, registered separately, and this ticket must
not pre-empt it.
