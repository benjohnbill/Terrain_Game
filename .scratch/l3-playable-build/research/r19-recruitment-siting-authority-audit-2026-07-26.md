# R19 Recruitment-Siting Authority Audit — 2026-07-26

**Conclusion:** R19's sector-grain recruitment siting is **not sealed in an authoritative birthplace**; the current canon instead keeps muster geography abstract and sends recruits directly into the field army, so positioned detachments expose a real destination/timing gap that no existing seal or archive implementation resolves.

## Scope and authority test

This audit distinguishes a user decision from a mechanically published seal. The
tracker states its own layer as Working and says explicitly that a row is not a
seal until it lands at its birthplace (`.scratch/l3-playable-build/DECISIONS-OWED.md:3-12`).
The documentation law likewise classifies debt ledgers and working records as
non-normative, says feature `GLOSSARY.md` / `RULINGS.md` are the definition and
decision birthplaces, and requires a Production seal to carry status, date, and
verdict source (`AGENTS.md:78-80`, `AGENTS.md:84-109`, `AGENTS.md:117-123`).

The categories below therefore mean:

- **SEALED** — an accepted Record decision or a Production/Tier-1 contract with
  status, date, and verdict source; an accepted Tier-0 project-canon constraint is
  called out separately where its source is not a Production row.
- **WORKING-only** — a recorded user ruling or debt that has not reached its
  authoritative birthplace.
- **ABSENT** — no normative rule found.
- **CONFLICT** — existing authoritative rules do not compose without choosing
  behavior; this does not upgrade a Working record into a seal.

## Verdict table

