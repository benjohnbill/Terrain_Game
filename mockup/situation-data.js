/* ============================================================================
 * Terrain Game — situation-map mockup v2 — DUMMY DATA for the ADR 0019 model.
 * ----------------------------------------------------------------------------
 * Faithful to ADR 0019 "Situation Judgment":
 *   - unit = named province = a CLUSTER of hexes; adjacency is COMPUTED, not stored
 *   - the axis (위협/기회/불확실) is DERIVED in situation-map.js from raw stats,
 *     relationally (adjacency + estimated force + information confidence)
 *   - posture is a lens over invariant truth; 판세 (standing) is aggregate
 * Raw stats only here. Enemy/neutral provinces carry an estimated force + its
 * confidence (fog). Owned provinces carry a weakest-link garrison.
 * ==========================================================================*/

const FACTIONS = {
  self:      { id: 'self',      name: '玄陽 · 현양', short: '현양', color: '#2dd4bf', isSelf: true },
  heukcheol: { id: 'heukcheol', name: '黑鐵 · 흑철', short: '흑철', color: '#fb7185' },
  namwol:    { id: 'namwol',    name: '南越 · 남월', short: '남월', color: '#fbbf24' },
  baeksan:   { id: 'baeksan',   name: '白山 · 백산', short: '백산', color: '#818cf8' },
  neutral:   { id: 'neutral',   name: '군소 세력',   short: '군소', color: '#64748b' },
};
const POWER = { self: 142, heukcheol: 121, namwol: 88, baeksan: 71, neutral: 34 };

/* Located situation axes (ADR 0019). 판세 is aggregate (not a located axis);
 * growth folds into 판세 (owned development glow, green); route folds into
 * reachability. Colors are the ADR 0013 language. */
const AXES = {
  threat:      { id: 'threat',      label: '위협',   rgb: '255,70,70',  intent: 'reinforce',         glyph: '▲' },
  opportunity: { id: 'opportunity', label: '기회',   rgb: '245,185,65', intent: 'prepare_offensive', glyph: '◆' },
  uncertainty: { id: 'uncertainty', label: '불확실', rgb: '180,90,255', intent: 'scout',             glyph: '?' },
};
const GROWTH_RGB = '70,210,120';   // 판세 development glow (owned + high economy)
const INTENTS = { reinforce: '방어 강화', prepare_offensive: '공세 준비', scout: '정찰', consolidate: '정비/복구' };

/* Fog knowledge states (fog-of-war-discovery slice-1, A2 military-cartographic
 * visual language). Derived in situation-map.js from ownership + confidence:
 *   owned      — your province: crisp counter, exact garrison meter
 *   reliable   — scouted foe (estForceConfidence >= RELIABLE): crisp, exact meter
 *   glimpse    — border foe, low info: dim counter, FADED estimate-range band, recon
 *   undiscovered — occupant unseen (`discovered:false`): murk wash, no counter, '?'
 * Fog IS the 불확실 axis: low-confidence border foes route to 불확실; scouting
 * raises confidence (-> MAX 0.90), which re-runs classify -> the axis resolves.
 * Terrain stays visible under murk (position fog, not full fog). */
const MAX_CONFIDENCE = 0.90;   // ADR 0019 oracle ceiling — a scout can never make it certain

/* Postures = the player's stance. In this (A) model a posture does NOT re-rank
 * the reading — the truth (all surfaced tensions) is shown in full, posture-
 * invariant. A posture only sets which axis the game leans toward RECOMMENDING
 * for the turn's single action (ADR 0011: "which actions become easier to
 * prioritize"). `prefer: null` = recommend the raw most-pressing tension.
 * Skill = overriding the recommendation when the board disagrees; the dissonance
 * signal warns when the recommendation is not the turn's most pressing tension. */
const POSTURES = {
  balanced:  { id: 'balanced',  label: '균형',     prefer: null },
  offensive: { id: 'offensive', label: '공세',     prefer: 'opportunity' },
  defensive: { id: 'defensive', label: '방어',     prefer: 'threat' },
  recon:     { id: 'recon',     label: '정찰 중시', prefer: 'uncertainty' },
};

/* Named provinces = hex clusters. `hexes` are [col,row] members (flat-top, odd-q).
 * Owned: weakestGarrison (weakest-link defense), minConfidence 1.00 (you own it).
 * Foe (enemy/neutral): estForce + estForceConfidence (fog), minConfidence. */
