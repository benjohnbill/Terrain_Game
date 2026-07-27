/**
 * Positioned military substance and its province-origin accounting.
 *
 * Authority: match-arc MT-⑥, war-model-build WM-④, and ADR 0045. Origin is
 * accounting state rather than a formation attribute: movement never changes
 * it, while every serving body remains traceable to one living register.
 */

import type { HexPosition, RegionId, SectorId } from '../world/schema.js';

export type OriginComposition = Readonly<Record<RegionId, number>>;

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
  destination: Record<RegionId, number>,
  origins: OriginComposition,
): void {
  for (const [region, men] of Object.entries(origins)) {
    destination[region] = (destination[region] ?? 0) + men;
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

/** Serving bodies by province origin across field and local-garrison posture. */
export function servingByOrigin(
  forces: ForceCollection,
  garrisons: readonly GarrisonForce[],
): Record<RegionId, number> {
  const serving: Record<RegionId, number> = {};
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
  registers: Readonly<Record<RegionId, number>>,
  serving: Readonly<Record<RegionId, number>>,
): Record<RegionId, number> {
  const available: Record<RegionId, number> = {};
  for (const region of Object.keys(registers).sort()) {
    const civilians = registers[region]! - (serving[region] ?? 0);
    if (civilians < 0) {
      throw new Error(`Serving bodies from ${region} exceed its living register.`);
    }
    available[region] = civilians;
  }
  return available;
}

/**
 * Allocate one exact integer total over integer weights. Floors are filled first;
 * largest fractional remainders win, with canonical key order breaking ties.
 *
 * Exported because men are apportioned over more than one kind of key: over
 * province origins (below), and over the several formations that shared one
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

/** Canonical integer apportionment over province-origin capacity. */
export function apportionOrigins(
  total: number,
  weights: Readonly<Record<RegionId, number>>,
): Record<RegionId, number> {
  return apportionExact(total, weights);
}

function splitOrigins(
  origins: OriginComposition,
  childMen: number,
): readonly [OriginComposition, OriginComposition] {
  const child = apportionExact(childMen, origins);
  const retained: Record<RegionId, number> = {};
  for (const region of Object.keys(origins).sort()) {
    retained[region] = origins[region]! - (child[region] ?? 0);
  }
  return [retained, child];
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
  const [retainedReady, childReady] = splitOrigins(source.ready.origins, childByCohort.ready ?? 0);
  const retainedPending: PendingCohort[] = [];
  const childPending: PendingCohort[] = [];
  source.pending.forEach((cohort, index) => {
    const [retained, child] = splitOrigins(
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

  const origins: Record<RegionId, number> = {};
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

  const origins: Record<RegionId, number> = { ...detachment.ready.origins };
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

  const ready: Record<RegionId, number> = { ...garrison.ready };
  for (const cohort of activating) accumulateOrigins(ready, cohort.origins);
  return {
    ready,
    pending: garrison.pending.filter((cohort) => cohort.readyOnTurn > turn),
  };
}
