# Capital — Rulings

Feature-local decision record (Record layer, birthplace tier). Append-only.

## CP-① Capital concept package — SEALED 2026-07-10 · L0 (user, occupation-geography brainstorm session)

> **Amended by CP-⑤ (2026-07-31):** item 2's **coefficient** is re-cut from 가안
> 350/pop to 가안 2,500/pop. The guard's shape — land-derived, garrison-class,
> register-backed, one stock with the last stand — is untouched, and so is item 2's
> retirement of the flat abstract 1500.
>
> **Amended by ruling R3 (2026-07-25):** item 1's **designation** rule is retired —
> capital eligibility is *ownership*, so a player may place their capital on any
> sector their realm owns, and the authored `capitals`/`cities` markers are advisory
> map content that may not gate placement (`world/schema.ts` carries the same note).
> Item 1's "main city sectors" wording predates the duel pivot.
>
> **Amended by ADR 0042 (2026-07-24):** item 3's **forced-vassalage / collapse
> cascade** trigger is retired. Capital fall is the sole win condition and the match
> ends the instant it happens, so there is no regime state after it for a cascade to
> act on. What survives is item 3's substance — a capital's fall differs in KIND from
> an ordinary city's.

**Decision.** The capital is a political designation on one of a realm's main
city sectors, needed because land and sovereignty are different currencies:
settlement moves land (economic/military substance, sector-resolution), while
vassalage/collapse/surrender act on the regime as a single object — the capital
is the polity layer's anchor on the map. Sealed items:

1. **Designation:** the player picks one of the seat's main city sectors as
   capital at match start (two-province seats → a real opening judgment:
   safe-interior vs forward-gate). Bot default rule deterministic (open
   question: exact rule).
2. **Capital guard (근위대), land-derived:** guard = coefficient × capital
   sector populationValue (**가안 350/pop** → gate city 2.0 ≈ 700, port 2.4 ≈
   840, nomad 0.75 ≈ 263). Garrison-class: place-bound, own local ceiling,
   outside fieldCap, register-backed (serving bodies). It is the SAME stock as
   the final-battle capital garrison (one stock, located; front wear thins the
   last stand). Replaces the flat abstract 1500.
3. **Capital fall = regime event:** collapse cascade / forced-vassalage
   trigger — different in KIND from an ordinary city's fall (value transfer).
4. **Forward-capital reward is emergent, not bolted on:** a forward capital's
   guard thickens the realm's busiest gate, freeing the field army for
   campaigns (the 天子守國門 arithmetic). No multiplier grants.
5. **Two-stage wiring:** the whole package (designation + guard + regime
   event) wires in ONE later pass (stage ②) with its own sweep — never
   together with the growth re-measurement.

