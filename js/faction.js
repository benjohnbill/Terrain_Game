// ============================================================================
// faction.js - 세력(팩션) 데이터 및 클래스 정의
// 세계정복 턴제 전략 게임 - Data Layer
// ============================================================================

window.FACTION_DATA = [
  { id: 0, name: '홍염제국', color: '#ff4757', colorLight: '#ff6b81', emoji: '🔴' },
  { id: 1, name: '청해왕국', color: '#3742fa', colorLight: '#5352ed', emoji: '🔵' },
  { id: 2, name: '녹림연합', color: '#2ed573', colorLight: '#7bed9f', emoji: '🟢' },
  { id: 3, name: '황금상단', color: '#ffa502', colorLight: '#ffbe76', emoji: '🟡' },
  { id: 4, name: '자월교단', color: '#a855f7', colorLight: '#c084fc', emoji: '🟣' },
  { id: 5, name: '주홍부족', color: '#ff6348', colorLight: '#ff7f50', emoji: '🟠' }
];

window.Faction = class Faction {
  constructor(data, isAI) {
    this.id = data.id;
    this.name = data.name;
    this.color = data.color;
    this.colorLight = data.colorLight;
    this.emoji = data.emoji;
    this.isAI = isAI;

    // Resources
    this.gold = 100;
    this.military = 50;     // standing forces: national, mobile, treasury-funded (ADR 0009/0014)
    this.techLevel = 0;
    this.population = 100;

    // State
    this.territories = new Set();
    this.buildings = new Map();
    this.techs = {
      military: 0,
      strategy: 0,
      economy: 0,
      diplomacy: 0
    };
    this.isDefending = false;
    this.defendingHex = null;
    this.alive = true;
    this.actionTaken = false;
  }

  // ──────────────────────────────────────────────
  // 수입 계산
  // ──────────────────────────────────────────────
  calculateIncome() {
    let base = this.territories.size * 10;
    let buildingBonus = 0;

    this.buildings.forEach((buildingId) => {
      const b = window.BUILDINGS[buildingId];
      if (b && b.effects.goldBonus) {
        buildingBonus += b.effects.goldBonus;
      }
    });

    // 경제 기술 보너스
    let techMultiplier = 1;
    if (this.techs.economy >= 2) techMultiplier += 0.2;
    if (this.techs.economy >= 3) {
      // 산업 혁명: 건물 보너스 +50%
      buildingBonus *= 1.5;
    }

    return Math.floor((base + buildingBonus) * techMultiplier);
  }

  calculateMilitaryRecharge() {
    let recharge = 6 + Math.floor(this.territories.size * 1.5);
    this.buildings.forEach((buildingId) => {
      const b = window.BUILDINGS[buildingId];
      if (b && b.effects.militaryBonus) {
        recharge += Math.max(1, Math.floor(b.effects.militaryBonus * 0.35));
      }
    });
    if (this.techs.military >= 1) recharge += 3;
    if (this.techs.strategy >= 1) recharge += 2;
    if (this.techs.strategy >= 3) recharge += 4;
    return Math.max(4, Math.floor(recharge));
  }

  getTaxAttackCostRate() {
    let rate = 0.18;
    if (this.techs.strategy >= 2) rate -= 0.04;
    if (this.techs.economy >= 2) rate -= 0.02;
    return Math.max(0.10, rate);
  }

  getStrategyAttackBonus() {
    let bonus = 0;
    if (this.techs.strategy >= 1) bonus += 0.08;
    if (this.techs.strategy >= 2) bonus += 0.07;
    if (this.techs.strategy >= 3) bonus += 0.10;
    return bonus;
  }

  // ──────────────────────────────────────────────
  // 총 군사력 계산
  // ──────────────────────────────────────────────
  calculateMilitary() {
    let base = this.military;
    let buildingBonus = 0;

    this.buildings.forEach((buildingId) => {
      const b = window.BUILDINGS[buildingId];
      if (b && b.effects.militaryBonus) {
        buildingBonus += b.effects.militaryBonus;
      }
    });

    return base + buildingBonus;
  }

  // ──────────────────────────────────────────────
  // 기술 레벨 관련
  // ──────────────────────────────────────────────
  getTotalTechLevel() {
    return this.techs.military + this.techs.strategy + this.techs.economy + this.techs.diplomacy;
  }

  getAttackBonus() {
    let bonus = 0;
    const milTech = this.techs.military;
    if (milTech >= 1) bonus += 0.1;
    if (milTech >= 2) bonus += 0.2;
    if (milTech >= 3) bonus += 0.3;
    bonus += this.getStrategyAttackBonus();
    return bonus;
  }

  canIgnoreWalls() {
    return this.techs.military >= 3;
  }

  // ──────────────────────────────────────────────
  // 영토 관리
  // ──────────────────────────────────────────────
  addTerritory(hexKey) {
    this.territories.add(hexKey);
  }

  removeTerritory(hexKey) {
    this.territories.delete(hexKey);
    this.buildings.delete(hexKey);
  }

  // ──────────────────────────────────────────────
  // 자원 관리
  // ──────────────────────────────────────────────
  canAfford(cost) {
    return this.gold >= cost;
  }

  spend(amount) {
    this.gold -= amount;
  }

  // ──────────────────────────────────────────────
  // 공세 동원 — 인구에서 임시 병력 차출 (ADR 0009)
  // ──────────────────────────────────────────────
  drawMobilization(levy) {
    const available = Math.floor(this.population * 0.2);
    const drawn = Math.max(0, Math.min(levy, available));
    this.population -= drawn;
    return drawn;
  }

  // ──────────────────────────────────────────────
  // 턴 시작 처리
  // ──────────────────────────────────────────────
  startTurn() {
    // 수입 획득
    const income = this.calculateIncome();
    this.gold += income;

    // 군사력 충원
    this.military += this.calculateMilitaryRecharge();

    // 인구 성장
    let popGrowth = this.territories.size * 5;
    if (this.techs.economy >= 1) popGrowth *= 1.1;
    this.population += Math.floor(popGrowth);

    // 턴 상태 초기화
    this.isDefending = false;
    this.defendingHex = null;
    this.actionTaken = false;

    // 군사 유지비 (골드 소모)
    const maintenanceCost = Math.floor(this.military * 0.1);
    this.gold -= maintenanceCost;

    if (this.gold < 0) {
      // 유지비 지불 불가 시 군사력 감소
      this.military = Math.max(10, this.military - 10);
      this.gold = 0;
    }
  }

  // ──────────────────────────────────────────────
  // 생존 확인
  // ──────────────────────────────────────────────
  checkAlive() {
    if (this.territories.size === 0) {
      this.alive = false;
    }
    return this.alive;
  }
};
