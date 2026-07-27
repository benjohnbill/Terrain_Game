# Vocabulary Dashboard — design spec

Date: 2026-07-28
Status: **design agreed, unbuilt.** Working layer — this records a decided
shape, not a seal. Authority for anything it touches stays with
`DOCUMENTATION-LAW.md`; where this spec needs the law changed it says so and
proposes rather than assumes.

Supersedes the generator half of
`2026-07-26-governance-prevention-over-audit.md` § Stage 3. That section's
reasoning holds (pure transform + `--check`, HTML over Markdown, leaf of the
derivation chain) and its premise was wrong in one place: it treated the missing
`summary` column as the obstacle. Measurement says otherwise — see § Why
coverage was never the problem.

## Purpose (user rulings)

The QUICKREF's purpose was undefined until 2026-07-28, which is what made every
question about its cadence and content unanswerable. Two rulings define it:

1. **2026-07-28 (a) — two purposes.** An **encyclopedia** (look a term up, find
   where it lives) and a **lock point** (the baseline you re-cut deliberately
   when the demand "let us tidy the vocabulary now" arises). Landed in the law
   at ritual duty 4, with three rules: on-demand cadence, **equal visual weight
   per term**, and a last-regenerated date.
2. **2026-07-28 (b) — the shape.** "사용자인 내가 한 눈에 보기 편하게,
   디스플레이 일부에 항상 띄우는 백과사전 및 대시보드." Rendered **HTML**, a
   **build artifact**, in a subdirectory of this repo — no separate repo.
   Visual design deferred.

Ruling (b) reclassifies the thing being built. It is not a document that happens
to be generated; it is **a UI with a document's obligations**.

## The tension, and its resolution

A build artifact wants to be **always current**. A lock point wants to be
**deliberately still** — a baseline is not a baseline if it moves on its own.
One file cannot be both, and the user identified this directly.

**Resolution: the staleness was never the point.** Ruling (a) asks for a
기준점 — a reference point. The QUICKREF went stale because it was
hand-written, not because stillness was wanted. So the still thing becomes a
**marker**, and the view stays current:

```
① dashboard   build artifact, always current, HTML, always on screen
② lock marker a stored commit hash + date — NOT a document

"tidy now"    read the drift since ②  →  review  →  advance ②
```

A marker beats a stale file at the same job. A stale file says *what it said
then*; a marker plus a diff says *what has moved since* — which is what a review
actually needs. And the dashboard can surface the marker's state as a panel, so
"is it time to tidy?" stops being a feeling and becomes a number on screen.

The pattern is already native here: `term-inventory.json` carries
`regenerated` + `auditRun`, and `doc-registry.json` carries `regenerated` +
`derivedFrom`. Storing a baseline marker is an existing convention, not an
invention.

## What actually drifts

Only one axis needs a baseline, because the others cannot drift any more:

| Axis | Enforcement | Needs a lock baseline? |
|---|---|---|
| Term existence (both directions) | check 1, **blocking** | no |
| Status agreement, DOMAIN_MAP ↔ index | check 3, **blocking** | no |
| Status agreement, GLOSSARY ↔ index | check 11, **blocking** (landed 2026-07-28) | no |
| Inventory field vocabulary | check 10, **blocking** | no |
| Code identifier drift | check 2, **blocking** | no |
| **Definition / summary TEXT** | none | **yes** |
| **Arrival order — what is new since I last looked** | none | **yes** |

Measured: **75 commits in the last 30 days** touched `DOMAIN_MAP.md` or a
feature `GLOSSARY.md`. That churn, entirely ungated by design (nobody wants a
gate on prose), is the whole reason a lock point exists.

## Architecture — three modules, not two

The user asked for a parser and a renderer. This spec adds an explicit
**intermediate model** between them, for one decisive reason: **the lock must
diff the model, never the HTML.** Retrofitting that later means reopening the
parser.

```
parse(sources)        → VocabModel      pure; knows no HTML, touches no fs
render(VocabModel)    → HTML string     pure; touches no fs
drift(modelA, modelB) → DriftReport     pure; two models in, changes out
```

Only a thin CLI shell reads files and writes output — the same division
`sync-docs-law.js` uses (pure `rebuild()`, `--check` mode, fs only at the edge)
and `audit-lint.js` uses (pure checks over `(baselines, surfaces)`, fs only in
`runAll`). Tests target the pure functions; the shell stays untested, as
`write-lint.js` already establishes.

### Hard constraint: the model is never committed

`VocabModel` carries definition and summary **text**. Committing it as a
baseline JSON would break **ruling 03 Q5's ownership boundary** — the same
ruling that keeps `summary` a GLOSSARY column rather than an inventory field
("a JSON holding content breaks the ownership boundary"). So:

