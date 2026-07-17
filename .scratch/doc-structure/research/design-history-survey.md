# Design History Survey — doc-governance archaeology

Survey date: 2026-07-15 — snapshot; verify line numbers against the live tree before acting.

Full chain covered: spec (S1–S15) → run #1 → cold adversarial review → P2 law amendments → P3 cleanup → P1 lint → run #2 → skill + hooks.

**Bottom line:** this system is *finished*, not in-progress. The forensics P-series is fully landed (P1/P2/P3 done, P4 rejected), the skill and hooks are live, and the author already ran a **cold adversarial review** against his own remedy package that pre-refuted most obvious critiques. Two P-items remain deferred by explicit user ruling — and one of them (`docs:check`) has been silently superseded by the shipped lint.

---

## A. Forensics findings — all 19 codes

Source: `docs/audits/2026-07-10-structure-forensics.md`. Three code families: **F-01…F-11** (repo forensics), **M-01…M-07** (claude-mem archaeology), **R-01** (Ring B cross-feed). The law cites only F-04/06/07/08/09 and M-07 because those are the ones that became law text; the rest became cleanup.

Root-cause distribution (forensics:36–41): enforcement-failure 11 (58%) · law-gap 4 (21%) · structural-defect 3 (16%) · law-defect 1 (5%).

| Code | Finding | Root cause | Disposition |
|---|---|---|---|
| **F-01** | 블라인드 DOMAIN_MAP:754-758 still `❓ "Mechanism undecided"`; birthplace GLOSSARY:89 superseded it 2026-07-08. The MT-⑤ batch "was recorded Paid while silently skipping this row" | enforcement | **PAID** — P3 A3 re-slim + re-status |
| **F-02** | 징집 명부 DOMAIN_MAP:751 restates M13 dials (registerPerPop 1,800, sustain ⅓) *alongside its own pointer* | enforcement | **PAID** — P3 A3 |
| **F-03** | Yield DOMAIN_MAP:96-103 restates full M14 price table while pointing at M14 | enforcement | **PAID** — P3 A3 |
| **F-04** | 노화 헌법 DOMAIN_MAP:38-49 reproduces full P1/P2/P3 body; **"the 'Design Principle' section of DOMAIN_MAP has no enforced summary+pointer form."** B2 logged this tension 2026-07-05 and never resolved it — "F-04 is its recurrence" | **law-defect** (only one) | **ADOPTED INTO LAW** — Vocabulary Law: *"applies to EVERY DOMAIN_MAP entry, including the Core Terms and Design Principle sections — not only promoted feature terms (adopted 2026-07-10, forensics F-04)"* + P3 re-slim |
| **F-05** | hermit clause DOMAIN_MAP:685-686 restates numeric floor (1,000) owned by birthplace | enforcement | **PAID** — P3 A3 |
| **F-06** | Hegemony victory gate — SPEC-level, cross-feature, explicitly anticipated as an ADR (SYNC-DEBT:132) — lives only in RULINGS ⑨⑪⑮⑰ + code. **"No ADR 0001-0028 covers victory."** | **structural** | **ADR 0030 backfilled** + mandatory-ADR-trigger clause |
| **F-07** | Domination victory (DT-③) — second win-type shipped to engine + SPEC with no ADR. **"The ADR corpus stops recording once a decision is 'SPEC-level'."** | **structural** | **ADR 0030** (same) + trigger clause |
| **F-08** | Force-geography defense model landed to main (0e8dc52); ledger itself said "May need a large ADR"; none written | enforcement | **ADR 0031 backfilled** |
| **F-09** | ADR 0014's Decision (garrison free self-heal) contradicted by the P1 dual-billing seal, but 0014 stamps only ADR 0022. **"The supersession protocol covers ADR-amends-ADR, not RULINGS-seal-amends-ADR — no commit ever triggers the stamp, and 0014 read in isolation still announces free auto-regen"** | **law-gap** | **ADOPTED INTO LAW** — seal-amends-ADR duty; ADR 0014 header stamped 2026-07-10 |
| **F-10** | §5 conquest-growth implemented in code but ledger's Open row still framed it as design-stage. "Ledger currency not maintained" | enforcement | **PAID** — status corrected in-ledger, SYNC-DEBT:131 cites "case F-10" |
| **F-11** | ADR-0014-stamp debt recorded as **two separate Open rows** — "ledger hygiene" | enforcement | **PAID** — merged; "one stamp, both rows" |
| **M-01** | DOMAIN_MAP:695 stale "settlement arrives alive" contradicted sealed ADR 0022 ripening; found mid-implementation — **"would have driven a wrong implementation if trusted"** | enforcement | ADR 0029 draft + user seal. **Class explicitly NOT mechanized** (see E9) |
| **M-02** | A doc-sync synced seals but skipped principle promotion; root-level methodology principle unrecorded until user caught it | law-gap→**fixed** | Ritual promotion-scan clause added reactively |
| **M-03** | RULINGS.md operated as de-facto decision record while unnamed in the law | law-gap→**fixed** | Legislated into Record layer |
| **M-04** | Stale "1.5 × initial military" manpower definition duplicated across **≥6 docs**; stayed authoritative-looking until hunted out of every copy. **"Duplication is what gave the stale value places to live"** | enforcement | Became the **anti-M-04 rename checklist** (plan A1) |
| **M-05** | Parity-start/derived-asymmetry scattered across 8+ files, no single birthplace; SPEC Principle 8 authored without DOMAIN_MAP capture | enforcement | Reconciled same session |
| **M-06** | Glossary infrastructure fragmented — 4 of 9 features have a GLOSSARY; match-arc GLOSSARY at 26.8K "suggests duplication over pointers" | enforcement | **NO ACTION** — "latent risk, medium-low confidence" |
| **M-07** | QUICKREF regenerated 2026-07-09 yet missing same-day sealed DT-① metrics — **"the law's own 'may lag canon' allowance means the ritual can be followed and the surface still misleads"** | **structural** | **ADOPTED INTO LAW** — same-session freshness duty + lint check 6 |
| **R-01** | `information confidence` load-bearing across DESIGN, 6 ADRs, 6 js files, never registered. **"The coinage-duty clause covers conversation-born terms; nothing obliges code/ADR-born concepts to register"** | law-gap | **Registered** (A5) at fog-of-war GLOSSARY |

