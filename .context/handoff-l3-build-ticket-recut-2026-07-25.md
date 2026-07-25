# Handoff — L3 build-ticket RE-CUT (post gate-08 full-depth-match seal)

Date: 2026-07-25. Repo: `/home/benjohnbill/dev/Terrain_Game`, branch `main`.
Prior session sealed **L3 Wayfinder gate 08** (commit `2f50957`) and closed the
last real Wayfinder grill gate. This session's job is ONE thing:

> **Re-cut the `.scratch/l3-playable-build/` tickets against the 1v1 pivot
> (ADR 0042) + the gate-08 full-depth-match definition. This is a ticket-cutting
> / planning pass — NOT a Wayfinder re-run.**

The ticket re-cut **sketch below is a SEED**, not authoritative. Refine it, then
write the actual ticket files. The formal contract pointers come from the gate-12
publication step (see § The gate-12 bridge).

## Why NOT re-run the Wayfinder (settled last session — do not relitigate)

- The Wayfinder's **destination was always "one complete match"** (`map.md`
  Destination: *"...playable... for one complete match"*). The user's "real,
  complete 1v1 match" IS that destination, reached directly — not a demolition.
- All gate **decisions are pivot-consistent** (08 re-cut this session; 05/06/07
  sealed post-ADR-0041/0042). The full-match scope contradicts **no** sealed gate.
- What the full-match decision obsoleted is the **build-ticket PLAN** (Working
  layer), not any decision. Re-running Wayfinder would re-grill settled decisions.

## Read order (all by reference — do not restate)

1. **The slice definition**: gate-08 ticket § Answer —
   `.scratch/l3-playable-seam/issues/08-define-first-playable-vertical-slice.md`
   (seven-axis definition + ADR 0042 re-cut + scope trade). THE source for what
   the build must deliver.
2. `map.md` § Decisions so far (08 bullet) + § Gate re-cut (05/06/07/08 sealed).
3. The current build tracker: `.scratch/l3-playable-build/README.md` (runbook +
   the 9-ticket dependency chain) + `issues/01..09`.
4. Pivot: `docs/adr/0042-duel-victory-capital-fall.md`; capital mechanics
   `docs/features/capital/RULINGS.md` CP-② (D1.3 capital placement is player-chosen).
5. Turn structure + EVAL BAR: `.scratch/l3-playable-seam/duel-pivot-draft-ledger.md`
   Gate 6 (D6.1/D6.1a/D6.2/D6.3 + EVAL BAR skeleton) — the interim authoritative
   record (per ADR 0042; no feature-doc home yet, see SYNC-DEBT).
6. Combat/operation contracts (the depth being built): combat-formula
   `FORMULA.md` (D1–D11) + `MAGNITUDE.md` (M1–M14) + `MATCHUP.md` (roshambo,
   21-cell); `operation-plan-catalog/CATALOG.md`; war-model-build RULINGS.
   **KEY: the operation layer is designed AND numbered — the gap is
   implementation, not design** (sub-agent audit 2026-07-25; the magnitude pass
   was executed). The archive `js/battle.js` codes only the R-core + Stronghold/
   Delaying — re-implement the rest from these contracts (ADR 0041: re-implement,
   never import the archive).
7. World: the cradle terrain lives in `mockup/combat-calc/map-data.js`
   (CANONICAL_MAP — 10 regions / ~49 sectors, varied terrain + choke/adjacency
   graph). Reuse it (re-implement to a gate-06 artifact); do NOT author a new map.
8. Gate contracts: gate 02 (Runtime seam), 03 (fog), 05 (topology), 06 (world
   artifact) § Answers in `.scratch/l3-playable-seam/issues/`.
9. Memory: `terrain-game-l3-gate08`, `terrain-game-duel-pivot`,
   `terrain-game-l3-wayfinder-gate07`, `terrain-game-war-model-build`.

## Good news: the tracker is ALREADY a walking skeleton

The current 9-ticket chain already climbs to **07 = "one complete match ends
legally."** So the "full match" goal is the tracker's own endpoint, and the
"build program" is NOT a big-bang: built 01→…→match incrementally, failures still
localize per demoable increment. The scope trade (gate-08 § Answer) gave up the
slice's *smallness*, not the build's *incrementality*. Keep the walking-skeleton
discipline: a thin end-to-end loop that closes early (stub combat/bot), then
thicken each layer.

