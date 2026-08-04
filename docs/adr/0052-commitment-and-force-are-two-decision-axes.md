# ADR 0052: Commitment and Force Are Two Decision Axes, Operated on Two Surfaces

Date: 2026-08-05

Status: Accepted

Decision source: user grill, 2026-08-05, opened on build ticket 04's scoping
call — the row `docs/SYNC-DEBT.md` § Open registered on 2026-08-04 asking whether
the submission lane's `DemoShell.tsx` is ticket 04's deliverable. The scoping
answer is recorded in that ticket's body; this ADR records the design decision
the grill reached on the way there, because it changes a cross-feature model and
the mandatory-ADR trigger applies.

- Relationship:
  - **Amends the duel-pivot ledger Gate 6 EVAL BAR seal** (2026-07-23,
    `.scratch/l3-playable-seam/duel-pivot-draft-ledger.md`) on exactly one of its
    clauses, stamped there: the **RIGHT bar's role** — "the descriptive average
    across eligible fronts" — retires. Nine of the seal's ten clauses stand
    untouched, including the two-bar LEFT/RIGHT layout itself, which survives
    with a different right-hand content.
  - **Refines gate 07 § Sealed item 4** (coupled continuous camera, wheel + drag).
    The camera contract is unchanged; drag acquires a target discriminator.
    Recorded at that gate.
  - **Closes `DECISIONS-OWED.md` Part 2 #3** (the commit marker on the eval bar)
    in favour of the ledger's side.
  - **Confirms ADR 0042.** The sole win condition, the 행동력 single stack, and
    the EVAL BAR's standing as the signature organ are untouched; only the organ's
    internal structure is re-cut.
  - **Confirms ADR 0046 item 4** (commitment is poured onto sectors). This
    decision adds a second axis beside that pour; it does not move the pour.
  - Checked and NOT amended: ADR 0019, 0028, 0049, 0050.

## Context

The sealed combat arithmetic has always been a product. `game/src/domain/battle.ts`
composes each side as

```
sidePower = substance × commitLever(commit) × quality × fatigue
```

where `commitLever` starts at ×1, bends at eight points, and **saturates at ×2**
(M2). Commitment is therefore a multiplier with a hard ceiling — it doubles what
is present and can never substitute for it. Two thousand men fully committed
match four thousand uncommitted, and no amount of 행동력 goes past that.

Only one of the product's two factors was operable. Commitment had a surface —
gate 07's sealed commit-first flow, and `allocate-commitment` behind it.
**Substance had none.** The submission lane's demo shell marches
`view.detachments[0]` whole on every attack; the greybox strip in `App.tsx` does
carry split, merge and a march button, but behind a dropdown disconnected from
the commit decision, and it declares itself a probe meant to be deleted. So the
player could turn the multiplier and could not choose what it multiplied.

That absence had also shaped a sealed reading device. Gate 6's EVAL BAR gives the
player two bars: **LEFT** tracks the clicked front and moves as targets are
re-clicked; **RIGHT** holds the descriptive average across eligible fronts and
deliberately does not move, so the gap between them is the read. That design is
coherent **only while the whole army goes to one place** — the question it
answers is *which single front*, and RIGHT is the reference line that makes one
front's quality legible against the rest. Once force can be divided across
several fronts in the same turn, the player is not choosing one front, and
"is this front better than typical" stops being a decision input.

## Decision

1. **Commitment and force are two decision axes, and they are operated on two
   different surfaces.** Commitment is decided in the commit bar, which stays
   gate 07's entrance. Force is allocated on the map.

2. **The map is a controller, not a dashboard.** A player's own field army is
   directed by dragging from it to a destination, the arrow growing as it is
   pulled — the gesture Hearthstone uses for targeting. Divisions made this way
   persist as independent field armies across turns.

3. **Drag acquires a target discriminator.** Drag on empty map pans the camera;
   drag from an own force issues an order. Gate 07's coupled continuous camera
   (wheel zoom, drag pan) is otherwise unchanged — this refines it rather than
   replacing it, and it is recorded at that gate so a reader of the seal alone
   is not misled.

