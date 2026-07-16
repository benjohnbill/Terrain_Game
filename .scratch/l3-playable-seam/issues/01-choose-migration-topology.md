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
