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

(to be filled in as ruled; delete or absorb this prototype afterward)
