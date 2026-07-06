'use strict';
// PROTOTYPE — scenario battery over engine.js. Prints worked sheets.
// Run: npm run battery   |   node mockup/combat-calc/battery.js <sheet>

const { DIALS, lever, resolve, reserveAwaken } = require('./engine');
const { MATCH_DIALS, projectable, shieldMass, hegemonyCheck,
  presetBundle, expectedContinuedLoss, accepts } = require('./match');
const TOURNEY = require('./tournament');
const { FIXTURE_MAP } = require('./map-data.js');
const { loadMap } = require('./map-loader.js');
const { gateReport, viableBindings } = require('./map-gate.js');

const fmt = (n) => typeof n === 'number' && !Number.isInteger(n) ? n.toFixed(2) : String(n);
const men = (n) => `${Math.round(n).toLocaleString()}명(${(n / 100).toFixed(1)}부대)`;
function h(title) { console.log(`\n${'='.repeat(72)}\n${title}\n${'='.repeat(72)}`); }
function sub(t) { console.log(`\n--- ${t}`); }
function row(cols, widths) {
  console.log(cols.map((c, i) => String(c).padEnd(widths[i])).join(' | '));
}
function line(r, label) {
  console.log(`  ${label}: R=${r.R.toFixed(2)} vs thr ${r.threshold.toFixed(1)} → ${r.success ? 'SUCCESS' : 'FAIL'}${r.routed ? ` · ${r.routed} ROUTS` : ''}`);
  console.log(`    attack ${Math.round(r.attackPower)} (engaged ${r.engagedA}, lever ×${r.levA.toFixed(2)}${r.waterPen < 1 ? `, water ×${r.waterPen}` : ''}) / defense ${Math.round(r.defensePower)} (fort eff ×${r.effFort.toFixed(2)})`);
  console.log(`    blood: attacker −${r.lossA} (${(r.fracA * 100).toFixed(1)}%) · defender −${r.lossB}${r.survivorsB.dispersed ? ` +${r.survivorsB.dispersed} disperse` : ''}${r.survivorsB.escaped ? ` +${r.survivorsB.escaped} escape` : ''}`);
  for (const n of r.notes) console.log(`    ※ ${n}`);
}

// ---------------------------------------------------------------- Sheet 1
function myeongnyang() {
  h('SHEET 1 — 명량 confluence: strait 500 + lever ceiling + legendary terrain');
  console.log('Attacker 13,300 (133부대) Crossing · defender 1,300 (13부대), no fort.');
  console.log('Strait choke caps engaged attackers at 500; opposed strait penalty.');

  for (const water of ['strait', 'straitOpposed']) {
    sub(`water = ${water} (×${DIALS.water[water]})${water === 'straitOpposed' ? ' — candidate value' : ''}`);
    for (const commit of [20, 8, 0]) {
      const r = resolve({
        plan: 'Crossing',
        attacker: { stock: 13300, commit: 14 },
        defender: { stock: 1300, commit },
        terrain: 'legendary', water, chokeCap: 500,
      });
      line(r, `defender commit ${commit} (lever ×${lever(commit).toFixed(2)})`);
    }
  }

  sub('Attrition race: attacker clicks every turn (defender commit 20, opposed strait)');
  let def = 1300, waves = 0, attLoss = 0;
  while (waves < 12 && def > 0) {
    const r = resolve({
      plan: 'Crossing', attacker: { stock: 13300 - attLoss, commit: 14 },
      defender: { stock: def, commit: 20 }, terrain: 'legendary',
      water: 'straitOpposed', chokeCap: 500,
    });
    waves++; attLoss += r.lossA; def = r.stockAfterB;
    if (r.success) break;
    // M12 draft regen for the defender between turns (cap = starting garrison)
    def = Math.min(1300, Math.round(def + 1300 * DIALS.pulse.regenPerTurn));
  }
  console.log(`  after ${waves} waves: attacker has burned ${men(attLoss)}, defender at ${men(def)} — no breakthrough.`);

  sub('How small can the holding garrison be? (commit 20 vs commit 0, opposed strait, attacker commit 14)');
  for (const commit of [20, 0]) {
    let g = 100;
    while (g < 5000) {
      const r = resolve({
        plan: 'Crossing', attacker: { stock: 13300, commit: 14 },
        defender: { stock: g, commit }, terrain: 'legendary',
        water: 'straitOpposed', chokeCap: 500,
      });
      if (!r.success) break;
      g += 50;
    }
    console.log(`  minimum garrison that denies the headline at commit ${commit}: ~${men(g)}`);
  }
  console.log('  → NOTE the honest finding: the choke does most of the work; the lever');
  console.log('    ceiling decides how much the holder BLEEDS, not whether the line holds.');
  console.log('    Removal paths (port staging +500, naval control) are load-bearing.');
}

// ---------------------------------------------------------------- Sheet 2
function fortress() {
  h('SHEET 2 — Fortress economics: storm vs siege-erosion vs bypass-starvation');
  const D = { stock: 1000, commit: 8 };
  const site = { terrain: 'pass', fort: 'fortress' }; // 2.0 × 2.4 = 4.8 world product
  console.log('Site: pass(×2.0) + fortress(×2.4), garrison 1,000 commit 8. Attacker 6,000.');

  sub('Path A — immediate Swift storm (wall cap 1,500)');
  line(resolve({ plan: 'Swift', attacker: { stock: 6000, commit: 8 }, defender: { ...D }, ...site }),
    'storm commit 8');
  line(resolve({ plan: 'Swift', attacker: { stock: 6000, commit: 20 }, defender: { ...D }, ...site }),
    'storm commit 20 (everything)');

  sub('Path B — DP erosion then storm');
  let stamps = 0, att = 6000, defs = 1000, turn = 0, bloodA = 0, bloodB = 0;
  while (turn < 8) {
    turn++;
    const fortNow = Math.max(1, DIALS.fort.fortress - stamps * 0.3);
    if (fortNow <= 1.3) { // walls near-breached: storm
      const r = resolve({ plan: 'Swift', attacker: { stock: att, commit: 8 }, defender: { stock: defs, commit: 8 }, ...site, erosionStamps: stamps });
      line(r, `T${turn} STORM (fort eroded to ×${fortNow.toFixed(1)}, cap ${1500 + stamps * 500})`);
      bloodA += r.lossA; bloodB += r.lossB + r.survivorsB.dispersed;
      break;
    }
    const r = resolve({ plan: 'DP', attacker: { stock: att, commit: 8 }, defender: { stock: defs, commit: 8 }, ...site, erosionStamps: stamps });
    const step = r.success ? (r.margin >= 0.5 ? 2 : 1) : 0;
    stamps += step;
    att = r.stockAfterA; defs = Math.min(1000, r.stockAfterB + Math.round(1000 * 0.1));
    bloodA += r.lossA; bloodB += r.lossB;
    console.log(`  T${turn} DP: R=${r.R.toFixed(2)} ${r.success ? `erosion −${(step * 0.3).toFixed(1)}` : 'FAIL'} → fort ×${Math.max(1, 2.4 - stamps * 0.3).toFixed(1)} · blood A−${r.lossA}/B−${r.lossB} (regen +10%)`);
  }
  console.log(`  totals: ${turn} turns, attacker blood ${bloodA}, defender ${bloodB}`);

  sub('Path C — bypass + Supply Interdiction starvation (M12 draft clock)');
  console.log('  T1: SI cuts the supply route (rear skirmish, thr 1.3 — assumed clean).');
  console.log('  T2: stage 1 buffer. T3: stage 2 — attack-incapable, −10%/turn.');
  console.log('  T5: stage 3 — walls unmanned (fort ×1.0), effective ×0.5, garrison ~810.');
  const r5 = resolve({ plan: 'Swift', attacker: { stock: 6000, commit: 8 }, defender: { stock: 810, commit: 8, starvationStage: 3 }, ...site, defenderIsolated: true });
  line(r5, 'T5 storm of the starving fortress');
  console.log('  totals: 5 turns, near-zero attacker blood, army pinned 4 turns (opportunity cost).');

  sub('Path D — Encirclement harvest (isolation gate held to T5, R ≥ 2.2 via starvation)');
  const r6 = resolve({ plan: 'Encirclement', attacker: { stock: 6000, commit: 8 }, defender: { stock: 810, commit: 8, starvationStage: 3 }, ...site, defenderIsolated: true });
  line(r6, 'T5 annihilation click');
  console.log('  → same clock as C, cheapest blood per erasure, but burns inheritable manpower.');
}

