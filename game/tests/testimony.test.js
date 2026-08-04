/**
 * The witness model's arithmetic — fog `RULINGS.md` ③ and ④, values at FG-M①.
 *
 * These are the properties build ticket 08's acceptance list turns on, checked
 * where they are cheapest to check: containment, non-collapse, the reporting
 * spread's asymptotes, and non-invertibility. The whole-match versions live in
 * `fog-projection.test.js`, which audits the same properties through a real
 * Runtime; these fix the arithmetic they rest on.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

const {
  composeBand,
  createRng,
  INTERSECTION_FLOOR,
  intersect,
  intervalOf,
  OBSERVATION_HALF_WIDTH,
  RECONNAISSANCE_UNIT_PRICE,
  relativeHalfWidth,
  REPORTING_SPREAD,
  reportedFigureOf,
  testimonyOf,
  UNCHANGING,
} = await import('../dist/runtime/index.js');

const GRADES = Object.keys(OBSERVATION_HALF_WIDTH);
const WIDE_OPEN = { low: 0, high: 1e9 };

test('FG-M①\'s precision table and unit prices reach the code unchanged', () => {
  assert.deepEqual(OBSERVATION_HALF_WIDTH, {
    'enhanced-reconnaissance': 0.1,
    'repelled-assault': 0.2,
    'normal-reconnaissance': 0.25,
    'battle-contact': 0.3,
  });
  assert.equal(INTERSECTION_FLOOR, 0.05);
  assert.deepEqual(RECONNAISSANCE_UNIT_PRICE, {
    'normal-reconnaissance': 2,
    'enhanced-reconnaissance': 6,
  });
});

test('the reporting spread is the intersection floor, not a second dial (④ decision 7)', () => {
  assert.equal(REPORTING_SPREAD, INTERSECTION_FLOOR);
});

test('the spread is uniform across grades, so every asymptote sits the same distance inside its width', () => {
  // ④ decision 7 was written once as grade-proportional and corrected the same
  // day. The two readings coincide exactly at the enhanced grade — the one the
  // groundwork measured — and part at the normal grade, which is why this checks
  // the cheap grade rather than the expensive one.
  const normal = OBSERVATION_HALF_WIDTH['normal-reconnaissance'] - REPORTING_SPREAD;
  assert.ok(Math.abs(normal - 0.2) < 1e-12, `normal grade asymptote ${normal}`);
});

test('every grade contains the truth from every draw — containment is structural, not clamped', () => {
  const truth = 4_000;
  for (const grade of GRADES) {
    for (let step = 0; step <= 200; step += 1) {
      const draw = step / 200.000001; // spans [0, 1) including both extremes
      const band = intervalOf(testimonyOf(grade, 1, truth, draw));
      assert.ok(
        band.low <= truth && truth <= band.high,
        `${grade} at draw ${draw} reported a band [${band.low}, ${band.high}] excluding ${truth}`,
      );
    }
  }
});

test('the reported figure is never the truth except at the exact centre of the draw', () => {
  const truth = 4_000;
  assert.equal(reportedFigureOf(truth, 0.5), truth);
  assert.ok(reportedFigureOf(truth, 0) < truth);
  assert.ok(reportedFigureOf(truth, 0.999999) > truth);
});

test('a band is not invertible: one look never returns the true figure (invariant 8)', () => {
  // The width is a fraction of the **reported** figure, so a viewer holding the
  // band and the grade recovers only the reported figure — which is not the
  // truth. This is the concrete form of what defeated the archive band.
  const truth = 4_000;
  const testimony = testimonyOf('enhanced-reconnaissance', 1, truth, 0.13);
  const band = intervalOf(testimony);
  const width = OBSERVATION_HALF_WIDTH['enhanced-reconnaissance'];
  const recovered = (band.low + band.high) / 2;
  assert.ok(Math.abs(recovered - testimony.reported) < 1e-9, 'the reported figure is recoverable');
  assert.ok(Math.abs(recovered - truth) > 1, 'and it is not the truth');
  // And the width alone tells the viewer nothing further: it is `w × reported`,
  // which they already have.
  assert.ok(Math.abs((band.high - band.low) / 2 - width * testimony.reported) < 1e-9);
});

/** Repeated observation at one grade, on a subject nothing is changing. */
function saturate(grade, scouts, seedLabel) {
  const rng = createRng(seedLabel);
  const truth = 4_000;
  const testimonies = [];
  for (let turn = 1; turn <= scouts; turn += 1) {
    testimonies.push(testimonyOf(grade, turn, truth, rng.next()));
  }
  const band = composeBand({
    testimonies,
    now: scouts,
    envelope: UNCHANGING,
    publicBound: WIDE_OPEN,
  });
  return { band, truth };
}

test('the enhanced grade asymptotes at the ±5% floor and the normal grade saturates at ±20%', () => {
  // ④ decision 7's sealed outcome: the two paid grades sell different
  // destinations, not different speeds. Measured over many scouts, which is what
  // the acceptance item says.
  const enhanced = saturate('enhanced-reconnaissance', 400, 'saturate-enhanced');
  const normal = saturate('normal-reconnaissance', 400, 'saturate-normal');

  const enhancedWidth = relativeHalfWidth(enhanced.band);
  const normalWidth = relativeHalfWidth(normal.band);

  assert.ok(
    Math.abs(enhancedWidth - 0.0503) < 0.004,
    `enhanced saturated at ${(enhancedWidth * 100).toFixed(2)}%, expected ≈5.03%`,
  );
  assert.ok(
    Math.abs(normalWidth - 0.2025) < 0.01,
    `normal saturated at ${(normalWidth * 100).toFixed(2)}%, expected ≈20.25%`,
  );
});

