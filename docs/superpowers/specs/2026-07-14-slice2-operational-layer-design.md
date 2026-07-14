# Operational Layer (작전술층) — Build Slice 2 Design Spec

- **Date:** 2026-07-14
- **Status:** DESIGN SEALED (2026-07-14 grill session — user verdicts throughout;
  implementation is the NEXT session; this session produced design only)
- **L-trust:** L0/L1 (grill reasoning + two evidence surveys:
  `docs/features/war-model-build/research/fatigue-factors.md`,
  `docs/features/fog-of-war-discovery/research/intel-acquisition.md`)
- **Feature:** `docs/features/war-model-build/` (INDEX; REQUIREMENTS C1/C2/D3/D4)
- **Closes toward:** DESIGN-RISKS R14 (via C1 opportunism read + C2 bot-exit
  redesign); SPEC_GAP ① (war appetite) and SPEC_GAP ② (multi-front field-army
  allocation — design opened here)
- **Builds on:** slice 1 (`js/battle.js` spine, WM-① SEALED) — the calculator
  contract is UNTOUCHED; slice 2 designs the layer that feeds it.

## 0. Purpose, scope, and altitude

Slice 1 built the tactical calculator: what happens when two forces meet.
Slice 2 designs the **operational layer** — the connective tissue that decides
*which* forces meet, *where*, *how worn*, and *knowing what*. The session's
governing discovery is a three-altitude reading of the war model (registered
as a DESIGN promotion candidate, §12):

| Altitude | Time scope | What lives here |
|---|---|---|
| Tactics (전술) | within one turn | one calculator invocation: contact methods, thresholds, rout |
| Operational art (작전술) | across turns | movement, fatigue, supply coupling, information, reads — **this slice** |
| Strategy (전략) | across the war | commit budget allocation, technology investment, settlement timing, war-ending |

Inner altitudes are necessary conditions of outer ones; outer altitudes give
inner ones their meaning. The operation-plan catalog is the *tactical
vocabulary*; this layer is the *grammar* that sequences it into campaigns
(the Moscow-trap play, previously only narratable, becomes system-expressible).

**In:** equal-mass grammar; fatigue system; movement contract; field-army
division doctrine + the two-resource definitions; war-ending composite
(declaration); information ladder + acquisition channels; opportunism read
(C1); defense-selection wiring; bot exit (C2); measurement plan.

**Out:** all implementation (next session); everything in the boundary ledger
(§10); all dial values (marked 가안 — magnitude pass after implementation).

## 1. Equal-mass grammar (the parity surface)

Sealed as the design destination (user, 2026-07-14):

1. Decisive-battle (결전) arithmetic is **symmetric**:
   `power = substance × commit lever × quality × fatigue effect` per side.
   Open-field remains a MODE (no terrain/fort multiplier — WM-① unchanged).
   Quality is the already-sealed slot (`FORMULA.md:128` — quantity × quality,
   quality fixed 1.0 for now); slice 2 **ports the slot only**, the technology
   system stays deferred.
2. With equal commit and quality, **the side that marched farther loses by its
   wear** → an equal-mass frontal invasion ends in the **defender's bloody
   repulse** (a beaten attacker goes home — attrition well under the M4 rout
   cliff; pointer: MAGNITUDE M4), not a massacre.
3. The attacker's three paths past parity:
   - **more mass** (the historical default — the shield gate already demands
     pre-assembled local superiority, MAGNITUDE M7);
   - **mismatch engineering** (strike where the response cannot reach — §7);
   - **piercing levers** (commit differential + quality gap) — the arithmetic
     embodiment of the SPEC skill-piercable principle, kept **expensive and
     readable** (a legible gamble, never a hidden trump).

**Principle (user, seal-quality):** invariant foundations (terrain, substance
from land) dominate; variable levers (commit, quality, fortification) must be
able to pierce — this is a deliberate game-over-history choice so that
명량/한산도-class moments are authorable by play.

