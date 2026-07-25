# War-Model Build — Operational Dial Sheet

The **owning model doc** for the slice-2 operational layer's dials: fatigue,
movement, and supply. Per the documentation law, a feature's dials live in exactly
one model doc and every other surface references by pointer — so these numbers are
authoritative here and nowhere else.

Created 2026-07-26. It did not exist before, which is why these dials had no
birthplace: the slice-2 design spec **names each one by number and leaves the value
blank** ("dial 1", "dial 6"), the archive filled them in during implementation, and
nothing brought them back to a document. `docs/SYNC-DEBT.md` carried that as a debt;
this file pays it.

Shape authority stays with the slice-2 design spec
(`docs/superpowers/specs/2026-07-14-slice2-operational-layer-design.md` §2–§3) and
with ADR 0043 where gate C amended it. **This file owns values, not shapes.**

---

## WB-M① — Fatigue, movement and supply dials — APPROVED 2026-07-26 (user, Part 3 bulk batch) · L1

Verdict source: user bulk approval, 2026-07-26, following Wayfinder gate C. The ask
was framed as **confirm-or-edit against the running values**, never origination — the
`DECISIONS-OWED.md` Part 3 premise is that these already determine how the game
behaves and had never been seen.

**L-stamp L1, and the reason matters.** These values were *exercised* inside the L2
harness — the slice-2 metrics runs executed every one of them — but they were never
the **subject** of a sweep, so no measurement chose them. The trust is "it ran and
produced plausible behaviour", not "it was measured against a target." They are
therefore playtest-provisional: expect L3 to move several.

| Dial | Name | Value | Notes |
|---|---|---|---|
| 1 | march accrual per hex | **1.0** | Per hex, not per turn — gate C ruling R13 sealed the basis: fatigue is proportional to distance travelled. |
| 2 | forced-march premium | **3.0** | Multiplier on the accrual rate for each hex beyond speed S. |
| 2 | forced-march extra-hex cap (k) | **2** | Hexes allowed beyond S on a forced march. |
| 3 | battle fatigue coefficient | **40** | Ledger added per unit of own-casualty fraction. |
| 6 | effectiveness floor | **0.5** | **Sealed anchor, not a 가안** — see the stamp below. |
| 6 | conversion convexity exponent | **2.0** | Accelerating penalty: `1 − (1 − floor) × depth^exp`. |
| 6 | conversion terminal ledger | **10** | Ledger depth at which the floor is reached. |
| 4 | supply pump per cut turn | **1.0** | The supply ledger counts cut turns. |
| 5 | starvation entry threshold | **2** | Supply-ledger depth that opens the starvation state. |
| 7 | starvation loss coefficient | **0.02** | With the exponent below: `min(1, coef × excess^exp)`. |
| 7 | starvation loss exponent | **2.0** | |
| 8 | recovery base rate | **2.0** | Per turn at full supply. |
| 8 | recovery supply-curve exponent | **1.0** | 1.0 = recovery is linear in supply level. |
| — | march speed S | **3 hexes/turn** | See WB-M② — it earns its own row. |
| 9 | recovery requires standing still | **HELD** | *Not* approved, because it is not a value. See the rider. |

### Rider — the ×0.5 floor is a stamp, not a ruling (pays `DECISIONS-OWED.md` Part 2 #11)

Part 2 #11 recorded a conflict: the slice-2 spec calls the ×0.5 effectiveness floor
a 가안 in one place and a "sealed anchor" 72 lines later. **Both sides state the same
number**, and the archive's own comment agrees — "the ×0.5 floor is the sealed
anchor (M9-consonant); every other number is a placeholder." So this was never a
ruling to make, only a stamp to pay. **Paid here: ×0.5 is SEALED (M9-consonant),
and it is the curve's terminal point rather than a tunable.**

### Rider — dial 9 stays HELD, deliberately

