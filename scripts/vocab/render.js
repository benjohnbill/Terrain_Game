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

// Plans leave the term list: each is a schema'd record (ADR 0024), not a word
// whose meaning you look up. The umbrella term stays behind.
const PLAN_UMBRELLA = 'Operation plan catalog';

function esc(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function slug(canonical) {
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
  return [entry.canonical, entry.korean, entry.codeIdentifier, ...(entry.aliases || [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

// The row. Its shape is fixed: name, 한국어, exception mark, source, preview.
// A missing 한국어 closes the line up rather than leaving a placeholder — 34% of
// terms have none, and a third of the list must not look broken. A missing
// gloss leaves the preview element empty: a blank slot, never a demotion.
function rowHtml(entry) {
  const id = slug(entry.canonical);
  const korean = entry.korean ? `<span class="ko">${esc(entry.korean)}</span>` : '';
  const preview = entry.gloss ? esc(entry.gloss.text) : (entry.tier0 ? esc(entry.tier0.summary) : '');
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
  const id = slug(entry.canonical);
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
  const gloss = entry.gloss || (entry.tier0 ? { text: entry.tier0.summary, source: 'authored' } : null);
  const quote = gloss
    ? `<blockquote class="quote">${esc(gloss.text)}</blockquote>`
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

function lockHtml(lock) {
  if (!lock) return '<footer class="lock"><span class="muted">no lock marker yet</span></footer>';
  const figures = [
    ['new', lock.added],
    ['re-statused', lock.restatused],
    ['redefined', lock.redefined],
    ['withdrawn', lock.removed]
  ].filter(([, n]) => typeof n === 'number');

  const moved = figures.some(([, n]) => n > 0);
  const reading = moved
    ? figures
      .map(([label, n]) => `<span class="fig${n > 0 ? ' moved' : ''}">${n} ${label}</span>`)
      .join('<span class="dot">·</span>')
    : `<span class="muted">no drift since this lock</span>`;

  return [
    '<footer class="lock">',
    `<span class="lockat">last locked <b>${esc(lock.date)}</b>`,
    lock.auditRun != null ? ` (auditRun ${esc(lock.auditRun)})` : '',
    lock.commit ? ` <code>${esc(String(lock.commit).slice(0, 7))}</code>` : '',
    '</span>',
    '<span class="sep">—</span>',
    reading,
    '</footer>'
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
  display:flex; align-items:center; gap:.5rem;
  padding:.35rem .75rem; font-size:var(--t-meta); color:var(--muted);
  background:var(--surface); border-bottom:1px solid var(--line);
}
.filter b{color:var(--primary); font-family:var(--mono); font-weight:400}
.filter button{
  background:none; border:1px solid var(--line); border-radius:3px;
  color:var(--muted); font:var(--t-meta) var(--ui); padding:.1rem .35rem; cursor:pointer;
}
.filter button:hover{color:var(--ink)}

/* --- two panes ---------------------------------------------------------- */
.body{display:grid; grid-template-columns:340px minmax(0,1fr); min-height:0}
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
@media (max-width:720px){
  .body{grid-template-columns:1fr}
  .listpane{border-right:0}
  .pane{display:none}
  .pane:has(.detail:target){
    display:block; position:fixed; inset:0; background:var(--bg);
    z-index:calc(var(--z-sticky) + 1); overflow-y:auto;
  }
  .pane:has(.detail:target) .empty{display:none}
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
  const umbrella = options.umbrella == null ? PLAN_UMBRELLA : options.umbrella;
  const all = model.entries || [];

  const plans = all.filter((e) => /CATALOG\.md$/.test(e.birthplace) && e.canonical !== umbrella);
  const planNames = new Set(plans.map((e) => e.canonical));
  const terms = all.filter((e) => !planNames.has(e.canonical));

  const generated = options.generatedAt ? esc(options.generatedAt) : '';

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
<button class="mode on" type="button" data-mode="terms">Terms <b>${terms.length}</b></button>
<button class="mode" type="button" data-mode="plans">Plans <b>${plans.length}</b></button>
</nav>
</header>
<div class="filter" id="filter" hidden></div>
<main class="body">
<section class="listpane">
<ul class="list" id="terms">${terms.map(rowHtml).join('')}</ul>
<ul class="list" id="plans" hidden>${plans.map(rowHtml).join('')}</ul>
<p class="nomatch" hidden></p>
</section>
<section class="pane">
<div class="empty"><b>${terms.length} terms</b> across ${new Set(terms.map((e) => e.birthplace)).size} files, plus ${plans.length} operation plans. Search, or pick a term — every row links to where its definition actually lives.</div>
${terms.concat(plans).map((e) => detailHtml(e, root)).join('')}
</section>
</main>
${lockHtml(options.lock)}
${generated ? `<!-- rendered ${generated} -->` : ''}
<script>${JS}</script>
</body>
</html>
`;
}

module.exports = { render, shortSource, slug, PLAN_UMBRELLA };
