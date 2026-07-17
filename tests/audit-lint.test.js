const test = require('node:test');
const assert = require('node:assert/strict');
const lint = require('../scripts/audit-lint');

function inv(terms) {
  return { regenerated: '2026-07-10', terms };
}

// ---------------------------------------------------------------- check 1
// Definition-surface header diff: term headers parsed from structured
// surfaces (DOMAIN_MAP bullet rows, GLOSSARY table rows) vs inventory.

test('headerDiff flags a DOMAIN_MAP-defined term missing from the inventory', () => {
  const inventory = inv([{ canonical: 'Force limit', aliases: [], korean: null }]);
  const surfaces = [{
    path: 'DOMAIN_MAP.md',
    text: '- ✅ `Force limit` (군단 한계): summary.\n- ✅ `War weariness`: used as if established.\n'
  }];
  const findings = lint.checkHeaderDiff(inventory, surfaces);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].kind, 'unregistered-definition');
  assert.equal(findings[0].term, 'War weariness');
  assert.equal(findings[0].path, 'DOMAIN_MAP.md');
});

test('headerDiff flags an inventory term whose header exists on no surface', () => {
  const inventory = inv([
    { canonical: 'Force limit', aliases: [], korean: null, birthplace: 'DOMAIN_MAP.md' },
    { canonical: 'Phantom term', aliases: [], korean: null, birthplace: 'DOMAIN_MAP.md' }
  ]);
  const surfaces = [
    { path: 'DOMAIN_MAP.md', text: '- ✅ `Force limit`: summary.\n' }
  ];
  const findings = lint.checkHeaderDiff(inventory, surfaces);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].kind, 'orphaned-inventory-row');
  assert.equal(findings[0].term, 'Phantom term');
});

test('headerDiff matches via aliases and GLOSSARY table headers (no false positive)', () => {
  const inventory = inv([
    { canonical: 'Impassable terrain', aliases: ['Void terrain'], korean: '공백 지형' }
  ]);
  const surfaces = [{
    path: 'docs/features/terrain-cradle/GLOSSARY.md',
    text: '| Term | Definition | Status |\n|---|---|---|\n| Impassable terrain (공백 지형 · 구칭 void terrain) | Sea expressed as land. | AGREED |\n'
  }];
  assert.deepEqual(lint.checkHeaderDiff(inventory, surfaces), []);
});

// ---------------------------------------------------------------- check 2
// Code contract: rows claiming codeRefs must have the identifier present.

test('codeContract flags a row whose identifier is absent from its claimed files', () => {
  const inventory = inv([{
    canonical: 'Action capacity', aliases: [],
    codeIdentifier: 'actionCapacity', codeRefs: ['js/capacity.js']
  }]);
  const jsFiles = { 'js/capacity.js': 'const capacity = { used: 0 };' };
  const findings = lint.checkCodeContract(inventory, jsFiles);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].kind, 'code-contract-violation');
  assert.equal(findings[0].term, 'Action capacity');
});

test('codeContract skips design-ahead-of-code rows (empty codeRefs) and passes real matches', () => {
  const inventory = inv([
    { canonical: 'Projectable mass', aliases: [], codeIdentifier: 'projectableMass', codeRefs: [] },
    { canonical: 'Treasury', aliases: [], codeIdentifier: 'treasury', codeRefs: ['js/econ.js'] }
  ]);
  const jsFiles = { 'js/econ.js': 'faction.treasury += yieldNow;' };
  assert.deepEqual(lint.checkCodeContract(inventory, jsFiles), []);
});

// ---------------------------------------------------------------- check 3
// Status-marker cross-check: DOMAIN_MAP ✅/❓/⛔ vs inventory status.

