# Dial-Set Audit — Internal Economic Coherence (2026-07-03)

Adversarial audit of the proposed numeric dial set (fortificationDamage,
routeDisruption, usableValueDamage, confidenceGain) against the fixed
resolution pipeline (GLOSSARY), the magnitude decisions M1–M7, the plan
identities (CATALOG), and the match envelope (SPEC 45–95). The dial set under
audit is NOT yet in the docs; this report evaluates it as proposed.

Verdict summary: **1 CRITICAL, 2 MAJOR, 5 MINOR, 6 OK.** The dial set's core
economics (erosion race, siege clock, grinding dominance, loot leashes,
max-commit competition) are coherent as proposed. The failures are
specification holes, not wrong numbers: the raid-interception engagement body
(CRITICAL), the confidence→fog-band conversion (MAJOR, blocks half the
scouting economics), and the Recovery repair budget (MAJOR, bundling hole).

---

## 0. Inputs and audit-local assumptions

Fixed by prior decisions (not under audit):

- Pool 20/turn, one primary + surplus outlets; surplus feeds flows only (ADR 0026).
- Lever: 0→×1.00, 4→×1.25, 8→×1.50 (knee), 14→×1.75, 20→×2.00; linear between.
  Slope **+0.0625/pt below the knee, +0.041667/pt above**.
- Casualties: winner `12% ÷ R^1.4`, loser `12% × R^1.4` of engaged stock;
  loser-only rout at 30% within-engagement (open: +50% of remainder;
  blocked: 100%). Rout onset R ≈ 1.92.
- Thresholds: DP 1.1 / Raid 1.2 / SI 1.3 / Swift & Crossing 1.5 /
  Flanking 1.6 / Encirclement 2.2. Encirclement success: winner casualties ×0.5.
- Envelope: 30–40 min ≈ 15–25 turns (derived).

Audit-local assumptions (stated because the docs do not yet own them; each is
flagged where it is load-bearing):

- **A1 (fog-band model).** The docs give confidence in points (ceiling 0.90)
  but no conversion to estimate-band width. This audit assumes a linear model:
  band half-width `H(c) = H₀ × (1−c)/(1−c₀)`. Calibration: the worked band
  800–1,200 (center 1,000, half-width 20%) is taken as confidence c₀ = 0.5, so
  half-width = 40% × (1−c) of center. Under A1: +0.10 confidence moves the band
  top by ~40 men on a 1,000-center band (4% of center); +0.30 moves it ~120.
  **This conversion is a missing dial — see F2.**
- **A2 (forecast defender commit).** Safe-pin computations assume defender
  lever ×1.0 (commit 0). A fogged defender-commit band widens every number
  below but does not change the comparative structure.
- **A3 (uniform prior).** Where a probability over the band is needed, uniform.
- **A4 (attacker sustains commit).** Multi-turn chains re-commit 8 each turn;
  casualties reduce stock turn over turn.

Reference casualty table (12% base, e = 1.4):

| R | R^1.4 | winner loses | loser loses | note |
|---|---|---|---|---|
| 1.05 | 1.071 | 11.2% | 12.8% | near-parity grind |
| 1.20 | 1.291 | 9.3% | 15.5% | |
| 1.44 | 1.666 | 7.2% | 20.0% | |
| 1.50 | 1.764 | 6.8% | 21.2% | Swift bar |
| 1.60 | 1.931 | 6.2% | 23.2% | Flanking bar |
| 1.80 | 2.277 | 5.3% | 27.3% | |
| 1.875 | 2.411 | 5.0% | 28.9% | just under cliff |
| 1.92 | 2.492 | 4.8% | 29.9% | rout onset |
| 2.20 | 3.016 | 4.0% (2.0% w/ 항복수확) | 36.2% → rout | Encirclement bar |
| 2.88 | 4.408 | 2.7% | 52.9% → rout | |

---

## 1. Findings

### F1 — Max-commit invariant: HOLDS at typical decision points, conditionally — **OK (conditional on F2, F8, F9)**

