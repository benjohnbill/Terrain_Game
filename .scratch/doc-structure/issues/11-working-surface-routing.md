# Working-surface routing — one document kind, one home

Type: grilling
Status: open — REOPENED 2026-07-15 (root ruling's shape survives; its evidence does not)
Blocked by: none (informs 01's deferred `.scratch/` row, ticket 07, ticket 08)

> ## ⚠ REOPENED — both load-bearing measurements behind the root ruling failed
>
> `docs/audits/2026-07-15-doc-structure-review.md` — precedent review §1, C-4,
> H-8, H-9, and fact-check rows 9/10/11/12/13.
>
> **What survives**: the root ruling's *shape* — "the feature folder is the home
> for every durable doc about a feature" — is judged the package's best work and
> answers a real user-stated pain. The **routing rule for new writes** stands on
> user direction. What does not stand is the retirement/migration of existing
> files, and the evidence offered for it.
>
> **Refuted evidence**:
> - **"The 20 references are all 'landed via SDD' historical footnotes, not live
>   authority reads"** → **1 of 31**. Live authority reads, verbatim:
>   `war-model-build/RULINGS.md:88` "**Authoritative design text:**";
>   `GLOSSARY.md:5-8` "dial values live at **the owning model doc** (here: the
>   slice-2 design spec)"; ADR 0038 "**Design source:**"; ADR 0033 "**Decision
>   source:**"; `mockup/DESIGN-QUESTIONS.md:8` "**Source of truth:**".
>   **Ticket 04 refutes this in the same batch** — its whole thesis is that
>   RULINGS.md:88 designates that spec as live authority.
> - **"~1:1 spec→feature mapping"** → **5/12** map to one feature; 3/12 to two;
>   **4/12 to none**; by filename→slug, 3/12.
> - **Counts**: plans **17** not 12; `.scratch` issues **22** not 10 (the figure
>   omitted the directory this map lives in); references **31** across 16 truth
>   docs, ~52 tracked lines, **plus 21 doc-registry.json rows**.
> - **A third home was never surveyed**: `.superpowers/` — **138 files**,
>   gitignored, holding `sdd/task-N-report.md` progress + review diffs (task
>   decomposition), and **cited by accepted ADR 0034** (a live path, not the dead
>   ref ticket 12 guessed). So task decomposition has three homes, not two, and
>   the survey missed the largest.
>
> **Its own constraint was abandoned**: "zero forced file moves required; any
> migration is a **separate, optional** consequence the user rules on per kind" —
> then it spawned ticket 12: retire "**entirely**", 30 files, `git mv`, delete
> the tree, `Type: task`. Not optional, no per-kind ruling.
>
> **P4, judged honestly**: reopens on "post-P1/P2 audits surfacing
> **topology-caused failures**". Offered: duplication + a user phrase. Duplication
> is not a failure; no incident is cited; run #3 hasn't run. The same batch's
> ticket 01 ruled one near-miss "first instance → WATCH, do not codify" — the
> same evidence base was too thin to codify a **sentence** and sufficient to
> retire a **directory**. The map's own Out-of-scope says topology restructure
> reopens "**as a fresh effort**".
>
> **Unowned consequence**: `documentation-law.md:17` names `docs/superpowers/`
> and was re-sealed today (e35caf8). Retiring the directory requires removing
> that token — a Tier-3 law edit this ticket never named.
>
> **C-4 — this ruling deletes the effort's own Record**: Q10 makes `.scratch/`
> untracked and "disposable after doc-sync", but these tickets ARE what the law
> defines as Record-layer material (ruling history, rejected alternatives,
> riders). No doc-sync path carries them; there is no governance `RULINGS.md`.
> The user's pain — "나중에 에이전트가 정보를 찾기 힘들" — reproduced on the
> package's own output. (Partially mitigated 2026-07-15 by tracking the review at
> `docs/audits/`; the rulings still have no durable home.)
>
> **Re-grill needs**: (1) keep the routing rule for NEW writes; (2) recompute
> every measurement from the live tree; (3) survey `.superpowers/` before ruling
> on task-decomposition homes; (4) decide migration separately and per-kind, with
> P4's evidence bar honestly applied; (5) give the governance Record a home.

## Question

