/**
 * Map geometry.
 *
 * The one that matters most is the first: the renderer's hex projection must be
 * the same formula the generator used to author the hexes. If those two ever
 * drift, the map does not fail — it renders as a torn sheet, which is the kind
 * of bug that gets chased in the UI for hours. So it is pinned here, against
 * values recomputed independently rather than copied from the renderer.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

const { CRADLE_R1, Runtime, hexCenter, hexCorners, hexPolygon, sectorCenter, boardBounds, ownerOf, TERRAIN_TINT } =
  await import('../dist/runtime/index.js');

const runtime = Runtime.open({ world: CRADLE_R1, seed: 'geometry-0001', actors: ['realm-a', 'realm-b'] });
const view = runtime.view('observer');
const hexR = CRADLE_R1.meta.hexR;

test('the hex projection matches the generator that authored the hexes', () => {
  // Independently restated: x = R·√3·(q + r/2), y = R·1.5·r  (pointy-top axial).
  for (const [q, r] of [
    [0, 0],
    [1, 0],
    [0, 1],
    [-3, 5],
    [7, 13],
  ]) {
    const expected = { x: hexR * Math.sqrt(3) * (q + r / 2), y: hexR * 1.5 * r };
    assert.deepEqual(hexCenter({ q, r }, hexR), expected);
  }
});

test('hex corners are equidistant, six in number, and tile without gaps', () => {
  const center = hexCenter({ q: 2, r: 3 }, hexR);
  const corners = hexCorners(center, hexR);
  assert.equal(corners.length, 6);

  for (const corner of corners) {
    const distance = Math.hypot(corner.x - center.x, corner.y - center.y);
    assert.ok(Math.abs(distance - hexR) < 1e-9, `corner sits at ${distance}, expected ${hexR}`);
  }

  // Neighbouring centres sit exactly one hex-width apart, which is what makes
  // the drawn hexes tile rather than overlap or leave seams.
  const width = hexR * Math.sqrt(3);
  const neighbour = hexCenter({ q: 3, r: 3 }, hexR);
  assert.ok(Math.abs(Math.hypot(neighbour.x - center.x, neighbour.y - center.y) - width) < 1e-9);
});

test('a polygon renders six finite coordinate pairs', () => {
  const points = hexPolygon({ q: 1, r: 2 }, hexR).split(' ');
  assert.equal(points.length, 6);
  for (const point of points) {
    const [x, y] = point.split(',').map(Number);
    assert.ok(Number.isFinite(x) && Number.isFinite(y), `bad point "${point}"`);
  }
});

test('every sector has a centre inside the board bounds', () => {
  const bounds = boardBounds(view);
  assert.ok(bounds.maxX > bounds.minX && bounds.maxY > bounds.minY);

  for (const sectorId of Object.keys(view.board.sectors)) {
    const c = sectorCenter(view, sectorId);
    assert.ok(Number.isFinite(c.x) && Number.isFinite(c.y), `${sectorId} has no finite centre`);
    assert.ok(
      c.x >= bounds.minX && c.x <= bounds.maxX && c.y >= bounds.minY && c.y <= bounds.maxY,
      `${sectorId} centre falls outside the drawn board`,
    );
  }
});

test('every sector is owned by exactly one realm at setup', () => {
  const owners = Object.keys(view.board.sectors).map((id) => ownerOf(view, id));
  assert.equal(owners.filter((o) => o === null).length, 0, 'a sector belongs to no realm');
  assert.deepEqual([...new Set(owners)].sort(), ['realm-a', 'realm-b']);
});

test('every terrain layer the world uses has a tint', () => {
  const used = new Set();
  for (const sector of Object.values(CRADLE_R1.sectors)) {
    for (const unit of sector.mapUnits) used.add(unit.terrainLayer);
  }
  for (const layer of used) {
    assert.ok(TERRAIN_TINT[layer], `terrain "${layer}" would render untinted`);
  }
});

test('geometry reads only the projection — it never sees a Runtime', () => {
  // A plain object shaped like a view is enough. If geometry had reached for
  // truth, this would throw rather than draw.
  const detached = JSON.parse(JSON.stringify({ board: view.board, realms: view.realms }));
  assert.doesNotThrow(() => sectorCenter(detached, 'r1_s0'));
  assert.doesNotThrow(() => boardBounds(detached));
  assert.equal(typeof ownerOf(detached, 'r1_s0'), 'string');
});
