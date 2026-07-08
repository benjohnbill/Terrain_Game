'use strict';
// L2 ending-taxonomy measurement panel (grill 2026-07-08). A bar-INDEPENDENT
// read of how a match ended, so the ~87% timeout blob splits into legitimate
// standoff vs a dominant realm the victory condition failed to register.
//
// Design seal (grill Q1-Q4, user): measure before redefining the SPEC
// terminal; ruler B (bar-independent concentration); 8-metric panel
// (forceShare/controlShare/HHI + shieldShare/reversibilityIndex/vassalShare/
// bloodAxis); vassals fold FULL into the overlord side (matches the hegemony
// gate arithmetic — the vassal is strategically the overlord's instrument),
// with vassalShare reported separately as the fragile proxy portion. Bucket
// thresholds are PROVISIONAL (가안) — calibrated against the measured
// distribution, not before it (L2 discipline). Reading tiers borrow Stellaris
// relative-power cutoffs (1.5× superior / 2.5× overwhelming).

const { test } = require('node:test');
const assert = require('node:assert');

const M = require('../mockup/combat-calc/match.js');

const close = (a, b, eps = 1e-3) =>
  assert.ok(Math.abs(a - b) <= eps, `expected ${a} ≈ ${b} (±${eps})`);

// worked example from the grill: a 5-realm multipolar timeout, no vassals.
// Σproj 9500; leader 중원 2600 → forceShare 0.2737, HHI 0.2162, ratio to
// max rival 1.13× (equivalent), field offense 6900 ÷ leader shield 3400 =
// 2.03 (>1 reversible) → genuine standoff.
const STANDOFF = [
  { name: '중원', seat: 'center', alive: true, vassalOf: null, proj: 2600, shield: 3400, ctrl: 8, bodies: 2600 },
  { name: '서령', seat: 'flank',  alive: true, vassalOf: null, proj: 2300, shield: 3000, ctrl: 7, bodies: 2500 },
  { name: '동평', seat: 'flank',  alive: true, vassalOf: null, proj: 2000, shield: 2600, ctrl: 6, bodies: 2400 },
  { name: '남곡', seat: 'small',  alive: true, vassalOf: null, proj: 1500, shield: 2000, ctrl: 4, bodies: 2100 },
  { name: '북하', seat: 'hermit', alive: true, vassalOf: null, proj: 1100, shield: 1700, ctrl: 3, bodies: 2300 },
]; // Σbodies 11900

test('matchPanel: multipolar timeout reads as a standoff on every axis', () => {
  const p = M.matchPanel(STANDOFF, { bodiesStart: 15000 });
  assert.strictEqual(p.leader, '중원');
  close(p.forceShare, 0.2737);
  close(p.hhi, 0.2162);
  close(p.sos, 0.3465);
  close(p.shieldShare, 3400 / 12700);
  close(p.reversibilityIndex, 6900 / 3400); // 2.029, field can overturn
  assert.strictEqual(p.vassalShare, 0);
  assert.strictEqual(p.tier, 'equivalent'); // 1.13× < 1.5
  assert.strictEqual(p.bucket, 'standoff');
  assert.strictEqual(p.exhausted, false); // worldBlood 0.79
  close(p.worldBlood, 0.7933);
});

// a dominant overlord ruling a vassal: side proj 6200 (own 4200 + vassal
// 2000). In-balance rivals 1400 + 1200. forceShare 0.70, ratio 4.43×
// (overwhelming), field offense 2600 ÷ leader side shield 6400 = 0.41
// (<1, unassailable) → the wall the victory condition missed. vassalShare
// 0.32 (fragile proxy that evaporates on chain-collapse).
const DENIED = [
  { name: '중원', seat: 'center', alive: true, vassalOf: null,  proj: 4200, shield: 4600, ctrl: 10, bodies: 5000 },
  { name: '남곡', seat: 'small',  alive: true, vassalOf: '중원', proj: 2000, shield: 1800, ctrl: 4,  bodies: 2500 },
  { name: '서령', seat: 'flank',  alive: true, vassalOf: null,  proj: 1400, shield: 2000, ctrl: 5,  bodies: 2200 },
  { name: '북하', seat: 'hermit', alive: true, vassalOf: null,  proj: 1200, shield: 1500, ctrl: 3,  bodies: 2100 },
];

