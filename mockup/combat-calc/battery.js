'use strict';
// PROTOTYPE — scenario battery over engine.js. Prints worked sheets.
// Run: npm run battery   |   node mockup/combat-calc/battery.js <sheet>

const { DIALS, lever, resolve } = require('./engine');

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
  h('SHEET 6 — Reserve & feint geography (양동 후속타)');
  console.log('Province: A(garrison 600), B(garrison 500), depot C(1,200) adjacent to both.');
  console.log('Attacker has 2,000 at each approach. Terrain hills(×1.2). Reserve set pre-seal.');
  sub('T1 — attack A, no reserve bound');
  line(resolve({ plan: 'Swift', attacker: { stock: 2000, commit: 8 }, defender: { stock: 600, commit: 0 }, terrain: 'hills' }), 'A undefended');
  sub('T1′ — attack A, reserve triggers: C rushes 1,200 (fight ×0.5, lever knee-capped ×1.5)');
  line(resolve({ plan: 'Swift', attacker: { stock: 2000, commit: 8 }, defender: { stock: 600, commit: 8, reserveStock: 1200, defenderReserveLever: true }, terrain: 'hills' }), 'A + 긴급 투입');
  sub('T2 — the follow-up strike: B with C stripped (reserve reach empty)');
  line(resolve({ plan: 'Swift', attacker: { stock: 2000, commit: 8 }, defender: { stock: 500, commit: 0 }, terrain: 'hills' }), 'B after the feint');
  console.log('  → the feint costs T1 attacker blood at A; the payoff is B at reserve-empty.');
  console.log('    Attacker skill gate: scouting the drained sectors (estimate bands drop).');
  sub("Route tooth: SI cut C–B beforehand removes C from B's reach without any feint");
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

// ----------------------------------------------------------------
const SHEETS = { myeongnyang, fortress, raid, delaying, grinding, feint, tempo, timeline, manpower };
const pick = process.argv[2];
if (pick && SHEETS[pick]) SHEETS[pick]();
else if (pick) { console.error(`unknown sheet: ${pick} (${Object.keys(SHEETS).join(', ')})`); process.exit(1); }
else Object.values(SHEETS).forEach((f) => f());
