# Define the First Playable Vertical Slice

Type: grilling
Status: resolved (sealed 2026-07-25, user grill; blockers 02/03/06/07 all resolved)
Blocked by: 02, 03, 06, 07

> **⚠️ Pivot caveat (ADR 0042, 2026-07-25) — re-cut before grilling.** Blockers
> 02/03/06/07 are all resolved, and the war-termination long pole (the
> out-of-band blocker in `map.md` that "gate 08 cannot close without") is
> **resolved by the 1v1 duel pivot**, not by a war-model tuning pass. Several
> Decision constraints below reference the **superseded** war-ending model: the
> ADR 0038 three-channel composite is amended by **ADR 0042 (capital fall = the
> sole win condition)**; the R14 fizzle placeholder is reframed (anti-fizzle is
> now structural — 1v1 + mutual-exposure + land-derived decay); and the win
> condition is capital fall, not a hegemony/composite check. Before grilling,
> re-cut this gate's constraints and option space against the pivot (as the
> 2026-07-17 audit re-cut the gates). The pivot **sharpens** the slice: the
> stopping point is now cleanly **"a capital falls."** Read-order add: ADR 0042,
> `docs/features/capital/` CP-②, the duel-pivot ledger + premises, memory
> `terrain-game-duel-pivot`, and the amended `SPEC.md`.

## Question

What exact player journey proves the authored world, Slice 1–2 war engine,
Standard Fog, React UI, and Game Runtime are genuinely joined rather than
merely scaffolded? Fix the match mode, starting state, commands, feedback,
turn progression, bot participation, and stopping point for the first
end-to-end slice.

## Decision constraints

- The slice must cross the sealed Runtime seam from viewer projection through
  preview and intent submission to ordered events and a refreshed projection
  ([issue 02](02-define-game-runtime-authority.md)).
- The slice must make functional Fog observable; a development disclosure or a
  truth-backed UI fallback cannot satisfy it.
- Position changes through operation outcomes and route/reachability rules. A
  standalone move command is forbidden by `DOMAIN_MAP.md:245-255`.
- The slice may depend only on war behavior implemented against the accepted
  model. It must not exercise a known R14 placeholder scheduled for replacement
  (`docs/DESIGN-RISKS.md:30,38`; `docs/features/war-model-build/REQUIREMENTS.md`).
- It must not inherit the legacy last-faction-standing or 70%-hex-control win
  checks in `js/game.js:448-465`; ADR 0038 defines the accepted war-ending
  composite.
- The slice must be independently demoable and small enough for one fresh
  implementation context. It is not a build-tool-only or Runtime-only layer.

## Evidence-based option space

### A. Reconnaissance-first command cycle

Start on the authored world, show a viewer projection, inspect an uncertain
front sector, preview reconnaissance, submit it, render the resulting events,
and show the narrower estimate changing situation judgment and the next preview.

- **Strength:** proves the projection blur seam and Fog payoff without depending
  on unfinished R14 combat paths.
- **Cost:** does not yet prove that the war engine can resolve player combat.

### B. Settled atomic combat cycle

Select a front sector, preview an attack from viewer-safe information, submit
the operation, resolve only the settled per-sector/atomic behavior available at
implementation time, and show control, route, fatigue, and reachability products.

- **Strength:** proves the intended seam against the central war interaction.
- **Cost:** blocked until every invoked war behavior is implemented against the
  accepted model; using the retired stage machine to unblock it is prohibited.

### C. Full turn or full match immediately

Include human action, bot callers, repeated turns, legal war ending, and match
ending in the first slice.

- **Strength:** strongest product evidence if it succeeds.
- **Cost:** too many unresolved contracts and R14 dependencies for the first
  tracer; failure would not localize whether the problem is map, Fog, Runtime,
  combat, bot policy, or ending.

## Recommendation

Choose A as the first seam-proving tracer, then make B the first war-bearing
slice as soon as its exact accepted behavior is available. Treat C as the L3
acceptance chain, not the first implementation ticket. The honest cost is that
the first tracer proves playability infrastructure and information judgment,
not the full Mission; the later combat and match slices remain mandatory.

This recommendation does not resolve the gate. The user chooses the exact
starting state, journey, and stopping point after the Fog presentation prototype
and authored-world contract are available.

## Answer — sealed 2026-07-25 (user grill)

**Re-cut against ADR 0042 first (per the pivot caveat).** The pre-pivot options
A/B/C were framed as a one-actor "inspect -> preview -> submit -> render" cycle.
The 1v1 pivot makes the turn a two-sided **simultaneous blind commit ->
simultaneous reveal & resolution** (ledger Gate 6 / D6.1), so the slice's spine is
the poker showdown, not a one-sided command->render. Constraint #4 (avoid the R14
placeholder) dissolves — anti-fizzle is structural (ADR 0042 sec.3), no placeholder
to avoid; the surviving core is "depend only on combat actually built against the
accepted model." Constraint #5 updates — ADR 0038's three-channel composite is
collapsed; the terminus is **capital fall, the sole win condition** (ADR 0042 /
CP-②). Constraint #6 ("small enough for one fresh context") is **deliberately
departed from** — see Scope trade.

**A design-state audit (2026-07-25, sub-agent) overturned the initial "operation
layer is undesigned" read:** the magnitude pass was executed (combat-formula
MAGNITUDE.md M1–M14, L2-battery-validated). Operation-plan **selection** is
designed AND numbered (per-plan thresholds M7, six-axis stamps M8), the
combat-balancing formula is designed+numbered (FORMULA D1–D11), and the
plan-vs-plan roshambo layer is designed+numbered (MATCHUP.md, 21-cell). The genuine
gap is **implementation** (the archive `js/battle.js` codes only the R-ratio core +
Stronghold/Delaying + an implicit Swift-Seizure; the rest is uncoded), not design.
Stripping plan selection would also contradict the sealed EVAL BAR, whose threshold
needles ARE the operation-plan thresholds.