**Riders:**
- (a) The 결전 **defender commit duel is designed in this slice** (the
  defender's field army carries its own lever at the decisive battle);
  the *shield-layer* commitment wiring (ADR 0021 fourth layer) stays slice 4.
- (b) Quality slot ported at 1.0; no tech system this slice.
- (c) Commit-curve re-grading (slope / max multiplier, MAGNITUDE M2) is
  **out of slice 2 entirely** — a dedicated later session; the battery may
  carry a descriptive sweep, decision deferred.
- (d) **Mass-inversion watch**: measurement tracks how often the smaller force
  wins at equal wear, guarding the land-derived identity against piercing
  levers growing too strong.

## 2. Fatigue system (피로도)

A persistent army attribute. **One gauge, two ledgers** (user, 2026-07-14):

| Ledger | Accrues from | Floor | Can kill? |
|---|---|---|---|
| March/battle ledger | movement + combat intensity | effectiveness floor ×0.5 (가안; consonant with the sealed M9 ×0.5 arrival — cited, not re-sealed) | **never** |
| Supply ledger | supply interruption ("starvation pump") | n/a — never touches effectiveness; sole output is starvation substance loss | **yes — exclusively** |

The player-facing readout is the fatigue gauge (march/battle ledger → the
effectiveness multiplier in the §1 power product) plus a starvation status
while supply-cut (supply ledger → substance loss); the ledgers keep cause
legible and keep death conversion where the fiction demands it: tiredness
never kills, starvation does.

**Accrual:**
- **March:** linear per hex entered, uniform across terrain (가안 rate).
  Terrain weighting REJECTED — movement slowness already taxes terrain;
  weighting wear would double-tax (evidence: Suvorov 1799 decomposition,
  `research/fatigue-factors.md`).
- **Battle:** proportional to **own casualty fraction** in the engagement
  (가안 constant) — the intensity signal: a fierce R≈1.3 win wears survivors
  deeply, a walkover barely. The winner-side intensity signal is **consumed
  internally**; adding winner casualties to the outcome *contract* stays
  slice 3 (§10).
- **Starvation (기아):** while supply is interrupted the supply ledger rises
  per turn (가안); past its entry threshold the army is in the starvation
  state, gated by the supply ledger **exclusively** — march/battle accrual
  can never enter it (the two-ledger firewall). **Starvation touches
  substance ONLY** (user seal 2026-07-14, closing the design): the per-turn
  substance loss rate rises continuously and convexly with depth — no
  stages, no capability flips. D4's staged severity (holding →
  attack-incapable → defenseless) is **superseded**: combat incapacity is
  never system-forced — it emerges from shrinking substance, and choosing to
  fight on while starving (the desperate stand) is the player's high-risk
  right. Each ledger thus has exactly ONE output — march/battle →
  effectiveness (floored ×0.5), supply → bodies (unbounded). Amendment stamp
  owed to the ADR 0026 family (§12).

**Effectiveness mapping — the conversion curve (user seal 2026-07-14):**
the march/battle ledger maps into the §1 power product through a **single
continuous convex curve** — an accelerating penalty (light fatigue is
cheap, deep fatigue increasingly expensive; slope 가안, magnitude pass) —
saturating flat at the **×0.5 floor, the curve's terminal point**:
effectiveness never drops below it. The supply ledger does NOT feed this
curve; its sole output is the starvation substance loss above. A
stepped/banded mapping was REJECTED (value discontinuities at region
boundaries); **named regions are vocabulary and UI labels only** (the M7
"toxic band" naming precedent) — the arithmetic never jumps.

**Recovery — a child of supply and ground:** no supply = zero recovery +
starvation; steady supply **multiplies** recovery per turn (가안 curve). The
ground gates recovery as well (slice-2 ticket 06 landing, 2026-07-15):
scorched (ash) ground denies recovery even when supplied — recovery = supply ×
ground-recovery factor, ash = 0 (`fatigue.turnUpkeep`'s recoveryFactor,
`board-verbs.siegeUpkeep`; consonant with ADR 0014 — a burned province economy
cannot rebuild its garrison). Ash grading is binary today; a partial-burn curve
is a magnitude candidate (§12 dial sheet). The ground factor gates the
wear/recovery ledger ONLY — never substance, so the two-ledger firewall holds
(starvation stays supply-exclusive). Whether recovery additionally requires
being stationary is **HELD** (open dial, §12).

**Tax map (M7 refined this session): one event, one target, one tax.**
March taxes approach (length); ADR 0015 crossing penalties tax the crossing
*event* (unchanged); battle taxes bodies via M4 and survivor condition via
battle fatigue (two targets, one tax each); supply taxes sustainment.
FG-⑩ rider ii (flat ×0.75 march-worn) is **retired and subsumed** as a
midpoint of the wear curve — measurement already showed the flat revert alone
is powerless (WM-①).

