# Hegemony Decision-Point Timing Target — Design

- **Date:** 2026-07-09
- **Status:** PROPOSED (brainstorming spec; not yet sealed)
- **Owning feature:** `docs/features/match-arc/` (ending-taxonomy is the birthplace)
- **Touches direction:** carries two SPEC-5 amendment *proposals* (user-gated, Tier-3)
- **Evidence:** two L2 measurement runs, 94,500 matches each (reps=30 × 5 seeds × 3 arms), 2026-07-09

## 1. Problem

The match freeze is a decision-timing failure, not a runaway-victory failure.
Under uniform walls (`BOARD_GAAN`), ~87% of matches never reach a decision
within the 32-turn cutoff; even the best force-geography arm leaves ~50%
undecided. The SPEC match envelope wants a war/empire arc that resolves within
roughly 15-25 turns (a League-of-Legends-shaped compression, not a Paradox
campaign), ending "at a decision point rather than by map completion".

The ending-taxonomy (ET-①) reads match end-state with a bar-independent bucket
panel (hegemon / denied-dominant / standoff / bipolar-lock / contested). Those
buckets are a **snapshot of the board at the turn-32 timeout**, decomposed by
shape — only `hegemon` represents a match that actually resolved (the hegemony
gate tripped, `tripTurn` recorded). The other four buckets are all timeouts.

Reading success by bucket *share* therefore measures the wrong thing: it cannot
see **when** a match decided, and the SPEC success criterion is a timing
criterion. This spec reframes the target around decision timing and sets the
target profile the design should aim the match at.

## 2. Evidence

Two multi-seed runs (reps=30 × seeds {42,7,99,123,777} = 6,300 matches per arm
per seed; between-seed bands ±0.2–0.5pp, so results are not seed-luck). Arms:
`ctrl` (uniform walls), `fgM9on` (force-geography, M9 reserve on), `fgM9off`
(force-geography, M9 reserve off).

**Decided% (tripped at all):** ctrl 13.3% · fgM9on 32.4% · fgM9off 49.6%.

**Timing (tripTurn):**

| arm | decided% | envelope 15-25 | median tripTurn | timeout (never) |
|---|---|---|---|---|
| ctrl | 13.3% | 6.8% | 25 | 86.7% |
| fgM9on | 32.4% | 18.1% | 20 | 67.6% |
| fgM9off | 49.6% | 34.6% | **19** (p25 16 / p75 25) | 50.4% |

**Three findings that shape the target:**

1. **No stomp problem.** 0% of matches decide before turn 8 in any arm. The
   envelope floor is not violated; there is no snowball/blowout pressure to
   defend against. The entire problem is at the top (late + timeout).
2. **The disease is timeout.** Even the healthiest arm leaves half the matches
   undecided; uniform walls leave ~87%.
3. **The center is already right; only the spread is wrong.** `fgM9off` median
   tripTurn is 19 — dead center of the envelope. The fix is variance reduction
   plus timeout collapse, not a shift of the mean. The earlier "fgM9off is too
   decisive / runaway" worry is refuted: it decides *in the envelope*, not by
   early stomp.

The turn-32 crown inversion (center realm pinned to standoff, flanks dominate)
reproduced at 94.5k matches, consistent with ET-①'s 1,680-match finding.

## 3. The Ruler (metric reframe)

- **Headline metric:** decision timing — the `tripTurn` distribution, summarized
  as **envelope% (fraction of all matches that trip within turns 15-25)** and
  **median tripTurn**.
- **Demoted to descriptive:** the five ending-taxonomy buckets become a
  classification of *how* a not-yet-resolved board looked, not a success score.
  They remain evidence (per ET-①), never the winner rule.
- Rationale: the SPEC success criterion is "resolves within the envelope"; only
  a timing ruler can read it. Bucket share conflates topology with resolution.

This reframe is a **promotion candidate** (bucket-share → timing ruler is a
match-arc reading shift); promotion to be *proposed* at doc-sync, not applied
here.

## 4. Target Profile (option "나" — rounded bell)

The target is a unimodal distribution peaked at turns 18-22 with thin tails —
approximately normal (σ ≈ 3.5 turns) but **not** a strict Gaussian to be
force-fit. "80% within the envelope" sits in the wider 15-25 band, not the
narrow 18-22 slot (an 80%-in-5-turns target implies σ ≈ 1.5, a near-fixed
~20-turn game that requires a hard clock and flattens timing as a skill axis —
explicitly rejected).

