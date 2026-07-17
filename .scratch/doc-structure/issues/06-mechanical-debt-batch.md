# Mechanical debt batch — ledger hygiene + Operation row re-slim

Type: task
Status: resolved

## Question

One AFK session paying two small, evidence-confirmed debts:

1. **SYNC-DEBT section hygiene** — rows marked `[x] PAID` still sitting inside
   the Open section (occupation-geography ~:202, force-geography ~:301) — the
   exact F-11 class the forensics flagged once already. Move them to the paid
   section; sweep the whole ledger for other section misplacements while
   there.
2. **Dispose the standing lint finding** — `DOMAIN_MAP.md:611`, the
   `Operation` row, carries both a pointer (`ADR 0026`) and a dial-pattern
   value (`~3–6 turns`), violating the single-definition rule
   (F-01…F-05 class). Re-slim: keep the pointer, move the number to the
   owning doc if it isn't already there (check `operation-plan-catalog` /
   ADR 0026 first — it likely is). Re-run `npm run lint:docs`; target clean.

## Notes

- The adjacent `War` row (~:614, "~8–12 turns") does NOT fire the lint — it
  carries no pointer, and that asymmetry is the heuristic's design
  (pointer AND dial). Do not "fix" the War row; do not widen the heuristic.
- Inventory patch duty: if the re-slim changes no term status or name, no
  inventory row needs touching (index fields only).

## Output

Committed ledger + DOMAIN_MAP edits; lint output clean (or every remaining
finding explained in this ticket's resolution).

## Evidence

`research/design-history-survey.md` (§D ledger inventory, §G live drift) ·
`research/enforcement-survey.md` (numericRestatement mechanics, the
Operation/War asymmetry).

## Answer (2026-07-15)

Both debts APPLIED. `npm run lint:docs` → **clean (8 checks, 0 findings)**;
`npm test` → **372 pass / 0 fail**. Edits are applied and verified but
**left uncommitted** (shared working tree with parallel tickets 05/07;
`CLAUDE.md` was already dirty on arrival and is not ours).

### Job 1 — SYNC-DEBT section hygiene (F-11)

**2 rows moved**, exactly the two the survey named — no others found.

- `Occupation-geography pass … PAID 2026-07-11` (19 lines)
- `Force-geography pass — the next spine … PAID 2026-07-10` (121 lines)

Both were `[x]` rows sitting in `## Open`; both now sit in `## Paid`,
inserted in the section's existing date-descending order (after the
2026-07-11 group, before the 2026-07-09 row).

Reformatted **only** each row's header line to the Paid section's
convention (`- [x] YYYY-MM-DD — **Title — PAID** …`), which the section
holds without exception — the paid date moved from inside the bold title
to the date prefix. Verified as a pure relocation: a sorted line-by-line
diff of the whole file against `HEAD` shows the 3 deliberately reformatted
header lines and **nothing else** — every other line byte-identical.

Post-state: `## Open` 23 rows (all `[ ]`, matching the survey's "23 Open"
count) · `## Deferred` 2 rows · `## Paid` 25 rows (all `[x]`, all
date-prefixed). Full-file sweep found **no other misplaced rows** (0 `[x]`
in Open, 0 `[ ]` in Paid).

**Exclusion respected:** the `docs:check` row and the Working-layer-sublabels
row are both untouched — still `- [ ]` in `## Deferred`, awaiting ticket 05's
pending seal.

### Job 2 — DOMAIN_MAP Operation row re-slim

**Guard checked first, and it passed** — the dial is safely at its
birthplace, so the re-slim applied:

- `term-inventory.json` gives `Operation`'s birthplace as
  `docs/features/match-arc/GLOSSARY.md` (tier 1, PROPOSED).
- That file's **"The arc ladder"** block (~L58–63) carries the full ladder
  including `작전 (operation)  shield-break, siege: 3–6 turns`.
- Note the DOMAIN_MAP row's pointer is `ADR 0026`, but the *value's* owner is
  the match-arc GLOSSARY — and the section's own header block (L594–606)
  already names `docs/features/match-arc/` as authoritative and states
  "sealed dial values and ruling history live in the feature docs." The row
  was contradicting its own section's stated discipline.

`DOMAIN_MAP.md:611` re-slimmed — `, ~3–6 turns` removed, `(ADR 0026)` pointer
kept, three lines rewrapped. No new pointer added (the section header already
carries one). This disposes the standing `numericRestatement` finding at its
source rather than explaining it away.

**Not touched, deliberately:** the adjacent `War` row (`~8–12 turns`) — it
carries no pointer, so it does not fire the lint. That asymmetry is the
heuristic's design (`audit-lint.js` L180–182), not a bug. The heuristic was
not widened.

**Inventory patch duty: none owed.** The re-slim changed no term status
(`❓`/PROPOSED unchanged) and no name — index fields untouched, per the
ticket's own note.
