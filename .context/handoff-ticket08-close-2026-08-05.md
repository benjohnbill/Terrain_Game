# Handoff — ticket 08 landed, and the decision program that follows

Written at the close of the session that implemented build ticket 08 (Standard
Fog + reconnaissance pricing). It supersedes
`.context/handoff-ticket08-implement-2026-08-03.md`, whose task is done.

**This file is a pointer, not a record.** Almost everything this session produced
is already in the repository and is authoritative there:

| What | Where |
|---|---|
| What landed, what did not, and why | ticket 08 § Comments |
| The inversion finding (the next grill) | `docs/SYNC-DEBT.md` § Open, **first row** |
| Two design calls no seal covers | `docs/SYNC-DEBT.md` § Open, rows 2 and 3 |
| ③ decision 9's false blanket claim, corrected | fog `RULINGS.md` ③ decision 9 |

What follows is only what those documents do not say.

## Where things stand

Ticket 08 is **implemented and merged**, and its ticket is still `status: open`.
That is deliberate and the ticket's front-door note says so: three acceptance
items are unsatisfied and none of them is code this ticket may write — one is a
value question, one is ticket 04's UI, one is a surface ③ decision 4 already
deferred. Whether those three should hold the ticket open is the user's call.

`node scripts/frontier.js` should therefore still report `08 TAKEABLE` and nothing
else in `l3-playable-build`. **If it reports nothing, someone resolved 08 without
settling those three.**

## The shape of what is left, which is the thing this file exists for

Six tickets remain (04, 09, 10, 11, 12, 13; 06 is superseded, ten are resolved).
**Every one is `needs-info`, and every one waits on a decision rather than on
implementation capacity.** So the next several sessions are grills. The frontier
goes empty the moment 08 closes.

Which `DECISIONS-OWED.md` Part 2 row gates which ticket is derivable from the
tracker. The **reading** is not, and it is what makes the work plannable:

- **#7, #8 and #9 are self-contradictions inside `CATALOG.md`/`MATCHUP.md`**, and
  **#3 is ledger-versus-prototype.** None of them is new design — each is "two
  documents disagree, pick which is true". They bundle: assemble the evidence
  once, rule several in a sitting.
- **#2 (encirclement threshold) spans three tickets** — 09, 10 and 11 — so it is
  the bundle's natural first item rather than one of its members.
- **Ticket 11 is mutually triggered with `.scratch/operational-manoeuvre/`.** That
  tracker's deletion condition *is* 11 leaving `needs-info`, and #2 is its own
  item. Neither reads alone.
- **Ticket 09 carries three items the seal deliberately left to the user** — the
  EVAL BAR's **name**, the **tactical-R composition formula**, and the **visual
  treatment**. These are authoring, not conflict resolution, and they will not
  resolve the way the bundle does. Do not schedule them together.
- **The 04/09 scoping call resizes the remaining program**, which is why it is
  worth taking early even though the user chose to open elsewhere. `DemoShell.tsx`
  (717 lines) and `eval-r.ts` (254 lines) reached `main` through the 2026-08-03
  submission lane, under deadline and without this repo's two-axis review.
  Adopt-and-harden turns two `build` tickets into `harden` tickets; replace leaves
  them as they are. Registered by a peer session in `docs/SYNC-DEBT.md`.

## The next grill — ① , the user's chosen opener

`grilling` type: **user present, one such ticket per session**
(`docs/agents/issue-tracker.md`).

The finding, so the next session need not re-derive it: the sealed band is
**invertible by a viewer who knows the reporting spread**. Twelve normal-grade
looks show a ±21.5% band — correctly saturating — while the same evidence pins the
truth to **±1.35% and keeps closing**. The consequence that matters: **at equal
commit, grinding the cheap grade beats buying the expensive one**, which is exactly
what `RULINGS.md` ④ decision 7 was written to forbid and what `MAGNITUDE.md` M8's
saturation rule exists to prevent.

**The first question is not how to fix it but whether it is a defect.** SPEC's
`skill-piercable` principle arguably endorses a player who does the arithmetic
knowing more. If that is the reading, ④ decision 7's text must be re-cut — grades
would sell *speed*, not *destinations*. If it is a defect, every repair is a new
dial (unbounded draw, per-observation spread, perturbed stored interval), and ④
decision 7 rests on "no new dial" — which is what makes the choice the user's and
not an implementer's.

Two things worth carrying in: it is **G2's own failure one level up** — G2 measured
the intersection and nobody measured the estimator — and **ticket 12's bot is a
live consumer**, since a rational agent on the same instruments does this
arithmetic by construction.

Full statement with the arithmetic: `docs/SYNC-DEBT.md` § Open, first row.

## How to organise the sessions

**Do not parallelise the grills; parallelise the reading that precedes them.**
There is one user, and `issue-tracker.md` allows one `grilling` ticket per session,
so splitting sessions across grills buys nothing. What runs without the user is
**evidence assembly**, and since most remaining rows are archaeology-then-judgment,
doing the archaeology in a separate agent-only pass makes the grill session
judgment-only.

The dossier that pass should produce, per row: what each document says verbatim,
which is newer by git history, what cites which, and what the seal chain already
constrains. **No proposals** — the judgment is the user's.

## Conditions and gotchas

- **`main` moves fast under concurrent sessions.** It gained 16 commits during this
  one, including the `demo/school-submission` merge. Re-check `git rev-parse HEAD`
  before committing, work in your own worktree, and **never `git add -A`**.
- **A `verify:game` run is only readable against a green baseline.** While
  `game/src/ui/` work is in flight elsewhere, a red `build:viewer` or
  `test:browser` lane may belong to that session, not yours — the hazard
  `docs/DESIGN-RISKS.md` R20 records. Record a baseline before merging.
- **`/usr/bin/git`, not bare `git`** — bare git returns another worktree's tip
  here. `git commit -F -` does not read stdin; write the message to a file.
- **`rg` misses real matches** on recursive directory scope here; use `grep -rn`.
- The `Terrain_Game-t08` worktree is removed once 08 is merged.

## What the fog build left running

Two self-checks worth knowing about, because both will look like bugs from inside
unrelated code:

- **`composeBand` throws on an empty intersection.** That is G3's first oracle, and
  it is load-bearing: it caught two wrong bounds during this build before any test
  did (the wear ledger's absent ceiling, and a battle's loss channel being judged
  by identity rather than by reach). If it fires, a channel moved a subject that
  the envelope does not know about. **Widen the bound; never drop the statement.**
- **`contactView` throws if a contact carries no wear testimony.** A contact is
  created *by* an observation, so this cannot happen — it guards the one path on
  which an unbounded public bound could reach a projection.
