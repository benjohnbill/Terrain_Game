/**
 * What a viewer has learned — the ledger testimony is stored in, the bounds a
 * band is corrected forward by, and the grammar of buying a look.
 *
 * Authority: fog `RULINGS.md` **③** and **④**, values at that feature's
 * **`MAGNITUDE.md` FG-M①**, subject rule at **ADR 0050**, viewer contract at
 * Wayfinder gate 03 § 4 / § 5. `testimony.ts` holds the arithmetic; this file
 * holds *whose statement is whose* and *what could have changed since*.
 *
 * **A testimony's subject is set by whether that subject can move** (④ decision
 * 1). Field-army substance and fatigue attach to the **force**; garrison
 * substance and the sector-origin bodies the 동원 강도 and civilian-register
 * reads derive from attach to the **sector**. Nothing here stores a field-army
 * count against a sector, or a sector observable against a force, and the two
 * record shapes below are how that stays true by construction rather than by
 * discipline.
 */

import { RECRUIT_FRACTION_PER_POINT } from './recruitment.js';
import { TURN_COMMITMENT_BUDGET } from './commitment.js';
import { BATTLE_FATIGUE_COEF, RECOVERY_BASE_RATE } from './fatigue.js';
import {
  FORCED_MARCH_EXTRA_CAP,
  FORCED_MARCH_PREMIUM,
  MARCH_FATIGUE_PER_HEX,
  MARCH_SPEED,
  reachCone,
  type MovementGraph,
} from './movement.js';
import type { ChangeEnvelope, ObservationGrade, PaidGrade, Testimony } from './testimony.js';
import { PAID_GRADES, RECONNAISSANCE_UNIT_PRICE, isPaidGrade } from './testimony.js';
import type { HexPosition, SectorId } from '../world/schema.js';
import type { ActorId } from '../runtime/types.js';

/** The allocation key a reconnaissance purchase occupies, one target per key. */
export const ORDER_RECON = 'order:recon';

/** One target's key in the shared sector/order allocation namespace. */
export const reconOrderKeyOf = (sectorId: SectorId): string => `${ORDER_RECON}:${sectorId}`;

/** Whether a key in the shared stack names a reconnaissance purchase. */
export const isReconOrderKey = (key: string): boolean => key.startsWith(`${ORDER_RECON}:`);

/** One sited reconnaissance purchase for the current turn. */
export interface ReconnaissanceRequest {
  readonly sectorId: SectorId;
  readonly grade: PaidGrade;
}

/**
 * Everything the legality rule needs, and nothing that would leak truth.
 *
 * Every field is public by seal: the world's sectors, and which of them this
 * realm controls. A viewer may scout **any** sector it does not hold, including
 * one it has never seen — narrowing the list by proximity or by prior contact
 * would be a rule nobody sealed, and would itself be a signal.
 */
export interface ReconnaissanceLegalityContext {
  readonly sectorKeys: readonly string[];
  readonly controlledSectors: readonly SectorId[];
}

/** Returns a reportable refusal, or `null` when the purchase is legal. */
export function reconnaissanceRequestRefusal(
  context: ReconnaissanceLegalityContext,
  sectorId: unknown,
  grade: unknown,
): string | null {
  if (typeof sectorId !== 'string' || sectorId.length === 0) {
    return 'A reconnaissance order must name a sector.';
  }
  if (!context.sectorKeys.includes(sectorId)) {
    return `"${sectorId}" is not a sector of this world.`;
  }
  if (context.controlledSectors.includes(sectorId)) {
    return `"${sectorId}" is held by this realm; there is nothing here to scout.`;
  }
  if (!isPaidGrade(grade)) {
    return `"${String(grade)}" is not a reconnaissance grade; use ${
      Object.keys(RECONNAISSANCE_UNIT_PRICE).join(' or ')
    }.`;
  }
  return null;
}

/** What one target at one grade costs — FG-M①'s unit price, per sector. */
export const reconnaissancePriceOf = (grade: PaidGrade): number =>
  RECONNAISSANCE_UNIT_PRICE[grade];

