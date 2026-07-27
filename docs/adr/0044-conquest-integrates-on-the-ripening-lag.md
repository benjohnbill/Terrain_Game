# ADR 0044: Conquest Integrates — Acquired Land Transfers Fully on the Ripening Lag

Date: 2026-07-26

Status: Accepted (sealed 2026-07-26, Wayfinder gate C, rulings R16–R17)
Amended by: ADR 0045 (2026-07-26) — item 4 transfers remaining civilians with
land; serving province-origin composition remains with its force and permanent
losses reduce that origin's register share.

- Relationship:
  - **Amends (2 seals, not ADRs):** match-arc `OG-③` — occupied-untransferred
    limbo stops being a terminal state and becomes the interval before
    integration; `MAGNITUDE.md` M14 ruling ⑮ — its conclusion is retained on new
    grounds, its original grounds having been retired by ADR 0042. Both carry the
    stamp duty in the same doc-sync batch (seal-amends and ADR-amends-seal alike).
  - **Dissolves (1):** duel-pivot ledger `D5.3`'s corollary that land loss never
    shrinks the conscription register. It was a deduction from permanent limbo, not
    an independent seal — see § Context.
  - **Confirms (2):** ADR 0022 (usable-value ripening on newly captured sectors)
    and ADR 0029 (the integration lag is uniform across all acquired land). Both
    survive the duel pivot intact, and this ADR supplies the transfer channel they
    lost.
  - **Bounded by:** the `AGENTS.md` design guardrail against instant full-value
    transfer on conquest; ADR 0042 (capital fall is the sole win condition).
- Mandatory-ADR trigger: this changes a **cross-feature model**. What conquered
  land pays is read by the economy, by the force limit, by recruitment, and by
  every closure argument in the match arc.
- Authority for the decision itself: user, Wayfinder gate C. This ADR records it.

## Context

Ticket 06 cannot take a sector without knowing what a taken sector does.
`DECISIONS-OWED.md` Part 2 #15 recorded the question as M14 ⑮ ("conquest raises
the national cap") against OG-③ (occupied-untransferred land "counts toward
NEITHER side"). The row was found by the ticket-05 code review, which caught the
implementation answering it by accident: a frozen homeland record had made limbo
permanent.

Reading both sides in full showed the framing was wrong. **Both seals were damaged
by the same ADR**, and neither was in a position to win:

- **M14 ⑮'s grounds were about a retired win condition.** Its argument was that a
  static-cap world cannot end — "96% of matches never trip the hegemony check;
  leadership is arithmetically unreachable" — and therefore "cap growth is the
  match's ending mechanism". ADR 0042 retired the hegemony check. The premise no
  longer exists.
- **OG-③ lost its exit.** Limbo was resolved at settlement, and ADR 0042 retired
  settlement as a terminus. Occupied land had no path to integrated.

A third seal turned out to sit downstream of OG-③ rather than beside it.
Ledger **D5.3** ruled that losing a sector does not shrink the register, and its
own stated reasoning is a chain: limbo is where occupied land stays → the register
moves only by settlement transfer → a single-war duel has no settlement →
therefore the register never moves. D5.3 also flagged its own doubt as an L3
watch: "whether 'occupation doesn't shrink the register' reads wrong to a player
(lost half my land, why is my register intact?)".

So the question was not which seal survives. It was what a duel should do, given
that all three statements were written for a world with a different ending.

## Decision

1. **Acquired land transfers everything the land carries** — population, economy,
   the conscription register share, and the mobilization base. This follows from
   the Tier-0 principle **land-derived state**: quantities derived from land travel
   with it. Mobilization intensity needs no rule, being already a derived ratio.

2. **The transfer runs on the ADR 0022/0029 ripening lag, unchanged** — fresh
   capture at 50% usable economy and 60% usable population, recovering +10
   percentage points per stable turn. Conquest is now the transfer channel that
   settlement used to be; the lag it was always subject to is unchanged.

3. **Ripening applies to productivity, not to bodies.** ADR 0029 names "yield AND
   military ceiling", so income and the force limit ripen. The register is a body
   count and transfers unripened.

4. **The register succeeds in proportion to the accumulated stock**, not to the
   land's nominal value: the taker gains
   `loser's current register × (transferred population ÷ loser's total population)`
   and the loser's register falls by the same amount. Conservation holds, per
   OG-③'s R2 rider. The nominal reading (`registerPerPop × populationValue`) is
   rejected because a province already bled dry would hand its taker fresh bodies,
   resurrecting dead men as the enemy's draftees and breaking the SPEC principle
   that blood is permanent currency.

5. **The ripening lag is not a risk device.** It is the fruit arriving slowly. This
   is recorded because the opposite reading was proposed and rejected: ADR 0029's
   phrase "the ~4-turn ripening transient is the counterattack window" describes a
   contestability property, and promoting it into an anti-runaway mechanism
   overstates it.

6. **Snowball is accepted as inherent to a conquest game, and is not to be
   countered by limiting growth from land.** Counterweights belong outside the
   transfer rule. Three directions are recorded as input to a later session and are
   deliberately **not** designed here:
   - the defender's structural advantage, which is already mechanical — M5 gives
     defense up to ×2.0 terrain × ×2.4 fortification = ×4.8 while M2's commit lever
     is symmetric at ×1.00–×2.00, so at equal commit the defender holds an
     asymmetric edge the attacker pays for in substance. The formula being a
     product is what makes levers cheaper than mass;
   - holding out and counterattacking into an Opening (the sealed situation axis);
   - breadth costing cognitive load and coarsening the commit-allocation unit, so
     the risk unit grows with the realm. This one has no device anywhere and is the
     genuinely new work.

## Consequences

- **Ticket 06 can take a sector.** `MatchState.homeland` — left deliberately
  mutable and unwritten by ticket 05 — is the record the capture path writes, and
  `holdsOf`'s documented open question is answered.
- **Closure no longer depends on cap growth.** Under ADR 0042 the match ends at a
  capital, and D6.4's land decay (implemented in ticket 05) is the convergence
  engine. Cap growth is retained because land-derived state implies it, not because
  the match needs it to end. This is the substantive difference from M14 ⑮'s
  original reasoning and the reason ⑮ is amended rather than merely cited.
- **Conquest becomes additive as well as subtractive**, so the swing on taking a
  rich sector is now triple: the loser's income and ceiling fall, the taker's rise
  after ripening, and bodies move. Combined with land decay this shortens matches;
  the 15–30 minute envelope is a measurement target for the played match, not a
  claim made here.
- **Stamps owed in the same doc-sync batch:** OG-③ and its `Limbo` GLOSSARY row
  (limbo is an interval, not an end state); M14 ⑮ (grounds re-based); D5.3 in the
  duel-pivot ledger (corollary dissolved, with the reason).
- **Owed, research-only:** a survey of precedents for the three counterweight
  directions above, for user confirmation and then a document. Explicitly not a
  design pass, by user ruling.
