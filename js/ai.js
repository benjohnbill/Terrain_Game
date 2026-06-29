/* ============================================================
 *  ai.js — AIPlayer (static AI decision-making)
 *  Depends on: ActionSystem, Game, Faction, HexMap,
 *              DiplomacySystem, BUILDINGS, TECH_TREE (all on window)
 * ============================================================ */

window.AIPlayer = class AIPlayer {

  /* ────────────────── public entry point ────────────────── */

  /**
   * Take the best action for an AI faction.
   * @param {Game}    game
   * @param {Faction} faction
   * @returns {{action:string, params:object, result:object}}
   */
  static takeTurn(game, faction) {
    // 0. Handle any incoming diplomatic proposals first (does not consume action)
    AIPlayer.handleProposals(game, faction);

    // 1. Evaluate threats
    const threat = AIPlayer.evaluateThreats(game, faction);

    // High threat – consider diplomacy or defend
    if (threat >= 65) {
      // Try to form alliance with a strong neutral faction
      const dipResult = AIPlayer._tryDiplomacy(game, faction, threat);
      if (dipResult) return dipResult;

      // If threat is extreme, defend the most vulnerable border hex
      if (threat >= 80) {
        const defResult = AIPlayer._tryDefend(game, faction);
        if (defResult) return defResult;
      }
    }

    // 2. Strong military advantage → attack weakest neighbour
    if (faction.calculateMilitary() > 18 && faction.gold >= Math.max(1, Math.ceil(faction.calculateIncome() * faction.getTaxAttackCostRate()))) {
      const target = AIPlayer.chooseBestTarget(game, faction);
      if (target) {
        const result = window.ActionSystem.attack(game, faction, target);
        if (result.success) {
          game.addEvent(result.message, faction.id);
          faction.actionTaken = true;
          return { action: 'attack', params: { targetHex: target }, result };
        }
      }
    }

    // 3. If can build, build something useful (40 % chance to prioritise)
    if (Math.random() < 0.25) {
      const buildInfo = AIPlayer.chooseBuild(game, faction);
      if (buildInfo) {
        const result = window.ActionSystem.build(game, faction, buildInfo.hex, buildInfo.buildingType);
        if (result.success) {
          game.addEvent(result.message, faction.id);
          faction.actionTaken = true;
          return { action: 'build', params: { targetHex: buildInfo.hex, buildingType: buildInfo.buildingType }, result };
        }
      }
    }

    // 4. Consider research (30 % chance to prioritise)
    if (Math.random() < 0.25) {
      const techCat = AIPlayer.chooseResearch(game, faction);
      if (techCat) {
        const result = window.ActionSystem.research(game, faction, techCat);
        if (result.success) {
          game.addEvent(result.message, faction.id);
          faction.actionTaken = true;
          return { action: 'research', params: { techCategory: techCat }, result };
        }
      }
    }

    // 5. Low gold → taxes
    if (faction.gold < 30) {
      const result = window.ActionSystem.tax(game, faction);
      if (result.success) {
        game.addEvent(result.message, faction.id);
        faction.actionTaken = true;
        return { action: 'tax', params: {}, result };
      }
    }

    // 6. Default: try to attack neutral / weak territory to expand
    const target = AIPlayer.chooseBestTarget(game, faction);
    if (target) {
      const result = window.ActionSystem.attack(game, faction, target);
      if (result.success) {
        game.addEvent(result.message, faction.id);
        faction.actionTaken = true;
        return { action: 'attack', params: { targetHex: target }, result };
      }
    }

    // 7. Fallback chain: build → research → tax → defend
    const buildInfo = AIPlayer.chooseBuild(game, faction);
    if (buildInfo) {
      const result = window.ActionSystem.build(game, faction, buildInfo.hex, buildInfo.buildingType);
      if (result.success) {
        game.addEvent(result.message, faction.id);
        faction.actionTaken = true;
        return { action: 'build', params: { targetHex: buildInfo.hex, buildingType: buildInfo.buildingType }, result };
      }
    }

    const techCat = AIPlayer.chooseResearch(game, faction);
    if (techCat) {
      const result = window.ActionSystem.research(game, faction, techCat);
      if (result.success) {
        game.addEvent(result.message, faction.id);
        faction.actionTaken = true;
        return { action: 'research', params: { techCategory: techCat }, result };
      }
    }

    // Tax as last resort
    {
      const result = window.ActionSystem.tax(game, faction);
      if (result.success) {
        game.addEvent(result.message, faction.id);
        faction.actionTaken = true;
        return { action: 'tax', params: {}, result };
      }
    }

    // Absolute fallback – defend random own hex
    const defResult = AIPlayer._tryDefend(game, faction);
    if (defResult) return defResult;

    // Nothing possible (shouldn't happen)
    faction.actionTaken = true;
    return { action: 'none', params: {}, result: { success: false, message: '가능한 행동이 없습니다.' } };
  }

  /* ────────────────── threat evaluation ────────────────── */

  static evaluateThreats(game, faction) {
    const adjEnemy = game.map.getAdjacentEnemyHexes(faction.id);
    if (adjEnemy.length === 0) return 0;

    let maxEnemyMil = 0;
    const enemyFactionIds = new Set();

    for (const item of adjEnemy) {
      const h = typeof item === 'string' ? game.map.getHexByKey(item) : item;
      if (h && h.owner !== null && h.owner !== faction.id) {
        enemyFactionIds.add(h.owner);
      }
    }

    for (const eid of enemyFactionIds) {
      const ef = game.getFaction(eid);
      if (ef && ef.alive) {
        const mil = ef.calculateMilitary();
        if (mil > maxEnemyMil) maxEnemyMil = mil;
      }
    }

    const ownMil = faction.calculateMilitary();
    if (ownMil === 0) return 100;

    const ratio = maxEnemyMil / ownMil;  // >1 means enemy stronger
    // Threat curve: ratio 0.5→10, 1→40, 1.5→65, 2→80, 3→95
    let threat = Math.round(Math.min(100, ratio * 40));

    // More border exposure = higher threat
    const borderRatio = adjEnemy.length / Math.max(1, faction.territories.size);
    threat += Math.round(borderRatio * 10);

    // At war = extra threat
    for (const eid of enemyFactionIds) {
      if (game.diplomacy.isAtWar(faction.id, eid)) {
        threat += 15;
        break;
      }
    }

    return Math.min(100, Math.max(0, threat));
  }

  /* ────────────────── target selection ────────────────── */

  static _countOwnAdjacent(game, factionId, hex) {
    const neighbors = game.map.getNeighbors(hex.q, hex.r);
    let ownAdj = 0;
    for (const n of neighbors) {
      const nh = game.map.getHex(n.q, n.r);
      if (nh && nh.owner === factionId) ownAdj++;
    }
    return ownAdj;
  }

  static _hasPortMitigation(game, factionId, hex) {
    if (hex.primaryFunction === 'port') return true;
    const neighbors = game.map.getNeighbors(hex.q, hex.r);
    return neighbors.some((n) => {
      const nh = game.map.getHex(n.q, n.r);
      return nh && nh.owner === factionId && nh.primaryFunction === 'port';
    });
  }

  static scoreTarget(game, faction, hex) {
    if (!hex) return -Infinity;
    if (hex.owner === faction.id) return -Infinity;
    if (hex.owner !== null && game.diplomacy.isAlly(faction.id, hex.owner)) return -Infinity;

    const defender = hex.owner === null ? null : game.getFaction(hex.owner);
    const portMitigation = AIPlayer._hasPortMitigation(game, faction.id, hex);
    const attackForce = window.CombatSystem.computeAttackForce(faction, hex, { portMitigation });
    const defenseForce = window.CombatSystem.computeDefenseForce(hex, defender && defender.alive ? defender : null);
    const forecast = window.CombatSystem.forecast(attackForce, defenseForce);
    const crossingPenalty = window.CombatSystem.crossingPenalty(hex.terrain, portMitigation);
    const ownAdj = AIPlayer._countOwnAdjacent(game, faction.id, hex);

    let score = 50;

    // Local combat outlook is the main term.
    score += forecast.expected * 42;
    score -= defenseForce * 0.65;

    // Valuable provinces are worth taking even when not effortless.
    score += (hex.economyValue || 0) * 1.8;
    score += (hex.population || 0) * 0.35;

    // Better staging positions are safer and strategically cleaner.
    score += ownAdj * 8;

    if (hex.owner === null) {
      score += 20;
    } else if (game.diplomacy.isAtWar(faction.id, hex.owner)) {
      score += 38;
    } else {
      score += 14;
    }

    // Infrastructure is valuable, but walls are already included in defense.
    if (hex.building && hex.building !== 'wall') score += 12;

    // Crossing friction should matter even if the raw ratio is still favorable.
    score -= (1 - crossingPenalty) * 35;

    // Strategic tags are light nudges, not substitutes for local force.
    if (hex.strategicTags && hex.strategicTags.includes('capital')) score += 14;
    if (hex.strategicTags && hex.strategicTags.includes('port')) score += 10;
    if (hex.strategicTags && hex.strategicTags.includes('pass')) score += 6;

    return score;
  }

  static chooseBestTarget(game, faction) {
    const adjEnemy = game.map.getAdjacentEnemyHexes(faction.id);
    if (adjEnemy.length === 0) return null;

    const candidates = [];
    for (const item of adjEnemy) {
      const hex = typeof item === 'string' ? game.map.getHexByKey(item) : item;
      if (!hex) continue;
      const score = AIPlayer.scoreTarget(game, faction, hex) + Math.random() * 12 - 4;
      if (isFinite(score)) candidates.push({ hex, score });
    }

    if (candidates.length === 0) return null;
    candidates.sort((a, b) => b.score - a.score);
    return candidates[0].hex;
  }

  /* ────────────────── diplomacy proposals ────────────────── */

  static handleProposals(game, faction) {
    const proposals = game.diplomacy.getProposalsFor(faction.id);
    if (!proposals || proposals.length === 0) return;

    for (const proposal of proposals) {
      const from = game.getFaction(proposal.from);
      if (!from || !from.alive) {
        game.diplomacy.rejectProposal(proposal);
        continue;
      }

      if (proposal.type === 'alliance') {
        // Accept if from is strong and we're not at war with them
        const fromMil = from.calculateMilitary();
        const ownMil  = faction.calculateMilitary();
        const allies  = game.diplomacy.getAllies(faction.id, game.factions.length);

        // Accept if they are roughly our strength or stronger, and we don't have too many allies
        if (fromMil >= ownMil * 0.5 && allies.length < 2 && Math.random() < 0.65) {
          game.diplomacy.acceptProposal(proposal);
          game.addEvent(`🤝 ${faction.emoji} ${faction.name}이(가) ${from.emoji} ${from.name}의 동맹 제안을 수락!`, faction.id);
        } else {
          game.diplomacy.rejectProposal(proposal);
          game.addEvent(`❌ ${faction.emoji} ${faction.name}이(가) ${from.emoji} ${from.name}의 동맹 제안을 거절.`, faction.id);
        }
      } else if (proposal.type === 'peace') {
        // Accept peace if we're losing the war or random 50 %
        const fromMil = from.calculateMilitary();
        const ownMil  = faction.calculateMilitary();
        if (ownMil < fromMil * 0.8 || Math.random() < 0.45) {
          game.diplomacy.acceptProposal(proposal);
          game.addEvent(`🕊️ ${faction.emoji} ${faction.name}이(가) ${from.emoji} ${from.name}의 평화 제안을 수락!`, faction.id);
        } else {
          game.diplomacy.rejectProposal(proposal);
          game.addEvent(`❌ ${faction.emoji} ${faction.name}이(가) ${from.emoji} ${from.name}의 평화 제안을 거절.`, faction.id);
        }
      }
    }
  }

  /* ────────────────── building choice ────────────────── */

  static chooseBuild(game, faction) {
    if (faction.gold < 20) return null;  // need minimum gold for cheapest building

    const hexKeys = Array.from(faction.territories);
    // Filter to hexes without buildings
    const buildable = hexKeys
      .map(k => game.map.getHexByKey(k))
      .filter(h => h && !h.building);

    if (buildable.length === 0) return null;

    // Separate border and interior hexes
    const border   = [];
    const interior = [];

    for (const hex of buildable) {
      const neighbors = game.map.getNeighbors(hex.q, hex.r);
      let isBorder = false;
      for (const n of neighbors) {
        const nh = game.map.getHex(n.q, n.r);
        if (!nh || nh.owner !== faction.id) { isBorder = true; break; }
      }
      (isBorder ? border : interior).push(hex);
    }

    // Priority: walls on borders, markets on interior, barracks if low military
    const buildings = window.BUILDINGS;

    // Low military → barracks on any hex
    if (faction.military < 20 && faction.canAfford(buildings.barracks.cost)) {
      const target = border.length > 0 ? border[Math.floor(Math.random() * border.length)]
                                        : buildable[Math.floor(Math.random() * buildable.length)];
      return { hex: target, buildingType: 'barracks' };
    }

    // Wall on border hex
    if (border.length > 0 && faction.canAfford(buildings.wall.cost)) {
      // Pick the border hex most exposed to enemies
      let best = border[0];
      let bestEnemyCount = -1;
      for (const hex of border) {
        const neighbors = game.map.getNeighbors(hex.q, hex.r);
        let ec = 0;
        for (const n of neighbors) {
          const nh = game.map.getHex(n.q, n.r);
          if (nh && nh.owner !== null && nh.owner !== faction.id) ec++;
        }
        if (ec > bestEnemyCount) { bestEnemyCount = ec; best = hex; }
      }
      if (bestEnemyCount > 0 && Math.random() < 0.55) {
        return { hex: best, buildingType: 'wall' };
      }
    }

    // Market on interior hex
    if (interior.length > 0 && faction.canAfford(buildings.market.cost)) {
      const target = interior[Math.floor(Math.random() * interior.length)];
      return { hex: target, buildingType: 'market' };
    }

    // Market on any hex if we can afford it
    if (faction.canAfford(buildings.market.cost)) {
      const target = buildable[Math.floor(Math.random() * buildable.length)];
      return { hex: target, buildingType: 'market' };
    }

    return null;
  }

  /* ────────────────── research choice ────────────────── */

  static chooseResearch(game, faction) {
    const tree = window.TECH_TREE;
    const candidates = [];

    for (const cat of ['military', 'strategy', 'economy', 'diplomacy']) {
      const branch = tree[cat];
      const lvl    = faction.techs[cat] || 0;
      if (lvl >= branch.levels.length) continue;         // maxed
      const nextTech = branch.levels[lvl];
      if (!faction.canAfford(nextTech.cost)) continue;   // can't afford

      let priority = 0;
      if (cat === 'military') {
        // Prioritise if at war
        const enemies = game.diplomacy.getEnemies(faction.id, game.factions.length);
        priority = enemies.length > 0 ? 60 : 30;
      } else if (cat === 'strategy') {
        const enemies = game.diplomacy.getEnemies(faction.id, game.factions.length);
        priority = enemies.length > 0 ? 58 : 38;
      } else if (cat === 'economy') {
        priority = faction.gold < 50 ? 55 : 25;
      } else {
        priority = 20;
      }
      priority += Math.random() * 20;
      candidates.push({ cat, priority });
    }

    if (candidates.length === 0) return null;
    candidates.sort((a, b) => b.priority - a.priority);
    return candidates[0].cat;
  }

  /* ────────────────── internal helpers ────────────────── */

  static _tryDiplomacy(game, faction, threat) {
    // Try to ally with the strongest neutral faction
    const alive = game.getAliveFactions().filter(f => f.id !== faction.id);
    let best = null;
    let bestScore = -Infinity;

    for (const f of alive) {
      if (game.diplomacy.isAlly(faction.id, f.id)) continue;
      if (game.diplomacy.isAtWar(faction.id, f.id)) continue;

      const score = f.calculateMilitary() + f.territories.size * 2 + Math.random() * 15;
      if (score > bestScore) { bestScore = score; best = f; }
    }

    if (best && Math.random() < 0.55) {
      const result = window.ActionSystem.diplomacy(game, faction, best, 'propose_alliance');
      if (result.success) {
        game.addEvent(result.message, faction.id);
        faction.actionTaken = true;
        return { action: 'diplomacy', params: { targetFaction: best, actionType: 'propose_alliance' }, result };
      }
    }

    // If at war and losing, try peace
    const enemies = game.diplomacy.getEnemies(faction.id, game.factions.length);
    for (const eid of enemies) {
      const ef = game.getFaction(eid);
      if (!ef || !ef.alive) continue;
      if (ef.calculateMilitary() > faction.calculateMilitary() * 1.3 && Math.random() < 0.5) {
        const result = window.ActionSystem.diplomacy(game, faction, ef, 'propose_peace');
        if (result.success) {
          game.addEvent(result.message, faction.id);
          faction.actionTaken = true;
          return { action: 'diplomacy', params: { targetFaction: ef, actionType: 'propose_peace' }, result };
        }
      }
    }

    return null;
  }

  static _tryDefend(game, faction) {
    const hexKeys = Array.from(faction.territories);
    if (hexKeys.length === 0) return null;

    // Find most vulnerable border hex
    let bestHex = null;
    let worstExposure = -1;

    for (const key of hexKeys) {
      const hex = game.map.getHexByKey(key);
      if (!hex) continue;
      const neighbors = game.map.getNeighbors(hex.q, hex.r);
      let enemyCount = 0;
      for (const n of neighbors) {
        const nh = game.map.getHex(n.q, n.r);
        if (nh && nh.owner !== null && nh.owner !== faction.id && !game.diplomacy.isAlly(faction.id, nh.owner)) {
          enemyCount++;
        }
      }
      if (enemyCount > worstExposure) {
        worstExposure = enemyCount;
        bestHex = hex;
      }
    }

    if (bestHex && worstExposure > 0) {
      const result = window.ActionSystem.defend(game, faction, bestHex);
      if (result.success) {
        game.addEvent(result.message, faction.id);
        faction.actionTaken = true;
        return { action: 'defend', params: { targetHex: bestHex }, result };
      }
    }

    // Fallback – defend first hex
    const fallbackHex = game.map.getHexByKey(hexKeys[0]);
    if (fallbackHex) {
      const result = window.ActionSystem.defend(game, faction, fallbackHex);
      if (result.success) {
        game.addEvent(result.message, faction.id);
        faction.actionTaken = true;
        return { action: 'defend', params: { targetHex: fallbackHex }, result };
      }
    }

    return null;
  }
};
