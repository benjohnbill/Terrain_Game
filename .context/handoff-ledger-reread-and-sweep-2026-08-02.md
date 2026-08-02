# Handoff — re-read the registers, and find out how many of the eleven are still alive

Written 2026-08-02, after a session that closed **Wayfinder gates 09 and 10** and got
`verify:game` to **exit 0 for the first time**. Commits `08d8acf` → `33ec9e3`, all
pushed.

Carries only what is **not** in the repo. Everything else is referenced by path.

---

## § 0 — Read this first, because it changes what the task IS

The task below looks like a cleanup. It is not. It is the first deliberate run of a
practice this project has already ruled into existence somewhere else, and never
applied here.

**The premise.** Registers that list *what is undecided* — `docs/SYNC-DEBT.md`,
`.scratch/l3-playable-build/DECISIONS-OWED.md`, tracker `README`s — go stale
**structurally, not by neglect.** The documentation law puts the authoritative
decision at its **birthplace** and makes every other surface a pointer. So when a
ruling lands at a birthplace, the registers that said "this is open" do not follow.
Someone must walk them over by hand, and across session boundaries that leaks.

**This is not preventable, and the project has already decided how to live with it —
for a different file.** The QUICKREF ruling (user, 2026-07-28, documentation-law
ritual duty 4) retired per-batch freshness in favour of **lock points**: re-render
deliberately at chosen moments, and let the lint report *drift size* as advisory
rather than gate. `vocab:lock`'s marker / report / `--advance` is the same shape.

**Neither is applied to the debt or decision ledgers.** That gap is registered as a
debt in `docs/SYNC-DEBT.md` ("This ledger has no way to know it has gone stale…"),
with candidate shapes recorded unranked. **Do not act on that debt** — it is
user-scope on three separate grounds, stated in the row.

**What this means for your task.** You are not cleaning a list. You are performing
the re-read, at a lock point, and — this is the part that has never been done —
**leaving a record of what you verified**, so the next re-read does not start from
zero. See § 1's third output.

---

## § 1 — The task: a read-only re-read of the eleven

