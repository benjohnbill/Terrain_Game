---
type: task
status: needs-info
blocked_by: [07]
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

Specification gates: Wayfinder 03 (resolved), 10 (resolved 2026-08-02), 12.

**Still `needs-info` for one reason only: Wayfinder gate 12** (spec partition),
whose own constraint is that a ticket "cannot become `ready-for-agent` until it
cites the final Production home that closes every specification gate." That home
now exists — see the contract below — but naming it as final is gate 12's call,
not this ticket's. Gate 12's blockers are all resolved and the lint reports it
takeable.

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
