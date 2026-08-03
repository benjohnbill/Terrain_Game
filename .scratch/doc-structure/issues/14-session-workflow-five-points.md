---
type: grilling
status: open
blocked_by: []
---

# 14 — The session-workflow the user described: five points, to be grilled

This ticket exists to hold the user's own statement of the documentation
workflow they had in mind, in their own words, in a place that is not
superseded by the next handoff. A handoff is replaced by construction; a tracker
issue is not.

**The block below is the input to the grill. Everything else in this file is
context around it. Do not paraphrase it, summarise it, or "clean it up" — see
§ Why the verbatim rule exists.**

## The user's five points — verbatim, unedited

The user was asked whether the 2026-08-02 session's work had been done with a
particular workflow in mind, and set it out as follows.

> 1. 문서 메타데이터 관리 및 동기화:
>    • 각 문서의 상태(status)나 타입 같은 프런트매터(front matter)가 기본적으로 적혀 있고, 문서가 노후화(stale)되는 것을 방지하도록 구성함
>    • 가이드라인 문서를 이번에 수정한 후, 이어서 스크래치 폴더 및 JSON 파일과 연결된 프런트매터를 구성함
>
> 2. 작업 티켓 생성 및 사전 조율:
>    • 실질적인 수정 사항이나 웨이파인더(Wayfinder)를 통한 게이트, 티켓 같은 것이 생성되는 순간, 그에 따른 문서 타입과 프런트매터가 실질적으로 생성됨
>    • 해당 작업의 내용과 종류에 대해서는 나와 미리 구체적인 논의(grilling) 및 상의가 완료되어 있음
>
> 3. 연관 관계 및 상태 변경 지도화 (세션 시작 전):
>    • 이번 수정이나 요청이 구체적으로 어떤 파일들과 연관되어 있는지 세션 시작 전에 어느 정도 지도가 그려짐
>    • 구체적으로 어떤 파일이 노후화(stale)될 수 있는지, 액티브 상태가 바뀌는지, 혹은 어떤 파일이 참조되어 수정되면서 나중에 날짜가 바뀌어야 하는지 등을 파악함
>
> 4. 자동 상태 업데이트 (세션 중):
>    • 세션 중에 변경 사항이 발생하면, 자동 로그 파일이나 도구를 통해 연관된 프런트매터와 스테이터스(status)가 강제로 자동 업데이트되도록 함
>
> 5. 최종 작업 점검 및 최신화 (세션 종료 후):
>    • 세션이 모두 끝나면 가이드라인 검증 도구나 별도의 린트(lint) 계열을 통해 최종 점검을 진행함
>    • 단일 세션 단위 혹은 전체 작업 단위의 점검 차원에서, 작업이 완료되었을 때 프런트매터들을 다시 한번 최신화하여 일관성을 맞춤

## What was actually running, measured against those five

Assessed at the end of the 2026-08-02 session, which touched roughly fifteen
document surfaces.

| | Present? |
|---|---|
| 1 front matter carrying status/type, staleness-resistant | **No.** Never proposed, never built |
| 2 ticket type/front matter agreed before creation | **No.** Gate files carry `Status:` / `Blocked by:` lines, but as inherited convention — the format was never agreed |
| 3 pre-session map of affected files and staleness candidates | **No.** Discovered while working |
| 4 tooling forcing status updates during the session | **No.** Every status change that day was a manual `Edit` |
| 5 post-session lint | **Yes** — `lint:docs` after every batch. Pre-existing repo tooling, not set up for this |

**One of five, and that one predates the session.** What ran instead was the
documentation law's session-close ritual, executed from memory, by hand.

**Point 3's absence has a measured cost, from that same day.** Gate 10 was
sealed; the readiness chain was updated to say "only 11 remains"; **gate 11's own
`Blocked by: 01, 05, 10` line was never read**, so it sat false for hours until
an external reviewer found it. A pre-edit blast-radius map — *what does closing
gate 10 make stale?* — makes that a one-second item. Recorded as case 8 in
`docs/audits/2026-08-02-doc-index-proposal-cross-review.md`.

## Why the verbatim rule exists

On 2026-08-02 a related proposal from the user was put to **three independent
reviewers** (Codex, a subagent, a cold session) and refuted. The report is
`docs/audits/2026-08-02-doc-index-proposal-cross-review.md`. **Read it before
grilling — with this caveat:**

