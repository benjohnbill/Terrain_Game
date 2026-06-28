// ============================================================================
// diplomacy.js - 외교 시스템 클래스 정의
// 세계정복 턴제 전략 게임 - Data Layer
// ============================================================================

window.DiplomacySystem = class DiplomacySystem {
  constructor() {
    // 관계 저장: key = "factionA-factionB" (낮은 id 먼저)
    // 값: 'neutral', 'allied', 'war'
    this.relations = new Map();
    this.scores = new Map();
    this.pendingProposals = [];
  }

  // ──────────────────────────────────────────────
  // 초기화
  // ──────────────────────────────────────────────
  init(factionCount) {
    this.relations.clear();
    this.scores.clear();
    this.pendingProposals = [];
    for (let i = 0; i < factionCount; i++) {
      for (let j = i + 1; j < factionCount; j++) {
        this.relations.set(this._key(i, j), 'neutral');
        this.scores.set(this._key(i, j), 50);
      }
    }
  }

  addFaction(newFactionId, totalFactions) {
    for (let i = 0; i < totalFactions; i++) {
      if (i === newFactionId) continue;
      const key = this._key(i, newFactionId);
      if (!this.relations.has(key)) this.relations.set(key, 'neutral');
      if (!this.scores.has(key)) this.scores.set(key, 50);
    }
  }

  // ──────────────────────────────────────────────
  // 내부 헬퍼
  // ──────────────────────────────────────────────
  _key(a, b) {
    return a < b ? `${a}-${b}` : `${b}-${a}`;
  }

  // ──────────────────────────────────────────────
  // 관계 조회 / 설정
  // ──────────────────────────────────────────────
  getRelation(a, b) {
    if (a === b) return 'self';
    return this.relations.get(this._key(a, b)) || 'neutral';
  }

  setRelation(a, b, relation) {
    if (a !== b) {
      this.relations.set(this._key(a, b), relation);
    }
  }

  getScore(a, b) {
    if (a === b) return 100;
    return this.scores.get(this._key(a, b)) ?? 50;
  }

  changeScore(a, b, delta) {
    if (a === b) return this.getScore(a, b);
    const key = this._key(a, b);
    const next = Math.max(0, Math.min(100, this.getScore(a, b) + delta));
    this.scores.set(key, next);
    return next;
  }

  penalizeWarStarter(starterId, targetId, totalFactions) {
    for (let i = 0; i < totalFactions; i++) {
      if (i === starterId) continue;
      const penalty = i === targetId ? -25 : -12;
      this.changeScore(starterId, i, penalty);
    }
  }

  isAlly(a, b) {
    return this.getRelation(a, b) === 'allied';
  }

  isAtWar(a, b) {
    return this.getRelation(a, b) === 'war';
  }

  isNeutral(a, b) {
    return this.getRelation(a, b) === 'neutral';
  }

  // ──────────────────────────────────────────────
  // 동맹 / 적 목록 조회
  // ──────────────────────────────────────────────
  getAllies(factionId, totalFactions) {
    const allies = [];
    for (let i = 0; i < totalFactions; i++) {
      if (i !== factionId && this.isAlly(factionId, i)) {
        allies.push(i);
      }
    }
    return allies;
  }

  getEnemies(factionId, totalFactions) {
    const enemies = [];
    for (let i = 0; i < totalFactions; i++) {
      if (i !== factionId && this.isAtWar(factionId, i)) {
        enemies.push(i);
      }
    }
    return enemies;
  }

  // ──────────────────────────────────────────────
  // 제안 시스템
  // ──────────────────────────────────────────────
  proposeAlliance(fromId, toId) {
    // 이미 동맹이면 무시
    if (this.isAlly(fromId, toId)) return false;
    // 중복 제안 방지
    const exists = this.pendingProposals.some(
      p => p.from === fromId && p.to === toId && p.type === 'alliance'
    );
    if (exists) return false;
    this.pendingProposals.push({ from: fromId, to: toId, type: 'alliance' });
    return true;
  }

  proposePeace(fromId, toId) {
    // 전쟁 중이 아니면 무시
    if (!this.isAtWar(fromId, toId)) return false;
    // 중복 제안 방지
    const exists = this.pendingProposals.some(
      p => p.from === fromId && p.to === toId && p.type === 'peace'
    );
    if (exists) return false;
    this.pendingProposals.push({ from: fromId, to: toId, type: 'peace' });
    return true;
  }

  acceptProposal(proposal) {
    if (proposal.type === 'alliance') {
      this.setRelation(proposal.from, proposal.to, 'allied');
    } else if (proposal.type === 'peace') {
      this.setRelation(proposal.from, proposal.to, 'neutral');
    }
    this._removeProposal(proposal);
  }

  rejectProposal(proposal) {
    this._removeProposal(proposal);
  }

  _removeProposal(proposal) {
    const idx = this.pendingProposals.indexOf(proposal);
    if (idx >= 0) this.pendingProposals.splice(idx, 1);
  }

  // ──────────────────────────────────────────────
  // 전쟁 / 동맹 파기
  // ──────────────────────────────────────────────
  declareWar(a, b) {
    // 동맹이었다면 자동 파기
    if (this.isAlly(a, b)) {
      this.breakAlliance(a, b);
    }
    this.setRelation(a, b, 'war');
    // 관련 제안 모두 제거
    this.pendingProposals = this.pendingProposals.filter(
      p => !((p.from === a && p.to === b) || (p.from === b && p.to === a))
    );
  }

  breakAlliance(a, b) {
    if (this.isAlly(a, b)) {
      this.setRelation(a, b, 'neutral');
    }
  }

  // ──────────────────────────────────────────────
  // 제안 조회 / 관리
  // ──────────────────────────────────────────────
  getProposalsFor(factionId) {
    return this.pendingProposals.filter(p => p.to === factionId);
  }

  getProposalsFrom(factionId) {
    return this.pendingProposals.filter(p => p.from === factionId);
  }

  clearProposalsFrom(factionId) {
    this.pendingProposals = this.pendingProposals.filter(p => p.from !== factionId);
  }

  clearProposalsFor(factionId) {
    this.pendingProposals = this.pendingProposals.filter(p => p.to !== factionId);
  }

  // ──────────────────────────────────────────────
  // 관계 요약 (디버그 / UI 용)
  // ──────────────────────────────────────────────
  getRelationSummary(factionId, totalFactions) {
    const summary = { allies: [], enemies: [], neutrals: [] };
    for (let i = 0; i < totalFactions; i++) {
      if (i === factionId) continue;
      const rel = this.getRelation(factionId, i);
      if (rel === 'allied') summary.allies.push(i);
      else if (rel === 'war') summary.enemies.push(i);
      else summary.neutrals.push(i);
    }
    return summary;
  }
};
