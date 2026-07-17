// Audit lint — P1 prototype (doc-governance package, 2026-07-10).
// Pure check functions over the audit baselines (docs/audits/*.json) and
// documentation surfaces. Findings are REPORTS, never legislation
// (documentation-law, Working-layer rule). CLI entry at the bottom runs
// all checks against the repo.
'use strict';

// -- header parsing --------------------------------------------------------

// DOMAIN_MAP bullet rows: - ✅ `Term` (표시어): ...   (markers ✅ ❓ ⛔)
const DM_ROW = /^- (✅|❓|⛔) `([^`]+)`/;
// GLOSSARY table rows: | Term (표시어 · 구칭 old) | definition | status |
const GLOSSARY_ROW = /^\| ([^|]+?) \|/;

function parseSurfaceHeaders(text) {
  const headers = [];
  for (const line of text.split('\n')) {
    const dm = line.match(DM_ROW);
    if (dm) {
      headers.push({ term: dm[2].trim(), marker: dm[1] });
      continue;
    }
    const gl = line.match(GLOSSARY_ROW);
    if (gl) {
      const cell = gl[1].trim();
      const bare = cell.replace(/[*`]/g, '').replace(/\s*\([^)]*\)\s*$/, '').trim();
      if (/^(Term|Definition|Status)$/i.test(bare) || /^-+$/.test(bare)) continue;
      // strip "(표시어 · 구칭 ...)" parentheticals from the header cell
      headers.push({ term: cell.replace(/\s*\(.*\)\s*$/, '').trim(), marker: null });
    }
  }
  return headers;
}