Whether fatigue recovery additionally requires a force to stand still is marked HELD
in both the spec (§12) and the archive (`RECOVERY_REQUIRES_STATIONARY = false`).
Implementing either answer would **originate a rule**, which the build's four-kind
workflow forbids the agent. The archive's `false` is the absence of the condition,
not a decision that it should be absent. Ticket 06b wires recovery so that adding
the condition later is a value change rather than a redesign.

### Rider — no capability inversion, ever

The §2 firewall: the ground gates **wear and recovery only**, never substance;
starvation removes men and stays supply-exclusive. No combination of these dials may
make a force stronger than its rested, supplied self. This is a shape constraint that
survives any re-cut of the numbers above.

## WB-M② — March speed 3 hexes/turn — APPROVED 2026-07-26 (user, Part 3 bulk batch) · L2

Speed gets its own seal because it is **measured**, not merely exercised, and
because it is simultaneously a fog dial: the reach cone's radius is `turns × speed`
(ADR 0043 item 5), so this row sets how far an unobserved enemy might have gone.

Measured on `terrain-cradle@r1` during gate C, with terrain cost uniform at 1.0:

| Operational distance | median | p75 | at speed 3 |
|---|---|---|---|
| own depth → own nearest front (reinforce) | 3 | 5 | **1–2 turns** |
| own front → enemy sector (invade) | 5 | 7 | **2–3 turns** |
| front → front, same realm (redeploy) | 8 | 10 | **3–4 turns** |

Fast local response against genuinely costly lateral redeployment is the spread that
makes being in the wrong place hurt. Speed 2 pushes redeployment to 4–5 turns
(punitive); speed 4 drops it to 2–3 and position stops mattering.

**A retraction is recorded with this seal.** `DECISIONS-OWED.md` Part 2 #14 claimed
the dial "does not transplant", reasoning that 3 hexes/turn cannot cross a median
5-hex sector in a turn. The 5 was right — that is sector **size** — but a march
crosses sector **spacing**, and adjacent sectors are a median of **2** hexes apart
centroid-to-centroid (1/2/3/5 over 84 intra-region pairs). The inference from area to
spacing was the error. Speed 3 transplants.

### Rider — terrain cost is uniform 1.0, and that is a dated condition

Gate C ruling R15 item 6: the authored per-hex terrain is a **region-painted
placeholder** — whole regions carry one layer, which is why 116 of 292 hexes are
`plains`. Pricing movement against it would harden the placeholder into a rule. The
cost function is a named seam with a uniform table behind it, and the real table
lands with the terrain-authoring pass, which produces a new world revision (`r2`).
TC-⑪ froze orientation and resolution, **not** terrain values.

### Rider — the movement graph is not the hex graph

Measured during gate C: the pure hex graph has **two components** — 274 hexes
(r1–r9) and 18 (r10) — because only 15 of 17 authored edges are hex-adjacent at
their endpoints. The two that are not are both `strait`, and both are the doors into
**r10, an island**. The movement graph is therefore hex adjacency **∪** every
authored edge. Full note: ADR 0043 § Decision item 7.

---

## Not owned here

- **Combat resolution magnitudes** — `../combat-formula/MAGNITUDE.md` (M2 lever
  curve, M4 convexity and rout, M5 terrain and fortification, M7 thresholds).
  Nothing in this file restates them.
- **Delaying-defence bands** — `../operation-plan-catalog/CATALOG.md`, the owning
  model doc for plan-shaped values.
- **Realm economy** — `../combat-formula/MAGNITUDE.md` M13/M13a/M14 and match-arc
  MT-②/MT-③.
- **Bot policy values** — approved in the same 2026-07-26 batch but with no
  birthplace yet; ticket 12 owns them. Tracked in `docs/SYNC-DEBT.md`.
- **Fog band shape** — excluded from the batch by Part 3's own precondition: those
  four constants conflict with `../combat-formula/MAGNITUDE.md` M8 (Part 2 #5), and
  Part 3 states they "cannot be approved until that resolves."
