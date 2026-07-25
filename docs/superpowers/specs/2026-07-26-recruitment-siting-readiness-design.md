# Recruitment Siting and Readiness — R19 Design Spec

- **Date:** 2026-07-26
- **Status:** USER-APPROVED DESIGN (2026-07-26 conversation); Working-layer
  specification until the publication duties in §12 land at their authoritative
  birthplaces.
- **L-trust:** L0 (design reasoning; implementation and L2 play measurement
  follow).
- **Feature owners:** recruitment truth currently originates in
  `docs/features/match-arc/`; movement and field-substance truth originates in
  `docs/features/war-model-build/` plus ADR 0043.
- **Build consumer:** L3 ticket 06a and its later 06b–06d dependants.

## 0. Purpose and scope

Ticket 05 implements recruitment against one positionless `field` scalar.
ADR 0043 requires every mobile body to occupy a position, and R19 already
records the user's direction that recruitment is sited at sector grain. This
spec closes the missing composition contract: where recruits are raised, how
they enter garrison or field posture, when they may move and fight, how local
civilian availability remains exact, and what the opponent may learn before
the recruits become combat-effective.

This design preserves the existing recruitment economics:

- one commit point orders 1%p of the realm's force limit;
- the continuous Surge Draft price curve and affordability bounds remain;
- the command pool remains 20;
- movement costs turns and fatigue, never commit.

In scope: the Runtime order contract, deterministic batch settlement,
province-origin accounting, one-turn readiness, normal first-turn movement,
garrison/field destination, capture consequences, information projection, and
public verification seams.

Out of scope by explicit boundary: the player's click sequence, panel layout,
and information-layer presentation craft. A later presentation pass consumes
the data contract in §2; it does not reopen the rules.

## 1. Governing invariants

1. **Recruitment is local in space.** Every draft names one controlled sector.
2. **One commit point remains the minimum allocation unit.** Several points may
   select the same sector, and each point preserves the sealed 1%p conversion.
3. **Recruitment changes posture, not total bodies.** A civilian becomes
   serving; recruitment does not reduce the conscription register. Death does.
4. **Every serving body has one origin province.** Position and origin are
   independent: movement changes position, never origin.
5. **New recruits receive one decision beat before combat eligibility.** They
   may assemble and march during their recruitment turn but may neither attack
   nor defend until the next turn begins.
6. **Reconnaissance remains actionable, not prophetic.** Enemy action may age a
   snapshot, but newly recruited substance cannot decide combat before its
   mobilization signal has entered the next decision state.
7. **Simultaneous orders have no click-order semantics.** Settlement is a
   deterministic batch; resource scarcity prorates requests.

## 2. Recruitment intent

The Runtime accepts one recruitment intent with these semantic fields:

| Field | Meaning |
|---|---|
| `sectorId` | Controlled sector at which civilians assemble and enter service. |
| `commit` | Positive integer points allocated to this site. |
| `posture` | Initial posture: `field` or `garrison`. |
| `destinationHex` | Optional field destination reachable by one normal march from the site's muster hex. Forbidden for garrison posture. |
| `joinDetachmentId` | Optional same-realm detachment that the not-yet-ready field cohort will reinforce at the next turn boundary. Forbidden for garrison posture. |

The exact serialized names may follow the established Runtime naming pattern,
but these five values are the public contract. A UI may gather them in any
order. A field intent without `destinationHex` remains at the muster hex.
`joinDetachmentId` requires that the target detachment's resolved endpoint equal
`destinationHex`; omitting it creates an independent field detachment.

Several intents may name the same sector. Their requested mass is additive;
posture and destination keep them separate until batch fulfillment assigns
men to each intent.

## 3. Legality and placement

Legality is evaluated against the turn-start snapshot.

- The actor must control the recruiting sector at turn start and must own the
  parent province's register at turn start. Occupation alone cannot draft from
  a population that has not transferred under ADR 0044. A newly integrated
  sector becomes eligible on the following turn.
- Field recruits appear at the recruiting sector's centre-nearest hex, using
  the same canonical-coordinate tie-break as the initial field-army placement.
- Garrison recruits appear in the named sector and are bounded by that sector's
  local garrison headroom.
- A field destination must be reachable from the muster hex by the normal march
  allowance. The route uses the same canonical minimum-cost path and graph as
  ordinary movement.
- Forced march is illegal during the recruitment turn.

Invalid ownership, posture, destination, or reach is a rejected intent with a
reportable reason. Insufficient bodies, field/garrison headroom, or treasury is
not an invalid intent: the batch fulfills as much as the existing affordability
contract permits.

## 4. Provincial body accounting

The conscription register remains a per-province total-bodies stock. Local
civilian availability is derived rather than stored:

