# 07 — Fall a Capital and End the Match

**What to build:** The terminus, and with it the first end-to-end closure of the
whole loop. The capital carries a land-derived guard; defeating that guard on its
sector wins the match; nothing else names a winner; and the match stops with an
explicit victory screen. **After this ticket a complete match can be played from
setup to victory** — thin, but closed. Every later ticket thickens a terminating
game rather than an open-ended one.

**Blocked by:** nothing — 06d merged 2026-07-31 (`34d728d`). (Ticket 06 was re-cut into
06a–06d by gate C, 2026-07-26. R1 makes a capital fall an ordinary sector capture,
so the capture path is the real blocker, not the battle alone.)

Status: **resolved** (2026-08-01, branch `l3/ticket-07-capital-fall` off `2a6bf60`).
All ten acceptance items are satisfied and verified; evidence and the two-axis review's
findings are under § Comments. One follow-up is registered rather than absorbed:
`DECISIONS-OWED.md` Part 2 row **17**, the simultaneous double fall, whose refusal the
user pinned rather than answered. Prior status line, preserved:

> **claimed** (2026-08-01). The claim-time R6(ii) recompute was run **again** on
> claiming — as the header below instructs — and found a **fourth** item beneath the
> three: the guard and an ordinary border shield meeting on the same sector, on 179 of
> 840 legal capital sites. The user ruled it in the same session (capital **CP-⑦**,
> additive), so no acceptance item needed an undetermined value and the claim stood.
> See § Comments → "A fourth item, found by the second claim-time recompute". Prior
> status line, preserved because its instruction is the reason the fourth item was
> found:

> **ready-for-agent** (2026-08-01 — the third item found by R6's claim-time
> recompute is **ruled**: the guard's register backing is **realm-wide**, capital
> **CP-⑥**, and `DECISIONS-OWED.md` Part 2 row **16** is closed. No acceptance item now
> needs an undetermined value, and 06d merged on 2026-07-31 (`34d728d`), so nothing
> blocks this ticket. Recompute R6's second test at claim time anyway — this header has
> been wrong twice, most recently on 2026-07-31 in both directions on the same day. See
> § Comments → "A third item, found by the claim-time recompute" for the item's full
> history and "The third item, ruled" for the answer. This is the frontier and the loop
> closes here.)

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

- [x] Each realm has exactly one capital; its guard magnitude is land-derived from the capital sector per its sealed birthplace, with no number restated here.
- [x] The guard is an ordinary garrison class placed on the capital sector; it is **not** auto-declared a supply base and obeys the same supply predicate as any force. Its **register backing is realm-wide** (CP-⑥) — origins apportioned across the realm's held sectors exactly as `#seatSubstance` already apportions the opening field army, not drawn from the capital sector alone. Where the capital sector also carries an
ordinary border shield (179 of 840 legal sites), the two stand **together** and the
sector's local ceiling is the sum (**CP-⑦**) — a uniform rule, with no border test.
- [x] **Capital fall is an ordinary sector capture** (user ruling 2026-07-25): the capital sector transfers under the same headline-bound binary control rule as any sector, and the match ends the instant it does. There is **no** capital-specific threshold, no "overwhelming" gate, and no special predicate anywhere in this path. What makes it hard is the guard's magnitude, not an extra condition. CP-② item 5's "overwhelming decisive battle" phrasing describes the path, not an additional bar.
- [x] No other win check exists anywhere: no last-faction-standing, no percentage-of-hexes, no hegemony or decision point, no points, territory, or economy tiebreak, no draw path, no turn cap.
- [x] The Moscow-trap fall path is absent rather than approximated, and its absence is stated in the ticket's evidence rather than left to be discovered.
- [x] **Capital relocation (천도) is OUT of scope** (user ruling 2026-07-25) and is absent rather than approximated. It is a large system and a core strategic element, not wiring for an already-designed mechanism — and this build's mandate is to wire what is designed, not to introduce systems. Note for whoever reads CP-② item 4 later and wonders: relocation *is* fully specified there; its absence here is a deliberate scope call, not a design gap.
- [x] There is no early-rush floor: no rule forbids a capital falling before a given turn.
- [x] The match ends explicitly and finally with a victory screen that states who won and why play stopped.
- [x] A new match can start afterwards, resetting authoritative and interaction state.
- [x] A complete match — setup, several turns, a capital fall, the victory screen — is reproducible from `(worldId, revision, seed, ordered intent log)` in Node and browser.

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

