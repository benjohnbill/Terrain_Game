# Handoff — slice-2 ticket 10 (fizzle re-read, metric 5)

Untracked working handoff. Written 2026-07-16 at the close of the ticket 08+09
session, for a fresh-context session to implement ticket 10.

## Where the build stands

Slice-2 tickets 01–09 are all landed. Ticket 10 is the **terminal gate**: the
evidence input for the slice-2 seal decision. The user reads the report; the
harness never self-legislates.

| Ticket | State |
|---|---|
| 01 fatigue · 02 movement · 03 engagement v2 · 04 division/commit · 05 intel v2 · 06 board verbs | merged to main |
| 07 measurement grid (metrics 1–4) | merged to main (`mockup/operational-layer/`) |
| **08 window read · 09 bot exit** | branch `war-model-slice2-ticket08-09` (5 commits, tip `ba716c7`) — **merge before starting 10** |
| 10 fizzle re-read | THIS TICKET — blocked by 06 ✓ + 09 (merge first) |
| 11 stall-timer retirement | blocked by 10; created 2026-07-16 |

Ticket file: `.scratch/war-model-slice2/issues/10-fizzle-reread.md`.
Authoritative design: slice-2 spec §11 (metric 5).

## What ticket 10 builds

A deterministic seeded bot-vs-bot match loop over the authored world, composing
every slice-2 system, measuring whether this build closes **R14 at the source**.
Reports white-peace %, annihilations/match, settlement rung distribution against
the recorded L2 baseline (**~77% white-peace, 0 annihilations/match**).

## The parts it composes (all pure, all landed)

- `js/fatigue.js` — wear/supply ledgers, `effectiveness`, `turnUpkeep(state, supplyLevel, recoveryFactor)`
- `js/movement.js` — `buildGraph`, `shortestPath`, `marchStep`, `isSupplied`; speed S=3
- `js/battle.js` — `resolveEngagement` (STRONGHOLD/DELAYING), `sidePower`, `commitLever`, `shieldPower`
- `js/field-army.js` — `split` / `merge` (fatigue conservation)
- `js/commit.js` — `pool` / `allocate` / `renew` (one non-bankable realm pool)
- `js/intel.js` — `reachCone`, `observeDetachment`, `ageDetachment`, `detachmentBand`, `borderAlarm`
- `js/board-verbs.js` — `abandon`, `scorchedEarth`, `siegeUpkeep`
- **`js/window-read.js` (08)** — `windowRead`, `readFronts`, `bestTarget`, `declaration`, `applyFeints`
- **`js/bot-exit.js` (09)** — `decideExit` → `{settle, ceiling, signable, position, bundle}`; `position`, `trajectory`, `acceptableRungs`

## What 07 already gave you (do not rebuild)

`mockup/operational-layer/probe.js` — exports `NEUTRAL_KNOBS, DIALS, resolveWith,
marchArrival, corridorMap`. It re-composes the STRONGHOLD chain with the two
stubbed defense layers exposed as knobs (`fillFactor` = M9 tactical fill at the
sealed ×0.5; `shieldCommit` = the shield-layer commitment). **`NEUTRAL_KNOBS`
reproduce `resolveEngagement` exactly** — there is a drift guard test.

`mockup/operational-layer/metrics.js` — metrics 1–4, with `RESTORATION` +
`forEachRestoration` sweeping `fillFactors [0,1] × shieldCommits [null,8] ×
recoveries [true,false]`. Run: `npm run metrics:slice2`.

Its header states the seam explicitly: *"Metric 5 (fizzle re-read vs the L2
baseline) needs bots and lands with ticket 10 — it is out of this ticket's scope
by the §11 split."* Ticket 10 fills exactly that hole. **Reuse `forEachRestoration`
for the layer-restoration acceptance item** rather than authoring a second sweep.