The last 6 lever points (14→20) buy +0.25 lever = +14.3% relative attack power
(2.00/1.75). Three concrete decisions:

**Decision 1 — overkill assault (outlets win).** Attacker 3,000 vs known-weak
garrison 800 at a pass ×2.0 with field works ×1.3 (world 2.6, defense 2,080).

- Commit 14: attack 5,250, R = 2.524 → winner loss 12/2.524^1.4 = 3.28% = **98 men**.
- Commit 20: attack 6,000, R = 2.885 → 2.72% = **82 men**.
- The 6 points buy **16 men (0.16 부대 — invisible at the 100-man display
  quantum)**. Both cases rout the defender (43.9% / 52.9% > 30%), identical
  headline, identical stamps. Alternative: 3 surplus scouts (+0.10 × 3 sectors)
  or recovery-flow acceleration. Outlets clearly win.

**Decision 2 — knife-edge set piece (lever wins, as intended).** Attacker
3,000, Swift 1.5, fog band 1,200–1,480 behind mountains×town walls (world
2.7). Safe pin: 1,480 × 2.7 × 1.5 = 5,994 → lever 1.998 → **commit 20**. At
commit 14 (attack 5,250), if the enemy is at band top: R = 5,250/3,996 = 1.314
< 1.5 → FAIL, attacker bleeds 12/1.314^1.4 = 8.2% = **246 men for nothing**.
Under A3 the commit-14 gamble fails ~66% of the time (holds only vs garrison
≤ 1,296 of the 1,200–1,480 band). Here the last 6 points are a sector vs a
bloody nothing; outlets rightly lose. The invariant does not require outlets
to always win — only to compete at *typical* points.

**Decision 3 — typical pin (genuine competition).** Attacker 3,000, band
800–1,200, world 2.7. Band pins: weak end lever 1.08 → commit 2; strong end
lever 1.62 → commit 10.9 → **safe pin 11** ("2 if weak, 11 if strong" — D7's
grammar reproduced ✓).

- Commit 11 (surplus 9): if enemy at top, R = 4,875/3,240 = 1.504 → clears by
  0.004; loss 6.8% = 203 men.
- Commit 17 (surplus 3): R = 1.736, loss 5.5% = 167 men.
- The 6-point delta buys **~37 men (0.4 부대) + margin 0.23** (crosses no
  margin gate: Swift has none; 0.23 < 0.5 anyway) vs **3 scouts on other
  sectors or repair flows at home**. Genuinely situational — depends on
  whether other fronts need eyes or repairs.

Two structural observations that keep the invariant alive:

- **The saturation rule is load-bearing.** Without "cannot stack more than
  +0.10/sector/turn," 6 surplus points = +0.30 on one sector, strictly
  dominating a primary Reconnaissance (+0.30 for a whole turn + commit).
  Saturation is what forces primary recon to mean *speed and depth* while
  surplus means *maintenance*. Keep it; it is not optional polish.
- **Verdict is conditional**: outlet value depends on the unauthored
  confidence→band conversion (F2) and flow-acceleration rates (stage 5). If
  those land near zero, outlets die and the invariant fails by starvation, not
  by pricing.

### F2 — Confidence→band conversion is a missing dial; scouting economics can only be bounded — **MAJOR (missing specification)**

Everything in Task 2 hinges on how many men of band-top a confidence point
removes. That conversion exists nowhere in GLOSSARY/MAGNITUDE/the proposed
set. Under audit model A1:

**Setup:** attacker 3,000, Swift 1.5, band 800–1,200 (c = 0.5), world 2.7.
Unscouted safe pin 11 (F1 Decision 3).

- **(a) Primary recon +0.30** (c 0.5→0.8): band 920–1,080. New pin:
  1,080 × 2.7 × 1.5 = 4,374 → lever 1.458 → commit 7.3 → **8. Refund: 3
  commit points** (11→8), persisting until decay.
