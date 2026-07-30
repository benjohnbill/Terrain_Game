/**
 * Ground changes hands, and then starts paying its taker — ticket 06d.
 *
 * Two subjects, in the order the ticket needs them:
 *
 * 1. **The grain.** The conscription register and a serving force's origin
 *    composition are both keyed by the **sector** (MT-② amended 2026-07-31 for the
 *    register; the user's same-day ruling for origin, amending ADR 0045). The
 *    register's derivation `registerPerPop × Σ populationValue` reads a *sector*
 *    field, and `availableCivilians = register − serving` joins the two on one key,
 *    so both live at the same grain or neither does.
 * 2. **The capture.** A won battle transfers control, `homeland` is the record
 *    written, limbo is the interval before integration (ADR 0044 amending OG-③),
 *    and integration runs the ADR 0022/0029 ripening lag unchanged.
 *
 * **Three laws govern the register and this file states them separately**, because
 * one conservation invariant over all three fails on casualties and reads as a
 * transfer bug (the ticket says so; 06e's rout tests are the worked example):
 *
 * | law | bodies | register |
 * |---|---|---|
 * | casualties (06c) | destroyed | shrinks — permanently, blood is permanent currency (SPEC) |
 * | leaving service (WM-⑤) | leave `serving` | untouched |
 * | transfer (this ticket) | move realm | conserves: what the loser sheds the taker gains |
 *
 * Run against the emitted artifact, never the source (gate 05 D6).
 */

import test from 'node:test';
import assert from 'node:assert/strict';

const {
  CRADLE_R1,
  CONQUEST_DAMAGE,
  FRESH_CAPTURE_USABLE_ECONOMY,
  FRESH_CAPTURE_USABLE_POP,
  RIPENING_PER_TURN,
  REGISTER_PER_POP,
  Runtime,
  registerOf,
} = await import('../dist/runtime/index.js');

function openAtDecision(seed = 'capture-0001', world = CRADLE_R1) {
  const runtime = Runtime.open({ world, seed, actors: ['realm-a', 'realm-b'] });
  runtime.submit({ kind: 'choose-capital', actor: 'realm-a', sector: 'r2_s0' });
  runtime.submit({ kind: 'choose-capital', actor: 'realm-b', sector: 'r10_s0' });
  return runtime;
}

const ownerOf = (runtime, sectorId) => runtime.view('observer').realms
  .find((realm) => realm.sectors.includes(sectorId))?.actor ?? null;

/** Every sector of the world, grouped by the province that contains it. */
function sectorsByProvince() {
  const byProvince = {};
  for (const [sectorId, sector] of Object.entries(CRADLE_R1.sectors)) {
    (byProvince[sector.regionId] ??= []).push(sectorId);
  }
  return byProvince;
}

test('the register is stored per sector, and a province is not one number', () => {
  const economy = openAtDecision().view('realm-a').economy;
  const held = new Set(openAtDecision().view('realm-a').realms
    .find((realm) => realm.actor === 'realm-a').sectors);

  // The keys are sector ids, not province ids — the distinguishing assertion.
  assert.deepEqual(Object.keys(economy.sectors).sort(), [...held].sort());

  for (const [sectorId, row] of Object.entries(economy.sectors)) {
    assert.equal(
      row.register,
      registerOf(CRADLE_R1.sectors, [sectorId]),
      `${sectorId}'s register must be its own populationValue, not a province share`,
    );
  }
});

test('two sectors of one province carry different registers — the variation province grain discarded', () => {
  const economy = openAtDecision().view('realm-a').economy;
  const owned = new Set(Object.keys(economy.sectors));

  const varying = Object.entries(sectorsByProvince())
    .map(([region, sectorIds]) => ({
      region,
      registers: sectorIds
        .filter((sectorId) => owned.has(sectorId))
        .map((sectorId) => economy.sectors[sectorId].register),
    }))
    .filter(({ registers }) => new Set(registers).size > 1);

  assert.ok(
    varying.length > 0,
    'the authored world must contain one province whose sectors differ, or this ruling had no subject',
  );
  // And the province total is still the sum, so nothing was invented by going finer.
  for (const { region, registers } of varying) {
    const sectorIds = sectorsByProvince()[region].filter((sectorId) => owned.has(sectorId));
    assert.equal(
      registers.reduce((sum, men) => sum + men, 0),
      registerOf(CRADLE_R1.sectors, sectorIds),
    );
  }
});

// The `register = serving + civilians` identity itself is pinned at its own home,
// `field-army.test.js` (the opening force model), which this ticket moved to sector
// grain rather than duplicating here.

test('an opening garrison originates in the sector it mans, not in its province', () => {
  const runtime = openAtDecision();
  const economy = runtime.view('realm-a').economy;
  for (const garrison of runtime.view('realm-a').garrisons) {
    assert.equal(
      economy.sectors[garrison.sectorId].serving >= garrison.men,
      true,
      `${garrison.sectorId}'s shield must be served by its own register`,
    );
  }
});

test('the ripening dials are the sealed ADR 0022/0029 ones, and conquest damage is at identity', () => {
  assert.equal(FRESH_CAPTURE_USABLE_ECONOMY, 0.5);
  assert.equal(FRESH_CAPTURE_USABLE_POP, 0.6);
  assert.equal(RIPENING_PER_TURN, 0.1);
  // A named seam at identity, not an omission: no rule anywhere defines conquest
  // damage, so it goes in at 1.0 so the deferred snowball session lands a value
  // change rather than a redesign.
  assert.equal(CONQUEST_DAMAGE, 1);
});

test('the register is a body count and does not ripen (ADR 0044 item 3)', () => {
  // Guard the seal directly: the ripening dials are productivity-only, so the
  // register constant must not be composed with either of them.
  assert.equal(REGISTER_PER_POP, 1_800);
  assert.notEqual(REGISTER_PER_POP * FRESH_CAPTURE_USABLE_POP, REGISTER_PER_POP);
});

export { openAtDecision, ownerOf, sectorsByProvince };
