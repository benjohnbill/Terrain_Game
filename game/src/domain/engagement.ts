/**
 * The engagement adapter — where the board's readings become the calculator's
 * arguments.
 *
 * `battle.ts` takes every value from its caller by design and imports nothing.
 * Something has to answer *which* values, for *which* sector, and that is this
 * module: it enumerates the engagements a resolved turn actually produced and
 * composes each one's `BattleInput`. It stays a **pure rule over plain values**
 * like `commitment.ts` and `economy.ts` — no `MatchState`, no board mutation —
 * so the Runtime assembles its arguments and the Runtime alone writes the
 * consequences.
 *
 * That shape was chosen over growing `readFronts`' inputs (ticket 03's stub) for
 * the reason `domain/state.ts` keeps single readers: a battle needs substance,
 * garrisons, wear, ground and fortification, and pouring all of that through the
 * turn loop's front reading would put board access inside the one function whose
 * whole value is that it has none.
 *
 * ## The unit of resolution is the SECTOR, not the front
 *
 * A front is an authored *edge* — the door between two regions — and resolution
 * is **atomic per sector** (ADR 0032; ADR 0046 item 1). The two are different
 * cardinalities, and that difference is what adjudicates ticket 03's enumerated
 * **case 4**: `r7_s0` is a real sector serving two different region borders, so
 * one realm can press it from two sides at once. The turn loop ruled those stay
 * two *fronts*; here they are one engagement, because a sector cannot be fought
 * over twice in a turn without the second reading state the first already
 * changed. Since ADR 0046 item 4 keyed commit on the sector, that merge needs no
 * reconciliation at all — there is one key, so there is one number.
 *
 * ## Where an engagement may be sited
 *
 * **Wherever a hostile force stands** (ADR 0046 item 1). The predicate is a
 * *sector* predicate — an invading force standing on ground its realm does not
 * hold — and nothing about an authored border enters it.
 *
 * Until 06e the candidate sites were seeded by walking the contested fronts, on
 * the stated grounds that only a border sector had a sealed defensive ground to
 * be fought over. Measured across all 15 legal partitions, that gate let **30 of
 * 30** realm-seats walk into enemy ground without standing on one fightable
 * sector, and left **41 of 45** authored capitals takeable with zero battles.
 * TC-⑮ supplies the missing ground and the gate comes off.
 *
 * ## Where the ground comes from
 *
 * Terrain-cradle **TC-⑮** (SEALED 2026-07-28/31, ADR 0046 item 2): **a sector's
 * defensive terrain is its own authored terrain, always.** It does not depend on
 * how the attacker arrived. The door contributes the **attacker-side** terms
 * only — the crossing multiplier — which mirrors the calculator's own split:
 * `defensePower(side, terrain, fortification)` is the ground the defender stands
 * on, `attackPower(side, crossing)` is what the attacker did to reach it.
 *
 * TC-⑮ **amends TC-⑬'s terrain column**; TC-⑬'s *crossing* column and its
 * reachable-weakest-link rule for choosing among doors are untouched. Every
 * multiplier lives at combat-formula **M5** and **ADR 0015** and is held by
 * `battle.ts`. This module carries the *bindings* and never a value.
 */

import {
  type BattleCrossing,
  type BattleFortification,
  type BattleInput,
  type BattleParticipant,
  type BattleTerrain,
  type DefenseMethod,
  type EscapeState,
} from './battle.js';
import { effectiveness } from './fatigue.js';
import type { ChokeClass, SectorId, TerrainLayer } from '../world/schema.js';
import type { ActorId } from '../runtime/types.js';

/**
 * Troop quality, uniform across both realms — **not a dial**.
 *
 * It is a consequence of two seals meeting. Slice-2 § 1 rider (b) ports the
 * quality *slot* at 1.0 and defers the technology system that would ever move it;
 * terrain-cradle **TC-⑭** then seals that every player-varyable quantity starts
 * uniform, and permits only inequality *derived from the authored map*. With no
 * tech system there is nothing to derive quality from, so a per-realm figure here
 * would be exactly the baked constant TC-⑭ forbids. The slot stays visible in the
 * product so that answering it later is a value change.
 */
export const UNIFORM_QUALITY = 1;