**Emergent siege clock:** ADR 0026 still bans multi-turn operation objects,
yet besieging emerges — cutting a garrison's routes pours turns into its
supply ledger. A siege IS the defender's rising supply ledger.

**Dial inventory (all 가안 — the magnitude pass's target sheet, names only):**
(1) march accrual rate per hex · (2) forced-march premium + extra-hex cap k
· (3) battle-fatigue coefficient per casualty fraction · (4) supply pump
rate per cut turn · (5) starvation entry threshold (supply-ledger depth)
· (6) conversion-curve convexity (floor ×0.5 is a sealed anchor and the
curve's terminal point) · (7) death-conversion curve (depth → per-turn loss
rate) · (8) base recovery rate + supply multiplier curve · (9) stationary
requirement (HELD — resolve before or at magnitude).

**Research verdicts (advisory table ratified by user):** forced march
**ADOPTED** (§3) · terrain-weighted wear **REJECTED** · season/winter
**DEFERRED** — the 1812/Barbarossa evidence shows season acts through
supply/disease channels the model already owns · camp-tier recovery
**REJECTED/HELD** — Q4's supply-multiplied recovery already prices it.

## 3. Movement contract

Armies gain **positions on the hex graph** of the authored world
(terrain-cradle; `mockup/combat-calc/map-gen.js` is the geometry source).

- **Speed:** constant S hexes/turn (가안) for all forces in this slice.
- **Orders:** destination only; pathing is automatic shortest passable route.
  No per-hex micromanagement — the one-judgment-per-turn identity is
  preserved. Movement UI belongs to the UI axis (ADR 0028), not this slice.
- **Forced march (강행군):** a toggle on the march order — move up to S+k
  hexes this turn at a premium fatigue cost per extra hex (가안 exchange
  rate). **The wallet is the fatigue gauge itself** — no third resource; and
  no new combat penalty is needed, because arrival fatigue already prices the
  R sacrifice through §1/§2. Historical evidence both directions (Antietam
  straggling ≈ battle-scale loss; Ulm won a campaign nearly battle-free):
  the trade is real, so it is a player choice, not a scripted rule.
- **"High Complexity, Low Micromanagement"** — registered as a SPEC Core
  Principles promotion candidate (the UX corollary of one-judgment; §12).

## 4. Field army (야전군) doctrine and the two resources

**Amends the WM-① vocabulary seal** ("one at a time" retired — stamp owed,
§12).

- **Free division and merge** as turn actions — continuous, no detachment-count
  cap. User freedom doctrine (seal-quality): *the system prices choices; it
  does not prohibit them.* Sending a fraction "to probe" may be R-suboptimal
  and is still legitimate strategy. The natural price of splitting is
  **defeat in detail**, already produced by the sealed arithmetic (ratio core
  × M4 casualty exponent × rout cliff — pointers: FORMULA D5/D10/D11) — no
  artificial caps are added.
- Split detachments **inherit the parent's fatigue**; merge takes the
  size-weighted average (user-sealed 2026-07-14 — conservation of tiredness:
  fatigue × men is invariant across split and merge, so no fatigue
  laundering exists).

**Two-resource definitions (seal-quality; to be registered at doc-sync):**

> **Field army (야전군):** the mobile part of a realm's substance — the
> user's device for controlling R. Geometry-bound (position, movement,
> fatigue), freely divisible, land-derived; losses are permanent currency.
>
> **Commit (커밋):** a per-turn regenerating, non-bankable realm budget —
> the abstraction of command capacity and court attention. The
> hyperparameter of engagement across ALL uses (development, attack,
> defense, reconnaissance): every commit-consuming action draws from one
> pool. The engagement lever (MAGNITUDE M2, 0–20) is the share allotted to
> that engagement. Example shape (user): full army committed for R, but
> commit 12 to the war and 8 to development.

This definition **formally unlocks FG-⑧'s parked commit-scarcity axis**:
war has a development opportunity cost by construction.

**Amendment register:** 야전군 GLOSSARY row (division doctrine); FG-⑥/⑩
(reserve destination and layers become per-detachment); C4's 20% screen
harness rule retired; SPEC_GAP ② design formally opened by this section.

## 5. War-ending composite — MANDATORY ADR (win-condition change)

