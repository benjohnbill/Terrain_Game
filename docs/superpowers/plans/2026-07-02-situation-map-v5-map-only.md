# Situation-Map v5 — Map-Only Overview + Lens Annotations + Summoned Work Surface

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Evolve `mockup/situation-map.{html,css,js}` in place from v4 to v5: the overview becomes map-only (no sidebar), posture buttons become Civ-style annotation lenses with a leak-through warning, and the commit UI becomes a transient work surface summoned from the named target — unifying all actions under one grammar (name target → summon surface → seal plan).

**Architecture:** This is MOCKUP/presentation work only (no `js/` game code). Single IIFE in `situation-map.js` renders SVG layers from dummy data in `situation-data.js`. v5 removes the right rail entirely; the rail's roles move to (a) on-map encodings + hover, (b) a floating morphing mission pill, (c) a corner drawer (dev tools), and (d) an absolutely-positioned slide-in work surface inside the map stage.

**Tech Stack:** Vanilla JS (ES2017, single IIFE), SVG, CSS. No build step. Verify with `node --check` + browser-harness against `python3 -m http.server 8007`.

## Global Constraints

- **Mockup only.** Never touch `js/` (game code), `docs/teach/` (user's untracked work), or `docs/features/operation-plan-catalog/` (user's workspace).
- **Never `git add -A`.** Stage only the files each task names. Commit once per task with the given message, ending with:
  `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`
- **Cache-bust:** bump both `<script src="...?v=6">` tags to `?v=7` in Task 1 (once). Browser-harness persistent profile caches `mockup/*.js` — after EVERY edit, hard-reload with `cdp("Page.reload", ignoreCache=True)` or you test stale code.
- **WSLg canvas gotcha:** browser-harness Chrome may paint a blank canvas on first load — not a bug, do not chase.
- **Server:** `python3 -m http.server 8007` from repo root (may already be running — check with `curl -s -o /dev/null -w "%{http_code}" http://localhost:8007/mockup/situation-map.html`). Page: `http://localhost:8007/mockup/situation-map.html`.
- **Motion:** every new animation must respect the existing `REDUCED` guard (JS) / `prefers-reduced-motion` (CSS).
- **Visual language:** reuse existing CSS custom properties (A2 map-table palette: `--recon-c`, `--self`, `--rival`, `--hold`, `--risk`, `--lose`, `--edge`, `--panel`, etc.). No new hex colors except where a step provides one.
- **All numbers are illustrative** (mockup charter: grammar probe, not balance).
- **Artifacts in neutral professional English** (code comments, commit messages); on-screen game copy stays Korean as given in the code blocks.

## Design Reference (spec stand-in — decided in the 2026-07-02 design session)

1. **Map-only overview.** The 형세판단 (situation reading) state has NO sidebar. All reading lives on the map (axis badges, glows, arrows, counters, fog) plus a thin top strip (판세 power bar + faction ladder + posture lens buttons). The turn briefing list, advice panel, and recommendation are REMOVED — the player judges freely.
2. **No recommendation.** The rec-ring, advice text, and dissonance warning are retired. Posture becomes a pure reading lens.
3. **Lens annotations (Civ-lens style).** Each posture answers a different question with on-map annotations over an invariant truth: 방어 = "where can I be breached" (weakest-garrison labels on own border provinces), 공세 = "what can I take" (force-comparison chips on reachable foes), 정찰 중시 = "what can't I see" (confidence % labels on foes), 균형 = base view. The active lens brightens its axis; other axes dim.
4. **Leak-through warning** (dissonance successor, no genre precedent — novel): while a lens is active, any suppressed-axis tension whose magnitude exceeds `LEAK_RATIO (1.5) ×` the strongest active-lens tension stays at full brightness and gets a red pulse ring. The lens may dim things, but a sufficiently urgent fact bleeds through.
5. **Unified action grammar:** name target → summon work surface → seal plan. The hero province 소현 routes through its front-sector drill (sector = the unit of strategic action, ADR 0022); fog/opportunity provinces (회령, 청문, 대관, 남강) summon a sectorless minimal card. The v3 floating command card is retired.
6. **Summoned work surface** (research-backed: transient slide-in > full-screen takeover > persistent dock): an absolutely-positioned panel slides in from the right edge of the map stage when a target is named. The map stays visible; the camera compensates so evidence (sector, pressure arrow, estimate band) never leaves the screen. Existing evidence-flight (band → card axis) is kept.
7. **Mission pill** (transition-direction principle): one floating, persistently-morphing label answers "what am I here to do?" per state: `긴장 선택 → 구역 선택 — 소현 → 커밋 결정 — <sector> → 명령 봉인`. It also hosts the spent/reveal/reset state.
8. **Seal choreography upgrade:** on confirm, the player's seal flies from the work surface to the sector while the enemy's face-down seal drops on 철옹 in the same tick (simultaneity expressed spatially), then the surface folds and the camera rewinds.
9. **Interaction fixes:** the whole province (terrain + block counter + badge) is one click target; the commit slider must survive drag (never re-create the input mid-drag).
10. **Charter bar (Into the Breach / Bad North research):** hover is for mechanism explanation only; any state needed for cross-sector comparison must be visible on the map; every meaningful state change must be confirmable on the map without opening the work surface.

