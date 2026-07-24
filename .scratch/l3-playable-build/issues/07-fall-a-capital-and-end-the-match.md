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
- [ ] Defeating the full guard on the capital sector through a decisive battle ends the match immediately with that attacker as the winner.
- [ ] No other win check exists anywhere: no last-faction-standing, no percentage-of-hexes, no hegemony or decision point, no points, territory, or economy tiebreak, no draw path, no turn cap.
- [ ] The Moscow-trap fall path is absent rather than approximated, and its absence is stated in the ticket's evidence rather than left to be discovered.
- [ ] Relocation, if built here, keeps the old capital as both win target and shield until relocation completes, does not strip the guard, does not cede the old province, and drains 행동력 across turns per CP-② item 4; otherwise it is explicitly out of scope for this ticket.
- [ ] There is no early-rush floor: no rule forbids a capital falling before a given turn.
- [ ] The match ends explicitly and finally with a victory screen that states who won and why play stopped.
- [ ] A new match can start afterwards, resetting authoritative and interaction state.
- [ ] A complete match — setup, several turns, a capital fall, the victory screen — is reproducible from `(worldId, revision, seed, ordered intent log)` in Node and browser.
