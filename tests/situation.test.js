const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts } = require('./helpers/load-browser-scripts');

test('situation analysis produces map-first highlights with command defaults', () => {
  const context = loadScripts([
    'js/domain-data.js',
    'js/province-data.js',
    'js/intel.js',
    'js/situation.js'
  ]);

  const hexes = [
    {
      key: () => '0,0',
      owner: 0,
      provinceName: '관중 관문',
      terrain: 'mountain_pass',
      provinceId: 'guanzhong_gate',
      localGarrison: 5,
      defenseValue: 16,
      economyValue: 8,
      informationConfidence: 0.9,
      strategicTags: ['pass']
    },
    {
      key: () => '1,0',
      owner: 1,
      provinceName: '형강 수로',
      terrain: 'river',
      provinceId: 'hanjing_waterway',
      localGarrison: 9,
      defenseValue: 10,
      economyValue: 12,
      informationConfidence: 0.35,
      strategicTags: ['river_crossing', 'south_gate']
    }
  ];

  const result = context.SituationAnalyzer.analyze({
    currentFactionId: 0,
    hexes,
    postureId: 'intelligence_gathering'
  });

  assert.equal(result.highlights.length, 2);
  assert.equal(result.highlights[0].type, 'defense');
  assert.equal(result.highlights[1].type, 'uncertainty');
  assert.equal(result.highlights[1].recommendedIntent, 'scout');
  assert.equal(result.briefing.length, 2);
});
