/* ============================================================
 * province-data.js — Initial named province data
 * ============================================================ */

(function () {
  'use strict';

  function province(id, name, archetype, primaryTerrain, primaryFunction, populationWeight, economyWeight, garrisonWeight, defenseWeight, tags) {
    return Object.freeze({
      id,
      name,
      archetype,
      primaryTerrain,
      terrainComposition: Object.freeze([primaryTerrain]),
      primaryFunction,
      secondaryFunction: null,
      populationWeight,
      economyWeight,
      garrisonWeight,
      defenseWeight,
      strategicTags: Object.freeze(tags)
    });
  }

  window.PROVINCES = Object.freeze([
    province('luoyuan_plain', '낙원 평원', 'central_plains', 'plains', 'administrative', 1.35, 1.25, 1.05, 0.95, ['capital_candidate', 'high_tax']),
    province('hedu_crossing', '하도 나루', 'central_plains', 'river', 'commercial', 1.15, 1.25, 0.95, 1.0, ['river_crossing', 'trade']),
    province('yedu_fields', '업도 들판', 'central_plains', 'plains', 'agricultural', 1.3, 1.2, 0.9, 0.9, ['grain', 'open_front']),
    province('songling_market', '송릉 시장', 'central_plains', 'plains', 'commercial', 1.1, 1.3, 0.85, 0.9, ['trade', 'soft_target']),
    province('chenyuan_workshops', '진원 공방', 'central_plains', 'plains', 'mining_workshop', 1.05, 1.15, 1.05, 0.95, ['arms']),

    province('guanzhong_gate', '관중 관문', 'guanzhong_passes', 'mountain_pass', 'fortress_pass', 0.95, 0.95, 1.25, 1.55, ['pass', 'western_gate']),
    province('weishui_basin', '위수 분지', 'guanzhong_passes', 'frontier_basin', 'agricultural', 1.05, 1.1, 1.0, 1.2, ['basin', 'secure_rear']),
    province('changling_commandery', '장릉 군부', 'guanzhong_passes', 'mountain_pass', 'military_base', 0.9, 0.9, 1.35, 1.35, ['mustering_ground']),

    province('hebei_plain', '하북 평원', 'hebei_northern_plains', 'plains', 'military_base', 1.2, 1.05, 1.25, 1.0, ['northern_front']),
    province('yanmen_ridge', '안문 산령', 'hebei_northern_plains', 'mountain_pass', 'fortress_pass', 0.8, 0.75, 1.2, 1.5, ['pass', 'raider_route']),
    province('northern_horsefields', '북원 목지', 'hebei_northern_plains', 'steppe_highland', 'frontier_settlement', 0.85, 0.8, 1.2, 1.0, ['horses', 'mobile_warfare']),

    province('liaodong_frontier', '요동 변경', 'northeastern_frontier', 'steppe_highland', 'frontier_settlement', 0.8, 0.85, 1.15, 1.1, ['cold_frontier']),
    province('songhua_ford', '송화 도하', 'northeastern_frontier', 'river', 'military_base', 0.85, 0.9, 1.2, 1.15, ['river_crossing']),
    province('eastwood_mines', '동림 광산', 'northeastern_frontier', 'frontier_basin', 'mining_workshop', 0.75, 1.05, 1.0, 1.1, ['iron']),

    province('hanjing_waterway', '형강 수로', 'han_jing_corridor', 'river', 'commercial', 1.05, 1.2, 0.95, 1.05, ['river_crossing', 'south_gate']),
    province('jiangxia_ford', '강하 나루', 'han_jing_corridor', 'river', 'military_base', 1.0, 1.0, 1.15, 1.1, ['river_crossing', 'contested']),
    province('yunmeng_marsh', '운몽 습지', 'han_jing_corridor', 'river', 'frontier_settlement', 0.9, 0.9, 0.9, 1.2, ['difficult_approach']),

    province('jiangnan_granary', '강남 곡창지대', 'jiangnan_grain_belt', 'grain_basin', 'agricultural', 1.35, 1.35, 0.9, 0.9, ['grain', 'long_war_base']),
    province('wuyue_canals', '오월 운하', 'jiangnan_grain_belt', 'river', 'commercial', 1.15, 1.35, 0.85, 0.95, ['canal', 'trade']),
    province('southern_academy', '남림 학궁', 'jiangnan_grain_belt', 'grain_basin', 'scholarly_religious', 1.0, 1.05, 0.75, 0.9, ['scholarship']),

    province('shu_basin', '촉중 분지', 'southwestern_basin', 'frontier_basin', 'agricultural', 1.2, 1.15, 1.0, 1.35, ['defensible_basin']),
    province('jianmen_pass', '검문 관문', 'southwestern_basin', 'mountain_pass', 'fortress_pass', 0.75, 0.75, 1.15, 1.65, ['pass']),
    province('ba_river_valley', '파강 계곡', 'southwestern_basin', 'river', 'frontier_settlement', 0.95, 0.95, 1.0, 1.15, ['valley']),

    province('minhai_port', '민해 항구', 'southeast_coast_straits', 'coast_strait', 'port', 0.95, 1.3, 0.9, 1.0, ['port', 'strait']),
    province('haixia_strait', '해협 연안', 'southeast_coast_straits', 'coast_strait', 'military_base', 0.85, 1.1, 1.1, 1.1, ['strait_crossing']),
    province('eastern_isles', '동도 제도', 'southeast_coast_straits', 'coast_strait', 'port', 0.7, 0.95, 0.85, 1.0, ['island']),

    province('dunhuang_oasis', '돈황 오아시스', 'northwest_oasis_corridor', 'frontier_basin', 'commercial', 0.75, 1.05, 0.9, 1.1, ['oasis_trade']),
    province('southern_mountains', '남령 산지', 'southern_mountain_forest', 'mountain_pass', 'frontier_settlement', 0.8, 0.75, 0.95, 1.35, ['forest_mountain']),
    province('steppe_border', '초원 접경', 'steppe_frontier', 'steppe_highland', 'frontier_settlement', 0.75, 0.7, 1.2, 0.95, ['raider_pressure']),
    province('western_trade_route', '서역 교역로', 'northern_india_route', 'frontier_basin', 'commercial', 0.8, 1.15, 0.85, 1.0, ['trade_route'])
  ]);

  window.PROVINCE_BY_ID = Object.freeze(window.PROVINCES.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {}));

  window.getProvinceById = function getProvinceById(id) {
    return window.PROVINCE_BY_ID[id] || null;
  };
})();