// ---------------------------------------------------------------- Sheet 3
function raid() {
  h('SHEET 3 — Raid vs sortie (defender-triggered interception)');
  console.log('Sector: forest(×1.2), garrison 800, usable value 100%. No walls in a raid contest.');
  sub('Case 1 — monster raid 1,500, garrison huddles (no sortie)');
  console.log('  no engagement occurs; burn stamps apply uncontested: usable −15%p→−30%p');
  console.log('  (commit/margin-scaled), loot = 50% of destroyed value. Blood: 0.');
  sub('Case 2 — monster raid 1,500, garrison sorties (chosen battle)');
  line(resolve({ plan: 'Raid', attacker: { stock: 1500, commit: 8 }, defender: { stock: 800, commit: 8 }, terrain: 'forest' }), 'sortie into a monster raid');
  sub('Case 3 — small raid 600, garrison sorties');
  line(resolve({ plan: 'Raid', attacker: { stock: 600, commit: 8 }, defender: { stock: 800, commit: 8 }, terrain: 'forest' }), 'interception of a small raid');
  sub('Case 4 — small raid 600, garrison huddles');
  console.log('  burn stamps land uncontested. The defender CHOSE to eat −15%p rather than bleed.');
  console.log('  → sortie is a real decision priced by the forecast card, not an auto-response.');
}

// ---------------------------------------------------------------- Sheet 4
function delaying() {
  h('SHEET 4 — Delaying overselection check: standing vs delaying across R');
  console.log('Defender 1,500 commit 8 on hills(×1.2), no fort. Attacker Swift, commit 8, size sweeps.');
  console.log('(Open rule flag: does a delaying defender keep a fort multiplier? Assumed NO here —');
  console.log(' refusal abandons the works. Needs a user ruling if a fort case matters.)');
  const widths = [22, 26, 44];
  row(['attacker (raw R vs std)', 'STANDING outcome', 'DELAYING outcome'], widths);
  for (const attStock of [900, 1500, 2400, 3600, 5400]) {
    const std = resolve({ plan: 'Swift', attacker: { stock: attStock, commit: 8 }, defender: { stock: 1500, commit: 8 }, terrain: 'hills' });
    const del = resolve({ plan: 'Swift', attacker: { stock: attStock, commit: 8 }, defender: { stock: 1500, commit: 8, delaying: true }, terrain: 'hills' });
    const so = `${std.success ? 'TAKEN' : 'held'} A−${std.lossA}/D−${std.lossB}${std.routed ? ` ${std.routed[0].toUpperCase()}ROUT` : ''}`;
    const dl = `${del.success ? 'TAKEN' : 'not taken'} A−${del.lossA}/D−${del.lossB}${del.survivorsB.escaped ? ` esc${del.survivorsB.escaped}` : ''}${del.routed === 'attacker' ? ' AROUT' : ''}`;
    row([`${attStock} (R=${std.R.toFixed(2)})`, so, dl], widths);
  }
  console.log('\n  Readings: standing SHATTERS a weak attacker (rout at R≤~0.52) and bleeds a');
  console.log('  strong one at full rate; delaying halves both directions, never repels');
  console.log('  decisively, and buys +0.3 threshold shield + guaranteed escape.');
  console.log('  Overselection risk exists exactly where the defender was going to lose anyway.');
  sub('Escape-hunting counter: same delaying defender vs Flanking (thr 1.6+0.3)');
  line(resolve({ plan: 'Flanking', attacker: { stock: 5400, commit: 8 }, defender: { stock: 1500, commit: 8, delaying: true }, terrain: 'hills' }), 'Flanking vs delaying');
}

// ---------------------------------------------------------------- Sheet 5
function grinding() {
  h('SHEET 5 — Grinding-dominance invariant: DP success vs deliberate Swift fail');
  console.log('Attacker 3,000 commit 8 vs garrison sweeps; plains. Same curve, same blood — the');
  console.log('question is what else each click buys.');
  const widths = [10, 30, 42];
  row(['R', 'Swift deliberate-fail buys', 'DP at the same R buys'], widths);
  for (const defStock of [2700, 2400, 2100]) {
    const sw = resolve({ plan: 'Swift', attacker: { stock: 3000, commit: 8 }, defender: { stock: defStock, commit: 8 }, terrain: 'plains' });
    const dp = resolve({ plan: 'DP', attacker: { stock: 3000, commit: 8 }, defender: { stock: defStock, commit: 8 }, terrain: 'plains' });
    row([sw.R.toFixed(2),
      `blood A−${sw.lossA}/D−${sw.lossB}, nothing`,
      `${dp.success ? `same blood + erosion −${dp.margin >= 0.5 ? '0.6' : '0.3'} + usable −5%p` : `blood only (R below 1.1)`}`], widths);
  }
  console.log('\n  Low-commit poking check (commit 2 → lever ×1.13, whole stock bleeds):');
  const poke = resolve({ plan: 'Swift', attacker: { stock: 3000, commit: 2 }, defender: { stock: 3600, commit: 8 }, terrain: 'plains' });
  line(poke, 'cheap poke');
  console.log('  → the poke saves 6 points and pays for them in bodies; DP dominates every');
  console.log('    deliberately-failing plan wherever deliberate failure tempts (R ≥ 1.1).');
}

// ---------------------------------------------------------------- Sheet 6
function feint() {
  h('SHEET 6 — Reserve & feint geography — RE-RUN under ruling ⑥ (2026-07-05)');
  console.log('Province: A(garrison 600), B(garrison 500), depot C(1,200); route-connected');
  console.log('stock outside A = 1,700. Attacker 2,000 at each approach, hills(×1.2).');
  console.log('Movement schedule (M9, ruled): 1 pt awakens 12.5% of the province\'s');
  console.log('route-connected stock; the same bound points act as the emergency lever');
  console.log('(1:1, knee-capped ×1.5). Awakened bodies fight ×0.5 this turn, then stay.');

  const provinceStock = 1700; // B 500 + C 1,200
  sub('Reserve bet sweep: T1 attack on A → T2 follow-up on the thinned B');
  const widths = [7, 9, 40, 36];
  row(['points', 'awakened', 'T1 at A', 'T2 at B (garrison left)'], widths);
  for (const pts of [0, 2, 4, 6, 8]) {
    const awakened = reserveAwaken(provinceStock, pts);
    const r1 = resolve({ plan: 'Swift', attacker: { stock: 2000, commit: 8 },
      defender: { stock: 600, commit: pts, reserveStock: awakened, defenderReserveLever: pts > 0 },
      terrain: 'hills' });
    const bLeft = 500 - Math.round(500 * awakened / provinceStock);
    const r2 = resolve({ plan: 'Swift', attacker: { stock: 2000, commit: 8 },
      defender: { stock: bLeft, commit: 0 }, terrain: 'hills' });
    row([pts, awakened,
      `R=${r1.R.toFixed(2)} ${r1.success ? 'A TAKEN' : 'A HELD'} A−${r1.lossA}/D−${r1.lossB}`,
      `${bLeft} · R=${r2.R.toFixed(2)} ${r2.success ? 'B taken' : 'B held'}`], widths);
  }
  console.log('\n  → the bet space closes at 0–8 as designed: awakening fraction AND lever');
  console.log('    both saturate at the knee. The feint payoff (T2 vs stripped B) now');
  console.log('    scales with the defender\'s own bet size — deeper insurance at A digs');
  console.log('    the hole at B deeper. Attacker skill gate unchanged: scout the drain.');
  sub("Route tooth: SI cut C–A beforehand → route-connected stock drops to B's 500");
  const cut = reserveAwaken(500, 8);
  const rc = resolve({ plan: 'Swift', attacker: { stock: 2000, commit: 8 },
    defender: { stock: 600, commit: 8, reserveStock: cut, defenderReserveLever: true }, terrain: 'hills' });
  line(rc, `8 pts on a cut province (awakens only ${cut})`);
  console.log('  (routeDisruption second tooth, M9 — interdiction suppresses reserves.)');
}