/**
 * Escape from a rout — open, in this slice, and **not a dial** either.
 *
 * M4 makes escape "a derived check at the moment of rout": OPEN iff an adjacent
 * non-water friendly route exists **and** the isolation gate is not satisfied.
 * Both halves are inert here, and neither is inert by choice:
 *
 * - **Nothing takes ground yet.** Ownership transfer is 06d's, so the drawn
 *   partition holds all match long and every realm's sector keeps its friendly
 *   neighbours. The route half cannot return BLOCKED.
 * - **Nothing cuts a route.** Interdiction and Encirclement are *plans*, and the
 *   plan layer is tickets 10/11. The isolation gate has no way to fire.
 *
 * So the derived check is constant in this slice, and writing it out would add a
 * mechanism with no behaviour — while the one case that *could* vary (a routed
 * attacker whose only way home is the water it crossed, M4's Salsu clause) would
 * need a reading of Encirclement's isolation gate that the ticket forbids
 * resolving by implication. Its consumers are 06d and 11.
 */
export const OPEN_ESCAPE: EscapeState = 'OPEN';

/**
 * The standing defence posture — Stronghold, per slice-2 § 8.
 *
 * § 8 models posture as *standing on a sector*, with changing it a turn action.
 * The action is an order, orders are the plan layer's, and the plan layer is
 * ticket 10 — so every sector stands at the sealed default. `battle.ts`
 * implements DELAYING beside it and its unit tests exercise it; what is missing
 * is the click, not the branch.
 */
export const STANDING_POSTURE: DefenseMethod = 'STRONGHOLD';

/**
 * **TC-⑬'s surviving column**, as a binding: a border class names the water an
 * attacker crosses to come through that door. Values are cited, never restated —
 * `battle.ts` holds ADR 0015's ladder.
 *
 * Two readings are worth stating rather than leaving to be re-derived:
 *
 * - **The dry classes contribute nothing.** `none` is `CROSSING_MULTIPLIER`'s
 *   identity, so naming it is how "this door is not a water obstacle" is written
 *   in a table that must name a crossing for every row.
 * - **The water is always the *opposed* variant.** A door is a battle's door only
 *   where the defender holds the far bank, so the uncontested rungs have no
 *   referent here. TC-⑬ names exactly these two.
 *
 * **What TC-⑬ pairs with `pass` and this does not implement:** the ruling states
 * that the door also *throttles the assaulting body* — the frontage half. TC-⑮
 * moved that whole question to the operational-manoeuvre pass rather than
 * abolishing it (`.scratch/operational-manoeuvre/`), and its stated justification
 * weakened in the move: the "×2.0 only as the residual AFTER a cap" argument
 * concerned a `pass` **terrain** value TC-⑮ stops using. `Edge.frontageHexes` and
 * `Choke.cap` remain authored and read by nothing, and neither is the cap — see
 * that tracker's seam register.
 */
const DOOR_CROSSING: Readonly<Record<ChokeClass, BattleCrossing>> = {
  open: 'none',
  forest: 'none',
  hills: 'none',
  pass: 'none',
  river: 'riverOpposed',
  strait: 'straitOpposed',
};

/**
 * **TC-⑮'s table**, as a binding: an authored `terrainLayer` names the M5 rung the
 * ground defends at. Values are cited, never restated — `battle.ts` holds M5's
 * ladder, and TC-⑮ holds each row's derivation.
 *
 * Six of the seven layers derive with no new value; `mountain` matches a sealed
 * rung by name — M5's `Mountains`, in the ladder since 2026-07-03 and never used
 * before, because nothing read a sector's terrain.
 *
 * The row that is a trap: **`river-valley` is `plains`, not the `river` border
 * class's 0.70.** That number prices an opposed crossing; a river valley is the
 * ground you stand on. Wiring the two together would hand five interior sectors a
 * crossing penalty against an attacker who never crossed anything.
 *
 * M5's `pass` and `legendaryNaturalSite` rungs are now unreachable — no authored
 * layer names them. `pass` was reachable until TC-⑮ retired the door as a terrain
 * source, which is the amendment working rather than a value going missing: 관중's
 * defiles defend at `Mountains` because their **ground** is mountain, and 중원's
 * plains sector on the far side of the same door stops collecting a defile bonus
 * it has no geographic claim to.
 */
const GROUND_TERRAIN: Readonly<Record<TerrainLayer, BattleTerrain>> = {
  plains: 'plains',
  steppe: 'plains',
  desert: 'plains',
  oasis: 'plains',
  'river-valley': 'plains',
  highland: 'forestHills',
  mountain: 'mountains',
};

