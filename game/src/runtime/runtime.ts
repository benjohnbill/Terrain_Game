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
 * (callers pump; `submit` returns the events — push delivery would add
 * lifecycle complexity for no gain in a turn-based game).
 *
 * Gate 02 also fixes that internal decomposition is an internal seam: this may
 * implement transitions as pure functions behind the shell, and that stays an
 * implementation choice rather than a caller contract.
 */

import type { MatchState } from '../domain/state.js';
import { project } from '../projection/project.js';
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
   * Opens a match. Rejects rather than repairs: a bad config is a caller bug,
   * and a Runtime that quietly substituted a default would make the seed
   * contract — equal inputs, equal match — untrue.
   */
  static open(config: MatchConfig): Runtime {
    const { world, seed, actors } = config;

    if (!world?.worldId || !world.revision) {
      throw new Error('MatchConfig.world requires both worldId and revision (gate 06 D2).');
    }
    if (typeof seed !== 'string' || seed.length === 0) {
      throw new Error('MatchConfig.seed must be a non-empty string; seed is injected, never ambient (ADR 0040).');
    }
    if (!Array.isArray(actors) || actors.length === 0) {
      throw new Error('MatchConfig.actors must name at least one actor.');
    }
    if (new Set(actors).size !== actors.length) {
      throw new Error('MatchConfig.actors must be unique.');
    }

    const first = actors[0] as ActorId;
    const state: MatchState = {
      world: { worldId: world.worldId, revision: world.revision },
      seed,
      rng: createRng(seed),
      actors: [...actors],
      turn: 1,
      currentActor: first,
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
   *
   * Ticket 01 wires the door and its guards. The intent kinds that pass through
   * it, and the resolution behind them, belong to the tickets that build them —
   * so an intent that clears the guards is still rejected here, by name, rather
   * than silently doing nothing.
   */
  submit(intent: Intent): GameEvent[] {
    const rejection = this.#validate(intent);
    if (rejection) return [rejection];

    return [
      {
        type: 'intent-rejected',
        turn: this.#state.turn,
        detail: {
          reason: `No resolution is wired for intent kind "${intent.kind}" yet.`,
          kind: intent.kind,
          actor: intent.actor,
        },
      },
    ];
  }

  /** Returns a rejection event, or `null` when the intent may proceed. */
  #validate(intent: Intent): GameEvent | null {
    const reject = (reason: string): GameEvent => ({
      type: 'intent-rejected',
      turn: this.#state.turn,
      detail: { reason, kind: intent?.kind ?? '<none>', actor: intent?.actor ?? '<none>' },
    });

    if (!intent || typeof intent.kind !== 'string' || intent.kind.length === 0) {
      return reject('An intent must carry a non-empty kind.');
    }
    if (!this.#state.actors.includes(intent.actor)) {
      return reject(`"${String(intent.actor)}" is not an actor in this match.`);
    }
    if (intent.actor !== this.#state.currentActor) {
      // Gate 02's guarantee is that the *Runtime*, not the caller, decides what
      // is legal now. How "now" is expressed once both realms commit at once is
      // ticket 03's to settle (DECISIONS-OWED § 1.3).
      return reject(`It is not "${intent.actor}"'s turn; the Runtime is accepting "${this.#state.currentActor}".`);
    }
    return null;
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
