# Combat-Balancing Formula — Working Decisions

The resolution computation is one function used twice: run on fogged,
estimated inputs it produces the forecast band; run on true state at end of
turn it produces the verdict. Keeping forecast and verdict the same
computation is a standing constraint on every decision below.

## D1 — Deterministic core; uncertainty is information only (2026-07-02)

Same inputs always produce the same outcome. There is no random roll at
resolution. All experienced uncertainty comes from information asymmetry:
the fogged estimate band (confidence-capped at 0.90) and the opponent's
unrevealed plan — the two fogs of ADR 0025.

Rationale:

- Poker, not dice. The pressure engine rewards reading (ADR 0025); a die at
  resolution dilutes the payoff of a good read.
- Loss legibility (ADR 0021): a deterministic verdict is always traceable —
  "I bet on the low end of the estimate band and the truth was high." Dice
  end the post-mortem at "bad luck."
- The confidence ceiling already guarantees irreducible residual risk in
  every engagement; dice are not needed to keep engagements gambles.

Riders (user, same day):

- Trigger-based probabilistic events (e.g., unrest erupting when public
  sentiment is very low) may be added later. They are event-layer scope,
  outside the resolution formula, and do not weaken D1.
- Determinism must not become repetitiveness. The state space must stay
  rich enough — plan × commitment × fog state × AI tendency × spawn variety
  — that effectively identical situations do not recur. This is a standing
  design mandate on this pass, checked whenever a decision here simplifies
  the input space.

## D2 — Action capacity is command attention, independent of realm scale (2026-07-03)

Action capacity is *not* a stock of troops or resources and never converts
into one. It is per-turn command attention: a great empire and a small realm
hold the same pool, and what differs is the scale and the risk that each
committed point sets in motion. (User's framing: a fed and a starved LoL
player spend the same minute on a side push — the time allocation is equal,
the impact on the game is not.)

Formula consequence: committed capacity enters the resolution as a *lever* on
world stocks — how much of the available force is activated and how well it
is directed — never as fighting substance of its own. Fighting substance
(troops), and therefore casualties, live in persistent world stocks; the
per-turn pool refills regardless of yesterday's blood (the wallet/ledger
split: capacity is the refilling wallet, losses are written to a
non-refilling ledger). Where that ledger lives is the next decision.

## D3 — Troop ledger lives at the front sector; other tiers are views and flows (2026-07-03)

The four force tiers the design must show (empire / province / sector / hex)
are not four independent ledgers. One tier holds truth:

