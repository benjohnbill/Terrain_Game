# L3 Playable Build — Independent Ticket Execution Runbook

Layer: Working (local issue-tracker operations)
Current state: pre-implementation; all build tickets are `needs-info`

This runbook makes each implementation ticket executable from a fresh session
without treating Working-layer text as game canon. Production documents and
ADRs remain authoritative; ticket files point to them after the Wayfinder closes.

## Hard readiness rule

Do not implement any ticket while its status is `needs-info`.

A ticket becomes `ready-for-agent` only after:

1. every listed Wayfinder gate is `resolved`;
2. gate 12 has published the accepted decision set into Production documents
   and any required ADRs;
3. the ticket's `Specification gates:` line has been replaced by exact
   Production/ADR pointers;
4. every referenced R14-safe war-model prerequisite exists and is named;
5. its acceptance criteria can be verified without inventing a mechanic or
   reading Working-layer recommendations as authority;
6. `npm run lint:docs` passes after the publication batch.

`ready-for-agent` means fully specified. The ticket's `Blocked by:` line still
controls whether it is the next executable frontier.

## Decision closure before implementation

The shortest low-rework sequence is:

1. Wayfinder 03 — viewer knowledge contract;
2. Wayfinder 05 — build/module/test topology;
3. Wayfinder 06 — authored-world input contract;
4. Wayfinder 07 — live map/Fog presentation prototype;
5. Wayfinder 08 — first playable vertical slice;
6. Wayfinder 09 — migration and adapter ladder;
7. Wayfinder 10 — verification and acceptance gates;
8. Wayfinder 11 — cutover and retirement;
9. Wayfinder 12 — Production partition, ADR promotion, and ticket handoff.

Gates 03, 05, and 06 are currently independently unblocked, but the order above
minimizes revisiting presentation and verification. Resolve one non-research
Wayfinder ticket per user decision session. Gate 07 specifically requires a
live prototype and user reaction; it is not an autonomous document-only task.

## Build dependency chain

| Ticket | Player-visible increment | Direct blocker |
|---|---|---|
| 01 | deterministic L3 viewer boots | none after specification publication |
| 02 | authored world can be read and focused | 01 |
| 03 | reconnaissance changes player knowledge | 02 |
| 04 | first accepted atomic war operation resolves | 03 + named R14-safe prerequisite |
| 05 | one human–bot round completes | 04 |
| 06 | one war reaches an accepted outcome | 05 |
| 07 | one complete match ends legally | 06 |
| 08 | verified L3 path becomes canonical | 07 |
| 09 | legacy comparison path retires | 08 + bounded cutover evidence |

One implementation session claims one ticket. Do not combine adjacent tickets
to save setup time: the demoable boundary is also the failure-localization and
review boundary.

## Fresh-session preflight

1. Read the repository `AGENTS.md`, then this runbook and the selected ticket.
2. Read every Production/ADR pointer in the ticket; do not substitute the
   umbrella Working spec for those sources.
3. Confirm the ticket is `ready-for-agent`, every direct blocker is `resolved`,
   and no new `needs-info` comment has been appended.
4. Inspect `git status --short`. Preserve unrelated user work. When the main
   worktree is dirty or another ticket is active, use an isolated Git worktree
   based on the exact accepted commit; `git worktree` is available in this
   repository. Never stash, reset, or absorb unrelated changes.
5. Change only the selected ticket to `Status: claimed` before implementation
   and commit that claim with the ticket work or as a small claim commit.
6. State the ticket's observable success criterion before editing code.

If any preflight condition fails, stop implementation, return the ticket to its
prior status if this session claimed it, and record the exact missing authority
or prerequisite under `## Comments`.

## Implementation loop

1. Add the narrowest failing contract test for Runtime, projection, preview,
   validation, replay, or rule behavior before production logic.
2. For visual-only behavior, make the smallest change and verify it through the
   real browser path and agreed viewport instead of forcing a low-value unit
   test.
3. Keep authoritative state behind the Runtime. React and the renderer consume
   viewer projections; preview consumes only `(view, intent)`; bots are ordinary
   callers.
4. Reimplement accepted behavior from its Production contract. Legacy code,
   fixtures, and tests are evidence only after their behavior is classified.
5. Run the ticket-specific checks first, then the shared gates required by the
   ticket. Do not claim browser behavior from Node tests or type safety from a
   Vite build.
6. Exercise the ticket's player-visible increment. Capture the world revision,
   seed, intent fixture/log, browser path, and viewport when they matter.
7. Review the diff for forbidden scope: new canonical JavaScript, truth fields in
   viewer surfaces, React-owned rules, Runtime sleeps, standalone movement,
   R14 placeholders, unclassified legacy behavior, or duplicated definitions.
8. Append verification evidence and any deliberate follow-up under the ticket's
   `## Comments`, then set `Status: resolved` only when every acceptance item is
   satisfied.
9. Commit only the selected ticket's implementation, tests, and directly owed
   documentation. Leave unrelated worktree changes untouched.

## Verification evidence format

Append this compact record to the ticket:

```md
## Comments

### Implementation evidence — YYYY-MM-DD

- Commit: `<sha>`
- Production authority: `<exact pointers>`
- Narrow tests: `<commands and pass counts>`
- Shared gates: `<commands and results>`
- Browser/runtime check: `<path, viewport, world revision, seed>`
- Legacy evidence disposition: `<accepted / structurally obsolete /
  superseded / incidental; files used>`
- Follow-up: `<none or exact ticket/debt pointer>`
```

Evidence records outcomes; they do not define mechanics or dials.

## Suggested fresh-session invocation

```text
Implement only L3 playable-build ticket NN from
.scratch/l3-playable-build/issues/NN-<slug>.md.

Follow AGENTS.md and .scratch/l3-playable-build/README.md. Verify the ticket is
ready-for-agent and unblocked, claim it, read every Production/ADR pointer, use
an isolated worktree if the current tree is dirty, implement test-first where
the behavior is deterministic, run the ticket and shared verification gates,
record evidence in the ticket, set it resolved only if all criteria pass, and
commit only this ticket's scope. Do not infer unresolved mechanics from legacy
JavaScript or the Working umbrella spec.
```

## Status lifecycle

```text
needs-info
  -> ready-for-agent   # gate 12 publication and audit completed
  -> claimed           # one implementation session owns the ticket
  -> resolved          # acceptance and evidence completed
```

If an implementation discovery reveals a genuine design gap, change the ticket
to `needs-info`, record the question and authoritative conflict, and stop at the
seam. Do not hide a design decision inside code.
