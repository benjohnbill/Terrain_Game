# Handoff — the Part 2 grill program, one row left (#12)

Written at the close of the session that grilled rows **#2, #9, #8 and #7**.
`main` @ **`4e70468`**, clean, `npm run lint:docs` 0 blocking.

Supersedes the `/tmp` handoff of the same day (that file was tmpfs and this is why
it moved). Everything substantive is in the repository — do not re-derive it.

| What | Where |
|---|---|
| The rows and their closures | `.scratch/l3-playable-build/DECISIONS-OWED.md` Part 2 |
| The archaeology all five rows were grilled against | `.scratch/l3-playable-build/research/part2-conflict-evidence-dossier-2026-08-05.md` |
| Today's seals | `1037ad0` · `d02e72a` · `4e70468` |

## Status

| Row | Kind | Status |
|---|---|---|
| #2 encirclement threshold | mis-citation | **closed 2026-08-05** — 2.2; sealed at `combat-formula/MAGNITUDE.md` M7 |
| #9 the matrix's third defence column | structural | **closed 2026-08-05** — column out; `MATCHUP.md` § The cede rule |
| #8 matchup filled-cell count | notation | **closed 2026-08-05** — dissolved by #9, not adjudicated |
| #7 plan effect axes | not a conflict | **closed 2026-08-05** — two layers; M8 § Consequence |
| **#12 bot decisiveness ladder** | **re-cut** | **open — the only one left** |

Three of the four closed **without a decision**: #2 was a wrong number copied from
the right row, #8 fell out of #9's arithmetic, #7 was two layers of one method read
as rivals. What actually needed the user was smaller and better: whether the rout
cliff is read on the EVAL BAR, whether abandonment is a plan card, and whether
`confidenceGain` survives as an axis.

**The law gained a clause this session, and it binds #12's re-cut.**
`DOCUMENTATION-LAW.md` § Conflict rule now carries **Derived and chosen inside one
value** (adopted 2026-08-05, promoted by user decision from three feature
instances): a sealed quantity usually carries a *derived* constraint and a *chosen*
value, **a re-cut inherits only the derived part**, and a load-bearing value's seal
says which is which. It is a different axis from the L-stamp — L says how verified a
value is, this says how free it is. #12 will set or retire rung values, so mark them
as it goes rather than at the end.

## What #12 is, and why it is not like the other four

**The birthplace already stamped its own conflict and left it open** —
`docs/features/tactical-plan-ai/RULINGS.md` § Consequence for ruling ①:

> The decisiveness ladder's top rungs (vassalization, annihilation) are
> multipolar-era objectives that ADR 0042 retired with the settlement terminus.
> Re-cutting the ladder for a single-terminus duel is **open**, registered in
> `docs/SYNC-DEBT.md`; this ruling does not settle it.

So **no archaeology is owed. What is owed is the re-cut** — a design act, not an
adjudication. Budget the session for design, not for reading.

The ladder as it stands (`RULINGS.md:16–22`), ordinal not scalar:

| Rung | Meaning | Plans |
|---|---|---|
| 5 Vassalization (속국화) | surrender harvest folds the opponent | Encirclement |
| 4 Annihilation (섬멸) | enemy field army destroyed, cannot rise | Flanking |
| 3 Advance (전진 = occupation) | take ground | Swift, Crossing, SI |
| 2 Erosion (침식) | grind the walls for a later turn | Deliberate Pressure |
| 1 Loot (약탈) | blood without folding the board | Raid |

Four things that bound the re-cut before it starts:

1. **Two rungs are named, not one.** The birthplace stamp calls **both**
   vassalization *and* annihilation multipolar-era; the Part 2 row names only
   vassalization. Do not re-cut only rung 5.
2. **Raw margin maximization is rejected by name**: "DP's low threshold 1.1 would
   always win — reproduces the grinding freeze as 'judgment'." A re-cut that
   collapses the ladder toward margin re-opens a rejected option.
3. **The selection rule is ordinal**: among *eligible* plans whose judged R clears
   the plan threshold, pick the highest rung; break ties within a rung by judged
   margin (R − threshold). Whatever replaces the top rungs has to work inside that.
4. **#2 was upstream and is now closed.** Rung 5's plan is Encirclement, whose
   threshold is settled at **2.2** (above M4's rout cliff, which is what makes
   annihilation follow from the numbers). Rung 3's Swift and Crossing read M7 too.
   The values the ladder ranks over are no longer moving.

Also worth holding: **ADR 0042 made capital fall the sole terminus**, so the honest
question is what a rational actor maximizes when the only way to win is to take one
sector. "Destroy their army" and "fold their realm" were means to a terminus that no
longer exists — but destroying the field army is still how a capital becomes
takeable, which is a different claim from being a top objective in its own right.

## How to run this grill — what worked today

