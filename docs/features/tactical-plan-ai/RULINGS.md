# Rulings — Tactical Plan AI

Decision record for the 2026-07-08 design grill (user + agent).
Authoritative for this feature. Each ruling carries status + date +
verdict source per the documentation law. Validation level: **L0**
(hand reasoning) throughout — the battery (`BATTERY.md`) is the L2
instrument these seals commission.

## ① Decisiveness ladder — SEALED 2026-07-08 (user grill, Q1)

The bot's objective is a five-rung ordinal ladder, not a scalar payoff.
Among *eligible* plans whose judged R clears the plan threshold, pick
the highest rung; break ties within a rung by judged margin
(R − threshold).

| Rung | Meaning | Plans |
|---|---|---|
| 5 Vassalization (속국화) | surrender harvest folds the opponent | Encirclement |
| 4 Annihilation (섬멸) | enemy field army destroyed, cannot rise | Flanking |
| 3 Advance (전진 = occupation) | take ground | Swift, Crossing (advance over water), SI (another key to a fort) |
| 2 Erosion (침식) | grind the walls for a later turn | DP |
| 1 Loot (약탈) | blood without folding the board | Raid |

Rejected: raw margin maximization as objective (DP's low threshold 1.1
would always win — reproduces the grinding freeze as "judgment");
scalar expected-payoff scoring (requires 5–6 user-sealed exchange
rates; revisit only if the ladder proves reckless). User confirmed the
5-rung draft verbatim; "advance = occupation" identity confirmed.

Fallback (harness rule, 가안 — not a seal): if no plan clears its
threshold at the judged values, pick the best judged-margin plan
(usually DP) and log the battle as a forced grind.

## ② Judgment model: window + disposition dial — SEALED 2026-07-08 (user grill, Q2)

The bot's judged value of an enemy quantity = one point inside its
estimate window (band):

- **Accuracy (confidence) sets the window width**; perfect information
  collapses it to a point.
- **Disposition dial** (성향) — continuous λ ∈ [−1 pessimist, 0 neutral,
  +1 optimist] — sets *where in the window* the bot reads (pessimist
  reads the enemy strong, optimist weak). Named presets are labels on
  the dial, not separate mechanisms.
- **Truth is uniform-random within the window** from the bot's
  standpoint: the window is drawn around a noisy estimate, never
  centered on the truth (a truth-centered window would make the neutral
  bot an oracle). Implemented by reusing the fog spec's off-center
  p-fraction band (see Ruling ③).
- Consequences (intended): degraded accuracy = **misjudgment, not
  timidity** — the bot errs in both directions. Perfect information
  makes dispositions converge: fog amplifies personality (coherent with
  ADR 0025's uncertainty duel).

## ③ Information model = fog spec, magnitude-only — SEALED 2026-07-08 (user grill, Q3)

The bot sees exactly what a player sees under the sealed fog design
(`docs/superpowers/specs/2026-07-01-fog-of-war-discovery-design.md`
§4–5, slice-1 merged):

- **Blurred: magnitude only** (enemy troop counts — front garrison,
  field army, capital garrison), as a true-containing, off-center
  (hidden fraction p), confidence-widened estimate band. Reuse the §5
  band mechanics; do not invent a new window shape.
- **Public: terrain, water, chokes, presence, identity, isolation
  status** (positional facts), and **wall grade** — the latter was an
  unclassified gap in the fog spec, now ruled public (physical
  structures are visible from outside; the unknown is how many defenders
  man them). Birthplace of that ruling:
  `docs/features/fog-of-war-discovery/RULINGS.md` ①.
- Effect: eligibility gates (objective facts) are judged without error;
  only threshold-clearing predictions (R) carry disposition and
  accuracy error. All misjudgment concentrates in one place.
- **No "perfect" arm.** User ruling: measure in the game-legal band
  only (enemy confidence ≤ 0.90, the ownership-premium cap of fog spec
  §5.4). The handoff's original "perfect upper bound first" step is
  dropped — realism outranks a lab-only ceiling.

## ④ Accuracy arms: parameter sweep + two randoms — SEALED 2026-07-08 (user grill, Q4)

Confidence is a tournament parameter (no scouting actions in the L2
harness — scouting AI is parked). Sweep 0.90 / 0.75 / 0.50, plus two
control arms proposed by the user ("random") and resolved into both
readings:

- **R1 blind bot** (confidence ≈ 0): ladder logic on worthless
  information — the floor of the information curve.
- **R2 random-pick bot**: bypasses judgment, picks uniformly among
  gate-eligible plans — the pure plan-diversity control.

Together with the script baseline these separate the value of plan
diversity, judgment, and information (see BATTERY.md comparisons).

## ⑤ Battery design — SEALED 2026-07-08 (user grill, Q5)

Full design in `BATTERY.md` (arms 6+243, ~15k matches, common outcome
logging, five pre-registered comparisons, no full factor crossing).
Key user rulings folded in: outcome axes generous ("log everything,
read by marginals"), disposition swept as all 3⁵ assignments at fixed
confidence 0.75 (not hand-picked archetype mappings), full crossing of
disposition × confidence rejected (cell-thinning + fishing risk).

## ⑥ Defender scope: dormant, with honesty riders — SEALED 2026-07-08 (user grill, Q6)

Defender devices (delaying, reserve awakening) stay dormant this pass.
Rationale: experiment cleanliness (one change at a time), defender
judgment needs its own grill, seat symmetry is preserved (all five
realms get the same attack brain / passive defense).

**Riders (binding):**

1. Every report of this battery must label absorption numbers as an
   **upper bound vs a passive defender** (decisive plans overperform
   against a defender that never delays or awakens reserves).
2. **Asymmetric verdict rule**: if the residual freeze is LARGE, the
   hegemony-ADR-needed conclusion stands (waking defenders only grows
   the residual). If the residual is SMALL, do NOT conclude the
   hegemony ADR is unnecessary until a defender-judgment arm re-test
   confirms it.
