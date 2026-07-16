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

*Amended by WM-② (2026-07-14): the 야전군 "one at a time" clause is
superseded by the free-division doctrine (slice-2 spec §4); the FG-⑩
rider ii march-worn dial carried open above is retired, subsumed by the
fatigue conversion curve (slice-2 spec §2).*

## WM-② Slice 2 — operational-layer design — SEALED 2026-07-14, L0/L1 (grill + two evidence surveys)

**Verdict source:** user seals throughout the 2026-07-14 slice-2 grill
session, closed by the conversion-curve seal ("기아는 오직 보급 전용이고,
0.5 바닥 & 볼록 곡선도 동의"). Design only — implementation is the next
session. Authoritative design text:
`docs/superpowers/specs/2026-07-14-slice2-operational-layer-design.md`
(all § pointers below refer to it). Evidence layer:
`research/fatigue-factors.md` (fatigue-curve modifier candidates) and
`fog-of-war-discovery/research/intel-acquisition.md` (acquisition
channels).

**What is sealed (verdict → spec home):**

- **Equal-mass grammar** — symmetric 결전 arithmetic; defender's bloody
  repulse at parity; attacker's three paths (mass / mismatch / piercing
  levers); 결전 defender commit duel designed in this slice (§1).
- **Fatigue system** — one gauge, two ledgers (march/battle vs supply);
  march linear per hex; battle fatigue proportional to own casualty
  fraction; recovery a child of supply; single continuous convex
  conversion curve saturating at the ×0.5 march floor (the curve's
  terminal point); starvation gated by the supply ledger exclusively and
  **substance-only** — continuous convex death conversion, no capability
  stages (late ruling, same session) (§2).
- **Movement contract** — hex positions, destination orders, forced march
  as a fatigue-funded toggle (§3).
