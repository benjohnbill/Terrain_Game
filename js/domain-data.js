/* ============================================================
 * domain-data.js — Phase 1 domain catalogs
 * ============================================================ */

window.TERRAIN_TYPES = Object.freeze({
  plains: {
    id: 'plains',
    label: '평야',
    color: '#b9a15b',
    economy: 1.1,
    defense: 0.9,
    movement: 1.0
  },
  grain_basin: {
    id: 'grain_basin',
    label: '곡창지대',
    color: '#69a85f',
    economy: 1.35,
    defense: 0.95,
    movement: 1.0
  },
  mountain_pass: {
    id: 'mountain_pass',
    label: '산악/관문',
    color: '#7f8794',
    economy: 0.75,
    defense: 1.45,
    movement: 0.65
  },
  river: {
    id: 'river',
    label: '강/수로',
    color: '#5cb8ff',
    economy: 1.15,
    defense: 1.05,
    movement: 0.85
  },
  coast_strait: {
    id: 'coast_strait',
    label: '해안/해협',
    color: '#3aa6b9',
    economy: 1.2,
    defense: 1.0,
    movement: 0.9
  },
  steppe_highland: {
    id: 'steppe_highland',
    label: '초원/고원',
    color: '#a9875b',
    economy: 0.8,
    defense: 1.0,
    movement: 1.2
  },
  frontier_basin: {
    id: 'frontier_basin',
    label: '변방/분지',
    color: '#9b79b7',
    economy: 0.95,
    defense: 1.15,
    movement: 0.85
  }
});

window.ARCHETYPE_REGIONS = Object.freeze({
  central_plains: { id: 'central_plains', label: '중원 평야권' },
  guanzhong_passes: { id: 'guanzhong_passes', label: '관중 관문권' },
  hebei_northern_plains: { id: 'hebei_northern_plains', label: '하북·북방 평원권' },
  northeastern_frontier: { id: 'northeastern_frontier', label: '동북 변경권' },
  han_jing_corridor: { id: 'han_jing_corridor', label: '한강·형강 수로권' },
  jiangnan_grain_belt: { id: 'jiangnan_grain_belt', label: '강남 곡창지대' },
  southwestern_basin: { id: 'southwestern_basin', label: '서남 분지권' },
  southeast_coast_straits: { id: 'southeast_coast_straits', label: '동남 해안·해협권' },
  northwest_oasis_corridor: { id: 'northwest_oasis_corridor', label: '서북 오아시스 회랑' },
  southern_mountain_forest: { id: 'southern_mountain_forest', label: '남방 산악·삼림권' },
  steppe_frontier: { id: 'steppe_frontier', label: '북방 초원권' },
  northern_india_route: { id: 'northern_india_route', label: '인도 북부 교역로' }
});

window.FUNCTION_TYPES = Object.freeze({
  administrative: { id: 'administrative', label: '도읍/행정 중심지' },
  commercial: { id: 'commercial', label: '상업 도시' },
  agricultural: { id: 'agricultural', label: '농업 중심지' },
  military_base: { id: 'military_base', label: '군사 거점' },
  fortress_pass: { id: 'fortress_pass', label: '요새 관문' },
  port: { id: 'port', label: '항구 도시' },
  mining_workshop: { id: 'mining_workshop', label: '광산/공방지대' },
  scholarly_religious: { id: 'scholarly_religious', label: '학문/종교 중심지' },
  frontier_settlement: { id: 'frontier_settlement', label: '변방 개척지' }
});

window.ACTION_CAPACITIES = Object.freeze({
  command: { id: 'command', label: '지휘력', shortLabel: '지휘' },
  administration: { id: 'administration', label: '행정력', shortLabel: '행정' },
  diplomacy: { id: 'diplomacy', label: '외교력', shortLabel: '외교' },
  scholarship: { id: 'scholarship', label: '학술력', shortLabel: '학술' }
});

