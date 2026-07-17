# CLAUDE.md

This project's agent guide is maintained in `AGENTS.md` (shared across Codex and
Claude Code). Treat `AGENTS.md` as the single source of truth.

@AGENTS.md

<!-- documentation-law loads via the generated block inside AGENTS.md (synced
     from the canonical `.claude/rules/documentation-law.md` by
     `npm run sync:docs-law`). Do NOT re-add a separate `@`-import for it — a
     second import would load the full law twice. -->

## Claude Code Notes

- Conversation voice follows the global Korean honorific style; generated
  artifacts use neutral professional English.
- Follow the read order and verification steps defined in `AGENTS.md` before
  substantial work.

## Agent skills

### Issue tracker

Issues and specs live as local markdown files under `.scratch/<feature>/`
(existing convention: `.scratch/war-model-slice2/issues/`). See
`docs/agents/issue-tracker.md`.

### Triage labels

The five canonical triage roles, each label string equal to its name, recorded
on a `Status:` line in the issue file. See `docs/agents/triage-labels.md`.

### Domain docs

Governed by `.claude/rules/documentation-law.md` (auto-loaded above via the
generated block in `AGENTS.md`).
