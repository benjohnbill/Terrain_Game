# ADR 0043: The Operational Layer Moves — Position, Reachability, and the Price of a March

Date: 2026-07-26

Status: Accepted (sealed 2026-07-26, Wayfinder gate C, rulings R12–R15)
Amended by: ADR 0045 (2026-07-26) — opening placement is the capital sector's
centre-nearest hex, and every authored sector edge now has deterministic hex
endpoints.
Amended by: ADR 0046 (2026-07-31) — the movement graph of item 7 is unchanged, but
combat is no longer reachable only at authored region borders: an engagement is
sited wherever a hostile force stands, and the commit allocation key follows the
engagement's sector rather than the border.

- Relationship:
  - **Amends (1):** the `DOMAIN_MAP.md` Tier-0 entry ✅ `Position as product` —
    its "no standalone move action and no tracked army counters" clause is
    retired. The entry's protected content survives; see § Decision item 5.
  - **Adopts:** the slice-2 operational-layer design spec §3 (movement contract)
    and §4 (field-army doctrine), with one re-cut — the speed dial does not
    transplant, see § Consequences.
  - **Confirms:** ADR 0025 (uncertainty duel) — surprise requires that arrival and
    engagement can share a turn; ADR 0015 (river crossing prices the engagement,
    not the movement) — unchanged, and therefore *not* a ground for hex-grain
    movement; ADR 0032 (front sector is the operational atom); terrain-cradle
    TC-⑪ (hex orientation and resolution frozen).
- Mandatory-ADR trigger: this changes a **cross-feature model**. Movement is read
  by combat (substance at a front), by fog (the reach cone), and by the economy
  (which land a realm holds), so it cannot live as a feature-local ruling.
- Authority for the decision itself: user, Wayfinder gate C. This ADR records it.

## Context

Ticket 06 (the decisive-battle core) was blocked on a conflict recorded as
`DECISIONS-OWED.md` Part 2 #14, framed as three-way: `DOMAIN_MAP`'s
`Position as product` forbids army counters and standalone movement; gate 08 bought
full compound depth; the slice-2 movement contract requires both.

Reading the landed L3 build reframed it. `readFronts` resolves a front from
**committed chips alone**, while the sealed battle formula is
`substance × commit lever × quality × fatigue`. No rule anywhere stated how
*substance* reaches a front, and `RealmForces.field` is a single scalar with no
location. The live gap was not "should armies march hex by hex" but "does a force
have a position at all" — and without one, the sealed fatigue dual ledger loses a
whole ledger (march fatigue has no input, and supply has no connectivity question
to ask), defeat-in-detail cannot emerge, and the reach cone has nothing to be a
cone *of*.

Two further facts bounded the answer:

- The **conflict was partly an artifact of conflating two layers.** `Position as
  product` itself preserves hexes as movement *math* substrate, and slice-2 §3
  specifies **destination-only orders with automatic pathing** and no per-hex
  micromanagement. "Hex or sector" was never one question.
- The **build had already been pointed this way.** Ticket 02 baked
  `sectorAdjacency` into the frozen world artifact, and its own comment states the
  reason: "Sector-level movement, supply, and reach cones need it explicit."

## Decision

1. **Position exists.** A field army occupies a place, and it can be the wrong
   place. Substance at a front is the detachment(s) present or arriving there;
   being in two places requires the §4 free division that is already sealed.

2. **Hex-denominated math, destination-grain orders.** A destination order
   produces one minimum-**cost** route on the hex graph. The route is divided into
   turns by cost fraction — not distance fraction — so a costly turn covers fewer
   hexes. Redirect is free at any time and recomputes from the current position;
   fatigue already spent is not refunded, which is the entire price of changing
   one's mind and requires no new device.

3. **A march costs turns and fatigue, never commit.** Grounds, in descending
   strength: commit is a *multiplier* (the M2 lever) and a march has no
   multiplicand — chips do not make an army arrive better, only arrived or not;
   R2's linear-in-commit grammar grades an outcome and movement's outcome is
   binary; slice-2 §3 already prices movement's graded part (forced march) in
   fatigue while refusing "a third resource" in as many words; and §4's
   enumeration of what commit buys omits movement.

