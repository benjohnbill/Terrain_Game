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

function deepKeys(value, keys = new Set()) {
  if (value === null || typeof value !== 'object') return keys;
  for (const [key, child] of Object.entries(value)) {
    keys.add(key);
    deepKeys(child, keys);
  }
  return keys;
}

async function hiddenOpponentLog({ requestId, commit, destinationIndex }) {
  const { CRADLE_R1, Runtime } = await import('../../dist/runtime/index.js');
  const runtime = Runtime.open({ world: CRADLE_R1, seed: FIXTURE.seed, actors: FIXTURE.actors });
  const setup = runtime.view('observer');
  const log = [];
  const append = (...intents) => {
    for (const intent of intents) {
      log.push(intent);
      const rejected = runtime.submit(intent).find((event) => event.type === 'intent-rejected');
      expect(rejected, rejected?.detail.reason).toBeUndefined();
    }
  };

  append(...setup.actors.map((actor) => ({
    kind: 'choose-capital',
    actor,
    sector: setup.realms.find((realm) => realm.actor === actor).sectors[0],
  })));
  const enemy = runtime.view('realm-b');
  const source = enemy.capitals['realm-b'];
  const destinations = enemy.board.sectors[source].mapUnits;
  append(
    {
      kind: 'allocate-recruitment', actor: 'realm-b', requestId,
      sectorId: source, commit, posture: 'field',
    },
    {
      kind: 'move-detachment', actor: 'realm-b', detachmentId: enemy.detachments[0].id,
      destinationHex: destinationIndex === 'last' ? destinations.at(-1) : destinations[destinationIndex],
      forcedMarch: false,
    },
    { kind: 'lock-commitment', actor: 'realm-b' },
    { kind: 'lock-commitment', actor: 'realm-a' },
  );
  return log;
}

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
    // Ticket 05's realm economy, folded into the same tail — one per realm.
    'realm-recomputed',
    'realm-recomputed',
    // Ticket 06b's wear ledger, in the same tail and on the same terms.
    'upkeep-resolved',
    'upkeep-resolved',
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
    'background',
    'background',
    'background',
    'background',
  ]);
  expect(view.turn).toBe(2);
  expect(view.phase).toBe('decision');
  expect(view.committed).toEqual([]);
});

