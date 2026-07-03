# Terrain × Fortification Ladder — Military-History Validation Survey

Status: research input (values remain a user decision)
Date: 2026-07-03
Scope: validates the proposed 5+5 defense-multiplier ladder and the ×4/×6 product clamp
against a 24-battle historical corpus, honoring the model's separations (frontage caps,
crossing penalties, commander/commitment lever ≤×2.0 are NOT part of the ladder).

## 1. Method

- Formula under test: `R = (A × cA) / (D × cD × T × F)`, `T×F` clamped at ×4.0 standard,
  ×6.0 legendary. Attacker wins the exchange direction when R > 1.
- Implied multiplier: if a defender held, the ladder must supply
  `M ≥ (A × cA) / (D × cD)` after frontage/crossing/commander effects are attributed
  separately; if the position fell, `M` must stay below that ratio.
- Useful reference points: at 12% base and exponent 1.4, a defender routs (30% cumulative)
  in a single exchange when R ≥ ~1.92; an attacker routs in one exchange when R ≤ ~0.52.
  Between those bounds, multi-exchange grinds occur.
- Every factual claim below is tagged `[verified: source]` (checked via web search this
  session) or `[knowledge-based, unverified]`. Ancient force figures use modern scholarly
  estimates where they exist; traditional figures are labeled as such.
- Naval and pure-frontage battles are included only to test the separation rules, not the
  ladder values.

## 2. Battle corpus