// ---------------------------------------------------------------- Sheet 7
function tempo() {
  h('SHEET 7 — Full-match tempo sheet (gates M12)');
  console.log('War script: Realm A (8,000 committed) invades Realm B (total army 4,000:');
  console.log('1,500 garrison the border fortress [fortress ×2.4, hills ×1.2], 2,500 field');
  console.log('reserve behind; 3 ordinary sectors; walled capital garrison 1,500).');
  console.log('One primary/turn each; M12 draft regen +10% applied to defenders.\n');

  const ledger = [];
  let t = 0;
  const log = (phase, what) => { t++; ledger.push([`T${t}`, phase, what]); };

  log('mobilize', 'A concentrates — tension band jumps (B readiness clock starts, lead 1–3 turns)');
  log('mobilize', 'A primary Reconnaissance: border fortress estimate band ±24% → ±12%');

  // --- Shield-break: fortress 2.4 on hills 1.2, garrison 1,500 commit 8
  let stamps = 0, fortG = 1500, aArmy = 8000, aBlood = 0;
  for (;;) {
    const site = { terrain: 'hills', fort: 'fortress', erosionStamps: stamps };
    const fortNow = Math.max(1, 2.4 - stamps * 0.3);
    if (fortNow <= 1.5 + 1e-9) {
      const r = resolve({ plan: 'Swift', attacker: { stock: aArmy, commit: 8 }, defender: { stock: fortG, commit: 8 }, ...site });
      aArmy = r.stockAfterA; aBlood += r.lossA;
      log('shield-break', `STORM (fort ×${fortNow.toFixed(1)}, cap ${1500 + stamps * 500}): R=${r.R.toFixed(2)} ${r.success ? 'taken' : 'FAIL'}${r.routed === 'defender' ? ', garrison routs' : ''} (A−${r.lossA}/B−${r.lossB})`);
      if (r.success) break;
      fortG = Math.min(1500, r.stockAfterB + 150);
      continue;
    }
    const r = resolve({ plan: 'DP', attacker: { stock: aArmy, commit: 8 }, defender: { stock: fortG, commit: 8 }, ...site });
    stamps += r.success ? (r.margin >= 0.5 ? 2 : 1) : 0;
    aArmy = r.stockAfterA; aBlood += r.lossA;
    fortG = Math.min(1500, Math.max(0, r.stockAfterB) + 150);
    log('shield-break', `DP erosion: R=${r.R.toFixed(2)} → fort ×${Math.max(1, 2.4 - stamps * 0.3).toFixed(1)}${r.routed === 'defender' ? ' — garrison ROUTS out of the works' : ''} (A−${r.lossA}/B−${r.lossB})`);
    if (r.routed === 'defender') { fortG = Math.max(0, r.stockAfterB) + 150; }
  }

  // --- Decision: field battles until B's field army is destroyed or A stalls
  let bField = 2500;
  while (bField > 400) {
    const r = resolve({ plan: 'Swift', attacker: { stock: aArmy, commit: 14 }, defender: { stock: bField, commit: 14 }, terrain: 'plains' });
    aArmy = r.stockAfterA; aBlood += r.lossA;
    const destroyed = r.routed === 'defender';
    log('decision', `field battle: R=${r.R.toFixed(2)} ${destroyed ? `B ROUTS — field army destroyed (B−${r.lossB}, ${r.survivorsB.dispersed} disperse)` : r.success ? `B pushed back (B−${r.lossB})` : `stalled (B−${r.lossB})`} (A−${r.lossA})`);
    bField = destroyed ? 0 : Math.min(2500, r.stockAfterB + 250);
    if (!r.success && r.R < 1.2) { log('decision', 'war stalls — A below usable superiority'); break; }
  }

  // --- Cascade: ordinary sectors fall in one click each
  if (bField === 0) {
    for (let i = 1; i <= 3; i++) {
      const r = resolve({ plan: 'Swift', attacker: { stock: aArmy, commit: 8 }, defender: { stock: 500, commit: 0 }, terrain: 'plains' });
      aArmy = r.stockAfterA; aBlood += r.lossA;
      log('cascade', `ordinary sector ${i}: R=${r.R.toFixed(2)} taken in one click (A−${r.lossA})`);
    }
    // --- Capital: walls 1.8, garrison 1,500, max defense commit
    let capG = 1500, capStamps = 0;
    for (;;) {
      const site = { terrain: 'plains', fort: 'walls', erosionStamps: capStamps };
      const fortNow = Math.max(1, 1.8 - capStamps * 0.3);
      if (fortNow <= 1.2 + 1e-9) {
        const r = resolve({ plan: 'Swift', attacker: { stock: aArmy, commit: 14 }, defender: { stock: capG, commit: 14 }, ...site });
        aArmy = r.stockAfterA; aBlood += r.lossA;
        log('capital', `capital STORM: R=${r.R.toFixed(2)} ${r.success ? 'TAKEN — decision point reached' : 'FAIL'} (A−${r.lossA}/B−${r.lossB})`);
        break;
      }
      const r = resolve({ plan: 'DP', attacker: { stock: aArmy, commit: 8 }, defender: { stock: capG, commit: 14 }, ...site });
      capStamps += r.success ? (r.margin >= 0.5 ? 2 : 1) : 0;
      aArmy = r.stockAfterA; aBlood += r.lossA;
      capG = Math.min(1500, Math.max(0, r.stockAfterB) + 150);
      log('capital', `DP on capital walls: R=${r.R.toFixed(2)} → ×${Math.max(1, 1.8 - capStamps * 0.3).toFixed(1)}${r.routed === 'defender' ? ' — garrison ROUTS' : ''} (A−${r.lossA}/B−${r.lossB})`);
    }
  }

  const widths = [4, 13, 84];
  row(['turn', 'phase', 'event'], widths);
  for (const l of ledger) row(l, widths);
  console.log(`\n  War settles in ${t} turns. Attacker blood total ${men(aBlood)} of 8,000 (${(aBlood / 80).toFixed(0)}%).`);
  console.log('  Match arithmetic: buildup ~4 + war ~' + t + ' + consolidation ~4 = ~' + (8 + t) + ' turns —');
  console.log('  one full war + recovery fits a 15–25 turn match; a second war starts but');
  console.log('  cannot finish. Annexation-by-occupation of a WHOLE realm in one match only');
  console.log('  happens through post-decision settlement — the match-arc hole, as diagnosed.');

  sub('Counterfactual — A invades at parity (6,000 vs the same shield)');
  const cf = resolve({ plan: 'DP', attacker: { stock: 6000, commit: 8 }, defender: { stock: 1500, commit: 8 }, terrain: 'hills', fort: 'fortress' });
  line(cf, 'first siege turn at parity');
  console.log('  → at parity the shield bleeds the attacker ~8%/turn while eroding slowly;');
  console.log('    the attacker drops below field superiority before the wall opens.');
  console.log('    Wars are decided by the pre-war mass ratio at the shield (~1.7+ needed) —');
  console.log('    the buildup turns ARE the war. (Tempo reading for the user.)');
}

