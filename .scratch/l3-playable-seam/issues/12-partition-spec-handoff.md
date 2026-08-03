---
type: grilling
status: resolved
blocked_by: []
---

# Partition the Implementation-Ready Spec Handoff

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
  those mechanics (`DOCUMENTATION-LAW.md`).
- A ticket stays Working-layer and cannot become `ready-for-agent` until it
  cites the final Production home that closes every specification gate.
- Cross-feature architecture decisions that meet the ADR threshold must promote
  with the supersession/amendment protocol in the same doc-sync batch.
- `docs/SYNC-DEBT.md`, the row **"L3 Seam Wayfinder 02 — ADR promotion
  undecided"** (registered 2026-07-16), reserves three riders for this gate: decide ADR
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
- set `status: open` in the front matter only when every cited prerequisite
  exists and no unresolved design choice remains. *(This bullet read
  `Status: ready-for-agent`. Ticket 14 R1/R3 moved state into front matter and
  R4 retired that value on 2026-08-03; `scripts/audit-lint.js` check `ticketFieldDomains` rejects it.)*
- keep any ticket with an unbuilt R14-safe prerequisite at `needs-info` and name
  that prerequisite rather than approximating it;
- verify that each ticket remains one demoable vertical increment and does not
  redefine its referenced mechanics.

The honest cost is several small authoritative homes instead of one omnibus
spec. That cost prevents cross-feature drift and makes an independent
implementation session mechanically discoverable. This recommendation does
not resolve the gate; the user must approve the partition and ADR promotion
set after gates 03 and 05–11 close.

---

# Answer — SEALED 2026-08-03 (user grill)

Verdict source: user grill, 2026-08-03, the last open Wayfinder gate. Ten
rulings, all the user's. The recommendation above was written 2026-07-17 and is
**partly superseded** by them: option A's new integration feature home is
rejected, and the ADR promotion set is narrower than § ADR and doc-sync
recommendation proposed. Read the rulings, not the recommendation.

## What changed under the recommendation before it was ruled

The gate was written on the premise that no build ticket could execute until it
published. **R6's per-ticket waiver (2026-07-25) routed around that**, and ten
tickets landed without it — 01, 02, 03, 05, 06a–06e, 07. What they actually did
is the evidence this gate was missing: each cited existing birthplaces plus a
purpose-minted ADR. Ticket 06e, the cleanest, closes with four pointers (ADR
0046 · terrain-cradle TC-⑮ · war-model-build WM-⑤ · combat-formula M5) and
declares "Specification gates: none outstanding." Option C's predicted cost —
"every implementation ticket must assemble a different cross-document contract"
— did not materialise.

## R1 — No new integration feature home

`docs/features/l3-playable-seam/` is **not** created. Measured demand is zero
across ten landed tickets, and option A's own stated cost ("careful pointers so
the integration requirements do not copy Fog or war-model definitions") is a
standing exposure to the single-definition rule bought for a convenience nobody
reached for. An ADR may draw on several features as evidence; that is not a
reason to open a birthplace.

## R2 — The promotion criterion is the law's own ADR trigger

A gate does not invent its own criterion. *Reason (user): law, documents, lint
and skills have to stay coherent, or the workflow stops fitting together.*

## R3 — Citation is the invoice

A Production or Record document that cites a tracker ruling **as authority**
triggers promotion of that ruling to a birthplace. A ruling nobody cites stays in
the tracker as record.

Rejected: (A) do nothing — 23 Production/Record citations would keep pointing at
a layer the law says is not current truth. (B) promote all nineteen
`DECISIONS-OWED.md` R-rulings — they scatter across four features for no measured
demand. (C) amend the law so sealed tracker content becomes Record layer —
**rejected because Working-layer status is load-bearing for `.scratch/` being
deletable**; `AGENTS.md` already writes deletion conditions for tracker entries,
and permanent trackers would void the taxonomy.

Measured at ruling time: `DECISIONS-OWED.md` carries a **19-ruling series**
(R1–R19) with evidence, rejected alternatives and CLOSED stamps — structurally a
`RULINGS.md` living in the Working layer. One of them, **R6**, is the waiver that
authorised the arrangement. R6 was not a mistake; it was a debt, and this gate is
where the build README always said it came due.

## R4 — The law's trigger outranks R3; R3 is the residual rule

