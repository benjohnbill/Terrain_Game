# ADR 0042: Duel Victory — Capital Fall as the Sole Win Condition

Date: 2026-07-24

Status: Accepted (sealed 2026-07-24)

- Relationship:
  - **Supersedes (5):**
    - ADR 0030 (hegemony decision point + domination victory) — the keystone
      multi-realm win rule; there is no hegemony gate in a 1v1 duel.
    - ADR 0033 (unassailability affordability bound) — a refinement of the
      hegemony gate's unassailability clause; retired with the gate.
    - ADR 0034 / 0035 / 0036 (the sudden-death crisis-ending stack) — existed
      ONLY as the forced-termination backstop for the multipolar deadlock the
      hegemony gate could not always trip; capital fall + structural anti-fizzle
      removes their reason to exist.
  - **Amends (2):**
    - ADR 0037 (war-model build direction) — the build's win condition is
      capital fall, not the hegemony gate; the combat/defense build targets
      survive unchanged (force-count-independent).
    - ADR 0038 (war-ending composite) — capital fall is promoted from anti-drag
      backstop (channel 2) to the sole designed win condition; the three-channel
      composite collapses.
  - **Stale-stamps (2):** ADR 0031 (force-geography defense), ADR 0032
    (occupation geography) — their MECHANICS survive to L3 (force-count-
    independent, Boundary below); their multi-realm FRAMING is now historical.
  - **Confirms / makes literal:** ADR 0025 (turn-based core + uncertainty duel)
    — the uncertainty duel becomes LITERAL (simultaneous blind commit → reveal,
    poker not chess); ADR 0026 (one-shot effects / atomic resolution) unchanged.
- Mandatory-ADR trigger: this changes a win condition, a cross-feature model,
  AND SPEC direction (documentation law — the three strongest reasons to enter
  the Record layer). It lands with this ADR in the same batch.
- Decision source: the 1v1 duel-pivot Wayfinder — premises locked 2026-07-23
  (`.scratch/l3-playable-seam/duel-pivot-premises.md`, P1/P2/P3), all six design
  gates sealed 2026-07-23/24 (`.scratch/l3-playable-seam/duel-pivot-draft-ledger.md`,
  user-sealed one node at a time). Origin: memory `terrain-game-duel-pivot`.
- L-trust: **L0/L1** (six-line design convergence + grill reasoning). The real
  judge is L3 playtest (the user playing); devices are added on real fun signal,
  never on L2-bot speculation.

## Context

The L3 war-termination pass was opened to answer DESIGN-RISKS R14: wars fizzle
(metric 5 ~68.7% no-material-outcome, decided% 0.000, ~18.2% never ending). It
resolved not by tuning bot stall but by a structural decision the user reached
2026-07-23 at a higher altitude: **the game is a two-realm 1v1 duel, and a match
is won by capturing the enemy capital.**

Six independent lines converged on 1v1 (premises Context): the game's poker DNA
(uncertainty duel + commit + recon); five research surveys (the FFA three-player
pathologies are multiplayer-only; Polytopia "Might" is literal capital fall; fog
structurally substitutes for alliance-politics depth); the product constraints
(casual 15–30 min, a chess.com-shaped subscription platform, mobile + webview);
a map-variation measurement; the BM cousin (poker solver = judgment coach); and
F2P liquidity economics. Three-faction structures were rejected as the kingmaking
worst case.

The prior victory model was built for a 4–6-realm multipolar board: a match ended
at the **hegemony decision point** (leadership OR dominance AND unassailable, ADR
0030/0033), and matches that never tripped the gate were force-ended by a
**sudden-death crisis** (ADR 0034/0035/0036). Both machines are multi-realm by
construction — the hegemony gate arithmetic ranges over "every realm still in the
balance," and the crisis existed only because a multipolar board can deadlock
into a deterrence equilibrium that no gate trips. Neither has a job in a
head-to-head duel.

## Decision

**Victory = capital fall. It is the sole win condition.** A match is won by
capturing the enemy realm's capital sector (defeating its capital guard); nothing
else names a winner.

1. **Exactly two realms; war and match are one** (premises P1). The game is a
   single sustained head-to-head duel, not a multi-war arc. There is no separate
   hegemony-settlement match-terminus.

2. **No points-victory, no timeout-draw, no scorecard** (ledger D3.1). Stalemate
   is not resolved by a new match-ending condition; it is resolved by pressure
   that INDUCES capital capture. A points/scorecard terminal was rejected three
   times in this codebase's history (ADR 0034 demotion → 0035/CE-⑪ removal →
   match-arc DT-②); the pivot makes that invariant literal — capital fall is the
   only namer of a winner.

3. **Anti-fizzle is structural-first; no forced-termination device is built now**
   (ledger D3.2). Four structural forces guarantee the duel resolves: (a) 1v1
   removes the multipolar deadlock (the main fizzle driver); (b) mutual-exposure
   (committing force to offense undefends your own capital) makes sitting unsafe;
   (c) **land-derived decay** — losing ground starves land-derived recruitment
   and income, so the trailing player decays and must gamble a strike (asymmetric,
   attached to LAND not treasury, diegetic); (d) faithful L3 combat lets offense
   break defense. No blinds-clock (measured INERT). An explicit device is DEFERRED
   behind L3 fizzle measurement; if ever needed → upstream / land-attached /
   asymmetric / never points.

