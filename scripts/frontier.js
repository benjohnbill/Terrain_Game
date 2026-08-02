#!/usr/bin/env node
/**
 * Frontier — what can be picked up right now.
 *
 * Reads ticket front matter under `.scratch/<tracker>/issues/` and derives
 * takeability. Two states are deliberately NOT stored anywhere and are computed
 * here instead: *blocked* (from `blocked_by` plus those tickets' own status) and
 * *merged* (git's, never a ticket's). See `docs/agents/issue-tracker.md`
 * § Wayfinding operations, sealed by ticket 14 R1-R7.
 *
 * This script is the reason the schema is worth enforcing: a blocking check on
 * a field nothing reads is a tax, so the check and this reader ship together.
 *
 *   node scripts/frontier.js            # every tracker
 *   node scripts/frontier.js doc-structure
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SCRATCH = path.join(ROOT, '.scratch');
const DONE = new Set(['resolved', 'superseded']);

/** Parse the leading `---` block. Flat scalars and one `[a, b]` list only. */
function readFrontMatter(text) {
  if (!text.startsWith('---\n')) return null;
  const end = text.indexOf('\n---', 4);
  if (end === -1) return null;
  const out = {};
  for (const line of text.slice(4, end).split('\n')) {
    const m = /^([a-z_]+):\s*(.*)$/.exec(line);
    if (!m) continue;
    const [, k, raw] = m;
    out[k] = /^\[.*\]$/.test(raw)
      ? raw.slice(1, -1).split(',').map(s => s.trim()).filter(Boolean)
      : raw.trim();
  }
  return out;
}

function idOf(filename) {
  const m = /^(\d{1,2}[a-e]?)/.exec(filename);
  return m ? m[1] : null;
}

function loadTracker(tracker) {
  const dir = path.join(SCRATCH, tracker, 'issues');
  if (!fs.existsSync(dir)) return null;
  const tickets = new Map();
  const unparsed = [];
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.md')).sort()) {
    const fm = readFrontMatter(fs.readFileSync(path.join(dir, f), 'utf8'));
    const id = idOf(f);
    if (!fm || !id) { unparsed.push(f); continue; }
    tickets.set(id, { id, file: f, ...fm, blocked_by: fm.blocked_by || [] });
  }
  return { tracker, tickets, unparsed };
}

/** Derived, never stored. */
function blockersOf(t, tickets) {
  return t.blocked_by.filter(b => {
    const dep = tickets.get(b);
    return !dep || !DONE.has(dep.status);
  });
}

function report(tracker) {
  const data = loadTracker(tracker);
  if (!data) return false;
  const { tickets, unparsed } = data;
  const takeable = [];
  const waiting = [];

  for (const t of [...tickets.values()].sort((a, b) => a.id.localeCompare(b.id))) {
    if (DONE.has(t.status)) continue;
    const open = blockersOf(t, tickets);
    if (t.status === 'open' && open.length === 0) takeable.push(t);
    else waiting.push({ t, open });
  }

  console.log(`\n${tracker}  —  ${tickets.size} tickets` +
    (unparsed.length ? `  (${unparsed.length} without front matter: ${unparsed.join(', ')})` : ''));

  if (!takeable.length) console.log('  takeable: none');
  for (const t of takeable) {
    const who = t.type === 'grilling' ? '  ← the user must be present' : '';
    console.log(`  TAKEABLE  ${t.type.padEnd(9)} ${t.file}${who}`);
  }
  for (const { t, open } of waiting) {
    const why = t.status === 'needs-info' ? 'needs-info' : `blocked by ${open.join(', ')}`;
    console.log(`  .         ${t.type.padEnd(9)} ${t.file}  — ${why}`);
  }
  return true;
}

function listTrackers() {
  return fs.readdirSync(SCRATCH)
    .filter(d => fs.existsSync(path.join(SCRATCH, d, 'issues'))).sort();
}

// `audit-lint.js` requires this module for `readFrontMatter` — a second parser
// would be the second copy this repo's whole governance exists to prevent — so
// the CLI runs only when this file is invoked directly.
if (require.main === module) {
  const only = process.argv[2];
  const trackers = only ? [only] : listTrackers();
  let any = false;
  for (const t of trackers) any = report(t) || any;
  if (!any) {
    console.error(`no tracker with an issues/ directory${only ? `: ${only}` : ''}`);
    process.exit(1);
  }
  console.log('');
}

module.exports = { readFrontMatter, loadTracker, blockersOf, listTrackers, idOf, DONE };
