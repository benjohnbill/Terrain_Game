# Terrain-Cradle Rulings — Decision Record

Feature-local decision record (Record layer, birthplace tier — see
`.claude/rules/documentation-law.md`). Ruling history behind the
terrain-cradle seals; GLOSSARY rows cite numbers into here. All rulings
below were made in the C-loop authoring session of 2026-07-07 with the
user as sealer; the executable map source is
`mockup/combat-calc/map-gen.js` (deterministic; node & browser derive
the same map), the authoring surface is `map-mockup.html`'s edit layer,
the measurement scripts live in the session scratchpad and the gates in
`map-gate.js`.

## TC-① Equal starting population (parity v5) — SEALED 2026-07-07 · L1

Every region starts with Σ population 6.0 (cap 3,600 at capPerPop 600).
Blood budget is equal for all ten regions; divergence comes only from
play (conquest, development). Grounds: blood is a permanent currency
(M13 manpower pool) — equal start = equal lifetime blood; historicity
lives in geography, not demographics; B1/B2 become flat by construction
so the gates measure geography purely. Supersedes parity v4's 중원 +20%
population crown (see TC-②).

## TC-② 중원 crown demoted from law to hypothesis — SEALED 2026-07-07 · L1

The 중원-protagonist statement is not a design guarantee. The crown
moves entirely to the economy axis (ladder v2 index 1.25, TC-③); the
population crown is deleted. Two L2 needles registered: (a) 중원-holder
overall winrate ≈ average (no script), (b) stable-hold (N+ turns) →
hegemony rate clearly higher (the crown exists). The band between the
needles is the user's to declare. User framing: "우승률을 올릴 생각은
없다(난이도 최고); 안정적으로 소화한 자에게 교통 요충 + 경제 체력이
패권 확률을 올려준다."

## TC-③ Economy ladder v2 (exposure-derived residual) — structure SEALED, values 가안 · L1

Regional economy totals derive from geography instead of fiat:
`index = 0.55 + 0.45 × (inbound flow ÷ world average) + projection-shortfall
credit` (credit: 동남해 only — the sole region that cannot project its
full field). Inbound flow per border: open = full parity field 3,600 ·
choked = door width × chokeFlow 2. Package-settlement principle: the
map already prices geography in safety/reach/depth; economy is the free
dial that closes each region's package into a fair bet (the user's
original exposure-compensation insight, generalized). HELD by user:
core(심장부) debit, fiction band, and the constants 0.55/0.45 — all
future grill material; values are L2/L3-owned. Resulting indices:
중원 1.25 · 하북/한경 1.15 · 초원 1.09 · 관중 1.06 · 촉 0.96 ·
동북 0.93 · 강남 0.92 · 서역 0.80 · 동남해 0.77 (Σ ≈ 10.1, mean 1.0).

## TC-④ Border classes + corridor authoring — SEALED 2026-07-07 · L1

Natural borders replace bare-plains defaults: rivers 중원-강남 /
한경-동북 / 한경-강남 (양쯔·창장 reading) · forest 하북-초원 (steppe
borders are never bare) · hills 하북-서역 (천산 softened — isolation
without impotence; **new door class, width 1,300 가안**, between forest
1,500 and pass 1,000). Partial river 초원-한경: under the sealed binary
projection rule a partial barrier cannot throttle region flow — its
class stays open; it is **invasion-corridor authoring** (the western
gate sector is the door; visual only today, becomes mechanical if the
frontage-weighting dial ever opens). Corridor readability rider
(TC-⑤): the Hexi hills door keeps a door-scale physical frontage
(~4+ contact edges), not a 2-hex slit.

## TC-⑥ Coupled-spike city rule — SEALED 2026-07-07 · L1

