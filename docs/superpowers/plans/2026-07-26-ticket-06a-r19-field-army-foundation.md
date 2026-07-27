# Ticket 06a + R19 Field-Army Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the positionless field-army scalar with deterministic positioned detachments and make sector-sited recruitment compose with movement, origin accounting, and one-turn combat readiness without implementing combat or capture.

**Architecture:** Pure domain modules own movement/pathing, force conservation, and batch recruitment; `Runtime` remains the only legality and mutation authority, while `project` remains the only truth-to-view seam. The state carries province-origin composition internally, exposes only own-side operational totals, and records pending recruits separately until their next-turn activation. Ticket 06c consumes the ready-substance/origin-loss interfaces for combat, and ticket 06d consumes the pending-capture/register-transfer interfaces; neither consequence engine is built here.

**Tech Stack:** TypeScript 5.9, Node emitted-artifact tests, React 18 grey-box viewer, Vite 6, Playwright 1.62, checked-in Markdown authority chain.

## Global Constraints

- The command pool remains exactly **20 points**; one recruitment point remains exactly **+1%p of force limit**.
- Normal march speed is exactly **3 cost units per turn**; forced march adds at most **2** units, and each extra hex accrues fatigue at exactly **3.0×** the normal **1.0 per-hex** rate.
- Terrain movement cost remains uniformly **1.0**; do not introduce terrain-specific prices before world revision `r2`.
- A march consumes turns and fatigue and consumes **zero commitment points**.
- The movement graph is authored hex adjacency union every authored edge; non-contact edge endpoints use the nearest hex pair at cost 1 with canonical coordinate ties.
- Recruitment legality reads the turn-start owner, settles all requests as one deterministic batch, bills the Surge Draft integral once, and never gives click order priority.
- Recruitment leaves the total-bodies register unchanged; only a permanent loss may shrink a province-origin register share.
- New recruits may normal-march and affiliate in the recruitment turn, may not forced-march, and are unavailable to that turn's combat; they activate for the following turn's resolution.
- Runtime's public surface remains exactly `currentActor`, `view(viewerId)`, and `submit(intent)`; no snapshot, subscription, or truth escape is added.
- Preview, UI, renderer, and bot code consume `MatchView` or exported pure rule answers only; none reads `MatchState`.
- Tests exercise emitted artifacts through Runtime intents, projected views/events, and the Node/browser replay; no source-only test lane is added.
- Do not import from `js/`, `tests/`, or `mockup/`; those trees remain reference evidence under ADR 0041.
- Do not implement battle casualties, sector capture, integration, conquest damage, interception, morale, fog-band constants, or garrison-to-field transfer in this ticket.
- `choke.cap === Infinity` must remain native; never JSON-round-trip the world artifact.

---

## File Structure

### Create

- `docs/adr/0045-sited-recruitment-readiness-and-origin-accounting.md` — cross-feature decision record for R19 plus the two 06a topology completions.
- `game/src/domain/force.ts` — origin composition, ready/pending cohorts, detachment identity, split/merge conservation, and own-force aggregate readers.
- `game/src/domain/movement.ts` — movement graph construction, muster hexes, canonical Dijkstra routes, turn advancement, reach cone, and front endpoint tests.
- `game/tests/field-army.test.js` — emitted-Runtime acceptance coverage for opening placement, movement, commitment reachability, split/merge, and replay.
- `game/tests/recruitment-siting.test.js` — emitted-Runtime acceptance coverage for batch siting, origin availability, readiness, affiliation, and mobilization signal projection.

### Modify

- `docs/features/match-arc/RULINGS.md` — append the R19 recruitment/readiness/accounting seal.
- `docs/features/match-arc/GLOSSARY.md` — amend the existing Recruitment, Conscription register, and Field army rows by ruling pointer.
- `docs/features/match-arc/INDEX.md` — surface the new live seal and remove R19 from open work.
- `docs/features/war-model-build/RULINGS.md` — append the opening-muster/authored-edge topology completion.
- `docs/features/war-model-build/INDEX.md` — report the 06a topology seal and build status.
- `docs/features/combat-formula/MAGNITUDE.md` — add the R18 rider that opening `f₀`/`g₀` are setup coordinates, not a standing posture constraint; do not duplicate values.
- `docs/adr/0014-local-garrison-sustainment.md` — stamp the retirement of automatic free garrison regeneration.
- `docs/adr/0043-operational-layer-movement-position-and-reachability.md` — stamp ADR 0045's topology completion.
- `docs/adr/0044-conquest-integrates-on-the-ripening-lag.md` — stamp the replacement of proportional scalar-register succession with remaining-civilian transfer while serving origins stay with their forces.
- `docs/adr/README.md` — register ADR 0045 and amendment relationships.
- `DOMAIN_MAP.md` — replace the muster-abstraction reserved seat with a short summary and birthplace pointers; correct the stale standing-world-rule garrison statement.
- `docs/GLOSSARY-QUICKREF.md` — regenerate the same-session digest with the R19 seals.
- `docs/SYNC-DEBT.md` — mark R19 and the paid R18 stamps as paid while preserving unrelated debts.
- `docs/audits/term-inventory.json` — refresh the existing Field army, Recruitment, and Conscription register index rows and regeneration date; add no duplicate terms.
- `.scratch/l3-playable-build/DECISIONS-OWED.md` — replace §1.10's conflict with the user-approved R19 resolution and publication pointers.
- `.scratch/l3-playable-build/issues/06a-move-the-field-army.md` — clear `needs-info`, then record acceptance evidence at ticket close.
- `.scratch/l3-playable-build/README.md` — recompute 06a readiness/status after publication and after implementation.
- `game/src/domain/state.ts` — replace scalar field/register/garrison storage with origin-aware formations and add movement/recruitment plans and signal state.
- `game/src/world/schema.ts` — define the reusable axial `HexPosition` value type without changing the authored artifact schema.
- `game/src/world/index.ts` — re-export `HexPosition` with the existing world types.
- `game/src/domain/recruitment.ts` — retain price-curve arithmetic and add deterministic multi-site batch fulfillment.
- `game/src/domain/commitment.ts` — admit dynamic recruitment allocation keys without weakening the shared 20-point budget.
- `game/src/domain/turn.ts` — carry selected detachment IDs into revealed front readings without resolving combat.
- `game/src/runtime/types.ts` — add public intent/view contracts and selected-detachment assignments.
- `game/src/runtime/runtime.ts` — seed, validate, resolve, and event the new operational/recruitment states in the sealed order.
- `game/src/runtime/index.ts` — append new exports without reordering existing exports.
- `game/src/projection/project.ts` — project own exact force/readiness/accounting and enemy source-only mobilization signals.
- `game/src/preview/preview.ts` — preview movement, split/merge, selected-front reachability, and the whole candidate recruitment batch from `MatchView` only.
- `game/src/renderer/index.ts` — include own detachment summaries in the text renderer.
- `game/src/ui/App.tsx` — add grey-box detachment and sector-sited recruitment controls.
- `game/src/ui/MapBoard.tsx` — render own detachment positions and destinations from projection data.
- `game/src/ui/styles.css` — add legibility-only detachment marker styles.
- `game/tests/realm-economy.test.js` — migrate ticket-05 scalar recruitment assertions to the sited recruitment contract.
- `game/tests/turn-loop.test.js` — replace the retired no-move assertion and pass explicit detachment selections where front substance is claimed.
- `game/tests/browser/boot.spec.js` — exercise the new emitted intents in a browser.
- `game/tests/browser/viewer.spec.js` — exercise human-visible position, destination, readiness, and sited recruitment.
- `game/acceptance/harness.html` — let replay choose the same actor-safe projection in both hosts.
- `game/acceptance/replay.js` — put movement and sited recruitment in the canonical replay and include their projected results in `turnSummary`.

---

### Task 1: Publish the R19 and 06a Topology Authority Batch

**Files:**
- Create: `docs/adr/0045-sited-recruitment-readiness-and-origin-accounting.md`
- Modify: the documentation and tracker files listed in the File Structure section through `.scratch/l3-playable-build/README.md`
- Test: `scripts/sync-docs-law.js`, `scripts/audit-lint.js`

