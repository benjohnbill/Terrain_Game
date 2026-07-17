# Superpowers migration — retire the directory into feature/audits homes

Type: task
Status: BLOCKED — do not execute
Blocked by: 11 (re-grill required — its root ruling's evidence was refuted)

> ## ⛔ DO NOT EXECUTE (blocked 2026-07-15 by adversarial review)
>
> Ticket 11's basis for "this is not P4" was **refuted by measurement** — see
> `docs/audits/2026-07-15-doc-structure-review.md`. Executing this ticket as
> written would break pointers, which is exactly what P4's rejection predicted.
>
> - **The "historical footnotes" premise is false.** 1 of 31 references uses
>   that phrasing. The rest are live authority reads: `war-model-build/
>   RULINGS.md:88` ("Authoritative design text:"), `GLOSSARY.md:5-8` ("dial
>   values live at the owning model doc … the slice-2 design spec"), ADR 0038
>   ("Design source:"), ADR 0033 ("Decision source:"), `mockup/DESIGN-QUESTIONS.md:8`
>   ("Source of truth:").
> - **The scope figures are wrong.** Not "30 files + 20 references": plans are
>   **17** not 12; references are **31** across 16 truth docs (not 20), ~52
>   tracked lines total, **plus 21 doc-registry.json rows**. Step 3's grep scope
>   misses 18 — including `mockup/combat-calc/map-data.js:4` (a **JS file**) and
>   `.claude/skills/doc-audit/SKILL.md:11` — so step 6's exit criterion cannot
>   be met by step 3's scope.
> - **It would move an in-flight build's spine.** The slice-2 spec is WM-②'s
>   designated authoritative text and is cited by all 10 slice-2 tickets, **5 of
>   which are unbuilt**. Ticket 04's constraint ("do not disturb the slice-2
>   build in flight") is violated.
> - **Step 3 would sed sealed law.** `documentation-law.md:17` names
>   `docs/superpowers/` and was **re-sealed today** (e35caf8). A path cannot be
>   sed'd out of a taxonomy row — the token must be removed, which is a Tier-3
>   edit needing a fresh user seal. No ticket owns this.
> - **A third home was never measured.** `.superpowers/` — 138 files,
>   gitignored, cited by accepted ADR 0034 — holds task decomposition too. The
>   routing survey behind ticket 11 missed the largest of the three homes.
> - **`git mv` without a same-commit registry update fires 21
>   `dead-registry-path` findings.**
>
> Unblocks only after ticket 11 is re-grilled and re-sealed on corrected
> measurements, with a scope recomputed from the live tree.

## Question

Execute the routing verdict of ticket 11: retire `docs/superpowers/` entirely,
relocating each of its 30 files to its feature's `docs/features/<slug>/{specs,
plans}/` home (or `docs/audits/` for governance meta), and rewriting every
reference. Mechanical relocation of non-authoritative history — not P4 (nothing
authoritative moves; no live authority pointer breaks).

## Steps

1. **Produce a mapping table FIRST** — every file under `docs/superpowers/`
   (12 specs + 17 plans + 1 session record) → destination path. Most specs map
   1:1 to a feature slug; the ambiguous ones need judgment:
   - `hegemony-decision-timing-target`, `conquest-growth-engine` → war-model-build
     or match-arc? (decide by which feature's INDEX/RULINGS already cite it)
   - `phase-1-mvp-payoff-loop` → phase-1-fun-core? `stage2-command-skill-edge` → ?
   - `doc-audit-and-forensics`, `doc-governance-p3-p1-implementation` → `docs/audits/`
   **Post the table for user spot-check before moving anything.**
2. **`git mv`** each file to its destination (preserve history). Create
   `specs/` / `plans/` subdirs per feature as needed.
3. **Rewrite the 20 references** — grep `superpowers/` across `docs/features/`,
   `docs/adr/`, `DOMAIN_MAP.md`, `.claude/rules/`, `docs/*.md`; sed the path
   prefix. Pure path rewrite — no ADR supersession judgment (the citations are
   "landed via SDD — <path>" footnotes; the target moves, the meaning doesn't).
   Note: `docs/adr/0034` cites `.superpowers/sdd/progress.md` (a leading-dot
   path, a different/older location) — verify whether that file exists before
   touching it; it may be a dead ref already.
4. **Registry** — this replaces ticket 08's superpowers slice: register each
   relocated doc at its NEW path with its working-layer role string; drop the
   old superpowers paths. Reconcile with ticket 08 so the file isn't edited
   twice.
5. Delete the now-empty `docs/superpowers/` tree.
6. `npm run lint:docs` (`dead-registry-path` catches a missed rewrite) + full
   test suite; grep `superpowers/` returns only this map's own tickets.

## Constraints

- Mapping table user-reviewed before any move (ambiguous feature assignments).
- Feature folders host these as **non-normative evidence/history** (law line 44
  precedent) — relocation does not make a Working-layer spec into Production
  truth; ticket 04 owns the authority question.
- This is a large mechanical pass — its own session, likely after tickets
  01/04/05 land so law text about specs' home is settled first.

## Output

Empty `docs/superpowers/`; all history relocated with git history intact; all
references live; registry current; lint + tests green.

## Evidence

`.scratch/doc-structure/issues/11-working-surface-routing.md` (Answer — routing
table + rationale) · `research/design-history-survey.md` (P4 scope).
