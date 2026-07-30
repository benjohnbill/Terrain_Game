# Choke Removal Economy — What D9's Obligation Already Names, and What Is Actually Missing

Status: research input (non-normative; no value here is a seal, and nothing here
rules on a mechanism)
Date: 2026-07-31
Scope: surveys D9's `Removability` obligation against what the design corpus
actually authored, for the operational-manoeuvre pass
(`.scratch/operational-manoeuvre/`). Commissioned because the pass's opening
handoff states that two of D9's three removal-path kinds "do not exist anywhere
in the design" — this checks that claim before the pass designs from it.

**Read this before writing the pass's removal-economy gate.** The claim that
prompted the survey is half right, and the half that is wrong changes the
question the gate should ask.

**Revised the same day**, after the geography-battle grill session relayed its
own correction: bypass B was **deferred, not retired**, and its consequence
belongs inside frontage under the **door-share** reading. That reading is now § 5,
and it changes how § 3 and § 4 should be read — the terrain family's exchange rate
is not missing, it is degenerate. The survey's findings and the grill's
measurement **compose**: the removal paths exist *and* they are free.

## 1. Summary of findings

1. **D9's obligation is discharged on paper for every capped archetype.** M11's
   third column is the removal-path authoring D9 demands, and it is filled in for
   all five capped rows. The pass does not need to invent removal paths. (§ 2–3)
2. **The dominant authored kind is not in D9's taxonomy.** D9 names *bypass,
   timing/condition windows, or tech*. Four of M11's seven authored paths are
   **paid construction** (road building, the Crossing plan's bridging, port
   staging) or **naval control** — a kind D9 never names. Meanwhile
   timing/condition windows and tech are used by **zero** M11 rows. (§ 3)
3. **The design contains one *quantified* removal economy and it is on the wall
   family.** M11's wall-assault caps carry an erosion link (each −0.3
   fortification erosion widens the cap +500); the terrain chokes got authored
   removal-path *names* and no arithmetic beside them. (§ 4)
4. **But the terrain family does have a rate — it is degenerate, not absent.**
   Under the **door-share** reading the grill measured, force arriving by another
   approach is not capped at all, so bypass *is* the terrain cap's removal path
   and detour cost *is* its exchange rate. On `terrain-cradle@r1` that detour
   costs **0 extra turns on 20 of 20 land doors**. Zero turns buys unlimited
   uncapped force. (§ 5)
5. **Tech is well evidenced in the corpus; timing/condition windows are not
   evidenced at all.** Two documented tech-step cases already sit in the repo's
   own research, and tech has a named seat in code (`UNIFORM_QUALITY`). For
   timing windows the corpus is empty, and the one deferral that touches them
   routed them through a channel that structurally cannot carry a choke effect.
   (§ 6, § 7)
6. **This survey and the grill's measurement compose; they do not compete.** The
   paths exist *and* they are free. **The zero is the subject, not their
   absence.** (§ 8)

## 2. What D9 obliges, verbatim

`FORMULA.md` D9 (2026-07-03), on frontage as a cap at authored choke sectors:

> **Removability**: every frontage cap must have legible removal paths — bypass
> (the Anopaea rule: chokes historically fail by deletion, not attrition),
> timing/condition windows, or tech. A choke with no removal path is a design
> bug.

Three kinds are named. The obligation is on the *authoring*, and it is satisfied
by naming a legible path — not by implementing one. That distinction is what the
next section turns on.

## 3. What M11 actually authored

`MAGNITUDE.md` M11 (2026-07-03), terrain chokes, with its own third column
classified against D9's three kinds:

| M11 archetype | cap | authored removal path | D9 kind |
|---|---|---|---|
| Open border | none | — | n/a (uncapped) |
| Forest trail | 1,500 | bypass via adjacent open ground | **bypass** |
| Forest trail | 〃 | road building (economy) | **none of the three** — paid construction |
| Pass / defile | 1,000 | side-path sector bypass (the Anopaea rule) | **bypass** |
| River crossing point | 1,000 | another crossing point | **bypass** |
| River crossing point | 〃 | the Crossing plan's bridging | **none of the three** — paid construction |
| Strait | 500 | port staging +500 | **none of the three** — paid construction |
| Strait | 〃 | naval control (deferred navy) | **none of the three** — a deferred system |
| Legendary choke (authored) | 300–500 | "authoring must name its removal path" | delegated to the author |

