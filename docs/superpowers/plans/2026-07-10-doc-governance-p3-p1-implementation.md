# Doc Governance Implementation Plan — P3 Cleanup + P1 Lint

Date: 2026-07-10
Status: sealed package (grilling session 2026-07-10 + cold review riders);
P2 law amendments already applied to `.claude/rules/documentation-law.md`.
Source evidence: `docs/audits/2026-07-10-structure-forensics.md`,
`docs/audits/2026-07-10-terminology-audit.md`, cold review (session record).

Execution mode: inline, sequential, single context (every edit is an
application of the just-amended law; subagent briefing would exceed the work).
P1 script via TDD.

## Phase A — P3 cleanup batch (doc edits)

Order matters: renames first (they touch the same DOMAIN_MAP rows the
re-slimming edits), then slimming, then ADR backfill, then ledgers/inventory.

### A1. Renames (3) — with the anti-M-04 checklist

For EACH rename: (1) `grep -rn` the old name across ALL tracked docs + js/ +
inventory to enumerate every occurrence BEFORE editing; (2) birthplace row
renamed, old name kept as `구칭` alias (law); (3) every non-birthplace
occurrence updated or pointed; (4) inventory row: canonical swapped, old name
into aliases, verdict updated to standard-match; (5) re-grep to confirm zero
unqualified stragglers.

- National cap → **force limit** (known extra restatement: DOMAIN_MAP:~100
  Yield row; code `capPerPop` untouched — design-ahead-of-code)
- Void terrain → **impassable terrain**
- Derived asymmetry → **emergent asymmetry** (SPEC Principle 8 wording —
  user-approved in the sealed package; SPEC edit cites this plan)

### A2. Alias-only additions (6) — inventory rows + birthplace 구칭/alias notes

manpower (→ Latent mobilizable population) · anti-stalemate ratchet (→ Aging
constitution) · military geography (→ Force geography) · anti-leader
coalition (→ Denied-dominant) · path-dependent position (→ Position as
product) · flashpoint placement (→ Battle-summoning placement).

### A3. DOMAIN_MAP re-slim (the 6 violating rows, forensics F-01…F-05)

징집 명부 · Yield · 노화 헌법 · hermit clause · Usable value · 블라인드 —
each row reduced to summary + pointer (values stay only in the owning model
doc); 블라인드 row additionally re-statused ❓→superseded-as-economic-device
per birthplace GLOSSARY:89. Verify: no numeric dial value remains in a row
that carries a pointer (the F-02/03/05 pattern).

### A4. ADR backfill (2) + stamp (1)

- **ADR 0030 (or next free): Victory conditions** — hegemony decision point
  gate (leadership + unassailability, RULINGS ⑨⑪⑮⑰) + domination victory
  OR-branch (DT-③, commits a29eb0a/2629181). Written under the new mandatory-
  ADR-trigger clause; cites RULINGS as birthplace, defines nothing (pointer
  ADR recording the decision + why).
- **ADR 0031: Force-geography defense model** — terrain-bound defense +
  reactive mobile reserve (FG-①…⑩, commit 0e8dc52); amends the ADR-0008/0014
  defense stat model → stamp those headers in the same commit.
- **ADR 0014 header** — add `Amended by match-arc RULINGS MT-① (2026-07-07)`
  + one-line delta (garrison regen bills register+treasury), per the new
  seal-amends-ADR duty. Closes the twice-recorded SYNC-DEBT rows.

### A5. Ghost registrations (2)

- `information confidence` — Tier-1 row at its de-facto home (fog-of-war
  feature; GLOSSARY.md to be created for it or registered in RULINGS-adjacent
  glossary section) + inventory row (codeIdentifier `informationConfidence`).
- `force role` — umbrella-term row (birthplace: DOMAIN_MAP as project-native,
  or ADR 0009-adjacent feature glossary) + inventory row.

### A6. Ledger + baseline bookkeeping

- SYNC-DEBT: fix F-10 (§5 row → implemented), merge F-11 duplicate rows,
  mark rows paid by A3/A4, and ADD the promotion-gate rows (cold review):
  `P1 lint prototype [owner: next doc-governance session]`,
  `/doc-audit skill promotion [gate: P1 validated]`,
  `hook promotion [gate: lint check-set validated]`.
- term-inventory.json: apply all A1/A2/A5 row changes in the same batch
  (law ritual duty 7).
- GLOSSARY-QUICKREF: regenerate including this batch's seals (new duty 4).

## Phase B — P1 lint prototype (TDD)

One script (location: `docs/audits/lint.py` or `scripts/` — decide at build),
reading the two baselines, exit-code + findings-report output. Checks, as
revised by cold review:

| # | Check | Method |
|---|---|---|
| 1 | Ghost terms | usage-surface vocab vs inventory canonical+aliases (exact match slice only) |
| 2 | Code contract | inventory codeIdentifier+codeRefs vs `grep` of js/ |
| 3 | Status-marker cross-check (NEW — cheapest, targets pain (a)/F-01) | DOMAIN_MAP ✅/❓/⛔ markers vs inventory `status` per term |
| 4 | Numeric restatement (NARROWED — naive form false-positives 30-80%) | flag only rows that BOTH carry a pointer to an owning model doc AND contain a dial-pattern number (unit-suffixed / `=`-assigned); date/ID/count exclusions specified in tests first |
| 5 | Ledger currency | SYNC-DEBT Open rows vs `git log` since row date (keyword match) |
| 6 | Freshness stamps | QUICKREF/INDEX "last regenerated" vs latest seal dates |
| 7 | Baseline self-check (NEW — cold review) | every inventory birthplace is an existing file; every registry path exists; alias/canonical uniqueness |
| 8 | ADR stamp duty | grep RULINGS/GLOSSARY for `amends ADR \d+` → verify target ADR header carries a stamp |

TDD: fixture-driven — craft minimal doc snippets per check (true positive,
true negative, known false-positive trap) before implementation. Acceptance:
run against the repo post-P3; expected findings ≈ zero on A3-cleaned rows,
known-open items only.

## Explicitly deferred (SYNC-DEBT rows, not silent)

/doc-audit skill codification (after P1 validates) · hook layer
(UserPromptSubmit alias inject + PostToolUse write-lint; design constraints
recorded: exploration-exemption conflict, birthplace-구칭 path exclusions,
common-word alias scoping e.g. "gold") · full SYNC-DEBT row-by-row currency
audit · semantic-staleness residual (M-01 class — layer C cadence, not
mechanizable).
