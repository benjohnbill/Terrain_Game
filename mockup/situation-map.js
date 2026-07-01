/* ============================================================================
 * Terrain Game — situation-map mockup v3 / integrated 형세판단 + fog (불확실 축).
 * ----------------------------------------------------------------------------
 * ADR 0019 stage-1 situation judgment, rendered on the A2 military-cartographic
 * (block-wargame) visual language, with fog folded in as the 불확실 axis:
 *   - the READING is posture-invariant truth: all surfaced tensions (판세 + the
 *     located axes 위협/기회/불확실), ordered by raw magnitude
 *   - relational threat (adjacency + estimated force + confidence gating)
 *   - FOG = the 불확실 axis. Every foe province carries a knowledge state
 *     (undiscovered murk / glimpsed estimate-band / reliable / owned) derived
 *     from information confidence. A low-confidence border foe routes to 불확실;
 *     SCOUTING raises confidence (-> MAX 0.90) and re-runs classify — the scout
 *     reveal IS the axis transition (murk lifts, the meter narrows, the axis
 *     resolves to 위협/기회 on this province or a neighbour).
 *   - POSTURE only sets which single tension the game RECOMMENDS for the turn's
 *     one action; dissonance warns when that is not the most pressing tension.
 *   - stage-1 -> stage-2 bridge: see ~N, act on 1 (scouting spends that 1).
 * The axis is DERIVED here (classify), never stored in the data (ADR 0019).
 * ==========================================================================*/
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const CAP = 6;          // show up to CAP surfaced tensions (posture-independent)
  const RELIABLE = 0.5;   // IntelSystem.isReliable threshold — the fog knowledge gate
  const DISS_RATIO = 1.2; // recommendation is dissonant if the raw top is >1.2x its magnitude
  const SCOUT_GAIN = 0.5; // confidence a single scout buys (clamped to MAX_CONFIDENCE)

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const reliable = c => c >= RELIABLE;

  /* map-tinted terrain palette (A2 map-table) */
  const TERRAIN_TINT = { '평야': '#6b6f45', '구릉': '#77693f', '산지': '#6a6558', '관문': '#585d3e', '하천': '#3f5566', '해안': '#436074' };

  /* ---------- geometry (flat-top, odd-q) ---------- */
  const S = 42, HW = 1.5 * S, HH = Math.sqrt(3) * S, M = 18;
  const center = (c, r) => ({ x: M + S + HW * c, y: M + HH / 2 + HH * r + (c & 1 ? HH / 2 : 0) });
  function corners(cx, cy) { const a = []; for (let i = 0; i < 6; i++) { const t = Math.PI / 180 * 60 * i; a.push([cx + S * Math.cos(t), cy + S * Math.sin(t)]); } return a; }
  const cornerStr = (cx, cy) => corners(cx, cy).map(pt => pt[0].toFixed(1) + ',' + pt[1].toFixed(1)).join(' ');
  function neighbor(c, r, e) {
    const odd = c & 1;
    switch (e) {
      case 1: return [c, r + 1]; case 4: return [c, r - 1];
      case 0: return odd ? [c + 1, r + 1] : [c + 1, r];
      case 5: return odd ? [c + 1, r] : [c + 1, r - 1];
      case 2: return odd ? [c - 1, r + 1] : [c - 1, r];
      case 3: return odd ? [c - 1, r] : [c - 1, r - 1];
    }
  }
  const el = (t, a) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); return e; };
  const rgba = (rgb, a) => `rgba(${rgb},${a})`;
  const hexToRgb = h => { const n = parseInt(h.slice(1), 16); return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`; };
  function txt(x, y, s, cls, size) { const t = el('text', { x: x.toFixed(1), y: y.toFixed(1), class: cls, 'text-anchor': 'middle', 'font-size': size }); t.textContent = s; return t; }

  /* ---------- index + centroids + computed adjacency ---------- */
  const hexIndex = {}, byId = {};
  PROVINCES.forEach(p => { byId[p.id] = p; p.hexes.forEach(([c, r]) => hexIndex[c + ',' + r] = p.id); });
  PROVINCES.forEach(p => {
    const cs = p.hexes.map(([c, r]) => center(c, r));
    p._cx = cs.reduce((s, v) => s + v.x, 0) / cs.length;
    p._cy = cs.reduce((s, v) => s + v.y, 0) / cs.length;
    const adj = new Set();
    p.hexes.forEach(([c, r]) => { for (let e = 0; e < 6; e++) { const nb = neighbor(c, r, e); const id2 = hexIndex[nb[0] + ',' + nb[1]]; if (id2 && id2 !== p.id) adj.add(id2); } });
    p._adj = [...adj];
  });
  const isSelf = p => p.owner === 'self';
  const isFoe = p => p.owner !== 'self';
  const developed = p => isSelf(p) && p.economyValue >= 12;
  // snapshot the original fog so a turn can be reset after scouting
  PROVINCES.forEach(p => { if (isFoe(p)) { p._conf0 = p.estForceConfidence; p._minc0 = p.minConfidence; p._disc0 = (p.discovered !== false); } });

  /* ---------- fog knowledge state (derived from ownership + confidence) ---------- */
  function stateOf(p) {
    if (isSelf(p)) return 'owned';
    if (p.discovered === false) return 'unknown';       // murk: occupant unseen
    return reliable(p.estForceConfidence) ? 'reliable' : 'glimpse';
  }
  const forceLevel = v => v == null ? 0 : v < 8 ? 1 : v < 14 ? 2 : v < 22 ? 3 : 4;   // 4-segment strength band (Columbia)
  function meterBand(st, conf, level) {                  // glimpse = a true-containing estimate range (HOI4 error band)
    if (st !== 'glimpse') return { lo: level, hi: level };
    const spread = conf < 0.32 ? 3 : conf < 0.45 ? 2 : 1;
    return { lo: clamp(level - spread, 1, 4), hi: clamp(level + spread, 1, 4) };
  }

  /* ---------- classify: derive the located axis (ADR 0019) ---------- */
  function ourAdjForce(p) { let f = 0; p._adj.forEach(id => { const q = byId[id]; if (isSelf(q)) f = Math.max(f, q.weakestGarrison); }); return f; }
  function classify(p) {
    if (isSelf(p)) {
      let worst = null;
      p._adj.forEach(id => { const e = byId[id]; if (isFoe(e) && reliable(e.estForceConfidence) && e.estForce > p.weakestGarrison && (!worst || e.estForce > worst.estForce)) worst = e; });
      if (worst) {
        const mag = clamp((worst.estForce - p.weakestGarrison) / p.weakestGarrison, 0, 3) * 20 + p.economyValue / 2;
        return { axis: 'threat', mag, intent: 'reinforce', driver: worst.id, target: p.id,
          reason: `${FACTIONS[worst.owner].short} ${worst.name}(추정 ${worst.estForce}) 병력이 ${p.name} 최약 수비 ${p.weakestGarrison}을(를) 넘어섭니다.` };
      }
      return null;
    }
    if (!p._adj.some(id => isSelf(byId[id]))) return null;
    if (!reliable(p.minConfidence)) {
      return { axis: 'uncertainty', mag: p.economyValue * (1 - p.minConfidence) * 3, intent: 'scout', target: p.id,
        reason: `${p.name} 정보 신뢰 ${Math.round(p.minConfidence * 100)}% — 위협·기회를 판단할 수 없습니다. 정찰이 해소합니다.` };
    }
    const our = ourAdjForce(p);
    if (p.economyValue >= 12 && our >= p.estForce) {
      const adv = clamp(our / p.estForce, 0.6, 1.5);
      return { axis: 'opportunity', mag: p.economyValue * adv, intent: 'prepare_offensive', target: p.id,
        reason: `${p.name} 경제 ${p.economyValue} · 도달 가능 · 아군 우세(${our} vs 추정 ${p.estForce}).` };
    }
    return null;
  }
  const reclassify = () => PROVINCES.forEach(p => { p._c = classify(p); });
  reclassify();

  /* ---------- reading (truth, posture-invariant) + recommendation (posture) ---------- */
  const state = { postureId: 'balanced', spentOn: null, spentKind: null, reveal: null, cardOn: null };
  function reading() {
    return PROVINCES.filter(p => p._c).map(p => ({ p, axis: p._c.axis, mag: p._c.mag })).sort((a, b) => b.mag - a.mag).slice(0, CAP);
  }
  function recommend(read, posture) {
    const rawTop = read[0];
    let rec = rawTop;
    if (posture.prefer) { const top = read.find(c => c.axis === posture.prefer); if (top) rec = top; }
    const dissonant = rec.p.id !== rawTop.p.id && rawTop.mag > rec.mag * DISS_RATIO;
    return { rec, rawTop, dissonant };
  }
  const recNow = () => recommend(reading(), POSTURES[state.postureId]);

  /* ---------- scout: the fog reveal that IS the axis transition ---------- */
  function scout(p) {
    p.discovered = true;
    p.estForceConfidence = Math.min(MAX_CONFIDENCE, p.estForceConfidence + SCOUT_GAIN);
    p.minConfidence = Math.min(MAX_CONFIDENCE, p.minConfidence + SCOUT_GAIN);
    state.spentOn = p.id; state.spentKind = 'scout';
    reclassify();                                        // re-derive the whole board after the reveal
    state.reveal = scoutReveal(p);
  }
  function scoutReveal(p) {                              // what did lifting the fog expose?
    if (p._c && p._c.axis === 'opportunity')
      return { kind: 'opportunity', prov: p, text: `${p.name} 기회 확인 — 경제 ${p.economyValue} · 도달 가능 · 병력 ${p.estForce}로 확정.` };
    const hit = PROVINCES.find(q => isSelf(q) && q._c && q._c.axis === 'threat' && q._c.driver === p.id);
    if (hit)
      return { kind: 'threat', prov: hit, driver: p, text: `${hit.name} 위협 — ${FACTIONS[p.owner].short} ${p.name} 병력 ${p.estForce}이(가) 최약 수비 ${hit.weakestGarrison}을(를) 넘어섭니다.` };
    return { kind: 'calm', prov: p, text: `${p.name} — 위협도 기회도 아닌 조용한 접경. 이 정찰은 행동을 아꼈어도 좋았습니다.` };
  }
  function resetTurn() {
    PROVINCES.forEach(p => { if (p._conf0 != null) { p.estForceConfidence = p._conf0; p.minConfidence = p._minc0; p.discovered = p._disc0; } });
    reclassify();
    state.spentOn = null; state.spentKind = null; state.reveal = null;
  }

  /* ---------- DOM refs ---------- */
  const svg = document.getElementById('map-svg');
  const L = { terrain: id('l-terrain'), murk: id('l-murk'), glow: id('l-glow'), perim: id('l-perim'), arrow: id('l-arrow'), counter: id('l-counter'), label: id('l-label'), mark: id('l-mark'), fx: id('l-fx') };
  const stage = id('map-stage'), chip = id('chip'), card = id('card');
  function id(x) { return document.getElementById(x); }
  const cntScale = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--counter')) || 1;

  (function viewBox() {
    let mx = 0, my = 0;
    PROVINCES.forEach(p => p.hexes.forEach(([c, r]) => { const q = center(c, r); mx = Math.max(mx, q.x + S); my = Math.max(my, q.y + HH / 2); }));
    svg.setAttribute('viewBox', `0 0 ${Math.round(mx + M)} ${Math.round(my + M + 8)}`);
  })();

  /* ---------- render ---------- */
  function render() {
    const read = reading(), posture = POSTURES[state.postureId], { rec, rawTop, dissonant } = recommend(read, posture);
    const shownIds = new Set(read.map(s => s.p.id));
    const scale = cntScale();
    Object.values(L).forEach(g => (g.innerHTML = ''));

    PROVINCES.forEach(p => {
      const st = stateOf(p), owner = FACTIONS[p.owner], orgb = hexToRgb(owner.color);
      const dim = state.spentOn && state.spentOn !== p.id ? ' dimmed' : '';

      // terrain hexes (position fog: terrain is always visible)
      p.hexes.forEach(([c, r]) => { const q = center(c, r);
        L.terrain.appendChild(el('polygon', { points: cornerStr(q.x, q.y), fill: TERRAIN_TINT[p.terrain] || '#5f6440', class: 'terrain st-' + st + dim, 'data-prov': p.id })); });

      // murk wash over undiscovered occupants
      if (st === 'unknown') p.hexes.forEach(([c, r]) => { const q = center(c, r);
        L.murk.appendChild(el('polygon', { points: cornerStr(q.x, q.y), class: 'murk' })); });

      // 판세 development glow (owned + high economy)
      if (developed(p) && !dim) glow(p, GROWTH_RGB, 0.14, S * 1.2);
      // located-axis glow
      if (p._c && shownIds.has(p.id)) glow(p, AXES[p._c.axis].rgb, dim ? 0.06 : 0.16, S * 1.28);

      // province perimeter in owner colour
      p.hexes.forEach(([c, r]) => { const q = center(c, r), cn = corners(q.x, q.y);
        for (let e = 0; e < 6; e++) { const nb = neighbor(c, r, e);
          if (hexIndex[nb[0] + ',' + nb[1]] !== p.id) { const a = cn[e], b = cn[(e + 1) % 6];
            L.perim.appendChild(el('line', { x1: a[0].toFixed(1), y1: a[1].toFixed(1), x2: b[0].toFixed(1), y2: b[1].toFixed(1), stroke: rgba(orgb, dim ? 0.28 : (isSelf(p) ? 0.9 : 0.6)), 'stroke-width': isSelf(p) ? 2.4 : 1.8, 'stroke-linecap': 'round' })); } } });

      // unit block-counter + strength meter (A2), or murk '?' glyph
      drawCounter(p, st, scale, dim);
      if (st === 'glimpse' || st === 'unknown') drawRecon(p, st, dim);

      L.label.appendChild(txt(p._cx, p._cy - 22 * scale, p.name, 'p-name' + (dim ? ' dim' : ''), 13));
    });

    // relational threat arrows
    read.filter(s => s.axis === 'threat' && s.p._c.driver).forEach(s => L.arrow.appendChild(arrow(byId[s.p._c.driver]._cx, byId[s.p._c.driver]._cy, s.p._cx, s.p._cy)));
    // axis badges for every surfaced tension
    read.forEach(s => drawBadge(s.p, s.axis, state.spentOn === s.p.id, cntScale()));
    // recommendation ring — the game's suggested pick for the 1 action
    if (!state.spentOn) drawRecRing(rec.p);

    renderAdvice(posture, rec, rawTop, dissonant);
    renderActionPill(read);
    renderBriefing(read, rec);
    renderLegend(read);
    renderPosture();
  }

  function glow(p, rgb, a, r) {
    const g = el('circle', { cx: p._cx.toFixed(1), cy: p._cy.toFixed(1), r: r.toFixed(1), fill: rgba(rgb, a), class: 'glow' });
    if (!REDUCED) g.setAttribute('filter', 'url(#soft)');
    L.glow.appendChild(g);
  }

  // unit counter (block) with a 4-segment strength meter
  function drawCounter(p, st, scale, dim) {
    if (st === 'unknown') { L.counter.appendChild(txt(p._cx, p._cy + 7, '?', 'murk-q', 24)); return; }
    const cw = 48 * scale, ch = 30 * scale, x = p._cx - cw / 2, y = p._cy - ch / 2, owner = FACTIONS[p.owner];
    const g = el('g', { class: 'ctr s-' + st + (dim ? ' dimmed' : ''), 'data-prov': p.id });
    g.appendChild(el('rect', { class: 'counter', x: x.toFixed(1), y: y.toFixed(1), width: cw.toFixed(1), height: ch.toFixed(1), rx: 4, fill: owner.color, stroke: st === 'owned' ? '#f4efdc' : '#171b0f' }));
    g.appendChild(el('rect', { class: 'counter-frame', x: (x + 2.5).toFixed(1), y: (y + 2.5).toFixed(1), width: (cw - 5).toFixed(1), height: (ch - 5).toFixed(1), rx: 3, fill: 'none' }));
    g.appendChild(txt(p._cx, y + 12.5 * scale, owner.short, 'ctr-tag', (10 * scale).toFixed(1)));
    // strength meter (exact for owned/reliable, an estimate band for glimpse)
    const v = isSelf(p) ? p.weakestGarrison : p.estForce, level = forceLevel(v), b = meterBand(st, p.estForceConfidence, level);
    const gap = 2, mw = cw - 10, cellW = (mw - gap * 3) / 4, my = y + ch - 8 * scale, mx0 = x + 5;
    for (let i = 0; i < 4; i++) { const cls = i < b.lo ? 'cell lit' : i < b.hi ? 'cell faded' : 'cell off';
      g.appendChild(el('rect', { class: cls, x: (mx0 + i * (cellW + gap)).toFixed(1), y: my.toFixed(1), width: cellW.toFixed(1), height: (5 * scale).toFixed(1), rx: 1 })); }
    L.counter.appendChild(g);
  }

  // corner recon scope — scoutable / info incomplete
  function drawRecon(p, st, dim) {
    const g = el('g', { class: 'ctr s-' + st + (dim ? ' dimmed' : '') });
    const mx = p._cx + 25, my = p._cy - 17;
    g.appendChild(el('circle', { class: 'recon-mark', cx: mx.toFixed(1), cy: my.toFixed(1), r: 4.2, 'stroke-dasharray': '2 1.6' }));
    g.appendChild(el('line', { class: 'recon-mark', x1: (mx + 2.7).toFixed(1), y1: (my + 2.7).toFixed(1), x2: (mx + 5.6).toFixed(1), y2: (my + 5.6).toFixed(1) }));
    L.counter.appendChild(g);
  }

  function arrow(x1, y1, x2, y2) {
    const g = el('g', { class: 'threat-arrow' });
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len;
    const sx = x1 + ux * S * 0.9, sy = y1 + uy * S * 0.9, ex = x2 - ux * S * 1.0, ey = y2 - uy * S * 1.0;
    g.appendChild(el('line', { x1: sx.toFixed(1), y1: sy.toFixed(1), x2: ex.toFixed(1), y2: ey.toFixed(1), stroke: rgba(AXES.threat.rgb, 0.8), 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-dasharray': '2 6', class: REDUCED ? '' : 'flow' }));
    const a1 = Math.atan2(ey - sy, ex - sx);
    [-0.5, 0.5].forEach(off => { const hx = ex - 12 * Math.cos(a1 - off), hy = ey - 12 * Math.sin(a1 - off); g.appendChild(el('line', { x1: ex.toFixed(1), y1: ey.toFixed(1), x2: hx.toFixed(1), y2: hy.toFixed(1), stroke: rgba(AXES.threat.rgb, 0.9), 'stroke-width': 3, 'stroke-linecap': 'round' })); });
    return g;
  }

  function drawBadge(p, axis, isSpent, scale) {
    const t = AXES[axis], label = t.glyph + ' ' + t.label;
    const w = label.length * 11 + 24, h = 22, x = p._cx - w / 2, y = p._cy + 20 * scale;
    const g = el('g', { class: 'badge', 'data-prov': p.id, opacity: state.spentOn && !isSpent ? 0.32 : 1 });
    g.appendChild(el('rect', { x: x.toFixed(1), y: y.toFixed(1), width: w, height: h, rx: 11, fill: isSpent ? rgba(t.rgb, 0.92) : 'rgba(18,22,12,0.9)', stroke: rgba(t.rgb, 0.9), 'stroke-width': 1.5 }));
    const label_t = txt(p._cx, y + h / 2 + 4, label, 'badge-t', 12); label_t.setAttribute('fill', isSpent ? '#12160c' : rgba(t.rgb, 1));
    g.appendChild(label_t);
    L.mark.appendChild(g);
  }

  function drawRecRing(p) {
    const g = el('g', { class: 'rec-ring' });
    g.appendChild(el('circle', { cx: p._cx.toFixed(1), cy: p._cy.toFixed(1), r: (S * 1.5).toFixed(1), fill: 'none', stroke: FACTIONS.self.color, 'stroke-width': 2.5, 'stroke-dasharray': '7 5', class: REDUCED ? '' : 'flow' }));
    L.fx.appendChild(g);
  }

  /* ---------- rail: advice (recommendation + dissonance) ---------- */
  function renderAdvice(posture, rec, rawTop, dissonant) {
    const t = AXES[rec.axis];
    let html = `<div class="ad-row"><span class="ad-k">자세 <b>${posture.label}</b></span>` +
      `<span class="ad-rec">게임 추천 <b style="color:rgb(${t.rgb})">${rec.p.name}</b> · ${INTENTS[rec.p._c.intent]}</span></div>`;
    if (dissonant) {
      const rt = AXES[rawTop.axis];
      html += `<div class="ad-diss"><span class="ad-diss-tag">부조화</span><span class="ad-diss-body">이번 턴 최대 형세는 <b style="color:rgb(${rt.rgb})">${rawTop.p.name} ${rt.label}</b>입니다 — 추천을 따르면 이걸 놓쳐요.<span class="ad-why">${rawTop.p._c.reason}</span></span></div>`;
    } else {
      html += `<div class="ad-ok">이 추천이 이번 턴 최급선무와 일치합니다.</div>`;
    }
    id('advice').innerHTML = html;
  }

  function renderActionPill(read) {
    const ap = id('action-pill');
    if (state.spentOn && state.spentKind === 'scout' && state.reveal) {
      const rv = state.reveal;
      ap.innerHTML = `<div class="ap-line"><span class="ap-k">이번 턴 행동</span><span class="ap-spent scout">정찰 완료</span><button class="ap-reset" id="ap-reset">되돌리기</button></div>` +
        `<div class="ap-reveal ${rv.kind}"><span class="ap-reveal-h">${rv.kind === 'threat' ? '안개가 위협을 숨기고 있었다' : rv.kind === 'opportunity' ? '안개가 기회를 숨기고 있었다' : '안개 너머는 조용했다'}</span><span class="ap-reveal-b">${rv.text}</span>${rv.kind !== 'calm' ? '<span class="ap-next">해소는 봤지만 이번 턴 행동은 정찰에 소진 — 대응은 다음 턴</span>' : ''}</div>`;
      id('ap-reset').onclick = () => { resetTurn(); closeCard(); render(); };
    } else if (state.spentOn) {
      const p = byId[state.spentOn];
      ap.innerHTML = `<div class="ap-line"><span class="ap-k">이번 턴 행동</span><span class="ap-spent">소진 — ${p.name} ${INTENTS[p._c.intent]}</span><button class="ap-reset" id="ap-reset">되돌리기</button></div>`;
      id('ap-reset').onclick = () => { resetTurn(); closeCard(); render(); };
    } else {
      ap.innerHTML = `<div class="ap-line"><span class="ap-k">이번 턴 행동</span><span class="ap-left">1회</span><span class="ap-note">형세 ${read.length}개 중 <b>하나만</b> — 추천을 따르거나, 불확실을 <b>정찰</b>해 해소하거나</span></div>`;
    }
  }

  function renderBriefing(read, rec) {
    id('briefing').innerHTML = read.map(s => {
      const p = s.p, t = AXES[s.axis], conf = confOf(p), st = stateOf(p);
      const dim = state.spentOn && state.spentOn !== p.id, isRec = rec.p.id === p.id;
      return `<button class="br-item${dim ? ' dim' : ''}${state.spentOn === p.id ? ' chosen' : ''}${isRec && !state.spentOn ? ' rec' : ''}" data-prov="${p.id}">` +
        `<span class="br-dot" style="background:rgb(${t.rgb})"></span>` +
        `<span class="br-body"><span class="br-top"><b>${p.name}</b> <span class="br-type" style="color:rgb(${t.rgb})">${t.label}</span>${isRec && !state.spentOn ? '<span class="br-rec">추천</span>' : ''}${st !== 'owned' ? `<span class="br-state ${st}">${st === 'unknown' ? '미발견' : st === 'glimpse' ? '글림프스' : '정찰됨'}</span>` : ''}${conf < 100 ? `<span class="br-conf${conf < 50 ? ' low' : ''}">정보 ${conf}%</span>` : ''}</span>` +
        `<span class="br-reason">${p._c.reason}</span></span>` +
        `<span class="br-cmd">${INTENTS[p._c.intent]}</span></button>`;
    }).join('');
    id('briefing').querySelectorAll('.br-item').forEach(b => b.addEventListener('click', () => openCard(byId[b.dataset.prov])));
  }

  function confOf(p) { return Math.round((isSelf(p) ? p.minConfidence : (p._c && p._c.axis !== 'uncertainty' ? p.estForceConfidence : p.minConfidence)) * 100); }

  function renderLegend(read) {
    id('legend').innerHTML = `<span class="lg-title">형세 축</span>` +
      Object.values(AXES).map(t => `<span class="lg"><i class="sw" style="background:rgb(${t.rgb})"></i>${t.label}</span>`).join('') +
      `<span class="lg"><i class="sw" style="background:rgb(${GROWTH_RGB})"></i>발전(판세)</span>` +
      `<span class="lg"><i class="sw ring"></i>게임 추천</span>` +
      `<span class="lg-sep"></span><span class="lg-title">안개</span>` +
      `<span class="lg"><i class="sw murk-sw"></i>미발견</span>` +
      `<span class="lg"><i class="sw meter-sw"><i class="c on"></i><i class="c fade"></i><i class="c off"></i><i class="c off"></i></i>글림프스(추정 범위)</span>` +
      `<span class="lg-note">형세 ${read.length}개는 자세 무관 (진실). 안개=불확실, 정찰이 해소</span>`;
  }

  function renderPosture() { id('posture').querySelectorAll('.pt').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.pt === state.postureId))); }

  /* ---------- hover chip ---------- */
  function showChip(p) {
    const owner = FACTIONS[p.owner], conf = confOf(p), st = stateOf(p), t = p._c ? AXES[p._c.axis] : null;
    const stLabel = { owned: '소유', reliable: '정찰됨(신뢰)', glimpse: '글림프스(추정 범위)', unknown: '미발견(안개)' }[st];
    const force = st === 'unknown' ? '병력 ?' : isSelf(p) ? `최약 수비 ${p.weakestGarrison}` : `추정 병력 ~${p.estForce}`;
    const stat = `<span>${p.terrain}</span><span>경제 ${p.economyValue}</span><span>${force}</span><span class="${conf < 50 ? 'low' : ''}">정보 ${conf}%</span>`;
    chip.innerHTML =
      `<div class="chip-h"><span class="chip-n">${p.name}</span><span class="chip-o" style="color:${owner.color}">${owner.short}</span></div>` +
      `<div class="chip-state s-${st}">${stLabel}</div>` +
      (t ? `<div class="chip-type" style="color:rgb(${t.rgb})">${t.glyph} ${t.label} — ${INTENTS[p._c.intent]}</div><div class="chip-reason">${p._c.reason}</div>`
         : `<div class="chip-type calm">특이 형세 없음${developed(p) ? ' · 발전 지역(판세)' : ''}</div>`) +
      `<div class="chip-stats">${stat}</div>`;
    chip.classList.remove('hidden');
  }
  function moveChip(ev) {
    const r = stage.getBoundingClientRect();
    let x = ev.clientX - r.left + 14, y = ev.clientY - r.top + 14;
    if (x + chip.offsetWidth > stage.clientWidth) x = ev.clientX - r.left - chip.offsetWidth - 14;
    if (y + chip.offsetHeight > stage.clientHeight) y = stage.clientHeight - chip.offsetHeight - 6;
    chip.style.left = Math.max(4, x) + 'px'; chip.style.top = Math.max(4, y) + 'px';
  }
  const hideChip = () => chip.classList.add('hidden');

  /* ---------- command card ---------- */
  function openCard(p) {
    if (!p._c) return;
    state.cardOn = p.id;
    const t = AXES[p._c.axis], owner = FACTIONS[p.owner], conf = confOf(p), st = stateOf(p), cmd = INTENTS[p._c.intent];
    const isScout = p._c.intent === 'scout';
    const rec = recNow().rec, isRec = rec.p.id === p.id;
    const already = state.spentOn === p.id, spentElsewhere = state.spentOn && state.spentOn !== p.id;
    const estLine = st === 'unknown' ? '병력 미상 — 정찰 전' : isSelf(p) ? `경제 ${p.economyValue} · 최약 수비 ${p.weakestGarrison}` : `경제 ${p.economyValue} · 병력 ~${p.estForce}${st === 'glimpse' ? ' (추정 범위)' : ''}`;
    card.innerHTML =
      `<div class="cc-h"><span class="cc-cmd" style="color:rgb(${t.rgb})">${cmd}</span>` +
        `<span class="cc-tg">→ ${p.name} <i style="color:${owner.color}">${owner.short}</i></span>` +
        `<button class="cc-x" id="cc-x" aria-label="닫기">✕</button></div>` +
      `<div class="cc-why"><span class="cc-badge" style="border-color:rgb(${t.rgb});color:rgb(${t.rgb})">${t.glyph} ${t.label}</span><span class="cc-reason">${p._c.reason}</span></div>` +
      `<div class="cc-pick ${isRec ? 'follow' : 'override'}">${isRec ? '게임 추천을 따르는 선택' : '추천과 다른 선택 — 내 판단(실력)'}</div>` +
      `<div class="cc-fields">` +
        `<div class="cc-f"><span>추천 명령 (프리필)</span><b>${cmd}</b></div>` +
        `<div class="cc-f"><span>대상</span><b>${p.name} · ${p.terrain} · ${p.hexes.length} 헥스</b></div>` +
        `<div class="cc-f"><span>${isSelf(p) ? '실제 stat' : '추정'}</span><b>${estLine}</b></div>` +
        `<div class="cc-f"><span>정보 신뢰</span><b class="${conf < 50 ? 'low' : ''}">${conf}%${conf < 100 ? ' · 추정' : ''}</b></div>` +
      `</div>` +
      (isScout
        ? `<div class="cc-scout">정찰하면 신뢰가 <b>${conf}% → ${Math.round(Math.min(MAX_CONFIDENCE, p.minConfidence + SCOUT_GAIN) * 100)}%</b>로 올라 <b>불확실이 해소</b>됩니다 — 미터가 좁혀지고 축이 위협/기회로 확정. 단, 그 <b>1행동</b>을 쓰는 것.</div>`
        : `<div class="cc-open">명령 조정(강도·병력·FOCUS)은 <b>실력 edge — OPEN</b>. 이 목업은 형세 판단→추천까지.</div>`) +
      (spentElsewhere
        ? `<div class="cc-actions"><div class="cc-spent-msg">이번 턴 행동은 <b>${byId[state.spentOn].name}</b>에 소진됨</div></div>`
        : `<div class="cc-actions"><button class="cc-go${isScout ? ' scout' : ''}">${already ? '선택됨 ✓' : isScout ? '정찰 (1회)' : '이 행동으로 확정 (1회)'}</button><button class="cc-cancel" id="cc-cancel">취소</button></div>`);
    positionCard(p);
    id('cc-x').onclick = closeCard;
    const cancel = id('cc-cancel'); if (cancel) cancel.onclick = closeCard;
    const go = card.querySelector('.cc-go');
    if (go) go.onclick = () => { if (isScout) scout(p); else { state.spentOn = p.id; state.spentKind = 'act'; } closeCard(); render(); };
  }
  function positionCard(p) {
    const r = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal;
    let x = (p._cx / vb.width) * r.width + 20, y = (p._cy / vb.height) * r.height - 40;
    card.style.visibility = 'hidden'; card.classList.remove('hidden');
    const cw = card.offsetWidth, ch = card.offsetHeight;
    if (x + cw > stage.clientWidth) x = (p._cx / vb.width) * r.width - cw - 20;
    x = Math.max(4, x); y = Math.max(4, Math.min(y, stage.clientHeight - ch - 6));
    card.style.left = x + 'px'; card.style.top = y + 'px'; card.style.visibility = '';
  }
  function closeCard() { card.classList.add('hidden'); state.cardOn = null; }

  /* ---------- 판세 glance ---------- */
  function renderGlance() {
    const self = POWER.self;
    let rid = null; for (const k in POWER) if (k !== 'self' && (!rid || POWER[k] > POWER[rid])) rid = k;
    const rival = POWER[rid], total = self + rival;
    id('g-self').textContent = self; id('g-rival').textContent = rival; id('g-rival-n').textContent = FACTIONS[rid].short;
    id('g-fill-self').style.width = (self / total * 100).toFixed(1) + '%';
    id('g-fill-rival').style.width = (rival / total * 100).toFixed(1) + '%';
    id('g-lead').textContent = '+' + Math.round((self - rival) / rival * 100) + '% ▲';
    const order = Object.keys(POWER).sort((a, b) => POWER[b] - POWER[a]);
    id('ladder').innerHTML = order.map((f, i) => `<li class="${FACTIONS[f].isSelf ? 'is-self' : ''}"><span class="lr">${i + 1}</span><span class="ld" style="background:${FACTIONS[f].color}"></span>${FACTIONS[f].short}<b>${POWER[f]}</b></li>`).join('');
  }

  /* ---------- veil tuning (continue the v3 dial-in) ---------- */
  function bindVeil() {
    const root = document.documentElement;
    document.querySelectorAll('.veil-ctrl input').forEach(inp => {
      const out = document.getElementById(inp.dataset.out), rerender = inp.dataset.var === '--counter';
      const apply = () => { const v = parseFloat(inp.value); root.style.setProperty(inp.dataset.var, v); if (out) out.textContent = v.toFixed(2); if (rerender) render(); };
      inp.addEventListener('input', apply); apply();
    });
  }

  /* ---------- wire ---------- */
  function bind() {
    const hit = ev => { const i = ev.target.getAttribute('data-prov'); return i ? byId[i] : null; };
    L.terrain.addEventListener('mouseover', ev => { const p = hit(ev); if (p) showChip(p); });
    L.terrain.addEventListener('mousemove', moveChip);
    L.terrain.addEventListener('mouseout', hideChip);
    L.terrain.addEventListener('click', ev => { const p = hit(ev); if (p && p._c) openCard(p); });
    L.mark.addEventListener('click', ev => { const g = ev.target.closest('.badge'); if (g) openCard(byId[g.getAttribute('data-prov')]); });
    id('posture').querySelectorAll('.pt').forEach(b => b.addEventListener('click', () => { state.postureId = b.dataset.pt; closeCard(); render(); }));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCard(); });
    bindVeil();
  }

  render(); renderGlance(); bind();
})();
