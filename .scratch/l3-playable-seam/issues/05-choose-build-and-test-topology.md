# Choose the Build, Module, and Test Topology

Type: grilling
Status: open
Blocked by: 01, 02, 04

## Question

Given the migration topology, Game Runtime interface, and verified toolchain
constraints, where should the Vite app and runtime modules live, how should
ESM and legacy CommonJS coexist, and which exact build, typecheck, unit-test,
browser-test, and hosting commands constitute the supported developer path?

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
