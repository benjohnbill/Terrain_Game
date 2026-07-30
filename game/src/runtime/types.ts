/**
 * The Runtime's caller-facing types.
 *
 * Authority: Wayfinder gate 02 § 6 ("Consequent interface"). That section seals
 * the *surface*; it says outright that naming of the interface types is
 * provisional and that no domain term is sealed there. So nothing in this file
 * defines a game rule — the rules arrive with their own tickets, against their
 * own contracts.
 */

import type { HexPosition, RegionId, SectorId, WorldArtifact } from '../world/schema.js';
import type { RecruitmentRequest } from '../domain/recruitment.js';

export type { HexPosition, RegionId, SectorId } from '../world/schema.js';

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
 * Where the match stands in its own arc — and therefore what may be submitted.
 *
 * `capital-selection` is the sealed opening beat: both players choose a capital
 * simultaneously and in secret, and both locations become public together
 * (capital CP-② D1.3 and item 1). `decision` is the turn loop's sole agency tier,
 * and the match rests there between turns.
 *
 * **Only resting states appear here.** The payoff and background tiers are stages
 * *inside* a resolution: they take no input (D6.2), the Runtime never sleeps
 * (gate 02 § 4), and pacing belongs to the UI — so a resting `payoff` phase would
 * mean the caller had to submit something to leave it, which is precisely the
 * extra click D6.2 forbids. The tiers are named on every event instead; see
 * `TurnTier`.
 */
export type MatchPhase = 'capital-selection' | 'decision';

/**
 * The three tiers of a turn (ledger D6.2). Carried on every turn-loop event, so a
 * display can pace the payoff without the Runtime resting inside it.
 *
 * The ledger's circled numbers (①②④⑤, with no ③ anywhere) are deliberately absent:
 * the tiers are the substance and the numbering was vestigial (user ruling
 * 2026-07-25).
 */
export type TurnTier = 'decision' | 'payoff' | 'background';

/**
 * A contested border between the two realms — the surface the duel is fought on.
 *
 * `sectors` is sorted by sector id and `owners` is aligned to it, so a front is
 * described identically from either side. All of it is public: territory is public
 * by seal, and fog governs forces and intent rather than borders.
 */
export interface Front {
  /** The canonical edge name, `min|max` (gate 06 D4). */
  readonly key: string;
  readonly sectors: readonly [SectorId, SectorId];
  readonly owners: readonly [ActorId, ActorId];
}

/**
 * The viewer's own 행동력 stack this turn (ledger D6.3).
 *
 * One stack, regenerated to the same size every turn, non-hoardable, and the
 * single currency for every order kind. `allocations` is the viewer's **own** —
 * the opponent's is hidden until the reveal, which is what makes the commit blind.
 */
export interface CommitmentView {
  readonly budget: number;
  /** Sector id -> chips (plus order keys), for this viewer's realm only. */
  readonly allocations: Readonly<Record<string, number>>;
  /** Sector id -> own field detachments explicitly committed there. */
  readonly assignments: Readonly<Record<string, readonly string[]>>;
  readonly spent: number;
  readonly remaining: number;
}

/**
 * An instruction submitted to the Runtime. Every intent names its actor, so the
 * Runtime can judge legality without trusting the caller.
 */
export type Intent =
  | ChooseCapitalIntent
  | AllocateCommitmentIntent
  | AllocateOrderIntent
  | AllocateRecruitmentIntent
  | MoveDetachmentIntent
  | SplitDetachmentIntent
  | MergeDetachmentsIntent
  | LockCommitmentIntent
  | { readonly kind: string; readonly actor: ActorId };

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

/**
 * Pour part of this turn's stack onto one **sector** (ADR 0046 item 4).
 *
 * Replaces that sector's share rather than adding to it, so reviewing and
 * re-cutting a plan before locking costs nothing — the decision tier is where every
 * judgment the turn asks for lives, and a rule that made revision expensive would
 * move that judgment into the click.
 *
 * This named a **front** until ticket 06e. The rename is a contract change and not
 * a spelling: commit is the share allotted to one confrontation, confrontations are
 * atomic per sector, and an interior sector had no key at all under the old surface.
 */
