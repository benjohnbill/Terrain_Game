/**
 * The wear ledger in both hosts, from the one emitted runtime artifact.
 *
 * Ticket 06b requires that accrual and recovery be identical across Node and the
 * browser, exercised **through a real turn** rather than as a unit call. So the
 * subject here is an ordered intent log — the canonical durable form (gate 02
 * § 5) — that marches a force hard and then rests it, replayed in both hosts.
 */

import { test, expect } from '@playwright/test';
import { startStaticServer } from '../../acceptance/static-server.js';

const FIXTURE = { seed: 'upkeep-parity-0001', actors: ['realm-a', 'realm-b'], viewer: 'realm-a' };

let server;

test.beforeAll(async () => {
  server = await startStaticServer();
});

test.afterAll(async () => {
  await server?.close();
});

test('a marched-then-rested force carries the same wear in Node and the browser', async ({ page }) => {
  const { buildMovementGraph, CRADLE_R1, hexKey, MARCH_SPEED, Runtime } = await import(
    '../../dist/runtime/index.js'
  );
  const { replayForViewer } = await import('../../acceptance/replay.js');

  const open = () => Runtime.open({ world: CRADLE_R1, seed: FIXTURE.seed, actors: FIXTURE.actors });
  const graph = buildMovementGraph(CRADLE_R1);

  // Build the log against a throwaway runtime, then discard it: the log must be
  // replayable by a host that never saw the runtime that produced it.
  const planner = open();
  const setup = planner.view('observer');
  const log = setup.actors.map((actor) => ({
    kind: 'choose-capital',
    actor,
    sector: setup.realms.find((realm) => realm.actor === actor).sectors[0],
  }));
  for (const intent of log) planner.submit(intent);

  const detachment = planner.view(FIXTURE.viewer).detachments[0];
  let frontier = [hexKey(detachment.position.q, detachment.position.r)];
  const seen = new Set(frontier);
  for (let step = 0; step < MARCH_SPEED * 2; step += 1) {
    const next = [];
    for (const key of frontier) {
      for (const arc of graph.nodes[key].arcs) {
        if (seen.has(arc.to)) continue;
        seen.add(arc.to);
        next.push(arc.to);
      }
    }
    frontier = next;
  }
  log.push({
    kind: 'move-detachment',
    actor: FIXTURE.viewer,
    detachmentId: detachment.id,
    destinationHex: { ...graph.nodes[frontier[0]].position },
    forcedMarch: true,
  });
  // Four turns: the march runs itself out, then the force stands still and the
  // ledger comes back down. Both halves of the gauge's one live account.
  for (let turn = 0; turn < 4; turn += 1) {
    for (const actor of FIXTURE.actors) log.push({ kind: 'lock-commitment', actor });
  }

  const wearOf = ({ view }) => view.detachments.map((entry) => [entry.id, entry.fatigue]);
  const node = wearOf(replayForViewer(open(), FIXTURE.viewer, log));
  expect(node.some(([, fatigue]) => fatigue > 0)).toBe(true);

  await page.goto(`${server.origin}/acceptance/harness.html`);
  await page.waitForFunction(() => window.__l3ready === true, undefined, { timeout: 10_000 });
  const browser = await page.evaluate(
    (input) => window.__l3.replay(input).view.detachments.map((entry) => [entry.id, entry.fatigue]),
    { ...FIXTURE, log },
  );

  expect(browser).toEqual(node);
});
