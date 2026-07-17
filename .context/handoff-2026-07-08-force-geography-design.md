# Handoff — Force-Geography (b) design, resume at U1/U2/U4

Working-layer handoff (untracked). Resume point for the force-geography
brainstorm. Conversation voice = Korean honorific; artifacts = neutral English.

## TL;DR — where to resume

The hegemony grill this session produced: (1) the **ending-taxonomy panel**
(sealed ET-①, committed `c082247`; doc-sync `926e1a9`); (2) a data-grounded
**wall diagnosis** and the offense-dominance gate direction; (3) a three-concept
sequence, and a **force-geography (b) brainstorm** whose *skeleton is approved*.
**Next session: detail units U1, U2, U4** (U3 and U5 settled below). Then write
the (b) spec → writing-plans. Concepts **(a)** and **(c)** are debt (below).

Use the `superpowers:brainstorming` flow to resume: HARD-GATE = no code until a
design is presented and user-approved.

## The three-concept sequence (hegemony redesign)

The freeze decomposed (ET-① measurement) into two problems → three design pieces,
sequenced by the user:

1. **(b) force-geography** — make defense *uneven* (concentrate by terrain +
   choice) so defense-dominance is a real signal AND attackers find weak fronts.
   **← IN DESIGN (this handoff).** First because it rewrites the proj/shield
   distribution the gate (a) must be calibrated against.
2. **(a) offense-dominance gate** — reshape the hegemony leadership gate. DEBT.
3. **(c) risk-gate + offense buff** — reward the risk-taker, not the free-rider;
   needs blood to actually flow. DEBT.

## (b) force-geography — design state

**Goal**: defense should VARY by terrain and player choice, not sit uniform.
Two payoffs: defense-dominance becomes a legible signal (goal 1); uneven defense
means weak fronts exist → attackers break through → decisive wars, freeze eases
(goal 2). This is **real game design**, proven in L2 first (test-trust ladder:
L2 before L3 playtest); the real game code (js/) is behind.

**Governing principle — REDISTRIBUTION, not growth ("이불 한 장" / one blanket).**
A realm's total defense budget is roughly CONSERVED; concentrating it on one
front necessarily thins another → weak fronts are *guaranteed*. Growth (total
defense can rise) is rejected here because canon MEASURED that uniformly-stronger
defense (all-fortress) DEEPENS the freeze (guardrail G14). Total-defense growth
is a separate dial that may open later, paired with the offense buff (c).

**Architecture — (c)-both**: terrain sets the *envelope* (where fortifying pays
off), the player/AI *invests* within it. Five units, told as "how one realm's
defense is built":

- **U1 지형 방어 봉투 (terrain envelope, STATIC)** — terrain decides where
  fortifying pays off: a river/pass front reaches strong defense cheaply, a
  plains front caps low no matter the spend. **← DETAILED DESIGN PENDING.**
  Primary reuse hook: `startFortByClass` (map-board.js:98, dormant, the sealed
  intended seam for terrain-keyed fort tier). Open questions for the design:
  does terrain set the fort CEILING, the fort COST-efficiency, or both? which of
  point/line/area features drive it (border class is the only one wired today;
  cities are placement-only; terrainLayer is combat-inert)? GUARDRAIL G3: any
  strong terrain multiplier must ship WITH its frontage-cap door + removal path.
- **U2 방어 투자 (investment, DYNAMIC)** — allocate the CONSERVED budget across
  fronts by threat/value; today garrison = sectors×900 (uniform) → becomes a
  choice ("매드무비 수비"). **← PENDING.** Reuse: defense-commitment lever
  (exists), commit-gated regen (ADR 0027). Open: is the budget per-realm
  conserved exactly or softly? who decides (player action vs AI policy vs
  regen-flow)? GUARDRAILS G9 (empty garrison → power 0), G16 (no always-best
  posture), G15 (regen bills blood+yield).
- **U3 방어 해소 (resolution)** — **SETTLED**: the sealed 4-layer combat formula
  is UNCHANGED (`defense = garrison × lever × terrain × fort`; frontage caps the
  engaged attacker body). Force-geography only feeds NON-UNIFORM inputs (varied
  fort tier from U1, varied garrison from U2) into the existing `resolve()` /
  siege-site composition, which already read `fortAt[front]`/`frontG[front]`
  per-front (only the values are uniform today). No new resolution logic; build
  step = wire varied inputs + verify they flow into shieldMass. GUARDRAIL G1.
