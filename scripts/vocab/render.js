// Vocabulary dashboard — the render stage.
// Pure: a model in, one self-contained HTML string out. No fs, no network.
// Everything is inline because the page is opened from `file://` out of
// gitignored `dist/vocab/` — no CDN, no webfont, no fetch.
//
// Composition: docs/superpowers/specs/2026-07-28-vocab-dashboard-composition.md
// Architecture: docs/superpowers/specs/2026-07-28-vocab-dashboard-design.md
//
// Two rules from the documentation law are enforced HERE rather than trusted to
// layout discipline, and `tests/vocab-render.test.js` holds them:
//   1. the row's shape never varies with gloss provenance;
//   2. provenance appears only in the detail markup.
'use strict';

const { displayGloss, namesOf } = require('./entry');

// Plans leave the term list: each is a schema'd record (ADR 0024), not a word
// whose meaning you look up. The umbrella term stays behind.
const PLAN_UMBRELLA = 'Operation plan catalog';
const PLAN_CATALOG = 'docs/features/operation-plan-catalog/CATALOG.md';

function esc(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Markdown emphasis and code markers rendered as text. Not an edit to the
// quotation: `**AGREED**` shown as literal asterisks is unrendered markup, and
// 108 of the real glosses carry it. The words are untouched.
function plain(text) {
  return String(text)
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\*\*([^*]*)\*\*/g, '$1')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1$2')
    .replace(/(^|[^\p{L}\p{N}_])_([^_]+)_(?![\p{L}\p{N}])/gu, '$1$2')
    .replace(/\s+/g, ' ')
    .trim();
}

function termId(canonical) {
  return canonical
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '');
}

// 17 birthplace paths, up to 63 characters, repeating heavily. The row shows the
// feature; the detail shows the whole path, which is the citable form.
function shortSource(birthplace) {
  const adr = birthplace.match(/^docs\/adr\/(\d+)/);
  if (adr) return `ADR ${adr[1]}`;
  const feature = birthplace.match(/^docs\/features\/([^/]+)\/([^/]+)\.md$/);
  if (feature) {
    const [, name, file] = feature;
    return file === 'GLOSSARY' ? name : `${name}/${file}`;
  }
  return birthplace.replace(/\.md$/, '');
}

// AGREED is 92% of the vocabulary, so it earns no mark at all. PROPOSED is the
// only status worth surfacing; SEALED is MORE settled, not less, and must never
// share a treatment with PROPOSED; the single tombstone stays findable so a
// rejected name is not coined again.
const MARKS = {
  PROPOSED: { glyph: '◇', cls: 'proposed', title: 'PROPOSED — the name is not settled yet' },
  SEALED: { glyph: '◆', cls: 'sealed', title: 'SEALED — settled, with a dated seal behind it' },
  'rejected-recorded': { glyph: '✕', cls: 'rejected', title: 'rejected — recorded so the name is not re-coined' }
};

function markOf(status) {
  const mark = MARKS[status];
  if (!mark) return '';
  return `<span class="mark ${mark.cls}" title="${esc(mark.title)}">${mark.glyph}</span>`;
}

// The searchable string: canonical, 한국어, aliases, code identifier. NOT the
// gloss — matching prose would make results unpredictable.
function searchKey(entry) {
  return namesOf(entry).join(' ').toLowerCase();
}

// The row. Its shape is fixed: name, 한국어, exception mark, source, preview.
// A missing 한국어 closes the line up rather than leaving a placeholder — 34% of
// terms have none, and a third of the list must not look broken. A missing
// gloss leaves the preview element empty: a blank slot, never a demotion.
function rowHtml(entry) {
  const id = termId(entry.canonical);
  const korean = entry.korean ? `<span class="ko">${esc(entry.korean)}</span>` : '';
  // A `context` gloss is the passage that NAMES the term, not its definition.
  // The row is the one place provenance may not be shown, so an unattributable
  // quotation stays out of it — a blank slot, which the law permits, rather
  // than another term's sentence posing as this one's meaning.
  const own = entry.gloss && entry.gloss.source !== 'context' ? entry.gloss.text : null;
  const preview = esc(plain(own || (entry.tier0 ? entry.tier0.summary : '')));
  return [
    `<li class="row" data-key="${esc(searchKey(entry))}" data-src="${esc(entry.birthplace)}">`,
    `<a class="pick" href="#t-${id}"><span class="name">${esc(entry.canonical)}</span>${korean}</a>`,
    markOf(entry.status),
    `<span class="under">`,
    `<button class="src" type="button" data-src="${esc(entry.birthplace)}">${esc(shortSource(entry.birthplace))}</button>`,
    `<span class="pre">${preview}</span>`,
    `</span>`,
    `</li>`
  ].join('');
}

