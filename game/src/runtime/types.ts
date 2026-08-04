/**
 * The Runtime's caller-facing types.
 *
 * Authority: **ADR 0049** for what may cross the boundary, and Wayfinder gate 02
 * § 6 ("Consequent interface") for the concrete surface — a clause ADR 0049
 * deliberately left to implementation, so it is still cited at the gate that
 * sealed it. That section says outright that naming of the interface types is
 * provisional and that no domain term is sealed there. So nothing in this file
 * defines a game rule — the rules arrive with their own tickets, against their
 * own contracts.
 */

import type { HexPosition, RegionId, SectorId, WorldArtifact } from '../world/schema.js';
import type { RecruitmentRequest } from '../domain/recruitment.js';
import type { ReconnaissanceRequest } from '../domain/intel.js';
import type { ObservationGrade, PaidGrade } from '../domain/testimony.js';

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
 * (ADR 0049 § Decision 7), and pacing belongs to the UI — so a resting `payoff` phase would
 * mean the caller had to submit something to leave it, which is precisely the
 * extra click D6.2 forbids. The tiers are named on every event instead; see
 * `TurnTier`.
 *
 * `match-ended` (ticket 07) belongs here **by that same test rather than as an
 * exception**: the match rests there, permanently, and no submission moves it. It is
 * the one resting state with no exit — a new match is a new `Runtime`, not a
 * transition out of this one, which is what makes "the end is final" (ADR 0042) a
 * property of the type rather than a promise in a comment.
 */
export type MatchPhase = 'capital-selection' | 'decision' | 'match-ended';

/**
 * How the match ended — **ADR 0042**, the sole win condition, as a value.
 *
 * Present only in the terminal phase, and `null` before it. Every field is a fact
 * the players already watched cross `submit()`: who won, who lost, and the ground
 * whose fall stopped play. There is no score, no margin and no tiebreak, because
 * nothing else names a winner (ledger D3.1).
 */
export interface MatchOutcome {
  readonly winner: ActorId;
  readonly loser: ActorId;
  /** The capital sector whose capture ended the match. */
  readonly capital: SectorId;
  /** The turn it fell on. A record of one, never a limit on one (ticket 07 item 7). */
  readonly turn: number;
}

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
  | AllocateReconnaissanceIntent
  | MoveDetachmentIntent
  | SplitDetachmentIntent
  | MergeDetachmentsIntent
  | TransferToGarrisonIntent
  | TransferToFieldIntent
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
 * Buy a look at one sector, at one grade — fog `MAGNITUDE.md` FG-M①.
 *
 * **Not an action with a fixed cost** (`DECISIONS-OWED.md` R2, 2026-07-25):
 * each grade carries a per-sector unit price, the player pours from the single
 * 행동력 stack, and what they pour converts linearly into how many sectors they
 * scout. One target per intent; re-submitting the same sector replaces its grade
 * and returns the retired grade's chips, exactly as a sector allocation does —
 * reviewing and re-cutting a plan before locking costs nothing.
 *
 * Naming the grade rather than the chips is what makes the ladder legible: six
 * chips is three normal looks or one enhanced one, and M8's saturation rule is
 * what stops the first from dominating the second (FG-M① § Reconnaissance unit
 * prices).
 */
export interface AllocateReconnaissanceIntent {
  readonly kind: 'allocate-reconnaissance';
  readonly actor: ActorId;
  /** Any sector this realm does not hold. */
  readonly sector: SectorId;
  /** The grade to buy, or `null` to call the look off and take the chips back. */
  readonly grade: PaidGrade | null;
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

/**
 * Move ready field men into the shield of the sector they stand on (R18 ii).
 *
 * Priced by movement alone — turns and fatigue, never 행동력 — so the legality rule
 * is that the detachment is already there.
 */
export interface TransferToGarrisonIntent {
  readonly kind: 'transfer-to-garrison';
  readonly actor: ActorId;
  readonly detachmentId: string;
  readonly men: number;
}

/** Take ready shield men back into the field at their own sector (R18 ii). */
export interface TransferToFieldIntent {
  readonly kind: 'transfer-to-field';
  readonly actor: ActorId;
  readonly sector: SectorId;
  readonly men: number;
}

/** Something the Runtime did. Returned by `submit`; never pushed. */
export interface GameEvent {
  readonly type: string;
  readonly turn: number;
  readonly detail?: Readonly<Record<string, unknown>>;
}

/**
 * A rejected intent produces an event carrying a reportable reason and **no**
 * state transition (gate 02 § 6 — a clause ADR 0049 did not take; SPEC US16).
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
  /**
   * 징집 명부's land-derived pool — `registerPerPop × Σ populationValue` over
   * **controlled** sectors, public for both realms (gate 03 § 2).
   *
   * Public because it is arithmetic over public land, and it is fog RULING ①
   * reaching its second subject: land and the people on it are the visible
   * structure, and how many of them a realm moved into service is the manning
   * that the estimate band covers. It is what the 동원 강도 and civilian-register
   * reads are taken **against** — each is a public denominator combined with a
   * banded numerator, which is what gives both zero new dials.
   *
   * Keyed on control rather than on holdings, unlike the four figures above:
   * this counts the bodies a stretch of land can raise, not what that land pays,
   * so limbo does not suspend it.
   */
  readonly registerPool: number;
}

