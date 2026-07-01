/* ============================================================================
 * Terrain Game — situation-map mockup — DUMMY DATA aligned to the CODE model.
 * ----------------------------------------------------------------------------
 * Faithful to js/situation.js + js/domain-data.js (the canonical, ADR-0013
 * implementation), NOT to the tentative payoff-loop lens words.
 *   - unit = named province = a CLUSTER of hexes (DOMAIN_MAP `Named province`)
 *   - each province carries the REAL Phase-1 stats situation.js reads
 *   - situation type is DERIVED by classify() (a copy of classifyHex), not stored
 * ==========================================================================*/

const FACTIONS = {
  self:      { id: 'self',      name: '玄陽 · 현양', short: '현양', color: '#2dd4bf', isSelf: true },
  heukcheol: { id: 'heukcheol', name: '黑鐵 · 흑철', short: '흑철', color: '#fb7185' },
  namwol:    { id: 'namwol',    name: '南越 · 남월', short: '남월', color: '#fbbf24' },
  baeksan:   { id: 'baeksan',   name: '白山 · 백산', short: '백산', color: '#818cf8' },
  neutral:   { id: 'neutral',   name: '군소 세력',    short: '군소', color: '#64748b' },
};
const POWER = { self: 142, heukcheol: 121, namwol: 88, baeksan: 71, neutral: 34 };

/* Canonical situation vocabulary — copied verbatim from window.HIGHLIGHT_TYPES
 * (js/domain-data.js). Colors are the ADR 0013 language. */
const HIGHLIGHT_TYPES = {
  threat:      { id: 'threat',      label: '위협',      rgb: '255,70,70',   intent: 'defend_front',      proposed: true },  // in enum, NOT emitted by classifyHex yet
  opportunity: { id: 'opportunity', label: '기회',      rgb: '245,185,65',  intent: 'prepare_offensive' },
  defense:     { id: 'defense',     label: '방어 요충', rgb: '80,145,255',  intent: 'reinforce' },
  growth:      { id: 'growth',      label: '성장',      rgb: '70,210,120',  intent: 'consolidate' },
  uncertainty: { id: 'uncertainty', label: '정보 불확실', rgb: '180,90,255', intent: 'scout' },
  route:       { id: 'route',       label: '교통/보급', rgb: '230,235,255', intent: 'scout' },
};
const COMMAND_INTENTS = {
  scout: '정찰', attack: '공격', reinforce: '방어 강화', mobilize: '동원',
  prepare_offensive: '공세 준비', defend_front: '전선 방어', consolidate: '정비/복구',
};

/* Named provinces = hex clusters. Stats are the real Phase-1 scope
 * (economyValue, localGarrison, informationConfidence, strategicTags, owner).
 * The `hexes` list is [col,row] members. `note` is a plain-language stat gloss.
 * `threatProposed` marks provinces a (currently unimplemented) threat rule
 * would flag — shown only when the proposed threat lens is toggled on. */
const PROVINCES = [
  // --- self (bottom-left) ---
  { id:'yeoncheon', name:'연천', owner:'self', hexes:[[0,3],[0,4],[1,4]], economyValue:16, localGarrison:8, informationConfidence:1.00, strategicTags:[], terrain:'평야' }, // -> growth
  { id:'sohyeon',   name:'소현', owner:'self', hexes:[[1,3],[2,3],[2,4]], economyValue:9,  localGarrison:4, informationConfidence:1.00, strategicTags:[], terrain:'구릉', threatProposed:true }, // -> defense (weak garrison)
  { id:'garim',     name:'가림', owner:'self', hexes:[[0,2],[1,2],[2,2]], economyValue:8,  localGarrison:9, informationConfidence:1.00, strategicTags:[], terrain:'평야', threatProposed:true }, // -> calm (proposed threat lens surfaces it)

  // --- baeksan (top-left) ---
  { id:'seorak',    name:'서락', owner:'baeksan', hexes:[[0,0],[0,1],[1,1]], economyValue:10, localGarrison:8, informationConfidence:0.70, strategicTags:[], terrain:'산지' }, // -> calm
  { id:'cheongmun', name:'청문', owner:'baeksan', hexes:[[1,0],[2,0],[2,1]], economyValue:9,  localGarrison:7, informationConfidence:0.60, strategicTags:['pass'], terrain:'관문' }, // -> route

  // --- neutral (middle) ---
  { id:'daegwan',   name:'대관', owner:'neutral', hexes:[[3,2],[3,3],[4,2]], economyValue:15, localGarrison:5, informationConfidence:0.60, strategicTags:['pass'], terrain:'관문' }, // -> opportunity
  { id:'hoeryeong', name:'회령', owner:'neutral', hexes:[[3,0],[3,1],[4,0],[4,1]], economyValue:10, localGarrison:4, informationConfidence:0.35, strategicTags:['pass'], terrain:'관문' }, // -> uncertainty (low info wins over route)

  // --- heukcheol (top-right) ---
  { id:'cheolong',  name:'철옹', owner:'heukcheol', hexes:[[5,0],[5,1],[6,0]], economyValue:18, localGarrison:7, informationConfidence:0.55, strategicTags:[], terrain:'평야' }, // -> opportunity
  { id:'gangcheol', name:'강철', owner:'heukcheol', hexes:[[6,1],[7,0],[7,1]], economyValue:10, localGarrison:8, informationConfidence:0.60, strategicTags:[], terrain:'구릉' }, // -> calm

  // --- namwol (bottom-right) ---
  { id:'namgang',   name:'남강', owner:'namwol', hexes:[[4,3],[5,2],[5,3]], economyValue:9,  localGarrison:7, informationConfidence:0.60, strategicTags:[], terrain:'하천' }, // -> calm
  { id:'haeju',     name:'해주', owner:'namwol', hexes:[[6,2],[6,3],[7,2]], economyValue:10, localGarrison:6, informationConfidence:0.60, strategicTags:['strait_crossing'], terrain:'해안' }, // -> route
];