Several document kinds have more than one home, so an agent writing one has a
choice of location — the "여러 장소에 적을 수 있는 참사" the user named. Settle a
single home per kind, then decide what `.scratch/` is and whether git tracks it.

### Measured duplication (2026-07-15, verified against disk)

| Document kind | Home A | Home B | Home C |
|---|---|---|---|
| Task decomposition (TDD plan / tickets) | `docs/superpowers/plans/` — 12 files, **tracked**, `### Task N` + TDD steps + Self-Review | `.scratch/<f>/issues/NN-*.md` — 10 files, **untracked**, one ticket per file + `Status:` | — |
| Design spec (pre-implementation) | `docs/superpowers/specs/` — tracked | `.scratch/<f>/spec.md` — template convention (never used; ticket 07 removes it) | — |
| Research / evidence | `docs/features/<slug>/research/*.md` — 6 dirs | `docs/features/<slug>/RESEARCH.md` — 3 files | `.scratch/<f>/research/*.md` — introduced 2026-07-15 (this map) |
| Session handoff | `.context/*.md` — untracked | — | — |

### Word collision

The template's `.scratch/<feature-slug>/` uses "feature" for a *work unit* (a
pass / slice / effort), but `docs/features/<slug>/` uses it for a *game feature*
(Production, vertical slice with INDEX/GLOSSARY/RULINGS). `doc-structure` and
`war-model-slice2` are not game features. Same word, two referents.

## Sub-decisions

1. **Task decomposition — one home.** `docs/superpowers/plans/` (tracked, rich)
   vs `.scratch/<f>/issues/` (untracked, one-file-per-ticket, triage `Status:`).
   Are these the SAME kind (pick one) or TWO kinds (a durable TDD plan vs a
   live triageable ticket queue — legitimately distinct, needing a stated
   boundary)?
2. **Research — one home.** The three research homes. Likely rule: feature-
   scoped research → `docs/features/<slug>/research/`; cross-cutting / meta
   research (e.g. this map's governance surveys) → `docs/audits/` (precedent:
   `docs/audits/2026-07-10-structure-forensics.md` is registered audit
   evidence). Confirm and state the boundary.
3. **`.scratch/` identity.** After 1–2, what remains uniquely `.scratch/`'s
   job? Is it a real layer or a redundant one to retire?
4. **`<feature>` rename.** If `.scratch/` survives, rename the path token to a
   repo-native word (`<pass>` / `<effort>` / `<work-unit>`) to kill the
   collision with `docs/features/`.
5. **Tracked vs untracked** (inherited from commit 7ca0e9f's deferred user
   decision). Depends on 3: a durable ticket queue argues for tracked; a
   scratch area argues for untracked-like-`.context/`.

## Constraints

