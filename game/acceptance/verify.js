/**
 * `verify:game` — the whole acceptance chain, in one command.
 *
 * It runs every lane even when an earlier one is pending, so a run reports the
 * *whole* state of the build rather than stopping at the first red. A genuine
 * failure exits 1; a lane that ran clean but has no authorised threshold exits
 * 2 (PENDING). Only an all-green run exits 0.
 *
 * **An all-green run has been reachable since 2026-08-02**, when gate 10 sealed
 * `parity.equality`. Until then no run could exit 0 by design, which meant a red
 * result carried no information — the hazard DESIGN-RISKS R20 records. Treat a
 * new PENDING as a real signal: it means a threshold was added and not yet
 * filled, not that this is business as usual.
 */

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = fileURLToPath(new URL('../..', import.meta.url));

// Gate 05 D3 seals **seven** `:game` commands as the supported developer path,
// so parity is invoked directly rather than given an eighth script name.
const LANES = [
  { name: 'typecheck', run: ['npm', ['run', '--silent', 'typecheck:game']] },
  { name: 'build:runtime', run: ['npm', ['run', '--silent', 'build:runtime:game']] },
  // The viewer lane runs against the built viewer, so it is built here rather
  // than assumed to be current from some earlier session.
  { name: 'build:viewer', run: ['npm', ['run', '--silent', 'build:game']] },
  { name: 'test:node', run: ['npm', ['run', '--silent', 'test:game']] },
  { name: 'test:browser', run: ['npm', ['run', '--silent', 'test:browser:game']] },
  { name: 'parity', run: ['node', ['game/acceptance/parity.js']], pendingExitCode: 2 },
];

const results = [];

for (const lane of LANES) {
  console.log(`\n──────── ${lane.name} ────────`);
  const [command, args] = lane.run;
  const { status } = spawnSync(command, args, {
    cwd: REPO_ROOT,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  results.push({
    name: lane.name,
    verdict: status === 0 ? 'PASS' : status === lane.pendingExitCode ? 'PENDING' : 'FAIL',
  });
}

console.log('\n──────── verify:game ────────');
for (const { name, verdict } of results) console.log(`  ${verdict.padEnd(8)} ${name}`);

const failed = results.filter((r) => r.verdict === 'FAIL');
const pending = results.filter((r) => r.verdict === 'PENDING');

if (failed.length) {
  console.error(`\nFAIL — ${failed.map((r) => r.name).join(', ')}`);
  process.exit(1);
}
if (pending.length) {
  console.error(
    `\nPENDING — ${pending.map((r) => r.name).join(', ')}. Every lane ran clean, but ` +
      'Wayfinder gate 10 has not filled the thresholds that would judge them. ' +
      'This command cannot report green until it does (gate 05 D3).',
  );
  process.exit(2);
}

console.log('\nPASS');
