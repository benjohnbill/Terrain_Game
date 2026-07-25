/**
 * The Runtime's caller-facing types.
 *
 * Authority: Wayfinder gate 02 § 6 ("Consequent interface"). That section seals
 * the *surface*; it says outright that naming of the interface types is
 * provisional and that no domain term is sealed there. So nothing in this file
 * defines a game rule — the rules arrive with their own tickets, against their
 * own contracts.
 */

/** A party that can act in a match. In a 1v1 duel there are exactly two. */
export type ActorId = string;

/**
 * Who a projection is being built for. An actor sees their own realm's view;
 * the neutral observer exists for tooling and tests, never for play.
 *
 * What each viewer may *know* is gate 03's contract, not this file's — this is
 * only the address the projection is built to.
 */
export type ViewerId = ActorId | 'observer';

/** Immutable identity of the authored world a match is played on (gate 06 D2). */
export interface WorldIdentity {
  readonly worldId: string;
  readonly revision: string;
}

/**
 * An instruction submitted to the Runtime. Ticket 01 carries only the envelope:
 * every intent names its actor, so the Runtime can judge legality without
 * trusting the caller. The intent *kinds* belong to the tickets that build them.
 */
export interface Intent {
  readonly kind: string;
  readonly actor: ActorId;
}

/** Something the Runtime did. Returned by `submit`; never pushed. */
export interface GameEvent {
  readonly type: string;
  readonly turn: number;
  readonly detail?: Readonly<Record<string, unknown>>;
}

/**
 * A rejected intent produces an event carrying a reportable reason and **no**
 * state transition (gate 02 § 6, SPEC US16).
 */
export interface RejectedEvent extends GameEvent {
  readonly type: 'intent-rejected';
  readonly detail: {
    readonly reason: string;
    readonly kind: string;
    readonly actor: ActorId;
  };
}

/**
 * What a viewer is handed. This is the **single blur seam**: truth is blurred
 * here, once, and what is not in this object is not knowable downstream
 * (gate 02 § 4-6).
 *
 * The invariant that matters and is tested: the seed never appears here.
 * A projection that leaked it would make every later fog contract unenforceable.
 */
export interface MatchView {
  readonly world: WorldIdentity;
  readonly viewer: ViewerId;
  readonly turn: number;
  readonly currentActor: ActorId;
  /** Every actor in the match. Identity is public; holdings are not, and are not here. */
  readonly actors: readonly ActorId[];
}

/** Everything the Runtime needs to open a match. Seed and clock are injected. */
export interface MatchConfig {
  readonly world: WorldIdentity;
  readonly seed: string;
  readonly actors: readonly ActorId[];
  /** Injected per ADR 0040. Rules never read the wall clock; only the shell may. */
  readonly clock?: Clock;
}

/** Injected time. ADR 0040 bars rules from reading `Date.now()`. */
export interface Clock {
  now(): number;
}
