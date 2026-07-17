# Handoff — Doc-Governance Pass (2026-07-10, promotion chain complete)

Continuation context for the domain-terminology governance work. Everything
below is committed on local main (push withheld — main is far ahead of
origin with other sessions' unpublished work; user decides publish
timing).

## State: SYNC-DEBT "Doc-governance promotion chain" (a)-(d) all DONE

Full arc: terminology audit run #1 (6-agent wave) → cold adversarial
review → law amendments (P2) → cleanup batch (P3) → audit-lint prototype
(P1, TDD, commit 6dd0a8e) → all 5 acceptance findings disposed (92ce96a)
→ gold→treasury residue fix → audit run #2 (baseline regeneration +
self-correction, d286aa3) → **/doc-audit skill codified (c7714ba)** →
**hooks promoted (23c0917)**.

`npm run lint:docs` clean: 8 checks, 0 findings. Full suite 222/222.

## What's live now

- `.claude/skills/doc-audit/SKILL.md` — invoke as `/doc-audit`. Codifies
  the S8 escalation ladder (Layer 0 lint script → Layer 1 targeted
  judgment/full re-harvest → Layer 2 history).
- `.claude/settings.json` (new this session) — two hooks:
  - PostToolUse `scripts/hooks/write-lint.js`: Write/Edit on a governed
    doc path auto-runs `npm run lint:docs`, injects findings as
    additionalContext, never blocks.
  - UserPromptSubmit `scripts/hooks/alias-inject.js`: exact registered
    alias/구칭 match in the prompt → canonical-name advisory note, never
    blocks, never decides whether to actually align (that's the agent's
    call, per the exploration exemption).
  - `tests/hooks.test.js` — 15 tests on the matching/scoping logic.
  - Note for future settings.json edits: writing this file was gated by
    the harness's own auto-mode classifier (Tier-3, config-surface/
    auto-execution change) — needed an explicit user confirmation even
    though SYNC-DEBT already named "hook promotion" as approved future
    work. See memory `harness-settings-json-tier3-gate`.
- `docs/audits/2026-07-10-audit-run-2.md` — worth reading if picking up
  the next full re-harvest; documents a self-correction (run #1
  misclassified 2 of its 3 "undetermined" rows) that's a good worked
  example of the cross-check discipline the doc-audit skill's Layer 1
  now requires.

## Standing duties (ritual duty 7, every session — now partly automated)

1. Sealing/renaming/re-statusing a term ⇒ patch its inventory row in the
   same doc-sync batch (index fields only, never definition text). Still
   manual — the hooks detect drift, they don't fix it.
2. `npm run lint:docs` at session close — now also fires automatically
   after any Edit/Write to a governed doc path via the PostToolUse hook,
   but the ritual close-check is still worth doing explicitly too.

## What's left (SYNC-DEBT "Doc-governance promotion chain" (e))

Only the residual code-identifier drift remains, deliberately deferred:
`actionCapacity`↔`capacity`, `computeProvinceStatus`↔`classifyHex` — folded
into the owed `js/situation.js` rework (ADR 0019 v5 code-catch-up debt,
see the match-arc pass memory), not a standalone doc-governance action.

## Decisions of record (don't relitigate)

- Vertical restructure REJECTED on evidence (19 cases, 0 topology-caused).
- Renames: force limit / impassable terrain / emergent asymmetry (SPEC
  #8) — living surfaces renamed, history keeps old names, 구칭 aliases
  carry the mapping. Manpower rename REJECTED (intuitive-over-compact
  ruling wins; "manpower" is an alias). The remaining 5-item rename
  agenda entries (aging constitution, position as product, battle-
  summoning placement, denied-dominant/the wall, force geography) got
  alias-only treatment in P3 — that is their final disposition, not an
  open item.
- Map-lore proper nouns (Great range, Hexi corridor, Western Ring,
  Taishan) KEEP their inventory rows — real GLOSSARY table rows. "Exclude
  from future runs" means skip Ring-B dictionary-judging only, never drop
  the index row (HARVEST.md amended to say so explicitly after audit
  run #2 nearly regressed lint by reading it literally).
- ADR 0029 number left free for the adjacent session's settlement-
  ripening draft; doc-governance took 0030/0031.
- Semantic staleness with no string invariant (M-01 class) is knowingly
  NOT mechanized — layer-C (periodic /doc-audit full re-harvest)
  territory, not hook territory.
