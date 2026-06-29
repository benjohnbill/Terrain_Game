const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts } = require('./helpers/load-browser-scripts');

function loadGameScripts() {
  return loadScripts([
    'js/domain-data.js',
    'js/buildings.js',
    'js/faction.js',
    'js/map.js',
    'js/combat.js',
    'js/actions.js'
  ]);
}

test('drawMobilization raises troops from population, capped at 20% of population', () => {
  const ctx = loadGameScripts();
  const f = new ctx.Faction({ id: 0, name: 'T', color: '#000', colorLight: '#111', emoji: '🔴' }, false);
  f.population = 100;

  const drawn = f.drawMobilization(15);
  assert.equal(drawn, 15);
  assert.equal(f.population, 85);

  // request above the 20% ceiling of the remaining 85 -> capped at floor(85*0.2)=17
  const drawn2 = f.drawMobilization(1000);
  assert.equal(drawn2, 17);
  assert.equal(f.population, 68);
});

test('faction no longer exposes the obsolete global getDefenseAt', () => {
  const ctx = loadGameScripts();
  const f = new ctx.Faction({ id: 0, name: 'T', color: '#000', colorLight: '#111', emoji: '🔴' }, false);
  assert.equal(typeof f.getDefenseAt, 'undefined');
});

// Minimal game stub: just enough for ActionSystem.attack.
function makeGame(ctx, { attacker, defender, targetHex, neighbors, rng }) {
  const factionsById = {};
  [attacker, defender].filter(Boolean).forEach(f => { factionsById[f.id] = f; });
  return {
    rng,
    factions: [attacker, defender].filter(Boolean),
    map: {
      getNeighbors: () => neighbors,
      getHex: (q, r) => (q === targetHex.q && r === targetHex.r ? targetHex
        : neighbors.map(n => n.hex).find(h => h.q === q && h.r === r) || null)
    },
    diplomacy: {
      isAlly: () => false,
      isAtWar: () => true,
      declareWar: () => {},
      penalizeWarStarter: () => {}
    },
    getFaction: (id) => factionsById[id] || null,
    addEvent: () => {}
  };
}

function newFaction(ctx, id) {
  return new ctx.Faction({ id, name: 'F' + id, color: '#000', colorLight: '#111', emoji: '⬛' }, id !== 0);
}

test('attack uses local defense: a small garrison falls to a standing army on adjacent owned land', () => {
  const ctx = loadGameScripts();
  const attacker = newFaction(ctx, 0);
  const defender = newFaction(ctx, 1);
  attacker.gold = 1000;
  attacker.military = 100;

  const targetHex = new ctx.HexCell(5, 5);
  targetHex.terrain = 'plains';
  targetHex.owner = 1;
  targetHex.localGarrison = 6;
  targetHex.defenseValue = 8;
  defender.territories.add('5,5');

  const ownHex = new ctx.HexCell(5, 4);
  ownHex.owner = 0;
  const neighbors = [{ q: 5, r: 4, hex: ownHex }];

  const game = makeGame(ctx, { attacker, defender, targetHex, neighbors, rng: () => 0.5 });
  const result = ctx.ActionSystem.attack(game, attacker, targetHex, {});

  assert.equal(result.success, true);
  assert.equal(result.conquered, true);
  assert.equal(targetHex.owner, 0);
  assert.ok(attacker.territories.has('5,5'));
  assert.ok(attacker.military < 100);
  assert.ok(result.attackForce > result.defenseForce);
  assert.equal(result.pendingCapacityCost, null);
});

test('attack into a strong mountain garrison fails for a modest army (terrain matters)', () => {
  const ctx = loadGameScripts();
  const attacker = newFaction(ctx, 0);
  const defender = newFaction(ctx, 1);
  attacker.gold = 1000;
  attacker.military = 30;

  const targetHex = new ctx.HexCell(7, 7);
  targetHex.terrain = 'mountain_pass';
  targetHex.owner = 1;
  targetHex.localGarrison = 18;
  targetHex.defenseValue = 24;
  defender.territories.add('7,7');

  const ownHex = new ctx.HexCell(7, 6);
  ownHex.owner = 0;
  const neighbors = [{ q: 7, r: 6, hex: ownHex }];

  const game = makeGame(ctx, { attacker, defender, targetHex, neighbors, rng: () => 0.5 });
  const result = ctx.ActionSystem.attack(game, attacker, targetHex, {});

  assert.equal(result.conquered, false);
  assert.equal(targetHex.owner, 1);
  assert.ok(result.defenseForce > result.attackForce);
});

test('mobilization adds attacker force, costs population, and records a future capacity hook', () => {
  const ctx = loadGameScripts();
  const attacker = newFaction(ctx, 0);
  const defender = newFaction(ctx, 1);
  attacker.gold = 1000;
  attacker.military = 30;
  attacker.population = 200;

  const targetHex = new ctx.HexCell(8, 8);
  targetHex.terrain = 'plains';
  targetHex.owner = 1;
  targetHex.localGarrison = 6;
  targetHex.defenseValue = 8;
  defender.territories.add('8,8');

  const ownHex = new ctx.HexCell(8, 7);
  ownHex.owner = 0;
  const neighbors = [{ q: 8, r: 7, hex: ownHex }];

  const game = makeGame(ctx, { attacker, defender, targetHex, neighbors, rng: () => 0.5 });
  const result = ctx.ActionSystem.attack(game, attacker, targetHex, { mobilize: true });

  assert.ok(result.mobilizedTroops > 0);
  assert.ok(attacker.population < 200);
  assert.equal(result.pendingCapacityCost.capacity, 'command');
  assert.equal(result.pendingCapacityCost.amount, result.mobilizedTroops);
});