**Look up every fact before asking, and start with the code.** Twice the code had
already decided and no seal recorded it: `DemoShell.tsx` ships every attack needle
at M7's values while naming M7 as its source (#2), and `battle.ts` knows exactly two
defence methods, `STRONGHOLD | DELAYING`, with no third slot (#9). Once for #7 the
code had *nothing* — no `effectAxes` anywhere — and knowing that mattered too.
**Assume the documents are wrong about the code until you have looked.**

**Count something.** Three rows closed on arithmetic rather than argument. #7 fell
when `usableValueDamage` turned out to have two `core` holders carrying different
dials, which proves the label is not the number. #8 fell when the collapsed matrix
was counted: 5 marked, 9 empty, 14 cells, and both rival readings land on 5. A
measurement ends these arguments; a well-argued paragraph does not.

**Explain from the board, not from the document tree.** The one place this session
stalled: #9 was first presented as sparse-matrix structure and column semantics, and
the user could not follow it — *"무슨 말인지 내가 이해를 못했어."* Re-presented as a
concrete turn (my border sector is about to fall; here are the four things I can do
and what each costs me), it resolved in one exchange. **A stall is an altitude
signal, not a comprehension problem.** #12 is a bot's objective function, which is
exactly the kind of subject that wants "here is the bot's turn 12, and here is what
it picks and why" over any table of rungs.

**Watch for the false-reason defect; it fired four times today.** M7's cell put two
numbers in one place and one of them got copied as the other. The dossier's own
measured fact — "`Scorched Earth`/`청야` appear 0 times in `MATCHUP.md`" — was true of
those strings and misleading as a claim, because the matrix references the tier twice
by concept; searching canonical names only is the vocabulary filter the
survey-silence guard names. ADR 0024's parenthetical still reads as condemning a
vocabulary the project later adopted for a different layer. The manoeuvre README's
option (b) cites a row that has since closed. All four were corrected at their own
locations in the batch that found them, which is the duty (`AGENTS.md` § Reasons are
load-bearing). **Evidence documents get the same scrutiny as seals.**

**Say "this is forced" out loud and move on.** Most of today was spent showing *why*
something was not a decision, which is what left room for four rows in one session.

**Bring one recommendation with one load-bearing reason, and name the objection you
are accepting.** Still the thing that produces answers. Also: when your own objection
turns out to be wrong, say so and drop it — the "half the axes have no dial, so what
does *axis* mean" worry dissolved once the answer was "the axis says what a plan
touches; a *different machine* owns how much", and stating that reframing was more
useful than the objection.

**Seal in the same session.** Three batches, three commits, all committed before the
next row opened.

## Frontier and ticket state

`node scripts/frontier.js` is the authority; as of this handoff:

- **Ticket 09 (EVAL BAR) is `open` / TAKEABLE** — #3 and #2 were its only holds.
  With ticket 04 that makes two takeable in `l3-playable-build`.
- **Tickets 10 and 11 are `needs-info` on one thing only now**: their recorded
  dependency on the operational-manoeuvre pass. All five of their Part 2 rows closed.
- **Ticket 12 is `needs-info` on row #12** — this handoff's subject.
- **09's landing is the trigger** for the deferred operational-manoeuvre ordering
  ruling (`.scratch/operational-manoeuvre/README.md` § Ordering) *and* for promoting
  the EVAL BAR's presentation contract to an ADR (`docs/SYNC-DEBT.md`). One session
  can serve both.

## Debts this session opened, both with triggers and deletion lines

- **The EVAL BAR has no Production birthplace.** Gate 12 refused a new feature home,
  so the bar's contract sits in three houses that each own something else. Today's
  cliff ruling filed at M7 because it is a reading of M7's numbers; the next such
  ruling may have no natural owner. Promote the whole presentation contract to an ADR
  when ticket 09 lands. `docs/SYNC-DEBT.md` § Open, first row.
- **`confidenceGain` has no dial and may want one.** The axis stays; its magnitude is
  owned by fog FG-M①, which prices by observation type and has no entry for an
  information byproduct that produces *no* observation event — a raid meeting no
  sortie is the measured case. Inherits FG-M①'s first-playtest pickup. Recorded at
  M8 § Consequence with its own deletion condition.

## Conditions and gotchas

- **The shared `main` worktree moves under you, including uncommitted files.**
  Re-run `git status --short` when a read-only pass spans more than a few minutes,
  and **never `git add -A`** — add explicit paths. (Quiet all session, but the
  hazard is real and measured.)
- **`/usr/bin/git`, not bare `git`** — bare git answers from another worktree here.
  `git commit -F -` does not read stdin; write the message to a file.
- **`rg` misses real matches** on recursive directory scope here; use `grep -rn`.
  Quote glob args in zsh.
- A doc batch is fine on `main` directly (this is the repo's convention); anything
  larger wants its own worktree.
- `npm run lint:docs` sat at **0 blocking, 26 advisory** all session. Two advisories
  are expected and should not be silenced: `stale-quickref` (the QUICKREF is a lock
  point, not a per-batch duty) and `ticket-blockers-cleared` on 04/09 (they really
  are takeable).
- No `verify:game` run was needed — nothing touched `game/src/`. Last recorded
  green: `main` @ `4287547`, six lanes PASS, parity `a7a4c85a156a9beb`.

## Suggested skills

- **`/grilling`** for #12 — one row, and this one is a design re-cut rather than an
  adjudication, so expect the session to be mostly conversation and one batch.
- **`/doc-audit`** only if #12's re-cut **renames or re-statuses a term** — the
  ladder's rungs are named things (속국화, 섬멸, 전진, 침식, 약탈), so unlike today's
  three batches this one plausibly does owe a `term-inventory.json` patch. Check
  before assuming either way.
- **`/handoff`** after it, updating the status table above. When #12 closes, the
  twelve-row seal-conflict debt in `docs/SYNC-DEBT.md` is fully paid and should be
  **struck rather than annotated a fifth time** — it already carries four
  partial-payment notes.
