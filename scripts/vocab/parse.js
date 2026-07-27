// Vocabulary dashboard — the parse stage.
// Pure: knows no HTML, touches no fs. Sources come in as already-read text
// (`{ inventory, surfaces }`); the CLI shell is the only thing that reads
// files, the same division `audit-lint.js` and `sync-docs-law.js` use.
//
// Design: docs/superpowers/specs/2026-07-28-vocab-dashboard-design.md
'use strict';

const { birthplaceRowText, splitDomainMapRows, normalizeName, nameSet } = require('../audit-lint');

// DOMAIN_MAP bullet: - ✅ `Term` (표시어): definition …   (markers ✅ ❓ ⛔)
// Kept local rather than exported from audit-lint: this one also has to reach
// past the marker, the backticked name, and the 표시어 to find where the
// definition starts, which the lint's own DM_ROW deliberately does not do.
const DM_HEAD = /^- (?:✅|❓|⛔) `([^`]+)`\s*(?:\([^)]*\))?\s*[:—-]?\s*/;

// A bolded provenance stamp opening the row, before the definition starts:
// `**user-confirmed 2026-07-05 (A-3 session)**:`. The trailing colon is what
// distinguishes it from a definition that merely begins with a bold word.
const DM_STAMP = /^\*\*[^*]+\*\*\s*:\s*/;

// Index fields are enforced elsewhere (checks 1/2/3/10/11 in audit-lint).
// parse copies them; it never re-derives or re-validates them.
const INDEX_FIELDS = [
  'canonical', 'korean', 'aliases',
  'birthplace', 'tier', 'status', 'kind',
  'codeIdentifier', 'codeRefs'
];

function entryFromRow(row) {
  const entry = {};
  for (const field of INDEX_FIELDS) entry[field] = row[field];
  return entry;
}

// A GLOSSARY table row: | Term | Definition | Summary | Status |
// The `Summary` column is going-forward only (user ruling 2026-07-27), so it
// is usually blank — which is why the definition cell is the fallback and why
// the fallback is labelled a quotation rather than dressed up as a summary.
function glossFromTableRow(rowText) {
  const cells = rowText.split('|').slice(1, -1).map((c) => c.trim());
  if (cells.length < 2) return null;
  const [, definition, summary] = cells;
  if (summary) return { text: summary, source: 'authored' };
  if (definition) return { text: definition, source: 'excerpt' };
  return null;
}

// A DOMAIN_MAP bullet block: the head line plus any indented continuation,
// already grouped by `splitDomainMapRows`. Everything after the term's own
// name and 표시어 is the definition, so the quotation starts there.
function glossFromDomainMapRow(term, domainMapText) {
  const names = nameSet(term);
  for (const row of splitDomainMapRows(domainMapText)) {
    const head = row.match(DM_HEAD);
    if (!head || !names.includes(normalizeName(head[1]))) continue;
    const text = row
      .slice(head[0].length)
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .join(' ')
      .replace(DM_STAMP, '');
    return text ? { text, source: 'excerpt' } : null;
  }
  return null;
}

// GitHub-flavoured heading slug: lowercase, punctuation dropped, spaces to
// hyphens. Unicode letters survive, which matters because headings here carry
// 한국어 and ruling numerals (`CP-②`).
function slugify(heading) {
  return heading
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-');
}

// The line the term's own row sits on, so the anchor can look upward from it.
function rowIndexOf(term, text) {
  const names = nameSet(term);
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const cell = lines[i].match(/^\| ([^|]+?) \|/);
    if (cell && names.includes(normalizeName(cell[1]))) return i;
    const head = lines[i].match(DM_HEAD);
    if (head && names.includes(normalizeName(head[1]))) return i;
    const bullet = lines[i].match(/^- \*\*([^*]+)\*\*/);
    if (bullet && names.includes(normalizeName(bullet[1]))) return i;
  }
  // No row of its own. A heading that names the term is the next best anchor —
  // this is what puts a RULINGS-born term at its ruling instead of at the top
  // of the file. Second pass only, so a real row always wins.
  for (let i = 0; i < lines.length; i++) {
    const heading = lines[i].match(/^#{2,6} (.+)$/);
    if (heading && mentions(heading[1], term)) return i;
  }
  return -1;
}

function anchorFor(term, surfacesByPath) {
  const path = term.birthplace;
  const home = surfacesByPath.get(path);
  if (!home) return path;
  const at = rowIndexOf(term, home);
  if (at < 0) return path;

  const lines = home.split('\n');
  for (let i = at; i >= 0; i--) {
    const heading = lines[i].match(/^#{1,6} (.+)$/);
    if (heading) {
      const slug = slugify(heading[1]);
      return slug ? `${path}#${slug}` : path;
    }
  }
  return path;
}

