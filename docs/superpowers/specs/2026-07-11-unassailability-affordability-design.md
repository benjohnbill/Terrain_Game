# Unassailability Affordability Bound — Design (dominance-gate grill)

Date: 2026-07-11
Status: user-approved section by section (grill session 2026-07-11)
Prereq reading: `docs/adr/0032-sector-resolution-occupation-geography.md`,
match-arc RULINGS OG-⑤ (v2 seal-run numbers), RULINGS ruling ⑪ (regenWindow).

## 1. Problem & evidence

The hegemony decision point trips on `(leadership OR dominance) AND
unassailable`. The unassailability coalition term counts, per in-balance
rival, `projectable + min(cap headroom, cap × recruitPerTurn × W)` — a
recruitment-futures credit that asks whether the rival has ROOM to recruit,
never whether the world would let it happen. Meanwhile the live engine's
`doRecruit` already binds every actual draft by treasury (surge-curve
`draftBill`, binary-searched max affordable men) and by register bodies.
The checker is the only place in the world where soldiers are free.

Measured consequence, twice: any mechanism that raises rival ceilings
raises the wall instantly — §5 flat `capPerSector` sweep (denied-dominant
109→372) and the occupation-geography `capLandFrac` sweep (v2 seal run:
dd ctrl 89→239, fgM9off 145→375 as frac 0→1) are both monotone. The
growth engine (DT-② intent: conquest → growth → decision) cannot be
switched on because its gains arm the coalition as paper defense.

Secondary observation (recorded, not designed against): the fgM9on arm
(M9 reserve) absorbs the wall growth (dd 135→109) at the cost of a much
lower decided% (~66% vs ~82%) — a clue that live intervention stocks and
paper futures behave differently, kept as a free observation arm.

## 2. Governing principle

> **The referee counts only what the world sells.** The unassailability
> recruitment-futures credit is the minimum of every bound the live world
> already enforces on a draft — headroom, rate, money, bodies. There is no
> checker-only free imagination.

This is a REFINEMENT of ruling ⑪ ("my PRESENT punch + their CLOSED
futures"), not a reversal: futures still count on the rivals' side only,
but only futures that are purchasable and draftable. Route B (crediting
the candidate with futures) and route C (shrinking/discounting the window)
were considered and rejected: B reverses ruling ⑪ and invites paper-punch
snowballs; C lowers the wall without changing its cap-proportional shape
(both sweeps show the shape, not the height, is the problem).

## 3. The new coalition term

Per in-balance rival, at check time (all snapshot, deterministic):

```
headroom   = fieldCap − field                        (existing)
rate       = round(fieldCap × recruitPerTurn) × W    (existing; W = regenWindow 6, sealed ruling ⑪)
money      = max men m with draftBill(pool, serving/pool, (serving+m)/pool)
             ≤ treasury + W × income                 (same billFor + binary search as doRecruit;
                                                      surge-curve intensity increase included)
bodies     = civilians(realm)                        (same bound doRecruit's `want` uses)

futures    = min(headroom, rate, money, bodies)      (was: min(headroom, rate))
coalition  = Σ (projectable + futures)               (unchanged)
gate       = coalition < shieldRatio × candidate's war-worn shield   (unchanged)
```

- Income is the check-time snapshot (held sectors × usable), no future
  simulation. Zero new dials: all four bounds are already-sealed or
  already-existing world values.
- Candidate-side arithmetic (present punch only), leadership rows, the
  dominance escape (DT-③), and every other gate component are untouched.
- Conquest now closes futures through two channels: land loss shrinks the
  ceiling basis (only when capLandFrac > 0) and shrinks income/treasury →
  shrinks `money` (at every frac, including 0).

## 4. Applicability — dual-mode guard

`hegemonyCheck` (match.js) computes from the `checkView` snapshot. The view
gains treasury / income / pool (register) / serving-bodies fields. The
bound applies only when the money/body inputs are finite: fixture boards
carry NaN treasury (preserved quirk), so they fall back to the legacy
`min(headroom, rate)` — fixture outcomes stay byte-identical, and
match.js's standalone prototype fixtures (no treasury fields) are likewise
unaffected. Same dual-mode grammar as the occupation-geography pass.

## 5. Measurement plan

- Rig: existing `--growth` sweep unchanged (capLandFrac 0/0.25/0.5/1 ×
  ctrl/fgM9on/fgM9off × 4,200 matches/cell), run with the bound live.
- **The A-frac0 row is the new control**: the bound bites even with
  coupling off (poor rivals' walls shrink), so the baseline itself moves.
- New standing instrument: **affordability-bind rate** — among undecided
  matches' final checks, the share of in-balance rivals whose `futures`
  min was set by the money or bodies bound. Proves the lever is live
  (anti-vacuousness, per the final-review lesson of the previous pass).
- Success criteria (vs the v2 seal run):
  1. dd no longer rises monotonically with frac (flat or falling) — the
     wall-growth mechanism is gone;
  2. fgM9off decided% non-decreasing as frac rises (growth starts HELPING
     decisions);
  3. guardrails: stomp(≤8) ≤ ~3%, fgM9off median ≥ 15;
  4. affordability-bind rate clearly > 0.
- Comparability rider: the panel bucket classifier shares hegemonyCheck,
  so denied-dominant counts are NOT comparable across the surgery — the
  A-frac0 row re-baselines the bucket family.
- Free observation arm: fgM9on × bound (does reserve absorption stack?).
  Observation only; no design dependency.

## 6. Adoption gate (carried user decision)

Even a clean measurement does not auto-adopt a coupling strength. WHICH
frac (if any) becomes the world of record is a user decision taken with
the sweep in hand, after this design is implemented and measured.

## 7. Documentation plan

1. This spec: committed now.
2. **ADR 0033** (unassailability affordability bound): the gate arithmetic
   is part of the win condition — mandatory-ADR trigger (forensics F-06);
   lands in the same batch as the implementation seals.
3. **Ruling ⑪ amendment stamp** (seal-amends duty): the original RULINGS
   entry gains `Amended by` + one-line delta in the same doc-sync batch.
4. match-arc RULINGS: grill decisions (L0/L1) now; L2 stamp after the
   measurement run.
5. Implementation via writing-plans → SDD (small surface: match.js
   coalition term + checkView fields + panel sync + instrument).

## 8. Out of scope

Deep diagnosis of the fgM9on reserve mechanism (observation only);
promoting the M9 reserve to the world of record (separate decision);
routes B/C in any form; candidate-side arithmetic changes; capital
stage ② wiring; any new dial.
