'use strict';
// PROTOTYPE — tactical plan AI measurement battery (BATTERY.md, sealed
// 2026-07-08). Runs the six headline arms + the 3^5 disposition sweep and
// prints the five pre-registered comparisons. Interpret NOTHING from this
// output without docs/features/tactical-plan-ai/BATTERY.md (upper bound
// vs passive defender; game-legal confidence only).
//
// Usage: node mockup/combat-calc/plan-battery.js [--quick] [--skip-d]

const { CRADLE_MAP } = require('./map-gen.js');
const { viableBindings } = require('./map-gate.js');
const { runCradleTournament, makeBoardFromMap, BOARD_GAAN, FG_BOARD_GAAN } = require('./map-board.js');
const TOURNEY = require('./tournament.js');

const SEEDS = [42, 7, 99];
const DISPOSITIONS = [-0.5, 0, 0.5]; // 비관 / 중립 / 낙관 presets

const ARMS = [
  { id: 'S0', label: 'script bot (baseline)', brain: null },
  { id: 'R2', label: 'random-pick control', brain: { kind: 'random' } },
  { id: 'L1', label: 'ladder conf 0.90', brain: { kind: 'ladder', confidence: 0.90, disposition: 0 } },
  { id: 'L2', label: 'ladder conf 0.75', brain: { kind: 'ladder', confidence: 0.75, disposition: 0 } },
  { id: 'L3', label: 'ladder conf 0.50', brain: { kind: 'ladder', confidence: 0.50, disposition: 0 } },
  { id: 'L4', label: 'blind floor (conf 0 → glimpse clamp 0.45)', brain: { kind: 'ladder', confidence: 0, disposition: 0 } },
];

// ---------------------------------------------------------------- aggregate
function aggregate(records) {
  const decided = records.filter((r) => r.winner);
  const undecided = records.filter((r) => !r.winner);
  const shapes = {}; const planHist = {};
  // ending-taxonomy distribution (grill 2026-07-08): the bar-independent read
  // of how each match ended, plus the leader-seat × bucket crown crosstab
  // (TC-② needle b — does the center actually lead when it holds).
  const buckets = {}; const bucketByLeaderSeat = {};
  let exhausted = 0, paneled = 0;
  let elim = 0, vassal = 0, brained = 0, forced = 0, misjudged = 0;
  let varSum = 0, boostSum = 0;
  for (const r of records) {
    shapes[r.endingShape] = (shapes[r.endingShape] || 0) + 1;
    elim += r.eliminations; vassal += r.vassalDeals;
    const ps = r.planStats || { picks: {}, brained: 0, forced: 0, misjudged: 0 };
    brained += ps.brained; forced += ps.forced; misjudged += ps.misjudged;
    for (const [p, n] of Object.entries(ps.picks)) planHist[p] = (planHist[p] || 0) + n;
    if (r.panel) {
      paneled++;
      buckets[r.panel.bucket] = (buckets[r.panel.bucket] || 0) + 1;
      if (r.panel.exhausted) exhausted++;
      varSum += r.panel.meanWithinRealmVariance || 0;
      boostSum += r.panel.boostedShieldShare || 0;
      const side = (r.panel.sides || []).find((s) => s.name === r.panel.leader);
      const seat = side ? side.seat : 'unknown';
      const row = bucketByLeaderSeat[seat] || (bucketByLeaderSeat[seat] = {});
      row[r.panel.bucket] = (row[r.panel.bucket] || 0) + 1;
    }
  }
  const shortfalls = undecided
    .map((r) => r.finalCheck && r.finalCheck.leadershipShortfall)
    .filter((v) => typeof v === 'number');
  return {
    matches: records.length,
    decidedPct: (decided.length / records.length) * 100,
    meanShortfall: shortfalls.length
      ? shortfalls.reduce((s, v) => s + v, 0) / shortfalls.length : null,
    eliminations: elim, vassalDeals: vassal, shapes, planHist,
    buckets, bucketByLeaderSeat,
    exhaustedPct: paneled ? (exhausted / records.length) * 100 : null,
    brained,
    forcedPct: brained ? (forced / brained) * 100 : null,
    misjudgedPct: brained ? (misjudged / brained) * 100 : null,
    meanWithinRealmVariance: paneled ? varSum / paneled : null,
    meanBoostedShieldShare: paneled ? boostSum / paneled : null,
  };
}

