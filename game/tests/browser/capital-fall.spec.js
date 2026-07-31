/**
 * The loop closes in both hosts — ticket 07 acceptance item 10.
 *
 * A whole match, from setup to a capital fall to the victory screen, is reproducible
 * from `(worldId, revision, seed, ordered intent log)`. Node builds the log, the
 * browser pumps it through the *same emitted artifact*, and the two must land on the
 * same ending — not merely each on an ending of its own (gate 05 D6).
 */

import { test, expect } from '@playwright/test';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { startStaticServer } from '../../acceptance/static-server.js';

const FIXTURE = { seed: 'turn-0001', actors: ['realm-a', 'realm-b'], viewer: 'realm-a' };
const BUILT = fileURLToPath(new URL('../../dist-viewer/index.html', import.meta.url));

let server;

test.beforeAll(async () => {
  server = await startStaticServer();
});

test.afterAll(async () => {
  await server?.close();
});

test.beforeEach(async ({ page }) => {
  await page.goto(`${server.origin}/acceptance/harness.html`);
  await page.waitForFunction(() => window.__l3ready === true);
});

/**
 * The shortest log that ends a match: seat realm-b's capital on the sector realm-a's
 * opening army can reach in one march, march onto it, and commit.
 *
 * Probing with a throwaway runtime is exact rather than approximate — an opening army
 * musters at its *own* capital and the front set is drawn from the seed, so moving
 * realm-b's capital moves neither realm-a's army nor what it can reach.
 */
async function decapitationLog() {
  const { CRADLE_R1, Runtime, buildMovementGraph, minimumCostRoute, musterHexOf } =
    await import('../../dist/runtime/index.js');
  const graph = buildMovementGraph(CRADLE_R1);
  const open = () => Runtime.open({ world: CRADLE_R1, seed: FIXTURE.seed, actors: FIXTURE.actors });

  const setup = open().view('observer');
  const defaults = Object.fromEntries(
    setup.realms.map((realm) => [realm.actor, realm.sectors[0]]),
  );

  const probe = open();
  for (const actor of FIXTURE.actors) {
    probe.submit({ kind: 'choose-capital', actor, sector: defaults[actor] });
  }
  const scout = probe.view('realm-a');
  const own = new Set(scout.realms.find((realm) => realm.actor === 'realm-a').sectors);
  const from = scout.detachments[0].position;
  let best = null;
  for (const front of scout.fronts) {
    const [x, y] = front.sectors;
    const theirs = own.has(x) ? y : x;
    const route = minimumCostRoute(graph, from, musterHexOf(CRADLE_R1, theirs));
    if (route === null) continue;
    if (best !== null && route.length >= best.route.length) continue;
    best = { theirs, route };
  }
  expect(best, 'this fixture offers the opening army no reachable enemy front sector')
    .not.toBeNull();

  const detachmentId = scout.detachments[0].id;
  return {
    capital: best.theirs,
    log: [
      { kind: 'choose-capital', actor: 'realm-a', sector: defaults['realm-a'] },
      { kind: 'choose-capital', actor: 'realm-b', sector: best.theirs },
      {
        kind: 'move-detachment', actor: 'realm-a', detachmentId,
        destinationHex: best.route.at(-1), forcedMarch: false,
      },
      {
        kind: 'allocate-commitment', actor: 'realm-a', sector: best.theirs, chips: 20,
        detachmentIds: [detachmentId],
      },
      { kind: 'lock-commitment', actor: 'realm-a' },
      { kind: 'lock-commitment', actor: 'realm-b' },
    ],
  };
}

