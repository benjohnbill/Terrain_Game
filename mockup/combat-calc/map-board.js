'use strict';
// PROTOTYPE — L2 adapter: sealed cradle map (map-gen.js) → the realm
// board shape tournament.js plays on. Everything geography-derived
// (caps, doors, front keys, border-sector counts, economy ledger) comes
// from the map; the start-state sizing constants below are HARNESS-tier
// 가안 (mature-state start, M13 pool rule) — they bound proof power and
// are NEVER seal candidates. Dual-mode. js/ must not import.

const deps = (typeof require !== 'undefined')
  ? { ECON: require('./econ.js'), LOADER: require('./map-loader.js') }
  : { ECON: window.TC && window.TC.econ, LOADER: window.TC && window.TC.loader };

const BOARD_GAAN = {
  startFieldFrac: 0.7,          // parity start: field = 70% of cap for every seat
  garrisonPerBorderSector: 300, // mature-state shield per border sector
  interiorGarrison: 300,        // per interior sector (fixture-board constant)
  capitalGarrison: 1200,        // fixture-board default
  startFort: 'walls',           // mature-state start: walls at every front
};

function makeBoardFromMap(map, binding, gaan = BOARD_GAAN) {
  const regionToSeat = {};
  for (const [seat, rids] of Object.entries(binding))
    for (const rid of rids) regionToSeat[rid] = seat;

  return Object.entries(binding).map(([name, regionIds]) => {
    const secs = regionIds.flatMap((rid) => deps.LOADER.sectorsOf(map, rid));
    const fieldCap = deps.ECON.nationalCap(secs);

    // cross-seat fronts: border-sector count + door caps per neighbor seat
    const borderSectors = new Set();
    const frontSectors = {};   // neighbor seat -> Set of own border sectors
    const exits = [];
    for (const rid of regionIds) {
      const nbrs = deps.LOADER.neighborsOf(map, rid);
      for (const [nbrRegion, info] of Object.entries(nbrs)) {
        const nbrSeat = regionToSeat[nbrRegion];
        if (nbrSeat === name) continue; // internal border
        exits.push({ cap: info.open ? Infinity : info.cap });
        (frontSectors[nbrSeat] ??= new Set());
        for (const sid of info.borderSectorIds) {
          frontSectors[nbrSeat].add(sid);
          borderSectors.add(sid);
        }
      }
    }
    if (exits.length === 0) exits.push({ cap: Infinity });

    const frontG = {}; const fortAt = {};
    for (const [nbrSeat, sids] of Object.entries(frontSectors)) {
      frontG[nbrSeat] = sids.size * gaan.garrisonPerBorderSector;
      fortAt[nbrSeat] = gaan.startFort;
    }

    const interior = secs.length - borderSectors.size;
    const yieldBase = secs.reduce((t, s) => t + s.economyValue, 0);
    const field = Math.round(fieldCap * gaan.startFieldFrac);
    const garrisonTotal = Object.values(frontG).reduce((s, g) => s + g, 0)
      + interior * gaan.interiorGarrison + gaan.capitalGarrison;

    return {
      name,
      seatType: regionIds.includes('r1') ? 'center' : 'flank',
      regionIds: [...regionIds],
      field, fieldCap, interior,
      capitalGarrison: gaan.capitalGarrison,
      frontG, frontCap: { ...frontG }, fortAt,
      exits, staging: false,
      usable: 1.0,
      yieldBase,
      sectorYield: yieldBase / interior,
      pool: Math.round((field + garrisonTotal) * 1.5),
      recruitBonus: 0,
      alive: true, vassalOf: null,
      truce: {}, wars: [],
    };
  });
}

// ------------------------------------------------------- cradle tournament
// Sheet-12 rotation over the real map: for every viable seating, every
// archetype takes every seat as focal (others drawn at random), reps times.
const TOURNEY = (typeof require !== 'undefined')
  ? require('./tournament.js')
  : window.TC && window.TC.tourney;

function runCradleTournament({ map, bindings, reps = 1, seed = 1, harness } = {}) {
  const rng = TOURNEY.mulberry32(seed);
  const pickFrom = (arr) => arr[Math.floor(rng() * arr.length)];
  const records = [];
  bindings.forEach((binding, bindingIndex) => {
    const seats = Object.keys(binding);
    for (const focal of TOURNEY.ARCHETYPES) {
      for (const seat of seats) {
        for (let rep = 0; rep < reps; rep++) {
          const assignment = {};
          for (const s of seats) {
            assignment[s] = {
              archetype: s === seat ? focal : pickFrom(TOURNEY.ARCHETYPES),
              temperament: pickFrom(TOURNEY.TEMPERAMENTS),
            };
          }
          records.push({
            bindingIndex, binding, focal, seat,
            ...TOURNEY.runMatch(assignment, {
              seed: Math.floor(rng() * 1e9),
              board: makeBoardFromMap(map, binding),
              harness,
            }),
          });
        }
      }
    }
  });
  return records;
}

// Watch-flag report: region-holder winrate per watched region, against
// the all-seat baseline (decided matches ÷ seat slots).
function watchFlags(records, regionIds) {
  const holderOf = (binding, rid) =>
    Object.keys(binding).find((s) => binding[s].includes(rid));
  const regions = {};
  for (const rid of regionIds) {
    let wins = 0;
    for (const r of records) {
      if (r.winner && r.winner === holderOf(r.binding, rid)) wins++;
    }
    regions[rid] = { matches: records.length, wins, rate: wins / records.length };
  }
  const decided = records.filter((r) => r.winner).length;
  const seatCount = Object.keys(records[0].binding).length;
  return {
    regions,
    baseline: decided / (records.length * seatCount),
    undecided: records.length - decided,
  };
}

const _api = { makeBoardFromMap, BOARD_GAAN, runCradleTournament, watchFlags };
if (typeof module !== 'undefined' && module.exports) module.exports = _api;
else (window.TC = window.TC || {}).board = _api;
