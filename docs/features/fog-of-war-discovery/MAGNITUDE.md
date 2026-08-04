# Fog and Discovery — Dial Sheet

The **owning model doc** for this feature's dials: what one act of observation
buys, and what it costs. Per the documentation law a feature's dials live in
exactly one model doc and every other surface references by pointer — so these
numbers are authoritative here and nowhere else.

Created 2026-08-03. It did not exist before, which is why these dials had no
birthplace and why `DECISIONS-OWED.md` Part 2 could carry a conflict between a
Production seal and four constants in an archived file for weeks. The precedent
is exact: `docs/features/war-model-build/MAGNITUDE.md` was created 2026-07-26 for
the same reason.

Shape authority stays with `RULINGS.md` ③ (the witness model) and with gate 03's
viewer knowledge contract. **This file owns values, not shapes.**

---

## FG-M① — Observation precision and reconnaissance unit prices — SEALED 2026-08-03 (user grill) · L0

Verdict source: user grill, 2026-08-03, recorded at `RULINGS.md` ③. The grill
resolved `DECISIONS-OWED.md` Part 2 #1, #4, #5 and #6.

**L-stamp L0, and the reason matters.** These are hand-reasoned values, checked
against the board's real magnitudes (a 900-man border shield, a ~9,000-man opening
field army, M7's 1.92 rout onset) and against M2's commit-lever curve — but nothing
has *measured* them. No sweep chose them and no playtest has seen them.
Per the law's deferral discipline, both halves are stated rather than one:
**picked up at the first real playtest** (TEST-LADDER L3, build ticket 13), and
**this L0 paragraph is deleted** when that playtest re-seals the values — the
L-stamp moves off L0 and its measurement becomes the verdict source. Until then
every number below is 가안 and expected to move.

### Precision — the half-width a single observation carries

Half-width is stated as a fraction **of the figure the observation reports**, never
of the true value. That is a contract, not a convenience: a width proportional to
the truth is invertible, and one look at the band would return the true figure
exactly (`RULINGS.md` ③ decision 7).

| Observation | Half-width | Paid? |
|---|---|---|
| Enhanced reconnaissance | **±10%** | yes |
| Repelled assault | **±20%** | free byproduct |
| Normal reconnaissance | **±25%** | yes |
| Battle contact | **±30%** | free byproduct |
| **Intersection floor** | **±5%** | — |

The floor is the irreducible sliver: no accumulation of testimony narrows a
substance band below it. It is what makes gate 03's invariant 6 hold structurally
rather than by a ceiling check, and it is the numeric form of the sealed reading
that the last stretch of a force estimate is psychology rather than information.

**Paid beats free, deliberately.** The ordering is the dial, not an accident: if
incidental contact were worth as much as a purposeful look, nothing would be bought
after first contact and the information market would close.

> **Reason corrected 2026-08-03 (ruling ④ review), values unchanged.** This
> paragraph read *"Both free sources sit wider than the cheapest purchase"*, and the
> table directly above it says otherwise: **repelled assault is ±20%, finer than the
> ±25% cheapest purchase.** Only battle contact (±30%) sits wider. The conclusion
> stands on narrower grounds than the sentence claimed, and the true grounds are
> worth stating, because a reader who takes the false version at face value will
> mis-price the ladder. What actually keeps the market open after a repelled
> assault: **the enhanced grade (±10%) still beats it**, and a defender cannot
> *choose* to be assaulted, so the ±20% reading is a windfall on a turn the opponent
> selected rather than a purchasable substitute. What is genuinely lost is the
> normal grade against that one target on that one turn.
>
> **Whether ±20% was meant to land inside the paid range is a value question and is
> not answered here** — the values are 가안 and the user's. Registered in
> `docs/SYNC-DEBT.md`; picked up at the first playtest with the rest of FG-M①.

With no observation at all, the band is bounded only by public facts — the register
pool caps how many bodies a realm can have serving. That bound is derived, not a
dial, and it carries no entry here.

### Reconnaissance unit prices

