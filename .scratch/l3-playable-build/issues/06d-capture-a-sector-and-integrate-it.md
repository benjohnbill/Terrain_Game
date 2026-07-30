# 06d — Capture a Sector and Integrate It

**What to build:** ground changes hands, and then starts paying its taker. This is
the ticket gate C's ruling R16/R17 was made for, and the one ticket 07 (capital
fall) stands on — R1 makes a capital fall an ordinary sector capture.

**Blocked by:** nothing. 06c — a capture is a battle outcome — and 06e are both
`resolved`. 06e was added as a blocker on 2026-07-31 because an engagement must be
sited on an interior sector before an interior sector can be captured; it **landed
the same day** (`b591f4e`), taking battle-capable sectors from 27 of 56 to all 56.
This is the next executable ticket.

Status: **resolved, with two items reported open** (2026-07-31, branch
`l3/ticket-06d-capture-a-sector` — claimed off `c37dfdc`, rebased onto `e77f7ff`.
The open items are the economy re-measurement, whose trigger is ticket 13, and
garrison → field posture transfer, which is HELD pending a user ruling on the wear
ledger across a posture change. Both are marked in the list below and registered on
`docs/SYNC-DEBT.md`. It was `ready-for-agent` earlier the same day, once the
register moved to **sector** grain with MT-② amended and 06e cleared.)

**A second grain ruling was owed and is taken (user, 2026-07-31).** The register's
move to sector grain does not stand alone: `OriginComposition` is keyed by the same
type, and `availableCivilians = register − serving` joins the two on one key. Moving
only the register makes `#removeDead` throw on **every** casualty
(`runtime.ts` indexes `registers[region]` with a key taken from `origins`), so the
ticket could not be built either way without the answer. **RULED: origin composition
moves to sector grain with the register.** That is the reading under which the
sector ruling's own stated benefit — succession exact with no formula — is real:
`civilians(sector) = registers[sector] − servingFrom(sector)`, and a capture
transfers exactly that. The rejected alternative (origins stay per province and the
join rolls up) requires a within-province apportionment to value one captured
sector's civilians, which is R17 restored — the formula this ruling supersedes.
This **amends ADR 0045**, whose paperwork landed independently and in parallel as
**ADR 0047** (`467a276`) — the same ruling, reached on the same reasoning, with
ADR 0045's header, match-arc MT-⑥ and `docs/adr/README.md` all stamped there. This
session authored no second set of stamps.

Two corrections to the sentence above, from reconciling with 0047:

- the amended items are **2, 3, 4 and 5**, not 2/4/5. Item 3's "Province-local
  civilian shortages prorate" moved with the rest: the batch's scarcity bucket is
  now keyed on the sector (`settleRecruitmentBatch`), and its `'province'` limit
  label is now `'sector'`. 0047's list is the right one.
- ADR 0045's **title is deliberately left alone**, and that is correct rather than
  an omission. The supersession protocol's instrument is a header stamp, not a
  rewrite — "never silently edit an accepted ADR" — so a title reading
  "Province-Origin Accounting" under a banner announcing its amendment is the
  protocol working as intended.

One thing this session found that 0047 does not carry, offered rather than
inserted: the half-move fails **unconditionally**, not in a corner case.
`runtime.ts`'s `#removeDead` indexes `registers[region]` with a key taken from a
cohort's `origins`, so a sector-keyed register against province-keyed origins
throws on *every* casualty. 0047 argues from a partial capture at high
mobilization, which is the same conclusion from a narrower case.

Specification gates: Wayfinder 10, 12.
Authority: **ADR 0044** + `DECISIONS-OWED.md` R16–R17. ADR 0022 (usable-value
ripening) and ADR 0029 (the lag is uniform across all acquired land) are confirmed
by 0044 and are the mechanism. Match-arc OG-③ governs the limbo interval;
`MAGNITUDE.md` M14 supplies income, force limit and register; MT-② the register.

