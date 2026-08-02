# Audit run #3 — full re-harvest on the settled schema (terminal gate)

Type: task
Status: open
Blocked by: none

> ## ⚠ Amended 2026-08-03 — the run happened; only the exit criterion is open
>
> **This ticket's work was executed on 2026-07-26** and is on record at
> `docs/audits/2026-07-26-audit-run-3.md` (commit `a3bf9a2`). All four work
> items below ran: the `verdict: null` queue went **39 → 0**, the registry went
> **119 → 167 rows with 0 dead paths**, the dated report was written, and
> `lint:docs` came back **0 blocking** (8 advisory, each verified spurious).
> The run executed **without** tickets 08 and 09 landing, so the declared
> blocker line was not merely stale — it was never binding.
>
> **The status line said `BLOCKED — do not execute` for the seven days after
> that run**, and it is quoted verbatim as the precondition of the L3 build's
> gate 12 (a) (`.scratch/l3-playable-build/README.md`), which was therefore
> recorded as blocked on work that was already finished. That is the whole
> visible cost of the error, and it is the same defect class as the 2026-08-02
> gate-11 incident: a blocker line nobody re-read.
>
> **What remains true, and is the only reason this ticket is still open:** the
> review below judged the ticket's *exit criterion* unsound — a lint-clean run
> cannot fail where the package is weakest. The run happening does not settle
> that. The run's own report says so in its header: *"evidence document …
> nothing here changes canon by itself."* **So the map's Destination does not
> close on the strength of that run**, and redesigning the criterion is what
> this ticket now is.
>
> The original block is preserved below rather than deleted, because its gate
> analysis is still live and only its execution verdict expired.

> ## Superseded verdict (was: ⛔ DO NOT EXECUTE) — gate analysis still stands
>
> Evidence: `docs/audits/2026-07-15-doc-structure-review.md` (H-10, M-14, and
> the honest-efficacy section).
>
> **The terminal gate is green precisely where the package is weakest.** "lint
> clean (8 checks, 0 findings)" is satisfied by: a no-op check (ticket 02's
> class-A wiring parses 0 rows in 7 of 8 targets), an unenforced law row (ticket
> 01's Law layer — `CLAUDE.md`/`AGENTS.md` are not in write-lint's `GOVERNED`
> regex, so the next identical Tier-3 violation is caught by nothing), a status
> field whose seal-state is unverified for 235 of 260 rows, and a Record layer
> that is deleted rather than synced. **Closing the map on this gate converts
> "we didn't measure it" into "it's done."**
>
> Specific breakage in the migration this ticket owns:
> - **`Frontage`**: migrating 가안 → PROPOSED makes `checkStatusMarkers` fire
>   `status-marker-mismatch` (DOMAIN_MAP carries ✅). The migration turns its own
>   gate red, requiring a Projection-layer marker edit (✅→❓) that no ticket
>   scoped.
> - **`Blinds`**: migrating SUPERSEDED → `rejected-recorded` sails through the
>   `✅` hole (`MARKER_OK['✅'] = s => s !== 'PROPOSED'`). A dead concept keeps a
>   green checkmark and the lint certifies it.
>
> **Before this runs, the exit criterion must be redesigned** to something that
> can fail when the package fails — lint-clean alone cannot see any CRITICAL
> finding in the review.

## Question

Run the full re-harvest per `docs/audits/HARVEST.md` Ring A, on the schema
settled by ticket 03, with the lint hardened by ticket 09 and the registry
refreshed by ticket 08. This is the map's terminal validation gate.

Work:

1. Judge the **39 `verdict: null` rows** (the Ring B queue accumulated since
   run #2: occupation-geography, crisis-ending, war-model-build slices) —
   verdicts are audit-owned; the user seals the judging outcomes.
2. **Migrate off-enum rows** per ticket 03's migration plan (status/kind/
   verdict domains).
3. Bump `regenerated` / `auditRun` on both baselines; write the dated report
   `docs/audits/2026-07-XX-audit-run-3.md`.
4. **Gate**: `npm run lint:docs` clean — or every remaining finding carries a
   verified, explained false-positive record in the report. This closes the
   map's Destination.

## Constraints

- HARVEST §2 self-correction stands: map-lore proper nouns keep their rows
  (dropping them re-flags `checkHeaderDiff` — the run-#1 near-regression).
- S7 verdict carry-forward by canonical name — accepted coinages are never
  re-flagged.
- The doc-audit skill never auto-registers or auto-renames (S13); candidates
  are reported for user sign-off.
- Use the `/doc-audit` skill as the execution frame; this ticket adds the
  schema-migration step to its normal procedure.

## Output

Regenerated baselines + dated audit report + clean (or fully explained) lint
run. On resolution, also check the map's "Not yet specified" — the re-harvest
cadence question should graduate to a ticket if this run's experience made it
sharp.

## Evidence

`research/inventory-schema-survey.md` (queue composition, two-mode model) ·
`research/design-history-survey.md` (run #1/#2 lessons, §G live drift).
