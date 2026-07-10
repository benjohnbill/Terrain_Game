# Documentation Audit & Structure Forensics Design

Date: 2026-07-10

Status: Sealed in grilling session (2026-07-10), awaiting user review of this
write-up before execution.

## Purpose

Two linked investigations over this repository's documentation system:

1. **Terminology standardization audit** — verify that domain terms used
   across DOMAIN_MAP.md, feature GLOSSARYs, and related surfaces match
   established game-industry vocabulary, for reuse value and LLM parsing
   reliability.
2. **Documentation structure forensics** — collect evidence of documentation
   failures (stale content misleading agents, decisions never recorded) to
   drive a later, evidence-based decision on remedies (law enforcement
   mechanization vs. topology change).

Primary pain targets: **(a) truth reliability** (stale/conflicting content)
and **(b) capture failure** (decisions that should have been recorded but were
not). Navigation load (c) is treated as secondary — expected to improve as a
byproduct of copy reduction, revisited only if it persists.

Both investigations are **read-only evidence gathering**. No renames, no file
moves, no law amendments are executed in this pass. Findings become canon only
after user seal.

## Sealed Decisions

| # | Decision | Note |
|---|---|---|
| S1 | Reference corpus = dual dictionary with per-term routing | `mechanism` terms → genre conventions (4X / grand strategy / wargame: Paradox, Civ, classic wargames); `meta` terms → game-design theory vocabulary (GDC / design literature) |
| S2 | Harvest scope = Ring A (definition surfaces, full harvest) + Ring B (usage surfaces, cross-check only) | Ring B is read-only symbol-table checking: ghost terms, synonym drift, code-contract violations. mockup/combat-calc internals excluded except names of sealed dials |
| S3 | Outputs = human report (dated file per audit run) + machine inventory (single living JSON) | Location: `docs/audits/` (new directory) |
| S4 | Inventory is a regenerable derived artifact, never hand-maintained | Truth stays at birthplace GLOSSARYs; harvest procedure documented in `docs/audits/HARVEST.md` so the file can always be regenerated |
| S5 | Versioning: inventory = fixed path, regenerated in place; git history is the change log | No dated inventory copies. Regeneration commits carry summary messages (e.g. `audit: regenerate inventory (+3 terms, 1 rename)`) |
| S6 | Inventory rows carry machine-checkable metadata only — never definition text | Single-definition rule applies: definitions live at birthplace; the inventory is an index (name, pointer, tier, status, kind, code identifier, verdict) |
| S7 | Audit verdicts feed back into the inventory (`verdict`, `verdictRef` fields) | Prevents re-flagging accepted coinages on every re-run; hot path stays JSON-only |
| S8 | Escalation ladder for future consistency checks: Layer 0 script (JSON + grep, no LLM) → Layer 1 targeted Read on anomalies → Layer 2 git/past reports only when history is needed | |
| S9 | Skill promotion deferred: the first manual audit run is the prototype; a `/doc-audit`-style skill is codified only after run #1 validates the procedure, then wired into the session-close ritual | |
| S10 | Forensics evidence = four sources (see §5) producing a failure-case catalog (markdown, disciplined fields) | Catalog is one-shot diagnostic evidence — not JSON (YAGNI) |
| S11 | Doc registry = second living JSON baseline (`docs/audits/doc-registry.json`) | File → layer / role / owner / allowed-content map derived from documentation-law; sibling of the term inventory; future doc-lint checks against it. Law → registry → lint flows one way |
| S12 | Every failure case is tagged against documentation-law: enforcement failure / law defect / law gap / structural defect | Only a dominance of *structural defect* tags justifies the proposed vertical restructure; documentation-law itself is an audit subject |
| S13 | Separation of powers: lint/skill applies the law (judicial); law amendments are legislative — proposed from evidence, sealed only by the user | The skill never edits documentation-law as a side effect |
| S14 | Execution = one parallel wave of 6 read-only subagents; synthesis in main session (audit report first, then forensics catalog, then remedy proposals) | The only data dependency (Ring B findings → type-(b) evidence) is joined at synthesis time |
| S15 | Remedy decision (restructure vs. mechanized enforcement) is made **after** evidence, not in this pass | Grilling stance on record: observed symptoms suggest sync-discipline failure, not topology failure; DOMAIN_MAP.md at 54.1KB vs. the law's "summary + pointer" rule is exhibit #1 |

## Artifacts

```
docs/audits/
├── term-inventory.json                   # living baseline — all registered terms
├── doc-registry.json                     # living baseline — all doc files, roles per law
├── HARVEST.md                            # regeneration procedure for both JSONs
├── 2026-07-XX-terminology-audit.md       # dated verdict report (audit run #1)
└── 2026-07-XX-structure-forensics.md     # dated failure-case catalog
```

### term-inventory.json row schema

```json
{
  "canonical": "projectable mass",
  "korean": "가용 병력 질량",
  "aliases": [],
  "birthplace": "docs/features/combat-formula/GLOSSARY.md",
  "tier": 0,
  "status": "AGREED",
  "kind": "mechanism",
  "codeIdentifier": "projectableMass",
  "codeRefs": ["js/econ.js"],
  "verdict": null,
  "verdictRef": null
}
```

