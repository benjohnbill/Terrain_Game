/**
 * 모병 (recruitment) — turning 행동력 and yield into men.
 *
 * Authority: **MT-③** (the Surge Draft Model — recruitment is priced on two axes,
 * depth and size, and a draft's bill is the *integral* of a continuous marginal
 * curve over mobilization intensity, so there are no cliffs to exploit at a band
 * boundary), **MT-④/M13a** (the knees, at the start-state coordinates), **MT-②**
 * (bodies are a finite stock), **M14** (the affordability mins), and ruling
 * **R10** (2026-07-26) for the conversion from action points.
 *
 * ## What R10 settled
 *
 * One action point buys **+1%p of the force limit**, and **nothing caps the
 * turn** — the whole stack is a legal pour. The number is not new: MT-③'s Size
 * axis already carries "Surge exchange rate +1%p/point", and R2's re-cut of
 * non-combat orders into one linear grammar removed the base-primary/surplus
 * split that used to sit on top of it.
 *
 * The +10%-of-cap figure that looks like a rate cap is **not one**: `MAGNITUDE.md`
 * M13 carries it struck through, re-read as the Band-1 *base* of this curve when
 * MT-③ replaced the flat rate with the price curve. What bounds a draft is the
 * affordability mins — headroom, money, bodies — never a rate.
 *
 * It reproduces both sealed tempo anchors (M13a), which are both the time to fill
 * from f₀ 0.5 to full: all-in 20 points = +20%/turn = 2.5 turns against "surged
 * 2–3", a knee-sized 8–10 points = 5–6 turns against "plain buildup 5".
 *
 * A rule module: pure functions over plain values, called by the Runtime and by
 * `preview` alike.
 */

import { MEN_PER_YIELD } from './economy.js';
import { MARCH_SPEED, reachCone, type MovementGraph } from './movement.js';
import { hexKey, type HexPosition, type RegionId, type SectorId } from '../world/schema.js';

/** One action point's purchase, as a fraction of the force limit (MT-③, R10). */
export const RECRUIT_FRACTION_PER_POINT = 0.01;

/** The allocation key recruitment occupies. One namespace with the front keys. */
export const ORDER_RECRUIT = 'order:recruit';

/**
 * The marginal price curve over 동원 강도 (serving ÷ register).
 *
 * Continuous and piecewise-linear by seal: a flat peace band up to the start
 * intensity, a ramp to the structural maximum, then the desperation tail. Named
 * zones are vocabulary for the UI; the arithmetic never jumps.
 *
 * `base` is the sealed M13 anchor read in yield-per-man. `warMult` and
 * `fullMult` are the multipliers MT-③ deferred to a magnitude session that never
 * ran — **가안 adopted by ruling R11** from the L2 harness.
 */
export const SURGE = {
  /** M13: 1 unit = 0.5 yield, at R11's 100 men per unit. */
  base: 1 / MEN_PER_YIELD,
  /** M13a: start intensity — the top of the flat peace band. */
  peaceKnee: 0.42,
  /** M13a: structural max — the top of the wartime ramp. */
  warKnee: 0.58,
  /** 가안 (R11): price multiple at the war knee. */
  warMult: 2,
  /** 가안 (R11): price multiple at total mobilization — the desperation tail. */
  fullMult: 12,
} as const;

/** Yield per man at a given mobilization intensity. */
export function marginalPrice(intensity: number): number {
  const i = Math.max(0, Math.min(1, intensity));
  if (i <= SURGE.peaceKnee) return SURGE.base;
  if (i <= SURGE.warKnee) {
    const t = (i - SURGE.peaceKnee) / (SURGE.warKnee - SURGE.peaceKnee);
    return SURGE.base * (1 + (SURGE.warMult - 1) * t);
  }
  const t = (i - SURGE.warKnee) / (1 - SURGE.warKnee);
  return SURGE.base * (SURGE.warMult + (SURGE.fullMult - SURGE.warMult) * t);
}

/**
 * What it costs to move mobilization from `iPre` to `iPost` — the area under the
 * marginal curve, times the register that converts intensity back into men.
 *
 * Integral pricing is the seal's own word (MT-③): a draft that crosses a knee
 * pays the cheap part cheaply and the dear part dearly, so splitting one draft
 * into two bills the same total and no boundary can be gamed. The curve is
 * piecewise-linear, so exact trapezoids do it — no sampling, no drift.
 */
