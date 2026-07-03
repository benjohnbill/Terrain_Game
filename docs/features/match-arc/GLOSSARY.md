# Match-Arc Glossary (opened 2026-07-03)

The single reference for every term used in match-arc and
victory-condition design — the layer above battle resolution. Resolution
vocabulary lives in `docs/features/combat-formula/GLOSSARY.md`; terms
confirmed here are later promoted to `DOMAIN_MAP.md`.

Method (inherited from the combat-formula pass): natural-language
definitions are fixed before any numbers are authored. Status per term:
**AGREED** (user-confirmed wording) or **PROPOSED** (draft awaiting
grill).

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
| 패권 결정점 (hegemony decision point) | The match-ending decision point. Formula (shield-ratio arithmetic, no new physics): **leadership** — the candidate's projectable mass clears the war-deciding shield ratio (~1.7) against every realm still in the balance (rejects the turtle hegemon); AND **unassailability** — no coalition of in-balance realms can reach ~1.7 × the candidate's shield within the regeneration window. The system trips on true values; players read it as a banded 판세 estimate. | **AGREED** shape (2026-07-04); values → battery |
| 투사 가능 질량 (projectable mass) | The mass a realm can actually deliver to fronts beyond its own shield — derived from exit-choke frontage caps (M11) and the route graph. A derived check, never a stored variable (M4 escape-state doctrine). Chokes narrow doors both ways: the unbreakable are usually also unable to march out. | **AGREED** (2026-07-04) |
| 판세 안/밖 · 은둔국 조항 (in/out of the balance — hermit clause) | A realm whose projectable mass falls below the floor (reuse the raid visibility threshold, ≤1,000 — values → battery) is **outside the balance**: excluded from coalition sums and from the leadership denominator. Derived per turn — a hermit can buy back in via choke-removal paths (port staging, naval control). At the hegemony settlement, out-of-balance realms are *acknowledged* (tributary/hermit narrative), never forced to capitulate — the match ends without requiring 100% of the map. A projecting-but-unbreakable realm stays in the balance and legitimately blocks the decision point (Parthia pattern). | **AGREED** (2026-07-04) |
| 정산 (settlement) | The procedure converting a decided war into gains **without** occupation grinding. Annexation arrives through settlement, not sector-by-sector conquest. Two levels: **전쟁 정산** (ends one war) and **패권 정산** (concludes the match). Settlement-acquired territory arrives *alive* (undamaged usable value — vs conquest damage + M6 inheritance cost); the friction saved (blood, turns, damage) is the trade surplus, split naturally — no discount dial exists. MVP scope: no free negotiation — 2–3 preset bundles auto-priced by the reach arithmetic (관대/표준/최대); bluffing and free terms → Phase 2 diplomacy. | **AGREED** (2026-07-04) |
| 정산 통화 (settlement currencies) | MVP menu of three: **할양** (cession — named sectors, undamaged, ceiling = occupation reach), **배상** (indemnity — one-time economy transfer, ceiling = loot value of *raid* reach per M8's 50% rule: "못 잡아도 태울 수 있으면 돈은 나온다"), **복속** (vassalage — realm survives subordinated, its mass leaves the coalition pool and counts to the winner's side of the hegemony arithmetic; available only when the capital is within reach). Deferred to Phase 2: demilitarization, route access (both need enforcement machinery). Mixed-bundle total value ≤ reach value. | **AGREED** (2026-07-04) |
| 도달권 (reach) | The closed-form price base of every settlement — never a runtime simulation. **점령 도달권** (occupation reach): sectors the winner's armies could take before meaningful resistance re-forms — route graph from army positions, stopped by intact shield lines, bounded by the regeneration window (M12). **약탈 도달권** (raid reach): the wider zone reachable by sub-threshold raiding (bypasses shields, M8). Demands beyond reach → deterministic refusal, war resumes (임진왜란 강화 결렬 pattern); reach is recomputed at suing time. Briefing form: "칼이 닿는 곳까지가 청구서다 — 점령의 칼은 땅을, 약탈의 칼은 돈을, 수도에 닿은 칼은 무릎을 청구한다." | **AGREED** (2026-07-04) |
| 수락 산술 (acceptance arithmetic) | Loser-AI accepts a bundle iff bundle value ≤ its continued-war expected loss × personality coefficient — computed on **true values**, deterministic (no dice). The coefficient (완고/실리/유화) is drawn per-realm at match start from a narrow band per ADR 0025 tendency (deterministic within a match, a range across matches). A player-loser decides freely (the loser-side decision point). The settlement card shows per-bundle acceptance outlook as a *band* (player predicts through fog even though the AI decides deterministically — tension without dice, same structure as the hegemony check). **Deferred with trigger**: fogged-read acceptance + bluffing ships with Phase 2 free negotiation; pull earlier iff playtest shows settlement reads as a solved/flat problem. | **AGREED** (2026-07-04) |
| 복속 (capitulation) | A settlement outcome: the losing realm survives diminished, counted on the loser's side of the hegemony judgment. The loser-side decision point — choosing capitulation over a fight to the capital — must be the losing player's own decision (surrender grammar). | PROPOSED |
| 모병 (recruitment) | The single MVP economy→mass conversion: a primary action adding +10% of the national sustainable cap per turn, drawn from the manpower pool, paid from treasury yield, fighting at **100%** (single troop quality — a discounted levy tier would reopen the sealed quality=1 simplification). The temporary-levy track (공세 동원, ADR 0009 role 3) is a **reserved seat** with three reopen triggers: quality/tech system arrives; Phase 3 domestic (unrest hooks); playtest shows the buildup phase reads flat. Force-adjustment stack: ① recruitment (create, player) / ② garrison regeneration to local caps (automatic, ADR 0014) / ③ standing-force stationing (deploy, player) / ④ commit lever + reserve (activate, per-turn) — the player hand-manages only ① and ③. | **AGREED** (2026-07-04) |
| 인력 풀 (manpower pool) | Per-province latent manpower (ADR 0009 role 4), **finite within a match**: the dead leave it permanently, the dispersed return, settlement-inherited land arrives pool-intact (M6 inheritance made literal). Blood becomes a permanent match currency — closes the blood-economy coupling gap flagged at M3; generational regrowth is ~0 inside 25 turns. UI owes one line: pool remaining. Values → battery. | **AGREED** (2026-07-04) |
| 블라인드 (blinds) | The escalation device that makes safe, passive play progressively more expensive as the match ages — the anti-safe-play pressure ADR 0025 parked into this thread. Mechanism undecided. | PROPOSED |

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

