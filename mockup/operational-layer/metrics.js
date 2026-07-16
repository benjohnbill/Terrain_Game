'use strict';
/* Slice-2 measurement grid — metrics 1–4 (spec §11; ticket 07).
 *
 * Four registered reads over the operational-layer probe. Every grid sweeps the
 * layer-restoration knobs (fillFactor, shieldCommit, recoveryWhileMarching) as
 * explicit dimensions from the start — the slice-1 lesson: no contradictory
 * layer is silently stubbed, and no run inherits a hidden choice.
 *
 * This file encodes NO balance decision. It reports counts, rates, and tables;
 * whether any number is "good" is the reader's judgement (metric 4's re-grading
 * is a dedicated later session, §1 rider c). Classifications used here
 * (attackerWins, routed, bloody repulse) are the SEALED calculator's own
 * outputs, not new thresholds invented in the harness.
 *
 * Metric 5 (fizzle re-read vs the L2 baseline) needs bots and lands with
 * ticket 10 — it is out of this ticket's scope by the §11 split.
 */
const B = require('../../js/battle.js');
const P = require('./probe.js');

/* Attacker arrival effectiveness (and wear) for a march of `hexes`, via the
   sealed movement/fatigue contract (probe.marchArrival). Memoised per key so a
   grid sharing distances stays cheap and provably deterministic.
   Forced march (§3) is deliberately NOT swept: §11 names distance / defense
   multipliers / reserve reach as metric 2's axes, and adding a fourth would be
   this harness choosing a dimension the spec did not register. probe.marchArrival
   carries the capability (and is tested); the sweep is a registered gap. */
const _arrivalCache = new Map();
function arrival(hexes, recoveryWhileMarching) {
  const key = hexes + '|' + recoveryWhileMarching;
  if (!_arrivalCache.has(key)) _arrivalCache.set(key, P.marchArrival({ hexes, recoveryWhileMarching }));
  return _arrivalCache.get(key);
}

const RESTORATION = {
  fillFactors: [0, 1],
  shieldCommits: [null, 8],
  recoveries: [true, false],
};

function forEachRestoration(fn) {
  for (const fillFactor of RESTORATION.fillFactors)
    for (const shieldCommit of RESTORATION.shieldCommits)
      for (const recoveryWhileMarching of RESTORATION.recoveries)
        fn({ fillFactor, shieldCommit, recoveryWhileMarching });
}

/* =====================================================================
   METRIC 1 — parity surface: wear x commit x quality at EQUAL MASS.
   Does §1's grammar emerge (defender's bloody repulse; piercing possible
   but expensive)?
   ===================================================================== */
const PARITY = {
  mass: 3000,                    // attacker mass == field-army mass (parity)
  front: { garrison: 500, terrain: 'plains', fortification: 'none' }, // shield always breaks -> 결전
  distances: [0, 3, 6, 12],      // attacker march -> arrival wear
  defenderCommit: 8,
  attackerCommits: [4, 8, 12, 16, 20],
  attackerQualities: [1.0, 1.25, 1.5],
};

function parityGrid() {
  const cells = [];
  forEachRestoration((knobs) => {
    for (const distance of PARITY.distances)
      for (const attackerCommit of PARITY.attackerCommits)
        for (const quality of PARITY.attackerQualities) {
          const arr = arrival(distance, knobs.recoveryWhileMarching);
          const sc = {
            attacker: { size: PARITY.mass, commit: attackerCommit, quality, fatigue: arr.effectiveness },
            front: PARITY.front,
            fieldArmy: { reaches: true, size: PARITY.mass, commit: PARITY.defenderCommit, quality: 1.0, fatigue: 1.0 },
            escape: 'OPEN',
          };
          const o = P.resolveWith(sc, knobs);
          const d = o.decisiveBattle;
          cells.push({
            distance, attackerWear: arr.wear,
            commitDelta: attackerCommit - PARITY.defenderCommit,
            qualityDelta: quality - 1.0,
            knobs,
            branch: o.branch,
            attackerWins: d ? d.attackerWins : null,
            routed: d ? d.routed : null,
            loserTotalLoss: d ? d.loserTotalLoss : null,
            bloodyRepulse: !!(d && !d.attackerWins && !d.routed),
          });
        }
  });

  const decisive = cells.filter(c => c.branch === 'DECISIVE');
  const equalLeverWorn = decisive.filter(c => c.commitDelta === 0 && c.qualityDelta === 0 && c.attackerWear > 0);
  const pierceable = decisive.filter(c => c.commitDelta > 0 || c.qualityDelta > 0);
  const summary = {
    cells: cells.length,
    equalLeverWornAttackerWins: equalLeverWorn.filter(c => c.attackerWins).length,
    equalLeverWornCells: equalLeverWorn.length,
    equalLeverBloodyRepulseRate: rate(equalLeverWorn.filter(c => c.bloodyRepulse).length, equalLeverWorn.length),
    equalLeverRoutRate: rate(equalLeverWorn.filter(c => c.routed).length, equalLeverWorn.length),
    piercingWins: pierceable.filter(c => c.attackerWins).length,
    piercingCells: pierceable.length,
    piercingFrontier: piercingFrontier(decisive),
  };
  return { cells, summary };
}