// ---------------------------------------------------------------- Sheet 8
function timeline() {
  h('SHEET 8 — Full-runtime fun audit: one victorious nation, turn by turn');
  console.log('Seat: 서령 (shielded periphery realm, 진-pattern arc). World: 5 realms —');
  console.log('중원 (rich center, multi-front exposure), 서령 (player), 3 others.');
  console.log('Arc: standoff → War 1 vs weak neighbor 남곡 → realignment → War 2 vs');
  console.log('중원 → hegemony settlement. Battles engine-computed; peace turns show');
  console.log('the decision each turn demands. Wall clock at 1.5 and 2.0 min/turn.\n');

  const ledger = [];
  let t = 0;
  const log = (phase, decision, event) => { t++; ledger.push([`T${t}`, phase, decision, event]); };

  // --- Opening standoff (the board is fully adjacent from T1)
  log('standoff', '포스처+읽기', '중원 tension bands quiet; 남곡 shield thin (estimate ±24%) — target read begins');
  log('standoff', '정찰 vs 건설', 'primary Recon on 남곡 (band → ±12%); surplus → own shield field works +0.1');
  log('standoff', '보험 지리', 'reserve set toward 중원 border; surplus scouting keeps center watch (+0.10 saturating)');

  // --- War 1 vs 남곡: fieldworks shield, small armies
  let my = 3500, myBlood = 0;
  log('buildup', '동원 결단', 'concentration at 남곡 border — my tension band rings (readiness clock starts vs me too)');
  let s = 0, g1 = 800;
  for (;;) {
    const fortNow = Math.max(1, 1.3 - s * 0.3);
    if (fortNow <= 1.0 + 1e-9) break;
    const r = resolve({ plan: 'DP', attacker: { stock: my, commit: 8 }, defender: { stock: g1, commit: 8 }, terrain: 'hills', fort: 'fieldworks', erosionStamps: s });
    s += r.success ? (r.margin >= 0.5 ? 2 : 1) : 0;
    my = r.stockAfterA; myBlood += r.lossA; g1 = Math.min(800, Math.max(0, r.stockAfterB) + 80);
    log('war 1', '커밋 핀 (공성)', `DP on 남곡 field works: R=${r.R.toFixed(2)} → fort ×${Math.max(1, 1.3 - s * 0.3).toFixed(1)}${r.routed === 'defender' ? ' — garrison routs' : ''} (A−${r.lossA}/B−${r.lossB})`);
    if (r.routed === 'defender') { g1 = Math.max(0, r.stockAfterB) + 80; break; }
  }
  const f1 = resolve({ plan: 'Swift', attacker: { stock: my, commit: 14 }, defender: { stock: 1600, commit: 14 }, terrain: 'plains' });
  my = f1.stockAfterA; myBlood += f1.lossA;
  log('war 1', '결전 커밋 (밴드 상단?)', `field battle vs 남곡 army: R=${f1.R.toFixed(2)}${f1.routed === 'defender' ? ' — army destroyed' : ''} (A−${f1.lossA}/B−${f1.lossB})`);
  const c1 = resolve({ plan: 'Swift', attacker: { stock: my, commit: 8 }, defender: { stock: 400, commit: 0 }, terrain: 'plains' });
  my = c1.stockAfterA; myBlood += c1.lossA;
  log('war 1', '캐스케이드 vs 정산', `남곡 interior falls (R=${c1.R.toFixed(1)}); 남곡 sues for peace — settlement menu opens`);
  log('war 1', '정산 조건 결정', 'accept vassalage + border sectors (annexing all would burn manpower + time) — WAR 1 SETTLED');

  // --- Realignment: the density-risk zone
  log('realign', '수복 메뉴 트리아지', 'Recovery menu: fort +0.4 at new border vs route flip vs usable +10pp — one primary buys one');
  log('realign', '읽기 (세계가 움직임)', '중원 tension vs 동평 rises to band 3 — their war, my opportunity window forming');
  log('realign', '개입 vs 성장', '중원–동평 war breaks out; choose: raid 중원 rear (sub-threshold) or build 2nd army');
  log('realign', '예비대 재배치', '중원 border reserve re-anchored; scouting the drained sectors as 중원 commits east');

  // --- War 2 vs the weakened, exposed center
  log('buildup', '동원 결단 (타이밍 읽기)', '중원 field army worn by 동평 war — irreversibility window read; concentration begins');
  let s2 = 0, g2 = 1500; my = Math.min(6000, my + 2400); // war-1 spoils + regen + new levies
  log('buildup', '질량비 확인', `my mass ${my} vs center shield garrison ${g2} behind fortress — shield ratio cleared (~1.7+)`);
  for (;;) {
    const fortNow = Math.max(1, 2.4 - s2 * 0.3);
    if (fortNow <= 1.5 + 1e-9) {
      const r = resolve({ plan: 'Swift', attacker: { stock: my, commit: 8 }, defender: { stock: g2, commit: 8 }, terrain: 'hills', fort: 'fortress', erosionStamps: s2 });
      my = r.stockAfterA; myBlood += r.lossA;
      log('war 2', '강습 커밋', `STORM center border fortress (fort ×${fortNow.toFixed(1)}): R=${r.R.toFixed(2)} ${r.success ? 'taken' : 'FAIL'} (A−${r.lossA}/B−${r.lossB})`);
      if (r.success) break;
      g2 = Math.min(1500, Math.max(0, r.stockAfterB) + 150);
      continue;
    }
    const r = resolve({ plan: 'DP', attacker: { stock: my, commit: 8 }, defender: { stock: g2, commit: 8 }, terrain: 'hills', fort: 'fortress', erosionStamps: s2 });
    s2 += r.success ? (r.margin >= 0.5 ? 2 : 1) : 0;
    my = r.stockAfterA; myBlood += r.lossA; g2 = Math.min(1500, Math.max(0, r.stockAfterB) + 150);
    log('war 2', '커밋 핀 (공성)', `DP on center fortress: R=${r.R.toFixed(2)} → fort ×${Math.max(1, 2.4 - s2 * 0.3).toFixed(1)}${r.routed === 'defender' ? ' — garrison routs out' : ''} (A−${r.lossA}/B−${r.lossB})`);
    if (r.routed === 'defender') { g2 = Math.max(0, r.stockAfterB) + 150; }
  }
  const f2 = resolve({ plan: 'Swift', attacker: { stock: my, commit: 14 }, defender: { stock: 2800, commit: 14 }, terrain: 'plains' });
  my = f2.stockAfterA; myBlood += f2.lossA;
  log('war 2', '결전 커밋', `decisive battle vs worn center army: R=${f2.R.toFixed(2)}${f2.routed === 'defender' ? ' — center field army destroyed' : ''} (A−${f2.lossA}/B−${f2.lossB})`);
  for (let i = 1; i <= 2; i++) {
    const r = resolve({ plan: 'Swift', attacker: { stock: my, commit: 8 }, defender: { stock: 600, commit: 0 }, terrain: 'plains' });
    my = r.stockAfterA; myBlood += r.lossA;
    log('war 2', '캐스케이드', `center interior sector ${i} falls (R=${r.R.toFixed(1)}) — victory lap (A−${r.lossA})`);
  }
  log('decision', '패권 정산 판단', 'irreversibility trips: no remaining coalition overturns the balance — settlement opens');
  log('decision', '수락 vs 압박', 'accept: center capitulates, 동평/북하 acknowledge hegemony — MATCH ENDS (settlement concluded)');

  const widths = [4, 9, 26, 78];
  row(['turn', 'phase', 'decision demanded', 'event'], widths);
  for (const l of ledger) row(l, widths);
  console.log(`\n  Match length: ${t} turns. My blood across two wars: ${men(myBlood)}.`);
  console.log(`  Wall clock: ${t} × 1.5min = ${(t * 1.5).toFixed(0)}min | × 2.0min = ${(t * 2).toFixed(0)}min (envelope 30–40, hard 60)`);
  console.log('  Density audit: every turn above carries a named decision; the realignment');
  console.log('  stretch survives ONLY if the world moves without the player (center-동평');
  console.log('  war) — proactive AI wars between AI realms are load-bearing for mid-match fun.');
}

// ---------------------------------------------------------------- Sheet 9
function manpower() {
  h('SHEET 9 — Economy→mass dials (M13): cap, recruitment rate, pool size');
  console.log('Template mid realm: 6 provinces, garrisons 4,200 + field army 4,500');
  console.log('(initial military 8,700). Dials under test: national standing cap 6,000;');
  console.log('모병 +10% of cap/turn (600/turn); pool = 1.5 × initial military = 13,050.\n');

  sub('Check 1 — buildup & recovery windows (+600/turn toward cap 6,000)');
  for (const start of [4500, 4200, 3000, 1500]) {
    const turns = Math.ceil((6000 - start) / 600);
    console.log(`  standing ${start} → cap: ${turns} turns of recruitment primaries`);
  }
  console.log('  → intact realm reaches war-ready in 2–3 primaries (matches the arc\'s');
  console.log('    buildup phase); a shattered realm needs 5–8 — the D3 counterattack');
  console.log('    window generalized to the national scale.');

  sub('Check 2 — the free-rider window (11-turn war between rivals, I sit out)');
  const riderGain = Math.min(6000 - 4500, 600 * 11);
  const riderSpareTurns = 11 - Math.ceil((6000 - 4500) / 600);
  console.log(`  my growth: +${riderGain} (cap-bound after ${Math.ceil((6000 - 4500) / 600)} turns) → ${11 - Math.ceil((6000 - 4500) / 600)} primaries left free`);
  console.log('  fighters (sheet 7 run): winner −1,132 dead, loser army destroyed.');
  console.log('  → FINDING: the cap converts free-riding into READINESS + ' + riderSpareTurns + ' spare');
  console.log('    primaries (scouting/forts/recovery), never into unbounded mass.');
  console.log('    Raising the cap itself = economy development — the future long lever.');

  sub('Check 3 — pool ledger across the tempo-sheet war (finite blood)');
  const pool = 13050;
  const winnerDead = 1132;                      // sheet 7: attacker blood (curve+rout, all dead)
  const loserDead = 5000, loserDispersed = 800; // sheet 7: fort+field+capital losses, ~85% dead
  console.log(`  winner: pool ${pool} − ${winnerDead} dead = ${pool - winnerDead} (−${(winnerDead / pool * 100).toFixed(1)}%) — rebuild to cap: trivial`);
  console.log(`  loser: −${loserDead} dead (+${loserDispersed} dispersed RETURN to pool), and ceded`);
  console.log('  provinces take their pool along (pool is per-province) → remaining realm');
  const loserPoolLeft = Math.round((pool - loserDead + loserDispersed) * 0.45); // ~55% of land ceded/vassalized
  console.log(`  holds ~${loserPoolLeft} pool on ~45% of the land — can refill a garrison line,`);
  console.log('  CANNOT field a second 6,000 army this match. Blood is permanent; the match');
  console.log('  self-terminates toward thin late armies. Third full war: impossible. ✓');

  sub('Check 4 — recruitment price sanity vs raid/conquest income (M8 anchors)');
  console.log('  proposed price: 1 부대(100명) = 0.5 sector-turn yield');
  console.log('  raid loot ≈ 1.5 sector-turn yield (M8) → funds ~3 부대 — real but small');
  console.log('  conquered sector ≈ 1 yield/turn permanent → ~2 부대/turn forever');
  console.log('  → conquest ≫ raid for army-building, consistent with M8\'s ~30:1. ✓');

  console.log('\n  Dial verdicts to confirm: cap 6,000 (mid realm; center ~9,000 scales with');
  console.log('  economy), recruit +10%/turn, pool ×1.5 initial military, 부대 = 0.5 yield.');
}

