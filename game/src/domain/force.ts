/**
 * Positioned military substance and its **sector**-origin accounting.
 *
 * Authority: match-arc MT-⑥, war-model-build WM-④, and ADR 0045. Origin is
 * accounting state rather than a formation attribute: movement never changes
 * it, while every serving body remains traceable to one living register.
 *
 * **The grain is the sector, and it moved here on 2026-07-31** — a user ruling
 * that amends ADR 0045's title and its items 2, 4 and 5, whose text still reads
 * "province". Two reasons, and the second is the load-bearing one:
 *
 * - the register moved the same day (MT-② amended), because its own derivation
 *   `registerPerPop × Σ populationValue` reads a **sector** field, so storing the
 *   sum per province discarded per-sector variation;
 * - and these two cannot sit at different grains. `availableCivilians =
 *   register − serving` joins them on one key. Province-keyed origin against a
 *   sector-keyed register makes every casualty a lookup miss, and a capture could
 *   not value one taken sector's civilians without re-deriving the apportionment
 *   (R17) that sector grain exists to supersede.
 */

import type { HexPosition, SectorId } from '../world/schema.js';

/**
 * Serving bodies by the sector whose living register they were drawn from.
 *
 * Not a position and not a formation attribute: a cohort raised in one sector and
 * marched across the board still answers to that sector's register. That is what
 * makes `register − serving` a conservation law rather than a coincidence, and it
 * is why a captured sector's *civilians* transfer while its serving men stay with
 * their realm (ADR 0045 item 4, at this grain).
 */
export type OriginComposition = Readonly<Record<SectorId, number>>;

export interface ForceCohort {
  readonly origins: OriginComposition;
  /**
   * The **wear** ledger, and only that one: march and battle in, effectiveness
   * out, floored at ×0.5 (`domain/fatigue.ts`). It never kills.
   *
   * The gauge has a *second* account — supply, whose failure removes men and never
   * touches effectiveness — and the two are deliberately not one number. No supply
   * account is stored anywhere in match state: every force is supplied in this
   * slice, so the account would be dead until the supply design pass (R16,
   * `docs/DESIGN-RISKS.md`) gives it a cause. Do not collapse the two.
   */
  readonly fatigue: number;
}

export interface PendingCohort extends ForceCohort {
  readonly readyOnTurn: number;
  readonly sourceSector: SectorId;
}

export interface MovementOrder {
  readonly destination: HexPosition;
  readonly route: readonly HexPosition[];
  readonly forcedMarch: boolean;
}

export interface Detachment {
  readonly id: string;
  position: HexPosition;
  ready: ForceCohort;
  pending: PendingCohort[];
  movement: MovementOrder | null;
}

export interface GarrisonForce {
  ready: OriginComposition;
  pending: PendingCohort[];
}

type FormationDetachment = Pick<Detachment, 'id' | 'position'> & { readonly men: number };

export const menOf = (origins: OriginComposition): number =>
  Object.values(origins).reduce((sum, men) => sum + men, 0);

type ForceCollection = {
  readonly openingField: ForceCohort | null;
  readonly detachments: readonly Detachment[];
};

export function accumulateOrigins(
  destination: Record<SectorId, number>,
  origins: OriginComposition,
): void {
  for (const [sector, men] of Object.entries(origins)) {
    destination[sector] = (destination[sector] ?? 0) + men;
  }
}

function totalPending(pending: readonly PendingCohort[]): number {
  return pending.reduce((sum, cohort) => sum + menOf(cohort.origins), 0);
}

/** All positioned and setup-only field substance. */
export function fieldOf(forces: ForceCollection): number {
  const opening = forces.openingField === null ? 0 : menOf(forces.openingField.origins);
  return opening + forces.detachments.reduce(
    (sum, detachment) => sum + menOf(detachment.ready.origins) + totalPending(detachment.pending),
    0,
  );
}

