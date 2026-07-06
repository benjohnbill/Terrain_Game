# Terrain-Cradle — Feature Index

**Status (2026-07-07): map AUTHORED & SEALED at L1** — the 10-region
contiguous hex map exists as a deterministic generator, passes both
static gates under every seating, and carries the user's hand-authored
sector layout. Next tier of truth is L2 (tournament adapter).

## What this feature is

The authored game world: 10 regions → 55 sectors → ~292 hexes, with
derived adjacency (hex contact IS the region graph), border classes,
cities/capitals, and the void mountain system. Born from the C-loop
(user sketches/edits → agent converts & measures → user eye-judges).

## Files

- `RULINGS.md` — TC-①…⑫, the 2026-07-07 decision record (this
  feature's authoritative history).
- `GLOSSARY.md` — Tier-1 vocabulary (void, 대산맥/하서회랑/대환/태산,
  parity start, economy ladder, city grammar, carve principle).
- Executable map source: `mockup/combat-calc/map-gen.js` (deterministic
  seed→map; USER_SWAPS + fixed seats = the sealed layout; header
  carries the grid-form principle).
- Workbench: `mockup/combat-calc/map-mockup.html` (sky-view render,
  live B1/B2 panel, hex-click edit layer + Export JSON) ·
  gates `map-gate.js` · loader `map-loader.js`.
- User-audit surface: `docs/GLOSSARY-QUICKREF.md` C-loop translation
  table (user statement → dial → checking scale).
- Related sealed homes: door widths → combat-formula `MAGNITUDE.md`
  M11 · caps/econ units → M13/M14 · workbench spec →
  `docs/superpowers/specs/2026-07-06-terrain-cradle-map-design.md`.

## Authoring rhythm (sealed 2026-07-07, user)

The C-loop's collaboration law: **the sketch/edit-layer is the law of
shape, prose profiles are the law of character; spoken word beats the
drawing** — but a spoken change becomes law again only when baked into
`map-gen.js` (the mockup edit layer is PREVIEW; Export JSON → agent
bakes). Loop: user input (edit or verdict sentences) → agent converts
& measures → render + gate verdicts + translation-table diff → user
eye-judges. **Staleness note:** the original editor sketch
(`map-editor.html` localStorage) is superseded — the baked
USER_SWAPS/seats in `map-gen.js` ARE the current shape law; the
editor→SEED path was manual transcription (no exporter). Re-authoring
via the editor is seed-reauthoring-tier and belongs to the dedicated
map-design session (with the DISPLAY-DEBT centrality row).

## Current verified state

Derived graph ≡ intended graph (15 borders + 2 straits, 0 repairs) ·
all regions pop 6.0 / econ = ladder targets (exact) · all sectors
contiguous · B1 PASS · B2 PASS · viable seatings 7/7 · node and
browser agree.

## Open questions

- **L2 tournament adapter** — the real discriminator now that parity
  makes static gates a safety rail. 7 registered watch flags (QUICKREF
  table): crown needles ×2, develop-greedy, 강남 quiet winner, 촉-seat,
  region abandonment, 동남해 fertility funding, 관중 gate-city.
  **Includes battery re-wiring**: sheet 14 still runs FIXTURE_MAP (the
  regression anchor) — CRADLE_MAP node heavy-checks are owed to the
  adapter session.
- **Force-geography pass** — muster location/pool draw, garrison↔
  reserve, movement processing (needs this map; L2 can run on the
  positionless abstraction meanwhile).
- Held dials: economy-ladder constants (0.55/0.45), core-depth debit,
  fiction band, frontage weighting, hills door value (1,300 가안),
  spike-% formalization.
- Display: 중원 visual centrality (DISPLAY-DEBT row, next seed
  re-authoring); a dedicated map-design grill session (user-flagged).