| Question | Verdict | Authority and finding |
|---|---|---|
| What recruitment creates | **SEALED** | Recruitment moves bodies from the conscription register into serving status toward the force limit, as full-strength standing field substance. Birthplace row: `docs/features/match-arc/GLOSSARY.md:95` — status **AGREED**, dates 2026-07-04/07, sources MT-①/③. Ruling shape: `docs/features/match-arc/RULINGS.md:320-344` — **SEALED 2026-07-07 · L1**, with the pass's verdict source stated at `docs/features/match-arc/RULINGS.md:255-265`. |
| Blood/register accounting | **SEALED** | The register is land-derived total bodies; the opening army is already inside it, recruitment changes civilian→serving without shrinking the register, and death shrinks it. `docs/features/match-arc/RULINGS.md:298-318` — **SEALED 2026-07-07 · L1**, verdict source inherited from `:255-265`; definition row `docs/features/match-arc/GLOSSARY.md:96` — **AGREED**, dated and sourced to MT-②. |
| Recruitment price and bounds | **SEALED** | Treasury pays the integral under the continuous mobilization-intensity price curve; the draft is bounded by ordered mass, force-limit headroom, available bodies, and treasury. `docs/features/match-arc/RULINGS.md:320-340`; `docs/features/combat-formula/MAGNITUDE.md:750-778`. The action-point conversion is an explicit mechanical seal: **SEALED 2026-07-26 (R10, user) · L0** at `docs/features/combat-formula/MAGNITUDE.md:765-778`. |
| Force limit and opening field mass | **SEALED** | Force limit is land-derived from held population; the opening field army starts at `f₀ = 0.5` of it. `docs/features/combat-formula/MAGNITUDE.md:797-830`, `docs/features/combat-formula/MAGNITUDE.md:842-860`; the underlying MT-④ section is **SEALED 2026-07-07 · L1** at `docs/features/match-arc/RULINGS.md:354-379`. |
| Does recruitment use 행동력? | **SEALED: yes** | Recruitment is a force-shaping activity drawing from the single freely split pool; no force-shaping activity fires at commit 0. `docs/adr/0027-free-commit-allocation-main-surplus-labels.md:34-60` (Accepted, dated at `:3-6`). One point purchases +1%p of force limit and there is no per-turn rate cap: `docs/features/combat-formula/MAGNITUDE.md:765-778`. The current sealed pool is 20 points: `docs/features/combat-formula/GLOSSARY.md:32-42` and `docs/features/combat-formula/MAGNITUDE.md:60-80`. |
| Does movement use 행동력? | **SEALED: no** | A march costs turns and fatigue, never commit. `docs/adr/0043-operational-layer-movement-position-and-reachability.md:51-80`; ADR status/source at `:3-22`. This is distinct from recruitment's commit cost. |
| Current MVP muster geography | **SEALED current canon, but not a Production seal row** | The Tier-0 `Land-derived state` principle says realm-level recruitment **abstracts muster geography** and recruits join the field army directly; local muster is an extension point if location later matters. `DOMAIN_MAP.md:16-36` carries the user-confirmed 2026-07-05 A-3 stamp. Its recorded verdict source says the boundary was explicitly adopted while recognizing muster origin + march distance as the deeper land-derived form: `mockup/combat-calc/NOTES.md:653-664`. Because `DOMAIN_MAP.md` is Projection and the NOTE is Working, this is current accepted project canon, not a mechanically complete Production seal chain. |
| Sector-grain siting | **WORKING-only** | R19 records the user's direction that the grain is the sector and that one commit point is the minimum unit selecting one recruiting sector: `.scratch/l3-playable-build/DECISIONS-OWED.md:658-677`. The same section says the system is deferred and not being decided there (`:660-665`, `:686-688`). The tracked debt repeats it at `docs/SYNC-DEBT.md:63-76`; the law classifies that ledger as Working (`AGENTS.md:80`). No Production `GLOSSARY`, `RULINGS`, model row, or ADR contains R19. |
| Persistent register grain | **SEALED opening/transfer wording; WORKING-only disambiguation** | MT-② says the register is derived "per province" and moves with land (`docs/features/match-arc/RULINGS.md:298-318`), but it did not state unambiguously whether province buckets persist after setup. R18 records the user's persistent-per-province reading only in Working (`.scratch/l3-playable-build/DECISIONS-OWED.md:642-656`). No sealed rule makes the register per sector. |
| Positioned field substance | **SEALED** | A field army occupies a position; substance at a front is only the detachment(s) present or arriving, and being in two places requires division. `docs/adr/0043-operational-layer-movement-position-and-reachability.md:51-62`. Free split/merge, inherited fatigue, and the geometry-bound field-army definition are sealed in WM-② (`docs/features/war-model-build/RULINGS.md:83-118`) and its authoritative design text (`docs/superpowers/specs/2026-07-14-slice2-operational-layer-design.md:190-226`). |
| Which detachment receives recruits after a split | **ABSENT** | No authoritative document names a destination detachment, distribution weights, a newly created detachment, or a positionless reserve. The tracker correctly enumerates the gap at `.scratch/l3-playable-build/DECISIONS-OWED.md:945-967`, but that enumeration is Working analysis, not a rule. |
| Source sector eligibility and local draw | **WORKING-only / ABSENT** | R19 says the selection grain is a sector and describes the desired province-register/march-distance effect (`.scratch/l3-playable-build/DECISIONS-OWED.md:667-684`). It does not seal which sectors are eligible, whether several points may select the same sector, how a sector maps to the province stock, or how competing same-turn drafts are ordered. No authoritative source supplies those rules. |
| Recruitment timing relative to movement/combat | **ABSENT** | No seal states when newly raised men become positioned, whether they may march or fight in the same turn, or whether movement/division/merge resolves before recruitment. The current Runtime happens to resolve fronts, then draft in the background tail (`game/src/runtime/runtime.ts:417-500`), but code behavior is implementation evidence, not a recruitment-siting seal, and it has no positions to adjudicate. |
| R19's proposal to reopen the turn budget | **WORKING-only; potential conflict if adopted** | R19 records that the pass must revisit the stack size and mentions 30 as previously considered, without choosing it (`.scratch/l3-playable-build/DECISIONS-OWED.md:672-677`). The authoritative current value remains 20 (`docs/features/combat-formula/GLOSSARY.md:40-42`; `docs/features/combat-formula/MAGNITUDE.md:60-80`; ADR 0027 `docs/adr/0027-free-commit-allocation-main-surplus-labels.md:34-46`). |
| Positioned detachments × live scalar recruitment | **CONFLICT** | ADR 0043 requires positioned substance (`docs/adr/0043-operational-layer-movement-position-and-reachability.md:53-55`), while the live L3 state stores one positionless `field: number` (`game/src/domain/state.ts:24-41`) and recruitment mutates that scalar directly (`game/src/runtime/runtime.ts:477-510`). Replacing the scalar with detachments makes every write spatial, while R19 deliberately leaves spatial recruitment unpublished. This is a composition blocker between sealed position and an incomplete recruitment contract; R19 itself is not a second seal. |

