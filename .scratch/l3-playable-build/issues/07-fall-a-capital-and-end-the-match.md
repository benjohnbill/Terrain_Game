# 07 — Fall a Capital and End the Match

**What to build:** The terminus, and with it the first end-to-end closure of the
whole loop. The capital carries a land-derived guard; defeating that guard on its
sector wins the match; nothing else names a winner; and the match stops with an
explicit victory screen. **After this ticket a complete match can be played from
setup to victory** — thin, but closed. Every later ticket thickens a terminating
game rather than an open-ended one.

**Blocked by:** 06 — Resolve the Decisive-Battle Core.

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