export function draftBill(register: number, iPre: number, iPost: number): number {
  if (!(register > 0) || iPost <= iPre) return 0;

  const knees = [SURGE.peaceKnee, SURGE.warKnee].filter((knee) => knee > iPre && knee < iPost);
  const points = [iPre, ...knees, iPost];

  let area = 0;
  for (let i = 1; i < points.length; i += 1) {
    const lo = points[i - 1]!;
    const hi = points[i]!;
    area += ((marginalPrice(lo) + marginalPrice(hi)) / 2) * (hi - lo);
  }
  return area * register;
}

/** Everything a draft is judged against. All of it is the realm's own. */
export interface DraftContext {
  /** Action points poured into recruitment this turn. */
  readonly chips: number;
  readonly forceLimit: number;
  /** Men currently in the field army — what the force limit ceilings. */
  readonly field: number;
  /** Men currently manning shields. Serving, but not under the field ceiling. */
  readonly garrison: number;
  readonly register: number;
  readonly treasury: number;
}

export interface DraftResult {
  /** Men actually raised, after every bound. */
  readonly men: number;
  /** Yield the treasury owes for them. */
  readonly bill: number;
  /** Which bound bit, for a preview to report. `null` when the order was met. */
  readonly limitedBy: 'headroom' | 'bodies' | 'treasury' | null;
}

/**
 * Resolve one draft order.
 *
 * The four mins of the affordability bound (M14 / AB-①'s recruitment reading,
 * affirmed live by ledger D5.3): what was **ordered**, **headroom** to the force
 * limit, **bodies** left in the register, and what the **treasury** can pay.
 *
 * Falling short is not a refusal. A player who orders more than they can afford
 * raises what they can — refusing outright would make the order a puzzle to
 * pre-solve rather than a lever to pull, and the deep end of the curve is exactly
 * where a bled realm is meant to be pouring everything in and getting less back.
 */
export function draftOrder(context: DraftContext): DraftResult {
  const { chips, forceLimit, field, garrison, register, treasury } = context;
  if (!(chips > 0)) return { men: 0, bill: 0, limitedBy: null };

  const headroom = Math.max(0, Math.floor(forceLimit - field));
  const serving = field + garrison;
  const bodies = Math.max(0, Math.floor(register - serving));
  const sectorId = 'legacy-draft-sector' as SectorId;
  const regionId = 'legacy-draft-region' as RegionId;
  const batch = settleRecruitmentBatch({
    requests: [{ requestId: 'legacy-draft', sectorId, commit: chips, posture: 'field' }],
    forceLimit,
    field,
    garrison,
    register,
    treasury,
    availableCivilians: { [regionId]: bodies },
    sectorRegions: { [sectorId]: regionId },
    garrisonHeadroom: { [sectorId]: 0 },
    musterHexes: { [sectorId]: { q: 0, r: 0 } },
  });
  const fulfillment = batch.fulfilled[0]!;
  const limitedBy: DraftResult['limitedBy'] = fulfillment.men === fulfillment.requestedMen
    ? null
    : fulfillment.limitedBy.includes('treasury')
      ? 'treasury'
      : headroom <= bodies
        ? 'headroom'
        : 'bodies';
  return { men: fulfillment.men, bill: batch.bill, limitedBy };
}

export type RecruitmentPosture = 'field' | 'garrison';

export interface RecruitmentRequest {
  readonly requestId: string;
  readonly sectorId: SectorId;
  readonly commit: number;
  readonly posture: RecruitmentPosture;
  readonly destinationHex?: HexPosition;
  readonly joinDetachmentId?: string;
}

export interface RecruitmentFulfillment {
  readonly requestId: string;
  readonly requestedMen: number;
  readonly men: number;
  readonly limitedBy: readonly ('province' | 'field-headroom' | 'garrison-headroom' | 'treasury')[];
}

export interface RecruitmentBatchContext {
  readonly requests: readonly RecruitmentRequest[];
  readonly forceLimit: number;
  readonly field: number;
  readonly garrison: number;
  readonly register: number;
  readonly treasury: number;
  readonly availableCivilians: Readonly<Record<RegionId, number>>;
  readonly sectorRegions: Readonly<Record<SectorId, RegionId>>;
  readonly garrisonHeadroom: Readonly<Record<SectorId, number>>;
  readonly musterHexes: Readonly<Record<SectorId, HexPosition>>;
}

