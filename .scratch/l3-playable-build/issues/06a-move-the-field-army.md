# 06a — Move a Field Army

**What to build:** the position substrate the rest of the operational layer stands
on. A field army occupies a place, is ordered to a destination, takes turns and
fatigue to get there, and divides and merges freely. No combat here — 06c owns
that.

**Blocked by:** 03 (turn loop), 05 (realm forces exist).

Status: ready-for-agent, except item 8's value — see § Needs-info.

Specification gates: Wayfinder 10 (acceptance thresholds), 12.
Authority: **ADR 0043** + `DECISIONS-OWED.md` R12–R15. Slice-2 spec §3 (movement
contract) and §4 (field-army doctrine) are adopted; read ADR 0043 first, because it
records where this slice departs from §3.

- [ ] A field army (and every detachment) holds a **position** on the world's hex graph. `RealmForces.field` stops being a positionless scalar; a realm may hold several detachments at once.
- [ ] The **movement graph is hex adjacency ∪ every authored edge.** Measured on `terrain-cradle@r1`: the pure hex graph has two components, 274 hexes (r1–r9) and 18 (r10), because only 15 of 17 edges are hex-adjacent at their endpoints — the two that are not are the `strait` doors into r10, an island. A test asserts a march into r10 finds a path; hex-only pathfinding would reject it as unreachable and look correct doing so.
- [ ] A **destination order** produces one route: minimum **cost** on that graph. Pathing is automatic; there is no per-hex order and no hex-by-hex clicking (slice-2 §3, `DOMAIN_MAP` `Position as product` as amended).
- [ ] The route is divided into turns by **cost fraction**, not hex count, so a costly turn covers fewer hexes. Under item 8's uniform terrain the two readings coincide; the test states the cost-fraction rule so that authoring terrain later does not silently change behaviour.
- [ ] **Redirect is free at any time.** A new destination recomputes the minimum-cost route from the current position. Fatigue already spent is not refunded — no new device, because fatigue is already a spend ledger.
- [ ] **March fatigue accrues per hex** — proportional to distance travelled (R13). Only the march ledger is wired here; the convex conversion, the floor, battle accrual and supply belong to 06b, and this ticket must not anticipate them.
- [ ] An **unreachable order is rejected**, not silently clamped, and rejection is the Runtime's answer rather than the caller's check (gate 02). **Commit legality is reachability** (R14): a force that can reach a front by resolution time may be committed to it — an army two-thirds of the way and arriving next turn may take next turn's commit now. This **reuses the sealed reach cone** (`reachCone`, BFS to radius `turns × speed`) with a second caller; a second implementation of that radius is a defect, not an optimisation.
- [ ] Speed is **3 hexes per turn** and every terrain layer costs **1.0** (R15 items 6 and 8). The terrain cost function is a named seam with a uniform table behind it, because the authored per-hex terrain is a region-painted placeholder (116 of 292 hexes are `plains`) and pricing against it would harden the placeholder into a rule.
- [ ] **Forced march** is an explicit toggle whose entire price is fatigue — "the wallet is the fatigue gauge itself; no third resource" (slice-2 §3). It buys extra hexes this turn at a premium rate.
- [ ] A march consumes **no 행동력**: no allocation key, no budget draw, nothing in `#allocate` (R12). A test asserts that marching a full-length route leaves the commitment budget untouched.
- [ ] **Field armies divide and merge freely** with total preservation: substance is bit-exact across a division, split detachments inherit the parent's fatigue, and merge takes the size-weighted average with a documented round-trip tolerance rather than a claim of exactness. No detachment-count cap (§4: the system prices choices, it does not prohibit them).
- [ ] **Substance at a front is the detachment(s) present or arriving there** — being in two places requires division. Derived from §4, not a new rule.
- [ ] The grey-box UI shows every own detachment's **current position** and, for one under orders, its destination and turns remaining. Legibility only; ticket 04 owns the real shell.
- [ ] Resolution is deterministic for equal inputs and identical across Node and browser hosts.

## Needs-info

**One value, and it is an approval rather than an origination.** March speed 3
hexes/turn, forced-march premium 3.0 per extra hex, and the 2-hex extra cap all sit
in `DECISIONS-OWED.md` **Part 3** — values already running in the archive that no
document records. The gate C measurement showed 3 transplants (reinforcement 1–2
turns, invasion 2–3, lateral redeployment 3–4 on this board), so what is owed is
the Part 3 bulk approval, not a new number. Approving it also settles the reach
cone's radius, so it is a fog dial for ticket 08 at the same time.

**Not owed:** the terrain cost table. R15 fixes it uniform for now, and the
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
