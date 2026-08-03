/**
 * The EVAL BAR's reading, as a band over R — pure, and viewer-safe by construction.
 *
 * Sealed shape (`.scratch/l3-playable-seam/duel-pivot-draft-ledger.md` Gate 6):
 * **LEFT = the clicked front's R, RIGHT = this action's average across eligible
 * fronts.** Band, not needle: position answers who leads, width answers how
 * certain. Width has two parts — REDUCIBLE (the enemy's existing forces, which
 * reconnaissance shrinks) and IRREDUCIBLE (the enemy's this-turn hidden
 * commitment, which nothing can scout). The truth is always inside the band.
 *
 * **Why this can be honest without a single truth read.** `MatchView` hands the
 * viewer their own detachments and garrisons exactly and builds *no opponent
 * object at all* (`projection/project.ts`). What it does carry about the enemy is
 * public: authored terrain and fortification, political control, and `RealmView`.
 * So the numerator is exact and the denominator is a **range bounded by public
 * facts** — which is not a workaround but the model's own stated fallback:
 * "With no observation at all, the band is bounded only by public facts — the
 * register pool caps how many bodies a realm can have serving. That bound is
 * derived, not a dial." (`fog-of-war-discovery/MAGNITUDE.md` FG-M①.)
 *
 * **Equal commit on both sides.** The lever cancels, so this bar carries no
 * commitment information — the position both prototypes' headers state ("NO
 * COMMIT INFO on the bar — EVER"). Ticket 09's acceptance additionally asks for
 * a live marker at the player's chosen commit; that half is contested
 * (`DECISIONS-OWED` Part 2 #3) and is deliberately not built here.
 *
 * Every multiplier is reached through `domain/battle.ts`'s exported power
 * functions rather than copied: `TERRAIN_MULTIPLIER` and
 * `FORTIFICATION_MULTIPLIER` are private consts with one home, and a number
 * restated here would be a dial with two.
 */

import { attackPower, defensePower, type BattleSide } from '../domain/battle.js';
import { combatTerrainOf, fortificationOf, UNIFORM_QUALITY } from '../domain/engagement.js';
import { effectiveness } from '../domain/fatigue.js';
import type { ActorId, MatchView, SectorId } from '../runtime/types.js';

/** A true-containing interval over R, plus the centre the bar prints. */
export interface RBand {
  readonly lo: number;
  readonly mid: number;
  readonly hi: number;
}

/**
 * FG-M①'s sealed half-widths, as the fraction of a reported figure an
 * observation of that grade carries. Read from the dial sheet, not chosen here.
 */
export const RECON_HALF_WIDTH = { normal: 0.25, enhanced: 0.10 } as const;

/** FG-M①'s intersection floor — the sliver no accumulation of looks removes. */
export const IRREDUCIBLE_HALF_WIDTH = 0.05;

export type ReconGrade = keyof typeof RECON_HALF_WIDTH;

/**
 * A side at the equal-commit baseline. Commit is deliberately the same on both
 * sides everywhere in this module, so the lever cancels out of every ratio.
 */
const BASELINE_COMMIT = 0;

function sideOf(substance: number, fatigueLedger: number): BattleSide {
  return {
    substance,
    commit: BASELINE_COMMIT,
    quality: UNIFORM_QUALITY,
    fatigue: effectiveness(fatigueLedger),
  };
}

/** Own combat-ready men standing on a sector, field plus shield. Exact — it is ours. */
export function ownMenAt(view: MatchView, sector: SectorId): { men: number; wear: number } {
  let men = 0;
  let wearMass = 0;
  for (const detachment of view.detachments) {
    const node = view.board.sectors[sector];
    if (node === undefined) continue;
    if (!node.mapUnits.some((hex) => hex.q === detachment.position.q && hex.r === detachment.position.r)) continue;
    men += detachment.readyMen;
    wearMass += detachment.readyMen * detachment.fatigue;
  }
  for (const garrison of view.garrisons) {
    if (garrison.sectorId !== sector) continue;
    men += garrison.readyMen;
  }
  return { men, wear: men === 0 ? 0 : wearMass / men };
}

/**
 * What the enemy could have standing on one sector, from public facts only.
 *
 * Two different public figures do two different jobs here, and conflating them is
 * what made the first version useless:
 *
 * - **The ceiling** is the enemy realm's `forceLimit` — land-derived from ground
 *   the map shows, so public. Unscouted, the honest bracket really is
 *   `[0, everything they can field]`: they may have abandoned this sector or
 *   massed on it, and nothing on screen distinguishes those. That renders as a
 *   near-full bar, which is the correct picture of knowing nothing.
 * - **The centre**, once something has been observed, is the sector's *authored*
 *   `garrison` — a per-sector public figure carried in the frozen world
 *   artifact. It is what makes two sectors read differently at all.
 *
 * An earlier version used `forceLimit / sectors.length` as the centre. That is
 * public but worthless: it smears a concentrated field army evenly over thirty
 * sectors, so every candidate returned the same number and the LEFT bar could
 * not find a soft spot — the one thing it exists to do.
 *
 * Note what this is NOT. A real reading would be an **observation testimony**
 * (fog `RULINGS.md` ③): an interval stamped with the turn it was taken, stored in
 * the Runtime, widened by a sealed ageing envelope before it is read. Ticket 08
 * builds that. This is a public prior narrowed by a grade, which is a different
 * and weaker thing, and it is deliberately weaker so that ticket 08 arrives with
 * its design unprejudiced.
 */
