#!/usr/bin/env node
'use strict';

// Sync the canonical documentation-law text into the generated block in
// AGENTS.md, so Codex (which has no external-file auto-import) receives the
// same law Claude Code gets via CLAUDE.md's @import.
//
// Canonical, editable source: DOCUMENTATION-LAW.md (top level — deliberately NOT
// under .claude/rules/, which the Claude Code harness auto-loads on its own;
// keeping it there put the full law in every session's context twice, once via
// that auto-load and once via the generated block below).
// The AGENTS.md block is generated — never edit it by hand.
//
// Usage:
//   node scripts/sync-docs-law.js           regenerate the block in AGENTS.md
//   node scripts/sync-docs-law.js --check    exit 1 if the block is stale (no write)

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const AGENTS = path.join(ROOT, 'AGENTS.md');
const SOURCE = path.join(ROOT, 'DOCUMENTATION-LAW.md');

const BEGIN = '<!-- BEGIN documentation-law (generated) -->';
const END = '<!-- END documentation-law (generated) -->';
const NOTE =
  '<!-- source: DOCUMENTATION-LAW.md — DO NOT EDIT here; edit the source and run `npm run sync:docs-law` -->';

function rebuild(agents, law) {
  const beginIdx = agents.indexOf(BEGIN);
  const endIdx = agents.indexOf(END);
  if (beginIdx === -1 || endIdx === -1 || endIdx < beginIdx) {
    throw new Error(
      `Markers not found (or out of order) in AGENTS.md. Expected both:\n  ${BEGIN}\n  ${END}`
    );
  }
  const before = agents.slice(0, beginIdx);
  const after = agents.slice(endIdx + END.length);
  const block = `${BEGIN}\n${NOTE}\n\n${law.trim()}\n\n${END}`;
  return before + block + after;
}

function main() {
  const check = process.argv.includes('--check');
  const agents = fs.readFileSync(AGENTS, 'utf8');
  const law = fs.readFileSync(SOURCE, 'utf8');
  const next = rebuild(agents, law);

  if (check) {
    if (next !== agents) {
      console.error(
        '[sync-docs-law] STALE: the AGENTS.md documentation-law block is out of sync with the canonical source.'
      );
      console.error('  Fix: npm run sync:docs-law');
      process.exit(1);
    }
    console.log('[sync-docs-law] OK: block is in sync with the canonical source.');
    return;
  }

  if (next === agents) {
    console.log('[sync-docs-law] already in sync; no change.');
    return;
  }
  fs.writeFileSync(AGENTS, next);
  console.log('[sync-docs-law] AGENTS.md documentation-law block updated from the canonical source.');
}

main();
