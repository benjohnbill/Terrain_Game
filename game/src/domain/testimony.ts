/**
 * The witness model — what an act of observation deposits, and how a band is
 * composed from what has been deposited.
 *
 * Authority: `docs/features/fog-of-war-discovery/RULINGS.md` **③** (what a band
 * *is*) and **④** (what a testimony is *about*), with every value at that
 * feature's **`MAGNITUDE.md` FG-M①**. ADR 0048 and ADR 0050 carry the
 * cross-feature record. This module owns none of that — it is the arithmetic
 * those seals describe, and the constants below are transcriptions of FG-M①'s
 * table, not choices made here.
 *
 * **The true value never enters a band.** A band is composed from stored
 * testimony and from bounds a viewer can compute off public facts; there is no
 * parameter here through which truth could reach a projection. Truth appears in
 * exactly one function, `testimonyOf`, which is the act of observing — it takes
 * the truth, speaks a vaguer figure, and the truth does not survive the call.
 *
 * A rule module in the sense `commitment.ts` and `capital-choice.ts` are: pure
 * functions over plain values, called by the Runtime and by `preview` alike, so
 * the two cannot drift into telling the player different things.
 */

/**
 * What one act of observation is worth — FG-M①'s precision table, by name.
 *
 * Two are purchased and two are free byproducts of contact. The half-width is a
 * fraction **of the figure the observation reports**, never of the true value:
 * a width proportional to truth is invertible, and one look at the band would
 * return the true figure exactly (③ decision 7, gate 03 invariant 8).
 */
export type ObservationGrade =
  | 'enhanced-reconnaissance'
  | 'repelled-assault'
  | 'normal-reconnaissance'
  | 'battle-contact';

/** FG-M① § Precision. 가안 · L0 — revisited at the first playtest (ticket 13). */
export const OBSERVATION_HALF_WIDTH: Readonly<Record<ObservationGrade, number>> = Object.freeze({
  'enhanced-reconnaissance': 0.1,
  'repelled-assault': 0.2,
  'normal-reconnaissance': 0.25,
  'battle-contact': 0.3,
});

/**
 * The irreducible sliver — FG-M①'s intersection floor.
 *
 * No accumulation of testimony narrows a substance band below it. It is not
 * enforced anywhere in this file, and that absence is the design: a floor
 * applied by widening a collapsed interval would re-centre that interval on the
 * truth, which is gate 03 invariant 8 violated by its own guard (④ decision 7,
 * measured in ticket 08 § Groundwork G2). It holds instead as a consequence of
 * `REPORTING_SPREAD`.
 */
export const INTERSECTION_FLOOR = 0.05;

/**
 * How far the reported figure may sit from the true one — **the same number as
 * the floor, doing a second job** (FG-M① § Consequence — the reporting spread).
 *
 * Uniform across grades, and that uniformity is what the sealed outcome rests
 * on: repeated testimonies at one grade intersect toward `w − a`, so the two
 * paid grades sell different *destinations* rather than different speeds — the
 * cheap grade saturates at ±20% and only the expensive one reaches the floor.
 * A margin scaled to each grade's width would need a proportionality constant,
 * which would be a new dial.
 *
 * Written as an alias rather than a second `0.05` so that the two can never be
 * edited apart; FG-M① says outright that this is not a dial of its own.
 */
export const REPORTING_SPREAD = INTERSECTION_FLOOR;

/** The two grades a player may buy, and their per-sector price (FG-M①). */
export const RECONNAISSANCE_UNIT_PRICE: Readonly<Record<PaidGrade, number>> = Object.freeze({
  'normal-reconnaissance': 2,
  'enhanced-reconnaissance': 6,
});

export type PaidGrade = 'normal-reconnaissance' | 'enhanced-reconnaissance';

export const PAID_GRADES: readonly PaidGrade[] = Object.freeze([
  'normal-reconnaissance',
  'enhanced-reconnaissance',
]);

export const isPaidGrade = (grade: unknown): grade is PaidGrade =>
  typeof grade === 'string' && (PAID_GRADES as readonly string[]).includes(grade);

/** A closed range of men (or of wear). Both edges are always finite. */
export interface Interval {
  readonly low: number;
  readonly high: number;
}

/**
 * One act of observation, stored.
 *
 * It carries **no true value and no subject identity** — the ledger that holds
 * it knows whose statement it is, and ④ decision 1 sets that subject by whether
 * the subject can move. What is here is only the honest, vaguer thing the
 * dealer said, and when it said it.
 */
export interface Testimony {
  readonly grade: ObservationGrade;
  /** The turn it was taken on. Ageing is measured against this and nothing else. */
  readonly turn: number;
  /** The figure the dealer reported. Never the truth, and never re-derived from it. */
  readonly reported: number;
}

/**
 * What the dealer says, given what is so.
 *
 * The only function in this module that sees a true value, and it does not
 * return one: the reported figure is drawn from `[x(1−a), x(1+a)]`, strictly
 * inside the range honesty would permit, and the gap between the two ranges is
 * what the intersection floor is made of.
 *
 * `draw` is a value in `[0, 1)` from the Runtime's seeded stream — determinism
 * comes from the seed, never from `Math.random` (ADR 0040 § Decision 3).
 */
export function reportedFigureOf(truth: number, draw: number): number {
  return truth * (1 - REPORTING_SPREAD + 2 * REPORTING_SPREAD * draw);
}

