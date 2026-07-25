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
 * The war chest a realm opens with, in yield.
 *
 * **가안, adopted by ruling R11 (2026-07-26)** from the L2 harness, where it was
 * marked provisional and never brought back. Roughly a sixth of one turn's
 * income on this board. Repayable in play.
 */
export const TREASURY_START = 5;

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
 * quantities". A duel has no settlement channel to transfer it through (ADR 0042
 * retired settlement entirely; war and match are one), so occupied land stays in
 * limbo for as long as it is held: **conquest subtracts from the loser and adds
 * nothing to the winner**, and recapture restores the original owner's claim.
 *
 * That is what makes the decay converge rather than compound — the leader does
 * not inflate on captured ground while the trailing realm starves.
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
