'use strict';

/* bot-exit.js — read-driven settlement, the bot court's exit (slice-2 spec §9, C2).
 *
 * Retires the stall→white-peace timer (the measured driver of the 77% white-peace
 * fizzle, R14). A bot court no longer stops fighting because a counter ran out;
 * it stops because it READS that it has lost. The read is ticket 08's window
 * arithmetic, consumed unchanged:
 *
 *   (i)   no window of its own anywhere      — bestTarget over my candidate fronts
 *   (ii)  windows open against it            — the same read run from the enemy's side
 *   (iii) a degrading trajectory             — fatigue, land, army over the war
 *
 * A court in that position takes the B3 settlement rung its position earns —
 * executing the will path of the war-ending composite (ADR 0038, channel 3).
 * Surrendering with the army intact is legitimate; dragging a lost war stays
 * available and self-punishing (lost land starves recruitment; the capital
 * backstop waits) — this module never forces the choice.
 *
 * Pure and stateless: every function returns a fresh value and reads only its
 * inputs. No timer, no counter, no patience dial exists here BY CONSTRUCTION —
 * the retirement is structural, not a disabled flag.
 *
 * ── CE-⑲: bots only, never a human ────────────────────────────────────────────
 * A war is never force-closed over a human player's head (a siege may
 * legitimately wait; agency is the seal). The existing L2 harness satisfied this
 * only by construction — `tournament.js` is bot-vs-bot and has no human concept
 * at all — so the guarantee was structural luck, not an enforced rule. This
 * module re-establishes it as an EXPLICIT gate (`isHuman` → null, tested), so
 * that the wiring ticket cannot inherit the guarantee by accident into a game
 * where humans do exist.
 *
 * ── Bot doctrine (spec §9) ────────────────────────────────────────────────────
 * Bots judge like real courts and should play BETTER than people within their
 * constraints: optimal calculation inside disposition (λ) and confidence-band
 * limits. Personality lives in information and disposition, never in a
 * calculation handicap. So this court reads its OWN state exactly (no fog on
 * self, D1) and the enemy's through the same λ-judged bands a player would get —
 * no deliberate blunder dial, and no omniscience either.
 *
 * ── Ported sealed arithmetic (reuse, not redesign) ────────────────────────────
 * The settlement arithmetic is a port of the sealed 수락 산술 — birthplace =
 * match-arc GLOSSARY 정산 + RULINGS ⑧/⑬/⑲, mechanized in
 * `mockup/combat-calc/match.js` (presetBundle / expectedContinuedLoss / accepts).
 * js/ never imports the mockup, so the formulas are ported WITH their birthplace
 * citation and no re-cutting — the same convention by which battle.js ports the
 * MAGNITUDE dials and window-read.js ports the TP② λ dial. Values re-cut at the
 * birthplace, never here.
 *
 * Scope: vassalage (RULINGS ⑭ — priced in acceptance currency, not reach
 * currency) is deliberately NOT part of this walk. Spec §9 says the court
 * "accepts the appropriate B3 settlement rung", and B3 is the preset ladder;
 * vassalage is the WINNER's demand when a throne is in reach (trySettle's
 * chain-seeker path), not the losing court's own read. It belongs to the wiring
 * ticket that owns both sides of the table.
 *
 * ── CE-⑳: the overlay ladder (gap CLOSED by ticket 11) ──────────────────────
 * CE-⑳ breaks the settlement ladder from the bottom rung up as total war
 * escalates (the harness's availablePresets: stage >= 2 drops 백지/관대, stage
 * >= 3 leaves only 최대 — "wars end big or not at all"). This module used to walk
 * the FULL sealed ladder and know nothing of the calendar, so a wired bot court
 * would have signed whitePeace during total war, which CE-⑳ forbids.
 *
 * `acceptableRungs`/`decideExit` now take an OPEN-RUNGS input: the caller owns
 * the calendar, this module owns the arithmetic. A broken rung is filtered out
 * before the arithmetic runs — it is not a rung the court declines, it is a rung
 * that no longer exists. Two consequences, both live:
 *   - the never-empty invariant DIES with 백지: white peace stops being free.
 *   - the "cannot afford any rung" branch, deleted here as unreachable, becomes
 *     REACHABLE, and is re-derived from the same arithmetic (see decideExit) —
 *     a court that can afford nothing on offer drags a lost war (ADR 0038).
 */

