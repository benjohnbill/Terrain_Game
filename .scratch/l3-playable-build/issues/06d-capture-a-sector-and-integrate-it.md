# 06d — Capture a Sector and Integrate It

**What to build:** ground changes hands, and then starts paying its taker. This is
the ticket gate C's ruling R16/R17 was made for, and the one ticket 07 (capital
fall) stands on — R1 makes a capital fall an ordinary sector capture.

**Blocked by:** nothing. 06c — a capture is a battle outcome — and 06e are both
`resolved`. 06e was added as a blocker on 2026-07-31 because an engagement must be
sited on an interior sector before an interior sector can be captured; it **landed
the same day** (`b591f4e`), taking battle-capable sectors from 27 of 56 to all 56.
This is the next executable ticket.

Status: **ready-for-agent** (2026-07-31 — the owed ruling was taken the same day:
the register moves to **sector** grain, MT-② amended. 06e cleared 2026-07-31.)

Specification gates: Wayfinder 10, 12.
Authority: **ADR 0044** + `DECISIONS-OWED.md` R16–R17. ADR 0022 (usable-value
ripening) and ADR 0029 (the lag is uniform across all acquired land) are confirmed
by 0044 and are the mechanism. Match-arc OG-③ governs the limbo interval;
`MAGNITUDE.md` M14 supplies income, force limit and register; MT-② the register.