**Interfaces:**
- Consumes: user-approved design `docs/superpowers/specs/2026-07-26-recruitment-siting-readiness-design.md`; ADR 0043; ADR 0044; match-arc MT-②/③/④; WB-M①/②.
- Produces: authoritative ruling `MT-⑥`, topology ruling `WM-④`, and ADR 0045, which every code task cites.

- [ ] **Step 1: Append the two Production rulings and pointer-only glossary amendments**

Append a ruling with this seal shape to match-arc:

```markdown
## MT-⑥ — Sited Recruitment, Origin Accounting, and One-Turn Readiness — SEALED 2026-07-26 · L0

**Verdict source:** user-approved R19 design, 2026-07-26, recorded in
`docs/superpowers/specs/2026-07-26-recruitment-siting-readiness-design.md`.

Recruitment names a controlled front sector, commit amount, field/garrison
posture, optional one-normal-march destination, and optional destination
detachment. Requests settle simultaneously as one integral-priced batch. Serving
bodies retain province origin; the persistent register remains total living
bodies by province, recruitment changes civilian to serving, and permanent loss
alone shrinks it. Recruits may normal-march and affiliate in the raising turn but
cannot attack or defend until the following turn's resolution. The command pool
remains 20 and one point remains +1%p of force limit.

Full decision, ordering, rejected alternatives, and implementation contract:
ADR 0045. Owning values remain in combat-formula M13 and war-model-build
WB-M①/WB-M②.
```

Append `WM-④` to war-model-build with the two topology rules: capital-sector centre-nearest opening placement, and natural-contact-or-nearest-pair authored-edge expansion. Amend the three existing match-arc glossary rows only by concise current behavior plus `History: ... MT-⑥`; do not paste the ruling history into a definition row.

- [ ] **Step 2: Write ADR 0045 and stamp every changed old record**

The ADR must explicitly carry these relationships:

```markdown
- **Amends ADR 0043:** completes opening placement and sector-edge expansion to hex endpoints.
- **Amends ADR 0044 item 4:** land transfer moves remaining civilians; already-serving origin composition stays with its force, and permanent losses reduce the same origin register share.
- **Amends ADR 0014:** garrison replenishment is paid recruitment or physical transfer, never a free automatic pulse.
- **Amends DOMAIN_MAP `Land-derived state`:** sector-sited muster is now the MVP contract rather than a reserved extension point.
```

Stamp the old ADR headers in the same batch. Do not silently edit their accepted Decision sections; add one-line amendment deltas in their headers.

- [ ] **Step 3: Pay projection, index, quick-reference, audit-index, and tracker duties**

Change the `DOMAIN_MAP.md` muster sentence to a qualitative summary pointing to match-arc MT-⑥ and ADR 0045. Mark the R19 sync-debt row paid, refresh both feature indexes, update the three existing term-inventory rows' `codeRefs` to the canonical `game/src/domain/force.ts` / `game/src/domain/recruitment.ts` homes, and set the inventory/quick-reference regeneration date to `2026-07-26`. Set 06a to `ready-for-agent` after the seal chain is complete; do not mark it landed.

- [ ] **Step 4: Run the documentation audit**

Run: `npm run lint:docs`

Expected: exit 0, **0 blocking**, and the same **7 known advisory** findings unless this batch legitimately removes one.

- [ ] **Step 5: Commit the authority batch**

```bash
git add docs/adr docs/features/match-arc docs/features/war-model-build docs/features/combat-formula/MAGNITUDE.md DOMAIN_MAP.md docs/GLOSSARY-QUICKREF.md docs/SYNC-DEBT.md docs/audits/term-inventory.json .scratch/l3-playable-build
git commit -m "docs(r19): seal sited recruitment and readiness"
```

### Task 2: Introduce Origin-Aware Force State and Opening Placement

**Files:**
- Create: `game/src/domain/force.ts`
- Create: `game/tests/field-army.test.js`
- Modify: `game/src/domain/state.ts`
- Modify: `game/src/world/schema.ts`
- Modify: `game/src/world/index.ts`
- Modify: `game/src/runtime/types.ts`
- Modify: `game/src/runtime/runtime.ts`
- Modify: `game/src/projection/project.ts`
- Modify: `game/src/runtime/index.ts`

**Interfaces:**
- Consumes: `forceLimitOf`, `registerOf`, `GARRISON_PER_BORDER_SECTOR`, chosen capitals, `Sector.regionId`.
- Produces: `OriginComposition`, `ForceCohort`, `PendingCohort`, `Detachment`, `GarrisonForce`, `fieldOf`, `servingByOrigin`, `availableCiviliansByOrigin`, `DetachmentView`, and stable detachment IDs.

- [ ] **Step 1: Write the failing opening-placement and conservation tests**

Add this public-seam shape to `game/tests/field-army.test.js`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';

const { CRADLE_R1, Runtime } = await import('../dist/runtime/index.js');

function openAtDecision(seed = 'field-army-0001', world = CRADLE_R1) {
  const runtime = Runtime.open({ world, seed, actors: ['realm-a', 'realm-b'] });
  const setup = runtime.view('observer');
  runtime.submit({ kind: 'choose-capital', actor: 'realm-a', sector: 'r2_s0' });
  runtime.submit({ kind: 'choose-capital', actor: 'realm-b', sector: 'r10_s0' });
  return runtime;
}

test('the opening field army is one positioned detachment at the capital-sector centre-nearest hex', () => {
  const runtime = openAtDecision();
  const mine = runtime.view('realm-a');
  assert.equal(mine.detachments.length, 1);
  assert.deepEqual(mine.detachments[0].position, { q: 9, r: 5 });
  assert.equal(mine.detachments[0].men, mine.economy.field);
  assert.equal(mine.detachments[0].pendingMen, 0);
});

test('opening province registers equal serving plus available civilians', () => {
  const economy = openAtDecision().view('realm-a').economy;
  for (const row of Object.values(economy.provinces)) {
    assert.equal(row.register, row.serving + row.availableCivilians);
  }
  assert.equal(
    Object.values(economy.provinces).reduce((sum, row) => sum + row.register, 0),
    economy.register,
  );
});
```

- [ ] **Step 2: Run the emitted Node test and verify the contract is absent**

Run: `npm run build:runtime:game && node --test game/tests/field-army.test.js`

Expected: FAIL because `MatchView.detachments` and `EconomyView.provinces` do not exist.

- [ ] **Step 3: Add the force types and exact conservation readers**

Use these exact internal shapes in `game/src/domain/force.ts`:

```ts
export type OriginComposition = Readonly<Record<RegionId, number>>;

export interface ForceCohort {
  readonly origins: OriginComposition;
  readonly fatigue: number;
}

export interface PendingCohort extends ForceCohort {
  readonly readyOnTurn: number;
  readonly sourceSector: SectorId;
}

export interface MovementOrder {
  readonly destination: HexPosition;
  readonly route: readonly HexPosition[];
  readonly forcedMarch: boolean;
}

export interface Detachment {
  readonly id: string;
  position: HexPosition;
  ready: ForceCohort;
  pending: PendingCohort[];
  movement: MovementOrder | null;
}

export interface GarrisonForce {
  ready: OriginComposition;
  pending: PendingCohort[];
}

export const menOf = (origins: OriginComposition): number =>
  Object.values(origins).reduce((sum, men) => sum + men, 0);

