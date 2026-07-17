const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeName } = require('../scripts/audit-lint');
const writeLint = require('../scripts/hooks/write-lint');
const aliasInject = require('../scripts/hooks/alias-inject');

function inv(terms) {
  return { regenerated: '2026-07-10', terms };
}

function term(canonical, aliases, korean) {
  return { canonical, korean: korean || null, aliases: aliases || [], birthplace: null,
    tier: 0, status: 'AGREED', kind: 'mechanism', codeIdentifier: null, codeRefs: [],
    verdict: null, verdictRef: null };
}

// ------------------------------------------------------------ write-lint

test('write-lint: GOVERNED matches DOMAIN_MAP/SPEC/DESIGN/docs/**/js/**.js', () => {
  for (const p of ['DOMAIN_MAP.md', 'SPEC.md', 'DESIGN.md', 'docs/SYNC-DEBT.md',
    'docs/features/combat-formula/GLOSSARY.md', 'js/combat.js', 'DOCUMENTATION-LAW.md',
    '.claude/rules/documentation-law.md']) {
    assert.equal(writeLint.GOVERNED.test(p), true, p);
  }
});

test('write-lint: GOVERNED does not match unrelated files', () => {
  for (const p of ['README.md', 'package.json', 'mockup/combat-calc/NOTES.md', 'index.html']) {
    assert.equal(writeLint.GOVERNED.test(p), false, p);
  }
});

test('write-lint: relPath strips the repo root prefix from an absolute path', () => {
  assert.equal(writeLint.relPath('/repo', '/repo/DOMAIN_MAP.md'), 'DOMAIN_MAP.md');
  assert.equal(writeLint.relPath('/repo', '/repo/docs/features/x/GLOSSARY.md'),
    'docs/features/x/GLOSSARY.md');
});

test('write-lint: relPath leaves an already-relative path alone', () => {
  assert.equal(writeLint.relPath('/repo', 'DOMAIN_MAP.md'), 'DOMAIN_MAP.md');
});

test('write-lint: relPath returns null for a missing path', () => {
  assert.equal(writeLint.relPath('/repo', null), null);
  assert.equal(writeLint.relPath('/repo', undefined), null);
});

// Host portability: Claude sends tool_input.file_path; Codex routes edits
// through apply_patch and sends the patch text as tool_input.command instead.

test('write-lint: touchedPaths reads the Claude shape (tool_input.file_path)', () => {
  assert.deepEqual(writeLint.touchedPaths({ tool_input: { file_path: '/repo/DOMAIN_MAP.md' } }),
    ['/repo/DOMAIN_MAP.md']);
});

test('write-lint: touchedPaths reads the Codex apply_patch shape, including multi-file patches', () => {
  const command = [
    '*** Begin Patch',
    '*** Update File: DOMAIN_MAP.md',
    '@@ -1 +1 @@',
    '-a',
    '+b',
    '*** Add File: docs/features/x/GLOSSARY.md',
    '*** Delete File: js/old.js',
    '*** End Patch',
  ].join('\n');
  assert.deepEqual(writeLint.touchedPaths({ tool_input: { command } }),
    ['DOMAIN_MAP.md', 'docs/features/x/GLOSSARY.md', 'js/old.js']);
});

test('write-lint: patchPaths captures a rename destination (*** Move to:)', () => {
  const command = '*** Begin Patch\n*** Update File: docs/a.md\n*** Move to: docs/b.md\n*** End Patch';
  assert.deepEqual(writeLint.patchPaths(command), ['docs/a.md', 'docs/b.md']);
});

test('write-lint: patchPaths is reusable — module-level /g regexes reset between calls', () => {
  const command = '*** Begin Patch\n*** Update File: DOMAIN_MAP.md\n*** End Patch';
  assert.deepEqual(writeLint.patchPaths(command), ['DOMAIN_MAP.md']);
  assert.deepEqual(writeLint.patchPaths(command), ['DOMAIN_MAP.md'], 'second call must match too');
});

