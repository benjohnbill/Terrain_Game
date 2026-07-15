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
 */

const W = (typeof module !== 'undefined' && module.exports) ? require('./window-read.js') : window.WindowRead;

/* Sealed settlement dials (ports — birthplace = match-arc 정산 / RULINGS ⑧⑬⑲,
   mechanized in mockup/combat-calc/match.js MATCH_DIALS). Cited, never re-cut. */
const PRESETS = Object.freeze({
  백지: { claimRate: 0.00, fill: 'cessionFirst' },   // CE-⑲ white peace — the ladder's 0% rung
  관대: { claimRate: 0.50, fill: 'indemnityFirst' },  // ruling ⑧/⑬ — the tempo-peace preset
  표준: { claimRate: 0.75, fill: 'cessionFirst' },
  최대: { claimRate: 1.00, fill: 'cessionFirst' },
});
const LADDER = Object.freeze(['백지', '관대', '표준', '최대']); // ascending claim rate
const TEMPERAMENT = Object.freeze({ 완고: 0.8, 실리: 1.0, 유화: 1.2 }); // acceptance coefficients
const LOSS_MODEL = Object.freeze({
  occEscalation: Object.freeze({ decisive: 1.5, grinding: 1.15, marginal: 0.85 }),
  capitalRiskFrac: 0.5,
  resistanceDiscount: 0.6, // ruling ⑫ — the loser prices continued war BELOW the full bill
});

/* 가안 dials — slice-2 spec §9 (provisional; ticket 10 measures). */
const TRAJECTORY_EPSILON = 0.02; // 가안 — relative change below this reads as steady, not degrading
const OWN_WINDOW_APPETITE = 1.0; // 가안 — a "window of my own" = a front I could actually take (R ≥ 1)

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
   state = { occValue, raidLoot, capitalInReach, margin }. */
function expectedContinuedLoss(state) {
  const m = LOSS_MODEL;
  const territorial = state.occValue * m.occEscalation[state.margin];
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
  const mine = W.bestTarget(myReads);
  const hasOwnWindow = !!mine && mine.read.ratio >= OWN_WINDOW_APPETITE;
  const against = W.bestTarget(readsAgainstMe);
  const windowsAgainst = !!against && against.read.ratio >= OWN_WINDOW_APPETITE;
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
   INVARIANT: 백지 is always signable — its bundle value is 0 and expected
   continued loss is never negative, so `0 <= L × coeff` always holds. This is a
   property of the sealed arithmetic, not of this port (see the white-peace note
   on decideExit), and the return is therefore never empty. */
function acceptableRungs(state, temperament) {
  const coeff = TEMPERAMENT[temperament];
  if (coeff === undefined) throw new Error('unknown temperament: ' + temperament);
  const L = expectedContinuedLoss(state);
  return LADDER
    .map((name) => presetBundle(name, state))
    .filter((b) => accepts(b.value, L.total, coeff))
    .map((b) => b.preset);
}

/* THE bot court's exit decision. Returns the rung it accepts, or null to fight
   on (spec §9: a contested or winning position fights on — the read, never a
   counter, decides).
 *
 * The rung is the HIGHEST claim the court can still afford to concede: its
 * position on the ladder, which is what "the rung appropriate to its position"
 * means. A mild loss signs only the cheap rungs; a court whose capital is under
 * the sword signs 최대 rather than lose the throne — so the exit is emphatically
 * not always white peace.
 *
 * ── Why there is no "cannot afford any rung" branch ──────────────────────────
 * A beaten bot court can ALWAYS sign at least white peace: 백지's bundle value is
 * 0, and `accepts(0, L, coeff)` is `0 <= L × coeff`, true for every non-negative
 * expected loss. Bot drag is therefore not an acceptance-arithmetic outcome, and
 * a branch for it would be unreachable. This is not a gap in the port — it is
 * why the sealed harness's winner-side walk is ['최대','표준','관대'] with 백지
 * absent (a WINNER never proposes claiming nothing; CE-⑲ canonized 백지 as the
 * ladder's 0% rung, and the stall timer — the thing this module retires — was
 * the only path that ever reached it). This module reads the LOSER's side, where
 * white peace is free by construction.
 *
 * Dragging a lost war stays possible where ADR 0038 actually puts it: a human
 * court (the CE-⑲ gate below — never force-closed), and a court that withholds
 * its army from the field. Neither is an acceptance-arithmetic branch.
 *
 * Flagged for ticket-10 measurement: a court that reads itself losing before the
 * enemy sword has reached anything (occValue ~ 0) signs 백지 — a PRE-EMPTIVE
 * white peace. It is individually rational (quit before losing land) but it is
 * also a white-peace source, and metric 5 counts white-peace %. If the re-read
 * shows the fizzle surviving in this shape, the lever is the OWN_WINDOW_APPETITE
 * / trajectory 가안 (how early a court calls itself beaten), not the sealed
 * acceptance arithmetic. */
function decideExit(cfg) {
  // CE-⑲ — bot policy only. A human court is never force-closed, whatever the
  // read says. This gate is deliberately FIRST: no code path below it can run.
  if (cfg.court && cfg.court.isHuman) {
    return { settle: false, rung: null, reason: 'human-court', position: null };
  }
  const pos = position(cfg);
  if (!pos.losing) return { settle: false, rung: null, reason: 'fight-on', position: pos };

  const signable = acceptableRungs(cfg.state, cfg.court.temperament)
    .map((name) => presetBundle(name, cfg.state));
  // The most it can afford to concede. A bundle's value is composite × claimRate
  // exactly, so value rises strictly with the rung and the max IS the top rung —
  // except when the sword has reached nothing (composite 0), where every rung is
  // the same empty bundle. There, naming the top rung would report a claim of
  // nothing as 최대 and poison metric 5's rung distribution; the honest label for
  // a material transfer is the LEAST-claiming rung that achieves it. LADDER is
  // ascending, so find() takes exactly that.
  const top = Math.max(...signable.map((b) => b.value));
  const bundle = signable.find((b) => b.value === top);
  return { settle: true, rung: bundle.preset, reason: 'read-driven-settlement', position: pos, bundle };
}

const _api = {
  PRESETS, LADDER, TEMPERAMENT, LOSS_MODEL, TRAJECTORY_EPSILON, OWN_WINDOW_APPETITE,
  presetBundle, expectedContinuedLoss, accepts,
  trajectory, position, acceptableRungs, decideExit,
};
if (typeof module !== 'undefined' && module.exports) module.exports = _api;
else (window.BotExit = window.BotExit || {}), Object.assign(window.BotExit, _api);
