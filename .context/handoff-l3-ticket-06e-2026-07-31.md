# Handoff — make the sector the atom of combat (L3 build ticket 06e)

Written 2026-07-31, immediately after the geography-battle grill merged (`9480933`)
and the vocabulary dashboard merged (`b62c901`). This carries only what is **not**
already in the repo; everything else is referenced by path. It lives in `.context/`
because `AGENTS.md` registers that directory as the Working-layer home for handoffs
and a worktree does not carry untracked files.

## Start here

1. `AGENTS.md`, then `.scratch/l3-playable-build/README.md` — § Fresh-session
   preflight and § Implementation loop, followed literally.
2. `.scratch/l3-playable-build/issues/06e-make-the-sector-the-atom-of-combat.md` —
   the ticket. Read its **§ Needs-info** before its checkboxes: the forbidden-scope
   list is the load-bearing part, not a formality.
3. **`docs/adr/0046-the-sector-is-the-atom-of-combat.md`** — the authority. Its
   § Context carries the measurements that forced each ruling.
4. `.context/record-geography-battle-grill-2026-07-29.md` — the grill's full trace,
   including six things that were **stated and then refuted** during it. Read
   § Refuted or corrected before forming an opinion; several plausible-looking moves
   are already ruled out with evidence.
5. Then the two seals: terrain-cradle **TC-⑮** and war-model-build **WM-⑤**.

`main` is at the vocabulary-dashboard merge. 06e is `ready-for-agent` with **zero
unlanded values**; 06c is its only implementation blocker and is `resolved`.

## What this ticket actually is

06c built a battle that could only happen at an authored region border. This ticket
removes that gate and supplies what the gate was standing in for.

Do not read it as five loose changes. It is one sentence — **the sector is the atom
of combat** — reaching four places that each currently key on something else:

| place | keys on today | must key on |
|---|---|---|
| where an engagement may exist | a contested authored edge | a hostile force standing on ground it does not hold |
| what ground it is fought on | the door's class | the sector's own `terrainLayer` |
| what the approach means | the door, exclusively | a recorded hex arc, read *only* for which door it crossed |
| what receives the chips | the front key | the sector |

## The one thing most likely to become a silent bug

**`engagementsOf` already fires on presence. Only its candidate-site seed is wrong.**

`engagement.ts`'s header already states "the unit of resolution is the SECTOR, not the
front", and the fire condition is already `standing.sides[invader].men > 0`. The gate
is that `sites` is seeded by walking `fronts`. An implementer who "fixes the
resolution grain" will rewrite correct code and probably break ticket 03's case 4.

The minimal change is the seed. Everything else in that function is already right.

## Three traps the grill walked into, so you do not have to

1. **Do not reintroduce approach-dependent terrain.** TC-⑮ retires it. It is
   *seductive* — it reads as richer, and it is what an earlier reading of the grill
   sealed before the measurements came in. Two findings killed it: routing around a
   door costs **0 extra turns on 20 of 20 land doors** (sectors average 5.2 hexes
   against march speed 3), and 100 flanking men swung R from 0.56 to 2.22 — a
   hex-grain fact deciding a sector-grain outcome. If you find yourself writing
   "softest approach", stop; that is bypass B, and it is retired by name.
2. **`choke.cap` is not the frontage cap.** It is labelled a "Projectable-mass
   ceiling" and `Projectable mass` is **⛔ stale** under ADR 0042 — an input to the
   retired hegemony arithmetic. Its numbers mostly coincide with M11's because the
   map author read M11, but `hills 1300` and `strait 800` appear in **no** M11 row.
   Reading it as the cap is origination dressed as assembly. `Edge.frontageHexes` is
   likewise authored and read by nothing, and is a hex-width count rather than a cap
   (both straits carry 0). Both are seam rows S3/S4 in
   `.scratch/operational-manoeuvre/SEAMS.md`.
3. **Cite M5, restate nothing.** TC-⑮ carries the *binding* only, in TC-⑬'s own
   shape. Every multiplier lives at M5. Compose test expectations from exported dials
   rather than literals — a 06b review finding, and the single-definition rule
   reaching into tests.

