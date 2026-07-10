# Audit Baseline Regeneration Procedure

The two JSON files in this directory are **regenerable derived artifacts**,
never hand-maintained. Truth lives at the birthplaces (feature GLOSSARYs,
documentation-law); these files are machine-readable indexes of it. When they
drift from the sources, regenerate — do not patch by hand.

Versioning: fixed paths, regenerated in place. Git history is the change log.
Commit each regeneration with a summary message, e.g.
`audit: regenerate term inventory (+3 terms, 1 rename, 223 total)`.

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

Generator for both files (audit run #1): a synthesis script harvesting the
sources above; the reference copy used on 2026-07-10 is preserved in the
session scratchpad and its logic is documented here. Future runs may re-script
it; matching this procedure matters, matching the old script does not.
