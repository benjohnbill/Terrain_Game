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
 * A front is an authored *edge* — the door between two regions — and the ticket
 * seals resolution as **atomic per sector**. The two are different cardinalities,
 * and that difference is what adjudicates ticket 03's enumerated **case 4**:
 * `r7_s0` is a real sector serving two different region borders, so one realm can
 * press it from two sides at once. The turn loop ruled those stay two *fronts*;
 * here they are **one engagement**, because a sector cannot be fought over twice
 * in a turn without the second reading state the first already changed. Both
 * borders' chips are poured into it, and TC-⑬'s reachable-weakest-link picks the
 * ground.
 *
 * ## Where the ground comes from
 *
 * Terrain-cradle **TC-⑬** (SEALED 2026-07-08) binds a border's authored class to
 * the combat site's terrain and water; the multipliers themselves live at
 * combat-formula **M5** and **ADR 0015** and are held by `battle.ts`. This module
 * carries the *binding* and never a value.
 *
 * The hex `terrainLayer` is deliberately **not** consulted. The authored world
 * carries seven layers (plains, steppe, highland, desert, oasis, mountain,
 * river-valley) and M5's ladder has five rungs; no seal maps one onto the other,
 * so reading a sector's hexes for its defensive ground would be originating a
 * rule. TC-⑬ is the mapping the project actually sealed, and it is keyed on the
 * door rather than on the ground behind it.
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
import type { ChokeClass, SectorId } from '../world/schema.js';
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
 * TC-⑬'s table, as a binding: a border class names the combat site's ground and
 * its water. Values are cited, never restated — `battle.ts` holds M5's and
 * ADR 0015's ladders.
 *
 * Two readings are worth stating rather than leaving to be re-derived:
 *
 * - **The water classes carry no ground term.** TC-⑬ gives `river` and `strait`
 *   a water effect and no terrain, and M5's `plains` is the ×1.0 rung — the
 *   identity. Naming it is how "TC-⑬ assigns this door no ground" is written in
 *   a table that must name a terrain for every row.
 * - **The water is always the *opposed* variant.** A front exists only where two
 *   realms hold the two ends of one border, so the defender holds the far bank by
 *   construction; the uncontested rungs have no referent here. TC-⑬ names exactly
 *   these two.
 *
 * M5's `mountains` and `legendaryNaturalSite` rungs have no border class and are
 * therefore unreachable in this slice — absent rather than approximated.
 *
 * **What TC-⑬ pairs with `pass` and this does not implement:** the ruling states
 * that the door also *throttles the assaulting body* — "the frontage half of the
 * pass ×2.0 package", validated only as the residual after a frontage cap. M5 puts
 * that cap's **value** with the frontage/matchup stage, which has not run, so
 * writing one here would originate a number. The consequence is stated rather than
 * hidden: an unthrottled `pass` is priced at less than TC-⑬ intends, and
 * `Edge.frontageHexes` is authored and read by nothing. Registered in
 * `docs/SYNC-DEBT.md`.
 */
const COMBAT_GROUND: Readonly<Record<
  ChokeClass,
  { readonly terrain: BattleTerrain; readonly crossing: BattleCrossing }
>> = {
  open: { terrain: 'plains', crossing: 'none' },
  forest: { terrain: 'forestHills', crossing: 'none' },
  hills: { terrain: 'forestHills', crossing: 'none' },
  pass: { terrain: 'pass', crossing: 'none' },
  river: { terrain: 'plains', crossing: 'riverOpposed' },
  strait: { terrain: 'plains', crossing: 'straitOpposed' },
};

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
 * TC-⑬'s **reachable-weakest-link**: where several authored borders open onto one
 * sector, the attack window an attacker actually uses is the softest of them.
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
  readonly sides: Readonly<Record<ActorId, SideStanding>>;
  /** The authored fortification tier standing on the sector. */
  readonly fortTier: string;
}

/** One side of one engagement, in board terms rather than calculator terms. */
export interface EngagementParty {
  readonly actor: ActorId;
  readonly men: number;
  /** Men-weighted mean of the **wear ledger** — not yet an effectiveness multiplier. */
  readonly wear: number;
  /** 행동력 poured onto every border that opens on this sector. */
  readonly commit: number;
}

/** One sector's engagement, fully described and not yet resolved. */
export interface Engagement {
  readonly sector: SectorId;
  /** Every contested border opening onto this sector, in canonical order. */
  readonly fronts: readonly string[];
  /** The border class the ground was taken from — the weakest link of `fronts`. */
  readonly chokeClass: ChokeClass;
  readonly attacker: EngagementParty;
  readonly defender: EngagementParty;
  readonly terrain: BattleTerrain;
  readonly crossing: BattleCrossing;
  readonly fortification: BattleFortification;
  readonly defenseMethod: DefenseMethod;
}

function partyOf(
  actor: ActorId,
  standing: SectorStanding,
  fronts: readonly BorderFront[],
  commitments: Readonly<Record<ActorId, Readonly<Record<string, number>>>>,
): EngagementParty {
  const side = standing.sides[actor] ?? { men: 0, wearMass: 0 };
  return {
    actor,
    men: side.men,
    // A side with nobody in it is not tired; it simply is not there.
    wear: side.men === 0 ? 0 : side.wearMass / side.men,
    commit: fronts.reduce((sum, front) => sum + (commitments[actor]?.[front.key] ?? 0), 0),
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
 * Only sectors on a **contested border** can be sites, because those are the only
 * sectors whose defensive ground is sealed (TC-⑬ keys it on the door). An army
 * that walked past a border sector into the interior therefore fights nothing —
 * deep operations and the occupation of interior ground are not in this slice,
 * and inventing ground for them here would be inventing a rule.
 */
export function engagementsOf(
  fronts: readonly BorderFront[],
  commitments: Readonly<Record<ActorId, Readonly<Record<string, number>>>>,
  standingAt: (sector: SectorId) => SectorStanding,
): readonly Engagement[] {
  const sites = new Map<SectorId, { holder: ActorId; invader: ActorId; fronts: BorderFront[] }>();
  for (const front of fronts) {
    front.sectors.forEach((sector, side) => {
      const site = sites.get(sector);
      if (site !== undefined) {
        site.fronts.push(front);
        return;
      }
      // The duel seats exactly two actors (ADR 0042), so the realm on the other
      // end of any border touching this sector is the same one either way.
      sites.set(sector, {
        holder: front.owners[side]!,
        invader: front.owners[side === 0 ? 1 : 0]!,
        fronts: [front],
      });
    });
  }

  const engagements: Engagement[] = [];
  for (const sector of [...sites.keys()].sort()) {
    const site = sites.get(sector)!;
    const standing = standingAt(sector);
    // Nobody crossed: there is no engagement to report, and reporting an empty one
    // would make "a sector was fought over" and "a sector exists" indistinguishable.
    if ((standing.sides[site.invader]?.men ?? 0) <= 0) continue;

    const chokeClass = softestClass(site.fronts.map((front) => front.chokeClass));
    const ground = COMBAT_GROUND[chokeClass];
    engagements.push({
      sector,
      fronts: site.fronts.map((front) => front.key).sort(),
      chokeClass,
      attacker: partyOf(site.invader, standing, site.fronts, commitments),
      defender: partyOf(site.holder, standing, site.fronts, commitments),
      terrain: ground.terrain,
      crossing: ground.crossing,
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
