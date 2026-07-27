# Handoff — vocab dashboard: screen composition, then final review, then build

**Session:** 2026-07-28 (late). Closed governance ladder stages 2/4, defined the
QUICKREF's purpose, and designed the vocabulary dashboard on paper.
**Repo at handoff:** `main` @ `21903a2`, **pushed** (`origin/main` equal, 0
ahead), working tree clean. `npm run lint:docs` 0 blocking / 10 advisory (all
verified spurious), 513/513 root, 161/161 game.

> Location note: `.context/`, tracked. The documentation law lists it as the
> Working-layer home for handoffs ("tracked — worktrees do not carry untracked
> files"). The `/handoff` skill's default is a temp dir; the project convention
> overrides it. Do not move this to `/tmp`.

## Next session's job

1. **Concrete screen composition** — the user will drive this with the
   `impeccable` and `kill-ai-slop` skills. Visual design was explicitly deferred
   by the user on 2026-07-28, so the designer has real latitude — **except for
   the constraints in § Design-binding rules, which are law, not taste.**
2. **Final review before implementation** — § Settle before building lists what
   must be closed first, and why each one changes the code if answered late.
3. **Then build.** The user intends an "implement skill". **No skill by that name
   exists in this environment** — nearest are `claude-mem:make-plan` →
   `claude-mem:do`, or `tdd`. Pick deliberately; do not go hunting for
   `/implement`.

## Read this first — it is the authority

| What | Where |
|---|---|
| **The whole design: architecture, model shape, renderer contract, triggers, locations, testing seams, law proposals, open decisions** | `docs/superpowers/specs/2026-07-28-vocab-dashboard-design.md` |
| The purpose rulings this rests on (ritual duty 4) | `DOCUMENTATION-LAW.md` § Session-close ritual, duty 4 |
| Enforcement-ladder history + per-piece readiness labels | `.scratch/doc-structure/issues/13-enforcement-ladder.md` |
| Superseded predecessor (its stage 3 is amended in place) | `docs/superpowers/specs/2026-07-26-governance-prevention-over-audit.md` |
| Open debts, including this build's residuals | `docs/SYNC-DEBT.md` |

**Do not re-derive the spec's reasoning.** Everything below is either a pointer
into it or something the spec deliberately left to this next session.

## Design-binding rules — a designer can violate these without noticing

These come from the law (duty 4) and from ruling 03 Q5. They are the reason the
spec specifies a **two-layer** renderer.

1. **No gloss at the scan layer.** The always-visible row carries term · 한국어 ·
   status · where its definition lives, and **nothing else**. A "description"
   column is the natural design instinct here and it is forbidden: only ~206 of
   267 terms can ever have a gloss, so a gloss column re-creates the visual split
   the user objected to — gloss-presence reading as *importance*.
2. **Provenance lives only in the detail panel.** `authored` vs `excerpt` beside
   one open term is information; as a badge across 254 rows it rebuilds the
   hierarchy rule 1 removes.
3. **Never sort, tier, badge, or section the view by whether a gloss exists.**
   Law text, verbatim.
4. **The pointer is the only citable element.** Every row has one. It should read
   as the row's payload, not as a footnote — a user who follows it lands on
   authority; a user who reads the gloss does not.
5. **Panel-shaped, not full-page.** The user's words: "디스플레이 일부에 항상
   띄우는". Density and at-a-glance scanning beat generous whitespace here.
6. **Self-contained single HTML, opened from `file://`.** Output goes to
   gitignored `dist/vocab/`. No CDN, no external fonts, no fetch — there is no
   server and no build pipeline beyond the generator.

Rules 1–4 are the ones worth restating to the design skills up front; they will
otherwise propose a perfectly good layout that breaks the law.

## What the screen must hold

Three regions, per the spec:

- **Term list — 254 entries.** (267 registered, minus the 13 operation plans that
  move to their own panel; the umbrella term `Operation plan catalog` stays.)
- **Plans panel — 13 records.** These are *not* vocabulary: each is a schema'd
  record (`name`, `availabilityConditions`, `effectAxes`, `riskProfile`, claim
  block — ADR 0024). A one-line gloss is a worse view of one than its own record,
  which is why they leave the term list. Columns, not prose.
- **Lock panel.** `last locked <date> (auditRun N) — since then: new N ·
  re-statused M · redefined K · renamed R`. This is what turns "지금쯤
  정리하자" from a feeling into a reading, so it is a first-class element, not a
  footer.

Fixed domains the design can rely on: status is exactly
`AGREED | PROPOSED | SEALED | rejected-recorded`, and DOMAIN_MAP markers are
exactly `✅ ❓ ⛔` (`✅` covers AGREED **and** SEALED). Enforced by checks 3, 10,
and 11 — so status colour has a closed, stable domain.

## Settle before building

Each of these changes code if answered after implementation starts.

- **Three Tier-3 law proposals** (spec § Law implications). The first two are
  mechanical; **the third is not, and it is the one that matters most for this
  build**: the fate of `docs/GLOSSARY-QUICKREF.md`. The dashboard replaces it for
  the user, but for agents a committed markdown is greppable and lands in context
  while a gitignored HTML never will. The spec deliberately refuses to settle
  this inside the build — decide it separately, and note the counter-evidence it
  records (the law already declares the file non-citable, no check scans it,
  agents work from birthplaces).
- **`drift` classification granularity** — "redefined" by text hash (cheap,
  binary) or by diff size (needs a justified threshold). Spec § Open decisions.
- **254 rows at once, or paginate/virtualize.** A design question, but it lands
  in the renderer's shape.
- **Re-measure the A/B/C split before coding it.** The 14/11/22 partition and the
  254 figure are measured, not assumed — but they were measured today, and terms
  are registered continuously.

## Trip-wires

- **A parallel session is committing to `main` in this same checkout.** Four of
  the last eight commits are not from this session (`be0b96a`, `bcd6803`,
  `9a20e97`, `e48244b`), interleaved with mine by minutes. Consequences:
  `git rev-parse HEAD` legitimately moves under you mid-turn, and a push carries
  their commits too. Check `git log --first-parent` before assuming a commit is
  yours. Nothing conflicted — they swept DOMAIN_MAP/SYNC-DEBT/CATALOG while this
  session swept combat-formula INDEX, which were different surfaces of the same
  retired mechanic.
- **That session hands findings over in writing, not verbally** — see ticket 13
  § "Findings handed over from an adjacent session". It deliberately does not edit
  `scripts/audit-lint.js` while another session is in it, because a concurrent
  edit silently overwrites one side. **Reciprocate.** Its note records that verbal
  handover was tried first and failed: both findings were still live on `main`
  hours later.
- **`rg` gives false negatives in this repo** on recursive `.`/dir scope. Use
  `/usr/bin/grep -rn`. Bare `git log` can report another worktree's tip; prefer
  `/usr/bin/git rev-parse` / `show -s` / `rev-list`.
- **`term-inventory.json` round-trips byte-identically** at
  `JSON.stringify(data, null, 1) + "\n"`. Verify that before any scripted patch,
  then edit through `JSON.parse` — never by text substitution.
- **The advisory tally is meant to stay non-zero.** Ten `ledgerCurrency` findings,
  all verified spurious. Driving it to zero is not a goal.
- **Do not commit the parsed `VocabModel`.** It carries definition text, and
  ruling 03 Q5's ownership boundary forbids a content-bearing baseline JSON — the
  same rule that keeps `summary` a GLOSSARY column. The lock stores a commit hash
  and re-parses that revision out of git instead.
- **`game/dist` staleness reads as broken code.** Run `npm run build:runtime:game`
  after any `game/src` merge.

## Two lessons from this session worth carrying into the build

- **A measurement refuted a plausible guess, twice.** This spec's draft claimed
  RULINGS were structured enough for `parseSurfaceHeaders` to reach; measured, it
  reaches **0 of 11**, which surfaced an asymmetry that decided the disposition
  (orphan detection is reachable there, unregistered-term detection is not). The
  spec now refuses to round coverage up to "100%". **Measure the cheap thing
  before writing the confident sentence** — and when a claim is marked "verify
  before promising", verify it in the same session.
- **A blocked decision is usually a missing premise, not a hard trade-off.** Both
  of stage 3's `needs-info` blockers dissolved the moment the user stated what the
  QUICKREF is *for*. Nobody had written it down, which is why the cadence and
  content questions had been contentious for weeks. If the screen composition
  stalls, ask what the surface is for before ranking options.

## Still open elsewhere (not this build)

- **Two Tier-3 residues from the DOMAIN_MAP re-cut**, both registered in
  `docs/SYNC-DEBT.md` § Open and marked in place: the place-naming rule (live,
  product-facing, housed nowhere) and the naval-system roadmap question.
- **QUICKREF gloss coverage** — the cheap half (80 DOMAIN_MAP natives via the
  existing `splitDomainMapRows`) is worth taking at the next lock point; the ~61
  prose-born remainder would need hand-written glosses, which is the backfill the
  2026-07-27 ruling refused. Do not quietly reverse that.
- **The `DOMAIN_MAP.md` rename is DECLINED and indefinitely deferred** (user,
  2026-07-28). If ever reopened, the name must not be `GLOSSARY.md` — it collides
  with the seven Tier-1 feature glossaries and invites the inverse of the law.
- **Project frontier is unchanged and is not this work:** L3 ticket 06b, blocked
  on the supply-base set not being sealed. See
  `.scratch/l3-playable-build/README.md`.

## Suggested skills

- **`impeccable`** — the user's own choice for screen composition. Brief it with
  § Design-binding rules 1–4 *before* it proposes a layout; they are unusual
  constraints and it will otherwise produce a gloss column.
- **`kill-ai-slop`** — the user's own choice. Note the target is a dense
  dev-facing tool, so the risk here is not marketing-page slop but generic
  dashboard tics (badge spam, pastel status pills, oversized cards). Density and
  legibility are the brief.
- **`doc-audit`** — for anything touching the baselines or the law. Start at
  Layer 0 (`npm run lint:docs`) and read the **blocking** tally, not the finding
  count. The lock mode the spec describes is intended to land *in this skill*.
- **`claude-mem:make-plan` → `claude-mem:do`**, or **`tdd`** — for the build
  itself, since no `implement` skill exists here. The spec's § Testing seams
  already names the pure functions and what to assert, so a TDD route is
  well-prepared: `parse`, `render`, `drift`, with the CLI shell left untested per
  `write-lint.js` precedent.
- **`final-check`** at session close.

Do **not** reach for `/to-tickets`. Declined 2026-07-26 and the reasoning has
held through four sessions: the work fits one context, the decisions are durable
in the spec, and ticket files would be a third copy of them — the exact failure
this program exists to remove. Readiness is tracked by the per-piece labels in
ticket 13; keep those current instead.