Three readings follow, and they are the survey's substance.

**(a) The obligation is met.** Every capped archetype carries at least one named
path. By D9's own terms none of these is a design bug, and "this map has only
bypass" is not what M11 says — it is what the *implementation* has.

**(b) M11 mostly used a fourth kind D9 does not name.** Road building, bridging
and port staging are all the same shape: **spend something and the cap moves**.
That is neither going around (bypass), nor waiting for a condition (timing), nor
acquiring a capability that voids the term (tech). It is a purchase. D9's
taxonomy has no slot for it, and it is the majority of what M11 authored.

Whether this is a gap in D9 or a fourth kind that should be named is a
**decision, not a finding** — recorded here as the pass's question, not answered.

**(c) Neither of the two kinds the handoff calls missing is used by any M11 row.**
Timing/condition windows: zero rows. Tech: zero rows. So the handoff's "the other
two do not exist anywhere" is accurate *about M11's authoring* and inaccurate as
a statement that removal paths are missing. The precise claim is narrower and
sharper: **M11 discharged D9's obligation without ever using two of the three
kinds D9 offered.**

`legendary choke` is worth noting separately: it discharges the obligation by
*delegating* it to the map author. `terrain-cradle@r1` authors no legendary
choke, so the row has no referent today.

## 4. The one working removal economy in the design

Immediately below the terrain table, M11's wall-assault caps carry something the
terrain table does not:

| Tier | Assault cap | Erosion link |
|---|---|---|
| Field works | 3,000 | each −0.3 fortification erosion widens the cap +500 |
| Town walls | 2,000 | 〃 |
| Fortress | 1,500 | 〃 |
| Legendary fortress | 1,000 | 〃 |

This is a removal **economy**, not a removal **name**: it says what you spend
(erosion, itself produced by fighting), what you get (+500 of engageable body),
and at what exchange rate. M5's unification is the reason — "`fortificationDamage`
erosion both lowers the multiplier and widens the assault frontage — breaching the
wall means both."

The asymmetry, stated plainly: **the fortification choke got an exchange rate and
the terrain choke got a list of nouns.** Both were authored on the same day, in
the same ruling, under the same D9 obligation.

For the pass, this matters twice. It is a **precedent** — the shape a terrain
removal economy could take is already demonstrated once inside M11. And it is a
**warning** — the wall economy works because erosion is a quantity the resolution
already produces, whereas none of road building, bridging, or port staging
corresponds to any quantity the board currently computes.

## 5. The door-share reading — the terrain family's economy is bypass, priced in detour

Added 2026-07-31 after the grill session relayed its correction; it changes the
reading of § 3 and § 4 rather than adding to them.

The tracker's § *Bypass B is deferred, not abolished* records the reading the grill
measured, which matches M11's own wording ("engaged-**attacker-body** caps"):

```
engaged attacking substance = min(force that came through the door, that door's cap)
                            + force that arrived by any other approach
```

Under this reading the cap is **per door**, not per engagement, and force arriving
by any other approach is simply **not capped**. Three consequences for this survey:

**(a) Bypass is not merely "go elsewhere" — it is the cap's removal path, and it
is continuous.** Routing part of a force around a door removes that part from the
min(). The grill's measurement shows the smoothness: at cap 1,000 against a 900
garrison, 100 flanking men give R **0.81** and 600 give R **1.19**, where reading
the cap as an engagement ceiling instead jumps straight to **2.22**. So M11's
bypass rows are not a weaker kind of removal path than the wall family's erosion
link — they are an exchange rate too.

**(b) Which means § 4's asymmetry is sharper than "an exchange rate versus a list
of nouns".** The terrain family does have an implicit rate: *detour cost buys
uncapped force*. The defect is that on `terrain-cradle@r1` the detour costs **0
extra turns on 20 of 20 land doors**, so the rate is not missing — it is
**degenerate**. Zero turns buys unlimited uncapped force. That is worse than an
absent economy, because an absent one at least fails visibly.

**(c) It relocates where the pass's work is.** If bypass is the economy and its
currency is detour cost, then the paid-construction paths of § 3 (road building,
bridging, port staging) are not the primary economy — they are *additional* paths
for cases where no detour exists (a strait has no side road). The primary lever is
the price of going round, and that price is set by **map depth** and by **R14
interception**, both already registered as this pass's upstreams.

