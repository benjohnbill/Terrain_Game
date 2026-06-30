/* ============================================================
 *  actions.js — ActionSystem (static methods for all 6 actions)
 *  Depends on: BUILDINGS, TECH_TREE, Faction, HexCell, HexMap,
 *              DiplomacySystem (all on window)
 * ============================================================ */

window.ActionSystem = class ActionSystem {

  /* ─────────────────────────── helpers ─────────────────────────── */

  /** Check whether any hex owned by `factionId` is adjacent to (q, r) */
  static _isAdjacentToFaction(game, factionId, q, r) {
    const neighbors = game.map.getNeighbors(q, r);
    return neighbors.some(n => {
      const h = game.map.getHex(n.q, n.r);
      return h && h.owner === factionId;
    });
  }

  /* ──────────────────────── 0. SCOUT ──────────────────────── */

  /** Gold cost of one scout action — cheap relative to attack so information
   *  is an affordable alternative to committing force. */
  static _scoutCost(faction) {
    return Math.max(1, Math.ceil(faction.calculateIncome() * 0.1));
  }

  /**
   * Scout an adjacent enemy/neutral hex to raise its information confidence.
   * @param {Game}    game
   * @param {Faction} faction
   * @param {HexCell} targetHex
   * @returns {{success:boolean, message:string, scoutCost?:number,
   *            confidenceBefore?:number, confidenceAfter?:number, intel?:object}}
   */
  static scout(game, faction, targetHex) {
    if (!targetHex) {
      return { success: false, message: '대상 지역이 없습니다.' };
    }
    if (targetHex.owner === faction.id) {
      return { success: false, message: '자신의 영토는 정찰할 필요가 없습니다.' };
    }
    if (!ActionSystem._isAdjacentToFaction(game, faction.id, targetHex.q, targetHex.r)) {
      return { success: false, message: '인접한 지역만 정찰할 수 있습니다.' };
    }

    const cost = ActionSystem._scoutCost(faction);
    if (!faction.canAfford(cost)) {
      return { success: false, message: `정찰 비용이 부족합니다. (필요: 💰${cost}, 보유: 💰${faction.gold})` };
    }
    faction.spend(cost);

    const before = targetHex.informationConfidence;
    const after = window.IntelSystem.applyScout(before);
    targetHex.informationConfidence = after;

    const name = targetHex.provinceName || targetHex.key();
    return {
      success: true,
      message: `${faction.emoji} ${faction.name}이(가) ${name} 지역을 정찰했습니다. (정보 신뢰도 ${Math.round(before * 100)}% → ${Math.round(after * 100)}%)`,
      scoutCost: cost,
      confidenceBefore: before,
      confidenceAfter: after,
      intel: window.IntelSystem.tierOf(after)
    };
  }

  /* ──────────────────────── 1. ATTACK ──────────────────────── */

  /**
   * @param {Game}    game
   * @param {Faction} attacker
   * @param {HexCell} targetHex
   * @param {object}  [opts]  { mobilize?: boolean }
   */
  static attack(game, attacker, targetHex, opts) {
    const o = opts || {};
    const hexKey = targetHex.key();

    /* ── validation ── */
    if (targetHex.owner === attacker.id) {
      return { success: false, message: '자신의 영토는 공격할 수 없습니다.', conquered: false, attackRoll: 0, defenseRoll: 0 };
    }

    // Ally check
    if (targetHex.owner !== null && game.diplomacy.isAlly(attacker.id, targetHex.owner)) {
      return { success: false, message: '동맹국은 공격할 수 없습니다.', conquered: false, attackRoll: 0, defenseRoll: 0 };
    }

    // Adjacency check
    if (!ActionSystem._isAdjacentToFaction(game, attacker.id, targetHex.q, targetHex.r)) {
      return { success: false, message: '인접한 영토만 공격할 수 있습니다.', conquered: false, attackRoll: 0, defenseRoll: 0 };
    }

    if (attacker.military <= 0) {
      return { success: false, message: '상비군이 부족합니다.', conquered: false, attackRoll: 0, defenseRoll: 0 };
    }

    /* ── attack cost (gold) ── */
    const attackCost = Math.max(1, Math.ceil(attacker.calculateIncome() * attacker.getTaxAttackCostRate()));
    if (!attacker.canAfford(attackCost)) {
      return { success: false, message: `공격 비용이 부족합니다. (필요: 💰${attackCost}, 보유: 💰${attacker.gold})`, conquered: false, attackRoll: 0, defenseRoll: 0 };
    }
    attacker.spend(attackCost);

    if (targetHex.owner !== null && !game.diplomacy.isAtWar(attacker.id, targetHex.owner)) {
      game.diplomacy.declareWar(attacker.id, targetHex.owner);
      game.diplomacy.penalizeWarStarter(attacker.id, targetHex.owner, game.factions.length);
      const defenderFaction = game.getFaction(targetHex.owner);
      if (defenderFaction) {
        game.addEvent(`⚠️ ${attacker.emoji} ${attacker.name}이(가) ${defenderFaction.emoji} ${defenderFaction.name} 침공으로 전쟁을 시작했습니다. 다른 국가들의 외교 점수가 하락했습니다.`, attacker.id);
      }
    }

    /* ── offensive mobilization (ADR 0009): optional, drawn from population ── */
    let mobilizedTroops = 0;
    let pendingCapacityCost = null;
    if (o.mobilize) {
      const levy = Math.floor(attacker.population * 0.1);
      mobilizedTroops = attacker.drawMobilization(levy);
      if (mobilizedTroops > 0) {
        // Future-capacity cost is recorded as a hook; capacity consumption lands in slice 5.
        pendingCapacityCost = { capacity: 'command', amount: mobilizedTroops };
      }
    }

    const portMitigation = ActionSystem._hasPortMitigation(game, attacker.id, targetHex);
    const attackForce = window.CombatSystem.computeAttackForce(
      attacker, targetHex, { mobilizedTroops, portMitigation }
    );

    let defender = targetHex.owner === null ? null : game.getFaction(targetHex.owner);
    if (defender && !defender.alive) defender = null;
    let defenseForce = window.CombatSystem.computeDefenseForce(targetHex, defender);

    // Walls are included in computeDefenseForce; military tech 3 can negate that bonus.
    if (targetHex.building === 'wall' && attacker.canIgnoreWalls()) {
      const wallDef = window.BUILDINGS.wall.effects.defenseBonus || 0;
      defenseForce = Math.max(1, defenseForce - wallDef);
    }

    const outcome = window.CombatSystem.resolve(attackForce, defenseForce, game.rng);
    const attackRoll = outcome.attackRoll;
    const defenseRoll = outcome.defenseRoll;
    const conquered = outcome.attackerWins;
    let message = '';
    let tributePaid = 0;

    if (conquered) {
      const militaryLoss = Math.max(3, Math.round(defenseForce * 0.3));
      attacker.military = Math.max(0, attacker.military - militaryLoss);

      if (defender) {
        targetHex.localGarrison = 0;
        defender.military = Math.max(0, defender.military - Math.max(2, Math.round(attackForce * 0.1)));
        defender.removeTerritory(hexKey);
        defender.checkAlive();

        if (!defender.alive) {
          message = `${attacker.emoji} ${attacker.name}이(가) ${defender.emoji} ${defender.name}의 마지막 영토를 정복! ${defender.name} 멸망!`;
        } else {
          message = `${attacker.emoji} ${attacker.name}이(가) ${defender.emoji} ${defender.name}의 영토를 정복! (⚔${attackRoll} vs 🛡${defenseRoll})`;
        }
      } else {
        message = `${attacker.emoji} ${attacker.name}이(가) 중립 영토를 정복! (⚔${attackRoll} vs 🛡${defenseRoll})`;
      }

      targetHex.owner = attacker.id;
      attacker.addTerritory(hexKey);
      targetHex.localGarrison = Math.max(2, Math.round(targetHex.defenseValue * 0.2));

      if (targetHex.building === 'wall') {
        targetHex.building = null;
        if (defender) defender.buildings.delete(hexKey);
      }

    } else {
      const militaryLoss = Math.max(5, Math.round(attackForce * 0.35));
      attacker.military = Math.max(0, attacker.military - militaryLoss);
      if (mobilizedTroops > 0) {
        attacker.population = Math.max(0, attacker.population - Math.round(mobilizedTroops * 0.5));
      }

      if (defender) {
        targetHex.localGarrison = Math.max(0, targetHex.localGarrison - Math.max(1, Math.round(attackForce * 0.05)));
        const tribute = Math.max(1, Math.round(attacker.calculateIncome() * 0.4));
        const paidTribute = Math.min(attacker.gold, tribute);
        attacker.gold -= paidTribute;
        defender.gold += paidTribute;
        tributePaid = paidTribute;
        message = `${attacker.emoji} ${attacker.name}의 공격 실패! ${defender.emoji} ${defender.name}이(가) 방어 성공! (⚔${attackRoll} vs 🛡${defenseRoll})`;
      } else {
        message = `${attacker.emoji} ${attacker.name}의 중립 영토 공격 실패! (⚔${attackRoll} vs 🛡${defenseRoll})`;
      }
    }

    if (tributePaid > 0) {
      message += ` 침략 실패로 💰${tributePaid}을(를) 상납했습니다.`;
    }

    return {
      success: true, message, conquered,
      attackForce, defenseForce, attackRoll, defenseRoll,
      attackCost, tributePaid, mobilizedTroops, pendingCapacityCost
    };
  }

  /** True when a port settlement can mitigate an amphibious crossing penalty. */
  static _hasPortMitigation(game, factionId, targetHex) {
    if (targetHex.primaryFunction === 'port') return true;
    const neighbors = game.map.getNeighbors(targetHex.q, targetHex.r);
    return neighbors.some(n => {
      const h = game.map.getHex(n.q, n.r);
      return h && h.owner === factionId && h.primaryFunction === 'port';
    });
  }

  /* ──────────────────────── 2. DEFEND ──────────────────────── */

  /**
   * @param {Game}    game
   * @param {Faction} faction
   * @param {HexCell} targetHex
   * @returns {{success:boolean, message:string}}
   */
  static defend(game, faction, targetHex) {
    const hexKey = targetHex.key();

    if (targetHex.owner !== faction.id) {
      return { success: false, message: '자신의 영토만 방어할 수 있습니다.' };
    }

    faction.isDefending  = true;
    faction.defendingHex = hexKey;

    return {
      success: true,
      message: `${faction.emoji} ${faction.name}이(가) 영토 [${hexKey}]에 방어 태세! (다음 턴까지 방어력 +50%)`
    };
  }

  /* ──────────────────────── 3. DIPLOMACY ──────────────────────── */

  /**
   * @param {Game}    game
   * @param {Faction} faction
   * @param {Faction} targetFaction
   * @param {string}  actionType  'propose_alliance'|'propose_peace'|'declare_war'|'break_alliance'
   * @returns {{success:boolean, message:string}}
   */
  static diplomacy(game, faction, targetFaction, actionType) {
    if (!targetFaction || !targetFaction.alive) {
      return { success: false, message: '대상 세력이 존재하지 않습니다.' };
    }
    if (faction.id === targetFaction.id) {
      return { success: false, message: '자기 자신과 외교할 수 없습니다.' };
    }

    switch (actionType) {
      case 'propose_alliance': {
        if (game.diplomacy.isAlly(faction.id, targetFaction.id)) {
          return { success: false, message: '이미 동맹 관계입니다.' };
        }
        if (game.diplomacy.isAtWar(faction.id, targetFaction.id)) {
          return { success: false, message: '전쟁 중에는 동맹을 제안할 수 없습니다. 먼저 평화를 제안하세요.' };
        }
        game.diplomacy.proposeAlliance(faction.id, targetFaction.id);
        return {
          success: true,
          message: `${faction.emoji} ${faction.name}이(가) ${targetFaction.emoji} ${targetFaction.name}에게 동맹을 제안했습니다.`
        };
      }

      case 'propose_peace': {
        if (!game.diplomacy.isAtWar(faction.id, targetFaction.id)) {
          return { success: false, message: '전쟁 중이 아닙니다.' };
        }
        game.diplomacy.proposePeace(faction.id, targetFaction.id);
        return {
          success: true,
          message: `${faction.emoji} ${faction.name}이(가) ${targetFaction.emoji} ${targetFaction.name}에게 평화를 제안했습니다.`
        };
      }

      case 'declare_war': {
        if (game.diplomacy.isAtWar(faction.id, targetFaction.id)) {
          return { success: false, message: '이미 전쟁 중입니다.' };
        }
        // Breaking an alliance first if allied
        if (game.diplomacy.isAlly(faction.id, targetFaction.id)) {
          game.diplomacy.breakAlliance(faction.id, targetFaction.id);
        }
        game.diplomacy.declareWar(faction.id, targetFaction.id);
        game.diplomacy.penalizeWarStarter(faction.id, targetFaction.id, game.factions.length);
        return {
          success: true,
          message: `⚔️ ${faction.emoji} ${faction.name}이(가) ${targetFaction.emoji} ${targetFaction.name}에게 선전포고!`
        };
      }

      case 'break_alliance': {
        if (!game.diplomacy.isAlly(faction.id, targetFaction.id)) {
          return { success: false, message: '동맹 관계가 아닙니다.' };
        }
        game.diplomacy.breakAlliance(faction.id, targetFaction.id);
        return {
          success: true,
          message: `${faction.emoji} ${faction.name}이(가) ${targetFaction.emoji} ${targetFaction.name}과(와)의 동맹을 파기했습니다.`
        };
      }

      default:
        return { success: false, message: '알 수 없는 외교 행동입니다.' };
    }
  }

  /* ──────────────────────── 4. TAX ──────────────────────── */

  /**
   * @param {Game}    game
   * @param {Faction} faction
   * @returns {{success:boolean, message:string, goldGained:number, popLost:number}}
   */
  static tax(game, faction) {
    const baseIncome = faction.calculateIncome();
    const extraGold  = Math.round(baseIncome * 0.3);

    if (extraGold <= 0) {
      return { success: false, message: '수입이 없어 세금을 걷을 수 없습니다.', goldGained: 0, popLost: 0 };
    }

    faction.gold += extraGold;

    // 5% chance per territory to lose population
    let popLost = 0;
    const allHexes = game.map.getAllHexes();
    allHexes.forEach((hex) => {
      if (hex.owner === faction.id && Math.random() < 0.05) {
        const loss = Math.floor(Math.random() * 3) + 1; // 1-3
        hex.population = Math.max(5, hex.population - loss);
        popLost += loss;
      }
    });

    let message = `${faction.emoji} ${faction.name}이(가) 특별 세금으로 💰${extraGold} 획득!`;
    if (popLost > 0) {
      message += ` (민심 악화로 인구 ${popLost} 감소)`;
    }

    return { success: true, message, goldGained: extraGold, popLost };
  }

  /* ──────────────────────── 5. BUILD ──────────────────────── */

  /**
   * @param {Game}    game
   * @param {Faction} faction
   * @param {HexCell} targetHex
   * @param {string}  buildingType  key from BUILDINGS
   * @returns {{success:boolean, message:string}}
   */
  static build(game, faction, targetHex, buildingType) {
    const hexKey = targetHex.key();

    if (targetHex.owner !== faction.id) {
      return { success: false, message: '자신의 영토에만 건설할 수 있습니다.' };
    }
    if (targetHex.building) {
      return { success: false, message: '이미 건물이 있는 영토입니다.' };
    }

    const buildingDef = window.BUILDINGS[buildingType];
    if (!buildingDef) {
      return { success: false, message: '존재하지 않는 건물입니다.' };
    }
    if (!faction.canAfford(buildingDef.cost)) {
      return { success: false, message: `골드가 부족합니다. (필요: 💰${buildingDef.cost}, 보유: 💰${faction.gold})` };
    }

    faction.spend(buildingDef.cost);
    targetHex.building = buildingType;
    faction.buildings.set(hexKey, buildingType);

    return {
      success: true,
      message: `${faction.emoji} ${faction.name}이(가) [${hexKey}]에 ${buildingDef.icon} ${buildingDef.name} 건설! (💰${buildingDef.cost})`
    };
  }

  /* ──────────────────────── 6. RESEARCH ──────────────────────── */

  /**
   * @param {Game}    game
   * @param {Faction} faction
   * @param {string}  techCategory  'military'|'economy'|'diplomacy'
   * @returns {{success:boolean, message:string, techName?:string, techLevel?:number}}
   */
  static research(game, faction, techCategory) {
    const tree = window.TECH_TREE[techCategory];
    if (!tree) {
      return { success: false, message: '존재하지 않는 기술 분야입니다.' };
    }

    const currentLevel = faction.techs[techCategory] || 0;
    if (currentLevel >= tree.levels.length) {
      return { success: false, message: `${tree.name} 기술이 이미 최대 레벨입니다.` };
    }

    const nextTech = tree.levels[currentLevel];
    if (!faction.canAfford(nextTech.cost)) {
      return { success: false, message: `골드가 부족합니다. (필요: 💰${nextTech.cost}, 보유: 💰${faction.gold})` };
    }

    faction.spend(nextTech.cost);
    faction.techs[techCategory] = currentLevel + 1;

    return {
      success: true,
      message: `${faction.emoji} ${faction.name}이(가) ${tree.icon} ${nextTech.name} 연구 완료! (Lv.${currentLevel + 1})`,
      techName: nextTech.name,
      techLevel: currentLevel + 1
    };
  }
};