/** One observation: grade, turn, and what was said. */
export function testimonyOf(
  grade: ObservationGrade,
  turn: number,
  truth: number,
  draw: number,
): Testimony {
  return { grade, turn, reported: reportedFigureOf(truth, draw) };
}

/**
 * What one testimony claims — `[r(1−w), r(1+w)]`, a fraction of the **reported**
 * figure (③ decision 7).
 *
 * Containment is structural rather than checked: the interval contains the truth
 * whenever `a ≤ w/(1+w)`, which is 9.09% at the enhanced grade and 20.0% at the
 * normal one against `a` = 5%. The floor binds first at every grade, which is why
 * it — and not containment — is what fixes the spread. No clamp exists here,
 * because a clamp would readmit the true value to the projection.
 */
export function intervalOf(testimony: Testimony): Interval {
  const width = OBSERVATION_HALF_WIDTH[testimony.grade];
  return { low: testimony.reported * (1 - width), high: testimony.reported * (1 + width) };
}

/** The overlap of two intervals, or `null` when they do not meet. */
export function intersect(a: Interval, b: Interval): Interval | null {
  const low = Math.max(a.low, b.low);
  const high = Math.min(a.high, b.high);
  return low > high ? null : { low, high };
}

/**
 * How much a subject's count could have moved in one turn, from public facts.
 *
 * ③ decision 5 derives the forward correction from **sealed change bounds** —
 * the recruitment rate term of the affordability bound, the casualty curve, and
 * march speed against distance — and never from a decay dial. This type is the
 * shape of that composition; the Runtime computes the numbers, because they are
 * read off the board a given viewer can see.
 *
 * The consequence ③ names is worth keeping in view: the rot rate of intelligence
 * becomes **land-derived**, so a sector the enemy can quickly reinforce goes
 * stale faster than a remote one. Nothing here is tunable.
 */
export interface ChangeEnvelope {
  /** Most men that could have joined the subject in one turn. */
  readonly gainPerTurn: number;
  /** Most men that could have left it. Zero where no channel takes men away. */
  readonly lossPerTurn: number;
}

/** An envelope for a subject nothing can reach — the static case, for tests. */
export const UNCHANGING: ChangeEnvelope = Object.freeze({ gainPerTurn: 0, lossPerTurn: 0 });

export interface BandInput {
  /** Every testimony the viewer holds about **one** subject, in any order. */
  readonly testimonies: readonly Testimony[];
  /** The turn the band is being read on. */
  readonly now: number;
  readonly envelope: ChangeEnvelope;
  /**
   * What the band is with no testimony at all — bounded by **public facts
   * alone**, never by the truth (gate 03 invariant 5).
   */
  readonly publicBound: Interval;
  /**
   * The latest turn on which the subject could have lost men outright — a battle
   * it was party to, which is public. Every testimony taken on or before it keeps
   * only its upper edge afterwards, because the men it counted may all be dead.
   *
   * Omitted when no such turn is known, which is the ordinary case: this slice
   * has no attrition outside battle, so a subject nobody fought loses nobody.
   */
  readonly lastLossTurn?: number;
}

/**
 * The band a viewer reads — every testimony corrected forward to the present,
 * then intersected, then met against what public facts alone already said.
 *
 * ③ decision 3: plain intersection assumes a static world and returns the empty
 * set the first time a force changes between two looks, which in a war is the
 * normal case rather than the exception. So each statement is widened by what
 * could have happened since it was made, and only then does it meet the others.
 *
 * **An empty intersection is a bug in the bounds, not a state to render** —
 * ticket 08 § Groundwork G3's first oracle. If the envelope really covers every
 * channel then every forward-corrected testimony still contains the truth, so
 * they all share at least that point. Emptiness is therefore detectable with no
 * access to truth at all, which is why this throws rather than degrading.
 */
export function composeBand(input: BandInput): Interval {
  const { testimonies, now, envelope, publicBound, lastLossTurn } = input;
  let band = publicBound;

  for (const testimony of testimonies) {
    const age = Math.max(0, now - testimony.turn);
    const claim = intervalOf(testimony);
    const bled = lastLossTurn !== undefined && testimony.turn <= lastLossTurn;
    const corrected: Interval = {
      low: bled
        ? publicBound.low
        : Math.max(publicBound.low, claim.low - envelope.lossPerTurn * age),
      high: Math.min(publicBound.high, claim.high + envelope.gainPerTurn * age),
    };
    const met = intersect(band, corrected);
    if (met === null) {
      // The message carries the evidence, because the fix is always "which channel
      // moved this subject that the envelope does not know about" and reproducing
      // the state to find out is the expensive part.
      throw new Error(
        'Testimonies do not meet: the forward-correction envelope is too narrow to ' +
          'cover a channel that acted. Widen the bound rather than dropping a statement. ' +
          `now=${now} band=[${band.low}, ${band.high}] ` +
          `corrected=[${corrected.low}, ${corrected.high}] from ` +
          `${testimony.grade}@${testimony.turn} reported=${testimony.reported} ` +
          `envelope=+${envelope.gainPerTurn}/-${envelope.lossPerTurn} ` +
          `public=[${publicBound.low}, ${publicBound.high}] ` +
          `lastLoss=${String(lastLossTurn)}`,
      );
    }
    band = met;
  }

  return band;
}

/** Half the band's span, as a fraction of its centre — the width a player feels. */
export function relativeHalfWidth(band: Interval): number {
  const centre = (band.low + band.high) / 2;
  return centre === 0 ? 0 : (band.high - band.low) / 2 / centre;
}