/** What a reconnaissance order comes to, once its own rules have passed. */
export interface ReconnaissancePlan {
  readonly refusal: string | null;
  /** Its key in the shared stack. Meaningful only when `refusal` is null. */
  readonly key: string;
  /** What it costs — zero when the order calls a standing look off. */
  readonly chips: number;
  /** The order to store, or `null` when it clears the target. */
  readonly request: ReconnaissanceRequest | null;
}

/**
 * One reading of a reconnaissance order, for the Runtime and `preview` alike.
 *
 * Shared for the reason `capital-choice.ts` and `commitment.ts` are shared: the
 * two must answer identically or the preview teaches the player a rule the game
 * does not have. It stops short of the **spend** check, which each caller runs
 * against its own allocation map — the projection carries the viewer's own stack
 * and the Runtime carries everyone's, so that one input genuinely differs.
 *
 * `null` grade calls a standing look off, and is checked before the grade rule
 * because "no grade" is a legal instruction while `reconnaissanceRequestRefusal`
 * is right to refuse it as a grade.
 */
export function reconnaissancePlanOf(
  context: ReconnaissanceLegalityContext,
  sectorId: unknown,
  grade: unknown,
): ReconnaissancePlan {
  const cancelling = grade === null;
  const refusal = reconnaissanceRequestRefusal(
    context,
    sectorId,
    cancelling ? PAID_GRADES[0] : grade,
  );
  if (refusal !== null) return { refusal, key: '', chips: 0, request: null };

  const sector = sectorId as SectorId;
  return {
    refusal: null,
    key: reconOrderKeyOf(sector),
    chips: cancelling ? 0 : reconnaissancePriceOf(grade as PaidGrade),
    request: cancelling ? null : { sectorId: sector, grade: grade as PaidGrade },
  };
}

/**
 * What a purchase on one sector **certainly** buys, and what it buys only if a
 * force happens to be standing there (④ decision 5).
 *
 * The split is the pre-designation preview's whole content: a rear sector sells
 * durable knowledge, a front sector sells perishable knowledge that is
 * actionable now, and the player acquires that as a habit rather than as a rule
 * stated anywhere in the UI.
 */
export interface ReconnaissanceOffer {
  readonly sectorId: SectorId;
  readonly grade: PaidGrade;
  readonly price: number;
  /** Sector-attached readings. Bought outright — the land cannot walk away. */
  readonly certain: readonly ('garrison-substance' | 'sector-mobilization')[];
  /** Force-attached readings. Bought only if something is standing there. */
  readonly contingent: readonly ('field-substance' | 'field-fatigue' | 'field-position')[];
}

export function reconnaissanceOfferOf(request: ReconnaissanceRequest): ReconnaissanceOffer {
  return {
    sectorId: request.sectorId,
    grade: request.grade,
    price: reconnaissancePriceOf(request.grade),
    certain: ['garrison-substance', 'sector-mobilization'],
    contingent: ['field-substance', 'field-fatigue', 'field-position'],
  };
}

// ── the ledger ──────────────────────────────────────────────────────────────

/**
 * One immobile subject's record: a sector, and what this viewer has been told
 * about it.
 *
 * Two quantities, both sector-attached because neither can march out of the
 * ground it belongs to: the shield manning it, and the bodies this sector's
 * register has under arms anywhere (④ § What the grill found, finding 2 — a serving body keeps
 * its sector origin wherever it stands, ADR 0047). 동원 강도 and the civilian
 * register are *derived* from the second against the public register pool, with
 * zero new dials (gate 03 § 2).
 */
export interface SectorRecord {
  garrison: Testimony[];
  serving: Testimony[];
  /**
   * The latest turn a battle was fought **here** — public, and the only channel
   * that takes men away outright in this slice. Testimony older than it keeps its
   * upper edge and surrenders its lower one.
   */
  lastLossTurn?: number;
  /**
   * The latest turn this sector's realm fought **anywhere**.
   *
   * A wider door than the one above, and deliberately: a body drawn from this
   * sector's register can die in a battle on the far side of the board, and which
   * origins fell is not public. So the serving reading surrenders its lower edge
   * on any battle its realm was party to, while the shield standing here
   * surrenders its own only when the fighting was here.
   */
  servingLossTurn?: number;
}