// ---------------------------------------------------------------- Sheet 10
function hegemony() {
  h('SHEET 10 — Hegemony-check full-match ledger (결정점 computed end-to-end)');
  console.log('5 realms, sheet-8 arc, masses calibrated to sheets 7–9. Field armies under');
  console.log('the M13 national cap; garrisons local; 북하 is strait-locked (hermit test).');
  console.log('Check each turn for candidate 서령: leadership ∧ unassailability + 은둔국 조항.');
  console.log(`Defaults: ratio ${MATCH_DIALS.shieldRatio}, base '${MATCH_DIALS.shieldBase}', floor ${MATCH_DIALS.projectionFloor}, window ${MATCH_DIALS.regenWindow}t, chokeFlow ${MATCH_DIALS.chokeFlow}.\n`);

  // fronts = per-neighbor border-shield garrisons (ruling ⑨ facing-front
  // reading; in the real game this is derived from adjacency per turn)
  const world = () => ([
    { name: '서령', field: 4500, fieldCap: 6000, garrisons: 4200, shieldGarrisons: 1200, fronts: { 남곡: 600, 중원: 600 }, exits: [{ cap: Infinity }], alive: true, vassalOf: null, atWar: false },
    { name: '중원', field: 7000, fieldCap: 9000, garrisons: 5600, shieldGarrisons: 1800, fronts: { 서령: 600, 동평: 600, 남곡: 600 }, exits: [{ cap: Infinity }, { cap: Infinity }, { cap: Infinity }], alive: true, vassalOf: null, atWar: false },
    { name: '남곡', field: 2500, fieldCap: 4500, garrisons: 3000, shieldGarrisons: 600, fronts: { 서령: 300, 중원: 300 }, exits: [{ cap: Infinity }], alive: true, vassalOf: null, atWar: false },
    { name: '동평', field: 4500, fieldCap: 6000, garrisons: 4200, shieldGarrisons: 1200, fronts: { 중원: 600, 북하: 600 }, exits: [{ cap: Infinity }], alive: true, vassalOf: null, atWar: false },
    { name: '북하', field: 5000, fieldCap: 6000, garrisons: 3000, shieldGarrisons: 800, fronts: { 동평: 800 }, exits: [{ cap: 500 }], alive: true, vassalOf: null, atWar: false },
  ]);

  // Scripted arc (per-turn mass deltas calibrated to the sheet-7/8 engine
  // runs — this sheet re-fights nothing; it prices the balance):
  // T5–8 war 1 (서령→남곡, rout T8) · T9 전쟁 정산 (복속+할양 600)
  // T10–13 중원–동평 AI war (mutual wear −700/t, white peace)
  // T14–19 war 2 (siege wear, 결전 T19 destroys 중원 field army)
  // T20–21 cascade (중원 garrisons shed 800/t) · T22 패권 정산 후보 (복속+할양 1,200)
  function runArc(D) {
    const R = world(); const g = (n) => R.find((r) => r.name === n);
    const rows = []; let tripTurn = null;
    for (let t = 1; t <= 26; t++) {
      if (t === 5) { g('서령').atWar = g('남곡').atWar = true; }
      if (t >= 5 && t <= 8) { g('서령').field -= 150; g('남곡').field = Math.max(300, g('남곡').field - (t === 8 ? 1900 : 550)); }
      if (t === 9) {
        g('남곡').vassalOf = '서령'; g('남곡').garrisons -= 600; g('서령').garrisons += 600;
        g('서령').atWar = g('남곡').atWar = false;
      }
      if (t === 10) { g('중원').atWar = g('동평').atWar = true; }
      if (t >= 10 && t <= 13) { g('중원').field -= 700; g('동평').field -= 700; }
      if (t === 13) { g('동평').atWar = false; } // white peace; 중원 stays mobilized
      if (t === 14) { g('서령').atWar = true; }
      if (t >= 14 && t <= 18) { g('서령').field -= 150; g('중원').field -= 300; }
      if (t === 19) { g('서령').field -= 400; g('중원').field = 700; }
      if (t === 20 || t === 21) { g('서령').field -= 50; g('중원').garrisons -= 800; }
      if (t === 22) {
        g('중원').vassalOf = '서령'; g('중원').garrisons -= 1200; g('서령').garrisons += 1200;
        g('서령').atWar = g('중원').atWar = false;
      }
      // M13 peace recruitment (+10% of cap/turn toward cap); vassals keep
      // internal sovereignty (복속 row) and rebuild too — watch the effect.
      for (const r of R) if (r.alive && !r.atWar && r.field < r.fieldCap)
        r.field = Math.min(r.fieldCap, r.field + Math.round(r.fieldCap * D.recruitPerTurn));
      const c = hegemonyCheck(R, '서령', D);
      if (c.trips && tripTurn === null) tripTurn = t;
      rows.push({ t, c, R: R.map((r) => ({ name: r.name, field: r.field, vassal: !!r.vassalOf })) });
    }
    return { rows, tripTurn };
  }

  sub('Main ledger (default dials) — check components per turn');
  const main = runArc(MATCH_DIALS);
  const widths = [4, 9, 24, 26, 20, 6];
  row(['turn', 'candProj', 'in balance (need @1.7)', 'leadership', 'coalition vs need', 'TRIP'], widths);
  for (const { t, c } of main.rows) {
    const worst = c.leadershipRows.filter((r) => !r.pass)
      .sort((a, b) => b.need - a.need)[0];
    row([`T${t}`, c.candProj,
      c.leadershipRows.map((r) => `${r.name} ${Math.round(r.need)}`).join(' · ') || '(없음)',
      c.leadership ? 'PASS' : `FAIL (${worst.name} −${Math.round(worst.need - c.candProj)})`,
      `${Math.round(c.coalition)} < ${Math.round(c.coalitionNeed)} ${c.unassailable ? '✓' : '✗'}`,
      c.trips ? '★' : ''], widths);
  }
  console.log(`\n  Out of balance throughout: ${main.rows[0].c.outOfBalance.join(', ')} (은둔국 조항 fires — strait 500 × flow 2 = 1,000 ≤ floor).`);
  console.log(`  Trip turn: ${main.tripTurn ? 'T' + main.tripTurn : 'NEVER (within 26 turns)'} — envelope 15–25.`);

  sub('Validation 1 — unreachable from a parity start in a single war (T9–10 detail)');
  const t9 = main.rows[8].c;
  console.log(`  after war 1 + settlement: candProj ${t9.candProj}; leadership needs vs 중원 ${Math.round(t9.leadershipRows.find((r) => r.name === '중원')?.need ?? 0)} — short by ${Math.round((t9.leadershipRows.find((r) => r.name === '중원')?.need ?? 0) - t9.candProj)}.`);
  console.log('  → one war (even a clean one with vassalage) cannot trip the check. ✓');

  sub('Validation 2 — shield-base definition sweep (the UNSEALED term)');
  const w2 = [14, 12, 62];
  row(['base', 'trip turn', 'reading'], w2);
  for (const base of ['field', 'shieldLine', 'total']) {
    const r = runArc({ ...MATCH_DIALS, shieldBase: base });
    row([base, r.tripTurn ? `T${r.tripTurn}` : 'NEVER',
      { field: 'field armies only — wars are decided by field-army destruction',
        shieldLine: 'field + border-shield garrisons (sheet 7\'s measured 4,000)',
        total: 'field + ALL garrisons — interior garrisons deter too' }[base]], w2);
  }

  sub('Validation 3 — ratio & floor sensitivity (default base)');
  for (const ratio of [1.5, 1.7, 1.9]) {
    const r = runArc({ ...MATCH_DIALS, shieldRatio: ratio });
    console.log(`  ratio ${ratio}: trip ${r.tripTurn ? 'T' + r.tripTurn : 'NEVER'}`);
  }
  for (const floor of [500, 1000, 1500]) {
    const r = runArc({ ...MATCH_DIALS, projectionFloor: floor });
    const last = r.rows[r.rows.length - 1].c;
    console.log(`  floor ${floor}: trip ${r.tripTurn ? 'T' + r.tripTurn : 'NEVER'} · out-of-balance at end: ${last.outOfBalance.join(', ') || '(none)'}`);
  }

  sub('Validation 4 — 투사 하한 × chokeFlow: the hermit door (북하, strait 500)');
  const w4 = [10, 16, 22, 44];
  row(['flow', '투사 (base)', '+port staging(+500)', 'verdict'], w4);
  for (const flow of [1, 2, 3]) {
    const D = { ...MATCH_DIALS, chokeFlow: flow };
    const base = Math.min(6000, 500 * flow);
    const staged = Math.min(6000, 1000 * flow);
    row([flow, `${base} ${base <= D.projectionFloor ? 'OUT' : 'IN'}`,
      `${staged} ${staged <= D.projectionFloor ? 'OUT' : 'IN'}`,
      base <= D.projectionFloor && staged <= D.projectionFloor
        ? 'buy-back-in IMPOSSIBLE — breaks the hermit clause promise'
        : base <= D.projectionFloor ? 'hermit until staging built ✓ (intended)' : 'never a hermit'], w4);
  }

  sub('Validation 5 — regeneration-window length (micro-case: when does W bite?)');
  console.log('  Worn hegemon shield 8,000; two rivals field 3,000 / cap 9,000 each');
  console.log('  (recruit headroom 6,000). Coalition must stay < 1.7 × 8,000 = 13,600.');
  for (const W of [4, 6, 8]) {
    const coalition = 2 * (3000 + Math.min(6000, 900 * W));
    console.log(`  W=${W}: coalition reaches ${coalition} → ${coalition < 13600 ? 'unassailable ✓ (trip stands)' : 'ASSAILABLE ✗ (trip blocked)'}`);
  }
  console.log('  → in the main arc W never bites (the blocker realm sat at cap — no');
  console.log('    recruit headroom); W matters exactly when rivals are worn but rich.');
}

