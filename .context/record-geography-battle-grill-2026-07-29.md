# Session record — the geography/battle grill (06c's registered gaps)

Written 2026-07-29. **Working layer**: this is a dated record of a grill, not a
seal. Every ruling below is listed with the birthplace it must reach; until it
lands there, the birthplace — not this file — is the thing to cite. Nothing here
is normative.

Entry point for the session: the four gaps ticket 06c registered rather than
filled (`5340d60`, "register what it found unrecorded"). The intended agenda was
"resolve what blocks 06d and 07". What actually happened is that three of the
four turned out to be one structural question, and answering it closed ticket
07's blocker and opened a Wayfinder pass.

## Where we are

**Ticket 07 is unblocked.** Its blocker — "only 27 of 56 sectors can ever be a
battle site, so a majority of matches have no legal way to attack the capital" —
is resolved by the rulings below, along the second of the two paths the debt row
named (a defensive-ground source for interior sectors, rather than
adjacency-derived fronts).

**The build is not blocked by anything this session opened.** 06d is
`ready-for-agent`; the loop can close on adjacency pushing. Operational
manoeuvre (below) was never inside gate 08's slice definition.

**One pass was opened, not resolved:** operational manoeuvre. Frontage was
deferred into it rather than built or abolished.

## The vocabulary this session needed

Three distinct things were being called "bypass" (우회), and the conflation was
the session's main source of confusion. They are separate mechanisms with
separate preconditions:

| Name | Meaning | Precondition | State |
|---|---|---|---|
| **Bypass A — target substitution** | attack a *different* sector instead | the realms touch at ≥2 sectors | already free; needs no mechanism |
| **Bypass B — approach substitution** | attack the *same* sector from a different neighbouring sector | the *target* has ≥2 reachable neighbours | measured: 0 extra turns on 20/20 land doors |
| **Bypass C — transit past** | do not attack it at all; march past and continue | a route exists | possible today, and **nothing can stop it** (R14) |

D9's `Removability` obligation ("chokes historically fail by deletion, not
attrition") means **A and C**. Bypass B is not required by D9 or M11; it entered
the design as part of an earlier reading of the approach rule and is now retired
(ruling 3 below).

Measured on `terrain-cradle@r1`, all 15 legal partitions: contested edges 4–9,
distinct contact sectors **7–16**, partitions with a single contact sector **0**.
Bypass A therefore always exists on this map — a property of the authored map,
not a guarantee the rules make.

## Rulings — user-sealed 2026-07-28/29, birthplaces owed

### 1. An engagement is sited wherever a hostile force stands

Combat is per **sector**, and the site is a sector predicate: an engagement
exists where an invading force stands on ground it does not hold. It is no
longer gated to the endpoint sectors of authored region borders.

Evidence that made this necessary — measured, 30 realm-seats over all 15 legal
partitions: **100%** could enter enemy ground without standing on a single
fightable sector; mean **21.2** enemy sectors reachable with zero battles;
**41 of 45** authored-marker capitals reachable with zero battles.
`movementOrderRefusal` has no ownership check, so an army marches through enemy
land unopposed.

The resolution grain was never the problem — `engagement.ts` already states "the
unit of resolution is the SECTOR, not the front", and `engagementsOf` already
fires on presence (`standing.sides[invader].men > 0`). The single gate was that
candidate sites were seeded from `contestedFronts`. Interior sectors were
excluded because they had no defensive ground to fight over, which ruling 2
supplies.

**Birthplace:** ADR (new, 0046) — cross-feature model change, and the mandatory
ADR trigger applies because it is what makes the capital-fall win condition
reachable. Amends **ADR 0043**; stamp 0043's header per the supersession
protocol.

### 2. Terrain is a property of the ground (안2)

**A sector's defensive terrain is its own authored terrain, always.** It does not
depend on how the attacker arrived. The door contributes the attacker-side terms
only — crossing penalty and (when it exists) frontage.

