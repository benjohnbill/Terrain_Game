# Research: First-Strike Prevention and Mobilization Visibility

Date: 2026-07-03
Status: research survey (no design decision made here)
Scope: (1) genre survey of anti-blitz mechanisms, (2) historical base rate of
strategic surprise, (3) defender-lag design literature, (4) verdict on the
proposed "mobilization visibility proportional to concentration size" mechanism.

Verification tags: [verified: source] = confirmed against a named source this
session; [knowledge-based, unverified] = from general knowledge, not
independently confirmed.

---

## 1. Genre survey — how games prevent first-strike dominance

| Game | Mechanism | Warning shape | Works? (community view) | Degenerate play |
|---|---|---|---|---|
| HOI4 | Justification timer + world tension | 6–9 months of visible "justifying on you" lead time; tension gates who may act | Yes as warning; leaky in MP | Justification sniping, double-justify exploit, house rules needed |
| EU4 | Casus belli; no-CB penalties (+20 AE, −2 stability) + coalitions | Cost-based, not time-based; claim fabrication gives weak signal | Deters casual no-CB, not planned ganks | No-CB rush before targets consolidate; instant dec with pre-massed armies |
| Civ6 | Surprise war = +50% grievances; formal war needs denouncement 5 turns prior | Denouncement telegraphs; casus belli discounts | Penalty is post-hoc, AI barely punishes it | Ancient-era surprise wars are near-free; grievances ignorable vs weak AI |
| AoW4 | Grievance-fueled war justification; unjust war = imperium/alignment penalties | Grievance ledger visible both ways | Mixed; players find justification logic opaque | Grievance farming (provoke trespass) to launder aggression |
| Advance Wars (AWBW) | Perfect information; first-turn advantage fixed by map design | Everything visible; no strategic surprise | FTA is a named, actively countered imbalance | None — FTA itself is the problem, patched with predeployed-infantry counters |
| Into the Breach | Total telegraphing of every enemy attack | 1-turn perfect forecast | Yes — celebrated; converts combat into puzzle | Game becomes deterministic puzzle, not a war of information |
| Unity of Command | Scripted scenarios; defender AI reacts to breaches, cuts supply | Turn-timer pressure replaces surprise | Yes for its scope | N/A (asymmetric scenario design) |
| Total War (WH3) | Instant declaration allowed; ambush stance hides armies with detection chance | Movement visibility is the signal; stances trade speed for concealment | Ambush loved; AI seeing through fog is a known complaint | Ambush-stance cheese vs AI pathing; instant dec + pre-positioned stacks |
| Diplomacy | Simultaneous adjudication; attacker needs support superiority to dislodge | No warning at all — but defense wins ties | Yes — canonical simultaneous-turn balance | Stalemate lines; all depth moves into negotiation/betrayal |

### Per-game detail