- **(b) Surplus scout +0.10** (c 0.5→0.6): band 840–1,160. New pin: lever
  1.566 → commit 9.6 → **10. Refund: 1 point for 2 spent** — nominally
  negative, but surplus points *evaporate if unspent* (pool refills fully, no
  banking), so the true comparison is against other outlets, not against
  commit. With persistence over 2–3 turns before decay claws it back,
  cumulative refund 2–4 points per 2 spent. Acceptable as maintenance; dead as
  a one-shot investment. This is the correct shape for a surplus outlet.

**General refund formula:** `Δcommit ≈ (threshold × world × Δband_top ÷ stock) ÷ slope`.
Two elegant emergent properties worth preserving:

1. **Refund is larger above the knee** (slope 0.0417 vs 0.0625): scouting pays
   most before big set-piece commits, least before skirmishes. Scout the
   fortress, not the raid.
2. **Refund shrinks with stock**: overwhelming force doesn't need intel.
   No fixed optimum ✓.

**Is a scouting TURN ever worth more than an attacking turn?** Straight
substitution says no: in Decision 3, attack-now takes the sector on turn 1 for
commit 11 (expected loss ~155 men over the band); recon-then-attack takes it
on turn 2 for 8+8 = 16 points and ~equal blood. Recon-as-primary pays only
when it *changes the decision*, and it does so in exactly three situations:

- **Feasibility bands**: Decision 2's band (safe pin = 20, or > 20). Recon
  +0.30 narrows 1,200–1,480 to 1,284–1,396 → pin 5,654/3,000 → lever 1.885 →
  commit 18: converts an all-in gamble (66% fail at commit 14) into a
  fundable, safe operation. Worth more than any single attack.
- **Target selection**: when the question is *where* to strike among 2–3
  candidates, one primary recon + surplus scouts re-prices all of them.
- **Set-piece stakes**: before fortress/Encirclement turns where band-top
  failure costs 8–13% of a 5,000+ army and gate status (isolation) must be
  read.

That is sensibly situational — but it is only verifiable under A1. **Required
property to pin as a dial:** the conversion must be ~linear in confidence and
+0.10 must move the band top by enough to refund ≥ ~1 commit point in typical
mid-game setups (≈ 3–5% of band center). Propose adopting A1's form outright:
`half-width = 40% × (1−c)` of center, floor never reaching 0 at the 0.90
ceiling (residual ±4%).

### F3 — Siege chain resolves in 2–4 turns — **OK**

Fortress ×2.4 (terrain 1.0), garrison 1,000, attacker 3,000 at commit 8
(attack 4,500), per A4.

**Uncontested defense (defender commit 0):**

| T | attack | defense | R | erosion (margin) | def. losses | garrison → |
|---|---|---|---|---|---|---|
| 1 | 4,500 | 1,000×2.4 = 2,400 | 1.875 | −0.6 (0.775 ≥ 0.5) → 1.8 | 28.9% = 289 (no rout, 28.9 < 30) | 711 |
| 2 | 2,851×1.5 = 4,277 | 711×1.8 = 1,280 | 3.34 | −0.6 → 1.2 | 64.9% → ROUT, open: 461 + 125, 125 disperse | ~0 |
| 3 | Swift vs empty works | — | ≫1.5 | take | — | — |

**3 turns.** Attacker cumulative blood: 149 + 63 = 212 (7%).

**Contested (defender Stronghold commit 8, lever ×1.5, every turn):**

| T | attack | defense | R | erosion | def. losses | garrison → |
|---|---|---|---|---|---|---|
| 1 | 4,500 | 1,000×2.4×1.5 = 3,600 | 1.250 | −0.3 (margin 0.15) → 2.1 | 16.4% = 164 | 836 |
| 2 | 2,737×1.5 = 4,106 | 836×2.1×1.5 = 2,633 | 1.559 | −0.3 (0.459 < 0.5) → 1.8 | 22.3% = 187 | 649 |
| 3 | 2,561×1.5 = 3,842 | 649×1.8×1.5 = 1,752 | 2.19 | −0.6 → 1.2 | 36.0% → ROUT: 234 + 208, 207 disperse | ~0 |
| 4 | Swift takes it | | | | | |

