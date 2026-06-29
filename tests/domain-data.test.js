const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts } = require('./helpers/load-browser-scripts');

test('domain catalogs expose accepted terrain, function, posture, focus, and command keys', () => {
  const context = loadScripts(['js/domain-data.js']);

  assert.deepEqual(Object.keys(context.TERRAIN_TYPES), [
    'plains',
    'grain_basin',
    'mountain_pass',
    'river',
    'coast_strait',
    'steppe_highland',
    'frontier_basin'
  ]);

  assert.deepEqual(Object.keys(context.FUNCTION_TYPES), [
    'administrative',
    'commercial',
    'agricultural',
    'military_base',
    'fortress_pass',
    'port',
    'mining_workshop',
    'scholarly_religious',
    'frontier_settlement'
  ]);

  assert.deepEqual(Object.keys(context.ACTION_CAPACITIES), [
    'command',
    'administration',
    'diplomacy',
    'scholarship'
  ]);

  assert.equal(context.STRATEGIC_POSTURES.military_push.capacityWeights.command, 0.5);
  assert.equal(context.FOCUS_OPTIONS.command.scouting.label, '정찰');
  assert.equal(context.COMMAND_INTENTS.scout.defaultIntensity, 'standard');
});

test('initial province data has 30 named provinces with valid domain keys', () => {
  const context = loadScripts(['js/domain-data.js', 'js/province-data.js']);

  assert.equal(context.PROVINCES.length, 30);
  const names = new Set(context.PROVINCES.map((province) => province.name));
  assert.equal(names.size, 30);

  for (const province of context.PROVINCES) {
    assert.ok(context.ARCHETYPE_REGIONS[province.archetype], province.id);
    assert.ok(context.TERRAIN_TYPES[province.primaryTerrain], province.id);
    assert.ok(context.FUNCTION_TYPES[province.primaryFunction], province.id);
    assert.equal(typeof province.populationWeight, 'number');
    assert.equal(typeof province.economyWeight, 'number');
    assert.equal(typeof province.garrisonWeight, 'number');
    assert.equal(typeof province.defenseWeight, 'number');
  }

  assert.equal(context.getProvinceById('luoyuan_plain').name, '낙원 평원');
  assert.equal(context.getProvinceById('hanjing_waterway').primaryTerrain, 'river');
});
