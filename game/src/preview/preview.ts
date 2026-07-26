/**
 * `preview(view, intent) -> PreviewCard` — pure, and outside the Runtime.
 *
 * Gate 02 § 6 places preview among the "pure modules outside the Runtime (no
 * access to truth)", and states that it is used by **both** the human UI and
 * bots. That shared door is the point: a bot that previewed against truth while
 * the human previewed against a projection would be reading a different game.
 *
 * Its input is a `MatchView`, never a `MatchState` — enforced by the type. It
 * may read a *rule* from `domain/` (a pure function over plain values, which is
 * how it and the Runtime stay in step by construction); it may never read truth.
 */

import { capitalChoiceRefusal } from '../domain/capital-choice.js';
import {
  allocationRefusal,
  frontAssignmentRefusal,
  lockRefusal,
  type CommitmentContext,
} from '../domain/commitment.js';
import { mergeDetachmentsRefusal, splitDetachmentRefusal } from '../domain/force.js';
import { isPartyTo } from '../domain/fronts.js';
import {
  buildMovementGraph,
  FORCED_MARCH_EXTRA_CAP,
  MARCH_SPEED,
  movementOrderRefusal,
  reachCone,
} from '../domain/movement.js';
import { draftOrder, ORDER_KEYS, orderKeyOf, type DraftResult } from '../domain/recruitment.js';
import { hexKey } from '../world/schema.js';
import type { ActorId, DetachmentView, Intent, MatchView, SectorId } from '../runtime/types.js';

export interface PreviewCard {
  /** Whether the Runtime would accept this intent, as far as a viewer can tell. */
  readonly admissible: boolean;
  /** Why not, when it would not. Reportable to the player verbatim. */
  readonly reason?: string;
  /** For a recruitment order: what these chips would actually raise, and at what price. */
  readonly draft?: DraftResult;
}

const no = (reason: string): PreviewCard => ({ admissible: false, reason });

function assignableDetachmentViews(
  graph: ReturnType<typeof buildMovementGraph>,
  detachments: readonly DetachmentView[],
) {
  return detachments.map((detachment) => {
    const endpoint = hexKey(detachment.turnEndpoint.q, detachment.turnEndpoint.r);
    const normallyReachable = reachCone(graph, detachment.position, 1, MARCH_SPEED).has(endpoint);
    return {
      id: detachment.id,
      position: detachment.position,
      turnEndpoint: detachment.turnEndpoint,
      reachSpeed: normallyReachable ? MARCH_SPEED : MARCH_SPEED + FORCED_MARCH_EXTRA_CAP,
    };
  });
}

/**
 * What a viewer can check without truth. Kept deliberately in step with the
 * Runtime's own guards: a preview that said yes where `submit` says no would
 * teach the player a rule the game does not have.
 */
