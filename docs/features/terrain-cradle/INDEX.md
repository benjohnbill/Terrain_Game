# Terrain-Cradle — Feature Index

**Status (2026-07-07): map AUTHORED & SEALED at L1** — the 10-region
contiguous hex map exists as a deterministic generator, passes both
static gates under every seating, and carries the user's hand-authored
sector layout. Next tier of truth is L2 (tournament adapter).

Projection sync (2026-07-07 doc-sync batch): impassable terrain (구칭
void terrain) / parity start / battle-summoning placement promoted to
DOMAIN_MAP (summary + pointer; definitions stay here); DESIGN carries
the authored-map
pipeline subsection. SPEC 중원-crown amendment (TC-②) applied
2026-07-07, user-approved — the Projection/Direction sync debt from the
C-loop close is fully paid (`docs/SYNC-DEBT.md`).

## What this feature is

The authored game world: 10 regions → 55 sectors → ~292 hexes, with
derived adjacency (hex contact IS the region graph), border classes,
cities/capitals, and the void mountain system. Born from the C-loop
(user sketches/edits → agent converts & measures → user eye-judges).

## Files

- `RULINGS.md` — TC-①…⑭, the decision record (this feature's
  authoritative history; ⑬–⑭ added 2026-07-08: border-class combat
  binding, derived-asymmetry seal).
- `GLOSSARY.md` — Tier-1 vocabulary (impassable terrain,
  대산맥/하서회랑/대환/태산, parity start, emergent asymmetry, economy
  ladder, city grammar, carve principle; renames 2026-07-10:
  void→impassable, derived→emergent).
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

- **L2 tournament adapter — BUILT & first-run (2026-07-07)**:
  `map-board.js` (board factory / cradle tournament / flag reports) +
  battery sheet 14b (CRADLE heavy checks) + sheet 15 (watch-flag run,
  12,600 matches). First data + the **frozen-world headline** (healing
  outruns wounding; blinds duty quantified ~58%; A-3 alone
  insufficient) recorded in `mockup/combat-calc/NOTES.md` (2026-07-07
  entry). Needle rulings (중원 band, 관중+촉, 초원 dowry flag)
  DEFERRED until L2 fidelity rises — user impact-first ruling promoted
  **blinds design ahead of force-geography**.
- **Force-geography pass** — muster location/pool draw, garrison↔
  reserve, movement processing (needs this map; L2 can run on the
  positionless abstraction meanwhile).
- Held dials: economy-ladder constants (0.55/0.45), core-depth debit,
  fiction band, frontage weighting, hills door value (1,300 가안),
  spike-% formalization.
- Display: 중원 visual centrality (DISPLAY-DEBT row, next seed
  re-authoring); a dedicated map-design grill session (user-flagged).
