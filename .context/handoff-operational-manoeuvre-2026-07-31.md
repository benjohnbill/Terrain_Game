# Handoff — the operational-manoeuvre Wayfinder pass

Written 2026-07-31, immediately after the geography-battle grill merged (`9480933`).
The pass is **opened and scoped, not designed**. This handoff exists so the next
session knows what the pass is for, what it may not touch, and — most importantly —
**why it must not start designing yet**.

## Read this first, and take the ordering seriously

1. `.scratch/operational-manoeuvre/README.md` — the tracker's front door: destination,
   the settled bypass vocabulary, inherited seals, and the junction contract.
2. `.scratch/operational-manoeuvre/SEAMS.md` — the eight named constants the build
   planted for this pass to answer.
3. `.context/record-geography-battle-grill-2026-07-29.md` — the grill that opened it.
   § Refuted or corrected is the part that saves time.
4. `docs/adr/0046-the-sector-is-the-atom-of-combat.md` — the seals this pass inherits.

## The one instruction that matters most

**Do not write the design gates yet.**

The tracker's § Ordering states it and this handoff restates it because it is the
easiest thing to ignore: an opened Wayfinder invites gate-writing, and gate-writing
here would be design-from-imagination.

The gates fire **after ticket 13** — one complete full-depth match to capital fall —
has produced a match report. The reason is a lesson this project already paid for: the
crisis pass tuned downstream dials before establishing that the draw problem was
upstream in the war system (`docs/DESIGN-RISKS.md` R14, and the crisis-design record).
Designing manoeuvre before anyone has played a match without it repeats that shape
exactly.

A played match is also the only honest source for the sentence this pass needs:
*"here is where I wanted to manoeuvre and could not."*

What **is** work now: reading `SEAMS.md` as build tickets add to it, and keeping the
consolidated debts pointed here.

## Destination, in one line

> **Position must mean more than adjacency.**

Today a force's position affects the game in exactly one way: whether it is adjacent
to something it can fight. Going around, going past, cutting off, cutting supply,
being cut off — all designed at shape level, all registered as owed, none on the board.

## Why this is one pass and not seven values

Seven registered debts each say "owed: its own pass". That is the signature of a
missing pass. And four of the twelve plans in `operation-plan-catalog/CATALOG.md` that
would express them are **shape COMPLETE** with zero board implementation —
**Flanking Breakthrough (우회 돌파)**, **Supply Interdiction (보급 차단)**,
**Encirclement and Annihilation (포위 섬멸)**, **Crossing / Landing Securement
(도하·상륙 확보)**.

The user's own reading, which opened the pass: *the concepts are written down and I do
not believe any of it is actually implemented.* That reading is correct, and the
catalog is where the concepts are.

## The vocabulary — keep these three apart

Conflating them cost most of a session. The tracker carries the table; the short form:

- **Bypass A — target substitution.** Attack a *different* sector. Free today, needs
  no mechanism. This is what the user means by 우회.