**4 turns**, attacker pays 541 men (18%). The 2–4 turn window from the
CATALOG's siege-feel target is confirmed at both defense postures. Note the
deliberate boundary: a *peer* fortress (garrison ≥ ~1,150 at commit 12) pushes
DP under R 1.1 and repulses it outright — then the answer is Supply
Interdiction + starvation, exactly the M5 finding ("half the fortress corpus
fell to starvation"). DP is a superiority tool, not a universal key. ✓

### F4 — Full-war clock: fits 15–25 turns, conditional on the decision-point ending — **OK (conditional)**

Casualty compounding is the war's accelerator. Two 6,000 field armies, winner
of an initial skill-edge battle at R 1.6:

| battle | stocks (A vs B) | R (equal levers) | losses (A / B) |
|---|---|---|---|
| 1 | 6,000 vs 6,000 | 1.6 (read edge) | 370 / 1,380 |
| 2 | 5,630 vs 4,620 | 1.22 | 552 / 735 |
| 3 | 5,078 vs 3,885 | 1.31 | 467 / 680 |
| 4 | 4,611 vs 3,205 | 1.44 | 383 / 641 |
| 5 | 4,228 vs 2,564 | 1.65 | approaching rout band |

One well-read opening edge decides the field war in ~5–6 contested turns; the
loser's army crosses into rout territory without any further skill input —
this is the skill-driven snowball of SPEC pillar 3 working as intended. A
decisive war then sketches as: 2–3 turns scouting/border battles + 5–6
contested field turns + 2 walled towns × 2–3 turns (F3) + 1 fortress node ×
3–4 turns (SI strangle → Encirclement) + defense/recovery overhead ≈ **16–22
turns**. Inside 15–25 ✓ — but only because the match ends at capitulation, not
map completion (SPEC already commits to this; the match-arc thread is the
honest dependency).

**Boundary condition exported to the standing-rules stage:** front-sector
garrison regeneration must stay below DP's minimum successful bleed
(12% × 1.1^1.4 ≈ 13.7%/turn), realistically **< ~10%/turn**, or sieges stall
and the envelope breaks.

### F5 — Fortification rebuild race: no stalemate, despite +0.4 > 0.6 > 0.3 optics — **OK, one interlock to keep**

Nominally Recovery (+0.4/turn) outruns DP erosion at thin margins (−0.3/turn):
net **+0.1/turn wall regrowth**. Stalemate does not materialize because repair
forfeits the defense lever:

- Defender repairs every turn → garrison defends at ×1.0. T1: R = 1.875,
  −289 men, fort 2.4→1.8→(repair)→2.2. T2: defense 711×2.2 = 1,564,
  R = 4,277/1,564 = 2.73 → 49.1% → ROUT. **Garrison erased by turn 2** —
  faster than not repairing at all. The wall race is decided in blood, and
  blood is charged at the un-levered R.
- Defender defends every turn → walls erode −0.3/turn but the garrison bleeds
  16–22%/turn (F3 contested table). Also resolves in 3–4 turns.
- Repair genuinely outpaces erosion only when DP *fails* (R < 1.1) — which is
  a repulsed siege, the correct outcome, not a bug.

**Interlock to keep (currently implicit):** Stronghold's build direction is
capped at ×1.3 (field-works tier), so an eroded fortress can only be repaired
by a Recovery *primary* — i.e., by not levering the defense. If Stronghold's
+0.1 were ever allowed to repair higher tiers, the defender could dig and
fight in the same action and the race genuinely stalls. The cap is
load-bearing; record it as such.

### F6 — Raid interception: unspecified engagement body creates a raid-as-annihilation exploit — **CRITICAL**

Raid's contest R is computed **without fortification** (M7: "field
interception, no walls") and the casualty curve is universal over *engaged
stock*. If the garrison's full body counts as engaged whenever a raid
resolves, then vs a walled sector:

- 3,000 raiders, commit 8 (4,500) vs garrison 1,000 behind town walls:
  Swift's R = 4,500/1,800 = 2.5; but **Raid's R = 4,500/1,000 = 4.5** →
  garrison loses 12% × 4.5^1.4 = 98.6% → rout → **erased**. Even 1,500
  raiders (2,250, R = 2.25) inflict 37.3% → rout → garrison ~68% gone.
- Result: the plan whose identity is *avoiding the garrison*
  (`garrisonDamage: none`) becomes the roster's best garrison-killer,
  strictly better than assault against any walled target, at threshold 1.2,
  with loot on top. Deliberate raid-grinding would also pierce the F13
  grinding invariant through the wall-free R.

The dial set specifies when raids flip routes and how much value burns, but
not **who triggers the interception or what body engages**. Fix (pick one,
both restore the CATALOG identity):

1. **Defender-triggered interception** (preferred): the contest occurs only if
   the defender sorties (a read/choice, consistent with "caught raiders take
   the bad column"). A garrison that stays behind its walls is untouched and
   untouchable; the fields burn unopposed.
2. **Skirmish engaged-fraction cap** (matchup-stage dial): both bodies engage
   at a capped fraction (~25–30%); the rout cliff then reads 30% *of the
   engaged skirmish body*, whose remnant disperses — never the full garrison.

Without one of these, the dial set ships a degenerate strategy.

### F7 — Raid loot at 50%: neither snowball nor dead plan — **OK (boundary exported)**

- **Not strictly better than conquering.** Raid at cap destroys 30%p of base
  value; loot = 50% × 30%p = **15%p of sector base value, one-shot**. Conquest
  opens the sector at 50–60% usable (ADR 0022) recovering +10pp/turn: over
  even 8 remaining turns that is ≥ 4–5× base value cumulative, plus victory
  progress — a ~30:1 stream-vs-shot gap. Raiding a conquerable, holdable
  sector is always wrong ✓ (and burning it torches your own inheritance,
  leash 3).
- **Not strictly worse (not dead).** The niche is real: threshold 1.2 vs 1.5,
  wall-free contest R, works where assault is infeasible or the sector
  unholdable; and the *denial* side (enemy permanently loses 30%p of a
  periphery sector's economy and its regen base) pays independently of loot.
  The four CATALOG leashes are structural, and the loot pool is one-shot per
  sector (self-exhaustion: 2–3 stamps to ash), so the 50% conversion sets
  magnitude, not dynamics — even 100% would not create a state-loop.
- Off-label check vs Supply Interdiction survives: Raid's route flip needs
  R ≥ 1.7 (margin +0.5) vs SI's unconditional flip at R ≥ 1.3, and Raid burns
  a prize SI leaves intact. Dearer currencies exist ✓.
- **Boundary exported to the economy stage:** the value-to-points currency
  must price a cap raid's return (15%p of base) at roughly 1–2 turns of a
  typical sector's yield. Below that, Raid dies to opportunity cost; far
  above, greed outshines denial.

### F8 — Recovery primary repair budget is unpriced: bundling hole — **MAJOR**

As written, one Recovery primary delivers: route repair (unconditional flip)
+ fort +0.4 + garrison reinforcement + usable +10pp — simultaneously. That
lets **one defender turn cancel ~two attacker turns** (one SI turn + one DP
turn + damage), inverting the 1:1 action trade that ADR 0026 and the CATALOG
explicitly protect ("if leftover capacity could erase a full-turn cut,
interdiction would die" — the same logic applies to bundling *within* the
primary). CATALOG already says "commitment decides how much gets fixed;
triage worst-first" — the dial set must price the menu. Proposal consistent
with the authored numbers (reading "+0.4" as the knee-commit rate):

| repair item | cost (commit points) |
|---|---|
| fort repair | +0.05 per point (8 pts = +0.4, matching the dial) |
| route flip (repair) | 8 pts |
| usable +10pp (above standing) | 4 pts |
| garrison reinforcement | stage-5 rate per point |

Then commit 8 buys ~one state repair (the authored dial), commit 20 buys
~2.5 — a max-commit Recovery undoes ~1.5 attacker turns, preserving
interdiction's starvation-tick profit margin while keeping deep repair
reachable as an exceptional full-pool act (mirrors the lever ceiling's
"expensive, exceptional" framing).

### F9 — Surplus outlet absorption capacity — **MINOR**

Typical surplus is 5–12 points; outlets are scouting (2 pts/sector, saturating
at ~3–4 useful frontier sectors ≈ 6–8 pts) and flow acceleration (rates
unauthored). A mid-war *attacker* with an intact homeland may find recovery
flows idle and scouting saturated — points 15–20 then buy lever or evaporate,
quietly re-installing max-commit as the default (the knee-magnet failure M2
rejected). Requirement for stage 5: flow acceleration must be purchasable in
useful quantity at front sectors (garrison regen top-up is the natural sink).
Re-audit outlet absorption when those rates land.

### F10 — Stronghold +0.1/defended turn: define "defended" — **MINOR**

If a quiet turn with Stronghold selected counts, every calm border sector
drifts to ×1.3 for free (minus the primary's opportunity cost), undercutting
the economy-stage build pricing ("multiple primary turns + resources", M5).
Specify: **+0.1 only on a turn the sector actually resolved an enemy attack**
(field works thrown up *under fire*, matching the axis rationale). Peacetime
fortification stays the economy-stage build action's business.

### F11 — Base-vs-usable layer labels incomplete; Scorch commit scaling omitted — **MINOR**

The two-layer model (usable recovers via standing +10pp; base only via
rebuild) needs every stamp labeled:

- Raid −15→−30%p: **base** (leash 3 says permanent) ✓ implicit — make explicit.
- Scorched Earth: labeled ✓ (econ base −30%p, pop usable −50%p) — but the
  CATALOG's "commitment scales thoroughness" is missing from the dial; add a
  low-commit hasty tier (e.g., −15%p/−25%p at commit ≤ 4).
- DP −5%p per success: unlabeled. Propose **usable** (requisition/blockade
  wear — recovers after the siege lifts), else 3–4 DP turns permanently damage
  a prize DP's identity says it takes *cheaply once worn*.
- Recovery +10pp: usable-layer only (matches CATALOG axis text). Base rebuild
  is separate Recovery-primary work priced by the economy stage — say so, or
  scorched/raided periphery is unrepairable by omission rather than by design.

### F12 — Flanking's route flip is a near-dead clause — **MINOR**

Flanking flips a route only at margin ≥ +0.5 → R ≥ 2.1, rare for the plan
whose niche is refusing *strong* fronts. Raid reaches its flip at R ≥ 1.7 on a
wall-free denominator, so in practice Raid is the secondary route-cutter and
Flanking's `routeDisruption: secondary` barely fires. Either accept as a rare
bonus (defensible) or gate Flanking's flip at margin ≥ +0.3 (R ≥ 1.9). No
identity damage either way; flag for the matchup sheet.

### F13 — Grinding dominance: Deliberate Pressure dominates deliberate failure at all tested R — **OK**

The casualty curve is headline-blind, so at equal R every plan buys the same
exchange; DP (threshold 1.1) succeeds and adds stamps wherever deliberate
failure tempts:

| R | exchange (att/def) | deliberately-failed Swift/Enc. gets | DP gets |
|---|---|---|---|
| 1.20 | 9.3% / 15.5% | exchange only | exchange + fort −0.3 + usable −5%p |
| 1.44 | 7.2% / 20.0% | exchange only | exchange + fort −0.3 + usable −5%p |
| 1.80 | 5.3% / 27.3% | exchange only | exchange + fort −0.6 (margin 0.7) + usable −5%p |

Strict dominance at every row ✓. Reinforcements: DP's frontage exemption means
a failed Swift at a wall fights *frontage-capped* (worse R than DP's at equal
strength); a failed Crossing eats the water penalty first; battle-contact
confidence (+0.10) accrues to DP identically. Below R 1.1 both fail and the
exchange approaches parity (11.2%/12.8% at 1.05) — no temptation there. The
only leak was Raid's wall-free denominator, closed by F6. Invariant holds.

### F14 — Confidence decay boundary condition — **boundary statement (owned by the decay stage)**

Requirements: one surplus scout (+0.10) must be able to *maintain* a watched
sector (else the outlet is a treadmill and dies), yet holding the 0.90 ceiling
must not be free (else scouting self-obsoletes mid-match once contact byproducts
accumulate).

- Flat decay d: **0.05 ≤ d < 0.10 per turn per sector.** d ≥ 0.10 kills
  surplus scouting; d ≤ ~0.03 lets the whole front sit at ceiling.
- Better shape — proportional with a doctrine floor:
  `d = δ × (c − 0.30)`, δ ≈ 0.20. Equilibrium under one surplus scout:
  0.10 = 0.20 × (c − 0.30) → **c_eq = 0.80**. Surplus maintains up to 0.80;
  the 0.90 ceiling is reachable only through primaries, battle contact, or
  repelled assaults, and sags back to 0.80 under maintenance — the ceiling
  stays earned, maintenance stays meaningful, and unwatched sectors fall to
  the 0.30 doctrine floor in ~5–7 turns.

---

## 2. Verdict by dial

| Dial | Verdict | Action |
|---|---|---|
| DP erosion −0.3 / −0.6 @ margin ≥ 0.5 | **Coherent** (F3, F5, F13) | keep; label the −5%p usable-layer (F11) |
| Swift erosion −0.1 | Coherent (symbolic, correct identity) | keep |
| Stronghold +0.1 (cap ×1.3) | Coherent, underspecified | define "defended turn" = attacked (F10); record the ×1.3 cap as a load-bearing interlock (F5) |
| Recovery fort +0.4 (cap authored tier) | Number fine; **bundling hole** | price the repair menu per commit point (F8) |
| SI route flip / secondary flips @ margin ≥ 0.5 | Coherent | keep; optionally soften Flanking's gate to +0.3 (F12) |
| Self/friendly flips unconditional | Coherent | keep |
| Raid −15→−30%p + 50% loot | Loot coherent (F7); **interception unspecified** | fix engagement body (F6, CRITICAL); export loot-currency boundary to economy stage |
| SI no-stamp (starvation handles it) | Coherent — cleanest dial in the set | keep |
| Scorch −30%p base / −50%p pop usable | Coherent | add commit scaling tier (F11) |
| Recovery +10pp (on standing +10pp) | Coherent as usable-layer | label the layer; state base-rebuild path (F11) |
| Recon +0.30 (±0.10) / surplus +0.10/2pts / contact +0.10 / repelled +0.15 | Ladder ordering coherent; saturation rule load-bearing (F1) | **author the confidence→band conversion** (F2, MAJOR); pin decay in F14's range |
| Scale anchors, 8–15 commits / 5–12 surplus | Reproduce D7 band grammar in worked examples ✓ | keep; watch outlet absorption (F9) |

## 3. Required changes before the dial set enters the docs

1. **(CRITICAL, F6)** Specify raid interception: defender-triggered sortie, or
   skirmish engaged-fraction cap ~25–30% with rout read on the engaged body only.
2. **(MAJOR, F2)** Author the confidence→band-width conversion; proposed:
   half-width = 40% × (1−c) of band center (linear, residual ±4% at ceiling).
3. **(MAJOR, F8)** Price the Recovery repair menu per commit point (fort
   +0.05/pt; route flip 8 pts; usable +10pp = 4 pts) so one primary ≈ one
   state repair at the knee.
4. (MINOR, F10) Stronghold +0.1 only on actually-attacked turns.
5. (MINOR, F11) Label every usableValueDamage stamp base/usable; add Scorch
   commit scaling; state the base-rebuild path.
6. (MINOR, F12) Decide Flanking's flip gate (keep 0.5 as rare bonus, or 0.3).

Exported boundary conditions (owned by later stages, cite this audit):
front garrison regen < ~10%/turn (F4); loot currency ≈ 1–2 turns of sector
yield per cap raid (F7); confidence decay per F14; surplus flow-acceleration
absorption (F9).
