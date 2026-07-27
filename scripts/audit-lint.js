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

// Status dictionary (documentation-law): ✅ ≡ AGREED or SEALED (SEALED is the
// strong form and implies AGREED) · ❓ ≡ PROPOSED · ⛔ ≡ rejected-recorded.
//
// `✅` was `s !== 'PROPOSED'` until 2026-07-27, which passed a ⛔-worthy row
// silently — the "too lax" half of the 2026-07-15 review's marker finding.
// Naming the accepted values is only safe now that `fieldDomains` (check 10)
// guarantees the status is inside the dictionary at all.
const MARKER_OK = {
  '✅': (s) => s === 'AGREED' || s === 'SEALED',
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

// -- check 9: definition restatement ----------------------------------------
// The prose half of the single-definition rule. `numericRestatement` (check 4)
// catches a DOMAIN_MAP row that restates a *value*; this catches one that
// restates the *definition itself* — the drift forensics F-04 named
// ("paraphrasing an authoritative definition as if normative is drift") and
// that no run ever swept for until audit run #3 found 19 live cases.
//
// Scope is exactly the rule, no wider: a row is only in scope when its term's
// birthplace is some OTHER surface. A project-native term whose birthplace IS
// `DOMAIN_MAP.md` is supposed to be defined there, so it is never a finding.
//
// Method: 5-word shingle overlap between the DOMAIN_MAP entry body and the
// term's birthplace row. Shingles, not substrings, because a legitimate summary
// reuses the same vocabulary — it is reused *phrasing* that marks a copy.

const RESTATEMENT_THRESHOLD = 0.25;

// EMPTY, and that is the point: the ratchet closed. Audit run #3 found 19
// restatements already in place (enumerated in
// `docs/audits/2026-07-26-audit-run-3.md`) and carried them here so a known
// backlog would not re-print on every lint. Enforcement-ladder stage 4
// (2026-07-28) re-cut all 56 promoted DOMAIN_MAP entries to summary + pointer,
// which drained the set and paid the debt.
//
// Keep it empty. A name added back is an amnesty for a copy that the re-cut
// already proved avoidable — rewrite the entry in summary voice instead. Five of
// the 56 needed exactly that second pass: they had kept the birthplace's own
// phrasing, this check caught each one, and rephrasing (not exempting) cleared
// them.
const RESTATEMENT_GRANDFATHERED = new Set([]);

function wordsOf(s) {
  return s.replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter((w) => w.length > 1);
}

function shingleOverlap(a, b, n = 5) {
  const A = wordsOf(a.toLowerCase());
  const B = wordsOf(b.toLowerCase());
  if (A.length < n || B.length < n) return 0;
  const shingles = (X) => {
    const s = new Set();
    for (let i = 0; i + n <= X.length; i++) s.add(X.slice(i, i + n).join(' '));
    return s;
  };
  const SA = shingles(A);
  const SB = shingles(B);
  let hit = 0;
  for (const x of SA) if (SB.has(x)) hit++;
  return hit / SA.size;
}

// The term's row at its birthplace: a GLOSSARY table row, or a bolded bullet
// (match-arc's "Frame decisions" section uses bullets) plus its continuation.
function birthplaceRowText(term, surfaceText) {
  const names = nameSet(term);
  const lines = surfaceText.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const cell = lines[i].match(GLOSSARY_ROW);
    if (cell && names.includes(normalizeName(cell[1]))) return lines[i];
    const bullet = lines[i].match(/^- \*\*([^*]+)\*\*/);
    if (bullet && names.includes(normalizeName(bullet[1]))) {
      const body = [lines[i]];
      for (let j = i + 1; j < lines.length; j++) {
        if (/^\s+\S/.test(lines[j]) && !/^- /.test(lines[j])) body.push(lines[j]);
        else break;
      }
      return body.join(' ');
    }
  }
  return '';
}

