# ADR 0033: Unassailability Affordability Bound

Date: 2026-07-11

Status: Accepted
Amends: match-arc ruling ⑪ (regeneration window W = 6) — refinement, not
reversal: recruitment futures stay rival-side only, but are now
affordability-bounded.
Decision source: dominance-gate grill design spec
`docs/superpowers/specs/2026-07-11-unassailability-affordability-design.md`
(user-approved section by section, 2026-07-11); implemented commits
e0ca722 / 5c75c0b / c7dbfd8 (247/247, final review clean); measured
2026-07-11 (full `--growth` sweep, match-arc RULINGS AB-①).

## Context

The hegemony gate's unassailability clause credited each in-balance rival
with a recruitment-futures term of `min(cap headroom, rate × W)` — it asked
whether the rival had ROOM to recruit, never whether the world would let it
happen. Meanwhile the live engine's `doRecruit` binds every actual draft by
treasury (surge-curve `draftBill`) and by register bodies. The checker was
the only place in the world where soldiers were free.

Measured consequence, twice: any mechanism that raises rival ceilings
raised the wall instantly — the §5 flat `capPerSector` sweep and the
occupation-geography `capLandFrac` sweep (v2 seal run: denied-dominant
ctrl 89→239, fgM9off 145→375 as frac 0→1) were both monotone. The growth
engine (DT-② intent) could not be switched on because its gains armed the
coalition as paper defense. The honesty test that framed the fix: **the
referee counts only what the world sells.**

## Decision

Per in-balance rival, at check time (snapshot, deterministic, zero new
dials):

- `futures = min(headroom, rate, money, bodies)` — was `min(headroom,
  rate)`. `money` = the max draftable men whose surge-curve bill
  (`ECON.draftBill`, binary search, intensity rise included) fits
  treasury + regenWindow(6) × check-time income; `bodies` = the civilian
  register (pool − serving).
- **Exact legacy fallback**: non-finite money/body inputs (fixture boards'
  NaN treasury, standalone prototype fixtures) fall back to
  `min(headroom, rate)` exactly — fixture outcomes byte-identical (the
  occupation-geography dual-mode grammar).
- **Instrument**: `hegemonyCheck` returns `affordabilityBound {money,
  bodies, rivals}`; `finish()` copies it into `finalCheck`; the
  plan-battery aggregate exposes **affordability-bind rate**
  (`affordBindRate`) and the `--growth` deep line prints it
  (anti-vacuousness, per the previous pass's final-review lesson).
- Candidate-side arithmetic (present punch only), leadership rows, the
  dominance escape (DT-③), and every other gate component are untouched.

## Rejected alternatives

- **Route B — candidate-side futures**: reverses ruling ⑪ and invites
  paper-punch snowballs.
- **Route C — window/discount shrink**: lowers the wall without changing
  its cap-proportional SHAPE; both sweeps showed the shape, not the
  height, is the problem.

## Consequences

- The bound is real and lowers the wall's BASE — at frac 0, dd ctrl 89→78,
  fgM9on 135→69 (halved), fgM9off 145→124 vs the v2 seal run; affordBindRate
  bites arm-conditionally (ctrl 4.1% · fgM9on 23.5% · fgM9off 12.7%).
- The frac-coupled RE-ERECTION survives (dd still monotone in frac on
  ctrl/fgM9off) — money/bodies were not the wall's load-bearing member at
  high frac. This is a clean causal read; the design's named contingency
  (the fgM9on reserve route) became the live candidate and fed the same
  day's M9-promotion grill (ADR 0034, match-arc AB-②…④).
- Denied-dominant counts are not comparable across the surgery — the
  bound-live frac-0 row re-baselines the bucket family.

## Authoritative homes

- Ruling, measured values, riders: match-arc `RULINGS.md` AB-①; terms
  (affordability bound, affordability-bind rate) in match-arc `GLOSSARY.md`.
- Design record: the spec above; measurement of record:
  `docs/features/match-arc/research/2026-07-11-record-world-baseline.txt`.