This is the sense in which this survey and the grill's measurement compose rather
than compete: **M11 authored a removal path for every capped archetype, and on
this map those paths are free.** The paths exist. The zero is the subject.

## 6. Tech steps — the corpus is already strong

Tech is the one D9 kind with real evidentiary support in the repo, which is worth
recording so the pass does not re-survey it:

- **Constantinople 1453** — cited at M5 as the headline: "the counters (erosion,
  starvation, bypass, tech steps) ignore the multiplier and keep every stack
  mortal — Constantinople fell to a tech step."
- **Xiangyang / Fancheng 1273** — `research/real-war-multipliers.md` records
  counterweight trebuchets built by Persian engineers breaching Fancheng in
  roughly a month, after a siege that had held for years; the file's own reading
  is that the fortification multiplier was "*stepped over* by a technology tier".

So the *principle* is sealed and evidenced. What is absent is a tech **system**:
`MAGNITUDE.md` puts technology in the quality term, and the quality slot is
`UNIFORM_QUALITY = 1` in `game/src/domain/engagement.ts` — deliberately pinned,
with its comment stating that slice-2 rider (b) ports the slot at 1.0 and defers
the technology system, and that TC-⑭ forbids a per-realm figure with nothing to
derive it from.

**Classification: unbuilt with a known seat, not undesigned.** A tech removal path
would arrive through the quality slot, and the seat is already named in code.

## 7. Timing/condition windows — genuinely empty, and the one deferral misroutes

Unlike tech, this kind has **no** supporting entry anywhere in the corpus. The
nearest thing is a deferral, and its routing is the finding:

`war-model-build/RULINGS.md` records, among the rejected and deferred candidates:
"**season/winter — deferred (acts through the supply channel)**", and
`research/fatigue-factors.md` reached the same disposition — season, terrain
weighting and camp tier all route through supply.

That routing is correct for what it was decided about (marching wear and
starvation) and **cannot express a choke window**. A condition window on a choke
changes what the door *is* — its cap, or its crossing term — for a bounded
interval. The supply channel changes how much substance survives to reach the
door. The two are different terms in the formula: ADR 0015's crossing multiplier
and D9's cap sit on the engagement, while supply sits on the substance arriving
at it.

The concrete case that shows the gap, and it is not exotic: **a frozen river.**
Winter converts a river door into ordinary ground — it voids ADR 0015's opposed
crossing rather than starving the crossers. Nothing in the supply routing can
represent that, because the supply routing never touches the crossing term.

One further observation, offered because it is cheap and it cuts at D9's own
example: **Myeongnyang is a tidal-window battle.** The repo cites it three times
for the cap (`RESEARCH.md` "Myeongnyang strait capped 120+ ships to a handful",
M11's confluence check, M5's Myeongnyang-class defense) and once for command
breakdown, but never for the mechanism the engagement actually turned on — the
strait's fast, reversing tidal currents, which Yi Sun-sin engaged with rather than
against. D9's headline example for *why a cap must not multiply* is simultaneously
the corpus's best available example of the removal kind D9 named and nobody used.

**Classification: undesigned, with the corpus empty and the one adjacent ruling
pointed at a channel that cannot carry it.** This is the kind that would need real
design work, and per the pass's ordering, not before ticket 13's match report.

## 8. The measurement that outranks all of it

From the geography-battle grill (`.context/record-geography-battle-grill-2026-07-29.md`,
and ADR 0046 § Context), measured on `terrain-cradle@r1`:

- blocking a door's arcs still reaches the target on **24 of 24** doors — so the
  map honours D9's obligation geometrically;
- but at **0 extra turns on 20 of 20 land doors** (sectors average 5.2 hexes
  against march speed 3); only straits cost 2–3 turns;
- and with cap 1,000 against a 900 garrison at `pass` ×2.0, R pins at **0.556**
  for any force from 1,500 to 5,000.

Set beside § 3 and § 5, this says something more specific than "the cap is inert",
and the composition is the point the grill session asked to be stated plainly:
**M11 does author a removal path for every capped archetype, AND on this map those
paths are free. The zero is the subject, not their absence.**

