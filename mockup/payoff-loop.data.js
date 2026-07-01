/* ============================================================================
 * Terrain Game — Payoff Loop Mockup — DUMMY DATA
 * ----------------------------------------------------------------------------
 * Judgment mockup only. This is NOT domain logic and is NOT wired to the game.
 * Values are hand-authored fixtures chosen to make the representation model
 * legible (ADR 0013 color language; payoff-loop-design.md).
 * ==========================================================================*/

/* Faction hues are deliberately distinct from the ADR 0013 *situation* colors
 * (red/gold/blue/green/purple/silver) so ownership never reads as a metric. */
const FACTIONS = {
  self:      { id: 'self',      name: '玄陽 · 현양', short: '현양', color: '#2dd4bf', isSelf: true },
  heukcheol: { id: 'heukcheol', name: '黑鐵 · 흑철', short: '흑철', color: '#fb7185' },
  namwol:    { id: 'namwol',    name: '南越 · 남월', short: '남월', color: '#fbbf24' },
  baeksan:   { id: 'baeksan',   name: '白山 · 백산', short: '백산', color: '#818cf8' },
  neutral:   { id: 'neutral',   name: '군소 세력',    short: '군소', color: '#64748b' },
};

/* Aggregate power figure per faction (drives power-diff bar + ladder). */
const POWER = { self: 142, heukcheol: 121, namwol: 88, baeksan: 71, neutral: 34 };

/* Provinces. One hex == one province for the mockup's legibility.
 *   value       0..100  conquest value        (gold lens)
 *   development 0..100  built-up / enriched    (green lens, glow, icon density)
 *   threat      0..100  military threat to me  (red lens)
 *   confidence  0..1    information confidence (purple ring when low)
 *   terrain     label   flavor + hover chip
 *   econ        gold/turn ; defense 0..100 ; garrison unit count            */
const PROVINCES = [
  // --- Self core (bottom-left): developed, bright, low threat ------------
  { id:'yeoncheon', name:'연천', col:0, row:3, owner:'self', value:52, development:88, threat:8,  econ:34, defense:74, garrison:6, terrain:'평야', confidence:1.00 },
  { id:'hoegang',   name:'회강', col:0, row:4, owner:'self', value:44, development:80, threat:6,  econ:29, defense:70, garrison:5, terrain:'하천', confidence:1.00 },
  { id:'sohyeon',   name:'소현', col:1, row:3, owner:'self', value:48, development:72, threat:14, econ:26, defense:58, garrison:4, terrain:'구릉', confidence:1.00 },
  { id:'baekpo',    name:'백포', col:1, row:4, owner:'self', value:40, development:64, threat:10, econ:22, defense:60, garrison:4, terrain:'해안', confidence:1.00 },
  { id:'jinam',     name:'지남', col:2, row:4, owner:'self', value:38, development:46, threat:22, econ:17, defense:48, garrison:3, terrain:'구릉', confidence:0.95 },
  { id:'unbong',    name:'운봉', col:2, row:3, owner:'self', value:55, development:38, threat:34, econ:15, defense:44, garrison:3, terrain:'산지', confidence:0.90 }, // frontier: dim, will develop
  { id:'garim',     name:'가림', col:1, row:2, owner:'self', value:46, development:55, threat:18, econ:20, defense:52, garrison:3, terrain:'평야', confidence:1.00 },

  // --- Baeksan (top-left) ------------------------------------------------
  { id:'seorak',    name:'서락', col:0, row:1, owner:'baeksan', value:50, development:60, threat:30, econ:23, defense:66, garrison:4, terrain:'산지', confidence:0.55 },
  { id:'cheongmun', name:'청문', col:0, row:2, owner:'baeksan', value:42, development:52, threat:26, econ:19, defense:58, garrison:3, terrain:'관문', confidence:0.50, pass:true },
  { id:'baekha',    name:'백하', col:1, row:1, owner:'baeksan', value:47, development:57, threat:24, econ:21, defense:54, garrison:3, terrain:'하천', confidence:0.60 },
  { id:'nared',     name:'나린', col:1, row:0, owner:'baeksan', value:39, development:44, threat:20, econ:16, defense:46, garrison:2, terrain:'구릉', confidence:0.45 },

  // --- Contested middle spine (col 2-3): high value, high threat, low info -
  { id:'hoeryeong', name:'회령', col:2, row:2, owner:'neutral', value:78, development:40, threat:58, econ:14, defense:40, garrison:2, terrain:'관문', confidence:0.35, pass:true }, // prime target
  { id:'seomjin',   name:'섬진', col:2, row:1, owner:'neutral', value:66, development:34, threat:44, econ:12, defense:36, garrison:2, terrain:'하천', confidence:0.40 },
  { id:'daegwan',   name:'대관', col:3, row:2, owner:'neutral', value:84, development:30, threat:66, econ:11, defense:34, garrison:2, terrain:'관문', confidence:0.28, pass:true }, // highest value, most uncertain
  { id:'muljae',    name:'물재', col:3, row:1, owner:'neutral', value:58, development:28, threat:50, econ:10, defense:30, garrison:1, terrain:'산지', confidence:0.33 },
  { id:'sangdo',    name:'상도', col:3, row:3, owner:'neutral', value:62, development:36, threat:40, econ:13, defense:38, garrison:2, terrain:'평야', confidence:0.42 },

  // --- Heukcheol (top-right): strongest rival, developed + threatening ----
  { id:'cheolong',  name:'철옹', col:4, row:0, owner:'heukcheol', value:70, development:82, threat:52, econ:31, defense:78, garrison:6, terrain:'관문', confidence:0.30, pass:true },
  { id:'heukdo',    name:'흑도', col:5, row:0, owner:'heukcheol', value:64, development:86, threat:48, econ:33, defense:80, garrison:7, terrain:'평야', confidence:0.25 },
  { id:'gangcheol', name:'강철', col:6, row:0, owner:'heukcheol', value:60, development:74, threat:44, econ:28, defense:72, garrison:5, terrain:'구릉', confidence:0.28 },
  { id:'noha',      name:'노하', col:4, row:1, owner:'heukcheol', value:56, development:50, threat:60, econ:18, defense:50, garrison:3, terrain:'하천', confidence:0.35 }, // weak frontier — conquerable
  { id:'byeoksan',  name:'벽산', col:5, row:1, owner:'heukcheol', value:54, development:66, threat:46, econ:24, defense:64, garrison:4, terrain:'산지', confidence:0.32 },
  { id:'jingang',   name:'진강', col:6, row:1, owner:'heukcheol', value:50, development:58, threat:38, econ:22, defense:60, garrison:4, terrain:'하천', confidence:0.36 },

  // --- Namwol (bottom-right) ---------------------------------------------
  { id:'namgang',   name:'남강', col:4, row:3, owner:'namwol', value:52, development:62, threat:28, econ:24, defense:56, garrison:4, terrain:'하천', confidence:0.48 },
  { id:'wolpo',     name:'월포', col:5, row:3, owner:'namwol', value:48, development:56, threat:24, econ:21, defense:52, garrison:3, terrain:'해안', confidence:0.50 },
  { id:'yeongju',   name:'영주', col:6, row:3, owner:'namwol', value:44, development:48, threat:20, econ:18, defense:48, garrison:3, terrain:'평야', confidence:0.52 },
  { id:'nampyeong', name:'남평', col:4, row:4, owner:'namwol', value:40, development:42, threat:18, econ:15, defense:44, garrison:2, terrain:'평야', confidence:0.55 },
  { id:'haeju',     name:'해주', col:5, row:4, owner:'namwol', value:46, development:50, threat:16, econ:19, defense:46, garrison:3, terrain:'해안', confidence:0.58, pass:true }, // strait
  { id:'sinhae',    name:'신해', col:6, row:4, owner:'namwol', value:38, development:40, threat:14, econ:14, defense:42, garrison:2, terrain:'섬',   confidence:0.50 },

  // --- neutral edges -----------------------------------------------------
  { id:'gopyeong',  name:'고평', col:3, row:0, owner:'neutral', value:36, development:26, threat:22, econ:9,  defense:28, garrison:1, terrain:'구릉', confidence:0.44 },
  { id:'dongrae',   name:'동래', col:3, row:4, owner:'neutral', value:42, development:30, threat:18, econ:11, defense:30, garrison:1, terrain:'해안', confidence:0.46 },
];

