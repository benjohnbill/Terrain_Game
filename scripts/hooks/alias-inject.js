// UserPromptSubmit hook — doc-governance promotion chain (c).
// Mechanizes the exact-match slice of documentation-law's "conversational
// term alignment" rule: when the prompt contains a string that exactly
// matches a registered term/alias (including 구칭 old-canonical names),
// inject a note naming the canonical term. Advisory only — never blocks,
// never decides whether alignment should actually fire. That judgment
// (exploration-exemption vs. heading-to-a-seal, history-context vs. live
// usage) stays with the agent per documentation-law S13 (mechanization
// applies the law, it does not replace judgment). Matching reuses
// scripts/audit-lint.js's normalizeName so there is one definition of
// "what counts as the same name," not two drifting copies.
'use strict';

const MAX_MATCHES = 3;
const MIN_LEN = { ascii: 3, other: 2 };

function isAsciiOnly(s) {
  return /^[\x00-\x7f]*$/.test(s);
}

function containsWholeMatch(text, name) {
  if (!name) return false;
  if (isAsciiOnly(name)) {
    const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(?<![A-Za-z0-9])${esc}(?![A-Za-z0-9])`, 'i');
    return re.test(text);
  }
  return text.includes(name); // Korean/mixed: no reliable \b, substring is the practical match
}

// candidate names, longest first (a multi-word alias should out-rank its
// own substrings before we dedupe by canonical); skips already-canonical
// hits (nothing to align) and common-word noise below MIN_LEN.
function findMatches(prompt, inventory, normalizeName) {
  const candidates = [];
  for (const t of inventory.terms || []) {
    const names = [t.canonical, t.korean, ...(t.aliases || [])].filter(Boolean);
    for (const n of names) {
      const minLen = isAsciiOnly(n) ? MIN_LEN.ascii : MIN_LEN.other;
      if (n.length < minLen) continue;
      candidates.push({ name: n, term: t });
    }
  }
  candidates.sort((a, b) => b.name.length - a.name.length);

  const seen = new Set();
  const hits = [];
  for (const c of candidates) {
    if (seen.has(c.term.canonical)) continue;
    if (!containsWholeMatch(prompt, c.name)) continue;
    seen.add(c.term.canonical);
    if (normalizeName(c.name) === normalizeName(c.term.canonical)) continue; // already canonical, no note needed
    hits.push({ matched: c.name, canonical: c.term.canonical, korean: c.term.korean });
    if (hits.length >= MAX_MATCHES) break;
  }
  return hits;
}

function formatContext(hits) {
  const lines = hits.map(h =>
    `"${h.matched}" -> canonical "${h.canonical}"${h.korean ? ` (${h.korean})` : ''}`);
  return `conversational term alignment (documentation-law): registered alias(es) detected in this prompt:\n` +
    lines.join('\n') +
    `\nExploration exemption applies — if this is brainstorming or a reference to history/an old ` +
    `doc, ignore. If the statement is heading toward a seal, echo the canonical name once and continue with it.`;
}

function main() {
  const fs = require('fs');
  const path = require('path');

  let raw = '';
  try {
    raw = fs.readFileSync(0, 'utf8');
  } catch (e) {
    return;
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    return;
  }

  const prompt = data.prompt || data.message || data.text || '';
  if (!prompt || prompt.length < 2) return;

  const root = process.cwd();
  const inventoryPath = path.join(root, 'docs/audits/term-inventory.json');
  if (!fs.existsSync(inventoryPath)) return;

  let inventory;
  try {
    inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
  } catch (e) {
    return;
  }

  const { normalizeName } = require(path.join(root, 'scripts/audit-lint.js'));
  const hits = findMatches(prompt, inventory, normalizeName);
  if (!hits.length) return;

  const result = {
    hookSpecificOutput: {
      hookEventName: 'UserPromptSubmit',
      additionalContext: formatContext(hits)
    }
  };
  process.stdout.write(JSON.stringify(result));
}

if (require.main === module) {
  try {
    main();
  } catch (e) {
    // swallow — never let the hook break prompt submission
  }
}

module.exports = { containsWholeMatch, findMatches, isAsciiOnly };
