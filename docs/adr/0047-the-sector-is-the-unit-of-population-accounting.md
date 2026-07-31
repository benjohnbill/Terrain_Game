# ADR 0047: The Sector Is the Unit of Population Accounting

Date: 2026-07-31

Status: Accepted · **Amended by capital CP-⑥ (2026-08-01)** — item 5's "opening
garrisons originate in their own sector" takes one exception: the **capital guard**,
whose origins are apportioned across the realm the way item 5 already apportions the
opening field army. At sector grain no legal capital can back its own guard (0 of 840
candidates), so the exception is what keeps the rest of item 5 true rather than
unseatable. (Sealed 2026-07-31, user ruling on the register/origin grain seam.)

- Relationship:
  - **Amends ADR 0045** items 2, 3, 4 and 5: **province-origin accounting becomes
    sector-origin accounting.** Everything else in 0045 — sited recruitment,
    one-turn readiness, the batch's determinism, the command economy, the
    projection doctrine — is untouched, and so is its total-bodies principle,
    which this ADR exists to keep true. ADR 0045's header carries the stamp.
  - **Amends match-arc MT-⑥**, 0045's Production birthplace, in the same batch.
  - **Confirms ADR 0044.** Its "acquired land transfers the conscription register
    share it carries, unripened" becomes **exact**: a captured sector carries its
    own register, with no apportionment step anywhere.
  - **Completes match-arc MT-②'s amendment** of the same day, which moved the
    *register* to sector grain and left origin composition behind at province
    grain. This ADR is that ruling reaching its other half.
  - **Keeps R17 superseded.** Its proportional formula stays retired; this
    decision is what makes retiring it possible without a replacement.
- Mandatory-ADR trigger: this changes a **cross-feature model**. Origin
  composition is read by recruitment, casualties, rout displacement, land
  transfer, the economy projection, and the opening derivation.
- Authority for the decision itself: user, 2026-07-31, on consistency grounds —
  population, civilians, the register and origin should all attribute to the same
  object. This ADR records it.

## Context

MT-② moved the conscription register to **sector** grain on 2026-07-31, for a
stated reason: `populationValue` is a sector field, and a province split across
the front line is the normal case rather than an edge case (관중 carries pop 0.5
and 2.1 inside one province). Ground changes hands per sector, so sector grain
makes succession exact with no formula.

**Origin composition did not move with it, and the two are joined by one
subtraction.** ADR 0045 item 4 seals

> "The register remains total living bodies **by province**, and local civilian
> availability is `livingRegister(province) − livingServingBodiesOriginatingIn(province)`."

Register and serving are the minuend and subtrahend of a single expression, so
they cannot be independently keyed. `game/src/domain/force.ts`
`availableCiviliansByOrigin` enforces the relation with a **throw**, not a clamp:

> `Serving bodies from ${region} exceed its living register.`

**Measured on the real board.** 관중's six sectors carry registers 900 / 1,740 /
1,740 / 900 / 1,740 / 3,780 = 10,800. At MT-③'s structural-maximum mobilization
(58%), 6,264 of those bodies are serving. Losing `r6_s5` alone leaves 756
civilians; losing `r6_s5` and `r6_s1` leaves **−984**, and the Runtime throws.
This is reachable in ordinary play, and ADR 0046 made it *more* reachable by
turning every interior sector into a battle site.

Three readings were weighed:

- **(a) the whole sector register transfers.** MT-②'s literal wording. It leaves
  a realm holding soldiers whose register belongs to the enemy, which requires
  demoting the invariant from a throw to a clamp — and that abandons ADR 0045's
  total-bodies accounting, since the register would stop being "total living
  bodies". Cheap in code, but it buys the cheapness with a definition.
- **(b1) apportion the province's serving bodies across its sectors.** This is
  R17's proportional formula in another costume, and MT-② superseded R17 hours
  earlier. Rejected as reversing the same day's ruling.
- **(b2) move origin composition to sector grain as well.** Wider — 68
  `RegionId`-keyed sites across 11 files, and one public projection shape — but
  it is the only reading under which both seals stay true.

