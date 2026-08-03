# Handoff — grill the testimony-attachment question, then ticket 08

Written 2026-08-03 at the close of the session that **closed Wayfinder gate 12**,
the last gate. It supersedes `.context/handoff-gate12-then-ticket08-2026-08-03.md`
(its leg 1 is done) and `.context/handoff-lane-b-point2-landed-2026-08-03.md` is
untouched by it — that lane's points 1, 3, 4 and 5 are still open and are a
different thread.

**This file is a pointer, not a record.** The durable records are
`.scratch/l3-playable-seam/issues/12-partition-spec-handoff.md` § Answer (the ten
rulings) and `.scratch/l3-playable-build/issues/08-…md` § Groundwork (the analysis
behind the one question left). Read those; everything here is orientation.

## Where things stand

Three commits, in order:

| | |
|---|---|
| `0e0ea9c` | gate 12 closed: ten rulings, ADR 0049, 28→14 code citations, three live defects fixed |
| `ff473d5` | the batch's own two-axis review findings applied |
| `276b3ef` | three user decisions: `AGENTS.md` corrected, principles held, `/implement` seam added |

Baseline: `npm test` **575/575** · `lint:docs` **0 blocking / 21 advisory**
(`ledgerCurrency` 19 · `freshness` 1 · `ticketBlockerCurrency` 1) · `verify:game`
**exit 0**, six lanes PASS · `sync-docs-law --check` in sync.

Advisory moved 20 → 21 across the session and the composition explains it: gate
12 resolving dropped it out of `ticketBlockerCurrency` (−1), and the new ledger
rows raised `ledgerCurrency` (+2). `stale-quickref` is the `freshness` one and is
a re-render prompt, not a duty — the QUICKREF is a lock point (ritual duty 4).

**Every Wayfinder gate is now closed.** `node scripts/frontier.js` reports
`l3-playable-build → takeable: none`, and that is correct rather than stale.

## The one question

**Does an observation testimony attach to a sector, or to a force?**

Fog `RULINGS.md` ③ made the estimate band a record of observations. A testimony
ages by widening — by a bound on *what could have changed since I looked*. That
bound cannot be computed until the testimony's subject is named, and no seal
names it. Ruling ③ decision 5 promised the envelope derives from three sealed
inputs with **no new dial**; whether that promise holds depends entirely on this
answer.

Four readings. The numbers are measured, not argued — `band-probe.js`, recorded
in ticket 08 § Groundwork G1/G2.

- **A — sector-attached.** The bound must let the whole stock march out, so the
  band's lower edge hits **0 after one turn** and the upper edge reaches the
  public register cap in **3–4** (front→front, median 8 hexes at speed 3). After
  four turns the band equals the free prior. 노화 헌법 P3 says the mutable layer
  *decays*; this makes it *vanish*, and ruling ③ decision 4's trend read — the
  capability the model was sold on — has nothing left to read. Honest, and
  worthless.
- **B — force-attached.** Position stays the reach cone's job; the envelope bounds
  only that force's own count. The three named inputs become a principled census.
  It composes. Its cost is **enemy force identity across observations** — the game
  telling the player "this is the same army", which is information fog is supposed
  to price.
- **B+ — force-attached, identity survives only while the force is coherent.**
  Proposed in the closing session, not by the analysis. A split or a merge breaks
  the testimony chain and the player needs a fresh look. **It adds no dial**:
  field-army division and merge are already sealed and implemented (ticket 04,
  `js/field-army.js` — division copies fatigue independently, merge is a
  size-weighted average), so "coherent" reads existing state. It also turns the
  opponent's manoeuvre into a way to *invalidate* enemy intelligence, which is
  payment rather than a giveaway.
- **C — identity itself fogged.** Most faithful, and it needs a link-confidence
  dial. Ruling ③ decision 5 explicitly closed that door.

The closing session recommended **B+**. That is a recommendation, not a ruling.

**A second thing to rule with it:** ruling ③ § What this ruling does not settle
calls the envelope's composition *"an implementation-time verification"*. The
groundwork says that classification is wrong — it is a shape question. Whoever
grills this should settle the classification too, because it decides whether the
next such item stops the build or not.

## Read these, in this order

