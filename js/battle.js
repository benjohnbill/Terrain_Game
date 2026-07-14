'use strict';

/* Sealed dials (ports — birthplace = combat-formula MAGNITUDE). */
const TERRAIN = { plains: 1.0, forest: 1.2, hills: 1.2, mountains: 1.5, pass: 2.0, legendary: 2.5 }; // M5
const FORT    = { none: 1.0, fieldworks: 1.3, walls: 1.8, fortress: 2.4, legendary: 3.0 };           // M5
const LEVER_ANCHORS = [[0, 1.0], [4, 1.25], [8, 1.5], [14, 1.75], [20, 2.0]];                        // M2
const CASUALTY_BASE = 0.12; // M4
const CASUALTY_EXP  = 1.4;  // M4
const SHIELD_BREAK_THRESHOLD = 1.5; // M7 Swift Seizure
const ROUT_FRAC = 0.30;               // M4 rout cliff
const ROUT_OPEN_REMAINDER_LOSS = 0.5; // M4 escape OPEN — 50% of the remainder falls in the pursuit

/* Slice-2 ticket 03 (교전 v2) — symmetric grammar (spec §1). Per-side power is
   substance × commit lever × quality × fatigue; both sides of the 결전 compose
   identically through sidePower. Quality is the sealed slot ported at 1.0 (no
   tech system this slice, rider b). Fatigue arrives as a per-side INPUT from the
   ticket-01 curve — the flat FIELD_ARMY_MARCH_WORN = 0.75 dial is RETIRED. Both
   default to 1.0 (fresh/baseline), so an omitted side reproduces raw substance ×
   lever; a marched force passes its ticket-01 effectiveness explicitly. */
const QUALITY_DEFAULT = 1.0;
const FATIGUE_DEFAULT = 1.0;

/* Delaying Defense (지연 방어) 가안 bands — birthplace = operation-plan-catalog
   CATALOG claim block (pointer, not restated). Provisional; magnitude pass
   re-cuts. The bargain: "not taken this turn" is cheap, decisive repulsion is
   off the menu, an attacker seizes the sector only by heavily over-committing. */
const DELAY_BREAKTHROUGH_R  = 2.0;  // 가안 — over-commit ratio to overrun a delaying screen and seize
const DELAY_EROSION_PER_TURN = 0.15; // 가안 — the sector's defensive state degrades each delayed turn

function terrainMultiplier(terrain) {
  const m = TERRAIN[terrain];
  if (m === undefined) throw new Error('unknown terrain: ' + terrain);
  return m;
}
function fortMultiplier(fort) {
  const m = FORT[fort];
  if (m === undefined) throw new Error('unknown fortification: ' + fort);
  return m;
}

function commitLever(points) {
  const p = Math.max(0, Math.min(20, points));
  for (let i = 1; i < LEVER_ANCHORS.length; i++) {
    const [x0, y0] = LEVER_ANCHORS[i - 1];
    const [x1, y1] = LEVER_ANCHORS[i];
    if (p <= x1) return y0 + (y1 - y0) * (p - x0) / (x1 - x0);
  }
  return 2.0;
}

function shieldPower(front) {
  return front.garrison * terrainMultiplier(front.terrain) * fortMultiplier(front.fortification);
}

function casualtyFractions(R) {
  return {
    attacker: Math.min(1, CASUALTY_BASE / Math.pow(R, CASUALTY_EXP)),
    defender: Math.min(1, CASUALTY_BASE * Math.pow(R, CASUALTY_EXP)),
  };
}

/* The per-side power product (spec §1). Quality/fatigue default to 1.0 so both
   sides of the 결전 — and the attacker at the first blow — compose identically. */
function sidePower({ substance, commit = 0, quality = QUALITY_DEFAULT, fatigue = FATIGUE_DEFAULT }) {
  return substance * commitLever(commit) * quality * fatigue;
}

/* Adapter: an army entity's power, optionally after casualties (substance
   override). Collapses the four 결전/screen call sites to one line each. */
function sidePowerOf(entity, substance = entity.size) {
  return sidePower({ substance, commit: entity.commit, quality: entity.quality, fatigue: entity.fatigue });
}

