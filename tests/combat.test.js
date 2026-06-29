const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts } = require('./helpers/load-browser-scripts');

test('resolve is deterministic under an injected rng and picks the larger rolled force', () => {
  const { CombatSystem } = loadScripts(['js/domain-data.js', 'js/combat.js']);
  const rng = () => 0.5; // factor 1.0 for both rolls

  const win = CombatSystem.resolve(100, 60, rng);
  assert.equal(win.attackRoll, 100);
  assert.equal(win.defenseRoll, 60);
  assert.equal(win.attackerWins, true);

  const loss = CombatSystem.resolve(60, 100, rng);
  assert.equal(loss.attackerWins, false);
});

test('roll factor honors the 0.7 to 1.3 band at rng extremes', () => {
  const { CombatSystem } = loadScripts(['js/domain-data.js', 'js/combat.js']);
  assert.equal(CombatSystem._roll(() => 0), 0.7);
  assert.ok(Math.abs(CombatSystem._roll(() => 1) - 1.3) < 1e-9);
});

test('forecast returns a band and a low/expected/high range without randomness', () => {
  const { CombatSystem } = loadScripts(['js/domain-data.js', 'js/combat.js']);
  const f = CombatSystem.forecast(120, 100);
  assert.ok(Math.abs(f.expected - 1.2) < 1e-9);
  assert.ok(f.low < f.expected && f.expected < f.high);
  assert.equal(f.band, '우세');
  assert.equal(CombatSystem.forecast(50, 100).band, '열세');
  assert.equal(CombatSystem.forecast(100, 100).band, '호각');
  assert.equal(CombatSystem.forecast(300, 100).band, '압도');
});

test('crossing penalty applies only to water terrain and is eased by a port', () => {
  const { CombatSystem } = loadScripts(['js/domain-data.js', 'js/combat.js']);
  assert.equal(CombatSystem.crossingPenalty('plains', false), 1);
  assert.equal(CombatSystem.crossingPenalty('river', false), 0.85);
  assert.equal(CombatSystem.crossingPenalty('coast_strait', false), 0.70);
  // port mitigation moves the penalty halfway to 1.0
  assert.ok(Math.abs(CombatSystem.crossingPenalty('coast_strait', true) - 0.85) < 1e-9);
});

test('attack force scales standing forces by attack bonus, crossing, and adds mobilization at 0.6', () => {
  const { CombatSystem } = loadScripts(['js/domain-data.js', 'js/combat.js']);
  const attacker = { calculateMilitary: () => 100, getAttackBonus: () => 0.2 };

  // plains, no mobilization: round(100 * 1.2 * 1) = 120
  assert.equal(CombatSystem.computeAttackForce(attacker, { terrain: 'plains' }, {}), 120);

  // coast_strait, no port: round(100 * 1.2 * 0.70) = 84
  assert.equal(CombatSystem.computeAttackForce(attacker, { terrain: 'coast_strait' }, {}), 84);

  // plains + 50 mobilized: round(120 + 50 * 0.6) = 150
  assert.equal(
    CombatSystem.computeAttackForce(attacker, { terrain: 'plains' }, { mobilizedTroops: 50 }),
    150
  );
});

test('defense force is local: garrison x terrain + fortification, no national pool by default', () => {
  const { CombatSystem } = loadScripts(['js/domain-data.js', 'js/combat.js']);
  // mountain_pass defense multiplier is 1.45
  const hex = { terrain: 'mountain_pass', localGarrison: 10, defenseValue: 16, key: () => '1,1' };
  // round(10 * 1.45) + 16 = round(14.5) + 16 = 15 + 16 = 31 ; neutral (no owner)
  assert.equal(CombatSystem.computeDefenseForce(hex, null), 31);
});

test('an owner does not raise defense unless actively defending that hex', () => {
  const { CombatSystem } = loadScripts(['js/domain-data.js', 'js/combat.js']);
  const hex = { terrain: 'plains', localGarrison: 8, defenseValue: 10, key: () => '2,2' };
  const owner = {
    buildings: new Map(),
    isDefending: false,
    defendingHex: null,
    calculateMilitary: () => 200
  };
  // plains 0.9: round(8 * 0.9) + 10 = 7 + 10 = 17 ; huge army gives NO passive bonus
  assert.equal(CombatSystem.computeDefenseForce(hex, owner), 17);
});

test('actively defending a hex adds capped standing support and a 1.5x posture multiplier', () => {
  const { CombatSystem } = loadScripts(['js/domain-data.js', 'js/combat.js']);
  const hex = { terrain: 'plains', localGarrison: 8, defenseValue: 10, key: () => '2,2' };
  const owner = {
    buildings: new Map(),
    isDefending: true,
    defendingHex: '2,2',
    calculateMilitary: () => 200
  };
  // base 17 -> round(17 * 1.5) = 26 ; standing support round(min(200*0.3,50)) = 50 ; total 76
  assert.equal(CombatSystem.computeDefenseForce(hex, owner), 76);
});

test('building defense bonus (e.g. wall) is included for the owner', () => {
  const { CombatSystem } = loadScripts(['js/domain-data.js', 'js/buildings.js', 'js/combat.js']);
  const hex = { terrain: 'plains', localGarrison: 8, defenseValue: 10, key: () => '3,3' };
  const owner = {
    buildings: new Map([['3,3', 'wall']]),
    isDefending: false,
    defendingHex: null,
    calculateMilitary: () => 50
  };
  // 17 + wall defenseBonus 30 = 47
  assert.equal(CombatSystem.computeDefenseForce(hex, owner), 47);
});