- [ ] A won battle **transfers control** of the sector, and `MatchState.homeland` is the record that is written. Ticket 05 left it "ordinary mutable state and unwritten so far" precisely so this ticket could answer it rather than have it answered by accident.
- [ ] **Limbo is an interval, not an end state** (ADR 0044). Occupied-but-unintegrated ground pays neither side, exactly as OG-③ says, and then integrates. There is no settlement channel — ADR 0042 retired it — so conquest is itself the channel.
- [ ] Integration runs on the **ADR 0022/0029 ripening lag, unchanged**: a fresh capture starts at **50% usable economy / 60% usable population** and recovers **+10 percentage points per stable turn**. Instant full transfer is barred by the `AGENTS.md` guardrail.
- [ ] **Ripening applies to productivity, not to bodies**: income and the force limit ripen (ADR 0029 names "yield AND military ceiling"); the register is a body count and transfers unripened.
- [ ] **The conscription register is held per sector** (user ruling 2026-07-31, amending R18 iii's grain clause; MT-② carries it at its birthplace). MT-② *derives* the register from `Σ populationValue`, which is a **sector** field, so sector grain is the one that needs no formula. `RealmForces.registers` becomes per-sector, `registerOf`'s callers key on the sector, and `draftOrder`'s bodies bound reads the sector a levy draws on. This modifies ticket 05's landed code and its tests — deliberately.
      **Two premises this checkbox used to carry are already stale — verify before planning around them.** (a) It said ticket 05 flattened the register to one realm-level scalar and asked for province restoration; `game/src/domain/state.ts` already reads `registers: Record<RegionId, number>`, restored by 06a's R19 / ADR 0045 work, so the remaining edit is **province → sector**, a smaller diff. (b) `registerOf` is already grain-agnostic — it takes a sector-id list and returns one number, and the *caller* picks the grain — so it may not need to change at all.
- [ ] **The register succeeds exactly, because sector accounting makes it exact** (R17 superseded, this time by a reading that holds): a captured **sector** carries its own register to the taker. R17's proportional formula — `loser's register × (transferred population ÷ total population)` — was a workaround the realm-level flattening forced, and it is **superseded rather than implemented**. Note *why* the earlier province-grain version of this claim failed, so it is not reintroduced: provinces are not captured, sectors are (`Realm.sectors: SectorId[]`), and a province split across the front line is the normal case — 관중 carries pop 0.5 and 0.97 in one province — so per-province succession still needed a within-province apportionment, which is what R17 was. What R17 was protecting still holds and must be tested: a sector already bled dry carries **few bodies**, so it cannot hand its taker fresh men and resurrect the dead as the enemy's draftees (blood is permanent currency, SPEC).
- [ ] **Conservation is asserted by test, both directions** (OG-③'s R2 rider: never silently discarded). What leaves the loser equals what the taker gains, for every transferred quantity.
- [ ] **Two different laws govern the register, and the tests must say which is which.** Casualties (06c) **destroy** bodies — permanently, because blood is permanent currency (SPEC) — while transfer (this ticket) **moves** them and conserves. A single conservation invariant over the register will therefore fail on casualties and look like a transfer bug. State the two laws separately and test them separately.
- [ ] **`conquest damage` is a named seam with an identity default (1.0), not an omission.** The phrase appears in ADR 0029 and the match-arc `정산` GLOSSARY row — "vs conquest damage + M6 inheritance cost" — and **no rule or value anywhere defines it**; its only contrast was settlement, which ADR 0042 retired, so it currently floats. It is also a live candidate device for the deferred snowball-counterweight session, where "freshly taken ground is weakly held" is exactly what directions (a) and (b) want. So: put the seam in at identity, so that session lands a **value change rather than a redesign** — the same discipline 06b applies to the HELD recovery condition. Note the tension it must resolve: 노화 헌법 P2 allows permanent damage only through identity acts (초토화, out of scope by R9), so conquest damage cannot be permanent and would have to act on recovery speed — which is what the ripening lag already does. Do not resolve that overlap here.
- [ ] `registerOf`'s docstring is corrected. It currently reads "Losing land does not [shrink the register] … which is why this is called once at setup and never recomputed from holdings", citing ledger D5.3 — whose corollary ADR 0044 dissolved. The register is still not *recomputed from holdings*; it is now *moved by transfer*, and the comment must say which.
- [ ] `RealmView`'s two scopes finally diverge and both stay correct: `population`/`economy` are **control** sums, `landValue`/`yield`/`forceLimit` are **holdings** sums. Ticket 05 named the distinction and noted it diverges "from the first capture onward" — that is this ticket.
- [ ] **Garrison regeneration is not a mechanism — it is recruitment plus a destination** (R18 i/ii). There is no garrison-regen rate to implement and no standing pulse. Two consequences, both of which reuse machinery that already exists:
  - **A garrison fills by transfer** from the field army. Transfer costs what R12 prices movement at — **turns and fatigue, never 행동력** — because changing posture is moving men. The sector's local cap (`GARRISON_PER_BORDER_SECTOR`, ADR 0014 keeps garrison ceilings local) is the ceiling, so no realm can hide its army behind M5's ×4.8: one sector holds 900 and the whole shield line is 30% of the national ceiling.
  - **Transfer is never free or instant.** An action with no cost is not a decision, and the mechanism exists so that stripping a border to mass a decisive field army is a *gamble* — it costs turns, and the enemy has that window to read.
- [ ] **Direct recruitment into a garrison is out of this slice, as a consequence of R19 rather than as a decision.** Recruitment has no location in the current model, so "raise a levy into *this* wall" has no defined meaning yet; it becomes natural when the deferred siting pass gives recruitment a place. Do not invent it here.
- [ ] **Moving men between postures is in; nothing else about posture is.** Transfer moves *existing* men between the field army and a sector's garrison. It does not add a general force-transfer verb, a garrison-to-garrison move, or any posture beyond these two.
- [ ] **`DOMAIN_MAP`'s `Standing world rule` entry is stale and must be corrected in this ticket's doc-sync** (R18 i): it still lists local-garrison regeneration as a Phase-1 instance consuming no action capacity, which `MAGNITUDE.md` M12's 2026-07-08 amendment (MT-⑤ / ADR 0027) retired. Projection against an amended Production seal is a **sync debt** — the seal wins. ADR 0014's header stamp is owed in the same batch; M12 itself records it as unpaid.
- [ ] The economy's re-measurement is re-run once capture exists: `docs/SYNC-DEBT.md` parks "the economy has no sink once the field fills" as a play question, and conquest is the first mechanism that changes both sides of it.

## Needs-info — none. The one owed ruling was taken 2026-07-31

**The register-succession checkbox above contains a hole, found by the user asking
why the register is held per *province*.** That checkbox rules R17's proportional
formula "**superseded rather than implemented**, because per-province accounting
makes it exact: a captured province carries its own register to the taker."

But **provinces are not captured — sectors are** (`Realm.sectors: SectorId[]`), and a
province split across the front line is the normal case, not an edge case. Measured:
관중 carries pop **0.5** and **0.97** in one province, so a partial capture cannot
carry "its own register" without a within-province apportionment — which is exactly
what R17 was for. MT-② also *derives* the register from `Σ populationValue`, a
**sector** field, while R18 iii stores it per province.

**RULED: the register moves to sector grain** (user, 2026-07-31). MT-② carries the
amendment at its birthplace; R18 iii's grain clause is amended and its other content
stands. Succession becomes exact with **no formula** — a captured sector carries its
own register — so R17's proportional formula is superseded *for real* this time rather
than by an argument that did not hold.

**The two checkboxes above were rewritten to sector grain on 2026-07-31**, closing
the window in which this ticket said "province" at the top and "sector" here. They
had stood contradictory since the ruling landed, and an implementer reading
top-down would have built the wrong grain.

This is the same edit you were already making — ticket 05 flattened the register to one
realm-level scalar and this ticket had to unflatten it regardless; one grain finer is
the same code. WM-⑤'s register return (rout survivors leaving service, at a sector) is
consistent with it for the first time.

What R17 protected is still owed a test: a sector already bled dry carries few bodies,
so it cannot hand its taker fresh men and resurrect the dead as the enemy's draftees.

Everything below still holds, and nothing else is owed.

## Zero unlanded values (recomputed 2026-07-26)

**The garrison regeneration rate was owed and is now moot, not filled in.** This
ticket was blocked on it: `MAGNITUDE.md` M5 exports "garrison regeneration rates" to
later stages by name, and the search for a receiving stage is what produced R18.
Two findings, in order:

1. **A rate does exist** — M12 item 1, `+10% of sustainable cap`, twice amended
   (2026-07-07 MT-① made it bill the register; 2026-07-08 MT-⑤ / ADR 0027 made it
   purchased per committed action rather than automatic). The agent's earlier
   "genuinely unlanded" verdict was wrong: M5 exported it and **M12 received it**.
2. **Then R18 dissolved the question entirely.** Garrison regeneration is not a
   mechanism with a rate — it is recruitment plus a destination, and a garrison
   fills by transfer at the movement price R12 already sealed. There is no second
   rate to own, which is why M12's +10% is not implemented here.

Sealed, so not owed: the ripening fractions (50/60, +10pp — ADR 0022/0029), what
transfers at all (R16), register succession (R17 as simplified by R18 iii), the
recruitment rate (`RECRUIT_FRACTION_PER_POINT` 0.01, MT-③/R10), transfer timing
(march speed 3, WB-M②), and the local garrison ceiling (`GARRISON_PER_BORDER_SECTOR`
900, M13a + ADR 0014).

**Out of this ticket, and both must stay out:** recruitment siting and the turn
budget it reopens (**R19** — a separate pass; do not give recruitment a location
here), and `conquest damage`'s definition (a seam at identity 1.0, above).

### Two cautions for whoever builds this

**Read the strikethroughs.** M13 carries a struck-through "+10% of cap per turn"
that reads like a live rule and is not one; ruling R10 rejected a rate cap derived
from exactly that line while MT-③'s "+1%p per point" sat sealed two lines away. This
ticket works in the same neighbourhood of the same document, and the trap fired
twice in the session that wrote this ticket.

**Recompute readiness rather than trusting this line.** R6's second test is the
builder's to re-run at claim time. The header of this ticket has been wrong before.