// ---------------------------------------------------------------- arms
function runArm(arm, bindings, reps) {
  const records = [];
  for (const seed of SEEDS) {
    records.push(...runCradleTournament({
      map: CRADLE_MAP, bindings, reps, seed,
      brain: arm.brain || undefined,
    }));
  }
  return records;
}

// D arm: all 3^5 disposition assignments at confidence 0.75, one canonical
// binding, random archetypes per rep (marginals only — BATTERY.md).
function dispositionCombos(step = 1) {
  const combos = [];
  const n = DISPOSITIONS.length;
  for (let i = 0; i < Math.pow(n, 5); i += step) {
    let x = i; const combo = [];
    for (let s = 0; s < 5; s++) { combo.push(DISPOSITIONS[x % n]); x = Math.floor(x / n); }
    combos.push(combo);
  }
  return combos;
}

function runDArm(bindings, reps, comboStep) {
  const binding = bindings[0];
  const seats = Object.keys(binding);
  const rows = [];
  for (const combo of dispositionCombos(comboStep)) {
    const records = [];
    for (const seed of SEEDS) {
      const rng = TOURNEY.mulberry32(seed * 7919 + 17);
      for (let rep = 0; rep < reps; rep++) {
        const assignment = {};
        seats.forEach((s, si) => {
          assignment[s] = {
            archetype: TOURNEY.ARCHETYPES[Math.floor(rng() * TOURNEY.ARCHETYPES.length)],
            temperament: TOURNEY.TEMPERAMENTS[Math.floor(rng() * TOURNEY.TEMPERAMENTS.length)],
            brain: { kind: 'ladder', confidence: 0.75, disposition: combo[si] },
          };
        });
        const record = TOURNEY.runMatch(assignment, {
          seed: Math.floor(rng() * 1e9),
          board: makeBoardFromMap(CRADLE_MAP, binding, BOARD_GAAN),
        });
        records.push({ ...record, combo, seats });
      }
    }
    rows.push({ combo, records });
  }
  return rows;
}

// D-arm marginals: decided% by optimist/pessimist headcount + per-disposition
// individual win share.
function dispositionMarginals(rows) {
  const byCount = (which) => {
    const table = {};
    for (const { combo, records } of rows) {
      const k = combo.filter((d) => (which === 'opt' ? d > 0 : d < 0)).length;
      const cell = (table[k] = table[k] || { matches: 0, decided: 0 });
      cell.matches += records.length;
      cell.decided += records.filter((r) => r.winner).length;
    }
    return table;
  };
  const perDisposition = {};
  for (const d of DISPOSITIONS) perDisposition[d] = { seats: 0, wins: 0 };
  for (const { combo, records } of rows) {
    for (const r of records) {
      combo.forEach((d, si) => { perDisposition[d].seats += 1; });
      if (r.winner) {
        const wi = r.seats.indexOf(r.winner);
        if (wi >= 0) perDisposition[combo[wi]].wins += 1;
      }
    }
  }
  return { byOptimists: byCount('opt'), byPessimists: byCount('pes'), perDisposition };
}

// FG-⑩ sweep: control (uniform walls) vs force-geography with M9 on/off.
// Isolates M9's contribution while keeping the human-like config primary.
function runFgSweep(bindings, reps = 20, seed = 42) {
  const run = (gaan) => aggregate(runCradleTournament({
    map: CRADLE_MAP, bindings, reps, seed, boardGaan: gaan }));
  return {
    ctrl:    run(BOARD_GAAN),
    fgM9on:  run(FG_BOARD_GAAN),
    fgM9off: run({ ...FG_BOARD_GAAN, m9Reserve: false }),
  };
}

// ---------------------------------------------------------------- report
function pct(v) { return v === null ? '—' : `${v.toFixed(1)}%`; }

