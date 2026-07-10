# Documentation Structure Forensics — Run #1 (2026-07-10)

Status: evidence document + remedy proposals. Proposals are PROPOSED until
user seal; nothing here amends the documentation law by itself.

Question under test: are the observed documentation failures caused by the
**topology** (doc structure — would a vertical restructure fix them?) or by
**sync discipline** (the law is right but hand-enforced)? Decision rule agreed
in the design session: only a dominance of `structural-defect` root causes
justifies restructuring.

Evidence sources: (1) docs/SYNC-DEBT.md ledger; (2) claude-mem session
archaeology; (3) physical diff sampling DOMAIN_MAP vs birthplaces; (4) ADR gap
scan (RULINGS/commits/NOTES vs ADR index); plus Ring B findings from the
parallel terminology audit. Every case is tagged against
`.claude/rules/documentation-law.md`:
`enforcement-failure` (clear clause, not followed) · `law-defect` (clause
ambiguous) · `law-gap` (no clause covers it) · `structural-defect` (clause
followed, failure happened anyway).

## Verdict-relevant measurements

**DOMAIN_MAP single-definition compliance (sample n=20 promoted entries):**
- Violation rate (definition body / dial restatement beyond summary+pointer):
  **30% (6/20)** — 징집 명부, Yield, 노화 헌법, hermit clause, Usable value, 블라인드.
- Birthplace divergence (contradicts/lags): 5% confirmed (블라인드) + 1 suspected
  (usable-value recovery vs conquest ripening — needs a code-layer trace).
- **The decisive pattern:** the four rows slimmed by the 2026-07-05 B2 batch
  are all still compliant; violations cluster in sections B2 never touched
  AND in entries added after B2 (2026-07-07/08 doc-syncs restating dials
  their own row points to). Hand-slimming works but decays — the discipline
  does not survive without a mechanical check.

**Root-cause distribution (19 catalog entries):**

| rootCause | count | share |
|---|---|---|
| enforcement-failure | 11 | 58% |
| law-gap | 4 | 21% |
| structural-defect | 3 | 16% |
| law-defect | 1 | 5% |

The 3 structural defects are not scattered — all three sit on **one joint**:
SPEC-level decisions route SPEC ⇄ RULINGS ⇄ code and bypass the ADR layer
(F-06, F-07), and QUICKREF's law-sanctioned "may lag canon" allowance leaves a
misleading surface (M-07).

## Failure catalog

Class a = truth reliability (stale/conflicting content) · class b = capture
failure (decision not recorded where it should be).

### From physical diff sampling (source: diff-sample)

- **F-01** [a · enforcement-failure] 블라인드 — DOMAIN_MAP:754-758 still ❓
  "Mechanism undecided"; birthplace GLOSSARY:89 superseded it 2026-07-08
  (MT-⑤ economic-device ruling). The MT-⑤ doc-sync batch was recorded Paid
  while silently skipping this row. Law: conflict rule + ritual duty 2.
- **F-02** [a · enforcement-failure] 징집 명부 — DOMAIN_MAP:751 restates
  M13-owned dials (registerPerPop 1,800, sustain ⅓) alongside its own pointer
  to MAGNITUDE M13. Law: single-definition rule.
- **F-03** [a · enforcement-failure] Yield — DOMAIN_MAP:96-103 restates the
  full M14 price table while pointing at MAGNITUDE M14. Law: single-definition.
- **F-04** [a · **law-defect**] 노화 헌법 — DOMAIN_MAP:38-49 reproduces the
  full P1/P2/P3 body; the "Design Principle" section of DOMAIN_MAP has no
  enforced summary+pointer form. The B2 batch itself logged this law-wording
  tension (SYNC-DEBT, Paid 2026-07-05) and it was never resolved — F-04 is
  its recurrence.
- **F-05** [a · enforcement-failure] hermit clause — DOMAIN_MAP:685-686
  restates the numeric floor (1,000) owned by the birthplace row.

### From ADR gap scan (source: adr-gap-scan)

- **F-06** [b · **structural-defect**] Hegemony victory gate (leadership +
  unassailability) — SPEC-level, cross-feature, explicitly anticipated as an
  ADR (SYNC-DEBT:132 "Next = hegemony ADR grill") — lives only in match-arc
  RULINGS ⑨⑪⑮⑰ + GLOSSARY + code (a29eb0a). No ADR 0001-0028 covers victory.
- **F-07** [b · **structural-defect**] Domination victory (DT-③) — a second
  win-type shipped to engine + SPEC (commits a29eb0a, 2629181) with no ADR.
  Same hole as F-06: the ADR corpus stops recording once a decision is
  "SPEC-level".
- **F-08** [b · enforcement-failure] Force-geography — new defense model
  (terrain-bound defense + reactive reserve), L2 harness landed to main
  (0e8dc52); ledger itself said "May need a large ADR" (SYNC-DEBT:102-103);
  none written.
- **F-09** [b · **law-gap**] ADR 0014's Decision (garrison free self-heal) is
  contradicted by the P1 dual-billing seal (GLOSSARY:84, MT-①, 2026-07-07),
  but 0014's header stamps only ADR 0022. The supersession protocol covers
  ADR-amends-ADR, not **RULINGS-seal-amends-ADR** — no commit ever triggers
  the stamp, and 0014 read in isolation still announces free auto-regen.

### From the SYNC-DEBT ledger (source: SYNC-DEBT)

