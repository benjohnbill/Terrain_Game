/**
 * 행동력 (action points) — the turn's chip stack, and the rules for spending it.
 *
 * Authority: duel-pivot ledger **D6.3**, sealed 2026-07-24. One stack, regenerated
 * each turn at the same size, non-hoardable, and the single currency for *every*
 * order kind — combat, reconnaissance, relocation, all of it draws from the same
 * pool. Chips poured onto a front **are** that engagement's commitment points.
 *
 * The consequence that makes the mechanism matter, in the user's framing: a
 * commitment is not an absolute strength but a **ratio** in the confrontation, so
 * dividing the stack across fronts thins every point of it against an opponent who
 * concentrates. A per-order-count budget would delete that — three fronts could
 * all be maxed and mutual exposure would vanish.
 *
 * Like `capital-choice.ts`, this is a **rule over plain values**, not truth: the
 * Runtime and `preview` both call it so they cannot drift into telling the player
 * different things, and importing it grants no access to what the Runtime knows.
 */

import type { ActorId } from '../runtime/types.js';
import { ORDER_RECRUIT } from './recruitment.js';
import { reachCone, type MovementGraph } from './movement.js';
import { hexKey } from '../world/schema.js';
import type { Front, HexPosition } from '../runtime/types.js';

/**
 * The size of the stack, per realm, per turn.
 *
 * **가안 20**, recorded in ledger D6.3 ("budget size (가안 20) = L3 feel") and kept
 * here as the single place the number is written. It pairs with the P2-fixed
 * commitment-point range 0–20 that the M2 lever curve consumes, so the whole stack
 * poured onto one front is exactly a maximal commitment there.
 *
 * It is a **feel dial awaiting play** (L-stamp L0), not a derived constant. Tuning
 * it is a user decision; nothing here may infer a different value.
 */
export const TURN_COMMITMENT_BUDGET = 20;

/** One realm's allocations for the current turn: front key -> chips. */
export type Allocations = Readonly<Record<string, number>>;

/** One realm's selected field substance: front key -> own detachment ids. */
export type FrontAssignments = Readonly<Record<string, readonly string[]>>;

/** One stable request's key in the shared front/order allocation namespace. */
export const recruitmentOrderKeyOf = (requestId: string): string =>
  `${ORDER_RECRUIT}:${requestId}`;

/** The share of the one stack currently poured into sited recruitment. */
export const recruitmentCommitOf = (allocations: Readonly<Record<string, number>>): number =>
  Object.entries(allocations)
    .filter(([key]) => key.startsWith(`${ORDER_RECRUIT}:`))
    .reduce((sum, [, commit]) => sum + commit, 0);

export interface AssignableDetachment {
  readonly id: string;
  readonly position: HexPosition;
  readonly turnEndpoint: HexPosition;
  readonly reachSpeed: number;
}

/** Validate selected field substance against its canonical one-turn endpoint. */
export function frontAssignmentRefusal(
  graph: MovementGraph,
  front: Front,
  detachments: readonly AssignableDetachment[],
  detachmentIds: unknown,
  assignedElsewhere: readonly string[] = [],
): string | null {
  if (detachmentIds === undefined) return null;
  if (!Array.isArray(detachmentIds)) return 'A front assignment must list detachment ids.';
  if (new Set(detachmentIds).size !== detachmentIds.length) {
    return 'A detachment may be named only once in one front assignment.';
  }
  const unavailable = new Set(assignedElsewhere);

  for (const id of detachmentIds) {
    if (typeof id !== 'string' || id.length === 0) {
      return 'A front assignment must list valid detachment ids.';
    }
    const detachment = detachments.find((candidate) => candidate.id === id);
    if (detachment === undefined) return `Detachment "${id}" is not owned by this actor.`;
    if (unavailable.has(id)) return `Detachment "${id}" is already assigned to another front.`;
    const endpointKey = hexKey(detachment.turnEndpoint.q, detachment.turnEndpoint.r);
    if (!reachCone(graph, detachment.position, 1, detachment.reachSpeed).has(endpointKey)) {
      return `Detachment "${id}" cannot reach its claimed endpoint this turn.`;
    }
    const endpointSector = graph.nodes[endpointKey]?.sectorId;
    if (endpointSector === undefined || !front.sectors.includes(endpointSector)) {
      return `Detachment "${id}" does not end this turn on front "${front.key}".`;
    }
  }
  return null;
}

