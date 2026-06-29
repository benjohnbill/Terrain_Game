const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts } = require('./helpers/load-browser-scripts');

test('capacity calculation converts owned provinces into four action capacities', () => {
  const context = loadScripts(['js/domain-data.js', 'js/province-data.js', 'js/capacity.js']);
  const ownedProvinceIds = ['luoyuan_plain', 'guanzhong_gate', 'jiangnan_granary'];

  const result = context.CapacitySystem.calculateBaseCapacities(ownedProvinceIds);

  assert.deepEqual(Object.keys(result), ['command', 'administration', 'diplomacy', 'scholarship']);
  assert.ok(result.command > 0);
  assert.ok(result.administration > result.diplomacy);
  assert.ok(result.scholarship > 0);
});

test('strategic posture allocates capacities and applies focus defaults', () => {
  const context = loadScripts(['js/domain-data.js', 'js/province-data.js', 'js/capacity.js']);
  const base = { command: 10, administration: 10, diplomacy: 10, scholarship: 10 };

  const allocation = context.CapacitySystem.applyPosture(base, 'military_push');

  assert.equal(allocation.postureId, 'military_push');
  assert.equal(allocation.focus.command, 'operation');
  assert.equal(allocation.available.command, 20);
  assert.equal(allocation.available.administration, 8);
  assert.equal(allocation.available.diplomacy, 6);
  assert.equal(allocation.available.scholarship, 6);
});

test('carryover preserves capacity with different rates and caps', () => {
  const context = loadScripts(['js/domain-data.js', 'js/province-data.js', 'js/capacity.js']);
  const unused = { command: 6, administration: 6, diplomacy: 6, scholarship: 6 };

  const carryover = context.CapacitySystem.calculateCarryover(unused);

  assert.equal(carryover.command, 2);
  assert.equal(carryover.administration, 3);
  assert.equal(carryover.diplomacy, 3);
  assert.equal(carryover.scholarship, 5);
});

test('overclock converts one capacity into another with efficiency loss', () => {
  const context = loadScripts(['js/domain-data.js', 'js/province-data.js', 'js/capacity.js']);
  const state = { command: 2, administration: 4, diplomacy: 3, scholarship: 6 };

  const result = context.CapacitySystem.overclock(state, 'scholarship', 'command', 4, 'institutional');

  assert.equal(result.capacities.scholarship, 2);
  assert.equal(result.capacities.command, 4);
  assert.equal(result.warningLevel, 'medium');
});
