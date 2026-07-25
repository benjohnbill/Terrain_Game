# 06 — The Operational Layer (re-cut index)

**RE-CUT 2026-07-26 by Wayfinder gate C. This file no longer carries acceptance
items; it is the index for 06a–06d.** Do not implement against this file.

Status: re-cut (superseded by 06a, 06b, 06c, 06d)

## Why it was re-cut

The original ticket carried twelve acceptance items spanning the whole slice-2
operational layer **plus** the slice-1 combat core — a surface the reference
archive built across eleven tickets. It was also blocked on two kind-1 seal
conflicts, `DECISIONS-OWED.md` Part 2 **#14** and **#15**, both of which are now
closed by gate C (rulings R12–R17, ADR 0043 + ADR 0044).

Closing #14 did not unblock the ticket; it revealed that the missing piece was
**upstream of combat**. The landed turn loop resolves a front from committed chips
alone (`readFronts`), while the sealed battle formula is
`substance × commit lever × quality × fatigue` — so no rule said how *substance*
reaches a front. A field army had no position at all. Combat cannot be built on
top of that gap, which is why the movement substrate is now its own ticket and
comes first.

## The cut

| Ticket | What it builds | Blocked by |
|---|---|---|
| **06a** | Move a field army: position, the movement graph, destination orders, division and merge | 03, 05 |
| **06b** | The fatigue and supply dual ledger | 06a |
| **06c** | Resolve the decisive battle | 06b |
| **06d** | Capture a sector and integrate it | 06c |

Ticket **07** (capital fall) is blocked by **06d**, not by this file: R1 makes a
capital fall an ordinary sector capture, so the capture path must exist first.

## Shared contract (all four inherit)

- `docs/adr/0043-operational-layer-movement-position-and-reachability.md` —
  position, the price of a march, reachability legality.
- `docs/adr/0044-conquest-integrates-on-the-ripening-lag.md` — what a captured
  sector pays, and when.
- `DECISIONS-OWED.md` § Rulings received 2026-07-26 (gate C) — R12–R17 in full,
  with the measurements and the two retractions.
- `docs/features/combat-formula/FORMULA.md` D1–D11 · `MAGNITUDE.md` M1–M14 ·
  `docs/features/war-model-build/` RULINGS WM-①/WM-② · the slice-2 design spec
  `docs/superpowers/specs/2026-07-14-slice2-operational-layer-design.md` §0–§13 ·
  ADR 0015 (river crossing prices the engagement, not the march) · ADR 0032.

## Shared hygiene (all four inherit — the original items 11 and 12)

- [ ] No retired mechanism is invoked: no stage conveyor, no bot stall timer, no per-front uniform-defense placeholder, no legacy victory check, no settlement terminus (ADR 0042).
- [ ] Behavior carried forward from the archive is classified (accepted / superseded / incidental) before use, and replacement tests cover only what is deliberately carried. **Re-implementation, not translation (ADR 0041)**: `js/battle.js`, `js/fatigue.js`, `js/movement.js`, `js/field-army.js`, `js/commit.js`, `js/intel.js` are evidence to verify against, never modules to import or files to port line by line. The archive is not a parity comparator for behavior it never ran.