## The RE-CUT SKETCH (the seed to concretize — ~11 tickets, walking-skeleton order)

The old 9 tickets were cut pre-pivot. Re-cut:

**Skeleton (thin loop closes early):**
- **B01 — L3 project skeleton + deterministic viewer boots.** (≈ old 01, survives.)
  The `game/` nested TS/ESM tree (gate 05), a viewer that boots deterministically.
  Contract: gate 05 § Answer, ADR 0040.
- **B02 — Authored world: cradle→artifact + loader + 2-realm partition + capital
  placement.** (≈ old 02, EXPANDED.) Re-implement CANONICAL_MAP to a gate-06 world
  artifact + tier-1 loader/validator; the **random balanced(population)-contiguous
  2-realm partition** enumeration (reuse the L2 sheet-14 viable-binding logic);
  **player capital placement** (CP-② D1.3). Contract: gate 06 § Answer, ADR 0041,
  CP-② D1.3, SPEC equal-population.
- **B03 — Game Runtime seam + simultaneous-commit-reveal turn loop.** (NEW explicit
  split — the spine.) Runtime (gate 02: `view`/`submit`/`currentActor`, private
  truth, turn order); the blind-commit → simultaneous-reveal → resolve loop
  (D6.1/D6.2); the single 행동력 chip stack (D6.3). **IN-BUILD DESIGN: the
  resolve-order algorithm (D6.1a)** — enumerate overlap cases + symmetric
  adjudication — is designed HERE (it needs the wired engine; sealed in principle
  only). Contract: gate 02 § Answer, duel-pivot ledger Gate 6.
- **B04 — Standard Fog projection + recon.** (≈ old 03, survives.) The projection
  blur seam (gate 03: control public, estimate bands, reach cones, seven non-leak
  invariants); recon walking the confidence ladder. **IN-BUILD: recon economy
  numbers** (measurement-gated, candidate). Contract: gate 03 § Answer, fog
  RULINGS ①②.

**Combat / operation cluster (the old "04" exploded — this is the depth):**
- **B05 — Combat core (R-ratio decisive battle).** Re-implement from contract
  (`js/battle.js` = evidence, not import): `sidePower`, commit lever (M2), fatigue,
  movement/supply predicate, field-army division, terrain/fort (M5), rout/escape
  (M4). Contract: combat-formula FORMULA D1–D11 + MAGNITUDE M1–M14, WM-①.
- **B06 — Operation-plan selection layer.** The catalog as selectable presets:
  per-plan thresholds (M7), six-axis stamps (M8), availability/fit ranking.
  Contract: operation-plan-catalog CATALOG.md, MAGNITUDE M7/M8, ADR 0024.
- **B07 — Plan-vs-plan roshambo/matchup engine.** THE biggest new build (zero
  archive code): the closed verb vocab (engage/discount/bypass/erode/throttle/
  refuse), the 21-cell matrix, confirmed-family fractions (M10). Contract:
  combat-formula MATCHUP.md, ADR 0025.
- **B08 — Capital: guard + fall + win-check.** Land-derived capital-guard
  garrison; the capital-fall check (**sole** win condition); fall path =
  **decisive battle only** (Moscow-trap/encirclement DEFERRED). Contract: CP-②
  (D2.1/D2.3/D2.4), ADR 0042.

**UI + bot + match:**
- **B09 — Commit-first UI shell + EVAL BAR (React).** Gate-07 commit-first read
  layer (커밋량→행동→세부→지역빛남→지목); the EVAL BAR (LEFT clicked-front R /
  RIGHT eligible-fronts average + operation-plan threshold needles). **IN-BUILD
  DESIGN: the tactical-R composition formula + name + visual** (gate 6 left these
  open). Contract: gate 07 § Answer + fog RULINGS ②, EVAL BAR skeleton (ledger G6).
- **B10 — Bot: rational actor over the same instruments.** `decideBotIntent`
  reads its own fog projection → per-front R / average bars + threshold needles →
  front/plan/commit decisions; a **single balanced disposition** for the
  judgment calls; plays the range, not an optimal solver. Archive multipolar bot
  discarded. Contract: gate-08 § Answer (bot axis), C02.5.
