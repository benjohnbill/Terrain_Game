# Doc-Structure Map — Adversarial Review (2026-07-15)

Audit evidence document; reports, not legislation (documentation-law S13).
Reviews the six decision tickets of the doc-structure map (.scratch/doc-structure/),
resolved 2026-07-15, before their execution tickets ran. Three independent
reviewers, each with a distinct axis and an instruction to default to refutation.
Line numbers and measurements are as-of 2026-07-15; verify against the live tree
before acting.

## Verdict summary

| Reviewer | Axis | Headline verdict | Findings |
|---|---|---|---|
| 1 | Fact verification — do the tickets' factual claims survive the live tree? | ~122 claims checked, 24 failed | 13 FALSE · 2 OVERSTATED · 2 UNVERIFIABLE · 5 CONFIRMED-but-fragile · 1 stale-diff · 1 structural defect |
| 2 | Precedent cross-check — do the rulings re-litigate settled decisions? | 6 re-litigation violations; ticket 11 → 12 is "the failure the audit exists to catch" | 6 verdict violations · 11 silently-contradicted items |
| 3 | Adversarial refutation — what breaks because we did this? | **UNSOUND-WITH-MAJOR-FIXES**; honest efficacy ~40% | 4 CRITICAL · 7 HIGH · 3 MEDIUM |

---

## Review 1 — Fact verification

# Fact-check: six resolved tickets, `.scratch/doc-structure/issues/`

**Discrepancies only.** Claims that survived verification are omitted.