export function splitDetachment(
  source: Detachment, men: number, childId: string,
): readonly [Detachment, Detachment];
export function mergeDetachments(
  sources: readonly Detachment[], mergedId: string,
): Detachment;
export function combatEligibleMen(detachment: Detachment, turn: number): number;
export function activateReadyCohorts(detachment: Detachment, turn: number): Detachment;
```

Change `RealmForces` to:

```ts
export interface RealmForces {
  treasury: number;
  registers: Record<RegionId, number>;
  openingField: ForceCohort | null;
  detachments: Detachment[];
  nextDetachmentOrdinal: number;
}
```

`openingField` is setup-only: create its origin composition after seeding local garrisons, then consume it for both realms only when both capital choices reveal. No mobile detachment may have a null position. Stable IDs use `detachment:${actor}:${ordinal}` and increment `nextDetachmentOrdinal`; they never depend on object iteration order.

Seed each opening garrison entirely from its sector's `regionId`. For the opening field cohort, compute `remaining[region] = registers[region] - openingGarrisonOrigins[region]`, prorate the sealed opening field total across those remaining weights, distribute integer remainders by `RegionId`, and assert the allocations sum exactly to the field total. `RealmForces.registers` is the actor-held living-register share by province origin: summing that origin across actors is the match's living register, while subtracting that actor's serving origins yields the civilians that actor may still recruit. This representation lets 06d move civilians without switching already-serving troops.

- [ ] **Step 4: Replace scalar projections with own exact operational views**

Add `HexPosition` beside `MapUnit` in `world/schema.ts`, then re-export it through the Runtime barrel with these caller-facing types:

```ts
export interface HexPosition { readonly q: number; readonly r: number }

export interface DetachmentView {
  readonly id: string;
  readonly position: HexPosition;
  readonly destination: HexPosition | null;
  readonly turnEndpoint: HexPosition;
  readonly turnsRemaining: number;
  readonly men: number;
  readonly readyMen: number;
  readonly pendingMen: number;
  readonly pendingReadyOnTurn: number | null;
  readonly fatigue: number;
  readonly pendingFatigue: number | null;
}

export interface GarrisonView {
  readonly sectorId: SectorId;
  readonly men: number;
  readonly readyMen: number;
  readonly pendingMen: number;
  readonly pendingReadyOnTurn: number | null;
}

export interface ProvinceForcesView {
  readonly register: number;
  readonly serving: number;
  readonly availableCivilians: number;
}
```

Keep `EconomyView.field`, `garrison`, `register`, `serving`, and `mobilization` as derived totals for ticket-05/UI compatibility; add `provinces: Readonly<Record<RegionId, ProvinceForcesView>>`. Add `MatchView.detachments` and `MatchView.garrisons` as own-side-only arrays; the observer and opponent never receive exact force objects.

- [ ] **Step 5: Run typecheck and the focused test**

Run: `npm run typecheck:game && npm run build:runtime:game && node --test game/tests/field-army.test.js`

Expected: PASS for both opening tests and no TypeScript errors.

- [ ] **Step 6: Commit the origin-aware opening state**

```bash
git add game/src/domain/force.ts game/src/domain/state.ts game/src/world/schema.ts game/src/world/index.ts game/src/runtime/types.ts game/src/runtime/runtime.ts game/src/projection/project.ts game/src/runtime/index.ts game/tests/field-army.test.js
git commit -m "feat(game): position opening field detachments"
```

### Task 3: Build the Canonical Movement Graph and Destination Orders

**Files:**
- Create: `game/src/domain/movement.ts`
- Modify: `game/src/domain/state.ts`
- Modify: `game/src/runtime/types.ts`
- Modify: `game/src/runtime/runtime.ts`
- Modify: `game/src/projection/project.ts`
- Modify: `game/src/preview/preview.ts`
- Modify: `game/src/runtime/index.ts`
- Test: `game/tests/field-army.test.js`

**Interfaces:**
- Consumes: `WorldArtifact`, `HEX_NEIGHBOURS`, `hexKey`, `Detachment`, WB-M①/WB-M② values.
- Produces: `MovementGraph`, `buildMovementGraph(world)`, `musterHexOf(world, sectorId)`, `minimumCostRoute(graph, from, to)`, `advanceOneTurn(graph, detachment)`, `reachCone(graph, start, turns, speed)`, and `MoveDetachmentIntent`.

- [ ] **Step 1: Add failing Runtime tests for normal march, forced march, redirect, and r10 reachability**

Append tests using these exact intents:

```js
const lock = (runtime, actor) => runtime.submit({ kind: 'lock-commitment', actor });
const closeTurn = (runtime) => [...lock(runtime, 'realm-a'), ...lock(runtime, 'realm-b')];

test('a destination order moves three cost units, accrues per-hex fatigue, and spends no commitment', () => {
  const runtime = openAtDecision();
  const id = runtime.view('realm-a').detachments[0].id;
  const accepted = runtime.submit({
    kind: 'move-detachment', actor: 'realm-a', detachmentId: id,
    destinationHex: { q: 9, r: 9 }, forcedMarch: false,
  });
  assert.equal(accepted[0].type, 'movement-planned');
  assert.equal(runtime.view('realm-a').commitment.spent, 0);
  assert.equal(runtime.view('realm-a').detachments[0].turnsRemaining, 2);
  closeTurn(runtime);
  const moved = runtime.view('realm-a').detachments[0];
  assert.equal(moved.position.q === 9 && moved.position.r === 9, false);
  assert.equal(moved.fatigue, 3);
  assert.equal(moved.turnsRemaining, 1);
});

test('forced march reaches two extra hexes and prices only the extra segment at the premium', () => {
  const runtime = openAtDecision();
  const id = runtime.view('realm-a').detachments[0].id;
  runtime.submit({
    kind: 'move-detachment', actor: 'realm-a', detachmentId: id,
    destinationHex: { q: 9, r: 9 }, forcedMarch: true,
  });
  closeTurn(runtime);
  const moved = runtime.view('realm-a').detachments[0];
  assert.deepEqual(moved.position, { q: 9, r: 9 });
  assert.equal(moved.fatigue, 6);
});

test('the authored strait makes r10 reachable and redirect starts at the current hex', () => {
  const runtime = openAtDecision();
  const id = runtime.view('realm-b').detachments[0].id;
  assert.equal(runtime.submit({
    kind: 'move-detachment', actor: 'realm-b', detachmentId: id,
    destinationHex: { q: 13, r: 15 }, forcedMarch: false,
  })[0].type, 'movement-planned');
  closeTurn(runtime);
  const current = runtime.view('realm-b').detachments[0].position;
  assert.equal(runtime.submit({
    kind: 'move-detachment', actor: 'realm-b', detachmentId: id,
    destinationHex: { q: 20, r: 14 }, forcedMarch: false,
  })[0].type, 'movement-planned');
  assert.notDeepEqual(runtime.view('realm-b').detachments[0].position, { q: 20, r: 14 });
  assert.deepEqual(runtime.view('realm-b').detachments[0].position, current);
});

test('a destination outside the authored movement graph is rejected without mutation', () => {
  const runtime = openAtDecision();
  const before = runtime.view('realm-a');
  const id = before.detachments[0].id;
  const events = runtime.submit({
    kind: 'move-detachment', actor: 'realm-a', detachmentId: id,
    destinationHex: { q: 999, r: 999 }, forcedMarch: false,
  });
  assert.equal(events[0].type, 'intent-rejected');
  assert.deepEqual(runtime.view('realm-a'), before);
});
```

- [ ] **Step 2: Run the focused test and observe unwired intents**

Run: `npm run build:runtime:game && node --test game/tests/field-army.test.js`

Expected: FAIL with `No resolution is wired for intent kind "move-detachment" yet.`

- [ ] **Step 3: Implement graph construction and canonical route selection**

Use these constants and signatures:

```ts
export const MARCH_SPEED = 3;
export const FORCED_MARCH_EXTRA_CAP = 2;
export const MARCH_FATIGUE_PER_HEX = 1;
export const FORCED_MARCH_PREMIUM = 3;

export interface MovementArc { readonly to: string; readonly cost: number }
export interface MovementNode {
  readonly position: HexPosition;
  readonly sectorId: SectorId;
  readonly arcs: readonly MovementArc[];
}
export interface MovementGraph { readonly nodes: Readonly<Record<string, MovementNode>> }