**The joint:** all 3 structural defects "sit on **one joint**" (forensics:43–46) — SPEC-level decisions bypass the ADR layer (F-06/07), plus QUICKREF's lag allowance (M-07). *"This is a joint repair, not a reorganization."*

---

## B. P-tier items — **two unrelated P-series exist**

The single most confusable thing in the archive. Do not merge them.

### B1. Forensics remedy series (2026-07-10) — `structure-forensics.md:154–179`

| Item | What | Status |
|---|---|---|
| **P1** | Mechanize enforcement (Layer 0 lint script) — ghost terms, code contracts, restatement heuristic, ledger currency, freshness stamps | **LANDED** — `scripts/audit-lint.js`, `npm run lint:docs`, 29 TDD tests. 8 checks. Acceptance run: 5 findings, all disposed (92ce96a) |
| **P2** | Two law amendments: (i) seal-amends-ADR stamp duty (ii) mandatory ADR trigger (iii) *optionally* F-04 wording | **ALL THREE ADOPTED** — including the "optional" (iii). Live in `documentation-law.md` |
| **P3** | One-time debt payment batch (re-slim 6 rows, fix 블라인드, stamp 0014, backfill ADRs, fix F-10/F-11, register ghosts) | **DONE** — commit `4c83432` |
| **P4** | **No vertical restructure** | **REJECTED** — see E1 |

Promotion chain beyond P1 (SYNC-DEBT:243–291): (a) P1 lint **BUILT** · (b) `/doc-audit` skill **DONE** · (c) hooks **DONE** · (d) audit run #2 **DONE** · (e) residual code-identifier drift **OPEN** (folded into the owed `js/situation.js` rework).

### B2. Codex governance-audit series (2026-07-05) — verdict **"ADOPT WITH FIXES"**

Session `019f3183…`, ~203k tokens. Retrofit queue seeded SYNC-DEBT.

| Item | What | Status |
|---|---|---|
| **Codex P1** | DOMAIN_MAP slimming | **PAID** 2026-07-05 (A-4 B2) |
| **Codex P1** | Glossary row splitting (definition vs ruling history) | **PAID** 2026-07-05 (B1) |
| **Codex P1** | ADR header normalization sweep + status index | **PAID** 2026-07-06 (B5) |
| **Codex P1** | **Term lifecycle beyond promotion** — proposed→agreed→promoted→renamed→deprecated states; *"renames are the dangerous case for agents"* | **OPEN** (SYNC-DEBT:423) |
| **Codex P2** | Alias field (Korean casual phrases, code identifiers) in glossary schema | **OPEN** (same row) — de facto satisfied by `term-inventory.json` aliases, never closed |
| **Codex P2** | L-level seal stamps (L0–L3) | **ADOPTED** 2026-07-06 |
| **Codex P2** | `npm run docs:check` lint | **DEFERRED** (user) — **see E2, now stale** |
| **Codex P2** | Working-layer sublabels | **DEFERRED** (user) |

