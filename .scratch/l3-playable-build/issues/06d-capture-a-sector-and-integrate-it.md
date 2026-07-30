# 06d — Capture a Sector and Integrate It

**What to build:** ground changes hands, and then starts paying its taker. This is
the ticket gate C's ruling R16/R17 was made for, and the one ticket 07 (capital
fall) stands on — R1 makes a capital fall an ordinary sector capture.

**Blocked by:** 06c — a capture is a battle outcome. **And 06e** (added 2026-07-31):
an engagement must be sited on an interior sector before an interior sector can be
captured. Until 06e lands, only authored-border endpoints can change hands — 27 of
56 sectors.

Status: **needs-info** (re-statused 2026-07-31 — one ruling is owed; see
§ Needs-info. Was `ready-for-agent` from 2026-07-26, when R18/R19 closed the
garrison-regen question.)

Specification gates: Wayfinder 10, 12.
Authority: **ADR 0044** + `DECISIONS-OWED.md` R16–R17. ADR 0022 (usable-value
ripening) and ADR 0029 (the lag is uniform across all acquired land) are confirmed
by 0044 and are the mechanism. Match-arc OG-③ governs the limbo interval;
`MAGNITUDE.md` M14 supplies income, force limit and register; MT-② the register.

- [ ] A won battle **transfers control** of the sector, and `MatchState.homeland` is the record that is written. Ticket 05 left it "ordinary mutable state and unwritten so far" precisely so this ticket could answer it rather than have it answered by accident.
- [ ] **Limbo is an interval, not an end state** (ADR 0044). Occupied-but-unintegrated ground pays neither side, exactly as OG-③ says, and then integrates. There is no settlement channel — ADR 0042 retired it — so conquest is itself the channel.
- [ ] Integration runs on the **ADR 0022/0029 ripening lag, unchanged**: a fresh capture starts at **50% usable economy / 60% usable population** and recovers **+10 percentage points per stable turn**. Instant full transfer is barred by the `AGENTS.md` guardrail.
- [ ] **Ripening applies to productivity, not to bodies**: income and the force limit ripen (ADR 0029 names "yield AND military ceiling"); the register is a body count and transfers unripened.
- [ ] **The conscription register is held per province, not per realm** (R18 iii). MT-②, M13 and the match-arc GLOSSARY all say `registerPerPop × Σ populationValue, **per province**`; ticket 05 flattened it to one realm-level scalar. Restore it: `RealmForces.register` becomes per-province, `registerOf` returns per-province values, and `draftOrder`'s bodies bound reads the province a levy draws on. This modifies ticket 05's landed code and its tests — deliberately.
- [ ] **The register succeeds exactly, because per-province accounting makes it exact** (R17 as simplified by R18 iii): a captured province carries **its own register** to the taker. R17's proportional formula — `loser's register × (transferred population ÷ total population)` — was a workaround the flattening forced, and it is **superseded rather than implemented**. What R17 was protecting still holds and must be tested: a province already bled dry carries **few bodies**, so it cannot hand its taker fresh men and resurrect the dead as the enemy's draftees (blood is permanent currency, SPEC).
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

## Needs-info — one ruling owed (2026-07-31)

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

So either R17 stands after all, or the register moves to **sector** grain. It decides
whether an accepted simplification survives, which makes it a **user ruling, not a
value**. WM-⑤'s register return (rout survivors leaving service) lands at a sector
too, so it shares the answer. Registered in `docs/SYNC-DEBT.md`.

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
