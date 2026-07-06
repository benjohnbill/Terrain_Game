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

// void mountain range (user's drawn 산맥, extended to seal the 서역–초원 gap):
// LEGAL basis — not an untraversable choke (C3/C4 forbids) but NON-BORDER
// terrain: hexes owned by no sector, like sea. War never crosses here.
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
  GEN_DIAG.sectorSizes[s[0]] = regionClusters[s[0]].map((c) => c.length);
}

// --- roles: capitals & basin rim ----------------------------------------------
const centroid = (cl) => {
  let x = 0, y = 0;
  for (const k of cl) { const h = hexes.get(k); x += h.x; y += h.y; }
  return { x: x / cl.length, y: y / cl.length };
};
function pickSector(rid, score) { // returns cluster index maximizing score
  let best = -1, bv = -Infinity;
  regionClusters[rid].forEach((cl, i) => {
    const v = score(centroid(cl), cl, i);
    if (v > bv) { bv = v; best = i; }
  });
  return best;
}
const dist2 = (p, s) => (p.x - s[3]) ** 2 + (p.y - s[4]) ** 2;
const capitals = {};
// 서역: oasis capital, deep (max min-dist to 하북/관중 = Moscow)
capitals.r5 = pickSector('r5', (p) => Math.min(dist2(p, byId.r2), dist2(p, byId.r6)));
// 초원: forward capital (nearest to 하북–한경 midline = Ulaanbaatar-forward)
const mid27 = { 3: (byId.r2[3] + byId.r7[3]) / 2, 4: (byId.r2[4] + byId.r7[4]) / 2 };
capitals.r3 = pickSector('r3', (p) => -((p.x - mid27[3]) ** 2 + (p.y - mid27[4]) ** 2));
// 동북: deep interior capital (max min-dist to 초원/한경/동남해)
capitals.r4 = pickSector('r4', (p) =>
  Math.min(dist2(p, byId.r3), dist2(p, byId.r7), dist2(p, byId.r10)));
// 관중 rim: 3 sectors with most hexes adjacent to 서역/하북/중원 → mountain rim
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
const rimIdx = rimCount.map((n, i) => [n, i]).sort((a, b) => b[0] - a[0] || a[1] - b[1])
  .slice(0, 3).map((x) => x[1]);

// --- sector values (parity v5 + econ ladder v2, 가안 2026-07-07) -----------------
// Pop: Σ 6.0 per region — EQUAL START (user ruling: same blood budget for
// every region; divergence only via play). Shapes only where a profile
// demands (초원 spread pop / spiked econ = "no killable center").
// Econ: Σ = ladderIndex × 6.0, ladder v2 = 0.55 + 0.45 × inbound/avg over
// the border-class layout, + projection-shortfall credit (동남해). Core
// debit and fiction band HELD by user (depth value unmeasured).
function sectorSpec(rid, i) { // [pop, econ, terrain]
  switch (rid) {
    case 'r1': return [1.5, 1.875, 'plains'];       // 1.25 — sole crown
    case 'r2': return [1.2, 1.38, 'plains'];        // 1.15 — twin
    case 'r7': return [1.2, 1.38, 'river-valley'];  // 1.15 — twin
    case 'r9': return [1.2, 1.1, 'plains'];         // 0.92 — river-shielded
    case 'r8': return [2.0, 1.92, 'plains'];        // 0.96 — densest land
    case 'r10': return [1.5, 1.16, 'plains'];       // 0.77 — island (fiction band parked)
    case 'r3': return i === capitals.r3             // 1.09 — econ spike, pop spread
      ? [0.75, 2.4, 'plains'] : [0.75, 0.59, 'steppe'];
    case 'r4': return i === capitals.r4             // 0.93 — deep capital
      ? [1.5, 1.5, 'plains'] : [0.9, 0.82, 'steppe'];
    case 'r5': return i === capitals.r5             // 0.80 — oasis spike
      ? [1.5, 2.4, 'oasis'] : [0.5, 0.27, 'desert'];
    case 'r6': return rimIdx.includes(i)            // 1.06 — rim/floor basin
      ? [0.5, 0.5, 'mountain'] : [1.5, 1.62, 'plains'];
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
  const other = byId[b === 'r10' ? a : b];
  // representative coastal sectors: nearest centroids across the water
  let bestA = null, bestB = null, bd = Infinity;
  for (const saId of regions.find((r) => r.id === a).sectorIds) {
    const ca = centroid(sectors[saId].mapUnits.map((u) => kk(u.q, u.r)));
    for (const sbId of regions.find((r) => r.id === b).sectorIds) {
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
  pairClass, frontage, partialRivers,
  rangeHexes: rangeHexes.map((h) => ({ q: h.q, r: h.r, x: h.x, y: h.y })),
};

const _api = { CRADLE_MAP, CRADLE_BINDING, CRADLE_META, GEN_DIAG };
if (typeof module !== 'undefined' && module.exports) module.exports = _api;
else (window.TC = window.TC || {}).gen = _api;
