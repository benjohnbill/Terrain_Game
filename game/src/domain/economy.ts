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
 * The capital guard's coefficient — **capital CP-⑤** (2026-07-31), 가안 2,500 per
 * point of the capital sector's `populationValue`.
 *
 * 가안, and settled by playtest rather than by derivation. What *is* derived is the
 * floor beneath it: CP-② item 7 seals the guard as a garrison class at **larger**
 * magnitude than an ordinary one, R3 lets a player seat a capital on any owned
 * sector, and the weakest legal sector on this board carries pop 0.5 — so honouring
 * item 7 at every legal capital needs at least 1,800. 2,500 is the user's choice
 * above that floor, and a later change is a value change at CP-⑤, not a redesign.
 */
export const CAPITAL_GUARD_PER_POP = 2500;

/**
 * The guard a capital sector carries — land-derived from that sector alone (CP-①
 * item 2, coefficient re-cut by CP-⑤).
 *
 * Floored for the reason `forceLimitOf` floors: this counts people. Authored
 * populations are thirds and fifths, so the exact product lands on 3333.33 as often
 * as on a round number, and a fractional man is not something a register can back.
 *
 * Note what this does **not** read: where the bodies come from. CP-⑥ apportions the
 * guard's origins across the whole realm, so magnitude and backing are deliberately
 * two questions with two answers — this is only the first.
 */
export function capitalGuardOf(populationValue: number): number {
  return Math.floor(CAPITAL_GUARD_PER_POP * populationValue);
}

/**
 * Room left in one sector's garrison, given what already mans it and what guard —
 * if any — stands there.
 *
 * Beside the constant rather than at each caller, because four surfaces ask this
 * question — recruitment's garrison headroom, the Runtime's posture sites, the
 * preview's copy of them, and the tests — and the cap is local by seal (ADR 0014
 * keeps garrison ceilings local, M13a sizes them), so a caller that clamped
 * differently would be quietly re-cutting the ceiling.
 *
 * **`capitalGuard` is required rather than defaulted, and that is the point.** A
 * default of 0 would let a caller forget the capital and silently re-cut its ceiling
 * back to 900 — precisely the drift the paragraph above exists to prevent — whereas a
 * required parameter makes the compiler move all four callers together.
 *
 * The composition is **additive** by **CP-⑦** (2026-08-01): where a capital also
 * carries an ordinary border shield — 179 of 840 legal capital sites — the two stand
 * together rather than one replacing the other, so the ceiling is their sum. Pass 0
 * for every sector that is not its owner's capital.
 */
export function garrisonHeadroomOf(manned: number, capitalGuard: number): number {
  return Math.max(0, GARRISON_PER_BORDER_SECTOR + capitalGuard - manned);
}

/**
 * What freshly taken ground is worth, and how fast it ripens — **ADR 0022 / ADR
 * 0029, unchanged**, supplied a transfer channel by ADR 0044.
 *
 * A capture starts at half its economy and three fifths of its population and
 * recovers ten percentage points per stable turn — so against fully-authored land
 * the population is whole after four stable turns and the economy after five.
 * (ADR 0029 calls it "the ~4-turn ripening transient"; the two fractions simply do
 * not finish together.) `AGENTS.md`'s standing guardrail against instant full-value
 * transfer is what forbids shortening this.
 *
 * A **stable turn** is ADR 0022's own test, and all three clauses matter: the sector
 * "ends the turn under the same faction, was not contested during that turn, and was
 * not the target of active attack/defense resolution". The turn of the capture fails
 * every one of them, which is what makes limbo an interval rather than a formality.
 *
 * **Productivity only.** ADR 0044 item 3: ADR 0029 names "yield AND military
 * ceiling", so income and the force limit ripen — the register is a body count and
 * transfers unripened. Do not compose these with `REGISTER_PER_POP`.
 *
 * ADR 0044 item 5 also records what these are *not*: a risk device. The lag is the
 * fruit arriving slowly. Reading ADR 0029's "the ~4-turn ripening transient is the
 * counterattack window" as an anti-runaway mechanism was proposed and rejected.
 */
export const FRESH_CAPTURE_USABLE_ECONOMY = 0.5;
export const FRESH_CAPTURE_USABLE_POP = 0.6;
export const RIPENING_PER_TURN = 0.1;

/**
 * `conquest damage` — a **named seam at identity**, not a live dial.
 *
 * The phrase is used by ADR 0029 and by the match-arc `정산` GLOSSARY row ("vs
 * conquest damage + M6 inheritance cost"), and **no rule or value anywhere defines
 * it**. Its only contrast was settlement, which ADR 0042 retired, so it currently
 * floats. It is also a live candidate device for the deferred snowball-counterweight
 * session, where "freshly taken ground is weakly held" is exactly what ADR 0044
 * item 6's directions (a) and (b) want.
 *
 * So it goes in at 1.0, multiplying nothing, so that session lands a **value change
 * rather than a redesign** — the discipline 06b applies to its HELD recovery
 * condition. The tension it will have to resolve is recorded and deliberately not
 * resolved here: 노화 헌법 P2 allows permanent damage only through identity acts
 * (초토화, out of scope by R9), so conquest damage cannot be permanent and would
 * have to act on recovery speed — which is what the ripening lag already does.
 */
