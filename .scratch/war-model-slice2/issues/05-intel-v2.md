# 05 — Intel v2: reach cones, fatigue bands, border alarm (정보 v2)

**What to build:** The sealed estimate-band information system extends to the
operational layer. Enemy fatigue joins substance as a fogged attribute: a
true-containing estimate band that scouting narrows and the aging rule
re-widens per unobserved turn. Enemy detachment positions become last-seen
fixes plus a deterministic reach cone growing by speed per unobserved turn
and collapsing back to a fix on observation — the legal input of the pinning
read. A free border alarm fires whenever any force enters one's border zone,
conveying existence and heading only (threat-ladder shape, 가안 depth): no
undetected invasion exists — deep strikes hide scale and state, never
existence. Bots see exactly what a player sees.

Authoritative design: slice-2 design spec §6; aging per the sealed Aging
constitution P3 (consume, do not re-legislate).

**Blocked by:** 02 — Movement contract.

**Status:** landed (pure helpers; game.js wiring deferred to ticket 08 per the
pure-calculator precedent). 2-axis review passed, 365/365 green.

- [x] Fatigue band: always contains the true value; narrows on
      reconnaissance contact; re-widens per unobserved turn.
      → `detachmentBand` over the sealed `estimateRange`; the record's
      confidence clock (`observeDetachment`/`ageDetachment`) drives width.
- [x] Reach cone: grows by speed per unobserved turn, resets to a fix on
      observation; deterministic given the observation history.
      → `reachCone` (bounded BFS, radius = turns × speed, sorted output).
- [x] Border alarm: fires on every border-zone entry, never misses, reveals
      existence + heading only. → `borderAlarm`.
- [x] Symmetry: the bot-facing API and player-facing values are identical.
      → pure functions, no viewer/faction argument (structurally unbreakable).

**Open implementation rulings (flagged in code, doc-sync to RULINGS/SYNC-DEBT
deferred to the slice-2 doc batch — same pattern as tickets 02/03/04):**
- Border-alarm bandwidth = existence + heading ONLY; §6's "~five-step
  threat-ladder" 가안 intentionally NOT built (a threat magnitude reveals scale,
  contradicting the hide-scale seal). Revisit if a coarse non-scale indicator is
  wanted.
- "Never misses" is a contract on `isBorderZone`: it must be an inclusive
  frontier region, not a thin ring (entry judged at turn endpoints; a ring
  thinner than one turn's speed could be leapt). Wiring (ticket 08) must honor
  this.
- Reach cone takes speed as a caller param (movement owns the dial); intel.js
  stays graph/speed-agnostic. intel.js made isomorphic (UMD) to match the sibling
  war-model modules and load under Node `require`.
