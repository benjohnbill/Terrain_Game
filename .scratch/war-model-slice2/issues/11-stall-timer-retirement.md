# 11 — Stall-timer retirement: delete the fizzle driver (스톨 타이머 은퇴)

**What to build:** The physical removal of the L2 stall→white-peace timer from
`mockup/combat-calc/tournament.js`, once ticket 10's loop is the live
measurement surface. Ticket 09 built the replacement (read-driven settlement,
`js/bot-exit.js`) and carries no stall concept by construction, but the old
timer is still live in the harness: `HARNESS.stallPatience` (48), `war.stalled`
(559, incremented at 687/696/703/725/737), and the `stallPeace` exit (1346–1351).
Retiring it is **not** a mechanical delete — three sealed properties currently
ride on that code and must be re-established against the read, not dropped with
it. This ticket exists because ticket 09's deferral left the retirement with
**no owner** (spec-review verdict, 2026-07-16: "a dodge, half-defensible"), and
an unowned retirement is how a retired thing stays alive forever.

Authoritative design: slice-2 design spec §9 ("The L2 stall→white-peace timer …
is **retired**"); ADR 0038 ("The bot stall→white-peace timer is retired in favor
of read-driven settlement"); ADR 0037 §41 already flags `war.stalled` as "an
unlegislated choice that contradicts ADR 0026";
`docs/features/war-model-build/REQUIREMENTS.md` row A2 tracks the same
contradiction ("2-turn stall exit fires before the decisive battle").

**Blocked by:** 10 — Fizzle re-read (metric 5). The old harness must stop being
the live measurement surface before its exit path is deleted; until then those
wars would lose their only exit rather than gain a read-driven one.

**Status:** built — branch `war-model-slice2-ticket11` (`4b67278`), 466/466,
lint:docs clean, NOT merged (2-axis review pass 2026-07-16)

- [ ] `HARNESS.stallPatience`, `war.stalled` (init + all five increment sites),
      and the `stallPeace` exit are deleted from `tournament.js`. No stall,
      patience, near-miss, or war-length counter survives anywhere in the
      slice-2 systems.
- [ ] **CE-⑳ property re-established, not dropped.** `tests/crisis-arc.test.js`
      ("CE-⑳ overlay closes stall→white-peace once total war reaches stage 2")
      counts `warEnds` with `cause === 'stallPeace'` and asserts 0 after stage 2.
      Deleting the cause makes that test pass **vacuously** — it would count 0
      because the string no longer exists, not because the sealed property holds.
      The sealed direction (CE-⑳: "the settlement ladder breaks from the bottom
      rung up … wars end big or not at all") must be re-asserted against the new
      mechanism: no read-driven settlement may reach a broken rung after the
      overlay stage. Rewrite the test against the new exit, do not delete it.
- [ ] **`bot-exit` learns the overlay ladder.** `tournament.js availablePresets`
      (222–229) implements CE-⑳'s bottom-up breaking (stage ≥2 → `['표준','최대']`,
      stage ≥3 → `['최대']`), but `js/bot-exit.js acceptableRungs` walks the full
      sealed ladder with no overlay awareness — a wired bot court would sign
      `whitePeace` during total war, which CE-⑳ forbids. The module is pure and
      unwired, so this is a latent violation, not a live one; it becomes real at
      wiring. Give `acceptableRungs`/`decideExit` an open-rungs input (the caller
      owns the calendar, the module owns the arithmetic) and pin it with a test.
      Note the interaction with the ticket-09 invariant: **once 백지 is broken,
      "white peace is always signable" no longer holds**, so the never-empty
      guarantee dies with it — the "cannot afford any rung" branch ticket 09
      deleted as unreachable **becomes reachable**, and a court that can afford
      nothing open drags a lost war (ADR 0038, legitimately). Re-derive that
      branch here rather than resurrecting it blind.
- [ ] **The other two 0%-rung paths are dispositioned.** Retiring the stall timer
      does not retire white peace: `tournament.js` has three `returnOccupied`
      call sites — `stallPeace` (1347), `refusePeace` (1366: a lenient winner
      that will not storm thrones, `proposalStep >= 3`), and a death-forced one
      (~1026). Decide each explicitly: does `refusePeace` survive as the
      **winner's** will breaking (which `bot-exit` has no counterpart for — it
      models only the loser's), or does it join the retirement? Record the call;
      do not leave it implicit.
- [ ] Baseline honesty: the ~77% white-peace L2 baseline is a **mix** of these
      causes. Whatever ticket 10 reports must break it down by `cause` before any
      delta is attributed to this retirement — retiring the stall path alone may
      not close R14, and a headline that implies otherwise is a false verdict.
- [ ] Suite green with no vacuous passes; any re-baselined test states in-file
      what it now measures and why the old number changed.

**Doc-sync owed (same batch as the removal):**

- `docs/audits/term-inventory.json` — the *White peace* row carries
  `codeIdentifier: "stallPatience"` (3611), which becomes a dangling pointer the
  moment this lands. Its real code home is `js/bot-exit.js` `PRESETS.whitePeace`.
- Same file: *Settlement preset ladder* and *Personality coefficient* both carry
  `codeIdentifier: null` but now have code homes in `js/bot-exit.js`
  (`PRESETS` / `TEMPERAMENT`, registered English canonicals).
- `docs/features/war-model-build/REQUIREMENTS.md` row A2 — the "2-turn stall exit
  fires before the decisive battle" contradiction is what this ticket closes;
  stamp it when it does.
- ADR 0037/0038 already declare the retirement; if this ticket changes *how* it
  retires (e.g. `refusePeace` survives), that is a seal-amends-ADR duty
  (documentation-law: stamp the old ADR header with a one-line delta).

## What this ticket's own premise got wrong (recorded, not re-litigated)

**"The baseline is *recorded* … so it survives deletion" was true only while the
baseline was PROSE.** Ticket 10 rejected prose — its `fizzle.js` RE-DERIVES the
baseline by *running* `tournament.js`, precisely so the comparison target is not
a memory. So deleting the timer would have silently swapped the target: re-running
would produce a **different world's numbers** under the label "the L2 baseline",
which is the plausible-but-wrong figure metric 5 exists to prevent.

Resolution: **freeze before delete.** The re-derived baseline is snapshotted into
`mockup/operational-layer/baseline-l2.json` with its provenance + source commit
(`c30f324`) *before* the deletion. `rederiveBaseline()` still exists and is tested
to now give a DIFFERENT world — the freeze's own justification, pinned rather than
left as folklore. Better than the prose it replaces: machine-readable, and
auditable by checking out the recorded commit.

**Measured blast radius (before deleting):** only 2 tests failed — both ticket
10's own baseline tests. The other 8 tournament-touching test files were
untouched, so the L2 harness tests never depended on the stall exit's outcomes.

## Findings for the reader (evidence, not verdict)

**Retiring the timer did NOT cure the fizzle — it renamed it.** L2
post-retirement: 78.8% `stallPeace` → **72.1% of wars never reach an end at
all**. The slice-2 loop shows the same shape (metric 5's `unresolved` row). This
is the same structural fact ticket 10 found: a timer-forced white peace becomes a
war that never ends. The lever is `WINDOW_APPETITE` / the trajectory 가안 — a
separate pass, not this one.

**`refusePeace` fires 0 times post-retirement** (was 9 of 79,515). Disposition:
**SURVIVES** — see ruling WM-③ ① in `docs/features/war-model-build/RULINGS.md`.
It is not the timer (it fires only after the winner's ladder is exhausted, and
states the WINNER's will broke — a channel `js/bot-exit` has no counterpart for).
Retiring it would delete a mechanism with no replacement, which is the exact
defect this ticket exists to prevent. The gap is now REGISTERED, not hidden.

**Why not earlier (the ticket-09 argument, recorded so it is not re-litigated):**
`tournament.js` produced the sealed L2 record-world baseline and has no bot-exit
wiring, so deleting the stall path before ticket 10's loop exists would leave
those wars with no exit at all — a hole, not a retirement. What ticket 09 got
**wrong** was claiming deletion would "destroy the comparison target": the
baseline is *recorded* (~77% white-peace, 0 annihilations/match), so it survives
deletion. The real reason to wait is the missing wiring, and the real cost of
waiting was the missing owner — which this ticket fixes.
