# 08 — Project Standard Fog and Price Reconnaissance

**What to build:** Thicken the Runtime's single blur seam from the migration-grade
projection into Standard Fog, and make reconnaissance a real purchase that walks
the confidence ladder. The land and everything derived from it is published; only
the mutable draw on it is fogged.

**Blocked by:** 07 — Fall a Capital and End the Match.

Status: needs-info

Specification gates: Wayfinder 03 (resolved), 10, 12.

Contract (interim pointers): gate 03 § Answer (what each viewer may know — the
seven-grade matrix, the seven non-leak invariants, the dead `[0, 0.45)`
confidence interval); `docs/features/fog-of-war-discovery/RULINGS.md` ① (wall
grade is public) and ② (read-layer presentation contract, sealed on the gate-07
live eval); gate 07 § Answer (three reading layers — free ambient, paid band
sharpening, inviolable hole cards; detection versus measurement; border alarm as
a free inner ring; defensive UI mirrors the offensive one); capital CP-② item 1
(capital location is public, guard strength is fogged); duel-pivot ledger Gate 6
(irreducible width = the enemy's this-turn hidden commit).

**Reconnaissance is designed — read the spec before treating any of it as open.**
`docs/superpowers/specs/2026-07-23-gate07-turn-loop-prototype.md` (user stories
19–22) specifies the mechanism: basic reconnaissance spends commit to narrow a
sector's band **one rung along the 0.45 → 0.70 → 0.90 ladder** and, for a tracked
army, fixes its position; the scouted sector's force reading visibly brightens
while its hole cards stay dark; recon also reads the target's derived 동원 강도
band; **instant reconnaissance (즉시 정찰)** is a distinct, commit-consuming
action (facade-only in the prototype, to be wired here).

**Pricing grammar — user ruling 2026-07-25: linear in commit, freely allocated.**
Reconnaissance is not an action with a fixed cost. Each recon **grade** carries a
per-sector **unit price**, and the player pours commit from the single stack;
what they pour converts linearly into how many sectors they scout.

| Grade | Unit price | Effect |
|---|---|---|
| normal | 2 per sector | narrows the band one rung along 0.45 → 0.70 → 0.90 |
| enhanced | 6 per sector | takes the sector straight to confidence 0.90 |

So 6 commit buys three normal scouts; 12 buys two enhanced ones. 즉시/강화 정찰
stops being a separate action and becomes a grade — which also dissolves the
graduated-versus-flat question that the candidate record contradicted itself on.
Recon is defined as visiting a target sector and acquiring the information
**immediately that turn**.

**These unit prices are 가안 and have never been written in the repository** —
they must be sealed at the fog birthplace before this ticket is implemented, not
carried as conversation. The mechanism above is designed; the numbers are not
sealed. The same linear-commit grammar governs fortification, recruitment, and
supply (see `DECISIONS-OWED.md` R2); their unit numbers are unset by design.

- [ ] The projection publishes terrain, fortification, routes, current political control, land value and yield, and the register pool; it publishes **no** treasury figure, **no** enemy posture, and **no** enemy commitment.
- [ ] Enemy substance and fatigue appear only as bands; enemy field-army position appears as last-seen plus a reach cone.
- [ ] Every one of the seven non-leak invariants holds, and forbidden truth is **absent** from projections, previews, events, secondary panels, and renderer inputs — not visually concealed.
- [ ] The dead `[0, 0.45)` confidence interval is unreachable by construction.
- [ ] Preview is a pure function of `(view, candidate intent)` with no path to authoritative truth, and the same preview module serves the human UI and, later, the bot.
- [ ] Border alarm gives the defender a free existence-and-direction warning inside its own ring, with paid response remaining a separate purchase.
- [ ] A reconnaissance order spends 행동력 from the same single chip stack and visibly narrows the estimate band, changes the situation reading when warranted, and changes the next preview.
- [ ] The shown band always contains the truth: reconnaissance buys precision and never displays a band excluding the true value.
- [ ] Successive scouts behave as noisy witnesses — the band centre wobbles while the width shrinks — rather than as a monotonic zoom onto a fixed point.
- [ ] The enemy's current-turn commitment remains unscoutable and is resolved only at the reveal.
- [ ] The defensive reading surface mirrors the offensive one rather than being a separate one-off panel.
- [ ] Any development-grade disclosure introduced during migration is removed here; the completed path exposes no hidden true state to React or the renderer.
