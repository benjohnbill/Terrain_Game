# Decisions Owed Before the Build Runs

Layer: Working. Assembled 2026-07-25 from a demand-driven sweep: six read-only
agents started from the thirteen build tickets' contract pointers, enumerated
every value and rule an implementer would need, and searched the repository for
each. Roughly sixty gaps and conflicts came back. This file keeps only what the
**user must decide**, and states for each what nothing-runs-without-it means.

**How to read a row.** Every proposal below is either *derived from a
neighbouring seal* (the derivation is shown, so the user edits rather than
invents) or marked **no derivation available** — a genuine user call. The agent
originates no value. A row is not a seal; landing it at its birthplace is.

**Search caveat that shaped this sweep.** `docs/superpowers/` — 15 design specs,
18 plans — is Working-layer by the documentation law and absent from
`AGENTS.md` § Read Order, yet it carries mechanism detail with no Production
home. An earlier pass that read only the seal chain concluded whole areas were
undecided when they were merely filed outside it. Every sweep here searched it
explicitly. See the SYNC-DEBT row.

---

## Rulings received — 2026-07-25 (user)

Landed here the same session they were given, per the standing rule. These are
Working-layer records of a user ruling; each still owes a seal at its birthplace,
noted per row.

### R1 — Capital fall is an ordinary sector capture · § 1.1 CLOSED

"수도 함락은 말 그대로 땅을 점령하듯이 상대의 수도 섹터를 점령하면 그 순간 바로
이루어지는 것 … 일반적인 섹터 점령과 똑같으며, 별도의 추가 조건은 필요하지
않습니다."

No capital-specific threshold, no "overwhelming" gate, no special predicate. The
capital sector transfers under the same headline-bound binary control rule as any
sector, and the match ends the instant it does. What makes it hard is the guard's
magnitude, not an extra condition — consistent with CP-② item 7 (ordinary
garrison, larger magnitude) and item 8 (no hard floor, purely emergent).

*Owes:* a seal row at `docs/features/capital/`, and the retirement of CP-② item
5's "overwhelming decisive battle" phrasing — the *path* survives, the implied
extra bar does not.

### R2 — Non-combat orders are linear in commit; fixed per-action prices retired · § 1.2 grammar CLOSED, numbers open

"원래 의도는 유저가 행동력 수치에 따라 완전히 자유롭게 행동력을 분배할 수 있도록
하는 것 … 고정 방식은 폐기 … 커밋 하나당 구현되는 고유 수치가 있고, 투입하는
커밋에 따라 실제 구현 정도가 선형적으로 결정되는 구조"

The grammar question in § 1.2 is answered: **free allocation, priced by unit.**
Every non-combat order carries a **per-commit unit effect**, and what the player
pours in converts linearly into how much of that effect they get. This is not a
price list bolted onto D6.3 — it is D6.3's free pour extended to non-combat
orders, so one grammar now covers every order kind.

The user's worked examples:

| Order | Unit | Pouring N commit yields |
|---|---|---|
| Reconnaissance (normal) | 2 per sector | 6 → three sectors scouted |
| Reconnaissance (enhanced) | 6 per sector | 12 → two sectors taken straight to confidence 0.90 |
| Fortification | progress per commit | partial progress is **kept** — falling short of the next tier is not wasted, and pouring more simply arrives sooner |

Two consequences worth stating because they change how other rows read:

- **2 and 6 are not retired — they are re-cut as unit prices.** What is retired
  is "일반 정찰 = an action that costs 2". 즉시/강화 정찰 stops being a separate
  action with a fixed price and becomes a **grade** whose unit price is 6 per
  sector. That also resolves the memory record's internal contradiction: the
  graduated-versus-flat question dissolves, because cost now scales with *how
  many sectors* rather than with *which rung*.
- **Fortification's "no threshold" rule generalizes.** Partial progress being
  kept means non-combat orders have no all-or-nothing gate at all. A tier is a
  cumulative total to reach, not a minimum bid.

*Owed, half paid:* the recon unit prices **are now sealed** at
`docs/features/fog-of-war-discovery/MAGNITUDE.md` FG-M① (2026-08-03, still 가안
but no longer un-recorded), together with the precision each grade buys — which
this ruling never set. **The table above is this ruling's record of what the user
said, not a live price list; FG-M① is authoritative.** Still owed: a home for the
linear-commit grammar itself — it is a match-frame rule, not a fog rule, so it
belongs wherever the turn structure lands (SYNC-DEBT already tracks that home).
Unit numbers for fortification, recruitment, and supply remain unset by design;
tuned in play.

### R3 — Capital candidates: leaning to any owned sector · § 1.6 direction set, confirmation owed

The user set out the sealed reading first — each province's main city sector is
the candidate, so choosing a capital means choosing a *province* (five of them in
a 1v1 realm) and the sector follows. Then offered a design change: let the player
pick **any** sector they own, prompted at match start ("수도를 골라주세요") by
clicking their territory. Recommendation surfaces and benefit hints deferred.

Agent note on the trade, for the confirmation: the free-choice option **removes
§ 1.6 entirely** — the one-marker-per-province problem and r8's missing marker
both stop mattering, because eligibility becomes "any sector I own". It also
*strengthens* CP-② D1.4's sealed leverage-versus-variance axis, since forward and
rear stop being a five-way choice and become a real positional judgment across
~28 sectors. Its cost is that a capital can sit somewhere the map never authored
as a city, so the authored `capitals`/`cities` tables become advisory
(recommendation material, which the user has deferred) rather than the
constraint.

*Status:* **SEALED 2026-07-25** — the user confirmed the free-choice option
("자기 영토 아무 섹터나"). The capital candidate set is **every sector the realm
owns at match start**, chosen by clicking one's own territory under the sealed
simultaneous-commit prompt (CP-② D1.3), public from reveal (CP-② item 1).

Consequences, now load-bearing:

- **§ 1.6 closes and does not need its proposal.** Eligibility is ownership, so
  the one-marker-per-region count and r8's missing marker stop being constraints.
  The "read seat as the partition" proposal is withdrawn as unnecessary.
- **`CRADLE_META`'s `capitals` / `cities` tables become advisory.** They no
  longer gate placement. They stay in the artifact as authored map content and
  are the natural material for the recommendation surface the user deferred.
- **Ticket 02's acceptance item is amended** in the same batch: "from that
  realm's authored city/capital sectors" → any owned sector.

*Owes:* a seal row at `docs/features/capital/` amending CP-① item 3's
"the player picks one of the seat's main city sectors".

### R4 — Bot disposition has three axes, and variety comes from seeded randomness · § 1.7 reshaped

"봇에게 단순히 하드코딩된 상수를 부여해서는 안 됩니다." The disposition governs:

1. **how much action resource goes to reconnaissance** — a share of the commit
   stack, now expressible because R2 made recon linear in commit;
2. **how it judges inside the confidence band** — "낙관적 판단, 비관적 판단, 혹은
   중간값 판단의 **비율**";
3. **how often it takes a given action under similar conditions** — a frequency,
   not a fixed trigger.

One disposition ships for the slice, but "모든 플레이가 매번 똑같이 흘러가서는 안
된다" — variety comes from those frequencies plus randomness.

**This amends the sealed disposition (TP-② ②, AGREED 2026-07-08) rather than
merely applying it.** The sealed λ is a single point inside the band; axis 2 as
stated is a **distribution over** the band (a ratio of optimistic to pessimistic
to middling reads), and axes 1 and 3 are new dimensions the seal does not cover.
So § 1.7's gap closes in the opposite direction from my proposal: gate 08 was
right that disposition governs more than one thing, and the 2026-07-08 seal is
what needs widening.

**Determinism is preserved, and the mechanism matters.** ADR 0040 and gate 02
C02.10 bar rules from reading `Math.random()` or `Date.now()` — that is why the
archive bot `js/ai.js` was discarded. Randomness drawn from the **injected seed**
is not barred and is exactly what the seed exists for: a different seed per match
gives different play, the same seed replays identically. So the rule for the bot
is not "no randomness" but "**randomness only from the injected seed**", which
satisfies both the user's variety requirement and ticket 12's determinism
acceptance item. Ambient randomness stays forbidden.

*Owes:* a widened disposition seal at `docs/features/tactical-plan-ai/`
(GLOSSARY row + a ruling amending ②), covering all three axes and the
seeded-draw rule. Values — the recon share, the read-ratio mix, the frequencies —
stay unset and are tuned in play.

### R5 — Runtime authority and phase ③ · explained, § 1.3 proposal standing, § 1.4 CLOSED

The user asked what these two meant; they were separate items written adjacently.

- **§ 1.3 (Runtime interface)** — gate 02 sealed `currentActor` and out-of-turn
  rejection a week before the pivot made turns simultaneous. Proposal restated
  and standing: read `currentActor` as the current *phase*, and legality as "has
  this realm already locked this turn / is the commit window open". Gate 02's
  actual guarantee — the Runtime, not the caller, decides legality — never
  depended on alternation. **Confirmed as written 2026-07-25 → § R8.**
- **§ 1.4 (phase ③)** — **CLOSED.** "어차피 3단 티어가 중요하지 Phase 개념 자체는
  지금도 얼마든지 추정 및 수정이 가능하니까요." The three tiers are the substance;
  the circled numbers are vestigial. Drop the numbering rather than invent a ③.

### R6 — Per-ticket authority waiver: a resolved gate's § Answer is sufficient authority

