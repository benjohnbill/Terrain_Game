# ADR 0046: The Sector Is the Atom of Combat — Siting, Approach, and the Allocation Key

Date: 2026-07-31

Status: Accepted (sealed 2026-07-28/31, geography-battle grill on ticket 06c's
registered gaps)

- Relationship:
  - **Amends (1 ADR):** **ADR 0043** — its operational layer moves armies over a
    hex graph while combat was reachable only at authored region borders. Item 7's
    graph is unchanged; what changes is that standing on ground you do not hold is
    now sufficient to produce an engagement, and that the commit key follows the
    engagement rather than the border. ADR 0043's header carries the stamp.
  - **Amends (1 seal):** terrain-cradle **TC-⑬**'s *terrain* column, at its
    birthplace, as **TC-⑮**. TC-⑬'s *crossing* column (river 0.70, strait 0.55) and
    its reachable-weakest-link rule are untouched.
  - **Confirms (3):** **ADR 0032** (the front sector is the operational atom) —
    this ADR is that principle reaching combat siting; **ADR 0015** (the river
    crossing prices the engagement, not the movement) — unchanged, and now the only
    thing the river door contributes; **ADR 0042** (capital fall is the sole win
    condition) — this ADR is what makes that condition reachable.
  - **Bounded by:** the `AGENTS.md` guardrail that Phase-1 war stays grounded in
    legible real-world intuitions.
- Mandatory-ADR trigger: this changes a **cross-feature model** (combat siting,
  geography, the turn loop, and the commit economy read it) and it is what makes
  the **win condition** reachable at all. Both triggers apply.
- Authority for the decision itself: user, geography-battle grill 2026-07-28/31.
  This ADR records it. Evidence and the full session trace:
  `.context/record-geography-battle-grill-2026-07-29.md`.

## Context

Ticket 06c wired the decisive battle and registered four gaps rather than filling
them. Grilling those gaps showed three of the four were one structural fact, and
that the registered description of the sharpest one had its direction reversed.

**A battle could only be sited on the endpoint sector of an authored region
border.** `contestedFronts` walks `world.edges`, and `engagementsOf` seeds its
candidate sites from that walk. Interior sectors were excluded for a stated
reason: TC-⑬ keys defensive ground to the *door*, and no seal mapped a sector's
own `terrainLayer` onto M5's ladder, so interior ground had no multiplier to be
fought over.

The consequence, measured on `terrain-cradle@r1` across all 15 legal partitions
(30 realm-seats):

- **30 of 30 seats could enter enemy ground without standing on a single
  fightable sector.** Mean **21.2** enemy sectors reachable with zero battles.
- **41 of 45** authored-marker capitals were reachable with zero battles.
- `movementOrderRefusal` has no ownership check and there is no zone of control,
  so an army marches through enemy land without stopping or fighting.

06c's SYNC-DEBT row recorded this as "most capitals cannot be attacked at all".
The measurement says the opposite: most capitals **cannot be defended**. The
direction matters, because it rules out the fix the row proposed first
(adjacency-derived fronts, which raises battle-capable sectors only from 27 to 33
of 56) and selects the one it proposed second.

Two further findings shaped the decision:

- **Every sector is terrain-uniform.** 0 of 56 carry more than one `terrainLayer`,
  so a sector already has one well-defined terrain. Six of the seven authored
  layers map onto M5 by derivation and the seventh (`mountain`) matches a sealed
  rung by name — `Mountains ×1.5`, in M5's ladder since 2026-07-03 and never used,
  because nothing read a sector's terrain.
- **Making the ground depend on the attacker's approach produced a phantom
  choice.** Under an earlier reading, arriving by an undoored neighbour softened
  the defender's terrain to the sector's own. Measured, that route costs **0 extra
  turns on 20 of 20 land doors** (sectors average 5.2 hexes against march speed 3;
  only straits cost 2–3 turns), and 100 flanking men swung R from 0.56 to 2.22.
  A hex-grain wiggle was deciding a sector-grain outcome.

## Decision

1. **An engagement is sited wherever a hostile force stands.** The site predicate
   is a sector predicate — an invading force standing on ground it does not hold —
   and is no longer gated to authored-border endpoints. Resolution stays **atomic
   per sector**, as 06c sealed it; `engagement.ts` already says "the unit of
   resolution is the SECTOR, not the front" and `engagementsOf` already fires on
   presence. Only the candidate-site seed changes.

