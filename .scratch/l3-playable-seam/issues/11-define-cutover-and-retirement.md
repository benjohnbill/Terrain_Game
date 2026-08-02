---
type: grilling
status: resolved
blocked_by: [01, 05, 10]
---

# Define Cutover and Legacy Retirement

> **Migrated to front matter 2026-08-03** (ticket 14 R3). The old
> header lines carried prose that the schema moves off the status line:
>
> - **status was:** **resolved — SEALED 2026-08-02 (user); see § Resolution**
> - **blocked-by line was:** 01, 05, 10 — all resolved (10 sealed 2026-08-02, which is what unblocked this gate; the blocker line then sat stale for hours until an audit read it, recorded as case 8 in `docs/audits/2026-08-02-doc-index-proposal-cross-review.md`)

## Question

When does the new L3 app become the canonical play route, how are hosting and
rollback handled during promotion, and what evidence permits deletion or
archival of `game.html`, global-script orchestration, compatibility adapters,
and superseded tests without losing a working comparison surface too early?

## Decision constraints

- Gate 01 already selected a parallel strangler: legacy remains independently
  runnable during migration, L3 assumes the stable public play-path role only
  after named gates, rollback restores a previously verified static artifact,
  and two permanent public implementations are forbidden.
- Static hosting currently deploys `dist/` with clean URLs and no application
  server (`firebase.json:1-12`). Promotion cannot depend on server state or a
  long-lived runtime feature flag.
- TypeScript adoption alone is not retirement evidence. A legacy behavior is
  retained only if classified and selected; a legacy path is retired only after
  its L3 replacement passes the verification gate.
- Git history is historical preservation. Keeping executable legacy source in
  the public artifact solely as an archive creates a second maintenance surface.

## Cutover states to decide

1. **Migration:** legacy owns the stable public play route; L3 is reachable only
   through its preview path. Both are assembled independently.
2. **Promotion candidate:** L3 has passed gate 10 against a versioned hosting
   artifact; the previous public artifact has a checksum/build identity and a
   documented restore command.
3. **Promoted window:** L3 owns the stable route. Legacy is non-default and
   unlinked, retained only for a bounded comparison/rollback window.
4. **Retired:** the public artifact contains one play implementation; obsolete
   adapters and tests have been removed only after dependency and replacement
   evidence passes.

## Evidence-based option space

### A. One bounded post-promotion verification window

Promote L3 after the complete gate 10 stack. Retain an unlinked legacy route for
one explicitly defined window, exercise the deployed L3 path and a rollback
restore drill, then remove the legacy route from hosting and active source.
Preserve only selected fixtures/contracts plus git history.

- **Strength:** provides real rollback evidence without normalizing permanent
  dual runtimes.
- **Cost:** requires one temporary duplicate hosting payload and a scheduled
  cleanup ticket that cannot be skipped.

### B. Immediate retirement at promotion

- **Strength:** no duplicate post-cutover artifact.
- **Cost:** the first production-only failure can be rolled back only if the
  artifact restore procedure was already proven; it also discards the final
  live comparison moment.

### C. Keep the legacy route indefinitely as an archive

- **Strength:** always-available historical comparison.
- **Cost:** violates gate 01's accepted end state and leaves two browser
  applications exposed to dependency, security, and documentation drift.

## Recommended promotion and retirement evidence

Choose A and define the bounded window as **one successful deployed acceptance
cycle**, not an indefinite date:

- deploy the gate-10-passing L3 artifact to the stable route;
- complete the production smoke scenario and one human match on that deployed
  artifact;
- restore the previous checksummed artifact once, verify its legacy route, then
  redeploy the L3 artifact;
- close every severity-blocking regression found in that cycle;
- confirm the final assembler can omit legacy without changing L3 output;
- search canonical UI, Runtime, renderer, tests, and build scripts for imports,
  HTML references, globals, copied directories, and adapter consumers;
- delete active legacy source and superseded tests only where replacement
  coverage exists; preserve deliberately selected fixtures and the decision
  record, relying on git history for the rest;
- rerun the full automated gate and deployed smoke after retirement.

The honest cost is an extra deploy/restore/redeploy cycle and temporary unlinked
legacy payload. It is finite evidence, not a second product. This recommendation
does not resolve the gate; the user must confirm the window, severity threshold,
archive policy, and stable public route.

## Resolution — SEALED 2026-08-02 · L1 (user)

**The cutover half is dissolved; the retirement half was real, and belonged to a
different environment than this gate assumed.** Option A above is not chosen — it
is moot.

### The cutover half: there is no route to hand over

Every question about promotion presumes the L3 game eventually occupies "the
stable public play route". **ADR 0041 removed that premise**: the game does not
ship as a statically-hosted web page, and a browser is a development and playtest
host rather than the distribution target. So there is no promotion event, no
rollback drill on a public artifact, no promoted window, and no cutover. Cutover
states 1–4 and the deploy→restore→redeploy cycle all describe something that will
not happen.

Gate 01's parallel strangler goes the same way, for the reason **gate 09** closed
on earlier the same day: there is no migration, so there is nothing to strangle.

### The retirement half was real, and it was not the game's problem

The gate asks what evidence permits removing `game.html`, legacy orchestration,
and adapters "without losing a working comparison surface too early". Two of
those turned out to be empty and one turned out to be live:

- **Adapters: none exist.** Gate 09 measured zero archive imports in `game/src`
  and `game/tests` after nine landed tickets.
- **Deletion: not owed.** ADR 0041 — *"The archive is not deleted, and its
  retirement is not a precondition for L3. It stops being load-bearing; it does
  not stop being useful."*
- **But the archive was being published.** Measured at closure:
  `scripts/build-hosting.js` copied `game.html` and the whole `js/` directory
  into the Firebase bundle, and `index.html:186` embeds `game.html` in an
  iframe labelled "strategy-ground · development build".

That last one is a **marketing-environment** question, not a build-architecture
one — which is exactly what ADR 0041's isolation implies, and what nobody had
carried across. It is also sharper than "an old build is up": the prototype is
the multi-faction conquest design that **ADR 0042 retired**, so the public
artifact was demonstrating a game this project no longer builds.

### What was ruled and done

**User ruling: take it down** (2026-08-02). Executed in the narrow half only,
because the broad half edits a rendered product surface:

- **Done.** `scripts/build-hosting.js` no longer copies `js/` wholesale. Exactly
  one of its 26 files, `landing.js`, is loaded by anything the bundle serves
  (`index.html:30`); the other **25 are prototype modules that shipped publicly
  with no loader at all** — `game.html` loads its own code from `assets/game/`.
  The bundle went from carrying them to 15 files, with every asset `index.html`
  and `game.html` require verified present. **No rendered output changed.**
- **Deferred, and registered.** Removing the `game.html` iframe from the landing
  is a visible product change whose surrounding copy may assume the demo. It
  needs someone who can see the page. Until then `AGENTS.md`'s "Firebase Hosting
  serves the landing page only" remains **inaccurate** — the landing still embeds
  a playable prototype. Recorded in `docs/SYNC-DEBT.md`.

**What this does not do:** retire, delete, or archive anything. The reference
archive stays in the repo and still runs under a local static server (`AGENTS.md`
§ Verification). Only its *publication* stopped.

Status **AGREED** (**SEALED** — dated, user's verdict as source), validation
**L1** (exhaustive reference check across every shipped surface, plus a rebuild
verifying no required asset was lost; not a deployed smoke test). **This closes
the last open Wayfinder gate** — 01–11 are resolved and only gate 12's
publication remains, whose (a) half is blocked on
`.scratch/doc-structure/issues/10-audit-run-3.md`.
