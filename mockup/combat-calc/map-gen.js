'use strict';
// PROTOTYPE — terrain-cradle hex-map generator (C-loop iteration 2).
// Derives a contiguous hex map from the user's editor sketch seed:
// region ellipses → balanced hex growth → repair to the intended semantic
// adjacency graph → sector partition (10k=1sec, ~5 hex/sector nominal) →
// capitals/roles → authored chokes. Adjacency is DERIVED from hex contact,
// then verified against INTENT — the map and the graph are one source.
// Deterministic (no randomness): node and browser derive the same map.
// js/ must not import. All values are 가안 (parity v5: equal pop totals,
// econ per ladder v2 from border-class exposure; capitals concentrate value).
// hex = physical space/distance only (D4); values live on sectors.

const HEXR = 25; // px per hex radius in seed (editor sketch) space
const SQRT3 = Math.sqrt(3);
const NB = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];
const hx = (q, r) => ({ x: HEXR * SQRT3 * (q + r / 2), y: HEXR * 1.5 * r });
const kk = (q, r) => q + ',' + r;

// --- seed: user's editor sketch (2026-07-06) + semantic rulings -----------
// [id, name, archetype(render), cx, cy, rx, ry, nSec]
const SEED = [
  ['r1', '중원', 'plains', 636, 430, 101, 93, 4],
  ['r2', '하북', 'plains', 516, 323, 135, 117, 5],
  ['r3', '초원', 'steppe', 648, 126, 181, 141, 8],
  ['r4', '동북', 'steppe', 950, 194, 147, 130, 6], // user: "전반적으로 초원 지대"
  ['r5', '서역', 'desert', 225, 311, 197, 161, 10],
  ['r6', '관중', 'mountain', 427, 512, 147, 129, 6],
  ['r7', '한경', 'river-valley', 763, 336, 129, 123, 5],
  ['r8', '촉', 'plains', 598, 595, 112, 86, 3], // fertile basin floor
  ['r9', '강남', 'plains', 795, 549, 133, 119, 5],
  ['r10', '동남해', 'plains', 1100, 529, 119, 107, 4], // fertile island
];
const MAINLAND = SEED.filter((s) => s[0] !== 'r10');
const byId = Object.fromEntries(SEED.map((s) => [s[0], s]));
const HEX_PER_SEC = 5; // nominal; min–max band per sector is a future dial

// intended semantic graph (user rulings): 15 mainland borders + 2 straits.
// 하북-한경 NOT adjacent (twins split by 중원); 서역-초원 void range (no edge).
const pairKey = (a, b) => (a < b ? a + '|' + b : b + '|' + a);
// Border classes per user layout ruling 2026-07-07: rivers 강남-중원/
// 한경-동북/한경-강남 (양쯔·창장), forest 하북-초원 (steppe borders are
// never bare plains), hills 하북-서역 (천산 softened — isolation without
// impotence). r3|r7 stays open: the user's PARTIAL river there cannot
// throttle region flow under the sealed binary projection rule — it is
// invasion-corridor authoring, owned by the sector-partition pass.
const INTENT = {
  'r1|r2': 'open', 'r1|r7': 'open', 'r1|r9': 'river', 'r1|r6': 'pass', 'r1|r8': 'pass',
  'r2|r3': 'forest', 'r2|r5': 'hills', 'r2|r6': 'pass',
  'r3|r4': 'open', 'r3|r7': 'open',
  'r4|r7': 'river',
  'r5|r6': 'pass',
  'r6|r8': 'open', // basin brothers: no elevation gap
  'r7|r9': 'river',
  'r8|r9': 'pass',
};
// door width per border class (M11 pass/river/strait sealed; forest M-pass;
// hills 가안 2026-07-07 — between forest and pass)
const DOOR = { pass: 1000, river: 1000, forest: 1500, hills: 1300 };
const STRAITS = [ // [pair, cap(가안: 동북 route easier per user)]
  ['r9|r10', 500], ['r4|r10', 800],
];
const REMOVAL = {
  pass: 'side-path bypass or road-build',
  river: 'bridgehead or upstream crossing',
  forest: 'clearing or road-build',
  hills: 'ridge road',
  strait: 'port staging or sea control',
};

