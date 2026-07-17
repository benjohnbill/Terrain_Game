# 03 — Engagement v2: symmetric decisive battle + contact methods (교전 v2)

**What to build:** The decisive-battle arithmetic becomes symmetric: each
side's power = substance × commit lever × quality (slot, fixed 1.0) × fatigue
effectiveness. The defender's field army carries its OWN commit lever at the
결전 (the commit duel). The flat defender-only march-worn dial is retired —
fatigue values now arrive as inputs from the ticket-01 curve. Defense contact
methods enter as a categorical input to the ONE calculator: Stronghold
Defense (거점 방어) is the current spine unchanged (the default); Delaying
Defense (지연 방어) shifts the outcome bands — decisive repulse off the menu,
"not taken this turn" cheap to reach, an erosion tick, self route-disruption
on withdrawal. Includes the small prefactor of extracting the per-side power
product so both sides compose identically. The slice-1 calculator contract
stays green throughout.

Authoritative design: slice-2 design spec §1 (grammar), §8 (contact methods);
Delaying semantics per its operation-plan catalog claim block (pointer, not
restated).

**Blocked by:** 01 — Fatigue core.

**Status:** landed (2026-07-15, `js/battle.js` + `tests/engagement-v2.test.js`,
suite green 337/337, zero regressions)

- [x] Parity scenario reproduces the sealed grammar: equal mass, equal commit
      and quality, attacker marched farther → defender's bloody repulse,
      attacker losses well under the rout cliff (R2 0.786, loss 0.168 < 0.30).
- [x] Piercing: a sufficient commit differential (and/or quality gap) flips
      the parity outcome — expensive, visible in the result (commit 20 vs 8 →
      R2 1.054; a quality gap flips it identically).
- [x] Delaying never produces a decisive repulse, holds the sector this turn
      more cheaply than Stronghold at equal commit (same forces: Stronghold
      takes the sector, Delaying → NOT_TAKEN), and pays the erosion tick.
- [x] All pre-existing slice-1 tests remain green (contract preserved).

**Implementation rulings (flagged, open for the magnitude pass / user):**

1. Retired-dial policy — `FIELD_ARMY_MARCH_WORN = 0.75` is removed. Fatigue and
   quality are per-side inputs that default to **1.0 (fresh)**, not 0.75, so an
   omitted side reproduces the raw substance × lever product and a fresh
   defender is fresh. The slice-1 contract scenarios that intended a march-worn
   intercepting field army now pass `fatigue: 0.75` **explicitly** (contract
   preserved by making the old hidden default a stated input, not a disguised
   dial). Touched: `tests/battle.test.js`, `tests/battle-battery.test.js`,
   `tests/battle-probe.test.js`. The Working-layer measurement instruments
   (`mockup/decisive-battle/battery.js` `buildMatrix`, the probe grid) are left
   to measure the NEW symmetric world — their tests only assert structural
   invariants (partition, monotonicity), so they were not frozen to 0.75.
2. Attacker fatigue/quality apply to the **first blow too**, not only the 결전
   (a worn attacker breaks the shield less easily). Grounded in ticket 02's
   boundary note — arrival fatigue is the combat penalty, so it prices the R at
   every contact. Default 1.0 keeps the slice-1 first-blow byte-identical.
3. Delaying arithmetic (가안, birthplace = operation-plan-catalog CATALOG claim
   block): the delayer fights terrain screen + its field army as ONE combined
   screen (same stake as Stronghold, fought continuously rather than
   wall-then-stand). One ratio `Rd = attackerPower / (shield + fieldArmyPower)`;
   `held` (NOT_TAKEN) iff `Rd < DELAY_BREAKTHROUGH_R` (가안 2.0), else CEDED. No
   rout either direction (`attackerRouted`/`delayerAnnihilated` always false —
   decisive repulse off the menu, dissolution not annihilation). `erosionTick`
   (가안 0.15) fires on a held turn (the still-contested sector degrades);
   `routeDisruption` is a constant signature side effect of the posture (bridges
   burned to buy time). The exact "erosion vs route-disruption per outcome"
   split and the two 가안 bands are magnitude-pass targets.
   - Casualty split (deferred, per this ruling): the garrison screen takes
     contact losses (`defenderShield`), but the delayer's field army withdraws
     **intact** (no modeled loss) — force preservation IS the delaying payoff
     ("dissolution, never annihilation"; the army lives to delay another
     front). This is the intended 가안 reading, not an oversight; exact
     magnitudes are a magnitude-pass concern.
   - Not emitted (deferred): the CATALOG lists `confidenceGain` ("contact
     informs") as a secondary Delaying side effect. It is not one of the four
     acceptance criteria and the intel system is unwired to this calculator, so
     no confidence signal is emitted here — a follow-up when intel v2 (ticket
     05) meets the engagement layer.

**Boundary (checked, not owed here):** `resolveEngagement` is still a pure
calculator — not yet wired into `game.js`/`combat.js` production flow (that
plumbing belongs to a later ticket / the game loop). M9 tactical fill and
field-army interception geometry (spec §8 reactive layer, FG-⑧) stay deferred;
the probe's `fillFactor` knob still explores that unshipped layer.