```text
availableCivilians(province)
  = livingRegister(province)
  - livingServingBodiesOriginatingIn(province)
```

Every detachment, garrison, and not-yet-ready recruit cohort therefore carries
an internal origin composition: integer men by province. This is accounting
state, not a player-managed formation attribute.

- Recruitment adds men from the recruiting sector's parent province to serving
  origin composition; it does not change that province's register.
- Division prorates every origin component with deterministic integer remainder
  allocation.
- Merge sums matching origin components.
- Casualties prorate deaths across the affected formation's origin composition;
  each death decreases both that origin component and its province register.
- Capture of a not-yet-ready cohort is a match-permanent body loss for the MVP:
  remove its origin composition and decrease the corresponding province
  registers by the same counts. No prisoner stock or later captor recruitment is
  introduced.
- Posture transfer and movement preserve origin unchanged.
- If control of the origin province changes, already serving troops remain with
  their current realm. The new controller can recruit only the civilians left
  after all living serving bodies from that province are deducted, regardless
  of which realm those troops currently serve.

### Opening-state derivation

Opening origin composition needs no additional world authoring.

1. Each opening garrison originates in its containing province.
2. Subtract those garrisons from each province's opening civilian capacity.
3. Allocate the opening field army across owned provinces in proportion to the
   remaining capacities.
4. Assign integer remainder in canonical province order.

This derivation is invisible to the player and exists solely to make local
availability and later casualties exact.

## 5. Deterministic batch settlement

All legal recruitment intents for one realm settle as one batch. Submission or
map-click order never changes the answer.

1. Convert each intent's commit into requested men using the sealed 1%p of force
   limit per point.
2. Group requests by origin province and prorate any province-local civilian
   shortage across that province's requests by requested men.
3. Apply posture headroom: field requests share field-force headroom; each
   garrison request applies its destination sector's local headroom.
4. Evaluate the realm-wide continuous draft bill over the aggregate surviving
   request, preserving split-order invariance of the integral price curve.
5. If treasury affordability further limits the batch, prorate the affordable
   men across surviving requests by requested men.
6. At every integer proration boundary, distribute the largest fractional
   remainders first and break exact ties by canonical sector coordinate, then by
   stable intent identity.

The bill is computed once over the fulfilled aggregate, so splitting a draft
across sectors cannot evade a mobilization-intensity knee. Per-intent bill
shares may be projected for explanation, but their rounded display never feeds
the authoritative treasury mutation.

## 6. Recruitment-turn movement and affiliation

Fulfilled field recruits form a separate not-yet-ready cohort at the muster hex.
They may traverse one normal-march route during the same resolution.

- Movement accrues the sealed per-hex march fatigue.
- Forced-march distance and its premium are unavailable.
- The cohort may end at the same hex as an existing detachment.
- When `joinDetachmentId` is present and the target reaches the declared hex,
  the recruited mass is attached as that detachment's not-yet-ready reinforcement
  component. It remains separately identifiable until readiness advances.
- At the next turn boundary an attached component becomes combat-ready and
  merges into its named host. An independent cohort becomes a ready standalone
  detachment and remains separate until the player uses the existing free merge.
- If the named target does not reach the declared destination, the join clause
  is rejected before mutation; recruitment may be resubmitted as standalone or
  with a consistent target rather than silently changing affiliation.

Garrison recruits remain in their recruiting sector as a not-yet-ready garrison
cohort. They do not contribute to defense or garrison effects during the
recruitment turn. They become ordinary garrison substance at the next turn
boundary if control survives.

The underlying state must never expose one aggregate number that visually
suggests all men can fight. Own-side projections distinguish ready and
next-turn-ready mass exactly; enemy projections obey §9.

## 7. Resolution order and capture

The relevant Runtime order is:

```text
turn-start legality
→ recruitment batch creation and payment
→ normal movement and co-location
→ combat using ready substance only
→ occupation, capture, and loss
→ information update
→ next-turn readiness transition
```

Consequences follow from that order:

- Field recruits that leave the source sector before combat survive a later
  capture of that sector, subject to ordinary route legality.
- Field recruits that remain, and garrison recruits that remain, cannot defend
  during their recruitment turn.
- If their location is captured, not-yet-ready recruits there are removed as a
  match-permanent capture loss; their origin registers fall by the same counts,
  and the MVP creates no captor-owned substance from them.
- Commit and treasury already spent are not refunded after capture.
- A failed defense cannot retroactively cancel an otherwise legal recruitment
  order.

## 8. Command economy

R19 retains the 20-point command pool and every existing denomination.

- Raising the pool to 30 while retaining 1%p per point would accelerate a 50%
  force rebuild from 2.5 all-in turns to roughly 1.7 and break the sealed tempo
  anchor.
- Redenominating every activity to preserve ratios would be a whole command-
  economy recalibration, not recruitment siting.
