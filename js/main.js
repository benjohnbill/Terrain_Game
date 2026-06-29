/* ============================================================
 *  main.js — Entry point / Game orchestrator
 *  Depends on: Game, GameUI, AIPlayer, HexMap, DiplomacySystem,
 *              FACTION_DATA (all on window)
 * ============================================================ */

(function () {
  'use strict';

  let currentGame    = null;
  let currentUI      = null;
  let gameMode       = null;
  let selectedFactionCount = 4;
  let selectedPlayerCount  = 2;
  let menuParticleAnim     = null;
  let confettiAnim         = null;
  let aiProcessing         = false;

  /* ═════════════════════ BOOT ═════════════════════ */

  document.addEventListener('DOMContentLoaded', () => {
    initMenuParticles();
    setupMenuEventListeners();
  });

  /* ═════════════════════ SCREEN SWITCHING ═════════════════════ */

  function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => {
      s.classList.remove('active');
    });
    const target = document.getElementById(screenId);
    if (target) {
      // Small delay so CSS transition works
      requestAnimationFrame(() => {
        target.classList.add('active');
      });
    }
  }

  /* ═════════════════════ MENU PARTICLES ═════════════════════ */

  function initMenuParticles() {
    const canvas = document.getElementById('menu-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#6b5ce7', '#ff9f43', '#54a0ff'];
    const particles = [];
    const COUNT = 60;

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r:  Math.random() * 2.5 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255,255,255,${0.06 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      menuParticleAnim = requestAnimationFrame(draw);
    }
    draw();
  }

  /* ═════════════════════ MENU LISTENERS ═════════════════════ */

  function setupMenuEventListeners() {
    const btnSingle = document.getElementById('btn-singleplayer');
    const btnMulti  = document.getElementById('btn-multiplayer');
    const menuSettings = document.getElementById('menu-settings');
    const playerCountSetting = document.getElementById('player-count-setting');

    if (btnSingle) {
      btnSingle.addEventListener('click', () => {
        gameMode = 'singleplayer';
        selectedPlayerCount = 1;
        if (menuSettings) menuSettings.classList.remove('hidden');
        if (playerCountSetting) playerCountSetting.classList.add('hidden');
        // Highlight active mode button
        btnSingle.classList.add('selected');
        if (btnMulti) btnMulti.classList.remove('selected');
      });
    }
    if (btnMulti) {
      btnMulti.addEventListener('click', () => {
        gameMode = 'multiplayer';
        selectedPlayerCount = 2;
        if (menuSettings) menuSettings.classList.remove('hidden');
        if (playerCountSetting) playerCountSetting.classList.remove('hidden');
        btnMulti.classList.add('selected');
        if (btnSingle) btnSingle.classList.remove('selected');
      });
    }

    // Faction count setting buttons (data-count attribute)
    document.querySelectorAll('.setting-btn[data-count]').forEach(btn => {
      btn.addEventListener('click', () => {
        // Deselect siblings
        btn.parentElement.querySelectorAll('.setting-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedFactionCount = parseInt(btn.dataset.count);
        // Update player count max
        updatePlayerCountOptions();
      });
    });

    // Player count setting buttons (data-players attribute)
    document.querySelectorAll('.setting-btn[data-players]').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.parentElement.querySelectorAll('.setting-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedPlayerCount = parseInt(btn.dataset.players);
      });
    });

    // Start game
    const btnStart = document.getElementById('btn-start-game');
    if (btnStart) {
      btnStart.addEventListener('click', () => {
        if (!gameMode) {
          // Default to singleplayer if no mode selected
          gameMode = 'singleplayer';
          selectedPlayerCount = 1;
        }
        const config = {
          mode: gameMode,
          factionCount: selectedFactionCount,
          playerCount:  selectedPlayerCount
        };
        startGame(config);
      });
    }

    // Back to menu from result screen
    const btnBack = document.getElementById('btn-back-menu');
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        if (confettiAnim) cancelAnimationFrame(confettiAnim);
        showScreen('screen-menu');
        // Reset menu state
        if (menuSettings) menuSettings.classList.add('hidden');
        if (btnSingle) btnSingle.classList.remove('selected');
        if (btnMulti) btnMulti.classList.remove('selected');
        gameMode = null;
        initMenuParticles();
      });
    }

    // Menu return from game
    const btnMenuReturn = document.getElementById('btn-menu-return');
    if (btnMenuReturn) {
      btnMenuReturn.addEventListener('click', () => {
        if (confirm('메뉴로 돌아가시겠습니까? 게임 진행이 초기화됩니다.')) {
          if (currentGame) currentGame.state = 'ended';
          aiProcessing = false;
          showScreen('screen-menu');
          if (menuSettings) menuSettings.classList.add('hidden');
          gameMode = null;
          initMenuParticles();
        }
      });
    }
  }

  function updatePlayerCountOptions() {
    const options = document.getElementById('player-count-options');
    if (!options) return;
    options.querySelectorAll('.setting-btn[data-players]').forEach(btn => {
      const count = parseInt(btn.dataset.players);
      btn.style.display = count <= selectedFactionCount ? '' : 'none';
      if (count > selectedFactionCount && btn.classList.contains('active')) {
        btn.classList.remove('active');
        // Select the highest valid option
        const valid = options.querySelector(`.setting-btn[data-players="${Math.min(selectedPlayerCount, selectedFactionCount)}"]`);
        if (valid) valid.classList.add('active');
        selectedPlayerCount = Math.min(selectedPlayerCount, selectedFactionCount);
      }
    });
  }

  /* ═════════════════════ GAME START ═════════════════════ */

  function startGame(config) {
    // Stop menu particles
    if (menuParticleAnim) cancelAnimationFrame(menuParticleAnim);

    showScreen('screen-game');

    const canvas = document.getElementById('game-canvas');
    if (!canvas) return;

    currentGame = new window.Game(config);
    currentGame.init(canvas);

    currentUI = new window.GameUI(currentGame);

    // Wire callbacks
    currentGame.onUpdate       = () => currentUI.updateAll();
    currentGame.onNotification = (msg, type) => currentUI.showNotification(msg, type);
    currentGame.onBattleResult = (result) => currentUI.showBattleResult(result);
    currentGame.onShowDiplomacy = () => currentUI.showDiplomacyDialog();
    currentGame.onShowBuild    = (hex) => currentUI.showBuildMenu(hex);
    currentGame.onShowTech     = () => currentUI.showTechMenu();
    currentGame.onVictory      = (winner) => handleVictory(winner);
    currentGame.onShowProposal = (proposal, from) => currentUI.showProposalDialog(proposal, from);
    currentGame.onCrisis       = (crisis) => currentUI.showCrisisDialog(crisis);

    setupGameEventHandlers();
    currentUI.updateAll();
    if (currentGame.map) {
      requestAnimationFrame(() => currentGame.map.render(currentGame));
    }

    // Handle resize
    window.addEventListener('resize', () => {
      if (currentGame && currentGame.map) {
        currentGame.map.resize();
        currentUI.updateAll();
      }
    });

    // If first faction is AI, kick off AI
    const first = currentGame.getCurrentFaction();
    if (first.isAI) {
      aiProcessing = true;
      setTimeout(() => processAITurn(first), 600);
    }
  }

  /* ═════════════════════ EVENT HANDLERS ═════════════════════ */

  function setupGameEventHandlers() {
    // Action buttons
    const actions = ['attack', 'defend', 'diplomacy', 'tax', 'build', 'research'];
    for (const a of actions) {
      const btn = document.getElementById(`btn-${a}`);
      if (btn) {
        // Clone to remove old listeners
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener('click', () => {
          if (aiProcessing) return;
          if (currentGame.selectedAction === a) {
            // Toggle off
            currentGame.cancelAction();
            currentUI.updateAll();
          } else {
            currentGame.selectAction(a);
            currentUI.updateAll();
          }
        });
      }
    }

    // End turn
    const btnEnd = document.getElementById('btn-end-turn');
    if (btnEnd) {
      const newBtn = btnEnd.cloneNode(true);
      btnEnd.parentNode.replaceChild(newBtn, btnEnd);
      newBtn.addEventListener('click', () => {
        if (aiProcessing) return;
        handleEndTurn();
      });
    }

    // Re-cache elements after cloning
    if (currentUI) currentUI.cacheElements();

    // Hex click
    if (currentGame.map) {
      currentGame.map.onClick((hex) => {
        if (aiProcessing) return;
        currentGame.handleHexClick(hex);
      });

      // Hex hover — map.js sends (hex, clientX, clientY) from its internal handler
      currentGame.map.onHover((hex, clientX, clientY) => {
        if (hex) {
          currentUI.showHexTooltip(hex, clientX, clientY);
        } else {
          currentUI.hideHexTooltip();
        }
      });
    }
  }

  /* ═════════════════════ END TURN ═════════════════════ */

  function handleEndTurn() {
    if (!currentGame || currentGame.state !== 'playing') return;

    const nextFaction = currentGame.nextTurn();
    if (!nextFaction || currentGame.state !== 'playing') return;

    // Process proposals for human player
    if (!nextFaction.isAI) {
      processProposalsForHuman(nextFaction);
    }

    currentUI.updateAll();

    // If AI, start chain
    if (nextFaction.isAI) {
      aiProcessing = true;
      setTimeout(() => processAITurn(nextFaction), 500);
    }
  }

  function processProposalsForHuman(faction) {
    const proposals = currentGame.diplomacy.getProposalsFor(faction.id);
    if (!proposals || proposals.length === 0) return;

    // Process one at a time via modal
    let idx = 0;
    function showNext() {
      if (idx >= proposals.length) return;
      const p = proposals[idx];
      const from = currentGame.getFaction(p.from);
      if (!from || !from.alive) {
        currentGame.diplomacy.rejectProposal(p);
        idx++;
        showNext();
        return;
      }
      currentUI.showProposalDialog(p, from);
      idx++;
    }
    showNext();
  }

  /* ═════════════════════ AI TURN PROCESSING ═════════════════════ */

  function processAITurn(faction) {
    if (!currentGame || currentGame.state !== 'playing' || !faction.alive) {
      aiProcessing = false;
      if (currentUI) currentUI.updateAll();
      return;
    }

    currentUI.showAITurnIndicator(faction);
    currentUI.updateTurnInfo();

    setTimeout(() => {
      if (currentGame.state !== 'playing') { aiProcessing = false; return; }

      const turnResult = window.AIPlayer.takeTurn(currentGame, faction);

      // Show result
      if (turnResult.result && turnResult.result.success) {
        let type = 'info';
        if (turnResult.action === 'attack') type = turnResult.result.conquered ? 'success' : 'warning';
        currentUI.showNotification(turnResult.result.message, type);
      }

      currentUI.updateAll();

      // Check victory
      const v = currentGame.checkVictory();
      if (v.ended) {
        currentGame.state  = 'ended';
        currentGame.winner = v.winner;
        currentGame.addEvent(`🏆 ${v.winner.emoji} ${v.winner.name} 승리!`, v.winner.id);
        aiProcessing = false;
        handleVictory(v.winner);
        return;
      }

      // Next turn
      const nextFaction = currentGame.nextTurn();
      if (!nextFaction || currentGame.state !== 'playing') {
        aiProcessing = false;
        currentUI.updateAll();
        return;
      }

      currentUI.updateAll();

      if (nextFaction.isAI) {
        // Chain AI
        setTimeout(() => processAITurn(nextFaction), 550);
      } else {
        // Human turn
        aiProcessing = false;
        processProposalsForHuman(nextFaction);
        currentUI.updateAll();
        currentUI.showNotification(`${nextFaction.emoji} ${nextFaction.name}의 차례입니다!`, 'info');
      }
    }, 450);
  }

  /* ═════════════════════ VICTORY ═════════════════════ */

  function handleVictory(winner) {
    setTimeout(() => {
      showScreen('screen-result');

      // Use the actual HTML element IDs from index.html
      const titleEl    = document.getElementById('result-title');
      const subtitleEl = document.getElementById('result-subtitle');
      const statsEl    = document.getElementById('result-stats');

      if (titleEl) {
        titleEl.textContent = `${winner.emoji} ${winner.name} 승리!`;
        titleEl.style.webkitTextFillColor = winner.color;
      }
      if (subtitleEl) {
        subtitleEl.textContent = `${winner.name}이(가) 세계를 정복했습니다!`;
      }

      if (statsEl) {
        const totalHex = currentGame.map.getTotalHexCount();
        const pct = Math.round(winner.territories.size / totalHex * 100);

        statsEl.innerHTML = `
          <div class="result-stat-card">
            <span class="result-stat-icon">🏰</span>
            <span class="result-stat-value">${currentGame.turnNumber}</span>
            <span class="result-stat-label">총 턴 수</span>
          </div>
          <div class="result-stat-card">
            <span class="result-stat-icon">🗺️</span>
            <span class="result-stat-value">${winner.territories.size}/${totalHex}</span>
            <span class="result-stat-label">점령 영토 (${pct}%)</span>
          </div>
          <div class="result-stat-card">
            <span class="result-stat-icon">⚔️</span>
            <span class="result-stat-value">${winner.calculateMilitary()}</span>
            <span class="result-stat-label">군사력</span>
          </div>
          <div class="result-stat-card">
            <span class="result-stat-icon">💰</span>
            <span class="result-stat-value">${winner.gold}</span>
            <span class="result-stat-label">골드</span>
          </div>
          <div class="result-stat-card">
            <span class="result-stat-icon">🔬</span>
            <span class="result-stat-value">${winner.getTotalTechLevel()}</span>
            <span class="result-stat-label">기술 레벨</span>
          </div>
          <div class="result-stat-card">
            <span class="result-stat-icon">👥</span>
            <span class="result-stat-value">${currentGame.getAliveFactions().length}/${currentGame.factions.length}</span>
            <span class="result-stat-label">생존 세력</span>
          </div>
        `;
      }

      initConfetti();
    }, 600);
  }

  /* ═════════════════════ CONFETTI ═════════════════════ */

  function initConfetti() {
    const canvas = document.getElementById('result-confetti');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();

    const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#6b5ce7', '#ff9f43', '#54a0ff', '#ff78c5', '#a0ff54'];
    const pieces = [];
    const COUNT = 120;

    for (let i = 0; i < COUNT; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        w: Math.random() * 10 + 5,
        h: Math.random() * 6 + 3,
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 3 + 2,
        rot: Math.random() * 360,
        rotV: (Math.random() - 0.5) * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.5
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of pieces) {
        p.x   += p.vx;
        p.y   += p.vy;
        p.rot += p.rotV;
        p.vy  += 0.02;   // gravity

        if (p.y > canvas.height + 20) {
          p.y  = -20;
          p.x  = Math.random() * canvas.width;
          p.vy = Math.random() * 3 + 2;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot * Math.PI / 180);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle   = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }

      confettiAnim = requestAnimationFrame(draw);
    }
    draw();
  }

})();
