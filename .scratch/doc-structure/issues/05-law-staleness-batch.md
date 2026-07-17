# Law staleness batch — three stale sentences + one superseded ledger row

Type: task
Status: resolved

## Question

Produce a proposed diff for `.claude/rules/documentation-law.md` correcting
three factually stale statements (the law has caught the disease it exists to
prevent), plus one ledger closure. Tier-3: the user seals the diff; this
ticket's work is producing it precisely.

1. **"the `docs:check` lint and Working-layer sublabels from the same audit
   stay deferred"** — false for the first half: all three checks `docs:check`
   proposed are implemented in `scripts/audit-lint.js` under different names
   (amended-refs-without-stamp → `checkAdrStampDuty`; quickref-older-than-seal
   → `checkFreshness`; duplicate-term-headers → `duplicate-canonical` in
   `checkBaselineSelf`). Sublabels remain genuinely deferred. The sentence must
   split, not vanish.
2. **Conversational-term-alignment clause: "promoted to hooks only after the
   audit lint validates it (tracked in `docs/SYNC-DEBT.md`)"** —
   `scripts/hooks/alias-inject.js` has been live since 2026-07-10 (fired
   repeatedly in the 2026-07-15 session). Rewrite as present-tense fact.
3. **Ritual duty 7: "run the audit lint once it lands (P1 prototype — tracked
   in SYNC-DEBT)"** — landed, 29 tests, hook-wired. Rewrite as standing duty.

Also: close the SYNC-DEBT `docs:check` row as **superseded by audit-lint**
(per the design-history survey: do not re-propose it — close it), citing the
three check-name mappings above.

## Notes

- Keep each correction minimal — no restructuring of surrounding law text.
- If ticket 01 resolves around the same time, offer the user a single combined
  amendment batch to reduce law churn; otherwise ship alone.

## Output

A reviewable diff + the SYNC-DEBT row edit, applied only on user seal.

## Evidence

`research/design-history-survey.md` (§B2 staleness table, docs:check
supersession) · `research/enforcement-survey.md` (check inventory).

## Answer (proposed — user seals)

> **Status: APPLIED and user-sealed at `e35caf8` (2026-07-15).** The text below
> was the draft; it is retained as the reasoning record, not as pending work.
>
> **What actually landed differs from Correction A's AFTER block.** The
> reviewer note (below) won: the law carries the trimmed one-liner — "its checks
> ship in `scripts/audit-lint.js` under other names" — and the three mappings
> live only in the SYNC-DEBT row, not restated in the law. Corrections B and C
> landed with minor rewording. Verify against
> `.claude/rules/documentation-law.md` and `git show e35caf8`, not against the
> AFTER blocks below, which are now stale.
>
> *Original reviewer note (main session, pre-seal):* Correction A restates all
> three check mappings inside the law text while the new SYNC-DEBT row already
> carries them — two copies of the same detail (M-04 smell). Consider trimming A
> to "the `docs:check` lint is superseded by `scripts/audit-lint.js` — see
> `docs/SYNC-DEBT.md`" and letting the ledger row hold the mappings. Batch with
> ticket 01's law diff (one seal, minimal law churn).
>
> **Citation corrections (fact-check, 2026-07-15 — FE-1 class, this ticket's own
> errors):** the `docs:check` row was at `docs/SYNC-DEBT.md:318-327`
> (`## Deferred` header at :318, row at :320-323), **not** ":448-457"; the
> proposal text was at **:320-323**, not ":451-452". Both cited line ranges hold
> unrelated hegemony-gate / force-geography content. The BEFORE blocks
> themselves were verbatim-exact against `e35caf8^` (law lines 68-70, 137-139,
> 182-187) — the mapping table and the code verification are confirmed sound.

### Mapping verification (done against `scripts/audit-lint.js`, not taken on faith)

All three `docs:check`-proposed checks are implemented under other names.
The finding kinds and behaviour were read directly from the code:

| `docs:check` proposal (SYNC-DEBT:451-452) | Implemented as | Code | Emits |
|---|---|---|---|
| "amended references without ADR stamp" | `checkAdrStampDuty` (check 8) | `audit-lint.js:226-249` | `unstamped-adr-amendment` |
| "quickref older than newest seal date" | `checkFreshness` (check 6) | `audit-lint.js:281-298` | `stale-quickref` |
| "duplicate term headers" | `duplicate-canonical` in `checkBaselineSelf` (check 7) | `audit-lint.js:302-325` | `duplicate-canonical` |

All three VERIFIED real. One honesty note on the third: `docs:check` framed
"duplicate term headers" as a grep over doc surfaces; `duplicate-canonical`
instead catches a canonical term registered twice in the
`term-inventory.json` baseline (`law → registry → lint`, S11). Same intent
(a term defined/registered twice), different mechanism — the shipped lint
covers the concern, so the supersession holds.

Supporting facts also verified: `alias-inject.js` present and wired at
`.claude/settings.json:21` (UserPromptSubmit; header self-describes as
mechanizing the conversational-term-alignment rule); `npm run lint:docs` →
`scripts/audit-lint.js` in `package.json`; `write-lint.js` wired at
`settings.json:9` (PostToolUse); `tests/audit-lint.test.js` = 29 tests.

