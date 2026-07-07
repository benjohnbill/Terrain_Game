# Match-Arc Glossary (opened 2026-07-03)

The single reference for every term used in match-arc and
victory-condition design — the layer above battle resolution. Resolution
vocabulary lives in `docs/features/combat-formula/GLOSSARY.md`; terms
confirmed here are later promoted to `DOMAIN_MAP.md`.

Method (inherited from the combat-formula pass): natural-language
definitions are fixed before any numbers are authored. Status per term:
**AGREED** (user-confirmed wording) or **PROPOSED** (draft awaiting
grill).

Each row is **definition + current sealed value + seal stamp** only.
Ruling history — evidence, rejected alternatives, riders — lives in
`RULINGS.md` (rulings ⑧–⑰); rows cite ruling numbers, not their
history. Raw verdict text stages in `mockup/combat-calc/NOTES.md`
§User verdicts.

## Frame decisions recorded this pass

- **Full adjacency, no neutral zones** (AGREED 2026-07-03): every realm
  starts bordering its neighbors; the map is fully partitioned from
  turn 1. There is no exploration/expansion-into-empty-land opening —
  the 30–40 minute envelope has no room for it, and the pressure engine
  (uncertainty duel, ADR 0025) needs live neighbors immediately.
- **Match arc as design budget** (AGREED 2026-07-03): buildup costs,
  war length (8–12 turns), and the hegemony threshold are tuned so one
  player's hand fights ~2–3 wars per match; the match ends at the
  hegemony decision point (settlement concluded). This is a tuning
  target, never a mechanical cap — no rule forbids a fourth war; the
  arithmetic prices it out of the envelope.
- **Realm count 4–6, authoring default 5** (AGREED 2026-07-03): the
  partition is decided by authored terrain cradles (basin, shielded
  valley, plain, coast), and 4–6 is the verification condition on how
  many viable cradles the active region holds — not an imposed cut.
- **Viability parity, mass/geometry asymmetry** (AGREED direction
  2026-07-03, supersedes "near-parity start"): what is balanced is
  survivability, not mass. The map is multipolar Warring-States /
  Three-Kingdoms shaped with one "small 중원": a richer central realm
  that pays in multi-front exposure; periphery realms are smaller but
  shielded and coalition-capable. Whoever takes the center inherits its
  exposure (anti-snowball loop). No realm can be one-war-killed from
  turn 1 without buildup (~1.7+ shield mass ratio is the sizing tool);
  values → scenario battery. The authored asymmetry is the arc's
  opening-move generator: invasion/negotiation frames are designed
  behavior, seeded by the start state.
- **Mature-state start** (PROPOSED direction): realms begin as
  functioning states — fortresses already standing at historical
  chokes, armies raised. A from-zero development opening would spend
  the whole envelope on construction (a legendary fortress alone costs
  ~a third of a match, M5).

## The arc ladder

```
교전 (engagement)   one click, one turn          — resolution layer (combat GLOSSARY)
작전 (operation)    shield-break, siege: 3–6 turns
전쟁 (war)          declaration → settlement: ~8–12 turns
매치 (match)        pre-war standoff → hegemony settlement: 15–25 turns / 30–40 min
```

## Terms

