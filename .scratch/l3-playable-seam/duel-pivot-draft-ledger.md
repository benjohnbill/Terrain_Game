# 1v1 Duel Wayfinder — Running Seal Ledger

Label: wayfinder:duel-pivot / draft-ledger
Status: LIVE draft. **All six design gates CLOSED (2026-07-24)** — the
documentation cascade (ADR / SPEC / DOMAIN_MAP / feature birthplace), deliberately
deferred while gates were open, is now UNBLOCKED (see Status at end). **Untracked
working note** — a session safety net against context compression, NOT the formal
seal. Formal seal home = `docs/features/capital/` (CP-②+ rulings) in the eventual
seal batch.

Ground: `.scratch/l3-playable-seam/duel-pivot-premises.md` (P1/P2/P3) + memory
`terrain-game-duel-pivot`. Method: grilling, one question at a time, user seals
each node.

Gate order: 1 capital def+placement · 2 fall mechanics+early-rush · 3 draw/timeout ·
4 crisis fate · 5 match-arc in short duel · 6 turn structure.

---

## Gate 1 — Capital: definition + placement — CLOSED (2026-07-23)

- **D1.1 (inherited, P1):** Exactly one capital per realm; its fall = match
  loss. Rump state impossible (now via "match ends on capital fall" — see CP-④
  amend below, not via "structurally last").
