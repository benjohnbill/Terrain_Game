// Vocabulary dashboard — the markdown output.
// Pure: a model in, one markdown string out. The agent-facing half of the pair
// decided on 2026-07-28: the HTML is the user's only surface and must be
// designed; this one exists to be tracked, greppable, and reachable in context.
//
// It deliberately does NOT mirror the HTML's layout. The two-layer scan/detail
// split is a device for satisfying uniform weight on a SCREEN; in markdown, one
// line per term carrying the same fields satisfies the law directly. The law
// names `docs/GLOSSARY-QUICKREF.md` by path, so uniform weight binds here too:
// `tests/vocab-markdown.test.js` holds it.
//
// Composition: docs/superpowers/specs/2026-07-28-vocab-dashboard-composition.md
'use strict';

// `Last regenerated:` is the string `audit-lint`'s checkFreshness reads
// (scripts/audit-lint.js `checkFreshness`). Changing its shape breaks the
// `stale-quickref` advisory, so it stays verbatim.
function header(opts) {
  const lock = opts.lock;
  const lockLine = lock
    ? `> **Last locked: ${lock.date}**${lock.auditRun != null ? ` (auditRun ${lock.auditRun})` : ''}${lock.commit ? ` at \`${String(lock.commit).slice(0, 7)}\`` : ''} — the review anchor. Drift since then is read from the dashboard's lock panel, not from this file.`
    : '> **No lock marker yet** — nothing has been reviewed as a baseline.';

  return [
    '# Vocabulary index — generated',
    '',
    '> **Generated file. Do not edit by hand.** Written on invocation of the',
    '> `doc-audit` skill; never by a hook. Every gloss here is a **quotation or a',
    '> summary, and none of it is citable** — the pointer is the citable part, and',
    '> the definition at that pointer is the only authority (documentation law,',
    '> single-definition rule).',
    '>',
    '> One line per registered term, all of them at **equal weight**: a missing',
    '> gloss is a blank slot, never a demotion, and nothing here is sorted,',
    '> tiered, badged, or sectioned by whether a gloss exists.',
    '>',
    `> Last regenerated: ${opts.generatedAt}`,
    lockLine,
    ''
  ].join('\n');
}

// One line, same fields for every term, in model order.
function line(entry) {
  const korean = entry.korean ? ` (${entry.korean})` : '';
  const gloss = entry.gloss || (entry.tier0 ? { text: entry.tier0.summary, source: 'authored' } : null);

  // Provenance is named for the one case where the quotation is NOT the term's
  // own definition. Naming it is what keeps the excerpt strategy honest.
  const attributed = gloss && gloss.source === 'context'
    ? ` — *quoted from the passage on ${gloss.contextOf}, not this term's own definition:* ${gloss.text}`
    : gloss ? ` — ${gloss.text}` : '';

  return `- \`${entry.canonical}\`${korean} · ${entry.status} · T${entry.tier} → \`${entry.anchor}\`${attributed}`;
}

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

function renderMarkdown(model, opts) {
  const options = opts || {};
  const entries = model.entries || [];
  const sources = new Set(entries.map((e) => e.birthplace));

  return [
    header({ generatedAt: options.generatedAt, lock: options.lock }),
    `${plural(entries.length, 'registered term')} across ${plural(sources.size, 'definition surface')}.`,
    '',
    ...entries.map(line),
    ''
  ].join('\n');
}

module.exports = { renderMarkdown };
