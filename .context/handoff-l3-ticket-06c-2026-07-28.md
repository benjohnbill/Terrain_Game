# Handoff — wire the decisive battle (L3 build ticket 06c)

Written 2026-07-28, immediately after ticket 06b landed and merged (`7a726ed`).
This carries only what is **not** already in the repo; everything else is
referenced by path. It is deliberately in `.context/` rather than a temp
directory, because `AGENTS.md` registers that directory as the Working-layer home
for handoffs and a worktree does not carry untracked files.

## Start here

1. `AGENTS.md`, then `.scratch/l3-playable-build/README.md` — § Fresh-session
   preflight and § Implementation loop, followed literally.
2. `.scratch/l3-playable-build/issues/06c-resolve-the-decisive-battle.md` — read
   the **SPLIT 2026-07-26** note first. `game/src/domain/battle.ts` already
   exists, so this ticket is **the adapter and the wiring, not the formula**.
3. `.context/handoff-codex-06c-battle-calculator.md` — how the calculator half was
   scoped and built (commits `2663eba`, `2010d1a`).
4. The 06b ticket's `## Implementation evidence` section — the contract you are
   about to consume.

`main` is at the 06b merge. Ticket 06c is `ready-for-agent`, and its only
implementation blocker (06b) is now `resolved`.

## The one wiring fact most likely to become a silent bug

**The state field and the calculator input are different quantities with the same
name.**

- `Detachment.ready.fatigue` (and each `pending[].fatigue`) is the **wear
  ledger** — an unbounded accumulator, 0 upward, ~1 per marched hex.
- `BattleSide.fatigue` in `battle.ts` is the **effectiveness multiplier** —
  bounded `[0.5, 1.0]`.

The conversion is `effectiveness(wearLedger)` from `domain/fatigue.ts` (exported
through `runtime/index.ts`). Passing the ledger straight into `fatigue:` compiles,
type-checks, and multiplies a tired army's power by 9 instead of 0.83. **This is
item 8's positive half, which 06b explicitly left to this ticket** — 06b only
proved the retired flat `0.75` was not reintroduced as a hidden constant.

Three consequences worth deciding deliberately rather than by accident:

- **A front can have several assigned detachments with different wear.** The
  established convention for combining cohort wear is a **men-weighted mean** —
  see `force.mergeDetachments` and `force.activateReadyCohorts`, both of which
  carry `fatigueMass / totalMen`. Reuse that shape rather than inventing a second
  rule; `force.mapCohortFatigue` (added by 06b) is the walk over a detachment's
  cohorts if you need one.
- **Garrisons have no wear ledger at all.** `GarrisonForce` carries no fatigue
  field, because nothing in this slice marches one — 06b states this boundary in
  `#resolveUpkeep` and in the ticket evidence. So garrison substance enters the
  product at effectiveness ×1.0 **by construction**, which is exactly what item 5
  wants ("an unattended garrison fights at its own strength"). Do not add a
  garrison fatigue account to make the code look symmetric; that would be a new
  system.
- **`battleAccrual(ownCasualtyFraction)` exists and nothing calls it.** It is the
  wear ledger's *second source* and 06c is its consumer. The tier structure
  already decides the ordering: battle is payoff, upkeep is the background tail,
  so battle wear accrues and then takes one recovery in the same turn — the same
  arithmetic a march gets. Note the practical consequence before tuning anything:
  at WB-M①'s L1 values a full-speed march nets **+1 wear/turn** and one resting
  turn erases a whole march (registered on dial 9's `docs/SYNC-DEBT.md` row), so
  battle at coefficient 40 will dominate the ledger by a wide margin.

## Three inputs the calculator demands that the board does not yet supply

`resolveBattle` takes every value from its caller by design. Three have no source
in `game/src` today, and each is a decision about *where the honest seam is* — not
a value to invent. 06b's precedent for this shape is `FULLY_SUPPLIED` in
`runtime.ts`: a named constant whose comment states it is a **consequence of
scope**, with a pointer to whoever owns the real answer.

- **`escape: 'OPEN' | 'BLOCKED'`** — this is where **Encirclement** lurks, and the
  ticket is explicit that Part 2 #2 (M7 says 2.2, the duel ledger says 1.92) must
  **not** be resolved by implication here. Deriving `BLOCKED` from board geometry
  would answer it. This is 06c's counterpart to the supply-base question that
  blocked 06b; treat it the same way — take the reading that assumes nothing, name
  the seam, and record it.
- **`fortification`** — the world schema (`game/src/world/schema.ts`) authors
  `terrainLayer` per hex and `choke` per edge, and **no fortification at all**.
  Check before assuming; if it is genuinely unauthored, `none` is a scope
  consequence, not a chosen value.
- **`quality`** — nothing in `game/src` produces it (grep confirms only a passing
  mention in `economy.ts` prose). Same treatment.

`terrain` and `crossing` *do* have sources — hex `terrainLayer` and the authored
edge `choke` — and ADR 0015 is emphatic that the river crossing prices **the
engagement, not the movement**, so it must not leak into 06a's movement graph.

## The structural question to settle before writing code

Ticket 03's stub lives in `domain/turn.ts`: `readFronts` returns
`outcome: 'pending-operations'` (turn.ts:127), and the Runtime calls it from
`#readReadyFronts`. `readFronts` is pure and today receives only the revealed
turn plus the front list; a battle additionally needs substance, garrisons,
terrain, fortification, and effectiveness.

Two shapes are available: grow `readFronts`' inputs, or add a pure adapter beside
`battle.ts` and let the Runtime assemble its arguments. The repo's grain favours
the second — `battle.ts`'s own header says "callers supply every ledger-derived
value", and `domain/state.ts` keeps single readers (`frontsOf`, `holdingsOf`) for
exactly the questions the Runtime and the projection both ask. Decide it once,
out loud, in the module comment.

`turn.ts`'s enumerated **case 4** (turn.ts:40–47) is explicitly deferred to this
ticket: `r7_s0` is a real sector serving two different region borders, so one
realm can press it from two sides. The turn loop already ruled they stay two
fronts; whether two pressures on one sector merge into one engagement is 06c's.

## Process notes that saved real time this session

- **`/implement` then `/tdd` at the seams it names.** Write the narrowest failing
  test against the **emitted artifact** (`game/dist/runtime/index.js`, gate 05
  D6), never the source. A new test file for the wiring beside the calculator's
  existing unit tests is the pattern: `game/tests/fatigue-upkeep.test.js` sits
  beside `fatigue-ledger.test.js` exactly that way.
- **Compose expected values from exported dials, never literals.** A review
  finding this session, and it is the documentation law's single-definition rule
  reaching into tests: `3 * MARCH_FATIGUE_PER_HEX - RECOVERY_BASE_RATE`, not `1`.
- **A new public event costs five edits, not one.** `upkeep-resolved` had to be
  whitelisted in `Runtime.#globallySafeResolutionEvents` **and** in
  `game/acceptance/replay.js`'s `GLOBALLY_SAFE_EVENT_TYPES` (they mirror each
  other), and four tests assert the exact event list and tier list:
  `turn-loop.test.js` ×2 and `tests/browser/boot.spec.js` ×2. Follow
  `realm-recomputed`'s precedent for a background-tier event — the *fact* that a
  realm's beat ran crosses `submit()`, the numbers stay behind `view(actor)`.
  Combat outcomes will need a harder look at that line than upkeep did.