/* Sea / impassable filler hexes (drawn faint, no province data). */
const SEA_HEXES = [ {col:2,row:0}, {col:0,row:0} ];

/* Canned turn deltas. Each "다음 턴 ▶" replays one entry so the payoff loop is
 * felt as motion: development brightens, ownership flips (both ways), the power
 * bar moves, the ladder re-orders, momentum records the swing, and a conquest
 * highlights the opportunities it opens (chaining — OPEN placeholder). */
const TURN_SCRIPT = [
  {
    turn: 8,
    headline: '연천·소현 발전, 회령 병합',
    develop: [ { id:'unbong', to:58 }, { id:'sohyeon', to:82 } ],
    capture: [ { id:'hoeryeong', from:'neutral', to:'self' } ],
    power:   { self:+11, neutral:-6 },
    momentum:[ { id:'hoeryeong', dir:'gain' } ],
    opens:   [ 'daegwan', 'noha' ], // chaining highlight after taking 회령
  },
  {
    turn: 9,
    headline: '노하 정복 — 흑철 국경 붕괴, 남월이 흑철 추월',
    develop: [ { id:'hoeryeong', to:56 }, { id:'unbong', to:70 } ],
    capture: [ { id:'noha', from:'heukcheol', to:'self' } ],
    power:   { self:+14, heukcheol:-34, namwol:+6 }, // namwol overtakes heukcheol → ladder re-order
    momentum:[ { id:'noha', dir:'gain' } ],
    opens:   [ 'byeoksan', 'cheolong' ],
  },
  {
    turn: 10,
    headline: '흑철 반격 — 운봉 상실 (모멘텀은 양방향)',
    develop: [ { id:'yeoncheon', to:94 } ],
    capture: [ { id:'unbong', from:'self', to:'heukcheol' } ],
    power:   { self:-7, heukcheol:+9 },
    momentum:[ { id:'unbong', dir:'loss' } ],
    opens:   [],
  },
];