/** Everything the spend rules need, and nothing that would leak truth. */
export interface CommitmentContext {
  /** Is the decision tier open? The payoff tier takes no input at all (D6.2). */
  readonly windowOpen: boolean;
  /** Has this realm already locked this turn? The commit is blind and binding. */
  readonly alreadyLocked: boolean;
  /** The fronts this realm is a party to, by key. */
  readonly frontKeys: readonly string[];
  /**
   * The non-front order kinds this realm may pour into, by key.
   *
   * D6.3 seals one stack as the single currency for **every** order kind, and R2
   * (2026-07-25) put non-combat orders on the same free-pour grammar, priced by
   * unit. So an order is not a second budget with its own rules — it is another
   * key in this one, and the Σ ≤ budget check below covers fronts and orders
   * together without knowing the difference.
   */
  readonly orderKeys?: readonly string[];
  /** This realm's own allocations so far this turn. */
  readonly allocations: Allocations;
  readonly budget: number;
}

/** Chips already committed across every front — one sum, never per order kind. */
export function spentOf(allocations: Allocations): number {
  return Object.values(allocations).reduce((total, chips) => total + chips, 0);
}

/**
 * Returns a reportable refusal, or `null` when the allocation is legal.
 *
 * The two turn-legality refusals are R8's, sealed 2026-07-25: **"the commit window
 * is closed"** and **"this realm has already locked this turn"**. Neither asks
 * whose turn it is, because in a simultaneous turn that question has no answer —
 * both realms are legal callers at the same moment.
 */
export function allocationRefusal(
  context: CommitmentContext,
  actor: ActorId,
  front: unknown,
  chips: unknown,
): string | null {
  if (!context.windowOpen) return 'The commit window is closed.';
  if (context.alreadyLocked) {
    return `"${actor}" has already locked this turn; a commitment is blind and binding.`;
  }
  if (typeof front !== 'string' || front.length === 0) {
    return 'An allocation must name a front.';
  }
  if (!context.frontKeys.includes(front) && !(context.orderKeys ?? []).includes(front)) {
    return `"${front}" is neither a front "${actor}" holds a side of nor an order kind.`;
  }
  if (typeof chips !== 'number' || !Number.isInteger(chips) || chips < 0) {
    return 'An allocation must be a whole, non-negative number of chips.';
  }

  // An allocation *replaces* its front's share rather than adding to it, so the
  // front being re-priced is excluded from the sum. That is what makes reviewing
  // and re-cutting a plan before locking free, which the decision tier requires.
  const others = spentOf(context.allocations) - (context.allocations[front] ?? 0);
  if (others + chips > context.budget) {
    return (
      `That would commit ${others + chips} 행동력 of ${context.budget}; ` +
      'the turn\'s stack does not stretch, and it does not carry over.'
    );
  }

  return null;
}

/** Returns a reportable refusal, or `null` when the realm may lock. */
export function lockRefusal(context: CommitmentContext, actor: ActorId): string | null {
  if (!context.windowOpen) return 'The commit window is closed.';
  if (context.alreadyLocked) {
    return `"${actor}" has already locked this turn; a commitment is blind and binding.`;
  }
  // Locking with an empty stack is legal: pouring nothing into a turn is a real
  // choice, and a rule forbidding it would price patience.
  return null;
}

/**
 * A realm's share of the total commitment at one front — the "relative ratio"
 * D6.3 names, derived rather than stored.
 *
 * Kept out of the event stream deliberately: the event carries integers, and this
 * is the reading a display makes of them. Ticket 09's EVAL BAR is where a reading
 * like this becomes a designed surface.
 */
export function commitmentShare(commitments: Readonly<Record<ActorId, number>>, actor: ActorId): number {
  const total = Object.values(commitments).reduce((sum, chips) => sum + chips, 0);
  return total === 0 ? 0 : (commitments[actor] ?? 0) / total;
}
