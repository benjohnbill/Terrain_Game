'use strict';
/* fizzle.js — METRIC 5: the fizzle re-read vs the L2 baseline (ticket 10).
 *
 * Spec §11 metric 5: "Fizzle re-read vs the L2 baseline — white-peace %,
 * annihilations/match, settlement rung distribution: does C1+C2 close R14 at the
 * source?" This is the evidence input for the slice-2 seal decision. It reports
 * needles. It does NOT judge them — the verdict is the user's (battery
 * precedent; metrics.js "encodes NO balance decision").
 *
 * ── The baseline is RE-DERIVED, not quoted ──────────────────────────────────
 * The recorded target (~77% white peace, 0 annihilations/match — DESIGN-RISKS
 * R14) exists ONLY as prose: no committed report file produces it, and nothing
 * in battery.js aggregates `warEnds` at all. Quoting a prose number as a
 * comparison target would compare a measurement against a memory. So this
 * harness re-runs the L2 cradle probe itself, at the recorded coordinates
 * (`runCradleTournament`, CRADLE_MAP, viable 5-seat bindings, seed 42, crisis
 * OFF) and tallies `record.warEnds` by CAUSE.
 *
 * That decomposition is mandatory, not decoration. Three code paths in
 * `tournament.js` reach the identical 0%-material outcome — `stallPeace` (the
 * timer), `refusePeace` (a winner that will not storm thrones), and a
 * death-forced return inside `eliminate` — so a headline that attributes the
 * whole ~77% to any one of them is a verdict the data has not earned. The report
 * prints the split and lets the reader attribute.
 *
 * ── What the baseline number CANNOT tell you (honest bounds) ────────────────
 *  - The death-forced path (tournament.js :1026) records NO cause: `eliminate()`
 *    has no `record` parameter. Those white peaces are invisible in `warEnds`,
 *    so the baseline's white-peace % is a FLOOR, not an exact figure.
 *  - "0 annihilations/match" is realm ELIMINATION (`record.eliminations`) — the
 *    only sense the L2 harness could measure. The 섬멸 sense (js/battle.js's
 *    BLOCKED rout) has NO L2 analogue: `tournament.js` never counts it. Both are
 *    reported below, separately and labelled; they are not the same quantity and
 *    only the first has a baseline.
 */
const { runCradleTournament } = require('../combat-calc/map-board.js');
const { CRADLE_MAP } = require('../combat-calc/map-gen.js');
const { viableBindings } = require('../combat-calc/map-gate.js');
const W = require('./war-loop.js');
const { forEachRestoration } = require('./metrics.js');

/* The recorded coordinates of the L2 baseline (DESIGN-RISKS R14: "Crisis-OFF
   main-arc measurement (2026-07-13, L2 cradle, seed 42)"). battery.js cradleSheet
   runs the same map/bindings at REPS 30 / SEED 42. */
const SEED = 42;
const BASELINE_REPS = 30;
/* The new loop is the same shape (bindings × archetypes × focal seats × reps) but
   pays hex pathfinding per turn, so it runs at fewer reps. Rates, not counts, are
   what the two share — and the report prints n for both so the reader can see the
   power behind each. */
const LOOP_REPS = 4;

/* The recorded prose figures, carried ONLY so the re-derivation can be checked
   against what was written down. Never used as the comparison target itself. */
const RECORDED = Object.freeze({
  source: 'docs/DESIGN-RISKS.md R14 (2026-07-13, L2 cradle, seed 42, crisis OFF)',
  whitePeacePct: 77, annihilationsPerMatch: 0, decidedPct: 0.656,
});

function rate(num, den) { return den === 0 ? null : num / den; }

/* ── Baseline: the L2 cradle, re-run and decomposed by cause ─────────────── */