// Provenance lives here and nowhere else. Beside one open term it is
// information; as a badge across 254 rows it would rebuild the hierarchy the
// uniform-weight rule removes.
function provenanceHtml(gloss) {
  if (!gloss) return '';
  if (gloss.source === 'authored') {
    return '<p class="prov">authored summary — written by the definition\'s own author</p>';
  }
  if (gloss.source === 'context') {
    return `<p class="prov">context — quoted from the passage on <b>${esc(gloss.contextOf)}</b>, which is where this term is named. <em>Not this term's own definition.</em></p>`;
  }
  return '<p class="prov">excerpt — quoted verbatim from its birthplace</p>';
}

function detailHtml(entry, root) {
  const id = termId(entry.canonical);
  const korean = entry.korean ? ` <span class="ko">${esc(entry.korean)}</span>` : '';
  const meta = [entry.status, `Tier ${entry.tier}`, entry.kind].filter(Boolean).map(esc).join(' · ');
  const aliases = (entry.aliases || []).length
    ? `<p class="aliases"><span class="lbl">also</span> ${(entry.aliases).map(esc).join(' · ')}</p>`
    : '';
  const code = entry.codeIdentifier
    ? `<p class="code"><span class="lbl">code</span> <code>${esc(entry.codeIdentifier)}</code></p>`
    : '';

  // Full text, never trimmed. Cutting a quotation to fit a card silently edits
  // it, which is the failure quoting-instead-of-summarising exists to avoid.
  const gloss = displayGloss(entry);
  const quote = gloss
    ? `<blockquote class="quote">${esc(plain(gloss.text))}</blockquote>`
    : '<p class="noquote">No quotable definition row at its birthplace. Follow the pointer.</p>';

  return [
    `<article class="detail" id="t-${id}">`,
    `<h2>${esc(entry.canonical)}${korean}</h2>`,
    `<p class="meta">${meta}</p>`,
    aliases,
    code,
    quote,
    provenanceHtml(gloss),
    `<a class="ptr" href="${esc(root + entry.anchor)}">→ ${esc(entry.anchor)}</a>`,
    `</article>`
  ].join('');
}

function lockHtml(lock, generatedAt, sourceCommit) {
  // One bar carries all of the page's provenance: when it was rendered, what
  // revision it was rendered from, when the vocabulary was last REVIEWED, and
  // what has moved since. Rendered-vs-locked is the distinction the whole
  // lock-point model rests on, so both dates are stated rather than inferred.
  const stamp = [
    generatedAt ? `rendered <b>${esc(generatedAt)}</b>` : '',
    sourceCommit ? `from <code>${esc(String(sourceCommit).slice(0, 7))}</code>` : ''
  ].filter(Boolean).join(' ');

  if (!lock) {
    return `<footer class="lock">${stamp}<span class="sep">—</span>` +
      '<span class="muted">no lock marker yet: nothing has been reviewed as a baseline</span></footer>';
  }

  const figures = [
    ['new', lock.added],
    ['renamed', lock.renamed],
    ['re-statused', lock.restatused],
    ['redefined', lock.redefined],
    ['withdrawn', lock.removed]
  ].filter(([, n]) => typeof n === 'number');

  const moved = figures.some(([, n]) => n > 0);
  const reading = moved
    ? figures
      .map(([label, n]) => `<span class="fig${n > 0 ? ' moved' : ''}">${n} ${label}</span>`)
      .join('<span class="dot">·</span>')
    : `<span class="muted">no drift since ${esc(lock.date)}</span>`;

  return [
    '<footer class="lock">',
    stamp,
    stamp ? '<span class="sep">—</span>' : '',
    `<span class="lockat">locked <b>${esc(lock.date)}</b>`,
    lock.auditRun != null ? ` (auditRun ${esc(lock.auditRun)})` : '',
    '</span>',
    '<span class="sep">—</span>',
    reading,
    '</footer>'
  ].join('');
}