test('write-lint: touchedPaths is empty for a payload with neither shape (e.g. a Bash command)', () => {
  assert.deepEqual(writeLint.touchedPaths({ tool_input: { command: 'npm test' } }), []);
  assert.deepEqual(writeLint.touchedPaths({}), []);
  assert.deepEqual(writeLint.touchedPaths(null), []);
});

// ---------------------------------------------------------- alias-inject

test('alias-inject: exact alias match (including 구칭 old-canonical name) is detected', () => {
  const inventory = inv([term('Force limit', ['National cap', 'national cap growth'])]);
  const hits = aliasInject.findMatches('can we revisit the National cap value?', inventory, normalizeName);
  assert.equal(hits.length, 1);
  assert.equal(hits[0].canonical, 'Force limit');
  assert.equal(hits[0].matched, 'National cap');
});

test('alias-inject: prompt already using the canonical name produces no hit', () => {
  const inventory = inv([term('Force limit', ['National cap'])]);
  const hits = aliasInject.findMatches('what should the force limit be here?', inventory, normalizeName);
  assert.equal(hits.length, 0);
});

test('alias-inject: no match on unrelated prompt text', () => {
  const inventory = inv([term('Force limit', ['National cap'])]);
  const hits = aliasInject.findMatches('how is the weather today', inventory, normalizeName);
  assert.equal(hits.length, 0);
});

test('alias-inject: common-word scoping — an unregistered word never fires (S9/c: "gold" not an alias of Treasury)', () => {
  const inventory = inv([term('Treasury', [])]);
  const hits = aliasInject.findMatches('I found a gold coin in my pocket', inventory, normalizeName);
  assert.equal(hits.length, 0);
});

test('alias-inject: word-boundary matching — a substring inside a longer word does not match', () => {
  const inventory = inv([term('Force limit', ['cap'])]);
  const hits = aliasInject.findMatches('put on your baseball cap', inventory, normalizeName);
  // "cap" IS a real whole-word match here — this fixture checks the boundary
  // rejects a longer containing word instead
  assert.equal(hits.length, 1);
  const hits2 = aliasInject.findMatches('the capital city is large', inventory, normalizeName);
  assert.equal(hits2.length, 0, '"cap" must not match inside "capital"');
});

test('alias-inject: multi-word alias detected as a phrase', () => {
  const inventory = inv([term('Aging constitution', ['anti-stalemate ratchet'], '노화 헌법')]);
  const hits = aliasInject.findMatches('lets tune the anti-stalemate ratchet curve', inventory, normalizeName);
  assert.equal(hits.length, 1);
  assert.equal(hits[0].canonical, 'Aging constitution');
  assert.equal(hits[0].korean, '노화 헌법');
});

test('alias-inject: caps at MAX_MATCHES (3) even when more terms match', () => {
  const inventory = inv([
    term('Alpha term', ['alphaalias']),
    term('Beta term', ['betaalias']),
    term('Gamma term', ['gammaalias']),
    term('Delta term', ['deltaalias'])
  ]);
  const hits = aliasInject.findMatches('alphaalias betaalias gammaalias deltaalias', inventory, normalizeName);
  assert.equal(hits.length, 3);
});

test('alias-inject: dedupes multiple aliases of the same term to one hit', () => {
  const inventory = inv([term('Force limit', ['National cap', 'national cap growth'])]);
  const hits = aliasInject.findMatches('National cap and national cap growth both appear here', inventory, normalizeName);
  assert.equal(hits.length, 1);
});

test('alias-inject: short common-length names below MIN_LEN are excluded from matching', () => {
  const inventory = inv([term('M9 reserve', ['M9'])]); // 2-char ascii alias, below MIN_LEN.ascii=3
  const hits = aliasInject.findMatches('deploy the M9 unit now', inventory, normalizeName);
  assert.equal(hits.length, 0);
});

test('alias-inject: Korean alias matches by substring', () => {
  const inventory = inv([term('Aging constitution', [], '노화 헌법')]);
  const hits = aliasInject.findMatches('노화 헌법 다이얼을 조정하자', inventory, normalizeName);
  assert.equal(hits.length, 1);
});
