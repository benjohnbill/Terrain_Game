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

test('statusMarkers flags ✅ over a rejected-recorded row (the marker hole closed 2026-07-27)', () => {
  const inventory = inv([{ canonical: 'Blinds', aliases: [], status: 'rejected-recorded' }]);
  const domainMap = '- \u2705 `Blinds`: the escalation thread.\n';
  const findings = lint.checkStatusMarkers(inventory, domainMap);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].kind, 'status-marker-mismatch');
  assert.equal(findings[0].term, 'Blinds');
});

test('statusMarkers accepts \u2705 over a SEALED row (SEALED implies AGREED)', () => {
  const inventory = inv([{ canonical: 'Force geography', aliases: [], status: 'SEALED' }]);
  const domainMap = '- \u2705 `Force geography`: the sealed board.\n';
  assert.deepEqual(lint.checkStatusMarkers(inventory, domainMap), []);
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

// ---------------------------------------------------------------- check 9
// Definition restatement: a DOMAIN_MAP entry for a term born elsewhere is a
// summary + pointer. Reused *phrasing* is what marks a copy — a legitimate
// summary reuses the same vocabulary, so the check measures 5-word shingles.

// The fixture term is deliberately NOT one of the grandfathered names — using a
// real one would silently exercise the skip path instead of the check.
const CRADLE = 'docs/features/terrain-cradle/GLOSSARY.md';
const CRADLE_ROW = '| Marsh belt (습지대) | Sea expressed as land: non-sector '
  + 'hexes no one owns; movement, ownership and vision identical to sea. Exactly one kind '
  + 'of "cannot cross" exists in the world. | AGREED |';

function restatementFixture(domainMapText, birthplace = CRADLE) {
  const inventory = inv([{
    canonical: 'Marsh belt', korean: '습지대', aliases: [],
    birthplace, tier: 0, status: 'AGREED'
  }]);
  const surfaces = [{ path: CRADLE, text: CRADLE_ROW }];
  return lint.checkDefinitionRestatement(inventory, domainMapText, surfaces);
}

test('definitionRestatement flags a DOMAIN_MAP entry that copies its birthplace definition', () => {
  const findings = restatementFixture(
    '- ✅ `Marsh belt` (습지대): sea expressed as land — non-sector hexes\n'
    + '  no one owns; movement, ownership, and vision identical to sea. Exactly one\n'
    + '  kind of "cannot cross" exists in the world, drawn two ways. (TC-⑧)\n'
  );
  assert.equal(findings.length, 1);
  assert.equal(findings[0].kind, 'definition-restatement');
  assert.equal(findings[0].term, 'Marsh belt');
  assert.equal(findings[0].birthplace, CRADLE);
  assert.ok(findings[0].overlap >= 25, 'overlap should be reported as a percentage');
});

test('definitionRestatement passes a genuine summary + pointer', () => {
  const findings = restatementFixture(
    '- ✅ `Marsh belt` (습지대): the one "cannot cross" kind, drawn two\n'
    + '  ways. Authoritative: terrain-cradle GLOSSARY (TC-⑧).\n'
  );
  assert.deepEqual(findings, []);
});

// A project-native term IS defined in DOMAIN_MAP — that is its birthplace, so a
// definition there is correct. Scoping the check to promoted terms is the rule,
// not a convenience.
test('definitionRestatement never fires on a term whose birthplace is DOMAIN_MAP', () => {
  const findings = restatementFixture(
    '- ✅ `Marsh belt` (습지대): sea expressed as land — non-sector hexes\n'
    + '  no one owns; movement, ownership, and vision identical to sea. Exactly one\n'
    + '  kind of "cannot cross" exists in the world, drawn two ways.\n',
    'DOMAIN_MAP.md'
  );
  assert.deepEqual(findings, []);
});

// The ratchet closed. Run #3 recorded 19 pre-existing restatements so a known
// backlog would not re-print every lint; stage 4 (2026-07-28) re-cut all 56
// promoted entries and drained the set. Empty is now the invariant: a name added
// back would exempt a copy the re-cut already proved avoidable.
test('definitionRestatement carries no grandfather exemptions', () => {
  assert.equal(lint.RESTATEMENT_GRANDFATHERED.size, 0,
    'stage 4 drained this set — re-cut the entry in summary voice, do not exempt it');
  const real = lint.runAll(process.cwd());
  assert.deepEqual(real.definitionRestatement, [],
    'with no exemptions left, the live repo must be clean so NEW copies stand out');
});

test('shingleOverlap scores reuse of phrasing, not shared vocabulary', () => {
  const source = 'sea expressed as land non sector hexes no one owns movement ownership and vision identical to sea';
  assert.ok(lint.shingleOverlap(source, source) === 1, 'identical text is total overlap');
  assert.equal(
    lint.shingleOverlap('the terrain nobody can enter is drawn in two different ways here', source),
    0,
    'a same-topic sentence sharing no 5-word run scores zero'
  );
  assert.equal(lint.shingleOverlap('too short', source), 0, 'sub-shingle text is never a finding');
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

// The classification of all eight checks was decided on 2026-07-17, not left to
// default. Pinning the whole set means a future session cannot quietly demote a
// check to advisory to get to green — it has to break this test and argue for it.
// Rationale per check: docs/SYNC-DEBT.md.
// `freshness` was demoted 2026-07-28 and this test is where the argument had to
// be made, exactly as the note above intends. The argument is not "to get to
// green": the QUICKREF's purpose was defined for the first time that day (user
// ruling) as a re-renderable LOCK POINT rather than a per-batch obligation, and a
// blocking staleness gate contradicts that model — it charges every sealing
// session a manual re-render, the precise cost the lock-point model removes.
// A stale QUICKREF is now a prompt, not a defect. Documentation-law ritual duty 4.
// `ticketBlockerCurrency` joined the set on 2026-08-03 (ticket 14 R1-R7), and
// breaking this pin to add it is what the pin is for. The argument: it asserts a
// real defect — every blocker resolved while the ticket still reads open — but
// two different actions clear it, amend the line or claim the ticket, and the
// check cannot tell which the reader owes. That is rule 2, the same reason
// `ledgerCurrency` never gated. Blocking would force one arbitrarily, and the
// wrong forced choice here is the dangerous one: editing `status` to silence a
// line is precisely the move that left a false `BLOCKED` standing for a week.
test('tally: ledgerCurrency, freshness and ticketBlockerCurrency are advisory', () => {
  assert.deepEqual([...lint.ADVISORY].sort(),
    ['freshness', 'ledgerCurrency', 'ticketBlockerCurrency']);
});

test('tally: every check that asserts a definite defect gates', () => {
  const definite = [
    'headerDiff', 'codeContract', 'statusMarkers', 'numericRestatement',
    'definitionRestatement', 'baselineSelf', 'adrStampDuty'
  ];
  for (const check of definite) {
    const t = lint.tally({ [check]: [{ kind: 'x' }] });
    assert.deepEqual(t, { blocking: 1, advisory: 0 }, `${check} must gate`);
  }
});

// A mixed run must gate on the definite finding alone — the advisory one neither
// adds to the gate nor masks it.
test('tally: advisory findings do not gate a run that is otherwise clean', () => {
  const t = lint.tally({
    ledgerCurrency: [{ kind: 'ledger-possibly-paid' }, { kind: 'ledger-possibly-paid' }],
    freshness: []
  });
  assert.deepEqual(t, { blocking: 0, advisory: 2 });
});

// The lock-point model's whole point: a stale QUICKREF must not stop a commit.
// The check still RUNS and still reports — it just does not toll.
test('tally: a stale QUICKREF reports without gating', () => {
  const t = lint.tally({ freshness: [{ kind: 'stale-quickref' }] });
  assert.deepEqual(t, { blocking: 0, advisory: 1 },
    'a re-render is a prompt at a lock point, not a per-session obligation');
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

// ------------------------------------------------------- prescriptions
// User-sealed 2026-07-26: a rejection message must carry the FIX and its
// BOUNDS, offer the do-not-register exit, and refuse `--no-verify`. These are
// requirements on the message, so they are asserted rather than eyeballed.

const UNREGISTERED = {
  kind: 'unregistered-definition',
  term: 'Movement graph',
  path: 'docs/features/war-model-build/GLOSSARY.md',
  detail: 'definition-surface header matches no inventory row'
};

test('formatFinding names the defect, its site, and the file to patch', () => {
  const text = lint.formatFinding(UNREGISTERED);
  assert.match(text, /unregistered-definition/);
  assert.match(text, /Movement graph/);
  assert.match(text, /docs\/features\/war-model-build\/GLOSSARY\.md/, 'names where the defect is');
  assert.match(text, /docs\/audits\/term-inventory\.json/, 'names the file to patch');
});

test('formatFinding states the bound on the fix — index fields, never definitions', () => {
  const text = lint.formatFinding(UNREGISTERED);
  assert.match(text, /INDEX FIELDS ONLY/);
  assert.match(text, /single-definition rule/);
});

// The failure this guards: an agent shown only "add the row" adds any row, and
// a junk registration is the exact defect the check exists to prevent.
test('formatFinding offers the do-not-register exit', () => {
  const text = lint.formatFinding(UNREGISTERED);
  assert.match(text, /Do not register it/);
  assert.match(text, /ask the user/);
});

test('formatReport refuses --no-verify when anything blocks', () => {
  const text = lint.formatReport({ headerDiff: [UNREGISTERED] });
  assert.match(text, /--no-verify/);
  assert.match(text, /CI/);
});

// A clean run has nothing to bypass; printing the refusal anyway is noise.
test('formatReport omits the bypass refusal when nothing blocks', () => {
  const advisoryOnly = lint.formatReport({
    ledgerCurrency: [{ kind: 'ledger-possibly-paid', row: 'Some debt' }]
  });
  assert.doesNotMatch(advisoryOnly, /--no-verify/);
  assert.match(advisoryOnly, /0 blocking, 1 advisory/);
  assert.doesNotMatch(lint.formatReport({ headerDiff: [] }), /--no-verify/);
});

// Repeating identical advice per finding is the alarm fatigue this tool warns
// about: the remedy belongs to the kind, so it is stated once per group.
test('formatReport lists every site but states the remedy once per kind', () => {
  const text = lint.formatReport({
    headerDiff: [UNREGISTERED, { ...UNREGISTERED, term: 'March speed' }]
  });
  assert.match(text, /Movement graph/);
  assert.match(text, /March speed/);
  assert.equal(text.match(/Do not register it/g).length, 1);
});

// `birthplace` names the file being copied FROM. Routing the fix there would
// send an agent to edit the authoritative source instead of the copy.
test('formatFinding points a restatement at DOMAIN_MAP, not at the birthplace', () => {
  const text = lint.formatFinding({
    kind: 'definition-restatement',
    term: 'Cascade',
    birthplace: 'docs/features/match-arc/GLOSSARY.md',
    overlap: 76
  });
  assert.match(text, /at DOMAIN_MAP\.md/, 'the defect site is the copy');
  assert.match(text, /authoritative: docs\/features\/match-arc\/GLOSSARY\.md/,
    'the birthplace appears as the pointer to write, not as the place to edit');
});

// A check that ships without a prescription must say so — printing the bare
// finding would read as "nothing to do".
test('formatFinding flags an unprescribed kind instead of falling silent', () => {
  const text = lint.formatFinding({ kind: 'brand-new-check', term: 'X' });
  assert.match(text, /No prescription is registered/);
  assert.match(text, /brand-new-check/);
});

test('every emitted finding kind has a prescription', () => {
  const emitted = [...new Set(
    require('fs').readFileSync(require('path').join(__dirname, '../scripts/audit-lint.js'), 'utf8')
      .matchAll(/kind: '([a-z-]+)'/g)
  )].map((m) => m[1]);
  assert.ok(emitted.length >= 13, `expected the full kind set, saw ${emitted.length}`);
  for (const kind of emitted) {
    assert.ok(lint.PRESCRIPTIONS[kind], `${kind} has no prescription`);
  }
});

// ---------------------------------------------------------------- runner
// Integration smoke: runAll on the real repo returns all 10 result sets.

test('runAll returns a result set per check against the real repo', () => {
  const results = lint.runAll(require('path').join(__dirname, '..'));
  const keys = Object.keys(results).sort();
  assert.deepEqual(keys, [
    'adrStampDuty', 'baselineSelf', 'codeContract', 'definitionRestatement',
    'fieldDomains', 'freshness', 'glossaryStatus', 'headerDiff',
    'ledgerCurrency', 'numericRestatement', 'statusMarkers',
    // ticket 14 R1-R7, 2026-08-03
    'ticketBlockerCurrency', 'ticketFieldDomains', 'ticketFrontMatter'
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

// ---------------------------------------------------------------- check 10
// Inventory field domains. Completes ticket 03's binding condition: the
// schema v2 ruling declares itself void without a check that enforces the
// enum. Blocking (user ruling 2026-07-27), so the false-positive bar is a
// rejected commit, not a noisy report.

test('fieldDomains flags an off-dictionary status', () => {
  const inventory = inv([{ canonical: 'Frontage', status: '가안', kind: 'mechanism', verdict: 'standard-match' }]);
  const findings = lint.checkFieldDomains(inventory);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].kind, 'off-domain-field');
  assert.equal(findings[0].term, 'Frontage');
  assert.equal(findings[0].field, 'status');
  assert.equal(findings[0].value, '가안');
  assert.equal(findings[0].path, 'docs/audits/term-inventory.json');
});

test('fieldDomains flags an off-dictionary kind and verdict', () => {
  const inventory = inv([
    { canonical: 'Screen', status: 'AGREED', kind: 'mechanic', verdict: 'standard-match' },
    { canonical: 'Tempo', status: 'AGREED', kind: 'meta', verdict: 'standard-term' }
  ]);
  const findings = lint.checkFieldDomains(inventory);
  assert.deepEqual(findings.map((f) => [f.term, f.field]), [['Screen', 'kind'], ['Tempo', 'verdict']]);
});

test('fieldDomains accepts every in-domain value, SEALED included', () => {
  const inventory = inv([
    { canonical: 'A', status: 'AGREED', kind: 'mechanism', verdict: 'justified-coinage' },
    { canonical: 'B', status: 'PROPOSED', kind: 'meta', verdict: 'synonym-exists' },
    { canonical: 'C', status: 'rejected-recorded', kind: 'mechanism', verdict: 'standard-match' },
    { canonical: 'D', status: 'SEALED', kind: 'meta', verdict: 'justified-coinage' }
  ]);
  assert.deepEqual(lint.checkFieldDomains(inventory), []);
});

test('fieldDomains accepts a null or absent verdict (HARVEST step 6 judging queue)', () => {
  const inventory = inv([
    { canonical: 'Fresh', status: 'AGREED', kind: 'mechanism', verdict: null },
    { canonical: 'Fresher', status: 'AGREED', kind: 'mechanism' }
  ]);
  assert.deepEqual(lint.checkFieldDomains(inventory), []);
});

test('fieldDomains flags a row with no status or kind at all', () => {
  const inventory = inv([{ canonical: 'Nameless', verdict: 'standard-match' }]);
  const findings = lint.checkFieldDomains(inventory);
  assert.deepEqual(findings.map((f) => f.field), ['status', 'kind']);
});

test('fieldDomains grandfathers a named row but never a new one', () => {
  const inventory = inv([
    { canonical: 'Old stray', status: 'legacy-status', kind: 'mechanism', verdict: 'standard-match' },
    { canonical: 'New stray', status: 'legacy-status', kind: 'mechanism', verdict: 'standard-match' }
  ]);
  const findings = lint.checkFieldDomains(inventory, new Set(['Old stray|status']));
  assert.deepEqual(findings.map((f) => f.term), ['New stray']);
});

// ---------------------------------------------------------------- check 11
// GLOSSARY status vs inventory status. Check 3 only ever cross-checked
// DOMAIN_MAP's markers, leaving the feature GLOSSARY status cells — where most
// terms actually declare status — unwatched. Landed 2026-07-28 with an EMPTY
// grandfather list because the surface measured 120/120 clean first.

const GS = 'docs/features/match-arc/GLOSSARY.md';
const gsRow = (name, status) => `| ${name} | some definition |  | ${status} |`;

test('glossaryStatus flags a row whose status word contradicts the inventory', () => {
  const inventory = inv([{ canonical: 'Field army', korean: '야전군', aliases: [], birthplace: GS, status: 'PROPOSED' }]);
  const findings = lint.checkGlossaryStatus(inventory, [
    { path: GS, text: gsRow('야전군 (field army)', '**AGREED** (2026-07-13, WM-①)') }
  ]);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].kind, 'glossary-status-drift');
  assert.equal(findings[0].term, 'Field army');
  assert.equal(findings[0].path, GS);
  assert.equal(findings[0].glossary, 'AGREED');
  assert.equal(findings[0].inventory, 'PROPOSED');
});

test('glossaryStatus passes when the birthplace and the index agree', () => {
  const inventory = inv([{ canonical: 'Field army', korean: '야전군', aliases: [], birthplace: GS, status: 'AGREED' }]);
  assert.deepEqual(lint.checkGlossaryStatus(inventory, [
    { path: GS, text: gsRow('야전군 (field army)', '**AGREED** (2026-07-13, WM-①)') }
  ]), []);
});

// The regression this check was almost born with. A scripted sweep on
// 2026-07-28 reported four mismatches and every one was the reader's bug; the
// instructive case is a status cell whose PARENTHETICAL mentions a sealed VALUE.
// `status` carries the name axis only (ruled 2026-07-15), so a word search finds
// SEALED and manufactures a finding against a row that obeys the rule.
test('glossaryStatus does not read a value seal in a parenthetical as the status', () => {
  const inventory = inv([{ canonical: 'capLandFrac', korean: null, aliases: [], birthplace: GS, status: 'AGREED' }]);
  assert.deepEqual(lint.checkGlossaryStatus(inventory, [
    { path: GS, text: gsRow('capLandFrac (땅-상한 결합 다이얼)',
      '**AGREED** (value 1 SEALED 2026-07-11, AB-② · L2 config — was 0, OG-⑤)') }
  ]), [], 'the status is AGREED; the seal belongs to the value');
});

test('glossaryStatus skips a row that declares no dictionary status word', () => {
  const inventory = inv([{ canonical: 'estimate band', korean: null, aliases: [], birthplace: GS, status: 'AGREED' }]);
  assert.deepEqual(lint.checkGlossaryStatus(inventory, [
    { path: GS, text: gsRow('estimate band — USE ONLY', 'pointer') }
  ]), [], 'a pointer row has no status to contradict');
});

test('statusWordOf strips parentheticals, then takes the dictionary word', () => {
  assert.equal(lint.statusWordOf('**AGREED** (value 1 SEALED 2026-07-11)'), 'AGREED');
  assert.equal(lint.statusWordOf('AGREED 2026-07-07 · TC-⑧ · renamed 2026-07-10'), 'AGREED');
  assert.equal(lint.statusWordOf('rejected-recorded (as an economic device) → force-geography'), 'rejected-recorded');
  assert.equal(lint.statusWordOf('**SEALED** (2026-07-24)'), 'SEALED');
  assert.equal(lint.statusWordOf('PROPOSED (구 표기 candidate)'), 'PROPOSED');
  assert.equal(lint.statusWordOf('pointer'), null);
});

// Word-bounded, or the C-loop table's UNSEALED rows would every one read SEALED.
test('statusWordOf does not read UNSEALED as SEALED', () => {
  assert.equal(lint.statusWordOf('UNSEALED 가안'), null);
  assert.equal(lint.statusWordOf('rejected-recorded'), 'rejected-recorded');
});

// The live surface was measured clean BEFORE the check was written, which is why
// it needs no grandfather list. Pinning that keeps the ratchet closed.
test('glossaryStatus is clean against the real repo', () => {
  const real = lint.runAll(process.cwd());
  assert.deepEqual(real.glossaryStatus, [],
    'the birthplaces and the index agreed at 120/120 when this check landed');
});

// ------------------------------------------- handed-over findings, 2026-07-28
// Two defects found by an adjacent session that deliberately did NOT edit
// audit-lint.js while it was being written, and recorded them in ticket 13
// instead. Verbal handover had already failed once — both were re-measured live
// hours later and both were still there — so they are pinned here.

// `undetermined` is in the S7 verdict vocabulary and audit run #1 reached it on
// three rows. Omitting it from a BLOCKING check meant an audit could not commit
// its own legitimate verdict.
test('fieldDomains accepts every S7 verdict, including undetermined', () => {
  const inventory = inv([
    { canonical: 'A', status: 'AGREED', kind: 'mechanism', verdict: 'undetermined' },
    { canonical: 'B', status: 'AGREED', kind: 'mechanism', verdict: 'justified-coinage' },
    { canonical: 'C', status: 'AGREED', kind: 'mechanism', verdict: 'standard-match' },
    { canonical: 'D', status: 'AGREED', kind: 'mechanism', verdict: 'synonym-exists' },
    { canonical: 'E', status: 'AGREED', kind: 'mechanism', verdict: null }
  ]);
  assert.deepEqual(lint.checkFieldDomains(inventory), [],
    'a blocking check must not reject a verdict the audit is entitled to reach');
});

test('fieldDomains still rejects a verdict outside S7', () => {
  const inventory = inv([
    { canonical: 'A', status: 'AGREED', kind: 'mechanism', verdict: 'probably-fine' }
  ]);
  const findings = lint.checkFieldDomains(inventory);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].kind, 'off-domain-field');
});

// The clean line said "9 checks" while runAll returned ten, and check 11 would
// have staled it again. Derived from the results object, it cannot drift.
test('formatReport derives the clean-line check count from the results', () => {
  assert.match(lint.formatReport({ a: [], b: [], c: [] }), /clean \(3 checks, 0 findings\)/);
  assert.match(lint.formatReport({ a: [], b: [] }), /clean \(2 checks, 0 findings\)/);
});

test('the clean line counts every check runAll actually returns', () => {
  const results = lint.runAll(require('path').join(__dirname, '..'));
  const n = Object.keys(results).length;
  const empty = Object.fromEntries(Object.keys(results).map((k) => [k, []]));
  assert.match(lint.formatReport(empty), new RegExp(`clean \\(${n} checks, 0 findings\\)`));
});

// ------------------------------------------------------------ checks 12-14
// Ticket front matter (ticket 14 R1-R7, sealed 2026-08-03). The schema lives in
// `docs/agents/issue-tracker.md`; these pin the parts that are easy to get
// wrong and were, in fact, gotten wrong during the migration that landed them.

function tk(id, fm, tracker = 'demo') {
  return { path: `.scratch/${tracker}/issues/${id}-x.md`, tracker, id, fm };
}

test('ticketFrontMatter flags a ticket with no block at all', () => {
  const f = lint.checkTicketFrontMatter([tk('01', null)]);
  assert.equal(f.length, 1);
  assert.equal(f[0].kind, 'ticket-front-matter-missing');
  assert.equal(f[0].field, '(whole block)');
});

test('ticketFrontMatter flags each individually missing field', () => {
  const f = lint.checkTicketFrontMatter([tk('01', { type: 'task' })]);
  assert.deepEqual(f.map((x) => x.field).sort(), ['blocked_by', 'status']);
});

test('ticketFrontMatter exempts a grandfathered path', () => {
  const held = tk('08', null);
  assert.equal(lint.checkTicketFrontMatter([held]).length, 1);
  assert.equal(lint.checkTicketFrontMatter([held], new Set([held.path])).length, 0);
});

test('ticketFieldDomains rejects a status outside the domain', () => {
  const f = lint.checkTicketFieldDomains([
    tk('01', { type: 'task', status: 'BLOCKED', blocked_by: [] })
  ]);
  assert.equal(f.length, 1);
  assert.equal(f[0].field, 'status');
  assert.match(f[0].detail, /outside its domain/);
});

// `BLOCKED` and `landed` are the two the schema deliberately does not carry —
// blocked is derived, merge state is git's. If either is ever admitted to the
// domain, this fails and asks why.
test('ticketFieldDomains admits no stored blocked or landed state', () => {
  for (const v of ['BLOCKED', 'blocked', 'landed', 'claimed', 'mixed']) {
    assert.equal(lint.TICKET_DOMAINS.status.has(v), false, `${v} must not be a status value`);
  }
});

test('ticketFieldDomains rejects a blocked_by that is not a list of ticket ids', () => {
  const f = lint.checkTicketFieldDomains([
    tk('01', { type: 'task', status: 'open', blocked_by: ['03', 'the manoeuvre pass'] })
  ]);
  assert.equal(f.length, 1);
  assert.equal(f[0].field, 'blocked_by');
});

test('ticketBlockerCurrency fires when every blocker is resolved', () => {
  const f = lint.checkTicketBlockerCurrency([
    tk('01', { type: 'task', status: 'resolved', blocked_by: [] }),
    tk('02', { type: 'task', status: 'open', blocked_by: ['01'] })
  ]);
  assert.equal(f.length, 1);
  assert.equal(f[0].kind, 'ticket-blockers-cleared');
});

test('ticketBlockerCurrency stays quiet while one blocker is live', () => {
  const f = lint.checkTicketBlockerCurrency([
    tk('01', { type: 'task', status: 'resolved', blocked_by: [] }),
    tk('02', { type: 'task', status: 'needs-info', blocked_by: [] }),
    tk('03', { type: 'task', status: 'open', blocked_by: ['01', '02'] })
  ]);
  assert.equal(f.length, 0);
});

// An exemption must not manufacture findings against its own dependents. The
// first run of this check reported the held-out ticket 08 as a missing id to
// ticket 09, which depends on it.
test('ticketBlockerCurrency treats an unparsed peer as existing and unresolved', () => {
  const f = lint.checkTicketBlockerCurrency([
    tk('08', null),
    tk('09', { type: 'task', status: 'open', blocked_by: ['08'] })
  ]);
  assert.equal(f.length, 0);
});

test('ticketBlockerCurrency flags a blocker id no ticket carries', () => {
  const f = lint.checkTicketBlockerCurrency([
    tk('02', { type: 'task', status: 'open', blocked_by: ['99'] })
  ]);
  assert.equal(f.length, 1);
  assert.equal(f[0].kind, 'ticket-blocker-unknown');
});

test('blocker currency is advisory; the two front-matter checks block', () => {
  assert.equal(lint.ADVISORY.has('ticketBlockerCurrency'), true);
  assert.equal(lint.ADVISORY.has('ticketFrontMatter'), false);
  assert.equal(lint.ADVISORY.has('ticketFieldDomains'), false);
});

// The grandfather list is an exemption from a BLOCKING check, so it carries a
// deletion trigger in its comment. This pins the size so a second entry has to
// be a deliberate act.
test('exactly one ticket is held out of the front-matter schema', () => {
  assert.equal(lint.TICKET_GRANDFATHERED.size, 1);
});

test('every check runAll returns has a prescription for the kinds it emits', () => {
  const results = lint.runAll(require('path').join(__dirname, '..'));
  for (const findings of Object.values(results)) {
    for (const f of findings) {
      assert.ok(lint.PRESCRIPTIONS[f.kind], `no prescription for kind "${f.kind}"`);
    }
  }
});