## What is sealed, precisely

The authoritative recruitment contract already fixes the following and R19 need
not reopen them unless it explicitly chooses to amend them:

1. **Creation semantics:** bodies become serving, full-quality field substance;
   recruitment is not the reserved temporary offensive-mobilization track
   (`docs/features/match-arc/GLOSSARY.md:95`; ADR 0009 keeps that separate at
   `docs/adr/0009-force-roles-and-mobilization-risks.md:20-33`, `:72-87`).
2. **Blood semantics:** recruitment does not reduce the total-bodies register;
   only death does (`docs/features/match-arc/RULINGS.md:298-318`).
3. **Economic semantics:** the force limit, bodies, and treasury are affordability
   bounds, with continuous integral pricing (`docs/features/combat-formula/MAGNITUDE.md:750-778`,
   `:820-840`).
4. **Attention semantics:** recruitment consumes the same single commit pool as
   combat and all force-shaping activities; movement itself consumes none
   (`docs/adr/0027-free-commit-allocation-main-surplus-labels.md:34-60`;
   `docs/adr/0043-operational-layer-movement-position-and-reachability.md:64-80`).
5. **Current abstraction boundary:** the MVP canon says recruits join the field
   army directly without modeled muster geography (`DOMAIN_MAP.md:16-36`).

The seal-stamp check passes for MT-②/③/④ and the R10 magnitude row: each has a
status word, date, and verdict source (`docs/features/match-arc/RULINGS.md:255-265`,
`:298-320`, `:354-381`; `docs/features/combat-formula/MAGNITUDE.md:765-778`). The
match-arc glossary rows likewise carry AGREED status, date, and ruling references
(`docs/features/match-arc/GLOSSARY.md:95-99`). R19 has none of those at a
Production birthplace; its Working file expressly says it is not a seal
(`.scratch/l3-playable-build/DECISIONS-OWED.md:3-12`).

## Exact composition gap exposed by 06a

Before 06a, `RealmForces.field` is one positionless scalar
(`game/src/domain/state.ts:31-40`). The draft calculator accepts one aggregate
field count (`game/src/domain/recruitment.ts:108-149`), and the Runtime adds all
new men to that scalar (`game/src/runtime/runtime.ts:477-510`). This realizes the
old abstraction "recruits join the field army directly" without ever answering
where that army is.

ADR 0043 changes the other side of the composition: every mobile body must now be
in a positioned detachment, and front substance is local (`docs/adr/0043-operational-layer-movement-position-and-reachability.md:51-62`). Once a realm
has two detachments, there is no spatially neutral equivalent of `field += men`.
Adding to one detachment, distributing among several, creating a new detachment,
or leaving a reserve outside the graph each introduces behavior not found in the
seal chain. The current ticket labels this a "seal conflict"
(`.scratch/l3-playable-build/issues/06a-move-the-field-army.md:48-56`), but the
strict authority finding is narrower: **sealed positioned substance conflicts
with an underspecified old recruitment abstraction plus a Working-only deferral**.

The timing gap is independent. Ticket 05's Runtime currently drafts after front
resolution and before income (`game/src/runtime/runtime.ts:417-500`). No
Production/ADR statement says whether that ordering survives once the draft has a
map position, nor whether the new men can move, merge, man a wall, or fight in the
same resolution beat.

## Archive disposition

