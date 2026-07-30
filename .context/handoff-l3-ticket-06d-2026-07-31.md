# Handoff — capture a sector and integrate it (L3 build ticket 06d)

Written 2026-07-31, immediately after ticket **06e** landed and merged to `main`
(`d52d664`; `main` is at `86d4966`, pushed). This carries only what is **not**
already in the repo; everything else is referenced by path.

It lives in `.context/` rather than the OS temp directory because `AGENTS.md`
registers that directory as the Working-layer home for handoffs, and because it
is tracked — a worktree does not carry untracked files, and this ticket is a
likely worktree candidate.

## Start here

1. `AGENTS.md`, then `.scratch/l3-playable-build/README.md` — § Fresh-session
   preflight and § Implementation loop, followed literally. Note § When
   implementation meets a design problem: this ticket has a live case of kind 1
   (see § The seam the ticket does not know about).
2. `.scratch/l3-playable-build/issues/06d-capture-a-sector-and-integrate-it.md`
   — the ticket. **Read § Needs-info before the checkboxes**, for the reason in
   the next section: the two disagree, and the checkboxes are the stale half.
3. `docs/adr/0044-*` (what acquired land transfers) and `docs/adr/0045-*`
   (province-origin composition stays with the force). These two are the
   ticket's spine and they are also where its hardest question lives.
4. `docs/features/match-arc/RULINGS.md` MT-② — amended 2026-07-31 to sector
   grain — and `DECISIONS-OWED.md` R16/R17/R18.

06d is `ready-for-agent` with **no blockers left**. 06c and 06e are both
`resolved`. Recompute R6's second test at claim time anyway; the ticket's own
§ Two cautions says the header has been wrong before, and it was wrong again as
recently as this morning.

## The ticket contradicts itself, and the checkboxes are the stale half

This is the first thing to get right, because an implementer reading top-down
will build the wrong grain and not find out until the tests.

- The checkbox at *"The conscription register is held per province, not per
  realm"* says `RealmForces.register` becomes **per-province**, `registerOf`
  returns per-province values, and `draftOrder` reads the province.
- § Needs-info, further down, records the user ruling of **2026-07-31**: the
  register moves to **sector** grain, MT-② amended at its birthplace, R18 iii's
  grain clause amended, R17 superseded *for real*. It ends with "Rewrite the two
  checkboxes above accordingly."

**Nobody rewrote them.** § Needs-info wins — it is the later ruling and it names
its birthplace. Rewriting those two checkboxes to sector grain is a reasonable
first commit of this session.

## Two premises in the ticket that are already stale

Verify both yourself before planning around them; both were true when written.

1. **"Ticket 05 flattened it to one realm-level scalar. Restore it."**
   `game/src/domain/state.ts` shows `registers: Record<RegionId, number>` — it is
   **already per-province**, restored by 06a's R19 / ADR 0045 work. So the
   remaining edit is not province-restoration; it is **province → sector**, which
   is a different and smaller diff than the checkbox describes.
2. **`registerOf` is already grain-agnostic.** `game/src/domain/economy.ts`
   takes a sector-id list and returns one number; the *caller* decides the grain
   (`Runtime.open` walks `heldByRegion`). Moving to sector grain may not need to
   change this function at all — only its callers.

## The seam the ticket does not know about

**The register and `OriginComposition` are keyed by the same type, and the
sector-grain ruling only moves one of them.**

```
game/src/domain/force.ts:11   OriginComposition = Record<RegionId, number>
game/src/domain/state.ts:40   registers: Record<RegionId, number>
```

They are joined in at least four places, all of which index one with a key taken
from the other:

- `game/src/runtime/runtime.ts` `#removeDead` — `registers[region] -= fallen`,
  where `region` comes from a cohort's `origins`;
- `game/src/domain/force.ts` `availableCiviliansByOrigin` —
  `registers[region] - serving[region]`, the conservation the whole economy rests
  on;
- `game/src/projection/project.ts` — `ProvinceForcesView`, a projected type whose
  name is the grain;
- `game/src/runtime/runtime.ts` `#resolveRecruitment` — a new cohort is stamped
  `origins: { [sectorRegions[request.sectorId]]: men }`.

So "move the register to sector grain" forces a choice the ruling did not make:

- **(a) move `OriginComposition` with it** — but **ADR 0045 seals it as
  *province*-origin composition**, and `ProvinceForcesView` is a public
  projection shape; or
- **(b) keep origins at province grain and roll sectors up to provinces for the
  join** — but then `availableCivilians = register − serving` needs both at one
  grain, and "a captured sector carries its own register" needs a within-province
  split again, which is exactly what the sector ruling was taken to eliminate.

There may be a clean third reading — the register is *draftable bodies at a
place* while origin is *where a serving body came from*, and those are genuinely
different quantities that need not share a key. **Do not decide this alone.**
Run the README's boundary test in order; if resolving it means writing a
normative statement that does not exist, or if ADR 0045 and the 2026-07-31
ruling cannot both be implemented, it is **kind 1 — stop at the seam and bring
it to the user** with the four-column table the README asks for. If it is
assembly, cite the seals you assembled and write zero new values.