/**
 * A true-containing range. Every band a viewer reads is one of these, and none
 * of them was computed from the value it brackets (fog `RULINGS.md` ③
 * decision 1).
 */
export interface BandView {
  readonly low: number;
  readonly high: number;
}

/**
 * One stored statement, as the player may read it back.
 *
 * ③ decision 4 shows the history rather than only its summary: the trend read —
 * "it was this, now it is that" — is the capability the witness model adds and
 * the model it replaced could not express at all. The **surface** is deferred
 * (`docs/SYNC-DEBT.md`); this is the material it will be built from, summoned on
 * designation rather than always painted.
 */
export interface TestimonyReadView {
  readonly turn: number;
  readonly grade: ObservationGrade;
  readonly low: number;
  readonly high: number;
}

/**
 * One **contact** — a run of turns in which this viewer watched one enemy force
 * without a gap (fog `RULINGS.md` ④ decisions 3 and 4).
 *
 * Published as a member of a dated list and **never summed with another**: two
 * contacts may be the same force, so a total would be the Runtime asserting
 * something it cannot know. That refusal is visible rather than silent, which is
 * ④ decision 6's whole shape.
 */
export interface ForceContactView {
  readonly contactId: string;
  /** Whose force. That a force is somebody's is public the moment it is seen. */
  readonly actor: ActorId;
  readonly lastSeenAt: HexPosition;
  readonly lastSeenSector: SectorId;
  readonly lastSeenTurn: number;
  readonly openedOnTurn: number;
  /**
   * Where it could be now — the last-seen fix widened by what could have happened
   * since, in sectors. Exactly the sector it stands on while the contact is
   * current, and growing with staleness thereafter, until the reading belongs to
   * no sector at all (④ decision 5).
   */
  readonly reach: readonly SectorId[];
  readonly substance: BandView;
  readonly fatigue: BandView;
  /** Observed this turn — ④ decision 3's unbroken contact, as a fact to render. */
  readonly current: boolean;
  /**
   * Whether this contact can still accumulate. A closed one is a dated record of
   * an aggregate that has since divided or consolidated: still true, no longer
   * about anything standing on the board.
   */
  readonly closed: boolean;
  readonly substanceHistory: readonly TestimonyReadView[];
}

/**
 * What this viewer knows about one sector it does not hold.
 *
 * Every opposing sector appears, observed or not — a list carrying only the
 * scouted ones would make its own length a signal, and the unobserved band is a
 * real reading rather than an absence: bounded by public facts alone, never by
 * the truth (gate 03 invariant 5).
 */
export interface SectorIntelView {
  readonly sectorId: SectorId;
  readonly owner: ActorId;
  /** The shield manning it. Sector-attached: a garrison cannot march out (④ 1). */
  readonly garrison: BandView;
  /** Bodies of this sector's register under arms anywhere. */
  readonly serving: BandView;
  /** The public denominator both derived reads are taken against. */
  readonly registerPool: number;
  /** 동원 강도 — serving ÷ pool. Derived, zero new dials (gate 03 § 2). */
  readonly mobilization: BandView;
  /** Civilian register — pool − serving. Derived, and reversed on the same band. */
  readonly civilianRegister: BandView;
  /** The turn of the most recent statement about this ground, or `null`. */
  readonly observedTurn: number | null;
  readonly garrisonHistory: readonly TestimonyReadView[];
}

