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
// FIXTURE_MAP: a 5-region seat=region case (tooling regression anchor).
// CANONICAL_MAP: the first-pass 10-region map, C-loop iteration 1 — seats are
// dynamic adjacent-region pairs (map-loader binds them), NOT authored here.
// Per-region sector pops re-derive caps at capPerPop 600 (cap = 600 x sum pop).

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

// ── CANONICAL_MAP — first-pass 10-region map (C-loop iteration 1) ──────────
// Topology transcribed from spec §2 (the A-E canonical 5-seat binding diagram).
// A rough initial value for the manual tuning loop (spec §3): its B1/B2 verdict
// and viable-binding count are the FIRST measurement, not a sealed result.
// Design intent encoded here (all tunable levers of the loop):
//   - Center is open on ALL 4 fronts = its exposure ("whoever takes the center
//     inherits its exposure", anti-snowball as seat topology, §2).
//   - Every periphery border toward the map EDGE is a sheltered choke
//     (pass 1000 / river 1000 / strait 500); peripheries are open only toward
//     the center. Each choke carries a required removalPath (no permanent wall).
//   - Sizes are asymmetric; viability (not mass) is what the gate balances.
const CANONICAL_MAP = (() => {
  // region base positions on the axial hex grid (roughly the §2 layout:
  // center in the middle, north tier up, west tier left, south tier down)
  const POS = {
    center: [0, 0], hebei: [0, -6], steppe: [-1, -11], northeast: [6, -10],
    xiyu: [-9, -2], guanzhong: [-7, 4], hanjing: [7, 0], sestrait: [11, 3],
    shu: [-6, 9], jiangnan: [3, 8],
  };
  // sector 0 is the border sector (carries the facing-front garrison + any
  // chokepoint fort); the rest are interior. 1 hex/sector for now (multi-hex
  // clusters are later authoring). cap derives from pop, never hex count.
  function build(regionId, { n, pop, econ, terrain, gBorder, fort = 'none', gInterior = 150 }) {
    const [bq, br] = POS[regionId];
    return Array.from({ length: n }, (_, i) => ({
      id: `${regionId}_s${i}`, regionId,
      economyValue: econ, populationValue: pop, usableEconomy: 1, usablePop: 1,
      fortTier: i === 0 ? fort : 'none',
      garrison: i === 0 ? gBorder : gInterior,
      mapUnits: [{ q: bq + (i % 4), r: br + Math.floor(i / 4), terrainLayer: terrain }],
    }));
  }
  // per-region value seed (target seat caps, canonical pairing):
  //   A center+hanjing ~8600 · B guanzhong+xiyu ~6400 · C hebei+steppe ~7000
  //   D shu+jiangnan ~7600 · E northeast+sestrait ~5000 (hermit, smallest)
  const SPEC = {
    center:    { n: 8, pop: 1.25, econ: 1.5, terrain: 'plains',   gBorder: 300, fort: 'walls' },
    hebei:     { n: 6, pop: 1.28, econ: 1.1, terrain: 'plains',   gBorder: 250, fort: 'fieldworks' },
    guanzhong: { n: 5, pop: 1.13, econ: 1.0, terrain: 'mountain', gBorder: 250, fort: 'fortress' },
    hanjing:   { n: 4, pop: 1.08, econ: 1.1, terrain: 'river',    gBorder: 250, fort: 'fieldworks' },
    jiangnan:  { n: 6, pop: 1.28, econ: 1.4, terrain: 'river',    gBorder: 250, fort: 'fieldworks' },
    steppe:    { n: 4, pop: 1.0,  econ: 0.9, terrain: 'steppe',   gBorder: 200, fort: 'none' },
    xiyu:      { n: 4, pop: 1.25, econ: 1.3, terrain: 'desert',   gBorder: 200, fort: 'walls' },
    shu:       { n: 4, pop: 1.25, econ: 1.0, terrain: 'mountain', gBorder: 250, fort: 'walls' },
    northeast: { n: 4, pop: 1.08, econ: 1.0, terrain: 'coast',    gBorder: 250, fort: 'walls' },
    sestrait:  { n: 4, pop: 1.0,  econ: 1.0, terrain: 'coast',    gBorder: 200, fort: 'walls' },
  };
  // name (한국어 표시어) + sizeClass label (descriptive; cap derives from pop)
  const META = {
    center: ['중원', 'center'], hebei: ['하북', 'mid'], guanzhong: ['관중', 'mid'],
    hanjing: ['한경', 'mid'], jiangnan: ['강남', 'mid'], steppe: ['초원', 'small'],
    xiyu: ['서역', 'small'], shu: ['촉', 'small'], northeast: ['동북', 'hermit'],
    sestrait: ['동남해', 'hermit'],
  };
  const lists = {};
  for (const id of Object.keys(SPEC)) lists[id] = build(id, SPEC[id]);
  const secs = {};
  for (const list of Object.values(lists)) for (const s of list) secs[s.id] = s;
  const regs = Object.keys(SPEC).map((id) => ({
    id, name: META[id][0], sizeClass: META[id][1], sectorIds: lists[id].map((s) => s.id),
  }));
  const e = (a, b, choke) => ({ a: lists[a][0].id, b: lists[b][0].id, choke });
  const OPEN2 = { class: 'open', cap: Infinity, removalPath: 'n/a (open border)' };
  const PASS = () => ({ class: 'pass', cap: 1000, removalPath: 'side-path bypass or road-build' });
  const RIVER = () => ({ class: 'river', cap: 1000, removalPath: 'alternate ford or pontoon bridge' });
  const STRAIT = () => ({ class: 'strait', cap: 500, removalPath: 'port staging (+door) or sea control' });
  const es = [
    // center: OPEN on all 4 fronts (its exposure)
    e('center', 'hebei', OPEN2), e('center', 'guanzhong', OPEN2),
    e('center', 'hanjing', OPEN2), e('center', 'jiangnan', OPEN2),
    // north tier (steppe/hebei/northeast) — cavalry passes
    e('hebei', 'steppe', PASS()), e('hebei', 'northeast', PASS()),
    e('hebei', 'xiyu', PASS()), e('steppe', 'northeast', PASS()),
    // west tier (guanzhong/xiyu/shu) — corridors
    e('guanzhong', 'xiyu', PASS()), e('guanzhong', 'shu', PASS()),
    // south tier (shu/jiangnan/hanjing/sestrait) — rivers + coastal strait
    e('shu', 'jiangnan', RIVER()), e('hanjing', 'jiangnan', RIVER()),
    e('hanjing', 'sestrait', RIVER()), e('jiangnan', 'sestrait', STRAIT()),
    e('northeast', 'sestrait', STRAIT()),
  ];
  return { regions: regs, sectors: secs, edges: es };
})();

// The canonical 5-seat binding (spec §2 A–E): the verification reference point,
// NOT the only valid set — the constraint-satisfying generator (viableBindings)
// finds others. One source for both the node measurement and the mockup panel.
const CANONICAL_BINDING = {
  A: ['center', 'hanjing'], B: ['guanzhong', 'xiyu'], C: ['hebei', 'steppe'],
  D: ['shu', 'jiangnan'], E: ['northeast', 'sestrait'],
};

// dual-mode export (node require / browser global)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FIXTURE_MAP, CANONICAL_MAP, CANONICAL_BINDING };
} else {
  (window.TC = window.TC || {}).data = { FIXTURE_MAP, CANONICAL_MAP, CANONICAL_BINDING };
}
