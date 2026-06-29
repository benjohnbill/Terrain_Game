const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts } = require('./helpers/load-browser-scripts');

function loadPreviewScripts() {
  return loadScripts([
    'js/domain-data.js',
    'js/buildings.js',
    'js/faction.js',
    'js/map.js',
    'js/combat.js',
    'js/actions.js',
    'js/command-preview.js'
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
  faction.military = 60;
  faction.population = 200;
  return faction;
}

function makeGame(ctx, { attacker, defender, targetHex, ownHex }) {
  const factionsById = { [attacker.id]: attacker };
  if (defender) factionsById[defender.id] = defender;
  return {
    factions: defender ? [attacker, defender] : [attacker],
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
    },
    diplomacy: {
      isAlly: () => false,
      isAtWar: () => true
    },
    getFaction: (id) => factionsById[id] || null
  };
}

test('attack preview computes local force forecast without mutating population', () => {
  const ctx = loadPreviewScripts();
  const attacker = newFaction(ctx, 0);
  const defender = newFaction(ctx, 1);
  defender.military = 200;

  const ownHex = new ctx.HexCell(4, 4);
  ownHex.owner = 0;
  attacker.territories.add(ownHex.key());

  const targetHex = new ctx.HexCell(4, 5);
  targetHex.owner = 1;
  targetHex.terrain = 'plains';
  targetHex.localGarrison = 8;
  targetHex.defenseValue = 10;
  targetHex.provinceName = '루오위안 평야';
  defender.territories.add(targetHex.key());

  const game = makeGame(ctx, { attacker, defender, targetHex, ownHex });
  const beforePopulation = attacker.population;
  const preview = ctx.CommandPreview.buildAttackPreview(game, attacker, targetHex, { mobilize: false });

  assert.equal(preview.valid, true);
  assert.equal(preview.kind, 'attack');
  assert.equal(preview.targetKey, targetHex.key());
  assert.equal(preview.targetName, '루오위안 평야');
  assert.equal(preview.attackForce, ctx.CombatSystem.computeAttackForce(attacker, targetHex, {
    mobilizedTroops: 0,
    portMitigation: false
  }));
  assert.equal(preview.defenseForce, ctx.CombatSystem.computeDefenseForce(targetHex, defender));
  assert.equal(preview.forecast.band, ctx.CombatSystem.forecast(preview.attackForce, preview.defenseForce).band);
  assert.equal(preview.mobilization.enabled, false);
  assert.equal(preview.mobilization.estimatedTroops, 0);
  assert.equal(preview.capacityCost, null);
  assert.equal(attacker.population, beforePopulation);
});

test('mobilized preview estimates population and future command-capacity cost', () => {
  const ctx = loadPreviewScripts();
  const attacker = newFaction(ctx, 0);
  const defender = newFaction(ctx, 1);

  const ownHex = new ctx.HexCell(4, 4);
  ownHex.owner = 0;
  attacker.territories.add(ownHex.key());

  const targetHex = new ctx.HexCell(4, 5);
  targetHex.owner = 1;
  targetHex.terrain = 'plains';
  targetHex.localGarrison = 8;
  targetHex.defenseValue = 10;
  defender.territories.add(targetHex.key());

  const game = makeGame(ctx, { attacker, defender, targetHex, ownHex });
  const plainPreview = ctx.CommandPreview.buildAttackPreview(game, attacker, targetHex, { mobilize: false });
  const mobilizedPreview = ctx.CommandPreview.buildAttackPreview(game, attacker, targetHex, { mobilize: true });

  assert.equal(mobilizedPreview.valid, true);
  assert.equal(mobilizedPreview.mobilization.enabled, true);
  assert.equal(mobilizedPreview.mobilization.estimatedTroops, 20);
  assert.equal(mobilizedPreview.mobilization.populationCost, 20);
  assert.equal(mobilizedPreview.capacityCost.capacity, 'command');
  assert.equal(mobilizedPreview.capacityCost.amount, 20);
  assert.ok(mobilizedPreview.attackForce > plainPreview.attackForce);
  assert.ok(mobilizedPreview.warnings.some((warning) => warning.level === 'severe'));
});

test('preview rejects non-adjacent attack targets with the same player-facing reason as attack validation', () => {
  const ctx = loadPreviewScripts();
  const attacker = newFaction(ctx, 0);
  const defender = newFaction(ctx, 1);

  const ownHex = new ctx.HexCell(1, 1);
  ownHex.owner = 0;
  attacker.territories.add(ownHex.key());

  const targetHex = new ctx.HexCell(9, 9);
  targetHex.owner = 1;
  defender.territories.add(targetHex.key());

  const game = {
    factions: [attacker, defender],
    map: {
      getNeighbors: () => [],
      getHex: () => null
    },
    diplomacy: { isAlly: () => false, isAtWar: () => true },
    getFaction: (id) => (id === defender.id ? defender : attacker)
  };

  const preview = ctx.CommandPreview.buildAttackPreview(game, attacker, targetHex, { mobilize: false });
  assert.equal(preview.valid, false);
  assert.equal(preview.message, '인접한 영토만 공격할 수 있습니다.');
});

test('wall-ignore parity: preview reduces defenseForce by wall bonus when attacker has military tech 3+', () => {
  const ctx = loadPreviewScripts();
  const attacker = newFaction(ctx, 0);
  attacker.techs.military = 3; // canIgnoreWalls() → true

  const defender = newFaction(ctx, 1);

  const ownHex = new ctx.HexCell(4, 4);
  ownHex.owner = 0;
  attacker.territories.add(ownHex.key());

  const targetHex = new ctx.HexCell(4, 5);
  targetHex.owner = 1;
  targetHex.terrain = 'plains';
  targetHex.localGarrison = 8;
  targetHex.defenseValue = 10;
  targetHex.building = 'wall';
  defender.territories.add(targetHex.key());

  const game = makeGame(ctx, { attacker, defender, targetHex, ownHex });
  const preview = ctx.CommandPreview.buildAttackPreview(game, attacker, targetHex, { mobilize: false });

  assert.equal(preview.valid, true);

  const rawDefense = ctx.CombatSystem.computeDefenseForce(targetHex, defender);
  const wallDef = ctx.BUILDINGS.wall.effects.defenseBonus || 0;

  // guard: the wall bonus must actually be positive so the branch is meaningful
  assert.ok(wallDef > 0);
  // guard: the wall-ignore branch must have reduced defenseForce
  assert.ok(preview.defenseForce < rawDefense);
  // primary parity assertion
  assert.equal(preview.defenseForce, Math.max(1, rawDefense - wallDef));
});

test('Game creates an attack command preview for an adjacent enemy target', () => {
  const ctx = loadScripts([
    'js/domain-data.js',
    'js/province-data.js',
    'js/capacity.js',
    'js/situation.js',
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
  const attacker = new ctx.Faction({ id: 0, name: 'A', color: '#000', colorLight: '#111', emoji: 'A' }, false);
  const defender = new ctx.Faction({ id: 1, name: 'D', color: '#111', colorLight: '#222', emoji: 'D' }, true);
  attacker.gold = 1000;
  attacker.military = 60;
  attacker.population = 200;

  const ownHex = new ctx.HexCell(2, 2);
  ownHex.owner = 0;
  attacker.territories.add(ownHex.key());

  const targetHex = new ctx.HexCell(2, 3);
  targetHex.owner = 1;
  targetHex.provinceName = '관중 관문';
  targetHex.localGarrison = 8;
  targetHex.defenseValue = 12;
  defender.territories.add(targetHex.key());

  game.factions = [attacker, defender];
  game.currentTurnIndex = 0;
  game.situation = { highlights: [] };
  game.selectedCommand = null;
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
    getHexByKey: (key) => (key === targetHex.key() ? targetHex : ownHex)
  };
  game.diplomacy = { isAlly: () => false, isAtWar: () => true };

  const command = game.createCommandForHex(targetHex);

  assert.equal(command.intent, 'attack');
  assert.equal(command.targetKey, targetHex.key());
  assert.equal(command.preview.kind, 'attack');
  assert.equal(command.preview.valid, true);
  assert.equal(command.mobilize, false);
});

// ──────────────────── shared helpers for Game-method tests ────────────────────

function loadGameScripts() {
  return loadScripts([
    'js/domain-data.js',
    'js/province-data.js',
    'js/capacity.js',
    'js/situation.js',
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
}

// ──────────────────── executeSelectedCommand ────────────────────

test('executeSelectedCommand dispatches attack and forwards mobilize:true', () => {
  const ctx = loadGameScripts();
  const game = Object.create(ctx.Game.prototype);
  const targetHex = new ctx.HexCell(2, 3);

  game.selectedCommand = { intent: 'attack', targetKey: '2,3' };
  game.map = { getHexByKey: (k) => (k === '2,3' ? targetHex : null) };
  game.executeAction = (action, params) => ({ _action: action, _params: params, success: true });

  const result = game.executeSelectedCommand({ mobilize: true });
  assert.equal(result._action, 'attack');
  assert.equal(result._params.targetHex, targetHex);
  assert.equal(result._params.mobilize, true);
});

test('executeSelectedCommand dispatches attack and forwards mobilize:false', () => {
  const ctx = loadGameScripts();
  const game = Object.create(ctx.Game.prototype);
  const targetHex = new ctx.HexCell(2, 3);

  game.selectedCommand = { intent: 'attack', targetKey: '2,3' };
  game.map = { getHexByKey: (k) => (k === '2,3' ? targetHex : null) };
  game.executeAction = (action, params) => ({ _action: action, _params: params, success: true });

  const result = game.executeSelectedCommand({ mobilize: false });
  assert.equal(result._action, 'attack');
  assert.equal(result._params.targetHex, targetHex);
  assert.equal(result._params.mobilize, false);
});

test('executeSelectedCommand returns failure when no selectedCommand', () => {
  const ctx = loadGameScripts();
  const game = Object.create(ctx.Game.prototype);
  game.selectedCommand = null;

  const result = game.executeSelectedCommand({ mobilize: false });
  assert.equal(result.success, false);
  assert.equal(result.message, '선택된 명령이 없습니다.');
});

test('executeSelectedCommand returns failure when targetHex is missing', () => {
  const ctx = loadGameScripts();
  const game = Object.create(ctx.Game.prototype);
  game.selectedCommand = { intent: 'attack', targetKey: '9,9' };
  game.map = { getHexByKey: () => null };

  const result = game.executeSelectedCommand({ mobilize: false });
  assert.equal(result.success, false);
  assert.equal(result.message, '대상 지역이 없습니다.');
});

test('executeSelectedCommand returns not-implemented for non-attack intent without calling executeAction', () => {
  const ctx = loadGameScripts();
  const game = Object.create(ctx.Game.prototype);
  const targetHex = new ctx.HexCell(2, 3);

  game.selectedCommand = { intent: 'scout', targetKey: '2,3' };
  game.map = { getHexByKey: (k) => (k === '2,3' ? targetHex : null) };
  game.executeAction = () => { throw new Error('executeAction must not be called for non-attack intent'); };

  const result = game.executeSelectedCommand({});
  assert.equal(result.success, false);
  assert.equal(result.message, '이 명령은 아직 실행할 수 없습니다.');
});

// ──────────────────── refreshSelectedCommandPreview ────────────────────

test('refreshSelectedCommandPreview toggles mobilize flag and rebuilds preview with higher attackForce', () => {
  const ctx = loadGameScripts();
  const game = Object.create(ctx.Game.prototype);

  const attacker = new ctx.Faction({ id: 0, name: 'A', color: '#000', colorLight: '#111', emoji: 'A' }, false);
  const defender = new ctx.Faction({ id: 1, name: 'D', color: '#111', colorLight: '#222', emoji: 'D' }, true);
  attacker.gold = 1000;
  attacker.military = 60;
  attacker.population = 200;

  const ownHex = new ctx.HexCell(2, 2);
  ownHex.owner = 0;
  attacker.territories.add(ownHex.key());

  const targetHex = new ctx.HexCell(2, 3);
  targetHex.owner = 1;
  targetHex.provinceName = '관중 관문';
  targetHex.localGarrison = 8;
  targetHex.defenseValue = 12;
  defender.territories.add(targetHex.key());

  game.factions = [attacker, defender];
  game.currentTurnIndex = 0;
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
    getHexByKey: (key) => {
      if (key === targetHex.key()) return targetHex;
      if (key === ownHex.key()) return ownHex;
      return null;
    }
  };
  game.diplomacy = { isAlly: () => false, isAtWar: () => true };
  game.selectedCommand = { intent: 'attack', targetKey: targetHex.key(), mobilize: false, preview: null };

  game.refreshSelectedCommandPreview({ mobilize: false });
  const forcePlain = game.selectedCommand.preview.attackForce;

  game.refreshSelectedCommandPreview({ mobilize: true });
  assert.equal(game.selectedCommand.mobilize, true);
  assert.ok(game.selectedCommand.preview.attackForce > forcePlain);
});

test('refreshSelectedCommandPreview returns null when no selectedCommand', () => {
  const ctx = loadGameScripts();
  const game = Object.create(ctx.Game.prototype);
  game.selectedCommand = null;

  const result = game.refreshSelectedCommandPreview({ mobilize: true });
  assert.equal(result, null);
});

test('refreshSelectedCommandPreview returns selectedCommand unchanged for non-attack intent', () => {
  const ctx = loadGameScripts();
  const game = Object.create(ctx.Game.prototype);
  const targetHex = new ctx.HexCell(2, 3);
  const originalCommand = { intent: 'scout', targetKey: '2,3', mobilize: false };

  game.selectedCommand = originalCommand;
  game.map = { getHexByKey: (k) => (k === '2,3' ? targetHex : null) };

  const result = game.refreshSelectedCommandPreview({ mobilize: true });
  assert.equal(result, originalCommand);
  assert.equal(game.selectedCommand.mobilize, false);
});