// A plan is a record, so it renders as aligned columns rather than as a term
// row with a gloss. Availability and identity are prose and belong in the
// detail; the list carries what columns can hold.
function planRowHtml(plan) {
  const id = termId(plan.name);
  const axes = plan.effectAxes.core.concat(plan.effectAxes.secondary);
  return [
    `<li class="row prow" data-key="${esc([plan.name, plan.korean].filter(Boolean).join(' ').toLowerCase())}" data-src="${esc(PLAN_CATALOG)}">`,
    `<a class="pick" href="#p-${id}"><span class="name">${esc(plan.name)}</span>`,
    plan.korean ? `<span class="ko">${esc(plan.korean)}</span>` : '',
    '</a>',
    `<span class="col risk">${plan.risk ? esc(plain(plan.risk).split(/(?<=\.)\s/)[0]) : ''}</span>`,
    `<span class="col axes">${axes.length ? axes.map((a) => `<code>${esc(a)}</code>`).join(' ') : ''}</span>`,
    '</li>'
  ].join('');
}

function planDetailHtml(plan, root) {
  const id = termId(plan.name);
  const field = (label, text) => (text
    ? `<p class="pfield"><span class="lbl">${label}</span> ${esc(plain(text))}</p>`
    : '');
  const axisList = (label, list) => (list.length
    ? `<p class="pfield"><span class="lbl">${label}</span> ${list.map((a) => `<code>${esc(a)}</code>`).join(' · ')}</p>`
    : '');

  return [
    `<article class="detail" id="p-${id}">`,
    `<h2>${esc(plan.name)}${plan.korean ? ` <span class="ko">${esc(plan.korean)}</span>` : ''}</h2>`,
    '<p class="meta">operation plan · a schema\'d record, not vocabulary (ADR 0024)</p>',
    field('identity', plan.identity),
    axisList('core', plan.effectAxes.core),
    axisList('secondary', plan.effectAxes.secondary),
    axisList('no effect', plan.effectAxes.none),
    field('risk', plan.risk),
    field('availability', plan.availability),
    `<a class="ptr" href="${esc(root + PLAN_CATALOG)}">→ ${esc(PLAN_CATALOG)}</a>`,
    '</article>'
  ].join('');
}

