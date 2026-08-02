---
type: grilling
status: resolved
blocked_by: [01, 02, 05, 06, 08]
---

# Define the Incremental Migration and Adapter Ladder

> **Migrated to front matter 2026-08-03** (ticket 14 R3). The old
> header lines carried prose that the schema moves off the status line:
>
> - **status was:** resolved (2026-08-02, user — decided from above by ADR 0041; see § Resolution)
> - **blocked-by line was:** 01, 02, 05, 06, 08 — all resolved

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

## Resolution — 2026-08-02 (user)

**This gate is answered from above rather than decided on its own terms.** Its
question presupposes a migration: legacy modules crossing seams, adapters
standing between old and new, an old path retired once parity is shown. **ADR
0041 removed that premise.** `js/`, `tests/`, the L2 harnesses and the mockups
are a *reference archive*, not the source tree the L3 build grows out of; they
are explicitly "not a parity comparator for behavior they never ran"; accepted
behavior reaches L3 by **re-implementation from its authoritative contract**
with the archive used to verify the result; and the archive's retirement "is not
a precondition for L3."

Each of the four sub-questions resolves accordingly:

- **Port order** — there is no crossing to order. Which behavior is
  re-implemented, and when, is the build's dependency chain
  (`.scratch/l3-playable-build/README.md` § Build dependency chain), not this
  gate's to award.
- **Justified adapters** — option B's premise is gone: nothing is being wrapped,
  because L3 grows in its own tree from contracts. **Measured 2026-08-02:**
  `game/src` and `game/tests` contain **zero** imports of the archive after nine
  landed tickets (01, 02, 03, 05, 06a–06e, 07). Option A was executed de facto
  and B was never invoked.
- **Parity before retiring an old path** — no old path is retired, so there is no
  such event to gate. Whether anything is retired at all is now **gate 11**'s
  question, re-framed by the same ADR.
- **Preventing a permanent half-migrated architecture** — ADR 0041 answers this
  structurally. The two trees are **isolated environments**, not two halves of
  one migration, so there is no half-migrated state to prevent.

**The one residue, and where it goes.** Option A's stated cost — that greenfield
re-implementation "requires an explicit legacy-behavior inventory so
undocumented but valuable edge cases are not silently lost" — is *not* discharged
by ADR 0041. The ADR makes the archive advisory evidence; it does not make anyone
consult it. But that is no longer a migration-ladder question: it is the question
of whether each L3 operation is faithful to its sealed contract, which is
**gate 10's evidence stack, Gate 5** ("every L3-invoked operation names its
Production birthplace and passes its contract tests"). It transfers there rather
than keeping this gate open.

**Consequence for gate 10.** Gate 10's `Blocked by` list named 09 and is now
clear. Gate 10's own Gate-5 layer inherits the residue above and should be read
with ADR 0041 in hand: its "selected legacy parity" half describes a comparison
the ADR retired, and re-cutting that layer is part of closing 10.
