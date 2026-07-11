'use strict';
// PROTOTYPE — residual-freeze autopsy (L2 analysis session, 2026-07-08).
// The tactical plan AI absorbed only +0.8pp; ~87% still timeout. This
// decomposes WHY, on the best arm (L1 ladder conf 0.90), using only
// existing record instrumentation (finalCheck, finalRealms, endingShape).
// Interpret with BATTERY.md caveats: upper bound vs a passive defender.
// Usage: node mockup/combat-calc/freeze-autopsy.js [--quick]

const { CRADLE_MAP } = require('./map-gen.js');
const { viableBindings } = require('./map-gate.js');
const { runCradleTournament, makeBoardFromMap } = require('./map-board.js');
const { MATCH_DIALS, hegemonyCheck } = require('./match.js');
const { checkView } = require('./tournament.js');

const SEEDS = [42, 7, 99];
const BRAIN = { kind: 'ladder', confidence: 0.90, disposition: 0 };
const RATIO = MATCH_DIALS.shieldRatio;                 // trip needs candProj >= RATIO x rival shield
const reps = process.argv.includes('--quick') ? 3 : 20;
const bindings = viableBindings(CRADLE_MAP, 5).viable;

// ---- start-state parity reference (real checkView export — SYNC-DEBT paid
// 2026-07-11: the hand-rolled replica drifted once checkView grew the
// affordability fields, so the gate now reads the production view) ----------
function bestAtStart(binding) {
  const view = checkView(makeBoardFromMap(CRADLE_MAP, binding));
  let best = null;
  for (const r of view) {
    const c = hegemonyCheck(view, r.name, MATCH_DIALS);
    const maxNeed = c.leadershipRows.length ? Math.max(...c.leadershipRows.map((x) => x.need)) : 0;
    const ratio = maxNeed ? (c.candProj * RATIO) / maxNeed : Infinity;   // = candProj / maxRivalShield
    if (!best || ratio > best.ratio) best = { ratio, candProj: c.candProj, maxNeed };
  }
  return best;
}

// ---- run best arm -----------------------------------------------------------
const records = [];
for (const seed of SEEDS) records.push(...runCradleTournament({ map: CRADLE_MAP, bindings, reps, seed, brain: BRAIN }));

const N = records.length;
const decided = records.filter((r) => r.winner);
const timeout = records.filter((r) => !r.winner);

// ---- per-record derived fields ----------------------------------------------
function derive(r) {
  const fc = r.finalCheck || {};
  const candProj = fc.candProj || 0;
  const shortfall = fc.leadershipShortfall || 0;
  const maxNeed = shortfall + candProj;                 // recovers max rival need when shortfall>0
  const ratio = maxNeed ? (candProj * RATIO) / maxNeed : null;   // candProj / maxRivalShield
  const fr = r.finalRealms || [];
  const alive = fr.filter((x) => x.alive).length;
  const vassals = fr.filter((x) => x.alive && x.vassalOf).length;
  const independents = fr.filter((x) => x.alive && !x.vassalOf).length;
  const dead = fr.length - alive;
  return { candProj, shortfall, ratio, alive, vassals, independents, dead,
    leadership: fc.leadership, unassailable: fc.unassailable,
    wars: r.warsStarted || 0, vassalDeals: r.vassalDeals || 0, elim: r.eliminations || 0 };
}
const mean = (arr, f) => (arr.length ? arr.reduce((s, x) => s + f(x), 0) / arr.length : 0);
const fmt = (v, d = 2) => (v === null || v === undefined ? '—' : v.toFixed(d));

// ---- report -----------------------------------------------------------------
console.log(`residual-freeze autopsy — best arm L1 (ladder conf 0.90), ${N} matches, reps ${reps} seeds ${SEEDS.join('/')}`);
console.log(`CAVEAT: upper bound vs passive defender (Ruling ⑥). shieldRatio(trip bar) = ${RATIO}\n`);

const startRatios = bindings.map(bestAtStart);
console.log('── start-state parity reference (best candidate at t=0, per binding)');
console.log(`  leadership ratio at start: ${startRatios.map((s) => s.ratio.toFixed(2)).join(' / ')}  (trip needs >= ${RATIO})`);
console.log(`  → at parity start the front-runner is already ~${(mean(startRatios, (s) => s.ratio)).toFixed(2)}x its top rival; gap to trip = ${(RATIO - mean(startRatios, (s) => s.ratio)).toFixed(2)}\n`);