const CSS = `
:root{
  color-scheme:dark;
  --bg:oklch(0.090 0 0); --surface:oklch(0.145 0 0); --line:oklch(0.240 0 0);
  --ink:oklch(0.930 0.008 60); --muted:oklch(0.650 0.006 60);
  --primary:oklch(0.650 0.146 60); --accent:oklch(0.860 0.090 230);
  --ui:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Noto Sans KR","Malgun Gothic",sans-serif;
  --mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  --t-meta:.6875rem; --t-path:.75rem; --t-row:.8125rem; --t-read:.9375rem; --t-head:1.0625rem;
  --z-sticky:10;
}
*{box-sizing:border-box}
html,body{height:100%}
body{
  margin:0; background:var(--bg); color:var(--ink);
  font:var(--t-row)/1.5 var(--ui);
  display:grid; grid-template-rows:auto auto 1fr auto;
}

/* --- header ------------------------------------------------------------- */
.top{
  display:flex; gap:.75rem; align-items:center;
  padding:.5rem .75rem; background:var(--surface);
  border-bottom:1px solid var(--line); position:sticky; top:0; z-index:var(--z-sticky);
}
#q{
  flex:1; min-width:0; appearance:none;
  background:var(--bg); color:var(--ink); font:var(--t-row) var(--ui);
  border:1px solid var(--line); border-radius:4px; padding:.35rem .5rem;
}
#q::placeholder{color:var(--muted)}
#q:focus-visible{outline:2px solid var(--accent); outline-offset:1px; border-color:transparent}
.modes{display:flex; gap:.25rem}
.mode{
  font:var(--t-meta) var(--ui); letter-spacing:.02em;
  background:none; color:var(--muted); border:1px solid transparent;
  border-radius:4px; padding:.3rem .55rem; cursor:pointer;
}
.mode:hover{color:var(--ink)}
.mode.on{color:var(--ink); background:var(--bg); border-color:var(--line)}
.mode b{font-variant-numeric:tabular-nums; font-weight:600}
.mode:focus-visible{outline:2px solid var(--accent); outline-offset:1px}

.filter{
  display:inline-flex; align-items:center; gap:.35rem; flex:none;
  font-size:var(--t-meta); color:var(--muted);
}
.filter b{color:var(--primary); font-family:var(--mono); font-weight:400}
.filter button{
  background:none; border:1px solid var(--line); border-radius:3px;
  color:var(--muted); font:var(--t-meta) var(--ui); padding:.1rem .35rem; cursor:pointer;
}
.filter button:hover{color:var(--ink)}

/* --- two panes ---------------------------------------------------------- */
/* Reads as a panel rather than a stretched page: the list keeps its width and
   the detail keeps its measure, so a wide window adds margin, not sprawl. */
.body{
  display:grid; grid-template-columns:340px minmax(0,1fr);
  min-height:0; width:100%; max-width:1100px; margin:0 auto;
  border-inline:1px solid var(--line);
}
.listpane{overflow-y:auto; border-right:1px solid var(--line)}
.list{list-style:none; margin:0; padding:0}

.row{padding:.4rem .75rem .45rem; border-bottom:1px solid var(--line); position:relative}
.row.on{background:var(--surface)}
.row.on .name{color:var(--ink)}
.pick{
  display:flex; align-items:baseline; gap:.4rem; flex-wrap:wrap;
  text-decoration:none; color:inherit;
}
.pick:focus-visible{outline:2px solid var(--accent); outline-offset:2px}
.name{color:var(--ink); font-weight:500}
.ko{color:var(--muted); font-size:var(--t-path)}
.mark{position:absolute; top:.4rem; right:.75rem; font-size:var(--t-meta); line-height:1.5}
.mark.proposed{color:var(--accent)}
.mark.sealed,.mark.rejected{color:var(--muted)}
.under{display:flex; gap:.4rem; align-items:baseline; margin-top:.1rem; min-width:0}
.src{
  flex:none; background:none; border:0; padding:0; cursor:pointer;
  color:var(--primary); font:var(--t-path) var(--mono); text-align:left;
}
.src:hover{text-decoration:underline}
.src:focus-visible{outline:2px solid var(--accent); outline-offset:2px}
.pre{
  flex:1; min-width:0; color:var(--muted); font-size:var(--t-path);
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
}

/* --- detail ------------------------------------------------------------- */
.pane{overflow-y:auto; padding:1.1rem 1.25rem 2rem; max-width:64ch}
.detail{display:none}
.detail:target{display:block; animation:in 160ms ease-out}
@keyframes in{from{opacity:0}to{opacity:1}}
.pane:has(.detail:target) .empty{display:none}
.empty{color:var(--muted); font-size:var(--t-read); line-height:1.6; max-width:46ch}
.empty b{color:var(--ink); font-weight:500}
.detail h2{
  margin:0 0 .15rem; font-size:var(--t-head); font-weight:600; letter-spacing:-.01em;
  text-wrap:balance;
}
.detail h2 .ko{font-size:var(--t-read); font-weight:400}
.meta{
  margin:0 0 .9rem; font-size:var(--t-meta); color:var(--muted);
  text-transform:none; letter-spacing:.03em;
}
.aliases,.code{margin:.15rem 0; font-size:var(--t-path); color:var(--muted)}
.lbl{color:var(--muted); opacity:.7; margin-right:.3rem}
.code code{font-family:var(--mono); color:var(--ink)}
.quote{
  margin:.9rem 0 .5rem; padding:0; color:var(--ink);
  font-size:var(--t-read); line-height:1.62; text-wrap:pretty;
}
.noquote{color:var(--muted); font-size:var(--t-read)}
.prov{margin:.1rem 0 1.1rem; font-size:var(--t-meta); color:var(--muted)}
.prov b{color:var(--ink); font-weight:500}
.prov em{font-style:normal; color:var(--accent)}
.ptr{
  display:inline-block; color:var(--primary); font:var(--t-path) var(--mono);
  text-decoration:none; border-bottom:1px solid transparent; padding-bottom:1px;
}
.ptr:hover{border-bottom-color:var(--primary)}
.ptr:focus-visible{outline:2px solid var(--accent); outline-offset:2px}

/* --- plan records ------------------------------------------------------- */
/* Columns, not a gloss: a plan is a record with a schema (ADR 0024). */
.prow{display:block}
/* Three stacked lines, not four side-by-side columns. Measured: a 340px list
   cannot seat a name beside a risk clause: Encirclement and Annihilation is
   29 characters, so anything sharing its line wraps it, and wrapped names
   destroy the alignment a column view exists to provide. Each field therefore
   gets its own full-width line and every row is the same height. Risk and
   availability are prose (7 of 12 records state risk as a sentence, not a
   level); the detail carries them whole. */
.prow .pick{display:flex; gap:.4rem; align-items:baseline; min-width:0}
.prow .risk,.prow .axes{
  display:block; margin-top:.1rem;
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
}
.prow .risk{color:var(--muted); font-size:var(--t-meta)}
/* Three records state their axes in a form no parser should guess at, so their
   line comes out empty. It keeps its height anyway: an uneven list reads as a
   rendering fault rather than as what it is, a record that says something else. */
.prow .axes{min-height:1.15em}
.prow .axes code{
  font:var(--t-meta) var(--mono); color:var(--primary);
  margin-right:.4rem;
}
.pfield{margin:.35rem 0; font-size:var(--t-path); color:var(--ink); line-height:1.55}
.pfield .lbl{
  display:inline-block; min-width:5.5rem; color:var(--muted);
  font-size:var(--t-meta); vertical-align:baseline;
}
.pfield code{font-family:var(--mono); color:var(--primary)}

.nomatch{padding:1rem .75rem; color:var(--muted); font-size:var(--t-path)}

/* --- lock bar ----------------------------------------------------------- */
.lock{
  display:flex; align-items:center; gap:.4rem; flex-wrap:wrap;
  padding:.45rem .75rem; background:var(--surface);
  border-top:1px solid var(--line); font-size:var(--t-meta); color:var(--muted);
}
.lock b{color:var(--ink); font-weight:500}
.lock code{font-family:var(--mono)}
.fig{font-variant-numeric:tabular-nums}
.fig.moved{color:var(--accent)}
.dot,.sep{opacity:.5}
.muted{color:var(--muted)}

/* --- structural responsive (not fluid type) ----------------------------- */
.back{display:none}

@media (max-width:720px){
  .body{grid-template-columns:1fr}
  .listpane{border-right:0}
  .pane{display:none}
  .pane:has(.detail:target){
    display:block; position:fixed; inset:0; background:var(--bg);
    z-index:calc(var(--z-sticky) + 1); overflow-y:auto; padding-top:.6rem;
  }
  .pane:has(.detail:target) .empty{display:none}
  /* The overlay hides the list, so it must carry its own way out: a touch
     device has no Escape key. */
  .pane:has(.detail:target) .back{
    display:block; margin:0 0 1rem; color:var(--muted);
    font-size:var(--t-path); text-decoration:none;
  }
  .pane:has(.detail:target) .back:hover{color:var(--ink)}
  .pane:has(.detail:target) .back:focus-visible{outline:2px solid var(--accent); outline-offset:2px}
}
@media (max-width:420px){
  .pick{display:block}
  .ko{display:block}
}
@media (prefers-reduced-motion:reduce){
  .detail:target{animation:none}
  *{transition:none !important}
}
`;

