import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

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
 */
export default defineConfig({
  root: import.meta.dirname,
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist-viewer',
    emptyOutDir: true,
    sourcemap: true,
  },
  server: {
    port: 5183,
    strictPort: false,
  },
});
