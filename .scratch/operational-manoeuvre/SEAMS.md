# Seam register — what the build planted for this pass to answer

Layer: **Working**. An index, never a definition. Every row points at its
birthplace; nothing here is normative.

**Why this file exists.** The build's honest habit is to plant a **named constant
whose comment states it is a consequence of scope, with a pointer to whoever owns the
real answer** — `FULLY_SUPPLIED`, `UNIFORM_QUALITY`, `OPEN_ESCAPE`. The habit was
sound and the pointers had no address, so a seam was only rediscovered by whoever next
read the file. This is the address.

**Duty.** A build ticket that plants a seam belonging to *operational manoeuvre* adds
**or updates** a row here in the same batch. Reading this file is the first act of this
pass. A row may be written *before* its ticket builds — S7 was — and a forward-declared
row must be **re-checked against the code when its ticket lands**, because a prediction
left unverified reads exactly like a fact (see § S7, checked against the landed code).

**Not a debt ledger.** `docs/SYNC-DEBT.md` records obligations; this records *planted
placeholders in code* and the shape a real answer would take. A seam usually has a
debt row too; the two are cross-referenced, not merged.

| # | seam in code | planted by | what it currently says | who owns the real answer |
|---|---|---|---|---|
| S1 | `OPEN_ESCAPE` — `engagement.ts` | 06c (2026-07-28) | escape is the constant `'OPEN'`; M4's derived isolation check is constant in this slice because nothing takes ground and nothing cuts a route | **Encirclement** — Part 2 #2's threshold, D10's isolated-rout multiplier. This pass. |
| S2 | `FULLY_SUPPLIED` — `runtime.ts` | 06b (2026-07-28) | supply is uniform; the supply *predicate* was re-cut out and the arithmetic stays landed and dormant | **R16**, the supply design pass — Supply Interdiction. This pass. |
| S3 | `Edge.frontageHexes` — authored on all 17 edges, read by nothing | the world artifact | a hex-width count, never a cap; **not** M11's frontage value | **Frontage** — M11's caps are 가안-sealed; what is owed is the removal economy. This pass. |
| S4 | `choke.cap` — authored on all 17 edges, read only by `load.ts` validation | the world artifact | labelled a "Projectable-mass ceiling", and `Projectable mass` is ⛔ stale under ADR 0042 — an input to the retired hegemony arithmetic. **Do not read it as the frontage cap** | nobody. Either re-purpose it deliberately or retire the field. This pass decides. |
| S5 | `movementOrderRefusal` — no ownership check, no zone of control | 06a | an army may march through ground it does not hold, without stopping or fighting | **R14** — interception of a force in transit. This pass. |
| S6 | `terrainMovementCost(_layer)` — returns 1 for every layer | 06a | "uniform until the authored terrain revision supplies a real cost table" | the **map re-authoring** row (TC-⑪ froze the grid). Adjacent to this pass; not its work. |
| S7 | the approach arc `MovementApproach {fromHex, toHex}` — `movement.ts`, held in `Runtime.#approachThisTurn` | **06e**, LANDED 2026-07-31 (`d52d664`) | see the S7 note below — **this row was written before 06e existed and described it wrongly** | **directional terrain** (river current, ravine axis, ridge facing) — a parked idea whose seat this is. This pass may open it. |
| S8 | `conquest damage` at identity 1.0 | 06d (planned) | a named seam so a later decision is a value change rather than a redesign | the deferred **snowball-counterweight** session, per ADR 0044 item 6. Not this pass — recorded so it is not confused with one. |

## S7, checked against the landed code — 2026-07-31

Ticket 06e landed (`d52d664`) and this row was **verified against what it actually
built** rather than against what it was predicted to build. Two of the row's three
original claims were wrong, so the corrected reading is written out here rather than
squeezed into a cell.

**What landed.** `MovementApproach { fromHex, toHex }` (`domain/movement.ts`), derived
by `lastSectorCrossing` as **the last step of this turn's traversed prefix whose two
hexes lie in different sectors** — so a force that marched three hexes inside its own
sector has `null`, not an arc. `advanceOneTurn` returns it; the Runtime stores it in
`#approachThisTurn`, a `Map<detachmentId, MovementApproach>` **cleared at the top of
every `#resolveMovement`**.

**Correction 1 — the arc is not read for "which door was crossed".** It is not read
for the door at all. `engagement.ts` builds `doorsBySector` by walking the sector's
`fronts` and takes `softestClass` over them — TC-⑬'s reachable-weakest-link **among
doors**, exactly as sealed, and completely independent of how the attacker arrived.
An interior sector with no door gets `chokeClass: null` and crossing `'none'`.

**Correction 2 — its sole reader is WM-⑤'s rout fall-back.** `Runtime#displaceRouted`
reads `approach.fromHex` as the displaced force's destination, gated by
`#isStandableHex`; no arc, or an unstandable origin, means the force leaves service
instead. That is the only consumer in `game/src`.

**What this changes for the seat.** Two things, and they pull in opposite directions:

- **Better than the row implied** — nothing computes anything *from* the arc's
  direction today, so a directional-terrain term would be purely **additive**. There
  is no existing reading to reconcile with, and TC-⑮ is not endangered by adding one,
  because the defender's ground is chosen without ever consulting the arc.
- **Narrower than the row implied** — the record is **turn-scoped**. It exists between
  movement and resolution within one turn and is then discarded. A directional term
  evaluated at resolution works as-is; anything wanting the arc *later* (a lingering
  bridgehead, a crossing remembered across turns) needs persistence that does not
  exist, and that is a real cost to state before designing.

**A note on the duty above.** S7 was written as a *forward declaration* — the row
existed before the code did. That is useful and should continue, but it means the duty
is "add **or update** a row in the same batch": 06e landed without revisiting S7, and
the row sat wrong for the hours between. Predicted rows should carry their prediction
openly and be re-checked at landing, which is what this section does.

## Rows this pass must *not* treat as seams

- **TC-⑮'s terrain table** is a **seal**, not a placeholder. Its values are 가안 and
  L0-stamped, and M5 carries the `†` playtest flag on `Mountains ×1.5`. Re-cutting a
  value is ordinary re-sealing; re-cutting the *rule* that terrain belongs to the
  ground needs the amendment protocol.
- **WM-⑤'s "all rout survivors leave service"** is a ruling with a registered residue
  (the military/civilian fraction, blocked on a destination). The fraction is a debt,
  not a seam.