This matches the calculator's existing separation: `defensePower(side, terrain,
fortification)` is the ground the defender stands on; `attackPower(side,
crossing)` is what the attacker did to get there.

The `terrainLayer` → M5 table. All 56 sectors are **terrain-uniform** (0 sectors
carry more than one layer), so a sector has one well-defined terrain. Six of
seven layers derive with no new value; `mountain` matches a sealed rung by name:

| authored layer | sectors | → M5 rung | × | derivation |
|---|---|---|---|---|
| plains | 24 | Plains | 1.0 | same name |
| steppe | 8 | Plains | 1.0 | open ground; M5 has no steppe rung |
| desert | 9 | Plains | 1.0 | a desert's price is logistics, not defence (R16) |
| oasis | 1 | Plains | 1.0 | an economic feature, not a defensive one |
| river-valley | 5 | Plains | 1.0 | **not** the `river` border class's 0.70 — that prices an opposed crossing, not the ground |
| highland | 6 | Forest / hills | 1.2 | same archetype as M5's `hills` rung |
| mountain | 3 | **Mountains** | **1.5** | same name; M5's rung, sealed 2026-07-03, never used before because nothing read a sector's terrain |

Status **AGREED**, values **가안**, validation **L0**. M5's own `†` on Mountains
×1.5 ("interpolation — keep flagged for playtest attention") already carries the
provisionality the user asked to record. What would settle the table: the map
re-authoring (below) and playtest.

`mountain` is **not** Taishan. Taishan's 4 hexes and the 52 `rangeHexes` belong
to **no sector**, so they are not nodes in the movement graph — there is no
adjacency to them at all, which is the "you do not even think of it as adjacent"
the user wanted, already built by construction. The three `mountain` sectors are
all in 관중 (r6) and are all three of its pass endpoints:

| sector | terrain | econ/pop | door |
|---|---|---|---|
| r6_s0 | mountain | 0.5 / 0.5 | pass → 서역 |
| r6_s3 | mountain | 0.5 / 0.5 | pass → 하북 |
| r6_s5 | mountain | 2.3 / 2.1 | pass → 중원 |
| r6_s1 / r6_s4 | plains | 1.02 / 0.97 | — |
| r6_s2 | plains | 1.02 / 0.97 | **open → 촉** |

Under 안2 the passes become **asymmetric** — 관중's mountain sectors defend at
1.5, the plains/desert sectors on the far side at 1.0. At 1,800 v 900 that is
R 1.33 defending 관중 versus R 2.00 defending 중원's r1_s0. 四塞之地 comes out of
the ground rather than out of the door, and the 중원 plains sector stops
collecting a defile bonus it has no geographic claim to.

**Birthplace:** terrain-cradle `RULINGS.md` — a new ruling (TC-⑮) that **amends
TC-⑬'s terrain column** and carries the table above as a *binding*, citing M5 for
every value (TC-⑬'s own shape). TC-⑬'s **crossing column is untouched**: river
0.70 and strait 0.55 stand, and a river-door battle is numerically unchanged
(R 1.40 at 1,800 v 900, before and after).

Why amending TC-⑬ is honest rather than a reversal: TC-⑬ was sealed 2026-07-08
to replace a **hardcoded constant** — its own words — and the door was the only
authored geography available then. The door terrain was a proxy for a sector
terrain source that did not exist. It exists now.

### 3. Approach is recorded, and no longer softens the ground

The approach an attacker took is a first-class input, recorded as the **hex arc**
traversed (`{fromHex, toHex}`) — a value movement already computes. Recording it
at hex grain is what leaves room for the directional terrain the user wants
later (river current, ravine axis, ridge facing) without changing the input
contract.

Under ruling 2 the arc no longer selects the defender's terrain. It remains the
source of the attacker-side terms (which door, if any, was crossed) and the
carrier for future directional reads.

This retires the earlier **reachable-weakest-link-over-approaches** reading
(bypass B), for two reasons found this session: it is free (0 extra turns on
20/20 land doors, ≤2 extra fatigue), and it let a hex-grain fact drive a
sector-grain outcome — 100 flanking men swung R from 0.56 to 2.22, a 4×
swing. TC-⑬'s reachable-weakest-link still governs what it was sealed for:
choosing among **doors** when a sector is served by more than one.

**Birthplace:** ADR 0046 with ruling 1 (same contract).

### 4. Commit is allocated per sector, not per front

`Allocations` keys on the **sector**, not the front key. The definition already
said so — commit is "the share allotted to **that engagement**", and engagements
are atomic per sector — and the reconciliation code 06c had to write for case 4
(two fronts pouring chips into one sector) disappears. The order-key namespace
already mixes kinds (`ORDER_RECRUIT:<id>`), so sector ids fit it.

Without this, an interior engagement has no key to receive chips, and "interior
battles cannot use commit" would become a rule nobody decided.

Why sector and not hex: the stack is **20** per realm per turn, and a realm holds
**21–35 sectors** but **105–187 hexes** (measured over all 15 partitions). At hex
grain the allocation unit is finer than the resource — it would not be an
allocation. ADR 0032 (front sector = operational atom) and `schema.ts` ("hexes
are physical space only — values live on sectors") say the same thing from the
authority side.

**Birthplace:** ADR 0046. The turn-structure feature-doc birthplace is still owed
(existing SYNC-DEBT row); when it is created, this ruling folds into it.

### 5. Design principle — hex is physical, sector is decisional

Promotion **approved by the user 2026-07-28**. Each new field is keyed by asking
which of the two it is:

| field | what it is | key |
|---|---|---|
| movement destination | the endpoint of a physical march | hex |
| approach arc | which boundary was actually crossed — a fact about matter | hex pair |
| terrain multiplier | the *interpretation* of that fact | sector |
| commit allocation | the allocation of judgement | **sector** |
| engagement resolution | the result of judgement | sector |

Movement orders naming a hex is not a counter-example but the principle working:
a march is a physical act and its destination is a physical coordinate, whereas
commit is the division of command attention and its object is a confrontation,
which is sector-atomic.

The principle decided two separate questions this session (the approach-arc shape
and the commit key), which is the recurrence that made it a promotion candidate.

**Birthplace:** `DOMAIN_MAP.md` § Design Principle — a summary + pointer entry,
per the single-definition rule.

### 6. Rout displacement — (ii) + (v)

`battle.ts` computes `escaped` (open-escape survivors, `OPEN_ESCAPE_REMAINDER_LOSS
= 0.5`) and **nothing consumes it**, so a routed force stands on the same hex.
Ruling 1 promoted this from a gap to a defect: a force that stays is re-engaged
every turn, so "stay" becomes annihilation and M4's escape clause becomes a lie.

The axis is **not** attacker/defender. It is **who entered this sector this
turn**:

| who | has an arc |
|---|---|
| an invader | always, by definition |
| a defending field army that reinforced this turn | yes |
| a defending field army that was already there | no |
| **a garrison** | **never, structurally** — nothing marches one (06b) |

Garrison-only defence is *the common case on this board* (06c item 5), so the
no-arc branch is the main path, not a fallback.

- **(ii) Anyone with an arc falls back along it** — one sector, the way they came.
- **(v) Anyone without an arc leaves service and stays on the register** — they
  drop out of `serving`, the register is unchanged, and they become draftable
  civilians again.

Why (v) rather than a retreating garrison: a routed defender only routs when the
attacker wins (`defenderRouted` requires `attackerWins`), so **a routed garrison
is by definition a garrison that lost its sector** — a locality-fixed shield with
no locality left. Keeping them in service needs somewhere to belong, and every
candidate is an undesigned system: the capital guard (Part 2 #10, ticket 07
`needs-info`) or a garrison that can retreat (a mobile-garrison system 06b/06c
explicitly refused). (v) also keeps rout distinct from death — 06c item 11
removes the dead from the register permanently, and blood is permanent currency
by SPEC.

**What (v) costs, stated correctly (re-ruled 2026-07-31 after ADR 0044 was
found).** An earlier draft of this record claimed that a conquered province pays
neither side "until (if ever) `homeland` converts", and that the conqueror's
access to the register was an open question owned by 06d. **Both were wrong**, and
the user confirmed (v) a second time knowing the real consequence:

- **ADR 0044** (2026-07-26, gate C) seals that acquired land transfers everything
  it carries — population, economy, **the conscription register share**, the
  mobilization base — on the ADR 0022/0029 ripening lag. It **amends OG-③**: limbo
  is the interval before integration, not a terminal state.
- **Ripening applies to productivity, not to bodies** (item 3). The register
  transfers **unripened**.
- **ADR 0045** amends item 4: civilians transfer with the land, while a serving
  force's province-origin composition stays with that force.

So (v) moves routed survivors out of `serving` and into the civilian body count of
ground that is about to change hands — which means a proportional share of them
becomes the conqueror's draftable population, immediately. The alternative
considered and **not** taken was returning survivors to their *origin* province's
register (06c item 11 already keeps per-formation province origins), which would
have carved an exception into ADR 0044's "quantities derived from land travel with
it". The user chose to keep the principle unbroken; the conqueror still pays the
draft price and the action capacity to use those bodies, and ADR 0044 item 4's
proportional succession already blocks the sharp edge (a bled-dry province cannot
hand its taker fresh men).

**Registered, not ruled:** that every survivor leaves service is a *consequence
of scope*. The user's judgement that some should stay soldiers is recorded; the
fraction can only become a value once a destination exists. Morale is not
available as its basis — R13 (2026-07-26, the user's own ruling) parks it with
"do not implement a morale term in the 06 family".

**Birthplace:** war-model-build `RULINGS.md` (the build-side home for slice-2
combat behaviour), with the registration on `docs/SYNC-DEBT.md`.

## Refuted or corrected during the session

Recorded because each was stated before it was checked, and the corrections are
load-bearing.

- **"A majority of capitals cannot be attacked" (06c's registered finding) is
  backwards.** They cannot be *defended*: 41 of 45 are reachable with zero
  battles. The direction of the error matters for what the fix is.
- **`choke.cap` is not M11's frontage cap.** `schema.ts` calls it a
  "Projectable-mass ceiling", and `Projectable mass` is **⛔ stale** under
  ADR 0042 — it fed the retired hegemony arithmetic. Its numbers mostly coincide
  with M11 because the author read M11, but `hills 1300` and `strait 800` appear
  in no M11 row. Reading it as the frontage cap would be origination dressed as
  assembly. M11 is the live authority and is keyed on `choke.class`, which the
  artifact already carries.
- **`Mountains 1.5` was called "a rung M5 does not have".** It is in M5's ladder,
  sealed and survey-validated. The correction changed ruling 2's outcome.
- **Frontage was recommended for this slice, then withdrawn.** See below.
- **Bypass was described as sub-sector wiggling.** It is not: the route genuinely
  passes through a third sector (`r1_s0 → r2_s3 → r6_s5`). It is free because one
  extra hex fits inside march speed 3 **and** transit through a third sector
  neither stops nor fights.
- **"Splitting a field army splits its commit."** It does not. Commit keys on the
  engagement, so two halves at the same site share one lever. Dispersion is
  priced by **multiplying fronts**, not by dividing armies —
  `commitment.ts` states it: "dividing the stack across fronts thins every point
  of it against an opponent who concentrates."
- **An accepted ADR was left uncited for three days, and this session repeated the
  failure.** ADR 0044 answers what conquered land pays and who gets its register.
  Ruling 6's first pass was argued from OG-③'s limbo rule as though that question
  were still open — see ruling 6 for the correction. The failure mode is the one
  `AGENTS.md` § Read Order warns about by name ("a decision recorded here and never
  cited is how the project has actually gone wrong before", ADR 0041 § Context).
  It has a mechanical trace, below.
- **Two debts drafted in this session were already discharged by 06d's ticket.**
  The `homeland` write-warning and the register's per-province restoration are both
  already checkboxes there, with ADR 0044 cited as the ticket's authority. They
  were withdrawn rather than registered. The lesson is the standing one: search the
  log before treating a question as open.

## Frontage — deferred into the Wayfinder, not abolished

D9 argues the cap deliberately: "a cap, **never** a multiplier — its impact is
unbounded (Thermopylae's ~15 m front equalized any army size; Myeongnyang's
strait cut 120+ ships to a handful), which is exactly why it must not multiply:
it *classifies* sectors rather than scaling them." The user's instinct that a
hard cap feels like men filing through in single file is the image D9 is built
on, not an argument against it.

Measured consequences of implementing it as-is:

- With cap 1,000 against a 900 garrison at `pass` 2.0, **R is pinned at 0.556**
  for any arriving force from 1,500 to 5,000. Terrain chokes carry no erosion
  link (M11's `+500 per −0.3` is on the *wall-assault* table only), so the door
  becomes frontally unforceable, permanently.
- Its escape valve is D9's `Removability`. Geometrically the map honours it —
  blocking a door's arcs still reaches the target on **24/24** doors — but the
  cost is **0 extra turns on 20/20 land doors** (straits alone cost 2–3). So the
  cap would be inert on arrival.
- Two readings were compared. Treating the cap as an **engagement** ceiling gives
  a cliff (100 flanking men flip R 0.56 → 2.22); treating it as a **door** ceiling
  (`min(door force, cap) + bypass force`) is smooth. The door reading is the
  better one and matches M11's wording ("engaged-**attacker-body** caps"), but
  under ruling 2 the terrain no longer flips at all, which removes the cliff
  independently.
- Ruling 2 also removes frontage's stated *justification*: TC-⑬'s "×2.0 is
  validated only as the residual AFTER a frontage cap" applies to a `pass` terrain
  value that 안2 stops using.

D9's three removal-path kinds are **bypass / timing-condition windows / tech**.
This map has only the first, free. That is the defect to fix, and it is upstream
of any cap value.

## The Wayfinder pass being opened — operational manoeuvre

Seven registered debts are one subject. Each currently says "owed: its own pass",
which is the signature of a missing pass rather than seven missing values:

| registered debt | the user's name for it |
|---|---|
| R14 — interception of a force in transit has no design (2026-07-26) | bypass C |
| Part 2 #2 Encirclement threshold + 06c's `escape` constant | 포위 섬멸 |
| R16 — the supply design pass | 보급로 차단 |
| TC-⑬'s frontage half (06c, 2026-07-28) | 문폭 |
| rout displacement (this session) | — |
| map resolution / intra-sector terrain (this session) | the price of bypass |
| bypass B's retirement (this session) | 우회 B |

They share one sentence: **the relationship between where a force is and where
the fighting is.** Position currently exists only as adjacency. D10 already
designs Encirclement's isolated-rout multiplier ("isolation removes the escape,
turning rout into annihilation") and 06c pinned `escape` to a constant, so the
pattern is designed-but-unimplemented across the whole set.

**The pass is parallel and non-blocking.** Ticket 07's blocker closed today, 06d
is ready, and gate 08's slice ("a real full-depth 1v1 match") never contained
operational manoeuvre. Playing one complete match is also what gives the pass its
evidence, instead of designing it from imagination — the same ordering lesson the
crisis pass produced (R14: the draw problem was upstream in the war system, not
in the crisis dials).

## Deferred / parked ideas

- **Asymmetric terrain** — ground that favours the *attacker* (multiplier < 1.0).
  M5's ladder is defender-ward only. A new axis; the user's example was cavalry
  deploying on steppe.
- **Directional terrain** — river current direction, and an attack-direction
  notion built on it. The hex-arc contract (ruling 3) is the seat left for it.
- **Formalising D9's removal-path obligation as a load-time invariant** — the map
  is checked by hand today; `load.ts` already carries comparable invariants.

## Debts to register

New this session:

1. **Map resolution needs re-authoring** (the user asked for this to be recorded
   first). What the map *cannot* express is terrain variation **inside** a sector;
   hard barriers already exist — Taishan's 4 hexes plus 52 `rangeHexes`, **56
   hexes belonging to no sector**. Evidence for why it matters: sectors average
   **5.2 hexes** against march speed **3**, so bypass costs **0 extra turns on
   20/20 land doors**, which makes any frontage cap structurally inert. Intra-hex
   features (rivers, ravines) need per-hex or per-boundary authoring, and TC-⑪
   froze the grid resolution — seed re-authoring tier, kind 3.
2. **06d's register succession has a hole its own checklist hides** (found by the
   user's question "why is the register per *province*?"). The ticket rules that
   R17's proportional formula is "**superseded rather than implemented**, because
   per-province accounting makes it exact: a captured province carries its own
   register to the taker." But **provinces are not captured — sectors are**
   (`Realm.sectors: SectorId[]`), and a province split across the front line is the
   normal case, not an edge case. Measured: 관중 carries pop 0.5 and 0.97 in one
   province, so a partial capture cannot carry "its own register" without a
   within-province apportionment — which is what R17 was for. So either R17 stands
   after all, or the register moves to sector grain (which is what MT-② already
   derives it from: `Σ populationValue` is a **sector** field). **Owed: a user
   ruling before 06d is claimed**, because it decides whether an accepted
   simplification survives. Ruling 6's register return lands at a sector too, so it
   shares the answer.
3. **Rout displacement's military/civilian split** (ruling 6's registration).
4. **Bypass B retired; approach no longer softens terrain** — the amendment
   record for TC-⑬, and the note that TC-⑬'s reachable-weakest-link survives for
   door selection.
5. **ADR 0044 has no reader in `game/src`, and two code comments contradict it.**
   `git grep` finds zero citations of 0044 in `game/src` (0045 is cited once, in
   `force.ts`). Meanwhile `economy.ts`'s `holdsOf` says there is "no seal saying
   whether one is needed" and `state.ts`'s `homeland` calls conversion "an open
   question owned by the ticket that first takes a sector". Both landed in
   `c44c98a`, **hours before ADR 0044 landed in `1593c32`** — same day, comment
   first, and nobody returned. 06d and 06e are the tickets that read them. Fixed in
   this batch; registered so the *pattern* is visible, since the same-day ordering
   is what made it invisible.

Withdrawn before registration (already discharged elsewhere):

- the `homeland` write-warning → already 06d's first checkbox, with ticket 05's
  deliberate hand-off quoted;
- the register's per-province restoration → already a 06d checkbox.

Updated:

6. **Frontage** — re-point the existing row at the operational-manoeuvre pass,
   and attach this session's measurements (R pinned at 0.556; 24/24 geometric
   removal paths at 0 turns on land; `choke.cap` is a stale field, not the cap).
7. **The battle-site row** — the **design** is discharged by ruling 1 and its
   direction corrected (capitals are reachable without a fight, not unreachable);
   the **implementation** is owed by the new ticket 06e, so the row stays open
   pointing there rather than being ticked.

## Doc-sync batch — what lands where

| # | Destination | Content |
|---|---|---|
| 1 | `docs/adr/0046-*.md` (new) | rulings 1, 3, 4. Amends ADR 0043 → stamp 0043's header |
| 2 | `docs/adr/0043-*.md` | `Amended by ADR 0046 (2026-07-29)` + one-line delta |
| 3 | `docs/features/terrain-cradle/RULINGS.md` | **TC-⑮** — ruling 2, amends TC-⑬'s terrain column; stamp TC-⑬ |
| 4 | `docs/features/war-model-build/RULINGS.md` | **WM-⑤** — ruling 6 |
| 5 | `DOMAIN_MAP.md` § Design Principle | ruling 5, summary + pointer |
| 6 | `docs/SYNC-DEBT.md` | debts 1–7 |
| 7 | `.scratch/l3-playable-build/issues/06e-*.md` (new) | **the implementation home for rulings 1, 2, 3, 4, 6** |
| 8 | `.scratch/l3-playable-build/issues/07-*.md` | blocker closed by ruling 1 |
| 9 | `.scratch/l3-playable-build/issues/06d-*.md` | `blocked by 06e`, and debt 2 as a claim-time ruling |
| 10 | `.scratch/l3-playable-build/README.md` | 06e's row, 07's status line |
| 11 | `.scratch/operational-manoeuvre/` (new) | the pass — destination, agenda, seam register, junction contract |
| 12 | `game/src/domain/economy.ts`, `game/src/domain/state.ts` | the two stale comments (debt 5). **Last**, per the user's instruction that corrections follow their grounds |

### The implementation home — ticket 06e (approved 2026-07-31)

Rulings 1, 2, 3, 4 and 6 need code and **no existing ticket owns them**; 06d's
seventeen checkboxes contain none of them, yet 06d cannot capture an interior
sector until ruling 1 exists, because no engagement can be sited there. They are
one subject — **the sector is the atom of combat**: where an engagement is sited,
what ground it is fought on, what the approach records, and what receives the
chips. So they land as a new ticket **06e**, between 06c and 06d, and 06d gains
`blocked by: 06e`.

Folding them into 06d was rejected: 06d already modifies ticket 05's landed code
across seventeen items, and "capture" is a different subject from "atom".

Then `npm run lint:docs`, the term-inventory patch for any re-statused term
(ritual duty 7), and a QUICKREF re-render only if this is treated as a lock point.

## Verification state at the time of writing

Nothing in `game/src` has been changed by this session — it is a design grill.
Baseline on `main` (post-06c, `96d5929`): `verify:game` all lanes PASS with
parity PENDING by design, test:node **206**, test:browser **21**, root
`npm test` **513/513**, `lint:docs` **0 blocking**.

All measurements above were taken by reading `game/dist` and the authored
artifact directly; the probe scripts were scratch and are not checked in. Every
figure is reproducible from `CRADLE_R1` plus the exported calculator.

## Branch note

This record is written on `vocab/dashboard-build`, which does **not** contain
06c (`main` is at `96d5929`; the two have diverged, 6 commits here against 3
there). The seal writes in the batch above touch `docs/SYNC-DEBT.md` and the
06c-era ticket files, so they must be made on top of `main` — editing them here
would conflict with rows `main` already carries.

## Final-check closeout — 2026-07-31

A coverage audit at session close found four open items. Three were record-keeping and
one was a user ruling; all four are closed, and one of the three turned out to be a
genuine discovery rather than a missing note.

1. **Bypass B's status was recorded against the user's decision.** The tracker called it
   "retired" and named its return a regression, while the user had said all three
   bypasses are wanted. Two things carried the name: the **capability** (never retired)
   and one **implementation** of it (approach lowering the defender's terrain — what
   TC-⑮ actually retired). Corrected in the tracker and in the manoeuvre handoff, with
   the reconciliation stated: bypass B's consequence belongs to **frontage**, under the
   door-share reading, not to terrain. Left as it was, the next session would have
   treated what the user wants as forbidden ground.

2. **안2 weakened the gate, in the direction the user had just argued against — and
   nobody checked.** TC-⑬ validated `pass ×2.0` and the frontage cap as a pair; 안2
   retires the first and the second was never built, so the gate has neither. Troops
   needed to break a 900 garrison: **1,850** before, **1,400** on 관중's mountain side
   after, **950** on the far side. One turn earlier the user had asked whether gate
   defence was *too easy*. Accepted deliberately — raising it without a cap means
   reverting 안2, and one played match will say whether 950 feels cheap where numbers
   cannot. Recorded on the frontage debt row so the pass inherits the direction.

3. **The two baseline measurement tables existed only in this session's scratch.** The
   troops-needed table above and the commit table (garrison 900 → 16 of 20 chips; the
   equal-commit diagonal flat at R 0.83) are what "how strong should the gate be" will
   be measured against. Both now sit on the frontage row. The user's stated requirement
   — commit must be eaten heavily — is already structural, and that is now on the record
   rather than in a transcript.

4. **The register moves to sector grain** (user ruling). MT-② amended at its birthplace;
   R18 iii's grain clause amended; R17 superseded *for real*, since at sector grain a
   captured sector carries its own register and succession needs no formula. 06d returns
   to `ready-for-agent`, still blocked by 06e.

Process note: this closeout was written from a **separate worktree**
(`Terrain_Game-records`), because the 06e session held the main checkout with live edits
in `game/src` and the manoeuvre session held a second worktree. Neither session's files
were touched.