- `VocabModel` exists **only as a build-time intermediate**.
- The lock baseline stores **no content**. It stores a commit hash; the old
  model is recovered by re-parsing that revision out of git.

This is cheaper as well as legal: nothing to store, nothing to keep in sync,
and git already holds every past state.

## VocabModel — shape

One entry per registered term. Fields are either indexed (from
`term-inventory.json`, already enforced) or parsed (from the birthplace).

```
{
  canonical, korean, aliases[],        // index — enforced by checks 1/10
  birthplace, tier, status, kind,      // index — enforced by checks 1/3/10/11
  codeIdentifier, codeRefs[],          // index — enforced by check 2
  gloss:  { text, source } | null,     // parsed
  tier0:  { summary } | null,          // parsed from DOMAIN_MAP, promoted terms
  anchor: "<path>#<heading-or-row>"    // derived — the pointer's link target
}
```

`gloss.source` is one of `authored` (a filled `Summary` column, or a Tier-0
summary written by the definition's author) or `excerpt` (mechanically quoted
from the birthplace). It is a **provenance** field, and § Renderer contract
bounds where it may be shown.

## Excerpt over authored summary — and why that is not a loophole

For terms with no authored summary, quote the birthplace verbatim rather than
writing one. The reason is the law's own:

> the `Summary` column is going-forward only, because "a summary written in bulk
> by a non-author is the unowned text this law exists to prevent" (user ruling
> 2026-07-27)

An excerpt is **not a summary — it is a quotation.** Nobody authored it, so
nobody owns a wrong one, and it **cannot go stale**: regenerating re-quotes the
current text. A hand-written bulk summary can rot silently; a quotation cannot.
So excerpting sidesteps the ruling instead of eroding it — but only while it
stays labelled as a quotation, which is what `gloss.source` is for.

**Backfilling authored summaries for the unglossed remains refused** (it is the
backfill the 2026-07-27 ruling declined). They fill in naturally as terms are
re-sealed by their own authors.

## Why coverage was never the problem

Stage 3 assumed the obstacle was that too few terms have summaries. Measured:

- authored `Summary` cells across 7 feature GLOSSARYs: **0 of 121** (by design)
- mechanically extractable via the existing `birthplaceRowText`: **126 of 267**
- plus the 80 DOMAIN_MAP natives via the existing `splitDomainMapRows`: **~206**
- unreachable by any row parser: **~61**
- terms with their own line in today's hand-written QUICKREF: **131 of 267 (49%)**

The user's objection is sharper than coverage: a visual split makes
gloss-presence read as **importance**, and glossed rows dominate the page.
Raising coverage only changes the ratio — 56:211 becomes 206:61. So the answer
is the **renderer's structure**, and it holds at any coverage.

Note the second number above: the hand-written file is at 49%, and what it omits
is disproportionately *basic* vocabulary (`Terrain-first`, `Faction`,
`Region value`, `Sector value`, the six value axes, `Usable value`). The cause is
structural — the file grew as a log of seal batches, and the foundational terms
predate the ritual, so they were never in a batch to be appended. Generation
takes 131 → 267 in one step, which is the strongest single argument for building
this.

## Renderer contract

**Two layers, and the split is what satisfies the law's equal-weight rule
structurally rather than by careful layout discipline.**

| Layer | Content | Uniform? |
|---|---|---|
| **Scan** — always visible | term · 한국어 · status · where its definition lives | **yes, all of them — no gloss at this layer** |
| **Detail** — opened per term | gloss + `gloss.source` + the anchor link | n/a — one term at a time |

- **No gloss at scan layer.** With nothing to be unequal, gloss-presence cannot
  read as importance. The law's "never sort, tier, badge, or section by whether
  a gloss exists" is then satisfied by construction.
- **Provenance only at detail layer.** Showing `authored` vs `excerpt` beside one
  open term is *information*; showing it across 267 rows would rebuild the
  hierarchy the rule forbids. One panel open at a time is what makes it safe.
- **The pointer is the citable part.** Every row carries one; no gloss is
  citable, which is precisely why an authored summary and a quotation may be
  rendered alike without concealing anything.