B2 ("a war is decided by field-army destruction") is **demoted from sole
decider to dominant path**. Sealed direction (user, 2026-07-14):

> A war ends when the loser's **capacity or will** to resist breaks:
> 1. **Field-army destruction** — the dominant path (the madmovie:
>    shield-break → 결전 → cascade);
> 2. **Capital fall** — a regime event (CP-① concept; vassalization /
>    cession scenarios; wiring stays capital stage ②);
> 3. **Settlement acceptance** — the will path (B3 ladder); surrendering
>    with the army intact is always permitted.

**Anti-drag analysis:** withdrawing the army to drag a lost war is permitted
and self-punishing — lost land starves recruitment (land-derived mass), and
the capital backstop waits. Humans are never force-closed (CE-⑲ unchanged).
The composite must land as an ADR in the same doc-sync batch
(documentation-law mandatory trigger), with a supersession/amendment stamp
on the SPEC B2 line.

## 6. Information system

**Geography is public from turn 0** (user stamp 2026-07-14, amending the fog
INDEX StarCraft-style map-discovery idea — supersession stamp owed). What was
historically unknown was never the map; it was the opponent's state.

**The information ladder:**

| Rung | Visibility |
|---|---|
| Terrain, fortification grade | public (fog RULING ①, G12 — unchanged) |
| Substance, fatigue, army positions | scoutable **true-containing estimate bands**, aging per the Aging constitution (노화 헌법) P3: narrow at contact, re-widen per unobserved turn (`js/intel.js` scalars exist) |
| Standing posture, commit allocation | **the dark market (깜깜이 시장, [조어]):** unreachable at any confidence; revealed only ex-post via battle reports, back-inferable as tendency |

**Seal-quality sentence (user):** *as information completes, the duel moves
from information to psychology — reconnaissance's destination is not
omniscience but reading the opponent's hand.* At mutual high confidence the
war is decided by commit values and plan selection — deliberately.

**Acquisition channels (ratified):**
- **Border alarm (국경 경보, 봉수형)** — ADOPTED: free, instant, low-bandwidth
  (threat-ladder shape, ~five steps 가안) detection of any army entering the
  border zone. No undetected invasion exists; deep strikes hide scale and
  state, never existence.
- **Reconnaissance plan extension** — ADOPTED: the sealed band-narrowing now
  also covers the fatigue band and fixes an army's last-seen position.
- **Last-seen + reach cone (도달 원뿔)** — ADOPTED: an enemy detachment's
  position knowledge = last observed fix + a deterministic cone growing by
  speed per unobserved turn (P3 applied to position). The legal input of the
  pinning read (§7).
- **Resident spy network** — DEFERRED to Phase 2 (standing subsystem;
  intent-grade interior information).
- **Deception (false signals)** — REJECTED: conflicts with the
  true-containing band seal; reopening requires its own pass.

**Two-reconnaissance taxonomy — DIRECTION sealed:** *present* reconnaissance
(current bands, above) vs *predictive* reconnaissance (reading the opponent's
**past commit record** → a disposition estimate for predicting behavior;
"background research via merchants"). Predictive recon reads past facts, so
it does not strain the true-containing seal. Mechanization: the disposition
dial already exists (tactical-plan-ai TP② λ; archetypes) — predictive recon
narrows the estimate of the opponent's disposition parameters; in PvP the
analogue is action-history statistics. Full plan cards belong to the catalog
reclassification pass (§12). Own-force projections are exact (no fog on
self); only enemy-dependent terms are banded (D1).

## 7. Opportunism read (C1 — SPEC_GAP ① closed at design level)

**One function, two consumers, running every turn:**

```
window(X) =  my deliverable effective force at X
             ─────────────────────────────────────
             what actually defends X now

numerator:   substance × projected arrival fatigue (path, forced-march option)
             × commit I can allot (budget slack) × quality
denominator: garrison estimate band × public terrain·fort
             (standing posture = unknown categorical — priced, not known)
             + Σ enemy detachments whose reach cone intersects the response
               window, each at ITS projected arrival fatigue
             × their commit slack (disposition estimate — TP② λ reuse)
```

- **Pinned (묶임):** no enemy detachment's cone intersects the response
  window of front X. Pinning engineering = exhausting the opponent's cones
  with feints — now a per-detachment game (§4).
