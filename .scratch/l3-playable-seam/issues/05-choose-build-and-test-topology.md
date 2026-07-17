# Choose the Build, Module, and Test Topology

Type: grilling
Status: resolved
Blocked by: 01, 02, 04

## Question

Given the migration topology, Game Runtime interface, and verified toolchain
constraints, where should the Vite app and runtime modules live, how should
ESM and legacy CommonJS coexist, and which exact build, typecheck, unit-test,
browser-test, and hosting commands constitute the supported developer path?

## Answer

Adopt the nested ESM/TypeScript island beside the CommonJS root (option A), with
one root-owned dependency tree, a full command surface whose thresholds belong to
gate 10, and a single-emit parity contract.

**D1 — Directory boundary (option A).** New canonical L3 source lives in its own
`game/` tree beside the archive `js/` and the CommonJS root, built beside rather
than converted in place; the root `package.json` stays CommonJS. Tree name
`game/` is role-based, not the `l3` codename; source is organized as
`game/src/{runtime,domain,world,projection,preview,bot,renderer,ui}`.

**D2 — ESM/CommonJS boundary (marker-only).** `game/package.json` carries only
`{"type":"module"}`; dependency installation, the lockfile, and orchestration
scripts stay single-owned by the root package. React, Vite, TypeScript, and
Playwright install as root devDependencies in one root `node_modules`; tooling
under `game/` resolves them by Node's upward lookup. No npm workspace and no
second lockfile.

**D3 — Command surface and ownership.** Seven new `:game` commands form the
supported developer path — `dev:game`, `typecheck:game`, `build:runtime:game`,
`test:game`, `test:browser:game`, `build:game`, and `verify:game`; the root
`npm test` (legacy CommonJS regression) and `build:hosting` (single `dist`
assembler) stay root-owned and unchanged. Runners: `node:test` for
runtime/contract tests and `@playwright/test` for the browser lane; no second
unit-test framework is introduced. Ownership boundary: gate 05 owns command
existence, names, and structure, while gate 10 owns each acceptance command's
pass/fail threshold. Safety valve: an acceptance command fails `pending` until
its threshold is filled, so a deferred gate cannot masquerade as green. The full
surface is specified now; implementation is deferred to the build tickets.

**D5 — audit-lint re-aim.** (1) Widen the scanner to a recursive scan over both
`js/` and `game/src` (existing roots only) including `.ts`, so a graduated term's
`codeRefs` resolve in the new tree. (2) A term's `codeRefs` move to the new tree
when its behavior is re-implemented and parity-verified there; until then they
stay on `js/`. (3) `code-contract` stays blocking — the fix is the scanner's
field of view, not its strictness. (4) Add `game/` to write-lint's `GOVERNED`
regex so ports receive code-contract feedback. Execution is owned by the first
port build ticket; gate 05 seals the contract and the SYNC-DEBT row records it.

**D6 — exact-artifact parity.** The Runtime is a single emitted ESM graph:
`build:runtime:game` emits it once, and both `test:game` (Node dynamic import)
and `test:browser:game` (Playwright) load that same emitted artifact, with no
per-host double transpile. `verify:game` includes a both-hosts parity test (same
deterministic inputs yield the same events and final state). The parity pass
threshold (bit-exact versus epsilon) is gate 10's to own. Noted cost: `dev:game`
runs Vite HMR on source while acceptance runs the emitted artifact, and
acceptance is always judged on the emitted artifact.

Rejected alternatives:

- **Root-scoped Vite with an `.mjs`/bundle-only runtime (option B).** Output
  extension and bundling policy would leak into every runtime test path, and a
  bundle makes contract tests less direct than an emitted module graph.
- **Convert the root package to ESM (option C).** Creates unrelated conversion
  work and removes the stable legacy test baseline during the strangler period;
  the completed toolchain research found it unnecessary.
- **A second unit-test framework (Vitest/Jest) because React is present.** No net
  benefit while gate 02 keeps the view thin and the logic pure; revisit only if
  the React view later grows heavy interaction state.

Scope note: the public-route question (Vite `base`, SPA mount, the `/game` route
from firebase `cleanUrls`) is out of scope — ADR 0041 makes the game
non-web-routed in production. This gate seals build topology only; no domain term
is sealed here, and term registration remains gate 12's.