Known v4 symbols this plan builds on (all in `mockup/situation-map.js`): `state{postureId, spentOn, spentKind, reveal, cardOn, mode, sectorOn, plan, commit, sealed, sealedPlan, enemySealed}`, `render()`, `renderRail()`, `renderAdvice()`, `renderActionPill()/missionLabel()/pillBody()`, `renderBriefing()/renderBriefingDrill()`, `renderLegend()`, `renderPosture()`, `recommend()/recNow()`, `drawRecRing()`, `openCard()/positionCard()/closeCard()/pick()`, `enterDrill()/exitDrill()/backNav()/selectSector()/flyEl()/sealOrder()/rewindToOverview()`, `drawSectors()/drawPressureArrow()/drawSeals()/drawEnemySeal()/sealMark()`, `renderRailCard()/wireCardPlans()/drawCardAxis()/renderCardView()/renderSealNotice()`, `scout()/scoutReveal()/resetTurn()`, `VB_FULL/VB_DRILL/animateVB()/setVB()`, `reading()`, `classify()`, `ourAdjForce()`, `confOf()`, `stateOf()`, `bindVeil()`, `bind()`, `renderGlance()`, constants `CAP, RELIABLE, DISS_RATIO, SCOUT_GAIN, HERO='sohyeon', THREAT={lo:12,hi:16,conf:75}, CAM_DUR, SEAL_HOLD`.

## Verification harness (used by every task)

Run browser checks with a Bash heredoc:

```bash
browser-harness <<'PY'
import json, time
ensure_real_tab()
new_tab("http://localhost:8007/mockup/situation-map.html")
wait_for_load()
cdp("Page.reload", ignoreCache=True); wait_for_load(); ensure_real_tab()
# ... js(...) assertions / capture_screenshot() per task ...
PY
```

Save screenshots to the session scratchpad and READ them (visual judgment is part of verification — the harness gotcha means the first paint may be blank; re-capture if so).

---

### Task 1: Map-only overview (Slice A)

**Files:**
- Modify: `mockup/situation-map.html` (replace `<div class="app">` content; bump `?v=`)
- Modify: `mockup/situation-map.css` (delete rail/advice/briefing/action-pill styles; add strip/mission-pill/drawer styles)
- Modify: `mockup/situation-map.js` (retire recommendation; rewire render/bind; mission pill)

**Interfaces:**
- Consumes: v4 symbols listed in Design Reference.
- Produces: `renderMissionPill(read)` (replaces `renderActionPill`/`renderRail`), `#mission-pill`, `#work-surface` (empty container used by Task 3), `#corner-drawer`, unified svg-level click delegation. `state.cardOn` remains but is only used by the (still-present until Task 4) v3 floating card.

- [ ] **Step 1: Replace the HTML app shell.**

In `mockup/situation-map.html`, update the banner:

```html
    <div class="mock-banner">
        <span class="mock-tag">형세판단 v5 · 지도 전용</span>
        <span class="mock-note">①형세(지도=화면 전부) → ③구역 드릴 → ④작업면 소환 → 봉인 · 렌즈 4종=주석+누출 경고(추천 없음) · 통일 행동 문법(지목→소환→봉인) · 히어로 경로 · 더미 데이터</span>
        <span class="mock-spec">src: ADR 0019/0022/0023/0025</span>
    </div>
```

Replace everything from `<div class="app">` through its closing `</div>` (currently: glance header + body with map-wrap and the whole `<aside class="rail">`) with:

```html
    <div class="app">
        <!-- thin top strip: 판세 glance (compact) + lens buttons. The map owns the rest. -->
        <header class="strip glass">
            <div class="g-faction"><span class="g-k">판세</span><span class="g-n">玄陽 · 현양</span></div>
            <div class="g-pd">
                <span class="g-side"><span class="g-lbl">나</span><span class="g-val" id="g-self">142</span></span>
                <span class="g-track"><span class="g-fill-self" id="g-fill-self"></span><span class="g-fill-rival" id="g-fill-rival"></span><span class="g-lead" id="g-lead">+17% ▲</span></span>
                <span class="g-side"><span class="g-lbl" id="g-rival-n">흑철</span><span class="g-val rival" id="g-rival">121</span></span>
            </div>
            <ol class="ladder" id="ladder"></ol>
            <div class="posture" id="posture" role="group" aria-label="읽기 렌즈 (주석)">
                <span class="pt-k">렌즈</span>
                <button class="pt" data-pt="balanced"  aria-pressed="true">균형</button>
                <button class="pt" data-pt="offensive" aria-pressed="false">공세</button>
                <button class="pt" data-pt="defensive" aria-pressed="false">방어</button>
                <button class="pt" data-pt="recon"     aria-pressed="false">정찰 중시</button>
            </div>
        </header>

        <main class="map-wrap glass">
            <div class="map-stage" id="map-stage">
                <svg id="map-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="형세 지도 — 지도 전용 읽기, 렌즈=주석, 안개=불확실, 구역 지명 시 작업면 소환">
                    <defs>
                        <filter id="soft" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="7"/></filter>
                    </defs>
                    <g id="l-terrain"></g>
                    <g id="l-murk"></g>
                    <g id="l-glow"></g>
                    <g id="l-perim"></g>
                    <g id="l-arrow"></g>
                    <g id="l-counter"></g>
                    <g id="l-sector"></g>
                    <g id="l-label"></g>
                    <g id="l-mark"></g>
                    <g id="l-fx"></g>
                </svg>
                <div id="mission-pill" class="mission-pill glass"><div class="ap-mission"></div><div class="ap-body"></div></div>
                <div id="chip" class="chip hidden"></div>
                <div id="card" class="card hidden"></div>
                <div id="work-surface" class="work-surface glass" aria-hidden="true"></div>
                <button id="drawer-toggle" class="drawer-toggle" aria-expanded="false" title="범례 · 안개 튜닝 · 목업 노트">ℹ</button>
                <div id="corner-drawer" class="corner-drawer glass hidden">
                    <h2 class="panel-h">범례</h2>
                    <div class="legend" id="legend"></div>
                    <h2 class="panel-h">안개 튜닝 (Veil)</h2>
                    <div class="veil-body">
                        <div class="veil-ctrl"><label>미발견 murk <span id="v-murk">0.66</span></label><input type="range" min="0" max="0.92" step="0.01" value="0.66" data-var="--murk" data-out="v-murk"></div>
                        <div class="veil-ctrl"><label>미발견 지형밝기 <span id="v-mterr">0.50</span></label><input type="range" min="0.15" max="1" step="0.01" value="0.5" data-var="--murk-terrain" data-out="v-mterr"></div>
                        <div class="veil-ctrl"><label>글림프스 밝기 <span id="v-dim">0.62</span></label><input type="range" min="0.25" max="1" step="0.01" value="0.62" data-var="--glimpse-dim" data-out="v-dim"></div>
                        <div class="veil-ctrl"><label>추정범위 흐림 <span id="v-fade">0.40</span></label><input type="range" min="0" max="0.85" step="0.01" value="0.4" data-var="--range-fade" data-out="v-fade"></div>
                        <div class="veil-ctrl"><label>정찰 마커 <span id="v-recon">0.90</span></label><input type="range" min="0" max="1" step="0.01" value="0.9" data-var="--recon" data-out="v-recon"></div>
                        <div class="veil-ctrl"><label>카운터 크기 <span id="v-cnt">1.00</span></label><input type="range" min="0.7" max="1.3" step="0.01" value="1" data-var="--counter" data-out="v-cnt"></div>
                    </div>
                    <h2 class="panel-h">이 목업이 따르는 방식</h2>
                    <ul class="model-note">
                        <li><b>지도 = 화면 전부</b>: 읽기는 지도 인코딩과 호버로만. 호버는 <b>설명 전용</b> — 비교가 필요한 수치는 지도 위 상설.</li>
                        <li><b>렌즈 = 주석</b>: 자세는 추천이 아니라 서로 다른 질문에 답하는 지도 주석. 진실(형세 분류)은 불변.</li>
                        <li><b>누출 경고</b>: 렌즈가 억누른 축의 긴장이 충분히 급하면 렌즈를 뚫고 붉게 새어 나옴.</li>
                        <li><b>통일 문법</b>: 지목 → 작업면 소환 → 봉인. 소현=구역(전략 행동 단위) 경유, 안개/기회 지방=최소 카드.</li>
                        <li><b>행동 1회</b>: 봉인이 그 1행동을 씀 — 적도 같은 순간 봉인(듀얼 비트), 해소는 다음 슬라이스.</li>
                    </ul>
                </div>
            </div>
        </main>
    </div>
```

Bump both script tags to `?v=7`.

- [ ] **Step 2: CSS — delete rail-era styles, add v5 shell styles.**

In `mockup/situation-map.css` DELETE these whole rule blocks (they have no remaining DOM): `.glance`, `.body`, `.rail`, `.advice` and all `.ad-*`, `.action-pill`, `.panel` sizing block ONLY IF unused — keep `.panel-h` (drawer reuses it) and keep `.briefing`/`.br-*` DELETED (list gone), keep `.ap-mission/.ap-body/.ap-back/.ap-line/.ap-k/.ap-left/.ap-note/.ap-spent/.ap-reset/.ap-reveal*/.ap-next` (mission pill reuses them), DELETE `.veil` summary rules (drawer has no `<details>`; keep `.veil-body`, `.veil-ctrl`), DELETE `.toolbar`, `.tb-title`, `.hint`, DELETE `.rail-card` (Task 3 re-adds as `.work-surface`), keep `.cc2-*`, `.axis`, `.verdict`, `.microbar`, `.commit-row`, `.srow`, `.gambit`, `.seal-note` etc. (work surface reuses), keep `.note-panel`/`.model-note` body rules.

