# Spec — Documentation governance: prevention over after-the-fact audit

**Status:** stage 1 LANDED 2026-07-27 · stages 2–4 ready-for-agent (their one
blocking conflict was ruled 2026-07-27 — blocking; see § Prior art). Staged —
each remaining stage becomes its own ticket under
`.scratch/doc-structure/issues/`.
**Authored:** 2026-07-26, from the design conversation following audit run #3
(`docs/audits/2026-07-26-audit-run-3.md`)
**Revised:** 2026-07-26, same day — the first draft was written without reading
`.scratch/doc-structure/`, and contradicted ruling 03 Q3. See § Prior art.
**L-trust:** L1 (design synthesis; every quantity below was measured this session)
**Layer:** Working — a time-stamped spec record. It proposes law amendments but
legislates none; every item marked **Tier 3** needs the user's explicit seal.
**Reads against:** `.scratch/doc-structure/map.md` and its tickets 02/03/09/10/11,
plus `docs/audits/2026-07-15-doc-structure-review.md`. This spec does not close
that map.

---

## Problem Statement

The user's documentation law says a term's definition lives at exactly one
birthplace and every other surface carries a summary + pointer. Audit run #3
found **19 `DOMAIN_MAP.md` entries that copy their birthplace definition
instead**, 15 of them without even a pointer back. The rule that forbids this
was adopted 2026-07-10; no run had ever checked whether existing entries obeyed
it.

The user's own diagnosis of why is the correct one: **for the person writing a
document, putting the definition in both places is the safer-feeling act.** A
top-level domain glossary and a feature glossary both exist; filling in both
looks conscientious. A rule that says "do not copy" is asking an author to
choose the option that feels less complete, every time, forever. That rule loses.

Three structural facts make this worse than a discipline problem:

1. **The only defense fires on one editing path.** `write-lint.js` is bound to a
   Claude Code `Write|Edit` tool call. The user editing in an editor, a Codex
   agent in a worktree, or any script all bypass it. There is no git hook and no
   CI (verified: `.github/workflows` absent, `.git/hooks` holds only samples).
2. **Codex work reaches `main` through the one path a `pre-commit` hook cannot
   see.** Proven by isolated experiment: `pre-commit` does **not** fire on merge
   commits — and `5ce1cbc Merge branch 'codex/ticket-06c-battle-calculator'` is
   exactly how the parallel build lands.
3. **The audit exists because the same fact is stored twice.** `lint:docs`
   compares `DOMAIN_MAP.md` against `term-inventory.json`. There are two maps:
   the real one is the JSON, and a hand-copied Markdown duplicate of it is
   called `DOMAIN_MAP`. Reconciling them is work that only exists because the
   duplicate exists.

The user's framing is the goal: **the best audit is the one that has nothing to
audit.** Today governance sits almost entirely at the last rung of the ladder —
periodic audit — which is why this drift took 16 days and ~55 commits to
surface.

## Solution

Move each governance check to the highest rung of the enforcement ladder it can
reach, and remove the duplicated *content* that makes reconciliation necessary at
all — while keeping the pointers that make the vocabulary findable.

| Rung | Where a defect is caught | Today | After |
|---|---|---|---|
| 1 | Structurally impossible (the surface is generated) | law mirror only | + QUICKREF |
| 2 | As it is written (per-edit hook) | Claude Code tool calls only | unchanged (still useful) |
| 3 | Commit / push / CI | **empty** | **the real gate** |
| 4 | Periodic audit | nearly everything | judgment only |

Four stages, dependency-ordered:

1. **Enforcement ladder** — `pre-commit` + `pre-push` + CI, all calling one
   entry point, with rejection messages that carry the fix.
2. **The enum check a prior ruling already requires**, plus a `summary` column at
   the birthplace. (Promotion stays *derived*, per ruling 03 Q3 — no field.)
3. **QUICKREF becomes a generated artifact** — after its hand-written C-loop
   table moves out to its own file.