export interface AllocateCommitmentIntent {
  readonly kind: 'allocate-commitment';
  readonly actor: ActorId;
  /** A sector id from `MatchView.board.sectors`. */
  readonly sector: SectorId;
  /** Whole, non-negative chips. Zero clears the sector. */
  readonly chips: number;
  /** Own detachments whose planned turn endpoint supplies field substance. */
  readonly detachmentIds?: readonly string[];
}

/** Retired scalar order shape, retained so legacy callers receive a reportable refusal. */
export interface AllocateOrderIntent {
  readonly kind: 'allocate-order';
  readonly actor: ActorId;
  /** The legacy order kind supplied by the caller. */
  readonly order: string;
  /** Whole, non-negative chips. Zero clears the order. */
  readonly chips: number;
}

/** Pour part of the shared stack into one sector-sited recruitment request. */
export interface AllocateRecruitmentIntent extends RecruitmentRequest {
  readonly kind: 'allocate-recruitment';
  readonly actor: ActorId;
}

/**
 * Lock this turn's allocation — blind and binding (ledger D6.1).
 *
 * When the second realm locks, the turn reveals, resolves, and opens turn N+1 in
 * that same call. No third submission exists in between.
 */
export interface LockCommitmentIntent {
  readonly kind: 'lock-commitment';
  readonly actor: ActorId;
}

/** Destination-grain field movement; pathing remains Runtime-owned. */
export interface MoveDetachmentIntent {
  readonly kind: 'move-detachment';
  readonly actor: ActorId;
  readonly detachmentId: string;
  readonly destinationHex: HexPosition;
  readonly forcedMarch: boolean;
}

/** Free division of one positioned detachment. */
export interface SplitDetachmentIntent {
  readonly kind: 'split-detachment';
  readonly actor: ActorId;
  readonly detachmentId: string;
  readonly men: number;
}

/** Free consolidation of co-located own detachments. */
export interface MergeDetachmentsIntent {
  readonly kind: 'merge-detachments';
  readonly actor: ActorId;
  readonly detachmentIds: readonly string[];
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
 * What one side holds. Territory is public — fog governs forces, not borders.
 *
 * The land-derived figures here are public for both realms on purpose: they are
 * arithmetic over the board and the territory, and both of those are public by
 * seal. Hiding a number anyone can recompute would only mislead the player about
 * what is secret. What stays secret is the *stocks* — see `EconomyView`.
 */
export interface RealmView {
  readonly actor: ActorId;
  readonly regions: readonly RegionId[];
  /** Every sector under this realm's **control** — what the map is coloured by. */
  readonly sectors: readonly SectorId[];

  // ── control scope: what the realm holds on the map ────────────────────────
  /** Σ populationValue over controlled sectors. */
  readonly population: number;
  /** Σ economyValue over controlled sectors. */
  readonly economy: number;

