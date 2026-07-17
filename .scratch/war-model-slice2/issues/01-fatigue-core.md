# 01 — Fatigue core (피로 코어)

**What to build:** An army's condition as a persistent attribute the player can
read and reason about: one fatigue gauge fed by two ledgers. Marching wears an
army down (linear per map unit, uniform across terrain); fierce battles wear
the survivors in proportion to their own casualty fraction; the gauge converts
to a combat-effectiveness multiplier through a single continuous convex curve
that saturates at the ×0.5 floor — tiredness weakens, but never kills. Supply
interruption is the separate account: recovery locks at zero, a starvation
pump rises per cut turn, and past its entry threshold the army bleeds
substance continuously (convex in depth) — starvation kills, and touches
substance ONLY (no capability flips; fighting on while starving is the
player's choice). Steady supply multiplies per-turn recovery.

Authoritative design: slice-2 design spec §2 (dial sheet included there — all
nine dial values are 가안 constants in one block).

**Blocked by:** None — can start immediately.

**Status:** landed (2026-07-14, `js/fatigue.js` + `tests/fatigue.test.js`,
two-axis review passed, suite green)

- [x] March accrual: linear per map unit entered, terrain-uniform; battle
      accrual: proportional to own casualty fraction in the engagement.
- [x] Conversion: continuous convex curve, monotone, floor ×0.5 is the
      terminal point (march/battle alone can never push effectiveness below).
- [x] Invariant test: no sequence of marching and fighting ever reduces
      substance via fatigue ("march never kills").
- [x] Supply ledger: cut → recovery 0 + pump per turn; entry threshold gates
      the starvation state; per-turn substance loss rises continuously and
      convexly with depth; restoring the route ends the tick.
- [x] Recovery: zero when cut, base rate multiplied by steady supply.
- [x] All dials as named 가안 constants matching the spec §2 dial sheet.

**Implementation rulings (flagged, open for the magnitude pass / user):**

1. Pump reset — any supplied turn resets the supply ledger to zero (spec says
   only "restoring the route ends the tick"; reset is the simplest reading
   under which the bleed actually stops). Consequence: a partial supply
   trickle also fully resets the pump; level modulates recovery only.
2. Bleed ordering — cut turn pumps first, then bleeds at the new depth
   (turn N of a siege bleeds at depth N).
3. Wear-ledger identifier — the march/battle ledger is `wear` in code
   (spec §1 "loses by its wear"); `march` alone misnamed battle accrual.