test('statusMarkers flags a ❓ row whose inventory status is not PROPOSED (the 블라인드 case)', () => {
  const inventory = inv([{ canonical: 'Blinds', aliases: [], korean: '블라인드', status: 'SUPERSEDED' }]);
  const domainMap = '- ❓ `Blinds` (블라인드): mechanism undecided.\n';
  const findings = lint.checkStatusMarkers(inventory, domainMap);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].kind, 'status-marker-mismatch');
  assert.equal(findings[0].term, 'Blinds');
  assert.equal(findings[0].marker, '❓');
  assert.equal(findings[0].status, 'SUPERSEDED');
});

test('statusMarkers accepts matching pairs (✅/AGREED, ❓/PROPOSED)', () => {
  const inventory = inv([
    { canonical: 'Force limit', aliases: [], status: 'AGREED' },
    { canonical: 'Mature-state start', aliases: [], status: 'PROPOSED' }
  ]);
  const domainMap = '- ✅ `Force limit`: summary.\n- ❓ `Mature-state start`: draft.\n';
  assert.deepEqual(lint.checkStatusMarkers(inventory, domainMap), []);
});

// ---------------------------------------------------------------- check 4
// Numeric restatement (narrowed per cold review): flag a DOMAIN_MAP row only
// when it BOTH points at an owning doc AND carries a dial-pattern number.

test('numericRestatement flags a row with a pointer AND a dial value', () => {
  const row = '- ✅ `Conscription register`: land-derived (registerPerPop 1,800 × Σ pop). Values: MAGNITUDE M13.';
  const findings = lint.checkNumericRestatement(row);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].kind, 'numeric-restatement');
  assert.equal(findings[0].term, 'Conscription register');
});

test('numericRestatement ignores dates, ruling refs, and ADR numbers (false-positive traps)', () => {
  const rows = [
    '- ✅ `Blinds`: superseded 2026-07-08 (MT-⑤). History: match-arc GLOSSARY / RULINGS MT-⑤.',
    '- ✅ `Usable value`: recovers per stable turn. Values: ADR 0022; ripening: RULINGS DT-②.'
  ].join('\n');
  assert.deepEqual(lint.checkNumericRestatement(rows), []);
});

test('numericRestatement ignores a dial value with NO pointer (single-definition home itself)', () => {
  const row = '- ✅ `Some native term`: the floor is 1,000 exactly, defined here.';
  assert.deepEqual(lint.checkNumericRestatement(row), []);
});

// ---------------------------------------------------------------- check 8
// ADR stamp duty: a Production doc saying "amends ADR NNNN" requires the
// target ADR header to carry an "Amended by" stamp.

test('adrStampDuty flags an amends-claim whose target ADR header is unstamped', () => {
  const production = [{ path: 'docs/features/match-arc/GLOSSARY.md', text: 'garrison regen now bills the register — amends ADR 0014 free auto-regen.' }];
  const adrs = { '0014': '# ADR 0014: Garrisons\n\nDate: 2026-06-29\n\nStatus: Accepted\n\n## Context' };
  const findings = lint.checkAdrStampDuty(production, adrs);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].kind, 'unstamped-adr-amendment');
  assert.equal(findings[0].adr, '0014');
  assert.equal(findings[0].path, 'docs/features/match-arc/GLOSSARY.md');
});

test('adrStampDuty passes when the target header carries an Amended by stamp', () => {
  const production = [{ path: 'docs/features/match-arc/GLOSSARY.md', text: 'amends ADR 0014 free auto-regen.' }];
  const adrs = { '0014': '# ADR 0014\n\nStatus: Accepted\nAmended by: match-arc RULINGS MT-① (2026-07-07)\n' };
  assert.deepEqual(lint.checkAdrStampDuty(production, adrs), []);
});

// ---------------------------------------------------------------- check 5
// Ledger currency: an Open SYNC-DEBT row whose distinctive title token
// appears in a commit subject AFTER its registration date is possibly paid.

test('ledgerCurrency flags an Open row overtaken by a later commit', () => {
  const ledger = '- [ ] **Conquest-growth implementation owed** (registered 2026-07-09): numbers deferred.\n';
  const commits = [{ date: '2026-07-10', subject: 'feat(match-arc): conquest-growth ripening wired into transfers' }];
  const findings = lint.checkLedgerCurrency(ledger, commits);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].kind, 'ledger-possibly-paid');
  assert.match(findings[0].row, /Conquest-growth/);
});

