const test = require('node:test');
const assert = require('node:assert/strict');
const { renderMarkdown } = require('../scripts/vocab/markdown');

function entry(over) {
  return {
    canonical: 'Front sector',
    korean: '전선 구역',
    aliases: [],
    birthplace: 'DOMAIN_MAP.md',
    tier: 0,
    status: 'AGREED',
    kind: 'mechanism',
    codeIdentifier: null,
    codeRefs: [],
    gloss: { text: 'the operational atom of the war model.', source: 'excerpt' },
    tier0: null,
    anchor: 'DOMAIN_MAP.md#core-terms',
    ...over
  };
}

const model = (entries) => ({ entries });
const opts = (over) => ({
  generatedAt: '2026-07-28',
  lock: { date: '2026-07-26', auditRun: 3, commit: 'abc1234' },
  ...over
});

const linesFor = (entries, o) =>
  renderMarkdown(model(entries), opts(o)).split('\n').filter((l) => l.startsWith('- '));

// The law names `docs/GLOSSARY-QUICKREF.md` by path, so uniform weight binds
// this output too — it is not an HTML-only rule.

test('markdown gives every term the same primary content', () => {
  const [a, b] = linesFor([
    entry({ canonical: 'A term', gloss: { text: 'Same.', source: 'authored' } }),
    entry({ canonical: 'B term', gloss: { text: 'Same.', source: 'excerpt' } })
  ]);

  assert.equal(a.replace(/A term/g, 'TERM'), b.replace(/B term/g, 'TERM'));
});

test('markdown leaves an unglossed term a blank slot, not a shorter row', () => {
  const [glossed, blank] = linesFor([
    entry({ canonical: 'A term' }),
    entry({ canonical: 'B term', gloss: null })
  ]);

  for (const line of [glossed, blank]) {
    assert.match(line, /`[^`]+`/, 'the canonical name is present');
    assert.match(line, /DOMAIN_MAP\.md/, 'the pointer is present');
    assert.match(line, /AGREED/, 'the status is present');
  }
  assert.doesNotMatch(blank, /\bTBD\b|—\s*$|\(no gloss\)/i);
});

test('markdown preserves model order regardless of gloss presence', () => {
  const lines = linesFor([
    entry({ canonical: 'Aaa', gloss: null }),
    entry({ canonical: 'Bbb' }),
    entry({ canonical: 'Ccc', gloss: null })
  ]);

  assert.deepEqual(
    lines.map((l) => l.match(/`([^`]+)`/)[1]),
    ['Aaa', 'Bbb', 'Ccc']
  );
});

// The header is what makes this file honest about its own staleness: it is
// written on invocation, but it is only REVIEWED at a lock.

test('markdown header declares both dates and its own non-citability', () => {
  const out = renderMarkdown(model([entry()]), opts());

  assert.match(out, /Last regenerated: 2026-07-28/);
  assert.match(out, /2026-07-26/, 'the lock date is stated too');
  assert.match(out, /do not edit by hand/i);
  assert.match(out, /none of it is citable/i, 'glosses must declare themselves non-citable');
  assert.match(out, /pointer is the citable part/i, 'and must say where the authority is');
});

test('markdown counts itself in grammatical English', () => {
  const one = renderMarkdown(model([entry()]), opts());
  const two = renderMarkdown(model([entry(), entry({ canonical: 'Other' })]), opts());

  assert.match(one, /1 registered term across 1 definition surface\./);
  assert.match(two, /2 registered terms across 1 definition surface\./);
});

test('markdown quotes a context gloss with its provenance named', () => {
  const out = renderMarkdown(model([
    entry({ gloss: { text: 'The Phase 1 value axes.', source: 'context', contextOf: 'Front sector value profile' } })
  ]), opts());

  assert.match(out, /Front sector value profile/);
});