⚠️ **The law's own text is stale on B2.** `documentation-law.md` says *"the `docs:check` lint and Working-layer sublabels from the same audit stay deferred"* — but all three checks `docs:check` proposed are **already implemented** in `audit-lint.js` under different names: "amended references without ADR stamp" → `checkAdrStampDuty` (#8); "quickref older than newest seal date" → `checkFreshness` (#6); "duplicate term headers" → `checkBaselineSelf` `duplicate-canonical` (#7). **Do not propose `docs:check` — propose closing its ledger row as superseded.**

---

## C. S-codes — the sealed design decisions

**Defined in `docs/superpowers/specs/2026-07-10-doc-audit-and-forensics.md:32–48`**, table "Sealed Decisions", S1–S15. Sealed in the 2026-07-10 grilling session.

| # | Decision | Disposition |
|---|---|---|
| S1 | Dual dictionary, per-term routing: `mechanism`→genre (Paradox/Civ/wargames), `meta`→design theory (GDC/MDA) | Applied run #1. **Drifting** — see G |
| S2 | Ring A (definition surfaces, full harvest) + Ring B (usage surfaces, cross-check only) | Applied |
| S3 | Outputs = dated human report + single living machine JSON, in `docs/audits/` | Applied |
| S4 | **"Inventory is a regenerable derived artifact, never hand-maintained"** | ⚠️ **OVERTURNED** — HARVEST.md:8: the claim *"was fiction without committed tooling"*. Replaced by two-mode model |
| S5 | Fixed path, regenerated in place; git history is the change log; no dated copies | Applied |
| S6 | Rows carry machine-checkable metadata only — **never definition text** | Applied |
| S7 | Verdicts feed back (`verdict`/`verdictRef`) to prevent re-flagging accepted coinages | Applied (carry-forward by canonical name) |
| S8 | **Escalation ladder**: Layer 0 script (JSON+grep, no LLM) → Layer 1 targeted Read → Layer 2 git/history | **Codified** in `.claude/skills/doc-audit/SKILL.md:18` |
| S9 | **Skill promotion deferred** — first manual run is the prototype; skill only after run #1 validates | **DONE** 2026-07-10 — cited by doc-registry.json:1402 as *"S9 skill codification"* |
| S10 | Forensics catalog = markdown, **not JSON (YAGNI)** — one-shot diagnostic | Applied |
| S11 | Doc registry = second baseline; **law → registry → lint flows one way** | Applied |
| S12 | Every failure tagged against the law; **only a dominance of structural-defect justifies restructure**; the law itself is an audit subject | Applied — drove P4 rejection |
| S13 | **Separation of powers**: lint/skill *applies* the law (judicial); amendments are legislative, user-sealed. *"The skill never edits documentation-law as a side effect"* | Codified |
| S14 | Execution = one parallel wave of 6 read-only subagents (W1–W6) | Executed |
| S15 | Remedy decided **after** evidence. Grilling stance on record: sync-discipline, not topology | Executed |

**Note:** the law's conflict rule does **not** cite S13. S13 is cited in `scripts/hooks/write-lint.js:4,56`, `scripts/hooks/alias-inject.js:8`, and `SKILL.md:12`. The law carries the *principle* ("Lint findings are reports, never legislation") without the S-number. No S-code appears in `documentation-law.md` at all.

---

## D. SYNC-DEBT complete inventory (23 Open + 2 Deferred)

**Flagged items first:**