4. **`DOMAIN_MAP.md` sheds its duplicate content** — the 56 promoted entries
   shrink to pointer + status + why-canon; the four non-term sections route to
   their proper layers; the file is then a top-level glossary of the 61
   project-native terms and may be renamed to say so.

The invariant the ladder buys, stated precisely:

> **A GLOSSARY/inventory mismatch cannot enter the *remote* history.**

Local history may briefly hold one (`--no-verify`, the moment after a merge).
The remote is where the user, Codex, and Claude see the same truth, so that is
the boundary worth defending.

## User Stories

1. As the project owner, I want a definition copied into `DOMAIN_MAP.md` to be
   rejected when it is written, so that I never again discover 19 of them 16 days
   later.
2. As the project owner, I want the enforcement to work regardless of which tool
   edited the file, so that my own editor sessions are held to the same standard
   as the agents'.
3. As the project owner, I want Codex's existing workflow to be unchanged, so
   that adding enforcement costs me no coordination with a second agent harness.
4. As a Codex agent committing inside an isolated worktree, I want the same
   governance checks the main checkout runs, so that my branch cannot introduce
   drift that only surfaces after a merge.
5. As the project owner, I want merge commits gated, so that the path Codex work
   actually takes into `main` is covered rather than the path it does not take.
6. As an agent blocked by a governance check, I want the rejection message to
   name the file I must patch and the duty that requires it, so that I can fix it
   without guessing.
7. As an agent blocked by a governance check, I want the message to tell me the
   *bounds* of the fix — index fields only, never definition text — so that
   unblocking myself does not violate the single-definition rule I was just
   caught on.
8. As an agent blocked by a governance check, I want the message to offer the
   *second* legitimate exit — remove the definition and ask the user — so that I
   do not invent a junk inventory row just to get moving.
9. As an agent blocked by a governance check, I want to be told explicitly not to
   use `--no-verify` and that CI will catch it, so that the natural instinct to
   bypass is closed off where I read the block.
10. As the project owner, I want the rejection wording to exist in exactly one
    place in the codebase, so that adding a fourth consumer never means copying a
    fourth message.
11. As a maintainer of the check suite, I want every enforcement point to invoke
    the same single entry point, so that "passes locally, fails in CI" is
    structurally impossible.
12. As the project owner, I want the pre-commit check to stay under a
    two-second budget, so that nobody's habit becomes `--no-verify` and the whole
    ladder quietly dies.
13. As the project owner, I want every new blocking check to ship with a
    recorded list of pre-existing violations, so that turning it on does not
    block everyone on day one and force sloppy mass edits.
14. As a maintainer, I want the hooks themselves version-controlled and
    reviewable, so that a hook change goes through the same reading as a code
    change.
15. As someone setting up a fresh clone, I want the hooks installed by the normal
    setup command, so that an unhooked clone is not the default state.
16. As a CI maintainer, I want the CI job to run the identical command a
    developer runs, so that a CI failure is always reproducible locally.
17. As a future-session agent, I want to know whether a term carries load outside
    its own feature, so that I do not rename something and silently break another
    feature's contract.
18. As a future-session agent, I want to know *why* a term was promoted, so that
    I can judge whether the reason still holds instead of treating promotion as
    permanent.
19. As the project owner, I want promotion recorded as a field rather than as the
    existence of a Markdown entry, so that recording a promotion never requires
    writing prose that then drifts.
20. As an author defining a term, I want to write its one-line summary at the same
    moment I write its definition, so that the summary never ages without an
    author.
21. As a reader of a feature glossary, I want each row to carry a summary
    alongside the full definition, so that I can skim the feature's vocabulary
    without reading every definition in full.
22. As the project owner, I want a single browsable view of all registered
    vocabulary, so that I can survey the project's language without opening
    eleven glossaries.
23. As the project owner, I want that view generated rather than hand-curated, so
    that it cannot disagree with the sources it summarizes.
24. As the project owner, I want the generated view to carry its generation time
    and source commit, so that a stale copy announces its own staleness.
25. As the project owner, I want to regenerate that view on demand rather than
    have it sync automatically, so that regeneration stays a deliberate act I
    control.