| | Law's ADR trigger | R3 invoice | Verdict |
|---|---|---|---|
| gate 02 | does not fire | none | **ADR** (by discretion — R5) |
| gate 05 | does not fire | none | nothing; see R8 |
| gate 06 | does not fire | none | nothing |
| `DECISIONS-OWED` R18 | does not fire | `combat-formula/MAGNITUDE.md:890` cites it as `Authority:` | **repay at combat-formula** |
| R1–R19, the rest | does not fire | none | stay in the tracker as record |

## R5 — Gate 02 is promoted to an ADR, by discretion

**The mandatory trigger does not fire.** `docs/SYNC-DEBT.md`'s registered row read
it correctly in 2026-07-16: gate 02 answers inside ADR 0039 Decision 3's own
declared deferral. That row **deferred** the promotion decision to this gate; it
never refused it.

What carries promotion is measurement taken here: the canonical L3 source cites
gate 02 by name in **28 places in authored files**, including as its declared
`Authority:` (`game/src/runtime/runtime.ts:4`, `types.ts:4`, `game/README.md`) and
inside a contract test's failure message. An accepted ADR (0048) had also come to
rest on it.

Result: **ADR 0049**. Four expired statements in gate 02's wording are corrected
at promotion rather than carried: the "blur" framing (ADR 0048 — truth never
enters the projection function), the `currentActor`/out-of-turn framing (ruling
R8), the "intent log plus seed" shorthand (authored-world identity restored), and
"user-sealed" applied to a tracker (not a mechanical seal under the law).

## R6 — Code citations: invoice at promotion, scoped, non-retroactive

`game/` cites tracker gates and rulings by **name** in **166 places** (about half
the emitted `dist/` mirror). The invoice is **not** 166:

- issued only at promotion, and only against the promoted gate — **28**;
- within those, only citations claiming **current authority** repoint. Citations
  that **narrate what was decided when** keep naming the gate, because repointing
  them would make them false. `game/src/runtime/types.ts:396-403` is the worked
  example: "Gate 02 sealed `currentActor -> ActorId` a week before the pivot" is
  history, and ADR 0049 sealed nothing a week before 2026-07-23.

Applied: 28 → **14 remaining**, each either history or explicitly-marked residue.

Gates 05 and 06 issue no invoice, so `game/src/world/load.ts:79` keeps pointing at
gate 06 D3 permanently. That is **correct, not debt** — the tracker is alive and
the rule lives there. It becomes debt only if the tracker is demoted, which is a
different event with its own trigger.

## R7 — ADR 0049's minimum scope

Included: Runtime privately owns truth · callers receive only viewer-legal
projections · viewer policy applied once at one boundary · **no API hands a
caller truth or a live handle on it, hence no snapshot and no subscription** (a
semantic obligation, *not* a freeze on member names or arity) · preview is a pure
module outside the Runtime · bots are ordinary callers · Runtime enforces
phase/turn legality while pacing is owned outside · the durable canonical form
is `(authored-world identity and revision, rule revision, seed, ordered intent
log)`.

Absorbed into its rationale: **"a protection that depends on caller discipline is
not a structural guarantee"** — the principle behind three of gate 02's
rejections, recorded there rather than promoted to a root document (user
decision, 2026-07-16).

Excluded: gate 03's knowledge matrix · fog's testimony model and values · React,
renderer, build topology, the `:game` surface · bot strategy · concrete type and
member names · combat and turn rules · point-in-time measurements.

**Consequence found while applying R6, recorded rather than absorbed:** gate 02
§ 6 seals *more* than R7 took. The concrete three-member surface, the
internal-decomposition clause, and the rejection-event shape are not in ADR 0049.
Those citations stay pointed at gate 02 and are marked in the code as clauses the
ADR did not take. Widening ADR 0049 to cover them would contradict R7's exclusion
of API naming and implementation shape; the honest reading is that they are
**implementation contracts** whose home is the code and its tests.

## R8 — A discharged forward reference converts; it does not promote

`docs/adr/0040:68` read "emitted-output parity commands **are decided by** the L3
Playable Seam Wayfinder" — a Record-layer ADR naming a Working-layer tracker as
standing authority, and the only such forward reference in the whole ADR set.
Gate 05 discharged it on 2026-07-18 and the seven `:game` commands are live in the
root `package.json`.