- **Interaction the format buys** (stage 3's reason for HTML over Markdown):
  sort, filter, search, status colour across 267 entries.
- **Header carries** the generation timestamp, the source commit, and the lock
  marker's state.

### Lock panel

A first-class dashboard element, not a footnote:

```
last locked 2026-07-26 (auditRun 3) — since then:
  new N · re-statused M · redefined K · renamed R
```

This is what turns "지금쯤 정리하자" from a feeling into a reading.

## Scan scope — the 47 unwatched terms are three different problems

Today the checks scan `DOMAIN_MAP.md` + `docs/features/*/GLOSSARY.md`, so
**220 of 267 terms (82%)** are watched and 47 are invisible to every check.
Treating those 47 as one backlog is why the scope question kept stalling. They
are three kinds with three different answers.

### A — catalog records (14): `operation-plan-catalog/CATALOG.md`

`Operation plan catalog` plus its 13 plans (Swift Seizure, Raid, Scorched
Earth, …). These are **not vocabulary**: each plan is a record with a schema
(`name`, `availabilityConditions`, `effectAxes`, `riskProfile`, plus a claim
block, per ADR 0024). "Swift Seizure" is not a word whose meaning you look up;
it is a game object with fields, and a one-line gloss is a *worse* view of it
than its own record.

**Disposition:** the 13 plans render as a **separate plans panel** with schema
columns, not as term rows. The umbrella term `Operation plan catalog` stays in
the term list. Term list therefore renders **254**; the plans panel renders 13.
Do not add CATALOG.md to the term scan scope — a term-registration check is the
wrong instrument for a record set; a schema check would be the right one, and
that is out of scope here.

### B — ruling handles (11): `force-geography/RULINGS.md` ×9, `match-arc/RULINGS.md` ×1, `tactical-plan-ai/RULINGS.md` ×1

`One blanket (이불 한 장)`, `Terrain envelope (지형 봉투)`,
`Scarcity+value weak front`, `최소 / 정교 sequencing`, … all `SEALED`. These are
**names given to rulings** — a decision's handle. Several are frankly not
vocabulary at all (`최소 / 정교 sequencing` is a sequencing decision).

**Feasibility — measured, and it refuted the first guess.** This spec's draft
assumed RULINGS were structured enough for `parseSurfaceHeaders` to reach. It is
not: the parser finds **0 of the 11**. The structure is

```
## FG-② U1 terrain envelope — adopt the measured fort-by-class mapping — SEALED 2026-07-09, L2-measured
```

— the ruling *number* is the heading's subject and the term is embedded in the
holding's prose (`terrain envelope` mid-heading, `Commit-scarcity` at the front
of FG-⑧). Worse, some never reach a heading at all: `One blanket` / `이불 한 장`
occurs only in FG-①'s body prose. There is no structural position that says
"this phrase is a term."

**This produces an asymmetry that decides the disposition.** The two directions
of check 1 are not equally reachable here:

| Direction | Reachable in RULINGS? | Why |
|---|---|---|
| **orphan** — a registered name no longer present | **yes** | the name is known; searching for it needs no structure. Check 1 already has the mechanism (its inline-name suppression path: "suppresses orphan when the name appears inline, backtick or plain, at its birthplace") |
| **unregistered** — a new term defined but not registered | **no** | enumerating candidate terms out of prose is not a parsing problem, it is a judgment |

**Disposition:** do **not** claim RULINGS for full scan coverage — the
unregistered half is unreachable, and a scope flag would imply a guarantee that
does not exist. Take the reachable half only: orphan detection via the existing
inline mechanism, so a ruling handle that quietly disappears is still caught.
For the gloss, excerpt the ruling's **heading line** where the term appears in
it, and the containing sentence where it does not — a ruling's holding is its
heading, so the quotation is apt either way. Coverage after B is therefore
**220 + 11 orphan-watched**, with unregistered-term detection still bounded to
GLOSSARY-shaped surfaces. Say it that way; do not round it up to "100%."

### C — real terms housed in a prose model doc (22): MAGNITUDE ×9, STRATEGY-SPACE ×6, MATCHUP ×3, ADR 0019 ×3, TEST-LADDER ×1

`Emergency reserve`, `Surrender harvest`, `Attack axis as numeraire`,
`Leak-through`, `Reachable-weakest-link`, the six winning archetypes, … These
**are** vocabulary. They live in prose model docs only because that is where the
magnitude / matchup / strategy work happened.

**This is the only genuine housing problem**, and it is 22 rather than 47.
Five already have authored Tier-0 summaries (written 2026-07-28 in the stage-4
re-cut: Emergency reserve, Mobilization visibility, Surrender harvest, Feint
follow-up, Attack axis as numeraire), so the dashboard has real glosses for them
today. The rest get excerpts.

**Disposition:** excerpt-with-provenance now; a per-term housing decision (does
it earn a GLOSSARY row?) belongs to whichever feature pass next touches it, not
to this build.

## Triggers

