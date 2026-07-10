# Audit Baseline Regeneration Procedure

The two JSON files in this directory are **derived artifacts**. Truth lives at
the birthplaces (feature GLOSSARYs, documentation-law); these files are
machine-readable indexes of it, never a definition surface.

Maintenance model (amended 2026-07-10 after cold review — the original
"regenerated only, never hand-maintained" claim was fiction without committed
tooling):

- **Incremental (between audits)**: a session that seals a NEW term, renames
  one, or changes a term's status MUST add/patch the corresponding inventory
  row in the same doc-sync batch — one row, index fields only. This is the
  regeneration trigger for mid-session seals; without it the inventory lags
  and the lint false-positives on every newly sealed term.
- **Full re-harvest (at audit runs)**: each /doc-audit run re-executes the
  harvest procedure below from the sources and reconciles drift, carrying
  verdicts forward by canonical name. The full re-harvest is the authority;
  incremental patches are provisional until the next run confirms them.

Versioning: fixed paths, updated in place. Git history is the change log.
Commit with a summary message, e.g.
`audit: inventory +3 terms, 1 rename (223 total)`.

## term-inventory.json

One row per registered domain term. Index only — names, pointers, statuses,
code-identifier pairs, audit verdicts. **Never definition text or dial values**
(single-definition rule applies to this file too).

Harvest procedure (what audit run #1 did; repeat to regenerate):

1. **Ring A sweep** (definition surfaces): DOMAIN_MAP.md; docs/features/*/
   GLOSSARY.md; docs/GLOSSARY-QUICKREF.md (가안/UNSEALED rows); model docs
   (MAGNITUDE, FORMULA, MATCHUP, CATALOG, STRATEGY-SPACE, TEST-LADDER,
   BATTERY); docs/features/*/RULINGS.md (terms coined in rulings but never
   registered → status UNREGISTERED).
2. A term = a named game concept, mechanic, dial, resource, phase, or design
   construct with a definition, seal row, or coinage tag. Not prose words,
   not section headings, not ruling *statements* (see run #1 report — three
   ruling-statements were harvested and marked `undetermined`; exclude their
   kind at the next regeneration).
3. Deduplicate: one row per concept. Birthplace priority: feature GLOSSARY >
   DOMAIN_MAP > model doc > RULINGS. tier 0 only when DOMAIN_MAP is the
   birthplace.
4. `kind`: mechanism (in-game concept, genre precedent plausible) vs meta
   (design-discussion language). Routing decides the reference dictionary:
   mechanism → genre conventions (4X/grand strategy/wargame), meta →
   game-design theory vocabulary.
5. `codeIdentifier`: explicit doc statement first, else derived camelCase
   grepped against js/. codeRefs = js/ files containing it (mockup/ excluded).
6. **Carry verdicts forward**: preserve `verdict`/`verdictRef` for rows whose
   canonical name is unchanged since the last audit — this is what prevents
   re-flagging accepted coinages on every run. New/renamed terms get
   verdict null and enter the next audit's judging queue.

## doc-registry.json

One row per governed documentation file: layer, role, owner feature,
allowed/forbidden content — all derived from
`.claude/rules/documentation-law.md` (layer taxonomy + Production file roles).
Flow is one-way: **law → registry → lint**. When the law is amended,
regenerate the registry; never edit the registry to disagree with the law.

No committed generator script exists yet (run #1 used session-scoped
tooling, now gone). This PROCEDURE document is the generator: a future run
re-executes it and may re-script the mechanical parts. Matching this
procedure matters; matching any old script does not. Known weak rows from
run #1: three terms are ADR-born (birthplace = ADR 0019, a tension with the
law's "ADRs never define" rule) and `Estimate band` has no clean birthplace
(provisionally homed at fog-of-war RULINGS) — both are registration-gap
evidence, not clean data.
