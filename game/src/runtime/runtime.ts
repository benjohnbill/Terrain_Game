/**
 * The Game Runtime — a thin state-owning shell.
 *
 * Authority: Wayfinder gate 02 § 6. The surface is exactly three members:
 *
 *     currentActor  -> ActorId
 *     view(viewerId) -> MatchView     // viewer-safe; blurred here, once
 *     submit(intent) -> GameEvent[]   // validate -> resolve -> advance
 *
 * and nothing more. There is deliberately **no snapshot API** (it would hand
 * truth to a caller and void the blur seam) and **no subscription API**
 * (callers pump; `submit` returns the events).
 *
 * Gate 02 also fixes that internal decomposition is an internal seam: this may
 * implement transitions as pure functions behind the shell, and that stays an
 * implementation choice rather than a caller contract.
 */

import { capitalChoiceRefusal } from '../domain/capital-choice.js';
import type { MatchState, Realm } from '../domain/state.js';
import { project } from '../projection/project.js';
import { drawPartition } from '../world/partition.js';
import { loadWorld } from '../world/load.js';
import type { SectorId } from '../world/schema.js';
import { createRng } from './rng.js';
import type { ActorId, Clock, GameEvent, Intent, MatchConfig, MatchView, ViewerId } from './types.js';

/** A clock that refuses to be read. Rules must never need one (ADR 0040). */
const NO_CLOCK: Clock = {
  now(): number {
    throw new Error(
      'No clock was injected. Rules must not read the wall clock (ADR 0040); ' +
        'if a caller genuinely needs time, inject it through MatchConfig.clock.',
    );
  },
};

export class Runtime {
  /** Truth. `#`-private, so it is unreachable from outside even at runtime. */
  readonly #state: MatchState;
  readonly #clock: Clock;

  private constructor(state: MatchState, clock: Clock) {
    this.#state = state;
    this.#clock = clock;
  }

  /**
   * Opens a match: validate the world, draw the partition, seat the actors, and
   * stop at the capital-selection prompt.
   *
   * Rejects rather than repairs at every step. A bad config is a caller bug and
   * a bad world is an authoring error; a Runtime that quietly substituted a
   * default would make the seed contract — equal inputs, equal match — untrue,
   * and would hide the error behind a playable-looking board.
   */
  static open(config: MatchConfig): Runtime {
    const { world, seed, actors } = config;

    if (typeof seed !== 'string' || seed.length === 0) {
      throw new Error('MatchConfig.seed must be a non-empty string; seed is injected, never ambient (ADR 0040).');
    }
    if (!Array.isArray(actors) || actors.length !== 2) {
      throw new Error(
        `A duel seats exactly two actors; got ${Array.isArray(actors) ? actors.length : 'none'} ` +
          '(ADR 0042 — the match is 1v1 and ends at a capital fall).',
      );
    }
    if (new Set(actors).size !== actors.length) {
      throw new Error('MatchConfig.actors must be unique.');
    }

    // Fail-closed. `loadWorld` throws `WorldLoadError` listing every finding.
    const loadedWorld = loadWorld(world);
    const rng = createRng(seed);
    const partition = drawPartition(loadedWorld, rng);

    const realms: Record<ActorId, Realm> = {};
    actors.forEach((actor, side) => {
      realms[actor] = {
        actor,
        regions: partition.regions[side]!,
        sectors: [...partition.sectors[side]!],
      };
    });

    const state: MatchState = {
      world: { worldId: loadedWorld.artifact.worldId, revision: loadedWorld.artifact.revision },
      loadedWorld,
      seed,
      rng,
      actors: [...actors],
      realms,
      partitionCandidates: partition.candidateCount,
      phase: 'capital-selection',
      capitals: {},
      turn: 1,
      currentActor: actors[0]!,
    };

    return new Runtime(state, config.clock ?? NO_CLOCK);
  }

  /** Whose move the Runtime is currently accepting. See `MatchState.currentActor`. */
  get currentActor(): ActorId {
    return this.#state.currentActor;
  }

  /** The viewer-safe projection. Blurred here, once. */
  view(viewerId: ViewerId): MatchView {
    if (viewerId !== 'observer' && !this.#state.actors.includes(viewerId)) {
      throw new Error(`Unknown viewer "${viewerId}".`);
    }
    return project(this.#state, viewerId);
  }

  /**
   * Validate -> resolve -> advance, returning what happened.
   *
   * An invalid intent is rejected **without a state transition** and with a
   * reportable reason (gate 02 § 6, SPEC US16) — it returns a rejection event
   * rather than throwing, so a caller (including a bot) is told why in the same
   * shape a success arrives in.
   */
  submit(intent: Intent): GameEvent[] {
    if (!intent || typeof intent.kind !== 'string' || intent.kind.length === 0) {
      return [this.#reject(intent, 'An intent must carry a non-empty kind.')];
    }
    if (!this.#state.actors.includes(intent.actor)) {
      return [this.#reject(intent, `"${String(intent.actor)}" is not an actor in this match.`)];
    }

    if (intent.kind === 'choose-capital') {
      return this.#chooseCapital(intent.actor, (intent as { sector?: SectorId }).sector);
    }

    return [
      this.#reject(intent, `No resolution is wired for intent kind "${intent.kind}" yet.`),
    ];
  }

  /**
   * The sealed opening beat: both players pick a capital simultaneously and in
   * secret, and both sites go public together (CP-② D1.3, item 1).
   *
   * Note the legality rule this phase needs: **"has this realm locked yet"**, not
   * "is it this realm's turn". Both actors are legal callers at the same moment,
   * which is what a simultaneous beat means — and it is why the phase does not
   * consult `currentActor`. Ticket 03 owns whether the *turn* loop reads legality
   * the same way (`DECISIONS-OWED.md` § 1.3).
   */
  #chooseCapital(actor: ActorId, sector: SectorId | undefined): GameEvent[] {
    const state = this.#state;
    const intent = { kind: 'choose-capital', actor };

    // One rule, shared with `preview` (see domain/capital-choice.ts), so the two
    // cannot drift into telling the player different things.
    const refusal = capitalChoiceRefusal(
      {
        inSelectionPhase: state.phase === 'capital-selection',
        alreadyLocked: actor in state.capitals,
        ownedSectors: state.realms[actor]!.sectors,
      },
      actor,
      sector,
    );
    if (refusal !== null) return [this.#reject(intent, refusal)];

    state.capitals[actor] = sector!;

    const events: GameEvent[] = [
      {
        type: 'capital-locked',
        turn: state.turn,
        // The *fact* of locking is public; the site is not, until the reveal.
        detail: { actor },
      },
    ];

    if (state.actors.every((a) => a in state.capitals)) {
      state.phase = 'in-play';
      events.push({
        type: 'capitals-revealed',
        turn: state.turn,
        detail: { capitals: { ...state.capitals } },
      });
    }

    return events;
  }

  #reject(intent: { kind?: string; actor?: ActorId } | null | undefined, reason: string): GameEvent {
    return {
      type: 'intent-rejected',
      turn: this.#state.turn,
      detail: { reason, kind: intent?.kind ?? '<none>', actor: intent?.actor ?? '<none>' },
    };
  }

  /**
   * Reads the injected clock. Present so the shell has a legitimate way to
   * timestamp, and so the absence of one is loud rather than silent — no rule
   * may call this.
   */
  protected now(): number {
    return this.#clock.now();
  }
}