/**
 * A free existence-and-heading warning, inside the viewer's own ring.
 *
 * Categorical by seal (gate 03 § 4): an enemy force standing on ground this realm
 * controls announces *that* it is there and which way it is going. It carries no
 * magnitude, no fatigue, no posture and no identity, and buying a reading of it
 * is a separate purchase — which is what keeps the free floor from closing the
 * information market.
 */
export interface BorderAlarmView {
  readonly sectorId: SectorId;
  readonly actor: ActorId;
  /**
   * The ground it crossed from, or `null` when it was already standing here.
   *
   * The heading of a force that has **arrived**, which is what an alarm can
   * honestly carry. Where it intends to go next is a hole card, and reading that
   * off a pending movement order would hand the defender the attacker's plan
   * during the blind beat — so this is captured when the turn resolves.
   */
  readonly from: SectorId | null;
}

/**
 * The census, laid out as evidence rather than delivered as a verdict (④ 6).
 *
 * The sector side is aggregated because sector testimonies cannot overlap. The
 * force side is not, and the absence of a total here is the point: under ④
 * decision 4 the Runtime cannot honestly add two contacts together, so it refuses
 * visibly. There is no `unaccounted` figure and none is derivable — what the
 * player does with the contrast is a gap read, not arithmetic.
 */
export interface CoverageView {
  /** Opposing sectors carrying any testimony at all. */
  readonly sectorsObserved: number;
  readonly sectorsTotal: number;
  /** The turn of the oldest statement inside `sectorsObserved`, or `null`. */
  readonly oldestObservedTurn: number | null;
  /** Σ of the sector-attached serving bands — the one side that may be summed. */
  readonly serving: BandView;
  /** The public pool that sum is read against. */
  readonly registerPool: number;
}

/** Everything this viewer has learned about the other realm. */
export interface IntelligenceView {
  readonly sectors: readonly SectorIntelView[];
  /** Dated, never totalled. See `ForceContactView`. */
  readonly contacts: readonly ForceContactView[];
  readonly coverage: CoverageView;
  readonly alarms: readonly BorderAlarmView[];
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
  /**
   * Total draftable bodies — a stock that death shrinks and that transfer moves
   * (MT-②, as ADR 0044 re-based it: land loss is no longer weightless).
   */
  readonly register: number;
  /** Men under arms: field plus manned shields. */
  readonly serving: number;
  /** 동원 강도 — serving ÷ register, the axis recruitment is priced along. */
  readonly mobilization: number;
  /**
   * Exact body accounting per **sector** — the grain the register is stored at
   * (MT-② amended 2026-07-31) and the grain origin composition joins it on.
   *
   * Not the same key set as `RealmView.sectors`: a realm keeps the register share
   * still standing in its own ranks at a sector it has lost, because what a capture
   * moves is the *civilians*.
   */
  readonly sectors: Readonly<Record<SectorId, SectorForcesView>>;
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

/**
 * Exact body conservation for one sector origin: `register = serving + civilians`.
 *
 * The identity is the whole point of the row — it is what makes the three register
 * laws checkable at a glance. Casualties shrink `register` and `serving` together;
 * leaving service moves men from `serving` to `availableCivilians` and leaves
 * `register` alone; a capture moves `availableCivilians` between realms.
 */
export interface SectorForcesView {
  readonly register: number;
  readonly serving: number;
  readonly availableCivilians: number;
}

/**
 * What a viewer is handed. This is the **single projection boundary**: viewer
 * policy is applied here, once, and what is not in this object is not knowable
 * downstream (ADR 0049 §§ Decisions 2-3). Not a blur — under ADR 0048 the true
 * value does not enter the projection function at all.
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
  /**
   * How the match ended, or `null` while it runs.
   *
   * Public to every viewer including the observer, and blurred by nothing: a capital
   * falling is the map changing, which the sealed information ladder keeps in the
   * open, and a match whose end one side could not read would not be an end.
   */
  readonly outcome: MatchOutcome | null;
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
  /** This viewer's own reconnaissance purchases for the current turn. */
  readonly reconnaissanceOrders: readonly ReconnaissanceRequest[];
  /**
   * Everything this viewer has learned about the other realm — Standard Fog.
   *
   * Composed from stored testimony and from bounds computable off public facts.
   * **No true value reaches it**, which is why it is a member of the projection
   * rather than something a surface derives: the composition happens once, here,
   * where nothing downstream can reach around it.
   */
  readonly intelligence: IntelligenceView;
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
