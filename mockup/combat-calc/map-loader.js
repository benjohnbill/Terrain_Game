'use strict';
// PROTOTYPE — adapter from a terrain-cradle map to the shapes match.js and
// econ.js consume. Derives fieldCap (nationalCap), exits (cross-seat choke
// edges), facing-front garrisons (adjacency). mapUnits ignored (spatial).
// No new arithmetic. Dual-mode. js/ must not import.

const ECON = (typeof require !== 'undefined')
  ? require('./econ.js')
  : (window.TC && window.TC.econ);

function sectorsOf(map, regionId) {
  const region = map.regions.find((r) => r.id === regionId);
  return region.sectorIds.map((id) => map.sectors[id]);
}

// { neighborRegionId: { cap, open, borderSectorIds } }
function neighborsOf(map, regionId) {
  const out = {};
  const rOf = (sid) => map.sectors[sid].regionId;
  for (const e of map.edges) {
    const ra = rOf(e.a); const rb = rOf(e.b);
    if (ra === regionId && rb !== regionId) {
      (out[rb] ??= { cap: 0, open: false, borderSectorIds: [] });
      if (e.choke.cap === Infinity) out[rb].open = true; else out[rb].cap += e.choke.cap;
      out[rb].borderSectorIds.push(e.a);
    } else if (rb === regionId && ra !== regionId) {
      (out[ra] ??= { cap: 0, open: false, borderSectorIds: [] });
      if (e.choke.cap === Infinity) out[ra].open = true; else out[ra].cap += e.choke.cap;
      out[ra].borderSectorIds.push(e.b);
    }
  }
  return out;
}

function loadMap(map, { assignment } = {}) {
  const seats = assignment
    ? Object.entries(assignment).map(([name, regionIds]) => ({ name, regionIds }))
    : map.regions.map((r) => ({ name: r.name, regionIds: [r.id] }));

  const regionToSeat = {};
  for (const s of seats) for (const rid of s.regionIds) regionToSeat[rid] = s.name;

  const realms = seats.map((seat) => {
    const secs = seat.regionIds.flatMap((rid) => sectorsOf(map, rid));
    const fieldCap = ECON.nationalCap(secs);
    const garrisons = secs.reduce((s, x) => s + (x.garrison || 0), 0);

    const exits = [];
    const fronts = {};
    for (const rid of seat.regionIds) {
      const nbrs = neighborsOf(map, rid);
      for (const [nbrRegion, info] of Object.entries(nbrs)) {
        const nbrSeat = regionToSeat[nbrRegion];
        if (nbrSeat === seat.name) continue; // internal border
        exits.push({ cap: info.open ? Infinity : info.cap });
        const g = info.borderSectorIds.reduce((s, sid) => s + (map.sectors[sid].garrison || 0), 0);
        fronts[nbrSeat] = (fronts[nbrSeat] || 0) + g;
      }
    }
    if (exits.length === 0) exits.push({ cap: Infinity });

    return { name: seat.name, alive: true, vassalOf: null,
      field: fieldCap, fieldCap, garrisons, exits, fronts };
  });

  return { realms };
}

const _api = { loadMap, sectorsOf };
if (typeof module !== 'undefined' && module.exports) module.exports = _api;
else (window.TC = window.TC || {}).loader = _api;