Decision source: user grill 2026-07-18 (D1 "A로 가자"; D2 "(i)로 가자"; D3 "응, 그
경계로 가자" plus full-surface and runner confirmation; D5 "OK"; D6 "D6 확정할게").

## Decision constraints

- The repository root is explicitly CommonJS and the retained suite is selected
  by `node --test tests/*.test.js` (`package.json:5-12`). Flipping the root to
  ESM would reinterpret working tests and scripts for no L3 benefit.
- Canonical L3 UI and Runtime source is TypeScript/TSX, while browser and Node
  execute emitted ESM JavaScript (ADR 0040).
- Vite transpilation is not a typecheck. A separate `tsc --noEmit` gate and an
  emitted Runtime artifact are required
  (`.scratch/l3-playable-seam/research/toolchain-coexistence.md:96-109`).
- The current hosting builder deletes `dist/` before copying static content
  (`scripts/build-hosting.js:4-20`). Vite and that script cannot both clean or
  assemble the same directory; one final assembly owner is mandatory.
- Root CommonJS tests can dynamically import emitted ESM. Exact browser/Node
  artifact parity is stronger than merely transforming the same source twice
  (`.scratch/l3-playable-seam/research/toolchain-coexistence.md:147-172`).

## Evidence-based option space

### A. Nested `l3/` ESM boundary with root-owned commands

Place the Vite HTML/config, TS configs, and all new source beneath `l3/`, with a
minimal nearest `l3/package.json` declaring `"type": "module"`. Keep dependency
installation, the lockfile, orchestration scripts, and canonical commands in
the root package. Organize source by responsibility, for example
`l3/src/runtime`, `l3/src/domain`, `l3/src/world`, `l3/src/projection`,
`l3/src/preview`, `l3/src/bot`, `l3/src/renderer`, and `l3/src/ui`.

- **Strength:** establishes one explicit ESM/TypeScript island without touching
  the legacy CommonJS package semantics; ordinary emitted `.js` remains ESM
  under the nearest package boundary.
- **Cost:** adds a visible package boundary and requires scripts to keep Vite,
  TypeScript, emitted-runtime, and final-hosting directories distinct.

### B. Root-scoped Vite config plus `.mjs` or one Runtime bundle

Keep all package semantics at the root and give only emitted Runtime artifacts
an `.mjs` identity or a Vite library bundle.

- **Strength:** fewer directory-level package declarations.
- **Cost:** output-extension and bundling policy becomes part of every Runtime
  test path, and a bundle can make contract tests less direct than an emitted
  module graph.

### C. Convert the root package to ESM and migrate the test/tooling surface

- **Strength:** one module mode after a repository-wide migration.
- **Cost:** creates unrelated conversion work, removes the stable legacy test
  baseline during the strangler period, and is unnecessary according to the
  completed toolchain research. This is not recommended for L3.

## Candidate supported command surface

The chosen topology should expose one root command for each distinct claim:

| Candidate command | Claim |
|---|---|
| `npm run dev:l3` | run only the Vite development path |
| `npm run typecheck:l3` | typecheck UI and Runtime without relying on Vite |
| `npm run build:runtime:l3` | emit the portable ESM Runtime graph |
| `npm run test:l3` | test the emitted Runtime and pure modules in Node |
| `npm test` | preserve the retained CommonJS regression suite |
| `npm run test:browser:l3` | exercise real browser loading and interaction |
| `npm run build:l3` | produce the Vite app intermediate artifact |
| `npm run build:hosting` | exclusively clean and assemble final `dist/` |
| `npm run verify:l3` | compose all non-human L3 acceptance checks |

The browser runner is also a decision. The narrow recommendation is to retain
`node:test` for Runtime/contract tests and introduce Playwright only for real
browser acceptance; adding a second unit-test framework is not required merely
because React is present.

## Recommendation

Choose A. Keep the root CommonJS package and lockfile, create `l3/` as the
single ESM/TypeScript source boundary, test the Runtime's emitted module graph
with the existing Node runner, and use Playwright for the minimum real-browser
lane. Let Vite write an intermediate app directory and let one root hosting
assembler exclusively clean and construct `dist/`.

The honest cost is a small amount of orchestration and one nested module
boundary. It buys explicit ownership of every artifact and avoids converting
471 retained tests before they have replacement coverage. This recommendation
does not resolve the gate; the user must confirm the directory boundary,
command names, browser runner, and exact-artifact parity requirement.