- **Consumers:** (1) peacetime — window crossing the appetite threshold
  (가안) is the war-declaration signal, replacing the static ~1.7 gate;
  (2) wartime — argmax window(X) picks this turn's target.
- Reuses the sealed U4 `pickTarget` grammar (judged garrison(λ, band) ×
  public multipliers, softest reachable — FG-⑦); slice 2 *extends* it with
  the reach/fatigue/commit terms rather than inventing a new read.

## 8. Defense-selection wiring (의제 2 closed)

**The 2+2 altitude split** (resolves WM-①'s open defender-choice wiring):

- **Contact methods → categorical inputs to the ONE calculator**
  (`resolveEngagement` gains a defense-plan category; the ADR 0025 roshambo
  socket opens here, matchup content stays A4):
  - **Stronghold Defense (거점 방어)** — the current spine as default.
  - **Delaying Defense (지연 방어)** — outcome-band shift: decisive repulse
    off the menu, "not taken this turn" cheap, erosion clock, self
    route-disruption (per its CATALOG claim block — pointer, not restated).
- **Board verbs → no calculator invocation:**
  - **Strategic Abandonment (전략적 포기)** — free declaration, immediate
    transfer channel.
  - **Scorched Earth (청야 소각)** — turn-consuming self-damage resolution;
    with §2, the Moscow trap gains its full arithmetic (ash + cut routes =
    no recovery + starvation pump).

**Standing posture model:** a posture stands on each sector (default
Stronghold); changing it is a turn action. Caught flat, the shield's commit
layer is baseline ×1.0. **Information converts prevention into pre-emption:**
warning (border alarm, cones) opens the window to pre-reinforce and raise the
next turn's defense commit.

**Reactive layer:** M9 fill + field-army interception, with the 결전 commit
chosen AFTER the attack is revealed (FG-⑤ raw first blow; FG-⑦ fog-free
reserve read — the defender's big commitment is never blind; its risk is
allocation scarcity, not waste). **The reaction boundary is geometry, not
turn number:** in-reach = same-turn 결전 (slice-1 chain unchanged);
out-of-reach = FALL now, re-fight invocations later.

**Defender response doctrine (prose):** with a reserve, the thought is a
main-vs-feint read ("is this the real blow, or am I being pinned?"); without
one, the goal shifts from holding to **loss-shaping** — delay as a bridge to
the reserve's return, or cede-and-burn to convert lost ground into the
attacker's liability. **No miracle button, by design** — the no-reserve state
is the designed reward for the attacker's operational play; the design
surface is the COST of manufacturing that state (shield gate, wear, alarm,
battle fatigue, commit duel).

**First-turn decisiveness doctrine (user, seal-quality):** *the attacker's
edge is a corroding asset — the war arithmetic must lean toward first-blow
decisiveness.* The defender's response compounds per turn; the attacker's
advantage decays (fatigue, supply stretch, bands re-narrowing).

## 9. Bot exit (C2 closed)

The L2 stall→white-peace timer (patience-2 / near-miss — the measured driver
of the 77% white-peace fizzle) is **retired**. Replacement: **read-driven
settlement** — a bot court that reads (i) no window of its own, (ii) windows
open against it, (iii) a degrading trajectory (fatigue, land, army), accepts
the appropriate B3 settlement rung. This executes §5's will path. Bot-only:
CE-⑲ (no forced closure over a human) unchanged.

**Bot doctrine (user, 2026-07-14):** bots judge "like real people" and should
play *better* than people within their constraints — optimal calculation
inside disposition (λ) and confidence-band limits. Personality lives in
information and disposition, never in a calculation handicap (sister
principle to "a bot sees exactly what a player sees").

## 10. Boundary ledger (slice assignments made this session)

| Item | Assigned to | Note |
|---|---|---|
| Winner-side 결전 casualties in the outcome contract | slice 3 | slice 2 consumes the intensity *signal* internally (§2) — "signal consumed, contract deferred" |
| Shield-layer defenseCommitment wiring; M9 real-map wiring | slice 4 | 결전-layer commit duel is slice 2 (§1 rider a) |
| Movement/orders UI, fatigue gauge UI, advisory sentences | UI axis (ADR 0028) | advisory UI also noted at DISPLAY-DEBT |
| Technology system; resident spy network; deception; PvP implications | Phase 2 | quality slot ported at 1.0 only |
| Catalog altitude reclassification (all 12 plans) | dedicated pass | §12; slice 2 performs only the 2+2 defense split |
| Commit-curve re-grading | dedicated session | battery sweep descriptive only |

## 11. Measurement plan

The battery extends slice 1's `buildMatrix` with **layer-restoration knobs
from the start** (the WM-① methodology lesson; pattern:
`mockup/decisive-battle/probe-defense-layers.js`).

Registered metrics:
1. **Parity-surface grid** — wear × commit × quality sweep at equal mass:
   does §1's grammar (defender's bloody repulse; piercing possible but
   expensive) actually emerge?
