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
  sectorAssignmentRefusal,
  lockRefusal,
  recruitmentOrderKeyOf,
  type CommitmentContext,
} from '../domain/commitment.js';
import { capitalGuardOf, garrisonHeadroomOf } from '../domain/economy.js';
import {
  mergeDetachmentsRefusal,
  splitDetachmentRefusal,
  transferToGarrisonRefusal,
} from '../domain/force.js';
import {
  buildMovementGraph,
  FORCED_MARCH_EXTRA_CAP,
  MARCH_SPEED,
  movementOrderRefusal,
  musterHexOf,
  reachCone,
} from '../domain/movement.js';
import {
  recruitmentRequestRefusal,
  settleRecruitmentBatch,
  type DraftResult,
  type RecruitmentBatchResult,
  type RecruitmentFulfillment,
  type RecruitmentRequest,
} from '../domain/recruitment.js';
import { hexKey } from '../world/schema.js';
import type { ActorId, DetachmentView, HexPosition, Intent, MatchView, SectorId } from '../runtime/types.js';

export interface RecruitmentPreview {
  readonly fulfillment: RecruitmentFulfillment;
  readonly batch: RecruitmentBatchResult;
}

export interface PreviewCard {
  /** Whether the Runtime would accept this intent, as far as a viewer can tell. */
  readonly admissible: boolean;
  /** Why not, when it would not. Reportable to the player verbatim. */
  readonly reason?: string;
  /** For a recruitment order: what these chips would actually raise, and at what price. */
  readonly draft?: DraftResult;
  /** The selected request plus the exact aggregate batch answer it participates in. */
  readonly recruitment?: RecruitmentPreview;
}

const no = (reason: string): PreviewCard => ({ admissible: false, reason });

/**
 * The guard raising this sector's ceiling for the realm reading the view — the
 * view-side twin of `Runtime.#capitalGuardAt`, and the reason the two agree is that
 * both read the *same* coefficient from `domain/economy.ts` rather than each
 * carrying a number.
 *
 * It needs no truth the projection withholds: a realm's own capital is public to it
 * from the moment it picks one, and `populationValue` is authored geography, which
 * the information ladder keeps in the open.
 *
 * Before the reveal `view.capitals` may hold only this realm's own choice, which is
 * exactly the case this asks about — so the preview and the Runtime cannot disagree
 * during the opening beat either.
 */
function capitalGuardIn(view: MatchView, sectorId: SectorId): number {
  if (view.capitals[view.viewer] !== sectorId) return 0;
  return capitalGuardOf(view.board.sectors[sectorId]!.populationValue);
}

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

