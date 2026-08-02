# Handoff — lane A: open ticket 08 (fog and recon)

Written 2026-08-02, at the close of a session that sealed **Wayfinder gates 09, 10
and 11** — every grill gate 01–11 is now resolved. This lane continues the **game
build**. A parallel lane works documentation law
(`.context/handoff-lane-b-documentation-law-2026-08-02.md`); read § Running in
parallel before touching any shared file.

Carries only what is **not** in the repo.

---

## The task

Ticket 08 (`.scratch/l3-playable-build/issues/08-project-standard-fog-and-price-recon.md`)
is `needs-info` on four seal conflicts — `DECISIONS-OWED.md` Part 2 **#1, #4, #5,
#6**, the whole fog band. Closing them unblocks 08, and 08 is the entrance to the
last chain (`08 → 09 → 12 → 13`, with `10 → 11` on the other branch).

**Do not open a grill on all four first.** Do the cheap test below.

## Start here: the archive term may already be gone

All four conflicts have the same three-way shape — `MAGNITUDE.md` **M8** versus
the fog **RULINGS** versus **`js/intel.js`**. That third term is the reference
**archive**, and ADR 0041 says it is *"not a parity comparator for behavior they
never ran"*, with accepted behavior reaching L3 by re-implementation from its
authoritative contract.

**If that applies, the `js/intel.js` term simply drops out of all four**, and a
four-way grill becomes one or two.

This is not speculation. It is the third time the same move would apply:

| | What the tracker said | What ADR 0041 had already done |
|---|---|---|
| Gate 09 | "blocks gate 10" | removed its migration premise entirely — closed 2026-08-02 |
| Gate 11 | cutover / rollback / retirement | removed the public route — closed 2026-08-02 |
| **#1/#4/#5/#6** | three-way conflict | **untested** |

Test it before grilling. If the archive term drops, what remains is a genuine
two-source question (M8 versus fog RULINGS) and the grill is short.

**Then, and only then**, grill what survives — at a game designer's altitude, with
the flow map first, per memory `terrain-game-grill-communication-style`. "I can't
follow this" means the altitude is wrong, not that the user needs more detail.

## What changed today that this lane must know

- **`npm run verify:game` now exits 0.** Six lanes PASS. Every previous ticket saw
  exit 2 with `parity PENDING` **by design**; that is no longer the expected
  state. **A new PENDING means a threshold was added and left unfilled** — treat
  it as a real signal, not as business as usual.
- **Gate 10 is closed**, so ticket 08's acceptance thresholds now exist. Gate 10
  is the **admission** gate to L3 playtesting, not its verdict: it certifies a
  playtest of this build would *mean* something. It does **not** judge fun,
  tension or skill expression — those are TEST-LADDER's L3 rung and
  `DESIGN-RISKS` R12/R1/R2, and they are not ticket 08's to pass either.
- **`L3` means two different things in this repo** — the test-trust ladder's top
  rung and the build generation — and only the first is registered, so
  `alias-inject.js` will feed you the *ladder's* meaning while you work on the
  *build*. Registered in `docs/SYNC-DEBT.md`; the rename is unruled. Gate 10 lost
  weeks to this exact ambiguity. When the hook injects it, ignore the injection.

## An unverified hypothesis, flagged so it is not inherited as fact

`.scratch/l3-playable-build/README.md` § Build dependency chain reads as a
straight line. This session read it as **two branches** merging at 12:

```
        ┌─→ 08 fog ──→ 09 eval bar ──┐
07 ─────┤                             ├──→ 12 bot ──→ 13
        └─→ 10 plans ─→ 11 matchups ─┘
        04 commit-first shell is off-chain entirely
```

Reasoning: 10 needs the commit system (03) and battle (06c), both landed — not
fog. 12 needs both branches, since `game/src/bot/index.ts` describes its
disposition as governing **recon share** and where inside the **confidence band**
it reads.

**Status: hypothesis.** The ticket files carry no `Blocked by:` lines at all — the
chain exists only in that README table, and part of its stated justification is
review discipline, not technique. Confirm or kill it before anyone opens a second
build worktree. The same doubt is footnoted on the operational-manoeuvre row in
`docs/SYNC-DEBT.md`.

## Where the build actually stands, in one line

The walking skeleton is closed — a full match plays from setup to capital fall,
cross-host. What is missing for gate 08's "one real, complete 1v1 duel at full
compound depth" is, largest first: **there is no opponent** (`bot/index.ts`
throws by design, ticket 12), no information game (08), no plan choice (10/11),
no read layer (09), and the operating surface is still grey-box (04).

## Running in parallel with lane B

A concurrent session bit this one at 09:00 today: a peer was editing
`docs/DESIGN-RISKS.md` at the same moment, an `Edit` failed with "file has been
modified", and the two were one write away from clobbering each other.

- **One session at a time per document file.** The collision zone is
  `docs/SYNC-DEBT.md`, `docs/DESIGN-RISKS.md`, `DECISIONS-OWED.md`, and the
  tracker `README`s. Lane B lives in `docs/` and `.scratch/doc-structure/`; this
  lane should stay in `.scratch/l3-playable-build/`, `docs/features/`, and
  `game/`. **`SYNC-DEBT.md` is the file both lanes will want — coordinate before
  writing to it.**
- Build work gets its own worktree, and re-check
  `/usr/bin/git rev-parse --abbrev-ref HEAD` immediately before committing.

## Verification baseline

On `main` at the handoff commit:

```bash
npm run verify:game   # six lanes; exit 0 is now reachable and is the target
npm test              # root suite — 562/562
npm run lint:docs     # 0 blocking / 16 advisory (advisory is expected non-zero)
```

## Tooling notes that cost real time

- **Use `/usr/bin/git`.** A bare `git` here can report another worktree's HEAD.
- **`rg` misses real matches** on recursive `.`/directory scope in this repo;
  confirm existence with `grep -rn`.
- **zsh eats unquoted glob flags** — write `grep -rn "x" --include="*.md"`.
- **`git merge -F -` does not read stdin.** Write the message to a file.
- The Bash tool caps at a 10-minute timeout; long `codex exec` runs need resuming
  by session id rather than a longer timeout.

## Suggested skills

- **`/grilling`** for the fog conflicts that survive the archive test — not
  before it, or you will grill a question that no longer exists.
- **`/implement`** once 08 reaches `ready-for-agent`. One session claims one
  ticket; the demoable boundary is also the failure-localization boundary.
- **`/final-check`** at close.