- **Field army free division** + the two-resource definitions (field army
  vs per-turn commit budget — FG-⑧'s scarcity axis unlocked) (§4).
- **War-ending composite** — capacity or will; promoted to ADR 0038 in
  the same batch (§5).
- **Information ladder** — geography public; bands with P3 aging;
  posture/commit as the dark market; five channel verdicts; two-recon
  taxonomy direction (§6).
- **Opportunism read** — per-turn window arithmetic, per-detachment reach
  cones, pinned = empty cone∩window intersection (§7; closes SPEC_GAP ①
  at design level).
- **Defense-selection wiring** — the 2+2 altitude split; standing posture
  + information-driven pre-emption; geometry-bounded reaction (§8).
- **Bot exit** — stall timer retired for read-driven settlement; bot
  doctrine: optimal within disposition and confidence constraints (§9).

**Rejected alternatives (recorded for the record layer):** snapshot
(per-engagement stateless) wear — rejected for cumulative fatigue (the
rest decision must exist); excluding battle from fatigue — rejected for
the dual-target event model (M7 refined: one event, one target, one
tax); discrete 2–3 detachment division — rejected for free division
(defeat-in-detail arithmetic is the natural price); stepped/banded
conversion mapping — rejected for the continuous convex curve (value
discontinuities); **system-forced incapacity states** (attack-incapable
/ defenseless) — rejected for substance-only starvation: incapacity
emerges from shrinking substance, and fighting on while starving is the
player's high-risk choice (the desperate stand); terrain-weighted march
wear — rejected (double-taxes movement slowness); deception/false signals — rejected (conflicts with
the true-containing band seal); resident spy network — deferred to
Phase 2; season/winter — deferred (acts through the supply channel).

**Grill catch worth remembering:** the user's draft phrasing would have
gated starvation on total fatigue; sealed instead as supply-ledger-only
entry, preserving the two-ledger firewall (march can never kill).

**Carried open:** stationary requirement for recovery (HELD dial);
commit-curve re-grading (dedicated session); catalog
altitude-reclassification pass (dedicated grill, incl. the two
reconnaissance plan cards); HCLM and three-altitude promotion proposals
(Tier-3, user); SPEC B2 amendment text awaiting user approval
(SYNC-DEBT row).

## WM-③ — the stall timer's retirement, executed (2026-07-16)

**Status: SEALED 2026-07-16 · source: ticket 11 (`.scratch/war-model-slice2/issues/11-stall-timer-retirement.md`), executing ADR 0037/0038 · L1 (hand reasoning + the measurement below)**

ADR 0038 already ruled the bot stall→white-peace timer retired in favour of
read-driven settlement. This records the *execution*, and the two calls it
forced that the ADR did not speak to.

**① `refusePeace` SURVIVES the retirement.** It is not the same animal as the
stall timer. The timer fired on elapsed time — a counter reached regardless of
the board — and *preempted settlement entirely* (a war fizzled before the
decisive battle it was heading for). `refusePeace` fires only AFTER the winner
has walked its whole concession ladder and been refused, and it states that the
winner's *will* broke — a real ADR 0038 channel. Retiring it would delete a
mechanism with no replacement: `js/bot-exit.js` models the LOSER's will breaking
and has no counterpart for the winner's. That is exactly the defect ticket 11
exists to prevent (an unowned retirement), so it stays and the gap is
**REGISTERED, not hidden** — literally: `tournament.js SPEC_GAPS` now carries
"WINNER-side will breaking has no read-driven home", alongside the other spec
silences the harness had to rule on itself. A gap asserted only in prose is a
gap nobody will find.
Empirically near-dead (9 of 79,515 war ends before the retirement, 0 after) and
reachable only by `free-rider` via the `proposalStep >= 3` arithmetic — but
rarity is a fact about current bot policy, not a reason to delete the only
channel it has.

**② CE-⑳ migrates from the timer's lock to the ladder + the read.** The old
crisis property ("stall→white-peace closes at stage 2", `totalWarLock`) died with
its subject; deleting it would have left `tests/crisis-arc.test.js` passing
**vacuously** — counting 0 because the cause string was gone, not because the
seal held. CE-⑳ is now asserted where it actually lives: `availablePresets()`
breaks the ladder bottom-up (백지→관대→표준; 최대 always survives), and
`js/bot-exit.js` takes an **open-rungs input** so a broken rung is filtered out
before the arithmetic runs — unreachable, not merely unattractive. The caller
owns the calendar; the module owns the arithmetic.

**Consequence of ②, re-derived not assumed:** once 백지 is broken, white peace
stops being free and ticket 09's never-empty invariant dies with it. The "cannot
afford any rung" branch that 09 deleted as unreachable is now REACHABLE — a court
too poor for the cheapest surviving rung affords nothing and **drags a lost war**
(ADR 0038's drag, arrived at honestly). Re-derived from the same sealed
arithmetic and pinned by test, never resurrected on faith.

**③ The death-forced 0%-rung path SURVIVES, and its invisibility is recorded
rather than fixed.** The third `returnOccupied` site (inside `eliminate()`)
returns a dead attacker's bites to the living defender. It is not the stall
timer's kin and not a will-break: it is the consequence of a belligerent ceasing
to exist, so there is nothing to retire. Its real defect is separate —
`eliminate()` takes no `record`, so those ends carry NO cause and are invisible
in `record.warEnds`, which is why the frozen baseline's white-peace share is a
**floor** (~8.8% of wars started reach no recorded end). Left unfixed HERE by
choice: this harness is retired (ADR 0037) and its baseline is now frozen, so
patching it would change nothing anyone reads. The live slice-2 loop already
records the same event honestly as `participantEliminated`, and its `endWar`
signature makes a causeless end unwritable. Registered in `SPEC_GAPS`.

**The measurement that matters (evidence, not verdict).** Removing the timer did
**not** make fizzling wars decisive — it made them *never end*. The L2 harness
post-retirement: 78.8% `stallPeace` → **72.1% of wars never reach an end at
all**. The slice-2 loop shows the same shape at its own scale (metric 5's
`unresolved` row, `mockup/operational-layer/fizzle.js`). The fizzle was renamed,
not cured; the lever is `WINDOW_APPETITE` / the trajectory 가안, and that pass is
not this ticket.

**Baseline preserved, not trusted.** The retirement destroys the world that
produced the recorded R14 comparison target, so the re-derived baseline is frozen
into `mockup/operational-layer/baseline-l2.json` **before** the deletion — with
its own provenance and source commit, so it can be audited rather than believed.
Prose was never a comparison target; a snapshot with a re-runnable commit is.
