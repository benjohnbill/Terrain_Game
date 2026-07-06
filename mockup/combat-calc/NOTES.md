# Battery findings — answers pending user rulings

# 2026-07-05 night run — sheet 13 (thin economy, A-3)

Question: the minimum economy that makes M13 prices and 정산 codable —
sector yield, treasury, and what raises the national cap (ruling ⑮'s
pricing duty). New module: `econ.js` (candidate structure, 가안).
Sheet: `node mockup/combat-calc/battery.js economy`.

## Candidate structure (closes autonomously if unopposed — handoff §A-3)

**Everything derives from sector values × usable; zero new stored
state** except the treasury stock:

- income (yield/turn) = Σ economyValue × usableEconomy
- national cap = capPerPop × Σ populationValue × usablePop
- treasury = accumulated unspent yield; 배상 lands here (pays sheet-12
  spec gap #6 — indemnity is treasury cash, spent through the normal
  recruit/build prices, no special conversion rule)
- conquest raises cap automatically (sectors arrive at 50/60 usable →
  cap arrives discounted, matures with recovery — the anti-instant-
  full-value guardrail for free); raids lower the rival's cap (usable
  burns); development raises one sector's values permanently

## What the sheet measured (L0/L1 + one L2 re-run)

- **Sealed anchors re-derive**: capPerPop 600 × 10-sector mid realm =
  cap 6,000 ✓; 12 rich sectors (econ 1.5 / pop 1.25) = 9,000 ✓ — the
  M13 numbers become DERIVED, not authored. Recruit primary costs
  30% (mid) / 25% (center) of turn income — affordable, real tension.
- **Cap motion**: +1 fresh capture = +360 now / +600 recovered;
  3 sectors raided to 0.7 usable = −540 cap, −0.9 income; development
  (1 primary + 4 yield) = +300 cap, +0.5 income, 8-turn payback.
- **Fort-vs-recruit exchange rate (STRATEGY-SPACE #5 verification,
  due since A-1): the blood-EV is FLAT ≈ 27–30 men of extra attacker
  blood per yield invested across ALL packages** (recruit 27, field-
  works 30, walls 29, fortress 27/y) — emergent from the casualty
  curve, not engineered. This is the no-fixed-optimum doctrine landing
  in the economy: at these prices no package dominates on blood; the
  choice is decided by the OTHER currencies — men are mobile but die
  once and eat cap headroom; forts persist, deny the sector
  (threshold), but cost PRIMARIES (tempo) and are position-locked.
  Guarantee #5 ("build-rate dial is a real early-game opportunity
  cost") holds by construction: build spends tempo, the scarcest
  early currency.
- **Sheet-12 re-run under the derived cap (capPerSector 600)**: 27%
  of matches end (canon 4% / probe@400 26%), archetype spread survives
  (chain 10% · interior 10% · snowball 8% · shield 3%), mean trip
  T26.3. The derived structure closes the world at least as well as
  the raw probe — ruling ⑮'s re-run duty paid at candidate values.

## Findings that need user rulings (continuing the numbering)

15. **capPerPop 600 + the sector templates** (mid = 10 ordinary
    sectors, center = 12 rich at econ 1.5/pop 1.25): this single dial
    re-derives both sealed cap anchors and closed the L2 world.
    Recommendation: seal 600 with templates as authoring guidance
    (B's cradle authoring keeps the freedom to vary sector counts —
    the dial is per-pop, not per-realm).
16. **Fort build prices** (fieldworks 2y+1pr / walls 6y+2pr /
    fortress 12y+4pr / legendary 30y+8pr): satisfies the M5 rider
    (wonder ≈ 8 turns ≈ ⅓ match) and lands the flat blood-EV above.
    Recommendation: seal as-is; the flatness is the feature.
17. **Development package** (1 primary + 4 yield → +0.5 economy +
    +0.5 population on one sector, once per sector): +300 cap / +0.5
    income, 8-turn payback — slow-lever identity (shield-first and
    free-rider food). Recommendation: seal shape, keep once-per-sector
    (a repeatable step needs a diminishing ladder — Phase 2).
18. **Treasury start 5** (small war chest): matters only for turn-1..3
    choices; pure feel dial. Recommendation: seal 가안 5, playtest owns.

## User verdicts (sheet 13)

- **Land-derived state principle: ADOPTED as Tier-0 design principle
  (2026-07-05, user-confirmed after retrofit review).** "모든 것은
  땅에서 파생된다" — substance is never stored where it can be derived
  from held land; registered in DOMAIN_MAP §Design Principle with the
  named exception (command pool — attention is realm-size-independent)
  and the MVP boundary (muster geography abstracted; M9 grammar is the
  extension point). The user's framing sealed the scope: "땅" includes
  choke width → projection, cradle position → population base, muster
  origin + march distance → combat power; 도/섹터/hex are the overlay
  on that land.
