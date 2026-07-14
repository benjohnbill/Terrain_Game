// tests/engagement-v2.test.js — war-model slice-2 ticket 03 (교전 v2)
// Symmetric decisive battle (substance × commit × quality × fatigue per side,
// defender's own commit lever, fatigue as an input) + contact methods
// (Stronghold default, Delaying category). Slice-1 contract lives in
// tests/battle.test.js and stays green; this file covers the v2 additions.
const test = require('node:test');
const assert = require('node:assert/strict');
const B = require('../js/battle.js');

test('sidePower composes substance × commit lever × quality × fatigue; both sides use it', () => {
  // omitted quality/fatigue default to 1.0 (fresh, no tech) → raw substance × lever
  assert.equal(B.sidePower({ substance: 1000, commit: 8 }), 1500);          // 1000 × 1.5
  assert.equal(B.sidePower({ substance: 1000, commit: 0 }), 1000);          // lever 1.0
  assert.equal(B.sidePower({ substance: 1000, commit: 8, fatigue: 0.5 }), 750);
  assert.equal(B.sidePower({ substance: 1000, commit: 8, quality: 1.2, fatigue: 0.5 }), 900);
});

test('parity: equal mass/commit/quality, attacker marched farther → defender bloody repulse, loss well under the rout cliff', () => {
  const o = B.resolveEngagement({
    attacker: { size: 1000, commit: 8, fatigue: 0.8 },                      // marched farther → worn
    front: { garrison: 300, terrain: 'plains', fortification: 'none' },     // shield 300 breaks
    fieldArmy: { reaches: true, size: 1000, commit: 8, fatigue: 1.0 },      // equal mass/commit, fresh defender
    escape: 'OPEN',
  });
  assert.equal(o.branch, 'DECISIVE');
  assert.equal(o.decisiveBattle.attackerWins, false);                      // the side that marched farther loses
  assert.equal(o.decisiveBattle.routed, false);                           // a beaten attacker goes home
  assert.ok(o.decisiveBattle.loserTotalLoss < 0.20);                      // well under the M4 rout cliff (0.30)
});

test('piercing: a commit differential flips the parity outcome — expensive and visible in the result', () => {
  const parity = {
    attacker: { size: 1000, commit: 8, fatigue: 0.8 },
    front: { garrison: 300, terrain: 'plains', fortification: 'none' },
    fieldArmy: { reaches: true, size: 1000, commit: 8, fatigue: 1.0 },
    escape: 'OPEN',
  };
  const base = B.resolveEngagement(parity);
  assert.equal(base.decisiveBattle.attackerWins, false);                   // parity → defender holds

  const pierced = B.resolveEngagement({
    ...parity,
    attacker: { size: 1000, commit: 20, fatigue: 0.8 },                    // over-commit (lever 2.0 vs 1.5)
  });
  assert.equal(pierced.decisiveBattle.attackerWins, true);                 // the lever pierces parity
  assert.ok(pierced.decisiveBattle.R2 > base.decisiveBattle.R2);           // legible — the gamble shows in R2
});

test('quality gap also pierces parity (skill-piercable, same knob family)', () => {
  const parity = {
    attacker: { size: 1000, commit: 8, fatigue: 0.8 },
    front: { garrison: 300, terrain: 'plains', fortification: 'none' },
    fieldArmy: { reaches: true, size: 1000, commit: 8, fatigue: 1.0 },
    escape: 'OPEN',
  };
  assert.equal(B.resolveEngagement(parity).decisiveBattle.attackerWins, false);
  const pierced = B.resolveEngagement({
    ...parity,
    attacker: { size: 1000, commit: 8, fatigue: 0.8, quality: 1.4 },
  });
  assert.equal(pierced.decisiveBattle.attackerWins, true);
});

test('Delaying holds the sector this turn more cheaply than Stronghold at equal commit', () => {
  const forces = {
    attacker: { size: 2000, commit: 8, fatigue: 1.0 },
    front: { garrison: 500, terrain: 'plains', fortification: 'none' },
    fieldArmy: { reaches: true, size: 1000, commit: 8, fatigue: 1.0 },
    escape: 'OPEN',
  };
  const stronghold = B.resolveEngagement({ ...forces, defensePlan: 'STRONGHOLD' });
  assert.equal(stronghold.branch, 'DECISIVE');
  assert.equal(stronghold.decisiveBattle.attackerWins, true);              // same forces → Stronghold loses the sector

  const delaying = B.resolveEngagement({ ...forces, defensePlan: 'DELAYING' });
  assert.equal(delaying.branch, 'DELAYING');
  assert.equal(delaying.delaying.held, true);                             // ...but Delaying holds it this turn
  assert.equal(delaying.delaying.outcome, 'NOT_TAKEN');
});

test('Delaying never produces a decisive repulse — a weak attacker is not punished', () => {
  const forces = {
    attacker: { size: 200, commit: 4, fatigue: 1.0 },                      // far too weak to break through
    front: { garrison: 500, terrain: 'plains', fortification: 'none' },
    fieldArmy: { reaches: true, size: 1000, commit: 8, fatigue: 1.0 },
    escape: 'OPEN',
  };
  // Stronghold punishes the weak attacker with a decisive repulse...
  assert.equal(B.resolveEngagement({ ...forces, defensePlan: 'STRONGHOLD' }).branch, 'REPULSED');
  // ...Delaying does not: held, but the attacker keeps its force (never routed).
  const delaying = B.resolveEngagement({ ...forces, defensePlan: 'DELAYING' });
  assert.equal(delaying.delaying.held, true);
  assert.equal(delaying.delaying.attackerRouted, false);
  assert.equal(delaying.delaying.delayerAnnihilated, false);
});

test('Delaying pays the erosion tick when it holds, and disrupts its own routes on withdrawal', () => {
  const held = B.resolveEngagement({
    attacker: { size: 2000, commit: 8, fatigue: 1.0 },
    front: { garrison: 500, terrain: 'plains', fortification: 'none' },
    fieldArmy: { reaches: true, size: 1000, commit: 8, fatigue: 1.0 },
    escape: 'OPEN', defensePlan: 'DELAYING',
  });
  assert.equal(held.delaying.outcome, 'NOT_TAKEN');
  assert.ok(held.delaying.erosionTick > 0);                               // the sector degrades each delayed turn
  assert.equal(held.delaying.routeDisruption, true);                     // signature self side effect

  const ceded = B.resolveEngagement({
    attacker: { size: 12000, commit: 20, fatigue: 1.0 },                   // heavy over-commit breaks through
    front: { garrison: 500, terrain: 'plains', fortification: 'none' },
    fieldArmy: { reaches: true, size: 1000, commit: 8, fatigue: 1.0 },
    escape: 'BLOCKED', defensePlan: 'DELAYING',
  });
  assert.equal(ceded.delaying.held, false);
  assert.equal(ceded.delaying.outcome, 'CEDED');
  assert.equal(ceded.delaying.attackerRouted, false);                    // even ceding, no decisive repulse of anyone
  assert.equal(ceded.delaying.delayerAnnihilated, false);                // dissolution, never annihilation
});

test('defensePlan defaults to STRONGHOLD — the sealed spine is the default', () => {
  const o = B.resolveEngagement({
    attacker: { size: 1000, commit: 8 },
    front: { garrison: 1000, terrain: 'pass', fortification: 'walls' },
    fieldArmy: { reaches: true, size: 800 }, escape: 'OPEN',
  });
  assert.equal(o.defensePlan, 'STRONGHOLD');
  assert.equal(o.branch, 'REPULSED'); // identical to the slice-1 contract scenario
});