| # | Claim (ticket + where) | What I found | Verdict |
|---|---|---|---|
| 1 | **T04**: "the slice-2 spec **has not been edited since its 2026-07-14 seal**, and implementation disagreements have gone to SYNC-DEBT rows and open rulings **instead of into the spec**" (04:92-97) — cited as proof the freeze invariant is "already observed practice, not a new burden" | Commit **79d25e3** (2026-07-15 07:01:50) modified `docs/superpowers/specs/2026-07-14-slice2-operational-layer-design.md`, **+11/−3**, in §2. `docs/features/war-model-build/RULINGS.md` was **not touched** — it still carries only WM-① and WM-②; the commit body states "no new seal". Ticket 04's own **reopen condition (a)** ("a designated text is modified without a ruling") has already fired. | **FALSE** |
| 2 | **T04**: "the §2 recovery ground/ash note … **was registered as a debt, not patched into the spec**" (04:94-97) | 79d25e3 patched **exactly that paragraph** into the spec ("**Recovery — a child of supply and ground:** … recovery = supply × ground-recovery factor"), and moved the debt to Paid. `docs/SYNC-DEBT.md:315-317`: "**§2 recovery model — ground/ash gate note — PAID** … the design spec §2 recovery paragraph **now records** recovery = supply × ground-recovery factor". The cited example is the exact inverse of what happened. | **FALSE** |
| 3 | **T05**: "**Status: drafted, awaiting user seal. Nothing here is applied**" (05:48-49) | All three law corrections **and** the SYNC-DEBT closure landed **user-sealed** at **e35caf8** (2026-07-15 06:40:52). None of the three BEFORE strings survives: grep for `Working-layer sublabels from the same audit stay deferred`, `is promoted to hooks only after the audit lint validates it`, `lint once it lands (P1 prototype` → **0 hits** in `.claude/rules/documentation-law.md`. | **FALSE** |
| 4 | **T05**: "In the Deferred section (**lines 448-457**)" (05:154) | The `docs:check` row sat at `docs/SYNC-DEBT.md:318-327` (pre-e35caf8; `## Deferred` header at :318, row at :320-323). Pre-commit lines 448-457 are unrelated hegemony-gate / force-geography text. **FE-1 class** (citing a location that isn't). | **FALSE** |
| 5 | **T05**: mapping-table header "``docs:check`` proposal (**SYNC-DEBT:451-452**)" (05:62) | Proposal text was at pre-e35caf8 `docs/SYNC-DEBT.md:320-323`. Lines 451-452 read: *"(center pinned to standoffs, flanks dominate — evidence bearing on TC-②, / not a rewrite). (2) Decomposed the fix into a **three-concept sequence**,"*. **FE-1 class.** | **FALSE** |
| 6 | **T05**: the three BEFORE/AFTER diffs as the reviewable artifact | BEFORE blocks were **verbatim-exact** against `e35caf8^` (lines 68-70, 137-139, 182-187 all confirmed) — but are now **stale**. What landed ≠ Correction A's AFTER: the law carries the **trimmed** one-liner ("its checks ship in `scripts/audit-lint.js` under other names", law:69-71) — the reviewer note won; the three mappings live **only** in the SYNC-DEBT row (:326-338), not in the law as the AFTER block proposed. B gained "— the exploration-exemption judgment stays with the agent"; C was reworded. | **stale / superseded** |
| 7 | **T03**: "SYNC-DEBT 'term lifecycle beyond promotion' row (Codex P1, **:423**…)" (03:39) and "**Closes SYNC-DEBT :423**" (03:144) | The row is at `docs/SYNC-DEBT.md:291-295` (303 pre-e35caf8). Line 423 is force-geography terrain-fidelity content (`combatFromBorderClass`…). Row text itself ("proposed → agreed → promoted → renamed → deprecated"; "renames are the dangerous case for agents") is verbatim-correct. **FE-1 class.** | **FALSE** |
| 8 | **T03**: "and **the adjacent alias-field row** (Codex P2, de-facto satisfied but never closed)" (03:40-41) — implies two rows to close | There is **no adjacent row**. The alias-field P2 is the **trailing sentence of the same bullet**: `docs/SYNC-DEBT.md:293-295` — "…renames are the dangerous case for agents. **Add an alias field (Korean casual phrases, code identifiers) to glossary schema (Codex P2).**" One row, not two. | **FALSE** |
| 9 | **T11**: "`docs/superpowers/plans/` — **12 files**, tracked" (11:17, table headed "verified against disk") | **17 files** (all 17 tracked). `12` is the **specs** count. Looks like a transposition from the specs row. | **FALSE** |
| 10 | **T11**: "`.scratch/<f>/issues/NN-*.md` — **10 files**, untracked" (11:17) | **22 files** on disk: 10 in `war-model-slice2/issues/` + **12 in `doc-structure/issues/`**. The "measured against disk" figure omits the directory the ticket itself lives in (≥21 even at drafting time). | **FALSE** |
| 11 | **T11**: "the **20 references** from truth docs (**incl. 5 ADRs**)" (11:84) | **31 reference lines** across **16 unique** truth docs (SPEC/DESIGN/DOMAIN_MAP/adr/features). Only **4** ADRs reference `docs/superpowers/` (0019, 0032, 0033, 0038); ADR **0034**'s reference is to `.superpowers/sdd/progress.md:21` — a different, **gitignored** path. | **FALSE** |
| 12 | **T11**: the references "are **all** 'landed via SDD — <path>' **historical footnotes, not live authority reads**" (11:85-87) — the stated basis for "**this is not P4**" | **1 of 31** uses that phrasing (`docs/adr/0019…:121`). Live authority reads, verbatim: • `docs/features/war-model-build/RULINGS.md:88-89` — "**Authoritative design text:** `docs/superpowers/specs/2026-07-14-…`" • `docs/features/war-model-build/GLOSSARY.md:5-8` — "dial values live at **the owning model doc** (here: the slice-2 design spec, `docs/superpowers/specs/2026-07-14-…`)" • `docs/adr/0038:14-16` — "**Design source:** slice-2 operational-layer design spec §5 (…), user seals 2026-07-14" • `docs/adr/0033:9-10` — "**Decision source:** dominance-gate grill design spec …". **Directly contradicted by T04**, whose entire thesis is that RULINGS.md:88 designates that spec as live authority. | **FALSE** |
| 13 | **T11**: "the 12 `docs/superpowers/specs/` **map almost 1:1 to feature slugs**" (11:83-84) — the measured basis for the "feature is the home" root ruling | By truth-doc reference: **5/12** map to exactly one feature; **3/12** are referenced by two (fog-of-war-discovery+tactical-plan-ai; capital+match-arc; fog-of-war-discovery+war-model-build); **4/12** are referenced by **no** feature (`2026-06-29-phase-1-terrain-combat-design`, `2026-07-02-stage2-command-skill-edge-design`, `2026-07-10-conquest-growth-engine-design`, `2026-07-10-doc-audit-and-forensics`). By filename→slug match: **3/12**. Three specs route to `match-arc` alone. | **OVERSTATED** |
| 14 | **T02**: class-B "**Rows: 52**" (02:73) | **52** is the **sum of value occurrences** (10+9+15+18), not rows. **Distinct rows = 28.** The column is internally inconsistent: class A's `8` and class C's `31` **are** distinct row counts (verified: 1+7=8 no overlap; 30+1=31 no overlap), so only B mixes units. | **FALSE** |
| 15 | **T02**: "Splitting **the 11** `forbiddenContent` values by mechanical checkability" (02:69) + the 3-class table | The table classifies **8** of 11. Unclassified: **`ruling-history`** (5 rows), **`feature-definitions`** (1), **`definition-body`** (1). The A/B/C partition is presented as exhaustive; it is not. | **OVERSTATED** |
| 16 | **T02** (Constraints, :37-38): "The registry itself is ~5 days stale (**9 unregistered docs** — ticket 08)" | **31** tracked `.md` files are absent from the registry — incl. **8 ADRs** (0029, 0032-0038), **all 3** `capital/` files, **all 5** `war-model-build/` files, both `docs/agents/` files. The `9` is ticket 08's **superpowers-only subset** (verified: exactly 9 — T11's separate "9 unregistered superpowers docs" is correct). Mislabels a subset as the total. | **FALSE** |
| 17 | **T01**: "`docs/agents/domain.md` (written 2026-07-14) **restates this law** against its own header rule… **Not a near-miss: an executed violation**" (01:69-71, 143-147) — the sole evidence that the sublabels deferral's reopen condition fired, and the basis for ruling 1 (**already landed** at law:17 via e35caf8) | The file **does not exist**: `docs/agents/` holds only `issue-tracker.md`, `triage-labels.md`. `git log --all -- docs/agents/domain.md` → **empty**; it was **never committed** (456344b *added* the other two; it could not have deleted an untracked file). No blob in any ref. The content claim cannot be checked against the tree, only against the deleted working-tree file. | **UNVERIFIABLE** |
| 18 | **T01**: "`CLAUDE.md` was edited **without user sign-off** during the 2026-07-14 skill setup" (01:92-93, 167-169) | The *edit* is verifiable (uncommitted working-tree modification; first committed by e35caf8 as **+17 lines**, no 2026-07-14 commit exists — `git log CLAUDE.md`: 0032a66 06-29, 2f0be30 07-05, e35caf8 07-15). The **"without user sign-off"** clause is a claim about a conversation; the repo carries no consent record. | **UNVERIFIABLE** (edit half confirmed) |
| 19 | **T01**: structural — two full `## Answer (2026-07-15)` sections (01:54 and 01:128) | Both present, with **divergent text** (§1 first version lacks "Ticket 07 deletes the file"; §3 differs: "caught while drafting" vs "violating this ticket's own rider"; ordering of the ruled/rejected/deferred summary differs). Which is authoritative is undefined — and ruling 1-2 already landed. | **defect** |
| 20 | **T02**: "`checkNumericRestatement` … with the target file hardcoded (**`audit-lint.js:205-220` reads `DOMAIN_MAP.md` only**)" (02:59-61) | Substance right, citation wrong. `checkNumericRestatement(domainMapText)` spans **205-220** and **reads nothing** — it takes text as a parameter; the cited range contains **no** `DOMAIN_MAP` reference. The hardcoding is at **:343** (`const domainMap = read('DOMAIN_MAP.md')`) and the call site **:373**. | **CONFIRMED-but-fragile** |
| 21 | **T03 Q3**: "`checkHeaderDiff` **already scans every DOMAIN_MAP header** — the fact is a **by-product of data the lint holds**" (03:151-153) — basis for "DERIVE, do not store" (binding handoff to ticket 09) | Scans the **117** marker-bullet rows (`DM_ROW`, audit-lint.js:11) — fine. But `seenTerms` (:76, :83) is a **flat set across DOMAIN_MAP + all 11 GLOSSARYs** (:344-345), so the check's **output** cannot distinguish "appears in DOMAIN_MAP" from "appears in a GLOSSARY". The per-surface data exists (`surface.path`, :77), so it's cheap — but it is **not** a by-product of the existing finding stream. | **CONFIRMED-but-fragile** |
| 22 | **T04**: "the precedent the law already carries at **line 44**: `research/*.md` is 'the evidence layer… inputs to seals; never normative on their own'" (04:83-86) | Text verbatim-correct, location off: the clause is at **`.claude/rules/documentation-law.md:45-46`**. Line 44 is "owning doc." (end of the prior bullet). It *was* 44-45 before e35caf8 added the Law row (+1 line) — T04 was drafted **after** e35caf8, so it shipped already stale. | **CONFIRMED-but-fragile** |
| 23 | **T11 Q7-a**: "law **line 44**: Production folders already host non-normative 'surveys and audits'" (11:112-113) | Same off-by-one as #22 (now :45-46). T11 was created 02:54, **before** e35caf8 — correct at drafting, stale now. | **CONFIRMED-but-fragile** |
| 24 | **T04**: the WM-② blockquote (04:65-70) | Quote fidelity: the source (`RULINGS.md:88`) has **`Authoritative design text:` unbolded** — the ticket renders it `**Authoritative design text:**`; the `…` elides "Design only — implementation is the next session." Substance and the RULINGS.md:83 line cite are exact. | **CONFIRMED-but-fragile** |

### What survived (not listed above, for calibration)

