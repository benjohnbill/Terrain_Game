# 07 — Fall a Capital and End the Match

**What to build:** The terminus, and with it the first end-to-end closure of the
whole loop. The capital carries a land-derived guard; defeating that guard on its
sector wins the match; nothing else names a winner; and the match stops with an
explicit victory screen. **After this ticket a complete match can be played from
setup to victory** — thin, but closed. Every later ticket thickens a terminating
game rather than an open-ended one.

**Blocked by:** 06d — Capture a Sector and Integrate It. (Ticket 06 was re-cut into
06a–06d by gate C, 2026-07-26. R1 makes a capital fall an ordinary sector capture,
so the capture path is the real blocker, not the battle alone.)

Status: needs-info

Specification gates: Wayfinder 10, 12.

Contract (interim pointers): ADR 0042 (capital fall is the sole win condition);
`docs/features/capital/RULINGS.md` CP-② — item 1 (location public), item 3
(forward/rear duty cycle), item 4 (천도 relocation, old seat stays the target
until relocation completes), item 5 path (a) (overwhelming decisive battle),
item 6 (siege is emergent, no siege object or timer), item 7 (guard is an
ordinary garrison class at larger magnitude, **no special supply rule** — the
capital can be encircled), item 8 (early-rush defense is purely emergent, no
hard floor), item 9 (bypass allowed and self-limiting → mutual exposure);
CP-④ amendment (a rump state is impossible because the match ends the instant
the capital falls); duel-pivot ledger D6.4.

**Scope boundary set by gate 08.** The supported fall path is **overwhelming
decisive battle only**. The Moscow-trap path — encircle, cut supply, starve the
guard down, finish — is **deferred to a later slice**, together with the
capital-terrain and encirclement dynamics that the parallel map pass tunes. The
supply predicate must still admit encirclement in principle (item 7); what is
deferred is the fall path built on it, not the vulnerability.

- [ ] Each realm has exactly one capital; its guard magnitude is land-derived from the capital sector per its sealed birthplace, with no number restated here.
- [ ] The guard is an ordinary garrison class placed on the capital sector; it is **not** auto-declared a supply base and obeys the same supply predicate as any force.
- [ ] **Capital fall is an ordinary sector capture** (user ruling 2026-07-25): the capital sector transfers under the same headline-bound binary control rule as any sector, and the match ends the instant it does. There is **no** capital-specific threshold, no "overwhelming" gate, and no special predicate anywhere in this path. What makes it hard is the guard's magnitude, not an extra condition. CP-② item 5's "overwhelming decisive battle" phrasing describes the path, not an additional bar.
- [ ] No other win check exists anywhere: no last-faction-standing, no percentage-of-hexes, no hegemony or decision point, no points, territory, or economy tiebreak, no draw path, no turn cap.
- [ ] The Moscow-trap fall path is absent rather than approximated, and its absence is stated in the ticket's evidence rather than left to be discovered.
- [ ] **Capital relocation (천도) is OUT of scope** (user ruling 2026-07-25) and is absent rather than approximated. It is a large system and a core strategic element, not wiring for an already-designed mechanism — and this build's mandate is to wire what is designed, not to introduce systems. Note for whoever reads CP-② item 4 later and wonders: relocation *is* fully specified there; its absence here is a deliberate scope call, not a design gap.
- [ ] There is no early-rush floor: no rule forbids a capital falling before a given turn.
- [ ] The match ends explicitly and finally with a victory screen that states who won and why play stopped.
- [ ] A new match can start afterwards, resetting authoritative and interaction state.
- [ ] A complete match — setup, several turns, a capital fall, the victory screen — is reproducible from `(worldId, revision, seed, ordered intent log)` in Node and browser.

## Comments

### Blocker surfaced by ticket 06c — 2026-07-28

**A capital cannot be attacked in a majority of matches**, so this ticket cannot
close the loop as written. Measured on `terrain-cradle@r1`:

- A front is an **authored region border** (`contestedFronts` walks the artifact's
  17 edges), and 06c can only site an engagement on a front sector — because TC-⑬
  keys the defensive ground to the *door*, and no seal maps a sector's hex
  `terrainLayer` onto M5's five rungs, so interior ground has no multiplier to be
  fought over.
- Those 17 edges have **27 distinct endpoint sectors** out of 56, so **29 sectors
  can never be a battle site**; over 40 drawn partitions, **44 of 80 capitals were
  not endpoint sectors**. A player would not site a capital on a border by choice.
- Capturing a border sector does not open the interior: the edge list is frozen
  content, so the front set shifts among 17 edges and never grows inward.
- ADR 0043 item 7's graph is hex adjacency ∪ the authored edges, so an army *can*
  walk into that interior — it simply meets nothing there.

R1 makes a capital fall an ordinary sector capture, so this is upstream of every
acceptance item here. Closing it means either **adjacency-derived fronts** or a
**defensive-ground source for interior sectors**, and the latter is exactly the
unsealed `terrainLayer` → M5 mapping — both kind 1/3 under the README's four-kind
workflow. **A user ruling is owed before this ticket is claimed.** Registered in
`docs/SYNC-DEBT.md`; evidence in ticket 06c § Comments.

Note this is *additional* to the `needs-info` already on this ticket (the capital
guard magnitude, Part 2 #10, and CP-① item 3's staleness).
