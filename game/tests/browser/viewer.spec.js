/**
 * The viewer lane: what a player actually sees and does.
 *
 * This runs against the **built** viewer (`npm run build:game` → `dist-viewer/`),
 * not the dev server, so what is asserted is the artifact a playtester would be
 * handed.
 *
 * Two acceptance items live here and are hard to check any other way: that the
 * rendered map preserves region, front-sector, route, terrain, and **realm
 * identity**; and that camera, hover, and unsubmitted focus stay interaction
 * state outside the Runtime.
 */

import { test, expect } from '@playwright/test';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { startStaticServer } from '../../acceptance/static-server.js';

const BUILT = fileURLToPath(new URL('../../dist-viewer/index.html', import.meta.url));

let server;

test.beforeAll(async () => {
  // Loud rather than skipped: a lane that quietly passed because its subject
  // was missing is exactly the "masquerading as green" the safety valve exists
  // to prevent.
  expect(existsSync(BUILT), 'run `npm run build:game` before the viewer lane').toBe(true);
  server = await startStaticServer();
});

test.afterAll(async () => {
  await server?.close();
});

test.beforeEach(async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(`${server.origin}/dist-viewer/index.html`);
  await page.waitForFunction(() => document.querySelectorAll('[data-sector]').length > 0);
  expect(errors).toEqual([]);
});

test('the board draws every sector, route, region label, and realm outline', async ({ page }) => {
  const drawn = await page.evaluate(() => ({
    sectors: document.querySelectorAll('[data-sector]').length,
    hexes: document.querySelectorAll('.board polygon').length,
    routes: document.querySelectorAll('[data-testid=routes] line').length,
    labels: document.querySelectorAll('.region-label').length,
    borders: document.querySelectorAll('[data-testid=realm-borders] line').length,
    terrainFills: new Set([...document.querySelectorAll('[data-sector] polygon')].map((p) => p.getAttribute('fill'))).size,
  }));

  expect(drawn.sectors).toBe(56);
  expect(drawn.routes).toBe(17);
  expect(drawn.labels).toBe(10);
  // Terrain must be visibly differentiated, not one flat wash.
  expect(drawn.terrainFills).toBeGreaterThan(3);
  expect(drawn.borders).toBeGreaterThan(0);
});

test('realm identity is legible: every sector is attributed, and both outlines are drawn', async ({ page }) => {
  const owners = await page.evaluate(() =>
    [...document.querySelectorAll('[data-sector]')].map((g) => g.dataset.owner),
  );
  expect(owners).toHaveLength(56);
  expect(owners.filter((o) => o === 'none')).toEqual([]);
  expect([...new Set(owners)].sort()).toEqual(['realm-a', 'realm-b']);

  // Both realms must draw their own outline. A single-coloured boundary would
  // leave a player unable to tell, at a contested border, which side is theirs.
  // A Set does not survive the page boundary — return an array.
  const strokes = await page.evaluate(() => [
    ...new Set([...document.querySelectorAll('[data-testid=realm-borders] line')].map((l) => l.getAttribute('stroke'))),
  ]);
  expect(strokes).toHaveLength(2);
});

test('a player picks a capital by clicking their own ground, and the enemy site stays hidden', async ({ page }) => {
  await expect(page.getByTestId('prompt')).toContainText('수도를 골라주세요');

  const mine = await page.evaluate(() => document.querySelector('.sector.selectable')?.dataset.sector);
  expect(mine).toBeTruthy();

  await page.locator(`[data-sector="${mine}"]`).click();

  await expect(page.getByTestId('events')).toContainText('capital-locked');
  await expect(page.getByTestId('prompt')).toContainText('Waiting for realm-b');

  // One capital marker: this player's own. The opponent has not chosen, and
  // even when they do, the site is not readable before the joint reveal.
  const markers = await page.evaluate(() => document.querySelectorAll('[data-capital]').length);
  expect(markers).toBe(1);
});

test('a sector the player does not own is not selectable', async ({ page }) => {
  const selectable = await page.evaluate(() =>
    [...document.querySelectorAll('.sector.selectable')].map((g) => g.dataset.owner),
  );
  expect(selectable.length).toBeGreaterThan(0);
  // Everything offered belongs to the viewer, and nothing else is offered.
  expect([...new Set(selectable)]).toEqual(['realm-a']);
});

test('camera and hover are interaction state — they change the view, not the match', async ({ page }) => {
  const before = await page.evaluate(() => document.querySelector('.board').getAttribute('viewBox'));

  await page.locator('.board').hover();
  await page.mouse.wheel(0, -400);
  // Poll rather than read once: the wheel handler goes through a React state
  // update, so an immediate read can land on the pre-render value.
  await expect
    .poll(() => page.evaluate(() => document.querySelector('.board').getAttribute('viewBox')))
    .not.toBe(before);

  // Hover writes to the focus readout and nowhere else.
  await page.locator('[data-sector]').first().hover();
  await expect(page.getByTestId('focus')).not.toHaveText('hover a sector');

  // Neither touched the Runtime: no event was produced and the phase stands.
  await expect(page.getByTestId('events')).toHaveText('');
  await expect(page.getByTestId('prompt')).toContainText('수도를 골라주세요');
});

test('the seed decides the board, and the same seed redraws the same one', async ({ page }) => {
  const layout = () =>
    page.evaluate(() =>
      [...document.querySelectorAll('[data-sector]')].map((g) => `${g.dataset.sector}:${g.dataset.owner}`).join(),
    );

  const first = await layout();

  await page.locator('input').fill('a-different-seed');
  await page.waitForFunction(() => document.querySelectorAll('[data-sector]').length === 56);
  const second = await layout();

  await page.locator('input').fill('duel-0001');
  await page.waitForFunction(() => document.querySelectorAll('[data-sector]').length === 56);
  const third = await layout();

  expect(second).not.toBe(first);
  expect(third).toBe(first);
});