// ---------------------------------------------------------------- Sheet 11
function settlement() {
  h('SHEET 11 — Settlement acceptance battery (preset ladder × 수락 산술)');
  const D = MATCH_DIALS;
  console.log('War-end state grid × 3 temperaments. Units: sector-turn yield. occValue 8.');
  console.log(`Loss model: L = ${D.lossModel.resistanceDiscount} × (occ×esc(margin) + raid + capitalRisk) — discount SEALED (ruling ⑫);`);
  console.log(`esc ${JSON.stringify(D.lossModel.occEscalation)}, capitalRisk ${D.lossModel.capitalRiskFrac}×(occ+raid), extraTurns ${JSON.stringify(D.lossModel.extraTurns)}.\n`);

  const states = [];
  for (const margin of ['decisive', 'grinding', 'marginal'])
    for (const capitalInReach of margin === 'marginal' ? [false] : [true, false])
      for (const raidFactor of [0.5, 1.2])
        states.push({ margin, capitalInReach, occValue: 8, raidLoot: 8 * raidFactor,
          id: `${margin.slice(0, 4).padEnd(4)}·${capitalInReach ? '수도O' : '수도X'}·약탈${raidFactor}` });
  console.log(`${states.length} war-end states × 3 temperaments = ${states.length * 3} evaluations.`);

  const temps = Object.entries(D.temperament); // [name, coeff]
  const presets = ['관대', '표준', '최대'];

  sub('Acceptance matrix (관/표/최 accepted?) per temperament');
  const wA = [20, 8, 8, 16, 16, 16];
  row(['state', 'composite', 'L', ...temps.map(([n, c]) => `${n}(${c})`)], wA);
  const cells = []; // {state, temp, coeff, preset, bundle, accepted}
  for (const st of states) {
    const L = expectedContinuedLoss(st, D);
    const bundles = presets.map((p) => presetBundle(p, st, D));
    const cols = temps.map(([tn, coeff]) => {
      const marks = bundles.map((b) => {
        const ok = accepts(b.value, L.total, coeff);
        cells.push({ st, temp: tn, coeff, preset: b.preset, bundle: b, accepted: ok, L });
        return `${b.preset[0]}${ok ? '○' : '×'}`;
      });
      return marks.join(' ');
    });
    row([st.id, st.occValue + st.raidLoot, L.total.toFixed(1), ...cols], wA);
  }

  sub('Registered metric — preset pick rates (winner argmax EV; fight-on as 4th option)');
  console.log('  EV(accepted preset) = bundle value. EV(fight on) = occ×esc + raid −');
  console.log('  extraTurns × (blood 1.0 + oppYield). oppYield swept 0.5 / 1.0 / 2.0.');
  for (const oppYield of [0.5, 1.0, 2.0]) {
    const picks = { 관대: 0, 표준: 0, 최대: 0, 계속: 0 };
    for (const st of states) for (const [tn, coeff] of temps) {
      const L = expectedContinuedLoss(st, D);
      const fightOn = st.occValue * D.lossModel.occEscalation[st.margin] + st.raidLoot
        - D.lossModel.extraTurns[st.margin] * (1.0 + oppYield);
      let best = ['계속', fightOn];
      for (const p of presets) {
        const b = presetBundle(p, st, D);
        if (accepts(b.value, L.total, coeff) && b.value > best[1]) best = [p, b.value];
      }
      picks[best[0]]++;
    }
    console.log(`  oppYield ${oppYield}: ` + Object.entries(picks).map(([k, v]) => `${k} ${v}/${states.length * 3}`).join(' · '));
  }

  sub('Registered metric — dominated-preset check (관대의 존재 이유)');
  const both = cells.filter((c) => c.preset === '관대');
  const gwins = both.filter((c) => {
    const std = cells.find((x) => x.st === c.st && x.temp === c.temp && x.preset === '표준');
    return c.accepted && !std.accepted;
  });
  const dominated = both.filter((c) => {
    const std = cells.find((x) => x.st === c.st && x.temp === c.temp && x.preset === '표준');
    return std.accepted; // both accepted → 표준 value always ≥ 관대 value, turns saved identical
  });
  console.log(`  표준 accepted (관대 dominated — same turns saved, less value): ${dominated.length}/${both.length}`);
  console.log(`  관대-only acceptance window (표준 ×, 관대 ○ — the tempo-peace niche): ${gwins.length}/${both.length}`);
  if (gwins.length) console.log('    cases: ' + gwins.map((c) => `${c.st.id}/${c.temp}`).join(', '));

  sub('Registered PASS bar — conciliatory(유화 1.2) target, 최대 acceptance ≤ 40–50%');
  const conc = cells.filter((c) => c.temp === '유화' && c.preset === '최대');
  const concAcc = conc.filter((c) => c.accepted).length;
  const rate = (concAcc / conc.length * 100).toFixed(0);
  console.log(`  유화 최대 acceptance: ${concAcc}/${conc.length} = ${rate}% → ${concAcc / conc.length > 0.45 ? '*** FAIL ***' : 'PASS'}`);

  sub('Resistance-discount sweep (ruling ⑫ SEALED at 0.6 — how the bar moves)');
  console.log('  The whole preset trade hangs on how L compares to the composite bill.');
  for (const lam of [1.0, 0.8, 0.6]) {
    const D2 = { ...D, lossModel: { ...D.lossModel, resistanceDiscount: lam } };
    let concMax = 0, gNiche = 0, maxPicks = 0;
    for (const st of states) {
      const L = expectedContinuedLoss(st, D2).total;
      if (accepts(presetBundle('최대', st, D).value, L, 1.2)) concMax++;
      for (const [, coeff] of temps) {
        if (accepts(presetBundle('관대', st, D).value, L, coeff)
          && !accepts(presetBundle('표준', st, D).value, L, coeff)) gNiche++;
        if (accepts(presetBundle('최대', st, D).value, L, coeff)) maxPicks++;
      }
    }
    console.log(`  discount ${lam}: 유화-최대 ${concMax * 10}% ${concMax / states.length > 0.45 ? 'FAIL' : 'PASS'} · 관대 niche ${gNiche}/30 · 최대 acceptance ${maxPicks}/30`);
  }
  console.log('  → the ladder differentiates only once the loser prices continued war');
  console.log('    BELOW the full bill often enough (discount ≈ 0.6): the winner also');
  console.log('    bleeds, time flows, third parties move — 강화 결렬 must be possible.');

  sub('Decoupled comparison — same claim rate (75%), different fill order');
  const stX = states[0]; // decisive·수도O·약탈0.5
  for (const fill of ['cessionFirst', 'indemnityFirst']) {
    const D2 = { ...D, presets: { ...D.presets, 표준: { claimRate: 0.75, fill } } };
    const b = presetBundle('표준', stX, D2);
    const L = expectedContinuedLoss(stX, D);
    console.log(`  ${fill.padEnd(14)}: 할양 ${b.cession.toFixed(1)} + 배상 ${b.indemnity.toFixed(1)} = ${b.value.toFixed(1)} → 실리 accepts: ${accepts(b.value, L.total, 1.0) ? '○' : '×'}`);
  }
  console.log('  → acceptance rides on VALUE (claim rate) only; fill order changes WHAT');
  console.log('    arrives (alive land+pool vs one-time cash) — rate and composition');
  console.log('    are separable in the data as required. Composition is the archetype');
  console.log('    lever: cession feeds conquest-snowball, indemnity feeds raid-attrition.');

  sub('Open input — vassalage pricing proposal (capital-in-reach states only)');
  console.log('  Hegemony swing of 복속: loser remaining mass M leaves the coalition sum');
  console.log('  AND joins the overlord → arithmetic swing ≈ 2M. At M = 6,000 that is');
  console.log('  12,000 mass of balance swing; the 최대−표준 material gap (25% of');
  console.log('  composite ≈ 3–4 yield) recruits ~6–8 부대 = 600–800 men. Ratio ~15–20:1');
  console.log('  → 복속 priced in reach currency is ALWAYS the buy (archetype-2 overpower).');
  console.log('  PROPOSAL: price 복속 in acceptance currency, not reach currency —');
  console.log('  vassal bundle = 표준 material + sovereignty premium (GAAN 0.5 × loser');
  console.log('  remaining value), so it clears only when the capital threat inflates L:');
  const vrem = 20; // GAAN: loser remaining realm value, yield units
  const wV = [22, 10, 10, 26];
  row(['state (수도O only)', 'bundle', 'L', 'accepts (완고/실리/유화)'], wV);
  for (const st of states.filter((s) => s.capitalInReach)) {
    const L = expectedContinuedLoss(st, D);
    const b = presetBundle('표준', st, D).value + 0.5 * vrem;
    row([st.id, b.toFixed(1), L.total.toFixed(1),
      temps.map(([n, c]) => `${n}${accepts(b, L.total, c) ? '○' : '×'}`).join(' ')], wV);
  }
  console.log('  → 복속 lands as the decisive-war, throne-under-the-sword outcome — not');
  console.log('    a cheap Maximum substitute. Premium value (0.5×remaining) → user dial.');
}

