// tests/fatigue.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const F = require('../js/fatigue.js');

test('march accrual is linear per hex entered and terrain-uniform (no terrain input exists)', () => {
  assert.equal(F.marchAccrual(0), 0);
  assert.ok(F.marchAccrual(1) > 0);
  assert.ok(Math.abs(F.marchAccrual(3) - 3 * F.marchAccrual(1)) < 1e-12); // linear
  assert.equal(F.marchAccrual.length, 1); // hexes only — terrain weighting REJECTED (spec §2)
});

test('battle accrual is proportional to own casualty fraction — fierce wears deep, walkover barely', () => {
  assert.equal(F.battleAccrual(0), 0);
  const walkover = F.battleAccrual(0.02); // winner fraction of an easy fight
  const fierce = F.battleAccrual(0.17);   // winner fraction of an R≈1.3 slugfest
  assert.ok(walkover > 0 && fierce > walkover);
  assert.ok(Math.abs(F.battleAccrual(0.2) - 10 * F.battleAccrual(0.02)) < 1e-12); // proportional
});

test('conversion curve: fresh army fights at 1.0, penalty accelerates, ×0.5 floor is the terminal point', () => {
  assert.equal(F.effectiveness(0), 1.0);
  // monotone non-increasing across the whole domain
  let prev = 1.0;
  for (let l = 0; l <= 30; l += 0.25) {
    const e = F.effectiveness(l);
    assert.ok(e <= prev + 1e-12, `not monotone at ledger ${l}`);
    assert.ok(e >= 0.5 - 1e-12, `below floor at ledger ${l}`);
    prev = e;
  }
  // convex: doubling light fatigue more than doubles the penalty (accelerating cost)
  const p = (l) => 1 - F.effectiveness(l);
  assert.ok(p(4) > 2 * p(2));
  // floor saturation: deep fatigue is exactly ×0.5, flat forever after
  assert.equal(F.effectiveness(1000), 0.5);
  assert.equal(F.effectiveness(1e9), 0.5);
});

test('supply ledger: the pump rises per cut turn; a supplied turn ends the tick and resets the pump', () => {
  let l = 0;
  l = F.supplyTick(l, 0); // cut turn
  l = F.supplyTick(l, 0);
  assert.ok(l > 0);
  const twoCutTurns = l;
  l = F.supplyTick(l, 0);
  assert.ok(Math.abs(l - 1.5 * twoCutTurns) < 1e-12); // linear pump: per cut turn
  assert.equal(F.supplyTick(l, 1), 0);                // route restored — tick ends, pump resets
});

test('starvation: gated by the entry threshold, continuous at entry, convex in depth, never exceeds the body', () => {
  const t = F.STARVATION_ENTRY_THRESHOLD;
  assert.equal(F.starvationLossFraction(0), 0);
  assert.equal(F.starvationLossFraction(t), 0);            // at the threshold: state entered, loss starts from zero
  assert.ok(F.starvationLossFraction(t + 0.01) > 0);       // continuous entry — no jump
  assert.ok(F.starvationLossFraction(t + 0.01) < 0.005);
  const one = F.starvationLossFraction(t + 1);
  const two = F.starvationLossFraction(t + 2);
  assert.ok(two > 2 * one);                                // convex: deeper starvation accelerates
  assert.equal(F.starvationLossFraction(t + 1e6), 1);      // clamped — cannot lose more than everything
  assert.equal(F.isStarving(t), false);
  assert.equal(F.isStarving(t + 0.01), true);
});

test('recovery is a child of supply: zero when cut, base rate multiplied by supply level', () => {
  assert.equal(F.recoveryPerTurn(0), 0); // no supply = no recovery, ever
  assert.ok(F.recoveryPerTurn(1) > 0);
  assert.ok(Math.abs(F.recoveryPerTurn(0.5) - 0.5 * F.recoveryPerTurn(1)) < 1e-12); // 가안 linear multiplier
});

test('turnUpkeep: a cut turn pumps and bleeds with recovery locked; a supplied turn recovers and ends the tick', () => {
  let s = { march: 6, supply: 0 };
  s = F.turnUpkeep(s, 0);
  assert.equal(s.march, 6);                 // recovery locked at zero while cut
  assert.ok(s.supply > 0);
  assert.equal(s.substanceLossFraction, 0); // still inside the entry grace
  s = F.turnUpkeep(s, 0);
  s = F.turnUpkeep(s, 0);
  assert.ok(s.substanceLossFraction > 0);   // third cut turn: past the threshold, the army bleeds
  assert.equal(s.starving, true);
  const restored = F.turnUpkeep(s, 1);
  assert.equal(restored.supply, 0);                 // route restored — tick ends
  assert.equal(restored.substanceLossFraction, 0);  // starvation stops the same turn
  assert.equal(restored.starving, false);
  assert.ok(restored.march < 6);                    // steady supply recovers the gauge
  const nearFresh = F.turnUpkeep({ march: 0.5, supply: 0 }, 1);
  assert.equal(nearFresh.march, 0);                 // recovery clamps at fresh, never negative
});

test('forced-march dials exist for the movement contract: premium is a real surcharge, cap bounds the sprint', () => {
  assert.ok(F.FORCED_MARCH_PREMIUM > 1);      // extra hexes must cost more than normal ones
  assert.ok(F.FORCED_MARCH_EXTRA_HEX_CAP >= 1 && Number.isInteger(F.FORCED_MARCH_EXTRA_HEX_CAP));
});

test('invariant: march never kills — no sequence of marching and fighting produces substance loss', () => {
  let seed = 42; // deterministic LCG — reproducible campaigns
  const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32;
  for (let run = 0; run < 50; run++) {
    let s = { march: 0, supply: 0 };
    for (let t = 0; t < 40; t++) {
      s.march += F.marchAccrual(Math.floor(rnd() * 5));         // march hard
      if (rnd() < 0.5) s.march += F.battleAccrual(rnd() * 0.4); // fight often, sometimes bloodily
      s = F.turnUpkeep(s, 1);                                   // supply never cut
      assert.ok(F.effectiveness(s.march) >= 0.5, `effectiveness fell through the floor (run ${run}, turn ${t})`);
      assert.equal(s.substanceLossFraction, 0, `march/battle killed (run ${run}, turn ${t})`);
    }
  }
  // the two-ledger firewall: an absurd march ledger still cannot enter the starvation state
  const worn = F.turnUpkeep({ march: 1e9, supply: 0 }, 1);
  assert.equal(worn.starving, false);
  assert.equal(worn.substanceLossFraction, 0);
});

test('conversion curve is continuous at the floor junction — no banded jumps (stepped mapping REJECTED)', () => {
  // scan for any jump larger than the local step could justify
  const step = 0.01;
  for (let l = 0; l < 25; l += step) {
    const jump = Math.abs(F.effectiveness(l) - F.effectiveness(l + step));
    assert.ok(jump < 0.02, `discontinuity near ledger ${l}: jump ${jump}`);
  }
});