26. As the project owner, I want the generated view to be browsable — sortable,
    filterable, searchable, status-coloured — so that surveying 267 terms is
    actually pleasant.
27. As the project owner, I want my hand-written C-loop translation table
    (statement → dial → checking scale) preserved in its own file, so that a
    generator can never overwrite the one surface I audit by hand.
28. As an agent, I want the generated view to be explicitly non-citable, so that
    I keep reading the inventory and the glossaries as the working sources.
29. As the project owner, I want the freshness check retargeted from "was the
    digest curated" to "was the generator run", so that satisfying the check is a
    command rather than an act of authorship.
30. As the project owner, I want `DOMAIN_MAP.md` to stop carrying definitions for
    terms born in features, so that the file has no surface that can go stale
    against a birthplace.
31. As the project owner, I want `DOMAIN_MAP.md` to keep defining the 61 terms
    that are actually born there, so that project-native vocabulary keeps a home.
32. As the project owner, I want the non-term sections of `DOMAIN_MAP.md` routed
    to the layers that own them, so that the file's name stops describing four
    different jobs.
33. As the project owner, I want world-direction statements to live in `SPEC.md`,
    so that direction is read where direction is authoritative.
34. As the project owner, I want resolved Phase-1 decisions to live as ADRs, so
    that decisions are read where the Record layer keeps them with supersession
    protocol.
35. As the project owner, I want open questions to live in the trackers or a
    feature `INDEX.md`, so that unsettled work sits where the law already puts it.
36. As the project owner, I want the option to rename the file to a top-level
    glossary once it only does one job, so that its name stops promising a map
    and delivering an encyclopedia.
37. As the project owner, I want to be told the cost of that rename before
    committing to it, so that I can decide whether the honesty is worth the churn.
38. As an auditor running `/doc-audit`, I want the periodic run reduced to
    judgment work, so that mechanical reconciliation stops consuming audit time.
39. As an auditor, I want the grandfathered restatement list to shrink as the
    debt is paid, so that the debt has a mechanical definition of done.
40. As the project owner, I want the inventory's self-declaration corrected when
    it starts holding decisions, so that a file does not claim to be purely
    derived while holding data nothing can regenerate.
41. As the project owner, I want every law change this program needs surfaced as a
    proposal, so that no tooling change quietly rewrites the law it enforces.
42. As the project owner, I want promoted entries reduced to pointers rather than
    deleted, so that the promotion record the project already decided to derive
    from is not destroyed.
43. As the project owner, I want this spec to cite the rulings already made on
    this territory, so that a second pass does not re-decide what I settled on
    2026-07-15.
44. As the project owner, I want any place where this spec disagrees with a prior
    ruling surfaced as a conflict for me to rule, so that a spec never quietly
    overturns a seal.

## Implementation Decisions

### Prior art this spec must not re-decide

**This spec was first drafted without reading `.scratch/doc-structure/`, and was
wrong in one stage as a result.** That tracker holds twelve tickets on exactly
this territory, six of them resolved 2026-07-15 and then put through an
adversarial review (`docs/audits/2026-07-15-doc-structure-review.md`: ~122 claims
checked, **24 failed**, verdict UNSOUND-WITH-MAJOR-FIXES, honest efficacy ~40%).
The review **blocked tickets 09, 10, 12** and **reopened 02 and 11**. Ticket 10
*is* audit run #3.

Binding prior rulings, and how this spec sits with each:

