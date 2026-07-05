# Game Development Stack Literacy — Resources

Curated, source-verified. Knowledge for lessons is drawn from here, not from
parametric guesses. Every external claim in a lesson should trace to an entry
below. Last verified: 2026-06-29.

## Knowledge

### The stack, layer by layer

- [Vite — "Why Vite"](https://vite.dev/guide/why)
  Official statement of what a build tool does: a fast dev server (esbuild) plus
  a production bundler (Rollup). Use for **Layer 3** lessons — what a "build
  step" even is and why it's additive.
- [Svelte — official site](https://svelte.dev/)
  A *compiler* with **no virtual DOM** — components compile to JS that touches
  the real DOM directly. Use for the compile-time-vs-runtime contrast in the
  framework lesson (**Layer 2**).
- [React — official site](https://react.dev/)
  A component *library* using a runtime **virtual DOM**. The canonical foil to
  Svelte. Use for **Layer 2**.
- [Vue — official site](https://vuejs.org/)
  Progressive, incrementally-adoptable UI framework — the middle example between
  React and Svelte. **Layer 2**.
- [Next.js — Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
  Shows Next.js's server orientation (SSR, server components, API routes) on one
  page. Use to justify why a purely client-side single-player game uses almost
  none of it — corrects the "Next.js = modern web" assumption.
- [Tauri — "What is Tauri?"](https://v2.tauri.app/start/)
  Native OS WebView + Rust backend → tiny bundles (single-digit MB). Use for the
  distribution lesson (**Layer 4**) and the Tauri-vs-Electron tradeoff.
- [Electron — official site](https://www.electronjs.org/)
  Bundles Chromium + Node.js → large installers (80–250 MB) but maximal
  compatibility. The baseline to contrast against Tauri. **Layer 4**.
- [Godot — Features](https://godotengine.org/features/)
  One-page tour of what a game engine is *for*: real-time loop, physics,
  animation, 2D/3D rendering, one-click native export. The **Layer 1** "rewrite
  target" reference.
- [Unity — Unity Engine](https://unity.com/products/unity-engine)
  The commercial-engine counterpart (C#, real-time, multi-platform). Same role
  as Godot's page for **Layer 1**.

### Distribution & the rewrite question

- [Phaser — "Publishing Web Games on Steam with Electron"](https://phaser.io/news/2025/03/publishing-web-games-on-steam-with-electron)
  How an HTML5/JS game actually reaches Steam (Electron wrapper). Mirrors this
  project's own vanilla-JS → desktop path. **Layer 4 / distribution lesson.**
- [Wikipedia — Vampire Survivors](https://en.wikipedia.org/wiki/Vampire_Survivors)
  Canonical engine timeline: built in **Phaser** (HTML5/JS), shipped to Steam,
  ported to **Unity at v1.6 on 2023-08-17** for performance + console support.
  The case study for "build cheaply to validate, let success fund the rewrite."
- [Steam — "Version 1.6: New engine & Local co-op"](https://store.steampowered.com/news/app/1794680/view/3678929205875258038)
  poncle's own announcement of the engine swap. Primary source when you want the
  developer's framing. (JS-rendered — may need a real browser to read the body.)
- [Joel Spolsky — "Things You Should Never Do, Part I"](https://www.joelonsoftware.com/2000/04/06/things-you-should-never-do-part-i/)
  The classic "never rewrite from scratch" essay (Netscape postmortem). Reach
  for it whenever the temptation to switch stacks or rewrite surfaces.
- [MDN — Web technology for developers](https://developer.mozilla.org/en-US/docs/Web)
  The most trusted reference for the web platform (HTML/CSS/JS/Web APIs). The
  "your stack already lives here" home base for a vanilla-JS developer.

## Wisdom (Communities)

- [r/gamedev](https://www.reddit.com/r/gamedev/)
  Largest general game-dev hub. Use for engine/stack tradeoff questions,
  postmortems, and "is my approach sane?" sanity checks.
- [r/webdev](https://www.reddit.com/r/webdev/)
  The web side of the stack — build tools, Vite, bundlers, deploying browser
  apps. Where a vanilla-JS dev gets DOM/JS-specific feedback.
- [Phaser community (Discord + forum)](https://phaser.io/community)
  HTML5/JS game-specific help — the genre Vampire Survivors came from. Best for
  "how do I ship my JS game to desktop/Steam." (The old html5gamedevs.com forum
  is archived; use Phaser's official channels.)
- [r/godot](https://www.reddit.com/r/godot/)
  Active, beginner-friendly engine community. Useful even just to pressure-test
  "do I actually need a game engine for a turn-based DOM game?"
- [Hacker News](https://news.ycombinator.com/)
  High-level stack-literacy and rewrite-cost discussion (the Spolsky piece is a
  recurring topic). Senior-level architectural perspective.

## Caveats for future lessons (source-verification notes)

- **Vampire Survivors Unity port = 2023-08-17 (v1.6), not "late 2022."** The 1.0
  Steam release (Oct 2022) was still Phaser; the engine swap shipped Aug 2023.
  Use the correct date in the distribution/case-study lesson.
- **The Steam Electron wrapper is community-verified, not developer-confirmed.**
  Evidence is reverse-engineering (`.pak` files, Electron layout), not a poncle
  statement. Present as "almost certainly Electron," not as official fact.
- **"Game engines are a weak fit for a turn-based, DOM-heavy strategy game" is
  editorial judgment, not a vendor claim.** The engines' real-time/physics/native
  strengths are cited fact; the "weak fit for this genre" conclusion is the
  course's own reasoning. Present it as analysis the learner can challenge.
