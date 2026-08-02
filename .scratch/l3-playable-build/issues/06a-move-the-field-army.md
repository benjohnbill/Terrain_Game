---
type: task
status: resolved
blocked_by: [03, 05]
---

# 06a — Move a Field Army

> **Migrated to front matter 2026-08-03** (ticket 14 R3). The old
> header lines carried prose that the schema moves off the status line:
>
> - **status was:** landed 2026-07-26 (cross-host replay verified)
> - **blocked-by line was:** 03 (turn loop), 05 (realm forces exist).

**What to build:** the position substrate the rest of the operational layer stands
on. A field army occupies a place, is ordered to a destination, takes turns and
fatigue to get there, and divides and merges freely. No combat here — 06c owns
that.

Specification gates: Wayfinder 10 (acceptance thresholds), 12 (published).
Authority: **ADR 0043**, **ADR 0045**, war-model-build **WM-④**, and
match-arc **MT-⑥**. Slice-2 spec §3 (movement contract) and §4 (field-army
doctrine) are adopted; read ADR 0043 first, because it records where this slice
departs from §3.

- [x] A field army (and every detachment) holds a **position** on the world's hex graph. `RealmForces.field` stops being a positionless scalar; a realm may hold several detachments at once.
- [x] The **movement graph is hex adjacency ∪ every authored edge.** Measured on `terrain-cradle@r1`: the pure hex graph has two components, 274 hexes (r1–r9) and 18 (r10), because only 15 of 17 edges are hex-adjacent at their endpoints — the two that are not are the `strait` doors into r10, an island. A test asserts a march into r10 finds a path; hex-only pathfinding would reject it as unreachable and look correct doing so.
- [x] A **destination order** produces one route: minimum **cost** on that graph. Pathing is automatic; there is no per-hex order and no hex-by-hex clicking (slice-2 §3, `DOMAIN_MAP` `Position as product` as amended).
- [x] The route is divided into turns by **cost fraction**, not hex count, so a costly turn covers fewer hexes. Under item 8's uniform terrain the two readings coincide; the test states the cost-fraction rule so that authoring terrain later does not silently change behaviour.
- [x] **Redirect is free at any time.** A new destination recomputes the minimum-cost route from the current position. Fatigue already spent is not refunded — no new device, because fatigue is already a spend ledger.
- [x] **March fatigue accrues per hex** — proportional to distance travelled (R13). Only the march ledger is wired here; the convex conversion, the floor, battle accrual and supply belong to 06b, and this ticket must not anticipate them.
- [x] An **unreachable order is rejected**, not silently clamped, and rejection is the Runtime's answer rather than the caller's check (gate 02). **Commit legality is reachability** (R14): a force that can reach a front by resolution time may be committed to it — an army two-thirds of the way and arriving next turn may take next turn's commit now. This **reuses the sealed reach cone** (`reachCone`, BFS to radius `turns × speed`) with a second caller; a second implementation of that radius is a defect, not an optimisation.
- [x] Speed is **3 hexes per turn** and every terrain layer costs **1.0** (R15 items 6 and 8). The terrain cost function is a named seam with a uniform table behind it, because the authored per-hex terrain is a region-painted placeholder (116 of 292 hexes are `plains`) and pricing against it would harden the placeholder into a rule.
- [x] **Forced march** is an explicit toggle whose entire price is fatigue — "the wallet is the fatigue gauge itself; no third resource" (slice-2 §3). It buys extra hexes this turn at a premium rate.
- [x] A march consumes **no 행동력**: no allocation key, no budget draw, nothing in `#allocate` (R12). A test asserts that marching a full-length route leaves the commitment budget untouched.
- [x] **Field armies divide and merge freely** with total preservation: substance is bit-exact across a division, split detachments inherit the parent's fatigue, and merge takes the size-weighted average with a documented round-trip tolerance rather than a claim of exactness. No detachment-count cap (§4: the system prices choices, it does not prohibit them).
- [x] **Substance at a front is the detachment(s) present or arriving there** — being in two places requires division. Derived from §4, not a new rule.
- [x] The grey-box UI shows every own detachment's **current position** and, for one under orders, its destination and turns remaining. Legibility only; ticket 04 owns the real shell.
- [x] Resolution is deterministic for equal inputs and identical across Node and browser hosts.