2. **A sector's defensive terrain is its own, always.** It does not depend on how
   the attacker arrived. The door contributes the **attacker-side** terms only —
   the crossing multiplier, and frontage if and when that is built. This mirrors
   the calculator's existing split: `defensePower(side, terrain, fortification)` is
   the ground the defender stands on, `attackPower(side, crossing)` is what the
   attacker did to reach it. The `terrainLayer` → M5 binding lands at **TC-⑮**;
   values are cited from M5 and restated nowhere else.

3. **The approach is recorded as the traversed hex arc, and no longer selects the
   ground.** `{fromHex, toHex}` is a value movement already computes. Recording it
   at hex grain is the seat for the directional terrain the design wants later
   (river current, ravine axis, ridge facing) without a contract change; reading it
   today yields only which door, if any, was crossed. This retires the
   reachable-weakest-link-**over-approaches** reading. TC-⑬'s reachable-weakest-link
   survives for what it was sealed for: choosing among **doors** when one sector is
   served by several.

4. **Commit is allocated per sector, not per front.** `Allocations` keys on the
   sector. The definition already required it — commit is "the share allotted to
   *that engagement*", and engagements are atomic per sector — and the
   reconciliation 06c had to write for ticket 03's case 4 (two fronts pouring chips
   into one sector) disappears. Without this, an interior engagement has no key to
   receive chips and "interior battles cannot use commit" becomes a rule nobody
   decided. The order-key namespace already mixes kinds (`ORDER_RECRUIT:<id>`), so
   sector ids fit it.

5. **Hex is physical; sector is decisional.** Promoted to `DOMAIN_MAP.md`
   § Design Principle. Movement destinations and approach arcs are hex-keyed
   because marching and crossing are physical acts; terrain interpretation, commit
   allocation, and engagement resolution are sector-keyed because they are
   judgement and its object. The arithmetic check that settles it: the stack is
   **20** chips per realm per turn, and a realm holds **21–35 sectors** but
   **105–187 hexes** — at hex grain the allocation unit is finer than the resource,
   which is not an allocation.

## Consequences

- **Ticket 07's blocker is discharged in design.** Battle-capable sectors go from
  27 of 56 to all 56, and the capital-fall win condition becomes reachable by
  fighting rather than by walking. The implementation is owed by ticket **06e**, so
  the SYNC-DEBT row stays open pointing there.
- **Ticket 06e is the implementation home** for items 1–4 and for the rout
  displacement ruling (war-model-build WM-⑤). 06d gains `blocked by: 06e`, because
  capturing an interior sector requires an engagement to have been sited there.
- **Passes become asymmetric, and that is the point.** Under item 2, 관중's three
  mountain sectors — which are exactly its three pass endpoints — defend at ×1.5
  while the plains and desert sectors on the far side defend at ×1.0. At 1,800
  against a 900 garrison that is R 1.33 versus R 2.00. 四塞之地 comes out of the
  ground rather than out of the door, and 중원's plains sector stops collecting a
  defile bonus it has no geographic claim to.
- **A river-door battle is numerically unchanged.** TC-⑬ routed river and strait
  through the *crossing* column, which this ADR does not touch: 1,800 against 900
  across an opposed river is R 1.40 before and after.
- **Frontage stays unbuilt, and its justification is now weaker.** TC-⑬'s "×2.0 is
  validated only as the residual AFTER a frontage cap" concerns a `pass` **terrain**
  value that item 2 stops using. Frontage is deferred into the
  operational-manoeuvre pass rather than abolished — D9 argues the cap deliberately
  ("a cap, never a multiplier … it *classifies* sectors rather than scaling them"),
  and the defect is not the cap but that D9's `Removability` obligation is met at
  zero cost on this map.
- **Rout becomes a defect rather than a gap.** With engagements sited on presence,
  a routed force that stays is re-engaged every turn, so "stay" becomes
  annihilation and M4's open-escape clause (half the remainder slips away) becomes
  a lie. WM-⑤ rules the displacement.
- **What this does not do.** It does not price transit through ground you do not
  hold — an army still passes through unopposed, which is R14's registered
  interception gap and the reason a frontage cap would be inert. It does not touch
  fog, supply, or Encirclement's threshold. It does not decide whether approach
  should *ever* modify the defender's ground: the operational-manoeuvre pass may
  add that on top, but reverting item 2 requires the amendment protocol.