window.FOCUS_OPTIONS = Object.freeze({
  command: {
    operation: { id: 'operation', label: '작전' },
    mobilization: { id: 'mobilization', label: '동원' },
    scouting: { id: 'scouting', label: '정찰' },
    training: { id: 'training', label: '훈련' }
  },
  administration: {
    taxation: { id: 'taxation', label: '징세' },
    supply: { id: 'supply', label: '보급' },
    development: { id: 'development', label: '개발' },
    recovery: { id: 'recovery', label: '복구' }
  },
  diplomacy: {
    negotiation: { id: 'negotiation', label: '협상' },
    espionage: { id: 'espionage', label: '첩보' },
    threat: { id: 'threat', label: '위협' },
    appeasement: { id: 'appeasement', label: '회유' }
  },
  scholarship: {
    research: { id: 'research', label: '연구' },
    surveying: { id: 'surveying', label: '측량' },
    institutions: { id: 'institutions', label: '제도' },
    tactics: { id: 'tactics', label: '병법' }
  }
});

window.STRATEGIC_POSTURES = Object.freeze({
  balanced: {
    id: 'balanced',
    label: '균형 운영',
    capacityWeights: { command: 0.25, administration: 0.25, diplomacy: 0.25, scholarship: 0.25 },
    focusDefaults: { command: 'operation', administration: 'supply', diplomacy: 'negotiation', scholarship: 'research' }
  },
  military_push: {
    id: 'military_push',
    label: '군사 집중',
    capacityWeights: { command: 0.5, administration: 0.2, diplomacy: 0.15, scholarship: 0.15 },
    focusDefaults: { command: 'operation', administration: 'supply', diplomacy: 'threat', scholarship: 'tactics' }
  },
  administrative_recovery: {
    id: 'administrative_recovery',
    label: '행정 정비',
    capacityWeights: { command: 0.15, administration: 0.55, diplomacy: 0.15, scholarship: 0.15 },
    focusDefaults: { command: 'training', administration: 'recovery', diplomacy: 'appeasement', scholarship: 'institutions' }
  },
  intelligence_gathering: {
    id: 'intelligence_gathering',
    label: '정보 수집',
    capacityWeights: { command: 0.3, administration: 0.2, diplomacy: 0.3, scholarship: 0.2 },
    focusDefaults: { command: 'scouting', administration: 'supply', diplomacy: 'espionage', scholarship: 'surveying' }
  }
});

window.COMMAND_INTENTS = Object.freeze({
  scout: { id: 'scout', label: '정찰', defaultIntensity: 'standard' },
  attack: { id: 'attack', label: '공격', defaultIntensity: 'standard' },
  reinforce: { id: 'reinforce', label: '방어 강화', defaultIntensity: 'standard' },
  mobilize: { id: 'mobilize', label: '동원', defaultIntensity: 'standard' },
  prepare_offensive: { id: 'prepare_offensive', label: '공세 준비', defaultIntensity: 'cautious' },
  defend_front: { id: 'defend_front', label: '전선 방어', defaultIntensity: 'standard' },
  consolidate: { id: 'consolidate', label: '정비/복구', defaultIntensity: 'standard' }
});

window.HIGHLIGHT_TYPES = Object.freeze({
  threat: { id: 'threat', label: '위협', color: 'rgba(255,70,70,0.55)' },
  opportunity: { id: 'opportunity', label: '기회', color: 'rgba(245,185,65,0.55)' },
  defense: { id: 'defense', label: '방어 요충', color: 'rgba(80,145,255,0.55)' },
  growth: { id: 'growth', label: '성장', color: 'rgba(70,210,120,0.50)' },
  uncertainty: { id: 'uncertainty', label: '정보 불확실', color: 'rgba(180,90,255,0.52)' },
  route: { id: 'route', label: '교통/보급', color: 'rgba(230,235,255,0.48)' }
});