## Resolved authority batch

**The old value block is paid.** March speed 3 hexes/turn, forced-march premium
3.0, the 2-hex extra cap, and the rest of the fatigue/movement batch were approved
2026-07-26 and landed at `war-model-build/MAGNITUDE.md` WB-M①/WB-M②.

**Two topology rules were absent and are now ruled by the user (2026-07-26):**

1. **Initial field-army hex:** the chosen capital sector's centre-nearest hex.
2. **Authored-edge expansion:** natural hex contact is the link when present;
   otherwise connect the endpoint sectors' nearest hex pair at cost 1. Ties use
   canonical coordinate order.

**Published 2026-07-26:** war-model-build WM-④ and ADR 0045. The canonical
topology contract is now code-ready; `DECISIONS-OWED.md` §1.9 remains the
Working-layer discovery record.

**The recruitment composition conflict is resolved.** MT-⑥ and ADR 0045 now
site every request, preserve province origin, create a not-yet-ready cohort, and
define field destination/affiliation plus the next-turn readiness boundary.
`DECISIONS-OWED.md` §1.10 remains the Working-layer record that exposed the gap.

**Still not owed:** the terrain cost table. R15 fixes it uniform for now, and the
authoring pass that fills it produces a new world revision (`r2`).

## Comments

Two facts found while sizing this ticket, both worth inheriting rather than
rediscovering:

- `sectorAdjacency` was baked into the frozen artifact at ticket 02 **for this
  purpose** — its own comment reads "Sector-level movement, supply, and reach cones
  need it explicit." It is intra-region only; crossing a region border goes through
  an authored edge.
- `turn.ts` case 3 ("one realm vacates as the other enters") was recorded as
  "cannot arise yet — no standalone move command exists" and explicitly deferred to
  "the ticket that gives operations a force to move." **That is this ticket**, so
  the case becomes live here and the enumeration is inherited rather than restarted.

Claim-time evidence (2026-07-26): clean baseline before the blocks —
`verify:game` 119 Node / 15 browser with identical host digests and parity PENDING
by gate 10; root `npm test` 479/479; `lint:docs` 0 blocking / 7 advisory. No
production code was written before the missing rules were found.

## Result — landed 2026-07-26

- `npm run verify:game`: typecheck, Runtime build, viewer build, **149/149 Node**
  and **18/18 browser** tests PASS. Parity remains **PENDING** only because
  Wayfinder gate 10 has not authorized an equality threshold; both observed
  digests are identical: Node `29f214a11fc56ef8`, browser
  `29f214a11fc56ef8`.
- Durable cross-host replay: `browser-lane-0001`, viewer `realm-a`, **26 intents /
  43 actor-safe events**, canonical summary digest `0ca0eb0d6bd4a9d7`. The fixture includes
  recruitment, split, merge, normal movement to `{q:19,r:13}`, and explicit
  garrison-only `detachmentIds: []`; Node and browser compare the same
  viewer-safe summary including detachments, readiness, economy, province
  accounting, and mobilization signals. Relational submit and durable-host tests
  vary hidden opponent recruitment and movement truth without changing the
  viewer's events or summary.
- Focused field-army/recruitment/economy/turn-loop run: **81/81 PASS**, no skips.
  Root regression: `npm test` **479/479 PASS**. Documentation audit:
  `npm run lint:docs` **0 blocking / 9 advisory**; the two advisories above the
  old seven-count baseline are pre-existing `ledgerCurrency` guesses introduced
  before this closeout, and this ticket adds none.
- Ownership boundary retained: **06c owns casualty mutation** — proportional
  loss from `ForceCohort.origins` and the same origin register shares. **06d owns
  capture/register succession** — captured pending cohorts, remaining-civilian
  transfer, departed-recruit preservation, and the no-refund rule. Both consume
  the origin/pending interfaces landed by 06a; neither consequence is fired here.