The brief those reviewers saw was an agent's **compression** of the user's idea,
and it dropped the words **"도구를 통해 강제로 자동"** — automatic, tool-forced. What
they refuted was therefore *hand-asserted status fields*, a weaker proposal than
point 4 above. The same text was compressed and lost load-bearing content twice
in one day, which is why this ticket carries it unedited.

That distinction decides the whole effort:

- **Refuted:** a human types `status: active` into a row; a lint gates on it.
  Three reviewers, converging independently, scored it ~1 of 6 against real
  cases, and found it **already implemented twice in this repo and stale in
  both** (`DESIGN-RISKS`'s `Status | Home | Next to close` triple;
  `doc-registry.json`).
- **Supported:** a checker *derives* the state. All three landed there
  independently, and `03-inventory-schema-v2.md` § Q3 ruled it 2026-07-15 —
  **"DERIVE, do not store"**, because *"a field would be a second copy of a
  derivable truth, hand-patched, and thus drifting by next week."*

**Point 4 as the user wrote it sits on the supported side, not the refuted one.**
And **points 2 and 3 were never reviewed at all** — they are not in the refuted
proposal.

## Relation to the rest of this tracker

`.scratch/doc-structure/` **is** the documentation-governance Wayfinder. Do not
open a second tracker for this subject — that is the duplication the repo's law
exists to prevent. In particular **`13-enforcement-ladder.md` is already points
4 and 5's territory**.

Tracker state when this ticket was filed (2026-08-02):

```
resolved  5   01 · 03 · 04 · 05 · 06 · 07
open      3   02 (REOPENED — its ruling measured a no-op) · 08 · 11 (REOPENED)
BLOCKED   3   09 · 10 · 12   — all three read "do not execute"
mixed     1   13 enforcement-ladder
```

A live possibility worth testing early: **09 and 10 may be blocked precisely
because nobody had decided what to enforce.** If so, the five points are the
missing input, and this grill unsticks the tracker rather than adding to it.

## Read § E first — the cheapest thing in this ticket

`research/design-history-survey.md` § E is headed **"Already considered and
REJECTED/DEFERRED — do not re-propose"**. Verified items bearing directly on the
five points:

- **#4** — a central machine-readable register of decision state (`docs/SEALS.md`):
  **DECIDED NO by the user, 2026-07-05.**
- **#9** — mechanizing semantic staleness: ***knowingly* not mechanized**, and
  named as *"the acknowledged residual on **pain-(a), the user's original primary
  target**."*
- **#11** — per-entry sync metadata: **rejected as over-heavy.**
- **#13** — blocking hooks: **rejected.** *"Both advisory-only, never blocking."*
- **#18** — relationship fields on plain-Accepted ADRs: **rejected.**
- **#12** — this family's naive heuristic: **55–80% measured false-positive
  rate**, alarm fatigue named as its failure mode.

Not reading § E cost three reviewers roughly half their effort. It is referenced
by neither `AGENTS.md`, the documentation law, nor the doc-audit skill —
**whether it should be is itself a candidate finding for this ticket.**

## Constraints this grill inherits

- **This is Law layer.** `DOCUMENTATION-LAW.md` changes only by explicit user
  decision. The agent prepares the option space; the user rules. Adding or moving
  an `audit-lint.js` check is likewise a decided question, not an audit action.
- **A check may block only when it asserts a defect *and* a correct action
  reaches a green state** (`scripts/audit-lint.js`). `ledgerCurrency` is advisory
  partly because a false positive has no dismissal state.
- **A schema is void without its enforcing check in the same batch**
  (`03-inventory-schema-v2.md`).
- The nearest precedent, the **QUICKREF lock-point ruling** (user, 2026-07-28),
  retired an enforced-freshness duty as costing more than it returned. Any
  proposal that increases enforcement has to say why it is not that ruling run
  backwards.

## Output

A per-point ruling: for each of the five, either a specified mechanism (with its
enforcing check named, per the schema-void constraint), an explicit rejection
with its reason, or a deferral with a reopen condition. Law text changes land as
a proposed diff for the user to seal.

## Evidence