**User ruling 2026-07-25.** The `README.md` § Hard readiness rule required, among
six conditions, that gate 12 first republish the accepted decision set into
Production documents. That condition was authored when this program's destination
was a plumbing **seam** handed off to other agents, and gate 12's publication
batch *was* the handoff. Two things have since changed: the destination was
redrawn to **one played match** (`.scratch/l3-first-match/map.md`), and gate
12 (a) is blocked behind `.scratch/doc-structure/issues/10`, which declares
itself `Status: BLOCKED — the gate itself is unsound` / `⛔ DO NOT EXECUTE`. So a
republication ritual protecting a handoff that no longer happens had become the
only thing standing between the program and its destination.

**The ruling.** A ticket may be set `ready-for-agent` **without** conditions 2, 3
and 6 when both of these hold:

> *Read `ready-for-agent` here as `status: open`.* The ruling's own words are left
> as recorded — a ruling is a record, and rewriting its text would be editing
> history — but the value was retired by ticket 14 R4 on 2026-08-03 and
> `scripts/audit-lint.js` check `ticketFieldDomains` now rejects it. The ruling
> itself is unchanged.

- **(i) sealed authority** — every Wayfinder gate the ticket cites is
  `resolved`, so its contract already exists in a sealed § Answer;
- **(ii) zero unlanded values** — no acceptance item needs a value or rule that
  is undetermined, in conflict, or recorded only outside the repository.

Conditions 1, 4 and 5 are untouched. The waiver changes **where the contract is
read from** — a resolved gate's § Answer instead of a republished Production
doc — and weakens nothing about agents inventing values: test (ii) *is* that
bar, now applied per ticket instead of program-wide. Gate 12's publication
becomes a doc-sync debt paid alongside the build rather than a gate in front of
it.

*Owes:* the `README.md` amendment (same batch), and a `docs/SYNC-DEBT.md` row
for the deferred gate-12 publication.

### R7 — Commitment is visible; the choice is not. And both-committed advances the beat · SEALED

**User ruling 2026-07-25**, on a question ticket 02's build surfaced: may a
player see that the opponent has finished committing, before the reveal?

> "상대방이 '지금 고민을 끝내고 커밋을 다 했는지 여부'와 같은 표시는 필요할 것
> 같아. 상대방이 얼마나 고민을 오래 하는지도 심리전 요인에 필수적이니까. 게임
> 표준이기도 하고. 그리고, 우리 게임 시스템 상에서도, 어차피 양측의 결정 완료가
> 끝나면 자동으로 턴이 넘어가는 것을 구현할 생각이기도 하니까."

**Yes — the fact of commitment is public; the content of the commitment is not.**
Three reasons, and the third is the largest:

1. **Deliberation is a read.** How long an opponent takes is signal, and a duel
   that hid it would delete a real layer of the contest. This makes the waiting
   period *itself* part of play rather than dead time.
2. **It is the genre's commit-and-reveal grammar**, which players arrive already
   fluent in.
3. **The system needs it regardless: both sides having committed is what
   advances the turn.** That is a statement about the turn structure, not about a
   status light — see the rider below.

*Scope:* this is the general commit-and-reveal rule, not a capital-beat special
case. Every later commit — orders, plans, the turn's chips — inherits it. Ticket
02 implements it for the capital beat; ticket 03 inherits it for turn commits.

*No clock is required, and none is introduced.* The indicator flips when a
commitment lands, so elapsed deliberation is read from the world rather than
timed. ADR 0040's bar on rules reading the wall clock stands untouched.

**Rider — this bears directly on § 1.3, and narrows it.** "양측의 결정 완료가
끝나면 자동으로 턴이 넘어간다" *is* the turn-advance rule: a turn ends when both
realms have committed, not when an actor is done. That is precisely the
re-expression § 1.3 has been proposing — read legality as "has this realm
committed this turn / is the window open" rather than as a single
`currentActor`. Ticket 02 also produced the implementation evidence: the capital
beat needed no turn order at all and gate 02's actual guarantee (the Runtime
decides legality) survived intact. § 1.3 is now one explicit confirmation away
rather than an open design question.

*Owes:* a home for the commit-and-reveal visibility rule alongside the
linear-commit grammar (same SYNC-DEBT row — both are match-frame rules awaiting
a birthplace).

### R8 — Turn legality is per-realm-per-turn, not alternating · § 1.3 CLOSED

**User confirmation 2026-07-25**, closing the proposal that had been standing
since the sweep (§ 1.3) and that R7's rider had already narrowed to a formality.

**The rule.** Legality in a simultaneous turn reads as **"has this realm already
committed this turn / is the commit window open"**. Gate 02's `currentActor`
keeps its name and its `ActorId` type, and is read as the **current phase** under
D6.2's three tiers. The alternating out-of-turn test does not exist: both realms
are legal callers at the same moment, and the two rejection reasons a turn needs
are *"this realm has already locked this turn"* and *"the commit window is
closed"*.

**What is unchanged.** Gate 02's actual guarantee — the Runtime, not the caller,
decides what is legal now — never depended on alternation, so it survives
verbatim. Nothing in its rationale (no caller cheats; a caller bug cannot
reorder the match) is weakened. The surface stays exactly three members; no
snapshot API and no subscription API appear.

**Why this was confirmable rather than a fresh design question.** Three
independent supports, none of them argument alone:

1. **R7's rider already sealed the turn-advance rule** — "양측의 결정 완료가
   끝나면 자동으로 턴이 넘어간다" *is* per-realm-per-turn legality stated from the
   advance side.
2. **Ticket 02 produced the implementation evidence.** The capital beat needed no
   turn order at all; its legality rule is already "has this realm locked yet",
   and both actors are legal callers simultaneously. Test: `both actors are legal
   callers at the same moment` in `game/tests/match-setup.test.js`.
3. **Ticket 03's acceptance item 8 was written expecting this answer**, verbatim.

*Effect on readiness:* this was the single row failing R6 test (ii) for ticket
03. The waiver table flips and ticket 03 becomes buildable.

*Owes:* the same birthplace as R7 and the linear-commit grammar — one
turn-structure home for all three match-frame rules (SYNC-DEBT row already
registered; the `currentActor` row is now sealed rather than proposed).

## Rulings received — 2026-07-26 (user)

### R9 — The realm's military substance is born in ticket 05 · § ticket-05 scope CLOSED

The sweep that produced this file did not notice that **`MatchState` holds no
military state at all** — no treasury, no field army, no garrisons — and that the
authored world ships `garrison: 0` and `fortTier: 'none'` on every sector. Ticket
05's force limit therefore capped nothing and ticket 06's battle had nothing to
fight with. Neither ticket claimed the gap.

**The rule.** Ticket 05 owns the birth of realm substance: **treasury, the
land-derived force limit, the conscription register, the starting field army and
border garrisons, and recruitment as an order.** Ticket 06 receives forces; it
does not invent them.

The start state is fully derivable from sealed values, so this widens scope
without originating anything: force limit = `capPerPop 600 × Σ populationValue ×
usablePop` (M14), field starts at **f₀ 0.5** of it and garrisons at **g₀ 1.0**
(M13a/MT-④), border garrisons at **900 per border sector** (M13a; the archive
seeds per front, interior sectors carry none), register = `registerPerPop 1,800 ×
Σ populationValue` (MT-②). Measured on `terrain-cradle@r1` at a 5+5 region
partition: force limit **18,000**, field start **9,000**, income **≈30.3
yield/turn**.

**Three boundaries drawn with it**, so the ticket does not grow past its mandate:

- **The capital guard stays in ticket 07.** Part 2 #10 (가안 350 × pop versus
  `MAGNITUDE.md`'s flat `capitalGarrison 1500`) is already scheduled there;
  seeding it here would import that conflict into 05.
- **Garrison regeneration stays out.** MT-⑤ made it a commit-gated order and
  MT-①'s P1 bills it — but nothing in 05 damages a garrison, so the order would
  be a repair tool for something that cannot break, bought with one more
  unrecorded unit price. **P1 lands in 05 as an invariant instead**: no code path
  adds men for free, every man added is billed, and a test fixes it. The order
  itself arrives with ticket 06, where garrisons first take damage.
- **초토화 (scorched earth) stays out.** P2 also lands as a negative invariant —
  no path in 05 permanently damages a sector's economy. Building the identity act
  as an order is a system, not wiring (§ The scope test).

*Owes:* the ticket-05 acceptance list is amended in the same batch; the waiver
table row is recomputed.

### R10 — 행동력 converts to recruitment at +1%p per point, and nothing caps the turn

The agent proposed a linear unit **capped at the Band-1 +10%/turn**, and the user
rejected the cap: pouring the whole stack into one order must be possible, because
that is what makes commitment a real allocation rather than a menu. "커밋 값은
기본적으로 하나의 단위에 대한 곱연산."

The cap was an agent misreading, and the correction is in the repository. `M13`
carries the line struck through — `~~recruitment +10% of cap per turn~~ → Band-1
base of the Surge Draft Model (MT-③)` — and the archive's own comment reads "+10%
of cap **per primary**", not per turn. There has been no rate cap since MT-③
replaced the flat rate with the price curve.

**The rule, which is a sealed value rather than a new one.** MT-③'s Size axis
already carries **"Surge exchange rate +1%p/point (가안)"**. R2's re-cut removes
the primary/surplus split, leaving it as the whole grammar:

> **one 행동력 point = +1%p of the force limit, recruited. No per-turn cap.
> The full stack of 20 buys +20%.**

It reproduces both of MT-④'s sealed tempo anchors, which are both the time to
fill from f₀ 0.5 to full (50 percentage points): all-in 20 points = +20%/turn =
**2.5 turns** against the sealed "surged 2–3"; a knee-sized 8–10 points =
+8–10%/turn = **5–6 turns** against the sealed "plain buildup 5".