| Item | Reality |
|---|---|
| **audit lint** | **NOT deferred — LANDED.** :245 `scripts/audit-lint.js`, 29 tests, 8 checks. Law text calling it a "P1 prototype … tracked in SYNC-DEBT" is stale |
| **term inventory maintenance** | Ritual duty 7 + HARVEST two-mode. **Live: 260 terms** but `regenerated: 2026-07-10` and **39 rows `verdict: null`** = unjudged Ring B queue grown since run #1 |
| **`docs:check`** | :440 Deferred, *"no generator yet; adopt when a misfile actually slips (YAGNI)"* — **functionally superseded** (B2 above) |
| **Working-layer sublabels** | :445 Deferred, *"no misfiling observed — revisit if it occurs (emergence-limit)"* |
| **alias matching → hooks** | **DONE** :257 — `alias-inject.js` live. Law text ("promoted to hooks only after the audit lint validates it") is **stale** |
| **seal-sync deferrals** | :63 **Crisis co-analysis seal-sync — DEFERRED** (6 sub-items a–f: RULINGS CE-④/⑭/⑦ amends, INERT records, GLOSSARY rows, QUICKREF regen, ADR 0035/0036 stamps, inventory patch). Reason: *"pass is PARKED, dials stay 가안, so premature to final-seal"*. Pays when crisis un-parks |

**All Open rows:** :14 catalog altitude-reclassification · :22 commit-curve grading · :27 HCLM→SPEC promotion (Tier-3, user) · :31 three-altitude reading→DESIGN (Tier-3, user) · :36 stationary fatigue-recovery HELD dial · :40 crisis dial table RAN/PARKED · **:63 crisis seal-sync DEFERRED** · :77 `eliminate()` register non-conservation (Tier-3, needs baseline re-seal) · :92 suppression cost not deducted · :104 L3 scar-intel fog · :109 timing-ruler promotion scan (held as **CHECKED non-promotion**) · :148 derived-asymmetry machine-check (optional hardening) · :156 match-tilting residual · :170 recovery-dial residual · :179 L2 fidelity-boundary grill (war half PAID 2026-07-13) · :222 unsealed surge/economy 가안 · :238 battery.js retired dials · :243 doc-governance chain (only (e) left) · :293 A-3 must ingest L2 freeze evidence · :423 term lifecycle + alias field (Codex) · :428 model-doc naming unification + promotion ladders to root.

⚠️ **Ledger hygiene recurrence:** rows :202 (occupation-geography) and :301 (force-geography) are marked `[x] PAID` but still sit **inside the Open section** — the exact F-11 class the forensics flagged. Cheap fix.

---

## E. Already considered and REJECTED/DEFERRED — do not re-propose

1. **Vertical restructure (P4) — REJECTED on evidence.** *"Zero failures were caused by documents being in the wrong place… Moving files would fix none of the 19 cases and would break existing pointers."* Reopen condition is explicit: *"revisit only if post-P1/P2 audits surface topology-caused failures."* A restructure proposal needs new topology-caused evidence, not argument.
2. **`docs:check` lint — DEFERRED (YAGNI):** *"no generator yet; adopt when a misfile actually slips."* Superseded in practice.
3. **Working-layer sublabels — DEFERRED (emergence-limit):** *"no misfiling observed — revisit if it occurs."*
4. **`docs/SEALS.md` seal registry — DECIDED NO** (user, 2026-07-05): *"this ledger + dated in-doc seal stamps remain the mechanism."*
5. **Manpower rename — REJECTED.** The genre's most entrenched term lost to the **intuitive-over-compact ruling (2026-07-07)**. "manpower" survives as an alias only.
6. **The 5-item rename agenda (aging constitution, position as product, battle-summoning placement, denied-dominant, force geography) — alias-only is the FINAL disposition**, *"not an open item"* (handoff:69). Run #2: *"treated as P3's final disposition, not reopened here."*
7. **46 low-severity synonyms — "no action"**, recorded "for future reference only."
8. **Dropping map-lore proper nouns — REJECTED.** Reading run #1 literally would have dropped rows that are real GLOSSARY table rows and *"immediately false-positive `checkHeaderDiff`."* Narrowed to **Ring-B-judging-only**; HARVEST.md amended so nobody re-reads it literally.
9. **Mechanizing semantic staleness (M-01 class) — knowingly NOT mechanized.** *"Semantic staleness with no string invariant is knowingly NOT mechanized — layer-C (periodic /doc-audit full re-harvest) territory, not hook territory."* This is the acknowledged residual on **pain-(a), the user's original primary target.**
10. **Forensics catalog as JSON — rejected (YAGNI, S10).**
11. **Per-entry DOMAIN_MAP sync metadata — rejected as over-heavy**; section-level chosen for "always-load/maintenance economy."
12. **Naive numeric-restatement heuristic — rejected/narrowed.** Measured **55–80% FP rate** (33 flagged → ~3–5 true). *"Will cause alarm fatigue."* Narrowed to rows that BOTH carry a pointer AND a dial-pattern number.
13. **Blocking hooks — rejected.** Both advisory-only, *"never blocking"*; the fire/ignore judgment *"stays with the agent, never encoded as hook logic"* (exploration exemption).
14. **Auto-rename / auto-register in the skill — forbidden (S13).**
15. **Dated inventory copies — rejected (S5).**
16. **Codifying B4's routing convention — "WATCH, do not codify on first instance" (emergence-limit)** — promote only if a second prototype does the same.
17. **L-stamp as a 4th mandatory seal field — rejected**; optional, retrofit optional.
18. **Relationship field on plain-Accepted ADRs — rejected** (anti-noise; the index is their normalization surface).
19. **A committed generator script — considered, resolved by re-declaring.** Cold review fix #2 offered "commit a real generator **OR** re-declare hand-maintained + add a lint check." The author chose the latter (HARVEST two-mode + `checkBaselineSelf`). **"No committed generator exists"** is a deliberate accepted state, not an oversight.