| # | Battle | Era/theater | Type | Forces (modern est. where available) | Ladder classification (T × F) | Implied eff. defense mult. (after separations) | Fits ladder? |
|---|--------|-------------|------|--------------------------------------|-------------------------------|-----------------------------------------------|--------------|
| 1 | Cannae, 216 BC | Classical, Italy | Open field | ~86k Roman (mod. 50–80k) attack ~40–50k Carthaginian [verified: Wikipedia/Britannica] | plains ×1.0 × none ×1.0 = 1.0 | ~1.0 (outcome carried by Hannibal lever ≈ ×2.0) | FITS |
| 2 | Thermopylae, 480 BC | Classical, Greece | Pass | ~7k Greeks vs 120–300k Persians (mod.); pass 12–30 m wide [verified: Wikipedia] | pass ×2.0 × field works ×1.3 = 2.6 | raw ≥17; after frontage cap ~2–3 residual | FITS (frontage-first) |
| 3 | Alesia, 52 BC | Classical, Gaul | Field-works defense | Caesar 40–50k in double lines vs 80k besieged + ~100k relief (mod.; Caesar claims 250k) [verified: Wikipedia/Britannica] | plains ×1.0 × field works ×1.3 = 1.3 | ~1.8+ even with max lever | MISFIT (classification gap: engineered siege lines > field works) |
| 4 | Masada, 73 CE | Classical, Judaea | Legendary natural fortress | ~8–9k Roman fighting men vs 960 total defenders; ramp took 2–3 months [verified: Wikipedia] | leg. natural ×2.5 × fortress ×2.4 → clamped 6.0 | fell → M < ~15 needed; 6.0 gives R≈3 → falls | FITS (legendary clamp) |
| 5 | Fei River, 383 | China, Jin vs Former Qin | River-line | Jin 80–90k vs Qin eff. 100–200k (mod.; trad. 1.1M rejected) [verified: Wikipedia/Grokipedia] | no ladder step; river = attacker ×0.85 | needed ~1.5–2.5 defender edge; delivered by lever + Qin cohesion collapse | MARGINAL (×0.85 alone too mild for contested crossings) |
| 6 | Salsu, 612 | Korea, Goguryeo vs Sui | River interception | Sui 305k detachment, 2,700 returned (traditional; dam story unattested) [verified: Wikipedia] | unclassifiable — army caught mid-crossing on retreat | n/a — movement-state vulnerability, not a defense multiplier | OUT OF LADDER (boundary case) |
| 7 | Hulao Pass, 621 | China, Tang vs Xia | Pass | Li Shimin ~3.5k–10k entrenched vs Dou Jiande 100–120k; 50k+ prisoners [verified: Wikipedia] | pass ×2.0 × field works ×1.3 = 2.6 | raw ≥5–17; after frontage + fatigue + lever ~2–3 residual | FITS (frontage-first) |
| 8 | Ansi, 645 | Korea, Goguryeo vs Tang | Fortified town hold | Tang ~200k (trad.) vs garrison ~4k (trad., uncertain); 60–88 days, Tang withdrew (winter/supply) [verified: Wikipedia/search] | mountains ×1.5 × fortress ×2.4 = 3.6 | raw ≥25 — impossible as multiplier | MISFIT unless wall-assault frontage + supply clock exist |
| 9 | Tong Pass, 756 | China, An Lushan rebellion | Pass hold + forced sortie | Geshu Han ~200k (trad., low quality) held pass ~6 months; ordered sortie → ambushed, destroyed, pass lost [verified: Wikipedia/chinaknowledge] | pass ×2.0 (+ works) | numbers too murky for arithmetic | FITS qualitatively (pass holds; leaving it = disaster) |
| 10 | Hastings, 1066 | Medieval Europe | Hill defense | ~7–8k Normans attack ~7k English on Senlac ridge; all-day fight [verified: Wikipedia/Britannica] | hills ×1.2 × none ×1.0 = 1.2 | attacker needed lever ~×1.5 to win at parity | FITS (calibrates ×1.2) |
| 11 | Château Gaillard, 1203–04 | Medieval Europe | Fortress siege | 20 knights + 120 soldiers vs Philip II's army (several thousand [knowledge-based, unverified]); 6 months, mining + garderobe entry [verified: Wikipedia] | hills ×1.2 × fortress ×2.4 = 2.88 | fell → direction OK; ratio ≥20 held 6 months → time model needed | FITS direction |
| 12 | Kuju, 1231 | Korea, Goryeo vs Mongols | Walled town hold | Garrison size undocumented; 30+ days, full Mongol siege train repelled, Mongols withdrew [verified: Wikipedia] | (hills ×1.2) × town walls ×1.8 ≈ 2.2 | not computable | INSUFFICIENT DATA (qualitative support for walls) |
| 13 | Diaoyucheng, 1259 | China, Song vs Mongols | Legendary site | ~5-month 1259 siege; Möngke Khan died there; 200+ engagements over 36 years (1243–79); garrison [knowledge-based: several thousand troops + civilians, fields/wells inside] [events verified: Wikipedia] | leg. natural ×2.5 × fortress ×2.4 → clamped 6.0 | raw ~4–10+; multi-decade hold needs frontage + self-supply on top of ×6 | FITS only with separations |
| 14 | Xiangyang, 1268–73 | China, Song vs Mongols | Legendary fortress city | Garrison size unknown, supplies ~10 yrs; fell after ~5 yrs to counterweight trebuchets (500 m range) + isolation [verified: Wikipedia/deremilitari] | plains ×1.0 × leg. fortress ×3.0 = 3.0 | fell to tech + blockade, not assault ratio | FITS inside ×6; exposes siegecraft-tech gap |
| 15 | Agincourt, 1415 | Medieval Europe | Field works + constricted field | Curry: 12k French vs 8.5–9k English; others up to 36k vs 6k [verified: Wikipedia/Curry] | plains ×1.0 × field works ×1.3 = 1.3 | ~1.3–1.8 residual after frontage (woods) + mud + French command chaos | FITS (Curry numbers) |
| 16 | Constantinople, 1453 | Late medieval | Legendary walls | 7–8k defenders on ~20 km of walls vs 55–80k Ottomans (mod.) + bombards; fell day 53 [verified: Wikipedia] | plains ×1.0 × leg. fortress ×3.0 = 3.0 | R ≈ 3.3 → falls; matches outcome | FITS (legendary inside ×6) |
| 17 | Chungju/Tangeumdae, 1592 | Korea, Imjin War | Open plain (pass declined) | Sin Rip ~8k cavalry-heavy vs ~18.7k Japanese with arquebuses; Koreans annihilated; Joryeong Pass deliberately abandoned [verified: Wikipedia] | plains ×1.0 × none ×1.0 = 1.0 | ~1.0; loss driven by ratio + tech lever | FITS (plains baseline + pass counterfactual) |
| 18 | Jinju I, 1592 | Korea, Imjin War | Walled town hold | 3,800 defenders (170 arquebuses) vs 30,000 Japanese; 5 days; Korean victory [verified: Wikipedia] | plains/hills ×1.0–1.2 × town walls ×1.8 ≈ 1.8–2.2 | ≥3.95 even with defender lever ×2.0 | MISFIT unless wall-assault frontage cap exists |
| 19 | Haengju, 1593 | Korea, Imjin War | Hill stockade hold | 2,300–3,000 defenders vs ~30,000 Japanese; NINE sequential assaults repelled; hwacha; wooden stockade on cliff over Han River [verified: Wikipedia/Grokipedia] | hills/mountains ×1.2–1.5 × field works ×1.3 ≈ 1.6–2.0 | raw ≥5–6.5 with max lever; after single-approach frontage (serialized waves) ~1.5–2 residual | FITS ONLY with land frontage cap — showcase case |
| 20 | Jinju II, 1593 | Korea, Imjin War | Walled town falls | 90,000 Japanese (Hideyoshi total-commitment order) vs ~4k soldiers + irregulars; fell in ~8 days; garrison + ~60k civilians massacred [verified: Wikipedia] | same fort as #18 | R >> 1 → falls; matches | FITS (lever ×2.0 commitment flips same fortress) |
| 21 | Myeongnyang, 1597 | Korea, Imjin War (naval) | Strait | 13 Korean ships vs 120–133 engaged (up to 330 total); 31 Japanese ships destroyed/crippled; tidal reversal [verified: Wikipedia] | not a ladder case; strait ×0.70 + frontage + Yi lever ×2.0 | after frontage, local ratio ~1–2 → holds | FITS separation architecture exactly |
| 22 | Namhansanseong, 1636–37 | Korea, Qing invasion | Mountain fortress blockade | 13,800 defenders vs 100–120k+ Qing; 47 days; assaults/probes repelled, walls repaired overnight; fell by starvation + Ganghwa hostages [verified: Wikipedia/Grokipedia] | mountains ×1.5 × fortress ×2.4 = 3.6 | assault-proof at ratio ~8 (R=2.0 says storm succeeds) | MISFIT for pure-R assault; FITS if blockade/supply mode exists |
| 23 | Vienna, 1683 | Early modern | Bastioned fortress | Garrison 11.5–15k (+8.7k volunteers) vs 90–120k Ottoman combat troops (mod.); 18 assaults over 2 months; breached, ~1/3 garrison left when relieved [verified: Wikipedia/warfarehistorynetwork] | plains ×1.0 × fortress ×2.4 = 2.4 | R ≈ 2.8 → falling; historically it WAS falling | FITS direction (relief = external event) |
| 24 | Baghdad, 1258 | Mongol campaigns | Major city walls vs elite siegecraft | ~30k garrison vs 100–150k Mongols with premier siege corps; walls breached within days, surrender day 12 [verified: Wikipedia/deremilitari] | plains ×1.0 × town walls ×1.8–2.4 | R >> 1 → falls fast; matches | FITS; contrast with Ansi shows siegecraft swing |

