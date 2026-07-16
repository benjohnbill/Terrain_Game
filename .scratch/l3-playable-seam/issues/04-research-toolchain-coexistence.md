# Verify Vite, TypeScript, ESM, and Legacy CommonJS Coexistence

Type: research
Status: resolved
Blocked by: none

## Question

Using the live repository and current official primary documentation, what
supported build and test arrangements allow a Vite React-TypeScript entry and
framework-free ESM Game Runtime to coexist incrementally with the root
CommonJS package, classic-script `game.html`, Node tests, Firebase static
hosting build, and emitted-JavaScript parity checks? Record constraints and
failure modes without choosing the project policy.

## Answer

The supported arrangements and official-source constraints are recorded in
[Toolchain Coexistence Research](../research/toolchain-coexistence.md).

The root CommonJS package can remain intact while a nested or explicitly rooted
Vite React-TS app runs beside it. Runtime `.js` needs a nearer
`"type": "module"` package boundary, or the runtime can use `.mjs`/an ESM
bundle. Vite transpilation requires a separate TypeScript check; the current
CommonJS Node tests can dynamically import emitted ESM; unchanged legacy files
can be copied through Vite public assets or a separate assembly stage; and
Firebase can deploy the combined static directory. The build must have one
owner for cleaning/assembling `dist`, and exact browser/Node parity requires
both hosts to execute the same emitted ESM over their real loaders. The report
leaves all topology and policy choices open, including the current ADR/map
TypeScript-source mismatch.

## Comments

- The reported Record/Working mismatch was resolved upward by ADR 0040 on
  2026-07-16: canonical L3 source is TypeScript/TSX while browser and Node
  execute emitted ESM JavaScript. The report's technical coexistence findings
  remain unchanged.
