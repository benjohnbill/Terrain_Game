# Conquest Growth Engine — §5 Resolution Design (DT-②)

Date: 2026-07-10
Status: DESIGN (brainstorm sealed with user 2026-07-10; feeds writing-plans)
Feature: match-arc (§5 growth engine, DT-②) · touches combat-calc L2 harness
Predecessors: RULINGS DT-①/DT-②/DT-③; ADR 0022 (usable-value model); SPEC
principle #1 (land-derived) + fun-pillar #3 (skill-snowball) + Design Guardrail
(conquest ≠ instant full transfer).

## 1. Problem — conquest's growth was never in L2

The L2 tournament world is effectively **zero-sum, and therefore frozen**. An
earlier measurement located the freeze at the hegemony *leadership gate* (~99%
of matches fail it): no realm's army ever grows far enough past its rivals to
trip a decision. The mechanical root is that a realm's **military ceiling
(`fieldCap`) is fixed for the entire match**:

- `capPerSector: 0` in the harness — conquest transfers land, pool, and yield,
  but does **not** raise the conqueror's ceiling ("cap growth is A-3's
  undesigned seat", per the dial's own comment).
- ADR 0022's reduced-usable ripening (below) was **never wired** into the L2
  harness; `econ.js`'s sector model is not connected to the tournament either.

So conquest today is a one-shot redistribution that costs permanent blood — net
non-positive — which is exactly why the world sits at a deterrence equilibrium.
The **compounding growth** that turns a lead into an accelerating advantage —
the engine DT-② describes — is simply absent.

## 2. Goal & scope

Make conquest a **+EV, skill-bound growth action** so balanced boards resolve
*emergently* (DT-②) and matches land in the DT-① envelope (decisions at turns
18–22). Realize the growth by **wiring an already-sealed mechanism (ADR 0022),
not by inventing new rules**.

- **In scope:** the conquest growth engine — conquest raises the military
  ceiling, lagged.
