# 13 — Enforcement ladder (spec pointer)

Type: task
Status: ready-for-agent — stage 1 only
Spec: `docs/superpowers/specs/2026-07-26-governance-prevention-over-audit.md`

Governance today catches drift at audit time. The spec moves each check to the
highest rung it can reach. **Stage 1 — the commit-time enforcement ladder — is
broken out as tickets 14–17 and is the only stage authorized.**

Stages 2–4 stay `needs-info`: they depend on an unruled conflict (ticket 03's
handoff says the enum check is "findings only, never blocking"; the 2026-07-17
gating decision in `audit-lint.js` says otherwise and was never stamped onto 03).
See the spec's § Prior art.

This ticket is a pointer. Read the spec, not this file.