// void mountain range — ONTOLOGY SEALED 2026-07-07: void = sea expressed as
// land (movement, ownership AND vision identical to sea; no special rules;
// a Phase-2 tunnel would be a promotion to a removable choke, not a rule).
// 대산맥 (great range): FILLS the 서역–초원 gap — sea-anchored north (the
// non-adjacency ruling forces it), bowing east (천산 arc), dying south into
// the 하서회랑 (Hexi corridor): the upper 서역–하북 contact is mountain-grade
// (void eats it), only the lower hills door remains. Ruling: adjacency COUNT
// is inviolable — 서역 keeps exactly 2 neighbors; the range narrows contact
// hexes only.
// Candidate-stage band: UNCHANGED from the sealed bake (growth/partition are
// globally coupled — widening here reshuffles every region and scrambles the
// user-sealed layout). The full-width range is CARVED post-partition below.
const VOID_POLY = [[292, 39], [369, 122], [407, 192], [427, 220], [458, 252]];
const VOID_W = 34;
// central void KNOT at the 하북/한경/중원/초원 quad-junction. Four regions
// meeting at one point cannot keep BOTH diagonals (하북-한경, 중원-초원)
// non-adjacent (four-corner problem) — a void plug (mountain knot) where the
// four realms meet makes both separations geometrically possible.
const VOID_KNOT = { x: 640, y: 300, rad: 40 };
function distSeg(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const L2 = dx * dx + dy * dy;
  const t = L2 ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / L2)) : 0;
  const qx = ax + t * dx, qy = ay + t * dy;
  return Math.hypot(px - qx, py - qy);
}
const inVoid = (h) => {
  if (Math.hypot(h.x - VOID_KNOT.x, h.y - VOID_KNOT.y) < VOID_KNOT.rad) return true;
  for (let i = 0; i < VOID_POLY.length - 1; i++) {
    if (distSeg(h.x, h.y, VOID_POLY[i][0], VOID_POLY[i][1],
      VOID_POLY[i + 1][0], VOID_POLY[i + 1][1]) < VOID_W) return true;
  }
  return false;
};

// --- hex universe ----------------------------------------------------------
const hexes = new Map();
for (let r = -2; r <= 22; r++) {
  for (let q = -16; q <= 34; q++) {
    const h = hx(q, r);
    if (h.x < -40 || h.x > 1300 || h.y < -60 || h.y > 760) continue;
    hexes.set(kk(q, r), { q, r, x: h.x, y: h.y });
  }
}
const inEllipse = (h, s, scale = 1.06) => {
  const dx = (h.x - s[3]) / (s[5] * scale), dy = (h.y - s[4]) / (s[6] * scale);
  return dx * dx + dy * dy <= 1;
};

const GEN_DIAG = { repaired: [], missingEdges: [], extraResidual: [], quotaDrift: {},
  sectorSizes: {}, disconnected: [], rangeHexCount: 0 };

// candidates
const cand = new Set();
const rangeHexes = [];
for (const [k, h] of hexes) {
  if (inVoid(h)) { rangeHexes.push(h); continue; }
  if (MAINLAND.some((s) => inEllipse(h, s))) cand.add(k);
}
GEN_DIAG.rangeHexCount = rangeHexes.length;

