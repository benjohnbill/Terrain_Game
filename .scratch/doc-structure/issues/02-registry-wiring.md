# Wire doc-registry.json's dead fields, or demote the registry?

Type: grilling
Status: open — REOPENED 2026-07-15 (the ruling below is a measured no-op)

> ## ⚠ REOPENED — the Answer below is retained as evidence, not as a ruling
>
> `docs/audits/2026-07-15-doc-structure-review.md` (C-1, and fact-check rows
> 14/15/16/20) refuted it:
>
> - **The ruling delivers zero enforcement.** `checkNumericRestatement`
>   hardcodes DOMAIN_MAP's **row grammar**, not just its path: only
>   `- ✅ \`Term\`` bullets are parsed. Run live against the 7 new targets:
>   **0 rows, 0 findings, all 7** — model docs are tables and prose. Coverage
>   "1 → 8" is paper; effective coverage stays 1 permanently. The FP budget the
>   ruling set can never trigger; "no new FP risk class" is true only vacuously.
> - **The dilemma the ruling never saw**: wire the path only → permanent no-op;
>   or generalize the row parser to prose → that IS new capability with a new FP
>   class, i.e. class B, which the same ruling rejected. (For scale: a
>   generalized parser yields **4 line-hits across all 7 docs**.)
> - **The class table is not exhaustive** though presented as such: it
>   classifies 8 of 11 values, omitting `ruling-history` (5), `feature-definitions`
>   (1), `definition-body` (1).
> - **Class B "52" mixes units** — that is the sum of value occurrences; distinct
>   rows = **28**. Classes A (8) and C (31) are row counts.
> - **The option-(b) letter collision**: the Question's (b) was "advisory
>   write-lint consultation (a hook)"; the Answer's "(b)" rejects "class B of
>   forbiddenContent". The hook sub-decision was **never reasoned about** while
>   appearing decided.
> - **Constraint note was wrong**: "the registry is ~5 days stale (9 unregistered
>   docs)" — 9 is the superpowers-only subset; **31** tracked .md files are absent
>   from the registry (incl. 8 ADRs, all of `capital/`, all of `war-model-build/`).
> - Minor: the code citation `audit-lint.js:205-220` names a function that takes
>   text as a parameter and reads nothing; the hardcoding is at :343 / :373.
>
> **Re-grill needs**: decide between honest demotion, a genuinely new
> prose-capable check (with an FP budget measured first), or accepting the
> registry as declaration-only — knowing that H-11 shows the package's Tier-3 law
> row is likewise unenforced.

## Question

`docs/audits/doc-registry.json` carries `layer` / `role` / `allowedContent` /
`forbiddenContent` for 119 files — the machine-readable encoding of the law's
central taxonomy — and **nothing reads any field except `.path`**
(`scripts/audit-lint.js` L342 parses it; L321 checks path existence; verified
2026-07-15). The law's entire content-authority model is dead data. Wire it or
demote it?

Options to grill:

- **(a) Minimal reader** — extend the single-definition/restatement check class
  to consult `forbiddenContent` per layer (e.g., `dial-values` forbidden in
  SPEC.md), so the registry's authority model gains one live consumer.
- **(b) Advisory write-lint consultation** — the PostToolUse hook checks the
  edited file's registry row and injects a layer-rules reminder. Must stay
  advisory (blocking hooks were explicitly rejected).
- **(c) Demote** — strip `allowedContent`/`forbiddenContent`, declare the
  registry a path+layer index only. Honest, cheap, loses the ambition.
- **(d) Join key with term-inventory** — inventory `birthplace` values are
  paths that could join registry rows (term layer ↔ path layer). Needed for
  anything real, or YAGNI?

## Constraints

- S11: law → registry → lint flows one way; the registry never becomes a
  second legislation surface.
- S13: any new check reports, never blocks.
- Alarm-fatigue lesson: the numeric-restatement heuristic was narrowed after a
  measured 55–80% false-positive rate. Any new registry-driven check needs an
  FP budget and a narrowing rule before it ships.
- The registry itself is ~5 days stale (9 unregistered docs — ticket 08), so
  wiring decisions should assume ticket 08's refresh.

## Output

Decision + concrete check specs (finding kind, inputs, narrowing rule) feeding
ticket 09. If (c), a registry-slimming spec feeding ticket 08 instead.

## Evidence