export function terrainMovementCost(_layer: TerrainLayer): number { return 1; }
export function buildMovementGraph(world: WorldArtifact): MovementGraph;
export function musterHexOf(world: WorldArtifact, sectorId: SectorId): HexPosition;
export function minimumCostRoute(
  graph: MovementGraph, from: HexPosition, to: HexPosition,
): readonly HexPosition[] | null;
export function advanceOneTurn(
  graph: MovementGraph, detachment: Detachment,
): { readonly detachment: Detachment; readonly travelled: number; readonly fatigueAdded: number };
export function reachCone(
  graph: MovementGraph, start: HexPosition, turns: number, speed = MARCH_SPEED,
): ReadonlySet<string>;
```

Build all natural six-neighbour arcs first. For each authored sector edge, keep natural cross-sector contact when at least one endpoint pair has axial distance 1; otherwise add one bidirectional cost-1 arc between the pair minimizing axial distance, then `q`, then `r` on side A, then `q`, then `r` on side B. Dijkstra's queue ordering is `(totalCost, q, r)` and equal-cost predecessor replacement uses the lexicographically smaller full path key, so route output is independent of insertion order.

`musterHexOf` computes the existing rendered sector centroid using pointy-top axial centers and selects the nearest member hex by squared screen distance, breaking ties by `q` then `r`. Put the coordinate math in `movement.ts`; do not import a renderer into domain code.

- [ ] **Step 4: Wire movement planning and turn advancement**

Add this intent:

```ts
export interface MoveDetachmentIntent {
  readonly kind: 'move-detachment';
  readonly actor: ActorId;
  readonly detachmentId: string;
  readonly destinationHex: HexPosition;
  readonly forcedMarch: boolean;
}
```

`submit` validates actor ownership, authored destination, and route existence, then replaces the detachment's `movement` order without moving it. During resolution, `advanceOneTurn` consumes complete route arcs while cumulative cost stays within 3 or 5, adds fatigue `1` for each of the first three traversed cost-1 arcs and `3` for each extra arc, updates `position`, and leaves the untraversed suffix as the order. Redirect recomputes from current `position`; it never subtracts fatigue.

Preview calls the same exported refusal function from projected own detachment data. It may report route cost/turns, but Runtime remains the accepting authority.

- [ ] **Step 5: Run the movement tests and typecheck**

Run: `npm run typecheck:game && npm run build:runtime:game && node --test game/tests/field-army.test.js`

Expected: PASS, including the r10 strait case and zero commitment spend.

- [ ] **Step 6: Commit movement**

```bash
git add game/src/domain/movement.ts game/src/domain/state.ts game/src/runtime/types.ts game/src/runtime/runtime.ts game/src/projection/project.ts game/src/preview/preview.ts game/src/runtime/index.ts game/tests/field-army.test.js
git commit -m "feat(game): add deterministic field-army movement"
```

### Task 4: Add Explicit Front Assignments, Free Split, and Free Merge

**Files:**
- Modify: `game/src/domain/force.ts`
- Modify: `game/src/domain/commitment.ts`
- Modify: `game/src/domain/state.ts`
- Modify: `game/src/domain/turn.ts`
- Modify: `game/src/runtime/types.ts`
- Modify: `game/src/runtime/runtime.ts`
- Modify: `game/src/projection/project.ts`
- Modify: `game/src/preview/preview.ts`
- Modify: `game/src/runtime/index.ts`
- Test: `game/tests/field-army.test.js`
- Test: `game/tests/turn-loop.test.js`

**Interfaces:**
- Consumes: `reachCone`, planned turn endpoints, detachment origin composition, the existing shared commitment allocator.
- Produces: `splitDetachment`, `mergeDetachments`, `SplitDetachmentIntent`, `MergeDetachmentsIntent`, and `CommitmentView.assignments`.

- [ ] **Step 1: Replace the retired no-move assertion and add failing conservation/reachability tests**

Add these cases:

```js
test('front commitment names the arriving detachment and rejects one outside this-turn reach', () => {
  const runtime = openAtDecision();
  const id = runtime.view('realm-a').detachments[0].id;
  const front = 'r1_s0|r2_s3';
  assert.equal(runtime.submit({
    kind: 'allocate-commitment', actor: 'realm-a', front, chips: 4,
    detachmentIds: [id],
  })[0].type, 'intent-rejected');
  runtime.submit({
    kind: 'move-detachment', actor: 'realm-a', detachmentId: id,
    destinationHex: { q: 9, r: 9 }, forcedMarch: true,
  });
  assert.equal(runtime.submit({
    kind: 'allocate-commitment', actor: 'realm-a', front, chips: 4,
    detachmentIds: [id],
  })[0].type, 'commitment-allocated');
  assert.deepEqual(runtime.view('realm-a').commitment.assignments[front], [id]);
});

test('split and merge preserve every man and cannot launder fatigue', () => {
  const runtime = openAtDecision();
  const before = runtime.view('realm-a').detachments[0];
  const split = runtime.submit({
    kind: 'split-detachment', actor: 'realm-a', detachmentId: before.id, men: 1234,
  });
  assert.equal(split[0].type, 'detachment-split');
  const divided = runtime.view('realm-a').detachments;
  assert.equal(divided.reduce((sum, d) => sum + d.men, 0), before.men);
  assert.deepEqual(new Set(divided.map((d) => d.fatigue)), new Set([before.fatigue]));
  const child = divided.find((d) => d.id !== before.id);
  runtime.submit({
    kind: 'move-detachment', actor: 'realm-a', detachmentId: child.id,
    destinationHex: { q: 9, r: 6 }, forcedMarch: false,
  });
  closeTurn(runtime);
  runtime.submit({
    kind: 'move-detachment', actor: 'realm-a', detachmentId: child.id,
    destinationHex: { q: 9, r: 5 }, forcedMarch: false,
  });
  closeTurn(runtime);
  const beforeMerge = runtime.view('realm-a').detachments;
  const expectedFatigue = beforeMerge.reduce((sum, d) => sum + d.fatigue * d.men, 0) / before.men;
  const merged = runtime.submit({
    kind: 'merge-detachments', actor: 'realm-a',
    detachmentIds: beforeMerge.map((d) => d.id),
  });
  assert.equal(merged[0].type, 'detachments-merged');
  assert.equal(runtime.view('realm-a').detachments[0].men, before.men);
  assert.ok(Math.abs(runtime.view('realm-a').detachments[0].fatigue - expectedFatigue) < 1e-12);
});
```

Update existing front allocations in `turn-loop.test.js` to pass `detachmentIds: []` when they intentionally exercise garrison-only chip behavior. Delete the assertion that standalone movement must be rejected; replace it with an assertion that movement changes no allocation and emits no ownership change.

- [ ] **Step 2: Run focused tests and verify missing assignment/split contracts**

Run: `npm run build:runtime:game && node --test game/tests/field-army.test.js game/tests/turn-loop.test.js`

Expected: FAIL because split/merge intents and commitment assignments are absent.

- [ ] **Step 3: Implement deterministic split/merge conservation**

Use these intent shapes:

```ts
export interface SplitDetachmentIntent {
  readonly kind: 'split-detachment';
  readonly actor: ActorId;
  readonly detachmentId: string;
  readonly men: number;
}