// --- balanced growth --------------------------------------------------------
const owner = new Map();
const claimed = {}; const frontier = {};
for (const s of MAINLAND) {
  let best = null, bd = Infinity;
  for (const k of cand) {
    if (owner.has(k)) continue;
    const h = hexes.get(k);
    const d = (h.x - s[3]) ** 2 + (h.y - s[4]) ** 2;
    if (d < bd) { bd = d; best = k; }
  }
  owner.set(best, s[0]); claimed[s[0]] = 1; frontier[s[0]] = new Set();
  const b = hexes.get(best);
  for (const [dq, dr] of NB) {
    const nk = kk(b.q + dq, b.r + dr);
    if (cand.has(nk) && !owner.has(nk)) frontier[s[0]].add(nk);
  }
}
for (let guard = 0; guard < 5000; guard++) {
  let pick = null, pv = Infinity;
  for (const s of MAINLAND) {
    const quota = s[7] * HEX_PER_SEC;
    if (claimed[s[0]] >= quota) continue;
    for (const k of frontier[s[0]]) if (owner.has(k)) frontier[s[0]].delete(k);
    if (!frontier[s[0]].size) continue;
    const v = claimed[s[0]] / quota;
    if (v < pv) { pv = v; pick = s; }
  }
  if (!pick) break;
  let best = null, bd = Infinity;
  for (const k of frontier[pick[0]]) {
    const h = hexes.get(k);
    const d = (h.x - pick[3]) ** 2 + (h.y - pick[4]) ** 2;
    if (d < bd || (d === bd && k < best)) { bd = d; best = k; }
  }
  owner.set(best, pick[0]); claimed[pick[0]]++; frontier[pick[0]].delete(best);
  const b = hexes.get(best);
  for (const [dq, dr] of NB) {
    const nk = kk(b.q + dq, b.r + dr);
    if (cand.has(nk) && !owner.has(nk)) frontier[pick[0]].add(nk);
  }
}
// absorb leftovers into nearest adjacent region (keeps full partition)
for (let pass = 0; pass < 50; pass++) {
  const un = [...cand].filter((k) => !owner.has(k)).sort();
  if (!un.length) break;
  let any = false;
  for (const k of un) {
    const h = hexes.get(k);
    const nbr = new Set();
    for (const [dq, dr] of NB) { const o = owner.get(kk(h.q + dq, h.r + dr)); if (o) nbr.add(o); }
    if (!nbr.size) continue;
    let best = null, bd = Infinity;
    for (const rid of [...nbr].sort()) {
      const s = byId[rid];
      const d = (h.x - s[3]) ** 2 + (h.y - s[4]) ** 2;
      if (d < bd) { bd = d; best = rid; }
    }
    owner.set(k, best); any = true;
  }
  if (!any) break;
}
// island
for (const [k, h] of hexes) {
  if (!owner.has(k) && !inVoid(h) && inEllipse(h, byId.r10)) owner.set(k, 'r10');
}


// --- repair derived contacts to INTENT --------------------------------------
function regionContacts() {
  const m = new Map();
  for (const [k, rid] of owner) {
    const h = hexes.get(k);
    for (const [dq, dr] of NB) {
      const nk = kk(h.q + dq, h.r + dr);
      const o = owner.get(nk);
      if (!o || o === rid || rid > o) continue;
      const pk = pairKey(rid, o);
      if (!m.has(pk)) m.set(pk, []);
      m.get(pk).push([k, nk]);
    }
  }
  return m;
}
const strait = Object.fromEntries(STRAITS);
for (let it = 0; it < 6; it++) {
  const con = regionContacts();
  const extras = [...con.keys()].filter((pk) => !INTENT[pk] && !strait[pk]).sort();
  if (!extras.length) break;
  for (const pk of extras) {
    const [a, b] = pk.split('|');
    const mut = MAINLAND.map((s) => s[0])
      .filter((c) => c !== a && c !== b && INTENT[pairKey(a, c)] && INTENT[pairKey(b, c)]);
    if (!mut.length) { GEN_DIAG.extraResidual.push(pk + ' (no mutual neighbor)'); continue; }
    const pairs = con.get(pk);
    let cx = 0, cy = 0;
    for (const [ka, kb] of pairs) {
      const A = hexes.get(ka), B = hexes.get(kb);
      cx += (A.x + B.x) / 2; cy += (A.y + B.y) / 2;
    }
    cx /= pairs.length; cy /= pairs.length;
    let fixer = null, bd = Infinity;
    for (const c of mut.sort()) {
      const s = byId[c];
      const d = (cx - s[3]) ** 2 + (cy - s[4]) ** 2;
      if (d < bd) { bd = d; fixer = c; }
    }
    let flips = 0;
    for (const [ka, kb] of pairs) { owner.set(ka, fixer); owner.set(kb, fixer); flips += 2; }
    GEN_DIAG.repaired.push({ pair: pk, fixer, flips });
  }
}
{
  const con = regionContacts();
  for (const pk of Object.keys(INTENT)) if (!con.has(pk)) GEN_DIAG.missingEdges.push(pk);
  for (const pk of con.keys()) if (!INTENT[pk] && !strait[pk]) GEN_DIAG.extraResidual.push(pk);
}

