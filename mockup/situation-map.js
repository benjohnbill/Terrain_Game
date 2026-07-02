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
  const SCOUT_GAIN = 0.5; // confidence a single scout buys (clamped to MAX_CONFIDENCE)
  const HERO = 'sohyeon';                        // the one province wired for the front-sector drill (hero-only path)
  const THREAT = { lo: 12, hi: 16, conf: 75 };   // 철옹 estimate band shown on the pressure arrow + card (illustrative)
  const CAM_DUR = 520;                           // camera focus / rewind duration (ms)
  const SEAL_HOLD = 2000;                         // how long the duel beat holds before the rewind
  const LEAK_RATIO = 1.5; // a suppressed tension pierces the lens above this × the lens-top magnitude (illustrative)

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
  const state = { postureId: 'balanced', spentOn: null, spentKind: null, reveal: null,
    // front-sector drill v4: overview -> drill(소현) -> commit(sector) -> sealed(duel beat)
    // v5 slice D: overview -> commit-min (sectorless minimal card) for non-hero targets
    mode: 'overview', sectorOn: null, minTarget: null, plan: 'defend', commit: 70, sealed: false, sealedPlan: null, enemySealed: false };
  function reading() {
    return PROVINCES.filter(p => p._c).map(p => ({ p, axis: p._c.axis, mag: p._c.mag })).sort((a, b) => b.mag - a.mag).slice(0, CAP);
  }

  /* ---------- lens (v5): emphasis + annotations + leak-through ---------- */
  const lensAxis = () => POSTURES[state.postureId].prefer;   // null on 균형
  function leakSet(read) {
    const lens = lensAxis(); if (!lens) return new Set();
    const inLens = read.filter(s => s.axis === lens);
    const top = inLens.length ? inLens[0].mag : 0;           // read is mag-sorted
    return new Set(read.filter(s => s.axis !== lens && s.mag > top * LEAK_RATIO).map(s => s.p.id));
  }
  // small on-map annotation label under a province (comparison state lives ON the map)
  function drawNote(p, text, cls) {
    const w = text.length * 6.4 + 14, h = 16, x = p._cx - w / 2, y = p._cy + 44;
    const g = el('g', { class: 'lens-note ' + cls });
    g.appendChild(el('rect', { x: x.toFixed(1), y: y.toFixed(1), width: w.toFixed(1), height: h, rx: 8 }));
    g.appendChild(txt(p._cx, y + 12, text, 'lens-note-t', 10));
    L.mark.appendChild(g);
  }
  function drawLensNotes() {
    const lens = lensAxis(); if (!lens) return;
    if (lens === 'threat') PROVINCES.forEach(p => {          // 방어: where can I be breached
      if (isSelf(p) && p._adj.some(a => isFoe(byId[a]))) drawNote(p, '수비 ' + p.weakestGarrison, 'def');
    });
    if (lens === 'opportunity') PROVINCES.forEach(p => {     // 공세: what can I take
      if (isFoe(p) && p._adj.some(a => isSelf(byId[a]))) {
        const our = ourAdjForce(p), est = stateOf(p) === 'unknown' ? '?' : '~' + p.estForce;
        drawNote(p, `아군 ${our} vs ${est}`, our >= (p.estForce || 99) ? 'adv' : 'even');
      }
    });
    if (lens === 'uncertainty') PROVINCES.forEach(p => {     // 정찰 중시: what can't I see
      if (isFoe(p)) drawNote(p, '정보 ' + confOf(p) + '%', confOf(p) < 50 ? 'low' : 'ok');
    });
  }

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
  const L = { terrain: id('l-terrain'), murk: id('l-murk'), glow: id('l-glow'), perim: id('l-perim'), arrow: id('l-arrow'), counter: id('l-counter'), sector: id('l-sector'), label: id('l-label'), mark: id('l-mark'), fx: id('l-fx') };
  const stage = id('map-stage'), chip = id('chip');
  const secById = sid => byId[HERO].sectors.find(s => s.id === sid);
  const secDef = s => s.garrison + s.terrain + s.fort;
  function id(x) { return document.getElementById(x); }
  const cntScale = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--counter')) || 1;
  // the work surface is a real toggle target for AT — .open and aria-hidden must never disagree
  function setSurfaceOpen(open) { const el = id('work-surface'); el.classList.toggle('open', open); el.setAttribute('aria-hidden', String(!open)); }

  let VB_FULL, VB_DRILL, VB_COMMIT;
  (function viewBox() {
    let mx = 0, my = 0;
    PROVINCES.forEach(p => p.hexes.forEach(([c, r]) => { const q = center(c, r); mx = Math.max(mx, q.x + S); my = Math.max(my, q.y + HH / 2); }));
    VB_FULL = [0, 0, Math.round(mx + M), Math.round(my + M + 8)];
    svg.setAttribute('viewBox', VB_FULL.join(' '));
    // drill frame: 소현's hull, widened east toward 철옹 so the pressure-arrow origin reads
    const hero = byId[HERO], xs = [], ys = [];
    hero.hexes.forEach(([c, r]) => { const q = center(c, r); xs.push(q.x); ys.push(q.y); });
    const cheol = byId['cheolong'];
    const x0 = Math.min(...xs) - S * 1.5, x1 = Math.max(cheol._cx + S * 0.6, Math.max(...xs) + S * 1.3);
    const y0 = Math.min(...ys) - S * 2.0, y1 = Math.max(...ys) + S * 2.0;
    VB_DRILL = [x0, y0, x1 - x0, y1 - y0].map(v => Math.round(v));
    // commit frame: widen so the evidence (sector + arrow + 철옹) sits fully clear
    // of #work-surface once it opens. Measure the panel's ACTUAL CSS-resolved geometry
    // (`width: min(46%,500px)`, `right:10px`) against the live stage — elements already
    // exist at this point (this IIFE runs after DOM parse) — instead of assuming a
    // worst-case percentage, so the frame is provably correct for the viewport this
    // page is actually running at, not eyeballed. getComputedStyle().width reflects the
    // panel's true box width regardless of its (transform-only) open/closed state.
    const wsW = parseFloat(getComputedStyle(id('work-surface')).width) || 0;
    const stageW = stage.getBoundingClientRect().width || 1;
    // fraction of the stage NOT covered by the panel. No floor here: the CSS ceiling
    // (`width: min(46%,500px)`) keeps this comfortably positive (>=~0.3) for any stage
    // width down to ~42px, far below anything this mockup renders at in practice.
    const unoccluded = 1 - (wsW + 10) / stageW;
    const CHEOL_CLEARANCE = 60; // px past cheol._cx before the panel may start (clears the 48-wide counter + a hex-scale buffer)
    const xOffset = VB_DRILL[2] * 0.08;
    const cx0 = VB_DRILL[0] - xOffset;
    const neededWidth = (cheol._cx + CHEOL_CLEARANCE - cx0) / unoccluded;
    const k = Math.max(1.7, neededWidth / VB_DRILL[2]);   // also the guard against a degenerate (near-zero/negative) `unoccluded`, which cannot occur at a realistic stage width
    VB_COMMIT = [
      Math.round(cx0),
      Math.round(VB_DRILL[1] - (VB_DRILL[3] * (k - 1)) / 2),
      Math.round(VB_DRILL[2] * k),
      Math.round(VB_DRILL[3] * k),
    ];
  })();

  /* ---------- camera (viewBox tween — the focus / rewind choreography) ---------- */
  let camRAF = null;
  const easeInOut = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const setVB = vb => svg.setAttribute('viewBox', vb.join(' '));
  function animateVB(to, done) {
    if (camRAF) cancelAnimationFrame(camRAF);
    if (REDUCED) { setVB(to); if (done) done(); return; }
    const from = svg.getAttribute('viewBox').split(' ').map(Number), t0 = performance.now();
    (function step(now) {
      const k = Math.min(1, (now - t0) / CAM_DUR), e = easeInOut(k);
      setVB(from.map((v, i) => v + (to[i] - v) * e));
      if (k < 1) camRAF = requestAnimationFrame(step); else { camRAF = null; if (done) done(); }
    })(performance.now());
  }

  /* ---------- render (mode-aware: overview shows the full board; drill/commit
   * focus 소현 and replace its counter with spatial front sectors) ---------- */
  function render() {
    const heroFocus = state.mode === 'drill' || state.mode === 'commit';
    const read = reading();
    const shownIds = new Set(read.map(s => s.p.id));
    const scale = cntScale();
    Object.values(L).forEach(g => (g.innerHTML = ''));

    PROVINCES.forEach(p => {
      const st = stateOf(p), owner = FACTIONS[p.owner], orgb = hexToRgb(owner.color);
      const isHero = p.id === HERO;
      const dim = (heroFocus ? !isHero
        : state.mode === 'commit-min' ? p.id !== state.minTarget
        : (state.spentOn && state.spentOn !== p.id)) ? ' dimmed' : '';

      // terrain hexes (position fog: terrain is always visible)
      p.hexes.forEach(([c, r]) => { const q = center(c, r);
        L.terrain.appendChild(el('polygon', { points: cornerStr(q.x, q.y), fill: TERRAIN_TINT[p.terrain] || '#5f6440', class: 'terrain st-' + st + dim, 'data-prov': p.id })); });

      // murk wash over undiscovered occupants
      if (st === 'unknown') p.hexes.forEach(([c, r]) => { const q = center(c, r);
        L.murk.appendChild(el('polygon', { points: cornerStr(q.x, q.y), class: 'murk' })); });

      // 판세 development glow (owned + high economy)
      if (developed(p) && !dim) glow(p, GROWTH_RGB, 0.14, S * 1.2);
      // located-axis glow (suppressed on the hero while drilled — sectors carry the signal)
      if (!(heroFocus && isHero) && p._c && shownIds.has(p.id)) {
        const lens0 = lensAxis();
        const a = dim ? 0.06 : lens0 ? (p._c.axis === lens0 ? 0.22 : 0.07) : 0.16;
        glow(p, AXES[p._c.axis].rgb, a, S * 1.28);
      }

      // province perimeter in owner colour
      p.hexes.forEach(([c, r]) => { const q = center(c, r), cn = corners(q.x, q.y);
        for (let e = 0; e < 6; e++) { const nb = neighbor(c, r, e);
          if (hexIndex[nb[0] + ',' + nb[1]] !== p.id) { const a = cn[e], b = cn[(e + 1) % 6];
            L.perim.appendChild(el('line', { x1: a[0].toFixed(1), y1: a[1].toFixed(1), x2: b[0].toFixed(1), y2: b[1].toFixed(1), stroke: rgba(orgb, dim ? 0.28 : (isSelf(p) ? 0.9 : 0.6)), 'stroke-width': isSelf(p) ? 2.4 : 1.8, 'stroke-linecap': 'round' })); } } });

      if (heroFocus && isHero) {
        drawSectors(p, scale);                 // front sectors REPLACE the province counter/badge (mission label carries the 소현 name)
      } else {
        drawCounter(p, st, scale, dim);
        if (st === 'glimpse' || st === 'unknown') drawRecon(p, st, dim);
        L.label.appendChild(txt(p._cx, p._cy - 22 * scale, p.name, 'p-name' + (dim ? ' dim' : ''), 13));
      }
    });

    if (heroFocus) {
      drawPressureArrow();                     // 철옹 → 남부, carrying the estimate band
      if (state.sealed) drawSeals();           // the duel beat: both orders sealed at once
    } else {
      read.filter(s => s.axis === 'threat' && s.p._c.driver).forEach(s => L.arrow.appendChild(arrow(byId[s.p._c.driver]._cx, byId[s.p._c.driver]._cy, s.p._cx, s.p._cy)));
      const leaks = leakSet(read), lens = lensAxis();
      read.forEach(s => {
        const suppressed = lens && s.axis !== lens && !leaks.has(s.p.id);
        drawBadge(s.p, s.axis, state.spentOn === s.p.id, cntScale(), suppressed);
        if (leaks.has(s.p.id)) drawLeakPulse(s.p);
      });
      drawLensNotes();
      if (state.enemySealed) drawEnemySeal();  // face-down marker persists after a sealed turn
    }

    if (state.mode === 'commit') { if (state.sealed) renderSealNotice(); else renderWorkSurface(secById(state.sectorOn)); }
    else if (state.mode === 'commit-min') renderMinimalCard(byId[state.minTarget]);
    setSurfaceOpen(state.mode === 'commit' || state.mode === 'commit-min');
    renderMissionPill(read);
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

  function arrow(x1, y1, x2, y2, sw, hd) {
    sw = sw || 3; hd = hd || 12;                 // stroke width + head length (smaller for the zoomed drill)
    const g = el('g', { class: 'threat-arrow' });
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len;
    const sx = x1 + ux * S * 0.9, sy = y1 + uy * S * 0.9, ex = x2 - ux * S * 1.0, ey = y2 - uy * S * 1.0;
    g.appendChild(el('line', { x1: sx.toFixed(1), y1: sy.toFixed(1), x2: ex.toFixed(1), y2: ey.toFixed(1), stroke: rgba(AXES.threat.rgb, 0.8), 'stroke-width': sw, 'stroke-linecap': 'round', 'stroke-dasharray': (sw < 3 ? '1.5 4' : '2 6'), class: REDUCED ? '' : 'flow' }));
    const a1 = Math.atan2(ey - sy, ex - sx);
    [-0.5, 0.5].forEach(off => { const hx = ex - hd * Math.cos(a1 - off), hy = ey - hd * Math.sin(a1 - off); g.appendChild(el('line', { x1: ex.toFixed(1), y1: ey.toFixed(1), x2: hx.toFixed(1), y2: hy.toFixed(1), stroke: rgba(AXES.threat.rgb, 0.9), 'stroke-width': sw, 'stroke-linecap': 'round' })); });
    return g;
  }

  function drawBadge(p, axis, isSpent, scale, dimmed) {
    const t = AXES[axis], label = t.glyph + ' ' + t.label;
    const w = label.length * 11 + 24, h = 22, x = p._cx - w / 2, y = p._cy + 20 * scale;
    const g = el('g', { class: 'badge', 'data-prov': p.id, opacity: state.spentOn && !isSpent ? 0.32 : dimmed ? 0.4 : 1 });
    g.appendChild(el('rect', { x: x.toFixed(1), y: y.toFixed(1), width: w, height: h, rx: 11, fill: isSpent ? rgba(t.rgb, 0.92) : 'rgba(18,22,12,0.9)', stroke: rgba(t.rgb, 0.9), 'stroke-width': 1.5 }));
    const label_t = txt(p._cx, y + h / 2 + 4, label, 'badge-t', 12); label_t.setAttribute('fill', isSpent ? '#12160c' : rgba(t.rgb, 1));
    g.appendChild(label_t);
    L.mark.appendChild(g);
  }

  function drawLeakPulse(p) {  // urgency pierces the active lens (dissonance successor)
    const g = el('g', { class: 'leak' });
    g.appendChild(el('circle', { cx: p._cx.toFixed(1), cy: p._cy.toFixed(1), r: (S * 1.35).toFixed(1), fill: 'none', class: 'leak-ring' + (REDUCED ? ' still' : '') }));
    L.fx.appendChild(g);
  }

  /* ---------- front-sector drill: spatial sectors drawn inside 소현 ---------- */
  const secCenter = s => center(s.hex[0], s.hex[1]);
  // NB: drill zooms the viewBox ~3x, so SVG text is sized in SMALL user units
  // (≈ half the overview sizes) to land at a readable on-screen size.
  function drawSectors(p, scale) {
    p.sectors.forEach(s => {
      const q = secCenter(s), def = secDef(s), sel = state.sectorOn === s.id;
      const g = el('g', { class: 'sector' + (s.faces ? ' faces' : '') + (sel ? ' sel' : ''), 'data-sec': s.id });
      // clickable bordered area over the hex
      g.appendChild(el('polygon', { points: cornerStr(q.x, q.y), class: 'sec-hit', 'data-sec': s.id }));
      g.appendChild(el('polygon', { points: cornerStr(q.x, q.y), class: 'sec-border' + (s.faces ? ' faces' : '') + (sel ? ' sel' : ''), 'data-sec': s.id }));
      // route tag (top), name (+ ★ reachable weakest link)
      if (s.route) g.appendChild(txt(q.x, q.y - 24, s.route + ' 통로 ▸', 'sec-route', 5.2));
      g.appendChild(txt(q.x, q.y - 14, (s.star ? '★ ' : '') + s.name, 'sec-name' + (s.star ? ' star' : ''), 7.5));
      // ONE collapsed defense meter (4 cells scaled by def) — the card unpacks the layers
      const mw = 34, mx0 = q.x - mw / 2, myy = q.y - 4, cw = (mw - 5) / 4, lit = clamp(Math.round(def / 3), 1, 4);
      const mg = el('g', { class: 'sec-meter', 'data-sec': s.id });
      mg.appendChild(el('rect', { x: mx0.toFixed(1), y: myy.toFixed(1), width: mw, height: 6, rx: 1.5, class: 'sec-meter-bg' }));
      for (let i = 0; i < 4; i++) mg.appendChild(el('rect', { x: (mx0 + 1.5 + i * (cw + 1)).toFixed(1), y: (myy + 1.5).toFixed(1), width: cw.toFixed(1), height: 3, rx: .5, class: 'sec-cell ' + (i < lit ? 'lit' : 'off') }));
      g.appendChild(mg);
      g.appendChild(txt(q.x, q.y + 9, '수비 ' + def, 'sec-def', 5.6));
      // ONE value chip — the stake that creates the weighing
      const vw = s.value >= 10 ? 24 : 20, vy = q.y + 15;
      const vg = el('g', { class: 'sec-val' + (s.value >= 5 ? ' high' : '') });
      vg.appendChild(el('rect', { x: (q.x - vw / 2).toFixed(1), y: vy.toFixed(1), width: vw, height: 10, rx: 5, class: 'sec-val-bg' }));
      vg.appendChild(txt(q.x, vy + 7.2, '가치 ' + s.value, 'sec-val-t', 5.4));
      g.appendChild(vg);
      L.sector.appendChild(g);
    });
  }

  // 철옹 → 남부 pressure arrow, carrying the estimate band (the evidence that travels)
  function drawPressureArrow() {
    const hero = byId[HERO], sec = hero.sectors.find(s => s.faces), cheol = byId[sec.faces];
    if (!sec || !cheol) return;
    const q = secCenter(sec);
    L.arrow.appendChild(arrow(cheol._cx, cheol._cy, q.x, q.y, 1.8, 7));
    // band label glued to the arrow midpoint (SVG user units — small, drill is zoomed)
    const mx = (cheol._cx + q.x) / 2 + 8, my = (cheol._cy + q.y) / 2 - 6;
    const g = el('g', { class: 'band-grp' });
    const label = `${THREAT.lo}–${THREAT.hi} · ${THREAT.conf}%`, w = label.length * 3.7 + 8;
    g.appendChild(el('rect', { x: (mx - w / 2).toFixed(1), y: (my - 6).toFixed(1), width: w.toFixed(1), height: 11, rx: 5.5, class: 'band-box' }));
    g.appendChild(txt(mx, my + 1.8, label, 'band-txt', 6));
    L.arrow.appendChild(g);
  }

  // duel beat: player's order + enemy's face-down order sealed in the SAME tick
  function drawSeals() {
    const hero = byId[HERO], sec = hero.sectors.find(s => s.faces), cheol = byId[sec.faces];
    const q = secCenter(sec);
    // simultaneity flash: a one-shot arc linking the two seals
    L.fx.appendChild(el('line', { x1: q.x.toFixed(1), y1: q.y.toFixed(1), x2: cheol._cx.toFixed(1), y2: cheol._cy.toFixed(1), class: 'seal-flash' + (REDUCED ? ' still' : '') }));
    L.fx.appendChild(sealMark(q.x, q.y, 'player', '봉인'));       // my order
    L.fx.appendChild(sealMark(cheol._cx, cheol._cy, 'enemy', '?')); // enemy: face-down
  }
  function drawEnemySeal() {                                        // persistent overview marker
    const cheol = byId['cheolong'];
    L.mark.appendChild(sealMark(cheol._cx, cheol._cy - 30, 'enemy still', '?'));
  }
  function sealMark(x, y, kind, glyph) {
    const g = el('g', { class: 'seal ' + kind });
    g.appendChild(el('rect', { x: (x - 11).toFixed(1), y: (y - 9).toFixed(1), width: 22, height: 18, rx: 3.5, class: 'seal-box' }));
    g.appendChild(el('circle', { cx: (x + 7).toFixed(1), cy: (y - 5).toFixed(1), r: 3, class: 'seal-wax' }));
    g.appendChild(txt(x - 1.5, y + 4, glyph, 'seal-glyph', kind.indexOf('enemy') === 0 ? 10 : 8));
    return g;
  }

  // one floating, morphing label per state — answers "what am I here to do?"
  function missionLabel() {
    if (state.mode === 'drill') return '구역 선택 — 소현';
    if (state.mode === 'commit') return state.sealed ? '명령 봉인' : '커밋 결정 — ' + secById(state.sectorOn).name;
    if (state.mode === 'commit-min') return '계획 확정 — ' + byId[state.minTarget].name;
    return '긴장 선택';
  }
  function renderMissionPill(read) {
    const ap = id('mission-pill');
    const mEl = ap.querySelector('.ap-mission'), bEl = ap.querySelector('.ap-body'), mission = missionLabel();
    if (mEl.dataset.txt !== mission) {
      if (REDUCED) { mEl.textContent = mission; mEl.dataset.txt = mission; }
      else { mEl.classList.add('morph'); setTimeout(() => { mEl.textContent = mission; mEl.dataset.txt = mission; mEl.classList.remove('morph'); }, 150); }
    }
    bEl.innerHTML = pillBody(read);
    const back = bEl.querySelector('.ap-back'); if (back) back.onclick = backNav;
    const reset = bEl.querySelector('#ap-reset'); if (reset) reset.onclick = () => { resetTurn(); state.enemySealed = false; state.sealedPlan = null; render(); };
  }
  function pillBody(read) {
    if (state.mode === 'commit-min') return '<span class="ap-note">이 지방에 이번 턴 행동을 쓸지 결정</span>';
    if (state.mode === 'drill')
      return '<span class="ap-note">위협이 드는 곳과 뒤에 잃을 것을 <b>저울질</b> — 구역 하나에 이번 턴 행동</span><button class="ap-back">← 형세로</button>';
    if (state.mode === 'commit')
      return state.sealed
        ? '<span class="ap-note">양쪽 명령이 <b>동시에</b> 굳었다 — 해소는 다음 턴</span>'
        : '<button class="ap-back">← 구역 선택</button>';
    if (state.spentOn && state.spentKind === 'scout' && state.reveal) {
      const rv = state.reveal;
      return `<div class="ap-line"><span class="ap-k">이번 턴 행동</span><span class="ap-spent scout">정찰 완료</span><button class="ap-reset" id="ap-reset">되돌리기</button></div>` +
        `<div class="ap-reveal ${rv.kind}"><span class="ap-reveal-h">${rv.kind === 'threat' ? '안개가 위협을 숨기고 있었다' : rv.kind === 'opportunity' ? '안개가 기회를 숨기고 있었다' : '안개 너머는 조용했다'}</span><span class="ap-reveal-b">${rv.text}</span></div>`;
    }
    if (state.spentOn) {
      const p = byId[state.spentOn];
      const label = state.enemySealed ? `소진 — ${p.name} ${state.sealedPlan || ''} · 적도 봉인` : `소진 — ${p.name} ${INTENTS[p._c.intent]}`;
      return `<div class="ap-line"><span class="ap-k">이번 턴 행동</span><span class="ap-spent">${label}</span><button class="ap-reset" id="ap-reset">되돌리기</button></div>`;
    }
    return `<div class="ap-line"><span class="ap-k">행동 1회</span><span class="ap-note">형세 ${read.length}개 중 하나를 지목 — 렌즈를 돌려 보며 판단은 네 몫</span></div>`;
  }

  /* ---------- drill flow: overview -> drill -> commit -> sealed -> overview ---------- */
  let sealTimer = null;
  function enterDrill() { state.mode = 'drill'; state.sectorOn = null; state.sealed = false; render(); animateVB(VB_DRILL); }
  function exitDrill() { state.mode = 'overview'; state.sectorOn = null; state.sealed = false; render(); setSurfaceOpen(false); animateVB(VB_FULL); }
  function backNav() {
    if (state.mode === 'commit-min') { state.mode = 'overview'; state.minTarget = null; setSurfaceOpen(false); render(); return; }
    if (state.mode === 'commit') { state.mode = 'drill'; state.sectorOn = null; state.sealed = false; render(); setSurfaceOpen(false); animateVB(VB_DRILL); } else if (state.mode === 'drill') exitDrill();
  }

  function selectSector(sec) {
    if (!sec) return;
    // capture the map-side evidence rects BEFORE the swap (drill sectors still on screen)
    const secG = L.sector.querySelector(`.sector[data-sec="${sec.id}"]`);
    const meterSrc = secG ? secG.querySelector('.sec-meter').getBoundingClientRect() : null;
    const bandEl = sec.faces ? L.sector.parentNode.querySelector('.band-txt') : null;
    const bandSrc = bandEl ? bandEl.getBoundingClientRect() : null;
    state.mode = 'commit'; state.sectorOn = sec.id; state.sealed = false; state.plan = 'defend'; state.commit = 70;
    render();                                   // draws focused sector + work surface (band pending)
    setSurfaceOpen(true);
    animateVB(VB_COMMIT);                        // widen the camera so evidence stays visible beside the surface
    const rc = id('work-surface');
    rc.classList.toggle('pending-band', !!bandSrc);
    requestAnimationFrame(() => {
      if (bandSrc) { const d = rc.querySelector('.axis .band'); if (d) flyEl(bandSrc, d.getBoundingClientRect(), `${THREAT.lo}–${THREAT.hi}`, 'band', () => rc.classList.remove('pending-band')); }
      if (meterSrc) { const m = rc.querySelector('.cc2-base'); if (m) flyEl(meterSrc, m.getBoundingClientRect(), '', 'meter'); }
    });
  }

  // convert an SVG user-space point to a fixed-position screen rect (for flyEl targets on the map)
  const svgToScreen = (x, y) => { const r = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal;
    return { left: r.left + (x - vb.x) / vb.width * r.width - 14, top: r.top + (y - vb.y) / vb.height * r.height - 10, width: 28, height: 20 }; };

  // evidence continuity: fly a clone from a map element to its card counterpart
  function flyEl(from, to, label, kind, done) {
    if (REDUCED) { if (done) done(); return; }
    const f = document.createElement('div');
    f.className = 'fly ' + kind; f.textContent = label;
    f.style.left = from.left + 'px'; f.style.top = from.top + 'px'; f.style.width = from.width + 'px'; f.style.height = from.height + 'px';
    document.body.appendChild(f);
    requestAnimationFrame(() => {
      const sx = to.width / from.width, sy = to.height / from.height;
      f.style.transform = `translate(${(to.left - from.left).toFixed(1)}px, ${(to.top - from.top).toFixed(1)}px) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`;
      f.style.opacity = '0.1';
    });
    setTimeout(() => { f.remove(); if (done) done(); }, 480);
  }

  function sealOrder(sec, plan) {
    state.sealedPlan = plan === 'scout' ? '정찰' : '방어 강화';
    const go = id('work-surface').querySelector('.cc2-go');
    const q = secCenter(sec);
    const drop = () => { state.sealed = true; render(); clearTimeout(sealTimer);
      if (!REDUCED) sealTimer = setTimeout(rewindToOverview, SEAL_HOLD); };
    if (go && !REDUCED) flyEl(go.getBoundingClientRect(), svgToScreen(q.x, q.y), '봉인', 'seal', drop);
    else drop();
  }
  function rewindToOverview() {
    clearTimeout(sealTimer);
    state.spentOn = HERO; state.spentKind = 'act'; state.enemySealed = true;
    state.mode = 'overview'; state.sealed = false; state.sectorOn = null;
    render(); setSurfaceOpen(false); animateVB(VB_FULL);
  }

  /* ---------- compact command card in the rail (transplant of command-card-hybrid) ---------- */
  const CCONV = 0.1, CAXMIN = 6, CAXMAX = 20;
  const cpct = v => clamp((v - CAXMIN) / (CAXMAX - CAXMIN) * 100, 0, 100);
  const cdef = (base, cc) => base + cc * CCONV;
  function clossVs(d, band) {
    if (d >= band.hi) return Math.max(3, Math.round(6 - (d - band.hi)));
    if (d <= band.lo) return Math.min(96, Math.round(58 + (band.lo - d) * 11));
    return Math.round(12 + (band.hi - d) / (band.hi - band.lo) * 44);
  }
  const choldOf = (d, band) => 100 - clossVs(d, band);
  const czone = h => h >= 85 ? 'hold' : h >= 50 ? 'risk' : 'lose';
  const CZL = { hold: '사수 유력', risk: '접전', lose: '함락 위험' };

  function renderWorkSurface(sec) {
    const rc = id('work-surface'), faced = !!sec.faces, def = secDef(sec), cheol = faced ? byId[sec.faces] : null;
    rc.innerHTML =
      `<div class="cc2-tag"><span class="v">전선 명령</span><span class="vn">소현 · ${sec.name} · ${faced ? `위협 (${FACTIONS[cheol.owner].short} ${cheol.name})` : '후방 · 직접 위협 없음'}</span></div>` +
      `<div class="cc2-cbody">` +
        (faced ? `<div class="cc2-plans"><button class="cc2-plan${state.plan === 'defend' ? ' sel' : ''}" data-plan="defend"><span class="pt">방어 강화 <span class="rec">추천</span></span><span class="pd">지금 커밋해 사수</span></button><button class="cc2-plan scout${state.plan === 'scout' ? ' sel' : ''}" data-plan="scout"><span class="pt">정찰</span><span class="pd">정보를 산다 · 무방비</span></button></div>` : '') +
        `<div class="cc2-fields"><span class="pf">수비 base <b class="cc2-base">${def}</b></span><span class="pf">주둔 <b>${sec.garrison}</b></span><span class="pf">지형 <b>+${sec.terrain}</b></span><span class="pf">축성 <b>+${sec.fort}</b></span><span class="pf">가치 <b>${sec.value}</b></span></div>` +
        (faced
          ? `<div class="cc2-enrow"><span>적 추정 <b>${FACTIONS[cheol.owner].short} ${cheol.name} ${THREAT.lo}–${THREAT.hi}</b></span><span class="cf">신뢰 ${THREAT.conf}% · 밴드 폭=불확실</span></div><div class="axis" id="cc2-axis"></div><div id="cc2-defend"></div><div id="cc2-scout" class="hidden"></div>`
          : `<div class="cc2-rear">이 구역은 이번 턴 <b>철옹의 도달 범위 밖</b> — 직접 위협 없음. 수비는 <b>${def}</b>뿐, 가치는 <b>${sec.value}</b>. 위협이 드는 <b>남부 전선</b>이 이번 턴 급선무.</div>`) +
        `<div class="cc2-foot" id="cc2-foot"></div>` +
      `</div>`;
    if (!REDUCED) rc.querySelectorAll('.cc2-cbody > *').forEach((n, i) => { n.classList.add('ws-anim'); n.style.animationDelay = (80 * i) + 'ms'; });
    if (faced) { wireCardPlans(sec); renderCardView(sec); }
    else { id('cc2-foot').innerHTML = '<button class="cc2-back">← 구역 선택</button>'; }
    const bk = rc.querySelector('.cc2-back'); if (bk) bk.onclick = backNav;
  }
  function wireCardPlans(sec) {
    id('work-surface').querySelectorAll('.cc2-plan').forEach(b => b.onclick = () => {
      state.plan = b.dataset.plan;
      id('work-surface').querySelectorAll('.cc2-plan').forEach(x => x.classList.toggle('sel', x.dataset.plan === state.plan));
      renderCardView(sec);
    });
  }
  function drawCardAxis(sec) {
    const ax = id('cc2-axis'); if (!ax) return;
    const band = { lo: THREAT.lo, hi: THREAT.hi }, base = secDef(sec), scouting = state.plan === 'scout';
    const d = scouting ? base : cdef(base, state.commit);
    let h = `<div class="track"><div class="z-lose" style="flex-basis:${cpct(band.lo)}%"></div><div class="z-risk" style="flex-basis:${cpct(band.hi) - cpct(band.lo)}%"></div><div class="z-hold" style="flex-basis:${100 - cpct(band.hi)}%"></div></div>`;
    h += `<div class="band" style="left:${cpct(band.lo)}%;width:${cpct(band.hi) - cpct(band.lo)}%"></div>`;
    h += `<div class="band-l" style="left:${cpct((band.lo + band.hi) / 2)}%">적 ${band.lo}–${band.hi}</div>`;
    if (scouting) {
      h += `<div class="band-l scout" style="left:${cpct((band.lo + band.hi) / 2)}%">정찰 시 폭↓ (좁혀질 위치 미지)</div>`;
      h += `<div class="mk bare" style="left:${cpct(d)}%"></div><div class="mk-l bare" style="left:${cpct(d)}%">무방비 ${d}</div>`;
    } else {
      h += `<div class="rec-tick" style="left:${cpct(band.hi)}%"></div><div class="rec-l" style="left:${cpct(band.hi)}%">추천</div>`;
      h += `<div class="mk" style="left:${cpct(d)}%"></div><div class="mk-l" style="left:${cpct(d)}%">방어 ${d.toFixed(0)}</div>`;
    }
    ax.innerHTML = h;
  }
  function renderCardView(sec) {
    const defend = id('cc2-defend'), scoutv = id('cc2-scout'), foot = id('cc2-foot'), scouting = state.plan === 'scout';
    defend.classList.toggle('hidden', scouting); scoutv.classList.toggle('hidden', !scouting);
    drawCardAxis(sec);
    if (scouting) {
      scoutv.innerHTML = '<div class="gambit"><div class="row"><span class="ic win">적 안 침 →</span><span><b>막대한 이득.</b> 다음 턴 밴드가 좁아짐(75→88%). 어디로 좁혀질진 정찰해 봐야 앎.</span></div><div class="row"><span class="ic lose">적 침 →</span><span><b>구역 상실.</b> 이번 턴 남부는 무방비.</span></div></div>';
      foot.innerHTML = '<button class="cc2-go scout">정찰 봉인 — 방어 포기</button><button class="cc2-back">← 구역</button>';
    } else {
      const rec = recCommitFor(sec);
      defend.innerHTML = `<div class="verdict" id="cc2-verdict"><span class="big" id="cc2-hold"></span><span class="sub" id="cc2-zone"></span></div>` +
        `<div class="microbar" id="cc2-bar"></div>` +
        `<div class="commit-row"><span>커밋 <b id="cc2-cv"></b> / 100</span><span class="rec">안전 사수 눈금 ${rec}</span></div>` +
        `<div class="commit-slider"><input type="range" id="cc2-commit" min="0" max="100" value="${state.commit}"><span class="commit-notch" style="left:${rec}%" title="안전 사수 추천"></span></div>` +
        `<div class="srow"><span class="k">확보 여력(surplus)</span><span class="v" id="cc2-sp"></span></div>`;
      id('cc2-commit').oninput = e => { state.commit = +e.target.value; updateCommitReadout(sec); };  // input survives — only readouts update
      updateCommitReadout(sec);
    }
    wireFoot(sec);
  }
  const recCommitFor = sec => Math.round((THREAT.hi - secDef(sec)) / CCONV);   // commit that reaches the band top
  function updateCommitReadout(sec) {      // everything EXCEPT the <input> — drag-safe by construction
    const band = { lo: THREAT.lo, hi: THREAT.hi }, d = cdef(secDef(sec), state.commit);
    const hold = choldOf(d, band), zone = czone(hold), under = d < band.hi;
    id('cc2-hold').textContent = '사수 ' + hold + '%';
    id('cc2-zone').textContent = '· ' + CZL[zone];
    id('cc2-verdict').className = 'verdict ' + zone;
    id('cc2-bar').innerHTML = `<span class="mb-hold" style="flex-basis:${hold}%"></span><span class="mb-lose" style="flex-basis:${100 - hold}%"></span>`;
    id('cc2-cv').textContent = state.commit;
    id('cc2-sp').textContent = '+' + (100 - state.commit);
    drawCardAxis(sec);                     // axis rebuild is fine — it holds no input
    const go = id('cc2-foot').querySelector('.cc2-go');
    if (go) { go.classList.toggle('warn', under); go.textContent = under ? '저커밋 봉인 — 실패 시 상실' : '이 계획으로 봉인 (1회)'; }
  }
  function wireFoot(sec) {
    const foot = id('cc2-foot');
    if (state.plan !== 'scout' && !foot.querySelector('.cc2-go'))
      foot.innerHTML = '<button class="cc2-go"></button><button class="cc2-back">← 구역</button>';
    const go = foot.querySelector('.cc2-go'); if (go) go.onclick = () => sealOrder(sec, state.plan);
    const bk = foot.querySelector('.cc2-back'); if (bk) bk.onclick = backNav;
    if (state.plan !== 'scout') updateCommitReadout(sec);
  }
  function renderSealNotice() {
    const sec = secById(state.sectorOn), rc = id('work-surface');
    rc.classList.remove('pending-band');
    rc.innerHTML =
      `<div class="cc2-tag"><span class="v seal">봉인</span><span class="vn">소현 · ${sec.name}</span></div>` +
      `<div class="seal-note"><div class="seal-h">명령 봉인 — ${state.sealedPlan}</div>` +
      `<div class="seal-b">적도 이번 턴 계획을 굳혔다. 내용은 <b>안개 속</b>.</div>` +
      `<div class="seal-both">양쪽이 <b>동시에</b> 이번 턴을 확정 — 무엇을 굳혔는지는 알 수 없다</div>` +
      `<div class="seal-slice">해소는 다음 슬라이스</div>` +
      `<button class="cc2-cont">계속 — 형세로 ▸</button></div>`;
    const c = rc.querySelector('.cc2-cont'); if (c) c.onclick = rewindToOverview;
  }

  function confOf(p) { return Math.round((isSelf(p) ? p.minConfidence : (p._c && p._c.axis !== 'uncertainty' ? p.estForceConfidence : p.minConfidence)) * 100); }

  function renderLegendStatic() {
    id('legend').innerHTML = Object.values(AXES).map(t => `<span class="lg"><i class="sw" style="background:rgb(${t.rgb})"></i>${t.label}</span>`).join('') +
      `<span class="lg"><i class="sw" style="background:rgb(${GROWTH_RGB})"></i>발전(판세)</span>` +
      `<span class="lg"><i class="sw murk-sw"></i>미발견</span>` +
      `<span class="lg"><i class="sw meter-sw"><i class="c on"></i><i class="c fade"></i><i class="c off"></i><i class="c off"></i></i>글림프스(추정 범위)</span>`;
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

  /* ---------- minimal card (sectorless, non-hero targets) ---------- */
  // unified grammar: name target -> summon surface -> seal plan.
  // 소현 routes through its sector drill (sector = the unit of strategic action);
  // other classified provinces summon a sectorless minimal card.
  function pick(p) {
    if (!p || !p._c) return;
    if (p.id === HERO) { enterDrill(); return; }
    summonMinimalCard(p);
  }
  function summonMinimalCard(p) {
    state.mode = 'commit-min'; state.minTarget = p.id;
    render();
    setSurfaceOpen(true);
  }
  function renderMinimalCard(p) {
    const rc = id('work-surface'), t = AXES[p._c.axis], owner = FACTIONS[p.owner];
    const isScout = p._c.intent === 'scout', conf = confOf(p), st = stateOf(p);
    const estLine = st === 'unknown' ? '병력 미상 — 정찰 전' : `경제 ${p.economyValue} · 병력 ~${p.estForce}${st === 'glimpse' ? ' (추정 범위)' : ''}`;
    rc.innerHTML =
      `<div class="cc2-tag"><span class="v">계획 확정</span><span class="vn">${p.name} <i style="color:${owner.color}">${owner.short}</i> · <span style="color:rgb(${t.rgb})">${t.glyph} ${t.label}</span></span></div>` +
      `<div class="cc2-cbody">` +
        `<div class="cc2-fields"><span class="pf">대상 <b>${p.name}</b></span><span class="pf">지형 <b>${p.terrain}</b></span><span class="pf">${st === 'unknown' ? '정보' : '추정'} <b>${estLine}</b></span><span class="pf">신뢰 <b>${conf}%</b></span></div>` +
        (isScout
          ? `<div class="cc2-rear">정찰하면 신뢰가 <b>${conf}% → ${Math.round(Math.min(MAX_CONFIDENCE, p.minConfidence + SCOUT_GAIN) * 100)}%</b> — 안개가 걷히며 축이 위협/기회로 확정됩니다. 이 <b>1행동</b>을 씁니다.</div>`
          : `<div class="cc2-rear">${p._c.reason} 이번 턴 행동을 <b>공세 준비</b>에 씁니다 — 실행은 다음 턴.</div>`) +
        `<div class="cc2-foot"><button class="cc2-go${isScout ? ' scout' : ''}">${isScout ? '정찰 봉인 (1회)' : '공세 준비 봉인 (1회)'}</button><button class="cc2-back">취소</button></div>` +
      `</div>`;
    if (!REDUCED) rc.querySelectorAll('.cc2-cbody > *').forEach((n, i) => { n.classList.add('ws-anim'); n.style.animationDelay = (80 * i) + 'ms'; });
    rc.querySelector('.cc2-go').onclick = () => {
      state.mode = 'overview'; state.minTarget = null;
      setSurfaceOpen(false);
      if (isScout) scout(p); else { state.spentOn = p.id; state.spentKind = 'act'; }
      render();
    };
    rc.querySelector('.cc2-back').onclick = () => { state.mode = 'overview'; state.minTarget = null; setSurfaceOpen(false); render(); };
  }

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
    svg.addEventListener('click', ev => {
      const secG = ev.target.closest('[data-sec]');
      if (secG && state.mode === 'drill') { selectSector(secById(secG.getAttribute('data-sec'))); return; }
      const provG = ev.target.closest('[data-prov]');
      if (!provG) return;
      const p = byId[provG.getAttribute('data-prov')];
      if (state.mode === 'overview') { if (p._c) pick(p); }
      else if (state.mode === 'drill' && p.id !== HERO) exitDrill();
    });
    id('drawer-toggle').onclick = () => {
      const d = id('corner-drawer'), open = d.classList.toggle('hidden');
      id('drawer-toggle').setAttribute('aria-expanded', String(!open));
    };
    id('posture').querySelectorAll('.pt').forEach(b => b.addEventListener('click', () => { state.postureId = b.dataset.pt; render(); }));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && state.mode !== 'overview') backNav(); });
    bindVeil();
  }

  render(); renderGlance(); renderLegendStatic(); bind();
})();