export interface MergeDetachmentsIntent {
  readonly kind: 'merge-detachments';
  readonly actor: ActorId;
  readonly detachmentIds: readonly string[];
}
```

`men` is a positive whole number below total detachment men. Split top-level ready/pending cohorts proportionally by total men using largest remainder; inside every cohort split province origins by the same method with `RegionId` tie order. Both children inherit current position, ready fatigue, pending fatigue/readiness, and the current movement order. Merge requires at least two unique same-actor detachments at the same current hex, sums origins, combines ready fatigue as `Σ(fatigue × men) ÷ Σmen`, concatenates pending cohorts, and clears the merged movement order so the player can issue one unambiguous free redirect.

- [ ] **Step 4: Carry explicit detachment assignments with front allocations**

Amend the existing interface rather than creating a second commitment economy:

```ts
export interface AllocateCommitmentIntent {
  readonly kind: 'allocate-commitment';
  readonly actor: ActorId;
  readonly front: string;
  readonly chips: number;
  readonly detachmentIds?: readonly string[];
}
```

Store assignments separately from numeric allocations:

```ts
frontAssignments: Record<ActorId, Record<string, readonly string[]>>;
```

Every named detachment must be unique, actor-owned, and have its planned end-of-turn hex in one of that front's two sectors. Use `reachCone(graph, position, 1, forced ? 5 : 3)` to reject a claimed endpoint outside the sealed radius; do not write a second radius calculation. An omitted or empty list remains legal as the existing garrison-only commitment path and carries no field substance. Zero chips clears both allocation and assignment. Revalidate assignments at lock so a later redirect or merge cannot leave a stale legal-looking commit; split preserves the original ID on one child, while merge preserves the canonical-lowest ID and retires the others.

- [ ] **Step 5: Run the focused suites**

Run: `npm run typecheck:game && npm run build:runtime:game && node --test game/tests/field-army.test.js game/tests/turn-loop.test.js`

Expected: PASS; split totals are bit-exact and the merge fatigue tolerance is `1e-12`.

- [ ] **Step 6: Commit assignment and formation actions**

```bash
git add game/src/domain/force.ts game/src/domain/commitment.ts game/src/domain/state.ts game/src/domain/turn.ts game/src/runtime/types.ts game/src/runtime/runtime.ts game/src/projection/project.ts game/src/preview/preview.ts game/src/runtime/index.ts game/tests/field-army.test.js game/tests/turn-loop.test.js
git commit -m "feat(game): conserve detachments across split and merge"
```

### Task 5: Replace Scalar Drafting with Deterministic Multi-Site Batch Settlement

**Files:**
- Create: `game/tests/recruitment-siting.test.js`
- Modify: `game/src/domain/recruitment.ts`
- Modify: `game/src/domain/commitment.ts`
- Modify: `game/src/domain/state.ts`
- Modify: `game/src/runtime/types.ts`
- Modify: `game/src/runtime/runtime.ts`
- Modify: `game/src/projection/project.ts`
- Modify: `game/src/preview/preview.ts`
- Modify: `game/src/runtime/index.ts`
- Modify: `game/tests/realm-economy.test.js`

**Interfaces:**
- Consumes: existing `draftBill`, `marginalPrice`, `RECRUIT_FRACTION_PER_POINT`, province availability, field headroom, local garrison headroom, and treasury.
- Produces: `RecruitmentRequest`, `RecruitmentBatchContext`, `RecruitmentFulfillment`, `RecruitmentBatchResult`, `settleRecruitmentBatch`, and `AllocateRecruitmentIntent`.

- [ ] **Step 1: Write failing conversion, permutation, shortage, and anti-splitting tests**

Create a helper that submits the new intent:

```js
const recruit = (runtime, actor, requestId, sectorId, commit, posture = 'field', extra = {}) =>
  runtime.submit({
    kind: 'allocate-recruitment', actor, requestId, sectorId, commit, posture, ...extra,
  });
```

Add these public acceptance cases:

```js
test('one point and stacked points retain the sealed one-percent conversion', () => {
  const one = openAtDecision();
  const beforeOne = one.view('realm-a').economy.field;
  const unit = Math.floor(one.view('realm-a').economy.forceLimit * 0.01);
  assert.equal(recruit(one, 'realm-a', 'r2-one', 'r2_s0', 1)[0].type, 'recruitment-allocated');
  closeTurn(one);
  assert.equal(one.view('realm-a').economy.field - beforeOne, unit);

  const stacked = openAtDecision();
  const beforeStack = stacked.view('realm-a').economy.field;
  recruit(stacked, 'realm-a', 'r2-stack', 'r2_s0', 4);
  closeTurn(stacked);
  assert.equal(stacked.view('realm-a').economy.field - beforeStack, unit * 4);
});

test('permuting the same recruitment batch leaves resolution events and state identical', () => {
  const run = (requests) => {
    const runtime = openAtDecision();
    for (const request of requests) recruit(runtime, 'realm-a', ...request);
    const closing = closeTurn(runtime).filter((event) =>
      ['recruitment-resolved', 'recruited', 'turn-opened'].includes(event.type));
    return { closing, view: runtime.view('realm-a') };
  };
  const requests = [
    ['north', 'r2_s0', 2, 'field'],
    ['south', 'r2_s4', 3, 'garrison'],
  ];
  assert.deepEqual(run(requests), run([...requests].reverse()));
});

test('splitting equal aggregate demand across sectors cannot reduce the authoritative bill', () => {
  const concentrated = openAtDecision();
  recruit(concentrated, 'realm-a', 'all', 'r2_s0', 4);
  const aEvents = closeTurn(concentrated);
  const split = openAtDecision();
  recruit(split, 'realm-a', 'a', 'r2_s0', 2);
  recruit(split, 'realm-a', 'b', 'r2_s3', 2);
  const bEvents = closeTurn(split);
  const bill = (events) => events.find((event) => event.type === 'recruitment-resolved').detail.bill;
  assert.equal(bill(aEvents), bill(bEvents));
});
```

Add a scaled-economy Runtime fixture that preserves native `Infinity`, then force province and treasury bounds through public turns:

```js
function economyScaledWorld(multiplier, revision) {
  const world = structuredClone(CRADLE_R1);
  world.revision = revision;
  for (const sector of Object.values(world.sectors)) sector.economyValue *= multiplier;
  world.contentHash = contentHashOf(world);
  return world;
}

test('province scarcity uses canonical largest remainder, not request submit order', () => {
  const run = (ids) => {
    const runtime = openAtDecision('field-army-0001', economyScaledWorld(100, 'r1-rich-test'));
    const available = runtime.view('realm-a').economy.provinces.r2.availableCivilians;
    const perPoint = Math.floor(runtime.view('realm-a').economy.forceLimit * 0.01);
    let pointsToDrain = Math.max(0, Math.floor(available / perPoint) - 5);
    let turn = 0;
    while (pointsToDrain > 0) {
      const commit = Math.min(20, pointsToDrain);
      recruit(runtime, 'realm-a', `drain-${turn}`, 'r2_s0', commit);
      closeTurn(runtime);
      pointsToDrain -= commit;
      turn += 1;
    }
    for (const id of ids) recruit(runtime, 'realm-a', id, id === 'a' ? 'r2_s0' : 'r2_s4', 10);
    return closeTurn(runtime).filter((event) => event.type === 'recruited');
  };
  assert.deepEqual(run(['a', 'b']), run(['b', 'a']));
});

test('insufficient treasury fulfills no request and emits no recruited event', () => {
  const runtime = openAtDecision('field-army-0001', economyScaledWorld(0.001, 'r1-poor-test'));
  recruit(runtime, 'realm-a', 'poor', 'r2_s0', 1);
  const events = closeTurn(runtime);
  assert.equal(events.some((event) => event.type === 'recruited'), false);
});
```

Import `contentHashOf` from the emitted barrel. The rich fixture derives its drain amount from public province availability, deliberately leaves five points of local civilians, and then asks two ten-point requests to compete for them; province scarcity therefore binds before the remaining realm field headroom.

- [ ] **Step 2: Run the new suite and observe the old scalar order contract**

Run: `npm run build:runtime:game && node --test game/tests/recruitment-siting.test.js`

Expected: FAIL because `allocate-recruitment` is unwired.

- [ ] **Step 3: Add the batch types and largest-remainder allocator**

Use these exact public/domain shapes:

```ts
export type RecruitmentPosture = 'field' | 'garrison';

export interface RecruitmentRequest {
  readonly requestId: string;
  readonly sectorId: SectorId;
  readonly commit: number;
  readonly posture: RecruitmentPosture;
  readonly destinationHex?: HexPosition;
  readonly joinDetachmentId?: string;
}

export interface RecruitmentFulfillment {
  readonly requestId: string;
  readonly requestedMen: number;
  readonly men: number;
  readonly limitedBy: readonly ('province' | 'field-headroom' | 'garrison-headroom' | 'treasury')[];
}

