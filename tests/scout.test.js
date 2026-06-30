const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts } = require('./helpers/load-browser-scripts');

function loadScoutScripts() {
  return loadScripts([
    'js/domain-data.js',
    'js/province-data.js',
    'js/intel.js',
    'js/buildings.js',
    'js/faction.js',
    'js/map.js',
    'js/combat.js',
    'js/actions.js'
  ]);
}

function newFaction(ctx, id) {
  const faction = new ctx.Faction({
    id,
    name: 'F' + id,
    color: '#000',
    colorLight: '#111',
    emoji: '⬛'
  }, id !== 0);
  faction.gold = 1000;
  return faction;
}

function makeScoutGame(ctx, { ownHex, targetHex }) {
  return {
    map: {
      getNeighbors: (q, r) => {
        if (q === targetHex.q && r === targetHex.r) return [{ q: ownHex.q, r: ownHex.r }];
        if (q === ownHex.q && r === ownHex.r) return [{ q: targetHex.q, r: targetHex.r }];
        return [];
      },
      getHex: (q, r) => {
        if (q === targetHex.q && r === targetHex.r) return targetHex;
        if (q === ownHex.q && r === ownHex.r) return ownHex;
        return null;
      }
    }
  };
}

test('scout raises confidence on an adjacent enemy hex and reports before/after', () => {
  const ctx = loadScoutScripts();
  const scout = newFaction(ctx, 0);

  const ownHex = new ctx.HexCell(3, 3);
  ownHex.owner = 0;
  scout.territories.add(ownHex.key());

  const targetHex = new ctx.HexCell(3, 4);
  targetHex.owner = 1;
  targetHex.provinceName = '형강 수로';
  targetHex.informationConfidence = 0.45;

  const game = makeScoutGame(ctx, { ownHex, targetHex });
  const result = ctx.ActionSystem.scout(game, scout, targetHex);

  assert.equal(result.success, true);
  assert.equal(result.confidenceBefore, 0.45);
  assert.equal(result.confidenceAfter, 0.7);
  assert.equal(targetHex.informationConfidence, 0.7);
  assert.equal(result.intel.id, 'partial');
  assert.ok(result.scoutCost >= 1);
});

test('scout rejects own territory', () => {
  const ctx = loadScoutScripts();
  const scout = newFaction(ctx, 0);

  const ownHex = new ctx.HexCell(3, 3);
  ownHex.owner = 0;
  scout.territories.add(ownHex.key());

  const targetHex = new ctx.HexCell(3, 4);
  targetHex.owner = 0;
  scout.territories.add(targetHex.key());

  const game = makeScoutGame(ctx, { ownHex, targetHex });
  const result = ctx.ActionSystem.scout(game, scout, targetHex);

  assert.equal(result.success, false);
  assert.equal(result.message, '자신의 영토는 정찰할 필요가 없습니다.');
});

test('scout rejects non-adjacent targets', () => {
  const ctx = loadScoutScripts();
  const scout = newFaction(ctx, 0);

  const ownHex = new ctx.HexCell(1, 1);
  ownHex.owner = 0;
  scout.territories.add(ownHex.key());

  const targetHex = new ctx.HexCell(9, 9);
  targetHex.owner = 1;

  const game = {
    map: { getNeighbors: () => [], getHex: () => null }
  };
  const result = ctx.ActionSystem.scout(game, scout, targetHex);

  assert.equal(result.success, false);
  assert.equal(result.message, '인접한 지역만 정찰할 수 있습니다.');
});

test('scout rejects when the faction cannot afford the cost', () => {
  const ctx = loadScoutScripts();
  const scout = newFaction(ctx, 0);
  scout.gold = 0;

  const ownHex = new ctx.HexCell(3, 3);
  ownHex.owner = 0;
  scout.territories.add(ownHex.key());

  const targetHex = new ctx.HexCell(3, 4);
  targetHex.owner = 1;
  targetHex.informationConfidence = 0.45;

  const game = makeScoutGame(ctx, { ownHex, targetHex });
  const result = ctx.ActionSystem.scout(game, scout, targetHex);

  assert.equal(result.success, false);
  assert.ok(result.message.startsWith('정찰 비용이 부족합니다.'));
  assert.equal(targetHex.informationConfidence, 0.45);
});

