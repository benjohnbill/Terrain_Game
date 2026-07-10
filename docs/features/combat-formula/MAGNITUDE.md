# Magnitude Pass — Working Decisions

The joint completion point of the operation-plan catalog shape pass
(12 plans, 2026-07-02) and the combat-formula structural pass (D1–D11,
2026-07-03). This file records the actual numbers those passes deferred.

Method (standing): numbers are authored as complete coherent sets and
presented through worked scenario sheets, never one value in isolation;
every set is checked against the INDEX invariants (max-commit,
no-fixed-optimum, match envelope, anti-gamey, determinism ≠
repetitiveness) and finally against the scenario battery. Numbers are
user decisions; survey-groundable structure may close autonomously
(delegation precedent, MATCHUP.md).

## M1 — Scale anchors (2026-07-03)

**Troop numbers are literal bodies; the ledger is integer-exact.**
The engine stores and computes troops as exact integers — 970 and 1,010
are different values everywhere in the logic; R is always computed from
exact values. No rounding exists anywhere in resolution.

**Reading vocabulary: 1 unit (부대) = 100 men — a display quantum only.**
Internal unit simulation (persistent sub-units with their own state
inside a sector stock) is rejected for the MVP by the gear test — a
mechanism must touch either the player's eye or a decision:

- No decision reads it: the input surface is frozen at plan + slider
  (D4 positioning check), and the formula consumes a single substance
  number, so per-unit internal state would be computed and then summed
  away before anything uses it.
- If internals were allowed to move outcomes instead, the player cannot
  see them — a deterministic verdict hinging on invisible internals
  reads as dice (the same logic that rejected per-hex ledgers in D3).
- Per-unit breakage would soften the D10 rout cliff into a staircase,
  contradicting the survey finding (command collapse is near-binary).

Reopen trigger: the generals system — a commander needs an
organizational skeleton to stand on (same reserved-slot pattern as
technology in the quality term). Unit-name flavor (졸/초/부대) is a
DOMAIN_MAP question, not a magnitude question. 100-man quantum chosen so
typical casualty stamps stay visible in unit language (a 12% loss on an
800-man garrison reads as "1 unit lost"; a 500-man quantum would hide it).

**Display rules (legibility guard):**

- Own forces: unit chunk + exact count — "8개 부대 · 823명". Rounding
  own-side display alone would create screen-identical states with
  different outcomes, eroding traceable determinism.
- Enemy forces: unit-band estimate only — "8~12개 부대 추정". Fog
  already hides precision; units are the natural clothing (scouts
  historically counted banners and cookfires, not men).
- Frontage caps phrase in units: "this pass fits 2 units."
- Decisions are anchored to the forecast card (R band, recommended
  commit range), which is always computed from exact engine values.

**Typical troop scales** (calibration reference, not rules): rural
garrison 300–800; key-sector garrison 800–1,500; field-army sector
stock 2,000–6,000; legendary-fortress garrison ~1,000.

**Command pool = 20 points per turn.** Per D2: identical for every realm
size; points are attention, never troops. Rationale:

- Poker resolution: recommendation bands land ~6–8 points wide
  (e.g., "8 holds if they are weak, 15 if strong" — D7's language),
  wide enough for pin-placement skill. A 10-pool compresses bands to
  3–4 positions; a 100-pool manufactures false precision.
- Surplus arithmetic: typical commits of 8–15 leave 5–12 points —
  enough to feed 1–3 outlets meaningfully (max-commit invariant needs
  surplus to stay worth spending).
- Divisibility: splits cleanly (7/7/6) if the turn structure ever
  changes (see deferred threads below).

The pool size is a *denominator/legibility choice, not a discovered
constant*: the logic consumes ratios (band width as a fraction of pool,
typical commit fraction, lever-curve shape). Re-denomination later is
cheap if the ratios are preserved. Validation is reserved for the
scenario battery at the end of this pass.

UI note: the commit slider may render as a smooth bar but snaps to 1/20
steps (5% each).

## Method lens — the commitment horizon (user, 2026-07-03)

Every value in R decomposes by *when the commitment was made*:

```
R = (my frozen past × my liquid present) ÷ (their frozen past × their liquid present)
```

- **Frozen commitment**: troop stocks, fortifications, (future) tech —
  past turns' commits crystallized into world state. Terrain is the one
  term that is nobody's commit: pure world background.
- **Liquid commitment**: this turn's 20-point pool.
- The per-turn question is therefore always: spend the liquid on
  *today's R* (battle commit) or on *tomorrow's R* (building,
  reinforcing, recovering — or, against the opponent, interdiction as a
  *negative lever* on their future).
- **Scouting is a third good**: it buys neither R nor future R but the
  *price tag* — narrowing the fog band lowers the safe pin, refunding
  tomorrow's overpayment into surplus. Power, frozen power, information.

This is a unifying restatement, not a new mechanism: D7's rider (static
investment = effective tempo), D2's wallet/ledger split, and M3's
default stance (defaults short-term, skill = deviating toward the
future) are the same lens from three sides. Use it when classifying or
balancing actions: main-vs-surplus sharpens into "is this turn's main
question the present or the future?" — and ADR 0026's repair economics
already prices that boundary (states change by actions; surplus feeds
flows). The lens completes when governance/economy/scholarship systems
add more goods; it does not depend on how the wallet is partitioned
(deferred-thread independent).

## M2 — Commitment lever curve (2026-07-03)

Both sides map committed points through the same curve (D6 one
grammar); defense baseline: 0 points = ×1.0 (an unattended garrison
fights at its own strength). Anchor points, linear between:

| points | lever |
|---|---|
| 0 | ×1.00 |
| 4 | ×1.25 |
| 8 | ×1.50 — knee |
| 14 | ×1.75 |
| 20 | ×2.00 — ceiling |

- Two slopes, briefable: a point buys ~+6%p up to the knee, ~+4%p past
  it.
- Ceiling = the full pool: ×2.0 costs everything — that turn nothing
  else happens. D8's "expensive, exceptional territory" realized
  structurally, and Myeongnyang-class defense (lever at ceiling) stays
  reachable as the scenario battery requires.
- Knee at 40% of pool: typical recommendation bands (8–15) straddle
  it, so pin placement inside a band is also a knee-side choice.
- Max-commit invariant tooth: the last 6 points buy only +0.25 lever —
  they must compete with surplus outlets every turn.
- Rejected: sharper knee at 6 points (the knee becomes a magnet —
  no-fixed-optimum risk); smooth exponential (mental math dies — a
  briefing officer must be able to state the price).

## M3 — Preset pin sits at the safe end of the recommended band (2026-07-03)

