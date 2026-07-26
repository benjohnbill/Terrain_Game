# ADR 0045: Sited Recruitment, Readiness, and Province-Origin Accounting

Date: 2026-07-26

Status: Accepted (sealed 2026-07-26, R19 user-approved design)

- Relationship:
  - **Amends ADR 0043:** completes opening placement and sector-edge expansion to
    hex endpoints.
  - **Amends ADR 0044 item 4:** land transfer moves remaining civilians;
    already-serving origin composition stays with its force, and permanent losses
    reduce the same origin register share.
  - **Amends ADR 0014:** garrison replenishment is paid recruitment or physical
    transfer, never a free automatic pulse.
  - **Amends DOMAIN_MAP `Land-derived state`:** sector-sited muster is now the
    MVP contract rather than a reserved extension point.
- Mandatory-ADR trigger: this changes a cross-feature model. Recruitment now
  composes provincial accounting, positioned movement, garrison posture, combat
  readiness, turn resolution, and fog projection.
- Authority: user-approved R19 design, 2026-07-26. Production birthplaces are
  match-arc MT-⑥ and war-model-build WM-④.

## Context

ADR 0043 makes mobile substance positional, while the preceding recruitment
contract created one positionless field scalar. Once a field army may divide,
adding recruits to it without a source, endpoint, or readiness rule becomes an
unstated placement rule. The R19 authority audit confirmed that neither the
archive nor the existing seal chain supplied a composable answer.

The decision must retain the existing economic anchors: the continuous integral
Surge Draft price, one command point buying +1%p of force limit, and the
20-point command pool. It must also preserve total-bodies accounting: a recruit
is a civilian becoming serving, not a disappearance from the province register.

## Decision

1. **A recruitment intent is sited.** It names a controlled front sector, a
   positive integer commit, `field` or `garrison` posture, and for field posture
   an optional one-normal-march destination and optional destination detachment.
   A field request without a destination remains at its muster hex. Garrison
   requests cannot declare a destination or detachment.

2. **Legality reads the turn-start snapshot.** The actor must control the
   sector and own its parent province register at turn start. Field recruits
   muster at the sector's centre-nearest hex; destination reach uses ADR 0043's
   canonical minimum-cost graph and normal-march allowance. Forced march is not
   available in the raising turn. Invalid ownership, posture, destination, or
   reach rejects the intent; scarcity is fulfilled proportionally rather than
   made invalid.

3. **One realm settles legal requests as a deterministic batch.** Requested men
   are the sealed +1%p force-limit conversion per commit point. Province-local
   civilian shortages prorate by requested men, then field and local-garrison
   headroom apply, then the aggregate continuous draft bill applies, then any
   treasury limit prorates. Integer remainders go largest-first, breaking exact
   ties by canonical sector coordinate and stable intent identity. Splitting an
   order cannot change the authoritative bill or evade a price knee.

4. **Province origin is persistent accounting state.** The register remains
   total living bodies by province, and local civilian availability is
   `livingRegister(province) - livingServingBodiesOriginatingIn(province)`.
   Every detachment, garrison, and not-yet-ready cohort carries integer origin
   composition. Recruitment adds the recruiting province's bodies to serving
   composition without changing its register; movement and posture transfer
   preserve origins; division prorates deterministically; merge sums; casualties
   reduce both origin composition and the same province register. On land
   transfer, remaining civilian bodies transfer with the province while serving
   bodies retain their present realm and origin composition.

5. **Opening origin composition is derived, not authored.** Opening garrisons
   originate in their containing province, are removed from its civilian
   capacity, and the opening field army is allocated across remaining provincial
   capacities proportionally with canonical-province integer remainders.

6. **Fulfilled recruits are next-turn-ready.** Field recruits form a separate
   not-yet-ready cohort, may normal-march and co-locate during the raising turn,
   and may attach as a separately identifiable reinforcement when the named host
   reaches the declared endpoint. Garrison recruits remain at their named sector.
   Neither posture attacks, defends, contributes garrison effects, nor appears
   in current-turn combat forecasts until the next turn boundary. An attached
   component then merges into its host; an independent cohort becomes a ready
   detachment. A failed join endpoint rejects the clause before mutation.

7. **Resolution is ordered:** turn-start legality → recruitment batch creation
   and payment → normal movement and co-location → combat using ready substance
   only → occupation, capture, and loss → information update → next-turn
   readiness transition. A captured not-yet-ready cohort is a match-permanent
   loss: its origin components and the same register shares are removed, without
   refund, prisoners, or captor-owned substance. Departed field recruits survive
   source-sector capture subject to ordinary movement legality.

8. **Projection is honest but incomplete.** Positive fulfillment updates the
   recruiting sector's existing banded mobilization signal. It reveals sector
   concentration, not exact men, final destination, treasury, or commit; zero
   fulfillment creates no concentration signal. Recruits are excluded from every
   current-turn combat forecast and enter next-turn enemy substance possibilities
   at their achieved position and readiness.

9. **The command economy is unchanged.** The pool remains 20 and one point
   remains +1%p of force limit. Sector selection adds the intended
   breadth-versus-concentration decision; a pool-size change needs a separate
   magnitude amendment backed by L2 evidence.

10. **ADR 0043's graph gains deterministic endpoint realization.** The opening
    field army occupies the chosen capital sector's centre-nearest hex. An
    authored edge uses natural hex contact where present; otherwise it links the
    endpoint sectors' nearest hex pair at cost 1, with canonical-coordinate ties.

## Consequences

- Code consumers implement four separable responsibilities: recruitment batch
  calculation, provincial origin accounting, operational placement/readiness,
  and Runtime-owned orchestration/projection.
- Garrison replenishment is never a free automatic pulse. It is either paid
  recruitment into garrison posture or physical transfer subject to movement.
- Own-side views must distinguish ready from next-turn-ready mass. Enemy views
  use the established band and reach-cone doctrine.
- The authoritative verification seams cover deterministic batch permutation,
  integral billing, origin conservation, readiness timing, capture loss,
  mobilization signals, and Node/browser parity.

## Rejected alternatives

- Immediate combat eligibility: it permits unobserved same-turn recruitment to
  decide combat and creates instant wall refill.
- No raising-turn movement: it makes siting inert and imposes an unnecessary
  second delay.
- Immediate aggregation into a combat scalar: it hides ineligible mass.
- Click-order or fixed-sector priority: presentation order becomes an undisclosed
  simulation rule.
- Recruitment decrementing the register or authored opening origins: both violate
  total-bodies accounting or add unnecessary world-authoring burden.
- Raising the pool to 30 in this decision: it changes tempo and requires its own
  command-economy measurement and magnitude decision.