- **Front sector = the ledger.** Casualties are written here (defender:
  `localGarrison`; attacker: the launching sector's military stock). This is
  also the command unit, the ownership unit, and the forecast unit — blood
  gets an *address*, so a costly win visibly weakens that front for the
  turns regeneration takes, inviting counterattack (narrative-from-rules).
- **Province and empire totals = read-only aggregates**, the same derivation
  pattern as ADR 0023's control summaries. They feed situation judgment and
  national-strength reading; future mobilization systems read the empire
  aggregate.
- **Hex = derived deployment at resolution time.** When a battle resolves,
  the preset expands the sector's stock over the sector's terrain
  (statistical-average placement: passes weighted, crossings screened), the
  computation applies hex terrain multipliers (hex remains the calculation
  minimum, ADR 0022), and the deployment is discarded. No hex-level troop
  state persists between turns.
- **Tier interaction is flows, not synchronized books**: reinforcement moves
  stock sector-to-sector along routes (making `routeDisruption` also a
  reinforcement cut, not only starvation), and regeneration/mobilization
  converts population/economy into stock (existing standing rules).

Rejected for MVP: persistent per-hex troop ledgers. The player reads
sector-level estimate bands; outcomes hinging on invisible hex distributions
would make a deterministic verdict feel like dice — unreadable complexity is
noise, not depth (D1 rider). Revisit trigger (ADR 0016 pattern): if
playtests show sector-granularity resolution reads as flat, open persistent
hex deployment then.

### D3a — Deployment adjustment: designed, sealed for MVP (2026-07-03)

No player control over the derived hex deployment in the MVP. The skill
ladder already has six unvalidated rungs (where to look, scouting economy,
plan choice, commitment sizing, surplus redirection, deliberate sacrifice),
and plan choice *already is* a deployment intent — Stronghold Defense masses
on the fortress, Delaying Defense spreads thin and trades ground, Flanking
weights the approach. A deployment button would overlap the plan's role;
overlapping controls read as confusion, not depth.

If playtests show plan + commitment alone makes battles feel flat, the
pre-designed shape to open is: an **emphasis dial, never free placement** —
a few intent buttons whose options are generated from the sector's terrain
("pass-first / balanced / crossing-first", with consequence language:
"pass-first: frontal defense up, flank exposure up"). Options only use nouns
the map already teaches (fine-adjustment principle, catalog RESEARCH); a
sector without a river never shows "crossing-first". Free hex placement
stays rejected outright — it moves the tested skill from judgment to hands.

## D4 — Outcome shape: threshold headline, graded margin (2026-07-03)

A resolution produces a **binary headline** — did the plan's core intent
land (sector taken / attack repulsed) — plus a **graded margin**: how far
past the threshold the winner cleared it. The margin scales the cost and
depth of the win: a narrow win is Pyrrhic (heavy casualties both sides), an
overwhelming win stamps deeper and bleeds less. On a failed threshold the
core-axis stamp is void (the attack is repulsed) but costs are still paid —
failed attacks must not freely erode the defender, or cheap repeat attacks
become a grinding exploit; attrition-through-assault is Deliberate
Pressure's *authored* identity, not a formula freebie.

This kills the old implicit optimum "minimum-margin wins are always best"
(a relic of the binary model): margin now buys blood. Skill is not
"always commit less" but "read the right size for this battle" — commit
tight and pay in casualties, or overwhelm and pay in surplus foregone.
User's framing: beating 10 with 100 spills almost no blood; beating 10
with 11 is a bloodbath for both.

Confirmed riders from the same discussion:

- **Subjugation ≠ victory** is already modeled: captured sectors open at
  50%/60% usable value (ADR 0022); deeper subjugation (sentiment,
  governance, legitimacy) stays deferred governance scope.
- **Technology enters as a quality slot**: power = quantity × quality, with
  quality fixed at 1 for the MVP. A later technology system plugs into the
  slot; no tech module is built now.
- **Positioning check**: all added depth lands in the *outcome*, not the
  control surface — input stays plan + one slider; the forecast card gains
  an expected-losses line. Complexity budget spent on consequence depth,
  input surface frozen (High Complexity, Low Micromanagement).

## D5 — The scale is a ratio, not a difference (2026-07-03)

Attack power and defense power compare as a ratio R = attack ÷ defense.

- Scale-invariant: 2:1 means the same odds and the same casualty curve in an
  early skirmish and a late-war clash (same spirit as D2).
- War intuition is already ratio-language ("attackers need 3:1"); terrain
  and fortification sit naturally as defensive multipliers.
- Forecast compatibility: a fogged defender band (800–1,200) passes through
  the same computation to become a ratio band (1.5×–2.2×) — forecast =
  verdict on banded inputs, unchanged.
- The casualty curve falls out of R directly: nonlinearly fewer attacker
  losses as R grows, mutual bloodbath near parity.

Skeleton (all numbers belong to the magnitude pass; shape only):

```
attack  = launching-sector troop stock × commitment lever × quality(MVP=1)
          × plan/matchup modifiers
defense = (terrain × fortification) multiplier family
          ∘ (localGarrison + defenseCommitment) substance family
R = attack ÷ defense
  R ≥ plan threshold → headline success, axes stamp
  margin (R − threshold) → attacker casualties ↓, stamp depth ↑
  R < threshold → repulsed; costs paid, core-axis stamp void
```

How the four defense layers actually compose (whether the
multiplier/substance split above is right) is the next branch.

## D6 — One grammar for both sides; defense composes as substance × lever × multipliers (2026-07-03)

```
defense = localGarrison(substance) × defenseCommitment(lever, baseline 1)
          × terrain(invariant multiplier) × fortification(damageable multiplier)
attack  = troop stock(substance) × commitment(lever) × quality(MVP=1)
          × plan/matchup modifiers
```

Both sides speak the same grammar — substance × attention lever ×
multipliers — extending D2 consistently: the defender's commitment also
*directs* troops rather than adding them. One formula shape means one
forecast, one implementation, one mental model.

Layer characters: terrain never degrades; fortification is the multiplier
`fortificationDamage` stamps reduce (siege literally erodes this number);
garrison is the substance casualties come out of (D3 ledger); the defense
lever has **baseline 1** — an unattended garrison still fights at its own
strength under standing orders and local initiative, and commitment layers
court attention on top. This preserves ADR 0021's triad: commit enough /
commit tight / commit zero and cede — zero commitment means "left to fight
on its own," not "garrison evaporates."

Real-war grounding (every factor must name something real — anti-gamey
mandate):

| Factor | Real-war identity |
|---|---|
| Substance | Actual bodies — standing garrison, mobilizable levies, fed by population/economy |
| Lever (commitment) | The court's priority on this campaign: who is sent (command talent), how much is activated into a field army, logistics precedence, undivided political will. Command & control is doctrinally a force multiplier |
| Quality (slot) | Weapons, technology, drill — crossbows, siege engines, professionals vs levies. MVP = 1 |
| Terrain | The ground itself — the pass where a thousand hold ten thousand |
| Fortification | Prepared works — walls, moats, stockpiles; what siege grinds down |
| Plan/matchup | Generalship as method — how the same army is used, and how that method meets the enemy's |

Exemplar pair (same year, same war): Myeongnyang — substance 13 ships ×
strait terrain multiplier × extreme command lever repels 133; Chilcheollyang
— far larger substance, collapsed lever, annihilation. Substance, lever, and
multiplier are all real and multiply.

Structural consequences (both correct pictures, kept deliberately):

- **An empty garrison nullifies commitment** — lever × 0 = 0; command cannot
  conjure troops (D2). The remedy is a flow (reinforcement along routes),
  which makes route access matter more.
- **A great empty fortress is a paper tiger** — multiplier × 0 substance = 0.
- **Named-commander slot reserved**: commander competence is a person's
  attribute; with no general units in the MVP it is folded into the lever
  ("more attention buys better staff"). A later generals system splits the
  lever into attention × commander quality — same slot pattern as
  technology in quality.

Amends ADR 0022's framing: `defenseCommitment` is reinterpreted from a
fourth additive defense layer to the lever on garrison substance (amendment
noted in ADR 0022).

## D7 — The commit recommendation is the formula inverted over the fog band (2026-07-03)

Run forward, the formula maps commitment → ratio R. Run inverted, it maps
the plan threshold → *required commitment*. Because enemy strength is only
known as a fogged band, the required commitment is itself a **band**: "8
holds if they are at the weak end; 15 if strong." The command card's
recommendation is this computed range — not a new system, the same single
computation a third time (forecast, verdict, recommendation).

This is the concrete mechanism of ADR 0020's scouting loop: narrowing the
estimate band *is* narrowing the recommended-commit range, which *is*
cheapening the safety margin. The poker bet is where the player pins the
slider on (or below) that range.

Corollary — **attention economics of static defense**: when substance ×
quality × terrain × fortification already clears the threshold, near-zero
commitment legitimately holds. Investment in garrisons and fortification
purchases future attention freedom — the reason to build forts is to not
have to watch that front. Zero commitment therefore has two distinct
meanings the UI should keep legible: *ceding* zero (ADR 0021 sacrifice) vs
*trusting* zero (it holds by itself).

Balance dial (parked for the magnitude pass): the ceiling of what a
baseline-×1, unattended defense can absorb — set too high, defense is free
and fronts freeze; set too low, the attention-freedom purchase is a lie.
Where the preset pin sits inside the recommended range (safe end vs
average) is a UX/magnitude-pass choice, not settled here.

Rider (user insight, 2026-07-03): static investment is **effective tempo**.
The one-primary-action rule never changes, but a player whose garrisons and
fortifications hold fronts unattended gets a *free* primary (not mortgaged
to defense) plus wide surplus spread — more happens in the world per turn on
the same capacity. This is the D2 fed-player analogy made structural, and a
major skill differentiator: building the world in advance determines what
your attention can buy later.

## D8 — Saturating lever; the world outweighs the turn (2026-07-03, survey-validated)

Validated by both surveys (`RESEARCH.md`): the ordering is real-war
supported and confirmed as genre law — no surveyed game lets per-turn
input outweigh world-state defense, and nothing credible supports an
own-side attention multiplier above ~×2.

1. **The lever is a saturating curve, not a raw multiplier.** Committed
   capacity maps to the lever through a concave curve with a hard ceiling.
   Validated range ×1.0–2.0, typical band ×1.1–1.5, knee ~×1.5; the
   ×1.75–2.0 top is expensive, exceptional territory — the natural future
   home of the deferred overclock/emergency-mobilization system
   (ADR 0018/0020). Committing 10 does not mean ×10; no battle is won by
   shouting (D6 grounding: talent, logistics priority, will — saturates).
2. **Ceiling ordering is structural: lever ceiling < world ceilings.**
   Validated: terrain ×1.0–2.5, fortification ×1.3–3.0 (damageable —
   unanimous genre law), with the terrain × fortification **product capped
   ~×4** for standard sectors (naive ×9 exceeds everything in the genre)
   and ~×6 reserved for rare authored legendary sites (the Diaoyucheng
   class). Whether the cap is a hard clamp or sub-multiplicative
   composition is a magnitude-pass mechanism choice. Substance is
   unbounded but grows only at world speed; quality moves at tech speed
   (×0.8–2.0 band) **plus discrete tech-tier steps that can void specific
   terms** — a one-tier siege-tech jump collapses fortification
   (Xiangyang: 5 years of holding, ~1 month after counterweight
   trebuchets). Strategic grammar: a fortified pass cannot be beaten by
   attention — change the method (matchup) or change the world. Losses
   trace to state built over turns, never to a slider spike (ADR 0021).
3. **Myeongnyang decomposes cleanly — no lever explosion.** The strait
   *capped* the enemy's engageable substance (frontage → D9), terrain
   multiplied the defense, the commander's lever sat at its ceiling, and
   the enemy command collapsed (→ D10). A 13-vs-133 reversal from bounded
   deterministic factors.

Casualty-curve inputs banked for the losses branch: empirical Lanchester
exponent ~1.3–1.5 (square law overpredicts); the 3:1 rule is a gradient
(10/68 decisive victors reached 3:1) → headline thresholds sit below 3.0
and margin buys casualties, as D4 already shapes.

Clarification (user-challenged, 2026-07-03): **the knee is a price
structure, not a recommended value.** Concavity removes the *dominance* of
max commitment (it is never free); it does not crown a new optimum. The
optimal commit floats per battle — required-R inversion (D7) × the current
price of blood (thin sectors, turns left for regeneration, damaged
population) × the value of surplus alternatives. Paying the expensive
×1.75–2.0 zone is *correct* when blood is dear; shaving below the knee is
correct when the band is narrow and the enemy weak. Fixed price structures
are fine; fixed answers are a design bug (INDEX: no-fixed-optimum check).

## D9 — Frontage is a cap on engageable substance, deleted not attrited (2026-07-03)

At authored choke sectors (strait, pass, defile):

```
effective attacking substance = min(committed substance, frontage capacity)
```

A cap, never a multiplier — its impact is unbounded (Thermopylae's ~15 m
front equalized any army size; Myeongnyang's strait cut 120+ ships to a
handful), which is exactly why it must not multiply: it *classifies*
sectors rather than scaling them. Genre-universal as combat width /
stacking limits. Two authored obligations:

- **Removability**: every frontage cap must have legible removal paths —
  bypass (the Anopaea rule: chokes historically fail by deletion, not
  attrition), timing/condition windows, or tech. A choke with no removal
  path is a design bug.
- The MATCHUP `throttle` verb takes this min() shape; frontage capacity is
  authored per choke sector (magnitude pass).

## D10 — Enemy command collapse is a cliff, not a dial (2026-07-03)

There is no smooth sub-baseline lever. OR literature models command
breakdown as near-binary "combat ineffective" inside a fuzzy 20–40%
casualty band. Model it as a **rout threshold**: crossing it converts the
engagement's remainder into dissolution rather than fighting. This gives
existing designs their mechanical trigger — Stronghold Defense's
failure-as-garrison-dissolution, and Encirclement's isolated-rout
multiplier (isolation removes the escape, turning rout into annihilation).
Threshold values and the isolation multiplier are magnitude dials.

## D11 — One shared casualty curve; the headline gates stamps only (2026-07-03, closed under user delegation — survey-grounded)

Casualties on both sides are read from a single continuous curve of R,
applied identically on success and failure; the threshold headline decides
only whether axes stamp (D4), never who bleeds.

- Shape: near R = 1 both sides bleed heavily (mutual bloodbath); as R
  grows, the stronger side's losses fall **superlinearly** (empirical
  Lanchester exponent band 1.3–1.5 — real-war data, square law
  overpredicts) while the weaker side's rise, until the defender's
  cumulative losses cross the D10 rout band (20–40%) and the engagement
  converts to dissolution.
- The curve is two-directional: attacking at R < 1 means standing on the
  weak side of the same table — the defender takes the favorable column.
  Cheap repeated attacks therefore chip the defender slightly (realistic)
  but cost the attacker superlinearly more per attempt, while garrison
  regeneration (standing rule) refills the chip: grinding is unprofitable
  by arithmetic, with zero special-case rules.
- How *painful* a given casualty count is remains situational and honestly
  open (INDEX Honest Gaps): regeneration rates and the blood-economy
  coupling belong to the standing-rules/economy thread and the magnitude
  pass.