/**
 * The M5 rung an authored layer defends at.
 *
 * An unknown layer **throws**, following `fortificationOf`'s precedent: the
 * queued map re-authoring (TC-⑪) is expected to add layers, and a silent ×1.0 is
 * exactly the failure that would hide a missing rung.
 */
export function combatTerrainOf(layer: TerrainLayer): BattleTerrain {
  const terrain = GROUND_TERRAIN[layer];
  if (terrain === undefined) {
    throw new Error(
      `Authored terrain layer "${layer}" has no M5 rung. TC-⑮ binds the seven layers ` +
        'this world revision carries; a new layer must be bound there before a battle ' +
        'can price the ground it is fought on.',
    );
  }
  return terrain;
}

/**
 * The authored fortification tiers this world revision actually carries.
 *
 * `terrain-cradle@r1` ships `fortTier: 'none'` on all 56 sectors, which is not an
 * oversight: TC-⑭ starts every player-varyable quantity uniform, and building a
 * fort is a player action nothing in this slice performs. So `none` is read off
 * the artifact rather than assumed.
 *
 * An unknown tier **throws** rather than defaulting. M5's ladder has five rungs
 * and `battle.ts` names them; what has never been written down is which authored
 * spelling means which rung. A future revision that authors a fort must land that
 * mapping at M5, and a silent ×1.0 is precisely the failure that would hide it.
 */
const AUTHORED_FORTIFICATION: Readonly<Record<string, BattleFortification>> = {
  none: 'none',
};

export function fortificationOf(fortTier: string): BattleFortification {
  const tier = AUTHORED_FORTIFICATION[fortTier];
  if (tier === undefined) {
    throw new Error(
      `Sector fortification tier "${fortTier}" has no M5 rung. The authored spelling ` +
        'must be bound to one of combat-formula MAGNITUDE M5\'s five tiers before a ' +
        'battle can price it.',
    );
  }
  return tier;
}

/**
 * The **defensibility order** the fidelity seal fixed: `open < forest/hills <
 * river < pass < strait`.
 *
 * Cited, not derived. Composing a ranking out of M5 and ADR 0015 by hand looks
 * equivalent and is not — it puts `pass` above `strait`, where the seal puts it
 * below — so the ordering is a rule of its own and this is the one place it is
 * written. Authority: TC-⑬'s combat-terrain binding as exercised in the L2 harness
 * (`mockup/combat-calc/map-board.js` `CLASS_DEFENSE_RANK`, sealed 2026-07-08 and
 * pinned by `tests/terrain-fidelity.test.js`, which asserts that a pass beside a
 * river yields the river). Classified **accepted** under ADR 0041 and
 * re-implemented from that evidence rather than translated.
 *
 * On `terrain-cradle@r1` no sector carries both a pass and a strait, so the one
 * place a hand-composed order would have differed is unobservable today — recorded
 * so that using the sealed order stays a choice rather than an accident.
 */
const CLASS_DEFENSE_RANK: Readonly<Record<ChokeClass, number>> = {
  open: 0,
  forest: 1,
  hills: 1,
  river: 2,
  pass: 3,
  strait: 4,
};

/**
 * TC-⑬'s **reachable-weakest-link**, which TC-⑮ leaves standing for exactly what
 * it was sealed for: where several authored borders open onto one sector, the
 * attack window an attacker actually uses is the softest of them.
 *
 * What TC-⑮ retired is the *extension* of this rule over **approaches** — letting
 * an undoored arrival pick a softer defensive term. Measured, routing around a
 * door costs 0 extra turns on 20 of 20 land doors, and 100 flanking men moved R
 * from 0.56 to 2.22: a hex-grain fact deciding a sector-grain outcome, for free.
 * What is retired is that *implementation*, not approach substitution as a
 * capability — making an approach cost something is deferred to frontage in the
 * operational-manoeuvre pass. Meanwhile this function ranges over the sector's
 * authored doors and must never be handed a list derived from how anyone arrived.
 *
 * Ties break on the class name so the reported door is deterministic; `forest`
 * and `hills` tie at M5's shared rung, where the choice is cosmetic anyway.
 */