export const CONQUEST_DAMAGE = 1;

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
function sumOver(sectors: SectorTable, ids: readonly SectorId[], read: (sector: Sector, id: SectorId) => number): number {
  let total = 0;
  for (const id of ids) {
    const sector = sectors[id];
    if (sector !== undefined) total += read(sector, id);
  }
  return total;
}

/**
 * Stable turns each still-ripening sector has completed since it integrated.
 *
 * Absent means "not ripening" — either native ground, or acquired ground that has
 * reached its authored usable value and had its entry dropped. So the empty map is
 * the honest opening state and every reader below degrades to the authored value.
 */
export type RipeningTurns = Readonly<Record<SectorId, number>>;

/**
 * The empty ripening state, named so a caller has to say it means nothing is
 * settling rather than leave the argument off.
 *
 * `incomeOf` and `forceLimitOf` take `ripening` as a **required** parameter for the
 * same reason the retired flat `0.75` became an explicit `fatigue:` input in
 * ticket 03: a forgotten argument here would silently return full authored value,
 * which is exactly the instant-full-value transfer `AGENTS.md` guards against. A
 * default would have made the guardrail's own failure mode the easy path.
 */
export const NOTHING_RIPENING: RipeningTurns = Object.freeze({});

/** How much of a sector's authored economy is usable now (ADR 0022). */
export function usableEconomyOf(sector: Sector, stableTurns: number | undefined): number {
  if (stableTurns === undefined) return sector.usableEconomy;
  return Math.min(
    sector.usableEconomy,
    FRESH_CAPTURE_USABLE_ECONOMY + RIPENING_PER_TURN * stableTurns,
  );
}

/** How much of a sector's authored population is usable now (ADR 0022). */
export function usablePopOf(sector: Sector, stableTurns: number | undefined): number {
  if (stableTurns === undefined) return sector.usablePop;
  return Math.min(
    sector.usablePop,
    FRESH_CAPTURE_USABLE_POP + RIPENING_PER_TURN * stableTurns,
  );
}

/**
 * Whether a sector has finished ripening, so its entry can be dropped.
 *
 * The record is kept sparse on purpose: a permanent entry per conquered sector
 * would make "is this ground still settling" a value comparison at every reader
 * instead of a key lookup, and would leave the opening state carrying 56 rows that
 * all say "nothing is happening".
 */
export function fullyRipened(sector: Sector, stableTurns: number): boolean {
  return usableEconomyOf(sector, stableTurns) >= sector.usableEconomy &&
    usablePopOf(sector, stableTurns) >= sector.usablePop;
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

/**
 * Yield per turn — Σ economyValue × usableEconomy over holds (M14, OG-①).
 *
 * `ripening` is what makes acquired land pay in slowly rather than at once: it is
 * the ADR 0022/0029 lag, and `AGENTS.md`'s guardrail against instant full-value
 * transfer is why it is a parameter here rather than an optional refinement.
 */
export function incomeOf(
  sectors: SectorTable,
  holds: readonly SectorId[],
  ripening: RipeningTurns,
): number {
  return sumOver(sectors, holds, (sector, id) =>
    sector.economyValue * usableEconomyOf(sector, ripening[id]));
}

/**
 * The military ceiling — capPerPop × Σ populationValue × usablePop (M14).
 *
 * Rounded to whole men. Authored population values are thirds and fifths, so the
 * float sum lands on 17999.999999999996 where the arithmetic says 18000, and a
 * ceiling on men that is not a whole number of men is not a ceiling anyone can
 * state. The rounding is the reading, not a dial.
 */
export function forceLimitOf(
  sectors: SectorTable,
  holds: readonly SectorId[],
  ripening: RipeningTurns,
): number {
  const derived = CAP_PER_POP * sumOver(sectors, holds, (s, id) =>
    s.populationValue * usablePopOf(s, ripening[id]));
  // capLandFrac blends a frozen build ceiling toward the derived one. At its
  // sealed 1 the blend is the identity, and the frozen term has no referent in a
  // duel — written out so the sealed dial is visible rather than assumed away.
  return Math.round(CAP_LAND_FRAC * derived);
}

/**
 * The conscription register — draftable bodies on a given stretch of land (MT-②).
 *
 * Land-derived **at match start** and a stock thereafter, moved by exactly two
 * things: death takes bodies out of the world, and **land transfer moves them
 * between realms** (ADR 0044). It is still never *recomputed from holdings* — a
 * realm that loses ground does not have its register re-derived — but the older
 * reading of that, "losing land does not shrink the register at all" (ledger D5.3),
 * is **dissolved**: ADR 0044 § Context found D5.3's corollary was a deduction from
 * permanent limbo, and permanent limbo is what ADR 0042 removed.
 *
 * So the distinction this comment has to keep straight is: not recomputed, but
 * moved. Called per sector at setup, and thereafter only as the transfer's input —
 * the *nominal* reading a sector would carry, which a capture deliberately does not
 * use (ADR 0044 item 4: handing over the nominal register would resurrect the dead
 * as the enemy's draftees). What a capture moves is the civilians standing there.
 */
export function registerOf(sectors: SectorTable, sectorIds: readonly SectorId[]): number {
  // Whole bodies, for the same reason the force limit is whole men.
  return Math.round(REGISTER_PER_POP * sumOver(sectors, sectorIds, (sector) => sector.populationValue));
}

/** A sector's worth as OG-② reads it: population plus economy. */
export function landValueOf(sectors: SectorTable, holds: readonly SectorId[]): number {
  return sumOver(sectors, holds, (sector) => sector.populationValue + sector.economyValue);
}
