# 09 — Build the EVAL BAR

**What to build:** The game's signature read organ. A subjective tactical
confidence **band** — position plus width — computed from the player's own fogged
estimate of the decisive engagement, with an equal-commit baseline, a live marker
at the player's chosen commit, and operation-plan threshold needles. Two vertical
bars: **LEFT** = the clicked front's R, **RIGHT** = this action's average across
eligible fronts.

**Blocked by:** 08 — Project Standard Fog and Price Reconnaissance.

Status: needs-info

Specification gates: Wayfinder 07 (resolved), 10, 12.

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
- [ ] LEFT tracks the clicked front and updates live as the player re-clicks eligible sectors before 확정; RIGHT holds the descriptive average across eligible fronts for the chosen action; picking an action shows both at the average and clicking a front makes only LEFT diverge.
- [ ] The average is descriptive — an aggregate of the player's own fogged options — and is never presented as a will-I-win-the-turn verdict.
- [ ] The bar exists only for R-shaped actions (attack and defence); non-combat actions have no bar rather than a meaningless one.
- [ ] There is no numeric what-if calculator and no assumed-enemy sliders; the pre-commit read is the band against the threshold margin.
- [ ] No in-play strategic or overall-position bar is introduced, and no live coach verdict is shown.
- [ ] Clicking a confirmed order's commit notches re-shows that order's R as it stood at commit time.
- [ ] The bar's readability is verified with a human in the real browser at the agreed viewport, not asserted from unit tests.
