/* ============================================================
 *  ui.js — GameUI (DOM manipulation & visual feedback)
 *  Depends on: Game, BUILDINGS, TECH_TREE, FACTION_DATA
 * ============================================================ */

window.GameUI = class GameUI {

  constructor(game) {
    this.game     = game;
    this.elements = {};
    this.cacheElements();
  }

  /* ─────────────────── DOM cache ─────────────────── */

  cacheElements() {
    const ids = [
      'turn-number', 'current-faction-name',
      'faction-name', 'faction-gold', 'faction-military',
      'faction-tech', 'faction-pop', 'faction-territory',
      'faction-income',
      'event-list', 'panel-faction', 'panel-actions',
      'faction-overview',
      'btn-attack', 'btn-defend', 'btn-diplomacy',
      'btn-tax', 'btn-build', 'btn-research',
      'btn-end-turn',
      'hex-tooltip',
      'modal-overlay', 'modal-title', 'modal-body', 'modal-buttons',
      'notification-container',
      'situation-briefing', 'command-card', 'capacity-bar',
      'strategy-report',
    ];
    for (const id of ids) {
      this.elements[id] = document.getElementById(id);
    }
  }

  /* helper: safe set */
  _setText(id, text) {
    const el = this.elements[id];
    if (el) el.textContent = text;
  }
  _setHTML(id, html) {
    const el = this.elements[id];
    if (el) el.innerHTML = html;
  }

  /* ─────────────────── update all ─────────────────── */

  updateAll() {
    this.updateTurnInfo();
    this.updateFactionPanel();
    this.updateCapacityBar();
    this.updateSituationBriefing();
    this.updateCommandCard();
    this.updateActionButtons();
    this.updateEventLog();
    this.updateStrategyReport();
    this.updateFactionOverview();
    if (this.game.map) this.game.map.render(this.game);
  }

  /* ─────────────────── turn info ─────────────────── */

  updateTurnInfo() {
    const f = this.game.getCurrentFaction();
    this._setText('turn-number', `턴 ${this.game.turnNumber}`);
    const el = this.elements['current-faction-name'];
    if (el) {
      el.textContent = `${f.emoji} ${f.name}`;
      el.style.color = f.color;
    }
  }

  /* ─────────────────── faction panel ─────────────────── */

  updateFactionPanel() {
    const f = this.game.getCurrentFaction();

    this._setHTML('faction-name', `<span style="color:${f.color}">${f.emoji} ${f.name}</span>`);
    this._setText('faction-gold',      `💰 ${f.gold}`);
    this._setText('faction-military',  `⚔️ ${f.calculateMilitary()}`);
    this._setText('faction-tech',      `🔬 ${f.getTotalTechLevel()}`);
    this._setText('faction-pop',       `👥 ${f.population}`);
    this._setText('faction-territory', `🏰 ${f.territories.size}`);
    this._setText('faction-income',    `📈 +${f.calculateIncome()}/턴`);

    const panel = this.elements['panel-faction'];
    if (panel) {
      panel.style.borderColor = f.color;
      panel.style.boxShadow   = `0 0 20px ${f.color}33, inset 0 0 20px ${f.color}11`;
    }
  }

  updateCapacityBar() {
    const el = this.elements['capacity-bar'];
    if (!el) return;
    const state = this.game.capacityState;
    if (!state || !state.available) {
      el.innerHTML = '';
      return;
    }
    const labels = window.ACTION_CAPACITIES || {};
    el.innerHTML = Object.entries(state.available).map(([key, value]) => {
      const label = labels[key] ? labels[key].shortLabel : key;
      const focus = state.focus && state.focus[key] ? state.focus[key] : '-';
      return `<div class="capacity-pill" title="Focus: ${focus}">
        <span>${label}</span><strong>${value}</strong>
      </div>`;
    }).join('');
  }

  updateSituationBriefing() {
    const el = this.elements['situation-briefing'];
    if (!el) return;
    const situation = this.game.situation;
    if (!situation || !situation.briefing || situation.briefing.length === 0) {
      el.innerHTML = '<div class="briefing-empty">이번 턴 주요 형세가 없습니다.</div>';
      return;
    }
    el.innerHTML = `
      <div class="briefing-title">형세 브리핑</div>
      ${situation.briefing.map((item) => `
        <button class="briefing-item" data-key="${item.key}">
          <span class="briefing-item-title">${item.title}</span>
          <span class="briefing-item-text">${item.text}</span>
          <span class="briefing-confidence">신뢰도 ${Math.round(item.confidence * 100)}%</span>
        </button>
      `).join('')}
    `;
  }

  updateCommandCard() {
    const el = this.elements['command-card'];
    if (!el) return;
    const command = this.game.selectedCommand;
    if (!command) {
      el.classList.add('hidden');
      el.innerHTML = '';
      return;
    }
    el.classList.remove('hidden');
    el.innerHTML = `
      <div class="command-card-title">${command.targetName}</div>
      <div class="command-card-row"><span>명령</span><strong>${command.intentLabel}</strong></div>
      <div class="command-card-row"><span>강도</span><strong>${command.intensity}</strong></div>
      <div class="command-card-row"><span>정보 신뢰도</span><strong>${Math.round(command.confidence * 100)}%</strong></div>
      <p>${command.reason}</p>
      <div class="command-card-actions">
        <button class="modal-btn small primary" type="button">명령 추가</button>
        <button class="modal-btn small" type="button">조정</button>
      </div>
    `;
  }

  /* ─────────────────── action buttons ─────────────────── */

  updateActionButtons() {
    const f     = this.game.getCurrentFaction();
    const isAI  = f.isAI;
    const taken = f.actionTaken;
    const ended = this.game.state !== 'playing';

    const actions = ['attack', 'defend', 'diplomacy', 'tax', 'build', 'research'];
    for (const a of actions) {
      const btn = this.elements[`btn-${a}`];
      if (!btn) continue;
      btn.disabled = isAI || taken || ended;
      btn.classList.toggle('selected', this.game.selectedAction === a);
    }

    const endBtn = this.elements['btn-end-turn'];
    if (endBtn) {
      endBtn.disabled = isAI || ended;
    }
  }

  /* ─────────────────── event log ─────────────────── */

  updateEventLog() {
    const list = this.elements['event-list'];
    if (!list) return;

    const events = this.game.eventLog.slice(0, 20);
    list.innerHTML = events.map(e => {
      const faction = e.factionId !== null && e.factionId !== undefined
        ? this.game.getFaction(e.factionId) : null;
      const color = faction ? faction.color : '#aaa';
      return `<div class="event-item" style="border-left:3px solid ${color};padding:4px 8px;margin-bottom:4px;font-size:0.82rem;line-height:1.35">
        <span style="opacity:0.5;font-size:0.72rem">턴${e.turnNumber}</span> ${e.message}
      </div>`;
    }).join('');
  }

  /* ─────────────────── faction overview bar ─────────────────── */

  updateFactionOverview() {
    const container = this.elements['faction-overview'];
    if (!container) return;

    const totalHex = this.game.map ? this.game.map.getTotalHexCount() : 1;

    container.innerHTML = this.game.factions.map(f => {
      const isCurrent = f.id === this.game.getCurrentFaction().id;
      const opacity   = f.alive ? 1 : 0.35;
      const border    = isCurrent ? `2px solid ${f.color}` : '1px solid rgba(255,255,255,0.1)';
      const bg        = isCurrent ? `${f.color}22` : 'rgba(255,255,255,0.03)';
      const pct       = Math.round(f.territories.size / totalHex * 100);

      // Relation badges
      let badges = '';
      if (f.alive && f.id !== this.game.getCurrentFaction().id) {
        const cur = this.game.getCurrentFaction();
        if (this.game.diplomacy.isAlly(cur.id, f.id)) badges = '<span style="color:#60ff90;font-size:0.7rem"> 🤝동맹</span>';
        else if (this.game.diplomacy.isAtWar(cur.id, f.id)) badges = '<span style="color:#ff6060;font-size:0.7rem"> ⚔전쟁</span>';
      }

      return `<div class="faction-card" style="opacity:${opacity};border:${border};background:${bg};
                padding:6px 10px;border-radius:8px;min-width:110px;text-align:center;transition:all 0.3s">
        <div style="font-size:1.3rem">${f.emoji}</div>
        <div style="color:${f.color};font-weight:600;font-size:0.82rem">${f.name}${badges}</div>
        <div style="font-size:0.72rem;opacity:0.7">🏰${f.territories.size}(${pct}%) ⚔${f.alive ? f.calculateMilitary() : 0} 💰${f.gold}</div>
        ${!f.alive ? '<div style="color:#ff4444;font-size:0.7rem;font-weight:700">멸망</div>' : ''}
      </div>`;
    }).join('');
  }

  updateStrategyReport() {
    const el = this.elements['strategy-report'];
    if (!el) return;
    const report = this.game.strategyReport || [];
    if (report.length === 0) {
      el.innerHTML = '<div class="strategy-report-empty">턴 처리 후 주요 결과가 여기에 요약됩니다.</div>';
      return;
    }
    el.innerHTML = report.map((item) => `
      <div class="strategy-report-item ${item.type}">
        <strong>${item.title}</strong>
        <span>${item.text}</span>
      </div>
    `).join('');
  }

  /* ═══════════════════ MODALS ═══════════════════ */

  showModal(title, bodyHTML, buttons) {
    const overlay = this.elements['modal-overlay'];
    const mTitle  = this.elements['modal-title'];
    const mBody   = this.elements['modal-body'];
    const mBtns   = this.elements['modal-buttons'];
    if (!overlay) return;

    if (mTitle) mTitle.textContent = title;
    if (mBody)  mBody.innerHTML   = bodyHTML;
    if (mBtns) {
      mBtns.innerHTML = '';
      for (const b of buttons) {
        const btn = document.createElement('button');
        btn.textContent = b.text;
        btn.className   = b.className || 'modal-btn';
        btn.onclick     = () => { b.onClick(); };
        mBtns.appendChild(btn);
      }
    }

    overlay.classList.remove('hidden');
    overlay.style.opacity = '0';
    requestAnimationFrame(() => { overlay.style.opacity = '1'; });
  }

  hideModal() {
    const overlay = this.elements['modal-overlay'];
    if (!overlay) return;
    overlay.style.opacity = '0';
    setTimeout(() => overlay.classList.add('hidden'), 250);
  }

  /* ─────────── battle result ─────────── */

  showBattleResult(result) {
    const icon = result.conquered ? '⚔️ 승리!' : '🛡️ 패배!';
    const color = result.conquered ? '#60ff90' : '#ff6060';
    const body = `
      <div style="text-align:center;padding:16px 0">
        <div style="font-size:2.5rem;margin-bottom:12px">${result.conquered ? '🎉' : '💥'}</div>
        <div style="font-size:1.6rem;font-weight:700;color:${color};margin-bottom:16px">${icon}</div>
        <div style="display:flex;justify-content:center;gap:40px;margin-bottom:16px">
          <div>
            <div style="font-size:0.8rem;opacity:0.6">공격력</div>
            <div style="font-size:1.8rem;font-weight:700;color:#ff9944">⚔ ${result.attackRoll}</div>
          </div>
          <div style="font-size:2rem;align-self:center;opacity:0.3">VS</div>
          <div>
            <div style="font-size:0.8rem;opacity:0.6">방어력</div>
            <div style="font-size:1.8rem;font-weight:700;color:#4499ff">🛡 ${result.defenseRoll}</div>
          </div>
        </div>
        <div style="font-size:0.9rem;opacity:0.85">${result.message}</div>
      </div>`;

    this.showModal('전투 결과', body, [
      { text: '확인', className: 'modal-btn primary', onClick: () => this.hideModal() }
    ]);
  }

  /* ─────────── diplomacy dialog ─────────── */

  showDiplomacyDialog() {
    const game    = this.game;
    const faction = game.getCurrentFaction();
    const others  = game.getAliveFactions().filter(f => f.id !== faction.id);

    if (others.length === 0) {
      this.showNotification('외교 대상이 없습니다.', 'warning');
      return;
    }

    let body = '<div style="display:flex;flex-direction:column;gap:10px;max-height:350px;overflow-y:auto">';

    for (const f of others) {
      const isAlly = game.diplomacy.isAlly(faction.id, f.id);
      const isWar  = game.diplomacy.isAtWar(faction.id, f.id);
      const dipScore = game.diplomacy.getScore(faction.id, f.id);
      let relationText = '중립';
      let relColor     = '#aaa';
      if (isAlly) { relationText = '🤝 동맹'; relColor = '#60ff90'; }
      if (isWar)  { relationText = '⚔ 전쟁'; relColor = '#ff6060'; }

      body += `<div style="background:rgba(255,255,255,0.05);border-radius:8px;padding:10px 14px;border:1px solid ${f.color}33">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
          <span style="font-size:1.4rem">${f.emoji}</span>
          <span style="color:${f.color};font-weight:600">${f.name}</span>
          <span style="margin-left:auto;color:${relColor};font-size:0.8rem">${relationText} · 외교 ${dipScore}</span>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">`;

      // Valid actions
      if (!isAlly && !isWar) {
        body += `<button class="modal-btn small" onclick="window._uiDiplomacy('propose_alliance',${f.id})">동맹 제안</button>`;
        body += `<button class="modal-btn small danger" onclick="window._uiDiplomacy('declare_war',${f.id})">선전포고</button>`;
      }
      if (isWar) {
        body += `<button class="modal-btn small" onclick="window._uiDiplomacy('propose_peace',${f.id})">평화 제안</button>`;
      }
      if (isAlly) {
        body += `<button class="modal-btn small danger" onclick="window._uiDiplomacy('break_alliance',${f.id})">동맹 파기</button>`;
      }

      body += `</div></div>`;
    }
    body += '</div>';

    // Temporary global callback
    window._uiDiplomacy = (actionType, targetId) => {
      const target = game.getFaction(targetId);
      const result = game.executeAction('diplomacy', { targetFaction: target, actionType });
      this.hideModal();
      this.showNotification(result.message, result.success ? 'success' : 'warning');
      this.updateAll();
    };

    this.showModal('🌐 외교', body, [
      { text: '닫기', className: 'modal-btn', onClick: () => { this.hideModal(); game.cancelAction(); } }
    ]);
  }

  /* ─────────── build menu ─────────── */

  showBuildMenu(hex) {
    const game    = this.game;
    const faction = game.getCurrentFaction();
    const buildings = window.BUILDINGS;

    let body = `<div style="margin-bottom:10px;font-size:0.85rem;opacity:0.7">보유 골드: 💰${faction.gold}</div>`;
    body += '<div style="display:flex;flex-direction:column;gap:8px">';

    for (const [key, b] of Object.entries(buildings)) {
      const canAfford = faction.canAfford(b.cost);
      const opacity   = canAfford ? 1 : 0.4;
      body += `<button class="modal-btn build-option" style="opacity:${opacity};text-align:left;padding:10px 14px"
        ${canAfford ? `onclick="window._uiBuild('${key}')"` : 'disabled'}>
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:1.5rem">${b.icon}</span>
          <div>
            <div style="font-weight:600">${b.name} <span style="opacity:0.6;font-size:0.8rem">💰${b.cost}</span></div>
            <div style="font-size:0.78rem;opacity:0.7">${b.description}</div>
          </div>
        </div>
      </button>`;
    }
    body += '</div>';

    window._uiBuild = (buildingType) => {
      const result = game.executeAction('build', { targetHex: hex, buildingType });
      this.hideModal();
      this.showNotification(result.message, result.success ? 'success' : 'warning');
      this.updateAll();
    };

    this.showModal('🏗️ 건설', body, [
      { text: '취소', className: 'modal-btn', onClick: () => { this.hideModal(); game.cancelAction(); } }
    ]);
  }

  /* ─────────── tech menu ─────────── */

  showTechMenu() {
    const game    = this.game;
    const faction = game.getCurrentFaction();
    const tree    = window.TECH_TREE;

    let body = `<div style="margin-bottom:10px;font-size:0.85rem;opacity:0.7">보유 골드: 💰${faction.gold}</div>`;
    body += '<div style="display:flex;flex-direction:column;gap:10px">';

    for (const [cat, branch] of Object.entries(tree)) {
      const lvl      = faction.techs[cat] || 0;
      const maxed    = lvl >= branch.levels.length;
      const nextTech = maxed ? null : branch.levels[lvl];
      const canAfford = nextTech ? faction.canAfford(nextTech.cost) : false;

      // Level dots
      let dots = '';
      for (let i = 0; i < branch.levels.length; i++) {
        dots += i < lvl
          ? '<span style="color:#60ff90">●</span> '
          : '<span style="opacity:0.3">○</span> ';
      }

      body += `<div style="background:rgba(255,255,255,0.05);border-radius:8px;padding:12px 14px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
          <span style="font-size:1.3rem">${branch.icon}</span>
          <span style="font-weight:600">${branch.name}</span>
          <span style="margin-left:auto;font-size:0.8rem">${dots}</span>
        </div>`;

      if (maxed) {
        body += `<div style="font-size:0.82rem;color:#60ff90">✅ 최대 레벨 달성</div>`;
      } else {
        const opacity = canAfford ? 1 : 0.4;
        body += `<div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
          <div style="font-size:0.82rem">
            <div style="font-weight:500">${nextTech.name} <span style="opacity:0.6">Lv.${lvl + 1}</span></div>
            <div style="font-size:0.75rem;opacity:0.6">${nextTech.description}</div>
            <div style="font-size:0.78rem;opacity:0.7">비용: 💰${nextTech.cost}</div>
          </div>
          <button class="modal-btn small primary" style="opacity:${opacity}" ${canAfford ? `onclick="window._uiResearch('${cat}')"` : 'disabled'}>연구</button>
        </div>`;
      }
      body += '</div>';
    }
    body += '</div>';

    window._uiResearch = (techCategory) => {
      const result = game.executeAction('research', { techCategory });
      this.hideModal();
      this.showNotification(result.message, result.success ? 'success' : 'warning');
      this.updateAll();
    };

    this.showModal('🔬 기술 연구', body, [
      { text: '닫기', className: 'modal-btn', onClick: () => { this.hideModal(); game.cancelAction(); } }
    ]);
  }

  /* ─────────── hex tooltip ─────────── */

  showHexTooltip(hex, x, y) {
    const tip = this.elements['hex-tooltip'];
    if (!tip || !hex) return;

    const owner = hex.owner !== null ? this.game.getFaction(hex.owner) : null;
    const ownerStr = owner ? `<span style="color:${owner.color}">${owner.emoji} ${owner.name}</span>` : '중립';
    const buildingDef = hex.building ? window.BUILDINGS[hex.building] : null;
    const buildingStr = buildingDef ? `${buildingDef.icon} ${buildingDef.name}` : '없음';

    let defenseStr = '20';
    if (owner) defenseStr = '' + owner.getDefenseAt(hex.key());

    tip.innerHTML = `
      <div style="font-weight:600;margin-bottom:4px">📍 ${hex.key()}</div>
      <div>소유: ${ownerStr}</div>
      <div>건물: ${buildingStr}</div>
      <div>인구: 👥 ${hex.population}</div>
      <div>방어: 🛡 ${defenseStr}</div>`;

    tip.classList.remove('hidden');

    // Position near mouse, keep on screen
    const pad = 14;
    let left = x + pad;
    let top  = y + pad;
    const tipRect = tip.getBoundingClientRect();
    if (left + 180 > window.innerWidth)  left = x - 180 - pad;
    if (top  + 140 > window.innerHeight) top  = y - 140 - pad;
    tip.style.left = left + 'px';
    tip.style.top  = top  + 'px';
  }

  hideHexTooltip() {
    const tip = this.elements['hex-tooltip'];
    if (tip) tip.classList.add('hidden');
  }

  /* ─────────── notifications ─────────── */

  showNotification(message, type = 'info') {
    let container = this.elements['notification-container'];
    if (!container) {
      container = document.createElement('div');
      container.id = 'notification-container';
      container.style.cssText = 'position:fixed;top:16px;right:16px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none';
      document.body.appendChild(container);
      this.elements['notification-container'] = container;
    }

    const colors = {
      info:    { bg: 'rgba(60,130,255,0.92)',  border: '#4499ff' },
      success: { bg: 'rgba(40,180,80,0.92)',   border: '#60ff90' },
      warning: { bg: 'rgba(220,160,30,0.92)',  border: '#ffc040' },
      error:   { bg: 'rgba(220,50,50,0.92)',   border: '#ff5050' }
    };
    const c = colors[type] || colors.info;

    const n = document.createElement('div');
    n.className = `notification ${type}`;
    n.style.cssText = `background:${c.bg};border:1px solid ${c.border};color:#fff;
      padding:10px 18px;border-radius:10px;font-size:0.88rem;font-weight:500;
      pointer-events:auto;box-shadow:0 4px 20px rgba(0,0,0,0.4);
      transform:translateX(120%);transition:transform 0.35s cubic-bezier(.22,1,.36,1), opacity 0.3s;
      max-width:360px;backdrop-filter:blur(10px)`;
    n.textContent = message;

    container.appendChild(n);
    requestAnimationFrame(() => { n.style.transform = 'translateX(0)'; });

    setTimeout(() => {
      n.style.transform = 'translateX(120%)';
      n.style.opacity   = '0';
      setTimeout(() => n.remove(), 350);
    }, 3200);
  }

  /* ─────────── AI turn indicator ─────────── */

  showAITurnIndicator(faction) {
    this.showNotification(`${faction.emoji} ${faction.name} AI 사고 중...`, 'info');
  }

  /* ─────────── proposal dialog for human ─────────── */

  showCrisisDialog(crisis) {
    const game = this.game;
    const faction = game.getFaction(crisis.factionId);
    if (!faction) return;

    const body = `
      <div style="padding:8px 0 14px">
        <div style="font-size:1rem;font-weight:700;margin-bottom:8px">${crisis.title}</div>
        <div style="font-size:0.88rem;line-height:1.5;opacity:0.8">${crisis.text}</div>
        <div style="margin-top:12px;font-size:0.78rem;opacity:0.65">실패하면 일부 영토가 새 AI 제3세력으로 독립합니다.</div>
      </div>`;

    const choose = (choice) => {
      const result = game.resolveCrisis(crisis, choice);
      this.hideModal();
      this.showNotification(result.message, result.success ? 'success' : 'warning');
      this.updateAll();
    };

    this.showModal('⚠️ 국가 위기', body, [
      { text: '봉쇄와 치료', className: 'modal-btn primary', onClick: () => choose('quarantine') },
      { text: '군사 동원', className: 'modal-btn danger', onClick: () => choose('mobilize') },
      { text: '회유와 협상', className: 'modal-btn', onClick: () => choose('negotiate') }
    ]);
  }

  showProposalDialog(proposal, fromFaction) {
    const typeText = proposal.type === 'alliance' ? '동맹' : '평화';
    const body = `
      <div style="text-align:center;padding:20px 0">
        <div style="font-size:2.2rem;margin-bottom:10px">${fromFaction.emoji}</div>
        <div style="font-size:1rem;margin-bottom:6px">
          <span style="color:${fromFaction.color};font-weight:600">${fromFaction.name}</span>이(가)
        </div>
        <div style="font-size:1.2rem;font-weight:700;color:#f0e070">
          ${typeText}을(를) 제안합니다
        </div>
      </div>`;

    this.showModal('📜 외교 제안', body, [
      {
        text: '수락',
        className: 'modal-btn primary',
        onClick: () => {
          this.game.diplomacy.acceptProposal(proposal);
          this.game.addEvent(`🤝 ${this.game.getCurrentFaction().emoji} ${this.game.getCurrentFaction().name}이(가) ${fromFaction.emoji} ${fromFaction.name}의 ${typeText} 제안을 수락!`, this.game.getCurrentFaction().id);
          this.hideModal();
          this.showNotification(`${fromFaction.name}과(와) ${typeText} 체결!`, 'success');
          this.updateAll();
        }
      },
      {
        text: '거절',
        className: 'modal-btn danger',
        onClick: () => {
          this.game.diplomacy.rejectProposal(proposal);
          this.game.addEvent(`❌ ${this.game.getCurrentFaction().emoji} ${this.game.getCurrentFaction().name}이(가) ${fromFaction.emoji} ${fromFaction.name}의 ${typeText} 제안을 거절.`, this.game.getCurrentFaction().id);
          this.hideModal();
          this.showNotification(`${fromFaction.name}의 제안을 거절했습니다.`, 'warning');
          this.updateAll();
        }
      }
    ]);
  }
};