- **B11 — Match orchestration: run to capital fall + victory screen.** (= old
  06+07 MERGED — war=match, sole terminus.) The full human-vs-bot match loop to
  capital fall, mandatory victory screen, **natural length, no outcome-altering
  speed-up**. Contract: gate-08 § Answer (stopping point), ADR 0042, D6.4.

**Dropped / voided:**
- old **08 (verify/promote canonical) + 09 (retire legacy)** → mostly VOID per
  ADR 0041 (the game never occupies the public route; the legacy is a reference
  archive, not a play-path to retire). Align with the Wayfinder-11 demotion. Keep
  only "the L3 match runs and is demoable" as an acceptance folded into B11.

## Design threads that CANNOT be pre-grilled (design them IN-build)

They need the wired engine / real play (the chicken-and-egg established last
session): **resolve-order algorithm (D6.1a → B03)**, **EVAL BAR tactical-R
formula/name/visual (→ B09)**, **recon economy numbers (→ B04, measurement-gated)**,
and the **capital-terrain / encirclement dynamics** (deferred with Moscow-trap;
tuned in the parallel map pass once the engine plays). Do NOT open a pre-build
grill for these.

## The gate-12 bridge (a real dependency before tickets go `ready-for-agent`)

Per `.scratch/l3-playable-build/README.md` § Hard readiness rule, a ticket is
`ready-for-agent` only after **gate 12 publishes the accepted decision set into
Production docs + ADRs** and the ticket's `Specification gates:` line is replaced
by exact pointers. Gate 12 is split (`map.md`): (a) governance batch — **BLOCKED
by `.scratch/doc-structure/issues/10` (`⛔ DO NOT EXECUTE`)** — and (b) mechanical
ticket re-pointing. So the re-cut has two layers: (1) re-cut the ticket SHAPES
(this session's sketch), and (2) the gate-12 publish that makes them executable
(needs the doc-structure/10 blocker addressed, or a user decision to route
around it). Flag both; do not silently assume tickets can go ready without (2).

## Promotions owed at spec authoring (already in SYNC-DEBT)

- The **cradle-reuse + random-partition** architecture → a terrain-cradle doc /
  ADR when build specs are authored (SYNC-DEBT gate-08 row; relates to the
  "1v1 map re-authoring" row — the 2-seat binding IS the first 1v1 world artifact).
- Turn-structure + EVAL-BAR formal feature-doc birthplace (SYNC-DEBT existing row).
- Operation-plan magnitude graduation, gate-06 loader, code-contract tree scan
  (existing SYNC-DEBT rows) — all fire during these build tickets.

## Session mechanics

- **This is a planning/ticket-cut pass, not implementation.** No game code.
- **Voice:** Korean 존댓말 (해요체); artifacts neutral professional English.
- **git:** `/usr/bin/git`; bare `git log` unreliable (use `rev-parse`/`show -s`).
  Docs/tracker commits go to `main`. `.scratch/` IS tracked; `.context/` is NOT.
  Leave the unrelated landing edits (`css/landing.css`, `game.html`, `index.html`,
  `js/landing.js`) untouched.
- **Tool gotcha:** `rg` gives false negatives on recursive `.`/dir scope here; use
  coreutils `grep -rn` for existence checks (memory `harness-rg-false-negative`).
  And: **read the actual artifact before asserting about it** — last session I
  claimed the map was "all plain / 5-6 seat, build new" without opening it and was
  wrong; the user caught it.
- **lint:** `npm run lint:docs` (5 `ledgerCurrency` advisories are known noise;
  0 blocking is the target).

## Suggested skills

- **`domain-modeling`** — if the ticket re-cut coins/registers terms (mostly
  deferred to gate 12, but the partition/roshambo/bot vocabulary may surface).
- **`grilling`** — only if a genuine NEW decision surfaces during the cut (it
  should not — decisions are settled; the design threads above are in-build, not
  grillable now). Default: no grill.
- **`final-check`** — at session close: coverage audit of the re-cut against the
  gate-08 § Answer (every sealed axis has a home ticket; nothing dropped).
- **`doc-audit`** — if the session touches SYNC-DEBT / tracker structure /
  DOMAIN_MAP (documentation-law ritual).
