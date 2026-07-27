const test = require('node:test');
const assert = require('node:assert/strict');
const { render } = require('../scripts/vocab/render');

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
const lock = (over) => ({ date: '2026-07-26', auditRun: 3, commit: 'abc1234', ...over });
const opts = (over) => ({ lock: lock(), generatedAt: '2026-07-28', ...over });

function rowsOf(html) {
  return [...html.matchAll(/<li class="row[\s\S]*?<\/li>/g)].map((m) => m[0]);
}

const rowFor = (over, o) => rowsOf(render(model([entry(over)]), opts(o)))[0];

// -- the uniform-weight rule, as a test -----------------------------------
// Law, ritual duty 4: "Every term renders with the same primary content … so
// that a term with a hand-written Summary and one without are visually equal …
// Never sort, tier, badge, or section the file by whether a gloss exists."
// A style note cannot enforce that; this can. Provenance is the only variable
// here, so the comparison isolates it exactly.

test('render shapes the row identically whatever the gloss provenance is', () => {
  const authored = rowFor({ gloss: { text: 'Same text.', source: 'authored' } });
  const excerpt = rowFor({ gloss: { text: 'Same text.', source: 'excerpt' } });
  const context = rowFor({ gloss: { text: 'Same text.', source: 'context', contextOf: 'Some other term' } });

  assert.equal(authored, excerpt, 'authored and excerpt rows differ — provenance reached the scan layer');
  assert.equal(authored, context, 'context rows differ — provenance reached the scan layer');
});

test('render keeps gloss provenance out of the row markup entirely', () => {
  const html = render(model([
    entry({ gloss: { text: 'Quoted text.', source: 'excerpt' } })
  ]), opts());

  for (const row of rowsOf(html)) {
    assert.doesNotMatch(row, /excerpt|authored|context/i);
  }
  assert.match(html, /excerpt/i, 'provenance still belongs in the detail markup');
});

// A blank slot, never a demotion: a row with no gloss keeps every structural
// part a glossed row has, including its pointer.

test('render keeps a gloss-less row structurally whole', () => {
  const glossed = rowFor();
  const blank = rowFor({ gloss: null });

  const classesOf = (row) => [...row.matchAll(/class="([^"]+)"/g)].map((m) => m[1]).sort();
  assert.deepEqual(classesOf(blank), classesOf(glossed));
  assert.match(blank, /DOMAIN_MAP/, 'the pointer survives on an unglossed row');
});

test('render never sorts or sections the list by whether a gloss exists', () => {
  const html = render(model([
    entry({ canonical: 'Aaa', gloss: null }),
    entry({ canonical: 'Bbb' }),
    entry({ canonical: 'Ccc', gloss: null })
  ]), opts());

  const order = rowsOf(html).map((r) => r.match(/class="name">([^<]+)/)[1]);
  assert.deepEqual(order, ['Aaa', 'Bbb', 'Ccc'], 'model order must survive rendering');
});
