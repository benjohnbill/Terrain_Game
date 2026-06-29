/* ============================================================
 *  game.js — Game class (core game-state manager)
 *  Depends on: Faction, FACTION_DATA, HexMap, DiplomacySystem,
 *              ActionSystem (all on window)
 * ============================================================ */

window.Game = class Game {

  /**
   * @param {{mode:string, factionCount:number, playerCount:number}} config
   */
  constructor(config) {
    this.config          = config;
    this.factions         = [];
    this.map              = null;
    this.diplomacy        = null;
    this.currentTurnIndex = 0;
    this.turnNumber       = 1;
    this.eventLog         = [];
    this.state            = 'playing';   // 'playing' | 'ended'
    this.winner           = null;
    this.selectedHex      = null;        // hex key string
    this.selectedAction   = null;        // action name string
    this.phase            = 'select_action'; // 'select_action' | 'select_target' | 'ai_turn'
    this.crisisTurnsHandled = new Set();

    // Callbacks – set by main.js
    this.onUpdate         = null;        // () => void
    this.onAITurn         = null;        // (faction) => void
    this.onVictory        = null;        // (winner) => void
    this.onNotification   = null;        // (message, type) => void
    this.onBattleResult   = null;        // (result) => void
    this.onShowDiplomacy  = null;        // () => void
    this.onShowBuild      = null;        // (hex) => void
    this.onShowTech       = null;        // () => void
    this.onShowProposal   = null;        // (proposal, fromFaction) => void
    this.onCrisis         = null;        // (event) => void
  }

  /* ──────────────────── initialisation ──────────────────── */

  init(canvas) {
    const data = window.FACTION_DATA;
    const count = Math.min(this.config.factionCount, data.length);

    // Create factions — Faction constructor expects (dataObj, isAI)
    for (let i = 0; i < count; i++) {
      let isAI;
      if (this.config.mode === 'singleplayer') {
        isAI = i !== 0;                         // only faction 0 is human
      } else {
        isAI = i >= this.config.playerCount;    // first N are human
      }
      const f = new window.Faction(data[i], isAI);
      this.factions.push(f);
    }

    // Create map
    this.map = new window.HexMap(canvas);
    this.map.generate(count, { phase1Active: true });

    // Assign starting territories to faction objects
    this.map.getAllHexes().forEach((hex) => {
      if (hex.owner !== null && hex.owner < this.factions.length) {
        this.factions[hex.owner].addTerritory(hex.key());
      }
    });

    // Create diplomacy
    this.diplomacy = new window.DiplomacySystem();
    this.diplomacy.init(count);

    // First turn
    this._startRound();

    this.addEvent('🏁 게임 시작! 세계를 정복하라!', null);
  }

  /* ──────────────────── getters ──────────────────── */

  getCurrentFaction() {
    return this.factions[this.currentTurnIndex];
  }

  getAliveFactions() {
    return this.factions.filter(f => f.alive);
  }

  getFaction(id) {
    return this.factions.find(f => f.id === id);
  }

  /* ──────────────────── event log ──────────────────── */

  addEvent(message, factionId) {
    this.eventLog.unshift({
      message,
      turnNumber: this.turnNumber,
      factionId,
      timestamp: Date.now()
    });
    if (this.eventLog.length > 50) this.eventLog.pop();
  }

  /* ──────────────────── action dispatch ──────────────────── */

  /**
   * Execute a player action.
   * @param {string} action  'attack'|'defend'|'diplomacy'|'tax'|'build'|'research'
   * @param {object} params  action-specific parameters
   * @returns {object} result from ActionSystem
   */
  executeAction(action, params) {
    const faction = this.getCurrentFaction();
    if (this.state !== 'playing') return { success: false, message: '게임이 종료되었습니다.' };
    if (faction.actionTaken)      return { success: false, message: '이미 행동을 수행했습니다.' };

    let result;
    switch (action) {
      case 'attack':
        result = window.ActionSystem.attack(this, faction, params.targetHex);
        break;
      case 'defend':
        result = window.ActionSystem.defend(this, faction, params.targetHex);
        break;
      case 'diplomacy':
        result = window.ActionSystem.diplomacy(this, faction, params.targetFaction, params.actionType);
        break;
      case 'tax':
        result = window.ActionSystem.tax(this, faction);
        break;
      case 'build':
        result = window.ActionSystem.build(this, faction, params.targetHex, params.buildingType);
        break;
      case 'research':
        result = window.ActionSystem.research(this, faction, params.techCategory);
        break;
      default:
        result = { success: false, message: '알 수 없는 행동입니다.' };
    }

    if (result.success) {
      faction.actionTaken = true;
      this.addEvent(result.message, faction.id);
    }

    // Clear selection state
    this.selectedAction = null;
    this.selectedHex    = null;
    this.phase          = 'select_action';
    if (this.map) this.map.clearHighlights();

    // Victory check after action
    this._checkAndHandleVictory();

    return result;
  }

  /* ──────────────────── turn management ──────────────────── */

  /**
   * Advance to the next faction's turn.
   * Returns the new current faction.
   */
  nextTurn() {
    if (this.state !== 'playing') return null;

    // Move to next alive faction
    let safety = this.factions.length + 1;
    do {
      this.currentTurnIndex++;
      if (this.currentTurnIndex >= this.factions.length) {
        this.currentTurnIndex = 0;
        this.turnNumber++;
        this._startRound();
      }
      safety--;
    } while (!this.factions[this.currentTurnIndex].alive && safety > 0);

    const faction = this.getCurrentFaction();
    this.phase = faction.isAI ? 'ai_turn' : 'select_action';
    this.selectedAction = null;
    this.selectedHex    = null;
    if (this.map) this.map.clearHighlights();

    this._maybeTriggerCrisis(faction);

    return faction;
  }

  /** Called once when all factions have cycled – new round */
  _startRound() {
    for (const f of this.factions) {
      if (f.alive) f.startTurn();
    }
  }

  _maybeTriggerCrisis(faction) {
    if (!faction || faction.isAI || !faction.alive) return;
    if (this.turnNumber < 20 || this.turnNumber % 20 !== 0) return;
    const key = `${this.turnNumber}-${faction.id}`;
    if (this.crisisTurnsHandled.has(key)) return;
    this.crisisTurnsHandled.add(key);

    const crisisTypes = [
      { type: 'virus', title: '바이러스 확산', text: '국경 지대에 바이러스가 퍼졌습니다. 빠르게 대응하지 않으면 일부 지역이 통제 밖으로 벗어납니다.' },
      { type: 'split', title: '내부분열', text: '지방 귀족과 장군들이 중앙 정부에 반발하고 있습니다. 대응에 실패하면 독립 세력이 생깁니다.' }
    ];
    const crisis = crisisTypes[Math.floor(Math.random() * crisisTypes.length)];
    crisis.factionId = faction.id;
    crisis.turnNumber = this.turnNumber;
    if (this.onCrisis) this.onCrisis(crisis);
  }

  resolveCrisis(crisis, choice) {
    const faction = this.getFaction(crisis.factionId);
    if (!faction || !faction.alive) return { success: false, message: '이벤트 대상 세력이 없습니다.' };

    const options = {
      quarantine: { chance: 0.75, goldCost: Math.ceil(faction.calculateIncome() * 0.45), militaryCost: 0, label: '봉쇄와 치료' },
      mobilize: { chance: 0.65, goldCost: Math.ceil(faction.calculateIncome() * 0.20), militaryCost: 10, label: '군사 동원' },
      negotiate: { chance: 0.55, goldCost: Math.ceil(faction.calculateIncome() * 0.15), militaryCost: 0, label: '회유와 협상' }
    };
    const opt = options[choice] || options.quarantine;

    const paidGold = Math.min(faction.gold, opt.goldCost);
    faction.gold -= paidGold;
    faction.military = Math.max(0, faction.military - opt.militaryCost);

    const success = Math.random() < opt.chance;
    if (success) {
      const msg = `${faction.emoji} ${faction.name}이(가) ${crisis.title} 위기를 ${opt.label}(으)로 진정시켰습니다.`;
      this.addEvent(msg, faction.id);
      if (this.onUpdate) this.onUpdate();
      return { success: true, message: msg };
    }

    const lost = this.spawnThirdPartyFromFaction(faction, crisis.type === 'split' ? 3 : 2);
    const msg = `${faction.emoji} ${faction.name}이(가) ${crisis.title} 대응에 실패했습니다. ${lost.name}이(가) ${lost.count}개 영토에서 독립했습니다.`;
    this.addEvent(msg, faction.id);
    this._checkAndHandleVictory();
    if (this.onUpdate) this.onUpdate();
    return { success: false, message: msg };
  }

  spawnThirdPartyFromFaction(sourceFaction, maxCount) {
    const keys = Array.from(sourceFaction.territories);
    const count = Math.min(keys.length - 1, Math.max(1, maxCount));
    if (count <= 0) {
      return { name: '소규모 반란군', count: 0 };
    }

    const newId = this.factions.length;
    const colors = ['#14b8a6', '#f43f5e', '#84cc16', '#06b6d4', '#eab308'];
    const data = {
      id: newId,
      name: `제3세력 ${newId + 1}`,
      color: colors[newId % colors.length],
      colorLight: colors[newId % colors.length],
      emoji: '⚑'
    };
    const rebel = new window.Faction(data, true);
    rebel.gold = Math.max(40, Math.floor(sourceFaction.gold * 0.25));
    rebel.military = Math.max(25, Math.floor(sourceFaction.military * 0.35));

    const shuffled = keys.sort(() => Math.random() - 0.5).slice(0, count);
    for (const key of shuffled) {
      const hex = this.map.getHexByKey(key);
      if (!hex) continue;
      sourceFaction.removeTerritory(key);
      hex.owner = rebel.id;
      rebel.addTerritory(key);
      if (hex.building) rebel.buildings.set(key, hex.building);
    }
    sourceFaction.checkAlive();
    this.factions.push(rebel);
    this.diplomacy.addFaction(rebel.id, this.factions.length);
    return { name: rebel.name, count: rebel.territories.size };
  }

  /* ──────────────────── victory ──────────────────── */

  checkVictory() {
    const alive   = this.getAliveFactions();
    const totalHex = this.map.getTotalHexCount();

    // Win condition 1: only one faction alive
    if (alive.length === 1) {
      return { ended: true, winner: alive[0] };
    }

    // Win condition 2: 70%+ hex control
    for (const f of alive) {
      if (f.territories.size >= Math.ceil(totalHex * 0.7)) {
        return { ended: true, winner: f };
      }
    }

    return { ended: false, winner: null };
  }

  _checkAndHandleVictory() {
    const v = this.checkVictory();
    if (v.ended) {
      this.state  = 'ended';
      this.winner = v.winner;
      this.addEvent(`🏆 ${v.winner.emoji} ${v.winner.name} 승리!`, v.winner.id);
      if (this.onVictory) this.onVictory(v.winner);
    }
  }

  /* ──────────────────── action selection (UI) ──────────────────── */

  selectAction(action) {
    if (this.state !== 'playing') return;
    const faction = this.getCurrentFaction();
    if (faction.isAI || faction.actionTaken) return;

    this.selectedAction = action;

    switch (action) {
      case 'attack': {
        this.phase = 'select_target';
        // getAdjacentEnemyHexes returns HexCell objects; extract keys and filter allies
        const adjacentEnemy = this.map.getAdjacentEnemyHexes(faction.id);
        const attackableKeys = adjacentEnemy
          .filter(hex => hex.owner === null || !this.diplomacy.isAlly(faction.id, hex.owner))
          .map(hex => hex.key());
        this.map.setHighlightedHexes(attackableKeys, 'rgba(255,60,60,0.45)');
        break;
      }
      case 'defend': {
        this.phase = 'select_target';
        const ownKeys = Array.from(faction.territories);
        this.map.setHighlightedHexes(ownKeys, 'rgba(60,130,255,0.45)');
        break;
      }
      case 'build': {
        this.phase = 'select_target';
        const buildable = Array.from(faction.territories).filter(key => {
          const h = this.map.getHexByKey(key);
          return h && !h.building;
        });
        this.map.setHighlightedHexes(buildable, 'rgba(60,220,120,0.45)');
        break;
      }
      case 'diplomacy':
        this.phase = 'select_action';
        if (this.onShowDiplomacy) this.onShowDiplomacy();
        break;
      case 'tax': {
        const result = this.executeAction('tax', {});
        if (this.onNotification) {
          this.onNotification(result.message, result.success ? 'success' : 'warning');
        }
        if (this.onUpdate) this.onUpdate();
        break;
      }
      case 'research':
        this.phase = 'select_action';
        if (this.onShowTech) this.onShowTech();
        break;
    }
  }

  cancelAction() {
    this.selectedAction = null;
    this.phase          = 'select_action';
    if (this.map) this.map.clearHighlights();
  }

  /* ──────────────────── hex click ──────────────────── */

  handleHexClick(hex) {
    if (!hex || this.state !== 'playing') return;
    const faction = this.getCurrentFaction();
    if (faction.isAI) return;

    if (this.phase === 'select_target' && this.selectedAction) {
      // Use hex as target
      switch (this.selectedAction) {
        case 'attack': {
          const result = this.executeAction('attack', { targetHex: hex });
          if (result.success) {
            if (this.onBattleResult) this.onBattleResult(result);
          } else {
            if (this.onNotification) this.onNotification(result.message, 'warning');
          }
          break;
        }
        case 'defend': {
          const result = this.executeAction('defend', { targetHex: hex });
          if (this.onNotification) {
            this.onNotification(result.message, result.success ? 'success' : 'warning');
          }
          break;
        }
        case 'build': {
          if (hex.owner !== faction.id) {
            if (this.onNotification) this.onNotification('자신의 영토에만 건설할 수 있습니다.', 'warning');
            return;               // don't clear – let them pick again
          }
          if (hex.building) {
            if (this.onNotification) this.onNotification('이미 건물이 있는 영토입니다.', 'warning');
            return;
          }
          if (this.onShowBuild) this.onShowBuild(hex);
          return;                 // modal will handle from here
        }
      }
      if (this.onUpdate) this.onUpdate();
    } else {
      // Just select for info
      this.selectedHex = hex.key();
      if (this.map) this.map.setSelectedHex(hex.key());
      if (this.onUpdate) this.onUpdate();
    }
  }
};