// Normalize a term name for matching: real headers carry parentheticals,
// coinage tags, annotation suffixes, and dash variants (acceptance run #1).
function normalizeName(name) {
  return name
    .replace(/[*`]/g, '')
    .replace(/\[(coinage|조어)\]/gi, '')
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/\s+—.*$/, '')
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

// every name a term answers to, normalized
function nameSet(term) {
  const names = [term.canonical, term.korean, ...(term.aliases || [])];
  return names.filter(Boolean).map(normalizeName);
}

function buildNameIndex(inventory) {
  const index = new Map();
  for (const t of inventory.terms) {
    for (const n of nameSet(t)) {
      index.set(n, t);
      index.set(n.replace(/ /g, ''), t); // camelCase headers vs spaced canonicals
    }
  }
  return index;
}

function lookup(index, raw) {
  const n = normalizeName(raw);
  return index.get(n) || index.get(n.replace(/ /g, ''));
}

// -- check 1: definition-surface header diff -------------------------------

function checkHeaderDiff(inventory, surfaces) {
  const findings = [];
  const index = buildNameIndex(inventory);
  const seenTerms = new Set();
  const surfacePaths = new Set(surfaces.map((s) => s.path));

  for (const surface of surfaces) {
    for (const h of parseSurfaceHeaders(surface.text)) {
      const hit = lookup(index, h.term);
      if (hit) {
        seenTerms.add(hit.canonical);
      } else {
        findings.push({
          kind: 'unregistered-definition',
          term: h.term,
          path: surface.path,
          detail: 'definition-surface header matches no inventory row'
        });
      }
    }
    // bolded sub-terms defined inline inside a row count as headers for
    // orphan suppression only (bold is usually prose emphasis — never flag
    // a non-matching bold as an unregistered definition)
    for (const m of surface.text.matchAll(/\*\*([^*\n]+)\*\*/g)) {
      const hit = lookup(index, m[1]);
      if (hit) seenTerms.add(hit.canonical);
    }
  }
  // orphan judgment only where the birthplace is a scanned formal surface
  // (DOMAIN_MAP / GLOSSARYs); model-doc- and ADR-born terms are out of
  // mechanical scope here.
  // orphan = the name is ENTIRELY absent from its birthplace surface —
  // inline mentions (backtick tokens, plain prose) suppress the finding,
  // so this fires only for truly vanished terms (low-noise by design).
  const byPath = new Map(surfaces.map((s) => [s.path, s.text.toLowerCase()]));
  for (const t of inventory.terms) {
    if (!surfacePaths.has(t.birthplace)) continue;
    if (seenTerms.has(t.canonical)) continue;
    const home = byPath.get(t.birthplace) || '';
    const inlineNames = [t.canonical, t.korean, ...(t.aliases || [])]
      .filter(Boolean)
      .flatMap((n) => [n, n.replace(/\s*\([^)]*\)/g, '').trim()])
      .map((n) => n.toLowerCase())
      .filter((n) => n.length >= 2);
    if (inlineNames.some((n) => home.includes(n))) continue;
    findings.push({
      kind: 'orphaned-inventory-row',
      term: t.canonical,
      path: t.birthplace || null,
      detail: 'name entirely absent from its birthplace surface'
    });
  }
  return findings;
}

// -- check 2: code contract -------------------------------------------------

function checkCodeContract(inventory, jsFiles) {
  const findings = [];
  for (const t of inventory.terms) {
    if (!t.codeIdentifier || !t.codeRefs || t.codeRefs.length === 0) continue;
    const present = t.codeRefs.some((ref) => {
      const src = jsFiles[ref] || jsFiles['js/' + ref] || '';
      return src.includes(t.codeIdentifier);
    });
    if (!present) {
      findings.push({
        kind: 'code-contract-violation',
        term: t.canonical,
        identifier: t.codeIdentifier,
        detail: `identifier absent from claimed refs: ${t.codeRefs.join(', ')}`
      });
    }
  }
  return findings;
}

// -- check 3: status-marker cross-check -------------------------------------

// status dictionary (documentation-law): ✅/❓/⛔ ≡ AGREED/PROPOSED/rejected
const MARKER_OK = {
  '✅': (s) => s !== 'PROPOSED',
  '❓': (s) => s === 'PROPOSED',
  '⛔': (s) => /reject/i.test(s)
};

function checkStatusMarkers(inventory, domainMapText) {
  const findings = [];
  const index = buildNameIndex(inventory);
  for (const h of parseSurfaceHeaders(domainMapText)) {
    if (!h.marker) continue;
    const t = index.get(h.term.toLowerCase());
    if (!t || !t.status) continue;
    if (!MARKER_OK[h.marker](t.status)) {
      findings.push({
        kind: 'status-marker-mismatch',
        term: t.canonical,
        marker: h.marker,
        status: t.status,
        detail: `DOMAIN_MAP marker ${h.marker} contradicts inventory status ${t.status}`
      });
    }
  }
  return findings;
}

// -- check 4: numeric restatement (narrowed) --------------------------------
// Flag a DOMAIN_MAP row only when it BOTH points at an owning doc AND still
// carries a dial-pattern number (dates / ADR numbers / ruling refs excluded).

const POINTER_RE = /MAGNITUDE M\d+|GLOSSARY|RULINGS|ADR \d{4}/;
const NOISE_RE = /\d{4}-\d{2}-\d{2}|ADR \d{4}|\bM\d+\b|\b(?:MT|DT|TC|FG)-[⑮①-⑳②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭\d]*/g;
const DIAL_RE = /\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?\s*(?:×|%|명|생산|per\b|turns?\b)|=\s*\d/;

function splitDomainMapRows(text) {
  const rows = [];
  let current = null;
  for (const line of text.split('\n')) {
    if (DM_ROW.test(line)) {
      if (current) rows.push(current);
      current = line;
    } else if (current && /^\s+\S/.test(line)) {
      current += '\n' + line;
    } else {
      if (current) rows.push(current);
      current = null;
    }
  }
  if (current) rows.push(current);
  return rows;
}

function checkNumericRestatement(domainMapText) {
  const findings = [];
  for (const row of splitDomainMapRows(domainMapText)) {
    const term = row.match(DM_ROW)[2].trim();
    if (!POINTER_RE.test(row)) continue;
    const stripped = row.replace(NOISE_RE, ' ');
    if (DIAL_RE.test(stripped)) {
      findings.push({
        kind: 'numeric-restatement',
        term,
        detail: 'row carries a pointer to an owning doc AND a dial-pattern value (single-definition rule)'
      });
    }
  }
  return findings;
}

// -- check 8: ADR stamp duty -------------------------------------------------
// "amends ADR NNNN" in a Production doc requires the target ADR's header
// (everything before the first section) to carry an "Amended by" stamp.

function checkAdrStampDuty(productionDocs, adrs) {
  const findings = [];
  const seen = new Set();
  for (const doc of productionDocs) {
    for (const m of doc.text.matchAll(/amends ADR (\d{4})/gi)) {
      const num = m[1];
      const key = `${doc.path}:${num}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const adr = adrs[num];
      if (!adr) continue; // missing ADR file is check-7 territory
      const header = adr.split(/\n## /)[0];
      if (!/Amended by:/i.test(header)) {
        findings.push({
          kind: 'unstamped-adr-amendment',
          adr: num,
          path: doc.path,
          detail: `doc claims to amend ADR ${num}, but its header carries no "Amended by" stamp`
        });
      }
    }
  }
  return findings;
}

// -- check 5: ledger currency ------------------------------------------------
// An Open SYNC-DEBT row whose distinctive title token appears in a commit
// subject dated AFTER the row's registration is possibly paid-but-unmarked.

const OPEN_ROW_RE = /^- \[ \] \*\*(.+?)\*\*/;
const ROW_RE = /^- \[[ x]\] \*\*/;
const REGISTERED_RE = /\b(?:registered|noticed)\s+(\d{4}-\d{2}-\d{2})/;

const titleTokens = (title) =>
  title.toLowerCase().split(/[^a-z0-9가-힣-]+/).filter((t) => t.length >= 6);

// Rows wrap across lines, and the registration date lands wherever the prose put
// it. Reading one line at a time only ever saw the rows whose date happened to fit
// on the header line — 6 of ~30 — so which debts this check watched was decided by
// line-wrapping accident. Parse the row as a block instead: header line through the
// line before the next row marker.
function openRows(ledgerText) {
  const lines = ledgerText.split('\n');
  const rows = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(OPEN_ROW_RE);
    if (!m) continue;
    let end = i + 1;
    while (end < lines.length && !ROW_RE.test(lines[end])) end++;
    const registered = lines.slice(i, end).join(' ').match(REGISTERED_RE);
    if (registered) rows.push({ title: m[1], registered: registered[1] });
  }
  return rows;
}

