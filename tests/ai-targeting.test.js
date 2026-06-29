const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts } = require('./helpers/load-browser-scripts');

function loadAIScripts() {
  return loadScripts([
    'js/domain-data.js',
    'js/buildings.js',
    'js/faction.js',
    'js/map.js',
    'js/combat.js',
    'js/actions.js',
    'js/ai.js'
  ]);
}

function newFaction(ctx, id, military) {
  const faction = new ctx.Faction({
    id,
    name: 'F' + id,
    color: '#000',
    colorLight: '#111',
    emoji: '⬛'
  }, id !== 0);
  faction.military = military;
  faction.gold = 1000;
  return faction;
}

function makeHex(ctx, q, r, owner, terrain, localGarrison, defenseValue, economyValue, population) {
  const hex = new ctx.HexCell(q, r);
  hex.owner = owner;
  hex.terrain = terrain;
  hex.localGarrison = localGarrison;
  hex.defenseValue = defenseValue;
  hex.economyValue = economyValue;
  hex.population = population;
  hex.provinceName = `${q},${r}`;
  return hex;
}

function makeTargetGame(ctx, { faction, defenders, ownHexes, targetHexes }) {
  const allHexes = [...ownHexes, ...targetHexes];
  const factionById = { [faction.id]: faction };
  defenders.forEach((defender) => { factionById[defender.id] = defender; });

  const byKey = new Map(allHexes.map((hex) => [hex.key(), hex]));
  const neighborsByKey = new Map();

  for (const target of targetHexes) {
    neighborsByKey.set(target.key(), ownHexes.map((hex) => ({ q: hex.q, r: hex.r })));
  }
  for (const own of ownHexes) {
    neighborsByKey.set(own.key(), targetHexes.map((hex) => ({ q: hex.q, r: hex.r })));
  }

  return {
    factions: [faction, ...defenders],
    map: {
      getAdjacentEnemyHexes: () => targetHexes,
      getNeighbors: (q, r) => neighborsByKey.get(`${q},${r}`) || [],
      getHex: (q, r) => byKey.get(`${q},${r}`) || null,
      getHexByKey: (key) => byKey.get(key) || null
    },
    diplomacy: {
      isAlly: () => false,
      isAtWar: () => true,
      getEnemies: () => defenders.map((defender) => defender.id)
    },
    getFaction: (id) => factionById[id] || null,
    getAliveFactions: () => [faction, ...defenders].filter((item) => item.alive)
  };
}

test('AI prefers a weak local garrison even when it belongs to a strong faction', () => {
  const ctx = loadAIScripts();
  ctx.Math.random = () => 0.5;

  const ai = newFaction(ctx, 0, 90);
  const strongOwner = newFaction(ctx, 1, 220);
  const weakOwner = newFaction(ctx, 2, 20);

  const staging = makeHex(ctx, 5, 4, 0, 'plains', 8, 8, 10, 20);
  ai.territories.add(staging.key());

  const weakLocalTarget = makeHex(ctx, 5, 5, 1, 'plains', 4, 6, 10, 20);
  strongOwner.territories.add(weakLocalTarget.key());

  const strongLocalTarget = makeHex(ctx, 6, 5, 2, 'mountain_pass', 24, 30, 8, 18);
  weakOwner.territories.add(strongLocalTarget.key());

  const game = makeTargetGame(ctx, {
    faction: ai,
    defenders: [strongOwner, weakOwner],
    ownHexes: [staging],
    targetHexes: [weakLocalTarget, strongLocalTarget]
  });

  const chosen = ctx.AIPlayer.chooseBestTarget(game, ai);
  assert.equal(chosen, weakLocalTarget);
});

test('AI scoring ignores wall defense when attacker has wall-ignore technology', () => {
  const ctx = loadAIScripts();
  ctx.Math.random = () => 0.5;

  const ai = newFaction(ctx, 0, 90);
  ai.techs.military = 3;

  const defender = newFaction(ctx, 1, 60);
  const staging = makeHex(ctx, 1, 0, 0, 'plains', 8, 8, 10, 20);
  ai.territories.add(staging.key());

  const wallTarget = makeHex(ctx, 1, 1, 1, 'plains', 8, 10, 12, 20);
  wallTarget.building = 'wall';
  defender.territories.add(wallTarget.key());
  defender.buildings.set(wallTarget.key(), 'wall');

  const wallGame = makeTargetGame(ctx, {
    faction: ai,
    defenders: [defender],
    ownHexes: [staging],
    targetHexes: [wallTarget]
  });

  const noWallTarget = makeHex(ctx, 2, 1, 1, 'plains', 8, 10, 12, 20);
  defender.territories.add(noWallTarget.key());

  const noWallGame = makeTargetGame(ctx, {
    faction: ai,
    defenders: [defender],
    ownHexes: [staging],
    targetHexes: [noWallTarget]
  });

  assert.equal(ctx.AIPlayer.scoreTarget(wallGame, ai, wallTarget), ctx.AIPlayer.scoreTarget(noWallGame, ai, noWallTarget));
});
