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
