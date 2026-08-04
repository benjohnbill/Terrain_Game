import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

/**
 * The viewer's dev and bundle config.
 *
 * ADR 0041 keeps the game off the public web: this is a **development and
 * playtest host**, not a distribution target, and `build:hosting` (the landing
 * page) stays root-owned and untouched by it. `base: './'` keeps the bundle
 * path-independent so it can be opened from a file server or, later, a native
 * shell.
 *
 * Gate 05 D6's accepted cost applies here: `dev:game` runs HMR on source while
 * acceptance always runs the emitted artifact.
 *
 * **Two entries, deliberately.** `index.html` is the grey-box viewer the
 * Playwright suite drives against its test ids; `demo.html` is the commit-first
 * demo shell. Keeping them separate is what lets the shell exist without the
 * suite's DOM contract moving underneath it — the two share modules, not a page.
 */
export default defineConfig({
  root: import.meta.dirname,
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist-viewer',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        index: path.resolve(import.meta.dirname, 'index.html'),
        demo: path.resolve(import.meta.dirname, 'demo.html'),
      },
    },
  },
  server: {
    port: 5183,
    strictPort: false,
  },
});
