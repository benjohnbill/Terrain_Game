import test from 'node:test';
import assert from 'node:assert/strict';

const { CRADLE_R1, Runtime } = await import('../dist/runtime/index.js');

function openAtDecision(seed = 'field-army-0001', world = CRADLE_R1) {
  const runtime = Runtime.open({ world, seed, actors: ['realm-a', 'realm-b'] });
  const setup = runtime.view('observer');
  runtime.submit({ kind: 'choose-capital', actor: 'realm-a', sector: 'r2_s0' });
  runtime.submit({ kind: 'choose-capital', actor: 'realm-b', sector: 'r10_s0' });
  return runtime;
}

test('the opening field army is one positioned detachment at the capital-sector centre-nearest hex', () => {
  const runtime = openAtDecision();
  const mine = runtime.view('realm-a');
  assert.equal(mine.detachments.length, 1);
  assert.deepEqual(mine.detachments[0].position, { q: 9, r: 5 });
  assert.equal(mine.detachments[0].men, mine.economy.field);
  assert.equal(mine.detachments[0].pendingMen, 0);
});

test('opening province registers equal serving plus available civilians', () => {
  const economy = openAtDecision().view('realm-a').economy;
  for (const row of Object.values(economy.provinces)) {
    assert.equal(row.register, row.serving + row.availableCivilians);
  }
  assert.equal(
    Object.values(economy.provinces).reduce((sum, row) => sum + row.register, 0),
    economy.register,
  );
});
