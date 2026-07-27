# 13 — Prevention over after-the-fact audit (spec pointer)

Type: task
Status: mixed — **labelled per piece below, not per stage**
Spec: `docs/superpowers/specs/2026-07-26-governance-prevention-over-audit.md`

Governance caught drift at audit time — nineteen copied definitions found
sixteen days after they were written. The spec moves each check to the highest
rung of the enforcement ladder it can reach.

> **Read the labels, not the stage numbers.** An earlier revision of this file
> marked stages 2–4 `ready-for-agent` wholesale once their blocking ruling
> landed. That was wrong: *unblocked* is not *fully specified*, and
> `ready-for-agent` means an agent can finish without the user present. Audited
> and corrected 2026-07-27. A stage is not a unit of readiness — the pieces
> inside one stage have different labels.

## LANDED 2026-07-27 — stage 1, the enforcement ladder

`hooks/pre-commit`, `hooks/pre-push`, `.github/workflows/governance.yml`, and
prescriptive findings in `audit-lint.js`. Verified live: a mismatched commit is
rejected in the main checkout and in a fresh worktree; a clean commit passes
silently. Implemented directly rather than split into sub-tickets — the work fit
one session, no parallel agent needed it, and the decisions were already durable
in the spec, so ticket files would have been a third copy of them.

Known hole, deliberately left: `core.hooksPath` is relative, so a worktree on a
branch predating `hooks/` is ungated. CI is the backstop, which is why it is a
required rung.

## LANDED 2026-07-27 — the inventory enum check, and the law it enforces

`audit-lint.js` check 10 (`fieldDomains`): `status ∈ {AGREED, PROPOSED,
rejected-recorded, SEALED}`, `kind ∈ {mechanism, meta}`, `verdict ∈
{justified-coinage, standard-match, synonym-exists}` or null — null is legal
because HARVEST step 6 gives every newly sealed term a null verdict until an
audit run judges it, and blocking on that would gate sealing behind auditing.
Blocking, and the grandfather list ships **empty**.

The ordering question below was answered by taking the law first, and it paid
better than expected. `SEALED` entering the dictionary made ten off-domain rows
legal-or-fixable rather than exemptible, so instead of grandfathering fifteen
rows the batch normalized their birthplaces: `AGREED-concept`,
`AGREED-structure`, and `가안` were one concept — *name settled, values
provisional* — and every one of those rows already wrote its provisionality in
its value column, so the status word was the only thing that had to move.
combat-formula's local status dictionary, which had legislated `가안` as a
status value in its own header, is retired.

Two riders. `Blinds` could not take its ruled route (Q2's typed aliases do not
exist yet) and became `rejected-recorded`, with DOMAIN_MAP's marker `✅ → ⛔`;
both are registered in `docs/SYNC-DEBT.md`. And the ✅ predicate, which had been
`s !== 'PROPOSED'` — the "too lax" half of the 2026-07-15 marker finding — was
tightened to name its two values, which is only safe now that the enum check
guarantees the status is in the dictionary at all.

## LANDED — stage 2 closes: the `Summary` column

The column is open across all seven feature GLOSSARYs (7 tables, 121 rows,
inserted after `Definition` so `Status` stays last), cells empty by design, and
the authoring duty is in the Vocabulary Law: the definition's own author fills
it when the row is written or re-sealed, **going-forward only, no backfill**.
Rolled out eagerly on the user's decision — an absent column makes the duty
invisible, and an empty cell asks to be filled.

`summary` is a GLOSSARY column, **not** an inventory field: the JSON holding
content would break ruling 03 Q5's ownership boundary. Nothing was added to
`term-inventory.json`.

Note for stage 3: `DOMAIN_MAP.md` has no table, so it took no column. Its
entries are already summary-and-pointer *prose* — supplying the real summaries
for the 56 promoted entries IS stage 4, which is why stage 4 should run before
or alongside stage 3 rather than after it (it turns the generator's day-one
summary count from ~0 into ~56).

**Not delivered from stage 2:** the optional *promotion-consistency report
line*. The spec calls it "worth taking" with the reviewer's caveat attached
(`seenTerms` is a flat set across DOMAIN_MAP plus every GLOSSARY, so the
derivation is cheap but not a by-product of the existing finding stream). No
check enforces that a NEW row arrives with a filled `Summary` either; the spec
specified only one new check for this stage, and that one landed.

## LANDED — `## Resolved Phase 1 Decisions`, folded to pointers

