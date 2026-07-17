# Strategy Ground AX Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a truthful, responsive, map-first `Strategy Ground` landing page
at a stable Firebase Hosting URL for AX program review.

**Architecture:** Retain the repository's static web stack. Replace the existing
landing draft while preserving `game.html` and all gameplay modules. Use one
inline SVG-driven explanatory interaction with progressive enhancement and no
backend dependency.

**Tech Stack:** Semantic HTML5, modern CSS, vanilla JavaScript, inline SVG,
Firebase Hosting.

## Global Constraints

- `Strategy Ground` is a provisional market-facing title.
- Hero branding is English; explanatory body copy is Korean.
- The page must distinguish current proof from future vision.
- No Authentication, Firestore, waitlist, fake telemetry, release date, or
  finished-demo claim.
- Preserve `game.html`, `css/style.css`, and gameplay JavaScript.
- Respect keyboard navigation and `prefers-reduced-motion`.

---

### Task 1: Replace the semantic landing document

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: approved information architecture and `game.html` path.
- Produces: section IDs `idea`, `war-model`, `outcomes`, `principles`, and
  `development`; controls with `data-operation-step`; live region
  `operation-announcement`.

- [x] Replace the old `Terrain Game`/HUD document with the approved Hero,
  product thesis, interactive war model, emergent outcomes, principles,
  development status, and footer.
- [x] Include a semantic inline SVG whose overlay groups use
  `data-map-state="read|position|commit|consequence"`.
- [x] Mark `game.html` links as `Development Build` rather than finished demo.
- [x] Keep the Working PRD in the repository; summarize its public-facing
  product state on the page without exposing repository docs through Hosting.

### Task 2: Implement the cartographic design system

**Files:**
- Modify: `css/landing.css`

**Interfaces:**
- Consumes: semantic classes and data attributes from Task 1.
- Produces: responsive layout, visible control states, map-state transitions,
  focus styles, and reduced-motion behavior.

- [x] Define OKLCH semantic tokens for ground, surface, ink, muted ink, mineral,
  brass, danger, borders, and focus.
- [x] Build the asymmetric Hero, broad thesis composition, interaction layout,
  outcome pair, principle list, status progression, and footer.
- [x] Style map layers as information: terrain, routes, force positions,
  commitment arrow, and consequence zone.
- [x] Add breakpoints for mobile/tablet and prevent horizontal overflow.
- [x] Add `:focus-visible`, 44px mobile targets, and reduced-motion rules.

### Task 3: Add progressive interaction

**Files:**
- Modify: `js/landing.js`

**Interfaces:**
- Consumes: `[data-operation-step]`, `[data-map-state]`, operation copy targets,
  menu controls, and navigation anchors.
- Produces: active operation state, accessible announcements, mobile navigation,
  and current-section navigation state.

- [x] Store the four operation states in a plain object with title, body,
  decision, and consequence strings.
- [x] Implement `setOperationStep(step)` to update data state, selected button,
  copy, and live-region announcement.
- [x] Support click and keyboard activation through native buttons.
- [x] Implement the accessible mobile menu and close it after navigation.
- [x] Use `IntersectionObserver` only as progressive enhancement for active
  navigation; content must remain visible without it.

### Task 4: Verify the local submission build

**Files:**
- Verify: `index.html`, `css/landing.css`, `js/landing.js`, `game.html`

**Interfaces:**
- Consumes: completed landing files.
- Produces: a browser-verified local build with no critical defects.

- [x] Run `python3 -m http.server 8007` from the repository root.
- [x] Inspect 1440px and 375px screenshots and correct clipping, overflow,
  hierarchy, and control issues.
- [x] Exercise all four operation steps, navigation anchors, mobile menu, and
  development-build link.
- [x] Confirm no critical console errors and run `npm test` plus
  `npm run lint:docs`.

### Task 5: Configure and deploy Firebase Hosting

**Files:**
- Create if absent: `firebase.json`
- Create if absent: `.firebaserc`
- Create if needed: `.firebaseignore` (not needed; the build script publishes a
  dedicated `dist/` bundle)

**Interfaces:**
- Consumes: existing Firebase project access and verified static files.
- Produces: a stable HTTPS submission URL serving the landing at `/` and the
  current prototype at `/game`.

- [x] Resolve Firebase project number `1082123901885` to the accessible project
  ID through Firebase CLI.
- [x] Configure Hosting to publish a dedicated `dist/` bundle containing only
  the landing, game route, and required static assets.
- [x] Deploy Hosting with the resolved project ID.
- [x] Open the deployed URL and repeat the critical landing interaction and link
  checks.