The user chose **(b2)**, on the ground that population, civilians, the register
and origin are all facts about the same object and should be keyed to it.

## Decision

1. **Origin composition is keyed by sector.** `OriginComposition` becomes
   `Record<SectorId, number>`. Every detachment, garrison, and not-yet-ready
   cohort carries integer origin composition at sector grain, replacing ADR 0045
   item 4's province keying.

2. **Local civilian availability is a sector quantity:**
   `livingRegister(sector) − livingServingBodiesOriginatingIn(sector)`. The
   relation is unchanged; only its key moves. The invariant stays a **refusal**,
   not a clamp — a negative civilian count remains a conservation break to be
   caught, which is the whole reason this ADR exists rather than option (a).

3. **On land transfer, remaining civilian bodies transfer with the sector**,
   while serving bodies retain their present realm and origin composition. This
   is ADR 0045 item 4's rule verbatim at the finer grain, and it is what makes
   ADR 0044 exact: the conqueror receives the captured sector's civilians and
   never the bodies already under arms elsewhere.

4. **Recruitment scarcity is sector-local** (ADR 0045 item 3's "province-local
   civilian shortages" becomes sector-local), and legality reads the **sector's**
   register rather than "its parent province register" (item 2). Under sector
   grain the parent-province clause has no referent for a split province, which
   is the defect that opened this question.

5. **Opening origin composition derives per sector** (ADR 0045 item 5): opening
   garrisons originate in their own sector, and the opening field army is
   allocated across remaining sector capacities proportionally, with canonical
   **sector**-id integer remainders.

6. **The projection follows the grain.** `ProvinceForcesView` becomes
   sector-keyed and is renamed accordingly; its three fields (register, serving,
   availableCivilians) are unchanged in meaning. This is a public contract
   change and moves with its callers.

7. **What does *not* move.** Provinces remain the map's structure and the
   partition's unit: `Realm.regions`, `Sector.regionId`, the world schema, and
   the region-per-realm draw are untouched. What moved is **population
   accounting**, not the region concept. A reader who finds `RegionId` in the
   world artifact has found the map, not a stale register.

8. **Two laws still govern bodies, and they stay separate.** Casualties destroy
   a body and shrink the register permanently, because blood is permanent
   currency (SPEC; 06c). Transfer and leaving service move a body without
   touching the register (WM-⑤). A single conservation invariant across both
   fails on casualties and reads as a transfer bug.

## Consequences

- **Ticket 06d grows.** Its register checkbox was already a grain change; this
  makes it a grain change to *two* coupled types plus a public projection shape.
  The ticket carries the new scope and cites this ADR.
- **Nothing needs a within-province apportionment anywhere.** That is the
  positive result: R17 stays superseded, MT-②'s "no formula at all" holds, and
  WM-⑤'s rout survivors return to a sector register that exists.
- **The throw becomes reachable-but-correct rather than reachable-and-wrong.**
  Under the sealed opening derivation, serving bodies from a sector are drawn
  from that sector's own register, so the subtraction cannot go negative through
  transfer alone.
- **`limitedBy: 'province'`** in the recruitment result is renamed with the
  grain; it is a display discriminator, not a rule.
- **This does not decide `conquest damage`** (still a seam at identity 1.0), the
  supply predicate (R16), or anything the operational-manoeuvre pass owns.

## Rejected alternatives

- **The whole sector register transfers, invariant demoted to a clamp** —
  option (a). It is materially cheaper and its game reading is defensible ("lose
  the land your army came from and you cannot replace them"), but it silently
  redefines the register away from total-bodies accounting, and a definition
  change is not a value change. If it is ever wanted, it should arrive as its own
  ruling at MT-②, not as a side effect of a transfer writer.
- **Proportional apportionment of a province's serving bodies** — option (b1),
  which is R17 restored hours after MT-② retired it.
- **Leaving origin at province grain and rolling sectors up for the join** —
  it needs a rule for which sector of a province loses a body to a casualty, and
  that rule is unwritten and material, since it decides what a later capture
  hands over.
