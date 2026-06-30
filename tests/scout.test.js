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
