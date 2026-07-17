# CLAUDE.md

This project's agent guide is maintained in `AGENTS.md` (shared across Codex and
Claude Code). Treat `AGENTS.md` as the single source of truth.

@AGENTS.md

<!-- Codex does not read this file. Project knowledge — read order, current
     direction, environments, issue tracker, triage labels, documentation law —
     lives in AGENTS.md so both hosts read the SAME source. Do not add project
     knowledge here that AGENTS.md lacks: that is how a Codex session ends up
     missing it. (2026-07-17: the tracker location and triage vocabulary were
     CLAUDE.md-only — invisible to the Codex session that authored the L3
     decision gates.) Claude-Code harness notes only, below. -->

## Claude Code notes

- Conversation voice follows the global Korean honorific style; generated
  artifacts use neutral professional English.
- Follow the read order and verification steps defined in `AGENTS.md` before
  substantial work.
- **Do not `@`-import the documentation law.** It already reaches both hosts
  through the generated block inside `AGENTS.md`, mirrored from the canonical
  `DOCUMENTATION-LAW.md` at the top level. An import would load it a second
  time here and would still leave Codex without it.
