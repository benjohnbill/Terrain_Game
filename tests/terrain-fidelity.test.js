'use strict';
// L2 terrain-fidelity wiring: combat reads the map's authored border
// crossing class instead of a hardcoded constant. Seal approved 2026-07-08:
//   terrain = border class (open→plains, forest→forest, hills→hills,
//   pass→pass), water = river/strait opposed variants, choke = door cap.
// Values are sealed (terrain M5/D6, water ADR-0015 + ruling ⑦); the binding
// is the approved decision. Fort stays at baseline for this fidelity layer.

const { test } = require('node:test');
const assert = require('node:assert');

const { CRADLE_MAP, CRADLE_BINDING } = require('../mockup/combat-calc/map-gen.js');
const { makeBoardFromMap, weakestCrossing } = require('../mockup/combat-calc/map-board.js');
const { viableBindings } = require('../mockup/combat-calc/map-gate.js');
const { runCradleTournament } = require('../mockup/combat-calc/map-board.js');
const T = require('../mockup/combat-calc/tournament.js');
const { DIALS } = require('../mockup/combat-calc/engine.js');

test('combatFromBorderClass maps each border class to its sealed combat effect', () => {
  assert.deepStrictEqual(T.combatFromBorderClass('open', Infinity),
    { terrain: 'plains', chokeCap: Infinity });
  assert.deepStrictEqual(T.combatFromBorderClass('forest', 1500),
    { terrain: 'forest', chokeCap: 1500 });
  assert.deepStrictEqual(T.combatFromBorderClass('hills', 1300),
    { terrain: 'hills', chokeCap: 1300 });
  assert.deepStrictEqual(T.combatFromBorderClass('pass', 1000),
    { terrain: 'pass', chokeCap: 1000 });
  assert.deepStrictEqual(T.combatFromBorderClass('river', 1000),
    { terrain: 'plains', water: 'riverOpposed', chokeCap: 1000 });
  assert.deepStrictEqual(T.combatFromBorderClass('strait', 800),
    { terrain: 'plains', water: 'straitOpposed', chokeCap: 800 });
});

test('mapping leans on the sealed engine dials (pass 2.0, opposed water)', () => {
  assert.strictEqual(DIALS.terrain.pass, 2.0);       // M5/D6 AGREED
  assert.strictEqual(DIALS.terrain.forest, 1.2);
  assert.strictEqual(DIALS.terrain.hills, 1.2);
  assert.strictEqual(DIALS.water.riverOpposed, 0.70); // ADR 0015
  assert.strictEqual(DIALS.water.straitOpposed, 0.55); // ruling ⑦
});

test('weakestCrossing picks the most-open border (attacker takes the soft crossing)', () => {
  assert.deepStrictEqual(
    weakestCrossing([{ cls: 'pass', door: 1000 }, { cls: 'open', door: Infinity }]),
    { cls: 'open', door: Infinity });
  assert.deepStrictEqual(
    weakestCrossing([{ cls: 'pass', door: 1000 }, { cls: 'river', door: 1000 }]),
    { cls: 'river', door: 1000 });
  assert.deepStrictEqual(
    weakestCrossing([{ cls: 'strait', door: 500 }]),
    { cls: 'strait', door: 500 });
});

test('board carries frontClass (weakest-link crossing) and frontDoor per front', () => {
  const realms = makeBoardFromMap(CRADLE_MAP, CRADLE_BINDING);
  const valid = new Set(['open', 'forest', 'hills', 'pass', 'river', 'strait']);
  const seen = new Set();
  for (const r of realms) {
    assert.ok(r.frontClass, `${r.name} has frontClass`);
    assert.ok(r.frontDoor, `${r.name} has frontDoor`);
    assert.deepStrictEqual(Object.keys(r.frontClass).sort(), Object.keys(r.frontG).sort(),
      `${r.name} frontClass keys align with frontG`);
    for (const [nbr, cls] of Object.entries(r.frontClass)) {
      assert.ok(valid.has(cls), `${r.name}→${nbr} class ${cls} valid`);
      seen.add(cls);
      const door = r.frontDoor[nbr];
      if (cls === 'open') assert.strictEqual(door, Infinity, `open front door Infinity`);
      else assert.ok(door > 0 && door < Infinity, `${cls} front door finite`);
    }
  }
  assert.ok(seen.size >= 2, `map geography produces diverse front classes, got ${[...seen]}`);
});

test('cradle tournament runs end-to-end with class-derived combat terrain', () => {
  const viable = viableBindings(CRADLE_MAP, 5).viable.slice(0, 2);
  const recs = runCradleTournament({ map: CRADLE_MAP, bindings: viable, reps: 2, seed: 1 });
  assert.ok(recs.length > 0);
  for (const r of recs) assert.ok('winner' in r);
});
