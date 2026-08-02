# 14 — The session-workflow the user described: five points, to be grilled

Type: grilling
Status: open
Blocked by: —

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