console.log(`── headline: decided ${(100 * decided.length / N).toFixed(1)}%  ·  timeout ${(100 * timeout.length / N).toFixed(1)}%`);

// Angle 1 — what blocks the timeouts: leadership vs unassailability
const dT = timeout.map(derive);
const failLead = dT.filter((x) => !x.leadership).length;
const failUnassail = dT.filter((x) => x.leadership && !x.unassailable).length;
console.log('\n── Angle 1: what gate blocks the timeouts?');
console.log(`  leadership FAILS: ${(100 * failLead / dT.length).toFixed(1)}%  ·  leadership passes but NOT unassailable: ${(100 * failUnassail / dT.length).toFixed(1)}%`);
const ratios = dT.map((x) => x.ratio).filter((v) => v !== null);
const buckets = { '<1.0 (behind)': 0, '1.0-1.2': 0, '1.2-1.4': 0, '1.4-1.6': 0, '1.6-1.7': 0, '>=1.7 (would-trip)': 0 };
for (const v of ratios) {
  if (v < 1.0) buckets['<1.0 (behind)']++;
  else if (v < 1.2) buckets['1.0-1.2']++;
  else if (v < 1.4) buckets['1.2-1.4']++;
  else if (v < 1.6) buckets['1.4-1.6']++;
  else if (v < 1.7) buckets['1.6-1.7']++;
  else buckets['>=1.7 (would-trip)']++;
}
console.log(`  timeout leadership-ratio (candProj / top-rival-shield), mean ${mean(ratios.map((v) => ({ v })), (x) => x.v).toFixed(2)}:`);
for (const [k, c] of Object.entries(buckets)) console.log(`     ${k.padEnd(20)} ${(100 * c / ratios.length).toFixed(1)}%`);

// Angle 2 — decided vs timeout contrast
const dD = decided.map(derive);
console.log('\n── Angle 2: decided vs timeout contrast (mean)');
const row = (label, f) => console.log(`  ${label.padEnd(22)} decided ${fmt(mean(dD, f))}   timeout ${fmt(mean(dT, f))}`);
row('candProj', (x) => x.candProj);
row('alive realms', (x) => x.alive);
row('independents (non-vassal)', (x) => x.independents);
row('vassals', (x) => x.vassals);
row('dead (eliminated)', (x) => x.dead);
row('wars started', (x) => x.wars);
row('vassal deals', (x) => x.vassalDeals);
row('eliminations', (x) => x.elim);
const shapes = {};
for (const r of records) shapes[r.endingShape] = (shapes[r.endingShape] || 0) + 1;
console.log(`  ending shapes: ${JSON.stringify(shapes)}`);

// Angle 3 — does consolidation raise the leadership ratio? (the anti-snowball test)
console.log('\n── Angle 3: consolidation → leadership ratio (anti-snowball test)');
const byConsol = {};   // key = independents remaining (5=no consolidation ... 1=one realm left)
for (const x of records.map(derive)) {
  const k = x.independents;
  (byConsol[k] ??= { n: 0, ratio: 0, decided: 0 }).n++;
  if (x.ratio !== null) byConsol[k].ratio += x.ratio;
  if (x.independents <= 1) byConsol[k].decided++;
}
console.log('  independents left | matches | mean leadership ratio');
for (const k of Object.keys(byConsol).sort((a, b) => b - a)) {
  const c = byConsol[k];
  console.log(`     ${k}  |  ${String(c.n).padStart(5)}  |  ${(c.ratio / c.n).toFixed(2)}`);
}

// per-binding decided% (geography)
console.log('\n── geography: decided% by binding');
const perB = {};
for (const r of records) {
  const k = r.bindingIndex;
  (perB[k] ??= { n: 0, d: 0 }).n++;
  if (r.winner) perB[k].d++;
}
console.log('  ' + Object.entries(perB).map(([k, c]) => `b${k}:${(100 * c.d / c.n).toFixed(1)}%`).join(' · '));
