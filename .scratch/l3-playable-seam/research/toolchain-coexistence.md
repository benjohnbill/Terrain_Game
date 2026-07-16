# Toolchain Coexistence Research

Research date: 2026-07-16

## Result

The requested pieces can coexist incrementally. The supported arrangements all
depend on keeping three boundaries explicit: the Vite project root, Node's ESM
package boundary, and the directory that exclusively assembles the Firebase
artifact. This report records the available arrangements and their constraints;
it does not select the project topology.

## Live repository baseline

- The root [`package.json`](../../../package.json) is explicitly
  `"type": "commonjs"`; its tests are CommonJS files selected by
  `node --test tests/*.test.js`. The live command passed 466/466 tests during
  this research.
- [`game.html`](../../../game.html) loads 17 ordered classic scripts. A browser
  determines classic versus module semantics from the `script` element, not
  from Node's `package.json`, so this page can remain classic while a separate
  HTML entry uses `type="module"` ([WHATWG HTML `script`](https://html.spec.whatwg.org/multipage/scripting.html#the-script-element)).
- [`scripts/build-hosting.js`](../../../scripts/build-hosting.js) deletes
  `dist/` and then copies the landing page, `game.html`, and static directories.
  [`firebase.json`](../../../firebase.json) deploys that `dist/` directory and
  currently has no SPA rewrite.
- ADRs [0016](../../../docs/adr/0016-web-stack-with-trigger-based-migration.md),
  [0028](../../../docs/adr/0028-l3-buildout-stack-direction.md), and
  [0039](../../../docs/adr/0039-react-vite-ui-and-javascript-game-runtime.md)
  preserve Node/browser portability and incremental migration. ADR 0039
  currently specifies a JavaScript-source Game Runtime and explicitly does not
  adopt TypeScript; the Wayfinder map says TypeScript/TSX is already adopted.
  That record mismatch is a policy/document-sync matter, not something this
  technical research resolves.

## Supported coexistence arrangements

### 1. Keep the root CommonJS package

Vite can run from a nested app root, and its config may use ESM syntax even
when the surrounding project is not native Node ESM. It also supports an
explicit alternative root and config file. Therefore neither a React-TS entry
nor `vite.config.ts` requires flipping the root package to `"type": "module"`
([Vite project root](https://vite.dev/guide/#index-html-and-project-root),
[Vite config loading](https://vite.dev/config/#config-file)). Current Vite also
ships an official `react-ts` template and requires Node 20.19+ or 22.12+; the
live Node 26.1.0 runtime is above that floor
([Vite getting started](https://vite.dev/guide/#scaffolding-your-first-vite-project)).

Two app placements are supported without changing root semantics:

- a nested Vite root with its own HTML/config and, if useful, its own nearest
  `package.json`; or
- a root-level Vite config whose `root` points at the React app.

If native config loading or an ESM-only config dependency exposes a CommonJS
load error, Vite's official remedies are a nearer `"type": "module"` boundary
or a `vite.config.mts`/`.mjs` config
([Vite ESM-only troubleshooting](https://vite.dev/guide/troubleshooting.html#this-package-is-esm-only)).

### 2. Give emitted runtime JavaScript an explicit ESM identity

Under Node, `.js` follows the nearest parent `package.json`; `.mjs` is always
ESM and `.cjs` is always CommonJS. A nested `package.json` with
`"type": "module"` can therefore scope ESM runtime files without changing the
root or the legacy tests. A `.mjs` runtime output is the other direct option
([Node package/module rules](https://nodejs.org/api/packages.html#determining-module-system)).

This yields three technically supported runtime shapes:

1. Author ESM JavaScript beneath a nested `"type": "module"` package and keep
   conventional `.js` filenames.
2. Use `.mjs` for runtime entry/output files inside the CommonJS package.
3. Emit an ESM bundle. Vite library mode supports ESM output and, when the
   package is not `"type": "module"`, uses `.mjs` for Node compatibility
   ([Vite library mode and extensions](https://vite.dev/guide/build.html#library-mode)).

If only the React UI is TypeScript, the runtime may remain authored ESM
JavaScript under either boundary above. If runtime source is also TypeScript,
TypeScript's `node16`/`node18`/`nodenext` modes follow the same nearest-package
rule: ordinary `.ts` emits ESM when it is in a module package, while `.mts`
emits `.mjs`
([TypeScript module-format detection](https://www.typescriptlang.org/docs/handbook/modules/reference.html#module-format-detection)).
That second case is technically supported but requires the separate policy
authority noted in the baseline.

For an unbundled graph shared directly by browsers and Node, relative imports
must include the emitted extension, for example `./rules.js`. Node requires
extensions and says this matches browser behavior
([Node mandatory file extensions](https://nodejs.org/api/esm.html#mandatory-file-extensions)).
Vite-only aliases, extensionless imports accepted only by a bundler, Node
built-ins, `process`, DOM/browser globals, and `import.meta.env` would prevent
the same emitted graph from being a portable runtime unless an explicit adapter
or bundling step removes that dependency.

### 3. Separate transpilation, type checking, and runtime emission

Vite accepts TypeScript but only transpiles it; it does not type-check. Its
official production guidance is to run `tsc --noEmit` in addition to the Vite
build ([Vite TypeScript](https://vite.dev/guide/features.html#typescript)).
Consequently, supported pipelines have distinct checks:

- a UI typecheck (`tsc --noEmit`) plus the Vite application build; and
- when the runtime is TypeScript, a runtime-specific `tsc` emit or an explicit
  runtime bundle, followed by tests of that JavaScript output.

Using only `vite build` is not a type-safety gate. Conversely, a no-emit
typecheck does not create the JavaScript artifact needed for emitted-output
parity.

### 4. Preserve or process the legacy page deliberately

Vite offers all of the following; they have different preservation properties:

- Files in `publicDir` are served at `/` in development and copied to the root
  of the output unchanged. This supports an unchanged legacy `game.html` plus
  its classic JS/CSS tree
  ([Vite `publicDir`](https://vite.dev/config/shared-options.html#publicdir)).
- A separate assembly step can merge unchanged legacy files and a Vite output
  directory into one Firebase staging directory.
- Vite supports multiple HTML build entries. This is appropriate only if Vite
  is allowed to process both pages; it is not a byte-preservation guarantee
  ([Vite multi-page apps](https://vite.dev/guide/build.html#multi-page-app)).

The current builder and Vite must not independently own cleanup of the same
`dist/`. The current builder always removes it, while Vite empties an in-root
`outDir` by default. Running either destructive step second would erase the
other output. Supported composition therefore needs one cleanup/assembly owner,
separate intermediate outputs, or deliberately configured `emptyOutDir`
behavior ([Vite build output options](https://vite.dev/config/build-options.html#build-emptyoutdir)).
The existing `assets/` name also overlaps Vite's default generated asset
directory, so a merge must define collision ownership rather than relying on
copy order.

Firebase Hosting is agnostic to which tool created the files: its required
`public` field may point at any existing project directory
([Firebase deploy directory](https://firebase.google.com/docs/hosting/full-config#specify-which-files-to-deploy)).
A Vite build plus an assembled legacy tree is therefore a normal static-hosting
artifact. If the React app uses history routing, a scoped rewrite is needed for
deep links; exact static files are served before rewrites, so `game.html` can
still coexist with such a rule
([Firebase rewrites and response order](https://firebase.google.com/docs/hosting/full-config#configure-rewrites)).
If the React build is mounted below a path such as `/app/`, Vite's `base` must
match that mount (or be relative) so generated asset URLs remain valid
([Vite public base path](https://vite.dev/guide/build.html#public-base-path)).

### 5. Node tests can remain CommonJS while testing ESM output

Dynamic `import()` is supported from CommonJS, so an existing `.test.js` file
can import the emitted ESM runtime without converting the test suite
([Node ESM `import()`](https://nodejs.org/api/esm.html#import-expressions)).
Alternatively, `node --test` discovers `.js`, `.mjs`, and `.cjs` tests. The
current explicit shell glob, however, selects only top-level
`tests/*.test.js`; nested tests or `.test.mjs` files will not join the current
command until its selection is changed
([Node test discovery](https://nodejs.org/api/test.html#running-tests-from-the-command-line)).

Two parity claims must not be conflated:

- **Exact-artifact parity:** Node dynamically imports the emitted runtime file,
  and a browser module harness loads that same file over HTTP with
  `type="module"`.
- **Source/semantic parity:** Node tests `tsc` output while the browser runs a
  separate Vite-transformed bundle from the same source.

The second is supported but is not proof that both hosts executed identical
bytes. Exact-artifact parity needs the first harness (or a shared ESM bundle),
plus a separate production-app smoke test. Browser modules must be served over
HTTP rather than opened through `file:`
([Vite built-file/CORS guidance](https://vite.dev/guide/troubleshooting.html#built-file-does-not-work-because-of-cors-error)).
`node:test` alone cannot validate browser module fetching, MIME types, asset
base paths, Firebase rewrites, or accidental browser-global access.

## Failure modes to carry into the topology decision

- Flipping the root to `"type": "module"` would reinterpret the current
  CommonJS `.js` tests, build scripts, and tooling; coexistence does not require
  that migration.
- Emitting `export` syntax to `.js` beneath the current root without a nearer
  module package makes Node treat the file as CommonJS.
- `moduleResolution: "bundler"` can accept specifiers that an unbundled Node
  ESM graph cannot resolve; direct-output parity needs Node-compatible
  specifiers or a single-file bundle.
- A catch-all Firebase SPA rewrite is unnecessary for an app without history
  routes and must be ordered/scoped intentionally when legacy routes remain.
- A successful Vite build is neither a TypeScript typecheck nor a Node parity
  test; a successful Node import is not a browser/Firebase test.
- A dual CJS/ESM runtime build is possible, but it tests two outputs rather than
  the same artifact and introduces an additional interop surface. Nothing in
  the current requirements forces that arrangement.

## Policy choices intentionally left open

The follow-on topology decision still needs to choose: nested package versus
`.mjs`; UI-only TypeScript versus TypeScript runtime source; unbundled emit
versus one ESM runtime bundle; Vite-owned public assets versus a dedicated
assembly directory; exact-artifact versus semantic parity; and SPA route/mount
shape. Official tooling supports each arrangement above subject to its stated
constraints.
