/**
 * The browser lane. It loads the **emitted artifact** through the same static
 * server the parity check uses, so "it works in the browser" means the very
 * module Node imported works there — not a second transpile of the same source
 * (gate 05 D6).
 */

import { test, expect } from '@playwright/test';
import { startStaticServer } from '../../acceptance/static-server.js';

const FIXTURE = {
  world: { worldId: 'boot-null-world', revision: '0' },
  seed: 'browser-lane-0001',
  actors: ['realm-a', 'realm-b'],
  viewer: 'realm-a',
};

let server;

test.beforeAll(async () => {
  server = await startStaticServer();
});

test.afterAll(async () => {
  await server?.close();
});

test.beforeEach(async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(`${server.origin}/acceptance/harness.html`);
  await page.waitForFunction(() => window.__l3ready === true);
  expect(errors, 'the emitted artifact errored while loading in a browser').toEqual([]);
});

test('the emitted runtime boots in a browser and projects', async ({ page }) => {
  const view = await page.evaluate((f) => window.__l3.initialProjection(f), FIXTURE);

  expect(view.world).toEqual(FIXTURE.world);
  expect(view.viewer).toBe('realm-a');
  expect(view.turn).toBe(1);
  expect(view.actors).toEqual(FIXTURE.actors);
});

test('the seed does not cross the blur seam in a browser either', async ({ page }) => {
  const serialized = await page.evaluate(
    (f) => JSON.stringify(window.__l3.initialProjection(f)),
    FIXTURE,
  );
  expect(serialized).not.toContain(FIXTURE.seed);
});

test('the same seed projects identically across two boots in one browser', async ({ page }) => {
  const [a, b] = await page.evaluate(
    (f) => [
      JSON.stringify(window.__l3.initialProjection(f)),
      JSON.stringify(window.__l3.initialProjection(f)),
    ],
    FIXTURE,
  );
  expect(a).toBe(b);
});
