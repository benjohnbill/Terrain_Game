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

test('render shapes an authored row and an excerpted row identically', () => {
  const authored = rowFor({ gloss: { text: 'Same text.', source: 'authored' } });
  const excerpt = rowFor({ gloss: { text: 'Same text.', source: 'excerpt' } });

  assert.equal(authored, excerpt, 'authored and excerpt rows differ — provenance reached the scan layer');
});

// A `context` gloss is NOT this term's definition — it is the passage that
// names it. Seen on screen, those previews read as the term's own meaning
// (`Realm` picked up the shield-break passage; six value axes all showed their
// parent's sentence), and the row is exactly where provenance may not be shown.
// So it stays out of the preview and keeps its full attribution in the detail.
// The law permits this: a blank slot is never a demotion.

test('render withholds a context gloss from the row but keeps it in the detail', () => {
  const gloss = { text: 'The Phase 1 value axes.', source: 'context', contextOf: 'Front sector value profile' };
  const html = render(model([entry({ gloss })]), opts());
  const [row] = rowsOf(html);

  assert.doesNotMatch(row, /Phase 1 value axes/, 'a context quotation must not pose as the term definition');
  assert.match(row, /class="pre"/, 'the preview slot still exists — a blank slot, not a missing element');
  assert.match(html, /Phase 1 value axes/, 'the detail still carries the quotation');
  assert.match(html, /Front sector value profile/, 'attributed to the passage it came from');
});

test('render keeps a context row structurally identical to an unglossed row', () => {
  const context = rowFor({ gloss: { text: 'Other text.', source: 'context', contextOf: 'Elsewhere' } });
  const blank = rowFor({ gloss: null });

  assert.equal(context, blank);
});

// 108 of 247 real glosses carry markdown emphasis or backticks. Rendering
// `**AGREED**` as literal asterisks is not faithful quotation, it is unrendered
// markup — stripping the markers presents the same words in this medium.

test('render presents markdown emphasis as text, not as literal markers', () => {
  const html = render(model([
    entry({ gloss: { text: 'A **bolded** phrase with `code` and *emphasis*.', source: 'excerpt' } })
  ]), opts());

  assert.doesNotMatch(html, /\*\*bolded\*\*/);
  assert.doesNotMatch(html, /`code`/);
  assert.match(html, /A bolded phrase with code and emphasis\./);
});

// Below 720px the detail becomes a full-viewport overlay, so it needs a way
// out that does not require a keyboard — a touch device has no Escape. It is a
// plain fragment link so it works with JS disabled too.

test('render gives the detail overlay a back control that needs no JS', () => {
  const html = render(model([entry()]), opts());

  assert.match(html, /<a class="back" href="#"/, 'a fragment link, not a scripted button');
  assert.match(html, /\.pane:has\(\.detail:target\) \.back\{[^}]*display:block/,
    'and it is only shown when the overlay is up');
});

test('render strips underscore emphasis without touching snake_case identifiers', () => {
  const html = render(model([
    entry({ gloss: { text: '_Avoid_: treating hex_count as value, per front_sector rules.', source: 'excerpt' } })
  ]), opts());

  assert.doesNotMatch(html, /_Avoid_/);
  assert.match(html, /Avoid: treating hex_count as value, per front_sector rules\./);
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