What binds a draft is therefore **money and bodies**, never a rate: the four mins
of the affordability bound (headroom to the force limit, treasury via MT-③'s
integral price over 동원 강도, and bodies = register − serving). Measured
consequence on this board, and the reason the curve is worth keeping: at Band-1
base price the all-in draft costs ~18 yield against ~30 income, so early
recruitment is unconstrained — but filling toward the force limit drives
mobilization intensity to ≈58%, exactly MT-④'s structural-max knee, where the
price doubles and the same draft costs ~36 yield. **The last stretch of a full
army is deliberately unaffordable from income alone.**

*Also recorded:* the agent's earlier claim in conversation that "the rate binds,
not money" came from the same misreading and is withdrawn.

*Owes:* a seal row for the 행동력 → recruitment unit at MT-③'s birthplace
(`combat-formula/MAGNITUDE.md` M13), noting R2's flattening of primary/surplus.

### R11 — Four archive-only numbers adopted as 가안, to be repaid in play

Ticket 05's recruitment path needs numbers that live **only in
`mockup/combat-calc/econ.js`** — the Part 3 pattern exactly: the design sealed the
shape and the numbers were filled in during implementation and never came back.

| Value | Archive | What is actually sealed | Status |
|---|---|---|---|
| `menPerYield 200` — 1 부대 = **100 men** | `econ.js:22` (its comment claims M13) | M13 seals only "1 부대 = 0.5 yield"; the unit's headcount is nowhere | **가안 adopted** |
| ~~`treasuryStart 5` yield~~ | `econ.js:26`, marked 가안 | ~~nothing~~ — **both halves of that premise were wrong**, see the correction below | **withdrawn 2026-07-26** |
| surge `warMult 2` / `fullMult 12` | `econ.js:68–69`, "placeholder 가안" | MT-③ seals the shape and MT-④ the knees (0.42 / 0.58); the multipliers were deferred to a magnitude session that never ran | **가안 adopted** |

**User ruling.** Accepted as *"원리상 도출되는 가안"* — provisional values whose
scale may move, adopted because the MVP has no cheaper way to get a running
economy, and repayable by play rather than by argument. The user recorded
discomfort at taking archive numbers wholesale; that discomfort is the reason this
row exists rather than a silent import.

**Correction, same day (found by the ticket-05 code review).** The treasury row
was adopted on a false premise and is **withdrawn**. Two seals speak to it and the
sweep behind R11 cited neither:

- `MAGNITUDE.md` **M14 ruling ㉑** already seals "start 생산 5 (가안, playtest
  owns)" — so the value was never archive-only, and R11's stated reason for
  adopting it ("nothing is sealed") was false.
- terrain-cradle **TC-⑭** (2026-07-08), the derived-asymmetry seal beneath SPEC
  principle #8, then supersedes ㉑'s *form*: every playable quantity starts
  uniform across realms unless the inequality is read off the authored map, and
  it names treasury as one of its two worked examples —
  **`treasuryStartTurns × terrain-fed economy`**. A flat per-realm constant is
  exactly the shape that seal forbids.

**What was built instead:** the sealed derived form, `TREASURY_START_TURNS = 3 ×
the realm's own income` (the multiplier is the harness's Option B figure, already
SYNC-DEBT-registered). This is a correction *toward* a seal rather than a new
decision, so it did not wait — but it changes R11's answer, and the user may
overrule it. M14 ㉑ is stamped as amended in the same batch.

*Owes:* `menPerYield` and the surge multipliers needed birthplace seal rows —
**paid 2026-07-26** at `MAGNITUDE.md` M13. The treasury row is superseded rather
than owed.

---

## Rulings received — 2026-07-26 (user, Wayfinder gate C)

Gate C was opened to grill Part 2 **#14** and **#15**, the two kind-1 seal
conflicts blocking ticket 06. Both are closed below. R12–R15 resolve #14, R16–R17
resolve #15.

### R12 — Movement enters the slice, priced in turns and fatigue, not commit · #14 CLOSED

**Position exists.** The field army occupies a place, and it can be the wrong
place. What made this a live question is narrower than the row recorded: the
landed build resolves a front from **chips alone** (`readFronts`), while the
sealed battle formula is `substance × commit lever × quality × fatigue` — so no
rule anywhere said how *substance* reaches a front. That, not hex marching, was
the gap.

**Two layers the row conflated, and the seals already separate them:**

- the **math** is hex-denominated — `DOMAIN_MAP` `Position as product` itself says
  "Hexes keep doing movement *math* … as calculation substrate", and TC-⑪ froze
  the resolution;
- the **order** is destination-grain — slice-2 §3: "destination only; pathing is
  automatic shortest passable route. No per-hex micromanagement."

So "hex or sector" was never one question. Hex math, destination orders.

**Movement consumes no commit.** Its price is turns + fatigue. Four grounds:

1. Commit is a **multiplier** (the M2 lever), and a march has no multiplicand —
   pouring chips does not make an army arrive *better*, only arrived or not.
2. R2's linear-in-commit grammar grades an outcome (sectors scouted, fort
   progress, men drafted). Movement's outcome is binary, so the grammar has
   nothing to grade. This is not an exception carved out of R2; it is an item R2
   never caught.
3. Slice-2 §3 already prices movement's *graded* part — forced march — in
   fatigue, and refuses a second resource in as many words: "**The wallet is the
   fatigue gauge itself — no third resource.**"
4. §4's enumeration of what commit buys (development, attack, defense,
   reconnaissance) **omits movement**.

**Amends `DOMAIN_MAP` ✅ `Position as product`:** its "no standalone move action"
clause is retired. What that entry was protecting survives intact — no per-hex
micromanagement (orders are destination-grain) and no movement turn-toll before
an attack (R14). The amendment is recorded in ADR 0043; the entry keeps its
Tier-0 summary+pointer form.

### R13 — March fatigue accrues per hex

Distance-proportional, not per-turn-on-the-road: *"피로도가 이동 거리에 비례해서
발생한다고 보는 게 깔끔해 보여서."* This is also the archive's rate basis (per-hex
accrual), so the basis is carried rather than invented; the rate **value** stays
in the Part 3 bulk-approval batch.

Recorded forward: distance and supply are expected to compose into a fatigue
amplification later. **Morale (사기) is parked** — commit is judged to already
absorb part of it, and whether a separate device is needed at all is its own
grill, not this gate's business.

### R14 — Commit legality is reachability, and arriving does not cost the turn

Any force that can **reach** a front by resolution time may be committed to it.
An army two-thirds of the way to a front and arriving next turn may take next
turn's attack or defense commit now. The user's general form: *"전장이 확대되거나
전장에 접근 가능한 상태인 군대는 언제나 공격/방어 등의 커밋과 바로 연결이 가능해.
접근성에 따라 판단하면 될 듯."*

**Zero new mechanisms — this is the sealed reach cone with a second caller.**
`js/intel.js reachCone(graph, fixKey, turnsUnobserved, speed)` is a BFS to radius
`turns × speed`. Fog asks it "where can the enemy be next turn"; legality asks it
"can I be there this turn". One computation, two questions.

Grounds: slice-2 §3's forced-march clause — "arrival fatigue already prices the R
sacrifice" — *presupposes* arriving and fighting in the same turn, because
otherwise there is no R to sacrifice into. And a game where arrival always costs
a turn telegraphs every offensive, which removes surprise from the uncertainty
duel (ADR 0025).

Legality is Runtime-owned (gate 02), so an unreachable front is an illegal order
the Runtime rejects and the UI greys — the caller does not police itself.

**Confirmed by lookup rather than ruled:** a front with no field army still
fights. M2 seals `0 points = ×1.00` — "an unattended garrison fights at its own
strength." A field army marching away does not leave an open door.

### R15 — The movement model

1. A destination order produces **one route**: minimum **cost** on the hex graph.
2. The route is split into turns by **cost fraction**, not distance fraction, so
   a mountain turn covers fewer hexes than a plains turn. Today the two readings
   coincide, because of item 6.
3. **Redirect is free at any time.** A new destination recomputes the
   minimum-cost route from the current position. Fatigue already spent is not
   refunded — that is the whole price of changing your mind, and it needs no new
   device because fatigue is already a spend ledger.
4. The UI shows the field army's current position explicitly.
5. **Substance at a front = the detachment(s) present or arriving.** Being in two
   places requires §4's free division. Derived, not ruled: no new rule.
6. **Terrain cost is uniform 1.0 today.** The authored per-hex terrain is a
   region-painted placeholder — whole regions were painted one layer at a time,
   which is why 116 of 292 hexes are `plains` and five or six regions are
   uniformly so. A cost table built on it would harden the placeholder into a
   rule. The extension point is hex-denominated and waits on the terrain-authoring
   pass, which produces a new world revision (`r2`): TC-⑪ froze orientation and
   resolution, not terrain values.
7. **The movement graph is hex adjacency ∪ the authored edges.** Measured: the pure
   hex graph has **two** components — 274 hexes (r1–r9) and 18 (r10) — because only
   15 of 17 authored edges are hex-adjacent at their endpoints. The two that are not
   are both `strait`, and both are the doors into **r10, an island**. Hex-only
   pathfinding therefore rejects every march into r10 as unreachable, and item 3's
   "an unreachable order is rejected" would report that defect as correct
   behaviour. All 17 edges are links; the 15 redundant ones are cheaper to include
   than to special-case, and `choke.cap` still bounds projectable mass through the
   door.
