# SPEC Amendment Draft — 1v1 Duel Pivot

> **Status: PROPOSAL (Tier-3, awaiting user seal). NOT applied to `SPEC.md`.**
> SPEC is Direction — it changes only by explicit user decision. This draft
> collects the SPEC contradictions and sharpenings opened by the 1v1 duel pivot
> (ADR 0042; duel-pivot ledger gates 1–6, sealed 2026-07-23/24). The rest of the
> cascade (ADR, DOMAIN_MAP/DESIGN, capital CP-②, match-arc reseal) has landed;
> SPEC waits here for the user's approval, then is applied verbatim.

The pivot: **the game is a two-realm head-to-head duel won by capturing the enemy
capital.** War and match are one; there is no hegemony settlement, no multi-realm
decision point, and no crisis-arc / draw terminus. The combat + realm-internal
engine survives whole (premises Boundary). Authoritative record: ADR 0042 +
`docs/features/capital/` (CP-②) + the ledger.

Each item below quotes the current SPEC text and proposes a replacement.
**Contradictions** (11) must change; **Sharpenings** (4) narrow existing text
without reversing it.

---

## Contradictions (require amendment)

### C1 — Goal: "world-conquest" framing
**Current (§ Goal):** "…combine into a **world-conquest** strategy experience."
**Proposed:** "…combine into a **head-to-head conquest duel** — a two-realm match
won by capturing the enemy capital." (The Civ-depth world is preserved; the
match shape is a duel, not a world conquest.)

### C2 — Core Gameplay Promise: "conquer the map"
**Current (§ Core Gameplay Promise):** "…uses that state's geography, economy,
population, military deployment, diplomacy, and timing **to conquer the map**."
**Proposed:** "…to **capture the enemy realm's capital** — the sole win
condition of the duel."

### C3 — Principle #5: "The ending is the detection of irreversibility"
**Current (#5):** "The ending is the detection of irreversibility. A match ends
… when the system detects that no realm or coalition can reverse the balance —
that moment opens settlement negotiation…"
**Proposed (#5 — retitle "The ending is capital fall"):** "A match ends when a
realm's **capital falls** — the sole win condition; there is no points-victory,
timeout-draw, or detected decision point. Stalemate is prevented structurally
(1v1 removes the multipolar deadlock; mutual-exposure and land-derived decay
force the trailing player to gamble), not by a scoring terminal. (ADR 0042;
capital CP-②; DOMAIN_MAP § Match Arc.)"

### C4 — Match structure: realm count 4–6
**Current (§ Match structure):** "…4-6 realms (authoring default 5), every realm
bordering neighbors, no expand-into-empty-land opening."
**Proposed:** "…**exactly two realms**, bordering each other, no
expand-into-empty-land opening. Player count is decided, not an authoring
variable." (The full-partition / mature-state / no-empty-land properties hold.)

### C5 — Match structure: multipolar geometry
**Current (§ Match structure):** "…a multi-front 중원 center whose crown is
economic … against shielded, coalition-capable peripheries, so whoever takes the
center inherits its exposure (the anti-snowball loop). The center-protagonist
reading is a measured hypothesis…"
**Proposed:** Remove the multipolar geometry. KEEP the underlying parity
principle: "Realms start as mature states balanced on survivability and starting
population (equal lifetime blood budgets; divergence only from play), asymmetric
in geometry and economy. The concrete two-realm board — capital placement,
forward/rear geometry, and terrain — is authored at the parallel 1v1 map pass."
(The 중원/coalition/anti-snowball framing is multipolar and has no referent in a
duel.)

### C6 — Match structure: the multi-war arc
**Current (§ Match structure):** "A match arcs standoff → buildup → first war →
realignment → deciding war → decision point → settlement, budgeted so one
player's hand fights ~2-3 wars."
**Proposed:** "**War and match are one** — a single sustained duel, not a
~2–3-war arc. The match runs at the player's pace until a capital falls (target:
casual 15–30 min). Its length is induced by land-derived decay, not a fixed
clock." (Turn structure: simultaneous blind commit → reveal — ledger Gate 6.)

### C7 — Match structure: "the match ends when a hegemony settlement is concluded"
**Current (§ Match structure):** "…the match ends when a hegemony settlement is
concluded, not at 100% map control."
**Proposed:** "…the match ends when a **capital falls**, not at 100% map control
and not at a settlement. A war is decided by field-army destruction, encirclement,
or the loser's concession — but these are pressures **toward capital capture**,
no longer independent match-terminators (amends ADR 0038's three-channel
composite → capital fall is the sole terminus)."

### C8 — "Resolved (match-arc pass, 2026-07-04)" block
**Current:** "Match arc and victory conditions — the decision-point / settlement /
hegemony model is sealed … A match ends when a hegemony settlement concludes,
reached through reach-priced settlement bundles and deterministic acceptance
arithmetic…"
**Proposed:** Replace the whole block with: "**Superseded by the 1v1 pivot (ADR
0042).** The decision-point / settlement / hegemony victory model is retired;
capital fall is the sole win condition. The multi-realm machinery (hegemony
decision point, domination, unassailability, settlement bundles, acceptance
arithmetic) is historical (DOMAIN_MAP § Match Arc, match-arc feature docs). The
open playtest questions carry over in duel form: showdown staging (the
read-vs-reality reveal — now the EVAL BAR + simultaneous reveal), and the
loser-side experience."