The three actions have different judgment content, and conflating them is what
produced the per-batch toll that ritual duty 4 had to retire.

| Action | Judgment | Trigger | Decided |
|---|---|---|---|
| **render** — refresh the view | none | **automatic**, on the existing `write-lint.js` PostToolUse hook | user, 2026-07-28 |
| **check** — report drift since lock | none | anytime; no side effects | — |
| **lock** — review, then advance the marker | **yes** | **manual, a mode added to the `doc-audit` skill** | user, 2026-07-28 |

`write-lint.js` is the right host: it already fires on this exact governed-path
set, it **never blocks** (findings are reports, S13), and it fails silently by
design so a hook bug cannot break the edit it reacts to. Rendering inherits all
three properties, so the view stays current at zero toll.

**Budget.** `audit-lint.runAll` — which reads every governed doc *and* walks
both code trees — measures **46–68ms**. A vocabulary parse reads 1,248 lines of
markdown plus one JSON and needs no code walk, so it is comfortably inside a
per-edit hook. Re-measure if the sources grow an order of magnitude.

**Why `doc-audit` rather than a new skill:** it is already the entry point for
this territory, and two skills would compete for the same reach. The lock mode
is a curation step appended to its ladder, not a rival to it.

## Locations

Repo conventions decide these; none is a fresh choice.

| Thing | Path | Why |
|---|---|---|
| Modules | `scripts/vocab/` | same family as `audit-lint.js` / `sync-docs-law.js`; `tests/` conventions apply unchanged |
| Tests | `tests/vocab-*.test.js` | flat `tests/` is the convention |
| Output | `dist/vocab/` | **`dist/` is already gitignored.** The repo's rule is "emitted artifacts, never committed" |
| Lock marker | `docs/audits/` (alongside the baselines it describes) | `regenerated` / `auditRun` precedent lives there |
| This spec | `docs/superpowers/specs/` | dated-name convention |

Output landing in gitignored `dist/` delivers stage 3's stated benefit for free:
the dashboard **leaves the governed-document set** and becomes one fewer
document to police.

## Testing seams

Mirrors `audit-lint.test.js`: small literal fixtures, assert external behaviour,
never assert how a function walks a file.

- **`parse`** — given a two-row GLOSSARY and a two-entry inventory, assert the
  model's entries, `gloss.source`, and anchors. Assert an unregistered heading
  does **not** enter the model (registration is check 1's job, not the parser's).
- **`render`** — given a model with one authored and one excerpted gloss, assert
  the scan layer is byte-identically shaped for both, and that
  `gloss.source` appears **only** in detail markup. This is the equal-weight rule
  as an executable test rather than a style note.
- **`drift`** — given two models, assert new / removed / re-statused / redefined
  classification, and that an unchanged pair yields an empty report.
- **Not seams:** the CLI shell and the hook wiring, per `write-lint.js`
  precedent.

## Law implications — Tier 3, proposals only

Three clauses in ritual duty 4 stop matching once this lands. Not edited here.

1. **"Header carries a last-regenerated date."** With render automatic, that
   date is always ~now and carries no information. The meaningful stamp becomes
   **last *locked***. Proposal: duty 4 requires both, and names the lock date as
   the review anchor.
2. **`stale-quickref` (advisory).** It compares the QUICKREF's date to the
   newest glossary seal. Against an always-current artifact it can never fire,
   so it either retires or is re-aimed at **lock staleness** ("you have not
   reviewed the vocabulary since N changes ago"), which is the reading that
   actually has value.
3. **The fate of `docs/GLOSSARY-QUICKREF.md`.** **Genuinely open — do not
   settle it inside the build.** The dashboard replaces it for the user. For
   agents the markdown is greppable and reachable in context while a gitignored
   HTML is not, which is a real argument for keeping a committed form. Note the
   counter-evidence: the law already declares it non-citable, no check scans it,
   and agents work from birthplaces. Decide separately.

## Open decisions

- **Whether the term list shows all 254 at once** or paginates/virtualizes.
  Visual design is explicitly deferred (user, 2026-07-28), and this is a design
  question, not an architecture one.
- **`GLOSSARY-QUICKREF.md`'s fate** (above).
- **Whether `drift` classifies a *redefinition* by text hash or by diff size** —
  the cheap version is "changed at all"; a threshold would need justification.

## Non-goals

- No auto-**lock**. Advancing the marker is a review, and a review is the user's.
- No backfilled authored summaries (2026-07-27 ruling).
- No separate repository (user, 2026-07-28).
- No visual design in this spec.
- No schema validation for the plans panel — named as A's right instrument, but
  out of scope.
