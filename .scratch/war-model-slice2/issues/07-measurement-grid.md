# 07 — Measurement grid: metrics 1–4 (측정 그리드)

**What to build:** The slice-2 measurement battery for everything that does
not need bots: extend the scenario-matrix pattern with layer-restoration
knobs from the start (the slice-1 methodology lesson — never measure with a
contradictory layer silently stubbed). Four registered reads: (1) the
parity-surface grid — wear × commit × quality sweeps at equal mass, checking
that the sealed grammar emerges (defender's bloody repulse; piercing possible
but expensive); (2) the Swift Seizure success sweep — distance × defense
multipliers × reserve reach, answering the user's value concern with
evidence, not a nerf; (3) the mass-inversion rate — how often the smaller
force wins at equal wear (the land-derived identity guard); (4) the
commit-curve descriptive sweep — data only, the re-grading decision belongs
to its own session.

Authoritative design: slice-2 design spec §11 (metrics 1–4).

**Blocked by:** 02 — Movement contract; 03 — Engagement v2.

**Status:** landed (2026-07-16, `mockup/operational-layer/probe.js` +
`mockup/operational-layer/metrics.js` + tests, suite green 399/399, zero
regressions; branch `war-model-slice2-ticket07`, commits 1455512 + 8f69a27;
run via `npm run metrics:slice2`). Metrics 1–4 only — metric 5 (fizzle re-read)
needs bots and stays with ticket 10 per spec §11.

- [x] Deterministic grid runs with layer-restoration knobs exposed per
      dimension. The probe exposes exactly the layers js/battle.js still stubs
      — `fillFactor` (M9 tactical fill at ×0.5) and `shieldCommit` (ADR 0021
      fourth layer) — plus the HELD recovery dial (§2 dial 9); ticket 03's
      defender commit lever is REAL and deliberately not re-stubbed.
      `NEUTRAL_KNOBS` reproduce `resolveEngagement` exactly (drift guard), and
      every grid sweeps the knobs as dimensions, so no run inherits a hidden
      choice.
- [x] Parity read reproduces the bloody-repulse band at equal levers and
      reports where piercing flips it. Equal-lever worn attacker wins 0/24
      (arithmetically forced); 83.3% of those repulses sit under the M4 rout
      cliff (bloody repulse), 16.7% rout. The piercing frontier prices the
      flip by wear depth: wear 0–4 → commit +4 or quality +0.25; wear 6 →
      commit +12; wear 12 (the ×0.5 floor) → no single lever in range wins
      (both maxed → R2 exactly 1.0). Expensive and legible, as sealed.
- [x] Swift Seizure sweep reports success rate across distance / defense
      multipliers / reserve reach. Distance 66.7% (0h) → 25.9% (12h); defense
      plains/none 86.7% → mountains/fortress 0%; reserve reach reported as its
      own bucket (true 45.6% / false 51.1%). Overall 47.4%.
- [x] Mass-inversion and commit sweeps report; no balance decision encoded.
      Inversion 0/108 across the clean equal-lever set (the rider (d)
      land-derived guard holds), 17.2% once a lever gap opens. Commit curve
      reported as data only (commit 8 → R2 0.996, 14 → 1.163); the re-grading
      verdict stays with its dedicated session (§1 rider c). The harness
      carries no pass/fail threshold and no verdict field: all
      classifications are the sealed calculator's own outputs.

**Implementation rulings (flagged, open for the magnitude pass / user):**

- **Forced march unswept.** §11 registers distance / defense multipliers /
  reserve reach as metric 2's axes; adding forced march would be the harness
  choosing an unregistered dimension. `probe.marchArrival` carries the
  capability and is tested — the sweep is a registered gap, not an omission.
- **Mirror pins over mirrored dials.** The probe mirrors three js/battle.js
  dials the sealed module does not export (same convention as
  `probe-defense-layers.js`). Rather than trust a behavioural guard over fixed
  scenarios (which a drifting dial can slip past), each mirror is pinned by
  bisecting the calculator for the value it actually uses at its own branch
  flip. Verified to fail on a 0.30 → 0.31 drift.
- **Inversion counts defending substance, not field-army size.** With the M9
  fill restored the garrison fill is real defending mass, so the "smaller force
  won" label compares against `faMass + garrison × fillFactor`. Rider (d)
  guards against piercing levers, not mass. (Caught by the spec-axis review;
  the descriptive rate corrected 10.4% → 17.2%, the guarded claim unaffected.)