export function preview(view: MatchView, intent: Intent): PreviewCard {
  if (!intent || typeof intent.kind !== 'string' || intent.kind.length === 0) {
    return no('An intent must carry a non-empty kind.');
  }
  if (!view.actors.includes(intent.actor)) {
    return no(`"${String(intent.actor)}" is not an actor in this match.`);
  }

  if (intent.kind === 'choose-capital') {
    const refusal = capitalChoiceRefusal(
      {
        inSelectionPhase: view.phase === 'capital-selection',
        alreadyLocked: view.committed.includes(intent.actor),
        ownedSectors: view.realms.find((r) => r.actor === intent.actor)?.sectors ?? [],
      },
      intent.actor,
      (intent as { sector?: SectorId }).sector,
    );
    return refusal === null ? { admissible: true } : no(refusal);
  }

  if (intent.kind === 'allocate-order') {
    if (intent.actor !== view.viewer) {
      return no(`A commitment is previewed by the realm making it; "${view.viewer}" cannot preview "${intent.actor}"'s.`);
    }
    const { order, chips } = intent as { order?: unknown; chips?: unknown };
    if (typeof order !== 'string' || order.length === 0) {
      return no('An order allocation must name an order kind.');
    }
    const refusal = allocationRefusal(
      commitmentContext(view, intent.actor),
      intent.actor,
      orderKeyOf(order),
      chips,
    );
    if (refusal !== null) return no(refusal);

    // Beyond admissibility, an order preview answers the question the player is
    // actually asking: *what do I get for this?* The Runtime resolves the draft
    // with the same rule over the same numbers, so the card cannot promise men
    // the background tier then declines to deliver.
    if (order === 'recruit') {
      const economy = view.economy;
      if (economy === null) return no('A draft is previewed by the realm making it.');
      const draft = draftOrder({
        chips: chips as number,
        forceLimit: economy.forceLimit,
        field: economy.field,
        garrison: economy.garrison,
        register: economy.register,
        treasury: economy.treasury,
      });
      return { admissible: true, draft };
    }

    return { admissible: true };
  }

  if (intent.kind === 'allocate-commitment' || intent.kind === 'lock-commitment') {
    // A commitment can only be previewed by the realm making it. This is not the
    // preview disagreeing with the Runtime — it is the blur seam speaking: a
    // projection carries the viewer's own stack and nobody else's, so the input the
    // rule needs genuinely is not there. Answering anyway, from whatever stack the
    // viewer happens to hold, is how a preview starts inventing a rule.
    if (intent.actor !== view.viewer) {
      return no(`A commitment is previewed by the realm making it; "${view.viewer}" cannot preview "${intent.actor}"'s.`);
    }
    const context = commitmentContext(view, intent.actor);
    let refusal = intent.kind === 'lock-commitment'
      ? lockRefusal(context, intent.actor)
      : allocationRefusal(
          context,
          intent.actor,
          (intent as { front?: unknown }).front,
          (intent as { chips?: unknown }).chips,
        );
    if (refusal === null && intent.kind === 'allocate-commitment') {
      const allocation = intent as {
        front?: unknown;
        chips?: unknown;
        detachmentIds?: unknown;
      };
      if (allocation.chips !== 0) {
        const front = view.fronts.find((candidate) => candidate.key === allocation.front)!;
        const graph = buildMovementGraph(view.board);
        refusal = frontAssignmentRefusal(
          graph,
          front,
          assignableDetachmentViews(graph, view.detachments),
          allocation.detachmentIds,
          Object.entries(view.commitment.assignments)
            .filter(([assignedFront]) => assignedFront !== allocation.front)
            .flatMap(([, ids]) => ids),
        );
      }
    }
    if (refusal === null && intent.kind === 'lock-commitment') {
      const graph = buildMovementGraph(view.board);
      const detachments = assignableDetachmentViews(graph, view.detachments);
      const assigned = new Set<string>();
      const assignments = Object.entries(view.commitment.assignments)
        .sort(([a], [b]) => a.localeCompare(b));
      for (const [frontKey, detachmentIds] of assignments) {
        const front = view.fronts.find((candidate) => candidate.key === frontKey);
        if (front === undefined) {
          refusal = `Front "${frontKey}" is no longer contested; revise this commitment before locking.`;
          break;
        }
        const assignmentError = frontAssignmentRefusal(
          graph,
          front,
          detachments,
          detachmentIds,
          [...assigned],
        );
        if (assignmentError !== null) {
          refusal = `${assignmentError} Revise this commitment before locking.`;
          break;
        }
        for (const detachmentId of detachmentIds) assigned.add(detachmentId);
      }
    }
    return refusal === null ? { admissible: true } : no(refusal);
  }

  if (intent.kind === 'move-detachment') {
    if (intent.actor !== view.viewer) {
      return no(`A movement order is previewed by the realm making it; "${view.viewer}" cannot preview "${intent.actor}"'s.`);
    }
    const movement = intent as {
      detachmentId?: unknown;
      destinationHex?: unknown;
      forcedMarch?: unknown;
    };
    const refusal = movementOrderRefusal(
      buildMovementGraph(view.board),
      view.detachments,
      movement.detachmentId,
      movement.destinationHex,
      movement.forcedMarch,
    );
    return refusal === null ? { admissible: true } : no(refusal);
  }

  if (intent.kind === 'split-detachment' || intent.kind === 'merge-detachments') {
    if (intent.actor !== view.viewer) {
      return no(`A formation order is previewed by the realm making it; "${view.viewer}" cannot preview "${intent.actor}"'s.`);
    }
    const windowRefusal = lockRefusal(commitmentContext(view, intent.actor), intent.actor);
    if (windowRefusal !== null) return no(windowRefusal);
    const formations = view.detachments.map((detachment) => ({
      id: detachment.id,
      position: detachment.position,
      men: detachment.men,
    }));
    const refusal = intent.kind === 'split-detachment'
      ? splitDetachmentRefusal(
          formations,
          (intent as { detachmentId?: unknown }).detachmentId,
          (intent as { men?: unknown }).men,
        )
      : mergeDetachmentsRefusal(
          formations,
          (intent as { detachmentIds?: unknown }).detachmentIds,
        );
    return refusal === null ? { admissible: true } : no(refusal);
  }

  return no(`No resolution is wired for intent kind "${intent.kind}" yet.`);
}

/**
 * The spend context, assembled from a projection.
 *
 * Every field is available to a viewer by seal: the phase, who has committed (R7),
 * the fronts (territory is public), and the viewer's *own* stack. Nothing here
 * needs the opponent's allocation — which is exactly why a blind commit can be
 * previewed at all.
 */
function commitmentContext(view: MatchView, actor: ActorId): CommitmentContext {
  return {
    windowOpen: view.phase === 'decision',
    alreadyLocked: view.committed.includes(actor),
    frontKeys: view.fronts.filter((front) => isPartyTo(front, actor)).map((front) => front.key),
    orderKeys: ORDER_KEYS,
    // Safe because the caller already established `actor === view.viewer`.
    allocations: view.commitment.allocations,
    budget: view.commitment.budget,
  };
}
