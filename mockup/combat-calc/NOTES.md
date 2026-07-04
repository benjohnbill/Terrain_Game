# Battery findings (2026-07-03 run) — answers pending user rulings

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