const PROVINCES = [
  // --- self (현양) : bottom-left ---
  { id: 'yeoncheon', name: '연천', owner: 'self', hexes: [[0, 4], [1, 4], [0, 3]], economyValue: 16, weakestGarrison: 8, minConfidence: 1.00, terrain: '평야' }, // developed core -> 판세 glow
  { id: 'garim',     name: '가림', owner: 'self', hexes: [[0, 2], [1, 2], [1, 1]], economyValue: 8,  weakestGarrison: 9, minConfidence: 1.00, terrain: '평야' }, // solid -> calm
  { id: 'sohyeon',   name: '소현', owner: 'self', hexes: [[1, 3], [2, 3], [2, 4]], economyValue: 9,  weakestGarrison: 4, minConfidence: 1.00, terrain: '구릉', // WEAK border, faces 철옹 -> 위협
    // Front sectors (front-sector drill v4, hero-only path). One sector per hex —
    // sector identity is SPATIAL (ADR 0022). defense = garrison + terrain + fort
    // (collapsed at drill level; the card unpacks the four layers). economy
    // sum 2+1+6 = 9 = province economyValue; 남부's garrison 4 = province
    // weakestGarrison under the reachable-weakest-link rule (this turn 철옹
    // reaches only 남부). value chip is the stake that creates the weighing.
    // All magnitudes illustrative (mockup charter: grammar probe, not balance).
    sectors: [
      { id: 'sec-south', name: '남부 전선', hex: [2, 4], garrison: 4, terrain: 3, fort: 2, value: 2, faces: 'cheolong', star: true }, // threat entry; ★ reachable weakest link; def 9 = card base
      { id: 'sec-pass',  name: '북령 고개', hex: [2, 3], garrison: 2, terrain: 5, fort: 0, value: 1, route: '대관' },                   // pass toward 대관 (route rule demo) def 7
      { id: 'sec-gran',  name: '서안 곡창', hex: [1, 3], garrison: 3, terrain: 0, fort: 0, value: 6 },                                  // soft rich rear ("naked granary") — the stake, def 3
    ] },

  // --- baeksan (백산) : top-left ---
  { id: 'seorak',    name: '서락', owner: 'baeksan', hexes: [[0, 0]],          economyValue: 7, estForce: 6, estForceConfidence: 0.70, minConfidence: 0.70, terrain: '산지' }, // not reachable -> calm
  { id: 'cheongmun', name: '청문', owner: 'baeksan', hexes: [[1, 0], [2, 0]],  economyValue: 9, estForce: 12, estForceConfidence: 0.12, minConfidence: 0.12, discovered: false, terrain: '관문' }, // UNDISCOVERED border (murk) hiding force 12 -> 불확실; scout reveals a THREAT to 가림(수비 9)

  // --- heukcheol (흑철) : right ---
  { id: 'cheolong',  name: '철옹', owner: 'heukcheol', hexes: [[3, 3], [4, 3], [4, 2]], economyValue: 18, estForce: 14, estForceConfidence: 0.75, minConfidence: 0.75, terrain: '평야' }, // strong+known -> threat DRIVER (calm badge; drives 소현 위협)
  { id: 'gangcheol', name: '강철', owner: 'heukcheol', hexes: [[5, 2], [5, 3], [5, 4]], economyValue: 10, estForce: 10, estForceConfidence: 0.60, minConfidence: 0.60, terrain: '구릉' }, // backline, not reachable -> calm

  // --- neutral (군소) : middle ---
  { id: 'daegwan',   name: '대관', owner: 'neutral', hexes: [[2, 2], [3, 2], [3, 1]], economyValue: 15, estForce: 5, estForceConfidence: 0.65, minConfidence: 0.65, terrain: '관문' }, // rich, reachable, we outmatch -> 기회
  { id: 'hoeryeong', name: '회령', owner: 'neutral', hexes: [[2, 1], [3, 0]],         economyValue: 14, estForce: 4, estForceConfidence: 0.30, minConfidence: 0.30, terrain: '관문' }, // GLIMPSED border blind spot -> 불확실; scout narrows the band and reveals a 기회 (rich, reachable, we outmatch)

  // --- namwol (남월) : bottom-right ---
  { id: 'namgang',   name: '남강', owner: 'namwol', hexes: [[3, 4], [4, 4], [5, 4]], economyValue: 13, estForce: 3, estForceConfidence: 0.55, minConfidence: 0.55, terrain: '하천' }, // reachable, slim edge -> 기회
  { id: 'haeju',     name: '해주', owner: 'namwol', hexes: [[6, 2], [6, 3]],         economyValue: 10, estForce: 8, estForceConfidence: 0.60, minConfidence: 0.60, terrain: '해안' }, // not reachable -> calm
];
