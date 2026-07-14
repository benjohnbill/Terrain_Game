# 02 — Movement contract + supply connectivity (이동 계약 + 보급 연결)

**What to build:** Armies gain positions on the authored world's hex graph
(terrain-cradle geometry). The player issues a destination order; pathing is
the automatic shortest passable route at a constant speed of S map units per
turn (가안) — no per-hex micromanagement, preserving one judgment per turn.
Each map unit entered feeds the march accrual of the fatigue gauge (ticket
01). A forced march (강행군) toggle on the order buys up to k extra map units
this turn at a premium fatigue cost per extra unit — the wallet is the fatigue
gauge itself, and no separate combat penalty exists because arrival fatigue
already prices the R sacrifice. A route-connectivity predicate answers
"is this force supplied?" (path to friendly base through passable, controlled
ground), feeding ticket 01's supply ledger. Water crossings keep their sealed
event tax (crossing penalties); wear counts only length.

Authoritative design: slice-2 design spec §3 (movement), §2 (accrual hookup).

**Blocked by:** 01 — Fatigue core.

**Status:** landed (2026-07-15, `js/movement.js` + `tests/movement.test.js`,
forced-march seam added to `js/fatigue.js`, two-axis review passed, suite green)

- [x] Deterministic shortest-path orders on the authored graph; impassable
      terrain respected (absence from every sector IS impassability); speed S
      constant.
- [x] Demo scenario: an army marches across the real map (하북→중원) and its
      gauge falls per the ticket-01 curve.
- [x] Forced march: arrives earlier AND more fatigued than the normal march
      of the same route; premium accrual only on the extra units.
- [x] Supply predicate flips when the route is cut (interdiction / lost
      corridor) and restores when reopened; feeds the ticket-01 pump.
- [x] No new combat penalty anywhere in the forced-march path.

**Implementation rulings (flagged, open for the magnitude pass / user):**

1. Supply start-hex exemption — the army's OWN hex is exempt from the control
   test (it occupies the ground it stands on), so an army in enemy/contested
   territory can still trace supply out through friendly ground. Every hex it
   draws THROUGH must be friendly, and a base is the source, so a base counts
   only while friendly-held — standing on a captured base is not supply.
2. Unreachable destination / base — a march order to an unreachable
   destination is rejected (`marchStep` → null, nothing moves) rather than
   partially executed; an unreachable friendly base yields "unsupplied". Both
   are the minimal non-inventing choice; a game loop may later prefer a
   partial-advance or nearest-reachable policy.

**Boundary (checked, not owed here):** the ADR 0015 water-crossing event tax
is NOT fired by movement — march wear counts only length (spec §2 tax map: one
event, one target, one tax), and the crossing penalty taxes the crossing
*event* in its existing owning layer (engagement). `buildGraph` is deliberately
border-class-blind at hex resolution; wiring the crossing event to its consumer
belongs to a later ticket (engagement v2 / board verbs), not this movement
contract.
