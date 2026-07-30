const test = require('node:test');
const assert = require('node:assert/strict');
const { parsePlans } = require('../scripts/vocab/plans');

// An operation plan is a schema'd record (ADR 0024), not a word you look up.
// The design spec's group-A disposition: "the 13 plans render as a separate
// plans panel with schema columns, not as term rows." These are the columns.

const CATALOG = [
  '# Operation plan catalog',
  '',
  '## Attack',
  '',
  '### Swift Seizure (신속 점령) — shape COMPLETE (template plan)',
  '',
  '**Real-war identity.** Take the sector quickly, before the enemy digs in.',
  'Tempo first.',
  '',
  '**Effect axes (shape).**',
  '',
  '| Axis | Shape | Why |',
  '|---|---|---|',
  '| `controlShift` | core | Taking the sector is the reason to exist. |',
  '| `garrisonDamage` | secondary | Defenders are broken as needed. |',
  '| `routeDisruption` | none | Routes are not the objective. |',
  '',
  '**Risk character.** High. The plan buys tempo with exposure.',
  '',
  '**Availability (shape).** Physical gates only: enemy or contested sector.',
  '',
  '### Deliberate Pressure (신중 압박) — shape COMPLETE',
  '',
  '**Real-war identity.** Methodical reduction.',
  '',
  '**Risk character.** Low. Under-commitment slows progress.',
  ''
].join('\n');

test('parsePlans reads one record per plan heading', () => {
  const plans = parsePlans(CATALOG);

  assert.deepEqual(plans.map((p) => p.name), ['Swift Seizure', 'Deliberate Pressure']);
  assert.equal(plans[0].korean, '신속 점령');
});

test('parsePlans splits effect axes by shape and drops the ones marked none', () => {
  const [swift] = parsePlans(CATALOG);

  assert.deepEqual(swift.effectAxes.core, ['controlShift']);
  assert.deepEqual(swift.effectAxes.secondary, ['garrisonDamage']);
  assert.deepEqual(swift.effectAxes.none, ['routeDisruption']);
});

// Risk is NOT a level. Measured across the real catalog, five of twelve records
// open with a bare level word and seven are prose ("The highest in the
// catalog…", "Lowest operational risk…"). Normalising that would be invention,
// so the author's own text is carried through.

test('parsePlans carries risk as the author text, not a normalised level', () => {
  const [swift, deliberate] = parsePlans(CATALOG);

  assert.equal(swift.risk, 'High. The plan buys tempo with exposure.');
  assert.equal(deliberate.risk, 'Low. Under-commitment slows progress.');
});

test('parsePlans matches labels by stem, so a parenthetical does not hide a field', () => {
  const text = [
    '### Scorched Earth (청야 소각) — shape COMPLETE',
    '',
    '**Availability (shape, user-confirmed 2026-07-02).** Own sector, before it falls.',
    ''
  ].join('\n');

  assert.equal(parsePlans(text)[0].availability, 'Own sector, before it falls.');
});

// One heading declares two plans: `Strategic Abandonment (전략적 포기) +
// Scorched Earth (청야 소각)`, and the section carries `(청야)`-scoped fields
// for the second alongside shared ones. Both must come out as records.

test('parsePlans splits a two-plan heading and routes 한국어-scoped fields', () => {
  const text = [
    '### Strategic Abandonment (전략적 포기) + Scorched Earth (청야 소각) — shape COMPLETE',
    '',
    '**Real-war identity.** Give the ground up deliberately.',
    '',
    '**Real-war identity (청야).** Burn what you leave behind.',
    ''
  ].join('\n');

  const plans = parsePlans(text);

  assert.deepEqual(plans.map((p) => p.name), ['Strategic Abandonment', 'Scorched Earth']);
  assert.equal(plans[0].identity, 'Give the ground up deliberately.');
  assert.equal(plans[1].identity, 'Burn what you leave behind.');
});

test('parsePlans keeps availability and identity as text', () => {
  const [swift] = parsePlans(CATALOG);

  assert.match(swift.availability, /^Physical gates only/);
  assert.match(swift.identity, /^Take the sector quickly/);
  assert.match(swift.identity, /Tempo first\.$/, 'wrapped lines are joined');
});

test('parsePlans leaves absent fields null rather than guessing', () => {
  const [, deliberate] = parsePlans(CATALOG);

  assert.equal(deliberate.availability, null);
  assert.deepEqual(deliberate.effectAxes, { core: [], secondary: [], none: [] });
});

test('parsePlans ignores non-plan headings', () => {
  const plans = parsePlans('# Title\n\n## Attack\n\nprose\n');
  assert.deepEqual(plans, []);
});