function glossFor(term, surfacesByPath) {
  const home = surfacesByPath.get(term.birthplace);
  if (!home) return null; // birthplace outside the scanned surfaces
  const rowText = birthplaceRowText(term, home);
  if (rowText) {
    const fromTable = glossFromTableRow(rowText);
    if (fromTable) return fromTable;
  }
  // Richest first: the term's own bullet, then a passage that names it, then a
  // ruling heading. Each step down is a weaker claim, and each is labelled.
  return glossFromDomainMapRow(term, home)
    || glossFromContainingPassage(term, home)
    || glossFromRulingHeading(term, home);
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Every string this term might be written as inside prose: its registered
// names plus its code identifier, which is how the value axes actually appear.
function inlineNeedles(term) {
  const raw = [term.canonical, term.korean, term.codeIdentifier, ...(term.aliases || [])]
    .filter(Boolean)
    .map((n) => n.replace(/\s*\([^)]*\)\s*$/, '').trim())
    .filter(Boolean);
  return [...new Set(raw)];
}

function mentions(text, term) {
  return inlineNeedles(term).some((needle) =>
    new RegExp(`(^|[^\\p{L}\\p{N}_])${escapeRe(needle)}($|[^\\p{L}\\p{N}_])`, 'iu').test(text));
}

// A ruling heading that names the term. The heading's subject is the ruling
// number, not the term, so no parser can enumerate terms out of this shape —
// but once the name is known, finding the ruling that states it is trivial, and
// the spec's group-B disposition takes the holding as the quotation.
function glossFromRulingHeading(term, text) {
  for (const line of text.split('\n')) {
    const heading = line.match(/^#{2,6} (.+)$/);
    if (!heading) continue;
    if (mentions(heading[1], term)) return { text: heading[1].trim(), source: 'excerpt' };
  }
  return null;
}

// Last resort. 21 registered terms are named only inside ANOTHER term's
// passage and have no row of their own; check 1's inline-name suppression is
// what makes that a legitimate state rather than an orphan. The passage is
// quotable, but it is not this term's definition — so it is labelled `context`
// and names whose passage it is, rather than passing as an `excerpt`.
function glossFromContainingPassage(term, text) {
  for (const row of splitDomainMapRows(text)) {
    const head = row.match(DM_HEAD);
    if (!head) continue;
    if (nameSet(term).includes(normalizeName(head[1]))) continue; // its own row
    const body = row.slice(head[0].length).split('\n').map((l) => l.trim()).filter(Boolean).join(' ');
    if (body && mentions(body, term)) {
      return { text: body, source: 'context', contextOf: head[1] };
    }
  }

  for (const line of text.split('\n')) {
    const cells = line.startsWith('|') ? line.split('|').slice(1, -1).map((c) => c.trim()) : null;
    if (!cells || cells.length < 2) continue;
    const [owner, definition] = cells;
    if (!definition || nameSet(term).includes(normalizeName(owner))) continue;
    if (mentions(definition, term)) {
      return { text: definition, source: 'context', contextOf: owner };
    }
  }

  return null;
}

// A promoted term's Tier-0 entry, when DOMAIN_MAP is not its birthplace. Never
// a second definition — the law makes it a summary + pointer, and the feature
// doc stays authoritative.
function tier0For(term, surfacesByPath) {
  if (term.birthplace === 'DOMAIN_MAP.md') return null;
  const domainMap = surfacesByPath.get('DOMAIN_MAP.md');
  if (!domainMap) return null;
  const found = glossFromDomainMapRow(term, domainMap);
  return found ? { summary: found.text } : null;
}

// `sources`: { inventory, surfaces } — surfaces are `{ path, text }`, the
// same shape audit-lint's `runAll` already assembles.
function parse(sources) {
  const rows = sources.inventory.terms || [];
  const surfacesByPath = new Map((sources.surfaces || []).map((s) => [s.path, s.text]));

  return {
    entries: rows.map((row) => ({
      ...entryFromRow(row),
      gloss: glossFor(row, surfacesByPath),
      tier0: tier0For(row, surfacesByPath),
      anchor: anchorFor(row, surfacesByPath)
    }))
  };
}

module.exports = { parse, INDEX_FIELDS };