- **Finding 15 — capPerPop 600 + sector templates: SEALED (2026-07-05,
  ruling ⑱).** One ordinary fully-usable sector sustains 600 men;
  cap = 600 × Σ populationValue × usablePop. Templates (mid = 10
  ordinary sectors → 6,000 ✓; center = 12 rich sectors econ 1.5 /
  pop 1.25 → 9,000 ✓) are AUTHORING GUIDANCE, not rules — the dial is
  per-pop, so B's cradle authoring freely varies sector counts. First
  application of the land-derived principle; L2-validated (derived-cap
  re-run closes 27% of matches with archetype spread intact).
- **Finding 16 — fortification build prices: SEALED (2026-07-05,
  ruling ⑲).** fieldworks 2y + 1 primary / walls 6y + 2 / fortress
  12y + 4 / legendary 30y + 8. Grounds: (1) satisfies the M5 rider
  (wonder-class ≈ 8 turns ≈ ⅓ of a 24-turn match); (2) this price
  table produces the flat blood-EV (27–30 men per yield across all
  defense packages) — cheaper makes forts THE answer, dearer makes
  them dead letters; (3) the real price is primaries (tempo): yield
  accumulates in the treasury, turns do not — 4 fortress turns forgo
  4 recruit primaries (+2,400 men), which is the D7 "static investment
  = effective tempo" identity landing as an actual price.
- **Terminology — yield display term: SEALED (2026-07-05, user;
  refined same session).** **yield (생산)** — defined as the **기본
  생산량 (base production unit)**: the land-based fundamental unit of
  production — one ordinary sector at full usable produces 생산 1 per
  turn; the common measure of cost and asset across the whole game
  (1 부대 = 생산 0.5, walls = 생산 6 + 2 primaries, raid loot ≈ 생산
  1.5). Short form 생산 in running text; 기본 생산량 in the definition
  (the user's framing: "yield를 토지 기반의 기초 생산 단위로 잡는다" —
  the land-derived principle naming its own unit). Namespace note: the
  documentation law's Production (생산) layer is docs-governance —
  different namespace, no in-game collision. Registration owed to the
  doc-sync batch (unit definition row + M14 economy section).
- **Finding 17 — development package: SEALED (2026-07-05, ruling ⑳).**
  1 primary + 생산 4 → one sector permanently +0.5 economy / +0.5
  population (= cap +300, income +0.5/turn), ONCE per sector. Grounds:
  8-turn payback makes it an early-window investment only (timing
  question stays alive — no fixed answer); the slow archetypes'
  (shield-first, free-rider) non-conquest cap path per ruling ⑮;
  once-per-sector keeps MVP clean — a repeatable step needs a
  diminishing ladder, parked as a Phase 2 reserved seat.
- **Finding 18 — treasury start: SEALED 가안 5 (2026-07-05, ruling
  ㉑, delegated to recommendation).** Pure feel dial (affects only
  turn-1..3 choices); ownership handed to playtest.