**Rejected alternatives (recorded):**
- *Flat reuse of capitalGarrison 1500 as front reinforcement* — a stock
  calibrated for the final battle, double-purposed; overweights small fronts
  (1.7× a border sector's 900) and ignores regional identity (user, 2026-07-10).
- *Mobilization-hub buff (recruit base ×1.25 on capital-front wars)* — bolted-on
  number not derived from the world model; its goal (offensive pull toward
  forward capitals) is served emergently by item 4. May be revisited at stage-②
  measurement ONLY if the forward incentive proves too weak in data; the sealed
  seat for "recruit more than base" remains the surge SIZE axis (MT-③),
  currently unmodeled in L2.
- *Cost-side capital discount (draft price)* — provably inert at L2: treasury
  runs surplus all match (blinds autopsy, 2026-07-07), so a price lever binds
  nothing.

**Riders.**
- Guard magnitude and per-region disposition = stage-② measurement questions
  (sweep + decapitation-spiral check: does the score's value pull minus the
  guard's resistance produce a self-magnetizing spiral on forward capitals?).
- Population parity note owed at doc-sync: capital designation adds no
  population (Σ6.0/region equal start holds; the guard draws from the existing
  register) — derived-asymmetry-consistent.
- Troop-class conversion cluster (stationing ③ semantics, field↔garrison↔guard)
  = dedicated later session (INDEX open question 2).

## CP-② 1v1 duel win-condition package — SEALED 2026-07-23/24 · L0/L1 (user, duel-pivot Wayfinder gates 1–2)

**Implements ADR 0042** (duel victory = capital fall, the sole win condition).
**Advances CP-①** (capital concept → the win-condition's mechanics). Source text:
the duel-pivot ledger gates 1–2 (`.scratch/l3-playable-seam/duel-pivot-draft-ledger.md`),
user-sealed one node at a time. This is the birthplace of HOW a capital falls and
wins; ADR 0042 records THAT it wins. Numbers are 가안 (tuned in L3 play); the
combat/supply/commit engine it leans on is P2-fixed (premises Boundary).

**Frame — capital fall = the sole win condition** (ledger D1.1 / D3.1). Exactly
one capital per realm; taking it (defeating the capital guard on its sector) wins
the match, and nothing else names a winner. A rump state is impossible — see the
CP-④ amendment below.

**Decision, by node:**

1. **Location is PUBLIC (D1.2 · L0).** Both players know the enemy capital's city
   from match start. Fog covers only the guard's strength / last-stand depth
   (the fog contract's "geography public / force dark" line), never the location.
   Rationale: poker position is public; the forward/rear tension must be READABLE
   to exist; prevents a "can't find it" hunt.

2. **Placement is player-chosen, simultaneous (D1.3 · HELD, re-openable).** Both
   realms commit a capital site at match start, then reveal (symmetric 1v1, no
   first-mover advantage — the same shape as D6.1a). Marked HELD, not vetoed.

3. **Forward/rear = capital-guard duty-cycle, axis = leverage vs variance
   (D1.4 · L0).** Forward capital: the guard sits on the busiest gate → defends
   it for free → frees the field army for offense (indirect offense, emergent,
   天子守國門). Cost: short decapitation path + front wear thins the last stand
   (guard = final-stand stock). Rear capital: a pristine deep last stand →
   resilient / low variance; cost: field army tied to gate defense, zero forward
   pressure. No new dials (falls out of CP-①); the direct-offense ×1.25 hub buff
   stays rejected (CP-①).

4. **Relocation (천도) = fixed by default + ruinous move (D1.5 · L1).** Relocation
   is possible but a gamble: it consumes a large share of the **commit budget
   (행동력)** across ~2 turns (a multi-turn national project). The guard is NOT
   stripped (place-bound, stays put); the risk is pure action-economy drain. The
   OLD capital stays win-target AND shield until relocation COMPLETES, then the
   target switches (history favors "old seat continuous until complete" —
   Jingkang). No forced cession of the old province (it only loses capital
   status). Exact 행동력 cost / turn count = 가안, deferred to measurement.

5. **Fall mechanics = two late-game paths (D2.1 · L0).** (a) overwhelming decisive
   battle vs the full guard; (b) Moscow-trap — encircle → cut supply → starve the
   guard down → finish. Both are late-game by construction (guard magnitude +
   multi-turn encirclement).

6. **Siege is EMERGENT, not an object (D2.2 · L0).** Besieging = pouring turns
   into the defender's supply ledger (slice-2 ticket 06); a cut-off garrison melts
   continuously. No artificial siege timer, no siege object.

7. **Capital guard = ordinary garrison, terrain-gated; NO special supply rule
   (D2.4 · L0).** Garrison-class (CP-①), just larger magnitude (land-derived from
   the capital sector). The capital is NOT auto-declared a supply `base`: it obeys
   the same `movement.isSupplied` predicate as any force → it CAN be encircled and
   starved (Moscow trap). Whether / how fast that is feasible is TERRAIN-dependent
   (chokepoint & corridor count, natural barriers, province type) — emergent from
   terrain + the supply predicate, tuned in the parallel map pass. The only
   difference from an ordinary city = consequence KIND (regime event / win) +
   guard magnitude. *Retraction recorded:* the earlier "capital = supply base →
   starvation-immune" proposal was withdrawn (it reverse-engineered a rule to
   force a conclusion; `isSupplied`'s on-base=always-supplied line is exactly what
   would wrongly immunize the capital).

8. **Early-rush guard = PURE EMERGENT, no hard floor (D2.3 · L0).** No "capital
   can't fall before turn N." Guard magnitude (가안 350×pop) is the only early-rush
   gate; turn-3 decapitation is prevented emergently by: guard magnitude needs a
   big (late-game) army; encirclement is multi-turn + border-alarm-visible
   (automatic response window); supply/fatigue/time cost of reaching a rear
   capital. A forward capital crackable earlier is D1.4's INTENDED risk, not a bug.
   Fragility levers if measurement demands = terrain tuning (parallel pass) or
   guard magnitude (가안), NEVER a hard floor.

9. **Bypass allowed, self-limiting → mutual-exposure duel (D2.5 · L0).**
   Field-army bypass / direct capital strike has no prohibiting rule and is
   self-limiting: cracking the guard needs a big army, which (a) fog detects
   (border alarm + a large army is scoutable), (b) undefends your own capital →
   counter-decapitation exposure, (c) pays supply/fatigue deep in enemy land.
   Consequence (the match frame's heart): the whole duel is a **mutual-exposure
   duel** — committing force to offense undefends your own win-condition (poker
   "big bet exposes you"), legible from turn 1 because both capitals are public.
   Emergent, no special rule.

**CP-④ amendment (rump-state-impossible reasoning) — amended by CP-②.** The
INDEX open-question-4 world rule ("capital lost but land remains is impossible
because the capital battle is structurally last") is RE-REASONED for 1v1: a
forward capital CAN fall before all land is taken (D1.4 risk). "Rump impossible"
now holds because **the match ends the instant the capital falls** (no time for a
rump to exist), NOT because the capital is physically the last thing standing.

**Rejected alternatives (recorded):**
- *Capital as a supply `base` (starvation-immune)* — retracted (item 7): it
  reverse-engineered a rule to force "the capital can't be starved."
- *Hard early-rush floor ("no fall before turn N")* — rejected (item 8): the
  emergent gates (guard magnitude, encirclement visibility, mutual-exposure) do
  the job; a floor would be an ungrounded special rule.
- *Points / territory / economy tiebreak alongside capital fall* — rejected at
  ADR 0042 (resurrects the removed 4X scorecard); capital fall is sole.

**Riders.**
- Guard magnitude 가안 350×pop (CP-①), 천도 행동력 cost / turn count 가안, the
  1v1 board's capital-candidate terrain profiles, and the terrain-dependence of
  encirclement all resolve at the **parallel map pass** (ledger "capital-terrain
  gate") + stage-② measurement — not this seal.
- L3 watch: does capital fall arrive at a FUN pace (not a death spiral, not
  fizzle)? The anti-fizzle decay that induces it lives in match-arc income + force
  limit (D5.1), not in capital/ — pointer, not a copy.

## CP-⑤ Guard coefficient, re-cut for the duel — SEALED 2026-07-31 (user) · L0

**Amends CP-① item 2's coefficient: 가안 350/pop → 가안 2,500/pop.** Everything
else about the guard is untouched — land-derived from the capital sector's
`populationValue`, garrison-class, place-bound, outside `fieldCap`,
register-backed, no special supply rule (CP-② item 7), one stock with the
last-stand garrison. Numbered ⑤ because ④ is taken by CP-②'s rump amendment.

**What forced it.** Measured on `terrain-cradle@r1` against the sealed opening
coordinates, the 350 coefficient makes the capital guard *weaker than an ordinary
border town*:

| quantity | value | source |
|---|---|---|
| highest sector `populationValue` on the board | 2.4 | `cradle-r1` artifact |
| ⇒ strongest possible guard at 350/pop | **840** | derived |
| ⇒ weakest possible guard (pop 0.5) | 175 | derived |
| one ordinary border shield | **900** | `garrisonPerBorderSector`, M13a |
| opening field army (f₀ 0.5 × force limit 18,000) | **9,000** | M13a, R9 |

So the strongest guard on this board is **0.93 of one border shield** and **9.3%
of the opening field army**. Two CP-② items rest on the opposite being true:
item 7 seals the guard as "an ordinary garrison class **at larger magnitude**",
and item 8 rests the whole early-rush defence on "guard magnitude needs a big
(late-game) army" with no hard floor behind it. At 840 against 9,000 both are
false, and turn-3 decapitation is available to a fraction of the opening army.

**Why CP-① is not at fault.** It sealed 350 on 2026-07-10 for a five-seat world
where the guard's job was *front reinforcement* — item 4's 天子守國門 arithmetic.
ADR 0042 then made capital fall the **sole win condition** and CP-② loaded the
guard with that duty on 2026-07-23/24 **without re-cutting the coefficient**. This
ruling is that re-cut, owed since the pivot and recorded nowhere until now.

**The floor is derived; the value above it is the user's.** CP-② item 7 requires
"larger magnitude" than an ordinary garrison, and M13a puts that at 900. The
weakest capital a player may legally pick carries `populationValue` 0.5 (R3 allows
any owned sector), so honouring item 7 at *every* legal capital requires a
coefficient of at least **1,800**. That is the floor, and it is arithmetic.
**2,500 is the user's choice above it**, for the reason below.

**Why above the floor — the forward capital** (user, this ruling). A forward
capital is normally a liability: easy to reach, easy to lose. CP-① item 4 already
answers that with an **emergent** reward — the guard thickens the realm's busiest
gate and frees the field army — and explicitly forbids granting it a multiplier
("No multiplier grants"). Raising the coefficient makes that *existing* reward
larger without adding a device, so the intent is served through the lever CP-① ①
already sanctioned rather than through a new one.

**What 2,500 does.** Army an attacker must bring to take the capital, at full
commitment on both sides (M2's lever) and ordinary march wear; multipliers cited
from M5 and M2, none restated here:

| capital | guard | army needed | against a 9,000 opening field |
|---|---|---|---|
| strongest, plains (pop 2.4) | 6,000 | 7,500 | 83% |
| weakest, plains (pop 0.5) | 1,250 | 1,563 | 17% |
| mountain, e.g. 관중 `r6_s5` (pop 2.1) | 5,250 | 9,844 | **109% — needs growth first** |

Taking a capital therefore costs most of a field army, and a mountain seat cannot
be taken with opening strength at all — which is the match arc D6.4 asks for, and
which only became true when ADR 0046/TC-⑮ made a sector defend on its own ground.

Status **AGREED**, value **가안**, validation **L0** (hand reasoning against
sealed coordinates; no grid, no battery). **What would settle it: playtest.** The
user's framing was explicitly provisional — try 2,500, move it while playing.
Ticket 07 builds against this row, and a later change is a **value change here**,
not a redesign.

**Discharges** `DECISIONS-OWED.md` Part 2 row #10 ("capital guard magnitude"), which
recorded this as a live conflict between 350×pop and `MAGNITUDE.md`'s
`capitalGarrison 1500`. That framing was wrong twice over: CP-① item 2 had already
retired the flat 1500 by name on 2026-07-10, and M13a's line is a parenthetical
harness inventory carrying no status word — so there were never two seals, only an
unstamped one. The real question was the coefficient's *size*, which no row asked.