test('no accumulation of testimony narrows a substance band past the floor (invariant 6)', () => {
  // Every grade, mixed together, many hundreds of looks: the finest grade's own
  // limit is the floor for all of them, because it has the smallest width.
  const rng = createRng('floor-probe');
  const truth = 4_000;
  const testimonies = [];
  for (let turn = 1; turn <= 600; turn += 1) {
    const grade = GRADES[turn % GRADES.length];
    testimonies.push(testimonyOf(grade, turn, truth, rng.next()));
  }
  const band = composeBand({
    testimonies,
    now: 600,
    envelope: UNCHANGING,
    publicBound: WIDE_OPEN,
  });
  assert.ok(band.low <= truth && truth <= band.high, 'the floor band still contains the truth');
  assert.ok(
    relativeHalfWidth(band) >= INTERSECTION_FLOOR - 1e-6,
    `collapsed to ${(relativeHalfWidth(band) * 100).toFixed(3)}%, inside the ${INTERSECTION_FLOOR * 100}% floor`,
  );
});

test('successive scouts wobble the centre while the width shrinks (invariant 7)', () => {
  const rng = createRng('wobble-probe');
  const truth = 4_000;
  const testimonies = [];
  const centres = [];
  const widths = [];
  for (let turn = 1; turn <= 24; turn += 1) {
    testimonies.push(testimonyOf('normal-reconnaissance', turn, truth, rng.next()));
    const band = composeBand({
      testimonies,
      now: turn,
      envelope: UNCHANGING,
      publicBound: WIDE_OPEN,
    });
    centres.push((band.low + band.high) / 2);
    widths.push(band.high - band.low);
  }

  for (let i = 1; i < widths.length; i += 1) {
    assert.ok(widths[i] <= widths[i - 1] + 1e-9, 'the width never grows on a static subject');
  }
  const moved = centres.some((centre, i) => i > 0 && Math.abs(centre - centres[i - 1]) > 1e-9);
  assert.ok(moved, 'the centre wobbles rather than zooming onto a fixed point');
  // And it never settles onto the truth: the last centre is still off it.
  assert.ok(Math.abs(centres.at(-1) - truth) > 1e-6, 'the centre is not the truth');
});

test('with no testimony the band is exactly the public bound, never the truth (invariant 5)', () => {
  const publicBound = { low: 0, high: 12_000 };
  const band = composeBand({ testimonies: [], now: 7, envelope: UNCHANGING, publicBound });
  assert.deepEqual(band, publicBound);
});

test('a stale testimony widens toward the public bound rather than becoming false', () => {
  const truth = 4_000;
  const publicBound = { low: 0, high: 20_000 };
  const testimony = testimonyOf('enhanced-reconnaissance', 5, truth, 0.5);
  const envelope = { gainPerTurn: 600, lossPerTurn: 0 };

  const fresh = composeBand({ testimonies: [testimony], now: 5, envelope, publicBound });
  const stale = composeBand({ testimonies: [testimony], now: 12, envelope, publicBound });

  assert.ok(stale.high > fresh.high, 'the upper edge relaxes as the reading ages');
  assert.equal(stale.low, fresh.low, 'and the lower edge holds while no channel takes men away');
  assert.ok(stale.low <= truth && truth <= stale.high, 'ageing never makes a testimony false');
});

test('a battle releases the lower edge of every testimony taken before it', () => {
  const truth = 4_000;
  const publicBound = { low: 0, high: 20_000 };
  const before = testimonyOf('normal-reconnaissance', 3, truth, 0.5);
  const envelope = { gainPerTurn: 0, lossPerTurn: 0 };

  const intact = composeBand({ testimonies: [before], now: 6, envelope, publicBound });
  const bled = composeBand({
    testimonies: [before],
    now: 6,
    envelope,
    publicBound,
    lastLossTurn: 4,
  });

  assert.ok(intact.low > 0, 'without a battle the floor knowledge persists');
  assert.equal(bled.low, publicBound.low, 'a battle it was party to may have taken all of them');
  assert.equal(bled.high, intact.high, 'while what it could hold at most is unchanged');
});

test('an empty intersection is raised rather than rendered (G3 oracle)', () => {
  // Two statements that cannot both describe one subject, with an envelope that
  // permits no change: the bounds are wrong, and saying so is the whole point.
  const testimonies = [
    { grade: 'enhanced-reconnaissance', turn: 1, reported: 1_000 },
    { grade: 'enhanced-reconnaissance', turn: 2, reported: 9_000 },
  ];
  assert.throws(
    () => composeBand({ testimonies, now: 2, envelope: UNCHANGING, publicBound: WIDE_OPEN }),
    /do not meet/,
  );
});

test('intersect reports no overlap rather than inventing one', () => {
  assert.equal(intersect({ low: 0, high: 1 }, { low: 2, high: 3 }), null);
  assert.deepEqual(intersect({ low: 0, high: 2 }, { low: 1, high: 3 }), { low: 1, high: 2 });
});