test('matchPanel: dominant-overlord timeout reads as denied-dominant (the wall)', () => {
  const p = M.matchPanel(DENIED, { bodiesStart: 14000 });
  assert.strictEqual(p.leader, '중원');
  close(p.forceShare, 6200 / 8800); // 0.7045 — vassal folded FULL
  close(p.vassalShare, 2000 / 6200); // 0.3226 fragile proxy portion
  close(p.reversibilityIndex, 2600 / 6400); // 0.406, field cannot overturn
  assert.strictEqual(p.tier, 'overwhelming'); // 4.43× ≥ 2.5
  assert.strictEqual(p.bucket, 'denied-dominant');
});

// same shape as the standoff but the world is bled dry: worldBlood 0.45.
// The sealed "exhaustion" ending tail (match-arc GLOSSARY queue 11a) — a
// standoff over an impoverished world, flagged so it is not read as healthy.
test('matchPanel: a bled-out standoff carries the exhausted overlay', () => {
  const p = M.matchPanel(STANDOFF, { bodiesStart: 26000 }); // 11900/26000 = 0.458
  assert.strictEqual(p.bucket, 'standoff');
  assert.strictEqual(p.exhausted, true);
  close(p.worldBlood, 0.4577);
});

// dead / fully-absorbed realms drop out of the reckoning entirely.
test('matchPanel: eliminated realms are excluded from all shares', () => {
  const withDead = [
    ...STANDOFF,
    { name: '유령', seat: 'flank', alive: false, vassalOf: null, proj: 9999, shield: 9999, ctrl: 9, bodies: 9999 },
  ];
  const p = M.matchPanel(withDead, { bodiesStart: 15000 });
  assert.strictEqual(p.leader, '중원');
  close(p.forceShare, 0.2737); // unchanged — the dead realm contributes nothing
});

// integration: a live match records its panel through finish().
const T = require('../mockup/combat-calc/tournament.js');

test('finish() attaches a bar-independent panel to every match record', () => {
  const assignment = {};
  for (const s of T.SEATS) assignment[s] = { archetype: 'shield-first', temperament: '실리' };
  const rec = T.runMatch(assignment, { seed: 7 });
  assert.ok(rec.panel, 'record carries a panel');
  assert.ok(T.SEATS.includes(rec.panel.leader), 'leader is a live seat');
  assert.ok(rec.panel.forceShare > 0 && rec.panel.forceShare <= 1, 'forceShare in (0,1]');
  assert.ok(rec.panel.worldBlood > 0 && rec.panel.worldBlood <= 1, 'worldBlood in (0,1]');
  assert.strictEqual(typeof rec.panel.reversibilityIndex, 'number');
  assert.ok(['standoff', 'denied-dominant', 'bipolar-lock', 'contested', 'hegemon']
    .includes(rec.panel.bucket), `bucket ${rec.panel.bucket} is valid`);
  // a decided match is labelled 'hegemon'; a timeout keeps its taxonomy bucket
  if (rec.winner) assert.strictEqual(rec.panel.bucket, 'hegemon');
});

test('finish() panel is seed-deterministic', () => {
  const assignment = {};
  for (const s of T.SEATS) assignment[s] = { archetype: 'interior-lines', temperament: '완고' };
  const run = () => JSON.stringify(T.runMatch(assignment, { seed: 3 }).panel);
  assert.strictEqual(run(), run());
});

// aggregate: the real deliverable is the DISTRIBUTION — is the timeout blob a
// wall or a standoff, and does the center actually lead (TC-② crown needle).
const B = require('../mockup/combat-calc/plan-battery.js');

test('aggregate reports the ending-bucket distribution and crown crosstab', () => {
  const mk = (bucket, leaderSeat, exhausted = false, winner = null) => ({
    winner, endingShape: winner ? 'trip-solo' : 'timeout',
    eliminations: 0, vassalDeals: 0,
    planStats: { picks: {}, brained: 0, forced: 0, misjudged: 0 },
    finalCheck: { leadershipShortfall: 100 },
    panel: { bucket, exhausted, leader: 'X', sides: [{ name: 'X', seat: leaderSeat }] },
  });
  const records = [
    mk('standoff', 'center'), mk('standoff', 'flank'),
    mk('denied-dominant', 'center'), mk('hegemon', 'center', false, 'X'),
    mk('standoff', 'flank', true),
  ];
  const agg = B.aggregate(records);
  assert.strictEqual(agg.buckets.standoff, 3);
  assert.strictEqual(agg.buckets['denied-dominant'], 1);
  assert.strictEqual(agg.buckets.hegemon, 1);
  assert.strictEqual(agg.exhaustedPct, (1 / 5) * 100);
  assert.strictEqual(agg.bucketByLeaderSeat.center.hegemon, 1);
  assert.strictEqual(agg.bucketByLeaderSeat.center['denied-dominant'], 1);
  assert.strictEqual(agg.bucketByLeaderSeat.flank.standoff, 2);
});
