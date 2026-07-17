# 09 — Bot exit, C2: read-driven settlement (봇 종전)

**What to build:** Retire the stall→white-peace timer (the measured driver of
the 77% white-peace fizzle). A bot court now decides to stop fighting the way
a rational court would: when the window read reports (i) no window of its
own anywhere, (ii) windows open against it, and (iii) a degrading trajectory
(fatigue, land, army), it accepts the settlement rung appropriate to its
position on the sealed acceptance ladder — executing the will path of the
war-ending composite (ADR 0038). Surrendering with the army intact is
legitimate; dragging a lost war remains possible and self-punishing. This is
bot policy only: a war is never force-closed over a human player.

Authoritative design: slice-2 design spec §9; settlement arithmetic is a
port of the sealed acceptance ladder (reuse, not redesign).

**Blocked by:** 08 — Window read.

**Status:** LANDED (branch `war-model-slice2-ticket08-09`, pure module —
harness wiring lands with ticket 10's compose; see the boundary below)

- [x] A bot in a losing position (no windows, windows against, falling
      trajectory) accepts a rung matched to its position — not always white
      peace. → `decideExit` walks the ported sealed ladder; a desperate court
      (capital in reach, decisive margin) signs 최대, a mild loss only the cheap
      rungs. Tests pin the rung MOVING with the position.
- [x] A bot in a contested or winning position fights on.
      → `position.losing` is spec §9's conjunction of all three conditions; a
      live counter-punch or a stable line returns `fight-on`.
- [~] **PARTIAL — the second half is done, the first is NOT.** "No code path
      force-closes a war over a human": DONE, and hardened — CE-⑲ is an explicit
      FAIL-CLOSED first gate (only `isHuman === false` earns the bot path; a
      malformed court reads as human). "The old stall timer is removed": **NOT
      DONE.** The new module carries no stall/patience/timer/counter concept by
      construction (tested), but `war.stalled` + `HARNESS.stallPatience` are
      still live in `mockup/combat-calc/tournament.js`. **This item needs a user
      decision — see "Boundary" below. The spec reviewer's verdict on my
      deferral was "a dodge, half-defensible" and it is largely right.**
- [x] Bot doctrine holds: optimal calculation within disposition and
      confidence-band constraints — no calculation handicap. → the court reads
      its own state exactly (D1) and the enemy through the same λ-judged bands a
      player gets; the only personality knobs are disposition (λ, via the
      ticket-08 read) and temperament (완고/실리/유화, the sealed acceptance
      coefficients). No blunder dial, no omniscience.

## Close-out

**Implementation:** `js/bot-exit.js` (pure UMD module) + `tests/bot-exit.test.js`
(16 tests). Full suite 406/406. The settlement arithmetic is a PORT of the
sealed 수락 산술 (birthplace = match-arc 정산 / RULINGS ⑧⑬⑲, mechanized in
`mockup/combat-calc/match.js`) — `js/` never imports the mockup, so the formulas
are ported with a birthplace citation and no re-cutting, the same convention by
which `battle.js` ports the MAGNITUDE dials. **Three port-fidelity tests assert
the port equals `match.js` exactly** on every rung, margin, and capital state —
a re-cut at the birthplace fails these tests loudly rather than drifting.

**CE-⑲ hardened from luck to rule.** The existing harness satisfied "never
force-close over a human" only structurally — `tournament.js` is bot-vs-bot and
has no human concept at all. This module makes it an explicit first gate
(`court.isHuman` → `{settle:false, reason:'human-court', position:null}`, the
read never even runs), so the wiring ticket cannot inherit the guarantee by
accident into a game where humans exist.

### Two findings the tests forced (both from the sealed arithmetic, not the port)

1. **White peace is ALWAYS signable, so bot drag is not an acceptance-arithmetic
   outcome.** `accepts(0, L, coeff)` is `0 ≤ L × coeff`, true for every
   non-negative expected loss — whitePeace's bundle costs nothing. A first draft
   carried a `drags-lost-war` branch; it was unreachable dead code and was
   deleted. This is *why* the sealed winner-side walk in `trySettle` is
   `['최대','표준','관대']` with **백지 absent** — a winner never proposes claiming
   nothing, so the 0% rung is only ever reached from the loser's side or by a
   harness exit. This module reads the LOSER's side, where white peace is free by
   construction. Drag stays where ADR 0038 actually puts it: a human court (the
   CE-⑲ gate) and a court that withholds its army from the field.
   *(Both reviewers independently verified the algebra. **Correction:** my first
   draft of this note claimed the stall timer was "the ONLY path that ever
   reached the 0% rung." That is **false** — `tournament.js` has three
   `returnOccupied` call sites: `stallPeace` (1347), `refusePeace` (1366 — a
   lenient winner that won't storm thrones), and a death-forced one (~1026). The
   spec reviewer caught it and I verified it directly. The consequence matters:
   the ~77% white-peace baseline is a **mix**, so retiring the stall timer alone
   may not close R14 — ticket 10 should break the baseline down by `cause` before
   attributing any delta. This module models only the loser's will breaking; the
   **winner's** will breaking (`refusePeace`) has no counterpart here.)*
2. **Rung naming had to stay honest for metric 5.** A bundle's value is
   `composite × claimRate` exactly, so value rises strictly with the rung and
   "highest signable" IS the top rung — *except* when the sword has reached
   nothing (composite 0), where all four rungs are the same empty bundle and
   "highest signable" would name 최대. That would report a claim of nothing as a
   maximal claim and poison ticket 10's settlement-rung distribution. The rule is
   now: among signable rungs, take the max value, and name the LEAST-claiming
   rung achieving it (the tie-break only fires in the degenerate case).

**Flagged for ticket-10 measurement (metric 5):** a court that reads itself
losing *before* the enemy sword has reached anything signs 백지 — a **pre-emptive
white peace**. It is individually rational (quit before losing land) but it is
also a white-peace source, and metric 5 counts white-peace %. If the re-read
shows the fizzle surviving in this shape, the lever is the `OWN_WINDOW_APPETITE`
/ trajectory 가안 (how early a court calls itself beaten), never the sealed
acceptance arithmetic.

### Boundary: where the stall timer physically dies — OPEN, needs a user call

The `war.stalled` counter + `HARNESS.stallPatience` live in
`mockup/combat-calc/tournament.js`. I deferred their removal to ticket 10 and
checked the acceptance item off. **The spec reviewer's verdict: "a dodge,
half-defensible." That is largely right, and the item is now un-checked.**

My argument (still standing): not touching a sealed, measured harness mid-slice
is legitimate — `tournament.js` produced the L2 record-world baseline, and it has
no bot-exit wiring, so deleting the stall path there would leave those wars with
no exit at all rather than a read-driven one. That is not a retirement, it is a
hole.

The reviewer's counter (which I accept):
1. Ticket 10 compares against the **recorded** baseline ("~77% white-peace, 0
   annihilations/match" — already written down), so deleting the timer cannot
   "destroy the comparison target" as I claimed. That reasoning was wrong.
2. Ticket 10 builds a **new** loop, which has no timer by construction — so the
   timer never "dies as a measured delta"; it would just sit orphaned in a mockup.
3. Ticket 10's four acceptance items never mention removing it. **So the
   retirement currently has no owner** — which is exactly how a "retired" thing
   stays alive forever.

**RESOLVED (user, 2026-07-16): option (a) — a named follow-up owner.** Filed as
**ticket 11 — Stall-timer retirement** (`11-stall-timer-retirement.md`), blocked
by ticket 10. It deletes `war.stalled` / `stallPatience` / the `stallPeace` exit
from `tournament.js` once ticket 10's loop is the live measurement surface, and
carries the three sealed properties that currently ride on that code (below).
The retirement now has an owner, which was the reviewer's real point.

**Scope note:** vassalage (RULINGS ⑭ — priced in acceptance currency) is
deliberately NOT in this walk. Spec §9 says the court "accepts the appropriate
B3 settlement rung", and B3 is the preset ladder; vassalage is the WINNER's
demand when a throne is in reach (`trySettle`'s chain-seeker path), not the
losing court's own read. It belongs to the wiring ticket that owns both sides of
the table. (Both reviewers confirmed this scope call: ruling ⑭ "vassalage is
priced in acceptance currency, never reach currency" + ruling ⑧ "Vassalage is NOT
a Maximum replacement"; ADR 0038 puts vassalization under channel 2, not the
channel-3 will path this ticket builds.)

## Review fixes applied (2-axis)

Standards axis: port fidelity PASS (verified dial-by-dial against `match.js`);
2 hard violations + 3 judgement calls. Spec axis: close-out claims (a), (b), (d)
independently VERIFIED; 5 findings. All applied:

1. **Korean code identifiers → registered English canonicals** (hard,
   documentation-law Vocabulary Law: "canonical identifier = industry-standard
   English, matching code identifiers"; the 표시어 is a display VALUE, never a
   key — cf. `domain-data.js` `{ id: 'command', label: '지휘력' }`).
   `term-inventory.json` already registers them: *Settlement preset ladder*
   aliases lenient/standard/maximum, *White peace* is its own term, *Personality
   coefficient* aliases hardliner/pragmatic/conciliatory. `PRESETS[rung].label`
   now carries the 표시어 and is the single seam where the port meets the
   birthplace's Korean keys.
2. **Unknown-enum guard** (hard): `expectedContinuedLoss` silently NaN'd on a bad
   `margin` → every rung rejected → `acceptableRungs` returned `[]`, contradicting
   the documented never-empty invariant and dying as a `TypeError` frames away.
   Now a named throw (`battle.js` convention). Tested.
3. **CE-⑲ failed OPEN** (spec, real safety bug): `cfg.court && cfg.court.isHuman`
   treated `{}` or a missing flag as a bot — i.e. force-closable. Now FAIL-CLOSED
   (only `isHuman === false` earns the bot path). The failure is asymmetric:
   wrongly declining to settle a bot war costs a turn; wrongly force-closing a
   human's war destroys the agency the seal exists to protect. My "hardened from
   luck to rule" claim was overstated until this fix; now it holds. Tested across
   `undefined`/`null`/`{}`/missing-flag.
4. **`rung` → `ceiling`** (spec: "max-signable rung selection is redesign, not
   port"). Correct catch. The sealed walk has the WINNER propose from its
   archetype preset and concede one step per turn (`proposalStep`; ruling ⑧
   "claim rate = rejection risk"); naming the loser's affordability ceiling as
   *the* settled rung skews metric 5 high (a court that can afford everything
   reads as `maximum` regardless of the winner's demand). The field is now
   `ceiling`, the whole `signable` set is exposed, and the header states the
   settled rung = the winner's demand capped by the ceiling — resolved by the
   wiring ticket that owns both sides.
5. **`OWN_WINDOW_APPETITE` → `WINDOW_APPETITE`** (both axes): the "OWN" name lied
   — one dial gates both §9 (i) and (ii), so tuning "how eager I am" silently
   moved "how threatened I am". Renamed, with the header stating the shared gate
   is deliberate (one question asked twice; a court judging its own chances by a
   different bar than the enemy's would be reading with a handicap — bot doctrine
   §9) and distinguishing it from window-read's `APPETITE_THRESHOLD` (the
   peacetime declaration bar).
6. Also: `PRESETS` deep-frozen (was shallow — `PRESETS.백지.claimRate = 0.99`
   stuck, letting a consumer re-cut a sealed dial at runtime), and the
   `W` → `WindowRead` handle renamed to match sibling modules.

**Doc-sync debt (for the user's next batch, not touched here to avoid conflicting
with the parallel session; also carried by ticket 11's doc-sync list):**
`term-inventory.json`'s *White peace* row carries `codeIdentifier: "stallPatience"`
— `js/bot-exit.js`'s `PRESETS.whitePeace` is now a second code home, and the row
becomes a dangling pointer once ticket 11 lands. *Settlement preset ladder* and
*Personality coefficient* both have `codeIdentifier: null` and now have real code
homes (`PRESETS` / `TEMPERAMENT`).

### Known gap found while scoping ticket 11: bot-exit is overlay-blind (CE-⑳)

`tournament.js availablePresets` implements CE-⑳'s bottom-up ladder breaking
(stage ≥2 → `['표준','최대']`, stage ≥3 → `['최대']`), but `acceptableRungs` here
walks the full sealed ladder with no overlay awareness — a wired bot court would
sign `whitePeace` during total war, which CE-⑳ forbids. **Latent, not live**: the
module is pure and unwired, so it violates nothing yet; it binds at wiring.
Assigned to **ticket 11** (which touches exactly this code) rather than patched
speculatively here.

It also carries a real consequence for finding ① above: **once 백지 is broken by
the overlay, "white peace is always signable" stops holding**, and the
`drags-lost-war` branch deleted here as unreachable **becomes reachable** — a
court that can afford no open rung drags a lost war, legitimately (ADR 0038).
Ticket 11 re-derives that branch rather than resurrecting it blind.