const WindowRead = (typeof module !== 'undefined' && module.exports) ? require('./window-read.js') : window.WindowRead;

/* Sealed settlement dials (ports — birthplace = match-arc 정산 / RULINGS ⑧⑬⑲,
   mechanized in mockup/combat-calc/match.js MATCH_DIALS). Cited, never re-cut.
   Identifiers are the registered English canonicals (documentation-law Vocabulary
   Law: code identifiers are English; the 한국어 표시어 is a display VALUE, never a
   key) — `Settlement preset ladder` aliases lenient/standard/maximum, `White
   peace` is its own registered term, `Personality coefficient` aliases
   hardliner/pragmatic/conciliatory. `label` carries the birthplace's 표시어, which
   is also the key the mockup harness uses. Frozen per level: a consumer must not
   re-cut a sealed dial at runtime — re-cuts happen at the birthplace. */
const PRESETS = Object.freeze({
  whitePeace: Object.freeze({ claimRate: 0.00, fill: 'cessionFirst', label: '백지' }),   // CE-⑲ — the ladder's 0% rung
  lenient:    Object.freeze({ claimRate: 0.50, fill: 'indemnityFirst', label: '관대' }), // ruling ⑧/⑬ — the tempo-peace preset
  standard:   Object.freeze({ claimRate: 0.75, fill: 'cessionFirst', label: '표준' }),
  maximum:    Object.freeze({ claimRate: 1.00, fill: 'cessionFirst', label: '최대' }),
});
const LADDER = Object.freeze(['whitePeace', 'lenient', 'standard', 'maximum']); // ascending claim rate
const TEMPERAMENT = Object.freeze({ hardliner: 0.8, pragmatic: 1.0, conciliatory: 1.2 }); // 성향 계수 (완고/실리/유화)
const LOSS_MODEL = Object.freeze({
  occEscalation: Object.freeze({ decisive: 1.5, grinding: 1.15, marginal: 0.85 }),
  capitalRiskFrac: 0.5,
  resistanceDiscount: 0.6, // ruling ⑫ — the loser prices continued war BELOW the full bill
});

/* 가안 dials — slice-2 spec §9 (provisional; ticket 10 measures). */
const TRAJECTORY_EPSILON = 0.02; // 가안 — relative change below this reads as steady, not degrading
/* The ratio at which a window counts as a real one — a front someone could
   actually take (R ≥ 1). It gates BOTH directions of the §9 read (my windows and
   the enemy's) deliberately: "is there a window here?" is one question asked
   twice, and a court that judged its own chances by one bar and the enemy's by
   another would be reading with a handicap (bot doctrine §9). Distinct from
   window-read's APPETITE_THRESHOLD, which is the peacetime DECLARATION bar
   ("is this worth starting a war over?") — a higher, appetite question. */
const WINDOW_APPETITE = 1.0;

function round2(value) {
  return Math.round(value * 100) / 100;
}

/* ── Ported acceptance arithmetic (match.js) ───────────────────────────────── */

/* The claim bundle a rung asks for. reach = { occValue, raidLoot } in
   sector-turn-yield units; composite reach value := occValue + raidLoot. */