`DECISIONS-OWED.md` § Part 2 lists seal-versus-seal conflicts that each block a build
ticket. **Eleven are live** (#1–#9, #11, #12), plus **#13** registered separately;
#10, #14, #15, #16 are closed and #17 is pinned. `SYNC-DEBT.md`'s twelve-row entry
carries the partial-payment note that establishes this count.

For each, answer **one question**:

> Is this still a live question, or was it decided somewhere above and nobody
> stamped the register?

Three outputs. **All read-only.**

1. **Live/dead verdict per conflict** — `live` · `dissolved by <ADR/ruling>, unstamped`
   · `needs a user ruling`. Cite the evidence, not an impression.
2. **The real ticket dependency graph** — derived from what each ticket's *contract*
   needs, not from the README's narrative table. See § 4; this is a hypothesis to
   confirm or kill, not a finding to carry forward.
3. **A verified-on record for every row you check, live or dead.** Today's audit
   re-verified `Fog INDEX Status line still says "position fog"` against the file and
   found it live — which is exactly what audit run #3 did on 2026-07-26, to the same
   row, by the same method, recording the same answer. Nobody had anywhere to write
   "checked, still true, on this date", so the work was done twice. **Break that
   cycle**: put the date and the evidence on the row.

**Stamp nothing else.** Do not close a conflict, do not move a ticket's status, do not
touch a `Status:` line. The separation between *diagnosis* and *execution* is the whole
reason the user approved this shape — they were explicitly wary that a sweep would
rearrange the Wayfinder/ticket structure underneath them. Diagnosis changes nothing;
present it, then let them rule.

That precedent held today: gate 09 was **diagnosed** as dissolved by ADR 0041, brought
to the user, ruled, and only then stamped. Had the order been reversed, they would have
been judging an already-altered tracker.

---

## § 2 — Why the re-read will pay: today's rate

Five statements were found stale in one day. **The table is the argument — carry it.**

| # | What the register said | What was actually true |
|---|---|---|
| 1 | "gate 09 blocks gate 10" | ADR 0041 had removed 09's whole premise |
| 2 | "gate 10 has three open residues" | The answer sat inside gate 10's **own** Gate 7 list |
| 3 | "twelve conflicts live" | #10 was ruled by CP-⑤ two days earlier |
| 4 | "deadlock candidate 3 is speculative" | Ticket 07 merged the next day; its precondition now exists |
| 5 | "ticket 13 waits on acceptance thresholds" | Gate 10 closed and supplied them |

**Zero of the five were caught by any mechanism.** Every one came from reading with
current context. That is the case for the re-read, and also the reason not to expect a
lint to replace it.

A sixth, different in kind and worth knowing: **`DESIGN-RISKS` R20 as first registered
named a hazard the code did not have** (it claimed an unfilled parity threshold meant a
host divergence "would fail nothing"; `parity.js` exits 1 on mismatch and
`capital-fall.spec.js` compares the match ending across hosts). It was corrected in
`5b357e4` with the superseded claim kept as a dated note. **A row can be false on the
day it is written** — no discharge condition or lint protects against that, only reading
the thing it points at.

---

## § 3 — Start with the fog band (#1, #4, #5, #6), and here is why

These four block **ticket 08**, which is the entrance to the last chain. They also share
a structure the others do not: each is a **three-way** conflict between
`MAGNITUDE.md` M8, the fog `RULINGS`, and **`js/intel.js` — which ADR 0041 names an
archive.**

That ADR says the archive is "not a parity comparator for behavior they never ran" and
that accepted behavior reaches L3 by re-implementation from its contract. **If that
applies, the `js/intel.js` term simply drops out of all four**, and a four-way grill
becomes one or two. That is precisely the move that closed gate 09 today.

Verify it; do not assume it. But start here — it is where the sweep is most likely to
pay, and it unblocks the most.

---

## § 4 — One unverified hypothesis, flagged so it is not inherited as fact

`.scratch/l3-playable-build/README.md` § Build dependency chain reads as a straight
line `08 → 09 → 10 → 11 → 12 → 13`. **This session read it as two branches** merging
at 12:

```
        ┌─→ 08 fog ──→ 09 eval bar ──┐
07 ─────┤                             ├──→ 12 bot ──→ 13
        └─→ 10 plans ─→ 11 matchups ─┘

03 ─────→ 04 commit-first shell        (off-chain entirely)
```

Reasoning: 10 needs the commit system (03) and battle (06c), both landed — not fog.
11 needs 10 (hard). 12 needs both branches, since `game/src/bot/index.ts` describes its
disposition as governing **recon share** and where inside the **confidence band** it
reads. 13 needs 12.

**Status: hypothesis.** The ticket files carry no `Blocked by:` lines at all — the chain
exists only in that README table, and part of its justification is explicitly review
discipline, not technique ("the demoable boundary is also the failure-localization and
review boundary"). Whether two build lanes are safe depends on whether the branches
touch disjoint modules, which nobody has checked. **Confirm or kill it before anyone
opens a second worktree.** A footnote recording the same doubt is already on the
operational-manoeuvre row in `SYNC-DEBT.md`.

---

## § 5 — If sessions run in parallel, two rules, and the reason is not theoretical

**This session was bitten by exactly this, at its start.** A concurrent session was
editing `docs/DESIGN-RISKS.md` at the same moment; an `Edit` failed with "file has been
modified", and the two sessions were one write away from clobbering each other's work
on the same task. It resolved only because the user knew the other session had just
finished.

- **One session at a time per document file.** The collision zone is
  `DESIGN-RISKS.md`, `SYNC-DEBT.md`, `DECISIONS-OWED.md`, and the tracker `README`s —
  they are what every thread wants to write.
- **Build lanes get their own worktree**, and re-check
  `/usr/bin/git rev-parse --abbrev-ref HEAD` immediately before committing.

The deeper constraint, worth stating plainly to the user if the subject returns: **the
user is the serial bottleneck.** Parallel sessions do not multiply rulings. What they
multiply is *preparation* — and preparation is most of the cost. Closing gate 10 today
took a long agent-side evidence pass and three user decisions.

---

## § 6 — The three capital rulings, triaged so no time is wasted

All three are registered in `docs/DESIGN-RISKS.md` (R17/R18/R19) with full measurements.
**They are not equivalent, and treating them as one batch wastes a session:**

- **R17** — the cheapest thing on this list. CP-② item 8's *ruling* stands; only its
  stated reason is false. The likely outcome is a Record-layer stamp naming reach
  instead of magnitude. Minutes, not a grill.
- **R18** — **cannot be decided now.** The row itself says it closes when a playtest
  judges the forward/rear fork. Preparing a dossier for it is wasted work.
- **R19** — genuinely open (is the guard's permanent conscription tax a feature or an
  accident?), and **blocking no ticket**. Take it when convenient.

---

## Already in the repo — do not restate it

Copying any of this into a document is how the fifth stale copy gets made, which is the
failure this handoff exists to fight.

- Gate 09 and gate 10 rulings → their files in `.scratch/l3-playable-seam/issues/`,
  § Resolution each.
- Risks R17–R20 with measurements, and R20's correction note →
  `docs/DESIGN-RISKS.md`.
- The `L3` name collision (a Tier-1 alias meaning two different things, with
  `alias-inject.js` feeding the wrong sense into build sessions), the deferred
  Wayfinder ADR, the `ledgerCurrency` design debt, and the two ledger drift notes →
  `docs/SYNC-DEBT.md`.
- "Reasons are load-bearing" → `DOCUMENTATION-LAW.md`, beside the ADR supersession
  protocol (mirror regenerated into `AGENTS.md`).
- Ticket and gate status → `.scratch/l3-playable-build/README.md`; the waiver table is
  the truth, not any `Status:` line.

**Two user decisions are parked and need no session** — the `L3` rename (three options
recorded) and whether to set the first `vocab:lock` baseline (recommendation on file:
not until the `L3` name is settled, or the baseline freezes a known defect). Both are
one-minute rulings whenever the user wants them. Do not turn them into work items.

---

## Verification baseline

On `main` at `33ec9e3`:

```bash
npm run verify:game   # typecheck / build:runtime / build:viewer / test:node / test:browser / parity
npm test              # root suite
npm run lint:docs     # documentation governance
```

**`verify:game` now exits 0** — six lanes PASS. This is new as of `d489336`; every
previous ticket saw exit 2 with `parity PENDING` **by design**, and that is no longer
the expected state. **A PENDING now means a threshold was added and left unfilled** —
treat it as a real signal.

Root suite **562/562**. `lint:docs` **0 blocking / 15 advisory** — the advisory tally is
expected non-zero and all 15 were triaged this session and verified spurious; driving it
to zero is not a goal (`scripts/audit-lint.js` § ADVISORY).

---

## Tooling notes that cost real time

- **Use `/usr/bin/git`.** A bare `git` here can report another worktree's HEAD.
- **`git merge -F -` does not read stdin.** Write the message to a file.
- **`rg` misses real matches** on recursive `.`/directory scope in this repo; confirm
  existence with `grep -rn`.
- **zsh eats unquoted glob flags** — write `grep -rn "x" --include="*.md"`, quoted, or
  the command dies with "no matches found".
- `npm run vocab:render` writes to `dist/`, which is gitignored — a fresh worktree has
  no dashboard until something renders one.

---

## Suggested skills

- **Not `/implement`.** Nothing here is a claimed ticket, and the task is explicitly
  read-only.
- **`/grilling`** only *after* the sweep reports, and only for what survives it. Per
  memory `terrain-game-grill-communication-style`: open with the flow map at a game
  designer's altitude, not with the detail, and use game language rather than
  engineering language. "I can't follow this" means the altitude is wrong.
- **`/doc-audit`** if the session ends up touching governed documents — but note it was
  run today (Layer 0 → 1 → 1.5) and found `0 blocking`, so a full re-run is only worth
  it after a sealing batch.
- **`/final-check`** at close. This session's shape — a plan that was restructured twice
  under user challenge — is exactly the case where reconstructing every request from the
  transcript catches what a summary drops.

## One last thing about how this session went

Two of its three planning proposals were **wrong and were corrected by the user's
pushback**, not by the agent noticing: a three-parallel-session Phase 0 whose sessions
were actually serially dependent, and a prescription (add a discharge field) that on
inspection would have caught **one** of the five stale statements it was meant to fix.
Both survived several confident paragraphs before being challenged.

The useful lesson is not "be humble". It is that **a proposal about this repo's process
should be tested against the repo's own recent history before it is offered** — the
history was sitting in `docs/audits/2026-07-26-audit-run-3.md` the whole time, and it
already contained the answer.
