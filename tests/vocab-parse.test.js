const test = require('node:test');
const assert = require('node:assert/strict');
const { parse } = require('../scripts/vocab/parse');

function inv(terms) {
  return { regenerated: '2026-07-28', auditRun: 3, terms };
}

function term(over) {
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
    ...over
  };
}

test('parse builds one entry per registered term, carrying its index fields', () => {
  const inventory = inv([term()]);
  const surfaces = [{
    path: 'DOMAIN_MAP.md',
    text: '- ✅ `Front sector` (전선 구역): the operational atom of the war model.\n'
  }];

  const model = parse({ inventory, surfaces });

  assert.equal(model.entries.length, 1);
  const entry = model.entries[0];
  assert.equal(entry.canonical, 'Front sector');
  assert.equal(entry.korean, '전선 구역');
  assert.equal(entry.birthplace, 'DOMAIN_MAP.md');
  assert.equal(entry.tier, 0);
  assert.equal(entry.status, 'AGREED');
});

// -- gloss + provenance ----------------------------------------------------
// The law keeps `Summary` going-forward-only, so most rows have none. An
// excerpt is a QUOTATION, not a summary: nobody authored it, so nobody owns
// a wrong one, and re-rendering re-quotes the current text.

function glossary(rows) {
  return [
    '| Term | Definition | Summary | Status |',
    '|---|---|---|---|',
    ...rows,
    ''
  ].join('\n');
}

test('parse excerpts the definition cell when no Summary is authored', () => {
  const inventory = inv([term({
    canonical: 'capital guard',
    korean: '근위대',
    birthplace: 'docs/features/capital/GLOSSARY.md',
    tier: 1
  })]);
  const surfaces = [{
    path: 'docs/features/capital/GLOSSARY.md',
    text: glossary([
      "| capital guard (근위대) | The capital's standing guard, land-derived. |  | **AGREED** (2026-07-10) |"
    ])
  }];

  const { gloss } = parse({ inventory, surfaces }).entries[0];

  assert.equal(gloss.source, 'excerpt');
  assert.equal(gloss.text, "The capital's standing guard, land-derived.");
});

test('parse prefers a filled Summary cell and marks it authored', () => {
  const inventory = inv([term({
    canonical: 'capital guard',
    korean: '근위대',
    birthplace: 'docs/features/capital/GLOSSARY.md',
    tier: 1
  })]);
  const surfaces = [{
    path: 'docs/features/capital/GLOSSARY.md',
    text: glossary([
      "| capital guard (근위대) | The capital's standing guard, land-derived. | The capital's own garrison. | **AGREED** (2026-07-10) |"
    ])
  }];

  const { gloss } = parse({ inventory, surfaces }).entries[0];

  assert.equal(gloss.source, 'authored');
  assert.equal(gloss.text, "The capital's own garrison.");
});

// DOMAIN_MAP carries no markdown table rows at all — its 80 native terms live
// as `- ✅ \`Term\` (표시어): …` bullets with indented continuation lines, so
// the table path cannot reach them.

test('parse excerpts a DOMAIN_MAP bullet, joining its indented continuation', () => {
  const inventory = inv([term()]);
  const surfaces = [{
    path: 'DOMAIN_MAP.md',
    text: [
      '- ✅ `Front sector` (전선 구역): the operational atom of the war model.',
      '  Hexes are its substrate.',
      '- ✅ `Usable value`: a different term entirely.',
      ''
    ].join('\n')
  }];

  const { gloss } = parse({ inventory, surfaces }).entries[0];

  assert.equal(gloss.source, 'excerpt');
  assert.equal(
    gloss.text,
    'the operational atom of the war model. Hexes are its substrate.'
  );
});

// -- the registration boundary --------------------------------------------
// The inventory is the population. Catching a defined-but-unregistered term is
// check 1's job (blocking), not the parser's — a parser that quietly adopted
// stray headings would render an unenforced vocabulary as if it were canon.

