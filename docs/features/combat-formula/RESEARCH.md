# Research: Combat-Balancing Formula

## Survey Digests (2026-07-03)

Full reports in `research/`; only load-bearing conclusions here.

✅ **Real-war OR survey** (`research/real-war-multipliers.md`): D8 ordering
SUPPORTED with three amendments. Commitment lever ×1.0–2.0 saturating
(anchors: Dupuy complete-surprise ×2.24 — his largest own-side factor;
measured combat-effectiveness peaks ~×2.0, Israel 1973); typical band
×1.1–1.5. Terrain ×1.0–2.5; fortification ×1.3 hasty → ×2.0–3.0 fortress;
legendary combined stacks (Diaoyucheng: terrain × fort × self-sufficient
logistics) reach effective ×4–6. Quality ×0.8–2.0 continuous, plus
**discrete tech-tier steps**: a one-tier siege-tech jump collapses
fortification near-instantly (Xiangyang held 5 years, fell within ~1 month
of counterweight trebuchets). **Frontage is a cap, not a multiplier** —
`effective attackers = min(committed, frontage capacity)`, unbounded impact
(Thermopylae ~15 m front; Myeongnyang strait capped 120+ ships to a
handful), and its historical failure mode is *deletion* (the Anopaea path),
not attrition. **Enemy command collapse is a cliff**: near-binary "combat
ineffective" in a fuzzy 20–40% casualty band — no smooth sub-baseline
lever exists. Empirical Lanchester exponent ~1.3–1.5 (square law
overpredicts); the 3:1 rule is a gradient (only 10/68 decisive 20th-century
victors reached 3:1) → headline thresholds below 3.0, margin buys
casualties. Determinism: 5 of 6 studied upsets decompose fully without
randomness; the sixth's contingency (Möngke's death) is a discrete
commander event, never noisy combat math.

✅ **Wargame conventions survey**
(`research/wargame-multiplier-conventions.md`): hypothesis CONFIRMED as
genre law — no surveyed game lets per-turn input outweigh world-state
defense; HOI4's doctrine-stacked planning (~+110%) is the exception and is
community-flagged as degenerate (the cautionary tale). Static defensive
stacks: ×2–3 good position, ×4 named fortress; above ×4 only in rare
explicitly-counterable edge stacks. Per-turn levers across the genre:
×1.1–1.5; recommend lever knee ~×1.5 with ×1.75–2.0 as expensive/decaying
full commitment. **Key adjustment: terrain × fortification PRODUCT wants a
cap ~×4** (or sub-multiplicative composition) — naive ×9 exceeds
everything in the genre. Fortification-damageable is unanimous genre law.
Upset bounding: no game lets a 10:1 material disadvantage *win* via
multipliers; small forces *hold* via frontage throttles (HOI4 combat
width, EU4 width, one-unit-per-tile) — Thermopylae is always a width
mechanic. Design steal: UoC/Civ6 log-space trick — player-facing additive
integer shifts (+1 terrain, +2 fort), engine multiplies ~×1.4 per step.
Fully deterministic resolution is rarer than reputed; low-luck classics
keep a small noise band for texture — our graded-margin bands supply that
texture instead (D1 stands).

⚠️ Caveat: the HOI4 and EU4 sections are knowledge-based (their research
sub-agents died) and marked approximate in the file — re-verify against
the Paradox wikis before citing them in a spec.

## Cross-Survey Synthesis

Independent convergence on every structural point:

1. Lever ≤ ×2 and saturating — OR ceiling and genre practice agree; the
   curve's top is expensive/decaying territory, a natural home for the
   deferred overclock/emergency-mobilization system (ADR 0018/0020).
2. The world outweighs the turn — confirmed as both history and genre law.
3. Frontage caps, never multiplies; counter is removal (D9).
4. Fortification damageable — unanimous.
5. Enemy collapse is a threshold state, not a dial (D10).
6. Technology acts as discrete steps that void specific terms.
7. Determinism holds; margin bands replace noise as texture.
8. Casualty curve input secured: exponent band 1.3–1.5; thresholds < 3.0.

## Stacking Analysis — how far can the same substance stretch? (2026-07-03)

MVP terms (quality = 1), effective power per body of substance:

- Attack ceiling: ×2.0 (lever cap).
- Defense ceiling: ×8 standard (lever 2.0 × world product cap 4.0); ×12 at
  authored legendary sites (world ×6).
- Same-substance ratio span: R from ~0.125 (idle attack vs fully stacked
  defense) to ~2.0 (full attack vs naked defense) — a ~×16 swing produced
  by conditions alone, before quality exists.

Concrete: a fully stacked 1,000-man fortress reads as ~8,000 effective. At
a plan threshold of ~2.0, storming it frontally needs on the order of
8,000–13,000 committed substance (lever 2.0 vs 1.2) — history's verdict
(you siege or bypass, you don't storm) emerges from the numbers, and the
sane alternatives are exactly our authored counters: erode (Deliberate
Pressure), bypass (Flanking), cut supply (Interdiction), tech step.

Frontage changes the answer's *class*: with engageable cap C, attack
effective ≤ 2C regardless of army size — a tight-enough choke sector is
frontally unwinnable until the cap is *deleted* (bypass path, timing/tide,
tech), not attrited.

Representability verdicts (the user's question 3):

- **Myeongnyang-class**: representable, deterministically. Requires the
  confluence: authored choke sector (frontage) + defender at lever ceiling
  + terrain + an attacker who engages anyway (tendency/fog error). Rarity
  is governed by authored choke scarcity × max-commit cost × AI tendency —
  all player-legible conditions, no dice.
- **Southern Song holds (Xiangyang/Diaoyucheng)**: representable as
  long-hold states — legendary world stack + supply self-sufficiency
  (immune to the starvation rule). The hold *ends* exactly through our
  authored counters: a tech step, a supply cut, or a rare event-layer
  trigger (the Möngke pattern is event scope per D1's rider).
- **Afghan-guerrilla-class**: representable through plan grammar, not
  through R — refuse/raid/abandonment bargains (Delaying Defense, Raid,
  Strategic Abandonment) against an occupier bleeding on standing rules.
  The definition of guerrilla war is never fighting the headline battle.

## Open

- Casualty curve shape (ladder 5) — exponent band 1.3–1.5 in hand.
- Log-space presentation trick (additive player-facing steps over a
  multiplicative engine) — candidate for the forecast card; decide at the
  command-card IA session.