/**
 * One mobile subject's record: a **contact**, which is a maximal run of turns in
 * which this viewer observed one force without a gap (④ decisions 3 and 4).
 *
 * A contact is never joined to another. After a blind turn the Runtime opens a
 * fresh one and the viewer holds both, reconciling them or not — which is where
 * deception lives, because an opponent who divides inside the blind spot leaves
 * a stale ~4,000 and a fresh ~1,000 that do not reconcile, with the dealer having
 * said nothing false.
 */
export interface ForceContact {
  readonly id: string;
  /** Whose force it is. Public the moment anything is seen at all. */
  readonly actor: ActorId;
  /**
   * Which force, so consecutive turns can be linked at all.
   *
   * **This does not decide whether a chain survives** — a blind turn does, and
   * `lastObservedTurn` is what records it (acceptance item: no code reads
   * `Detachment.id` to decide a chain's survival). ④ decision 3 rejected
   * composition change as the *definition* of identity because `Detachment.id`
   * survives both a division and a merge; it is used here only to answer "is
   * this the thing I looked at last turn", which is the question observation
   * already answers.
   */
  readonly detachmentId: string;
  readonly openedOnTurn: number;
  lastObservedTurn: number;
  /**
   * The turn this contact stopped being able to accumulate, if it has.
   *
   * Set when the force **changes composition** — a division or a consolidation.
   * ④ decision 2 says a division neither kills a testimony nor leaves it intact:
   * the count stays true of *the aggregate that came out of the observed force*,
   * and what is lost is the attribution. Closing the contact is that weakening
   * made mechanical — the statements stay in the ledger, dated and readable, and
   * stop describing whatever now stands under that name.
   *
   * This is **not** `Detachment.id` deciding whether a chain survives: an id
   * survives both operations, which is exactly why ④ decision 3 refused it as the
   * definition of identity. What closes a contact is the composition event the
   * Runtime performs, or a blind turn — the two things ④ actually names.
   */
  closedOnTurn?: number;
  substance: Testimony[];
  fatigue: Testimony[];
  lastSeenAt: HexPosition;
  lastSeenSector: SectorId;
  lastLossTurn?: number;
}

/** One viewer's whole intelligence picture, held by the Runtime beside truth. */
export interface IntelligenceLedger {
  sectors: Record<SectorId, SectorRecord>;
  contacts: ForceContact[];
  nextContactOrdinal: number;
}

export function emptyLedger(): IntelligenceLedger {
  return { sectors: {}, contacts: [], nextContactOrdinal: 0 };
}

export function sectorRecordOf(ledger: IntelligenceLedger, sectorId: SectorId): SectorRecord {
  const existing = ledger.sectors[sectorId];
  if (existing !== undefined) return existing;
  const fresh: SectorRecord = { garrison: [], serving: [] };
  ledger.sectors[sectorId] = fresh;
  return fresh;
}

/**
 * The contact a fresh observation belongs to — the open one if this viewer saw
 * this force **last turn**, and a brand new one otherwise.
 *
 * This single rule is ④ decisions 3 and 4 together: identity across observations
 * is free only under unbroken contact, and re-acquisition is a new contact rather
 * than a resumed track. One unobserved turn cuts the chain, and nothing rejoins it.
 */
/**
 * The sectors a force last seen at `from`, `age` turns ago, could stand on now.
 *
 * One reader for the projection's published cone and for the Runtime's "could
 * this contact have been in that battle" question, because two copies of *where
 * could it be* is how the band a player reads and the floor the Runtime releases
 * would come to disagree.
 *
 * Drawn at the **forced-march cap**, not the ordinary speed: a force may pay
 * fatigue to go further, so a cone at `MARCH_SPEED` would be a bound the board
 * can break, and every bound in this model has to be one it cannot.
 *
 * Sectors rather than hexes, because the sector is the operational atom
 * (ADR 0032) and is the grain a commitment is poured onto; a hex cone at
 * turn-scale staleness is hundreds of entries carrying no decision the sector
 * list does not already carry.
 */
