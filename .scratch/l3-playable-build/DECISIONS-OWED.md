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

*Owes:* a seal at the fog birthplace for the recon unit prices (still 가안, and
still the values that have never been in the repository), and a home for the
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
  depended on alternation.
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

### Owed micro-ruling — may a player see that the opponent has committed?

**Surfaced by ticket 02's build, 2026-07-25.** The capital beat is sealed as
simultaneous and secret, with both sites revealed together (CP-② D1.3, item 1).
What no seal covers is whether the *fact* of the opponent's commitment is
visible before the reveal — i.e. whether a player watching their own screen can
see "the enemy has locked" while still deciding.

It reads as a trivial UI detail and is not: it is the first small piece of the
commit-and-reveal grammar the whole turn loop will be built on (ticket 03), and
whichever way it goes there, this should match.

- **Hidden (implemented).** The projection shows a viewer only their own lock.
  Chosen because it invents nothing — the narrower reading is the one no seal
  contradicts.
- **Visible (the alternative).** Standard for commit-and-reveal games; tells the
  player the beat is half over, and removes the "am I waiting or is it stuck?"
  ambiguity. Costs a sliver of information the secret beat was arguably meant to
  withhold.

No derivation available; a user call. Ticket 03 will need the same answer for
turn commits, so answering it once covers both.

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

### 1.3 The Runtime interface predates the pivot

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

### 1.8 One stale seal at the capital birthplace

CP-① item 3 still reads "capital fall = regime event: **collapse cascade /
forced-vassalage trigger**". ADR 0042 ends the match the instant the capital
falls, so a cascade has nowhere to run and vassalage was retired with the
settlement terminus. The pre-pivot text was never stamped at its birthplace.
This needs a supersession stamp, not a design decision — but it sits in the same
file ticket 07 reads as authority, so it should be stamped before that ticket
runs.

---

## Part 2 — Seal conflicts needing a ruling

Both sides are sealed; the agent stops. Ordered by how early each bites.

| # | Conflict | Side A | Side B | Bites at |
|---|---|---|---|---|
| 1 | Does the estimate band's centre wobble? | Duel-pivot ledger, user-sealed 2026-07-23: the band's **centre wobbles** as it converges (noisy witness), explicitly to prevent the leak a monotonic shrink would cause | Gate 03 invariant 7 + `js/intel.js`: the hidden position is **seed-derived and stable** — producing exactly the monotonic zoom the ledger rejects | ticket 08 |
| 2 | Encirclement threshold | `MAGNITUDE.md` M7: **2.2**, described as "the only threshold above rout onset (R≈1.92)" | Ledger: "포위 섬멸 ~**1.92**" — which is the rout-onset figure, not the threshold | tickets 09, 10, 11 |
| 3 | Commit marker on the eval bar | Ledger seals it twice: equal-commit baseline **plus a live marker at the player's chosen commit** | Both prototypes state in their headers: **"NO COMMIT INFO on the bar — EVER"** | ticket 09 |
| 4 | Which recon economy | `MAGNITUDE.md` M8 (sealed Production): recon primary **+0.30**, surplus 2 points buy +0.10 per sector, saturating | fog RULINGS ladder **0.45 → 0.70 → 0.90** with `SCOUT_GAIN 0.25` | ticket 08 |
| 5 | Estimate band width | `MAGNITUDE.md` M8: half-width = **40% × (1 − confidence)** | `js/intel.js`: a different two-constant model, ≈±35% at 0.45 versus M8's ±24% at 0.40 | ticket 08 |
| 6 | Own-realm knowledge | Gate 03: own realm is **Exact** — no fog on self | `js/intel.js`: `OWNED_CONFIDENCE = 0.85` | ticket 08 |
| 7 | Plan effect axes | ADR 0024: a **per-axis magnitude**, explicitly "not a primary/secondary classification" | `CATALOG.md`: `core` / `secondary` / `none`, used by all twelve plans | ticket 10 |
| 8 | Matchup filled-cell count | `MATCHUP.md` prose "15 of 21 cells are empty" and `INDEX.md` "6 authored" | the table itself renders **12** filled cells and 9 empty | ticket 11 |
| 9 | The matrix's third defence column | `MATCHUP.md` column "Strategic Abandonment", against which six cells resolve `refuse` | `CATALOG.md`: "**Abandonment is a declaration, not a plan.** Scorched Earth is the real plan" | ticket 11 |
| 10 | Capital guard magnitude | CP-①/CP-②: **가안 350 × populationValue** | `MAGNITUDE.md`: `capitalGarrison 1500`, flat and unstamped | ticket 07 |
| 11 | Fatigue effectiveness floor | Slice-2 spec: "floor ×0.5 (**가안**, cited, not re-sealed)" | Same file, 72 lines later: "floor ×0.5 is a **sealed anchor**" — which the code implements | ticket 06 |
| 12 | Bot decisiveness ladder | `tactical-plan-ai` RULINGS ranks **vassalization** as the top rung | ADR 0042 retired settlement as a terminus entirely | ticket 12 |
| 13 | 판세 in-play surface | *already registered in* `docs/SYNC-DEBT.md` | | ticket 04 |

Two bookkeeping items that need a stamp rather than a ruling: `capLandFrac`'s
default flip is recorded as "NOT done" in AB-②'s rider while the code and its
tests already treat it as the factory default (the debt was paid, the rider never
stamped); and the viewer knowledge matrix has carried **eight** rows since its
2026-07-23 amendment while every citation still calls it "the seven-grade
matrix".

---

## Part 3 — Approve in bulk: values already running in code

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

**Fog band shape** (`js/intel.js`) — the four constants behind the estimate band,
which conflict with M8 (Part 2 #5) and so cannot be approved until that resolves.

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
