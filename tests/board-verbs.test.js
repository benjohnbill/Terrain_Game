// tests/board-verbs.test.js — war-model slice-2 ticket 06 (판 동사 + 창발 공성).
// The two defense choices that avoid the calculator (Strategic Abandonment,
// Scorched Earth) plus the siege that emerges from supply arithmetic. No siege
// object exists (ADR 0026) — a siege IS a garrison's rising supply ledger, so
// this file also drives the emergent-siege upkeep bridge from board state (cut
// routes, ash) into the ticket-01 fatigue primitives, and ends on the full
// Moscow trap authored from these parts (spec §8 board verbs, §2 siege clock).
const test = require('node:test');
const assert = require('node:assert/strict');
const BV = require('../js/board-verbs.js');
const F = require('../js/fatigue.js');
const M = require('../js/movement.js');
const B = require('../js/battle.js');

/* ---- Strategic Abandonment (전략적 포기) — free declaration ---- */

test('abandon: immediate control transfer, base intact, action saved, no battle', () => {
  const sector = { id: 's1', control: 'red', usableValue: 100, fortification: 'walls' };
  const r = BV.abandon(sector, 'blue');
  assert.equal(r.sector.control, 'blue');   // immediate transfer channel
  assert.equal(r.sector.usableValue, 100);  // ceded intact — do not burn what you could keep
  assert.equal(r.sector.fortification, 'walls'); // untouched fields preserved
  assert.equal(r.actionSaved, true);        // the primary action stays free for elsewhere
  assert.equal(r.battle, false);            // no calculator invocation
  assert.equal(sector.control, 'red');      // pure transform — input untouched
});

/* ---- Scorched Earth (청야 소각) — turn-consuming self-damage ---- */

test('scorchedEarth: consumes the turn, burns usable value, disrupts routes, leaves ash; control unchanged', () => {
  const sector = { id: 's1', control: 'red', usableValue: 100, routesDisrupted: false };
  const r = BV.scorchedEarth(sector, 1);
  assert.equal(r.actionSaved, false);       // burning is work
  assert.equal(r.sector.usableValue, 0);    // near-total denial at full thoroughness
  assert.equal(r.sector.routesDisrupted, true); // bridges demolished on the way out
  assert.equal(r.sector.ash, true);         // the occupier inherits ash
  assert.equal(r.sector.control, 'red');    // the enemy takes the ash by advancing; abandon() is the cede
  assert.equal(r.battle, false);            // no battle sought
  assert.equal(sector.usableValue, 100);    // pure transform — input untouched
});

test('scorchedEarth: commitment scales thoroughness (hasty torching vs near-total denial)', () => {
  const sector = { usableValue: 100 };
  assert.equal(BV.scorchedEarth(sector, 0.25).sector.usableValue, 75); // hasty
  assert.ok(Math.abs(BV.scorchedEarth(sector, 0.9).sector.usableValue - 10) < 1e-9); // thorough
  // any scorching leaves recovery-denying ash (grading ash is a magnitude dial)
  assert.equal(BV.scorchedEarth(sector, 0.25).sector.ash, true);
  // out-of-range thoroughness clamps
  assert.equal(BV.scorchedEarth(sector, 2).sector.usableValue, 0);
});

/* ---- Emergent siege clock — cut routes pour turns into the supply ledger ---- */

test('siegeUpkeep: cut route pumps the supply ledger, melts substance past threshold, locks recovery', () => {
  let s = { wear: 4, supply: 0 };
  const cut = { routeConnected: false, sector: { ash: false } };
  s = BV.siegeUpkeep(s, cut); // turn 1
  assert.equal(s.supply, 1);
  assert.equal(s.substanceLossFraction, 0); // below the starvation entry threshold
  assert.equal(s.starving, false);
  assert.equal(s.wear, 4);                   // recovery locked while cut — wear does not heal
  s = BV.siegeUpkeep(s, cut); // turn 2
  assert.equal(s.supply, 2);
  s = BV.siegeUpkeep(s, cut); // turn 3 — past the threshold, substance now melts
  assert.equal(s.supply, 3);
  assert.equal(s.starving, true);
  assert.ok(s.substanceLossFraction > 0);
  const loss3 = s.substanceLossFraction;
  s = BV.siegeUpkeep(s, cut); // turn 4 — melt accelerates convexly with depth
  assert.ok(s.substanceLossFraction > loss3);
});

test('siegeUpkeep: restoring the route stops the melt and resumes recovery', () => {
  let s = { wear: 6, supply: 5 }; // deep in a siege
  s = BV.siegeUpkeep(s, { routeConnected: true, sector: { ash: false } });
  assert.equal(s.supply, 0);        // the pump resets the moment supply returns
  assert.equal(s.starving, false);
  assert.equal(s.substanceLossFraction, 0); // melt stops
  assert.ok(s.wear < 6);            // recovery resumes on unscorched ground
});