/* The piercing frontier by wear depth: at each attacker wear level, the
   smallest SINGLE-lever gap that flips the parity cell to an attacker win —
   either a commit gap (quality at parity) or a quality gap (commit at parity).
   null = no gap in the swept range wins on that lever alone at that wear (it
   needs both levers, or more than the sweep offers). Keyed on wear, not
   distance, so the recovery knob's two wear depths per distance separate
   cleanly. Descriptive: it locates where piercing gets expensive as wear
   deepens, and decides nothing. */
function piercingFrontier(decisive) {
  const wears = [...new Set(decisive.map(c => c.attackerWear))].sort((a, b) => a - b);
  return wears.map((wear) => {
    const at = decisive.filter(c => c.attackerWear === wear);
    const byCommit = at.filter(c => c.qualityDelta === 0 && c.attackerWins).map(c => c.commitDelta);
    const byQuality = at.filter(c => c.commitDelta === 0 && c.attackerWins).map(c => c.qualityDelta);
    return {
      wear,
      minCommitDelta: byCommit.length ? Math.min(...byCommit) : null,
      minQualityDelta: byQuality.length ? Math.min(...byQuality) : null,
    };
  });
}

/* =====================================================================
   METRIC 2 — Swift Seizure success sweep: distance x defense multipliers
   x reserve reach. Is the one-turn capture priced by the operational costs?
   Success = the attacker takes the sector: FALL (shield broken, reserve
   pinned) or a won 결전.
   ===================================================================== */
const SWIFT = {
  attacker: 3000, reserve: 2000, garrison: 1000,
  commit: 8,
  distances: [0, 3, 6, 9, 12],
  terrains: ['plains', 'hills', 'mountains'],
  forts: ['none', 'walls', 'fortress'],
  reserveDistances: [0, 6],   // field-army arrival wear when it reaches
};

function swiftScenarioResult(distance, terrain, fortification, reserveReaches, reserveDistance, knobs) {
  const atk = arrival(distance, knobs.recoveryWhileMarching);
  const fieldArmy = reserveReaches
    ? { reaches: true, size: SWIFT.reserve, commit: SWIFT.commit, quality: 1.0,
        fatigue: arrival(reserveDistance, knobs.recoveryWhileMarching).effectiveness }
    : { reaches: false, size: SWIFT.reserve };
  const sc = {
    attacker: { size: SWIFT.attacker, commit: SWIFT.commit, quality: 1.0, fatigue: atk.effectiveness },
    front: { garrison: SWIFT.garrison, terrain, fortification },
    fieldArmy, escape: 'OPEN',
  };
  const o = P.resolveWith(sc, knobs);
  const success = o.branch === 'FALL' || (o.branch === 'DECISIVE' && o.decisiveBattle.attackerWins);
  return { branch: o.branch, success };
}

function swiftSeizureGrid() {
  const cells = [];
  forEachRestoration((knobs) => {
    for (const distance of SWIFT.distances)
      for (const terrain of SWIFT.terrains)
        for (const fortification of SWIFT.forts)
          for (const reserveReaches of [true, false]) {
            const reserveDists = reserveReaches ? SWIFT.reserveDistances : [null];
            for (const reserveDistance of reserveDists) {
              const r = swiftScenarioResult(distance, terrain, fortification, reserveReaches, reserveDistance, knobs);
              cells.push({ distance, terrain, fortification, reserveReaches, reserveDistance, knobs, ...r });
            }
          }
  });

  const bucket = (keyFn) => {
    const m = new Map();
    for (const c of cells) {
      const k = keyFn(c);
      if (k === undefined) continue;
      if (!m.has(k)) m.set(k, { total: 0, success: 0 });
      const b = m.get(k);
      b.total++; if (c.success) b.success++;
    }
    return m;
  };
  const byDistance = SWIFT.distances.map(distance => {
    const b = bucket(c => c.distance).get(distance);
    return { distance, successRate: rate(b.success, b.total), n: b.total };
  });
  const defBucket = bucket(c => c.terrain + '|' + c.fortification);
  const byDefense = [];
  for (const terrain of SWIFT.terrains)
    for (const fortification of SWIFT.forts) {
      const b = defBucket.get(terrain + '|' + fortification);
      byDefense.push({ terrain, fortification, successRate: rate(b.success, b.total), n: b.total });
    }
  const byReach = [true, false].map(reserveReaches => {
    const b = bucket(c => c.reserveReaches).get(reserveReaches);
    return { reserveReaches, successRate: rate(b.success, b.total), n: b.total };
  });
  const overallSuccess = rate(cells.filter(c => c.success).length, cells.length);
  return { cells, overallSuccess, byDistance, byDefense, byReach };
}