function softestClass(classes: readonly ChokeClass[]): ChokeClass {
  return [...classes].sort((a, b) =>
    CLASS_DEFENSE_RANK[a] - CLASS_DEFENSE_RANK[b] || (a < b ? -1 : a > b ? 1 : 0))[0]!;
}

/** One contested border, as this module needs to read it. */
export interface BorderFront {
  readonly key: string;
  readonly sectors: readonly [SectorId, SectorId];
  readonly owners: readonly [ActorId, ActorId];
  readonly chokeClass: ChokeClass;
}

/**
 * One realm's combat-ready substance on one sector, as the board reads it after
 * movement.
 *
 * **Combat-ready only** — the ready cohorts, plus the holder's garrison. Cohorts
 * still forming are not in the power product, which is why they are also not in
 * the blood price the caller takes out of it. The two numbers travel together
 * because a mean needs both and neither means anything alone.
 */
export interface SideStanding {
  readonly men: number;
  /** Σ (men × wear ledger) — the men-weighted mass `force.ts` combines cohorts by. */
  readonly wearMass: number;
}

/** What stands on one sector once the turn's movement has resolved. */
export interface SectorStanding {
  /** Who holds this ground, or `null` when nobody does. */
  readonly holder: ActorId | null;
  readonly sides: Readonly<Record<ActorId, SideStanding>>;
  /** The authored fortification tier standing on the sector. */
  readonly fortTier: string;
  /**
   * The sector's own authored terrain (TC-⑮).
   *
   * Singular because every one of the 56 sectors is terrain-uniform — measured, 0
   * carry more than one layer — which is the fact that made the binding possible
   * without re-authoring the map. The reader that derives it is responsible for
   * refusing a sector that stops being uniform.
   */
  readonly terrainLayer: TerrainLayer;
}

/** One side of one engagement, in board terms rather than calculator terms. */
export interface EngagementParty {
  readonly actor: ActorId;
  readonly men: number;
  /** Men-weighted mean of the **wear ledger** — not yet an effectiveness multiplier. */
  readonly wear: number;
  /** 행동력 poured onto this sector — one key, one number (ADR 0046 item 4). */
  readonly commit: number;
}

/** One sector's engagement, fully described and not yet resolved. */
export interface Engagement {
  readonly sector: SectorId;
  /**
   * Every contested border opening onto this sector, in canonical order.
   *
   * **Empty for an interior sector**, which is now an ordinary battle site rather
   * than an impossible one. A front no longer gates where combat may occur; it
   * still reports where two realms touch.
   */
  readonly fronts: readonly string[];
  /** The door the crossing was taken from — the weakest link of `fronts`, or none. */
  readonly chokeClass: ChokeClass | null;
  readonly attacker: EngagementParty;
  readonly defender: EngagementParty;
  readonly terrain: BattleTerrain;
  readonly crossing: BattleCrossing;
  readonly fortification: BattleFortification;
  readonly defenseMethod: DefenseMethod;
}

function partyOf(
  actor: ActorId,
  sector: SectorId,
  standing: SectorStanding,
  commitments: Readonly<Record<ActorId, Readonly<Record<string, number>>>>,
): EngagementParty {
  const side = standing.sides[actor] ?? { men: 0, wearMass: 0 };
  return {
    actor,
    men: side.men,
    // A side with nobody in it is not tired; it simply is not there.
    wear: side.men === 0 ? 0 : side.wearMass / side.men,
    // No reconciliation across fronts: the key *is* the sector. 06c had to sum
    // two borders' shares here because the key was the front, and ADR 0046 item 4
    // deleted the need rather than the sum.
    commit: commitments[actor]?.[sector] ?? 0,
  };
}

/**
 * Every engagement a resolved turn produced, in canonical sector order.
 *
 * An engagement exists where a realm's combat-ready men stand on a sector its
 * realm does not hold. That is **presence**, not the front-assignment checkbox:
 * substance is what is actually there, and an army standing on ground under
 * attack does not abstain because a plan did not name it. The assignment is the
 * decision tier's exclusivity rule; this is the payoff tier reading the board.
 *
 * **Every sector is a candidate** (ADR 0046 item 1). `fronts` no longer seeds the
 * site list — it is consulted only for what a door still supplies, which is the
 * attacker's crossing. An army that walks into the interior is now fought there.
 *
 * `sectors` is the world's full sector list rather than a pre-filtered one,
 * because the filter *is* the rule this function states, and a caller that
 * narrowed the list first would be the place a later gate could quietly reappear.
 */