- **A-3 batch epistemic rider (user, 2026-07-05 — record verbatim
  intent):** the user accepts the A-3 seals while explicitly NOT yet
  seeing the match picture or feeling the economy ("수치 기반이니까,
  거대한 톱니바퀴 일부를 설계하는 일이니까") — acceptance is
  conditional on the standing feedback loop: keep running L2 as
  values move, expect L3 to revise. This is the TEST-LADDER charter
  operating as intended (L2 values never final), and it flags a
  display debt for later: the economy is numbers-only until a
  legibility surface exists (economy reads belong with the A-4
  display-debt family / B's UI work).

# 2026-07-05 evening run — sheet 12 (match tournament, the L2 build)

Question: does each temperament/archetype win where it should, and is
no temperament absolutely favorable? (user's pass sentence.) Plus the
ruling-⑭ gate: vassalage sovereignty premium 0.25. New module:
`tournament.js` (semi-durable — re-point at `js/` later as the balance
regression rig); sheet: `node mockup/combat-calc/battery.js tournament`.

**HONEST LIMITS (bounds every claim below):** bot policy quality bounds
proof power — dominance FOUND is real; dominance NOT found is not
absence. Bots use no reserves/delaying/feints/scouting; one authored
board; policy dials are harness GAAN, never seal candidates.

## What the tournament measured (2026-07-05, 360 matches/world, seeded)

- **World 1 (canon dials): 96% of matches never end.** The S10
  structural insight, frequency-confirmed and sharpened: with static
  national caps, leadership is arithmetically unreachable against ANY
  healthy same-size peer (own cap 7,000 < 1.7 × rival shield ~7,150),
  and since every loser recruits back to cap in ~5–8 turns while blood
  falls on the POOL (not the cap), the board heals faster than any
  single hand can wear it. Matches become endless material-settlement
  churn (wars 7.7/match, settlements 2.7/match, trip 4%). The two
  sealed ending shapes exist but are rare: vassal mass (rare by the
  sealed acceptance shape — kneeling is decisive+capital only) and the
  simultaneously-worn world (needs two big realms to bleed each other
  in the same window the third can exploit).
- **World 2 (A-3 probe: conquest raises cap +400/sector): matches end.**
  Endings 26% (trip-solo 21% + trip-chain 5%), mean trip T26.6,
  archetypes differentiate: snowball 12% > vassal-chain/interior-lines
  8% > shield-first 3% > free-rider/raid-attrition 0%. The undesigned
  A-3 cap-growth lever is not just pricing detail — it is the match's
  ending mechanism.
- **Temperament neutrality (pass sentence part 2): PASS in both worlds.**
  World 2 participant-pooled win rates 완고 4.3% / 실리 5.9% / 유화
  5.2% — no temperament absolutely favorable at L2 resolution.
- **Vassalage premium (ruling-⑭ gate): 0.25 SUPPORTED, 0.15 overpowers.**
  A-3-coupled sweep: premium 0.15 → 62% of demands accepted,
  vassal-chain focal win 15% (top of the field); 0.25 → 28% accepted,
  win 8% (in-family with snowball/interior); 0.35 ≈ 0.25 (acceptance
  saturates — the capital-risk term dominates the margin). 0.25 sits at
  the knee: rare-but-real kneeling without the chain being THE buy.
- **Preset usage in context** (world 2 deals): 표준 849 / 관대 147 /
  최대 79 / 복속 104. 관대 signs the NON-decisive wars (decisive 33%
  vs 표준 68% / 최대 78%) — the tempo-peace identity (ruling ⑬) shows
  up in frequency data exactly as sealed. 복속 94% decisive + 100%
  capital-in-reach — the throne-under-the-sword shape holds at L2.
- **Seat asymmetry**: 중원 center seat takes 15/24 of world-2 focal
  wins (mass compensates exposure at bot quality — bots do not
  coordinate coalitions); 남곡 small seat and 북하 hermit seat NEVER
  win. Also: on the raw sheet-10 masses the center trips by T2 with two
  recruit turns and no war (leadership + hermit exclusion pass from the
  start state), so the tournament board raised rival caps — an all-cap
  board must not satisfy leadership from T1. Both go to B's
  map-authoring as sizing constraints.
- **Wait-and-burn archetypes (free-rider, raid-attrition) never win at
  L2.** Their identities live exactly in what the bots lack (timing
  reads, blinds, burn-then-strike conversion) — honest-limits case, not
  a design verdict; registered as the standing playtest watch.

## Spec gaps the sim exposed (side product — the completeness audit)

Eight undocumented rules the harness had to invent to run at all;
printed at the end of the sheet (`SPEC_GAPS` in tournament.js). The
load-bearing one: **AI war appetite (GLOSSARY queue 8) is confirmed
load-bearing** — with every bot requiring the ~1.7 pre-war ratio, a
viability-parity board freezes after the small realm is digested; no
peer war ever launches. The harness had to invent the opportunism read
(a field army pinned elsewhere leaves screen + garrison, and THAT is
what the ratio is checked against) plus an idle-aggression fallback
before matches moved. The sheet-8 arc hand-scripted this motion
(중원–동평 war); canon has no rule that produces it. Others: two-front
army allocation (ADR 0025 thinness), attacking-a-vassal semantics,
settlement initiative/concession tempo, stalled-war exit (white peace),
indemnity→force conversion, truce/redeclaration, front redraw after
cession (needs B's map).

## Findings that need user rulings (continuing the numbering)

12. **Match-closure lever (S12 — the headline)**: under canon dials the
    hegemony check is a door almost no bot-quality match walks through
    (96% timeout). Something must let a winner's CEILING grow (or the
    world's ceiling shrink) inside one match. Candidates, in my
    preference order: (a) conquest/development raises the national cap
    — the A-3 probe shows +400/sector already produces endings and
    archetype spread; (b) permanent pool damage should also lower the
    rival's effective SHIELD ceiling, not just rebuild speed; (c) accept
    long matches and lean on the loser-experience/blinds thread. My
    recommendation: rule (a) in principle now (structure), price it in
    A-3 (numbers) — it is the existing "raising the cap itself =
    economy development" line (sheet 9) coming due, not a new dial.
13. **Vassalage premium 0.25 (ruling-⑭ gate)**: CONFIRM at 0.25 on the
    L2 evidence above (0.15 overpowers the chain; 0.35 buys nothing
    more). One rider: acceptance saturates above 0.25 because the
    capital-risk term dominates — the premium is a floor-setter, not a
    fine dial.
14. **Seat sizing constraints (→ B map authoring, structure)**: (a) an
    all-cap start must NOT satisfy leadership for any seat (the raw
    sheet-10 board tripped at T2 for the center); (b) small/hermit
    seats never win at L2 — either accept (their win path is the skill
    ceiling the bots lack) or hand B's authoring a compensator
    (legendary choke rent, richer per-sector yield). Recommend: accept
    for MVP, register as playtest watch.

## User verdicts (sheet 12)

- **Finding 12 — match-closure lever: SEALED as option (a)
  (2026-07-05, ruling ⑮).** Conquest/development raises the national
  sustainable cap — STRUCTURE confirmed; all numbers (cap per sector /
  development pricing / center-vs-periphery scaling) are A-3's to
  price. This is the sheet-9 reservation ("raising the cap itself =
  economy development — the future long lever") coming due, not a new
  dial. Grounds: L2 evidence that a static-cap world cannot close (96%
  timeout; leadership arithmetically unreachable vs any healthy
  same-size peer) while the +400/sector probe world produces endings
  (26%) AND archetype differentiation (snowball 12% > chain/interior
  8% > shield 3%) — the cap-growth lever is the match's ending
  mechanism, not pricing detail. A-3 verification target registered:
  re-run the sheet-12 sweep at A-3's priced values; the probe's 400 is
  harness 가안, NOT the sealed number.
- **Finding 13 — vassalage sovereignty premium: SEALED at 0.25
  (2026-07-05, ruling ⑯ — pays the ruling-⑭ gate; 가안 promoted).**
  L2 frequency evidence: 0.15 → 62% of demands accepted, vassal-chain
  focal win 15% (top of field, the chain becomes THE buy); 0.25 → 28%
  accepted, win 8% (in-family with snowball/interior-lines); 0.35 ≈
  0.25. **Rider sealed with it: the premium is a floor-setter, not a
  fine dial** — above 0.25 acceptance saturates because the
  capital-risk term dominates the loser's margin; if the chain ever
  needs weakening later, the handle is the capital-risk side of the
  loss model, not this number. Playtest-provisional like all values.
- **Finding 14 — seat sizing: SEALED as recommended (2026-07-05,
  ruling ⑰).** (1) **Map-authoring constraint registered for B**: an
  all-cap start state must NOT satisfy leadership for any seat — on
  the raw sheet-10 masses the center tripped the check at T2 with two
  recruit turns and no war (leadership vs each rival individually +
  hermit exclusion passed from the start state). Board authoring must
  verify this before play. (2) **Small/hermit seat L2 losing record
  ACCEPTED for MVP** — per the L2-charter reading rule, their win
  paths (timing reads, fog exploitation, choke rent) live exactly in
  the placeholder list, so the 0% is not a design verdict; no
  compensator now. Registered as standing L3 playtest watch items.
- **L2 charter ADOPTED (2026-07-05, user-directed).** The test-trust
  ladder and the L2 epistemology are now documented in
  `docs/features/match-arc/TEST-LADDER.md` (single home): asymmetric
  proof rule (found = real / not-found = nothing / L2 values never
  final), the harness-placeholder table (each invented bot behavior
  named as a stand-in for a human-facing system — fog/scouting,
  blinds, adaptation, negotiation reads), negative-space findings
  (fog owns war frequency; blinds' acceptance test = board moves
  without the idle-aggression placeholder), and archetype
  pre-screening as a sanctioned secondary use (with the reading rule
  that L2 failure only signals when the archetype's identity does not
  depend on what bots lack). Purpose: fixing what L2 claims makes the
  L3 delta measurable — the pre-work for measuring distance from
  human-felt fun.

# 2026-07-05 run — sheets 10–11 + S6 re-run (A-2)

Question: does the hegemony decision-point formula + settlement
acceptance arithmetic behave when computed end-to-end? (`match.js` is
the new pure module; sheets `hegemony` / `settlement`.)

## What validated cleanly (2026-07-05)

- **S6 re-run (ruling-⑥ schedule)**: the reserve bet space closes
  naturally at 0–8 points (awakening fraction AND emergency lever both
  saturate at the knee); A holds from 6 pts; the 양동 후속타 hole at B
  now scales with the defender's own bet; a cut route suppresses the
  awakening pool to the local garrison. No new ruling needed.
- **S10 arc**: check trips at T23 (15–25 envelope ✓) under the
  shield-line base; a single war from parity start cannot trip it
  (short by ~11,000 vs 중원 even after a clean war-1 + vassalage) ✓;
  hermit clause fires on the strait-locked realm and out-of-balance
  exclusion works ✓; unassailability passes once vassal shields count
  toward the candidate ✓; ratio 1.5/1.7/1.9 shifts the trip only
  T22/T23/T24 — the ~1.7 reuse is safe (it is not the binding lever;
  the shield-base definition is).
- **S10 structural insight (not a ruling)**: a solo hegemon can NEVER
  clear leadership against a healthy full-cap rival (own field cap
  6,000 < 1.7 × 7,200) — the check arithmetically requires vassal mass
  or a worn world. The two legitimate ending shapes (exhaustion winner
  / vassal-chain acknowledgment) are forced by the inequality itself,
  and vassal rebuild-and-count is load-bearing for the trip (the
  archetype-2 overpower watch stands).
- **S11 fill-order decoupling**: same claim rate → same acceptance,
  different composition (할양 8+배상 1 vs 5+4) — rate carries
  acceptance risk, composition carries the archetype benefit, exactly
  separable as the spec required ✓.

## Findings that need user rulings (continuing the numbering)

6. **Shield-base definition (S10 — the unsealed term in 패권 결정점)**:
   what mass does the ~1.7 multiply? `total` (field + all garrisons)
   → NEVER trips inside 26 turns; `shieldLine` (field + border-shield
   garrisons — faithful to sheet 7's measured 4,000) → T23;
   `field` only → T15, i.e. it trips mid-war on paper superiority
   before the decisive battle is fought. Recommendation: shieldLine.
7. **Projection flow through chokes (S10)**: projectable = choke cap ×
   flow. flow 1 makes hermit buy-back-in IMPOSSIBLE (staged 1,000 ≤
   floor — breaks the sealed hermit-clause promise); flow 2 = hermit
   until staging is built (intended reading); flow 3 = strait realms
   are never hermits. Recommendation: flow 2, floor stays 1,000.
8. **Regeneration window W (S10)**: never bites in the main arc (the
   blocking rival sat at cap — no recruit headroom); micro-case (worn
   hegemon 8,000 vs two worn-but-rich rivals): W=4 trip stands, W=6/8
   trip blocked. Recommendation: W=6 (matches the M12/M13 recovery
   anchors); accept that worn-but-rich worlds stay contested — the
   untilted tail belongs to the blinds thread.
9. **Continued-loss scale λ (S11 — FAILS the registered bar as
   drafted)**: under the sheet's own GAAN loss model the acceptance
   matrix saturates — 유화-최대 acceptance 100% (bar: ≤40–50%), 최대
   picked 23/30, 관대 niche 2/30. λ sweep: bar passes at λ≈0.6
   (유화-최대 40%, 관대 niche 11/30, 최대 acceptance 6/30). Ruling
   needed on the escalation anchors: continued war must be priced
   BELOW the full composite bill often enough — λ 0.6-scaled anchors
   ≈ esc decisive 0.9 / grinding 0.7 / marginal 0.5, capitalRisk 0.3.
10. **관대's identity (S11)**: under deterministic acceptance, 관대 can
    never beat 표준 on value when both are accepted (turns saved are
    identical) — its entire niche is the acceptance edge (표준
    rejected, 관대 accepted). It IS the tempo-peace / rejection-hedge
    preset by construction. Recommendation: embrace the relabel now
    (registered contingency), rather than waiting for playtest.
11. **Vassalage pricing (S11 — the registered open input, proposal)**:
    pricing 복속 in reach currency is structurally broken — the
    hegemony swing (≈2× loser remaining mass) per yield forgone beats
    recruitment ~15–20:1, so it would ALWAYS be the buy. Proposal:
    price it in acceptance currency — vassal bundle = 표준 material +
    sovereignty premium (GAAN 0.5 × loser remaining value). Result:
    복속 clears only when the capital threat inflates L (완고 mostly
    refuses — fights to the death; 실리/유화 kneel after decisive
    wars). Premium coefficient → user dial.

## User verdicts (2026-07-05 run)

- **Finding 6 — shield-base definition: SEALED (2026-07-05, ruling ⑨).**
  Shield mass = **field army + border-shield garrisons on the fronts
  facing the counting side (facing-front reading)** — the field army is
  interior-lines (meets any single invader, counts whole); frozen
  border garrisons count only where they face the other side (a rival's
  far-front garrisons are not my bill — 임진왜란 셈: 부산·동래 + 탄금대,
  함경도 국경군은 제외). Historical anchor accepted: the two terms are
  literally the late-Roman limitanei/comitatenses split. Implementation
  ruling: DERIVED per turn, zero new state — "target's garrisons in
  sectors adjacent to territory I or my vassals control" over the
  existing adjacency graph; control changes redraw the fronts
  automatically, which makes conquest-inherits-exposure (anti-snowball)
  and vassalage-widens-the-front pure arithmetic (visible in the
  ledger: vassalizing 중원 raises the 동평 bill 10,200 → 11,220 the
  same turn the vassal masses trip the check, T22). Structural insight
  banked: **expansion has a break-even point** — wider realm = deeper
  floor (pool, cap ceiling) but wider surface (thinner per-front
  shield, fixed 20-point attention); hegemony is 회맹-shaped
  (acknowledgment, not annexation), so pure substance-chasing is
  correctly taxed. Sub-note: a realm sharing no front counts at
  field-only (its garrisons all face elsewhere) — prototype
  simplification accepted; the invasion-corridor edge case belongs to
  B's map authoring.
- **Finding 7 — choke projection flow: SEALED at flow 2, floor 1,000
  (2026-07-05, ruling ⑩).** Projectable mass = min(field army, Σ door
  width × 2) — a derived reading of the real army through the realm's
  geography, never a stored resource (escape-state doctrine). flow 2 is
  the unique value separating the two historical archetypes correctly:
  pass realms (촉, door 1,000 → 2,000) stay IN the balance as
  small-punch Parthia blockers (북벌 possible; the hegemon must
  actually break them — 음평 샛길 = the authored pass removal path),
  while strait realms (일본, door 500 → 1,000) are hermits with a
  working buy-back (staging → 2,000 = 임진왜란, and 명량 re-narrows
  the door — both directions reproduced). flow 1 kills the 북벌 AND
  the buy-back promise; flow 3 kills the hermit clause. Map-authoring
  rider: the cradle archetypes (shielded valley / island-peninsula)
  now have a fixed projection grammar for B.
- **Finding 8 — regeneration window: SEALED at W=6 (2026-07-05,
  ruling ⑪).** W is the time depth of the word "irreversible" — the
  coalition side of unassailability counts current projection + W
  turns of recruitment; 6 reuses the sealed recovery anchors (M12
  shattered garrisons ~5+, M13 realm rebuild 5–8). Asymmetry is
  intended: leadership takes no W (hegemony is claimed with the
  PRESENT punch; the future is only used to close THEIRS). The check
  deliberately does NOT simulate the candidate's own future actions —
  folding them in would end matches on predicted, unperformed
  victories (amputating cascade/showdown/loser agency); instead a
  failing check *demands* those actions (복속·풀 소모·점령 are the
  means of closing a rival's future). Full-sum coalition confirmed as
  worst-case VERDICT logic, not prediction — coalition realism is
  produced by the match history (hermit exits, vassal transfers,
  permanent pool loss) and by threat-weighted AI convergence, not by
  the formula. All values playtest-provisional (user rider: PVP
  balancing will revisit). Two registrations: (1) **reachability
  filter** — the sealed word "reach" licenses a route/distance
  attenuation of coalition sums once B's map exists (prototype sums
  globally); (2) **work-list card** — when the check fails, the
  summoned card names WHICH realm's open future blocks the trip and
  the closing means, turning the failing check into the hegemon's
  to-do list (system calls for action instead of predicting it).
- **Finding 9 — resistance discount: SEALED at 0.6 (2026-07-05, ruling
  ⑫, delegated to recommendation).** The loser prices continued war at
  0.6 × the full model loss (single multiplier on the total, one
  balance handle) — continued war must often cost LESS than the full
  composite bill or 강화 결렬 cannot exist and the preset ladder
  collapses to one button. Verified at 0.6: conciliatory-Maximum 40%
  (bar ≤40–50% PASS), no always-right preset (pick spread 관대 6–8 /
  표준 6–11 / 최대 6 / fight-on 5–12 across oppYield sweep), 관대
  niche 11/30. Temperament identity emerged: 완고 (0.8) never signs
  Maximum in the grid — hardliners cannot be handed the full bill,
  only worn down or vassalized. Model shape (esc per victory margin +
  capital risk) remains the sheet's own GAAN; the sealed number is the
  discount. Playtest-provisional like all values.
- **Finding 10 — lenient preset identity: SEALED (2026-07-05, ruling
  ⑬).** The registered contingency fired: under deterministic
  acceptance, lenient can never beat standard on value when both are
  accepted (a theorem of the sealed arithmetic, not a frequency claim
  — L1-safe). Lenient's product is **acceptance certainty**: its whole
  niche (11/30) is the "standard refused, lenient signed" window.
  Identity confirmed as the **tempo-peace preset** — the button that
  buys out refusal risk; the natural pick when the acceptance-outlook
  band is wide (unscouted temperament), making it a price tag on
  scouting neglect. No mechanics change; UI description duty
  registered.
- **Finding 11 — vassalage pricing: STRUCTURE SEALED, number 가안
  (2026-07-05, ruling ⑭).** Sealed: vassalage is priced in
  **acceptance currency**, never reach currency (reach-currency
  pricing is structurally broken — hegemony swing ≈ 2× loser remaining
  mass per few yield forgone, ~15–20:1 vs recruitment → always the
  buy). Vassal bundle = standard-preset material + sovereignty premium
  [조어→등록 예정: sovereignty premium] × loser remaining value.
  Shape verified at L1: kneeling is rare and decisive-shaped
  (conciliatory kneels under decisive victory + capital threat;
  pragmatic only in the largest cases; hardliner NEVER — hardliners
  also never sign Maximum, so vs a hardliner the ceiling is standard
  or actual conquest; playtest watch item: hardliner-majority worlds
  lengthen matches). The premium VALUE 0.25 stays 가안 — it is
  frequency/dynamics-sensitive (vassal-chain archetype power rides on
  match feedback), gated on sheet 12 (tournament) / playtest, per the
  test-trust ladder (L0 hand reasoning / L1 decision grids / L2 match
  tournament / L3 human playtest) adopted this session.
- **UI idea registered (user, 2026-07-05) — expansion break-even
  card**: surface the break-even read as a fog-banded, summoned
  estimate (never a resident advisor): value side = target land's
  pool/yield (reach arithmetic already prices it), cost side = new
  front length + the NEW neighbors' facing strength. Scouting feeds
  both sides — border-line strength is a stable, scoutable target
  (province-scale read, pairs with the hollow-province read of ruling
  ⑥), while field-army location stays a lucky catch — so scouting buys
  the break-even band, not just map fill. Owed to the A-4
  display-debts list (command-card IA family), post-B-map.

---

# 2026-07-03 run — sheets 1–9 (answers sealed via A-1, 2026-07-05)

Question being answered: does the sealed M1–M11 set (+ M12 draft) produce
historically-shaped outcomes as one machine? Full output:
`npm run battery`. Verdicts below are the machine's; **user rulings
pending** per sheet.

## What validated cleanly

- **S1 명량**: 13 부대 (commit 20) repel 133 부대 indefinitely; attacker
  burns ~500/wave, defender bleeds 4–6/wave. Confluence works.
- **S2 fortress economics**: storm fails bloodily (R 0.31–0.42), DP
  siege opens the fort in 4 turns (matches the audit's 3–4), starvation
  bypass takes 5 turns for near-zero blood but pins the army, Encirclement
  is the cheapest erasure (−22 vs −44). Four distinct, non-dominated paths.
- **S3 raid-vs-sortie**: sortieing into a 1,500 raid loses the field
  battle; intercepting a 600 raid destroys 23% of it; huddling trades
  usable value for blood. Real decision, no exploit.
- **S4 delaying**: NOT dominant — standing shatters weak attackers
  (rout at R≤~0.52) and bleeds strong ones at full rate; delaying's
  exchange ×0.5 also *protects a weak attacker from routing* (matches the
  documented "removes decisive repulsion AND attacker rout").
- **S5 grinding**: DP delivers the same blood plus erosion + usable
  stamps at every R ≥ 1.1; a commit-2 poke pays 23% of the whole stock.
  Invariant holds.
- **S6 reserve/feint**: 긴급 투입 flips R 4.17 → 1.39 (A held); next
  turn the stripped province loses B at R 5.0. 양동 후속타 emerges.
- **S7 tempo**: war settles in **11 turns** (8–12 band ✓); match
  arithmetic ~19 turns fits the 15–25 envelope with one full war +
  recovery. Parity invasion stalls at the shield → pre-war mass ratio
  (~1.7+) decides; **the buildup turns are the war**.

## Findings that need user rulings (numbered for reference)

1. **Choke absolutism (S1)**: strait 500 × legendary ×2.5 × opposed 0.55
   is a near-absolute block — a garrison of ~1–1.5 부대 already denies
   the headline vs 13,300; the lever ceiling prices the holder's *blood*,
   not the hold itself. Acceptable (removal paths carry the counterplay),
   or is cap+legendary-terrain a double-count at authored sites?
2. **DP one-click demolition (S7 T4/T10)**: at R ≥ ~1.9 a single DP turn
   inflicts 30%+ and **routs the garrison out of its own fortress**
   (escape open → flees the works). Erosion pacing only governs the
   R ≈ 1.1–1.7 band. Intended reading of "rout is organizational," or
   should walled garrisons resist rout conversion (e.g., fortress counts
   as its own escape / cliff shifted)?
3. **Siege blood rate (S2 Path B)**: the besieger bleeds
   12%÷R^1.4 of his WHOLE army per DP turn — 1,410 of 6,000 (24%) to
   open one fortress. Also: higher commit → higher R → *less* siege
   blood (consistent with the grinding firewall, but worth feeling).
4. **Delaying + fortification**: does a delaying defender keep the fort
   multiplier? Battery assumed NO (refusal abandons the works).
5. **M12 confirmation**: S7 ran on the draft pulse and landed in-band.
   Confirm M12 as-is, or adjust after rulings 1–3?

## User verdicts

- **Finding 1 — strait-choke absolutism: ACCEPTED in principle
  (2026-07-05).** The triple stack is not a double-count — frontage
  classifies (how many can fight), terrain multiplies (how well the
  holder fights), water penalizes (the crossing's cost); S1 is a
  reproduction of Myeongnyang, not a bug. The strategic price of
  absolute defense is already charged at the match layer by the
  hermit clause (chokes narrow doors both ways → projectable mass
  falls → out of the balance). Riders (authoring discipline, owed to
  B's map-authoring stage): (1) legendary chokes are a scarce
  resource — a handful per active region; (2) a legendary choke's
  removal paths must be authored one grade more concretely than
  ordinary chokes (actual port sectors / sea routes on the map) —
  a strengthening of M11's mandate. The opposed-strait 0.55 value
  itself is explicitly deferred to ruling ⑦ (confirm vs relax 0.70).
- **Finding 3 — siege blood rate: ACCEPTED (2026-07-05).** 12%÷R^1.4
  of the whole army per DP siege turn (~24% of 6,000 for one
  fortress ≈ 2.4 turns of recruitment ≈ ~16% of the match manpower
  budget) is the price that keeps the fortress quartet
  (storm / DP siege / starvation bypass / encirclement)
  non-dominated — cut it and DP becomes the single answer, the
  fortress turns from a puzzle into a toll booth. The inversion
  (higher commit → higher R → less blood, absolute as well as
  fractional) is the R-prices-everything law applied consistently,
  not an exception. **Principle worth carrying into the fortress
  claim block (user, 2026-07-05): "a fortress guarantees only THAT
  the attacker pays; WHICH currency he pays in (blood / time+pinning
  / preconditions) is the attacker's choice."** Rider: the
  fortification-vs-recruitment exchange rate (1 build turn vs 1
  recruit turn) is registered as an A-3 verification target.
- **Finding 4 — delaying + fortification: CONFIRMED as assumed
  (2026-07-05).** A delaying defender loses the fortification
  multiplier (walls are a promise to hold a point; refusing decisive
  battle abandons them) but keeps the terrain multiplier (the world's
  ground travels with the fight — "지형은 싸움을 따라오지만, 성벽은
  못 따라온다"). Keeping the fort multiplier would merge half-blood +
  rout immunity + top defense into one card, killing Stronghold
  Defense and breaking the S2 siege quartet. The abandoned works fall
  to the attacker intact — denying them is Strategic Abandonment +
  Scorched Earth's job, which keeps all three defense cards alive for
  different reasons. Partial retention (e.g., half fort value)
  rejected: walls are discrete — you are on them or you are not.
- **Finding 2 — DP one-click demolition: ACCEPTED as-sealed
  (2026-07-05).** Grounds: the demolition is a property of the
  casualty curve, not of the plan — 12% × R^1.4 crosses the 30% rout
  cliff at R ≈ 1.92 regardless of plan; Deliberate Pressure is merely
  the only plan that reaches that R against walls (no escalade
  frontage cap). Risk is priced upstream (buildup mass, commit
  concentration, exposure elsewhere, worn prize via
  usableValueDamage), so overwhelming-R sieges ending in one turn is
  the curve's natural end, not an exploit. Display language owed at
  implementation: "수비대 와해 · 성 포기". Rider: 결사항전
  (voluntary last stand with escape open) registered into the morale
  reserved seat and deferred — see MAGNITUDE.md M4 validation notes.

# Sheet 14 — map viability (2026-07-06, tooling)

The map-authoring gate (spec: docs/superpowers/specs/2026-07-06-terrain-
cradle-map-design.md). Tooling only — no map is sealed yet. The 5-region
fixture is a first 가안 to exercise the loader/gate/mockup; its B1/B2
result is a starting measurement, not a verdict.

## User verdicts
_(pending — first authored map)_