## 3. Battle notes — arithmetic for the decisive cases

Only cases where the arithmetic is load-bearing; ratios use modern estimates.

- **Cannae (#1).** R = 86 × 1.0 / (50 × 2.0 × 1.0) ≈ 0.86 → defender wins. The ×2.0
  lever cap is almost exactly "Cannae-sized": the most celebrated command performance in
  ancient warfare flips a 1.7:1 deficit and no more. Good calibration anchor for the cap.
  One-exchange casualties at R = 0.86: Carthaginians ~9.7% (historical ~12–16%
  [verified: Wikipedia]) — close; Roman historical losses (~60–75%) far exceed the
  exchange formula because encirclement converts rout into annihilation. If the game ever
  wants Cannae-grade destruction, it lives in a pursuit/encirclement rule, not the ladder.
- **Jinju I vs Jinju II (#18/#20).** Same fortress, nine months apart. 30k attackers fail;
  90k attackers under an explicit maximum-effort order succeed. In-formula: 30 × 1.0 /
  (3.8 × 2.0 × 1.8) = 2.2 (predicts fall — misfit without frontage) vs 90 × 2.0 /
  (4 × 1.5 × 1.8) ≈ 16.7 (fall — correct). The pair independently validates the
  commitment lever concept while indicting pure-R sieges.
- **Haengju (#19).** Raw: 30 × 1.0 / (2.5 × 2.0 × 1.95) ≈ 3.1 → predicts fall; history is
  a defender victory. But the assault surface was a single slope on a river cliff and the
  Japanese attacked in nine sequential waves [verified: Wikipedia] — a literal frontage
  serialization. Per-wave with ~5k engaged: 5 × 1.0 / (2.5 × 2.0 × 1.95) ≈ 0.51 → each
  wave repelled at cost, cumulative attacker losses force withdrawal. The strongest single
  piece of evidence that the frontage cap must apply to land assaults, not just straits.
- **Ansi (#8).** Even at clamp ×4: 200 × 1.0 / (4 × 2.0 × 4.0) ≈ 6.3 → instant fall
  predicted; history is an 88-day failed siege. No plausible multiplier fixes this;
  wall-perimeter frontage plus a supply/season clock does (Tang withdrew at the onset of
  winter with supplies failing [verified: Wikipedia]).
- **Hastings (#10).** 8 × 1.5 / (7 × 1.0 × 1.2) ≈ 1.43 → slow attacker win — matches the
  day-long grind and late collapse. If hills were ×1.5, William needs lever ≥ ×1.9
  (near-cap) — possible but tight; ×1.2 sits comfortably.
- **Agincourt (#15).** Curry numbers: 12 × 1.0 / (8.7 × 1.5 × 1.3) ≈ 0.71 → defender
  wins, matching history without any exotic multiplier. With Barker's 36k vs 6k, only
  frontage (field narrowing between woods) + mud make it work. Either way the ladder's
  ×1.3 field works is not the number under strain.
- **Vienna (#23).** 100 × 1.0 / (15 × 1.0 × 2.4) ≈ 2.8 → predicts fall; the fortress was
  in fact days from falling when the relief army arrived [verified: Wikipedia]. Direction
  correct. Note: at R = 2.8 the defender takes ~51% in one exchange (rout threshold R ≈
  1.92), i.e., the formula compresses a 2-month fighting siege into one exchange — fine if
  a turn is a month+, worth a look if turns are shorter. (Numbers = design decision;
  flagged only.)
- **Constantinople (#16).** 70 × 1.0 / (7.5 × 1.0 × 3.0) ≈ 3.1 → falls; fell on day 53.
  The same walls had defeated ~20 earlier sieges at similar ratios over 1,000 years
  [knowledge-based, unverified] — pre-gunpowder, the effective multiplier was much higher.
  What changed was attacker siegecraft (bombards), an axis the ladder does not carry.

## 4. Per-step coverage verdicts

| Step | Proposed | Verdict | Evidence |
|------|----------|---------|----------|
| Plains | ×1.0 | **SUPPORTED** | Baseline by definition; Cannae (#1), Chungju (#17) resolve correctly on it. |
| Forest/hills | ×1.2 | **SUPPORTED** | Hastings (#10): parity attacker needs lever ~×1.5 to crack a ridge in a day-long grind — ×1.2 is the right magnitude. Caveat: corpus has no pure forest defense (forest catastrophes like Teutoburg are ambush/column events → lever territory); merging forest with hills is acceptable at sector scale. |
| Mountains | ×1.5 | **INSUFFICIENT DATA** | Every mountain engagement in the corpus is fortified (Haengju, Namhansanseong, Diaoyucheng). No clean unfortified mountain field battle with documented numbers surfaced. ×1.5 is a plausible interpolation between hills ×1.2 and pass ×2.0 — keep, but flag as designer's judgment, not history-derived. |
| Pass/defile | ×2.0 | **SUPPORTED — conditional** | Thermopylae (#2), Hulao (#7), Tong Pass (#9): in every historical pass stand, the headline effect is frontage; ×2.0 is right as the residual AFTER a frontage cap. If land frontage caps are not implemented, ×2.0 is far too low (implied raw values 5–17+) — the value and the frontage rule are a package. |
| Legendary natural | ×2.5 | **SUPPORTED (authored knob)** | Masada (#4) and Diaoyucheng (#13) composites hit the ×6 clamp and reproduce outcome directions once frontage/supply are separate. No evidence demands more than ×2.5 as the component value. |
| No fortification | ×1.0 | **SUPPORTED** | Baseline; open-field corpus resolves on levers and ratios alone. |
| Field works | ×1.3 | **SUPPORTED** | Agincourt stakes (#15) and Haengju's stockade (#19, after frontage) both sit at ~1.3–2.0 residual. Boundary problem, not value problem: Alesia's (#3) engineered double lines (towers, ditches, traps) clearly exceed ×1.3 — Roman-grade siege lines behave like town walls. See gap G1. |
| Town walls | ×1.8 | **SUPPORTED only with a wall-assault frontage rule; otherwise ADJUST to ~×2.5** | Jinju I (#18) implies ≥3.95 with a maxed defender lever; Ansi (#8) implies ≥25; Kuju (#12) qualitatively similar. Every overage dissolves once assault frontage (wall perimeter / breach width) is modeled. Baghdad (#24) and Jinju II (#20) confirm walls fall correctly at high R. Recommendation: keep ×1.8 AND extend the frontage cap to wall assaults. |
| Fortress | ×2.4 | **SUPPORTED — same condition** | Vienna (#23) direction correct; Gaillard (#11) falls with time; Namhansanseong (#22) never stormed (blockade win — see gap G4). ×2.4 is defensible as the assault-resistance component. |
| Legendary fortress | ×3.0 | **SUPPORTED** | Constantinople (#16) at product 3.0 falls at ratio ~8–10 — correct direction; Xiangyang (#14) held ~5 years and fell to tech + isolation, both mechanisms outside the ladder as intended. Both fit inside the ×6 clamp. |

## 5. Gap analysis — what the 5+5 ladder cannot express

| # | Situation | Historical evidence | Matters at sector scale? | Minimal fix |
|---|-----------|--------------------|-----------------------|-------------|
| G1 | **Engineered siege lines / circumvallation** blur the field-works/walls boundary | Alesia (#3): ×1.3 fails by ~40% even with Caesar at max lever | Yes — any "dig in around a siege" play recreates it | No new step: allow engineered lines to classify as town-wall grade (×1.8) when built over multiple turns; field works ×1.3 stays for one-turn entrenchment. |
| G2 | **Contested river crossing vs a deployed defender** — ladder has no river terrain, and attacker ×0.85 is mild | Fei River (#5): needed ~1.5–2.5 defender edge; Salsu (#6): army destroyed mid-crossing | Yes — river lines are core East-Asian campaign geography | Keep river OFF the terrain ladder (correct call); deepen the crossing penalty to ~×0.70 (strait parity) when the defender holds the far bank, ×0.85 otherwise. Salsu-class annihilations = crossing state + surprise lever, already expressible. |
| G3 | **Ground/weather condition** (mud, winter) | Agincourt mud (#15) [verified]; Ansi winter forcing Tang withdrawal (#8) [verified] | Marginal for battle resolution; real for campaign clock | Not a ladder row. If seasons exist at campaign layer, a single "bad ground" battle modifier (attacker −10–15%) covers Agincourt; winter belongs to the supply clock. |
| G4 | **Supply/blockade sieges** — forts historically fall to time, not assault ratio | Namhansanseong (#22), Xiangyang (#14), Masada (#4), Gaillard (#11): all decided by starvation, engineering time, or isolation | **Yes — biggest systemic gap.** Half the fortress corpus misfits pure-R | A siege/blockade mode where no R-assault is rolled and a supply clock runs (garrison supplies vs besieger supplies). Aligns with the existing design guardrail that conquest effects lag. Without it, players will (correctly) complain forts are either paper or unbreakable. |
| G5 | **Attacker siegecraft/tech asymmetry** | Xiangyang's counterweight trebuchets (#14), Constantinople's bombards (#16), Baghdad's engineer corps (#24) vs Ansi (#8): identical ladder steps, wildly different outcomes | Yes, if eras/tech tiers exist; otherwise foldable | MVP: fold into the commitment lever (a siege-train army commits "harder" vs walls). Cleaner long-term: an attacker siege-capability rating that discounts F (not T). |
| G6 | Marsh/wetland, urban streets, plateau edge | No corpus case where these were decisive independent of the above | No at sector scale | Fold: marsh → treat as hills ×1.2 "difficult ground"; urban fighting → part of the walls step; plateau edge → mountains or legendary natural. No new rows. |

## 6. Cap audit

**Standard ×4.0 clamp.** Candidates where the apparent effective multiplier exceeded ×4 at
a non-legendary site: Haengju (implied 5–6.5), Jinju I (≥3.95), Ansi (≥25), Hulao (5–17),
Kuju (uncomputable). On honest attribution, **every one dissolves into the separations**:
Haengju and Ansi into assault frontage (single slope; wall perimeter), Hulao into pass
frontage + fatigue + lever, Jinju I into wall frontage + gunpowder defense + a relief
scare on the final night [verified: Wikipedia — Gwak Jae-u's 3,000 irregulars]. **No clean
case of a pure terrain × fortification product above ×4 survives.** Verdict: the ×4 clamp
is defensible — but only as one half of a package with land-assault frontage caps. If
frontage caps do not apply to assaults on walls and passes, the corpus repeatedly demands
effective values of 5–25 and the clamp would be historically wrong.

**Legendary ×6.0 clamp.** Masada's composite (2.5 × 2.4 = 6.0) sits exactly at the clamp
and still falls at R ≈ 3 — correct, it did fall, slowly, to engineering. Constantinople
(3.0) falls at R ≈ 3.1 — correct. Diaoyucheng and Xiangyang held for years at ratios the
multiplier alone cannot express — and should not: their real defenses were self-supply
(fields and wells inside Diaoyucheng), peninsula/river frontage, and the attacker's need
for a tech breakthrough. **×6 is sufficient as the multiplier component; nothing in the
corpus demands more,** provided G4 (supply mode) exists so legendary sites can do their
historical job of absorbing years, not just points of R.

## 7. Recommendations

Concrete changes only where evidence demands them; all numeric adoption is a user decision.

1. **Adopt the ladder values as proposed** — with one scope extension, no numeric change
   is forced: plains 1.0 / hills 1.2 / mountains 1.5 / pass 2.0 / legendary natural 2.5;
   none 1.0 / field works 1.3 / walls 1.8 / fortress 2.4 / legendary 3.0.
2. **Extend the frontage cap to land assaults** (walls, forts, passes, single-approach
   hills), not just straits/chokes. This is the load-bearing companion rule: without it,
   town walls ×1.8 must become ~×2.5 and pass ×2.0 becomes indefensible, and the ×4 clamp
   contradicts the record (Haengju, Ansi, Jinju I, Hulao).
3. **Add a blockade/siege mode with a supply clock** (gap G4). Half of the fortress corpus
   is decided by time and starvation, never by assault ratio. This also lets legendary
   sites be legendary without inflating multipliers.
4. **Deepen the contested-crossing penalty** to ~×0.70 when the defender holds the bank
   (gap G2), keeping rivers off the terrain ladder.
5. **Classify multi-turn engineered lines as wall-grade** (gap G1) rather than adding a
   ladder step.
6. Flag, no action required: mountains ×1.5 is interpolated, not evidenced
   (INSUFFICIENT DATA); the ×2.0 lever cap is independently calibrated by Cannae; the
   one-exchange rout threshold (R ≈ 1.92) compresses multi-month fighting sieges into a
   single exchange — acceptable or not depending on turn length.

## 8. Principal sources consulted (this session)

- Wikipedia: Siege of Jinju (1592), Siege of Jinju (1593), Battle of Haengju, Battle of
  Ansi, Siege of Diaoyucheng, Battle of Hulao, Battle of Fei River, Battle of Tong Pass,
  Battle of Xiangyang, Siege of Masada, Battle of Alesia, Battle of Hastings, Battle of
  Agincourt, Fall of Constantinople, Battle of Vienna, Siege of Château Gaillard, Qing
  invasion of Joseon, Battle of Salsu, Battle of Thermopylae, Battle of Myeongnyang,
  Siege of Kuju, Battle of Chungju, Battle of Cannae, Siege of Baghdad (1258)
- deremilitari.org (Mongol siege of Xiangyang; Baghdad 1258 sources)
- Britannica (Alesia, Cannae, Hastings, Thermopylae)
- Anne Curry, *Agincourt: A New History* (2005) via Wikipedia/deremilitari reviews;
  Juliet Barker counter-estimates noted
- warfarehistorynetwork.com (Vienna 1683); chinaknowledge.de (An Lushan rebellion)

Items marked [knowledge-based, unverified]: Diaoyucheng garrison size; Philip II's army
size at Château Gaillard; the pre-1453 siege count for the Theodosian walls. None of
these carries a per-step verdict on its own.