export function engagementsOf(
  sectors: readonly SectorId[],
  fronts: readonly BorderFront[],
  commitments: Readonly<Record<ActorId, Readonly<Record<string, number>>>>,
  standingAt: (sector: SectorId) => SectorStanding,
): readonly Engagement[] {
  const doorsBySector = new Map<SectorId, ChokeClass[]>();
  const frontsBySector = new Map<SectorId, string[]>();
  for (const front of fronts) {
    for (const sector of front.sectors) {
      const doors = doorsBySector.get(sector);
      if (doors === undefined) doorsBySector.set(sector, [front.chokeClass]);
      else doors.push(front.chokeClass);
      const keys = frontsBySector.get(sector);
      if (keys === undefined) frontsBySector.set(sector, [front.key]);
      else keys.push(front.key);
    }
  }

  const engagements: Engagement[] = [];
  for (const sector of [...sectors].sort()) {
    const standing = standingAt(sector);
    const holder = standing.holder;
    // Nobody holds it, so nobody is being invaded. The drawn partition covers all
    // 56 sectors so this never fires today, but a later cession could produce it,
    // and "an invading force standing on ground it does not hold" has no defender
    // to name here.
    if (holder === null) continue;

    // The duel seats exactly two actors (ADR 0042), so at most one side can be the
    // invader. Sorted so a hypothetical third seat would still resolve identically
    // in both hosts rather than by object insertion order.
    const invader = Object.keys(standing.sides).sort().find(
      (actor) => actor !== holder && (standing.sides[actor]?.men ?? 0) > 0,
    );
    // Nobody crossed: there is no engagement to report, and reporting an empty one
    // would make "a sector was fought over" and "a sector exists" indistinguishable.
    if (invader === undefined) continue;

    const doors = doorsBySector.get(sector) ?? [];
    // An interior sector has no door, so the door contributes nothing — absent
    // rather than approximated. `none` is the crossing ladder's identity.
    const chokeClass = doors.length === 0 ? null : softestClass(doors);
    engagements.push({
      sector,
      fronts: [...(frontsBySector.get(sector) ?? [])].sort(),
      chokeClass,
      attacker: partyOf(invader, sector, standing, commitments),
      defender: partyOf(holder, sector, standing, commitments),
      terrain: combatTerrainOf(standing.terrainLayer),
      crossing: chokeClass === null ? 'none' : DOOR_CROSSING[chokeClass],
      fortification: fortificationOf(standing.fortTier),
      defenseMethod: STANDING_POSTURE,
    });
  }
  return engagements;
}

/**
 * The wear ledger becomes the effectiveness multiplier **here**, and nowhere else.
 *
 * The two quantities share the name `fatigue` and are not the same thing: the
 * ledger is an unbounded accumulator that rises ~1 per marched hex, and the
 * calculator's input is a multiplier bounded to [0.5, 1] (`domain/fatigue.ts`).
 * Handing the ledger straight to `battle.ts` type-checks and multiplies a tired
 * army's power by nine.
 *
 * A garrison reaches this with wear 0 — it carries no ledger at all, because
 * nothing in this slice marches one — so it fights at exactly ×1.0, which is M2's
 * "an unattended garrison fights at its own strength".
 */
function participantOf(party: EngagementParty): BattleParticipant {
  return {
    substance: party.men,
    commit: party.commit,
    quality: UNIFORM_QUALITY,
    fatigue: effectiveness(party.wear),
    escape: OPEN_ESCAPE,
  };
}

/** One engagement, in the calculator's own terms. */
export function battleInputOf(engagement: Engagement): BattleInput {
  return {
    attacker: participantOf(engagement.attacker),
    defender: participantOf(engagement.defender),
    terrain: engagement.terrain,
    fortification: engagement.fortification,
    crossing: engagement.crossing,
    defenseMethod: engagement.defenseMethod,
  };
}

/**
 * A casualty figure as whole bodies.
 *
 * The calculator works in continuous substance and the board counts men, so the
 * conversion happens once, on the way back. Clamped to what was actually present
 * because a rout that takes the whole remainder lands on the substance exactly,
 * and a float that overshoots it by an ulp would otherwise ask the apportioner
 * for a man who was never there.
 */
export function bodiesLost(substance: number, casualties: number): number {
  return Math.max(0, Math.min(substance, Math.round(casualties)));
}
