# Define Cutover and Legacy Retirement

Type: grilling
Status: open
Blocked by: 01, 05, 10

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
