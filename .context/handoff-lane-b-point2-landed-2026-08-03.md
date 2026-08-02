# Handoff — lane B: point 2 landed, points 1/3/4/5 open

Written 2026-08-03, superseding
`.context/handoff-lane-b-documentation-law-2026-08-02.md` (its Task 0 is done).

**This file is a pointer, not a record.** The durable record is
`.scratch/doc-structure/issues/14-session-workflow-five-points.md` — the user's
five points verbatim, rulings R1–R7, the deferral register with triggers, and
the live-defect list. Read that first; everything below is orientation around it.

## Where things stand

Point 2 of the user's five-point workflow is **ruled and applied**. Three
commits, in order:

| | |
|---|---|
| `7c49472` | ticket 14 filed, five points verbatim |
| `dc8ec91` | R1–R7 ruled; a false `BLOCKED` corrected in three places |
| `f9f97e7` | applied: schema, 54-ticket migration, checks, reader, law |

What exists now that did not before: ticket front matter (`type` / `status` /
`blocked_by`), its schema home in `docs/agents/issue-tracker.md` § Wayfinding
operations, `DOCUMENTATION-LAW.md` § Work intake, three checks in
`scripts/audit-lint.js` (12–14), and `scripts/frontier.js`.

**Run `node scripts/frontier.js` before planning anything.** It is the point of
the whole batch: work is found by parsing front matter, so a ticket without it
is invisible rather than merely non-compliant.

Baseline at handoff: `lint:docs` **0 blocking, 20 advisory**; `npm test`
**575/575**.

## The peer lane finished

Lane A closed at **`77d892f`** ("seal the witness model, and close the four fog
conflicts"), 16/16 green — ADR 0048, fog `MAGNITUDE.md`/`RULINGS.md`, and four
Part 2 seal conflicts resolved. The tree is clean; there is no live peer to
coordinate with, and the one-session-per-file rule that shaped the last batch no
longer binds.

That lane also **discharged one of this lane's deferrals unprompted**: it
migrated ticket 08, emptied `TICKET_GRANDFATHERED`, and moved the test pin from
1 to 0. Recorded in ticket 14 because it is the first evidence that the
trigger-and-expiry notation works when a *different* session reads it.

## What is open

Ranked. Each has a fuller entry in ticket 14 — do not re-derive them here.

1. **Points 1, 3, 4 and 5 of the five points.** The main thread. Point 2's
   rulings pre-decide parts of point 1 (front matter on documents generally):
   R2's boundary — *law-derived facts to an index, self-asserted state to the
   file* — means point 1 must answer **why tickets get in-file state and
   documents do not**, against `doc-registry.json`, which is the index that
   already exists. § E #4/#11/#18 rejected the naive form three times; the draft
   answer is *a ticket is short-lived and its state is its point; a document is
   long-lived and its state is incidental*. **Start at point 3** — the only one
   with a measured cost and no prior ruling against it, and R1–R7 just built the
   map it asks for.

2. **The `/implement` delegation seam.** The user asked for "a line in the
   implement skill" and it was never ruled. `~/.claude/skills/implement/SKILL.md`
   is 14 lines and tracker-unaware — no seam like `wayfinder/SKILL.md:25`. Any
   line added must be repo-agnostic (it is a **global** skill, Tier 3). The
   user also said the concrete usage needs discussing; that did not happen.

3. **Two deferrals whose trigger has now fired** (R5, both still present at
   `77d892f`): a `Status` column on `DECISIONS-OWED.md` § Part 2, and cutting
   the build README's per-ticket `Result` column (L73) and gate-status table —
   both duplicates of state the tickets now hold. ADR 0048 closed four Part 2
   rows, which is the state the column has to express.

4. **Five live defects carry no trigger.** The user's instruction was that
   *"적용되지 않은 것들"* state when they will be discussed and when the note
   itself is deleted. The deferral table does this; the § Live defects list in
   the same ticket does not. Either give each a trigger or rule that findings
   are a different class from deferrals.

## Two takeable tickets the new checks surfaced

`ticketBlockerCurrency` fires on both, correctly:

- `.scratch/doc-structure/issues/08-registry-refresh.md` — open, blocker 01
  resolved. **Caution:** the 2026-07-15 review § H-6 records that its
  `Blocked by: 01` is *wrong on its face* (`08 → 10 → 12 → 08`), and its body is
  stale — the 9 superpowers docs it lists as unregistered are registered. Re-scope
  before claiming.
- `.scratch/l3-playable-seam/issues/12-partition-spec-handoff.md` — the **last
  open Wayfinder gate**, every blocker resolved. `grilling`, so the user must be
  present.

## Constraints that bit this session

- **Law layer is Tier 3.** `DOCUMENTATION-LAW.md` changes only by user decision;
  edit the canonical file then `npm run sync:docs-law` (never `AGENTS.md` by hand).
- **Enforcement by dependency, not instruction.** Measured: a law clause with
  nothing consuming it scored **0 of 4** (the `Summary` column, six days). Any
  new duty needs a consumer or a blocking check, or it is decoration. Written
  into the law's § Work intake.
- **A schema is void without its enforcing check in the same batch** (ticket 03).
- **Never `git add -A`** when any other session might be live. This batch staged
  60 files by explicit path and left a peer's 12 untouched.
- **`/usr/bin/git`**, not bare `git` — bare git can report another worktree's HEAD.

## Two mistakes worth not repeating

Both are the silent-drop class this tooling exists to catch, committed while
building it. Details are in `f9f97e7`'s message.

1. A whole-document `[\s\S]*?` regex in a cleanup pass **ate 340 lines** of
   ticket 14. Caught by inspecting output, reverted, rewritten line-based.
2. An id parser cut at the first em-dash and **silently dropped every blocker
   after the first** in an annotated list (`06 — …; 09 — …` → `[06]`).

The lesson that generalises: after any scripted edit over many files, diff the
line counts before committing. `git diff --numstat` and an outlier threshold
found both.

## Suggested skills

- **`/grilling`** for point 3 (and 1/4/5). HITL, one question at a time, never
  more than one grilling ticket per session (`.scratch/doc-structure/map.md`).
  Open with the flow map at the user's altitude, not the detail — the correction
  fired once this session and the recovery was to use a concrete ticket as the
  running example.
- **`/doc-audit`** if the session touches DOMAIN_MAP, a GLOSSARY, or SYNC-DEBT —
  ritual duty 7. Not needed as an opener.
- **`/final-check`** at close.
- **Not** a new tracker or a new Wayfinder: `.scratch/doc-structure/` **is** the
  documentation-governance Wayfinder.

## Read before proposing anything

`.scratch/doc-structure/research/design-history-survey.md` **§ E** — "Already
considered and REJECTED/DEFERRED — do not re-propose". Skipping it cost three
reviewers about half their effort on 2026-08-02. It is still referenced by
neither `AGENTS.md`, the law, nor the doc-audit skill, and whether it should be
is an open candidate finding in ticket 14.