test('ledgerCurrency ignores commits that predate the row registration', () => {
  const ledger = '- [ ] **Conquest-growth implementation owed** (registered 2026-07-10): numbers deferred.\n';
  const commits = [{ date: '2026-07-09', subject: 'feat: conquest-growth groundwork' }];
  assert.deepEqual(lint.checkLedgerCurrency(ledger, commits), []);
});

// A token shared by several row titles identifies none of them, so a commit
// carrying only that shared word must not flag any of them (the "wayfinder"
// permanent-false-positive that held lint:docs red until 2026-07-17).
test('ledgerCurrency does not fire on a token shared across rows', () => {
  const ledger = [
    '- [ ] **Wayfinder 02 authority undecided** (registered 2026-07-16): deferred.',
    '- [ ] **Wayfinder 03 fog promotion undecided** (registered 2026-07-17): deferred.',
    ''
  ].join('\n');
  const commits = [{ date: '2026-07-18', subject: 'docs(l3): re-cut the wayfinder tracker' }];
  assert.deepEqual(lint.checkLedgerCurrency(ledger, commits), []);
});

// The distinctive token still fires even when it sits beside shared ones.
test('ledgerCurrency fires on a distinctive token among shared siblings', () => {
  const ledger = [
    '- [ ] **Wayfinder 02 authority undecided** (registered 2026-07-16): deferred.',
    '- [ ] **Wayfinder 03 treasury classification** (registered 2026-07-17): deferred.',
    ''
  ].join('\n');
  const commits = [{ date: '2026-07-18', subject: 'docs(l3): seal treasury classification' }];
  const findings = lint.checkLedgerCurrency(ledger, commits);
  assert.equal(findings.length, 1);
  assert.match(findings[0].row, /treasury classification/);
});

// Rows wrap: the registration date may land on a continuation line, not the
// header. The block parser must still see the row (pre-fix it saw only rows
// whose date fit on the header line).
test('ledgerCurrency reads a row whose registration date wraps to a later line', () => {
  const ledger = [
    '- [ ] **Palisade cadence owed** (found 2026-07-01 during the',
    '  cadence pass; registered 2026-07-09): numbers deferred to the magnitude pass.',
    ''
  ].join('\n');
  const commits = [{ date: '2026-07-12', subject: 'feat: palisade cadence wired' }];
  const findings = lint.checkLedgerCurrency(ledger, commits);
  assert.equal(findings.length, 1);
  assert.match(findings[0].row, /Palisade cadence/);
});

// A guessing check ("possibly paid … verify or dismiss") must not gate: only
// blocking findings set the non-zero exit. This is the split that was letting a
// permanent ledger false positive hold lint:docs red until 2026-07-17.
test('tally: ledgerCurrency findings are advisory, not blocking', () => {
  const t = lint.tally({ ledgerCurrency: [{ kind: 'ledger-possibly-paid' }] });
  assert.deepEqual(t, { blocking: 0, advisory: 1 });
});

test('tally: a definite check (codeContract) is blocking', () => {
  const t = lint.tally({ codeContract: [{ kind: 'code-contract-violation' }] });
  assert.equal(t.blocking, 1);
});

// ---------------------------------------------------------------- check 6
// Freshness: QUICKREF "Last regenerated" must not predate the newest seal
// date on any glossary surface.

test('freshness flags a QUICKREF older than the newest glossary seal', () => {
  const quickref = '> lives. Last regenerated: 2026-07-08 (targeted).\n';
  const glossaries = [{ path: 'docs/features/match-arc/GLOSSARY.md', text: '| Term | def | AGREED (2026-07-10) |\n' }];
  const findings = lint.checkFreshness(quickref, glossaries);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].kind, 'stale-quickref');
  assert.equal(findings[0].regenerated, '2026-07-08');
  assert.equal(findings[0].newestSeal, '2026-07-10');
});

