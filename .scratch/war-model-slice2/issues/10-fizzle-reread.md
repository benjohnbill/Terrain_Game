# 10 — Fizzle re-read: metric 5 match loop (김빠짐 재판독)

**What to build:** The final verdict harness: a minimal bot-vs-bot match loop
composing every slice-2 system (movement, fatigue, division, intel, window
read, board verbs, sieges, bot exit) over the authored world, measuring
whether this build closes R14 at the source. Reads: white-peace percentage,
annihilations per match, settlement rung distribution — compared against the
recorded L2 baseline (~77% white-peace, 0 annihilations/match). This report
is the evidence input for the slice-2 seal decision (user reads it; the
harness never self-legislates).

Authoritative design: slice-2 design spec §11 (metric 5).

**Blocked by:** 06 — Board verbs + siege; 09 — Bot exit.

**Status:** built + 2-axis reviewed — branch `war-model-slice2-ticket10`
(`742fc67` build, `4152b05` review fixes), 461/461, NOT merged (2026-07-16)

- [x] Deterministic seeded match loop over the authored map with the slice-2
      bot policies. `mockup/operational-layer/war-loop.js`; same coordinates as
      the baseline (CRADLE_MAP, viable 5-seat bindings, seed 42, 32 turns).
- [x] Reports white-peace %, annihilations/match, settlement rung
      distribution side by side with the L2 baseline numbers.
      `mockup/operational-layer/fizzle.js`, `npm run metrics:fizzle`.
- [x] Layer-restoration knobs honored (nothing measured with a silently
      stubbed contradictory layer). Reuses ticket 07's `forEachRestoration`
      (now exported) rather than authoring a second sweep.
- [x] Output format follows the battery report precedent; verdict left to
      the user.

## Decisions this ticket had to make

**Crisis overlay OFF** (handoff finding 4), on three independent grounds, all
printed in the report rather than left to be inferred:
1. The recorded baseline is ITSELF a crisis-OFF measurement (DESIGN-RISKS R14:
   "Crisis-OFF main-arc measurement (2026-07-13, L2 cradle, seed 42)"), so
   overlay-ON would difference two different worlds.
2. R14 asks whether C1+C2 close the fizzle AT THE SOURCE, and the source is the
   crisis-OFF main arc (the crisis is a termination backstop, not the subject).
3. `js/bot-exit.js` is overlay-blind, so an overlay-ON run would be invalid on
   exactly the axis it added.
The overlay-ON axis is NOT MEASURED and stays owned by **ticket 11**.

**White peace is counted by MATERIAL OUTCOME, not by the demanded rung.** A rung
is a claim RATE, so at composite 0 every rung — `maximum` included — moves
nothing. Counting the winner's demanded name reported **0.0% white peace** while
57% of deals moved no land at all. `js/bot-exit.js` makes the same argument about
its own ceiling (:281-286). Both fields are recorded (`demandedRung` + material
`rung`) and the report prints both.

## Findings for the reader (evidence, not verdict)

**Baseline decomposition (handoff finding 1) — the "mix" is not a mix.** At the
recorded coordinates the ~77% is **78.8% `stallPeace` + 0.011% `refusePeace`**
(9 of 79,515 war ends). `refusePeace` is reachable by ONE archetype
(`free-rider`) by the `proposalStep >= 3` arithmetic. The death-forced path
records no cause at all (`eliminate()` takes no `record`), so the baseline
white-peace figure is a **floor**. The recorded headline's attribution to the
stall timer is therefore borne out — but that is the reader's call to make from
the split, not the harness's.

**Pre-emptive white peace (handoff finding 3) SURVIVES, in volume.** The 0% rung
is **49.9%** of war ends in the re-read. Per bot-exit's own flag, the lever for
this is `WINDOW_APPETITE` / the trajectory 가안 — never the sealed acceptance
arithmetic.

## What the two-axis review caught (both defects flattered the build)

**The denominator leaked 30% of wars.** The loop legislated "NO war may end
silently" and broke it three ways (turn envelope, participant dying elsewhere,
an eliminated realm's other wars). The leak is **structurally biased**: retiring
the stall timer converts *timer-forced white peace (counted)* into *wars that
never end (uncounted)* — it deletes exactly the fizzle-shaped wars R14 is about.
Baseline leaked 9.9%, the loop 30.3%: a 20pp asymmetry, all favourable. Fixed —
`endWar` now requires a cause in its signature, so a silent end cannot be
written. Wars started == wars recorded, pinned by test.

**The seed was inert.** `runMatch` built an RNG and never drew from it; seed 1
and seed 999999 returned byte-identical records, and the test asserting the seed
was wired passed only because the *test's* RNG varied the assignment. Now wired
to the fog draw (the baseline's own use of a seed: one stable band per war).

Also fixed: `capitalInReach`'s invented `D.holds.size <= 1` and a bare
`turns <= 1` response window (both fed the sealed acceptance arithmetic) now
derive from one cited rule — one turn's march at `js/movement`'s
`SPEED_HEXES_PER_TURN`, newly exported so consumers cite the dial, not copy `3`.

## Headline needles (full run, `npm run metrics:fizzle`)

The headline is **no-material-outcome %** over wars STARTED — the R14 sense,
same formula on both runs. White peace alone would score the retirement as a
cure for the thing it merely renamed.

| | baseline | re-read |
|---|---|---|
| **no material outcome (R14 sense)** | **80.7%** | **68.7%** |
| ㄴ white peace, named | 78.8% | 37.8% |
| ㄴ of which the stall timer | 78.8% | **0.0%** |
| ㄴ wars that never ended | 8.8% | **18.2%** |
| turns/match | 24.4 | 32.0 |
| eliminations/match | 0.016 | 0.971 (**confounded**) |

`eliminations/match` is NOT presented as a clean delta: the baseline ends 60–70%
of matches early on the hegemony gate, so part of the gap is turns of
opportunity. Same confound that bars `decided%` from being differenced —
applied to both. 섬멸 (BLOCKED rout) 0.394/match has **no baseline analogue**
and is knob-sensitive (~30× across the restoration sweep).

## Disclosed, not fixed (in the report's NOT MEASURED)

- Crisis overlay ON — ticket 11 owns it.
- 2 of 17 authored crossings are **straits** the hex graph cannot cross, so
  those realm pairs never fight (~12% narrower war graph than the baseline's
  per-front abstraction).
- `capitalInReach` diverges from the baseline's stage-machine definition by
  necessity (the stage machine is what ADR 0037 indicts), so the settlement mix
  is not term-by-term comparable — only the material outcome is.
- The sweep runs 1 rep/cell while the headline runs 4, and the headline sits at
  the least-restored cell.