Ticket **03** is the cleanest of the six — every measurement recomputed exactly: `260` terms, `18` off-enum rows, `SEALED ×10`, `AGREED-concept ×2`, `AGREED-structure ×1`, `가안 ×1` (Frontage), `SUPERSEDED ×1` (Blinds), `mechanic ×2`/`state ×2`/`strategy ×1`, `standard-term ×2`, **39** `verdict:null`, **235** `AGREED`, `rejected-recorded` zero rows **ever** (`git log -S` on the file → empty), **9 of 18** born at `force-geography/RULINGS.md`, **9 of 10** `SEALED` from one birthplace, `구칭` **0 hits** in the JSON while `terrain-cradle/GLOSSARY.md:12,18` and `match-arc/GLOSSARY.md:75,86` carry it, `"dissonance (retired)"` → `Leak-through` (live `AGREED`), `"unassailability"` → `Hegemony decision point`, `"인력 풀"` recoverable from `match-arc/GLOSSARY.md:86`, all three 2026-07-07 promotions at `tier=1` **and** exact DOMAIN_MAP headers (:454/458/468).

The claimed **law self-contradiction is real**, verbatim both sides: `documentation-law.md:55-56` — "a seal is a Production-doc row/section carrying at minimum **status word (SEALED/AGREED/CONFIRMED) + date + verdict source**"; `:143-144` — "**Status dictionary**: DOMAIN_MAP `✅/❓/⛔` ≡ GLOSSARY `AGREED/PROPOSED/rejected-recorded`." And T03 is right that the lint does **not** catch the drift: `MARKER_OK['✅'] = (s) => s !== 'PROPOSED'` (:154) passes a `SEALED` row unflagged, and `checkBaselineSelf` (:302-325) checks no enum.

Ticket **05**'s code-mapping table is fully confirmed — all three ranges and emit kinds exact (`checkAdrStampDuty` :226-249 → `unstamped-adr-amendment`; `checkFreshness` :281-298 → `stale-quickref`; `duplicate-canonical` in `checkBaselineSelf` :302-325). Its supporting facts too: `settings.json:21`/`:9`, `package.json` `lint:docs`, **29** tests (`node --test` → 29 pass), alias-inject live since **23c0917** (2026-07-10). Also confirmed: **119** registry files with nothing reading any field but `.path` (grep for `allowedContent|forbiddenContent|ownerFeature|.layer` over `scripts/`+`tests/` → 0), class A = **8** rows / coverage 1→8, `alias-inject.js:100` imports `normalizeName` from the lint, **30** files under `docs/superpowers`, **12** specs, **6** research dirs, **3** `RESEARCH.md`, `.scratch`/`.context` untracked-but-not-gitignored, `war-model-build/` has no MAGNITUDE-class doc, `MAGNITUDE.md` = 54,584 B (53 KiB ✓), spec = 26,009 B at drafting (25 KiB ✓), `01-fatigue-core.md:15` verbatim.

### Count

**~122 factual claims checked · 24 failed** — 13 FALSE, 2 OVERSTATED, 2 UNVERIFIABLE, 5 CONFIRMED-but-fragile, 1 stale-diff, 1 structural defect.

**Concentration:** T11 (5 of 17 claims failed, incl. both load-bearing measurements behind its root ruling) and T05 (3 FE-1-class citation failures) carry most of it. T04's two failures are the most consequential — the freeze invariant's empirical warrant is inverted by a commit that landed **3 minutes after** the ruling was written, and that commit is itself an instance of the reopen condition the ruling defines. T12 (`.scratch/doc-structure/issues/12-superpowers-migration.md`) inherits T11's `20 references` / `12 plans` figures as its migration scope; both are wrong.

---

## Review 2 — Precedent cross-check

# Audit: re-litigation of settled decisions across six tickets

### Verdict table

