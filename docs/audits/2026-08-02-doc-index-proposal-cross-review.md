# Cross-review — should document registers become machine-readable indexes?

Date 2026-08-02. Three independent reviewers, one brief, no coordination between
them. **Verdict: rejected as proposed, unanimously.** A narrow version survives
and is named in § The one survivor.

This is a **report, not legislation** (documentation-law S13). Nothing here is
sealed; every ruling it recommends stays user-scope.

## Method, so the result is auditable

The proposal came from the repository owner in conversation on 2026-08-02: move
register rows (`docs/SYNC-DEBT.md`, `.scratch/*/DECISIONS-OWED.md`, tracker
`README`s) from prose to row-level machine-readable form carrying `status`, a
timestamp, and relational pointers; then query `status: active` instead of
reading, gate on the fields, and extend the shape to **all document files**.

The brief is `.context/verify-brief-doc-index-proposal-2026-08-02.md`, committed
before any review ran so all three saw identical instructions. It was written as
a **refutation** request, not an evaluation: three reviewers who each set out to
agree produce an echo, not a cross-check. It deliberately carried no verdict from
its author.

Reviewers: a Codex CLI session (`codex exec`, read-only sandbox, fresh thread —
not the existing session, which would have contaminated independence); a
subagent on the session model; and a cold Claude Code session. Each answered the
brief's seven questions and produced three named outputs.

## Unanimous findings

| Finding | Detail |
|---|---|
| Reject as proposed | All three, independently |
| The "all document files" scope fails | 366 tracked `.md`; ~170 in `doc-registry.json`; of the ~200 unindexed, the newly-valuable set is **7 governed documents** (ADRs 0045–0047 among them). The rest is vendored agent tooling, single-use handoffs, and `.scratch/` — which is excluded by a **standing scope decision from audit run #1** (`2026-07-26-audit-run-3.md:206-210`) |
| Hand-asserted fields must never gate | A check may block only when it **asserts** a defect and a correct action reaches a **green state** (`scripts/audit-lint.js:879-896`). `ledgerCurrency` is advisory partly because a false positive has **no dismissal state** to reach |
| The nearest precedent went the other way | The QUICKREF lock-point ruling (user, 2026-07-28) retired an enforced-freshness duty as costing more than it returned. The proposal promotes staleness findings from advisory to blocking — the same model run backwards, on registers that churn harder |
| A prior ruling already refuses the core | `.scratch/doc-structure/issues/03-inventory-schema-v2.md:211-224` § Q3 — **"DERIVE, do not store"**: no `promotedTo` field, because *"a field would be a second copy of a derivable truth, hand-patched, and thus drifting by next week."* `discharged_by` is the same class and weaker — promotion was at least derivable |

## The score, and why the author's differed

The brief listed five observed stale statements and asked which the proposal
would have caught. The author had earlier scored **4 of 5**. The reviewers:

| Reviewer | Score |
|---|---|
| Codex | 0 definite · 2 conditional · 4 miss |
| Subagent | 1 of 6 |
| Cold session | 1 of 6 |

Three independent runs converge on ≈1. The cold session diagnosed the author's
error precisely: **the author measured whether a relation existed, when the
question was whether each case's staleness lived in the status field or in the
row's prose body.** Cases 3 and 4 keep status *and* pointer green — what rotted
was body text.

Case 4 is the sharpest instance. What aged was the row's stated *reason*
("speculative, because ticket 07 had not merged"). That is exactly the class the
same session promoted into `DOCUMENTATION-LAW.md` hours earlier as **"Reasons are
load-bearing"** — so the prescription failed to catch the class its own author's
law had just named.

## Where reviewers disagreed, and how it resolved

**Case 1 (gate 09 blocking gate 10).** Codex scored it catchable if blocker edges
carried stable ids. The other two scored it **uncatchable**, and verification
settles it their way: **`docs/adr/0041-…md` is `Status: Accepted`**, not
superseded. ADR 0041 removed gate 09's premise while itself remaining current, so
a "premise ADR is stamped superseded" check never fires. The structure was
*already present* — `.scratch/l3-playable-seam/issues/10-…:5` reads
`Blocked by: 02, 03, 05, 08, 09` — and 09's status was honestly `open`. **The
index would have been consistent, machine-readable, and wrong.**