| Prior ruling | This spec |
|---|---|
| **03 Q3 — promotion: DERIVE, do not store.** "A field would be a second copy of a derivable truth, hand-patched, and thus drifting by next week." Promotion = a `tier=1` term whose canonical also appears as a `DOMAIN_MAP` header. | **Honoured. The first draft violated it** by proposing a `promoted` field; that field is withdrawn. See stage 4 — retaining pointer-only entries keeps the derivation source alive. |
| **03 Q1 — status: EXTEND the dictionary** (`SEALED` = fourth value, strong form of `AGREED`). | Honoured. Applying it is a prerequisite of the field-vocabulary check, not a question this spec reopens. |
| **03 Q5 — `verdict`/`verdictRef` are audit-owned**: carry-forward or null, never hand-set. Index fields (`status`, `kind`, `aliases`) are patchable by a sealing session. | Honoured. The field-vocabulary check reports the verdict domain; it never repairs it. |
| **03's binding condition** — schema v2 "is only valid if ticket 09 implements an enum-enforcing check." | This spec's field-vocabulary check **is** that check. It is the completion of a ruling, not a new idea. |
| **09 BLOCKED** by (a) ticket 02's no-op registry wiring, (b) 03's typed-alias handoff omitting three readers it breaks, (c) a migration window that would inject ~100 findings on every governed edit. | Scoped around all three — see the exclusion note below. |

**Why this spec's stage 1 can proceed while ticket 09 stays blocked.** None of
09's three blockers touch it. (a) is about ticket 02's registry-driven target
expansion, which this spec does not use. (b) is the typed-alias migration, which
this spec explicitly leaves out of scope. (c) — the alarm-fatigue window — is
solved rather than inherited: **invariant 3 (grandfather duty) is exactly the
mechanism that stops a newly-enabled check from firing ~100 findings on day
one.** The pattern is already in the tree (`RESTATEMENT_GRANDFATHERED`, check 9).
Ticket 09's remaining scope (typed aliases, `alias-inject` consuming `rel`, the
registry wiring) stays blocked and is not claimed here.

