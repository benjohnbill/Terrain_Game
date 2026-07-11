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
- **Viability parity, geometry/economy asymmetry** (AGREED direction
  2026-07-03; parity v5 2026-07-07 deleted the earlier mass edge): what
  is balanced is survivability AND starting population — every realm
  starts equal in playable state (SPEC Core Principle #8 "Derived
  asymmetry"; terrain-cradle TC-①/TC-⑭). The map is multipolar
  Warring-States / Three-Kingdoms shaped with one multi-front 중원 center
  whose crown is economic only (traffic centrality + economic stamina,
  TC-②/③) and pays in multi-front exposure; periphery realms are
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
| 정산 (settlement) | The procedure converting a decided war into gains **without** occupation grinding. Annexation arrives through settlement, not sector-by-sector conquest. Two levels: **전쟁 정산** (ends one war) and **패권 정산** (concludes the match). Settlement-acquired territory arrives *undamaged* (no scorch or conquest damage — vs conquest damage + M6 inheritance cost) but integrates on the same usable-ripening lag as all acquired land (ADR 0029, sealed 2026-07-11); the friction saved (blood, turns, damage) is the trade surplus, split naturally — no discount dial exists. MVP scope: no free negotiation — three presets as a claim-rate ladder over the composite reach value: **관대 50%** (indemnity-first fill; the tempo-peace preset — its product is acceptance certainty), **표준 75%** (cession-first fill), **최대 100%**; claim rate = rejection risk. Bluffing and free terms → Phase 2 diplomacy. History: `RULINGS.md` ⑧⑬. | **AGREED** (2026-07-04; ladder sealed 2026-07-05, rulings ⑧⑬) |
| 정산 통화 (settlement currencies) | MVP menu of three: **할양** (cession — named sectors, undamaged, ceiling = occupation-reach value), **배상** (indemnity — one-time economy transfer, ceiling = loot value of *raid* reach per M8's 50% rule: "못 잡아도 태울 수 있으면 돈은 나온다"), **복속** (vassalage — realm survives subordinated; a separately-priced distinct option available only when the capital is within reach, never a Maximum replacement; its value lives in the hegemony arithmetic — coalition-pool transfer to the overlord — not the reach arithmetic). Each currency is bounded by its OWN ceiling; **composite reach value := occupation-reach value + raid-reach loot value** — 최대 claims 100% of the composite, never "100%+100%" of an undefined single budget. Deferred to Phase 2: demilitarization, route access (both need enforcement machinery). History: `RULINGS.md` ⑭. | **AGREED** (2026-07-04; composite clarified + 복속 decoupled 2026-07-05, ruling ⑭) |
| 도달권 (reach) | The closed-form price base of every settlement — never a runtime simulation. **점령 도달권** (occupation reach): sectors the winner's armies could take before meaningful resistance re-forms — route graph from army positions, stopped by intact shield lines, bounded by the regeneration window (M12). **약탈 도달권** (raid reach): the wider zone reachable by sub-threshold raiding (bypasses shields, M8). Demands beyond reach → deterministic refusal, war resumes (임진왜란 강화 결렬 pattern); reach is recomputed at suing time. Briefing form: "칼이 닿는 곳까지가 청구서다 — 점령의 칼은 땅을, 약탈의 칼은 돈을, 수도에 닿은 칼은 무릎을 청구한다." | **AGREED** (2026-07-04) |
| 수락 산술 (acceptance arithmetic) | Loser-AI accepts a bundle iff bundle value ≤ its continued-war expected loss × personality coefficient — computed on **true values**, deterministic (no dice). Continued-war expected loss carries a **resistance discount ×0.6** (⑫). The coefficient (완고/실리/유화) is drawn per-realm at match start from a narrow band per ADR 0025 tendency (deterministic within a match, a range across matches): anchors 완고 0.8 / 실리 1.0 / 유화 1.2, draw band = anchor ±0.05 (non-overlapping classes so temperament is learnable across matches). A player-loser decides freely (the loser-side decision point). The settlement card shows per-bundle acceptance outlook as a *band* — the player predicts through fog though the AI decides deterministically (tension without dice, same structure as the hegemony check); that band's tension is carried by the expected-continued-war-loss fog, not coefficient uncertainty (⑫ fog rider). **Deferred with trigger**: fogged-read acceptance + bluffing ships with Phase 2 free negotiation; pull earlier iff playtest shows settlement reads as a solved/flat problem. History: `RULINGS.md` ⑫. | **AGREED** (2026-07-04; discount + anchors sealed 2026-07-05, ruling ⑫) |
| 복속 (vassalage / capitulation) | A settlement outcome: the losing realm survives diminished and subordinated; its mass leaves the coalition pool and counts to the **overlord's** side of the hegemony arithmetic. Choosing capitulation over a fight to the capital must be the losing player's own decision (surrender grammar). MVP terms: (1) **no defection within the match** — betrayal/autonomy machinery is Phase 2's reserved seat; (2) **chain collapse** — if the overlord falls (capital taken, itself vassalized, eliminated), all its vassals release immediately (derived from existing events, zero new state); (3) **the vassal seat keeps full internal sovereignty** — command pool, recruitment, building, defense, situation judgment (the pool is realm-size-independent, so the seat plays a complete per-turn game); it loses only external strategic freedom (mass counts to the overlord; cannot join coalitions against the overlord) — the 부마국 autonomy model; (4) **substance–sovereignty exchange axis** — 할양 trades substance to keep sovereignty, 복속 trades sovereignty to keep substance; Phase 2 betrayal lowers vassalage's sovereignty price along this axis, by design; (5) **pricing**: in acceptance currency, vassal bundle = standard-preset material + **sovereignty premium (주권 프리미엄) 0.25** × loser remaining value (structure ⑭, premium ⑯). History: `RULINGS.md` ⑭⑯. | **AGREED** (2026-07-05, rulings ⑭⑯) |
| 모병 (recruitment) | The single MVP economy→mass conversion: a primary action moving bodies from the 징집 명부 into serving status toward the force limit (구칭 national cap), paid from treasury yield, fighting at **100%** (single troop quality — a discounted levy tier would reopen the sealed quality=1 simplification). **Priced by the 서지 모병 model (MT-③), not a flat +10%**: the flat "+10% of cap/turn at 0.5 yield" is now the Band-1 base; unit price escalates with 동원 강도 and the draft may be surged with commit points. The temporary-levy track (공세 동원, ADR 0009 role 3) is a **reserved seat** (triggers: quality/tech system; Phase 3 domestic; flat-buildup playtest signal). Force-adjustment stack: ① recruitment (create, player) / ② garrison regeneration to local caps (**now bills the register + treasury — P1 dual billing, MT-①; amends ADR 0014 free auto-regen**) / ③ standing-force stationing (deploy, player) / ④ commit lever + reserve (activate, per-turn) — the player hand-manages only ① and ③. History: RULINGS MT-①/③. | **AGREED** (2026-07-04; re-cut 2026-07-07 MT-①/③) |
| 징집 명부 (conscription register · 구칭 인력 풀 / manpower pool) | "군사력이 될 수 있는 모든 신체 인구" — the total living draftable bodies a realm holds, **land-derived and finite within a match**: 명부 = registerPerPop × Σ populationValue (per province, at match start; value MAGNITUDE M13). **Total-bodies accounting**: the starting army is already drawn from it; recruitment moves bodies civilian→serving (register unchanged); only **death** shrinks it (the dispersed return; the dead never do — blood is a permanent currency). Land transfer moves it (settlement land arrives register-intact); development grows it via the same formula. capPerPop 600 is the derived sibling constant — the **sustain fraction ⅓** (a third of the register can serve at once). Supersedes "1.5 × initial military" (MT-②). UI owes: register remaining + 동원 강도 meter. | **AGREED** (2026-07-04; re-founded 2026-07-07 MT-②) |
| 노화 헌법 (aging constitution) | Three principles governing how a match accrues irreversibility so the decision point can arrive (the fix for 억지 평형). **P1 dual billing**: replenishing men (recruit + garrison regen) bills blood (register, permanent) + yield (flow); no free healing. **P2 flow never ages**: economy sets healing SPEED only, permanent damage only via identity acts (초토화); blood→economy coupling rejected at match scale. **P3 snapshot information**: contact reveals the immutable layer forever, the mutable layer decays (re-scout costs action). History + grounds + parked items (피폐 문턱 → Phase 2): RULINGS MT-①. | **AGREED** (2026-07-07 MT-①) |
| 동원 강도 (mobilization intensity) | serving ÷ current register — the state variable that prices a draft. A bled realm (smaller denominator) reads at higher intensity for the same army, so its next draft costs more (Marie-Louise "scraping the bottom", emergent). Drives the continuous price curve of 서지 모병; also the aging clock's face (as registers shrink, intensity climbs, blood dearer). Sealed coordinates: start ≈ 42%, structural max ≈ 58% (MT-④). | **AGREED-structure 2026-07-07 MT-③ (curve numbers 가안)** |
| 서지 모병 (Surge Draft Model) | Dynamic pricing of the recruit primary on two axes. **Depth**: unit price = a continuous piecewise-linear marginal curve over 동원 강도; a draft's bill = the AREA under the curve pre→post intensity (integral pricing — no cliffs). Named zones (평시/전시/총동원/최후 동원, 가안) overlay for narration + the M10 leak only, no arithmetic. **Size**: surge with surplus commit points (one-shot, no standing drain — M1/M2 untouched). Garrison regen pays the same curve (P1). Desperation is emergent, not gated. Rejected: a decree ladder with standing commit upkeep (re-opens M1/M2). Knees, multipliers, surge rate → magnitude session. History: RULINGS MT-③; UI: DISPLAY-DEBT. | **AGREED-structure 2026-07-07 MT-③ (numbers deferred)** |
| 블라인드 (blinds) | The escalation device that makes safe, passive play progressively more expensive as the match ages — the anti-safe-play pressure ADR 0025 parked into this thread. **L2 negative-space evidence (2026-07-05, sheet 12): the perfect-information board freezes into deterrence equilibrium; blinds' design duty confirmed load-bearing.** **RESOLVED as an economic device by L2 (2026-07-08, MT-⑤ — `mockup/combat-calc/NOTES.md`): the blind is not a separate mechanism but the desperation tail of the Surge Draft Model (MT-③); wired (Option B, integral pricing) it is INERT (treasury grows across a match, curve never bites) and steepening it deepens the freeze. The freeze is a multipolar standoff, NOT economic aging — 99% of frozen matches fail the leadership gate (median 48% projection shortfall). The economic-blinds hypothesis is spent.** Freeze root re-diagnosed to two non-economic axes: **force-geography** (uniform `walls` is an artifact doubling the freeze; defense must vary per border, terrain-bound — un-parked as the next pass's spine) and the **hegemony bar** (the ~80% residual: is leadership reachable among balanced realms on a parity map). | SUPERSEDED-as-economic-device (2026-07-08 MT-⑤) → force-geography + hegemony-bar |
| test-trust ladder (검증 신뢰 사다리) | Promoted to Tier 0 (`DOMAIN_MAP.md`, 2026-07-05 doc-sync batch — born here, needed by combat-formula batteries and root docs). Full charter: `TEST-LADDER.md`. | **AGREED** (2026-07-05, promoted same day) |
| Deterrence equilibrium (억지 평형) | The failure mode blinds exists to break: every realm requires the ~1.7 pre-war ratio, healing (garrison regen + recruitment + usable recovery) outruns wounding between wars, so the world settles back into symmetric deterrence and no decision point ever trips. Named at sheet 12 (2026-07-05, negative-space); quantified on the real map at sheet 15 (2026-07-07: ~58% of bot-grade matches frozen, turn-ceiling-invariant). Conversational alias: 동결 세계 (frozen world). | PROPOSED (2026-07-07) |
| Opportunism read (기회주의 읽기) | The attack-window read that moves a parity board past deterrence: the ~1.7 ratio is checked against what actually defends NOW — a field army pinned on another front leaves only a screen + facing garrison. Born as the sheet-12 harness rule for SPEC_GAPS ① (war appetite); the RULINGS gap-① lean names it the load-bearing motion B's AI must produce. A strengthened-read harness probe ("pile-on") is the registered cheap test of how much of the frozen tail is bot blindness vs true design gap. | PROPOSED (2026-07-07; harness rule since 2026-07-05) |
| 종료 분류 (ending taxonomy) | The **bar-independent** read of HOW a match ended — buckets hegemon / **denied-dominant** (dominant + unassailable but the check never tripped — the wall) / standoff / bipolar-lock / contested, from an 8-metric concentration panel (forceShare / controlShare / HHI + shieldShare / reversibilityIndex / vassalShare / bloodAxis; vassals fold FULL into the overlord side). An L2 MEASUREMENT instrument, never the winner rule — the 패권 결정점 gate alone decides winners; the taxonomy is the evidence a later victory-condition / SPEC-terminal decision needs. Thresholds 가안. History: `RULINGS.md` ET-①. | AGREED-structure 2026-07-08 ET-① (thresholds 가안) |
| Sector world (섹터 세계) | The L2 tournament's shared land model since occupation-geography stage ① (ADR 0032): map boards build live sector copies with hex-derived adjacency and a static seat-border set; every land quantity (income, ceiling, register share, occupation) reads these sectors, not counts. History: `RULINGS.md` OG-①. | **AGREED** (2026-07-10, OG-①) |
| Holdings (보유 섹터, `holds`) | The set of sector ids a realm actually holds. Income (Σ economyValue × usableEconomy) derives from it every turn; the military ceiling derives from it through the capLandFrac blend. Loss is immediate and whole; gains enter lagged via per-sector ripening. History: `RULINGS.md` OG-①/⑤. | **AGREED** (2026-07-10, OG-①) |
| Named capture (실명 점령) | Occupation carries sector identity — `war.occupiedIds` (count preserved as `.length`); every downstream channel (cession, return, elimination) moves those exact ids, never an equivalent count. History: `RULINGS.md` OG-②/③. | **AGREED** (2026-07-10, OG-②) |
| Occupation frontier (점령 경계) | The candidate set geography fixes for the next capture: defender-held sectors adjacent to (this war's occupied set ∪ the front's border sectors). Judgment picks within it by score = value ÷ resistance; the score is an ordering read only, never combat arithmetic. History: `RULINGS.md` OG-②. | **AGREED** (2026-07-10, OG-② — score ordering uses the 가안 resistance proxy) |
| Resistance proxy (저항 근사) | The 가안 resistance term in the occupation score: 3 (border sector) : 1 (interior) — a hard-shell/soft-interior ordering heuristic mirroring the sealed garrison start-state. NEVER enters `resolve()`; replace with real per-sector defense when sector garrisons/forts land. History: `RULINGS.md` OG-②. | AGREED-structure (2026-07-10, OG-② — 3:1 value HARNESS 가안) |
| Limbo (점령 무귀속) | Occupied-but-untransferred land: sectors in a live war's occupiedIds count toward NEITHER side's derived quantities — the defender lost them (occupied land pays no taxes), the attacker has not integrated them. Resolved at settlement (transfer) or stall/white-peace (id-exact return). History: `RULINGS.md` OG-③. | **AGREED** (2026-07-10, OG-③) |
| Possessor-keeps (점유자 보존) | The elimination transfer rule: each war's occupiedIds go to that war's attacker (third-party occupiers keep their bites); the unoccupied remainder goes to the eliminator. Conservation holds both ways (R2): a dead attacker's bites return to their defenders id-exact; a dead third-party attacker's bites flow to the eliminator. History: `RULINGS.md` OG-③. | **AGREED** (2026-07-10; R2 rider 2026-07-11, OG-③) |
| capLandFrac (땅-상한 결합 다이얼) | HARNESS blend dial for the land–ceiling coupling: fieldCap = (1−frac) × starting ceiling + frac × land-derived ceiling. 0 = frozen control; 1 = fully land-derived. **Sealed value: 1** — the ceiling follows conquered-population reality; intermediate fracs rejected as world-meaningless blends (land-derived identity). Supersedes the same-day frac-0 seal (OG-⑤, stamped). History: `RULINGS.md` OG-⑤ → AB-②. | **AGREED** (value 1 SEALED 2026-07-11, AB-② · L2 config, M9-promotion grill — was 0, OG-⑤) |
| Per-sector ripening (섹터별 숙성) | ADR 0022's usable ripening carried as per-sector state: any acquired sector (conquest, cession, elimination share — uniform per ADR 0029) starts at the ADR 0022 usable fractions and ripens per stable turn toward 1.0; ceiling lag and income lag both emerge from the one mechanism. Distinct from realm-level war wear (`r.usable`), which is multiplicative on top. Floors/rate owned by ADR 0022 (HARNESS 가안 at L2). History: `RULINGS.md` OG-①. | **AGREED** (2026-07-10, OG-①) |
| Affordability bound (지불능력 상한) | The unassailability recruitment-futures credit counts only what the world sells: per in-balance rival, futures = **min(headroom, rate, money, bodies)** — money = the max draftable men whose surge-curve bill (`draftBill`, same arithmetic as `doRecruit`) fits treasury + regenWindow × income; bodies = the civilian register (pool − serving). Non-finite money/body inputs → legacy min(headroom, rate) exactly (fixture boards). Zero new dials; refines ruling ⑪ (futures stay rival-side only). History: `RULINGS.md` AB-①, ADR 0033. | **AGREED** (2026-07-11, AB-① · L2) |
| Affordability-bind rate (`affordBindRate`) | Standing instrument: among undecided matches' final checks, the share of in-balance rivals whose futures min was set by the money or bodies bound — proves the affordability bound is live (anti-vacuousness). Read per arm, not globally (arm-conditional: reserve arms bind more). Exposed by plan-battery `aggregate()` + the `--growth` deep line. History: `RULINGS.md` AB-①. | **AGREED** (2026-07-11, AB-① · L2) |
| World of record (기록 세계) | The sealed harness CONFIGURATION that official L2 measurements are read against — which layers are on, not their dial values. Current: **FG board + M9 on + capLandFrac 1** (AB-②); individual dial values stay 가안 (M9 ×0.5 sealed at MAGNITUDE M9). Official snapshot = the pre-crisis baseline (`research/2026-07-11-record-world-baseline.txt`). History: `RULINGS.md` OG-⑤ → AB-②. | **AGREED** (2026-07-11, AB-② — configuration seal) |
| Sudden-death crisis ending (위기 종결) [조어] | The turn-32 match end: a rule-driven, preparable, escalating crisis (이민족 침입 family) forcing an end within ~3 turns — no dice, hermit-kingdom prep must be real; the judged scorecard is demoted to last-resort fallback (~turn-35 pathology). Makes decided% a KO-rate. Direction sealed; detailed design = a dedicated pass bound by 5 gates + 3 riders (ADR 0034); SPEC amendment rides that pass. History: `RULINGS.md` AB-③. | PROPOSED (direction SEALED 2026-07-11, AB-③ · L0; design pass pending) |

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
