# Battery findings — answers pending user rulings

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