export function reachableSectors(
  graph: MovementGraph,
  from: HexPosition,
  age: number,
  at: SectorId,
): SectorId[] {
  if (age <= 0) return [at];
  const cone = reachCone(graph, from, age, MARCH_SPEED + FORCED_MARCH_EXTRA_CAP);
  const reached = new Set<SectorId>();
  for (const key of cone) {
    const sector = graph.nodes[key]?.sectorId;
    if (sector !== undefined) reached.add(sector);
  }
  return [...reached].sort();
}

export function contactFor(
  ledger: IntelligenceLedger,
  actor: ActorId,
  detachmentId: string,
  turn: number,
  at: HexPosition,
  sector: SectorId,
): ForceContact {
  const open = ledger.contacts.find(
    (contact) =>
      contact.detachmentId === detachmentId &&
      contact.actor === actor &&
      contact.closedOnTurn === undefined &&
      (contact.lastObservedTurn === turn || contact.lastObservedTurn === turn - 1),
  );
  if (open !== undefined) {
    open.lastObservedTurn = turn;
    open.lastSeenAt = { ...at };
    open.lastSeenSector = sector;
    return open;
  }

  const fresh: ForceContact = {
    id: `contact:${actor}:${ledger.nextContactOrdinal}`,
    actor,
    detachmentId,
    openedOnTurn: turn,
    lastObservedTurn: turn,
    substance: [],
    fatigue: [],
    lastSeenAt: { ...at },
    lastSeenSector: sector,
  };
  ledger.nextContactOrdinal += 1;
  ledger.contacts.push(fresh);
  return fresh;
}

// ── the forward-correction envelope ─────────────────────────────────────────

/**
 * The most men a realm can move into service in one turn — **the recruitment
 * rate term of the affordability bound** (③ decision 5's first named input).
 *
 * Both factors are sealed and the third is published: one action point buys
 * `RECRUIT_FRACTION_PER_POINT` of the force limit (MT-③, R10) and the whole
 * stack is a legal pour with nothing capping the turn, so `budget × fraction ×
 * forceLimit` is a hard ceiling on a turn's draft. The force limit is
 * land-derived and public for both realms, which is what makes this computable
 * by a viewer with no access to truth — and what makes ③'s stated consequence
 * literal: **the rot rate of intelligence is land-derived**, so a large realm's
 * readings go stale faster than a small one's.
 *
 * No new dial: this is a product of two sealed constants and a published figure.
 */
export function recruitmentReachPerTurn(forceLimit: number): number {
  return RECRUIT_FRACTION_PER_POINT * TURN_COMMITMENT_BUDGET * forceLimit;
}

/**
 * Every open contact on these forces stops accumulating, as of this turn.
 *
 * Called by the Runtime when it divides or consolidates a force, for every
 * viewer at once — including the force's own realm, which simply never has a
 * contact on itself. See `ForceContact.closedOnTurn` for why a composition
 * change rather than an id comparison is what does this.
 */
export function closeContactsOn(
  ledger: IntelligenceLedger,
  detachmentIds: readonly string[],
  turn: number,
): void {
  for (const contact of ledger.contacts) {
    if (contact.closedOnTurn === undefined && detachmentIds.includes(contact.detachmentId)) {
      contact.closedOnTurn = turn;
    }
  }
}

/**
 * How a **force**'s count could have moved in one turn.
 *
 * Upward by the recruitment rate term — fresh cohorts may join a standing
 * detachment. Downward by nothing *by rate*, and that is the casualty curve's
 * answer rather than an omission of it: ③ decision 5 names the curve as one of
 * the three bounds, and `casualtyFractions` caps at **1**, so the honest public
 * bound a battle yields is total loss. Its inputs — the composed power product —
 * are not public, so nothing sharper is computable by a viewer. A battle is
 * public, so it is carried as `lastLossTurn`; a turn without one takes nobody,
 * because this slice has no attrition outside battle.
 * Division and consolidation open no channel here because they close the contact
 * instead (④ decision 2) — a testimony is a statement about the men that were
 * counted, and those men do not stop existing when they are re-labelled.
 */
export function forceEnvelope(forceLimit: number): ChangeEnvelope {
  return { gainPerTurn: recruitmentReachPerTurn(forceLimit), lossPerTurn: 0 };
}

