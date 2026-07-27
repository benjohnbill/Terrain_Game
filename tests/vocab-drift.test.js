const test = require('node:test');
const assert = require('node:assert/strict');
const { drift } = require('../scripts/vocab/drift');

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

// An unchanged pair must be silent. The lock panel reads this report, so a
// report that cannot say "nothing moved" turns the lock into noise.

test('drift reports nothing for an unchanged pair', () => {
  const before = model([entry(), entry({ canonical: 'Usable value', korean: null })]);
  const after = model([entry(), entry({ canonical: 'Usable value', korean: null })]);

  const report = drift(before, after);

  assert.deepEqual(report.added, []);
  assert.deepEqual(report.removed, []);
  assert.deepEqual(report.restatused, []);
  assert.deepEqual(report.redefined, []);
  assert.equal(report.total, 0);
});

test('drift names terms registered and terms withdrawn since the lock', () => {
  const before = model([entry(), entry({ canonical: 'Retired term' })]);
  const after = model([entry(), entry({ canonical: 'Fatigue ledger' })]);

  const report = drift(before, after);

  assert.deepEqual(report.added, ['Fatigue ledger']);
  assert.deepEqual(report.removed, ['Retired term']);
  assert.equal(report.total, 2);
});

// Status is the NAME axis only (ruled 2026-07-15), and 92% of registered terms
// sit at AGREED. A re-status is therefore rare and worth naming both ends of.

test('drift reports a re-status with both ends named', () => {
  const before = model([entry({ status: 'PROPOSED' })]);
  const after = model([entry({ status: 'AGREED' })]);

  const report = drift(before, after);

  assert.deepEqual(report.restatused, [
    { canonical: 'Front sector', from: 'PROPOSED', to: 'AGREED' }
  ]);
  assert.equal(report.total, 1);
});

test('drift does not call a re-status a redefinition', () => {
  const before = model([entry({ status: 'PROPOSED' })]);
  const after = model([entry({ status: 'SEALED' })]);

  assert.deepEqual(drift(before, after).redefined, []);
});

// -- redefinition ----------------------------------------------------------
// Definition text is the one axis with no enforcement behind it: 75 commits in
// 30 days touched DOMAIN_MAP or a feature GLOSSARY, all of it ungated by
// design. Binary "changed at all", not a diff-size threshold — a threshold
// would need a justification nobody has.

test('drift reports a changed definition text as redefined', () => {
  const before = model([entry({ gloss: { text: 'the operational atom.', source: 'excerpt' } })]);
  const after = model([entry({ gloss: { text: 'the operational atom, re-cut.', source: 'excerpt' } })]);

  assert.deepEqual(drift(before, after).redefined, ['Front sector']);
});

test('drift ignores a definition that did not move', () => {
  const before = model([entry()]);
  const after = model([entry({ anchor: 'DOMAIN_MAP.md#renamed-section' })]);

  assert.deepEqual(drift(before, after).redefined, []);
});

test('drift reports a gloss that appeared or vanished', () => {
  const none = model([entry({ gloss: null })]);
  const some = model([entry()]);

  assert.deepEqual(drift(none, some).redefined, ['Front sector']);
  assert.deepEqual(drift(some, none).redefined, ['Front sector']);
});

test('drift reports a changed Tier-0 summary as redefined', () => {
  const before = model([entry({ tier0: { summary: 'held back for a late commitment.' } })]);
  const after = model([entry({ tier0: { summary: 'held back; auto-answers an attack.' } })]);

  assert.deepEqual(drift(before, after).redefined, ['Front sector']);
});

test('drift counts one term once even when several axes moved', () => {
  const before = model([entry({ status: 'PROPOSED', gloss: { text: 'old.', source: 'excerpt' } })]);
  const after = model([entry({ status: 'AGREED', gloss: { text: 'new.', source: 'excerpt' } })]);

  const report = drift(before, after);

  assert.deepEqual(report.restatused.map((r) => r.canonical), ['Front sector']);
  assert.deepEqual(report.redefined, ['Front sector']);
  assert.equal(report.total, 2); // two movements, reported on their own axes
});
