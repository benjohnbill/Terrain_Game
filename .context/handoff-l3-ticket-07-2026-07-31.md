# Handoff — fall a capital and end the match (L3 build ticket 07)

Written 2026-07-31 and **corrected 2026-08-01**, after 06d merged (`34d728d`). This is
the ticket where **a match ends for the first time**: the walking skeleton closes its
loop here, and everything after 07 thickens a game that already terminates.

> **What the correction was, because it is the most useful thing in this document.**
> The 2026-07-31 draft said 07 had "no blockers" and that R6's second test passed. Both
> were false. A claim-time recompute — the check this ticket's own § Start here tells
> you to run — found a **fourth** item under the three that had closed that day: *which
> register backs the capital guard.* It is now ruled (**CP-⑥**, 2026-08-01, realm-wide)
> and 07 is genuinely `ready-for-agent`. Run the recompute anyway. This header has been
> wrong twice, in both directions, on the same day.

Carries only what is *not* in the repo; everything else is referenced by path. It
lives in `.context/` because `AGENTS.md` registers that as the Working-layer home for
handoffs and because it is tracked — a worktree does not carry untracked files, and
this ticket is a worktree candidate.

## Start here

1. `AGENTS.md`, then `.scratch/l3-playable-build/README.md` — § Fresh-session
   preflight and § Implementation loop, followed literally. § When implementation
   meets a design problem defines the four kinds and who decides each.
2. `.scratch/l3-playable-build/issues/07-fall-a-capital-and-end-the-match.md` — the
   ticket. Its **§ Scope boundary set by gate 08** is load-bearing: the supported
   fall path is the **overwhelming decisive battle only**, and the Moscow trap is
   deferred *as a path* while the vulnerability it rests on must still exist.
3. **ADR 0042** — capital fall is the sole win condition. Everything in this ticket
   is that sentence becoming code.