`docs/audits/2026-08-02-doc-index-proposal-cross-review.md` (three-reviewer
refutation; § What this leaves owed) · `research/design-history-survey.md` § E ·
`13-enforcement-ladder.md` · `03-inventory-schema-v2.md` § Q3 ·
`.context/handoff-lane-b-documentation-law-2026-08-02.md` (the handoff this
ticket was extracted from).

---

# Answer — point 2 only (2026-08-03, user grill)

Points 1, 3, 4 and 5 are **not** ruled here; the ticket stays open for them.
Every ruling below is the user's; the measurements are cited so a later reader
can re-run them rather than trust them.

## The two principles the rulings rest on

- **Law-derived facts belong in an index; self-asserted state belongs in the
  file.** `doc-registry.json` is not a counter-example — its `layer`/`role` fall
  out of the law (`derivedFrom: DOCUMENTATION-LAW.md`), they are not claims a
  document makes about itself.
- **A ticket stores only what only that ticket knows.** Everything else is
  derived at read time. This is 03 Q3's "DERIVE, do not store" applied to the
  tracker, and it is what disqualified `blocked` and `landed`.

## R1 — `Status:` is a routing field, consulted before, during and after a session

It answers one question: **can this be picked up?** It must therefore be
machine-readable. History, dates, branches and outcomes move to the body.

Measured: three competing dictionaries were live at once — `issue-tracker.md`
(`claimed`/`resolved`), `triage-labels.md` (five roles), and the values actually
written (neither). `claimed` had **0** uses; `needs-triage`, `ready-for-human`
and `wontfix` had **0** each.

## R2 — the field lives in the ticket file, and ships with a coverage check

Rejected: a central index of ticket state. It would make point 4's mid-session
update a second write to a second file — the dual maintenance § E #11 rejected
as over-heavy — and an index row would be the second copy 03 Q3 forbids.

The check is a condition of the schema, not a follow-up: *a schema is void
without its enforcing check in the same batch* (03). Both known architectures
failed the same way — things missing, invisibly: the in-file convention was
absent from 29 of 55 tickets because nothing scanned, and `doc-registry.json`
misses 8 governed files because `dead-registry-path` runs registry→disk only.

## R3 — YAML front matter, flat scalars, one-time migration of all tickets

Chosen over the existing bare `Key: value` lines on one criterion: **a delimited
block has a machine-findable end, so a tool can rewrite it without touching
prose.** The absence of that boundary is not hypothetical — prose had already
bled into **19 of 44** status lines.

No YAML dependency is added; a few flat scalars need a small reader, and the
repo's zero runtime dependencies stay at zero. This creates a new Law-layer
surface and is **Tier 3** — the user sealed it.

## R4 — `status: open | needs-info | resolved | superseded`

Each value was tested by one question: *does it change as a byproduct of the
work, or does it require a separate act of re-judgement?* The rot-prone ones are
exactly those needing re-judgement.

| Retired | Why |
|---|---|
| `BLOCKED` | Derivable from the blockers. Stored, it sat 15 days untouched |
| `landed` | git owns merge state. Measured: `resolved`→merge was **same-day in 5 of 6** cases, 1 day in the sixth — a value always maintained and never queried |
| `mixed` | Not a status. It is a ticket that should be split, as 06 → 06a–06e already was |
| `re-cut` | Renamed `superseded` |
| `claimed`, `needs-triage`, `wontfix` | 0 uses. Concurrency is a branch/worktree |

The de facto vocabulary was already small — seven head tokens across 44 lines,
each followed by prose. The set was named, not imposed.

## R5 — `blocked_by:` holds ticket ids only

A blocking condition that is not a ticket is not written on that line. Decision
blockers are derived **from the other end**: `DECISIONS-OWED.md` § Part 2
already records, per conflict, which ticket it bites at.

Part 2 therefore gains a **`Status` column**, so "this row is closed" sits in a
fixed place instead of inside the conflict-name cell as prose.

Two duplicates are cut: the build README's per-ticket `Result` column (ticket
status restated) and its gate-status table (the seam tracker's statuses
restated). Its R6 waiver table **stays** — that evidence has no other home.

## R6 — `type: grilling | task | research | prototype`, fixed at creation

