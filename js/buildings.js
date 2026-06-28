// ============================================================================
// buildings.js - 건물 데이터 정의
// 세계정복 턴제 전략 게임 - Data Layer
// ============================================================================

window.BUILDINGS = {
  wall: {
    id: 'wall',
    name: '성벽',
    icon: '🏰',
    cost: 50,
    description: '영토 방어력 +30',
    effects: { defenseBonus: 30 }
  },
  market: {
    id: 'market',
    name: '시장',
    icon: '🏪',
    cost: 40,
    description: '골드 수입 +10',
    effects: { goldBonus: 10 }
  },
  barracks: {
    id: 'barracks',
    name: '병영',
    icon: '⚔️',
    cost: 60,
    description: '군사력 +15',
    effects: { militaryBonus: 15 }
  },
  lab: {
    id: 'lab',
    name: '연구소',
    icon: '🔬',
    cost: 70,
    description: '기술력 +10',
    effects: { techBonus: 10 }
  }
};