function presetBundle(presetName, reach) {
  const p = PRESETS[presetName];
  if (!p) throw new Error('unknown settlement preset: ' + presetName);
  const composite = reach.occValue + reach.raidLoot;
  const target = composite * p.claimRate;
  let cession, indemnity;
  if (p.fill === 'indemnityFirst') {
    indemnity = Math.min(reach.raidLoot, target);
    cession = Math.min(reach.occValue, target - indemnity);
  } else {
    cession = Math.min(reach.occValue, target);
    indemnity = Math.min(reach.raidLoot, target - cession);
  }
  return { preset: presetName, claimRate: p.claimRate, fill: p.fill,
    cession, indemnity, value: cession + indemnity, composite };
}

/* What continuing the war is expected to cost this court.
   state = { occValue, raidLoot, capitalInReach, margin }. An unknown margin
   throws by name (battle.js convention): silently it would produce NaN, which
   rejects every rung and would break the never-empty invariant below into a
   TypeError several frames away. */
function expectedContinuedLoss(state) {
  const m = LOSS_MODEL;
  const escalation = m.occEscalation[state.margin];
  if (escalation === undefined) throw new Error('unknown war margin: ' + state.margin);
  const territorial = state.occValue * escalation;
  const economic = state.raidLoot;
  const capitalRisk = state.capitalInReach ? (state.occValue + state.raidLoot) * m.capitalRiskFrac : 0;
  return { territorial, economic, capitalRisk, discount: m.resistanceDiscount,
    total: m.resistanceDiscount * (territorial + economic + capitalRisk) };
}

/* 수락 산술 (sealed): accept iff the bundle costs no more than fighting on.
   Deterministic, true values, no dice. */
function accepts(bundleValue, expectedLossTotal, coeff) {
  return bundleValue <= expectedLossTotal * coeff;
}

/* ── The read: my position in this war ────────────────────────────────────── */

/* Trajectory over the war so far: is my position degrading? Compares a snapshot
   from earlier in THIS war against now, across the three axes spec §9 names —
   fatigue (rising = worse), land and army (falling = worse). Own state, so exact
   (D1: no fog on self). Any axis clearly worsening reads as degrading; the
   epsilon keeps float noise and trivial drift from counting. `before` missing
   (a war too young to have a trend) reads as steady — a court does not concede
   on turn one for lack of history. */
function trajectory(before, now) {
  if (!before) return { degrading: false, axes: [], reason: 'no-history' };
  const axes = [];
  const worse = (from, to, higherIsWorse) => {
    const base = Math.max(Math.abs(from), 1e-9);
    const delta = (to - from) / base;
    return higherIsWorse ? delta > TRAJECTORY_EPSILON : delta < -TRAJECTORY_EPSILON;
  };
  if (worse(before.fatigue, now.fatigue, true)) axes.push('fatigue');
  if (worse(before.land, now.land, false)) axes.push('land');
  if (worse(before.army, now.army, false)) axes.push('army');
  return { degrading: axes.length > 0, axes, reason: axes.length ? 'degrading' : 'steady' };
}

/* The court's position: the three conditions of spec §9, each answered by the
   ticket-08 read. `myReads` = window reads over the fronts I could attack;
   `readsAgainstMe` = the same arithmetic run from the enemy's side over my
   fronts (the caller builds both with WindowRead.readFronts — one function, both
   directions, exactly as §7 intends). */
function position(cfg) {
  const { myReads = [], readsAgainstMe = [], before, now } = cfg;
  const mine = WindowRead.bestTarget(myReads);
  const hasOwnWindow = !!mine && mine.read.ratio >= WINDOW_APPETITE;
  const against = WindowRead.bestTarget(readsAgainstMe);
  const windowsAgainst = !!against && against.read.ratio >= WINDOW_APPETITE;
  const traj = trajectory(before, now);
  return {
    hasOwnWindow,
    bestOwnWindow: mine ? round2(mine.read.ratio) : 0,
    windowsAgainst,
    worstWindowAgainst: against ? round2(against.read.ratio) : 0,
    trajectory: traj,
    // Spec §9's conjunction: no window of my own AND windows open against me AND
    // a degrading trajectory. All three — a court with a live counter-punch, or
    // a stable line, is not beaten and fights on.
    losing: !hasOwnWindow && windowsAgainst && traj.degrading,
  };
}