// A token shared by several row titles identifies none of them. Matching on one
// made every sibling fire on any commit that said the word — "wayfinder" sits in a
// dozen rows, so the ledger reported "possibly paid" forever; and because
// audit-lint gated lint:docs, that permanent finding also held the drift check
// behind it from ever running. The stated contract was always "whose DISTINCTIVE
// title token appears in a commit subject" — only the implementation was missing.
// So count each token across every Open row, and match only on tokens belonging to
// exactly one. A row whose title is entirely shared vocabulary cannot be identified
// this way and is honestly left unflagged rather than flagged forever.
function distinctiveTokens(rows) {
  const freq = new Map();
  for (const r of rows) {
    for (const t of new Set(titleTokens(r.title))) freq.set(t, (freq.get(t) || 0) + 1);
  }
  return freq;
}

function checkLedgerCurrency(ledgerText, commits) {
  const findings = [];
  const rows = openRows(ledgerText);
  const freq = distinctiveTokens(rows);
  for (const { title, registered } of rows) {
    const tokens = titleTokens(title).filter((t) => freq.get(t) === 1);
    const hit = commits.find((c) =>
      c.date > registered && tokens.some((t) => c.subject.toLowerCase().includes(t)));
    if (hit) {
      findings.push({
        kind: 'ledger-possibly-paid',
        row: title,
        detail: `commit after ${registered} mentions it: "${hit.subject}" (${hit.date}) — verify and mark paid or dismiss`
      });
    }
  }
  return findings;
}

// -- check 6: freshness -------------------------------------------------------

const DATE_RE = /\d{4}-\d{2}-\d{2}/g;

function checkFreshness(quickrefText, glossaryDocs) {
  const m = quickrefText.match(/Last regenerated: (\d{4}-\d{2}-\d{2})/);
  if (!m) return [{ kind: 'stale-quickref', detail: 'no "Last regenerated" date found in QUICKREF header' }];
  const regenerated = m[1];
  let newestSeal = null;
  for (const doc of glossaryDocs) {
    for (const d of doc.text.match(DATE_RE) || []) {
      if (!newestSeal || d > newestSeal) newestSeal = d;
    }
  }
  if (newestSeal && regenerated < newestSeal) {
    return [{
      kind: 'stale-quickref', regenerated, newestSeal,
      detail: `QUICKREF regenerated ${regenerated} but a glossary carries a ${newestSeal} seal (ritual duty 4: same-session freshness)`
    }];
  }
  return [];
}

// -- check 7: baseline self-check ---------------------------------------------

function checkBaselineSelf(inventory, registry, exists) {
  const findings = [];
  const seenCanonical = new Set();
  for (const t of inventory.terms) {
    if (t.birthplace && !exists(t.birthplace)) {
      findings.push({ kind: 'missing-birthplace', term: t.canonical, path: t.birthplace });
    }
    if (seenCanonical.has(t.canonical)) {
      findings.push({ kind: 'duplicate-canonical', term: t.canonical });
    }
    seenCanonical.add(t.canonical);
  }
  for (const t of inventory.terms) {
    for (const a of t.aliases || []) {
      if (seenCanonical.has(a) && a !== t.canonical) {
        findings.push({ kind: 'alias-canonical-collision', term: t.canonical, alias: a });
      }
    }
  }
  for (const f of (registry.files || [])) {
    if (!exists(f.path)) findings.push({ kind: 'dead-registry-path', path: f.path });
  }
  return findings;
}