test('a low-confidence enemy hex reads as uncertainty, then opportunity once scouted', () => {
  const ctx = loadScripts([
    'js/domain-data.js',
    'js/province-data.js',
    'js/intel.js',
    'js/situation.js'
  ]);

  function enemyHex(confidence) {
    return {
      key: () => '5,5',
      owner: 1,
      provinceId: 'x',
      provinceName: '루오위안 평야',
      terrain: 'plains',
      localGarrison: 9,
      defenseValue: 10,
      economyValue: 14, // >= 12 so the opportunity branch is eligible
      informationConfidence: confidence,
      strategicTags: []
    };
  }

  const uncertain = ctx.SituationAnalyzer.analyze({ currentFactionId: 0, hexes: [enemyHex(0.45)] });
  assert.equal(uncertain.highlights[0].type, 'uncertainty');

  const scouted = ctx.SituationAnalyzer.analyze({ currentFactionId: 0, hexes: [enemyHex(0.7)] });
  assert.equal(scouted.highlights[0].type, 'opportunity');
});

test('executeSelectedCommand executes a scout command and consumes the turn action', () => {
  const ctx = loadScripts([
    'js/domain-data.js',
    'js/province-data.js',
    'js/intel.js',
    'js/buildings.js',
    'js/tech.js',
    'js/faction.js',
    'js/map.js',
    'js/diplomacy.js',
    'js/combat.js',
    'js/actions.js',
    'js/command-preview.js',
    'js/game.js'
  ]);

  const game = Object.create(ctx.Game.prototype);
  const human = new ctx.Faction({ id: 0, name: 'A', color: '#000', colorLight: '#111', emoji: 'A' }, false);
  const enemy = new ctx.Faction({ id: 1, name: 'D', color: '#111', colorLight: '#222', emoji: 'D' }, true);
  human.gold = 1000;

  const ownHex = new ctx.HexCell(2, 2);
  ownHex.owner = 0;
  human.territories.add(ownHex.key());

  const targetHex = new ctx.HexCell(2, 3);
  targetHex.owner = 1;
  targetHex.provinceName = '형강 수로';
  targetHex.informationConfidence = 0.45;

  game.factions = [human, enemy];
  game.currentTurnIndex = 0;
  game.state = 'playing';
  game.turnNumber = 1;
  game.eventLog = [];
  game.selectedCommand = { intent: 'scout', targetKey: targetHex.key(), targetName: '형강 수로' };
  game.map = {
    getNeighbors: (q, r) => {
      if (q === targetHex.q && r === targetHex.r) return [{ q: ownHex.q, r: ownHex.r }];
      if (q === ownHex.q && r === ownHex.r) return [{ q: targetHex.q, r: targetHex.r }];
      return [];
    },
    getHex: (q, r) => {
      if (q === ownHex.q && r === ownHex.r) return ownHex;
      if (q === targetHex.q && r === targetHex.r) return targetHex;
      return null;
    },
    getHexByKey: (key) => (key === targetHex.key() ? targetHex : ownHex),
    clearHighlights: () => {}
  };
  // Stub the heavy refresh + victory paths; they are exercised in browser verification.
  game.refreshStrategicState = () => {};
  game._checkAndHandleVictory = () => {};

  const before = targetHex.informationConfidence;
  const result = game.executeSelectedCommand();

  assert.equal(result.success, true);
  assert.ok(targetHex.informationConfidence > before);
  assert.equal(targetHex.informationConfidence, 0.7);
  assert.equal(human.actionTaken, true);
  assert.equal(game.selectedCommand, null);
});

test('canScoutSelected reflects adjacency and ownership of the selected target', () => {
  const ctx = loadScripts([
    'js/domain-data.js', 'js/province-data.js', 'js/intel.js', 'js/buildings.js', 'js/tech.js',
    'js/faction.js', 'js/map.js', 'js/diplomacy.js', 'js/combat.js', 'js/actions.js',
    'js/command-preview.js', 'js/game.js'
  ]);
  const game = Object.create(ctx.Game.prototype);
  const human = new ctx.Faction({ id: 0, name: 'A', color: '#000', colorLight: '#111', emoji: 'A' }, false);
  game.factions = [human];
  game.currentTurnIndex = 0;

  const ownHex = new ctx.HexCell(2, 2);
  ownHex.owner = 0;
  human.territories.add(ownHex.key());
  const adjacentEnemy = new ctx.HexCell(2, 3);
  adjacentEnemy.owner = 1;
  const farEnemy = new ctx.HexCell(9, 9);
  farEnemy.owner = 1;
  const hexes = { [ownHex.key()]: ownHex, [adjacentEnemy.key()]: adjacentEnemy, [farEnemy.key()]: farEnemy };

  game.map = {
    getNeighbors: (q, r) => {
      if (q === adjacentEnemy.q && r === adjacentEnemy.r) return [{ q: ownHex.q, r: ownHex.r }];
      if (q === ownHex.q && r === ownHex.r) return [{ q: adjacentEnemy.q, r: adjacentEnemy.r }];
      return [];
    },
    getHex: (q, r) => hexes[`${q},${r}`] || null,
    getHexByKey: (key) => hexes[key] || null
  };

  game.selectedCommand = { intent: 'scout', targetKey: adjacentEnemy.key() };
  assert.equal(game.canScoutSelected(), true);

  game.selectedCommand = { intent: 'scout', targetKey: farEnemy.key() };
  assert.equal(game.canScoutSelected(), false);

  game.selectedCommand = { intent: 'scout', targetKey: ownHex.key() };
  assert.equal(game.canScoutSelected(), false);

  game.selectedCommand = null;
  assert.equal(game.canScoutSelected(), false);
});

