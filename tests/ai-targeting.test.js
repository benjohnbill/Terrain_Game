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
      getEnemies: () => defenders.map((defender) => defender.id),
      getProposalsFor: () => []
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

test('AI scoring penalizes coast and strait attacks unless a port mitigates the crossing', () => {
  const ctx = loadAIScripts();
  ctx.Math.random = () => 0.5;

  const ai = newFaction(ctx, 0, 90);
  const defender = newFaction(ctx, 1, 60);

  const staging = makeHex(ctx, 1, 0, 0, 'plains', 8, 8, 10, 20);
  const portStaging = makeHex(ctx, 2, 0, 0, 'plains', 8, 8, 10, 20);
  portStaging.primaryFunction = 'port';
  ai.territories.add(staging.key());
  ai.territories.add(portStaging.key());

  const coastWithoutPort = makeHex(ctx, 1, 1, 1, 'coast_strait', 8, 10, 11, 20);
  const coastWithPort = makeHex(ctx, 2, 1, 1, 'coast_strait', 8, 10, 11, 20);
  defender.territories.add(coastWithoutPort.key());
  defender.territories.add(coastWithPort.key());

  const noPortGame = makeTargetGame(ctx, {
    faction: ai,
    defenders: [defender],
    ownHexes: [staging],
    targetHexes: [coastWithoutPort]
  });
  const portGame = makeTargetGame(ctx, {
    faction: ai,
    defenders: [defender],
    ownHexes: [portStaging],
    targetHexes: [coastWithPort]
  });

  const originalComputeAttackForce = ctx.CombatSystem.computeAttackForce;
  const originalCrossingPenalty = ctx.CombatSystem.crossingPenalty;
  let explicitPenaltyScore;
  let noPenaltyScore;
  try {
    ctx.CombatSystem.computeAttackForce = () => 90;
    explicitPenaltyScore = ctx.AIPlayer.scoreTarget(noPortGame, ai, coastWithoutPort);
    ctx.CombatSystem.crossingPenalty = () => 1;
    noPenaltyScore = ctx.AIPlayer.scoreTarget(noPortGame, ai, coastWithoutPort);
  } finally {
    ctx.CombatSystem.computeAttackForce = originalComputeAttackForce;
    ctx.CombatSystem.crossingPenalty = originalCrossingPenalty;
  }
  assert.ok(noPenaltyScore > explicitPenaltyScore);

  const noPortScore = ctx.AIPlayer.scoreTarget(noPortGame, ai, coastWithoutPort);
  const portScore = ctx.AIPlayer.scoreTarget(portGame, ai, coastWithPort);
  assert.ok(portScore > noPortScore);
});

test('AI scoring can prefer a richer province when combat outlook is comparable', () => {
  const ctx = loadAIScripts();
  ctx.Math.random = () => 0.5;

  const ai = newFaction(ctx, 0, 100);
  const defender = newFaction(ctx, 1, 70);

  const staging = makeHex(ctx, 3, 0, 0, 'plains', 8, 8, 10, 20);
  ai.territories.add(staging.key());

  const poorTarget = makeHex(ctx, 3, 1, 1, 'plains', 8, 10, 4, 10);
  const richTarget = makeHex(ctx, 4, 1, 1, 'plains', 8, 10, 20, 36);
  defender.territories.add(poorTarget.key());
  defender.territories.add(richTarget.key());

  const game = makeTargetGame(ctx, {
    faction: ai,
    defenders: [defender],
    ownHexes: [staging],
    targetHexes: [poorTarget, richTarget]
  });

  assert.ok(ctx.AIPlayer.scoreTarget(game, ai, richTarget) > ctx.AIPlayer.scoreTarget(game, ai, poorTarget));
  assert.equal(ctx.AIPlayer.chooseBestTarget(game, ai), richTarget);
});

test('defensive AI chooses the locally vulnerable border hex over a naturally strong pass', () => {
  const ctx = loadAIScripts();
  ctx.Math.random = () => 0.5;

  const ai = newFaction(ctx, 0, 90);
  const enemy = newFaction(ctx, 1, 100);

  const weakPlain = makeHex(ctx, 5, 5, 0, 'plains', 3, 6, 8, 20);
  const strongPass = makeHex(ctx, 6, 5, 0, 'mountain_pass', 28, 28, 8, 18);
  const enemyNearPlain = makeHex(ctx, 5, 6, 1, 'plains', 8, 8, 10, 20);
  const enemyNearPass = makeHex(ctx, 6, 6, 1, 'plains', 8, 8, 10, 20);
  ai.territories.add(weakPlain.key());
  ai.territories.add(strongPass.key());
  enemy.territories.add(enemyNearPlain.key());
  enemy.territories.add(enemyNearPass.key());

  const game = makeTargetGame(ctx, {
    faction: ai,
    defenders: [enemy],
    ownHexes: [weakPlain, strongPass],
    targetHexes: [enemyNearPlain, enemyNearPass]
  });

  // The strong pass borders MORE enemies, so the old "most enemy neighbors"
  // heuristic would defend it; the weak plain borders fewer but is far more
  // vulnerable locally (tiny garrison, no terrain defense). Wire neighbors
  // explicitly so old and new selection genuinely diverge.
  const neighborMap = {
    [weakPlain.key()]: [{ q: 5, r: 6 }],
    [strongPass.key()]: [{ q: 5, r: 6 }, { q: 6, r: 6 }]
  };
  game.map.getNeighbors = (q, r) => neighborMap[`${q},${r}`] || [];
  game.map.getAdjacentEnemyHexes = () => [enemyNearPlain, enemyNearPass];
  const events = [];
  game.addEvent = (message, factionId) => events.push({ message, factionId });

  const result = ctx.AIPlayer._tryDefend(game, ai);
  assert.equal(result.action, 'defend');
  assert.equal(result.params.targetHex, weakPlain);
  assert.equal(ai.defendingHex, weakPlain.key());
});

test('takeTurn attacks the locally weak target through the normal AI action path', () => {
  const ctx = loadAIScripts();
  ctx.Math.random = () => 0.5;

  const ai = newFaction(ctx, 0, 120);
  const strongOwner = newFaction(ctx, 1, 120);
  const weakOwner = newFaction(ctx, 2, 20);

  const staging = makeHex(ctx, 8, 7, 0, 'plains', 8, 8, 10, 20);
  ai.territories.add(staging.key());

  const weakLocalTarget = makeHex(ctx, 8, 8, 1, 'plains', 4, 6, 12, 24);
  strongOwner.territories.add(weakLocalTarget.key());

  const strongLocalTarget = makeHex(ctx, 9, 8, 2, 'mountain_pass', 24, 30, 8, 18);
  weakOwner.territories.add(strongLocalTarget.key());

  const events = [];
  const game = makeTargetGame(ctx, {
    faction: ai,
    defenders: [strongOwner, weakOwner],
    ownHexes: [staging],
    targetHexes: [weakLocalTarget, strongLocalTarget]
  });
  game.rng = () => 0.5;
  game.addEvent = (message, factionId) => events.push({ message, factionId });

  const result = ctx.AIPlayer.takeTurn(game, ai);

  assert.equal(result.action, 'attack');
  assert.equal(result.params.targetHex, weakLocalTarget);
  assert.equal(weakLocalTarget.owner, ai.id);
  assert.equal(ai.actionTaken, true);
  assert.equal(events.length, 1);
});