4. `docs/features/capital/RULINGS.md` — **CP-②** (the duel win-condition package,
   items 1 and 3–9 are the contract), **CP-⑤** (the guard coefficient) and **CP-⑥**
   (the guard's register backing). Read **CP-①'s header banners before its body** —
   **four** of its items are amended and the body still reads as originally sealed.
   Item 1's designation rule and item 2's coefficient *and* backing are all superseded
   in the banners.

07 is `ready-for-agent`. Recompute R6's second test at claim time anyway — see the
correction note at the top of this file for why that instruction is not boilerplate.

## What landed today that this ticket stands on

Four rulings, all on `main`, all from 2026-07-31. None needs re-deriving.

- **ADR 0046 + TC-⑮** (ticket 06e, `b591f4e`) — an engagement is sited wherever a
  hostile force stands, and a sector defends on its own terrain. **Battle-capable
  sectors went from 27 of 56 to all 56.** This is what makes a capital reachable by
  fighting rather than by walking; before it, 41 of 45 authored capitals could be
  taken with zero battles.
- **ADR 0047** (`467a276`) — population accounting is sector-grained: the register
  *and* origin composition.
- **06d** (`34d728d`) — capture exists. `Runtime.#captureSector` moves control,
  transfers the civilian remainder, and emits **`sector-captured`**.
- **CP-⑤** — the capital guard coefficient is **가안 2,500/pop** (user). This closed
  `DECISIONS-OWED.md` Part 2 row #10, whose "350 vs 1500" framing was wrong in both
  directions: `MAGNITUDE.md`'s `capitalGarrison 1500` was never a seal, and the live
  question was the coefficient's *size*.
- **CP-⑥** (2026-08-01) — the guard's **register backing is realm-wide**: its origins
  are apportioned across the realm's held sectors, the rule ADR 0047 item 5 already
  states for the opening field army. ADR 0047's header carries the amendment stamp.
  This closed Part 2 row **16** and is what makes 07 claimable. Implementation is one
  call — reuse `apportionOrigins` over `#seatSubstance`'s `remaining`, do not write a
  second seating rule, and do not exempt the guard from the register.

## The seam this ticket hooks: `sector-captured`

`Runtime.#captureSector` (`game/src/runtime/runtime.ts`) is the whole of capture, and
07's win check belongs at its call site or just after it. Ticket acceptance item 3 is
explicit about the shape:

> "**Capital fall is an ordinary sector capture** … There is **no** capital-specific
> threshold, no 'overwhelming' gate, and no special predicate anywhere in this path.
> What makes it hard is the guard's magnitude, not an extra condition."

So the check is *"is the captured sector this loser's capital"*, and nothing more.
CP-② item 5's "overwhelming decisive battle" describes the path, not a second bar.

Read `#captureSector`'s own comments before writing near it — it explains why a
recapture takes the ordinary ripening lag with no special case, and why it refuses
rather than clamps when serving exceeds the register.

## Three things the ticket does not tell you, all found by reading the code

### 1. The garrison ceiling is uniform, and the guard does not fit under it

`game/src/domain/economy.ts`:

```ts
export function garrisonHeadroomOf(manned: number): number {
  return Math.max(0, GARRISON_PER_BORDER_SECTOR - manned);   // 900, uniform
}
```

It takes `manned`, **not a sector**, and its own comment says four surfaces call it
"because … asking it differently would be quietly re-cutting the ceiling". At
2,500/pop the guard reaches **6,000** on this board's largest sector (pop 2.4) and
**1,250** on the smallest (pop 0.5). Under today's ceiling the guard cannot be placed
at all.

**This is assembly, not a decision** — cite and proceed:

- **CP-① item 2** seals the guard as garrison-class with its **own local ceiling**.
- **ADR 0014** keeps garrison ceilings local (the code comment at `runtime.ts`'s
  posture sites names it).
- **M13a's g₀ = 1.0** puts garrisons at cap from turn one, so at setup the capital
  sector's ceiling *is* the guard magnitude. The value is derived, not chosen.

Expect to make `garrisonHeadroomOf` sector-aware and to move all four callers
together — the same "both callers move or neither does" discipline `commitment.ts`
required in 06e.

### 2. There is no terminal phase, and adding one is consistent rather than a breach

`MatchPhase` is `'capital-selection' | 'decision'`. Nothing in `game/src` implements
victory, match end, or a game-over state — 07 builds it.

Before inventing a shape, read `runtime/types.ts`'s comment on `MatchPhase`: **only
*resting* states appear there**, because the payoff and background tiers take no
input and the Runtime never sleeps (D6.2, gate 02 § 4). A match-ended state is a
resting state — the match rests there permanently — so it belongs in that union. What
would *not* belong is a phase the caller must submit something to leave.

Acceptance items 8 and 9 pair with this: the end is explicit and final ("states who
won and why play stopped"), and a new match can start afterwards, resetting both
authoritative and interaction state.

### 3. The capital guard is deliberately absent, and `#seatSubstance` says so

`Runtime.#seatSubstance` seeds field armies and border shields and explicitly omits
the guard. Its comment has been rewritten twice in two days and now states both
rulings — CP-⑤'s magnitude, CP-⑥'s realm-wide backing, and the ceiling seam above.
Placing the guard is this ticket's, and `#seatSubstance` is where it goes: the origins
come from `apportionOrigins(guardMen, remaining)`, the same call two lines below that
seats the opening field army.

**The ordering is derived, not chosen.** `remaining` is
`register − openingGarrisonOrigins`, and the opening field army is apportioned from it
— garrisons first, field army from what is left. The guard is **garrison-class**
(CP-① item 2), so it seats on the garrison side of that split: subtract the guard from
`remaining` *before* the field army is apportioned. Nothing new is decided; the guard
simply takes the place its own class already has in the existing loop. What CP-⑥
changed is only that its subtraction is spread realm-wide instead of landing on one
sector.

The invariant worth asserting is the one `availableCiviliansByOrigin` already throws
on: the sum of every origin composition must never exceed any sector's register. Test
it at the largest legal capital (pop 2.4, guard 6,000) and at `r5_s8` (pop 0.5, a
border sector whose whole 900 register is its own shield) — the second is the case that
falsified local backing, so it is the case a regression would break first.

## Absent rather than approximated — and say so in the evidence

Each of these is a deliberate hole with an owner. Building any of them here
originates a rule.

- **The Moscow trap** (encircle → cut supply → starve → finish). Deferred by gate 08.
  **But the vulnerability must survive**: CP-② item 7 gives the guard *no special
  supply rule*, so it obeys the same predicate as any force and remains encirclable
  in principle. Do not exempt it. `runtime.ts` already carries a note that whatever
  places the guard must not exempt it.
- **Capital relocation (천도)** — OUT by user ruling 2026-07-25, recorded in the
  ticket so a later reader of CP-② item 4 does not mistake the absence for a gap. It
  is fully specified there; its absence is a scope call under the build's
  wiring-not-systems mandate.
- **Any second win check** — acceptance item 4 lists what must not exist:
  last-faction-standing, percentage-of-hexes, hegemony, points, territory or economy
  tiebreak, draw path, turn cap.
- **An early-rush floor** — acceptance item 7. Nothing may forbid a capital falling
  before turn N; CP-② item 8 rests that on the guard's magnitude alone, which is
  exactly what CP-⑤ re-cut to make true.
- **garrison → field posture transfer** — 06d landed field → garrison and left the
  reverse **HELD** for a real seal gap (a man's wear after standing in a shield is
  undefined, and a free round trip would launder 06b's convex wear curve). The guard
  is place-bound, so 07 does not need it — but do not route around it, and do not let
  placing the guard quietly open it.

## Verification and the baseline you must not regress

```bash
npm run verify:game   # typecheck / build:runtime / build:viewer / test:node / test:browser / parity
npm test              # root suite
npm run lint:docs     # documentation governance
```

Baseline on `main` at `eb2263c` (the CP-⑥ batch), re-run there: **Node 239**, **browser
21**, root **562/562**, `lint:docs` **0 blocking / 12 advisory**. `verify:game` exits
**2**: every lane PASSes and **parity is PENDING by design** — Wayfinder gate 10 owns
the bit-exact-versus-epsilon threshold and has not filled it. Both hosts produce
`12bb82b340784101`. **Exit 2 with that summary is the expected green**; the hash
changed at 06d because the projection did.

`lint:docs`' `conquest damage` advisory is verified-spurious and must stay standing —
its ledger row matches a commit about conquest *conversion*, a different term. The
lint's own guidance is that a verified-spurious advisory is the correct outcome.

Cross-host work costs five edits: a new public event must be whitelisted in
`Runtime.#globallySafeResolutionEvents` **and** `game/acceptance/replay.js`'s
`GLOBALLY_SAFE_EVENT_TYPES`, and four tests assert the exact event and tier lists
(`turn-loop.test.js` ×2, `tests/browser/boot.spec.js` ×2). A match ending is
precisely the sort of fact that must cross `submit()`; its *numbers* need not.

## Tooling notes that cost real time today

- **Use `/usr/bin/git`.** A bare `git` here can report another worktree's HEAD.
- **This repo runs concurrent sessions against one shared worktree, and it bit us
  twice today.** A parallel session's commit landed on someone else's ticket branch
  and reached `main` only by riding its merge; separately, two sessions independently
  reached the same ruling and both went to record it. Before you commit, re-check
  `rev-parse --abbrev-ref HEAD`. Before you merge, run
  `/usr/bin/git log $(/usr/bin/git merge-base main HEAD)..HEAD --oneline` and confirm
  every commit is yours. **Before you author an ADR or a stamp batch, `git fetch` and
  check whether it already exists.**
- **`git merge -F -` does not read stdin.** Write the message to a file.
- **When you run `/code-review`, tell the reviewers what is on `main`.** Name
  ADR 0046, ADR 0047, CP-⑤ and 06d explicitly. A reviewer without that context reports
  "this ruling does not exist" as a hard violation — it happened on 06c, and naming
  them is what prevented it on 06e.

## Suggested skills

- **`/implement`** pointed at the ticket, with an instruction to read CP-①'s header
  banners and this handoff's § Three things first. The skill routes to `/tdd` at
  agreed seams and to `/code-review` at the end.
- **`/tdd`** at the win check and the guard ceiling. Write against the **emitted
  artifact** (`game/dist/runtime/index.js`, gate 05 D6), never the source. The test
  worth writing first is the negative one — acceptance item 4's "no other win check
  exists anywhere" is the claim most easily broken by accident later.
- **`/code-review`** before merging, per the runbook's loop step 7. Both axes earned
  their keep on 06e: standards caught a rename six of seven surfaces made, and spec
  caught a reading no seal covered.
- **`/final-check`** at session close.

## What this unlocks

07 closes the loop. After it the tracker is no longer building *toward* a playable
match — it is thickening one. The next frontier is whichever of 04 / 08–13 the user
opens, and **gate 10's acceptance thresholds become the critical path**, since they
gate every remaining ticket's pass/fail and ticket 13 cannot be judged without them.