// --- region hex lists + connectivity + quota drift ---------------------------
const regionHexes = {};
for (const s of SEED) regionHexes[s[0]] = [];
for (const [k, rid] of owner) regionHexes[rid].push(k);
for (const s of SEED) regionHexes[s[0]].sort();
for (const s of MAINLAND) GEN_DIAG.quotaDrift[s[0]] = regionHexes[s[0]].length - s[7] * HEX_PER_SEC;
function connected(keys) {
  if (!keys.length) return true;
  const set = new Set(keys); const seen = new Set([keys[0]]); const st = [keys[0]];
  while (st.length) {
    const h = hexes.get(st.pop());
    for (const [dq, dr] of NB) {
      const nk = kk(h.q + dq, h.r + dr);
      if (set.has(nk) && !seen.has(nk)) { seen.add(nk); st.push(nk); }
    }
  }
  return seen.size === keys.length;
}
for (const s of SEED) if (!connected(regionHexes[s[0]])) GEN_DIAG.disconnected.push(s[0]);

// --- sector partition ---------------------------------------------------------
function partitionRegion(rid) {
  const s = byId[rid];
  const nSec = s[7];
  const keys = regionHexes[rid];
  const remaining = new Set(keys);
  const n0 = keys.length;
  const sizes = Array.from({ length: nSec }, (_, i) => Math.floor(n0 / nSec) + (i < n0 % nSec ? 1 : 0));
  const clusters = [];
  for (let i = 0; i < nSec; i++) {
    if (!remaining.size) { clusters.push([]); continue; }
    let seed = null, bd = -1;
    for (const k of [...remaining].sort()) {
      const h = hexes.get(k);
      const d = (h.x - s[3]) ** 2 + (h.y - s[4]) ** 2;
      if (d > bd) { bd = d; seed = k; }
    }
    const sh = hexes.get(seed);
    const cl = [seed]; remaining.delete(seed);
    while (cl.length < sizes[i]) {
      let best = null, bdd = Infinity;
      for (const ck of cl) {
        const c = hexes.get(ck);
        for (const [dq, dr] of NB) {
          const nk = kk(c.q + dq, c.r + dr);
          if (!remaining.has(nk)) continue;
          const h = hexes.get(nk);
          const d = (h.x - sh.x) ** 2 + (h.y - sh.y) ** 2;
          if (d < bdd || (d === bdd && nk < best)) { bdd = d; best = nk; }
        }
      }
      if (best === null) break;
      cl.push(best); remaining.delete(best);
    }
    clusters.push(cl);
  }
  for (let guard = 0; guard < 500 && remaining.size; guard++) {
    let done = [];
    for (const k of [...remaining].sort()) {
      const h = hexes.get(k);
      let best = -1, bs = Infinity;
      for (const [dq, dr] of NB) {
        const nk = kk(h.q + dq, h.r + dr);
        const ci = clusters.findIndex((cl) => cl.includes(nk));
        if (ci >= 0 && clusters[ci].length < bs) { bs = clusters[ci].length; best = ci; }
      }
      if (best >= 0) { clusters[best].push(k); done.push(k); }
    }
    if (!done.length) { const k = [...remaining].sort()[0]; clusters[0].push(k); done.push(k); }
    for (const k of done) remaining.delete(k);
  }
  // rebalance: no fragment sectors — grow any cluster under 3 hexes by taking
  // an adjacent boundary hex from the biggest adjacent donor cluster
  for (let guard = 0; guard < 60; guard++) {
    const smallIdx = clusters.findIndex((c) => c.length && c.length < 3);
    if (smallIdx < 0) break;
    const small = new Set(clusters[smallIdx]);
    let donor = -1, donorHex = null, ds = 3;
    clusters.forEach((cl, ci) => {
      if (ci === smallIdx || cl.length <= ds) return;
      for (const k of cl) {
        const h = hexes.get(k);
        if (NB.some(([dq, dr]) => small.has(kk(h.q + dq, h.r + dr)))) {
          if (cl.length > ds) { ds = cl.length; donor = ci; donorHex = k; }
          break;
        }
      }
    });
    if (donor < 0) break;
    clusters[donor] = clusters[donor].filter((k) => k !== donorHex);
    clusters[smallIdx].push(donorHex);
  }
  return clusters.filter((c) => c.length);
}
const regionClusters = {};
for (const s of SEED) {
  regionClusters[s[0]] = partitionRegion(s[0]);
}