/* =====================================================================
   METRIC 3 — mass-inversion rate: how often the SMALLER force wins the
   결전 at EQUAL WEAR (§1 rider d — the land-derived identity guard).
   ===================================================================== */
const INVERSION = {
  garrison: 400,                       // shield always breaks -> 결전
  fatiguesBoth: [1.0, 0.8],            // equal wear on both sides
  masses: [2000, 3000, 4000],
  commits: [4, 8, 20],
  qualities: [1.0, 1.5],
};

function massInversionGrid() {
  const cells = [];
  forEachRestoration((knobs) => {
    // recoveryWhileMarching is inert here (fatigue is set directly, equal on
    // both sides), so collapse it to avoid duplicate cells.
    if (knobs.recoveryWhileMarching === false) return;
    for (const fatigue of INVERSION.fatiguesBoth)
      for (const attMass of INVERSION.masses)
        for (const faMass of INVERSION.masses)
          for (const attCommit of INVERSION.commits)
            for (const defCommit of INVERSION.commits)
              for (const attQ of INVERSION.qualities)
                for (const defQ of INVERSION.qualities) {
                  const sc = {
                    attacker: { size: attMass, commit: attCommit, quality: attQ, fatigue },
                    front: { garrison: INVERSION.garrison, terrain: 'plains', fortification: 'none' },
                    fieldArmy: { reaches: true, size: faMass, commit: defCommit, quality: defQ, fatigue },
                    escape: 'OPEN',
                  };
                  const o = P.resolveWith(sc, knobs);
                  const d = o.decisiveBattle;
                  const attackerWins = d ? d.attackerWins : null;
                  // "Smaller force" counts the substance actually standing on
                  // each side: with the M9 fill restored, the garrison fill is
                  // real defending mass, so comparing against the field army
                  // alone would label a fill-carried win as a lever inversion.
                  // Rider (d) guards against PIERCING LEVERS, not against mass.
                  const defendingMass = faMass + INVERSION.garrison * knobs.fillFactor;
                  let inversion = false;
                  if (d) {
                    if (attMass < defendingMass && attackerWins) inversion = true;
                    else if (attMass > defendingMass && !attackerWins) inversion = true;
                  }
                  cells.push({
                    fatigue, attMass, faMass, defendingMass,
                    commitDelta: attCommit - defCommit,
                    qualityDelta: attQ - defQ,
                    knobs: { fillFactor: knobs.fillFactor, shieldCommit: knobs.shieldCommit },
                    branch: o.branch, attackerWins, inversion,
                  });
                }
  });

  const clean = cells.filter(c => c.commitDelta === 0 && c.qualityDelta === 0 &&
                                  c.knobs.fillFactor === 0 && c.knobs.shieldCommit === null);
  const leverGap = cells.filter(c => c.commitDelta !== 0 || c.qualityDelta !== 0);
  const summary = {
    cells: cells.length,
    cleanEqualLeverCells: clean.length,
    cleanEqualLeverInversions: clean.filter(c => c.inversion).length,
    leverGapCells: leverGap.length,
    leverGapInversions: leverGap.filter(c => c.inversion).length,
    overallInversionRate: rate(cells.filter(c => c.inversion).length, cells.length),
  };
  return { cells, summary };
}

/* =====================================================================
   METRIC 4 — commit-curve descriptive sweep (data only; re-grading is a
   dedicated session, §1 rider c). A pure lever sweep at a fixed parity
   matchup, run at the landed layers (layer restoration is the concern of
   metrics 1–3; the M2 curve shape is orthogonal). No verdict field.
   ===================================================================== */
const COMMIT_CURVE = {
  mass: 3000, garrison: 400,
  defenderCommit: 8,
  commits: [0, 4, 8, 14, 20],
  knobs: P.NEUTRAL_KNOBS,
};

