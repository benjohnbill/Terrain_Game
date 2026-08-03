# Handoff — implement build ticket 08 (Standard Fog + reconnaissance pricing)

Written 2026-08-03 at the close of the session that **sealed fog `RULINGS.md` ④**
and lifted ticket 08's last hold. It supersedes
`.context/handoff-testimony-attachment-grill-2026-08-03.md` — that file's one
question is answered, and its "Also open" items are unchanged and still live.

**This file is a pointer, not a record.** Everything normative is in the repo:
the ticket's own § Contract and acceptance list, fog `RULINGS.md` ③ and ④,
`MAGNITUDE.md` FG-M①, ADR 0048 and 0050, gate 03 § 4/§ 5. Read those. What
follows is only what those documents do not tell you.

*(Kept in `.context/` rather than the OS temp directory, against the handoff
skill's default. This repo has lost decisions to `/tmp` before — ticket 08's own
§ Groundwork carries a note about exactly that — and `AGENTS.md` lists `.context/`
as tracked Working layer for this reason.)*

## Where things stand

| | |
|---|---|
| `8838565` | ruling ④ sealed: seven decisions, ADR 0050, ticket 08 unblocked |
| `158ce73` | the batch's own two-axis review findings applied |
| `87d2a1f` | **a peer session's commit**, turn-ladder conflict registered in SYNC-DEBT |

Baseline: `npm test` **575/575** · `npm run lint:docs` **0 blocking / 21
advisory** · `sync-docs-law --check` in sync. `node scripts/frontier.js` reports
`l3-playable-build → 08 TAKEABLE`, and it is the **only** build ticket with a
clean conflict slate — every other one still carries an unruled Part 2 row.

## What the ticket does not tell you

Five things this session established by reading the tree. They are the difference
between starting well and starting twice.

1. **This is greenfield, not a retrofit.** `game/src/projection/project.ts`
   `visibleDetachments` returns **only the viewer's own** detachments
   (`state.forces[viewer]`). There is no enemy-force view of any kind today, so
   there is no existing shape to inherit or fight. The migration-grade projection
   omits enemy forces rather than blurring them.
2. **Three code facts are load-bearing for ruling ④ decision 3.** If any of them
   changes, the ruling changes and must be re-opened rather than worked around:
   `splitDetachment` keeps `source.id` on the retained part and gives the child a
   new id, both at the same position with a copied movement order
   (`game/src/domain/force.ts`); `#mergeDetachments` reuses `ids[0]`
   (`game/src/runtime/runtime.ts`); and **division is free** — no commit cost, no
   fatigue cost, no per-turn cap, gated only by `lockRefusal`. That last one is
   why identity is granted by observation rather than by a coherence flag.
3. **Build G3's two oracles first.** Ticket 08 § Groundwork G3 records both, both
   legal under ③ decision 1, and they are the safety net for everything else: an
   **empty intersection proves under-widening** (a Runtime self-assert needing no
   access to truth), and **containment is testable from outside the projection**
   (`truth ∈ band` for every viewer, sector and turn across a full match). Decision
   1 forbids truth entering the *projection function*, not the test that audits it.
4. **Invariant 8 is a class check, not a field check** — gate 03 § 5 says so in
   terms. A projection satisfies it only against the published set *as a whole*,
   so it cannot be discharged field by field like invariants 1–7.
5. **The reporting spread must not be implemented as a clamp.** That is the entire
   point of ④ decision 7 — a floor enforced by widening a collapsed interval
   re-centres it on the truth, which is invariant 8 violated by its own guard. Draw
   narrower; the floor falls out. `MAGNITUDE.md` FG-M① § Consequence — the
   reporting spread has the table and the containment margins.

## Out of scope — do not do these inside 08

- **Do not place the census surface.** ④ decision 6 seals what it must and must
  not do and deliberately leaves placement to `DECISIONS-OWED.md` Part 2 #13,
  which is **ticket 04's** blocker. Publishing the materials is 08's job; deciding
  which screen shows them is not.
- **Do not design the testimony-history surface.** Deferred by ③ decision 4,
  registered in `docs/SYNC-DEBT.md`.
- **Do not reopen** Part 2 #1/#4/#5/#6, ruling ③, or ruling ④. A link-confidence
  dial stays closed (③ decision 5).
- **Do not port `js/intel.js`.** It is force-attached already
  (`observeDetachment` / `ageDetachment` / `detachmentBand` / `reachCone`, consumed
  by `js/window-read.js`), which is *evidence that the shape works* and nothing
  more — ADR 0041 makes it archive. Re-implement from the contract and check
  against it.

## Riders you will walk into

All three are registered in `docs/SYNC-DEBT.md` with triggers and deletion
conditions; none blocks 08, and each will look like a bug from inside the code.

- **No adjacency grade exists.** An enemy army standing beside yours is not
  visible for free — gate 03 § 4 grants only battle contact, repelled assault and
  border alarm. ④ decision 3 *leans* on that absence to price tracking. It will
  feel wrong while implementing; it is deliberate as far as any seal goes, and the
  question is booked for the first playtest.
- **Garrison substance is sector-attached only while garrisons cannot move.**
  Coupled to the held garrison→field posture transfer.
- **FG-M①'s ladder has one inversion** — repelled assault ±20% is *finer* than the
  ±25% cheapest purchase. The false reason that denied it is corrected; whether
  ±20% belongs inside the paid range is a value, and it is the user's.

## Conditions and gotchas

- **A peer session is live on main** and committed during this one (`87d2a1f`).
  Re-check `git rev-parse HEAD` before committing, work in your own worktree, and
  **never `git add -A`**.
- **`/usr/bin/git`, not bare `git`** — bare git returns another worktree's tip in
  this repo. **`git commit -F -` does not read stdin**; write the message to a file.
- **`rg` misses real matches** on recursive directory scope here; use `grep -rn`.
- **`/implement` now asks for a named ticket.** Give it `08`.
- **`/code-review` earned its keep on a documentation batch this session** — both
  axes independently found the same top defect, a wrong mechanism left at the
  birthplace after a mid-batch correction. Expect it to be worth more on code.
- Three worktrees exist: main, `-demo` (`demo/school-submission`), `-t07`.

## Verification

```bash
npm test              # 575/575 baseline
npm run typecheck:game
npm run test:game
npm run verify:game   # the acceptance harness — six lanes, exit 0 is the bar
npm run lint:docs     # 0 blocking / 21 advisory baseline
```

`verify:game` is the one that matters for this ticket: it is the parity and
acceptance harness, and 08 adds invariants rather than features, so the acceptance
list is the specification.

## Suggested skills

- **`/implement`** with ticket `08` — it reads the tracker now and will ask.
- **`/tdd`** for the invariant work specifically. 08's acceptance list is almost
  entirely properties that must hold (containment, non-invertibility,
  non-collapse, no-truth-in-the-projection-function), which is exactly what a
  test-first loop is good at, and G3's oracles are already designed as tests.
- **`/code-review`** after it lands — the **spec axis matters more than usual**,
  because the acceptance list encodes invariants rather than features, and a
  standards-clean implementation can still quietly violate one.
- **`/final-check`** at close. It caught an unregistered deferral twice in the
  preceding sessions.

## After 08

Ticket 09 (EVAL BAR) unblocks by front matter but holds its own `needs-info`
(Part 2 #3, the commit marker; #2, the encirclement threshold). Note 09's standing
instruction: **a session that resolves 09 must raise the operational-manoeuvre ↔
ticket 13 ordering ruling as its next order of business**, and ticket 10 is not
claimable until that is ruled.