/**
 * How a sector's **shield** could have changed in one turn.
 *
 * Two inbound channels, and the second is not a rate at all: ready field men may
 * step into the shield of the ground they already stand on, which moves whatever
 * happens to be standing there. The realm's public force ceiling is the only
 * bound on that a viewer can compute, because the knowledge matrix carries no
 * adjacency row (gate 03 § 4) — a viewer cannot tell whether a force was there to
 * step in.
 *
 * **Bounded unconditionally rather than by the event.** Marking the sector when a
 * transfer actually happened would keep the band sharp until one did — but a band
 * that widens *because* men changed posture reads a posture change back to the
 * opponent, and gate 03 § 4 puts enemy standing posture Absent from the
 * projection. That would be an information rule no seal grants, so it is not
 * written here.
 *
 * The price is real and is what a player will feel: a realm's one-turn draft
 * already exceeds any ordinary shield's 900-man cap, so a garrison reading's
 * **ceiling** was public all along and its **floor** is the whole of what
 * reconnaissance buys on immobile ground. `docs/SYNC-DEBT.md` carries it.
 */
export function garrisonEnvelope(forceLimit: number): ChangeEnvelope {
  return { gainPerTurn: recruitmentReachPerTurn(forceLimit) + forceLimit, lossPerTurn: 0 };
}

/**
 * How a force's **wear** could have moved in one turn — every term sealed.
 *
 * Up by the most a turn of marching and fighting can cost: five hexes at the
 * forced-march cap, the forced-march premium on top, and a maximally bloody
 * battle. Down by the recovery rate at full supply, which is its ceiling.
 *
 * Unlike substance this needs a real rate on **both** edges, because wear is the
 * one banded quantity that moves every single turn under its own steam. A
 * zero envelope here is what emptied the first intersection this ticket built.
 */
export function fatigueEnvelope(): ChangeEnvelope {
  return {
    gainPerTurn:
      // Marching: the forced-march cap in hexes, each hex at the forced-march
      // price, because the premium is a **multiplier** on the per-hex cost rather
      // than a flat surcharge (`movement.ts`).
      MARCH_FATIGUE_PER_HEX * FORCED_MARCH_PREMIUM * (MARCH_SPEED + FORCED_MARCH_EXTRA_CAP)
      // Fighting: the ledger added at a total-casualty fraction of one.
      + BATTLE_FATIGUE_COEF
      // Being driven off the field afterwards, which costs a hex of its own.
      + MARCH_FATIGUE_PER_HEX,
    lossPerTurn: RECOVERY_BASE_RATE,
  };
}

/**
 * What is known about a force's wear before anyone has looked: nothing above
 * zero.
 *
 * The wear ledger has **no ceiling**. `CONVERSION_TERMINAL_LEDGER` is where its
 * *effect* saturates — past it a force is already at the effectiveness floor and
 * fights no worse — but the ledger itself keeps counting, and a match reaches
 * three times that figure inside a few turns of hard fighting. A public bound of
 * `CONVERSION_TERMINAL_LEDGER` therefore excludes the truth, which is the one
 * thing a bound may never do; the G3 oracle caught it on an existing test the
 * first time this ran.
 *
 * Unbounded above is safe to publish because a contact only exists where an
 * observation created it, so this bound is never the whole answer: the first
 * testimony makes the composed band finite.
 */
export const UNKNOWN_WEAR = Object.freeze({ low: 0, high: Number.POSITIVE_INFINITY });

/**
 * How a sector's **serving** count could have changed in one turn.
 *
 * Upward by the recruitment rate term alone: a posture transfer moves a body
 * between field and shield without changing whether it serves. Downward by
 * nothing by rate — a sector's population cannot march out (④ § What the grill
 * found, finding 2),
 * which is exactly why the immobile subjects' bands decay rather than vanish.
 * Death is carried by `servingLossTurn`.
 */
export function servingEnvelope(forceLimit: number): ChangeEnvelope {
  return { gainPerTurn: recruitmentReachPerTurn(forceLimit), lossPerTurn: 0 };
}

/** The grade a battle hands out for free, by what the battle did. */
export function contactGrade(repelledAssault: boolean): ObservationGrade {
  return repelledAssault ? 'repelled-assault' : 'battle-contact';
}