const JS = `
(function(){
  var q=document.getElementById('q'), bar=document.getElementById('filter');
  var lists={terms:document.getElementById('terms'),plans:document.getElementById('plans')};
  var nomatch=document.querySelector('.nomatch'), srcFilter=null, mode='terms';

  function apply(){
    var needle=(q.value||'').trim().toLowerCase(), list=lists[mode], shown=0;
    if(!list) return;
    Array.prototype.forEach.call(list.children,function(row){
      var ok=(!needle||row.dataset.key.indexOf(needle)>=0)
           &&(!srcFilter||row.dataset.src===srcFilter);
      row.hidden=!ok; if(ok) shown++;
    });
    var badge=document.querySelector('[data-count="'+mode+'"]');
    if(badge) badge.textContent=(needle||srcFilter)?shown+'/'+list.children.length:list.children.length;
    nomatch.hidden=shown>0;
    nomatch.textContent=needle
      ? 'No term matches "'+needle+'". '+list.children.length+' registered.'
      : 'Nothing in this filter.';
  }

  q.addEventListener('input',apply);

  document.addEventListener('click',function(e){
    var src=e.target.closest('.src');
    if(src){ srcFilter=src.dataset.src; draw(); apply(); return; }
    var clear=e.target.closest('#filter button');
    if(clear){ srcFilter=null; draw(); apply(); return; }
    var mode_=e.target.closest('.mode');
    if(mode_){ setMode(mode_.dataset.mode); }
  });

  function draw(){
    bar.hidden=!srcFilter;
    if(srcFilter) bar.innerHTML='source <b>'+srcFilter+'</b> <button type="button">clear</button>';
  }

  function setMode(next){
    mode=next;
    Array.prototype.forEach.call(document.querySelectorAll('.mode'),function(b){
      b.classList.toggle('on',b.dataset.mode===next);
    });
    Object.keys(lists).forEach(function(k){ if(lists[k]) lists[k].hidden=k!==next; });
    apply();
  }

  function mark(){
    var id=location.hash.slice(1);
    Array.prototype.forEach.call(document.querySelectorAll('.row'),function(row){
      var a=row.querySelector('.pick');
      row.classList.toggle('on',!!a&&a.getAttribute('href')==='#'+id);
    });
  }
  window.addEventListener('hashchange',mark); mark();

  document.addEventListener('keydown',function(e){
    if(e.key==='/'&&e.target!==q){ e.preventDefault(); q.focus(); q.select(); return; }
    if(e.key==='Escape'){
      if(q.value){ q.value=''; apply(); return; }
      if(srcFilter){ srcFilter=null; draw(); apply(); return; }
      if(location.hash){ location.hash=''; mark(); }
      return;
    }
    if(e.key==='Enter'&&e.target!==q){
      var open=document.querySelector('.detail:target .ptr');
      if(open){ e.preventDefault(); open.click(); }
      return;
    }
    if(e.key!=='ArrowDown'&&e.key!=='ArrowUp') return;
    var visible=Array.prototype.filter.call((lists[mode]||{children:[]}).children,function(r){return !r.hidden});
    if(!visible.length) return;
    e.preventDefault();
    var at=visible.findIndex(function(r){return r.classList.contains('on')});
    var next=visible[Math.min(visible.length-1,Math.max(0,at+(e.key==='ArrowDown'?1:-1)))];
    if(next) next.querySelector('.pick').click();
  });
})();
`;