| Term (한국어) | Definition | Status |
|---|---|---|
| 매치 (match) | One complete game. Wall-clock 30–40 minutes (binding target, SPEC); ~15–25 turns (derived estimate). Spans the opening standoff to the hegemony settlement. A match, not a campaign (ADR 0017/0025 positioning). | PROPOSED |
| 매치 아크 (match arc) | The phase curve a match traverses: standoff → buildup → first war → realignment → deciding war → decision point → settlement. One player's hand fights ~2–3 wars per match (design budget, see frame decisions); the world runs more in parallel. | **AGREED** (2026-07-03) |
| 전쟁 (war) | A connected bundle of engagements from declaration to settlement. A war is *decided* by field-army destruction (shield-break → decisive battle → cascade), never by grinding occupation to completion. | PROPOSED |
| 방패 깨기 (shield-break) | The opening operation of a war: reducing the border fortification line that shields a realm's interior (erosion or bypass). The pre-war mass ratio at the shield largely decides the war — the buildup turns are part of the war. | PROPOSED |
| 결전 (decisive battle) | The field engagement that destroys the defender's field army once the shield is open. After it, the interior cascades. | PROPOSED |
| 캐스케이드 (cascade) | The post-decision sweep: ordinary sectors fall in one-turn takes against garrison-only defense. The victory lap that makes winning *felt* — ending grammar must not amputate it. | PROPOSED |
| 결정점 (decision point) | The first moment the irreversibility check opens **settlement negotiation**. The system detects that no remaining realm or coalition can realistically overturn the balance (R arithmetic over remaining mass); the ending itself is a *player decision* — the winner chooses accept-terms or press-on, the loser chooses capitulate or fight-on. The match ends when the hegemony settlement is concluded, not when the math first tips. (Operational definition of SPEC's "matches end at decision points.") | **AGREED** (2026-07-03) |
| 패권 결정점 (hegemony decision point) | The match-ending decision point. Formula (shield-ratio arithmetic, no new physics): **leadership** — the candidate's projectable mass clears the war-deciding shield ratio (~1.7) against every realm still in the balance (rejects the turtle hegemon); AND **unassailability** — no coalition of in-balance realms can reach ~1.7 × the candidate's shield within the regeneration window. Sealed values: shield mass = field army + border-shield garrisons on the fronts FACING the counting side, derived per turn from adjacency (⑨); regeneration window **W = 6 turns** — the coalition side counts current projection + 6 turns of recruitment, leadership takes no W (⑪); ~1.7 validated (⑪). Match-closure lever = **cap growth through conquest/development** — structure owned by M13 (`../combat-formula/MAGNITUDE.md`) (⑮); map-authoring constraint: an all-cap start must not satisfy leadership for any seat (⑰). The system trips on true values; players read a banded 판세 estimate. History: `RULINGS.md` ⑨⑪⑮⑰. | **AGREED** (2026-07-04; values sealed 2026-07-05, rulings ⑨⑪⑮⑰) |
| 투사 가능 질량 (projectable mass) | The mass a realm can actually deliver to fronts beyond its own shield — a derived reading of the real army through the realm's geography (exit-choke frontage caps M11 + route graph), never a stored variable (M4 escape-state doctrine). Sealed formula: **projectable = min(field army, Σ exit-door width × 2)**. Chokes narrow doors both ways: the unbreakable are usually also unable to march out. History: `RULINGS.md` ⑩. | **AGREED** (2026-07-04; formula sealed 2026-07-05, ruling ⑩) |
| 판세 안/밖 · 은둔국 조항 (in/out of the balance — hermit clause) | A realm whose projectable mass falls below the floor (reuse the raid visibility threshold, ≤1,000 — values → battery) is **outside the balance**: excluded from coalition sums and from the leadership denominator. Derived per turn — a hermit can buy back in via choke-removal paths (port staging, naval control). At the hegemony settlement, out-of-balance realms are *acknowledged* (tributary/hermit narrative), never forced to capitulate — the match ends without requiring 100% of the map. A projecting-but-unbreakable realm stays in the balance and legitimately blocks the decision point (Parthia pattern). | **AGREED** (2026-07-04) |
| 정산 (settlement) | The procedure converting a decided war into gains **without** occupation grinding. Annexation arrives through settlement, not sector-by-sector conquest. Two levels: **전쟁 정산** (ends one war) and **패권 정산** (concludes the match). Settlement-acquired territory arrives *alive* (undamaged usable value — vs conquest damage + M6 inheritance cost); the friction saved (blood, turns, damage) is the trade surplus, split naturally — no discount dial exists. MVP scope: no free negotiation — three presets as a claim-rate ladder over the composite reach value: **관대 50%** (indemnity-first fill; the tempo-peace preset — its product is acceptance certainty), **표준 75%** (cession-first fill), **최대 100%**; claim rate = rejection risk. Bluffing and free terms → Phase 2 diplomacy. History: `RULINGS.md` ⑧⑬. | **AGREED** (2026-07-04; ladder sealed 2026-07-05, rulings ⑧⑬) |
| 정산 통화 (settlement currencies) | MVP menu of three: **할양** (cession — named sectors, undamaged, ceiling = occupation-reach value), **배상** (indemnity — one-time economy transfer, ceiling = loot value of *raid* reach per M8's 50% rule: "못 잡아도 태울 수 있으면 돈은 나온다"), **복속** (vassalage — realm survives subordinated; a separately-priced distinct option available only when the capital is within reach, never a Maximum replacement; its value lives in the hegemony arithmetic — coalition-pool transfer to the overlord — not the reach arithmetic). Each currency is bounded by its OWN ceiling; **composite reach value := occupation-reach value + raid-reach loot value** — 최대 claims 100% of the composite, never "100%+100%" of an undefined single budget. Deferred to Phase 2: demilitarization, route access (both need enforcement machinery). History: `RULINGS.md` ⑭. | **AGREED** (2026-07-04; composite clarified + 복속 decoupled 2026-07-05, ruling ⑭) |
| 도달권 (reach) | The closed-form price base of every settlement — never a runtime simulation. **점령 도달권** (occupation reach): sectors the winner's armies could take before meaningful resistance re-forms — route graph from army positions, stopped by intact shield lines, bounded by the regeneration window (M12). **약탈 도달권** (raid reach): the wider zone reachable by sub-threshold raiding (bypasses shields, M8). Demands beyond reach → deterministic refusal, war resumes (임진왜란 강화 결렬 pattern); reach is recomputed at suing time. Briefing form: "칼이 닿는 곳까지가 청구서다 — 점령의 칼은 땅을, 약탈의 칼은 돈을, 수도에 닿은 칼은 무릎을 청구한다." | **AGREED** (2026-07-04) |
| 수락 산술 (acceptance arithmetic) | Loser-AI accepts a bundle iff bundle value ≤ its continued-war expected loss × personality coefficient — computed on **true values**, deterministic (no dice). Continued-war expected loss carries a **resistance discount ×0.6** (⑫). The coefficient (완고/실리/유화) is drawn per-realm at match start from a narrow band per ADR 0025 tendency (deterministic within a match, a range across matches): anchors 완고 0.8 / 실리 1.0 / 유화 1.2, draw band = anchor ±0.05 (non-overlapping classes so temperament is learnable across matches). A player-loser decides freely (the loser-side decision point). The settlement card shows per-bundle acceptance outlook as a *band* — the player predicts through fog though the AI decides deterministically (tension without dice, same structure as the hegemony check); that band's tension is carried by the expected-continued-war-loss fog, not coefficient uncertainty (⑫ fog rider). **Deferred with trigger**: fogged-read acceptance + bluffing ships with Phase 2 free negotiation; pull earlier iff playtest shows settlement reads as a solved/flat problem. History: `RULINGS.md` ⑫. | **AGREED** (2026-07-04; discount + anchors sealed 2026-07-05, ruling ⑫) |
| 복속 (vassalage / capitulation) | A settlement outcome: the losing realm survives diminished and subordinated; its mass leaves the coalition pool and counts to the **overlord's** side of the hegemony arithmetic. Choosing capitulation over a fight to the capital must be the losing player's own decision (surrender grammar). MVP terms: (1) **no defection within the match** — betrayal/autonomy machinery is Phase 2's reserved seat; (2) **chain collapse** — if the overlord falls (capital taken, itself vassalized, eliminated), all its vassals release immediately (derived from existing events, zero new state); (3) **the vassal seat keeps full internal sovereignty** — command pool, recruitment, building, defense, situation judgment (the pool is realm-size-independent, so the seat plays a complete per-turn game); it loses only external strategic freedom (mass counts to the overlord; cannot join coalitions against the overlord) — the 부마국 autonomy model; (4) **substance–sovereignty exchange axis** — 할양 trades substance to keep sovereignty, 복속 trades sovereignty to keep substance; Phase 2 betrayal lowers vassalage's sovereignty price along this axis, by design; (5) **pricing**: in acceptance currency, vassal bundle = standard-preset material + **sovereignty premium (주권 프리미엄) 0.25** × loser remaining value (structure ⑭, premium ⑯). History: `RULINGS.md` ⑭⑯. | **AGREED** (2026-07-05, rulings ⑭⑯) |
| 모병 (recruitment) | The single MVP economy→mass conversion: a primary action adding +10% of the national sustainable cap per turn, drawn from the manpower pool, paid from treasury yield, fighting at **100%** (single troop quality — a discounted levy tier would reopen the sealed quality=1 simplification). The temporary-levy track (공세 동원, ADR 0009 role 3) is a **reserved seat** with three reopen triggers: quality/tech system arrives; Phase 3 domestic (unrest hooks); playtest shows the buildup phase reads flat. Force-adjustment stack: ① recruitment (create, player) / ② garrison regeneration to local caps (automatic, ADR 0014) / ③ standing-force stationing (deploy, player) / ④ commit lever + reserve (activate, per-turn) — the player hand-manages only ① and ③. | **AGREED** (2026-07-04) |
| 인력 풀 (manpower pool) | Per-province latent manpower (ADR 0009 role 4), **finite within a match**: the dead leave it permanently, the dispersed return, settlement-inherited land arrives pool-intact (M6 inheritance made literal). Blood becomes a permanent match currency — closes the blood-economy coupling gap flagged at M3; generational regrowth is ~0 inside 25 turns. UI owes one line: pool remaining. Values → battery. | **AGREED** (2026-07-04) |
| 블라인드 (blinds) | The escalation device that makes safe, passive play progressively more expensive as the match ages — the anti-safe-play pressure ADR 0025 parked into this thread. Mechanism undecided. **L2 negative-space evidence (2026-07-05, sheet 12): the perfect-information board freezes into deterrence equilibrium without an attack-inducement placeholder — blinds' design duty is confirmed load-bearing; acceptance test registered in `TEST-LADDER.md`.** **L2 real-map quantification (2026-07-07, sheet 15 + freeze autopsy — `mockup/combat-calc/NOTES.md`): on the sealed parity map ~58% of matches are frozen at bot-grade play (turn-ceiling-invariant); binding constraint = the leadership bar against a HEALED rival (healing outruns wounding, median shortfall 4,500명 at full-cap symmetry); A-3 cap growth alone does not unfreeze (22→24%). User promoted blinds design ahead of force-geography (impact-first ruling, 2026-07-07).** | PROPOSED |
| test-trust ladder (검증 신뢰 사다리) | Promoted to Tier 0 (`DOMAIN_MAP.md`, 2026-07-05 doc-sync batch — born here, needed by combat-formula batteries and root docs). Full charter: `TEST-LADDER.md`. | **AGREED** (2026-07-05, promoted same day) |

## UI surface direction (AGREED direction 2026-07-04; pixel spec deferred to implementation)

Hegemony information is a match-level assembly of existing v5 grammar,
never a new dashboard: (1) a 판세 **map lens** tinting realms by
overturn relation (역전권 안/밖/판세 밖); (2) a **summoned card**
(지목→소환) showing the worked line — coalition mass band / required
mass (shield × 1.7) / regeneration window — each term decomposable,
with one briefing-officer sentence; (3) a conditional **forecast-card
line** when a war is potentially decisive ("결정 전쟁 후보"), and the
mirrored threat-axis warning with the remaining overturn window.
Anti-pattern (banned): a persistent hegemony progress bar — 판세 is
summoned, never resident. The system trips on truth; the player's
gauge is a band; scouting sharpens the match-level read.

Added 2026-07-05 (user decision): **projectable-mass legibility** —
the player must be able to read their own 투사 가능 질량, and drifting
below the out-of-balance floor must never be a silent surprise (a
warning surface when approaching hermit status; "only those who can
march out hold a veto over the ending" is a rule the UI must teach).
Display shape TBD (summoned-card line or map-lens treatment).

Added 2026-07-05 (A-2 session, user decisions — both summoned, never
resident; display-debts, post-B-map):

- **Expansion break-even card**: a fog-banded estimate of whether a
  conquest pays — value side (target pool/yield via reach arithmetic)
  vs cost side (new front length + new neighbors' facing strength
  under the facing-front shield reading). Scouting narrows the band
  (border strength is a stable scoutable target; field-army location
  is a lucky catch) — scouting buys the break-even read, not just map
  fill. Worked line, never a verdict (ADR 0024).
- **Hegemony work-list card**: when the decision-point check fails,
  the summoned card names WHICH realm's open future blocks the trip
  and the closing means (vassalage / pool destruction / conquest) —
  the system calls for the hegemon's action instead of predicting it.

## Open questions (grill queue)

1. ~~Realm count per match~~ — resolved: 4–6, default 5 (frame decisions).
2. ~~Full-runtime fun audit~~ — resolved: timeline sheet (battery sheet 8),
   23 turns / 35–46 min; findings routed (AI-vs-AI wars → MVP AI
   requirement; turn-time budget is the binding hinge).
3. ~~Irreversibility check~~ — resolved: shield-ratio arithmetic +
   hermit clause (see 패권 결정점 / 투사 가능 질량 rows); values → battery.
4. Settlement: ~~currencies~~ ~~pricing~~ ~~acceptance arithmetic~~ —
   structure fully resolved 2026-07-05 (A-1 ruling ⑧, Codex-consulted:
   coefficient anchors, preset claim-rate ladder, composite reach
   definition, vassalage decoupling — see 정산/정산 통화/수락 산술
   rows); numeric values → battery sheet 11. Strategy-space map
   adopted → `STRATEGY-SPACE.md` (the dial checklist).
5. Blinds mechanism. Now also owns the bipolar-stalemate ending (two
   mutually unbreakable powers never trip leadership — C ends tilted
   matches, blinds must end untilted ones).
6. Loser-side experience between "decided" and "settled."
7. Terrain-cradle partition authoring (which cradle archetypes, center
   sizing so it is rich but not Ming-grade dominant). **Two sizing
   constraints sealed 2026-07-05 (ruling ⑰, sheet 12):** (a) an
   all-cap start state must NOT satisfy leadership for any seat (the
   raw sheet-10 board tripped at T2 for the center — authoring must
   verify before play); (b) small/hermit seats' L2 losing record is
   ACCEPTED for MVP (their win paths live in the L2 placeholder list —
   `TEST-LADDER.md` reading rule); no compensator now, standing L3
   playtest watch.
8. AI-vs-AI wars as mid-match content (timeline finding ②) — promote to
   MVP AI requirement alongside ADR 0025 personalities. **Confirmed
   LOAD-BEARING by sheet 12 (2026-07-05): with every bot requiring the
   ~1.7 pre-war ratio on true values, a viability-parity board freezes
   after the small realm is digested — no peer war launches, no match
   ends.** War appetite needs a designed rule (fog misreads +
   opportunism reads + blinds pressure are the candidates); the
   harness placeholders are named in `TEST-LADDER.md`. **Disposition
   sealed 2026-07-06 (A-4 B4):** this gap plus six further prototype
   spec gaps (two-front allocation, attacking-a-vassal semantics,
   settlement initiative, stalled-war exit, truce/redeclaration, front
   redraw after cession) are routed to owning feature + B-design phase
   in `RULINGS.md` §SPEC_GAPS disposition — all seven defer to B, none
   authored as paper rules (indemnity spend, the eighth, was paid by
   M14). See that record before designing any of them.
9. **Showdown staging (UX requirement, registered 2026-07-04)**: the
   resolution moment must dramatically reveal "my read vs what was
   actually there" — this single surface carries both the highlight-reel
   feel (poker showdown, not RTS spectacle) and ADR 0021 loss-as-lesson.
10. PVP debts (future, do-not-block): kingmaking in 4–6 FFA;
    eliminated-player boredom — candidate answer: capitulated players
    keep playing the vassal seat. Core loop is PVP-native by
    construction (simultaneous commitment, deterministic, 30–40 min).
    Vassal-seat riders (user, 2026-07-05): the seat must carry
    win-adjacent goals (survival, the chain-collapse liberation
    horizon, kingmaker weight) or losing players just quit; a losing
    player *choosing* the winning side via vassalage ("serve one
    overlord, use the autonomy, win together") is a legitimate fun
    hypothesis, not merely a consolation state; and how much command
    the overlord can impose on a vassal (주군-봉신 relationship —
    also pre-war voluntary submission) opens the diplomacy/internal-
    affairs domain → Phase 2, registered.
11. Playtest question list (anxieties → hypotheses): does showdown
    staging create clip desire; does the realignment stretch sag; does
    archetype identity form within ~3 matches; do players re-queue
    after a loss; do both legitimate ending shapes occur and read well
    (registered 2026-07-05) — (a) exhaustion winner: the world
    impoverished by war, a relative advantage trips the check; (b)
    standoff → decisive battle: a long watchful balance ended by 1–2
    huge engagements (적벽 pattern). Both failure tails (untilted
    mutual poverty that never trips; a standoff that eats the
    envelope) point at the blinds design (queue 5).
