# ADR 0054: The Map Carries What the Ground Is Worth

Date: 2026-08-05

Status: Accepted

Decision source: user grill, 2026-08-05, closing the **gate 03 C03.6 residue** that
ADR 0053 left open when it retired the in-play 판세 meter. 0053 recorded two
available readings and declined to choose between them, correctly — both were
weak. The grill found a third that neither had, and it is recorded here because it
binds outside the fog feature.

- Relationship:
  - **Amends ADR 0053**, stamped there: its § Consequences left C03.6 "recorded as
    an open question, not answered here". It is answered here. 0053's own decision
    — no in-play 판세 meter, coverage in the strip — is untouched.
  - **Applies the gate 03 §4 knowledge matrix** at its existing grades. Land value
    / yield and the register pool are already **Public**; the sector-attached
    serving band is already published (fog `RULINGS.md` ④ decision 1). **This ADR
    publishes nothing new.** It rules where already-published facts are read.
  - **Confirms fog `RULINGS.md` ②** and is bound by it: the map stays calm and the
    information layer is **summoned**, never painted.
  - **Confirms ADR 0052.** Force allocation moved onto the map there; this puts the
    economy that pays for force on the same surface, completing a chain the map was
    already showing two-thirds of.
  - **Confirms ADR 0042 and duel-pivot ledger Gate 6 fork A** — nothing here states
    who is ahead.
  - Checked and **not** amended: fog ③, ④ (the evidence contrast keeps its sealed
    shape), 0048, 0049, 0050.
  - Mandatory-ADR trigger: cross-feature model. The decision binds fog
    presentation, the economy read, and build ticket 04's shell at once, and a
    ruling filed inside the fog feature would be unfindable from the economy side.

## Context

Gate 03 **C03.6** (user seal, 2026-07-17) puts enemy treasury **Absent from the
projection** — no number, no band, no display convention — and then preserves one
thing deliberately: its uncertainty survives *"only as 판세 band width"*, so that a
player **feels there is something here they cannot see**.

ADR 0053 removed 판세. The Absent half was untouched and is not in question; the
*residual presence* lost its vehicle. 0053 recorded two readings and picked
neither:

- **(a) The coverage band already carries it** — treasury is among the things the
  unobserved half contains. The objection 0053 recorded stands and this grill
  sharpened it: `MAGNITUDE.md` FG-M② defines coverage as ignorance about **ground**,
  and money is not on the map as ground. A spatial read cannot be quietly
  reinterpreted as an economic one.
- **(b) The summoned surface carries an explicit "unknown" row.** Fog ④ decision
  6(a) forbids a published `unaccounted N`, and a row whose entire content is
  "unknown" sits close enough to that line to need the user's eye.

The measurement that reframed it: **the treasury's flow is already fully public and
already spatial.** Income is a function of held sectors (`incomeOf(sectors, held,
ripening)`), political control is Public, and land value / yield is Public. So a
player can read the opponent's income exactly — and today the shell renders it as
`수입` in a per-realm table (`game/src/ui/App.tsx`), off the map entirely, while the
map shows the land that produces it and (since 0052) the armies it buys.

Treasury is load-bearing, which is why the residual presence was worth preserving
rather than dropping: it bills recruitment and is one of the three caps on it
(`limitedBy: 'headroom' | 'bodies' | 'treasury'`). The opponent's bank is the
answer to *can they replace what I just killed*.

## Decision

1. **The treasury's residual presence is carried by the map, not by the top
   strip.** No treasury figure, no treasury band, no explicit "unknown" row
   anywhere. C03.6's Absent half stands exactly as sealed.

2. **The map reads the ground's economy per sector**, at the grades the knowledge
   matrix already assigns:

   | Read | Grade | What it says |
   |---|---|---|
   | land value / yield | **Public**, exact | what this ground **earns** |
   | register pool | **Public**, exact | what this ground **can raise** |
   | serving | **banded**, decays | what this ground **has already raised** |

3. **It is a summoned lens, not paint.** Ruling ② seals a calm map with the
   information layer summoned by the commit decision; three always-on per-sector
   layers would break that seal directly. The grammar is the one already in use —
   지목 → 소환.

4. **The hidden stock is read as a mismatch among the three, and is never
   computed.** A realm holding rich, populous ground behind thin serving bands is
   banking; a realm whose serving band strains its pool is spending. Fog ④ decision
   6's requirement is met in its own terms: this is a **gap read, not arithmetic**,
   and no remainder is published or derivable.

5. **The lens's shape is build ticket 04's**, under `docs/DISPLAY-DEBT.md`. This
   ADR fixes what the map is responsible for, not how it draws it.

## Consequences

- **The lens mixes an exact layer with a decaying one, and that is the read.** Land
  earns and can-raise never blur — they are Public at every confidence level. Only
  *has raised* ages. A board of sharp ground and soft men is not an inconsistency
  to reconcile; it is the knowledge matrix rendered honestly.

- **This is strictly better than what 판세 did.** 판세 hid the treasury inside a
  vague aggregate. The map exposes everything about it *except* the one thing that
  should stay hidden — the accumulated stock. The player's unknown becomes
  **specific** rather than atmospheric: *I know what they earn, I roughly know what
  they spend, I do not know what they have saved.* That is a sharper feeling than a
  band width that meant nothing in particular, and it is a better answer to what
  C03.6 was protecting than C03.6's own mechanism was.

- **SPEC's `land-derived` thesis reaches the map for the first time.** Wealth is
  territory in this game's design and has never been visible as territory. Conquest
  becomes a visible transfer of income.

- **Ruling ②'s calm-map seal is the binding constraint on delivery,** and is the
  way this decision most plausibly goes wrong. An implementer who reads "the map
  carries the economy" as licence to paint three layers has broken a seal this ADR
  confirms. Decision 3 is not a preference.

- **Coverage keeps one job.** With the economy off the strip, the coverage band is
  responsible only for how far the viewer has looked (`MAGNITUDE.md` FG-M②, fog
  `RULINGS.md` ⑤), and reading (a) above is closed rather than left ambiguous.

- **`docs/SYNC-DEBT.md`'s C03.6 row is paid** by this ADR and moves to § Paid.
