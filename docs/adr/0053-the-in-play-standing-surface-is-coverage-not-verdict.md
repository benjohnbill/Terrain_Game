# ADR 0053: The In-Play Standing Surface Shows Coverage, Not a Verdict

Date: 2026-08-05

Status: Accepted

Decision source: user grill, 2026-08-05, closing `DECISIONS-OWED.md` Part 2 **#13**
— the last item holding build ticket 04 at `needs-info`. The conflict spanned
three gates and was registered rather than resolved when each was sealed; fog
`RULINGS.md` ④ decision 6 (2026-08-03) supplied the distinction that resolves it
and deliberately declined to place the surface, naming ticket 04 as its home.
This ADR records the placement.

- Relationship:
  - **Amends gate 07 § Sealed item 2** (the derived-band grade encoding), stamped
    there: **판세 is not an in-play mini-meter.** The other two encodings in that
    item — 동원 강도 as a sector-bound band summoned on command, civilian register
    as derived — are untouched.
  - **Confirms duel-pivot ledger Gate 6 fork A** (the in-play strategic 판세 bar
    is dropped; the strategic verdict is a post-game coach excluded from live
    play). This decision does not reopen it; it is the reason the surface takes
    the shape it does.
  - **Applies fog `RULINGS.md` ④ decision 6** (the census arrives as an evidence
    contrast, never as a computed remainder) at the placement ④ left open. All
    four of its clauses bind here and are not restated.
  - **Leaves gate 03 C03.6 without a home** — see § Consequences. That is
    recorded as an open question, not answered here.
  - Confirms ADR 0042 (the strategic verdict stays out of live play) and ADR 0052
    (this surface is not an eval bar and does not enter the two-bar layout).

## Context

Three seals disagreed about whether a live 판세 surface exists at all.

- **Gate 07** (2026-07-23) encoded the derived-band grades and gave 판세 a
  **match-level mini-meter** in the top strip, banded, progress-bar banned.
- **Gate 6 fork A** (2026-07-23, same day) dropped the in-play strategic 판세 bar
  outright, on the ground that a synthetic "who is winning" value predicts no
  resolvable event, is illegible, recreates the 4X scorecard, and — the load-
  bearing reason — **computes the player's judgment**, when 형세판단 is the game.
- **Gate 03** C03.6 put enemy treasury Absent from the projection and let its
  uncertainty survive **"only as 판세 band width"** — a clause that presumes a
  판세 band exists.

Fog ④ decision 6 named what the first two were talking past: **an evidence
surface is not a verdict surface.** Gate 6 forbids the system stating a position;
laying out the materials a player reasons from asserts none. ④ sealed what such a
surface must do — no published "unaccounted N", the sector side aggregated and the
force side **refused a total** because contacts may be the same force, coverage
shown beside, and the whole thing evidence rather than verdict — and stopped
short of placing it.

## Decision

1. **There is no in-play 판세 meter.** Nothing in the shell states who is ahead at
   match level while the match runs. Gate 6 fork A holds.

2. **What rests in the top strip is coverage — the size of the player's own
   ignorance, not an answer.** One thin band: how much of the opponent's ground
   this viewer has observed. It is a legal resident of the strip precisely
   because it is not a verdict; it reports the viewer's own epistemic state,
   which is a fact about them rather than a position about the match.

3. **The evidence contrast is summoned from that band, not painted.** Expanding
   the coverage band opens ④ decision 6's surface: the aggregated sector side,
   the dated list of force contacts with its refusal to sum stated on it, and
   coverage. It closes again. Gate 07's "summoned by the decision, not always
   painted" governs it.

   *Reason (user, 2026-08-05): the design being pursued is a reactive UI that
   invites a chain of clicks only when one is needed, and holds information for
   the player to go and find when they are curious. A resident answer ends that
   chain before it starts; a resident **question** begins it. Coverage at rest is
   an itch — "half of this is dark" — and the itch is what makes reconnaissance
   worth buying. An answer at rest is what makes a player stop thinking, which is
   the specific harm Gate 6 named.*

4. **Uncertainty is felt at match scale the way gate 07 sealed it at sector
   scale.** Gate 07's fog contract requires the estimate band's **width to be
   felt**, with no comfortable midpoint. Coverage is that same instrument one
   altitude up: it reports width — how much is unseen — and refuses a centre.

## Consequences

- **Build ticket 04 leaves `needs-info`.** #13 was the last item holding it; its
  `blocked_by: [03]` was already satisfied. The ticket's own "conflict to route,
  not to resolve here" paragraph is discharged and is re-cut in the same batch.
- **Gate 03 C03.6 now names a surface that does not exist.** Enemy treasury is
  Absent from the projection — that half stands and is untouched — but its
  residual presence was routed through "판세 band width", and there is no 판세
  band. Two readings are available and neither is written down: the coverage
  band's unseen portion already carries it (treasury being one of the things the
  dark half contains), or treasury needs its own explicit unknown inside the
  summoned surface. **This ADR does not choose.** It is a user seal and the
  question is registered in `docs/SYNC-DEBT.md`; the surface is buildable
  meanwhile, because both readings agree that no treasury figure and no
  treasury-specific band is ever published.
- **The coverage figure needs a definition and has none.** "How much of the
  opponent's ground has been observed" is a percentage of *what* — sectors held,
  sectors visible, land value, register? That is a magnitude question for the
  fog feature's own docs, owed before the surface is built, and it is not a new
  dial if it reads off an existing quantity.
