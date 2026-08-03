# ADR 0050: A Testimony's Subject Is Set by Mobility — Force for What Moves, Sector for What Does Not

Date: 2026-08-03

Status: Accepted

Decision source: user grill, 2026-08-03, opened on the blocker that ADR 0048 and
fog `RULINGS.md` ③ both left standing and `docs/SYNC-DEBT.md` registered as a
user ruling owed. The full ruling with its reasons is
`docs/features/fog-of-war-discovery/RULINGS.md` ④; the one derived value is
`docs/features/fog-of-war-discovery/MAGNITUDE.md` FG-M①. This ADR records the
cross-feature decision and restates neither.

- Relationship:
  - **Amends ADR 0048** § Consequences on two points, both stamped there: the
    per-viewer state it introduced is keyed by **subject**, not uniformly by
    sector; and its forward-correction bullet classified the composition check as
    an implementation-time verification while that check was still consuming an
    unnamed input. The decision ADR 0048 records is untouched.
  - **Completes fog `RULINGS.md` ③.** That ruling settled what a testimony is and
    left what it is *about* unstated. All nine of its decisions stand; decision 3
    gains a scope.
  - **Confirms ADR 0041 §2.** The reference archive turned out to have built the
    position half force-attached already (`js/intel.js` keys intel records per
    detachment). That is evidence for the shape and was not treated as authority
    for it.
  - **Confirms ADR 0047.** Sector-origin population accounting is what makes the
    immobile half of this decision true: a serving body keeps its sector origin
    wherever it is standing, so a sector's mobilization reading cannot march away.
  - Not amended, checked and stated so the next reader does not re-check:
    **ADR 0019** (its province-level relational threat reads a sector-attached
    observable and is unaffected — see § Consequences), **ADR 0043** (movement is
    the *cause* of the distinction, not a party to it), and **ADR 0046** (the
    sector stays the decisional atom; this decision does not make the force one).

## Context

ADR 0048 made a viewer's estimate a record of observations. It did not say what
an observation is a record *of*, and the gap was invisible because the two halves
of the model hide it from each other.

**Position never had to answer.** A reach cone is a last-seen fix widened by
elapsed time; it is never reconciled against a later sighting, so it can be
honest without naming its subject. **Magnitude cannot.** Ruling ③ decision 3
makes testimonies accumulate and *intersect*, and an intersection is only defined
once you know two observations concern the same thing.

A read-only groundwork pass measured both candidate readings before this grill
opened (`.scratch/l3-playable-build/issues/08-…md` § Groundwork G1):

- **Sector-attached** forces the decline bound to permit the whole stock to march
  out, so the band's lower edge reaches zero after **one** turn and its upper edge
  the public register cap in three or four. After four turns the band equals the
  free prior. 노화 헌법 P3 says the mutable layer *decays*; this makes it
  *vanish*, and the trend read ADR 0048 was sold on has nothing left to read.
- **Force-attached** composes, at the cost of a concept no seal defines — enemy
  force identity across observations — which, granted silently, hands the viewer a
  tracking guarantee fog exists to price.

The grill found the recorded either/or was a **false dilemma**, and that
force-attachment on its own is unsafe. Division in the Runtime is free: no commit
cost, no fatigue cost, no per-turn cap, gated only by the commit lock. A testimony
that survives an unseen division either stops containing the truth — the one thing
ADR 0048 forbids — or needs a decline channel wide enough to reach zero every
turn, which is the sector-attached failure by a different road.

## Decision

**What a testimony attaches to is decided by whether its subject can move.**

| Observable | Moves | Attaches to |
|---|---|---|
| Field-army substance · field-army fatigue | yes | the **force** |
| Garrison substance · 동원 강도 · civilian register | no | the **sector** |
| 판세 | — | the **realm**, at match level |

Four consequences ride with it, sealed in the same grill and recorded at
`RULINGS.md` ④ decisions 2–7:

1. **A division weakens a testimony rather than killing or preserving it** — the
   count stays true of the aggregate, the attribution is what is lost.
2. **Identity across observations is free only under unbroken contact.** One
   unobserved turn cuts the chain; a later sighting is a new contact the Runtime
   never joins to the old one.
3. **The census the player assembles is an evidence contrast, never a computed
   remainder.** The Runtime aggregates the sector side, refuses to sum the force
   side, and shows its coverage. Where that contrast is surfaced is
   `DECISIONS-OWED.md` Part 2 #13, not this ADR.
4. **The dealer does not spend all of its precision.** A reported figure is drawn
   from a range narrower than honesty permits, and the margin is the intersection
   floor. Value at FG-M①; no new dial.

**Why this is architecture rather than a feature ruling.** It changes the key of
the state ADR 0048 introduced — a per-viewer record per *sector* becomes a record
per *subject*, and for the mobile half that subject is a force with a lifetime,
a division event, and a contact clock. Every consumer of a projection is affected:
the combat preview, the 판세 read, the bot (which by contract sees exactly what a
player sees), and the commit-first UI shell, which must render two kinds of object
that age differently or the model reads as a defect.

## Consequences

### What this unblocks

- **Build ticket 08 leaves `needs-info`.** It was held on this question alone once
  Wayfinder gate 12 closed, and it is the only build ticket with a clean conflict
  slate.
- **ADR 0048's composition check becomes performable.** With the subject named, the
  immobile observables have no march-out channel at all and the mobile ones need
  the envelope for one turn at a time under observation — never for an unseen
  division, because a watched division deposits fresh testimony.

### What it costs

- **Two kinds of object on the map, and they must not be confused.** A sector card
  holds its position while its figure blurs; a force marker holds its figure while
  its cone spreads. If the player reads a force marker as a property of the sector
  under it, the evidence contrast reads as a bug. This lands as an acceptance
  condition on build ticket 04.
- **Tracking becomes a recurring purchase.** Because the sealed knowledge matrix
  carries no adjacency grade, unbroken contact means paying again each turn, and
  the price scales with the target's mobility. That is the intended economy, but it
  means an enemy army adjacent to your own is not visible for free — a consequence
  no seal has examined, registered for the first playtest.
- **The Runtime must model force lifetime in the viewer's records**, including
  what a division does to a testimony chain it can see and to one it cannot.

### What it sharpens

- **Conservation becomes readable.** The same army cannot stand in two sectors, so
  accounted mass has a ceiling the public register pool sets and "how much is
  unaccounted for" becomes a question with an answer. Sector-attached substance
  gave independent intervals whose upper edges summed past anything the opponent
  could hold.
- **Manoeuvre becomes an instrument of deception rather than a laundry.** An
  opponent who divides inside a blind spot leaves the viewer holding a stale count
  and a fresh one that do not reconcile — attrition and division both fit, and the
  dealer said nothing false. This is ruling ②'s disposition arriving as a play.
- **ADR 0019's relational threat is unaffected, and this is why.** Its
  province-level 위협 reads *estimated force* per place, which looked like a
  conflict with force attachment; it is not one, because the place-level
  observables (동원 강도, civilian register, garrison) are sector-attached in their
  own right rather than sums of force counts. The two levels have separate
  observables, so neither is derived from the other.
- **The knowledge matrix's grade for enemy substance stops naming retired
  constants.** Wayfinder gate 03 § 4 labelled it `[0.45, 0.90]` — the archive
  ladder ruling ③ retired. Corrected in this batch alongside the attachment note.
