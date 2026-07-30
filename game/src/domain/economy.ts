/**
 * The land readings — income, the force limit, the register — and the constants
 * they are cut from.
 *
 * Authority: `docs/features/combat-formula/MAGNITUDE.md` **M14** (thin economy:
 * income and the ceiling derive from held sectors every turn, never stored),
 * **M13/MT-②** (the register), **M13a/MT-④** (the start-state coordinates), and
 * match-arc **AB-②** (`capLandFrac 1`). Ledger **D5.1** names these two machines
 * as the whole of the anti-fizzle decay: both recompute from currently-held land,
 * so losing a sector cuts income and ceiling in the same turn.
 *
 * A rule module in the established shape: pure functions over plain values,
 * importing no `MatchState`, called by the Runtime and the projection alike so
 * the two cannot come to disagree about what a realm is worth.
 *
 * **Nothing here stores.** M14's design principle is land-derived state — the
 * only stored stocks in the world are treasury (money) and register (blood).
 */

import type { Sector, SectorId } from '../world/schema.js';
import type { ActorId } from '../runtime/types.js';

/** Sector table, as the artifact holds it. */
export type SectorTable = Readonly<Record<SectorId, Sector>>;

/**
 * Men sustained per point of usable population — `MAGNITUDE.md` M14, sealed.
 * One fully-usable ordinary sector sustains 600 men.
 */
export const CAP_PER_POP = 600;

/**
 * Draftable bodies per point of population — MT-② / M13, sealed 2026-07-07.
 * The register:cap ratio is 3.0, which is what makes `CAP_PER_POP` its derived
 * sibling and the sustain fraction exactly a third.
 */
export const REGISTER_PER_POP = 1_800;

/**
 * The land–ceiling coupling, at its sealed value — match-arc AB-② (2026-07-11),
 * which amends OG-⑤'s same-day frac-0 seal.
 *
 * 1 means fully land-derived: the ceiling follows conquered population reality.
 * Intermediate fractions were rejected as world-meaningless blends, so this is
 * kept as a named constant for legibility rather than as a dial to sweep.
 */
export const CAP_LAND_FRAC = 1;

/** f₀ — armed-peace field fill; the field starts at half its ceiling (M13a). */
export const START_FIELD_FRACTION = 0.5;

/**
 * The shield on one border sector, with g₀ = 1.0 putting it at cap from turn one
 * (M13a). Interior sectors carry none: peace draw-down falls on the field army
 * while the fortress shield stays manned.
 */
export const GARRISON_PER_BORDER_SECTOR = 900;

/**
 * The opening war chest, counted in **turns of the realm's own income**.
 *
 * Two seals speak here and the later one governs. `MAGNITUDE.md` **M14 ruling ㉑**
 * (2026-07-05) sealed a flat "start 생산 5 (가안)". Terrain-cradle **TC-⑭**
 * (2026-07-08), the derived-asymmetry seal beneath SPEC principle #8, then ruled
 * that every playable quantity starts uniform across realms *unless* the inequality
 * is read off the authored map — and named treasury as one of its two worked
 * examples: `treasuryStartTurns × terrain-fed economy`. A flat per-realm constant is
 * precisely the shape TC-⑭ forbids, so it amends ㉑'s form while leaving its
 * 가안 status intact.
 *
 * The multiplier is **가안 3**, the harness's Option B figure
 * (`map-board.js treasuryStartTurns`), already registered in `docs/SYNC-DEBT.md`.
 *
 * Ruling R11 first adopted the flat 5 on the stated premise that nothing was
 * sealed. Both halves of that premise were wrong — ㉑ seals the value and TC-⑭
 * supersedes its form — and R11's row carries the correction.
 */
export const TREASURY_START_TURNS = 3;

/** The opening war chest for a realm earning `income` per turn (TC-⑭). */
export function startingTreasuryOf(income: number): number {
  return TREASURY_START_TURNS * income;
}

/**
 * Men per yield — the bridge between a price quoted in units and a force counted
 * in men.
 *
 * M13 seals the price (**1 unit = 0.5 yield**); the unit's headcount of 100 men
 * is nowhere in the seal chain and reaches here as **가안 adopted by ruling R11**
 * from the L2 harness. Changing it rescales every troop figure the player reads
 * without changing a single decision, which is why it was safe to adopt.
 */
