---
type: task
status: needs-info
blocked_by: [08]
---

# 09 — Build the EVAL BAR

> **Migrated to front matter 2026-08-03** (ticket 14 R3). The old
> header lines carried prose that the schema moves off the status line:
>
> - **blocked-by line was:** 08 — Project Standard Fog and Price Reconnaissance.

**What to build:** The game's signature read organ. A subjective tactical
confidence **band** — position plus width — computed from the player's own fogged
estimate of the decisive engagement, with an equal-commit baseline, a live marker
at the player's chosen commit, and operation-plan threshold needles. Two vertical
bars: **LEFT** = the clicked front's R, **RIGHT** = this action's average across
eligible fronts.

**Code answering that description is already on `main`, and it did not arrive
through this ticket** (recorded 2026-08-04). The 2026-08-03 submission lane built
`game/src/ui/eval-r.ts` (254 lines) and runs two diverging eval bars inside the
demo shell — committed at `45170fd`, merged at `9a17cb3`, written under deadline
and unreviewed on this repo's two axes. The disposition is the same as ticket
04's: whether it is this ticket's deliverable or a probe to replace is the user's
scoping call, registered in `docs/SYNC-DEBT.md` § Open. The front matter is
correct as it stands — ticket 04's note says why.

**Ruled 2026-08-05 with ticket 04: merge, not adopt or discard.** `eval-r.ts`
comes forward with the shell rather than being rebuilt, and this ticket inherits
it as a starting point that has not had the two-axis review. The front matter
still stands — this ticket's own blockers (Part 2 #3 is now closed; **#2**, the
encirclement threshold, is not) are what hold it, never the scoping question.

**Hands off a ruling when it lands (registered 2026-07-31).** This ticket is the
last one before the operational-manoeuvre pass and ticket 13 are found to be
waiting for each other — a `Seal conflict` recorded in
`.scratch/operational-manoeuvre/README.md` § Ordering and `docs/SYNC-DEBT.md`. The
user deferred that ruling **with 09's landing as its trigger**, because by then the
match loop runs and the choice can be made against a working game. **A session that
resolves this ticket raises that ruling as its next order of business** — ticket 10
is not claimable until it is ruled, whatever 10's own `Blocked by` line says.

Specification gates: **all resolved.** Wayfinder 07 was already; 10 closed
2026-08-02 (it owns every acceptance threshold); 12 closed 2026-08-03 — **no new
integration feature home**, the Production homes are the existing feature
birthplaces plus ADR 0049. What still holds this ticket at `needs-info` is
`DECISIONS-OWED.md` Part 2 **#3** (the commit marker on the eval bar) and **#2**
(the encirclement threshold), not a gate.

Contract (interim pointers): duel-pivot ledger Gate 6, EVAL BAR section — the
sealed skeleton (subjective not omniscient; band not needle; reducible versus
irreducible width; dealer-doesn't-lie; bound to the sole win condition; witness
model; single in-play tactical bar with the strategic verdict excluded from live
play; no numeric what-if calculator; LEFT/RIGHT two-bar layout; free target
exploration and notch retrospection); `docs/features/fog-of-war-discovery/RULINGS.md`
②; combat-formula `FORMULA.md` (what R actually is) and `MAGNITUDE.md` M7 (the
per-plan thresholds the needles show).

**In-build design — three things the seal deliberately left open.** The exact
**name** (the game's symbol — the user's call), the **tactical-R composition
formula** (fogged inputs → position and width), and the **visual treatment**.
They need the wired engine and real play; do not open a pre-build grill. Bring
the formula and the visual to the user as a live prototype, and record the name
as the user's ruling when they give it.

**The trap, stated so it cannot be walked into.** An omniscient bar leaks hidden
state and kills the fog. It was explicitly rejected. The bar reads the player's
own projection and nothing else.

- [ ] The bar is computed strictly from the acting viewer's projection; no code path feeds it authoritative truth.
- [ ] It renders a band, not a needle: position answers who is ahead in this engagement, width answers how certain that is, and lower confidence widens it.
- [ ] Width separates its two sources — reducible (the enemy's existing forces and positions, shrinkable by reconnaissance) and irreducible (the enemy's this-turn simultaneous hidden commitment, unscoutable).
- [ ] The true value is always inside the displayed band; no display can exclude it.
- [ ] The bar is computed at an equal-commit baseline with a live marker at the player's chosen commit, and the equal-commit basis is labelled so the player is not misled into reading it as a prediction of their own allocation.
- [ ] Operation-plan threshold needles are shown from their owning magnitude doc so the catalog teaches itself without a tutorial.
- [ ] ~~LEFT tracks the clicked front and updates live as the player re-clicks eligible sectors before 확정; RIGHT holds the descriptive average across eligible fronts for the chosen action; picking an action shows both at the average and clicking a front makes only LEFT diverge.~~ **Re-cut 2026-08-05 by ADR 0052 — see the two items below.** The struck text is kept rather than deleted because it records what the right bar was *for*: it fixed a reference so the per-engagement bar read as a deviation instead of sloshing. That problem is real and its answer moved rather than vanished.
- [ ] **The two-bar layout stands, and the anchor sits inside each bar.** LEFT still tracks the clicked front and updates live as the player re-clicks eligible sectors before 확정. What the RIGHT bar holds is **this ticket's to cut against a running game** — the descriptive average across eligible fronts is retired, because ADR 0052 lets force divide across several fronts in one turn and "this front versus typical" stops being a decision input. Sloshing is damped by the equal-commit baseline the bar already carries, not by a second bar.
- [ ] **The baseline-and-marker device reads on both decision axes** (ADR 0052 decision 5): baseline = the board with the player's decision removed, marker = the board with it applied, and the gap is what the decision bought. Commitment already runs this. Force joins it, so a player who sends half an army sees what the other half would have been worth.
- [ ] **The force-axis baseline is the force presently standing there — 가안 (L0), confirmed here, not before.** ADR 0052 decision 7 records the structure and marks the value provisional on purpose: a baseline is an input to the tactical-R composition, which this ticket's own § In-build design forbids grilling ahead of a running prototype. Bring it to the user on the live shell and record their ruling; if it does not read, the two rejected candidates are 전군 투입 and 균등 분할.
- [ ] The average is descriptive — an aggregate of the player's own fogged options — and is never presented as a will-I-win-the-turn verdict.
- [ ] The bar exists only for R-shaped actions (attack and defence); non-combat actions have no bar rather than a meaningless one.
- [ ] There is no numeric what-if calculator and no assumed-enemy sliders; the pre-commit read is the band against the threshold margin.
- [ ] No in-play strategic or overall-position bar is introduced, and no live coach verdict is shown.
- [ ] Clicking a confirmed order's commit notches re-shows that order's R as it stood at commit time.
- [ ] The bar's readability is verified with a human in the real browser at the agreed viewport, not asserted from unit tests.