ADD at the end of the file (before the reduced-motion line):

```css
/* ═══ v5 — map-only shell ═══ */
.strip { display: flex; align-items: center; gap: 18px; padding: 7px 14px; }
.strip .g-pd { min-width: 280px; }
.strip .posture { margin-left: auto; }

.mission-pill { position: absolute; z-index: 25; top: 12px; left: 50%; transform: translateX(-50%);
  display: flex; flex-direction: column; gap: 6px; align-items: center; padding: 8px 16px; max-width: min(520px, 70%); }
.mission-pill .ap-body { justify-content: center; }

.drawer-toggle { position: absolute; z-index: 26; left: 12px; bottom: 12px; width: 30px; height: 30px;
  border-radius: 50%; border: 1px solid var(--edge); background: var(--panel); color: var(--recon-c);
  font-family: var(--font-display); font-weight: 700; cursor: pointer; }
.drawer-toggle:hover { color: var(--ink); }
.corner-drawer { position: absolute; z-index: 26; left: 12px; bottom: 50px; width: 360px; max-height: 72%;
  overflow-y: auto; padding: 12px 14px; font-size: 12px; }
.corner-drawer .legend { display: flex; flex-wrap: wrap; gap: 8px 12px; margin: 0 0 6px; }
.corner-drawer .panel-h { margin: 10px 0 8px; }
.corner-drawer .panel-h:first-child { margin-top: 0; }
.corner-drawer .veil-body { padding: 0; }

/* work surface shell (content arrives in Task 3) */
.work-surface { position: absolute; z-index: 30; top: 10px; right: 10px; bottom: 10px;
  width: min(46%, 500px); overflow-y: auto; padding: 0;
  transform: translateX(calc(100% + 14px)); transition: transform .5s cubic-bezier(.22,1,.36,1); }
.work-surface.open { transform: translateX(0); }
```

- [ ] **Step 3: JS — retire the recommendation, rewire render/rail/bind.**

In `mockup/situation-map.js`:

a. Delete the `DISS_RATIO` constant line.

b. Delete the functions `recommend`, `recNow` (the block under `/* ---------- reading ... recommendation (posture) ---------- */` keeps only `reading()`), `drawRecRing`, `renderAdvice`, `renderBriefing`, `renderBriefingDrill`, `renderLegend` (a new static one comes in step d), and `renderRail`.

c. In `render()` change the head to:

```js
  function render() {
    const heroFocus = state.mode === 'drill' || state.mode === 'commit';
    const read = reading();
    const shownIds = new Set(read.map(s => s.p.id));
    const scale = cntScale();
    Object.values(L).forEach(g => (g.innerHTML = ''));
```

and in the same function delete the `if (!state.spentOn) drawRecRing(rec.p);` line, then replace the tail `renderRail(read, rec, rawTop, dissonant, posture); renderPosture();` with:

```js
    if (state.mode === 'commit') {                 // commit-mode dispatch moves here from renderRail
      if (state.sealed) renderSealNotice(); else renderRailCard(secById(state.sectorOn));
    }
    id('work-surface').classList.toggle('open', state.mode === 'commit');
    renderMissionPill(read);
    renderPosture();
```

(Task 3 later renames `renderRailCard` → `renderWorkSurface` in this dispatch. With the toggle living in `render()`, the per-function `.open` add/remove calls below are belt-and-braces for the animated paths.)

d. Replace `renderActionPill` with `renderMissionPill` (same morph mechanics, no briefing dependency), and update `pillBody`:

```js
  // one floating, morphing label per state — answers "what am I here to do?"
  function missionLabel() {
    if (state.mode === 'drill') return '구역 선택 — 소현';
    if (state.mode === 'commit') return state.sealed ? '명령 봉인' : '커밋 결정 — ' + secById(state.sectorOn).name;
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
```

Add a static legend + drawer binding (call once at the bottom alongside `render(); renderGlance(); bind();` → `render(); renderGlance(); renderLegendStatic(); bind();`):

```js
  function renderLegendStatic() {
    id('legend').innerHTML = Object.values(AXES).map(t => `<span class="lg"><i class="sw" style="background:rgb(${t.rgb})"></i>${t.label}</span>`).join('') +
      `<span class="lg"><i class="sw" style="background:rgb(${GROWTH_RGB})"></i>발전(판세)</span>` +
      `<span class="lg"><i class="sw murk-sw"></i>미발견</span>` +
      `<span class="lg"><i class="sw meter-sw"><i class="c on"></i><i class="c fade"></i><i class="c off"></i><i class="c off"></i></i>글림프스(추정 범위)</span>`;
  }
```

e. In `openCard(p)` delete the two recommendation-dependent lines — the `const rec = recNow().rec, isRec = rec.p.id === p.id;` declaration and the `<div class="cc-pick ...">...</div>` row in the template (the v3 card survives until Task 4 without them).

