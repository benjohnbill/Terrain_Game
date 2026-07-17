# Preserve or Replace the Legacy Play Path?

Type: grilling
Status: resolved
Blocked by: none

## Question

Should the React + TypeScript L3 app be built beside the current playable
`game.html` until vertical-slice parity, or should the current play path be
converted in place? Define the rollback, comparison, routing, and promotion
obligations created by the choice.

## Answer

> **AMENDED 2026-07-17 by ADR 0041** (environment isolation). The user's
> correction — Firebase hosts the *marketing landing only*, the L3 game does not
> ship as a statically-hosted web page, its destination is a native shell, and
> `js/`/`tests/`/the L2 harnesses are a *reference archive* rather than a
> migration source — voids or re-scopes four of the bullets below. This answer's
> **shape survives** (build beside, do not convert in place, no shared state
> ownership); its **deployment premises do not**, and the name no longer fits: a
> strangler gradually assumes the old system's traffic, and a reference archive
> has no traffic to assume. Do not read the struck bullets as current. Full
> record: `docs/adr/0041-environment-isolation-and-reference-archive.md`;
> evidence: `../audit/SYNTHESIS.md` Finding A.
>
> - **VOID** — "let the accepted L3 build assume the public `game.html` role so
>   the external landing-page contract remains stable" (C01.5). L3 never takes
>   that role; the landing page is a separate environment. The bullet was also
>   written against the working tree: `game.html` is not in HEAD, and firebase's
>   `cleanUrls` makes the route `/game`, not a filename.
> - **VOID as stated** — "roll back by restoring a previously verified
>   static-hosting artifact" (C01.6). Wrong axis for a native-shell target;
>   static rollback is the landing page's concern.
> - **RE-SCOPE** — "preserve the current public `game.html` play path as the
>   legacy comparison route" and "exercise both against equivalent fixtures and
>   seeds" (C01.2/C01.4). The route loads **none** of the eight sealed slice-2
>   war modules and resolves war through `js/combat.js`, which the umbrella spec
>   already declares ineligible; and its 38 unseeded `Math.random()` sites make
>   equivalent-seed parity unreachable without modifying the artifact the bullet
>   preserves. Parity against the archive is available only where the archive
>   actually ran the behavior.
> - **CORRECTED** — retirement is **not** a data-loss operation (C01.7). An
>   auditor inferred it was, because `game.html` was never committed; the file is
>   byte-for-byte `HEAD:index.html`, so its content is in history throughout.

Use a parallel-strangler topology.

- Preserve the current public `game.html` play path as the legacy comparison
  route until the canonical L3 path passes its named parity and cutover gates.
- Build the React + Vite + TypeScript/TSX L3 application beside that route. Do
  not convert the existing route in place and do not let the two paths share
  authoritative state ownership.
- Keep an explicit comparison path during migration so the legacy and L3
  builds can be exercised independently against equivalent fixtures and seeds.
- At promotion, let the accepted L3 build assume the public `game.html` role so
  the external landing-page contract remains stable.
- Roll back by restoring a previously verified static-hosting artifact, not by
  maintaining a permanent dual-runtime feature flag.
- After promotion, retain a non-default legacy comparison route only for a
  bounded rollback window named by the cutover specification. Remove that
  route and its temporary adapters when the retirement gate passes; two
  permanent playable implementations are not an accepted end state.

Rejected alternatives:

- **Convert `game.html` in place.** This destroys the stable comparison surface
  while the Slice 1–2 behavior is still crossing into the new runtime and makes
  rollback depend on mixed intermediate code.
- **Keep both playable paths indefinitely.** This creates two competing
  canonical implementations and turns migration scaffolding into permanent
  architecture.

Decision source: user agreement, 2026-07-16 ("응, 나도 동의.").