8. **Speed stays at the archive's 3 hexes/turn — no new value.** Measured on
   `terrain-cradle@r1`: reinforcement 1–2 turns (own depth → own front, median 3 /
   p75 5), invasion 2–3 (own front → enemy sector, median 5 / p75 7), lateral
   redeployment 3–4 (front → front, median 8 / p75 10). Fast local response against
   costly redeployment is the spread that makes position matter; speed 2 makes
   redeployment 4–5 turns and speed 4 drops it to 2–3. This lands in the **Part 3
   bulk-approval** batch rather than as a new value, and because the reach cone's
   radius is `turns × speed`, approving it settles a fog dial at the same time.

### R16 — Conquered land transfers fully, and ripens · #15 CLOSED

**What transfers: everything the land carries** — population, economy, the
conscription register share (R17), and the mobilization base. This is a direct
consequence of the Tier-0 principle **land-derived state**: if population and
economy are derived from land, they travel with it. The user: *"영토가 귀속된다는
것은 그 땅에 속한 인구와 경제력도 함께 귀속됨을 의미하기 때문입니다."*

Mobilization intensity needs no rule — it is already a derived ratio in the code
(`marginalPrice(intensity)`), so it re-reads itself from the new totals.

**Speed: the ADR 0022 / 0029 ripening lag, unchanged** — fresh capture at 50%
usable economy / 60% usable population, +10pp per stable turn. Instant full
transfer is not an option: the `AGENTS.md` guardrail bars it directly ("Avoid
treating conquest or control as an instant full-value transfer").

Ripening applies to **productivity** — income and the force limit — per 0029's own
wording ("yield AND military ceiling"). The register is a body count, not
productivity, and transfers unripened.

**Framing correction (user):** the lag is not a risk device. It is the fruit
arriving slowly. The agent had promoted 0029's "counterattack window" phrase into
an anti-runaway mechanism; the user rejected that reading.

**What this does to the three seals in play:**

- **OG-③'s limbo stops being terminal.** Conquest becomes the transfer channel
  that settlement used to be. OG-③ still governs the interval before
  integration; it no longer describes an end state.
- **D5.3 dissolves rather than being overridden.** Its "land loss does not shrink
  the register" was *deduced* — limbo is permanent → the only transfer channel is
  settlement → a duel has no settlement → therefore the register never moves. The
  first link is now false, so the chain unwinds without a seal having to lose.
  D5.3's own flagged L3 watch ("lost half my land, why is my register intact?")
  is resolved in the direction it worried about.
- **M14 ⑮'s conclusion survives its grounds.** ⑮ argued cap growth from "96% of
  matches never trip the hegemony check" — a check ADR 0042 retired. The
  conclusion (conquest raises the cap) is re-grounded here on land-derived state
  rather than on match closure, because closure is now carried by capital fall
  plus the D6.4 land decay.

**Snowball: accepted as inherent to a conquest game.** The counterweight is
explicitly *not* to be found in limiting growth from land. Three directions are
recorded as input to a later session and **deliberately not designed here** (user
ruling: designing them now would stretch the session):

- (a) **the defender's structural advantage** — already mechanical, and confirmed
  by lookup: M5 gives defense up to ×2.0 terrain × ×2.4 fortification = **×4.8**,
  while M2's commit lever is symmetric at ×1.00–×2.00. At equal commit the
  defender holds a large asymmetric edge the attacker must pay for in substance.
  The formula being a product is what makes levers cheaper than mass.
- (b) **holding out, then counterattacking into an Opening** (the sealed situation
  axis).
- (c) **breadth costing cognitive load**, and coarsening the commit-allocation
  unit so the risk unit grows with the realm. This one has no device anywhere and
  is the genuinely new work.

*Owes:* a research-only survey of precedents for (a)–(c), user confirmation, then
a document. Not a design pass.

### R17 — The register succeeds in proportion to the accumulated stock

On capture the taker gains `loser's current register × (transferred population ÷
loser's total population)`, and the loser's register falls by the same amount.
Conservation, on OG-③'s R2 rider ("conservation holds both ways … never silently
discarded").

**Not** the land's nominal `1,800 × populationValue`. A province already bled dry
would otherwise hand its taker fresh bodies — resurrecting dead men as the
enemy's draftees, and breaking the SPEC principle that blood is permanent
currency.

Zero new state: no per-sector register is needed. A realm-level stock spread
proportionally across its own population *is* the accumulated-state reading the
user asked for — *"상대방이 축적해 온 … 기반 상황을 통째로 가져오는 셈."*

### R18 — Garrison regeneration is recruitment with a destination; the register returns to per-province

Three decisions, taken together because each dissolved the one before it.

**(i) Garrison regeneration is not a standing world rule.** `MAGNITUDE.md` M12's
2026-07-08 amendment (MT-⑤ / ADR 0027) already retired the automatic pulse: the
+10%/turn became "the amount purchased per COMMITTED action". `DOMAIN_MAP`'s Tier-0
`Standing world rule` entry still lists local-garrison regeneration as a Phase-1
instance consuming no action capacity — **that is a stale Projection against an
amended Production seal, so it is a sync debt, not a conflict**, and the seal wins.

M12's rider "a realm at war cannot re-man its shields" is a **measured consequence,
not a rule** (user ruling): the L2 implementation puts it in `tournament.js`'s
`peacePrimary`, which is bot action-ordering, and R2's later, more general grammar
makes every non-combat order free allocation priced by unit. A realm at war may
re-man its shields by paying for them; the throttle is budget competition, and it
self-scales with the number of bleeding fronts — which is what the attention-scarcity
rationale wanted in the first place.

**(ii) Garrison and field are the same men in different postures, and may be
transferred.** The user: *"수비대 재생이라는 게 전쟁 중에 모병하는 것과 똑같은
개념."* Transfer costs what R12 already prices movement at — **turns and fatigue,
never commit** — because changing posture *is* moving. Zero new pricing devices. The
local garrison cap bounds it: no realm hides its army behind M5's ×4.8, since a
sector holds 900 and the whole shield line is 30% of the national ceiling.

A free, instant transfer was rejected: an action with no cost is not a decision, and
the point of the mechanism is that stripping a border to mass a decisive field army
is a *gamble* — it costs turns, and the enemy has that window to read.

**Stamp owed:** M13a's start-state coordinates (g₀ = 1.0 full shields, f₀ = 0.5 half
field) become an opening *shape* rather than a standing constraint, since a player
may rebalance. The time cost is what keeps them meaningful.

**(iii) The conscription register returns to per-province.** MT-②, M13 and the
match-arc GLOSSARY all say the register is `registerPerPop × Σ populationValue,
**per province**`. Ticket 05 flattened it to one realm-level scalar.

The text is genuinely ambiguous — "per province" could describe only how the opening
value is computed — and **the user's adoption settles the reading: it persists per
province.** Two things argue for that reading independently: the same sentence has
the register moved by "land transfer ±", which needs per-province accounting to be
exact; and **R17's proportional succession was a workaround the flattening forced.**
With per-province registers a captured province simply carries its own register, so
R17 stops being an approximation and becomes exact. Restoring the seal *simplifies*
the rule that was written around its absence.

Scope: this reaches back into ticket 05's landed code. Folded into **06d**, which
already owns register succession.

### R19 — Recruitment siting is its own pass, and it opens the turn budget too

**Published 2026-07-26:** the user-approved R19 design is authoritative at
match-arc MT-⑥ and ADR 0045. The retained command economy is 20 points and one
point remains +1%p of force limit. The text below preserves the Working-layer
inputs that led to the published decision; it is no longer an open deferral.

**Historical Working input (superseded by the publication above).** Where a realm raises men — and therefore how far they
must march to reach a front or a wall — is real design with a UI surface, not
wiring. It is *not* being decided here.

Recorded as that pass's input, because it was decided in conversation and would
otherwise be lost:

- **The grain is the sector, not the province** (user ruling, correcting the agent's
  province-grain proposal). The agent's argument was micromanagement — 28 sectors per
  realm against 5 provinces — and the user's counter is precision: recruitment needs
  to be sited exactly, and one commit point *is* the minimum unit that picks one
  recruiting sector.
- **Therefore the pass also opens the turn budget.** If one point buys one sector's
  levy, the budget size decides how many sectors a realm can raise from at once —
  with 20 points and a war to fight, that is two or three. The user has previously
  considered **30** for exactly this reason. So the 행동력 stack (ledger D6.3, 가안 20)
  is inside this pass, not outside it — which reaches ticket 03's landed turn loop and
  ticket 04's shell.
- **What it buys, and why it is worth a pass:** siting makes reinforcement *local*.
  Raising beside the fighting is fast but drains that province's register and climbs
  the surge price; raising in the rear is cheap in bodies and slow in march. The
  user's target behaviour — *"많이 공격받은 섹터 쪽으로 군대를 조달하는 게 더 힘들어야
  한다"* — then emerges from movement time and register depletion with **no special
  rule**. It also removes the incoherence of levies raised far away filling a distant
  wall the next turn.

Not deferred out of doubt: the design is good and probably seal-consistent. It is
deferred because it is a **system**, this map's mandate is wiring, and it lands right
before a Codex handoff that cannot ask questions.

---

## Part 1 — Blocking the walking skeleton (tickets 01→07)

These stop the loop from closing. Everything else can wait behind them.

### 1.1 Capital fall has no operational definition

