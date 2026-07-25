/**
 * The Runtime's caller-facing types.
 *
 * Authority: Wayfinder gate 02 § 6 ("Consequent interface"). That section seals
 * the *surface*; it says outright that naming of the interface types is
 * provisional and that no domain term is sealed there. So nothing in this file
 * defines a game rule — the rules arrive with their own tickets, against their
 * own contracts.
 */

import type { RegionId, SectorId, WorldArtifact } from '../world/schema.js';

export type { RegionId, SectorId } from '../world/schema.js';

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
 * Where the match stands in its own arc.
 *
 * `capital-selection` is the sealed opening beat: both players choose a capital
 * simultaneously and in secret, and both locations become public together
 * (capital CP-② D1.3 and item 1). `in-play` begins once both are locked.
 *
 * This is **not** the turn structure. The commit-and-reveal turn loop, its three
 * tiers, and how legality reads once both realms commit at once are ticket 03's,
 * against its own contract.
 */
export type MatchPhase = 'capital-selection' | 'in-play';

/**
 * An instruction submitted to the Runtime. Every intent names its actor, so the
 * Runtime can judge legality without trusting the caller.
 */
export type Intent = ChooseCapitalIntent | { readonly kind: string; readonly actor: ActorId };

/**
 * The opening beat's intent: the player clicks a sector they own.
 *
 * Eligibility is **ownership** (ruling R3, SEALED 2026-07-25): any sector the
 * realm holds at match start is a legal site. The authored `capitals` / `cities`
 * markers are advisory map content and do not gate this.
 */
export interface ChooseCapitalIntent {
  readonly kind: 'choose-capital';
  readonly actor: ActorId;
  readonly sector: SectorId;
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

/** What one side holds. Territory is public — fog governs forces, not borders. */
export interface RealmView {
  readonly actor: ActorId;
  readonly regions: readonly RegionId[];
  readonly sectors: readonly SectorId[];
  readonly population: number;
  readonly economy: number;
}

/**
 * What a viewer is handed. This is the **single blur seam**: truth is blurred
 * here, once, and what is not in this object is not knowable downstream
 * (gate 02 § 4-6).
 *
 * Two invariants are tested rather than merely intended: the seed never appears
 * here, and an opponent's capital does not appear before the sealed simultaneous
 * reveal.
 */
export interface MatchView {
  readonly world: WorldIdentity;
  readonly viewer: ViewerId;
  readonly turn: number;
  readonly phase: MatchPhase;
  readonly currentActor: ActorId;
  /** Every actor in the match. Identity is public; hidden holdings are not here. */
  readonly actors: readonly ActorId[];
  /**
   * The authored world, verbatim and frozen.
   *
   * Geography is public by seal — the information ladder puts terrain, regions,
   * and routes in the open, and hides forces and intent instead. Passing the
   * frozen artifact by reference rather than copying it is safe for exactly that
   * reason: it contains no truth to blur.
   */
  readonly board: WorldArtifact;
  readonly realms: readonly RealmView[];
  /**
   * Capital locations, as far as this viewer may know them.
   *
   * During `capital-selection` a viewer sees only their own choice; once both
   * are locked, both are public to everyone and stay so (CP-② item 1).
   */
  readonly capitals: Readonly<Record<ActorId, SectorId>>;
  /**
   * Which realms have locked a capital. **Public to every viewer** (ruling R7,
   * SEALED 2026-07-25): the fact of commitment crosses, the site does not.
   * Watching an opponent deliberate is part of the contest, and both sides
   * committing is what advances the beat.
   */
  readonly capitalLocked: readonly ActorId[];
}

/** Everything the Runtime needs to open a match. Seed and clock are injected. */
export interface MatchConfig {
  /** The authored world artifact. Validated on load; a bad world yields no match. */
  readonly world: WorldArtifact;
  readonly seed: string;
  readonly actors: readonly ActorId[];
  /** Injected per ADR 0040. Rules never read the wall clock; only the shell may. */
  readonly clock?: Clock;
}

/** Injected time. ADR 0040 bars rules from reading `Date.now()`. */
export interface Clock {
  now(): number;
}