`research/enforcement-survey.md` (§D honor-system table, dead-data finding) ·
`research/inventory-schema-survey.md` (§C path-dimension "spec" split — the one
thing the registry uniquely knows).

## Answer (2026-07-15 — agent judgment, user delegated)

**Option (a), narrowly: generalize the check that already exists. Reject (b),
reject (c), defer (d).**

### The finding that decides it

`checkNumericRestatement` **is already an implementation of
`forbiddenContent`** — it enforces DOMAIN_MAP's `value-restatement` ban, with
the target file hardcoded (`audit-lint.js:205-220` reads `DOMAIN_MAP.md`
only). So wiring is not a new capability; it is **unhardcoding an existing
check to read its target list from the registry**. That reframes the whole
ticket: the question is not "should the registry drive a check" (it already
should, and morally does) but "how far".

### The field values, measured (not the label — the actual data)

Splitting the 11 `forbiddenContent` values by mechanical checkability:

| Class | Values | Rows | Verdict |
|---|---|---|---|
| **A — already implemented** | `value-restatement` (DOMAIN_MAP), `restating-other-docs-dials` | 8 | **WIRE** |
| **B — checkable but hostile** | `dial-values` (10, incl. SPEC.md), `definitions` (9), `seals` (15), `normative-definitions` (18) | 52 | **REJECT** |
| **C — not mechanizable** | `silent-edits-to-decision` (30, every ADR), `first-authored-truth` | 31 | **out of scope** |

### Ruling

**(a) Wire class A.** Replace the hardcoded `DOMAIN_MAP.md` target in
`checkNumericRestatement` with a registry query: files whose
`forbiddenContent` contains `value-restatement` or
`restating-other-docs-dials`. Coverage goes 1 file → 8 (the feature model
docs that carry `restating-other-docs-dials`); the dead fields gain a real
consumer; the S11 direction (law → registry → lint) is honoured — the lint
reads the registry, never the reverse.
- **FP budget: reuse, don't re-litigate.** The narrowing rule stays exactly
  as-is (POINTER_RE **AND** DIAL_RE). That rule is the survivor of a measured
  55–80% FP rate; carrying it unchanged onto 7 more files imports no new FP
  risk class. If the widened run exceeds ~2 findings/file on first execution,
  narrow by exclusion list rather than loosening the pairing rule.

**(b) Reject class B.** `dial-values` on SPEC.md is the trap: SPEC is prose
about a game with numbers in it, so a bare dial-pattern check fires on every
descriptive "turn 32". `seals` (15 rows) needs a seal-grammar parser —
the law's seal mechanics have never been mechanized, and the cold review
already judged that class ("semantic staleness with no string invariant is
knowingly NOT mechanized"). Alarm fatigue is the documented failure mode of
this exact heuristic family; do not re-run the experiment that was already
narrowed once.

**(c) Reject demotion.** With A wired, `allowedContent`/`forbiddenContent`
stop being wholly dead — the fields describe an authority model that is now
partly enforced and wholly *legible to agents*, which is their second job.
Demoting would also discard class B/C as documentation, and class C
(`silent-edits-to-decision` on 30 ADRs) is a real rule agents must follow
even though no script can check it. **Honesty duty instead of demotion**: the
registry's own header should say what is enforced vs. what is declaration —
handed to ticket 08 as a one-line note, not a schema change.

**(d) Defer the inventory↔registry join key.** Inventory `birthplace` values
are already registry `path` values, so the join is *available* the moment
anything needs it. Nothing does today (class A needs only the path list).
YAGNI — S10's precedent. Revisit if ticket 03's schema work surfaces a check
that must cross both baselines.

### Non-goal, explicitly

The "spec" polysemy the registry uniquely encodes (SPEC.md=direction vs
superpowers/specs/*=working) is **not** wired here and not re-termed — that
ruling stands (out of scope, map-level). Ticket 11 has since retired the
`superpowers/` path entirely; ticket 12 relocates those rows, after which the
registry's two "spec" senses distinguish `SPEC.md` from
`docs/features/<slug>/specs/*`. Same encoding, new paths — no new mechanism.

### Handoff

- **Ticket 09** (lint hardening) implements the class-A wiring: registry-driven
  target list + tests, keeping the POINTER_RE AND DIAL_RE narrowing verbatim.
  It must run AFTER ticket 12 (paths change) or query the registry live, which
  it does by construction.
- **Ticket 08** (registry refresh) adds the enforced-vs-declaration honesty
  note to the registry header.