The L2 baseline harness itself is `mockup/combat-calc/tournament.js` (bot
archetypes, `pickTarget`, `trySettle`, war loop) + `match.js` (settlement
arithmetic). Ticket 10 builds a NEW loop; it does not edit that one.

## Findings from the 08/09 session that ticket 10 MUST honor

These came out of the ticket-09 two-axis review and are recorded in
`.scratch/war-model-slice2/issues/09-bot-exit.md`. They change what the report
may claim.

1. **The ~77% baseline is a MIX — break it down by `cause` before attributing
   any delta.** `tournament.js` has three `returnOccupied` call sites, all
   reaching the identical 0% material outcome: `stallPeace` (1347, the timer),
   `refusePeace` (1366 — a lenient winner that will not storm thrones), and a
   death-forced one (~1026). A headline implying the stall timer alone drove 77%
   is a false verdict. Ticket 09's bot-exit replaces only the **loser's** will
   breaking; the **winner's** (`refusePeace`) has no counterpart yet.
2. **Metric 5's rung distribution must come from the RESOLVED rung, not from
   bot-exit's `ceiling`.** `decideExit` returns the loser's acceptance *ceiling*
   (the most it can afford to concede) plus the whole `signable` set. The sealed
   walk has the WINNER propose from its archetype preset and concede one step per
   turn (ruling ⑧: claim rate = rejection risk). The settled rung = the winner's
   demand **capped by** the ceiling. Reading `ceiling` as the settlement skews the
   distribution high.
3. **Pre-emptive white peace is the 가안 to watch.** A court that reads itself
   losing before the enemy sword has reached anything (composite ≈ 0) signs
   `whitePeace` — rational, but a white-peace source. If the fizzle survives in
   this shape, the lever is bot-exit's `WINDOW_APPETITE` / trajectory 가안 (how
   early a court calls itself beaten), **never** the sealed acceptance arithmetic.
4. **bot-exit is overlay-blind (CE-⑳), owned by ticket 11.** `acceptableRungs`
   walks the full sealed ladder and knows nothing of `tournament.js
   availablePresets` (stage ≥2 drops 백지/관대; stage ≥3 leaves only 최대). If
   ticket 10 runs the crisis overlay ON, a bot court will sign `whitePeace`
   during total war, which CE-⑲/⑳ forbids — the measurement would be invalid on
   that axis. Either run metric 5 with the overlay OFF (and say so), or pull
   ticket 11's open-rungs input forward. **Do not measure past this silently.**
5. **08's numerator "budget slack" is a caller-supplied slot.** `windowRead`
   takes `attacker.commit`; it never consults `js/commit.js`. The match loop is a
   caller — it must draw the allotment from the pool (one pool, spec §4) and pass
   it in. This is the wiring that was deferred, and ticket 10 is where a real
   consumer first exists.

## Conventions

- Pure `js/` modules, node-only instruments under `mockup/`. `js/` never imports
  the mockup; port sealed values **with a birthplace citation**, never re-cut
  (`battle.js` header is the template).
- Code identifiers are **English canonicals**; the 한국어 표시어 is a display
  *value*, never a key (documentation-law Vocabulary Law; `bot-exit.js PRESETS`
  is the worked example after its review).
- Tests: `node:test` + `node:assert/strict`, `require` the module directly.
  Suite must stay green — **410/410** on the 08/09 branch.
- Report format follows the battery precedent (`npm run battery`); **verdict left
  to the user**.
- Per-ticket context clear; commit to a feature branch, do not merge to main.

## Suggested first moves

1. Confirm the 08/09 branch is merged (`git log --oneline -1` should be past
   `ba716c7`); `npm test` green.
2. Read `.scratch/war-model-slice2/issues/10-fizzle-reread.md` + spec §11.
3. Decide the overlay question (finding 4) **before** writing the loop — it
   changes what the run can claim.
4. Break the recorded baseline down by cause (finding 1) so the comparison is
   like-for-like.
