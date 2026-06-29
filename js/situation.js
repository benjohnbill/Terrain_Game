/* ============================================================
 * situation.js — Map-first situation analysis
 * ============================================================ */

(function () {
  'use strict';

  function classifyHex(hex, currentFactionId) {
    const tags = hex.strategicTags || [];
    const owned = hex.owner === currentFactionId;
    const enemy = hex.owner !== null && hex.owner !== currentFactionId;
    const lowConfidence = hex.informationConfidence < 0.55;
    const highEconomy = hex.economyValue >= 12;
    const weakOwnDefense = owned && hex.localGarrison < 7;
    const routeTag = tags.includes('pass') || tags.includes('river_crossing') || tags.includes('strait_crossing');

    if (weakOwnDefense) return { type: 'defense', recommendedIntent: 'reinforce' };
    if (enemy && lowConfidence) return { type: 'uncertainty', recommendedIntent: 'scout' };
    if (enemy && highEconomy) return { type: 'opportunity', recommendedIntent: 'prepare_offensive' };
    if (routeTag) return { type: 'route', recommendedIntent: 'scout' };
    if (owned && highEconomy) return { type: 'growth', recommendedIntent: 'consolidate' };
    return null;
  }

  function reasonFor(hex, type) {
    if (type === 'defense') return `${hex.provinceName}의 주둔군이 부족합니다.`;
    if (type === 'uncertainty') return `${hex.provinceName}의 정보 신뢰도가 낮습니다.`;
    if (type === 'opportunity') return `${hex.provinceName}은(는) 경제 가치가 높은 목표입니다.`;
    if (type === 'route') return `${hex.provinceName}은(는) 이동/도하/관문 변수입니다.`;
    if (type === 'growth') return `${hex.provinceName}은(는) 성장과 복구 가치가 큽니다.`;
    return `${hex.provinceName}의 형세를 확인해야 합니다.`;
  }

  function analyze(input) {
    const highlights = [];
    for (const hex of input.hexes) {
      const classified = classifyHex(hex, input.currentFactionId);
      if (!classified) continue;
      highlights.push({
        key: hex.key(),
        provinceId: hex.provinceId,
        provinceName: hex.provinceName,
        type: classified.type,
        color: window.HIGHLIGHT_TYPES[classified.type].color,
        reason: reasonFor(hex, classified.type),
        confidence: hex.informationConfidence,
        recommendedIntent: classified.recommendedIntent
      });
    }

    highlights.sort((a, b) => {
      const order = { defense: 0, threat: 1, uncertainty: 2, opportunity: 3, route: 4, growth: 5 };
      return order[a.type] - order[b.type];
    });

    const visibleHighlights = highlights.slice(0, 7);
    return {
      postureId: input.postureId || 'balanced',
      highlights: visibleHighlights,
      briefing: visibleHighlights.slice(0, 5).map((item) => ({
        key: item.key,
        title: window.HIGHLIGHT_TYPES[item.type].label,
        text: item.reason,
        confidence: item.confidence
      }))
    };
  }

  function createCommandDefault(highlight) {
    const intent = window.COMMAND_INTENTS[highlight.recommendedIntent] || window.COMMAND_INTENTS.scout;
    return {
      targetKey: highlight.key,
      targetName: highlight.provinceName,
      intent: intent.id,
      intentLabel: intent.label,
      intensity: intent.defaultIntensity,
      confidence: highlight.confidence,
      reason: highlight.reason
    };
  }

  window.SituationAnalyzer = Object.freeze({
    analyze,
    createCommandDefault
  });
})();