function main() {
  const quick = process.argv.includes('--quick');
  const skipD = process.argv.includes('--skip-d');
  const fg = process.argv.includes('--fg');
  const reps = quick ? 2 : 20;
  const comboStep = quick ? 27 : 1;
  const bindings = viableBindings(CRADLE_MAP, 5).viable;

  if (fg) {
    console.log(`FG-⑩ sweep — bindings ${bindings.length}, reps ${reps}${quick ? ' (QUICK)' : ''}`);
    console.log('ctrl = uniform walls (BOARD_GAAN) · fgM9on = force-geography, M9 reserve ON · fgM9off = force-geography, M9 reserve OFF\n');
    const sweep = runFgSweep(bindings, reps);
    for (const [id, agg] of Object.entries(sweep)) {
      console.log(`[${id}] decided ${pct(agg.decidedPct)} · meanWithinRealmVariance ${agg.meanWithinRealmVariance === null ? '—' : agg.meanWithinRealmVariance.toFixed(1)} · meanBoostedShieldShare ${agg.meanBoostedShieldShare === null ? '—' : agg.meanBoostedShieldShare.toFixed(3)}`);
      console.log(`  buckets ${JSON.stringify(agg.buckets)}`);
    }
    return;
  }

  console.log(`plan-AI battery — bindings ${bindings.length}, reps ${reps}, seeds ${SEEDS.join('/')}${quick ? ' (QUICK)' : ''}`);
  console.log('CAVEAT: upper bound vs passive defender (Ruling ⑥); game-legal confidence only (≤0.90).\n');

  const results = {};
  for (const arm of ARMS) {
    const t0 = Date.now();
    const agg = aggregate(runArm(arm, bindings, reps));
    results[arm.id] = agg;
    console.log(`[${arm.id}] ${arm.label} — ${agg.matches} matches (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
    console.log(`  decided ${pct(agg.decidedPct)} · shortfall ${agg.meanShortfall ? Math.round(agg.meanShortfall) : '—'} · elim ${agg.eliminations} · vassalDeals ${agg.vassalDeals}`);
    console.log(`  shapes ${JSON.stringify(agg.shapes)}`);
    if (agg.brained) {
      console.log(`  plans ${JSON.stringify(agg.planHist)}`);
      console.log(`  brained ${agg.brained} · forced ${pct(agg.forcedPct)} · misjudged ${pct(agg.misjudgedPct)}`);
    }
    console.log();
  }

  console.log('── pre-registered comparisons (BATTERY.md — the only official conclusions)');
  const d = (a, b) => (results[a].decidedPct - results[b].decidedPct).toFixed(1);
  console.log(`1. diversity value  (R2 − S0): ${d('R2', 'S0')}pp decided`);
  console.log(`2. judgment value   (L1 − R2): ${d('L1', 'R2')}pp decided`);
  console.log(`3. information curve L1→L4: ${['L1', 'L2', 'L3', 'L4'].map((id) => results[id].decidedPct.toFixed(1)).join(' → ')}% decided`);
  const best = ARMS.reduce((b, a) => (results[a.id].decidedPct > results[b.id].decidedPct ? a : b));
  console.log(`5. freeze absorption: S0 ${results.S0.decidedPct.toFixed(1)}% → best arm ${best.id} ${results[best.id].decidedPct.toFixed(1)}%`);
  console.log(`   residual shortfall (best arm, undecided): ${results[best.id].meanShortfall ? Math.round(results[best.id].meanShortfall) : '—'}`);

  if (!skipD) {
    console.log('\n[D] disposition sweep 3^5 @ conf 0.75 (marginals only)');
    console.log('  NOTE: single binding (bindings[0]) + random archetype draw — compare');
    console.log('  ONLY within this arm; headline arms average 7 bindings (not comparable).');
    const t0 = Date.now();
    const rows = runDArm(bindings, reps, comboStep);
    const m = dispositionMarginals(rows);
    const total = rows.reduce((s, r) => s + r.records.length, 0);
    console.log(`  ${rows.length} combos × ${rows[0].records.length} matches = ${total} (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
    const fmtCount = (t) => Object.entries(t).map(([k, c]) =>
      `${k}:${((c.decided / c.matches) * 100).toFixed(1)}%`).join(' · ');
    console.log(`  4. disposition value — decided% by optimist count: ${fmtCount(m.byOptimists)}`);
    console.log(`     decided% by pessimist count: ${fmtCount(m.byPessimists)}`);
    for (const [dv, cell] of Object.entries(m.perDisposition)) {
      const share = cell.seats ? ((cell.wins / cell.seats) * 100).toFixed(2) : '—';
      console.log(`     λ=${dv}: win share ${share}% (${cell.wins}/${cell.seats} seat-slots)`);
    }
  }
}

module.exports = { aggregate, runArm, runDArm, runFgSweep, dispositionMarginals, dispositionCombos, ARMS, SEEDS };
if (require.main === module) main();