// --- user-sealed hex assignment (2026-07-07, mockup edit-layer export) -------
// The mockup preview layer is the authoring surface; confirmed swaps bake
// here. Keys are hex 'q,r' → target sector of the SAME region. NOTE: indices
// are tied to this seed's deterministic partition — if SEED changes, re-author
// via the editor rather than hand-patching this list.
const USER_SWAPS = {
  '9,17': 'r9_s3', '10,16': 'r9_s1', '9,15': 'r9_s4', '11,15': 'r9_s3',
  '8,16': 'r9_s4', '12,14': 'r9_s3', '8,17': 'r9_s3', '12,16': 'r9_s1',
  '12,15': 'r9_s0', '2,16': 'r6_s2', '2,15': 'r6_s1', '20,7': 'r4_s2',
  '21,6': 'r4_s0', '11,9': 'r7_s4', '14,8': 'r7_s2', '13,9': 'r7_s3',
  '12,11': 'r7_s4', '9,9': 'r2_s3', '6,10': 'r2_s2', '7,9': 'r2_s2',
  '7,10': 'r2_s3', '8,8': 'r2_s4', '8,10': 'r2_s3', '11,5': 'r3_s6',
  '13,6': 'r3_s7', '10,6': 'r3_s5', '11,6': 'r3_s7', '9,10': 'r1_s0',
  '8,12': 'r1_s3', '10,10': 'r1_s2', '10,12': 'r1_s3', '4,14': 'r6_s5',
  '3,14': 'r6_s2', '2,13': 'r6_s0', '2,14': 'r6_s0', '2,12': 'r6_s3',
  '5,11': 'r6_s3', '4,12': 'r6_s5',
};
for (const [hk, sid] of Object.entries(USER_SWAPS)) {
  const [rid, idxs] = sid.split('_s');
  const idx = +idxs;
  const cls = regionClusters[rid];
  if (!cls || !cls[idx]) { GEN_DIAG.extraResidual.push('swap target missing: ' + sid); continue; }
  const from = cls.findIndex((c) => c.includes(hk));
  if (from < 0 || from === idx) continue;
  cls[from] = cls[from].filter((k) => k !== hk);
  cls[idx].push(hk);
}
// --- carve pass: 대산맥 full width + 하서회랑 (2026-07-07, post-partition) ----
// The user's layout is sealed to this partition, so the wider range is carved
// AFTER ownership instead of re-running growth. Carved hexes leave their
// sector and become void range. The tail eats the UPPER 서역-하북 contact
// (mountain-grade), leaving the lower hills door = 하서회랑. Adjacency COUNT
// is inviolable (ruling): post-carve verification below.
// Tail hugs the 서역 side of the contact (eats desert flank, not 하북's
// farmland) so the corridor narrows without starving 하북's west sector.
// Corridor width ruling (2026-07-07): door-class rank must read on the map —
// hills 1300 (하서회랑) is a WIDER door than pass 1000, so its physical
// frontage stays above the passes' (4-5 contact edges, not a 2-hex slit).
const CARVE_POLY = [[285, 10], [350, 85], [400, 150], [420, 195], [424, 235]];
const CARVE_W = 48;
const inCarve = (h) => {
  for (let i = 0; i < CARVE_POLY.length - 1; i++) {
    if (distSeg(h.x, h.y, CARVE_POLY[i][0], CARVE_POLY[i][1],
      CARVE_POLY[i + 1][0], CARVE_POLY[i + 1][1]) < CARVE_W) return true;
  }
  return false;
};
for (const [k, h] of hexes) {
  if (!owner.has(k) || !inCarve(h)) continue;
  const rid = owner.get(k);
  owner.delete(k);
  regionHexes[rid] = regionHexes[rid].filter((x) => x !== k);
  const cls = regionClusters[rid];
  const ci = cls.findIndex((c) => c.includes(k));
  if (ci >= 0) cls[ci] = cls[ci].filter((x) => x !== k);
  rangeHexes.push(h);
}
// post-carve law checks: no INTENT edge severed, no sector fragmented
{
  const con = regionContacts();
  for (const pk of Object.keys(INTENT)) if (!con.has(pk)) GEN_DIAG.missingEdges.push(pk + ' (post-carve)');
  for (const s of SEED) {
    for (const cl of regionClusters[s[0]]) {
      if (!cl.length) { GEN_DIAG.disconnected.push(s[0] + ' (empty sector post-carve)'); continue; }
      if (!connected(cl)) GEN_DIAG.disconnected.push(s[0] + ' (sector split post-carve)');
    }
  }
}