| axis | final target | first checkpoint | current best (`fgM9off`) |
|---|---|---|---|
| **envelope% (trip 15-25)** — headline | **≥ ~78-80%** | ≥ ~50% | 34.6% |
| 18-22 tight core | ~45% | — | n/a (bins 15-20 / 21-25 do not isolate 18-22) |
| median tripTurn | 18-22 | 18-22 | 19 ✓ |
| stomp floor (trip ≤ ~10) — guardrail | ≤ ~8-10% | keep low | ~6% ✓ |
| early (11-14) | ~9% | — | ~6% |
| late (26-32, decided) | ~9% | — | ~9% |
| timeout (never) | ≤ ~1-2% | ≤ ~10% | 50.4% |

Shape sketch (turns → mass):

```
turn 10  12  14  16  18  20  22  24  26  28  30
      ▁   ▂   ▃   ▅   ▆   ▇   ▆   ▅   ▃   ▂   ▁
```

**All target numbers are provisional (test-trust L0/L1):** they are aim points
from hand reasoning plus the L2 evidence above, not verified outcomes. They are
re-checked after each lever lands (§7).

## 5. Design principle — Forced Resolution (SPEC-5 proposal)

> **SUPERSEDED 2026-07-09 by match-arc RULINGS DT-② (user-agreed).** This
> section's "no-draws + forced escalation ramp" framing was RETIRED. Balanced
> boards resolve *emergently* via a positive-sum growth-divergence engine
> (safe-slow development vs risky-fast conquest; aggression is the +EV default,
> turtling niche) — so no draw needs banning and no clock/ramp is imposed; draws
> just become vanishingly rare and principle #5's detector catches the emergent
> irreversibility. The §5 SPEC-5 amendment below is therefore UNNECESSARY.
> Ice-breaker deferred as a measurement-gated contingency (Zhou seed parked).
> The text below is kept only as the prior brainstorm record. §6 (domination
> victory) is unaffected and remains approved.

A match produces a winner; it does not draw. A genuinely balanced board is
broken by a **gentle escalation ramp** that rises from roughly turn 15-18, not
by a turn-32 cliff (a cliff produces an ugly spike at 30-31 instead of a thin
tail; a mid-envelope ramp pulls the late/timeout mass leftward into 15-25).

Consequence: "multipolar standoff as a legitimate terminal" (ET-①'s
anti-snowball-success reading) is **retired** as a valid match outcome. This is
consistent with the LoL/StarCraft north star (no turtling to a draw) and is the
mechanism by which the timeout tail reaches < ~1-2%.

This changes the terminal definition and is therefore a **SPEC-5 amendment
proposal** ("the ending is the detection of irreversibility"), user-sealed.

## 6. Terminal redefinition — Domination Victory (SPEC-5 proposal)

