# Lint hardening — silent false negatives + the wiring decided in 02/03

Type: task
Status: BLOCKED — do not execute
Blocked by: 02 (re-grill: its ruling is a measured no-op), 03 (handoff incomplete)

> ## ⛔ DO NOT EXECUTE (blocked 2026-07-15 by adversarial review)
>
> Evidence: `docs/audits/2026-07-15-doc-structure-review.md` (C-1, C-3, H-5, H-10).
>
> - **Ticket 02's class-A wiring is a measured no-op.** `checkNumericRestatement`
>   hardcodes not just the target path but DOMAIN_MAP's **row grammar**
>   (`DM_ROW = /^- (✅|❓|⛔) \`([^\`]+)\`/`). Run live against the 7 new target
>   files: **0 rows parsed, 0 findings, in all 7** — model docs are tables and
>   prose. "Coverage 1→8" is a paper number; effective coverage stays 1, forever.
>   Implementing this as ruled adds a registry consumer that reads and does
>   nothing. Re-grill 02 first.
> - **Ticket 03's typed-alias handoff omits the readers it breaks.** Tested with
>   a v2 row: `audit-lint buildNameIndex()` **throws** (→ `runAll` crashes → the
>   write-lint hook injects a stack trace on every governed edit);
>   `alias-inject findMatches()` **throws and is swallowed by main()** (→ the hook
>   dies silently for the whole session); `checkBaselineSelf` **silently returns
>   clean** (→ new false negative). Blast radius **88 of 260 rows, 169 alias
>   strings**. 03's handoff named none of these — it must be rewritten to list
>   every reader before 09 is scoped.
> - **The 09→10 window injects ~100 findings on every governed edit** (88 flat-
>   alias + 5 status + 5 kind + 2 verdict), because write-lint runs the whole-repo
>   lint on every `docs/.*` write. Nobody specified whether 09's checks tolerate
>   both shapes during migration. Alarm fatigue — the documented failure mode this
>   package cites as precedent — manufactured by its own ordering.
> - **Verdict-check trap**: 03 Q5 forbids hand-fixing `standard-term ×2`
>   (audit-owned) while telling 09 to check the verdict domain — so 09 ships a
>   check that is red on 2 rows nobody may fix until run #3.
> - **The `✅` hole is out of scope but load-bearing**: `MARKER_OK['✅'] =
>   (s) => s !== 'PROPOSED'` passes *any* non-PROPOSED string. 09's enum check
>   validates domain membership only and will not close it.

## Question

One TDD batch on `scripts/audit-lint.js` (+ hooks if ticket 02 says so),
extending the existing 44-test suite:

1. **`checkStatusMarkers` lookup bug** — L164 uses
   `index.get(h.term.toLowerCase())` instead of the module's own
   `lookup()`/`normalizeName`, silently skipping 2 of 117 DOMAIN_MAP marker
   rows (measured: `Realm count 4–6 (authoring default 5)` and `In/out of the
   balance — hermit clause`, the en/em-dash cases normalizeName exists to
   handle). One-line fix + regression test.
2. **`checkCodeContract` silent skips** — 56 of 80 `codeIdentifier` rows have
   empty `codeRefs` and are skipped without trace (L133). The terminology
   audit deliberately recorded these as "design-ahead-of-code, not
   violations" — so probably an informational count in the CLI summary rather
   than a finding kind, but decide and implement.
3. **`checkFreshness` date scoping** — takes the max of EVERY
   `\d{4}-\d{2}-\d{2}` in every glossary (L286–289), so incidental dates
   (citations, superseded notes) can false-positive the QUICKREF. Scope to
   seal-stamp lines.
4. **ADR-citation hole** — `checkAdrStampDuty` L237 silently drops citations
   of nonexistent ADR files; its comment claims "check-7 territory" but
   `checkBaselineSelf` never validates ADR numbers cited in production docs.
   Add a finding kind (`dead-adr-citation`) or extend baselineSelf.
5. **New checks per tickets 02 and 03** — the registry reader (02's spec, with
   its FP budget) and the schema/enum check (03's spec: status, kind, verdict
   domains on incremental patches).

## Constraints

- Findings stay reports (S13); no blocking behavior anywhere.
- Every new check ships with tests and a narrowing rule — the
  numeric-restatement FP lesson (55–80% raw FP rate before narrowing) is the
  standing precedent.
- `runAll` roots at `process.cwd()`; don't break the hook's invocation path.

## Output

Committed lint/hook changes, all tests green, `npm run lint:docs` output
reviewed against the live tree.

## Evidence

`research/enforcement-survey.md` (§B check inventory, §E verified limits —
all four bugs documented with line numbers and measurements).
