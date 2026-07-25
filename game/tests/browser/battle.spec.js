/**
 * The battle calculator in both hosts, from the one emitted runtime artifact.
 */

import { test, expect } from '@playwright/test';
import { startStaticServer } from '../../acceptance/static-server.js';

const INPUT = {
  attacker: { substance: 2_000, commit: 8, quality: 1, fatigue: 0.8, escape: 'OPEN' },
  defender: { substance: 1_300, commit: 14, quality: 1, fatigue: 1, escape: 'BLOCKED' },
  terrain: 'forestHills',
  fortification: 'fieldWorks',
  crossing: 'riverOpposed',
};

let server;

test.beforeAll(async () => {
  server = await startStaticServer();
});

test.afterAll(async () => {
  await server?.close();
});

test('equal battle inputs are deterministic and identical in Node and the browser', async ({ page }) => {
  const { resolveBattle } = await import('../../dist/runtime/index.js');
  const node = resolveBattle(INPUT);

  await page.goto(`${server.origin}/acceptance/harness.html`);
  const [first, second] = await page.evaluate(async (input) => {
    const { resolveBattle: resolveInBrowser } = await import('/dist/runtime/index.js');
    return [resolveInBrowser(input), resolveInBrowser(input)];
  }, INPUT);

  expect(first).toEqual(node);
  expect(second).toEqual(node);
});
