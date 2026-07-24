# Capital — Rulings

Feature-local decision record (Record layer, birthplace tier). Append-only.

## CP-① Capital concept package — SEALED 2026-07-10 · L0 (user, occupation-geography brainstorm session)

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