- [x] A won battle **transfers control** of the sector, and `MatchState.homeland` is the record that is written. Ticket 05 left it "ordinary mutable state and unwritten so far" precisely so this ticket could answer it rather than have it answered by accident.
- [x] **Limbo is an interval, not an end state** (ADR 0044). Occupied-but-unintegrated ground pays neither side, exactly as OG-③ says, and then integrates. There is no settlement channel — ADR 0042 retired it — so conquest is itself the channel.
- [x] Integration runs on the **ADR 0022/0029 ripening lag, unchanged**: a fresh capture starts at **50% usable economy / 60% usable population** and recovers **+10 percentage points per stable turn**. Instant full transfer is barred by the `AGENTS.md` guardrail.
- [x] **Ripening applies to productivity, not to bodies**: income and the force limit ripen (ADR 0029 names "yield AND military ceiling"); the register is a body count and transfers unripened.
- [x] **The conscription register is held per sector** (user ruling 2026-07-31, amending R18 iii's grain clause; MT-② carries it at its birthplace). MT-② *derives* the register from `Σ populationValue`, which is a **sector** field, so sector grain is the one that needs no formula. `RealmForces.registers` becomes per-sector, `registerOf`'s callers key on the sector, and `draftOrder`'s bodies bound reads the sector a levy draws on. This modifies ticket 05's landed code and its tests — deliberately.
      **Two premises this checkbox used to carry are already stale — verify before planning around them.** (a) It said ticket 05 flattened the register to one realm-level scalar and asked for province restoration; `game/src/domain/state.ts` already reads `registers: Record<RegionId, number>`, restored by 06a's R19 / ADR 0045 work, so the remaining edit is **province → sector**, a smaller diff. (b) `registerOf` is already grain-agnostic — it takes a sector-id list and returns one number, and the *caller* picks the grain — so it may not need to change at all.
- [x] **The register succeeds exactly, because sector accounting makes it exact** (R17 superseded, this time by a reading that holds): a captured **sector** carries its own register to the taker. R17's proportional formula — `loser's register × (transferred population ÷ total population)` — was a workaround the realm-level flattening forced, and it is **superseded rather than implemented**. Note *why* the earlier province-grain version of this claim failed, so it is not reintroduced: provinces are not captured, sectors are (`Realm.sectors: SectorId[]`), and a province split across the front line is the normal case — 관중 carries pop 0.5 and 0.97 in one province — so per-province succession still needed a within-province apportionment, which is what R17 was. What R17 was protecting still holds and must be tested: a sector already bled dry carries **few bodies**, so it cannot hand its taker fresh men and resurrect the dead as the enemy's draftees (blood is permanent currency, SPEC).
- [x] **Conservation is asserted by test, both directions** (OG-③'s R2 rider: never silently discarded). What leaves the loser equals what the taker gains, for every transferred quantity.
- [x] **Two different laws govern the register, and the tests must say which is which.** Casualties (06c) **destroy** bodies — permanently, because blood is permanent currency (SPEC) — while transfer (this ticket) **moves** them and conserves. A single conservation invariant over the register will therefore fail on casualties and look like a transfer bug. State the two laws separately and test them separately.
- [x] **`conquest damage` is a named seam with an identity default (1.0), not an omission.** The phrase appears in ADR 0029 and the match-arc `정산` GLOSSARY row — "vs conquest damage + M6 inheritance cost" — and **no rule or value anywhere defines it**; its only contrast was settlement, which ADR 0042 retired, so it currently floats. It is also a live candidate device for the deferred snowball-counterweight session, where "freshly taken ground is weakly held" is exactly what directions (a) and (b) want. So: put the seam in at identity, so that session lands a **value change rather than a redesign** — the same discipline 06b applies to the HELD recovery condition. Note the tension it must resolve: 노화 헌법 P2 allows permanent damage only through identity acts (초토화, out of scope by R9), so conquest damage cannot be permanent and would have to act on recovery speed — which is what the ripening lag already does. Do not resolve that overlap here.
- [x] `registerOf`'s docstring is corrected. It currently reads "Losing land does not [shrink the register] … which is why this is called once at setup and never recomputed from holdings", citing ledger D5.3 — whose corollary ADR 0044 dissolved. The register is still not *recomputed from holdings*; it is now *moved by transfer*, and the comment must say which.
- [x] `RealmView`'s two scopes finally diverge and both stay correct: `population`/`economy` are **control** sums, `landValue`/`yield`/`forceLimit` are **holdings** sums. Ticket 05 named the distinction and noted it diverges "from the first capture onward" — that is this ticket.
- [x] **Garrison regeneration is not a mechanism — it is recruitment plus a destination** (R18 i/ii). There is no garrison-regen rate to implement and no standing pulse. Two consequences, both of which reuse machinery that already exists:
  - **A garrison fills by transfer** from the field army. Transfer costs what R12 prices movement at — **turns and fatigue, never 행동력** — because changing posture is moving men. The sector's local cap (`GARRISON_PER_BORDER_SECTOR`, ADR 0014 keeps garrison ceilings local) is the ceiling, so no realm can hide its army behind M5's ×4.8: one sector holds 900 and the whole shield line is 30% of the national ceiling.
  - **Transfer is never free or instant.** An action with no cost is not a decision, and the mechanism exists so that stripping a border to mass a decisive field army is a *gamble* — it costs turns, and the enemy has that window to read.
- [x] **Direct recruitment into a garrison is out of this slice, as a consequence of R19 rather than as a decision.** Recruitment has no location in the current model, so "raise a levy into *this* wall" has no defined meaning yet; it becomes natural when the deferred siting pass gives recruitment a place. Do not invent it here.
- [~] **Moving men between postures is in; nothing else about posture is.** Transfer moves *existing* men between the field army and a sector's garrison. It does not add a general force-transfer verb, a garrison-to-garrison move, or any posture beyond these two.
      **HALF LANDED. Field → garrison is in; garrison → field is HELD, and needs a
      user ruling.** The direction out cannot be implemented without a rule for **what
      a man's wear is after standing in a shield**, and no seal has one. A garrison
      keeps no wear ledger (06c), so men entering have nowhere to carry wear and men
      leaving would be minted at zero — and since both intents sit in one decision
      window and headroom reopens after each move out, an exhausted army on any of its
      own muster hexes could round-trip its whole wear away, free and repeatedly. That
      defeats 06b's convex wear curve, and R18 (ii) rejected a free transfer in as many
      words. Each candidate fix needs a statement that does not exist: a garrison wear
      ledger (the state 06c refused), a transfer wear price (a new dial R18's "zero new
      pricing devices" forbids), or a same-window restriction (a new rule). So the
      intent is **unwired rather than half-done** — it takes the ordinary
      unwired-intent rejection, a test pins that so the hole cannot close by accident,
      and `docs/SYNC-DEBT.md` carries the seam. Found by this ticket's own code review,
      not at design time. **Scaling the ticket down is not the agent's call**, so this
      is reported rather than absorbed: it is the one place 06d does less than the
      ticket asked.
- [x] **`DOMAIN_MAP`'s `Standing world rule` entry is stale and must be corrected in this ticket's doc-sync** (R18 i): it still lists local-garrison regeneration as a Phase-1 instance consuming no action capacity, which `MAGNITUDE.md` M12's 2026-07-08 amendment (MT-⑤ / ADR 0027) retired. Projection against an amended Production seal is a **sync debt** — the seal wins. ADR 0014's header stamp is owed in the same batch; M12 itself records it as unpaid.
- [ ] The economy's re-measurement is re-run once capture exists: `docs/SYNC-DEBT.md` parks "the economy has no sink once the field fills" as a play question, and conquest is the first mechanism that changes both sides of it.
      **NOT DONE, and deliberately so — this is the one acceptance item this session
      leaves open.** It asks for a *measurement*, and the mechanism it would measure
      is a sink that only opens over a played match: conquest raises the ceiling the
      treasury has to chase, and reading whether the sink is real needs a run to
      capital fall. That is ticket **13**, and every threshold that would judge it is
      gate **10**'s (which is also why `verify:game` reports parity as PENDING).
      Re-running it here would produce a number nothing is authorised to read.
      Registered rather than silently dropped — the SYNC-DEBT row stands and now has
      its trigger: the first full-depth match.

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

### The grain ruling reaches origin composition too — ADR 0047, 2026-07-31

**Read this before planning the register work; it changes this ticket's size.**

Moving the register alone was not implementable. The register and
`OriginComposition` were keyed by the same type and joined by one subtraction —
`availableCivilians = register − serving` — which `game/src/domain/force.ts`
enforces with a **throw**. Measured: at MT-③'s structural-maximum mobilization
(58%), a realm that loses `r6_s5` and `r6_s1` of 관중 has 5,280 register against
6,264 serving, and the Runtime refuses. ADR 0046 made that reachable by turning
every interior sector into a battle site.

Three readings were put to the user. Transferring the whole sector register would
have demoted the invariant to a clamp and abandoned total-bodies accounting;
apportioning a province's serving bodies across its sectors would have restored
R17 hours after MT-② retired it. **The user ruled the third: origin composition
moves to sector grain as well** (ADR 0047), on the ground that population,
civilians, the register and origin are facts about the same object.

What that adds to this ticket:

- `OriginComposition` becomes `Record<SectorId, number>` — 68 `RegionId`-keyed
  sites across 11 files, though **not all of them move**: `Realm.regions`,
  `Sector.regionId`, the partition and the world schema stay region-keyed, because
  what moved is *population accounting*, not the region concept.
- `ProvinceForcesView` is sector-keyed and renamed — a **public projection
  contract change**, so its callers move with it.
- Recruitment scarcity is sector-local, and legality reads the sector's own
  register rather than ADR 0045 item 2's "parent province register", which has no
  referent for a split province.
- The opening origin derivation allocates over sector capacities with canonical
  sector-id remainders (ADR 0045 item 5 at the finer grain).

The positive result is that **nothing needs a within-province apportionment
anywhere**: R17 stays superseded, MT-②'s "no formula at all" holds, and WM-⑤'s
rout survivors return to a sector register that exists. Authority: **ADR 0047**;
ADR 0045 and MT-⑥ carry its stamps.

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

## Comments

### Implementation evidence — 2026-07-31

- Commits: `5cbb8b0` (claim + the owed grain ruling), `9064a19` (sector grain),
  `c029de0` (capture, limbo, ripening), `54f64b6` (posture transfer). Branch
  `l3/ticket-06d-capture-a-sector`, claimed off `c37dfdc` and rebased onto
  `e77f7ff` once the parallel doc batch landed.
- Production authority: **ADR 0044** (what acquired land transfers, items 1–5),
  **ADR 0045** items 2/3/4/5 + item 7 (origin accounting, and a captured
  not-yet-ready cohort as a permanent loss) as **ADR 0047** amends them,
  **ADR 0022** (the ripening fractions *and* the three-clause stable-turn test),
  **ADR 0029** (the lag is uniform, and names yield AND the military ceiling),
  match-arc **MT-②** (register, amended to sector grain 2026-07-31) and **OG-③**
  (limbo), **M13a** / `GARRISON_PER_BORDER_SECTOR` + **ADR 0014** (local garrison
  ceilings), **R12**/**R18** (transfer priced by movement, zero new devices),
  **WM-⑤** (leaving service), **SPEC** (blood is permanent currency).
- Narrow tests: `game/tests/capture.test.js`, new — 20 tests covering the grain,
  the capture, limbo, integration, ripening to the authored ceiling, the three
  register laws separately, and both transfer directions.
- Shared gates: `npm run verify:game` → typecheck / build:runtime / build:viewer /
  test:node / test:browser all **PASS**, `parity` **PENDING by gate 10 as
  designed** (exit 2 is the expected green). **237** Node, **21** browser.
  `npm test` **562/562**. `npm run lint:docs` **0 blocking / 12 advisory**.
- Runtime check: world `terrain-cradle@r1`, seed `turn-0001` (06c/06e's battle
  fixture, reused because its partition puts an enemy front sector inside the
  opening army's first march). Both hosts produce `12bb82b340784101`, identical.
- **The parity world identity moved**, from `29f214a11fc56ef8` to
  `12bb82b340784101`. Expected, not a regression: the replay summary carries the
  economy's per-place rows and those rows are now per sector. The check compares
  the two hosts rather than a stored golden, and they still agree.
- Legacy evidence disposition: none consulted. Every value is cited from a
  Production seal or an ADR; nothing was read from `js/`, `tests/` or `mockup/`.

#### Three things found by building, which the ticket did not predict

1. **A bled-dry sector can still hand over bodies.** The ticket asked for a test
   that it cannot. It can, and by seal: a routed shield leaves service (WM-⑤ (v))
   and lands back in *that sector's* civilian pool moments before the ground
   changes hands — which is exactly the consequence the geography/battle grill
   ruled knowingly when it chose (v) over returning survivors to their origin. The
   test now asserts the bound that actually holds: handed over + still serving +
   dead equals what stood there, and the nominal register is never what arrives.
2. **A shield can survive on ground that falls.** `sectorFalls` is `attackerWins`,
   while a rout additionally needs losses past `ROUT_FRACTION` and a non-DELAYING
   method — so a narrow win takes the sector with part of the shield standing, and
   06e's rout path never sees those men. Because `state.garrisons` is keyed by
   sector, the taker would have counted them as its own and the conservation check
   would have thrown. Closed by assembly, not by a new rule: ADR 0045 item 4 bars
   the taker keeping them, a mobile garrison is the system 06b/06c refused, and the
   capital guard is 07's unbuilt `needs-info` — leaving WM-⑤ (v), which covers "a
   locality-fixed shield with no locality left" by its own stated reasoning.
   Forming cohorts are ADR 0045 item 7's permanent loss.
3. **Limbo's length was never stated, and follows from ADR 0022 rather than from a
   choice.** Its stable turn requires the sector to end the turn under the same
   faction, uncontested, and not the target of attack resolution. The capture turn
   fails all three, so limbo is exactly that turn and integration is the next
   stable one. Recorded because it reads like a dial and is not one.

#### The code review changed the shipped result, twice

Both axes ran with `main`'s live rulings named up front, and both found real
defects rather than style.

- **Origin composition drifted on every posture transfer.** The transfer took its
  two halves from two separate `subtractOrigins` calls, which conserve the total
  and not the composition — `{A:3,B:3}` split at 1 sums to `{A:2,B:4}`. Since
  origin is joined to the register by `register − serving`, that drift ends as a
  negative civilian count mid-match. The round-trip test had passed because it only
  asserted totals. Fixed by exporting the one-apportionment `partitionOrigins` and
  having `withdrawFromDetachment` return both halves; a new test asserts every
  sector's serving count is identical origin by origin across a transfer.
- **The garrison → field direction was silently free.** See the held item above.
  This is the review's most valuable catch: it was a wear-laundering machine that
  would have reached playtest looking like a balance problem in 06b's curve.

Three over-claims were also corrected rather than defended: limbo's length is a
reading assembled from three statements rather than a deduction from ADR 0022
alone; ADR 0022's clauses 2 and 3 collapse into one `battleSites` test and the
collapse is now argued; and the recapture exemption is deleted, since ADR 0029
makes the lag uniform and OG-③'s "pre-war usable" scopes to channels ADR 0042
retired.

#### Follow-ups

- The economy re-measurement above, unpaid on purpose — trigger is ticket 13's
  first full-depth match, thresholds are gate 10's.
- Offered to the parallel session rather than inserted: ADR 0047's § Context
  argues the half-move from a partial capture at high mobilization; the failure is
  actually unconditional (`#removeDead` indexes `registers[region]` with a key
  from `origins`, so *every* casualty throws). Their ADR, their call.
