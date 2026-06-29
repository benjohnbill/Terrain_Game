const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts } = require('./helpers/load-browser-scripts');

test('a depleted garrison regrows 25% of the gap toward its local ceiling', () => {
  const ctx = loadScripts(['js/domain-data.js', 'js/map.js']);
  const hex = new ctx.HexCell(0, 0);
  hex.economyValue = 16;
  hex.population = 24;          // ceiling = max(2, round((16+24)/4)) = 10
  hex.localGarrison = 0;

  hex.regenerateGarrison();
  // gap 10, +max(1, round(10*0.25)) = +3 -> 3
  assert.equal(hex.localGarrison, 3);
});

test('garrison regeneration never exceeds the local ceiling', () => {
  const ctx = loadScripts(['js/domain-data.js', 'js/map.js']);
  const hex = new ctx.HexCell(0, 0);
  hex.economyValue = 16;
  hex.population = 24;          // ceiling 10
  hex.localGarrison = 9;

  hex.regenerateGarrison();    // gap 1 -> +max(1, round(0.25)) = +1 -> 10
  assert.equal(hex.localGarrison, 10);

  hex.regenerateGarrison();    // already at ceiling -> unchanged
  assert.equal(hex.localGarrison, 10);
});