## What the terrain table is, precisely

Seven authored `terrainLayer` values onto M5's five rungs. All 56 sectors are
**terrain-uniform** (measured: 0 carry more than one layer), which is why this needs
no map re-authoring.

The one that matters for tests: `mountain` → M5's **`Mountains`** rung. That rung has
existed since 2026-07-03 and has never been used, because nothing read a sector's
terrain. It is not a new value.

The one that is a trap: `river-valley` → **`Plains`**. It is *not* the `river` border
class's 0.70. That number prices an opposed crossing; a river valley is the ground you
stand on. Wiring them together would hand five interior sectors a crossing penalty
against an attacker who never crossed anything.

**Pin the asymmetry with a test.** 관중's three `mountain` sectors (`r6_s0`, `r6_s3`,
`r6_s5`) are exactly its three pass endpoints. Defending `r6_s5` against 1,800 with a
900 garrison gives R **1.33**; defending `r1_s0` — plains, the far side of the same
pass — gives R **2.00**. If your test produces the same number on both sides, the door
is still supplying terrain and TC-⑮ is not wired.

And pin the *unchanged* case: a river-door battle is numerically identical before and
after this ticket (1,800 v 900 → R **1.40**), because TC-⑬'s crossing column survives.

## The commit-key change is a contract change, not a rename

`Allocations` moving from front keys to sector keys reaches `preview`, the UI's
allocation surface, and `FrontAssignments`. `commitment.ts`'s whole purpose is that the
Runtime and `preview` cannot drift into telling the player different things, so both
callers move together or neither does.

Two things to preserve, and one to delete:

- **Preserve:** one pool of 20 per realm per turn, non-hoardable, shared across every
  order kind. The module header explains why it must stay a pool — "dividing the stack
  across fronts thins every point of it against an opponent who concentrates" — and a
  per-order budget would delete mutual exposure.
- **Preserve:** the namespace already mixes kinds (`recruitmentOrderKeyOf` →
  `ORDER_RECRUIT:<id>`). Assert that sector ids cannot collide with it; 06c already set
  the precedent by namespacing the garrison apportionment key rather than trusting a
  bare `'garrison'`.
- **Delete:** 06c's reconciliation for ticket 03's case 4 — two fronts pouring chips
  into one sector. It exists *only* because the key was the front. Adapting it instead
  of deleting it is how the old grain survives in the new code.

## Rout displacement — where the asymmetry actually is

WM-⑤'s axis is **who entered this sector this turn**, not attacker/defender. Getting
this wrong is easy because the common phrasing is wrong:

- an invader always has an arc;
- a defending field army that *reinforced this turn* also has one;
- a defending field army that was already standing there does not;
- **a garrison never does**, structurally — nothing marches one, and 06b states that
  boundary (`GarrisonForce` carries no wear ledger).

Garrison-only defence is *the common case on this board* (06c acceptance item 5), so
the **no-arc branch is the main path**. Build it first.

`escaped` gains its consumer here. Leaving service must decrement `serving` **without**
touching the register — the exact opposite of 06c item 11's casualty path, which
removes the dead from the register permanently because blood is permanent currency.
06d's ticket makes the same point about transfer versus casualties: state the two laws
separately and test them separately, or a single conservation invariant will fail on
casualties and look like a displacement bug.

And a fall-back must pay what R12 prices movement at, or it is a teleport.

## Verification and the baseline you must not regress

```bash
npm run verify:game   # typecheck / build:runtime / build:viewer / test:node / test:browser / parity
npm test              # root suite
npm run lint:docs     # documentation governance
```

