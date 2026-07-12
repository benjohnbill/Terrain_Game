# Crisis co-analysis session — synthesis (2026-07-13)

Working-layer record (not normative). A data-driven grill of the crisis
first-read that became a mechanism redesign and then a pivot. Landed on main
`d64d48c` (294/294, crisis-gated / crisis-off byte-identical); the crisis pass
is **PARKED** pending the war-decisiveness pass (DESIGN-RISKS R14).

## Where it started

The handoff (`/tmp/handoff-crisis-coanalysis-2026-07-12.md`) framed a dial
sweep: the first-read sat far from the CE-⑫ gates (draw 0.242 vs ≤0.001; war
density 25-35 2.51 < 15-25 4.30) and named `denialCoeff` as sweep dial #1. The
session was to grill those numbers against intent before tuning.

## What the grill actually found (the arc)

1. **The gate was mis-instrumented for intent.** `warsByTurn` counts inter-realm
   war *declarations*, never suppression battles — so "war density 25-35" could
   not see the crisis's own fighting. Reframed the two axes as (A) does the
   crisis force decision (draws → 0) and (B) is it the most war-dense phase.

2. **Conquest was being PUNISHED, not rewarded.** `acquireSector` inherited a
   taken sector's rebellion; board-global denial made conquest relieve nobody;
   secession left permanent ownerless denial. The +EV line was turtle-to-draw —
   the machine produced the opposite of intent. → historical research
   (`research/2026-07-12-crisis-conquest-relief-...md`): conquest-relieves-crisis
   is grounded only under conditions; **rebel-absorption** (Cao Cao 192, Qing
   1644) is the well-attested pattern; Parker's general-crisis is the honest
   counter (simultaneous collapse → synchronized breakdown, i.e. draws).

3. **User's design refinements (the load-bearing turns).**
   - Not voluntary absorption (needs a new-dynasty narrative the 戰國 board lacks)
     but **subtraction**: conquering a regime scatters its rebellion's target.
   - Precisely: conquest disperses the *standing uprising* (rebelStack), while
     scar (land memory) + the usable floor are inherited → the sector
     re-mobilizes under the new owner's intensity (the deferred bill). Direction
     sealed as CE-㉑ conquest-pacification.
   - The lens to keep: **risk-vs-reward as layered judgment** — expanding seeds
     scar (measured: most-scarred realm is the early expander 77% of the time,
     corr 0.585), and handling that revolt is a further judgment. Not
     snowball-punishment; accumulated situational judgments.

4. **Rebellion was a "whisper" — a scale break, not a size dial.** grow was
   usable-scale (~0.002/turn) while the cap was population-scale (register
   share ~thousands) — spoon filling a pool. `0 × K = 0`: a pure-scar seed can
   never reach universal cataclysm. → **RESHAPE**: `grow = (unrestBase0 +
   unrestStep·(t−onset) + scarGain·scar) × registerShare`. Additive baseline =
   the universal shock (theme: war-era exhaustion, Parker; SPEC "blood is a
   permanent currency"); scar = amplifier, not seed. Rebellion reached army
   scale (rebelDead 0.13 → 6,336/match).

5. **Six mechanics, all inert except one.** Scaling rebellion up *raised* draws
   (0.242 → 0.369) — because army-scale rebellion exploded the board-global
   denial term that applies to everyone. shield-drain (CE-⑩ deduct) was built
   then **reverted** (symmetric → paralysed all defence, punished defensive
   investment). siege-drag (CE-㉒) + crisis-aware bot targeting: inert —
   rebellion concentrates on the strong expander, bots attack the weak, they
   never meet. Only **self-denial** moved the needle.

6. **self-denial (CE-⑦ reframe) — the one live lever.** Make crown-denial a
   realm's OWN revolt (`selfDenialFrac` 1.0) not the board-global mass.
   Board-global made suppression a public good nobody paid for. **Draw 0.369 →
   0.200**, trip-solo 137 → 188 (same seed, denial channel only). Homework, not
   punishment: your fire blocks your crown; suppressing it restores the claim.

## The pivot (why the pass is parked)

The tripTurn curve refused to move in the sweet-spot: every crisis dial is
causally confined to turns ≥26 (onset 25), and every denial dial is a *brake*
(cranking converts late-trips to draws, never to faster decisive resolution;
elim flat 3-5 throughout). The crisis never produced a decisive military
climax.

**The probe that reframed everything (→ R14).** Crisis-OFF, the MAIN ARC:
**ZERO annihilations/match**, ~77% of wars fizzle via stall→white-peace,
decided% 0.656 is hegemony-gate trip (force ratios) not conquest climax. The
SPEC madmovie (shield-break → decisive battle → cascade) does not fire — crisis
or not. So the draw/spectacle/timing problem is UPSTREAM in the war system; the
crisis is a termination *backstop*, not the spectacle. The user's own read:
"it was a match-termination tool, and the 10-turn arc blurred that essence."

**Bot caveat (honest bound):** L2 bots stall/settle where a skilled player might
force annihilation. So this proves the *default* is fizzle, not that decisive
war is unreachable by skill. Confirming that needs L3 (playtest) or a
war-appetite grill.

## State at close

- **Landed (main `d64d48c`):** growth reshape + self-denial (the value);
  CE-㉑/⑳/㉒ crisis-gated dormant scaffolding (inert at seed dials, right-signed,
  byte-identical off); warEnds instrument. Crisis dials all 가안.
- **DEBT:** R14 (war-system yields no decisive climax) — the real next lever.
  R13 updated. Seal-sync of the reshape/self-denial amendments DEFERRED
  (SYNC-DEBT) — the pass is parked, premature to final-seal.
- **NOT done / open:** the CE-⑫ gates remain unmet (draw 0.200 vs ≤0.001, war
  density 25-35 < 15-25, elim flat). These are now understood as R14-blocked,
  not crisis-dial-tunable.

## Next session options (user, not yet decided)

1. **R14 war-decisiveness pass** (recommended) — grill the stall→white-peace
   fizzle + bot war-appetite: should decisive wars be the *default* outcome
   rather than a rarity a player forces? Measure elim/cascade share. This is
   where the SPEC dopamine actually lives.
2. Then revisit the crisis as a lean backstop (possibly the simpler
   turn-30 sudden-death / 이민족 framing from AB-③, instead of the 10-turn arc).
3. The tripTurn curve shape (18-22 peak, thin tail — DT-①) is a pre-crisis /
   war-system lever, folded into R14.

Pointers: match-arc INDEX (crisis co-analysis paragraph), RULINGS CE-④…㉒ /
CE-⑦, DESIGN-RISKS R14/R13, SYNC-DEBT (parked row + deferred seal-sync),
research 2026-07-12, commit `d64d48c`.