// ---------------------------------------------------------------- Sheet 12
function tournamentSheet() {
  h('SHEET 12 — Match tournament (L2): archetype × seat × temperament frequencies');
  console.log('Policy bots play full matches over engine.js + match.js on the sheet-10');
  console.log('board. PASS SENTENCE (user): "each temperament/archetype wins where it');
  console.log('should, and no temperament is absolutely favorable."');
  console.log('HONEST LIMITS: bot policy quality bounds proof power — dominance FOUND is');
  console.log('real; dominance NOT found is not absence. Bots use no reserves/delaying/');
  console.log('feints/scouting; one authored board, not the map space. Policy dials are');
  console.log('harness GAAN, never seal candidates (tournament.js §BOT/§HARNESS).\n');

  const { ARCHETYPES, TEMPERAMENTS, SEATS } = TOURNEY;

  function printGrids(recs, label) {
    sub(`${label} — archetype × seat focal win rate (baseline ~20% if all even)`);
    const widths = [20, ...SEATS.map(() => 12), 9];
    row(['archetype \\ seat', ...SEATS.map((s) => {
      const seat = recs.find((r) => r.seat === s);
      return `${s}(${seat ? seat.finalRealms.find((x) => x.name === s).seat : ''})`;
    }), 'overall'], widths);
    for (const a of ARCHETYPES) {
      const cells = SEATS.map((s) => {
        const ms = recs.filter((r) => r.focal === a && r.seat === s);
        const w = ms.filter((r) => r.winner === r.seat).length;
        return `${w}/${ms.length}`;
      });
      const all = recs.filter((r) => r.focal === a);
      const wins = all.filter((r) => r.winner === r.seat).length;
      row([a, ...cells, `${(wins / all.length * 100).toFixed(0)}%`], widths);
    }

    const tSlots = {}, tWins = {};
    for (const t of TEMPERAMENTS) { tSlots[t] = 0; tWins[t] = 0; }
    for (const r of recs) {
      for (const fr of r.finalRealms) tSlots[fr.temperament]++;
      if (r.winnerTemperament) tWins[r.winnerTemperament]++;
    }
    console.log('  temperament (participant-pooled): ' + TEMPERAMENTS.map((t) =>
      `${t} ${tWins[t]}/${tSlots[t]} (${(tWins[t] / tSlots[t] * 100).toFixed(1)}%)`).join(' · '));

    const shapes = {};
    for (const r of recs) shapes[r.endingShape] = (shapes[r.endingShape] ?? 0) + 1;
    console.log('  endings: ' + Object.entries(shapes).map(([s, n]) =>
      `${s} ${(n / recs.length * 100).toFixed(0)}%`).join(' · '));
    const trips = recs.filter((r) => r.tripTurn).map((r) => r.tripTurn);
    if (trips.length) {
      const inEnv = trips.filter((t) => t >= 15 && t <= 25).length;
      console.log(`  trip turns: min T${Math.min(...trips)} · mean T${(trips.reduce((a, b) => a + b) / trips.length).toFixed(1)} · max T${Math.max(...trips)} · in 15–25 envelope: ${(inEnv / trips.length * 100).toFixed(0)}%`);
    }
    console.log(`  wars/match: ${(recs.reduce((s, r) => s + r.warsStarted, 0) / recs.length).toFixed(1)} · settlements/match: ${(recs.reduce((s, r) => s + r.settlements.length, 0) / recs.length).toFixed(1)} · eliminations: ${recs.reduce((s, r) => s + r.eliminations, 0)}`);

    const deals = recs.flatMap((r) => r.settlements);
    const byPreset = {};
    for (const d of deals) {
      const k = `${d.kind === 'vassalage' ? '복속' : d.preset}`;
      byPreset[k] = byPreset[k] ?? { n: 0, decisive: 0, capital: 0 };
      byPreset[k].n++;
      if (d.margin === 'decisive') byPreset[k].decisive++;
      if (d.capital) byPreset[k].capital++;
    }
    console.log('  deals: ' + Object.entries(byPreset).map(([k, v]) =>
      `${k} ${v.n} (decisive ${(v.decisive / v.n * 100).toFixed(0)}%, capital ${(v.capital / v.n * 100).toFixed(0)}%)`).join(' · '));
  }

  // ---- World 1: CANON dials (capPerSector 0 — conquest moves pool+yield, not cap)
  console.log('WORLD 1 — canon dials. HEADLINE: the S10 structural insight, frequency-');
  console.log('confirmed — with static caps, leadership is arithmetically unreachable');
  console.log('against ANY healthy same-size peer (cap 7,000 < 1.7 × 7,150), so almost');
  console.log('every bot match is an endless material-settlement churn. The only sealed');
  console.log('paths to a trip are vassal mass (rare by the sealed acceptance shape) or');
  console.log('a simultaneously-worn world.');
  const canon = TOURNEY.runTournament({ reps: 12, seed: 42 });
  console.log(`\n${ARCHETYPES.length} archetypes × ${SEATS.length} seats × 12 reps = ${canon.length} matches (seeded, deterministic).`);
  printGrids(canon, 'WORLD 1 (canon)');

  // ---- World 2: A-3-coupled variant — conquest raises the cap (+400/sector)
  console.log('\nWORLD 2 — A-3 probe world (capPerSector 400): conquered land raises the');
  console.log('national cap, the lever A-3 has not yet designed. Frequencies below are');
  console.log('measured HERE because matches actually end in this world.');
  const coupled = TOURNEY.runTournament({ reps: 12, seed: 42, harness: { capPerSector: 400 } });
  printGrids(coupled, 'WORLD 2 (A-3-coupled)');

  sub('Vassalage premium sweep (ruling ⑭ gate: 0.25 가안) — in the A-3-coupled world');
  const wS = [9, 16, 18, 20, 14];
  row(['premium', 'vassal deals', 'deals/offers', 'vassal-chain win%', 'trip-chain%'], wS);
  for (const p of [0.15, 0.25, 0.35]) {
    const rs = TOURNEY.runTournament({ reps: 8, seed: 7, harness: { vassalPremium: p, capPerSector: 400 } });
    const vd = rs.reduce((s, r) => s + r.vassalDeals, 0);
    const vo = rs.reduce((s, r) => s + r.vassalOffers, 0);
    const vc = rs.filter((r) => r.focal === 'vassal-chain');
    const vcw = vc.filter((r) => r.winner === r.seat).length;
    const chain = rs.filter((r) => r.endingShape === 'trip-chain').length;
    const ended = rs.filter((r) => r.winner).length;
    row([p, vd, vo ? `${vd}/${vo} (${(vd / vo * 100).toFixed(0)}%)` : '0/0',
      `${(vcw / vc.length * 100).toFixed(0)}%`,
      ended ? `${(chain / ended * 100).toFixed(0)}% of ${ended}` : '—'], wS);
  }

  sub('SPEC GAPS the bots hit (undocumented rules the harness had to invent)');
  TOURNEY.SPEC_GAPS.forEach((g, i) => console.log(`  ${i + 1}. ${g}`));
}