Converted to **evidence provenance plus a pointer at the live surface**: "were
settled at Wayfinder gate 05 (2026-07-18) and are live in the root
`package.json`". No promotion. Gate 05 and gate 02 are not the same illness — gate
02's contract still lived only in the tracker, while gate 05's had already been
delivered into executable form.

## R9 — Ticket republication

`Specification gates:` lines become Production/ADR pointers. **`ready-for-agent`
stays retired**: ticket 14 R4 cut it the same day, `audit-lint.js` check
`ticketFieldDomains` rejects it, and its job is done by the absence of
`needs-info`. Documents still speaking the retired vocabulary are corrected in
this batch as R4's unpaid residue. Six tickets citing the closed Wayfinder 10 as
open are corrected with them.

> **Count corrected during this batch's own review.** R9 first said "three
> documents". The review found **five**, and the miss has a cause worth keeping:
> `audit-lint.js` validates front matter only under `issues/`, so every surviving
> use sat where no check looks — `.scratch/l3-playable-seam/spec.md` (including a
> live `Status: ready-for-agent` header, the retired value on the retired
> mechanism), `DECISIONS-OWED.md` § R6, and `.scratch/operational-manoeuvre/README.md`.
> All are corrected; R6's recorded ruling text is left verbatim with a
> translation note, because a ruling is a record. Two further occurrences are
> deliberately kept: `README.md`'s quoted 2026-07-25 amendment and ticket 07's
> resolved-state history, both of which *narrate* the old vocabulary rather than
> use it — the same history-versus-authority line R6 draws for code.

**One limit, stated rather than glossed.** "Exact Production/ADR pointers" is
achievable only where a contract exists. Tickets 04, 09, 10, 11 and 13 are still
`needs-info` on unruled `DECISIONS-OWED.md` Part 2 rows, so their lines name the
gate closure and the specific rows that remain, not a final contract they cannot
yet cite. They convert fully when those rows are ruled.

## R10 — This gate closes on execution, not on the ruling

The repo's convention is that a gate resolves on its § Answer and its doc-sync is
registered separately (gates 05 and 06, 2026-07-18; R6 made it a rule). **This
gate is the exception, and deliberately.** Resolving on the answer would let
ticket 08 unblock by citing this § Answer — a Working-layer tracker — which is
precisely what R3 and R5 rule must stop. Gate 12 is the one gate whose output
*is* the promotion, so it closes when the promotion lands.

## Material table — all six rows disposed

| Row | Disposition |
|---|---|
| Viewer knowledge / Standard Fog → fog-of-war-discovery | Already true: RULINGS ③ and MAGNITUDE FG-M① landed 2026-08-03. Confirmed, not designed |
| Authored world → terrain-cradle | **Nothing owed.** No ADR trigger, no invoice. Promotes when something cites it |
| R14-safe war/match behavior → war-model-build | **Nothing owed.** `REQUIREMENTS.md` exists; R14's own closing condition in `docs/DESIGN-RISKS.md` already routes there. `R14-safe` occurs nowhere outside this file |
| End-to-end seam → a new integration feature home | **Rejected** (R1) |
| Runtime authority / projection boundary → ADR amending 0039 | **ADR 0049** (R5, R7) |
| Parallel-strangler build/cutover → second ADR | **Void.** ADR 0041 removed the premise and gate 11 closed as "nothing is retired" |

## Defects this gate found and fixed

Three were live, and all three came from the same 2026-08-03 fog batch dropping
doc-sync items that nothing checks:

1. **Gate 03 had no invariant 8.** ADR 0048 § Consequences asserted "Invariant 8
   is added in the same batch" and commit `77d892f` never touched gate 03, whose
   list still said "all seven" — while ADR 0048 and build ticket 08 both cited
   eight. Written now; the ADR sentence is corrected rather than quietly made true.
2. **Gate 03 invariants 2, 5, 6 and 7 still described the retired model.** Their
   conclusions stood; their mechanisms had been replaced by ruling ③. An
   implementer following them literally would have built what ③ retired. Amended,
   and their archive `js/intel.js` citations cut per ADR 0041.
3. **ADR 0048 was never added to `docs/adr/README.md`.** Nothing runs
   disk→README, the same gap that leaves `doc-registry.json` missing 8 governed
   files.

Reported by a parallel read-only session and verified here against the tree
before acting.