- **Not P4.** P4 rejected *moving existing truth documents* ("would break
  pointers, fixes none of the 19 cases"). This is a *routing rule for new
  writes* — zero forced file moves required; any migration of existing files
  is a separate, optional consequence the user rules on per kind.
- Whatever is decided becomes ticket 01's deferred `.scratch/` law row and
  feeds ticket 08 (registry rows). If a home is retired, ticket 07 / a
  follow-up handles any migration.
- Respect emergence-limit: register only homes that exist and carry a settled
  role; do not invent speculative structure.

## Output

A per-kind routing table (kind → single home → when) + `.scratch/` identity
verdict + tracked/untracked ruling. Becomes the `.scratch/` law row (batched
into 01+05's diff or its own) and the DOMAIN_MAP/registry updates.

## Evidence

`research/enforcement-survey.md` (registry layer classifications) ·
`research/design-history-survey.md` (P4 rejection scope, emergence-limit) ·
commit 7ca0e9f (untrack rationale + deferred decision) · disk survey
2026-07-15.

## Answer (2026-07-15)

**Root ruling: the feature is the home.** Every durable document about a game
feature lives in that feature's `docs/features/<slug>/` folder; only transient
per-effort working surfaces live outside it. This kills the "여러 장소에 적을
수 있는 참사" — the answer to "where do I write X about feature F" is always
"inside F's folder". Sub-decisions Q6–Q10 all cascade from this.

Measured basis: the 12 `docs/superpowers/specs/` map almost 1:1 to feature
slugs; the 20 references from truth docs (incl. 5 ADRs) are all "landed via
SDD — <path>" **historical footnotes**, not live authority reads (superpowers
is registered "not current truth" everywhere). So this is a routing rule for
new writes + a mechanical relocation of non-authoritative history — **not P4**
(which rejected moving *authoritative* truth and breaking its pointer chains).

### Per-kind routing table

| Document kind | Single home | Tracked |
|---|---|---|
| Design spec (feature-scoped) | `docs/features/<slug>/specs/YYYY-MM-DD-*.md` | yes |
| Design spec (governance/meta, no feature) | `docs/audits/` | yes |
| TDD plan (historical archive; format retired per Q6) | `docs/features/<slug>/plans/` (or `docs/audits/` for meta) | yes |
| Live tickets / decisions (triageable) | `.scratch/<effort>/issues/NN-*.md` | no |
| Wayfinder map | `.scratch/<effort>/map.md` | no |
| Working research (transient, per-effort) | `.scratch/<effort>/research/` | no |
| Durable research / evidence | `docs/features/<slug>/research/*.md` (feature) or `docs/audits/` (governance) | yes |
| Session handoff | `.context/*.md` | no |

- **Q6 — task decomposition: TWO kinds, sharp boundary.** A *plan* is a durable
  whole-effort script (retired format, archived); a *ticket* is a single
  claimable unit carrying `Status:`/`Blocked by:`, produced by
  `/to-tickets`|`/wayfinder`. Boundary: **carries triage state and is claimed
  one-at-a-time → ticket; read-through script for one session → plan.** New task
  decomposition is tickets only.
- **Q7-a — feature-folder shape:** per-kind subdirs `specs/` + `plans/`,
  mirroring the existing `research/` evidence-subdir precedent (law line 44:
  Production folders already host non-normative "surveys and audits"). `specs/`
  is also where NEW design specs land going forward — but **whether a spec in
  there is authoritative for its build remains ticket 04's ruling** (this
  ticket sets location, not authority — rider preserved).
- **Q7-b — meta exception:** governance/meta docs with no feature home →
  `docs/audits/` (precedent: `docs/audits/2026-07-10-structure-forensics.md`).
  The three survey digests now under `.scratch/doc-structure/research/` are
  governance evidence; their durable home is `docs/audits/`, synced at this
  map's close (ticket 10) — not moved now, to avoid breaking the live evidence
  pointers in tickets 01–10.
- **Q8 — `.scratch/` identity:** the transient per-effort working area
  (tickets + map + working research) that feeds doc-sync, then is disposable.
  A real, distinct layer — not redundant — because its contents are live and
  claimable, unlike the durable feature folder. Durable outputs graduate into
  `docs/features/` or `docs/audits/` at doc-sync.
- **Q9 — rename:** `.scratch/<feature-slug>/` → `.scratch/<effort>/` in the
  docs (issue-tracker.md + the law row), killing the collision with
  `docs/features/<slug>/`. Existing dirs (`war-model-slice2`, `doc-structure`)
  contain no literal "feature" and need no rename.
- **Q10 — tracked vs untracked:** `.scratch/` stays **untracked** (like
  `.context/`; both are convention-only, not gitignored — verified). Durable
  truth reaches git via doc-sync into features/audits, so the working area
  needs no git. Resolves commit 7ca0e9f's deferred user decision.

### Consequences (fed to other tickets)

- **New ticket 12** — the superpowers migration (30 files → feature/audits
  homes + 20 reference rewrites + registry). Task; produces a reviewed mapping
  table before moving.
- **Ticket 01's deferred `.scratch/` law row** is now specifiable: register
  `.scratch/<effort>/` as the transient working area (tickets/map/research),
  untracked, disposable-after-doc-sync. Batches into the 01+05 law diff.
- **Ticket 08** (registry refresh): the 9 unregistered superpowers docs will be
  registered at their NEW feature/audits paths as part of ticket 12, not at
  superpowers paths — 08 and 12 must reconcile (12 supersedes that slice of 08).
- **Ticket 04** (working-spec authority): inherits that specs now live at
  `docs/features/<slug>/specs/`; the authority question is unchanged.
- **Ticket 07** (setup slimming): its removal of the `.scratch/spec.md` line is
  reinforced — specs never live in `.scratch/`.