The commit slider prefills at the top of the D7 inverted-formula band —
the commit that holds even if the enemy is at the strong end of the
fog band. Rationale:

- The default must never betray: an average pin produces "I followed
  the recommendation and lost" whenever the enemy lands on the strong
  end — poison for loss legibility (ADR 0021).
- Shaving down from a safe default reads as a chosen, calculated risk —
  ADR 0021's framing of under-commitment, made literal on the slider.
- Scouting's payoff becomes visible in the pin itself: narrowing the
  band lowers the safe end ("scouted: recommended 15 → 11").
- Precedent: the v5 mockup notch already computes band-top ("안전 사수").

Design stance (user, 2026-07-03): defaults are safety-first and
short-term-result-first; skill is deviating from them for long-term
plans (scouting turns, striking weak realms, justifying casualties to
grow surplus). Honest flag: the *value* of justifying casualties to
grow surplus is not yet fully established — it is assembled by
surplus-outlet worth (this pass), the blood-economy coupling (Honest
Gaps, economy thread), and match-arc tempo pressure (routed there).
The safe pin's cost — systematic slight overpay — is deliberate: that
overpay is the price of not scouting.

## M4 — Casualty curve and the rout cliff (2026-07-03)

One shared curve of R (D11), both sides, success and failure alike:
winner loses `base ÷ R^e`, loser loses `base × R^e` of the engaged body.

- **Body = the full engaged stock, both sides.** Commitment is attention,
  never a troop count (D2) — there is no "send only part" control, so the
  army that stood on the field bleeds as a whole. This is also the
  grinding firewall: a low commit buys a bad R, and a bad R charges the
  whole stock — cheap poking is expensive in blood.
- **Exponent e = 1.4** — middle of the survey band (empirical Lanchester
  fit 1.3–1.5; the square law's ranged-fire assumption is not imported —
  1.4 is measured history, era-robust for our purposes; tech never bends
  the curve in the MVP, it enters via quality and tech-tier steps).
- **Base rate 12% each side at R = 1.** Targets: historical parity-battle
  range (10–20%); unit-language visibility (typical losses ≈ 1 부대);
  and it places the rout onset at R ≈ 1.92, so narrow wins (R 1.5–1.8)
  scatter-but-not-rout while decisive wins (R ≥ ~1.9) rout — the D4
  gradient lands exactly on the cliff. (At base 20% the cliff falls below
  the win threshold and every win converges to the same 65% massacre; at
  base 5% the cliff is unreachable and Encirclement's core event never
  fires.)