f. Replace the click wiring inside `bind()` (keep the hover listeners and `bindVeil()`), so the WHOLE province — terrain, block counter, badge — is one click target, and add the drawer toggle:

```js
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
```

Delete the old `L.terrain.addEventListener('click', ...)`, `L.sector.addEventListener('click', ...)`, and `L.mark.addEventListener('click', ...)` blocks. In `renderRailCard`-related code nothing changes yet, but `renderRail` is gone, so also delete the `enterDrill`/`selectSector` lines that reference removed ids: in `selectSector`, replace `const rc = id('rail-card');` with `const rc = id('work-surface');` and in `renderRailCard`/`renderSealNotice` replace `id('rail-card')` with `id('work-surface')` (3 occurrences total) — and everywhere `#work-surface` opens, add the class toggle: in `selectSector` after `render();` add `id('work-surface').classList.add('open');` and in `backNav`/`exitDrill`/`rewindToOverview` add `id('work-surface').classList.remove('open');`.

g. In `sealOrder`, `rewindToOverview`, `enterDrill`, `exitDrill`: remove any reference to `closeCard()` ONLY where it guarded rail state (keep `closeCard()` calls — the v3 card still exists until Task 4).

- [ ] **Step 4: Syntax check.**

Run: `node --check mockup/situation-map.js`
Expected: no output (pass).

- [ ] **Step 5: Browser verification.**

Hard-reload and assert with browser-harness:

```python
info = js(r"""(() => ({
  rail: !!document.querySelector('.rail'),                       // false
  strip: !!document.querySelector('.strip'),                     // true
  mission: document.querySelector('#mission-pill .ap-mission').textContent,  // '긴장 선택'
  badges: document.querySelectorAll('#l-mark .badge').length,    // 5
  recRing: document.querySelectorAll('.rec-ring').length,        // 0 (retired)
  drawerHidden: document.querySelector('#corner-drawer').classList.contains('hidden'), // true
}))()""")
```

Then: click the 소현 COUNTER block (not the hex) via `js("document.querySelector('#l-counter .ctr[data-prov=\\'sohyeon\\']').dispatchEvent(new MouseEvent('click',{bubbles:true}))")` — mission must morph to `구역 선택 — 소현` (click-target fix proven). Screenshot the overview and drill states and LOOK at them: no dead space where the rail was, mission pill centered, no overlap with the strip.

- [ ] **Step 6: Commit.**

```bash
git add mockup/situation-map.html mockup/situation-map.css mockup/situation-map.js
git commit -m "feat(mockup): v5 slice A — map-only overview, mission pill, corner drawer

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Lens annotations + leak-through warning (Slice B)

**Files:**
- Modify: `mockup/situation-map.js`
- Modify: `mockup/situation-map.css`
- Modify: `mockup/situation-data.js` (comment only)

**Interfaces:**
- Consumes: `reading()`, `POSTURES[..].prefer`, `drawBadge`, `glow`, `ourAdjForce`, `confOf`, `stateOf`, `L.mark`.
- Produces: `drawLensNotes()` (no args — reads module state), `leakSet(read)` (a `Set` of province ids that pierce the lens), constant `LEAK_RATIO = 1.5`. `drawBadge` gains a 5th argument: `drawBadge(p, axis, isSpent, scale, dimmed)`.

- [ ] **Step 1: Re-document `prefer` in the data file.**

In `mockup/situation-data.js`, replace the `POSTURES` doc comment (the block starting `/* Postures = the player's stance...` through `...most pressing tension. */`) with:

```js
/* Postures = READING LENSES (v5). A posture never changes what is classified
 * (truth invariant) and never recommends — it answers a different question
 * with on-map annotations: defensive "where can I be breached", offensive
 * "what can I take", recon "what can't I see", balanced = base view.
 * `prefer` names the axis a lens emphasizes (null = no emphasis).
 * Leak-through: a suppressed-axis tension urgent enough (see LEAK_RATIO in
 * situation-map.js) stays at full brightness and pulses through the lens. */
```

- [ ] **Step 2: JS — lens emphasis, annotations, leak-through.**

In `mockup/situation-map.js` add next to the other constants:

```js
  const LEAK_RATIO = 1.5; // a suppressed tension pierces the lens above this × the lens-top magnitude (illustrative)
```

Add after `reading()`:

```js
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
```

In `render()`, in the overview else-branch, replace the badge loop:

```js
      const leaks = leakSet(read), lens = lensAxis();
      read.forEach(s => {
        const suppressed = lens && s.axis !== lens && !leaks.has(s.p.id);
        drawBadge(s.p, s.axis, state.spentOn === s.p.id, cntScale(), suppressed);
        if (leaks.has(s.p.id)) drawLeakPulse(s.p);
      });
      drawLensNotes();