test('an ordered intent log replays to the same turn state in both hosts', async ({ page }) => {
  // The canonical durable form is `(world identity, seed, ordered intent log)`
  // (ADR 0049 § Decision 8). This is that claim across the host boundary: Node and the
  // browser pump the *same* log through the *same* emitted artifact and must land
  // on the same board.
  const { replayForViewer, replayLog, turnSummary } = await import('../../acceptance/replay.js');
  const { CRADLE_R1, Runtime } = await import('../../dist/runtime/index.js');

  const open = () => Runtime.open({ world: CRADLE_R1, seed: FIXTURE.seed, actors: FIXTURE.actors });
  const log = replayLog(open());
  const node = open();
  const nodeResult = replayForViewer(node, FIXTURE.viewer, log);

  const browserResult = await page.evaluate(
    ({ fixture, log: intents }) => window.__l3.replay({ ...fixture, log: intents }),
    { fixture: FIXTURE, log },
  );

  const browserSummary = turnSummary(browserResult);
  const nodeSummary = turnSummary(nodeResult);
  expect(browserSummary).toEqual(nodeSummary);
  expect(nodeResult.events.filter((e) => e.type === 'intent-rejected')).toEqual([]);
  expect(nodeResult.events.some((e) => e.type === 'detachment-split')).toBe(true);
  expect(nodeResult.events.some((e) => e.type === 'detachments-merged')).toBe(true);
  expect(nodeResult.view.turn).toBe(11);
  // Three, not two: the forlorn hope of ticket 06e's rout phase broke and *fell
  // back*, so it is still a formation. Had it left service instead it would carry
  // no pending cohort and would have stopped existing.
  expect(nodeSummary.detachments).toHaveLength(3);

  // The contact phase (06c) and, since 06e, the rout and interior phases. The
  // fixture now crosses a border, breaks, and marches inland, so the loop's most
  // intricate arithmetic is on the wire rather than only in a unit test. The
  // cross-host claim is `browserSummary === nodeSummary` above; these pin that the
  // fixture still *reaches* each battle instead of quietly relapsing into the
  // garrison-only lane it used to end in.
  const battles = nodeResult.events.filter((e) => e.type === 'battle-resolved');
  expect(battles).toHaveLength(3);
  expect(battles.some((b) => b.detail.sectorFalls)).toBe(true);
  expect(battles.some((b) => b.detail.casualties.attacker > 0)).toBe(true);
  expect(battles.some((b) => b.detail.casualties.defender > 0)).toBe(true);

  // ADR 0046's headline, across the host boundary: a sector no authored border
  // touches was fought over. Before 06e the candidate sites were seeded from the
  // front list, so this battle could not exist at any seed.
  const inland = battles.filter((b) => b.detail.fronts.length === 0);
  expect(inland).toHaveLength(1);
  expect(inland[0].detail.borderClass).toBeNull();
  // And WM-⑤: a side broke, and both hosts agree on where its survivors stand.
  expect(battles.some((b) => b.detail.routed.attacker)).toBe(true);
  // Exact pre-battle strength and the composed power product are ticket 08's fog
  // and ticket 09's EVAL BAR to present; neither may reach a viewer here.
  expect(deepKeys(nodeResult.events)).not.toContain('substance');
  expect(deepKeys(nodeResult.events)).not.toContain('power');

  // A force that marched and fought carries wear, and the men still reconcile with
  // the field reading after the blood was taken.
  expect(nodeSummary.detachments.find((d) => d.id === 'detachment:realm-a:1').fatigue)
    .toBeGreaterThan(0);
  expect(nodeSummary.detachments.reduce((men, detachment) => men + detachment.men, 0))
    .toBe(nodeSummary.economy.field);
  expect(nodeSummary.economy.sectors).toBeDefined();
});

test('durable Node and browser replay hide varied opponent recruitment and movement truth', async ({ page }) => {
  const { turnSummary } = await import('../../acceptance/replay.js');
  const { CRADLE_R1, Runtime } = await import('../../dist/runtime/index.js');
  const smallLog = await hiddenOpponentLog({
    requestId: 'enemy-small-private-id', commit: 1, destinationIndex: 0,
  });
  const largeLog = await hiddenOpponentLog({
    requestId: 'enemy-large-private-id', commit: 4, destinationIndex: 'last',
  });

  const replayNode = (log) => {
    const runtime = Runtime.open({ world: CRADLE_R1, seed: FIXTURE.seed, actors: FIXTURE.actors });
    const events = log.flatMap((intent) => runtime.submit(intent));
    return { events, view: runtime.view(FIXTURE.viewer) };
  };
  expect(turnSummary(replayNode(smallLog))).toEqual(turnSummary(replayNode(largeLog)));

  const [smallBrowser, largeBrowser] = await page.evaluate(
    ({ fixture, logs }) => logs.map((log) => window.__l3.replay({ ...fixture, log })),
    { fixture: FIXTURE, logs: [smallLog, largeLog] },
  );
  expect(smallBrowser).toEqual(largeBrowser);
  const serialized = JSON.stringify(smallBrowser.events);
  for (const forbidden of [
    'bill', 'treasury', 'fulfilled', 'requestId', 'detachmentId',
    'destination', 'destinationHex', 'position', 'posture', 'men', 'income',
  ]) {
    expect(deepKeys(smallBrowser.events)).not.toContain(forbidden);
  }
  expect(serialized).not.toContain('order:recruit:');
  expect(serialized).not.toContain('enemy-small-private-id');
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