- **Deferred:** peaceful *development* as a second growth path (DT-②'s "turtle
  niche"). Revisit only if this pass's L2 read is poor or shows the leader
  over-stomps (per the earlier scope decision — build the conquest spine first,
  measure, then decide if development is even needed).

## 3. Design

### 3.1 The engine — cap grows with land (Model A)

The military ceiling is **proportional to the land a realm holds**
(SPEC #1, land-derived state). Conquest raises the ceiling because land arrives;
loss lowers it because land leaves. This is the steady-state relationship
`fieldCap ∝ Σ held land`. The freeze breaks because a successful aggressor can
now field an army past its rivals and reach the leadership gate.

### 3.2 Immediate vs lagged (ADR 0022, verbatim)

ADR 0022 already splits a captured sector's value exactly the way DT-② wants:

- **Immediate — control + route.** The sector is yours on the map, the front is
  redrawn (`inheritFronts` opens borders with the loser's other neighbours), and
  you can march/threaten the next target. This is DT-②'s **immediate strategic
  payoff** (reach / pressure / opened doors).
- **Lagged — all productivity.** A newly acquired sector starts at **50% usable
  economy** and **60% usable population**, recovering **+10 percentage points
  per stable, non-contested turn**. Both the **yield** (from economy usable) and
  the **military ceiling contribution** (from population usable) ripen together.
  This is DT-②'s **lagged economic payoff**.

The lag is a **transient (~4 stable turns of catch-up)**, not a change to the
steady-state `cap ∝ land`. Right after a conquest a realm sits temporarily below
its land-proportional ceiling and climbs to it. That catch-up window is the
**contestability** the design needs: one win does not instantly compound, so the
opponent has turns to counterattack. This transient is what honours both the
**Design Guardrail** ("control changes immediately, economy/population/garrison
may lag") and **fun-pillar #3** (the snowball is bound to skill — you must keep
reading and winning to convert a lead — not to raw state).

### 3.3 Uniform across acquisition paths

The ripening applies **uniformly** to all acquired land, whether taken by
occupation grinding or by **settlement cession** (the game's main transfer
path). Settling stays strictly incentivised without an "arrives intact" bonus:
the `Settlement` definition's own point is converting a decided war into gains
*without occupation grinding* — the reward is the **blood and turns you don't
spend**, not undamaged land. Keeping ripening uniform is the simplest and fully
consistent rule.

### 3.4 The +EV source is opportunity, not stockpiling

Conquest is +EV not because a 1v1 land exchange is positive (it is roughly
zero-sum minus blood), but because a good conquest **opens a new profitable front
against a third realm** (step 3 of the flow: beat A → border a weakened B → press
B). The lagged growth is the **fuel** for that tempo, not the snowball itself.
This keeps the engine on the skill side of fun-pillar #3.

## 4. The resolution dial

DT-②'s resolution dial is the **ripening speed** — the {start fraction,
recovery-per-turn} pair, plus the **magnitude** of cap gained per unit land
(`capPerSector`). ADR 0022's placeholder values (economy 50% / population 60%
start, +10pp/stable turn) are the **initial values**; they are playtest-tunable
and get swept against the timing ruler.

- Too fast / too much → old self-fuelling snowball, early stomp, guardrail breach.
- Too slow / too little → the freeze persists (benefit never arrives).
- Target: the setting where decisions land **18–22** (DT-① core) with the
  envelope rising toward the ≥~50% first checkpoint and no early stomp.

## 5. Harness realization (measurement fidelity)

The L2 harness has no per-sector usable (only an aggregate `interior` count and a
realm-level `usable` scalar). Rather than add full per-sector state, model the
essential behaviour with a **pending-capacity ripening accumulator** per realm:

- On acquiring land, the gained **ceiling contribution** enters at its reduced
  start (60% for the population/cap axis) and climbs **+10pp per stable turn** to
  full; loss of land drops the ceiling **immediately** (destruction is fast,
  integration is slow — mirrors the raid/blood asymmetry already in the model).
- `fieldCap = ripened(held land)` — i.e. base ceiling from long-held land plus
  the current value of the ripening bucket.
- The **cap axis is load-bearing** for the freeze; the **economy/yield axis
  ripens too** (start 50%) for consistency with Position 1, reusing the existing
  `usableRecovery` +10pp/turn cadence.
- `capPerSector` moves from 0 to the swept magnitude (both directions on land
  transfer — the seat is already symmetric).

This captures "fresh land ripens into force" without per-sector bookkeeping,
which is the right fidelity for an L2 measurement rig.

## 6. Documentation changes owed (ADR-level, user-sealed)

The `DOMAIN_MAP` `Settlement` entry currently says ceded territory "arrives
*alive* (undamaged usable value)". That line is a **stale exception** that
conflicts with ADR 0022 (captured land starts reduced), the Design Guardrail,
and DT-②. Resolve by:

- Correcting the `DOMAIN_MAP` line so "alive" means **undamaged** (no scorch),
  while the **integration lag** (ADR 0022 ripening) applies to all acquired land
  including settlement cession.
- Recording the reconciliation as an **ADR** (amend ADR 0022 or a new ADR) with
  the supersession stamp required by the documentation law. User seal required
  before the DOMAIN_MAP edit lands.

## 7. Measurement plan

1. Build the accumulator + turn on `capPerSector`; keep all non-growth behaviour
   byte-identical when the growth is off (guarded), so control runs are clean.
2. Sweep the dial — {`capPerSector` magnitude} × {ripening start / speed} — and
   read the timing ruler per arm: **envelope%(15-25)**, **core1822%**,
   **median tripTurn**, and the **normality** read (mean ± std / hist).
3. Guardrails on the read: **~0% early stomp (trip ≤ ~turn 8)** and no
   over-stomp; watch the fgM9off median (it moved 19→17 after §6 — the growth
   must not push it further below the 18-22 core).
4. Record before/after. If the read is good, **reconsider whether development
   is needed at all** (the earlier conditional).

## 8. Out of scope (do not build here)

- Peaceful **development** as a second growth path (deferred, §2).
- Settlement bundle **re-pricing** (관대/표준/최대 values).
- Full **per-sector usable** fidelity (the accumulator is the L2 stand-in).
- Any change to `unassailable`, the leadership/dominance gate (that was §6/DT-③),
  or blood/register accounting.

## 9. Open questions (resolved by the measurement)

- The `capPerSector` magnitude and the exact ripening start/speed that land 18–22.
- Whether the economy-axis ripening needs its own start value (50%) in the
  harness or can share the cap-axis schedule for simplicity.
- Whether the leader over-stomps once the engine is on (→ would un-defer the
  development counterweight / an exposure-brake tune).
- Whether "peaceful development" must be built at all (revisited post-read).