// 대환 (the Western Ring, ruling 2026-07-07): the left hemisphere's outer rim
// — sea-side void mountains sweeping range → 서역 → 관중 → 촉. Pure visual
// mass on SEA hexes: never touches land or the derived graph (doors read as
// notches in the wall). One world-cause for the desert (rain shadow), the
// basins, and the great range's finality.
{
  const rangeKeys = new Set(rangeHexes.map((h) => kk(h.q, h.r)));
  const RING_REGIONS = new Set(['r5', 'r6', 'r8']);
  for (const [k, h] of hexes) {
    if (owner.has(k) || rangeKeys.has(k)) continue;
    let nearRing = false, nearOther = false;
    for (const [dq, dr] of NB) {
      const o = owner.get(kk(h.q + dq, h.r + dr));
      if (!o) continue;
      if (RING_REGIONS.has(o)) nearRing = true; else nearOther = true;
    }
    if (nearRing && !nearOther) rangeHexes.push(h);
  }
}
GEN_DIAG.rangeHexCount = rangeHexes.length;
// central massif (중앙 산괴): the knot's hexes, exported for sacred-mountain
// rendering — the ONLY mountain outside the wall system; proper name TBD by
// the user. Structure sealed 2026-07-07: keeping it is what holds BOTH
// quad-junction non-adjacencies (하북∦한경, 중원∦초원) without door special
// cases (a near-zero "alps door" would legalize the 하북+한경 seat pair).
const massifHexes = rangeHexes.filter((h) =>
  Math.hypot(h.x - VOID_KNOT.x, h.y - VOID_KNOT.y) < VOID_KNOT.rad + HEXR * 1.6);

for (const s of SEED) GEN_DIAG.sectorSizes[s[0]] = regionClusters[s[0]].map((c) => c.length);

// --- roles: user-sealed seats (2026-07-07, authored via mockup edit layer) ---
const centroid = (cl) => {
  let x = 0, y = 0;
  for (const k of cl) { const h = hexes.get(k); x += h.x; y += h.y; }
  return { x: x / cl.length, y: y / cl.length };
};
// capitals: 서역 farthest-NW oasis (max Moscow, depth ~6 hexes) · 초원 forward
// (Ulaanbaatar) · 동북 ON its strait sector (port capital — the seat's meaning
// IS the island link; profile amended from "deep interior")
const capitals = { r5: 2, r3: 7, r4: 2 };
// cities (battle-summoning placement principle, user 2026-07-07: every city
// except 서역's pulls fights toward it): 하북/한경 gate-cities absorbing the
// whole 중원 border · 강남 dual-axis pivot (중원+촉) · 관중 gate-city on the
// mountain triple junction 중원/하북/촉 (basin-grammar named exception) ·
// 동남해 port (both straits land here) · 중원 keep city (interior — the only
// city invisible from any border; flatness amendment, mild spike)
const cities = { r2: 3, r7: 4, r9: 4, r6: 5, r10: 3, r1: 3 };
// 관중 rim: the 2 non-city sectors with most hexes adjacent to 서역/하북/중원
const rimCount = regionClusters.r6.map((cl) => {
  let n = 0;
  for (const k of cl) {
    const h = hexes.get(k);
    for (const [dq, dr] of NB) {
      const o = owner.get(kk(h.q + dq, h.r + dr));
      if (o === 'r5' || o === 'r2' || o === 'r1') { n++; break; }
    }
  }
  return n;
});
const rimIdx = rimCount.map((n, i) => [n, i]).filter(([, i]) => i !== cities.r6)
  .sort((a, b) => b[0] - a[0] || a[1] - b[1]).slice(0, 2).map((x) => x[1]);