/* Delaying Defense (지연 방어) — a categorical input to the ONE calculator. The
   delayer trades ground for time: it fights the same committed stake as
   Stronghold (terrain screen + its field army) as one continuous screen rather
   than a wall-then-stand, and the payout table shifts (catalog claim block):
   decisive repulsion is off the menu, "not taken this turn" is cheap, and the
   attacker seizes the sector only by heavily over-committing. No rout in either
   direction — the attacker is never punished, the delayer dissolves (never
   annihilated) on withdrawal. */
function resolveDelaying({ attacker, front, fieldArmy }, attackPower) {
  const fieldArmyScreen = fieldArmy && fieldArmy.reaches ? sidePowerOf(fieldArmy) : 0;
  const screen = shieldPower(front) + fieldArmyScreen;
  const Rd = attackPower / screen;
  const cd = casualtyFractions(Rd);
  const held = Rd < DELAY_BREAKTHROUGH_R; // "not taken this turn"; over-commit past the band to seize
  return {
    branch: 'DELAYING', defensePlan: 'DELAYING',
    shieldBreak: !held,   // the screen is overrun only on a breakthrough seize
    casualties: { attacker: attacker.size * cd.attacker, defenderShield: front.garrison * cd.defender },
    delaying: {
      Rd, held,
      outcome: held ? 'NOT_TAKEN' : 'CEDED',
      attackerRouted: false,     // decisive repulse off the menu — a weak attacker is never punished
      delayerAnnihilated: false, // catalog failure model = dissolution, never annihilation
      erosionTick: held ? DELAY_EROSION_PER_TURN : 0, // the held sector degrades each delayed turn
      routeDisruption: true,     // signature self side effect — bridges burned in withdrawal to buy time
    },
  };
}

function resolveEngagement(input) {
  const { attacker, front, fieldArmy, escape } = input;
  const defensePlan = input.defensePlan || 'STRONGHOLD';

  // FIRST BLOW — the attacker (worn by its march arrival) vs the front's raw
  // shield. The standing shield's defense commit is baseline ×1.0 (spec §8,
  // caught flat) and a garrison carries no march fatigue; the attacker's own
  // fatigue/quality price the arrival R (ticket 02: arrival fatigue is the
  // combat penalty, no separate one).
  const attackPower1 = sidePowerOf(attacker);

  if (defensePlan === 'DELAYING') return resolveDelaying(input, attackPower1);

  // STRONGHOLD (거점 방어) — the sealed slice-1 spine, unchanged in structure.
  const shield = shieldPower(front);
  const R1 = attackPower1 / shield;
  const c1 = casualtyFractions(R1);
  const attackerAfter = attacker.size * (1 - c1.attacker);
  const base = {
    firstBlowR: R1,
    casualties: { attacker: attacker.size * c1.attacker, defenderShield: front.garrison * c1.defender },
  };

  if (R1 < SHIELD_BREAK_THRESHOLD) return { branch: 'REPULSED', defensePlan, shieldBreak: false, ...base };
  if (!fieldArmy.reaches)          return { branch: 'FALL',     defensePlan, shieldBreak: true,  ...base };

  // DECISIVE (결전) — the symmetric commit duel. The defender's field army
  // carries its OWN commit lever, quality, and fatigue (rider a); open field,
  // so no terrain/fort multiplier (WM-① unchanged).
  const attackPower2  = sidePowerOf(attacker, attackerAfter);
  const defensePower2 = sidePowerOf(fieldArmy);
  const R2 = attackPower2 / defensePower2;
  const c2 = casualtyFractions(R2);
  const attackerWins = R2 >= 1;
  const loserBattleLoss = attackerWins ? c2.defender : c2.attacker;
  const routed = loserBattleLoss >= ROUT_FRAC;
  const annihilated = routed && escape === 'BLOCKED';
  const loserTotalLoss = !routed ? loserBattleLoss
    : annihilated ? 1
    : Math.min(1, loserBattleLoss + ROUT_OPEN_REMAINDER_LOSS * (1 - loserBattleLoss));
  return {
    branch: 'DECISIVE', defensePlan, shieldBreak: true, ...base,
    decisiveBattle: { R2, attackerWins, routed, escape, annihilated, loserTotalLoss },
  };
}

const _api = { terrainMultiplier, fortMultiplier, commitLever, shieldPower, casualtyFractions, sidePower, resolveEngagement };
if (typeof module !== 'undefined' && module.exports) module.exports = _api;
else (window.Battle = window.Battle || {}), Object.assign(window.Battle, _api);