/** Serving bodies by sector origin across field and local-garrison posture. */
export function servingByOrigin(
  forces: ForceCollection,
  garrisons: readonly GarrisonForce[],
): Record<SectorId, number> {
  const serving: Record<SectorId, number> = {};
  if (forces.openingField !== null) accumulateOrigins(serving, forces.openingField.origins);
  for (const detachment of forces.detachments) {
    accumulateOrigins(serving, detachment.ready.origins);
    for (const cohort of detachment.pending) accumulateOrigins(serving, cohort.origins);
  }
  for (const garrison of garrisons) {
    accumulateOrigins(serving, garrison.ready);
    for (const cohort of garrison.pending) accumulateOrigins(serving, cohort.origins);
  }
  return serving;
}

/** Living civilians still available to serve, derived exactly rather than stored. */
export function availableCiviliansByOrigin(
  registers: Readonly<Record<SectorId, number>>,
  serving: Readonly<Record<SectorId, number>>,
): Record<SectorId, number> {
  const available: Record<SectorId, number> = {};
  for (const sector of Object.keys(registers).sort()) {
    const civilians = registers[sector]! - (serving[sector] ?? 0);
    if (civilians < 0) {
      throw new Error(`Serving bodies from ${sector} exceed its living register.`);
    }
    available[sector] = civilians;
  }
  return available;
}

/**
 * Allocate one exact integer total over integer weights. Floors are filled first;
 * largest fractional remainders win, with canonical key order breaking ties.
 *
 * Exported because men are apportioned over more than one kind of key: over
 * sector origins (below), and over the several formations that shared one
 * engagement when its blood is taken. Both need the *same* exactness — the parts
 * sum to the total, always — and a second copy of this loop is how the two would
 * come to lose or invent a man between them.
 */