// --- sector values (parity v5 + econ ladder v2, 가안 2026-07-07) -----------------
// Pop: Σ 6.0 per region — EQUAL START (user ruling: same blood budget for
// every region; divergence only via play). Shapes only where a profile
// demands (초원 spread pop / spiked econ = "no killable center").
// Econ: Σ = ladderIndex × 6.0, ladder v2 = 0.55 + 0.45 × inbound/avg over
// the border-class layout, + projection-shortfall credit (동남해). Core
// debit and fiction band HELD by user (depth value unmeasured).
// City rule (sealed direction 2026-07-07): coupled by default — where the
// money spikes, the people spike (a city); 초원-style separation only where
// the profile demands it. Flat lands stay flat by identity: 중원 (stakes
// smeared over every sector) and 촉 (the whole basin is one dense city-land).
// Spike tiers: strong ≈ 40–50% of the regional total (the land IS the point);
// mild ≈ 25–35% (real hinterland behind the city).
function sectorSpec(rid, i) { // [pop, econ, terrain]
  switch (rid) {
    case 'r1': return i === cities.r1               // 1.25 — crown; keep city (interior)
      ? [2.0, 2.4, 'plains'] : [4 / 3, 1.7, 'plains'];
    case 'r2': return i === cities.r2               // 1.15 — gate-city duelist
      ? [2.0, 2.3, 'plains'] : [1.0, 1.15, 'plains'];
    case 'r7': return i === cities.r7               // 1.15 — gate-city duelist (mirror twin)
      ? [2.0, 2.3, 'river-valley'] : [1.0, 1.15, 'river-valley'];
    case 'r9': return i === cities.r9               // 0.92 — dual-axis pivot city (중원+촉)
      ? [2.0, 1.84, 'plains'] : [1.0, 0.92, 'plains'];
    case 'r8': return [2.0, 1.92, 'plains'];        // 0.96 — densest land, flat by identity
    case 'r10': return i === cities.r10             // 0.77 — port city, straits land here
      ? [2.4, 1.85, 'plains'] : [1.2, 0.923, 'plains'];
    case 'r3': return i === capitals.r3             // 1.09 — SEPARATED (nomads): econ spike, pop spread
      ? [0.75, 2.4, 'steppe'] : [0.75, 0.59, 'steppe'];
    case 'r4': return i === capitals.r4             // 0.93 — port capital on the strait (개마고원)
      ? [1.5, 1.5, 'highland'] : [0.9, 0.82, 'highland'];
    case 'r5': return i === capitals.r5             // 0.80 — oasis city (strong tier)
      ? [1.5, 2.4, 'oasis'] : [0.5, 0.27, 'desert'];
    case 'r6': return i === cities.r6               // 1.06 — GATE-CITY on the mountain
      ? [2.1, 2.3, 'mountain']                      // triple junction (terrain stays)
      : rimIdx.includes(i) ? [0.5, 0.5, 'mountain'] : [2.9 / 3, 1.02, 'plains'];
    default: return [1, 1, 'plains'];
  }
}

// --- build map object ------------------------------------------------------------
const sectors = {}; const regions = [];
const hexSector = new Map(); // hexKey -> sectorId
for (const s of SEED) {
  const rid = s[0];
  const ids = regionClusters[rid].map((cl, i) => {
    const sid = `${rid}_s${i}`;
    const [pop, econ, terr] = sectorSpec(rid, i);
    sectors[sid] = { id: sid, regionId: rid, economyValue: econ, populationValue: pop,
      usableEconomy: 1, usablePop: 1, fortTier: 'none', garrison: 0,
      mapUnits: cl.map((k) => { const h = hexes.get(k); return { q: h.q, r: h.r, terrainLayer: terr }; }) };
    for (const k of cl) hexSector.set(k, sid);
    return sid;
  });
  regions.push({ id: rid, name: s[1], sizeClass: s[2], sectorIds: ids });
}
// edges: one per intended border, representative sector pair = max contact
const secContacts = new Map(); // regionPair -> Map(secPair -> count) + frontage
for (const [k, rid] of owner) {
  const h = hexes.get(k);
  for (const [dq, dr] of NB) {
    const nk = kk(h.q + dq, h.r + dr);
    const o = owner.get(nk);
    if (!o || o === rid || rid > o) continue;
    const pk = pairKey(rid, o);
    if (!secContacts.has(pk)) secContacts.set(pk, { front: 0, pairs: new Map() });
    const e = secContacts.get(pk);
    e.front++;
    const sp = hexSector.get(k) + '>' + hexSector.get(nk);
    e.pairs.set(sp, (e.pairs.get(sp) || 0) + 1);
  }
}
const edges = [];
const pairClass = {}; const frontage = {};
for (const pk of Object.keys(INTENT)) {
  const e = secContacts.get(pk);
  if (!e) continue; // reported missing in diag
  const rep = [...e.pairs.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))[0][0];
  const [sa, sb] = rep.split('>');
  const cls = INTENT[pk];
  pairClass[pk] = cls; frontage[pk] = e.front;
  edges.push({ a: sa, b: sb,
    choke: cls === 'open'
      ? { class: 'open', cap: Infinity, removalPath: 'n/a (open border)' }
      : { class: cls, cap: DOOR[cls], removalPath: REMOVAL[cls] },
    frontageHexes: e.front });
}
for (const [pk, cap] of STRAITS) {
  const [a, b] = pk.split('|');
  // representative coastal sectors: nearest centroids across the water.
  // 동남해 side is ANCHORED to its port city ("the entrance IS the city",
  // user ruling 2026-07-07) — both straits land at the same sector.
  let bestA = null, bestB = null, bd = Infinity;
  for (const saId of regions.find((r) => r.id === a).sectorIds) {
    const ca = centroid(sectors[saId].mapUnits.map((u) => kk(u.q, u.r)));
    if (a === 'r4' && saId !== `r4_s${capitals.r4}`) continue; // port capital IS the landing
    for (const sbId of regions.find((r) => r.id === b).sectorIds) {
      if (b === 'r10' && sbId !== `r10_s${cities.r10}`) continue;
      const cb = centroid(sectors[sbId].mapUnits.map((u) => kk(u.q, u.r)));
      const d = (ca.x - cb.x) ** 2 + (ca.y - cb.y) ** 2;
      if (d < bd) { bd = d; bestA = saId; bestB = sbId; }
    }
  }
  pairClass[pk] = 'strait'; frontage[pk] = 0;
  edges.push({ a: bestA, b: bestB,
    choke: { class: 'strait', cap, removalPath: REMOVAL.strait }, frontageHexes: 0 });
}

