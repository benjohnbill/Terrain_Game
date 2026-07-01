/* ============================================================================
 * Terrain Game — Payoff Loop Mockup — presentation logic (dummy data only).
 * No domain logic, no wiring to the real game. Pure rendering of the
 * representation model in payoff-loop-design.md.
 * ==========================================================================*/
(function () {
  'use strict';

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----- mutable state (deep-ish copy of fixtures) ----- */
  const state = {
    provinces: PROVINCES.map(p => Object.assign({}, p)),
    power: Object.assign({}, POWER),
    lens: 'value',
    turnIdx: 0,          // how many scripted turns applied
    momentum: [],        // {name, dir}
    selected: null,      // province id with open command card
  };

  /* ADR 0013 situation colors. */
  const HUE = {
    value:       [255, 165, 2],    // gold
    development: [46, 213, 115],   // green
    threat:      [255, 71, 87],    // red
  };
  const UNCERTAIN = '#a855f7';     // purple — info confidence
  const ROUTE     = '#cbd5e1';     // silver — pass / strait / route

  const LENS_META = {
    value:       { icon:'◆', label:'가치', hue:HUE.value,       desc:'정복 가치 — 밝을수록 값진 목표' },
    development: { icon:'▲', label:'발전', hue:HUE.development, desc:'발전도 — 색농도·아이콘밀도·발광 = 성장의 시각 무게' },
    threat:      { icon:'⚔', label:'위협', hue:HUE.threat,      desc:'군사 위협 — 붉을수록 위험' },
    control:     { icon:'▣', label:'장악', hue:null,            desc:'소유 세력 — 맵 면적을 세력색으로' },
  };

  /* ---------------------------------------------------------------- geometry */
  const S = 46;                          // hex size
  const HW = 1.5 * S;                     // horizontal step (flat-top)
  const HH = Math.sqrt(3) * S;            // full hex height
  const MARGIN = 14;

  function hexCenter(col, row) {
    const cx = MARGIN + S + HW * col;
    const cy = MARGIN + HH / 2 + HH * row + (col & 1 ? HH / 2 : 0);
    return { cx, cy };
  }
  function hexPoints(cx, cy) {
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 180) * (60 * i);
      pts.push((cx + S * Math.cos(a)).toFixed(1) + ',' + (cy + S * Math.sin(a)).toFixed(1));
    }
    return pts.join(' ');
  }

  const svg      = document.getElementById('map-svg');
  const hexLayer = document.getElementById('hex-layer');
  const iconLayer= document.getElementById('icon-layer');
  const fxLayer  = document.getElementById('fx-layer');
  const stage    = document.getElementById('map-stage');
  const NS = 'http://www.w3.org/2000/svg';

  /* fit viewBox to all hexes */
  (function setViewBox() {
    let maxX = 0, maxY = 0;
    const all = state.provinces.concat(SEA_HEXES);
    all.forEach(h => {
      const { cx, cy } = hexCenter(h.col, h.row);
      maxX = Math.max(maxX, cx + S);
      maxY = Math.max(maxY, cy + HH / 2);
    });
    svg.setAttribute('viewBox', `0 0 ${(maxX + MARGIN).toFixed(0)} ${(maxY + MARGIN).toFixed(0)}`);
  })();

  function el(tag, attrs) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  function rgba(hue, a) { return `rgba(${hue[0]},${hue[1]},${hue[2]},${a.toFixed(3)})`; }

  /* --------------------------------------------------------------- map build */
  const hexNodes = {};   // id -> polygon

  function buildSea() {
    SEA_HEXES.forEach(h => {
      const { cx, cy } = hexCenter(h.col, h.row);
      const poly = el('polygon', { points: hexPoints(cx, cy), class: 'hex-sea' });
      hexLayer.appendChild(poly);
    });
  }

  function buildHexes() {
    state.provinces.forEach(p => {
      const { cx, cy } = hexCenter(p.col, p.row);
      p._cx = cx; p._cy = cy;
      const poly = el('polygon', {
        points: hexPoints(cx, cy),
        class: 'hex',
        'data-id': p.id,
        tabindex: '0',
        role: 'button',
        'aria-label': p.name,
      });
      poly.addEventListener('mouseenter', () => showChip(p));
      poly.addEventListener('mousemove', ev => positionChip(ev));
      poly.addEventListener('mouseleave', hideChip);
      poly.addEventListener('focus', () => showChip(p, true));
      poly.addEventListener('blur', hideChip);
      poly.addEventListener('click', () => openCard(p));
      poly.addEventListener('keydown', ev => {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); openCard(p); }
      });
      hexLayer.appendChild(poly);
      hexNodes[p.id] = poly;
    });
  }

  /* metric value for the active lens */
  function metric(p, lens) {
    if (lens === 'value') return p.value;
    if (lens === 'development') return p.development;
    if (lens === 'threat') return p.threat;
    return 0;
  }

  function paint() {
    const lens = state.lens;
    const meta = LENS_META[lens];
    state.provinces.forEach(p => {
      const poly = hexNodes[p.id];
      const owner = FACTIONS[p.owner];
      // --- fill ---
      if (lens === 'control') {
        // map area by owner; developed = a touch brighter
        const a = 0.35 + 0.45 * (p.development / 100);
        poly.style.fill = hexToRgba(owner.color, a);
        poly.style.filter = '';
      } else {
        const m = metric(p, lens);
        poly.style.fill = rgba(meta.hue, 0.10 + 0.82 * (m / 100));
        // development = visual weight: glow on the enriched
        poly.style.filter = (lens === 'development' && m >= 68) ? 'url(#glow-dev)' : '';
      }
      // --- owner border always legible ---
      poly.style.stroke = hexToRgba(owner.color, lens === 'control' ? 0.95 : 0.7);
      poly.style.strokeWidth = (p.owner === 'self') ? 2.4 : 1.4;
      poly.classList.toggle('is-self', p.owner === 'self');
    });
    buildIcons();
    renderLegend();
  }

  /* icon layer reinforces the metric (never color-only). */
  function buildIcons() {
    iconLayer.innerHTML = '';
    const lens = state.lens;
    state.provinces.forEach(p => {
      const { _cx: cx, _cy: cy } = p;

      // development lens: building-dot density
      if (lens === 'development') {
        const n = Math.max(1, Math.round(p.development / 20)); // 1..5
        for (let i = 0; i < n; i++) {
          const dx = ((i % 3) - 1) * 11;
          const dy = (i < 3 ? 6 : -8);
          iconLayer.appendChild(el('rect', {
            x: (cx + dx - 3).toFixed(1), y: (cy + dy - 3).toFixed(1),
            width: 6, height: 6, rx: 1,
            class: 'ic-build', 'data-lit': p.development >= 68 ? '1' : '0',
          }));
        }
      }
      // value lens: ◆ on prime targets
      if (lens === 'value' && p.value >= 58) {
        iconLayer.appendChild(textIcon(cx, cy + 5, '◆', 'ic-value', 10 + p.value / 12));
      }
      // threat lens: ⚔ on dangerous
      if (lens === 'threat' && p.threat >= 45) {
        iconLayer.appendChild(textIcon(cx, cy + 6, '⚔', 'ic-threat', 15));
      }
      // control lens: faction short label
      if (lens === 'control') {
        iconLayer.appendChild(textIcon(cx, cy + 4, FACTIONS[p.owner].short, 'ic-own', 11));
      }
      // cross-cutting: low info confidence → small purple corner glyph (scouting
      // need). A corner mark, not a full ring — ADR 0013: avoid whole-map noise.
      if (p.confidence < 0.5) {
        iconLayer.appendChild(textIcon(cx - S * 0.5, cy + S * 0.66, '◔', 'ic-uncertain', p.confidence < 0.34 ? 15 : 12));
      }
      // cross-cutting: pass / strait → silver route glyph
      if (p.pass) {
        iconLayer.appendChild(textIcon(cx + S * 0.5, cy + S * 0.66, '◈', 'ic-route', 12));
      }
      // province name (small, always)
      iconLayer.appendChild(textIcon(cx, cy - 12, p.name, 'ic-name', 11));
    });
  }
  function textIcon(x, y, txt, cls, size) {
    const t = el('text', { x: x.toFixed(1), y: y.toFixed(1), class: cls, 'text-anchor': 'middle' });
    if (size) t.setAttribute('font-size', size);
    t.textContent = txt;
    return t;
  }

  /* ---------------------------------------------------------------- legend */
  const legendBox = document.getElementById('map-legend');
  function renderLegend() {
    const lens = state.lens, meta = LENS_META[lens];
    let swatches = '';
    if (lens === 'control') {
      swatches = Object.values(FACTIONS).map(f =>
        `<span class="lg"><i class="sw" style="background:${f.color}"></i>${f.short}</span>`).join('');
    } else {
      const [r, g, b] = meta.hue;
      swatches =
        `<span class="lg"><i class="sw" style="background:rgba(${r},${g},${b},.22)"></i>낮음</span>` +
        `<span class="lg"><i class="sw" style="background:rgba(${r},${g},${b},.92)"></i>높음</span>`;
      if (lens === 'development')
        swatches += `<span class="lg"><i class="sw glowdot" style="background:rgb(${r},${g},${b})"></i>발광=발전 정점</span>`;
    }
    legendBox.innerHTML =
      `<span class="lg-desc">${meta.icon} ${meta.desc}</span>` +
      swatches +
      `<span class="lg lg-x"><i class="glyph" style="color:${UNCERTAIN}">◔</i>정보 부족(정찰)</span>` +
      `<span class="lg lg-x"><i class="glyph" style="color:${ROUTE}">◈</i>관문·해협</span>`;
  }

  /* ------------------------------------------------------------- hover chip */
  const chip = document.getElementById('hex-chip');
  function miniBar(label, v, hue, unit) {
    const col = hue ? `rgb(${hue[0]},${hue[1]},${hue[2]})` : '#9aa4c0';
    return `<div class="cb"><span class="cb-l">${label}</span>` +
           `<span class="cb-t"><i style="width:${v}%;background:${col}"></i></span>` +
           `<span class="cb-v">${v}${unit || ''}</span></div>`;
  }
  function showChip(p, keepPos) {
    const owner = FACTIONS[p.owner];
    const conf = Math.round(p.confidence * 100);
    chip.innerHTML =
      `<div class="chip-head">` +
        `<span class="chip-name">${p.name}</span>` +
        `<span class="chip-own" style="color:${owner.color}">▣ ${owner.short}</span>` +
      `</div>` +
      `<div class="chip-terrain">${terrainIcon(p.terrain)} ${p.terrain}` +
        (p.pass ? ` · <span style="color:${ROUTE}">◈ 길목</span>` : '') + `</div>` +
      miniBar('◆ 가치', p.value, HUE.value) +
      miniBar('▲ 발전', p.development, HUE.development) +
      miniBar('⚔ 위협', p.threat, HUE.threat) +
      miniBar('🛡 방어', p.defense, [55, 66, 250]) +
      `<div class="chip-foot">` +
        `<span>💰 ${p.econ}/턴</span><span>⚑ 수비 ${p.garrison}</span>` +
        `<span class="${conf < 50 ? 'lowconf' : ''}">◔ 정보 ${conf}%</span>` +
      `</div>`;
    chip.classList.remove('hidden');
    chip.setAttribute('aria-hidden', 'false');
    if (keepPos) positionChipAt(p._cx, p._cy);
  }
  function positionChip(ev) {
    const r = stage.getBoundingClientRect();
    positionChipAt(null, null, ev.clientX - r.left, ev.clientY - r.top);
  }
  function positionChipAt(svgx, svgy, px, py) {
    // if svg coords given, convert to stage px
    if (px == null) {
      const r = svg.getBoundingClientRect();
      const vb = svg.viewBox.baseVal;
      px = (svgx / vb.width) * r.width;
      py = (svgy / vb.height) * r.height;
    }
    const cw = chip.offsetWidth, ch = chip.offsetHeight;
    let x = px + 16, y = py + 16;
    if (x + cw > stage.clientWidth) x = px - cw - 16;
    if (y + ch > stage.clientHeight) y = stage.clientHeight - ch - 8;
    if (y < 0) y = 8;
    chip.style.left = Math.max(4, x) + 'px';
    chip.style.top = Math.max(4, y) + 'px';
  }
  function hideChip() {
    chip.classList.add('hidden');
    chip.setAttribute('aria-hidden', 'true');
  }
  function terrainIcon(t) {
    // non-emoji geometric glyphs (skill rule: no emoji as icons)
    return ({ '평야':'▤','구릉':'◠','산지':'△','하천':'∿','해안':'≈','관문':'◫','섬':'◍' })[t] || '▤';
  }

  /* ----------------------------------------------------------- command card */
  const card = document.getElementById('command-card');
  const FORECAST = ['열세', '대등', '우세', '압도'];
  const FORECAST_CLS = ['inferior', 'even', 'superior', 'overwhelming'];

  function recommend(p) {
    if (p.owner === 'self') return p.development < 60 ? '발전' : '방어';
    return '공격';
  }
  function forecastIdx(p) {
    // dummy: compare self garrison-ish vs target defense/garrison
    const mine = 6, edge = mine * 12 - (p.defense * 0.5 + p.garrison * 8);
    if (edge < -20) return 0; if (edge < 10) return 1; if (edge < 50) return 2; return 3;
  }

  function openCard(p) {
    state.selected = p.id;
    const cmd = recommend(p);
    const own = p.owner === 'self';
    let fi = forecastIdx(p);
    const conf = Math.round(p.confidence * 100);

    card.innerHTML =
      `<div class="cc-head">` +
        `<span class="cc-cmd">${cmdIcon(cmd)} ${cmd}</span>` +
        `<span class="cc-target">→ ${p.name} <i style="color:${FACTIONS[p.owner].color}">${FACTIONS[p.owner].short}</i></span>` +
        `<button class="cc-x" id="cc-close" aria-label="닫기">✕</button>` +
      `</div>` +
      (own ? '' :
        `<div class="cc-forecast">` +
          `<span class="cc-fc-label">전투 전망</span>` +
          `<span class="cc-fc-band band-${FORECAST_CLS[fi]}" id="cc-band">${FORECAST[fi]}</span>` +
          `<span class="cc-fc-conf ${conf < 50 ? 'lowconf' : ''}">정보 ${conf}%${conf < 50 ? ' · 추정' : ''}</span>` +
        `</div>`) +
      `<div class="cc-fields">` +
        `<div class="cc-f"><span>대상 지방</span><b>${p.name} · ${p.terrain}</b></div>` +
        `<div class="cc-f"><span>동원 병력(프리필)</span><b>${own ? '수비 보강 ×3' : '주력 ×6 · 인접 지원 ×2'}</b></div>` +
        `<div class="cc-f"><span>추정 대상 방어</span><b>${p.defense} · 수비 ${p.garrison}</b></div>` +
      `</div>` +
      // ---- OPEN placeholder: skill-edge (pillars 2-3) ----
      `<div class="cc-open">` +
        `<div class="cc-open-h">내 판단 <span class="open-badge">OPEN ?</span></div>` +
        `<div class="cc-slider">` +
          `<span class="cs-end">프리셋 기본값</span>` +
          `<input type="range" id="cc-read" min="-2" max="3" step="1" value="0" aria-label="상황 판단 조정">` +
          `<span class="cs-end">상황 맞춤</span>` +
        `</div>` +
        `<div class="cc-delta" id="cc-delta">조정 시: 기본값 대비 이득이 여기에 표시 (표현 방식 미확정)</div>` +
      `</div>` +
      `<div class="cc-actions">` +
        `<button class="cc-confirm">확정 (더미)</button>` +
        `<button class="cc-cancel" id="cc-cancel">취소</button>` +
      `</div>`;

    positionCard(p);
    card.classList.remove('hidden');

    document.getElementById('cc-close').onclick = closeCard;
    document.getElementById('cc-cancel').onclick = closeCard;
    card.querySelector('.cc-confirm').onclick = closeCard;

    const slider = document.getElementById('cc-read');
    slider.oninput = () => onRead(p, fi, parseInt(slider.value, 10));
    onRead(p, fi, 0);
  }

  function onRead(p, baseFi, read) {
    // OPEN placeholder representation of "your read vs default".
    const deltaPts = read * 6;                       // dummy magnitude
    const sign = deltaPts > 0 ? '+' : '';
    const dEl = document.getElementById('cc-delta');
    const band = document.getElementById('cc-band');
    if (read === 0) {
      dEl.innerHTML = `<span class="dz">= 프리셋 기본값</span> (조정 없음)`;
    } else if (deltaPts > 0) {
      dEl.innerHTML = `<span class="dp">내 판단: ${sign}${deltaPts}% 기대이득</span> vs 기본값 — 상황을 더 잘 읽음`;
    } else {
      dEl.innerHTML = `<span class="dn">내 판단: ${deltaPts}% 기대이득</span> vs 기본값 — 과도한 조정`;
    }
    // nudge forecast band with the read (dummy) if attacking
    if (band) {
      let fi = Math.max(0, Math.min(3, baseFi + (read > 0 ? Math.min(1, read) : (read < -1 ? -1 : 0))));
      band.textContent = FORECAST[fi];
      band.className = 'cc-fc-band band-' + FORECAST_CLS[fi];
    }
    // mirror into the right-rail OPEN panel
    document.getElementById('edge-delta').innerHTML =
      read === 0 ? '<span class="dz">기본값</span>'
      : (deltaPts > 0 ? `<span class="dp">${sign}${deltaPts}%</span>` : `<span class="dn">${deltaPts}%</span>`);
  }

  function positionCard(p) {
    const r = svg.getBoundingClientRect();
    const vb = svg.viewBox.baseVal;
    const px = (p._cx / vb.width) * r.width;
    const py = (p._cy / vb.height) * r.height;
    card.style.visibility = 'hidden';
    card.classList.remove('hidden');
    const cw = card.offsetWidth, ch = card.offsetHeight;
    let x = px + 20, y = py - ch / 2;
    if (x + cw > stage.clientWidth) x = px - cw - 20;
    if (x < 4) x = 4;
    if (y + ch > stage.clientHeight) y = stage.clientHeight - ch - 6;
    if (y < 4) y = 4;
    card.style.left = x + 'px';
    card.style.top = y + 'px';
    card.style.visibility = '';
  }
  function closeCard() {
    card.classList.add('hidden');
    state.selected = null;
    document.getElementById('edge-delta').textContent = '—';
  }
  function cmdIcon(c) { return ({ '공격':'⚔','발전':'▲','방어':'🛡','외교':'🤝' })[c] || '◆'; }

  /* ---------------------------------------------------------------- top HUD */
  function strongestRival() {
    let best = null;
    for (const id in state.power) {
      if (id === 'self') continue;
      if (!best || state.power[id] > state.power[best]) best = id;
    }
    return best;
  }
  function renderPowerDiff() {
    const self = state.power.self;
    const rid = strongestRival();
    const rival = state.power[rid];
    const total = self + rival;
    document.getElementById('pd-self-val').textContent = self;
    document.getElementById('pd-rival-val').textContent = rival;
    document.getElementById('pd-rival-name').textContent = FACTIONS[rid].short;
    document.getElementById('pd-fill-self').style.width = (self / total * 100).toFixed(1) + '%';
    document.getElementById('pd-fill-rival').style.width = (rival / total * 100).toFixed(1) + '%';
    const lead = ((self - rival) / rival * 100);
    const leadEl = document.getElementById('pd-lead');
    const ahead = lead >= 0;
    leadEl.textContent = (ahead ? '+' : '') + lead.toFixed(0) + '% ' + (ahead ? '▲' : '▼');
    leadEl.className = 'pd-lead ' + (ahead ? 'up' : 'down');
  }

  function renderMomentum() {
    const box = document.getElementById('mom-items');
    if (!state.momentum.length) { box.innerHTML = '<span class="mom-empty">—</span>'; return; }
    box.innerHTML = state.momentum.slice(-4).map(m =>
      `<span class="mom ${m.dir}">${m.dir === 'gain' ? '▲' : '▼'} ${m.name}</span>`).join('');
  }

  /* ---------------------------------------------------------------- ladder */
  const ladderEl = document.getElementById('ladder');
  function ladderOrder() {
    return Object.keys(state.power).sort((a, b) => state.power[b] - state.power[a]);
  }
  function renderLadder(prevOrder) {
    const order = ladderOrder();
    // FLIP: capture old positions
    const firstRects = {};
    if (prevOrder && !REDUCED) {
      [...ladderEl.children].forEach(li => {
        firstRects[li.dataset.fid] = li.getBoundingClientRect().top;
      });
    }
    const total = Object.values(state.power).reduce((a, b) => a + b, 0);
    ladderEl.innerHTML = order.map((id, i) => {
      const f = FACTIONS[id];
      const pct = Math.round(state.power[id] / total * 100);
      const prevRank = prevOrder ? prevOrder.indexOf(id) : i;
      const rankDir = prevOrder ? (i < prevRank ? 'up' : i > prevRank ? 'down' : 'same') : 'same';
      const arrow = rankDir === 'up' ? '▲' : rankDir === 'down' ? '▼' : '·';
      return `<li data-fid="${id}" class="lad ${f.isSelf ? 'is-self' : ''} rank-${rankDir}">` +
        `<span class="lad-rank">${i + 1}</span>` +
        `<span class="lad-dot" style="background:${f.color}"></span>` +
        `<span class="lad-name">${f.short}</span>` +
        `<span class="lad-bar"><i style="width:${pct * 2}px;background:${f.color}"></i></span>` +
        `<span class="lad-pow">${state.power[id]}</span>` +
        `<span class="lad-pct">${pct}%</span>` +
        `<span class="lad-arrow ${rankDir}">${arrow}</span>` +
      `</li>`;
    }).join('');
    // FLIP: invert + play
    if (prevOrder && !REDUCED) {
      [...ladderEl.children].forEach(li => {
        const last = li.getBoundingClientRect().top;
        const dy = (firstRects[li.dataset.fid] ?? last) - last;
        if (dy) {
          li.style.transform = `translateY(${dy}px)`;
          li.style.transition = 'none';
          requestAnimationFrame(() => {
            li.style.transition = 'transform .45s cubic-bezier(.2,.7,.3,1)';
            li.style.transform = '';
          });
        }
      });
    }
  }

  /* ------------------------------------------------------------ area share */
  function renderArea() {
    const counts = {};
    let tot = 0;
    state.provinces.forEach(p => { counts[p.owner] = (counts[p.owner] || 0) + 1; tot++; });
    const bar = document.getElementById('area-bar');
    const leg = document.getElementById('area-legend');
    const order = ['self', 'heukcheol', 'namwol', 'baeksan', 'neutral'].filter(id => counts[id]);
    bar.innerHTML = order.map(id =>
      `<i style="width:${(counts[id] / tot * 100).toFixed(1)}%;background:${FACTIONS[id].color}"
          title="${FACTIONS[id].short} ${counts[id]}"></i>`).join('');
    leg.innerHTML = order.map(id =>
      `<span class="al ${id === 'self' ? 'is-self' : ''}"><i style="background:${FACTIONS[id].color}"></i>` +
      `${FACTIONS[id].short} <b>${Math.round(counts[id] / tot * 100)}%</b></span>`).join('');
  }

  /* ------------------------------------------------------------- turn sim */
  const btnTurn = document.getElementById('btn-next-turn');
  const hint = document.getElementById('map-hint');

  function nextTurn() {
    if (state.turnIdx >= TURN_SCRIPT.length) return;
    const t = TURN_SCRIPT[state.turnIdx];
    const prevOrder = ladderOrder();

    // develop → brighten (visual weight grows)
    t.develop.forEach(d => {
      const p = state.provinces.find(x => x.id === d.id);
      if (p) p.development = d.to;
    });
    // capture → ownership flip + flash
    t.capture.forEach(c => {
      const p = state.provinces.find(x => x.id === c.id);
      if (p) { p.owner = c.to; p.threat = Math.max(6, p.threat - 20); flash(p, FACTIONS[c.to].color); }
    });
    // power shifts
    for (const id in t.power) state.power[id] = Math.max(1, (state.power[id] || 0) + t.power[id]);
    // momentum
    t.momentum.forEach(m => {
      const p = state.provinces.find(x => x.id === m.id);
      state.momentum.push({ name: p ? p.name : m.id, dir: m.dir });
    });

    document.getElementById('turn-num').textContent = t.turn;
    state.turnIdx++;

    paint();
    renderPowerDiff();
    renderMomentum();
    renderLadder(prevOrder);
    renderArea();

    // opportunity chaining (OPEN placeholder): highlight what the conquest opens
    if (t.opens.length) {
      highlightOpens(t.opens);
      const names = t.opens.map(id => (state.provinces.find(x => x.id === id) || {}).name).filter(Boolean);
      document.getElementById('edge-chain').innerHTML =
        `<span class="chain-open">이번 정복이 연 목표: ${names.join(' · ')}</span> <span class="open-badge">OPEN ?</span>`;
    } else {
      document.getElementById('edge-chain').textContent = '이번 턴에 열린 기회 없음';
    }

    banner(t.headline);

    if (state.turnIdx >= TURN_SCRIPT.length) {
      btnTurn.disabled = true;
      btnTurn.textContent = '시뮬 끝';
      hint.innerHTML = '스크립트 종료 — <b>↺</b> 로 리셋하고 다시 느껴보세요.';
    }
  }

  function flash(p, color) {
    if (REDUCED) return;
    const c = el('circle', { cx: p._cx, cy: p._cy, r: S * 0.3, class: 'fx-flash' });
    c.style.stroke = color;
    fxLayer.appendChild(c);
    setTimeout(() => c.remove(), 750);
  }
  function highlightOpens(ids) {
    ids.forEach(id => {
      const p = state.provinces.find(x => x.id === id);
      if (!p) return;
      const ring = el('polygon', { points: hexPoints(p._cx, p._cy), class: 'fx-open' });
      fxLayer.appendChild(ring);
      setTimeout(() => ring.remove(), REDUCED ? 100 : 2600);
    });
  }

  const bannerEl = document.createElement('div');
  bannerEl.className = 'turn-banner';
  stage.appendChild(bannerEl);
  let bannerTimer = null;
  function banner(text) {
    bannerEl.textContent = '▶ ' + text;
    bannerEl.classList.add('show');
    clearTimeout(bannerTimer);
    bannerTimer = setTimeout(() => bannerEl.classList.remove('show'), 2600);
  }

  /* ---------------------------------------------------------------- reset */
  function reset() {
    state.provinces = PROVINCES.map(p => Object.assign({}, p));
    state.power = Object.assign({}, POWER);
    state.turnIdx = 0;
    state.momentum = [];
    closeCard();
    document.getElementById('turn-num').textContent = '7';
    btnTurn.disabled = false;
    btnTurn.textContent = '다음 턴 ▶';
    hint.innerHTML = 'hover → 스탯 칩 · click → 프리필 명령 카드 · <b>다음 턴 ▶</b> 을 눌러 페이오프 루프를 움직임으로 확인';
    document.getElementById('edge-chain').textContent = '명령 카드에서 조정 시 표시';
    fxLayer.innerHTML = '';
    // rebuild positions
    hexLayer.innerHTML = ''; Object.keys(hexNodes).forEach(k => delete hexNodes[k]);
    buildSea(); buildHexes();
    paint(); renderPowerDiff(); renderMomentum(); renderLadder(null); renderArea();
  }

  /* ------------------------------------------------------------- wire up */
  function setLens(lens) {
    state.lens = lens;
    [...document.querySelectorAll('.lens-btn')].forEach(b =>
      b.classList.toggle('is-active', b.dataset.lens === lens));
    paint();
  }
  document.getElementById('lens-toggle').addEventListener('click', e => {
    const b = e.target.closest('.lens-btn');
    if (b) setLens(b.dataset.lens);
  });
  btnTurn.addEventListener('click', nextTurn);
  document.getElementById('btn-reset').addEventListener('click', reset);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCard(); });

  function hexToRgba(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  }

  /* ------------------------------------------------------------- init */
  buildSea();
  buildHexes();
  paint();
  renderPowerDiff();
  renderMomentum();
  renderLadder(null);
  renderArea();
})();