function baseline({ reps = BASELINE_REPS, seed = SEED, bindings } = {}) {
  const viable = bindings || viableBindings(CRADLE_MAP, 5).viable;
  // No `harness` override → HARNESS.crisis.enabled stays false. Crisis-OFF is
  // the record world by tournament.js's own comment, and the R14 measurement's
  // own stated condition. See war-loop.js's overlay decision.
  const records = runCradleTournament({ map: CRADLE_MAP, bindings: viable, reps, seed });

  const byCause = {};
  let warEnds = 0;
  for (const r of records)
    for (const w of r.warEnds || []) { warEnds++; byCause[w.cause] = (byCause[w.cause] || 0) + 1; }

  const stallPeace = byCause.stallPeace || 0;
  const refusePeace = byCause.refusePeace || 0;
  const shapes = {};
  for (const r of records) shapes[r.endingShape] = (shapes[r.endingShape] || 0) + 1;

  // The SAME material rule the re-read applies to itself, applied here — a rate
  // computed one way on one run and another way on the other is not a delta. A
  // baseline deal that moved neither land nor indemnity is a white peace whatever
  // rung it was struck at. (`accepts(0, L, coeff)` is always true, so an empty
  // bundle is reachable here too: 백지's absence from the winner's walk bounds
  // which NAME appears, not whether anything MOVES. Rare in practice — but its
  // rarity is an empirical fact, not the structural guarantee it looked like.)
  const rungs = {};
  let emptyDeals = 0;
  for (const r of records)
    for (const s of r.settlements || []) {
      const material = (s.ceded || 0) > 0 || (s.indemnity || 0) > 0;
      if (!material) emptyDeals++;
      const key = !material ? 'whitePeace' : (s.kind === 'vassalage' ? 'vassalage' : s.preset);
      rungs[key] = (rungs[key] || 0) + 1;
    }

  // Wars that started and never reached a recorded end. `eliminate()` takes no
  // `record` (tournament.js :996), so its side-war white peaces are invisible,
  // and wars still running at the envelope are never stamped. The re-read closes
  // this hole in itself; the baseline's is in sealed code this ticket must not
  // edit (ticket 11 owns tournament.js), so it is COUNTED here instead of fixed.
  const warsStarted = records.reduce((s, r) => s + r.warsStarted, 0);
  const unrecorded = Math.max(0, warsStarted - warEnds);

  return {
    matches: records.length, warEnds, byCause, shapes, rungs, warsStarted, unrecorded, emptyDeals,
    whitePeacePct: rate(stallPeace + refusePeace + emptyDeals, warEnds),
    stallPeacePct: rate(stallPeace, warEnds),
    refusePeacePct: rate(refusePeace, warEnds),
    emptyDealPct: rate(emptyDeals, warEnds),
    settlePct: rate(byCause.settle || 0, warEnds),
    unrecordedPct: rate(unrecorded, warsStarted),
    // The R14 sense: a war that moved no ownership produced no climax, however it
    // stopped. Denominator = wars STARTED, so unrecorded wars cannot hide.
    noMaterialOutcomePct: rate(stallPeace + refusePeace + emptyDeals + unrecorded, warsStarted),
    eliminationsPerMatch: records.reduce((s, r) => s + r.eliminations, 0) / records.length,
    decidedPct: rate(records.filter((r) => r.endingShape !== 'timeout').length, records.length),
    warsPerMatch: warsStarted / records.length,
    turnsPerMatch: records.reduce((s, r) => s + (r.tripTurn || 32), 0) / records.length,
  };
}

/* ── The re-read: the slice-2 loop, same coordinates ─────────────────────── */