function checkDefinitionRestatement(inventory, domainMapText, surfaces) {
  const findings = [];
  const index = buildNameIndex(inventory);
  const byPath = new Map(surfaces.map((s) => [s.path, s.text]));

  for (const row of splitDomainMapRows(domainMapText)) {
    const name = row.match(DM_ROW)[2].trim();
    const term = lookup(index, name);
    if (!term || !term.birthplace || term.birthplace === 'DOMAIN_MAP.md') continue;
    if (RESTATEMENT_GRANDFATHERED.has(term.canonical)) continue;
    const home = byPath.get(term.birthplace);
    if (!home) continue; // birthplace not a scanned surface (ADR/model-doc born)
    const source = birthplaceRowText(term, home);
    if (!source) continue;
    const overlap = shingleOverlap(row, source);
    if (overlap < RESTATEMENT_THRESHOLD) continue;
    findings.push({
      kind: 'definition-restatement',
      term: term.canonical,
      birthplace: term.birthplace,
      overlap: Math.round(overlap * 100),
      detail: 'DOMAIN_MAP entry reuses its birthplace definition\'s phrasing; '
        + 'a promoted term gets summary + pointer, never a normative copy'
    });
  }
  return findings;
}

// -- check 10: inventory field domains ---------------------------------------
// The enum half of inventory schema v2 (doc-structure ticket 03, ruled
// 2026-07-15), which declares itself VOID without an enforcing check: the same
// drift was reported on 2026-07-10 and had recurred and worsened five days
// later, because nothing but prose forbade it.
//
// `status` carries the NAME axis and nothing else. A settled name whose values
// are still provisional is `AGREED`, with the provisionality written in the
// row's value column (`가안`) — that separation is what the 2026-07-27
// normalization applied to ten birthplace rows across four features.
//
// `verdict` is audit-owned and null until a run judges it (HARVEST step 6), so
// absent and null both pass. Blocking on them would gate every newly sealed
// term behind the next audit run.

const FIELD_DOMAINS = {
  status: new Set(['AGREED', 'PROPOSED', 'rejected-recorded', 'SEALED']),
  kind: new Set(['mechanism', 'meta']),
  verdict: new Set(['justified-coinage', 'standard-match', 'synonym-exists'])
};

const FIELD_NULLABLE = new Set(['verdict']);

// Empty by design (2026-07-27). The batch that landed this check normalized
// every off-domain row at its birthplace first, so there was nothing left to
// exempt. It stays because the ladder's third invariant requires every blocking
// check to ship with one: a later domain change adds `Canonical|field` entries
// here instead of blocking work that predates the change.
const DOMAIN_GRANDFATHERED = new Set();

