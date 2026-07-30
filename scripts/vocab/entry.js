// Vocabulary dashboard — derivations over a model entry.
// Pure, dependency-free. Both renderers need the same two answers, and having
// them in one place is what stops the HTML and the markdown from disagreeing
// about what a term's gloss IS.
'use strict';

// Which text a surface should show for this term, and where it came from.
// Falls back to the Tier-0 summary because for terms born in prose model docs
// outside the scan scope that summary is the only text there is — and it is
// authored by construction (the law makes a DOMAIN_MAP entry a hand-written
// summary + pointer).
//
// `drift` deliberately does NOT use this: it compares gloss and tier0 as two
// independent slots, because a change in either is a real movement even when
// the displayed text would not change.
function displayGloss(entry) {
  if (entry.gloss) return entry.gloss;
  if (entry.tier0) return { text: entry.tier0.summary, source: 'authored' };
  return null;
}

// Every string this term answers to. Callers transform it for their own use:
// regex needles when scanning prose, a lowercase haystack when searching.
function namesOf(entry) {
  const raw = [entry.canonical, entry.korean, entry.codeIdentifier, ...(entry.aliases || [])]
    .filter(Boolean)
    .map((name) => name.replace(/\s*\([^)]*\)\s*$/, '').trim())
    .filter(Boolean);
  return [...new Set(raw)];
}

module.exports = { displayGloss, namesOf };