test('parse ignores a defined term that is not registered', () => {
  const inventory = inv([term()]);
  const surfaces = [{
    path: 'DOMAIN_MAP.md',
    text: [
      '- ✅ `Front sector` (전선 구역): the operational atom.',
      '- ✅ `Undocumented invention`: defined here but registered nowhere.',
      ''
    ].join('\n')
  }];

  const model = parse({ inventory, surfaces });

  assert.equal(model.entries.length, 1);
  assert.equal(model.entries[0].canonical, 'Front sector');
});

// -- anchors ---------------------------------------------------------------
// The pointer is the only citable element on the dashboard, so its target has
// to be as precise as markdown allows. Table rows and bullets are not
// linkable; the nearest enclosing heading is, so the anchor lands the reader
// in the right section rather than at the top of a 1,200-line file.

test('parse anchors a term to the nearest enclosing heading', () => {
  const inventory = inv([term({
    canonical: 'capital guard',
    korean: '근위대',
    birthplace: 'docs/features/capital/GLOSSARY.md',
    tier: 1
  })]);
  const surfaces = [{
    path: 'docs/features/capital/GLOSSARY.md',
    text: [
      '# Capital — glossary',
      '',
      '## Sealed vocabulary (CP-②)',
      '',
      '| Term | Definition | Summary | Status |',
      '|---|---|---|---|',
      '| capital guard (근위대) | The standing guard. |  | **AGREED** |',
      ''
    ].join('\n')
  }];

  const { anchor } = parse({ inventory, surfaces }).entries[0];

  assert.equal(anchor, 'docs/features/capital/GLOSSARY.md#sealed-vocabulary-cp-②');
});

test('parse anchors to the bare path when no heading precedes the row', () => {
  const inventory = inv([term()]);
  const surfaces = [{
    path: 'DOMAIN_MAP.md',
    text: '- ✅ `Front sector` (전선 구역): the operational atom.\n'
  }];

  const { anchor } = parse({ inventory, surfaces }).entries[0];

  assert.equal(anchor, 'DOMAIN_MAP.md');
});

test('parse leaves gloss null when the birthplace is outside the scanned surfaces', () => {
  const inventory = inv([term({
    canonical: 'Emergency reserve',
    korean: '예비대',
    birthplace: 'docs/features/combat-formula/MAGNITUDE.md',
    tier: 1
  })]);
  const surfaces = [{ path: 'DOMAIN_MAP.md', text: '- ✅ `Front sector`: unrelated.\n' }];

  const { gloss } = parse({ inventory, surfaces }).entries[0];

  assert.equal(gloss, null);
});

// -- inline-only terms -----------------------------------------------------
// 21 registered terms have no entry of their own at their birthplace; they are
// named inline inside another term's passage (the six value axes live inside
// `Front sector value profile`). Check 1 deliberately suppresses the orphan
// finding for exactly this case, so they are legitimate rows with no definition
// row to quote. The containing passage is quotable, but it is NOT the term's
// own definition — so it carries its own provenance value rather than being
// dressed up as one.

test('parse quotes the containing passage for a term named only inline', () => {
  const inventory = inv([term({
    canonical: 'controlWeight (control weight axis)',
    korean: null,
    birthplace: 'DOMAIN_MAP.md',
    tier: 0,
    codeIdentifier: 'controlWeight'
  })]);
  const surfaces = [{
    path: 'DOMAIN_MAP.md',
    text: [
      '- ✅ `Front sector value profile`: The Phase 1 value axes that explain why a',
      '  front sector matters: `controlWeight`, `economyValue`, and `routeValue`.',
      ''
    ].join('\n')
  }];

  const { gloss } = parse({ inventory, surfaces }).entries[0];

  assert.equal(gloss.source, 'context');
  assert.match(gloss.text, /^The Phase 1 value axes/);
  assert.equal(gloss.contextOf, 'Front sector value profile');
});