**Status: nothing anywhere.** ADR 0042 makes capital fall the sole win
condition; CP-② item 5 gives the path as "overwhelming decisive battle vs the
full guard". No document turns that into a condition code can evaluate. Searched
`docs/features/capital/`, `combat-formula/`, ADR 0042, and the duel-pivot ledger
for a capital-specific predicate — none exists.

**Why nothing runs without it:** ticket 07 is where the loop closes. Without a
fall condition there is no terminus, and with the wrong one the match either
never ends or ends trivially.

**Proposal, derived — no new threshold; the ordinary rule already covers it.**
CP-② item 7 seals that the guard is "an ordinary garrison, just larger
magnitude", with no special supply rule. Control transfer is already sealed as
headline-bound and binary (`MAGNITUDE.md` M8, controlShift carries no dial).
Composing those two: **the capital falls when the attacker wins the battle on
the capital sector under the ordinary control-transfer rule.** "Overwhelming" is
then a description of what the guard's magnitude *demands* — 가안 350 × pop, on
top of terrain and fortification — not an additional gate. This also matches
CP-② item 8, which forbids any hard early-rush floor and insists the defence is
purely emergent: an extra capital-only threshold would be exactly the special
rule that item rejects.

**What play reveals:** whether a match ever ends, and whether the fall arrives
late enough to feel earned. If it lands too early the recorded levers are
terrain and guard magnitude (CP-② riders), never a new threshold.

### 1.2 행동력 prices for non-combat orders

**Status: only reconnaissance has candidate numbers, and they are outside the
repository.**

The gap is narrower than it first looked. D6.3 seals that chips poured onto a
front **are** that engagement's commitment points, which the M2 lever curve
converts into a quality multiplier. So attack and defence need no separate
price — the commit *is* the spend. What has no price is the non-R orders:
**reconnaissance, instant reconnaissance, fortification, recruitment, supply.**

**Reconnaissance — the user's stated values, and where they actually live.**
일반 정찰 = 행동력 2, 즉시 정찰 = 행동력 6. These are recorded, as 가안, in the
agent's project memory (`terrain-game-recon-fog-economy.md`), together with the
pricing principle: *instant-recon cost ≈ the worst-case over-commit you would
waste attacking blind*. `docs/features/fog-of-war-discovery/RULINGS.md` points at
that memory file as its "full record" while carrying no numbers itself. **The
repository has never held them.** Landing them at the fog birthplace is owed
regardless of any other decision here.

Two contradictions inside that same candidate record need the user's ruling:

- the record also says *"normal recon = cheap rungs; the last rung costs more
  than the first"* — graduated pricing, which a flat 2 contradicts;
- the record makes instant reconnaissance an **attack rider, not a second
  action**, while the gate-07 spec (user story 22), the built prototype, and a
  standalone 행동력-6 price all treat it as its own selectable action.

**Fortification / recruitment / supply — no derivation available.** They are
selectable commit-consuming actions in the gate-07 spec (user story 23) with
their logic explicitly inert, and no document prices them. A user call.

**A grammar question sits underneath all of this.** D6.3 seals **free
allocation**: one stack, the player pours chips wherever they choose, and the
poured amount *is* the commitment. A fixed per-order price — "recon costs
exactly 2" — is a different grammar: a price list, not a free pour. Both can
coexist (non-R orders priced, R orders poured), but that hybrid is not sealed
anywhere, and the same memory record that carries 2/6 also says normal recon
should be **graduated** ("the last rung costs more than the first"), which is a
third grammar again. So the ruling owed is not only *what number* but *which
grammar*: flat price, graduated price, or free pour with a minimum. Everything
else about recon pricing follows from that choice.

**What play reveals:** whether information competes credibly against force for
the same chips. If recon is never bought, it is overpriced; if it is always
bought first, underpriced.

### 1.3 The Runtime interface predates the pivot — **CLOSED by R8**

**Closed 2026-07-25 (user).** The proposal below was confirmed as written: legality
reads as "has this realm committed this turn / is the window open", and
`currentActor` keeps its name while being read as the current phase. Full ruling
and its three supports: § R8. The rest of this section is kept as the derivation
that produced it.

**Status: seal versus seal.** Gate 02 (2026-07-16) seals `currentActor ->
ActorId` and "the Runtime rejects an intent submitted out of turn". D6.1
(2026-07-23) seals both realms committing simultaneously in secret. A single
current actor cannot express simultaneous submission, and no document defines
what "out of turn" means once both sides commit at once. Not previously
registered anywhere.

**Why nothing runs without it:** ticket 03 is the spine, and this is its
interface. Ticket 12 additionally requires bot intents to be "rejected exactly as
a human's would be" — under a rule that does not exist.

**Proposal, derived — `currentActor` becomes a phase, and legality becomes
per-realm-per-turn.** The pivot did not delete turn order; it moved it from
*between players* to *between phases* (D6.2's three tiers). Gate 02's underlying
guarantee — the Runtime, not the caller, decides what is legal now — survives
intact if the current actor is read as the current *phase*, and "out of turn"
becomes "this realm has already locked this turn" or "the commit window is
closed". Nothing in gate 02's rationale (no caller cheats; a caller bug cannot
reorder) depends on alternation.

**What play reveals:** nothing — this is structural. Deciding it early is what
matters.

### 1.4 Phase ③ does not exist

**Status: undefined project-wide.** D6.2's three-tier skeleton enumerates
①②④⑤. There is no ③ anywhere, and no five-phase enumeration this numbering
refers back to. Additionally, the ledger numbers the reveal ④ in D6.2 but ⑤ in
the showdown thread, so the numbering is internally inconsistent.

**Proposal, derived — renumber, do not invent.** The three sealed tiers are
decision / payoff / background; the circled numbers are vestigial references to
an older phase list. Ticket 03 should implement the three tiers and drop the
circled numbering, and the ledger's numbering should be corrected rather than
back-filled with a phase nobody designed.

### 1.5 Target eligibility is unspecified

**Status: less missing than it first appeared — the governing rule is sealed.**
A sweep from the UI side reported eligibility as unspecified project-wide; a
sweep from the catalog side **refuted that**. ADR 0024 seals the rule: gating is
**physical, not advisory** — a plan is hidden only when it is physically
impossible or meaningless (unreachable, no enemy, no route to cut), and "being
ill-advised is never a gate". `CATALOG.md` then authors availability conditions
for **all twelve** plans, some quite specific (Flanking appears only where a
non-frontal approach physically exists; Crossing is *exclusive* across a
river or strait; Encirclement has a two-branch isolation gate).