### Blocker RESOLVED — 2026-07-31 (geography-battle grill)

**The user ruling was taken, along the second path: a defensive-ground source for
interior sectors.** An engagement is now sited wherever a hostile force stands
(**ADR 0046** item 1), and a sector's defensive terrain is its own authored terrain
(**TC-⑮**, binding the seven `terrainLayer` values onto M5's rungs). Battle-capable
sectors go from 27 of 56 to **all 56**, and a capital falls to a fight rather than to
a walk.

Two corrections to the reading above, both recorded because they change what the fix
had to be:

- **The direction was reversed.** Re-measured over all 15 legal partitions
  (30 realm-seats): **30 of 30** could enter enemy ground without standing on a single
  fightable sector; **41 of 45** authored-marker capitals were reachable with **zero
  battles**. Capitals could not be *defended*, not "not attacked".
- **The first path would not have worked.** Adjacency-derived fronts raise
  battle-capable sectors only from 27 to **33** of 56, leaving 23 interior sectors
  unfightable.

**Implementation is owed by the new ticket `06e`**, which this ticket therefore
stands on through 06d. This resolved only the reachability blocker; the other two
items are closed separately, below.

Note this was *additional* to the `needs-info` already on this ticket (the capital
guard magnitude, Part 2 #10, and CP-① item 3's staleness) — both of which closed
2026-07-31; see below.

### Both remaining needs-info items closed — 2026-07-31

**1. Capital guard magnitude (Part 2 #10) — RULED.** `capital/RULINGS.md` **CP-⑤**
re-cuts CP-① item 2's coefficient to **가안 2,500/pop** (user). The row's framing
was wrong: `MAGNITUDE.md`'s `capitalGarrison 1500` was never a seal — a
parenthetical harness inventory with no status word — and CP-① item 2 had retired
the flat 1500 by name in 2026-07-10. The live question was the coefficient's
**size**, which no register asked: at 350 the strongest guard this board can carry
is 840, below one 900-man border shield and 9.3% of the 9,000 opening field, which
makes CP-② item 7 ("larger magnitude") and item 8 (early-rush prevented because
"guard magnitude needs a big army") both false. The value is **가안** and settles
at playtest; a later change is a value change at CP-⑤, not a redesign.

**2. CP-① staleness — STAMPED, and it was two items rather than one.** CP-①'s
header now carries both. Item 3's forced-vassalage trigger is retired by ADR 0042
(the known one). **Item 1's designation rule is also stale** and nobody had recorded
it: ruling R3 (2026-07-25) made capital eligibility *ownership* — any owned sector —
while item 1 still says "one of the seat's main city sectors". This ticket reads
item 1 as authority for its first acceptance item, so the miss was load-bearing.
`DECISIONS-OWED.md` § 1.8 files this under "item 3", which is how it stayed
invisible.

**Status is therefore `ready-for-agent` on its own account** — but the `Blocked by`
line still governs: 06d must land first.

### A third item, found by the claim-time recompute — 2026-07-31

**Which register backs the capital guard?** Registered as `DECISIONS-OWED.md`
Part 2 row **16**. This is a **user ruling**, one question, and it blocks only
acceptance item 1.

CP-① item 2 (as CP-⑤ re-cuts it) calls the guard **register-backed**, and CP-⑤
lists that among the properties it leaves untouched. Since 2026-07-31 the register
is **1,800/pop stored per sector** (MT-② amended) and origin composition is per
sector (ADR 0047). The two coefficients never meet:

| capital pop | guard at 2,500/pop | that sector's own register | short by |
|---|---|---|---|
| 2.4 (board's largest) | 6,000 | 4,320 | 1,680 |
| 1.0 | 2,500 | 1,800 | 700 |
| 0.5 (weakest legal) | 1,250 | 900 | 350 |

`2500 / 1800` is a fixed **1.389**, so this is structural rather than a board
artifact: **0 of 56 sectors** can back their own guard. Seating the guard the way
06d seats a border shield — "drawn from the ground it stands on" — makes
`availableCiviliansByOrigin` throw at **every** legal capital, so the match could
not be seated at all.

**Both readings are coherent and neither is written down:**

- **(a) local backing** — the guard originates in its own sector, like every other
  garrison. Needs either a coefficient at or below `registerPerPop`, an exemption
  for the capital sector, or a rule for a shield outgrowing its own bodies.
- **(b) realm backing** — the guard's origins are apportioned across the realm's
  held sectors, exactly how `Runtime.open` already seats the opening **field** army.
  Works today, changes no value, but makes the capital guard the one garrison not
  drawn from the ground it stands on, against ADR 0047's reading.

**Why nobody was wrong.** CP-① sealed 350/pop on 2026-07-10, when origins were per
province and a province's register (1,800 × Σ pop over ~5.6 sectors) covered the
guard under either reading. CP-⑤, MT-②'s amendment and ADR 0047 all landed on
2026-07-31 from two different sessions, each correct on its own account. The
collision is visible only where they meet — which is here, and which is what a
claim-time recompute is for.

**Nothing is broken today.** `Runtime.#seatSubstance` seats no guard and says why,
now including this; the guard does not exist until this ticket builds it.

### The third item, ruled — 2026-08-01

**Realm backing** (reading (b)), sealed at **capital CP-⑥**. Row 16 is closed and
ADR 0047's header carries the amendment stamp. No value changed: the coefficient stays
가안 2,500/pop (CP-⑤), the guard stays land-derived from the capital sector, and only
the **origin apportionment** is settled. Implementation is one call: apportion the
guard's origins across the realm's remaining sector registers, the way
`#seatSubstance` already seats the opening field army.

**Reading (a) was not a live option, and the row's own numbers understated why.**
Re-measured against the emitted modules over **840** capital candidates (all 15 legal
partitions × 2 seats × every held sector) with the sealed opening derivation applied:

| quantity | value |
|---|---|
| highest coefficient a capital sector can back from its **own** register | **1,453 – 1,490** |
| coefficient CP-② item 7 requires at every legal capital | **> 1,800** |
| candidates reaching that floor | **0 of 840** |
| free realm register after shields + opening field | 37,800 – 42,300 |
| largest guard this board can carry | 6,000 |

The two constraints do not overlap, because the opening field army draws ~18% of every
sector's register first — the 1.389 ratio recorded above omitted that. `r5_s8` (pop 0.5,
a border sector) has its whole 900 register consumed by its own 900-man shield, so it
can back **no** guard locally at any coefficient. Re-measured under the alternative
reading in which the guard subsumes the capital's border shield, the ceiling is
unchanged and the count reaching 1,800 is still 0.

Derivation and rejected alternatives: **CP-⑥**. Do not re-derive them here.

### A fourth item, found by the second claim-time recompute — 2026-08-01

**Ruled the same session it was found: capital CP-⑦, additive.** Recorded because the
*finding* is the reusable part — this is the second consecutive claim-time recompute
to turn up an item the previous session's "no blockers" header had missed, and both
times the item lived where two separately-correct seals meet.

**The item.** `#seatSubstance` seats a 900-man shield on every contested-edge sector at
`open()`, and capitals are chosen afterwards, so a capital can land on a sector that
already carries one. Measured over the same 840 candidates CP-⑥ enumerated: **179
(21.3%)**, across **27** distinct sectors. `state.garrisons` holds one `GarrisonForce`
per sector, so the two are one stock mechanically — but no seal said what the **total**
is, and at the weakest legal capital the 900 is 72% of the guard.

CP-⑥ knew: it re-measured "under the alternative reading in which the guard *subsumes*
the capital's border shield" and recorded only that its own conclusion did not depend
on the answer. That is a correct scope call for CP-⑥ and leaves the question open for
whoever actually places the guard, which is this ticket.

**The ruling.** The shield and the guard stand together; the sector's local ceiling is
`GARRISON_PER_BORDER_SECTOR + guardMagnitude`. Uniform — no border test anywhere in the
implementation. Reasoning, measurement and the rejected subsumption reading: **CP-⑦**.
Do not re-derive them here.

**One consequence to carry into the evidence rather than rediscover:** CP-⑤'s "army
needed" table is computed against the guard alone, so it understates the attacker's
requirement at a border capital. That is a reading note on CP-⑤, not a value change.

### Implementation evidence — 2026-08-01

- Commit: `50488f7` (CP-⑦ + claim), `a64a7d6` (implementation), plus the review-fix
  commit that follows them on `l3/ticket-07-capital-fall`.
- Production authority: ADR 0042 (sole win condition); `capital/RULINGS.md` CP-① item 2
  as amended, CP-② items 5/7/8/9, **CP-⑤** (가안 2,500/pop), **CP-⑥** (realm-wide
  backing), **CP-⑦** (additive ceiling); ADR 0047 item 5; ADR 0014 (local ceilings);
  M13a (g₀ = 1.0, 900/border sector); ledger D3.1, D6.1a, D6.2.
- Narrow tests: `game/tests/capital-fall.test.js` **18 pass** (guard magnitude,
  siting, CP-⑦ additivity, headroom, CP-⑥ backing at `r5_s8`, the fall, play stopping,
  the non-capital capture, the 60-turn iff, the pure win check and its refusal, restart,
  reproducibility). `game/tests/browser/capital-fall.spec.js` **2 pass** (cross-host
  ending; a human decapitation through the built viewer).
- Shared gates: `npm run verify:game` → **exit 2**, every lane PASS with parity
  **PENDING by design** (gate 10 unfilled); both hosts `d50337ddf67c813b`. Node **257**
  (was 239), browser **23** (was 21), root `npm test` **562/562**, `npm run lint:docs`
  **0 blocking / 13 advisory** (was 12 — the new one is `ledger-possibly-paid` matching
  this ticket's commit against the operational-manoeuvre row, incidental and therefore
  **left standing**, which the lint's own guidance calls the correct outcome).
- Browser/runtime check: built viewer at `dist-viewer/index.html`, world
  `terrain-cradle@r1`, seed `turn-0001`, a full decapitation driven through the DOM —
  capitals picked, march, 16 chips, both locks — ending in the victory screen and a
  same-seed restart.
- Legacy evidence disposition: none used. Nothing here was ported; the guard, the win
  check and the terminal phase were built from the seals above.
- Follow-up: `DECISIONS-OWED.md` Part 2 **row 17** (simultaneous double fall, pinned
  refusal awaiting a user ruling). One deliberate out-of-scope change is recorded
  rather than hidden: `.gitignore`'s `node_modules/` lost its trailing slash, because
  the worktree convention symlinks `node_modules` and a directory-only pattern let a
  `git add -A` commit the symlink during this ticket.

**What the two-axis review caught, because it is the useful part.** Both axes found
real defects and they converged on one fix:

- **Standards** — `capture.test.js` still called `garrisonHeadroomOf` with one
  argument. The lane is JavaScript, so it returned `NaN`, and `NaN` compares false
  everywhere: the over-cap assertion passed green while testing nothing. This also
  disproved a claim written in the same change ("a required parameter makes the
  compiler move all four callers"), which is now corrected in place rather than
  quietly dropped. Also: an orphaned doc block (`#capitalGuardAt` inserted between
  `#postureSites` and its own comment), a stale `force.ts` citation, and a near-twin
  pair of guard lookups that the repo's own `capital-choice.ts` precedent says should
  be one shared pure function.
- **Spec** — the double-fall refusal **threw after both captures had already been
  applied**, leaving both capitals transferred with `outcome` null and the phase still
  `decision`, and escaping `submit()` into an uncaught React handler. Right decision,
  wrong placement.

Both are fixed by the same move: the win check became `domain/capital-fall.ts`'s pure
`capitalFallOf(captures, capitals, turn)`, called on the **decided-but-unapplied**
captures. That puts the refusal on an intact board, removes four `as ActorId` casts
off the event stream, and makes the pinned refusal a real assertion instead of a
`readFileSync` grep of the emitted bundle — which both reviewers flagged, since it
would survive the branch going dead.

The spec axis also narrowed one test re-aim: `capture.test.js` had been made to skip
the capital wholesale, which stops asserting local backing for the 900 shield standing
beside the guard. CP-⑦ says the register is untouched, so it now subtracts the guard
instead of skipping the sector.