  // ── holdings scope: what actually pays (OG-③) ─────────────────────────────
  // Control and holdings are the same set until the first capture and can
  // diverge from that moment on: occupied ground is controlled but pays nobody.
  // Reading a control figure as an economic one is the mistake this split names.
  /** Population plus economy over **holdings** — value as OG-② reads it. */
  readonly landValue: number;
  /** Yield per turn from **holdings**. Occupied land pays nobody. */
  readonly yield: number;
  /** The land-derived ceiling on the field army, over **holdings** (M14). */
  readonly forceLimit: number;
}

/**
 * A realm's own stocks — **its own only**.
 *
 * Gate 03 puts a realm's own realm at Exact: there is no fog on oneself, and a
 * player who could not read their own treasury could not price the order they are
 * being asked to give. The opponent's side of this object simply is not built,
 * which is what "publishes no treasury figure" means — not that the number is
 * rounded or banded, but that it never crosses.
 *
 * Banding the opponent's mobilization is the M10 standing rule and arrives with
 * ticket 08's fog; until then the honest projection is silence.
 */
export interface EconomyView {
  readonly actor: ActorId;
  readonly treasury: number;
  /** Income this realm will collect at the end of the turn. */
  readonly income: number;
  readonly forceLimit: number;
  readonly field: number;
  readonly garrison: number;
  /** Total draftable bodies — a stock only death shrinks (MT-②). */
  readonly register: number;
  /** Men under arms: field plus manned shields. */
  readonly serving: number;
  /** 동원 강도 — serving ÷ register, the axis recruitment is priced along. */
  readonly mobilization: number;
  readonly provinces: Readonly<Record<RegionId, ProvinceForcesView>>;
}

/** One own-side positioned field formation, projected exactly. */
export interface DetachmentView {
  readonly id: string;
  readonly position: HexPosition;
  readonly destination: HexPosition | null;
  readonly turnEndpoint: HexPosition;
  readonly turnsRemaining: number;
  readonly men: number;
  readonly readyMen: number;
  readonly pendingMen: number;
  readonly pendingReadyOnTurn: number | null;
  readonly fatigue: number;
  readonly pendingFatigue: number | null;
}

/** One own-side local shield, including separately visible pending substance. */
export interface GarrisonView {
  readonly sectorId: SectorId;
  readonly men: number;
  readonly readyMen: number;
  readonly pendingMen: number;
  readonly pendingReadyOnTurn: number | null;
}

/** One categorical report of an opposing realm's recruitment activity. */
export interface MobilizationSignalView {
  readonly actor: ActorId;
  readonly sectorId: SectorId;
  readonly observedTurn: number;
  readonly band: 'activity-detected';
}

/** Exact body conservation for one province origin. */
export interface ProvinceForcesView {
  readonly register: number;
  readonly serving: number;
  readonly availableCivilians: number;
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
  /**
   * Gate 02 § 6's sealed member, **read as the current phase** (ruling R8, SEALED
   * 2026-07-25).
   *
   * Gate 02 sealed `currentActor -> ActorId` a week before the pivot made turns
   * simultaneous, and a single current actor cannot express two realms committing
   * at once. R8 kept the member and re-read it: the question it answers — *what may
   * be submitted now?* — is answered by the phase, so this reports the phase and
   * never names an actor. Gate 02's actual guarantee, that the Runtime rather than
   * the caller decides legality, never depended on alternation and is untouched.
   *
   * It is deliberately the same value as `phase`, not a second source: keeping the
   * sealed name as an alias is what the ruling chose over renaming the member.
   */
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
   * Which realms have locked their commitment for the **current beat** — a capital
   * during `capital-selection`, this turn's orders during `decision`.
   *
   * **Public to every viewer** (ruling R7, SEALED 2026-07-25): the fact of
   * commitment crosses, its content does not. Watching an opponent deliberate is
   * part of the contest, and both sides having committed is what advances the beat.
   *
   * One field for both beats on purpose. R7 is "the general commit-and-reveal rule,
   * not a capital-beat special case", and every later commit inherits it — two
   * parallel fields would be the same rule implemented twice.
   */
  readonly committed: readonly ActorId[];
  /** The contested borders, in canonical order. Public — see `Front`. */
  readonly fronts: readonly Front[];
  /** This viewer's own stack. The opponent's is absent until the reveal. */
  readonly commitment: CommitmentView;
  /** This viewer's own one-turn recruitment plans, in canonical settlement order. */
  readonly recruitmentOrders: readonly RecruitmentRequest[];
  /** Opposing recruitment sources visible during this decision beat only. */
  readonly mobilizationSignals: readonly MobilizationSignalView[];
  /**
   * This viewer's own stocks, or `null` for the observer.
   *
   * The observer gets nothing deliberately: a tooling viewer that could read both
   * treasuries would be a side door around the blur seam, and tests would start
   * asserting through it.
   */
  readonly economy: EconomyView | null;
  /** Exact own-side operational substance. Empty for the observer. */
  readonly detachments: readonly DetachmentView[];
  /** Exact own-side local shields. Empty for the observer. */
  readonly garrisons: readonly GarrisonView[];
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