### C9 — "Domination victory — second win-type"
**Current:** the whole "Domination victory (2026-07-09)" block (leadership vs
domination, both sharing the unassailability gate).
**Proposed:** Replace with a one-line supersession pointer: "**Superseded by ADR
0042** — there is no hegemony gate (and so no leadership/domination win-types) in
a two-realm duel; capital fall is the sole win condition."

### C10 — "How a match ends (crisis arc, sealed 2026-07-11)"
**Current:** the three-way ending block (1 hegemony decision point / 2 crisis arc
/ 3 Westphalian draw), "There is no judged scorecard."
**Proposed:** Replace with: "**A match ends in exactly one way: a capital falls.**
There is no hegemony decision point, no crisis arc, and no Westphalian draw — the
crisis / internal-uprising system (ADR 0034/0035/0036) is retired, and anti-fizzle
is structural (ADR 0042 §3). 'No judged scorecard' stands, strengthened: nothing
but capital fall ever names a winner." (Retain the no-scorecard identity — it is
now literal.)

### C11 — Phase 2 diplomacy
**Current (§ Phase Roadmap, Phase 2):** "Expand diplomacy beyond alliance/war into
tribute, vassalage, threats, betrayal…"
**Proposed:** Re-scope: in a two-realm duel there is no third party to ally with
or betray, and **vassalage** was a multi-realm settlement currency (retired, ADR
0042). Rewrite Phase 2 diplomacy around the duel — the "diplomacy" surface is the
psychological read of the single opponent (bluff, feint, concession) rather than
coalition politics. Flag for the user: whether any multi-realm mode is ever a
future axis (PvP / multiplayer is a separate SPEC-level question, premises
Boundary) is a decision, not assumed here.

---

## Sharpenings (narrow, do not reverse)

### S1 — Principle #2: the uncertainty duel becomes LITERAL
**Current (#2):** "Tension comes from information-asymmetric **simultaneous
commitment** under fog — with learnable-but-never-solvable opponent tendencies —
not from a wall clock."
**Proposed addition (no removal):** append "In the duel this is literal: both
realms commit the whole turn's orders blind, then reveal and resolve together —
poker's bet → showdown, not chess's perfect-information alternation (ADR 0025
made literal; ledger Gate 6)." (Confirms survivor ADR 0025.)

### S2 — Positioning: add the 1v1 / chess.com shape
**Current (§ Positioning):** "A 'simple Civilization': a Civilization-depth world
… operated with a League-of-Legends-shaped hand…"
**Proposed addition:** keep the Civ-world / LoL-hand framing; add "…played as a
**head-to-head 1v1 duel** on a chess.com-shaped competitive product (free core
loop + a judgment-coach subscription; the EVAL BAR 판세 read is the signature
artifact of both)." (The LoL-shaped hand is unchanged; the match is now explicitly
1v1.)

### S3 — Match envelope: end at capital fall, not "a decision point"
**Current (§ Match envelope):** "…a match must end at a **decision point** rather
than by map completion…"
**Proposed:** "…a match must end at **capital fall** rather than by map completion
…" (The wall-clock envelope target itself is unchanged; only the terminus name.)

### S4 — Goal / Core Gameplay Promise: the duel identity up front
**Current:** the Goal and Promise open on generic conquest.
**Proposed:** ensure the duel identity (two realms, capital fall) appears in the
first paragraph of both, so a first-time reader learns the match shape before the
mechanics (subsumes C1/C2; listed as a sharpening because it is presentation, not
a new claim).

---

## Notes for the user

- Nothing above is applied. Approve, edit, or reject item by item; the agent then
  applies the approved set to `SPEC.md` verbatim in one batch and stamps this
  draft as sealed (mirroring the crisis-ending amendment's flow).
- Items C1–C11 are load-bearing (SPEC currently asserts the retired model as
  truth). S1–S4 sharpen and can ride the same batch.
- The Core Design Principles that SURVIVE untouched: #1 land-derived, #3 one
  judgment, #4 deterministic resolution, #6 skill-piercable, #7 blood permanent,
  #8 emergent asymmetry, #9 geography-defines-the-set. Only #5 (termination)
  changes, and #2 sharpens.