export interface RecruitmentBatchContext {
  readonly requests: readonly RecruitmentRequest[];
  readonly forceLimit: number;
  readonly field: number;
  readonly garrison: number;
  readonly register: number;
  readonly treasury: number;
  readonly availableCivilians: Readonly<Record<RegionId, number>>;
  readonly sectorRegions: Readonly<Record<SectorId, RegionId>>;
  readonly garrisonHeadroom: Readonly<Record<SectorId, number>>;
  readonly musterHexes: Readonly<Record<SectorId, HexPosition>>;
}

export interface RecruitmentBatchResult {
  readonly fulfilled: readonly RecruitmentFulfillment[];
  readonly men: number;
  readonly bill: number;
}

export function settleRecruitmentBatch(context: RecruitmentBatchContext): RecruitmentBatchResult;
```

Settlement order is exact: requested men → province/local garrison proration → realm field-headroom proration → one aggregate affordability solve/bill → treasury proration → one final aggregate bill over the fulfilled total. Every integer proration uses largest fractional remainder and key order `(muster q, muster r, requestId)`. Sort returned fulfillments by that same key before emitting events.

Reuse `draftBill(register, preServing / register, postServing / register)` for the sole authoritative bill. Do not sum per-request bills. Keep `draftOrder` exported as a compatibility wrapper around a single field request only until all ticket-05 tests are migrated in this task; then remove its Runtime use while retaining the pure export because the root regression suite imports it.

- [ ] **Step 4: Wire rich recruitment allocations into the same 20-point stack**

Add:

```ts
export interface AllocateRecruitmentIntent extends RecruitmentRequest {
  readonly kind: 'allocate-recruitment';
  readonly actor: ActorId;
}
```

The allocation key is `order:recruit:${requestId}`. A positive whole `commit` replaces that request; zero removes both its allocation and stored request. Validate non-empty stable `requestId`, controlled `sectorId`, posture fields, and shared-budget fit at submission. Store own plans as:

```ts
recruitmentOrders: Record<ActorId, Record<string, RecruitmentRequest>>;
```

Add and export the two dynamic-key readers:

```ts
export const recruitmentOrderKeyOf = (requestId: string): string =>
  `${ORDER_RECRUIT}:${requestId}`;

export const recruitmentCommitOf = (allocations: Readonly<Record<string, number>>): number =>
  Object.entries(allocations)
    .filter(([key]) => key.startsWith(`${ORDER_RECRUIT}:`))
    .reduce((sum, [, commit]) => sum + commit, 0);
```

For `allocationRefusal`, build the legal `orderKeys` from every stored recruitment key plus the candidate key after its rich fields pass validation. Do not make arbitrary `order:*` strings legal.

At the beginning of resolution, capture the current sector-owner table and judge the whole recruitment batch against that turn-start snapshot. Capture or integration later in the same resolution cannot retroactively validate or invalidate a draft; a sector integrated during turn N first appears in the eligible snapshot for turn N+1.

`MatchView.recruitmentOrders` contains only the viewer's own sorted requests. `preview` constructs the whole candidate batch by replacing the matching `requestId`, calls `settleRecruitmentBatch`, and returns both the selected fulfillment and aggregate bill. The opponent and observer receive no recruitment plan.

Extend the preview result with the exact batch answer rather than a second calculator:

```ts
export interface RecruitmentPreview {
  readonly fulfillment: RecruitmentFulfillment;
  readonly batch: RecruitmentBatchResult;
}

export interface PreviewCard {
  readonly admissible: boolean;
  readonly reason?: string;
  readonly draft?: DraftResult;
  readonly recruitment?: RecruitmentPreview;
}
```

`draft` stays only for the exported legacy pure-rule compatibility tests; all live recruitment intents and viewer copy read `recruitment`.

Clear `recruitmentOrders` with `commitments` at turn renewal. Requests are one-turn orders, not standing production queues.

- [ ] **Step 5: Replace ticket-05 Runtime and UI-facing scalar assumptions**

In `#resolveTurn`, settle one batch per actor before income and create cohorts instead of `forces.field += men`. Update `realm-economy.test.js` to call `allocate-recruitment` with an owned source sector and assert derived `economy.field`; preserve all price-curve unit tests. Remove `allocate-order` as an accepted recruitment path and assert it now returns a reportable rejection directing callers to `allocate-recruitment`.

- [ ] **Step 6: Run economy, recruitment, and turn-loop suites**

Run: `npm run typecheck:game && npm run build:runtime:game && node --test game/tests/realm-economy.test.js game/tests/recruitment-siting.test.js game/tests/turn-loop.test.js`

Expected: PASS; the command pool remains 20 and concentrated/split bills are equal.

- [ ] **Step 7: Commit batch recruitment**

```bash
git add game/src/domain/recruitment.ts game/src/domain/commitment.ts game/src/domain/state.ts game/src/runtime/types.ts game/src/runtime/runtime.ts game/src/projection/project.ts game/src/preview/preview.ts game/src/runtime/index.ts game/tests/recruitment-siting.test.js game/tests/realm-economy.test.js
git commit -m "feat(game): settle sector recruitment as one batch"
```

### Task 6: Add Recruitment-Turn Movement, Affiliation, and Next-Turn Activation

**Files:**
- Modify: `game/src/domain/force.ts`
- Modify: `game/src/domain/movement.ts`
- Modify: `game/src/domain/recruitment.ts`
- Modify: `game/src/runtime/types.ts`
- Modify: `game/src/runtime/runtime.ts`
- Modify: `game/src/projection/project.ts`
- Modify: `game/src/preview/preview.ts`
- Test: `game/tests/recruitment-siting.test.js`

**Interfaces:**
- Consumes: fulfilled requests, muster hex, normal reach cone, selected host's planned endpoint.
- Produces: pending field/garrison cohorts with `readyOnTurn`, `combatEligibleMen(detachment, turn)`, `activateReadyCohorts(detachment, turn)`, and deterministic affiliation events.

- [ ] **Step 1: Add failing first-turn movement/readiness/affiliation tests**

```js
test('field recruits may normal-march and affiliate but remain separately pending for one decision beat', () => {
  const runtime = openAtDecision();
  const host = runtime.view('realm-a').detachments[0];
  runtime.submit({
    kind: 'move-detachment', actor: 'realm-a', detachmentId: host.id,
    destinationHex: { q: 8, r: 7 }, forcedMarch: false,
  });
  recruit(runtime, 'realm-a', 'reinforce', 'r2_s0', 2, 'field', {
    destinationHex: { q: 8, r: 7 },
    joinDetachmentId: host.id,
  });
  closeTurn(runtime);
  const joined = runtime.view('realm-a').detachments.find((d) => d.id === host.id);
  assert.deepEqual(joined.position, { q: 8, r: 7 });
  assert.ok(joined.pendingMen > 0);
  assert.equal(joined.readyMen, host.readyMen);
  assert.equal(joined.pendingReadyOnTurn, runtime.view('realm-a').turn);
});

test('recruitment-turn forced march and excess normal reach are rejected', () => {
  const runtime = openAtDecision();
  for (const extra of [
    { destinationHex: { q: 5, r: 8 }, forcedMarch: true },
    { destinationHex: { q: 5, r: 8 } },
  ]) {
    const events = runtime.submit({
      kind: 'allocate-recruitment', actor: 'realm-a', requestId: JSON.stringify(extra),
      sectorId: 'r2_s0', commit: 1, posture: 'field', ...extra,
    });
    assert.equal(events[0].type, 'intent-rejected');
  }
});

test('pending recruits activate before the following turn resolves, never in the raising turn', () => {
  const runtime = openAtDecision();
  recruit(runtime, 'realm-a', 'standalone', 'r2_s0', 1, 'field');
  const raised = closeTurn(runtime);
  assert.equal(raised.some((event) => event.type === 'cohort-activated'), false);
  assert.ok(runtime.view('realm-a').detachments.some((d) => d.pendingMen > 0));
  const next = closeTurn(runtime);
  assert.equal(next.some((event) => event.type === 'cohort-activated'), true);
  assert.equal(runtime.view('realm-a').detachments.reduce((n, d) => n + d.pendingMen, 0), 0);
});
```

The host itself never teleports to the recruit destination. The test moves it explicitly because affiliation succeeds only when the host and recruited cohort resolve to the same endpoint.