- **U4 약한전선 찾기 (weak-front finding, AI)** — attacker reads the now-uneven
  defense and targets the softest front (the attack window that makes wars
  decisive). **← PENDING.** Reuse: `weakestCrossing`/`CLASS_DEFENSE_RANK`
  (map-board.js:50-58, LIVE — the sealed "find the weak front" primitive) +
  `pickTarget` (which targets weakest-REALM today, not weakest-FRONT). Open: how
  much does the attacker rely on public info (terrain+fort grade, always visible)
  vs fogged info (garrison magnitude)? GUARDRAILS G8 (use reachable-weakest-link,
  don't invent a new aggregation), G12 (fort grade PUBLIC, garrison fogged).
- **U5 측정 (measurement)** — **SETTLED**: after (b), re-run the panel and add
  (i) **within-realm defense variance** — the DIRECT test of (b): does each realm
  now have thick AND thin fronts? (~0 variance = (b) failed to create weak
  fronts); (ii) **boosted-defense-power shieldShare** — measure defense-dominance
  on the fort/terrain-BOOSTED power (garrison × terrain × fort), not just raw
  garrison bodies, else U1's terrain/fort concentration is invisible to the
  dominance signal (keep raw-garrison shieldShare alongside for comparison);
  (iii) **freeze-watch** — decided% + bucket distribution must IMPROVE
  (denied-dominant + standoff DOWN, decided% UP); if they WORSEN, (b) backfired
  (G14). Success criteria: within-realm variance ↑ + defense-power shieldShare
  spread ↑ + denied-dominant/standoff ↓ + decided% ↑. Instrument = the panel
  (`match.js matchPanel`, `plan-battery.js aggregate`), built this session.

Unit boundaries are clean: U1 terrain→envelope (pure), U2 allocation (policy),
U3 sealed formula (unchanged), U4 attacker AI, U5 verification — each independently
testable.

## Canon load-bearing points (from the defense×terrain inventory)

The sealed defense equation (never change): `defense power = localGarrison ×
defenseCommitment(baseline 1) × terrain(STATIC, invariant, never degrades) ×
fortification(DYNAMIC, damageable)`; **frontage classifies** the engaged attacker
body `min(stock, cap)`, never multiplies. Four layers fixed (ADR 0022 / FORMULA
D6). **Force-geography RE-WEIGHTS these four (esp. fort-by-terrain + garrison-by-
defensibility) — never adds a fifth multiplicative defense term.**

Sealed values: terrain mult plains 1.0 / forest 1.2 / hills 1.2 / mountains 1.5 /
pass 2.0 / legendary 2.5 (M5). Fort mult none 1.0 / fieldworks 1.3 / walls 1.8 /
fortress 2.4 / legendary 3.0. Doors (frontage caps) pass 1000 / river 1000 /
forest 1500 / hills 1300(가안) / strait 500 (M11).

Currently FLAT (the target): `startFort: 'walls'` on every front (map-board.js:29);
garrison `frontG = sids.size × 900` (proportional to front SIZE, not
defensibility). Only **border class** drives defense today (via TC-⑬ →
terrain/water/choke); **terrainLayer** (area) is combat-inert (render); **cities**
(point) drive econ/placement, not a defense stat.

Guardrails a force-geography design MUST NOT violate: **G1** four-layer composition
fixed; **G2** terrain never degrades (only fort is damageable); **G3** a strong
terrain multiplier REQUIRES its frontage-cap door + removal path (pass ×2.0 is
validated only AS the residual after a cap); **G6** water is attack-side penalty
only, never a defense multiplier; **G8** reachable-weakest-link is the sealed
threat/defense aggregation; **G9** empty garrison → power 0 (substance mandatory);
**G10** parity start — asymmetry via geography, never baked demographics/defense;
**G12** fort grade is PUBLIC (fog RULINGS ①), only garrison magnitude is fogged —
so a terrain+fort dominance signal is legible by design; **G14** uniformly-stronger
defense DEEPENS the freeze (the reason (b) is redistribution, not growth); **G16**
no always-best defense posture.

Key files: `mockup/combat-calc/engine.js` (DIALS + resolve), `map-board.js`
(BOARD_GAAN, `startFortByClass:98`, `weakestCrossing:50-58`), `map-gen.js` (INTENT
classes:46, DOOR:58, sectorSpec terrainLayer:538), `tournament.js`
(`combatFromBorderClass:187`, siege site:276-285), `docs/features/combat-formula/`
(FORMULA D6/D7/D9, MAGNITUDE M5/M9/M11), `docs/features/terrain-cradle/` (TC-④/⑦/⑬).

## Concept (a) — offense-dominance gate (DEBT, do after (b))

Data from the wall grill (panel-proxy, 1680 cradle matches, current decided 11.3%):

- The user's proposed gate `leadership = proj ≥ 1.7×mean(shield)` trips **0%** —
  a cross-axis magnitude bug: offense (proj) is structurally smaller than defense
  (shield = field + garrisons), so proj/meanShield caps at 0.97 even for hegemons.
- CORRECTED like-to-like: offense-dominance `proj ≥ R×mean(proj)` discriminates
  (proj/meanProj: hegemon 2.92 / denied 2.48 / standoff 1.23). Defense axis is
  COMPRESSED (1.2–1.7, everyone walled) — a weak gate; the symmetric idea fails
  until (b) makes defense concentrate.
- `proj ≥ 2.0×meanProj` → ~39% decided, fixes 79% of denied-dominant, ~7%
  standoff leakage; R is the resolution/leakage dial. Coalition-unassailability
  barely binds (the wall was all-leadership).
- **Deeper 비약**: dominance ≠ risk — the free-rider gets above-average by AVOIDING
  risk. To reward the risk-taker (user reasoning 2-3), need a risk signal
  (decisive-battle count / blood), which needs bloodier wars (offense buff, c).
- CAVEAT: panel-proxy uses direction-free shield + end-state snapshot. Wire the
  chosen gate into `match.js hegemonyCheck` and re-run for the true DYNAMIC rate
  (a gate that trips earlier ends matches earlier, shifting end-states). And
  recalibrate against the post-(b) distribution, not this one.
- SPEC-level (패권 결정점 is sealed) → user-approved SPEC-proposal path for any change.

## Concept (c) — risk-gate + offense buff (DEBT, last)

Reward the risk-taker over the free-rider. Needs blood to flow (bloodAxis is null
today — nobody dies). Offense buff (user: "공격 커밋 효율") is the prerequisite that
(i) sharpens the dominance signal, (ii) makes wars bloody so a risk-gate has
signal, (iii) makes wars decisive. Then layer a risk-gate (decisive-battle count /
blood spent) on the dominance gate.

## Committed this session
- `c082247` feat(ending-taxonomy): the bar-independent match-ending panel +
  first finding (56% standoff / 28% denied-dominant / 11% hegemon + crown
  inversion). 148 tests green.
- `926e1a9` docs(match-arc): seal ET-① + doc-sync (RULINGS/GLOSSARY/INDEX/
  QUICKREF/SYNC-DEBT).