function enemyBracket(
  view: MatchView,
  enemy: ActorId,
  sector: SectorId,
  grade: ReconGrade | null,
): { lo: number; hi: number } {
  const realm = view.realms.find((r) => r.actor === enemy);
  const ceiling = realm?.forceLimit ?? 0;
  if (grade === null) return { lo: 0, hi: ceiling };

  const authored = view.board.sectors[sector]?.garrison ?? 0;
  const half = RECON_HALF_WIDTH[grade];
  return { lo: Math.max(0, authored * (1 - half)), hi: Math.min(ceiling, authored * (1 + half)) };
}

function holderOf(view: MatchView, sector: SectorId): ActorId | null {
  for (const realm of view.realms) if (realm.sectors.includes(sector)) return realm.actor;
  return null;
}

/**
 * R for one sector as a band, from the acting viewer's projection only.
 *
 * `grade` is what this viewer has bought on this sector, if anything. Without it
 * the enemy bracket is `[0, prior x 2]` — near the whole bar, which is the honest
 * rendering of knowing nothing. With it, the reducible half clamps to FG-M①'s
 * half-width for that grade. The irreducible sliver is added either way.
 */
export function bandFor(
  view: MatchView,
  viewer: ActorId,
  sector: SectorId,
  grade: ReconGrade | null,
  /**
   * The force this reading is about.
   *
   * It has to be passed rather than looked up, because the two verbs ask
   * different questions of the same sector. A defence asks about the men already
   * standing there; an **attack asks about the men the player would send**, who
   * are by definition somewhere else. Reading "own men present" for an attack
   * gives zero on every candidate, which collapses every band to the same
   * meaningless value — the first version of this file did exactly that.
   */
  own: { readonly men: number; readonly wear: number },
): RBand | null {
  const node = view.board.sectors[sector];
  if (node === undefined) return null;
  const holder = holderOf(view, sector);
  if (holder === null) return null;

  const defending = holder === viewer;
  const enemy = view.actors.find((actor) => actor !== viewer);
  if (enemy === undefined) return null;

  // A sector is terrain-uniform by seal (TC-⑮, and a test pins it), so any of its
  // hexes names the ground. Reading the first is not a sample, it is the value.
  const layer = node.mapUnits[0]?.terrainLayer;
  if (layer === undefined) return null;
  const terrain = combatTerrainOf(layer);
  const fortification = fortificationOf(node.fortTier);

  // The enemy's substance is the only unknown, so it is the only thing banded.
  const { lo: enemyLo, hi: enemyHi } = enemyBracket(view, enemy, sector, grade);

  // Terrain and fortification belong to whoever holds the ground; the crossing
  // prices the attacker. Both are public, so neither widens the band.
  const powerOf = (men: number, wear: number, isDefender: boolean): number =>
    isDefender
      ? defensePower(sideOf(men, wear), terrain, fortification)
      : attackPower(sideOf(men, wear), 'none');

  const mine = powerOf(own.men, own.wear, defending);
  // A defender's own wear is unknown to us, so the prior stands unworn.
  const theirsLo = powerOf(enemyLo, 0, !defending);
  const theirsHi = powerOf(enemyHi, 0, !defending);

  const ratio = (numerator: number, denominator: number): number =>
    denominator <= 0 ? 2.5 : numerator / denominator;

  // A larger enemy is a smaller R, so the bounds cross over.
  const lo = ratio(mine, theirsHi);
  const hi = ratio(mine, theirsLo);
  const mid = (lo + hi) / 2;
  const sliver = mid * IRREDUCIBLE_HALF_WIDTH;
  return { lo: Math.max(0, lo - sliver), mid, hi: hi + sliver };
}

/**
 * The RIGHT bar: this action's average across the fronts it is eligible on.
 *
 * **Descriptive, never predictive** (the seal is explicit). It aggregates the
 * player's own fogged options so the LEFT bar reads as a meaningful deviation —
 * "where is the soft spot" — and it is not a verdict on the turn.
 */
export function averageBand(
  view: MatchView,
  viewer: ActorId,
  sectors: readonly SectorId[],
  gradeOf: (sector: SectorId) => ReconGrade | null,
  ownAt: (sector: SectorId) => { readonly men: number; readonly wear: number },
): RBand | null {
  const bands = sectors
    .map((sector) => bandFor(view, viewer, sector, gradeOf(sector), ownAt(sector)))
    .filter((band): band is RBand => band !== null);
  if (bands.length === 0) return null;
  const mean = (pick: (band: RBand) => number): number =>
    bands.reduce((sum, band) => sum + pick(band), 0) / bands.length;
  return { lo: mean((b) => b.lo), mid: mean((b) => b.mid), hi: mean((b) => b.hi) };
}

/**
 * R to a vertical percentage, ported from the sealed prototype so the two
 * artifacts read identically: R = 1 sits at the midpoint and the scale clamps to
 * [0.5, 2.5].
 */
export function barPercent(r: number): number {
  return Math.max(3, Math.min(97, 50 + (clampR(r) - 1) * 45));
}

/** The scale's ends. Beyond them the read is "overwhelming", not a finer number. */
export const R_FLOOR = 0.5;
export const R_CEILING = 2.5;

export function clampR(r: number): number {
  return Math.max(R_FLOOR, Math.min(R_CEILING, r));
}

/**
 * The number printed on the bar, clamped to the same scale the bar draws on.
 *
 * The two must never disagree: an unclamped `8.18` beside a bar pinned at the top
 * reads as a bug in whichever the player trusts less, and one of them would be
 * lying about how much the scale can express.
 */
export function barLabel(r: number): string {
  if (r >= R_CEILING) return `≥${R_CEILING.toFixed(2)}`;
  if (r <= R_FLOOR) return `≤${R_FLOOR.toFixed(2)}`;
  return r.toFixed(2);
}
