# Handoff — Wayfinder gate 12, then implement ticket 08

Written 2026-08-03 at the close of the session that sealed the **fog witness
model** (commit `77d892f`). The next session runs two legs in order: **grill
Wayfinder gate 12**, then **implement build ticket 08**.

Carries only what is **not** in the repo. Everything else is referenced by path.

---

## Run `frontier.js` first, and trust it over any table

`node scripts/frontier.js` landed 2026-08-03 (`f9f97e7`) and derives readiness
from ticket front matter. It replaces reconstructing state from README tables —
which is how a blocker line sat false for a week on 2026-08-02.

It currently says exactly one thing is takeable on the build side:

```
l3-playable-build   18 tickets   takeable: none
l3-playable-seam                 TAKEABLE  grilling  12-partition-spec-handoff
```

## Leg 1 — gate 12

`.scratch/l3-playable-seam/issues/12-partition-spec-handoff.md`. Type `grilling`:
**the user must be present, one question at a time.** Its blockers 06–11 all
closed 2026-08-02, which is what made it takeable for the first time.

**Why it is the whole build's single threshold.** All seven remaining build
tickets cite it, and nothing else:

| Ticket | Waiting on |
|---|---|
| 04 · 08 · 09 · 10 · 11 · 12 · 13 | Wayfinder 12 |

Three things the ticket file will not tell you:

1. **One column of its material table is already filled.** "Viewer knowledge
   categories and Standard Fog behavior → existing `docs/features/fog-of-war-discovery/`"
   is now true rather than aspirational: `RULINGS.md` ③ and `MAGNITUDE.md` FG-M①
   landed today. Gate 12's job for fog is to **confirm** that home, not design it.
2. **Its first rider is an ADR that was deferred and never written.** The gates
   05–11 seals were bundled "into one ADR at gate 11", gate 11 closed 2026-08-02,
   and no such ADR exists — `docs/adr/` stops at 0048 (mine, fog-specific and
   deliberately standalone). Deciding whether to mint it is rider (a).
3. **Its SYNC-DEBT pointer was stale by ~1,050 lines** and is repointed to a text
   anchor in this session's second commit. Assume other line-number citations
   into `SYNC-DEBT.md` have rotted the same way; the file grows at the top.

## Leg 2 — ticket 08

`.scratch/l3-playable-build/issues/08-project-standard-fog-and-price-recon.md`.

**It is the only build ticket with a clean conflict slate.** Everything else still
carries an unruled `DECISIONS-OWED.md` Part 2 row, so 08 is the shortest path from
gate 12 to running code:

| Ticket | Part 2 rows still open |
|---|---|
| 04 | #13 |
| 09 | #2, #3 |
| 10 | #2, #7 |
| 11 | #2, #8, #9 |
| 12 | #12 |
| **08** | **none — #1, #4, #5, #6 all closed 2026-08-03** |

Contract, in priority order: **`docs/features/fog-of-war-discovery/RULINGS.md` ③**
(the model) · that feature's **`MAGNITUDE.md` FG-M①** (values) · **ADR 0048** (why
it is cross-feature) · gate 03's **eight** non-leak invariants. The ticket's own
acceptance list was re-cut against these and is current.

**The three parts that are actually hard**, in the order they will bite:

- **Invariant 8 — the projection must not be invertible.** New in this batch, and
  it is a *class* of check rather than a field check: no published value or
  combination may let a viewer solve for absent truth. The specific hole it closes
  is width-proportional-to-truth; FG-M① fixes that by making width a fraction of
  the **reported** figure. Look for the class elsewhere.
- **The ageing envelope must be composed, and must never under-widen.** Ruling ③
  decision 5 claims zero new dials by deriving it from three sealed inputs. That
  claim is reasoned, not demonstrated. **If it under-widens, the dealer lies** —
  the band stops containing the truth, which is the one property everything rests
  on. Registered in `docs/SYNC-DEBT.md`; if it cannot be composed, the fallback
  dial is a **user ruling**, not an implementation choice.
- **Testimony storage is new Runtime state.** A scalar per sector becomes a list
  of timestamped intervals per viewer per sector. `game/src/projection/project.ts`
  is the blur seam and currently carries no fog constants at all — nothing
  pre-empts the design.

## Cheap pickups worth folding into either leg

- **Six tickets still cite Wayfinder 10 as open** (04, 09, 10, 11, 12, 13 — "Wayfinder
  10, 12"). It closed 2026-08-02 and only 08 was updated. Same class as the gate-11
  blocker line that read false for a week.
- **One unregistered deferral**, caught by `/final-check`: the reconnaissance ROI
  comparison was delivered with **defender commit = 0**, and the fuller model run
  the user named is written down nowhere. A line beside FG-M①'s revisit trigger or
  a `SYNC-DEBT.md` row closes it. The law's new **deferral discipline** clause
  (landed today, `AGENTS.md` § Work intake) requires both a pickup condition and a
  deletion condition.

## Working conditions that changed today

- **Both lanes are on the same ticket schema now.** Front matter is real,
  `ticket-front-matter-missing` **blocks**, and `TICKET_GRANDFATHERED` is empty —
  its one entry was discharged this session under its own stated trigger, and a
  test pins the size at zero. Adding an exemption is now a deliberate act.
- **A parallel session was live in this repo all afternoon** and committed three
  times underneath this work. Nothing was lost, but two `Edit` calls reported the
  file had changed on disk. Re-read before edits that depend on surrounding
  content, and stage only your own paths.
- **Every doc edit fires a PostToolUse `lint:docs` hook** that prints the full
  advisory list (17–19 findings) into the transcript. It is noise, not failure;
  read the `audit-lint: N blocking` line and move on.

## Verification baseline

On `main` at handoff time:

```bash
npm test              # 575/575
npm run lint:docs     # 0 blocking / 19 advisory (advisory is expected non-zero)
npm run verify:game   # exit 0, six lanes PASS — a new PENDING is a real signal
node scripts/frontier.js   # what is takeable, derived not asserted
```

## Tooling notes that cost real time

- **Use `/usr/bin/git`** — a bare `git` here can report another worktree's HEAD.
- **`rg` misses real matches** on recursive `.`/directory scope in this repo;
  confirm existence with `grep -rn`.
- **zsh eats unquoted glob flags** — write `grep -rn "x" --include="*.md"`.
- **`git commit -F -` / `git merge -F -` do not read stdin.** Write the message to
  a file.
- **Rewriting a tracked JSON with `json.dumps` reformats the whole file.** The two
  audit baselines use `indent=1` and are unsorted; match both or the diff is
  thousands of lines instead of nineteen.

## Suggested skills

- **`/grilling`** for gate 12 — it is a grilling-type ticket by declaration, so
  the user is present and it is one question at a time. Lead with the flow map at
  a game designer's altitude, not with detail (memory
  `terrain-game-grill-communication-style`).
- **`/implement`** once ticket 08 leaves `needs-info`. One session claims one
  ticket.
- **`/code-review`** after 08 lands — the spec axis matters here more than usual,
  because the acceptance list encodes invariants rather than features.
- **`/final-check`** at close. It caught the unregistered deferral above.