- **F-10** [b · enforcement-failure] §5 conquest-growth engine implemented in
  code today (6c2f561…e7df309) but the ledger's Open row still frames §5 as
  design-stage ("SHAPED, numbers deferred"). Ledger currency not maintained.
- **F-11** [b · enforcement-failure] The ADR-0014-stamp debt is recorded as
  two separate Open rows (SYNC-DEBT:58-70 and :71-83) — ledger hygiene.

### From claude-mem archaeology (source: claude-mem)

- **M-01** [a · enforcement-failure] DOMAIN_MAP:695 stale "settlement arrives
  alive" contradicted sealed ADR 0022 ripening; found mid-§5-implementation
  (obs #10183, 2026-07-10) — would have driven a wrong implementation if
  trusted. Fix required ADR 0029 draft + user seal.
- **M-02** [b · law-gap→fixed] A doc-sync synced seals but skipped principle
  promotion; a root-level methodology principle went unrecorded until the
  user caught it (obs #9743). The ritual's promotion-scan clause was ADDED in
  response — precedent that law-gaps get patched reactively.
- **M-03** [b · law-gap→fixed] RULINGS.md operated as the de-facto decision
  record while unnamed in the law (obs #8446); later legislated into the
  Record layer. Same reactive-patch precedent.
- **M-04** [a · enforcement-failure] Stale "1.5 × initial military" manpower
  definition duplicated across ≥6 docs; stayed authoritative-looking after
  the MT-② re-founding until hunted out of every copy (obs #9319).
  Duplication is what gave the stale value places to live.
- **M-05** [b · enforcement-failure] Parity-start/derived-asymmetry principle
  scattered across 8+ files with no single birthplace; SPEC Principle 8
  authored without DOMAIN_MAP capture (obs #9686; reconciled same session).
- **M-06** [a · enforcement-failure] Glossary infrastructure fragmented — 4
  of 9 features have a GLOSSARY; match-arc GLOSSARY at 26.8K suggests
  duplication over pointers (obs #10110). Latent risk, medium-low confidence.
- **M-07** [a · **structural-defect**] QUICKREF regenerated 2026-07-09 yet
  missing same-day sealed DT-① metrics (obs #9991) — the law's own "may lag
  canon" allowance means the ritual can be followed and the surface still
  misleads.

### From Ring B (terminology audit cross-feed)

- **R-01** [b · law-gap] `information confidence` — load-bearing across
  DESIGN, 6 ADRs, and 6 js files, never registered in any vocabulary surface.
  The coinage-duty clause covers conversation-born terms; nothing obliges
  code/ADR-born concepts to register. (Ghosts `force role`, `diplomacy
  system` are the same gap; counted once.)

## Diagnosis

1. **The vertical-restructure hypothesis is not supported.** Zero failures
   were caused by documents being in the wrong place or the tree shape being
   wrong; 58% are clear-rule-not-followed. Moving files would fix none of the
   19 cases and would break existing pointers. (Grilling stance confirmed by
   evidence: sync-discipline problem, not topology problem.)
2. **Hand-enforced discipline decays measurably.** B2 slimming: compliant
   where it ran, 30% violation rate outside/after it. M-04: one stale value,
   six copies. The failure mode is not ignorance of the law (it is
   auto-loaded) but the absence of any mechanical check between ritual runs.
3. **One structural hole is real and local:** SPEC-level decisions bypass the
   ADR layer (F-06/07/08 — three win-condition/defense-model decisions with
   no ADR), and its twin law-gap F-09 (seals amend ADRs without stamping).
   This is a joint repair, not a reorganization.
4. Law-gaps historically get patched reactively after user-caught incidents
   (M-02, M-03). This audit is the first proactive sweep.

## Remedy proposals (PROPOSED — user decision)

- **P1. Mechanize enforcement (Layer 0 lint script).** Checks against the two
  baselines in this directory: ghost terms (inventory vs usage surfaces),
  code-contract pairs, DOMAIN_MAP restatement heuristic (numeric values in a
  row that also carries a pointer), ledger currency (Open rows vs recent
  commits), QUICKREF/INDEX freshness stamps vs seal dates. Addresses the 58%
  enforcement-failure share + M-07's lag surface. Prototype = the audit-run
  procedures; promote to a `/doc-audit` skill after this run per the sealed
  plan (S9).
- **P2. Two law amendments** (user-sealed, per the legislative path):
  (i) extend the ADR supersession protocol to cover **any Production seal
  that amends an accepted ADR** — the seal batch must stamp the ADR header in
  the same session (closes F-09); (ii) add an explicit ADR trigger: a
  decision that changes a win condition, a cross-feature model, or SPEC
  direction MUST land with an ADR in the same batch (closes the F-06/07/08
  joint). Optionally (iii) resolve the F-04 wording tension: DOMAIN_MAP
  Design-Principle section gets the same summary+pointer form as promoted
  terms.
- **P3. One-time debt payment batch** (ordinary doc-sync, no restructure):
  re-slim the 6 violating DOMAIN_MAP rows; fix the 블라인드 row; stamp ADR
  0014; backfill 2–3 ADRs (victory gate incl. domination, force-geography
  defense model); fix ledger rows F-10/F-11; register `information
  confidence` + `force role`.
- **P4. No vertical restructure.** Explicitly rejected on this evidence;
  revisit only if post-P1/P2 audits surface topology-caused failures.