```

and adjust the located-axis glow line so a suppressed axis glows fainter and the lens axis brighter:

```js
      if (!(heroFocus && isHero) && p._c && shownIds.has(p.id)) {
        const lens0 = lensAxis();
        const a = dim ? 0.06 : lens0 ? (p._c.axis === lens0 ? 0.22 : 0.07) : 0.16;
        glow(p, AXES[p._c.axis].rgb, a, S * 1.28);
      }
```

Extend `drawBadge` — change its signature to `function drawBadge(p, axis, isSpent, scale, dimmed)` and change the group opacity line to:

```js
    const g = el('g', { class: 'badge', 'data-prov': p.id, opacity: state.spentOn && !isSpent ? 0.32 : dimmed ? 0.4 : 1 });
```

Add the pulse:

```js
  function drawLeakPulse(p) {  // urgency pierces the active lens (dissonance successor)
    const g = el('g', { class: 'leak' });
    g.appendChild(el('circle', { cx: p._cx.toFixed(1), cy: p._cy.toFixed(1), r: (S * 1.35).toFixed(1), fill: 'none', class: 'leak-ring' + (REDUCED ? ' still' : '') }));
    L.fx.appendChild(g);
  }
```

- [ ] **Step 3: CSS for notes + pulse.** Append:

```css
/* v5 lens annotations + leak-through */
.lens-note rect { fill: rgba(20,24,15,.88); stroke: var(--edge); stroke-width: 1; }
.lens-note.def rect { stroke: rgba(255,70,70,.55); }
.lens-note.adv rect { stroke: rgba(245,185,65,.6); }
.lens-note.low rect { stroke: rgba(180,90,255,.6); }
.lens-note-t { fill: var(--text-secondary); font-family: var(--font-display); font-weight: 700; }
.lens-note.def .lens-note-t { fill: #ff9a9a; }
.lens-note.adv .lens-note-t { fill: #f5c56a; }
.lens-note.low .lens-note-t { fill: #c9a2ff; }
.leak-ring { stroke: rgba(255,70,70,.9); stroke-width: 2.5; }
.leak-ring:not(.still) { animation: leak 1.4s ease-out infinite; }
@keyframes leak { 0% { stroke-opacity: .9; stroke-width: 2.5; } 70% { stroke-opacity: 0; stroke-width: 7; } 100% { stroke-opacity: 0; } }
```

- [ ] **Step 4: Verify.** `node --check`, hard reload, then per lens assert via browser-harness `js(...)`: `균형` → 0 `.lens-note`; `방어` → notes on 연천/가림/소현 (own bordered); `공세` → notes on reachable foes (대관, 남강, 철옹, 회령, 청문); `정찰 중시` → `정보 N%` notes on all foes. Leak check: with `공세` active, 소현's threat badge must stay full opacity + one `.leak-ring` present (its threat mag exceeds 1.5× the top opportunity — if it does not fire, verify by computing mags in-page and, if genuinely below threshold, lower `LEAK_RATIO` to 1.2 and note it in the commit body; the beat must be demonstrable). Screenshot each lens and LOOK: labels must not collide with counters/badges.

- [ ] **Step 5: Commit.**

```bash
git add mockup/situation-map.js mockup/situation-map.css mockup/situation-data.js
git commit -m "feat(mockup): v5 slice B — lens annotations + leak-through warning

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Summoned work surface + choreography + slider fix (Slice C)

**Files:**
- Modify: `mockup/situation-map.js`
- Modify: `mockup/situation-map.css`

**Interfaces:**
- Consumes: `#work-surface` (Task 1), `renderRailCard`→ now targeting work-surface, `flyEl`, `animateVB`, `VB_DRILL`, `sealMark`, `drawSeals`.
- Produces: `VB_COMMIT`, `renderWorkSurface(sec)` (renamed from `renderRailCard`), `updateCommitReadout(sec)` (drag-safe partial update), `svgToScreen(x,y)`, seal-flight choreography in `sealOrder`.

- [ ] **Step 1: Commit-stage camera frame.** After the `VB_DRILL` computation in the `viewBox` IIFE, add:

```js
    // commit frame: widen so the evidence (sector + arrow + 철옹) sits centered
    // in the ~54% of the stage the work surface leaves visible. Initial guess —
    // tune by eye in the browser (mockup work, judged on screen).
    const k = 1.7;
    VB_COMMIT = [
      Math.round(VB_DRILL[0] - VB_DRILL[2] * 0.08),
      Math.round(VB_DRILL[1] - (VB_DRILL[3] * (k - 1)) / 2),
      Math.round(VB_DRILL[2] * k),
      Math.round(VB_DRILL[3] * k),
    ];
```

Declare it alongside the others: `let VB_FULL, VB_DRILL, VB_COMMIT;`

- [ ] **Step 2: Wire the summon choreography.** In `selectSector`, after `render();` (and the existing `.open` toggle from Task 1), add `animateVB(VB_COMMIT);`. In `backNav`'s commit branch add `animateVB(VB_DRILL);`.

Rename `renderRailCard` → `renderWorkSurface` (update its two call sites: `renderRail` is gone, so calls live in `renderRail`'s replacement — search for `renderRailCard(` and `renderSealNotice(`; the mode dispatch now lives inline in `render()`; make sure `render()` ends with:

```js
    if (state.mode === 'commit') { if (state.sealed) renderSealNotice(); else renderWorkSurface(secById(state.sectorOn)); }
    renderMissionPill(read);
    renderPosture();
```

) and give the surface a staggered assembly: wrap the card body children so each direct child of `.cc2-cbody` gets class `ws-anim`:

In `renderWorkSurface`, after setting `rc.innerHTML`, add:

```js
    if (!REDUCED) rc.querySelectorAll('.cc2-cbody > *').forEach((n, i) => { n.classList.add('ws-anim'); n.style.animationDelay = (80 * i) + 'ms'; });
```

- [ ] **Step 3: Drag-safe slider.** In `renderCardView`, the defend branch currently rebuilds `defend.innerHTML` (including the `<input>`) on every input event — that kills the drag. Split it:

```js
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
```

(Replace the whole old `renderCardView` with the above; delete any now-duplicated foot-wiring lines at its former tail.)

- [ ] **Step 4: Seal-flight choreography.** Add the coordinate helper near `flyEl`:

```js
  const svgToScreen = (x, y) => { const r = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal;
    return { left: r.left + (x - vb.x) / vb.width * r.width - 14, top: r.top + (y - vb.y) / vb.height * r.height - 10, width: 28, height: 20 }; };
```

Replace `sealOrder` with:

```js
  function sealOrder(sec, plan) {
    state.sealedPlan = plan === 'scout' ? '정찰' : '방어 강화';
    const go = id('work-surface').querySelector('.cc2-go');
    const q = secCenter(sec);
    const drop = () => { state.sealed = true; render(); clearTimeout(sealTimer);
      if (!REDUCED) sealTimer = setTimeout(rewindToOverview, SEAL_HOLD); };
    if (go && !REDUCED) flyEl(go.getBoundingClientRect(), svgToScreen(q.x, q.y), '봉인', 'seal', drop);
    else drop();
  }
```

Add the flight style variant:

```css
.fly.seal { background: rgba(45,212,191,.92); border: 1px solid #0b3b36; color: #06231f; border-radius: 4px; }
```

Also append the assembly + notch styles:

```css
/* v5 work-surface assembly + commit notch */
.ws-anim { animation: ws-in .32s cubic-bezier(.22,1,.36,1) both; }
@keyframes ws-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.commit-slider { position: relative; }
.commit-notch { position: absolute; top: -2px; width: 0; height: 14px; border-left: 2px dotted rgba(232,227,210,.6); transform: translateX(-1px); pointer-events: none; }
@media (prefers-reduced-motion: reduce) { .ws-anim { animation: none !important; } }
```

- [ ] **Step 5: Verify.** `node --check`; hard reload; drive: 소현 → 남부 전선 → assert `#work-surface.open`, camera viewBox ≈ VB_COMMIT, band flight lands (`.axis .band` visible after ~0.6s), pressure arrow + sector still on screen next to the surface (screenshot + LOOK). Drag test: `js` can't drag, so assert structurally — set slider value via `el.value=40; el.dispatchEvent(new Event('input'))` twice and confirm `document.activeElement`-safe: the `#cc2-commit` node must be the SAME node before/after (`window.__n=document.getElementById('cc2-commit')` … `window.__n===document.getElementById('cc2-commit')` → `true`). Seal: click 봉인 → seal flies to sector, both seals drop same tick, rewind after 2s. Screenshot commit + seal states.

- [ ] **Step 6: Commit.**

```bash
git add mockup/situation-map.js mockup/situation-map.css
git commit -m "feat(mockup): v5 slice C — summoned work surface, seal flight, drag-safe commit slider

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Sectorless minimal cards + v3 card retirement (Slice D)

**Files:**
- Modify: `mockup/situation-map.js`
- Modify: `mockup/situation-map.css`
- Modify: `mockup/situation-map.html` (remove `#card`)

**Interfaces:**
- Consumes: `pick`, `scout`, `scoutReveal`, `renderMissionPill`, `#work-surface`.
- Produces: `state.mode` gains `'commit-min'`; `state.minTarget`; `summonMinimalCard(p)`, `renderMinimalCard(p)`. Deletes: `openCard`, `positionCard`, `closeCard`, `state.cardOn`, `#card`, `.card`/`.cc-*` CSS.

- [ ] **Step 1: Route non-hero picks to the minimal card.** Replace `pick`:

```js
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
    id('work-surface').classList.add('open');
  }
```

- [ ] **Step 2: Render it.** Add:

```js
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
      id('work-surface').classList.remove('open');
      if (isScout) scout(p); else { state.spentOn = p.id; state.spentKind = 'act'; }
      render();
    };
    rc.querySelector('.cc2-back').onclick = () => { state.mode = 'overview'; state.minTarget = null; id('work-surface').classList.remove('open'); render(); };
  }
```

Extend the `render()` mode dispatch and the dim rule:

```js
    // in render(): heroFocus stays drill/commit only. Dim rule for commit-min:
    const dim = (heroFocus ? !isHero
      : state.mode === 'commit-min' ? p.id !== state.minTarget
      : (state.spentOn && state.spentOn !== p.id)) ? ' dimmed' : '';
```

```js
    if (state.mode === 'commit') { if (state.sealed) renderSealNotice(); else renderWorkSurface(secById(state.sectorOn)); }
    else if (state.mode === 'commit-min') renderMinimalCard(byId[state.minTarget]);
```

Also update the Task 1 toggle line in `render()` so the surface stays open in the new mode:

```js
    id('work-surface').classList.toggle('open', state.mode === 'commit' || state.mode === 'commit-min');
```

`missionLabel()` gains: `if (state.mode === 'commit-min') return '계획 확정 — ' + byId[state.minTarget].name;` and `pillBody` gains at its top: `if (state.mode === 'commit-min') return '<span class="ap-note">이 지방에 이번 턴 행동을 쓸지 결정</span>';`. `backNav` gains: `if (state.mode === 'commit-min') { state.mode = 'overview'; state.minTarget = null; id('work-surface').classList.remove('open'); render(); return; }` (put it first).

- [ ] **Step 3: Retire the v3 floating card.** Delete `openCard`, `positionCard`, `closeCard` functions, the `state.cardOn` field, `<div id="card" class="card hidden"></div>` from the HTML, all `.card`/`.cc-h`/`.cc-cmd`/`.cc-tg`/`.cc-x`/`.cc-why`/`.cc-badge`/`.cc-reason`/`.cc-pick`/`.cc-fields`/`.cc-f`/`.cc-open`/`.cc-scout`/`.cc-actions`/`.cc-go`/`.cc-cancel`/`.cc-spent-msg` CSS blocks, and every remaining `closeCard()` call (in `enterDrill`, posture button handler, Escape handler — Escape now just calls `backNav()` when `state.mode !== 'overview'`).

- [ ] **Step 4: Verify.** `node --check`; hard reload; assert: click 회령 → `#work-surface.open`, tag shows `회령 … ? 불확실`, mission = `계획 확정 — 회령`; click 정찰 봉인 → reveal appears in the mission pill (`안개가 기회를 숨기고 있었다` for 회령), fog visuals narrow on map; 되돌리기 resets. Click 대관 → 공세 준비 봉인 path works, others dim. `document.getElementById('card')` → null. Screenshots of both minimal cards + post-scout reveal; LOOK at them.

- [ ] **Step 5: Commit.**

```bash
git add mockup/situation-map.html mockup/situation-map.css mockup/situation-map.js
git commit -m "feat(mockup): v5 slice D — sectorless minimal cards, unified action grammar, retire v3 card

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: README, charter bar, full-flow sweep

**Files:**
- Modify: `mockup/README.md`

**Interfaces:** none (docs + verification).

- [ ] **Step 1: Update `mockup/README.md`.** In the `situation-map.html` bullet: retitle to `(v5, ADR 0019 + fog + front-sector drill + map-only shell)`, extend the version history sentence (`…; v4 stitches …; v5 removes the sidebar entirely — map-only reading with lens annotations and a leak-through warning, a summoned work surface, and one unified action grammar (name target → summon surface → seal plan)`), replace the `Posture is a lens…` bullet with a lens-annotation description (posture answers a different question with on-map annotations; no recommendation; leak-through = the dissonance successor: a suppressed tension above 1.5× the lens-top magnitude pierces the lens with a red pulse), and add to the *known limitations* paragraph: `the leak threshold and all annotation values are illustrative; the minimal-card plan list (정찰/공세 준비) predates the operation-plan catalog roster.`

Then add one **charter bar** line to the limitations paragraph:

```
Charter bar (v5): hover is mechanism-explanation only; state needed for
cross-province comparison must be readable ON the map; every meaningful state
change must be confirmable on the map without opening the work surface.
```

- [ ] **Step 2: Full-flow sweep.** One browser-harness run walking the whole loop, screenshotting each state: overview (4 lenses) → 소현 drill → 남부 card → scout plan toggle → seal → duel beat → rewind → 회령 minimal card → scout reveal → 되돌리기. Confirm zero console errors (`window.__errs` pattern: install `window.__errs=[];window.addEventListener('error',e=>__errs.push(String(e.message)))` right after reload, assert empty at the end). LOOK at every screenshot against the charter bar.

- [ ] **Step 3: Commit.**

```bash
git add mockup/README.md
git commit -m "docs(mockup): v5 README — map-only shell, lens grammar, charter bar

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Out of scope (owed elsewhere, do NOT do here)

- Spec document, ADR 0019 amendment proposal (recommendation → lens annotations + leak-through) — Tier 3, design-session owner.
- Operation-plan catalog names on the cards (limitation stands).
- `js/situation.js` game-code rework; fog slices 2/3.
