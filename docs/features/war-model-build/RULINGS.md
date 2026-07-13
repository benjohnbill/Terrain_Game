# War Model Build — Rulings

Feature-local decision record (Record layer, birthplace tier). Rulings
here promote to ADRs when they become architecture-grade or span
features. Definitions live in GLOSSARY files, dials at their owning
model docs — this file records verdicts, evidence, and rejected
alternatives only.

## WM-① Slice 1 — decisive-battle spine calculator — SEALED 2026-07-13, L2 (battery grid + defense-layer probe)

**Verdict source:** user seal 2026-07-13 ("이 그림으로 슬라이스 1 봉인
진행하자"), closing the measurement co-analysis below.

**What is sealed.** The pure isomorphic calculator `js/battle.js` +
measurement battery `mockup/decisive-battle/battery.js` (merged to main
`38f6c3f..d4b61d6`, suite green) as build slice 1 of the war model:
first blow `R = attack ÷ shield` → three branches (REPULSED /
DECISIVE 결전 / FALL) → rout cliff + escape conversion, resolving as an
atomic one-turn emergent chain (ADR 0026). Design spec:
`docs/superpowers/specs/2026-07-13-decisive-battle-spine-design.md`;
executed plan: `docs/superpowers/plans/2026-07-13-decisive-battle-spine.md`.
All dial values are documented ports — birthplaces at combat-formula
MAGNITUDE (M2/M4/M5/M7) and FG-⑩ remain authoritative.

**User confirmations folded into the seal (2026-07-13):**

- **결전 is open-field — a MODE, not a world rule**: no terrain/fort
  multiplier on the arriving field army, because open-field is the
  arithmetic of the field-army-marches-out choice. A fortress re-fight
  or a role inversion over captured ground is another invocation of the
  same calculator (a next-turn engagement with different inputs); the
  defender-choice wiring that selects among them (catalog Defense plan
  family) is slice 2+.
- **Rout conversion follows MAGNITUDE M4 verbatim** — the plan's
  earlier flat-0.65 was a misport (0.65 is the conversion's value only
  at the cliff onset); corrected pre-execution to the sealed scaled
  rule + curve clamp + `loserTotalLoss` output.

**Measurement verdict (the §7 battery, first read).** Metrics 1–4
PASS: field-army destruction occurs (the R14 target event — L2 produced
zero), all three branches fire, Myeongnyang-class terrain flips exist,
pinned fronts fall. Metric 5 (attacker over-favor) resolved by
co-analysis DECOMPOSITION rather than a dial change:

- The raw 결전 win-rate read (~98% conditional) is an artifact of
  (a) grid under-manning — a properly-manned shield repels the grid's
  maximum attack; and (b) two sealed defense layers deliberately
  stubbed in slice 1: M9 tactical fill (FG-⑩ — which calls
  field-army-only a strawman) and the defender commitment lever
  (ADR 0021 fourth layer, FG-⑧ stub). With all layers restored in the
  probe, the picture normalizes (repulse 71.9% / decisive-win 80.9% /
  field-army rout 39.5%).
- **The formula itself is innocent** (user reading, confirmed): the
  multiplicative lever/terrain/fort composition means single-layer
  measurement overstates asymmetry; the balance surface is the SHIELD
  GATE (an attacker reaches the 결전 only by pre-assembling local
  superiority — selection, not formula favoritism), and attacker risk
  is priced at the gate (repulse + M7 toxic band), not in 결전 rout.
- **FG-⑩ rider ii (march-worn revert) NOT exercised**: the revert
  alone barely moves the picture (96.7%) — its premise is effectively
  refuted at this layer. The march-worn dial is expected to be
  SUBSUMED by the slice-2 distance-wear design rather than reverted.

**Open, explicitly carried to slice 2+ (not defects of this seal):**
distance-proportional march wear both sides + the equal-mass parity
surface (grill agenda registered in `INDEX.md` — the wear-curve shape
decides the parity grammar); M9 fill + defender commit wiring
(slice 4 / per-sector defense); winner-side 결전 casualties in the
outcome contract (slice-3 settlement, user decision); battery
`terrainFlips`/`fortFlips` split is already landed.

**Vocabulary sealed with this ruling (birthplace match-arc
GLOSSARY.md):** 방패 깨기 / 결전 ❓PROPOSED→AGREED; 캐스케이드→연쇄
붕괴 rename (구칭 alias; 직관 우선 표시어 규칙); 야전군 newly
registered AGREED. The war-decision vocabulary debt in
`docs/SYNC-DEBT.md` is paid by this batch.