/* ── The decision ─────────────────────────────────────────────────────────── */

/* Every rung this court would sign, cheapest claim first. A rung is signable
   when the sealed 수락 산술 says the bundle costs no more than fighting on.
   `openRungs` is THE OVERLAY INPUT (ticket 11, closing the CE-⑳ gap this module
   shipped with): the caller owns the calendar, this module owns the arithmetic.
   CE-⑳ breaks the settlement ladder from the bottom rung up as total war
   escalates — 백지 first, then 관대, then 표준; 최대 always survives ("wars end
   big or not at all"). A broken rung is not a rung a court declines to sign, it
   is a rung that no longer EXISTS to be signed, so it is filtered out of the walk
   before the arithmetic runs, never priced and rejected. Omitted (undefined) =
   the full sealed ladder, which is the peacetime/no-overlay world.

   INVARIANT, and its DEATH: while 백지 is open, it is always signable — its
   bundle value is 0 and expected continued loss is never negative, so
   `0 <= L × coeff` always holds, and the return is never empty. Once the overlay
   breaks 백지 that guarantee is GONE: a court too poor to afford the cheapest
   surviving rung can afford NOTHING, and the return is legitimately empty. That
   is not a hole — it is ADR 0038's drag, arrived at honestly (see decideExit). */
function acceptableRungs(state, temperament, openRungs) {
  const coeff = TEMPERAMENT[temperament];
  if (coeff === undefined) throw new Error('unknown temperament: ' + temperament);
  const open = openRungs ? new Set(openRungs) : null;
  if (open) {
    for (const name of open) {
      if (!PRESETS[name]) throw new Error('unknown settlement preset in openRungs: ' + name);
    }
  }
  const L = expectedContinuedLoss(state);
  return LADDER
    .filter((name) => !open || open.has(name))
    .map((name) => presetBundle(name, state))
    .filter((b) => accepts(b.value, L.total, coeff))
    .map((b) => b.preset);
}

/* THE bot court's exit decision. Returns the court's ACCEPTANCE CEILING — the
   highest claim it can still afford to concede — or null to fight on (spec §9: a
   contested or winning position fights on; the read, never a counter, decides).
 *
 * The ceiling IS "its position on the ladder" (spec §9): a mild loss can afford
 * only the cheap rungs; a court whose capital is under the sword can afford
 * `maximum` rather than lose the throne — so the exit is emphatically not always
 * white peace.
 *
 * ── The ceiling is NOT the settled rung ─────────────────────────────────────
 * A settlement has two sides, and this module reads only the loser's. The sealed
 * walk (tournament.js trySettle) has the WINNER propose from its archetype's
 * preferred preset and concede one step per turn (`proposalStep`); ruling ⑧'s
 * "claim rate = rejection risk" is the winner's trade. The settled rung is
 * therefore the winner's demand as capped by this ceiling — never the ceiling
 * alone. Reporting the ceiling AS the settlement would skew high (a court that
 * can afford everything would read as `maximum` regardless of what the winner
 * actually wanted), so the field is named `ceiling` and the wiring ticket that
 * owns both sides of the table resolves the actual rung.
 *
 * Ticket 10 note: metric 5's settlement-rung distribution must come from the
 * resolved rung, not from this ceiling.
 *
 * ── The "cannot afford any rung" branch, and when it is reachable ───────────
 * While 백지 is OPEN, a beaten bot court can always sign at least white peace:
 * its bundle value is 0, and `accepts(0, L, coeff)` is `0 <= L × coeff`, true for
 * every non-negative expected loss. Under the full ladder the branch below is
 * therefore unreachable, which is why the sealed harness's winner-side walk is
 * ['최대','표준','관대'] with 백지 absent: a WINNER never proposes claiming
 * nothing, so the 0% rung is only ever reached from the loser's side.
 *
 * CE-⑳ makes it REACHABLE (ticket 11). Once the overlay breaks 백지 off the
 * bottom of the ladder, white peace stops being free, and a court too poor to
 * afford the cheapest surviving rung can afford nothing at all. It does not
 * surrender — it DRAGS a lost war, which is exactly where ADR 0038 puts drag and
 * is the honest reading of "wars end big or not at all": if the only peace on
 * offer costs more than fighting on, a court fights on. The branch is
 * re-derived here from the same arithmetic rather than resurrected on faith:
 * `signable` empty ⇒ no rung is affordable ⇒ no settlement.
 *
 * Drag also stays possible where ADR 0038 already put it: a human court (the
 * CE-⑲ gate below — never force-closed), and a court that withholds its army
 * from the field. Those are not acceptance-arithmetic branches.
 *
 * Flagged for ticket-10 measurement: a court that reads itself losing before the
 * enemy sword has reached anything (occValue ~ 0) signs 백지 — a PRE-EMPTIVE
 * white peace. It is individually rational (quit before losing land) but it is
 * also a white-peace source, and metric 5 counts white-peace %. If the re-read
 * shows the fizzle surviving in this shape, the lever is the OWN_WINDOW_APPETITE
 * / trajectory 가안 (how early a court calls itself beaten), not the sealed
 * acceptance arithmetic. */