Never changes, so it has no staleness surface. It carries real routing
information: `grilling` means the user must be present, one question at a time.
That is why `triage-labels.md`'s `ready-for-human` had 0 uses — this field
already said it. The 29 tickets without a `type` become `task`.

## R7 — the pre-agreement duty: law carries the pipeline, the tracker doc carries the schema, global skills are untouched

A law clause alone was measured and it does not work. Natural experiment: the
`Summary`-column duty entered the Vocabulary Law 2026-07-27 with no consuming
machinery. Trigger events since: `capital guard` re-sealed twice (CP-⑤
2026-07-31, CP-⑥ 2026-08-01) plus two rows added 2026-07-28. **Compliance: 0 of
4. Fill rate 0 of 121 rows.**

So enforcement comes from **dependency, not from instruction** — the rungs, with
this repo's own evidence: law clause (**0/4**) · advisory lint (17 standing,
uncleared) · **blocking lint + pre-commit/pre-push/CI** (landed 2026-07-27; the
commit is rejected) · **substrate** (the workflow reads it, so omission is
breakage, not disobedience). Front matter reaches rung 3 at no extra cost via
R2's check, and rung 4 when the session-start map becomes the way work is found.
A blocking check on a field nobody reads is pure tax; the map is what makes it
earn its keep. The two ship together.

Three homes, no global skill edit:

- **Law** — a new `## Work intake` section carrying the pipeline shape.
- **`docs/agents/issue-tracker.md` § Wayfinding operations** — the schema, value
  domains, frontier rule. `wayfinder/SKILL.md` **already delegates here**
  ("consult the tracker doc's Wayfinding operations section for how *this* repo
  expresses them"), and the law's own Working-layer row already assigns
  `docs/agents/` this role.
- **`/implement`** — has no delegation seam (14 lines, tracker-unaware). If one
  is added it must be repo-agnostic, and it is a global edit: **Tier 3, open.**

### The law text

```markdown
## Work intake

Durable work enters through the tracker, not through conversation alone.

1. Work too large for one session is charted as a Wayfinder map, whose
   children are decision tickets.
2. A ticket's **type and scope are agreed with the user before its file is
   created.** An agent creating a ticket from an instruction rather than
   from a decision says so, and asks first.
3. Front matter is written when a ticket file is created, not added to it
   later. Bringing an existing tracker onto the schema is a **one-time
   migration**, made in a single batch with its enforcing check — not a
   retrofit performed ticket by ticket. Schema and value domains live in the
   repo's tracker doc § Wayfinding operations; this law does not restate them.
4. Implementation runs from a ticket and closes with a review. The ticket
   is the unit of work; the session is not.
```

## How the clauses were verified

Three subagents planned real work from the four clauses alone, blind to any
criteria, with "front matter" appearing nowhere in their task text and the
tracker doc reachable only by following clause 3's pointer. The rubric was
written and fixed **before** any result arrived. Entry paths: undesigned new
work · an instruction to create a named file · picking up existing work.

All three reached the designed preparation; all three stopped for clause 2.
**Verdict: sufficient with one named gap.** Clause 3 originally read "never
retrofitted", which two runs independently identified as forbidding the very
migration R3 rules, and the third demonstrated live — running the frontier
procedure literally returned the **empty set**, since no ticket carries front
matter yet. The wording above is the fix.

Honest limit: clause 2 held 3 of 3, but the law section was the salient text in
those prompts. What is shown is that the wording works **when read** — not that
it will be read. Whether placement drives the Summary column's 0/4 is untested.

## Live defects the verification surfaced (all re-verified against the tree)

- **Ticket 10's status was false for seven days**, and gate 12 (a) of the L3
  build quoted it as its precondition. Fixed in the same batch. Details in that
  ticket's amendment block.
- **Ticket 08's `Blocked by: 01` is false** — review § H-6 records the cycle
  `08 → 10 → 12 → 08`; its real gate is 11. **Open.**
- **Ticket 13's two handed-over findings are fixed in code** (`audit-lint.js:423`
  now admits `undetermined`; `:871` derives the count) but still read open in the
  ticket. **Open.**
- **`doc-registry.json` misses 8 governed files** (ADRs 0045/0046/0047 among
  them), invisible because no check runs disk→registry. **Open.**
- **`audit-lint.js` has a duplicate `glossaryStatus:` key** at `:670`/`:676`.
  **Open**, and not to be minted as a ticket without agreement (clause 2).
