# Match-Arc Glossary (opened 2026-07-03)

The single reference for every term used in match-arc and
victory-condition design — the layer above battle resolution. Resolution
vocabulary lives in `docs/features/combat-formula/GLOSSARY.md`; terms
confirmed here are later promoted to `DOMAIN_MAP.md`.

Method (inherited from the combat-formula pass): natural-language
definitions are fixed before any numbers are authored. Status per term:
**AGREED** (user-confirmed wording) or **PROPOSED** (draft awaiting
grill).

## Frame decisions recorded this pass

- **Full adjacency, no neutral zones** (AGREED 2026-07-03): every realm
  starts bordering its neighbors; the map is fully partitioned from
  turn 1. There is no exploration/expansion-into-empty-land opening —
  the 30–40 minute envelope has no room for it, and the pressure engine
  (uncertainty duel, ADR 0025) needs live neighbors immediately.
- **Match arc as design budget** (AGREED 2026-07-03): buildup costs,
  war length (8–12 turns), and the hegemony threshold are tuned so one
  player's hand fights ~2–3 wars per match; the match ends at the
  hegemony decision point (settlement concluded). This is a tuning
  target, never a mechanical cap — no rule forbids a fourth war; the
  arithmetic prices it out of the envelope.
- **Realm count 4–6, authoring default 5** (AGREED 2026-07-03): the
  partition is decided by authored terrain cradles (basin, shielded
  valley, plain, coast), and 4–6 is the verification condition on how
  many viable cradles the active region holds — not an imposed cut.
- **Viability parity, mass/geometry asymmetry** (AGREED direction
  2026-07-03, supersedes "near-parity start"): what is balanced is
  survivability, not mass. The map is multipolar Warring-States /
  Three-Kingdoms shaped with one "small 중원": a richer central realm
  that pays in multi-front exposure; periphery realms are smaller but
  shielded and coalition-capable. Whoever takes the center inherits its
  exposure (anti-snowball loop). No realm can be one-war-killed from
  turn 1 without buildup (~1.7+ shield mass ratio is the sizing tool);
  values → scenario battery. The authored asymmetry is the arc's
  opening-move generator: invasion/negotiation frames are designed
  behavior, seeded by the start state.
- **Mature-state start** (PROPOSED direction): realms begin as
  functioning states — fortresses already standing at historical
  chokes, armies raised. A from-zero development opening would spend
  the whole envelope on construction (a legendary fortress alone costs
  ~a third of a match, M5).

## The arc ladder

```
교전 (engagement)   one click, one turn          — resolution layer (combat GLOSSARY)
작전 (operation)    shield-break, siege: 3–6 turns
전쟁 (war)          declaration → settlement: ~8–12 turns
매치 (match)        pre-war standoff → hegemony settlement: 15–25 turns / 30–40 min
```

## Terms

| Term (한국어) | Definition | Status |
|---|---|---|
| 매치 (match) | One complete game. Wall-clock 30–40 minutes (binding target, SPEC); ~15–25 turns (derived estimate). Spans the opening standoff to the hegemony settlement. A match, not a campaign (ADR 0017/0025 positioning). | PROPOSED |
| 매치 아크 (match arc) | The phase curve a match traverses: standoff → buildup → first war → realignment → deciding war → decision point → settlement. One player's hand fights ~2–3 wars per match (design budget, see frame decisions); the world runs more in parallel. | **AGREED** (2026-07-03) |
| 전쟁 (war) | A connected bundle of engagements from declaration to settlement. A war is *decided* by field-army destruction (shield-break → decisive battle → cascade), never by grinding occupation to completion. | PROPOSED |
| 방패 깨기 (shield-break) | The opening operation of a war: reducing the border fortification line that shields a realm's interior (erosion or bypass). The pre-war mass ratio at the shield largely decides the war — the buildup turns are part of the war. | PROPOSED |
| 결전 (decisive battle) | The field engagement that destroys the defender's field army once the shield is open. After it, the interior cascades. | PROPOSED |
| 캐스케이드 (cascade) | The post-decision sweep: ordinary sectors fall in one-turn takes against garrison-only defense. The victory lap that makes winning *felt* — ending grammar must not amputate it. | PROPOSED |
| 결정점 (decision point) | The first moment the irreversibility check opens **settlement negotiation**. The system detects that no remaining realm or coalition can realistically overturn the balance (R arithmetic over remaining mass); the ending itself is a *player decision* — the winner chooses accept-terms or press-on, the loser chooses capitulate or fight-on. The match ends when the hegemony settlement is concluded, not when the math first tips. (Operational definition of SPEC's "matches end at decision points.") | **AGREED** (2026-07-03) |
| 패권 결정점 (hegemony decision point) | The match-ending decision point: the judgment that one realm's position is no longer contestable by any remaining combination. Grammar AGREED (the match ends here, via settlement); threshold values → scenario battery (must be unreachable from the authored start in a single war). | **AGREED** as grammar (2026-07-03); values open |
| 정산 (settlement) | The procedure converting a decided war into territory, vassalage, and indemnity **without** occupation grinding. Annexation arrives through settlement, not through sector-by-sector conquest. | PROPOSED |
| 복속 (capitulation) | A settlement outcome: the losing realm survives diminished, counted on the loser's side of the hegemony judgment. The loser-side decision point — choosing capitulation over a fight to the capital — must be the losing player's own decision (surrender grammar). | PROPOSED |
| 블라인드 (blinds) | The escalation device that makes safe, passive play progressively more expensive as the match ages — the anti-safe-play pressure ADR 0025 parked into this thread. Mechanism undecided. | PROPOSED |

## Open questions (grill queue)

1. ~~Realm count per match~~ — resolved: 4–6, default 5 (frame decisions).
2. Full-runtime fun audit: one-nation (mostly victorious) turn-by-turn
   timeline over 25 turns with wall-clock conversion — does the
   realignment stretch between wars hold decision density?
3. Irreversibility check details: inputs (mass, shields, coalitions?),
   visibility to players, and whether the check is advisory or gating.
4. Settlement term menu (what the winner may demand; what capitulation
   preserves).
5. Blinds mechanism.
6. Loser-side experience between "decided" and "settled."
7. Terrain-cradle partition authoring (which cradle archetypes, center
   sizing so it is rich but not Ming-grade dominant).