4. **The crisis / internal-uprising system is retired** (ledger Gate 4). It
   existed only as the forced-termination backstop for the multipolar deadlock;
   capital fall removes its reason to exist. It is built opt-in-off, so retiring
   leaves it dormant with no code change. Only its INSIGHTS survive as
   reserve-device ingredients IF an L3-measured device is ever needed: the
   pay/refuse escalation staircase (CE-④/⑥) and calendar-staged determinism
   (CE-⑨).

5. **Capital-fall mechanics live at their birthplace** (`docs/features/capital/`,
   CP-②), not here. Summary: one capital per realm, location public (fog covers
   only guard strength / last-stand depth); the guard is an ordinary
   terrain-gated garrison of larger magnitude, obeys the normal supply predicate
   (so it can be encircled and starved — the Moscow trap), and can be reached by
   overwhelming battle or by cutting supply. Early-rush is defended emergently
   (guard magnitude needs a late-game army; encirclement is multi-turn and
   border-alarm-visible; mutual-exposure means decapitating undefends your own
   capital), never by a hard "no fall before turn N" floor. Forward vs rear
   placement is a leverage-vs-variance choice; relocation (천도) is a ruinous
   action-economy gamble. This ADR records THAT capital fall wins; CP-② records
   HOW.

## Rejected alternatives

- **Retain the hegemony decision point (multi-realm victory).** Its arithmetic
  ranges over multiple in-balance realms and a coalition unassailability check;
  in a two-realm duel there is no coalition and no "balance" to survey. Kept as a
  historical record (superseded, not deleted).
- **Points / territory / economy scorecard as a terminal or tiebreak.** Rejected
  a fourth time here — it resurrects the 4X global-scorecard the codebase has
  removed three times, and it teaches hoarding rather than out-fighting the
  opponent.
- **A timeout-draw / Westphalian draw (crisis CE-⑪).** A draw completes a
  no-winner multipolar ending; a 1v1 duel with capital fall as the sole terminus
  and structural anti-fizzle has no undecided tail to draw.
- **Build a forced-termination device now.** YAGNI: the four structural forces
  are expected to resolve the duel; a device is deferred behind L3 measurement and
  added only on real fun signal.

## Consequences

- **The multi-realm victory machinery goes stale** (ADR 0030/0033 superseded;
  match-arc hegemony decision point, dominance, unassailability, hermit clause,
  vassalage-as-currency, and the winning-archetypes taxonomy are re-sealed as
  historical in the same doc-sync batch).
- **The crisis stack dissolves** (ADR 0034/0035/0036 superseded); the built +
  parked crisis work is retired dormant, and the "someday-backstop" SYNC-DEBT
  clears with it.
- **The combat / operational engine survives whole** (premises P2 Boundary,
  blast-radius verified force-count-independent): slice-1 decisive battle,
  slice-2 fatigue / movement / supply / field-army division / commit budget /
  intel, combat-formula, operation-plan-catalog, the fog presentation contract,
  and the realm-internal economy (aging constitution, conscription register,
  recruitment) all port to 1v1 unchanged. ADR 0031/0032 mechanics are inside this
  survivor set; only their multi-realm framing is stale.
- **The anti-fizzle decay reuses already-sealed machines** (ledger D5.1): income
  (occupation-geography OG-①) + the land-derived force limit (capLandFrac = 1,
  match-arc AB-②), locked in by the aging constitution's no-free-healing (MT-①
  P1). No new device.
- **The authored world needs re-authoring for 1v1** — the terrain-cradle is a
  5–6-seat multipolar map; the hex grid (TC-⑪) stays frozen and new 1v1 worlds
  are added as gate-06 map artifacts (no seal broken). Parallel map pass, not this
  batch.
- **SPEC carries ~11 contradictions + 4 sharpenings** (Core Principle #5
  termination, realm-count 4–6, multipolar geometry, hegemony-settlement end,
  dominance, crisis-arc / Westphalian draw, Phase-2 diplomacy; Principle #2
  uncertainty duel becomes literal, LoL positioning, Goal, Core Gameplay Promise).
  SPEC is Direction — these land as a single user-approved amendment PROPOSAL, not
  a direct edit.
- **L3 Wayfinder gate 08 is unblocked** once this cascade lands (the
  war-termination long pole is cleared by the pivot at a higher altitude).

## Authoritative homes (definitions and dials — not here)

- Capital definition, placement, guard, fall mechanics, forward/rear, 천도,
  early-rush defense: `docs/features/capital/` GLOSSARY + RULINGS CP-②.
- The six sealed design gates (capital, fall, draw/timeout, crisis fate,
  match-arc, turn structure) verbatim: the duel-pivot ledger + premises above
  (compression-safe seal record; formal feature-doc homes minted incrementally).
- Anti-fizzle decay engine: match-arc OG-① (income) + AB-② (capLandFrac) +
  MT-① P1 (no free healing).
- Turn structure (simultaneous blind commit, 행동력 single stack, phase
  skeleton, match length) and the EVAL BAR signature UI: sealed in the ledger
  (Gate 6); formal birthplace = the read-layer / 형세판단 feature docs, deferred
  as a follow-up (recorded in `docs/SYNC-DEBT.md`).