Baseline on `main` at handoff: **Node 206**, **browser 21**, root **562/562** (the
vocabulary dashboard's 49 joined at `b62c901`), `lint:docs` **0 blocking** with **11
advisory**. `verify:game` exits **2**: every lane PASSes and **parity is PENDING by
design**, because Wayfinder gate 10 owns the bit-exact-versus-epsilon threshold. Both
hosts produce `29f214a11fc56ef8`. Exit 2 with that summary is the expected green.

**One advisory is verified-spurious and must stay standing**: `conquest damage`'s
ledger row matches a commit message about conquest *conversion*. They are different
terms. The lint's own guidance is that a verified-spurious advisory is the correct
outcome, not a loose end — do not "fix" it.

## Cross-host work costs five edits, not one

If you add a public event, it must be whitelisted in
`Runtime.#globallySafeResolutionEvents` **and** in `game/acceptance/replay.js`'s
`GLOBALLY_SAFE_EVENT_TYPES` (they mirror each other), and four tests assert the exact
event and tier lists: `turn-loop.test.js` ×2 and `tests/browser/boot.spec.js` ×2.
Follow `realm-recomputed`'s precedent for a background-tier event — the *fact* that
something happened crosses `submit()`, the numbers stay behind `view(actor)`. A rout's
occurrence may cross; its counts should not.

Extend the replay fixture so an **interior** sector is fought over and a rout is
displaced. 06c's fixture gained a contact phase for exactly this reason — the new
arithmetic has to cross the host boundary through the Runtime, not only in the pure
calculator's spec.

## Out of scope, and absent rather than approximated

Each of these is registered elsewhere; building it here originates a rule.

- **Frontage / 문폭.** Moved to `.scratch/operational-manoeuvre/`. D9 argues the cap
  deliberately and it is not abolished — what is broken is the removal economy.
- **Interception of a force in transit** (R14). An army still walks through ground it
  does not hold without stopping or fighting. This is *why* a frontage cap would be
  inert, and it is the manoeuvre pass's.
- **Encirclement.** `escape` stays the constant 06c planted. D10 already designs the
  isolated-rout multiplier; Part 2 #2 owns its threshold.
- **The military/civilian fraction of rout survivors.** WM-⑤ rules all of them leave
  service. A fraction needs a destination that does not exist, and **morale is not
  available as its basis** — R13, the user's own ruling, parks it with "do not
  implement a morale term in the 06 family".
- **Supply.** Uniform by scope (06b, R16).
- **Map re-authoring.** Intra-sector terrain needs per-hex authoring and TC-⑪ froze
  the grid.

## Tooling notes that saved real time

- **Use `/usr/bin/git`.** A bare `git` in this repo can report another worktree's HEAD.
  Verify merges with `rev-parse` / `cat-file -p HEAD` (a merge shows two parent lines).
- **Worktree gotcha, if you isolate:** a fresh worktree has no `node_modules`, so
  `tsc` is missing and `verify:game` cannot run. Symlink the main checkout's, remove it
  before committing (`.gitignore`'s `node_modules/` does not match a symlink), and only
  ever `git add` explicit paths. Remove the worktree when the ticket lands — a stale
  one is precisely what makes `git log` untrustworthy.
- **When you run `/code-review`, tell the reviewer what is on `main`.** The 06c review
  reported a hard violation — "R16 does not exist" — because R16 was registered after
  its branch base. Give the agent that context and the false positive disappears. This
  handoff's rulings (ADR 0046, TC-⑮, WM-⑤) all landed **after** any branch you cut
  today, so name them explicitly.

## Suggested skills

- **`/implement`** pointed at the ticket, with an instruction to read ADR 0046 and this
  handoff first. The ticket is fully specified with acceptance items, which is what
  makes it the right entry point.
- **`/tdd`** at the seams `/implement` names. Write against the **emitted artifact**
  (`game/dist/runtime/index.js`, gate 05 D6), never the source.
- **`/code-review`** before merging, per the runbook's loop step 7 — check the
  forbidden-scope list explicitly, because this ticket's main risk is scope creep into
  the manoeuvre pass.
- **`/final-check`** at session close.

## Then the loop closes

06e → 06d (which is now `needs-info` on one owed ruling — see the other handoff's
§ What 06d is waiting for) → **07, where a match ends for the first time**.