## Open questions (grill queue)

1. ~~Realm count per match~~ — resolved: 4–6, default 5 (frame decisions).
2. ~~Full-runtime fun audit~~ — resolved: timeline sheet (battery sheet 8),
   23 turns / 35–46 min; findings routed (AI-vs-AI wars → MVP AI
   requirement; turn-time budget is the binding hinge).
3. ~~Irreversibility check~~ — resolved: shield-ratio arithmetic +
   hermit clause (see 패권 결정점 / 투사 가능 질량 rows); values → battery.
4. Settlement: ~~currencies~~ ~~pricing~~ resolved (see 정산/정산 통화/
   도달권 rows); **acceptance arithmetic** (③ — true values vs fogged
   reads, personality modifiers) — **current**. Strategy-space map
   adopted → `STRATEGY-SPACE.md` (the dial checklist).
5. Blinds mechanism. Now also owns the bipolar-stalemate ending (two
   mutually unbreakable powers never trip leadership — C ends tilted
   matches, blinds must end untilted ones).
6. Loser-side experience between "decided" and "settled."
7. Terrain-cradle partition authoring (which cradle archetypes, center
   sizing so it is rich but not Ming-grade dominant).
8. AI-vs-AI wars as mid-match content (timeline finding ②) — promote to
   MVP AI requirement alongside ADR 0025 personalities.
9. **Showdown staging (UX requirement, registered 2026-07-04)**: the
   resolution moment must dramatically reveal "my read vs what was
   actually there" — this single surface carries both the highlight-reel
   feel (poker showdown, not RTS spectacle) and ADR 0021 loss-as-lesson.
10. PVP debts (future, do-not-block): kingmaking in 4–6 FFA;
    eliminated-player boredom — candidate answer: capitulated players
    keep playing the vassal seat. Core loop is PVP-native by
    construction (simultaneous commitment, deterministic, 30–40 min).
11. Playtest question list (anxieties → hypotheses): does showdown
    staging create clip desire; does the realignment stretch sag; does
    archetype identity form within ~3 matches; do players re-queue
    after a loss.
