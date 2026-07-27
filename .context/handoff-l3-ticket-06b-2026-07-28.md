# Handoff — close L3 build ticket 06b, then run the loop to capital fall

Written 2026-07-28. The previous session landed 06b's ledger arithmetic and
re-cut the ticket's scope with user approval. This document carries only what is
**not** already in the repo; everything else is referenced by path.

## Start here

1. `AGENTS.md`, then `.scratch/l3-playable-build/README.md` (§ Fresh-session
   preflight and § Implementation loop — follow it literally).
2. `.scratch/l3-playable-build/issues/06b-run-the-fatigue-and-supply-ledger.md` —
   read the **RE-CUT 2026-07-28** block at the top before anything else. It is
   the ticket's current mandate and it narrows the original one.
3. `git log --oneline -3` on this branch. The work is `0ee7612`.

## Where the work lives

- **Worktree** `~/dev/Terrain_Game-06b`, branch `l3/ticket-06b-fatigue-supply`,
  based on `d7be9ae`. The main checkout was dirty with a parallel session's
  governance work, which is why this is isolated (preflight condition 4).
- **Gotcha:** a fresh worktree has **no `node_modules`**, so `tsc` is missing and
  `verify:game` cannot run. The previous session symlinked the main checkout's
  `node_modules` in, used it, and **removed it before committing** — the
  `.gitignore` pattern is `node_modules/` with a trailing slash, which does not
  match a symlink, so an `-A` style add would have committed it. If you re-link
  it, remove it again before committing, and only ever `git add` explicit paths.
- Nothing here is merged to main yet. Main's copy of the ticket carries a pointer
  line to this branch.

## What is done

`game/src/domain/fatigue.ts` (pure, exported through `runtime/index.ts`) plus
`game/tests/fatigue-ledger.test.js` (23 pass, run against the emitted artifact
per gate 05 D6). The full evidence record is in the ticket's `## Comments` —
do not re-derive it. Verified at `0ee7612`: `verify:game` typecheck /
build:runtime / build:viewer / test:node 184 / test:browser 19 all PASS, parity
PENDING by design, root `npm test` 493/493, `lint:docs` 0 blocking.

## What is left, and it is small

The ticket's checklist is current — items 1, 3, 4, 6 and the negative half of 8
are checked. The remaining work:

1. **Call `turnUpkeep` in the background tier**, per force, in a deterministic
   order. `Runtime.#resolveTurn()` in `game/src/runtime/runtime.ts` is the seam —
   the background block sits after `#resolveIncome()` and before `state.turn += 1`.
   Nothing calls the ledger today, so **recovery never runs**; that is the gap.
2. **Emit an upkeep event** so recovery is visible in the reveal, matching the
   shape of the neighbouring `#turnEvent` calls.
3. **Supply level is uniform in this slice** — every force supplied. Express it as
   a named seam with the re-cut's reasoning, not a bare `1`: the plan that cuts
   supply is not built, so supply cannot be cut. Then **assert by test that no
   code path treats a capital sector differently**, which is what ticket 07 item 7
   requires of this ticket.
4. **Do not add a `supply` field to match state** (user-approved 2026-07-28). It
   would be a dead field in this slice; the account arrives with its consumer when
   R16 lands. Document that state's existing `fatigue` is the *wear* ledger so
   nobody collapses the two accounts into one number.
5. Append evidence per the README's § Verification evidence format, set
   `Status: resolved`, and merge per the tracker's merge-per-ticket convention.

## Then the loop closes

06c → 06d → 07, and **07 is where a match ends for the first time.** Notes that
save a re-derivation:

- **06c**: the pure calculator already exists (`game/src/domain/battle.ts`,
  landed ahead in parallel at `2663eba`/`2010d1a`). 06c is the adapter and the
  wiring, not the formula — its own SPLIT note says so, and it owns passing the
  wear ledger's effectiveness into the per-side product. Its header was
  re-stamped `ready-for-agent` on 2026-07-27; its values landed 2026-07-26.
- **06d** is `ready-for-agent` and carries zero supply dependence.
- **07** needs only the negative supply guarantee described above. Its
  § Scope boundary defers the Moscow-trap fall path (encircle, cut, starve) to a
  later slice; the supported path is the decisive battle alone.

## What was deliberately deferred, and where it lives

**R16 in `docs/DESIGN-RISKS.md`** (registered `be0b96a`) — the supply design
pass: how a force is provisioned, how supply can be attacked, and how that ties
to geometry. It opens as a grill **with the plan layer at tickets 10/11**, when
Scorched Earth / Supply Interdiction / Encirclement are playable objects instead
of prose. Do not open it earlier and do not answer its agenda in passing; the row
explains why the timing is deliberate.

Also open, recorded in `docs/SYNC-DEBT.md` (same commit): the superseded staged
starvation model still lives in `DOMAIN_MAP.md` `Standing world rule` and in
`CATALOG.md` § Supply Interdiction. Stamp work, not a ruling — but the rewrite
must choose which subject it means (a sector's route state, or a force's ledger).

## Context worth carrying

- **The supply reframe** (R16's row holds it in full): sustainment is a ratio —
  the ground's sustaining power against the force standing on it — so "wasteland
  / scorched / isolated" are three symptoms of one quantity. Provisioning eats the
  *usable* layer, which recovers; Raid and Scorched Earth cut the *base*, which
  does not. Rear reach is an independent second input.
- **The authored chain already exists.** CATALOG § Scorched Earth calls it the
  Moscow trap and states it needs no new mechanics: burn, lure, cut, annihilate,
  ending at the AGREED `Isolation gate` and Encirclement. If a future session
  thinks supply needs inventing, it has not read that passage.
- The first slice's honest consequence: **wear is a self-managed marching tax**,
  not something an opponent can attack, because both recovery-denial tools
  (cut supply, ash ground) are plan-layer.

## Suggested skills

- `/implement` — pointed at the ticket path above. It is the right entry point:
  the ticket is a fully specified unit of work with acceptance items.
- `/tdd` at the seams `/implement` recommends. The narrowest failing test first;
  the ledger half was built that way.
- `/code-review` before merging, per the README's loop step 7 (check for forbidden
  scope: duplicated definitions, truth fields in viewer surfaces, Runtime sleeps).
- `/final-check` at session close — it runs this repo's session-close ritual,
  including `npm run lint:docs` and the debt-ledger duty.