- **Use `/usr/bin/git`.** A bare `git` in this repo can report another worktree's
  HEAD; verify merges with `rev-parse` / `cat-file -p HEAD` (two parent lines).
- **Worktree gotcha, if you isolate:** a fresh worktree has no `node_modules`, so
  `tsc` is missing and `verify:game` cannot run. Symlink the main checkout's,
  remove it before committing (`.gitignore`'s `node_modules/` does not match a
  symlink), and only ever `git add` explicit paths. Note `~/dev/Terrain_Game-06b`
  is still on disk pending the user's cleanup decision, and a stale worktree is
  precisely what makes `git log` untrustworthy.
- **When you run `/code-review`, tell the reviewer what is on `main`.** Both axes
  ran well this session, but the Standards agent reported a hard violation —
  "`R16` does not exist" — because R16 was registered on `main` *after* the branch
  base and so was absent from the worktree it was reading. Give the agent that
  context up front and the false positive disappears.

## Out of scope, and absent rather than approximated

- **Taking ground.** Ownership transfer, the homeland/limbo record, and the
  register's re-cut to per-province are **06d**'s (R18 iii).
- **The Encirclement threshold** (Part 2 #2) — see above.
- **Supply.** R16 in `docs/DESIGN-RISKS.md` owns the whole supply design pass and
  opens with the plan layer at tickets 10/11. Supply is uniform in this slice by
  scope, so no battle outcome may consult a supply state, and the Moscow-trap fall
  path stays deferred (ticket 07 § Scope boundary).
- **Capital relocation (천도)** — ruled out of the whole build program.

## Verification and the baseline you must not regress

```bash
npm run verify:game   # typecheck / build:runtime / build:viewer / test:node / test:browser / parity
npm test              # root suite
npm run lint:docs     # documentation governance
```

Post-06b baseline on `main`: **Node 193**, **browser 21**, root **513/513**,
`lint:docs` **0 blocking** (10 advisory `ledger-possibly-paid` guesses on
unrelated rows — pre-existing). `verify:game` exits **2**: every lane PASSes and
**parity is PENDING by design**, because Wayfinder gate 10 owns the
bit-exact-versus-epsilon threshold. The two hosts do produce identical projections
(`29f214a11fc56ef8`). An exit code of 2 with that summary is the expected green.

Item 10 also asks for the **surge price curve to be re-measured early** in this
ticket — it never fired in ticket 05 because its trigger is register erosion from
deaths, and ticket 05 had none. The row is in `docs/SYNC-DEBT.md`.

## Suggested skills

- **`/implement`** pointed at
  `.scratch/l3-playable-build/issues/06c-resolve-the-decisive-battle.md`, with an
  instruction to read this handoff first. The ticket is a fully specified unit of
  work with acceptance items, which is what makes it the right entry point.
- **`/tdd`** at the seams `/implement` names. The narrowest failing test first;
  06b's two halves were both built that way.
- **`/grilling`** *before* code if the escape-state seam feels like it wants an
  answer. A seam that decides Encirclement by implication is worth ten minutes of
  adversarial pressure, and the user is the decider on a seal conflict (README
  § When implementation meets a design problem, kind 1).
- **`/code-review`** before merging, per the runbook's loop step 7 — check the
  forbidden-scope list, and tell the sub-agents what landed on `main` recently.
- **`/final-check`** at session close; it runs the session-close ritual including
  `lint:docs` and the debt-ledger duty.

## Then the loop closes

06c → 06d → **07, which is where a match ends for the first time.** 06d is
`ready-for-agent` and carries zero supply dependence. 07 needed only the negative
supply guarantee, which 06b has now paid.
