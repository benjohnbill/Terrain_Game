# 01 — Establish the L3 Tree and Boot a Deterministic Viewer

**What to build:** Create the canonical `game/` TypeScript/ESM tree beside the
CommonJS root and the reference archive, stand up the `:game` command surface,
and make a React viewer boot a framework-free Game Runtime from an authored-world
identity and seed. A developer opening the dev path sees an initial viewer-safe
projection; the archive `index.html` / `game.html` remain independently runnable
and are not converted.

**Blocked by:** None — the first ticket once its specification gates close.

Status: needs-info

Specification gates: Wayfinder 05, 06, 10, 12.

Contract (interim pointers): gate 05 § Answer D1–D3/D5/D6 (tree layout, marker-only
`game/package.json`, the seven `:game` commands, audit-lint re-aim, single-emit
parity); gate 02 § Answer §6 (the three-method Runtime surface); ADR 0040
(TypeScript/ESM, injected seed and clock); ADR 0041 (environment isolation — the
game is not a hosted web route, the archive is not a build source).

- [ ] `game/src/{runtime,domain,world,projection,preview,bot,renderer,ui}` exists as the single ESM/TypeScript island; `game/package.json` carries only `{"type":"module"}`; the root package stays CommonJS with one root-owned lockfile and `node_modules`.
- [ ] The seven `:game` commands exist by the names gate 05 sealed; root `npm test` and `build:hosting` stay unchanged and root-owned.
- [ ] Every acceptance command whose threshold Wayfinder 10 has not filled fails `pending` rather than reporting green.
- [ ] The Runtime exposes exactly `currentActor`, `view(viewerId)`, and `submit(intent)` — no snapshot API, no subscription API — and privately owns match state.
- [ ] Rule execution reads no DOM, renderer, browser global, wall clock, or ambient entropy; seed and clock are injected.
- [ ] `build:runtime:game` emits one ESM graph that both `test:game` (Node) and `test:browser:game` (Playwright) load — no per-host double transpile.
- [ ] Equal authored-world identity and seed produce equal initial projections in Node and browser.
- [ ] The audit-lint re-aim (gate 05 D5) is executed here: recursive scan over `js/` and `game/src` including `.ts`, `code-contract` still blocking, `game/` added to write-lint `GOVERNED`.
- [ ] The archive play paths still run untouched; no archive module is imported by `game/`.