**The slice (all seven dimensions fixed):**

1. **Match mode** — a real, complete 1v1 duel match, human vs bot, at full
   compound depth. (Upgraded from the minimal "poker-spine tracer" once the audit
   showed depth is an implementation, not a design, cost, and once the user fixed
   "real, undistorted data" as the goal.)

2. **Starting state** — reuse the terrain-cradle terrain (CANONICAL_MAP: 10 regions
   / ~49 sectors, varied terrain + sector-level choke/adjacency graph, per-sector
   value/garrison/fort), not a fresh board. Each match draws a **random
   balanced-contiguous 2-realm partition** (ADR 0019 "fog owns replayability"
   dynamic-assignment pattern, applied to 2-realm bindings; balanced by
   **population** per the SPEC equal-blood-budget seal, not by region count;
   enumeration reuses the L2 sheet-14 viable-binding harness). Each player
   **chooses their capital** within their realm (CP-② D1.3, simultaneous reveal).
   Equal starting population, asymmetric geometry. The center region's multipolar
   "exposed on 4 fronts" device dissolves in 1v1 (one enemy) -> it goes wholesale to
   one side, balanced by population — a variety axis, not a defect.

3. **Commands / combat** — the **full designed operation layer**, built against its
   authoritative contract (ADR 0041 re-implementation, not archive import):
   operation-plan **selection** (differentiated plans, M7 thresholds + M8 six-axis
   stamps); the **plan-vs-plan roshambo/matchup layer INCLUDED** (engage / discount
   / bypass / erode / throttle / refuse, MATCHUP.md 21-cell — the largest new build,
   zero archive code); the **행동력 single non-hoardable chip stack** allocated
   across all order-kinds (D6.3), spreading thins each front's relative ratio
   (defeat-in-detail emergent); future-lever investment (reconnaissance, recovery)
   across turns; Standard Fog (reach cone, estimate band, border alarm); fatigue,
   field-army division, movement/supply predicate, terrain/fortification defense,
   rout/escape; the **capital guard** (land-derived garrison) and **capital-fall**
   check, fall path = **overwhelming decisive battle only** (Moscow-trap
   encirclement/starvation deferred to a later slice). No standalone move command
   (position changes through operation outcomes).

4. **Feedback** — the sealed **EVAL BAR** (tactical R confidence band; LEFT =
   clicked front's R, RIGHT = eligible-fronts average) + the gate-07 commit-first
   read layer (커밋량 -> 행동 소환 -> 세부 -> 지역 빛남 -> 지목). The slice
   exercises these; it does not re-decide them.

5. **Turn progression** — simultaneous blind commit -> simultaneous reveal &
   resolution (D6.1); three-tier phase skeleton (decision ② / payoff ④
   non-demotable / background ①⑤ auto-fold, D6.2); the single chip stack (D6.3).
   The slice implements the sealed structure.

6. **Bot participation** — a **rational actor that plays through the same
   instruments as the human**: from its own fog projection it computes the
   per-front tactical-R (LEFT) and eligible-fronts average (RIGHT) bars and the
   operation-plan threshold needles, and reasons over those reads (attack where its
   front-R exceeds its average = the soft spot; defend where the enemy's threat
   exceeds its own). The unmeasurable judgment calls — commit sizing, plan choice
   among viable, capital-strike gamble timing, exposure tolerance — are governed by
   a **disposition** parameter within a rational range; it plays the *range* under
   the same irreducible uncertainty as the human (the enemy's blind simultaneous
   commit), not an optimal solver. Slice 1 ships **one balanced disposition**;
   disposition variants are an iterate axis. The archive multipolar bot is discarded
   (its "which rival / war-appetite" logic is moot in a 1v1); only the disposition
   concept and the deterministic read-primitives survive. Bots remain ordinary
   callers through the sealed door (C02.5).

7. **Stopping point** — a **real full match run to capital fall** at its natural
   player-paced length (D6.4), with **no compression or speed-up that alters
   outcome** (presentation pacing only, C02.7 — determinism keeps accelerated and
   un-accelerated runs identical; logic shortcuts are barred as data-distorting). A
   **victory screen is mandatory**. No legacy last-faction / 70%-hex win-checks;
   capital fall is the sole terminus (ADR 0042).

**Scope trade (honest cost).** Constraint #6's "small enough for one fresh context"
is deliberately traded away. The slice is bounded in feature set (single map basis,
decisive-battle fall path only, one bot disposition, human-vs-bot only, grey-box, no
settlement negotiation / reserve / multi-stage operations) but is full-**depth** —
effectively the L3 game built to a first complete match. It is therefore a **build
program** (internally sequenced: a legal-caller loop first, then depth, then the
bot, then the full match), not a one-ticket tracer. The traded-away benefit is
failure localization; the bought benefit is undistorted, real-play data — the user's
explicit priority.

**Iterate targets (Agile loop: play -> data -> tune).** The 2-realm partition and
terrain balance, and the bot's judgment-policy quality. Both are expected rough on
first play (data-gathering, not a balanced showcase), consistent with the
terrain-cradle map spec's own manual tuning loop (L3 playtest is the fun arbiter; L2
maps are good-enough candidates).

**Promotion owed at spec authoring (Working-layer for now).** The "reuse
terrain-cradle terrain + random balanced 2-realm partition per match" decision spans
terrain-cradle + the pivot; register it for a terrain-cradle doc note / ADR when the
build specs are authored (documentation law: ticket answers are Working-layer
evidence; cross-feature architecture promotes via the ADR protocol at spec time).
Recorded in `docs/SYNC-DEBT.md`.