function recruitmentLegalityContext(
  view: MatchView,
  actor: ActorId,
  graph: ReturnType<typeof buildMovementGraph>,
) {
  const sectors = Object.values(view.board.sectors);
  return {
    controlledSectors: view.realms.find((realm) => realm.actor === actor)?.sectors ?? [],
    registeredSectors: Object.keys(view.economy?.sectors ?? {}),
    musterHexes: Object.fromEntries(sectors.map((sector) => [
      sector.id,
      musterHexOf(view.board, sector.id),
    ])),
    movementGraph: graph,
    detachments: view.detachments.map((detachment) => ({
      id: detachment.id,
      turnEndpoint: detachment.turnEndpoint,
    })),
  };
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
    return no('Scalar recruitment is retired; submit allocate-recruitment with a controlled sector.');
  }

  if (intent.kind === 'allocate-recruitment') {
    if (intent.actor !== view.viewer) {
      return no(`A commitment is previewed by the realm making it; "${view.viewer}" cannot preview "${intent.actor}"'s.`);
    }
    const economy = view.economy;
    if (economy === null) return no('Recruitment is previewed by the realm making it.');
    const allocation = intent as {
      requestId?: unknown;
      sectorId?: unknown;
      commit?: unknown;
      posture?: unknown;
      destinationHex?: unknown;
      joinDetachmentId?: unknown;
      forcedMarch?: unknown;
    };
    const graph = buildMovementGraph(view.board);
    const legalityContext = recruitmentLegalityContext(view, intent.actor, graph);
    let refusal = recruitmentRequestRefusal(
      legalityContext,
      allocation.requestId,
      allocation.sectorId,
      allocation.commit,
      allocation.posture,
      allocation.destinationHex,
      allocation.joinDetachmentId,
      allocation.forcedMarch,
    );
    const requestId = allocation.requestId as string;
    const key = typeof requestId === 'string' ? recruitmentOrderKeyOf(requestId) : '';
    if (refusal === null) {
      refusal = allocationRefusal(
        commitmentContext(view, intent.actor, [key]),
        intent.actor,
        key,
        allocation.commit,
      );
    }
    if (refusal !== null) return no(refusal);
    if (allocation.commit === 0) return { admissible: true };

    const request: RecruitmentRequest = {
      requestId,
      sectorId: allocation.sectorId as SectorId,
      commit: allocation.commit as number,
      posture: allocation.posture as RecruitmentRequest['posture'],
      ...(allocation.destinationHex === undefined
        ? {}
        : { destinationHex: allocation.destinationHex as HexPosition }),
      ...(allocation.joinDetachmentId === undefined
        ? {}
        : { joinDetachmentId: allocation.joinDetachmentId as string }),
    };
    const requests = [
      ...view.recruitmentOrders.filter((stored) => stored.requestId !== request.requestId),
      request,
    ];
    const musterHexes = Object.fromEntries(
      requests.map((stored) => [stored.sectorId, musterHexOf(view.board, stored.sectorId)]),
    );
    const currentGarrisons = Object.fromEntries(
      view.garrisons.map((garrison) => [garrison.sectorId, garrison.men]),
    );
    const garrisonHeadroom = Object.fromEntries(requests.map((stored) => [
      stored.sectorId,
      garrisonHeadroomOf(
        currentGarrisons[stored.sectorId] ?? 0,
        capitalGuardIn(view, stored.sectorId),
      ),
    ]));
    const batch = settleRecruitmentBatch({
      requests,
      forceLimit: economy.forceLimit,
      field: economy.field,
      garrison: economy.garrison,
      register: economy.register,
      treasury: economy.treasury,
      availableCivilians: Object.fromEntries(
        Object.entries(economy.sectors).map(([sector, row]) => [sector, row.availableCivilians]),
      ),
      garrisonHeadroom,
      musterHexes,
    });
    const fulfillment = batch.fulfilled.find((candidate) => candidate.requestId === request.requestId)!;
    return { admissible: true, recruitment: { fulfillment, batch } };
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
          { ...context, orderKeys: [] },
          intent.actor,
          (intent as { sector?: unknown }).sector,
          (intent as { chips?: unknown }).chips,
        );
    if (refusal === null && intent.kind === 'allocate-commitment') {
      const allocation = intent as {
        sector?: unknown;
        chips?: unknown;
        detachmentIds?: unknown;
      };
      if (allocation.chips !== 0) {
        const graph = buildMovementGraph(view.board);
        refusal = sectorAssignmentRefusal(
          graph,
          allocation.sector as SectorId,
          assignableDetachmentViews(graph, view.detachments),
          allocation.detachmentIds,
          Object.entries(view.commitment.assignments)
            .filter(([assigned]) => assigned !== allocation.sector)
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
      for (const [sector, detachmentIds] of assignments) {
        const assignmentError = sectorAssignmentRefusal(
          graph,
          sector,
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
      if (refusal === null) {
        const recruitmentContext = recruitmentLegalityContext(view, intent.actor, graph);
        for (const request of view.recruitmentOrders) {
          const requestError = recruitmentRequestRefusal(
            recruitmentContext,
            request.requestId,
            request.sectorId,
            request.commit,
            request.posture,
            request.destinationHex,
            request.joinDetachmentId,
          );
          if (requestError !== null) {
            refusal = `${requestError} Revise this recruitment before locking.`;
            break;
          }
        }
      }
    }
    return refusal === null ? { admissible: true } : no(refusal);
  }

  if (intent.kind === 'move-detachment') {
    if (intent.actor !== view.viewer) {
      return no(`A movement order is previewed by the realm making it; "${view.viewer}" cannot preview "${intent.actor}"'s.`);
    }
    const windowRefusal = lockRefusal(commitmentContext(view, intent.actor), intent.actor);
    if (windowRefusal !== null) return no(windowRefusal);
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

  if (intent.kind === 'transfer-to-garrison') {
    if (intent.actor !== view.viewer) {
      return no(`A posture transfer is previewed by the realm making it; "${view.viewer}" cannot preview "${intent.actor}"'s.`);
    }
    const windowRefusal = lockRefusal(commitmentContext(view, intent.actor), intent.actor);
    if (windowRefusal !== null) return no(windowRefusal);

    // The same sites the Runtime reads, rebuilt from the view: a realm sees its own
    // holdings, its own shields and its own formations exactly, so this needs no truth
    // the projection withholds.
    const shields = new Map(view.garrisons.map((garrison) => [garrison.sectorId, garrison]));
    const controlled = view.realms.find((realm) => realm.actor === intent.actor)?.sectors ?? [];
    const sites = [...controlled].sort().map((sectorId) => {
      const shield = shields.get(sectorId);
      const garrisonMen = shield?.men ?? 0;
      return {
        sectorId,
        musterHex: musterHexOf(view.board, sectorId),
        garrisonMen,
        garrisonHeadroom: garrisonHeadroomOf(garrisonMen, capitalGuardIn(view, sectorId)),
      };
    });

    const postureRefusal = transferToGarrisonRefusal(
      view.detachments.map((detachment) => ({
        id: detachment.id,
        position: detachment.position,
        men: detachment.men,
        readyMen: detachment.readyMen,
      })),
      sites,
      (intent as { detachmentId?: unknown }).detachmentId,
      (intent as { men?: unknown }).men,
    );
    return postureRefusal === null ? { admissible: true } : no(postureRefusal);
  }

  return no(`No resolution is wired for intent kind "${intent.kind}" yet.`);
}

/**
 * The spend context, assembled from a projection.
 *
 * Every field is available to a viewer by seal: the phase, who has committed (R7),
 * the board's sectors (geography is public), and the viewer's *own* stack. Nothing
 * here needs the opponent's allocation — which is exactly why a blind commit can be
 * previewed at all.
 */
function commitmentContext(
  view: MatchView,
  actor: ActorId,
  candidateOrderKeys: readonly string[] = [],
): CommitmentContext {
  return {
    windowOpen: view.phase === 'decision',
    alreadyLocked: view.committed.includes(actor),
    sectorKeys: Object.keys(view.board.sectors),
    orderKeys: [...new Set([
      ...view.recruitmentOrders.map((request) => recruitmentOrderKeyOf(request.requestId)),
      ...candidateOrderKeys,
    ])],
    // Safe because the caller already established `actor === view.viewer`.
    allocations: view.commitment.allocations,
    budget: view.commitment.budget,
  };
}