- The sector choice itself adds breadth-versus-concentration judgment: points
  may be stacked at one site or spread across several sites.

A future pool-size change requires L2 evidence that 20 is a real decision
bottleneck and a separate magnitude amendment. R19 creates no such automatic
follow-up.

## 9. Reconnaissance and projection

Recruitment produces an honest but incomplete information trace.

- A positive fulfilled draft causes the recruiting sector to emit or update the
  existing banded mobilization signal during the information-update beat. A
  zero-man result creates no concentration signal.
- The signal reveals concentration at sector grain, not exact recruited men,
  final destination, treasury, or hidden commit.
- Existing information confidence controls band width; field position continues
  to use last-seen position plus the reach cone.
- Newly recruited mass is excluded from all current-turn combat forecasts.
- On the next decision state, it enters the possible enemy substance space at
  its achieved position and readiness, under the existing fog projection.

This preserves the established doctrine that instruments do not invent false
signals while opponent actions may make earlier snapshots stale. Recruitment
changes the world; it does not cause a previous estimate to promise a false
current-turn combat result.

## 10. Architecture boundaries

Implementation should keep four independently testable responsibilities:

1. **Recruitment calculation:** existing price curve and aggregate
   affordability, extended to accept the batch demand and return fulfilled mass.
2. **Provincial accounting:** origin composition, local civilian derivation,
   deterministic proration, and casualty conservation. This module has no map
   rendering or Runtime turn ownership.
3. **Operational placement:** muster-hex resolution, normal-route legality,
   recruitment-turn movement, fatigue, co-location, and readiness transition.
4. **Runtime orchestration and projection:** intent validation, phase ordering,
   event emission, own exact views, and enemy banded views.

Runtime remains the sole legality and mutation authority. Preview and viewer
code consume rule-module answers and projections; they never independently
recompute hidden truth.

## 11. Verification contract

Tests remain at the pre-agreed public seams: Runtime intent-to-answer/state/
events, viewer projection, and Node/browser parity. Required cases include:

- one point and stacked points preserve the 1%p conversion;
- permutations of identical intent sets produce identical state and events;
- shortages prorate deterministically by province and across realm constraints;
- integral billing is invariant under sector splitting;
- opening origin derivation conserves every serving and civilian body;
- division, merge, transfer, movement, and casualty application conserve origin
  composition and register semantics;
- normal first-turn movement works, accrues fatigue, and rejects forced march or
  excess reach;
- recruited mass is excluded from same-turn attack and defense, then becomes
  eligible exactly at the next turn boundary;
- co-located ready and not-yet-ready mass project separately on the own side;
- source-sector capture preserves departed recruits, removes those left behind,
  reduces their origin registers, and never refunds commit or treasury;
- the source-sector mobilization signal appears without leaking exact enemy
  substance;
- Node and browser hosts emit identical result and event digests.

## 12. Publication duties after written-spec approval

This Working-layer spec is not itself the authoritative seal. Publication must
land as one documentation batch before implementation claims the rule:

1. Add the recruitment-siting and readiness ruling at recruitment's Production
   birthplace (`docs/features/match-arc/RULINGS.md`) and amend its glossary row
   by pointer rather than duplicating history.
2. Add a cross-feature ADR because recruitment, provincial accounting,
   movement, garrison posture, fog, and turn resolution all consume the model.
3. Amend the Tier-0 `Land-derived state` MVP boundary in `DOMAIN_MAP.md`, which
   currently says muster geography is abstracted.
4. Stamp any older ADR whose isolated reading is changed by the new ruling.
5. Refresh touched feature indexes, the glossary quick reference, the term
   inventory if term status changes, and the sync-debt ledger.
6. Run the documentation audit before closing the publication batch.

## 13. Rejected alternatives

- **Immediate combat eligibility:** rejected because it permits unobserved
  same-turn recruitment to decide combat before reconnaissance can inform a new
  choice, and enables instant wall refill.
- **No movement until next turn:** rejected because it makes sector siting feel
  inert and adds a second full delay beyond readiness.
- **Immediate merge into one combat scalar:** rejected because it hides why part
  of a displayed formation cannot fight.
- **Post-combat success and refunds:** rejected because opponent action would
  retroactively cancel a legal order and contradict first-turn movement.
- **Click-order or fixed-sector priority:** rejected because presentation order
  would become an undisclosed simulation rule.
- **Recruitment decrementing the register:** rejected because it contradicts the
  sealed total-bodies accounting in which only death shrinks the register.
- **Authored opening origins:** rejected as unnecessary world-authoring burden;
  the deterministic derivation in §4 is sufficient.
- **Thirty-point pool in R19:** rejected because it either breaks recruitment
  tempo or requires global redenomination without evidence.
