/* ============================================================================
 * Terrain Game — situation-map mockup (presentation only, dummy data).
 * Realigned to the CODE model (js/situation.js + HIGHLIGHT_TYPES):
 *   province = hex cluster · situation is a CATEGORY derived from real stats ·
 *   only the turn's top highlights are emphasized (sparse) · click = the
 *   recommended command. classify()/reasonFor() are copied from situation.js.
 * ==========================================================================*/
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- classify: verbatim port of situation.js classifyHex (province-level) ---- */
  function classify(p) {
    const owned = p.owner === 'self';
    const enemy = p.owner !== null && p.owner !== 'self';
    const lowConfidence = p.informationConfidence < 0.5;   // IntelSystem.isReliable threshold
    const highEconomy = p.economyValue >= 12;
    const weakOwnDefense = owned && p.localGarrison < 7;
    const routeTag = (p.strategicTags || []).some(t => ['pass', 'river_crossing', 'strait_crossing'].includes(t));
    if (weakOwnDefense) return { type: 'defense', intent: 'reinforce' };
    if (enemy && lowConfidence) return { type: 'uncertainty', intent: 'scout' };
    if (enemy && highEconomy) return { type: 'opportunity', intent: 'prepare_offensive' };
    if (routeTag) return { type: 'route', intent: 'scout' };
    if (owned && highEconomy) return { type: 'growth', intent: 'consolidate' };
    return null;
  }
  function reasonFor(p, type) {
    switch (type) {
      case 'defense': return `${p.name}의 주둔군이 부족합니다.`;
      case 'uncertainty': return `${p.name}의 정보 신뢰도가 낮습니다.`;
      case 'opportunity': return `${p.name}은(는) 경제 가치가 높은 목표입니다.`;
      case 'route': return `${p.name}은(는) 이동/도하/관문 변수입니다.`;
      case 'growth': return `${p.name}은(는) 성장과 복구 가치가 큽니다.`;
      case 'threat': return `${p.name}에 적 압박이 커지고 있습니다.`;
      default: return `${p.name}의 형세를 확인해야 합니다.`;
    }
  }
  const TYPE_ORDER = { defense: 0, threat: 1, uncertainty: 2, opportunity: 3, route: 4, growth: 5 };

  /* ---- geometry (flat-top) ---- */
  const S = 42, HW = 1.5 * S, HH = Math.sqrt(3) * S, M = 16;
  function center(c, r) { return { x: M + S + HW * c, y: M + HH / 2 + HH * r + (c & 1 ? HH / 2 : 0) }; }
  function corners(cx, cy) { const a = []; for (let i = 0; i < 6; i++) { const t = Math.PI / 180 * 60 * i; a.push([cx + S * Math.cos(t), cy + S * Math.sin(t)]); } return a; }
  function neighbor(c, r, edge) {
    const odd = c & 1;
    switch (edge) {
      case 1: return [c, r + 1];                  // S
      case 4: return [c, r - 1];                  // N
      case 0: return odd ? [c + 1, r + 1] : [c + 1, r];     // SE
      case 5: return odd ? [c + 1, r] : [c + 1, r - 1];     // NE
      case 2: return odd ? [c - 1, r + 1] : [c - 1, r];     // SW
      case 3: return odd ? [c - 1, r] : [c - 1, r - 1];     // NW
    }
  }
  const el = (t, a) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); return e; };
  const rgba = (rgb, a) => `rgba(${rgb},${a})`;
  function hexToRgb(hex) { const n = parseInt(hex.slice(1), 16); return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`; }

  /* ---- state ---- */
  const state = { threatLens: false, selected: null };
  const hexIndex = {};                                  // "c,r" -> provinceId
  PROVINCES.forEach(p => p.hexes.forEach(([c, r]) => { hexIndex[c + ',' + r] = p.id; }));
  PROVINCES.forEach(p => {
    p._cls = classify(p);
    p._type = p._cls ? p._cls.type : null;
    const cs = p.hexes.map(([c, r]) => center(c, r));
    p._cx = cs.reduce((s, v) => s + v.x, 0) / cs.length;
    p._cy = cs.reduce((s, v) => s + v.y, 0) / cs.length;
  });

  const svg = document.getElementById('map-svg');
  const L = {
    fill: document.getElementById('l-fill'), glow: document.getElementById('l-glow'),
    perim: document.getElementById('l-perim'), label: document.getElementById('l-label'),
    mark: document.getElementById('l-mark'), fx: document.getElementById('l-fx'),
  };
  const stage = document.getElementById('map-stage');

  (function viewBox() {
    let mx = 0, my = 0;
    PROVINCES.forEach(p => p.hexes.forEach(([c, r]) => { const q = center(c, r); mx = Math.max(mx, q.x + S); my = Math.max(my, q.y + HH / 2); }));
    svg.setAttribute('viewBox', `0 0 ${Math.round(mx + M)} ${Math.round(my + M)}`);
  })();

  /* ---- render ---- */
  function shownType(p) {
    // proposed threat lens overlays threat on flagged provinces, but respects
    // the situation.js priority order: defense (0) outranks threat (1), so a
    // weak-defense province keeps its 방어 요충 badge; lower-priority types yield.
    if (state.threatLens && p.threatProposed) {
      if (p._type && TYPE_ORDER[p._type] < TYPE_ORDER.threat) return p._type;
      return 'threat';
    }
    return p._type;
  }

  function render() {
    Object.values(L).forEach(g => (g.innerHTML = ''));
    PROVINCES.forEach(p => {
      const owner = FACTIONS[p.owner];
      const orgb = hexToRgb(owner.color);
      const type = shownType(p);
      // fills: muted ownership base (calm), so highlights pop
      p.hexes.forEach(([c, r]) => {
        const q = center(c, r);
        const poly = el('polygon', {
          points: corners(q.x, q.y).map(pt => pt[0].toFixed(1) + ',' + pt[1].toFixed(1)).join(' '),
          fill: rgba(orgb, 0.16), stroke: 'rgba(0,0,0,0.22)', 'stroke-width': 1,
          'data-prov': p.id, class: 'phex',
        });
        L.fill.appendChild(poly);
      });
      // situation glow (soft type-color wash) for classified provinces
      if (type) {
        const t = HIGHLIGHT_TYPES[type];
        const g = el('circle', { cx: p._cx.toFixed(1), cy: p._cy.toFixed(1), r: S * 1.35, fill: rgba(t.rgb, 0.16), class: 'glow' });
        if (!REDUCED) g.setAttribute('filter', 'url(#soft)');
        L.glow.appendChild(g);
      }
      // province perimeter (outer edges only) in owner color
      p.hexes.forEach(([c, r]) => {
        const q = center(c, r), cn = corners(q.x, q.y);
        for (let e = 0; e < 6; e++) {
          const nb = neighbor(c, r, e);
          if (hexIndex[nb[0] + ',' + nb[1]] !== p.id) {
            const a = cn[e], b = cn[(e + 1) % 6];
            L.perim.appendChild(el('line', {
              x1: a[0].toFixed(1), y1: a[1].toFixed(1), x2: b[0].toFixed(1), y2: b[1].toFixed(1),
              stroke: rgba(orgb, p.owner === 'self' ? 0.85 : 0.55), 'stroke-width': p.owner === 'self' ? 2.4 : 1.8, 'stroke-linecap': 'round',
            }));
          }
        }
      });
      // province name
      L.label.appendChild(txt(p._cx, p._cy - (type ? 12 : 2), p.name, 'p-name', 13));
      // situation marker badge (color + label = never color-only)
      if (type) drawBadge(p, type);
    });
    renderBriefing();
    renderLegend();
  }

  function drawBadge(p, type) {
    const t = HIGHLIGHT_TYPES[type];
    const label = t.label + (state.threatLens && type === 'threat' && p.threatProposed ? ' (제안)' : '');
    const w = label.length * 12 + 30, h = 22, x = p._cx - w / 2, y = p._cy + 4;
    const g = el('g', { class: 'badge', 'data-prov': p.id });
    g.appendChild(el('rect', { x: x.toFixed(1), y: y.toFixed(1), width: w, height: h, rx: 11, fill: 'rgba(10,14,39,0.82)', stroke: rgba(t.rgb, 0.9), 'stroke-width': 1.5 }));
    const dashed = (type === 'threat' && p.threatProposed);
    if (dashed) g.firstChild.setAttribute('stroke-dasharray', '4 3');
    g.appendChild(el('circle', { cx: (x + 13).toFixed(1), cy: (y + h / 2).toFixed(1), r: 4.5, fill: rgba(t.rgb, 1) }));
    const label_t = txt(p._cx + 6, y + h / 2 + 4, label, 'badge-t', 12);
    label_t.setAttribute('fill', rgba(t.rgb, 1));
    g.appendChild(label_t);
    if (!REDUCED) g.appendChild(pulse(p._cx, p._cy - 2, t.rgb));
    L.mark.appendChild(g);
  }
  function pulse(cx, cy, rgb) {
    const c = el('circle', { cx: cx.toFixed(1), cy: (cy).toFixed(1), r: 3, fill: 'none', stroke: rgba(rgb, 0.8), 'stroke-width': 2, class: 'ping' });
    return c;
  }
  function txt(x, y, s, cls, size) { const t = el('text', { x: x.toFixed(1), y: y.toFixed(1), class: cls, 'text-anchor': 'middle', 'font-size': size }); t.textContent = s; return t; }

  /* ---- briefing (ADR 0013 step 1: short turn briefing, linked to map) ---- */
  function topHighlights() {
    return PROVINCES.filter(p => shownType(p))
      .sort((a, b) => TYPE_ORDER[shownType(a)] - TYPE_ORDER[shownType(b)])
      .slice(0, 7);
  }
  function renderBriefing() {
    const box = document.getElementById('briefing');
    const hs = topHighlights();
    box.innerHTML = hs.map(p => {
      const type = shownType(p), t = HIGHLIGHT_TYPES[type];
      const conf = Math.round(p.informationConfidence * 100);
      return `<button class="br-item" data-prov="${p.id}">` +
        `<span class="br-dot" style="background:rgb(${t.rgb})"></span>` +
        `<span class="br-body"><span class="br-top"><b>${p.name}</b> <span class="br-type" style="color:rgb(${t.rgb})">${t.label}${type === 'threat' && p.threatProposed ? ' · 제안' : ''}</span></span>` +
        `<span class="br-reason">${reasonFor(p, type)}</span></span>` +
        `<span class="br-cmd">${COMMAND_INTENTS[HIGHLIGHT_TYPES[type].intent]}${conf < 50 ? ` · 정보 ${conf}%` : ''}</span>` +
        `</button>`;
    }).join('');
    box.querySelectorAll('.br-item').forEach(b => b.addEventListener('click', () => openCard(PROVINCES.find(x => x.id === b.dataset.prov))));
    document.getElementById('br-count').textContent = hs.length;
  }

  /* ---- legend ---- */
  function renderLegend() {
    const order = ['defense', 'threat', 'uncertainty', 'opportunity', 'route', 'growth'];
    document.getElementById('legend').innerHTML =
      `<span class="lg-title">상황 타입</span>` +
      order.map(k => {
        const t = HIGHLIGHT_TYPES[k];
        return `<span class="lg ${k === 'threat' ? 'lg-proposed' : ''}"><i class="sw" style="background:rgb(${t.rgb})"></i>${t.label}${t.proposed ? ' <em>제안</em>' : ''}</span>`;
      }).join('') +
      `<span class="lg-note">기본색 = 소유 세력 · 강조는 이번 턴 상위 ${topHighlights().length}개만</span>`;
  }

  /* ---- hover chip (ground-truth stats) ---- */
  const chip = document.getElementById('chip');
  function showChip(p) {
    const owner = FACTIONS[p.owner], type = shownType(p), conf = Math.round(p.informationConfidence * 100);
    const t = type ? HIGHLIGHT_TYPES[type] : null;
    chip.innerHTML =
      `<div class="chip-h"><span class="chip-n">${p.name}</span><span class="chip-o" style="color:${owner.color}">▣ ${owner.short}</span></div>` +
      (t ? `<div class="chip-type" style="color:rgb(${t.rgb})">● ${t.label}${type === 'threat' && p.threatProposed ? ' (제안)' : ''} — ${COMMAND_INTENTS[t.intent]}</div>` +
           `<div class="chip-reason">${reasonFor(p, type)}</div>` : `<div class="chip-type calm">특이 형세 없음</div>`) +
      `<div class="chip-stats"><span>${terrainIcon(p.terrain)} ${p.terrain}</span><span>💰 경제 ${p.economyValue}</span><span>⚑ 주둔 ${p.localGarrison}</span><span class="${conf < 50 ? 'low' : ''}">◔ 정보 ${conf}%</span></div>`;
    chip.classList.remove('hidden');
  }
  function moveChip(ev) {
    const r = stage.getBoundingClientRect();
    let x = ev.clientX - r.left + 14, y = ev.clientY - r.top + 14;
    const cw = chip.offsetWidth, ch = chip.offsetHeight;
    if (x + cw > stage.clientWidth) x = ev.clientX - r.left - cw - 14;
    if (y + ch > stage.clientHeight) y = stage.clientHeight - ch - 6;
    chip.style.left = Math.max(4, x) + 'px'; chip.style.top = Math.max(4, y) + 'px';
  }
  function hideChip() { chip.classList.add('hidden'); }
  function terrainIcon(t) { return ({ '평야': '▤', '구릉': '◠', '산지': '△', '하천': '∿', '해안': '≈', '관문': '◫' })[t] || '▤'; }

  /* ---- command card (recommended command prefilled from the situation type) ---- */
  const card = document.getElementById('card');
  function openCard(p) {
    const type = shownType(p);
    if (!type) return;
    state.selected = p.id;
    const t = HIGHLIGHT_TYPES[type], owner = FACTIONS[p.owner], conf = Math.round(p.informationConfidence * 100);
    const cmd = COMMAND_INTENTS[t.intent];
    card.innerHTML =
      `<div class="cc-h"><span class="cc-cmd" style="color:rgb(${t.rgb})">${cmd}</span>` +
        `<span class="cc-tg">→ ${p.name} <i style="color:${owner.color}">${owner.short}</i></span>` +
        `<button class="cc-x" id="cc-x" aria-label="닫기">✕</button></div>` +
      `<div class="cc-why"><span class="cc-badge" style="border-color:rgb(${t.rgb});color:rgb(${t.rgb})">● ${t.label}${type === 'threat' && p.threatProposed ? ' (제안)' : ''}</span>` +
        `<span class="cc-reason">${reasonFor(p, type)}</span></div>` +
      `<div class="cc-fields">` +
        `<div class="cc-f"><span>추천 명령 (프리필)</span><b>${cmd}</b></div>` +
        `<div class="cc-f"><span>대상</span><b>${p.name} · ${p.terrain} · ${p.hexes.length} 헥스</b></div>` +
        `<div class="cc-f"><span>실제 stat</span><b>경제 ${p.economyValue} · 주둔 ${p.localGarrison}</b></div>` +
        `<div class="cc-f"><span>정보 신뢰</span><b class="${conf < 50 ? 'low' : ''}">${conf}%${conf < 50 ? ' · 추정' : ''}</b></div>` +
      `</div>` +
      `<div class="cc-open">명령 조정(강도·병력·판단)은 <b>실력 edge — OPEN</b> 영역. 이 목업은 형세 판단→추천까지만.</div>` +
      `<div class="cc-actions"><button class="cc-go">확정 (더미)</button><button class="cc-cancel" id="cc-cancel">취소</button></div>`;
    // position near centroid
    const r = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal;
    let x = (p._cx / vb.width) * r.width + 20, y = (p._cy / vb.height) * r.height - 40;
    card.style.visibility = 'hidden'; card.classList.remove('hidden');
    const cw = card.offsetWidth, ch = card.offsetHeight;
    if (x + cw > stage.clientWidth) x = (p._cx / vb.width) * r.width - cw - 20;
    x = Math.max(4, x); y = Math.max(4, Math.min(y, stage.clientHeight - ch - 6));
    card.style.left = x + 'px'; card.style.top = y + 'px'; card.style.visibility = '';
    document.getElementById('cc-x').onclick = closeCard;
    document.getElementById('cc-cancel').onclick = closeCard;
    card.querySelector('.cc-go').onclick = closeCard;
  }
  function closeCard() { card.classList.add('hidden'); state.selected = null; }

  /* ---- "am I winning" glance (slim, context) ---- */
  function renderGlance() {
    const self = POWER.self;
    let rid = null; for (const k in POWER) { if (k !== 'self' && (!rid || POWER[k] > POWER[rid])) rid = k; }
    const rival = POWER[rid], total = self + rival;
    document.getElementById('g-self').textContent = self;
    document.getElementById('g-rival').textContent = rival;
    document.getElementById('g-rival-n').textContent = FACTIONS[rid].short;
    document.getElementById('g-fill-self').style.width = (self / total * 100).toFixed(1) + '%';
    document.getElementById('g-fill-rival').style.width = (rival / total * 100).toFixed(1) + '%';
    document.getElementById('g-lead').textContent = '+' + Math.round((self - rival) / rival * 100) + '% ▲';
    const order = Object.keys(POWER).sort((a, b) => POWER[b] - POWER[a]);
    document.getElementById('ladder').innerHTML = order.map((id, i) =>
      `<li class="${FACTIONS[id].isSelf ? 'is-self' : ''}"><span class="lr">${i + 1}</span><span class="ld" style="background:${FACTIONS[id].color}"></span>${FACTIONS[id].short}<b>${POWER[id]}</b></li>`).join('');
  }

  /* ---- wire hover/click on province hexes + badges ---- */
  function bind() {
    const hit = ev => { const id = ev.target.getAttribute('data-prov'); return id ? PROVINCES.find(p => p.id === id) : null; };
    L.fill.addEventListener('mouseover', ev => { const p = hit(ev); if (p) showChip(p); });
    L.fill.addEventListener('mousemove', moveChip);
    L.fill.addEventListener('mouseout', hideChip);
    L.fill.addEventListener('click', ev => { const p = hit(ev); if (p && shownType(p)) openCard(p); });
    L.mark.addEventListener('click', ev => { const g = ev.target.closest('.badge'); if (g) openCard(PROVINCES.find(p => p.id === g.getAttribute('data-prov'))); });
    document.getElementById('btn-threat').addEventListener('click', () => {
      state.threatLens = !state.threatLens;
      document.getElementById('btn-threat').setAttribute('aria-pressed', String(state.threatLens));
      render();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCard(); });
  }

  render(); renderGlance(); bind();
})();
