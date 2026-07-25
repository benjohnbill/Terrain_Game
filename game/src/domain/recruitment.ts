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

/** One action point's purchase, as a fraction of the force limit (MT-③, R10). */
export const RECRUIT_FRACTION_PER_POINT = 0.01;

/** The allocation key recruitment occupies. One namespace with the front keys. */
export const ORDER_RECRUIT = 'order:recruit';

/** Every order kind that draws on the stack without being a front. */
export const ORDER_KEYS: readonly string[] = [ORDER_RECRUIT];

/** `order:<kind>` — the key an order allocation is stored under. */
export function orderKeyOf(kind: string): string {
  return `order:${kind}`;
}

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

  const ordered = Math.floor(forceLimit * RECRUIT_FRACTION_PER_POINT * chips);
  const headroom = Math.max(0, Math.floor(forceLimit - field));
  const serving = field + garrison;
  const bodies = Math.max(0, Math.floor(register - serving));

  let men = Math.min(ordered, headroom, bodies);
  let limitedBy: DraftResult['limitedBy'] =
    men === ordered ? null : headroom <= bodies ? 'headroom' : 'bodies';

  const billFor = (count: number): number =>
    draftBill(register, serving / register, (serving + count) / register);

  if (billFor(men) > treasury) {
    // The bill rises strictly with the count, so the largest affordable draft is
    // a clean bisection — and an integer one, so the answer is exact rather than
    // a float that would differ between hosts.
    //
    // Strict, with no tolerance: a treasury holding *exactly* the price of N men
    // may buy N−1 when the float sum lands a hair above. Deterministic on both
    // hosts, one man wide, and only reachable at an exact boundary — cheaper to
    // state than to paper over with an epsilon nobody sealed.
    let lo = 0;
    let hi = men;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      if (billFor(mid) <= treasury) lo = mid;
      else hi = mid - 1;
    }
    men = lo;
    limitedBy = 'treasury';
  }

  return { men, bill: billFor(men), limitedBy };
}