- [ ] **Step 2: Run the focused suite and verify recruits currently appear ready and stationary**

Run: `npm run build:runtime:game && node --test game/tests/recruitment-siting.test.js`

Expected: FAIL on missing pending/readiness behavior.

- [ ] **Step 3: Enforce placement and affiliation legality at submission and lock**

Garrison requests forbid destination and join fields. Field destinations must be in `reachCone(graph, muster, 1, MARCH_SPEED)`. `forcedMarch` is not part of `AllocateRecruitmentIntent`; Runtime must nevertheless reject a JavaScript payload that supplies `forcedMarch: true` rather than silently ignoring it. A join target must be actor-owned and its planned turn endpoint must equal `destinationHex`; omitted destination means the muster hex. Re-run all stored recruitment legality at `lock-commitment`, so redirecting a host after planning recruitment cannot silently change affiliation.

- [ ] **Step 4: Resolve pending cohorts in the sealed order**

Implement this order inside `#resolveTurn`:

```ts
const revealed = revealTurn(state.actors, state.commitments);
events.push(...this.#activateCohortsReadyFor(state.turn));
events.push(...this.#resolveRecruitment(revealed.commitments));
events.push(...this.#resolveMovement());
events.push(...this.#resolveRecruitmentAffiliation());
events.push(...this.#readReadyFronts(revealed));
events.push(...this.#updateMobilizationSignals());
events.push(...this.#resolveIncome());
```

New cohorts carry `readyOnTurn = state.turn + 1`. They stay distinct throughout their raising resolution. At the next turn's payoff start, activation merges their origin composition and fatigue into the host ready cohort before any front reading; this makes them combat-eligible in the following turn while preserving a full intervening decision view that shows exact `pendingMen`.

`combatEligibleMen(detachment, turn)` returns ready men plus pending cohorts whose `readyOnTurn <= turn`; `activateReadyCohorts` performs the corresponding origin sum and men-weighted fatigue merge immediately before front reading. In projections, `pendingReadyOnTurn` is the earliest pending activation turn or `null`, and `pendingFatigue` is the men-weighted pending fatigue or `null`.

Field recruits travel independently from muster to destination at normal speed and accrue normal march fatigue. A standalone request creates a stable new detachment containing pending only. A joined request appends pending to the named host after both endpoints match. Garrison requests append pending to the source `GarrisonForce` and count against local cap immediately but not ready defense.

- [ ] **Step 5: Run recruitment and field-army suites**

Run: `npm run typecheck:game && npm run build:runtime:game && node --test game/tests/recruitment-siting.test.js game/tests/field-army.test.js`

Expected: PASS; activation occurs only in the next turn's closing event list.

- [ ] **Step 6: Commit readiness and affiliation**

```bash
git add game/src/domain/force.ts game/src/domain/movement.ts game/src/domain/recruitment.ts game/src/runtime/types.ts game/src/runtime/runtime.ts game/src/projection/project.ts game/src/preview/preview.ts game/tests/recruitment-siting.test.js
git commit -m "feat(game): delay recruited cohorts until next-turn combat"
```

### Task 7: Project Honest Mobilization Signals Without Inventing Fog Constants

**Files:**
- Modify: `game/src/domain/state.ts`
- Modify: `game/src/runtime/types.ts`
- Modify: `game/src/runtime/runtime.ts`
- Modify: `game/src/projection/project.ts`
- Test: `game/tests/recruitment-siting.test.js`

**Interfaces:**
- Consumes: positive fulfilled recruitment batches and viewer identity.
- Produces: private `MobilizationTrace` truth and source-only `MobilizationSignalView` for the opposing seat.

- [ ] **Step 1: Add failing non-leakage and one-decision-beat tests**

```js
test('a positive draft publishes its source for one enemy decision beat without exact men or destination', () => {
  const runtime = openAtDecision();
  recruit(runtime, 'realm-a', 'signal', 'r2_s0', 3, 'field', {
    destinationHex: { q: 8, r: 7 },
  });
  closeTurn(runtime);
  const enemy = runtime.view('realm-b');
  assert.deepEqual(enemy.mobilizationSignals, [
    { actor: 'realm-a', sectorId: 'r2_s0', observedTurn: 1, band: 'activity-detected' },
  ]);
  const serialized = JSON.stringify(enemy.mobilizationSignals);
  assert.equal(serialized.includes('men'), false);
  assert.equal(serialized.includes('destination'), false);
  closeTurn(runtime);
  assert.deepEqual(runtime.view('realm-b').mobilizationSignals, []);
});

test('a zero-man fulfillment creates no mobilization signal', () => {
  const runtime = openAtDecision();
  recruit(runtime, 'realm-a', 'zero', 'r2_s0', 0, 'field');
  closeTurn(runtime);
  assert.deepEqual(runtime.view('realm-b').mobilizationSignals, []);
});
```

- [ ] **Step 2: Run the focused suite and verify signals are absent**

Run: `npm run build:runtime:game && node --test game/tests/recruitment-siting.test.js`

Expected: FAIL because `mobilizationSignals` is undefined.

- [ ] **Step 3: Store exact traces privately and project only the approved categorical trace**

Use these types:

```ts
export interface MobilizationTrace {
  readonly actor: ActorId;
  readonly sectorId: SectorId;
  readonly men: number;
  readonly turn: number;
}

export interface MobilizationSignalView {
  readonly actor: ActorId;
  readonly sectorId: SectorId;
  readonly observedTurn: number;
  readonly band: 'activity-detected';
}
```

At the information-update beat, replace `state.mobilizationTraces` with one canonical trace per positive source-sector aggregate. Own viewers use exact recruitment events/force views and receive no redundant signal; enemy viewers receive only source, turn, and categorical detection. Observer receives none. Do not import or choose `DECAY_FLOOR`, `MAX_CONFIDENCE`, `WIDTH_PCT`, `WIDTH_ABS`, or M8 values; ticket 08 maps private `men` through its resolved confidence bands.

- [ ] **Step 4: Run the focused suite**

Run: `npm run typecheck:game && npm run build:runtime:game && node --test game/tests/recruitment-siting.test.js`

Expected: PASS, and serialized enemy signals contain neither exact men nor destination.

- [ ] **Step 5: Commit the projection seam**

```bash
git add game/src/domain/state.ts game/src/runtime/types.ts game/src/runtime/runtime.ts game/src/projection/project.ts game/tests/recruitment-siting.test.js
git commit -m "feat(game): expose source-only mobilization signals"
```

### Task 8: Make the Grey-Box Viewer Operate and Explain the New Contracts

**Files:**
- Modify: `game/src/renderer/index.ts`
- Modify: `game/src/ui/App.tsx`
- Modify: `game/src/ui/MapBoard.tsx`
- Modify: `game/src/ui/styles.css`
- Modify: `game/tests/browser/viewer.spec.js`

**Interfaces:**
- Consumes: `MatchView.detachments`, `MatchView.garrisons`, own recruitment orders, preview cards, mobilization signals.
- Produces: legible own detachment markers/readouts and minimal controls that exercise Runtime intents; no final interaction layering.

- [ ] **Step 1: Write failing Playwright tests for position, destination, and sited draft**

Add browser expectations:

```js
test('the grey-box map shows every own detachment and its planned destination', async ({ page }) => {
  await openDecisionBeat(page);
  await expect(page.locator('[data-detachment]')).toHaveCount(1);
  await page.locator('[data-sector="r10_s2"]').hover();
  await page.getByTestId('march-focused').click();
  await expect(page.getByTestId('detachments')).toContainText('→');
  await expect(page.getByTestId('detachments')).toContainText('턴');
});

test('a human sites recruitment before committing it', async ({ page }) => {
  await openDecisionBeat(page);
  await page.getByTestId('recruit-sector').selectOption('r10_s0');
  await page.getByTestId('recruit-posture').selectOption('field');
  await page.getByTestId('recruit-plus').click();
  await expect(page.getByTestId('draft-preview')).toContainText('r10_s0');
  await expect(page.getByTestId('chips-recruit')).toHaveText('1');
});
```