export interface RecruitmentBatchResult {
  readonly fulfilled: readonly RecruitmentFulfillment[];
  readonly men: number;
  readonly bill: number;
}

export interface RecruitmentLegalityContext {
  readonly controlledSectors: readonly SectorId[];
  readonly ownedRegions: readonly RegionId[];
  readonly sectorRegions: Readonly<Record<SectorId, RegionId>>;
  readonly musterHexes: Readonly<Record<SectorId, HexPosition>>;
  readonly movementGraph: MovementGraph;
  readonly detachments: readonly {
    readonly id: string;
    readonly turnEndpoint: HexPosition;
  }[];
}

/** Validation shared by Runtime mutation and viewer-safe preview. */
export function recruitmentRequestRefusal(
  context: RecruitmentLegalityContext,
  requestId: unknown,
  sectorId: unknown,
  commit: unknown,
  posture: unknown,
  destinationHex: unknown,
  joinDetachmentId: unknown,
  forcedMarch: unknown = undefined,
): string | null {
  if (typeof requestId !== 'string' || requestId.length === 0) {
    return 'A recruitment allocation must carry a non-empty stable requestId.';
  }
  if (typeof sectorId !== 'string' || !context.controlledSectors.includes(sectorId)) {
    return `Recruitment sector "${String(sectorId)}" is not controlled by this actor.`;
  }
  const region = context.sectorRegions[sectorId];
  if (region === undefined || !context.ownedRegions.includes(region)) {
    return `Recruitment sector "${sectorId}" does not have an owned province register.`;
  }
  if (typeof commit !== 'number' || !Number.isInteger(commit) || commit < 0) {
    return 'A recruitment allocation must commit a whole, non-negative number of points.';
  }
  if (posture !== 'field' && posture !== 'garrison') {
    return 'A recruitment allocation posture must be "field" or "garrison".';
  }
  if (posture === 'garrison' && (destinationHex !== undefined || joinDetachmentId !== undefined)) {
    return 'Garrison recruitment cannot declare a destination or detachment.';
  }
  if (forcedMarch === true) {
    return 'Recruitment-turn movement cannot use forced march.';
  }
  if (destinationHex !== undefined && (
    typeof destinationHex !== 'object' || destinationHex === null ||
    !Number.isInteger((destinationHex as { q?: unknown }).q) ||
    !Number.isInteger((destinationHex as { r?: unknown }).r)
  )) {
    return 'A field recruitment destination must be a valid hex position.';
  }
  if (joinDetachmentId !== undefined && (
    typeof joinDetachmentId !== 'string' || joinDetachmentId.length === 0
  )) {
    return 'A field recruitment affiliation must name a stable detachment id.';
  }
  if (posture === 'field') {
    const muster = context.musterHexes[sectorId as SectorId];
    if (muster === undefined) {
      return `Recruitment sector "${String(sectorId)}" has no muster hex.`;
    }
    const destination = destinationHex === undefined
      ? muster
      : destinationHex as HexPosition;
    if (!reachCone(context.movementGraph, muster, 1, MARCH_SPEED).has(
      hexKey(destination.q, destination.r),
    )) {
      return `Recruitment destination ${hexKey(destination.q, destination.r)} exceeds one normal march from its muster.`;
    }
    if (joinDetachmentId !== undefined) {
      const host = context.detachments.find((detachment) => detachment.id === joinDetachmentId);
      if (host === undefined) {
        return `Detachment "${joinDetachmentId}" is not owned by this actor.`;
      }
      if (host.turnEndpoint.q !== destination.q || host.turnEndpoint.r !== destination.r) {
        return `Detachment "${joinDetachmentId}" does not end this turn at the recruitment destination.`;
      }
    }
  }
  return null;
}

type RecruitmentLimit = RecruitmentFulfillment['limitedBy'][number];

interface WorkingFulfillment {
  readonly request: RecruitmentRequest;
  readonly requestedMen: number;
  men: number;
  readonly limitedBy: RecruitmentLimit[];
}

/** The one tie-break used by settlement, event emission, and own-plan projection. */
export function compareRecruitmentRequests(
  musterHexes: Readonly<Record<SectorId, HexPosition>>,
  a: RecruitmentRequest,
  b: RecruitmentRequest,
): number {
  const aMuster = musterHexes[a.sectorId];
  const bMuster = musterHexes[b.sectorId];
  if (aMuster === undefined || bMuster === undefined) {
    throw new Error('Every recruitment request must have a muster hex.');
  }
  return aMuster.q - bMuster.q || aMuster.r - bMuster.r ||
    (a.requestId < b.requestId ? -1 : a.requestId > b.requestId ? 1 : 0);
}