---

### Diff 1 — `.claude/rules/documentation-law.md`

**Correction A — seal-mechanics parenthetical (lines 68-70).** Splits the
false "both stay deferred" claim: `docs:check` is superseded (name the three
mappings); only Working-layer sublabels remain deferred.

BEFORE:
```
fourth mandatory field. (Codex P2; the `docs:check` lint and
Working-layer sublabels from the same audit stay deferred — see
`docs/SYNC-DEBT.md`.)
```
AFTER:
```
fourth mandatory field. (Codex P2. The `docs:check` lint from the same
audit is superseded — all three of its checks now ship in
`scripts/audit-lint.js` under other names (amended-refs-without-stamp →
`checkAdrStampDuty`, quickref-older-than-newest-seal → `checkFreshness`,
duplicate-term-headers → `duplicate-canonical`); only the Working-layer
sublabels stay deferred — see `docs/SYNC-DEBT.md`.)
```

**Correction B — conversational-term-alignment clause (lines 137-139).**
alias-inject is live, not pending; rewrite as present-tense fact.

BEFORE:
```
heads to a seal. The mechanizable slice (exact alias/구칭 matching)
is promoted to hooks only after the audit lint validates it
(tracked in `docs/SYNC-DEBT.md`).
```
AFTER:
```
heads to a seal. The mechanizable slice (exact alias/구칭 matching)
is mechanized by the `scripts/hooks/alias-inject.js` UserPromptSubmit
hook (live since 2026-07-10; advisory-only, never blocks).
```

**Correction C — ritual duty 7 (lines 182-187).** The lint landed and is
hook-wired; rewrite the "once it lands (P1 prototype — tracked in
SYNC-DEBT)" future-tense as a standing duty.

BEFORE:
```
7. Maintain the audit baselines (adopted 2026-07-10): a session that
   sealed, renamed, or re-statused a term patches its
   `docs/audits/term-inventory.json` row in the same doc-sync batch
   (index fields only, per `docs/audits/HARVEST.md`); run the audit
   lint once it lands (P1 prototype — tracked in `docs/SYNC-DEBT.md`).
   Lint findings are reports, never legislation.
```
AFTER:
```
7. Maintain the audit baselines (adopted 2026-07-10): a session that
   sealed, renamed, or re-statused a term patches its
   `docs/audits/term-inventory.json` row in the same doc-sync batch
   (index fields only, per `docs/audits/HARVEST.md`); run the audit
   lint (`npm run lint:docs`) — landed 2026-07-10
   (`scripts/audit-lint.js`, also wired as the `write-lint.js`
   PostToolUse hook). Lint findings are reports, never legislation.
```

---

### Diff 2 — `docs/SYNC-DEBT.md` (close the `docs:check` row as superseded)

Move the `docs:check` row out of Deferred and into Paid as SUPERSEDED
(per the F-11 ledger-hygiene lesson: a resolved row does not sit in its
original section). Working-layer sublabels stays Deferred.

**In the Deferred section (lines 448-457)** — remove the `docs:check` row,
leaving only sublabels:

BEFORE:
```
## Deferred (user-decided 2026-07-06, A-4 B6 — revisit on trigger)

- [ ] **`npm run docs:check` lint** (Codex P2, optional tooling):
  grep-level checks — "amended" references without ADR stamp, quickref
  older than newest seal date, duplicate term headers. **User deferred:
  no generator yet; adopt when a misfile actually slips (YAGNI).**
- [ ] **Working-layer sublabels** (Codex P2): distinguish staging
  verdicts / generated digests / planning scratch / risk register
  inside the Working layer. **User deferred: no misfiling observed —
  revisit if it occurs (emergence-limit).**
```
AFTER:
```
## Deferred (user-decided 2026-07-06, A-4 B6 — revisit on trigger)

- [ ] **Working-layer sublabels** (Codex P2): distinguish staging
  verdicts / generated digests / planning scratch / risk register
  inside the Working layer. **User deferred: no misfiling observed —
  revisit if it occurs (emergence-limit).**
```

**In the Paid section** — add at the top (newest-first), directly under
`## Paid`:
```
- [x] 2026-07-15 — **`npm run docs:check` lint (Codex P2) — SUPERSEDED
  by audit-lint** (was Deferred 2026-07-06, A-4 B6). Not re-proposed —
  all three grep-level checks it proposed now ship in
  `scripts/audit-lint.js` (landed 2026-07-10, `npm run lint:docs`,
  hook-wired) under other names: "amended references without ADR stamp"
  → `checkAdrStampDuty` (check 8); "quickref older than newest seal
  date" → `checkFreshness` (check 6); "duplicate term headers" →
  `duplicate-canonical` in `checkBaselineSelf` (check 7). The shipped
  lint covers the intent (design-history survey §B2). The other A-4 B6
  Codex P2 — Working-layer sublabels — stays Deferred above.
```