function checkFieldDomains(inventory, grandfathered = DOMAIN_GRANDFATHERED) {
  const findings = [];
  for (const t of inventory.terms) {
    for (const [field, domain] of Object.entries(FIELD_DOMAINS)) {
      const value = t[field] === undefined ? null : t[field];
      if (FIELD_NULLABLE.has(field) && value === null) continue;
      if (domain.has(value)) continue;
      if (grandfathered.has(`${t.canonical}|${field}`)) continue;
      findings.push({
        kind: 'off-domain-field',
        term: t.canonical,
        field,
        value,
        path: INVENTORY,
        detail: value === null
          ? `${field} is missing; it must be one of (${[...domain].join(' | ')})`
          : `${field} "${value}" is outside its domain (${[...domain].join(' | ')})`
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

  // Code-asset scan (Wayfinder gate 05 D5, executed by build ticket 01).
  //
  // Recursive over BOTH roots, and over TypeScript as well as JavaScript, so a
  // graduated term's `codeRefs` resolve once its behavior is re-implemented in
  // the L3 tree. D5 (2) keeps a term's refs pointing at `js/` until that
  // re-implementation is parity-verified — this widens the scanner's field of
  // view, not its strictness, and D5 (3) keeps `code-contract` blocking.
  const CODE_ROOTS = ['js', 'game/src'];
  const CODE_EXTENSIONS = ['.js', '.ts', '.tsx'];

  const jsFiles = {};
  const walkCode = (rel) => {
    const abs = path.join(root, rel);
    if (!fs.existsSync(abs)) return; // existing roots only
    for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
      const child = path.posix.join(rel, entry.name);
      if (entry.isDirectory()) {
        walkCode(child);
      } else if (CODE_EXTENSIONS.some((ext) => entry.name.endsWith(ext))) {
        jsFiles[child] = read(child);
      }
    }
  };
  for (const codeRoot of CODE_ROOTS) walkCode(codeRoot);

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
    definitionRestatement: checkDefinitionRestatement(inventory, domainMap, surfaces),
    ledgerCurrency: checkLedgerCurrency(read('docs/SYNC-DEBT.md'), commits),
    freshness: checkFreshness(read('docs/GLOSSARY-QUICKREF.md'), glossaries),
    fieldDomains: checkFieldDomains(inventory),
    baselineSelf: checkBaselineSelf(inventory, registry, exists),
    adrStampDuty: checkAdrStampDuty(production, adrs)
  };
}

// -- prescriptions ---------------------------------------------------------------
//
// A finding names a defect. An agent blocked by one needs three more things, and
// these are user-sealed requirements (2026-07-26), not presentation preferences:
//
//   1. The FIX, with its BOUNDS — which file to patch and what may not be put in
//      it. A diagnosis-only message makes an agent guess, and a guessing agent
//      writes a junk row to get unblocked.
//   2. The SECOND legitimate exit — not registering. An agent shown only "add the
//      row" will add any row. Every remedy that could manufacture a bad
//      registration therefore also offers "remove it and ask the user".
//   3. A refusal of the bypass. Reaching for `--no-verify` is the natural
//      response to being blocked mid-task, so the prohibition has to live where
//      the block is read.
//
// This lives here, not in the hooks, for the reason this whole audit exists: the
// commit hook, the push hook, CI, and `write-lint.js` are four consumers, and
// writing the wording per-consumer would copy the same prose four times.
// `write-lint.js` inherits it for free — it captures this CLI's stdout.

const INVENTORY = 'docs/audits/term-inventory.json';

// kind -> (finding) -> remedy lines. Diagnosis is rendered by the caller.
const PRESCRIPTIONS = {
  'unregistered-definition': () => [
    'Choose one:',
    ` (a) Register it — add a row to ${INVENTORY} (ritual duty 7).`,
    '     INDEX FIELDS ONLY — never definition text (single-definition rule).',
    ' (b) Do not register it — if you are unsure the term earns a row, remove',
    '     the definition and ask the user.'
  ],
  'orphaned-inventory-row': (f) => [
    `Its birthplace (${f.path}) no longer carries the name at all. Either the`,
    'definition moved (repoint `birthplace`), it was renamed (add the old name',
    `as an alias), or it was retired (drop the row from ${INVENTORY}).`,
    'Check every definition surface before dropping — a term promoted to a',
    'second surface still has a live header there (audit run #2 lesson).'
  ],
  'code-contract-violation': (f) => [
    `The row claims identifier \`${f.identifier}\`, absent from every file it`,
    'names. Correct the identifier or the refs — or, if the code was retired,',
    'clear both. Do not rename the code to satisfy the index.'
  ],
  'status-marker-mismatch': () => [
    'The DOMAIN_MAP marker and the inventory status disagree (✅ ≡ AGREED or',
    'SEALED · ❓ ≡ PROPOSED · ⛔ ≡ rejected-recorded). Fix whichever is stale —',
    'the seal at the birthplace decides which one that is, not this message.'
  ],
  'off-domain-field': (f) => [
    `Legal values for \`${f.field}\`: ${[...(FIELD_DOMAINS[f.field] || [])].join(' | ')}`
      + (FIELD_NULLABLE.has(f.field) ? ' — or null, pending the next audit run.' : '.'),
    ...(f.field === 'status' ? [
      'Status is the NAME axis only. A settled name whose VALUES are still',
      'provisional is `AGREED`, with the provisionality in the row\'s value',
      'column (`가안`) — never as a status word.'
    ] : []),
    'Fix it in BOTH the inventory row and the birthplace that produced the',
    'value — the index transcribes the birthplace, so patching one alone',
    're-drifts at the next harvest (HARVEST.md step 4).',
    'If the value expresses something the dictionary genuinely cannot, do NOT',
    'invent a fifth — the dictionary is documentation-law (Tier 3). Ask the',
    'user, as ticket 03 Q1 did for `SEALED`.'
  ],
  'numeric-restatement': () => [
    'The row points at an owning doc AND restates a value. Delete the number;',
    'the pointer is the whole job (single-definition rule).'
  ],
  'definition-restatement': (f) => [
    `A promoted term gets summary + pointer. Cut this entry down to one or two`,
    `lines plus "authoritative: ${f.birthplace}".`,
    'If the entry is not a copy, say why in the report — do not widen the',
    'grandfather list to get to green.'
  ],
  'unstamped-adr-amendment': (f) => [
    `Stamp ADR ${f.adr}'s header — "Amended by <ref> (date)" plus a one-line`,
    'delta — in THIS batch. A stale ADR read in isolation must announce its own',
    'staleness; dates alone are not protection.'
  ],
  'stale-quickref': () => [
    'Regenerate docs/GLOSSARY-QUICKREF.md including this batch\'s own seals, and',
    'stamp its "last regenerated" date (ritual duty 4).'
  ],
  'missing-birthplace': (f) => [
    `An inventory row points at ${f.path}, which does not exist. Repoint the row`,
    'or drop it — the index may not cite a file that is gone.'
  ],
  'dead-registry-path': (f) => [
    `docs/audits/doc-registry.json lists ${f.path}, which does not exist.`,
    'Drop the row, or restore the file if it was deleted by mistake.'
  ],
  'duplicate-canonical': () => [
    'Two inventory rows answer to one canonical name. Merge them — one row per',
    'concept (HARVEST step 3, birthplace priority decides which survives).'
  ],
  'alias-canonical-collision': () => [
    'An alias collides with another term\'s canonical name, so name lookup is',
    'ambiguous. Rename the alias or drop it.'
  ],
  'ledger-possibly-paid': () => [
    'Advisory, and a guess: verify the row against the commit. If genuinely',
    'paid, mark it [x]; if the match is incidental, LEAVE IT STANDING — a',
    'verified-spurious advisory is the correct outcome, not a loose end.'
  ]
};

// One line naming what and where, from whichever fields the kind carries.
// `birthplace` is NOT a fallback location: on a restatement finding the defect
// is in DOMAIN_MAP while `birthplace` names the file being copied FROM, so
// printing it as "at" would send the fix to the wrong file.
const DEFECT_SITE = {
  'definition-restatement': 'DOMAIN_MAP.md',
  'numeric-restatement': 'DOMAIN_MAP.md',
  'status-marker-mismatch': 'DOMAIN_MAP.md',
  'duplicate-canonical': INVENTORY,
  'alias-canonical-collision': INVENTORY,
  'code-contract-violation': INVENTORY,
  'ledger-possibly-paid': 'docs/SYNC-DEBT.md'
};

function describeFinding(finding) {
  const subject = finding.term || (finding.adr && `ADR ${finding.adr}`) || finding.row;
  const where = DEFECT_SITE[finding.kind] || finding.path;
  const head = [finding.kind, subject && `\`${subject}\``].filter(Boolean).join(': ');
  return where ? `${head}\n  at ${where}` : head;
}

function prescriptionFor(finding) {
  const remedy = PRESCRIPTIONS[finding.kind];
  // An unknown kind is a new check that shipped without a prescription. Say so
  // rather than printing nothing — silence would read as "no action needed".
  return (remedy ? remedy(finding) : [
    `No prescription is registered for \`${finding.kind}\`. Read the check in`,
    'scripts/audit-lint.js and add one before relying on this message.'
  ]).map((l) => `  ${l}`);
}

function formatFinding(finding) {
  const lines = [describeFinding(finding)];
  if (finding.detail) lines.push(`  ${finding.detail}`);
  return [...lines, '', ...prescriptionFor(finding)].join('\n');
}

// The bypass refusal is unconditional on blocking findings: a `--no-verify` is
// reached for from wherever the block was read, including a manual run.
const BYPASS_REFUSAL =
  'Do not bypass with --no-verify. CI runs this same check and will catch it.';

// The remedy is a property of the KIND, so N findings of one kind share one
// prescription: list the sites, then say what to do about them once. Repeating
// identical advice per finding is the alarm fatigue this tool warns about.
function formatReport(results) {
  const { blocking, advisory } = tally(results);
  const out = [];
  for (const [check, findings] of Object.entries(results)) {
    if (!findings.length) continue;
    out.push(`\n[${check}] ${findings.length} finding(s)${ADVISORY.has(check) ? ' — advisory' : ''}`);
    const byKind = new Map();
    for (const f of findings) {
      if (!byKind.has(f.kind)) byKind.set(f.kind, []);
      byKind.get(f.kind).push(f);
    }
    for (const group of byKind.values()) {
      for (const f of group) {
        out.push(describeFinding(f));
        if (f.detail) out.push(`  ${f.detail}`);
      }
      out.push('', ...prescriptionFor(group[0]), '');
    }
  }
  out.push(blocking + advisory === 0
    ? '\naudit-lint: clean (9 checks, 0 findings)'
    : `\naudit-lint: ${blocking} blocking, ${advisory} advisory — reports, never legislation; verify before acting.`);
  if (blocking > 0) out.push(BYPASS_REFUSAL);
  return out.join('\n');
}

// -- CLI -------------------------------------------------------------------------

// Which checks gate. All eight were examined deliberately on 2026-07-17; the
// rationale per check is recorded in `docs/SYNC-DEBT.md`. Two rules decide it:
//
//   1. The check must ASSERT a defect, not guess at one. `ledgerCurrency` only
//      ever guesses — its own finding says "possibly paid … verify and mark paid
//      or dismiss".
//   2. The finding must have a REACHABLE green state: doing the right thing must
//      clear it. This is the rule `ledgerCurrency` actually broke. There is no
//      way to mark a false match dismissed, so one unlucky word match held the
//      gate shut forever — and, behind `&&`, held the drift check with it.
//
// `freshness` is the near miss worth naming: its date scoping is loose (any date
// on a glossary surface counts as a seal — `09-lint-hardening.md` item 3), so it
// can fire on an incidental date. It still gates, because rule 2 holds — its
// remedy is to regenerate the QUICKREF and stamp the date, which is ritual duty 4
// itself, and the law names this check as that duty's target ("the 'last
// regenerated' date is the lint's freshness target"). A check whose false
// positive is cleared by performing the duty is a blunt reminder, not a trap.
//
// Blocking is not a violation of "reports, never legislation" (S13, printed on
// this tool's own last line). S13 is separation of powers: this tool APPLIES
// user-sealed law and never AMENDS it. Enforcing a sealed duty is the judicial
// half. The exit status is also what `scripts/hooks/write-lint.js` triggers on
// (it returns early at exit 0), so advisory findings surface on a manual
// `npm run lint:docs` — the duty-7 session-close path — and stay out of the
// per-edit hook, where a standing reminder would be alarm fatigue by design.
const ADVISORY = new Set(['ledgerCurrency']);

// Split a results object into blocking vs advisory tallies. The exit status keys
// off `blocking` only, so this decision — not the console output around it — is
// what gates lint:docs, and it is exported so a test can pin it.
function tally(results) {
  let blocking = 0;
  let advisory = 0;
  for (const [check, findings] of Object.entries(results)) {
    if (!findings.length) continue;
    if (ADVISORY.has(check)) advisory += findings.length;
    else blocking += findings.length;
  }
  return { blocking, advisory };
}

if (require.main === module) {
  const results = runAll(process.cwd());
  const { blocking } = tally(results);
  // `--quiet`: say nothing unless something blocks. This is for the enforcement
  // hooks, which run on EVERY commit and push. The advisory tally is expected to
  // sit non-zero forever (a fuzzy commit match has no way to be marked
  // dismissed), so printing it each time would be a standing reminder nobody
  // reads — the alarm fatigue this tool warns about elsewhere, manufactured by
  // its own gate. Advisories still surface on a bare `npm run lint:docs`, the
  // session-close path where triaging them is the actual duty.
  //
  // This is a verbosity flag, not a second entry point: the checks, the tally,
  // and the exit status are identical either way.
  const quiet = process.argv.includes('--quiet');
  if (!quiet || blocking > 0) console.log(formatReport(results));
  process.exitCode = blocking === 0 ? 0 : 1;
}

module.exports = {
  checkHeaderDiff, checkCodeContract, checkStatusMarkers,
  checkNumericRestatement, checkDefinitionRestatement, checkAdrStampDuty,
  checkFieldDomains, FIELD_DOMAINS, DOMAIN_GRANDFATHERED,
  checkLedgerCurrency, checkFreshness, checkBaselineSelf,
  parseSurfaceHeaders, splitDomainMapRows, runAll,
  normalizeName, nameSet, buildNameIndex, lookup,
  shingleOverlap, birthplaceRowText,
  formatFinding, formatReport, describeFinding,
  tally, ADVISORY, RESTATEMENT_GRANDFATHERED, PRESCRIPTIONS, BYPASS_REFUSAL
};
