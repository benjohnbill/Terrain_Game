'use strict';
// PROTOTYPE — terrain-cradle map schema + canonical fixture. Single source
// for the node battery (sheet 14) and the browser mockup (map-mockup.html).
// js/ must not import this. Spec: docs/superpowers/specs/2026-07-06-terrain-
// cradle-map-design.md §1.
//
// A map = regions + a SECTOR-LEVEL adjacency graph + a hex layout. cap/income
// DERIVE from sector values (econ.js); hex count is NOT value (D4) — mapUnits
// drive the visual render only. Every choke carries a removalPath.
//
// FIXTURE_MAP: a 5-region seat=region case (10-region authoring is the later
// C-loop). Per-region sector pops re-derive the sealed caps at capPerPop 600.

// region base positions on an axial hex grid (roughly the spec §2 topology:
// center in the middle, peripheries around it)
const REGION_POS = {
  center:     [0, 0],
  seoryeong:  [-6, 1],
  dongpyeong: [6, -1],
  namgok:     [-1, 6],
  bukha:      [5, -6],
};

// build a region's sectors; each sector gets one hex laid out from the region
// base + its index (fixture keeps 1 hex/sector; real authoring uses clusters)
function sectorsFor(regionId, specs) {
  const [bq, br] = REGION_POS[regionId];
  return specs.map((s, i) => ({
    id: `${regionId}_s${i}`,
    regionId,
    economyValue: s.econ,
    populationValue: s.pop,
    usableEconomy: s.usableE ?? 1,
    usablePop: s.usableP ?? 1,
    fortTier: s.fortTier ?? 'none',
    garrison: s.garrison ?? 0,
    mapUnits: [{ q: bq + (i % 4), r: br + Math.floor(i / 4),
      terrainLayer: s.terrain ?? 'plains' }],
  }));
}

// center: 12 rich sectors (econ 1.5 / pop 1.25) → cap 600×15 = 9000
const centerSpecs = Array.from({ length: 12 }, (_, i) => ({
  econ: 1.5, pop: 1.25, terrain: 'plains',
  fortTier: i === 0 ? 'walls' : 'none', garrison: i < 4 ? 300 : 0 }));
// mid: sum pop = 7000/600 ≈ 11.67
function midSpecs() {
  return [
    ...Array.from({ length: 8 }, () => ({ econ: 1, pop: 1, garrison: 250 })),
    { econ: 1, pop: 1.835, fortTier: 'fortress', garrison: 250, terrain: 'mountain' },
    { econ: 1, pop: 1.835, garrison: 0 },
  ];
}
// small: sum pop = 5000/600 ≈ 8.33
const smallSpecs = [
  ...Array.from({ length: 6 }, () => ({ econ: 1, pop: 1.2, garrison: 200 })),
  { econ: 1, pop: 1.13, fortTier: 'walls', garrison: 200, terrain: 'river' },
];
// hermit: sum pop = 6000/600 = 10, strait-shielded
const hermitSpecs = Array.from({ length: 8 }, () => ({
  econ: 1, pop: 1.25, garrison: 300, terrain: 'coast' }));

const regionSectorLists = {
  center: sectorsFor('center', centerSpecs),
  seoryeong: sectorsFor('seoryeong', midSpecs()),
  dongpyeong: sectorsFor('dongpyeong', midSpecs()),
  namgok: sectorsFor('namgok', smallSpecs),
  bukha: sectorsFor('bukha', hermitSpecs),
};

const sectors = {};
for (const list of Object.values(regionSectorLists)) {
  for (const s of list) sectors[s.id] = s;
}

const regions = [
  { id: 'center', name: '중원', sizeClass: 'center', sectorIds: regionSectorLists.center.map((s) => s.id) },
  { id: 'seoryeong', name: '서령', sizeClass: 'mid', sectorIds: regionSectorLists.seoryeong.map((s) => s.id) },
  { id: 'dongpyeong', name: '동평', sizeClass: 'mid', sectorIds: regionSectorLists.dongpyeong.map((s) => s.id) },
  { id: 'namgok', name: '남곡', sizeClass: 'small', sectorIds: regionSectorLists.namgok.map((s) => s.id) },
  { id: 'bukha', name: '북하', sizeClass: 'hermit', sectorIds: regionSectorLists.bukha.map((s) => s.id) },
];

// one edge per bordering region pair, from a representative sector each side.
// center borders all 4 (its exposure); bukha's front is a strait choke.
function edge(regA, regB, choke) {
  return { a: regionSectorLists[regA][0].id, b: regionSectorLists[regB][0].id, choke };
}
const OPEN = { class: 'open', cap: Infinity, removalPath: 'n/a (open border)' };
const edges = [
  edge('center', 'seoryeong', { class: 'pass', cap: 1000, removalPath: 'side-path bypass (Anopaea) or road-build' }),
  edge('center', 'dongpyeong', OPEN),
  edge('center', 'namgok', { class: 'river', cap: 1000, removalPath: 'alternate ford or pontoon' }),
  edge('center', 'bukha', { class: 'strait', cap: 500, removalPath: 'port staging (+500 door) or sea control' }),
];

const FIXTURE_MAP = { regions, sectors, edges };

// dual-mode export (node require / browser global)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FIXTURE_MAP };
} else {
  (window.TC = window.TC || {}).data = { FIXTURE_MAP };
}