`DECISIONS-OWED.md` R2 ruled the **grammar** — non-combat orders are linear in
commit, freely allocated, and fixed per-action prices are retired. R2 records that
the unit prices owe a seal at this birthplace. They land here:

| Grade | Unit price |
|---|---|
| Normal | **2 commit per sector** |
| Enhanced | **6 commit per sector** |

Pouring more converts linearly into more sectors, never into a deeper look at one
sector: `../combat-formula/MAGNITUDE.md` M8's saturation rule survives this batch
and is what makes the enhanced grade worth buying at all. Without it, six commit
spent as three normal scouts on one sector would dominate one enhanced scout.

The linear-commit grammar itself is a match-frame rule rather than a fog rule and
belongs wherever the turn structure lands; `docs/SYNC-DEBT.md` tracks that home.
Unit numbers for fortification, recruitment and supply stay unset by design.

### Consequence — the reconnaissance crossover, derived not dialled

These two dials plus M2's commit lever fix the point where buying the enhanced
grade stops paying. Against a defence of power `D`, an attacker of substance `S`
aiming at M7's 1.92 rout onset must pin the safe commit at the band's top
(`../combat-formula/MAGNITUDE.md` M3). Solving for the raw ratio at which the pin
saved equals the 4 commit spent gives **ρ = S/D ≈ 1.49**, independent of `D`.

Briefably: **bring more than about one and a half times their fortified defence and
you should pull the lever instead of scouting; fall short of it and you should
scout.** Below M2's knee a lever point is cheap, so overcommitting beats buying
information; above it the lever is expensive and information is cheaper; and where
the band's top would demand a lever past the ×2.00 ceiling, reconnaissance is the
only path that does not cost permanent blood.

This crossover is **emergent and must not be set directly.** It moves when the unit
prices move — at an upgrade cost of 2 it rises to ρ ≈ 2.30 and reconnaissance
becomes a standing tax; at 6 it falls to ρ ≈ 1.15 and reconnaissance is bought only
in desperation. The price is the threshold's dial.

### Consequence — the reporting spread, derived not dialled

Sealed 2026-08-03 with `RULINGS.md` ④ decision 7. **The figure a testimony reports
is not drawn from the whole range honesty allows.** It is drawn from a narrower one
centred on the truth, and the margin between the two is what the intersection floor
is made of.

Write `w` for a grade's stated half-width and `a` for the **reporting spread** — how
far the reported figure may sit from the true value. Repeated testimonies at one
grade intersect to an asymptotic half-width of `w − a`. Set `a` equal to the
intersection floor and the table falls out:

| Observation | Stated half-width `w` | Asymptote `w − a` |
|---|---|---|
| Enhanced reconnaissance | ±10% | **≈±5%** — the floor |
| Repelled assault | ±20% | ≈±15% |
| Normal reconnaissance | ±25% | **≈±20%** — saturates short of the floor |
| Battle contact | ±30% | ≈±25% |

Approximate because the closed form is the limit: the sweep in G2 measures **5.03%**
at the enhanced grade, against the 5.00% the subtraction gives.

`a` = **±5%**, uniform across grades, and it is **not a new dial**: it is the
intersection floor above, doing a second job. The floor stops being a clamp applied
to a collapsed interval and becomes a property of how the dealer speaks, which is
what this sheet already claimed when it said the floor holds "structurally rather
than by a ceiling check". A margin scaled to each grade's width instead would need a
proportionality constant — that *would* be a new dial, and it is why uniform is what
the sealed outcome rests on.