export const MEN_PER_YIELD = 200;

/** Σ over the given sectors, of one numeric reading. */
function sumOver(sectors: SectorTable, ids: readonly SectorId[], read: (sector: Sector) => number): number {
  let total = 0;
  for (const id of ids) {
    const sector = sectors[id];
    if (sector !== undefined) total += read(sector);
  }
  return total;
}

/**
 * Which of the sectors a realm *controls* actually pay it — OG-③'s limbo rule.
 *
 * Occupied-but-untransferred land "counts toward NEITHER side's derived
 * quantities", so the turn a sector changes hands it stops paying its old owner
 * and does not yet pay its new one. That is the half of D5.1's decay that bites
 * immediately: the loser's income and ceiling both fall the same turn.
 *
 * **Limbo is an interval, not an end state — and that is settled.** ADR 0044
 * (2026-07-26) supplies the transfer channel ADR 0042 removed when it retired
 * settlement: acquired land transfers everything it carries — population, economy,
 * the conscription-register share, the mobilization base — on the ADR 0022 / ADR 0029
 * ripening lag (fresh capture at 50/60% usable, +10pp per stable turn), with the
 * register transferring **unripened** because ripening applies to productivity, not
 * to bodies. ADR 0045 amends its item 4: remaining civilians travel with the land,
 * while a serving force's province-origin composition stays with that force.
 *
 * So `homeland` is a mutable record whose *writer* is ticket 06d, not an open design
 * question. This function stays exactly as it is either way — it reads the interval,
 * and 06d ends it.
 *
 * An earlier version of this comment said the conversion question had "no seal saying
 * whether one is needed". That was true when written and false four hours later:
 * ADR 0044 landed the same day, and nobody returned here. See `docs/SYNC-DEBT.md`.
 */
export function holdsOf(
  controlled: readonly SectorId[],
  homeland: Readonly<Record<SectorId, ActorId>>,
  actor: ActorId,
): SectorId[] {
  return controlled.filter((id) => homeland[id] === actor);
}

/** Yield per turn — Σ economyValue × usableEconomy over holds (M14, OG-①). */
export function incomeOf(sectors: SectorTable, holds: readonly SectorId[]): number {
  return sumOver(sectors, holds, (sector) => sector.economyValue * sector.usableEconomy);
}

/**
 * The military ceiling — capPerPop × Σ populationValue × usablePop (M14).
 *
 * Rounded to whole men. Authored population values are thirds and fifths, so the
 * float sum lands on 17999.999999999996 where the arithmetic says 18000, and a
 * ceiling on men that is not a whole number of men is not a ceiling anyone can
 * state. The rounding is the reading, not a dial.
 */
export function forceLimitOf(sectors: SectorTable, holds: readonly SectorId[]): number {
  const derived = CAP_PER_POP * sumOver(sectors, holds, (s) => s.populationValue * s.usablePop);
  // capLandFrac blends a frozen build ceiling toward the derived one. At its
  // sealed 1 the blend is the identity, and the frozen term has no referent in a
  // duel — written out so the sealed dial is visible rather than assumed away.
  return Math.round(CAP_LAND_FRAC * derived);
}

/**
 * The conscription register — total draftable bodies (MT-②).
 *
 * Land-derived **at match start** and a pure stock thereafter: recruitment moves
 * bodies civilian→serving and only death shrinks it. Losing land does not (D5.3:
 * the bodies are real people under occupation — unreachable, not gone), which is
 * why this is called once at setup and never recomputed from holdings.
 */
export function registerOf(sectors: SectorTable, sectorIds: readonly SectorId[]): number {
  // Whole bodies, for the same reason the force limit is whole men.
  return Math.round(REGISTER_PER_POP * sumOver(sectors, sectorIds, (sector) => sector.populationValue));
}

/** A sector's worth as OG-② reads it: population plus economy. */
export function landValueOf(sectors: SectorTable, holds: readonly SectorId[]): number {
  return sumOver(sectors, holds, (sector) => sector.populationValue + sector.economyValue);
}