test('freshness passes when QUICKREF is same-day or newer than every seal', () => {
  const quickref = 'Last regenerated: 2026-07-10\n';
  const glossaries = [{ path: 'g', text: 'AGREED 2026-07-10 · TC-⑧' }];
  assert.deepEqual(lint.checkFreshness(quickref, glossaries), []);
});

// ---------------------------------------------------------------- check 7
// Baseline self-check: the checker checks itself.

test('baselineSelf flags missing birthplace files, dead registry paths, and duplicate canonicals', () => {
  const inventory = inv([
    { canonical: 'A', aliases: [], birthplace: 'docs/real.md' },
    { canonical: 'B', aliases: [], birthplace: 'docs/ghost.md' },
    { canonical: 'A', aliases: [], birthplace: 'docs/real.md' }
  ]);
  const registry = { files: [{ path: 'docs/real.md' }, { path: 'docs/gone.md' }] };
  const exists = (p) => p === 'docs/real.md';
  const findings = lint.checkBaselineSelf(inventory, registry, exists);
  const kinds = findings.map((f) => f.kind).sort();
  assert.deepEqual(kinds, ['dead-registry-path', 'duplicate-canonical', 'missing-birthplace']);
});

test('baselineSelf flags an alias colliding with another term canonical', () => {
  const inventory = inv([
    { canonical: 'Force limit', aliases: [], birthplace: 'a.md' },
    { canonical: 'Recruitment', aliases: ['Force limit'], birthplace: 'a.md' }
  ]);
  const findings = lint.checkBaselineSelf(inventory, { files: [] }, () => true);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].kind, 'alias-canonical-collision');
});

// ---------------------------------------------------------------- runner
// Integration smoke: runAll on the real repo returns all 8 result sets.

test('runAll returns a result set per check against the real repo', () => {
  const results = lint.runAll(require('path').join(__dirname, '..'));
  const keys = Object.keys(results).sort();
  assert.deepEqual(keys, [
    'adrStampDuty', 'baselineSelf', 'codeContract', 'freshness',
    'headerDiff', 'ledgerCurrency', 'numericRestatement', 'statusMarkers'
  ]);
  for (const k of keys) assert.ok(Array.isArray(results[k]), `${k} is an array`);
});

// --------------------------------------------- headerDiff normalization
// Learned from acceptance run #1: real headers carry parentheticals,
// coinage tags, annotation suffixes, and en-dashes.

test('headerDiff matches a parenthetical-qualified canonical to its bare header', () => {
  const inventory = inv([{ canonical: 'R (combat ratio)', aliases: [], korean: null, birthplace: 'docs/features/combat-formula/GLOSSARY.md' }]);
  const surfaces = [{ path: 'docs/features/combat-formula/GLOSSARY.md', text: '| R | attacker/defender ratio | AGREED |\n' }];
  assert.deepEqual(lint.checkHeaderDiff(inventory, surfaces), []);
});

test('headerDiff ignores coinage tags, annotation suffixes, and dash variants', () => {
  const inventory = inv([
    { canonical: 'Decisiveness ladder', aliases: [], birthplace: 'g.md' },
    { canonical: 'Realm count 4–6', aliases: [], birthplace: 'DOMAIN_MAP.md' }
  ]);
  const surfaces = [
    { path: 'g.md', text: '| decisiveness ladder (결정성 사다리) [coinage] | def | AGREED |\n' },
    { path: 'DOMAIN_MAP.md', text: '- ✅ `Realm count 4-6 (authoring default 5)`: parameter.\n' }
  ];
  assert.deepEqual(lint.checkHeaderDiff(inventory, surfaces), []);
});

test('headerDiff skips orphan judgment for terms whose birthplace is not a scanned surface', () => {
  const inventory = inv([{ canonical: 'Jinguan grammar', aliases: [], birthplace: 'docs/features/combat-formula/MAGNITUDE.md' }]);
  const surfaces = [{ path: 'DOMAIN_MAP.md', text: '- ✅ `Something else`: row.\n' }];
  const findings = lint.checkHeaderDiff(inventory, surfaces);
  assert.deepEqual(findings.filter((f) => f.kind === 'orphaned-inventory-row'), []);
});