**HOI4** — Justifying a war goal takes ~6–9 months base, costs political power,
and raises world tension; tension in turn gates what democracies (100% WT) and
non-aligned nations (50% WT) may do, and unlocks guarantees (25–40% WT) and
lend-lease (50% WT) [verified: hoi4.paradoxwikis.com/World_tension,
gamerempire.net]. The target sees a top-of-screen alert that someone is
justifying on it and can check war goals in the diplomacy tab
[verified: Steam community discussion "Why can't I see when countries justify
war goals on me?"]; edge cases where visibility is delayed at low world tension
exist [knowledge-based, unverified]. Community consensus: the system exists "so
you don't just sweep up the world as a strong nation" and "to give a player a
chance to defend," but MP communities layer house rules on top because
justification exploits (double-justification glitch, early-game justification
for tempo) are recognized cheese [verified: Steam HOI4 discussions, YouTube
"Double Justification Glitch"]. Degenerate patterns: **justification sniping**
(declare the moment your timer completes, before guarantees land) and
tension-manipulation metagames [knowledge-based, unverified as named terms;
exploit family verified via Steam threads].

**EU4** — No warning timer at all: declaration is instant if you hold a CB.
No-CB war costs +20 base aggressive expansion and −2 stability, halved with
full Diplomatic ideas, and habitual no-CB play triggers coalitions
[verified: eu4.paradoxwikis.com/Casus_belli]. The real signal is physical:
armies visibly massing on the border, and MP guides tell players to stay "on a
partial war footing at all times, with border forts at full maintenance"
[verified: Steam MP warfare guides]. Fog of war is explicitly used to conceal
approach routes for surprise declarations [verified: Steam guide]. Lesson: a
pure post-hoc diplomatic price without a warning timer pushes all defense into
permanent paranoia — the defender pays the readiness tax every year forever.

**Civ6** — Surprise war multiplies warmonger/grievance penalties by +50%;
formal war requires a denouncement made at least 5 turns earlier, an explicit
anti-bypass rule ("so you can't denounce into instant formal war")
[verified: civilization.fandom.com Casus Belli page, civ6.fandom.com Formal
War, CivFanatics]. Penalties scale up by era — ancient-era surprise wars are
essentially free [verified: fandom wiki]. Community verdict: because penalties
are diplomatic-reputation only and the AI cannot fight well, surprise war is
routinely worth it; grievances do not stop a prepared human
[verified: CivFanatics thread "So they still haven't fixed the AI with regard
to war"]. Lesson: **pricing surprise without empowering the defender does not
prevent blitz** — it only annoys third parties.

**Advance Wars / AWBW** — In a perfect-information game the first-strike
problem does not disappear; it condenses into **First Turn Advantage**, a
formally named imbalance the competitive community corrects with map-design
counterweights (Player 2 predeployed infantry, income tuning, symmetric maps)
[verified: awbw.fandom.com/wiki/FTA, Xmo5's map design guide]. Lesson: even
with total visibility, whoever concentrates force first wins tempo — visibility
alone is not the counterweight; the defender must also get a structural rebate.

**Into the Breach** — Deliberate total telegraphing: "when every enemy attack
is telegraphed and there's no random chance... the game starts to feel like a
puzzle," which was the designers' explicit intent (every death is your fault)
[verified: Game Developer / Road to the IGF interview with Subset Games].
Lesson: full information is a valid design, but it buys puzzle-depth by selling
the entire surprise axis. A game that wants both reading-skill and surprise
must keep the signal *partial*.

**Unity of Command** — The defender AI problem is easier than the attacker AI
problem ("a purely defensive AI is a much easier problem to tackle"; attacking
requires multi-turn intent) [verified: Armchair General interview with the UoC
developers]. Surprise is replaced by scripted scenario asymmetry plus a turn
timer. Limited transfer to a symmetric duel, but it confirms that reaction is
structurally simpler than initiation — a defender given *any* timely signal can
respond with less planning depth than the attacker needed.

**Total War (WH3)** — Declaration itself carries no timer; the visibility layer
is physical (armies on the map) plus a concealment economy (ambush stance hides
an army but has terrain- and proximity-based detection chances)
[verified: totalwarwarhammer.fandom.com/wiki/Ambush_stance, Steam discussions].
Lesson: a concealment *stance with detection risk* is a workable "deception as
the price of surprise" primitive; the community complaint is when the AI cheats
past it, i.e. the signal contract must be honored symmetrically.

**Diplomacy** — Pure simultaneous adjudication with a defender-favoring
resolution rule: equal force bounces, the attacker must assemble *superior*
support to dislodge, and support can be cut by attacking the supporter
[verified: Wikipedia, UltraBoardGames rules]. There is zero mobilization
warning — and the game compensates by making unsupported first strikes simply
fail. Lesson: in simultaneous-turn systems, **resolution-rule defender bias is
a substitute for warning time**. A game can spend its counterweight budget on
either (or split it, as the proposed 4-layer defense does).

### Genre synthesis

Three counterweight families recur: (a) **warning timers/visibility** (HOI4
justification, Civ6 denouncement window, Total War physical movement),
(b) **post-hoc prices** (EU4 AE/stability, Civ6 grievances, AoW4 alignment),
(c) **structural defender bias** (Diplomacy tie-goes-to-defender, AWBW FTA
counters, frozen fortifications everywhere). Consensus pattern: (b) alone
fails against a prepared aggressor; (a) alone gets sniped at the timer edge;
robust designs stack (a)+(c). The proposed design already has (c) in its
frozen/reserve layers; mobilization visibility supplies (a).

---

## 2. Historical base rate of strategic surprise

| Case | Buildup visible? | Warning existed? | Failure type | What surprise bought |
|---|---|---|---|---|
| Barbarossa 1941 | Yes — 3M+ men on the border | ~87 credible warnings incl. Sorge's near-exact date | Decision failure (Stalin's preconception + suppression by Golikov) | Catastrophic early operational gains; not strategic victory |
| Pearl Harbor 1941 | Fleet movement concealed (radio silence, open ocean) | Signals existed but drowned in noise (Wohlstetter) | Signals/noise + decision failure | Tactical success; strategic mobilization of the victim |
| Yom Kippur 1973 | Yes — canal-side concentration observed | Excellent sources incl. Hussein's warning | Decision failure ("the Concept") + attacker's cry-wolf deception | 48–72h of initiative; crossings succeeded, war still ended near military defeat |
| Imjin 1592 | Yes — 158,000 men staged at Nagoya, open threats from Hideyoshi | Envoys reported invasion prep; court split, dismissed as pirate-scale bluster | Decision failure (tributary-order preconception) | Seoul fell in ~3 weeks; war still lasted 6 years, invasion ultimately failed |
| Normandy 1944 | Impossible to hide *that* an invasion was coming | Germans expected invasion — wrong place | Attacker's active deception (FORTITUDE/FUSAG) manufactured misinterpretation | 22 German divisions pinned at Pas-de-Calais for weeks after D-Day |

Sources: [verified: CIA Studies in Intelligence review of *What Stalin Knew*;
Warfare History Network; Wohlstetter *Pearl Harbor: Warning and Decision* via
SAASS/NPS summaries; Brookings and Agranat Commission material on 1973;
Wikipedia/UCLA Korean History on Imjin; Britannica/IWM/Wikipedia on FORTITUDE;
Operation Badr (1973) Wikipedia + globalsecurity.org for the Egyptian deception
plan].

### Key findings

1. **Concentration at invasion scale was visible in essentially every land
   case.** Barbarossa, Yom Kippur, and Imjin all featured buildups the victim
   physically observed. The one case where the *force* itself was hidden (Pearl
   Harbor) was naval, exploiting the ocean as a concealment medium.
2. **Warning failure was overwhelmingly decision failure, not sensor failure.**
   Betts' core thesis: surprise attacks succeed "not because intelligence
   services fail to warn, but because of the disbelief of political leaders";
   accurate signals are always in the pipeline before the failure
   [verified: Brookings *Surprise Attack*; Betts, "Analysis, War, and Decision"].
   Wohlstetter's complementary mechanism: true signals drown in noise
   [verified: SAASS summary]. The Agranat Commission blamed "doctrinaire
   adherence to the konzeptziya," not missing data [verified: Brookings,
   tandfonline].
3. **Surprise at scale required active deception by the attacker.** Egypt ran
   repeated mobilize-demobilize exercises through 1973 — two Israeli false-alarm
   mobilizations cost ~$10M each and manufactured alarm fatigue, so the real
   October concentration was read as another exercise [verified: Operation Badr
   Wikipedia, globalsecurity.org]. FORTITUDE built a fictional 150,000-man army
   group with fake radio traffic and double agents [verified: Britannica, IWM].
   Whaley's *Stratagem* (100+ cases, 1914–68) is the standard quantitative
   study coupling deception to achieved surprise [verified: book exists,
   archive.org/Artech; the specific "deception nearly always yields surprise"
   statistic is knowledge-based, unverified].
4. **What surprise buys is initiative measured in days-to-weeks, not victory.**
   Every surprised victim in the table survived the first blow except where
   already structurally weaker (Joseon still recovered the peninsula with Ming
   help and naval interdiction). Surprise is a tempo loan, repaid with interest
   when the victim mobilizes.

**Answer to the design question:** History strongly supports "concentration is
inherently visible; surprise at scale requires active deception OR the victim's
refusal to believe." Both halves are load-bearing: the signal always existed,
and it was defeated either by attacker-manufactured ambiguity (Badr, FORTITUDE)
or by victim preconception (Barbarossa, Imjin, the Concept). A game mechanism
that emits the signal truthfully is historically grounded; the *interesting*
part history adds is that the signal should be ambiguous enough that ignoring
it is a real temptation, and that attackers should be able to buy ambiguity.

---

## 3. The defense-response lag question

- **IGOUGO alpha strike is the named pathology.** Miniatures/wargame design
  discussion treats "the player who goes first can set up an overwhelming Alpha
  Strike... before the opponent can react" as the central IGOUGO flaw
  [verified: TMP thread, Blood and Spectacles design blog, Matrix Games
  forums]. Uncompensated one-turn defender lag is considered bad design at
  tactical scale.
- **But pure WEGO has its own pathology**: units blunder into each other,
  "rogue units get a week of movement with no reaction possible" — plotted
  simultaneity without reactive doctrine feels random, not fair
  [verified: Matrix Games forum threads].
- **The accepted fix is WEGO + reactive standing behavior.** Combat Mission
  plots orders, then runs a 60-second simultaneous window in which the TacAI
  makes defenders return fire, seek cover, pop smoke, and evade *without player
  input* [verified: Wikipedia, Combat Mission fandom wiki, Steam discussion].
  The defender's *doctrine* reacts on time even when the defender's *mind*
  reads the situation late.
- **Diplomacy shows the resolution-rule alternative**: with strictly
  simultaneous secret orders, defense wins all ties and attackers must
  assemble support superiority; the defender's lag is zero by construction
  [verified: Wikipedia, rules sources].
- Forum consensus phrasing worth keeping: "one side will take the initiative,
  and the other side will be reactive" is realistic — the design sin is not
  defender lag itself but defender lag *without standing defensive behavior*
  [verified: Matrix Games IGOUGO/WEGO threads].

**Mapping to the 4-layer defense:** the design already implements the Combat
Mission answer at strategic scale — frozen investments and the same-turn
reserve are the TacAI analog (always-on-time doctrine), while the full lever
and distant flows are the plotted layer that can be late. Genre practice says
this decomposition is sound; the remaining exposure is exactly the unread
full-lever case, which is what mobilization visibility addresses.

---

## 4. Verdict on "mobilization visibility proportional to concentration size"

**Verdict: adopt.** The mechanism sits at the intersection of the strongest
genre pattern (warning-time + structural bias, §1) and the strongest historical
finding (concentration is inherently visible, §2). It is more honest than
HOI4's abstract timer — the signal is generated by the physical act of
concentrating rather than by a diplomatic meter — and it inherently preserves
the raid/invasion asymmetry the design wants: raids sneak because they never
cross the visibility knee; invasions rumble because they must.

### Recommended magnitude shape

- **Tiered thresholds over a raw continuous number.** References converge on
  legible bands: HOI4 world tension acts through discrete gates (25/40/50/100%)
  [verified: wiki]; Civ6 uses discrete war types; Total War uses a binary
  stance with a detection *chance*. Recommended: 3 tension bands per border
  sector (quiet / restless / rumbling), driven by a continuous concentration
  measure underneath so creeping buildups still move the needle. Bands create
  decision points and feintable edges; the hidden continuous core prevents
  exact stat-counting at the boundary.
- **Lead time 1–3 turns, scaling with size.** HOI4's 6–9 months is roughly
  "several strategic turns" of warning and is the genre's accepted feel;
  history's warning windows (weeks of visible buildup) agree. A crossing-scale
  invasion should be visible ~2–3 turns out; a probe ~1 turn or not at all.
- **Signal content: magnitude band + border sector only.** No composition, no
  exact timing, no target province. Scouting refines (this matches the
  fog/estimate-range design already merged). This is the Wohlstetter guard:
  the defender gets a *signal*, not an answer.
- **Make responding cost something.** The historical drama is decision failure
  under a cry-wolf economy (Israel's $10M false mobilizations). If reacting to
  the signal is free, the signal plays the game for the defender. The
  same-turn reserve cap and lever economics already price this — keep it so
  "do I believe the rumble?" is a real spend decision.
- **Sell ambiguity to the attacker at a price.** Surprise at scale should
  remain purchasable via deception, per FORTITUDE/Badr: e.g. an "exercises"
  posture that emits invasion-grade tension without an attack (cry-wolf
  pressure on the defender's reserve budget) and/or a costly signal-dampening
  action with a detection chance, Total War ambush-style. Deception being an
  *action with upkeep and risk* is the historically correct price tag.

### Failure modes to avoid

1. **Surprise becomes impossible.** Guard: keep the lowest band genuinely
   silent (raids and small probes emit nothing), and never leak the target
   province at any band. First-strike-vs-unread stays intact by design intent.
2. **Signal spam / alarm fatigue as a bug instead of a feature.** If every
   turn shouts tension at the defender, it becomes UI noise and players tune it
   out — an accidental Wohlstetter. Guard: bands change rarely (hysteresis),
   and changes are the event, not levels.
3. **Free perfect intel.** If the signal exposes composition/axis/timing, the
   scouting layer and the entire uncertainty axis of situation judgment die.
   Guard: coarse content, refinement only through scouting spend.
4. **Attacker-side free cry-wolf.** If feint concentrations cost nothing, the
   dominant strategy is permanent maximum tension everywhere, which re-kills
   the signal. Guard: concentration itself must carry upkeep/opportunity cost
   (troops massed at border A are not defending border B — the symmetric-flows
   rule already provides this).
5. **Timer-edge sniping (the HOI4 lesson).** If a defender benefit switches on
   at a fixed moment after the signal, attackers optimize declaration to land
   just before it. Guard: defender readiness should scale continuously with
   time-under-warning, not unlock stepwise.

### One-line summary

History says the rumble is real and the failure is in the listening; genre
practice says give the warning, bias the resolution toward standing defenses,
and make both believing and deceiving cost something. The proposed mechanism
does exactly this — its risks are all in the tuning, not the concept.