- **D1.2 — SEALED — location PUBLIC.** Both players know which city is the
  enemy capital from match start. Fog applies only to the guard's strength /
  last-stand depth (the fog contract's "geography public / force dark" line),
  never to the capital's location. Rationale: poker position is public; the
  forward/rear tension must be *readable* to exist; prevents a "can't find it"
  hunt.
- **D1.3 — HELD (not vetoed, re-openable).** Placement is player-chosen
  (CP-①); both realms commit simultaneously at match start, then reveal
  (symmetric 1v1, no first-mover advantage).
- **D1.4 — SEALED — forward/rear = capital-guard duty-cycle.** Forward capital:
  guard sits on the busiest gate → defends it for free → frees the field army
  for offense (indirect offense, emergent, 天子守國門, CP-④). Cost: short
  decapitation path + front wear thins the last stand (guard = final-stand
  stock, CP-②). = high leverage / high variance. Rear capital: guard is a
  pristine deep last stand → resilient / low variance. Cost: field army tied to
  gate defense + zero forward pressure. Axis = **leverage vs variance**, poker
  position shape. No new dials (falls out of CP-①/②). No direct-offense
  multiplier (×1.25 hub buff stays rejected, CP-①).
- **D1.5 — SEALED — fixed by default + ruinous relocation (천도).** Relocation
  is possible but a gamble: it consumes a large amount of the **commit budget
  (행동력)** across ~2 turns (a multi-turn national project). The capital guard
  is NOT stripped (place-bound, stays put); the risk is pure action-economy
  drain — 행동력 is the game's currency, so for those turns the realm does far
  less of everything else. The **old capital stays the win-target AND shield
  until the exact moment relocation completes**; then the target switches to the
  new city. No forced cession of the old province (it only loses capital
  status). Exact 행동력 cost / turn count = 가안, deferred to measurement.
  Historical spine: Ming Yongle Nanjing(南京)→Beijing 1421 (天子守國門, forward,
  years+treasury); Southern Song Kaifeng→Lin'an 1127 (rear survival pivot);
  Bolshevik Petrograd→Moscow 1918 (defensive rear pull). History favors
  "old seat continuous until complete" (Jingkang: Northern Song died when the
  actual court was captured, not at a transitional point).

## Gate 2 — Capital-fall mechanics + early-rush guard — CLOSED (2026-07-23)

- **D2.1 (frame):** Capital fall = taking the capital sector by defeating the
  capital guard (guard = defender's stock, CP-②). Two paths, both late-game by
  construction: (a) overwhelming decisive battle vs the full guard; (b)
  Moscow-trap — encircle → cut supply → starve the guard down → finish.
- **D2.2 (resolved):** Siege is EMERGENT, not an object (slice-2 ticket 06):
  besieging = pouring turns into the defender's supply ledger; a cut-off
  garrison melts continuously. No artificial siege timer, no siege object.
- **D2.4 — SEALED — capital guard = ordinary garrison, terrain-gated.**
  Garrison-class (CP-②), just larger magnitude (land-derived from the capital
  sector). **NO capital-specific supply rule; the capital is NOT auto-declared a
  supply `base`.** It obeys the same `movement.isSupplied` predicate as any
  force → it CAN be encircled and starved (Moscow trap). Whether / how fast that
  is feasible is **terrain-dependent** (chokepoint & corridor count, natural
  barriers, province type) — emergent from terrain + the supply predicate, tuned
  in the parallel map pass. "Eat the province / hold the ring first" survives as
  an emergent consequence (cutting supply = controlling the surrounding
  terrain), not a special rule. Difference from an ordinary city = consequence
  KIND (regime event / win, CP-③) + guard magnitude only.
  - *Retraction recorded:* the earlier "capital = supply base → starvation-immune"
    proposal was withdrawn — it reverse-engineered a rule to force a pre-chosen
    conclusion; `isSupplied` line 111 ("on-base = always supplied") is exactly
    what would wrongly immunize the capital.
- **D2.3 — SEALED — early-rush guard = PURE EMERGENT, no hard floor.** No
  "capital can't fall before turn N". The capital-guard magnitude (가안 350×pop)
  is the only early-rush gate. Turn-3 decapitation is prevented emergently by:
  (a) guard magnitude → cracking by battle needs a big army = late-game; (b)
  encirclement is multi-turn + visible (border alarm) = automatic response
  window; (c) supply/fatigue/time cost of reaching a rear capital. A forward
  capital crackable earlier is D1.4's intended risk, not a bug. Fragility lever
  if measurement demands = terrain tuning (parallel pass) or guard magnitude
  (가안), never a hard floor.
- **D2.5 — SEALED — bypass allowed, self-limiting → mutual-exposure duel.**
  Field-army bypass / direct capital strike has no prohibiting rule and is
  self-limiting: cracking the guard needs a big army, which (a) fog detects
  (border alarm + a large army is scoutable), (b) undefends your own capital →
  counter-decapitation exposure, (c) pays supply/fatigue deep in enemy land.
  Consequence (the match frame's heart): the whole duel is a **mutual-exposure
  duel** — committing force to offense undefends your own win-condition. Poker
  "big bet exposes you" shape; legible from turn 1 because both capitals are
  public (D1.2). Emergent, no special rule.

## Gate 3 — draw / timeout — CLOSED (2026-07-23)

Evidence base: a read-only mining of the prior crisis / war-termination work
(match-arc RULINGS CE-①…⑳ + DT-①/②, ADR 0034–0038, DESIGN-RISKS R14, slice-2
tickets 10/11, co-analysis). Distilled report in this session's history.

- **D3.1 — SEALED — capital fall = SOLE, pure win condition.** No points-victory,
  no tiebreak-win, no timeout-draw. Stalemate/undecided is not resolved by a new
  match-ending condition; it is resolved by pressure that INDUCES capital
  capture, never by scoring the board. **Validated by precedent:** a
  points/scorecard terminal was rejected 3× in this codebase (ADR 0034
  demotion → 0035/CE-⑪ removal → DT-②), invariant = "capital fall is the only
  namer of a winner."
- **D3.2 — SEALED — anti-fizzle is STRUCTURAL-FIRST; no forced-termination
  device is built now.** Four structural forces guarantee the duel resolves:
  (1) 1v1 removes the multipolar deadlock (the main multi-realm fizzle driver);
  (2) mutual-exposure (D2.5) makes sitting unsafe; (3) **land-derived decay** —
  losing ground starves land-derived recruitment, so the trailing player decays
  and must gamble a strike (DT-② goal re-anchored + ADR 0038 "dragging a lost
  war is permitted and self-punishing"). This is asymmetric (hits the loser),
  attached to LAND not treasury (avoids the measured-INERT blinds failure —
  treasury out-earns any curve), and diegetic; (4) faithful L3 combat (sealed
  per-sector 4-layer defense, atomic resolution) lets offense break defense.
  **No blinds-clock** (measured INERT, MT-⑤). Explicit device **DEFERRED behind
  L3 fizzle measurement**; if ever needed → upstream (war-decisiveness) /
  land-attached / asymmetric / never points. DT-② inherited as GOAL, payoff
  re-anchored from "hegemony accumulation" to "capital isolation." Attack/defense
  balance = L3 implementation fidelity (force-geography measured +33% decided when
  per-sector defense is faithful) + a post-L3 measurement pass — NOT a dial this
  draft turns.
- **Meta (user, standing frame):** everything sealed here is L0/L1; the real
  judge is L3 playtest (the user playing). Revisable-in-play — devices may be
  added on real fun signal, never on L2-bot speculation (YAGNI).

## Gate 4 — crisis fate — CLOSED as corollary of D3.2 (2026-07-23)

Since no forced-termination device is needed, the crisis / internal-rebellion
system (CE-①…⑳; ADR 0034/0035/0036) — which existed ONLY as the
forced-termination backstop for the multipolar deadlock — is **RETIRED / PARKED.**
It is built opt-in-off, so retiring leaves it dormant with no code change. Only
its INSIGHTS survive as reserve-device ingredients IF an L3-measured device is
ever needed: the pay/refuse escalation staircase (CE-④/⑥) and calendar-staged
determinism (CE-⑨). Seal batch: the crisis ADR stack is superseded by the new
victory ADR (per premises blast-radius).

## Gate 5 — match-arc in a short duel — CLOSED (2026-07-23)

**Standing judgment frame (user, 2026-07-23):** affirm the sealed prior work
first (default a realm-internal system to LIVE / inherited), then judge fixes by
the user's UX standard in L3 play. Divergence from a prior seal requires a
concrete UX reason found in play, not speculative redesign. Recommendations in
this gate lead with "affirm prior seal" and flag UX-fix *candidates*, never
propose L2-driven mechanic rework (P2 Boundary + YAGNI).

**Frame — what Gate 5 actually decides.** The four realm-internal systems
(aging constitution, conscription register, surge recruitment, mobilization
intensity) were all minted in ONE pass (Match-Tilting, 2026-07-07, MT-①…⑤) for
ONE problem: the **frozen world** — in a multi-realm long arc, healing outran
wounding so the hegemony decision point never tripped. They were the clock that
accrued irreversibility to force that trip. The pivot RETIRED the decision point
(D3.1); their original job is gone. D3.2 re-hires the same machine for
anti-fizzle: losing ground starves land-derived recruitment → the trailing
player decays → must gamble a strike. Gate 5 decides, per system, whether it is
LIVE / INERT / REPURPOSED in the compressed 1v1 frame.

- **D5.1 — SEALED — the anti-fizzle decay lives in income + force limit; no new
  device.** D3.2's land-derived decay is DELIVERED by two already-sealed
  machines, not by the four "aging" systems: (1) **income** (Σ economyValue ×
  usableEconomy over `holds`, occupation-geography OG-①) and (2) the **military
  force limit** (land-derived ceiling via **capLandFrac = 1**, AB-②). Both
  recompute every turn from currently-held land, so losing a sector cuts BOTH
  the same turn (occupied land → limbo, pays no tax and lifts no ceiling, OG-③).
  Rationale: (a) *immediacy* — the register is a STOCK (MT-②: only death shrinks
  it), so it barely moves inside a ~15–30 min duel; the turn-by-turn decay D3.2
  needs can ONLY come from the board-state machines, not the stock; (b) satisfies
  D3.2's own "attach to LAND not treasury" — these are held-land-driven, the
  exact opposite of the growing-treasury-vs-time curve that measured INERT in
  MT-⑤; (c) P2 Boundary — zero redesign, Gate 5 only NAMES the existing seal as
  the decay's home. **L-stamp L0/L1**: this judges D3.2 "already covered" at hand-
  reasoning level; the real judge is L3 play (does the ceiling/income drop feel
  painful enough to force the gamble). Sealing "no new device now," not "never."
- **D5.2 — SEALED — aging constitution P1/P2/P3 all LIVE; purpose re-aimed,
  mechanics unchanged.** The three principles (MT-①) survive intact into the
  1v1 frame; only their PURPOSE moves (they were minted as the "decision-point
  clock," which D3.1 retired). **P1 (dual billing — no free healing) is the
  buttress of D5.1**: without it, losing land would still cut the ceiling/income,
  but garrisons would free-regenerate the lost force, nullifying the decay and
  reviving fizzle. P1 is what makes land-loss an irreversible loss — the hidden
  pillar under D3.2's anti-fizzle, and MORE load-bearing in a duel, not less.
  **P2 (flow never ages)** holds unchanged: economy sets healing SPEED only,
  permanent damage only via identity acts (초토화) — no pivot conflict. **P3
  (snapshot information)** holds and is already consumed by the sealed fog
  presentation contract (gate-07): contact fixes the immutable layer, the mutable
  layer decays, re-scout costs action. Re-aim, not redesign: P1 reads now as "the
  rule that makes land-loss irreversible," exactly the surface D5.1 leans on.
  UX-fix candidates: none new here; whether P3's snapshot decay bites inside a
  15–30 min duel is an L3 watch already registered under the fog economy
  (gate-07 recon-pricing open question), not a Gate-5 device. **L-stamp L1.**
- **D5.3 — SEALED — conscription register LIVE, role narrowed; mechanics
  unchanged (MT-②).** **Corollary dissolved by ADR 0044 (2026-07-26, gate C
  ruling R16/R17): the "faithful reading of land-loss" paragraph below no longer
  holds.** It was deduced from permanent limbo — limbo is terminal → the only
  transfer channel is settlement → a duel has no settlement → therefore the
  register never moves. Conquest is now itself a transfer channel, so the first
  link is false and the chain unwinds. The register now succeeds in proportion to
  the accumulated stock (R17), and D5.3's own flagged L3 watch ("lost half my
  land, why is my register intact?") is resolved in the direction it worried
  about. **Everything else in D5.3 stands**: the register is land-derived at
  start, a total-bodies stock, the finite blood bound, and the body-side of the
  affordability bound. The register survives intact: land-derived at match start
  (명부 = registerPerPop × Σ populationValue), total-bodies accounting, a pure
  STOCK (only death shrinks it; recruitment moves civilian→serving), capPerPop
  600 = sustain fraction ⅓. Its OLD job — the multi-war aging clock ("one lost
  war forbids a second full army," draining across 2–3 wars) — largely does NOT
  fire in a single-war duel (P1 Charter: war and match are one); the
  compressed-timescale lens bites here, and that is fine. **Faithful reading of
  land-loss in a duel:** losing a sector to occupation (limbo, OG-③) does NOT
  shrink the register — the register is a stock moved only by settlement transfer,
  and a single-war duel has no inter-war settlement; the bodies remain (real
  people under enemy occupation), merely unreachable and unaffordable. The decay
  is delivered by income + force limit (D5.1); the register sits on top as (1)
  the **finite blood bound** (deaths permanently shrink it — losing a big army
  leaves fewer bodies to rebuild even after retaking land; blood = permanent
  currency, SPEC) and (2) the **body-side of the affordability bound** (AB-①:
  bodies = pool − serving, one of the four mins on recruitment). Handoff hard
  constraint honored: the register stays land-derived / finite / the currency the
  decay runs through — NOT narrowed into something that breaks D3.2. UX-fix
  candidate / L3 watch: whether "occupation doesn't shrink the register" reads
  wrong to a player (lost half my land, why is my register intact?) is an L3
  UX judgment, not a Gate-5 change — the anti-fizzle is carried by D5.1+P1
  regardless. **L-stamp L1.**

**Validation-tier note (applies to every number-bearing seal in this gate, and
beyond).** "Can the concrete numbers only be proven by L3 play?" — No; they
decompose into three tiers: (1) **ratio / shape** (register:cap = 3.0, sustain
⅓, register > cap, death permanent) — research-grounded (historical 2.5–4.0
bracket, game-convention 2.5–3×, MT-②), already pinned at L0/research, ports
unchanged, no play needed; (2) **absolute scale** (registerPerPop 1,800) — a
relative choice, internally consistent by construction, not independently
play-critical; (3) **feel / tempo** (does land-loss force a gamble at a fun
pace — not a death spiral, not fizzle) — genuinely L3-only, AND for the duel it
cannot be cheaply L2-substituted because no 1v1 harness board exists yet (that
is the parallel map pass) and the pivot deliberately downgraded L2-bot as a fun
judge (devices on real fun signal only, never L2-bot speculation — memory
`terrain-game-duel-pivot`). MVP discipline: ship research-grounded 가안 as start
values, tune in play — shape sealed, dial a tunable starting guess. A cheap
pre-L3 rung is available at the NUMBERS pass (not this gate, P2 Boundary): an L1
decision-grid ("lose army X + land Y → turns to un-threatening") to catch gross
mis-scaling before play. Registered as the pre-L3 sanity rung.
- **D5.4 — SEALED — surge recruitment + mobilization intensity REPURPOSED:
  pricing LIVE, pressure/aging-clock RETIRED.** The two functions of the Surge
  Draft Model (MT-③) separate cleanly. **LIVE — recruitment pricing:** 동원 강도
  (serving ÷ current register) prices a draft; the surge curve is the integral
  price over intensity (depth) plus commit-point surge (size). Recruitment must
  cost something and must escalate with mobilization depth (else instant-draft to
  the ceiling) — this engine is necessary and ports unchanged. **RETIRED —
  the anti-safe-play / blinds / aging-clock role:** already measured INERT at L2
  (MT-⑤: treasury outgrows the curve, steepening only deepens the freeze), and
  D3.2 explicitly rejected the blinds-clock. The crisis-fuel consumer (CE-⑭) also
  retires with the crisis system (Gate 4). **Hard rule: do NOT re-hire this curve
  for anti-fizzle.** It is not one of D3.2's four structural forces (1v1 /
  mutual-exposure / land-decay / faithful combat), so retiring its pressure role
  touches nothing in D3.2 (safety verified). **In the duel the curve is pricing,
  not binding pressure:** the trailing player is stopped by MONEY (income drop,
  D5.1) before the intensity curve bites — pressure is D5.1+P1, pricing is the
  curve; the split is correct. Numbers (knees 42% / 58%, curve shape, MT-④) are
  realm-internal (mature-state start, fixed by P2 Boundary) and port; whether the
  curve bites at a duel's tempo is L3 feel per the validation-tier note. UX-fix
  candidate (keep): the 동원 강도 meter (DISPLAY-DEBT) — the readable "scraping
  the bottom" face of the pricing engine is good duel texture, retained.
  **L-stamp L1 (structure) / 가안 (numbers).**

---

### Gate 5 — closing summary

All four realm-internal match-arc systems dispositioned in the 1v1 frame:

| Node | System | Verdict |
|---|---|---|
| D5.1 | income + force limit (the decay engine) | **LIVE — already sealed** (OG-① + capLandFrac=1); D3.2's decay lives here, no new device |
| D5.2 | aging constitution P1/P2/P3 | **LIVE**; purpose re-aimed (decision-point clock → land-loss irreversibility); P1 is the buttress under D5.1 |
| D5.3 | conscription register | **LIVE, role narrowed** (multi-war aging clock → finite blood bound + affordability body-min); mechanics unchanged; register is a stock, decay carried by D5.1 |
| D5.4 | surge recruitment + mobilization intensity | **REPURPOSED** — pricing LIVE, pressure/aging/crisis-fuel RETIRED; not re-hired for anti-fizzle |

**Gate 5 headline:** the four systems were minted as ONE aging clock for ONE
retired problem (the frozen world's decision-point trip). In the 1v1 frame the
anti-fizzle decay they were meant to drive is instead delivered by two
already-sealed board-state machines — **income + land-derived force limit (D5.1),
locked in by P1's no-free-healing (D5.2)**. The register (D5.3) survives as the
finite blood bound; the surge/intensity curve (D5.4) survives as recruitment
pricing. Nothing was redesigned (P2 Boundary held); the pass only re-aimed
purpose and named the decay's real home. The compressed-timescale lens bit
exactly where predicted (register aging-clock and surge pressure both go inert in
a duel) and it was harmless — those roles were already spent or explicitly
rejected, and the anti-fizzle load sits on D5.1+P1, not on them. Zero new dials.
All feel/tempo numbers are 가안, tuned in L3 play per the standing frame.

## Gate 6 — turn structure — CLOSED (2026-07-24)

- **D6.1 — SEALED — simultaneous blind commit → simultaneous reveal & resolution.**
  Both realms allocate the whole turn's commitments in secret, lock, then reveal
  and resolve together. = poker (both bet → showdown), not chess (perfect-info
  alternating). Converged from: poker DNA (pivot's founding argument); sealed fog
  contract (forces dark — fog only bites if you commit blind to the enemy's move,
  D1.2 / gate07); "uncertainty duel becomes literal" (SPEC #2 sharpening, survivor
  ADR 0025); D1.3 precedent (simultaneous capital placement → reveal); 1v1 symmetry
  (no first-mover advantage). The gate07 prototype's event tray already embodies
  the reveal (blind commit → close turn → tray shows what the world incl. enemy
  did). **Rider — PvP pacing (user):** human-vs-human uses a TFT-style per-turn
  timer; both choose within the window, both-locked → immediate reveal. The timer
  is a PvP presentation detail only (opponent-agnostic P2: vs-bot needs no timer).
  **L-stamp L0** (shape from convergence; feel = L3).
  - **D6.1a — SEALED (principle) — resolve-order = simultaneous & symmetric; NO
    first-mover asymmetry (2026-07-24, user).** The rule for how two
    simultaneously-revealed plans apply to the board (both armies into the same
    sector, each striking the other's origin/supply, one vacating as the other
    enters). **Principle sealed:** application order introduces NO first-mover
    asymmetry; an overlap is resolved by a SYMMETRIC rule, and where the contact
    point is a battle, P2's per-sector atomic combat adjudicates it. Grounds: the
    logical consequence of D1.3 (symmetry) + D6.1 (simultaneity); poker showdown
    (cards revealed order-free, pot split by rule); 창 산술 (slice-2 ticket 08)
    already gives movement-interception a deterministic, symmetric result.
    **Concrete case enumeration + the resolution algorithm are DEFERRED to L3, and
    (user 2026-07-24) will need their OWN logic / rule-design pass — not mere
    engine wiring:** the real 1v1 map + the actual overlap cases are its inputs.
    Registered as a forward gate below. **L-stamp L0.**

- **Open thread — SHOWDOWN 박진감 (the game's central bet, user-raised 2026-07-23).**
  The reveal (⑤) must deliver visceral thrill / grandeur (명량대첩 feel) or the loop
  has no replay hook — already SPEC Direction, not a new ask. User's sharp argument:
  poker's simple-variance fun needs poker-SPEED, which our turn-based War-sim tempo
  cannot match; and TFT-style battle spectacle is unaffordable (tech stack is not
  graphics-first; a Unity rebuild is a too-big decision, declined for now). So
  simple variance (numbers / territory recolor) alone will not carry fun. Working
  thesis (agent, NOT sealed — feel = L3/proto-only): our drama economy is
  few-and-HEAVY (chess / 명량), not many-and-fast (poker); 박진감 comes from a THIRD
  source — STAKES + ANTICIPATION + LEGIBLE REVERSAL — the source chess.com uses with
  zero animation and zero speed (eval-bar swing = our 판세 bar lurch; check = capital
  threat via mutual-exposure D2.5; terrain-read vindicated = 명량). Graphics AMPLIFY
  drama that already reads; they are not its SOURCE — so a grey-box (graphics-free)
  sequenced reveal is the CORRECT test, not a compromise: heartbeat → bet alive on
  our stack, art later sings; dead → we've cheaply found the Unity/spectacle fork
  BEFORE building. Feeds the Gate 6 match-length node: slow tempo → few turns, each
  an all-in, high drama-density per turn → short match. Next instrument: a throwaway
  showdown-reveal prototype (one authored 명량-shaped fixture, beat-by-beat sequenced
  reveal on the gate07 board, 판세-bar swing, no animation).

- **EVAL BAR (판세-derived) — SEALED as the game's SIGNATURE UI (2026-07-23,
  user+agent).** The showdown-박진감 thread resolves into a concrete decision: the
  primary/symbol UI is an evaluation bar — the read layer's + showdown's feedback
  organ, prioritised ABOVE spectacle graphics (chess.com-shaped product: the bar is
  the free loop's feedback AND the judgment-coach subscription's substrate = the
  product's core artifact, not decoration).
  **Sealed skeleton:**
  - SUBJECTIVE estimate bar (판세 = 형세판단's match-level scalar), NOT an omniscient
    truth bar. An omniscient bar leaks hidden state and kills the fog (D1.2) — the
    fatal trap, explicitly rejected.
  - **Band, not needle:** position (누가 이기나) + WIDTH (얼마나 확실한가). Width = the
    불확실 axis of 형세판단 (ADR 0019) made visible — the axis chess's needle cannot
    have. Lower confidence → wider band.
  - **Width has two parts:** (a) REDUCIBLE — the enemy's existing forces/positions;
    recon spends action to shrink it (the sealed recon economy given a visceral
    "lottery-scratch" skin). (b) IRREDUCIBLE — the enemy's THIS-turn simultaneous
    hidden commit/plan (D1.2 forces dark + D6.1 simultaneous); unscoutable, resolved
    only at the reveal. Poker-exact (narrow the range pre-street; showdown resolves).
  - **Dealer-doesn't-lie preserved (gate07):** the truth is ALWAYS inside the shown
    band. Recon buys precision, never a lie. Scenario-2 "self-deception" is LEGAL
    only as SELF-inflicted misreading of an honest width (player over-weights the
    center/top; truth sits at the low edge) — the system never displays a band
    excluding the truth. Skill = respect the width; bad-beat = you ignored your own
    uncertainty.
  - **Bound to the SOLE win condition:** the position measures capital-win-proximity
    (threat differential), WEIGHTED BY RELEVANCE TO THE CAPITAL OUTCOME — never a flat
    asset/territory/economy SUM (that resurrects the rejected 4X points-scorecard,
    D3.1, and teaches hoarding). Felt framing may be "우세" (intuitive); avoid "총합"
    (implies summing assets — the trap). A big army that cannot threaten his capital
    moves the bar LESS than a modest army at his gate.
  - **Renders 매드무비:** the bar is the INSTRUMENT that makes a from-behind comeback
    legible AS a comeback (visible plunge → strategic recovery). This gives the
    previously-unsolved SPEC "매드무비" (measured NOT-happening in the war-model work,
    memory terrain-game-crisis-design-pass) a concrete home + the replay/retention
    hook. Guardrail: the comeback must read as EARNED (commit-budget edge,
    operation-plan chains, terrain read) not lucky (RNG within the band) — so the
    judgment-coach BM can attribute the win to a move.
  - **Witness-model band — SEALED (2026-07-23, user): "the band jitters but always
    contains the truth."** Each scout is a noisy WITNESS, not a zoom lens: the band's
    CENTER wobbles as it converges (early scouts can mislead), the WIDTH shrinks;
    truth stays inside (dealer honest) but the noisy center prevents pinpointing —
    resolves the leak that a monotonic shrink toward a fixed point would cause. The
    user's two intuitions (moving band + diminishing per-scout info) are one model.
  - **Two bars = TACTICAL / STRATEGIC — leaning-sealed (2026-07-23), SUPERSEDES the
    earlier 창/방패 lean.** Not new: these are two ALREADY-SEALED separate concepts
    (gate07 "판세 격리 ... 커밋류 = 전투 프리뷰 build 04") now visualised as two bars.
    (a) **TACTICAL = 전투 프리뷰 (build 04):** fog-estimated R-ratio (sidePower) of the
    decisive / planned engagement = "win prob of THIS battle"; raw visceral FORCE;
    updates LIVE through the commit flow (커밋량 → verb → target → estimate moves) = the
    EFFICACY organ; at rest = "the decisive battle as it stands" (not empty).
    (b) **STRATEGIC = 판세 (match-level read):** match-win 형세, capital-bound +
    relevance-weighted (anti-hoarding); slow/heavy; the SIGNATURE + 매드무비 gauge; a
    wide READ, not a false-precise %, carrying more IRREDUCIBLE width (keeps comebacks
    alive → retention). **Their VALUE is DIVERGENCE:** over-commit forward → tactical
    UP, strategic DOWN = "winning the fights, losing the war" = mutual-exposure MADE
    VISIBLE (so 창/방패 withdrawn — exposure shows as the GAP + on the map). Each bar
    homes one side of the prior force-vs-capital tension (force→tactical,
    capital→strategic). **Falsifiable check:** if the two bars move together ~always in
    the prototype they are redundant → collapse to one.
  - **RESOLVED — single in-play TACTICAL bar; STRATEGIC verdict → post-game COACH
    (SEALED 2026-07-23, user, fork (A)).** The two-bar idea is superseded — the in-play
    STRATEGIC bar is DROPPED (the falsifiable check fired: it collapsed to the tactical
    one). Reason (agent, user-affirmed): a synthetic "who's winning overall" value
    (a) predicts NO resolvable event (unlike tactical R, which predicts a real
    combat-formula battle), (b) is illegible to the player, (c) recreates the rejected
    4X global-scorecard (D3.1), and (d) COMPUTES THE PLAYER'S JUDGMENT — but 형세판단
    IS the game ("one judgment", SPEC). Resolution:
    · **In-play = ONE bar = TACTICAL R** (signature tool). Sealed premises (user): (1)
      a CONFIDENCE BAND (witness model); (2) computed at an EQUAL-COMMIT baseline + a
      live marker at the player's chosen commit → shows what 행동력 investment buys
      ("equal-commit R here, your-commit R here, threshold there"); (3) operation-plan
      THRESHOLD needles (신중 압박 ~1.1, 포위 섬멸 ~1.92 = 가안) make the catalog
      self-teaching (no tutorial).
    · **In-play strategy = the PLAYER's judgment** — read from the tactical bar + the
      MAP (capital threats / reach cones) + fog. Not a bar.
    · **Strategic verdict → post-game COACH:** "winning at turn 14, then over-committed
      and it flipped" + the 매드무비 clip (coach detects the 형세 swing). **Coach is a
      SEPARATE post-game session/tab, EXCLUDED from live play** (user): a live coach =
      pay-to-win (subscriber sees a verdict a free player does not) → fatal to
      competitive integrity + the chess.com BM. **Governance:** this seals the DESIGN
      (strategic verdict = post-game only); the subscription coach BM that consumes it
      stays PARKED (P2 Boundary) — recorded as its future home, NOT sealed here.
    **L-stamp L1** (shape by argument; formula / visual / name = L3/proto).
  - **No numeric what-if calculator (2026-07-23, user).** The pre-commit read is the
    eval bar + reactive threshold + the BAND-vs-threshold MARGIN — an intuitive "이 정도면
    되겠구나" feel, NOT a spreadsheet. The enemy's hidden plan/commit lives in the grey
    WIDTH (irreducible uncertainty); the player reads MARGIN, not numbers (poker: read the
    range, size the bet). Aligns the casual principle (chess.com-shaped, gate07 Tier-3).
    The prototype's 가정 계산기 (assumed-enemy sliders) is retired for a one-line intuitive
    verdict driven off the bar.
  - **TWO vertical bars — LEFT = clicked front's R, RIGHT = this action's AVERAGE across
    eligible fronts (2026-07-23, user; prototype direction).** Solves the multi-front
    "sloshing": the left (per-engagement) bar is disorienting alone; the RIGHT bar fixes an
    average baseline so the left reads as a MEANINGFUL DEVIATION (this front vs typical =
    "where is the soft spot"). UX: action picked → both show the average (match); click a
    front → only the LEFT moves (diverge) → the gap teaches itself. The average is
    DESCRIPTIVE (objective aggregate of the player's fog-estimated options), NOT predictive
    (not a "will I win the turn" verdict — the killed strategic bar stays killed). Scope =
    공격/방어 (R-shaped); non-combat actions have no R bar. Problem A (equal-commit
    awareness) is SEPARATE — both bars are equal-commit; still needs the "동일 커밋" label +
    the reveal teaching (a bar-truster who under-commits gets reversed by enemy high commit
    = the poker lesson, kept as depth). Retrospection aid (user, not yet built): clicking a
    confirmed action's commit-range on the notch bar re-shows its R at commit time.
  - **Confirm CARD retired → inline 확정 (user 2026-07-24).** Same principle: the bars
    carry the read, so a modal that re-narrates them (verdict text) is redundant. A
    lightweight 확정 button in the commit bar keeps the DELIBERATE confirmation (committing
    행동력 is irreversible) without a modal. The confirm-card content was hollowed out over
    three passes (계산기 → verdict text → gone) — the emptying signalled the card itself.
  - **Free target exploration + notch retrospection (built 2026-07-24, user).** Before 확정,
    the player freely re-clicks eligible sectors and the LEFT bar updates live per sector
    (no lock on first click) — compare against the fixed RIGHT average, then 확정 locks it.
    After confirm, clicking a committed action's commit-notches re-shows that order's R on
    the left bar + an inline 취소 to undo the order. (Fulfils the earlier "action-log
    click" retrospection aid.) The read is: pick action → both bars = average → click
    sectors → left diverges → find the soft spot → 확정.
  **Still OPEN (do NOT seal now — prototype/numbers/L3):** exact NAME (승리근접도 vs a
  우세-flavored word — the game's symbol, user's call); the tactical-R composition
  FORMULA (foggy inputs → position+width); visual treatment.
  **Formal birthplace at cascade = the READ LAYER / 형세판단 (판세) feature docs +
  gate07 read-layer contract, NOT capital/** (single-definition rule) — recorded
  here only as the draft's working checkpoint. **L-stamp L1** (skeleton by argument;
  feel/name/composition = L3/proto).

- **D6.2 — SEALED — turn phase skeleton = three tiers (2026-07-24, user).** A
  turn is not a phase-march; it is one player-agency phase + one payoff phase,
  everything else auto-folded. The confusion in "what the player sees" was
  disambiguated (user) into two axes: RENDERING (①②④⑤ are all drawn on screen)
  vs AGENCY (judgment + click actually required). The skeleton is the AGENCY-axis
  reading, split into three tiers:
  - **Decision tier — ② PLAN & COMMIT:** the SOLE agency phase. The player
    allocates the turn's orders inside the 행동력 budget, blind to the enemy
    (D1.2 / D6.1). Every decision the turn asks for lives here.
  - **Payoff tier — ④ REVEAL → RESOLVE:** input = 0, attention = MAX. The
    showdown stage (박진감, the central bet). **Rider: NOT demotable to the
    background tier** — a future "it's automatic, skip it fast" optimization that
    erases the payoff stage is forbidden; watching IS the payoff (poker showdown).
  - **Background tier — ①⑤ OPEN / FOLD:** pure system processing, rendered but
    passed through. Upkeep / income / recovery / conscription recompute (⑤)
    auto-folds into the reveal's tail — NO separate screen, NO extra click; the
    folded result IS the next turn's opening state (①).
  Rationale: casual 15–30 min (a 4X upkeep/income/production phase-march kills the
  tempo — all decisions collapse into ②); the gate07 prototype already has this
  exact shape (commit bar → 턴 종료 → event tray → "결전 결과가 이번 턴의 정보
  상태가 됐어요"); poker DNA (one betting phase + one showdown, dealer settlement
  automatic between). **L-stamp L0/L1** (skeleton by argument; feel = L3).

- **D6.3 — SEALED — 행동력 = a single chip stack, the one currency for ALL orders
  (2026-07-24, user).** Confirmed poker-identical: one stack, regenerated each turn
  at the same size (non-hoardable, cannot carry over), from which the whole turn's
  orders are allocated — combat, recon, 천도, every command drawn from the SAME
  pool. Chips poured onto a front ARE that engagement's commitment points (P2-fixed
  0–20, M2 lever curve turns them into a quality multiplier).
  - **Spreading the stack weakens each action's RELATIVE RATIO (user's framing).**
    Commitment is not an absolute strength but a RATIO in the confrontation
    (combat's deterministic R-core) — divide the stack across fronts and every
    point thins against a foe who concentrates. So 각개격파 (defeat-in-detail)
    falls out as the M4 convexity emergent (already sealed), and D2.5
    mutual-exposure stays live EVERY turn: a finite single stack is what makes "bet
    big here → naked there" true; a per-order-COUNT budget would not (3 fronts
    could all be maxed → exposure gone).
  - **P2 boundary.** Commitment points (0–20), the lever curve, and the pool
    mechanics (non-hoardable / regenerated / Σ ≤ budget) are P2-fixed and
    untouched; D6.3 only NAMES, at match-frame level, that this one budget is the
    single currency for every order KIND. Already presupposed by 천도 (D1.5) and
    recon (gate07 fog economy). **L-stamp L0/L1**; budget size (가안 20) = L3 feel.

- **D6.4 — SEALED — match length = player-paced to capital fall; target 15–30 min
  (가안, fixed) (2026-07-24, user).** Mostly the consequence of already-sealed
  decisions, named here:
  - **Terminus = capital fall ONLY** (D3.1) — no fixed turn cap, no timeout-draw;
    the match runs until a capital falls, however many turns that takes = inherently
    player-paced.
  - **Target duration = casual 15–30 min** (product constraint, premises). 가안 but
    FIXED. **Change-control (user): moving the 15–30 min target later requires
    concrete DATA (L3 measurement) or a business / SPEC reason — not free tuning.**
  - **What enforces the length = D3.2 land-decay, INDUCED (not a fixed clock).** The
    trailing player's income + force-limit erode each turn, forcing a gamble →
    induces capital capture → the match converges naturally. A hard turn-cap would
    BE a timeout-draw (D3.1, rejected).
  - **Drama economy = few-and-HEAVY** (showdown thread): slow turns, few in number,
    each an all-in, high drama-density per turn (chess / 명량 shape), not
    many-and-fast (poker). This justifies "short match" AS drama, not as a cut-off.
  - **Early-decapitation is NOT a match-length hole (user-raised, resolved at
    Gate 2).** The "trivially crack the enemy capital early" worry is already
    defended EMERGENTLY by D2.3 + D2.5 — guard magnitude needs a big (late-game)
    army to crack; encirclement is multi-turn + border-alarm-visible; a rear capital
    is costly to reach; and D2.5 mutual-exposure means sending the army to
    decapitate undefends your OWN capital (counter-decapitation risk). A forward
    capital cracking earlier is D1.4's CHOSEN risk (leverage vs variance), not a bug.
    The only levers if measured excessive are terrain tuning / guard magnitude
    (가안), never a hard "no fall before turn N" floor. Match-length sits ON TOP of
    that emergent defense and only says "until fall = player-paced."
  - Turn count / real-time-per-turn = 가안, L3. Reference band ONLY (NOT sealed):
    ~1–2 min/turn (commit decision + reveal watch) → 15–30 min ≈ ~15–25 turns; the
    PvP per-turn timer = D6.1 rider. **New dials = 0.** **L-stamp L0** (15–30 min =
    product constraint; drama / tempo feel = L3).

### Gate 6 — closing summary

Gate 6 (turn structure) CLOSED (2026-07-24). All nodes sealed:

| Node | Concern | Verdict |
|---|---|---|
| D6.1 | commit → reveal | **SEALED** — simultaneous blind commit → simultaneous reveal & resolution (poker, not chess); PvP-timer rider |
| D6.1a | resolve-order | **SEALED (principle)** — simultaneous & symmetric, no first-mover asymmetry; concrete rule = its own L3 design pass |
| EVAL BAR | signature UI | **SEALED** — single in-play TACTICAL confidence-band bar; strategic verdict → post-game COACH (live-excluded); name/formula/visual open |
| D6.2 | phase skeleton | **SEALED** — 3 tiers: decision (② plan & commit) / payoff (④ reveal→resolve, non-demotable) / background (①⑤ auto-fold) |
| D6.3 | 행동력 grammar | **SEALED** — single non-hoardable chip stack = the one currency for ALL orders; spreading thins each action's relative ratio (defeat-in-detail emergent) |
| D6.4 | match length | **SEALED** — player-paced to capital fall (D3.1); target 15–30 min (가안, fixed, data/business-gated to change); length induced by D3.2, not clocked |

**Gate 6 headline:** the turn is poker-shaped — one blind-commit betting phase,
one showdown reveal, dealer settlement auto-folded between. 행동력 is the single
chip stack; the eval bar is the signature read/feel organ; the match runs at the
player's pace until a capital falls, its length induced (not clocked) by
land-decay, drama few-and-heavy. **Zero new dials** — every node is a consequence
or a naming of already-sealed structure (D1–D5, combat P2, showdown thread).

**Gate 6 CLOSED → all six duel-pivot design gates are complete.** The deferred
documentation cascade (premises appendix + amend flags) is now unblocked.

## Forward gates captured (NOT this pass — parallel map/terrain pass)

- **Capital-terrain gate.** Because capital-fall feasibility is terrain-emergent
  (D2.4/D2.3), the parallel map pass must author terrains that produce good
  capital-encirclement dynamics. It must decide: chokepoint/corridor count;
  natural-barrier (mountain/river) contribution to interdiction & defense;
  whether **province type** (gate / interior / port …) modulates capital
  defensibility or guard magnitude; forward/rear placement × terrain
  interaction; the 1v1 board's capital-candidate site terrain profiles.
  Connects to premises "new worlds = gate-06 artifacts". Deferred (needs the
  map).
- **Resolve-order design gate (D6.1a → L3).** The symmetric overlap-resolution
  rule sealed in principle at D6.1a needs its OWN logic / rule-design pass at L3,
  not mere engine wiring (user 2026-07-24): enumerate the concrete overlap cases
  (same-sector meeting, mutual origin/supply strike, vacate-as-enter,
  movement-interception edges against the 창 산술 window) and design the symmetric
  adjudication for each on the real 1v1 map. Combat resolution stays P2-fixed; this
  designs the ABOVE-combat application layer. Deferred (needs the map + the wired
  engine).

## Amend flags for the seal batch

- **CP-④** ("capital battle is structurally last" / rump-state-impossible):
  amended reasoning. In 1v1, capital fall = win the instant it happens; a
  forward capital can fall before all land is taken (D1.4 risk). "Rump
  impossible" now holds because the match ends on capital fall (no time for a
  rump to exist), NOT because the capital is physically last.

---

## Status

**Gates 1–6 all CLOSED (2026-07-24).** The six duel-pivot design gates are
complete. Gate 6 sealed D6.1 + D6.1a + D6.2 + D6.3 + D6.4 + the EVAL BAR signature
UI. **The deferred documentation cascade is now UNBLOCKED** (new victory ADR
superseding 0030/0033 + crisis stack 0034/0035/0036, amending 0037/0038,
stale-stamping 0031/0032; SPEC amendment PROPOSAL — Tier 3, user-approved;
DOMAIN_MAP/DESIGN doc-sync ~22 rows; match-arc reseal; `docs/features/capital/`
birthplace CP-② rulings; term-inventory patch + `npm run lint:docs` + QUICKREF
regen). Until it lands, SPEC/DOMAIN_MAP still assert the multi-realm model as
truth — a large, known, recorded sync debt.

This draft IS the Wayfinder "war-termination pass" (the long pole that blocks
L3 Wayfinder gate 08), resolved at a higher altitude by the 1v1 pivot. With duel
gates 1–6 CLOSED, that long pole is cleared — L3 Wayfinder gate 08 is unblocked
(after the cascade lands).