**Case 3 (twelve conflicts, one closed).** Codex read it as needing twelve atomic
rows. The other two found the register was **already correct** —
`DECISIONS-OWED.md:1005` was stamped `CLOSED 2026-07-31 by CP-⑤` on the day of
the ruling. What went stale is `SYNC-DEBT.md`'s **prose restatement** of that
table. That is a single-definition violation, not an index gap, and its remedy
(delete the count, keep the pointer) is already law with an existing check kind,
`definition-restatement` (`scripts/audit-lint.js:368`), merely scoped elsewhere.

## Two stale statements this exercise found live

The brief carried six. Reviewers found two more, which is itself the strongest
evidence about the base rate.

**Seventh — a debt row false inside its own commit.** `docs/SYNC-DEBT.md:167`
claims five `war-model-build/MAGNITUDE.md` constructs "have no row anywhere…
not registered by the audit." Four of the five are in `term-inventory.json` with
sealed birthplace rows at `war-model-build/GLOSSARY.md:21-24`, added in commit
**`a3bf9a2` — the same commit that wrote the row saying they had none.** Standing
six days. Same class as R20: false when written, and no discharge condition
reaches it.

**Eighth — the last open Wayfinder gate has no live blockers.** Verified today:

```
.scratch/l3-playable-seam/issues/11-define-cutover-and-retirement.md
  Status: open
  Blocked by: 01, 05, 10        → 01 resolved · 05 resolved · 10 resolved
```

Gate 10 was sealed earlier the same day, by the session that then updated the
readiness chain to say "only 11 remains" **without reading gate 11's blocker
line.** The condition and the blindness were produced by one agent within hours.
Recorded here as a finding; acting on gate 11 is a separate decision.

## The measured cost of a *correct* field going stale

The cold session's answer to "is a wrong field worse than wrong prose?" is the
most concrete thing in this review, because the field in question was never
malformed.

`term-inventory.json`'s `Test-trust ladder` row lists
`aliases: ["L0","L1","L2","L3"]`. **That field was correct when written.** The
world then grew a second sense of `L3` (the build generation). `alias-inject.js`
therefore fed build sessions the ladder's meaning, and per `SYNC-DEBT.md:120-142`
**gate 10 spent its entire open life on that ambiguity.**

A schema-valid, enum-clean, every-check-passing field cost a decision gate its
whole life — because it replaced reading rather than prompting it.

## The proposal is not untried; it is twice-implemented and twice stale

- **`docs/DESIGN-RISKS.md`** is already `Status | Home / thread | Next to close`
  — the exact proposed triple. **R14** carries 🟡 and a discharge text
  ("Answered 2026-07-13") whose prediction was falsified on 2026-07-16 and
  registered as debt on 2026-07-17; the row is unamended sixteen days later.
  **R13** reads 🟡 while the Pivot update thirty-odd lines below in the same file
  states the crisis system is **retired** by ADR 0042. And **R20**, the brief's
  "false when written" case, was born in this file. In each, the structured cell
  is the stale part and the prose beneath it carries the truth.
- **`docs/audits/doc-registry.json`** is a 170-row typed index missing ADRs
  0045/0046/0047 and four other governed files. The only self-check,
  `dead-registry-path` (`scripts/audit-lint.js:599`), runs registry→filesystem.
  **There is no filesystem→registry check**, so a missing row is invisible by
  construction. Decay on record: 47 files unregistered between runs #2 and #3;
  7 more in the seven days since.

## Already ruled — the list nobody read

`.scratch/doc-structure/research/design-history-survey.md` § E carries the
heading **"Already considered and REJECTED/DEFERRED — do not re-propose"**.
Verified items bearing directly on this proposal:

- **#4** — `docs/SEALS.md` seal registry: **DECIDED NO by the user, 2026-07-05**.
  *"This ledger + dated in-doc seal stamps remain the mechanism."* A user ruling
  against a central machine-readable register of decision state.
- **#9** — mechanizing semantic staleness: ***knowingly* NOT mechanized**, and
  named as *"the acknowledged residual on **pain-(a), the user's original primary
  target**."*
- **#11** — per-entry sync metadata: **rejected as over-heavy.**
- **#13** — blocking hooks: **rejected.** *"Both advisory-only, never blocking."*
- **#18** — relationship field on plain-Accepted ADRs: **rejected** (anti-noise).
- **#12** — the naive heuristic of this family: **55–80% measured false-positive
  rate**, with alarm fatigue named as the documented failure mode.