**What this buys the grade ladder (the user's ruling).** The two paid grades sell
different **destinations**, not different speeds: no accumulation of normal
reconnaissance reaches the floor, so a player who wants the last sliver must buy the
enhanced grade rather than grind the cheap one. A cheap grade that visibly saturates
also pushes commit onto a fresh target or an upgrade instead of onto more of the same
look. **Saturation preserves the ladder's existing ordering rather than repairing
it** — every asymptote sits exactly 5 points inside its stated width, so repeated
observation reorders nothing, including the one inversion the paragraph above
records (repelled assault stays finer than normal reconnaissance, at ≈15% against
≈20%).

**Containment holds with room.** A testimony contains the truth while `a ≤ w/(1+w)`:
9.09% at the enhanced grade and 20.0% at normal, against `a` = 5%. The floor binds
first at every grade, which is why it — and not containment — is what fixes `a`.

Like the ρ crossover above, this is **emergent and must not be set directly**. It
moves when either sealed dial moves. Measured evidence for the failure it repairs,
and the sweep behind these figures:
`.scratch/l3-playable-build/issues/08-project-standard-fog-and-price-recon.md`
§ Groundwork G2.

## FG-M② — Coverage, the size of the viewer's own ignorance — SEALED 2026-08-05 (user grill) · L0

Verdict source: user grill, 2026-08-05, opened on the two residues ADR 0053 left
behind when it closed `DECISIONS-OWED.md` Part 2 #13. That ADR put a **coverage**
band in the top strip and recorded that the figure "needs a definition and has
none". The reason was false — build ticket 08 shipped one, and three tests pin it
— and what was actually missing is this seal. ADR 0053's header carries the
correction; the definition below **replaces** the shipped one. Presentation is
`RULINGS.md` ⑤ and is not restated here.

### What it measures

Coverage is the share of the opponent's ground on which this viewer still holds a
**tight** reading. Per sector it is the share of that sector's prior ignorance the
viewer has removed:

```
tightness(sector) = 1 − ( current band width ÷ the width that sector
                          would carry with no testimony at all )

coverage          = mean of tightness across the sectors the opponent holds
```

Neither input is authored here. The numerator is the band ③ composes from stored
testimony. The denominator is the bound public facts alone impose, which ticket
08's acceptance list already required: *"with no testimony on a sector, the band is
bounded by public facts alone and never by the truth."*

A sector never observed reads **0**. One just scouted at the enhanced grade reads
near **1**.

**Zero new dials**, and that is the whole reason the definition takes this shape
rather than a simpler one.

### Decay is free — 노화 헌법 P3 already does it

The shipped definition counted a sector as covered if it carried **any** testimony
at all, so a sector looked at once on turn 1 scored the same as one scouted this
turn at the enhanced grade. Such a band reports high while the statements under it
have aged into uselessness, which is a **dealer that lies** — the one thing ②'s
deception disposition forbids outright.

Reading the width instead repairs that with no decay dial and no age curve. P3
already widens an unobserved testimony every turn toward the public bound, so a
tightness that reads the width **returns to 0 on its own**, at exactly the rate the
fog model already moves. An age→number mapping would have been a new dial, and it
would also score the two paid grades identically on the turn they are bought —
collapsing the ladder FG-M① exists to keep apart.

### The denominator is spatial, and unweighted

Coverage is a mean over **sector count**, not over land value, register, or any
other magnitude. Weighting by value was rejected deliberately: it would weight by
*what the match is about*, and ADR 0053's only ground for seating this band in the
top strip is that it reports the viewer's own **epistemic** state rather than a
position on the match. A figure saying "you have seen 62% of what matters" states
which ground matters, which is the verdict duel-pivot ledger Gate 6 fork A dropped.
A share of ground states nothing of the kind.

The objection this knowingly accepts: a player who has scouted only worthless
ground reads high while knowing little that decides anything. Repairing that is not
coverage's job. Coverage says how far the viewer has looked; *what was found* is the
summoned evidence surface, and *what the ground is worth* is the map (**ADR 0054**).

### The force side is absent, and structurally so

Coverage is the **sector side only**, and that is not a scoping preference. ④
decision 6 refuses force contacts a total, because two contacts may describe the
same force, and a fraction cannot be built without one. So a viewer holding tight
readings on every enemy sector while having lost track of the field army sees a
bright band — correctly. *The ground is lit and the army is dark* is a tension to
keep, not a defect to paper over.

### Where the denominator vanishes

A sector whose public facts already pin the value — a zero register pool leaves no
room for a serving band — carries a no-testimony width of **0**, making tightness
`1 − 0/0`. It reads **1**: nothing was ever hidden there, so nothing remains to
remove. Stated here rather than left to an implementer, because both honest-looking
alternatives (0, or a throw) misreport a sector the viewer fully knows.