4. **An order that spends commitment enters through the commit bar; an order that
   does not, does not.** This is the discriminator for what is a verb at all
   (user, 2026-08-05: *"커밋을 쓴다는 범위 내에서"*). Measured against the
   Runtime rather than assumed: only `allocate-commitment` and
   `allocate-recruitment` write into the allocation map
   (`game/src/runtime/runtime.ts`), and recruitment shares that map and budget
   outright. Recruitment is therefore a commit-bar verb; division, merge and
   forced march are not, because they spend no commitment. Forced march pays
   fatigue and rides as a modifier on the march it belongs to.

   *Reason: the 행동력 stack is single (ADR 0042, turn structure). Two doors onto
   one stack means the player must look in two places to answer "where did my
   turn go", which is exactly what gate 07's "커밋만 하세요" was sealed to
   prevent. The rule is stated as a rule rather than as a list so that a verb
   added later sorts itself.*

5. **The EVAL BAR's baseline-and-marker device extends to the force axis.** The
   sealed bar already carries the structure the second axis needs — an
   equal-commit **baseline**, a live **marker** at the player's chosen commit,
   and plan **threshold needles**, where the gap between baseline and marker is
   what the player's 행동력 bought. That device generalises without change:
   baseline = the board with the player's decision removed, marker = the board
   with it applied, gap = what the decision bought. Commitment was simply the
   only decision axis in existence when it was sealed.

6. **The RIGHT bar's role retires.** "Descriptive average across eligible fronts"
   answered *which single front*, and division removes that question. The
   two-bar layout survives; what the right-hand bar holds is re-cut by ticket 09
   against a running game, not settled here.

   **What that role was for is not discarded with it.** The seal states the
   right bar's job plainly: the per-engagement bar is *"disorienting alone"* —
   it sloshes as the player re-clicks — and the average fixed a reference so the
   left bar read as a meaningful deviation rather than as noise. Retiring a
   device without answering the problem it solved is how a correct-looking
   decision sends the next change to the wrong lever. The answer is that the
   anchor moves **inside** the left bar: the equal-commit baseline is already
   there (premise 2 of the same seal), and decision 5 generalises it to the force
   axis, so every reading carries its own reference. The sloshing is damped by a
   baseline either way; what changes is whether the reference sits in a second
   bar or in the same one.

7. **The force-axis baseline is the force presently standing there — 가안, L0.**
   Chosen for symmetry with the commit axis, whose baseline is likewise the board
   with the player's decision removed, and because it is the only candidate that
   reads before any order is given: at turn open it says what happens if the
   player does nothing, which is where reading a position starts. It is recorded
   as provisional deliberately: ticket 09 rules that the tactical-R composition
   is confirmed on a live prototype and forbids a pre-build grill, and a baseline
   is an input to that composition. This ADR records the structure; the value
   answers to a running game.

## Consequences

- **Build ticket 04** gains the force-allocation surface, the drag
  discriminator, and recruitment as a commit-bar verb. Its acceptance list is
  extended in the same batch.
- **Build ticket 09**'s last acceptance item — LEFT tracks the clicked front,
  RIGHT holds the descriptive average — is outrun by decision 6 and is re-cut in
  the same batch.
- **`DECISIONS-OWED.md` Part 2 #3 closes.** The conflict was the ledger's
  baseline-plus-marker against both prototypes' header line "NO COMMIT INFO on
  the bar — EVER". Decision 5 builds on the ledger's device and extends it, which
  is a ruling for the ledger; the prototypes' line retires. It is recorded here
  rather than left implicit because a registered conflict closed as a side effect
  is the failure mode this repository's Record layer exists to catch.
- **The held posture-transfer seam becomes load-bearing.** Decision 2 lets a
  player send part of a field army toward their own ground, which the user named
  as garrison reinforcement. Field → garrison is landed; **garrison → field is
  unwired and HELD** pending a user ruling on what happens to the wear ledger
  across a posture change (`docs/SYNC-DEBT.md`). So reinforcement is available and
  is currently **one-way**, and the "keep using them independently next turn"
  property of decision 2 holds between field armies but not out of a garrison.
  That hold now blocks a surface a player will reach for, which raises its
  priority without changing its content.
- **축성 cannot become a verb yet.** Decision 4 admits a verb by whether it spends
  commitment, and fortification's unit price is a design blank — FG-M① and R2
  both leave it unset. It stays a facade until a price exists.
- **The two factors become separately legible, which is a new way to be wrong.**
  A player may pour commitment onto a sector and send no one, spending the
  multiplier on nothing. That is a real mistake and it is meant to be available;
  decision 5's baseline is what makes it visible before 확정 rather than after
  the reveal.
