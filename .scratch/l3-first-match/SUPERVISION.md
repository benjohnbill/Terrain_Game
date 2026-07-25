# Supervising a Build You Cannot Read

Layer: Working. Designed 2026-07-25 in answer to a question the user asked
directly, and recorded because the answer is governance, not ticket detail.

## The question

*"코드 단위로 넘어가면 솔직히 난 코드를 잘 몰라. 읽을 줄도 모르고, 큰 로직 단위로
흐름을 읽으며 해석하는 것도 못 하거든. … 네가 제시한 표 하나에만 의존해서 '이제
웬만한 건 다 해결됐다'고 정리하기에는 지금 상황이 굉장히 조심스럽고 우려돼."*

The worry is specific and correct: once wiring starts, an agent that hits a gap
mid-implementation will tend to fill it, and the person who would catch that
cannot read the artifact where it happens.

## Why real-time watching is the wrong answer

It is the intuitive fix — sit and watch, interrupt on "이거 좀 이상한데?" — and it
is the weakest option available, because it asks the user to monitor a stream they
have said they cannot read. Missing things becomes the default, and the cost lands
on the one resource the project cannot manufacture: the user's attention.

The alternative is **arrangement, not attention**: build the work so that a
violation is forced to surface somewhere the user *can* read, whether or not
anyone is watching at that moment.

## The four layers

### 1. Values are exiled from code, and a lint enforces it

Every dial and constant lives in exactly one declared place, and rule modules
carry **no numeric literals**. The moment a value is invented, it cannot hide
inside logic — it appears as a new row in a file the user reads.

Not left to diligence: a lint check fails the build when a rule module contains a
numeric literal. The machinery already exists (`scripts/audit-lint.js`, the
`write-lint` PostToolUse hook, the blocking `code-contract` check); this is one
more check, not a new system.

This is the load-bearing layer. It converts *"I cannot read code"* into *"I read a
table of forty numbers"*, and it converts the decision table from a one-off
document into **the only place code can get a value from**.

It also happens to fix the agent's side of the same problem. Scattered values mean
searching, and a failed search is precisely when filling one in becomes tempting.
With a single source, "this value does not exist" becomes cheap to establish and
cheaper than inventing — the economics of the temptation invert.

Undecided, and noted as fog on the map: whether the single source is a birthplace
document with a generation step (which the documentation law prefers, since values
belong at their birthplace) or a values file the documents point at (easier for
code to read). The count of values decides which is practical.

### 2. Autonomous judgments accumulate in a one-line ledger

The citation duty from the design-problem workflow, mechanized. Anything handled
autonomously appends one line: what was done, which seals were assembled, and
that **zero** new values or rules were written. The user reviews a list of one-line
entries, never code. A row that cannot produce its citation list is itself the
evidence of a violation — the check needs no code reading to run.

Worked precedent, both from 2026-07-25: the land-derived decay engine was built by
assembling D5.1/D5.2/D5.3 + D6.2/D6.4 + OG-①/AB-②/MT-② with no new values (a
legitimate row); the 판세 display conflict went to the user instead (correctly not
a row).

### 3. Questions register and work continues, but a ticket cannot close with one open

This resolves the tension between *"stopping at every conflict means nothing gets
built"* and *"nothing may be decided over the user's head"*. A ticket carries its
open questions forward and keeps working; it simply **cannot reach `resolved`**
while any remain unanswered.

So progress does not stall, nothing gets sealed silently, and review batches at
the **ticket boundary** rather than per conflict — which is also the demoable
boundary and the failure-localization boundary, so it is where review belongs
anyway.

### 4. An adversarial reviewer reads the code, and reports in Korean

This is the honest use of subagents: not summarizing documents *for the agent*, but
auditing code *for the user*. One reviewer per build ticket with a single charge —
find every place in this diff where a decision is embodied that no seal traces to.
It does the reading the user cannot, and its output is prose the user can.

`/code-review`'s Spec axis already exists; "unauthorized design decision" becomes a
standing review dimension rather than a new tool.

### The final audit is the play session, and the user can run it

The destination pays off here. Because this map ends in a played match, a wrong
value is not something to catch by reading — it is something that **feels wrong**.
"정찰 가격이 말이 안 되는데" is an audit the user is fully equipped to perform, and it
was going to happen anyway.

## What this does not catch

One scenario passes all four layers: an implementation that invents no number,
cites seals plausibly, survives review, and plays without feeling wrong — while
being subtly not what the user meant. No mechanism catches that. The only defence
is the play session and the user's taste.

Stated plainly so the layers are not oversold: **the decision table is the first of
four layers, not the whole answer.** The user's caution about relying on it alone
was well placed; three more layers are what make it thick enough.

## Status

Designed and agreed in conversation, **not yet built**. Each layer is a concrete
piece of work:

| Layer | Work | Owner |
|---|---|---|
| 1 | the numeric-literal lint check; the values single-source (shape undecided — map fog) | a build ticket, before or with ticket 01 |
| 2 | the autonomy ledger file + the append duty in the runbook | the runbook |
| 3 | the status-lifecycle rule (already partly present: a design gap returns a ticket to `needs-info`) | the runbook |
| 4 | the standing review dimension | `/code-review` invocation per ticket |