Default: where the money spikes, the people spike — a city (single
sector, the region's readable target-and-stake point). Separation of
the two maps (pop vs econ) is an EXCEPTION requiring a profile reason;
초원 is the first case (econ spiked at the forward capital, population
spread — nomads: burning the city never kills the tribe). Spike tiers:
strong ≈ 40–50% of the regional total (서역 — the land IS the point) ·
mild ≈ 25–35% (all inland cities — real hinterland behind them).

## TC-⑦ City layout seal (battle-summoning placement) — SEALED 2026-07-07 · L1

Placement principle: **cities summon battles** — every city except
서역's is placed where fighting is invited; 서역 is the deliberate
opposite pole. The layout was authored by the user in the mockup edit
layer and baked as fixed seats + 38 hex swaps (USER_SWAPS):

- 하북/한경 **gate-cities**: hold 3/3 and 4/4 of the 중원-border hexes —
  every 중원↔twin campaign passes through the city sector.
- 강남 **pivot city**: fronts 중원(5)+촉(4); its strait lands in an
  INTERIOR harbor — the island's rear-strike dagger into 강남 vs its
  front-door landing at 동북's capital is an intended asymmetry.
- 관중 **mountain gate-city**: on the triple junction 중원/하북/촉;
  terrain stays mountain (named exception to the basin grammar
  "rim poor / floor rich"; the only open door faces 촉). L2 watch flag.
- 동남해 **port city**: both straits land at the city sector — "the
  entrance IS the city" (user).
- 동북 **port capital**: the capital IS its strait sector; profile
  amended from "deep interior" to "the seat's meaning is the island
  link" — whoever holds the island holds a knife at this capital.
- 서역 **max-Moscow oasis**: farthest corner, foreign-land distance ~6
  hexes; the oasis terrain travels with the seat.
- 중원 **keep city** (r1_s3): interior, invisible from every border,
  mild spike 2.0/2.4 — an explicit AMENDMENT of the earlier
  "중원 flat by identity" reading: stakes stay smeared on the rim
  (all three rim sectors 2–3 fronts each), the heart moves inside.

## TC-⑧ Void ontology — SEALED 2026-07-07 · L0

Void = **sea expressed as land**. Movement, ownership and vision are
identical to sea; there is exactly one kind of "cannot cross" in the
world, drawn two ways. No special rules; a Phase-2 tunnel/crossing
would be a PROMOTION to a removable choke (C3/C4 legality), never a
rule exception.

## TC-⑨ Great range · 하서회랑 · 대환 — SEALED 2026-07-07 · L1

The great range FILLS the 서역-초원 gap (sea-anchored north — forced by
the non-adjacency ruling; east-bowing arc). It dies south into the
**하서회랑**: upper 서역-하북 contact is mountain-grade void, only the
lower hills door remains. Rider (user): **adjacency count is
inviolable** — contact hexes may narrow, neighbor count never changes
(서역 keeps exactly 2). The **대환 (Western Ring)** wraps the left
hemisphere's outer rim (range → 서역 → 관중 → 촉) as sea-side void
only — zero graph impact; doors read as notches in one continuous
wall. One world-cause for the desert (rain shadow), the basins, and
the range's finality.

## TC-⑩ 태산 (central massif) — SEALED 2026-07-07 · L1

The quad-junction void knot is structurally NECESSARY: geometry forces
one diagonal at a four-corner meeting, and the alternative (a near-zero
"alps door" between 하북-한경) would legalize the 하북+한경 seat pair
in the viable-binding enumeration and break the 7-matching world. The
4-hex massif stays; the ugliness was rendering, fixed as a single
sacred-mountain landmark. Proper name: **태산** (user, 2026-07-07) —
the isolated holy massif where four worlds meet and none owns the peak.

## TC-⑪ Grid form frozen + silhouette render — SEALED 2026-07-07 · L0

Hex orientation (pointy-top) and resolution (~5–8 hex/sector) are
frozen with the sealed layout: any grid-form change re-runs
growth/partition and is seed-reauthoring-tier. Occupation's atom is
the SECTOR; hexes carry physical space, frontage and texture only.
Approved render upgrades (pure display, hex truth untouched):
deterministic coast roughening (eat-only, law-checked) + UoC-style
smoothed outer silhouette (coast + wall face) + shallow-water band.

## TC-⑫ Carve principle — SEALED 2026-07-07 · L0 (method law)

**Post-seal terrain edits are local carves, never re-growth.** Balanced
growth and partition are globally coupled: changing candidates anywhere
reshuffles every region and scrambles the sealed sector layout
(observed twice in-session). All terrain changes after a layout seal
operate on the finished ownership (carve/restore + law checks: INTENT
edges intact, no empty/split sectors, min-3 band).