test('scout succeeds on an adjacent neutral hex (owner null)', () => {
  const ctx = loadScoutScripts();
  const scout = newFaction(ctx, 0);

  const ownHex = new ctx.HexCell(3, 3);
  ownHex.owner = 0;
  scout.territories.add(ownHex.key());

  const targetHex = new ctx.HexCell(3, 4);
  targetHex.owner = null;
  targetHex.informationConfidence = 0.45;

  const game = makeScoutGame(ctx, { ownHex, targetHex });
  const result = ctx.ActionSystem.scout(game, scout, targetHex);

  assert.equal(result.success, true);
  assert.equal(targetHex.informationConfidence, 0.7);
});

test('scout rejects a null target hex', () => {
  const ctx = loadScoutScripts();
  const scout = newFaction(ctx, 0);
  const game = { map: { getNeighbors: () => [], getHex: () => null } };

  const result = ctx.ActionSystem.scout(game, scout, null);

  assert.equal(result.success, false);
  assert.equal(result.message, '대상 지역이 없습니다.');
});

test('executeScoutOnSelected scouts the target regardless of command intent', () => {
  const ctx = loadScripts([
    'js/domain-data.js', 'js/province-data.js', 'js/intel.js', 'js/buildings.js', 'js/tech.js',
    'js/faction.js', 'js/map.js', 'js/diplomacy.js', 'js/combat.js', 'js/actions.js',
    'js/command-preview.js', 'js/game.js'
  ]);
  const game = Object.create(ctx.Game.prototype);
  const human = new ctx.Faction({ id: 0, name: 'A', color: '#000', colorLight: '#111', emoji: 'A' }, false);
  const enemy = new ctx.Faction({ id: 1, name: 'D', color: '#111', colorLight: '#222', emoji: 'D' }, true);
  human.gold = 1000;

  const ownHex = new ctx.HexCell(2, 2);
  ownHex.owner = 0;
  human.territories.add(ownHex.key());

  const targetHex = new ctx.HexCell(2, 3);
  targetHex.owner = 1;
  targetHex.provinceName = '형강 수로';
  targetHex.informationConfidence = 0.45;

  game.factions = [human, enemy];
  game.currentTurnIndex = 0;
  game.state = 'playing';
  game.turnNumber = 1;
  game.eventLog = [];
  // intent is 'attack' — executeScoutOnSelected must scout the target regardless
  game.selectedCommand = { intent: 'attack', targetKey: targetHex.key(), targetName: '형강 수로' };
  game.map = {
    getNeighbors: (q, r) => {
      if (q === targetHex.q && r === targetHex.r) return [{ q: ownHex.q, r: ownHex.r }];
      if (q === ownHex.q && r === ownHex.r) return [{ q: targetHex.q, r: targetHex.r }];
      return [];
    },
    getHex: (q, r) => {
      if (q === ownHex.q && r === ownHex.r) return ownHex;
      if (q === targetHex.q && r === targetHex.r) return targetHex;
      return null;
    },
    getHexByKey: (key) => (key === targetHex.key() ? targetHex : ownHex),
    clearHighlights: () => {}
  };
  game.refreshStrategicState = () => {};
  game._checkAndHandleVictory = () => {};

  const before = targetHex.informationConfidence;
  const result = game.executeScoutOnSelected();

  assert.equal(result.success, true);
  assert.ok(targetHex.informationConfidence > before);
  assert.equal(targetHex.informationConfidence, 0.7);
  assert.equal(human.actionTaken, true);
});