// `opts.root` is how the pointer reaches the repo: the page is emitted into
// `dist/vocab/`, two levels below the files it cites.
function render(model, opts) {
  const options = opts || {};
  const root = options.root == null ? '../../' : options.root;
  const all = model.entries || [];

  // Plans leave the term list whether or not their records were parsed: the
  // disposition is that they are not vocabulary, not that they are optional.
  const planTerms = all.filter((e) => /CATALOG\.md$/.test(e.birthplace) && e.canonical !== PLAN_UMBRELLA);
  const planNames = new Set(planTerms.map((e) => e.canonical));
  const terms = all.filter((e) => !planNames.has(e.canonical));

  // Records when the catalog was parsed; otherwise the registered names alone,
  // so the panel is never empty and never silently claims columns it lacks.
  const records = (options.plans && options.plans.length)
    ? options.plans
    : planTerms.map((e) => ({
      name: e.canonical, korean: e.korean, identity: null, availability: null,
      risk: null, effectAxes: { core: [], secondary: [], none: [] }
    }));

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Vocabulary — Terrain Game</title>
<style>${CSS}</style>
</head>
<body>
<header class="top">
<input id="q" type="search" placeholder="Search a term, 한국어, alias, or identifier…" autofocus autocomplete="off" spellcheck="false" aria-label="Search terms">
<nav class="modes" aria-label="View">
<button class="mode on" type="button" data-mode="terms">Terms <b data-count="terms">${terms.length}</b></button>
<button class="mode" type="button" data-mode="plans">Plans <b data-count="plans">${records.length}</b></button>
</nav>
<span class="filter" id="filter" hidden></span>
</header>
<main class="body">
<section class="listpane">
<ul class="list" id="terms">${terms.map(rowHtml).join('')}</ul>
<ul class="list" id="plans" hidden>${records.map(planRowHtml).join('')}</ul>
<p class="nomatch" hidden></p>
</section>
<section class="pane">
<a class="back" href="#">← all terms</a>
<div class="empty"><b>${terms.length} terms</b> across ${new Set(terms.map((e) => e.birthplace)).size} files, plus ${records.length} operation plans. Search, or pick a term — every row links to where its definition actually lives.</div>
${terms.map((e) => detailHtml(e, root)).join('')}
${records.map((r) => planDetailHtml(r, root)).join('')}
</section>
</main>
${lockHtml(options.lock, options.generatedAt, options.sourceCommit)}
<script>${JS}</script>
</body>
</html>
`;
}

module.exports = { render, shortSource, termId, PLAN_UMBRELLA };
