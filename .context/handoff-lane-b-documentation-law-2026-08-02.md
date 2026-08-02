# Handoff — lane B: the documentation-law workflow the user has been describing

Written 2026-08-02. This lane is **documentation law**. A parallel lane continues
the game build (`.context/handoff-lane-a-ticket-08-fog-2026-08-02.md`); read
§ Running in parallel before touching any shared file.

> **Task 0, before anything else.** Open
> `.scratch/doc-structure/issues/14-…md` and move § The user's five points below
> into it **verbatim**. Do not paraphrase it on the way. The agent that wrote this
> handoff compressed the same text twice today and lost load-bearing content both
> times — see § Why the verbatim rule exists. A handoff is superseded by the next
> one by construction; a tracker issue is not.

---

## § The user's five points — verbatim, unedited

The user was asked whether the session's work had been done with a particular
workflow in mind, and set it out as follows. **This block is the input to the
grill. Everything else in this file is context around it.**

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

Assessed at the end of a session that touched roughly fifteen document surfaces.

| | Present? |
|---|---|
| 1 front matter carrying status/type, staleness-resistant | **No.** Never proposed, never built |
| 2 ticket type/front matter agreed before creation | **No.** Gate files carry `Status:` / `Blocked by:` lines, but as inherited convention — the format was never agreed |
| 3 pre-session map of affected files and staleness candidates | **No.** Discovered while working |
| 4 tooling forcing status updates during the session | **No.** Every status change today was a manual `Edit` |
| 5 post-session lint | **Yes** — `lint:docs` after every batch. Pre-existing repo tooling, not set up for this |

**One of five, and that one predates the session.** What ran instead was the
documentation law's session-close ritual, executed from memory, by hand.

**Point 3's absence has a measured cost, from today.** Gate 10 was sealed; the
readiness chain was updated to say "only 11 remains"; **gate 11's own
`Blocked by: 01, 05, 10` line was never read**, so it sat false for hours until an
external reviewer found it. A pre-edit blast-radius map — *what does closing gate
10 make stale?* — makes that a one-second item. It is recorded as case 8 in
`docs/audits/2026-08-02-doc-index-proposal-cross-review.md`.

## Why the verbatim rule exists

Earlier the same day, a related proposal from the user was put to **three
independent reviewers** (Codex, a subagent, a cold session) and refuted. The full
report is `docs/audits/2026-08-02-doc-index-proposal-cross-review.md`. **Read it
before grilling — but read this caveat with it:**

The brief those reviewers saw was **this agent's compression** of the user's idea,
and it dropped the words **"도구를 통해 강제로 자동"** — automatic, tool-forced. What
the reviewers refuted was therefore *hand-asserted status fields*, which is a
weaker proposal than point 4 above.

That distinction decides the whole lane:

- **Refuted:** a human types `status: active` into a row; a lint gates on it. Three
  reviewers, converging independently, scored it ~1 of 6 against real cases, and
  found it **already implemented twice in this repo and stale in both**
  (`DESIGN-RISKS`'s `Status | Home | Next to close` triple; `doc-registry.json`).
- **Supported:** a checker *derives* the state. All three landed there
  independently, and `.scratch/doc-structure/issues/03-inventory-schema-v2.md`
  § Q3 ruled it in 2026-07-15 — **"DERIVE, do not store"**, because *"a field
  would be a second copy of a derivable truth, hand-patched, and thus drifting by
  next week."*

**Point 4 as the user wrote it sits on the supported side, not the refuted one.**
And **points 2 and 3 were never reviewed at all** — they are not in the refuted
proposal.

## Where this work lives — do not create a new Wayfinder

`.scratch/doc-structure/` **is** the documentation-governance Wayfinder: `map.md`,
`research/`, and thirteen issues including **`13-enforcement-ladder.md`**, which is
already points 4 and 5's territory. Opening a second tracker for the same subject
is precisely the duplication this repo's law exists to prevent.

Its current state is not healthy, and the grill must face that rather than route
around it:

```
resolved  5   01 · 03 · 04 · 05 · 06 · 07
open      3   02 (REOPENED — its ruling measured a no-op) · 08 · 11 (REOPENED)
BLOCKED   3   09 · 10 · 12   — all three read "do not execute"
mixed     1   13 enforcement-ladder
```

A live possibility worth testing early: **09 and 10 may be blocked precisely
because nobody had decided what to enforce.** If so, the five points are the
missing input, and this grill unsticks the tracker rather than adding to it.

## Read § E first — it is the cheapest thing in this lane

`.scratch/doc-structure/research/design-history-survey.md` § E is headed
**"Already considered and REJECTED/DEFERRED — do not re-propose"**. Verified items
bearing directly on the five points:

- **#4** — a central machine-readable register of decision state (`docs/SEALS.md`):
  **DECIDED NO by the user, 2026-07-05.**
- **#9** — mechanizing semantic staleness: ***knowingly* not mechanized**, and
  named as *"the acknowledged residual on **pain-(a), the user's original primary
  target**."*
- **#11** — per-entry sync metadata: **rejected as over-heavy.**
- **#13** — blocking hooks: **rejected.** *"Both advisory-only, never blocking."*
- **#18** — relationship fields on plain-Accepted ADRs: **rejected.**
- **#12** — this family's naive heuristic: **55–80% measured false-positive rate**,
  alarm fatigue named as its failure mode.

Not reading § E cost three reviewers roughly half their effort today. It is
referenced by neither `AGENTS.md`, the documentation law, nor the doc-audit skill
— **whether it should be is itself a candidate finding for this lane.**

## Constraints the grill inherits

- **This is Law layer.** `DOCUMENTATION-LAW.md` changes only by explicit user
  decision. The agent prepares the option space; the user rules. Adding or moving
  an `audit-lint.js` check is likewise a decided question, not an audit action.
- **A check may block only when it asserts a defect *and* a correct action reaches
  a green state** (`scripts/audit-lint.js:879-896`). `ledgerCurrency` is advisory
  partly because a false positive has no dismissal state.
- **A schema is void without its enforcing check in the same batch**
  (`03-inventory-schema-v2.md`).
- The nearest precedent, the **QUICKREF lock-point ruling** (user, 2026-07-28),
  retired an enforced-freshness duty as costing more than it returned. Any
  proposal that increases enforcement has to say why it is not that ruling run
  backwards.

## Two live defects, already scoped, if the lane wants a cheap start

- `scripts/audit-lint.js` has a **duplicate `glossaryStatus:` key** at lines 670
  and 676. Harmless at runtime; a silent-drop hazard on any future edit, inside
  the tool that enforces the single-definition rule.
- `docs/DESIGN-RISKS.md` **R13** reads 🟡 while the same file states the crisis
  system is retired by ADR 0042; **R14** carries a discharge text falsified
  sixteen days ago. Both are the in-house precedent the refuted proposal cited.

Six further owed items are listed in the cross-review report § What this leaves
owed. None is taken; all are user-scope.

## Running in parallel with lane A

A concurrent session bit this repo at 09:00 today — a peer editing
`docs/DESIGN-RISKS.md` caused an `Edit` to fail, one write short of mutual
clobbering.

- **One session at a time per document file.** This lane lives in `docs/`,
  `.scratch/doc-structure/`, and `scripts/`. Lane A lives in
  `.scratch/l3-playable-build/`, `docs/features/`, and `game/`.
  **`docs/SYNC-DEBT.md` is the file both lanes will want — coordinate before
  writing to it.**
- Re-check `/usr/bin/git rev-parse --abbrev-ref HEAD` immediately before
  committing; a bare `git` here can report another worktree's HEAD.

## One scope observation, for the user rather than the agent

Most of 2026-08-02 went to documentation governance. Three gates closed, which is
real. But the game has **seven tickets left and no opponent** — `bot/index.ts`
still throws by design. The document system is scaffolding; the game is the
product. Whether this lane runs now or after ticket 08 is the user's call, but the
scaffolding is currently outrunning the product and that is worth naming.

## Suggested skills

- **`/grilling`**, after § E and the cross-review are read. Open with the flow map
  at the user's altitude, not with the detail (memory
  `terrain-game-grill-communication-style`).
- **Not `/doc-audit`** as an opener — it ran today (Layer 0 → 1 → 1.5), found
  `0 blocking`, and its findings are already in the cross-review report.
- **`/final-check`** at close.