Resolved the other way from this ticket's own label. Opening the section showed
seven reference-prototype decisions restated in the present tense; the prototype
is an archive (ADR 0041) and the cradle map replaced that world, so minting an
ADR would have dressed archive description as a decision of record. Three
pointer lines now stand in their place. The label read "relocation, not
judgment" — reading the content is what made it judgment.

## LANDED — stage 4: DOMAIN_MAP sheds its duplicate half (2026-07-28)

All 56 promoted entries re-cut to summary + pointer + why-it-is-canon; 117
headers before and after, 61 native / 56 promoted unchanged.
`RESTATEMENT_GRANDFATHERED` is **empty** — the spec's stated acceptance test —
and a test now pins empty as the invariant so a name added back fails rather than
passing quietly. Five entries needed a second pass: they had kept the
birthplace's phrasing, check 9 caught each, and rephrasing cleared them. Nothing
was exempted to reach green.

**The finding worth carrying:** a restatement cannot be safely cut until the
birthplace is verified to hold current truth — sometimes the copy is the fresher
one. combat-formula's `Standing rules` row still carried the staged starvation
severity that war-model slice-2 §2 superseded, because the 2026-07-15 correction
reached DOMAIN_MAP and never reached the birthplace. Cutting the Tier-0 entry to
a pointer would have pointed at superseded text. Both that row and match-arc
`모병`'s missing ADR 0045 citation are fixed; full record in `docs/SYNC-DEBT.md`
§ Paid.

**`## World Direction` resolved the other way from this ticket's label**, for the
same reason `## Resolved Phase 1 Decisions` did. The diff was run, as the label
required, and it showed the move was mostly unnecessary: what the world *is*
(East Asia-inspired but fictional, real geographic patterns, not a literal
historical simulator, never at the cost of balance) is **already in `SPEC.md`
§ World Model** — moving it would have created the extra copy the label warned
about. The world-scale bullets (50×50 data, 25×25–30×30 active area, 30 named
provinces in `js/province-data.js`, twelve archetypes) are archive-era (ADR 0041),
so they became a pointer. Section is now 20 lines of pointers, no SPEC edit made.

`## Open Questions` likewise: three of four were archive-era and closed with the
30-province draft world; one is genuinely open.

**Two residues are Tier 3 and stayed put, both registered in `docs/SYNC-DEBT.md`
§ Open:** the place-naming rule (live, product-facing, written nowhere else —
SPEC § World Model proposal owed) and the naval-system question (SPEC § Phase
Roadmap). Both are marked as unhoused in place rather than silently relocated.

## `ready-for-human` — needs the user, not an agent

- ~~**Apply the extended status dictionary to the law.**~~ **DONE 2026-07-27**
  (user authorized the Tier-3 edit) — see the LANDED section above.
- ~~**Strip the copied definitions from DOMAIN_MAP's 56 promoted entries.**~~
  **DONE 2026-07-28** — see the stage-4 LANDED section above.
- ~~**`## World Direction` → `SPEC.md`.**~~ **RESOLVED 2026-07-28 without a SPEC
  edit** — the required diff showed SPEC already holds it. Two Tier-3 residues
  are registered in `docs/SYNC-DEBT.md`; see above.
- **The rename.** `DOMAIN_MAP.md` → a top-level glossary. The file now does one
  job, so the precondition is met. Still optional, still last, and its blast
  radius is measured in the spec: 80 inventory birthplace values, 4 script/test
  files, the registry, the law, the AGENTS.md mirror, 92 markdown files. Buys
  naming honesty and nothing functional — decide it unbundled.

## `needs-info` — a decision is missing before anyone starts

- **The QUICKREF generator's fallback.** `summary` is **going-forward only**
  (user ruling, 2026-07-27): the column exists, an author fills it when writing
  or re-sealing a definition, and the ~260 existing terms are not backfilled.
  That leaves the generator with almost no summaries on day one, which would
  make the generated digest *worse* than the hand-curated file it replaces.
  Owed: what the generator renders for a term with no `summary`. The obvious
  candidate is a mechanically extracted first sentence from the birthplace row
  plus the pointer — an excerpt cannot drift, because regenerating updates it —
  but that is a design call for the generator, not something this ticket settles.
- **Where the C-loop translation table goes.** It must leave
  `GLOSSARY-QUICKREF.md` **before** any generator exists, or the generator
  overwrites hand-authored content on its first run. Its destination is unnamed.

This ticket is a pointer. Read the spec, not this file.