4. **March fatigue accrues per hex** — proportional to distance travelled, which
   is also the archive's rate basis. The rate value is not sealed here.

5. **Commit legality is reachability, and arrival does not consume the turn.** Any
   force that can reach a front by resolution time may be committed to it. This
   reuses the sealed reach cone (`reachCone`, BFS to radius `turns × speed`) with a
   second caller: fog asks it where an enemy can be next turn, legality asks it
   whether *I* can be there this turn. Legality remains Runtime-owned (gate 02),
   so an unreachable front is a rejected order rather than a caller's duty.

   This is what preserves what `Position as product` was protecting. That entry
   forbade "movement turn-tolls before attacks (a scripted two-turn sequence
   violates atomic turn resolution)" — and under item 5 there is no toll: an
   arriving force fights on arrival. It also forbade "hex-by-hex marching", which
   item 2's destination grain likewise preserves. What the entry loses is only its
   claim that no move action exists.

6. **Terrain movement cost is uniform 1.0 for now.** The authored per-hex terrain
   is a region-painted placeholder — whole regions carry one layer, which is why
   116 of 292 hexes are `plains`. Pricing movement against it would harden a
   placeholder into a rule. The extension point is hex-denominated and open.

7. **The movement graph is hex adjacency UNION the authored edges.** Measured: the
   pure hex graph has **two** components, 274 hexes (r1–r9) and 18 (r10), because
   only 15 of the 17 authored edges are hex-adjacent at their endpoints. The two
   that are not are both `strait`, and both are the doors into r10 — an island. A
   pathfinder over hex adjacency alone therefore rejects every march into r10 as
   unreachable, which R15 item 3's "an unreachable order is rejected" would report
   as correct behaviour while being a defect. Every authored edge is a link;
   the 15 redundant ones cost nothing to include and uniformity is cheaper than a
   special case. `choke.cap` still bounds projectable mass across that door.

## Consequences

- **The speed dial transplants after all, and movement introduces no new value.**
  The claim that it could not (`DECISIONS-OWED.md` #14, and repeated during this
  gate) compared 3 hexes/turn against a median *sector size* of 5 hexes. That was
  an inference from area to spacing, and it is wrong: measured centroid-to-centroid
  on `terrain-cradle@r1`, **adjacent sectors are a median of 2 hexes apart**
  (1/2/3/5 min/med/p75/max over 84 intra-region pairs), because a 5-hex sector is a
  small blob whose neighbour's centre is close. At speed 3 the board yields
  reinforcement in 1–2 turns (own depth to own front, median 3 / p75 5), invasion
  in 2–3 (own front to enemy sector, median 5 / p75 7), and lateral redeployment in
  3–4 (front to front, median 8 / p75 10) — fast local response against genuinely
  costly redeployment, which is the spread that makes being in the wrong place
  hurt. Speed 2 pushes redeployment to 4–5 turns; speed 4 drops it to 2–3 and
  position stops mattering. **3 is retained**, which moves it from "a new value is
  owed" to "an existing Part 3 value needs bulk approval" — and because the reach
  cone's radius is `turns × speed`, that approval covers a fog dial too.
- **`DOMAIN_MAP` ✅ `Position as product` is rewritten** to a Tier-0 summary that
  points here, per the Vocabulary Law's single-definition rule. It stops asserting
  the absence of a move action and keeps the no-micromanagement content.
- **Ticket 06 is re-cut rather than unblocked.** Its twelve acceptance items span
  the whole slice-2 operational layer plus the slice-1 combat core, a surface the
  archive built across eleven tickets.
- **A later terrain-authoring pass produces a new world revision (`r2`).** TC-⑪
  froze orientation and resolution, not terrain values, so re-painting terrain is a
  revision bump rather than a seal violation. The movement cost table lands with
  that pass.
- **Two items are parked by name, not forgotten.** Morale (사기) as a device
  separate from commit is a later grill — commit is judged to absorb part of its
  role, and whether the rest is needed is unsettled. Interception of a force in
  transit is undesigned everywhere and is therefore out of this slice under the
  build's four-kind workflow (kind 3), pending a scope ruling.