// --- partial river (invasion-corridor authoring, user ruling 2026-07-07) ----
// r3|r7 stays class OPEN (binary projection rule: an open segment admits the
// full field), but the river VISUALLY covers the border except one westmost
// gate sector's segment — the corridor where a 초원↔한경 campaign must cross.
const partialRivers = {};
{
  const pk = 'r3|r7';
  const pairs = []; // [r3hexKey, r7hexKey, xMid, r7sid]
  for (const [k, rid] of owner) {
    if (rid !== 'r3') continue;
    const h = hexes.get(k);
    for (const [dq, dr] of NB) {
      const nk = kk(h.q + dq, h.r + dr);
      if (owner.get(nk) !== 'r7') continue;
      pairs.push([k, nk, (h.x + hexes.get(nk).x) / 2, hexSector.get(nk)]);
    }
  }
  if (pairs.length) {
    const secX = {}; // mean contact x per r7-side sector
    for (const p of pairs) (secX[p[3]] = secX[p[3]] || []).push(p[2]);
    const gateSid = Object.entries(secX)
      .map(([sid, xs]) => [sid, xs.reduce((a, b) => a + b, 0) / xs.length])
      .sort((a, b) => a[1] - b[1])[0][0]; // westmost 한경 sector = the gate
    partialRivers[pk] = pairs.filter((p) => p[3] !== gateSid).map((p) => p[0] + '|' + p[1]);
  }
}

const CRADLE_MAP = { regions, sectors, edges };
// canonical reference binding (spec §2 A–E composite identities; viable in v4)
const CRADLE_BINDING = {
  A: ['r1', 'r7'], B: ['r5', 'r6'], C: ['r2', 'r3'], D: ['r8', 'r9'], E: ['r4', 'r10'],
};
const CRADLE_META = {
  hexR: HEXR,
  regionCenters: Object.fromEntries(SEED.map((s) => {
    const c = centroid(regionHexes[s[0]]); return [s[0], c];
  })),
  capitals: Object.fromEntries(Object.entries(capitals).map(([rid, i]) => [rid, `${rid}_s${i}`])),
  cities: Object.fromEntries(Object.entries(cities).map(([rid, i]) => [rid, `${rid}_s${i}`])),
  pairClass, frontage, partialRivers,
  rangeHexes: rangeHexes.map((h) => ({ q: h.q, r: h.r, x: h.x, y: h.y })),
  massif: {
    hexes: massifHexes.map((h) => ({ q: h.q, r: h.r, x: h.x, y: h.y })),
    cx: VOID_KNOT.x, cy: VOID_KNOT.y, label: '중앙 산괴',
  },
};

const _api = { CRADLE_MAP, CRADLE_BINDING, CRADLE_META, GEN_DIAG };
if (typeof module !== 'undefined' && module.exports) module.exports = _api;
else (window.TC = window.TC || {}).gen = _api;
