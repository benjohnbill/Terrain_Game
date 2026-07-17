# 08 — Opportunism window read, C1 (창 산술)

**What to build:** The bot motion SPEC_GAP ① demanded: a per-turn, per-front
window arithmetic — one function, two consumers. For each candidate front,
the read computes my deliverable effective force there (substance × projected
arrival fatigue along the path, forced-march option considered × the commit I
can allot from the budget × quality) against what actually defends it now
(the garrison estimate band × public terrain and fortification, the standing
posture priced as an unknown categorical, plus every enemy detachment whose
reach cone intersects the response window, each at its own projected arrival
fatigue, weighted by their commit slack from the disposition estimate).
Pinned (묶임) = no enemy cone intersects the response window; pinning
engineering — draining their cones with feints so the real blow lands
unanswered — must emerge as bot behavior. In peacetime, the window crossing
the appetite threshold (가안) is the war-declaration signal, replacing the
static declare gate; in wartime, argmax window picks this turn's target.
Reuses the sealed disposition dial (λ) for band judgment — no new
information rules.

Authoritative design: slice-2 design spec §7.

**Blocked by:** 03 — Engagement v2; 04 — Division + commit budget;
05 — Intel v2.

**Status:** LANDED (branch `war-model-slice2-ticket08-09`, pure module —
game.js wiring deferred to a later ticket)

- [x] Scripted boards: the read picks the front a designer would (fixture
      set covering open window / deterred / pinned-elsewhere cases).
      → `readFronts + bestTarget` test: soft+unreachable `open` chosen over a
      hard-shield `deterred` front and a reserve-answered `defended` front.
- [x] Pinning scenario: a feint that occupies the defender's cones opens the
      real target's window; the bot exploits it.
      → `applyFeints` test: one reserve whose cone covers both the real target
      and a feint sector; feinting draws it off (`engaged`), the real target
      goes `pinned`, the window opens. The read exposes the mechanism; which
      feints to spend is bot behaviour (later wiring ticket).
- [x] The posture-pricing rule (worst-case vs expected-value over the
      unknown categorical) is decided in-ticket and documented in the ticket
      close-out. → see close-out below.
- [x] Same function serves declaration (threshold) and targeting (argmax).
      → `windowRead` is the one function; `bestTarget` is the argmax consumer,
      `declaration` gates that same read by the appetite threshold 가안.

## Close-out

**Implementation:** `js/window-read.js` (pure UMD module) +
`tests/window-read.test.js` (16 tests). Full suite 388/388. The read composes
only sealed slice-2 primitives — λ dial (TP②, ported from
`mockup/combat-calc/plan-ai.js` `judgedValue` with a birthplace citation, as
`battle.js` ports MAGNITUDE dials), reach cones + estimate bands (`intel.js`,
ticket 05), fatigue effectiveness (`fatigue.js`, ticket 01), battle `sidePower`
+ shield multipliers (`battle.js`, ticket 03), movement paths (`movement.js`,
ticket 02) — and invents no new information rule (spec §7). Own-force terms are
exact; only enemy terms are banded and λ-judged (D1 / spec §6).

**In-ticket ruling — posture pricing: WORST-CASE, not expected-value.** The
read prices the standing posture at the worst *plausible* value rather than
averaging over the enemy court's hidden choice. The standing posture is an
unknown *categorical*, not a scoutable band: spec §6 places commit/posture in
the dark market (깜깜이 시장), unreachable at any confidence. The read prices it
worst-case because:

1. **The dark-market seal forbids the EV prior.** Expected-value needs a
   probability distribution over the enemy court's hidden posture choice —
   information §6 says the bot cannot have. Averaging fabricates that prior;
   worst-case assumes only that the enemy is competent. This is the sister of
   bot doctrine §9 ("personality lives in information and disposition, never in
   fabricated knowledge or a calculation handicap").
2. **Worst-case makes reconnaissance the lever that OPENS windows.** Absent
   positive information the read assumes a prepared defender (posture commit =
   8 가안, the M2 knee ×1.5); a quiet border alarm or a reserve confirmed
   elsewhere lets the caller pass a lower `front.postureCommit`, stepping the
   read down toward the caught-flat baseline (commit 0 → ×1.0). This is §8's
   "information converts prevention into pre-emption" and §7's requirement that
   pinning pay off — both would be inert under EV, which hands the attacker
   partial credit for free.
3. **The attacker earns first-blow decisiveness (§8) by MANUFACTURING the
   low-posture / no-reserve state**, never for free. Worst-case default is what
   makes that operational play necessary and rewarding.

**NOT literal minimax** (the absolute ceiling, commit 20 → ×2.0): that value is
unreachable in the world's own arithmetic, because commit is ONE non-bankable
realm pool (ticket 04 / spec §4) — a defender cannot stand at maximum commit on
every sector at once, so pricing every front at the ceiling would assume an
enemy the budget forbids. The default is the worst posture a competent court can
actually hold: `POSTURE_WORST_COMMIT = 8`, the M2 knee (×1.5). Minimax over a
resource the enemy does not have is not caution, it is a different fiction.
(Review catch: the first draft labelled the ruling "minimax" while implementing
the knee — the label was corrected, not the value.)

**Corollary — the standing posture is worst-cased, a RESPONDING detachment's
commit slack is λ-judged.** This asymmetry is spec §7's own split, not an
inconsistency: the denominator prices the standing shield as "standing posture =
unknown categorical — priced, not known" (no band exists to judge), but each
responder's term as "their commit slack (disposition estimate — TP② λ reuse)".
The quantities differ — a posture already stands (a taken choice the read cannot
see), while a responder's commit is a *future* allotment the court has not yet
made, which is exactly what the disposition estimate is the sealed instrument
for.

Flagged for **ticket 10 measurement** (not a correctness concern): worst-case
pricing biases toward fewer declarations and could re-freeze the war; the
appetite threshold 가안 (1.7, mirroring the retired static gate) absorbs that
calibration.

**Open (deferred to the wiring ticket):** the numerator's "commit I can allot
(budget slack)" arrives as a caller-supplied `attacker.commit` slot — the read
never consults `js/commit.js` itself, because allotment is a court decision
across all simultaneous uses (one pool, spec §4), not a read-local one. The
wiring ticket draws the slack from the pool and passes it in.

**Boundary:** `resolveEngagement` (ticket 03) stays the pure calculator;
`windowRead` is the pure read. Neither is wired into `game.js` this slice — the
window read's consumers (declaration + targeting) plug into the bot court in a
later wiring ticket. Ticket 09 (bot exit) consumes this read's output directly.