> **ARITHMETIC SEALED 2026-07-09 (user) → match-arc RULINGS DT-③ (Combo 2).**
> The decision point trips when `(leadership OR dominance) AND unassailable`:
> dominance = `forceShare ≥ 0.5` OR `2.5×` the top in-balance rival (no per-rival
> shield bar), and unassailability REUSES the existing gate's `1.7× + 6-turn
> window` clause — so the persistence guard needs no separate counter (the
> look-ahead IS the persistence). The strict-1.0-snapshot alternative was
> rejected (principle #5 "CAN reverse" is forward-looking; one shared
> irreversibility definition; aggression ethos; earlier envelope conversion).
> DT-③ is authoritative; the text below is the prior proposal. Remaining Tier-3:
> a SPEC.md declaration of the domination win-type, to land with the check-fix
> implementation.

Today the hegemony gate trips only on **leadership** (candidate `projectableMass`
≥ 1.7 × every in-balance rival's facing `shieldMass`) **and** **unassailability**
(no in-balance coalition reaches 1.7 × candidate shield within the regen window).
A realm that is unassailable and dominant but cannot clear the offensive
leadership bar does not trip — it lands in `denied-dominant` ("the wall": you
cannot beat me, I cannot break your walls). At 94.5k matches this is the single
largest timeout component of `fgM9off` (31.1%).

**Proposal:** add a second terminal — **domination victory** — that trips when a
realm is irreversibly dominant, reusing the sealed decision-point arithmetic
(`projectableMass` / `shieldMass`), without requiring the offensive leadership
bar. This is the "detection of irreversibility" the SPEC-5 amendment names, and
adds a domination win-type alongside the existing conquest win-type (standard
for the genre).

Grounding facts:
- "Dominant" is a genuinely strong state: `forceShare ≥ 0.5` (majority of all
  projectable mass) **or** 2.5× the strongest rival. With five equal realms
  (~0.2 each), absorbing one whole rival reaches only ~0.4 — **not** dominant;
  reaching dominance requires absorbing ~1.5-2 realms' worth of mass, i.e.
  substantial prior aggression. A turtle cannot reach dominance defensively;
  the domination terminal only *closes an already-won game* and cashes in the
  aggressor's gains — it does not reward passive play.
- Expected effect: converts the `denied-dominant` timeout mass into decisions,
  lifting `fgM9off` from ~49.6% decided toward ~80%.

**Calibration deferred:** the exact dominance threshold and which
unassailability bar to use (the panel's 1.0× or the gate's 1.7×). **Persistence
guard (required):** the panel is a single-turn snapshot; the terminal must fire
only on a state that *holds* for a few turns (or use the gate's window-aware
unassailability), never on a transient blip.

## 7. Levers and sequencing

1. **Domination-victory check-fix (§6) — first.** Free: reuses existing
   arithmetic, no combat-balance change. Absorbs the "already-won" half of the
   timeout blob.
2. **Re-measure timing.** Read the residual `tripTurn` distribution — the genuine
   never-resolved matches that remain (standoff / bipolar-lock / contested).
3. **Escalation ramp (§5) — tuned to the target.** Sized so the residual median
   lands 18-22 while the stomp floor stays protected. A flat attacker-advantage
   buff is a fallback only if the ramp alone is insufficient, and must be tuned
   to the envelope middle (not to maximize decided%), because over-buffing
   attack risks pushing decisions below the turn-15 floor.

## 8. Topology scope

The target profile is **topology-agnostic**: every conflict shape must resolve
within the envelope. The buckets standoff (1:1:1:1:1), bipolar-lock (2:2), and
denied-dominant (1-dominant) are the *same* "did not resolve" disease in
different shapes; §6 and §5 address resolution regardless of shape.

Which *shapes* form is a separate axis:

- **Phase 1 targets.**
  - *1:1:1:1:1 free-for-all ("hyena")* — the current multipolar tendency; needs
    the resolution levers plus the opportunism-read / pile-on AI (a registered
    ending-taxonomy target, whose gap-vs-bot-blindness is still unverified).
  - *2:2:1 empire+vassal great war* — formed via vassalage (`복속` chain: vassal
    mass counts to the overlord). Two balanced blocs (~0.4 / 0.4 / 0.2) do not
    trip domination; they currently freeze as bipolar-lock. Needs a
    bloc-formation incentive plus **fast** formation (so the great war still
    resolves inside a compressed envelope — a LoL teamfight is a compressed
    epic).
- **Phase 2.** Peer-alliance (two co-equal empires) — no alliance machinery
  exists in the MVP (SPEC Phase 2); deferred.

## 9. Scope boundary (what this spec does NOT do)

- It does **not** design the escalation-ramp mechanism (blinds vs. defense-decay
  vs. attrition) — that is a follow-on design pass.
- It does **not** fix the domination-victory dials (threshold, unassailability
  bar) — calibration follows the first measurement.
- It does **not** design the topology mechanics (bloc-formation incentives,
  pile-on AI) — follow-on passes.
- It defines the **target** and names the **levers and their order**; the
  numbers are aim points, not sealed values.

## 10. Instrumentation

The timing ruler is not yet in the repo — it exists only as scratch drivers.
As part of this work, promote a timing measurement into the codebase (add a
`tripTurn` histogram + envelope% to `plan-battery.js aggregate`, or commit a
dedicated timing driver) so the target can be re-checked after each lever. The
existing force-geography FG sweep stays; the timing read is additive.

## 11. Homes (documentation law)

- Target profile + metric reframe → **`docs/features/match-arc/RULINGS.md`** (a
  new ruling, sibling to ET-①), with the timing-ruler promotion *proposed* at
  doc-sync.
- Domination victory (§6) + Forced Resolution (§5) → **SPEC-5 amendment
  proposals** (Tier-3, user seal).
- Escalation ramp, domination-victory calibration, topology mechanics →
  **follow-on design passes**.

## 12. Assumptions and risks

- **Assumption (to verify):** in a 2:2:1, the surviving "1" stays relatively
  strong because the two blocs bleed each other via the blood / conscription
  (`동원 강도`) system. Latent, not confirmed — logged as a test target, not a
  settled fact.
- **Risk:** the headline move is large (envelope% 34.6% → ~78%). The
  check-fix carries a big known chunk; how hard the ramp must bite is unknown
  until the post-check-fix re-measurement. Staged checkpoints (§4) exist so we
  do not over-tune the ramp into a disguised hard clock.
- **Risk:** retiring "standoff as a valid draw" (§5) is a deliberate identity
  choice; if forced resolution from true balance feels arbitrary, the ramp's
  shape (gentle, mid-envelope) is the mitigation.

## 13. Open questions (deferred, not blocking)

- Exact envelope% final target once the check-fix result is in (78% vs a
  measured-feasible number).
- Ramp mechanism selection and shape (follow-on pass).
- Whether the timing-ruler reframe promotes to DOMAIN_MAP / DESIGN or stays a
  match-arc ruling (doc-sync promotion scan).
