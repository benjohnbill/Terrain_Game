/**
 * The decisive-battle calculator: pure functions over plain values, with no
 * access to match state and no board mutation.
 *
 * Authority: combat-formula FORMULA D1/D5/D6/D10/D11; MAGNITUDE M2/M4/M5;
 * operation-plan-catalog CATALOG Delaying Defense; ADR 0015; and
 * war-model-build WM-①/WM-②.
 */

/** M2: attention starts at ×1, bends at eight points, and saturates at ×2. */
export function commitLever(points: number): number {
  const committed = Math.max(0, Math.min(20, points));
  if (committed <= 8) return 1 + committed / 16;
  return 1.5 + (committed - 8) / 24;
}

/** One side of the D6 grammar; callers supply every ledger-derived value. */
export interface BattleSide {
  readonly substance: number;
  readonly commit: number;
  readonly quality: number;
  readonly fatigue: number;
}

/** D6 / WM-②: the same product is used for attacker and defender alike. */
export function sidePower(side: BattleSide): number {
  return side.substance * commitLever(side.commit) * side.quality * side.fatigue;
}

const TERRAIN_MULTIPLIER = {
  plains: 1,
  forestHills: 1.2,
  mountains: 1.5,
  pass: 2,
  legendaryNaturalSite: 2.5,
} as const;

const FORTIFICATION_MULTIPLIER = {
  none: 1,
  fieldWorks: 1.3,
  townWalls: 1.8,
  fortress: 2.4,
  legendaryFortress: 3,
} as const;

const CROSSING_MULTIPLIER = {
  none: 1,
  riverUncontested: 0.85,
  riverOpposed: 0.7,
  straitUncontested: 0.7,
  straitOpposed: 0.55,
} as const;

const CASUALTY_BASE = 0.12;
const CASUALTY_EXPONENT = 1.4;
const ROUT_FRACTION = 0.3;
const OPEN_ESCAPE_REMAINDER_LOSS = 0.5;
const DELAYING_BREAKTHROUGH_RATIO = 2;
const DELAYING_FORTIFICATION_DAMAGE = 0.15;

export type BattleTerrain = keyof typeof TERRAIN_MULTIPLIER;
export type BattleFortification = keyof typeof FORTIFICATION_MULTIPLIER;
export type BattleCrossing = keyof typeof CROSSING_MULTIPLIER;

/** M5: terrain and fortification are defender-owned world multipliers. */
export function defensePower(
  side: BattleSide,
  terrain: BattleTerrain,
  fortification: BattleFortification,
): number {
  return sidePower(side) * TERRAIN_MULTIPLIER[terrain] * FORTIFICATION_MULTIPLIER[fortification];
}

/** ADR 0015: water weakens the engagement's attacker; it is not march cost. */
export function attackPower(side: BattleSide, crossing: BattleCrossing): number {
  return sidePower(side) * CROSSING_MULTIPLIER[crossing];
}

export interface CasualtyFractions {
  readonly attacker: number;
  readonly defender: number;
}

/** M4 / D11: one continuous, headline-blind curve for both sides. */
export function casualtyFractions(powerRatio: number): CasualtyFractions {
  const ratioTerm = Math.pow(powerRatio, CASUALTY_EXPONENT);
  return {
    attacker: Math.min(1, CASUALTY_BASE / ratioTerm),
    defender: Math.min(1, CASUALTY_BASE * ratioTerm),
  };
}

export type EscapeState = 'OPEN' | 'BLOCKED';
export type DefenseMethod = 'STRONGHOLD' | 'DELAYING';

export interface BattleParticipant extends BattleSide {
  readonly escape: EscapeState;
}

export interface BattleInput {
  readonly attacker: BattleParticipant;
  readonly defender: BattleParticipant;
  readonly terrain: BattleTerrain;
  readonly fortification: BattleFortification;
  readonly crossing: BattleCrossing;
  readonly defenseMethod?: DefenseMethod;
}

export interface SideBattleOutcome {
  readonly power: number;
  /** Blood paid before any rout conversion. */
  readonly battleCasualties: number;
  /** Additional blood paid while a routed force tries to escape. */
  readonly pursuitCasualties: number;
  readonly casualties: number;
  readonly survivors: number;
  readonly routed: boolean;
  readonly escape: EscapeState;
  /** Routed survivors who disperse through an open escape route. */
  readonly escaped: number;
}

export interface BattleOutcome {
  readonly defenseMethod: DefenseMethod;
  readonly winner: 'ATTACKER' | 'DEFENDER' | 'NEITHER';
  readonly sectorFalls: boolean;
  /** Delaying's erosion clock, expressed on its canonical effect axis. */
  readonly fortificationDamage: number;
  readonly routeDisrupted: boolean;
  readonly attacker: SideBattleOutcome;
  readonly defender: SideBattleOutcome;
}

function sideOutcome(
  participant: BattleParticipant,
  power: number,
  battleLossFraction: number,
  routed: boolean,
): SideBattleOutcome {
  const battleCasualties = participant.substance * battleLossFraction;
  const remainder = participant.substance - battleCasualties;
  const pursuitCasualties = !routed
    ? 0
    : participant.escape === 'BLOCKED'
      ? remainder
      : remainder * OPEN_ESCAPE_REMAINDER_LOSS;
  const casualties = battleCasualties + pursuitCasualties;
  const survivors = participant.substance - casualties;

  return {
    power,
    battleCasualties,
    pursuitCasualties,
    casualties,
    survivors,
    routed,
    escape: participant.escape,
    escaped: routed ? survivors : 0,
  };
}

/**
 * Resolves one deterministic sector battle without reading or writing a board.
 * Stronghold is the standing posture; callers must supply both sides' fatigue.
 */
export function resolveBattle(input: BattleInput): BattleOutcome {
  const defenseMethod = input.defenseMethod ?? 'STRONGHOLD';
  const attackerPower = attackPower(input.attacker, input.crossing);
  const defenderPower = defensePower(input.defender, input.terrain, input.fortification);
  const powerRatio = attackerPower / defenderPower;
  const losses = casualtyFractions(powerRatio);
  const delaying = defenseMethod === 'DELAYING';
  const attackerWins = delaying
    ? attackerPower >= defenderPower * DELAYING_BREAKTHROUGH_RATIO
    : attackerPower > defenderPower;
  const attackerRouted =
    !delaying && !attackerWins && input.attacker.substance > 0 && losses.attacker >= ROUT_FRACTION;
  const defenderRouted =
    !delaying && attackerWins && input.defender.substance > 0 && losses.defender >= ROUT_FRACTION;

  return {
    defenseMethod,
    winner: attackerWins ? 'ATTACKER' : delaying ? 'NEITHER' : 'DEFENDER',
    sectorFalls: attackerWins,
    fortificationDamage: delaying && !attackerWins ? DELAYING_FORTIFICATION_DAMAGE : 0,
    routeDisrupted: delaying,
    attacker: sideOutcome(input.attacker, attackerPower, losses.attacker, attackerRouted),
    defender: sideOutcome(input.defender, defenderPower, losses.defender, defenderRouted),
  };
}
