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

export const menOf = (origins: OriginComposition): number =>
  Object.values(origins).reduce((sum, men) => sum + men, 0);

type ForceCollection = {
  readonly openingField: ForceCohort | null;
  readonly detachments: readonly Detachment[];
};

function addOrigins(
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
  if (forces.openingField !== null) addOrigins(serving, forces.openingField.origins);
  for (const detachment of forces.detachments) {
    addOrigins(serving, detachment.ready.origins);
    for (const cohort of detachment.pending) addOrigins(serving, cohort.origins);
  }
  for (const garrison of garrisons) {
    addOrigins(serving, garrison.ready);
    for (const cohort of garrison.pending) addOrigins(serving, cohort.origins);
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
 */
function prorate(total: number, weights: Readonly<Record<string, number>>): Record<string, number> {
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

function splitOrigins(
  origins: OriginComposition,
  childMen: number,
): readonly [OriginComposition, OriginComposition] {
  const child = prorate(childMen, origins);
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

  const childByCohort = prorate(men, cohortWeights);
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

export function mergeDetachments(
  sources: readonly Detachment[], mergedId: string,
): Detachment {
  if (sources.length === 0) throw new Error('At least one detachment is required to merge.');
  const position = sources[0]!.position;
  if (sources.some((source) => source.position.q !== position.q || source.position.r !== position.r)) {
    throw new Error('Detachments must occupy the same hex to merge.');
  }

  const origins: Record<RegionId, number> = {};
  let readyMen = 0;
  let fatigueMass = 0;
  const pending: PendingCohort[] = [];
  for (const source of sources) {
    const sourceReadyMen = menOf(source.ready.origins);
    addOrigins(origins, source.ready.origins);
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
    addOrigins(origins, cohort.origins);
    total += cohortMen;
    fatigueMass += cohort.fatigue * cohortMen;
  }
  return {
    ...detachment,
    ready: { origins, fatigue: total === 0 ? 0 : fatigueMass / total },
    pending: detachment.pending.filter((cohort) => cohort.readyOnTurn > turn),
  };
}
