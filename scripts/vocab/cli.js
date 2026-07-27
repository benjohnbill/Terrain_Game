#!/usr/bin/env node
// Vocabulary dashboard — the CLI shell. The ONLY part that touches fs or git.
// Untested by design, the same boundary `scripts/hooks/write-lint.js` sets: the
// pure stages (parse / drift / render / renderMarkdown) carry the tests.
//
// Two modes, so that re-rendering is never held hostage by a review:
//   render  — write the outputs, leave the lock marker alone   (anytime)
//   lock    — report drift, then advance the marker with --advance  (a review)
//
// Nothing here runs from a hook. Writing happens only on invocation, and the
// invoker is the `doc-audit` skill (user, 2026-07-28).
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const { parse } = require('./parse');
const { drift } = require('./drift');
const { render } = require('./render');
const { renderMarkdown } = require('./markdown');

const ROOT = path.resolve(__dirname, '..', '..');
const INVENTORY = 'docs/audits/term-inventory.json';
const LOCK = 'docs/audits/vocab-lock.json';
const HTML_OUT = 'dist/vocab/index.html';

// Default markdown target is a NEW path, not `docs/GLOSSARY-QUICKREF.md`.
// That file is not the flat term list it was assumed to be: it carries
// hand-authored digest sections (`## Economy flows — reader's digest`) that a
// generator would destroy — the same hazard that moved the C-loop table out to
// `docs/C-LOOP.md`. Overwriting it is a user decision, not a default.
const MD_OUT = 'docs/vocab-index.md';

// Definition surfaces, in the order the gloss ladder should see them. The first
// two groups are today's enforced scan scope (checks 1/3/10/11); the rest are
// the spec's group B/C surfaces, which contribute glosses but are NOT claimed as
// registration-checked scope.
function surfacePaths() {
  const featureDir = path.join(ROOT, 'docs/features');
  const glossaries = fs.readdirSync(featureDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => `docs/features/${e.name}/GLOSSARY.md`);

  const extra = [
    'docs/features/combat-formula/MAGNITUDE.md',
    'docs/features/combat-formula/MATCHUP.md',
    'docs/features/match-arc/STRATEGY-SPACE.md',
    'docs/features/match-arc/TEST-LADDER.md',
    'docs/features/match-arc/RULINGS.md',
    'docs/features/force-geography/RULINGS.md',
    'docs/features/tactical-plan-ai/RULINGS.md',
    'docs/features/operation-plan-catalog/CATALOG.md',
    'docs/adr/0019-situation-judgment-structured-province-reading.md'
  ];

  return ['DOMAIN_MAP.md', ...glossaries, ...extra]
    .filter((p) => fs.existsSync(path.join(ROOT, p)));
}

const readAt = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

function modelNow() {
  return parse({
    inventory: JSON.parse(readAt(INVENTORY)),
    surfaces: surfacePaths().map((p) => ({ path: p, text: readAt(p) }))
  });
}

const git = (args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();

// The lock baseline stores a commit and no content, so the old model is
// recovered by re-parsing that revision (ruling 03 Q5's ownership boundary).
function modelAt(commit) {
  const show = (p) => git(['show', `${commit}:${p}`]);
  const surfaces = [];
  for (const p of surfacePaths()) {
    try {
      surfaces.push({ path: p, text: show(p) });
    } catch (e) {
      // The surface did not exist at that revision. A term born since then
      // simply has no gloss to compare, which drift reports as a redefinition.
    }
  }
  return parse({ inventory: JSON.parse(show(INVENTORY)), surfaces });
}

function readLock() {
  const at = path.join(ROOT, LOCK);
  return fs.existsSync(at) ? JSON.parse(fs.readFileSync(at, 'utf8')) : null;
}

// The lock panel's reading: the marker plus what has moved since it.
function lockReading(model) {
  const marker = readLock();
  if (!marker) return null;
  let report;
  try {
    report = drift(modelAt(marker.commit), model);
  } catch (e) {
    return { ...marker, unreadable: e.message };
  }
  return {
    ...marker,
    added: report.added.length,
    removed: report.removed.length,
    restatused: report.restatused.length,
    redefined: report.redefined.length
  };
}

function writeOut(rel, text) {
  const at = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(at), { recursive: true });
  fs.writeFileSync(at, text);
  return `${rel}  ${(Buffer.byteLength(text) / 1024).toFixed(0)}kB`;
}

function today(argv) {
  const given = argv.find((a) => a.startsWith('--date='));
  return given ? given.slice('--date='.length) : new Date().toISOString().slice(0, 10);
}

function doRender(argv) {
  const model = modelNow();
  const lock = lockReading(model);
  const generatedAt = today(argv);
  const mdTarget = (argv.find((a) => a.startsWith('--markdown=')) || `--markdown=${MD_OUT}`)
    .slice('--markdown='.length);

  const written = [
    writeOut(HTML_OUT, render(model, { lock, generatedAt })),
    mdTarget === 'none' ? null : writeOut(mdTarget, renderMarkdown(model, { lock, generatedAt }))
  ].filter(Boolean);

  const glossed = model.entries.filter((e) => e.gloss || e.tier0).length;
  console.log(`vocab render: ${model.entries.length} terms, ${glossed} glossed (${
    ((glossed / model.entries.length) * 100).toFixed(1)}%)`);
  for (const line of written) console.log(`  wrote ${line}`);
  if (lock && lock.unreadable) console.log(`  lock marker unreadable: ${lock.unreadable}`);
  return 0;
}

function doLock(argv) {
  const model = modelNow();
  const marker = readLock();
  const head = git(['rev-parse', 'HEAD']);

  if (!marker) {
    console.log('vocab lock: no marker yet — nothing has been reviewed as a baseline.');
    if (!argv.includes('--advance')) {
      console.log('  re-run with --advance to set the first one at HEAD.');
      return 0;
    }
  } else {
    const report = drift(modelAt(marker.commit), model);
    console.log(`vocab lock: last locked ${marker.date} (auditRun ${marker.auditRun}) at ${
      marker.commit.slice(0, 7)}`);
    if (report.total === 0) {
      console.log('  no drift since this lock.');
    } else {
      const say = (label, list) => {
        if (!list.length) return;
        const names = list.map((x) => (typeof x === 'string' ? x : `${x.canonical} ${x.from}→${x.to}`));
        console.log(`  ${list.length} ${label}: ${names.slice(0, 8).join(', ')}${
          names.length > 8 ? `, … +${names.length - 8}` : ''}`);
      };
      say('new', report.added);
      say('withdrawn', report.removed);
      say('re-statused', report.restatused);
      say('redefined', report.redefined);
    }
    if (!argv.includes('--advance')) {
      console.log('  review the above, then re-run with --advance to move the marker.');
      return 0;
    }
  }

  const next = {
    date: today(argv),
    auditRun: marker ? (marker.auditRun || 0) + 1 : 1,
    commit: head
  };
  console.log(`  wrote ${writeOut(LOCK, JSON.stringify(next, null, 1) + '\n')}`);
  return doRender(argv);
}

function main(argv) {
  const mode = argv.find((a) => !a.startsWith('-')) || 'render';
  if (mode === 'render') return doRender(argv);
  if (mode === 'lock') return doLock(argv);
  console.error(`vocab: unknown mode "${mode}" — expected "render" or "lock".`);
  return 2;
}

if (require.main === module) process.exit(main(process.argv.slice(2)));

module.exports = { surfacePaths, modelNow, lockReading };