Define `openDecisionBeat(page)` once in the test file by extracting the existing two-capital helper; do not duplicate setup in every case.

- [ ] **Step 2: Build the viewer and verify selectors fail**

Run: `npm run build:game && npx playwright test --config game/playwright.config.js game/tests/browser/viewer.spec.js`

Expected: FAIL because detachment/recruitment controls are not rendered.

- [ ] **Step 3: Render map markers and exact readiness text**

In `MapBoard`, draw only `view.detachments` using `hexCenter(position, view.board.meta.hexR)`. Use `data-detachment={id}` on the current marker and a dashed line to `destination` when non-null. Never derive opponent positions from truth.

In `TurnStrip`, render a `data-testid="detachments"` table with ID, current coordinate, destination, `turnsRemaining`, ready men, pending men, and fatigue. Pending copy must read `다음 전투 가용` rather than folding it into ready mass.

- [ ] **Step 4: Add minimal movement and recruitment controls**

Use the focused sector's `musterHexOf(view.board, focused)` as the grey-box destination when the player clicks `march-focused`; Runtime still validates it. Provide one selected detachment, a forced-march checkbox, split-men input, and merge-selected button. For recruitment provide an owned-sector select, field/garrison select, one stable request ID `greybox-recruit`, and `+1`/clear controls that submit `allocate-recruitment`. Do not decide panel layering, map-selection choreography, or final copy in this ticket.

- [ ] **Step 5: Run the viewer suite**

Run: `npm run build:game && npx playwright test --config game/playwright.config.js game/tests/browser/viewer.spec.js`

Expected: PASS, including existing map/camera/turn/economy cases.

- [ ] **Step 6: Commit the grey-box operation surface**

```bash
git add game/src/renderer/index.ts game/src/ui/App.tsx game/src/ui/MapBoard.tsx game/src/ui/styles.css game/tests/browser/viewer.spec.js
git commit -m "feat(viewer): expose field movement and sited recruitment"
```

### Task 9: Extend Cross-Host Replay and Close Ticket 06a

**Files:**
- Modify: `game/acceptance/harness.html`
- Modify: `game/acceptance/replay.js`
- Modify: `game/tests/browser/boot.spec.js`
- Modify: `game/tests/turn-loop.test.js`
- Modify: `.scratch/l3-playable-build/issues/06a-move-the-field-army.md`
- Modify: `.scratch/l3-playable-build/README.md`
- Modify: `docs/features/match-arc/INDEX.md`
- Modify: `docs/features/war-model-build/INDEX.md`

**Interfaces:**
- Consumes: all emitted intents, canonical projected detachment/recruitment state, existing acceptance lanes.
- Produces: one replay digest covering the new system and a landed ticket record with verification evidence.

- [ ] **Step 1: Add movement, split, merge, and recruitment to the durable replay**

Change `replayLog(runtime)` to pump every appended intent through the planning Runtime while it constructs the log:

```js
const log = [];
const append = (...intents) => {
  for (const intent of intents) {
    log.push(intent);
    const rejected = runtime.submit(intent).find((event) => event.type === 'intent-rejected');
    if (rejected) throw new Error(`replay fixture rejected: ${rejected.detail.reason}`);
  }
};
```

After appending the capital beat, read each seat's own first detachment ID from that planning Runtime and append a deterministic sequence containing:

```js
const [first] = runtime.view('observer').actors;
const firstView = runtime.view(first);
const firstCapital = firstView.capitals[first];
const firstDetachment = firstView.detachments[0].id;
```

```js
{
  kind: 'allocate-recruitment', actor: first, requestId: 'replay-recruit-1',
  sectorId: firstCapital, commit: 2, posture: 'field',
}
{
  kind: 'split-detachment', actor: first,
  detachmentId: firstDetachment, men: 1000,
}
```

For the fixed parity fixture (`browser-lane-0001`), append a normal `move-detachment` of `firstDetachment` to `{ q: 19, r: 13 }`, an authored r10 hex two steps from the opening `{ q: 20, r: 14 }`. Pass selected detachment IDs only when that projected turn endpoint belongs to the chosen front; keep every existing replay commitment explicitly garrison-only with `detachmentIds: []`.

Extend `turnSummary` with:

```js
detachments: view.detachments.map((d) => ({
  id: d.id, position: d.position, destination: d.destination,
  men: d.men, readyMen: d.readyMen, pendingMen: d.pendingMen, fatigue: d.fatigue,
})),
economy: view.economy && {
  treasury: view.economy.treasury,
  field: view.economy.field,
  garrison: view.economy.garrison,
  register: view.economy.register,
  provinces: view.economy.provinces,
},
mobilizationSignals: view.mobilizationSignals,
```

Change the harness replay signature to `replay({ seed, actors, viewer = 'observer', log })` and return `runtime.view(viewer)`. In `boot.spec.js`, compare `node.view(FIXTURE.viewer)` with the browser replay already receiving `FIXTURE.viewer`; this makes detachments, readiness, economy, and signals part of the host comparison without opening an observer truth side door.

- [ ] **Step 2: Run the browser boot lane and fix only contract mismatches**

Run: `npm run build:runtime:game && npm run build:game && npx playwright test --config game/playwright.config.js game/tests/browser/boot.spec.js`

Expected: PASS with identical `turnSummary` in Node and browser and no rejected replay intents.

- [ ] **Step 3: Run every focused Node test before the full chain**

Run: `npm run build:runtime:game && node --test game/tests/field-army.test.js game/tests/recruitment-siting.test.js game/tests/realm-economy.test.js game/tests/turn-loop.test.js`

Expected: PASS with no skipped tests.

- [ ] **Step 4: Run the complete verification chain**

Run: `npm run verify:game`

Expected: typecheck, runtime build, viewer build, Node, and browser lanes PASS; parity reports **PENDING** only because gate 10 has no authorized equality threshold, while its two observed digests are identical.

Run: `npm test`

Expected: **479/479 or higher**, all PASS.

Run: `npm run lint:docs`

Expected: **0 blocking**; known advisories do not increase.

- [ ] **Step 5: Run the execution-time verification skill and inspect the final diff**

Use `superpowers:verification-before-completion`, then run:

```bash
git status --short
git diff --check
git log --oneline --decorate -12
```

Expected: no whitespace errors; only the approved 06a/R19 files are changed; the pre-existing R19 authority audit remains preserved as Working-layer evidence.

- [ ] **Step 6: Record ticket completion and commit the closeout**

Check every 06a acceptance item, change its status to landed with the actual test counts/digests, refresh the two feature indexes, and keep 06b/06c/06d statuses unchanged. Record explicitly that casualty mutation is owned by 06c and capture/register succession by 06d, both consuming the origin/pending interfaces shipped here.

```bash
git add game/acceptance/harness.html game/acceptance/replay.js game/tests/browser/boot.spec.js game/tests/turn-loop.test.js .scratch/l3-playable-build/issues/06a-move-the-field-army.md .scratch/l3-playable-build/README.md docs/features/match-arc/INDEX.md docs/features/war-model-build/INDEX.md
git commit -m "test(game): verify ticket 06a across both hosts"
```

---

## Scope Boundary for Tickets 06c and 06d

This plan leaves no positionless force or ambiguous recruitment write behind, but it intentionally does not fire casualty or capture consequences:

- Ticket 06c must remove losses from `ForceCohort.origins` proportionally and reduce the same actor's `RealmForces.registers[origin]`; its tests must prove death conservation through Runtime combat events.
- Ticket 06d must remove pending cohorts left at a captured hex, reduce the same origin register shares, transfer only remaining civilian shares, preserve departed recruits, and issue no treasury/commit refund; its tests must prove those outcomes through capture events and projected views.
- Ticket 08 must translate private `MobilizationTrace.men` through the resolved confidence-band contract. Ticket 06a exposes only `activity-detected` and does not choose any fog magnitude.

These are ownership boundaries, not unfinished 06a behavior: 06a ships the complete state, legality, movement, recruitment, readiness, and projection foundation those tickets consume.