function commitCurveGrid() {
  const points = COMMIT_CURVE.commits.map((commit) => {
    const sc = {
      attacker: { size: COMMIT_CURVE.mass, commit, quality: 1.0, fatigue: 1.0 },
      front: { garrison: COMMIT_CURVE.garrison, terrain: 'plains', fortification: 'none' },
      fieldArmy: { reaches: true, size: COMMIT_CURVE.mass, commit: COMMIT_CURVE.defenderCommit, quality: 1.0, fatigue: 1.0 },
      escape: 'OPEN',
    };
    const o = P.resolveWith(sc, COMMIT_CURVE.knobs);
    return {
      commit, lever: B.commitLever(commit),
      firstBlowR: o.firstBlowR,
      R2: o.decisiveBattle ? o.decisiveBattle.R2 : null,
      attackerWins: o.decisiveBattle ? o.decisiveBattle.attackerWins : null,
    };
  });
  return { knobs: COMMIT_CURVE.knobs, defenderCommit: COMMIT_CURVE.defenderCommit, points };
}

function rate(num, den) {
  return den === 0 ? null : num / den;
}

function runAll() {
  const parity = parityGrid();
  const swiftSeizure = swiftSeizureGrid();
  const massInversion = massInversionGrid();
  const commitCurve = commitCurveGrid();
  return {
    parity: parity.summary,
    swiftSeizure: {
      overallSuccess: swiftSeizure.overallSuccess,
      byDistance: swiftSeizure.byDistance,
      byDefense: swiftSeizure.byDefense,
      byReach: swiftSeizure.byReach,
    },
    massInversion: massInversion.summary,
    commitCurve,
  };
}

/* Node-only harness (sibling convention: mockup/decisive-battle/*.js).
   forEachRestoration is exported for metric 5 (ticket 10, fizzle.js): the
   layer-restoration sweep is reused, never re-authored, so both measurement
   surfaces restore the same layers in the same order. */
module.exports = { parityGrid, swiftSeizureGrid, massInversionGrid, commitCurveGrid, runAll, RESTORATION, forEachRestoration };

if (require.main === module) {
  const pct = (r) => (r == null ? '  n/a' : (100 * r).toFixed(1).padStart(5) + '%');
  const r = runAll();
  console.log('\n=== METRIC 1 — parity surface (equal mass) ===');
  console.log(`cells=${r.parity.cells}  equal-lever worn attacker-wins=${r.parity.equalLeverWornAttackerWins}/${r.parity.equalLeverWornCells} (grammar: defender repulse)`);
  console.log(`  of those worn repulses: bloody(under cliff)=${pct(r.parity.equalLeverBloodyRepulseRate)}  routed=${pct(r.parity.equalLeverRoutRate)}`);
  console.log(`  piercing wins=${r.parity.piercingWins}/${r.parity.piercingCells}`);
  console.log('  piercing frontier (min single-lever gap to win, by attacker wear):');
  for (const f of r.parity.piercingFrontier)
    console.log(`    wear ${String(f.wear).padStart(2)}  commit +${f.minCommitDelta == null ? 'none' : f.minCommitDelta}  quality +${f.minQualityDelta == null ? 'none' : f.minQualityDelta.toFixed(2)}`);

  console.log('\n=== METRIC 2 — Swift Seizure success sweep ===');
  console.log(`overall success=${pct(r.swiftSeizure.overallSuccess)}`);
  console.log('  by distance:  ' + r.swiftSeizure.byDistance.map(d => `${d.distance}h=${pct(d.successRate)}`).join('  '));
  console.log('  by reserve reach: ' + r.swiftSeizure.byReach.map(d => `${d.reserveReaches}=${pct(d.successRate)}`).join('  '));
  console.log('  by defense (terrain/fort):');
  for (const d of r.swiftSeizure.byDefense) console.log(`    ${d.terrain.padEnd(9)} ${d.fortification.padEnd(9)} ${pct(d.successRate)}`);

  console.log('\n=== METRIC 3 — mass-inversion rate (equal wear) ===');
  console.log(`clean equal-lever inversions=${r.massInversion.cleanEqualLeverInversions}/${r.massInversion.cleanEqualLeverCells} (land-derived guard)`);
  console.log(`lever-gap inversions=${r.massInversion.leverGapInversions}/${r.massInversion.leverGapCells}  overall=${pct(r.massInversion.overallInversionRate)}`);

  console.log('\n=== METRIC 4 — commit-curve descriptive sweep (data only) ===');
  console.log(`fixed parity matchup, defender commit=${r.commitCurve.defenderCommit}`);
  console.log('  commit  lever   firstBlowR   R2     attackerWins');
  for (const p of r.commitCurve.points)
    console.log(`  ${String(p.commit).padStart(5)}  ${p.lever.toFixed(3)}  ${p.firstBlowR.toFixed(3).padStart(9)}  ${p.R2.toFixed(3).padStart(6)}   ${p.attackerWins}`);
  console.log('');
}
