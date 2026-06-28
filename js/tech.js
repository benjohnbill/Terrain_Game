// ============================================================================
// tech.js - 기술 트리 데이터 정의
// 세계정복 턴제 전략 게임 - Data Layer
// ============================================================================

window.TECH_TREE = {
  military: {
    name: '군사 기술',
    icon: '⚔️',
    levels: [
      {
        name: '철기 제련',
        cost: 30,
        description: '공격력 +10%',
        effect: { attackBonus: 0.1 }
      },
      {
        name: '전술 훈련',
        cost: 60,
        description: '공격력 +20%',
        effect: { attackBonus: 0.2 }
      },
      {
        name: '공성 기술',
        cost: 100,
        description: '공격력 +30%, 성벽 무력화',
        effect: { attackBonus: 0.3, ignoreWalls: true }
      }
    ]
  },
  strategy: {
    name: '군사전략',
    icon: '♟️',
    levels: [
      {
        name: '기동전 교리',
        cost: 40,
        description: '공격력 +8%, 턴당 군사력 충원 +2',
        effect: { attackBonus: 0.08, militaryRecharge: 2 }
      },
      {
        name: '보급망 정비',
        cost: 75,
        description: '공격력 +7%, 공격 세금 비용 -4%',
        effect: { attackBonus: 0.07, attackTaxCost: -0.04 }
      },
      {
        name: '총력전 전략',
        cost: 120,
        description: '공격력 +10%, 턴당 군사력 충원 +4',
        effect: { attackBonus: 0.10, militaryRecharge: 4 }
      }
    ]
  },
  economy: {
    name: '경제 기술',
    icon: '💰',
    levels: [
      {
        name: '농업 혁신',
        cost: 30,
        description: '인구 성장 +10%',
        effect: { popGrowth: 0.1 }
      },
      {
        name: '무역 확장',
        cost: 60,
        description: '골드 수입 +20%',
        effect: { goldBonus: 0.2 }
      },
      {
        name: '산업 혁명',
        cost: 100,
        description: '모든 건물 효과 +50%',
        effect: { buildingBoost: 0.5 }
      }
    ]
  },
  diplomacy: {
    name: '외교 기술',
    icon: '🤝',
    levels: [
      {
        name: '사절단',
        cost: 30,
        description: '외교 성공률 +20%',
        effect: { diplomacyBonus: 0.2 }
      },
      {
        name: '문화 교류',
        cost: 60,
        description: '동맹 유지 비용 없음',
        effect: { freeAlliance: true }
      },
      {
        name: '세계 평화',
        cost: 100,
        description: '동맹군 지원 가능',
        effect: { allySupport: true }
      }
    ]
  }
};