test('a match runs to a capital fall, and both hosts reach the same ending', async ({ page }) => {
  const { replayForViewer, turnSummary } = await import('../../acceptance/replay.js');
  const { CRADLE_R1, Runtime } = await import('../../dist/runtime/index.js');
  const { capital, log } = await decapitationLog();

  const node = Runtime.open({ world: CRADLE_R1, seed: FIXTURE.seed, actors: FIXTURE.actors });
  const nodeResult = replayForViewer(node, FIXTURE.viewer, log);
  const browserResult = await page.evaluate(
    ({ fixture, log: intents }) => window.__l3.replay({ ...fixture, log: intents }),
    { fixture: FIXTURE, log },
  );

  expect(turnSummary(browserResult)).toEqual(turnSummary(nodeResult));
  expect(nodeResult.events.filter((e) => e.type === 'intent-rejected')).toEqual([]);

  // The ending itself, asserted rather than only compared — two hosts agreeing on
  // `null` would satisfy the equality above.
  expect(nodeResult.view.phase).toBe('match-ended');
  expect(nodeResult.view.outcome).toEqual({
    winner: 'realm-a', loser: 'realm-b', capital, turn: 1,
  });

  // It crossed `submit()` whole, for both hosts: a match whose end one side could
  // not read would not be an end.
  const ended = browserResult.events.filter((e) => e.type === 'match-ended');
  expect(ended).toHaveLength(1);
  expect(ended[0].detail).toEqual({
    tier: 'payoff', winner: 'realm-a', loser: 'realm-b', capital,
  });

  // Play stopped where it was: no turn opened behind the ending.
  expect(browserResult.events.some((e) => e.type === 'turn-opened')).toBe(false);
  expect(browserResult.view.turn).toBe(1);
});

test('a human plays a decapitation through the built viewer and sees it end', async ({ page }) => {
  // The real browser path, not a projection assertion: a player picks capitals,
  // marches, pours the stack, locks — and the match stops with a screen that says
  // who won and why. Against the **built** viewer, so this is the artifact a
  // playtester would be handed.
  expect(existsSync(BUILT), 'run `npm run build:game` before this lane').toBe(true);
  const { capital } = await decapitationLog();

  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(`${server.origin}/dist-viewer/index.html`);
  await page.waitForFunction(() => document.querySelectorAll('[data-sector]').length > 0);
  await page.locator('.controls input').fill(FIXTURE.seed);
  await page.waitForFunction(() => document.querySelectorAll('.sector.selectable').length > 0);

  // realm-b seats its capital on the sector realm-a can reach — the fixture's whole
  // contrivance, and a legal choice: eligibility is ownership (R3).
  await page.getByTestId('viewer').selectOption('realm-b');
  await page.locator(`[data-sector="${capital}"]`).click();
  await page.getByTestId('viewer').selectOption('realm-a');
  const mine = await page.evaluate(() => document.querySelector('.sector.selectable')?.dataset.sector);
  await page.locator(`[data-sector="${mine}"]`).click();

  await expect(page.getByTestId('turn-strip')).toBeVisible();
  await page.locator(`[data-sector="${capital}"]`).hover();
  await page.getByTestId('march-focused').click();

  // Sixteen of twenty, and that is the measurement rather than a magic number: at
  // CP-⑤'s 2,500/pop this capital's guard is 5,000, and the opening army takes it
  // only near full commitment. "Most of a field army" is what the coefficient was
  // re-cut to mean, and here it is on screen.
  const plus = page.locator('[data-testid="commit-sectors"] tr', { hasText: capital })
    .getByRole('button', { name: '+1' });
  for (let i = 0; i < 16; i += 1) await plus.click();
  await expect(page.getByTestId(`chips-${capital}`)).toHaveText('16');

  await page.getByTestId('lock').click();
  await page.getByTestId('viewer').selectOption('realm-b');
  await page.getByTestId('lock').click();

  const victory = page.getByTestId('victory');
  await expect(victory).toBeVisible();
  await expect(page.getByTestId('victory-winner')).toHaveText('realm-a');
  await expect(victory).toContainText(capital);
  await expect(victory).toContainText('패배');   // read by the realm that lost
  await expect(page.getByTestId('turn-strip')).toHaveCount(0);

  // Item 9: a new match starts afterwards and resets both sides of the shell — the
  // Runtime by being a new one, the interaction state by being cleared. On the
  // **same seed**, which is the case a memo keyed on the seed alone would fail.
  await page.getByTestId('new-match').click();
  await expect(victory).toHaveCount(0);
  await expect(page.getByTestId('prompt')).toBeVisible();
  await expect(page.locator('.controls input')).toHaveValue(FIXTURE.seed);
  expect(errors).toEqual([]);
});
