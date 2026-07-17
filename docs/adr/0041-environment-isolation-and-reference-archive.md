# ADR 0041: Environment Isolation — Marketing Landing vs Game Runtime, and the Reference Archive

Date: 2026-07-17

Status: Accepted

Decision source: user statement, 2026-07-17 — Firebase hosts the marketing
landing page only; the game we are actually building does not ship on Firebase;
a later native shell (Electron or Tauri) is the intended wrapper, with the
landing page serving download integration, and the environments are to be kept
completely isolated. The reference `js/` tree, `tests/`, and the L2 harnesses
are archive/reference, not the build source; the L3 TypeScript build occupies
its own space, separate from them.

Amends: ADR 0016 — its Stage 2 native-shell wrap is promoted from a deferred
trigger ("wrap the existing web build") to the declared destination of the L3
build, and its "static HTML/CSS/JavaScript browser application" context is
scoped to the reference prototype rather than to L3.

Amends: ADR 0028 — its staged-evolution framing is unchanged, but the L3
build's deployment target is now stated rather than left to a Stage 2 trigger.

## Context

The L3 Playable Seam Wayfinder (`.scratch/l3-playable-seam/`) drafted its gate
tickets on 2026-07-16 without a repository survey. A full audit on 2026-07-17
(`.scratch/l3-playable-seam/audit/SYNTHESIS.md`) found that several gates rest
on a premise nobody had stated and nobody had checked: **that the L3 build is a
statically-hosted web application which will be promoted into the public play
route currently occupied by the prototype.**

That premise is false, and the repository already half-contradicted it. ADR
0016 § Decision has always listed "Stage 2 (trigger: a decision to publish a
native/desktop build): wrap the existing web build with a native shell (e.g.,
Tauri or Electron) and integrate the store SDK." The Wayfinder did not cite it.

The likely proximate cause is a sentence every agent auto-loads:
`AGENTS.md` § Verification opens "This is currently a static HTML/CSS/JavaScript
app." True of the reference prototype; false as a description of what L3 is
being built to become. A statement of the present tense was read as a statement
of the architecture.

The Firebase surface reinforced the confusion. `firebase.json` deploys a static
directory and `scripts/build-hosting.js` copies `index.html`, `game.html`,
`css`, `js`, and `assets` into it, so the deployed artifact does today contain
a playable prototype alongside the landing page. That is a marketing surface
carrying a demo — not the game's shipping channel.

Separately, the audit found an inversion it could not explain from inside the
Wayfinder's own frame: the eight sealed slice-2 war modules
(`js/battle.js`, `fatigue.js`, `movement.js`, `field-army.js`, `commit.js`,
`board-verbs.js`, `bot-exit.js`, `window-read.js`) are loaded by nothing —
`game.html` loads seventeen classic scripts and none of them. The population
*with* a comparison route runs superseded behavior (`js/combat.js`); the
population *with* accepted behavior has no comparison route at all. The
inversion dissolves once `js/` is named for what it is: **reference, not a
migration source.**

## Decision

### 1. Two isolated environments

**The marketing landing page and the game runtime are separate environments and
do not share a deployment, a build, or a runtime contract.**

- **Firebase Hosting is the marketing landing surface only.** Its job is to
  present the product and, once a native build exists, to carry download
  integration. It is not the game's shipping channel and its stability is not a
  constraint on game architecture.
- **The L3 game runtime does not ship as a statically-hosted web page.** A
  browser is a development and playtest host; it is not the distribution target.
- **The intended distribution target is a native shell** (Electron or Tauri —
  the specific choice stays deferred per ADR 0016, which reserves it to its own
  trigger point).
- **Isolation is deliberate and complete.** Landing assets, hosting config, and
  the deployment pipeline are not inputs to the game build, and the game build
  is not an input to them.

### 2. The reference archive

**`js/`, `tests/`, the L2 harnesses (`mockup/combat-calc/`,
`mockup/operational-layer/`), and the existing mockups are a reference archive.**

- They are consulted as evidence — sealed behavior, fixtures, executable models,
  measurement harnesses, and craft precedent.
- They are **not** the source tree the L3 build grows out of, and they are not a
  parity comparator for behavior they never ran.