export function apportionExact(
  total: number,
  weights: Readonly<Record<string, number>>,
): Record<string, number> {
  const keys = Object.keys(weights).sort();
  const weightTotal = keys.reduce((sum, key) => sum + weights[key]!, 0);
  if (!Number.isInteger(total) || total < 0 || total > weightTotal) {
    throw new Error(`Cannot allocate ${total} men over ${weightTotal} available bodies.`);
  }
  if (total === 0) return Object.fromEntries(keys.map((key) => [key, 0]));

  const allocated: Record<string, number> = {};
  const remainders: { readonly key: string; readonly fraction: number }[] = [];
  let assigned = 0;
  for (const key of keys) {
    const exact = total * weights[key]! / weightTotal;
    const whole = Math.floor(exact);
    allocated[key] = whole;
    assigned += whole;
    remainders.push({ key, fraction: exact - whole });
  }
  remainders.sort((a, b) =>
    b.fraction - a.fraction || (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
  for (let index = 0; assigned < total; index += 1, assigned += 1) {
    const key = remainders[index]!.key;
    allocated[key] = allocated[key]! + 1;
  }
  return allocated;
}

/** Canonical integer apportionment over sector-origin capacity. */
export function apportionOrigins(
  total: number,
  weights: Readonly<Record<SectorId, number>>,
): Record<SectorId, number> {
  return apportionExact(total, weights);
}

/**
 * Divide one composition into the part that stays and the part that goes, from a
 * **single** apportionment.
 *
 * Exported because that singleness is the whole contract. `apportionExact`'s own
 * docstring gives the reason — "a second copy of this loop is how the two would come
 * to lose or invent a man between them" — and calling it twice on the same
 * composition is exactly that second copy: the two halves each round exactly, so
 * their *totals* conserve, while per origin they need not. `{A:3,B:3}` split at 1
 * gives `{A:0,B:1}` and `{A:2,B:3}`, which sums to `{A:2,B:4}` — a man teleported
 * from A to B. Origin composition is accounting state joined to the register by
 * `register − serving`, so that drift eventually pushes a sector's civilians
 * negative and `availableCiviliansByOrigin` throws mid-match.
 *
 * So: any caller that needs *both* halves must take them from here, together.
 * `subtractOrigins` is for callers that genuinely only want the remainder.
 */
export function partitionOrigins(
  origins: OriginComposition,
  childMen: number,
): readonly [OriginComposition, OriginComposition] {
  const child = apportionExact(childMen, origins);
  const retained: Record<SectorId, number> = {};
  for (const sector of Object.keys(origins).sort()) {
    retained[sector] = origins[sector]! - (child[sector] ?? 0);
  }
  return [retained, child];
}

/**
 * Take an exact whole number of men out of a composition, proportionally.
 *
 * The **leaving-service** half of the two laws WM-⑤ separates: it shrinks the
 * formation and says nothing at all about the register, where a casualty shrinks
 * both. Exact by `apportionExact`, so the parts still sum and no origin loses a
 * body it did not have.
 */
export function subtractOrigins(origins: OriginComposition, men: number): OriginComposition {
  return partitionOrigins(origins, men)[0];
}

/**
 * Take `men` out of a detachment's **ready** cohort, or report the formation gone.
 *
 * WM-⑤'s leaving-service law as formation surgery rather than orchestration: it
 * belongs beside `splitDetachment` and `mergeDetachments`, which own every other
 * way a formation changes shape, and it says nothing at all about the register —
 * that is the half a casualty pays and this one does not.
 *
 * Returns `null` when there is no longer a formation to keep. Cohorts still
 * forming were not in the battle and did not rout, so they stay, and a detachment
 * that still carries one survives at zero ready men — the same rule 06c's casualty
 * path applies for the same reason: it is still a body of men, just not a
 * combat-ready one.
 */
export function withdrawFromDetachment(
  detachment: Detachment,
  men: number,
): { readonly detachment: Detachment | null; readonly withdrawn: OriginComposition } {
  // Both halves from **one** `partitionOrigins`, never two subtractions. A caller that
  // needed the withdrawn men and asked for them separately would get a composition
  // that agrees on the total and disagrees per origin — see `partitionOrigins`.
  const [remaining, withdrawn] = partitionOrigins(detachment.ready.origins, men);
  const next: Detachment = {
    ...detachment,
    ready: { ...detachment.ready, origins: remaining },
  };
  return {
    detachment: menOf(remaining) === 0 && next.pending.length === 0 ? null : next,
    withdrawn,
  };
}

export function splitDetachment(
  source: Detachment, men: number, childId: string,
): readonly [Detachment, Detachment] {
  const readyMen = menOf(source.ready.origins);
  const cohortWeights: Record<string, number> = { ready: readyMen };
  source.pending.forEach((cohort, index) => {
    cohortWeights[`pending:${index}`] = menOf(cohort.origins);
  });
  const total = Object.values(cohortWeights).reduce((sum, cohortMen) => sum + cohortMen, 0);
  if (!Number.isInteger(men) || men <= 0 || men >= total) {
    throw new Error(`A split must move a positive whole number below ${total}; got ${men}.`);
  }

  const childByCohort = apportionExact(men, cohortWeights);
  const [retainedReady, childReady] = partitionOrigins(source.ready.origins, childByCohort.ready ?? 0);
  const retainedPending: PendingCohort[] = [];
  const childPending: PendingCohort[] = [];
  source.pending.forEach((cohort, index) => {
    const [retained, child] = partitionOrigins(
      cohort.origins,
      childByCohort[`pending:${index}`] ?? 0,
    );
    if (menOf(retained) > 0) retainedPending.push({ ...cohort, origins: retained });
    if (menOf(child) > 0) childPending.push({ ...cohort, origins: child });
  });

  const copyMovement = (): MovementOrder | null => source.movement === null
    ? null
    : {
        destination: { ...source.movement.destination },
        route: source.movement.route.map((position) => ({ ...position })),
        forcedMarch: source.movement.forcedMarch,
      };
  return [
    {
      id: source.id,
      position: { ...source.position },
      ready: { origins: retainedReady, fatigue: source.ready.fatigue },
      pending: retainedPending,
      movement: copyMovement(),
    },
    {
      id: childId,
      position: { ...source.position },
      ready: { origins: childReady, fatigue: source.ready.fatigue },
      pending: childPending,
      movement: copyMovement(),
    },
  ];
}

/** Shared Runtime/preview validation for a free division order. */
export function splitDetachmentRefusal(
  detachments: readonly FormationDetachment[],
  detachmentId: unknown,
  men: unknown,
): string | null {
  if (typeof detachmentId !== 'string' || detachmentId.length === 0) {
    return 'A split must name a detachment.';
  }
  const source = detachments.find((detachment) => detachment.id === detachmentId);
  if (source === undefined) return `Detachment "${detachmentId}" is not owned by this actor.`;
  if (typeof men !== 'number' || !Number.isInteger(men) || men <= 0 || men >= source.men) {
    return `A split must move a positive whole number below ${source.men}; got ${String(men)}.`;
  }
  return null;
}

/**
 * One sector, as a posture transfer needs to read it.
 *
 * Plain values rather than state, so the Runtime and `preview` validate a transfer
 * against exactly the same question and cannot come to disagree about it.
 */
export interface PostureSite {
  readonly sectorId: SectorId;
  readonly musterHex: HexPosition;
  /** Men already manning the shield, ready and forming alike — M13a's local cap. */
  readonly garrisonMen: number;
  /**
   * `garrisonHeadroomOf(garrisonMen, guard)`, computed beside the cap it reads.
   *
   * The guard is in it since ticket 07: a capital's ceiling is the ordinary shield cap
   * **plus** its guard (CP-⑦), so this is not `900 − manned` at every sector.
   */
  readonly garrisonHeadroom: number;
}

/**
 * Shared refusal for moving field men into the shield they are standing on.
 *
 * **Why standing on it is the whole legality rule** (R18 ii): a transfer is priced
 * by movement and nothing else — "zero new pricing devices" — so the turns it costs
 * are the turns of the march that brought the men here. There is no separate
 * transfer delay to invent, and no way to fill a shield from a distance.
 */
export function transferToGarrisonRefusal(
  detachments: readonly (FormationDetachment & { readonly readyMen: number })[],
  sites: readonly PostureSite[],
  detachmentId: unknown,
  men: unknown,
): string | null {
  if (typeof detachmentId !== 'string' || detachmentId.length === 0) {
    return 'A posture transfer must name a detachment.';
  }
  const source = detachments.find((detachment) => detachment.id === detachmentId);
  if (source === undefined) return `Detachment "${detachmentId}" is not owned by this actor.`;
  const site = sites.find((candidate) =>
    candidate.musterHex.q === source.position.q && candidate.musterHex.r === source.position.r);
  if (site === undefined) {
    return `Detachment "${detachmentId}" is not standing on a controlled sector's muster hex.`;
  }
  if (typeof men !== 'number' || !Number.isInteger(men) || men <= 0 || men > source.readyMen) {
    return `A transfer must move a positive whole number up to ${source.readyMen}; got ${String(men)}.`;
  }
  if (men > site.garrisonHeadroom) {
    return `${site.sectorId}'s shield has room for ${site.garrisonHeadroom} more men, not ${men}.`;
  }
  return null;
}

export function mergeDetachments(
  sources: readonly Detachment[], mergedId: string,
): Detachment {
  if (sources.length < 2 || new Set(sources.map((source) => source.id)).size !== sources.length) {
    throw new Error('At least two unique detachments are required to merge.');
  }
  const ordered = [...sources].sort((a, b) => a.id.localeCompare(b.id));
  const position = ordered[0]!.position;
  if (ordered.some((source) => source.position.q !== position.q || source.position.r !== position.r)) {
    throw new Error('Detachments must occupy the same hex to merge.');
  }

  const origins: Record<SectorId, number> = {};
  let readyMen = 0;
  let fatigueMass = 0;
  const pending: PendingCohort[] = [];
  for (const source of ordered) {
    const sourceReadyMen = menOf(source.ready.origins);
    accumulateOrigins(origins, source.ready.origins);
    readyMen += sourceReadyMen;
    fatigueMass += source.ready.fatigue * sourceReadyMen;
    pending.push(...source.pending.map((cohort) => ({ ...cohort, origins: { ...cohort.origins } })));
  }

  return {
    id: mergedId,
    position: { ...position },
    ready: { origins, fatigue: readyMen === 0 ? 0 : fatigueMass / readyMen },
    pending,
    movement: null,
  };
}

/** Shared Runtime/preview validation for a free consolidation order. */
export function mergeDetachmentsRefusal(
  detachments: readonly FormationDetachment[],
  detachmentIds: unknown,
): string | null {
  if (!Array.isArray(detachmentIds)) return 'A merge must name its detachments.';
  if (detachmentIds.length < 2 || new Set(detachmentIds).size !== detachmentIds.length) {
    return 'A merge requires at least two unique detachments.';
  }
  if (detachmentIds.some((id) => typeof id !== 'string' || id.length === 0)) {
    return 'A merge must name valid detachment ids.';
  }
  const sources = detachmentIds.map((id) =>
    detachments.find((detachment) => detachment.id === id));
  const missing = detachmentIds.find((_id, index) => sources[index] === undefined);
  if (missing !== undefined) return `Detachment "${String(missing)}" is not owned by this actor.`;
  const position = sources[0]!.position;
  if (sources.some((source) =>
    source!.position.q !== position.q || source!.position.r !== position.r)) {
    return 'Detachments must occupy the same hex to merge.';
  }
  return null;
}

/**
 * Rewrite the wear ledger of **every cohort** a detachment holds.
 *
 * The ledger's *subject set* lives here, once. March accrual (`movement.ts`) and
 * the turn's upkeep (the Runtime) have to agree about which cohorts the wear
 * ledger lives in, and two copies of this walk is how they would come to
 * disagree — a cohort that accrues but is never recovered would hold its wear
 * forever, and would then average that phantom into `ready` on activation.
 *
 * `men` is handed to the caller because accrual and recovery treat an empty
 * cohort differently: a cohort with nobody in it cannot tire.
 */
export function mapCohortFatigue(
  detachment: Detachment,
  nextFatigue: (fatigue: number, men: number) => number,
): Detachment {
  return {
    ...detachment,
    ready: {
      ...detachment.ready,
      fatigue: nextFatigue(detachment.ready.fatigue, menOf(detachment.ready.origins)),
    },
    pending: detachment.pending.map((cohort) => ({
      ...cohort,
      fatigue: nextFatigue(cohort.fatigue, menOf(cohort.origins)),
    })),
  };
}

export function combatEligibleMen(detachment: Detachment, turn: number): number {
  return menOf(detachment.ready.origins) + detachment.pending.reduce(
    (sum, cohort) => sum + (cohort.readyOnTurn <= turn ? menOf(cohort.origins) : 0),
    0,
  );
}

export function activateReadyCohorts(detachment: Detachment, turn: number): Detachment {
  const activating = detachment.pending.filter((cohort) => cohort.readyOnTurn <= turn);
  if (activating.length === 0) return detachment;

  const origins: Record<SectorId, number> = { ...detachment.ready.origins };
  let total = menOf(detachment.ready.origins);
  let fatigueMass = detachment.ready.fatigue * total;
  for (const cohort of activating) {
    const cohortMen = menOf(cohort.origins);
    accumulateOrigins(origins, cohort.origins);
    total += cohortMen;
    fatigueMass += cohort.fatigue * cohortMen;
  }
  return {
    ...detachment,
    ready: { origins, fatigue: total === 0 ? 0 : fatigueMass / total },
    pending: detachment.pending.filter((cohort) => cohort.readyOnTurn > turn),
  };
}

export function activateReadyGarrisonCohorts(
  garrison: GarrisonForce,
  turn: number,
): GarrisonForce {
  const activating = garrison.pending.filter((cohort) => cohort.readyOnTurn <= turn);
  if (activating.length === 0) return garrison;

  const ready: Record<SectorId, number> = { ...garrison.ready };
  for (const cohort of activating) accumulateOrigins(ready, cohort.origins);
  return {
    ready,
    pending: garrison.pending.filter((cohort) => cohort.readyOnTurn > turn),
  };
}