- **Rout cliff at 30% losses within the engagement, loser-only.** 30% =
  middle of the 20–40% "combat ineffective" band; flat for all forces in
  the MVP. Within-engagement only: battles are atomic, so there is no
  cross-battle accumulation — the next turn is a new engagement fought
  by the updated (smaller) stock. Rout conversion can strike only the headline loser — the
  winner's organization held by definition. Recorded interpretive
  half-step on D11: rout is an organizational outcome (stamp family),
  not a bleeding rate; blood numbers themselves stay headline-blind.
  This closes both the "successful defense self-deletes" incoherence and
  the deliberate-failure exploit (a failed high-threshold attack that
  shattered the defender would out-damage success — grinding's backdoor).
- **Rout conversion reads the escape state — never the margin, never the
  plan.** Escape OPEN → 50% of the remainder is lost (pursuit history:
  most casualties fall after the line breaks), the rest disperse per
  normal dissolution. Escape BLOCKED → 100%, and the annihilated force
  leaves no regeneration debt. Annihilation is bought with method and
  world state, never with the slider — protecting Encirclement's plan
  identity and the max-commit invariant.
- **Escape state is a derived check at the moment of rout — no new
  tracked variable.** Escape is OPEN iff at least one adjacent non-water
  friendly/neutral route exists AND the isolation gate is not satisfied;
  otherwise BLOCKED. Water never counts as an escape route (routed
  troops drown — Salsu, Fei River). All inputs are existing stamps
  (adjacent control, route cuts, water boundaries); the forecast card
  gains one line ("도주로: 열림/막힘"). Both sides contest the state
  with existing stamps: interdiction closes doors (Salsu), a stronghold
  hold deletes a specific door (Maloyaroslavets 1812), a crossing
  operation reopens one (Berezina).
- **Validation battery run (2026-07-03):** Salsu 4-turn chain (the blood
  is made by world state; the curve only prices the final click); Moscow
  1812 (83% loss with zero 100% events — standing rules + repeated
  open-door routs); Teutoburg (door closed by fieldworks + terrain in
  2 turns, no starvation needed); full-scale 5:1 Salsu (86% in 6 turns —
  the frontal annihilation click correctly fails at R ≈ 1.05; the kill
  must be assembled from refusal grammar + world teeth + 반도이격).
- **Honest gap (recorded):** Fei-River-class bloodless panic collapse
  (command rout at <5% casualties) is not representable — the cliff is
  blood-triggered; morale/panic systems are deferred.
- **Reserved seat — morale (both directions, ruled 2026-07-05):** the
  deferred morale system owns two mirror gaps: (a) panic collapse above
  — will breaking *before* organization (Fei River); (b) **결사항전**
  (last stand with escape OPEN) — will holding *after* organization
  breaks (Ansi, Jinju). Blocked-escape annihilation stands are already
  representable (escape state BLOCKED → no rout conversion, fight to
  100%); what is deferred is only the *voluntary* refusal to rout.
  Reopen triggers: sieges read samey in playtest, or players ask why
  garrisons never hold to the last man. Natural shape when opened: a
  third defense posture beside Stronghold/Delaying (accept annihilation
  to buy turns — pairs with 긴급 투입 relief timing). The 30% cliff
  itself is not touched.

## Candidate rule — 반도이격 (strike at half-crossing) → owned by the matchup-fraction stage

When an intercepted force is withdrawing or escaping across a water
boundary in the same turn, the water splits its engaged body: only a
fraction (가안 50% — the dial) is engageable, and the water side counts
as blocked escape for that engaged body. Grounding: Sunzi (行軍편)
"令半濟而擊之利"; Salsu, Berezina, Caesar's river interceptions. D9
family — a situation-classifying cap, never a multiplier. Detection
needs no new state: the target's declared water-crossing withdrawal
flow + an interception engagement in the same turn.

## Derived constraint for the standing-rules stage (starvation clock)

Starvation stages must outpace an unsupplied deep advance of ~2–3
sectors: a fresh mega-army that bypasses fortresses must reach
attack-incapable (stage 2 is an availability gate — siege/assault cards
vanish) before it can storm a capital-grade prize; otherwise mass alone
wins and the David-play (Salsu class) dies. Stage rates used in the
validation sheets were placeholders (-10%/turn; stage-3 effective ×0.5).

## M5 — World multiplier ladders; the ceiling is the natural product (2026-07-03)

Survey-validated (`research/terrain-fort-ladder-validation.md`, 24-battle
corpus: all ten values adopted as proposed, zero forced changes).

| Terrain (world-owned) | × | | Fortification (player-built) | × |
|---|---|---|---|---|
| Plains | 1.0 | | None | 1.0 |
| Forest / hills | 1.2 | | Field works (trench/palisade) | 1.3 |
| Mountains | 1.5 † | | Town walls | 1.8 |
| Pass / defile | 2.0 | | Fortress (mountain castle/citadel) | 2.4 |
| Legendary natural site (authored, rare) | 2.5 | | Legendary fortress (wonder-class build) | 3.0 |

† Mountains ×1.5 is interpolation (survey: no documented unfortified
mountain battle) — keep flagged for playtest attention.

- **No engine clamp.** Composition is the raw product; the ceiling is the
  natural product of the two ladders. Ownership split (user, 2026-07-03):
  terrain is nature's — the ×2.5 sites are authored map features;
  fortification is the player's — every tier including legendary ×3.0 is
  buildable, priced as a conviction investment (multiple primary turns +
  resources; build-rate dial → standing-rules/economy stage, tuned so
  wonder-class ≈ a third of a match). Opportunity cost is the only brake;
  the counters (erosion, starvation, bypass, tech steps) ignore the
  multiplier and keep every stack mortal — Constantinople fell to a tech
  step. Survey cap-audit support: after honest attribution no historical
  pure product exceeds ×4 for standard sites; legendary composites fit
  inside ×6 (Masada = exactly 6.0); nothing demands an engine cut.
  Standing condition (user): if any cap ever returns, a build-screen
  warning ("actual effect below intended") is mandatory.
- **Where-to-build teaching lives in the recommendation surface, not in
  caps**: the build/recovery card ranks sectors by marginal defense per
  invested point (ADR 0024 advisability-as-ranking), so "strong ground
  needs weak walls; build on the weak approaches" is felt through
  forecast numbers and remains defiable.
- **Prerequisite rule adopted — wall-assault frontage (D9 family).**
  Fortifications throttle the assaulting body: each fort tier carries an
  engageable-attacker cap (value owned by the frontage/matchup stage).
  Without this rule the ladder misfits half its own corpus (Haengju
  2,300 vs 30,000 = nine serialized waves; Ansi; Jinju I). Unification:
  `fortificationDamage` erosion both lowers the multiplier and widens
  the assault frontage — breaching the wall means both. Deliberate
  Pressure gains its second product. Removal paths per D9 obligation:
  breach (erosion), tech steps, escalade.
- **Prerequisite check — the supply clock**: half the fortress corpus
  was decided by starvation/time, never assault ratio. Already ours:
  Supply Interdiction + starvation standing rule + Deliberate Pressure
  erosion + authored self-supply traits for legendary holds. No new work.
- **Water grammar completed**: the crossing penalty is an attack-side
  term (`attack × 0.85 river / 0.70 strait`), never a defense multiplier
  — water weakens the attacker, it does not strengthen the defender.
  Survey refinement adopted: the river penalty deepens to ~0.70 when the
  defender holds the bank (uncontested 0.85 / opposed 0.70) — recorded
  as an ADR 0015 amendment. 반도이격 (M4 candidate) generalizes to any
  same-turn water-crossing flow (withdrawal, movement, reinforcement)
  caught by an interception engagement — playing it is a timing read in
  the uncertainty duel.
- Bonus validations banked: the ×2.0 lever ceiling is "Cannae-sized"
  (flips a 1.7:1 deficit, no more); Jinju I vs II (same fort, 30k fails
  / 90k max-commit succeeds) independently validates the commitment
  lever.

## M6 — Cross-model audit of the R→outcome conversion; Encirclement resolution (2026-07-03)

An external adversarial review (Codex, 16 findings) audited how R converts
to outcomes, taking thresholds 1.1/1.2/1.3/1.5/1.5/1.6/2.2 as input.
Verdicts and resolutions:

- **Threshold ordering: externally confirmed sound** (3:1 as gradient;
  1.5–2.0 assault band credible; Crossing at 1.5 correct — water already
  taxes the attack side, no double taxation).
- **"Encirclement redundant" (was CRITICAL): resolved.** The claim
  ignored the M5 wall-assault frontage rule (Swift-annihilation vs
  fortified pockets is mostly physically unreachable) and the exclusive
  escape-voiding verb. Encirclement is attacker-viable (Ulm/Sedan/Kiev —
  the defensive examples in M4 were sampling, not structure). Accepted
  convergence: an UNFORTIFIED sealed pocket stormed by any plan at
  R ≥ rout onset annihilates — historically correct; annihilation is
  sold by world state, never by the plan name.
- **Risk-premium audit (user principle: high risk must buy high success
  value): the premium only paid in the leaver branch — violation in the
  stander branch. Fixed by adopting 항복 수확 (surrender harvest, Ulm
  effect):** on Encirclement headline SUCCESS only, attacker casualties
  = curve value × surrender discount (가안 0.5; dial owned by the
  matchup-fraction stage, to be validated against Ulm 1805 ~60,000
  captured vs ~1,500 French; Sedan; Kiev). On failure: no discount.
  Grounding: a sealed, starving pocket collapses rather than fights —
  encirclement annihilations were disproportionately cheap at the moment
  of collapse; the cost was prepaid in the preparation turns. This gives
  Encirclement an exclusive success product in every branch: the lowest
  blood price per army erased, behind the highest bar (2.2, fully
  fog-exposed, all-or-nothing).
- **Encirclement's complete niche (recorded for the claim block):**
  read-proof kill (exclusive escape voiding vs refusal plans), starvation
  harvest (the gate + world teeth make R 2.2 reachable where assault
  frontage physically cannot), cheapest blood per erasure (항복 수확).
  Inheritance cost (anti-goal condition): annihilated men never disperse
  home — conquering a sector by annihilation permanently burns the
  latent manpower the occupier would otherwise inherit; "want the region
  alive → Swift, not this."
- **Toxic-band finding (1 < R < threshold favors the attacker's exchange
  despite headline failure): under adjudication** — the strategic
  containment argument (a deliberately-failed plan is always dominated
  by a succeeding plan at the same R: DP at 1.1 succeeds with stamps and
  the same favorable exchange) vs the narrative wart. Next item.
- Rebutted findings (recorded): cross-battle 30% accumulation does not
  exist (the cliff reads within-engagement losses; battles are atomic);
  headline-winner rout immunity is intended (Haengju/Ansi precedent —
  garrisons that repel at heavy cost hold).

## Authoring principle — off-label cost test + claim block (user, 2026-07-03)

Every plan must answer: "achieving my main thesis through another plan's
click costs more in which currency (required R / blood / time /
read-dependence / unwanted stamps)?" If no currency is dearer, the plan
is dominated — recut it. The answer must exist in both forms: logic
(formula terms) and a briefing-officer sentence.

**Claim block** (catalog schema extension, adopted): per plan, authored
핵심 이득 (what its click uniquely buys, in currency terms), 핵심 대가
(its unique costs), and 반목표 조건 (when this click is anti-goal) — in
glossary vocabulary plus one natural-language sentence. Read by fit
ranking and the forecast card (ADR 0024 advisability-as-ranking); closes
the "regret through ignorance" gap (the card must say what the model
already knows). **All 12 blocks authored 2026-07-05 (A-4 B3) in
`../operation-plan-catalog/CATALOG.md`** (per plan; off-label test
passed for all — none dominated); this doc owns the schema, the
catalog owns the content.

## M7 — Plan thresholds (2026-07-03)

Thresholds are scoring lines at resolution, never availability gates
(GLOSSARY). Ordering externally confirmed (M6 audit). No double
taxation: water and fortification difficulty are taxed by the penalty
and multiplier terms; thresholds price only the method's required
superiority.

| Plan | Threshold | Note |
|---|---|---|
| Deliberate Pressure | 1.1 | Erosion proceeds on slight superiority; depth via margin |
| Raid | 1.2 | Contest = field interception, no walls; caught raiders take the bad column |
| Supply Interdiction | 1.3 | Rear-route skirmish, low stakes |
| Swift Seizure | 1.5 | The doctrinal assault bar; 1.5–1.92 = thin take, ≥1.92 = shattering take |
| Crossing / Landing | 1.5 | Same bar as Swift — water already taxed attack-side (×0.70–0.85) |
| Flanking Breakthrough | 1.6 | Maneuver coordination premium. Boundary condition (M6 audit): the fortification discount fraction must be large enough that Flanking beats Swift vs fortified fronts, else lower to 1.4–1.5 — check at the matchup-fraction stage |
| Encirclement & Annihilation | 2.2 | Only threshold above rout onset (R≈1.92): success arithmetically implies rout, and isolation implies blocked escape — annihilation from the numbers. 항복 수확 discounts winner blood (M6) |

Defense plans carry no thresholds — the defensive headline is the mirror
(attack fell short); Delaying Defense's bargain is a resolution-layer
product priced at the matchup-fraction stage.

**Toxic band accepted (1 < R < threshold favors the stronger side's
exchange despite headline failure).** Dual historical validation: at
effective R < 1 the repulsed attacker takes the bad column (Haengju —
implied multiplier put the Japanese under parity, they bled worse); at
effective R > 1, "failure" means *not enough to take it*, not *thrown
back broken* — a garrison that keeps winning headlines while wearing
down is the Jinju II pattern. Rejected fixes (both re-litigate settled
decisions): headline-reading casualty columns (creates a blood cliff at
the threshold — violates D11) and threshold-normalized curves (scatters
rout onset per-plan — destroys Encirclement's above-cliff placement).

**Grinding-dominance invariant (adopted):** at any R, some *succeeding*
plan must dominate any deliberately-failing plan across all outputs.
Current bearer: Deliberate Pressure (threshold 1.1) delivers the same
curve exchange plus erosion stamps at any R where deliberate failure
tempts. Check whenever roster axis magnitudes are authored.

## M8 — Roster axis dials, surplus pricing, and audit fixes (2026-07-03)

Unit system (user-confirmed): `controlShift` and `garrisonDamage` carry
NO dials — control transfer is headline-bound (binary; capture opening
50/60% per ADR 0022) and blood belongs entirely to the casualty
curve/rout machinery (a separate magnitude would violate D11). Their
core/secondary shapes remain as identity metadata for fit ranking and
claim blocks. Plans carry NO attack-power multipliers — same army, same
power; method changes requirements (threshold), engagement rules
(verbs), and outputs (stamps). Method principle (user): **the attack
axis is the numeraire** — defense, information, and static investment
are priced by what they save or deny in attack currency (D6 same curve,
D7 inversion, D7 rider), needing no independent survey.

Economic audit (`research/dial-set-audit-2026-07-03.md`): max-commit
invariant HOLDS (three worked decisions scatter correctly; the
surplus-scout saturation rule is load-bearing), world clock fits (siege
3–4 turns; war sketch 16–22 turns; no repair stalemate — repairing
forfeits the defense lever), loot 50% safe (conquest beats raiding
~30:1 on holdable sectors; leashes structural), grinding dominance
verified. Three specification holes fixed below.

**fortificationDamage (multiplier points; erosion also widens assault
frontage per M5):**

| Holder | Dial |
|---|---|
| Deliberate Pressure (core) | −0.3 on success; −0.6 if margin ≥ +0.5. NOT wall-frontage-throttled (bombardment, not escalade) |
| Swift Seizure (secondary) | −0.1 on success |
| Stronghold Defense (build) | +0.1 per **attacked** turn only (audit fix — no free fort creep), cap ×1.3 field-works tier |
| Recovery (build core) | +0.05 per point (see repair menu below), cap at authored tier |

**routeDisruption (binary flips):** Supply Interdiction (core) flips one
targeted route on success; secondary holders (Flanking, Raid) flip only
on margin ≥ **+0.3** (audit fix: +0.5 left Flanking's clause dead);
self/friendly flips (Delaying/Scorch bridge-burning, Crossing's opening)
unconditional within their resolutions; repair via Recovery menu.

**usableValueDamage (%p of usable value; 30%p per-stamp cap on
permanent/base damage — Encirclement's annihilation machinery exempt):**

| Holder | Dial |
|---|---|
| Raid (core) | −15%p base → −30%p cap with commit/margin; **loot = 50% of destroyed value as income** (currency definition + cap-raid pricing exported to economy stage: ~1–2 turns of sector yield) |
| Deliberate Pressure (secondary) | −5%p per success, **usable layer (recoverable)** |
| Supply Interdiction (secondary) | no stamp — starvation standing rule reads the cut state (stage-5 owned) |
| Scorched Earth (core, self) | economy base −30%p (permanent, at cap) + population usable −50%p (flees; base intact, returns on recapture); **commit-scaled: low commit halves both** |
| Recovery (core) | +10pp on top of the standing +10pp (via menu) |

**confidenceGain (points; ceiling 0.90):** Reconnaissance primary +0.30
(commit-scaled ±0.10) plus targeting/evidence depth; battle-contact
byproduct +0.10; repelled-assault defense +0.15. **Surplus scouting: 2
points buy +0.10 per sector, saturating** (더 부어도 그 턴은 그만) —
watching vs probing: scattered attention maintains the watch, only a
dedicated operation probes. Saturation is load-bearing for the
max-commit invariant.

**Audit fix — confidence→band conversion (adopted dial):** estimate band
half-width = 40% × (1 − confidence). c 0.4 → ±24%, 0.7 → ±12%, ceiling
0.9 → ±4% (never zero — irreducible risk, D1). Scouting economics under
this dial: primary recon refunds ~3 commit points of safe-pin overpay;
scouting turns beat attack turns exactly in situational cases (no fixed
optimum) — validated.

**Audit fix — Raid interception is defender-triggered (closes the
raid-as-annihilation exploit, CRITICAL):** an unattended/huddled
garrison never marches into a raid — no engagement occurs; the burn
stamps apply uncontested (blood 0). The field-interception battle
(garrison × terrain, no walls) happens only when the defender commits a
sortie (primary defense or reserve). A garrison that sorties into a
monster raid chose its battle — chevauchée history. This also restores
grinding-dominance for the raid row.

**Audit fix — Recovery per-point repair menu (closes the bundling hole,
MAJOR):** one Recovery primary buys from a menu at per-point prices —
fortification +0.05/pt, route flip = 8 pts, usable +10pp = 4 pts
(garrison reinforcement pricing joins the regeneration dials, stage 5);
preset triages worst-first, fine adjustment exposes map-taught nouns
only. Commit 8 ≈ one route OR +0.4 fort — the ADR 0026 1:1 action trade
made numeric; interdiction stays alive.

**Exports to later stages:** confidence decay boundary 0.05 ≤ d < 0.10,
candidate shape d = 0.20 × (c − 0.30) (equilibrium 0.80 under one
surplus scout); garrison regeneration rates; raid-income economy
pricing; mid-war surplus absorption watch item.

## M9 — Defensive reserve: 긴급 투입 (진관 grammar) (2026-07-03)

**Premise (settled through discussion):** points never persist; their
*effects on world stocks* always do (the wallet/ledger split, applied).
Commitment does exactly two things to substance: **activation** (lever —
how well troops present fight; expires with the turn) and **movement
orders** (reinforcement flows — bodies move along routes and *stay*,
D3). Points never become bodies; they order and awaken them.

**The reserve** is a third surplus outlet — points bound before sealing
(blind: its size is itself a threat-reading bet; the *setting* may
persist as a standing order, the *points* are per-turn, unused points
evaporate). Trigger: an own sector is attacked without a primary
defense. Effect:

1. **Emergency movement**: route-connected stock within the same
   province rushes to the attacked sector. Moved units fight this turn
   at **50% effectiveness (CONFIRMED 2026-07-05 — forced-march
   exhaustion; member of the 0.5-under-duress family with 반도이격's
   engaged fraction and delaying's exchange)** and **remain garrisoned
   afterward** — not single-use. **Movement schedule (ruled
   2026-07-05): 1 reserve point awakens 12.5% of the province's
   route-connected stock; 8 points (the knee) = the whole province
   answers.** Relative grammar by design — points buy an awakening
   *fraction* of what insurance geography placed there, never absolute
   bodies (an absolute per-point volume was considered and rejected as
   off-idiom for the attention doctrine). Integer ledger rounds down.
   With the emergency lever also knee-capped, the reserve bet space
   closes naturally at 0–8 points. Owed: S6 re-run on this schedule at
   the next battery run. Timing grammar (clarified 2026-07-05): the
   *decision* is made before sealing (binding surplus points = the
   threat-reading bet), the *firing* is automatic after sealing —
   pre-purchased reaction is the only reaction a simultaneous-seal
   turn structure allows; the reserve covers what the 20-point hand
   could not cover with primary defenses. The stripped neighbors are
   thinner: feint plays (attack A to drain the province's reserve
   reach, then strike B) emerge from the rules.
2. **Emergency lever**, capped at the knee (**×1.5**) — the ceiling
   requires a dedicated primary (Myeongnyang requires showing up).
   Conversion 1:1 (the cap is the discount; the insurance premium — 
   evaporation when unattacked — is the price).

Allocation: preset triage — worst threat first, fill to the band
bottom, skip sectors unsavable within the cap (flagged as cede
candidates); "make-them-pay" filling is a fine-adjustment candidate
only. No plan products (no bargains, no build stamps, no
repelled-assault confidence bonus): primary defense = plan + ceiling;
reserve = lever + bodies, knee-capped.

**Scale split (physical, not arbitrary):** province-local = what can
physically arrive within the turn = reserve's territory; empire-scale
redeployment = multi-turn flows whose initiation is primary-action
work (ADR 0026 grammar — state-scale changes are actions). Historical
frame: 진관체제 (provincial garrisons answer local incursions);
its collapse into centralized draw (제승방략) failing in 1592 is the
historical proof of the layer split. **Range CONFIRMED 2026-07-05:
same province ∧ route-connected.** A route-distance variant (a nearer
sector across the province border may respond) was weighed as more
realistic (beacon-fire coordination between neighboring garrisons) but
rejected on game grounds: it invents an N-steps dial, and the province
boundary keeps the reserve pool legible at map scale for both sides —
enabling province-scale scouting reads and the hollow-province
conquest-value estimate ("most of that province's stock is standing in
front of me, so a bloody win here leaves little worth taking").

**Consequences banked:** peacetime troop distribution across provinces
becomes insurance geography (frozen decisions price the liquid
reserve's purchasing power — the commitment-horizon lens again);
`routeDisruption` gains a second tooth (a cut route removes that
neighbor's stock from emergency reach — interdiction now suppresses
reserves, not only supply); reserve is also the sortie funding source
for raid interception (M8). Realizes the M1 multi-command thread's
evolution path in the defensive direction only.

**Open dials → scenario battery:** forced-march effectiveness (가안
50%); points→units-moved ratio (how many 부대 a reserve point can
order); whether reserve range is strictly province-bounded or
route-distance-bounded. Related standing-rule candidate under external
survey: mobilization visibility (concentration leaks intent
proportional to scale) — verdict pending
`research/first-strike-and-mobilization-visibility.md`.

## M10 — Matchup fractions; mobilization visibility; the surprise economy (2026-07-03)

**Matchup fractions (user-confirmed set):**

| Device | Value |
|---|---|
| Flanking `discount fortification` | effective fort = 1 + (fort − 1) × 0.5; wall-assault frontage NOT applied (seam entry is not escalade). Boundary check passed: cracks a garrison-1,000 fortress front (R 2.2) where Swift is throttled to R 1.04 — Flanking's 1.6 threshold stands (M7 footnote resolved) |
| Flanking `discount escape` | escape clause × 0.5 wherever it appears: refuse-escape 100% → 50% slips; open-rout survival 50% → 25% (loss 75%) |
| 반도이격 | engaged body = 50% of the crossing force |
| 항복 수확 | Encirclement-success winner casualties × 0.5 |
| Delaying bargain (refuse-cell authored terms) | attacker threshold **+0.3** vs a delaying defender; casualty exchange **× 0.5 both ways** (shallow contact — arithmetically removes decisive repulsion AND attacker rout); defender escape default 100% (escape-hunting prey). The +0.3 shield is why low commits reach "not taken this turn" — the covered-call payoff table in numbers |

**Mobilization visibility (standing rule, adopted; survey-validated —
`research/first-strike-and-mobilization-visibility.md`):** border-sector
tension signal — continuous hidden core, THREE displayed bands with
hysteresis (band *changes* are the event); lead 1–3 turns scaling with
concentration size; content = magnitude band + sector only. Raid-scale
stays sub-threshold. Feint concentrations pay upkeep. Defender readiness
scales continuously with time-under-warning (never stepwise — anti-
sniping). Historical ground: invasion-scale concentration was visible in
essentially every case (Barbarossa ~87 warnings; 1592 open staging);
warning failures were decision failures; surprise at scale was bought
with active deception (FORTITUDE) — in our grammar: the signal is free,
believing it is judgment, and beating it costs deception skill. Rates →
stage 5; display → fog-thread alignment. **Paired: the intent-scouting
layer** — the tension signal is the free coarse channel; primary
Reconnaissance refines it (composition, timing, target candidates);
surplus scouting never reads intent ("잉여는 유지하고 주 행동만
꿰뚫는다", information edition).

**The surprise economy, mapped per attack plan** (기습's meaning, price,
and opportunity cost in formula terms — feeds the claim blocks):

| Plan | What surprise buys | Its price / cost |
|---|---|---|
| Swift Seizure | The most: enemy at lever ×1.0, no reserve bound → inflated R | The paradox: its mass rings the bell. Paths: attack from standing border forces (signal reads concentration *changes*), deception, or race the 1–3 turn lead |
| Deliberate Pressure | ≈ nothing — sieges are slow by thesis; defender responds anyway | Pays no deception tax; concentrates freely |
| Flanking Breakthrough | Positional, not temporal: the visible concentration itself becomes the feint — defender readiness flows toward the signal sector, the strike enters the adjacent seam (Manstein pattern). Emergent from sector-granular tension + M9 neighbor-stripping, zero new machinery | Requires read of the defender's response (scouting the drained sectors — estimate bands drop where reserves left) |
| Raid | Free — sub-threshold by design; the sneak specialist | Cannot scale without becoming visible |
| Supply Interdiction | Moderate — an unseen cut wastes the enemy's turn | Small force, low band anyway |
| Encirclement | Inherited from the chain, never the click — the gate is built in plain sight; the surprise happened earlier (the lure disguised as retreat — Salsu) | None at click time |
| Crossing / Landing | The deception-heaviest (FORTITUDE class): surprise = WHERE, not whether — unopposed bank (×0.85, defender ×1.0) vs read bank (×0.70, committed defense). The penalty differential IS the surprise payoff, already in the numbers | Multiple crossing sectors force the defender to spread or guess |

Emergent play named (user): **양동 후속타** — strike A to ring the bell
and drain the province's reserve reach toward it, then hit the thinned
B. Fully emergent from tension granularity + reserve triage +
observable post-hoc troop movement; the skill gate is the attacker's
scouting.

## M11 — Frontage capacities (2026-07-03)

Engaged-attacker-body caps (D9: classify, never multiply; removal paths
mandatory). Values 가안, Myeongnyang confluence check reserved for the
scenario battery.

**Terrain chokes:**

| Archetype | Cap | Removal paths (authored obligation) |
|---|---|---|
| Open border | none | — |
| Forest trail | 1,500 (15 부대) | bypass via adjacent open ground; road building (economy) |
| Pass / defile | 1,000 | side-path sector bypass (the Anopaea rule) |
| River crossing point | 1,000 (+ crossing penalty separately) | another crossing point; Crossing plan's bridging |
| Strait | 500 (5 부대) | port staging +500; naval control (deferred navy) |
| Legendary choke (authored) | 300–500 | authoring must name its removal path |

**Wall-assault caps by fortification tier** (applies to escalade-family
assaults only — Deliberate Pressure and Flanking exempt, M8/M10):

| Tier | Assault cap | Erosion link |
|---|---|---|
| Field works | 3,000 | each −0.3 fortification erosion widens the cap +500 ("the breach widens" — M5 unification quantified) |
| Town walls | 2,000 | 〃 |
| Fortress | 1,500 | 〃 |
| Legendary fortress | 1,000 | 〃 |

**M10 rider — the attacker-side surprise surface (low-micromanagement
check):** no new controls. (1) My emitted tension signal is derived from
my own known deployments — the UI shows "how I look from outside" as a
pure derivation; what remains unknowable is the defender's *response*
(their fog — scouting's territory). (2) Readiness uncertainty is
absorbed by the existing conditional forecast branch family ("if they
reinforced: R 1.3 / if not: R 2.1"), weighted by my band × turns under
warning. (3) Cross-sector "attack B instead" advisability belongs to
situation judgment's opportunity ranking (ADR 0019); within-sector
approach choice is plan availability + fit ranking. Display details →
command-card IA session.

## M12 (CONFIRMED 2026-07-04) — World-pulse rates (2026-07-03)

> **AMENDED 2026-07-07 (match-tilting pass, match-arc RULINGS MT-①,
> P1 dual billing).** Garrison regeneration is **no longer free**: the
> +10%/turn rate stands, but the regenerated bodies are now drawn from
> the 징집 명부 (register) and paid at the recruit price — every heal
> ages the world. This amends item 1 below and ADR 0014 (garrison
> auto-regen). *ADR 0014 header stamp owed — see `docs/SYNC-DEBT.md`.*
>
> **AMENDED 2026-07-08 (recovery-dial grill, match-arc RULINGS MT-⑤ /
> ADR 0027).** Garrison regeneration is **no longer automatic**: the
> +10%/turn is the amount purchased per COMMITTED action (bottom 0, no
> passive floor), throttled by attention scarcity — a realm at war cannot
> re-man its shields. L2-validated (+3pp decided) but MINOR; the freeze is
> not a healing problem (MT-⑤). Item 1's "per turn" now means "per
> committed regen action," not an unconditional pulse.


Confirmation gate (full-match tempo sheet) met by battery sheets 7–8:
war settles in 11 turns, match in 23 (35–46 min); the tempo unease was
resolved by the match-arc thread (decision point + settlement), as the
disposition below predicted. Values below stand as sealed.

Proposed set, each chained to its derived boundary:

1. Garrison regeneration: +10% of sustainable cap per turn (≈ +1 부대);
   shattered garrisons stay thin ~5+ turns (the D3 counterattack window).
2. Starvation clock: stage 1 (buffer) turns 1–2; stage 2 attack-incapable
   from turn 3 (availability gate + −10%/turn); stage 3 defenseless from
   turn 5 (effective ×0.5, walls unmanned → fort ×1.0, −10%/turn).
   Satisfies "clock bites at 2 sectors of unsupplied advance" (M4).
3. Confidence decay: d = 0.20 × (c − 0.30) per turn, floor 0.30;
   equilibrium 0.80 under one surplus scout (audit F14).
4. Ambient attrition: NONE — quiet fronts are truly quiet; all attrition
   is authored (closes the parked dial).
5. Usable recovery: standing +10pp/turn (unchanged) + Recovery menu.
6. Mobilization visibility values: band thresholds 2,000+/4,000+ at a
   border sector (raids ≤1,000 forever sub-threshold); lead time emerges
   from flow speed (no separate timer); hysteresis 2 turns.
7. Baseline-hold envelope (derived statement): unattended defense
   auto-absorbs R < threshold — an invested fortress sector self-repels
   ~4,300 attack power (D7 quantified).

**HELD OPEN by the user's tempo concern (2026-07-03):** the global game
tempo — "a 25-turn match where a major operation costs ~6 turns" — is
not yet felt/validated. Structural answer recorded: war cost is
non-uniform (shield-break then cascade; ordinary sectors are 1-turn
takes; wars settle by field-army destruction in ~8–12 turns, not by
uniform sector grinding), and annexation-by-occupation was never the
victory grammar — settlement/capitulation belongs to the undesigned
match-arc thread (SPEC: matches end at decision points). Disposition:
confirm M12 only after the scenario battery runs a full-match tempo
sheet; escalate the match-arc thread — the tempo unease is correctly
locating that hole, not these values.

## M13 — Economy→mass conversion, MVP single track (2026-07-04, match-arc pass)

> **AMENDED 2026-07-07 (match-tilting pass, match-arc RULINGS MT-①…④).**
> The flat "+10%/turn at 0.5 yield" recruit is now the **Band-1 base**
> of the Surge Draft Model; the manpower pool is re-founded as the
> land-derived 징집 명부 (registerPerPop 1,800; total-bodies
> accounting); garrison regen now bills the register (P1). Deltas are
> stamped inline below; the Confirmed-values block flags what is
> superseded. Curve knees/multipliers + surge rate are deferred to the
> magnitude session (SYNC-DEBT). Start-state coordinates added as
> **M13a**.

Adopted during the match-arc pass (see `docs/features/match-arc/`):

- **모병 (recruitment)**: one primary action drawing bodies from the
  register into serving toward the cap, paid from treasury yield,
  fighting at 100%. **Priced by the Surge Draft Model (MT-③), not a
  flat rate**: unit price = a continuous piecewise-linear marginal
  curve over 동원 강도 (serving ÷ current register), a draft's bill =
  the area under the curve pre→post intensity; the draft may be
  **surged** with surplus commit points (+1%p/point 가안, one-shot).
  The old flat "+10% of cap/turn at 부대=0.5 yield" is the **Band-1
  base** of that curve. A discounted levy tier was rejected (reopens
  quality=1); 공세 동원 (ADR 0009 role 3) stays a reserved seat.
  Curve knees anchor to M13a coordinates; multipliers → magnitude
  session. Rider: M14 flat blood-EV check owed (band escalation bends
  it at depth).
- **국가 상한 (national sustainable cap)**: economy-derived ceiling on
  standing forces; the cap replaces per-turn upkeep bookkeeping
  (low-micromanagement). Garrison ceilings stay local (ADR 0014).
  **Cap growth SEALED as structure (2026-07-05, ruling ⑮, battery
  sheet 12): conquest/development raises the national cap** — the
  sheet-9 "raising the cap itself = economy development" reservation
  coming due. Grounds: the L2 tournament showed a static-cap world
  cannot close (96% of matches never trip the hegemony check —
  leadership is arithmetically unreachable against any healthy
  same-size peer while blood falls on the pool, not the cap), whereas
  a cap-coupled probe world produced endings AND archetype
  differentiation. Cap growth is the match's ending mechanism, not
  pricing detail. All numbers (cap per sector, development pricing,
  center scaling) belong to A-3; the probe's +400/sector is harness
  가안, not a sealed value. A-3 verification target: re-run the
  sheet-12 sweep at the priced values.
- **징집 명부 (conscription register · 구칭 인력 풀)**: **re-founded
  land-derived (MT-②, 2026-07-07)** — 명부 = **registerPerPop 1,800**
  × Σ populationValue, per province, at match start; thereafter a pure
  total-bodies stock (deaths −, land transfer ±, development +). The
  starting army is already drawn from it; recruitment moves bodies
  civilian→serving (register unchanged); only death shrinks it. The
  register:cap ratio is **3.0**, so **capPerPop 600 is the derived
  constant — sustain fraction ⅓** (a third of the register may serve
  at once). Anchors: two-track research (`../match-arc/research/`,
  historical 2.5–4.0 + game-convention 2.5–3×). Rider: L2 re-verify
  after tilting devices land.
- **Confirmed values (2026-07-04, battery sheet 9; register line
  SUPERSEDED 2026-07-07 MT-②)**: national cap 6,000 for a mid realm
  (center ~9,000; scales with economy); price 1 부대 = 0.5 sector-turn
  yield. ~~recruitment +10% of cap per turn~~ → Band-1 base of the
  Surge Draft Model (MT-③). ~~pool = 1.5 × initial military~~ →
  **register = 1,800 × Σ populationValue** (MT-②). Validated: buildup
  2–3 turns (**re-read as SURGED buildup under f₀ 0.5; sheet-7
  revalidation owed, MT-④**) / shattered recovery 5–8; one lost war
  ends a realm's ability to field a second full army (register travels
  with territory — settlement value includes population automatically).

## M13a — Start-state coordinates (2026-07-07, match-tilting pass, MT-④)

Research-anchored (`../match-arc/research/garrison-field-ratio-and-
armed-peace.md`); the sustain fraction ⅓ (M13/MT-②) is the only fixed
formula, the rest pinned from history:

- **f₀ = 0.5** — armed-peace field fill (field starts at 50% of cap;
  bracket [0.4–0.6], Louis XIV / Dutch). Plain buildup 5 turns, surged
  2–3. **Rider: sheet-7 tempo revalidation owed** (was calibrated at
  f₀ 0.7).
- **g₀ = 1.0** — garrisons start at cap (cross-era: peace draw-down
  falls on the field army; the fortress shield stays manned).
- **ρ = 0.75** — war-footing garrison:field ratio (Vauban band pin;
  per-seat spread 0.58–0.96 by border exposure).
- Derived: **start intensity ≈ 42%, structural max ≈ 58%** (the
  Surge Draft Model knees, MT-③). Harness carrier: BOARD_GAAN in
  `mockup/combat-calc/map-board.js` (startFieldFrac 0.5,
  garrisonPerBorderSector 900, capitalGarrison 1500, registerPerPop
  1800). First L2 data: sealed physique deepens the freeze (decided
  21%→7%, Vauban indecisive-war signature) — the tilting devices'
  target, not a reason to unseal.

## M14 — Thin economy (2026-07-05, A-3 session; rulings ⑱–㉑)

The minimum economy that makes M13 prices and 정산 codable. Governed by
the Tier-0 design principle **land-derived state** (DOMAIN_MAP): income
and cap are derived from held sectors every turn, never stored. The
only new stored state is the treasury. All values playtest-provisional
under the A-3 epistemic rider (battery NOTES: economy feel is an L3
question; keep re-running L2 as values move).

- **Unit — yield (생산), the 기본 생산량**: one ordinary sector at full
  usable produces 생산 1 per turn. The common measure of cost and asset
  across the whole game (1 부대 = 생산 0.5 [M13]; raid loot ≈ 생산 1.5
  [M8]; fort prices below). Term definition: DOMAIN_MAP (Tier 0).
- **Income** = Σ sector economyValue × usableEconomy (생산/turn).
  Authored anchors: ordinary sector econ 1.0; center-seat rich sector
  1.5 (가안, B authoring).
- **Force limit** (구칭 national cap — renamed 2026-07-10 terminology
  audit, genre-standard; ruling ⑱): cap = **capPerPop 600** × Σ sector
  populationValue × usablePop — one fully-usable ordinary sector
  sustains 600 men. Re-derives the sealed M13 anchors as derived
  values: mid realm (template: 10 ordinary sectors) = 6,000 ✓; center
  (template: 12 rich sectors, econ 1.5 / pop 1.25) = 9,000 ✓.
  Templates are authoring guidance, not rules. Consequences free of
  extra rules: conquest raises cap at a usable discount (fresh capture
  50/60%), raids shrink the victim's cap (the raid-attrition end-game
  lever), and ruling ⑮ (cap growth = match closure) becomes mechanical.
  L2-validated: sheet-12 re-run at derived caps closes 27% of matches
  with archetype spread intact (ruling ⑮ re-run duty paid at candidate
  values; re-run again if these numbers move).
- **Treasury** (ruling ㉑): realm-level stock of unspent income; start
  생산 5 (가안, playtest owns). 배상 (indemnity) lands here as cash and
  is spent through normal prices — no special conversion rule (pays
  sheet-12 spec gap #6).
- **Fortification build prices** (ruling ⑲): fieldworks 생산 2 +
  1 primary / walls 6 + 2 / fortress 12 + 4 / legendary 30 + 8
  (≈ ⅓ match — satisfies the M5 wonder rider). At these prices the
  blood-EV of defense spending is FLAT (~27–30 men of extra attacker
  blood per 생산 across recruit/fieldworks/walls/fortress — emergent
  from the M4 curve, not engineered): no package dominates on blood;
  the choice is priced in the other currencies (men are mobile but die
  once and eat cap headroom; forts persist and deny ground but cost
  primaries and are position-locked). This pays the A-1
  fortification-vs-recruitment verification target and STRATEGY-SPACE
  guarantee #5 (build spends tempo, the scarcest early currency).
- **Development** (ruling ⑳): 1 primary + 생산 4 → one sector
  permanently +0.5 economy / +0.5 population (= cap +300, income
  +0.5/turn), **once per sector**. 8-turn payback = early-window
  investment (timing stays a live question); the slow archetypes'
  non-conquest cap path. Repeatable development steps = Phase 2
  reserved seat (needs a diminishing ladder).
- Prototype mirror: `mockup/combat-calc/econ.js` + battery sheet 13
  (`node mockup/combat-calc/battery.js economy`); verdicts in its
  NOTES.md §sheet 13.

## Deferred comparison threads (recorded 2026-07-03)

The "1 primary action + surplus" turn structure was chosen for the MVP;
these alternatives are recorded with explicit reopen triggers so the
choice stays a decision, not an accident of calcification.

- **Multi-command turns** (e.g., splitting the pool 7/7/6 across
  several operations, no primary/surplus distinction). Trigger:
  playtest signal that two-front play feels fake or turns feel thin.
  *Identity tension (recorded 2026-07-03, upgrade from cost argument):*
  the fun thesis is one judgment per turn — the uncertainty duel is one
  poker hand; N commands dilute the read reward and the miss pain by
  N, and raise micromanagement against the High Complexity / Low
  Micromanagement pillar. Reopening must defeat the identity argument,
  not just the cost argument. Evolution path if reopened: surplus
  outlets are already proto-minor-commands; a lever-capped minor
  operation could be added as an expensive surplus outlet without a
  structural rewrite.
- **Specialized capacity pools** (military command / administration /
  scholarship as separate wallets). Trigger: governance or technology
  system design begins — today those wallets would have no spenders
  (the same gear test as unit simulation; `js/domain-data.js`
  `capacityWeights` is a pre-existing trace of the idea, a wallet built
  before its systems). Cost to weigh at reopening: separate wallets
  kill the cross-domain "fight vs grow" tension that the single pool
  deliberately creates.
- **Envelope-coupled dials** (world-pulse rates: regeneration,
  starvation stages, recovery) carry a standing tag: retune on any
  turn-structure change. Resolution-layer dials (curves, thresholds,
  multiplier values, matchup fractions) are turn-structure-agnostic.
