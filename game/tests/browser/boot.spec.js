/**
 * The browser lane. It loads the **emitted artifact** through the same static
 * server the parity check uses, so "it works in the browser" means the very
 * module Node imported works there — not a second transpile of the same source
 * (gate 05 D6).
 */

import { test, expect } from '@playwright/test';
import { startStaticServer } from '../../acceptance/static-server.js';

const FIXTURE = { seed: 'browser-lane-0001', actors: ['realm-a', 'realm-b'], viewer: 'realm-a' };

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

test('the emitted runtime boots a real two-realm match in a browser', async ({ page }) => {
  const view = await page.evaluate((f) => window.__l3.initialProjection(f), FIXTURE);

  expect(view.world).toEqual({ worldId: 'terrain-cradle', revision: 'r1' });
  expect(view.phase).toBe('capital-selection');
  expect(view.realms).toHaveLength(2);
  expect(view.realms[0].sectors.length + view.realms[1].sectors.length).toBe(56);
  expect(Math.abs(view.realms[0].population - view.realms[1].population)).toBeLessThan(1e-9);
});

test('the world passes its fail-closed load in a browser too', async ({ page }) => {
  const summary = await page.evaluate(() => window.__l3.worldSummary());

  // The integrity stamp is host-independent by construction — it uses only
  // Math.imul and uint32 arithmetic, never node:crypto.
  expect(summary.contentHash).toBe('113f7635');
  // And the five open borders still carry Infinity rather than the null a JSON
  // round-trip would have left behind.
  expect(summary.openBorders).toBe(5);
  for (const population of Object.values(summary.regionPopulation)) {
    expect(Math.abs(population - 6)).toBeLessThan(1e-9);
  }
});

test('the seed does not cross the blur seam in a browser either', async ({ page }) => {
  const serialized = await page.evaluate(
    (f) => JSON.stringify(window.__l3.initialProjection(f)),
    FIXTURE,
  );
  expect(serialized).not.toContain(FIXTURE.seed);
});

test('the capital beat reveals both sites together, in a browser', async ({ page }) => {
  const { events, view } = await page.evaluate((f) => window.__l3.capitalBeat(f), FIXTURE);

  expect(events.map((e) => e.type)).toEqual([
    'capital-locked',
    'capital-locked',
    'capitals-revealed',
  ]);
  // The beat hands straight over to the turn loop's sole agency tier (D6.2).
  expect(view.phase).toBe('decision');
  expect(Object.keys(view.capitals).sort()).toEqual(['realm-a', 'realm-b']);
});

test('a turn commits, reveals and resolves in a browser, from the same artifact', async ({ page }) => {
  const { events, view } = await page.evaluate((f) => window.__l3.oneTurn(f), FIXTURE);

  expect(events.map((e) => e.type)).toEqual([
    'commitment-allocated',
    'commitment-allocated',
    'commitment-locked',
    'commitment-locked',
    'commitments-revealed',
    'front-resolved',
    'turn-opened',
  ]);
  expect(events.map((e) => e.detail.tier)).toEqual([
    'decision',
    'decision',
    'decision',
    'decision',
    'payoff',
    'payoff',
    'background',
  ]);
  expect(view.turn).toBe(2);
  expect(view.phase).toBe('decision');
  expect(view.committed).toEqual([]);
});

test('an ordered intent log replays to the same turn state in both hosts', async ({ page }) => {
  // The canonical durable form is `(world identity, seed, ordered intent log)`
  // (gate 02 § 5). This is that claim across the host boundary: Node and the
  // browser pump the *same* log through the *same* emitted artifact and must land
  // on the same board.
  const { replayLog, turnSummary } = await import('../../acceptance/replay.js');
  const { CRADLE_R1, Runtime } = await import('../../dist/runtime/index.js');

  const open = () => Runtime.open({ world: CRADLE_R1, seed: FIXTURE.seed, actors: FIXTURE.actors });
  const log = replayLog(open());
  const node = open();
  const nodeResult = { events: log.flatMap((intent) => node.submit(intent)), view: node.view('observer') };

  const browserResult = await page.evaluate(
    ({ fixture, log: intents }) => window.__l3.replay({ ...fixture, log: intents }),
    { fixture: FIXTURE, log },
  );

  expect(turnSummary(browserResult)).toEqual(turnSummary(nodeResult));
  expect(nodeResult.events.filter((e) => e.type === 'intent-rejected')).toEqual([]);
  expect(nodeResult.view.turn).toBe(5);
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