| Archive evidence | Disposition | Reason |
|---|---|---|
| `mockup/combat-calc/econ.js` recruitment curve and price arithmetic | **Accepted only where later adopted and published** | The archive marks the economy structure/provisional numbers as prototype material (`mockup/combat-calc/econ.js:1-15`, `:51-70`). MT-③/M13 later own the curve and R10/R11 own adopted values. It contains no position or destination (`mockup/combat-calc/econ.js:98-130`). |
| `mockup/combat-calc/battery.js` scalar field recruitment | **Superseded/incidental for siting** | It mutates one realm-level `field` scalar during peace (`mockup/combat-calc/battery.js:461-498`), using the retired flat +10%-per-turn reading. M13 explicitly retires that rate ceiling (`docs/features/combat-formula/MAGNITUDE.md:765-778`). It cannot answer destination after division. |
| `js/field-army.js` split/merge | **Accepted operational evidence, no recruitment composition** | It models positioned detachments and conservation across split/merge (`js/field-army.js:1-49`) but contains no recruitment/register/treasury path. |
| `mockup/operational-layer/war-loop.js` | **Incidental harness behavior** | The loop is explicitly a Working-layer instrument (`mockup/operational-layer/war-loop.js:1-22`) and instantiates one positioned `fieldArmy` at the capital (`:286-335`). It has no recruitment call or register/treasury state, so it never composes the two systems. |

Therefore neither archive branch supplies accepted behavior for R19. One knows
recruitment without position; the other knows position without recruitment.

## Publication and ADR duties if R19 is decided

These are documentation duties, not design recommendations:

1. **Birthplace publication is required.** Recruitment's current definition and
   history live in match-arc `GLOSSARY.md` / `RULINGS.md` (`AGENTS.md:90-100`;
   `docs/features/match-arc/GLOSSARY.md:95`). If the dedicated pass establishes a
   new feature birthplace instead, that ownership must be explicit and the old row
   must point rather than duplicate the definition.
2. **The Tier-0 abstraction must be amended.** A local-siting decision changes
   `DOMAIN_MAP.md:33-36`, which currently says muster geography is abstracted and
   recruits join the field army directly.
3. **A cross-feature ADR is mandatory.** Siting is consumed by recruitment,
   per-province register accounting, movement/fatigue, detachment substance,
   garrison posture, the turn budget, and UI. The law requires an ADR when a
   cross-feature model changes (`AGENTS.md:153-157`).
4. **Existing ADR headers must be stamped if their decisions change.** A pool-size
   or point-semantics change would amend ADR 0020/0027 and must stamp both the new
   and old records under the supersession protocol (`AGENTS.md:137-151`). A siting
   rule that preserves the existing 20-point pool does not, by itself, change
   those ADRs.
5. **Owning model rows must move only if values change.** Recruitment conversion
   and pool/commit values are owned by combat-formula `MAGNITUDE.md` / `GLOSSARY.md`
   (`docs/features/combat-formula/MAGNITUDE.md:738-778`;
   `docs/features/combat-formula/GLOSSARY.md:36-42`). Sector eligibility,
   destination, and timing are rules, not values; they need a ruling/ADR before
   code, not a silent literal.

## R19 논의에 남은 결정 질문

- Which owned sectors are eligible recruitment sites, and can several points be
  assigned to the same sector?
- Does the sealed `+1%p of force limit per point` remain the purchase unit while a
  point also selects a sector, or is the point's unit being redefined?
- Which persistent register stock pays a sector's draft, and how are simultaneous
  drafts from several sectors in one province ordered against that shared stock?
- Does a draft create a new detachment, reinforce a detachment already at the
  sector, choose a destination detachment, or choose between field and garrison
  posture?
- At what resolution beat do recruits exist, and may they move, merge, man a wall,
  or fight in the same turn they are raised?
- How do recruitment, split/merge, and destination-order intents interact when
  submitted in the same simultaneous turn?
- Does the action pool remain 20, become 30, or change denomination while
  preserving ratios?
- What preview and map-selection information must the UI expose before the player
  locks a sector-sited draft?