function reread({ reps = LOOP_REPS, seed = SEED, knobs, bindings } = {}) {
  const viable = bindings || viableBindings(CRADLE_MAP, 5).viable;
  const records = W.runWarLoopTournament({ map: CRADLE_MAP, bindings: viable, reps, seed, knobs });

  const byCause = {};
  let warEnds = 0;
  for (const r of records)
    for (const w of r.warEnds || []) { warEnds++; byCause[w.cause] = (byCause[w.cause] || 0) + 1; }

  const rungs = {};
  const demandedRungs = {};
  for (const r of records)
    for (const s of r.settlements || []) {
      rungs[s.rung] = (rungs[s.rung] || 0) + 1;
      demandedRungs[s.demandedRung] = (demandedRungs[s.demandedRung] || 0) + 1;
    }

  // White peace in THIS loop has two sources, and they are different animals:
  //  - `refusePeace` — the WINNER's will breaking, ported unchanged from the
  //    baseline (js/bot-exit models only the loser's side, so this has no
  //    read-driven counterpart yet).
  //  - a resolved rung of `whitePeace` — the PRE-EMPTIVE white peace flagged for
  //    this ticket (js/bot-exit :255-262): a court that reads itself losing
  //    before the enemy sword has reached anything (composite ~ 0) signs the 0%
  //    rung. Individually rational, and a white-peace source with NO L2 analogue.
  //    If the fizzle survives in this shape, the lever is bot-exit's
  //    WINDOW_APPETITE / trajectory 가안 — never the sealed acceptance arithmetic.
  const preemptive = rungs.whitePeace || 0;
  const refusePeace = byCause.refusePeace || 0;
  // `settle` and white peace OVERLAP: a 0%-rung deal is both a settlement and a
  // white peace. The cause table must partition, so the settle bucket is split
  // into deals that actually moved land and deals that moved nothing.
  const settleAll = byCause.settle || 0;
  const settleMaterial = settleAll - preemptive;
  const unresolved = byCause.unresolved || 0;
  const participantEliminated = byCause.participantEliminated || 0;
  const noFrontier = byCause.noFrontier || 0;
  const warsStarted = records.reduce((s, r) => s + r.warsStarted, 0);

  return {
    matches: records.length, warEnds, byCause, rungs, demandedRungs, warsStarted,
    // Every war end carries a cause here (endWar's signature enforces it), so
    // warsStarted === warEnds and the two denominators coincide. The guard stays
    // reported rather than assumed: a silent end is the defect that flatters.
    unrecorded: Math.max(0, warsStarted - warEnds),
    whitePeacePct: rate(preemptive + refusePeace, warEnds),
    preemptiveWhitePeacePct: rate(preemptive, warEnds),
    refusePeacePct: rate(refusePeace, warEnds),
    settlePct: rate(settleAll, warEnds),
    settleMaterialPct: rate(settleMaterial, warEnds),
    unresolvedPct: rate(unresolved, warEnds),
    participantEliminatedPct: rate(participantEliminated, warEnds),
    noFrontierPct: rate(noFrontier, warEnds),
    stallPeacePct: 0,      // structurally impossible — no timer exists in the loop
    // The R14 sense, same formula as the baseline's: every war that moved no
    // ownership, however it stopped. This is where retiring a timer shows its
    // real cost — a forced white peace becomes a war that never ends, and both
    // land in this bucket.
    noMaterialOutcomePct: rate(preemptive + refusePeace + unresolved + participantEliminated + noFrontier, warsStarted),
    eliminationsPerMatch: records.reduce((s, r) => s + r.eliminations, 0) / records.length,
    annihilationsPerMatch: records.reduce((s, r) => s + r.annihilations, 0) / records.length,
    decisivePerMatch: records.reduce((s, r) => s + r.decisiveBattles, 0) / records.length,
    engagementsPerMatch: records.reduce((s, r) => s + r.engagements, 0) / records.length,
    warsPerMatch: warsStarted / records.length,
    decidedPct: rate(records.filter((r) => r.endingShape !== 'timeout').length, records.length),
    turnsPerMatch: records.reduce((s, r) => s + r.turnsPlayed, 0) / records.length,
  };
}

/* Layer-restoration sweep — the WM-① methodology lesson, reused rather than
   re-authored: `forEachRestoration` is ticket 07's own sweep (fillFactors ×
   shieldCommits × recoveries). Nothing here is measured with a silently stubbed
   contradictory layer; each cell states which layers it restores.
   recoveryWhileMarching is inert for this loop (the loop drives the real movement
   contract turn by turn and takes recovery from js/fatigue's upkeep, not from the
   probe's march projection), so it is collapsed to avoid duplicate runs. */
