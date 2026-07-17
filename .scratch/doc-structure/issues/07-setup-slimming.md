# Setup slimming — remove the competing spec home and the law restatement

Type: task
Status: resolved

## Question

Slim the 2026-07-14 skill-setup artifacts to what earns its place (the
"minimal package" agreed in principle 2026-07-15):

1. **`docs/agents/issue-tracker.md`** — remove the line "The spec is
   `.scratch/<feature-slug>/spec.md`" (template residue; a competing spec home
   is M-04 class — duplication gives stale values places to live). Replace
   with a pointer to where design specs actually live. Use provisional
   language ("design specs are currently authored under
   `docs/superpowers/specs/` — see ticket 04 of the doc-structure map for the
   authority ruling") so ticket 04's outcome can refine it without unblocking
   drama.
2. **Delete `docs/agents/domain.md`** — it restates documentation-law (read
   order, Vocabulary Law paraphrase, supersession protocol) against the law's
   own header: "do not restate this law elsewhere." The skills that consult it
   need only a pointer.
3. **Trim the `CLAUDE.md` `## Agent skills` block** — the "Domain docs" entry
   becomes a single line pointing at `.claude/rules/documentation-law.md`
   (auto-loaded anyway). Keep `issue-tracker.md` (repo-specific fact) and
   `triage-labels.md` (five strings) as-is.

## Notes

- Safe to run unblocked; interaction with tickets 01/04 is wording-only and
  the provisional language covers it.
- The doc-audit PostToolUse hook will fire on these writes; triage its output
  per the skill's Layer-1 discipline (the standing `Operation` finding is
  ticket 06's, not this ticket's).

## Output

Committed edits: one line replaced, one file deleted, one block trimmed.

## Evidence

This session's own review (2026-07-15 turns 2–4): the restatement violation
and the near-miss are documented in the map's charting conversation;
`research/design-history-survey.md` (M-04 duplication lesson).

## Answer (2026-07-15)

Mixed disposition. Items (1) and (2) are Working-layer (Tier-2,
git-reversible) and were applied. Item (3) touches `CLAUDE.md` — the Law
layer, Tier-3, propose-only — and is **drafted below, not applied**. Applying
it autonomously would repeat the exact gate violation this map exists to
correct.

### Applied — (1) `docs/agents/issue-tracker.md` spec-home line

The competing spec home is gone. Under `## Conventions`:

- **Removed**: `- The spec is `.scratch/<feature-slug>/spec.md``
- **Added** (provisional wording, so the routing verdict can refine it without
  unblocking drama):

  > - Design specs are authored under their feature's
  >   `docs/features/<slug>/specs/` (see the doc-structure map, ticket 11
  >   routing verdict); a ticket points at its spec and never becomes one

Deliberately **not** restated here: the authority semantics of a spec. That is
ticket 04's ruling and still open — this line routes only, it does not
legislate.

### Applied — (2) `docs/agents/domain.md` deleted

Removed with plain `rm`: `docs/agents/` is untracked (`?? docs/agents/` in the
working tree), so `git rm` did not apply — `git ls-files --error-unmatch`
confirmed the file was never staged.

Grounds, re-verified against the law text rather than recalled: the header of
`.claude/rules/documentation-law.md` reads "`AGENTS.md`, `DESIGN.md`, and
`DOMAIN_MAP.md` point here — **do not restate this law elsewhere**."
`domain.md` restated the layer taxonomy (its "Layer map" table duplicated the
law's Direction/Projection/Record/Production rows), the read order, a
Vocabulary Law paraphrase (birthplace rule, `구칭` aliases, `[coinage]`
registration), and the supersession protocol. Four restatements of an
auto-loaded law = four places for stale values to live (M-04 class). The
skills that consulted it need a pointer, which is what draft (3) provides.

### Drafted, NOT applied — (3) `CLAUDE.md` `## Agent skills` trim

**Tier-3. Batch this into the 01+05 law-seal batch so all law-layer edits are
user-sealed together.** Only the "Domain docs" sub-entry changes; "Issue
tracker" (repo-specific fact) and "Triage labels" (five strings) stay verbatim.

Before (lines 29–33):

```markdown
### Domain docs

Single-context, mapped onto this repo's documentation-law layers
(`DOMAIN_MAP.md` / `docs/adr/` / feature Production docs). See
`docs/agents/domain.md`.
```

After:

```markdown
### Domain docs

Governed by `.claude/rules/documentation-law.md` (auto-loaded above).
```

Rationale: with `domain.md` deleted the sub-entry's pointer target no longer
exists, and its parenthetical was itself a miniature restatement of the layer
taxonomy. The law is already auto-loaded via the `@.claude/rules/
documentation-law.md` import at the top of `CLAUDE.md`, so the single line is
pure wayfinding — no per-session token cost beyond the line itself.

### Known dangling pointer (expected, closes on seal)

`CLAUDE.md:33` still points at the now-deleted `docs/agents/domain.md`. This
window is **expected and correct**: the deletion is Tier-2 and lands now, the
pointer removal is Tier-3 and waits for the user's seal. The dangling pointer
closes when edit (3) is sealed in the 01+05 batch. It is a stale pointer in a
wayfinding line, not a stale definition — the law it pointed at is auto-loaded
regardless, so no agent loses access to the canon in the meantime.

### Out of scope / untouched

- `.claude/rules/documentation-law.md`, `DOMAIN_MAP.md`, `docs/SYNC-DEBT.md`,
  and the ticket 05/06 files — owned by parallel sessions.
- The `[numericRestatement]` / `Operation` finding from the doc-audit
  PostToolUse hook fired on the `issue-tracker.md` write: pre-existing and
  standing, owned by ticket 06. Reports, not legislation — not acted on here.
- Ticket 01's two citations of `docs/agents/domain.md` (lines 69, 145) are
  historical evidence in the map's own record and were correctly left intact.
