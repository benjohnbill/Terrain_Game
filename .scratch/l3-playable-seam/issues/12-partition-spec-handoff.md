# Partition the Implementation-Ready Spec Handoff

Type: grilling
Status: open
Blocked by: 06, 07, 08, 09, 10, 11

## Question

How should the resolved architecture, Fog presentation, authored-world input,
vertical slice, migration ladder, verification gates, and cutover policy be
partitioned into the smallest coherent feature specs so implementation tickets
can cite one authoritative home without duplication or cross-spec drift?

## Comments

- A Working-layer umbrella synthesis now exists at `../spec.md`. It is an input
  to this decision, not the Production partition and not a second definition
  point. This ticket runs after the open gates and the planned documentation /
  terminology audit, then decides the final `docs/features/` routing.

## Decision constraints

- Production files must define each requirement in one birthplace. Integration
  specs point to Fog, terrain, war, and match definitions; they do not restate
  those mechanics (`.claude/rules/documentation-law.md`).
- A ticket stays Working-layer and cannot become `ready-for-agent` until it
  cites the final Production home that closes every specification gate.
- Cross-feature architecture decisions that meet the ADR threshold must promote
  with the supersession/amendment protocol in the same doc-sync batch.
- `docs/SYNC-DEBT.md:14-42` reserves three riders for this gate: decide ADR
  promotion for the resolved Wayfinder architecture; if an ADR is minted, stamp
  ADR 0039 and correct `DESIGN.md:43` from returned authoritative state to
  viewer-safe projection; absorb the recurring principle that caller discipline
  is not a structural guarantee into that ADR rather than creating a separate
  root principle.
- This gate follows, rather than replaces, the Fog live prototype and the exact
  authored-world/verification/cutover decisions.

## Material to partition

| Decision family | Natural authoritative home |
|---|---|
| Viewer knowledge categories and Standard Fog behavior | existing `docs/features/fog-of-war-discovery/` |
| Authored world artifact, identity, schema, and admission checks | existing `docs/features/terrain-cradle/` |
| R14-safe operation and war/match behavior eligible for L3 | existing `docs/features/war-model-build/` plus existing match birthplaces |
| End-to-end Runtime/UI seam, playable journey, build/test gates, and cutover requirements | a new integration feature home if approved |
| Runtime authority, projection boundary, preview placement, durable representation | ADR candidate amending ADR 0039 |
| Parallel-strangler build/cutover topology | separate ADR candidate if the final gate 05/11 choices meet the architecture threshold |

## Evidence-based option space

### A. One integration feature plus amendments at existing birthplaces

Create `docs/features/l3-playable-seam/` as the front door for the cross-feature
playable journey and its acceptance/cutover requirements. Add only the missing
knowledge contract to Fog, authored-input contract to terrain-cradle, and exact
eligible behavior/prerequisites to war-model-build. The integration feature
points to them.

- **Strength:** gives every implementation ticket one integration front door
  while preserving mechanic definitions at established birthplaces.
- **Cost:** requires careful pointers so the integration requirements do not
  copy Fog or war-model definitions.

### B. Put the entire umbrella spec in one new feature

- **Strength:** one document to read.
- **Cost:** creates second definitions of information confidence, authored map,
  combat, war ending, and match ending, violating the single-definition rule.

### C. Distribute everything among existing features with no integration home

- **Strength:** no new feature directory.
- **Cost:** no authoritative home owns the command cycle from authored world to
  complete human match, so every implementation ticket must assemble a different
  cross-document contract.

## Recommended Production shape

Choose A:

1. `docs/features/l3-playable-seam/INDEX.md` — status, scope, pointers, open
   questions only.
2. `docs/features/l3-playable-seam/REQUIREMENTS.md` — Runtime caller contract by
   ADR pointer, end-to-end journey, vertical-slice ladder, verification matrix,
   build/cutover obligations, and explicit exclusions. It references rather than
   defines Fog/terrain/war values.
3. `docs/features/l3-playable-seam/RULINGS.md` — user decision history for gates
   whose rationale is feature-local.
4. A focused model/contract document in `fog-of-war-discovery/` for the accepted
   viewer-knowledge matrix and presentation contract, plus its ruling history.
5. A focused authored-world contract in `terrain-cradle/` for identity, artifact
   shape, load validation, and offline admission, plus its ruling history.
6. Amend `war-model-build/REQUIREMENTS.md` only with the named L3-eligible
   operation/prerequisites; keep combat and match arithmetic at their existing
   birthplaces.

## ADR and doc-sync recommendation

- Promote Runtime private authority, viewer projection as the single blur seam,
  pure external preview, ordinary-caller bots, intent-log durability, and the
  no-snapshot/subscription v1 boundary into one ADR that amends ADR 0039. Put the
  structural-guarantee principle in its rationale.
- Evaluate the final parallel-strangler/build/cutover package as a second ADR
  rather than overloading the Runtime ADR; mint it only if gates 05 and 11 leave
  a durable architecture decision beyond this feature.
- In the same batch, stamp every amended ADR, correct the stale `DESIGN.md`
  returned-state sentence, update ADR README, pay the corresponding
  `docs/SYNC-DEBT.md` row, refresh touched feature indexes, run the promotion
  scan, and execute `npm run lint:docs`.

## Ticket publication handoff

After the Production batch passes audit, update each
`.scratch/l3-playable-build/issues/*.md` file to:

- replace `Specification gates:` with exact Production/ADR pointers;
- retain its linear implementation blocker;
- set `Status: ready-for-agent` only when every cited prerequisite exists and
  no unresolved design choice remains;
- keep any ticket with an unbuilt R14-safe prerequisite at `needs-info` and name
  that prerequisite rather than approximating it;
- verify that each ticket remains one demoable vertical increment and does not
  redefine its referenced mechanics.

The honest cost is several small authoritative homes instead of one omnibus
spec. That cost prevents cross-feature drift and makes an independent
implementation session mechanically discoverable. This recommendation does
not resolve the gate; the user must approve the partition and ADR promotion
set after gates 03 and 05–11 close.