test('siegeUpkeep: ash denies recovery even when fed through intact routes', () => {
  const fed = { routeConnected: true };
  const onAsh   = BV.siegeUpkeep({ wear: 6, supply: 0 }, { ...fed, sector: { ash: true } });
  const onGreen = BV.siegeUpkeep({ wear: 6, supply: 0 }, { ...fed, sector: { ash: false } });
  assert.equal(onAsh.starving, false);   // fed — supply is not the issue on ash-with-routes
  assert.equal(onAsh.wear, 6);           // but nothing rebuilds on scorched ground
  assert.ok(onGreen.wear < 6);           // green ground under the same supply recovers
  assert.equal(BV.sectorRecoveryFactor({ ash: true }), 0);
  assert.equal(BV.sectorRecoveryFactor({ ash: false }), 1);
});

/* ---- The Moscow trap, authored end-to-end from existing verbs and rules ---- */

test('Moscow trap: burn → occupy ash → cut → starve → encircle → annihilate', () => {
  // A west→east corridor: the occupier's base (west), the supply corridor (mid),
  // the sector it will occupy (east). Supply is the real movement.isSupplied
  // predicate over an occupier-control set that interdiction later flips.
  const graph = M.buildGraph({
    sectors: {
      west: { id: 'west', regionId: 't', mapUnits: [{ q: 0, r: 0, terrainLayer: 'plains' }] },
      mid:  { id: 'mid',  regionId: 't', mapUnits: [{ q: 1, r: 0, terrainLayer: 'plains' }] },
      east: { id: 'east', regionId: 't', mapUnits: [{ q: 2, r: 0, terrainLayer: 'plains' }] },
    },
  });
  const BASE = ['0,0'], POS = '2,0';
  const suppliedFrom = (controlled) => M.isSupplied(graph, POS, BASE, (k) => controlled.has(k));

  // 1. BURN: the defender scorches the east sector before ceding it.
  const ash = BV.scorchedEarth({ id: 'east', control: 'red', usableValue: 100 }, 1).sector;
  assert.equal(ash.ash, true);
  assert.equal(ash.usableValue, 0); // the occupier inherits ash, not a base

  // 2. OCCUPY with routes intact (stretched but connected): fed, but no recovery
  //    on ash — the occupier degrades in readiness while it cannot dig in.
  const occupier = { size: 1000, commit: 8, quality: 1 };
  let fatigue = { wear: 6, supply: 0 }; // arrived worn from the march east
  const intactControl = new Set(['0,0', '1,0', '2,0']);
  assert.equal(suppliedFrom(intactControl), true);
  for (let t = 0; t < 2; t++) {
    fatigue = BV.siegeUpkeep(fatigue, { routeConnected: suppliedFrom(intactControl), sector: ash });
  }
  assert.equal(fatigue.wear, 6);        // ash denied every point of recovery
  assert.equal(fatigue.starving, false); // still fed through the corridor

  // 3. CUT: the defender's relief interdicts the mid corridor.
  const cutControl = new Set(['0,0', '2,0']); // mid flipped to the defender
  assert.equal(suppliedFrom(cutControl), false);

  // 4. STARVE: with no route and ash underfoot, the supply ledger pumps and the
  //    force melts continuously over the siege turns.
  let size = occupier.size;
  for (let t = 0; t < 7; t++) {
    fatigue = BV.siegeUpkeep(fatigue, { routeConnected: suppliedFrom(cutControl), sector: ash });
    size *= (1 - fatigue.substanceLossFraction);
  }
  assert.ok(size < 300, `expected the starved force well below 300, got ${size}`);

  // 5. ENCIRCLE: the relief army closes with escape BLOCKED. The battle is the
  //    sealed calculator — starvation, not a special rule, is what annihilates.
  const front = { garrison: 1, terrain: 'plains', fortification: 'none' }; // ash: no shield
  const relief = { size: 800, commit: 8, quality: 1, fatigue: 1.0 };       // smaller than a HEALTHY occupier
  const effectiveness = F.effectiveness(fatigue.wear);

  const healthy = B.resolveEngagement({
    attacker: relief, front, escape: 'BLOCKED',
    fieldArmy: { size: occupier.size, commit: 8, quality: 1, fatigue: effectiveness, reaches: true },
  });
  assert.equal(healthy.branch, 'DECISIVE');
  assert.equal(healthy.decisiveBattle.attackerWins, false); // a healthy occupier repels the relief
  assert.equal(healthy.decisiveBattle.annihilated, false);

  const starved = B.resolveEngagement({
    attacker: relief, front, escape: 'BLOCKED',
    fieldArmy: { size, commit: 8, quality: 1, fatigue: effectiveness, reaches: true },
  });
  assert.equal(starved.decisiveBattle.attackerWins, true);  // the melt flipped the ratio
  assert.equal(starved.decisiveBattle.annihilated, true);   // BLOCKED escape → total loss
  assert.equal(starved.decisiveBattle.loserTotalLoss, 1);
});
