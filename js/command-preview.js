/* ============================================================
 * command-preview.js — deterministic command previews
 * ============================================================ */

(function () {
  'use strict';

  function invalid(kind, targetHex, message) {
    return {
      kind,
      valid: false,
      targetKey: targetHex ? targetHex.key() : null,
      targetName: targetHex ? (targetHex.provinceName || targetHex.key()) : '-',
      message,
      attackCost: 0,
      attackForce: 0,
      defenseForce: 0,
      forecast: null,
      mobilization: { enabled: false, estimatedTroops: 0, populationCost: 0 },
      capacityCost: null,
      confidence: null,
      intel: null,
      intelReliable: false,
      scout: { available: false, confidenceAfter: null },
      defenseEstimate: null,
      forecastRange: null,
      warnings: []
    };
  }

  function estimateMobilizedTroops(attacker) {
    const levy = Math.floor(attacker.population * 0.1);
    const cap = Math.floor(attacker.population * 0.2);
    return Math.max(0, Math.min(levy, cap));
  }

  function buildAttackPreview(game, attacker, targetHex, opts) {
    const o = opts || {};
    if (!targetHex) return invalid('attack', null, '대상 지역이 없습니다.');

    if (targetHex.owner === attacker.id) {
      return invalid('attack', targetHex, '자신의 영토는 공격할 수 없습니다.');
    }

    if (targetHex.owner !== null && game.diplomacy.isAlly(attacker.id, targetHex.owner)) {
      return invalid('attack', targetHex, '동맹국은 공격할 수 없습니다.');
    }

    if (!window.ActionSystem._isAdjacentToFaction(game, attacker.id, targetHex.q, targetHex.r)) {
      return invalid('attack', targetHex, '인접한 영토만 공격할 수 있습니다.');
    }

    if (attacker.military <= 0) {
      return invalid('attack', targetHex, '상비군이 부족합니다.');
    }

    const attackCost = Math.max(1, Math.ceil(attacker.calculateIncome() * attacker.getTaxAttackCostRate()));
    if (!attacker.canAfford(attackCost)) {
      return invalid('attack', targetHex, `공격 비용이 부족합니다. (필요: 💰${attackCost}, 보유: 💰${attacker.gold})`);
    }

    const mobilizedTroops = o.mobilize ? estimateMobilizedTroops(attacker) : 0;
    const portMitigation = window.ActionSystem._hasPortMitigation(game, attacker.id, targetHex);
    const attackForce = window.CombatSystem.computeAttackForce(attacker, targetHex, {
      mobilizedTroops,
      portMitigation
    });

    let defender = targetHex.owner === null ? null : game.getFaction(targetHex.owner);
    if (defender && !defender.alive) defender = null;
    let defenseForce = window.CombatSystem.computeDefenseForce(targetHex, defender);

    if (targetHex.building === 'wall' && attacker.canIgnoreWalls()) {
      const wallDef = window.BUILDINGS.wall.effects.defenseBonus || 0;
      defenseForce = Math.max(1, defenseForce - wallDef);
    }

    const forecast = window.CombatSystem.forecast(attackForce, defenseForce);
    const warnings = [];
    if (portMitigation) {
      warnings.push({ level: 'info', text: '항구 기능이 도하/상륙 부담을 줄입니다.' });
    }
    if (o.mobilize && mobilizedTroops > 0) {
      warnings.push({ level: 'severe', text: '공세 동원은 즉시 인구를 소모하고 다음 지휘 여력을 압박합니다.' });
    }
    if (targetHex.terrain === 'river' || targetHex.terrain === 'coast_strait') {
      warnings.push({ level: 'medium', text: '도하/해협 지형은 공격 효율을 낮춥니다.' });
    }

    const confidence = typeof targetHex.informationConfidence === 'number'
      ? targetHex.informationConfidence
      : null;
    const intel = confidence === null ? null : window.IntelSystem.tierOf(confidence);
    const intelReliable = confidence === null ? true : window.IntelSystem.isReliable(confidence);
    if (!intelReliable) {
      warnings.push({ level: 'medium', text: '정보 신뢰도가 낮아 예측이 부정확할 수 있습니다. 정찰로 정확도를 높이세요.' });
    }

    // Estimate the defender's strength as a true-containing range (spec §5).
    // Combat still resolves on the true defenseForce; this is preview-only.
    const defenseSeed = window.IntelSystem.hexSeed(targetHex.q, targetHex.r);
    const estimate = confidence === null
      ? { low: defenseForce, high: defenseForce, mid: defenseForce, width: 0 }
      : window.IntelSystem.estimateRange(defenseForce, confidence, defenseSeed);

    const dTier = confidence === null ? 'reliable' : window.IntelSystem.tierOf(confidence).id;
    let defenseLabel;
    if (estimate.width === 0) {
      defenseLabel = `${Math.round(estimate.mid)}`;
    } else if (dTier === 'reliable') {
      defenseLabel = `약 ${Math.round(estimate.low)}~${Math.round(estimate.high)}`;
    } else {
      const bLow = window.IntelSystem.magnitudeBucket(estimate.low);
      const bHigh = window.IntelSystem.magnitudeBucket(estimate.high);
      defenseLabel = bLow === bHigh ? bLow : `${bLow}~${bHigh}`;
    }
    const defenseEstimate = { ...estimate, label: defenseLabel, tier: dTier };

    // Forecast across the estimated defense band: strongest defense is the
    // attacker's worst case, weakest defense the best case, mid the best guess.
    const dLow = Math.max(1, estimate.low);
    const dMid = Math.max(1, estimate.mid);
    const dHigh = Math.max(1, estimate.high);
    const fMid = window.CombatSystem.forecast(attackForce, dMid);
    const forecastRange = {
      low: window.CombatSystem.forecast(attackForce, dHigh).low,
      expected: fMid.expected,
      high: window.CombatSystem.forecast(attackForce, dLow).high,
      band: fMid.band
    };

    return {
      kind: 'attack',
      valid: true,
      targetKey: targetHex.key(),
      targetName: targetHex.provinceName || targetHex.key(),
      message: '공격 명령을 검토할 수 있습니다.',
      attackCost,
      attackForce,
      defenseForce,
      forecast,
      mobilization: {
        enabled: !!o.mobilize,
        estimatedTroops: mobilizedTroops,
        populationCost: mobilizedTroops
      },
      capacityCost: mobilizedTroops > 0 ? { capacity: 'command', amount: mobilizedTroops } : null,
      confidence,
      intel,
      intelReliable,
      scout: {
        available: true,
        confidenceAfter: confidence === null ? null : window.IntelSystem.applyScout(confidence)
      },
      defenseEstimate,
      forecastRange,
      warnings
    };
  }

  window.CommandPreview = Object.freeze({
    buildAttackPreview,
    estimateMobilizedTroops
  });
})();