function decideExit(cfg) {
  // CE-⑲ — bot policy only: a war is never force-closed over a human player,
  // whatever the read says. The gate is FIRST (no path below it can run) and
  // FAIL-CLOSED: only an explicit isHuman === false earns the bot path. A missing
  // or malformed court reads as human, because the failure that matters here is
  // asymmetric — wrongly declining to settle a bot war costs a turn, wrongly
  // force-closing a human's war destroys the agency the seal exists to protect.
  if (!cfg.court || cfg.court.isHuman !== false) {
    return { settle: false, ceiling: null, reason: 'human-court', position: null };
  }
  const pos = position(cfg);
  if (!pos.losing) return { settle: false, ceiling: null, reason: 'fight-on', position: pos };

  // cfg.openRungs = the rungs the calendar still leaves standing (CE-⑳). The
  // caller owns the calendar; this module owns the arithmetic. Absent = full
  // sealed ladder.
  const signable = acceptableRungs(cfg.state, cfg.court.temperament, cfg.openRungs)
    .map((name) => presetBundle(name, cfg.state));
  // Nothing on the surviving ladder is affordable: the court drags a lost war.
  // Reachable ONLY once CE-⑳ has broken 백지 off the bottom (see the header) —
  // under the full ladder white peace is free and this cannot fire.
  if (!signable.length) {
    return { settle: false, ceiling: null, reason: 'no-affordable-rung', position: pos, signable: [] };
  }
  // The most it can afford to concede. A bundle's value is composite × claimRate
  // exactly, so value rises strictly with the rung and the max IS the top rung —
  // except when the sword has reached nothing (composite 0), where every rung is
  // the same empty bundle. There, naming the top rung would report a claim of
  // nothing as `maximum` and poison metric 5's rung distribution; the honest
  // label for a material transfer is the LEAST-claiming rung that achieves it.
  // LADDER is ascending, so find() takes exactly that.
  const top = Math.max(...signable.map((b) => b.value));
  const bundle = signable.find((b) => b.value === top);
  return { settle: true, ceiling: bundle.preset, reason: 'read-driven-settlement',
    position: pos, bundle, signable: signable.map((b) => b.preset) };
}

const _api = {
  PRESETS, LADDER, TEMPERAMENT, LOSS_MODEL, TRAJECTORY_EPSILON, WINDOW_APPETITE,
  presetBundle, expectedContinuedLoss, accepts,
  trajectory, position, acceptableRungs, decideExit,
};
if (typeof module !== 'undefined' && module.exports) module.exports = _api;
else (window.BotExit = window.BotExit || {}), Object.assign(window.BotExit, _api);