2. **Swift Seizure success sweep** — distance × defense multipliers × reserve
   reach: is the one-turn capture appropriately priced by the new operational
   costs? (User-raised value concern — answered by evidence, not a nerf.)
3. **Mass-inversion rate** — §1 rider (d) land-derived guard.
4. **Commit-curve descriptive sweep** — data for the dedicated session; no
   decision here.
5. **Fizzle re-read vs the L2 baseline** — white-peace %, annihilations/match,
   settlement rung distribution: does C1+C2 close R14 at the source?

## 12. Registered follow-ups, vocabulary, and stamps owed

**Follow-up passes (registered, not this session):**
- **Catalog altitude-reclassification pass** — dedicated grill; stamps every
  plan with its altitude; authors the two reconnaissance plan cards
  (present/predictive); supersedes the "tactics sequenced = strategy" frame
  by ADR.
- **Commit-curve grading session** (M2 slope/max).
- **HCLM → SPEC Core Principles** promotion proposal (Tier-3, user decides).
- **Three-altitude reading → DESIGN** promotion proposal.
- **HELD dial:** stationary requirement for recovery (§2).

**New Tier-1 vocabulary to register at doc-sync (birthplace: war-model-build
GLOSSARY unless noted):**

| English canonical | 표시어 | Note |
|---|---|---|
| fatigue | 피로도 | §2; army attribute |
| fatigue ledger | 원장 | march/battle vs supply |
| forced march | 강행군 | §3 toggle |
| reach cone | 도달 원뿔 | §6/§7; P3 applied to position |
| border alarm | 국경 경보 (봉수) | §6 channel |
| commit budget | 커밋 예산 | §4; unlocks FG-⑧ |
| window | 창 | §7 read output |
| dark market | 깜깜이 시장 [조어] | §6 rung 3 — register or discard at doc-sync |
| present / predictive reconnaissance | 현재적/미래적 정찰 | direction only; cards at catalog pass |

**Amendment stamps owed (same doc-sync batch):** fog INDEX Idea section
(geography public — supersession stamp); FG-⑥/⑧/⑩ (per-detachment; scarcity
axis unlocked; rider ii subsumed); match-arc GLOSSARY 야전군 row (division
doctrine); SPEC B2 line via the §5 mandatory ADR; ADR 0026 family (D4
starvation medium = fatigue supply ledger); C4 row (20% screen retired);
SPEC_GAP ①/② status updates.

## 13. Sealed sources (pointers)

- Slice 1: WM-① (`war-model-build/RULINGS.md`), spine spec 2026-07-13,
  `js/battle.js`.
- FORMULA D1/D5/D6/D10/D11; quality slot FORMULA:128; MAGNITUDE M2/M4/M5/M7/M9.
- force-geography FG-③/⑤/⑥/⑦/⑧/⑩; ADR 0015 (crossing event tax);
  ADR 0019 (relational threat); ADR 0021/0022/0031 (defense layers);
  ADR 0025 (plan-vs-plan uncertainty); ADR 0026 (atomic resolution; supply
  standing rule); ADR 0028 (stack/UI axis); ADR 0029 (integration-lag
  recovery grammar precedent); ADR 0037 (build direction).
- Fog: RULING ① (G12), estimate bands (slice 1), Aging constitution P3,
  `js/intel.js`; tactical-plan-ai TP② (disposition λ).
- CATALOG §Attack (M7 thresholds), §Defense (three claim blocks), §Non-combat
  (Reconnaissance, Recovery — the fatigue system supplies Recovery's engine).
- match-arc: B1/B3 (decision gate, settlement ladder), CE-⑲, OG-③;
  capital CP-①; DESIGN-RISKS R14.
- Evidence: `war-model-build/research/fatigue-factors.md`,
  `fog-of-war-discovery/research/intel-acquisition.md`.
