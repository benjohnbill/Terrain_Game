# 06d — Capture a Sector and Integrate It

**What to build:** ground changes hands, and then starts paying its taker. This is
the ticket gate C's ruling R16/R17 was made for, and the one ticket 07 (capital
fall) stands on — R1 makes a capital fall an ordinary sector capture.

**Blocked by:** 06c — a capture is a battle outcome.

Status: needs-info — see § Needs-info.

Specification gates: Wayfinder 10, 12.
Authority: **ADR 0044** + `DECISIONS-OWED.md` R16–R17. ADR 0022 (usable-value
ripening) and ADR 0029 (the lag is uniform across all acquired land) are confirmed
by 0044 and are the mechanism. Match-arc OG-③ governs the limbo interval;
`MAGNITUDE.md` M14 supplies income, force limit and register; MT-② the register.

- [ ] A won battle **transfers control** of the sector, and `MatchState.homeland` is the record that is written. Ticket 05 left it "ordinary mutable state and unwritten so far" precisely so this ticket could answer it rather than have it answered by accident.
- [ ] **Limbo is an interval, not an end state** (ADR 0044). Occupied-but-unintegrated ground pays neither side, exactly as OG-③ says, and then integrates. There is no settlement channel — ADR 0042 retired it — so conquest is itself the channel.
- [ ] Integration runs on the **ADR 0022/0029 ripening lag, unchanged**: a fresh capture starts at **50% usable economy / 60% usable population** and recovers **+10 percentage points per stable turn**. Instant full transfer is barred by the `AGENTS.md` guardrail.
- [ ] **Ripening applies to productivity, not to bodies**: income and the force limit ripen (ADR 0029 names "yield AND military ceiling"); the register is a body count and transfers unripened.
- [ ] The **register succeeds in proportion to the accumulated stock** (R17): the taker gains `loser's current register × (transferred population ÷ loser's total population)` and the loser's register falls by the same amount. **Not** the land's nominal `registerPerPop × populationValue` — a province already bled dry would otherwise hand its taker fresh bodies, resurrecting dead men as the enemy's draftees.
- [ ] **Conservation is asserted by test, both directions** (OG-③'s R2 rider: never silently discarded). What leaves the loser equals what the taker gains, for every transferred quantity.
- [ ] `registerOf`'s docstring is corrected. It currently reads "Losing land does not [shrink the register] … which is why this is called once at setup and never recomputed from holdings", citing ledger D5.3 — whose corollary ADR 0044 dissolved. The register is still not *recomputed from holdings*; it is now *moved by transfer*, and the comment must say which.
- [ ] `RealmView`'s two scopes finally diverge and both stay correct: `population`/`economy` are **control** sums, `landValue`/`yield`/`forceLimit` are **holdings** sums. Ticket 05 named the distinction and noted it diverges "from the first capture onward" — that is this ticket.
- [ ] **Garrison regeneration** lands here (R9 held it for the 06 family): a captured sector's shield, and a damaged one's recovery, as a standing world rule that consumes no faction action capacity (ADR 0026) and **bills the register** (M13/P1 — no free man).
- [ ] The economy's re-measurement is re-run once capture exists: `docs/SYNC-DEBT.md` parks "the economy has no sink once the field fills" as a play question, and conquest is the first mechanism that changes both sides of it.

## Needs-info

**One genuinely unlanded value: the garrison regeneration rate.** `MAGNITUDE.md`
M5 exports it to later stages by name — "garrison regeneration rates" — and no
later stage received it, so no birthplace records a rate. This is a kind-2
undetermined 가안: bring the user a table (value name / why nothing runs without it
/ a starting value derived from a neighbouring seal, most likely M13a's g₀ = 1.0
border seeding and the ρ garrison:field ratio / that derivation / what play would
reveal). **Do not originate the number.**

**Read the strikethroughs before deriving.** M13 carries a struck-through
"+10% of cap per turn" that reads like a live rule and is not one; ruling R10
rejected a rate cap derived from exactly that line, and MT-③'s "+1%p per point" was
sealed two lines away. This ticket is in the same neighbourhood of the same
document.

**Sealed, so not owed:** the ripening fractions (50/60, +10pp — ADR 0022/0029), the
register succession rule (R17), and what transfers at all (R16).
