# Registry refresh — 9 missing docs + new-surface rows

Type: task
Status: open
Blocked by: 01

## Question

Bring `docs/audits/doc-registry.json` (regenerated 2026-07-10, now stale)
current:

1. **Add the 9 missing superpowers docs** (on disk, unregistered — verified
   2026-07-15):
   - `docs/superpowers/2026-07-13-crisis-co-analysis-session.md`
   - `docs/superpowers/plans/2026-07-10-occupation-geography.md`
   - `docs/superpowers/plans/2026-07-11-unassailability-affordability.md`
   - `docs/superpowers/plans/2026-07-12-crisis-ending-implementation.md`
   - `docs/superpowers/plans/2026-07-13-decisive-battle-spine.md`
   - `docs/superpowers/specs/2026-07-10-occupation-geography-design.md`
   - `docs/superpowers/specs/2026-07-11-unassailability-affordability-design.md`
   - `docs/superpowers/specs/2026-07-13-decisive-battle-spine-design.md`
   - `docs/superpowers/specs/2026-07-14-slice2-operational-layer-design.md`
   Use the existing working-layer row shape (role: "time-stamped spec/plan
   record; consult for context, not current truth").
2. **New-surface rows per ticket 01's verdict** — `.context/`,
   `.scratch/<feature>/issues/`, `docs/agents/*`: add rows if the law
   registered them; if ticket 01 ruled WATCH, record in this ticket's
   resolution that they deliberately stay unregistered (so the next audit
   doesn't re-flag the absence as an oversight).
3. **Envelope stamp semantics** — decide whether incremental registry patches
   bump `regenerated` (mirror HARVEST's inventory model: envelope date is
   audit-owned; patches don't bump it) and note the convention in the file or
   HARVEST.md.
4. Re-run `npm run lint:docs` — `dead-registry-path` guards against typos.

## Notes

If ticket 02 resolves to demote the registry (strip dead fields), fold that
slimming into this same edit batch rather than touching the file twice.

## Output

Committed registry edit; lint clean on registry checks.

## Evidence

`research/enforcement-survey.md` (registry consumption reality) · missing-doc
list verified against disk 2026-07-15 (charting session).