function restorationSweep({ reps = 1, seed = SEED, bindings } = {}) {
  const cells = [];
  forEachRestoration((knobs) => {
    if (knobs.recoveryWhileMarching === false) return;
    const r = reread({ reps, seed, bindings, knobs: { fillFactor: knobs.fillFactor, shieldCommit: knobs.shieldCommit } });
    cells.push({ knobs: { fillFactor: knobs.fillFactor, shieldCommit: knobs.shieldCommit }, ...r });
  });
  return cells;
}

function runAll(opts = {}) {
  return {
    baseline: baseline(opts.baseline),
    reread: reread(opts.reread),
    restoration: restorationSweep(opts.restoration),
  };
}

module.exports = { SEED, BASELINE_REPS, LOOP_REPS, RECORDED, baseline, reread, restorationSweep, runAll };

/* ── Report (battery.js house format: h/sub/row, honest limits printed with the
   result, NOT MEASURED section, verdict deferred) ───────────────────────── */

function h(title) { console.log(`\n${'='.repeat(72)}\n${title}\n${'='.repeat(72)}`); }
function sub(t) { console.log(`\n--- ${t}`); }
function pct(r) { return r == null ? '   n/a' : (100 * r).toFixed(1).padStart(5) + '%'; }

if (require.main === module) {
  const quick = process.argv.includes('--quick');
  const loopReps = quick ? 1 : LOOP_REPS;
  const baseReps = quick ? 2 : BASELINE_REPS;

  h('METRIC 5 — fizzle re-read vs the L2 baseline (slice-2 spec §11)');
  console.log('QUESTION: does C1 (window read) + C2 (read-driven exit) close R14 at the source?');
  console.log('R14: the war system produces no decisive climax — the SPEC madmovie does not fire.');
  console.log('\nHONEST LIMITS (printed with every result — never inferred, never silent):');
  console.log('  · The CRISIS OVERLAY IS OFF, on both runs. That is the LIKE-FOR-LIKE choice:');
  console.log('    the recorded baseline is itself a crisis-OFF measurement (DESIGN-RISKS R14),');
  console.log('    and R14 asks about the crisis-OFF main arc. The overlay-ON axis is');
  console.log('    NOT MEASURED and is owned by ticket 11 (js/bot-exit is overlay-blind:');
  console.log('    it would sign whitePeace during total war, which CE-⑲/⑳ forbid).');
  console.log('  · Bot policy bounds proof power: a fizzle FOUND is real; a fizzle NOT found');
  console.log('    is not proof that decisive war is reachable by a skilled player (the R14');
  console.log('    bot caveat, unchanged).');
  console.log('  · Every 가안 knob in this loop is harness-tier, never a seal candidate:');
  console.log(`    ${JSON.stringify(W.HARNESS)}`);
  console.log('  · The loop has no raid primary, so settlement bundles are cession-only');
  console.log('    (raidLoot = 0). The baseline prices raid loot into the same arithmetic.');
  console.log('  · VERDICT is the user\'s. This sheet reports needles and decides nothing.');

  const b = baseline({ reps: baseReps });
  sub(`BASELINE — L2 cradle re-run (seed ${SEED}, crisis OFF, ${baseReps} reps = ${b.matches} matches, deterministic)`);
  console.log(`  re-derived from ${b.warEnds.toLocaleString()} war ends. Recorded prose target: ${RECORDED.whitePeacePct}% white peace,`);
  console.log(`  ${RECORDED.annihilationsPerMatch} annihilations/match, decided% ${RECORDED.decidedPct} — ${RECORDED.source}`);
  console.log('\n  WHITE PEACE BY CAUSE (the ~77% is not one thing — attribute only after this split):');
  console.log(`    stallPeace   (the timer)                  ${pct(b.stallPeacePct)}`);
  console.log(`    refusePeace  (winner will not storm)      ${pct(b.refusePeacePct)}`);
  console.log(`    settle @ 0% material (empty bundle)       ${pct(b.emptyDealPct)}`);
  console.log(`    death-forced (eliminate :1026)            ${'  n/a'} — records NO cause; invisible here`);
  console.log(`    ────────────────────────────────────────────────`);
  console.log(`    white peace TOTAL (of RECORDED ends)      ${pct(b.whitePeacePct)}`);
  console.log(`    settle                                    ${pct(b.settlePct)}`);
  console.log(`    eliminate                                 ${pct(rate(b.byCause.eliminate || 0, b.warEnds))}`);
  console.log(`\n  wars started ${b.warsStarted.toLocaleString()} · recorded ends ${b.warEnds.toLocaleString()} · UNRECORDED ${b.unrecorded.toLocaleString()} (${pct(b.unrecordedPct).trim()})`);
  console.log(`  no material outcome, of wars STARTED       ${pct(b.noMaterialOutcomePct)}  <- the R14 sense`);
  console.log(`\n  eliminations/match ${b.eliminationsPerMatch.toFixed(3)} · decided% ${b.decidedPct.toFixed(3)} · wars/match ${b.warsPerMatch.toFixed(1)} · turns/match ${b.turnsPerMatch.toFixed(1)}`);
  console.log('  rung distribution (resolved deals, named by MATERIAL outcome): ' +
    (Object.keys(b.rungs).length ? Object.entries(b.rungs).map(([k, v]) => `${k} ${v}`).join(' · ') : 'none'));

  const r = reread({ reps: loopReps });
  sub(`RE-READ — the slice-2 loop (seed ${SEED}, crisis OFF, ${loopReps} reps = ${r.matches} matches, deterministic)`);
  console.log(`  ${r.warEnds.toLocaleString()} war ends. No stall timer exists in this loop BY CONSTRUCTION.`);
  console.log('\n  WAR ENDS BY CAUSE (partition — sums to 100%):');
  console.log(`    stallPeace                                ${pct(r.stallPeacePct)} — retired (no timer exists)`);
  console.log(`    settle, material transfer                 ${pct(r.settleMaterialPct)}`);
  console.log(`    settle, 0% rung = PRE-EMPTIVE WHITE PEACE ${pct(r.preemptiveWhitePeacePct)} — NEW; no L2 analogue`);
  console.log(`    refusePeace (winner's will, ported)       ${pct(r.refusePeacePct)}`);
  console.log(`    eliminate                                 ${pct(rate(r.byCause.eliminate || 0, r.warEnds))}`);
  console.log(`    unresolved (still running at the envelope) ${pct(r.unresolvedPct)} — see below`);
  console.log(`    participantEliminated (died elsewhere)    ${pct(r.participantEliminatedPct)}`);
  console.log(`    noFrontier (no reachable front left)      ${pct(r.noFrontierPct)}`);
  console.log(`    ────────────────────────────────────────────────`);
  console.log(`    white peace TOTAL (0% rung + refusePeace) ${pct(r.whitePeacePct)}`);
  console.log(`\n  wars started ${r.warsStarted.toLocaleString()} · recorded ends ${r.warEnds.toLocaleString()} · UNRECORDED ${r.unrecorded}`);
  console.log(`  no material outcome, of wars STARTED       ${pct(r.noMaterialOutcomePct)}  <- the R14 sense`);
  console.log('    Read this row, not the white-peace row alone. Retiring a timer does not');
  console.log('    make a fizzling war decisive — it makes it never end. `unresolved` is');
  console.log('    where the wars the stall timer used to close now go, so counting only');
  console.log('    named white peaces would score the retirement as a cure for the thing it');
  console.log('    merely renamed. Both runs use this same formula over wars STARTED.');
  console.log('    NOTE: a rung is a claim RATE, so at composite 0 every rung — `maximum`');
  console.log('    included — moves nothing. Deals are counted by MATERIAL outcome, not by');
  console.log('    the name the winner demanded. Demanded-vs-material below.');
  console.log(`\n  eliminations/match ${r.eliminationsPerMatch.toFixed(3)} (baseline's annihilation sense, but CONFOUNDED —`);
  console.log('    the two runs do not play the same number of turns; see SIDE BY SIDE)');
  console.log(`  annihilations/match ${r.annihilationsPerMatch.toFixed(3)} (섬멸 / BLOCKED rout — NO baseline analogue,`);
  console.log('    and knob-sensitive: it moves by ~30x across the restoration sweep below)');
  console.log(`  decisive battles/match ${r.decisivePerMatch.toFixed(2)} · engagements/match ${r.engagementsPerMatch.toFixed(1)} · wars/match ${r.warsPerMatch.toFixed(1)} · turns/match ${r.turnsPerMatch.toFixed(1)}`);
  console.log('  rung distribution (RESOLVED + MATERIAL — the winner\'s demand as capped by the');
  console.log('  loser\'s ceiling, then named for what it actually moved; never the ceiling): ');
  console.log('    ' + (Object.keys(r.rungs).length ? Object.entries(r.rungs).map(([k, v]) => `${k} ${v}`).join(' · ') : 'none'));
  console.log('    demanded (before the material test): ' +
    (Object.keys(r.demandedRungs).length ? Object.entries(r.demandedRungs).map(([k, v]) => `${k} ${v}`).join(' · ') : 'none'));

  sub('SIDE BY SIDE (rates; n differs — see reps above)');
  console.log('  metric                            baseline      re-read');
  console.log(`  NO MATERIAL OUTCOME % (R14 sense) ${pct(b.noMaterialOutcomePct)}       ${pct(r.noMaterialOutcomePct)}   <- the headline`);
  console.log(`    · white peace, named            ${pct(b.whitePeacePct)}       ${pct(r.whitePeacePct)}`);
  console.log(`    · of which the stall timer      ${pct(b.stallPeacePct)}       ${pct(r.stallPeacePct)}`);
  console.log(`    · wars that never ended         ${pct(b.unrecordedPct)}       ${pct(r.unresolvedPct)}`);
  console.log(`  wars/match                        ${b.warsPerMatch.toFixed(1).padStart(6)}       ${r.warsPerMatch.toFixed(1).padStart(6)}`);
  console.log(`  turns/match                       ${b.turnsPerMatch.toFixed(1).padStart(6)}       ${r.turnsPerMatch.toFixed(1).padStart(6)}   <- NOT equal; see below`);
  console.log(`  eliminations/match                ${b.eliminationsPerMatch.toFixed(3).padStart(6)}       ${r.eliminationsPerMatch.toFixed(3).padStart(6)}   <- CONFOUNDED; see below`);
  console.log(`  eliminations per match-turn       ${(b.eliminationsPerMatch / b.turnsPerMatch).toFixed(4).padStart(6)}       ${(r.eliminationsPerMatch / r.turnsPerMatch).toFixed(4).padStart(6)}`);
  console.log('\n  eliminations/match is NOT a clean delta and is not presented as one. The');
  console.log('  baseline ends 60-70% of its matches EARLY on the hegemony gate (it returns');
  console.log('  the moment a force ratio trips), while this loop has no such gate and plays');
  console.log('  the full envelope. Part of the gap is turns of opportunity, not lethality —');
  console.log('  the per-match-turn row divides that out crudely, and even it is not clean');
  console.log('  (the baseline\'s surviving matches are the undecided ones). Same confound');
  console.log('  that makes decided% incomparable; the discipline is applied to both.');

  const sweepReps = 1;
  const sweep = restorationSweep({ reps: sweepReps });
  sub('LAYER RESTORATION (ticket 07 forEachRestoration — nothing measured with a silently stubbed layer)');
  console.log(`  ${sweepReps} rep per cell (${sweep[0].matches} matches each) — the sweep costs a full run per cell, so it`);
  console.log('  runs thinner than the headline above. Its neutral cell (fill 0 / shieldCommit');
  console.log('  null) is the same world as the RE-READ but at fewer reps, so the two differ by');
  console.log('  sampling, not by mechanism — read the sweep for SHAPE across knobs, not for');
  console.log('  its absolute values.');
  console.log('  fill  shieldCommit   whitePeace%   annih/match   elim/match   decisive/match');
  for (const c of sweep)
    console.log(`  ${String(c.knobs.fillFactor).padEnd(5)} ${String(c.knobs.shieldCommit).padEnd(13)} ${pct(c.whitePeacePct)}        ${c.annihilationsPerMatch.toFixed(3)}        ${c.eliminationsPerMatch.toFixed(3)}        ${c.decisivePerMatch.toFixed(2)}`);

  sub('NOT MEASURED (machine limits — owed to later rungs, never silent)');
  console.log('  · Crisis overlay ON: bot-exit is overlay-blind (CE-⑳). Ticket 11 owns the');
  console.log('    open-rungs input; until it lands, an overlay-ON run would be invalid.');
  console.log('  · The baseline\'s death-forced white peace (tournament.js :1026) records no');
  console.log('    cause, so the baseline white-peace % is a FLOOR. The gap is bounded by');
  console.log(`    eliminations (${b.eliminationsPerMatch.toFixed(3)}/match) — small, but not zero.`);
  console.log('  · 섬멸 (BLOCKED rout) has no L2 baseline: tournament.js never counted it.');
  console.log('    The re-read number stands alone; it is not a delta.');
  console.log('  · Vassalage is out of js/bot-exit\'s walk by design (RULINGS ⑭) — the');
  console.log('    baseline can settle to vassalage, this loop cannot. Rung distributions');
  console.log('    are therefore not term-by-term comparable at that rung.');
  console.log('  · decided% IS NOT COMPARABLE and is therefore not differenced. The baseline');
  console.log('    decides a match by the HEGEMONY GATE (a force-ratio trip, match.js');
  console.log(`    hegemonyCheck; recorded ${RECORDED.decidedPct}). This loop has no hegemony gate — it`);
  console.log('    ends a match only when one realm is left standing. Two different questions');
  console.log(`    wearing one name (baseline ${b.decidedPct.toFixed(3)} vs loop ${r.decidedPct.toFixed(3)}); differencing them would be`);
  console.log('    a category error. Wiring the gate is a later ticket\'s call, not this one\'s.');
  console.log('  · λ disposition is neutral (0) on both sides; the fog-band personality axis');
  console.log('    is unswept.');
  console.log('  · 2 of the map\'s 17 authored crossings are STRAITS (r9_s0<->r10_s3,');
  console.log('    r4_s2<->r10_s3). This loop moves armies on the hex graph, which has no sea');
  console.log('    link, so those fronts are unreachable and those realm pairs never fight.');
  console.log('    The baseline\'s per-front abstraction has no such limit — it is a real');
  console.log('    divergence in the boards, narrowing this loop\'s war graph by ~12%.');
  console.log('  · capitalInReach diverges by necessity. The baseline reads it off its war');
  console.log('    STAGE machine (the conveyor ADR 0037 indicts); this loop asks a geographic');
  console.log('    question (is the army within one turn\'s march of the throne?). It feeds');
  console.log('    the sealed acceptance arithmetic on both sides, so the settlement mix is');
  console.log('    not term-by-term comparable — only the material outcome is.');
  console.log('  · The restoration sweep runs 1 rep/cell and the headline runs more; and the');
  console.log('    headline sits at the LEAST-restored cell (fill 0 / shieldCommit null).');
  console.log('    Annihilations are the knob-sensitive read — do not quote the headline');
  console.log('    figure as if the sweep agreed with it.');
  console.log('\nVERDICT: the user reads the needles (판정 grill). L2 values never final.\n');
}