- **Bypass B — approach substitution.** Attack the *same* sector from a different
  neighbour. **Deferred here together with frontage — not abolished.** TC-⑮ retired one
  *implementation* of it (arriving undoored lowering the defender's terrain), because
  the detour is free and 100 flanking men moved R from 0.56 to 2.22. The **capability**
  was never retired and the user wants all three bypasses. Its consequence belongs in
  frontage, under the door-share reading M11's wording already implies. The tracker's
  § Bypass B is deferred, not abolished carries the full correction — **read it before
  designing against B.**
- **Bypass C — transit past.** March past and continue. Possible today and **nothing
  can stop it** (R14).

D9's `Removability` obligation — "chokes historically fail by **deletion**, not
attrition" — means **A and C**. Anopaea was a path around and behind, not another
angle of assault.

## The measurement that defines the problem

Blocking a door's arcs still reaches the target on **24 of 24** doors, so the map
honours D9's obligation geometrically. But it costs **0 extra turns on 20 of 20 land
doors** — sectors average **5.2 hexes** against march speed **3**; only straits cost
2–3 turns.

**That zero is the pass's subject.** Every downstream symptom follows from it:

- a frontage cap would be inert on arrival (with cap 1,000 against a 900 garrison at
  `pass` ×2.0, R pins at **0.556** for any force from 1,500 to 5,000, and terrain
  chokes have no erosion link — so the door is frontally unforceable *and* trivially
  avoidable);
- D9 names three removal-path kinds — **bypass, timing/condition windows, tech** — and
  this map has only the first, free. The other two do not exist anywhere.
  > **Corrected 2026-07-31 by survey** —
  > `docs/features/combat-formula/research/choke-removal-economy.md`. The second
  > sentence is accurate only about *D9's own three kinds*, and as a statement that
  > removal paths are missing it is wrong: **M11 authored a removal path for every
  > capped archetype**, discharging D9's obligation on paper. The majority of them
  > (road building, the Crossing plan's bridging, port staging) are **paid
  > construction** — a fourth kind D9's taxonomy never names — while timing windows
  > and tech are used by **zero** M11 rows. Tech is unbuilt with a known seat
  > (`UNIFORM_QUALITY`); timing windows are genuinely undesigned, and the one adjacent
  > deferral routed season through **supply**, which cannot carry a crossing-term
  > effect. The bullet above it — terrain chokes have no erosion link — is the real
  > asymmetry, and the survey quantifies it: the wall family got an exchange rate, the
  > terrain family got nouns. **Then the door-share reading sharpens it again** — the
  > terrain family's rate is *detour cost buys uncapped force*, which is degenerate
  > rather than missing, because the detour is free. Survey and measurement compose:
  > the paths exist **and** they are free. **The zero is the subject, not their
  > absence.**

Two upstreams can change that zero, and both are registered: **R14 interception**
(price the transit) and **map depth** (price the distance, TC-⑪ froze the grid so it is
seed-re-authoring tier). The pass may state what depth it needs; it does not author the
map.

## Inherited seals — build on these, do not silently revert them

- **ADR 0046** — engagements sited on presence; approach recorded as a hex arc; commit
  keyed per sector; hex is physical, sector is decisional.
- **TC-⑮** — a sector's terrain is its own. The pass **may** add approach-dependence on
  top, but reverting needs the amendment protocol and a TC-⑮ stamp.
- **TC-⑬'s survivors** — the crossing column (river 0.70, strait 0.55 · ADR 0015), and
  reachable-weakest-link **among doors**.
- **D9** — frontage is a cap, never a multiplier, because its impact is unbounded
  (Thermopylae's ~15 m front; Myeongnyang's strait). Deferred here, **not abolished** —
  and the user's instinct that a hard cap "feels like men filing through in single
  file" is the image D9 is built on, not an objection to it.
- **D10** — Encirclement's isolated-rout multiplier is already designed. 06c pinned
  `escape` to a constant awaiting it (seam S1).
- **WM-⑤** — rout displacement. Fall-back exists; where a **cut-off** force goes does
  not, and that is this pass's.
- **R13** — morale is parked and is **not available** as a mechanism basis.
- **M11** — the frontage values are already 가안-sealed. What is owed is the removal
  economy, not the number.

## The junction with the build — three layers

### 1. Before ticket 10: one-way

Build plants seams, this pass reads them. `SEAMS.md` is the address; a build ticket
that plants a manoeuvre seam adds a row in the same batch. This inverts the risk —
instead of the pass discovering later what the build baked in, the build declares it at
planting time.

### 2. Tickets 10 and 11: the hard junction

**Tickets 10 (`Select Differentiated Operation Plans`) and 11 (`Resolve Plan-Versus-Plan
Matchups`) are downstream of this pass**, because four of the plans they would expose
*are* its subject. Recorded on both sides so 10/11 cannot quietly become
`ready-for-agent` and fill four shape-complete plans from imagination.

**This pass's exit criterion: 10 and 11 are buildable.** Ticket 11's blocker list
already carries **Part 2 #2 (Encirclement)**, which is this pass's own item — which is
why 11 clearing is also the **deletion trigger** for the tracker's line in `AGENTS.md`
(the line says so itself).

### 3. Evidence runs build → pass

Gates after ticket 13's match report. Beyond 13, the pass also needs **06d** (ownership
— Encirclement's isolation test reads who holds the neighbours) and **08** (fog — a
force in transit must be *seeable* before intercepting it is a decision, and the fog
seal makes information immediate).

## What 06d is waiting for — relevant because it is upstream

06d was re-statused **`needs-info`** on 2026-07-31, on one owed ruling, and it now also
lists **06e** as a blocker.

The ruling: 06d's checklist rules R17's proportional formula "**superseded rather than
implemented**, because per-province accounting makes it exact — a captured province
carries its own register to the taker". But **provinces are not captured, sectors are**
(`Realm.sectors: SectorId[]`), and a province split across the front line is the normal
case. 관중 carries pop **0.5** and **0.97** in one province, so a partial capture needs
exactly the within-province apportionment R17 supplied. Either R17 stands or the
register moves to sector grain — which is what MT-② already *derives* it from. It is a
user ruling, not a value.

## Parked ideas this pass may open, and one it may not

May open:

- **Directional terrain** — river current, ravine axis, ridge facing. ADR 0046 item 3's
  hex-arc contract is the seat reserved for it (seam S7), specifically so this can
  arrive without a contract change. The user raised it as an idea, explicitly disposable.
- **`choke.cap`'s fate** (seam S4) — either re-purpose the field deliberately or retire
  it. It currently carries a stale concept's numbers and no reader.
- **Formalising D9's removal-path obligation as a load-time invariant** — `load.ts`
  already carries comparable invariants; the map is checked by hand today.

May **not** open here:

- **Asymmetric terrain** — ground favouring the *attacker* (multiplier < 1.0). M5's
  ladder is defender-ward only, so this is a new axis, not a value. The user's example
  was cavalry deploying on steppe. Parked in the session record; it belongs to a
  formula pass, not a manoeuvre pass.
- **The map re-authoring itself** (TC-⑪).
- **`conquest damage`** (seam S8) — 06d plants it at identity 1.0 for the deferred
  snowball-counterweight session per ADR 0044 item 6. Recorded so it is not mistaken
  for this pass's work.

## Standing hazard: cite the ADR chain before arguing from a seal

This session argued a ruling from OG-③'s limbo rule as though conquest conversion were
still open. **ADR 0044 had settled it three days earlier**, and two code comments still
said otherwise because they landed hours before the ADR did, on the same day. The
ruling survived on corrected grounds, but the failure is the one `AGENTS.md` § Read
Order names outright: *"a decision recorded here and never cited is how the project has
actually gone wrong before"* (ADR 0041 § Context).

This pass touches ADR 0015, 0029, 0032, 0042, 0043, 0044, 0045, 0046, D9, D10, M11,
TC-⑬, TC-⑮, OG-③, R13, R14, R16. **Read the ones that bound the question, not the
recent ones**, and check whether a code comment agrees with them before trusting it.

## Suggested skills

- **`/grilling`** when the gates are finally written — this pass's whole content is
  design under adversarial pressure, and the last one produced six refutations.
- **`/research`** for the removal-path economy specifically: D9 names timing/condition
  windows and tech as removal kinds and neither exists anywhere in the design. That is
  a survey question before it is a design question.
- **`/final-check`** at session close.

## Baseline at handoff

`main` at `b62c901`. `verify:game` all lanes PASS with parity PENDING by design (both
hosts `29f214a11fc56ef8`), test:node **206**, test:browser **21**, root `npm test`
**562/562**, `lint:docs` **0 blocking / 11 advisory**. One advisory is
verified-spurious and must stay standing — `conquest damage`'s row matched a commit
message about conquest *conversion*, a different term.
