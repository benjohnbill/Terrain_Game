/* ============================================================
 *  combat.js — CombatSystem
 *  Phase 1 Slice 2: terrain-mediated, force-role combat.
 *
 *  SEAM NOTE: resolve() and forecast() are the ONLY places combat
 *  randomness and round structure live. To later replace this
 *  single-stage model with multi-round attrition, rewrite the
 *  internals of resolve()/forecast() ONLY — callers (ActionSystem,
 *  GameUI) pass effective-force inputs and read an outcome object,
 *  and must not change.
 *
 *  Depends on: TERRAIN_TYPES, BUILDINGS (window).
 * ============================================================ */

window.CombatSystem = class CombatSystem {

  /* Bounded random factor band shared by attack and defense rolls. */
  static get ROLL_MIN() { return 0.7; }
  static get ROLL_SPAN() { return 0.6; } // → 0.7 .. 1.3

  /* Offensive mobilization is less efficient than trained standing forces. */
  static get MOBILIZATION_EFFICIENCY() { return 0.6; }

  /* Attacker penalty for assaulting INTO water terrain (ADR 0015). */
  static get CROSSING() { return { river: 0.85, coast_strait: 0.70 }; }

  /** Bounded random multiplier; rngFn defaults to Math.random. */
  static _roll(rngFn) {
    const r = (typeof rngFn === 'function' ? rngFn : Math.random)();
    return CombatSystem.ROLL_MIN + r * CombatSystem.ROLL_SPAN;
  }

  /** Crossing penalty for attacking INTO targetTerrain.
   *  portMitigation=true (a port stages or receives the assault) halves the penalty. */
  static crossingPenalty(targetTerrain, portMitigation) {
    const base = CombatSystem.CROSSING[targetTerrain];
    if (base === undefined) return 1;
    return portMitigation ? base + (1 - base) * 0.5 : base;
  }

  /** Effective ATTACK force. opts: { mobilizedTroops=0, portMitigation=false }. */
  static computeAttackForce(attacker, targetHex, opts) {
    const o = opts || {};
    const base = attacker.calculateMilitary() * (1 + attacker.getAttackBonus());
    const projected = base * CombatSystem.crossingPenalty(targetHex.terrain, !!o.portMitigation);
    const mobilized = (o.mobilizedTroops || 0) * CombatSystem.MOBILIZATION_EFFICIENCY;
    return Math.max(1, Math.round(projected + mobilized));
  }

  /** Effective DEFENSE force for a hex held by ownerFaction (null = neutral).
   *  Local-first: garrison and terrain dominate; the national standing pool
   *  only contributes when the owner has actively committed to defend THIS hex. */
  static computeDefenseForce(hex, ownerFaction) {
    const terrain = window.TERRAIN_TYPES[hex.terrain];
    const terrainDef = terrain ? terrain.defense : 1;
    let force = Math.round(hex.localGarrison * terrainDef) + hex.defenseValue;

    if (ownerFaction) {
      const buildingId = ownerFaction.buildings.get(hex.key());
      if (buildingId) {
        const b = window.BUILDINGS[buildingId];
        if (b && b.effects && b.effects.defenseBonus) force += b.effects.defenseBonus;
      }
      if (ownerFaction.isDefending && ownerFaction.defendingHex === hex.key()) {
        const standingSupport = Math.round(Math.min(ownerFaction.calculateMilitary() * 0.3, 50));
        force = Math.round(force * 1.5) + standingSupport;
      }
    }
    return Math.max(1, force);
  }

  /** Single-stage stochastic resolution. SEAM: a future multi-round
   *  attrition model replaces this body only. */
  static resolve(attackForce, defenseForce, rngFn) {
    const attackRoll = Math.round(attackForce * CombatSystem._roll(rngFn));
    const defenseRoll = Math.round(defenseForce * CombatSystem._roll(rngFn));
    return { attackRoll, defenseRoll, attackerWins: attackRoll > defenseRoll };
  }

  /** Deterministic outcome RANGE for previews (spec: show a range, not a %). */
  static forecast(attackForce, defenseForce) {
    const max = CombatSystem.ROLL_MIN + CombatSystem.ROLL_SPAN;
    const low = (attackForce * CombatSystem.ROLL_MIN) / (defenseForce * max);
    const high = (attackForce * max) / (defenseForce * CombatSystem.ROLL_MIN);
    const expected = attackForce / defenseForce;
    return { low, expected, high, band: CombatSystem._band(expected) };
  }

  static _band(ratio) {
    if (ratio < 0.8) return '열세';
    if (ratio < 1.1) return '호각';
    if (ratio < 1.5) return '우세';
    return '압도';
  }
};