### E-bonus: the cold adversarial review (claude-mem obs #10250) — pre-refuted critiques

A `claude-fable-5` subagent adversarially reviewed the remedy package **before seal**. Verdict: **SOUND-WITH-FIXES** — diagnosis verified correct, remedy package flawed. It found 5 factual errors + 8 self-inflicted failure modes, and prescribed **10 ranked required fixes** (all applied). Anyone re-criticizing this system will likely rediscover these:

- **FE-1 [HIGH]** 3 tier-0 rows had corrupted birthplace (`docs/adr/0019`, a non-file) — *"birthplace is load-bearing for all proposed lint checks."*
- **FE-2 [HIGH]** `actionCapacity` claimed codeRefs in 4 js files; **grep found zero**. "False refs on a known violation."
- **FE-3** doc-registry missed 6 tracked files; invented a `law` layer not in the taxonomy.
- **FE-4** status enum uncontrolled (AGREED 197 / SEALED 11 / PROPOSED 9 / 가안 1 / candidate 1 / SUPERSEDED 1) vs the law's 3-value dictionary.
- **Honest efficacy estimate:** *"~7-8 of 19 cases mechanically caught, ~5 law-text-only, ~5-6 essentially untreated"* → **45–60% reduction**, and *"the dominant residual class (semantic prose staleness, M-01) is exactly the user's original pain-a, indicating the package under-delivers on its stated primary target."*
- The 10 fixes: fix baselines · commit generator **or** re-declare + lint · define mid-session regeneration trigger · extend P2 with 3 missing amendments · add 2 cheap mechanizations · numeric exclusion list + FP budget · drop/gate hooks · **register promotion gates in SYNC-DEBT** (*"gates must be owned rows, not a deferred-forever plan"*) · complete registry coverage · rename-execution checklist.