This was found by reading the code, not the docs; it is registered in no ledger
yet. Registering it is worth doing even if it turns out to be assembly.

## What 06e just changed under this ticket

Detail lives in the commits (`b591f4e`, `5e637a6`) and in ticket 06e's
§ Comments. What matters here:

- **Interior sectors are battle sites now** (27 of 56 → all 56). That is why 06d
  is unblocked: a capture is a battle outcome, and interior ground can now have
  one.
- **The two register laws are already split in code and must stay split.**
  `#removeDead` destroys bodies *and* shrinks the register (blood is permanent
  currency); `#leaveService` / `subtractOrigins` remove men from service and
  leave the register alone (WM-⑤). The ticket makes the same point about
  transfer versus casualties. A single conservation invariant across all three
  will fail on casualties and read as a transfer bug — the ticket says so, and
  06e's tests are the worked example (`game/tests/battle-wiring.test.js`, the two
  rout tests).
- **WM-⑤ returns rout survivors to the register at a sector**, which the ticket
  notes is consistent with sector grain "for the first time". That code exists
  now; it is a caller you will touch.
- Three stale comments claiming conquest conversion was undecided are corrected
  (`economy.ts` `holdsOf`, `state.ts` `homeland`, `Runtime.open`). `homeland` is
  still unwritten — deliberately, for this ticket.

## Explicitly not this session's

The user and the main session are handling these two **in parallel**. Do not
resolve, implement, or work around either; if the build meets them, stop and say
so.

- **The capital-guard magnitude conflict** — Part 2 #10, `가안 350 × pop` versus
  `MAGNITUDE.md`'s flat `capitalGarrison 1500`. Two sealed statements that
  disagree; it is one of ticket **07**'s two remaining `needs-info` items.
- **Gate 10's acceptance thresholds** — it owns every ticket's pass/fail bar,
  which is why `verify:game` reports `parity` as PENDING rather than green.

Also out, per the ticket itself: recruitment siting (R19), `conquest damage`'s
definition (seam at identity 1.0), direct recruitment into a garrison.

## Verification and the baseline you must not regress

```bash
npm run verify:game   # typecheck / build:runtime / build:viewer / test:node / test:browser / parity
npm test              # root suite
npm run lint:docs     # documentation governance
```

Baseline on `main` at handoff: **Node 217**, **browser 21**, root **562/562**,
`lint:docs` **0 blocking / 12 advisory**. `verify:game` exits **2**: every lane
PASSes and **parity is PENDING by design** (gate 10 owns the threshold). Both
hosts produce `29f214a11fc56ef8`. Exit 2 with that summary is the expected green.

One advisory is verified-spurious and must stay standing: `conquest damage`'s
ledger row matches a commit message about conquest *conversion*. Different terms.
The lint's own guidance is that a verified-spurious advisory is the correct
outcome — do not "fix" it. Note this ticket puts `conquest damage` in the code
as a named seam, so expect that row to keep matching.

## Tooling notes that cost real time today

- **Use `/usr/bin/git`.** A bare `git` in this repo can report another
  worktree's HEAD.
- **This repo runs concurrent sessions against one shared worktree, and it bit
  us today.** A parallel session's commit (`1319b8c`) landed on the 06e ticket
  branch, survived a rebase, and reached `main` only by riding 06e's merge.
  Before you commit: re-check `rev-parse --abbrev-ref HEAD`. Before you merge:
  run `/usr/bin/git log $(/usr/bin/git merge-base main HEAD)..HEAD --oneline`
  and confirm **every** commit is yours — count them against what you wrote.
- **Worktree gotcha, if you isolate:** a fresh worktree has no `node_modules`,
  so `tsc` is missing and `verify:game` cannot run. Symlink the main checkout's,
  remove it before committing (`.gitignore`'s `node_modules/` does not match a
  symlink), and only ever `git add` explicit paths.
- **`git merge -F -` does not read stdin.** Write the message to a file.
- **When you run `/code-review`, tell the reviewers what is on `main`.** Name
  ADR 0044/0045, MT-②'s 2026-07-31 amendment, and 06e's rulings explicitly — a
  reviewer without that context reports "this ruling does not exist" as a hard
  violation. It happened on 06c and it was avoided on 06e only by naming them.

## Suggested skills

- **`/implement`** pointed at the ticket, with an instruction to read
  § Needs-info before the checkboxes and this handoff's § The seam the ticket
  does not know about first. The skill itself routes to `/tdd` at agreed seams
  and to `/code-review` at the end.
- **`/tdd`** at the register-grain seam specifically. Write against the
  **emitted artifact** (`game/dist/runtime/index.js`, gate 05 D6), never the
  source. The conservation tests are the ones worth writing first, because they
  are what tell province-versus-sector apart.
- **`/code-review`** before merging, per the runbook's loop step 7. Both axes
  earned their keep on 06e: standards caught a rename that only one of seven
  surfaces missed, and spec caught a reading that no seal covered.
- **`/final-check`** at session close.

## Then the loop closes

06d → **07, where a match ends for the first time** — once its own two
`needs-info` items (capital guard, CP-① item 3) are settled in the parallel
conversation.