// ---------------------------------------------------------------- Sheet 13
function economy() {
  const E = require('./econ');
  const D = E.ECON_DIALS;
  h('SHEET 13 — Thin economy (A-3): yield ledger, fort-vs-recruit, derived cap');
  console.log('Candidate structure (econ.js, 가안): everything derives from sector');
  console.log('values × usable — income = Σ econ×usableE; cap = capPerPop × Σ pop×usableP.');
  console.log('Conquest raises cap (sectors arrive), raids lower it (usable burns),');
  console.log('development raises it permanently. Numbers → user rulings.\n');

  sub('Check 1 — the sealed anchors re-derive (M13 cap 6,000 mid / 9,000 center)');
  const mid = E.midRealm(), center = E.centerRealm();
  console.log(`  mid realm (10 ordinary sectors): cap ${E.nationalCap(mid)} · income ${E.income(mid).toFixed(1)}/turn`);
  console.log(`  center (12 rich sectors): cap ${E.nationalCap(center)} · income ${E.income(center).toFixed(1)}/turn`);
  const rc = E.recruitCost(E.nationalCap(mid));
  console.log(`  recruit primary (mid): +${rc.men}명 costs ${rc.yield.toFixed(1)} yield = ${(rc.yield / E.income(mid) * 100).toFixed(0)}% of turn income`);
  const rcC = E.recruitCost(E.nationalCap(center));
  console.log(`  recruit primary (center): +${rcC.men}명 costs ${rcC.yield.toFixed(1)} yield = ${(rcC.yield / E.income(center) * 100).toFixed(0)}% of turn income`);
  console.log('  → recruitment consumes a meaningful-but-affordable slice; treasury');
  console.log('    surplus funds forts/development — the fight-vs-grow wallet tension.');

  sub('Check 2 — conquest/raid/development move the cap (ruling ⑮ mechanical)');
  const conquered = [...mid, E.sector(1, 1, 0.5, 0.6)]; // fresh capture at 50/60 usable
  console.log(`  +1 captured sector (usable 50/60): cap ${E.nationalCap(mid)} → ${E.nationalCap(conquered)} (+${E.nationalCap(conquered) - E.nationalCap(mid)}), full value after recovery: +${Math.round(D.capPerPop)}`);
  const raided = mid.map((s, i) => i < 3 ? { ...s, usableEconomy: 0.7, usablePop: 0.7 } : s);
  console.log(`  3 sectors raided to usable 0.7: cap ${E.nationalCap(mid)} → ${E.nationalCap(raided)} (−${E.nationalCap(mid) - E.nationalCap(raided)}) · income ${E.income(mid).toFixed(1)} → ${E.income(raided).toFixed(1)}`);
  console.log('  → raid-attrition finally has an END-GAME lever: burning usable lowers');
  console.log('    the rival\'s cap = lowers the shield ceiling the coalition needs.');
  const dev = D.development;
  const developed = [...mid.slice(0, 9), E.sector(1 + dev.economyStep, 1 + dev.populationStep)];
  console.log(`  1 development (${dev.primaries} primary + ${dev.yield} yield): cap +${E.nationalCap(developed) - E.nationalCap(mid)}, income +${(E.income(developed) - E.income(mid)).toFixed(1)}/turn`);
  console.log(`  payback: ${(dev.yield / dev.economyStep).toFixed(0)} turns of yield; cap/yield vs recruit: dev buys ${E.nationalCap(developed) - E.nationalCap(mid)} CEILING for ${dev.yield}y, recruit buys ${Math.round(dev.yield * D.menPerYield)} STANDING men for the same`);

  sub('Check 3 — fortification-vs-recruitment exchange rate (STRATEGY-SPACE #5 due)');
  console.log('  Question: what does 1 build turn buy vs 1 recruit turn, in attacker');
  console.log('  blood extracted? Site: hills, garrison 1,500 commit 8; attacker 6,000');
  console.log('  commit 8, best plan per case (DP vs walls, Swift in field).');
  const wE = [26, 14, 14, 22];
  row(['defense package', 'attacker loss', 'defender loss', 'blood per yield spent'], wE);
  const base = { plan: 'Swift', attacker: { stock: 6000, commit: 8 }, defender: { stock: 1500, commit: 8 }, terrain: 'hills' };
  const cases = [
    ['no fort (baseline)', { ...base }, 0],
    [`+600명 recruit (3y)`, { ...base, defender: { stock: 2100, commit: 8 } }, 3],
    ['fieldworks (2y+1pr)', { ...base, plan: 'DP', fort: 'fieldworks' }, 2],
    ['walls (6y+2pr)', { ...base, plan: 'DP', fort: 'walls' }, 6],
    ['fortress (12y+4pr)', { ...base, plan: 'DP', fort: 'fortress' }, 12],
  ];
  const baseline = resolve(cases[0][1]);
  for (const [label, spec, yieldCost] of cases) {
    const r = resolve(spec);
    const extra = r.lossA - baseline.lossA;
    row([label, `−${r.lossA}`, `−${r.lossB}`,
      yieldCost ? `+${extra} extra ÷ ${yieldCost}y = ${(extra / yieldCost).toFixed(0)}명/y` : '(baseline)'], wE);
  }
  console.log('  NOTE: forts also deny the sector (threshold), persist across battles,');
  console.log('  and cost PRIMARIES (tempo) — men fight anywhere but die once. The');
  console.log('  exchange is context-priced, not flat — the table shows one siege turn.');

  sub('Check 4 — sheet-12 re-run under the derived cap (does the world still close?)');
  console.log('  Tournament with capPerSector = capPerPop × pop 1.0 (600) — conquest,');
  console.log('  cession, and elimination now move caps exactly as econ.js derives.');
  const rs = TOURNEY.runTournament({ reps: 8, seed: 42, harness: { capPerSector: 600 } });
  const ended = rs.filter((r) => r.winner);
  const trips = rs.filter((r) => r.tripTurn).map((r) => r.tripTurn);
  const byArch = {};
  for (const a of TOURNEY.ARCHETYPES) {
    const ms = rs.filter((r) => r.focal === a);
    byArch[a] = (ms.filter((r) => r.winner === r.seat).length / ms.length * 100).toFixed(0);
  }
  console.log(`  matches ended: ${(ended.length / rs.length * 100).toFixed(0)}% (sheet-12 canon: 4%, probe@400: 26%)`);
  if (trips.length) console.log(`  trip turns: mean T${(trips.reduce((x, y) => x + y) / trips.length).toFixed(1)}, in-envelope ${(trips.filter((t) => t >= 15 && t <= 25).length / trips.length * 100).toFixed(0)}%`);
  console.log('  focal win rates: ' + Object.entries(byArch).map(([a, w]) => `${a} ${w}%`).join(' · '));
}

// ----------------------------------------------------------------
function mapViability() {
  h('SHEET 14 — MAP VIABILITY (terrain-cradle authoring gate)');
  sub('Loads a map, derives realm mass/shield/cap from the sector graph,');
  sub('runs the seat-sizing gate: B1 (no all-cap leadership) + B2 (no');
  sub('one-war-kill) + viable seat-binding count. Fixture is a 가안.');

  const { realms } = loadMap(FIXTURE_MAP);
  console.log(''); sub('Per-realm derived state (all-cap):');
  row(['realm', 'cap', 'field', 'exits', 'garr', 'fronts'], [10, 7, 7, 16, 6, 24]);
  for (const r of realms) {
    const doors = r.exits.map((e) => (e.cap === Infinity ? 'open' : e.cap)).join('/');
    const fronts = Object.entries(r.fronts).map(([n, g]) => `${n}:${g}`).join(' ');
    row([r.name, String(r.fieldCap), String(r.field), doors, String(r.garrisons), fronts], [10, 7, 7, 16, 6, 24]);
  }

  const g = gateReport(FIXTURE_MAP);
  console.log(''); sub('Gate:');
  row(['check', 'pass', 'detail'], [8, 6, 40]);
  row(['B1', g.b1.pass ? 'YES' : 'NO', g.b1.pass ? 'no all-cap leadership' : `leadership: ${g.b1.offenders.join(', ')}`], [8, 6, 40]);
  row(['B2', g.b2.pass ? 'YES' : 'NO', g.b2.pass ? 'no one-war-kill' : g.b2.kills.map((k) => `${k.attacker}→${k.victim}`).join(', ')], [8, 6, 40]);

  const v = viableBindings(FIXTURE_MAP, 5);
  console.log(''); sub(`Viable seat-bindings: ${v.viableCount} / ${v.total} (diversity metric — target set empirically)`);
  console.log(''); sub('VERDICT: user rules in NOTES.md. This sheet is the C-loop loss.');
}

// ----------------------------------------------------------------
const SHEETS = { myeongnyang, fortress, raid, delaying, grinding, feint, tempo, timeline, manpower, hegemony, settlement, tournament: tournamentSheet, economy, viability: mapViability };
const pick = process.argv[2];
if (pick && SHEETS[pick]) SHEETS[pick]();
else if (pick) { console.error(`unknown sheet: ${pick} (${Object.keys(SHEETS).join(', ')})`); process.exit(1); }
else Object.values(SHEETS).forEach((f) => f());