What is genuinely missing is the **executable** form: which sector fields those
prose predicates read, and the fit-ranking function ADR 0024 defers ("how well a
plan fits is derived at runtime by matching effect-axis magnitudes against the
target sector's value profile" — with no matching function recorded). The
prototype's hardcoded sector-ID lists are a fixture standing in for that.

**Why nothing runs without it:** it drives the glow *and* the EVAL BAR's RIGHT
bar, which is sealed as "the average across **eligible fronts**". The signature
UI cannot be computed without it. Recon has the same hole: the archive gated
scouting on adjacency, but that rule belongs to a retired map-discovery model.

**Proposal, derived — formalize the catalog's prose; do not invent a rule.**
Eligibility = *reachable* (already sealed in the movement graph) ∧ *physically
applicable* (each plan's own condition, transcribed from `CATALOG.md`). That is
assembly. Two residues need a user call: whether **reconnaissance** is
range-limited at all (the archive gated it on adjacency, but that rule belongs to
a retired map-discovery model), and the **fit-ranking function** — which matters
more than it sounds, because ADR 0024 makes the top-ranked plan double as the
recommendation, so the ranking is player-facing, not internal bookkeeping.

### 1.6 Capital site eligibility does not survive the pivot — **CLOSED by R3**

> **Dissolved 2026-07-25.** R3's seal makes eligibility *ownership*, so neither
> the one-marker-per-region count nor r8's missing marker constrains placement
> any more. The proposal below is withdrawn; the section is kept for the
> measurement it records about `CRADLE_META`.

**Status: the rule is sealed but cannot be executed as written.** CP-① seals
that "the player picks one of the **seat's main city sectors**". On the
authoritative map, `CRADLE_META` authors exactly **one** marker per region —
`capitals` for three regions, `cities` for six — and **region r8 has neither**.
Nine markers across ten regions, one apiece.

**Why nothing runs without it:** ticket 02 must offer the player a choice at
match start, and a rule that yields one site per region offers none.

**Proposal, derived — read "seat" as the partition, not the region.** The rule's
phrasing is pre-pivot: a "seat" then meant a fixed two-province holding, so "the
seat's main city sectors" was naturally plural. Under the duel pivot a realm is
a random ~five-region partition, which holds roughly four or five markers — so
the rule becomes executable, and genuinely a choice, when read at partition
granularity. That reading changes no seal; it applies the existing rule to the
structure the pivot created. What still needs a call: whether r8 gets a marker
(a map edit, belonging to the parallel map pass) or whether a realm simply has
one fewer option when it draws r8.

### 1.7 The disposition governs one thing, and gate 08 asked it to govern four

**Status: a gap inside the gate-08 seal itself, not an agent error.** Gate 08
axis 6 seals that the bot's unmeasurable judgment calls — **commit sizing, plan
choice among viable plans, capital-strike gamble timing, exposure tolerance** —
are governed by a disposition parameter. The sealed disposition (tactical-plan-ai
ruling ②, AGREED 2026-07-08) governs exactly **one** thing: a single continuous
λ ∈ [−1, +1] setting *where inside an estimate band the bot reads the enemy*.
Pessimist reads the enemy strong, optimist reads weak; it vanishes entirely under
perfect information. That is its whole semantic.

Where the other three actually lived in the archive: capital-strike timing was
the archetype boolean `pushCapital`; exposure tolerance was the archetype's
`attackRatio` (1.6–2.0); plan choice was a **deterministic ladder** — among plans
whose judged R clears its threshold, take the highest rung, break ties by margin.
Commit sizing was a pair of hardcoded constants (siege 8, field 14), frozen and
explicitly parked. So three of the four lived in exactly the archetype layer gate
08 discarded, and the fourth is the hardcoded shape ticket 12 forbids.

**Why nothing runs without it:** ticket 12 is the opponent. Without this the bot
either reuses discarded multipolar archetypes or falls back to constants the
ticket bars.

**A second conflict rides on the same seam.** The ladder's top two rungs are
**vassalization** and **annihilation** — multipolar-era objectives. ADR 0042 made
capital fall the sole terminus and retired settlement, so the ordinal objective a
duel bot should climb has never been re-cut.

**Proposal, derived, and narrower than it looks.** The sealed λ already produces
*all* of the bot's misjudgment, because every one of these calls is downstream of
the judged R: a pessimist reading the enemy strong will naturally commit more,
decline a marginal capital strike, and tolerate less exposure — without any new
dial. On that reading, gate 08's four calls are not four parameters but four
**consequences** of the one, and the ladder stays the deterministic choice rule
(disposition-free by design, which ruling ① states outright). What genuinely
remains is (a) which λ ships as "balanced" — nowhere assigned; code defaults to
0, the presets ±0.5 appear only in a battery script and the non-normative
QUICKREF — and (b) the ladder's rungs re-cut for a single-terminus duel. Both are
user calls; neither invents a new mechanism.

### 1.8 Stale seals at the capital birthplace

**Status: PAID 2026-07-31.** CP-①'s header now carries all three amendment
banners — ADR 0042, ruling R3, and CP-⑤. This section remains the Working-layer
discovery record.

**It was two stale items, not one, and this heading said "One".** That miscount is
the whole reason the second one stayed invisible for six days, so it is corrected
here rather than quietly overwritten:

- **item 3** (the known one) — "capital fall = regime event: **collapse cascade /
  forced-vassalage trigger**". ADR 0042 ends the match the instant the capital falls,
  so a cascade has nowhere to run and vassalage was retired with the settlement
  terminus. Stamped.
- **item 1** (missed until 2026-07-31) — its **designation** rule still said the
  capital is "one of the seat's main city sectors", while ruling R3 (2026-07-25) had
  made eligibility *ownership*: any owned sector. Ticket 07 reads item 1 as authority
  for its first acceptance item, so the miss was load-bearing — and filing the whole
  entry under "item 3" is what hid it. Stamped.

Both needed a supersession stamp rather than a design decision, which is why this was
never a Part 2 conflict. The lesson is narrower than "stamp things": **a register row
that names *which* item is stale will hide any other stale item in the same seal.**

### 1.9 Ticket 06a cannot place the opening army or expand authored edges to hex endpoints

**Status: PAID 2026-07-26.** The Part 3 movement values and both topology rules
now have normative homes: war-model-build WM-④ and ADR 0045. This section remains
the Working-layer discovery record.

| Missing rule | Why the build cannot infer it | Repository evidence |
|---|---|---|
| Opening field-army hex | M13a fixes how many men start in the field, not where they stand. Choosing a capital, a front, or a setup-placement beat changes the opening strategy; choosing one hex inside a multi-hex sector changes the route metric. | L3 `Sector` carries `mapUnits[]` and no movement anchor. The reference archive alone starts its scripted army at its automatically selected capital hex (`mockup/operational-layer/war-loop.js`); ADR 0041 bars treating that as build authority. |
| Hex endpoints of an authored edge | ADR 0043 says `hex adjacency ∪ authored edges`, but the checked-in `Edge` joins two **sector ids**. Turning that into a hex-to-hex link requires an endpoint rule. Nearest pair, centroid-nearest pair, or an authored anchor produce different route lengths and therefore different turns, fatigue, reach and fog. | `game/src/world/schema.ts` has `Edge.a/b: SectorId`; each endpoint sector has multiple `mapUnits`. The two r10 straits have no natural hex contact, which is exactly why a hex-only graph fails. |

This is not a missing numeric dial and not archive-port permission. The boundary
test stops at step (1): implementing either requires a normative statement that
does not exist. Ticket 06a returns to `needs-info`; do not derive through it.

**User ruling received 2026-07-26:** the opening field army starts on the chosen
capital sector's centre-nearest hex. Natural hex contact realizes an authored edge
when contact exists; a non-contact edge (the two r10 straits today) connects the
nearest endpoint-sector hex pair at movement cost 1, with ties broken in canonical
coordinate order. Publication landed in the same session: war-model-build WM-④ +
ADR 0045.

### 1.10 Positioned detachments conflict with recruitment's deliberately absent location

**Status: PAID 2026-07-26.** The conflict is resolved by match-arc MT-⑥ and
ADR 0045: recruitment is sited, cohorts retain province origin, and readiness
separates raising-turn movement from combat eligibility. This section remains the
Working-layer discovery record.

| Side | Sealed requirement |
|---|---|
| 06a / ADR 0043 / slice-2 §4 | All mobile field substance exists as positioned detachments; substance at a front is only the detachment(s) present or arriving there. |
| R19 | Recruitment siting is a separate pass that also reopens the turn budget. This slice must not give recruitment a location. |

Before division, "recruits join the field army directly" can hide the location
question behind one positionless scalar. After division every possible write is a
rule: add to one detachment (which one?), distribute across several (by what
weights?), create a positionless reserve (a new posture that cannot march or
fight), or disable recruitment while divided (a new restriction). The reference
operational harness has detachments but no composed recruitment path; the reference
economy harness has recruitment but a positionless scalar, so neither is accepted
behavior to carry.

The boundary test stopped at a sealed conflict. MT-⑥/ADR 0045 now provide the
bounded destination and readiness contract that lets 06a replace `RealmForces.field`.

---

## Part 2 — Seal conflicts needing a ruling

Both sides are sealed; the agent stops. Ordered by how early each bites.

| # | Conflict | Side A | Side B | Bites at | Status |
|---|---|---|---|---|---|
| 1 | Does the estimate band's centre wobble? | Duel-pivot ledger, user-sealed 2026-07-23: the band's **centre wobbles** as it converges (noisy witness), explicitly to prevent the leak a monotonic shrink would cause | Gate 03 invariant 7 + `js/intel.js`: the hidden position is **seed-derived and stable** — producing exactly the monotonic zoom the ledger rejects | ticket 08 | closed 2026-08-03 |
| 2 | Encirclement threshold | `MAGNITUDE.md` M7: **2.2**, described as "the only threshold above rout onset (R≈1.92)" | Ledger: "포위 섬멸 ~**1.92**" — which is the rout-onset figure, not the threshold | tickets 09, 10, 11 | open |
| 3 | Commit marker on the eval bar — **CLOSED 2026-08-05 by ADR 0052** (user grill on ticket 04's scoping call). Ruled for the ledger: the baseline-and-marker device stands, and decision 5 **generalises** it to a second axis (force allocation), which is a ruling for it rather than merely a preference over it. The prototypes' header line retires — it was written when the bar's only reading was a bare R, before the equal-commit baseline gave a marker something to be measured *against*; a marker beside a baseline reports what the player's own 행동력 bought, which is not the leak "commit info on the bar" was guarding against (the enemy's commit is a hole card and stays absent, gate 03 § 4). Recorded rather than left implicit: this closed as a side effect of a design choice, which is the failure mode the Record layer exists to catch | Ledger seals it twice: equal-commit baseline **plus a live marker at the player's chosen commit** | Both prototypes state in their headers: **"NO COMMIT INFO on the bar — EVER"** | ticket 09 | closed 2026-08-05 |
| 4 | Which recon economy | `MAGNITUDE.md` M8 (sealed Production): recon primary **+0.30**, surplus 2 points buy +0.10 per sector, saturating | fog RULINGS ladder **0.45 → 0.70 → 0.90** with `SCOUT_GAIN 0.25` | ticket 08 | closed 2026-08-03 |
| 5 | Estimate band width | `MAGNITUDE.md` M8: half-width = **40% × (1 − confidence)** | `js/intel.js`: a different two-constant model, ≈±35% at 0.45 versus M8's ±24% at 0.40 | ticket 08 | closed 2026-08-03 |
| 6 | Own-realm knowledge | Gate 03: own realm is **Exact** — no fog on self | `js/intel.js`: `OWNED_CONFIDENCE = 0.85` | ticket 08 | closed 2026-08-03 |
| 7 | Plan effect axes | ADR 0024: a **per-axis magnitude**, explicitly "not a primary/secondary classification" | `CATALOG.md`: `core` / `secondary` / `none`, used by all twelve plans | ticket 10 | open |
| 8 | Matchup filled-cell count | `MATCHUP.md` prose "15 of 21 cells are empty" and `INDEX.md` "6 authored" | the table itself renders **12** filled cells and 9 empty | ticket 11 | open |
| 9 | The matrix's third defence column | `MATCHUP.md` column "Strategic Abandonment", against which six cells resolve `refuse` | `CATALOG.md`: "**Abandonment is a declaration, not a plan.** Scorched Earth is the real plan" | ticket 11 | open |
| 10 | Capital guard magnitude — **CLOSED 2026-07-31 by CP-⑤** | CP-①/CP-②: 가안 350 × populationValue | `MAGNITUDE.md`: `capitalGarrison 1500` — **not a seal**; a parenthetical harness inventory with no status word, and CP-① item 2 had already retired the flat 1500 by name on 2026-07-10. There were never two seals, only an unstamped line (now struck). The real question was the coefficient's **size**, which this row never asked: at 350 the strongest guard on the board is 840 — below one 900-man border shield and 9.3% of the opening field — so CP-② items 7 and 8 were both false. **Ruled: 가안 2,500/pop** (user), floor 1,800 derived from CP-② item 7 + M13a | ticket 07 | closed 2026-07-31 |
| 11 | Fatigue effectiveness floor | Slice-2 spec: "floor ×0.5 (**가안**, cited, not re-sealed)" | Same file, 72 lines later: "floor ×0.5 is a **sealed anchor**" — which the code implements | ticket 06 | closed 2026-07-26 |
| 12 | Bot decisiveness ladder | `tactical-plan-ai` RULINGS ranks **vassalization** as the top rung | ADR 0042 retired settlement as a terminus entirely | ticket 12 | open |
| 13 | 판세 in-play surface — **CLOSED 2026-08-05 by ADR 0053** (user grill). ④ decision 6 was the whole of the disagreement, as this row guessed: Gate 6 forbids a *verdict*, gate 07's mini-meter carried an *evidence* read, and the two were never in conflict about the same object. Ruled: **no in-play 판세 meter** (Gate 6 fork A holds); what rests in the top strip is **coverage — the size of the viewer's own ignorance**, which is legal there because it reports their epistemic state rather than a position on the match; the evidence contrast is **summoned** from that band, never painted. Reason (user): the design being pursued is a reactive UI that invites a chain of clicks only when one is needed — a resident answer ends that chain before it starts, a resident question begins it. ⚠ **Carries one thing out with it:** gate 03 C03.6 routed enemy-treasury uncertainty through "판세 band width", and there is no 판세 band — registered in `docs/SYNC-DEBT.md`, deliberately not answered by 0053. Original text follows. — 판세 in-play surface, **new input 2026-08-03**, fog `RULINGS.md` ④ decision 6: an **evidence** surface is not a **verdict** surface, and that distinction may be the whole of the disagreement, since Gate 6 forbids an in-play strategic *verdict* while gate 07's mini-meter carried an evidence read. ④ seals what such a surface must and must not do (four clauses, at its birthplace — not restated here) and deliberately does **not** place it, because placement is ticket 04's to rule | *already registered in* `docs/SYNC-DEBT.md` | | ticket 04 | closed 2026-08-05 |
| 14 | **Does the operational layer track armies and move them?** — **CLOSED by R12–R15** (2026-07-26, gate C) | `DOMAIN_MAP.md` ✅ `Position as product`: the MVP has **no standalone move action and no tracked army counters** — position is a *product* of operations, and the runbook's own diff review (§ Implementation loop 7) lists "standalone movement" as forbidden scope | slice-2 design spec §3 movement contract + gate 08's full-compound-depth slice: armies hold hex positions, forced march is an explicit toggle, field armies divide and merge — which is army counters and standalone movement | ticket 06 | closed 2026-07-26 |

| 15 | **Does conquered land ever start paying its taker?** — **CLOSED by R16–R17** (2026-07-26, gate C) | `MAGNITUDE.md` M14 + ruling ⑮: "conquest raises the national cap", at a usable discount (fresh capture 50/60%) — sealed as the match-closure lever; ADR 0022/0029 supply the ripening that integrates it | OG-③: occupied-untransferred land "counts toward NEITHER side's derived quantities", and the transfer channel that ended limbo was **settlement**, which ADR 0042 retired for the duel — leaving no path from occupied to integrated | ticket 06 | closed 2026-07-26 |

| 16 | **Which register backs the capital guard?** — **CLOSED 2026-08-01 by capital CP-⑥**: the guard's origins are apportioned **realm-wide**, the rule ADR 0047 item 5 already states for the opening field army; 0047's header carries the amendment stamp. Local backing turned out not to be a live option at all — re-measured over **840** capital candidates (15 legal partitions × 2 seats × held sectors) with the sealed opening derivation applied, the highest coefficient a sector can back from its own register is **1,453–1,490** against CP-② item 7's floor of **>1,800**, so the two constraints do not overlap; the 1.389 ratio below understated the gap by omitting the opening field army's ~18% draw. `r5_s8` (pop 0.5 border sector) has **0** available civilians, so no coefficient works there. Realm backing leaves 31,800–36,300 spare and needs no value | Capital **CP-⑤** (SEALED 2026-07-31): guard = **가안 2,500 × capital sector `populationValue`**, and "register-backed" is listed among the properties it leaves untouched | Match-arc **MT-②** (amended 2026-07-31) + **ADR 0047**: the register is **1,800/pop** and is stored **per sector**, and origin composition is per sector — so a shield "drawn from the ground it stands on" (how 06d seats every border shield) cannot back this guard at **any** legal capital: the ratio is a fixed 2500/1800 = **1.389**, and **0 of 56** sectors can back their own guard (measured: pop 2.4 → guard 6,000 against a register of 4,320). `availableCiviliansByOrigin` treats that as fatal, so the match could not be seated | ticket 07 | closed 2026-08-01 |

**The `Status` column landed 2026-08-03** (doc-structure ticket 14, R5), so a row's
state sits in a fixed place instead of inside its conflict-name cell. Where a cell
already carries a CLOSED marker the prose is left standing: it holds the *reason*,
which the column cannot.

**Rows 1, 4, 5 and 6 — the whole fog band — closed 2026-08-03** by a user grill.
Two of them were never conflicts. Row 1's two "sides" are the same user position
recorded twice — 노화 헌법 P3 (2026-07-07) and the duel-pivot ledger's witness
seal (2026-07-23) — while what actually disagreed with both was `js/intel.js`,
which recomputes the band from the **current** true value on every read, so stale
intelligence silently tracks enemy reinforcement instead of fading. Rows 5 and 6
closed by **ADR 0041 §2** rather than by a ruling: their "Side B" is four archive
constants and `OWNED_CONFIDENCE`, which appear in no Production document, so there
was never a second seal to weigh. Row 4 reduced to one number once R2's
linear-commit grammar was applied, and that number is now sealed.

The grill also found what neither recorded side named: **the band was invertible.**
Its width was proportional to the true value while both width and confidence were
displayed, so the true figure solved out of a single observation — under M8's
conversion as much as the archive's. Gate 03's invariant 6 was preserving a
residual sliver next to a width that gave the answer.

Homes: `docs/features/fog-of-war-discovery/RULINGS.md` ③ (the model, with the nine
decisions and their reasons) · that feature's `MAGNITUDE.md` FG-M① (values) ·
**ADR 0048** (why it is cross-feature) · gate 03 invariants 5, 7 and the new 8.

Row 16 was **found 2026-07-31** by ticket 07's claim-time recompute — the check R6
exists for, catching exactly what it is meant to catch. Three seals landed the same
day from two sessions and none was checked against the others: CP-⑤ re-cut the guard
coefficient, MT-② moved the register to sector grain, and ADR 0047 moved origin
composition with it. Neither side was wrong on its own account; the collision is
only visible where they meet.

**Nothing is broken today** — the guard does not exist until ticket 07 builds it, and
`Runtime.#seatSubstance` deliberately seats no guard. What the row blocks is claiming
07, because its first acceptance item ("guard magnitude is land-derived from the
capital sector per its sealed birthplace") cannot be implemented until this is ruled.

**Why it is a ruling and not a derivation.** Both readings are coherent and neither
is written down:

- **(a) local backing** — the guard originates in its own sector, like every other
  garrison (ADR 0047's principle, and how 06d seats opening shields). Requires either
  a coefficient at or below `registerPerPop`, or an exemption for the capital sector,
  or a rule for what happens when a sector's shield outgrows its own bodies.
- **(b) realm backing** — the guard's origins are apportioned across the realm's held
  sectors, the way `Runtime.open` already seats the opening **field** army. Works
  today with no change to CP-⑤'s value, but makes the capital guard the one garrison
  not drawn from the ground it stands on, which cuts against ADR 0047's reading.

CP-① sealed 350/pop on 2026-07-10, when origins were per province and a province's
register (1,800 × Σ pop over ~5.6 sectors) covered the guard comfortably under either
reading. The question is new because the grain is.

**Row 16 had a fourth item underneath it, and that one is closed too.** Claiming 07 on
2026-08-01 ran the recompute *again* and found that where a capital sector also
carries an ordinary border shield — **179 of the same 840 candidates, 21.3%, across
27 distinct sectors** — no seal said whether that sector's garrison is the shield
**plus** the guard or the guard **instead of** it. CP-⑥ knew: it re-measured under the
subsuming reading purely to show its own conclusion did not depend on the answer,
which is a correct scope call that leaves the question for whoever places the guard.
Ruled the same session — **capital CP-⑦, additive**. 900 is 72% of the weakest legal
guard, so it was not a rounding difference. Two consecutive claim-time recomputes, two
found items, both living exactly where separately-correct seals meet.

| 17 | **What does a *simultaneous* double capital fall name?** — **PINNED 2026-08-01 (user), not answered.** Two capitals can fall in one payoff: A's army stands on B's capital while B's stands on A's, both win their battle, and `#resolveEngagements` emits two captures. Not a freak case — it is the **mutual-exposure duel CP-② item 9 calls the heart of the match frame**, both players all-in on offense at once. The user ruled to refuse rather than invent: `Runtime.#capitalFall` throws, naming the seals, and a test in `capital-fall.test.js` pins the refusal. **Zero new normative statements** — the same shape 06d gave its held posture transfer. *What would settle it:* a user ruling on draw / a symmetric non-draw rule / accepting a resolve-order tiebreak — most usefully after playtest shows whether it ever actually happens | **ADR 0042** names a winner for *a* capital fall, and ledger **D3.1** forbids a draw path and a tiebreak-win — so neither "both lose" nor "score it" is available | **D6.1a** forbids application order introducing first-mover asymmetry, so taking the first-resolved capture is not available either. D6.1a's own text addresses two armies entering the *same* sector, and two independent battles each ending the match sits outside it — which is why this is a **gap rather than a conflict** | ticket 07 (pinned; a real match can reach the throw) | pinned 2026-08-01 |

Row 17 was **found 2026-08-01** while wiring 07's win check — by asking where the
predicate goes, not by a recompute. It is filed here rather than left as a code
comment because the throw is reachable in real play: rare, but precisely at the
climax, which is the worst place to discover it.

Row 15 was **found 2026-07-26** by the ticket-05 code review, which caught the
implementation answering it by accident (a frozen homeland record made limbo
permanent, so conquest could never raise a taker's income or ceiling). Ticket 05
was corrected to *not* decide it — nothing there captures a sector, so nothing
there needs the answer. The stakes are large and worth stating: under permanent
limbo, conquest is purely subtractive and land is taken only to starve the
opponent; under ripening, taking ground also grows you and M14 ⑮'s closure lever
survives the pivot. Whichever way it goes, **ticket 06 cannot take a sector
without it**.

Row 14 was **found 2026-07-26**, outside the original sweep, while sizing ticket
06. Three things make it larger than a row:

- It is a **three-way** conflict, not two-sided: `Position as product` (MVP
  grammar), gate 08 § Answer (full compound depth, which bought depth over
  smallness knowingly), and the slice-2 movement contract cannot all be built.
- **RETRACTED 2026-07-26 by measurement (R15) — this bullet previously claimed the
  march-speed dial does not transplant. It does; do not act on the old reading.**
  The claim was that 3 hexes/turn cannot cross a median 5-hex sector in a turn.
  The 5 was right (sector *size*: 56 sectors, 3/5/8) but the inference was not:
  what a march crosses is sector *spacing*, and adjacent sectors are a median of
  **2 hexes** apart centroid-to-centroid (1/2/3/5 over 84 pairs). Speed 3
  transplants, so movement needs **no new value** — only Part 3 bulk approval of a
  value already running. Full derivation and the turn table: ADR 0043
  § Consequences.
- **Ticket 06 is not one ticket.** Its twelve acceptance items span the whole
  slice-2 operational layer plus the slice-1 combat core; the archive built that
  surface across **eleven** tickets. Resolving row 14 re-cuts 06 rather than
  unblocking it.

**Venue (user ruling, 2026-07-26): a Wayfinder gate, opened after ticket 05
lands** — this is a seal conflict plus a ticket re-cut, which is gate-shaped work
rather than implementation work. Note it sits on the critical path: ticket 07,
where the match loop closes, is blocked by 06.

Two bookkeeping items that need a stamp rather than a ruling: `capLandFrac`'s
default flip is recorded as "NOT done" in AB-②'s rider while the code and its
tests already treat it as the factory default (the debt was paid, the rider never
stamped); and the viewer knowledge matrix has carried **eight** rows since its
2026-07-23 amendment while every citation still calls it "the seven-grade
matrix".

---

## Part 3 — Approve in bulk: values already running in code

> **APPROVED 2026-07-26 (user), and landed at birthplaces the same session — except
> the fog sub-batch, which Part 3's own precondition excludes.**
>
> | Sub-batch | Where it landed |
> |---|---|
> | Fatigue, movement, supply (14 dials) | **`docs/features/war-model-build/MAGNITUDE.md` WB-M① and WB-M②** — a model doc created for the purpose, because this feature had none and that is why the dials had no birthplace. |
> | Delaying defence (breakthrough R 2.0, erosion 0.15) | `docs/features/operation-plan-catalog/CATALOG.md`, at the Delaying Defense entry — the owning model doc for plan-shaped values. |
> | Bot (λ formula, disposition presets, siege/field commit, eligibility gates) | **Approved, birthplace owed.** They belong to ticket 12's contract and block nothing now; `docs/SYNC-DEBT.md` carries the row. |
> | Fog band shape (4 constants in `js/intel.js`) | ~~Excluded, not refused~~ — **VOID 2026-08-03, and not pending.** The exclusion was correct and its condition has now been met the other way: row #5 resolved by the constants **never being ported**, so there is nothing left to approve. Their replacement is `docs/features/fog-of-war-discovery/MAGNITUDE.md` FG-M①, cut from the contract rather than harvested from the archive (ADR 0041 §2). Deleting them from this batch's scope needs no further act. |
>
> Two debts were paid by the landing rather than by a ruling: **Part 2 #11** (the
> ×0.5 fatigue floor — both sides always said 0.5, so it was a stamp) and the
> SYNC-DEBT row for the missing movement birthplace. Every landed value carries an
> **L1** stamp with its reason stated: these ran inside the L2 harness but were never
> the *subject* of a sweep, so nothing measured them against a target. March speed is
> the exception at **L2**, having been measured during gate C.
>
> Unblocked by this: **06a, 06b, 06c**.

These are not decisions to originate. They are values that **already determine
how the game behaves** and that no document records — so they have never been
seen, let alone approved. The ask is to confirm or edit, then land them at a
birthplace.

The pattern is consistent and worth naming: the slice-2 spec **names each dial by
number and leaves the value blank** — "dial (3)", "dial (6)" — while the
implementation carries a concrete number. The design was sealed at the level of
shape; the numbers were filled in during implementation and never came back.

**Fatigue, movement, supply** (`js/fatigue.js`, `js/movement.js`) — march
accrual per hex 1.0 · forced-march premium 3.0 with a 2-hex extra cap · battle
fatigue coefficient 40 · conversion convexity exponent 2.0 · terminal ledger
depth 10 · supply pump per cut turn 1.0 · starvation entry threshold 2 ·
starvation loss coefficient 0.02 and exponent 2.0 · recovery base rate 2.0 and
supply-curve exponent 1.0 · march speed 3 hexes per turn. The march speed also
silently sets the reach cone's radius, so it is a fog dial as much as a movement
one. Whether recovery additionally requires standing still is marked HELD in both
the spec and the code.

**Fog band shape** (`js/intel.js`) — ~~the four constants behind the estimate
band, which conflict with M8 (Part 2 #5) and so cannot be approved until that
resolves.~~ **VOID 2026-08-03.** Row #5 resolved by retiring both candidate
models, so neither the constants nor M8's conversion is approved; the estimate
band's widths are cut fresh at `docs/features/fog-of-war-discovery/MAGNITUDE.md`
FG-M①. This entry stays struck rather than deleted because Part 3's premise —
values that determine behaviour and that no document records — is exactly what
FG-M① now closes for this feature.

**Bot** (`plan-ai.js`, `plan-battery.js`, `tournament.js`) — the judged-value
formula `mid − λ(high−low)/2` · disposition presets ±0.5 · siege commit 8 and
field commit 14 · the per-plan physical eligibility gates. The λ dial's range
[−1, +1] and its semantics *are* documented; the formula and the presets are not.

**Delaying defence** (`js/battle.js`) — breakthrough R 2.0 and erosion 0.15 per
turn, both 가안.

Everything in `js/ai.js` and `js/bot-exit.js` is out of scope rather than owed:
the multipolar bot uses ambient randomness and the exit heuristic serves a
terminus ADR 0042 retired.

---

## Part 4 — Not owed by the user now

- **The tactical-R composition formula, the EVAL BAR's name, and its visual
  seal.** The ledger holds the first two open by design and names the third the
  user's call. The visual is a different case than the sweep first assumed: it is
  **built and validated** in the prototype and behaviourally sealed in the
  ledger — vertical column, white for own advantage, hatched band, needle zone,
  and the full LEFT/RIGHT state machine. What it lacks is a documentary home, so
  it is a documentation debt, not an undecided design. The formula is **partly**
  landed, which the ledger's "Still OPEN" line does not acknowledge: R's
  composition on true inputs is fully sealed (`R = attack ÷ defense`, both sides
  composed in FORMULA D6), and `MAGNITUDE.md` M8 carries an adopted dial for band
  half-width — **40% × (1 − confidence)**. What is missing is narrower than "the
  formula": the fogged-input substitution, how the reducible and irreducible
  widths combine, and the eligible-fronts averaging rule. The prototype uses a
  *different* width shape — absolute R offsets stepped by confidence rather than
  M8's relative fraction — so the two need reconciling rather than one being
  copied.
- **The resolve-order algorithm.** Sealed in principle, deferred by name to its
  own rule-design pass, which ticket 03 runs against the real board.
- **Every acceptance threshold**, including Node/browser parity strength and who
  judges the human rung against what failure bar. Wayfinder gate 10 owns these
  and is open; until it closes, acceptance commands fail `pending` by design.
- **Partition balance tolerance** — withdrawn, not deferred. On the authoritative
  map every region's population is exactly 6.0, so any contiguous five-region
  split is balanced to 0% and thirty such partitions exist. There is no
  tolerance to set.
- **Values behind later tickets** — plan `riskProfile` for twelve plans,
  Encirclement's routeDisruption dial, the guard's local ceiling, border-zone
  extent, victory-screen content, camera zoom range, verification viewport. Real
  gaps, but they do not block the loop from closing.
