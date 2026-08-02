/**
 * Both-hosts parity: equal authored-world identity and seed must produce equal
 * initial projections in Node and in a browser.
 *
 * Gate 05 D6 requires this check inside `verify:game`, and hands its **pass
 * threshold** — bit-exact versus epsilon — to gate 10. **Gate 10 sealed it
 * bit-exact on 2026-08-02**, so this script now judges as well as measures:
 * equal digests PASS, and any difference exits 1, which no threshold choice
 * could have excused.
 *
 * `thresholds.js` carries the seal and the one condition that reopens it — a
 * non-V8 engine, because `Math.pow` is implementation-approximated and
 * `battle.ts`'s casualty exponent is the domain's only non-integer one.
 */

import { chromium } from '@playwright/test';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { startStaticServer } from './static-server.js';
import { formatPending, PendingThreshold, requireThreshold } from './thresholds.js';

const FIXTURE = Object.freeze({
  seed: 'parity-fixture-0001',
  actors: ['realm-a', 'realm-b'],
  viewer: 'realm-a',
});

const DIST_ENTRY = new URL('../dist/runtime/index.js', import.meta.url);

/** Order-independent, stable serialization, so a key-order difference is not read as a behavioural one. */
function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${canonical(value[k])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value) ?? 'null';
}

const digest = (value) => createHash('sha256').update(canonical(value)).digest('hex').slice(0, 16);

async function nodeProjection() {
  const { Runtime, CRADLE_R1 } = await import(pathToFileURL(DIST_ENTRY.pathname).href);
  return Runtime.open({
    world: CRADLE_R1,
    seed: FIXTURE.seed,
    actors: FIXTURE.actors,
  }).view(FIXTURE.viewer);
}

async function browserProjection() {
  const server = await startStaticServer();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const failures = [];
    page.on('pageerror', (error) => failures.push(String(error)));

    await page.goto(`${server.origin}/acceptance/harness.html`);
    await page.waitForFunction(() => window.__l3ready === true, undefined, { timeout: 10_000 });
    if (failures.length) throw new Error(`Harness page errored: ${failures.join('; ')}`);

    return await page.evaluate((fixture) => window.__l3.initialProjection(fixture), FIXTURE);
  } finally {
    await browser.close();
    await server.close();
  }
}

const [node, browser] = await Promise.all([nodeProjection(), browserProjection()]);
const nodeDigest = digest(node);
const browserDigest = digest(browser);

console.log('both-hosts parity');
console.log(`  fixture   ${node.world.worldId}@${node.world.revision} seed=${FIXTURE.seed}`);
console.log(`  partition ${node.realms.map((r) => `${r.actor}[${r.regions.join(' ')}]`).join('  ')}`);
console.log(`  node      ${nodeDigest}`);
console.log(`  browser   ${browserDigest}`);
console.log(`  identical ${nodeDigest === browserDigest ? 'yes' : 'NO'}`);
console.log('');

if (nodeDigest !== browserDigest) {
  console.error('FAIL  the two hosts disagree, which no threshold choice could excuse.');
  console.error(`  node    ${canonical(node)}`);
  console.error(`  browser ${canonical(browser)}`);
  process.exit(1);
}

try {
  console.log(`PASS  parity holds at the recorded threshold (${requireThreshold('parity.equality')}).`);
} catch (error) {
  if (!(error instanceof PendingThreshold)) throw error;
  console.error(formatPending(error));
  console.error('');
  console.error('  Observed: the two hosts produced identical projections.');
  process.exit(2);
}
