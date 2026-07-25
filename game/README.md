# `game/` — the canonical L3 source tree

This is the game the project is building. It is **not** the reference prototype
at the repository root (`index.html` + `js/`), which is an archive consulted as
evidence and never imported from here (ADR 0041).

## Boundaries this tree must keep

| Rule | Where it was sealed |
|---|---|
| Own ESM/TypeScript island beside the CommonJS root; built beside, never converted in place | Wayfinder gate 05 D1 |
| `package.json` here carries **only** `{"type":"module"}` — the root owns dependencies, the lockfile, `node_modules`, and every script | gate 05 D2 |
| The Runtime exposes exactly `currentActor`, `view(viewerId)`, `submit(intent)`; no snapshot API, no subscription API | gate 02 § 6 |
| Rules read no DOM, renderer, browser global, wall clock, or ambient entropy — seed and clock are injected | ADR 0040, gate 02 § 6 |
| One emitted ESM graph; Node and browser acceptance both load *that* artifact, never a per-host re-transpile | gate 05 D6 |
| No archive module is imported here | ADR 0041 |

## Layout

```
src/runtime/      the state-owning shell and its three-method surface
src/domain/       rules — pure, deterministic, no I/O
src/world/        the authored world artifact and its loader   (ticket 02)
src/projection/   the single blur seam: truth -> viewer-safe MatchView
src/preview/      pure preview(view, intent), used by the UI and by bots alike
src/bot/          decideBotIntent(view, seed), submitted through the same door
src/renderer/     draws a projection; consumes viewer-safe data only
src/ui/           the React viewer shell
acceptance/       the threshold registry and the `pending` mechanism
tests/            Node contract tests, loading the emitted artifact
tests/browser/    Playwright tests, loading the same emitted artifact
```

## Commands

All seven live in the **root** `package.json` (gate 05 D3) and run from the
repository root:

| Command | What it does |
|---|---|
| `npm run dev:game` | Vite dev server with HMR, on source |
| `npm run typecheck:game` | `tsc --noEmit` |
| `npm run build:runtime:game` | emits the single ESM runtime graph to `game/dist/` |
| `npm run test:game` | Node contract tests against the emitted artifact |
| `npm run test:browser:game` | Playwright tests against the same emitted artifact |
| `npm run build:game` | production bundle of the viewer |
| `npm run verify:game` | typecheck + build + both test lanes + parity |

`dev:game` runs HMR on source while acceptance always runs the emitted
artifact — a cost gate 05 D6 named and accepted.

## Thresholds that are deliberately not green

Wayfinder gate 10 owns every acceptance threshold and is still open. An
acceptance check whose threshold is unfilled reports **PENDING** and exits
non-zero, so a deferred gate can never masquerade as a pass. See
`acceptance/thresholds.js`.