The two halves are independent findings that reinforce each other. If the paths
had been missing, the fix would be to author them — and § 3 shows they are
authored. Because they are present and unpriced, the fix is an economy: what going
round should cost. Under § 5's door-share reading that cost is the *only* term
standing between a capped door and an uncapped one.

The remaining paths that would carry a different kind of price — road building,
bridging, port staging, naval control — are unbuilt, and the erosion link that
prices the wall family's removal is not wired to the terrain family at all. So the
door is simultaneously frontally unforceable and trivially avoidable.

## 9. What this survey does not do

- It does not propose a removal mechanism, price one, or rank the authored paths.
  Per the tracker's § Ordering, the pass's design gates wait on ticket 13's match
  report.
- It does not rule on whether **paid construction** should be named as a fourth
  D9 kind, or whether D9 should be amended. That is a user ruling and it would
  need the amendment protocol.
- It does not touch frontage's **values**. M11's caps are 가안-sealed; what this
  survey is about is the economy around them.
- It does not price **bypass B** (approach substitution). B is **deferred together
  with frontage, not abolished**: TC-⑮ retired one *implementation* of it — an
  undoored arrival lowering the defender's terrain — and never the capability,
  which the user wants. Its consequence belongs inside frontage, under the
  door-share reading of § 5. Tracker: § Bypass B is deferred, not abolished.

## 10. Questions this hands the pass

Recorded as questions, in the order the evidence raises them.

0. **What should going round cost?** Under § 5's door-share reading this is the
   terrain cap's exchange rate, and it currently reads zero. Its two registered
   upstreams are **map depth** (TC-⑪ froze the grid, so seed-re-authoring tier)
   and **R14 interception** (price the transit). Listed first because every other
   question below is secondary to it.

1. Is **paid construction** an additional removal economy alongside bypass — the
   one that covers archetypes with no detour (a strait has no side road)? M11
   authored it for three of the four capped land archetypes, and D9's taxonomy
   has no slot for it.
2. If so, what quantity does it spend? The wall family's economy works because
   erosion is already computed; none of road building, bridging or port staging
   corresponds to anything the board computes today.
3. Should the **erosion link** generalize from walls to terrain, or is the wall
   economy deliberately specific to escalade (M11 exempts Deliberate Pressure and
   Flanking from the wall cap — is the terrain cap exempt from erosion by the same
   logic)?
4. Does a **condition window** need its own term, given that the design's one
   season deferral routes through supply and a frozen river is a crossing-term
   effect rather than a supply effect?
5. Does the **tech** path arrive through the quality slot (`UNIFORM_QUALITY`), or
   does a term-voiding tech step need a shape the quality multiplier cannot
   express? M11's rows use tech nowhere, while M5 cites Constantinople as the
   canonical stack-killer.

## Sources

Internal, all read 2026-07-31:

- `docs/features/combat-formula/FORMULA.md` § D9, D10
- `docs/features/combat-formula/MAGNITUDE.md` § M5, M11
- `docs/features/combat-formula/RESEARCH.md`
- `docs/features/combat-formula/research/real-war-multipliers.md`
- `docs/features/war-model-build/RULINGS.md` (deferral list)
- `docs/features/war-model-build/research/fatigue-factors.md` § Candidate 3
- `docs/features/operation-plan-catalog/CATALOG.md` § Crossing / Landing Securement
- `docs/adr/0046-the-sector-is-the-atom-of-combat.md` § Context
- `docs/SYNC-DEBT.md` frontage row — carries the grill's two baseline tables
  (troops needed to break a 900 garrison: **1,850** under `pass 2.0` uncapped,
  **1,400** on the 관중 mountain side, **950** on the far side; and the commit
  table where a 900 garrison needs **16 of 20** chips, with the equal-commit
  diagonal flat at **R 0.83**). Those are the baselines any removal economy this
  pass designs will be measured against; none of them is re-derived here.
- `.scratch/operational-manoeuvre/README.md` § Bypass B is deferred, not abolished
- `.context/record-geography-battle-grill-2026-07-29.md`
- `game/src/domain/engagement.ts` (`UNIFORM_QUALITY`), `game/src/domain/economy.ts`

External: the Myeongnyang tidal-current reading and the frozen-river case in § 6
are general military-historical background, offered as illustration of a
mechanism shape rather than as validated dial evidence. Neither is load-bearing
for any finding in § 1; both would need the corpus treatment
`real-war-multipliers.md` gives its cases before informing a value.