Reading § E first would have made roughly half of this exercise unnecessary. It
is not referenced by `AGENTS.md`, the documentation law, or the doc-audit skill.

## The one survivor

**A blocker edge on tracker tickets. No new file, no new schema.**

- Scope `.scratch/*/issues/*.md` only — not `SYNC-DEBT`, not `DESIGN-RISKS`, not
  "all documents".
- Fields: the two that already exist, `Status:` and `Blocked by:`.
- One rule: a ticket whose status is open/needs-info while **every** id on its
  `Blocked by:` line is resolved → finding.
- Passes both gating rules: it asserts rather than guesses, and its green state is
  reachable (amend the line, or claim the ticket). Each ticket remains the
  birthplace of its own status, so there is no second copy and no dual
  maintenance.
- **It fires today**, on gate 11 (§ Eighth above).

**Ship advisory only.** The cold session proposed promoting it to blocking once
initial hits clear; § E **#13** rejects blocking hooks by name, so promotion is a
separate user ruling, not a follow-through.

Two smaller survivors, both reusing existing machinery: widen
`definition-restatement` to a ledger row that restates a register it cites
(catches case 3, no new schema); and a `verified-live: <date> — <what was
checked>` annotation, advisory, which records **reading** rather than a claim
about the world — so R20's class cannot corrupt it, and audit run #3 and this run
would not have independently re-verified the same fog row by the same method.

## Errors the reviewers found in the brief

The brief was written by an agent and asked to be checked. It was wrong about:

1. **The material omission.** The same session had already tested the
   load-bearing half of the proposal and withdrawn it, recording the result in
   `.context/handoff-ledger-reread-and-sweep-2026-08-02.md` — *"would have caught
   one of the five stale statements it was meant to fix."* The brief did not say
   so, sending three reviewers to re-derive a measurement the repo already held.
   The handoff's own closing lesson is the instruction that was skipped:
   *"a proposal about this repo's process should be tested against the repo's own
   recent history before it is offered."*
2. **"~220 registered terms"** — it is **268**, a figure the same session had
   already seen in `vocab:render` output that day.
3. **`doc-registry.json` as "a companion index of document files"** — it is a
   governed subset, deliberately excluding `.scratch/` and `.context/`, and is
   itself the strongest counter-evidence in the repo rather than solved
   background.
4. **`ledgerCurrency` framed as a check for registers generally** — `runAll`
   applies it to `docs/SYNC-DEBT.md` only.
5. **"~11 check kinds"** — right by accident. `runAll` writes 12 keys but
   `glossaryStatus` appears **twice** (`scripts/audit-lint.js:670` and `:676`),
   so the object has 11 and one entry is silently dead. Harmless today; a
   silent-drop hazard on any future edit, inside the tool that enforces the
   single-definition rule.
6. **"0 true positives in 22"** — true when written, and the tally had already
   moved to 15 advisories within hours. A live micro-instance of the problem,
   inside the row describing the problem.
7. The QUICKREF ruling chose deliberate **re-rendering at lock points**, not
   "re-reads". The distinction matters: the lock-point model as ruled applies to
   a **generated** artifact, so transferring it to a hand-written ledger is an
   analogy, not a precedent.

## What this leaves owed

None of these is taken here; all are user-scope.

- Whether to pilot the blocker-edge check (advisory), and whether promotion to
  blocking is even available given § E #13.
- Whether § E becomes a standing pre-proposal read. It is the cheapest finding in
  this review and the one that would have prevented the most work.
- `scripts/audit-lint.js`'s duplicate `glossaryStatus` key.
- `DESIGN-RISKS` R13 (🟡 against its own file's retirement statement) and R14
  (unamended for sixteen days) — both are the in-house precedent the proposal
  cited, and both are stale.
- Gate 11's blocker line, and whether the gate is in fact open.
- `doc-registry.json`'s seven missing governed files, and whether a
  filesystem→registry coverage check is wanted.

## Sources

The three reviews were produced in conversation on 2026-08-02 against the brief
named above. Their substance is consolidated here rather than archived
separately; the cold session's own write-up lived in a session-scoped scratch
path and does not survive, which is why this file exists.