- Accepted behavior reaches L3 by being **re-implemented from its authoritative
  contract** (its feature GLOSSARY/RULINGS/model docs), with the archive used to
  verify the result. This is ADR 0040 D4's "port when a vertical slice crosses
  the seam," with the source of truth named explicitly: the contract, not the
  file.
- The archive is not deleted, and its retirement is not a precondition for L3.
  It stops being *load-bearing*; it does not stop being *useful*.

### 3. The L3 build occupies its own space

**Canonical L3 source lives in a directory tree separate from the reference
archive**, so that reference code and production code are never confused by
proximity, and so the archive can be frozen without touching the build.

The exact boundary — the directory name, the package layout, and the module/test
topology inside it — is **not decided here**. It is the subject of Wayfinder
gate 05 (`.scratch/l3-playable-seam/issues/05-choose-build-and-test-topology.md`),
which is now freed of the static-hosting constraints that shaped its option
space.

## Consequences

### What this unblocks

- **Gate 05 gets simpler, not harder.** The public-route question (Vite `base`,
  SPA mount shape, the `/game` route created by `firebase.json`'s `cleanUrls`)
  is **moot for the game**: the game is not web-routed in production. The audit's
  criticism that gate 05 "dropped the route/mount question" is withdrawn — it
  was correctly out of scope.
- **Rollback stops being a hosting problem.** Restoring a previously verified
  static artifact is the landing page's concern, not the game's.

### What this invalidates — amendments owed

Wayfinder gate 01 (resolved 2026-07-16) chose a "parallel-strangler" topology.
Its shape survives in spirit — build beside, do not convert in place — but three
of its constraints are void or must be re-scoped, and the *name* no longer fits:
a strangler pattern gradually assumes the old system's traffic, and the
reference archive has no traffic to assume.

- **C01.5** (L3 assumes the public `game.html` role so the landing-page contract
  stays stable) — **void.** L3 never takes that role; the landing-page contract
  is a separate environment.
- **C01.6** (rollback = restore a previously verified static-hosting artifact) —
  **void as stated.** Wrong axis for a native-shell target.
- **C01.2 / C01.4** (preserve the legacy route as the bounded comparator;
  exercise both against equivalent fixtures and seeds) — **re-scope.** The
  comparator holds no sealed war model, and the legacy path's 38 unseeded
  `Math.random()` sites make equivalent-seed parity unreachable without modifying
  the very artifact the constraint preserves. Parity against the archive is
  available only where the archive actually ran the behavior.
- **Wayfinder gate 11** (cutover and legacy retirement) — **re-frame.** Route
  promotion and hosting rollback were most of its content. What survives is the
  archive-freeze question, which §2 largely answers.
- **The umbrella spec's "Static hosting" decision and user story 48** — void as
  written; the spec's Out-of-Scope line "Desktop or native packaging" is now the
  *deferred implementation*, not a rejected direction.

### What this sharpens

- **The audit-lint code contract breaks by design, not by accident.**
  `scripts/audit-lint.js` builds its source map from a flat, non-recursive
  `readdirSync(root/js)` filtered to `.js`, and `checkCodeContract` resolves only
  `jsFiles[ref] || jsFiles['js/' + ref]`. All 27 sealed terms carrying a code
  contract point into `js/*.js` — i.e. into what this ADR names an archive.
  Every such contract will either anchor to archived code or report
  `code-contract-violation` once its term's behavior lives in the new space, and
  `npm run lint:docs` is both a ritual duty (documentation-law § session-close 7)
  and a PostToolUse hook. The lint must learn the new space, and each term's
  `codeRefs` must be re-pointed as its behavior graduates. Registered in
  `docs/SYNC-DEBT.md`.
- **"Position as product" and the R14 work are untouched.** This ADR moves no
  game mechanic. It relocates the build and names the archive.

### Costs accepted

- **A native shell is now a stated destination, not a hypothesis.** The specific
  shell, its store integration, and its packaging remain deferred (ADR 0016
  Stage 2's own trigger), but planning may assume the destination exists.
- **The browser stops being the delivery contract and stays the playtest host.**
  L3 acceptance still runs in a real browser; that is a verification decision
  (Wayfinder gate 10), not a distribution one.
- **Two build outputs, permanently.** The landing page and the game are built and
  deployed by different pipelines. That is the isolation, working as intended —
  not duplication to be collapsed later.
