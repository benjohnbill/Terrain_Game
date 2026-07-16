# Define the Incremental Migration and Adapter Ladder

Type: grilling
Status: open
Blocked by: 01, 02, 05, 06, 08

## Question

In what order should legacy modules cross the new seams, which temporary
adapters are justified, how is behavior parity demonstrated before each old
path is retired, and what prevents a permanent half-migrated architecture?

## Comments

- Standing target constraint (ADR 0040): new canonical production source is
  TypeScript/TSX end to end. Existing JavaScript is an incremental porting and
  parity surface, not the permanent runtime behind a typed facade. This ticket
  decides port order, justified temporary adapters, and their retirement gates.

## Required reading of `port`

For this gate's option space, `port` means **reimplementation from the
authoritative contract, verified against selected legacy tests, fixtures, and
executable models; it does not mean source-level adaptation**.

ADR 0040 does not require amendment for this reading. Its Context rejects
mechanical conversion, and Decision 6 requires parity coverage for canonical
TypeScript *behavior*, not source lineage. The gate still decides which legacy
evidence is relevant, the order in which behavior crosses the seam, and whether
any exceptional adapter is justified.

## Decision constraints

- New canonical L3 production source is TypeScript/TSX end to end.
- The legacy browser application is a bounded comparison and rollback route,
  not the architectural template ([issue 01](01-choose-migration-topology.md)).
- The Runtime privately owns match truth; no adapter may give React, the
  renderer, preview, or bots authoritative hidden state
  ([issue 02](02-define-game-runtime-authority.md)).
- A legacy test is evidence only after it is classified against the current
  Production contract. Superseded or incidental behavior is not a parity goal.
- Known R14 placeholders and legacy victory conditions cannot cross merely
  because they are executable.
- Every temporary adapter must name its consumer, retirement evidence, and the
  gate after which it is removed.

## Evidence-based option space

### A. Greenfield architecture with selective behavioral extraction

Create the new Runtime, UI, projection, preview, and production rule modules at
the accepted seams. For each playable slice, reimplement only the required
accepted behavior and rewrite the relevant tests against the new highest seam.

- **Strength:** avoids reproducing the coupling in `js/game.js` and `js/main.js`
  and aligns migration work with player-visible progress.
- **Cost:** requires an explicit legacy-behavior inventory so undocumented but
  valuable edge cases are not silently lost.

### B. Adapter-led incremental replacement

Wrap selected existing JavaScript modules behind temporary TypeScript adapters,
then replace their implementations slice by slice.

- **Strength:** can preserve a faithful, already-tested calculation cheaply.
- **Cost:** the default legacy application path mixes truth, presentation, time,
  entropy, and callbacks; broad adapters would recreate the typed-facade target
  ADR 0040 rejects. This option is safe only for narrow faithful calculators
  with named retirement gates.

### C. Mechanical repository conversion

Convert historical JavaScript, tests, and mockups before building the L3 path.

- **Strength:** produces superficial language uniformity.
- **Cost:** delays playable evidence, preserves obsolete structure, and violates
  ADR 0040's vertical-slice direction. This is not an eligible recommendation.

## Recommendation

Choose A as the default ladder. Permit B only for a narrow calculator whose
behavior is still authoritative and whose adapter is cheaper than immediate
reimplementation. Reject C. Sequence each extraction inside a demoable vertical
slice, retain selected legacy evidence until replacement coverage passes, and
make adapter retirement conditional rather than inventing cleanup work before an
adapter exists.

This recommendation does not resolve the gate. The final ladder depends on the
build/test topology, authored-world contract, and first playable slice.