test('parse prefers a term own row over a passage that merely mentions it', () => {
  const inventory = inv([term({ canonical: 'Usable value', korean: null })]);
  const surfaces = [{
    path: 'DOMAIN_MAP.md',
    text: [
      '- ✅ `Front sector value profile`: axes, one of which feeds `Usable value`.',
      '- ✅ `Usable value`: the currently usable portion of a captured sector.',
      ''
    ].join('\n')
  }];

  const { gloss } = parse({ inventory, surfaces }).entries[0];

  assert.equal(gloss.source, 'excerpt');
  assert.equal(gloss.text, 'the currently usable portion of a captured sector.');
});

// -- ruling handles --------------------------------------------------------
// 11 terms are born in a RULINGS file, where the heading's subject is the
// ruling NUMBER and the term sits inside the holding's prose. The spec's group-B
// disposition settles the quotation: "a ruling's holding is its heading, so the
// quotation is apt either way." No structural position says "this is a term",
// which is why unregistered-term detection stays out of reach here — but the
// gloss does not need one.

test('parse excerpts the ruling heading that names a RULINGS-born term', () => {
  const inventory = inv([term({
    canonical: 'Terrain envelope',
    korean: '지형 봉투',
    birthplace: 'docs/features/force-geography/RULINGS.md',
    tier: 1,
    status: 'SEALED'
  })]);
  const surfaces = [{
    path: 'docs/features/force-geography/RULINGS.md',
    text: [
      '# Force geography — rulings',
      '',
      '## FG-① U1 one blanket — spread thin or stack deep — SEALED 2026-07-09',
      '',
      'Unrelated holding.',
      '',
      '## FG-② U1 terrain envelope — adopt the measured fort-by-class mapping — SEALED 2026-07-09, L2-measured',
      '',
      'The holding body.',
      ''
    ].join('\n')
  }];

  const { gloss, anchor } = parse({ inventory, surfaces }).entries[0];

  assert.equal(gloss.source, 'excerpt');
  assert.equal(
    gloss.text,
    'FG-② U1 terrain envelope — adopt the measured fort-by-class mapping — SEALED 2026-07-09, L2-measured'
  );
  assert.match(anchor, /^docs\/features\/force-geography\/RULINGS\.md#fg-/);
});

// -- Tier-0 summaries ------------------------------------------------------
// A promoted term's DOMAIN_MAP entry is a summary + pointer written by hand
// (single-definition rule), so it is authored by construction. For the terms
// born in prose model docs outside the scan scope it is the ONLY gloss source
// available, which is why it is a field of its own rather than folded into
// `gloss`.

test('parse reads a promoted term Tier-0 summary even when its birthplace is unscanned', () => {
  const inventory = inv([term({
    canonical: 'Emergency reserve',
    korean: '예비대',
    birthplace: 'docs/features/combat-formula/MAGNITUDE.md',
    tier: 1
  })]);
  const surfaces = [{
    path: 'DOMAIN_MAP.md',
    text: '- ✅ `Emergency reserve` (예비대): force held back for a late commitment. See MAGNITUDE M9.\n'
  }];

  const entry = parse({ inventory, surfaces }).entries[0];

  assert.equal(entry.gloss, null);
  assert.equal(
    entry.tier0.summary,
    'force held back for a late commitment. See MAGNITUDE M9.'
  );
});

test('parse leaves tier0 null for a term with no DOMAIN_MAP entry', () => {
  const inventory = inv([term({
    canonical: 'capital guard',
    korean: '근위대',
    birthplace: 'docs/features/capital/GLOSSARY.md',
    tier: 1
  })]);
  const surfaces = [{
    path: 'docs/features/capital/GLOSSARY.md',
    text: glossary(['| capital guard (근위대) | The standing guard. |  | **AGREED** |'])
  }];

  assert.equal(parse({ inventory, surfaces }).entries[0].tier0, null);
});