**The one conflict — RULED 2026-07-27: blocking.** Ticket 03's handoff had
specified 09's enum check as "findings only, never blocking (S13)", while the
gating decision recorded in `audit-lint.js` two days later established blocking
for seven of eight checks with an explicit argument that it does not violate S13
("S13 is separation of powers: this tool APPLIES user-sealed law and never
AMENDS it"). The later decision superseded 03's line, but **no stamp had ever
been placed on 03** — so a reader of that ticket in isolation would have
implemented the older instruction. The user ruled blocking and the stamp is now
on ticket 03, in its header and on the superseded line.

Two reasons beyond consistency with 2026-07-17: a check that only reports leaves
the defect in the history, which is this program's entire thesis; and ticket 03's
own binding condition declares the schema *void* without an enforcing check,
which advisory output does not deliver. It ships with a grandfather list per
invariant 3, so adoption day blocks nobody.

**Stages 2–4 are unblocked by this ruling.**

### Stage ordering is a hard dependency, not a preference

- **Stage 4 must retain the promoted entries' headers.** Measured: the inventory
  has no promotion field; `tier` looks like one but records *"is `DOMAIN_MAP.md`
  the birthplace"* (`HARVEST.md` step 3), and all **56** promoted `DOMAIN_MAP`
  entries are `tier: 1`. Promotion is therefore recorded **only** by the
  existence of a `DOMAIN_MAP` header — which is precisely the fact ruling 03 Q3
  derives from. The first draft of this spec proposed *deleting* those entries,
  which would have destroyed the derivation source and forced a stored field.
  **Stage 4 strips the copied definitions and keeps the headers**, so no ordering
  dependency and no new field are needed.
- **Status-dictionary application must precede the field-vocabulary check**, or
  the check fires on the 15 status strays the ruling legalises or normalises. The
  alternative is a grandfather list; applying the ruling is cleaner and is owed
  anyway.
- **The C-loop split must precede the QUICKREF generator**, or the generator
  overwrites hand-authored content on its first run.
- **Stage 1 is independent** and carries the highest immediate value; it should
  ship first and alone.

### Stage 1 — the enforcement ladder

Three sealed invariants (user, 2026-07-26). These are constraints on the
implementation, not guidance:

1. **Single entry point.** `pre-commit`, `pre-push`, and CI each invoke
   `npm run lint:docs` and nothing else. Check logic is never duplicated into a
   hook. Consequence: the maintained surface is one script; the rest are call
   sites.
2. **Two-second budget on `pre-commit`.** Measured today: `npm run lint:docs` =
   **0.51s**. Heavier work (the 484-test suite ≈ 14s) belongs at `pre-push` or
   CI. Rationale: a slow pre-commit trains `--no-verify`, which kills the ladder.
3. **Grandfather duty.** A new blocking check ships with its list of
   pre-existing violations recorded in code, so adoption day blocks nobody.
   Precedent already in the tree: `RESTATEMENT_GRANDFATHERED` in
   `audit-lint.js` (check 9, landed 2026-07-26).

Hook placement, from the isolated-repo experiment:

| Hook | Verified behavior | Role |
|---|---|---|
| `pre-commit` | blocks a normal commit ✓; blocks a **worktree** commit ✓; **does not fire on merge commits** ✗ | fast authorship feedback |
| `pre-push` | covers everything reaching the remote, merge commits included | **the real gate** |
| CI | catches `--no-verify` and hook-less clones | backstop |

`pre-merge-commit` was tested and works, but `pre-push` subsumes it; three hooks
is more surface to maintain than the coverage justifies.

Worktrees need no per-worktree install: `/tmp/terrain-game-ticket-06a` resolves
`--git-common-dir` to the main repository's `.git`, and `core.hooksPath` is
repository config. **One installed hook covers every Codex worktree.**

Hook distribution: `.git/hooks` is not tracked by git (verified: zero tracked
paths under `.git/`), so hooks live in a **tracked directory** with
`core.hooksPath` pointed at it — this also makes hook changes reviewable.
Bootstrapping that config is one command; wiring it into an npm lifecycle script
is optional and, if done, **must guard on the `CI` environment variable** —
`prepare` runs during `npm ci`, and a failure there breaks CI. The repo has no
`prepare` or `postinstall` today.

**The prescription formatter lives in `audit-lint.js`, not in the hooks.** This
is the decision that keeps the seam count at one: the sealed constraints are
about *message content*, and writing the message in each hook would copy the same
prose into three places — reproducing, in the scripts, exactly the duplication
this program removes from the documents. A finding-to-prescription formatter in
the lint module serves four consumers (`pre-commit`, `pre-push`, CI, and the
existing `write-lint.js`, which currently only dumps raw JSON).

The message shape, per the sealed constraints — it must present **both**
legitimate exits, because an agent shown only "register it" will register
anything to get unblocked:

```
unregistered-definition: `Movement graph`
  at docs/features/war-model-build/GLOSSARY.md

Choose one:
 (a) Register it — add a row to docs/audits/term-inventory.json
     (ritual duty 7; INDEX FIELDS ONLY — no definition text,
      single-definition rule)
 (b) Do not register it — if you are unsure the term earns a row,
     remove the definition here and ask the user.

Do not bypass with --no-verify. CI will catch it.
```

`ADVISORY` gating is unchanged: only `blocking` findings set exit status, so
`ledgerCurrency`'s standing false matches never gate a commit.

### Stage 2 — one new column, and the enum check that a prior ruling requires

**The `promoted` field is withdrawn.** Ruling 03 Q3 already decided this: derive,
do not store, because a stored copy of a derivable truth is hand-patched and
drifts. That ruling holds as long as the derivation source survives — and stage 4
now keeps it (headers stay, definitions go). One schema change remains:

| Surface | Field | Nature |
|---|---|---|
| feature `GLOSSARY.md` + `DOMAIN_MAP.md` rows | `summary` (column) | authored beside the definition |

`summary` is a **GLOSSARY column, not an inventory field.** Putting it in the
inventory would make the JSON hold content, recreating "the definition lives in
two places" in a new file — and it would break ruling 03 Q5's ownership boundary
(index fields patchable by a sealing session; content nowhere in the JSON). The
author who writes the definition writes the summary next to it.

**The "why it is canon" line is not a field either.** Since promoted entries
survive as pointers, the reason lives in the retained entry as prose. That is
safe where a definition summary is not: the reason is **derived from nothing** —
it records a decision ("combat-formula and match-arc both read it"), so a change
to the birthplace definition cannot make it wrong. It is also the one thing the
root surface uniquely offers, which is what gives an agent a reason to read it.

One new `audit-lint.js` check — and it is **the completion of ruling 03's binding
condition**, not a new proposal ("this schema is only valid if ticket 09
implements an enum-enforcing check"):

- **field vocabulary** — `status ∈ {AGREED, PROPOSED, rejected-recorded, SEALED}`
  (the extended dictionary per Q1), `kind ∈ {mechanism, meta}`, `verdict ∈`
  the S7 set. Run #3 corrected 13 values outside this vocabulary, every one
  invisible to lint. The failure mode is silent and consequential: `kind` routes
  the Ring B reference dictionary, so an unroutable value **skips judging without
  saying so**. Ruling 03's evidence for why prose alone cannot hold this: the
  2026-07-10 cold review flagged the same enum, and it had **recurred and
  worsened within five days**.
- Gating: **blocking** is the recommendation, pending the ruling named above.
- It reports the `verdict` domain and never repairs it (Q5's boundary).

An earlier draft also proposed a *promotion-consistency* check; with `promoted`
withdrawn there is nothing to cross-check. Ruling 03 Q3 notes the derivation
gives ritual duty 2's promotion scan — pure honour-system today, and the duty the
law records as historically missed — a mechanical form for free. Worth taking as
a **report line**, with the reviewer's caveat attached: the per-surface data
exists (`surface.path`) but `seenTerms` is currently a flat set across
`DOMAIN_MAP` plus all eleven GLOSSARYs, so the derivation is cheap but is **not**
a by-product of the existing finding stream.

**No `HARVEST.md` self-declaration change is needed.** An earlier draft claimed
one, because a stored `promoted` field would have made part of the inventory
authored and unregenerable. With the field withdrawn, the baselines stay derived
artifacts and the declaration stays true.

### Stage 3 — QUICKREF as a generated artifact

QUICKREF is **inventory ⋈ birthplace summaries**, not a render of the inventory
alone: the inventory holds no definition text by design, so rendering it alone
produces a phone book. `summary` (stage 2) is the join column. Until it exists,
a human must read each definition and invent a summary — which is precisely why
the file is hand-curated today, and why it goes stale.

Generator shape mirrors `sync-docs-law.js`: a pure transform plus a `--check`
drift mode, run on demand rather than automatically. **Unlike that precedent, it
ships with tests** — `sync-docs-law.js` has a pure `rebuild()` and no test file
references it.

HTML over Markdown, for two reasons: 267 terms want sorting, filtering, search,
and status colour; and the file **leaves the governed-document set** and becomes
a build artifact. That is the point — it is one fewer document to police.

Manual regeneration is safe because QUICKREF is the **leaf of the derivation
chain**: the law already declares it non-citable, so nothing stands on it.
Staleness is only dangerous when something else is built on top. Required
compensation: **generation timestamp and source commit in the header** — stale is
safe only when stale is legible.

Sequencing requirement: the hand-written **C-loop translation table** (user
statement → dial → checking scale) is the user's own audit surface and is not
derivable. It must be extracted to its own file **before** the generator exists.

**Tier 3** — two law touches: `checkFreshness` changes meaning (from "was the
digest curated" to "was the generator run", the same shape as
`sync-docs-law --check`), and ritual duty 4's wording changes from curation to
regeneration. QUICKREF's `doc-registry.json` row moves from governed doc to
build artifact.

### Stage 4 — `DOMAIN_MAP.md` sheds its duplicate half

Measured composition: **117 entries = 61 project-native + 56 promoted**, and
**76% of the file's 864 lines** are term entries.

Promoted entries (56) are **reduced to pointers, not deleted.** Each keeps its
`- ✅ \`Term\`` header, its status marker, and its why-it-is-canon line; what goes
is the copied definition. This is what the user asked for — *"so that an agent in
a new session who does not know where the glossary is can find it"* — and the
first draft of this spec over-read it as deletion. Retaining the header matters
mechanically as well as editorially: it is the fact ruling 03 Q3 derives promotion
from, and `checkHeaderDiff` scans it. Deleting the entries would have destroyed a
derivation the project already decided to rely on.

Native entries (61) keep their definitions: `DOMAIN_MAP.md` is their birthplace,
so a definition there is correct, and check 9 already scopes itself to exclude
them. **The rule and the check are the same sentence**, which is the signal the
rule is well-formed:

> `DOMAIN_MAP.md` defines only the terms born there. A promoted term gets
> pointer + status + why-it-is-canon.

The four non-term sections route four different ways — this is not one move:

| Section | Actual nature | Destination |
|---|---|---|
| `## Design Principle` | two real terms (`Land-derived state`, `Aging constitution`) under a heading | **stays** — birthplace |
| `## World Direction` | direction prose | **`SPEC.md`** |
| `## Resolved Phase 1 Decisions` | decisions + pointers | **ADR** |
| `## Open Questions` | unsettled questions | tracker or feature `INDEX.md` open-questions |

Guard before moving World Direction: `SPEC.md` already has a
`## Core Design Principles` section, and both surfaces carry supersession stamps.
Diff them first, or the move creates one more copy.

**The rename is last, optional, and its cost is measured.** Renaming
`DOMAIN_MAP.md` to a top-level `GLOSSARY.md` touches **80 inventory
`birthplace` values**, 4 script/test files (`audit-lint.js`, `write-lint.js`,
`audit-lint.test.js`, `hooks.test.js`), `doc-registry.json`, the law, the
`AGENTS.md` mirror, and **92 markdown files**. Mechanical but wide. The rename
buys naming honesty, nothing functional — recommend deciding it on its own after
stages 1–3 have landed, not bundled in.

**Tier 3** — the law names `DOMAIN_MAP.md` in the layer taxonomy and the
Vocabulary Law; both change if the file is renamed or re-scoped.

## Testing Decisions

A good test here asserts **external behavior**: given these baselines and these
document surfaces, does the check report this finding? It never asserts how the
check walks a file. The existing suite is the model — `tests/audit-lint.test.js`
builds small literal fixtures (an inventory of two terms, a three-line surface)
and asserts finding `kind`, `term`, and `path`. No test reads the real repo
except the deliberate integration smoke.

**Seam 1 (existing, reused): the `scripts/audit-lint.js` module contract.**
Pure functions over `(baselines, document surfaces) → findings`, plus the new
formatter. Everything in stages 1, 2, and 4 lands here:

- the field-vocabulary check, and optionally the derived promotion report line
  (ruling 03 Q3) — same shape as the nine
  existing checks
- the prescription formatter — `finding → message text`; assert it names the
  target file, states the index-fields-only bound, offers the do-not-register
  exit, and forbids `--no-verify`. This is where the two sealed constraints
  become executable.
- stage 4 needs no new check: `definitionRestatement` and `headerDiff` already
  cover it, and **`RESTATEMENT_GRANDFATHERED` reaching empty is the acceptance
  test** for the restatement debt.

**Seam 2 (new, mirrors `sync-docs-law.js`): the generator's pure transform.**
`(inventory, glossary summaries) → HTML` plus `--check`. Assert: every registered
term appears; status renders per the status dictionary; the header carries
timestamp and source commit; `--check` reports drift when a source moved.

**Explicitly not seams.** The git hook shells and the CI workflow. They contain
no logic beyond invoking `npm run lint:docs` — invariant 1 guarantees that — and
`write-lint.js` sets the precedent of exporting pure helpers while leaving
`main()` untested. Hook *behavior* was established empirically this session
(worktree commit blocked; merge commit not covered by `pre-commit`; `--no-verify`
bypasses) and that evidence belongs in the spec, not in a unit test that would
have to fork a repository to run.

Prior art to follow: `tests/audit-lint.test.js` (fixture-literal check tests,
42 tests), `tests/hooks.test.js` (pure-helper hook tests, `main()` excluded), and
the `tally` tests that pin which checks gate — that last pattern should be
extended to the new checks so moving one to advisory requires breaking a test and
arguing for it.

## Out of Scope

- **Re-deciding the status dictionary.** Ruled 2026-07-15 (03 Q1): extend, with
  `SEALED` as the fourth value. *Applying* it is a prerequisite of stage 2, but
  the decision is closed and this spec does not reopen it.
- **The typed-alias migration** (`{name, rel}`, ruling 03 Q2) and
  `alias-inject` consuming `rel`. Sealed but blocked: a v2 row makes
  `buildNameIndex`/`nameSet` throw, `alias-inject.findMatches` throw-and-be-
  swallowed, and `checkBaselineSelf` silently return clean, across 88 rows and
  169 alias strings. It needs its own ticket that names every reader first.
  Consequence for stage 2: **the field-vocabulary check must not assume either
  alias shape**, so it stays out of the alias field entirely.
- **Ticket 02's re-grill** (registry-driven target expansion — measured a no-op
  because `DM_ROW` hardcodes DOMAIN_MAP's row grammar and parses 0 rows in 7 of 8
  proposed targets) and **ticket 11's re-grill**. Unblocking those is not needed
  for anything here.
- **Closing the doc-structure map.** Ticket 10's gate was blocked precisely
  because "lint clean" as a terminal criterion converts "we didn't measure it"
  into "it's done". Nothing in this spec should be read as closing that map.
- **Judging whether a term deserves to exist.** No lint check can catch a
  perfectly-registered useless term. That stays with `alias-inject`, the coinage
  duty, Ring B judging, and the user's questions.
- **The eight advisory `ledgerCurrency` findings.** Run #3 verified all eight as
  false "possibly paid" matches with every debt genuinely unpaid. They are meant
  to stand.
- **Paying the 19 restatements.** Stage 4 turns most of them into *definition
  removals from retained entries* rather than rewrites, so paying them before
  stage 4 is wasted work.
- **Retrofitting L-stamps** onto existing seals; optional per the law.
- **`term-inventory.json` schema beyond the `summary` column** (which is a
  GLOSSARY column, not a JSON field — so strictly, no inventory schema change at
  all). No `promoted` field (ruled out by 03 Q3), no domain-category field, no
  term-lifecycle states (a separate registered debt).
- **Backfilling tests for `sync-docs-law.js`.** A real gap found this session,
  but adjacent — do not fold it in silently.
- **Any law edit.** Every Tier-3 item above is a proposal for the user to seal.

## Further Notes

**Why the rule failed, restated as a design lesson.** The law used
*prohibition* — "do not copy" — where it could have used *generation*. The same
repository solves the same problem both ways: `DOCUMENTATION-LAW.md` →
`AGENTS.md` is its longest, most copy-prone text, and it has **never** drifted,
because `sync:docs-law` generates it and `lint:docs` checks it. Prohibition
produced 19 failures; generation produced zero. Where a surface can be generated,
generate it; reserve prohibition for what cannot.

**The measurement that reframed the problem.** Asking "what is this surface
derived from?" sorts the whole file:

| `DOMAIN_MAP` carries | Derived from | Goes stale? |
|---|---|---|
| definition summary | the definition | **immediately** |
| pointer | file location | rarely; a script catches it fully |
| status ✅❓⛔ | birthplace status | yes — `statusMarkers` already catches it |
| why it is canon | **a decision** — derived from nothing | **no** |

Only the first row is a maintenance liability. Removing **it alone** — while
keeping the other three — collapses the stale-able surface toward zero, which is
why removing the duplicated content beats automating it. Note that this table is
also the argument for why the entries survive: three of the four things a
`DOMAIN_MAP` entry carries do not go stale.

**Honest risk in stage 4.** A `DOMAIN_MAP` that is mostly pointers gives an agent
less reason to read it; the read order says to read it, and an agent that skips
straight to the feature loses the signal that a term was promoted at all. The
mitigation is the why-canon line carrying real information — "combat-formula and
match-arc both read it" exists in no feature document, so it is the one thing the
root surface uniquely offers. If those lines are written lazily, the risk is real.

**Standing evidence this works.** Within this session, adding four rows to
`war-model-build/GLOSSARY.md` produced an immediate `unregistered-definition`
finding from the `write-lint` hook, in the same turn — the exact loop stage 1
extends to every editing path.
