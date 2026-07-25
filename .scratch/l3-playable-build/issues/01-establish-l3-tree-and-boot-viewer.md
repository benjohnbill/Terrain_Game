# 01 — Establish the L3 Tree and Boot a Deterministic Viewer

**What to build:** Create the canonical `game/` TypeScript/ESM tree beside the
CommonJS root and the reference archive, stand up the `:game` command surface,
and make a React viewer boot a framework-free Game Runtime from an authored-world
identity and seed. A developer opening the dev path sees an initial viewer-safe
projection; the archive `index.html` / `game.html` remain independently runnable
and are not converted.

**Blocked by:** None — the first ticket once its specification gates close.

Status: landed 2026-07-25

Specification gates: Wayfinder 05, 06 (both `resolved`) — read their § Answer
sections as authority directly, under the R6 per-ticket waiver
(`README.md` § Amendment R6). Gate 10 is open by design here: acceptance item 3
requires its unfilled thresholds to fail `pending`. Gate 12's publication is a
doc-sync debt, not a precondition.

Contract (interim pointers): gate 05 § Answer D1–D3/D5/D6 (tree layout, marker-only
`game/package.json`, the seven `:game` commands, audit-lint re-aim, single-emit
parity); gate 02 § Answer §6 (the three-method Runtime surface); ADR 0040
(TypeScript/ESM, injected seed and clock); ADR 0041 (environment isolation — the
game is not a hosted web route, the archive is not a build source).

- [x] `game/src/{runtime,domain,world,projection,preview,bot,renderer,ui}` exists as the single ESM/TypeScript island; `game/package.json` carries only `{"type":"module"}`; the root package stays CommonJS with one root-owned lockfile and `node_modules`.
- [x] The seven `:game` commands exist by the names gate 05 sealed; root `npm test` and `build:hosting` stay unchanged and root-owned.
- [x] Every acceptance command whose threshold Wayfinder 10 has not filled fails `pending` rather than reporting green.
- [x] The Runtime exposes exactly `currentActor`, `view(viewerId)`, and `submit(intent)` — no snapshot API, no subscription API — and privately owns match state.
- [x] Rule execution reads no DOM, renderer, browser global, wall clock, or ambient entropy; seed and clock are injected.
- [x] `build:runtime:game` emits one ESM graph that both `test:game` (Node) and `test:browser:game` (Playwright) load — no per-host double transpile.
- [x] Equal authored-world identity and seed produce equal initial projections in Node and browser.
- [x] The audit-lint re-aim (gate 05 D5) is executed here: recursive scan over `js/` and `game/src` including `.ts`, `code-contract` still blocking, `game/` added to write-lint `GOVERNED`.
- [x] The archive play paths still run untouched; no archive module is imported by `game/`.

---

## Result — landed 2026-07-25

**Measured, not asserted.** `npm run verify:game` runs the whole chain:

```
PASS     typecheck        tsc --noEmit over game/src, strict
PASS     build:runtime    one ESM graph emitted to game/dist/
PASS     test:node        18/18 contract tests, against the emitted artifact
PASS     test:browser     3/3 Playwright tests, against the same artifact
PENDING  parity           node 574974f3bc29748e == browser 574974f3bc29748e
```

Root regression stayed green and untouched: `npm test` 479/479.
`npm run lint:docs` reports 0 blocking (7 advisory, the known ledger-currency
false positives).

**The parity line is the point, not a defect.** Both hosts produced byte-identical
projections from the same `(worldId, revision, seed)`; the command still refuses
to report green, because gate 05 D6 hands the *pass threshold* — bit-exact versus
epsilon — to Wayfinder gate 10, which is open. That is gate 05 D3's named safety
valve working: a deferred gate cannot masquerade as a pass. The valve lives in
`game/acceptance/thresholds.js`; filling `parity.equality` there is what turns the
observation into a verdict.

### What was deliberately NOT built

The readiness test that authorised this ticket (`README.md` § Amendment R6) turns
on **zero unlanded values**, so every place a value would have been invented is a
named seam instead:

- **`src/world/`** carries an identity (`boot-null-world@0`) and no terrain. The
  authored artifact is ticket 02's, against gate 06.
- **`src/domain/state.ts`** implements `currentActor` **exactly as gate 02 sealed
  it** — an `ActorId`. Re-expressing it for a simultaneous turn is a standing
  proposal, not a seal (`DECISIONS-OWED.md` § 1.3), and belongs to ticket 03.
  Baking the proposal in here would have been precisely the invented rule the
  waiver forbids.
- **`src/bot/`** throws rather than returning a filler intent — ticket 12 owns the
  policy and its disposition values are unlanded (R4, Part 2 #12).
- **`src/preview/`** checks only what needs no rules (real actor, whose turn).
- **`src/renderer/` + `src/ui/`** show the projection as text. Grey-box is the
  correct end state for this map, not a compromise.
- `submit()` rejects **every** intent kind by name, so a later ticket cannot
  mistake "nothing is wired" for "the Runtime decided to do nothing".

### Contract tests worth knowing about

Two go beyond box-ticking and should survive every later ticket:

- **the blur seam holds** — a distinctive seed is booted, the projection is
  serialized, and the test fails if the seed appears anywhere in it. A future
  field that carried truth through would fail here rather than ship. Run in both
  hosts.
- **`fork` is order-independent** — a labelled stream draws the same values
  regardless of how much *other* consumers drew first. Without it every added
  feature would silently re-roll every existing one, and replays would rot as the
  build grows.