- `kind`: `"mechanism"` | `"meta"` — dictionary routing (S1).
- `verdict`: `null` | `"standard-match"` | `"synonym-exists"` |
  `"justified-coinage"` | `"undetermined"` (S7).
- Top level carries `"regenerated": "<date>"` and the term array.

### doc-registry.json row schema

```json
{
  "path": "DOMAIN_MAP.md",
  "layer": "projection",
  "role": "tier-0 canon: summary + pointer only",
  "ownerFeature": null,
  "allowedContent": ["summary", "pointer"],
  "forbiddenContent": ["definition-body", "value-restatement"]
}
```

Derived from documentation-law's layer taxonomy and file-role table. Regenerated
whenever the law is amended.

### Terminology audit report format

Per-term verdict rows: term / kind / dictionary consulted / verdict / severity /
suggested standard term (if any) / rationale. Plus a Ring B findings section:
ghost terms (used but never defined), synonym drift (one concept, two names),
code-contract violations (canonical ↔ code identifier mismatch). Rename
candidates are ranked by severity; **report-only** — every rename requires a
separate user seal.

### Forensics catalog format

One entry per failure case, disciplined fields:

```
- id: F-07
  class: a | b            # a = truth reliability, b = capture failure
  source: SYNC-DEBT | claude-mem | diff-sample | adr-gap-scan | ring-b
  what: <one-line incident description>
  evidence: <pointer — file/line, observation ID, commit, diff>
  lawClause: <the documentation-law clause that should have prevented it>
  rootCause: enforcement-failure | law-defect | law-gap | structural-defect
```

The root-cause distribution across the catalog is the decision input for S15.

## Terminology Audit Design

**Ring A — definition surfaces (full harvest):** DOMAIN_MAP.md; GLOSSARY.md ×4
(combat-formula, match-arc, tactical-plan-ai, terrain-cradle);
docs/GLOSSARY-QUICKREF.md (catches 가안 UNSEALED rows and digest drift); model
docs (MAGNITUDE, FORMULA, MATCHUP, CATALOG, STRATEGY-SPACE, TEST-LADDER);
RULINGS.md ×4 (terms born in rulings but never registered).

**Ring B — usage surfaces (cross-check only):** SPEC.md, DESIGN.md, all ADRs,
`js/` code identifiers. Detects the three violation types (S2). Adds nothing to
the inventory; produces findings rows only.

**Verdict procedure:** classify each Ring A term (`mechanism`/`meta`), consult
the routed dictionary (training knowledge + WebSearch when uncertain), emit a
verdict row citing which dictionary was consulted.

## Forensics Design

Four evidence sources:

1. **`docs/SYNC-DEBT.md`** — the existing tracked ledger: pre-classified
   type-(a) cases, lowest cost, read first.
2. **claude-mem archaeology** — session-history queries for un-ledgered
   incidents: "stale discovered", "documents contradict", "corrected course
   after reading wrong doc". Catches what was never self-reported.
3. **Physical diff sampling** — sample DOMAIN_MAP entries against their
   birthplace GLOSSARY rows; measure how many carry more than summary+pointer
   and how many diverge from birthplace. Turns the 54KB observation into a
   measured rate.
4. **ADR gap scan (type-b only)** — sweep RULINGS.md ×4, git commit messages,
   and mockup NOTES verdicts for architecture-grade decisions absent from the
   29-ADR index. Output: a list of decisions that should have been ADRs.

## Execution Plan — One Parallel Wave (6 subagents)

All subagents are read-only. Each returns structured findings; assembly and
final judgment happen in the main session (conversation context + consistency
of verdicts).

| # | Agent | Brief |
|---|---|---|
| W1 | Harvester | Extract the full term inventory draft from Ring A files per the row schema. No judgment — extraction only. Output: JSON draft |
| W2 | Genre-dictionary judge | For all `mechanism` terms in W1's draft: verdict rows against 4X/grand-strategy/wargame conventions. Cite the convention source per verdict |
| W3 | Design-theory judge | For all `meta` terms: verdict rows against game-design-theory vocabulary. Cite source per verdict |
| W4 | Ring B scanner | Sweep SPEC/DESIGN/ADRs/js against W1's draft: ghost terms, synonym drift, code-contract violations |
| W5 | Repo forensics | Evidence sources 1, 3, 4 (SYNC-DEBT ledger, DOMAIN_MAP diff sampling, ADR gap scan). Output: catalog entries with law-clause tags |
| W6 | Memory forensics | Evidence source 2 (claude-mem queries). Output: catalog entries for un-ledgered incidents, each with observation-ID evidence |

Dependency note: W2/W3/W4 consume W1's draft, so W1 completes first, then
W2–W6 run in parallel (W5/W6 have no dependency and may start with W1).

**Synthesis order (main session):** (1) merge W1–W4 into the audit report +
final inventory; (2) merge W5–W6 + Ring B findings into the forensics catalog;
(3) read the root-cause distribution and draft remedy proposals for user
decision (S15).

## Out of Scope (this pass)

- Executing any rename, file move, or restructure.
- Amending documentation-law (proposals only, user-sealed — S13).
- Building the `/doc-audit` skill or lint scripts (S9 — after run #1).
- DOMAIN_MAP slimming (a likely remedy, but decided on evidence in step 3 of
  synthesis, not pre-committed).