*(The "3 missing P2 amendments" are recorded only as a count in obs #10250 — the enumeration isn't recoverable from any committed file.)*

---

## F. Vocabulary/terminology design intent

**Problem it was built to solve** (spec:21–24): two pain targets — **(a) truth reliability** (stale/conflicting content misleading agents) and **(b) capture failure** (decisions never recorded). Navigation load (c) is *"treated as secondary — expected to improve as a byproduct of copy reduction."* Stated motives: **reuse value and LLM parsing reliability**.

**Why an *index* at all:** the decisive measurement (forensics:23–32) — DOMAIN_MAP single-definition compliance is **30% violating (6/20)**, and *"the four rows slimmed by the 2026-07-05 B2 batch are all still compliant; violations cluster in sections B2 never touched AND in entries added after B2."* Conclusion: **"Hand-slimming works but decays — the discipline does not survive without a mechanical check."** The inventory exists to give a no-LLM Layer 0 script something to check against.

**What the audit actually found:**
- **Headline: "No high-severity naming problems exist."** Zero misparse/miss-level terms. 97 justified-coinage / 65 standard-match / 55 synonym-exists / 3 undetermined.
- **The one real asymmetry:** meta language runs **53% synonym-exists (24/45)** vs **18% for mechanism (31/175)**. *"Internal design shorthand reinvents established design vocabulary far more often than mechanic names do — expected, since mechanism names went through explicit naming rulings and meta shorthand grew in conversation."*
- **Ghost terms:** `information confidence` [HIGH] (6 ADRs, 6 js files, 14 uses, no row) · `force role` [MED] · `diplomacy` as a system [MED] (11 files/98 uses, zero coverage) · 4 province-archetype aliases [LOW] (run #2 found **7 missing, not 4**).
- **Synonym drift:** `gold` ↔ Treasury (국고) [MED] — fixed at SPEC:264; ADR 0013:33 was a **false positive** (names a map-legend color).
- **Code-contract violations:** `actionCapacity`→ code uses `capacity`/`CapacitySystem` · `computeProvinceStatus`→ code implements `classifyHex` · `terrainDef` vs `terrainDefense`. **Both still open** (folded into the `js/situation.js` rework).
- **47 of 69 declared code identifiers are "design-ahead-of-code"** (empty codeRefs) — *"not violations; recorded so the future lint can distinguish 'not yet built' from 'built under a different name'."*
- **Legacy prototype layer:** js/ carries diplomacy/gold/buildings/research/attackForce predating terrain-first vocabulary, entirely unregistered — *"Ring B code checks will stay noisy until the legacy layer is either registered or scheduled for replacement."*

**Duplicate-definition cases:** M-04 (one stale value, six copies — *"Duplication is what gave the stale value places to live"*), plus the 6 DOMAIN_MAP restatement rows (F-01…F-05 + Usable value).

**Overloaded/ambiguous terms — thinner than expected.** Only one explicit case is documented:
- **"Position as product" → path-dependent position:** *"'product' ambiguous (multiplication vs outcome)"* (terminology-audit:50). **Rejected in favor of alias-only.**

Adjacent, not framed as overloading but structurally the same risk:
- **A near-collision the docs handle deliberately:** `Information confidence` (Tier-1, fog GLOSSARY, 정보 신뢰도) vs `Province status confidence` (Tier-0, DOMAIN_MAP) vs `confidenceGain` (Tier-0) — three "confidence" terms. **ADR 0023 explicitly distinguishes** the first two; the audit cites that distinction as *why* the ghost needed its own row.
- **Common-word alias scoping** was an explicit hook design constraint: exact word-boundary matching only, MIN_LEN guard, *"verified 'gold' never fires since it isn't a registered alias."*
- **`Void terrain` → impassable terrain:** *"'void' does not read as impassability"* — a legibility, not ambiguity, failure. **Renamed.**

No systematic cross-layer homonym sweep has ever been run. S6/single-definition is the author's structural answer to overloading.

---

## G. Live drift the archive doesn't know about (verified 2026-07-15 by running the tooling)

Not in any document — found by execution. These show which *sealed* invariants are quietly eroding.

- **`npm run lint:docs` is NOT clean** — 1 open finding: `numeric-restatement` on term **"Operation"** (*"row carries a pointer to an owning doc AND a dial-pattern value"*). Undisposed.
- **Inventory grew 221 → 260** with `"regenerated": "2026-07-10"` unchanged — incremental patching (ritual duty 7) is working; the **full re-harvest is ~5 days and ~39 terms overdue**. **39 rows carry `verdict: null`** = the Ring B judging queue.
- **FE-4 has recurred and worsened.** Status enum now includes `SEALED` (10), `AGREED-concept` (2), `AGREED-structure` (1), `가안` (1), `SUPERSEDED` (1) against the law's 3-value dictionary. The cold review flagged exactly this; check #3 cross-checks DOMAIN_MAP markers vs inventory status but **never enforces the enum itself**.
- **S1's binary is breaking:** `kind` now has `mechanic` (2), `state` (2), `strategy` (1) alongside `mechanism`/`meta` — these rows **cannot be dictionary-routed**. Verdict enum leaked `standard-term` (2), not in S7's set. All five off-enum rows trace to `docs/features/capital/GLOSSARY.md` and recent match-arc rows.
- **Birthplace-priority erosion:** 12 rows are born at `force-geography/RULINGS.md` and 3 at `docs/adr/0019` — HARVEST's priority is *GLOSSARY > DOMAIN_MAP > model doc > RULINGS*, and ADR-born rows are a standing *"tension with the law's 'ADRs never define' rule."* HARVEST:78–82 already calls these *"registration-gap evidence, not clean data."*

**Net for a proposer:** the mechanized layer landed and works; what is decaying is exactly what the cold review predicted would decay — **enum/schema discipline on incremental patches**, which no check enforces. That gap is real, cheap, and un-proposed. Nearly everything else one might reach for has already been ruled on.
