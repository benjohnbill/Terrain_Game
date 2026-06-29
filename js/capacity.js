/* ============================================================
 * capacity.js — Action capacity calculations
 * ============================================================ */

(function () {
  'use strict';

  const FUNCTION_CAPACITY_BONUS = Object.freeze({
    administrative: { command: 0.4, administration: 1.4, diplomacy: 0.4, scholarship: 0.4 },
    commercial: { command: 0.2, administration: 0.8, diplomacy: 1.0, scholarship: 0.3 },
    agricultural: { command: 0.3, administration: 0.8, diplomacy: 0.2, scholarship: 0.2 },
    military_base: { command: 1.4, administration: 0.4, diplomacy: 0.2, scholarship: 0.3 },
    fortress_pass: { command: 1.2, administration: 0.3, diplomacy: 0.2, scholarship: 0.2 },
    port: { command: 0.4, administration: 0.7, diplomacy: 1.0, scholarship: 0.3 },
    mining_workshop: { command: 0.8, administration: 0.7, diplomacy: 0.2, scholarship: 0.4 },
    scholarly_religious: { command: 0.2, administration: 0.4, diplomacy: 0.5, scholarship: 1.5 },
    frontier_settlement: { command: 0.8, administration: 0.3, diplomacy: 0.2, scholarship: 0.2 }
  });

  const CARRYOVER_RULES = Object.freeze({
    command: { rate: 0.35, cap: 4 },
    administration: { rate: 0.55, cap: 6 },
    diplomacy: { rate: 0.55, cap: 6 },
    scholarship: { rate: 0.8, cap: 8 }
  });

  const OVERCLOCK_RULES = Object.freeze({
    institutional: { rate: 0.5, warningLevel: 'medium' },
    emergency_human: { rate: 0.35, warningLevel: 'severe' }
  });

  function emptyCapacities() {
    return { command: 0, administration: 0, diplomacy: 0, scholarship: 0 };
  }

  function roundCapacity(value) {
    return Math.round(value * 10) / 10;
  }

  function calculateBaseCapacities(ownedProvinceIds) {
    const result = emptyCapacities();
    for (const provinceId of ownedProvinceIds) {
      const province = window.getProvinceById(provinceId);
      if (!province) continue;
      const functionBonus = FUNCTION_CAPACITY_BONUS[province.primaryFunction];
      const populationBase = Math.max(0.2, province.populationWeight * 0.5);
      const economyBase = Math.max(0.2, province.economyWeight * 0.4);

      result.command += populationBase * 0.5 + province.garrisonWeight * 0.8 + functionBonus.command;
      result.administration += economyBase * 0.8 + province.populationWeight * 0.4 + functionBonus.administration;
      result.diplomacy += economyBase * 0.4 + functionBonus.diplomacy;
      result.scholarship += economyBase * 0.3 + functionBonus.scholarship;
    }

    return {
      command: roundCapacity(result.command),
      administration: roundCapacity(result.administration),
      diplomacy: roundCapacity(result.diplomacy),
      scholarship: roundCapacity(result.scholarship)
    };
  }

  function applyPosture(baseCapacities, postureId) {
    const posture = window.STRATEGIC_POSTURES[postureId] || window.STRATEGIC_POSTURES.balanced;
    const total = Object.values(baseCapacities).reduce((sum, value) => sum + value, 0);
    const available = emptyCapacities();
    for (const key of Object.keys(available)) {
      available[key] = Math.round(total * posture.capacityWeights[key]);
    }
    return {
      postureId: posture.id,
      postureLabel: posture.label,
      available,
      focus: Object.assign({}, posture.focusDefaults)
    };
  }

  function calculateCarryover(unusedCapacities) {
    const result = emptyCapacities();
    for (const [key, value] of Object.entries(unusedCapacities)) {
      const rule = CARRYOVER_RULES[key];
      result[key] = Math.min(rule.cap, Math.round(value * rule.rate));
    }
    return result;
  }

  function overclock(capacities, from, to, amount, intensity) {
    const rule = OVERCLOCK_RULES[intensity] || OVERCLOCK_RULES.institutional;
    const spend = Math.max(0, Math.min(capacities[from] || 0, amount));
    const gain = Math.floor(spend * rule.rate);
    const next = Object.assign({}, capacities);
    next[from] -= spend;
    next[to] = (next[to] || 0) + gain;
    return {
      capacities: next,
      spent: spend,
      gained: gain,
      warningLevel: rule.warningLevel
    };
  }

  window.CapacitySystem = Object.freeze({
    calculateBaseCapacities,
    applyPosture,
    calculateCarryover,
    overclock,
    CARRYOVER_RULES,
    OVERCLOCK_RULES
  });
})();