// -- runner --------------------------------------------------------------------

function runAll(root) {
  const fs = require('fs');
  const path = require('path');
  const { execSync } = require('child_process');
  const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
  const exists = (p) => fs.existsSync(path.join(root, p));
  const glob = (dir, name) =>
    fs.readdirSync(path.join(root, dir), { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => path.posix.join(dir, e.name, name))
      .filter(exists);

  const inventory = JSON.parse(read('docs/audits/term-inventory.json'));
  const registry = JSON.parse(read('docs/audits/doc-registry.json'));
  const domainMap = read('DOMAIN_MAP.md');
  const glossaries = glob('docs/features', 'GLOSSARY.md').map((p) => ({ path: p, text: read(p) }));
  const surfaces = [{ path: 'DOMAIN_MAP.md', text: domainMap }, ...glossaries];

  const jsFiles = {};
  for (const f of fs.readdirSync(path.join(root, 'js')).filter((f) => f.endsWith('.js'))) {
    jsFiles['js/' + f] = read('js/' + f);
  }

  const adrs = {};
  for (const f of fs.readdirSync(path.join(root, 'docs/adr'))) {
    const m = f.match(/^(\d{4})-/);
    if (m) adrs[m[1]] = read('docs/adr/' + f);
  }
  const production = [
    ...glossaries,
    ...glob('docs/features', 'RULINGS.md').map((p) => ({ path: p, text: read(p) }))
  ];

  let commits = [];
  try {
    commits = execSync('git log --since=30.days --format=%as%x09%s', { cwd: root, encoding: 'utf8' })
      .trim().split('\n').filter(Boolean)
      .map((l) => { const [date, subject] = l.split('\t'); return { date, subject: subject || '' }; });
  } catch (e) { /* no git — ledger check runs empty */ }

  return {
    headerDiff: checkHeaderDiff(inventory, surfaces),
    codeContract: checkCodeContract(inventory, jsFiles),
    statusMarkers: checkStatusMarkers(inventory, domainMap),
    numericRestatement: checkNumericRestatement(domainMap),
    ledgerCurrency: checkLedgerCurrency(read('docs/SYNC-DEBT.md'), commits),
    freshness: checkFreshness(read('docs/GLOSSARY-QUICKREF.md'), glossaries),
    baselineSelf: checkBaselineSelf(inventory, registry, exists),
    adrStampDuty: checkAdrStampDuty(production, adrs)
  };
}

// -- CLI -------------------------------------------------------------------------

// Seven checks assert a definite defect: a header diverged, an identifier is
// absent, a stamp is missing, a baseline disagrees with itself. `ledgerCurrency`
// is the one that only ever guesses — its own finding says "possibly paid …
// verify and mark paid or dismiss". It is a reminder, and there is no way to mark
// one dismissed, so letting it set the exit status meant a single unlucky word
// match held the gate shut forever — and, behind `&&`, held the drift check with
// it. The law this tool prints on its own last line ("reports, never
// legislation") is the rule being applied here: it still reports, it no longer
// legislates. Classifying the remaining seven is `09-lint-hardening.md`'s job.
const ADVISORY = new Set(['ledgerCurrency']);

if (require.main === module) {
  const results = runAll(process.cwd());
  let blocking = 0;
  let advisory = 0;
  for (const [check, findings] of Object.entries(results)) {
    if (!findings.length) continue;
    if (ADVISORY.has(check)) advisory += findings.length;
    else blocking += findings.length;
    console.log(`\n[${check}] ${findings.length} finding(s)${ADVISORY.has(check) ? ' — advisory' : ''}`);
    for (const f of findings) console.log('  -', JSON.stringify(f));
  }
  const total = blocking + advisory;
  console.log(total === 0
    ? '\naudit-lint: clean (8 checks, 0 findings)'
    : `\naudit-lint: ${blocking} blocking, ${advisory} advisory — reports, never legislation; verify before acting.`);
  process.exitCode = blocking === 0 ? 0 : 1;
}

module.exports = {
  checkHeaderDiff, checkCodeContract, checkStatusMarkers,
  checkNumericRestatement, checkAdrStampDuty,
  checkLedgerCurrency, checkFreshness, checkBaselineSelf,
  parseSurfaceHeaders, splitDomainMapRows, runAll,
  normalizeName, nameSet, buildNameIndex, lookup
};