- **`.scratch/l3-first-match/` is an orphan** — a `map.md` with zero tickets,
  unlisted in `AGENTS.md`. **Open.**

## Applied 2026-08-03

- **Law** — `DOCUMENTATION-LAW.md` § Work intake, mirrored into `AGENTS.md`.
- **Schema home** — `docs/agents/issue-tracker.md` § Wayfinding operations,
  rewritten. `wayfinder/SKILL.md` already delegates here; no global skill edited.
- **Migration** — 54 of 55 tickets across four trackers. Prose that the old
  status/blocker lines carried is preserved in each file rather than dropped.
- **Enforcement** — `audit-lint.js` checks 12–14 (`ticketFrontMatter`,
  `ticketFieldDomains` blocking; `ticketBlockerCurrency` advisory), 13 tests.
- **Consumer** — `scripts/frontier.js`. Rung 4: work is found by parsing front
  matter, so a ticket without it is invisible rather than merely non-compliant.
  This is what makes the blocking check something other than a tax.

The checks earned their place on the first run: `doc-structure/08` and
**`l3-playable-seam/12`** — the last open Wayfinder gate — both report as
takeable with every blocker resolved.

## Deferred — each with its trigger and its expiry

Per the law's deferral discipline (adopted in this batch): a parked item states
when it is picked up **and** when its own text is deleted. Nothing here is
"later".

| Deferred | Discuss when | Delete this row when |
|---|---|---|
| ~~**Part 2 gains a `Status` column`**~~ (R5) — **DISCHARGED, and it was already done.** The gate 12 session went to add it on 2026-08-03 and found the column present: lane A had added it in `77d892f` while closing the four fog conflicts, without knowing R5 had asked for it. Rows 1, 4, 5 and 6 read `closed 2026-08-03`, which satisfies the stated deletion condition exactly. **This is the second unprompted discharge by a peer session in one day** — the first was ticket 08's migration, whose row this edit removes per its own instruction. Two for two on the mechanism's first day | — | This row goes at the next edit of this table; kept once because two independent discharges is stronger evidence than one |
| **Two README cuts** (R5) — the build README's per-ticket `Result` column (L73) and its gate-status table, both duplicates | **Trigger has fired.** Both were still present at `77d892f` | Both are cut and the README points at the tickets instead |
| **Points 1, 3, 4, 5** of the user's five | Next grill session on this ticket. Point 3 first — it is the only one with a measured cost and no prior ruling against it | All five are ruled and this ticket resolves |
| ~~**`/implement` delegation seam**~~ — **DISCHARGED 2026-08-03 (user decision).** The trigger fired the way it was written: a ticket was implemented through `/implement` during the Wayfinder gate 12 batch and the gap bit — the skill never asked which ticket, and the documentation law's § Work intake clause 4 (*"implementation runs from a ticket and closes with a review"*) had no representation in it. One repo-agnostic line was added to `~/.claude/skills/implement/SKILL.md`: *"If the repository documents an issue tracker, read its conventions before starting, implement from a named ticket, and record the outcome there."* It works where a tracker is documented and is harmlessly inert where none is. **Not** taken: a second line on branch policy — branch conventions differ per project, so that judgment stays with the agent's own rules | — | This row goes at the next edit of this table |

## Live defects, still open

Each is verified against the tree; none is minted as a ticket, because clause 2
now forbids creating one from a finding rather than from a decision.

- **Ticket 08's `Blocked by: 01` is false** — review § H-6 records `08 → 10 → 12
  → 08`; its real gate is 11. Not corrected here: the file is held out.
- **Ticket 13's two handed-over findings are fixed in code** (`audit-lint.js`
  now admits `undetermined`; the clean line derives its count) but read open.
- **`doc-registry.json` misses 8 governed files**, invisible because no check
  runs disk→registry. The ticket-front-matter check is the shape that would fix
  it, applied to the registry.
- **`audit-lint.js` has a duplicate `glossaryStatus:` key.** Untouched
  deliberately, though this batch edited the very object it sits in.
- **`.scratch/l3-first-match/` is an orphan** — a `map.md` with zero tickets,
  unlisted in `AGENTS.md`, and now visibly empty in `frontier.js` output.