function limit(
  requests: readonly WorkingFulfillment[],
  total: number,
  reason: RecruitmentLimit,
  compare: (a: WorkingFulfillment, b: WorkingFulfillment) => number,
): void {
  const available = Math.max(0, Math.floor(total));
  const demand = requests.reduce((sum, request) => sum + request.men, 0);
  if (demand <= available) return;

  const target = Math.min(available, demand);
  const remainders: { readonly request: WorkingFulfillment; readonly fraction: number }[] = [];
  let assigned = 0;
  for (const request of requests) {
    const exact = demand === 0 ? 0 : target * request.men / demand;
    const whole = Math.floor(exact);
    assigned += whole;
    remainders.push({ request, fraction: exact - whole });
    request.men = whole;
  }
  remainders.sort((a, b) => b.fraction - a.fraction || compare(a.request, b.request));
  for (let index = 0; assigned < target; index += 1, assigned += 1) {
    remainders[index]!.request.men += 1;
  }
  for (const request of requests) {
    if (!request.limitedBy.includes(reason)) request.limitedBy.push(reason);
  }
}

function largestAffordableMen(
  maximum: number,
  billFor: (men: number) => number,
  treasury: number,
): number {
  if (billFor(maximum) <= treasury) return maximum;
  let lo = 0;
  let hi = maximum;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (billFor(mid) <= treasury) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

/**
 * Settle every legal request for one realm as one deterministic, integral-priced
 * batch. No request ever owns a bill: the treasury mutation belongs to the one
 * fulfilled aggregate.
 */
export function settleRecruitmentBatch(context: RecruitmentBatchContext): RecruitmentBatchResult {
  const compare = (a: WorkingFulfillment, b: WorkingFulfillment): number =>
    compareRecruitmentRequests(context.musterHexes, a.request, b.request);
  const menPerPoint = Math.floor(context.forceLimit * RECRUIT_FRACTION_PER_POINT);
  const working: WorkingFulfillment[] = context.requests.map((request) => {
    const requestedMen = menPerPoint * request.commit;
    return { request, requestedMen, men: requestedMen, limitedBy: [] };
  });

  const byProvince = new Map<RegionId, WorkingFulfillment[]>();
  for (const request of working) {
    const region = context.sectorRegions[request.request.sectorId];
    if (region === undefined) throw new Error(`Unknown recruiting sector "${request.request.sectorId}".`);
    const province = byProvince.get(region) ?? [];
    province.push(request);
    byProvince.set(region, province);
  }
  for (const [region, requests] of [...byProvince].sort(([a], [b]) =>
    a < b ? -1 : a > b ? 1 : 0)) {
    limit(requests, context.availableCivilians[region] ?? 0, 'province', compare);
  }

  const garrisons = new Map<SectorId, WorkingFulfillment[]>();
  for (const request of working.filter(({ request }) => request.posture === 'garrison')) {
    const atSector = garrisons.get(request.request.sectorId) ?? [];
    atSector.push(request);
    garrisons.set(request.request.sectorId, atSector);
  }
  for (const [sector, requests] of [...garrisons].sort(([a], [b]) =>
    a < b ? -1 : a > b ? 1 : 0)) {
    limit(requests, context.garrisonHeadroom[sector] ?? 0, 'garrison-headroom', compare);
  }

  const fields = working.filter(({ request }) => request.posture === 'field');
  limit(fields, Math.max(0, context.forceLimit - context.field), 'field-headroom', compare);

  const preTreasuryMen = working.reduce((sum, request) => sum + request.men, 0);
  const preServing = context.field + context.garrison;
  const billFor = (men: number): number => draftBill(
    context.register,
    preServing / context.register,
    (preServing + men) / context.register,
  );
  const affordable = largestAffordableMen(preTreasuryMen, billFor, context.treasury);
  limit(working, affordable, 'treasury', compare);

  working.sort(compare);
  const fulfilled = working.map(({ request, requestedMen, men, limitedBy }) => ({
    requestId: request.requestId,
    requestedMen,
    men,
    limitedBy,
  }));
  const men = fulfilled.reduce((sum, fulfillment) => sum + fulfillment.men, 0);
  return { fulfilled, men, bill: billFor(men) };
}