1. `.scratch/l3-playable-build/issues/08-…md` **§ Groundwork G1–G3** — the whole
   case, with its numbers, including a measured invertibility bug (G2) whose fix
   is derivable and dial-free, and two oracles that are legal under decision 1.
2. `docs/features/fog-of-war-discovery/RULINGS.md` **③** — decisions 2, 4, 5, 6, 7
   are the ones this question touches.
3. `docs/adr/0048-…md` — why the band is a witness record.
4. `.scratch/l3-playable-seam/issues/03-…md` **§ 5** — the eight non-leak
   invariants, **amended in this batch**. Invariant 8 exists now; 2, 5, 6 and 7
   were corrected to the witness model. Do not read a pre-`0e0ea9c` copy.

## Do not reopen

- **The witness model itself.** Ruling ③ is user-sealed. The question is what a
  testimony is *about*, not whether the model stands.
- **The four Part 2 rows** #1, #4, #5, #6 — closed 2026-08-03.
- **Gate 12's ten rulings.** In particular: there is no new integration feature
  home, and ADR 0049 is the Runtime/projection authority.
- **A link-confidence dial** unless C is chosen deliberately — ③ decision 5
  closed it.

## What this unblocks

Ticket 08 is `needs-info` on this question alone. Its Part 2 slate is clean, both
its gates are resolved, and its contract (fog RULINGS ③ + MAGNITUDE FG-M① + ADR
0048 + gate 03's eight invariants) is current. **Ruling this makes 08 the
frontier**, and 08 is the only build ticket with a clean conflict slate — every
other one still carries an unruled Part 2 row.

## Also open, none of it blocking

- **Lane B's points 1, 3, 4, 5** — `.scratch/doc-structure/issues/14-…md`. A
  different thread; start at point 3 if it is picked up.
- **Two R5 deferrals from lane B, triggers fired:** the build README's per-ticket
  `Result` column and its gate-status table. Not touched by the gate 12 batch
  because they are that lane's items.
- **Seven SYNC-DEBT rows registered 2026-08-03**, each with a pickup and a
  deletion condition. The two that bear on this grill are the testimony-attachment
  row and the reconnaissance-ROI row (the tier comparison ran at defender commit 0
  and the fuller run the user named was never recorded).

## Conditions that bit, and gotchas

- **`/implement` now reads the tracker.** One line was added to the global skill;
  it asks for a named ticket. That is new since the last session.
- **A peer session ran read-only in parallel all evening** and reported three
  documentation defects that were all real. Its analysis lived in `/tmp` and would
  have been lost; it is now in ticket 08. **If you spawn or receive one, land its
  output in the repo before the session ends.**
- **Verify a reported defect against the tree before acting.** All three peer
  findings held, but one of the closing session's own claims did not: it reported
  0 tracker citations in `game/` after grepping for the *path* `.scratch/`, when
  the code cites by *name* ("Wayfinder gate 02 § 6") — 166 of them. Search by
  vocabulary and you will miss what uses different words.
- **Both review axes caught the same two defects**, and both were mechanical: a
  section number carried through a repoint unchanged (`§ 5` where `§ Decision 8`
  was meant) and a status paragraph contradicting itself three lines later. Run
  `/code-review` on a documentation batch — it earns its keep.
- **Line-number citations rot.** Four `audit-lint.js:475` references were replaced
  with the check name this session; the file has two different `status:` domains,
  so the number was ambiguous as well as fragile. Cite check names and row titles.
- **`/usr/bin/git`**, not bare `git`. **Never `git add -A`** while a peer may be
  live. **`git commit -F -` does not read stdin** — write the message to a file.
- **`rg` misses real matches** on recursive directory scope here; use `grep -rn`.

## Suggested skills

- **`/grilling`** — this is a game-design question, so open at a designer's
  altitude: what the player is actually being told, and what it costs them. Not
  the envelope arithmetic. One question at a time; the user must be present.
- **`/implement`** once 08 leaves `needs-info`. It will ask for the ticket now.
- **`/code-review`** after 08 lands — the spec axis matters here more than usual,
  because 08's acceptance list encodes invariants rather than features.
- **`/final-check`** at close. It is what caught the unregistered ROI deferral,
  twice.
