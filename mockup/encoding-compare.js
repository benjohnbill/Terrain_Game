/* ============================================================================
 * Terrain Game — map encoding comparison (dummy data, presentation only).
 *   A = color-stack (owner hue + value->opacity + threat->saturation + dev->lightness)
 *   B = separable channels (owner hue fill + dev->brightness/glow, value->gold mark,
 *       threat->red border/halo), ownership always legible
 *   C = "이번 턴 변화량" overlay toggle (works over A or B)
 * Reuses payoff-loop.data.js (PROVINCES / FACTIONS / SEA_HEXES / TURN_SCRIPT).
 * ==========================================================================*/
(function () {
  'use strict';
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NS = 'http://www.w3.org/2000/svg';
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const r0 = Math.round;

  const state = {
    provinces: PROVINCES.map(p => Object.assign({}, p)),
    mode: 'A',
    deltaOn: false,
    turnIdx: 0,
    lastDelta: null,
  };

  /* ----- color helpers ----- */
  function hexToRgb(hex) { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h, s, l = (mx + mn) / 2;
    if (mx === mn) { h = s = 0; }
    else {
      const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
      switch (mx) { case r: h = (g - b) / d + (g < b ? 6 : 0); break; case g: h = (b - r) / d + 2; break; default: h = (r - g) / d + 4; }
      h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
  }
  const hslCache = {};
  function ownerHsl(color) { return hslCache[color] || (hslCache[color] = rgbToHsl(...hexToRgb(color))); }

  /* ----- THE ENCODINGS (single source, used by map + strip) ----- */
  function encode(p, mode) {
    const base = ownerHsl(FACTIONS[p.owner].color);
    if (mode === 'A') {
      // user's proposal: three metrics stacked as properties of the SAME fill
      const alpha = 0.22 + 0.78 * (p.value / 100);                       // value  -> opacity / vividness
      const sat   = clamp(base.s * (0.5 + 1.0 * (p.threat / 100)), 0, 100); // threat -> saturation
      const light = clamp(base.l * (0.72 + 0.46 * (p.development / 100)), 8, 82); // dev -> lightness
      return {
        fill: `hsla(${r0(base.h)},${r0(sat)}%,${r0(light)}%,${alpha.toFixed(2)})`,
        stroke: 'rgba(255,255,255,.06)', sw: 1, filter: '',
        showValueMark: false,
      };
    }
    // B: separable channels
    const light = clamp(base.l * (0.6 + 0.66 * (p.development / 100)), 12, 80); // dev -> brightness within owner hue
    const tw = p.threat < 20 ? 1 : (1 + 3 * (p.threat / 100));                  // threat -> border width
    const stroke = p.threat < 20 ? 'rgba(255,255,255,.10)'                      // threat -> red border
                                 : `rgba(255,71,87,${(0.3 + 0.7 * (p.threat / 100)).toFixed(2)})`;
    const f = [];
    if (!REDUCED && p.development >= 68) f.push(`drop-shadow(0 0 6px hsla(${r0(base.h)},90%,60%,.85))`);
    if (!REDUCED && p.threat >= 62) f.push('drop-shadow(0 0 5px rgba(255,71,87,.7))');
    return {
      fill: `hsla(${r0(base.h)},${r0(base.s)}%,${r0(light)}%,0.85)`,           // ownership always legible (stable alpha + hue)
      stroke, sw: tw, filter: f.join(' '),
      showValueMark: true,                                                     // value -> gold mark
    };
  }
  function valueMarkSize(v) { return 7 + 13 * (v / 100); }

  /* ----- geometry (flat-top) ----- */
  const S = 46, HW = 1.5 * S, HH = Math.sqrt(3) * S, MARGIN = 14;
  function hexCenter(col, row) {
    return { cx: MARGIN + S + HW * col, cy: MARGIN + HH / 2 + HH * row + (col & 1 ? HH / 2 : 0) };
  }
  function hexPoints(cx, cy, size) {
    const s = size || S, pts = [];
    for (let i = 0; i < 6; i++) { const a = (Math.PI / 180) * (60 * i); pts.push((cx + s * Math.cos(a)).toFixed(1) + ',' + (cy + s * Math.sin(a)).toFixed(1)); }
    return pts.join(' ');
  }
  function el(tag, attrs) { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; }
  function textEl(x, y, txt, cls, size) {
    const t = el('text', { x: x.toFixed(1), y: y.toFixed(1), class: cls, 'text-anchor': 'middle' });
    if (size) t.setAttribute('font-size', size); t.textContent = txt; return t;
  }

  const svg = document.getElementById('map-svg');
  const hexLayer = document.getElementById('hex-layer');
  const markLayer = document.getElementById('mark-layer');
  const fxLayer = document.getElementById('fx-layer');
  const stage = document.getElementById('map-stage');
  const hexNodes = {};

  (function setViewBox() {
    let maxX = 0, maxY = 0;
    state.provinces.concat(SEA_HEXES).forEach(h => { const c = hexCenter(h.col, h.row); maxX = Math.max(maxX, c.cx + S); maxY = Math.max(maxY, c.cy + HH / 2); });
    svg.setAttribute('viewBox', `0 0 ${r0(maxX + MARGIN)} ${r0(maxY + MARGIN)}`);
  })();

  function buildBoard() {
    hexLayer.innerHTML = ''; Object.keys(hexNodes).forEach(k => delete hexNodes[k]);
    SEA_HEXES.forEach(h => { const c = hexCenter(h.col, h.row); hexLayer.appendChild(el('polygon', { points: hexPoints(c.cx, c.cy), class: 'hex-sea' })); });
    state.provinces.forEach(p => {
      const c = hexCenter(p.col, p.row); p._cx = c.cx; p._cy = c.cy;
      const poly = el('polygon', { points: hexPoints(c.cx, c.cy), class: 'hex', 'data-id': p.id, tabindex: '0', role: 'button', 'aria-label': p.name });
      poly.addEventListener('mouseenter', () => showChip(p));
      poly.addEventListener('mousemove', ev => positionChip(ev));
      poly.addEventListener('mouseleave', hideChip);
      poly.addEventListener('focus', () => { showChip(p); positionChipAt(p._cx, p._cy); });
      poly.addEventListener('blur', hideChip);
      hexLayer.appendChild(poly); hexNodes[p.id] = poly;
    });
  }

  /* ----- steady-state paint (A or B) ----- */
  function paintSteady() {
    document.getElementById('delta-empty').classList.add('hidden');
    const mode = state.mode;
    state.provinces.forEach(p => {
      const poly = hexNodes[p.id], e = encode(p, mode);
      poly.style.fill = e.fill; poly.style.stroke = e.stroke; poly.style.strokeWidth = e.sw; poly.style.filter = e.filter;
    });
    buildMarks(mode);
  }
  function buildMarks(mode) {
    markLayer.innerHTML = '';
    state.provinces.forEach(p => {
      const cx = p._cx, cy = p._cy, e = encode(p, mode);
      markLayer.appendChild(textEl(cx, cy - 13, p.name, 'ic-name', 12));
      if (e.showValueMark && p.value >= 25) markLayer.appendChild(textEl(cx, cy + 8, '◆', 'ic-val', valueMarkSize(p.value)));
      if (p.confidence < 0.5) markLayer.appendChild(textEl(cx - S * 0.5, cy + S * 0.66, '◔', 'ic-uncertain', 12));
    });
  }

  /* ----- delta overlay (C) ----- */
  function renderDelta() {
    markLayer.innerHTML = '';
    const empty = document.getElementById('delta-empty');
    if (!state.lastDelta) {
      empty.classList.remove('hidden');
      state.provinces.forEach(p => dimHex(p));
      return;
    }
    empty.classList.add('hidden');
    const changed = new Set();
    state.lastDelta.develop.forEach(d => changed.add(d.id));
    state.lastDelta.capture.forEach(c => changed.add(c.id));

    state.provinces.forEach(p => {
      if (!changed.has(p.id)) { dimHex(p); markLayer.appendChild(textEl(p._cx, p._cy - 13, p.name, 'ic-name', 11)); }
    });
    // developed this turn -> owner hue bright + green ▲
    state.lastDelta.develop.forEach(d => {
      const p = state.provinces.find(x => x.id === d.id); const base = ownerHsl(FACTIONS[p.owner].color);
      hexNodes[p.id].style.fill = `hsla(${r0(base.h)},${r0(base.s)}%,${r0(clamp(base.l * 1.15, 20, 82))}%,0.9)`;
      hexNodes[p.id].style.stroke = 'rgba(46,213,115,.9)'; hexNodes[p.id].style.strokeWidth = 2.4;
      hexNodes[p.id].style.filter = REDUCED ? '' : 'drop-shadow(0 0 6px rgba(46,213,115,.7))';
      markLayer.appendChild(textEl(p._cx, p._cy - 13, p.name, 'ic-name', 11));
      markLayer.appendChild(textEl(p._cx, p._cy + 10, `▲+${d.to - d.from}`, 'd-up', 13));
    });
    // captured this turn -> new owner bright + flip tag + flash
    state.lastDelta.capture.forEach(c => {
      const p = state.provinces.find(x => x.id === c.id); const base = ownerHsl(FACTIONS[c.to].color);
      const lost = c.from === 'self';
      hexNodes[p.id].style.fill = `hsla(${r0(base.h)},${r0(base.s)}%,${r0(clamp(base.l * 1.1, 20, 80))}%,0.92)`;
      hexNodes[p.id].style.stroke = lost ? 'rgba(255,71,87,.95)' : 'rgba(255,255,255,.9)'; hexNodes[p.id].style.strokeWidth = 3;
      hexNodes[p.id].style.filter = '';
      markLayer.appendChild(textEl(p._cx, p._cy - 13, p.name, 'ic-name', 11));
      markLayer.appendChild(textEl(p._cx, p._cy + 11, (lost ? '▼ ' : '→ ') + FACTIONS[c.to].short, lost ? 'd-down' : 'd-flip', 12));
      flash(p, FACTIONS[c.to].color);
    });
  }
  function dimHex(p) {
    const base = ownerHsl(FACTIONS[p.owner].color);
    hexNodes[p.id].style.fill = `hsla(${r0(base.h)},10%,20%,0.5)`;
    hexNodes[p.id].style.stroke = 'rgba(255,255,255,.05)'; hexNodes[p.id].style.strokeWidth = 1; hexNodes[p.id].style.filter = '';
  }

  function render() { if (state.deltaOn) renderDelta(); else paintSteady(); renderLegend(); }

  function flash(p, color) {
    if (REDUCED) return;
    const c = el('circle', { cx: p._cx, cy: p._cy, r: S * 0.3, class: 'fx-flash' }); c.style.stroke = color;
    fxLayer.appendChild(c); setTimeout(() => c.remove(), 800);
  }

  /* ----- legend adapts to mode / delta ----- */
  function renderLegend() {
    const box = document.getElementById('legend');
    if (state.deltaOn) {
      box.innerHTML =
        `<span class="lg-title">변화량 (이번 턴)</span>` +
        `<span class="chan" style="color:var(--green)">▲ 발전 상승</span>` +
        `<span class="chan" style="color:#fff">→ 소유 획득</span>` +
        `<span class="chan" style="color:var(--red)">▼ 소유 상실</span>` +
        `<span class="lg">나머지는 <b>흐리게</b> — 바뀐 곳만 눈에 들어오게</span>`;
      return;
    }
    if (state.mode === 'A') {
      box.innerHTML =
        `<span class="lg-title">A · 색 스택</span>` +
        `<span class="chan">소유 → <b>기본 hue</b></span>` +
        `<span class="chan">가치 → <b>투명도</b>(선명함)</span>` +
        `<span class="chan">위협 → <b>채도</b></span>` +
        `<span class="chan">발전 → <b>명도</b></span>` +
        `<span class="lg warn">⚠ 세 속성이 같은 색에 겹쳐 서로 오염 — 저가치 셀은 소유색도 흐려짐</span>`;
    } else {
      box.innerHTML =
        `<span class="lg-title">B · 분리 채널</span>` +
        `<span class="chan">소유 → <b>기본 hue</b>(상시)</span>` +
        `<span class="chan">발전 → <b>밝기·발광</b></span>` +
        `<span class="chan" style="color:var(--gold)">가치 → <b>◆ 골드 마크</b></span>` +
        `<span class="chan" style="color:var(--red)">위협 → <b>붉은 테두리</b></span>` +
        `<span class="lg">각 차원이 다른 채널 → 서로 간섭 없음</span>`;
    }
  }

  /* ----- hover chip: ground truth numbers ----- */
  const chip = document.getElementById('hex-chip');
  function showChip(p) {
    const owner = FACTIONS[p.owner];
    chip.innerHTML =
      `<div class="chip-head"><span class="chip-name">${p.name}</span><span class="chip-own" style="color:${owner.color}">▣ ${owner.short}</span></div>` +
      `<div class="chip-row"><span>◆ 가치</span><b style="color:var(--gold)">${p.value}</b></div>` +
      `<div class="chip-row"><span>▲ 발전</span><b style="color:var(--green)">${p.development}</b></div>` +
      `<div class="chip-row"><span>⚔ 위협</span><b style="color:var(--red)">${p.threat}</b></div>` +
      `<div class="chip-truth">정답지 — 화면 인코딩이 이 수치와 맞게 읽히는지 확인</div>`;
    chip.classList.remove('hidden');
  }
  function positionChip(ev) { const r = stage.getBoundingClientRect(); placeChip(ev.clientX - r.left, ev.clientY - r.top); }
  function positionChipAt(svgx, svgy) {
    const r = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal;
    placeChip((svgx / vb.width) * r.width, (svgy / vb.height) * r.height);
  }
  function placeChip(px, py) {
    const cw = chip.offsetWidth, ch = chip.offsetHeight;
    let x = px + 16, y = py + 16;
    if (x + cw > stage.clientWidth) x = px - cw - 16;
    if (y + ch > stage.clientHeight) y = stage.clientHeight - ch - 8;
    chip.style.left = Math.max(4, x) + 'px'; chip.style.top = Math.max(4, y) + 'px';
  }
  function hideChip() { chip.classList.add('hidden'); }

  /* ----- turn simulation (creates a delta) ----- */
  const btnNext = document.getElementById('btn-next');
  function nextTurn() {
    if (state.turnIdx >= TURN_SCRIPT.length) return;
    const t = TURN_SCRIPT[state.turnIdx];
    const delta = { turn: t.turn, develop: [], capture: [] };
    t.develop.forEach(d => { const p = state.provinces.find(x => x.id === d.id); if (p) { delta.develop.push({ id: d.id, from: p.development, to: d.to }); p.development = d.to; } });
    t.capture.forEach(c => { const p = state.provinces.find(x => x.id === c.id); if (p) { delta.capture.push({ id: c.id, from: c.from, to: c.to }); p.owner = c.to; p.threat = Math.max(6, p.threat - 20); } });
    state.lastDelta = delta; state.turnIdx++;
    document.getElementById('turn-num').textContent = t.turn;
    render();
    if (state.turnIdx >= TURN_SCRIPT.length) { btnNext.disabled = true; btnNext.textContent = '시뮬 끝'; }
  }
  function reset() {
    state.provinces = PROVINCES.map(p => Object.assign({}, p));
    state.turnIdx = 0; state.lastDelta = null; fxLayer.innerHTML = '';
    document.getElementById('turn-num').textContent = '7';
    btnNext.disabled = false; btnNext.textContent = '다음 턴 ▶';
    buildBoard(); render();
  }

  /* ----- decode test strip ----- */
  const SCENARIOS = [
    { sc: 'S1', label: '고가치·저위협', value: 92, development: 50, threat: 12 },
    { sc: 'S2', label: '저가치·고위협', value: 22, development: 50, threat: 90 },
    { sc: 'S3', label: '고가치·고위협', value: 90, development: 50, threat: 88 },
    { sc: 'S4', label: '저가치·저위협', value: 20, development: 48, threat: 14 },
    { sc: 'S5', label: '발전 정점',     value: 52, development: 96, threat: 28 },
  ];
  function miniHex(scenario, mode) {
    const p = Object.assign({ owner: 'self', confidence: 1 }, scenario);
    const e = encode(p, mode), cx = 46, cy = 46, size = 34;
    const s = `<svg viewBox="0 0 92 92" xmlns="${NS}">` +
      `<polygon points="${hexPoints(cx, cy, size)}" ` +
        `style="fill:${e.fill};stroke:${e.stroke};stroke-width:${e.sw};filter:${e.filter}"/>` +
      (e.showValueMark && p.value >= 25
        ? `<text x="46" y="52" text-anchor="middle" class="ic-val" font-size="${valueMarkSize(p.value)}">◆</text>` : '') +
      `</svg>`;
    return s;
  }
  function buildStrip() {
    const grid = document.getElementById('strip-grid');
    let html = '';
    // row 1: truth
    html += `<div class="sg-rowlabel">정답지</div>`;
    SCENARIOS.forEach(s => {
      html += `<div class="sg-truth"><span class="sc">${s.label}</span>` +
        `<span class="v">가치 ${s.value}</span> · <span class="d">발전 ${s.development}</span> · <span class="t">위협 ${s.threat}</span></div>`;
    });
    // row 2: A
    html += `<div class="sg-rowlabel">A<b>색 스택</b></div>`;
    SCENARIOS.forEach(s => { html += `<div class="sg-cell">${miniHex(s, 'A')}</div>`; });
    // row 3: B
    html += `<div class="sg-rowlabel">B<b>분리 채널</b></div>`;
    SCENARIOS.forEach(s => { html += `<div class="sg-cell">${miniHex(s, 'B')}</div>`; });
    grid.innerHTML = html;
  }

  /* ----- controls ----- */
  function setMode(m) {
    state.mode = m;
    [...document.querySelectorAll('.seg-btn')].forEach(b => b.classList.toggle('is-active', b.dataset.mode === m));
    render();
  }
  function toggleDelta() {
    state.deltaOn = !state.deltaOn;
    document.getElementById('btn-delta').setAttribute('aria-pressed', String(state.deltaOn));
    render();
  }
  document.getElementById('mode-seg').addEventListener('click', e => { const b = e.target.closest('.seg-btn'); if (b) setMode(b.dataset.mode); });
  document.getElementById('btn-delta').addEventListener('click', toggleDelta);
  btnNext.addEventListener('click', nextTurn);
  document.getElementById('btn-reset').addEventListener('click', reset);
  document.addEventListener('keydown', e => {
    if (e.key === '1') setMode('A');
    else if (e.key === '2') setMode('B');
    else if (e.key === 'd' || e.key === 'D' || e.key === 'ㅇ') toggleDelta();
  });

  /* ----- init ----- */
  buildBoard();
  render();
  buildStrip();
})();