test('headerDiff matches a Korean-first header via its parenthetical English names', () => {
  const inventory = inv([{ canonical: 'Vassalage / capitulation', aliases: [], korean: '복속', birthplace: 'g.md' }]);
  const surfaces = [{ path: 'g.md', text: '| 복속 (vassalage / capitulation) | outcome | AGREED |\n' }];
  assert.deepEqual(lint.checkHeaderDiff(inventory, surfaces), []);
});

test('codeContract accepts codeRefs stored without the js/ prefix', () => {
  const inventory = inv([{ canonical: 'Faction', aliases: [], codeIdentifier: 'faction', codeRefs: ['faction.js'] }]);
  const jsFiles = { 'js/faction.js': 'class Faction {}\nconst faction = new Faction();' };
  assert.deepEqual(lint.checkCodeContract(inventory, jsFiles), []);
});

test('headerDiff sees bolded sub-terms inside a row as headers (inline-defined terms)', () => {
  const inventory = inv([{ canonical: 'Cession', aliases: [], korean: '할양', birthplace: 'g.md' }]);
  const surfaces = [{ path: 'g.md', text: '| 정산 통화 (settlement currencies) | menu of three: **할양** (cession — named sectors), ... | AGREED |\n' }];
  const findings = lint.checkHeaderDiff(inventory, surfaces);
  assert.deepEqual(findings.filter((f) => f.kind === 'orphaned-inventory-row'), []);
});

test('headerDiff suppresses orphan when the name appears inline (backtick or plain) at its birthplace', () => {
  const inventory = inv([
    { canonical: 'controlWeight (control weight axis)', aliases: [], birthplace: 'DOMAIN_MAP.md' },
    { canonical: 'Shield mass', aliases: [], birthplace: 'g.md' }
  ]);
  const surfaces = [
    { path: 'DOMAIN_MAP.md', text: '- ✅ `Front sector value profile`: axes `controlWeight`, `economyValue`.\n' },
    { path: 'g.md', text: '| 패권 결정점 | Sealed values: shield mass = field army + garrisons. | AGREED |\n' }
  ];
  const findings = lint.checkHeaderDiff(inventory, surfaces);
  assert.deepEqual(findings.filter((f) => f.kind === 'orphaned-inventory-row'), []);
});

test('headerDiff still flags a term whose name is entirely absent from its birthplace', () => {
  const inventory = inv([{ canonical: 'Phantom term', aliases: [], birthplace: 'DOMAIN_MAP.md' }]);
  const surfaces = [{ path: 'DOMAIN_MAP.md', text: '- ✅ `Other`: row.\n' }];
  const findings = lint.checkHeaderDiff(inventory, surfaces);
  assert.equal(findings.filter((f) => f.kind === 'orphaned-inventory-row').length, 1);
});

test('headerDiff skips table captions and matches camelCase headers space-insensitively', () => {
  const inventory = inv([{ canonical: 'Troop stock', aliases: ['troopStock'], birthplace: 'DOMAIN_MAP.md' }]);
  const surfaces = [{ path: 'DOMAIN_MAP.md', text: '| **Term** | def |\n- ✅ `troopStock`: the stock.\n' }];
  assert.deepEqual(lint.checkHeaderDiff(inventory, surfaces), []);
});

test('headerDiff skips parenthesized table captions like "Term (한국어)"', () => {
  const inventory = inv([{ canonical: 'Anything', aliases: [], birthplace: 'g.md' }]);
  const surfaces = [{ path: 'g.md', text: '| Term (한국어) | Definition | Status |\n| Anything | def | AGREED |\n' }];
  assert.deepEqual(lint.checkHeaderDiff(inventory, surfaces).filter((f) => f.kind === 'unregistered-definition'), []);
});
