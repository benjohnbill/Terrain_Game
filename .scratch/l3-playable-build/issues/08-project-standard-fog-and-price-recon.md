---
type: task
status: needs-info
blocked_by: []
---

# 08 — Project Standard Fog and Price Reconnaissance

> **Migrated to front matter 2026-08-03** (ticket 14 R3). Held out of that
> day's migration batch because a parallel session was editing this ticket's
> feature; migrated here by that session as it closed, and the
> `TICKET_GRANDFATHERED` exemption in `scripts/audit-lint.js` was deleted in the
> same commit. The old header lines carried prose the schema moves off:
>
> - **blocked-by line was:** 07 — Fall a Capital and End the Match. *(07 is now
>   `resolved`, so the derivation reports this ticket unblocked; it stays
>   `needs-info` for the specification gate below, not for a ticket.)*

**What to build:** Thicken the Runtime's single blur seam from the migration-grade
projection into Standard Fog, and make reconnaissance a real purchase. The land
and everything derived from it is published; only the mutable draw on it is
fogged.

Specification gates: **all resolved.** Wayfinder 03 was already; 10 closed
2026-08-02; **12 closed 2026-08-03**, which is what released this ticket.

> **Unblocked 2026-08-03 (gate 12 batch).** This ticket sat at `needs-info` for
> one reason only — gate 12 had not named the final Production home. It has now,
> and the answer is that **no new integration feature home is created**: the
> Production homes are the existing feature birthplaces, plus **ADR 0049** for the
> Runtime authority and projection boundary this ticket writes against. The
> contract below was already correct; gate 12 confirmed it rather than moved it.
> Ticket 07 is `resolved`, and this ticket carries **no open `DECISIONS-OWED.md`
> Part 2 row** — #1, #4, #5 and #6 all closed 2026-08-03. Status moves
> `needs-info` → `open`.
>
> Two things landed with that batch that this ticket depends on and did not have
> when it was written: **gate 03 invariant 8 now exists** (it was announced by
> ADR 0048 and the edit was dropped — this ticket cited it as binding while the
> gate's list still ended at seven), and **gate 03 invariants 2, 5, 6 and 7 were
> corrected** to the witness model, so following them literally no longer builds
> the model ruling ③ retired.
>
> **The status did not move, and the reason is new.** It was briefly set to
> `open` in this batch on the belief that gate 12 was the last thing holding it.
> A read-only groundwork pass run in parallel found a different blocker
> underneath — see § Groundwork below. `needs-info` stands, on the
> testimony-attachment question rather than on a gate.

**The four seal conflicts that blocked this ticket are CLOSED** —
`DECISIONS-OWED.md` Part 2 #1, #4, #5 and #6, resolved by the 2026-08-03 fog
grill. Do not re-open them from this file.

Contract: **`docs/features/fog-of-war-discovery/RULINGS.md` ③** (the witness
model — what a band *is*, sealed 2026-08-03) and that feature's
**`MAGNITUDE.md` FG-M①** (observation precision and reconnaissance unit prices).
Those two are authoritative; everything below points at them. Also binding:
gate 03 § Answer (what each viewer may know — the **eight**-grade matrix and the
**eight** non-leak invariants, invariant 8 added 2026-08-03); fog `RULINGS.md` ①
(wall grade is public) and ② (read-layer presentation contract, sealed on the
gate-07 live eval — read its 2026-08-03 reason correction); gate 07 § Answer
(three reading layers — free ambient, paid band sharpening, inviolable hole
cards; detection versus measurement; border alarm as a free inner ring;
defensive UI mirrors the offensive one); capital CP-② item 1 (capital location
is public, guard strength is fogged); duel-pivot ledger Gate 6 (irreducible width
= the enemy's this-turn hidden commit); ADR 0048 (why the model is what it is).

**Reconnaissance is designed — read the contract before treating any of it as
open.** An act of reconnaissance deposits an **observation testimony** on the
target sector: an honest but vague interval, stamped with the turn, whose width
is set by the grade bought. It also fixes a tracked army's position and reads the
target's derived 동원 강도 band; the scouted sector's force reading visibly
brightens while its hole cards stay dark. `RULINGS.md` ③ is the model;
`docs/superpowers/specs/2026-07-23-gate07-turn-loop-prototype.md` (user stories
19–22) remains valid for the *presentation* beats and is superseded on the
mechanism — the 0.45 → 0.70 → 0.90 ladder it describes is retired, and 즉시/강화
정찰 is a **grade**, not a separate action.

**Pricing grammar — user ruling 2026-07-25 (`DECISIONS-OWED.md` R2): linear in
commit, freely allocated.** Reconnaissance is not an action with a fixed cost.
Each grade carries a per-sector unit price; the player pours commit from the
single stack, and what they pour converts linearly into how many sectors they
scout. Reconnaissance acquires its information **immediately that turn**.

**Grade prices and the precision each buys are sealed at `MAGNITUDE.md` FG-M①**
(가안, L0, revisit at first playtest). Read them there — this ticket deliberately
does not restate them, and the values it used to carry as conversation are now in
the repository. Unit numbers for fortification, recruitment and supply stay unset
by design.

- [ ] The projection publishes terrain, fortification, routes, current political control, land value and yield, and the register pool; it publishes **no** treasury figure, **no** enemy posture, and **no** enemy commitment.
- [ ] Enemy substance and fatigue appear only as bands; enemy field-army position appears as last-seen plus a reach cone.
- [ ] Every one of the **eight** non-leak invariants holds, and forbidden truth is **absent** from projections, previews, events, secondary panels, and renderer inputs — not visually concealed.
- [ ] **Invariant 8 holds: the projection is not invertible.** No published field or combination of them lets a viewer solve for a value invariant 1 keeps absent. In particular a band's width is a fraction of the **reported** figure, never of the true one.
- [ ] **The true value never enters the projection function.** A band is composed from stored testimony; there is no code path where truth and a viewer projection meet, and no clamp that consults truth to force containment.
- [ ] With no testimony on a sector, the band is bounded by public facts alone and never by the truth; the archive's `0.45` floor is not reproduced.
- [ ] Preview is a pure function of `(view, candidate intent)` with no path to authoritative truth, and the same preview module serves the human UI and, later, the bot.
- [ ] Border alarm gives the defender a free existence-and-direction warning inside its own ring, with paid response remaining a separate purchase.
- [ ] A reconnaissance order spends 행동력 from the same single chip stack, deposits a testimony, visibly narrows the estimate band, changes the situation reading when warranted, and changes the next preview.
- [ ] The shown band always contains the truth: reconnaissance buys precision and never displays a band excluding the true value.
- [ ] Successive scouts behave as noisy witnesses — the band centre wobbles while the width shrinks — rather than as a monotonic zoom onto a fixed point.
- [ ] **Testimony ages by widening, never by becoming false.** An unobserved sector's band re-widens per turn by a bound derived from what could have changed (recruitment rate, casualties, march reach) — not by a decay dial — so a stale reading stops tracking the enemy's current strength. This is 노화 헌법 P3 actually implemented.
- [ ] **A substance band never collapses**: no accumulation of testimony narrows it past FG-M①'s intersection floor.
- [ ] **Free contact intelligence is coarser than the cheapest purchase**, so reconnaissance stays worth buying after first contact.
- [ ] **The testimony history is readable**, summoned on designation rather than always painted, so "it was this, now it is that" is a read the player can make. *(The surface design is deferred — `docs/SYNC-DEBT.md`.)*
- [ ] The enemy's current-turn commitment remains unscoutable and is resolved only at the reveal.
- [ ] The defensive reading surface mirrors the offensive one rather than being a separate one-off panel.
- [ ] Any development-grade disclosure introduced during migration is removed here; the completed path exposes no hidden true state to React or the renderer.

---

## Groundwork — unsealed analysis, 2026-08-03

Produced by a read-only parallel session before this ticket was claimed, and
landed here in the gate 12 batch so it survives: it was written to a scratchpad
outside the repository, which is how this project has lost decisions before. **It
is analysis, not a seal.** Nothing below is authority; two items need a user
ruling and say so.

### G1 — What does a testimony attach to: a sector, or a force? **Blocks this ticket.**

`RULINGS.md` ③ decision 5 derives the ageing envelope from three sealed inputs
with no new dial, and `docs/SYNC-DEBT.md` registers that as reasoned rather than
demonstrated. The pass found it cannot be settled as stated, because a prior
question is unanswered. Both readings fit everything sealed and they compose
differently:

- **Sector-attached** — march speed enters as *mass that can arrive or leave*, so
  the decline bound must permit the whole stock to march out and the band's lower
  edge reaches zero after **one turn**, its upper edge the public register cap
  after three or four (WB-M②: front→front, same realm, median 8 hexes at speed
  3). The band then equals what the player already knew for free: 노화 헌법 P3's
  *decays* has become *vanishes*, and decision 4's trend read has nothing to
  read. Honest, and worthless.
- **Force-attached** — magnitude and position separate; the reach cone keeps
  position and the envelope bounds only how that force's own count changed. March
  speed re-enters as the bound on how much *other* mass could have merged in,
  which is what makes the three named inputs a principled census. This composes —
  at the cost of a new concept, **enemy force identity across observations**,
  which no seal defines and which is not free: "this is the same army I counted
  last week" is itself information, and granting it silently hands the viewer a
  tracking guarantee fog is supposed to price.

**This is a shape question at `RULINGS.md` ③ tier — a user ruling**, not an
implementation choice. Building either reading without it picks one by accident.
Ruling ③ § What this ruling does not settle calls the envelope "an
implementation-time verification"; this finding says that classification is
wrong, and that disagreement is itself for the user to settle.

### G2 — The obvious implementation of the witness model breaks invariant 8

Measured, not argued (`band-probe.js`). Three sealed properties must hold at once
— a testimony contains the truth (③ decision 2), its width is a fraction of the
**reported** figure (③ decision 7), and successive scouts make the centre wobble
— plus FG-M①'s ±5% intersection floor.

Honesty allows the reported figure `r` to sit anywhere in
`[x/(1+w), x/(1-w)]`. Draw it uniformly from that whole range — the natural
reading — and successive intersections converge onto the truth, because the
range's own endpoints pin it:

| scouts (normal, ±25%) | intersection half-width | centre error |
|---|---|---|
| 1 | 25.00% | +32.3% |
| 10 | 2.46% | +2.4% |
| 100 | 0.09% | −0.04% |

By **ten** normal scouts — 20 commit, affordable across a match — the band is
already inside the ±5% floor. Applying the floor by widening the collapsed
interval then yields a band **centred on the true value**: the device installed to
preserve the irreducible sliver hands over the exact figure with decoration. That
is gate 03 invariant 8 violated by its own guard, which is why invariant 8 as
written now says the guard must hold structurally.

**The fix is derivable and adds no dial.** Draw the reported figure from a range
strictly narrower than the honesty-feasible one; the gap between them *is* the
irreducible sliver, so the floor stops being a clamp and becomes a consequence of
the sampling — which is what FG-M① already claims when it says the floor holds
"structurally rather than by a ceiling check". Sweeping the two sealed dials
(`band-probe2.js`): containment at enhanced ±10% allows total deviation up to
9.09%, the ±5% floor binds first, so wobble amplitude is **≤ ~5%** of the reported
figure and the asymptotic half-width at exactly 5% is 5.03%. **The wobble is not a
free parameter** — the ±10% enhanced grade and the ±5% floor jointly determine
it, the same way they already determine the ρ ≈ 1.49 crossover FG-M① records as
emergent. It belongs beside that one as a derived consequence, if the user seals
it.

### G3 — Two oracles that are legal under decision 1

- **An empty intersection proves under-widening.** If the bounds really cover
  every channel, every forward-corrected testimony contains the truth, so the
  intersection is non-empty. Emptiness is detectable without any access to truth
  — a self-check the Runtime can assert on every projection.
- **Containment is testable.** The harness sits outside the projection, so
  `truth ∈ band` for every viewer, sector and turn across a full match can be
  asserted in tests. Decision 1 forbids truth entering the *projection function*,
  not the test that audits it.