| Ruling | Precedent item touched | Reopen condition (verbatim) | Verdict | Reasoning |
|---|---|---|---|---|
| **01.1** register `docs/agents/` | **Working-layer sublabels** (SYNC-DEBT:308-311) | *"no misfiling observed — revisit if it occurs (emergence-limit)"* | **NOT-MET** — category slide | The deferral waited for **misfiling** (a doc in the wrong Working sub-kind). The ticket supplied a **restatement** violation (`docs/agents/domain.md` restating the law). The file was in the *right* place; its *content* broke a rule that already existed — the ticket concedes this ("Vocabulary Law … already covers it"). That is forensics' 58% enforcement class, which Diagnosis #1 says is explicitly *not* a topology/labels problem. Sublabels would not have prevented it. **Worse: the reopen was never needed** — the Working row already carries per-document write rules (NOTES, ledgers, `docs/audits/`); adding one more is registration, not sublabels. A trigger was manufactured for an action that didn't require one, and the "fired" claim is now in the permanent record. |
| **01.2** legalize `law` layer | **FE-3** (cold review: *"invented a `law` layer not in the taxonomy"*) | none (a finding, not a deferral) | **N-A** — flag framing | Legitimate explicit decision (both directions were named in the Question). But FE-3 called the layer an *invention* — a registry **defect**, whose prescribed fix was "complete registry coverage". The ticket resolves it in the opposite direction and frames adding a taxonomy layer as "closes an existing inconsistency rather than legislating new topology". Adding a layer row **is** legislating topology; it's just defensible. |
| **01.3** reject pipeline clause | **B4 routing** (*"WATCH, do not codify on first instance"*) | — | **HONORED** | Correct application. Also self-caught that its draft would pre-judge ticket 04. |
| **02** wire class A | **E12 naive numeric heuristic** (rejected, 55–80% FP) | narrowed rule survives | **HONORED** | Best-disciplined ticket. Keeps POINTER_RE **AND** DIAL_RE verbatim, widens only the target list (1→8 files), sets an FP budget, and explicitly rejects class B — which *is* the naive class (`dial-values` on SPEC.md). Not a re-proposal. |
| **02** reject (b) | **E13 blocking hooks** (rejected) | — | **N-A** — but see defect | **Letter collision**: the Question's option (b) = "advisory write-lint consultation (PostToolUse hook)". The Answer's "(b)" = "reject class B of `forbiddenContent`". The header "Reject (b)" reads as killing the hook option; the reasoning given is about field classes. **The advisory-hook sub-decision is never reasoned about** — dropped while appearing decided. |
| **03** close SYNC-DEBT :423 | **Codex P1 term lifecycle + P2 alias field** | Open row, not a deferral | **NOT-MET** — partial claiming whole | See §2 below. |
| **03** extend status enum | **E17** (L-stamp as 4th *seal* field — rejected) | — | **N-A** | Different field entirely (status dictionary ≠ seal triad). Not a re-proposal. Minor: the law's seal triad names **SEALED/AGREED/CONFIRMED**; the new dictionary adds SEALED but leaves **CONFIRMED** unreconciled — the claimed "resolves the law's own conflict" is half-done. |
| **04** legalize designation | **E4** (`docs/SEALS.md` — DECIDED NO) | — | **N-A** | No seal registry created. Premise correction **verified TRUE** against `RULINGS.md:83-92`. Reopen conditions named mechanically — good discipline. But see §2: overclaims "not a new category", and drops its own ADR trigger. |
| **05** close `docs:check` | **E2** (`docs:check` — DEFERRED, YAGNI) | *"no generator yet; adopt when a misfile actually slips"* | **N-A — correctly not invoked** | The survey *instructs* this exact move ("Do not propose `docs:check` — propose closing its ledger row as superseded"). Supersession ≠ reopen. Ticket verified all three mappings **against the code**, not the survey. Self-caught its own M-04 restatement smell; the landed diff trimmed it. Cleanest ticket. |
| **11** retire `docs/superpowers/` | **P4 vertical restructure** (REJECTED on evidence) | *"revisit only if post-P1/P2 audits surface topology-caused failures"* | **NOT-MET** — rationalization | See §1. |
| **11.Q10** `.scratch/` untracked | commit **7ca0e9f** deferred decision | *"Whether to track the issue tracker is a **separate user decision**"* | **NOT-MET — Tier-3 crossed** | Ticket claims "Resolves commit 7ca0e9f's deferred user decision." An agent closed a decision explicitly reserved to the user. `Status: resolved`, not marked as a proposal (contrast ticket 05's "Answer (proposed — user seals)"). |

---

### §1 — Ticket 11 vs P4: the distinction is a rationalization

Stress-tested hard. It fails four independent ways.

**(a) Its own constraint is abandoned inside its own Answer.** Constraint: *"a routing rule for new writes — **zero forced file moves required**; any migration of existing files is a **separate, optional** consequence the user rules on per kind."* Answer: spawns ticket 12 — *"retire `docs/superpowers/` **entirely**"*, 30 files, `git mv`, *"Delete the now-empty `docs/superpowers/` tree."* `Type: task`. Not optional, no per-kind user ruling. The distinction that licensed the ruling was discarded by the ruling.

**(b) The "non-authoritative / historical footnotes" premise is factually false.** I checked the ADR citations myself:

| ADR | Actual text | Footnote? |
|---|---|---|
| 0019:121 | "landed on main via SDD — `…/plans/2026-07-02-situation-map-v5-map-only.md`" | **yes** |
| 0032:18 | "**Decision source:** occupation-geography design spec `…/specs/2026-07-10-occupation-geography-design.md`" | **no** |
| 0033:10 | "**Decision source:** dominance-gate grill design spec `…`" — in the header block under Status/Amends | **no** |
| 0038:15 | "**Design source:** slice-2 operational-layer design spec §5 (`…`)" — inside the **Relationship** block of an Accepted ADR | **no** |

**1 of 4.** The class was characterized from its weakest instance. And it is **4 ADRs, not "5"** — ADR 0034 cites `.superpowers/sdd/progress.md`, a **gitignored** different directory the migration would never touch.

**(c) Ticket 04 refutes it in the same batch.** Ticket 11's evidence is *"superpowers is registered 'not current truth' everywhere"* — the registry role string. Ticket 04 ruled that exact string is *"**true of an undesignated spec and misleading for a designated one**"* and ordered a role-string honesty fix. Ticket 11 rests its case on a stamp its sibling declared misleading.

**(d) The file it calls inert history is the live spine of an in-flight build.** `docs/superpowers/specs/2026-07-14-slice2-operational-layer-design.md` is, verified:
- WM-②'s **"Authoritative design text:"** (`RULINGS.md:88`) — a Record-layer seal;
- the **Design source** in Accepted **ADR 0038**'s Relationship block;
- called **"authoritative spec"** by `docs/GLOSSARY-QUICKREF.md:15` — the *user-audit surface*;
- cited by `war-model-build/INDEX.md` ×4, `GLOSSARY.md:7`;
- cited as "Authoritative design: slice-2 design spec §N" by **all 10** slice-2 tickets — **5 of which (06–10) are unbuilt.**

Ticket 04's constraint: *"Do not disturb the slice-2 build in flight."* Ticket 11 moves the text that build reads, and never notices.

**Reopen condition, judged honestly.** P4 reopens on *"post-P1/P2 audits surfac[ing] **topology-caused failures**"*. Offered: a disk survey measuring **duplication of homes** + the user's phrase "여러 장소에 적을 수 있는 참사". Duplication is not a failure; **no incident is cited**; run #3 hasn't run. The one near-miss (`.scratch/spec.md` template) was ruled by **ticket 01, same batch**, as *"one near-miss → first instance → WATCH, do not codify"*. The same evidence base was judged too thin to codify **a sentence** and sufficient to retire **a directory**.

The map's own **Out of scope** section: *"**Topology restructure** — forensics P4, rejected on evidence… Reopens only on topology-caused failures, **as a fresh effort**."* Ticket 11 performed a topology restructure inside the effort that declared it out of scope.

**The user-direction defence, fairly stated:** the user did name the multi-home problem, and Priority-1 instruction can override. But that authorizes the **routing rule for new writes** — precisely what ticket 11's constraint promised and then exceeded. It does not authorize retiring a law-registered directory, moving 30 files, and rewriting Record-layer pointers. Those need P4's named evidence, which does not exist.

**Count error, and it bites.** "20 references" vs **measured 38** across 25 tracked truth/working files, plus 21 `doc-registry.json` rows, plus ~14 `.context/` refs. Ticket 12's grep scope (*"`docs/features/`, `docs/adr/`, `DOMAIN_MAP.md`, `.claude/rules/`, `docs/*.md`"*) **omits `mockup/`** — 4 refs there, including **`mockup/combat-calc/map-data.js:4`, a code file**, and `mockup/*/NOTES.md` is a **law-registered Working surface**. P4's exact warning — *"would break existing pointers"* — lands on the first attempt.

---

### §2 — Ticket 03 vs SYNC-DEBT :423: partial claiming to be whole

The row verbatim: *"**Term lifecycle beyond promotion** (Codex P1): define proposed → agreed → promoted → renamed → deprecated states **in the Vocabulary Law**; renames are the dangerous case for agents. Add an alias field (Korean casual phrases, code identifiers) **to glossary schema** (Codex P2)."*

Against delivery:

| :423 asks | Ticket 03 delivers |
|---|---|
| lifecycle states **in the Vocabulary Law** | **rejects** the lifecycle enum outright (sound reasoning — axis collision — but rejection ≠ satisfaction). Law gains exactly one thing: a 4th status value (`SEALED`). **No lifecycle definition.** |
| `renamed` | typed alias `rel: 구칭` — in `term-inventory.json` |
| `deprecated` | `rel: retired`, plus `SUPERSEDED`→`rejected-recorded` *"**Confirm at run #3 before moving**"* — deferred |
| `promoted` | derived — as an *"**Optional** report line in ticket 09, **at 09's discretion**"*. Not delivered. |
| alias field **to glossary schema** | typed aliases in the **JSON index**. Ticket 03's own evidence proves these are different surfaces: grep 구칭 over the JSON = 0 hits *"while birthplace GLOSSARYs carry it"*. The JSON is downstream of the glossary schema, not the glossary schema. |

**The self-contradiction is decisive.** Ticket 03 declares: *"⚠ Binding condition — **the ruling is void without it**. This schema is only valid if ticket 09 implements an enum-enforcing check."* And in the same document: *"**Closes SYNC-DEBT :423**."* A debt cannot be closed by a ruling that is void until a future ticket lands. Nothing is applied; everything is handed to tickets 09/10 plus two user-sealed amendments.

The ticket half-knows — it hedges *"restate it as satisfied-by-v2 rather than leaving it open."* **Restate/narrow is the honest disposition. "Closes" is not.** Note the survey already flagged the P2 half as *"de facto satisfied … never closed"* — closing it on the JSON is defensible; closing the **P1** half is not.

---

### §3 — Silently contradicted

1. **e35caf8 contradicts itself in one commit.** Message: *"The reopen condition … was 'revisit if misfiling occurs' — **it occurred**"*. Same commit leaves `SYNC-DEBT:308-311` reading *"**no misfiling observed** — revisit if it occurs"* and **edits** law line 68 to say *"only the Working-layer sublabels **stay deferred**"*. The record now says the trigger both fired and didn't. Next agent to grep finds a fired trigger in the log and an unfired one in the ledger — freshly minted F-10/F-11 ledger-currency disease, by the batch fixing that disease.
2. **Ticket 11 vs ticket 04, same files, same batch**: inert relocatable history vs designated, frozen ruling body.
3. **Ticket 11 vs ticket 04's freeze invariant**: *"A designated text is **frozen at designation**. Changing it requires a new ruling."* Ticket 12 relocates ≥4 designated bodies. Content survives a move; the **pointer inside a Record-layer seal does not**.
4. **Ticket 12 step 3 instructs editing Accepted-ADR header fields with "no ADR supersession judgment"** — on the false footnote premise, in a repo whose law says *"Never silently edit an accepted ADR's Decision section"* and whose **F-09 / seal-amends-ADR duty exists precisely because ADR-amending changes went unstamped.**
5. **Ticket 04 raises the mandatory-ADR trigger and drops it.** Its Constraints: *"Mandatory-ADR trigger may apply: this is a cross-feature model pattern … may owe an ADR in the same batch."* Its Handoff: law amendment + SYNC-DEBT row + registry fix — **no ADR, no reasoned dismissal**. That is the F-06/07/08 joint (*"The ADR corpus stops recording once a decision is 'SPEC-level'"*) the law was amended to close.
6. **Ticket 04 overclaims "not a new category."** The law's line 44 says `research/*.md` is *"**never normative on their own**"* — full stop, no designation exception. Designation makes a Working text normative **by reference**, and adds a freeze invariant. That is a new mechanism; calling it an extension understates a Tier-3 law change (and weakens the ADR-trigger dismissal above).
7. **Ticket 11 never names the law edit its own ruling requires.** `docs/superpowers/` is a **law-registered Working-layer document** (`documentation-law.md:17`). Its consequence list names tickets 01, 04, 07, 08 — never the law row that must lose the path.
8. **Ticket 02's letter collision** drops the advisory-hook sub-decision (see table).
9. **Ticket 02 widens `checkNumericRestatement` 1→8 files while §G's existing undisposed finding** (`numeric-restatement` on "Operation") sits unresolved — hardening on an unclean baseline.
10. **Ticket 03 leaves `CONFIRMED`** (named in the law's own seal triad) out of the extended dictionary it claims resolves the law's conflict.
11. **The batch broke its own cadence rule.** The map: *"**Never resolve more than one ticket per session.**"* Session observations place ticket 01's resolution at ~2:53a and ticket 11's root ruling at ~3:03a — ten minutes apart. Six tickets resolved 2026-07-15. This plausibly *causes* findings 2, 3, and 5: the batch outran the HITL cadence that would have caught 01↔11 and 04↔11 before they were written.

---

### Bottom line

- **Ticket 05** — clean. Verified against code, self-corrected, correct supersession-vs-reopen distinction.
- **Ticket 02** — disciplined on precedent; one real defect (the dropped option-(b)).
- **Ticket 04** — sound premise correction, verified true; overclaims novelty and drops its own ADR duty.
- **Ticket 01** — the action is probably fine; the **justification is a category slide**, and it laundered a false "trigger fired" into the permanent record for a still-deferred item.
- **Ticket 03** — good reasoning, **dishonest close**. Narrow the row; don't close it.
- **Ticket 11 → 12** — **the failure the audit exists to catch.** P4 was reopened by argument, not by the evidence class its reopen condition names; the "not P4" distinction is refuted by its own constraint, by verified ADR text, by its sibling ticket, and by the in-flight build it would break. **Recommend: do not execute ticket 12.** The routing rule for *new writes* survives on user direction; the migration does not.

Credit where earned: ticket 11's `.gitignore` claim ("convention-only, not gitignored — verified") is **true**, and ticket 12's catch that ADR 0034's `.superpowers/` ref may be dead is genuine — that path *is* gitignored, so the citation is unreachable on a fresh clone.

---

## Review 3 — Adversarial refutation

# Adversarial review — doc-structure tickets 01–12

**Verdict: UNSOUND-WITH-MAJOR-FIXES.** Three of the six rulings fail on evidence I could measure directly. One (ticket 02) is a measured no-op. One (ticket 04) was violated by a commit that landed **three minutes after it was ruled** — by the very example it cites as proof. The terminal gate (ticket 10, "lint clean") is green-by-construction for all three, so the package cannot detect its own failures.

---

### CRITICAL

#### C-1. Ticket 02's class-A wiring delivers **zero** enforcement. Measured, not argued.

`checkNumericRestatement` does not merely hardcode DOMAIN_MAP as a *target path* — it hardcodes DOMAIN_MAP's *row grammar*. `splitDomainMapRows` only emits rows matching `DM_ROW = /^- (✅|❓|⛔) \`([^\`]+)\`/`. I ran the live function against all 7 new target files:

```
   0 DM-rows |   0 findings | docs/features/combat-formula/FORMULA.md
   0 DM-rows |   0 findings | docs/features/combat-formula/MAGNITUDE.md
   0 DM-rows |   0 findings | docs/features/combat-formula/MATCHUP.md
   0 DM-rows |   0 findings | docs/features/match-arc/STRATEGY-SPACE.md
   0 DM-rows |   0 findings | docs/features/match-arc/TEST-LADDER.md
   0 DM-rows |   0 findings | docs/features/operation-plan-catalog/CATALOG.md
   0 DM-rows |   0 findings | docs/features/tactical-plan-ai/BATTERY.md
TOTAL: DM-format rows parsed = 0 | findings = 0
```

Model docs are tables and prose; none carries a `- ✅ \`Term\`` bullet. **Coverage "1 → 8 files" is a paper number. Effective coverage stays 1.** Pointing the check at those 7 files produces 0 findings *regardless of their content, forever*.

The ruling's own safeguards are therefore theater: the FP budget ("if the widened run exceeds ~2 findings/file, narrow by exclusion list") can never trigger. And the claim "carrying it unchanged onto 7 more files imports no new FP risk class" survives only **vacuously** — a check that cannot fire imports no risk and no value.

The ruling faces a dilemma it never saw: either (a) wire the path only → permanent no-op, the dead field gains a "consumer" that reads it and does nothing observable; or (b) generalize the row parser to prose lines → that *is* new capability with a new FP class, exactly the experiment the 55–80% FP measurement already narrowed once. Ticket 02 rejected class B for this reason while walking into it in class A.

For scale, the generalized-parser alternative yields **4 line-hits across all 7 docs** (e.g. `FORMULA.md`: `50%/60% usable value (ADR 0022)`). Even the expensive option buys almost nothing.

Also note: DOMAIN_MAP currently produces **0 findings** (ticket 06 fixed the `Operation` row). After 02 + 09 land, `numericRestatement` is a check with 8 registered targets and zero findings on any of them. The ticket's "decisive find" — *"wiring is not new capability; it is unhardcoding an existing check"* — is true and is precisely why it delivers nothing.

#### C-2. Ticket 04's freeze invariant is refuted by the evidence it cites, and was violated 3 minutes after it was ruled.

The Answer states:

> *This is already observed practice, not a new burden*: the slice-2 spec **has not been edited since its 2026-07-14 seal**, and implementation disagreements have gone to SYNC-DEBT rows and open rulings instead of into the spec — e.g. the §2 recovery ground/ash note (… it was **registered as a debt, not patched into the spec**).

```
79d25e3 2026-07-15 docs(war-model-build): slice-2 ticket 06 doc-sync — ground-recovery + siege reality
4e1d034 2026-07-14 docs(war-model-build): slice-2 operational-layer design seal (WM-2)
```

Commit `79d25e3` (2026-07-15 **07:01:50**) edited the designated text's §2 — replacing *"Recovery — a child of supply"* with *"a child of supply **and ground**"* — and its message reads: *"SYNC-DEBT: move the §2 recovery-note row to **Paid**"*. The map records ticket 04 as resolved at 06:58. **The invariant was broken three minutes after it was written, by an agent doing routine doc-sync, in the exact case cited as proof it doesn't happen.** The debt wasn't held out of the spec — it was paid *by patching the spec*.

The commit also states *"Ritual duties checked: no new seal … no ADR amendment triggered"* — i.e. **no new ruling**. So reopen condition (a), *"a designated text is modified without a ruling"*, is already met. Sealed as written, this ruling is **born in its own reopen state**, and `79d25e3` — already on main — becomes retroactively illegal.

The deeper failure: the invariant claims to "name what the repo does". It measurably names what the repo *doesn't* do. The build's per-ticket doc-sync rhythm patches the spec as its normal operation, and three open rulings (pump-reset, bleed-ordering, delaying-defense bands) plus a queued magnitude pass are all pointed at that text. Under the invariant, every one needs a fresh ruling — the paperwork for the in-flight build just became expensive, on a ruling whose factual basis is inverted.

Reopen condition (b) — *"two rulings designate the same text"* — is also load-bearing against the methodology: one design spec (§0–§13) serving slice-2 tickets 01–10, with WM-③ plausibly designating the same text. The condition fires **by construction** of the build pattern it means to legalize.

#### C-3. Typed aliases break three live readers in three different ways. Ticket 03's handoff names none of them.

Ticket 03 hands 09 only *"alias-shape check"* + *"alias-inject.js should consume `rel`"*. The actual load-bearing consumers are elsewhere. Tested against the real functions with a v2 row:

```
  THROW audit-lint nameSet()        -> TypeError: name.replace is not a function
  THROW audit-lint buildNameIndex() -> TypeError: name.replace is not a function
  THROW alias-inject findMatches()  -> TypeError: name.replace is not a function
  checkBaselineSelf -> []   (expected: alias-canonical-collision — silently lost)
```

Three distinct failure modes from one schema change:
- **`buildNameIndex`/`nameSet`** → throws. `checkHeaderDiff` + `checkStatusMarkers` die → `runAll` crashes → `npm run lint:docs` exits non-zero with a stack trace → the `write-lint` PostToolUse hook faithfully injects that stack trace as "doc-audit findings" on **every** Write/Edit to a governed doc.
- **`alias-inject findMatches`** → throws, but `main()` swallows it. The hook **dies silently for the entire session** — no error, no note, just gone. Worse than a crash.
- **`checkBaselineSelf`** → does *not* throw. `seenCanonical.has({name,rel})` is always false, so `alias-canonical-collision` silently returns clean. A **new silent false negative** — the exact class the enforcement survey flagged twice.

Blast radius: **88 of 260 rows, 169 alias strings.**

The declared order (03 → 09 → 10) is safe *only if* 09 migrates readers it was never told about. The ordering isn't the bug — the handoff is. And there's a live window regardless: ritual duty 7 obliges any sealing session to patch inventory rows, while the HARVEST §4 amendment defining the new shape is batched with **ticket 10**. Between the ruling and 10, an author following duty 7 reads old HARVEST (flat) but sealed law (typed). Nobody owns "when does v2 bind authors".

#### C-4. The effort's own Record layer evaporates. No ticket owns it.

Ticket 11 Q10 rules `.scratch/` **untracked** and *"disposable after doc-sync"*. `git status` confirms `?? .scratch/`. The twelve tickets contain exactly what the law defines as Record-layer material — *"ruling history (evidence, rejected alternatives, riders)"*: ticket 02's class A/B/C analysis, ticket 03's rejected `sealState` field, ticket 04's rejected options (ii)/(iii), ticket 01's rejected pipeline clause.

None of it reaches git. The doc-sync path carries only: the law diff (rulings 1–2), the HARVEST amendment, registry rows, and run #3's dated report. There is **no `RULINGS.md` for governance** — the meta-exception routes governance *research* to `docs/audits/`, and the map's "Not yet specified" schedules only the three **survey digests** for that trip. The rulings themselves have no destination.

Failure scenario: `rm -rf .scratch/doc-structure` after ticket 10. An agent in three weeks asks "why is `checkNumericRestatement` registry-driven?" or "why is SEALED a status?" — and the answer is nowhere. That is verbatim the user's stated pain — *"나중에 에이전트가 정보를 찾기 힘들"* — reproduced by the package that exists to fix it, on its own output.

---

### HIGH

#### H-5. The 09→10 window puts **100 findings** on every governed edit. Measured.

09 lands the enum + alias-shape checks; 10 migrates the data. Between them, against today's inventory:

```
  rows with flat (untyped) aliases : 88   -> alias-shape findings
  rows with off-domain status      : 5
  rows with off-domain kind        : 5
  rows with off-domain verdict     : 2
  TOTAL on every governed edit between 09 and 10 = 100
```

`write-lint` runs the **whole-repo** lint on every Write/Edit matching `docs/.*` and injects the output. So for the entire 09→10 interval, every doc edit injects ~100 findings. This is textbook alarm fatigue — the documented failure mode the package cites as its standing precedent — manufactured by its own ordering. Nobody specified whether 09's checks tolerate both shapes during migration.

Note the trap in the verdict row: ticket 03 Q5 forbids hand-fixing `standard-term ×2` (audit-owned), while its own handoff tells 09 to check the verdict domain. So 09 ships a check that goes red on 2 rows that ticket 03 forbids anyone to fix until run #3.

#### H-6. Dependency cycle: 08 → 10 → (04+03 law batch) → 12 → 08.

Tracing the declared edges plus the ones buried in prose:
- 10 is `Blocked by: 03, 08, 09`.
- Ticket 03: the HARVEST + Vocabulary Law amendments *"Draft with ticket 10's batch"*.
- Ticket 04: its designation-rule law amendment *"Batch with ticket 03's Vocabulary Law amendment"* → so 04's law text lands **inside ticket 10's batch**.
- Ticket 12's constraint: *"likely after tickets 01/04/05 land so law text about specs' home is settled first"* → 12 waits on 04's law → waits on 10.
- Ticket 12 step 4: *"this replaces ticket 08's superpowers slice … Reconcile with ticket 08 so the file isn't edited twice"* → 08 must not run before 12.
- But 10 is blocked by 08. **Cycle.**

The only escape is 02's parenthetical (*09 "must run AFTER ticket 12 … or query the registry live, which it does by construction"*), which breaks a *different* edge and leaves this one intact. Resolution requires either 08 registering 9 docs at paths 12 will immediately move (the double-edit both tickets explicitly warn against), or un-batching 04's law amendment. Neither is ruled. 08's declared `Blocked by: 01` is wrong on its face — its content depends on 01, 02, 04, 11, and 12.

#### H-7. Nobody owns removing `docs/superpowers/` from the law — and ticket 12 would sed sealed law text.

`documentation-law.md:17` (Working row) names `docs/superpowers/`. That row was **re-sealed today** in `e35caf8` — the user sealed a law row naming a directory that ticket 11, resolved the same day, rules must be retired entirely. The 01+05 batch is closed; ticket 12 is a task ticket. Ticket 12 step 3 says to *"sed the path prefix"* across `.claude/rules/` — but you cannot sed a directory out of a taxonomy row; the token must be **removed**, and that is a Law-layer Tier-3 edit needing a fresh user seal.

So: either a task ticket silently edits sealed law (Tier-3 gate violation, baked into the ticket text), or the law is left pointing at a deleted directory — regenerating the exact staleness class ticket 05 exists to fix, one week later. This is the second law seal in one effort, which is what the batching was designed to avoid.

#### H-8. Ticket 12's blast radius is ~2.6× its estimate, and step 3's grep scope cannot satisfy step 6's exit criterion.

Ticket 12 says "30 files + 20 references". Measured reference lines:

```
    24  docs/features        6  docs/adr           21  docs/audits/doc-registry.json
     1  DOMAIN_MAP.md        1  docs/SYNC-DEBT.md   1  docs/GLOSSARY-QUICKREF.md
     1  .claude/rules        1  .claude/skills      4  mockup
    13  docs/superpowers (intra-directory cross-refs)
```

~52 tracked non-registry reference lines, not 20. Step 3's declared grep scope (`docs/features/`, `docs/adr/`, `DOMAIN_MAP.md`, `.claude/rules/`, `docs/*.md`) catches 34 and **misses 18**: the 13 intra-superpowers cross-refs (the moved files' own stale self-references), 4 in `mockup/`, and `.claude/skills/doc-audit/SKILL.md:11`. Step 6's exit criterion — *"grep `superpowers/` returns only this map's own tickets"* — **cannot be met by step 3's scope.**

Two of the misses matter beyond count:
- `mockup/combat-calc/map-data.js:4` — a **JS file** citing a spec path.
- `mockup/DESIGN-QUESTIONS.md:8` — *"**Source of truth**: `docs/superpowers/specs/2026-07-01-phase-1-mvp-payoff-loop-design.md`"*. Ticket 11's evidentiary basis for the root ruling — *"the 20 references … are all 'landed via SDD — <path>' **historical footnotes**, not live authority reads"* — does not survive contact with a file that literally declares one a source of truth. The claim was scoped to truth docs; the routing ruling's safety argument was not.

Also: the 21 registry rows are read by `checkBaselineSelf` → `git mv` without a same-commit registry update fires **21 `dead-registry-path` findings**.

#### H-9. `.superpowers/` — 138 live files, gitignored — is a third home ticket 11's duplication survey never measured.

```
.gitignore:1:.superpowers/
file count: 138
.superpowers/sdd/progress.md   EXISTS (live, untracked, gitignored)
```

Ticket 12 step 3 guesses ADR 0034's citation *"may be a dead ref already"*. It is **live**. `.superpowers/sdd/` holds `task-N-report.md` files and review diffs — task decomposition and progress, the exact kind ticket 11's table routes.

So task decomposition has **three** homes, not two: `docs/superpowers/plans/` (12, tracked), `.scratch/<effort>/issues/` (10, untracked), `.superpowers/sdd/` (138, gitignored). The root ruling *"the feature is the home"* and its per-kind routing table were derived from a survey that missed the largest of the three, and an **accepted ADR cites into it**. Ticket 11's Q8 `.scratch/` identity analysis is incomplete for the same reason. The measured basis of the package's best ruling has a hole in it.

#### H-10. Ticket 10's terminal gate goes red from its own migration — and stays green where it's actually wrong.

`MARKER_OK['✅'] = (s) => s !== 'PROPOSED'` — a negation, so it accepts *any* non-PROPOSED string:

```
   ✅ + AGREED            -> PASSES        ✅ + rejected-recorded -> PASSES
   ✅ + SEALED            -> PASSES        ✅ + SUPERSEDED        -> PASSES
   ✅ + PROPOSED          -> flags         ✅ + 가안               -> PASSES
                                           ✅ + TOTAL-GARBAGE     -> PASSES
```

Now run ticket 03's migration plan against the live data:

```
   ✅ `Frontage` -> status 가안        | after migration to PROPOSED: *** MISMATCH FIRES ***
   ✅ `Blinds`   -> status SUPERSEDED  | after migration to rejected-recorded: passes silently
```

- **`Frontage`**: 가안 → PROPOSED makes `checkStatusMarkers` fire `status-marker-mismatch`. Run #3's gate is *"lint clean"* — so the migration turns its own gate red, requiring a DOMAIN_MAP marker edit (✅→❓) that no ticket scoped, on the Projection layer.
- **`Blinds`**: SUPERSEDED → `rejected-recorded` sails through the ✅ hole. A dead concept keeps a green checkmark in DOMAIN_MAP and the lint certifies it.

The gate is simultaneously **too strict** (blocks on a finding it manufactured) and **too lax** (green on a genuinely wrong marker). Corollary for ticket 03 Q1: since ✅ is written as `!== 'PROPOSED'`, `SEALED` **already passed** before the ruling. Adding it to the dictionary is enforcement-neutral — the check never read the dictionary it is documented as enforcing. Q1 resolves a real law conflict but buys zero mechanism, and 09's enum check will not close the ✅ hole.

#### H-11. Ticket 01 legalizes a Tier-3 gate with no mechanism — answering a mechanism failure with prose.

Ticket 01's stated evidence for the `law` row: *"`CLAUDE.md` was edited without user sign-off during the 2026-07-14 skill setup — a Tier-3 violation the global rule already forbade and **nothing caught**."* The remedy is a taxonomy row. But:

```
GOVERNED = /^(DOMAIN_MAP\.md|SPEC\.md|DESIGN\.md|docs\/.*|js\/.*\.js|\.claude\/rules\/documentation-law\.md)$/
```

`CLAUDE.md` and `AGENTS.md` — two of the three files in the new Law row — are **not in `write-lint`'s gate**. The next identical violation is caught by exactly the same mechanism as the last one: none. This is the package's own thesis (ticket 03: *"a dictionary without a check is a dictionary that drifts again by next week"*; the forensics: *"the discipline does not survive without a mechanical check"*) applied everywhere except to ticket 01's own ruling. No ticket owns wiring it.

---

### MEDIUM

#### M-12. Ticket 01 carries **two divergent `## Answer (2026-07-15)` blocks** (L54–126, L128–201).

Same ruling, twice, with drift between the copies: the first lacks the *"Documents cell gains"* sentence and the *"Ticket 07 deletes the file"* rider; the ordering of "rejected"/"deferred" differs; sub-decision 3's rationale differs. The ticket whose delivery is *"ONE user-sealed law diff"* does not itself have one authoritative text. This is the M-04 restatement disease inside the ticket that legislates against it, and — per the package's own single-definition rule — there is no principled answer to "which copy did the user seal".

#### M-13. The map and ticket 05 are stale against the tree. The orientation surface misreports the law.

```
e35caf8 2026-07-15 docs(law): sealed batch — agent-layer absorption + staleness corrections
```

Verified applied: `docs/agents/` Working-row registration, the `law` taxonomy row, Correction A (`docs:check` superseded), B (`alias-inject` present-tense), C (ritual duty 7), and ticket 07(3)'s CLAUDE.md trim.

Yet **ticket 05's Answer still reads** *"Status: drafted, awaiting user seal. Nothing here is applied."* The **map still says** 05 is *"drafted, awaiting user seal (nothing applied)"* and *"leaving an expected dangling pointer at `CLAUDE.md:33` until then"* — that pointer is already fixed. The map's "Decisions so far" is the index every agent reads to orient, and it is wrong about the current state of the law. Sealed-but-unrecorded is the same disease as recorded-but-unsealed.

#### M-14. `SEALED`-implies-`AGREED` makes 235 rows actively ambiguous, and the enum check certifies them green.

Distribution: `AGREED: 235, SEALED: 10, PROPOSED: 10, 가안: 1, SUPERSEDED: 1, AGREED-concept: 2, AGREED-structure: 1`.

Ticket 03 concedes the point (*"It does not tell us how many of the existing 235 `AGREED` rows in fact carry a seal"*) and then ships anyway. Once `SEALED` exists as the strong form, a reader's pragmatic inference from `AGREED` is "settled but not sealed" — false for an unknown subset of 235. There is no third value for "audited, confirmed unsealed", so the field encodes three states in two symbols.

The compounding problem is the gate: 09's enum check validates **domain membership only**. After migration, all 260 rows are in-domain, lint reports clean, ticket 10 declares the Destination closed — over data whose seal status is unverified for 90% of rows. A green light over unknown data is worse than a red one, and this is precisely the M-01 semantic-staleness class the map admits is unmechanized.

---

### Genuinely sound (one line each)

- **Ticket 09 item 1** (the `checkStatusMarkers` lookup bug): verified — both skipped rows (`Realm count 4–6…`, `In/out of the balance — hermit clause`) resolve to `AGREED` and pass after the fix. Correct diagnosis, no new findings, real silent-FN closed.
- **Ticket 05's mapping verification**: all three `docs:check` → audit-lint mappings confirmed in code; the supersession holds, including the honest caveat about `duplicate-canonical`'s different mechanism.
- **Ticket 03 Q3** (derive promotion, don't store): correct — `checkHeaderDiff` already scans every DOMAIN_MAP header; a field would be an M-04 copy.
- **Ticket 03 Q5** (index-vs-audit ownership boundary): the sharpest thing in the package. It refuses a fix that would have felt like progress.
- **Ticket 04's premise correction** (the seal was always at RULINGS; the spec is a body, not a fourth seal surface): correct and well-evidenced. It is the *invariant bolted onto it* that fails, not the diagnosis.
- **Ticket 11's root ruling** ("the feature is the home"): the right shape, and the package's best work — but see H-9 for the hole in its measured basis.

---

### Honest efficacy

Graded against the user's stated pain, not the package's goals.

**(b) "참조하는 쪽이 없다" — ~10% treated.** Ticket 02 was *the* ticket for this, and it is a measured no-op (C-1): 0 rows parseable in 7 of 8 targets, permanently. After the package lands, `doc-registry.json` still has 5 fields × 119 rows of which only `.path` produces a finding. The one genuine consumer of the inventory — `alias-inject` — predates the package. The registry ends the effort exactly as the survey found it: *"a well-built P1 index linter carrying a governance model it does not yet read."* The difference is that the package now believes this is fixed.

**(a) "완벽하게 정합되어 있지 않다" — ~35% treated.** 03+09+10 deliver *syntactic* conformance: enum membership, alias shape, dead paths. Semantic coherence — do the 235 `AGREED` rows carry seals? are the 39 `verdict: null` rows right? are the birthplaces right? — is human judgment at run #3, and the M-01 class is explicitly unmechanized. The map concedes this in its own "Not yet specified": *"the M-01 semantic-staleness class is knowingly un-mechanized and **remains the residual on the user's original pain-(a)**."*

**(c) "하나의 문서를 적을 수 있는 장소가 여러 개가 되는 참사" — ~65% treated.** Ticket 11's root ruling is real, and 12 is a real migration. Discounted for H-9 (the survey missed `.superpowers/`, 138 files, the largest of three homes for the same kind, cited by an accepted ADR) and C-4 (the effort's own rulings have no durable home — the disaster reproduced on the package's own output).

**Overall: ~40%, and the shape of the residual repeats 2026-07-10 exactly.** That review found *"the dominant residual class is exactly the user's original pain-a, indicating the package under-delivers on its stated primary target."* Same verdict, same target, five days later — and this time the map **writes the residual down itself** and proceeds. Ticket 03 diagnosed why FE-4 recurred in 5 days (*"because no check enforces the domain"*) and then, in ticket 01, legislated a Tier-3 gate with no check, and in ticket 02, wired a check that cannot fire.

The most dangerous property is not any single finding — it is that **ticket 10's gate cannot see any of them.** "lint clean" is satisfied by: a no-op check (C-1), an unenforced law row (H-11), an unverifiable status field (M-14), and a Record layer that was deleted rather than synced (C-4). The package's terminal validation is green precisely where it is weakest, and closing the map on that gate converts "we didn't measure it" into "it's done."

### What no ticket owns at all

The ADR supersession protocol (`grep -i supersed scripts/` → zero hits; the law's strongest protocol, wholly unenforced — 09 adds only `dead-adr-citation`); seal-triad parsing; `CLAUDE.md`/`AGENTS.md` under `write-lint`; the law's Working row after `docs/superpowers/` dies (H-7); `.superpowers/`'s 138 files (H-9); the governance Record home (C-4); and the re-harvest cadence that pain-(a)'s residual actually hangs on.
